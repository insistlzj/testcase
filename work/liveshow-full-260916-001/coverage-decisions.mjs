// Human decisions after reading each source clause and the current scenarios together.
// Absence here means unfinished review; it is never interpreted as coverage.
export const decisions=new Map();
export const pageAliases=new Map([
 ['管理后台:REQ-c3b904f1d0a6','admin-dashboard.html'],['管理后台:REQ-2f4950135d2b','admin-user-list.html'],['管理后台:REQ-17ca946a7bd1','admin-user-detail.html'],
 ['管理后台:REQ-a907160ca606','admin-host-list.html'],['管理后台:REQ-0e4db0ba200d','admin-host-detail.html'],['管理后台:REQ-3b948875f148','admin-host-review-detail.html'],
 ['管理后台:REQ-9347bd6e0075','admin-inspection-schedule.html'],['管理后台:REQ-e98582b17e8d','admin-inspection-schedule-create.html'],['管理后台:REQ-1527a41a0bfc','admin-inspection-schedule-detail.html'],
 ['管理后台:REQ-e521e2bce4f9','admin-content-audit.html'],['管理后台:REQ-0fb8a8b871ad','admin-content-audit-detail.html'],['管理后台:REQ-3ead306e7628','admin-account-violation.html'],
 ['管理后台:REQ-fac817ccd4b5','admin-report-handling.html'],['管理后台:REQ-9a93aea6ad28','admin-report-detail.html'],['管理后台:REQ-de1bc4104b0b','admin-violation-types.html'],
 ['管理后台:REQ-fcab6dec8324','admin-violation-type-detail.html'],['管理后台:REQ-19232876aec1','admin-gift-list.html'],['管理后台:REQ-1f121a013598','admin-gift-detail.html'],
 ['管理后台:REQ-46f3b6b72f55','admin-custom-gift.html'],['管理后台:REQ-8ba3dd0eaea2','admin-lucky-gift-config.html'],['管理后台:REQ-d4d8bd1ef03f','admin-lucky-gift-detail.html'],
 ['管理后台:REQ-73ba3233e251','admin-prop-list.html'],['管理后台:REQ-92c171957131','admin-prop-detail.html'],['管理后台:REQ-00cc792bbb80','admin-gift-send-count-rules.html'],
 ['管理后台:REQ-44dd5290a704','admin-gift-send-count-rule-detail.html'],['管理后台:REQ-a31a9446397b','admin-placement-config.html'],['管理后台:REQ-02ba7941bdf2','admin-placement-detail.html'],
 ['管理后台:REQ-bd1d11ba21de','admin-push-management.html'],['管理后台:REQ-09147d3b69df','admin-push-detail.html'],['管理后台:REQ-75e55516a5ca','admin-recharge-package.html'],
 ['管理后台:REQ-825df5272207','admin-recharge-package-detail.html'],['管理后台:REQ-5f0757a1ded7','admin-task-config.html'],['管理后台:REQ-a7c79365fb30','admin-task-detail.html'],
 ['管理后台:REQ-b6a0202e0443','admin-guild-recommendation.html'],['管理后台:REQ-47464c5228cb','admin-guild-recommendation-detail.html'],['管理后台:REQ-66f7efea86a1','admin-live-type.html'],
 ['管理后台:REQ-2b94630270f4','admin-feature-switch.html'],['管理后台:REQ-cb7539f82f72','admin-ticket-price-level.html'],['管理后台:REQ-a1d47c5c74db','admin-ticket-price-level-detail.html'],
 ['管理后台:REQ-4b0ee35bcd3a','admin-sensitive-words.html'],['管理后台:REQ-b1ccb31108fd','admin-sensitive-words-detail.html'],['管理后台:REQ-0379813dfbcf','admin-recharge-order.html'],
 ['管理后台:REQ-6ff937d86740','admin-recharge-order-detail.html'],['管理后台:REQ-b922eb7e5bc3','admin-consumption-order.html'],['管理后台:REQ-cd2f595cbc48','admin-consumption-order-detail.html'],
 ['管理后台:REQ-dfd3dd9f346b','admin-refund-order.html'],['管理后台:REQ-f0ef9ceea9e3','admin-settlement-record.html'],['管理后台:REQ-14c50e38e802','admin-host-account-balance.html'],
 ['管理后台:REQ-969d7b93e0b0','admin-guild-account-balance.html'],['管理后台:REQ-2e62585251c4','admin-report-center.html'],['管理后台:REQ-914aa77b61f4','admin-data-overview.html'],
 ['管理后台:REQ-e35c2a8a3641','admin-daily-statistics.html'],['管理后台:REQ-e4df5800da6a','admin-user-active-statistics.html'],['管理后台:REQ-a9c324016929','admin-host-statistics.html'],
 ['管理后台:REQ-23a3de6da45f','admin-live-statistics.html'],['管理后台:REQ-557eed1394b4','admin-host-live-record-report.html'],['管理后台:REQ-1308cb124aba','admin-recharge-statistics.html'],
 ['管理后台:REQ-52d94e180844','admin-user-activity-statistics.html'],['管理后台:REQ-9485461f1765','admin-monthly-income-expense.html'],['管理后台:REQ-917f0082f00f','admin-monthly-host-share.html'],
 ['管理后台:REQ-f631f17e88c8','admin-monthly-host-earnings.html'],['管理后台:REQ-eff0f49adaa2','admin-monthly-viewer-consumption.html'],['管理后台:REQ-41cd831cb21f','admin-monthly-gift-sales.html'],
 ['管理后台:REQ-0600f02c9d36','admin-consumption-order-detail-report.html'],['管理后台:REQ-da31f80885a6','admin-refund-order-detail-report.html'],['管理后台:REQ-f6fa04cceb5e','admin-recharge-order-detail-report.html'],
 ['管理后台:REQ-e143156a2794','admin-operation-accounts.html'],['管理后台:REQ-c6a93c9c18c2','admin-operation-account-detail.html'],['管理后台:REQ-9b14b9c613c1','admin-operation-issue-records.html'],
 ['管理后台:REQ-74a5906e2cc1','admin-operation-gift-records.html'],['管理后台:REQ-a2ad653c5c6a','admin-operation-guild-controls.html'],
]);
function complete(ids,reason){for(const id of ids.trim().split(/\s+/)){if(decisions.has(id))throw new Error(`重复核销${id}`);decisions.set(id,{状态:'已覆盖',说明:reason});}}
function completeEnd(end,ids,reason){complete(ids.trim().split(/\s+/).map(id=>`${end}:${id}`).join(' '),reason);}
completeEnd('用户App',`
REQ-607e47a26898 REQ-d1f4689437ac REQ-79b9dcf90fd2 REQ-805c79bddb30 REQ-a28222f95651 REQ-c5549b4e74e3
REQ-773edb720337 REQ-cfb2da2d03b8 REQ-fff3876be890 REQ-12dabb818af0 REQ-0d407226ed57
REQ-14213298b2a3 REQ-28bc4ce2a4a9 REQ-be0c51fd052a REQ-2dac31b3bcf4
REQ-d0304c059e66 REQ-45a3091775a6 REQ-31037d172fcc REQ-6c79fce41141 REQ-cff879e8c2ea REQ-3e4effac33f6
REQ-fc0bd91289a4 REQ-9281249cef8e REQ-4e0209363b8c REQ-2e3493588ff9 REQ-aaf346990d6f
REQ-ebed6e5a6579 REQ-675082760130 REQ-dfc1f2591989 REQ-82451b22fe04
REQ-1ecb9b85a4e9 REQ-1edc36bdf8e1 REQ-2850c1767d2d REQ-6adf279aab15 REQ-b44c2d5d8f26
REQ-41fd5cf0d936 REQ-b9e8f5290ba9 REQ-a925801a0b05 REQ-1cc6fed5c82d REQ-eaff5fb9d1cb REQ-b2bd6abf1c0e REQ-7b9762e5e283
REQ-e2e049813326 REQ-c373504bd6ea REQ-add5e105b1af REQ-dd9f40619bbf
REQ-e4fe00ab5793 REQ-4a70c85b83b8 REQ-1aa0479bc347 REQ-eba4337f1fdd REQ-cb921566b6a2
REQ-948c8b1a6937 REQ-36a9ffbfb245 REQ-3e100a6bd5da REQ-e1d8e09f6bef REQ-9bf15f3820f5
REQ-8b6b89aac4b1 REQ-dca1caffcc34 REQ-888e2eaadfe7 REQ-70f0b04a2ddc REQ-c634a48f93c8
REQ-05c67c3ed329 REQ-9ef443fd37de REQ-abe8541b9a0e REQ-449c52680d03 REQ-b07fa631b1b0
REQ-3f14c9bc62a5 REQ-14cfb05bd7a5 REQ-8185eb3f1eda REQ-53d05a4a79aa REQ-47f70d2f770d REQ-de6b0276ede6
REQ-8bcc2f70dcb0 REQ-4f1cbe1f95c6 REQ-e681a58e066a REQ-684f5bc31a0f REQ-34e12ed2d16f REQ-cbf01ddc2ce1 REQ-7e55ca4e6ece
REQ-cbca7a0d5cdb REQ-e119449ab46b REQ-28245a39d420 REQ-b7fb64758b88 REQ-7a0f6dc99def REQ-7a0d28f88831 REQ-1221f279d0cb
REQ-8f7db9a3169a REQ-920beb44210f REQ-a162f5102aa8 REQ-5e858732d1b6 REQ-8853c15bb6e2 REQ-bef1b10b2fb4
REQ-7df43fc2a387 REQ-cfe9b5f5b3db REQ-b1e24d4217ac REQ-fec1b88773ba
REQ-57814f9983a5 REQ-3af2bfd016aa REQ-54ebe2780e5b REQ-48fc4cb314c4 REQ-d878cbc52877 REQ-940a4ef0b2e3 REQ-4e109b642f03
REQ-7c5142479027 REQ-0113fe9800e8 REQ-c8230f90cd65 REQ-a2798f39d6d1 REQ-59fdf2456d37 REQ-a519d6897093
REQ-0d86d0a94e39 REQ-25b38938479b REQ-a80b7613a890 REQ-b7b91d39103c REQ-fd95d20f0cb3
REQ-019ce43757a6 REQ-042b3215a51c REQ-2fd462dd65f2 REQ-ba292625292c REQ-0763cecd7068
REQ-1e7cd4c1af37 REQ-c4f4aacabc1f REQ-b5037c115075 REQ-29e666f003dc REQ-e83a506620db REQ-193f4b9a8325 REQ-9cd00b937b3d REQ-2d4dbab50dd6
REQ-59bc005fbd42 REQ-c1025eff3ce1 REQ-c1a96eb87f5a REQ-bdf92bcd92b1 REQ-5a4dde90986b REQ-53e24ec49086
REQ-64acde2cf0ed REQ-96f420bd2163 REQ-b86cbb1f8e64 REQ-d5f8759fbfe2 REQ-d156fd1d4e74 REQ-13eacdff45b1 REQ-e200c40f2cf5
`,'按当前MainBasis逐条回读并补足本端字段、条件、时间边界、排序、状态和动作结果；仅核销列出的用户端投影。复合规则尚未验证的关系恢复、其他端效果和环境观察继续保留。');
completeEnd('管理后台',`
REQ-54337ecd936b REQ-31a430398065 REQ-0bec5136860b REQ-a2aea92511e8 REQ-3b5270c1d280 REQ-a931723abfae
REQ-1b6333802789 REQ-5c9332705223 REQ-f926f5cccd26 REQ-552a4b339dd8 REQ-5c6c8b2c8e29 REQ-a5f248334789 REQ-3fb68d9228a8
REQ-794f7414a224 REQ-7661f5eda946 REQ-79783cfa3243 REQ-e255210947f8 REQ-6c751b88b849 REQ-32e41c107d95
REQ-9a7ffef94253 REQ-adadf43fb7bd REQ-2b12ca1c0b87 REQ-eaac37933cbe REQ-6764ef697ed0 REQ-c2e95bdeec42 REQ-78ab8f0a09ad
REQ-22b44e86ef5a REQ-f6533f5a2324 REQ-8e81aa39c733 REQ-3ce993d9e96e REQ-e493708640a1 REQ-e90c017e7120
REQ-53e04771026d REQ-6306a367da63 REQ-08522221fbf4 REQ-80ed68710fe9 REQ-140cf016ddd1
REQ-ad3ced20eea6 REQ-995934b26232 REQ-60f4e6569ea4 REQ-0e5339112504 REQ-ade6aaf52550 REQ-33a1bb8321a8
REQ-16c3c8128c5d REQ-8d0b0f06939f REQ-27b6320be8db REQ-3c1c025bcfe4
`,'独立回读后台来源后核对具体数据、查询范围、统计口径和已实现测试设计；仅核销后台可观察结果，不将用户App场景当作后台操作覆盖。');
complete(`
REQ-d7201c8835b7 REQ-3480df046bf9 REQ-ac0b60fbcabc REQ-c36f94897185
REQ-b8c4f29fd3e0 REQ-b8cc4e99b745 REQ-6913df3ee9d5 REQ-498d6cecdd5e
REQ-6a94a8b12ee1 REQ-e912d0aca3d6 REQ-6504613d1273 REQ-cc1efac54a82
REQ-4aa953016658 REQ-ec9c6cf09271 REQ-fbccc72d47be
REQ-78c8d9aa028d REQ-36e42f069039 REQ-2ec1339592d2
REQ-d16e735ecacf REQ-9cbb2af001ee REQ-2627f61b5dcf
REQ-f5ae96afc3b9 REQ-f30ceeca123b REQ-e3ed126d2036 REQ-3475235a94e5
REQ-7de42daabd25 REQ-282f21a0e2d2
REQ-1ec2195a8925 REQ-244e380c3182 REQ-e238b21c76a7
REQ-a48ba6bfa371 REQ-26bf1cfca040 REQ-8fb398d1b1d8 REQ-bb414c358408 REQ-c72b0d74078b
REQ-0ba7c960a009 REQ-18b92dc9135e REQ-11ec1831d720
`, '逐条核对当前公会端来源、条件、操作和结果：字段对象、时间、统计口径或交互分支已有对应场景；未将相邻未测分支一并核销。');

export const aliases=new Map([
 ['REQ-72fecefb0261',['验证查看申请本人照片']],
 ['REQ-d32dd6d86d3c',['验证平台通过后查看主播主页']],
 ['REQ-35b9e0216cef',['验证公会通过后提交平台终审']],
 ['REQ-4520c38a9a13',['验证公会通过后提交平台终审']],
 ['REQ-f325634a9fac',['验证通知关联记录点击后保持业务对象']],
]);
completeEnd('用户App',`
REQ-826330e357ca REQ-056a9a9ae248 REQ-3430cd51d830 REQ-0f68b0f3d63d
`,'巡房入房豁免、会话保护及失效边界已按实际观察位置投影到用户App；后台仅保留排班配置和状态，不伪造跨端观察入口。');
completeEnd('管理后台',`
REQ-491605bd1c49 REQ-405441d1d170 REQ-cc33ba610d29 REQ-5e10141c64e8
REQ-a9e12057fef9 REQ-cd2d718980d8 REQ-883084e725ef
REQ-c35acbbcbd12 REQ-da1fa6278111 REQ-4ebf71cf03f4 REQ-2332ab301de8
REQ-2084b0531166 REQ-fb50483ee157
`,'本轮已补齐后台入口、状态、权限矩阵、审计字段及排班配置的独立场景；每条只按当前MainBasis明确结果核销。');
complete('REQ-72fecefb0261 REQ-d32dd6d86d3c REQ-35b9e0216cef REQ-4520c38a9a13 REQ-f325634a9fac','与当前任务内已有场景为同一端、同一入口及同一业务结果，补充来源条款关联；不新增重复用例。');
complete(`
REQ-8c2c22c4168d REQ-b4777791eb9d REQ-7b9651bd111c REQ-a6b491d7b1aa REQ-0f3fd7e3397f REQ-ad5f3403fb33
REQ-0996dff5d166 REQ-6c4f8435a29e REQ-dd4a60d7c8f3 REQ-27451eaf9055 REQ-4086521f7068
REQ-9c8365970619 REQ-fa2507b4d6df REQ-e351e91ed44f REQ-be79750ac19b REQ-2bdde8e39011
REQ-ccb9a3faf7eb REQ-4e9b69496562 REQ-4fb585b39a12 REQ-bccc67cb07b8 REQ-0e48ead52cc5 REQ-8af217e09909 REQ-4fc6cf0d0919
REQ-47c155de9784 REQ-2263ce51fcbc REQ-d94cf97e0735
REQ-df4b3542a7c2 REQ-97cd72373bf2 REQ-dc31b1a4e9a0
REQ-933d994eee0b REQ-ca337fc6ee2d REQ-297b5e0e3bf7 REQ-a4835c8a89b4 REQ-e882b7259ce5 REQ-46295ce894ac
REQ-7a47312e00c4 REQ-f40c8344e1ab REQ-5479c2595a0d REQ-c7b698bb777a REQ-bf39582dcdf6 REQ-9d6081f3950c
REQ-cd6a03e29391 REQ-d25b35a4df90 REQ-08aa8f7fddb5 REQ-6e7a5925d5b4
REQ-829bf72e5c0a REQ-3b632dcb59da REQ-07cd82ef5b3a REQ-30339bdad58d REQ-027d2650847b
REQ-b1708057eef3 REQ-3a16fbf7a035 REQ-b3ddda9fea5f REQ-097e125c296e REQ-6d53a55f5980 REQ-81a3ed5abf3a REQ-7d4a601f95fa
REQ-731cc63e8bb2 REQ-c68ea3b46fc7 REQ-bdd6386bbb66 REQ-24f58a645007 REQ-8be05b68b85e REQ-abaa8f0c3396 REQ-2bd29732456c REQ-b84a8280b95e
REQ-1be57bba4047 REQ-e3767edd9c7b REQ-442147718fe6 REQ-dd0807235d97 REQ-4f9b330976db REQ-b0dd1ad499ca REQ-56ed49642530 REQ-8fc59d945f54 REQ-0c21593960fd
REQ-d7b1689b308d REQ-bc39746dc10e REQ-3a4675da5911 REQ-11c07952190f REQ-196da5d367ee REQ-64e41a53b88f REQ-5b1eecfc9a27 REQ-b2197c3c2e58 REQ-b6422feedd6e REQ-7d068e075206 REQ-f6239cd9ae7b REQ-50afce4f563f REQ-b409f84ccf77
`,'逐条核对公会端业务对象、统计范围、权限及直接结果；月/日双粒度、跨端效果和未覆盖操作仍单独保留，不以同字段存在代替这些分支。');
for(const [id,names]of [
 ['REQ-1eac88140da3',['验证退会主播保留原公会期间业绩']],
 ['REQ-67458be2a092',['验证主播业绩保留退会标识']],
 ['REQ-396541118a33',['验证从实际入口打开主播数据主页入口']],
 ['REQ-35c9e8637b4f',['验证公会运营账号列表进入创建页']],
 ['REQ-7e3fb4be88e3',['验证平台锁定后公会运营账号只读']],
 ['REQ-748319f69b03',['验证普通礼物和定制礼物计入主播收益','验证幸运礼物返奖0时主播收益','验证幸运礼物返奖1000时主播收益','验证运营赠礼不增加主播收益']],
 ])aliases.set(id,names);
complete('REQ-1eac88140da3 REQ-67458be2a092 REQ-396541118a33 REQ-35c9e8637b4f REQ-7e3fb4be88e3 REQ-748319f69b03','当前任务内同页字段、重复业务说明和交互规则归并到已有明确观察结果；已核对来源与观察位置。');
for(const [id,names]of [
 ['REQ-67a193e4ec8d',['验证运营送礼消费按单价件数计算']],
 ['REQ-4b572c434fc6',['验证按日消费进入送礼记录']],
 ['REQ-507664dd9eeb',['验证运营送礼消费按单价件数计算']],
 ['REQ-be1399973dbd',['验证从实际入口打开违规记录主播下钻']],
 ])aliases.set(id,names);
complete(`
REQ-3b9a4901a62b REQ-ad9fa1638ecd REQ-bb6cd0c38874 REQ-7c3feec7bb55 REQ-01aea7c3c29c
REQ-14cedfd463b3 REQ-e5d474e04dec REQ-53046ad842aa REQ-58a3b3083f47 REQ-34f3e2e1e60c
REQ-458da153b105 REQ-d663601c7f44 REQ-7cd6e6046561 REQ-30c7a0c47120 REQ-0d0a38bc020e
REQ-5f9e6c9e5f24 REQ-381281aaf488 REQ-cbb7a2174f2f REQ-b714dfa901eb REQ-5891c9734594
REQ-0d705a92bb23 REQ-da175ce63bb2 REQ-75eff86df698 REQ-1779db697186 REQ-f997046439a2
REQ-287d99181822 REQ-542f71638053 REQ-0a5f516ac158 REQ-a82a66570557 REQ-81fc8f1e04b7
REQ-a4148668b89f REQ-e187f162f7b8 REQ-b89ae6ba9123 REQ-071be1de5357 REQ-ad8aa90131f0
REQ-2230182a7752 REQ-7012869c65e6 REQ-ab3611f8dec0 REQ-56cd13972b64 REQ-48472b42ff0b
REQ-07ccfe1b17c0 REQ-4b572c434fc6 REQ-67a193e4ec8d REQ-507664dd9eeb REQ-ef0c0a831aa2
REQ-174d0cbda32b REQ-0c9d662848b4 REQ-827721b095f8 REQ-db923df69f8a REQ-3203791f25d8
REQ-08faa1304783 REQ-1221acc6aa29 REQ-27679ba94edc REQ-6b593d7d38f6 REQ-26d51d07b374
REQ-7a61e5f92e6d REQ-a52a416cf13e REQ-93d5b7f8688f REQ-209e305f2a95 REQ-3caa16d1492a
REQ-be1399973dbd REQ-b6b51e83e296 REQ-a53e83783e87 REQ-c1a6e3b703bb REQ-1955ff14d117
REQ-90228a85fe97 REQ-b4ecf178659c REQ-0c6a7c118842 REQ-32710a91047a REQ-120491ce9925
REQ-d15b0fa3a16a REQ-024f8f36e810 REQ-9ed85696f36b REQ-36b7dd55bc1a REQ-4a356878298a
REQ-646b45ea7bb0 REQ-91e61389b432 REQ-136eaaa6e25c REQ-7f4dbabfcda9 REQ-89a5c71d337c
REQ-85c8b60ca454 REQ-588e794e69c3 REQ-12600d763965 REQ-6359ffa4e7fc REQ-48b8679384f1
REQ-7e73bff3ce0c REQ-f24885176749 REQ-3d4df208c603 REQ-8ce55a2012b9 REQ-55421b93ab90
REQ-e04b2fc8da54 REQ-2010984afb60 REQ-39e59f822231 REQ-1afa9bbb787d REQ-bc29e36d3b72
REQ-2ee500261795 REQ-a55c36ffadaa REQ-30e2a7348149 REQ-49205bdc523a
COMMON-guild-1 COMMON-admin-1
`,'已逐条回读独立来源与对应场景，补足输入边界、不同状态、聚合范围、对象回填和关联入口后核销；颜色等纯视觉属性不在本次功能测试范围。跨端登录及人工修正观察缺口仍另行保留。');

for(const [id,names]of [
 ['REQ-610c705cfcda',['验证按后台直播分类筛选首页','验证切换首页热门列表','验证切换首页新人列表','验证密码房使用4位有效密码']],
 ['REQ-1b58b1ed94b0',['验证关注区筛出在播关注主播']],
 ['REQ-63b504130be0',['验证主播榜计算真实礼物成交额','验证主播榜切周期同步列表排名']],
 ['REQ-b590092f3dcb',['验证用户榜计算真实礼物成交额','验证用户榜切周期同步列表排名']],
 ['REQ-b104da1ab1ba',['验证重复使用历史关键词','验证第11个不同关键词写入历史','验证搜索页不混入平台热门词']],
 ['REQ-b1de0a2b3ab1',['验证重复使用历史关键词','验证第11个不同关键词写入历史','验证同账号另一设备打开搜索历史']],
 ['REQ-c977e00cbaac',['验证搜索未命中的账号','验证按匹配程度排列账号搜索结果']],
 ['REQ-a35ad3f561e3',['验证使用昵称搜索账号','验证使用用户 ID搜索账号','验证使用房间号搜索账号']],
 ['REQ-24be7f6754fb',['验证福利页充值福利卡片进入目标页面']],
 ['REQ-dbc47dfa9ef4',['验证福利页充值福利卡片进入目标页面','验证充值福利展示套餐最大奖励']],
 ['REQ-765a66d04ea9',['验证登录当天尚未手动签到','验证连续签到成功后天数递增','验证断签后重领奖励使用首日档位']],
 ['REQ-65c34a5aad5a',['验证超过最高签到档位后保持末档奖励','验证断签后重领奖励使用首日档位']],
 ['REQ-17296eaada9b',['验证全部任务页限定当前任务范围']],
 ])aliases.set(id,names);
complete(`
REQ-610c705cfcda REQ-d314df3cff19 REQ-1b58b1ed94b0 REQ-50e085ca969a REQ-51536ff56a6e
REQ-fb7a66574dee REQ-e3d637f9e33c REQ-cc8c1531ecca REQ-bdb476925878 REQ-14b78bcef384
REQ-63b504130be0 REQ-33cd853bde92 REQ-5622d43e4988 REQ-ff8eb7db5623 REQ-585b985a1698
REQ-2dda033a20f8 REQ-fc5e1fb4082c REQ-d8f336113fe5 REQ-7a1502e92272 REQ-f03e5c1e9d4b REQ-d59abe359d67
REQ-b590092f3dcb REQ-80976be5ecd9 REQ-ffd3db36d66c REQ-38ca02441e58 REQ-22a07b71d6ae
REQ-c29508343d1a REQ-66e0fe389af9 REQ-502104d46b3e REQ-62b9f0287e85 REQ-436465a0d905
REQ-2c7116060751 REQ-b504ff31752f REQ-eeb943a25f48 REQ-a35ad3f561e3 REQ-8b21f9d739b7
REQ-b104da1ab1ba REQ-dc1e8196cb18 REQ-11b764425a5b REQ-b1de0a2b3ab1 REQ-7a70be127373
REQ-a3bc08b67703 REQ-a7a3ffdc822a REQ-87476f9cd323 REQ-c977e00cbaac REQ-6b6017e3470c
REQ-df46e6a0e6d5 REQ-809cf95d3b51 REQ-16d586a8ca94 REQ-3d16e43a8a3c REQ-438043ed7c5f
REQ-67390faddcce REQ-42995c9e0385 REQ-dbc47dfa9ef4 REQ-9a7e95a36a10 REQ-6fdece9d90ed
REQ-5694b9ddb522 REQ-90c67d2e3663 REQ-24be7f6754fb REQ-e37bfb986468 REQ-765a66d04ea9
REQ-a95405fe5f1e REQ-effa6d967b5b REQ-65c34a5aad5a REQ-b1aadbc4d1de REQ-e4a92d30d05c
REQ-269017c35087 REQ-17296eaada9b REQ-a0c94350d760 REQ-5e8c851b824e REQ-19351ae55401
REQ-de47603f63a7 REQ-851b017b646d
`,'回读用户端首页、榜单、搜索和福利条款及完整条件动作结果，补充排序末级、统计排除、搜索路径、状态及奖励结果后逐条核销；复合条款剩余未验证结果仍留在未覆盖记录。');

// A shared source is resolved separately for each actual observation end.
// This never promotes the corresponding user/admin projection.
for(const [id,names,question]of [
 ['COMMON-95e83ef767c6',['验证公会App选择中文','验证公会App选择English','验证公会App选择Bahasa Indonesia','验证公会App选择Bahasa Melayu']],
 ['COMMON-0d965f33aa95',['验证公会通过后提交平台终审','验证公会驳回入会形成终态','验证确认通过退会移除在会关系','验证驳回退会保留在会成员']],
 ['COMMON-269bae4eea1c',['验证公会关闭主播开播权限','验证平台锁定后公会不可改权限','验证解锁后恢复公会原设置']],
 ['COMMON-a8d955d06d40',['验证确认发送当前公会消息','验证单选主播完成后回填消息对象','验证已发送运营消息不可编辑撤回']],
 ['COMMON-813957ad87c9',['验证公会长有效凭证登录','验证运营账号不能冒用公会登录']],
 ['COMMON-c7f3eedbe8f6',['验证公会长有效凭证登录']],
 ['COMMON-f00c81286af7',['验证公会长有效凭证登录','验证切换到另一可管理公会']],
 ['COMMON-c2691c662788',['验证停用公会长不能登录']],
 ['COMMON-e8e6970fb708',['验证公会通过后提交平台终审','验证公会通过后审核进度停在平台节点']],
 ['COMMON-a25ee32928e3',['验证公会驳回入会形成终态','验证公会驳回后再次申请重新进入审核','验证公会驳回重申后旧单保持只读']],
 ['COMMON-b177d41ae986',['验证入会驳回列表区分平台驳回','验证平台驳回后新单重新公会审核','验证平台驳回重申后旧单保持只读']],
 ['COMMON-b11c07f47a8c',['验证平台通过后查看主播主页','验证入会进度识别平台终审已通过']],
 ['COMMON-68b280940942',['验证公会通过后提交平台终审','验证公会驳回入会形成终态']],
 ['COMMON-cf96d59ce5a9',['验证公会驳回重申后旧单保持只读','验证公会驳回后再次申请重新进入审核']],
 ['COMMON-8dfadd74874e',['验证公会通过后审核进度停在平台节点']],
 ['COMMON-a058cc166ad9',['验证平台驳回重申后旧单保持只读','验证平台驳回后新单重新公会审核']],
 ['COMMON-d28d93e4fa88',['验证确认通过退会移除在会关系','验证驳回退会保留在会成员']],
 ['COMMON-6a3d2022d96e',['验证退会驳回结果展示当前申请状态','验证已处理退会申请不能重复审核']],
 ['COMMON-c23a903fde96',['验证确认通过退会移除在会关系','验证历史退会主播不提供管理操作']],
 ['COMMON-2800272a2a99',['验证公会停用后阻止该公会管理账号登录']],
 ['COMMON-407ce807e243',['验证平台关权后查看公会权限关闭状态','验证平台关权后查看公会权限只读限制']],
 ['COMMON-4f9a728835ba',['验证平台开启锁定时显示平台权限','验证平台锁定后公会不可改权限']],
 ['COMMON-30526b0d36b1',['验证解锁后恢复公会原设置']],
 ['COMMON-67dfcb9cc602',['验证解锁后恢复公会原设置','验证平台开启锁定时显示平台权限']],
 ['COMMON-bf5048ae6d5d',['验证普通礼物和定制礼物计入主播收益']],
 ['COMMON-da0ac371d02d',['验证普通礼物和定制礼物计入主播收益']],
 ['COMMON-130830d550c8',['验证幸运礼物返奖0时主播收益','验证幸运礼物返奖1000时主播收益','验证首页幸运收益排除返奖0','验证首页幸运收益排除返奖1000']],
 ['COMMON-63f866ed9999',['验证公会场次收益计入门票实际消费']],
 ['COMMON-0ff492f5bb93',['验证公会主播分成不提供线上审批','验证公会分成记录没有在线计算']],
 ['COMMON-2ce558422761',['验证平台锁定后公会运营账号只读','验证平台锁定运营账号不能启停','验证平台锁定运营账号不能发放','验证平台解锁后公会恢复运营账号管理']],
 ['COMMON-562f91939729',['验证已建运营账号发放上限取双额度小值','验证账号剩余50公会剩余100发放51','验证账号剩余100公会剩余50发放51','验证账号剩余50公会剩余100发放50','验证账号剩余100公会剩余50发放50']],
 ['COMMON-199ccb8212b6',['验证公会禁用账号后状态变更','验证重新启用已禁用运营账号','验证发放虚拟金币后余额更新'],'Q-005'],
 ['COMMON-0993b8696b18',['验证公会禁用账号后状态变更','验证重新启用已禁用运营账号','验证发放虚拟金币后余额更新','验证运营余额按成功发放减消费'],'Q-005'],
 ['COMMON-9143156058fc',['验证公会运营账号列表进入创建页'],'Q-005'],
 ]){
 const key=`公会App:${id}`;aliases.set(key,names);
 decisions.set(key,{状态:question?'部分覆盖':'已覆盖',...(question?{问题编号:question}:{}),说明:'已按来源角色和本端观察入口核对公会App投影；这些场景只核销公会端的操作和可见结果，用户端与管理后台保持各自独立处理记录。'+(question?' 创建账号的合法登录名受Q-005影响，未以抽象的有效账号作为正式测试数据。':'')});
}
for(const [id,names]of [
 ['REQ-5f61f44b53b1',['验证公会长有效凭证登录','验证公会登录漏填公会账号']],
 ['REQ-76a4e00d61ef',['验证公会长有效凭证登录','验证运营账号不能冒用公会登录']],
 ['REQ-347fa03b678b',['验证公会驳回后再次申请重新进入审核','验证平台驳回后新单重新公会审核','验证公会驳回重申后旧单保持只读','验证平台驳回重申后旧单保持只读']],
 ['REQ-894cab3df5ee',['验证公会驳回后再次申请重新进入审核','验证平台驳回后新单重新公会审核','验证公会驳回重申后旧单保持只读','验证平台驳回重申后旧单保持只读']],
 ['REQ-10ced19ffe25',['验证通知列表打开选中通知','验证通知关联记录点击后保持业务对象']],
 ['REQ-946b654076e0',['验证主播列表按主播ID查找','验证主播列表按部分昵称查询','验证已退会搜索与状态取交集','验证已退会状态和主播ID搜索取交集']],
 ['REQ-37610426be25',['验证主播业绩默认日期周期','验证主播业绩显示已定义日期选项']],
 ['REQ-cc076c5df509',['验证退会主播不能修改公会开播权限','验证平台锁定后公会不可改权限','验证公会关闭主播开播权限']],
 ['REQ-290b9184d089',['验证全体主播消息确认显示接收人数','验证单选主播完成后回填消息对象']],
 ['REQ-8eb222b06950',['验证确认发送后消息正文形成快照','验证已发送运营消息不可编辑撤回','验证接收主播退会后保留发送快照']],
 ['REQ-7646c62698b9',['验证平台锁定不会改成禁用状态','验证公会禁用账号后状态变更','验证重新启用已禁用运营账号']],
 ['REQ-d4d0020a6fb9',['验证公会禁用账号后状态变更','验证重新启用已禁用运营账号']],
 ['REQ-43f811c0f6ae',['验证运营赠礼明细使用实际接收主播','验证运营送礼明细核对主播名称']],
 ['REQ-ec36dd70dcff',['验证选择运营账号后保留送礼日期','验证取消运营账号全选']],
 ['REQ-38b9fe91cceb',['验证核对公会分成入账时点对应当前业务记录','验证公会分成按入账时间排序']],
 ['REQ-8ca419878fbb',['验证公会改密当前密码不能为空','验证公会修改密码：提示“当前密码错误”']],
 ['REQ-e6fec0352ac9',['验证公会新密码不足8位','验证公会改密新密码不能为空','验证公会修改密码：提示“新密码不能和旧密码一样”','验证公会密码恰好8位可保存']],
 ['REQ-d37771cb543f',['验证公会业绩首次进入选择本月','验证公会日业绩显示日期选项']],
 ['REQ-91564db9a916',['验证核对主播分成入账时点对应当前业务记录','验证通知发送时间采用本端日期时间格式']],
 ['REQ-bc96b41ae0a2',['验证主播分成按入账时间排序','验证主播分成跨月按入账时间筛选']],
 ])aliases.set(id,names);
complete(`REQ-5f61f44b53b1 REQ-76a4e00d61ef REQ-dda7dbff3ea0 REQ-225adc4fd6df REQ-d823c785cbbd
REQ-2148c0172896 REQ-11aaa73d412a REQ-4d0543771bfa REQ-10ced19ffe25 REQ-90d3a493f427
REQ-347fa03b678b REQ-894cab3df5ee REQ-291af42ec723 REQ-d6b381f70c6f REQ-4e84386ce9a6
REQ-946b654076e0 REQ-8e961a9af293 REQ-37610426be25 REQ-601776b12c53 REQ-cc076c5df509
REQ-1a81bbf86bd2 REQ-5bf9d823291d REQ-49bae997141c REQ-84fcbbb4bde2 REQ-c8958e03713f
REQ-290b9184d089 REQ-8eb222b06950 REQ-3711cde5fe62 REQ-bea99a86a3b3 REQ-7646c62698b9
REQ-366c4df6d782 REQ-d4d0020a6fb9 REQ-679e814edf80 REQ-bcb12c6e3d70 REQ-36de063203a5
REQ-43f811c0f6ae REQ-ec36dd70dcff REQ-70ec7b1e0c3d REQ-8ca419878fbb REQ-e6fec0352ac9
REQ-ebcb7b632099 REQ-55e89c691eee REQ-58b2254a0941 REQ-bb3258b612d5 REQ-2193ff33f58c
REQ-fbc17ab917b7 REQ-532e40bab209 REQ-d37771cb543f REQ-1c1f3cfd5125 REQ-1e99a6258a1d
REQ-b4a379f3681c REQ-7f9821d8e4a3 REQ-e9c530534e0b REQ-bc96b41ae0a2 REQ-38b9fe91cceb
REQ-74d9c44c037d REQ-9b94ebc6e08d
`,'补齐公会端数据归属、当前及历史状态、返回回填、筛选边界和同端观察结果后核销；全生命周期及跨端业务总则单独保留投影记录。');

for(const [id,names]of [
 ['REQ-f5e1772e02cc',['验证消息中心进入系统通知','验证消息中心进入互动通知','验证消息中心进入私信','验证消息中心进入粉丝团群聊']],
 ['REQ-cf86a38c7fdc',['验证系统与互动入口固定置顶','验证消息时间相同按会话ID排序','验证私信与群聊按最后消息时间混排']],
 ['REQ-384b56a6e981',['验证消息时间相同按会话ID排序','验证私信与群聊按最后消息时间混排']],
 ['REQ-70c26fde6a02',['验证消息中心隔离其他登录账号会话','验证消息中心进入系统通知','验证消息中心进入互动通知']],
 ['REQ-598d4368f3a8',['验证我的页面展示本人用户 ID','验证我的页面按现存关系统计好友数']],
 ['REQ-b341ff28103d',['验证粉丝列表不区分大小写搜索nad','验证粉丝头像进入普通用户主页','验证粉丝头像进入主播主页']],
 ['REQ-d7aceb72d38e',['验证关注列表不区分大小写搜索nad','验证关注头像进入普通用户主页','验证关注头像进入主播主页','验证从关注列表进入在播主播']],
 ['REQ-bc5973b1255d',['验证拉黑后待处理好友申请失效','验证失效好友申请显示明确终态']],
 ['REQ-6af5fa2eb1d1',['验证好友申请通过后接收人新增好友','验证拒绝好友申请后列表不新增好友','验证失效好友申请显示明确终态']],
 ['REQ-3e38745b24e3',['验证新好友申请到达接收人','验证同意待处理好友申请','验证拒绝待处理好友申请','验证失效好友申请显示明确终态']],
 ['REQ-339118822a36',['验证确认删除好友解除关系','验证删除好友后清空当前聊天记录','验证被对方删除好友后聊天历史清空']],
 ['REQ-b8b4a1d18c79',['验证拉黑关系下发送文本','验证拉黑关系下发送图片','验证拉黑关系下发送语音']],
 ['REQ-6d45893c3c86',['验证商城排除不可售道具','验证已经获得的道具不能再购买','验证运营账号打开我的装扮']],
 ])aliases.set(id,names);
complete(`REQ-874fb8d9359c REQ-f71c9492f7e0 REQ-8c4e64406efd REQ-146bb03be8d7
REQ-f5e1772e02cc REQ-1156e7febc84 REQ-cf86a38c7fdc REQ-27293b9bf97f REQ-68cc65a496e1
REQ-384b56a6e981 REQ-db7132129157 REQ-811c6e17b306 REQ-35040a540533 REQ-5f92dd100dc8
REQ-6737e9c0a4ce REQ-69afc5771ebd REQ-0ebf55274729 REQ-114528b1be6b REQ-2e5fdda15b11
REQ-ad00e259e21c REQ-4dea09d7c768 REQ-37abd32eccf8 REQ-2f242c5620c8 REQ-323dc321b2b6
REQ-ff4f555990c0 REQ-dc66cdb2b110 REQ-97280db93d84 REQ-744a361be5cb REQ-9228f6e38779
REQ-f35201aeadba REQ-b341ff28103d REQ-de5f500a9898 REQ-e2f4dcbc4e3f REQ-7cbc8e603094
REQ-f7f6e22591a8 REQ-cbcc00a5c60e REQ-e38e92f87865 REQ-15eccc5e998d REQ-d7aceb72d38e
REQ-d94699afffc3 REQ-3662d9948b9d REQ-053041f9a307 REQ-3c5dc1c24bbd REQ-f95e0e1fbdc3
REQ-d01803cda0ad REQ-be10bfca660b REQ-0bf0bf9c7368 REQ-815416aefa21 REQ-225dafdafaf3
REQ-c68783fb1232 REQ-6d45893c3c86 REQ-c9eca67d7255 REQ-7b33379f063e REQ-12dabb818af0
REQ-ca7827915d33 REQ-b8b2df21d338 REQ-965669a50779 REQ-85dbd5ef7455 REQ-5b91148502a9
REQ-6f25bb640903 REQ-409fffcd563c REQ-fe3ff3fa6f4a REQ-4a2157d327b0 REQ-94bff089626b
REQ-003ea768237b REQ-5487b7310161 REQ-36af49b76e5d REQ-00af40de8ba1 REQ-f88c66cf2194
REQ-3defb9627768 REQ-1a1d9e60c302 REQ-f39e2d7eac8b REQ-27c3fbee902d REQ-8b00fecf06a8
REQ-7ff85c42b2fb REQ-a545270e12c5 REQ-6d9a1458a8b3 REQ-e2ef3227a460 REQ-e1dfcc8eb745
REQ-3e38745b24e3 REQ-f4405460d518 REQ-6af5fa2eb1d1 REQ-4157b86c49f5 REQ-22a89cc204f8
REQ-fdaee7eaa9ac REQ-bc5973b1255d REQ-7fba5902db42 REQ-51ae2f7e87d9 REQ-44d578238dc8
REQ-b8b4a1d18c79 REQ-339118822a36 REQ-5b2e1ca7fbf9 REQ-a9f8a0bc0f01 REQ-a11b5b0f63a1
`,'已逐条核对社交会话、通知、关系、装扮和直播结束页的本端可观察结果；本轮补入双方关系变化、时间及ID排序、拒收计数和页面数据隔离。涉及额外跨端动作或复合规则未核销部分继续保留。');

// Reviewed duplicate clauses share the same executable scene; no extra cases are emitted.
for(const [ids,names]of [
 ['REQ-6c79fce41141',['验证点击已经结束的直播分享卡片']],
 ['REQ-28245a39d420',['验证礼物展馆只计成功数量','验证展馆展示未收到的目录礼物']],
 ['REQ-940a4ef0b2e3',['验证团榜累计各类成功礼物价值']],
 ['REQ-8185eb3f1eda',['验证用户主页粉丝数量','验证用户主页关注数量','验证用户主页送礼累计']],
 ['REQ-aad36cadfeac REQ-28bedb3d9986',['验证首次登录进入首页提示通知授权']],
 ['REQ-78522c7aef85 REQ-d4c32c66677e',['验证首次通知说明展示用途及两种选择']],
 ['REQ-e477ec7cbc1b',['验证首次登录进入首页提示通知授权','验证通知说明选择开启通知后再次登录','验证通知说明选择暂不开启后再次登录']],
 ['REQ-5866d8110212',['验证通知说明开启按钮请求系统授权','验证暂不开启通知时不请求系统授权','验证通知说明选择暂不开启后再次登录']],
 ['REQ-bfc8be88e588 REQ-f40ca1136389 REQ-1a1733d433d5',['验证首次系统通知选择允许','验证首次系统通知选择不允许']],
 ['REQ-52689d9dbfaf REQ-b2643c7dc725',['验证通知权限未申请时进入设置']],
 ['REQ-c7c2a06596e9 REQ-67f289b5e495',['验证通知权限已拒绝时进入设置']],
 ['REQ-bce6ea876eaa REQ-44618f2bda0b',['验证通知权限已授权时进入设置']],
 ['REQ-05db870200db',['验证通知权限已拒绝时进入设置','验证开启互动通知不改变已拒绝系统权限','验证开启开播提醒不改变已拒绝系统权限']],
 ['REQ-02f50c5cf61f',['验证关闭开播提醒不改变互动通知']],
 ['REQ-39fb463d1b2c',['验证设置页显示密码未设置']],
 ['REQ-35ded3ea58b0 REQ-358866015834',['验证初次设置密码后使用手机号登录','验证初次设置密码后使用邮箱登录']],
 ['REQ-ead183854af5',['验证手机号验证后设置密码','验证登录密码与确认值不一致']],
 ['REQ-ca890d3dcce6',['验证手机号验证后重置密码','验证新密码与确认值不一致']],
 ['REQ-cf00fca1b85e',['验证手机号验证后设置密码','验证邮箱验证后设置密码','验证错误验证码提交登录密码','验证失效验证码提交登录密码','验证已使用验证码提交登录密码']],
 ['REQ-e7241dcf1a97',['验证手机号验证后重置密码','验证邮箱验证后重置密码','验证错误验证码提交新密码','验证失效验证码提交新密码','验证已使用验证码提交新密码']],
 ['REQ-368c512806db',['验证设置密码验证码输入空值','验证设置密码验证码输入12345','验证设置密码验证码输入1234567','验证设置密码验证码输入12a456','验证登录密码长度7被拒绝','验证登录密码恰好8位完成提交']],
 ['REQ-5f6e725529fd',['验证重置密码验证码输入空值','验证重置密码验证码输入12345','验证重置密码验证码输入1234567','验证重置密码验证码输入12a456','验证新密码长度7被拒绝','验证新密码恰好8位完成提交']],
 ['REQ-a404186832b4',['验证从修改密码进入重置流程','验证手机号验证后重置密码','验证邮箱验证后重置密码']],
 ['REQ-26bff3d7427b',['验证重置密码后使用新密码登录','验证重置密码后使用旧密码登录']],
 ['REQ-2568b2aa4aee',['验证修改密码后使用新密码登录','验证修改密码后使用旧密码登录']],
 ['REQ-c93af8d76be2',['验证选择新区号后保留手机号草稿']],
 ['REQ-97ff2f57ecda',['验证手机号认证命中注销冷静期','验证邮箱认证命中注销冷静期']],
 ['REQ-845b4bbf84ed',['验证注销冷静期内暂不取消申请','验证注销冷静期内恢复账号']],
 ['REQ-e2368fc28d21',['验证选定礼物数量后显示所需金币']],
 ['REQ-3ca7c3b2c774',['验证密码房开启广场展示','验证密码房关闭广场展示','验证初次设置密码房访问开关']],
 ['REQ-4bedc9a19849',['验证密码房不可发起连麦']],
 ['REQ-a4ddee5fdfc4 REQ-864985142d88',['验证修改密码不踢出已经准入观众','验证密码更新后旧密码重新进房']],
 ['REQ-f057de01c25a',['验证本场禁言阻止公屏发言','验证本场禁言不阻止观看','验证本场禁言仍可赠送普通礼物','验证本场禁言仍可与好友私信','验证上场禁言不带入新场次']],
 ['REQ-9af627af6297',['验证上场禁言不带入新场次']],
 ['REQ-2bccad5544d4',['验证房管不能禁言主播本人']],
 ['REQ-5344fcc58302 REQ-b7ca7912b354',['验证快捷答谢只预填目标观众文案','验证打开快捷答谢不自动发送']],
 ['REQ-ff25c01afcb1',['验证快捷答谢只预填目标观众文案']],
 ['REQ-0819d6cfa48e',['验证房管满3人时点击添加','验证添加房管搜索排除双方存在账号拉黑关系']],
 ['REQ-5a81b3070058',['验证双方拉黑自动取消房管','验证取消拉黑不恢复房管']],
 ['REQ-f4ce4badd79b',['验证结束直播后保留房管授权']],
 ['REQ-b8b4a1d18c79',['验证拉黑关系下发送文本','验证拉黑关系下发送图片','验证拉黑关系下发送语音','验证本账号拉黑甲后清理私信会话']],
 ])for(const id of ids.split(' ')){
 const key=`用户App:${id}`;
 aliases.set(key,[...new Set([...(aliases.get(key)||[]),...names])]);
 // Some compound clauses below intentionally remain partial despite linked scenes.
 if(!['REQ-c93af8d76be2','REQ-5344fcc58302','REQ-b7ca7912b354','REQ-2bccad5544d4','REQ-b8b4a1d18c79'].includes(id))decisions.set(key,{状态:'已覆盖',说明:'逐条回读当前正式条款；列出的本轮场景验证相同执行端、身份、条件和可观察结果。同页视图复用对应功能场景，不为重复说明新增用例。'});
}
for(const id of ['REQ-c93af8d76be2','REQ-5344fcc58302','REQ-b7ca7912b354','REQ-2bccad5544d4','REQ-b8b4a1d18c79','REQ-cf00fca1b85e','REQ-e7241dcf1a97'])decisions.set(`用户App:${id}`,{状态:'部分覆盖',说明:'本次回读发现复合分支仍不完整，保留已设计场景；区号表单完整恢复、答谢不产生日志、房管全部处置权限、主动拉黑发送拦截或验证失败后密码不变继续核对。'});
for(const id of `REQ-e0bfe26ba39e REQ-22f618bf6812 REQ-99b1d0952ccc REQ-bbe701b6f1a7 REQ-4fc991cd34e3 REQ-71a46a3267a6 REQ-a52e61150319 REQ-c93af8d76be2 REQ-c69c7286fec5
REQ-38ab03f09781 REQ-cd6279269c69 REQ-ebd04770613b REQ-a818b26feb5c REQ-7631abda0172 REQ-6aca265fbeaa REQ-71505557b4d9 REQ-3845ca28a192 REQ-f8a6abd0466c REQ-5f31a4be8f02
REQ-ad6e7c052282 REQ-fc4961f17554 REQ-5ff91b0709f0 REQ-5774dcebd724 REQ-4dde945be88c REQ-a13d09656728 REQ-7a459170bf05
REQ-e521ca8c0220 REQ-04e19edbdfd8 REQ-cf00fca1b85e REQ-9a03381a884e REQ-368c512806db REQ-f627112e8c5a
REQ-2568b2aa4aee REQ-a404186832b4 REQ-db64ce3eeaad REQ-0a60dd1daf1e REQ-42636fba5427 REQ-eae168e6c728 REQ-e7241dcf1a97 REQ-26bff3d7427b REQ-2dfc0ac54952 REQ-5f6e725529fd REQ-0015ab49705d
REQ-d84ab4e18694 REQ-362e0f933368 REQ-6069a3962a42 REQ-c3219f87f834 REQ-c6eb7b3bd094 REQ-3861789a522d REQ-269d917500e3 REQ-6377954ab1f2
`.trim().split(/\s+/))decisions.set(`用户App:${id}`,{状态:'已覆盖',说明:'本轮独立回读695至1139范围内条款后核对已有和补充场景；验证码、密码、表单回填、权限、排序及状态均以本端具体结果核销，未把其他复合条款一并关闭。'});
for(const id of ['REQ-a13d09656728','REQ-3845ca28a192'])decisions.set(`用户App:${id}`,{状态:'部分覆盖',说明:'语言选择后的抽屉关闭、最大输入长度之外不增加提示尚未单独验证，继续保留分支。'});

// These are end-specific projections reviewed against the source; cross-end outcomes remain in their own end's ledger.
for(const [ids,names,reason]of [
 ['REQ-1d3b1a61a3da',['验证首页进入今日概况','验证首页进入公会名称','验证首页进入通知','验证首页进入账号设置'],'已核对MainBasis登记的首页入口及各目标页面。'],
 ['REQ-8c9d20b12f67',['验证更换业绩日期后更新主播收益','验证更换业绩日期后更新开播人数','验证更换业绩日期后更新达标人数','验证切换日期更新主播业绩列表','验证从实际入口打开主播业绩下钻'],'日期变化后的三项指标、列表和主播下钻分别有可执行场景。'],
 ['REQ-25f5f780296f',['验证按账号ID搜索运营账号','验证运营账号按名称查询','验证公会运营账号列表进入创建页','验证运营列表打开对应账号主页'],'覆盖名称和ID检索、创建入口以及选中账号主页；不把创建入口等同于创建成功。'],
 ['REQ-26ba8fb92142',['验证创建运营账号必填名称','验证运营账号名称超过30字符','验证运营账号名称可以完整输入30字符'],'仅名称字段的必填、上边界及超长规则已验证；整张创建表单仍由Q-005保留。'],
 ['REQ-e479d67b9151',['验证未结清收益不能移出主播','验证已结清收益主播确认移出','验证公会移出主播后本公会场次结束'],'未结清禁止移出与成功移出后的关系、直播状态均有本端场景。'],
 ['REQ-3adcb5adabe3',['验证已结清收益主播确认移出','验证公会移出主播后本公会场次结束','验证移出主播后旧公会收益不继续增加'],'移出关系、结束场次及移出时收益归属边界已分开验证。'],
 ['REQ-48fe35060417',['验证指定主播消息未选收件人不能发送','验证全体主播消息确认显示接收人数','验证确认发送当前公会消息','验证确认发送后消息正文形成快照'],'正文必填和长度边界已有直接绑定；本次补接收人必填并核对确认、记录及返回结果。'],
 ['REQ-cbaa9bccc9de',['验证运营送礼记录默认范围','验证运营送礼记录提供全部日期选项','验证选择运营账号后保留送礼日期','验证运营送礼日期变化更新送礼列表'],'日期选项、默认范围和多选账号回填均已核对。'],
 ['REQ-5924278ce187 REQ-308eb014e34f',['验证公会长退出登录前确认','验证确认退出公会App','验证退出公会后旧会话不能访问受保护页面','验证从实际入口打开公会改密入口'],'二次确认、返回登录及退出后不能读取受保护资料已分别覆盖，改密独立入口也已关联。'],
 ['REQ-b5fab014efd8',['验证直播记录默认日期周期','验证直播记录显示已定义日期选项','验证主播日数据下钻携带当天日期'],'默认、可选日期和从上游带入日期均已核对。'],
 ['REQ-91564db9a916',['验证核对主播分成入账时点对应当前业务记录','验证主播分成入账时间采用本端日期时间格式'],'业务入账时点与公会端日期时间格式分别验证。'],
 ['COMMON-d54688abc00d',['验证公会场次收益排除虚拟失败和撤销消费'],'真实成功与虚拟、失败、未成功即撤销的消费放在同一统计数据集中区分。'],
 ['COMMON-6319948b0a96',['验证公会场次收益计入门票实际消费'],'公会端仅核销门票收益投影；用户端当前场次准入及财务分成由对应端另行核销。'],
 ['COMMON-d27644e0f3e9',['验证运营赠礼不增加主播收益'],'公会端仅核销虚拟礼物不形成主播收益的观察结果；公屏效果归用户端，分成上传归管理后台。'],
 ['COMMON-5b093ade08a8',['验证公会长有效凭证登录'],'公会端仅验证平台开通后的公会长登录资格，平台创建操作保留在管理后台。'],
 ])for(const id of ids.split(' ')){
 const key=`公会App:${id}`;aliases.set(key,names);decisions.set(key,{状态:'已覆盖',说明:reason});
 }

for(const [ids,names,reason]of [
 ['REQ-de3807b165f5',[], '封面、主题、主播、分类、进入事件计数、未进入排除、新场次归零均已有独立场景；结束固化由历史场次数据用例承接。'],
 ['REQ-032d02ff7202',['验证主播榜同值账号连续编号'],'主播等级缺失、财富等级缺失以及连续编号均有明确输入和结果。'],
 ['REQ-dda806a926fe',['验证搜索无结果时保留本次关键词'],'无匹配空状态与原关键词保留均已验证。'],
 ['REQ-c5a452d7a59c',[], '任务名称、当前值、目标值、奖励和领取状态均以当前后台配置验证。'],
 ['REQ-475a54eafba4',[], '启用与生效时间范围、停用不回收和奖励不自动发放均已拆分验证。'],
 ['REQ-7b0ddb4e6853',['验证连续签到成功后天数递增','验证签到奖励增加钱包余额','验证签到领奖生成金币流水'],'签到成功后的天数、入账、流水、按钮禁用和同日幂等均已验证。'],
 ['REQ-5ce22fbcbf43',['验证任务未达成时尝试领取','验证全部任务已领取实例不可重复发奖'],'未达成、分档独立领取和已领取不可重复均有场景。'],
 ['REQ-a25125d70fce',['验证任务达成但未领取时不增加金币'],'每日、每周、每月和无周期均验证次日失效；未领取不自动入账。'],
 ['REQ-4d23a709cc93',[], '成功入账、流水、重复请求幂等、失败保持待领取和重试成功均已验证。'],
 ['REQ-2fd2fd89cad9',[], '游客和运营账号各入口限制已逐项验证。'],
 ['REQ-745067340177',['验证每日任务进入新周期','验证每月任务进入新周期'],'补签限制、平台业务时区周期重置以及每周周一起点均有场景。'],
 ['REQ-7e61da43a58a',['验证全部任务显示未完成操作','验证全部任务显示已完成未领取且未过期操作','验证全部任务显示已成功领取操作'],'当前值、目标值及三种完成状态均已验证。'],
 ['REQ-5559d422b0d8',['验证全部任务已领取实例不可重复发奖'],'领取成功状态和再次点击不重复发奖均有场景。'],
 ['REQ-f35327960b0a',['验证邀请记录展示对应奖励','验证邀请记录翻到下一页'],'账号隔离、奖励、倒序和分页均已验证。'],
 ['REQ-cf791ac96f71',[], '上一页和下一页均有独立分页场景。'],
 ['REQ-70c26fde6a02',[], '私信、有效粉丝群、系统通知、互动通知和账号隔离均有入口或数据范围场景。'],
 ['REQ-a8bc8b325a1d',[], '只读、无业务操作、不创建私信会话以及不作为权限判断均由独立场景承接。'],
 ['REQ-1202c4bc134d',[], '余额展示、负余额消费拦截和各类不应变动余额的场景均已验证。'],
 ['REQ-ddaaf4fed01e',[], '未认证进入申请、已认证进入主播中心以及身份失效后的结果均已验证；开播权限矩阵另有专项用例。'],
 ['REQ-d9a5bfe92f81',[], '好友、粉丝、主播中心和充值各入口均已验证。'],
 ['REQ-f2de1a11c6f7',['验证未认证用户打开主播中心','验证已认证主播打开主播中心'],'按主播身份进入申请或主播中心的两条路径均已验证。'],
 ['REQ-d90fce78fe99',[], '两种联系方式的展示、复制和已复制结果均已验证。'],
 ['REQ-3434a58c5a0e',[], '0、3、5枚边界均验证顶部数量；重复布局属于本轮未要求的纯视觉测试。'],
 ['REQ-e070dc7c8308',[], '效果、名称、期限格式、金币价格和已获得状态均已验证。'],
 ['REQ-f4b3ed688780',[], '有效期内使用、永久道具以及配置变更不追溯已获得道具均有场景。'],
 ['REQ-c555704c1014',[], '永久或限时已持有均由重复购买限制承接，购买后不提供退款。'],
 ['REQ-70dd8eb618a6',[], '佩戴、卸下、失效、勋章上限、余额充足或不足及购买成功后的两条去向均已验证；纯排版不在本轮功能测试范围。'],
 ['REQ-57d7b7987914',['验证运营账号打开我的装扮','验证装扮购买成功后选择继续购买','验证装扮购买成功后选择去佩戴'],'运营身份限制、取消、提交前重新校验、扣款持有和成功后去向均已验证。'],
 ['REQ-ad9b3d091439',['验证运营账号打开我的装扮'],'普通用户余额不足不生成购买并可去充值，运营账号不进入流程。'],
 ['REQ-536e8dc9811f',[], '观众视角实时在线人数已有明确场次数据与观察结果。'],
 ['REQ-3265554039fb',[], '四种消息类型和服务端时间排序均已验证。'],
 ['REQ-c3541b3a350d',[], '本机清屏及不影响另一设备和服务端记录均有场景。'],
 ['REQ-3a6dfd7b6b8c',[], '可空和200字符上边界均已验证。'],
 ['REQ-15a86faa9547',[], '提交成功生成当前场次举报并返回直播间已有完整场景。'],
 ['REQ-3b17bb1c285c',[], '可空和200字符上边界均已验证。'],
 ['REQ-b833ded20cec',[], '同一主播重开后固定房间ID保持且生成新场次ID。'],
 ['REQ-30ff6858eb62',[], '在线用户保持准入，退出后旧密码失效均已验证。'],
 ['REQ-59b33810f50a',[], '确认后双方退出连麦但直播继续，取消后保持连麦均已验证。'],
 ['REQ-b8b4a1d18c79',[], '本账号主动拉黑及对方拉黑后的文本、图片、语音发送均验证失败。'],
 ['REQ-68f8be7ceb7b',[], '三类消息失败样式和不占用发送条数均已验证。'],
 ['REQ-8e296eb8f43e',[], '有效团籍成员的查看和发送均有场景，团籍失效由消息中心权限场景承接。'],
 ['REQ-2051c0423e38',[], '群消息、会话摘要、直播卡片两种状态及禁言下所有输入动作均已验证。'],
 ['REQ-8ab61657c659',[], '退出确认、退群去向以及免打扰不影响接收均已验证。'],
 ['REQ-a3f8844f142d',[], '本群数据隔离、通知设置、群主编辑权限和非群主拒绝均已验证。'],
 ['REQ-b02848ffd6b0',[], '单聊设置对象的头像、昵称、等级和勋章均按选中对象验证。'],
 ['REQ-84cd5972d20a REQ-07d1d331e75b',[], '免打扰仅影响通知且不影响收发均已验证。'],
 ['REQ-9ea07bd146dd',[], '拉黑确认、取消、确认后清理会话及举报入口均已验证。'],
 ['REQ-2df78e8bb05e',[], '黑名单账号头像和昵称均有对象隔离场景。'],
 ['REQ-1f877791fb70',[], '双向独立记录及只取消本人记录后的限制均已验证。'],
 ['REQ-0a0d3593195f',[], '两种拉黑方向均验证私信会话与记录清理。'],
 ['REQ-8bf90d3fcceb',[], '列表只包含本账号主动且未解除的拉黑记录。'],
 ['REQ-2e9fffbf12a8',[], '多条记录按实际拉黑时间倒序。'],
 ['REQ-dc6b639e06cc',[], '确认、移除、失败保持和失败提示均有场景。'],
 ['REQ-074e613f30ef',[], '默认KTP及KTP/SIM切换规则均有场景。'],
 ['REQ-323dde80f310',[], '五个必填项和切换证件清空正反面材料均逐项验证。'],
 ['REQ-bad8f6fb0e31',[], 'KTP和SIM完整提交均生成处理中申请并进入公会详情。'],
 ['REQ-069625c9e7d4',[], '有驳回原因展示及非驳回不展示均已验证。'],
 ['REQ-4eb845c0acb5 REQ-0ecd6ef481b8',[], '申请时姓名电话与两种证件材料均按申请快照只读验证。'],
 ['REQ-b2bd124d4b62',[], '公会审核、自动平台审核、平台终审及两级驳回状态均有场景。'],
 ['REQ-bf514b5e5019',[], '资料快照、个人资料变更隔离、只读材料和不泄露文件名均有场景。'],
 ['REQ-e70124732d4d',[], '有效在会入口、处理中及所有其他关系状态均已验证。'],
 ['REQ-2bf36b331c84',[], '头像昵称和用户ID由对象身份场景验证，签名及有效装扮分别验证。'],
 ['REQ-8fec17f7d1fc',[], '查看对象隔离、社交统计和粉丝团按本次加入时间倒序均有场景。'],
 ['REQ-b10390f6b485 REQ-a851490af66d',[], '下架历史保留、幸运礼物按件及返奖不影响收益分别验证。'],
 ['REQ-0677e72606b3 REQ-74b6f65f0732',[], '等级来源、运营虚拟金币排除、边界门槛、退团清零与重入从0均有场景。'],
 ['REQ-dcfbbae26a94',[], '成功赠礼口径、运营金币排除以及入团前后和退团期间历史贡献均已验证。'],
 ['REQ-b92d5b15ccb',[], '无有效团籍空状态及卡片隐藏均已验证。'],
 ['REQ-a4ddd4d12019',[], '未上榜与缺失数值0均已验证。'],
 ['REQ-13b8f847315',[], '主播等级门槛、分成前累计收益、运营金币排除和财富等级隔离均有场景。'],
 ['REQ-3437b6f2b77',[], '账号、公会、身份及平台/公会权限矩阵和锁定恢复均已验证。'],
 ['REQ-48c213d72b3',[], '今日和本月四项指标更新及本月隐藏当日进度均已验证。'],
 ['REQ-717f12734eeb REQ-b807580c78cb',[], '各功能入口、通知角标0和非0、阅读归零均已验证。'],
 ['REQ-0a6ff1916fd6 REQ-eb7e57bba37e',[], '房管身份资料、授权状态和0至3人数量边界均已验证。'],
 ['REQ-bb5de0b81123 REQ-335345631585',[], '拉黑自动解除、取消拉黑不恢复、跨场次长期保留均有场景。'],
 ['REQ-0be527cc2d92',[], '候选过滤、3人上限、确认取消、拉黑自动移除和人数刷新均已验证。'],
])for(const id of ids.split(' ')){
 const key=`用户App:${id}`;
 if(names.length)aliases.set(key,[...new Set([...(aliases.get(key)||[]),...names])]);
 decisions.set(key,{状态:'已覆盖',说明:reason});
}

aliases.set('公会App:REQ-6795c54d10ea',[
 '验证确认通过退会移除在会关系',
 '验证公会通过退会后本公会场次结束',
 '验证公会通过退会后主播身份失效',
 '验证公会驳回退会后保留主播身份',
]);
for(const [id,names]of [
 ['REQ-e8a2b32cb1d2',['验证运营账号列表不进入真实用户资料','验证运营账号主页不提供粉丝团关系']],
 ['REQ-c2d7804c13c5',['验证运营账号余额仅为虚拟金币账户','验证运营账号不提供充值','验证运营账号不提供任务领取','验证创建运营账号扣减本公会发放额度']],
 ['REQ-1a64eca3ec7e',['验证创建运营账号扣减本公会发放额度','验证运营账号余额仅为虚拟金币账户','验证运营账号不提供充值','验证运营账号不提供任务领取']],
 ['REQ-74a5fc1cae99',['验证运营账号主页不提供粉丝团关系','验证运营账号余额仅为虚拟金币账户','验证运营账号不提供充值','验证运营账号不提供任务领取','验证运营账号成功赠送普通礼物','验证运营账号成功赠送定制礼物','验证运营账号不能消费装扮','验证运营账号不能消费门票']],
 ['REQ-93bf5f228dfe',['验证运营账号成功赠送普通礼物','验证运营账号成功赠送定制礼物','验证运营账号不能消费幸运礼物','验证运营账号不能消费装扮','验证运营账号不能消费门票','验证运营账号送礼不增加主播收益']],
 ['COMMON-a506d1ba7fc6',['验证公会资料保存新名称','验证公会关闭主播开播权限','验证公会运营账号列表进入创建页']],
 ['COMMON-24860e2957eb',['验证同一用户只保留一笔待处理入会申请']],
 ['COMMON-6d5135e2a5e9',['验证公会通过退会后主播身份失效','验证已结清收益主播确认移出']],
 ['COMMON-1ce61a4d7a7f',['验证主播列表隔离其他公会','验证平台锁定后公会不可改权限']],
 ['COMMON-bd5e753d5836',['验证公会关闭直播权限后本公会场次结束','验证公会关闭直播权限后不产生新场次']],
 ['COMMON-46433bf57a2e',['验证充值退款不清除公会历史赠礼收益']],
 ['COMMON-f0607f6c831c',['验证运营账号余额仅为虚拟金币账户']],
 ['COMMON-35690b6dca09',['验证运营账号不提供真实金币转换']],
 ['REQ-fa31c1b4ff57',['验证运营账号成功赠送普通礼物','验证运营账号成功赠送定制礼物','验证运营账号不能消费幸运礼物','验证运营账号不能消费装扮','验证运营账号不能消费门票','验证运营账号送礼不增加主播收益']],
 ['COMMON-f8c69c571a96',['验证公会资料保存新名称','验证公会运营账号列表进入创建页']],
 ['COMMON-fc5d9799ad43',['验证查看申请本人照片','验证公会通过后提交平台终审','验证平台通过后查看主播主页']],
 ['COMMON-ae6833bd3c45',['验证公会关闭主播开播权限','验证平台开启锁定时显示平台权限']],
 ['COMMON-8596cdf4529b',['验证公会关闭主播开播权限','验证平台锁定后公会不可改权限']],
 ['COMMON-6c46c1bb4e31',['验证同一主播重复开播保留不同场次']],
 ['COMMON-6f618a11e7ac',['验证核对场次标题快照对应当前业务记录','验证公会直播记录识别普通房','验证公会直播记录识别门票房','验证公会直播记录识别密码房']],
 ['COMMON-05076d6c126a',['验证直播结束后公会保留历史消费','验证直播结束后公会保留历史收益']],
])aliases.set(`公会App:${id}`,names);
for(const [ids,reason]of [
 ['REQ-4340cddd681f REQ-65bacefcfad7','充值与消费流水的订单对象、金币组成、渠道、状态、商品、数量、主播、场次、只读和退款留存均逐字段验证。'],
 ['REQ-93d9effd8339 REQ-223369b89fdf','违规来源、结论、处置和时间完整；账号状态与直播权限分别验证。'],
 ['REQ-ff26b743bf25 REQ-9408e8c3e0e5','公会管理锁定与恢复、已确认违规及处理时间均有场景。'],
 ['REQ-62f7dcbf9328 REQ-02516cf3f2f2 REQ-1498d5602eea','认证三种状态、筛选交集、详情材料快照均已验证。'],
 ['REQ-36d4a8d0a3c5','同一主播两次开播的场次ID不同，固定直播间ID由场次详情关联验证。'],
 ['REQ-f44c28a689fd REQ-ec07d4e6110a','巡房人员、时间、问题、处置、备注及警告和关播的状态影响均有场景。'],
 ['REQ-f1021736ae60','排班编号在多条创建记录间验证全局唯一。'],
 ['REQ-3dce5fc17d88 REQ-0ba1537bb69a REQ-a7e7f32afe6c','日期必填与过去日期、起止时间严格先后、至少一人和人员去重均有边界场景。'],
 ['REQ-19644b1222aa REQ-100ebfc3040b REQ-ea09814f85e3','机审只供人工判断、四种审核状态及快捷忽略终态均已验证。'],
 ['REQ-69bd30677d4e REQ-e5a05ea16815 REQ-3821dbd6e991 REQ-cf97d60c073c','机审和账号举报的各状态、终态幂等、复审继续处理及举报不直接处罚均有场景。'],
 ['REQ-5384f8dda683 REQ-65ff1bb42a1e REQ-ce8947a535d7 REQ-850a5fb9f58c REQ-4477842217d4 REQ-a1fe662c2177','直播举报的场次、类型快照、直播状态、处理状态、提交时点和下播自动作废均逐项验证。'],
 ['REQ-cb55e9138675 REQ-567b55982c28 REQ-b35090e63133 REQ-b2602d97ce7d REQ-cbb4cfb5af43','举报对象、证据快照、合法处置、处罚原因、通知、终态和不可重复处理均已验证。'],
 ['REQ-dc42b9ce82a9 REQ-9076e834a8a8 REQ-5c08d6d39116 REQ-2211d067ff7e REQ-05902bd4c917 REQ-7fa2fbd10c26','违规类型唯一ID、排序、语言、预置或自定义属性、启停、移动和删除均有场景。'],
 ['REQ-291ab46e0abb REQ-e4f918932a7f REQ-fd5b602b0915 REQ-2015efa700cb','违规类型编辑只读ID、四语必填及唯一、正整数排序和属性不可切换均有边界场景。'],
 ['REQ-8c958cf7125a REQ-881517c5aa69 REQ-9c703d5ca23c REQ-00fcb3af14ad REQ-b4b0bab3f928','公会身份、公会长账号、有效主播人数和启停解散状态及停用不改账号状态均已验证。'],
 ['REQ-3ff6dabb8f95 REQ-0874c2785ffd REQ-a89b757f821b REQ-9d62c568e295 REQ-fe87c3c027d8 REQ-7e8aa5a1b03d REQ-d5c6f1e4bced REQ-c8d50dae8436','公会详情ID、资料必填、管理账号唯一、状态独立、初始及重置密码、主播范围、收益和分别保存均有场景。'],
 ['REQ-075341f51350 REQ-83ed78759892 REQ-cf6da6aa2296 REQ-11918d0ffd1c REQ-d1989da16a8b REQ-6a104f27fd6b REQ-5606f2e794a3 REQ-7ddd1ccb9144 REQ-8104e086ef2d REQ-5b00bae56245 REQ-999b54a8fa06','普通及定制礼物的ID、四语、资源、价格、排序、排期、操作记录及保存删除去向均有场景。'],
 ['REQ-d49d62c3629e REQ-d9a4354e134a REQ-b241259b8ed6','定制礼物自动上下架、提前下架优先、历史快照和新增编辑入口均有场景。'],
 ['REQ-2d44490902b2 REQ-e6f55f39eb06 REQ-9ed9db1c7eb2','幸运收益比例0至100边界、保存对新赠送生效及礼物启停入口均有场景。'],
 ['REQ-bd189174454a REQ-34d0c9d5ca9c REQ-1c1e2d37fe4b REQ-22388921c69d REQ-e77b64c0cbe2 REQ-9a630a558353 REQ-ca5f4d94a55e','幸运礼物四语、唯一标识、资源、正整数消耗和次数、奖励档、概率总和、RTP公式和实时重算均有边界场景。'],
 ['REQ-a15539e59804 REQ-87ea14e0a1f3 REQ-25100e7e30da REQ-03268bba06f4 REQ-5091e2b4f960 REQ-b87fdc31a151 REQ-b10a3ffddb4e REQ-e93d1cf50adf REQ-c3430e6b8310 REQ-711d6073fe10 REQ-ff8a065e154b','道具固定类型、ID、四语、价格、资源、排序、期限和操作记录均有校验场景。'],
 ['REQ-3395e116d827 REQ-87e3faf3a54d REQ-21cce2493e21 REQ-7d9d364d9d9c REQ-42eb7ed3797f REQ-646b7bbc7593 REQ-45e435ce7336','赠送数量规则ID、顺序、礼物唯一关联、启停、正整数去重、拖动和至少一个礼物均有场景；默认数量仍由Q-004承接。'],
 ['REQ-fddcb57e1394 REQ-0d4de4506e78 REQ-803bf20b1fd4 REQ-9b4d4ca94e66','两个展示位置、素材数量、首尾包含和启用加周期状态均有场景。'],
 ['REQ-e6533c82295c REQ-a26775c4978a REQ-bcc06f97ec4a REQ-823f4c568bbc REQ-1312ebd01239 REQ-e2540fa05ceb REQ-6b5961fba3d8 REQ-25eb238706a9 REQ-52bea7986f91','轮播数量、素材、目标、共享周期、跨配置冲突、删除、添加、类型切换和逐行保存校验均有场景。'],
 ['REQ-319ba1ede3b6 REQ-f339c8fa382b REQ-6e1fce05cb71 REQ-44ae8f223463 REQ-2814c68c7817 REQ-9716123d14b2','推送ID与中文标题、成功去重人数、四语必填、目标用户和最后操作人均有场景。'],
])for(const id of ids.split(' '))decisions.set(`管理后台:${id}`,{状态:'已覆盖',说明:reason});

for(const [ids,reason]of [
 ['REQ-6543c415067c','指标卡最新自然日和截至该日最近7个自然日趋势分别有场景。'],
 ['REQ-31f26460a96e','当前财富等级、合法端点及负数、小数、上下限逆序均有场景。'],
 ['REQ-4025eed82fb6','首次注册时间以及筛选开始、结束时点包含均有场景。'],
 ['REQ-cc7a5d0e0aaf','封禁和解封的原因必填、确认、状态更新及操作留痕均有场景。'],
 ['REQ-4f968520df54','用户ID、昵称、手机号、地区、首次注册时间和当前账号状态均分别核对。'],
 ['REQ-b9f528b0b887','当前真实余额、退款负余额及负数时不生成成功消费记录均有场景。'],
 ['REQ-2b2646ab169a','设备型号、系统、应用版本、最近登录时间及在线离线状态均有场景。'],
 ['REQ-17a6bd3f25a2','退款扣回基础与赠送的整单到账金币，同时保留既有成功消费均有场景。'],
 ['REQ-6995740cd800','关闭权限后立即关播且再次尝试开播不生成新场次均有场景。'],
 ['REQ-73bc666615df','独立场次及房型、时长、消费、处置和收益快照均有场景。'],
 ['REQ-9703edb6d9d6','Tab加载、权限或账号操作的原因、确认、状态更新和留痕均有场景。'],
 ['REQ-2a33fdf388d2','审核前身份、驳回终止、新单重审和旧单只读隔离均有场景。'],
 ['REQ-9b0dc429c7eb','直播中与已结束查询、详情巡查和即时处置均有场景。'],
 ['REQ-4da53be953ab','结束后消息、消费、处置、收益留存及历史场次不可重开均有场景。'],
 ['REQ-238f32337fda','组合查询取交集、警告保持直播和关播立即结束均有场景。'],
 ['REQ-2d2ddb82262a','场次ID、主播、房型、标题和时间快照均有场景。'],
 ['REQ-973043de5a2a','排班编号、日期、时段、人数、状态和创建时间均有场景。'],
 ['REQ-05689d7dab25','巡房人员头像、昵称、用户ID、当前等级及有效行人数均有场景。'],
 ['REQ-e1c4173b8668','审核单、场次、主播、命中类型、风险和时间只读字段均有场景。'],
 ['REQ-38725abbe207','转人工复审与忽略两类明确处置选项及页面操作均有场景。'],
 ['REQ-5a4896d1fad6','处置原因必填、审核人和审核时间保存均有场景。'],
 ['REQ-dec051bc541b','公会查询、新建、启用、停用和解散入口均有场景。'],
 ['REQ-24899ab93370','未结收益阻断及结清解散后的账号、关系、身份和直播影响均有场景。'],
 ['REQ-68834a7974f0','新建进入编辑态及启停、解散确认后的状态和关联结果均有场景。'],
])for(const id of ids.split(' '))decisions.set(`管理后台:${id}`,{状态:'已覆盖',说明:reason});

for(const [ids,reason]of [
 ['REQ-e8a2b32cb1d2','运营账号由公会创建、进入运营账号主页而非用户资料且无粉丝团关系操作均有场景。'],
 ['REQ-c2d7804c13c5','仅虚拟金币、公会额度来源以及无充值和任务领取入口均有场景。'],
 ['REQ-1a64eca3ec7e','创建发放扣减所属公会额度，且账号仅有虚拟金币、无充值和任务来源均有场景。'],
 ['REQ-74a5fc1cae99','虚拟账户来源、粉丝团限制、充值任务限制、普通定制可用及装扮门票受限均有场景。'],
 ['REQ-93bf5f228dfe','普通和定制礼物可用，幸运、装扮、门票受限且虚拟送礼不增加主播收益均有场景。'],
 ['COMMON-a506d1ba7fc6','公会资料、主播权限和运营账号均有公会长操作场景。'],
 ['COMMON-24860e2957eb','同一用户仅一笔待处理入会申请有独立场景。'],
 ['COMMON-6d5135e2a5e9','主播申请退会与公会主动移出的身份失效路径均有场景。'],
 ['COMMON-1ce61a4d7a7f','公会主播范围隔离及平台权限优先锁定均有场景。'],
 ['COMMON-bd5e753d5836','关闭权限立即结束当前场次且再次开播不生成场次均有场景。'],
 ['COMMON-46433bf57a2e','充值退款不撤销已完成赠礼与收益有公会历史记录场景。'],
 ['COMMON-f0607f6c831c','运营账号独立虚拟金币账户有余额核对场景。'],
 ['COMMON-35690b6dca09','虚拟金币与真实金币无互转操作有独立场景。'],
 ['REQ-f955002a92d8','同一用户仅一笔待处理申请及驳回后新单重审均有场景。'],
 ['REQ-6795c54d10ea REQ-b0f181b59384','退会通过后的关播、关系解除和主播身份失效分别有公会端观察场景。'],
 ['REQ-6bec92629c2b','退会驳回后主播身份、公会关系保留及允许重新申请均有场景。'],
 ['REQ-d7578655d74c','关闭权限的二次确认、立即关播和再次开播不生成场次均有场景。'],
 ['REQ-37d509ce6e38','初始密码必填、5位不通过和6位边界通过均有场景。'],
 ['REQ-dcf9b5ec5baf','默认启用、可创建为禁用以及禁用后登录和送礼受限均有场景。'],
 ['REQ-6f2664020d2b','初始虚拟金币默认0、0与额度上限可用以及负数和超额度拦截均有场景。'],
 ['REQ-6c9432dc3f2d','禁用后登录送礼受限、历史余额记录保留及重新启用均有场景。'],
 ['REQ-ff9041624126','点击日消费带入筛选，发放与启停后的指标或状态刷新均有场景。'],
 ['REQ-9714708419d5','点击送礼记录进入详情并返回保留主播与日期条件均有场景。'],
 ['REQ-b40230356129 REQ-64e251686c55','警告、关闭场次、关闭权限和账号封禁的公会端直播与会话结果均有场景。'],
 ['REQ-dbc501aa1134','日数据和月数据切换后汇总、趋势及列表联动均有场景。'],
])for(const id of ids.split(' '))decisions.set(`公会App:${id}`,{状态:'已覆盖',说明:reason});
for(const id of ['COMMON-74bad1c3591d','COMMON-4732b5893ef6','COMMON-d1c217c973f7'])decisions.set(`公会App:${id}`,{状态:'不适用',说明:'该条描述的是主播在用户App发起开播时的最终权限结果；公会App只承载权限设置和锁定状态，实际开播分支由用户App用例覆盖。'});

for(const [ids,names,reason]of [
 ['REQ-35c36993dcc1',[], '游客可浏览两类榜单、分类列表、福利和邀请好友入口。'],
 ['REQ-97cb3650fe69',[], '直播间、搜索、消息、我的和其他账号动作均验证直接转登录。'],
 ['REQ-597d95281461',['验证粉丝团成员进入受限密码房仍需密码','验证非成员新进入成员限制房'],'广场展示开关仅改变热门可见性，成员限制和密码准入分别独立验证。'],
 ['REQ-4139f026c8d8 REQ-dc7a35b43bc7',[], '已签到日、今日和后续日及各自配置奖励均有场景，未采用原型示例金额。'],
 ['REQ-51fe12ad4a7c',['验证有效团籍成员发送群消息','验证团籍失效后移除卡片'],'有效团籍可访问发送，退会、移出和团籍失效后移除会话权限均有场景。'],
 ['REQ-3710d7115b92',['验证系统通知承接公会关系结果','验证系统通知承接主播身份结果','验证系统通知承接直播权限结果','验证系统通知承接平台系统通知结果'],'系统通知入口及账号、公会、主播和违规处理结果均有当前端场景。'],
 ['REQ-d0ff9a7f8a11',['验证我的页面展示本人用户 ID','验证我的页面按现存关系统计好友数','验证我的页面显示当前可用金币','验证我的页面进入我的装扮','验证未认证用户打开主播中心','验证已认证主播打开主播中心'],'本人资料、社交数量、金币及主要功能入口均由具体页面用例承接。'],
 ['REQ-598d4368f3a8',[], '成为主播后个人资料、好友关系和金币资产分别验证保持同一账号数据。'],
 ['REQ-f4134b455003',[], '三个分类及点击直接佩戴或卸下均已验证；每行数量属于本轮未要求的纯视觉排版。'],
 ['REQ-c3a40eb587e1',['验证装扮购买成功新增持有记录'],'购买、任务、活动和平台发放来源以及下架只限制新获得均有场景。'],
 ['REQ-fb48978f0710',['验证双方账号拉黑时不能重入直播','验证被当前主播拉黑后退出直播'],'账号封禁、双方拉黑和本场踢出均在同时具备其他准入资格时仍被优先拦截。'],
 ['REQ-d2757206555e',['验证房管不能拉黑巡房人员','验证房管无法踢出巡房人员','验证主播不能拉黑巡房人员','验证主播无法踢出巡房人员'],'有效巡房进入、客户端隐藏、服务端拒绝和权限失效后的普通规则均有场景。'],
 ['REQ-17cd027e4846',['验证非成员新进入成员限制房','验证主播开启成员限制保留已入房非成员','验证粉丝团成员进入受限密码房仍需密码','验证运营账号绕过粉丝团成员限制'],'进房时机、成员密码校验和运营账号成员限制豁免均已验证。'],
 ['REQ-295c521ac36a',[], '拉黑、踢出、非成员以及有无来源的返回路径均有场景。'],
 ['REQ-875e67d768ae',['验证房管不能拉黑巡房人员','验证房管无法踢出巡房人员','验证主播不能拉黑巡房人员','验证主播无法踢出巡房人员'],'有效巡房会话绕过拦截并展示巡房标识，两种角色的拉黑和踢出均受限。'],
 ['REQ-97aa091d1aad',['验证提交直播举报'],'直播中可提交且场次结束后不可新提交，未处理工单失效由场次结束结果承接。'],
 ['REQ-7baf19b73bc9',[], '当前查看账号及五种举报类型均逐项验证。'],
 ['REQ-629a0f171729',[], '平台与公会关权均结束当前场次，消息、消费、处置和收益分别验证留存。'],
 ['REQ-8f37c7bed24f',['验证取消房管先显示确认','验证主播确认禁言普通观众','验证取消恢复发言确认保留禁言','验证主播确认踢出普通观众','验证房管满3人时点击添加'],'设置或取消房管、禁言或恢复、踢出、结束直播和3人上限均有场景。'],
 ['REQ-558c541defc9',[], '有效团籍、单人禁言、全员禁言和平台限制四种发言状态均逐项验证。'],
 ['REQ-8eff93cc5e44',[], '主动退出后的团籍群籍失效、成长清零及关注保持均有场景。'],
 ['REQ-751406869dfa',['验证拉黑后执行者好友列表解除关系','验证拉黑后另一方好友列表解除关系','验证拉黑后待处理好友申请失效','验证拉黑主播后不能读取原群历史','验证双方拉黑自动取消房管'],'双方关注、好友申请、粉丝团群籍和房管关系均验证清理。'],
 ['REQ-d20b10262dbd',['验证本账号拉黑主播优先阻止进入直播'],'双方不能进入对方直播间以及主播在房内拉黑后立即退出均有场景。'],
 ['REQ-23b9731d40bc',[], '第三方直播间主页、提及以及第三方粉丝群主页入口均受限。'],
 ['REQ-80008cfc0d32',['验证取消拉黑后执行者好友列表解除关系','验证取消拉黑不恢复房管'],'关注、好友、好友申请、粉丝团、房管和私信会话均验证不自动恢复。'],
 ['REQ-ba33f73617a5',[], '正反面必填、图片格式和KTP/SIM对应材料提交均有场景。'],
 ['REQ-d39c26c44b13',['验证公会详情承接公会审核中','验证公会详情承接公会通过平台审核中'],'提交进入公会审核以及公会通过后自动进入平台审核均有场景。'],
 ['REQ-82c2e3b823f8',[],'两级驳回、新单重审和旧单历史隔离均有场景。'],
 ['REQ-552ffe98a013',[], '通过退会和公会移出后的直播、身份、公会关系、粉丝团、群籍、成长及重新认证重建均已验证。'],
 ['REQ-c0818a907211',[], '账号资料、主播等级、财富等级和当前直播状态分别验证。'],
 ['REQ-7e9d73bca365',['验证已有团籍点击主播粉丝团'],'团名称、等级、成员数以及当前用户有效团籍去向均有场景。'],
 ['REQ-c773181a40f7',[], '关注、好友、拉黑和私信权限四种关系状态均显示。'],
 ['REQ-c4c66a612fa6',['验证拉黑后执行者好友列表解除关系','验证本账号拉黑甲后清理关注关系','验证拉黑主播后不能读取原群历史','验证本账号拉黑甲后清理私信会话','验证本账号拉黑主播优先阻止进入直播','验证解除拉黑后不恢复关注','验证解除拉黑后不恢复私信会话','验证解除拉黑后不恢复粉丝团'],'主播主页拉黑的关系清理、入房限制和解除后不恢复均有场景。'],
 ['REQ-190faef064f8',[], '有效团籍一团一卡、团籍群籍同步以及退出、移出、解散后的卡片和群聊清理均有场景。'],
 ['REQ-ec21373e248a',['验证主动退团保留对主播关注','验证总贡献包含不同时期历史送礼','验证同月重入恢复榜单历史贡献','验证拉黑主播后不能读取原群历史'],'退出或移出后的关注、成长、历史贡献、榜单恢复和拉黑清理均有场景。'],
 ['REQ-7d7d2434d0e5',['验证粉丝团卡片展示本周个人名次','验证退团账号不进入当前团榜','验证同月重入恢复榜单历史贡献','验证团榜排除运营账号虚拟贡献'],'当前团籍范围、本周贡献、退团隐藏、重入恢复及运营号排除均有场景。'],
 ['REQ-315fe79ab8e6',[], '有效团籍范围、运营号排除、三种周期不截断和重入恢复均有场景。'],
 ['REQ-8229e0363a0e',[], '默认今日、本月切换、自然周期和平台业务时区均由周期边界与本月数据场景承接。'],
 ['REQ-ea193f02002d',['验证主播中心今日有效收益','验证主播中心今日累计时长'],'当前主播隔离、历史累计收益、当前粉丝及周期指标均分别验证。'],
 ['REQ-da22572e83e0',['验证房管管理核对资料','验证取消房管先显示确认','验证确认取消房管'],'当前房管查看、ID搜索添加和取消授权均有场景。'],
 ['REQ-e2133a44839a REQ-f875a4334d0f REQ-87dc16af1c55 REQ-89cd24a6a436 REQ-ef30ef06e0fd',[], '未提交、公会审核、自动平台审核、平台驳回重申及平台通过终态均逐项验证。'],
 ['REQ-807b9b7e9e84',[], '主题必填、40字符上边界和超过40字符均有场景。'],
 ['REQ-b605e04a7d15',[], '分类必选以及采用当前平台启用分类均有场景。'],
 ['REQ-eae70e8ccbf2',[], '三种房型及平台开关关闭后的可用范围均有场景。'],
 ['REQ-3f9a27a952f4',['验证密码房开启广场展示','验证密码房关闭广场展示'],'首次默认和开关后的热门区域展示结果均有场景。'],
 ['REQ-bef4c4dc66c8',[], '仅密码房展示、首次默认关闭及确认值复用均有场景。'],
 ['REQ-e0ffc77743dc',[], '首次开播直接请求相机和麦克风系统授权，无产品说明弹窗。'],
 ['REQ-8d0100356511',['验证非成员新进入成员限制房','验证粉丝团成员进入受限密码房仍需密码'],'无粉丝团不可开启、非成员拦截及成员继续密码校验均有场景。'],
 ['REQ-5a448a325d76 REQ-9579f4aa8f7b',[], '首次默认、确认保存为下次值以及关闭或遮罩不保存均有场景。'],
 ['REQ-61318af1f7a5',[], '门票选择、档位失效、密码4至12位及非数字边界均有场景。'],
 ['REQ-c34aef5219c4',[], '恢复默认后选中项和全部美颜参数回到50均有场景。'],
 ['REQ-7f0adf55e85c',[], '三种房型校验、设备权限、3秒倒计时和主播直播间去向均有场景。'],
 ['REQ-c92730baa9aa',[], '相机和麦克风拒绝后的停留、提示、取消与前往设置均有场景。'],
 ['REQ-8db27934732a',[], '系统照片选择器及取消后保留原封面均有场景。'],
 ['REQ-f8ed250c667f REQ-499e5e38b399 REQ-f94714b11f03',[], '有效关注范围、有效装扮和关系实时更新及主页入口均有场景。'],
 ['REQ-3c8eb26865ba REQ-33370591728d REQ-e69be25ca77e REQ-7acf9cdc656e REQ-1da9b601c77a REQ-0b30a90199cd',[], '成员资料、有效范围、500人上限、移除后的团籍群籍和成长结果均逐项验证。'],
 ['REQ-6d45f8a2a3e0 REQ-074a6beb770c',[], '累计、本月、最新加入及同值ID次序均有对应切换场景。'],
 ['REQ-7343342ce64f',[], '单人禁言确认及移除后的成员数、群聊权限和成长身份均有场景。'],
 ['REQ-501cfa2ab72f',[], '设置入口和成员资料提示均有场景。'],
 ['REQ-1ee33d401eff REQ-e678accf83a1 REQ-d49e26122786 REQ-e2396617e63e',[], '名称、贡献门槛、仅所属主播权限、保存及不追溯现有成员均有边界场景。'],
 ['REQ-226258f44f04',[], '日月范围内收益、时长、观众、粉丝指标与趋势均由具体字段和切换场景承接。'],
 ['REQ-0d82569c66ef',[], '普通、定制、门票、幸运、虚拟、失败和撤销消费的收益口径均有计算场景。'],
 ['REQ-799f53f68c2e',[], '179、180和360分钟边界验证每日最多一个有效天。'],
 ['REQ-fe846a072cd5 REQ-ed8c70a581a1',[], '当前主播隔离、日月时间范围、趋势顺序、明细倒序以及下钻保留范围均有场景。'],
 ['REQ-27d410895746 REQ-5bff9def79de REQ-19805a429279 REQ-45785a2fabd6 REQ-f7b1b48604a8 REQ-63f0ac849672 REQ-4113c879d00d REQ-6dec50420322',[], '场次快照、观众和收益口径、汇总、当前主播日期范围、默认近7天及范围变化均有场景。'],
 ['REQ-258d41860521 REQ-0b79c673c324 REQ-b96b28e872d4 REQ-f425c72972fb',[], '上传记录、日期、印尼美元格式、线下口径及点击对应日期结果均有场景。'],
 ['REQ-d442e0bc55c7 REQ-9a05bd1d3528 REQ-185ad4ee3351 REQ-b5dd13565b16 REQ-95e0f0047f41',[], '余额、基础和赠送金币、比例、到账及美元价格均有确定数据和计算。'],
 ['REQ-eae1af036b98 REQ-016ad0387d8b REQ-781fe0384137 REQ-9213831ca4fd REQ-6dc985679329 REQ-95df786b7baf REQ-2a96f4832099 REQ-a763f69cfc41',[], '套餐可购范围、限购、快照、回调幂等、失败状态、退款负余额、运营号限制、明细入口和首充资格均有场景。'],
 ['REQ-d813a417613 REQ-da4b64f4623e REQ-5392dcd051b2 REQ-16b2aa083fad',[], '发生时间、独立冲正、负余额、账号隔离、排序和各流水详情去向均有场景。'],
 ['REQ-e22a427eecd8 REQ-7ee09ae8f0aa REQ-4d419753eb3b REQ-265f31b95aef REQ-c7b416ee772c REQ-53ca55ab9ec7 REQ-f2cbdd1e3dc4',[], '充值订单套餐、数量、基础及赠送金币、渠道、金额和无退款入口均逐字段验证。'],
 ['REQ-66152f4f0be9 REQ-17b93df45ee4 REQ-f7d59b64b8c5 REQ-f066210a5484 REQ-4a642d59e4d8 REQ-1d930d74d66c REQ-3c9f7fabb0c3',[], '支出订单商品、数量、时间、扣款、消费主播、不可退款和支付时快照均逐字段验证。'],
])for(const id of ids.split(' ')){
 const key=`用户App:${id}`;
 if(names.length)aliases.set(key,[...new Set([...(aliases.get(key)||[]),...names])]);
 decisions.set(key,{状态:'已覆盖',说明:reason});
}
