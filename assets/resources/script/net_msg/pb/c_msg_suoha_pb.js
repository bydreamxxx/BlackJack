let msg_suoha_state_change_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.roomState = this.roomState;
        content.maxBet = this.maxBet;
        content.curRound = this.curRound;

        return content;
    },
    setRoomState(roomState){
        this.roomState = roomState;
    },
    setMaxBet(maxBet){
        this.maxBet = maxBet;
    },
    setCurRound(curRound){
        this.curRound = curRound;
    },

});

module.exports.msg_suoha_state_change_2c = msg_suoha_state_change_2c;

let msg_suoha_ready_2s = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_suoha_ready_2s = msg_suoha_ready_2s;

let msg_suoha_ready_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.round = this.round;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setRound(round){
        this.round = round;
    },

});

module.exports.msg_suoha_ready_2c = msg_suoha_ready_2c;

let msg_suoha_cur_say_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },

});

module.exports.msg_suoha_cur_say_2c = msg_suoha_cur_say_2c;

let msg_suoha_bet_2s = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.op = this.op;
        content.bet = this.bet;

        return content;
    },
    setOp(op){
        this.op = op;
    },
    setBet(bet){
        this.bet = bet;
    },

});

module.exports.msg_suoha_bet_2s = msg_suoha_bet_2s;

let msg_suoha_bet_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.userId = this.userId;
        content.curBet = this.curBet;
        content.allBet = this.allBet;
        content.op = this.op;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setCurBet(curBet){
        this.curBet = curBet;
    },
    setAllBet(allBet){
        this.allBet = allBet;
    },
    setOp(op){
        this.op = op;
    },

});

module.exports.msg_suoha_bet_2c = msg_suoha_bet_2c;

let nested_suoha_card_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.cardsList = this.cardsList;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setCardsList(cardsList){
        this.cardsList = cardsList;
    },

});

module.exports.nested_suoha_card_info = nested_suoha_card_info;

let nested_suoha_card_info_type = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.type = this.type;
        content.cardsList = this.cardsList;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setType(type){
        this.type = type;
    },
    setCardsList(cardsList){
        this.cardsList = cardsList;
    },

});

module.exports.nested_suoha_card_info_type = nested_suoha_card_info_type;

let msg_suoha_deal_card_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.cardInfoListList = this.cardInfoListList;

        return content;
    },
    setCardInfoListList(cardInfoListList){
        this.cardInfoListList = cardInfoListList;
    },

});

module.exports.msg_suoha_deal_card_2c = msg_suoha_deal_card_2c;

let msg_suoha_show_card_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.cardInfoListList = this.cardInfoListList;

        return content;
    },
    setCardInfoListList(cardInfoListList){
        this.cardInfoListList = cardInfoListList;
    },

});

module.exports.msg_suoha_show_card_2c = msg_suoha_show_card_2c;

let nested_suoha_result = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.winGold = this.winGold;
        content.winTimes = this.winTimes;
        content.lostTimes = this.lostTimes;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setWinGold(winGold){
        this.winGold = winGold;
    },
    setWinTimes(winTimes){
        this.winTimes = winTimes;
    },
    setLostTimes(lostTimes){
        this.lostTimes = lostTimes;
    },

});

module.exports.nested_suoha_result = nested_suoha_result;

let msg_suoha_result_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.resultsList = this.resultsList;

        return content;
    },
    setResultsList(resultsList){
        this.resultsList = resultsList;
    },

});

module.exports.msg_suoha_result_2c = msg_suoha_result_2c;

let msg_suoha_result_all_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.roomNumber = this.roomNumber;
        content.gameTimes = this.gameTimes;
        content.roomMaster = this.roomMaster;
        content.startTime = this.startTime;
        content.resultsList = this.resultsList;

        return content;
    },
    setRoomNumber(roomNumber){
        this.roomNumber = roomNumber;
    },
    setGameTimes(gameTimes){
        this.gameTimes = gameTimes;
    },
    setRoomMaster(roomMaster){
        this.roomMaster = roomMaster;
    },
    setStartTime(startTime){
        this.startTime = startTime;
    },
    setResultsList(resultsList){
        this.resultsList = resultsList;
    },

});

module.exports.msg_suoha_result_all_2c = msg_suoha_result_all_2c;

let user_suoha_cur_state = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.bet = this.bet;
        content.curBet = this.curBet;
        content.carInfo = this.carInfo;
        content.state = this.state;
        content.coin = this.coin;
        content.isAllin = this.isAllin;
        content.isDiscard = this.isDiscard;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setBet(bet){
        this.bet = bet;
    },
    setCurBet(curBet){
        this.curBet = curBet;
    },
    setCarInfo(carInfo){
        this.carInfo = carInfo;
    },
    setState(state){
        this.state = state;
    },
    setCoin(coin){
        this.coin = coin;
    },
    setIsAllin(isAllin){
        this.isAllin = isAllin;
    },
    setIsDiscard(isDiscard){
        this.isDiscard = isDiscard;
    },

});

module.exports.user_suoha_cur_state = user_suoha_cur_state;

let msg_suoha_resume_state_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.roomState = this.roomState;
        content.leftTime = this.leftTime;
        content.curRound = this.curRound;
        content.configId = this.configId;
        content.curSay = this.curSay;
        content.maxBet = this.maxBet;
        content.userStateList = this.userStateList;
        content.agreesList = this.agreesList;

        return content;
    },
    setRoomState(roomState){
        this.roomState = roomState;
    },
    setLeftTime(leftTime){
        this.leftTime = leftTime;
    },
    setCurRound(curRound){
        this.curRound = curRound;
    },
    setConfigId(configId){
        this.configId = configId;
    },
    setCurSay(curSay){
        this.curSay = curSay;
    },
    setMaxBet(maxBet){
        this.maxBet = maxBet;
    },
    setUserStateList(userStateList){
        this.userStateList = userStateList;
    },
    setAgreesList(agreesList){
        this.agreesList = agreesList;
    },

});

module.exports.msg_suoha_resume_state_2c = msg_suoha_resume_state_2c;

let msg_suoha_dissolve_agree_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.isAgree = this.isAgree;

        return content;
    },
    setIsAgree(isAgree){
        this.isAgree = isAgree;
    },

});

module.exports.msg_suoha_dissolve_agree_req = msg_suoha_dissolve_agree_req;

let msg_suoha_dissolve_agree_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.isAgree = this.isAgree;
        content.time = this.time;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setIsAgree(isAgree){
        this.isAgree = isAgree;
    },
    setTime(time){
        this.time = time;
    },

});

module.exports.msg_suoha_dissolve_agree_ack = msg_suoha_dissolve_agree_ack;

let msg_suoha_dissolve_agree_result = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.isDissolve = this.isDissolve;

        return content;
    },
    setIsDissolve(isDissolve){
        this.isDissolve = isDissolve;
    },

});

module.exports.msg_suoha_dissolve_agree_result = msg_suoha_dissolve_agree_result;

let msg_suoha_look_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },

});

module.exports.msg_suoha_look_req = msg_suoha_look_req;

let msg_suoha_look_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },

});

module.exports.msg_suoha_look_ack = msg_suoha_look_ack;

