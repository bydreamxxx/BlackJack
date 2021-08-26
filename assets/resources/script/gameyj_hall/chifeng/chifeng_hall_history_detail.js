var com_replay_data = require('com_replay_data').REPLAY_DATA;
var hall_audio_mgr = require('hall_audio_mgr').Instance();
const Hall = require('jlmj_halldata');

cc.Class({
    extends: cc.Component,

    properties: {
        nameList: [cc.Label],
        itemNode: cc.Node,
        contentNode: cc.Node,
    },


    onLoad: function () {
        this.battleList = [];
    },

    onDestroy: function () {

    },

    /**
     * 初始化 列表
     * @param node
     */
    initItem: function (data) {
        this.msgData = data;
        this.historyId = data.historyId;
        this.detailsList = data.detailsList;
        this.usersList = data.usersList;
        for (var i = 0; i < this.usersList.length; i++) {
            this.nameList[i].string = cc.dd.Utils.substr(this.usersList[i].userName, 0, 4)
            this.nameList[i].node.active = true;
        }
        this.contentNode.removeAllChildren();
        com_replay_data.Instance().totalRound = this.detailsList.length;
        for (let i = 0; i < this.detailsList.length; i++) {
            var item = cc.instantiate(this.itemNode);
            item.getComponent('chifeng_history_detail_item').setData(this.detailsList[i], this.historyId, data.gameType, this.usersList);
            item.active = true;
            this.contentNode.addChild(item);
        }
    },

    update: function (dt) {

    },

    /**
     * 查看按钮
     */
    onClickCheckRecord: function (event, data) {

    },

    close: function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

});
