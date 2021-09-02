var AppCfg = require('AppConfig');
var login_module = require('LoginModule');
var Platform = require('Platform');
const CHANNELS = [
    '集成包',
    '绥化单包',
    '阜新单包',
    '方正填大坑',
    '本地游戏',
    '享乐游戏',
    '黑山单包',
    '赤峰单包',
    '推倒胡单包',
    '乌丹单包',
    '巷乐棋牌',
    '平庄单包',
    '白城单包',
    '快乐吧填大坑(绿色版)',
    '阿城单包',
    '和龙单包',
    '快乐吧填大坑(完整版)',
    '享悦娱乐',
];

const IPS = [
    '巷乐测试服（124服）',
    '内网彭林服（66）'
];

const INNER_IP = [
    66
]

cc.Class({
    extends: cc.Component,

    properties: {
        ip: cc.EditBox,
        port: cc.EditBox,
        bind: cc.EditBox,

        channel: cc.EditBox,
        channelContent: cc.Node,
        channelItem: cc.Node,
        channelArrow: cc.Node,
        channelScrollView: cc.Node,

        ipContent: cc.Node,
        ipItem: cc.Node,
        ipArrow: cc.Node,
        ipScrollView: cc.Node,

        clubEditbox: cc.EditBox,
        wanfaEditbox: cc.EditBox,

        recordEditbox: cc.EditBox,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.active = AppCfg.IS_DEBUG;

        var json = cc.sys.localStorage.getItem("SAVE_IP");
        if (json) {
            var saveIP = json;
            this.ip.string = saveIP;
        }

        json = cc.sys.localStorage.getItem("SAVE_PORT");
        if (json) {
            var portIP = json;
            this.port.string = portIP;
        }
    },

    start() {
        this.initChannelList();
        this.initIPList();
        this.setGamePID();
    },

    /**
     * 输入框
     */
    editboxCallback: function (event, data) {
        this._ip = event.string;
    },

    editboxCallback1: function (event, data) {
        this._port = event.string;
    },

    testCall: function () {
        cc.dd.SysTools.keepNetOk(function () {
            if (!this.isFristTouch) {
                this.isFristTouch = true;
                login_module.Instance().guestLogin(this.ip.string || '192.168.2.213', this.port.string || '3801');

                cc.sys.localStorage.setItem("SAVE_IP", this.ip.string);
                cc.sys.localStorage.setItem("SAVE_PORT", this.port.string);
            }
        }.bind(this));
    },
    testCall1: function () {
        cc.dd.SysTools.keepNetOk(function () {
            if (!this.isFristTouch) {
                this.isFristTouch = true;
                login_module.Instance().guestLogin('192.168.2.234', '3901');
            }
        }.bind(this));
    },
    /**
     * 清理玩家数据
     */
    clearUserInfo: function () {
        //测试充值
        // var url = 'http://192.168.2.175:9898/iapppayForPHP/iapppayForPHP/demo/trade.php?cpprivateinfo=2001&price=2&appuserid=123456';
        // cc.dd.PayWeChatH5.httpPost( url, "", function (data) {
        //     cc.dd.native_systool.OpenUrl(data);
        // } );
        cc.sys.localStorage.clear();
        require('jlmj_login_data').destroy();
    },

    onClickChangeGame(channelID) {
        cc.game_pid = parseInt(channelID);
        this.channel.string = this._channelList[String(cc.game_pid)];

        this.setGamePID();
    },

    onClickBind() {
        let num = parseInt(this.bind.string);
        if (!cc.dd._.isNumber(num) || num == 0) {
            cc.dd.PromptBoxUtil.show("ID不正确");
            return;
        }
        login_module.Instance().bindID = num;
        this.testCall();
    },

    onClickButton() {
        cc.dd.SceneManager.replaceScene('test_jbc_game');
    },

    onClickShowChannelList() {
        if (this.channelScrollView.active) {
            this.channelArrow.scaleY = 1;
            this.channelScrollView.active = false;
        } else {
            this.channelArrow.scaleY = -1;
            this.channelScrollView.active = true;
        }
    },

    initChannelList() {
        this._channelList = {}
        for (let i = 0; i < CHANNELS.length; i++) {
            let channelID;
            if (i == 0) {
                channelID = '0';
            } else {
                channelID = String(10000 + i - 1);
            }
            this._channelList[channelID] = CHANNELS[i]
            this.createChannelItem(CHANNELS[i], channelID);
        }

        if (cc.dd._.isUndefined(cc.game_pid)) {
            cc.game_pid = 0;
        }

        this.channel.string = this._channelList[String(cc.game_pid)];

        this.channelScrollView.active = false;
        this.channelArrow.scaleY = 1;
    },

    createChannelItem(channelName, channelID) {

        let item = cc.instantiate(this.channelItem);
        item.active = true;
        cc.find("number", item).getComponent(cc.Label).string = channelName;

        let button = item.getComponent(cc.Button);
        button.node.on('click', () => {
            this.onClickChangeGame(channelID);
            this.channelScrollView.active = false;
            this.channelArrow.scaleY = 1;
        }, this);

        this.channelContent.addChild(item);
        item.x = 0;
    },

    setGamePID() {
        cc._is_shop = cc.dd._.isUndefined(cc.game_pid) ? true : ((cc.game_pid > 1 && cc.game_pid < 10000) ? false : true);
        if (cc.game_pid == 2 && cc.sys.os == cc.sys.OS_IOS && !cc._is_shop) cc._is_shop = true;

        cc._appstore_check = false && (cc.game_pid > 0 && cc.game_pid < 10000) && (cc.sys.os == cc.sys.OS_IOS);
        cc._isAppstore = true && (cc.game_pid > 0 && cc.game_pid < 10000) && (cc.sys.os == cc.sys.OS_IOS);
        cc._chifengGame = cc.game_pid == 10006 || cc.game_pid == 10008 || cc.game_pid == 10010;//cc.game_pid == 0;//赤峰游戏
        cc._useChifengUI = cc._chifengGame || cc.game_pid == 10003 || cc.game_pid == 10004 || cc.game_pid == 10013;
        cc._themeStyle = cc.game_pid != 10003 ? 0 : 1;//0为绿色夏天主题，1为蓝色冬天主题
        cc._useCardUI = cc.game_pid == 10000 || cc.game_pid == 10001 || cc.game_pid == 10002 || cc.game_pid == 10005 || cc.game_pid == 10007 || cc.game_pid == 10009 || cc.game_pid == 10011 || cc.game_pid == 10014;
        cc._isKuaiLeBaTianDaKeng = cc.game_pid == 10012 || cc.game_pid == 10015;

        cc._newChifengApp = cc.game_pid == 10006;

        cc._applyForPayment = false;

        var HALL_TYPE = [
            "kuaileba_hall",
            "kuaileba_hall",
            "gamedl_hall", //快乐吧麻将
            "gamedl_new_hall", //新快乐吧麻将
        ];
        var LOGIN_SCENE = [
            "jlmj_login",
            "jlmj_login",
            "gamedl_login", //快乐吧麻将
        ];
        cc.need_login_accout = true;//cc.sys.isBrowser || cc.game_pid == 10004;//账号登录
        AppCfg.GAME_PID = (function () {
            if (cc._isAppstore && !cc._isHuaweiGame && !cc._isBaiDuPingTaiGame || cc.dd._.isUndefined(cc.game_pid) || cc.game_pid == 20000) {
                return 0;
            } else if (cc._androidstore_check && cc.game_pid == 10012) {
                return 3;
            } else if (cc._androidstore_check && cc.game_pid == 10017) {
                return 2;
            } else {
                return cc.game_pid;
            }
        })();
        AppCfg.HALL_NAME = "blackjack_hall";
        AppCfg.LOGIN_SCENE_NAME = "blackjack_login";

        let logo = cc.find('Canvas').getComponentInChildren('klb_login_logo')
        if (logo) {
            logo.onLoad();
        }
        logo = cc.find('Canvas').getComponentInChildren('klb_login_Change_UI')
        if (logo) {
            logo.onLoad();
        }

        let guest = cc.find('Canvas/align_down/Layout/YKBtn');
        if (guest) {
            guest.active = cc.need_login_guest
        }
        let account = cc.find('Canvas/align_down/Layout/ZHBtn');
        if (account) {
            if (cc._appstore_check)
                account.active = true;
            else if (AppCfg.GAME_PID == 10004)
                account.active = true;
            else
                account.active = cc.need_login_accout;
        }

        let wechat = cc.find('Canvas/align_down/Layout/WXBtn');
        if (wechat) {
            if (cc._appstore_check)
                wechat.active = false;
            else if (!cc.dd.native_wx.IsWXAppInstalled())
                wechat.active = false;
            else
                wechat.active = true;
        }

        let banhao = cc.find('Canvas/wenan/zhonggao').getComponent(cc.Label)
        if (cc._isKuaiLeBaTianDaKeng) {
            banhao.string = '2018 快乐吧填大坑    klbgame.com    新广出审[2018]1281号    浙新广[2018]199号'
        } else {
            banhao.string = '2019 巷乐游戏    yuejiegame.com    吉ICP备17005462号    吉网文[2017]5612-037号';
        }
        var pattern = /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/g
        this.recordEditbox.string = pattern.exec(Platform.RecordUrl[AppCfg.PID])[0];

        var pid = (cc._isAppstore || cc.game_pid == 20000) ? cc.game_pid : AppCfg.GAME_PID;
        cc.dd.jlmj_enum.Login_Type.GUEST = pid * 100 + 1;
        cc.dd.jlmj_enum.Login_Type.WX = pid * 100 + 2;
        cc.dd.jlmj_enum.Login_Type.WXH5 = pid * 100 + 3;
        cc.dd.jlmj_enum.Login_Type.ACCOUNT = pid * 100 + 4;
        cc.dd.jlmj_enum.Login_Type.HUAWEI = pid * 100 + 6;
        cc.dd.jlmj_enum.Login_Type.VIVO = pid * 100 + 7;
        cc.dd.jlmj_enum.Login_Type.OPPO = pid * 100 + 8;
        cc.dd.jlmj_enum.Login_Type.XIAOMI = pid * 100 + 9;

        if (cc.game_pid == 0) {
            cc.dd.ResLoader.loadGameStaticResList([new cc.dd.ResLoadCell("gameyj_horse_racing/prefabs/horse1", cc.Prefab)]);
            cc.dd.ResLoader.loadGameStaticResList([new cc.dd.ResLoadCell("gameyj_horse_racing/prefabs/horse2", cc.Prefab)]);
            cc.dd.ResLoader.loadGameStaticResList([new cc.dd.ResLoadCell("gameyj_horse_racing/prefabs/horse3", cc.Prefab)]);
            cc.dd.ResLoader.loadGameStaticResList([new cc.dd.ResLoadCell("gameyj_horse_racing/prefabs/horse4", cc.Prefab)]);
            cc.dd.ResLoader.loadGameStaticResList([new cc.dd.ResLoadCell("gameyj_horse_racing/prefabs/horse5", cc.Prefab)]);
            cc.dd.ResLoader.loadGameStaticResList([new cc.dd.ResLoadCell("gameyj_horse_racing/prefabs/horse6", cc.Prefab)]);
        }
    },


    initIPList() {
        for (let i = 0; i < IPS.length; i++) {
            this.createIPItem(IPS[i], i);
        }

        this.ipScrollView.active = false;
        this.ipArrow.scaleY = 1;
    },

    createIPItem(ipName, ipID) {

        let item = cc.instantiate(this.ipItem);
        item.active = true;
        cc.find("number", item).getComponent(cc.Label).string = ipName;

        let button = item.getComponent(cc.Button);
        button.node.on('click', () => {
            this.ip.string = this.tran(ipID);
            this.ipScrollView.active = false;
            this.ipArrow.scaleY = 1;

            this.recordEditbox.string = this.ip.string;
            this.recordEditbox.placeholder = this.ip.string;

            let pattern1 = new RegExp("123.56"), pattern2 = new RegExp("47.94");
            Platform.RecordUrl[AppCfg.PID] = "http://{0}:{1}/".format(this.recordEditbox.string, pattern1.test(this.recordEditbox.string) || pattern2.test(this.recordEditbox.string) ? 3806 : 8881);
        }, this);

        this.ipContent.addChild(item);
        item.x = 0;
    },

    onClickShowIPList() {
        if (this.ipScrollView.active) {
            this.ipArrow.scaleY = 1;
            this.ipScrollView.active = false;
        } else {
            this.ipArrow.scaleY = -1;
            this.ipScrollView.active = true;
        }
    },

    tran(index) {
        switch (index) {
            case 0:
                // return [(40+7),(90+4),10,(60+4)].join('.');
                // case 1:
                return [(42), (193), (2), (94)].join('.');
            default:
                return [(42), (193), (2), (94)].join('.');
        }
    },

    onClickClub() {
        cc.dealWithWXInviteInfo('room_code=' + this.wanfaEditbox.string + '&relativesid=' + this.clubEditbox.string + '&delay_time=' + (new Date().setDate(new Date().getDate() + 1)));
        this.testCall();
    },

    editboxCallback2: function (event, data) {
        var pattern = /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/g
        if (!pattern.test(event.string)) {
            return;
        }
        this.recordEditbox.string = event.string;
        this.recordEditbox.placeholder = event.string;
        let pattern1 = new RegExp("123.56"), pattern2 = new RegExp("47.94");
        Platform.RecordUrl[AppCfg.PID] = "http://{0}:{1}/".format(this.recordEditbox.string, pattern1.test(this.recordEditbox.string) || pattern2.test(this.recordEditbox.string) ? 3806 : 8881);

    },

    onClickChangeLanguage() {
        if (LanguageMgr.getKind() === "ZH") {
            LanguageMgr.changeLanguage("EN");
        } else {
            LanguageMgr.changeLanguage("ZH");
        }
    }
});
