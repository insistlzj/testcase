import { baseline } from './source.mjs';
import { scenario, observe, exclude, context, question, pageRole, pageSteps } from './design.mjs';

export const fullyReviewed = new Set();
const done = e => fullyReviewed.add(e.id);
// 这些受限语法仅承接已经逐模块读取过的直接展示语句；复合业务条款留给专项设计。
for (const e of baseline.entries) {
  if(['结构说明','原型说明'].includes(e.status)){exclude([e.id],e.status==='原型说明'?'演示机制不建立真实业务预期':'标题或表头，无业务行为');done(e);continue;}
  if(e.status==='待确认'){question([e.id],e.questions,'MainBasis 明确标为待确认，问题按独立决策拆分');done(e);continue;}
  if(/^场景/u.test(e.section)){context([e.id],'页面角色和用户任务上下文，实际动作及结果由同页明细规则承接');done(e);continue;}
  if(!e.page)continue;
  const m=e.text.match(/^([^：]+)：(.+)$/u);
  if(!m || !/字段|信息/u.test(e.section))continue;
  const [_,label,body]=m;
  if(label.length>35 || /[；。]|->|→|=|Σ|×|÷|合计|总和|累计|之和|数量|人数|计数|计入|排序|最高|最低|最大|最多|至少|只读|唯一|不可|不能|必填|选填|单选|多选|必选|大于|小于|上限|下限|正整数|非负|有效期|默认|时相同|不影响|不显示|不展示|隐藏|时显示|后显示|失效|按.*状态|状态.*按|支持|启用|停用|已解散|未处理|未开播|分成|收益|余额|消费|开播时长|秒|分钟|日期范围/u.test(body))continue;
  if(/^[^：]*\/$/u.test(label))continue;
  const expected=`「${label}」内容与所选对象的该项资料一致`;
  observe(e.id,`${label.replaceAll(' / ','、')}回显`,[`所选对象存在，已记录该对象的${label}值`],expected,{priority:'P2'});
  done(e);
}

export function reviewed(ids){for(const id of ids)fullyReviewed.add(id);}
