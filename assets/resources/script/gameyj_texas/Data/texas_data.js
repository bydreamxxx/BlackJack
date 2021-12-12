
let RoomMgr = require('jlmj_room_mgr').RoomMgr;
let game_room = require("game_room");
const hall_prop_data = require('hall_prop_data').HallPropData.getInstance();
const HallCommonData = require('hall_common_data').HallCommonData;

var Texas_Event = cc.Enum({
    ROOM_STATE: 'TEXAS_ROOM_STATE',        //房间状态
    BANKER: 'TEXAS_BANKER',    //玩家准备
    PLAYER_READY: 'TEXAS_PLAYER_READY',    //玩家准备
    OVER_TURN: 'TEXAS_OVER_TURN',          //话事
    PLAYER_JOIN: 'TEXAS_PLAYER_JOIN',      //玩家进入
    PLAYER_EXIT: 'TEXAS_PLAYER_EXIT',      //玩家离开
    BET_RAISE: 'TEXAS_BET_RAISE',          //加注
    BET_SHOWHAND: 'TEXAS_BET_SHOWHAND',    //梭哈
    BET_DISCARD: 'TEXAS_BET_DISCARD',      //弃牌
    BET_CALL: 'TEXAS_BET_CALL',            //跟注
    BET_BOTTOM: 'TEXAS_BET_BOTTOM',         //底注
    BET_OPENCARD: 'TEXAS_BET_OPENCARD',    //开牌
    BET_PASS: 'TEXAS_BET_PASS',            //过
    DEAL_COMMON_CARD: 'TEXAS_DEAL_COMMON_CARD',//发3张公共牌
    DEAL_SINGLE_COMMON_CARD: 'DEAL_SINGLE_COMMON_CARD',//发1张公共牌
    DEAL_CARD: 'TEXAS_DEAL_CARD',          //发玩家牌
    SHOW_MY_CARD: 'TEXAS_SHOW_MY_CARD',     //显示我的牌
    RESULT: 'TEXAS_RESULT',                //结算
    NO_CARDS_RESULT: 'NO_CARDS_RESULT',    //提前结算
    RECONNECT: 'TEXAS_RECONNECT',          //重连
    DISSOLVE: 'TEXAS_DISSOLVE',            //解散
    DISSOLVE_RESULT: 'TEXAS_DISSOLVE_RESULT', //解散结果
    FRIEND_READY: 'TEXAS_FRIEND_READY',    //朋友场准备
    UPDATE_ROUND_BET:'TEXAS_UPDATE_ROUND_BET',   //更新当局注数
    UPDATE_PLAYER_GOLD:'UPDATE_PLAYER_GOLD',   //更新玩家金币
    UPDATE_TITTLE:'UPDATE_TITTLE',   //更新标题
    CHANGE_ROOM_STATE_TO_RESULT_STATE:'CHANGE_ROOM_STATE_TO_RESULT_STATE',   //改变房间状态到结算， 服务器没有发送该状态下来
    //////////////////////////////test
    SHOW_TEST_CARD: 'TEXAS_SHOW_TEST_CARD',    //test
    SHOW_TEST_RATE: 'SHOW_TEST_RATE',    //test
});
var TEXAS_ED = new cc.dd.EventDispatcher();

const CardType = {  //牌类型
    Invalid: -1,                //无效
    SANPAI: 1,                  //散牌  
    DUI_1: 2,                   //对子
    DUI_2: 3,                   //两对
    SANTIAO: 4,                 //三条
    SHUNZI: 5,                  //顺子
    JINHUA: 6,                  //金花
    HULU: 7,                    //葫芦
    SITIAO: 8,                  //四条
    THS: 9,                     //同花顺
};

const PLAYER_NUM = 9;           //玩家人数

const POKER_LIST = [
    21, 22, 23, 24,     // 2    方块   梅花   红桃   黑桃
    31, 32, 33, 34,     // 3
    41, 42, 43, 44,     // 4
    51, 52, 53, 54,     // 5
    61, 62, 63, 64,     // 6
    71, 72, 73, 74,     // 7
    81, 82, 83, 84,     // 8
    91, 92, 93, 94,     // 9
    101, 102, 103, 104,  // 10
    111, 112, 113, 114,  // J
    121, 122, 123, 124,  // Q
    131, 132, 133, 134,  // K
    141, 142, 143, 144   // A
];

var texas_Data = cc.Class({
    s_texas_data: null,
    statics: {
        Instance: function () {
            if (!this.s_texas_data) {
                this.s_texas_data = new texas_Data();
            }
            return this.s_texas_data;
        },

        Destroy: function () {
            if (this.s_texas_data) {
                this.s_texas_data.clear();
                this.s_texas_data = null;
            }
        },
    },

    clear() {
        this.isFriendGold = null;
        this.isFriend = null;
        this.playerList = [];
        this.roomStatus = 0;
        this.resultPokerList = null;
        this.resultWinList = null;
        this.t_commonCards = [];
        this.bankerId = 0;
        this.m_round = 0;
        this.m_totalBet= 0; 
        this.m_totalRoundBet= 0;
        this.m_lastBet = 0;
        this.m_opflag = 0;
        this.curPlayerTime = 0;
    },

    ctor() {
        this.playerList = [];
        this.roomStatus = 0;
        this.bankerId = 0;
        this.m_totalBet= 0;         //总下注
        this.m_totalRoundBet= 0;    //总下注(一轮算一次)
        this.m_opflag =0;
        this.m_bAutoPickMoney = 0;
        this.curPlayerTime = 0;
        this.stand = false;
    },

    //重置游戏数据
    resetGameData() {
        //清理要离开的玩家
        let leaves = [];
        for (var i = 0; i < this.playerList.length; i++) {
            if (this.playerList[i].isPrepareLeave == true) {
                leaves.push(i);
            }
        }
        for (var i = 0; i < leaves.length; i++) {
            this.playerList.splice(leaves[i], 1);
        }

        this.curPlayer = null;
        this.curPlayerTime = 0;
        for (var i = 0; i < this.playerList.length; i++) {
            if (this.playerList[i]) {
                this.playerList[i].curBet = 0;
                this.playerList[i].turnBet = 0;
                this.playerList[i].isDiscard = false;
                this.playerList[i].cardsList = [];
                this.playerList[i].cardtype = null;
                this.playerList[i].isAllin = false;
                this.playerList[i].state = 0;
                // this.playerList[i].joinGame = 0;
            }
        }
        this.t_commonCards = [];
        this.m_round = 0;
        this.m_totalBet = 0;
        this.m_totalRoundBet= 0;
        this.m_lastBet = 0;
        this.m_opflag = 0;
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
            isPrepareLeave:false,
            setReady(r) { this.bready = r; },
            setOnLine(ol) { this.isOnLine = ol; },
            //-------------游戏内数据---------------
            isBanker: false,        //是否庄家
            curBet: 0,              //当前轮下注(不包括底注)
            turnBet: 0,              //当前轮总下注
            totalBet:0,             //当局总下注
            cardsList: [],          //手牌列表
            cardtype: -1,           //手牌类型
            isAllin: false,         //梭哈
            isDiscard: false,       //弃牌
            
        }
        return playerData;
    },

    haveWinRateCard()
    {
        var itemCard = [1036,1037,1038];
        for(var i=0;i<itemCard.length;i++)
        {
            var item = hall_prop_data.getItemInfoByDataId(itemCard[i]);
            if(item && item.count > 0)
            {
                return true;
            }
        }
        return false;
        
    },

    checkAutoPickMoney()
    {
        if(this.m_bAutoPickMoney)
        {
            var configId = this.getConfigId();
            if (configId) {
                var cfgData = game_room.getItem(function (item) {
                    return item.key === configId;
                });
                var pickGold = Math.min(hall_prop_data.getBankCoin(),cfgData.entermax); 
                if(pickGold<=0)
                {
                    cc.log('银行没钱');
                    return;
                }
                var req = new cc.pb.baoxianxiang_coin.msg_coin_bank_take_2s();
                req.setCoin(pickGold);
                cc.gateNet.Instance().sendMsg(cc.netCmd.baoxianxiang_coin.cmd_msg_coin_bank_take_2s, req,
                    '取钱', true);
            }

            
        }
    },

    //获取最大玩家下注
    getMaxTurnBet() {
        let max = 0;
        for (var i = 0; i < this.playerList.length; i++) {
            if (this.playerList[i].turnBet > max)
                max = this.playerList[i].turnBet;
        }
        return max;
    },
    getMaxCurBet() {
        let max = 0;
        for (var i = 0; i < this.playerList.length; i++) {
            if (this.playerList[i].curBet > max)
                max = this.playerList[i].curBet;
        }
        return max;
    },
    getMaxCurBetWithout(id) {
        let max = 0;
        for (var i = 0; i < this.playerList.length; i++) {
            if (this.playerList[i].curBet > max && this.playerList[i].userId != id)
                max = this.playerList[i].curBet;
        }
        return max;
    },
    //当前轮
    getRoundTotalBet() {
        let total = 0;
        for (var i = 0; i < this.playerList.length; i++) {
            total += this.playerList[i].turnBet;
        }
        return total;
    },

    clearBetRound() {

        for (var i = 0; i < this.playerList.length; i++) {
            this.playerList[i].turnBet = 0;
            this.playerList[i].curBet = 0;
        }
        this.m_lastBet = this.m_nBaseScore;
    },

    /**
     * 通过view获取玩家数据
     * @param {Number} view 
     */
    getPlayerByViewIdx(view) {
        if (this.selfSeat > -1) {
            for (var i = 0; i < this.playerList.length; i++) {
                var pview = -1;
                if (this.playerList[i].seat >= this.selfSeat && this.selfSeat != 100) {
                    pview = this.playerList[i].seat - this.selfSeat;
                }
                else {
                    if(this.selfSeat == 100)
                        pview = this.playerList[i].seat
                    else
                        pview = this.playerList[i].seat - this.selfSeat + PLAYER_NUM;
                }
                if (view == pview)
                    return this.playerList[i];
            }
        }
        return null;
    },  

    getPlayerList() {
        return this.playerList;
    },

    //获取玩家数据
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

    /**
     * 获取玩家视觉座位号
     * @param {Number} id 
     */
    getViewById(id) {
        if (this.selfSeat < 0) {
            return -1;
        }
        for (var i = 0; i < this.playerList.length; i++) {
            if (this.playerList[i] && this.playerList[i].userId == id) {
                if (this.playerList[i].seat >= this.selfSeat) {
                    return this.playerList[i].seat - this.selfSeat;
                }
                else {
                    if(this.selfSeat >= 100)
                        return this.playerList[i].seat
                    else
                        return this.playerList[i].seat - this.selfSeat + PLAYER_NUM;
                }
            }
        }
    },

    //设置加入游戏的玩家
    setGameingPlayers(msg) {
        for(var i=0;i<msg.playeridList.length;i++)
        {
            var player = this.getPlayerById(msg.playeridList[i]);
            if(player)
                player.joinGame = 1;
        }

    },



    //获取游戏ID
    getGameId() {
        return this.m_nGameId || RoomMgr.Instance().gameId;
    },

    //获取房间ID
    getRoomId() {
        return this.m_nRoomid || RoomMgr.Instance().roomId;
    },

    /**
     * 玩家进入
     * @param {player_common_data} role_info 
     */

    playerEnter(role_info,joinGame) {
        var player = this.createCommonPlayer(role_info);
        player.joinGame = joinGame;
        if (player.userId == cc.dd.user.id) {
            this.selfSeat = player.seat;
            if(player.seat == 100)
                this.stand = true;
            else
                this.stand = false;
        }
        for (var i = 0; i < this.playerList.length; i++) {
            if (this.playerList[i].userId == player.userId) {
                this.playerList.splice(i, 1);
                break;
            }
        }
        this.playerList.push(player);
        TEXAS_ED.notifyEvent(Texas_Event.PLAYER_JOIN, player);
    },

    /**
     * 玩家离开
     * @param {*} userId 
     */
    playerExit(userId) {
        if (userId == cc.dd.user.id) {
            var own = this.getPlayerById(userId);
            if(own){
                own.joinGame = 0;
                own.seat = 100;
                return;
            }
        }
        if(this.roomStatus == 2){ //结算状态，不处理玩家退出
            for (var i = 0; i < this.playerList.length; i++) {
                if (this.playerList[i].userId == userId) {
                    this.playerList[i].isPrepareLeave = true;
                    break;
                }
            }
            return;
        }
        for (var i = 0; i < this.playerList.length; i++) {
            if (this.playerList[i].userId == userId) {
                this.playerList.splice(i, 1);
                break;
            }
        }
        TEXAS_ED.notifyEvent(Texas_Event.PLAYER_EXIT, null);
    },

    //判断是否可以开局
    getIsAllReady() {
        // var playerNum = 0;
        // var readyNum = 0;
        // for (var i = 0; i < this.playerList.length; i++) {
        //     if (this.playerList[i]) {
        //         playerNum++;
        //         if (this.playerList[i].bready) {
        //             readyNum++;
        //         }
        //     }
        // }
        // if (playerNum < 2)
        //     return false;
        // if (readyNum < playerNum - 1)
        //     return false;
        return true;
    },

    /**
     * 设置 金币场 数据
     * @param data
     */
    setData: function (data) {
        this.m_nKey = data.key;
        this.m_nGameId = data.gameid;
        this.m_nRoomid = data.roomid;
        this.m_strTitle = data.titel;
        this.m_nBaseScore = data.basescore;
        this.m_nUnderScore = data.entermin;
        this.m_nExceedScore = data.entermax;
        this.m_nUnderPlayerNum = data.playernummin;
        this.m_nExceedPlayerNum = data.playernummax;
        this.m_strDesc = data.desc;
        this.t_commonCards = [];
        this.m_round = 0;
        this.m_lastBet= 0;
        this.m_bAutoPickMoney = 0;
    },

    getBaseScore() {
        let pycBase = 1;
        return this.m_nBaseScore || pycBase;
    },

    getConfigId()
    {
        return this.configId|| RoomMgr.Instance().configId
    },
    
    //获取是否满员
    getIsRoomFull(max) {
        return this.playerList.length >= max;
    },

    updatePlayerNum() {
        this.playerList = [];
    },

    updateCommonCards(msg,isReconnect) {
        if(msg.round)
            this.m_round = msg.round;
        if(isReconnect || msg.round == 1 || this.t_commonCards == null || this.t_commonCards.length == 0)
        {
            this.t_commonCards = msg.pokerList;
            TEXAS_ED.notifyEvent(Texas_Event.DEAL_COMMON_CARD, msg);
        }else
        {
            for(var i=0;i<msg.pokerList.length;i++)
            {
                if(this.t_commonCards.length>=5)
                    break;

                this.t_commonCards.push(msg.pokerList[i]) 
            }
            
            TEXAS_ED.notifyEvent(Texas_Event.DEAL_SINGLE_COMMON_CARD, msg);
        }
        
    },

    requesYuYinUserData() {
        cc.dd.AudioChat.clearUsers();
        if (this.playerList) {
            this.playerList.forEach(function (player) {
                if (player) {
                    if (player.userId != cc.dd.user.id) { // && player.isOnLine
                        cc.dd.AudioChat.addUser(player.userId);
                    }
                }
            });
        }
    },

    convertNumToStr(num) {
        if (num < 10000) {
            return num.toString();
        }
        else if (num < 100000000) {
            return Math.round(num / 1000) / 10 + '万';
        }
        else {
            return Math.round(num / 10000000) / 10 + '亿';
        }
    },
    setBanker(msg)
    {
        this.bankerId = msg.bankerId || msg.bankId
        this.bigBlindId = msg.bigBlindId
    },

    combination(arr, m) {
        let r = [];
        _([], arr, m);
        return r;
        function _(t, a, m) {
          //t:临时数组 a:目标数组 m：多少个数进行组合
          if (m === 0) {
            r[r.length] = t;//相当于push
            return;
          }
          for (let i = 0; i <= a.length - m; i++) {
            //从0开始 到n-m
       
            let b = t.slice();//将t赋值给b 不能用=赋值，使用slice会形成新的数组赋值
            b.push(a[i])
            _(b, a.slice(i + 1), m - 1); 
          }
        }
    },

      
    //获取给定牌的最大牌型
    getCardType(myCards,commonCards) {
        var cards = null;
        var maxCards = [];
        if(commonCards == null || commonCards.length<=0)
        {
            cards = myCards;
            return [this.getSingleCardType(cards),cards];
        }else
        {
            if(commonCards.length==3)
            {
                cards = myCards.concat(commonCards)
                return [this.getSingleCardType(cards),cards];
            }else if(commonCards.length>=4)//4,5张牌
            {
                cards = commonCards.concat(myCards)
                var arry = this.combination(cards,5)
                var max = 0;
                for(var i=0;i<arry.length;i++)
                {
                    var v = this.getSingleCardType(arry[i]);
                    if(v>max){
                        max = v;
                        maxCards = [].concat(arry[i]);
                    }else if(v==max)
                    {
                        if(this.compareCards(v,v,[].concat(arry[i]),maxCards))
                        {
                            maxCards = [].concat(arry[i]);
                        }
                    }
                }
                return [max,maxCards];
            }
        }
    },

    //获取5张牌的牌型（两张牌或者5张牌）
    getSingleCardType(cards)
    {
        if(cards == null || cards.length<2)
        {
            cc.log('牌参数不对');
            return;
        }
        var cardType = 1;
        /////////////////两张牌（只有高牌和一对）////////////////////
        if(cards.length==2)
        {
            if(Math.floor(cards[0] / 10) == Math.floor(cards[1] / 10))
            {
                cardType = 2;
            }
            return cardType;
        }


        /////////////////五张牌//////////////////
        cards.sort(function (a, b) { return a - b });

        var cardsValue = [];
        cardsValue.push( Math.floor(cards[0] / 10));
        cardsValue.push( Math.floor(cards[1] / 10));
        cardsValue.push( Math.floor(cards[2] / 10));
        cardsValue.push( Math.floor(cards[3] / 10));
        cardsValue.push( Math.floor(cards[4] / 10));

        //同花色
        if(this.isSameCardFlower(cards))
        {
            
            var isHJTHS = (cardsValue[0] == 10 && cardsValue[1]==11&& cardsValue[2]==12&& cardsValue[3]==13&& cardsValue[4]==14);
            //皇家同花顺
            if(isHJTHS){
                cardType = 10;
            }else
            {
                //同花顺
                if(this.isShunZi(cardsValue)){
                    cardType = 9;
                }else
                {
                    //同花
                    cardType = 6;
                }

            }
        }else//非同花
        {
            //顺子
            if(this.isShunZi(cardsValue))
            {
                cardType = 5;
            }else
            {
                var sameCardsArray = this.getSameCard(cardsValue);
                switch (sameCardsArray.length) {
                    case 2:
                        if(sameCardsArray[0].count==4||sameCardsArray[1].count==4)
                        {
                            cardType = 8;//四条
                        }else
                        {
                            cardType = 7;//葫芦
                        }
                        break;
                    case 3:
                        if(sameCardsArray[0].count==3||sameCardsArray[1].count==3||sameCardsArray[2].count==3)
                        {
                            cardType = 4; //三条
                        }else
                        {
                            cardType = 3; //两对
                        }
                        break;
                    case 4://一对
                        cardType = 2;
                        break;
                    case 5://单牌
                        cardType = 1;
                        break;
                }
                
            }

        }
        
        return cardType;
    },

    //判断牌大小是否一样
    isSameCardValue(cards)
    {
        if(cards.length<2)
        {
            cc.log('error input');
            return false;
        }
        var value = -1;
        for(var i=0;i<cards.length;i++)
        {
            if(i==0)
                value = Math.floor(cards[i] / 10);
            else
            {
                if(Math.floor(cards[i] / 10)!=value)
                    return false;
            }
        }
        return true;
    },

    //将牌大小分类，返回数组，cards从小到大
    getSameCard(cards)
    {
        var arr = [];
        for (var i = 0; i < cards.length;) {//按照属性判断属性合并列数
            var count = 0;
            for (var j = i; j < cards.length; j++) {
                 if(cards[i]== cards[j]){
                        count++;
                 }
            }
             arr.push({
                   cardValue:cards[i],
                   count: count
             })
             i+=count;
         }
         return arr;
    },

    //判断牌花色是否一样
    isSameCardFlower(cards)
    {
        if(cards.length<2)
        {
            cc.log('error input');
            return false;
        }
        var flower = -1;
        for(var i=0;i<cards.length;i++)
        {
            if(i==0)
                flower = cards[i] % 10;
            else
            {
                if((cards[i] % 10)!=flower)
                    return false;
            }
        }
        return true;
    },

    //5张牌是否是顺子，cards从小到大
    isShunZi(cards)
    {
        if(cards.length!=5)
        {
            cc.log('error input');
            return false;
        }
        
        //12345 
        if( cards[0] == 2)
        {
            //12345
            if(cards[1] == 3 && cards[2] == 4 && cards[3] == 5 && cards[4] == 14)
            {
                return true;
            }else if((cards[1]-cards[0])==1 && (cards[2]-cards[1])==1 && (cards[3]-cards[2])==1 && (cards[4]-cards[3])==1)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        else
        {
            if((cards[1]-cards[0])==1 && (cards[2]-cards[1])==1 && (cards[3]-cards[2])==1 && (cards[4]-cards[3])==1)
            {
                return true;
            }else
            {
                return false;
            }
        }
    },

    //比较两副牌大小
    //cards1大返回true,否则返回false
    compareCards(cardsType1,cardsType2,cards1,cards2)
    {
        //牌型不一样
        if(cardsType1!=cardsType2)
        {
            return cardsType1>cardsType2;
        }
        if(cards1.length!=5 || cards2.length!=5)
        {
            cc.log("card data error!!!");
            return false;
        }

        //牌型一样
        cards1.sort(function (a, b) { return a - b });
        cards2.sort(function (a, b) { return a - b });

        var cardV1 = [];
        var cardV2 = [];
        for(var i=0;i<cards1.length;i++)
        {
            cardV1.push( Math.floor(cards1[i] / 10));
            cardV2.push( Math.floor(cards2[i] / 10));
        }

        if(cardV1.toString() == cardV2.toString())
        {
            return false;
        }
        switch (cardsType1){
            case 1://高牌
                for(var i=4;i>=0;i--)
                {
                    if(cardV1[i]!=cardV2[i])
                        return cardV1[i]>cardV2[i]
                }
                cc.log("error!");
                break;
            case 2://一对
                var p1,p2;
                for(var i=0;i<5;i++)
                {
                    if(cardV1[i] == cardV1[i+1])
                    {
                        p1 = cardV1[i];
                        cardV1.splice(i,2);
                        break;
                    }
                }

                for(var i=0;i<5;i++)
                {
                    if(cardV2[i] == cardV2[i+1])
                    {
                        p2 = cardV2[i];
                        cardV2.splice(i,2);
                        break;
                    }
                }
                if(p1!=p2)
                {
                    return p1>p2;
                }else
                {
                    for(var i=2;i>=0;i--)
                    {
                        if(cardV1[i]!=cardV2[i])
                            return cardV1[i]>cardV2[i]
                    }
                }
                cc.log("error!");
                break;
            case 3://两对
                

                var sa1 = this.getSameCard(cardV1);
                var sa2 = this.getSameCard(cardV2);
                var sp1 = [];
                var sp2 = [];
                var m=0;
                var n=0;
                for(var i=2;i>=0;i--)
                {
                    if(sa1[i].count == 2)
                    {
                        sp1[m++] = sa1[i].cardValue;
                    }else
                    {
                        sp1[2] = sa1[i].cardValue;
                    }

                    if(sa2[i].count == 2)
                    {
                        sp2[n++] = sa2[i].cardValue;
                    }else
                    {
                        sp2[2] = sa2[i].cardValue;
                    }
                }

                if(sp1[0]!=sp2[0])
                {
                    return sp1[0]>sp2[0];
                }else if(sp1[1]!=sp2[1])
                {
                    return sp1[1]>sp2[1];
                }else
                {
                    return sp1[2]>sp2[2];
                }
                break;
            case 4://三条
                

                var sa1 = this.getSameCard(cardV1);
                var sa2 = this.getSameCard(cardV2);
                var sp1 = [];
                var sp2 = [];
                for(var i=2;i>=0;i--)
                {
                    if(sa1[i].count == 3)
                    {
                        sp1[0] = sa1[i].cardValue;
                    }else
                    {
                        sp1[i==2?1:2] = sa1[i].cardValue;
                    }

                    if(sa2[i].count == 3)
                    {
                        sp2[0] = sa2[i].cardValue;
                    }else
                    {
                        sp2[i==2?1:2] = sa2[i].cardValue;
                    }
                }

                if(sp1[0]!=sp2[0])
                {
                    return sp1[0]>sp2[0];
                }else if(sp1[1]!=sp2[1])
                {
                    return sp1[1]>sp2[1];
                }else
                {
                    return sp1[2]>sp2[2];
                }
                break;
            case 5://顺子
            case 9://同花顺
                if(cardV1[4] == 14 && cardV1[0]==2) // 12345最小
                    return false;
                else
                    return cardV1[0]>cardV2[0]
                break;
            case 6://同花
                for(var i=4;i>=0;i--)
                {
                    if(cardV1[i]!=cardV2[i])
                        return cardV1[i]>cardV2[i]
                }
                cc.log("error!");
                break;
            case 7://葫芦
                var sa1 = this.getSameCard(cardV1);
                var sa2 = this.getSameCard(cardV2);
                var sp1 = [];
                var sp2 = [];

                for(var i=1;i>=0;i--)
                {
                    if(sa1[i].count == 3)
                    {
                        sp1[0] = sa1[i].cardValue;
                    }else
                    {
                        sp1[1] = sa1[i].cardValue;
                    }

                    if(sa2[i].count == 3)
                    {
                        sp2[0] = sa2[i].cardValue;
                    }else
                    {
                        sp2[1] = sa2[i].cardValue;
                    }
                }

                if(sp1[0]!=sp2[0])
                {
                    return sp1[0]>sp2[0];
                }else
                {
                    return sp1[1]>sp2[1];
                }
                break;
            case 8://四条
                
                var sa1 = this.getSameCard(cardV1);
                var sa2 = this.getSameCard(cardV2);
                var sp1 = [];
                var sp2 = [];

                for(var i=1;i>=0;i--)
                {
                    if(sa1[i].count == 4)
                    {
                        sp1[0] = sa1[i].cardValue;
                    }else
                    {
                        sp1[1] = sa1[i].cardValue;
                    }

                    if(sa2[i].count == 4)
                    {
                        sp2[0] = sa2[i].cardValue;
                    }else
                    {
                        sp2[1] = sa2[i].cardValue;
                    }
                }

                if(sp1[0]!=sp2[0])
                {
                    return sp1[0]>sp2[0];
                }else
                {
                    return sp1[1]>sp2[1];
                }
                break;
            case 10:
                return false;

        }

    },

    //计算myCards的胜率
    //将myCards从POKER_LIST剔除，再取从剩余的牌取5张跟手牌比较，计算胜率；
    calWinRate(myCards,commonCards)
    {
        var cards = null;
        if(commonCards == null || commonCards.length<=0)
        {
            return - 1;//两张手牌用服务器发的值
        }else
        {
            if(commonCards.length==3)
            {
                cards = myCards.concat(commonCards)
                var myCardType = this.getSingleCardType(cards);
                function filterCards(card) {
                    for(var i=0;i<cards.length;i++)
                    {
                        if(cards[i] == card)
                            return false;
                    }
                    return true;
                }
                var poker_rest = POKER_LIST.filter(filterCards);
                var arry = this.combination(poker_rest,2)
                var win = 0;
                for(var i=0;i<arry.length;i++)
                {
                    var onePokerList =arry[i].concat(commonCards)
                    var otherCardType = this.getSingleCardType(onePokerList);
                    if(this.compareCards(myCardType,otherCardType,cards,onePokerList)){
                        win++;
                        // cc.log('我的牌：'+cards.toString()+'大于剩余牌:'+arry[i].toString());
                    }
                }
                return (win/arry.length).toFixed(4); 
            }else if(commonCards.length>=4)//4,5张牌
            {
                var r = this.getCardType(myCards,commonCards)
                var myCardType =r[0];
                cards =r[1];

                var allcards = myCards.concat(commonCards)
                function filterCards(card) {
                    for(var i=0;i<allcards.length;i++)
                    {
                        if(allcards[i] == card)
                            return false;
                    }
                    return true;
                }
                var poker_rest = POKER_LIST.filter(filterCards);
                // var othercards = commonCards.concat(poker_rest)
                var arry = this.combination(poker_rest,2)
                var win = 0;
                for(var i=0;i<arry.length;i++)
                {
                    var ot = this.getCardType(arry[i],commonCards)
                    if(this.compareCards(myCardType,ot[0],cards,ot[1])){
                        win++;
                        // cc.log('我的牌：'+cards.toString()+'大于剩余牌:'+arry[i].toString());
                    }else
                    {
                        cc.log('not win');
                    }
                }
                if(win == 0)
                {
                    cc.log('error');
                }
                return (win/arry.length).toFixed(4); 
            }
        }
    },
});
module.exports = {
    texas_Data: texas_Data,
    TEXAS_ED: TEXAS_ED,
    Texas_Event: Texas_Event,
};