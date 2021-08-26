var hall_audio_mgr = require('hall_audio_mgr').Instance();
var HBSL_Data = require("hbslData").HBSL_Data;
cc.Class({
    extends: cc.Component,
    properties: {
        listNode: { type: cc.Node, default: null, tooltip: "列表" },
        mlPrefab: { type: cc.Prefab, default: null, tooltip: '埋雷玩家预设体' },
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
        var index = 0;
        var playelist = HBSL_Data.Instance().getWatchingPlayer();
        this.listNode.height = playelist.length * 90;
        playelist.forEach(function (role) {
            var item = cc.instantiate(this.mlPrefab);
            this.listNode.addChild(item);
            var playerItme = item.getComponent('hbsl_MineItem');
            if (!playerItme) return;
            index++;
            playerItme.setWatchingData(index, role);
        }.bind(this));
    },

    onDestroy: function () {
    },


    onColse: function () {
        hall_audio_mgr.com_btn_click();
        this.node.removeFromParent();
        this.node.destroy();
    },

    onscoreClick : function(event,data){
        cc.log('触发滚动事件');
    },

});