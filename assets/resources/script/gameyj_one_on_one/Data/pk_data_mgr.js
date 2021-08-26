//create by wj 2019/02/13
var PK_MgrEvent = cc.Enum({
    PK_INIT_UI_DATA: 'pk_init_ui_data',//获取到服务器的数据，更新界面显示
    PK_UPDATE_BET_INFO:'pk_update_bet',//更新区域下注和总下注数据
    PK_UPDATE_SELF_BET_INFO:'pk_update_self_bet',//更新个人下注
    PK_BET: 'pk_bet',//下注更新
    PK_CANCEL_BET: 'pk_bet_cancel',//取消下注
    PK_RESULT_GET: 'pk_result_get',//结果获取
    PK_UPDATE_STATE:'pk_update_state',//更新游戏状态
    PK_OPEN_POKER: 'pk_open_poker', //开启牌
    PLAYER_JOIN: 'player_join', //玩家进入
    PLAYER_EXIT: 'player_exit',//玩家退出
    PLYAER_COIN_CHANGE: 'player_coin_change', //玩家取出金币
});
var PK_MgrED = new cc.dd.EventDispatcher();

var pkDataMannger =  cc.Class({
    s_pk_data: null,
    statics: {
        Instance: function () {
            if (!this.s_pk_data) {
                this.s_pk_data = new pkDataMannger();
            }
            return this.s_pk_data;
        },

        Destroy: function () {
            if (this.s_pk_data) {
                this.s_pk_data.clear();
                this.s_pk_data = null;
            }
        },
    },


    //属性数据
    properties: {
        m_nDeskState: 0,//桌子状态
        m_nLeftTime: 0, //下一状态游戏操作时间
        m_nAllBet: 0,//总押注
        m_bIsReconnect: false, //是否断线重连
        m_nConfigId: 0, //配置表id
        m_tRoundData: [],//局数具体信息
        m_tWaybillData: [],//路单数据
        m_tOwnBetData:[],//个人下注数据
        m_tRank:[], //结算排行榜
        m_ResultPoker: [],//开牌
        m_tBetInfo: [], //下注具体数据
        m_nWinNum: 0, //净输赢
        m_nPlayerCoin: 0, //玩家身上金币
        m_nReelType: 0, //命运转盘类型
        m_nUserId: 0, //搓牌玩家id
        m_sName: null, //搓牌玩家的名字
        m_nUserType: 0, //搓牌玩家类型

    },

    ctor() {
        this.playerList = [];
    },

    //设置桌子状态
    setDeskData: function(nstate){
        this.m_nDeskState = nstate;
    },

    //获取桌子状态
    getDeskData: function(){
        return this.m_nDeskState;
    },

    //设置剩余操作时间
    setLeftTime: function(ntime, startTime){
        var mytime = Date.parse(new Date()) / 1000;
        if(startTime == 0)
            this.m_nLeftTime = ntime - mytime;
        else{
            this.m_nLeftTime = ntime - startTime;
        }
    },

    //获取剩余操作时间
    getLeftTime: function(){
        return this.m_nLeftTime;
    },

    //设置配置id
    setConfigId: function(configId){
        this.m_nConfigId = configId;
    },

    //获取配置ID
    getConfigId: function(){
        return this.m_nConfigId;
    },

    //设置是否重连标记
    setReconnectTag: function(tag){
        this.m_bIsReconnect = tag;
    },

    //获取是否重连标记
    getReconnectTag: function(){
        return this.m_bIsReconnect 
    },

    //重置重连标记
    resetReconnectTag: function(){
        this.m_bIsReconnect = false;
    },

    //更新总下注
    updateTotalBet: function(totalBet){
        this.m_nAllBet = totalBet;
    },

    //获取总下注
    getTotalBet: function(){
        return this.m_nAllBet;
    },

    //重置总下注
    resetAllBet: function(){
        this.m_nAllBet = 0;
    },

    //设置局数信息
    setRoundInfo: function(roundList){
        this.m_tRoundData = roundList;
    },

    //获取局数信息
    getRoundInfo: function(){
        return this.m_tRoundData;
    },

    //清除局数信息
    clearRoundInfo: function(){
        this.m_tRoundData.splice(0, this.m_tRoundData.length);
        this.m_tRoundData = [];
    },

    //设置下注具体数据
    setBetInfo: function(datalist){
        this.m_tBetInfo = datalist;
    },

    //获取下注具体数据
    getBetInfo: function(){
        return this.m_tBetInfo;
    },

    //清除下注数据
    clearBetInfo: function(){
        this.m_tBetInfo.splice(0 ,this.m_tBetInfo.length);
    },

    //设置路单
    setWaybillData: function(list){
        this.m_tWaybillData = list;
    },

    //获取路单
    getWaybillData: function(){
        return this.m_tWaybillData;
    },

    //更新路单
    updateWaybillData: function(data, reelType){
        var waybillData = 0;
        if(data.length == 1)
            waybillData = data[0] * 1000 + reelType;
        else
            waybillData = data[0] * 1000 + data[1];
        this.m_tWaybillData.push(waybillData);
        if(this.m_tWaybillData.length > 36){
            for(var i =0; i< 6; i++)
                this.m_tWaybillData.shift();
        }
    },

    //清除路单数据
    clearWayBillData: function(){
        this.m_tWaybillData.splice(0, this.m_tWaybillData.length);
    },

    //个人下注信息
    setSelfBetData: function(datalist){
        this.m_tOwnBetData = datalist;
    },

    //获取个人下注信息
    getSelfBetData: function(){
        return this.m_tOwnBetData;
    },

    //清除个人下注信息
    clearSelfBetData: function(){
        this.m_tOwnBetData.splice(0, this.m_tOwnBetData.length);
    },

    //设置牌数据
    setOpenPokerData: function(pokerList){
        this.m_ResultPoker = pokerList;
    },

    //获取开牌数据
    getOpenPokerData: function(){
        return this.m_ResultPoker;
    },

    //清除开牌数据
    clearOpenPokerData: function(){
        this.m_ResultPoker.splice(0, this.m_ResultPoker.length);
    },

    //设置结算排行
    setResultRankData: function(datalist){
        this.m_tRank = datalist;
    },

    //获取结算排行
    getResultRankData: function(){
        return this.m_tRank;
    },

    //设置玩家净输赢
    setSelfWinNum: function(winNum){
        this.m_nWinNum = winNum;
    },

    //获取玩家净输赢
    getSelfWinNum: function(){
        return this.m_nWinNum;
    },

    //重置玩家净输赢
    resetSelfWinNum: function(){
        this.m_nWinNum = 0;
    },

    //更新玩家身上金币
    updatePlayerCoin: function(coin){
        this.m_nPlayerCoin = coin;
    },

    //获取玩家身上金币
    getPlayerCoin: function(){
        return this.m_nPlayerCoin;
    },

    playerCoinChange: function(coin){
        this.m_nPlayerCoin = coin;
        PK_MgrED.notifyEvent(PK_MgrEvent.PLYAER_COIN_CHANGE);
    },

    //设置玩家初始金币
    setPlayerStartCoin: function(coin){
        this.m_nPlayerStartCoin = coin;
    },

    //获取玩家初始身上金币
    getStartCoin: function(){
        return this.m_nPlayerStartCoin;
    },

    //设置命运转轮类型
    setReelType: function(ntype){
        this.m_nReelType = ntype;
    },

    //设置命运转轮类型
    getReelType: function(){
        return this.m_nReelType;
    },

    //重置命运转轮
    resetReelType: function(){
        this.m_nReelType = 0;
    },

    //设置搓牌玩家信息
    setOpenPokerPlayerInfo: function(id, name, type){
        this.m_nUserId = id;
        this.m_sName = name;
        this.m_nUserType = type;
    },

    //获取搓牌玩家id
    getOpenPlayerId: function(){
        return this.m_nUserId;
    },

    //获取搓牌玩家名字
    getOpenPlayerName: function(){
        return this.m_sName;
    },

    //返回搓牌玩家类型： 0 玩家 1 机器人 2 系统
    getOpenUserType: function(){
        return this.m_nUserType;
    },

    //清除游戏数据
    clearAllData: function(){
        this.m_nAllBet = 0;
        this.m_bIsReconnect = false;
        this.m_tOwnBetData.splice(0, this.m_tOwnBetData.length);
        this.m_tRank.splice(0, this.m_tRank.length);
        this.m_ResultPoker.splice(0, this.m_ResultPoker.length);
        this.m_tBetInfo.splice(0, this.m_tBetInfo.length);
        this.m_nReelType = 0;
        this.m_nUserId = 0;
        this.m_sName = null;
        this.m_nUserType = 0;
    },

    /**
    * 初始化玩家公共数据
    * @param {player_common_data} role_info 
    */
   createCommonPlayer(role_info) {
    var playerData = {
        userId: role_info.userId,
        name: role_info.name,
        sex: role_info.sex,
        headUrl: role_info.headUrl,
        score: role_info.score,
        ip: null,
        seat: role_info.seat,
        isOnLine: role_info.state == 1,
        openId: role_info.openId,
        winTimes: role_info.winTimes,
        totalTimes: role_info.totalTimes,
        coin: role_info.coin,
        bready: role_info.isReady,
        level: role_info.level,
        exp: role_info.exp,
        vipLevel: role_info.vipLevel,
        location: role_info.latlngInfo,
        isSwitch: role_info.isSwitch,
        netState: role_info.netState,
        isBanker: false,
        setReady(r) { },
        setOnLine(ol) { },
     }
    return playerData;
},

    /**
     * 玩家进入
     * @param {player_common_data} role_info 
     */
    playerEnter(role_info) {
        this.deletePlayerData(role_info.userId);
        var player = this.createCommonPlayer(role_info);
        this.playerList.push(player);
        PK_MgrED.notifyEvent(PK_MgrEvent.PLAYER_JOIN, player);
    },

    deletePlayerData(id) {
        for (var i = 0; i < this.playerList.length; i++) {
            if (this.playerList[i].userId == id) {
                this.playerList.splice(i, 1);
                break;
            }
        }
    },

    /**
     * 玩家离开
     * @param {*} userId 
     */
    playerExit(userId) {
        if (userId == cc.dd.user.id) {
            return;
        }
        for (var i = 0; i < this.playerList.length; i++) {
            if (this.playerList[i].userId == userId) {
                this.playerList.splice(i, 1);
                break;
            }
        }
        PK_MgrED.notifyEvent(PK_MgrEvent.PLAYER_EXIT, null);
    },

    /**
     * 获取总玩家人数
     */
    getPlayerNum: function(){
        return this.othersNum;
    },

    getPlayer(id) {
        return this.getPlayerById(id);
    },

    /**
     * 通过id获取玩家数据
     * @param {Number} id 
     */
    getPlayerById(id) {
        for (var i = 0; i < this.playerList.length; i++) {
            if (this.playerList[i] && this.playerList[i].userId == id) {
                return this.playerList[i];
            }
        }
        return null;
    },

    updatePlayerNum() { },
    requesYuYinUserData() { },
    setReady(r) { },
    setOnLine(ol) { },
});

module.exports = {
    PK_Data_Mgr: pkDataMannger,
    PK_MgrEvent: PK_MgrEvent,
    PK_MgrED: PK_MgrED,
};