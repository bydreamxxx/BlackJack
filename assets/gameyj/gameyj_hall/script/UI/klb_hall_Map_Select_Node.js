// created by wj 2018/03/21
var game_list_config = require('klb_gameList');
var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        selectBgSp: cc.SpriteFrame,
        selectSp: cc.SpriteFrame,

        unselectBgSp: cc.SpriteFrame,
        unselectSp: cc.SpriteFrame,
        nameTXT:cc.Label,
        bgSp: cc.Sprite,
        quanBgSp: cc.Sprite,
        selectNode: cc.Node,
        _callBack: null,
        isSelect: false,
    },

    onLoad () {

    },

    setData:function(gameid, isSelect, callBack){
        if(callBack)
            this._callBack = callBack;
        var gameData = game_list_config.getItem(function(data){
            return data.gameid == gameid;
        });
        this.isSelect = isSelect;
        
        if(this.isSelect){
            this.bgSp.spriteFrame = this.selectBgSp;
            this.quanBgSp.spriteFrame = this.selectSp;
            this.selectNode.active = true;
            // this.nameTXT.node.color = cc.color(13,159,40);
        }else{
            this.bgSp.spriteFrame = this.unselectBgSp;
            this.quanBgSp.spriteFrame = this.unselectSp;
            this.selectNode.active = false;
            // this.nameTXT.node.color = cc.color(87,76,70);
        }

        if(gameData)
            this.nameTXT.string = gameData.name;
        this.gameId = gameid;
    },

    //点击游戏选择
    onClick: function(){
        hall_audio_mgr.com_btn_click();
        this.isSelect = !this.isSelect;
        if(this.isSelect){
            this.bgSp.spriteFrame = this.selectBgSp;
            this.quanBgSp.spriteFrame = this.selectSp;
            // this.nameTXT.node.color = cc.color(13,159,40);
            this.selectNode.active = true;
        }else{
            this.bgSp.spriteFrame = this.unselectBgSp;
            this.quanBgSp.spriteFrame = this.unselectSp;
            // this.nameTXT.node.color = cc.color(87,76,70);
            this.selectNode.active = false;
        }
        if(this._callBack)
            this._callBack(this.gameId, this.isSelect);
    }
});
