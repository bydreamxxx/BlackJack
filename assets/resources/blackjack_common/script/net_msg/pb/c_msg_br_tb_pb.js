let msg_br_tb_state_notify = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.roomState = this.roomState;

        return content;
    },
    setRoomState(roomState){
        this.roomState = roomState;
    },

});

module.exports.msg_br_tb_state_notify = msg_br_tb_state_notify;

let msg_br_tb_battle_record = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.listList = this.listList;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setListList(listList){
        this.listList = listList;
    },

});

module.exports.msg_br_tb_battle_record = msg_br_tb_battle_record;

let msg_br_tb_pokers = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.isWinBanker = this.isWinBanker;
        content.pokerValue = this.pokerValue;
        content.pokersList = this.pokersList;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setIsWinBanker(isWinBanker){
        this.isWinBanker = isWinBanker;
    },
    setPokerValue(pokerValue){
        this.pokerValue = pokerValue;
    },
    setPokersList(pokersList){
        this.pokersList = pokersList;
    },

});

module.exports.msg_br_tb_pokers = msg_br_tb_pokers;

let msg_br_tb_bet_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.sum = this.sum;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setSum(sum){
        this.sum = sum;
    },

});

module.exports.msg_br_tb_bet_info = msg_br_tb_bet_info;

let msg_br_tb_player_enter_notify = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.roomState = this.roomState;
        content.leftTime = this.leftTime;
        content.reqBankerList = this.reqBankerList;
        content.bankerTimes = this.bankerTimes;
        content.isJoin = this.isJoin;
        content.otherBetList = this.otherBetList;
        content.myBetList = this.myBetList;
        content.pokersList = this.pokersList;
        content.battleRecodeList = this.battleRecodeList;
        content.bankersList = this.bankersList;
        content.siteListList = this.siteListList;
        content.curRound = this.curRound;
        content.gold = this.gold;
        content.timestamp = this.timestamp;

        return content;
    },
    setRoomState(roomState){
        this.roomState = roomState;
    },
    setLeftTime(leftTime){
        this.leftTime = leftTime;
    },
    setReqBankerList(reqBankerList){
        this.reqBankerList = reqBankerList;
    },
    setBankerTimes(bankerTimes){
        this.bankerTimes = bankerTimes;
    },
    setIsJoin(isJoin){
        this.isJoin = isJoin;
    },
    setOtherBetList(otherBetList){
        this.otherBetList = otherBetList;
    },
    setMyBetList(myBetList){
        this.myBetList = myBetList;
    },
    setPokersList(pokersList){
        this.pokersList = pokersList;
    },
    setBattleRecodeList(battleRecodeList){
        this.battleRecodeList = battleRecodeList;
    },
    setBankersList(bankersList){
        this.bankersList = bankersList;
    },
    setSiteListList(siteListList){
        this.siteListList = siteListList;
    },
    setCurRound(curRound){
        this.curRound = curRound;
    },
    setGold(gold){
        this.gold = gold;
    },
    setTimestamp(timestamp){
        this.timestamp = timestamp;
    },

});

module.exports.msg_br_tb_player_enter_notify = msg_br_tb_player_enter_notify;

let msg_br_tb_bet_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.bet = this.bet;
        content.betId = this.betId;

        return content;
    },
    setBet(bet){
        this.bet = bet;
    },
    setBetId(betId){
        this.betId = betId;
    },

});

module.exports.msg_br_tb_bet_req = msg_br_tb_bet_req;

let msg_br_tb_bet_resp = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.result = this.result;
        content.betId = this.betId;
        content.betAdd = this.betAdd;
        content.betSum = this.betSum;
        content.gold = this.gold;

        return content;
    },
    setResult(result){
        this.result = result;
    },
    setBetId(betId){
        this.betId = betId;
    },
    setBetAdd(betAdd){
        this.betAdd = betAdd;
    },
    setBetSum(betSum){
        this.betSum = betSum;
    },
    setGold(gold){
        this.gold = gold;
    },

});

module.exports.msg_br_tb_bet_resp = msg_br_tb_bet_resp;

let msg_br_tb_seat_bet_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.betId = this.betId;
        content.betSum = this.betSum;

        return content;
    },
    setBetId(betId){
        this.betId = betId;
    },
    setBetSum(betSum){
        this.betSum = betSum;
    },

});

module.exports.msg_br_tb_seat_bet_info = msg_br_tb_seat_bet_info;

let msg_br_tb_bet_info_notify = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.betInfoList = this.betInfoList;

        return content;
    },
    setBetInfoList(betInfoList){
        this.betInfoList = betInfoList;
    },

});

module.exports.msg_br_tb_bet_info_notify = msg_br_tb_bet_info_notify;

let msg_br_tb_banker_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.type = this.type;
        content.gold = this.gold;

        return content;
    },
    setType(type){
        this.type = type;
    },
    setGold(gold){
        this.gold = gold;
    },

});

module.exports.msg_br_tb_banker_req = msg_br_tb_banker_req;

let msg_br_tb_banker_resp = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.result = this.result;
        content.type = this.type;

        return content;
    },
    setResult(result){
        this.result = result;
    },
    setType(type){
        this.type = type;
    },

});

module.exports.msg_br_tb_banker_resp = msg_br_tb_banker_resp;

let msg_br_tb_banker_req_notify = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.gold = this.gold;
        content.type = this.type;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setGold(gold){
        this.gold = gold;
    },
    setType(type){
        this.type = type;
    },

});

module.exports.msg_br_tb_banker_req_notify = msg_br_tb_banker_req_notify;

let br_tb_banker_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.gold = this.gold;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setGold(gold){
        this.gold = gold;
    },

});

module.exports.br_tb_banker_info = br_tb_banker_info;

let msg_br_tb_banker_list_notify = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.bankersList = this.bankersList;

        return content;
    },
    setBankersList(bankersList){
        this.bankersList = bankersList;
    },

});

module.exports.msg_br_tb_banker_list_notify = msg_br_tb_banker_list_notify;

let msg_br_tb_req_banker_list_notify = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.bankersList = this.bankersList;

        return content;
    },
    setBankersList(bankersList){
        this.bankersList = bankersList;
    },

});

module.exports.msg_br_tb_req_banker_list_notify = msg_br_tb_req_banker_list_notify;

let msg_br_tb_win = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.sum = this.sum;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setSum(sum){
        this.sum = sum;
    },

});

module.exports.msg_br_tb_win = msg_br_tb_win;

let msg_br_tb_battle_record_notify = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.infoList = this.infoList;

        return content;
    },
    setInfoList(infoList){
        this.infoList = infoList;
    },

});

module.exports.msg_br_tb_battle_record_notify = msg_br_tb_battle_record_notify;

let msg_br_tb_result = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.sum = this.sum;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setSum(sum){
        this.sum = sum;
    },

});

module.exports.msg_br_tb_result = msg_br_tb_result;

let msg_br_tb_results_notify = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.meList = this.meList;
        content.winList = this.winList;
        content.pokersList = this.pokersList;
        content.meWin = this.meWin;
        content.diceList = this.diceList;

        return content;
    },
    setMeList(meList){
        this.meList = meList;
    },
    setWinList(winList){
        this.winList = winList;
    },
    setPokersList(pokersList){
        this.pokersList = pokersList;
    },
    setMeWin(meWin){
        this.meWin = meWin;
    },
    setDiceList(diceList){
        this.diceList = diceList;
    },

});

module.exports.msg_br_tb_results_notify = msg_br_tb_results_notify;

let msg_get_site_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.siteId = this.siteId;

        return content;
    },
    setSiteId(siteId){
        this.siteId = siteId;
    },

});

module.exports.msg_get_site_req = msg_get_site_req;

let msg_get_site_resp = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.result = this.result;
        content.siteId = this.siteId;

        return content;
    },
    setResult(result){
        this.result = result;
    },
    setSiteId(siteId){
        this.siteId = siteId;
    },

});

module.exports.msg_get_site_resp = msg_get_site_resp;

let msg_get_site_notify = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.siteId = this.siteId;
        content.userId = this.userId;

        return content;
    },
    setSiteId(siteId){
        this.siteId = siteId;
    },
    setUserId(userId){
        this.userId = userId;
    },

});

module.exports.msg_get_site_notify = msg_get_site_notify;

let msg_player_gold_notify = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gold = this.gold;
        content.userId = this.userId;

        return content;
    },
    setGold(gold){
        this.gold = gold;
    },
    setUserId(userId){
        this.userId = userId;
    },

});

module.exports.msg_player_gold_notify = msg_player_gold_notify;

let msg_self_gold_notify = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gold = this.gold;

        return content;
    },
    setGold(gold){
        this.gold = gold;
    },

});

module.exports.msg_self_gold_notify = msg_self_gold_notify;

let msg_banker_gold_pool_notify = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gold = this.gold;

        return content;
    },
    setGold(gold){
        this.gold = gold;
    },

});

module.exports.msg_banker_gold_pool_notify = msg_banker_gold_pool_notify;

let msg_player_gold_pool_notify = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gold = this.gold;

        return content;
    },
    setGold(gold){
        this.gold = gold;
    },

});

module.exports.msg_player_gold_pool_notify = msg_player_gold_pool_notify;

let br_tb_rank_base = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.gold = this.gold;
        content.head = this.head;
        content.name = this.name;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setGold(gold){
        this.gold = gold;
    },
    setHead(head){
        this.head = head;
    },
    setName(name){
        this.name = name;
    },

});

module.exports.br_tb_rank_base = br_tb_rank_base;

let msg_br_tb_rank_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.type = this.type;

        return content;
    },
    setType(type){
        this.type = type;
    },

});

module.exports.msg_br_tb_rank_req = msg_br_tb_rank_req;

let msg_br_tb_rank_resp = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.result = this.result;
        content.type = this.type;
        content.rankList = this.rankList;
        content.time = this.time;
        content.sum = this.sum;

        return content;
    },
    setResult(result){
        this.result = result;
    },
    setType(type){
        this.type = type;
    },
    setRankList(rankList){
        this.rankList = rankList;
    },
    setTime(time){
        this.time = time;
    },
    setSum(sum){
        this.sum = sum;
    },

});

module.exports.msg_br_tb_rank_resp = msg_br_tb_rank_resp;

let msg_lottery_gold_notify = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gold = this.gold;
        content.userId = this.userId;

        return content;
    },
    setGold(gold){
        this.gold = gold;
    },
    setUserId(userId){
        this.userId = userId;
    },

});

module.exports.msg_lottery_gold_notify = msg_lottery_gold_notify;

let br_tb_continue_win = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.count = this.count;
        content.userId = this.userId;

        return content;
    },
    setCount(count){
        this.count = count;
    },
    setUserId(userId){
        this.userId = userId;
    },

});

module.exports.br_tb_continue_win = br_tb_continue_win;

let msg_br_tb_continue_win_notify = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.listList = this.listList;

        return content;
    },
    setListList(listList){
        this.listList = listList;
    },

});

module.exports.msg_br_tb_continue_win_notify = msg_br_tb_continue_win_notify;

let msg_br_tb_site_player_bet_notify = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gold = this.gold;
        content.userId = this.userId;
        content.siteId = this.siteId;
        content.seatId = this.seatId;

        return content;
    },
    setGold(gold){
        this.gold = gold;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setSiteId(siteId){
        this.siteId = siteId;
    },
    setSeatId(seatId){
        this.seatId = seatId;
    },

});

module.exports.msg_br_tb_site_player_bet_notify = msg_br_tb_site_player_bet_notify;

let msg_br_tb_site_player_win_notify = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gold = this.gold;
        content.userId = this.userId;
        content.resultList = this.resultList;
        content.siteId = this.siteId;

        return content;
    },
    setGold(gold){
        this.gold = gold;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setResultList(resultList){
        this.resultList = resultList;
    },
    setSiteId(siteId){
        this.siteId = siteId;
    },

});

module.exports.msg_br_tb_site_player_win_notify = msg_br_tb_site_player_win_notify;

