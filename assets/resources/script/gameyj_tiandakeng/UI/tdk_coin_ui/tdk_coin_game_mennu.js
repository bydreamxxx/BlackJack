// create by wj 2018/2/1
var dd = cc.dd;
var tdk = dd.tdk;

var tdk_enum_btn = require('TDKBtnConf')
var gbtnTag = tdk_enum_btn.game_operate;

var tdk_ani = require('TDKConstantConf').ANIMATION_TYPE;

var TdkCDeskData = require('tdk_coin_desk_data').TdkCDeskData;
var TdkSender = require('jlmj_net_msg_sender_tdk');
var RoomMgr = require('jlmj_room_mgr').RoomMgr;

var CPlayerData = require('tdk_coin_player_data').TdkCPlayerMgrData;
var TdkOperationData = require('tdk_operation_data').TdkOperationData;

cc.Class({
    extends: cc.Component,

    properties: {
        showbtn_list: [],
        selfId: null,
        btnClickCallback: null, //按钮点击回调函数
        costChipCallback: null, //消耗筹码回调函数
        deskStatus: null, //跟注类型
        shield: null, //触摸屏蔽层对象
        betNum: 0, //跟住金额
    },

    onLoad: function () {
        this.deskData = TdkCDeskData.Instance();
        this.selfId = cc.dd.user.id;
    },
    ctor: function () {
        this.btnName = [
            'xiazhu',
            'qijiao',
            'fanti',
            'kaipai_coin',
            'allin',
            'buti',
            'qipai',
            'genzhu',
            'huanzhuo',
            'kaishi_coin',
        ];

        this.btnTag = {
            BT_QIPAI: 7,
            BT_GENZHU: 8,
            BT_XIAZHU: 1,
            BT_QIJIAO: 2,
            BT_BUTI: 6,
            BT_FANTI: 3,
            BT_ALLIN: 5,
            BT_HUANZHUO: 9,
            BT_KAISHI_COIN: 10,
            BT_KAIPAI_COIN: 4,
        };

        this.speakStr = {
            QP: '弃牌',
            XZ: '下注',
            GZ: '跟注',
            QJ: '起脚',
            FT: '反踢',
            BT: '不踢',
            AI: 'Allin',
            KP: '开牌',
        };
    },

    gameMenuInFinished: function () {
        cc.log('tdk_game_menu::popupInActFinished!');
    },

    gameMenuOutFinished: function () {
        //this.node.removeFromParent();
        //this.node.destroy();
        //this.node.active = false;
        cc.log('tdk_game_menu::popupOutActFinished!');
    },

    islanguo: function () {
        this.bei = (TdkOperationData.Instance().roundEndData.endtype && RoomMgr.Instance()._Rule.lanDouble) ? 2 : 1; //烂锅加倍
    },

    /**
     * 得到封顶
     */
    getMaxBet: function () {
        var Rule = RoomMgr.Instance()._Rule;
        if (!Rule) return 5;
        var lanNum = 1;
        if (Rule && Rule.lanDouble)
            lanNum = TdkOperationData.Instance().roundEndData.getLanNum(); //烂锅次数
        //lanNum = lanNum > 4 ? 4 : lanNum;
        return Rule.baseScore * Rule.maxScore * lanNum
    },

    //弹出下注框
    popupBetBox: function (event, data) {
        if (CPlayerData.Instance().getApao()) { //抓A必炮
            //this.islanguo();
            //var dizhu = this.deskData.dizhu ? this.deskData.dizhu : 1;
            this.betNum = this.getMaxBet()
            this.onClickBtn(event, data);
            CPlayerData.Instance().setApao(false);
            return;
        }
        if (data == 3) { //反踢
            //this.allHidden();
        }
        tdk.popup.show(function (shield) {
            var prefab = cc.resources.get(dd.tdk_resCfg.PREFAB.PRE_XIAZHU, cc.Prefab);
            var betBox = cc.instantiate(prefab);
            betBox.parent = tdk.popupParent;
            var cpt = betBox.getComponent('tdk_bet_box');
            cpt.initC(data);
            shield.addTouchShieldCallback(function () {
                shield.close();
                betBox.removeFromParent();
                betBox.destroy();
            });
            cpt.addOkBtnClickListener(function (num) {
                this.betNum = num;
                this.onClickBtn(event, data);
                shield.close();
                this.close();
            }.bind(this));
        }.bind(this), false);
    },

    costChip: function (num) {
        if (this.costChipCallback) {
            //this.costChipCallback(num);
        }
    },

    addCostChipListener: function (cb) {
        if (typeof cb == 'function') {
            this.costChipCallback = cb;
        } else {
            cc.warn('tdk_game_menu::addCostChipListener:cb not function!');
        }
    },

    addBtnCallbackListener: function (cb) {
        if (typeof cb == 'function') {
            this.btnClickCallback = cb;
        } else {
            cc.warn('tdk_game_menu::addBtnCallbackListener:cb not function!');
        }
    },

    onClickBtn: function (event, data) {
        var info = [];
        cc.log('tdk_coin_game_mennu:onClickBtn----- 下注金额：', this.betNum, 'data : ', data)
        if (data == 7)
            this.betNum = 0;
        // var pokernum = 0;
        // var role = CPlayerData.Instance().getPlayer(cc.dd.user.id);
        // if (role) {
        //     pokernum = role.getPokerCount();
        // }
        // var Rule = RoomMgr.Instance()._Rule;
        // if (pokernum == 6 && (data == 2 || data == 3) && (Rule && Rule.motifanbei))
        //     info.betNum = this.betNum * 2;
        // else
        info.betNum = this.betNum;
        info.type = data;
        TdkSender.onTdkCBet(info);
        if (data == 1 || data == 2 || data == 3 || data == 5 || data == 8) {
            this.costChip(this.betNum);
        }
        this.close();
    },

    //快速下注
    onQuickBet(event, custom) {
        var bet = parseInt(custom);
        var minbet = TdkCDeskData.Instance().getMinBet();
        if(RoomMgr.Instance()._Rule && RoomMgr.Instance()._Rule.busuoqiang){
            if(bet<minbet){
                cc.dd.PromptBoxUtil.show('本局为不缩枪玩法，下注不能低于当前筹码');
                return;
            }
        }
        var info = [];
        info.betNum = bet;
        info.type = this.betType;
        TdkSender.onTdkCBet(info);
        this.close();
    },

    /**
     * 隐藏按钮
     */
    allHidden: function () {
        for (var k = 0; k < 8; k++) {
            var node = cc.find(this.btnName[(k)], this.node);
            if (node)
                node.active = false;
        }
        this.showBGbtn(false);
    },

    showBGbtn: function (bl) {
        var bgnode = cc.find('bg', this.node);
        if (bgnode)
            bgnode.active = bl;
    },

    analysisDeskSattus: function () {
        var ani = this.node.getComponent(cc.Animation);
        ani.play(tdk_ani.GAME_MENU_IN);
        this.showBGbtn(true);
        this.showQuickBet(false);
        for (var k = 0; k < 8; k++) {
            var node = cc.find(this.btnName[(k)], this.node);
            cc.log('deskStatus:' + this.deskStatus + 'index:' + k + 'bool:' + (this.deskStatus & (0x01 << k)));
            cc.log('======1 <<  ', k, ': ', 1 << k, '========: ', this.deskStatus & (1 << k));
            var flag = ((this.deskStatus & (1 << k)) > 0);
            if (flag) {
                if (k == 0 || k == 1 || k == 2) {
                    this.showQuickBet(true);
                    this.betType = k + 1;
                }
            }
            node.active = flag;
        }
        if (CPlayerData.Instance().getApao()) { //抓A必炮
            cc.find('qipai', this.node).active = false;
            this.showQuickBet(false);
        }
        // if(RoomMgr.Instance()._Rule && RoomMgr.Instance()._Rule.busuoqiang){
        //     this.showQuickBet(false);
        // }
    },

    showQuickBet(isshow) {
        var quickbet = cc.find('quick_bet', this.node);
        if (quickbet) {
            quickbet.active = isshow;
        }
    },

    close: function () {
        if (this.shield) {
            this.shield.close();
        }
        var ani = this.node.getComponent(cc.Animation);
        ani.play(tdk_ani.GAME_MENU_OUT);
        this.betNum = 0;
        if (CPlayerData.Instance().getApao()) { //抓A必炮
            CPlayerData.Instance().setApao(false);
        }
    },

    onDestroy: function () {
        var box = cc.find('xiazhu', tdk.popupParent);
        if (box) {
            box.removeFromParent();
            box.destroy();
        }
    },

    onDisable(){
        if (CPlayerData.Instance().getApao()) { //抓A必炮
            CPlayerData.Instance().setApao(false);
        }
    },

});
