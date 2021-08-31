
//create by wj 2019/08/19
const FishType = require('DoyenFishType');
var gFishMgr = require('FishDoyenManager').FishManager.Instance();
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
            this.m_oSoundBtn.spriteFrame = this.m_tBtnSpirte[1]
            this.m_oSoundBtn.node.children[0].x = 50;
        } else {
            this.m_oSoundBtn.spriteFrame = this.m_tBtnSpirte[0]
            this.m_oSoundBtn.node.children[0].x = -62;
        }
        //音乐
        if (this.m_bMusicSwitch)//on
        {
            this.m_oMusicBtn.spriteFrame = this.m_tBtnSpirte[1]
            this.m_oMusicBtn.node.children[0].x = 50;
        } else {
            this.m_oMusicBtn.spriteFrame = this.m_tBtnSpirte[0]
            this.m_oMusicBtn.node.children[0].x = -62;
        }
    },

    onClickSound: function (event, data) {
        this.m_bSoundSwitch = !this.m_bSoundSwitch;

        if (this.m_bSoundSwitch)//on
        {
            this.m_oSoundBtn.spriteFrame = this.m_tBtnSpirte[1];
            AudioManager.onSound();
            this.m_oSoundBtn.node.children[0].x = 50;
        } else {
            this.m_oSoundBtn.spriteFrame = this.m_tBtnSpirte[0];
            AudioManager.offSound();
            this.m_oSoundBtn.node.children[0].x = -62;
        }
    },

    onClickMusic: function (event, data) {
        this.m_bMusicSwitch = !this.m_bMusicSwitch;
        if (this.m_bMusicSwitch)//on
        {
            this.m_oMusicBtn.spriteFrame = this.m_tBtnSpirte[1];
            AudioManager._setLocalMusicSwitch(true);
            // if(AudioManager._getLocalMusicSwitch()){
            //     AudioManager.playMusic(FishType.fishAuidoPath + '7001');
            // }
            gFishMgr.playBGMusic()
            this.m_oMusicBtn.node.children[0].x = 50;
        } else {
            this.m_oMusicBtn.spriteFrame = this.m_tBtnSpirte[0];
            AudioManager.offMusic();
            this.m_oMusicBtn.node.children[0].x = -62;
        }
    },

    close: function (event, data) {
        // AudioManager.playSound(FishType.fishAuidoPath +  '7002', false);
        cc.dd.UIMgr.destroyUI(this.node);

    },

});
