"""Set pending-column visibility without reserializing unrelated Excel content.

Read XLSX from stdin, write XLSX to stdout. Optional argument updates the
overview title for a presentation-only revision. Uses Python standard library.
"""
import copy
import io
import re
import sys
import zipfile
import xml.etree.ElementTree as ET
from xml.sax.saxutils import escape

NS = {'s': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
VISIBLE = {1, 6, 7, 9, 10, 12, 13, 18, 20}
HEADERS = ['问题编号', '需求组编号', '父问题编号', '追问触发条件', '阻塞等级', '功能模块', '具体场景', '问题分类', '待决策问题', '可选方案', '测试建议', '产品结论', '结论补充', '已知依据', '影响范围', '已有用例编号', '确认后待补用例', '负责人', '期望确认时间', '确认状态']
ET.register_namespace('', NS['s'])


def outline_pending(data, styles_data, shared):
    """Keep parent questions visible and child questions expandable after export."""
    sheet, styles = ET.fromstring(data), ET.fromstring(styles_data)
    tag = lambda name: '{' + NS['s'] + '}' + name
    value = lambda c: shared[int(c.findtext('s:v', namespaces=NS))] if c.get('t') == 's' else ''.join(c.itertext())
    rows = sheet.findall('s:sheetData/s:row', NS)
    questions = []
    for row in rows[1:]:
        cells = {re.sub(r'\d+$', '', c.get('r')): c for c in row}
        questions.append((value(cells['A']), value(cells['C']), row, cells['A']))
    parents = {question: row for question, _, row, _ in questions}
    children = [(parent, row, cell) for _, parent, row, cell in questions if parent]
    if not children:
        return data, styles_data
    prop = sheet.find('s:sheetPr', NS)
    if prop is None:
        prop = ET.Element(tag('sheetPr')); sheet.insert(0, prop)
    outline = prop.find('s:outlinePr', NS)
    if outline is None:
        outline = ET.SubElement(prop, tag('outlinePr'))
    outline.attrib.update(summaryBelow='0', showOutlineSymbols='1')
    sheet.find('s:sheetFormatPr', NS).set('outlineLevelRow', '1')
    pane = sheet.find('s:sheetViews/s:sheetView/s:pane', NS)
    assert pane is not None
    pane.attrib.update(xSplit='3', ySplit='1', topLeftCell='D2', activePane='bottomRight', state='frozen')
    formats, indented = styles.find('s:cellXfs', NS), {}
    for parent, row, cell in children:
        assert parent in parents and int(parents[parent].get('r')) < int(row.get('r')), 'Invalid question parent'
        row.attrib.update(outlineLevel='1', hidden='1')
        parents[parent].attrib.update(collapsed='1', hidden='0')
        original = int(cell.get('s', '0'))
        alignment = formats[original].find('s:alignment', NS)
        if alignment is not None and alignment.get('indent') == '1':
            continue
        if original not in indented:
            style = copy.deepcopy(formats[original])
            alignment = style.find('s:alignment', NS)
            if alignment is None:
                alignment = ET.SubElement(style, tag('alignment'))
            alignment.attrib.update(indent='1', horizontal='left')
            style.set('applyAlignment', '1')
            indented[original] = len(formats); formats.append(style)
        cell.set('s', str(indented[original]))
    formats.set('count', str(len(formats)))
    return ET.tostring(sheet, encoding='utf-8', xml_declaration=True), ET.tostring(styles, encoding='utf-8', xml_declaration=True)


def core_view(data, title=None):
    output = io.BytesIO()
    with zipfile.ZipFile(io.BytesIO(data)) as source:
        workbook = ET.fromstring(source.read('xl/workbook.xml'))
        sheets = workbook.find('s:sheets', NS)
        assert [s.get('name') for s in sheets] == ['产品决策概览', '功能测试用例', '需求待确认'], 'Unexpected sheet layout'
        relations = ET.fromstring(source.read('xl/_rels/workbook.xml.rels'))
        targets = {r.get('Id'): r.get('Target') for r in relations}
        parts = [targets[s.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id')] for s in sheets]
        parts = [p.lstrip('/') if p.startswith('/') else 'xl/' + p for p in parts]
        pending = source.read(parts[2]).decode('utf8')
        strings = ET.fromstring(source.read('xl/sharedStrings.xml')) if 'xl/sharedStrings.xml' in source.namelist() else []
        shared = [''.join(s.itertext()) for s in strings]
        cells = ET.fromstring(pending).find('s:sheetData/s:row', NS)
        headers = [shared[int(c.find('s:v', NS).text)] if c.get('t') == 's' else ''.join(c.find('s:is', NS).itertext()) if c.get('t') == 'inlineStr' else c.findtext('s:v', namespaces=NS) for c in cells]
        assert headers == HEADERS, 'Pending schema changed'
        columns = re.search(r'<(?:\w+:)?cols\b[^>]*>.*?</(?:\w+:)?cols>', pending, re.S)
        assert columns, 'Column definitions missing'
        seen = set()

        def hide(match):
            node = ET.fromstring(re.sub(r'<\w+:', '<', match.group()))
            first, last = int(node.get('min')), int(node.get('max'))
            assert first == last and 1 <= first <= 20, 'Expected individual column definitions'
            seen.add(first)
            text = re.sub(r'\s+hidden="[^"]*"', '', match.group())
            return text[:-2].rstrip() + ' hidden="1"/>' if first not in VISIBLE else text

        revised_cols = re.sub(r'<(?:\w+:)?col\b[^>]*/>', hide, columns.group())
        assert seen == set(range(1, 21))
        revised = pending[:columns.start()] + revised_cols + pending[columns.end():]
        changes = {parts[2]: revised.encode('utf8')}
        assert revised.replace(revised_cols, columns.group(), 1) == pending
        changes[parts[2]], changes['xl/styles.xml'] = outline_pending(changes[parts[2]], source.read('xl/styles.xml'), shared)
        if title:
            overview = source.read(parts[0]).decode('utf8')
            cell = re.search(r'<(?P<prefix>\w+:)?c\b(?=[^>]*\br="A1")[^>]*>.*?</(?:\w+:)?c>', overview, re.S)
            assert cell, 'Overview title missing'
            opening = re.sub(r'\s+t="[^"]*"', '', cell.group().split('>', 1)[0])
            prefix = cell.group('prefix') or ''
            replacement = opening + f' t="inlineStr"><{prefix}is><{prefix}t>' + escape(title) + f'</{prefix}t></{prefix}is></{prefix}c>'
            changes[parts[0]] = overview.replace(cell.group(), replacement, 1).encode('utf8')
        with zipfile.ZipFile(output, 'w') as saved:
            saved.comment = source.comment
            for info in source.infolist():
                saved.writestr(copy.copy(info), changes.get(info.filename, source.read(info.filename)))
        with zipfile.ZipFile(io.BytesIO(output.getvalue())) as saved:
            assert saved.testzip() is None
            for name in source.namelist():
                assert saved.read(name) == changes.get(name, source.read(name)), name
            cols = ET.fromstring(saved.read(parts[2])).find('s:cols', NS)
            assert {int(c.get('min')) for c in cols if c.get('hidden') != '1'} == VISIBLE
    return output.getvalue()


if __name__ == '__main__':
    sys.stdout.buffer.write(core_view(sys.stdin.buffer.read(), sys.argv[1] if len(sys.argv) > 1 else None))
