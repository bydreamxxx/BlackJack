// create By Wj 2018/01/13
var item_config = require('item');
var shop_config = require('shop');
var prop_data = require('hall_prop_data').HallPropData;

var hander = cc.Class({
    extends: cc.Component,

    properties: {
        descTxt: cc.Label,
        iconSp: cc.Sprite,
        changeSp: cc.Sprite,
        countTxt: cc.Label,
        changeCountTxt: cc.Label,
        atlas: cc.SpriteAtlas,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.zIndex = 5001;
    },

    initUI(data) {
        if (data == null) {
            return;
        }
        //const atlas = cc.resources.get("blackjack_hall/atals/itemIcon",cc.SpriteAtlas);
        var changeData = item_config.getItem(function (itemdata) {
            return itemdata.key == data.costItemid;
        });
        if (changeData) {
            var sprite = this.atlas.getSpriteFrame(changeData.key);
            this.changeSp.spriteFrame = sprite;
            var num = data.costDiscount > 0 ? data.costDiscount : data.costItemCount;
            if (changeData.key != 1004) {
                this.descTxt.string = '您将用' + this.changeNumToCHN(num) + changeData.memo + '兑换';
                this.changeCountTxt.string = this.changeNumToCHN(num);
            } else {
                this.descTxt.string = '您将用' + this.changeNumToCHN(num / 100) + '元' + changeData.memo + '兑换';
                this.changeCountTxt.string = this.changeNumToCHN(num / 100);
            }
        }

        var itemInfo = item_config.getItem(function (itemdata) {
            return itemdata.key == data.itemid;
        });
        if (itemInfo) {
            this.iconSp.spriteFrame = this.atlas.getSpriteFrame(data.itemid);
            this.countTxt.string = this.changeNumToCHN(data.itemCount);
            if (itemInfo.key != 1001 && itemInfo.key != 1003)
                this.descTxt.string = this.descTxt.string + this.changeNumToCHN(data.itemCount) + '个' + itemInfo.memo;
            else if (itemInfo.key == 1003)
                this.descTxt.string = this.descTxt.string + this.changeNumToCHN(data.itemCount) + '张' + itemInfo.memo;
            else
                this.descTxt.string = this.descTxt.string + this.changeNumToCHN(data.itemCount) + itemInfo.memo;
        }
        this.propItem = data;
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

    /**
     * 兑换按钮
     */
    changeProp: function () {
        var self = this;
        var changeData = item_config.getItem(function (itemdata) {
            return itemdata.key == self.propItem.costItemid;
        });
        if (changeData && changeData.key == 1004) {
            var num = self.propItem.costDiscount > 0 ? self.propItem.costDiscount : self.propItem.costItemCount;
            if (prop_data.getInstance().getRedBag() < num) {
                cc.dd.PromptBoxUtil.show('兑换失败,红包券不足');
                return;
            }
        }
        var pbObj = new cc.pb.rank.msg_shop_buy_req();
        pbObj.setId(this.propItem.id);
        cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_msg_shop_buy_req, pbObj, 'msg_shop_buy_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'changeProp');
        this.close();
    },

    close: function () {
        this.node.destroy();
    },

    // update (dt) {},
});

module.exports = hander;

