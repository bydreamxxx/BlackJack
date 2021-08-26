const gameConfig = require('klb_gameList');
var game_type_cfg = require('game_type');
var com_replay_data = require('com_replay_data').REPLAY_DATA;
var Define = require('Define');

cc.Class({
    extends: cc.Component,

    properties: {
        playerInfoNode: { default: [], type: cc.Node },
        labelColor: [cc.Color],
        scrollView: cc.ScrollView,
    },

    onLoad: function () {

    },

    //初始化数据信息
    setData: function (roomData) {
        //获取游戏数据
        var gameInfo = gameConfig.getItem(function (item) {
            return item.gameid == roomData.gameType;
        });
        var gameitem = game_type_cfg.getItem(function (item) { return item.key == roomData.gameType });
        if (gameitem) {
            if (gameitem.is_record != 1) {
                cc.find('huifangBtn', this.node).active = false;
            }
        }

        this.scrollView.enabled = false;
        this.scrollView.content.x = 0;
        if (gameInfo) {
            this._data = roomData;
            //游戏名字
            cc.find('name', this.node).getComponent(cc.Label).string = gameInfo.name;
            //信息描述

            var str = '房号:' + roomData.roomId + '      ' + this.convertTimeDay(roomData.timestamp) + '   ' +
                this.convertTimeDate(roomData.timestamp);// + '  比赛创建人ID:' + roomData.createUserId;
            cc.find('jieshu', this.node).active = false;
            if (roomData.isRoomOpen == 2) {
                str += '       回放码:' + roomData.historyId;
                cc.find('huifangBtn', this.node).active = true;
                cc.find('jiesan', this.node).active = false;
                cc.find('qunzhujiesan', this.node).active = true;
                cc.find('shenqing', this.node).active = false;
            }
            else if (roomData.isRoomOpen == 1) {//房间开局
                str += '       回放码:' + roomData.historyId;
                if (roomData.dissolveRoleId) {
                    cc.find('shenqing', this.node).active = true;
                    cc.find('shenqing/name', this.node).getComponent(cc.Label).string = '';
                    for (var i = 0; i < roomData.resultList.length; i++) {
                        if (roomData.resultList[i].userId == roomData.dissolveRoleId) {
                            var username = roomData.resultList[i].name.length > 6 ? cc.dd.Utils.substr(roomData.resultList[i].name, 0, 6) : roomData.resultList[i].name;
                            cc.find('shenqing/name', this.node).getComponent(cc.Label).string = username;
                            break;
                        }
                    }
                }
                else {
                    cc.find('shenqing', this.node).active = false;
                    cc.find('jieshu', this.node).active = true;
                }
                cc.find('huifangBtn', this.node).active = true;
                cc.find('jiesan', this.node).active = false;
                cc.find('qunzhujiesan', this.node).active = false;
            }
            else {
                cc.find('shenqing', this.node).active = false;
                cc.find('huifangBtn', this.node).active = false;
                cc.find('jiesan', this.node).active = true;
                cc.find('qunzhujiesan', this.node).active = false;
            }
            cc.find('desc', this.node).getComponent(cc.Label).string = str;
            //房卡消耗数量
            // cc.find('cout', this.node).getComponent(cc.Label).string = 'x' + roomData.costroomcard;
            for (var i = 0; i < this.playerInfoNode.length; i++)
                this.playerInfoNode[i].active = false;

            if (roomData.resultList.length > 6) {
                this.scrollView.enabled = true;
            }

            for (var idx = 0; idx < roomData.resultList.length; idx++) {
                //玩家数据
                var userData = roomData.resultList[idx];

                var node = this.playerInfoNode[idx];
                node.active = true;

                //this.initHead(node, userData);
                node.getChildByName('headNode').getComponent('klb_hall_Player_Head').initHead(userData.openId, userData.headUrl);
                var name = node.getChildByName('name').getComponent(cc.Label);
                name.string = (userData.name.length > 6 ? cc.dd.Utils.substr(userData.name, 0, 6) : userData.name);

                var Id = node.getChildByName('Id').getComponent(cc.Label);
                Id.string = userData.userId;

                var score = node.getChildByName('socre').getComponent(cc.Label);
                let _score = userData.score;
                if (roomData.gameType == Define.GameType.PAOYAO_FRIEND)
                    _score *= 0.1;
                else if (roomData.gameType == Define.GameType.HBSL_JBL) {
                    _score *= 0.0001;
                    _score = _score.toFixed(2);
                }

                if (_score > 0) {
                    score.string = '+' + _score;
                    score.node.color = this.labelColor[0];
                }
                else {
                    score.string = _score;
                    score.node.color = this.labelColor[1];
                }

            }

            this.playerInfoNode[0].parent.width = roomData.resultList.length * (this.m_nWidth + this.m_nSpaceX);
        }
    },

    initHead: function (node, data) {
        //var headSp = node.getChildByName('headNode').getChildByName('headIcon').getComponent(cc.Sprite);
        var cpt = node.getChildByName('headNode').getComponent('klb_hall_Player_Head');
        cpt.initHead(data.openId, data.headUrl)
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
     * 查看按钮回调
     */
    checkBtnCallBack: function () {
        // if (this._callback) {
        //     this._callback(this._data);
        // }
        if (cc._chifengGame) {
            let msg = new cc.pb.club.msg_get_battle_history_detail_req();
            msg.setHistoryId(this._data.historyId);
            // var type = cc._chifengHistoryType || 2;
            // msg.setType(type);
            cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_get_battle_history_detail_req, msg, 'msg_get_battle_history_detail_req', true);
        }
        else {
            com_replay_data.Instance().totalRound = this._data.hasOwnProperty('boardscount') ? this._data.boardscount : this._data.boardsCount;
            com_replay_data.Instance().getRecordHttpReq(this._data.gameType, parseInt(this._data.historyId));
        }
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
});
