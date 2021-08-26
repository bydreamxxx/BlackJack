//create by2021/7/13
var hall_audio_mgr = require('hall_audio_mgr').Instance();
const audioConfig = require('mouse_audio_cfg');
cc.Class({
    extends: cc.Component,

    properties: {
        backSoundBtn: cc.Toggle,
        musicBtn: cc.Toggle,
        // m_bSoundSwitch: true,
        // m_bMusicSwitch: true,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.m_bSoundSwitch = AudioManager._getLocalSoundSwitch(); //音效
        this.m_bMusicSwitch = AudioManager._getLocalMusicSwitch();  //背景音乐
        this.init = true;
        if (this.m_bMusicSwitch)//on
        {
            this.backSoundBtn.isChecked = true;
        } else {
            this.backSoundBtn.isChecked = false;
        }
        //音乐
        if (this.m_bSoundSwitch)//on
        {
            this.musicBtn.check();
        } else {
            this.musicBtn.uncheck();
        }
    },
    /**
        * 背景音乐开关设置
        */
    switchBackgroundMusic: function (event) {
        if (event.isChecked) {
            AudioManager._setLocalMusicSwitch(true);
            AudioManager.playMusic(audioConfig.GAME_MUSIC); //配置当前房间的背景音乐
        } else {
            AudioManager.offMusic();
        }
    },
    //音效
    switchEffect: function (event) {
        if (event.isChecked) {
            AudioManager.onSound();
        } else {
            AudioManager.offSound();
        }
    },
    start() {

    },
    close: function (event, data) {
        cc.dd.UIMgr.destroyUI(this.node);
    },

    // update (dt) {},
});
