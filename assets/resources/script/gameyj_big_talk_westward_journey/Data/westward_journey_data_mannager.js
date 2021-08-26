//create by wj 2019/12/3
const westward_journey_config = require('westward_Journey_Config').WestwardJourneyGameType;
const config = require('xiyou');

var Westward_Journey_Event = cc.Enum({
    Westward_Journey_INIT: 'Westward_Journey_INIT',//游戏初始化
    Westward_Journey_Bet: 'Westward_Journey_Bet', //下注
    Westward_Journey_UPDATE_GAME: 'Westwars_Journey_UPDATE_GAME', //游戏状态更新
    Westward_Journey_PLAYER_ENTER: 'Westward_journey_PLAYER_ENTER',//玩家进入
    Westward_Journey_PLAYER_EXIT: 'Westward_journey_PLAYER_EXIT', //玩家离开
    Westward_Journey_PLAYER_CHANGE: 'Westward_Journey_PLAYER_CHANGE', //前八玩家切换,
    Westward_Journey_PLAYER_COIN_CHANGE: 'Westward_Journey_PLAYER_COIN_CHANGE', //玩家金币更新
    Westward_Journey_RUN_REPEAT: 'Westward_Journey_RUN_REPEAT', //月光宝盒再次跑
    Westward_Journey_CHECK_RESULT: 'Westward_Journey_CHECK_RESULT', //检查结果显示
    Westward_Journey_BIG_WIN: 'Westward_Journey_BIG_WIN', //显示大赢家
    Westward_Journey_CHIP: 'Westward_Journey_CHIP', //筹码显示
});

var Westward_Journey_Ed = new cc.dd.EventDispatcher();

var Westward_Journey_Data = cc.Class({
    s_Westward_Journey_Data : null,
    statics: {
        Instance: function () {
            if (!this.s_Westward_Journey_Data) {
                this.s_Westward_Journey_Data = new Westward_Journey_Data();
            }
            return this.s_Westward_Journey_Data;
        },

        Destroy: function () {
            if (this.s_Westward_Journey_Data) {
                this.s_Westward_Journey_Data.clear();
                this.s_Westward_Journey_Data = null;
            }
        },
    },

    properties:{
        gameState: westward_journey_config.GameSate.WaitGame,  //游戏状态
        leftTime: 0, //剩余时间
        betAreaList: [], //下注区间数值
        lastBetAreaList: [], //上个下注区间数值
        wayBillList: [], //结果列表
        playerList: [],//前8名玩家列表
        curCoin: 0, //当前金币值
        roomCofigId: 0, //配置表id
        resultType: 0, //结果类型
        resultList: [], //当前结果列表
        winAreaList: [], //中奖区域
        winnerList: [], //前5名赢家
        winCoin: 0,
        m_nStartCoin: 0,
        ownBetAreaList: [],
        lastOwnBetList: [],
        m_bReverse: false,
        winType: 0,
        m_nJubaoCoin: 0,
    },

    setGameState: function(state){ //设置游戏状态
        this.gameState = state;
    },

    getGameState: function(){ //获取游戏状态
        return this.gameState;
    },

    setLeftTime: function(time){//设置倒计时
        this.leftTime = time;
    },

    getLeftTime: function(){ //获取倒计时
        return this.leftTime;
    },

    setBetAreaList: function(list){ //设置下注区间
        this.betAreaList =[
            {id :1, value: 0},
            {id :2, value: 0},
            {id :3, value: 0},
            {id :4, value: 0},
            {id :5, value: 0},
            {id :6, value: 0},
            {id :7, value: 0},
            {id :8, value: 0},
            {id :9, value: 0},
            {id :10, value: 0},
            {id: 11, value: 0},
        ]

        this.ownBetAreaList =[
            {id :1, value: 0},
            {id :2, value: 0},
            {id :3, value: 0},
            {id :4, value: 0},
            {id :5, value: 0},
            {id :6, value: 0},
            {id :7, value: 0},
            {id :8, value: 0},
            {id :9, value: 0},
            {id :10, value: 0},
            {id: 11, value: 0},
        ]
        if(this.gameState == 1){//下注状态
            list.forEach(function(data){
                var info = this.getBetAreaInfoById(data.betId);
                info.value = data.bet;

                var oweInfo = this.getOwnBetAreaInfoById(data.betId);
                if(data.betSelf)
                    oweInfo.value = data.betSelf;
            }.bind(this))
        }
    },

    getBetAreaList: function(){ //获取下注区间
        return this.betAreaList;
    },

    addBetAreaByIndex: function(index, bet){ //玩家下注，增加下注数据
        this.betAreaList.forEach(function(data) {
            if(data.id == index)
                data.value += bet;
        });
    },

    updateBetArea: function(list){//更新区域最新数据
        list.forEach(function(info){
            var data = this.getBetAreaInfoById(info.betId);
            if(data && data.value != info.bet){
                var subValue = info.bet - data.value;
                var sendData = {
                    id : data.id,
                    value: subValue,
                }
                data.value = info.bet;
                Westward_Journey_Ed.notifyEvent(Westward_Journey_Event.Westward_Journey_BET_AREA_UPDATE, sendData);
            }
        }.bind(this));
    },

    getBetAreaInfoById: function(id){//根据id获取指定下注区域的数据
        for(var i = 0; i < this.betAreaList.length; i++){
            var data = this.betAreaList[i];
            if(data.id == id)
                return data;
        }
    },

    clearBetArea: function(){//清除所有筹码数据
        this.betAreaList.forEach(function(data) {
            data.value = 0;
        });
    },

    setLastBetAreaList: function(){ //设置下注区间
        this.lastBetAreaList = this.betAreaList;
    },

    getLastBetAreaList: function(){ //获取下注区间
        return this.lastBetAreaList;
    },

    setBillWayList: function(list){//设置路单
        this.wayBillList.splice(0, this.wayBillList.length);
        for(var i = 0; i < list.length; i++){
            var data = list[i];
            this.wayBillList.push(data);
            if(this.wayBillList.length > 16){
                this.wayBillList.shift();
            } 
        }
    },
    getBillWayLsit: function(){ //获取路单
        return this.wayBillList;
    },


    updateBillWayList: function(type, data){//更新路单
        this.wayBillList.push(data);
        if(this.wayBillList.length > 16){
            this.wayBillList.shift();
        }        
    },

    setPlayerLsit:function(list){//设置前8数据
        this.playerList = list;
    },

    getPlayerList: function(){//获取前8玩家数据
        return this.playerList;
    },

    updatePlayer: function(list){//更新前8名
        for(var i = 0; i < 8; i++){
            for(var j = 0; j < list.length; j++){
                var lastPlayer = this.playerList[i];
                var newPlayer = list[j];
                if(lastPlayer.rank == newPlayer.rank && lastPlayer.userId != newPlayer.userId){
                    this.playerList[i] = newPlayer;
                    Westward_Journey_Ed.notifyEvent(Westward_Journey_Event.Westward_Journey_PLAYER_CHANGE, newPlayer.userId);
                }
            }
        }
        this.playerList = list;
    },

    setCurCoin: function(coin){//设置当前玩家身上金币
        this.curCoin = coin;
    },

    getCurCoin: function(){ //获取玩家身上金币
        return this.curCoin;
    },

    updateCurCoin: function(curCoin){
        this.curCoin = curCoin;
        Westward_Journey_Ed.notifyEvent(Westward_Journey_Event.Westward_Journey_PLAYER_COIN_CHANGE);
    },

    setRoomConfigId: function(configId){//房间配置表id
        this.roomCofigId = configId;
    },

    getRoomConfigId: function(){// 获取房间配置id
        return this.roomCofigId;
    },

    getRoomConfigData: function(){//获取房间配置数据
        var self = this;
        const configData = config.getItem(function(item){
            if(item.key == self.roomCofigId)
                return item;
        });
        return configData;
    },
    
    setResultList: function(list){//设置结果
        this.resultList = list;
    },

    getResultList: function(){//获取结果
        return this.resultList;
    },

    setResultType: function(ntype){//设置结果类型
        this.resultType = ntype;
    },

    getResultType: function(){//获取结果类型
        return this.resultType;
    },

    setWinAreaList: function(list){//中奖区域
        this.winAreaList = list;
    },

    getWinAreaList: function(){ //获取中奖区域
        return this.winAreaList;
    },

    setWinnerList: function(list){//设置前5名
        this.winnerList = list;
    },

    getWinnerList: function(){//获取前5名
        return this.winnerList;
    },

    updatePlayerCoin: function(userId, bet){//更新玩家金币
        if(userId == cc.dd.user.id){
            this.setCurCoin(this.getCurCoin() - bet);
        }else{
            var player = this.findPlayerByUserId(userId);
            if(player){
                player.coin = player.coin - bet;
            }
        }
    },

    findPlayerByUserId: function(userId){//通过玩家id查找玩家
        for(var i = 0; i < this.playerList.length; i++){
            var player = this.playerList[i];
            if(player && player.userId == userId)
                return player;
        }
        return null;
    },

    findPlayerByRank: function(rank){//根据排行查找玩家
        for(var i = 0; i < this.playerList.length; i++){
            var player = this.playerList[i];
            if(player && player.rank == rank)
                return player;
        }
        return null;
    },

    setWinCoin: function(coin){//设置结算金币
        this.winCoin = coin;
    },

    getWinCoin: function(){ //获取结算金币
        return this.winCoin;
    },

    setWinType: function(type){
        this.winType = type;
    },

    getWinType: function(){
        return this.winType;
    },

    setStartCoin: function(coin){
        this.m_nStartCoin = coin;
    },

    getStartCoin: function(){
        return this.m_nStartCoin;
    },
    setJuBao: function(coin){
        this.m_nJubaoCoin = coin;
    },

    getJuBao: function(){
        return this.m_nJubaoCoin;
    },

    setOwnBetArea: function(list){
        this.ownBetAreaList =[
            {id :1, value: 0},
            {id :2, value: 0},
            {id :3, value: 0},
            {id :4, value: 0},
            {id :5, value: 0},
            {id :6, value: 0},
            {id :7, value: 0},
            {id :8, value: 0},
            {id :9, value: 0},
            {id :10, value: 0},
            {id: 11, value: 0},
        ]

        list.forEach(function(data){
            var info = this.getBetAreaInfoById(data.id);
            info.value = data.value;
        }.bind(this))
    },

    getOwnBetAreaInfoById: function(id){//根据id获取指定下注区域的数据
        for(var i = 0; i < this.ownBetAreaList.length; i++){
            var data = this.ownBetAreaList[i];
            if(data.id == id)
                return data;
        }
    },

    updateOwnBetArea: function(index, bet){
        var Info = this.getOwnBetAreaInfoById(index);
        if(Info){
            Info.value += bet;
        }
    },


    clearGameData: function(){//清理游戏数据
        this.betAreaList =[
            {id :1, value: 0},
            {id :2, value: 0},
            {id :3, value: 0},
            {id :4, value: 0},
            {id :5, value: 0},
            {id :6, value: 0},
            {id :7, value: 0},
            {id :8, value: 0},
            {id :9, value: 0},
            {id :10, value: 0},
            {id: 11, value: 0},
        ]

        this.ownBetAreaList = [
            {id :1, value: 0},
            {id :2, value: 0},
            {id :3, value: 0},
            {id :4, value: 0},
            {id :5, value: 0},
            {id :6, value: 0},
            {id :7, value: 0},
            {id :8, value: 0},
            {id :9, value: 0},
            {id :10, value: 0},
            {id: 11, value: 0},
        ]

        this.winAreaList.splice(0, this.winAreaList.length);
        this.m_bReverse = false;
        
    },

    updateLastOwnBetList: function(betId, bet){//更新个人下注数据
        var info = this.getLastOwnBetInfoById(betId);
        if(info){
            info.betValue = bet;
        }else{
            var data = {
                betId: betId,
                betValue: bet,
            }
            this.lastBetAreaList.push(data);
        }
    },

    getLastOwnBetInfoById: function(betId){
        for(var i = 0; i < this.lastBetAreaList.length; i++){
            var info = this.lastBetAreaList[i];
            if(info && info.betId == betId)
                return info;
        }
        return null;
    },

    checkCanContinueBet: function(){
        return this.lastBetAreaList.length > 0;
    },

    getAllLastOwnBetList: function(){
        return this.lastBetAreaList;
    },

    clearLastOwnBetList: function(){
        this.lastBetAreaList.splice(0, this.lastBetAreaList.length);
        this.lastBetAreaList = [];
    },

    copyOwnBetListToLastOwnBetList: function(){
        this.clearLastOwnBetList();
        for(var i = 0; i < this.ownBetAreaList.length; i++){
            var ownInfo = this.ownBetAreaList[i];
            if(ownInfo.value != 0)
                this.updateLastOwnBetList(ownInfo.id, ownInfo.value);
        }
    },

    checkCoinToConinueBet: function(){
        var totalBet = 0;
        for(var i = 0; i < this.lastBetAreaList.length; i++){
            var ownInfo = this.lastBetAreaList[i];
            if(ownInfo.betValue != 0)
                totalBet += ownInfo.betValue;
        }
        if(totalBet != 0)
            return this.getCurCoin() >= totalBet;
        return false
    },

    setReverseRun: function(isReverse){
        this.m_bReverse = isReverse;
    },

    getIsReverseRun: function(){
        return this.m_bReverse;
    },

    //////////////////////////////通用房间管理器玩家信息操作Begin///////////////////////////////////////////////
    /**
     * 玩家进入
     * @param {player_common_data} role_info 
     */
    playerEnter(role_info) {
        Westward_Journey_Ed.notifyEvent(Westward_Journey_Event.Westward_journey_PLAYER_ENTER, null);
    },

    /**
     * 玩家离开
     * @param {*} userId 
     */
    playerExit(userId) {
        Westward_Journey_Ed.notifyEvent(Westward_Journey_Event.Westward_journey_PLAYER_EXIT, null);
    },

    deletePlayerData(id) {

    },

    /**
     * 获取总玩家人数
     */
    getPlayerNum: function(){
        return this.othersNum;
    },

    getPlayer(id) {
    },

    /**
     * 通过id获取玩家数据
     * @param {Number} id 
     */
    getPlayerById(id) {

    },

    updatePlayerNum() { },
    requesYuYinUserData() { },
    setReady(r) { },
    setOnLine(ol) { },
    //////////////////////////////通用房间管理器玩家信息操作End///////////////////////////////////////////////
});

module.exports = {
    Westward_Journey_Data : Westward_Journey_Data,
    Westward_Journey_Ed : Westward_Journey_Ed,
    Westward_Journey_Event : Westward_Journey_Event,
};