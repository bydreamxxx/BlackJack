//create by wj 2020/06/03
const game_config = require('lucky_turntable_config').LuckyTurnTableGameType;
const config = require('lucky_turntable');
var Lucky_Turntable_Event = cc.Enum({
    LUCKY_TURNTABLE_INIT: 'Lucky_Turntable_Init', //转盘初始化
    LUCKY_TURNTABLE_BET: 'Lucky_Turntable_Bet', //下注返回
    LUCKY_TURNTABLE_UPDATE_GAME: 'Lucky_Turntable_Update_Game', //游戏状态更新
    LUCKY_TURNTABLE_UPDATE_BET_AREA: 'Lucky_Turntable_Update_Bet_Area', //更新下注区域
    LUCKY_TURNTABLE_PLAYER_CHANGE: 'Lucky_Turntable_Player_Change', //前八名玩家更改
    LUCKY_TURNTABLE_PLAYER_COIN_CHANGE: 'Lucky_Turntable_Player_Coin_Change', //玩家身上金币更新
    LUCKY_TURNTABLE_STOP_BET: 'Lucky_Turntable_Stop_Bet', //停止下注
    LUCKY_TURNTABLE_PLAYER_ENTER: 'Lucky_Turntable_Player_Enter', //玩家进入
    LUCKY_TURNTABLE_PLAYER_EXIT: 'Lucky_Turntable_Player_Exit', //玩家离开
    LUCKY_TURNTABLE_CANCEL_BET: 'Lucky_Turntable_Cancel_Bet', //撤销下注
    LUCKY_TURNTABLE_RECORD_DATA: 'Lucky_Turntable_Record_Data', //往期记录数据
});

var Lucky_Turntable_Ed = new cc.dd.EventDispatcher();

var Lucky_Turntable_Data = cc.Class({
    s_lucky_turntable_data: null,

    statics:{
        Instance: function(){
            if(!this.s_lucky_turntable_data)
                this.s_lucky_turntable_data = new Lucky_Turntable_Data;
                return this.s_lucky_turntable_data;
        },

        Destroy: function(){
            if(this.s_lucky_turntable_data){
                this.s_lucky_turntable_data.clear();
                this.s_lucky_turntable_data = null;
            }
        }
    },

    properties:{
        gameState: game_config.GameSate.WaitGame,  //游戏状态
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
        isGetResult: false,
        ownTotalBet: 0,
        m_nIssue:0,//期数
        m_tRecordDataList: [],
    },

    setGameState: function(state){ //设置游戏状态
        this.gameState = state;
        this.isGetResult = false;
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
        for(var i = 1; i <= 33; i++){
            this.betAreaList[i -1] = {id : i, value : 0}; //下注区域总下注值
            this.ownBetAreaList[i -1] = {id : i, value : 0};//自己的下注值
        }

        if(this.gameState == 1){//正在下注
            list.forEach(function(data){
                var info = this.getBetAreaInfoById(data.id);
                info.value = data.value;

                var oweInfo = this.getOwnBetAreaInfoById(data.id);
                if(data.selfValue)
                    oweInfo.value = data.selfValue;
            }.bind(this))
        }
    },

    getBetAreaList: function(){ //获取下注区间
        return this.betAreaList;
    },

    addBetAreaByIndex: function(index, bet){ //玩家下注，增加下注数据
        // this.betAreaList.forEach(function(data) {
        //     if(data.id == index)
        //         data.value += bet;
        // });
    },

    updateBetArea: function(list){//更新区域最新数据
        list.forEach(function(info){
            var data = this.getBetAreaInfoById(info.id);
            if(data && data.value != info.value){
                var subValue = info.value - data.value;
                var sendData = {
                    id : data.id,
                    value: subValue,
                }
                if(subValue < 0)
                    cc.log('infovalue=========' + info.value)
                data.value = info.value;
                Lucky_Turntable_Ed.notifyEvent(Lucky_Turntable_Event.LUCKY_TURNTABLE_UPDATE_BET_AREA, sendData);
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
            for(var k = 0; k < data.iconsList.length; k++){
                var newData = {
                    type: data.type,
                    icons: data.iconsList[k]
                }
                this.wayBillList.push(newData);
                if(this.wayBillList.length > 20){
                    var item_end = this.wayBillList[19];
                    var item_begin = this.wayBillList[0];
                    var type = 0;
                    if(item_end.type != 3 && item_begin.type != 3) 
                        type = item_end.type >= item_begin.type ? item_end.type : item_begin.type;
                    else if(item_end.type == 3 && item_begin.type != 3)
                        type = item_begin.type;
                    else if(item_end.type != 3 && item_begin.type == 3)
                        type = item_end.type;

                    if(type == 0) //普通删除一个
                        this.wayBillList.splice(0,1);
                    else if(type == 1){ //双响
                        this.wayBillList.splice(0,2);
                    }else if(type == 2){ //三响
                        this.wayBillList.splice(0,3);
                    }
                }        
            }
        }
    },

    getBillWayLsit: function(){ //获取路单
        return this.wayBillList;
    },

    updateBillWayList: function(type, data){//更新路单
        var newData = {
            type: type,
            icons: data.icon,
        }
        this.wayBillList.push(newData);
        if(this.wayBillList.length > 20){
            var item_end = this.wayBillList[19];
            var item_begin = this.wayBillList[0];
            var type = 0;
            if(item_end.type != 3 && item_begin.type != 3) 
                type = item_end.type >= item_begin.type ? item_end.type : item_begin.type;
            else if(item_end.type == 3 && item_begin.type != 3)
                type = item_begin.type;
            else if(item_end.type != 3 && item_begin.type == 3)
                type = item_end.type;

            if(type == 0) //普通删除一个
                this.wayBillList.splice(0,1);
            else if(type == 1){ //双响
                this.wayBillList.splice(0,2);
            }else if(type == 2){ //三响
                this.wayBillList.splice(0,3);
            }
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
                    if(cc.dd.user.id == newPlayer.userId)
                    this.playerList[i] = newPlayer;
                    Lucky_Turntable_Ed.notifyEvent(Lucky_Turntable_Event.LUCKY_TURNTABLE_PLAYER_CHANGE, newPlayer.userId);
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

    setIssue: function(issue){//设置期数
        this.m_nIssue = issue;
    },

    getIssue: function(){
        return this.m_nIssue;
    },

    updateCurCoin: function(curCoin){
        this.curCoin = curCoin;
        Lucky_Turntable_Ed.notifyEvent(Lucky_Turntable_Event.LUCKY_TURNTABLE_PLAYER_COIN_CHANGE);
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

    setStartCoin: function(coin){
        this.m_nStartCoin = coin;
    },

    getStartCoin: function(){
        return this.m_nStartCoin;
    },

    setOwnBetArea: function(list){
        for(var i = 1; i <= 33; i++){
            this.ownBetAreaList[i-1] =[
                {id :i, value: 0},
            ]
        }
        this.ownTotalBet = 0;

        list.forEach(function(data){
            var info = this.getBetAreaInfoById(data.id);
            info.value = data.value;
            this.ownTotalBet += data.value;
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
            this.ownTotalBet += bet;
        }
    },

    clearOwnBetArea: function(){//清除个人下注数据
        for(var i = 1; i <= 33; i++){
            this.ownBetAreaList[i-1] = {id : i, value : 0};//自己的下注值
        }
        this.ownTotalBet = 0;
    },

    getOwnTotalBet: function(){
        return this.ownTotalBet;
    },

    clearGameData: function(){//清理游戏数据
        for(var i = 1; i <= 33; i++){
            this.betAreaList[i-1] = {id : i, value : 0}; //下注区域总下注值
            this.ownBetAreaList[i-1] = {id : i, value : 0};//自己的下注值
        }

        this.winAreaList.splice(0, this.winAreaList.length);
        this.ownTotalBet = 0;
        
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

    getLastOwnBetInfoById: function(betId){//获取上局玩家下注情况
        for(var i = 0; i < this.lastBetAreaList.length; i++){
            var info = this.lastBetAreaList[i];
            if(info && info.betId == betId)
                return info;
        }
        return null;
    },

    checkCanContinueBet: function(){ //检测是否可以再次下注
        return this.lastBetAreaList.length > 0;
    },

    getAllLastOwnBetList: function(){ //获取上局玩家个人下注所有情况
        return this.lastBetAreaList;
    },

    clearLastOwnBetList: function(){ //清理上局个人下注
        this.lastBetAreaList.splice(0, this.lastBetAreaList.length);
        this.lastBetAreaList = [];
    },

    copyOwnBetListToLastOwnBetList: function(){ //将本局下注数据保存为上局下注
        this.clearLastOwnBetList();
        for(var i = 0; i < this.ownBetAreaList.length; i++){
            var ownInfo = this.ownBetAreaList[i];
            if(ownInfo.value != 0)
                this.updateLastOwnBetList(ownInfo.id, ownInfo.value);
        }
    },

    checkCoinToConinueBet: function(){ //检查是否为再次下注
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

    sortRecordData: function(){
        if(this.m_tRecordDataList.length <= 1)
            return; 
        for(var i = 0; i < this.m_tRecordDataList.length - 1; i++){
            for(var j = 0; j < this.m_tRecordDataList.length - 1 -i; j++){
                if(this.m_tRecordDataList[j].phase > this.m_tRecordDataList[j+1].phase){
                    var tempData = this.m_tRecordDataList[j];
                    this.m_tRecordDataList[j] = this.m_tRecordDataList[j+1];
                    this.m_tRecordDataList[j+1] = tempData;
                }
            }
        }
    },

    setRecordGameData: function(list){//设置存储数据
        this.m_tRecordDataList = list;
        this.sortRecordData();
        Lucky_Turntable_Ed.notifyEvent(Lucky_Turntable_Event.LUCKY_TURNTABLE_RECORD_DATA);
    },

    getRecordGameData: function(){//获取往期数据
        return this.m_tRecordDataList;
    },

    /**
     * 玩家进入
     * @param {player_common_data} role_info 
     */
    playerEnter(role_info) {
        Lucky_Turntable_Ed.notifyEvent(Lucky_Turntable_Event.LUCKY_TURNTABLE_PLAYER_ENTER, null);
    },

    /**
     * 玩家离开
     * @param {*} userId 
     */
    playerExit(userId) {
        Lucky_Turntable_Ed.notifyEvent(Lucky_Turntable_Event.LUCKY_TURNTABLE_PLAYER_EXIT, null);
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
});

module.exports = {
    Lucky_Turntable_Data : Lucky_Turntable_Data,
    Lucky_Turntable_Event : Lucky_Turntable_Event,
    Lucky_Turntable_Ed : Lucky_Turntable_Ed,
}
