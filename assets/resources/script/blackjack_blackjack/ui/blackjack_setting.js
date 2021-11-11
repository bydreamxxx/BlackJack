var AudioManager = require('AudioManager');
var LoginData = require('jlmj_login_data');
var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        musicSlider: cc.Slider,
        musicProgerss: cc.ProgressBar,
        soundSlider: cc.Slider,
        soundProgress: cc.ProgressBar,
        kefuBtn:cc.Node,
        loginOutBtn:cc.Node,

        languageNode: cc.Node,
        languageArrow: cc.Node,
    },

    editor:{
        menu:"BlackJack/blackjack_setting"
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var musicVolume = AudioManager.getInstance().m_nMusicVolume;
        var soundVolume = AudioManager.getInstance().m_nSoundVolume;
        this.musicSlider.progress = musicVolume;
        this.musicProgerss.progress = musicVolume;
        this.soundSlider.progress = soundVolume;
        this.soundProgress.progress = soundVolume;
    },

    start() {

    },

    sliderMusic(event, data) {
        this.musicProgerss.progress = event.progress;
        AudioManager.getInstance().m_nMusicVolume = event.progress;
    },

    sliderSound(event, custom) {
        this.soundProgress.progress = event.progress;
        AudioManager.getInstance().m_nSoundVolume = event.progress;
    },

    closeBtn() {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    showBtn(isShow){
        this.kefuBtn.active = isShow;
        this.loginOutBtn.active = isShow;
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
                cc.dd.PromptBoxUtil.show('lingquchenggong');
                return;
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
                    cc.dd.PromptBoxUtil.show('notopen');
                } else {
                    cc.dd.UIMgr.openUI(hall_prefab.FEEDBACK);
                }
                break;
            default:
                break;
        }
        cc.dd.UIMgr.destroyUI(this.node);
    },

    onClickChangeLanguage(event, data) {
        switch (data){
            case "EN":
                LanguageMgr.changeLanguage("en");
                break;
            case "TC":
                LanguageMgr.changeLanguage("tc");
                break;
            case "IN":
                LanguageMgr.changeLanguage("in");
                break;
            case "ZH":
                LanguageMgr.changeLanguage("zh");
                break;
        }

        this.languageNode.active = false;
        this.languageArrow.scaleY = 1;
    },

    onClickChange(){
        if(this.languageNode.active){
            this.languageNode.active = false;
            this.languageArrow.scaleY = 1;
        }else{
            this.languageNode.active = true;
            this.languageArrow.scaleY = -1;
        }

    }
});
