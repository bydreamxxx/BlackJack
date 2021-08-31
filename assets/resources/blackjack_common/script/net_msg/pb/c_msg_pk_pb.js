let msg_pk_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.pkState = this.pkState;
        content.pokerList = this.pokerList;
        content.way = this.way;
        content.allBet = this.allBet;
        content.selfInfo = this.selfInfo;
        content.isReconnect = this.isReconnect;
        content.ranksList = this.ranksList;
        content.nextTime = this.nextTime;
        content.betId = this.betId;
        content.openUserId = this.openUserId;
        content.openName = this.openName;
        content.startTime = this.startTime;
        content.reelType = this.reelType;

        return content;
    },
    setPkState(pkState){
        this.pkState = pkState;
    },
    setPokerList(pokerList){
        this.pokerList = pokerList;
    },
    setWay(way){
        this.way = way;
    },
    setAllBet(allBet){
        this.allBet = allBet;
    },
    setSelfInfo(selfInfo){
        this.selfInfo = selfInfo;
    },
    setIsReconnect(isReconnect){
        this.isReconnect = isReconnect;
    },
    setRanksList(ranksList){
        this.ranksList = ranksList;
    },
    setNextTime(nextTime){
        this.nextTime = nextTime;
    },
    setBetId(betId){
        this.betId = betId;
    },
    setOpenUserId(openUserId){
        this.openUserId = openUserId;
    },
    setOpenName(openName){
        this.openName = openName;
    },
    setStartTime(startTime){
        this.startTime = startTime;
    },
    setReelType(reelType){
        this.reelType = reelType;
    },

});

module.exports.msg_pk_info = msg_pk_info;

let pk_waybill = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.juNumList = this.juNumList;
        content.iconsList = this.iconsList;

        return content;
    },
    setJuNumList(juNumList){
        this.juNumList = juNumList;
    },
    setIconsList(iconsList){
        this.iconsList = iconsList;
    },

});

module.exports.pk_waybill = pk_waybill;

let pk_all_bet = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.allBet = this.allBet;
        content.betInfosList = this.betInfosList;

        return content;
    },
    setAllBet(allBet){
        this.allBet = allBet;
    },
    setBetInfosList(betInfosList){
        this.betInfosList = betInfosList;
    },

});

module.exports.pk_all_bet = pk_all_bet;

let pk_self_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.win = this.win;
        content.betInfosList = this.betInfosList;
        content.coin = this.coin;

        return content;
    },
    setWin(win){
        this.win = win;
    },
    setBetInfosList(betInfosList){
        this.betInfosList = betInfosList;
    },
    setCoin(coin){
        this.coin = coin;
    },

});

module.exports.pk_self_info = pk_self_info;

let msg_pk_bet_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.opType = this.opType;
        content.bet = this.bet;
        content.color = this.color;

        return content;
    },
    setOpType(opType){
        this.opType = opType;
    },
    setBet(bet){
        this.bet = bet;
    },
    setColor(color){
        this.color = color;
    },

});

module.exports.msg_pk_bet_req = msg_pk_bet_req;

let msg_pk_bet_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.opType = this.opType;
        content.allBet = this.allBet;
        content.betInfosList = this.betInfosList;
        content.value = this.value;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setOpType(opType){
        this.opType = opType;
    },
    setAllBet(allBet){
        this.allBet = allBet;
    },
    setBetInfosList(betInfosList){
        this.betInfosList = betInfosList;
    },
    setValue(value){
        this.value = value;
    },

});

module.exports.msg_pk_bet_ret = msg_pk_bet_ret;

let msg_pk_result = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.pokersList = this.pokersList;
        content.reelType = this.reelType;
        content.openUserType = this.openUserType;
        content.openUserId = this.openUserId;
        content.name = this.name;
        content.ranksList = this.ranksList;
        content.self = this.self;
        content.way = this.way;
        content.nextTime = this.nextTime;
        content.isReset = this.isReset;
        content.startTime = this.startTime;
        content.betInfosList = this.betInfosList;

        return content;
    },
    setPokersList(pokersList){
        this.pokersList = pokersList;
    },
    setReelType(reelType){
        this.reelType = reelType;
    },
    setOpenUserType(openUserType){
        this.openUserType = openUserType;
    },
    setOpenUserId(openUserId){
        this.openUserId = openUserId;
    },
    setName(name){
        this.name = name;
    },
    setRanksList(ranksList){
        this.ranksList = ranksList;
    },
    setSelf(self){
        this.self = self;
    },
    setWay(way){
        this.way = way;
    },
    setNextTime(nextTime){
        this.nextTime = nextTime;
    },
    setIsReset(isReset){
        this.isReset = isReset;
    },
    setStartTime(startTime){
        this.startTime = startTime;
    },
    setBetInfosList(betInfosList){
        this.betInfosList = betInfosList;
    },

});

module.exports.msg_pk_result = msg_pk_result;

let pk_rank_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.rank = this.rank;
        content.name = this.name;
        content.openId = this.openId;
        content.headUrl = this.headUrl;
        content.coin = this.coin;

        return content;
    },
    setRank(rank){
        this.rank = rank;
    },
    setName(name){
        this.name = name;
    },
    setOpenId(openId){
        this.openId = openId;
    },
    setHeadUrl(headUrl){
        this.headUrl = headUrl;
    },
    setCoin(coin){
        this.coin = coin;
    },

});

module.exports.pk_rank_info = pk_rank_info;

let msg_pk_state = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.state = this.state;
        content.time = this.time;
        content.startTime = this.startTime;

        return content;
    },
    setState(state){
        this.state = state;
    },
    setTime(time){
        this.time = time;
    },
    setStartTime(startTime){
        this.startTime = startTime;
    },

});

module.exports.msg_pk_state = msg_pk_state;

let msg_pk_open_cards_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_pk_open_cards_req = msg_pk_open_cards_req;

let msg_pk_open_cards_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_pk_open_cards_ret = msg_pk_open_cards_ret;

