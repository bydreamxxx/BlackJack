//create by wj 2020/06/16
const gameAudioPath = require('horse_racing_Config').AuditoPath;
const gameData = require('horse_racing_Data').Horse_Racing_Data.Instance();
const gameType = require('horse_racing_Config').HorseRacingGameConfig;

cc.Class({
    extends: cc.Component,

    properties: {
        m_bSoundSwitch: true,
        m_bMusicSwitch: true,

        m_oMusicBtn: cc.Node,
        m_oSoundBtn: cc.Node,
    },

    onLoad() {
        //初始值
        //音效
        this.m_bSoundSwitch = AudioManager._getLocalSoundSwitch();

        //音乐
        this.m_bMusicSwitch = AudioManager._getLocalMusicSwitch();

        // //音效
        if (this.m_bSoundSwitch)//on
        {
            this.m_oSoundBtn.setPosition(cc.v2(30.9, 1.8));
        } else {
            this.m_oSoundBtn.setPosition(cc.v2(-31.2, 1.5));
        }
        //音乐
        if (this.m_bMusicSwitch)//on
        {
            this.m_oMusicBtn.setPosition(cc.v2(30.9, 1.8));
        } else {
            this.m_oMusicBtn.setPosition(cc.v2(-31.2, 1.5));
        }
    },

    onClickSound: function (event, data) {
        //this.playAudio(10002, false);

        this.m_bSoundSwitch = !this.m_bSoundSwitch;

        if (this.m_bSoundSwitch)//on
        {
            this.m_oSoundBtn.setPosition(cc.v2(30.9, 1.8));
            AudioManager.onSound();
        } else {
            this.m_oSoundBtn.setPosition(cc.v2(-31.2, 1.5));
            AudioManager.offSound();
        }
    },

    onClickMusic: function (event, data) {
        //this.playAudio(10002, false);

        this.m_bMusicSwitch = !this.m_bMusicSwitch;
        if (this.m_bMusicSwitch)//on
        {
            this.m_oMusicBtn.setPosition(cc.v2(30.9, 1.8));
            AudioManager._setLocalMusicSwitch(true);
            AudioManager.setMusicVolumeNotControlledBySwitch(true);
        } else {
            this.m_oMusicBtn.setPosition(cc.v2(-31.2, 1.5));
            AudioManager._setLocalMusicSwitch(false);
            AudioManager.setMusicVolumeNotControlledBySwitch(false);
        }
    },

    close: function (event, data) {
        //this.playAudio(10002, false);
        cc.dd.UIMgr.destroyUI(this.node);

    },

    //播放相应音效
    playAudio: function (audioId, isloop) {
        var data = audioConfig.getItem(function (item) {
            if (item.key == audioId)
                return item;
        })
        var name = data.audio_name;
        return AudioManager.playSound(gameAudioPath + name, isloop);
    },

});
