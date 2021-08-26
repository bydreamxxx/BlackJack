/**
 * Created by zhanghuaxiong on 2017/5/16.
 */

var tdk = cc.dd.tdk || {};
const lib = cc.dd.lib;

tdk.GameData = {
    /**
     * 玩家正在游戏中关闭app重新登陆之后的回调
     */
    continueGameCallback:null,
    /**
     * 玩家创建房间回调
     */
    createGameCallback:null,
    /**
     * 玩家加入房间回调
     */
    joinGameCallback:null,

    /**
     * 房间信息
     */
    _deskInfo:null,

    /**
     * 当前局数
     */
    curGameCnt:1,

    /**
     * 玩家信息
     */
    _playerInfo:null,

    /**
     * 玩家自己的userid
     */
    _selfId:null,

    /**
     * 是否是房主
     */
    isRoomOwner : false,

    /**
     * 玩家列表
     */
    userList:[],
    /**
     * 游戏状态
     */
    gameInfo:null,
    /**
     * 玩家纸牌
     */
    userpokerList:null,
    /**
     * 解散房间决定
     */
    desicionList:null,
    /**
     * 是否重连
     */
    reconnect:false,
    /**
     * 是否平局（烂锅）
     */
    isTie : false,
    /**
     * 平局次数
     */
    tieCnt:0,
    /**
     * 玩家游戏状态，游戏前还是游戏中
     */
    isGaming : false,

    /**
     *  游戏是否存在
     */
    gameExist : false,

    /**
     * 游戏类型
     */
    gameType : null,

    /**
     * 最大下注
     */
    maxBet:0,

    /**
     * 玩家信息
     */
    userInfo:{
        id:0,
        nick:'游客',
        sex:0,
    },

    /**
     * 游戏内断线重连测试数据
     */
    gamingReconnectTestData:null,
    /**
     * 游戏内断线重连状态
     */
    bGamingReconnect:false,

    /**
     * 玩家脚本组件列表
     */
    player_list:[],

    /**
     * 是否点击了退出或者解散按钮
     */
    isClickExitOrDissolveBtn:false,

    /**
     * 游戏id
     */
    gameId : 0,

    /**
     * 房间id
     */
    roomId : 0,

    wxInfo_list:[],

    setTie : function (state) {
        this.isTie = state;
        if(state){
            this.tieCnt++;
        }else{
            this.tieCnt = 0;
        }
    },

    /**
     * 设置是否点击退出或者解散房间按钮状态
     * @param state
     */
    setRoomMenuBtnState:function (state) {
        this.isClickExitOrDissolveBtn = state;
    },

    addPlayerWxInfo:function (data) {
        cc.log('[data]tdk_game_data:addPlayerWxInfo:data=',JSON.stringify(data));
        this.wxInfo_list.push(data);
    },

    getWxInfoById:function (userid) {
        var wxinfo=null;
        this.wxInfo_list.forEach(function (item) {
            if(item.userid == userid){
                wxinfo = item.wx;
            }
        });
        return wxinfo;
    },

    /**
     * 重置回掉函数
     */
    resetCallback:function () {
        this.continueGameCallback = null;
        this.createGameCallback = null;
        this.joinGameCallback = null;
    },

    /**
     * 重置数据
     */
    resetData : function () {
        cc.log('[data]tdk_game_data::resetData!');
        this.reconnect = false;
        this.isGaming = false;
        this.isRoomOwner = false;
        this.curGameCnt = 1;
        this.wxInfo_list = [];
        this.player_list = [];
    },

    /**
     * 增加玩家脚本对象
     * @param player
     */
    addPlayerToList:function (player) {
        this.player_list.push(player);
    },

    /**
     * 通过玩家id找到脚本对象
     * @param userid
     */
    findPlayerFromListById:function (userid) {
        var tmp=null;
        this.player_list.forEach(function (item) {
            if(item.userId == userid){
                tmp = item;
            }
        });
        return tmp;
    },

    /**
     * 设置网络数据
     */
    setMsgData: function (msg) {
        lib.copy(msg).toCover(this);
    },

    deleteUserId : function (userid) {
        for(var i=0; i<this.userList.length; i++){
            if(this.userList[i].userid == userid){
                this.userList.splice(i,1);
                break;
            }
        }
    },
}

module.exports = tdk.GameData;
