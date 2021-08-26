//create by wj 2018/06/13
var slotSender = require('gameyj_slot_sender').SlotSender.getInstance(); 
const TinyGameType = require('TinyGameType').TinyGameType;
const data_slotcard = require('slotcard');
const data_slotRun = require('slotrun');
var gSlotMgr = require('SlotManger').SlotManger.Instance();

var TinyGameManger = cc.Class({
    // statics:{
    //     tinyGameManger : null,

    //     Instance: function () {
    //         if (this.tinyGameManger == null) {
    //             this.tinyGameManger = new TinyGameManger();
    //         }
    //         return this.tinyGameManger;
    //     },

    //     Destroy: function () {
    //         if (this.tinyGameManger) {
    //             this.tinyGameManger = null;
    //         }
    //     },
    // },
    
    TinyGameManger: function(){
        this.m_nLeftNum = 0; //剩余次数
        this.m_nRewardNum = 0; //奖励值
        this.m_nRreviousPosition = 1; //上次转中的点
        this.m_nBetNum = 0;

        this.m_tCardList = [];
        for (var k = 0; k < data_slotcard.items.length; k++){
            if(data_slotcard.items[k].play_sub_type == 101)
                this.m_tCardList[k] = data_slotcard.items[k].key;
        }

        var cardLen = this.m_tCardList.length -1;
        var seed = 1;
        this.m_tStartCards = [];
        for(var x = 0; x < 4; x++){
            for(var y = 0; y < 1; y++){
                this.SetTablePosVal(this.m_tStartCards, x, y,  parseInt(Math.random() * (cardLen - seed) + seed, 10));
            }
        }

        this.m_tRunCfg = [];
        for(var k = 0; k < data_slotRun.items.length; k++){
                this.m_tRunCfg[k] = data_slotRun.items[k];
        }

        this.m_tList = [];

        this.winMoney = 0;
    },

    SetTablePosVal: function(t, x, y, v){
        var col = t[x];
        if (col == null){
            col = [];
            t[x] = col;
        }
       col[y] = v
    },

    GetTablePosVal: function(t, x, y){
        var col = t[x];
        if(col)
            return col[y];    
        return null
    },

    buildRunLine: function(startCard1,  nCol){
        var cardList = [];
        cardList[0] = startCard1;
        var cardLen = this.m_tCardList.length;
        var lineLen = this.m_tRunCfg[nCol].lineLen
        for(var i = 1; i < lineLen; i++){
            cardList[i] = this.m_tCardList[parseInt(Math.random() * (cardLen) + 0, 10)];
        }
        return cardList;
    },

    buildAllRunLine: function(){
        this.m_tRunLines = [];
        for(var i = 0; i < 4; i++){
            var startCard1 = this.GetTablePosVal(this.m_tStartCards, i, 0);
            this.m_tRunLines[i] = this.buildRunLine(startCard1, i);
        }
    },

    //保存剩余次数
    setLeftNum: function(nLeftNum){
        this.m_nLeftNum = nLeftNum;
        gSlotMgr.setSmallGameTimes(nLeftNum);
    },
    //获取剩余次数
    getLeftNum: function(){
        return this.m_nLeftNum;
    },

    //保存奖励
    setRewardNum: function(nRewardNum){
        this.m_nRewardNum += nRewardNum;
    },

    //获取奖励
    getRewardNum: function(){
        return this.m_nRewardNum;
    },

    //重置奖励数据
    resetReardNum: function(){
        this.m_nRewardNum = 0;
    },

    //设置押注数据
    setBetNum: function(num){
        this.m_nBetNum = num;
    },

    //获取押注
    getBetNum: function(){
        return this.m_nBetNum;
    },

    //设置最后结束点
    setFinalPos: function(nFinalPos){
        this.m_nRreviousPosition = nFinalPos;
    },

    //获取最后结束点
    getFinalPos: function(){
        return this.m_nRreviousPosition;
    },

    //开始游戏
    startRunGame: function(){
        slotSender.startTinyGame();
    },

    getRunCfg: function(){
        return this.m_tRunCfg;
    },

    getCard: function(x, y){
        return this.GetTablePosVal(this.m_tStartCards, x, y)
    },

    getAllRunLine: function(){
        return this.m_tRunLines;
    },

    //判定是否连线
    caculateLineNum: function(cardList){
        this.m_nlineNum = 0;
        //四连情况
        if(cardList[0] == cardList[1] && cardList[2] == cardList[3] && cardList[1] == cardList[2])
            this.m_nlineNumType = 3;
        else if(cardList[0] == cardList[1] && cardList[1] == cardList[2] && cardList[2] != cardList[3])
            this.m_nlineNumType = 1; //左三连
        else if(cardList[0] != cardList[1] && cardList[1] == cardList[2] && cardList[2] == cardList[3])
            this.m_nlineNumType = 2; //右三连

    },

    //获取连线结果
    getLineNumType: function(){
        return this.m_nlineNumType;
    },

    //重置连线结果
    resetLineNumType: function(){
        this.m_nlineNumType = 0;
    },

    on_msg_slot_mini_game_2c: function(msg){
        this.setLeftNum(msg.result.funcCnt);
        this.setRewardNum(msg.result.winMoney);
        this.setFinalPos(msg.result.siteId);
        gSlotMgr.setResultFenAndGameFen(msg.result.winMoney);
        this.caculateLineNum(msg.result.middCardsList);

        this.m_tRunCfg.splice(0, this.m_tRunCfg.length);

        for(var k = 0; k < data_slotRun.items.length; k++){
            this.m_tRunCfg[k] = data_slotRun.items[k];
        }

        var tEndCards = [];
        for(var x = 0; x < 4; x++){
            this.SetTablePosVal(tEndCards, x, 0, msg.result.middCardsList[x])
        }
        this.buildAllRunLine();

        for(var i = 0 ; i < 4; i++){
            var endCard1 = this.GetTablePosVal(tEndCards, i , 0);
            var cardList = this.m_tRunLines[i];
            cardList[cardList.length - 1] = endCard1;
        }
        this.m_tStartCards = tEndCards;
        var ui = cc.dd.UIMgr.getUI('slot_TinyGame_UI');
        if(ui){
            ui.getComponent('tiny_Game_UI').startRun();
        }
    },

    ///////////////////////////////////////////////////////////比倍小游戏///////////////////////////////
    //设置点数
    setPoints: function(pointsList){
        this.pointsList = pointsList;
    },
    //获取点数
    getPoints: function(){
        return this.pointsList;
    },

    //设置奖励得分
    setAwardMoney: function(money){
        this.winMoney = money;
    },

    //获取奖励得分
    getAwardMoney: function(){
        return this.winMoney;
    },

    //设置历史结果
    setHistoryList: function(){
        var result = this.pointsList[0];
        this.m_tList.push(result);
        if(this.m_tList.length > 10)
            this.m_tList.splice(0,1);
    },

    //获取历史结果
    getHistoryList: function(){
        return this.m_tList;
    },

    on_msg_slot_compare_2c: function(msg){
        this.setPoints(msg.pointsList);
        this.setAwardMoney(msg.winMoney);
        this.setHistoryList();
        var ui = cc.dd.UIMgr.getUI('gameyj_water_margin_slot/Prefab/compare_Game_UI');
        if(ui){
            ui.getComponent('compare_game_UI').gameState(TinyGameType.GameSate.OpenGame);
        }

    },

    on_msg_slot_choice_comapre_2c: function(msg){
        var ui = cc.dd.UIMgr.getUI('gameyj_water_margin_slot/Prefab/compare_Game_UI');
        if(ui){
            var cpt = ui.getComponent('compare_game_UI')
            cpt.updateUserGold(msg.newMoney);
            cpt.setButtonEnabel(true);
        }
        gSlotMgr.setGold(msg.newMoney);
    },
});

module.exports = {
    TinyGameManger : TinyGameManger
};