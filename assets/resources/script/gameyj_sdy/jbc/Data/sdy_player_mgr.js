var Player = require('sdy_player_data').PlayerData;
var UserPlayer = require('sdy_userPlayer_data');

/**
 * 事件类型
 */
var PlayerMgrEvent = cc.Enum({

});

/**
 * 事件管理
 */
var PlayerMgrED = new cc.dd.EventDispatcher;

var PlayerMgr = cc.Class({

    s_playerMgr: null,

    statics: {

        Instance: function () {
            if (this.s_playerMgr == null) {
                this.s_playerMgr = new PlayerMgr();
            }
            return this.s_playerMgr;
        },

        Destroy: function () {
            if (this.s_playerMgr) {
                this.s_playerMgr = null;
            }
        },
    },

    ctor: function () {
        this.clear();
    },

    clear: function () {
        this.playerList = new Array(4);
        for(var i=0; i<4; ++i){
            this.playerList[i] = null;
        }
        UserPlayer.Instance().clear();
    },

    setData: function (msg) {
        this.clear();
        for(var i=0; i<msg.userInfoList.length; ++i){
            if(msg.userInfoList[i].userId == cc.dd.user.id){
                this.playerList[i] = UserPlayer.Instance();
            }else{
                this.playerList[i] = new Player();
            }
            this.playerList[i].setGameData(msg.userInfoList[i]);
        }
        this.playerList.forEach(function (player) {
            if( player != null ){
                //设置玩家视觉座位
                if(player.user_id == cc.dd.user.id){
                    player.view_idx = 0;
                }else{
                    var userPlayer = this.getPlayer(cc.dd.user.id);
                    if(userPlayer != null){
                        if(player.seat>userPlayer.seat){
                            player.view_idx = player.seat - userPlayer.seat;
                        }else{
                            player.view_idx = 3 - userPlayer.seat + player.seat + 1;
                        }
                    }else{
                        cc.error('找不到用户玩家 id=', cc.dd.user.id);
                    }
                }
            }
        }.bind(this));
    },

    playerEnter: function (role_info) {
        if(role_info.userId == cc.dd.user.id){
            var player = UserPlayer.Instance();
        }else{
            var player = new Player();
        }
        player.setRoomMgrData(role_info);

        //设置玩家视觉座位
        if(player.user_id == cc.dd.user.id){
            player.view_idx = 0;
        }else{
            var userPlayer = this.getPlayer(cc.dd.user.id);
            if(userPlayer != null){
                if(player.seat>userPlayer.seat){
                    player.view_idx = player.seat - userPlayer.seat;
                }else{
                    player.view_idx = 3 - userPlayer.seat + player.seat + 1;
                }
            }else{
                cc.error('找不到用户玩家 id=', role_info.user_id);
            }
        }
        this.playerList[player.seat] = player;
        // this.playerList[player.seat].enter();
    },

    playerExit: function (user_id) {
        for(var i=0; i<this.playerList.length; ++i){
            if(this.playerList[i] != null && this.playerList[i].user_id == user_id){
                // this.playerList[i].exit();
                this.playerList[i] = null;
            }
        }
    },

    getPlayer: function (user_id) {
        var result = null;
        this.playerList.forEach(function (player) {
            if( player!= null && player.user_id == user_id){
                result = player;
            }
        });
        return result;
    },

    getPlayerByViewIdx: function (viewIdx) {
        if(viewIdx<0 || viewIdx>3){
            cc.log("玩家视角座位号错误 viewIdx="+viewIdx+" 无法获取玩家");
            return null;
        }
        var player = null;
        this.playerList.forEach(function (item) {
            if(item){
                if(item.view_idx == viewIdx){
                    player = item;
                }
            }
        },this);
        if(!player){
            cc.log("三打一 找不到 视角座号="+viewIdx+" 的玩家");
        }
        return player;
    },

    getPlayerNum: function() {
        var num = 0;
        this.playerList.forEach( function(player) {
            if( !cc.dd.Utils.isNull( player ) ) {
                ++num;
            }
        } );
        return num;
    },

    /**
     * 注册房间内语音玩家
     */
    requesYuYinUserData: function () {
        cc.dd.AudioChat.clearUsers();
        this.playerList.forEach(function (player) {
            if(player!=null){
                //不是用户玩家,并且在线
                if( player.user_id != cc.dd.user.id && player.isOnLine ){
                    cc.dd.AudioChat.addUser(player.userId);
                }
            }
        },this);
    },

    getBanker: function () {
        var banker = null;
        this.playerList.forEach( function(player) {
            if(player.banker){
                banker = player;
            }
        } );
        return banker;
    },

    isWaveStart: function () {
        var send_num = 0;
        this.playerList.forEach(function (player) {
            if( player!= null ){
                if( !cc.dd._.isUndefined(player.cur_send_poker) && !cc.dd._.isNull(player.cur_send_poker) && player.cur_send_poker!=0 ){
                    send_num += 1;
                }
            }
        });
        return send_num == 1;
    },
    
    getLastPlayer: function (view_idx) {
        var last_view_idx = view_idx - 1;
        if(last_view_idx == -1){
            last_view_idx = 3;
        }
        return this.getPlayerByViewIdx(last_view_idx);
    },

});

module.exports = {
    PlayerMgrEvent:PlayerMgrEvent,
    PlayerMgrED:PlayerMgrED,
    PlayerMgr:PlayerMgr,
};

