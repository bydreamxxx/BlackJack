var com_replay_data = require('com_replay_data').REPLAY_DATA;
var hall_audio_mgr = require('hall_audio_mgr').Instance();
const Hall = require('jlmj_halldata');
const com_glistView = require('com_glistView');

cc.Class({
    extends: cc.Component,

    properties: {
        glistView: com_glistView,       //列表

    },

    initItem: function (data, itemList, parent) {
        this.battleList = data;
        this.glistView.setDataProvider(data, 0, function (itemNode, index) {
            if (index < 0 || index >= data.length)
                return;
            var element = data[index];
            itemNode.getChildByName('time').getComponent(cc.Label).string = this.timestampToTime(element.timestamp);
            for (var i = 0; i < element.resultList.userList.length; i++) {
                if(element.resultList.userList[i].userId == cc.dd.user.id){
                    itemNode.getChildByName('gold').getComponent(cc.Label).string = data.score > 0 ? data.score : (0 - data.score);
                    itemNode.getChildByName('win').active = data.score > 0;
                    itemNode.getChildByName('fail').active = data.score <= 0;
                }
            }

            var itemInfo = gameListConfig.getItem(function(item){
                if(item.gameid == element.gameType){
                    return item
                }
            })
            itemNode.getChildByName('desc').getComponent(cc.Label).string = itemInfo.name;
        })
    },

    timestampToTime(timestamp) {
        var date = new Date(timestamp * 1000);
        var hour = date.getHours();
        var min = date.getMinutes();
        return (hour > 9 ? hour : ('0' + hour)) + ':' + (min > 9 ? min : ('0' + min));
    },

    close: function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },
});
