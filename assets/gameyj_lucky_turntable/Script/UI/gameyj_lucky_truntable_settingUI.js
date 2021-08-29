//create by wj 2020/06/16
const gameAudioPath = require('lucky_turntable_config').AuditoPath;
const audioConfig = require('lucky_turntable_audio');
cc.Class({
    extends: cc.Component,

    properties: {
        m_bSoundSwitch: true,
        m_bMusicSwitch: true,

        m_tBtnSpirte: { default: [], type: cc.SpriteFrame, tooltip: '' },
        m_oMusicBtn: cc.Sprite,
        m_oSoundBtn: cc.Sprite,
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
            this.m_oSoundBtn.spriteFrame = this.m_tBtnSpirte[0]
        } else {
            this.m_oSoundBtn.spriteFrame = this.m_tBtnSpirte[1]
        }
        //音乐
        if (this.m_bMusicSwitch)//on
        {
            this.m_oMusicBtn.spriteFrame = this.m_tBtnSpirte[0]
        } else {
            this.m_oMusicBtn.spriteFrame = this.m_tBtnSpirte[1]
        }
    },

    onClickSound: function (event, data) {
        this.playAudio(10002, false);

        this.m_bSoundSwitch = !this.m_bSoundSwitch;

        if (this.m_bSoundSwitch)//on
        {
            this.m_oSoundBtn.spriteFrame = this.m_tBtnSpirte[0];
            AudioManager.onSound();
        } else {
            this.m_oSoundBtn.spriteFrame = this.m_tBtnSpirte[1];
            AudioManager.offSound();
        }
    },

    onClickMusic: function (event, data) {
        this.playAudio(10002, false);

        this.m_bMusicSwitch = !this.m_bMusicSwitch;
        if (this.m_bMusicSwitch)//on
        {
            this.m_oMusicBtn.spriteFrame = this.m_tBtnSpirte[0];
            AudioManager._setLocalMusicSwitch(true);
            if (AudioManager._getLocalMusicSwitch())
                this.m_nMusicId = AudioManager.playMusic(gameAudioPath + 'audio_bgm_1');

        } else {
            this.m_oMusicBtn.spriteFrame = this.m_tBtnSpirte[1];
            AudioManager.offMusic();
        }
    },

    close: function (event, data) {
        this.playAudio(10002, false);
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
