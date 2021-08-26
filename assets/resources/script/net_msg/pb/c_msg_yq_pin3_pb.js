let yq_pin3_user_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.userState = this.userState;
        content.curScore = this.curScore;
        content.isBanker = this.isBanker;
        content.betScore = this.betScore;
        content.pokers = this.pokers;
        content.pokersState = this.pokersState;
        content.cmpPokerList = this.cmpPokerList;
        content.isOnline = this.isOnline;
        content.seat = this.seat;
        content.curBetScore = this.curBetScore;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setUserState(userState){
        this.userState = userState;
    },
    setCurScore(curScore){
        this.curScore = curScore;
    },
    setIsBanker(isBanker){
        this.isBanker = isBanker;
    },
    setBetScore(betScore){
        this.betScore = betScore;
    },
    setPokers(pokers){
        this.pokers = pokers;
    },
    setPokersState(pokersState){
        this.pokersState = pokersState;
    },
    setCmpPokerList(cmpPokerList){
        this.cmpPokerList = cmpPokerList;
    },
    setIsOnline(isOnline){
        this.isOnline = isOnline;
    },
    setSeat(seat){
        this.seat = seat;
    },
    setCurBetScore(curBetScore){
        this.curBetScore = curBetScore;
    },

});

module.exports.yq_pin3_user_info = yq_pin3_user_info;

let yq_pin3_dissolve_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.isAgree = this.isAgree;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setIsAgree(isAgree){
        this.isAgree = isAgree;
    },

});

module.exports.yq_pin3_dissolve_info = yq_pin3_dissolve_info;

let msg_yq_pin3_state_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userInfo = this.userInfo;
        content.otherInfosList = this.otherInfosList;
        content.curBet = this.curBet;
        content.curCircle = this.curCircle;
        content.curOpUserId = this.curOpUserId;
        content.curOpTime = this.curOpTime;
        content.curBetLevel = this.curBetLevel;
        content.curGameState = this.curGameState;
        content.fireBet = this.fireBet;
        content.curRound = this.curRound;
        content.dissolvesList = this.dissolvesList;
        content.disvotetime = this.disvotetime;
        content.configId = this.configId;
        content.isReconnect = this.isReconnect;

        return content;
    },
    setUserInfo(userInfo){
        this.userInfo = userInfo;
    },
    setOtherInfosList(otherInfosList){
        this.otherInfosList = otherInfosList;
    },
    setCurBet(curBet){
        this.curBet = curBet;
    },
    setCurCircle(curCircle){
        this.curCircle = curCircle;
    },
    setCurOpUserId(curOpUserId){
        this.curOpUserId = curOpUserId;
    },
    setCurOpTime(curOpTime){
        this.curOpTime = curOpTime;
    },
    setCurBetLevel(curBetLevel){
        this.curBetLevel = curBetLevel;
    },
    setCurGameState(curGameState){
        this.curGameState = curGameState;
    },
    setFireBet(fireBet){
        this.fireBet = fireBet;
    },
    setCurRound(curRound){
        this.curRound = curRound;
    },
    setDissolvesList(dissolvesList){
        this.dissolvesList = dissolvesList;
    },
    setDisvotetime(disvotetime){
        this.disvotetime = disvotetime;
    },
    setConfigId(configId){
        this.configId = configId;
    },
    setIsReconnect(isReconnect){
        this.isReconnect = isReconnect;
    },

});

module.exports.msg_yq_pin3_state_info = msg_yq_pin3_state_info;

let yq_pin3_poker = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.pokersList = this.pokersList;
        content.type = this.type;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setPokersList(pokersList){
        this.pokersList = pokersList;
    },
    setType(type){
        this.type = type;
    },

});

module.exports.yq_pin3_poker = yq_pin3_poker;

let msg_yq_pin3_watch_req = cc.Class({
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

module.exports.msg_yq_pin3_watch_req = msg_yq_pin3_watch_req;

let msg_yq_pin3_watch_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.poker = this.poker;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setPoker(poker){
        this.poker = poker;
    },

});

module.exports.msg_yq_pin3_watch_ret = msg_yq_pin3_watch_ret;

let yq_pin3_cmp_poker = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.pokerList = this.pokerList;
        content.winUserid = this.winUserid;

        return content;
    },
    setPokerList(pokerList){
        this.pokerList = pokerList;
    },
    setWinUserid(winUserid){
        this.winUserid = winUserid;
    },

});

module.exports.yq_pin3_cmp_poker = yq_pin3_cmp_poker;

let msg_yq_pin3_cmp_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.cmpType = this.cmpType;
        content.userId = this.userId;
        content.cmpId = this.cmpId;

        return content;
    },
    setCmpType(cmpType){
        this.cmpType = cmpType;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setCmpId(cmpId){
        this.cmpId = cmpId;
    },

});

module.exports.msg_yq_pin3_cmp_req = msg_yq_pin3_cmp_req;

let msg_yq_pin3_cmp_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.cmpType = this.cmpType;
        content.userId = this.userId;
        content.cmpId = this.cmpId;
        content.winner = this.winner;
        content.nextOpUserId = this.nextOpUserId;
        content.bet = this.bet;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setCmpType(cmpType){
        this.cmpType = cmpType;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setCmpId(cmpId){
        this.cmpId = cmpId;
    },
    setWinner(winner){
        this.winner = winner;
    },
    setNextOpUserId(nextOpUserId){
        this.nextOpUserId = nextOpUserId;
    },
    setBet(bet){
        this.bet = bet;
    },

});

module.exports.msg_yq_pin3_cmp_ret = msg_yq_pin3_cmp_ret;

let msg_yq_pin3_op_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.opType = this.opType;
        content.userId = this.userId;
        content.value = this.value;

        return content;
    },
    setOpType(opType){
        this.opType = opType;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setValue(value){
        this.value = value;
    },

});

module.exports.msg_yq_pin3_op_req = msg_yq_pin3_op_req;

let msg_yq_pin3_op_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.opType = this.opType;
        content.userId = this.userId;
        content.bet = this.bet;
        content.betLevel = this.betLevel;
        content.nextOpUserId = this.nextOpUserId;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setOpType(opType){
        this.opType = opType;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setBet(bet){
        this.bet = bet;
    },
    setBetLevel(betLevel){
        this.betLevel = betLevel;
    },
    setNextOpUserId(nextOpUserId){
        this.nextOpUserId = nextOpUserId;
    },

});

module.exports.msg_yq_pin3_op_ret = msg_yq_pin3_op_ret;

let msg_yq_pin3_update = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.value = this.value;

        return content;
    },
    setValue(value){
        this.value = value;
    },

});

module.exports.msg_yq_pin3_update = msg_yq_pin3_update;

let yq_pin3_result = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.score = this.score;
        content.round = this.round;
        content.isWin = this.isWin;
        content.isBanker = this.isBanker;
        content.severPay = this.severPay;
        content.isLucky = this.isLucky;
        content.luckyScore = this.luckyScore;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setScore(score){
        this.score = score;
    },
    setRound(round){
        this.round = round;
    },
    setIsWin(isWin){
        this.isWin = isWin;
    },
    setIsBanker(isBanker){
        this.isBanker = isBanker;
    },
    setSeverPay(severPay){
        this.severPay = severPay;
    },
    setIsLucky(isLucky){
        this.isLucky = isLucky;
    },
    setLuckyScore(luckyScore){
        this.luckyScore = luckyScore;
    },

});

module.exports.yq_pin3_result = yq_pin3_result;

let msg_yq_pin3_result = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.pokersList = this.pokersList;
        content.scoreResultList = this.scoreResultList;
        content.time = this.time;

        return content;
    },
    setPokersList(pokersList){
        this.pokersList = pokersList;
    },
    setScoreResultList(scoreResultList){
        this.scoreResultList = scoreResultList;
    },
    setTime(time){
        this.time = time;
    },

});

module.exports.msg_yq_pin3_result = msg_yq_pin3_result;

let msg_yq_pin3_recharge_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_yq_pin3_recharge_req = msg_yq_pin3_recharge_req;

let msg_yq_pin3_recharge_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.nextOpTime = this.nextOpTime;
        content.opTime = this.opTime;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setNextOpTime(nextOpTime){
        this.nextOpTime = nextOpTime;
    },
    setOpTime(opTime){
        this.opTime = opTime;
    },

});

module.exports.msg_yq_pin3_recharge_ret = msg_yq_pin3_recharge_ret;

let msg_yq_pin3_cancel_auto_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameType = this.gameType;
        content.roomId = this.roomId;

        return content;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setRoomId(roomId){
        this.roomId = roomId;
    },

});

module.exports.msg_yq_pin3_cancel_auto_req = msg_yq_pin3_cancel_auto_req;

let msg_yq_pin3_cancel_auto_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },

});

module.exports.msg_yq_pin3_cancel_auto_ret = msg_yq_pin3_cancel_auto_ret;

let msg_yq_pin3_auto_status = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.status = this.status;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setStatus(status){
        this.status = status;
    },

});

module.exports.msg_yq_pin3_auto_status = msg_yq_pin3_auto_status;

