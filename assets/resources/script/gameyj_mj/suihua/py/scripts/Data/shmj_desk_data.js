var dd = cc.dd;
var DeskEvent = require("jlmj_desk_data").DeskEvent;
var DeskED = require("jlmj_desk_data").DeskED;

var jlmj_desk_data = require("jlmj_desk_data");
var JieSanData = require('shmj_jiesan_data').JieSanData.Instance();

var RoomMgr = require('jlmj_room_mgr').RoomMgr;

var playerMgr = require('shmj_player_mgr');

const GameState = {
    NoStart: 1,
    Start: 2,
}

var SHMJDeskData = cc.Class({
    extends: jlmj_desk_data.DeskData,

    properties: {

    },

    statics: {

        Instance: function () {
            if (!this.s_desk) {
                this.s_desk = new SHMJDeskData();
            }
            return this.s_desk;
        },

        Destroy: function () {
            if (this.s_desk) {
                this.s_desk.clear();
                this.s_desk = null;
            }
        },

    },

    onLoad:function () {

    },
    ctor: function () {
        // 还剩几张麻将牌
        this.remainCards = 112;
    },
    clear: function () {
        this._super();
        this.remainCards = 112;
        this.is_genzhuang = false;
        this.setRemainCard(112);
    },
    /**
     * 是否还有剩余牌
     * @returns {boolean}
     */
    hasRemainPai: function () {
        return this.remainCards > (playerMgr.Instance().playerList.length);
    },

    /*
     * 设置房主
     */
    setOwner: function (ownerId) {
        if (!ownerId)
            return;

        this.owner = ownerId;

        var player = playerMgr.Instance().getPlayer(this.owner);
        if (player)
            player.setIsOwner(true);
    },

    /**
     * 设置当前圈数
     * @param currValue 当前圈数
     */
    setCurrRound: function (currValue) {
        if (currValue && this.gameStatus != GameState.NoStart && this.isFriend()) {
            this.currPlayCount = currValue;
            DeskED.notifyEvent(DeskEvent.UPDATE_CURR_ROUND, [currValue]);
        }
    },

    /**
     * 设置是否有连庄
     */
    setLianzhuang: function (userID) {
        if (userID > 0) {
            var player = playerMgr.Instance().getPlayer(userID);
            if (player) {
                var str = cc.dd.Text.TEXT_DESK_INFO_2.format([cc.dd.Utils.substr(player.nickname, 0, 5)]);
                DeskED.notifyEvent(DeskEvent.TIPS_POP, str);
            }
        }
    },

    /**
     * 结算
     * @param msg
     */
    jiesuan: function (msg) {
        cc.log('【数据】shmj普通结算 开始 ',this.isPlayHuAni);
        if(msg){
            this.isDajiesuan = msg.isend;
            this.isGameEnd = msg.isend;
        }
        if( this.isPlayHuAni ) {
            if(!cc.dd._.isUndefined(msg) && !cc.dd._.isNull(msg)){
                this.jiesuanData = msg;
            }
            return ;
        }
        if( msg == null ) {
            msg = this.jiesuanData;
        }
        if( this.jiesuanData == null && msg == null ) {
            return;
        }

        if(this.jiesuanData){
            this.jiesuanMsg = this.jiesuanData;
        }

        //处理玩家分数
        var userInfo = msg.playercoininfoList;
        for (var i in userInfo) {
            playerMgr.Instance().setUserPlayerCoin(userInfo[i].userid, userInfo[i].nowscore);
        }
        DeskED.notifyEvent(DeskEvent.JIESUAN, [msg]);
        cc.log('【数据】shmj普通结算 结算');
    },

    /**
     * 显示结算视图
     */
    showResultView: function (data) {
        cc.log('【数据】shmj战绩结算 ');
        this._TongjiData = data;
        var userInfo = data.resultuserinfoList;
        for (var i = 0; userInfo && i < userInfo.length; ++i) {
            var user = playerMgr.Instance().getPlayer(userInfo[i].userid)
            if (user) {
                userInfo[i].username = user.nickname;//找到名字
                userInfo[i].sex = user.sex;
                userInfo[i].viewIdx = user.idx;
                if (this.owner === user.userId) {
                    userInfo[i].owner = true;
                } else {
                    userInfo[i].owner = false;
                }
            }
        }
        //获得房间号
        data.roomNum = this.roomNumber;
        //解散时收到结算消息打开结算界面
        if(!this.isReplay()){
            DeskED.notifyEvent( DeskEvent.SHOW_RESULT_VIEW );
        }
    },

    getTongjiData: function () {
        return this._TongjiData;
    },
    /**
     *  成功进入场景后 恢复场景
     */
    enterSceneRecoverDesk: function (endcall) {
        // 正常连接
        if (this.isReconnect == 2) {
            if (endcall) {
                endcall();
            }
            this.setCurrRound(this.currPlayCount);
            //需要断线重连时
            //初始化牌墙
            var user = playerMgr.Instance().getPlayer(this.banker);
            if (user) {
                user.setBank();
                DeskED.notifyEvent(DeskEvent.RECV_PAIQIANG, [user.viewIdx, this.remainCards, this.endEmpty]);
                DeskED.notifyEvent(DeskEvent.MO_HUAN_BAO_PAI, [this.unBaopai, null]);
            }
        }
    },

    // 发起解散房间
    // --------------------------------
    // @param msg [object] 网络层发来的数据
    sponsorDissolveRoom: function (msg) {
        var text = "【数据】发起解散房间 ";
        if (!msg.sponsorid) {
            cc.error(text + "发起解散用户ID为null");
        } else if (!msg.useridList) {
            cc.error(text + "发起解散散用户ID为null");
        } else if (!msg.countdown) {
            cc.error(text + "倒计时为null");
        }
        JieSanData.setJieSanData(msg);
        DeskED.notifyEvent(DeskEvent.SPONSOR_DISSOLVE_ROOM, [msg]);
    },

    setisFenzhangMopai: function () {
        if (this.isFenZhang) {
            cc.log('【数据】发送分张摸牌消息 ');
            DeskED.notifyEvent(DeskEvent.MO_PAI_FEN_ZHANG);
        }
    },
    fenzhang: function () {
        this.isFenZhang = true;
        cc.log('【数据】设置分张摸牌状态 ');
        DeskED.notifyEvent(DeskEvent.FEN_ZHANG, []);
        DeskED.notifyEvent(DeskEvent.SHOW_DA_PAI_PROMPT, [-2,false]);
    },

    // 响应解散房间
    // --------------------------------
    // @param msg [object] 网络层发来的数据
    responseDissolveRoom: function (msg) {
        JieSanData.updateUserAgree(msg);
        DeskED.notifyEvent(DeskEvent.RESPONSE_DISSOLVE_ROOM, [msg]);
    },

    isFriend: function () {
        var g_id = RoomMgr.Instance().gameId==cc.dd.Define.GameType.SHMJ_FRIEND;
        var c_name = cc.dd.SceneManager.getCurrScene().name==cc.dd.Define.GameId[cc.dd.Define.GameType.SHMJ_FRIEND];
        return g_id && c_name;
    },

    isReplay: function () {
        var c_name = cc.dd.SceneManager.getCurrScene().name=='shmj_replay_game';
        return c_name;
    },

    isJBC: function () {
        var g_id = RoomMgr.Instance().gameId==cc.dd.Define.GameType.SHMJ_GOLD;
        var c_name = cc.dd.SceneManager.getCurrScene().name==cc.dd.Define.GameId[cc.dd.Define.GameType.SHMJ_GOLD];
        return g_id && c_name;
    },

    isMatch: function () {
        var g_id = RoomMgr.Instance().gameId==cc.dd.Define.GameType.SHMJ_MATCH;
        var c_name = cc.dd.SceneManager.getCurrScene().name==cc.dd.Define.GameId[cc.dd.Define.GameType.SHMJ_MATCH];
        return g_id && c_name;
    },

    isInMaJiang: function () {
        let scenename = cc.dd.SceneManager.getCurrScene().name;
        if(scenename == cc.dd.Define.GameId[cc.dd.Define.GameType.SHMJ_GOLD] || scenename == cc.dd.Define.GameId[cc.dd.Define.GameType.SHMJ_FRIEND] || scenename == 'shmj_replay_game' || cc.dd.Define.GameId[cc.dd.Define.GameType.SHMJ_MATCH]){
            return true
        }else{
            return false;
        }
    }
    // update (dt) {},
});

module.exports = {
    DeskEvent: jlmj_desk_data.DeskEvent,
    DeskED: jlmj_desk_data.DeskED,
    DeskData: SHMJDeskData,
};