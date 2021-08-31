
var gFishMgr = require('FishDoyenManager').FishManager.Instance();
var fishSender = require('gameyj_fish_doyen_sender');
var playerManager = require('FishDoyenPlayerManager').CFishPlayerManager.Instance();
cc.Class({
    extends: cc.Component,

    properties: {
        icon:cc.Sprite,
        namelab:cc.Label,
        day:cc.Label,
        price:cc.Label,
        des:cc.Label,
        shopAtlas:cc.SpriteAtlas,
    },
    
    onLoad: function(){
        
    },

    onSelectItem:function(itData,serverData,num)
    {
        this.itData = itData;
        this.serverData = serverData;
        this.icon.spriteFrame = this.shopAtlas.getSpriteFrame(itData.icon);                
        this.namelab.string = itData.memo+ "x"+num;
        this.price.string = serverData.costItemCount * gFishMgr.getRoomRate();
        this.des.string = itData.text1;
        if(itData.expire>0)
        {
            this.day.string = parseInt(itData.expire/86400)+'天';
        }else
        {
            this.day.string = '永久';
        }

    },

    onClickBuy:function()
    {
        var own = playerManager.findPlayerByUserId(cc.dd.user.id); //获取自己的数据
        var playerData = own.getPlayerGameInfo();
        if(this.serverData.costItemCount* gFishMgr.getRoomRate()>playerData.coin)
        {
            cc.dd.PromptBoxUtil.show('金币不足');
            return;
        }

        fishSender.requestBuyItem(this.serverData.id);
        this.onClose();

    },

    onClose: function(){
        gFishMgr.playAudio(40);
        cc.dd.UIMgr.destroyUI(this.node);
    }
});
