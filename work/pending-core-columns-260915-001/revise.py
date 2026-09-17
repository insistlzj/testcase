import hashlib
import importlib.util
import json
from pathlib import Path
import zipfile
import io
import sys

root = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location('core_view', root / 'scripts/pending-core-view.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
report = {'检查范围': '仅工作簿显示修订，不替代业务复核或全量交付门禁', '文件': []}
user_only = sys.argv[1:] == ['user']
assert not sys.argv[1:] or user_only
for end, task in ([('用户App', 'user')] if user_only else [('公会App', 'guild'), ('管理后台', 'admin')]):
    folder = root / 'outputs/Luma Live-case'
    source = folder / f'阶段性-{end}-全部模块-260915-{"003" if user_only else "001"}.xlsx'
    current = root / f'work/liveshow-guild-admin-260915-001/{task}'
    verification = root / 'work/subitem-fix-260915-001/workbook-revision-check.json' if user_only else current / 'delivery-verification.json'
    verified = json.loads(verification.read_text())
    data = source.read_bytes()
    digest = lambda b: hashlib.sha256(b).hexdigest()
    assert digest(data) == verified['工作簿SHA256']
    numbers = [int(p.stem.rsplit('-', 1)[1]) for p in folder.glob(f'阶段性-{end}-全部模块-260915-*.xlsx')]
    target = folder / f'阶段性-{end}-全部模块-260915-{max(numbers)+1:03}.xlsx'
    title = target.stem + ' 产品决策概览'
    result = module.core_view(data, title)
    # Same transformation is idempotent; preserve original and never overwrite.
    assert module.core_view(result, title) == result
    with target.open('xb') as file:
        file.write(result)
    with zipfile.ZipFile(io.BytesIO(data)) as old, zipfile.ZipFile(target) as new:
        changed = [n for n in old.namelist() if old.read(n) != new.read(n)]
        assert set(changed) == {'xl/worksheets/sheet1.xml', 'xl/worksheets/sheet3.xml'}
    report['文件'].append({'文件': str(target), '原文件SHA256': digest(data), '工作簿SHA256': digest(result),
        '可见列数': 9, '隐藏列数': 11, '其他包内容逐字节一致': True,
        '变化范围': '需求待确认列显示标记及概览版本标题', '状态': '通过'})
(Path(__file__).parent / ('user-revision-check.json' if user_only else 'revision-check.json')).write_text(json.dumps(report, ensure_ascii=False, indent=2)+'\n')
print(json.dumps(report, ensure_ascii=False))
