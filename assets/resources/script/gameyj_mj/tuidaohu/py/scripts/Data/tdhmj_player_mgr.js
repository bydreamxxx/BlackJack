var jlmj_player_mgr = require('jlmj_player_mgr');
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var PlayerData = require("tdhmj_player_data").PlayerData;
var UserPlayer = require("tdhmj_userPlayer_data").Instance();

var PlayerMgr = cc.Class({
    s_playerMgr: null,
    extends:jlmj_player_mgr,
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
     * 设置玩家数量
     */
    updatePlayerNum: function (num) {
        if(this.playerListInited){
            return;
        }
        UserPlayer.clear();
        cc.log("清空玩家列表 初始化");
        if(RoomMgr.Instance().gameId == cc.dd.Define.GameType.TDHMJ_FRIEND){    //朋友场
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
                    var userPlayerFirst = playerMsg.userid==cc.dd.user.id;
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

    playerEnter: function (role_info) {
        var DeskData = require('tdhmj_desk_data').DeskData;
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
        if(RoomMgr.gameId==cc.dd.Define.GameType.TDHMJ_FRIEND){
            player.coin = 1000;//RoomMgr.getCoinByGuangGuo(RoomMgr._Rule.guangguotype);
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

    requireDeskData:function(){
        this.DeskED = require('tdhmj_desk_data').DeskED;
        this.DeskEvent = require('tdhmj_desk_data').DeskEvent;
    },
});

module.exports = PlayerMgr;
