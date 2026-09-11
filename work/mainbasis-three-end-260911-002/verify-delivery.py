"""Read-only XLSX archive, cached formula, schema and JSON consistency check."""
import hashlib
import json
from pathlib import Path
import zipfile
import xml.etree.ElementTree as ET

task = Path(__file__).resolve().parent
ns = {'s': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
outputs = json.loads((task / 'excel-outputs.json').read_text())
records = []

def col_name(n):
    result = ''
    while n:
        n, remainder = divmod(n - 1, 26)
        result = chr(65 + remainder) + result
    return result

def display(value, name=''):
    if name == '预期结果':
        return value[0]
    if isinstance(value, list):
        return '\n'.join(f'{chr(65+i) if name == "可选方案" else i+1}. {item}' for i, item in enumerate(value))
    return str(value) if value is not None else ''

for item in outputs:
    folder = {'用户App': 'user', '公会App': 'guild', '管理后台': 'admin'}[item['端']]
    source = json.loads((task / folder / 'final.json').read_text())
    with zipfile.ZipFile(item['输出文件']) as book:
        assert book.testzip() is None, 'ZIP损坏'
        workbook = ET.fromstring(book.read('xl/workbook.xml'))
        names = [s.get('name') for s in workbook.findall('s:sheets/s:sheet', ns)]
        assert names == ['产品决策概览', '功能测试用例', '需求待确认'], names
        active = workbook.find('s:bookViews/s:workbookView', ns)
        assert active is None or active.get('activeTab', '0') == '0'
        shared = []
        if 'xl/sharedStrings.xml' in book.namelist():
            for value in ET.fromstring(book.read('xl/sharedStrings.xml')).findall('s:si', ns):
                shared.append(''.join(t.text or '' for t in value.iterfind('.//s:t', ns)))
        sheets = [ET.fromstring(book.read(f'xl/worksheets/sheet{i}.xml')) for i in (1, 2, 3)]
        cells = []
        for sheet in sheets:
            values = {}
            for c in sheet.findall('.//s:sheetData/s:row/s:c', ns):
                assert c.get('t') != 'e', f'Excel公式错误 {c.get("r")}'
                v = c.find('s:v', ns)
                text = v.text or '' if v is not None else ''
                if c.get('t') == 's':
                    text = shared[int(text)]
                elif c.get('t') == 'inlineStr':
                    text = ''.join(t.text or '' for t in c.iterfind('.//s:t', ns))
                values[c.get('r')] = text
            cells.append(values)
        checked = 0
        for index, key, columns in [(1, '测试用例', 15), (2, '需求待确认', 20)]:
            rows = source[key]
            headers = list(rows[0])
            assert len(headers) == columns
            for c, title in enumerate(headers, 1):
                assert cells[index].get(f'{col_name(c)}1', '') == title
            for r, row in enumerate(rows, 2):
                for c, name in enumerate(headers, 1):
                    assert cells[index].get(f'{col_name(c)}{r}', '') == display(row[name], name), (folder, r, name)
                    checked += 1
            pane = sheets[index].find('s:sheetViews/s:sheetView/s:pane', ns)
            assert pane is not None and float(pane.get('ySplit', '0')) == 1
            if index == 2:
                assert float(pane.get('xSplit', '0')) == 3
            assert sheets[index].find('s:tableParts', ns) is not None
            validations = sheets[index].find('s:dataValidations', ns)
            assert validations is not None and len(validations) >= (3 if index == 1 else 5)
            for row in sheets[index].findall('s:sheetData/s:row', ns):
                assert float(row.get('ht', '15')) <= 409
        pending = source['需求待确认']
        overview = {'B5': len(pending), 'B6': sum(p['确认状态'] == '待确认' for p in pending),
                    'B7': sum(p['确认状态'] == '待前置结论' for p in pending), 'B8': sum(p['确认状态'] == '确认中' for p in pending), 'B9': sum(p['确认状态'] == '已确认' for p in pending), 'B10': sum(p['确认状态'] == '无需处理' for p in pending)}
        for address, expected in overview.items():
            cell = sheets[0].find(f'.//s:c[@r="{address}"]', ns)
            assert cell.find('s:f', ns) is not None
            assert float(cells[0][address]) == expected, (folder, address, expected, cells[0].get(address))
        assert all(c['测试结果'] == '未测' and c['测试人员'] == '' for c in source['测试用例'])
        assert all(p['产品结论'] == '' and p['结论补充'] == '' for p in pending)
        records.append({'端': item['端'], '校验单元格': checked, '用例数': len(source['测试用例']),
                        '待确认数': len(pending), 'SHA256': hashlib.sha256(Path(item['输出文件']).read_bytes()).hexdigest(),
                        '结果': '通过'})
print(json.dumps(records, ensure_ascii=False, indent=2))
