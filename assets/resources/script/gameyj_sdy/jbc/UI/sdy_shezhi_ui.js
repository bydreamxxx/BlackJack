var audio = require('sdy_audio');

cc.Class({
    extends: cc.Component,

    properties: {
        sp_music_bar: cc.Sprite,
        sp_music_bg: cc.Sprite,
        sp_sound_bar: cc.Sprite,
        sp_sound_bg: cc.Sprite,
        txt_music: cc.Label,
        txt_sound: cc.Label,
        sp_open_bar: cc.SpriteFrame,
        sp_open_bg: cc.SpriteFrame,
        sp_close_bar: cc.SpriteFrame,
        sp_close_bg: cc.SpriteFrame,
        open_x: 0.0,
        close_x: 0.0,
    },

    onLoad: function () {
        this.setMusicUI(AudioManager.m_bMusicSwitch);
        this.setSoundUI(AudioManager.m_bSoundSwitch);
    },

    onClickClose: function () {
        audio.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    onClickMusic: function () {
        audio.com_btn_click();
        if(AudioManager.m_bMusicSwitch){
            AudioManager.offMusic();
        }else{
            AudioManager.onMusicSwitch();
        }
        this.setMusicUI(AudioManager.m_bMusicSwitch);
    },

    onClickSound: function () {
        audio.com_btn_click();
        if(AudioManager.m_bSoundSwitch){
            AudioManager.offSound();
        }else{
            AudioManager.onSound();
        }
        this.setSoundUI(AudioManager.m_bSoundSwitch);
    },

    setMusicUI: function (on) {
        if(on){
            this.sp_music_bar.spriteFrame = this.sp_open_bar;
            this.sp_music_bg.spriteFrame = this.sp_open_bg;
            this.sp_music_bar.node.x = this.open_x;
            this.txt_music.string = "开";
            this.txt_music.node.x = -24.0;
        }else{
            this.sp_music_bar.spriteFrame = this.sp_close_bar;
            this.sp_music_bg.spriteFrame = this.sp_close_bg;
            this.sp_music_bar.node.x = this.close_x;
            this.txt_music.string = "关";
            this.txt_music.node.x = 24.0;
        }
    },

    setSoundUI: function (on) {
        if(on){
            this.sp_sound_bar.spriteFrame = this.sp_open_bar;
            this.sp_sound_bg.spriteFrame = this.sp_open_bg;
            this.sp_sound_bar.node.x = this.open_x;
            this.txt_sound.string = "开";
            this.txt_sound.node.x = -24.0;
        }else{
            this.sp_sound_bar.spriteFrame = this.sp_close_bar;
            this.sp_sound_bg.spriteFrame = this.sp_close_bg;
            this.sp_sound_bar.node.x = this.close_x;
            this.txt_sound.string = "关";
            this.txt_sound.node.x = 24.0;
        }
    },

});
