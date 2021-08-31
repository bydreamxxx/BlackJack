//create wj 2018/01/19
var shop_cofig = require('shop');
var giftBg_cofig = require('giftsBag');
var item_config = require('item');
cc.Class({
    extends: cc.Component,

    properties: {
        itemIcon: cc.Sprite,
        nameLbl: cc.Label,
        countLbl: cc.Label,
        item_descLbl: cc.Label,
        itemInfo:{default: [], type: cc.Node, tooltip:'物品数据' },
        atlasItem: {
            default: null,
            type: cc.SpriteAtlas,
        },
        atlasShop: {
            default: null,
            type: cc.SpriteAtlas,
        },
        itemData: null,
    },


    onLoad () {
        this.node.zIndex = 5001;
    },

    init: function(data){
        if(data != null){
            //设置物品icon
            var itemData = shop_cofig.getItem(function(item){
                return item.key == data.id;
            })
            this.itemIcon.spriteFrame = this.atlasShop.getSpriteFrame(itemData.icon);
            this.nameLbl.string = itemData.dec;
            this.countLbl.string = (data.costDiscount > 0 ? this.changeNumToCHN(data.costDiscount) : this.changeNumToCHN(data.costItemCount))  + '金币';

            //设置道具数据
            var giftBgData = giftBg_cofig.getItem(function(item){
                return item.key == data.itemid;
            })

            var self = this;
            var str = '';
            var giftList = giftBgData.items.split(';');
            giftList.forEach(function(giftBag, idx) {
                var info = giftBag.split(',');
                var icon = self.itemInfo[idx].getChildByName('icon').getComponent(cc.Sprite);
                var count = self.itemInfo[idx].getChildByName('desc').getComponent(cc.Label);

                //道具配置表数据
                var item = item_config.getItem(function(dataInfo){
                    return dataInfo.key == parseInt(info[0]);
                })
                if(item){
                    icon.spriteFrame = self.atlasItem.getSpriteFrame(info[0]);
                    count.string = info[1];
                    if(idx == giftList.length -1)
                        str += item.memo + 'x' + info[1];
                    else
                        str += item.memo + 'x' + info[1] + ',';
                }
            });
            this.item_descLbl.string = str;
            this.itemData = data; 
        }
    },

    onExchangeGiftBg: function(event, data){
        var pbObj = new cc.pb.rank.msg_shop_goods_amount_req();
        pbObj.setId(this.itemData.id);
        pbObj.setItemid(this.itemData.costItemid);
        var num = this.itemData.costDiscount > 0 ? this.itemData.costDiscount : this.itemData.costItemCount;
        pbObj.setItemcount(num);
        cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_msg_shop_goods_amount_req, pbObj, 'msg_shop_goods_amount_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onExchangeGiftBg');

        this.close();
    },

    close: function(){
        cc.dd.UIMgr.destroyUI(this.node);
    },

    /**
     * 筹码数字转换
     */
    changeNumToCHN: function(num){
        var str = '';
        if(num >= 10000){
            str = (num / 10000.00) + '万';
        }else if(num >= 1000){
            str = (num / 1000.0) + '千';
        }else{
            str = num;
        }
        return str;
    },

    // update (dt) {},
});
