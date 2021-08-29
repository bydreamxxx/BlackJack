let msg_bullfight_state_change_2c = cc.Class({
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

module.exports.msg_bullfight_state_change_2c = msg_bullfight_state_change_2c;

let msg_bullfight_ready_2s = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_bullfight_ready_2s = msg_bullfight_ready_2s;

let msg_bullfight_ready_2c = cc.Class({
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

module.exports.msg_bullfight_ready_2c = msg_bullfight_ready_2c;

let msg_bullfight_rob_bull_2s = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.bet = this.bet;

        return content;
    },
    setBet(bet){
        this.bet = bet;
    },

});

module.exports.msg_bullfight_rob_bull_2s = msg_bullfight_rob_bull_2s;

let msg_bullfight_rob_bull_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.userId = this.userId;
        content.bet = this.bet;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setBet(bet){
        this.bet = bet;
    },

});

module.exports.msg_bullfight_rob_bull_2c = msg_bullfight_rob_bull_2c;

let msg_bullfight_banker_2c = cc.Class({
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

module.exports.msg_bullfight_banker_2c = msg_bullfight_banker_2c;

let msg_bullfight_bet_2s = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.bet = this.bet;

        return content;
    },
    setBet(bet){
        this.bet = bet;
    },

});

module.exports.msg_bullfight_bet_2s = msg_bullfight_bet_2s;

let msg_bullfight_bet_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.userId = this.userId;
        content.bet = this.bet;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setBet(bet){
        this.bet = bet;
    },

});

module.exports.msg_bullfight_bet_2c = msg_bullfight_bet_2c;

let nested_bullfight_card_info = cc.Class({
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

module.exports.nested_bullfight_card_info = nested_bullfight_card_info;

let nested_bullfight_card_info_type = cc.Class({
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

module.exports.nested_bullfight_card_info_type = nested_bullfight_card_info_type;

let msg_bullfight_deal_card_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.round = this.round;
        content.cardInfoListList = this.cardInfoListList;

        return content;
    },
    setRound(round){
        this.round = round;
    },
    setCardInfoListList(cardInfoListList){
        this.cardInfoListList = cardInfoListList;
    },

});

module.exports.msg_bullfight_deal_card_2c = msg_bullfight_deal_card_2c;

let msg_bullfight_show_card_2c = cc.Class({
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

module.exports.msg_bullfight_show_card_2c = msg_bullfight_show_card_2c;

let nested_bullfight_result = cc.Class({
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

module.exports.nested_bullfight_result = nested_bullfight_result;

let msg_bullfight_result_2c = cc.Class({
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

module.exports.msg_bullfight_result_2c = msg_bullfight_result_2c;

let msg_bullfight_result_all_2c = cc.Class({
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

module.exports.msg_bullfight_result_all_2c = msg_bullfight_result_all_2c;

let user_cur_state = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.isbanker = this.isbanker;
        content.isopt = this.isopt;
        content.betone = this.betone;
        content.bettwo = this.bettwo;
        content.carInfo = this.carInfo;
        content.state = this.state;
        content.coin = this.coin;
        content.isAuto = this.isAuto;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setIsbanker(isbanker){
        this.isbanker = isbanker;
    },
    setIsopt(isopt){
        this.isopt = isopt;
    },
    setBetone(betone){
        this.betone = betone;
    },
    setBettwo(bettwo){
        this.bettwo = bettwo;
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
    setIsAuto(isAuto){
        this.isAuto = isAuto;
    },

});

module.exports.user_cur_state = user_cur_state;

let msg_resume_state_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.roomState = this.roomState;
        content.leftTime = this.leftTime;
        content.curRound = this.curRound;
        content.configId = this.configId;
        content.autoBank = this.autoBank;
        content.autoBet = this.autoBet;
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
    setAutoBank(autoBank){
        this.autoBank = autoBank;
    },
    setAutoBet(autoBet){
        this.autoBet = autoBet;
    },
    setUserStateList(userStateList){
        this.userStateList = userStateList;
    },
    setAgreesList(agreesList){
        this.agreesList = agreesList;
    },

});

module.exports.msg_resume_state_2c = msg_resume_state_2c;

let msg_bullfight_dissolve_agree_req = cc.Class({
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

module.exports.msg_bullfight_dissolve_agree_req = msg_bullfight_dissolve_agree_req;

let msg_bullfight_dissolve_agree_ack = cc.Class({
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

module.exports.msg_bullfight_dissolve_agree_ack = msg_bullfight_dissolve_agree_ack;

let msg_bullfight_dissolve_agree_result = cc.Class({
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

module.exports.msg_bullfight_dissolve_agree_result = msg_bullfight_dissolve_agree_result;

let msg_auto_bank_bet_2s = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.autoBank = this.autoBank;
        content.autoBet = this.autoBet;

        return content;
    },
    setAutoBank(autoBank){
        this.autoBank = autoBank;
    },
    setAutoBet(autoBet){
        this.autoBet = autoBet;
    },

});

module.exports.msg_auto_bank_bet_2s = msg_auto_bank_bet_2s;

let msg_auto_bank_bet_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.autoBank = this.autoBank;
        content.autoBet = this.autoBet;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setAutoBank(autoBank){
        this.autoBank = autoBank;
    },
    setAutoBet(autoBet){
        this.autoBet = autoBet;
    },

});

module.exports.msg_auto_bank_bet_2c = msg_auto_bank_bet_2c;

let bullfight_player_auto_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.isAuto = this.isAuto;

        return content;
    },
    setIsAuto(isAuto){
        this.isAuto = isAuto;
    },

});

module.exports.bullfight_player_auto_req = bullfight_player_auto_req;

let bullfight_player_auto_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.isAuto = this.isAuto;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setIsAuto(isAuto){
        this.isAuto = isAuto;
    },

});

module.exports.bullfight_player_auto_ack = bullfight_player_auto_ack;

