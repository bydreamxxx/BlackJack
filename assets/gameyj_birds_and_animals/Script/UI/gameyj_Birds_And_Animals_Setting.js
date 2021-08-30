//create by wj 2019/08/19
const gameAudioPath = require('birds_and_animals_config').AuditoPath;
var game_Data = require('birds_and_animals_data').Birds_And_Animals_Data.Instance();

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
            var gameState = game_Data.getGameState();//游戏整体状态
            if (gameState == 2) {
                if (AudioManager._getLocalMusicSwitch())
                    AudioManager.playMusic(gameAudioPath + 'begame_WaitBGM');
            } else {
                if (AudioManager._getLocalMusicSwitch())
                    AudioManager.playMusic(gameAudioPath + 'begame_background');

            }

            //AudioManager.playMusic(PK_Config.AuditoPath + 'PK_bg');
        } else {
            this.m_oMusicBtn.spriteFrame = this.m_tBtnSpirte[1];
            AudioManager.offMusic();
        }
    },

    close: function (event, data) {
        cc.dd.UIMgr.destroyUI(this.node);

    },

});
