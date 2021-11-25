var hall_audio_mgr = require('hall_audio_mgr').Instance();
const Hall = require('jlmj_halldata');
const com_glistView = require('com_glistView');
const HallSendMsgCenter = require('HallSendMsgCenter');
const gameListConfig = require('klb_gameList');
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
            for (var i = 0; i < element.resultList.length; i++) {
                var detailInfo = element.resultList[i]
                if(detailInfo.userId == cc.dd.user.id){
                    itemNode.getChildByName('gold').getComponent(cc.Label).string = detailInfo.score > 0 ? detailInfo.score : (0 - detailInfo.score);
                    itemNode.getChildByName('win').active = detailInfo.score > 0;
                    itemNode.getChildByName('fail').active = detailInfo.score <= 0;
                    itemNode.tagname = element.historyId
                }
            } 

            var itemInfo = gameListConfig.getItem(function(item){
                if(item.gameid == element.gameType){
                    return item
                }
            })
            itemNode.getChildByName('desc').getComponent("LanguageLabel").setText(itemInfo.name);
        }.bind(this))
    },

    timestampToTime(timestamp) {
        var date = new Date(timestamp * 1000);
        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDay()
        var hour = date.getHours();
        var min = date.getMinutes();
        return year+":" + month+":" + (day > 9 ? day : ("0" + day)) + ":" +(hour > 9 ? hour : ('0' + hour)) + ':' + (min > 9 ? min : ('0' + min));
    },

    onClickHistoryDetail(event, data){
        var historyId = event.target.tagname
        HallSendMsgCenter.getInstance().sendBattleRecordDetail(historyId);
    },

    close: function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },
});
