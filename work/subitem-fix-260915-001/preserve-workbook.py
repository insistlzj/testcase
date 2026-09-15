"""Package artifact-authored subitem cells without losing existing Excel controls."""
import copy
import hashlib
import json
from pathlib import Path
import re
import xml.etree.ElementTree as ET
import zipfile

repair = Path('work/subitem-fix-260915-001')
task = Path('work/liveshow-user-260915-001/user')
source = Path('outputs/Luma Live-case/阶段性-用户App-全部模块-260915-002.xlsx')
output = repair / 'preserved.xlsx'
read = lambda p: json.loads(p.read_text())
digest = lambda data: hashlib.sha256(data).hexdigest()
revision = read(repair / 'revision-check.json')
original = read(repair / 'before' / task / 'final-testcases.json')
final = read(task / 'final-testcases.json')
verification = read(repair / 'before' / task / 'delivery-verification.json')
assert digest(source.read_bytes()) == verification['工作簿SHA256']
assert digest((task / 'final-testcases.json').read_bytes()) == revision['候选SHA256']
ns = {'s': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
tag = lambda name: '{' + ns['s'] + '}' + name
ET.register_namespace('', ns['s'])

def cells(archive, name):
    strings = []
    if 'xl/sharedStrings.xml' in archive.namelist():
        strings = [''.join(x.itertext()) for x in ET.fromstring(archive.read('xl/sharedStrings.xml'))]
    result = {}
    for cell in ET.fromstring(archive.read(name)).findall('.//s:c', ns):
        value = cell.find('s:v', ns)
        text = value.text if value is not None else ''
        if cell.get('t') == 's':
            text = strings[int(text)]
        elif cell.get('t') == 'inlineStr':
            text = ''.join(cell.find('s:is', ns).itertext())
        result[cell.get('r')] = (text or '', cell)
    return result

sheet = 'xl/worksheets/sheet2.xml'
with zipfile.ZipFile(source) as src, zipfile.ZipFile(repair / 'authored.xlsx') as authored:
    # Artifact import/export loses outlinePr on the pending sheet. Preserve all
    # original package members and change only the cells explicitly authored.
    original_cells, authored_cells = cells(src, sheet), cells(authored, sheet)
    xml = src.read(sheet).decode('utf8')
    changes = {}
    for i, (old, new) in enumerate(zip(original['测试用例'], final['测试用例']), 2):
        assert old['用例编号'] == new['用例编号']
        assert original_cells[f'B{i}'][0] == old['用例编号']
        assert original_cells[f'H{i}'][0] == old['验证用例子项']
        assert authored_cells[f'H{i}'][0] == new['验证用例子项']
        if old['验证用例子项'] == new['验证用例子项']:
            continue
        address = f'H{i}'
        cell = copy.deepcopy(original_cells[address][1])
        for child in list(cell):
            cell.remove(child)
        cell.set('t', 'inlineStr')
        ET.SubElement(ET.SubElement(cell, tag('is')), tag('t')).text = authored_cells[address][0]
        replacement = ET.tostring(cell, encoding='unicode')
        pattern = rf'<(?:\w+:)?c\b(?=[^>]*\br="{address}")[^>]*>.*?</(?:\w+:)?c>'
        matches = list(re.finditer(pattern, xml, re.S))
        assert len(matches) == 1, address
        changes[address] = (matches[0].group(), replacement)
        xml = re.sub(pattern, lambda _: replacement, xml, count=1, flags=re.S)
    assert len(changes) == revision['修改条数']
    title_sheet = 'xl/worksheets/sheet1.xml'
    title_xml = src.read(title_sheet).decode('utf8')
    title_text = cells(authored, title_sheet)['A1'][0]
    assert title_text == '阶段性-用户App-全部模块-260915-003 产品决策概览'
    title_pattern = r'<(?:\w+:)?c\b(?=[^>]*\br="A1")[^>]*>.*?</(?:\w+:)?c>'
    title_before = re.search(title_pattern, title_xml, re.S).group()
    title_cell = copy.deepcopy(cells(src, title_sheet)['A1'][1])
    for child in list(title_cell):
        title_cell.remove(child)
    title_cell.set('t', 'inlineStr')
    ET.SubElement(ET.SubElement(title_cell, tag('is')), tag('t')).text = title_text
    title_after = ET.tostring(title_cell, encoding='unicode')
    title_xml = title_xml.replace(title_before, title_after, 1)
    with zipfile.ZipFile(output, 'w', zipfile.ZIP_DEFLATED) as out:
        for info in src.infolist():
            data = xml.encode('utf8') if info.filename == sheet else title_xml.encode('utf8') if info.filename == title_sheet else src.read(info.filename)
            out.writestr(copy.copy(info), data)
    with zipfile.ZipFile(output) as check:
        assert check.testzip() is None
        assert check.namelist() == src.namelist()
        for name in src.namelist():
            if name not in (sheet,title_sheet):
                assert check.read(name) == src.read(name), name
        assert check.read(title_sheet).decode('utf8').replace(title_after,title_before,1).encode('utf8') == src.read(title_sheet)
        restored = check.read(sheet).decode('utf8')
        for before, after in changes.values():
            assert after in restored
            restored = restored.replace(after, before, 1)
        assert restored.encode('utf8') == src.read(sheet), '子项单元格外发生变化'
        result = cells(check, sheet)
        headers = [result[f'{chr(65+c)}1'][0] for c in range(15)]
        for i, case in enumerate(final['测试用例'], 2):
            for col, key in enumerate(headers):
                value = case[key]
                if isinstance(value, list):
                    value = value[0] if key == '预期结果' and len(value) == 1 else '\n'.join(f'{n}. {v}' for n, v in enumerate(value, 1))
                assert result.get(f'{chr(65+col)}{i}', ('',))[0] == str(value), (case['用例编号'], key)

report = {'状态': '通过', '检查范围': '本次子项修订，不替代新批次上游同步或完整覆盖校验',
          '导出用途': '阶段性', '修改子项单元格数': len(changes), '概览版本标题更新数': 1, '其他单元格及格式变化数': 0,
          '其他包成员逐字节一致': True, 'Excel与最终JSON逐格一致': True,
          '保留': ['三张工作表', '原有公式', '数据验证', '冻结', '筛选', '父子行折叠', '样式'],
          '候选SHA256': revision['候选SHA256'], '工作簿SHA256': digest(output.read_bytes()),
          '原工作簿SHA256': verification['工作簿SHA256'], '待确认数': len(final['需求待确认']),
          '用例数': len(final['测试用例']), '文件完整性': '通过'}
(repair / 'workbook-revision-check.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(report, ensure_ascii=False))
