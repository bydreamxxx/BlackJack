const shopCfg = require('shop')
const iteCfg = require('item')
const FishType = require('DoyenFishType');
var shop_data = require('hall_shop').shopData.Instance();
var gFishMgr = require('FishDoyenManager').FishManager.Instance();
cc.Class({
    extends: cc.Component,

    properties: {
        m_ItemNode: cc.Node,
        m_Content : cc.Node,
        shopAtlas:cc.SpriteAtlas,
    },
    
    onLoad: function(){
        this.itemList = shopCfg.getItemList(function(item){
            if(item.key >= 3023 && item.key <= 3032)
                return item;
        })

        var compare = function (a, b) {//比较函数
            if (a.key < b.key) {
                return -1;
            } else if (a.key > b.key) {
                return 1;
            } else {
                return 0;
            }
        }
        this.itemList.sort(compare);
        this._PropData = shop_data.getPropList();
        for(var i = 0; i < this.itemList.length; i++){
            var itData = this.itemList[i];
            if(itData){
                var cfgData = iteCfg.getItem(function (element) {
                    if(element.key==itData.itemid)
                        return true;
                }.bind(this));
                var serverData = shop_data.getPropItemByID(itData.key)
                if(serverData==null)
                    continue;
                var fishNode = cc.instantiate(this.m_ItemNode);
                fishNode.parent = this.m_Content;
                fishNode.active = true;

                var name = fishNode.getChildByName('name').getComponent(cc.Label);
                var gold = cc.find('coin/txt',fishNode).getComponent(cc.Label);
                var day = cc.find('day/txt',fishNode).getComponent(cc.Label);
                var sp = fishNode.getChildByName('icon').getComponent(cc.Sprite);
                var dayNode = cc.find('day',fishNode); 
                fishNode.itData = cfgData;
                fishNode.num = itData.item_count;
                fishNode.serverData = serverData;
                sp.spriteFrame = this.shopAtlas.getSpriteFrame(cfgData.icon);                
                name.string = cfgData.memo + "x"+itData.item_count;
                gold.string = serverData.costItemCount * gFishMgr.getRoomRate();
                if(cfgData.expire>0)
                {
                    dayNode.active = true;
                    day.string = parseInt(cfgData.expire/86400)+'天';
                }else
                {
                    dayNode.active = false;
                }
                
                fishNode.on('click',this.onSelectItem.bind(this),this);
            }
        }

    },

    onSelectItem:function(event,data)
    {
        var itData = event.target.itData
        var serverData = event.target.serverData;
        var num = event.target.num;
        cc.dd.UIMgr.openUI('gameyj_fish_doyen/prefabs/fish_doyen_shop_ui_item', function (ui) {
            var sc = ui.getComponent('gameyj_Fish_doyen_shop_item');
            sc.onSelectItem(itData,serverData,num);
        }.bind(this)); 
    },

    scrollTo:function(per)
    {
        var scr = cc.find('shopScroll',this.node).getComponent(cc.ScrollView)
        scr.scrollToPercentHorizontal(per);
    },

    onClose: function(){
        gFishMgr.playAudio(40);
        cc.dd.UIMgr.destroyUI(this.node);
    }
});
