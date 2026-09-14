import fs from 'node:fs/promises';
import path from 'node:path';
import {root,task,hash,formalHash,riskHash,requirements,questions} from './model.mjs';
import {validateTestcaseDelivery} from '../../scripts/validate-testcase-delivery.mjs';
const read=async p=>JSON.parse(await fs.readFile(path.join(root,p),'utf8'));
const taskRel=path.relative(root,task),out='outputs/Luma Live-case';
const archive=await read('archive/Luma-Live/260914-001/archive-manifest.json');
let checked=0;
for(const group of archive.归档)for(const item of group.文件){
 const file=path.join(root,group.归档路径,item.路径);
 if(item.链接目标){if(await fs.readlink(file)!==item.链接目标)throw new Error('归档链接不一致');}
 else if(hash(await fs.readFile(file))!==item.SHA256)throw new Error(`归档哈希不一致：${group.归档路径}/${item.路径}`);
 checked++;
}
const currentBaseline=await read('work/liveshow-proto-mainbasis/latest.json');
const contextBackupFile='archive/Luma-Live/260914-001/context-backup-manifest.json';
const contextBackup=await read(contextBackupFile);
for(const item of contextBackup){
 if(hash(await fs.readFile(path.join(root,item.备份)))!==item.备份SHA256)throw new Error('需求清单备份内容变化');
 item.现文件SHA256=hash(await fs.readFile(path.join(root,item.原文件)));
}
await fs.writeFile(path.join(root,contextBackupFile),JSON.stringify(contextBackup,null,2)+'\n');
// 本轮需求回补前的指针只保留在过程隔离目录；任务根目录始终展示本轮最终基线。
const currentBytes=await fs.readFile(path.join(root,'work/liveshow-proto-mainbasis/latest.json'));
const localBaseline=path.join(task,'mainbasis-baseline.json');
if(hash(await fs.readFile(localBaseline))!==hash(currentBytes)){
 const retired=path.join(task,'superseded');await fs.mkdir(retired,{recursive:true});
 await fs.rename(localBaseline,path.join(retired,`mainbasis-baseline-${Date.now()}.json`));
 await fs.copyFile(path.join(root,'work/liveshow-proto-mainbasis/latest.json'),localBaseline);
}
const table=[],allCases=[];
for(const [folder,end]of [['user','用户App'],['guild','公会App'],['admin','管理后台']]){
 const dir=path.join(task,folder),base=`${end}-全部模块-260914-001.xlsx`,file=path.join(root,out,base);
 const gate=await validateTestcaseDelivery(dir,root,{phase:'final',workbook:file});
 const data=await read(`${taskRel}/${folder}/final.json`);
 table.push({端:end,用例数:data.测试用例.length,待确认数:data.需求待确认.length,工作簿:`${out}/${base}`,SHA256:hash(await fs.readFile(file)),交付校验:gate});
 allCases.push(...data.测试用例.map(c=>({...c,端:end})));
 try{await fs.rename(`${file}.inspect.ndjson`,path.join(dir,'export-inspection.ndjson'));}catch(e){if(e.code!=='ENOENT')throw e;}
}
await fs.copyFile(path.join(task,'测试准备说明.md'),path.join(root,out,'测试准备说明.md'));
const flows=[
 ['入会认证','同一申请 ID；先公会初审，再平台终审。通过前与通过后使用对应的观察用例。',['验证提交完整材料后产生初审申请','验证公会同意后进入平台终审','验证平台通过前尚未建立成员关系','验证平台终审通过才授予主播身份','验证平台通过后显示已加入','验证平台终审通过后显示最终进度']],
 ['退会','同一成员关系及退会申请 ID；同意、驳回使用不同申请样本。',['验证填写退会原因产生审核申请','验证退会审核同意解除成员关系','验证退会通过后显示已退出','验证退会通过后不再具有主播身份','验证退会审核驳回保留主播']],
 ['充值与退款','同一充值订单关联用户余额；每条金额核算用例独立准备其指定余额，不能直接接用上一条的余额。',['验证充值基础与赠金合并到账','验证整单退款扣回本金和赠金','验证退款不撤销完成的礼物消费','验证主播收益不受充值退款回退']],
 ['线下分成','同一主播、公会及财务导入批次；主播分成与公会分成分别核对。',['验证主播确认导入后记录只读','验证主播读取财务上传结果','验证公会读取本会主播上传结果','验证公会确认导入后记录只读','验证公会分成只展示当前公会']],
 ['公会停用','同一个启用公会；停用公会与仅停用公会长账号是两种不同场景。',['验证停用公会解绑旗下主播','验证停用公会不参与搜索','验证只停用公会长账号不解绑主播','验证停用公会长不能登录']],
];
let flowText='# 三端流程索引\n\n下表是本轮新用例的联调顺序和分支索引。每条仍按自己的前置条件执行；不把所有同流程编号的正常、驳回、失败用例串成同一次运行。\n\n';
for(const [title,note,titles]of flows){
 flowText+=`## ${title}\n\n${note}\n\n| 端 | 用例编号 | 检查内容 |\n| --- | --- | --- |\n`;
 for(const t of titles){const c=allCases.find(c=>c.用例描述===t);if(!c)throw new Error(`流程索引缺少用例：${t}`);flowText+=`| ${c.端} | ${c.用例编号} | ${c.用例描述} |\n`;}
 flowText+='\n';
}
await fs.writeFile(path.join(root,out,'三端流程索引.md'),flowText);
const stamp=new Date().toISOString();
const summary={时间:stamp,归档:{目录:'archive/Luma-Live/260914-001',目录数:archive.归档.length,已核对文件数:checked,处理:'移动归档，可按清单逐项恢复'},
 原始资料保护:'原始原型、系统概要、批注及项目接入记录保留；三份派生 context 已同步且修改前全文备份',
 MainBasis:{正式需求SHA256:formalHash,风险清单SHA256:riskHash,基线:'work/liveshow-proto-mainbasis/latest.json'},
 历史输入文件数:0,历史比较:'未执行',用例总数:allCases.length,独立待确认问题数:questions.length,源记录数:requirements.length,交付:table,
 质量边界:'通过当前输入、结构、表达、数值复算、引用与工作簿内容一致性检查；没有执行产品测试，不以用例数量或整段来源引用宣称穷尽所有业务场景。'};
await fs.writeFile(path.join(task,'delivery-completion.json'),JSON.stringify(summary,null,2)+'\n');
let receipt=`# Luma Live 本轮交付说明\n\n本轮从当前上游重建 MainBasis，生成三端共 ${allCases.length} 条测试用例，全部为“未测”。没有读取旧用例，也没有进行历史比较。\n\n| 端 | 正式用例 | 本端待确认 |\n| --- | ---: | ---: |\n`;
for(const x of table)receipt+=`| ${x.端} | ${x.用例数} | ${x.待确认数} |\n`;
receipt+=`\n待确认共有 ${questions.length} 个独立问题；跨端问题使用同一个 Q 编号，因此三份表中的问题行数不能直接相加。三个工作簿均含功能测试用例、需求待确认和产品决策概览。\n\n先阅读[测试准备说明](测试准备说明.md)，联调用例见[三端流程索引](三端流程索引.md)。来源正文位于项目 MainBasis 的《统一需求文档.md》和《需求待确认清单.md》，当前版本与上游哈希已绑定。\n\n## 归档与保留\n\n历史生成的 ${archive.归档.length} 个目录、${checked} 个文件已移动到 \`archive/Luma-Live/260914-001/\`，逐文件哈希核对一致。旧用例、旧规则库、旧场景、旧缓存和旧 MainBasis 都不参与新生成。三份 context 修改前全文另有备份。原型、系统概要、批注、工具、项目接入记录和其他项目资料保留。\n\n归档可以恢复；应按 archive-manifest.json 或 context-backup-manifest.json 选择具体文件，恢复到独立目录，避免覆盖本轮结果。恢复旧文件不会自动使其成为当前需求。\n\n## 后续生成规则\n\n下次生成会先检查当前上游和流程规则是否变化，完成必要的需求同步与 MainBasis 更新；随后只从这两份文档独立建立规则、状态与场景，再生成新的三端文件。不会读取本轮或更早用例，不执行历史覆盖映射或历史比较；旧来源或哈希变化会触发重新建立相应基线。\n\n## 验证范围\n\n已通过输入隔离、来源哈希、单条表达与计算、候选/最终 JSON 一致性、Excel 全表内容回读和公式错误检查，并检查三个工作簿的页面预览。共 ${requirements.length} 条来源记录含重复批注、范围与示例说明，不能作为独立规则数量，也不与用例数相除得到覆盖率。待确认预期未编造成正式用例；本次交付不代表产品测试已经通过，也不宣称穷尽所有可能场景。\n`;
await fs.writeFile(path.join(root,out,'本轮交付说明.md'),receipt);
console.log(JSON.stringify({归档核对:checked,用例总数:allCases.length,独立问题数:questions.length,工作簿:table.map(x=>x.工作簿)},null,2));
