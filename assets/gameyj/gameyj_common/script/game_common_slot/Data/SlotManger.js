// create by wj 2018/06/06
const data_slotcard = require('slotcard');
const data_slotline = require('slotline');
const data_slotRun = require('slotrun');
const data_slotroom = require('slotroom');
const SlotType = require('SlotType').SlotType;
const hall_prop_data = require('hall_prop_data').HallPropData;
const hall_common_data = require('hall_common_data').HallCommonData;
var slotSender = require('gameyj_slot_sender').SlotSender.getInstance(); 

var SlotManger = cc.Class({
    statics: {
        slotManger: null,

        Instance: function () {
            if (this.slotManger == null) {
                this.slotManger = new SlotManger();
            }
            return this.slotManger;
        },

        Destroy: function () {
            if (this.slotManger) {
                this.slotManger = null;
            }
        },
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

    onInit: function(){
        this.m_nRoomType = 0
        // 房间类型
        this.m_nGameState = 0
        // 游戏状态
        this.m_nGameTimer = 0
        // 游戏阶段时间
        this.m_tResultData = { }
        // 第一款小游戏数据
       // this.m_oTinyGameData = TinyGameManager
        this.m_oTinyGameData = null
        // 界面刷新条件
        this.m_bfresh = false
        // 刷新历史记录
        this.m_nLastLineNum = 0
        // 每局押注线数量
        this.m_nLastLineBet = 0
        // 每局每线押注数目
        this.m_nGetFen = 0
        // 每局自己奖励
        this.m_tLineCfg = []
        this.m_bAutoBet = false
        this.m_nFreeRunTimes = 0
        this.m_tWinLines = []
        this.m_nSmallGameTimes = 0
        //免费次数中
        this.m_nTotalFreeTimes = 0   //总共一次经历的免费次数
        this.m_nTotalFreeReward = 0  //-免费旋转中得分
        this.m_bInFree = false  //判定是否在免费旋转中
        this.m_bIsEnterFree = false  //-判定是否为进入游戏就是免次
        this.m_tLineCfg = []

        this.m_nSeed = 0
        this.m_tAddLineList = [];

        ////-当前赢线索引
        this.m_nLineIndex = 1
        ////-当前压分索引
        this.m_nBetIndex = 1
    
        ////上一局金币
        this.m_nLastGold = 0
    
        ////-老虎机当前音效
        this.m_nSlotCurrentAudioId = 0
    
        this.m_bChangeGold = false
        this.m_bNeedTips = false
        this.m_slotMainUI = null
    
        this.m_nWinType = 0
    
        ////老虎机上一个状态
        this.m_LastIsAuto = false
        //////记录是否处于结算界面阶段
        this.m_bInResultWindow = false
    
        //////保存cowboy排序后数据
        this.m_nNowLineLen = 1
        this.m_tColTag = [];
    
        ////-判定是否为新的老虎机
        this.m_bNewSlot = false
        this.m_tNewSlotRunCard = [];
    
        this.m_nSmallGameCount = 0
        this.m_bEnterPiggyBank = false
        this.m_bPlayBankEnd = false

        this.m_bNeedUpdate = false;
        this.m_nAllWin = -1;

        this.m_nStartCoin = hall_prop_data.getInstance().getCoin();

        //拉取全盘/人数数据标记
        this.m_bCanSend = true;

        //在线玩家人数
        this.m_nPlayerOnlineCount = 0;
        this.m_tAllWinHistoryList = [];
        this.m_tPlayersList = [];

        this.m_bReconnect = false;

        this.m_bIsFast = false;
        var fastJson = cc.sys.localStorage.getItem('the_water_margin_fast_model');
        if(fastJson){
            if(fastJson == 'true')
                this.m_bIsFast = true;
        }

        this.m_bSoundSwitch = AudioManager._getLocalSoundSwitch();
        this.m_bMusicSwitch = AudioManager._getLocalMusicSwitch();

        this.m_nSoundVol = AudioManager._getLocalSoundVolume();
        this.m_nMusicVol = AudioManager._getLocalMusicVolume();

        AudioManager.onSound();
        AudioManager.setSoundVolume(1);
        cc.sys.localStorage.setItem('the_water_margin_soundvol', 1);

        // if(!this.m_bSoundSwitch){
        //     //AudioManager.setSoundVolume(0);
        // }else{
        //     var json = cc.sys.localStorage.getItem('the_water_margin_soundvol');
        //     if (json) {
        //         this.m_nOwnSoundVol = parseFloat(json);
        //         AudioManager.onSound();
        //         AudioManager.setSoundVolume(this.m_nOwnSoundVol);
        //     }else{
        //         this.m_nOwnSoundVol = this.m_nSoundVol;
    
        //         AudioManager.setSoundVolume(this.m_nOwnSoundVol);
        //         cc.sys.localStorage.setItem('the_water_margin_soundvol', AudioManager._getLocalSoundVolume());
        //     }
    
        // }

        // if(!this.m_bMusicSwitch){
        //     //AudioManager.setMusicVolume(0);
        //     //cc.sys.localStorage.setItem('the_water_margin_musicvol',  AudioManager._getLocalMusicVolume());
        // }else{
        //     var json = cc.sys.localStorage.getItem('the_water_margin_soundvol');
        //     if (json) {
        //         this.m_nOwnSoundVol = parseFloat(json);
        //         AudioManager.onSound();
        //         AudioManager.setSoundVolume(this.m_nOwnSoundVol);
        //     }else{
        //         this.m_nOwnSoundVol = this.m_nSoundVol;
    
        //         AudioManager.setSoundVolume(this.m_nOwnSoundVol);
        //         cc.sys.localStorage.setItem('the_water_margin_soundvol', AudioManager._getLocalSoundVolume());
        //     }
        // }

        AudioManager.onMusicSwitch();
        AudioManager.setMusicVolume(1);
        cc.sys.localStorage.setItem('the_water_margin_musicvol',  1);


        // var json1 = cc.sys.localStorage.getItem('the_water_margin_musicvol');
        // if (json1) {
        //     this.m_nOwnMusicVol = parseFloat(json1);
        //     if(this.m_bMusicSwitch)
        //         AudioManager.onMusicSwitch();
        //     AudioManager.setMusicVolume(this.m_nOwnMusicVol);
        // }else{
        //     this.m_nOwnMusicVol = this.m_nMusicVol;

        //     if(!this.m_bMusicSwitch){
        //         AudioManager.setMusicVolume(0);
        //         cc.sys.localStorage.setItem('the_water_margin_musicvol',  AudioManager._getLocalMusicVolume());
        //     }
        // }
    },
    //重置游戏音乐音效大小
    resetGameMusicAndAudio: function(){
        //cc.sys.localStorage.setItem('the_water_margin_soundvol', AudioManager._getLocalSoundVolume());
        //cc.sys.localStorage.setItem('the_water_margin_musicvol',  AudioManager._getLocalMusicVolume());


        AudioManager.setMusicVolume(this.m_nMusicVol);
        AudioManager.setSoundVolume(this.m_nSoundVol);

        if(!this.m_bMusicSwitch){
            AudioManager.offMusic();
        }

        if(!this.m_bSoundSwitch){
            AudioManager.offSound();
        }
    },
    setIsFastModel: function(){
        this.m_bIsFast = !this.m_bIsFast;
        cc.sys.localStorage.setItem('the_water_margin_fast_model',  this.m_bIsFast);
    },

    //获取游戏模式
    isFastModel: function(){
        return this.m_bIsFast;
    },
    //获取当前玩家在线人数
    getPlayerOnlineCount: function(){
        return this.m_nPlayerOnlineCount;
    },

    //设置当前玩家在线人数
    setPlayerOnlineCount: function(count){
        this.m_nPlayerOnlineCount = count;
    },

    //设置当前全屏奖信息
    setAllWinHistory: function(list){
        this.m_tAllWinHistoryList = list
    },

    //获取全屏奖信息
    getAllWinHistory: function(){
        return this.m_tAllWinHistoryList;
    },

    //设置在线玩家列表
    setPlayerOnlineList: function(list){
        this.m_tPlayersList = list;
    },

    //获取在线玩家列表
    getPlayerOnlineList: function(){
        return this.m_tPlayersList;
    },

    //重置拉取标记
    resetCanSendTag: function(){
        this.m_bCanSend = true;
    },
    //获取拉取标记
    getCanSendTag: function(){
        return this.m_bCanSend;
    },

    //获取老虎机主界面
    getSlotMainUI: function(){
        return this.m_slotMainUI;
    },
    getStartCoin: function(){
        return this.m_nStartCoin;
    },
    setGameState: function(state){
        this.m_nGameState = state
    },

    getGameState: function(){
        return this.m_nGameState
    },

    getBetMin: function(){
        return this.m_nRoomCfg.bet_min
    },

    getBetMax: function(){
        return this.m_nRoomCfg.bet_max
    },

    getBetLine: function(){
        return this.m_nRoomCfg.line
    },

    getResultFen: function(){
        return this.m_nGetFen
    },

    setResultFen: function(nValue){
        this.m_nGetFen = nValue
    },

    setNeedUpdateGold: function(isNeed){
        this.m_bNeedUpdate = isNeed;
    },

    //老虎机得分加上小游戏得分
    setResultFenAndGameFen: function(nValue){
        this.m_nGetFen += nValue;
    },
    
    getFreeTimes: function(){
        return this.m_nFreeRunTimes
    },

    setFreeTimesInEnterFree: function(){
        this.m_nFreeRunTimes = this.m_nFreeRunTimes - 1
    },

    getToltalFreeWin: function(){
        return this.m_nTotalFreeReward;
    },

    resetTotalFreeWin: function(){
        this.m_nTotalFreeReward = 0;
    },
    setEnterFree: function(isEnter){
        this.m_bIsEnterFree = isEnter;
    },

    isEnterFree: function(){
        return this.m_bIsEnterFree;
    },
    setSmallGameTimes: function(times){
        this.m_nSmallGameTimes = times;
    },

    getSmallGameTimes: function(){
        return this.m_nSmallGameTimes;
    },

    getLastDownInfo: function(){
        var info = {
            lastLineNum: this.m_nLastLineNum,
            lastLineBet: this.m_nLastLineBet,
        }
        return info;
    },

    setLastDownInfo: function(lineNum, lineBet){
        if (lineNum)
            this.m_nLastLineNum = lineNum
        if (lineBet)
            this.m_nLastLineBet = lineBet
    },

    getLineCfg: function(nLineNum){
        return this.m_tLineCfg[nLineNum]
    },
    getCard: function(x, y){
        return this.GetTablePosVal(this.m_tStartCards, x, y)
    },


    getGold: function(){
        return this.m_nGold
    },

    setGold: function(newGold){
        this.m_nGold = newGold;
    },

    getWinLines: function(){
        return this.m_tWinLines
    },

    getLastGold: function(){
        return this.m_nLastGold
    },

    setSlotLastAuto: function(){
        this.m_LastIsAuto = this.m_bAutoBet;
    },

    getSlotLastAuto: function(){
        return this.m_LastIsAuto;
    },

    getAddLineList: function(){
        return this.m_tAddLineList;
    },

    checkAddLineList: function(col){
        for(var i = 0; i < this.m_tAddLineList.length; i++){
            if(col == this.m_tAddLineList[i])
                return true;
        }
        return false;
    },

    setReconnect: function(isReconnect){
        this.m_bReconnect = isReconnect;
    },

    getReconnect: function(){
        return this.m_bReconnect;
    },

    checkUse : function(cardId){
        var list = data_slotcard.items[cardId].linellimt.split(';')
        if(list.length == 1){
            return cardId;
        }
        else{
            var cardLen = this.m_tCardList.length;
            cardId = parseInt(Math.random() * (cardLen - this.m_nSeed) + this.m_nSeed, 10);
            cardId = this.checkUse(cardId);
            return cardId;
        }
    },

    buildRunLine: function(startCard1, startCard2, startCard3, nCol){
        var cardList = [];
        cardList[0] = startCard1;
        cardList[1] = startCard2;
        cardList[2] = startCard3;
        var cardLen = this.m_tCardList.length;
        var lineLen = this.m_tRunCfg[nCol].lineLen;

        for(var i = 3; i < lineLen; i++){
            var cardId = parseInt(Math.random() * (cardLen - this.m_nSeed) + this.m_nSeed, 10);
            cardId = this.checkCardLimit(nCol, cardId);
            cardList[i] = this.m_tCardList[cardId];
        }
        return cardList;
    },

    buildRunLineNewSlot: function(startCard1, startCard2, startCard3, nCol){
        var cardList = [];
        cardList[0] = startCard1;
        cardList[1] = startCard2;
        cardList[2] = startCard3;
        var cardLen = this.m_tCardList.length;
        var lineLen = this.m_tRunCfg[nCol].lineLen;
        if(this.m_bNewSlot && this.m_tAddLineList.length != 0){
            for(var index = 0;index < this.m_tAddLineList.length; index++){
                if(this.m_tAddLineList[index] == nCol){
                    if(this.m_tAddLineList.length == 2 && nCol == 4)
                        lineLen = this.m_tRunCfg[nCol].lineLen * 8.5;
                    else
                        lineLen = this.m_tRunCfg[nCol].lineLen * 4.5;
                }
            }
        }
        for(var i = 3; i < lineLen; i++){
            var cardId = parseInt(Math.random() * (cardLen - this.m_nSeed) + this.m_nSeed, 10);
            cardId = this.checkCardLimit(nCol, cardId);
            cardList[i] = this.m_tCardList[cardId];

            cardId = this.checkUse(cardId);
            var count = parseInt(Math.random() * (4-2) + 2, 10);
            for(var m = 0; m < count ; m++){
                cardList[++i] = this.m_tCardList[cardId];
            }
        }
        return cardList;
    },

    buildAllRunLine: function(){
        this.m_tRunLines = [];
        for(var i = 0; i < 5; i++){
            var startCard1 = this.GetTablePosVal(this.m_tStartCards, i, 0);
            var startCard2 = this.GetTablePosVal(this.m_tStartCards, i ,1);
            var startCard3 = this.GetTablePosVal(this.m_tStartCards, i ,2);
            if(!this.m_bNewSlot)
                this.m_tRunLines[i] = this.buildRunLine(startCard1, startCard2, startCard3, i);
            else
                this.m_tRunLines[i] = this.buildRunLineNewSlot(startCard1, startCard2, startCard3, i);
        }
    },

    checkAddLine: function(tEndCards){
        this.m_tAddLineList.splice(0, this.m_tAddLineList.length);
        if(this.m_bNewSlot){
            for(var x= 0; x < 5; x++){
                for(var y = 0; y < 3; y++){
                    var cardId = this.GetTablePosVal(tEndCards, x, y);
                    var cardInfo = data_slotcard.items[cardId];
                    if(cardInfo && cardInfo.type == 3){//功能牌
                        var lineList = cardInfo.linellimt.split(';');
                        if(parseInt(lineList[0] - 1) == x){
                            for(var col = 0; col < 3; col++){
                                var nextCard = this.GetTablePosVal(tEndCards,parseInt(lineList[1] - 1), col);
                                if(nextCard == cardId)
                                    this.m_tAddLineList.push(parseInt(lineList[2] - 1));
                            }
                        }
                    }
                }
            }
        }
    },

    checkCardLimit: function(x, cardId){
        var cardInfo = data_slotcard.items[cardId];
        if(cardInfo.linellimt != ''){
            var lineList = cardInfo.linellimt.split(';');
            var canUse = false;
            for(var i = 0; i < lineList.length; i++){
                if(lineList[i] == x+1)
                    canUse = true;
            }
            if(canUse)
                return cardId;
            else{
                var cardLen = this.m_tCardList.length;
                cardId = parseInt(Math.random() * (cardLen - this.m_nSeed) + this.m_nSeed, 10)
                cardId = this.checkCardLimit(x,cardId);
                return cardId;
            }
        }else
            return cardId;
    },

    getAllRunLine: function(){
        return this.m_tRunLines;
    },

    getRunCfg: function(){
        return this.m_tRunCfg;
    },

    getWildCard: function(){
        return this.m_nWildCardID;
    },

    getAllWinType: function(){
        return this.m_nAllWin;
    },

    getBigWinType: function(){
        return this.m_nWinType;
    },

    //快速停止
    stopRunLine: function(indexList){
        var tEndCards = this.m_tStartCards;

        for(var i = 0; i < 5; i++){
            var endCard1 = this.GetTablePosVal(tEndCards, i, 0);
            var endCard2 = this.GetTablePosVal(tEndCards, i, 1);
            var endCard3 = this.GetTablePosVal(tEndCards, i, 2);
            var cardList = this.m_tRunLines[i];
            var index = indexList[i];
            if(index < cardList.length - 4){
                cardList[index] = endCard1;
                cardList[index + 1] = endCard2;
                cardList[index + 2] = endCard3;
            }
            cardList.splice(0, cardList.length);

        }
    },

    //设置主界面按钮状态
    setDownBtnState: function(state){
        if(this.m_slotMainUI)
            this.m_slotMainUI.setDownBtnState(state);
    },

    //进入小游戏
    showSmallGame: function(){
        this.setSlotLastAuto();
        this.stopBetAuto();
        this.m_oTinyGameData.setBetNum(this.getLastDownInfo().lastLineNum * this.getLastDownInfo().lastLineBet);
        if(this.m_slotMainUI){
            this.m_slotMainUI.setDownBtnState(SlotType.DownBtnState.Downing);
            this.m_slotMainUI.stopLineEffect();
        }
    },

    betAuto: function(line_num, line_bet_gold){
        this.m_bAutoBet = true;
        this.bet(line_num, line_bet_gold);
        this.setSlotLastAuto();
    },
    setBetAuto: function(isAuto){
        this.m_bAutoBet = isAuto;
    },
    isBetAuto: function(){
        return this.m_bAutoBet;
    },
    stopBetAuto: function(){
        this.m_bAutoBet = false;
    },

    //初始化赢线索引
    InitLineIndex: function(nValue){
        var tLine = this.m_nRoomCfg.line_order;
        tLine = tLine.split(';');
        for(var k = 0; k < tLine.length; k++){
            var v = tLine[k];
            if(v[k] == nValue)
                this.m_nLineIndex = k;
        }
    },

    //初始化压分索引
    InitBetIndex: function(nValue){
        var tBet = this.m_nRoomCfg.bet_order.split(';');
        var IndexValue = Math.floor(nValue / this.m_nRoomCfg.bet_min) * this.m_nRoomCfg.bet_min;
        for(var k = 0; k < tBet.length; k++){
            var v = tBet[k];
            if(v == IndexValue){
                this.m_nBetIndex = k;
                break;
            }else if(v > IndexValue){
                if(tBet[k - 1] != null && tBet[k - 1] < IndexValue){
                    this.m_nBetIndex = k;
                    break;
                }
            }
        }
    },
    //获取压分值
    getSelectBetNumByIndex: function(index){
        var tBet = this.m_nRoomCfg.bet_order.split(';');
        return tBet[index];
    },

    //获取当前压分值
    getBetNumByIndex: function(){
        var tBet = this.m_nRoomCfg.bet_order.split(';');
        if(this.m_nBetIndex >= tBet.length)
            this.m_nBetIndex = 0;
        else if(this.m_nBetIndex < 0){
            this.m_nBetIndex = tBet.length - 1;
            if(this.m_nBetIndex == 0)
                this.m_nBetIndex = tBet.length;
        }
        return tBet[this.m_nBetIndex];
    },

    //押注索引操作
    controlBetIndex: function(nTYpe){
        var tBet = this.m_nRoomCfg.bet_order.split(';');
        if(nTYpe == SlotType.SlotAddOrSubState.InAdd)
            this.m_nBetIndex += 1;
        else
            this.m_nBetIndex -= 1;
    },

    //押注判定
    jugeBetIndex: function(nValue){
        var tBet = this.m_nRoomCfg.bet_order.split(';');
        var IndexValue = Math.floor(nValue / this.m_nRoomCfg.bet_min) * this.m_nRoomCfg.bet_min;
        for(var k = 0; k < tBet.length; k++){
            if(parseInt(tBet[k]) == IndexValue){
                this.m_nBetIndex = k;
                break;
            }else if(tBet[k] > IndexValue){
                if(tBet[k - 1] != null && tBet[k - 1] < IndexValue){
                    this.m_nBetIndex = k - 1;
                    break;
                }
            }
        }
    },

    getTinyGameData: function(){
        return this.m_oTinyGameData;
    },
    ///////////////////////////////////////老虎机消息发送begin/////////////////////////////////////////
    //进入游戏
    enterGame: function(gameid, roomid){
        slotSender.enterSlotRoom(gameid, roomid);
    },
    //退出游戏
    quitGame: function(){
        slotSender.quiSlot(this.m_nGameType, this.m_nRoomType);
    },

    //下注
    bet: function(line_num, line_bet_gold){
        if(hall_prop_data.getInstance().getCoin() < (data_slotroom.items[this.m_nRoomType - 1].bet_min * line_num)){
            cc.dd.DialogBoxUtil.show( 1, '您的金币不足，不能继续进行游戏', '退出', '取消', function(){
                cc.dd.SceneManager.enterHall();
                AudioManager.stopAllSound();
            }, null);
        }
        if(line_num != 0)
            this.m_nLastLineNum = line_num;
        if(line_bet_gold != 0)
            this.m_nLastLineBet = line_bet_gold;
        if(this.m_nGold >= line_num * line_bet_gold)
            this.m_nGold = this.m_nGold - line_num * line_bet_gold;

        slotSender.betSlot(line_num, line_bet_gold);

        this.m_nGetFen = 0;
        this.m_tWinLines = [];
        this.m_nGameState = SlotType.GameState.Beting;
    },

    //收分操作
    awardFen: function(){
        slotSender.getScore();
    },

    //检测是否有小游戏
    checkSmallGame: function(){
        slotSender.checkSmallGame();
    },

    //
    ///////////////////////////////////////老虎机消息发送end/////////////////////////////////////////

    ///////////////////////////////////////老虎机消息接收处理begin/////////////////////////////////////////
    //解析协议
    parseFuncs: function(funcs, isReconnect){
        this.m_nSmallGameTimes = 0;
        for(var k = 0; k < funcs.length; k++){
            var v = funcs[k];
            if(v.funcType == SlotType.FuncType.Free){ //免费次数
                if((v.funcCnt - this.m_nFreeRunTimes) > 0)
                    this.m_nTotalFreeTimes = v.funcCnt - this.m_nFreeRunTimes + this.m_nTotalFreeTimes;
                this.m_nFreeRunTimes = v.funcCnt;
                // this.m_nLastLineNum = v.line;
                // this.m_nLastLineBet = v.bet;
                this.m_nGold = v.newMoney;
                if(isReconnect)
                    this.m_nTotalFreeReward = v.winMoney;
            }else if(v.funcType == SlotType.FuncType.SmallGame){//小游戏
                this.m_nSmallGameTimes = v.funcCnt;
                var gameData = this.getTinyGameData();
                gameData.setLeftNum(this.m_nSmallGameTimes);

                this.m_nGold = v.newMoney;
                if(this.m_nGameType == 101){//水浒小游戏
                    if(v.miniWinMoney)
                        this.m_oTinyGameData.setRewardNum(v.miniWinMoney);
                    this.setResultFenAndGameFen(v.winMoney);     
                }else if(this.m_nGameType == 102 && isReconnect){//财神小游戏
                    this.m_nLastLineNum = v.line;
                    this.m_nLastLineBet = v.bet;
                    slotSender.reconnectMammonslotTinyGame();
                }   
            }
        }
    },

    //玩家进入老虎机游戏房间
    on_msg_slot_room_info_2c: function(msg, isReconnect){
        this.onInit();
        this.setReconnect(isReconnect);
        this.m_nPlayerOnlineCount = msg.roleNum;

        this.m_tLineCfg = [];
        for (var k = 0; k < data_slotline.items.length; k++){
            var v = data_slotline.items[k];
            this.m_tLineCfg[k] = [];
            for (var i = 1; i <= 5; i++ )
                this.m_tLineCfg[k][i -1] = { x : v["x" + i], y : v["y" + i] }
        }

        this.m_nRoomType = msg.roomType;
        this.m_nGameType = msg.gameType;
        this.m_nRoomCfg =  data_slotroom.getItem(function(item){
            if(item.room_id == msg.roomType && item.play_sub_type == msg.gameType)
                return  item;
        })
        this.m_nGold = hall_prop_data.getInstance().getCoin();
        this.m_nLastGold = this.m_nGold;
        this.m_nLastLineNum = this.getBetLine();
        this.m_nLastLineBet = this.getBetMin();

        this.InitLineIndex(this.m_nLastLineNum);
        this.InitBetIndex(this.m_nLastLineBet);

        this.m_tCardList = [];
        var i = 0;
        for (var k = 0; k < data_slotcard.items.length; k++){
            if(data_slotcard.items[k].play_sub_type == this.m_nGameType){ //根据游戏类型选择卡片数据
                this.m_tCardList[k] = data_slotcard.items[k].key;
                if (data_slotcard.items[k].type == SlotType.CardType.Wild) 
                    this.m_nWildCardID = k;
                else if( data_slotcard.items[k].func_type == SlotType.FuncType.Free )
                    this.m_nScatterCardId = k;
                i++;
            }
        }
        var cardLen = this.m_tCardList.length;
        this.m_tStartCards = [];
        for(var x = 0; x < 5; x++){
            for(var y = 0; y < 3; y++){
                if(this.m_nGameType == 101)//水浒传初始为0到图片
                    this.SetTablePosVal(this.m_tStartCards, x, y,  0);//parseInt(Math.random() * (cardLen - seed) + seed, 10));
                else{
                    this.m_nSeed = 9;
                    var cardId = parseInt(Math.random() * (cardLen - this.m_nSeed) + this.m_nSeed, 10);
                    cardId = this.checkCardLimit(x, cardId)
                    this.SetTablePosVal(this.m_tStartCards, x, y,  cardId);
                }
            }
        }

        this.m_tRunCfg = [];
        var index = 0;
        for(var k = 0; k < data_slotRun.items.length; k++){
            if(data_slotRun.items[k].play_sub_type == this.m_nRoomCfg.play_sub_type){
                this.m_tRunCfg[index] = data_slotRun.items[k];
                index++;
            }
        }

        if(this.m_nRoomCfg.play_sub_type == 101){//水浒传
            var TinyGameManager = require('TinyGameManger').TinyGameManger;
            this.m_oTinyGameData = new TinyGameManager();
            this.m_oTinyGameData.TinyGameManger();
            this.m_bNewSlot = false;
        }else if(this.m_nRoomCfg.play_sub_type == 102){//财神
            var TinyGameManager = require('mammonTinyGameManger').mammonTinyGameManger;
            this.m_oTinyGameData = new TinyGameManager();
            this.m_oTinyGameData.mammonTinyGameManger();
            this.m_bNewSlot = true;
        }
        if(msg.funcsList != null)
            this.parseFuncs(msg.funcsList, false);

        this.buildAllRunLine();
        
        if(this.m_nRoomCfg.play_sub_type == 101){//水浒传
            cc.dd.SceneManager.replaceScene('water_margin_slot');
        }else if(this.m_nRoomCfg.play_sub_type == 102){//财神到
            cc.dd.SceneManager.replaceScene('mammon_slot_Scene');
            if(this.getReconnect())
                this.checkSmallGame();
        }

        // if(this.m_nSmallGameTimes > 0){
        //     var Scene = cc.director.getScene();
        //     this.m_slotMainUI = cc.director.getScene().node.getChildByName('Canvas').getComponent('the_water_margin_Slot');
        //     this.m_slotMainUI.showSmallGame();
        // }
    },

    //下注消息返回
    on_msg_slot_bet_2c: function(msg){
        // msg.result.winLinesList =
        // [ { line: 3, card: 14, num: 5 },
        //   { line: 2, card: 12, num: 5 },
        //   { line: 1, card: 13, num: 5 },
        // ]
        this.parseFuncs(msg.result.funcsList, false);

        this.m_tResultData = msg.resut;
        this.m_nLastGold = this.m_nGold;
        this.m_nAllWin = msg.type;
        this.m_nGold = msg.result.newMoney;
        this.m_tWinLines = msg.result.winLinesList;
        this.m_nGetFen = msg.result.winMoney;
        this.m_nWinType = msg.result.bigWin;

        if(this.m_bIsEnterFree)
            this.m_nTotalFreeReward += this.m_nGetFen;


        this.m_tRunCfg.splice(0, this.m_tRunCfg.length);

        var index = 0;
        for(var k = 0; k < data_slotRun.items.length; k++){
            if(data_slotRun.items[k].play_sub_type == this.m_nRoomCfg.play_sub_type){
                this.m_tRunCfg[index] = data_slotRun.items[k];
                index++;
            }
        }

        var tEndCards = [];
        // msg.result.cardsList = [
        //     { x: 0, y: 2, cardId: 9 },
        //     { x: 0, y: 1, cardId: 13 },
        //     { x: 0, y: 0, cardId: 14 },
        //     { x: 1, y: 2, cardId: 10 },
        //     { x: 1, y: 1, cardId: 11 },
        //     { x: 1, y: 0, cardId: 14 },
        //     { x: 2, y: 2, cardId: 9 },
        //     { x: 2, y: 1, cardId: 10 },
        //     { x: 2, y: 0, cardId: 14 },
        //     { x: 3, y: 2, cardId: 11 },
        //     { x: 3, y: 1, cardId: 13 },
        //     { x: 3, y: 0, cardId: 14 },
        //     { x: 4, y: 2, cardId: 12 },
        //     { x: 4, y: 1, cardId: 13 },
        //     { x: 4, y: 0, cardId: 14 }, 
        // ]


        for(var k = 0; k < msg.result.cardsList.length; k++){
            var v = msg.result.cardsList[k];
            this.SetTablePosVal(tEndCards, v.x, v.y, v.cardId);
        }
        this.checkAddLine(tEndCards);
        this.buildAllRunLine();

        if(this.m_nGameType == 101)//水浒传
            this.m_slotMainUI = cc.dd.SceneManager.getCurrScene().getChildByName('Canvas').getComponent('the_water_margin_Slot');
        else if(this.m_nGameType == 102)//财神到
            this.m_slotMainUI = cc.dd.SceneManager.getCurrScene().getChildByName('Canvas').getComponent('mammon_slot_ui');
        // if(this.m_nSmallGameTimes > 0){
        //     //this.m_slotMainUI.setBtnState(SlotType.DownBtnState.Downing);
        //     this.m_slotMainUI.setDownBtnState(SlotType.DownBtnState.Stop);
        // }
       // this.m_slotMainUI.UpdatePre();

        for(var i = 0; i < 5; i++){
            var endCard1 = this.GetTablePosVal(tEndCards, i, 0);
            var endCard2 = this.GetTablePosVal(tEndCards, i, 1);
            var endCard3 = this.GetTablePosVal(tEndCards, i, 2);
            var cardList = this.m_tRunLines[i];
            cardList[cardList.length - 4] = endCard1;
            cardList[cardList.length - 3] = endCard2;
            cardList[cardList.length - 2] = endCard3;
        }

        this.m_tStartCards = tEndCards;
        if(this.m_slotMainUI){
            this.m_slotMainUI.FillRunline();
            this.m_slotMainUI.StartRunEffect();
        }
        this.m_nGameState = SlotType.GameState.Runing;
        // if(this.m_bAutoBet == false && this.m_nFreeRunTimes == 0)
        //     this.m_slotMainUI.showStopBtn();
    },

    //短线重连
    on_msg_slot_reconnect_2c: function(msg){
        this.setReconnect(false);
        this.parseFuncs(msg.funcList, true);
        if(this.m_nGameType == 101)//水浒传
            this.m_slotMainUI = cc.dd.SceneManager.getCurrScene().getChildByName('Canvas').getComponent('the_water_margin_Slot');
        else if(this.m_nGameType == 102){//财神到
            this.m_slotMainUI = cc.dd.SceneManager.getCurrScene().getChildByName('Canvas').getComponent('mammon_slot_ui');
            if(this.m_nFreeRunTimes > 0)
                this.m_slotMainUI.playBackGround();
        }
        this.m_slotMainUI.updateGold();
        if(this.m_nSmallGameTimes > 0){//小游戏
            this.m_slotMainUI.setDownBtnState(SlotType.DownBtnState.Stop);
            this.m_slotMainUI.showSmallGame();
            this.m_oTinyGameData.setBetNum(this.m_nLastLineBet * this.m_nLastLineNum);
        }else if(this.m_nFreeRunTimes > 0){//免费次数
            this.m_slotMainUI.setDownBtnState(SlotType.DownBtnState.Stop);
            this.m_slotMainUI.enterFreeTimes();
            this.m_bIsEnterFree = true;
        }

    },

    //退出游戏
    on_msg_slot_quit_2c: function(){
        hall_common_data.getInstance().gameId = 0;
        AudioManager.stopAllSound();
        cc.dd.SceneManager.enterHall();
    },

    //收分返回
    on_msg_slot_get_2c: function(msg){
        this.m_nGold = msg.newMoney;
        if(this.m_bNeedUpdate){
            this.m_slotMainUI.updateGold();
            this.m_bNeedUpdate = false;
        }
    },
    ///////////////////////////////////////老虎机消息接收处理end/////////////////////////////////////////

    /////////////////////////////////////////老虎机全屏奖/在线人数数据//////////////////////////////////

    //发送拉取列表消息
    getAllWinOrOnlineList: function(type, index){
        if(this.m_bCanSend)
            slotSender.getAllWinOrOnlineList(this.m_nGameType, this.m_nRoomType, type, index);
    },

    //获取列表返回
    on_msg_slot_op_2c: function(msg){
        if(msg.infosList.length == 0)
            this.m_bCanSend = false;
        if(msg.opType == 2){
            this.m_tAllWinHistoryList.splice(0, this.m_tPlayersList.length);
            this.m_tAllWinHistoryList = msg.infosList;
            if(msg.index == 1){
                cc.dd.UIMgr.openUI("gameyj_water_margin_slot/Prefab/all_win_history_ui",function (node) {
                    let ui = node.getComponent("all_win_history_UI");
                    if(ui){
                        ui.setHistory();
                    }
                });
            }else{
                var ui = cc.dd.UIMgr.getUI("gameyj_water_margin_slot/Prefab/all_win_history_ui");
                let cpt = ui.getComponent("all_win_history_UI");
                if(cpt){
                    cpt.setHistory();
                }
            }

        }else if(msg.opType == 1){
            this.m_tPlayersList.splice(0, this.m_tAllWinHistoryList.length);
            this.m_tPlayersList = msg.infosList;
            if(msg.index == 1){
                cc.dd.UIMgr.openUI("gameyj_water_margin_slot/Prefab/player_list_UI",function (node) {
                    let ui = node.getComponent("player_list_UI");
                    if(ui){
                        ui.setPlayerList();
                    }
                });
            }else{
                var ui = cc.dd.UIMgr.getUI("gameyj_water_margin_slot/Prefab/player_list_UI");
                let cpt = ui.getComponent("player_list_UI");
                if(cpt){
                    cpt.setPlayerList();
                }
            }
        }
    },

    //在线人数更新
    on_msg_slot_update: function(msg){
        this.setPlayerOnlineCount(msg.roleNum);
        this.m_slotMainUI = cc.dd.SceneManager.getCurrScene().getChildByName('Canvas').getComponent('the_water_margin_Slot');
        if(this.m_slotMainUI)
            this.m_slotMainUI.updatePlayerOnline();
    },

});

module.exports = {
    SlotManger : SlotManger
};
