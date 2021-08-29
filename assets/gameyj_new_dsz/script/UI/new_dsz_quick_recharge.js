// create by wj 2019/04/26
var shop_data = require('hall_shop').shopData.Instance();
var shop_cofig = require('shop');
var HallCommonObj = require('hall_common_data');
var hallData = HallCommonObj.HallCommonData.getInstance();
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var deskData = require('new_dsz_desk').New_DSZ_Desk_Data.Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        m_oContent: cc.Node,
        m_oBuyItem: cc.Node,
        m_nHeight: 268,
        m_nWidth: 221,
        m_nOffsetX: 10,
        m_nOffsetY: 10,
        itemList: [],
        atlas: cc.SpriteAtlas
    },

    onLoad: function(){
        var shopList = shop_data.getCoinList();
        if(shopList.length == 0)
            return;
        var coinList = [];
        shopList.forEach(function(item) {
            if(item.type == 3 && item.itemid == 1001)
                coinList.push(item)
        });
        for (var i = 0; i < coinList.length; i++) {
            var item = cc.instantiate(this.m_oBuyItem);
            this.itemList.push(item);
            item.active = true;
            item.parent = this.m_oContent;
            var cnt = this.itemList.length;
            var itemInfo = shop_cofig.getItem(function (itemdata) {
                return itemdata.key == coinList[i].id;
            });

            var y = (Math.ceil(cnt / 2) - 0.5) * this.m_nHeight + (Math.ceil(cnt / 2) - 0.5) * this.m_nOffsetY;
            item.y = -y;
            var index = (cnt % 2);
            if (index == 0) { index = 2; }
            var x = (index - 1)  * this.m_nWidth  + index  * this.m_nOffsetX + this.m_nWidth / 2;
            item.x = x;

            item.getChildByName('coin').getComponent(cc.Label).string = itemInfo.item_count;
            item.getChildByName('buyBtn').tagname = coinList[i].id;
            cc.dd.Utils.seekNodeByName(item, 'paydesc').getComponent(cc.Label).string = (coinList[i].costDiscount / 100 > 0 ? (coinList[i].costDiscount / 100) : (coinList[i].costItemCount / 100));
            

            var sprite = this.atlas.getSpriteFrame(itemInfo.icon);
            var iconSp = item.getChildByName('icon').getComponent(cc.Sprite);
            if (iconSp && sprite) {
                iconSp.node.width = sprite.getRect().width;
                iconSp.node.height = sprite.getRect().height;
                iconSp.spriteFrame = sprite;
            }

        }
        this.m_oContent.height = (Math.ceil(coinList.length / 2)) * this.m_nHeight + ((Math.ceil(coinList.length / 2)) + 1) * this.m_nOffsetY;
        this.m_tCoinItemList = coinList;
    },

    onClick: function (event, data) {
        hall_audio_mgr.com_btn_click();
        var tag = event.target.tagname
        var itemData = null;
        for(var i = 0; i < this.m_tCoinItemList.length; i++){
            var item = this.m_tCoinItemList[i];
            if(item.id == tag){
                itemData = item;
                break;
            }
        }
        //累计充值限制
        if ((hallData.getRechargeCount() + (itemData.costDiscount / 100 > 0 ? (itemData.costDiscount / 100) : (itemData.costItemCount / 100))) > 50000) {
            cc.dd.PromptBoxUtil.show('每日累积充值最大值为5万元，您当前累计充值为:' + hallData.getRechargeCount() + '元');
            return;
        }
        cc.dd.PayWeChatH5.iPay(itemData.id, itemData.costDiscount / 100, itemData.costItemCount / 100);
        deskData.isRecharge = true;
    },

    onClose: function(event, data){
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

});
