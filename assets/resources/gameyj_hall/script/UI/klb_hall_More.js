var hall_prefab = require('hall_prefab_cfg');
var LoginData = require('jlmj_login_data');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var AppConfig = require('AppConfig');
const Hall = require('jlmj_halldata');
cc.Class({
    extends: cc.Component,

    properties: {
        moreNode: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        switch (AppConfig.GAME_PID) {
            case 2: //快乐吧长春麻将
            case 3: //快乐吧农安麻将
            case 4:  //快乐吧填大坑
            case 5:  //快乐吧牛牛
                cc.find('nodeact/recordBtn', this.node).active = false;
                break;
            default:
                break;
        }
    },

    onClickBtnCallBack: function (event, data) {
        switch (data) {
            case 'SETTING'://设置
                /************************游戏统计 start************************/
                cc.dd.Utils.sendClientAction(cc.dd.clientAction.HALL, cc.dd.clientAction.T_HALL.SETTING);
                /************************游戏统计   end************************/
                hall_audio_mgr.com_btn_click();
                if(cc._chifengGame){
                    cc.dd.UIMgr.openUI(hall_prefab.CHIFENG_SETTING);
                }else {
                    cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_SHEZHI);
                }
                break;
            case 'NOTICE'://公告
                /************************游戏统计 start************************/
                cc.dd.Utils.sendClientAction(cc.dd.clientAction.HALL, cc.dd.clientAction.T_HALL.NOTICE);
                /************************游戏统计   end************************/
                hall_audio_mgr.com_btn_click();
                cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_STATEMENT, function (prefab) {
                });
                break;
            case 'KEFU'://客服
                hall_audio_mgr.com_btn_click();
                if(cc._chifengGame){
                    cc.dd.UIMgr.openUI(hall_prefab.CHIFENG_KEFU);
                }else{
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
                hall_audio_mgr.com_btn_click();
                if (cc.sys.platform == cc.sys.MOBILE_BROWSER) {
                    wx.closeWindow();
                    return;
                }
                LoginData.Instance().saveRefreshToken('');
                cc.dd.SceneManager.enterLoginScene();
                break;
            case 'BAG'://背包
                hall_audio_mgr.com_btn_click();
                cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_BAG, function (ui) {
                    //ui.getComponent('klb_hall_BagUI').updateBagUI();
                }.bind(this));
                break;
            case 'SHOP'://商城
                if (!cc._is_shop)
                    return;
                cc.dd.UIMgr.openUI(hall_prefab.KLB_SHOP_LAYER, function (ui) {
                    ui.getComponent('klb_hall_ShopLayer').gotoPage('ZS');
                    //ui.zIndex = 5000;
                }.bind(this));
                break;
            case 'LUCKBAG'://福袋
                // cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_SIGN, function (node) {
                //     node.getComponent('klb_hall_weekSign').init(Hall.HallData.Instance().sign_data);
                // });
                cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_WELFAREBAG);
                //hall_audio_mgr.com_btn_click();
                break;
            case 'ZHANJI':
                /************************游戏统计 start************************/
                cc.dd.Utils.sendClientAction(cc.dd.clientAction.HALL, cc.dd.clientAction.T_HALL.RECORD);
                /************************游戏统计   end************************/
                cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_BATTLE_HISTORY, function (ui) {
                    ui.getComponent('klb_hall_Battle_History').send(0);
                });
                break;
            case 'RULE':
                /************************游戏统计 start************************/
                cc.dd.Utils.sendClientAction(cc.dd.clientAction.HALL, cc.dd.clientAction.T_HALL.GAME_RULE);
                /************************游戏统计   end************************/
                cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_RULE, function (ui) {
                    //ui.getComponent('klb_hall_Rule').InitGameList();
                }.bind(this));
                break;
            default:
                break;
        };

        this.closeMoreCallFunc();
    },

    //关闭界面
    closeUICallBack: function () {
        cc.dd.UIMgr.destroyUI(this.node);
    },

    closeMoreCallFunc: function () {
        // var ani = this.moreNode.getChildByName('ScrollView').getChildByName('view').getComponent(cc.Animation);
        // ani.off('stop', this.closeMoreCallFunc, this);
        // this.moreNode.active = false;
        cc.dd.UIMgr.destroyUI(this.node);
    },

    playOpenAni: function () {
        this.moreNode.active = true;
        var ani = this.moreNode.getComponent(cc.Animation);
        ani.play('klb_hall_more_show');
    },

});
