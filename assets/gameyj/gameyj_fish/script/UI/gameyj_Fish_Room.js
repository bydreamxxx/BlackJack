//create by wj 2019/09/26
var hallData = require('hall_common_data').HallCommonData;
var klb_game_list_config = require('klb_gameList');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var hall_prefab = require('hall_prefab_cfg');
var HallPropData = require('hall_prop_data').HallPropData.getInstance();
var dd = cc.dd;
var AppCfg = require('AppConfig');

cc.Class({
    extends: cc.Component,

    properties: {
        m_tRoomItem: {default: [], type: cc.Node},
        game_name: '',
        game_id: '',
    },

     onLoad: function () {
        // const loadCellList = [];
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish1", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish2", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish2_d", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish3", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish3_d", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish4", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish4_d", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish5", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish6", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish6_d", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish7", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish7_d", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish8", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish8_d", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish9", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish9_d", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish10", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish10_d", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish11", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish12", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish13", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish14", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish14_d", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish15", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish16", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish16_d", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish17", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish17_d", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish18", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish18_d", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish19", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish19_d", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish20", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish21", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish21_d", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish22", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish22_d", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish23", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish23_d", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish24", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish24_d", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish25", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish25_d", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish26", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish26_d", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish27", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish27_d", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish30", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish30_d", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish31", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish32", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish32_d", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/yupan01", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/yupan02", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/yupan03", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/yupan06", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/yupan07", cc.Prefab));

        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish_net_2", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish_net_1", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/lightning", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/coinNumNode", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/coinEffect1", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/coinEffect10", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/buyu_buff_bigBoom", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/buyu_buff_smog", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/buyu_fish_dead_glow", cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/bingoEffect", cc.Prefab));
        // cc.dd.ResLoader.loadGameStaticResList(loadCellList, null, null);
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
                item.getComponent('gameyj_Fish_RoomItem').init(dataInfo, data.hallGameid);
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
            var item = item_node.getComponent('gameyj_Fish_RoomItem');
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
});
