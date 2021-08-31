// create by wj 2018/03/23
const klb_GameList_Config = require('klb_gameList');
var com_replay_data = require('com_replay_data').REPLAY_DATA;
var Define = require('Define');
cc.Class({
    extends: cc.Component,

    properties: {
        desc_Txt: cc.Label,
        playerNode: { default: [], type: cc.Node, tooltip: '玩家信息' },
        downButton: cc.Node,
        upButton: cc.Node,
        movieBtn: cc.Node,
        downPannel: cc.Node,
        upColor: cc.Color,
        downColor: cc.Color
    },

    onLoad: function () {
        this._callback = null;
    },

    setData: function (data, callback, isCheck) {
        this.movieBtn.active = !!isCheck;

        this.node.color = this.upColor;
        this.downPannel.active = false;
        this.downButton.active = data.resultList.length > 5;
        this.upButton.active = true;

        for (var i = 0; i < data.resultList.length; i++) {
            var node = this.playerNode[i];
            node.active = true;
            this.initHead(node, data.resultList[i]);

            var name = node.getChildByName('name').getComponent(cc.Label);
            name.string = (data.resultList[i].name.length > 6 ? cc.dd.Utils.substr(data.resultList[i].name, 0, 6) + '..' : data.resultList[i].name);

            var Id = node.getChildByName('id').getComponent(cc.Label);
            Id.string = data.resultList[i].userId;

            var score = node.getChildByName('score').getComponent(cc.Label);
            if (data.gameType == Define.GameType.PAOYAO_FRIEND)
                data.resultList[i].score *= 0.1;
            else if(data.gameType == Define.GameType.HBSL_JBL){
                data.resultList[i].score *= 0.0001;
                data.resultList[i].score = data.resultList[i].score.toFixed(2);
            }
                
            score.string = data.resultList[i].score;
            if (data.resultList[i].score > 0)
                score.node.color = cc.color(244, 0, 0);
            else
                score.node.color = cc.color(43, 159, 40);
        }
        var gameData = klb_GameList_Config.getItem(function (dataInfo) {
            return dataInfo.gameid == data.gameType;
        });
        this.desc_Txt.string = gameData.name + '       房号：' + data.roomId + '       ' + this.convertTimeDay(data.timestamp) + ' '
            + this.convertTimeDate(data.timestamp) + '      回放码:' + data.historyId;

        if (callback)
            this._callback = callback;
        this._data = data;
    },



    initHead: function (node, data) {
        //var headSp = node.getChildByName('headNode').getChildByName('headIcon').getComponent(cc.Sprite);
        var cpt = node.getComponent('klb_hall_Player_Head');
        cpt.initHead(data.openId, data.headUrl, 'klb_hall_battle_Item')
    },

    /**
     * 查看按钮回调
     */
    checkBtnCallBack: function () {
        // if (this._callback) {
        //     this._callback(this._data);
        // }
        com_replay_data.Instance().totalRound = this._data.hasOwnProperty('boardscount') ? this._data.boardscount : this._data.boardsCount;
        com_replay_data.Instance().getRecordHttpReq(this._data.gameType, this._data.historyId);
    },

    /**
     * 根据回放码查看数据是否需要的
     */
    ckeckDataById: function (historyId) {
        if (this._data.historyId == historyId)
            return true;
        return false;
    },

    /**
     * 获取数据
     */
    getGameData: function () {
        return this._data;
    },

    /**
     * 销毁
     */
    deleNode: function () {
        this.node.removeFromParent();
        this.node.destroy();
    },
    /**
     * 转换时间
     */
    convertTimeDay: function (t) {
        var date = new Date(t * 1000);
        var seperator1 = "-";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }

        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
        return currentdate;
    },

    /**
     * 转化时间小时分
     */
    convertTimeDate: function (t) {
        var date = new Date(t * 1000);
        var seperator2 = ":";
        var hours = date.getHours();
        var min = date.getMinutes();
        if (hours >= 0 && hours <= 9) {
            hours = "0" + hours;
        }
        if (min >= 0 && min <= 9) {
            min = "0" + min;
        }

        var currentdate = hours + seperator2 + min;
        return currentdate;
    },

    onClickMoveDown:function(){
        this.node.color = this.downColor;

        this.downPannel.active = true;
        this.downButton.active = false;
        this.upButton.active = true;
    },

    onClickMoveUp:function(){
        this.node.color = this.upColor;

        this.downPannel.active = false;
        this.downButton.active = true;
        this.upButton.active = false;
    },
});
