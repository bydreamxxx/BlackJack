var hall_audio_mgr = require('hall_audio_mgr').Instance();
var HallCommonObj = require('hall_common_data');
const hall_prop_data = require('hall_prop_data').HallPropData.getInstance();
var hall_prefab = require('hall_prefab_cfg');

var HallCommonEd = HallCommonObj.HallCommonEd;
var HallCommonEvent = HallCommonObj.HallCommonEvent;
const msg_coin_pb = require('c_msg_baoxianxiang_coin_pb');
var coin_protoId = require('c_msg_baoxianxiang_coin_cmd');
let texas_Data = require('texas_data').texas_Data;
let game_room = require("game_room");

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
        lbMinGold:cc.Label,
        lbMaxGold:cc.Label,
        lbDisplayGold:cc.Label,
        toggleAutoBuy:cc.Toggle,
    },

    onLoad() {
        HallCommonEd.addObserver(this);
        var bankGold = hall_prop_data.getBankCoin();
        this.bankGold.string = bankGold;
        //第一次打开界面默认自动取钱
        if(texas_Data.Instance().m_bAutoPickMoney == 0)
        {
            // texas_Data.Instance().m_bAutoPickMoney = true;
        }
        this.toggleAutoBuy.isChecked = texas_Data.Instance().m_bAutoPickMoney;
        var configId = texas_Data.Instance().getConfigId();

        var selfPlayer = texas_Data.Instance().getPlayerByViewIdx(0)
        let playGold = selfPlayer.score;

        if (configId) {
            this.cfgData = game_room.getItem(function (item) {
                return item.key === configId;
            });
            if(playGold>this.cfgData.entermax || (this.cfgData.entermin + playGold)>=this.cfgData.entermax)
            {
                this._min = 0;
            }else
            {
                this._min = bankGold<=0?this.cfgData.entermin:(bankGold<this.cfgData.entermin?0:this.cfgData.entermin);
            }
            
            this.lbMinGold.string = texas_Data.Instance().convertNumToStr(this._min);
            
            if(bankGold<=0)//((bankGold + playGold)<this.cfgData.entermin)
            {
                this.canSlide = false;
                this._value = 0;//bankGold
                this._max = bankGold<=0?this.cfgData.entermax:bankGold;
                this.lbMaxGold.string = texas_Data.Instance().convertNumToStr(this._max);
                this.lbDisplayGold.string = this.getSlideFormatString(bankGold);
            }else
            {
                this.canSlide = true;
                this._value = this._min
                this.bankSlider.progress = 0;
                this.bankSlider.getComponent(cc.ProgressBar).progress = 0;
                this._max = Math.min(Math.max(0,this.cfgData.entermax - playGold) ,bankGold);
                this.lbMaxGold.string = texas_Data.Instance().convertNumToStr(this._max);
                this.lbDisplayGold.string = this.getSlideFormatString(this._min);
            }
            

        }else
        {
            cc.log('房间配置错误');
        }
    },

    getSlideFormatString(n)
    {
        var b = parseInt(n).toString();
        var len = b.length;
        if (len <= 3) { return ':'+b; }
        var r = len % 3;
        return ':'+(r > 0 ? b.slice(0, r) + ";" + b.slice(r, len).match(/\d{3}/g).join(";") : b.slice(r, len).match(/\d{3}/g).join(";"));
    },

    onDestroy: function () {
        HallCommonEd.removeObserver(this);
    },
    //滑动滑块
    onclickSlider() {
        if(!this.canSlide){
            this.bankSlider.progress = 1;
            this.bankSlider.getComponent(cc.ProgressBar).progress = 1;
            return;
        }
        var maxGlod = hall_prop_data.getBankCoin();
        var value = this.bankSlider.progress;
        this.bankSlider.getComponent(cc.ProgressBar).progress = value;
        if (maxGlod != 0) {
            this._value = this._min + parseInt(value * (this._max - this._min));
            if (this._value > maxGlod) {
                this._value = maxGlod;
            }
            this.lbDisplayGold.string = this.getSlideFormatString(this._value);
        } else {
            this.lbDisplayGold.string = ':0';
        }
    },
    
    //点击取出
    onclickPickOut(event, custom) {
        if (event.type != "touchend") {
            return;
        }
        hall_audio_mgr.com_btn_click();
        var sum = this._value
        if (sum <= 0 ) {
            cc.dd.PromptBoxUtil.show("取出金额不对");
            return;
        }
        var req = new msg_coin_pb.msg_coin_bank_take_2s();
        req.setCoin(sum);
        cc.gateNet.Instance().sendMsg(coin_protoId.cmd_msg_coin_bank_take_2s, req,
            '取钱', true);

        this.lbDisplayGold.string = ':0';
        this.bankSlider.progress = 0;
        this.bankSlider.getComponent(cc.ProgressBar).progress = 0;
        this.onClose();
    },
    onEventMessage: function (event, data) {
        switch (event) {
            case HallCommonEvent.UPDATA_PropData:
            case HallCommonEvent.BANK_MAIN_UPDATE_COIN:
            case HallCommonEvent.HALL_UPDATE_ASSETS:
                var bankGold = hall_prop_data.getBankCoin()
                this.bankGold.string = bankGold;
                // var selfPlayer = texas_Data.Instance().getPlayerByViewIdx(0)
                // let playGold = selfPlayer.score;

                this.canSlide = bankGold>0;//(bankGold + playGold)>=this.cfgData.entermin;
                cc.log();
                break;
        }
    },
    onToggleAutoBuy(event,data) {
        var flag = event.target.getComponent(cc.Toggle).isChecked;
        texas_Data.Instance().m_bAutoPickMoney = flag
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
