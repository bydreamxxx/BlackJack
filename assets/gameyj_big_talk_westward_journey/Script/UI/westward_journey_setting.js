//create by wj 2019/08/19
const gameAudioPath = require('westward_Journey_Config').AuditoPath;
var game_Ed = require('westward_journey_data_mannager').Westward_Journey_Ed;
var game_Event = require('westward_journey_data_mannager').Westward_Journey_Event;

cc.Class({
    extends: cc.Component,

    properties: {
        m_bSoundSwitch: true,
        m_bMusicSwitch: true,
        m_bChipSwitch: true,

        m_tBtnSpirte: { default: [], type: cc.SpriteFrame, tooltip: '' },
        m_oMusicBtn: cc.Sprite,
        m_oSoundBtn: cc.Sprite,
        m_oChipBtn: cc.Sprite,
    },

    onLoad() {
        //初始值
        //音效
        this.m_bSoundSwitch = AudioManager._getLocalSoundSwitch();

        //音乐
        this.m_bMusicSwitch = AudioManager._getLocalMusicSwitch();

        //筹码
        var json = cc.sys.localStorage.getItem('westward_journey_chip');
        if (json) {
            this.m_bChipSwitch = json == 'true' ? true : false;
        } else {
            cc.sys.localStorage.setItem('westward_journey_chip', true);
            this.m_bChipSwitch = true
        }

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

        //筹码
        if (this.m_bChipSwitch)//on
        {
            this.m_oChipBtn.spriteFrame = this.m_tBtnSpirte[0]
        } else {
            this.m_oChipBtn.spriteFrame = this.m_tBtnSpirte[1]
        }
    },

    onClickSound: function (event, data) {
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
        this.m_bMusicSwitch = !this.m_bMusicSwitch;
        if (this.m_bMusicSwitch)//on
        {
            this.m_oMusicBtn.spriteFrame = this.m_tBtnSpirte[0];
            AudioManager._setLocalMusicSwitch(true);
            if (AudioManager._getLocalMusicSwitch())
                this.m_nMusicId = AudioManager.playMusic(gameAudioPath + 'dhxy_bgm');
        } else {
            this.m_oMusicBtn.spriteFrame = this.m_tBtnSpirte[1];
            AudioManager.offMusic();
        }
    },

    onClickChip: function (event, data) {
        this.m_bChipSwitch = !this.m_bChipSwitch;
        if (this.m_bChipSwitch) {
            this.m_oChipBtn.spriteFrame = this.m_tBtnSpirte[0];
        } else {
            this.m_oChipBtn.spriteFrame = this.m_tBtnSpirte[1];
        }
        cc.sys.localStorage.setItem('westward_journey_chip', this.m_bChipSwitch);
        game_Ed.notifyEvent(game_Event.Westward_Journey_CHIP, this.m_bChipSwitch);
    },

    close: function (event, data) {
        cc.dd.UIMgr.destroyUI(this.node);

    },

});
