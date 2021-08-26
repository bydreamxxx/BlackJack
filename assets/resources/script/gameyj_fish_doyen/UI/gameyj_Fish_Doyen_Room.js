//create by wj 2019/09/26
var hallData = require('hall_common_data').HallCommonData;
var klb_game_list_config = require('klb_gameList');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var hall_prefab = require('hall_prefab_cfg');
var HallPropData = require('hall_prop_data').HallPropData.getInstance();
var dd = cc.dd;
var RoomED = require("jlmj_room_mgr").RoomED;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;
var AppCfg = require('AppConfig');
var gFishMgr = require('FishDoyenManager').FishManager.Instance();
var Define = require("Define");
let scene_dir_cfg = require('scene_dir_cfg');
var loading_cfg = require('loading_cfg');

cc.Class({
    extends: cc.Component,

    properties: {
        m_tRoomItem: {default: [], type: cc.Node},
        game_name: '',
        game_id: '',
    },

     onLoad: function () {
        RoomED.addObserver(this);
     },

     start: function () {//因为需要 获取玩家是不是游戏中，，， 为啥不在登录时带回  而需要重新发 而且是每次都发
        this.setUserInfo(hallData.getInstance());
    },

     initRoomUI: function(data){
        klb_game_list_config.items.forEach(function (gameItem) {
            if (gameItem.gameid == data.hallGameid) {
                this.game_name = gameItem.name;
                this.game_id = gameItem.gameid;
            }
        }.bind(this));

        for (var i = 0; i < data.roomlistList.length; i++) {
            var dataInfo = data.roomlistList[i];

            if (dataInfo) {
                var item = this.m_tRoomItem[i]
                if(item)
                item.getComponent('gameyj_Fish_Doyen_RoomItem').init(dataInfo, data.hallGameid);
            }
        }

     },

    /**
     * 设置玩家信息
     */
    setUserInfo: function (userData) {
        var userinfo = this.node.getComponentInChildren('klb_hall_UserInfo');
        if (userinfo) {
            userinfo.setData(userData);
        }
    },

    //钻石
    zuanshiCallBack: function () {
        this.shopBtnCallBack(null, null, 'ZS');
    },

    //关闭界面
    closeUICallBack: function () {
        hall_audio_mgr.com_btn_click();
        this.onDestroy();
        this.node.removeFromParent();
        var scene = cc.director.getScene();
        if(!cc._useChifengUI || cc.game_pid == 10006){
            scene.getChildByName('Canvas').getComponent('klb_hallScene').updateActiveTip();
        }
    },

    //商城
    //type 为代码打开是指定 打开对应的页面
    shopBtnCallBack: function (event, data, type) {
        if (!cc._is_shop)
            return;
        cc.dd.UIMgr.openUI(hall_prefab.KLB_SHOP_LAYER, function (ui) {
            type = type || 'ZS'; //默认打开房卡页面
            ui.getComponent('klb_hall_ShopLayer').gotoPage(type);
            // ui.setLocalZOrder(5000);
        }.bind(this));
    },

    onClickKSRoom: function () {
        var coin = HallPropData.getCoin();
        var entermin = 0;
        for (var i = this.m_tRoomItem.length - 2; i >= 0; --i) {
            var item_node = this.m_tRoomItem[i];
            var item = item_node.getComponent('gameyj_Fish_Doyen_RoomItem');
            if (i == 0) entermin = item.roomItem.entermin;
            if ((coin >= item.roomItem.entermin && coin <= item.roomItem.entermax)) {
                item.onClickRoom(true);
                return;
            } else if (item.roomItem.entermax == 0 && coin >= item.roomItem.entermin) {
                item.onClickRoom(true);
                return;
            }
        }
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_JIUJI, function (ui) {
            var jiuji = ui.getComponent('klb_hall_jiuji');
            if (jiuji != null) {
                jiuji.update_buy_list(entermin);
            }
        });
    },
    onDestroy: function () {

        RoomED.removeObserver(this);

    },

    enterGame: function(gameId){
        var sceneName = Define.GameId[gameId];
        if (cc.director.getScene().name == sceneName) {
            cc.log('当前正在场景 ' + sceneName + ' 无需切换场景');
            return false;
        }

        this.stack(sceneName);
        if (!cc.director.getScene() || !cc.director.getScene().name) {
            return;
        }

        let scene = cc.director.getScene();
        scene.autoReleaseAssets = true;

        var pre_scene_dir = scene_dir_cfg[cc.director.getScene().name];
        var load_scene_dir = scene_dir_cfg[sceneName];

        cc.gateNet.Instance().pauseDispatch();
        AudioManager.clearBackGroundMusicKey();

        var data = loading_cfg.getItem(function (item) {
            var list = item.key.split(';');
            for (var i = 0; i < list.length; i++) {
                if (list[i] == sceneName)
                    return item;
            }
        });

        var loading_scene = 'loading';
        if (data != null)
            loading_scene = data.scenename;
        cc.director.loadScene(loading_scene, function () {
            if (cc.sys.isMobile) {
                if (pre_scene_dir != load_scene_dir) {
                    cc.loader.releaseResDir(pre_scene_dir);
                    cc.log("释放资源:" + pre_scene_dir);
                }
                cc.log("执行GC");
                cc.sys.garbageCollect();
            }
        });

    },

    //日志打印 比赛场莫名拉回大厅bug
    stack(sceneName) {
        var e = new Error();
        var lines = e.stack.split("\n");
        lines.shift();
        var str = '加载场景:' + sceneName + ' \n';
        lines.forEach(item => {
            str += item;
            str += '\n';
        });
        cc.log(str);
    },
    onEventMessage: function (event, data) {
        switch(event){
            case RoomEvent.on_coin_room_enter:
                var data = gFishMgr.getRoomItem();
                this.enterGame(data.gameid);
                break;
            // case HallCommonEvent.HALL_NO_RECONNECT_GAME:
            //     cc.dd.SceneManager.enterHall();
            //     break;
        }
    },
});
