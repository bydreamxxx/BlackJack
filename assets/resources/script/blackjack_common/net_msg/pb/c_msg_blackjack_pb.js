let msg_bj_ready_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_bj_ready_req = msg_bj_ready_req;

let msg_bj_ready_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.result = this.result;

        return content;
    },
    setResult(result){
        this.result = result;
    },

});

module.exports.msg_bj_ready_ack = msg_bj_ready_ack;

let msg_bj_action_change = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.index = this.index;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setIndex(index){
        this.index = index;
    },

});

module.exports.msg_bj_action_change = msg_bj_action_change;

let msg_bj_state_change_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.roomState = this.roomState;
        content.curRound = this.curRound;

        return content;
    },
    setRoomState(roomState){
        this.roomState = roomState;
    },
    setCurRound(curRound){
        this.curRound = curRound;
    },

});

module.exports.msg_bj_state_change_2c = msg_bj_state_change_2c;

let msg_bj_dissolve_agree_req = cc.Class({
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

module.exports.msg_bj_dissolve_agree_req = msg_bj_dissolve_agree_req;

let msg_bj_dissolve_agree_ack = cc.Class({
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

module.exports.msg_bj_dissolve_agree_ack = msg_bj_dissolve_agree_ack;

let msg_bj_dissolve_agree_result = cc.Class({
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

module.exports.msg_bj_dissolve_agree_result = msg_bj_dissolve_agree_result;

let msg_bj_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.bjState = this.bjState;
        content.lastTime = this.lastTime;
        content.usersInfoList = this.usersInfoList;
        content.roomConfigId = this.roomConfigId;
        content.turn = this.turn;

        return content;
    },
    setBjState(bjState){
        this.bjState = bjState;
    },
    setLastTime(lastTime){
        this.lastTime = lastTime;
    },
    setUsersInfoList(usersInfoList){
        this.usersInfoList = usersInfoList;
    },
    setRoomConfigId(roomConfigId){
        this.roomConfigId = roomConfigId;
    },
    setTurn(turn){
        this.turn = turn;
    },

});

module.exports.msg_bj_info = msg_bj_info;

let bj_bet_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.index = this.index;
        content.cardsList = this.cardsList;
        content.value = this.value;
        content.insure = this.insure;
        content.type = this.type;

        return content;
    },
    setIndex(index){
        this.index = index;
    },
    setCardsList(cardsList){
        this.cardsList = cardsList;
    },
    setValue(value){
        this.value = value;
    },
    setInsure(insure){
        this.insure = insure;
    },
    setType(type){
        this.type = type;
    },

});

module.exports.bj_bet_info = bj_bet_info;

let bj_user_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.betInfosList = this.betInfosList;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setBetInfosList(betInfosList){
        this.betInfosList = betInfosList;
    },

});

module.exports.bj_user_info = bj_user_info;

let msg_bj_deal_poker = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.index = this.index;
        content.cardsList = this.cardsList;
        content.pointList = this.pointList;
        content.type = this.type;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setIndex(index){
        this.index = index;
    },
    setCardsList(cardsList){
        this.cardsList = cardsList;
    },
    setPointList(pointList){
        this.pointList = pointList;
    },
    setType(type){
        this.type = type;
    },

});

module.exports.msg_bj_deal_poker = msg_bj_deal_poker;

let msg_bj_bet_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.type = this.type;
        content.index = this.index;
        content.bet = this.bet;

        return content;
    },
    setType(type){
        this.type = type;
    },
    setIndex(index){
        this.index = index;
    },
    setBet(bet){
        this.bet = bet;
    },

});

module.exports.msg_bj_bet_req = msg_bj_bet_req;

let msg_bj_bet_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.userId = this.userId;
        content.type = this.type;
        content.betList = this.betList;
        content.showCoin = this.showCoin;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setType(type){
        this.type = type;
    },
    setBetList(betList){
        this.betList = betList;
    },
    setShowCoin(showCoin){
        this.showCoin = showCoin;
    },

});

module.exports.msg_bj_bet_ret = msg_bj_bet_ret;

let bj_result_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.index = this.index;
        content.coin = this.coin;
        content.insure = this.insure;
        content.allCoin = this.allCoin;
        content.type = this.type;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setIndex(index){
        this.index = index;
    },
    setCoin(coin){
        this.coin = coin;
    },
    setInsure(insure){
        this.insure = insure;
    },
    setAllCoin(allCoin){
        this.allCoin = allCoin;
    },
    setType(type){
        this.type = type;
    },
});

module.exports.bj_result_info = bj_result_info;

let msg_bj_result = cc.Class({
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

module.exports.msg_bj_result = msg_bj_result;

let msg_bj_result_all_2c = cc.Class({
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

module.exports.msg_bj_result_all_2c = msg_bj_result_all_2c;

