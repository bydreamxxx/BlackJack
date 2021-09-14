var klb_hallScene = require("klb_hallScene");
var Define = require('Define');
var hall_prefab = require('hall_prefab_cfg');
var klb_game_list_config = require('klb_gameList');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var AppConfig = require('AppConfig');
var game_duli = require('game_duli');
var UpdateMgr = require("updaterMgr").UpdateMgr.Instance();
let UpdaterEntrance = require("Updater").UpdaterEntrance;
const Hall = require('jlmj_halldata');
var hallData = require('hall_common_data').HallCommonData;

const dd = cc.dd;
var gamedl_hall = cc.Class({
    extends: klb_hallScene,
    properties: {
        matchButtonNode: cc.Node,
        goldButtonNode: cc.Node,
    },

    onLoad: function () {
        this.initDLUI();
        Hall.HallED.addObserver(this);
    },

    start() {
        this._super();
        this.updater_entrance = UpdaterEntrance.COIN;
        let com_game_download = this.node.getComponentInChildren('com_game_update');
        if (com_game_download) {
            com_game_download.updater_entrance = this.updater_entrance;
            com_game_download.node.active = true;
            com_game_download.updateUI(false);
        }

        let btn = cc.find('Canvas/gamedl_hall_mainui_userInfo/topNode/qiandao');
        if(btn){
            btn.active = Hall.HallData.Instance().sign_data != null;
        }

        this.showDLActive();
    },

    showDLActive(){
        if(!cc._showActivity){
            cc._showActivity = true;

            cc.dd.UIMgr.openUI('gamedl_majiang/prefabs/klb_dl_hall_spring_festival_activity', (ui)=>{
                ui.getComponent('klb_dl_hall_spring_festival_activity').setCloseFunc(()=>{
                    this.showActive();
                })
            });
        }else{
            this.showActive();
        }
    },

    /**
     * 独立游戏初始化
     */
    initDLUI: function () {
        var shopNode = cc.find('gamedl_hall_mainui_userInfo/downNode/shopBtn', this.node);
        if (shopNode && cc._androidstore_check) {
            shopNode.active = false;
        }

        var jbNode = cc.find('datingLayer/leftBack/jinbiBtn', this.node).getComponent(cc.Sprite);
        var cjNode = cc.find('datingLayer/leftBack/createRoomBtn', this.node).getComponent(cc.Sprite);
        var joinNode = cc.find('datingLayer/leftBack/joinRoomBtn', this.node).getComponent(cc.Sprite);
        var clubNode = cc.find('datingLayer/leftBack/clubBtn', this.node).getComponent(cc.Sprite);
        var genduoNode = cc.find('datingLayer/leftBack/gegnduoBtn', this.node).getComponent(cc.Sprite);
        var cofnig = game_duli.getItem(function (cfg) {
            if (cfg.pID == AppConfig.GAME_PID && AppConfig.GAME_PID != 2)
                return cfg;
        }.bind(this));
        if (!cofnig) return;
        if (jbNode)
            jbNode.spriteFrame = new cc.SpriteFrame(cc.url.raw('resources/' + cofnig.gamedl_hall_jinbi));
        if (cjNode)
            cjNode.spriteFrame = new cc.SpriteFrame(cc.url.raw('resources/' + cofnig.gamedl_hall_cf));
        if (joinNode)
            joinNode.spriteFrame = new cc.SpriteFrame(cc.url.raw('resources/' + cofnig.gamedl_hall_jf));
        if (clubNode)
            clubNode.spriteFrame = new cc.SpriteFrame(cc.url.raw('resources/' + cofnig.gamedl_hall_jl));
        if (genduoNode)
            genduoNode.spriteFrame = new cc.SpriteFrame(cc.url.raw('resources/' + cofnig.gamedl_hall_gd));

    },

    /**
     * 设置玩家信息
     */
    setUserInfo: function (userData) {
        let user3 = cc.find('Canvas/gamedl_hall_mainui_userInfo');
        if (user3) {
            var info = user3.getComponent('klb_hall_UserInfo');
            if (info) {
                info.setData(userData);
            }
        }

        cc.dd.native_systool.getNativeScheme();
    },

    onDestroy: function () {
        this._super();
    },

    /**
     * 分享
     */
    onClickFenxiang: function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_SHARE, function (ui) {
            var share_ui = ui.getComponent('klb_hall_share');
            if (share_ui != null) {
                var cofnig = game_duli.getItem(function (cfg) {
                    if (cfg.pID == AppConfig.GAME_PID)
                        return cfg;
                }.bind(this));
                if (!cofnig) return;
                var cfg = klb_game_list_config.getItem(function (item) {
                    return item.gameid == cofnig.gameid;
                }.bind(this));
                if (cfg == null) {
                    cc.error("klb_gamelist表未配置该游戏");
                    return;
                }
                else {
                    var title = '【' + cfg.name + '】';
                    var content = '绿色安全无外挂,约局打牌不等待!地道的游戏玩法,心动的你还不来吗?';
                    share_ui.setShareData(title, content);
                    share_ui.setFirstShare();
                }
            }
        }.bind(this));
    },

    /**
     * 更多
     */
    onClickgengduo: function () {
        hall_audio_mgr.com_btn_click();
        var url = 'https://www.yuejiegame.com/';
        cc.dd.native_systool.OpenUrl(url);
    },

    /**
     * 金币场
     */
    onClickJinBi: function () {
        hall_audio_mgr.com_btn_click();
        var config = game_duli.getItem(function (cfg) {
            if (cfg.pID == AppConfig.GAME_PID)
                return cfg;
        }.bind(this));
        if (!config) return;
        this.gameType = config.gameid;
        this.updater = UpdateMgr.getUpdater(this.gameType);
        if (cc.sys.isNative && this.updater) {
            if (this.updater.updateing) {
                cc.dd.PromptBoxUtil.show('游戏正在下载中,请稍等!');
                return;
            }
            if (this.updater.checking) {
                cc.log("正在检测更新中");
                return;
            }
            //设置游戏更新完成回调,游戏更新id
            let com_game_download = this.node.getComponentInChildren('com_game_update');
            com_game_download.updater_entrance = this.updater_entrance;
            this.updater.cfg.game_id = this.gameType;
            com_game_download.setUpdateFinishCallback(this.getRoomList.bind(this));
            com_game_download.setGameId(this.gameType);
            this.updater.checkUpdate(this.updater_entrance);
        } else {
            this.getRoomList();
        }
    },

    onClickMatch() {
        hall_audio_mgr.com_btn_click();

        let callback = ()=>{
            cc.dd.quickMatchType = 'ccmj_bi_sai_chang';
            cc.dd.UIMgr.openUI(hall_prefab.KLB_Match, function (node) {
                node.getComponent('klb_hall_Match').sendGetMatch(1);
            }.bind(this));
        }

        var config = game_duli.getItem(function (cfg) {
            if (cfg.pID == AppConfig.GAME_PID)
                return cfg;
        }.bind(this));
        if (!config) return;
        this.gameType = config.gameid;
        this.updater = UpdateMgr.getUpdater(this.gameType);
        if (cc.sys.isNative && this.updater) {
            if (this.updater.updateing) {
                cc.dd.PromptBoxUtil.show('游戏正在下载中,请稍等!');
                return;
            }
            if (this.updater.checking) {
                cc.log("正在检测更新中");
                return;
            }
            //设置游戏更新完成回调,游戏更新id
            let com_game_download = this.node.getComponentInChildren('com_game_update');
            com_game_download.updater_entrance = this.updater_entrance;
            this.updater.cfg.game_id = this.gameType;
            com_game_download.setUpdateFinishCallback(callback);
            com_game_download.setGameId(this.gameType);
            this.updater.checkUpdate(this.updater_entrance);
        } else {
            callback();
        }
    },

    /**
     * 获取房间列表
     */
    getRoomList: function () {
        dd.NetWaitUtil.show('正在请求数据');
        var protoNewRoomList = new cc.pb.hall.hall_req_new_room_list();
        var cofnig = game_duli.getItem(function (cfg) {
            if (cfg.pID == AppConfig.GAME_PID)
                return cfg;
        }.bind(this));
        if (!cofnig) return;
        protoNewRoomList.setHallGameid(cofnig.gameid);
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_hall_req_new_room_list, protoNewRoomList,
            '发送协议[id: ${cmd_hall_req_new_room_list}],cmd_hall_req_new_room_list,[房间列表]', true);
    },

    userBtnCallBack: function () {
        if(cc._isBaiDuPingTaiGame || cc._isHuaweiGame){
            hall_audio_mgr.com_btn_click();
            cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_CHANGE_HEAD);
        }
    },

    onClickSign:function(){
        hall_audio_mgr.com_btn_click();

        cc.dd.UIMgr.openUI('gameyj_hall/prefabs/daily_active/klb_hall_daily_active_QD', function (prefab) {
            prefab.getComponent('klb_hall_daily_sign').showClsoeBtn(true);
        });

    },

    onClickSP:function(){
        hall_audio_mgr.com_btn_click();

        cc.dd.UIMgr.openUI('gamedl_majiang/prefabs/klb_dl_hall_spring_festival_activity');
    },

    onClickCoin:function(){
        hall_audio_mgr.com_btn_click();

        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_JIUJI, function (ui) {
            var jiuji = ui.getComponent('klb_hall_jiuji');
            if (jiuji != null) {
                jiuji.update_buy_list(2000);
            }
        }.bind(this));
    },
    onEventMessage: function (event, data) {
        switch (event) {
            case Hall.HallEvent.SHOW_DAILY_SIGN:
            case Hall.HallEvent.DAILYSIGN_END:
                let btn = cc.find('Canvas/gamedl_hall_mainui_userInfo/topNode/qiandao');
                if(btn){
                    btn.active = Hall.HallData.Instance().sign_data != null;
                }
                break;
            case Hall.HallEvent.GET_USERINFO:
                this.setUserInfo(hallData.getInstance());
                break;
        }
    }
});
module.exports = gamedl_hall;