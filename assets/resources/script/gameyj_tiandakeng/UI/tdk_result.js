var TdkCPlayerData = require('tdk_coin_player_data');
var CPlayerData = TdkCPlayerData.TdkCPlayerMgrData;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var gameType = require('Define').GameType;
var CDeskData = require('tdk_coin_desk_data').TdkCDeskData;

cc.Class({
    extends: cc.Component,

    properties: {
        userInfoNode: [cc.Node],//玩家列表信息
        fjinfo: cc.Label,//房间信息
        gzinfo: cc.Label,//规则信息
        multiple: cc.Node,
    },

    // use this for initialization
    onLoad: function () {

    },

    onEnable: function () {
        this.updateUI();
    },

    /**
     *刷新UI
     */
    updateUI: function () {
        this.userInfoNode.forEach(function (node) {
            node.active = false;
        });
    },

    /**
     * 初始化界面
     */
    initUI: function () {
        var Rule = RoomMgr.Instance()._Rule;
        this.node.active = true;
        var fj_arr = [];
        var gameName = '填大坑';
        var isfz = RoomMgr.Instance().gameId == gameType.TDK_FRIEND_LIU ? true : false;
        if (isfz)
            gameName = '方正填大坑';
        fj_arr.push(gameName + Rule.roleCount + '人');
        var fanghao = '房间号:' + RoomMgr.Instance().roomId;
        fj_arr.push(fanghao);
        fj_arr.push('共' + Rule.roundCount + '局');
        fj_arr.push(this.getSysTime());

        var gz_arr = [];
        gz_arr.push(CDeskData.Instance().getPlayTypeStr(Rule.playType));//玩法
        if (Rule.hasJoker)
            gz_arr.push('双王');
        if (Rule.sixiaowang)
            gz_arr.push('四小王');
        if (Rule.jokerPao)
            gz_arr.push('王中炮');
        if (Rule.aPao)
            gz_arr.push('抓A必炮');
        if (Rule.lanDouble)
            gz_arr.push('烂锅翻倍');
        if (Rule.genfu)
            gz_arr.push('末脚跟服');
        if (Rule.isOpen)
            gz_arr.push('亮底');
        if (!isfz)
            gz_arr.push(Rule.shareType ? '公张随豹' : '公张随点');
        if (Rule.huixuanti)
            gz_arr.push('回旋踢');
        else
            gz_arr.push(Rule.bati ? '把踢' : '末踢');

        if (Rule.motifanbei)
            gz_arr.push('末踢翻倍');
        if (Rule.qinsandui)
            gz_arr.push('亲三对');
        if (Rule.lianxian)
            gz_arr.push('连线');



        //房间信息
        this.fjinfo.string = fj_arr.join(' ');
        //房间规则
        this.gzinfo.string = '规则: ' + gz_arr.filter(function (txt) { return txt != '' }).join(',');
        for (var i = 0; i < this.userInfoNode.length; ++i) {
            this.userInfoNode[i].active = false;
        }

        if(RoomMgr.Instance().isClubRoom()){
            this.multiple.active = false;
            // this.multiple.getComponentInChildren(cc.Label).string = RoomMgr.Instance().multiple+'倍场';
        }else{
            this.multiple.active = false;
        }
    },

    /**
     * 初始化玩家信息
     */
    initResultInfo: function (list) {
        cc.log('显示结算界面')
        this.initUI();

        var infoList = list.listList;
        infoList.sort(function (a, b) {
            return b.score - a.score;
        }.bind(this));
        this.maxscore = infoList[0].score;
        for (var i = 0; i < infoList.length; ++i) {
            var itemdata = infoList[i];
            if (itemdata) {
                this.initUserInfo(itemdata, i);
                var str = itemdata.xifengNum ? itemdata.xifengNum + '分' : 0 + '分';
                cc.find('xifen', this.node).getComponent(cc.Label).string = str;
            }
        }
    },


    /**
     * 初始化玩家信息条
     * @param userInfo 玩家信息
     */
    initUserInfo: function (userInfo, i) {
        var usernode = this.userInfoNode[i];
        if (usernode) {
            usernode.active = true;
            var nodeCom = usernode.getComponent('zhanjiTongji_comon');
            if (nodeCom) {
                var palyer = CPlayerData.Instance().getPlayer(userInfo.id);
                var dawin = userInfo.score == this.maxscore && this.maxscore != 0;
                var isziji = cc.dd.user.id == userInfo.id;
                var conmondata = nodeCom.getConmonData(palyer.nick, userInfo.id, userInfo.winTimes,
                    0, userInfo.loseTimes,
                    0, false,
                    dawin, palyer.headUrl,
                    userInfo.score, isziji,
                    '');
                nodeCom.setData(conmondata);
            }
        }
    },

    /**
     * 退出房间
     */
    exitBtnCallBack: function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.closeUI(this.node);
        cc.dd.SceneManager.enterHall();
    },

    /**
     * 分享
     */
    shardBtnCallBack: function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_SHARE, function (ui) {
            ui.zIndex = UIZorder.MJ_LAYER_UI;
        });
    },

    /**
     * 分享到好友 群
     */
    shardFriendCallBack: function () {
        hall_audio_mgr.com_btn_click();
        setTimeout(function () {
            if (cc.sys.isNative) {
                var canvasNode = cc.find('Canvas');
                cc.dd.native_wx.SendScreenShot(canvasNode);
            }
        }.bind(this), 500);
    },
    /**
     * 分享到朋友圈
     */
    shardQuanCallBack: function () {
        hall_audio_mgr.com_btn_click();
        setTimeout(function () {
            if (cc.sys.isNative) {
                var canvasNode = cc.find('Canvas');
                cc.dd.native_wx.SendScreenShotTimeline(canvasNode);
            }
        }.bind(this), 500);
    },

    shareZhanji(event, data) {
        if (cc.sys.isNative) {
            var canvasNode = cc.find('Canvas');
            cc.find('gongzhonghao', this.node).active = true;
            if (data == 'wechat') {
                cc.dd.native_wx.SendScreenShot(canvasNode);
            }
            else if (data == 'xianliao') {
                cc.dd.native_wx.sendXlScreenShot(canvasNode);
            }
            else {
                cc.dd.native_wx.SendScreenShotTimeline(canvasNode);
            }
            cc.find('gongzhonghao', this.node).active = false;
        }
    },
    /**
     * 获取系统时间
     */
    getSysTime: function () {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        var hour = date.getHours();
        var min = date.getMinutes();
        var sec = date.getSeconds();

        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 1 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        if (hour >= 0 && hour <= 9) {
            hour = "0" + hour;
        }
        if (min >= 0 && min <= 9) {
            min = "0" + min;
        }
        if (sec >= 0 && sec <= 9) {
            sec = "0" + sec;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + hour + seperator2 + min
            + seperator2 + sec;
        return currentdate;
    },

    gobackHall: function () {
        jlmj_util.enterHall();
    },
});