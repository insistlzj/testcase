import {rules,clean,clauses} from './read-basis.mjs';
import {add,designs} from './design-cases.mjs';
export const fieldSources=[];
for(const r of rules){
 const body=clean(r.text),p=r.page,match=body.match(/^([^：]{1,35})：(.+)$/u);if(!match)continue;
 const subject=match[1].replaceAll(' / ','、'),detail=match[2].replace(/[。；]$/u,'');
 if(/排序|数据范围|统计范围|周期|权限|总计|总额|公式|规则|操作|状态 \/|已佩戴数量/u.test(subject))continue;
 if(/必填|必选|最多\s*\d|最长|单选|多选|支持.*搜索|正整数|非负|取值|必须|不得|不能为空|只有|只有/u.test(detail))continue;
 if(/=|Σ|之和|相加|乘|减去|累计.*总|[×÷]/u.test(detail))continue;
 let names=[];
 const content=detail.match(/^(?:展示|显示)(.+?)(?:；|。|$)/u)?.[1];
 if(content&&!/时|后|按|仅|只|不|正在|处于|最新|当前仍|当前有效|当前登录/u.test(content))names=content.replace(/^(?:当前账号|该账号|该好友|对应公会|对应账号|当前主播|当前粉丝群|本场|当前|对应|所选|本次|该笔|该)[的]?/u,'').split(/、|和|及|与/u);
 else if(/^(头像|昵称|名称|用户 ID|主播 ID|公会 ID|账号 ID|主题|订单号|退款单号|场次 ID|上传人|发送人|操作人|姓名|电话|简介|签名|群公告|备注|开播时间|申请时间|加入时间|发送时间|发生时间|分成时间|赠送时间|成功时间|提交时间|处理时间|通知时间|记录编号|批次信息|账号资料|主播信息|场次信息|申请信息|认证材料|主播明细|公会明细|礼物图标|收到数量|开播状态|已读状态|关系状态)/u.test(subject))names=subject.split('、');
 else if(/^(?:头像|名称|主播|公会|账号|记录|订单|送礼|发放|礼物|时间|金额|数量|状态|姓名|用户)/u.test(detail)&&!/(?:后|时|不得|不支持|必须|失败)/u.test(detail)&&detail.includes('、'))names=detail.split(/[、；。]/u);
 if(/^[^：；。]+(?:、| \/ )[^：；。]+$/u.test(detail)&&!/(?:必填|必选|仅|不|应|默认|按|排序|计算|最多|不得)/u.test(detail))names=detail.split(/、| \/ /u);
 if(!names.length)continue;
 const allowed=/^(?:头像|昵称|名称|姓名|电话|用户\s*ID|主播\s*ID|公会\s*ID|账号\s*ID|场次\s*ID|直播主题|主题|封面|分类|房型|房间号|主播账号|主播等级|财富等级|粉丝等级|团等级|团名称|主播头像|主播昵称|粉丝团身份|关系状态|开播状态|已读状态|未读数|完成状态|当前值|目标值|亲密度|灯牌|勋章|签名|公会简介|群公告|公告内容|公会名称|公会ID|记录\s*ID|订单号|渠道交易号|退款单号|头像框|聊天气泡|礼物名称|礼物图标|赠送时间|赠送数量|礼物单价|礼物类型|消费金币|上传人|上传时间|发送人|发送时间|发生时间|申请时间|加入时间|成功时间|提交时间|处理时间|通知时间|分成时间|分成金额|备注|处理结果|通知标题|标题|正文|时间|本人照片|证件照正面|证件照反面)$/u;
 names=names.map(x=>x.replace(/^(?:的|当前|对应|所选)/u,'').replace(/[。；]$/u,'').trim()).filter(x=>allowed.test(x));
 if(!names.length)names=subject.split('、').filter(x=>allowed.test(x));
 for(const field of new Set(names)){
  const value=/交易号/u.test(field)?'支付渠道成功返回的交易编号CH_A':/ID|编号|单号|房间号/u.test(field)?'数据准备记录A的实际系统编号':/头像|图标|Logo|封面|照片|证件照/u.test(field)?'预置图片A':/时间|日期/u.test(field)?'2026-09-14 10:00':/金额|余额|金币|收益|单价|亲密度/u.test(field)?'100':/数量|人数|件数|次数|未读数/u.test(field)?'2':/等级/u.test(field)?'数据准备记录A的实际等级及对应配置名称':/电话/u.test(field)?'+6281234567890':/状态|分类|房型|身份|类型/u.test(field)?'记录A创建时实际选择的有效枚举值（保存该值供对照）':/灯牌|勋章|头像框|聊天气泡/u.test(field)?'账号A当前已获得并启用的有效配置项A':/内容|正文|说明|简介|签名|公告|备注|原因/u.test(field)?'测试说明A':'测试A';
  add(r,{label:`${p.name}中${field}对应当前记录`,point:field,given:[`本页范围内测试记录A的“${field}”为${value}；另有同类型记录B，字段值不同`],steps:[`打开${p.entry}`,...(subject==='送礼详情'?['点击送礼记录A']:[]),`查看记录A的“${field}”`],expected:`“${field}”显示记录A的数据准备值，不串用记录B的数据`,dimension:'可观察结果',object:`${p.name}的${field}`});
 }
 if(names.length)fieldSources.push({id:r.id,page:p.key,fields:names});
}
export default designs;
