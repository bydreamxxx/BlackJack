//create by wj 2019/12/11
var gameIconConfig = require('westward_Journey_Config').IconConfg;
var game_Ed = require('westward_journey_data_mannager').Westward_Journey_Ed;
var game_Event = require('westward_journey_data_mannager').Westward_Journey_Event;
var game_Data = require('westward_journey_data_mannager').Westward_Journey_Data.Instance();
const xy_audio = require('xiyou_audio');
const gameAudioPath = require('westward_Journey_Config').AuditoPath;

cc.Class({
    extends: cc.Component,

    properties: {
        m_oRoleSkelton : sp.Skeleton, //人物骨骼动画
        m_oZixiaParticle: cc.Node, //紫霞仙子粒子
        m_oXianParticle: cc.Node, //仙粒子
        m_oMoParticle: cc.Node, //魔粒子
        m_oRateText: cc.Label, //倍率文本
        m_oRoleSprite: cc.Sprite, //人物描述图片
        m_oRoleAtals: cc.SpriteAtlas, //人物描述图集
        m_oFrameLeft : sp.Skeleton, //左边闪烁框
        m_oFrameRight : sp.Skeleton, //右边闪烁框
        m_oEndNode: [],
    },
    onLoad: function(){
        for(var i = 0; i < 26; i ++){
            this.m_oEndNode[i] = cc.dd.Utils.seekNodeByName(this.node, 'endNode' + i);
        }
    },

    initUI: function(type, endIndex){
        var configData = gameIconConfig.getItem(function(item){
            if(item.id == type)
                return item;
        });
        if(configData){
            this.m_oRoleSprite.spriteFrame = this.m_oRoleAtals.getSpriteFrame(configData.roleDesc); //人物描述图片
            this.m_oRateText.string = configData.pay; //倍率
            if(game_Data.getResultType() == 1)//双倍
                this.m_oRateText.string = configData.pay + 'x2'; //倍率
            this.playShowAct(configData, endIndex);
        }
    },

    playShowAct: function(data, endIndex){
        this.m_oRoleSkelton.node.setScale(0.14);
        this.m_oRoleSkelton.node.setPosition(this.m_oEndNode[endIndex].getPosition());            

        this.m_oRoleSkelton.node.active = true;
        this.m_oRoleSkelton.setAnimation(0, data.bigIcon, false); //设置人物骨骼动画
        var Act = cc.spawn(cc.scaleTo(1.6, 0.98), cc.moveTo(1.6, cc.v2(0, 0)));
        var self = this;
        this.m_oRoleSkelton.node.runAction(cc.sequence(Act, cc.callFunc(function(){
            if(data.type == 0){//仙
                if(data.id == 6)//紫霞仙子
                    self.m_oZixiaParticle.active = true;
                else if(data.id == 1 || data.id == 7)//猪八戒，至尊宝
                    self.m_oXianParticle.active = true;
            }else{// 魔
                if(data.id == 4)//白晶晶
                    self.m_oMoParticle.active = true;
            }
        }), cc.scaleTo(0.2, 0.8), cc.scaleTo(0.2, 0.98), cc.callFunc(function(){
            self.m_oRoleSprite.node.parent.active = true;
            self.playAudio(data.audioId, false);
        }), cc.delayTime(1.5), cc.callFunc(function(){
            game_Ed.notifyEvent(game_Event.Westward_Journey_CHECK_RESULT);
            cc.dd.UIMgr.destroyUI(self.node);
        })));

        this.node.runAction(cc.sequence(cc.delayTime(0.7), cc.callFunc(function(){
            if(data.type == 0){
                self.m_oFrameLeft.setAnimation(0, 'xian', false);
                self.m_oFrameRight.setAnimation(0, 'xian', false);
            }else{
                self.m_oFrameLeft.setAnimation(0, 'mo', false);
                self.m_oFrameRight.setAnimation(0, 'mo', false);
            }
            self.m_oFrameLeft.node.active = true;
            self.m_oFrameRight.node.active = true;
        })));
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
