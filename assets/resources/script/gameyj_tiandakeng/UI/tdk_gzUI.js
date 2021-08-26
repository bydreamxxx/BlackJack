

var TdkCPlayerData = require('tdk_coin_player_data').TdkCPlayerMgrData;
var hall_audio_mgr = require('hall_audio_mgr').Instance();
cc.Class({
    extends: cc.Component,

    properties: {
        listNode: { type: cc.Node, default: null, tooltip: "列表" },
        gzPrefab: { default: null, type: cc.Prefab, tooltip: '观战者item', },
    },

    onLoad: function () {
    },

    initUI: function () {
        if (!this.listNode)
            return;
        for (var i = this.listNode.childrenCount - 1; i > -1; i--) {
            var node = this.listNode.children[i];
            if (node) {
                node.removeFromParent();
                node.destroy();
            }
        }
        var list = TdkCPlayerData.Instance().onlookersList;
        if (!list) return;
        for (var i = 0; i < list.length; ++i) {
            var player = list[i];
            if (player) {
                var item = cc.instantiate(this.gzPrefab);
                this.listNode.addChild(item);
                var playerItme = item.getComponent('tdk_guangzhuanItme');
                if (!playerItme) return;
                playerItme.setItem(player);
            }
        }
    },

    onColse: function () {
        hall_audio_mgr.com_btn_click();
        this.node.removeFromParent();
        this.node.destroy();
    },

});