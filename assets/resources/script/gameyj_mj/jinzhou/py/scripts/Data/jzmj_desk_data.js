var dd = cc.dd;
var DeskEvent = require("jlmj_desk_data").DeskEvent;
var DeskED = require("jlmj_desk_data").DeskED;

var jlmj_desk_data = require("jlmj_desk_data");
var JieSanData = require('jzmj_jiesan_data').JieSanData.Instance();
var pai3d_value = require("jlmj_pai3d_value");
var RoomMgr = require('jlmj_room_mgr').RoomMgr;

var playerMgr = require('jzmj_player_mgr');

const GameState = {
    NoStart: 1,
    Start: 2,
}

var JZMJDeskData = cc.Class({
    extends: jlmj_desk_data.DeskData,

    properties: {

    },

    statics: {

        Instance: function () {
            if (!this.s_desk) {
                this.s_desk = new JZMJDeskData();
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
        // this._super();
        // 还剩几张麻将牌
        this.remainCards = 112;
        this.liangPaiList = [];
    },
    clear: function () {
        this._super();
        this.remainCards = 112;
        this.setRemainCard(112);
        this.is_genzhuang = false;
        this.liangPaiList = [];
    },
    /**
     * 是否还有剩余牌
     * @returns {boolean}
     */
    hasRemainPai: function () {
        return this.remainCards > 8;
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
        cc.log('【数据】JZMJ普通结算 开始');
        if( this.isPlayHuAni ) {
            this.jiesuanData = msg;
            this.isDajiesuan = msg.isend;
            this.isGameEnd = msg.isend;
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
        cc.log('【数据】JZMJ普通结算 结算');
    },

    /**
     * 显示结算视图
     */
    showResultView: function (data) {
        cc.log('【数据】JZMJ战绩结算 ');
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
        var g_id = RoomMgr.Instance().gameId==cc.dd.Define.GameType.JZMJ_FRIEND;
        var c_name = cc.dd.SceneManager.getCurrScene().name==cc.dd.Define.GameId[cc.dd.Define.GameType.JZMJ_FRIEND];
        return g_id && c_name;
    },

    isReplay: function () {
        var g_id = RoomMgr.Instance().gameId==cc.dd.Define.GameType.JZMJ_FRIEND;
        var c_name = cc.dd.SceneManager.getCurrScene().name=='jzmj_replay_game';
        return g_id && c_name;
    },

    isJBC: function () {
        var g_id = RoomMgr.Instance().gameId==cc.dd.Define.GameType.JZMJ_GOLD;
        var c_name = cc.dd.SceneManager.getCurrScene().name==cc.dd.Define.GameId[cc.dd.Define.GameType.JZMJ_GOLD];
        return g_id && c_name;
    },

    isMatch: function () {
        var g_id = RoomMgr.Instance().gameId==cc.dd.Define.GameType.JZMJ_MATCH;
        var c_name = cc.dd.SceneManager.getCurrScene().name==cc.dd.Define.GameId[cc.dd.Define.GameType.JZMJ_MATCH];
        return g_id && c_name;
    },

    isInMaJiang: function () {
        let scenename = cc.dd.SceneManager.getCurrScene().name;
        if(scenename == cc.dd.Define.GameId[cc.dd.Define.GameType.JZMJ_GOLD] || scenename == cc.dd.Define.GameId[cc.dd.Define.GameType.JZMJ_FRIEND] || scenename == 'jzmj_replay_game' || cc.dd.Define.GameId[cc.dd.Define.GameType.JZMJ_MATCH]){
            return true
        }else{
            return false;
        }
    },

    isHunPai: function(id){
        let des = pai3d_value.desc[id].split('[')[0];
        return des == this.hunPai;
    },

    isLiangPai: function(id){
        let result = false;
        let pai = Math.floor(id/4);
        if(this.liangPaiList.length > 0){
            for(let i = 0; i < this.liangPaiList.length; i++){
                let baopai = this.liangPaiList[i];
                if(baopai >= 0){
                    let des = Math.floor(baopai/4);
                    if(des === pai){
                        result = true;
                        break;
                    }
                }
            }
        }
        return result;
    },

    /**
     * 设置宝牌
     * @param baoPaiValue 宝牌的值
     */
    setBaoPai: function (baoPaiValue) {
        this.unBaopai = baoPaiValue;
        if(this.unBaopai >= 0){
            let des = pai3d_value.desc[this.unBaopai].split('[')[0];
            if(des == '中'){
                this.hunPai = '中'
            }else{
                this.hunPai = this.getHunPaiStr(des[0]) + des[1];
            }
        }
        if(this.liangPaiList.indexOf(this.unBaopai) == -1){
            this.liangPaiList.push(baoPaiValue);
        }
        cc.log("亮牌值:", baoPaiValue, "混牌 ", this.hunPai);
        // DeskED.notifyEvent(DeskEvent.UPDATE_BAO_PAI, []);
    },

    getHunPaiID(){
        switch(this.hunPai){
            case '中':
                return 108;
            case '一筒':
                return 0;
            case '二筒':
                return 4;
            case '三筒':
                return 8;
            case '四筒':
                return 12;
            case '五筒':
                return 16;
            case '六筒':
                return 20;
            case '七筒':
                return 24;
            case '八筒':
                return 28;
            case '九筒':
                return 32;
            case '一条':
                return 36;
            case '二条':
                return 40;
            case '三条':
                return 44;
            case '四条':
                return 48;
            case '五条':
                return 52;
            case '六条':
                return 56;
            case '七条':
                return 60;
            case '八条':
                return 64;
            case '九条':
                return 68;
            case '一万':
                return 72;
            case '二万':
                return 76;
            case '三万':
                return 80;
            case '四万':
                return 84;
            case '五万':
                return 88;
            case '六万':
                return 92;
            case '七万':
                return 96;
            case '八万':
                return 100;
            case '九万':
                return 104;
        }
    },

    getHunPaiStr(str){
        switch(str){
            case '一':
                return '二';
            case '二':
                return '三';
            case '三':
                return '四';
            case '四':
                return '五';
            case '五':
                return '六';
            case '六':
                return '七';
            case '七':
                return '八';
            case '八':
                return '九';
            case '九':
                return '一';
        }
    }
    // update (dt) {},
});

module.exports = {
    DeskEvent: jlmj_desk_data.DeskEvent,
    DeskED: jlmj_desk_data.DeskED,
    DeskData: JZMJDeskData,
};