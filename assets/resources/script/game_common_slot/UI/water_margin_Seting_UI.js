
// var AudioPath = require("jlmj_audio_path");
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var SlotCfg = require('SlotCfg');
var gSlotMgr = require('SlotManger').SlotManger.Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        m_oFastModelSp: cc.Sprite,

        m_bSoundSwitch: true,
        m_bMusicSwitch: true,
        uiAtals: cc.SpriteAtlas,

        musicSlider: {
            default: null,
            type: cc.Slider,
        },

        musicProgress: {
            default: null,
            type: cc.ProgressBar,
        },

        audioSlider: {
            default: null,
            type: cc.Slider,
        },

        audioProgress: {
            default: null,
            type: cc.ProgressBar,
        },
    },

    // use this for initialization
    onLoad: function () {

        // this.uiAtals = cc.loader.getRes("blackjack_hall/atals/setting", cc.SpriteAtlas);

        //初始值
        //音效
        this.m_bSoundSwitch = AudioManager._getLocalSoundSwitch();

        //音乐
        this.m_bMusicSwitch = AudioManager._getLocalMusicSwitch();

        //this.settingEffectBg = this.soundBtn.getComponent(cc.Sprite);
        // this.settingMusicBg = this.musicBtn.getComponent(cc.Sprite);

        // //音效
        // if(this.m_bSoundSwitch)//on
        // {
        //     this.settingEffectBg.spriteFrame = this.uiAtals.getSpriteFrame("shz_btn_music_open");
        // }else
        // {
        //     this.settingEffectBg.spriteFrame = this.uiAtals.getSpriteFrame("shz_btn_music_lose");
        // }
        // //音乐
        // if(this.m_bMusicSwitch)//on
        // {
        //     this.settingMusicBg.spriteFrame = this.uiAtals.getSpriteFrame("shz_btn_music_open");
        // }else
        // {
        //     this.settingMusicBg.spriteFrame = this.uiAtals.getSpriteFrame("shz_btn_music_lose");
        //}

        var json = cc.sys.localStorage.getItem('the_water_margin_soundvol');
        if (json) {
            this.m_nSoundVol = parseFloat(json);
            this.audioProgress.progress = this.m_nSoundVol;
            this.audioSlider.progress = this.m_nSoundVol;
        }

        var json1 = cc.sys.localStorage.getItem('the_water_margin_musicvol');
        if (json1) {
            this.m_nMusicVol = parseFloat(json1);
            this.musicProgress.progress = this.m_nMusicVol;
            this.musicSlider.progress = this.m_nMusicVol;
        }

        if (gSlotMgr.isFastModel())
            this.m_oFastModelSp.spriteFrame = this.uiAtals.getSpriteFrame("shz_btn_music_lose");
        else
            this.m_oFastModelSp.spriteFrame = this.uiAtals.getSpriteFrame("shz_btn_music_open");


        //gSlotMgr.setAudioAndMusicVol(this.m_nMusicVol, this.m_nSoundVol);
    },
    onDestroy: function () {
    },

    /**
     * 特效开关
     */
    switchEffect: function (event, data) {
        gSlotMgr.setIsFastModel();
        if (gSlotMgr.isFastModel())
            this.m_oFastModelSp.spriteFrame = this.uiAtals.getSpriteFrame("shz_btn_music_lose");
        else
            this.m_oFastModelSp.spriteFrame = this.uiAtals.getSpriteFrame("shz_btn_music_open");
    },

    // /**
    //  * 音乐开关设置
    //  */
    // switchMusic: function(){
    //     this.m_bMusicSwitch = AudioManager._getLocalMusicSwitch();

    //     if(!this.m_bMusicSwitch)//需要打开
    //     {
    //         hall_audio_mgr.com_btn_click();
    //         this.settingMusicBg.spriteFrame = this.uiAtals.getSpriteFrame("shz_btn_music_open");
    //         AudioManager._setLocalMusicSwitch(true);
    //         AudioManager.playMusic(SlotCfg.AuditoPath + 'xiongdiwushu');

    //     }else
    //     {
    //         this.settingMusicBg.spriteFrame = this.uiAtals.getSpriteFrame("shz_btn_music_lose");
    //         AudioManager.offMusic();
    //     }
    // },

    // /**
    //  * 音效开关设置
    //  */
    // switchEffect:function(){
    //     this.m_bSoundSwitch = AudioManager._getLocalSoundSwitch();

    //     if(!this.m_bSoundSwitch)//需要打开
    //     {
    //         hall_audio_mgr.com_btn_click();
    //         this.settingEffectBg.spriteFrame = this.uiAtals.getSpriteFrame("shz_btn_music_open");

    //         AudioManager.onSound();
    //        // AudioManager.playSound( AudioPath.Sound_ClickedButton );

    //     }else
    //     {
    //         this.settingEffectBg.spriteFrame = this.uiAtals.getSpriteFrame("shz_btn_music_lose");
    //         AudioManager.offSound();

    //     }

    // },

    //slider滑动
    onSliderMove: function (event, data) {
        var slider = null;
        var progressBar = null;
        if (data == '1') {
            slider = this.audioSlider;
            progressBar = this.audioProgress;
        } else {
            slider = this.musicSlider;
            progressBar = this.musicProgress;
        }
        var progress = slider.progress;

        slider.progress = progress;
        progressBar.progress = progress;
        if (data == '2') {
            if (this.m_bMusicSwitch) {
                AudioManager.onMusicSwitch();
                AudioManager.setMusicVolume(progress);
                cc.sys.localStorage.setItem('the_water_margin_musicvol', progress);
            } else {
                cc.sys.localStorage.setItem('the_water_margin_musicvol', progress);
            }

        }
        else {
            if (this.m_bSoundSwitch) {
                AudioManager.onSound();
                cc.sys.localStorage.setItem('the_water_margin_soundvol', progress);
                AudioManager.setSoundVolume(progress);
            } else
                cc.sys.localStorage.setItem('the_water_margin_soundvol', progress);

            var slotMainUI = gSlotMgr.getSlotMainUI();
            if (slotMainUI) {
                slotMainUI.setOrignSoundVolume();
            }
        }
    },

    /**
     * 关闭设置界面
     */
    closeBtnCallBack: function (event, data) {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

});
