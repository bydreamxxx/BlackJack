/**
 * Created by yons on 2017/5/25.
 */

var dd = cc.dd;
var PlayerData = require("jlmj_player_data").PlayerData;
var UserPlayer = require("jlmj_userPlayer_data").Instance();
var RoomMgr = require('jlmj_room_mgr').RoomMgr;


var PlayerMgr = cc.Class({

    s_playerMgr: null,

    statics: {

        Instance: function () {
            if(!this.s_playerMgr){
                this.s_playerMgr = new PlayerMgr();
            }
            return this.s_playerMgr;
        },

        Destroy: function () {
            if(this.s_playerMgr){
                this.s_playerMgr.clear();
                this.s_playerMgr = null;
            }
        },

    },

    properties: {

    },

    ctor: function () {
        this.playerList = [];
        this.playerListInited = false;  //玩家列表初始化
        this.playing_fapai_ani = false; //正在播放玩家发牌动画
        this.playing_shou2mid_ani = false; //正在播放玩家手牌->中间牌动画
        // this.normal_mopaiing = false; //正常摸牌中
        this.shou2mid_id_list = [];    //手牌->中间牌的动画标识列表
        this.mid2dapai_id_list = [];    //中间牌->牌海的动画标识列表
        this.dabaoing_chupai_id = null; //打包中的出牌id
        this.chupai_timeout_on_ting = false; //听牌时,出牌延时
    },

    /**
     * 隐藏 所有玩家准备状态
     */
    hidePlayerReady: function() {
       this.playerList.forEach( function( player ) {
            player.setReady( 0 );
        } );
    },

    /**
     * 设置玩家数量
     */
    updatePlayerNum: function (num) {
        if(this.playerListInited){
            return;
        }
        UserPlayer.clear();
        cc.log("清空玩家列表 初始化");
        if(RoomMgr.Instance().gameId == cc.dd.Define.GameType.JLMJ_FRIEND){    //朋友场
            this.playerList = new Array(RoomMgr.Instance()._Rule.usercountlimit);
            this.playerListInited = true;
        }else{
            this.playerList = new Array(num);
            if(cc.dd._.isNumber(num)){
                this.playerListInited = true;
            }
        }
    },

    setPlayerList: function (playerList) {
        this.updatePlayerNum(playerList.length);
        playerList.sort(function (a,b) {
            if(a.userid==cc.dd.user.id){
                return -1;
            }else{
                return 1;
            }
        });

        this.tempPlayerList = this.playerList.slice();

        playerList.forEach(function (playerMsg,idx) {
            if(playerMsg&&playerMsg.userid){
                if(idx == 0){
                    var userPlayerFirst = playerMsg.userid==dd.user.id;
                    cc.log("初始玩家列表第一位是否为用户玩家:"+userPlayerFirst);
                }
                this.gamePlayerEnter(playerMsg);
            }
        },this);

        this.tempPlayerList = [];

        this.playerList.forEach(function(pd){
            this._gamePlayerEnter(pd);
        }, this)
    },

    getPlayerList: function(){
        return this.playerList;
    },

    setPlayerCardList: function (playerCardList) {
        //var is_set_CardList = false;
        playerCardList.forEach(function (Msg) {
            var player = this.getPlayer(Msg.userid);
            if(player){
                player.setCardList(Msg);
                //is_set_CardList = true;
            }
        },this);
        //if(!is_set_CardList){
        //   this.playerCardList = playerCardList;
        //}
    },

    playerEnter: function (role_info) {
        var DeskData = require('jlmj_desk_data').DeskData;
        if(DeskData.Instance().isReconnect == 2){
            return;
        }
        if(role_info.userId == cc.dd.user.id){
            var player = UserPlayer;
        }else{
            var player = this.getPlayer(role_info.userId);
            if(!player){
                player = new PlayerData();
            }
        }
        player.clear();
        player.setBaseData(role_info);
        var RoomMgr = require( "jlmj_room_mgr" ).RoomMgr.Instance();
        if(RoomMgr.gameId==cc.dd.Define.GameType.JLMJ_FRIEND){
            player.coin = RoomMgr.getCoinByGuangGuo(RoomMgr._Rule.guangguotype);
        }
        //设置是否在线
        player.setOnLineNoMsg(role_info.state == 1);

        //设置玩家视觉座位
        if(player.isUserPlayer()){
            //自己视觉座位号
            player.viewIdx = 0;
        }else if(this.playerList.length == 2){
            //二人麻将 视觉座位号
            player.viewIdx = 2;
        }else if(this.playerList.length == 3 ){
            //三人麻将 视觉座位号
            var offset = UserPlayer.idx - player.idx;
            if(offset == -1){
                player.viewIdx = 1;
            }else if(offset == 2 || offset == -2){
                player.viewIdx = 2;
            }else if(offset == 1){
                player.viewIdx = 3;
            }else{
                player.viewIdx = 0;
            }
        }else {
            //四人麻将 视觉座位号
            if(player.idx>UserPlayer.idx){
                player.viewIdx = player.idx - UserPlayer.idx;
            }else{
                player.viewIdx = 3 - UserPlayer.idx + player.idx + 1;
            }
        }
        this.playerList[player.idx] = player;
        this.playerList[player.idx].enter();
        this.playerNumChanged();
        this.requesYuYinUserData();

        //var play_list = cc.find('Canvas/player_list').getComponent('jlmj_player_list');
        //play_list.playerUpdateUI();
    },

    /**
     * 玩家进入
     * @param playerMsg
     */
    gamePlayerEnter: function (playerMsg) {
        if(playerMsg.site<0 || playerMsg.site>=this.playerList.length){
            cc.error("玩家座位号错误 size="+playerMsg.site);
            return;
        }
        //如果有这个id的玩家则返回 没有新建
        if(playerMsg.userid == cc.dd.user.id){
            var pd = UserPlayer;
        }else{
            var pd = this.getTempBasePlayer(playerMsg.userid);
            if(!pd){
                pd = new PlayerData();
            }
        }
        pd.setGameData(playerMsg);
        //设置玩家视觉座位
        if(pd.isUserPlayer()){
            //自己视觉座位号
            pd.viewIdx = 0;
        }else if(this.playerList.length == 2){
            //二人麻将 视觉座位号
            pd.viewIdx = 2;
        }else if(this.playerList.length == 3 ){
            //三人麻将 视觉座位号
            var offset = UserPlayer.idx - pd.idx;
            if(offset == -1){
                pd.viewIdx = 1;
            }else if(offset == 2 || offset == -2){
                pd.viewIdx = 2;
            }else if(offset == 1){
                pd.viewIdx = 3;
            }else{
                pd.viewIdx = 0;
            }
        }else {
            //四人麻将 视觉座位号
            if(pd.idx>UserPlayer.idx){
                pd.viewIdx = pd.idx - UserPlayer.idx;
            }else{
                pd.viewIdx = 3 - UserPlayer.idx + pd.idx + 1;
            }
        }
        this.playerList[pd.idx] = pd;
        // pd.enter();
        // cc.log("玩家"+pd.userId+" 座位号:"+pd.idx+" 视角座位号:"+pd.viewIdx+" 进入房间");
        // this.playerNumChanged();
        // this.requesYuYinUserData();
    },

    _gamePlayerEnter(pd){
        pd.enter();
        cc.log("玩家"+pd.userId+" 座位号:"+pd.idx+" 视角座位号:"+pd.viewIdx+" 进入房间");
        this.playerNumChanged();
        this.requesYuYinUserData();
    },

    playerExit: function (userid) {
        var playerIdx = this.getPlayerIdx(userid);
        if(playerIdx>=0 && playerIdx<this.playerList.length){
            this.playerList[playerIdx].exit();
            cc.log("玩家 "+userid+" 座位号: "+playerIdx+" 退出房间");
            this.playerList[playerIdx] = null;
        }else{
            cc.log("找不到 id="+userid+" 的玩家");
        }
        this.playerNumChanged();
        this.requesYuYinUserData();
        if(userid == cc.dd.user.id){
            cc.log("自己离开房间,清空玩家列表");
            this.playerListInited = false;
            UserPlayer.clear();
            this.playerList = [];
        }
    },

    playerNumChanged:function(){
        if(this.DeskED==null || this.DeskEvent==null){
            this.requireDeskData();
        }
        var num=0;
        this.playerList.forEach(function(element) {
            if(element){
                num++;
            }
        }, this);
        this.DeskED.notifyEvent(this.DeskEvent.UPDATE_PLAYER_NUM,num);
        cc.log('更新玩家数量:'+num);
    },

    getPlayerNum: function () {
        var num=0;
        this.playerList.forEach(function(element) {
            if(element){
                num++;
            }
        }, this);
        return num;
    },

    requireDeskData:function(){
        this.DeskED = require('jlmj_desk_data').DeskED;
        this.DeskEvent = require('jlmj_desk_data').DeskEvent;
    },

    getPlayer: function (userid) {
        var player = null;
        this.playerList.forEach(function (item, idx) {
            if(item){
                if(item.userId == userid){
                    player = item;
                }
            }
        },this);
        if(!player){
            cc.log("玩家列表中无玩家 "+userid);
        }
        return player;
    },

    getTempBasePlayer(userid){
        var player = null;
        this.tempPlayerList.forEach(function (item, idx) {
            if(item){
                if(item.userId == userid){
                    player = item;
                }
            }
        },this);
        if(!player){
            cc.log("座位玩家列表中无玩家 "+userid);
        }
        return player;
    },

    getPlayerByIdx: function (idx) {
        if(idx<0 || idx>=this.playerList.length){
            cc.log("玩家座位号错误 size="+idx+" 无法获取玩家");
            return null;
        }
        return this.playerList[idx];
    },

    getPlayerByViewIdx: function (viewIdx) {
        // 二人麻将 三人麻将  视觉座位号 会偏大
        // if(viewIdx<0 || viewIdx>=this.playerList.length){
        //     cc.log("玩家视角座位号错误 viewIdx="+viewIdx+" 无法获取玩家");
        //     return null;
        // }
        var player = null;
        this.playerList.forEach(function (item) {
            if(item){
                if(item.viewIdx == viewIdx){
                    player = item;
                }
            }
        },this);
        if(!player){
            cc.log("找不到 视角座号="+viewIdx+" 的玩家");
        }
        return player;
    },

    getPlayerIdx: function (userid) {
        var playerIdx = null;
        this.playerList.forEach(function (item, idx) {
            if(item){
                if(item.userId == userid){
                    playerIdx = idx;
                }
            }
        },this);
        if(playerIdx==null){
            cc.log("找不到 座号="+playerIdx+" 的玩家");
        }
        return playerIdx;
    },

    getUserPlayer: function () {
        return this.getPlayer(dd.user.id);
    },

    /**
     * 通过状态查找玩家
     * @param state
     * @returns {*}
     */
    getPlayerByState: function (state) {
        var player = null;
        this.playerList.forEach(function (item) {
            if(item){
                if(item.state == state){
                    player = item;
                }
            }
        },this);

        if(!player){
            cc.log("找不到 玩家状态="+state+" 的玩家");
        }
        return player;
    },

    /**
     * 设置玩家分数
     */
    setUserPlayerCoin:function (userID, coin) {
        var user = this.getPlayer(userID);
        if(user){
            user.setCoin(coin);
        }
    },

    /**
     * 清理玩家数据
     */
    clear: function () {
        this.playerList.forEach(function (player) {
            if(player){
               player.clear();
            }
        },this);

        this.playing_fapai_ani = false; //正在播放玩家发牌动画
        this.playing_shou2mid_ani = false; //正在播放玩家手牌->中间牌动画,包过停留
        this.shou2mid_id_list = [];    //手牌->中间牌的动画标识列表
        this.mid2dapai_id_list = [];    //中间牌->牌海的动画标识列表
        this.dabaoing_chupai_id = null; //打包中的出牌id
        this.chupai_timeout_on_ting = false; //听牌时,出牌延时
    },

    /**
     * 清理玩家数据
     */
    clearPai: function () {
        this.playerList.forEach(function (player) {
            if(player){
                player.clearPai();
            }
        },this);

        this.playing_fapai_ani = false; //正在播放玩家发牌动画
        this.playing_shou2mid_ani = false; //正在播放玩家手牌->中间牌动画,包过停留
        this.shou2mid_id_list = [];    //手牌->中间牌的动画标识列表
        this.mid2dapai_id_list = [];    //中间牌->牌海的动画标识列表
        this.dabaoing_chupai_id = null; //打包中的出牌id
        this.chupai_timeout_on_ting = false; //听牌时,出牌延时
    },

    /**
     * 停止所有该谁打牌动画
     */
    clearAlldapaiCding: function() {
        this.playerList.forEach(function (player) {
            if(player){
                player.cleardapaiCding();
            }
        },this);
    },

    /**
     * 注册房间内语音玩家
     */
    requesYuYinUserData: function () {
        cc.dd.AudioChat.clearUsers();
        this.playerList.forEach(function (player) {
            if(player){
                //不是用户玩家,并且在线
                if( player.userId != dd.user.id && player.isOnLine ){
                    cc.dd.AudioChat.addUser(player.userId);
                }
            }
        },this);
    },

    getPlayerViewIdxByYuYin: function (yuyin_account) {
        var playerViewIdx = null;
        this.playerList.forEach(function (item) {
            if(item){
                var openid = cc.dd.prefix+item.openid;
                if(openid.toLowerCase() == yuyin_account.toLowerCase()){
                    playerViewIdx = item.viewIdx;
                }
            }
        },this);
        if(playerViewIdx == null){
            // cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_SYSTEM_9+yuyin_account);
            cc.log("找不到 语音账号="+yuyin_account+" 的玩家");
        }
        cc.log(this.playerList);
        return playerViewIdx;
    },

    /**
     * 玩家摸牌动作
     */
    playerMoPaiAction: function () {
        this.playerList.forEach(function (player) {
            if(player&&player.hasMoPai()){
                player.mopaiAction();
            }
        });
    },

    /**
     * 玩家中间牌->打牌动作
     */
    playerMid2DapaiAction: function (id) {
        this.playerList.forEach(function (player) {
            if(player){
                player.play_mid2dapai_action(id);
            }
        });
    },

    /**
     * 设置庄家
     * @param user_id
     */
    setBanker: function(user_id){
        this.playerList.forEach(function (player) {
            player.isbanker = player.userId == user_id;
        });
    },

    get3RenMjNoExistViewIdx: function () {
        var view_idxs = [0,1,2,3];
        var player_view_idxs = [];
        this.playerList.forEach(function (player) {
            if(player){
                player_view_idxs.push(player.viewIdx);
            }
        });
        var diff = cc.dd._.difference(view_idxs,player_view_idxs);
        return diff[0];
    },

});

module.exports = PlayerMgr;
