const dd = cc.dd;
var hall_prefab = require('hall_prefab_cfg');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var shop_cofig = require('shop');
var item_config = require('item');
var HallCommonObj = require('hall_common_data');
var hallData = HallCommonObj.HallCommonData.getInstance();
const data_gift = require('giftsBag');


var HallGameItemUI = cc.Class({
    extends: cc.Component,

    // statics: {
    //     /**
    //      * gameItemUI 创建工厂
    //      * @param gameItem
    //      */
    //     create: function (gameItem,callFunc) {
    //         var gameItemPrefab = cc.loader.getRes("gameyj_hall/prefabs/klb_hall_ShopItem", cc.Prefab);
    //         if (!gameItemPrefab) {
    //             cc.error("缺少资源或资源未预加载 " + "gameyj_hall/Prefabs/klb_hall_ShopItem");
    //             return;
    //         }
    //         var gameItemNode = cc.instantiate(gameItemPrefab);
    //         var gameItemUI = gameItemNode.getComponent("klb_hall_ShopItemUI");
    //         gameItemUI.setData(gameItem, callFunc);
    //         return gameItemUI;
    //     },
    // },

    properties: {
        icon: { default: null, type: cc.Sprite, tooltip: "物品icon" },
        itemName: { default: null, type: cc.Label, tooltip: "物品名字" },
        itemPrice: { default: null, type: cc.Label, tooltip: "物品价格" },
        itemAdd: { default: null, type: cc.Label, tooltip: "物品额外增加" },
        shouChongIcon: cc.SpriteFrame,
        detailNode: cc.Node,
        itemData: null,
        //itemIcon:[cc.SpriteFrame],
    },

    // use this for initialization
    onLoad: function () {
    },

    onDestroy: function () {
    },

    setData: function (itemInfo, callFunc) {
        if (callFunc) {
            this._callFunc = callFunc;
        }

        var item = shop_cofig.getItem(function (itemdata) {
            return itemdata.key == itemInfo.id;
        });
        if (item == null) {
            return;
        }

        this.game_id = item.key;
        this.itemName.string = item.dec;
        if (itemInfo.vipAdd != 0) {
            this.itemAdd.node.active = true;
            this.itemAdd.string = 'VIP.' + hallData.vipLevel + ' 加赠' + itemInfo.vipAdd + '金币';
        }
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
        // const atlas = cc.loader.getRes("gameyj_hall/atals/shangcheng",cc.SpriteAtlas);
        // var sprite = atlas.getSpriteFrame(item.icon);
        let self = this;
        // if (item.type == 4) {
        //     this.icon.spriteFrame = this.shouChongIcon;
        //     cc.find('info1/desc_ex', this.node).active = true;
        //     var itemsData = data_gift.getItem(function (element) {
        //         return (element.key == item.itemid);
        //     }.bind(this))
        //     if (itemsData) {
        //         let list = itemsData.items.split(';');
        //         let gold = '';
        //         let card = '';
        //         let prop = 0;
        //         list.forEach(element => {
        //             var dataitem = element.split(',');
        //             if (dataitem[0] == '1001') {
        //                 gold = self.changeNumToCHN(parseInt(dataitem[1]));
        //             }
        //             else if (dataitem[0] == '1031' || dataitem[0] == '1032' || dataitem[0] == '1033' || dataitem[0] == '1034' || dataitem[0] == '1035') {
        //                 var exploredata = item_config.getItem(function (itemdata) {
        //                     return itemdata.key == parseInt(dataitem[0]);
        //                 });
        //                 if (exploredata)
        //                     card = Math.floor(exploredata.expire / 86400) + '天';
        //             }
        //             else {
        //                 prop += parseInt(dataitem[1]);
        //             }
        //         });
        //         cc.find('info1/desc_ex/gold_txt', this.node).getComponent(cc.Label).string = gold;
        //         cc.find('info1/desc_ex/card_txt', this.node).getComponent(cc.Label).string = card;
        //         cc.find('info1/desc_ex/prop_txt', this.node).getComponent(cc.Label).string = 'x' + prop;
        //     }
        // }
        // else {
            cc.find('info1/desc_ex', this.node).active = false;
            cc.dd.ResLoader.loadAtlas("gameyj_hall/atals/shangcheng", function (atlas) {
                var sprite = atlas.getSpriteFrame(item.icon);
                if (this.icon && sprite) {
                    this.icon.node.width = sprite.getRect().width;
                    this.icon.node.height = sprite.getRect().height;
                    this.icon.spriteFrame = sprite;
                }
            }.bind(this));
        // }

        this.itemData = itemInfo;
        if (this.itemData.isGiftsbag == 2)
            this.detailNode.active = true;
    },

    onClick: function () {
        if (this.itemData.type == 3 || this.itemData.type == 4) {
            //累计充值限制
            if ((hallData.getRechargeCount() + (this.itemData.costDiscount / 100 > 0 ? (this.itemData.costDiscount / 100) : (this.itemData.costItemCount / 100))) > 21000) {
                cc.dd.PromptBoxUtil.show('每日最多充值21000元，您已累计充值:' + hallData.getRechargeCount() + '元');
                return;
            }
            // cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_PAY, function(prefab){
            //     var component = prefab.getComponent('klb_hall_ShopPay');
            //     component.initUI(this.itemData ,true);
            // }.bind(this));
            cc.dd.PayWeChatH5.iPay(this.itemData.id, this.itemData.costDiscount / 100, this.itemData.costItemCount / 100);
            if (this._callFunc) {
                this._callFunc();
            }
        } else {
            if (this.itemData.isGiftsbag == 1) {
                cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_GIFTBAG, function (prefab) {
                    var component = prefab.getComponent('klb_hall_ShopGiftBag');
                    component.init(this.itemData);
                }.bind(this));
                if (this._callFunc) {
                    this._callFunc(this.itemData);
                }
                return;
            }
            var pbObj = new cc.pb.rank.msg_shop_goods_amount_req();
            pbObj.setId(this.itemData.id);
            pbObj.setItemid(this.itemData.costItemid);
            var num = this.itemData.costDiscount > 0 ? this.itemData.costDiscount : this.itemData.costItemCount;
            pbObj.setItemcount(num);
            cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_msg_shop_goods_amount_req, pbObj, 'msg_shop_goods_amount_req', true);
            cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onExchangeGiftBg');

            if (this._callFunc) {
                this._callFunc(this.itemData);
            }
        }

    },
    //点击查看月卡
    onClickDetail: function (event, data) {
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_YUE_KA);

    },

    /**
     * 筹码数字转换
     */
    changeNumToCHN: function (num) {
        var str = '';
        if (num >= 100000000) {
            str = (num / 100000000.00) + '亿';
        }
        else if (num >= 10000) {
            str = (num / 10000.00) + '万';
        } else if (num >= 1000) {
            str = (num / 1000.0) + '千';
        } else {
            str = num;
        }
        return str;
    },
});
module.exports = HallGameItemUI;
