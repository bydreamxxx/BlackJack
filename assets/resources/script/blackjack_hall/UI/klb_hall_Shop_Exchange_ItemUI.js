// create by wj 2018/05/10
const dd = cc.dd;
var hall_prefab = require('hall_prefab_cfg');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var shop_cofig = require('shop');
var item_config = require('item');
var HallCommonObj = require('hall_common_data');
const hall_prop_data = require('hall_prop_data').HallPropData.getInstance();

cc.Class({
    extends: cc.Component,

    properties: {
        icon: { default: null, type: cc.Sprite, tooltip: "物品icon" },
        itemName: { default: null, type: cc.Label, tooltip: "物品名字" },
        itemPrice: { default: null, type: cc.Label, tooltip: "物品价格" },
        addDesc: { default: null, type: cc.Label, tooltip: "额外描述" },
        itemData: null,
    },

    // use this for initialization
    onLoad: function () {
    },

    onDestroy: function () {
    },

    setData: function (itemInfo, type) {
        var item = shop_cofig.getItem(function (itemdata) {
            return itemdata.key == itemInfo.id;
        });
        if (item == null) {
            return;
        }

        this.game_id = item.key;
        this.type = type;
        this.itemName.string = item.dec;
        if (itemInfo.costItemid == -1) {
            this.itemPrice.string = (itemInfo.costDiscount > 0 ? (itemInfo.costDiscount / 100) : (itemInfo.costItemCount / 100)) + '元';
        } else {
            var changeData = item_config.getItem(function (itemdata) {
                return itemdata.key == itemInfo.costItemid;
            });
            if (changeData.key != 1004)
                this.itemPrice.string = (itemInfo.costDiscount > 0 ? (this.changeNumToCHN(itemInfo.costDiscount)) : (this.changeNumToCHN(itemInfo.costItemCount))) + changeData.memo;
            else
                this.itemPrice.string = (itemInfo.costDiscount / 100 > 0 ? (itemInfo.costDiscount / 100) : (itemInfo.costItemCount / 100)) + '元' + changeData.memo;
        }
        // const atlas = cc.loader.getRes("blackjack_hall/atals/shangcheng",cc.SpriteAtlas);
        // var sprite = atlas.getSpriteFrame(item.icon);
        if (item.subtype == 5) {
            this.addDesc.node.active = true;
            this.addDesc.string = ((itemInfo.itemCount / 100).toFixed(2));
        }
        cc.dd.ResLoader.loadAtlas("blackjack_hall/atals/shangcheng", function (atlas) {
            var sprite = atlas.getSpriteFrame(item.icon);
            if (this.icon && sprite) {
                this.icon.node.width = sprite.getRect().width;
                this.icon.node.height = sprite.getRect().height;
                this.icon.spriteFrame = sprite;
            }

        }.bind(this));

        this.itemData = itemInfo;
    },

    onClick: function (event, data) {
        if (this.itemData.subType != 5) {//实物兑换
            var UI = cc.dd.UIMgr.getUI("blackjack_hall/prefabs/klb_hall_Shop_YuanBao_Exchange");
            if (UI)
                cc.dd.UIMgr.destroyUI(UI);
            cc.dd.UIMgr.openUI("blackjack_hall/prefabs/klb_hall_Shop_YuanBao_Exchange", function (prefab) {
                var component = prefab.getComponent('klb_hall_Shop_YuanBao_Exchange');
                component.initUI(this.itemData, this.type);
            }.bind(this));
        } else {//红包兑换
            var self = this;
            var UI = cc.dd.UIMgr.getUI(hall_prefab.KLB_HALL_EXCHANGE_CASH);
            if (UI)
                cc.dd.UIMgr.destroyUI(UI);
            cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_EXCHANGE_CASH, function (prefab) {
                var component = prefab.getComponent('klb_hall_ExchangeCash');
                var data = hall_prop_data.getItemInfoByDataId(self.itemData.costItemid);
                var isShow = false;
                if (data != null)
                    isShow = data.count > (self.itemData.costDiscount > 0 ? self.itemData.costDiscount : self.itemData.costItemCount);
                component.setActiveData(self.itemData, (self.itemData.itemCount / 100), isShow);
                var msg = new cc.pb.hall.msg_get_bouns_num_req();
                msg.setOpType(2);
                cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_msg_get_bouns_num_req, msg, "msg_get_bouns_num_req", true);
                cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onExchangeCash');

            });
        }
    },

    /**
     * 筹码数字转换
     */
    changeNumToCHN: function (num) {
        var str = '';
        if (num >= 10000) {
            str = (num / 10000.00) + '万';
        } else if (num >= 1000) {
            str = (num / 1000.0) + '千';
        } else {
            str = num;
        }
        return str;
    },
});
