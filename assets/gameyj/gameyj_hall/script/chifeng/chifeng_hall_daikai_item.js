const gameConfig = require('klb_gameList');
var game_type_cfg = require('game_type');
const club_Ed = require('klb_Club_ClubMgr').klbClubEd;
const club_Event = require('klb_Club_ClubMgr').klbClubEvent;
var Platform = require("Platform");
var login_module = require('LoginModule');
let GetGameRules = require('GetGameRules');

cc.Class({
    extends: cc.Component,

    properties: {
        playerInfoNode: { default: [], type: cc.Node },
        scrollView: cc.ScrollView,
        labelColor: [cc.Color],
    },

    onLoad: function () {
        club_Ed.addObserver(this);
    },

    onDestroy() {
        club_Ed.removeObserver(this);
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

        this.jushu = GetGameRules.getJuShu({usercountlimit: roomData.maxUserNum, boardscout: roomData.juNum}, roomData.gameType)[1];

        this.scrollView.enabled = false;
        this.scrollView.content.x = 0;
        if (gameInfo) {
            this.node.tagname = roomData.roomId;
            this._data = roomData;
            //游戏名字
            cc.find('layout/no', this.node).getComponent(cc.Label).string = roomData.roomId + '号房间';
            cc.find('layout/name', this.node).getComponent(cc.Label).string = '(' + gameInfo.name + ')';
            //局数
            cc.find('round', this.node).getComponent(cc.Label).string = this.jushu + '：';
            cc.find('round/round_num', this.node).getComponent(cc.Label).string = roomData.curJuNum + '/' + roomData.juNum;
            cc.find('people/people_num', this.node).getComponent(cc.Label).string = roomData.membersList.length + '/' + roomData.maxUserNum;
            cc.find('time', this.node).getComponent(cc.Label).string = this.convertTimeDay(roomData.createTime) + ' ' + this.convertTimeDate(roomData.createTime);
            cc.find('isopen', this.node).active = roomData.state == 1;

            //房卡消耗数量
            // cc.find('cout', this.node).getComponent(cc.Label).string = 'x' + roomData.costroomcard;
            for (var i = 0; i < this.playerInfoNode.length; i++)
                this.playerInfoNode[i].active = false;

            if (roomData.membersList.length > 6) {
                this.scrollView.enabled = true;
            }

            for (var idx = 0; idx < roomData.membersList.length; idx++) {
                //玩家数据
                var userData = roomData.membersList[idx];

                var node = this.playerInfoNode[idx];
                node.active = true;

                //this.initHead(node, userData);
                node.getChildByName('headNode').getComponent('klb_hall_Player_Head').initHead(userData.openId, userData.headUrl);
                var name = node.getChildByName('name').getComponent(cc.Label);
                name.string = (userData.name.length > 6 ? cc.dd.Utils.substr(userData.name, 0, 6) : userData.name);

                var Id = node.getChildByName('Id').getComponent(cc.Label);
                Id.string = userData.userId;

                var score = node.getChildByName('socre').getComponent(cc.Label);
                var role = roomData.curScoresList.find((x) => { return x.roleId == userData.userId; });
                if (role) {
                    let _score = role.score;

                    if (_score > 0) {
                        score.string = '+' + _score;
                        score.node.color = this.labelColor[0];
                    }
                    else {
                        score.string = _score + '';
                        score.node.color = this.labelColor[1];
                    }
                }
                else {
                    score.string = '';
                }

            }

            this.playerInfoNode[0].parent.width = roomData.membersList.length * (this.m_nWidth + this.m_nSpaceX);
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


    //微信分享
    clickWechat() {
        var self = this;
        var gameInfo = gameConfig.getItem(function (item) {
            return item.gameid == self._data.gameType;
        });
        if (gameInfo) {
            // let info = {
            //     gameid: this._data.gameType,//游戏ID
            //     roomid: this._data.roomId,//房间号
            //     title: wanFaTitle,//房间名称
            //     content: wanFa,//游戏规则数组
            //     usercount: this._data.maxUserNum,//人数
            //     jushu:  this._data.juNum,//局\圈数
            //     jushutitle: juquan_txt+'数',//局\圈标题，默认局数
            //     playername: playerName,//玩家姓名数组
            //     gamestate: '未开始',//游戏状态
            // }
            var title = gameInfo.name;
            var share_content = '房间号:' + this._data.roomId + '  共' + this._data.juNum + this.jushu.replace('数','')+'  缺' + (this._data.maxUserNum - this._data.membersList.length) + '人  快来加入吧';
            cc.dd.native_wx.SendAppContent("", title, share_content, Platform.shareGameUrl + '?channel=' + (cc.dd.user.regChannel * 100 + login_module.Instance().loginType % 100));
        }
    },

    //闲聊分享
    clickXianliao() {
        var self = this;
        var gameInfo = gameConfig.getItem(function (item) {
            return item.gameid == self._data.gameType;
        });
        if (gameInfo) {
            var title = gameInfo.name;
            var share_content = '房间号:' + this._data.roomId + '  共' + this._data.juNum + this.jushu.replace('数','')+'  缺' + (this._data.maxUserNum - this._data.membersList.length) + '人  快来加入吧';
            cc.dd.native_wx.sendXlApp('', 'room_id=' + this._data.roomId, title, share_content);
        }
    },

    //解散房间
    clickJiesan() {
        if (this._data) {
            var pbObj = new cc.pb.club.msg_friend_create_dissolve_room_req();
            pbObj.setRoomId(this._data.roomId);
            pbObj.setGameType(this._data.gameType);
            cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_friend_create_dissolve_room_req, pbObj, 'msg_friend_create_dissolve_room_req', true);
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

        var currentdate = month + seperator1 + strDate;//date.getFullYear() + seperator1 +
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

    onEventMessage(event, data) {
        switch (event) {
            case club_Event.FRIEND_DISSOLVE_ROOM_RET:
                this.onDissolveRoom(data);
                break;
        }
    },

    //代开房间解散
    onDissolveRoom(msg) {
        if (this._data && msg.roomId == this._data.roomId) {
            switch (msg.retCode) {
                case 0:
                    cc.dd.PromptBoxUtil.show('解散成功');
                    cc.dd.UIMgr.destroyUI(this.node);
                    break;
                case 1:
                    cc.dd.PromptBoxUtil.show('房间不存在');
                    break;
                case 2:
                    cc.dd.PromptBoxUtil.show('游戏已开始');
                    break;
                case 3:
                    cc.dd.PromptBoxUtil.show('权限不足');
                    break;
            }
        }
    },
});
