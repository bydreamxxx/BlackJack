var mj_audio = require('mj_audio');

var playerMgr = require('symj_player_mgr');

var UserPlayer = require('symj_userPlayer_data');


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
        var c_scale = canvas_node.height / desk_node.height;
        if (canvas_node.width / canvas_node.height >= desk_node.width / desk_node.height) {
            desk_node.scaleX = c_scale;
            desk_node.scaleY = c_scale;
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
        var jlmj_player_list = cc.find("Canvas/player_list").getComponent('symj_player_list');
        jlmj_player_list.playerHideModePai();
    },

    /**
     * 排序手牌
     */
    jlmjPlayerDownSortShouPai: function () {
        //发牌动画结束
        playerMgr.Instance().playing_fapai_ani = false;
        UserPlayer.Instance().paixu();
        var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent('symj_player_down_ui');
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
