var hall_audio_mgr = require('hall_audio_mgr').Instance();
var HallCommonObj = require('hall_common_data');
const hall_prop_data = require('hall_prop_data').HallPropData.getInstance();
var hall_prefab = require('hall_prefab_cfg');

var HallCommonEd = HallCommonObj.HallCommonEd;
var HallCommonEvent = HallCommonObj.HallCommonEvent;
const msg_coin_pb = require('c_msg_baoxianxiang_coin_pb');
var coin_protoId = require('c_msg_baoxianxiang_coin_cmd');
// let texas_Data = require('texas_data').texas_Data;
let game_room = require("game_room");

var fortune_hall_msg_send = require('fortune_hall_msg_send').Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        bankGold: {
            default: null,
            type: cc.Label,
            tooltip: "银行"
        },
        bankSlider: {
            default: null,
            type: cc.Slider,
            tooltip: "滑块"
        },
        lbMinGold: cc.Label,
        lbMaxGold: cc.Label,
        lbDisplayGold: cc.Label,
    },

    onLoad() {
        HallCommonEd.addObserver(this);
        var bankGold = hall_prop_data.getBankCoin();
        this.bankGold.string = bankGold;
        this._callback = null
    },

    setData(entermin, entermax) {
        this.lbMinGold.string = this.convertNumToStr(entermin)
        this.lbMaxGold.string = this.convertNumToStr(entermax)
        this.canSlide = true;
        var playGold = hall_prop_data.getCoin();
        if (playGold < entermin) {
            this._value = entermin
            this.bankSlider.progress = 0;
            this.bankSlider.getComponent(cc.ProgressBar).progress = 0;
            this.lbDisplayGold.string = this.getSlideFormatString(this._value);

        } else {
            this._value = entermax
            this.bankSlider.progress = 1;
            this.bankSlider.getComponent(cc.ProgressBar).progress = 1;
            this.lbDisplayGold.string = this.getSlideFormatString(entermax);

        }
        this._min = entermin;
        this._max = entermax;

    },
    convertNumToStr(num) {
        if (num < 10000) {
            return num.toString();
        }
        else if (num < 100000000) {
            return Math.round(num / 1000) / 10 + '万';
        }
        else {
            return Math.round(num / 10000000) / 10 + '亿';
        }
    },
    setCallBack: function (callback, deskId, seat) {
        this._callback = callback
        this.deskId = deskId
        this.seat = seat
    },
    getSlideFormatString(n) {
        var b = parseInt(n).toString();
        var len = b.length;
        if (len <= 3) { return ':' + b; }
        var r = len % 3;
        return ':' + (r > 0 ? b.slice(0, r) + ";" + b.slice(r, len).match(/\d{3}/g).join(";") : b.slice(r, len).match(/\d{3}/g).join(";"));
    },

    onDestroy: function () {
        HallCommonEd.removeObserver(this);
    },
    //滑动滑块
    onclickSlider() {
        if (!this.canSlide) {
            this.bankSlider.progress = 1;
            this.bankSlider.getComponent(cc.ProgressBar).progress = 1;
            return;
        }
        var maxGlod = hall_prop_data.getBankCoin();
        var playGold = hall_prop_data.getCoin();
        var value = this.bankSlider.progress;
        this.bankSlider.getComponent(cc.ProgressBar).progress = value;
        this._value = this._min + parseInt(value * (this._max - this._min));
        if (this._value > (maxGlod + playGold)) {
            this._value = maxGlod + playGold;
        }
        this.lbDisplayGold.string = this.getSlideFormatString(this._value);
    },

    //点击取出
    onclickPickOut(event, custom) {
        if (event.type != "touchend") {
            return;
        }
        hall_audio_mgr.com_btn_click();
        var sum = this._value
        if (sum <= 0) {
            cc.dd.PromptBoxUtil.show("取出金额不对");
            return;
        }


        var coin = hall_prop_data.getCoin();
        var bankGold = hall_prop_data.getBankCoin();

        if (this._max < coin) {
            let amount = coin - sum
            fortune_hall_msg_send.requestBankSaveCoin(amount);
        }
        if (this._min > coin) {
            var req = new msg_coin_pb.msg_coin_bank_take_2s();
            // let amount = sum > bankGold ? sum - coin : sum

            let amount = sum - coin
            req.setCoin(amount);
            cc.gateNet.Instance().sendMsg(coin_protoId.cmd_msg_coin_bank_take_2s, req,
                '取钱', true);
        }
        // this.lbDisplayGold.string = ':0';
        // this.bankSlider.progress = 0;
        // this.bankSlider.getComponent(cc.ProgressBar).progress = 0;
    },
    onEventMessage: function (event, data) {
        switch (event) {
            // case HallCommonEvent.UPDATA_PropData:
            // case HallCommonEvent.BANK_MAIN_UPDATE_COIN:
            case HallCommonEvent.HALL_UPDATE_ASSETS:
                var bankGold = hall_prop_data.getBankCoin()
                this.bankGold.string = bankGold;

                // var selfPlayer = texas_Data.Instance().getPlayerByViewIdx(0)
                // let playGold = selfPlayer.score;

                this.canSlide = bankGold > 0;//(bankGold + playGold)>=this.cfgData.entermin;
                cc.log();

                this._callback(this.deskId, this.seat);
                this.onClose();
                break;
        }
    },

    onClose() {
        cc.dd.UIMgr.destroyUI(this.node);
    },

    onClickShop(event, data) {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(hall_prefab.KLB_SHOP_LAYER, function (ui) {
            var type = 'ZS'; //默认打开房卡页面
            ui.getComponent('klb_hall_ShopLayer').gotoPage(type);
            // ui.setLocalZOrder(5000);
        }.bind(this));
    },

});
