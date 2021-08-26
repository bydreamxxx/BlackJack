//每个麻将都要改写这个
let mjComponentValue = null;

var mj_audio = require('mj_audio');

let scene = cc.Class({
    extends: cc.Component,

    properties: {

    },

    ctor() {
        mjComponentValue = this.initMJComponet();
        this.require_UserPlayer = require(mjComponentValue.userData);
        this.require_playerMgr = require(mjComponentValue.playerMgr);
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
        var jlmj_player_list = cc.find("Canvas/player_list").getComponent(mjComponentValue.playerList);
        jlmj_player_list.playerHideModePai();
    },

    /**
     * 排序手牌
     */
    jlmjPlayerDownSortShouPai: function () {
        //发牌动画结束
        this.require_playerMgr.Instance().playing_fapai_ani = false;
        this.require_UserPlayer.Instance().paixu();
        var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent(mjComponentValue.playerDownUI);
        player_down_ui.zhanli();
        player_down_ui.updateShouPai(this.require_UserPlayer.Instance());
        this.require_playerMgr.Instance().playerMoPaiAction();

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

    initMJComponet() {
        cc.log("-----------------------no implements base_mj_scene initMJComponet-----------------------")
        return require('mjComponentValue').base_mj;
    }
});
module.exports = scene;
