
// 联系客服配置
var TextLianXiKeFuCfg = {
	mobile_str: "客服监督电话:%s \n",
	charge_wx_str: "游戏充值请加:%s \n",
	question_str: "客服%d线:%s \n",
	question_str2: "游戏问题请加:%s \n",
	str2:"感谢您使用吉林麻将，我们将竭尽全力为您解决问题!",
};

// 基本番型
var TextRule_1 = {
	name : "基本番型",
	rule : `\
胡牌类型：
1.夹    胡：胡牌为夹（例：5,7胡6）
2.边    胡：1,2胡3；8,9,胡7
3.飘    胡：胡牌时手里面全是叉或者杠
4.七    对：手中6副对子，剩下一张胡单贴
5.天    胡：庄家起手牌就上听胡牌
6.庄    家：玩家坐庄时，不管输赢都加番
7.点    炮：打出别人要胡的牌
8.自    摸：上听后玩家自己摸到要胡的牌
9.门    清：玩家胡牌时没有叉，吃
10.清一色：玩家胡牌时手中只有一色
11.抢杠胡：玩家补蛋时，有玩家刚好胡这张牌被抢胡
12.杠    开：杠牌后，摸到胡牌
13.手把一：手中只有一张牌时，胡单贴
14.摸    宝：上听后摸到宝牌胡牌
15.对    宝：上听后宝牌和胡牌一样时，直接胡牌
    
杠牌类型：
    
1.普通杠：四张一样的牌
2.一    饼：四张一饼
3.二    饼：四张二饼
4.八    万：四张八万
5.幺    鸡：四张幺鸡
6.幺九杠：一饼，一条，一万为幺杠；九饼，九条，九万为九杠
7.三风杠：东南西北其中任意三张组合成风蛋
8.四风杠：东南西北四张牌组合成风蛋
9.喜    杠：中发白组合成的喜蛋
10.小鸡飞蛋：幺鸡可以代替任意风、字牌组合成三风杠，四风杠，喜杠或者代替幺九牌组合成幺九杠`
};

// 基本规则
var TextRule_2 = {
	name : "基本规则",
	rule : `\
胡牌规则
游戏用具：游戏中使用筒、条、万、东南西北、中发白，共136张牌。
游戏人数：4人。
庄家规则：
1.第一局由房主坐庄。
2.庄家赢则庄家连庄，庄家输则由庄家的下家坐庄。
胡牌规则：
1.必须三色全或者清一色。
2.不能胡平胡的牌型。
3.不能缺幺九，当有风、字牌的时候可免幺九（飘胡、七对均不能缺幺九）。
4.不能缺大叉,有杠、风对、喜对、中发白的时候可免叉。
5.允许立门胡。
6.吃、叉允许手把一。
7.只有报听后才能胡牌。
8.东南西北，中发白不算色。
9.幺九杠，喜杠，旋风杠，不算开门。
10.一局只能有一位胡牌者，当一人点炮两家或以上胡牌，从点炮者逆时针方向，顺序在前者胡牌。`
};

// 特殊规则
var TextRule_3 = {
	name : "特殊规则",
	rule : `\
逛锅模式：
锅  子：玩家在游戏中的初始分数和输分上限。
快  锅：当有三位玩家将锅子输完，分数为0时，不论圈数是否结束，游戏结束进行总结算。
不逛锅：游戏中玩家没有锅子，初始分数为0，游戏直至圈数结束方可进行总结算。`
};

// 游戏结算
var TextRule_4 = {
	name: "游戏结算",
	rule: `\
计算方式:
胡分
夹胡2分    单贴2分    边胡4分    飘胡8分    七对封顶    天胡封顶
点炮*2      自摸*2      庄家*2      门清*2      摸宝*2        对宝*4
清一色*2  抢杠胡*2    杠开*2    手把一*2
杠分
幺九杠：  +3分
三风杠：  +3分
四风杠：  +4分
喜    杠：  +3分
补    杠：  +1分
普通杠：  明+2分    暗+4分
一    饼：  明+4分    暗+8分
二    饼：  明+8分    暗+16分
八    万：  明+16分  暗+32分
幺    鸡：  明+16分  暗+32分
1.总分=胡分+杠分
2.逛锅模式下，锅子为0的玩家分数只进不出，即为不给其他玩家结胡分和杠分，别人需要给该玩家结杠分和胡分。
3.在50锅子和100锅子玩法下时，普通杠和大杠分数减半结算`
};

// 其他地点登录账号
var TextNet_9 = `\
您的帐号在其他设备登录
如非本人操作，请注意账号安全\
`;

// 跑马灯默认滚动信息
var TextPaomaDengDefalut =`\
	本游戏仅供娱乐，严禁赌博，一经发现永久封号，更多信息请关注公众号：巷乐游戏！`;

// 配置文件需要用到的全部字段
var TextCfgZhCHS = {

	// 公用数据
	TEXT_COMMON_1 : "正在连接中...",

	// 创建房间 jlmj_create_room
	TEXT_CREATE_1 : "房费",
	TEXT_CREATE_2 : "圈数",
	TEXT_CREATE_3 : "人数",
	TEXT_CREATE_4 : "逛锅",
	TEXT_CREATE_5 : "玩法",
	TEXT_CREATE_6 : "2圈",
	TEXT_CREATE_7 : "4圈",
	TEXT_CREATE_8 : "8圈",
	TEXT_CREATE_9 : "4人场",
	TEXT_CREATE_10 : "16封顶",
	TEXT_CREATE_11 : "32封顶",
	TEXT_CREATE_12 : "64封顶",
	TEXT_CREATE_13 : "50锅底",
	TEXT_CREATE_14 : "100锅底",
	TEXT_CREATE_15 : "200锅底",
	TEXT_CREATE_16 : "不逛锅",
	TEXT_CREATE_17 : "快锅",
	TEXT_CREATE_18 : "点炮包三家",
	TEXT_CREATE_19 : "幺九蛋",
	TEXT_CREATE_20 : "小鸡飞蛋",
	TEXT_CREATE_21 : "快宝",
	TEXT_CREATE_22 : "幺鸡万能宝",
	TEXT_CREATE_23 : "幺九蛋顶三色",
	TEXT_CREATE_24 : "房卡在第一次结算后正式扣除，此前解散房间不扣除房卡",
	TEXT_CREATE_25 : "房主支付",
	TEXT_CREATE_26 : "您的房卡不足请充值！！！",

	// 加入房间 jlmj_enter_Room
	TEXT_JOIN_1 : "请输入房间号",
	TEXT_JOIN_2 : "50锅底 封顶:16倍",
	TEXT_JOIN_3 : "100锅底 封顶:32倍",
	TEXT_JOIN_4 : "200锅底 封顶:64倍",
	TEXT_JOIN_5 : "不逛锅 封顶:32倍",
	TEXT_JOIN_6 : "点炮包三家 ",
	TEXT_JOIN_7 : "幺九蛋 ",
	TEXT_JOIN_8 : "小鸡飞蛋 ",
	TEXT_JOIN_9 : "快宝 ",
	TEXT_JOIN_10 : "幺鸡万能宝 ",
	TEXT_JOIN_11 : "幺九蛋顶三色 ",
	TEXT_JOIN_12 : "快锅 ",
	TEXT_JOIN_13 : "房间号不存在",
	TEXT_JOIN_14 : "房间号错误",
	TEXT_JOIN_15 : "进入房间失败",
	TEXT_JOIN_16 : "房间人数已满",
	TEXT_JOIN_17 : "加入房间未知错误",
	TEXT_JOIN_18 : "重连加入房间失败",
	TEXT_JOIN_19 : "不逛锅 封顶:64倍",



	// 实名认证 jlmj_hall_shiming
	TEXT_SHI_MING_1 : "姓名",
	TEXT_SHI_MING_2 : "身份证",

	// 规则 
	Text_Rule_1 : TextRule_1,
	Text_Rule_2 : TextRule_2,
	Text_Rule_3 : TextRule_3,
	Text_Rule_4 : TextRule_4,

	// 联系客服 jlmj_hall_kefu
	TEXT_KE_FU : TextLianXiKeFuCfg,

	// 退出房间提示 jlmj_popup_view
	TEXT_LEAVE_ROOM_1 : "您确定要解散本局游戏吗?",
	TEXT_LEAVE_ROOM_2 : "游戏已开始，确定申请解散房间吗？",
	TEXT_LEAVE_ROOM_3 : "确定要离开游戏吗？",
	TEXT_LEAVE_ROOM_4 : "正在游戏中，退出后系统自动出牌，是否退出？",
	TEXT_LEAVE_ROOM_5 : "(本局游戏开始前不消耗房卡)",
	TEXT_LEAVE_ROOM_6 : "(如果退出系统将代打到本局结束)",

	// 游戏内 jlmj_desk_info
	TEXT_DESK_INFO_1 : "第 {0} 圈",
	TEXT_DESK_INFO_2 : "恭喜玩家{0}连庄",
	TEXT_DESK_INFO_3 : "玩家[ {0} ]拒绝解散房间,游戏继续!",
	TEXT_DESK_INFO_4 : "憋屈了吧，可惜不能胡!!",
	TEXT_DESK_INFO_5 : "房主解散了房间，再找其他好友开房吧",
	TEXT_DESK_INFO_6 : "房间已经解散!",
	TEXT_DESK_INFO_7 : "第 {0} 局",

	//麻将提示
	TEXT_MJ_DESK_INFO_0:"只有飘胡可以手把一，其他牌型吃或碰，会弃胡哦",
	TEXT_MJ_DESK_INFO_1:"胡牌必须三色全，不能断幺，至少有1个刻子或者字牌的将!",
	TEXT_MJ_DESK_INFO_6:"吉林麻将夹胡起步，才可以听牌哦",
	TEXT_MJ_DESK_INFO_7:"要三色全或清一色才可以胡牌或者听牌",
	TEXT_MJ_DESK_INFO_8:"请选择同花色的牌进行交换",
	TEXT_MJ_DESK_INFO_9:"缺一门 才能胡",
	TEXT_MJ_DESK_INFO_10:"清一色不能胡牌",
	TEXT_MJ_DESK_INFO_11:"要三色全才可以胡牌",

	//设置界面
	TEXT_SHE_ZHI_1:"开",
	TEXT_SHE_ZHI_2:"关",

	//朋友场规则
	TEXT_PY_RULE_1:'吉林麻将 {0}人',
	TEXT_PY_RULE_2:'不逛锅',
	TEXT_PY_RULE_3:'锅',
	TEXT_PY_RULE_4:'封顶{0}倍',
	TEXT_PY_RULE_5:'幺九蛋',
	TEXT_PY_RULE_6:'小鸡飞蛋',
	TEXT_PY_RULE_7:'快宝',
	TEXT_PY_RULE_8:'小鸡万能宝',
	TEXT_PY_RULE_9:'幺九蛋顶三色',
	TEXT_PY_RULE_10:'共{0}局',
	TEXT_PY_RULE_11:'共{0}圈',
	TEXT_PY_RULE_12:'房间号:',
	TEXT_PY_RULE_13:'规则:',
	TEXT_PY_RULE_14:'下蛋算站立',
	TEXT_PY_RULE_15:'缺门',
	TEXT_PY_RULE_16:'通宝翻番',
	TEXT_PY_RULE_17:'三风杠',
	TEXT_PY_RULE_18:'四风杠',
	TEXT_PY_RULE_19:'飘胡、七对不限色和幺九',
	TEXT_PY_RULE_20:'长春麻将 {0}人',
	TEXT_PY_RULE_21:'七对带估',
	TEXT_PY_RULE_22:'飘胡单吊翻倍',
	TEXT_PY_RULE_23:'七对不限幺九',
	TEXT_PY_RULE_24:'未听牌点炮包三家',
	TEXT_PY_RULE_25:'农安麻将 {0}人',
	TEXT_PY_RULE_26:'截胡',
	TEXT_PY_RULE_27:'七小对',
	TEXT_PY_RULE_28:'滚将算夹',
	TEXT_PY_RULE_29:'清一色',
	TEXT_PY_RULE_30:'手把一',
	TEXT_PY_RULE_31:'吃听三家',
	TEXT_PY_RULE_32:'不跟庄',
	TEXT_PY_RULE_33:'阜新麻将 {0}人',
	TEXT_PY_RULE_34:'不扎分',
	TEXT_PY_RULE_35:'扎五',
	TEXT_PY_RULE_36:'扎十',
	TEXT_PY_RULE_37:'跟庄5分',
	TEXT_PY_RULE_38:'跟庄10分',
	TEXT_PY_RULE_39:'封顶{0}分',
	TEXT_PY_RULE_40:'普通积分',
	TEXT_PY_RULE_41:'奔五积分',
	TEXT_PY_RULE_42:'死夹',
	TEXT_PY_RULE_43:'跟庄有赏',
	TEXT_PY_RULE_44:'松原麻将 {0}人',
	TEXT_PY_RULE_45:'松原麻将(快听) {0}人',
	TEXT_PY_RULE_46:'三七夹',
	TEXT_PY_RULE_47:'四清',
	TEXT_PY_RULE_48:'快宝',
	TEXT_PY_RULE_49:'砍对宝',
	TEXT_PY_RULE_50:'杠上花',
	TEXT_PY_RULE_51:'通宝翻倍',
	TEXT_PY_RULE_52:'不夹不胡',
	TEXT_PY_RULE_53:'未报听包三家',
	TEXT_PY_RULE_54:'不封顶',
	TEXT_PY_RULE_55:'{0}番封顶',
	TEXT_PY_RULE_56:'底分{0}',
	TEXT_PY_RULE_57:'自摸加番',
	TEXT_PY_RULE_58:'自摸加底',
	TEXT_PY_RULE_59:'时时雨',
	TEXT_PY_RULE_60:'及时雨',
	TEXT_PY_RULE_61:'换三张',
	TEXT_PY_RULE_62:'呼叫转移',
	TEXT_PY_RULE_63:'金钩钓',
	TEXT_PY_RULE_64:'海底捞',
	TEXT_PY_RULE_65:'海底炮',
	TEXT_PY_RULE_66:'天地胡',
	TEXT_PY_RULE_67:'门清中张',
	TEXT_PY_RULE_68:'血流成河',
	TEXT_PY_RULE_69:'血战到底 {0}人',
	TEXT_PY_RULE_70:'血流成河 {0}人',
	TEXT_PY_RULE_71:'站立胡',
	TEXT_PY_RULE_72:'飘胡可断幺九',
	TEXT_PY_RULE_73:'绥化麻将 {0}人',
	TEXT_PY_RULE_74:'对倒算夹',
	TEXT_PY_RULE_75:'3/7单边夹',
	TEXT_PY_RULE_76:'红中满天飞',
	TEXT_PY_RULE_77:'漏宝',
	TEXT_PY_RULE_78:'开牌炸',
	TEXT_PY_RULE_79:'杠加番',
	TEXT_PY_RULE_80:'亮掌宝',
	TEXT_PY_RULE_81:'刮大风',
	TEXT_PY_RULE_82:'摸鱼',
	TEXT_PY_RULE_83:'上滚宝',
	TEXT_PY_RULE_84:'断幺九',
	TEXT_PY_RULE_85:'暗宝',
	TEXT_PY_RULE_86:'明宝',
	TEXT_PY_RULE_87:'夹胡起步',
	TEXT_PY_RULE_88:'门清翻倍',
	TEXT_PY_RULE_89:'锦州麻将 {0}人',
	TEXT_PY_RULE_90:'带混',
	TEXT_PY_RULE_91:'穷胡加倍',
	TEXT_PY_RULE_92:'三清',
	TEXT_PY_RULE_93:'四清',
	TEXT_PY_RULE_94:'黑山麻将 {0}人',
	TEXT_PY_RULE_95:'明杠1分暗杠2分',
	TEXT_PY_RULE_96:'明杠2分暗杠4分',
	TEXT_PY_RULE_97:'封顶32分（单点96）',
	TEXT_PY_RULE_98:'封顶60分（单点90）',
	TEXT_PY_RULE_99:'封顶100分（单点150）',
	TEXT_PY_RULE_100:'封顶200分（单点300）',
	TEXT_PY_RULE_101:'平胡翻倍',
	TEXT_PY_RULE_102:'过圈胡',
	TEXT_PY_RULE_103:'含东南西北',
	TEXT_PY_RULE_104:'单调夹胡',
	TEXT_PY_RULE_105:'独门加番',
	TEXT_PY_RULE_106:'单胡幺九算夹',
	TEXT_PY_RULE_107:'豪七翻倍',
	TEXT_PY_RULE_108:'上听点炮不包三家',
	TEXT_PY_RULE_109:'未开门翻倍',
	TEXT_PY_RULE_110:'水炮',
	TEXT_PY_RULE_111:'两番起胡',
	TEXT_PY_RULE_112:'推倒胡 {0}人',
	TEXT_PY_RULE_113:'飘胡',
	TEXT_PY_RULE_114:'亮喜',
	TEXT_PY_RULE_115:'一条龙',
	TEXT_PY_RULE_116:'一炮多响',
	TEXT_PY_RULE_117:'吃牌',
	TEXT_PY_RULE_118:'跑分',
	TEXT_PY_RULE_119:'不连庄',
	TEXT_PY_RULE_120:'赤峰麻将 {0}人',
	TEXT_PY_RULE_121:'三七边算夹',
	TEXT_PY_RULE_122:'不辅',
	TEXT_PY_RULE_123:'对辅',
	TEXT_PY_RULE_124:'{0}分',
	TEXT_PY_RULE_125:'敖汉麻将 {0}人',
	TEXT_PY_RULE_126:'单调算夹',
	TEXT_PY_RULE_127:'楼飘优先',
	TEXT_PY_RULE_128:'重复亮喜',
	TEXT_PY_RULE_129:'黑炮包三家',
	TEXT_PY_RULE_130:'三道喜天胡',
	TEXT_PY_RULE_131:'去筒玩法',
	TEXT_PY_RULE_132:'正常亮喜',
	TEXT_PY_RULE_133:'特殊亮喜',
	TEXT_PY_RULE_136:'方正麻将 {0}人',
	TEXT_PY_RULE_137:'亮掌',
	TEXT_PY_RULE_138:'赤峰 {0}人',
	TEXT_PY_RULE_139:'敖汉 {0}人',
	TEXT_PY_RULE_140:'亮喜开门',
	TEXT_PY_RULE_141:'乌丹麻将 {0}人',
	TEXT_PY_RULE_142:'乌丹 {0}人',
	TEXT_PY_RULE_143:'三人三房',
	TEXT_PY_RULE_144:'三人两房',
	TEXT_PY_RULE_145:'二人三房',
	TEXT_PY_RULE_146:'二人两房',
	TEXT_PY_RULE_147:'点杠花(自摸)',
	TEXT_PY_RULE_148:'点杠花(点炮)',
	TEXT_PY_RULE_149:'呼叫转移转根',
	TEXT_PY_RULE_150:'对对胡2番',
	TEXT_PY_RULE_151:'换四张',
	TEXT_PY_RULE_152:'夹心五',
	TEXT_PY_RULE_153:'平庄麻将 {0}人',
	TEXT_PY_RULE_154:'平庄 {0}人',
	TEXT_PY_RULE_155:'白城麻将 {0}人',
	TEXT_PY_RULE_156:'夹五',
	TEXT_PY_RULE_157:'鸡胡鸡飘',
	TEXT_PY_RULE_158:'攒杠',
	TEXT_PY_RULE_159:'背靠背',
	TEXT_PY_RULE_160:'责任制',
	TEXT_PY_RULE_161:'下明蛋算站立',
	TEXT_PY_RULE_162:'{0}秒后托管',
	TEXT_PY_RULE_163:'不托管',
	TEXT_PY_RULE_164:'阿城麻将 {0}人',
	TEXT_PY_RULE_165:'对宝',
	TEXT_PY_RULE_166:'和龙麻将 {0}人',
	TEXT_PY_RULE_167:'听后飞杠',
	TEXT_PY_RULE_168:'屁胡',
	TEXT_PY_RULE_169:'豪华七小对',
	TEXT_PY_RULE_170:'七对刮风',
	TEXT_PY_RULE_171:'闷听',


	// 网络 jlmj_net
	TEXT_NET_1 : "正常退出",
	TEXT_NET_2 : "管理员踢人",
	TEXT_NET_3 : "没有token",
	TEXT_NET_4 : "token非法",
	TEXT_NET_5 : "服务器维护中",
	TEXT_NET_6 : "心跳超时",
	TEXT_NET_7 : "重连失败",
	TEXT_NET_8 : "账号在其他地方登录",
	TEXT_NET_9 : "系统维护-1",
	TEXT_NET_10 : "服务器关闭了",
	TEXT_NET_11 : "你的账号已被封",

	// 系统漂字提示
	TEXT_SYSTEM_1 : "请同意用户协议",
	TEXT_SYSTEM_2 : "网页不支持微信登录",
	TEXT_SYSTEM_3 : "请检查网络是否连接!",
	TEXT_SYSTEM_4 : "您还没有战绩",
	TEXT_SYSTEM_5 : "购买成功",
	TEXT_SYSTEM_6 : "您没有安装微信，请安装微信后重试！",
	TEXT_SYSTEM_7 : "获取微信授权失败",
	TEXT_SYSTEM_8 : "服务器异常，请稍后再试!!!",
	TEXT_SYSTEM_9 : "找不到语音账号玩家!",
	TEXT_SYSTEM_10 : "网页不支持微信购买",
	TEXT_SYSTEM_11: "游戏维护中，请耐心等待",
	TEXT_SYSTEM_12: "您的账号已经被加入黑名单，请联系客服",
	TEXT_SYSTEM_13: "创建用户失败!",
	TEXT_SYSTEM_14: "用户验证失败!",
	TEXT_SYSTEM_15: "服务器维护中!",
	TEXT_SYSTEM_16: "服务器维护中!",
	TEXT_SYSTEM_17: "账号已被封",
	TEXT_SYSTEM_18: "当前禁止游客登录!",

	// 弹窗提示
	TEXT_POPUP_1 : "NOT YET OPEN",
	TEXT_POPUP_2 : "您确定要退出游戏吗？",
	TEXT_POPUP_3 : "安卓有更新包，是否前往下载",
	TEXT_POPUP_4 : "无法更新,请下载最新包!",
	TEXT_POPUP_5 : "下载失败,是否重新下载!!",
	TEXT_POPUP_6 : "您当前处于数据流量状态,资源更新大小:!!",
	TEXT_POPUP_7 : "更新完成,将重启游戏!",
	TEXT_POPUP_8 : "请输入姓名!",
	TEXT_POPUP_9 : "请输入正确的姓名!",
	TEXT_POPUP_10 : "请输入身份证号码!",
	TEXT_POPUP_11 : "您的身份证账号不是符合国家标准的身份证号码",
	TEXT_POPUP_12 : "申请成功",
	TEXT_POPUP_13 : "有更新包，请是否前往下载",
	TEXT_POPUP_14 : "检测更新失败,是否继续进入游戏?",
	TEXT_POPUP_15 : "金币不足",
	TEXT_POPUP_16 : "金币过多，请重新选择更高级的房间",
	TEXT_POPUP_17 : "jinzhiyouxi",
	TEXT_POPUP_18 : "金币不足，不能进入",
	TEXT_POPUP_19 : "金币高于进入上限",
	TEXT_POPUP_20 : "金币不足，无法匹配，请重新选择房间",
	TEXT_POPUP_21 : "请输入账号!",
	TEXT_POPUP_22 : "请输入密码!",
	TEXT_POPUP_23 : "请输入验证码!",
	TEXT_POPUP_24 : "请输入手机号!",
	TEXT_POPUP_25 : "请输入正确的手机号!",
	TEXT_POPUP_26 : "请输入正确的验证码!",
	TEXT_POPUP_27 : "账号或密码有误!",
	TEXT_POPUP_28 : "密码位数不能大于16或小于6",
	TEXT_POPUP_29 : "请输入正确密码，由数字和字母组成",
	TEXT_POPUP_30 : "新旧密码一样!",
	TEXT_POPUP_31 : "新输入的两次密码不一样!",
	TEXT_POPUP_32 : "查询失败!",
	TEXT_POPUP_33 : "绑定失败!",
	TEXT_POPUP_34 : "你已经绑定过代理!",
	// 支付提示
	TEXT_PAY_1 : "支付成功",

	//跑马灯默认
	TEXT_PAOMADENG_DEFAULT : TextPaomaDengDefalut,


	//快乐吧大厅消息提示
	TEXT_KLB_HALL_COMMON_1:"房卡未配置",
	TEXT_KLB_HALL_COMMON_2:"房卡不足",
	TEXT_KLB_HALL_COMMON_3:"游戏服未开启",
	TEXT_KLB_HALL_COMMON_4:"重复开房",
	TEXT_KLB_HALL_COMMON_5:"房间已达上线",
	TEXT_KLB_HALL_COMMON_6:"房间已满或不存在，请重新输入",
	TEXT_KLB_HALL_COMMON_7:"房间已满或不存在，请重新输入",
	TEXT_KLB_HALL_COMMON_8:"房间已满或不存在，请重新输入",
	TEXT_KLB_HALL_COMMON_9:"不在当前房间内",
	TEXT_KLB_HALL_COMMON_10:"未知错误",
	TEXT_KLB_HALL_COMMON_11:"当前禁止该游戏，请联系管理员",
	TEXT_KLB_HALL_COMMON_12:"当前处于在其他游戏中，不能进入",
	TEXT_KLB_HALL_COMMON_13:"朋友场不能退出",
	TEXT_KLB_HALL_COMMON_14:"房间中没有这个位置",
	TEXT_KLB_HALL_COMMON_15:"房间已开始",

	//宝箱task
	TEXT_BAOXIANG_0:'木宝箱',
	TEXT_BAOXIANG_1:'铁宝箱',
	TEXT_BAOXIANG_2:'金宝箱',
	TEXT_BAOXIANG_3:'完成{0}局',
	TEXT_BAOXIANG_4:'获胜{0}局',
	TEXT_BAOXIANG_5:'获得',

	//破产
	TEXT_POCHAN_0:'VIP {0} 加赠:',
	TEXT_POCHAN_1:'金币',
	TEXT_POCHAN_2:'¥',
	TEXT_POCHAN_3:'本日还可领取{0}次',

	//低保
	TEXT_DIBAO_0:'亲！你可以免费领取{0}金币哦！',

	//叫牌胡牌类型
	TEXT_HUPAI_0:'平胡',
	TEXT_HUPAI_1:'夹胡',
	TEXT_HUPAI_2:'边胡',
	TEXT_HUPAI_3:'飘胡',
	TEXT_HUPAI_4:'七对',
	TEXT_HUPAI_5:'{0}番',

	//长春麻将
	TEXT_MJ_JBC_0:'底分',
};

module.exports = TextCfgZhCHS;