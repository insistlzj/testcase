"""Add required outline/freeze formatting to this task's new workbook only."""
import copy
import hashlib
import json
import os
from pathlib import Path
import sys
import tempfile
import xml.etree.ElementTree as ET
import zipfile

task = Path(__file__).resolve().parent
target = Path(sys.argv[1]).resolve()
assert target.parent == task / 'stage-exports' and target.name.startswith('阶段性-')
report = json.loads((task / 'delivery-verification.json').read_text())
digest = lambda b: hashlib.sha256(b).hexdigest()
assert digest(target.read_bytes()) == report['工作簿SHA256']
candidate = json.loads((task / 'final-testcases.json').read_text())
assert digest((task / 'final-testcases.json').read_bytes()) == report['候选SHA256']
ns = {'s': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
tag = lambda x: '{' + ns['s'] + '}' + x
ET.register_namespace('', ns['s'])
with zipfile.ZipFile(target) as src:
    entries = {n: src.read(n) for n in src.namelist()}
sheet_name = 'xl/worksheets/sheet3.xml'
sheet = ET.fromstring(entries[sheet_name])
cells = lambda root: [(c.get('r'), c.get('t'), [(e.tag, e.text) for e in c.iter() if e is not c]) for c in root.findall('.//s:c', ns)]
original_cells = cells(sheet)
pane = sheet.find('s:sheetViews/s:sheetView/s:pane', ns)
assert pane is not None
pane.attrib.update(xSplit='3', ySplit='1', topLeftCell='D2', activePane='bottomRight', state='frozen')
prop = sheet.find('s:sheetPr', ns)
if prop is None:
    prop = ET.Element(tag('sheetPr'))
    sheet.insert(0, prop)
outline = prop.find('s:outlinePr', ns)
if outline is None:
    outline = ET.SubElement(prop, tag('outlinePr'))
outline.attrib.update(summaryBelow='0', showOutlineSymbols='1')
sheet.find('s:sheetFormatPr', ns).set('outlineLevelRow', '1')
rows = {int(r.get('r')): r for r in sheet.findall('s:sheetData/s:row', ns)}
questions = candidate['需求待确认']
positions = {q['问题编号']: i + 2 for i, q in enumerate(questions)}
styles = ET.fromstring(entries['xl/styles.xml'])
formats = styles.find('s:cellXfs', ns)
indented = {}
children = []
for q in questions:
    if not q['父问题编号']:
        continue
    number, parent = positions[q['问题编号']], positions[q['父问题编号']]
    assert parent < number
    children.append(number)
    rows[number].attrib.update(outlineLevel='1', hidden='1')
    rows[parent].set('collapsed', '1')
    for cell in rows[number].findall('s:c', ns):
        if not cell.get('r').startswith(('A', 'D')):
            continue
        original = int(cell.get('s', '0'))
        if original not in indented:
            style = copy.deepcopy(formats[original])
            alignment = style.find('s:alignment', ns)
            if alignment is None:
                alignment = ET.SubElement(style, tag('alignment'))
            alignment.attrib.update(indent='1', horizontal='left')
            style.set('applyAlignment', '1')
            indented[original] = len(formats)
            formats.append(style)
        cell.set('s', str(indented[original]))
formats.set('count', str(len(formats)))
assert cells(sheet) == original_cells, 'Formatting must not change question values or formulas'
entries[sheet_name] = ET.tostring(sheet, encoding='utf-8', xml_declaration=True)
entries['xl/styles.xml'] = ET.tostring(styles, encoding='utf-8', xml_declaration=True)
with tempfile.NamedTemporaryFile(dir=target.parent, suffix='.xlsx', delete=False) as tmp:
    temp = Path(tmp.name)
try:
    with zipfile.ZipFile(temp, 'w', zipfile.ZIP_DEFLATED) as out:
        for name, data in entries.items():
            out.writestr(name, data)
    with zipfile.ZipFile(temp) as check:
        assert check.testzip() is None
        actual = ET.fromstring(check.read(sheet_name))
        assert cells(actual) == original_cells
        assert all(actual.find(f"s:sheetData/s:row[@r='{n}']", ns).get('hidden') == '1' for n in children)
    os.replace(temp, target)
finally:
    temp.unlink(missing_ok=True)
report.update(工作簿SHA256=digest(target.read_bytes()),分级显示={'子问题数':len(children),'默认折叠':True,'父问题保持可见':True},冻结='需求待确认首行及左三列',格式修改后数据一致=True)
(task / 'delivery-verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'冻结':'首行及左三列','折叠子问题':len(children),'数据变化':0},ensure_ascii=False))
