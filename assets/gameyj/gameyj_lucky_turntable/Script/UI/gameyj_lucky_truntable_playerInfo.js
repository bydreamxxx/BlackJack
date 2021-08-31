// create by wj 2020/06/29
var game_Data = require('lucky_turntable_data').Lucky_Turntable_Data.Instance();
const gameAudioPath = require('lucky_turntable_config').AuditoPath;
const audioConfig = require('lucky_turntable_audio');

cc.Class({
    extends: cc.Component,

    properties: {
        m_oPlayerHead:cc.Node,
        m_oName:cc.Label,
        m_oCoin:cc.Label,
    },

    initPlayerInfo: function(rankId){
        var player = game_Data.findPlayerByRank(rankId)
        if(player){
            this.m_oPlayerHead.getComponent('klb_hall_Player_Head').initHead(player.openId, player.headUrl, 'luck_top_head_init');
            this.m_oName.string = cc.dd.Utils.substr( player.name, 0, 7 );
            this.m_oCoin.string = player.win;
        }
    },

    onCloseUI: function(event, data){
        this.playAudio(10002, false);
        cc.dd.UIMgr.destroyUI(this.node);
    },

    //播放相应音效
    playAudio: function(audioId, isloop){
        var data =  audioConfig.getItem(function(item){
            if(item.key == audioId)
                return item;
        })
        var name = data.audio_name;
        return AudioManager.playSound(gameAudioPath + name, isloop);
    },
});
