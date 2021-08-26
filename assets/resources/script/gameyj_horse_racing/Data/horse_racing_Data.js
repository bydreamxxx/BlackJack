// create by wj 2020/12/02
var game_config = require('horse_racing_Config').HorseRacingGameConfig;
const config = require('horse');

var Horse_Racing_Event = cc.Enum({
    HORSE_RACING_INIT: 'Horse_Racing_Init', //界面数据初始化
    HORSE_RACING_UPDATE: 'Horse_Racing_Update', //下注返回
    HORSE_RACING_UPDATE_BET_AREA: 'Horse_Racing_Update_Area', //更新下注区域
    HORSE_RACING_UPDATE_BET: 'Horse_Racing_Update_Bet', //更新个人下注区域
    HORSE_RACING_BET_CLEAR: 'Horse_Racing_Bet_Clear', //清理个人下注
    HORSE_RACING_PLAYER_COIN_CHANGE: 'Horse_Racing_Player_Coin_Change', //玩家身上金币更新
    HORSE_RACING_PLAYER_ENTER: 'Horse_Racing_Player_Enter', //玩家进入
    HORSE_RACING_PLAYER_EXIT: 'Horse_Racing_Player_Exit', //玩家离开
    HORSE_RACING_RECORD_DATA: 'Horse_Racing_Record_Data', //往期记录数据
    HORSE_RACING_RUN_END: 'Horse_Racing_Run_End',//记录冲线时马匹数据
    HORSE_RACING_TURN: 'Horse_Racing_Run_Turn'//设置转弯镜头动画
});

var Horse_Racing_Ed = new cc.dd.EventDispatcher();

var Horse_Racing_Data = cc.Class({
    s_horse_racing_data:null,
    statics:{
        Instance: function () {
            if (!this.s_horse_racing_data) {
                this.s_horse_racing_data = new Horse_Racing_Data();
            }
            return this.s_horse_racing_data;
        },

        Destroy: function () {
            if (this.s_horse_racing_data) {
                this.s_horse_racing_data.clear();
                this.s_horse_racing_data = null;
            }
        },
    },

    properties:{
        gameState: game_config.GameSate.WaitGame,  //游戏状态
        leftTime: 0, //剩余时间
        roundId: 0, //当前场次
        allBet: 0, //当前总下注
        betAreaList: [], //下注区间数值
        horseList: [], //马匹信息列表
        configId: 0, //配置表id
        coin: 0, //金币
        m_nStartCoin: 0,
        lastBetAreaList:[], //上局操作下注数据
        runState: game_config.RunState.Default, //默认状态
        runRankList: [], //跑马名次排序
        resultType: 1, //结果类型
        resultList: [],//结果列表
        m_nWin: 0,
        m_fRightBeginTime: 0,
        localOrserIndex: 6,

        runLeftTime: 9,
        runRightTime: 12,
        runLeftFrames: 300,
        runTurnFrames: 120,
        runRightFrames: 420
    },

    setGameState: function(state){
        this.gameState = state;
    },

    getGameState: function(){
        return this.gameState;
    },

    setRunState: function(state){
        this.runState = state;
    },

    getRunState: function(){
        return this.runState;
    },

    setLeftTime: function(leftTime, needSync){
        this.leftTime = leftTime;
        this._sysTime = needSync ? new Date().getTime() : null;
    },

    getLeftTime: function(){
        if(this._sysTime){
            let time = this.leftTime - Math.round((new Date().getTime() - this._sysTime) / 1000);
            return time >= 0 ? time : 0;
        }else{
            return this.leftTime;
        }
    },

    setRoundId: function(roundId){
        this.roundId = roundId;
    },

    getRoundId: function(){
        return this.roundId;
    },
    
    setAllBet: function(allBet){
        this.allBet = allBet;
    },

    getAllBet: function(){
        return this.allBet;
    },

    setBetAreaList: function(list){ //设置下注区间
        this.betAreaList = list;
    },

    getBetAreaList: function(){ //获取下注区间
        return this.betAreaList;
    },


    updateBetArea: function(list){//更新区域总下注
        list.forEach(function(info){
            var data = this.getBetAreaInfoById(info.id);
            if(data && data.allBet != info.allBet){
                    data.allBet = info.allBet
            }
        }.bind(this));
    },

    getBetAreaInfoById: function(id){//根据id获取指定下注区域的数据
        if(this.betAreaList.length == 0){
            cc.log('下注数据为0')
            return;
        }
        for(var i = 0; i < this.betAreaList.length; i++){
            var data = this.betAreaList[i];
            if(data.id == id)
                return data;
        }
    },

    updateOwnBetArea: function(id, selfBet){//更新自己下注数据
        var data = this.getBetAreaInfoById(id);
        if(data){
            data.sfBet += selfBet;
        }
    },

    clearOwnBet: function(){//清除个人下注
        this.betAreaList.forEach(function(data) {
            if(data.sfBet != 0){
                data.sfBet = 0;
                Horse_Racing_Ed.notifyEvent(Horse_Racing_Event.HORSE_RACING_BET_CLEAR, data.id); //清理下注
            }
        });
    },

    clearBetArea: function(){//清除所有筹码数据
        this.betAreaList.splice(0, this.betAreaList.length);
    },

    setHorseList: function(list){//设置马信息
        this.horseList = list
    },

    getHoseList: function(){//获取马信息
        return this.horseList;
    },

    clearHorseList: function(){
        this.horseList.splice(0, this.horseList.length);
    },

    setConfigId: function(configId){
        this.configId =  configId
    },

    getConfigId: function(){
        return this.configId;
    },

    getRoomConfigData: function(){//获取房间配置数据
        var self = this;
        const configData = config.getItem(function(item){
            if(item.key == self.configId)
                return item;
        });
        return configData;
    },

    setCoin: function(coin){
        this.coin = coin;
    },

    getCoin: function(){
        return this.coin;
    },

    updateCurCoin: function(curCoin){
        this.coin = curCoin;
        Horse_Racing_Ed.notifyEvent(Horse_Racing_Event.HORSE_RACING_PLAYER_COIN_CHANGE);
    },

    setStartCoin: function(coin){
        this.m_nStartCoin = coin;
    },

    getStartCoin: function(){
        return this.m_nStartCoin;
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

    getLastOwnBetList: function(){
        return this.lastBetAreaList;
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
        for(var i = 0; i < this.betAreaList.length; i++){
            var ownInfo = this.betAreaList[i];
            if(ownInfo.sfBet != 0)
                this.updateLastOwnBetList(ownInfo.id, ownInfo.sfBet);
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
            return this.getCoin() >= totalBet;
        return false
    },

    checkCanClear: function(){
        for(var i = 0; i < this.betAreaList.length; i++){
            var ownInfo = this.betAreaList[i];
            if(ownInfo.sfBet != 0)
                return true;
        }
        return false;
    },


    setRunRankList: function(rankList){//设置跑马名次排序
        this.runRankList = rankList;
    },

    getRunRankListByIndex: function(index, id){
        for(var i = 0; i < this.runRankList.length; i++){
            if(this.runRankList[i].id == index ){
                for(var j =0; j < 6; j++){
                    if(this.runRankList[i].rankList[j] == id){
                        if(index == 3){
                            if(this.getResultType() == 1)
                                return j;
                            else if(this.getResultType() == 2){
                                if(j == 1)
                                    return 0;
                                else
                                    return j
                            }else if(this.getResultType() == 3){
                                if(j == 1 || j == 2)
                                    return 0;
                                else
                                    return j
                            }
                        }else
                            return j;
                    }
                }
            }
        }
    },

    clearRunRankList: function(){
        this.runRankList.splice(0, this.runRankList.length);
    },

    setResultType: function(ntype){
        this.resultType = ntype;
    },

    getResultType: function(){
        return this.resultType;
    },

    setResultList: function(resultList){
        this.resultList = resultList;
    },

    getResultList: function(){
        return this.resultList;
    },

    setWin: function(win){
        this.m_nWin = win;
    },

    getWin: function(){
        return this.m_nWin;
    },

    getFirstHorse: function(){
        var rankInfoList = [];
        for(var i = 0; i < 3; i++){
            if(this.runRankList[i].id == 3)
                rankInfoList = this.runRankList[i].rankList;
        }
        var rankList = [];
        if(this.getResultType() == 1)
            rankList.push(rankInfoList[0]);
        else if(this.getResultType() == 2){
            rankList.push(rankInfoList[0]);
            rankList.push(rankInfoList[1]);
        }else if(this.getResultType() == 3){
            rankList.push(rankInfoList[0]);
            rankList.push(rankInfoList[1]);
            rankList.push(rankInfoList[2]);
        }

        return rankList;
    },

    getSecondHorse(){
        var rankInfoList = [];
        for(var i = 0; i < 3; i++){
            if(this.runRankList[i].id == 3)
                rankInfoList = this.runRankList[i].rankList;
        }
        if(this.getResultType() == 1){
            return rankInfoList[1];
        }else {
            return null;
        }
    },

    getMaxRateHorseId: function(){ //获取最大倍率的马匹
        var maxRateId = 1;
        for(var i = 2; i < 7; i++){
            var data0 = this.getBetAreaInfoById(i);
            var data1 = this.getBetAreaInfoById(maxRateId);
            if(data0 && data1)
                maxRateId = data0.rate > data1.rate ? i : maxRateId;
        }
        return maxRateId;
    },

    getMaxBetHorseId: function(){//获取最大下注的马匹
        var maxRateId = 1;
        for(var i = 2; i < 7; i++){
            var data0 = this.getBetAreaInfoById(i);
            var data1 = this.getBetAreaInfoById(maxRateId);
            if(data0 && data1)
                maxRateId = data0.allBet > data1.allBet ? i : maxRateId;
        }
        return maxRateId;
    },

    setRightRunBeginTime: function(timer){
        if(this.m_fRightBeginTime != 0)
            return false;
        this.m_fRightBeginTime = timer;
        return true;
    },
    
    getRightRunBeginTime: function(){
        return this.m_fRightBeginTime;
    },

    setLocalZorderIndex(index){
        this.localOrserIndex = index;
    },

    getLocalZorderIndex(){
        return this.localOrserIndex;
    },

    setWinnerList: function(list){//设置前5名
        this.winnerList = list;
    },

    getWinnerList: function(){//获取前5名
        return this.winnerList;
    },

    clearGameData: function(){//清理游戏数据
        this.clearBetArea();
        this.clearOwnBet();
        this.clearHorseList();
        this.clearRunRankList();
        this.m_fRightBeginTime = 0;
        this.localOrserIndex = 6;
    },

    /**
     * 玩家进入
     * @param {player_common_data} role_info 
     */
    playerEnter(role_info) {
        Horse_Racing_Ed.notifyEvent(Horse_Racing_Event.HORSE_RACING_PLAYER_ENTER, null);
    },

    /**
     * 玩家离开
     * @param {*} userId 
     */
    playerExit(userId) {
        Horse_Racing_Ed.notifyEvent(Horse_Racing_Event.HORSE_RACING_PLAYER_EXIT, null);
    },

    /**
     * 获取总玩家人数
     */
    getPlayerNum: function(){
        return this.othersNum;
    },

    getPlayer(id) {
    },
    
    updatePlayerNum() { },
    requesYuYinUserData() { },
    setReady(r) { },
    setOnLine(ol) { },
});

module.exports = {
    Horse_Racing_Data : Horse_Racing_Data,
    Horse_Racing_Event : Horse_Racing_Event,
    Horse_Racing_Ed : Horse_Racing_Ed,
}
