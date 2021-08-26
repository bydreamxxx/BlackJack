var tdk = cc.dd.tdk;
//var gameData = tdk.GameData;

var DeskData = require('tdk_desk_data').TdkDeskData.Instance();
var CDeskData = require('tdk_coin_desk_data').TdkCDeskData;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var TdkOperationData = require('tdk_operation_data').TdkOperationData;
var CPlayerData = require('tdk_coin_player_data').TdkCPlayerMgrData;

cc.Class({
    extends: cc.Component,

    properties: {
        pb: cc.ProgressBar,
        num: cc.Label,
        slider: cc.Slider,
        okBtnClickCallback: null,
        maxBetNum: 5, //下注最大值
        //text: [cc.Label],
    },

    // use this for initialization
    onLoad: function () {
        var cv = cc.find('Canvas');
        var w = cv.width;
        var h = cv.height;
        var x = (w > h ? w : h);

    },

    islanguo: function (data) {
        this.caozuoData = data;
        var bl = TdkOperationData.Instance().roundEndData.endtype && RoomMgr.Instance()._Rule.lanDouble;
        var pokernum = 0;
        var role = CPlayerData.Instance().getPlayer(cc.dd.user.id);
        if (role) {
            pokernum = role.getPokerCount();
        }
        var Rule = RoomMgr.Instance()._Rule;
        if (pokernum == 6 && (data == 2 || data == 3) && (Rule && Rule.motifanbei))
            bl = true;
        this.bei = bl ? 2 : 1; //烂锅加倍
    },

    //得到最低下注
    getMinBet() {
        var Rule = RoomMgr.Instance()._Rule;
        if (!Rule || !Rule.busuoqiang)
            return null;
        else
            return CDeskData.Instance().getMinBet();
    },

    /**
     * 得到封顶
     */
    getMaxBet: function (data) {
        var Rule = RoomMgr.Instance()._Rule;
        if (!Rule) return 5;
        var lanNum = 1;
        if (Rule && Rule.lanDouble)
            lanNum = TdkOperationData.Instance().roundEndData.getLanNum(); //烂锅次数
        //lanNum = lanNum > 4 ? 4 : lanNum;
        cc.log('getMaxBet:', lanNum);
        var pokernum = 0;
        var role = CPlayerData.Instance().getPlayer(cc.dd.user.id);
        if (role) {
            pokernum = role.getPokerCount();
        }
        var bl = false;
        if (pokernum == 6 && (data == 2 || data == 3) && (Rule && Rule.motifanbei))
            bl = true;
        var bei = bl ? 2 : 1; //烂锅加倍
        return Rule.baseScore * Rule.maxScore * lanNum * bei;
    },

    init: function () {
        this.sn = 1; //DeskData.danzhu;
        this.islanguo(data);
        var dizhu = CDeskData.Instance().dizhu ? CDeskData.Instance().dizhu : 1;
        this.maxBetNum = this.getMaxBet(data)
        this.gold = this.maxBetNum;
        var numstr = cc.dd.Utils.getNumToWordTransform(this.gold);
        this.num.string = numstr;
    },

    initC: function (data) {
        var Rule = RoomMgr.Instance()._Rule;
        this.sn = Rule ? Rule.baseScore : 1;

        this.minbet = this.getMinBet();//不缩枪模式  最低下注
        //this.sn = 1; // CDeskData.danzhu;
        this.islanguo(data);
        var dizhu = CDeskData.Instance().dizhu ? CDeskData.Instance().dizhu : 1;
        this.maxBetNum = this.getMaxBet(data)
        this.gold = this.maxBetNum;
        var numstr = cc.dd.Utils.getNumToWordTransform(this.gold);
        this.num.string = numstr;
    },

    sliderMove: function () {
        if (!this.minbet || this.minbet < 0) {
            var progress = this.slider.progress;
            var value = progress;
            var part = this.sn / this.maxBetNum;
            if (value < part) {
                value = part;
            }
            // var Rule = RoomMgr.Instance()._Rule;
            // var dizhu = Rule ? Rule.baseScore : 1;
            var cnt = Math.floor(value / part);
            this.gold = cnt * this.sn;
            var numstr = cc.dd.Utils.getNumToWordTransform(this.gold);
            this.num.string = numstr;
            progress = cnt * part;
            this.pb.progress = progress;
            this.slider.progress = progress;
        }
        else {
            var progress = this.slider.progress;
            var value = progress;
            var part = this.sn / (this.maxBetNum - this.minbet + this.sn);
            if (value < part) {
                value = part;
            }
            var cnt = Math.floor(value / part);
            this.gold = this.minbet - this.sn + cnt * this.sn;
            var numstr = cc.dd.Utils.getNumToWordTransform(this.gold);
            this.num.string = numstr;
            progress = cnt * part;
            this.pb.progress = progress;
            this.slider.progress = progress;
        }
    },

    btnOkClick: function (event, data) {
        if (this.okBtnClickCallback) {
            this.okBtnClickCallback(this.gold);
        }
        this.caozuoData = 0;
        this.removeUI();
    },

    removeUI: function (event, custom) {
        //if (this.caozuoData != 3) {
        this.node.removeFromParent();
        this.node.destroy();
        if (event) {
            var shield = tdk.popupParent.getComponentInChildren('shield_ui');
            if (shield) {
                shield.close();
            }
        }
        //}
    },

    addOkBtnClickListener: function (cb) {
        if (typeof cb == 'function') {
            this.okBtnClickCallback = cb;
        } else {
            cc.warn('tdk_bet_box::addokBtnClickListener:cb not function');
        }
    },
});
