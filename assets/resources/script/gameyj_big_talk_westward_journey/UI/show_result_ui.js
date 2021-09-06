// create by wj 2019/12/11
var gameIconConfig = require('westward_Journey_Config').IconConfg;
var game_Data = require('westward_journey_data_mannager').Westward_Journey_Data.Instance();
var game_Ed = require('westward_journey_data_mannager').Westward_Journey_Ed;
var game_Event = require('westward_journey_data_mannager').Westward_Journey_Event;
const xy_audio = require('xiyou_audio');
const gameAudioPath = require('westward_Journey_Config').AuditoPath;

cc.Class({
    extends: cc.Component,

    properties: {
        m_oRoleNode: [],
        m_oAltals : cc.SpriteAtlas, //头像图集
        useDescNode : cc.Node, //玉净瓶使用描述
    },

    onLoad () {
        for(var i = 0; i < 4; i ++){
            this.m_oRoleNode[i] = cc.dd.Utils.seekNodeByName(this.node, 'resultNode' + i);
        }
    },

    initResultUI: function(){
        var nType = game_Data.getResultType();
        var win = game_Data.getWinCoin();
        if(win > 0)
            this.playAudio(9, false);
        else if(win < 0)
            this.playAudio(10, false);
        switch(nType){
            case 0: //普通结果
                var resultList = game_Data.getResultList();
                this.setResultNode(this.m_oRoleNode[0], resultList[0]);
                break;
            case 1: //双倍
                var resultList = game_Data.getResultList();
                this.setResultNode(this.m_oRoleNode[3], resultList[0]);
                break;
            case 2: //双响炮
                var resultList = game_Data.getResultList();
                this.setResultNode(this.m_oRoleNode[0], resultList[0]);
                this.setResultNode(this.m_oRoleNode[1], resultList[1]);
                break;
            case 3: //三响炮
                var resultList = game_Data.getResultList();
                this.setResultNode(this.m_oRoleNode[0], resultList[0]);
                this.setResultNode(this.m_oRoleNode[1], resultList[1]);
                this.setResultNode(this.m_oRoleNode[2], resultList[2]);
                break;
            case 4: //惜败
                if(game_Data.getWinType() == 1)
                    this.useDescNode.active = true;
                break;
        }

        this.m_oTimeOut = setTimeout(function() {
            this.closeUI();   
        }.bind(this), 1500);
    },

    setResultNode: function(roleNode, type){
        roleNode.active = true;
        var iconNode = roleNode.getChildByName('icon');
        var nameTxt = roleNode.getChildByName('name');
        var rateTxt = cc.dd.Utils.seekNodeByName(roleNode,'rate');
        var winTxt = cc.dd.Utils.seekNodeByName(this.node,'resultNum');
        var configdata = gameIconConfig.getItem(function(item){//获取数据
            for(var index of item.indexList){
                if(index == type)
                    return item;
            }
        });

        if(iconNode)
            iconNode.getComponent(cc.Sprite).spriteFrame = this.m_oAltals.getSpriteFrame(configdata.icon);
        if(nameTxt)
            nameTxt.getComponent(cc.Label).string = configdata.name;
        if(rateTxt){
            if(configdata.id != 3)
                rateTxt.getComponent(cc.Label).string = 'x ' + configdata.pay;
            else{
                var winArea = game_Data.getWinAreaList()[0];
                rateTxt.getComponent(cc.Label).string = 'x ' + winArea.rate;
            }
        }
        if(winTxt)
            winTxt.getComponent(cc.Label).string = game_Data.getWinCoin() >= 0 ? game_Data.getWinCoin() : '/' + game_Data.getWinCoin();
    },

    closeUI: function(event, data){
        clearTimeout(this.m_oTimeOut);
        game_Ed.notifyEvent(game_Event.Westward_Journey_BIG_WIN);
        cc.dd.UIMgr.destroyUI(this.node);
    },

    //播放相应音效
    playAudio: function(audioId, isloop){
        var data =  xy_audio.getItem(function(item){
            if(item.key == audioId)
                return item;
        })
        var name = data.audio_name;
        return AudioManager.playSound(gameAudioPath + name, isloop);
    },
});
