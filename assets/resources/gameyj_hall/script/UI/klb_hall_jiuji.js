var hall_audio_mgr = require('hall_audio_mgr');
var HallCommonObj = require('hall_common_data');
var HallCommonEd = HallCommonObj.HallCommonEd;
var HallCommonEvent = HallCommonObj.HallCommonEvent;
var HallCommonData = HallCommonObj.HallCommonData;
var shop_data = require('hall_shop').shopData.Instance();
var hall_prefab = require('hall_prefab_cfg');
var data_vip = require('vip');
var AppCfg = require('AppConfig');

cc.Class({
    extends: cc.Component,

    properties: {
        lingqu: cc.Label,
        jiuji_jindou: cc.Label,

        shop_jindou_list: [cc.Label],
        shop_rmb_list: [cc.Label],

        matchButton: cc.Node,
    },

    onLoad: function () {
        this.shop_charge_list = new Array(3);
        this.initUI();
        HallCommonEd.addObserver(this);
    },

    onDestroy: function () {
        HallCommonEd.removeObserver(this);
    },

    initUI: function () {
        this.matchButton.active = cc.director.getScene().name === AppCfg.HALL_NAME && !cc._isHuaweiGame;

        this.lingqu.string = '今日还可以领取' + HallCommonData.getInstance().jiuji_cnt + '次';
        var viplevel = HallCommonData.getInstance().vipLevel;
        var jiuji_item = data_vip.getItem(function (item) {
            return item.key == viplevel;
        });
        var data = jiuji_item.relief_coe.split(",");
        var jiuji_num = data[0];
        this.jiuji_jindou.string = jiuji_num + '金币';
        //this.update_buy_list(0);
    },

    onClickClose: function () {
        hall_audio_mgr.Instance().com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    onLingQu: function () {
        hall_audio_mgr.Instance().com_btn_click();
        var msg = new cc.pb.rank.msg_relief_gift_2s();
        cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_msg_relief_gift_2s, msg, 'msg_relief_gift_2s', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onLingQu');
    },

    onBuy: function (event, data) {
        hall_audio_mgr.Instance().com_btn_click();
        var idx = parseInt(data);
        // cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_PAY, function(prefab){
        //     var component = prefab.getComponent('klb_hall_ShopPay');
        //     component.initUI(this.shop_charge_list[idx], true);
        // }.bind(this));
        cc.dd.PayWeChatH5.iPay(this.shop_charge_list[idx].id, this.shop_charge_list[idx].costDiscount / 100, this.shop_charge_list[idx].costItemCount / 100);
    },

    onClickMatch() {
        /************************游戏统计 start************************/
        cc.dd.Utils.sendClientAction(cc.dd.clientAction.HALL, cc.dd.clientAction.T_HALL.LUCKYMONEY);
        /************************游戏统计   end************************/
        hall_audio_mgr.Instance().com_btn_click();
        cc.dd.UIMgr.openUI(hall_prefab.KLB_Match, function (node) {
            node.getComponent('klb_hall_Match').sendGetMatch(1);
        }.bind(this));
        cc.dd.UIMgr.destroyUI(this.node);
    },

    update_buy_list: function (need_nun) {
        if (cc._appstore_check || cc._androidstore_check || cc._isHuaweiGame) {//屏蔽购买  平台包
            for (var i = 0; i < 3; ++i) {
                this.shop_jindou_list[i].node.parent.active = false;
            }
            return;
        }

        var buy_list = [];
        var coinList = shop_data.getCoinList();
        coinList.forEach(function (item) {
            if (item.itemCount >= need_nun)
                buy_list.push(item)
        });

        var item_buchong = null;
        var cnt_buchong = 0;
        // if(buy_list.length == 0){
        //     if(data_klb_shop.items.length == 0){
        //         cc.error('商城表未配置');
        //         return;
        //     }
        //     item_buchong = data_klb_shop.items[data_klb_shop.items.length-1];
        //     cnt_buchong = 3;
        // }else if(buy_list.length<3){
        //     item_buchong = buy_list[buy_list.length-1];
        //     cnt_buchong = 3 - buy_list.length;
        // }else{

        // }
        if (buy_list.length < 3) {
            item_buchong = buy_list[buy_list.length - 1];
            cnt_buchong = 3 - buy_list.length;
        }
        for (var i = 0; i < cnt_buchong; ++i) {
            buy_list.push(item_buchong);
        }

        for (var i = 0; i < 3; ++i) {
            this.shop_jindou_list[i].string = buy_list[i].itemCount + '金币';
            this.shop_rmb_list[i].string = (buy_list[i].costDiscount > 0 ? buy_list[i].costDiscount / 100 : buy_list[i].costItemCount / 100) + '元';
            this.shop_charge_list[i] = buy_list[i];
        }
    },

    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage: function (event, data) {
        switch (event) {
            case HallCommonEvent.HALL_UPDATE_JIUJI_CNT:
                this.lingqu.string = '今日还可以领取' + HallCommonData.getInstance().jiuji_cnt + '次';
                break;
            default:
                break;
        }
    }
});
