let hall_audio_mgr = require('hall_audio_mgr').Instance();
let hall_prefab = require('hall_prefab_cfg');
let HallCommonObj = require('hall_common_data');
let HallCommonEd = HallCommonObj.HallCommonEd;
let HallCommonEvent = HallCommonObj.HallCommonEvent;
const hall_prop_data = require('hall_prop_data').HallPropData.getInstance();
const HallCommonData = require('hall_common_data').HallCommonData.getInstance();
cc.Class({
    extends: cc.Component,

    properties: {
        cardMoneyLbl: cc.Label,
        cashMoneyLbl: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        HallCommonEd.addObserver(this);
        this._cardData = null;
        this._cashData = null;
        this.updateProp();
    },

    onDestroy() {
        HallCommonEd.removeObserver(this);
    },

    updateProp() {
        for (var i = 0; i < hall_prop_data.propList.length; i++) {
            if (hall_prop_data.propList[i].dataId == 1004) {
                this._cardData = hall_prop_data.propList[i];
            }
            if (hall_prop_data.propList[i].dataId == 1099) {
                this._cashData = hall_prop_data.propList[i];
            }
        }
        this.cardMoneyLbl.string = this._cardData ? (this._cardData.count / 100).toString() + '元' : '0元';
        this.cashMoneyLbl.string = this._cashData ? (this._cashData.count / 100).toString() + '元' : '0元';
    },

    // update (dt) {},

    closeBtn() {
        hall_audio_mgr.com_btn_click();
        HallCommonEd.notifyEvent(HallCommonEvent.LUCKY_RESUME_TIMER, null);
        cc.dd.UIMgr.destroyUI(this.node);
    },

    moreLuckyBtn() {
        hall_audio_mgr.com_btn_click();
        HallCommonEd.notifyEvent(HallCommonEvent.LUCKY_RESUME_TIMER, null);
        cc.dd.UIMgr.destroyUI(this.node);
        cc.dd.UIMgr.openUI('gameyj_hall/prefabs/klb_hall_fxyl');
    },

    exchangeCard() {
        cc.dd.PromptBoxUtil.show('兑换系统维护，暂时无法兑换');
        return;
        hall_audio_mgr.com_btn_click();
        if (HallCommonData.idNum == '') {
            cc.dd.PromptBoxUtil.show('请先完善实名认证信息再进行兑换');
            return;
        }
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_EXCHANGE_CASH, function (prefab) {
            var component = prefab.getComponent('klb_hall_ExchangeCash');
            component.setData(this._cardData, 25, 50);

            var msg = new cc.pb.hall.msg_get_bouns_num_req();
            msg.setOpType(1);
            cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_msg_get_bouns_num_req, msg, "msg_get_bouns_num_req", true);
        }.bind(this));
    },

    exchangeCash() {
        cc.dd.PromptBoxUtil.show('兑换系统维护，暂时无法兑换');
        return;
        hall_audio_mgr.com_btn_click();
        if (HallCommonData.idNum == '') {
            cc.dd.PromptBoxUtil.show('请先完善实名认证信息再进行兑换');
            return;

        }
        if (this._cashData.count / 100 > 9) {
            var msg = new cc.pb.hall.msg_use_bag_item_req();
            msg.setUseType(3);
            msg.setItemDataId(this._cashData.dataId);
            msg.setNum(this._cashData.count);

            cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_msg_use_bag_item_req, msg, "cmd_msg_use_bag_item_req", true);
            cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'msg_use_bag_item_req');

        } else {
            cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_EXCHANGE_QUICK_CASH, function (prefab) {
                var component = prefab.getComponent('klb_hall_ExchangeCash');
                component.setQuickData(this._cashData);

                var msg = new cc.pb.hall.msg_get_bouns_num_req();
                msg.setOpType(3);
                cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_msg_get_bouns_num_req, msg, "msg_get_bouns_num_req", true);
            }.bind(this));
        }
    },

    onEventMessage: function (event, data) {
        switch (event) {
            case HallCommonEvent.UPDATA_PropData:
                this.updateProp();
                break;
        }
    },
});
