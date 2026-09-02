window.LUMA_ADMIN_FORMAT = window.LUMA_FORMAT;

window.LUMA_ADMIN_MOCK = {
  users: [
    { id: '88231007', name: 'Andi Pratama', initials: 'AP', isHost: true, login: '+62 812-7812-3066', registeredAt: '2026-07-28 14:32', level: 12, recharge: 2580000, spend: 1846200, balance: 12580, guild: 'Aurora Guild', status: 'normal', region: 'Jakarta', gender: '男', birthday: '1998-05-16', signature: '享受每一次直播。' },
    { id: '88229841', name: 'Nadia Putri', initials: 'NP', isHost: false, login: 'Google · nadia.putri@gmail.com', registeredAt: '2026-07-24 09:18', level: 26, recharge: 8750000, spend: 7214000, balance: 86540, guild: 'Star House', status: 'normal', region: 'Bandung', gender: '女', birthday: '2000-11-02', signature: '音乐与咖啡。' },
    { id: '88227653', name: 'Rizky Maulana', initials: 'RM', isHost: false, login: '+62 857-4421-9088', registeredAt: '2026-07-19 21:06', level: 8, recharge: 820000, spend: 516000, balance: 3040, guild: '未加入', status: 'normal', region: 'Surabaya', gender: '男', birthday: '2002-03-21', signature: '' },
    { id: '88225190', name: 'Siti Rahma', initials: 'SR', isHost: true, login: 'Apple · siti.rahma@icloud.com', registeredAt: '2026-07-12 11:45', level: 41, recharge: 23600000, spend: 22890000, balance: 192400, guild: 'Aurora Guild', status: 'banned', region: 'Medan', gender: '女', birthday: '1996-08-09', signature: '保持简单。' },
    { id: '88223016', name: 'Fajar Nugroho', initials: 'FN', isHost: true, login: '+62 813-9960-1275', registeredAt: '2026-07-06 18:22', level: 17, recharge: 4290000, spend: 3180000, balance: 45220, guild: 'Blue Ocean', status: 'normal', region: 'Makassar', gender: '男', birthday: '1999-01-27', signature: '来自望加锡的问候。' },
    { id: '88220472', name: 'Aulia Safitri', initials: 'AS', isHost: false, login: 'Google · aulia.safitri@gmail.com', registeredAt: '2026-06-29 13:09', level: 33, recharge: 12800000, spend: 10450000, balance: 235700, guild: 'Star House', status: 'normal', region: 'Yogyakarta', gender: '女', birthday: '1997-12-13', signature: '只分享快乐。' },
    { id: '88218339', name: 'Bima Saputra', initials: 'BS', isHost: false, login: '+62 822-3108-4401', registeredAt: '2026-06-21 08:37', level: 5, recharge: 350000, spend: 186000, balance: 1640, guild: '未加入', status: 'normal', region: 'Semarang', gender: '男', birthday: '2003-06-04', signature: '' },
    { id: '88215764', name: 'Dian Lestari', initials: 'DL', isHost: true, login: 'Apple · dian.lestari@icloud.com', registeredAt: '2026-06-12 17:54', level: 22, recharge: 6940000, spend: 5860000, balance: 73400, guild: 'Moonlight', status: 'normal', region: 'Bali', gender: '女', birthday: '1998-09-30', signature: '直播、欢笑与聆听。' }
  ],
  records: {
    '88231007': {
      recharges: [
        { orderNo: 'RC20260803001842', channel: 'Google Play', amount: 320000, coins: 3360, status: '成功', time: '2026-08-03 20:16' },
        { orderNo: 'RC20260730000971', channel: 'DANA', amount: 160000, coins: 1600, status: '成功', time: '2026-07-30 11:42' },
        { orderNo: 'RC20260728100315', channel: 'GoPay', amount: 80000, coins: 800, status: '失败', time: '2026-07-28 16:05' }
      ],
      consumptions: [
        { flowNo: 'CS20260804003128', type: '普通礼物', hostName: 'Sari', sessionId: 'LS2608040018', coins: 5200, time: '2026-08-04 10:31' },
        { flowNo: 'CS20260802001406', type: '门票房', hostName: 'Maya', sessionId: 'LS2608020036', coins: 100, time: '2026-08-02 21:08' },
        { flowNo: 'CS20260731008742', type: '幸运礼物', hostName: 'Dewi', sessionId: 'LS2607310042', coins: 1000, time: '2026-07-31 22:47' }
      ],
      devices: [
        { deviceId: 'A1F9-8C22-7B31', type: 'Android · Samsung SM-S928B', lastLogin: '2026-08-04 09:56' },
        { deviceId: 'WEB-7D42-11AC', type: 'Chrome · Windows 11', lastLogin: '2026-08-01 18:22' }
      ],
      relationships: [
        { userId: '77210411', name: 'Sari', type: '关注', createdAt: '2026-07-29 20:12' },
        { userId: '77208635', name: 'Dewi', type: '关注', createdAt: '2026-07-30 22:06' },
        { userId: '88220472', name: 'Aulia Safitri', type: '粉丝', createdAt: '2026-08-01 13:38' }
      ],
      violations: [
        { type: '公屏不当言论', action: '警告', reason: '连续发送引战内容', time: '2026-07-31 23:14' },
        { type: '私信骚扰', action: '警告', reason: '举报复核成立', time: '2026-07-26 18:40' }
      ]
    },
    '88225190': {
      recharges: [],
      consumptions: [],
      devices: [{ deviceId: 'IOS-91EC-4402', type: 'iOS · iPhone 15 Pro', lastLogin: '2026-07-12 12:03' }],
      relationships: [],
      violations: [
        { type: '欺诈交易', action: '封禁', reason: '多笔异常支付及拒付', time: '2026-07-13 09:20' }
      ]
    }
  },
  rechargeOrders: [
    { orderNo: 'RC20260805002186', userId: '88231007', userName: 'Andi Pratama', initials: 'AP', channel: 'Google Play', amount: 320000, paidAmount: 320000, packageName: '3,200 金币套餐', baseCoins: 3200, bonusCoins: 160, receivedCoins: 3360, status: 'success', createdAt: '2026-08-05 09:18', paidAt: '2026-08-05 09:19', transactionNo: 'GP-893201845701', failureReason: '-', walletBalance: 9220, refund: { refundNo: 'RF20260812000426', platformRefundNo: 'GPA.3381-9502-7716-44982', type: '被动退款', source: 'Google Play 退款回调', amount: 320000, channel: 'Google Play', cashStatus: '平台已退款', deductedBaseCoins: 3200, deductedBonusCoins: 160, balanceAfter: 9220, reason: '用户通过 Google Play 申请退款，平台审核通过后回调系统。', operator: '系统自动处理', createdAt: '2026-08-12 11:58', impact: '充值金币已被消费，已穿透红冲关联消费与主播收益。' } },
    { orderNo: 'RC20260805001942', userId: '88229841', userName: 'Nadia Putri', initials: 'NP', channel: 'DANA', amount: 160000, paidAmount: 160000, packageName: '1,600 金币套餐', baseCoins: 1600, bonusCoins: 0, receivedCoins: 1600, status: 'pending', createdAt: '2026-08-05 08:46', paidAt: '-', transactionNo: '-', failureReason: '-' },
    { orderNo: 'RC20260804008715', userId: '88227653', userName: 'Rizky Maulana', initials: 'RM', channel: 'GoPay', amount: 80000, paidAmount: 80000, packageName: '800 金币套餐', baseCoins: 800, bonusCoins: 0, receivedCoins: 0, status: 'failed', createdAt: '2026-08-04 22:31', paidAt: '-', transactionNo: 'GPY-26080488916', failureReason: '支付渠道返回余额不足' },
    { orderNo: 'RC20260804006328', userId: '88225190', userName: 'Siti Rahma', initials: 'SR', channel: 'H5 · Airwallex', amount: 1280000, paidAmount: 1280000, packageName: '12,800 金币套餐', baseCoins: 12800, bonusCoins: 1280, receivedCoins: 14080, status: 'reversed', createdAt: '2026-08-04 18:22', paidAt: '2026-08-04 18:24', transactionNo: 'AWX-6281058401', failureReason: '第三方支付拒付红冲' },
    { orderNo: 'RC20260803005106', userId: '88223016', userName: 'Fajar Nugroho', initials: 'FN', channel: 'App Store', amount: 640000, paidAmount: 640000, packageName: '6,400 金币套餐', baseCoins: 6400, bonusCoins: 320, receivedCoins: 6720, status: 'success', createdAt: '2026-08-03 20:16', paidAt: '2026-08-03 20:17', transactionNo: 'AS-9001842563', failureReason: '-', walletBalance: -2400, refund: { refundNo: 'RF20260805000318', type: '手动退款', amount: 640000, channel: 'App Store', cashStatus: '退款成功', deductedBaseCoins: 6400, deductedBonusCoins: 320, balanceAfter: -2400, reason: '用户联系客服申请整笔退款，核对订单与支付账号一致。', operator: '后台管理员', createdAt: '2026-08-05 14:26' } },
    { orderNo: 'RC20260803003742', userId: '88220472', userName: 'Aulia Safitri', initials: 'AS', channel: 'PayerMax', amount: 320000, paidAmount: 320000, packageName: '3,200 金币套餐', baseCoins: 3200, bonusCoins: 0, receivedCoins: 0, status: 'cancelled', createdAt: '2026-08-03 16:05', paidAt: '-', transactionNo: '-', failureReason: '用户取消支付' },
    { orderNo: 'RC20260802001893', userId: '88218339', userName: 'Bima Saputra', initials: 'BS', channel: 'DANA', amount: 80000, paidAmount: 80000, packageName: '800 金币套餐', baseCoins: 800, bonusCoins: 0, receivedCoins: 800, status: 'success', createdAt: '2026-08-02 11:42', paidAt: '2026-08-02 11:43', transactionNo: 'DNA-2608021839', failureReason: '-', walletBalance: 840, refund: { refundNo: 'RF20260811000381', platformRefundNo: 'DNA-RF-2608111839', type: '被动退款', source: 'DANA 退款回调', amount: 80000, channel: 'DANA', cashStatus: '平台已退款', deductedBaseCoins: 800, deductedBonusCoins: 0, balanceAfter: 840, reason: '用户通过 DANA 申请退款，平台审核通过后回调系统。', operator: '系统自动处理', createdAt: '2026-08-11 19:42', impact: '充值金币已被消费，已穿透红冲关联消费与主播收益。' } },
    { orderNo: 'RC20260801001457', userId: '88216724', userName: 'Ayu Lestari', initials: 'AL', channel: 'Google Play', amount: 160000, paidAmount: 160000, packageName: '1,600 金币套餐', baseCoins: 1600, bonusCoins: 80, receivedCoins: 1680, status: 'success', createdAt: '2026-08-01 16:20', paidAt: '2026-08-01 16:21', transactionNo: 'GP-781429360125', failureReason: '-', walletBalance: 4520, refund: null }
  ],
  consumptionOrders: [
    { orderNo: 'CS20260805003128', userId: '88231007', userName: 'Andi Pratama', initials: 'AP', type: '普通礼物', itemId: 'GFT1002', itemName: '金色星星', quantity: 2, coins: 1000, paidBaseCoins: 900, paidBonusCoins: 100, walletBalance: 12580, targetId: '77210411', targetName: 'Sari', roomId: '710028', sessionId: 'LS2608040018', status: 'completed', createdAt: '2026-08-05 10:31', reversedAt: '-', reverseReason: '-', refund: null },
    { orderNo: 'CS20260805002716', userId: '88229841', userName: 'Nadia Putri', initials: 'NP', type: '幸运礼物', itemId: 'GFT1007', itemName: '连送 10 次', quantity: 1, coins: 100, paidBaseCoins: 100, paidBonusCoins: 0, walletBalance: 86540, targetId: '77209318', targetName: 'Maya', roomId: '710106', sessionId: 'LS2608040026', status: 'completed', createdAt: '2026-08-05 09:52', reversedAt: '-', reverseReason: '-', refund: null },
    { orderNo: 'CS20260804009422', userId: '88227653', userName: 'Rizky Maulana', initials: 'RM', type: '门票', itemId: 'TICKET-100', itemName: '周末演唱会门票', quantity: 1, coins: 100, paidBaseCoins: 100, paidBonusCoins: 0, walletBalance: 3040, targetId: '77210411', targetName: 'Sari', roomId: '710028', sessionId: 'LS2608020071', status: 'completed', createdAt: '2026-08-04 21:08', reversedAt: '-', reverseReason: '-', refund: null },
    { orderNo: 'CS20260804007635', userId: '88225190', userName: 'Siti Rahma', initials: 'SR', type: '普通礼物', itemId: 'GFT1001', itemName: '玫瑰', quantity: 100, coins: 1000, paidBaseCoins: 800, paidBonusCoins: 200, walletBalance: 192400, targetId: '77208635', targetName: 'Dewi', roomId: '710221', sessionId: 'LS2608040031', status: 'reversed', createdAt: '2026-08-04 19:36', reversedAt: '2026-08-04 20:10', reverseReason: '关联充值订单拒付，消费穿透红冲', refund: { refundNo: 'CRF20260804000173', type: '系统退款', returnedBaseCoins: 800, returnedBonusCoins: 200, balanceAfter: 192400, reason: '关联充值订单拒付，消费订单已退款。', operator: '系统自动处理', createdAt: '2026-08-04 20:10', settlementImpact: '主播已分成收益不追回，退款损失由平台承担。' } },
    { orderNo: 'CS20260803006418', userId: '88223016', userName: 'Fajar Nugroho', initials: 'FN', type: '定制礼物', itemId: 'GFT1005', itemName: '音乐皇冠', quantity: 3, coins: 900, paidBaseCoins: 800, paidBonusCoins: 100, walletBalance: 45220, targetId: '77206508', targetName: 'Intan', roomId: '710091', sessionId: 'LS2608030088', status: 'completed', createdAt: '2026-08-03 22:47', reversedAt: '-', reverseReason: '-', refund: null },
    { orderNo: 'CS20260803004807', userId: '88220472', userName: 'Aulia Safitri', initials: 'AS', type: '门票', itemId: 'TICKET-300', itemName: '粉丝专属演出门票', quantity: 1, coins: 300, paidBaseCoins: 300, paidBonusCoins: 0, walletBalance: 235700, targetId: '77208635', targetName: 'Dewi', roomId: '710221', sessionId: 'LS2608040031', status: 'completed', createdAt: '2026-08-03 18:12', reversedAt: '-', reverseReason: '-', refund: null }
  ],
  walletLedgerItems: [
    { flowNo: 'WL2026080501042', userId: '88231007', userName: 'Andi Pratama', initials: 'AP', type: '礼物消费', direction: 'out', amount: 1000, balanceBefore: 13580, balanceAfter: 12580, sourceNo: 'CS20260805003128', createdAt: '2026-08-05 10:31', status: '有效' },
    { flowNo: 'WL2026080500986', userId: '88229841', userName: 'Nadia Putri', initials: 'NP', type: '礼物消费', direction: 'out', amount: 100, balanceBefore: 86640, balanceAfter: 86540, sourceNo: 'CS20260805002716', createdAt: '2026-08-05 09:52', status: '有效' },
    { flowNo: 'WL2026080500912', userId: '88231007', userName: 'Andi Pratama', initials: 'AP', type: '充值入账', direction: 'in', amount: 3360, balanceBefore: 10220, balanceAfter: 13580, sourceNo: 'RC20260805002186', createdAt: '2026-08-05 09:19', status: '有效' },
    { flowNo: 'WL2026080401288', userId: '88227653', userName: 'Rizky Maulana', initials: 'RM', type: '门票消费', direction: 'out', amount: 100, balanceBefore: 3140, balanceAfter: 3040, sourceNo: 'CS20260804009422', createdAt: '2026-08-04 21:08', status: '有效' },
    { flowNo: 'WL2026080401173', userId: '88225190', userName: 'Siti Rahma', initials: 'SR', type: '消费退回', direction: 'in', amount: 1000, balanceBefore: 191400, balanceAfter: 192400, sourceNo: 'CS20260804007635', createdAt: '2026-08-04 20:10', status: '红冲' },
    { flowNo: 'WL2026080401031', userId: '88225190', userName: 'Siti Rahma', initials: 'SR', type: '礼物消费', direction: 'out', amount: 1000, balanceBefore: 192400, balanceAfter: 191400, sourceNo: 'CS20260804007635', createdAt: '2026-08-04 19:36', status: '已红冲' },
    { flowNo: 'WL2026080400964', userId: '88225190', userName: 'Siti Rahma', initials: 'SR', type: '充值红冲', direction: 'out', amount: 14080, balanceBefore: 206480, balanceAfter: 192400, sourceNo: 'RC20260804006328', createdAt: '2026-08-04 18:24', status: '红冲' },
    { flowNo: 'WL2026080301547', userId: '88223016', userName: 'Fajar Nugroho', initials: 'FN', type: '充值入账', direction: 'in', amount: 6720, balanceBefore: 38500, balanceAfter: 45220, sourceNo: 'RC20260803005106', createdAt: '2026-08-03 20:17', status: '有效' },
    { flowNo: 'WL2026080301406', userId: '88220472', userName: 'Aulia Safitri', initials: 'AS', type: '门票消费', direction: 'out', amount: 300, balanceBefore: 236000, balanceAfter: 235700, sourceNo: 'CS20260803004807', createdAt: '2026-08-03 18:12', status: '有效' },
    { flowNo: 'WL2026080200821', userId: '88218339', userName: 'Bima Saputra', initials: 'BS', type: '充值入账', direction: 'in', amount: 800, balanceBefore: 840, balanceAfter: 1640, sourceNo: 'RC20260802001893', createdAt: '2026-08-02 11:43', status: '有效' }
  ],
  userRegistrationRecords: [
    { recordNo: 'UR2026080701820', userId: '88234521', userName: 'Putri Ananda', initials: 'PA', method: 'Google', source: '自然注册', campaign: '-', region: 'Jakarta', device: 'Android', registeredAt: '2026-08-07 22:14', status: '有效' },
    { recordNo: 'UR2026080701718', userId: '88234386', userName: 'Raka Pratama', initials: 'RP', method: '手机号', source: '邀请拉新', campaign: 'INV-88231007', region: 'Bandung', device: 'Android', registeredAt: '2026-08-07 20:36', status: '有效' },
    { recordNo: 'UR2026080701542', userId: '88234107', userName: 'Nina Maharani', initials: 'NM', method: 'Apple ID', source: '应用商店', campaign: 'App Store 搜索', region: 'Surabaya', device: 'iOS', registeredAt: '2026-08-07 18:05', status: '有效' },
    { recordNo: 'UR2026080701386', userId: '88233892', userName: 'Yoga Saputra', initials: 'YS', method: 'TikTok', source: '广告投放', campaign: 'TikTok-Live-0807', region: 'Medan', device: 'Android', registeredAt: '2026-08-07 15:42', status: '有效' },
    { recordNo: 'UR2026080701164', userId: '88233618', userName: 'Citra Lestari', initials: 'CL', method: '手机号', source: '活动落地页', campaign: 'Summer Live 2026', region: 'Bali', device: 'iOS', registeredAt: '2026-08-07 12:18', status: '有效' },
    { recordNo: 'UR2026080601982', userId: '88233204', userName: 'Dimas Ardi', initials: 'DA', method: 'Google', source: '自然注册', campaign: '-', region: 'Makassar', device: 'Android', registeredAt: '2026-08-06 23:01', status: '有效' },
    { recordNo: 'UR2026080601761', userId: '88232976', userName: 'Lia Amelia', initials: 'LA', method: 'Facebook', source: '广告投放', campaign: 'Meta-Acq-0806', region: 'Semarang', device: 'Android', registeredAt: '2026-08-06 20:22', status: '有效' },
    { recordNo: 'UR2026080601428', userId: '88232543', userName: 'Bayu Hidayat', initials: 'BH', method: '手机号', source: '邀请拉新', campaign: 'INV-88229841', region: 'Yogyakarta', device: 'Android', registeredAt: '2026-08-06 16:48', status: '有效' }
  ],
  userLoginRecords: [
    { recordNo: 'LG2026080708421', userId: '88231007', userName: 'Andi Pratama', initials: 'AP', method: '手机号', deviceId: 'A1F9-8C22-7B31', device: 'Android · Samsung S24', ip: '103.28.71.42', region: 'Jakarta', loggedAt: '2026-08-07 22:18', result: '成功' },
    { recordNo: 'LG2026080708316', userId: '88229841', userName: 'Nadia Putri', initials: 'NP', method: 'Google', deviceId: 'IOS-9A21-33B8', device: 'iOS · iPhone 15', ip: '36.72.18.116', region: 'Bandung', loggedAt: '2026-08-07 21:56', result: '成功' },
    { recordNo: 'LG2026080708104', userId: '88227653', userName: 'Rizky Maulana', initials: 'RM', method: '手机号', deviceId: 'AND-77C1-082A', device: 'Android · OPPO Reno', ip: '114.125.92.8', region: 'Surabaya', loggedAt: '2026-08-07 21:02', result: '密码错误' },
    { recordNo: 'LG2026080707862', userId: '88225190', userName: 'Siti Rahma', initials: 'SR', method: 'Apple ID', deviceId: 'IOS-91EC-4402', device: 'iOS · iPhone 15 Pro', ip: '182.1.224.57', region: 'Medan', loggedAt: '2026-08-07 19:48', result: '账号封禁' },
    { recordNo: 'LG2026080707548', userId: '88223016', userName: 'Fajar Nugroho', initials: 'FN', method: '手机号', deviceId: 'AND-62D8-B119', device: 'Android · Xiaomi 14', ip: '112.215.64.92', region: 'Makassar', loggedAt: '2026-08-07 18:16', result: '成功' },
    { recordNo: 'LG2026080707193', userId: '88220472', userName: 'Aulia Safitri', initials: 'AS', method: 'Google', deviceId: 'WEB-1B82-AF90', device: 'Chrome · Windows 11', ip: '180.252.73.14', region: 'Yogyakarta', loggedAt: '2026-08-07 16:34', result: '成功' }
  ],
  userActivityRecords: [
    { eventNo: 'UA2026080710248', userId: '88231007', userName: 'Andi Pratama', initials: 'AP', event: '进入直播间', page: '直播间 710028', sessionId: 'US26080731007', device: 'Android', occurredAt: '2026-08-07 22:20' },
    { eventNo: 'UA2026080710186', userId: '88229841', userName: 'Nadia Putri', initials: 'NP', event: '启动 App', page: '直播广场', sessionId: 'US26080729841', device: 'iOS', occurredAt: '2026-08-07 21:57' },
    { eventNo: 'UA2026080710064', userId: '88223016', userName: 'Fajar Nugroho', initials: 'FN', event: '发送评论', page: '直播间 710106', sessionId: 'US26080723016', device: 'Android', occurredAt: '2026-08-07 21:14' },
    { eventNo: 'UA2026080709842', userId: '88220472', userName: 'Aulia Safitri', initials: 'AS', event: '浏览主播主页', page: '主播 Maya', sessionId: 'US26080720472', device: 'Web', occurredAt: '2026-08-07 20:38' },
    { eventNo: 'UA2026080709561', userId: '88218339', userName: 'Bima Saputra', initials: 'BS', event: '关注主播', page: '主播 Sari', sessionId: 'US26080718339', device: 'Android', occurredAt: '2026-08-07 19:52' },
    { eventNo: 'UA2026080709216', userId: '88215764', userName: 'Dian Lestari', initials: 'DL', event: '打开消息中心', page: '消息中心', sessionId: 'US26080715764', device: 'iOS', occurredAt: '2026-08-07 18:40' }
  ],
  userSourceRecords: [
    { relationNo: 'USC2026080701820', userId: '88234521', userName: 'Putri Ananda', initials: 'PA', source: '自然注册', channel: '直接访问', campaign: '-', referrer: '-', boundAt: '2026-08-07 22:14', status: '有效' },
    { relationNo: 'USC2026080701718', userId: '88234386', userName: 'Raka Pratama', initials: 'RP', source: '邀请拉新', channel: '邀请码', campaign: 'INV-88231007', referrer: '88231007 · Andi Pratama', boundAt: '2026-08-07 20:36', status: '有效' },
    { relationNo: 'USC2026080701542', userId: '88234107', userName: 'Nina Maharani', initials: 'NM', source: '应用商店', channel: 'App Store', campaign: '自然搜索', referrer: '-', boundAt: '2026-08-07 18:05', status: '有效' },
    { relationNo: 'USC2026080701386', userId: '88233892', userName: 'Yoga Saputra', initials: 'YS', source: '广告投放', channel: 'TikTok Ads', campaign: 'TikTok-Live-0807', referrer: 'AD-889104', boundAt: '2026-08-07 15:42', status: '有效' },
    { relationNo: 'USC2026080701164', userId: '88233618', userName: 'Citra Lestari', initials: 'CL', source: '活动落地页', channel: 'H5', campaign: 'Summer Live 2026', referrer: 'LP-SUMMER-26', boundAt: '2026-08-07 12:18', status: '有效' },
    { relationNo: 'USC2026080601761', userId: '88232976', userName: 'Lia Amelia', initials: 'LA', source: '广告投放', channel: 'Meta Ads', campaign: 'Meta-Acq-0806', referrer: 'AD-728016', boundAt: '2026-08-06 20:22', status: '异常待核验' }
  ],
  hostFollowerChangeRecords: [
    { recordNo: 'FC2026080704621', hostId: '77210411', hostName: 'Sari', initials: 'S', guild: 'Aurora Guild', userId: '88234521', userName: 'Putri Ananda', type: '新增关注', source: '直播间', occurredAt: '2026-08-07 22:28' },
    { recordNo: 'FC2026080704518', hostId: '77209318', hostName: 'Maya', initials: 'M', guild: 'Aurora Guild', userId: '88234386', userName: 'Raka Pratama', type: '新增关注', source: '主播主页', occurredAt: '2026-08-07 21:42' },
    { recordNo: 'FC2026080704386', hostId: '77208635', hostName: 'Dewi', initials: 'D', guild: 'Star House', userId: '88229841', userName: 'Nadia Putri', type: '取消关注', source: '关注列表', occurredAt: '2026-08-07 20:55' },
    { recordNo: 'FC2026080704164', hostId: '77210411', hostName: 'Sari', initials: 'S', guild: 'Aurora Guild', userId: '88227653', userName: 'Rizky Maulana', type: '新增关注', source: '直播间', occurredAt: '2026-08-07 19:36' },
    { recordNo: 'FC2026080703928', hostId: '77206508', hostName: 'Intan', initials: 'I', guild: 'Moonlight', userId: '88223016', userName: 'Fajar Nugroho', type: '新增关注', source: '推荐位', occurredAt: '2026-08-07 18:12' },
    { recordNo: 'FC2026080703712', hostId: '77207152', hostName: 'Ayu', initials: 'A', guild: 'Blue Ocean', userId: '88220472', userName: 'Aulia Safitri', type: '取消关注', source: '主播主页', occurredAt: '2026-08-07 16:48' }
  ],
  hostViolationRecords: [
    { recordNo: 'HV202608010018', hostId: '77207152', hostName: 'Ayu', initials: 'A', guild: 'Blue Ocean', type: '站外引流', sourceNo: 'LS2608010054', action: '强制关播并关闭权限', reason: '直播画面展示站外联系方式', operator: 'Nina', occurredAt: '2026-08-01 19:06' },
    { recordNo: 'HV202607310026', hostId: '77206508', hostName: 'Intan', initials: 'I', guild: 'Moonlight', type: '互动尺度不当', sourceNo: 'LS2607310028', action: '警告', reason: '直播互动尺度不当', operator: '后台管理员', occurredAt: '2026-07-31 22:30' },
    { recordNo: 'HV202607290014', hostId: '77207152', hostName: 'Ayu', initials: 'A', guild: 'Blue Ocean', type: '累计违规', sourceNo: 'AU2607290036', action: '关闭直播权限', reason: '累计三次直播违规', operator: '后台管理员', occurredAt: '2026-07-29 16:10' },
    { recordNo: 'HV202607250009', hostId: '77205884', hostName: 'Lala', initials: 'L', guild: 'Star House', type: '严重违规', sourceNo: 'AU2607250019', action: '封禁', reason: '多次严重违规，经人工核实', operator: '后台管理员', occurredAt: '2026-07-25 09:08' },
    { recordNo: 'HV202607180031', hostId: '77210411', hostName: 'Sari', initials: 'S', guild: 'Aurora Guild', type: '标题不规范', sourceNo: 'LS2607180042', action: '警告', reason: '标题含夸大表述', operator: 'Rafi', occurredAt: '2026-07-18 21:35' }
  ],
  liveViewerRecords: [
    { recordNo: 'VW2026080708421', sessionId: 'LS2608070042', roomId: '710028', hostId: '77210411', hostName: 'Sari', initials: 'S', guild: 'Aurora Guild', userId: '88231007', userName: 'Andi Pratama', userInitials: 'AP', source: '直播广场', enteredAt: '2026-08-07 21:58', leftAt: '2026-08-07 22:26', duration: 1680, device: 'Android' },
    { recordNo: 'VW2026080708316', sessionId: 'LS2608070038', roomId: '710221', hostId: '77208635', hostName: 'Dewi', initials: 'D', guild: 'Star House', userId: '88229841', userName: 'Nadia Putri', userInitials: 'NP', source: '关注列表', enteredAt: '2026-08-07 21:42', leftAt: '2026-08-07 22:05', duration: 1380, device: 'iOS' },
    { recordNo: 'VW2026080708104', sessionId: 'LS2608070031', roomId: '710106', hostId: '77209318', hostName: 'Maya', initials: 'M', guild: 'Aurora Guild', userId: '88227653', userName: 'Rizky Maulana', userInitials: 'RM', source: '推送通知', enteredAt: '2026-08-07 21:08', leftAt: '2026-08-07 21:17', duration: 540, device: 'Android' },
    { recordNo: 'VW2026080707862', sessionId: 'LS2608070024', roomId: '710091', hostId: '77206508', hostName: 'Intan', initials: 'I', guild: 'Moonlight', userId: '88223016', userName: 'Fajar Nugroho', userInitials: 'FN', source: '主播主页', enteredAt: '2026-08-07 20:32', leftAt: '2026-08-07 21:04', duration: 1920, device: 'Android' },
    { recordNo: 'VW2026080707548', sessionId: 'LS2608070016', roomId: '710145', hostId: '77207152', hostName: 'Ayu', initials: 'A', guild: 'Blue Ocean', userId: '88220472', userName: 'Aulia Safitri', userInitials: 'AS', source: '直播广场', enteredAt: '2026-08-07 19:18', leftAt: '2026-08-07 19:18', duration: 8, device: 'Web' },
    { recordNo: 'VW2026080707193', sessionId: 'LS2608070042', roomId: '710028', hostId: '77210411', hostName: 'Sari', initials: 'S', guild: 'Aurora Guild', userId: '88218339', userName: 'Bima Saputra', userInitials: 'BS', source: '好友分享', enteredAt: '2026-08-07 18:46', leftAt: '2026-08-07 19:01', duration: 900, device: 'Android' }
  ],
  liveInteractionRecords: [
    { recordNo: 'LI2026080709428', sessionId: 'LS2608070042', roomId: '710028', hostId: '77210411', hostName: 'Sari', initials: 'S', guild: 'Aurora Guild', userId: '88231007', userName: 'Andi Pratama', userInitials: 'AP', type: '评论', content: '今晚的歌单很好听', occurredAt: '2026-08-07 22:18', status: '有效' },
    { recordNo: 'LI2026080709316', sessionId: 'LS2608070038', roomId: '710221', hostId: '77208635', hostName: 'Dewi', initials: 'D', guild: 'Star House', userId: '88229841', userName: 'Nadia Putri', userInitials: 'NP', type: '点赞', content: '连续点赞 12 次', occurredAt: '2026-08-07 22:02', status: '有效' },
    { recordNo: 'LI2026080709104', sessionId: 'LS2608070031', roomId: '710106', hostId: '77209318', hostName: 'Maya', initials: 'M', guild: 'Aurora Guild', userId: '88227653', userName: 'Rizky Maulana', userInitials: 'RM', type: '关注', content: '关注主播', occurredAt: '2026-08-07 21:15', status: '有效' },
    { recordNo: 'LI2026080708862', sessionId: 'LS2608070024', roomId: '710091', hostId: '77206508', hostName: 'Intan', initials: 'I', guild: 'Moonlight', userId: '88223016', userName: 'Fajar Nugroho', userInitials: 'FN', type: '分享', content: '分享到 WhatsApp', occurredAt: '2026-08-07 20:48', status: '有效' },
    { recordNo: 'LI2026080708548', sessionId: 'LS2608070016', roomId: '710145', hostId: '77207152', hostName: 'Ayu', initials: 'A', guild: 'Blue Ocean', userId: '88220472', userName: 'Aulia Safitri', userInitials: 'AS', type: '评论', content: '留下站外联系方式', occurredAt: '2026-08-07 19:22', status: '已屏蔽' },
    { recordNo: 'LI2026080708193', sessionId: 'LS2608070042', roomId: '710028', hostId: '77210411', hostName: 'Sari', initials: 'S', guild: 'Aurora Guild', userId: '88218339', userName: 'Bima Saputra', userInitials: 'BS', type: '点赞', content: '连续点赞 6 次', occurredAt: '2026-08-07 18:58', status: '有效' }
  ],
  liveGiftRecords: [
    { recordNo: 'GF2026080706421', orderNo: 'CS20260807004218', sessionId: 'LS2608070042', roomId: '710028', hostId: '77210411', hostName: 'Sari', initials: 'S', guild: 'Aurora Guild', userId: '88231007', userName: 'Andi Pratama', userInitials: 'AP', giftId: 'GFT1002', giftName: '金色星星', quantity: 2, coins: 1000, occurredAt: '2026-08-07 22:16', status: '有效' },
    { recordNo: 'GF2026080706318', orderNo: 'CS20260807003916', sessionId: 'LS2608070038', roomId: '710221', hostId: '77208635', hostName: 'Dewi', initials: 'D', guild: 'Star House', userId: '88229841', userName: 'Nadia Putri', userInitials: 'NP', giftId: 'GFT1005', giftName: '音乐皇冠', quantity: 1, coins: 300, occurredAt: '2026-08-07 21:58', status: '有效' },
    { recordNo: 'GF2026080706104', orderNo: 'CS20260807003604', sessionId: 'LS2608070031', roomId: '710106', hostId: '77209318', hostName: 'Maya', initials: 'M', guild: 'Aurora Guild', userId: '88227653', userName: 'Rizky Maulana', userInitials: 'RM', giftId: 'GFT1003', giftName: '单次幸运礼物', quantity: 10, coins: 100, occurredAt: '2026-08-07 21:12', status: '有效' },
    { recordNo: 'GF2026080705862', orderNo: 'CS20260807003262', sessionId: 'LS2608070024', roomId: '710091', hostId: '77206508', hostName: 'Intan', initials: 'I', guild: 'Moonlight', userId: '88223016', userName: 'Fajar Nugroho', userInitials: 'FN', giftId: 'GFT1001', giftName: '玫瑰', quantity: 20, coins: 200, occurredAt: '2026-08-07 20:44', status: '有效' },
    { recordNo: 'GF2026080705548', orderNo: 'CS20260807002848', sessionId: 'LS2608070016', roomId: '710145', hostId: '77207152', hostName: 'Ayu', initials: 'A', guild: 'Blue Ocean', userId: '88220472', userName: 'Aulia Safitri', userInitials: 'AS', giftId: 'GFT1002', giftName: '金色星星', quantity: 1, coins: 500, occurredAt: '2026-08-07 19:20', status: '已红冲' },
    { recordNo: 'GF2026080705193', orderNo: 'CS20260807002493', sessionId: 'LS2608070042', roomId: '710028', hostId: '77210411', hostName: 'Sari', initials: 'S', guild: 'Aurora Guild', userId: '88218339', userName: 'Bima Saputra', userInitials: 'BS', giftId: 'GFT1006', giftName: '咖啡', quantity: 3, coins: 60, occurredAt: '2026-08-07 18:54', status: '有效' }
  ],
  liveCohostRecords: [
    { recordNo: 'CO2026080703418', sessionId: 'LS2608070042', roomId: '710028', hostId: '77210411', hostName: 'Sari', initials: 'S', guild: 'Aurora Guild', guestId: '77209318', guestName: 'Maya', type: '主播连麦', invitedAt: '2026-08-07 21:40', acceptedAt: '2026-08-07 21:41', endedAt: '2026-08-07 22:05', duration: 1440, result: '正常结束' },
    { recordNo: 'CO2026080703286', sessionId: 'LS2608070038', roomId: '710221', hostId: '77208635', hostName: 'Dewi', initials: 'D', guild: 'Star House', guestId: '88229841', guestName: 'Nadia Putri', type: '用户连麦', invitedAt: '2026-08-07 21:28', acceptedAt: '2026-08-07 21:29', endedAt: '2026-08-07 21:37', duration: 480, result: '正常结束' },
    { recordNo: 'CO2026080703104', sessionId: 'LS2608070031', roomId: '710106', hostId: '77209318', hostName: 'Maya', initials: 'M', guild: 'Aurora Guild', guestId: '77210411', guestName: 'Sari', type: '主播连麦', invitedAt: '2026-08-07 21:04', acceptedAt: '2026-08-07 21:05', endedAt: '2026-08-07 21:18', duration: 780, result: '主播结束' },
    { recordNo: 'CO2026080702862', sessionId: 'LS2608070024', roomId: '710091', hostId: '77206508', hostName: 'Intan', initials: 'I', guild: 'Moonlight', guestId: '88223016', guestName: 'Fajar Nugroho', type: '用户连麦', invitedAt: '2026-08-07 20:35', acceptedAt: '2026-08-07 20:36', endedAt: '2026-08-07 20:42', duration: 360, result: '用户结束' },
    { recordNo: 'CO2026080702548', sessionId: 'LS2608070016', roomId: '710145', hostId: '77207152', hostName: 'Ayu', initials: 'A', guild: 'Blue Ocean', guestId: '88220472', guestName: 'Aulia Safitri', type: '用户连麦', invitedAt: '2026-08-07 19:12', acceptedAt: '-', endedAt: '2026-08-07 19:13', duration: 0, result: '已拒绝' }
  ],
  hostEarningRecords: [
    { flowNo: 'HE2026080705421', sourceType: '礼物收益', sourceNo: 'CS20260807004218', sessionId: 'LS2608070042', roomId: '710028', hostId: '77210411', hostName: 'Sari', initials: 'S', guild: 'Aurora Guild', grossCoins: 1000, hostCoins: 500, usdAmount: 50, status: '待分成', generatedAt: '2026-08-07 22:17' },
    { flowNo: 'HE2026080705318', sourceType: '定制礼物收益', sourceNo: 'CS20260807003916', sessionId: 'LS2608070038', roomId: '710221', hostId: '77208635', hostName: 'Dewi', initials: 'D', guild: 'Star House', grossCoins: 300, hostCoins: 150, usdAmount: 15, status: '待分成', generatedAt: '2026-08-07 21:59' },
    { flowNo: 'HE2026080705104', sourceType: '幸运礼物收益', sourceNo: 'CS20260807003604', sessionId: 'LS2608070031', roomId: '710106', hostId: '77209318', hostName: 'Maya', initials: 'M', guild: 'Aurora Guild', grossCoins: 100, hostCoins: 50, usdAmount: 5, status: '待分成', generatedAt: '2026-08-07 21:13' },
    { flowNo: 'HE2026080704862', sourceType: '普通礼物收益', sourceNo: 'CS20260807003262', sessionId: 'LS2608070024', roomId: '710091', hostId: '77206508', hostName: 'Intan', initials: 'I', guild: 'Moonlight', grossCoins: 200, hostCoins: 100, usdAmount: 10, status: '待分成', generatedAt: '2026-08-07 20:45' },
    { flowNo: 'HE2026080704548', sourceType: '礼物收益红冲', sourceNo: 'CS20260807002848', sessionId: 'LS2608070016', roomId: '710145', hostId: '77207152', hostName: 'Ayu', initials: 'A', guild: 'Blue Ocean', grossCoins: -500, hostCoins: -250, usdAmount: -25, status: '已红冲', generatedAt: '2026-08-07 19:26' },
    { flowNo: 'HE2026080704193', sourceType: '普通礼物收益', sourceNo: 'CS20260807002493', sessionId: 'LS2608070042', roomId: '710028', hostId: '77210411', hostName: 'Sari', initials: 'S', guild: 'Aurora Guild', grossCoins: 60, hostCoins: 30, usdAmount: 3, status: '待分成', generatedAt: '2026-08-07 18:55' }
  ],
  hosts: [
    { id: '77210411', name: 'Sari', initials: 'S', guild: 'Aurora Guild', level: 38, liveStatus: 'live', permission: 'enabled', earnings: 32860000, withdrawable: 4820000, frozen: 0, violations: 1, withdrawalEnabled: true, accountStatus: 'normal', certStatus: 'approved', certIdentity: { name: 'Sari Wulandari', type: 'KTP', number: '3173051205962041', region: 'Jakarta', birthDate: '1996-05-12', age: 30 }, certMaterials: [{ type: '本人照片', side: '', file: 'Sari-本人照片.jpg' }, { type: '证件照', side: '正面', file: 'KTP-Sari-正面.jpg' }, { type: '证件照', side: '反面', file: 'KTP-Sari-反面.jpg' }], certSubmittedAt: '2026-05-12 09:30', certReviewedAt: '2026-05-12 15:20' },
    { id: '77208635', name: 'Dewi', initials: 'D', guild: 'Star House', level: 31, liveStatus: 'offline', permission: 'enabled', earnings: 24180000, withdrawable: 3160000, frozen: 820000, violations: 2, withdrawalEnabled: true, accountStatus: 'normal', certStatus: 'approved', certIdentity: { name: 'Dewi Lestari', type: 'KTP', number: '3273051806941082', region: 'Bandung', birthDate: '1994-06-18', age: 32 }, certMaterials: [{ type: '本人照片', side: '', file: 'Dewi-本人照片.jpg' }, { type: '证件照', side: '正面', file: 'KTP-Dewi-正面.jpg' }, { type: '证件照', side: '反面', file: 'KTP-Dewi-反面.jpg' }], certSubmittedAt: '2026-05-18 10:12', certReviewedAt: '2026-05-18 17:05' },
    { id: '77209318', name: 'Maya', initials: 'M', guild: 'Aurora Guild', level: 27, liveStatus: 'live', permission: 'enabled', earnings: 18650000, withdrawable: 2410000, frozen: 0, violations: 0, withdrawalEnabled: true, accountStatus: 'normal', certStatus: 'approved', certIdentity: { name: 'Maya Putri', type: 'KTP', number: '3578052207973064', region: 'Surabaya', birthDate: '1997-07-22', age: 29 }, certMaterials: [{ type: '本人照片', side: '', file: 'Maya-本人照片.jpg' }, { type: '证件照', side: '正面', file: 'KTP-Maya-正面.jpg' }, { type: '证件照', side: '反面', file: 'KTP-Maya-反面.jpg' }], certSubmittedAt: '2026-06-02 14:28', certReviewedAt: '2026-06-03 09:40' },
    { id: '77207152', name: 'Ayu', initials: 'A', guild: 'Blue Ocean', level: 19, liveStatus: 'offline', permission: 'disabled', earnings: 8360000, withdrawable: 920000, frozen: 450000, violations: 3, withdrawalEnabled: false, accountStatus: 'banned', certStatus: 'approved', certIdentity: { name: 'Ayu Safitri', type: 'KTP', number: '7371051405002085', region: 'Makassar', birthDate: '2000-05-14', age: 26 }, certMaterials: [{ type: '本人照片', side: '', file: 'Ayu-本人照片.jpg' }, { type: '证件照', side: '正面', file: 'KTP-Ayu-正面.jpg' }, { type: '证件照', side: '反面', file: 'KTP-Ayu-反面.jpg' }], certSubmittedAt: '2026-06-11 08:35', certReviewedAt: '2026-06-11 16:50' },
    { id: '77206508', name: 'Intan', initials: 'I', guild: 'Moonlight', level: 22, liveStatus: 'offline', permission: 'enabled', earnings: 12140000, withdrawable: 1780000, frozen: 0, violations: 1, withdrawalEnabled: true, accountStatus: 'normal', certStatus: 'approved', certIdentity: { name: 'Intan Permata', type: 'KTP', number: '5171050903994017', region: 'Bali', birthDate: '1999-03-09', age: 27 }, certMaterials: [{ type: '本人照片', side: '', file: 'Intan-本人照片.jpg' }, { type: '证件照', side: '正面', file: 'KTP-Intan-正面.jpg' }, { type: '证件照', side: '反面', file: 'KTP-Intan-反面.jpg' }], certSubmittedAt: '2026-06-18 11:06', certReviewedAt: '2026-06-18 18:25' },
    { id: '77205884', name: 'Lala', initials: 'L', guild: 'Star House', level: 16, liveStatus: 'offline', permission: 'disabled', earnings: 6240000, withdrawable: 0, frozen: 1620000, violations: 5, withdrawalEnabled: false, accountStatus: 'banned', certStatus: 'approved', certIdentity: { name: 'Lala Nabila', type: 'KTP', number: '1271052606984029', region: 'Medan', birthDate: '1998-06-26', age: 28 }, certMaterials: [{ type: '本人照片', side: '', file: 'Lala-本人照片.jpg' }, { type: '证件照', side: '正面', file: 'KTP-Lala-正面.jpg' }, { type: '证件照', side: '反面', file: 'KTP-Lala-反面.jpg' }], certSubmittedAt: '2026-06-24 13:18', certReviewedAt: '2026-06-25 09:10' }
  ],
  hostRecords: {
    '77210411': {
      lives: [{ sessionId: 'LS2608040018', roomType: '普通房', startedAt: '2026-08-04 09:20', endedAt: '-', duration: '2h40m', viewers: 18420, gifts: 2860, revenue: 286000 }, { sessionId: 'LS2608020071', roomType: '门票房', startedAt: '2026-08-02 20:00', endedAt: '2026-08-02 22:15', duration: '2h15m', viewers: 8920, gifts: 1980, revenue: 268000 }],
      earnings: [{ flowNo: 'ER2608040311', type: '普通礼物收益', coins: 286000, time: '2026-08-04 11:58' }, { flowNo: 'ER2608020718', type: '门票及礼物收益', coins: 268000, time: '2026-08-02 22:15' }],
      withdrawals: [{ orderNo: 'WD2607280016', amount: 2400000, status: '已打款', appliedAt: '2026-07-28 10:20' }],
      fanClub: {
        id: 'FG77210411',
        name: 'Sari Stars',
        level: 8,
        members: 486,
        status: '正常',
        memberList: [
          { id: '88231007', name: 'Andi Pratama', joinedAt: '2026-07-28 15:10' },
          { id: '88220472', name: 'Aulia Safitri', joinedAt: '2026-07-24 09:32' },
          { id: '88227653', name: 'Rizky Maulana', joinedAt: '2026-07-18 20:45' },
          { id: '88218339', name: 'Bima Saputra', joinedAt: '2026-07-12 11:08' }
        ]
      },
      violations: [{ type: '直播标题不规范', action: '警告', reason: '标题含夸大表述', time: '2026-07-18 21:35' }]
    }
  },
  certifications: [
    { applicationNo: 'CA202608040012', hostId: '77204412', name: 'Tika', initials: 'T', guild: 'Aurora Guild', materials: [{ type: '本人照片', side: '', file: 'Tika-本人照片.jpg' }, { type: '证件照', side: '正面', file: 'KTP-Tika-正面.jpg' }, { type: '证件照', side: '反面', file: 'KTP-Tika-反面.jpg' }], identity: { name: 'Tika Ramadhani', type: 'KTP', number: '3173051209842041', region: 'Jakarta', birthDate: '1984-12-05', age: 41 }, certInfo: '姓名 Tika Ramadhani；证件类型 KTP；证件号 3173051209842041；地区 Jakarta', submittedAt: '2026-08-04 10:18', status: 'pending', audit: null },
    { applicationNo: 'CA202608040008', hostId: '77204368', name: 'Wulan', initials: 'W', guild: 'Star House', materials: [{ type: '本人照片', side: '', file: 'Wulan-本人照片.jpg' }, { type: '证件照', side: '正面', file: 'SIM-Wulan-正面.jpg' }, { type: '证件照', side: '反面', file: 'SIM-Wulan-反面.jpg' }], identity: { name: 'Wulan Sari', type: '驾驶证', number: 'SIM-BDG-2806911082', region: 'Bandung', birthDate: '1991-06-28', age: 35 }, certInfo: '姓名 Wulan Sari；证件类型 驾驶证；证件号 SIM-BDG-2806911082；地区 Bandung', submittedAt: '2026-08-04 08:42', status: 'pending', audit: null },
    { applicationNo: 'CA202608030021', hostId: '77204291', name: 'Fitri', initials: 'F', guild: 'Blue Ocean', materials: [{ type: '本人照片', side: '', file: 'Fitri-本人照片.jpg' }, { type: '证件照', side: '正面', file: 'SIM-Fitri-正面.jpg' }, { type: '证件照', side: '反面', file: 'SIM-Fitri-反面.jpg' }], identity: { name: 'Fitri Ananda', type: '驾驶证', number: 'SIM-MKS-1709093055', region: 'Makassar', birthDate: '2009-09-17', age: 16 }, certInfo: '姓名 Fitri Ananda；证件类型 驾驶证；证件号 SIM-MKS-1709093055；地区 Makassar', submittedAt: '2026-08-03 17:26', status: 'pending', audit: null },
    { applicationNo: 'CA202608020014', hostId: '77204155', name: 'Eka', initials: 'E', guild: 'Moonlight', materials: [{ type: 'KTP', side: '证件正面', file: 'KTP-Eka-正面.jpg' }, { type: 'KTP', side: '证件反面', file: 'KTP-Eka-反面.jpg' }], identity: { name: 'Eka Pratiwi', type: 'KTP', number: '5171052209974098', region: 'Bali', birthDate: '1997-02-22', age: 29 }, certInfo: '姓名 Eka Pratiwi；证件类型 KTP；证件号 5171052209974098；地区 Bali', submittedAt: '2026-08-02 13:10', status: 'approved', audit: { result: '审核通过', reason: '身份资料与本人一致，年龄校验通过', operator: 'Maya Chen', time: '2026-08-02 16:35' } },
    { applicationNo: 'CA202608010019', hostId: '77204002', name: 'Yuni', initials: 'Y', guild: 'Aurora Guild', materials: [{ type: '驾驶证', side: '证件正面', file: 'SIM-Yuni-正面.jpg' }, { type: '驾驶证', side: '证件反面', file: 'SIM-Yuni-反面.jpg' }], identity: { name: 'Yuni Kartika', type: '驾驶证', number: 'SIM-SBY-1109986012', region: 'Surabaya', birthDate: '1998-11-06', age: 27 }, certInfo: '姓名 Yuni Kartika；证件类型 驾驶证；证件号 SIM-SBY-1109986012；地区 Surabaya', submittedAt: '2026-08-01 15:52', status: 'rejected', audit: { result: '审核驳回', reason: '证件已过有效期，请更换有效证件后重新提交', operator: '后台管理员', time: '2026-08-01 18:20' } }
  ],
  livePermissions: [
    { hostId: '77210411', name: 'Sari', initials: 'S', guild: 'Aurora Guild', certStatus: 'approved', liveStatus: 'live', platformPermission: 'enabled', guildPermission: 'enabled', locked: false, reason: '主播认证通过，自动开通', changedAt: '2026-08-04 09:20', changes: [{ before: '未开通', after: '已开通', reason: '主播认证通过，自动开通', operator: '系统', time: '2026-05-12 15:20' }] },
    { hostId: '77208635', name: 'Dewi', initials: 'D', guild: 'Star House', certStatus: 'approved', liveStatus: 'offline', platformPermission: 'enabled', guildPermission: 'enabled', locked: true, reason: '违规复核期间已锁定公会管理权限', changedAt: '2026-08-03 18:42', changes: [{ before: '已开通 / 未锁定', after: '已开通 / 已锁定', reason: '违规复核期间已锁定公会管理权限', operator: '后台管理员', time: '2026-08-03 18:42' }] },
    { hostId: '77209318', name: 'Maya', initials: 'M', guild: 'Aurora Guild', certStatus: 'approved', liveStatus: 'live', platformPermission: 'enabled', guildPermission: 'enabled', locked: false, reason: '后台管理员恢复直播权限', changedAt: '2026-08-02 10:25', changes: [{ before: '已关闭', after: '已开通', reason: '后台管理员手动恢复', operator: 'Maya Chen', time: '2026-08-02 10:25' }] },
    { hostId: '77207152', name: 'Ayu', initials: 'A', guild: 'Blue Ocean', certStatus: 'approved', liveStatus: 'offline', platformPermission: 'disabled', guildPermission: 'disabled', locked: true, reason: '累计三次直播违规', changedAt: '2026-07-29 16:10', changes: [{ before: '已开通 / 未锁定', after: '已关闭 / 已锁定', reason: '累计三次直播违规', operator: '后台管理员', time: '2026-07-29 16:10' }] },
    { hostId: '77206508', name: 'Intan', initials: 'I', guild: 'Moonlight', certStatus: 'approved', liveStatus: 'offline', platformPermission: 'enabled', guildPermission: 'disabled', locked: false, reason: '公会端临时关闭', changedAt: '2026-07-28 11:36', changes: [{ before: '公会权限已开通', after: '公会权限已关闭', reason: '主播请假', operator: 'Moonlight Guild', time: '2026-07-28 11:36' }] },
    { hostId: '77205884', name: 'Lala', initials: 'L', guild: 'Star House', certStatus: 'approved', liveStatus: 'offline', platformPermission: 'disabled', guildPermission: 'disabled', locked: true, reason: '账号已封禁', changedAt: '2026-07-25 09:08', changes: [{ before: '已开通', after: '已关闭 / 已锁定', reason: '账号已封禁', operator: '后台管理员', time: '2026-07-25 09:08' }] }
  ],
  liveSessions: [
    { sessionId: 'LS2608040018', roomId: '710028', hostId: '77210411', name: 'Sari', initials: 'S', guild: 'Aurora Guild', roomType: '普通房', tag: '唱歌', status: 'live', startedAt: '2026-08-04 09:20', endedAt: '-', duration: '2h40m', peakViewers: 18420, totalViewers: 52680, consumptionCoins: 2860000, gifts: 2860, revenue: 286000, title: '早间音乐直播', cover: '音乐直播封面', snapshot: '实时画面 12:00', inspections: [{ inspector: 'Rafi', schedule: '2026-08-04 11:30', room: '710028', time: '2026-08-04 11:36', result: '正常', action: '无' }], actions: [] },
    { sessionId: 'LS2608040026', roomId: '710106', hostId: '77209318', name: 'Maya', initials: 'M', guild: 'Aurora Guild', roomType: '密码房', tag: '舞蹈', status: 'live', startedAt: '2026-08-04 10:05', endedAt: '-', duration: '1h55m', peakViewers: 7320, totalViewers: 16840, consumptionCoins: 1460000, gifts: 1460, revenue: 146000, title: '私人舞蹈练习', cover: '舞蹈直播封面', snapshot: '实时画面 12:00', inspections: [{ inspector: 'Nina', schedule: '2026-08-04 10:40', room: '710106', time: '2026-08-04 10:48', result: '需关注', action: '口头提醒' }], actions: [{ type: '警告', reason: '直播标题需明确内容', operator: 'Nina', time: '2026-08-04 10:49' }] },
    { sessionId: 'LS2608040031', roomId: '710221', hostId: '77208635', name: 'Dewi', initials: 'D', guild: 'Star House', roomType: '门票房', tag: '才艺', status: 'live', startedAt: '2026-08-04 11:10', endedAt: '-', duration: '50m', peakViewers: 4260, totalViewers: 6950, consumptionCoins: 1680000, gifts: 820, revenue: 168000, title: '粉丝专属演出', cover: '门票房封面', snapshot: '实时画面 12:00', inspections: [], actions: [] },
    { sessionId: 'LS2608030088', roomId: '710091', hostId: '77206508', name: 'Intan', initials: 'I', guild: 'Moonlight', roomType: '普通房', tag: '唱歌', status: 'ended', startedAt: '2026-08-03 20:00', endedAt: '2026-08-03 22:18', duration: '2h18m', peakViewers: 9850, totalViewers: 28400, consumptionCoins: 2140000, gifts: 2140, revenue: 214000, title: '深夜点歌', cover: '音乐直播封面', snapshot: '历史画面 21:30', inspections: [{ inspector: 'Rafi', schedule: '2026-08-03 21:00', room: '710091', time: '2026-08-03 21:12', result: '正常', action: '无' }], actions: [] },
    { sessionId: 'LS2608020071', roomId: '710028', hostId: '77210411', name: 'Sari', initials: 'S', guild: 'Aurora Guild', roomType: '门票房', tag: '唱歌', status: 'ended', startedAt: '2026-08-02 20:00', endedAt: '2026-08-02 22:15', duration: '2h15m', peakViewers: 8920, totalViewers: 24180, consumptionCoins: 2680000, gifts: 1980, revenue: 268000, title: '周末演唱会', cover: '演唱会直播封面', snapshot: '历史画面 21:10', inspections: [], actions: [] },
    { sessionId: 'LS2608010054', roomId: '710145', hostId: '77207152', name: 'Ayu', initials: 'A', guild: 'Blue Ocean', roomType: '普通房', tag: '聊天', status: 'stopped', startedAt: '2026-08-01 18:30', endedAt: '2026-08-01 19:06', duration: '36m', peakViewers: 2140, totalViewers: 3860, consumptionCoins: 260000, gifts: 260, revenue: 26000, title: '与 Ayu 聊天', cover: '聊天直播封面', snapshot: '违规画面 19:02', inspections: [{ inspector: 'Nina', schedule: '2026-08-01 19:00', room: '710145', time: '2026-08-01 19:02', result: '违规', action: '强制关播' }], actions: [{ type: '强制关播', reason: '直播中展示站外联系方式', operator: 'Nina', time: '2026-08-01 19:06' }] }
  ],
  contentAudits: [
    { auditNo: 'AU2608040032', roomId: '710106', sessionId: 'LS2608040026', hostId: '77209318', name: 'Maya', initials: 'M', hitType: '疑似站外引流', risk: 'high', image: '告警截图 12:03', video: '告警视频 00:18', alertAt: '2026-08-04 12:03', status: 'pending', result: '待处理', review: null },
    { auditNo: 'AU2608040024', roomId: '710221', sessionId: 'LS2608040031', hostId: '77208635', name: 'Dewi', initials: 'D', hitType: '敏感词命中', risk: 'medium', image: '告警截图 11:46', video: '告警视频 00:12', alertAt: '2026-08-04 11:46', status: 'reviewing', result: '人工复审中', review: null },
    { auditNo: 'AU2608040016', roomId: '710028', sessionId: 'LS2608040018', hostId: '77210411', name: 'Sari', initials: 'S', hitType: '画面疑似违规', risk: 'low', image: '告警截图 10:28', video: '告警视频 00:10', alertAt: '2026-08-04 10:28', status: 'ignored', result: '已忽略', review: { result: '误报', action: '忽略', reason: '舞台灯光导致画面误判', operator: 'Rafi', time: '2026-08-04 10:42' } },
    { auditNo: 'AU2608030078', roomId: '710145', sessionId: 'LS2608010054', hostId: '77207152', name: 'Ayu', initials: 'A', hitType: '站外联系方式', risk: 'high', image: '告警截图 19:02', video: '告警视频 00:25', alertAt: '2026-08-01 19:02', status: 'resolved', result: '强制关播', review: { result: '违规成立', action: '强制关播', reason: '展示站外联系方式', operator: 'Nina', time: '2026-08-01 19:06' } },
    { auditNo: 'AU2607310041', roomId: '710091', sessionId: 'LS2607310028', hostId: '77206508', name: 'Intan', initials: 'I', hitType: '疑似低俗内容', risk: 'medium', image: '告警截图 22:14', video: '告警视频 00:20', alertAt: '2026-07-31 22:14', status: 'resolved', result: '警告', review: { result: '轻微违规', action: '警告', reason: '直播互动尺度不当', operator: '后台管理员', time: '2026-07-31 22:30' } }
  ],
  reports: [
    { reportNo: 'RA2608040218', violationScope: 'account', reporterId: '88231007', reporterName: 'Andi Pratama', targetType: '用户账号', targetId: '88224719', targetName: 'Raka Wijaya', hostId: '88224719', hostName: 'Raka Wijaya', hostInitials: 'R', accountRole: '用户', accountStatus: '正常', reportType: '色情低俗', evidence: ['私信截图-01.jpg'], description: '被举报账号通过私信发送色情低俗内容。', related: '账号 88224719', submittedAt: '2026-08-04 13:18', status: 'pending', result: '待处理', record: null },
    { reportNo: 'RA2608040193', violationScope: 'account', reporterId: '88220472', reporterName: 'Aulia Safitri', targetType: '主播账号', targetId: '77208635', targetName: 'Dewi', hostId: '77208635', hostName: 'Dewi', hostInitials: 'D', accountRole: '主播', accountStatus: '正常', reportType: '涉及宗教政治', evidence: ['聊天记录.png'], description: '被举报账号私信传播涉及宗教政治的不当内容。', related: '主播账号 77208635', submittedAt: '2026-08-04 12:36', status: 'pending', result: '待处理', record: null },
    { reportNo: 'RA2608030114', violationScope: 'account', reporterId: '88227653', reporterName: 'Rizky Maulana', targetType: '用户账号', targetId: '88216508', targetName: 'Bagus Setiawan', hostId: '88216508', hostName: 'Bagus Setiawan', hostInitials: 'B', accountRole: '用户', accountStatus: '已封禁', reportType: '暴恐血腥', evidence: ['主页截图.jpg'], description: '账号主页发布暴恐血腥内容。', related: '账号 88216508', submittedAt: '2026-08-03 21:45', status: 'resolved', result: '封禁账号', record: { action: '封禁账号', reason: '发布暴恐血腥内容证据明确', result: '举报成立', execution: '账号已封禁并禁止登录', reporterNotice: '已发送', targetNotice: '登录拦截页展示', operator: '后台管理员', time: '2026-08-04 09:25' } },
    { reportNo: 'RA2608020081', violationScope: 'account', reporterId: '88218339', reporterName: 'Bima Saputra', targetType: '用户账号', targetId: '88230411', targetName: 'Putri Lestari', hostId: '88230411', hostName: 'Putri Lestari', hostInitials: 'P', accountRole: '用户', accountStatus: '正常', reportType: '未成年有害', evidence: ['头像截图.jpg'], description: '账号头像包含可能危害未成年人的不适宜内容。', related: '账号 88230411', submittedAt: '2026-08-02 20:10', status: 'resolved', result: '不处置', record: { action: '不处置', reason: '现有材料不足以认定账号违规', result: '举报不成立', execution: '账号状态保持不变', reporterNotice: '已发送', targetNotice: '不发送', operator: 'Maya Chen', time: '2026-08-03 10:20' } },
    { reportNo: 'RA2608010045', violationScope: 'account', reporterId: '88229841', reporterName: 'Nadia Putri', targetType: '主播账号', targetId: '77207152', targetName: 'Ayu', hostId: '77207152', hostName: 'Ayu', hostInitials: 'A', accountRole: '主播', accountStatus: '已封禁', reportType: '其他', evidence: ['私信录屏.mp4'], description: '被举报账号多次发送骚扰私信。', related: '主播账号 77207152', submittedAt: '2026-08-01 18:40', status: 'resolved', result: '封禁账号', record: { action: '封禁账号', reason: '骚扰行为成立', result: '举报成立', execution: '账号已强制下线并禁止登录', reporterNotice: '已发送', targetNotice: '登录拦截页展示', operator: 'Nina', time: '2026-08-01 19:12' } },
    { reportNo: 'RP2608040186', violationScope: 'live', reporterId: '88231007', reporterName: 'Andi Pratama', targetType: '直播场次', targetId: 'LS2608040026', targetName: 'Maya 的直播场次', hostId: '77209318', hostName: 'Maya', hostInitials: 'M', reportType: '色情低俗', evidence: ['举报截图-01.jpg', '录屏-18秒.mp4'], description: '直播画面及互动内容涉嫌色情低俗。', related: '直播场次 LS2608040026', submittedAt: '2026-08-04 12:08', status: 'pending', result: '待处理', record: null },
    { reportNo: 'RP2608040162', violationScope: 'live', reporterId: '88220472', reporterName: 'Aulia Safitri', targetType: '直播场次', targetId: 'LS2608040031', targetName: 'Dewi 的直播场次', hostId: '77208635', hostName: 'Dewi', hostInitials: 'D', reportType: '涉及宗教政治', evidence: ['公屏截图.png'], description: '主播在互动中发表涉及宗教政治的不当言论。', related: '直播场次 LS2608040031', submittedAt: '2026-08-04 11:52', status: 'pending', result: '待处理', record: null },
    { reportNo: 'RP2608030101', violationScope: 'live', reporterId: '88225190', reporterName: 'Siti Rahma', targetType: '直播场次', targetId: 'LS2608030088', targetName: 'Intan 的直播场次', hostId: '77206508', hostName: 'Intan', hostInitials: 'I', reportType: '其他', evidence: ['公屏截图-22时05分.png'], description: '直播互动内容疑似违规。', related: '直播场次 LS2608030088', submittedAt: '2026-08-03 22:05', status: 'invalid', result: '--', invalidReason: '直播场次已结束，工单自动作废', invalidatedAt: '2026-08-03 22:18', record: null },
    { reportNo: 'RP2608030098', violationScope: 'live', reporterId: '88227653', reporterName: 'Rizky Maulana', targetType: '直播场次', targetId: 'LS2608030088', targetName: 'Intan 的直播场次', hostId: '77206508', hostName: 'Intan', hostInitials: 'I', reportType: '暴恐血腥', evidence: ['时间点说明.txt'], description: '直播中播放疑似暴恐血腥内容。', related: '直播场次 LS2608030088', submittedAt: '2026-08-03 23:05', status: 'resolved', result: '关播级违规记录', record: { action: '关播级违规记录', reason: '暴恐血腥内容证据明确', result: '举报成立', execution: '审核时场次已结束，强制关播未执行，已记录本次违规', reporterNotice: '已发送', targetNotice: '已发送', operator: '后台管理员', time: '2026-08-04 09:18' } },
    { reportNo: 'RP2608020076', violationScope: 'live', reporterId: '88218339', reporterName: 'Bima Saputra', targetType: '直播场次', targetId: 'LS2608020071', targetName: 'Sari 的直播场次', hostId: '77210411', hostName: 'Sari', hostInitials: 'S', reportType: '未成年有害', evidence: ['活动页面截图.jpg'], description: '直播内容可能对未成年人造成不良影响。', related: '直播场次 LS2608020071', submittedAt: '2026-08-02 22:30', status: 'resolved', result: '警告', record: { action: '警告', reason: '直播内容可能危害未成年人', result: '举报成立', execution: '场次已结束，已记录警告', reporterNotice: '已发送', targetNotice: '已发送', operator: 'Maya Chen', time: '2026-08-03 10:12' } },
    { reportNo: 'RP2608010039', violationScope: 'live', reporterId: '88229841', reporterName: 'Nadia Putri', targetType: '直播场次', targetId: 'LS2608010054', targetName: 'Ayu 的直播场次', hostId: '77207152', hostName: 'Ayu', hostInitials: 'A', reportType: '其他', evidence: ['直播截图.jpg'], description: '画面中出现站外联系方式。', related: '直播场次 LS2608010054', submittedAt: '2026-08-01 19:04', status: 'resolved', result: '强制关播', record: { action: '强制关播', reason: '站外引流证据明确', result: '举报成立', execution: '当前直播场次已强制结束', reporterNotice: '已发送', targetNotice: '已发送', operator: 'Nina', time: '2026-08-01 19:06' } }
  ],
  giftItems: [
    { id: 'GFT1001', names: { en: 'Rose', id: 'Mawar', ms: 'Mawar' }, icon: '玫瑰图标', category: 'normal', price: 10, effect: 'rose-light.svga', sort: 100, status: 'online', effectiveAt: '-', expiredAt: '-', updatedAt: '2026-08-01 10:20', changes: [{ action: '编辑礼物', detail: '调整排序权重为 100', operator: '后台管理员', time: '2026-08-01 10:20' }] },
    { id: 'GFT1002', names: { en: 'Golden Star', id: 'Bintang Emas', ms: 'Bintang Emas' }, icon: '金色星星图标', category: 'normal', price: 500, effect: 'gold-star-fullscreen.svga', sort: 90, status: 'online', effectiveAt: '-', expiredAt: '-', updatedAt: '2026-07-28 14:05', changes: [{ action: '绑定特效', detail: 'gold-star-fullscreen.svga', operator: 'Maya Chen', time: '2026-07-28 14:05' }] },
    { id: 'GFT1003', names: { en: 'Single Lucky Gift', id: 'Hadiah Hoki Tunggal', ms: 'Hadiah Tuah Tunggal' }, icon: '单次幸运礼物图标', category: 'lucky', price: 10, comboCount: 1, targetRtp: 96, effect: 'lucky-single.svga', sort: 80, status: 'online', effectiveAt: '-', expiredAt: '-', updatedAt: '2026-07-25 09:30', rewards: [{ coins: 0, probability: 10.4 }, { coins: 5, probability: 32 }, { coins: 10, probability: 55 }, { coins: 50, probability: 2 }, { coins: 100, probability: 0.5 }, { coins: 1000, probability: 0.1 }], changes: [{ action: '新建礼物', detail: '创建单次幸运礼物配置', operator: '后台管理员', time: '2026-07-25 09:30' }] },
    { id: 'GFT1004', names: { en: 'Independence Firework', id: 'Kembang Api Merdeka', ms: 'Bunga Api Merdeka' }, icon: '节日烟花图标', category: 'custom', price: 1000, effect: 'merdeka-firework.svga', sort: 120, status: 'offline', effectiveAt: '2026-08-10 00:00', expiredAt: '2026-08-20 23:59', updatedAt: '2026-08-03 16:45', changes: [{ action: '新建礼物', detail: '配置独立日活动排期', operator: '后台管理员', time: '2026-08-03 16:45' }] },
    { id: 'GFT1005', names: { en: 'Music Crown', id: 'Mahkota Musik', ms: 'Mahkota Muzik' }, icon: '音乐皇冠图标', category: 'custom', price: 300, effect: 'music-crown.svga', sort: 70, status: 'online', effectiveAt: '2026-08-01 00:00', expiredAt: '2026-08-08 23:59', updatedAt: '2026-08-01 00:00', changes: [{ action: '上架', detail: '活动礼物已上架', operator: '系统', time: '2026-08-01 00:00' }] },
    { id: 'GFT1006', names: { en: 'Coffee', id: 'Kopi', ms: 'Kopi' }, icon: '咖啡图标', category: 'normal', price: 20, effect: '未上传', sort: 60, status: 'offline', effectiveAt: '-', expiredAt: '-', updatedAt: '2026-07-20 11:18', changes: [{ action: '下架', detail: '更换图标素材', operator: 'Maya Chen', time: '2026-07-20 11:18' }] },
    { id: 'GFT1007', names: { en: 'Lucky Combo 10', id: 'Hoki Beruntun 10', ms: 'Tuah Berturut 10' }, icon: '连送10次幸运礼物图标', category: 'lucky', price: 10, comboCount: 10, targetRtp: 97, effect: 'lucky-combo-10.svga', sort: 75, status: 'offline', effectiveAt: '-', expiredAt: '-', updatedAt: '2026-07-25 09:40', rewards: [{ coins: 0, probability: 8.4 }, { coins: 50, probability: 34 }, { coins: 100, probability: 55 }, { coins: 500, probability: 2 }, { coins: 1000, probability: 0.5 }, { coins: 10000, probability: 0.1 }], changes: [{ action: '新建礼物', detail: '创建连送 10 次幸运礼物', operator: '后台管理员', time: '2026-07-25 09:40' }] },
    { id: 'GFT1008', names: { en: 'Lucky Combo 100', id: 'Hoki Beruntun 100', ms: 'Tuah Berturut 100' }, icon: '连送100次幸运礼物图标', category: 'lucky', price: 10, comboCount: 100, targetRtp: 98, effect: 'lucky-combo-100.svga', sort: 70, status: 'offline', effectiveAt: '-', expiredAt: '-', updatedAt: '2026-07-25 09:45', rewards: [{ coins: 0, probability: 6.4 }, { coins: 500, probability: 36 }, { coins: 1000, probability: 55 }, { coins: 5000, probability: 2 }, { coins: 10000, probability: 0.5 }, { coins: 100000, probability: 0.1 }], changes: [{ action: '新建礼物', detail: '创建连送 100 次幸运礼物', operator: 'Maya Chen', time: '2026-07-25 09:45' }] }
  ],
  giftPurchaseCountRules: [
    { id: 'GSR1001', purchaseCount: 1, sort: 100, giftTypes: ['normal', 'custom', 'lucky'], giftIds: ['GFT1001', 'GFT1002', 'GFT1003'], status: 'enabled', updatedAt: '2026-08-11 10:30' },
    { id: 'GSR1002', purchaseCount: 10, sort: 90, giftTypes: ['custom'], giftIds: ['GFT1004', 'GFT1005'], status: 'disabled', updatedAt: '2026-08-10 18:20' }
  ],
  ticketPriceLevels: [
    { id: 'TP001', price: 10, sort: 1, enabled: true, operator: '后台管理员', updatedAt: '27/8/2026 10.20' },
    { id: 'TP002', price: 50, sort: 2, enabled: true, operator: '后台管理员', updatedAt: '27/8/2026 10.18' },
    { id: 'TP003', price: 100, sort: 3, enabled: true, operator: 'Maya Chen', updatedAt: '27/8/2026 10.16' },
    { id: 'TP004', price: 200, sort: 4, enabled: false, operator: '后台管理员', updatedAt: '26/8/2026 18.40' }
  ],
  propItems: [
    { id: 'PRP2005', names: { en: 'Fan Light', id: 'Papan Cahaya Fan', ms: 'Papan Cahaya Peminat' }, icon: 'fan-light-icon.png', type: 'light', material: 'fan-light.png', sort: 60, status: 'online', updatedAt: '2026-07-22 10:40', changes: [{ action: '编辑道具', detail: '更新灯牌素材', operator: 'Maya Chen', time: '2026-07-22 10:40' }] },
    { id: 'PRP2007', names: { en: 'Star Light', id: 'Papan Cahaya Bintang', ms: 'Papan Cahaya Bintang' }, icon: 'star-light-icon.png', type: 'light', material: 'star-light.png', sort: 90, status: 'online', updatedAt: '2026-08-06 11:20', changes: [{ action: '新建道具', detail: '创建星光灯牌', operator: '后台管理员', time: '2026-08-06 11:20' }] },
    { id: 'PRP2008', names: { en: 'Heart Light', id: 'Papan Cahaya Hati', ms: 'Papan Cahaya Hati' }, icon: 'heart-light-icon.png', type: 'light', material: 'heart-light.png', sort: 80, status: 'online', updatedAt: '2026-08-05 16:08', changes: [{ action: '上架', detail: '道具完成配置并上架', operator: 'Maya Chen', time: '2026-08-05 16:08' }] },
    { id: 'PRP2009', names: { en: 'Crown Light', id: 'Papan Cahaya Mahkota', ms: 'Papan Cahaya Mahkota' }, icon: 'crown-light-icon.png', type: 'light', material: 'crown-light.png', sort: 50, status: 'offline', updatedAt: '2026-08-04 10:35', changes: [{ action: '下架', detail: '更新灯牌素材', operator: '后台管理员', time: '2026-08-04 10:35' }] },
    { id: 'PRP2004', names: { en: 'Summer Title', id: 'Gelar Musim Panas', ms: 'Gelaran Musim Panas' }, icon: 'summer-title-icon.png', type: 'title', material: 'summer-title.png', sort: 70, status: 'offline', updatedAt: '2026-08-01 18:10', changes: [{ action: '下架', detail: '手动调整道具状态', operator: '后台管理员', time: '2026-08-01 18:10' }] },
    { id: 'PRP2010', names: { en: 'New Star', id: 'Bintang Baru', ms: 'Bintang Baharu' }, icon: 'new-star-title-icon.png', type: 'title', material: 'new-star-title.png', sort: 100, status: 'online', updatedAt: '2026-08-06 09:42', changes: [{ action: '新建道具', detail: '创建新人之星头衔', operator: '后台管理员', time: '2026-08-06 09:42' }] },
    { id: 'PRP2011', names: { en: 'Popularity King', id: 'Raja Popularitas', ms: 'Raja Populariti' }, icon: 'popularity-title-icon.png', type: 'title', material: 'popularity-title.png', sort: 90, status: 'online', updatedAt: '2026-08-05 14:20', changes: [{ action: '上架', detail: '道具完成配置并上架', operator: 'Maya Chen', time: '2026-08-05 14:20' }] },
    { id: 'PRP2012', names: { en: 'Guardian', id: 'Sang Penjaga', ms: 'Sang Penjaga' }, icon: 'guardian-title-icon.png', type: 'title', material: 'guardian-title.png', sort: 80, status: 'online', updatedAt: '2026-08-03 13:18', changes: [{ action: '编辑道具', detail: '更新头衔素材', operator: '后台管理员', time: '2026-08-03 13:18' }] },
    { id: 'PRP2003', names: { en: 'Music Medal', id: 'Medali Musik', ms: 'Pingat Muzik' }, icon: 'music-medal-icon.png', type: 'medal', material: 'music-medal.png', sort: 80, status: 'online', updatedAt: '2026-07-26 15:32', changes: [{ action: '新建道具', detail: '创建音乐勋章', operator: '后台管理员', time: '2026-07-26 15:32' }] },
    { id: 'PRP2013', names: { en: 'Gift Expert', id: 'Ahli Hadiah', ms: 'Pakar Hadiah' }, icon: 'gift-medal-icon.png', type: 'medal', material: 'gift-medal.png', sort: 100, status: 'online', updatedAt: '2026-08-06 12:05', changes: [{ action: '新建道具', detail: '创建礼物达人勋章', operator: '后台管理员', time: '2026-08-06 12:05' }] },
    { id: 'PRP2014', names: { en: 'Live Pioneer', id: 'Pelopor Live', ms: 'Perintis Live' }, icon: 'live-medal-icon.png', type: 'medal', material: 'live-medal.png', sort: 90, status: 'online', updatedAt: '2026-08-05 10:28', changes: [{ action: '上架', detail: '道具完成配置并上架', operator: 'Maya Chen', time: '2026-08-05 10:28' }] },
    { id: 'PRP2015', names: { en: 'Community Star', id: 'Bintang Komunitas', ms: 'Bintang Komuniti' }, icon: 'community-medal-icon.png', type: 'medal', material: 'community-medal.png', sort: 70, status: 'offline', updatedAt: '2026-08-02 17:10', changes: [{ action: '下架', detail: '更新勋章素材', operator: '后台管理员', time: '2026-08-02 17:10' }] },
    { id: 'PRP2006', names: { en: 'Royal Car', id: 'Mobil Kerajaan', ms: 'Kereta Diraja' }, icon: 'royal-car-icon.png', type: 'vehicle', material: 'royal-car.svga', sort: 50, status: 'offline', updatedAt: '2026-07-18 13:05', changes: [{ action: '下架', detail: '手动调整道具状态', operator: '后台管理员', time: '2026-07-18 13:05' }] }
    ,{ id: 'PRP2016', names: { en: 'Golden Sports Car', id: 'Mobil Sport Emas', ms: 'Kereta Sukan Emas' }, icon: 'gold-car-icon.png', type: 'vehicle', material: 'gold-car.svga', sort: 100, status: 'online', updatedAt: '2026-08-06 15:30', changes: [{ action: '新建道具', detail: '创建黄金跑车座驾', operator: '后台管理员', time: '2026-08-06 15:30' }] }
    ,{ id: 'PRP2017', names: { en: 'Sky Airship', id: 'Kapal Udara Langit', ms: 'Kapal Udara Langit' }, icon: 'airship-icon.png', type: 'vehicle', material: 'airship.svga', sort: 90, status: 'online', updatedAt: '2026-08-05 18:05', changes: [{ action: '上架', detail: '道具完成配置并上架', operator: 'Maya Chen', time: '2026-08-05 18:05' }] }
    ,{ id: 'PRP2018', names: { en: 'Dream Rocket', id: 'Roket Impian', ms: 'Roket Impian' }, icon: 'rocket-icon.png', type: 'vehicle', material: 'rocket.svga', sort: 80, status: 'online', updatedAt: '2026-08-04 14:52', changes: [{ action: '编辑道具', detail: '更新座驾特效', operator: '后台管理员', time: '2026-08-04 14:52' }] }
    ,{ id: 'PRP2002', names: { en: 'Ocean Bubble', id: 'Gelembung Laut', ms: 'Gelembung Laut' }, icon: 'ocean-bubble-icon.png', type: 'bubble', material: 'ocean-bubble.png', sort: 90, status: 'online', updatedAt: '2026-07-30 09:18', changes: [{ action: '上架', detail: '道具完成配置并上架', operator: 'Maya Chen', time: '2026-07-30 09:18' }] }
    ,{ id: 'PRP2019', names: { en: 'Star Bubble', id: 'Gelembung Bintang', ms: 'Gelembung Bintang' }, icon: 'star-bubble-icon.png', type: 'bubble', material: 'star-bubble.png', sort: 100, status: 'online', updatedAt: '2026-08-06 16:20', changes: [{ action: '新建道具', detail: '创建星光气泡', operator: '后台管理员', time: '2026-08-06 16:20' }] }
    ,{ id: 'PRP2020', names: { en: 'Heart Bubble', id: 'Gelembung Hati', ms: 'Gelembung Hati' }, icon: 'heart-bubble-icon.png', type: 'bubble', material: 'heart-bubble.png', sort: 80, status: 'online', updatedAt: '2026-08-05 09:36', changes: [{ action: '上架', detail: '道具完成配置并上架', operator: '后台管理员', time: '2026-08-05 09:36' }] }
    ,{ id: 'PRP2021', names: { en: 'Neon Bubble', id: 'Gelembung Neon', ms: 'Gelembung Neon' }, icon: 'neon-bubble-icon.png', type: 'bubble', material: 'neon-bubble.png', sort: 70, status: 'offline', updatedAt: '2026-08-03 11:25', changes: [{ action: '下架', detail: '更新气泡素材', operator: '后台管理员', time: '2026-08-03 11:25' }] }
    ,{ id: 'PRP2001', names: { en: 'Silver Frame', id: 'Bingkai Perak', ms: 'Bingkai Perak' }, icon: 'silver-frame-icon.png', type: 'avatar', material: 'silver-frame.png', sort: 100, status: 'online', updatedAt: '2026-08-02 12:20', changes: [{ action: '编辑道具', detail: '更新头像框素材', operator: '后台管理员', time: '2026-08-02 12:20' }] }
    ,{ id: 'PRP2022', names: { en: 'Star Frame', id: 'Bingkai Bintang', ms: 'Bingkai Bintang' }, icon: 'star-frame-icon.png', type: 'avatar', material: 'star-frame.png', sort: 90, status: 'online', updatedAt: '2026-08-06 17:10', changes: [{ action: '新建道具', detail: '创建星光头像框', operator: '后台管理员', time: '2026-08-06 17:10' }] }
    ,{ id: 'PRP2023', names: { en: 'Crown Frame', id: 'Bingkai Mahkota', ms: 'Bingkai Mahkota' }, icon: 'crown-frame-icon.png', type: 'avatar', material: 'crown-frame.png', sort: 80, status: 'online', updatedAt: '2026-08-05 13:46', changes: [{ action: '上架', detail: '道具完成配置并上架', operator: 'Maya Chen', time: '2026-08-05 13:46' }] }
    ,{ id: 'PRP2024', names: { en: 'Black Gold Frame', id: 'Bingkai Hitam Emas', ms: 'Bingkai Hitam Emas' }, icon: 'black-gold-frame-icon.png', type: 'avatar', material: 'black-gold-frame.png', sort: 70, status: 'offline', updatedAt: '2026-08-04 09:15', changes: [{ action: '下架', detail: '更新头像框素材', operator: '后台管理员', time: '2026-08-04 09:15' }] }
  ],
  placementItems: [
    { id: 'DSP0001', position: 'home_banner', material: 'home-merdeka-2026.jpg', jumpType: 'activity_image', targetPage: '', detailImage: 'merdeka-activity-detail-long.jpg', startAt: '2026-08-05 00:00', endAt: '2026-08-18 11:59', enabled: true },
    { id: 'DSP0002', position: 'home_banner', material: 'new-user-recharge.png', jumpType: 'app_page', targetPage: 'recharge', detailImage: '未上传', startAt: '2026-08-01 12:00', endAt: '2026-08-31 23:59', enabled: true },
    { id: 'DSP0003', position: 'live_top', material: 'live-hot-weekly.jpg', jumpType: 'app_page', targetPage: 'live_plaza', detailImage: '未上传', startAt: '2026-08-04 12:00', endAt: '2026-08-11 23:59', enabled: true },
    { id: 'DSP0004', position: 'welfare_focus', material: 'lucky-gift-guide.jpg', jumpType: 'activity_image', targetPage: '', detailImage: 'lucky-gift-guide-long.jpg', startAt: '2026-08-10 00:00', endAt: '2026-09-10 23:59', enabled: true },
    { id: 'DSP0005', position: 'profile_operation', material: 'guild-recruit-old.png', jumpType: 'app_page', targetPage: 'guild', detailImage: '未上传', startAt: '2026-06-01 00:00', endAt: '2026-07-31 23:59', enabled: false }
  ],
  pushItems: [
    { id: 'PSH0001', title: '独立日活动已开启', audience: 'all', guildName: '', content: '独立日庆典活动已开启，完成任务可领取限定奖励。', linkType: 'internal', linkTarget: '活动页 / ACT20260817', sendAt: '2026-08-05 10:00', status: 'sent', sentCount: 128640, readCount: 18420, operator: '后台管理员', updatedAt: '2026-08-05 10:02' },
    { id: 'PSH0002', title: 'Aurora Guild 新人福利通知', audience: 'guild:G100021', guildName: 'Aurora Guild', content: '公会新人福利已更新，请进入公会主页查看并及时领取。', linkType: 'internal', linkTarget: '公会主页 / G100021', sendAt: '2026-08-06 12:00', status: 'scheduled', sentCount: 0, readCount: 0, operator: 'Maya Chen', updatedAt: '2026-08-05 11:20' },
    { id: 'PSH0003', title: 'Star House 本周活动安排', audience: 'guild:G100018', guildName: 'Star House', content: '本周公会直播活动安排已经发布，请各位成员及时查看。', linkType: 'internal', linkTarget: '公会主页 / G100018', sendAt: '2026-08-06 19:30', status: 'scheduled', sentCount: 0, readCount: 0, operator: '后台管理员', updatedAt: '2026-08-05 09:45' },
    { id: 'PSH0004', title: 'Blue Ocean 公会分成通知', audience: 'guild:G100014', guildName: 'Blue Ocean', content: '7 月公会分成单已生成，请前往公会端查看。', linkType: 'internal', linkTarget: '分成记录', sendAt: '2026-08-03 09:00', status: 'sent', sentCount: 205, readCount: 168, operator: '后台管理员', updatedAt: '2026-08-03 09:01' },
    { id: 'PSH0005', title: '幸运礼物玩法即将上线通知', audience: 'all', guildName: '', content: '幸运礼物新玩法即将上线，更多活动内容将在福利中心公布。', linkType: 'none', linkTarget: '', sendAt: '2026-08-10 10:00', status: 'scheduled', sentCount: 0, readCount: 0, operator: 'Maya Chen', updatedAt: '2026-08-05 10:40' }
  ],
  rechargePackageItems: [
    { id: 'RCP1001', cover: 'package-600.png', type: 'regular', coins: 600, price: 15000, bonus: 0, purchaseLimit: 0, startAt: '', endAt: '', sort: 100, enabled: true, updatedAt: '2026-08-05 11:20' },
    { id: 'RCP1002', cover: 'package-1250.png', type: 'regular', coins: 1250, price: 30000, bonus: 50, purchaseLimit: 0, startAt: '', endAt: '', sort: 90, enabled: true, updatedAt: '2026-08-05 11:18' },
    { id: 'RCP1003', cover: 'package-6500.png', type: 'regular', coins: 6500, price: 150000, bonus: 500, purchaseLimit: 0, startAt: '', endAt: '', sort: 80, enabled: true, updatedAt: '2026-08-04 18:42' },
    { id: 'RCP2001', cover: 'summer-package.png', type: 'activity', coins: 3200, price: 70000, bonus: 600, purchaseLimit: 3, startAt: '2026-08-10 00:00', endAt: '2026-08-18 23:59', sort: 70, enabled: true, updatedAt: '2026-08-05 10:25' },
    { id: 'RCP2002', cover: 'festival-package.png', type: 'activity', coins: 10000, price: 210000, bonus: 2500, purchaseLimit: 1, startAt: '2026-08-20 00:00', endAt: '2026-08-31 23:59', sort: 60, enabled: false, updatedAt: '2026-08-05 09:40' },
    { id: 'RCP3001', cover: 'first-charge-package.png', type: 'activity', coins: 1250, price: 30000, bonus: 1000, purchaseLimit: 1, startAt: '2026-08-01 00:00', endAt: '2026-12-31 23:59', sort: 50, enabled: true, updatedAt: '2026-08-05 12:10' }
  ],
  withdrawalRequests: [
    { withdrawalNo: 'WD202608050018', hostId: '77210411', hostName: 'Sari', initials: 'S', guild: 'Aurora Guild', amount: 2400000, fee: 24000, netAmount: 2376000, availableBefore: 4820000, availableAfter: 2420000, method: '银行卡', bank: 'Bank Central Asia', accountName: 'Sari Wulandari', accountNo: '0147283910', appliedAt: '2026-08-05 11:06', reason: '常规提现', status: 'pending', audit: null },
    { withdrawalNo: 'WD202608050014', hostId: '77209318', hostName: 'Maya', initials: 'M', guild: 'Aurora Guild', amount: 1200000, fee: 12000, netAmount: 1188000, availableBefore: 2410000, availableAfter: 1210000, method: '电子钱包', bank: 'DANA', accountName: 'Maya Putri', accountNo: '081298417206', appliedAt: '2026-08-05 09:42', reason: '日常提现', status: 'pending', audit: null },
    { withdrawalNo: 'WD202608040027', hostId: '77208635', hostName: 'Dewi', initials: 'D', guild: 'Star House', amount: 1600000, fee: 16000, netAmount: 1584000, availableBefore: 3160000, availableAfter: 1560000, method: '银行卡', bank: 'Bank Mandiri', accountName: 'Dewi Lestari', accountNo: '1320098417265', appliedAt: '2026-08-04 18:30', reason: '常规提现', status: 'approved', audit: { result: '审核通过', reason: '账户信息与实名认证一致', operator: '后台管理员', processedAt: '2026-08-04 19:05' } },
    { withdrawalNo: 'WD202608040019', hostId: '77206508', hostName: 'Intan', initials: 'I', guild: 'Moonlight', amount: 980000, fee: 9800, netAmount: 970200, availableBefore: 1780000, availableAfter: 800000, method: '银行卡', bank: 'Bank Negara Indonesia', accountName: 'Intan Permata', accountNo: '0918842056', appliedAt: '2026-08-04 14:16', reason: '常规提现', status: 'rejected', audit: { result: '审核驳回', reason: '收款账户姓名与实名认证信息不一致', operator: 'Maya Chen', processedAt: '2026-08-04 15:02' } },
    { withdrawalNo: 'WD202608030032', hostId: '77210411', hostName: 'Sari', initials: 'S', guild: 'Aurora Guild', amount: 1800000, fee: 18000, netAmount: 1782000, availableBefore: 6620000, availableAfter: 4820000, method: '银行卡', bank: 'Bank Central Asia', accountName: 'Sari Wulandari', accountNo: '0147283910', appliedAt: '2026-08-03 16:48', reason: '常规提现', status: 'approved', audit: { result: '审核通过', reason: '账户信息与实名认证一致', operator: 'Maya Chen', processedAt: '2026-08-03 17:20' } },
    { withdrawalNo: 'WD202608030021', hostId: '77206508', hostName: 'Intan', initials: 'I', guild: 'Moonlight', amount: 1100000, fee: 11000, netAmount: 1089000, availableBefore: 2880000, availableAfter: 1780000, method: '银行卡', bank: 'Bank Negara Indonesia', accountName: 'Intan Permata', accountNo: '0918842056', appliedAt: '2026-08-03 13:20', reason: '常规提现', status: 'approved', audit: { result: '审核通过', reason: '账户信息与实名认证一致', operator: '后台管理员', processedAt: '2026-08-03 14:05' } },
    { withdrawalNo: 'WD202608020011', hostId: '77207152', hostName: 'Ayu', initials: 'A', guild: 'Blue Ocean', amount: 800000, fee: 8000, netAmount: 792000, availableBefore: 920000, availableAfter: 120000, method: '电子钱包', bank: 'GoPay', accountName: 'Ayu Safitri', accountNo: '081377260519', appliedAt: '2026-08-02 10:25', reason: '常规提现', status: 'rejected', audit: { result: '审核驳回', reason: '主播提现权限已关闭', operator: '后台管理员', processedAt: '2026-08-02 10:46' } },
    { withdrawalNo: 'WD202608010016', hostId: '77207152', hostName: 'Ayu', initials: 'A', guild: 'Blue Ocean', amount: 150000, fee: 1500, netAmount: 148500, availableBefore: 1070000, availableAfter: 920000, method: '电子钱包', bank: 'GoPay', accountName: 'Ayu Safitri', accountNo: '081377260519', appliedAt: '2026-08-01 16:10', reason: '常规提现', status: 'approved', audit: { result: '审核通过', reason: '账户信息与实名认证一致', operator: 'Maya Chen', processedAt: '2026-08-01 17:00' } }
  ],
  shareLedgerItems: [
    { ledgerNo: 'SL202608050018', period: '2026-08-05', sourceType: '礼物收益', sourceNo: 'CS20260805003128', sessionId: 'LS2608040018', roomId: '710028', hostId: '77210411', hostName: 'Sari', initials: 'S', guild: 'Aurora Guild', baseAmount: 2860000, platformRatio: 30, platformAmount: 858000, guildRatio: 20, guildAmount: 572000, hostRatio: 50, hostAmount: 1430000, generatedAt: '2026-08-05 12:00', status: 'pending', withdrawalNo: 'WD202608050018', settlementNo: '-', settledAt: '-' },
    { ledgerNo: 'SL202608050014', period: '2026-08-05', sourceType: '幸运礼物收益', sourceNo: 'CS20260805002716', sessionId: 'LS2608040026', roomId: '710106', hostId: '77209318', hostName: 'Maya', initials: 'M', guild: 'Aurora Guild', baseAmount: 1460000, platformRatio: 30, platformAmount: 438000, guildRatio: 20, guildAmount: 292000, hostRatio: 50, hostAmount: 730000, generatedAt: '2026-08-05 11:30', status: 'pending', withdrawalNo: 'WD202608050014', settlementNo: '-', settledAt: '-' },
    { ledgerNo: 'SL202608040031', period: '2026-08-04', sourceType: '门票收益', sourceNo: 'CS20260804009422', sessionId: 'LS2608020071', roomId: '710028', hostId: '77210411', hostName: 'Sari', initials: 'S', guild: 'Aurora Guild', baseAmount: 2680000, platformRatio: 30, platformAmount: 804000, guildRatio: 20, guildAmount: 536000, hostRatio: 50, hostAmount: 1340000, generatedAt: '2026-08-04 23:00', status: 'settled', withdrawalNo: 'WD202608030032', settlementNo: 'ST202608050008', settledAt: '2026-08-05 09:00' },
    { ledgerNo: 'SL202608040026', period: '2026-08-04', sourceType: '礼物收益', sourceNo: 'CS20260804007635', sessionId: 'LS2608040031', roomId: '710221', hostId: '77208635', hostName: 'Dewi', initials: 'D', guild: 'Star House', baseAmount: 1680000, platformRatio: 30, platformAmount: 504000, guildRatio: 20, guildAmount: 336000, hostRatio: 50, hostAmount: 840000, generatedAt: '2026-08-04 21:00', status: 'settled', withdrawalNo: 'WD202608040027', settlementNo: 'ST202608050006', settledAt: '2026-08-05 09:00' },
    { ledgerNo: 'SL202608030022', period: '2026-08-03', sourceType: '定制礼物收益', sourceNo: 'CS20260803006418', sessionId: 'LS2608030088', roomId: '710091', hostId: '77206508', hostName: 'Intan', initials: 'I', guild: 'Moonlight', baseAmount: 2140000, platformRatio: 30, platformAmount: 642000, guildRatio: 20, guildAmount: 428000, hostRatio: 50, hostAmount: 1070000, generatedAt: '2026-08-03 23:00', status: 'settled', withdrawalNo: 'WD202608030021', settlementNo: 'ST202608040011', settledAt: '2026-08-04 09:00' },
    { ledgerNo: 'SL202608030018', period: '2026-08-03', sourceType: '门票收益', sourceNo: 'CS20260803004807', sessionId: 'LS2608040031', roomId: '710221', hostId: '77208635', hostName: 'Dewi', initials: 'D', guild: 'Star House', baseAmount: 920000, platformRatio: 30, platformAmount: 276000, guildRatio: 20, guildAmount: 184000, hostRatio: 50, hostAmount: 460000, generatedAt: '2026-08-03 19:00', status: 'settled', withdrawalNo: 'WD202608040027', settlementNo: 'ST202608050006', settledAt: '2026-08-05 09:00' },
    { ledgerNo: 'SL202608020009', period: '2026-08-02', sourceType: '礼物收益', sourceNo: 'CS20260802002184', sessionId: 'LS2608010054', roomId: '710145', hostId: '77207152', hostName: 'Ayu', initials: 'A', guild: 'Blue Ocean', baseAmount: 260000, platformRatio: 30, platformAmount: 78000, guildRatio: 20, guildAmount: 52000, hostRatio: 50, hostAmount: 130000, generatedAt: '2026-08-02 09:00', status: 'settled', withdrawalNo: 'WD202608010016', settlementNo: 'ST202608020014', settledAt: '2026-08-02 10:00' }
  ],
  settlementRecords: [
    { settlementNo: 'ST202608050008', withdrawalNo: 'WD202608030032', hostId: '77210411', hostName: 'Sari', initials: 'S', guild: 'Aurora Guild', periodStart: '2026-08-01', periodEnd: '2026-08-04', amount: 1782000, method: '银行转账', bank: 'Bank Central Asia', accountName: 'Sari Wulandari', accountNo: '0147283910', voucher: 'ST202608050008-付款凭证.jpg', settledAt: '2026-08-05 09:00', operator: '后台管理员', createdAt: '2026-08-05 09:06', note: '8 月第一期主播收益分成', ledgerNos: ['SL202608040031'] },
    { settlementNo: 'ST202608050006', withdrawalNo: 'WD202608040027', hostId: '77208635', hostName: 'Dewi', initials: 'D', guild: 'Star House', periodStart: '2026-08-03', periodEnd: '2026-08-04', amount: 1584000, method: '银行转账', bank: 'Bank Mandiri', accountName: 'Dewi Lestari', accountNo: '1320098417265', voucher: 'ST202608050006-付款凭证.jpg', settledAt: '2026-08-05 09:00', operator: 'Maya Chen', createdAt: '2026-08-05 09:04', note: '合并两笔分成记录分成', ledgerNos: ['SL202608040026', 'SL202608030018'] },
    { settlementNo: 'ST202608040011', withdrawalNo: 'WD202608030021', hostId: '77206508', hostName: 'Intan', initials: 'I', guild: 'Moonlight', periodStart: '2026-08-03', periodEnd: '2026-08-03', amount: 1089000, method: '银行转账', bank: 'Bank Negara Indonesia', accountName: 'Intan Permata', accountNo: '0918842056', voucher: 'ST202608040011-付款凭证.jpg', settledAt: '2026-08-04 09:00', operator: '后台管理员', createdAt: '2026-08-04 09:08', note: '-', ledgerNos: ['SL202608030022'] },
    { settlementNo: 'ST202608020014', withdrawalNo: 'WD202608010016', hostId: '77207152', hostName: 'Ayu', initials: 'A', guild: 'Blue Ocean', periodStart: '2026-08-01', periodEnd: '2026-08-01', amount: 148500, method: '电子钱包', bank: 'GoPay', accountName: 'Ayu Safitri', accountNo: '081377260519', voucher: 'ST202608020014-付款凭证.jpg', settledAt: '2026-08-02 10:00', operator: 'Maya Chen', createdAt: '2026-08-02 10:05', note: '-', ledgerNos: ['SL202608020009'] }
  ],
  hostSettlementUploads: [
    { id: 'HSR20260720001', month: '2026-07', entityCount: 3, totalAmount: 1590000, settler: 'Dimas Putra', settlementDate: '2026-08-20', remark: '2026 年 7 月主播分成', uploader: 'Maya Chen', uploadedAt: '2026-08-20 20:10:10', fileName: 'host-settlement-2026-07.xlsx', details: [
      { name: 'Sari', id: '77210411', guildName: 'Aurora Guild', guildId: 'G100021', amount: 620000 },
      { name: 'Dewi', id: '77208635', guildName: 'Star House', guildId: 'G100018', amount: 530000 },
      { name: 'Intan', id: '77206508', guildName: 'Moonlight', guildId: 'G100009', amount: 440000 }
    ] },
    { id: 'HSR20260618002', month: '2026-06', entityCount: 3, totalAmount: 1485000, settler: 'Dimas Putra', settlementDate: '2026-07-18', remark: '2026 年 6 月主播分成', uploader: '后台管理员', uploadedAt: '2026-07-18 18:42:16', fileName: 'host-settlement-2026-06.xlsx', details: [
      { name: 'Maya', id: '77209318', guildName: 'Aurora Guild', guildId: 'G100021', amount: 545000 },
      { name: 'Ayu', id: '77207152', guildName: 'Blue Ocean', guildId: 'G100014', amount: 495000 },
      { name: 'Dewi', id: '77208635', guildName: 'Star House', guildId: 'G100018', amount: 445000 }
    ] },
    { id: 'HSR20260519003', month: '2026-05', entityCount: 3, totalAmount: 1378000, settler: 'Maya Chen', settlementDate: '2026-06-19', remark: '2026 年 5 月主播分成', uploader: 'Dimas Putra', uploadedAt: '2026-06-19 16:28:35', fileName: 'host-settlement-2026-05.xlsx', details: [
      { name: 'Sari', id: '77210411', guildName: 'Aurora Guild', guildId: 'G100021', amount: 518000 },
      { name: 'Intan', id: '77206508', guildName: 'Moonlight', guildId: 'G100009', amount: 462000 },
      { name: 'Ayu', id: '77207152', guildName: 'Blue Ocean', guildId: 'G100014', amount: 398000 }
    ] }
  ],
  guildSettlementUploads: [
    { id: 'GSR20260720001', month: '2026-07', entityCount: 3, totalAmount: 90000, settler: 'Dimas Putra', settlementDate: '2026-08-20', remark: '2026 年 7 月公会分成', uploader: 'Maya Chen', uploadedAt: '2026-08-20 20:10:10', fileName: 'guild-settlement-2026-07.xlsx', details: [
      { name: 'Aurora Guild', id: 'G100021', amount: 38000 },
      { name: 'Star House', id: 'G100018', amount: 31000 },
      { name: 'Blue Ocean', id: 'G100014', amount: 21000 }
    ] },
    { id: 'GSR20260618002', month: '2026-06', entityCount: 3, totalAmount: 84200, settler: 'Dimas Putra', settlementDate: '2026-07-18', remark: '2026 年 6 月公会分成', uploader: '后台管理员', uploadedAt: '2026-07-18 18:45:02', fileName: 'guild-settlement-2026-06.xlsx', details: [
      { name: 'Aurora Guild', id: 'G100021', amount: 35200 },
      { name: 'Star House', id: 'G100018', amount: 28600 },
      { name: 'Moonlight', id: 'G100009', amount: 20400 }
    ] },
    { id: 'GSR20260519003', month: '2026-05', entityCount: 3, totalAmount: 78600, settler: 'Maya Chen', settlementDate: '2026-06-19', remark: '2026 年 5 月公会分成', uploader: 'Dimas Putra', uploadedAt: '2026-06-19 16:32:48', fileName: 'guild-settlement-2026-05.xlsx', details: [
      { name: 'Aurora Guild', id: 'G100021', amount: 32600 },
      { name: 'Blue Ocean', id: 'G100014', amount: 24800 },
      { name: 'Moonlight', id: 'G100009', amount: 21200 }
    ] }
  ],
  guilds: [
    { id: 'G100021', name: 'Aurora Guild', description: '专注音乐与才艺主播运营。', leaderId: '88240016', leaderName: 'Rani Hartono', accountStatus: 'enabled', hostCount: 18, memberCount: 326, earnings: 182600000, status: 'enabled', createdAt: '2026-03-18 10:20', dissolutionCheck: { pendingHostCount: 18, unsettledShareCount: 1, unnotifiedMemberCount: 326 } },
    { id: 'G100018', name: 'Star House', description: '综合娱乐直播公会。', leaderId: '88239208', leaderName: 'Bagus Santoso', accountStatus: 'enabled', hostCount: 24, memberCount: 418, earnings: 236800000, status: 'enabled', createdAt: '2026-03-05 14:12', dissolutionCheck: { pendingHostCount: 24, unsettledShareCount: 0, unnotifiedMemberCount: 418 } },
    { id: 'G100014', name: 'Blue Ocean', description: '舞蹈与聊天主播运营。', leaderId: '88237011', leaderName: 'Nina Sari', accountStatus: 'disabled', hostCount: 11, memberCount: 205, earnings: 84600000, status: 'disabled', createdAt: '2026-02-22 09:35', dissolutionCheck: { pendingHostCount: 11, unsettledShareCount: 0, unnotifiedMemberCount: 0 } },
    { id: 'G100009', name: 'Moonlight', description: '音乐类主播孵化与运营。', leaderId: '88235187', leaderName: 'Dimas Putra', accountStatus: 'enabled', hostCount: 9, memberCount: 146, earnings: 62300000, status: 'enabled', createdAt: '2026-02-08 16:48', dissolutionCheck: { pendingHostCount: 9, unsettledShareCount: 0, unnotifiedMemberCount: 146 } },
    { id: 'G100003', name: 'Sunrise Club', description: '历史业务已结清。', leaderId: '88231866', leaderName: 'Rika Dewi', accountStatus: 'disabled', hostCount: 0, memberCount: 0, earnings: 21800000, status: 'disabled', createdAt: '2026-01-12 11:06', dissolutionCheck: { pendingHostCount: 0, unsettledShareCount: 0, unnotifiedMemberCount: 0 } }
  ],
  hostAccountBalances: [
    { hostId: '77210411', hostName: 'Sari', guildId: 'G100021', guildName: 'Aurora Guild', balance: 4820000, withdrawnTotal: 12600000, withdrawing: 680000 },
    { hostId: '77208635', hostName: 'Dewi', guildId: 'G100018', guildName: 'Star House', balance: 3160000, withdrawnTotal: 9480000, withdrawing: 420000 },
    { hostId: '77209318', hostName: 'Maya', guildId: 'G100021', guildName: 'Aurora Guild', balance: 2410000, withdrawnTotal: 7720000, withdrawing: 0 },
    { hostId: '77207152', hostName: 'Ayu', guildId: 'G100014', guildName: 'Blue Ocean', balance: 920000, withdrawnTotal: 3360000, withdrawing: 450000 },
    { hostId: '77206508', hostName: 'Intan', guildId: 'G100009', guildName: 'Moonlight', balance: 1780000, withdrawnTotal: 5620000, withdrawing: 0 },
    { hostId: '77205884', hostName: 'Lala', guildId: 'G100018', guildName: 'Star House', balance: 0, withdrawnTotal: 2400000, withdrawing: 0 }
  ],
  hostBalanceChanges: {
    '77210411': [
      { recordNo: 'HBC2026081800128', type: '收益分成', direction: 'in', amount: 1680000, balanceBefore: 3140000, balanceAfter: 4820000, operator: '系统', remark: '2026 年 7 月主播分成记录导入增加', createdAt: '2026-08-18 10:22:16' },
      { recordNo: 'HBC2026081200086', type: '主播提现', direction: 'out', amount: 680000, balanceBefore: 3820000, balanceAfter: 3140000, operator: '系统', remark: '提现成功自动扣减 · WD202608120026', createdAt: '2026-08-12 16:08:42' },
      { recordNo: 'HBC2026080500041', type: '分成修正', direction: 'out', amount: 180000, balanceBefore: 4000000, balanceAfter: 3820000, operator: 'Dimas Putra', remark: '修正重复计入的门票分成', createdAt: '2026-08-05 14:36:20' },
      { recordNo: 'HBC2026073100195', type: '收益分成', direction: 'in', amount: 4000000, balanceBefore: 0, balanceAfter: 4000000, operator: '系统', remark: '2026 年 6 月主播分成记录导入增加', createdAt: '2026-07-31 09:18:05' }
    ],
    '77208635': [
      { recordNo: 'HBC2026081800116', type: '收益分成', direction: 'in', amount: 1180000, balanceBefore: 1980000, balanceAfter: 3160000, operator: '系统', remark: '2026 年 7 月主播分成记录导入增加', createdAt: '2026-08-18 10:18:40' },
      { recordNo: 'HBC2026072800072', type: '分成修正', direction: 'in', amount: 260000, balanceBefore: 1720000, balanceAfter: 1980000, operator: 'Dimas Putra', remark: '补记遗漏的定制礼物分成', createdAt: '2026-07-28 11:42:18' }
    ],
    '77209318': [
      { recordNo: 'HBC2026081800103', type: '收益分成', direction: 'in', amount: 1420000, balanceBefore: 990000, balanceAfter: 2410000, operator: '系统', remark: '2026 年 7 月主播分成记录导入增加', createdAt: '2026-08-18 10:12:36' }
    ]
  },
  guildBalanceChanges: {
    'G100021': [
      { recordNo: 'GBC2026081800048', type: '收益分成', direction: 'in', amount: 5800000, balanceBefore: 13040000, balanceAfter: 18840000, operator: '系统', remark: '2026 年 7 月公会分成记录导入增加', createdAt: '2026-08-18 11:05:18' },
      { recordNo: 'GBC2026081000026', type: '公会提现', direction: 'out', amount: 3000000, balanceBefore: 16040000, balanceAfter: 13040000, operator: '系统', remark: '提现成功自动扣减 · WD202608100018', createdAt: '2026-08-10 15:28:42' },
      { recordNo: 'GBC2026080100009', type: '收益分成', direction: 'in', amount: 16040000, balanceBefore: 0, balanceAfter: 16040000, operator: '系统', remark: '2026 年 6 月公会分成记录导入增加', createdAt: '2026-08-01 09:12:30' }
    ],
    'G100018': [
      { recordNo: 'GBC2026081800041', type: '收益分成', direction: 'in', amount: 9400000, balanceBefore: 16000000, balanceAfter: 25400000, operator: '系统', remark: '2026 年 7 月公会分成记录导入增加', createdAt: '2026-08-18 10:58:24' },
      { recordNo: 'GBC2026073100033', type: '收益分成', direction: 'in', amount: 16000000, balanceBefore: 0, balanceAfter: 16000000, operator: '系统', remark: '2026 年 6 月公会分成记录导入增加', createdAt: '2026-07-31 10:40:12' }
    ],
    'G100014': [
      { recordNo: 'GBC2026081500037', type: '分成修正', direction: 'out', amount: 200000, balanceBefore: 7000000, balanceAfter: 6800000, operator: 'Dimas Putra', remark: '修正重复计入的公会分成', createdAt: '2026-08-15 14:20:08' },
      { recordNo: 'GBC2026073100028', type: '收益分成', direction: 'in', amount: 7000000, balanceBefore: 0, balanceAfter: 7000000, operator: '系统', remark: '2026 年 6 月公会分成记录导入增加', createdAt: '2026-07-31 10:22:45' }
    ],
    'G100009': [
      { recordNo: 'GBC2026081800032', type: '收益分成', direction: 'in', amount: 12400000, balanceBefore: 0, balanceAfter: 12400000, operator: '系统', remark: '2026 年 7 月公会分成记录导入增加', createdAt: '2026-08-18 10:44:16' }
    ],
    'G100003': [
      { recordNo: 'GBC2026081200021', type: '公会提现', direction: 'out', amount: 5000000, balanceBefore: 5000000, balanceAfter: 0, operator: '系统', remark: '提现成功自动扣减 · WD202608120031', createdAt: '2026-08-12 16:42:10' },
      { recordNo: 'GBC2026073100015', type: '收益分成', direction: 'in', amount: 5000000, balanceBefore: 0, balanceAfter: 5000000, operator: '系统', remark: '2026 年 6 月公会分成记录导入增加', createdAt: '2026-07-31 09:56:38' }
    ]
  },
  guildAccountBalances: [
    { guildId: 'G100021', guildName: 'Aurora Guild', balance: 18840000, withdrawnTotal: 42600000, withdrawing: 2720000 },
    { guildId: 'G100018', guildName: 'Star House', balance: 25400000, withdrawnTotal: 59800000, withdrawing: 1850000 },
    { guildId: 'G100014', guildName: 'Blue Ocean', balance: 6800000, withdrawnTotal: 21800000, withdrawing: 920000 },
    { guildId: 'G100009', guildName: 'Moonlight', balance: 12400000, withdrawnTotal: 33200000, withdrawing: 0 },
    { guildId: 'G100003', guildName: 'Sunrise Club', balance: 0, withdrawnTotal: 18600000, withdrawing: 0 }
  ],
  system: {
    accounts: [
      { id: 'ADM10001', username: 'superadmin', name: '系统管理员', roleId: 'ROLE001', role: '超级管理员', status: 'enabled', lastLoginAt: '2026-08-07 09:42', createdAt: '2026-01-10 10:00', updatedAt: '2026-08-01 11:20', locked: true },
      { id: 'ADM10008', username: 'maya.chen', name: 'Maya Chen', roleId: 'ROLE002', role: '运营管理员', status: 'enabled', lastLoginAt: '2026-08-07 09:18', createdAt: '2026-03-05 14:20', updatedAt: '2026-08-05 16:32' },
      { id: 'ADM10012', username: 'rani.audit', name: 'Rani Hartono', roleId: 'ROLE003', role: '内容审核员', status: 'enabled', lastLoginAt: '2026-08-07 08:56', createdAt: '2026-04-18 09:30', updatedAt: '2026-07-28 10:16' },
      { id: 'ADM10016', username: 'dimas.finance', name: 'Dimas Putra', roleId: 'ROLE004', role: '财务管理员', status: 'enabled', lastLoginAt: '2026-08-06 18:40', createdAt: '2026-05-12 11:10', updatedAt: '2026-08-06 13:45' },
      { id: 'ADM10021', username: 'nina.service', name: 'Nina Sari', roleId: 'ROLE005', role: '客服专员', status: 'disabled', lastLoginAt: '2026-07-31 16:22', createdAt: '2026-06-02 15:40', updatedAt: '2026-08-02 09:08' },
      { id: 'ADM10027', username: 'bagus.patrol', name: 'Bagus Santoso', roleId: 'ROLE006', role: '巡房专员', status: 'enabled', lastLoginAt: '从未登录', createdAt: '2026-08-06 10:25', updatedAt: '2026-08-06 10:25' }
    ],
    roles: [
      { id: 'ROLE001', name: '超级管理员', permissionCount: 24, dataScope: '全平台', status: 'enabled', accountCount: 1, createdAt: '2026-01-10 10:00', updatedAt: '2026-01-10 10:00', locked: true },
      { id: 'ROLE002', name: '运营管理员', permissionCount: 18, dataScope: '全平台', status: 'enabled', accountCount: 3, createdAt: '2026-02-16 09:20', updatedAt: '2026-07-30 14:08' },
      { id: 'ROLE003', name: '内容审核员', permissionCount: 9, dataScope: '全平台', status: 'enabled', accountCount: 8, createdAt: '2026-02-18 11:30', updatedAt: '2026-07-22 16:40' },
      { id: 'ROLE004', name: '财务管理员', permissionCount: 10, dataScope: '全平台', status: 'enabled', accountCount: 4, createdAt: '2026-03-01 10:10', updatedAt: '2026-08-01 09:36' },
      { id: 'ROLE005', name: '客服专员', permissionCount: 7, dataScope: '指定业务范围', status: 'disabled', accountCount: 2, createdAt: '2026-03-10 15:05', updatedAt: '2026-08-02 09:08' },
      { id: 'ROLE006', name: '巡房专员', permissionCount: 6, dataScope: '指定业务范围', status: 'enabled', accountCount: 5, createdAt: '2026-04-12 13:20', updatedAt: '2026-07-26 12:18' }
    ],
    permissions: [
      { group: '用户与主播', items: ['查看用户', '处置用户', '审核主播', '处置主播', '查看直播', '强制关播'] },
      { group: '公会与运营', items: ['查看公会', '维护公会', '配置礼物', '配置运营位', '管理推送', '配置任务'] },
      { group: '财务分成', items: ['查看订单', '提现审核', '查看分账', '登记分成', '配置分账', '导出财务数据'] },
      { group: '数据与系统', items: ['查看数据分析', '导出经营报表', '维护后台账号', '配置角色权限', '配置系统参数', '查看操作审计'] }
    ],
    parameters: [
      { id: 'PARAM001', category: '提现配置', code: 'withdrawal.minimum', name: '最低提现金额', value: '$10.00', valueType: 'money', rawValue: 10, unit: 'USD', status: 'enabled', effectiveAt: '2026-08-01 00:00', updatedAt: '2026-08-01 11:20', operator: '系统管理员', description: '主播单笔提现申请的最低美元金额。' },
      { id: 'PARAM002', category: '提现配置', code: 'withdrawal.channels', name: '提现到账通道', value: '银行转账、DANA、GoPay', valueType: 'channels', rawValue: ['银行转账', 'DANA', 'GoPay'], status: 'enabled', effectiveAt: '2026-07-20 00:00', updatedAt: '2026-07-19 16:42', operator: 'Dimas Putra', description: '主播可选择的提现到账方式。' },
      { id: 'PARAM003', category: '汇率配置', code: 'coin.purchase.rate', name: '充值金币汇率', value: '1 USD = 1.000 金币', valueType: 'rate', rawValue: 1000, unit: '金币/USD', status: 'enabled', effectiveAt: '2026-08-01 00:00', updatedAt: '2026-07-30 10:16', operator: '系统管理员', description: '真实货币充值换算为基础金币的汇率。' },
      { id: 'PARAM004', category: '收益配置', code: 'coin.earning.rate', name: '金币收益换算', value: '1.000 金币 = 1 USD', valueType: 'earningRate', rawValue: 1000, unit: '金币/USD', status: 'enabled', effectiveAt: '2026-08-01 00:00', updatedAt: '2026-07-30 10:18', operator: '系统管理员', description: '主播收益金币换算为分成货币的规则。' },
      { id: 'PARAM005', category: '提现配置', code: 'withdrawal.fee.rate', name: '提现手续费率', value: '1%', valueType: 'percent', rawValue: 1, unit: '%', status: 'enabled', effectiveAt: '2026-06-01 00:00', updatedAt: '2026-05-28 14:36', operator: 'Dimas Putra', description: '从主播应付金额中扣除的提现手续费比例。' },
      { id: 'PARAM006', category: '收益配置', code: 'lucky.earning.rate', name: '幸运礼物收益比例', value: '1%', valueType: 'percent', rawValue: 1, unit: '%', status: 'disabled', effectiveAt: '2026-08-10 00:00', updatedAt: '2026-08-06 17:05', operator: 'Maya Chen', description: '幸运礼物净消耗计入主播收益的比例。' },
      { id: 'PARAM007', category: '直播配置', code: 'live.room.type.tags', name: '直播间类型标签', value: '唱歌、聊天、舞蹈、才艺', valueType: 'tags', rawValue: ['唱歌', '聊天', '舞蹈', '才艺'], status: 'enabled', effectiveAt: '2026-08-11 00:00', updatedAt: '2026-08-11 10:00', operator: '系统管理员', description: '主播开播时可选择的直播间类型标签，按配置顺序展示。' }
    ],
    auditLogs: [
      { id: 'LOG2608070098', account: 'superadmin', operator: '系统管理员', module: '系统配置', objectType: '后台角色', objectId: 'ROLE004', objectName: '财务管理员', action: '编辑角色权限', content: '新增“导出财务数据”权限', time: '2026-08-07 09:36', changes: [{ field: '功能权限', before: '13 项', after: '14 项' }, { field: '新增权限', before: '-', after: '导出财务数据' }] },
      { id: 'LOG2608070084', account: 'maya.chen', operator: 'Maya Chen', module: '运营配置', objectType: '功能开关', objectId: 'FS002', objectName: '密码房', action: '关闭功能', content: '关闭密码房全量开放，保留指定测试用户', time: '2026-08-07 09:12', changes: [{ field: '开关状态', before: '开启', after: '关闭' }, { field: '开放范围', before: '全部用户', after: '指定测试用户' }] },
      { id: 'LOG2608070061', account: 'dimas.finance', operator: 'Dimas Putra', module: '财务分成', objectType: '提现申请', objectId: 'WD202608050018', objectName: 'Sari 提现申请', action: '审核通过', content: '收款账户与实名认证一致，提现审核通过', time: '2026-08-07 08:48', changes: [{ field: '审核状态', before: '待审核', after: '已通过' }] },
      { id: 'LOG2608060216', account: 'superadmin', operator: '系统管理员', module: '系统配置', objectType: '系统参数', objectId: 'PARAM001', objectName: '最低提现金额', action: '编辑参数', content: '调整最低提现金额并设置次日生效', time: '2026-08-06 17:20', changes: [{ field: '参数值', before: '$5.00', after: '$10.00' }, { field: '生效时间', before: '立即生效', after: '2026-08-07 00:00' }] },
      { id: 'LOG2608060188', account: 'rani.audit', operator: 'Rani Hartono', module: '主播管理', objectType: '内容告警', objectId: 'AUD2608060048', objectName: '直播内容告警', action: '人工复审', content: '确认未违规，忽略机审告警', time: '2026-08-06 16:05', changes: [{ field: '审核状态', before: '待复审', after: '已忽略' }] },
      { id: 'LOG2608060142', account: 'maya.chen', operator: 'Maya Chen', module: '公会管理', objectType: '公会', objectId: 'G100014', objectName: 'Blue Ocean', action: '停用公会', content: '因合约到期暂停公会业务资格', time: '2026-08-06 14:32', changes: [{ field: '公会状态', before: '启用', after: '停用' }] },
      { id: 'LOG2608060106', account: 'superadmin', operator: '系统管理员', module: '系统配置', objectType: '后台账号', objectId: 'ADM10027', objectName: 'bagus.patrol', action: '新建账号', content: '创建巡房专员账号并分配角色', time: '2026-08-06 10:25', changes: [{ field: '账号状态', before: '-', after: '启用' }, { field: '所属角色', before: '-', after: '巡房专员' }] },
      { id: 'LOG2608050268', account: 'dimas.finance', operator: 'Dimas Putra', module: '财务分成', objectType: '分成记录', objectId: 'ST202608050008', objectName: 'Sari 收益分成', action: '登记分成', content: '录入线下银行转账凭证并完成核销', time: '2026-08-05 18:16', changes: [{ field: '分成状态', before: '待分成', after: '已分成' }] }
    ]
  },
  analytics: {
    trend: [
      { date: '08-01', newUsers: 1260, activeUsers: 18420, recharge: 68400, consume: 12800000, revenue: 41200, sessions: 386, duration: 12840 },
      { date: '08-02', newUsers: 1380, activeUsers: 19260, recharge: 72100, consume: 13600000, revenue: 43800, sessions: 405, duration: 13420 },
      { date: '08-03', newUsers: 1315, activeUsers: 20110, recharge: 70600, consume: 14200000, revenue: 45100, sessions: 398, duration: 13210 },
      { date: '08-04', newUsers: 1490, activeUsers: 21480, recharge: 79800, consume: 15100000, revenue: 48600, sessions: 432, duration: 14680 },
      { date: '08-05', newUsers: 1585, activeUsers: 22630, recharge: 84600, consume: 16200000, revenue: 52300, sessions: 451, duration: 15340 },
      { date: '08-06', newUsers: 1710, activeUsers: 23940, recharge: 89200, consume: 17400000, revenue: 56800, sessions: 478, duration: 16120 },
      { date: '08-07', newUsers: 1820, activeUsers: 25160, recharge: 93600, consume: 18100000, revenue: 59400, sessions: 496, duration: 16860 }
    ],
    userRechargeStatistics: [
      { date: '2026-08-07', registered: 1820, newRechargeUsers: 342, newRechargeAmount: 12009, newUserArpu: 35.11, oldLoginUsers: 23340, oldRechargeAmount: 81591, dailyTotalRecharge: 93600 },
      { date: '2026-08-06', registered: 1710, newRechargeUsers: 318, newRechargeAmount: 10830, newUserArpu: 34.06, oldLoginUsers: 22230, oldRechargeAmount: 78370, dailyTotalRecharge: 89200 },
      { date: '2026-08-05', registered: 1585, newRechargeUsers: 296, newRechargeAmount: 10112, newUserArpu: 34.16, oldLoginUsers: 21045, oldRechargeAmount: 74488, dailyTotalRecharge: 84600 },
      { date: '2026-08-04', registered: 1490, newRechargeUsers: 274, newRechargeAmount: 9438, newUserArpu: 34.45, oldLoginUsers: 19990, oldRechargeAmount: 70362, dailyTotalRecharge: 79800 },
      { date: '2026-08-03', registered: 1315, newRechargeUsers: 245, newRechargeAmount: 8265, newUserArpu: 33.73, oldLoginUsers: 18795, oldRechargeAmount: 62335, dailyTotalRecharge: 70600 },
      { date: '2026-08-02', registered: 1380, newRechargeUsers: 258, newRechargeAmount: 8718, newUserArpu: 33.79, oldLoginUsers: 17880, oldRechargeAmount: 63382, dailyTotalRecharge: 72100 },
      { date: '2026-08-01', registered: 1260, newRechargeUsers: 234, newRechargeAmount: 7804, newUserArpu: 33.35, oldLoginUsers: 17160, oldRechargeAmount: 60596, dailyTotalRecharge: 68400 }
    ],
    dailyStatistics: [
      { date: '2026-08-19', activeUsers: 28640, newUsers: 1970, rechargeAmount: 108600, rechargeUsers: 3124, newRechargeUsers: 382, newRechargeAmount: 13752, newUserArpu: 36.00, liveHosts: 526, effectiveHosts: 184, medianLiveMinutes: 198, refundOrderCount: 3, refundAmount: 1200 },
      { date: '2026-08-18', activeUsers: 27420, newUsers: 1840, rechargeAmount: 103200, rechargeUsers: 3018, newRechargeUsers: 356, newRechargeAmount: 12780, newUserArpu: 35.90, liveHosts: 508, effectiveHosts: 176, medianLiveMinutes: 192, refundOrderCount: 2, refundAmount: 800 },
      { date: '2026-08-17', activeUsers: 29860, newUsers: 2055, rechargeAmount: 116800, rechargeUsers: 3296, newRechargeUsers: 401, newRechargeAmount: 14536, newUserArpu: 36.25, liveHosts: 548, effectiveHosts: 196, medianLiveMinutes: 205, refundOrderCount: 4, refundAmount: 1560 },
      { date: '2026-08-16', activeUsers: 31240, newUsers: 2160, rechargeAmount: 124600, rechargeUsers: 3428, newRechargeUsers: 422, newRechargeAmount: 15403, newUserArpu: 36.50, liveHosts: 566, effectiveHosts: 204, medianLiveMinutes: 212, refundOrderCount: 1, refundAmount: 320 },
      { date: '2026-08-15', activeUsers: 26580, newUsers: 1765, rechargeAmount: 98400, rechargeUsers: 2894, newRechargeUsers: 336, newRechargeAmount: 11894, newUserArpu: 35.40, liveHosts: 492, effectiveHosts: 168, medianLiveMinutes: 188, refundOrderCount: 2, refundAmount: 640 },
      { date: '2026-08-14', activeUsers: 25840, newUsers: 1680, rechargeAmount: 94600, rechargeUsers: 2816, newRechargeUsers: 318, newRechargeAmount: 11235, newUserArpu: 35.33, liveHosts: 478, effectiveHosts: 161, medianLiveMinutes: 184, refundOrderCount: 1, refundAmount: 160 },
      { date: '2026-08-13', activeUsers: 24960, newUsers: 1595, rechargeAmount: 90200, rechargeUsers: 2732, newRechargeUsers: 302, newRechargeAmount: 10661, newUserArpu: 35.30, liveHosts: 464, effectiveHosts: 154, medianLiveMinutes: 179, refundOrderCount: 0, refundAmount: 0 }
    ],
    hostPerformanceStatistics: [
      { date: '2026-08-19', hostId: '77210411', hostName: 'Sari', initials: 'S', guild: 'Aurora Guild', giftRevenue: 4860, giftCount: 12840, liveMinutes: 226, sessions: 2, effectiveDays: 1 },
      { date: '2026-08-19', hostId: '77208635', hostName: 'Dewi', initials: 'D', guild: 'Star House', giftRevenue: 4210, giftCount: 10960, liveMinutes: 198, sessions: 1, effectiveDays: 1 },
      { date: '2026-08-19', hostId: '77209318', hostName: 'Maya', initials: 'M', guild: 'Aurora Guild', giftRevenue: 3680, giftCount: 9240, liveMinutes: 184, sessions: 1, effectiveDays: 1 },
      { date: '2026-08-19', hostId: '77206508', hostName: 'Intan', initials: 'I', guild: 'Moonlight', giftRevenue: 2860, giftCount: 7180, liveMinutes: 162, sessions: 1, effectiveDays: 0 },
      { date: '2026-08-19', hostId: '77207152', hostName: 'Ayu', initials: 'A', guild: 'Blue Ocean', giftRevenue: 2340, giftCount: 5860, liveMinutes: 146, sessions: 1, effectiveDays: 0 },
      { date: '2026-08-18', hostId: '77210411', hostName: 'Sari', initials: 'S', guild: 'Aurora Guild', giftRevenue: 4520, giftCount: 11920, liveMinutes: 205, sessions: 1, effectiveDays: 1 },
      { date: '2026-08-18', hostId: '77208635', hostName: 'Dewi', initials: 'D', guild: 'Star House', giftRevenue: 3980, giftCount: 10340, liveMinutes: 210, sessions: 2, effectiveDays: 1 },
      { date: '2026-08-18', hostId: '77209318', hostName: 'Maya', initials: 'M', guild: 'Aurora Guild', giftRevenue: 3420, giftCount: 8650, liveMinutes: 176, sessions: 1, effectiveDays: 0 },
      { date: '2026-08-18', hostId: '77206508', hostName: 'Intan', initials: 'I', guild: 'Moonlight', giftRevenue: 2640, giftCount: 6820, liveMinutes: 190, sessions: 1, effectiveDays: 1 },
      { date: '2026-08-18', hostId: '77207152', hostName: 'Ayu', initials: 'A', guild: 'Blue Ocean', giftRevenue: 2180, giftCount: 5480, liveMinutes: 185, sessions: 1, effectiveDays: 1 },
      { date: '2026-08-17', hostId: '77210411', hostName: 'Sari', initials: 'S', guild: 'Aurora Guild', giftRevenue: 5180, giftCount: 13620, liveMinutes: 260, sessions: 2, effectiveDays: 1 },
      { date: '2026-08-17', hostId: '77208635', hostName: 'Dewi', initials: 'D', guild: 'Star House', giftRevenue: 4460, giftCount: 11480, liveMinutes: 220, sessions: 1, effectiveDays: 1 },
      { date: '2026-08-17', hostId: '77209318', hostName: 'Maya', initials: 'M', guild: 'Aurora Guild', giftRevenue: 3860, giftCount: 9680, liveMinutes: 205, sessions: 1, effectiveDays: 1 },
      { date: '2026-08-17', hostId: '77206508', hostName: 'Intan', initials: 'I', guild: 'Moonlight', giftRevenue: 3020, giftCount: 7540, liveMinutes: 181, sessions: 1, effectiveDays: 1 },
      { date: '2026-08-17', hostId: '77207152', hostName: 'Ayu', initials: 'A', guild: 'Blue Ocean', giftRevenue: 2460, giftCount: 6120, liveMinutes: 180, sessions: 1, effectiveDays: 1 }
    ],
    hostLiveRecordReports: [
      { hostId: '77210411', hostName: 'Sari', roomId: '710028', roomType: '普通房', startedAt: '2026-08-19 08:35', endedAt: '2026-08-19 12:21', duration: '3h 46m', qualified: true, viewerCount: 52380, consumptionCoins: 2860000 },
      { hostId: '77208635', hostName: 'Dewi', roomId: '710084', roomType: '门票房', startedAt: '2026-08-19 13:10', endedAt: '2026-08-19 16:28', duration: '3h 18m', qualified: true, viewerCount: 31860, consumptionCoins: 1940000 },
      { hostId: '77209318', hostName: 'Maya', roomId: '710106', roomType: '密码房', startedAt: '2026-08-19 18:42', endedAt: '2026-08-19 20:26', duration: '1h 44m', qualified: false, viewerCount: 16840, consumptionCoins: 1460000 },
      { hostId: '77206508', hostName: 'Intan', roomId: '710063', roomType: '普通房', startedAt: '2026-08-18 09:18', endedAt: '2026-08-18 12:28', duration: '3h 10m', qualified: true, viewerCount: 28640, consumptionCoins: 1720000 },
      { hostId: '77207152', hostName: 'Ayu', roomId: '710052', roomType: '普通房', startedAt: '2026-08-18 14:06', endedAt: '2026-08-18 16:31', duration: '2h 25m', qualified: true, viewerCount: 21760, consumptionCoins: 1280000 },
      { hostId: '77210411', hostName: 'Sari', roomId: '710028', roomType: '普通房', startedAt: '2026-08-17 10:02', endedAt: '2026-08-17 14:22', duration: '4h 20m', qualified: true, viewerCount: 56820, consumptionCoins: 3120000 },
      { hostId: '77209318', hostName: 'Maya', roomId: '710106', roomType: '密码房', startedAt: '2026-08-17 15:20', endedAt: '2026-08-17 17:05', duration: '1h 45m', qualified: false, viewerCount: 14260, consumptionCoins: 980000 },
      { hostId: '77208635', hostName: 'Dewi', roomId: '710084', roomType: '门票房', startedAt: '2026-08-17 19:06', endedAt: '2026-08-17 22:42', duration: '3h 36m', qualified: true, viewerCount: 34720, consumptionCoins: 2160000 }
    ],
    financeReconciliation: {
      monthlyIncomeExpense: [
        { month: '2026-08', totalRevenue: 1795000, guildShareAmount: 3590, hostShareAmount: 8975, userRechargeAmount: 119800, userRefundAmount: 1920 },
        { month: '2026-07', totalRevenue: 1656000, guildShareAmount: 3312, hostShareAmount: 8280, userRechargeAmount: 110400, userRefundAmount: 1400 },
        { month: '2026-06', totalRevenue: 1518000, guildShareAmount: 3036, hostShareAmount: 7590, userRechargeAmount: 102600, userRefundAmount: 960 }
      ],
      monthlyHostShare: [
        { month: '2026-08', hostId: '77210411', hostName: 'Sari', guildId: 'G100021', guildName: 'Aurora Guild', effectiveDays: 18, liveSessions: 24, monthlyRevenue: 486000, normalGift: 256000, customGift: 90000, luckyGift: 80000, ticket: 60000 },
        { month: '2026-08', hostId: '77209318', hostName: 'Maya', guildId: 'G100021', guildName: 'Aurora Guild', effectiveDays: 16, liveSessions: 21, monthlyRevenue: 368000, normalGift: 188000, customGift: 70000, luckyGift: 65000, ticket: 45000 },
        { month: '2026-08', hostId: '77208635', hostName: 'Dewi', guildId: 'G100018', guildName: 'Star House', effectiveDays: 17, liveSessions: 22, monthlyRevenue: 421000, normalGift: 221000, customGift: 80000, luckyGift: 70000, ticket: 50000 },
        { month: '2026-08', hostId: '77207152', hostName: 'Ayu', guildId: 'G100014', guildName: 'Blue Ocean', effectiveDays: 14, liveSessions: 18, monthlyRevenue: 234000, normalGift: 124000, customGift: 40000, luckyGift: 40000, ticket: 30000 },
        { month: '2026-08', hostId: '77206508', hostName: 'Intan', guildId: 'G100009', guildName: 'Moonlight', effectiveDays: 15, liveSessions: 19, monthlyRevenue: 286000, normalGift: 146000, customGift: 60000, luckyGift: 45000, ticket: 35000 },
        { month: '2026-07', hostId: '77210411', hostName: 'Sari', guildId: 'G100021', guildName: 'Aurora Guild', effectiveDays: 25, liveSessions: 34, monthlyRevenue: 448000, normalGift: 238000, customGift: 80000, luckyGift: 75000, ticket: 55000 }
      ],
      monthlyHostEarnings: [
        { month: '2026-08', hostGiftKey: '77210411-GFT1002', hostId: '77210411', hostName: 'Sari', giftId: 'GFT1002', giftName: '金色星星', giftType: '普通礼物', unitPrice: 500, quantity: 180, earnings: 45000 },
        { month: '2026-08', hostGiftKey: '77210411-GFT1001', hostId: '77210411', hostName: 'Sari', giftId: 'GFT1001', giftName: '玫瑰', giftType: '普通礼物', unitPrice: 10, quantity: 1800, earnings: 9000 },
        { month: '2026-08', hostGiftKey: '77209318-GFT1007', hostId: '77209318', hostName: 'Maya', giftId: 'GFT1007', giftName: '幸运礼物 10 连送', giftType: '幸运礼物', unitPrice: 100, quantity: 740, earnings: 37000 },
        { month: '2026-08', hostGiftKey: '77208635-TICKET-300', hostId: '77208635', hostName: 'Dewi', giftId: 'TICKET-300', giftName: '粉丝专属演出门票', giftType: '门票', unitPrice: 300, quantity: 160, earnings: 24000 },
        { month: '2026-08', hostGiftKey: '77206508-GFT1005', hostId: '77206508', hostName: 'Intan', giftId: 'GFT1005', giftName: '音乐皇冠', giftType: '定制礼物', unitPrice: 300, quantity: 210, earnings: 31500 },
        { month: '2026-08', hostGiftKey: '77207152-GFT1001', hostId: '77207152', hostName: 'Ayu', giftId: 'GFT1001', giftName: '玫瑰', giftType: '普通礼物', unitPrice: 10, quantity: 1200, earnings: 6000 },
        { month: '2026-07', hostGiftKey: '77210411-GFT1002', hostId: '77210411', hostName: 'Sari', giftId: 'GFT1002', giftName: '金色星星', giftType: '普通礼物', unitPrice: 500, quantity: 150, earnings: 37500 }
      ],
      monthlyViewerConsumption: [
        { month: '2026-08', viewerId: '88231007', viewerName: 'Andi Pratama', monthlyConsumption: 28600, cumulativeRecharge: 258, normalGift: 14600, customGift: 6000, luckyGift: 5000, ticket: 3000 },
        { month: '2026-08', viewerId: '88229841', viewerName: 'Nadia Putri', monthlyConsumption: 24200, cumulativeRecharge: 875, normalGift: 11200, customGift: 5000, luckyGift: 5600, ticket: 2400 },
        { month: '2026-08', viewerId: '88227653', viewerName: 'Rizky Maulana', monthlyConsumption: 19800, cumulativeRecharge: 82, normalGift: 9800, customGift: 4000, luckyGift: 3600, ticket: 2400 },
        { month: '2026-08', viewerId: '88225190', viewerName: 'Siti Rahma', monthlyConsumption: 16400, cumulativeRecharge: 2360, normalGift: 8400, customGift: 3200, luckyGift: 3000, ticket: 1800 },
        { month: '2026-08', viewerId: '88220472', viewerName: 'Aulia Safitri', monthlyConsumption: 13200, cumulativeRecharge: 1280, normalGift: 6200, customGift: 2800, luckyGift: 2600, ticket: 1600 },
        { month: '2026-07', viewerId: '88231007', viewerName: 'Andi Pratama', monthlyConsumption: 25400, cumulativeRecharge: 258, normalGift: 12800, customGift: 5200, luckyGift: 4600, ticket: 2800 }
      ],
      monthlyGiftSales: [
        { month: '2026-08', giftId: 'GFT1001', giftName: '玫瑰', giftType: '普通礼物', unitPrice: 10, salesVolume: 12840, monthlySales: 128400 },
        { month: '2026-08', giftId: 'GFT1002', giftName: '金色星星', giftType: '普通礼物', unitPrice: 500, salesVolume: 860, monthlySales: 430000 },
        { month: '2026-08', giftId: 'GFT1005', giftName: '音乐皇冠', giftType: '定制礼物', unitPrice: 300, salesVolume: 624, monthlySales: 187200 },
        { month: '2026-08', giftId: 'GFT1007', giftName: '幸运礼物 10 连送', giftType: '幸运礼物', unitPrice: 100, salesVolume: 1480, monthlySales: 148000 },
        { month: '2026-08', giftId: 'TICKET-100', giftName: '周末演唱会门票', giftType: '门票', unitPrice: 100, salesVolume: 936, monthlySales: 93600 },
        { month: '2026-07', giftId: 'GFT1001', giftName: '玫瑰', giftType: '普通礼物', unitPrice: 10, salesVolume: 11620, monthlySales: 116200 }
      ],
      consumptionOrderDetail: [
        { viewerId: '88231007', viewerName: 'Andi Pratama', productType: '普通礼物', productId: 'GFT1002', productName: '金色星星', unitPrice: 500, quantity: 2, consumptionCoins: 1000, hostEarnings: 500, hostId: '77210411', hostName: 'Sari', guildId: 'G100021', guildName: 'Aurora Guild', sessionId: 'LS2608200089', consumedAt: '2026-08-20 20:10:10' },
        { viewerId: '88229841', viewerName: 'Nadia Putri', productType: '幸运礼物', productId: 'GFT1007', productName: '幸运礼物 10 连送', unitPrice: 100, quantity: 1, consumptionCoins: 100, hostEarnings: 50, hostId: '77209318', hostName: 'Maya', guildId: 'G100021', guildName: 'Aurora Guild', sessionId: 'LS2608200076', consumedAt: '2026-08-20 19:42:18' },
        { viewerId: '88227653', viewerName: 'Rizky Maulana', productType: '门票', productId: 'TICKET-100', productName: '周末演唱会门票', unitPrice: 100, quantity: 1, consumptionCoins: 100, hostEarnings: 50, hostId: '77208635', hostName: 'Dewi', guildId: 'G100018', guildName: 'Star House', sessionId: 'LS2608190068', consumedAt: '2026-08-19 21:08:05' },
        { viewerId: '88223016', viewerName: 'Fajar Nugroho', productType: '定制礼物', productId: 'GFT1005', productName: '音乐皇冠', unitPrice: 300, quantity: 3, consumptionCoins: 900, hostEarnings: 450, hostId: '77206508', hostName: 'Intan', guildId: 'G100009', guildName: 'Moonlight', sessionId: 'LS2608180091', consumedAt: '2026-08-18 22:47:36' },
        { viewerId: '88220472', viewerName: 'Aulia Safitri', productType: '普通礼物', productId: 'GFT1001', productName: '玫瑰', unitPrice: 10, quantity: 100, consumptionCoins: 1000, hostEarnings: 500, hostId: '77207152', hostName: 'Ayu', guildId: 'G100014', guildName: 'Blue Ocean', sessionId: 'LS2608160054', consumedAt: '2026-08-16 18:26:44' },
        { viewerId: '88218339', viewerName: 'Bima Saputra', productType: '门票', productId: 'TICKET-300', productName: '粉丝专属演出门票', unitPrice: 300, quantity: 1, consumptionCoins: 300, hostEarnings: 150, hostId: '77210411', hostName: 'Sari', guildId: 'G100021', guildName: 'Aurora Guild', sessionId: 'LS2607310072', consumedAt: '2026-07-31 20:14:09' }
      ],
      refundOrderDetail: [
        { refundedAt: '2026-08-20 20:10:10', refundAmount: 1000, refundProduct: '1,000 金币充值', userId: '88231007', userName: 'Andi Pratama' },
        { refundedAt: '2026-08-18 14:26:32', refundAmount: 640, refundProduct: '640 金币充值', userId: '88223016', userName: 'Fajar Nugroho' },
        { refundedAt: '2026-08-11 19:42:16', refundAmount: 80, refundProduct: '80 金币充值', userId: '88218339', userName: 'Bima Saputra' },
        { refundedAt: '2026-07-29 11:58:04', refundAmount: 320, refundProduct: '320 金币充值', userId: '88229841', userName: 'Nadia Putri' }
      ],
      rechargeOrderDetail: [
        { rechargedAt: '2026-08-20 18:32:40', rechargeAmount: 1000, packageName: '首充特惠套餐', paymentChannel: 'Google Play', userId: '88231007', userName: 'Andi Pratama' },
        { rechargedAt: '2026-08-19 16:21:12', rechargeAmount: 320, packageName: '1,250 金币套餐', paymentChannel: 'DANA', userId: '88229841', userName: 'Nadia Putri' },
        { rechargedAt: '2026-08-18 11:43:28', rechargeAmount: 80, packageName: '600 金币套餐', paymentChannel: 'DANA', userId: '88218339', userName: 'Bima Saputra' },
        { rechargedAt: '2026-08-15 20:17:36', rechargeAmount: 640, packageName: '盛夏福利套餐', paymentChannel: 'App Store', userId: '88223016', userName: 'Fajar Nugroho' },
        { rechargedAt: '2026-07-31 16:21:08', rechargeAmount: 160, packageName: '6,500 金币套餐', paymentChannel: 'Google Play', userId: '88216724', userName: 'Ayu Lestari' }
      ]
    },
    regions: [
      { region: 'Jakarta', newUsers: 3180, activeUsers: 42600, recharge: 168400, consume: 32600000, revenue: 104800 },
      { region: 'Jawa Barat', newUsers: 2540, activeUsers: 35120, recharge: 136800, consume: 26400000, revenue: 85600 },
      { region: 'Jawa Timur', newUsers: 2080, activeUsers: 29860, recharge: 112600, consume: 21800000, revenue: 71200 },
      { region: 'Sumatera Utara', newUsers: 1420, activeUsers: 18340, recharge: 76400, consume: 14700000, revenue: 46800 },
      { region: '其他地区', newUsers: 1340, activeUsers: 21080, recharge: 92200, consume: 18100000, revenue: 58900 }
    ],
    consumption: [
      { dimension: 'Google Play', type: '充值渠道', visitUsers: 6240, intentUsers: 4160, payUsers: 1680, recharge: 208600 },
      { dimension: 'App Store', type: '充值渠道', visitUsers: 3180, intentUsers: 2280, payUsers: 1020, recharge: 164200 },
      { dimension: 'DANA', type: '充值渠道', visitUsers: 4860, intentUsers: 3240, payUsers: 1210, recharge: 138400 },
      { dimension: 'GoPay', type: '充值渠道', visitUsers: 3910, intentUsers: 2540, payUsers: 920, recharge: 106800 },
      { dimension: 'H5 / 其他', type: '充值渠道', visitUsers: 2260, intentUsers: 1420, payUsers: 510, recharge: 72400 }
    ],
    consumptionSummary: { activeUsers: 20405, intentUsers: 13640, payUsers: 5340, recharge: 690400, consumers: 13590, consume: 123100000, revenue: 401000 },
    growthSources: [
      { source: '自然注册', newUsers: 4180, activeUsers: 38600, dau: 25160, mau: 162400, d1: 43.8, d7: 24.6, d30: 12.8, churn: 1280 },
      { source: '邀请拉新', newUsers: 2860, activeUsers: 21400, dau: 9180, mau: 68300, d1: 52.6, d7: 31.4, d30: 18.2, churn: 620 },
      { source: '广告投放', newUsers: 2410, activeUsers: 18920, dau: 7640, mau: 59400, d1: 36.2, d7: 17.8, d30: 8.4, churn: 910 },
      { source: '应用商店', newUsers: 1830, activeUsers: 14260, dau: 5920, mau: 43800, d1: 39.5, d7: 20.6, d30: 10.7, churn: 540 },
      { source: '活动落地页', newUsers: 960, activeUsers: 7480, dau: 3160, mau: 22600, d1: 46.8, d7: 26.2, d30: 13.5, churn: 280 }
    ],
    hosts: [
      { id: '77210411', name: 'Sari', guild: 'Aurora Guild', viewerEntries: 6840, bounce10Users: 1259, bounce5mUsers: 2134, watchSeconds: 5759280, viewers: 6100, interactingUsers: 2245, giftUsers: 769, bounce10: 18.4, bounce5m: 31.2, stay: 842, peak: 1280, interaction: 36.8, giftConversion: 12.6, followers: 1840, dailyLiveMinutes: { '2026-08-01': 205, '2026-08-02': 185, '2026-08-03': 260, '2026-08-04': 90, '2026-08-05': 190, '2026-08-06': 0, '2026-08-07': 226 } },
      { id: '77208635', name: 'Dewi', guild: 'Star House', viewerEntries: 5920, bounce10Users: 1279, bounce5mUsers: 2119, watchSeconds: 4546560, viewers: 5300, interactingUsers: 1770, giftUsers: 572, bounce10: 21.6, bounce5m: 35.8, stay: 768, peak: 1120, interaction: 33.4, giftConversion: 10.8, followers: 1520, dailyLiveMinutes: { '2026-08-01': 165, '2026-08-02': 220, '2026-08-03': 195, '2026-08-04': 0, '2026-08-05': 188, '2026-08-06': 210, '2026-08-07': 198 } },
      { id: '77209318', name: 'Maya', guild: 'Aurora Guild', viewerEntries: 4860, bounce10Users: 1171, bounce5mUsers: 1876, watchSeconds: 3363120, viewers: 4400, interactingUsers: 1311, giftUsers: 414, bounce10: 24.1, bounce5m: 38.6, stay: 692, peak: 940, interaction: 29.8, giftConversion: 9.4, followers: 1260, dailyLiveMinutes: { '2026-08-01': 184, '2026-08-02': 160, '2026-08-03': 205, '2026-08-04': 190, '2026-08-05': 176, '2026-08-06': 184, '2026-08-07': 184 } },
      { id: '77206508', name: 'Intan', guild: 'Moonlight', viewerEntries: 3280, bounce10Users: 912, bounce5mUsers: 1394, watchSeconds: 2013920, viewers: 2950, interactingUsers: 755, giftUsers: 242, bounce10: 27.8, bounce5m: 42.5, stay: 614, peak: 760, interaction: 25.6, giftConversion: 8.2, followers: 940, dailyLiveMinutes: { '2026-08-01': 0, '2026-08-02': 181, '2026-08-03': 162, '2026-08-04': 205, '2026-08-05': 190, '2026-08-06': 155, '2026-08-07': 162 } },
      { id: '77207152', name: 'Ayu', guild: 'Blue Ocean', viewerEntries: 2740, bounce10Users: 855, bounce5mUsers: 1271, watchSeconds: 1501520, viewers: 2470, interactingUsers: 546, giftUsers: 168, bounce10: 31.2, bounce5m: 46.4, stay: 548, peak: 620, interaction: 22.1, giftConversion: 6.8, followers: 710, dailyLiveMinutes: { '2026-08-01': 146, '2026-08-02': 180, '2026-08-03': 0, '2026-08-04': 170, '2026-08-05': 185, '2026-08-06': 192, '2026-08-07': 146 } }
    ],
    lives: [
      { sessionId: 'LS2608070042', hostId: '77210411', host: 'Sari', guild: 'Aurora Guild', roomType: '普通房', startAt: '2026-08-07 19:30', duration: 226, peak: 1280, viewers: 6840, cohostCount: 5, cohostDuration: 74 },
      { sessionId: 'LS2608070038', hostId: '77208635', host: 'Dewi', guild: 'Star House', roomType: '门票房', startAt: '2026-08-07 18:46', duration: 198, peak: 1120, viewers: 5920, cohostCount: 3, cohostDuration: 46 },
      { sessionId: 'LS2608070031', hostId: '77209318', host: 'Maya', guild: 'Aurora Guild', roomType: '普通房', startAt: '2026-08-07 17:20', duration: 184, peak: 940, viewers: 4860, cohostCount: 4, cohostDuration: 58 },
      { sessionId: 'LS2608070024', hostId: '77206508', host: 'Intan', guild: 'Moonlight', roomType: '密码房', startAt: '2026-08-07 15:05', duration: 162, peak: 760, viewers: 3280, cohostCount: 2, cohostDuration: 31 },
      { sessionId: 'LS2608070016', hostId: '77207152', host: 'Ayu', guild: 'Blue Ocean', roomType: '普通房', startAt: '2026-08-07 12:40', duration: 146, peak: 620, viewers: 2740, cohostCount: 1, cohostDuration: 18 }
    ],
    earnings: [
      { rank: 1, id: '77210411', name: 'Sari', type: '主播', guild: 'Aurora Guild', earnings: 328600, platformShare: 98580, guildShare: 65720, subjectShare: 164300 },
      { rank: 2, id: '77208635', name: 'Dewi', type: '主播', guild: 'Star House', earnings: 286400, platformShare: 85920, guildShare: 57280, subjectShare: 143200 },
      { rank: 3, id: '77209318', name: 'Maya', type: '主播', guild: 'Aurora Guild', earnings: 248600, platformShare: 74580, guildShare: 49720, subjectShare: 124300 },
      { rank: 4, id: '77206508', name: 'Intan', type: '主播', guild: 'Moonlight', earnings: 214200, platformShare: 64260, guildShare: 42840, subjectShare: 107100 },
      { rank: 5, id: '77207152', name: 'Ayu', type: '主播', guild: 'Blue Ocean', earnings: 178800, platformShare: 53640, guildShare: 35760, subjectShare: 89400 }
    ],
    acquisitions: [
      { rank: 1, inviterId: '88231007', inviter: 'Andi Pratama', invited: 286, valid: 248, recharge: 68400, rebate: 6280, status: '正常' },
      { rank: 2, inviterId: '88229841', inviter: 'Nadia Putri', invited: 242, valid: 216, recharge: 57200, rebate: 5360, status: '正常' },
      { rank: 3, inviterId: '88225190', inviter: 'Siti Rahma', invited: 198, valid: 174, recharge: 46800, rebate: 4210, status: '正常' },
      { rank: 4, inviterId: '88227653', inviter: 'Rizky Maulana', invited: 164, valid: 138, recharge: 38200, rebate: 3480, status: '正常' },
      { rank: 5, inviterId: '88220472', inviter: 'Aulia Safitri', invited: 132, valid: 106, recharge: 29600, rebate: 2640, status: '部分冻结' }
    ]
  },
  guildRecords: {
    'G100021': {
      hosts: [{ id: '77210411', name: 'Sari', level: 38, permission: '已开通', earnings: 32860000, joinedAt: '2026-05-18 10:26', status: '正常' }, { id: '77209318', name: 'Maya', level: 27, permission: '已开通', earnings: 18650000, joinedAt: '2026-06-12 14:08', status: '正常' }],
      members: [{ id: '88231007', name: 'Andi Pratama', joinedAt: '2026-07-28 15:10', status: '正常' }, { id: '88220472', name: 'Aulia Safitri', joinedAt: '2026-06-30 09:24', status: '正常' }],
      income: [{ flowNo: 'GI2608040018', type: '直播分成', amount: 2860000, time: '2026-08-04 12:00' }],
      shares: [{ ledgerNo: 'SL2607310021', base: 42600000, ratio: '平台 30% / 公会 20% / 主播 50%', payable: [12780000, 8520000, 21300000], status: '待分成' }],
      settlements: [{ settlementNo: 'ST2606300021', period: '2026-06', amount: 28600000, status: '已分成' }]
    }
  }
};

(() => {
  const mock = window.LUMA_ADMIN_MOCK;
  const toUsd = (value) => Math.round((Number(value) / 10000) * 100) / 100;
  const convert = (item, fields) => fields.forEach((field) => { item[field] = toUsd(item[field]); });

  mock.users.forEach((item) => convert(item, ['recharge']));
  Object.values(mock.records).forEach((record) => record.recharges.forEach((item) => convert(item, ['amount'])));
  mock.rechargeOrders.forEach((item) => {
    convert(item, ['amount', 'paidAmount']);
    if (item.refund) convert(item.refund, ['amount']);
  });
  mock.rechargePackageItems.forEach((item) => convert(item, ['price']));
  mock.hosts.forEach((item) => convert(item, ['withdrawable', 'frozen']));
  Object.values(mock.hostRecords).forEach((record) => record.withdrawals.forEach((item) => convert(item, ['amount'])));
  mock.withdrawalRequests.forEach((item) => convert(item, ['amount', 'fee', 'netAmount', 'availableBefore', 'availableAfter']));
  mock.shareLedgerItems.forEach((item) => convert(item, ['baseAmount', 'platformAmount', 'guildAmount', 'hostAmount']));
  mock.settlementRecords.forEach((item) => convert(item, ['amount']));
  mock.guilds.forEach((item) => convert(item, ['earnings']));
  mock.hostAccountBalances.forEach((item) => convert(item, ['balance', 'withdrawnTotal', 'withdrawing']));
  Object.values(mock.hostBalanceChanges).forEach((items) => items.forEach((item) => convert(item, ['amount', 'balanceBefore', 'balanceAfter'])));
  Object.values(mock.guildBalanceChanges).forEach((items) => items.forEach((item) => convert(item, ['amount', 'balanceBefore', 'balanceAfter'])));
  mock.guildAccountBalances.forEach((item) => convert(item, ['balance', 'withdrawnTotal', 'withdrawing']));
  Object.values(mock.guildRecords).forEach((record) => {
    record.income.forEach((item) => convert(item, ['amount']));
    record.shares.forEach((item) => {
      convert(item, ['base']);
      item.payable = item.payable.map(toUsd);
    });
    record.settlements.forEach((item) => convert(item, ['amount']));
  });
})();
