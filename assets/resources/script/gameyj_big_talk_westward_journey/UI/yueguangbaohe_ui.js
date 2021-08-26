// create by wj 2019/12/12
var game_Data = require('westward_journey_data_mannager').Westward_Journey_Data.Instance();
var game_Ed = require('westward_journey_data_mannager').Westward_Journey_Ed;
var game_Event = require('westward_journey_data_mannager').Westward_Journey_Event;
const xy_audio = require('xiyou_audio');
const gameAudioPath = require('westward_Journey_Config').AuditoPath;

cc.Class({
    extends: cc.Component,

    properties: {
        m_oBoxSkelton : sp.Skeleton, //左边闪烁框
        m_oPaoTai: sp.Skeleton, //炮台动画
        m_oJingzhi: sp.Skeleton, //镜子动画
        m_oDescNode: cc.Node, //
    },

    onLoad () {
        this.playAudio(20, false);
        this.m_oBoxSkelton.setAnimation(0, 'yueguangbaohe', false);
        var self = this;
        this.m_oTimeOut = setTimeout(function(){
            clearTimeout(self.m_oTimeOut);
            self.m_oPaoTai.node.active = true;
            self.m_oPaoTai.setAnimation(0, 'dapaoruchang', false);
            self.m_oPaoTai.setCompleteListener(function(){
                self.playAudio(11, false);
                self.m_oPaoTai.setAnimation(0, 'dapaofashe', false);
                self.m_oPaoTai.setCompleteListener(function(){
                    self.m_oPaoTai.node.active = false;
                    self.m_oJingzhi.node.active = true;
                    self.m_oJingzhi.setAnimation(0, 'jinzhi', false);
                    setTimeout(function(){
                        self.showYueguangResult();
                    }, 500);

                    self.m_oJingzhi.setCompleteListener(null);
                });    
            });
        }, 1000);
    },

    playYueGuangBaoHe: function(){
        var self = this;
        self.m_oPaoTai.clearTracks();
        self.m_oPaoTai.node.active = true;
        self.m_oPaoTai.setAnimation(0, 'dapaoruchang', false);
        self.m_oPaoTai.setCompleteListener(function(){
            self.playAudio(11, false);
            self.m_oPaoTai.setAnimation(0, 'dapaofashe2', false);
            self.m_oPaoTai.setCompleteListener(function(){
                self.m_oPaoTai.node.active = false;
                setTimeout(function(){
                    self.showYueguangResult();
                }, 500);
            })
        });
    },

    showYueguangResult: function(){
        var resultType = game_Data.getResultType();
        switch(resultType){
            case 1: //两倍
            case 2: //双响炮
            case 3: //三响炮
                this.m_oBoxSkelton.node.active = false;
                this.m_oDescNode.active = false;
                game_Ed.notifyEvent(game_Event.Westward_Journey_RUN_REPEAT);
                break;
            case 4: //惜败
                break;
        }

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
