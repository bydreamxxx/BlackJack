const HallCommonData = require('hall_common_data').HallCommonData;
var AudioPath = require("jlmj_audio_path");
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var hall_prefab = require('hall_prefab_cfg');
var LoginData = require('jlmj_login_data');
const AppCfg = cc.dd.AppCfg;
var Platform = require('Platform');
var _storagePath = null;

cc.Class({
    extends: cc.Component,

    properties: {
        musicBtn: cc.Toggle,
        soundBtn: cc.Toggle,

        // musicOpenTagLable:cc.Label,
        // soundOpenTagLable:cc.Label,
        //
        // musicTagBtn:cc.Node,
        // soundTagBtn:cc.Node,
        //
        // musicLablePosX:0,
        // musicLablePosY: 0,
        //
        // musicBtnOffPosx:0,
        // musicBtnOnPosx :0,
        //
        // soundLablePosX : 0,
        // soundLablePosY: 0,
        //
        // soundBtnOffPosx: 0,
        // soundBtnOnPosx : 0,

        m_bSoundSwitch: true,
        m_bMusicSwitch: true,
        // uiAtals: cc.SpriteAtlas,

        headNode: cc.Node,       //头像

        uploadLog: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this.uploadLog.active = cc.sys.OS_ANDROID == cc.sys.os && !cc._isHuaweiGame;

        let userInfo = HallCommonData.getInstance();
        this.headNode.getComponent('klb_hall_Player_Head').initHead(userInfo.openId, userInfo.headUrl);

        this.init = true;

        this.soundBtn.node.on('click', this.onClickToggle.bind(this), this);
        this.musicBtn.node.on('click', this.onClickToggle.bind(this), this);

        // this.uiAtals = cc.loader.getRes("blackjack_hall/atals/setting", cc.SpriteAtlas);

        //初始值
        //音效
        this.m_bSoundSwitch = AudioManager._getLocalSoundSwitch();
        // var pos = this.soundOpenTagLable.node.getPosition();
        // this.soundLablePosX = pos.x;
        // this.soundLablePosY = pos.y;

        // this.soundBtnOnPosx = this.soundTagBtn.getPositionX();
        // this.musicBtnOnPosx = this.soundBtnOnPosx
        //音乐
        this.m_bMusicSwitch = AudioManager._getLocalMusicSwitch();
        // pos = this.musicOpenTagLable.node.getPosition();
        // this.musicLablePosX = pos.x;
        // this.musicLablePosY = pos.y;
        //
        // this.musicBtnOffPosx = this.musicTagBtn.getPositionX();
        // this.soundBtnOffPosx = this.musicBtnOffPosx;
        //
        // this.settingEffectBg = this.soundBtn.getComponent(cc.Sprite);
        // this.settingMusicBg = this.musicBtn.getComponent(cc.Sprite);

        //音效
        if (this.m_bSoundSwitch)//on
        {
            // this.settingEffectBg.spriteFrame = this.uiAtals.getSpriteFrame("shezhikaiqi");
            //
            // this.soundOpenTagLable.node.setPosition(cc.v2(this.musicLablePosX ,this.soundLablePosY));
            // this.soundTagBtn.setPositionX(this.soundBtnOffPosx )
            // this.soundOpenTagLable.string = '开'
            this.soundBtn.check();
        } else {
            // this.settingEffectBg.spriteFrame = this.uiAtals.getSpriteFrame("shezhihui");
            //
            // this.soundOpenTagLable.node.setPosition(cc.v2(this.soundLablePosX,this.soundLablePosY));
            // this.soundTagBtn.setPositionX(this.soundBtnOnPosx)
            // this.soundOpenTagLable.string = '关'
            this.soundBtn.uncheck();
        }
        //音乐
        if (this.m_bMusicSwitch)//on
        {
            // this.settingMusicBg.spriteFrame = this.uiAtals.getSpriteFrame("shezhikaiqi");
            //
            // this.musicOpenTagLable.node.setPosition(cc.v2(this.musicLablePosX ,this.musicLablePosY));
            // this.musicTagBtn.setPositionX(this.musicBtnOffPosx )
            // this.musicOpenTagLable.string = '开'
            this.musicBtn.check();
        } else {
            // this.settingMusicBg.spriteFrame = this.uiAtals.getSpriteFrame("shezhihui");
            //
            // this.musicOpenTagLable.node.setPosition(cc.v2(this.soundLablePosX,this.musicLablePosY));
            // this.musicTagBtn.setPositionX(this.musicBtnOnPosx)
            // this.musicOpenTagLable.string = '关'
            this.musicBtn.uncheck();
        }

        if (cc._applyForPayment) {
            cc.find('actNode/serviceButton', this.node).active = false;
        }

        if (cc._isHuaweiGame) {
            cc.find('actNode/feedbackButton', this.node).active = false;
            cc.find('actNode/serviceButton', this.node).active = false;
            // if (cc._lianyunID != 'xiaomi')
            //     cc.find('actNode/kefu', this.node).active = true;
        }
    },
    onDestroy: function () {
    },

    onClickToggle() {
        hall_audio_mgr.com_btn_click();
    },

    /**
     * 音乐开关设置
     */
    switchMusic: function (event) {
        if (event.isChecked) {
            AudioManager._setLocalMusicSwitch(true);
            if (this.init) {
                this.init = false;
            } else {
                AudioManager.playMusic('blackjack_hall/audios/hall_bg');
            }
        } else {
            AudioManager.offMusic();
        }

        // this.m_bMusicSwitch = AudioManager._getLocalMusicSwitch();
        //
        // if(!this.m_bMusicSwitch)//需要打开
        // {
        //     hall_audio_mgr.com_btn_click();
        //     this.settingMusicBg.spriteFrame = this.uiAtals.getSpriteFrame("shezhikaiqi");
        //
        //     this.musicOpenTagLable.node.setPosition(cc.v2(this.musicLablePosX ,this.musicLablePosY));
        //     this.musicTagBtn.setPositionX(this.musicBtnOffPosx )
        //     this.musicOpenTagLable.string = '开'
        //     AudioManager._setLocalMusicSwitch(true);
        //     AudioManager.playMusic('blackjack_hall/audios/hall_bg');
        // }else
        // {
        //     this.settingMusicBg.spriteFrame = this.uiAtals.getSpriteFrame("shezhihui");
        //
        //     this.musicOpenTagLable.node.setPosition(cc.v2(this.soundLablePosX,this.musicLablePosY));
        //     this.musicTagBtn.setPositionX(this.musicBtnOnPosx)
        //     this.musicOpenTagLable.string = '关'
        //     AudioManager.offMusic();
        // }
    },

    /**
     * 音效开关设置
     */
    switchEffect: function (event) {
        if (event.isChecked) {
            AudioManager.onSound();
            // AudioManager.playSound( AudioPath.Sound_ClickedButton );
        } else {
            AudioManager.offSound();
        }

        // this.m_bSoundSwitch = AudioManager._getLocalSoundSwitch();
        //
        // if(!this.m_bSoundSwitch)//需要打开
        // {
        //     hall_audio_mgr.com_btn_click();
        //     this.settingEffectBg.spriteFrame = this.uiAtals.getSpriteFrame("shezhikaiqi");
        //
        //     this.soundOpenTagLable.node.setPosition(cc.v2(this.musicLablePosX ,this.soundLablePosY));
        //     this.soundTagBtn.setPositionX(this.soundBtnOffPosx )
        //     this.soundOpenTagLable.string = '开'
        //
        //     AudioManager.onSound();
        //     AudioManager.playSound( AudioPath.Sound_ClickedButton );
        //
        // }else
        // {
        //     this.settingEffectBg.spriteFrame = this.uiAtals.getSpriteFrame("shezhihui");
        //
        //     this.soundOpenTagLable.node.setPosition(cc.v2(this.soundLablePosX,this.soundLablePosY));
        //     this.soundTagBtn.setPositionX(this.soundBtnOnPosx)
        //     this.soundOpenTagLable.string = '关'
        //
        //     AudioManager.offSound();
        //
        // }

    },

    /**
     * 关闭设置界面
     */
    closeBtnCallBack: function (event, data) {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    onClickBtnCallBack: function (event, data) {
        hall_audio_mgr.com_btn_click();

        switch (data) {
            case 'NOTICE'://公告
                /************************游戏统计 start************************/
                cc.dd.Utils.sendClientAction(cc.dd.clientAction.HALL, cc.dd.clientAction.T_HALL.NOTICE);
                /************************游戏统计   end************************/
                cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_STATEMENT, function (prefab) {
                });
                break;
            case 'KEFU'://客服
                if (cc._chifengGame) {
                    cc.dd.UIMgr.openUI(hall_prefab.CHIFENG_KEFU);
                } else {
                    // cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_KEFU, function (prefab) {
                    //     prefab.getComponent('klbj_hall_KeFu').getKefuDetailInfo();
                    // });
                    let Platform = require('Platform');
                    let AppCfg = require('AppConfig');
                    cc.dd.native_systool.OpenUrl(Platform.kefuUrl[AppCfg.PID] + "?user_id=" + cc.dd.user.id);
                }
                break;
            case 'CHANGE'://切换账号
                /************************游戏统计 start************************/
                cc.dd.Utils.sendClientAction(cc.dd.clientAction.HALL, cc.dd.clientAction.T_HALL.SWITCH_USER);
                /************************游戏统计   end************************/
                if (cc.sys.platform == cc.sys.MOBILE_BROWSER) {
                    wx.closeWindow();
                    return;
                }
                LoginData.Instance().saveRefreshToken('');
                cc.dd.SceneManager.enterLoginScene();
                break;
            case 'RULE':
                /************************游戏统计 start************************/
                cc.dd.Utils.sendClientAction(cc.dd.clientAction.HALL, cc.dd.clientAction.T_HALL.GAME_RULE);
                /************************游戏统计   end************************/
                cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_RULE, function (ui) {
                    //ui.getComponent('klb_hall_Rule').InitGameList();
                }.bind(this));
                break;
            case 'FEEDBACK'://反馈
                if (cc._useCardUI) {
                    cc.dd.PromptBoxUtil.show('NOT YET OPEN');
                } else {
                    cc.dd.UIMgr.openUI(hall_prefab.FEEDBACK);
                }
                break;
            default:
                break;
        }
        cc.dd.UIMgr.destroyUI(this.node);
    },

    onClickUploadLog() {
        hall_audio_mgr.com_btn_click();
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            cc.log(cc.dd.user.id + "设置里上传日志");

            if (!_storagePath)
                _storagePath = jsb.reflection.callStaticMethod("game/SystemTool", "getInnerSDCardPath", "()Ljava/lang/String;");
            var filePath = _storagePath + "/xlqp_log.txt";
            if (jsb.fileUtils.isFileExist(filePath)) {
                cc.dd.SysTools.uploadLog(jsb.fileUtils.getDataFromFile(filePath), Platform.uploadLogUrl[AppCfg.PID]);
            }
        }
    },

    onClickCopy(event, custom) {
        var str = cc.find('actNode/kefu/wechat', this.node).getComponent(cc.Label).string;
        cc.dd.native_systool.SetClipBoardContent(str);
        cc.dd.PromptBoxUtil.show("复制成功");
    },
});
