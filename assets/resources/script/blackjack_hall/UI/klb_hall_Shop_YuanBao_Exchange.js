// create by wj 2018/05/10
var shop_config = require('shop');
var item_config = require('item');
var HallPropData = require('hall_prop_data').HallPropData.getInstance();
var hall_audio_mgr = require('hall_audio_mgr').Instance();
const HallCommonData = require('hall_common_data').HallCommonData.getInstance();

cc.Class({
    extends: cc.Component,

    properties: {
        nametxt: cc.Label, //名称
        price: cc.Label, //价格
        desc: cc.Label, //简介
        exchangeBtn: cc.Button, //兑换按钮
        iconSp: cc.Sprite,
        atlas: cc.SpriteAtlas,
    },

    onLoad() {

    },

    initUI(data, type) {
        if (data == null) {
            return;
        }
        // //const atlas = cc.resources.get("blackjack_hall/atals/itemIcon",cc.SpriteAtlas);
        var changeData = item_config.getItem(function (itemdata) {
            return itemdata.key == data.itemid;
        });
        if (changeData) {
            this.desc.string = '简介：' + changeData.text1;
        }

        var itemInfo = shop_config.getItem(function (itemdata) {
            return itemdata.key == data.id;
        });
        if (itemInfo) {
            this.iconSp.spriteFrame = this.atlas.getSpriteFrame(itemInfo.icon);
            //名称设置
            this.nametxt.string = '名称：' + itemInfo.dec;
            var num = data.costDiscount > 0 ? data.costDiscount : data.costItemCount;
            if (itemInfo.type != 6) {
                if (data.costItemid == 1005) {
                    if (num > HallPropData.getCommonGold()) {
                        this.exchangeBtn.interactable = false;
                    }
                }
                else if (data.costItemid == 1002) {
                    if (num > HallPropData.getDiamond()) {
                        this.exchangeBtn.interactable = false;
                    }
                }
                var costData = item_config.getItem(function (itemdata) {
                    return itemdata.key == data.costItemid;
                });
                var costName = costData ? costData.memo : '元宝'
                this.price.string = '价格：' + costName + this.changeNumToCHN(num);
            }
            else {
                this.price.string = '消耗：玫瑰花' + this.changeNumToCHN(num);
                var roseData = HallPropData.getItemInfoByDataId(1015);
                if (roseData == null)
                    this.exchangeBtn.interactable = false;
                else {
                    if (num > roseData.count) {
                        this.exchangeBtn.interactable = false;
                    }
                }

            }

        }
        this.propItem = data;
        this.type = type;
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

    /**
     * 兑换按钮
     */
    changeProp: function (event, data) {
        hall_audio_mgr.com_btn_click();
        if (HallCommonData.idNum == '') {
            cc.dd.PromptBoxUtil.show('请先完善实名认证信息再进行兑换');
            return;
        }
        cc.dd.UIMgr.openUI("blackjack_hall/prefabs/klb_hall_Shop_YuanBao_ExchangeIndo", function (prefb) {
            var cpt = prefb.getComponent('klb_hall_Shop_YuanBao_ExchangeInfoUI');
            cpt.setDataId(this.propItem.id, this.type);
            cc.dd.UIMgr.destroyUI(this.node);
        }.bind(this));
    },

    close: function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },
});
