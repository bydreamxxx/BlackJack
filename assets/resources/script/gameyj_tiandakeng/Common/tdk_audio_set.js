
var AudioPath = require( "jlmj_audio_path" );
var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        musicBtn:cc.Node,
        soundBtn:cc.Node,

        musicOpenTagLable:cc.Label,
        soundOpenTagLable:cc.Label,

        musicTagBtn:cc.Node,
        soundTagBtn:cc.Node,

        musicLablePosX:0,
        musicLablePosY: 0, 

        musicBtnOffPosx:0,
        musicBtnOnPosx :0,

        soundLablePosX : 0,
        soundLablePosY: 0,

        soundBtnOffPosx: 0,
        soundBtnOnPosx : 0,

        m_bSoundSwitch: true,
        m_bMusicSwitch: true,
    },

    // use this for initialization
    onLoad: function () {

        this.uiAtals = cc.resources.get(cc.dd.tdk_resCfg.ATLASS.ATS_SETTING, cc.SpriteAtlas);

        //初始值
        //音效
        this.m_bSoundSwitch = AudioManager._getLocalSoundSwitch();
        var pos = this.soundOpenTagLable.node.getPosition();
        this.soundLablePosX = pos.x;
        this.soundLablePosY = pos.y;
        
        this.soundBtnOnPosx = this.soundTagBtn.x;
        this.musicBtnOnPosx = this.soundBtnOnPosx
        //音乐
        this.m_bMusicSwitch = AudioManager._getLocalMusicSwitch();
        pos = this.musicOpenTagLable.node.getPosition();
        this.musicLablePosX = pos.x;
        this.musicLablePosY = pos.y;

        this.musicBtnOffPosx = this.musicTagBtn.x;
        this.soundBtnOffPosx = this.musicBtnOffPosx;

        this.settingEffectBg = this.soundBtn.getComponent(cc.Sprite);
        this.settingMusicBg = this.musicBtn.getComponent(cc.Sprite);

        //音效
        if(this.m_bSoundSwitch)//on
        {
            this.settingEffectBg.spriteFrame = this.uiAtals.getSpriteFrame("tanchukai");
            this.soundTagBtn.getComponent(cc.Sprite).spriteFrame = this.uiAtals.getSpriteFrame("danxuananniukai");
            this.soundOpenTagLable.node.setPosition(cc.v2(this.soundLablePosX, this.soundLablePosY));
            this.soundTagBtn.x = this.soundBtnOnPosx
            this.soundOpenTagLable.string = '开'
        }else
        {
            this.settingEffectBg.spriteFrame = this.uiAtals.getSpriteFrame("tanchuguan");
            this.soundTagBtn.getComponent(cc.Sprite).spriteFrame = this.uiAtals.getSpriteFrame("danxuananniuguan");
            this.soundOpenTagLable.node.setPosition(cc.v2(this.musicLablePosX, this.soundLablePosY));
            this.soundTagBtn.x = this.soundBtnOffPosx
            this.soundOpenTagLable.string = '关'
        }
        //音乐
        if(this.m_bMusicSwitch)//on
        {
            this.settingMusicBg.spriteFrame = this.uiAtals.getSpriteFrame("tanchukai");
            this.musicTagBtn.getComponent(cc.Sprite).spriteFrame = this.uiAtals.getSpriteFrame("danxuananniukai");
            this.musicOpenTagLable.node.setPosition(cc.v2(this.soundLablePosX, this.musicLablePosY));
            this.musicTagBtn.x = this.musicBtnOnPosx
            this.musicOpenTagLable.string = '开'
        }else
        {
            this.settingMusicBg.spriteFrame = this.uiAtals.getSpriteFrame("tanchuguan");
            this.musicTagBtn.getComponent(cc.Sprite).spriteFrame = this.uiAtals.getSpriteFrame("danxuananniuguan");
            this.musicOpenTagLable.node.setPosition(cc.v2(this.musicLablePosX, this.musicLablePosY));
            this.musicTagBtn.x = this.musicBtnOffPosx
            this.musicOpenTagLable.string = '关'
        }
    },
    onDestroy: function () {
    },

    /**
     * 音乐开关设置
     */
    switchMusic: function(){
        this.m_bMusicSwitch = AudioManager._getLocalMusicSwitch();
        
        if(!this.m_bMusicSwitch)//需要打开
        {
            hall_audio_mgr.com_btn_click();
            this.settingMusicBg.spriteFrame = this.uiAtals.getSpriteFrame("tanchukai");
            this.musicTagBtn.getComponent(cc.Sprite).spriteFrame = this.uiAtals.getSpriteFrame("danxuananniukai");
            this.musicOpenTagLable.node.setPosition(cc.v2(this.soundLablePosX, this.musicLablePosY));
            this.musicTagBtn.x = this.musicBtnOnPosx
            this.musicOpenTagLable.string = '开'
            AudioManager._setLocalMusicSwitch(true);
        }else
        {
            this.settingMusicBg.spriteFrame = this.uiAtals.getSpriteFrame("tanchuguan");
            this.musicTagBtn.getComponent(cc.Sprite).spriteFrame = this.uiAtals.getSpriteFrame("danxuananniuguan");
            this.musicOpenTagLable.node.setPosition(cc.v2(this.musicLablePosX, this.musicLablePosY));
            this.musicTagBtn.x = this.musicBtnOffPosx
            this.musicOpenTagLable.string = '关'
            AudioManager.offMusic();
        }
    },

    /**
     * 音效开关设置
     */
    switchEffect:function(){
        this.m_bSoundSwitch = AudioManager._getLocalSoundSwitch();
        
        if(!this.m_bSoundSwitch)//需要打开
        {
            hall_audio_mgr.com_btn_click();
            this.settingEffectBg.spriteFrame = this.uiAtals.getSpriteFrame("tanchukai");
            this.soundTagBtn.getComponent(cc.Sprite).spriteFrame = this.uiAtals.getSpriteFrame("danxuananniukai");
            this.soundOpenTagLable.node.setPosition(cc.v2(this.soundLablePosX, this.soundLablePosY));
            this.soundTagBtn.x = this.soundBtnOnPosx
            this.soundOpenTagLable.string = '开'

            AudioManager.onSound();
            AudioManager.playSound( AudioPath.Sound_ClickedButton );

        }else
        {
            this.settingEffectBg.spriteFrame = this.uiAtals.getSpriteFrame("tanchuguan");
            this.soundTagBtn.getComponent(cc.Sprite).spriteFrame = this.uiAtals.getSpriteFrame("danxuananniuguan");
            this.soundOpenTagLable.node.setPosition(cc.v2(this.musicLablePosX, this.soundLablePosY));
            this.soundTagBtn.x = this.soundBtnOffPosx
            this.soundOpenTagLable.string = '关'

            AudioManager.offSound();
            
        }

    },

    /**
     * 关闭设置界面
     */
    closeBtnCallBack:function (event, data) {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

});
