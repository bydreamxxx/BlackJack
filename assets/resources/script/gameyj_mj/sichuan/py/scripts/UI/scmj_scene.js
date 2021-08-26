var mj_audio = require('mj_audio');

var playerMgr = require('scmj_player_mgr');

var UserPlayer = require('scmj_userPlayer_data');
var RoomMgr = require("jlmj_room_mgr").RoomMgr;

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad: function () {
        cc.game.setFrameRate(60);

        this.autoScaleWin();
    },

    autoScaleWin: function () {
        var canvas_node = cc.find("Canvas");
        var desk_node = cc.find("Canvas/desk_node");
        let huan3zhang = cc.find("Canvas/scmj_huan3zhang");
        let tips_u = cc.find("Canvas/tips_u");
        let tips_r = cc.find("Canvas/tips_r");
        let tips_l = cc.find("Canvas/tips_l");
        let tips_d = cc.find("Canvas/tips_d");

        var c_scale = canvas_node.height / desk_node.height;
        if (canvas_node.width / canvas_node.height >= desk_node.width / desk_node.height) {
            desk_node.scaleX = c_scale;
            desk_node.scaleY = c_scale;

            huan3zhang.scaleX = c_scale;
            huan3zhang.scaleY = c_scale;

            tips_u.scaleX = c_scale;
            tips_u.scaleY = c_scale;
            tips_u.x = tips_u.x * c_scale;
            tips_u.y = tips_u.y * c_scale;

            tips_r.scaleX = c_scale;
            tips_r.scaleY = c_scale;
            tips_r.x = tips_r.x * c_scale;
            tips_r.y = tips_r.y * c_scale;

            tips_l.scaleX = c_scale;
            tips_l.scaleY = c_scale;
            tips_l.x = tips_l.x * c_scale;
            tips_l.y = tips_l.y * c_scale;

            tips_d.scaleX = c_scale;
            tips_d.scaleY = c_scale;
            tips_d.x = tips_d.x * c_scale;
            tips_d.y = tips_d.y * c_scale;
        }



        let zhuozi = cc.find("Canvas/zhuozi");
        c_scale = canvas_node.height / zhuozi.height;
        if (canvas_node.width / canvas_node.height >= desk_node.width / desk_node.height) {
            zhuozi.scaleX = c_scale;
            zhuozi.scaleY = c_scale;
        }

        let toppanel = cc.find("Canvas/toppanel");
        toppanel.height = zhuozi.height * zhuozi.scaleY;
        toppanel.width = canvas_node.width;
        let widgetList = toppanel.getComponentsInChildren(cc.Widget);
        widgetList.forEach((widget) => {
            if (widget) {
                widget.updateAlignment();
            }
        })
    },
    /**
     * 隐藏摸得牌
     */
    playerHideModePai: function () {
        var jlmj_player_list = cc.find("Canvas/player_list").getComponent('scmj_player_list');
        jlmj_player_list.playerHideModePai();
    },

    /**
     * 排序手牌
     */
    jlmjPlayerDownSortShouPai: function () {
        //发牌动画结束
        cc.log("jlmjPlayerDownSortShouPai");

        playerMgr.Instance().playing_fapai_ani = false;
        UserPlayer.Instance().paixu();
        var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent('scmj_player_down_ui');
        player_down_ui.zhanli();
        player_down_ui.updateShouPai(UserPlayer.Instance());
        playerMgr.Instance().playerMoPaiAction();

        cc.gateNet.Instance().clearDispatchTimeout();
    },

    /**
     * 发4张牌
     */
    dealFourCard: function () {
        mj_audio.playAduio('draw');
    },

    /**
     * 洗牌
     */
    shuffle: function () {
        mj_audio.playAduio('shuffle');
    },
});
