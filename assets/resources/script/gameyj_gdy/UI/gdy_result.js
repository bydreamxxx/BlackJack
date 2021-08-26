var gdyData = require('gdy_game_data').GDY_Data;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        userInfoNode: [cc.Node],//玩家列表信息
        fjinfo: cc.Label,//房间信息
        gzinfo: cc.Label,//规则信息


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
        this.node.active = true;
        var fj_arr = [];
        fj_arr.push(gdyData.Instance().getRoomInfo());
        var fanghao = ' 房间号:' + RoomMgr.Instance().roomId;
        fj_arr.push(fanghao);
        var bureaustr = ' 共'+gdyData.Instance().GetBureauNum()+'局';
        fj_arr.push(bureaustr);
        fj_arr.push(this.getSysTime());


        // var gz_arr = [];
        // gz_arr.push(gdyData.Instance().getGuzeInfo());
        var str = gdyData.Instance().getGuzeInfo()
        //房间信息
        this.fjinfo.string = fj_arr.join(' ');
        //房间规则
        this.gzinfo.string = '规则: ' + str;  //gz_arr.filter(function (txt) { return txt != '' }).join(',');

        cc.find('Canvas/root/result_ani/btns').active = false;
    },

    /**
     * 初始化玩家信息
     */
    initResultInfo: function (list) {
        cc.log('大结算中');
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
                
                var palyer = gdyData.Instance().getPlayer(userInfo.id);
                var idziji = cc.dd.user.id == userInfo.id;
                var str = '';
                if(!idziji )
                     str = '对方';
                var dawin = userInfo.score == this.maxscore && this.maxscore != 0;
                var conmondata = nodeCom.getConmonData(palyer.name, userInfo.id, userInfo.winTimes,
                    '',userInfo.loseTimes,
                    '', false,
                    dawin, palyer.headUrl,
                    userInfo.score, idziji,
                    str);
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
        gdyData.Destroy();
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