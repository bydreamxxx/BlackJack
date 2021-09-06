let horse_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.index = this.index;
        content.id = this.id;
        content.name = this.name;
        content.rankList = this.rankList;

        return content;
    },
    setIndex(index){
        this.index = index;
    },
    setId(id){
        this.id = id;
    },
    setName(name){
        this.name = name;
    },
    setRankList(rankList){
        this.rankList = rankList;
    },

});

module.exports.horse_info = horse_info;

let horse_bet_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.rate = this.rate;
        content.sfBet = this.sfBet;
        content.allBet = this.allBet;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setRate(rate){
        this.rate = rate;
    },
    setSfBet(sfBet){
        this.sfBet = sfBet;
    },
    setAllBet(allBet){
        this.allBet = allBet;
    },

});

module.exports.horse_bet_info = horse_bet_info;

let msg_horse_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.state = this.state;
        content.lastTime = this.lastTime;
        content.allBet = this.allBet;
        content.horseList = this.horseList;
        content.betInfoList = this.betInfoList;
        content.tongshiNum = this.tongshiNum;
        content.coin = this.coin;
        content.configId = this.configId;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setState(state){
        this.state = state;
    },
    setLastTime(lastTime){
        this.lastTime = lastTime;
    },
    setAllBet(allBet){
        this.allBet = allBet;
    },
    setHorseList(horseList){
        this.horseList = horseList;
    },
    setBetInfoList(betInfoList){
        this.betInfoList = betInfoList;
    },
    setTongshiNum(tongshiNum){
        this.tongshiNum = tongshiNum;
    },
    setCoin(coin){
        this.coin = coin;
    },
    setConfigId(configId){
        this.configId = configId;
    },

});

module.exports.msg_horse_info = msg_horse_info;

let msg_horse_begin = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.state = this.state;
        content.horseList = this.horseList;
        content.betInfoList = this.betInfoList;
        content.tongshiNum = this.tongshiNum;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setState(state){
        this.state = state;
    },
    setHorseList(horseList){
        this.horseList = horseList;
    },
    setBetInfoList(betInfoList){
        this.betInfoList = betInfoList;
    },
    setTongshiNum(tongshiNum){
        this.tongshiNum = tongshiNum;
    },

});

module.exports.msg_horse_begin = msg_horse_begin;

let msg_horse_update = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.betInfoList = this.betInfoList;
        content.allBet = this.allBet;

        return content;
    },
    setBetInfoList(betInfoList){
        this.betInfoList = betInfoList;
    },
    setAllBet(allBet){
        this.allBet = allBet;
    },

});

module.exports.msg_horse_update = msg_horse_update;

let msg_horse_bet_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.opType = this.opType;
        content.betInfo = this.betInfo;

        return content;
    },
    setOpType(opType){
        this.opType = opType;
    },
    setBetInfo(betInfo){
        this.betInfo = betInfo;
    },

});

module.exports.msg_horse_bet_req = msg_horse_bet_req;

let msg_horse_bet_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.opType = this.opType;
        content.betInfo = this.betInfo;
        content.coin = this.coin;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setOpType(opType){
        this.opType = opType;
    },
    setBetInfo(betInfo){
        this.betInfo = betInfo;
    },
    setCoin(coin){
        this.coin = coin;
    },

});

module.exports.msg_horse_bet_ret = msg_horse_bet_ret;

let msg_horse_open_tongshi_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_horse_open_tongshi_req = msg_horse_open_tongshi_req;

let horse_rd = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.rate1 = this.rate1;
        content.rate2 = this.rate2;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setRate1(rate1){
        this.rate1 = rate1;
    },
    setRate2(rate2){
        this.rate2 = rate2;
    },

});

module.exports.horse_rd = horse_rd;

let msg_horse_open_tongshi_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.rateList = this.rateList;
        content.rdList = this.rdList;
        content.tongshiList = this.tongshiList;

        return content;
    },
    setRateList(rateList){
        this.rateList = rateList;
    },
    setRdList(rdList){
        this.rdList = rdList;
    },
    setTongshiList(tongshiList){
        this.tongshiList = tongshiList;
    },

});

module.exports.msg_horse_open_tongshi_ret = msg_horse_open_tongshi_ret;

let horse_user_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.rank = this.rank;
        content.userId = this.userId;
        content.name = this.name;
        content.openId = this.openId;
        content.headUrl = this.headUrl;
        content.coin = this.coin;

        return content;
    },
    setRank(rank){
        this.rank = rank;
    },
    setUserId(userId){
        this.userId = userId;
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

module.exports.horse_user_info = horse_user_info;

let horse_rank = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.rankList = this.rankList;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setRankList(rankList){
        this.rankList = rankList;
    },

});

module.exports.horse_rank = horse_rank;

let msg_horse_result = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.type = this.type;
        content.winHorsesList = this.winHorsesList;
        content.hRankList = this.hRankList;
        content.rank5List = this.rank5List;
        content.win = this.win;
        content.coin = this.coin;

        return content;
    },
    setType(type){
        this.type = type;
    },
    setWinHorsesList(winHorsesList){
        this.winHorsesList = winHorsesList;
    },
    setHRankList(hRankList){
        this.hRankList = hRankList;
    },
    setRank5List(rank5List){
        this.rank5List = rank5List;
    },
    setWin(win){
        this.win = win;
    },
    setCoin(coin){
        this.coin = coin;
    },

});

module.exports.msg_horse_result = msg_horse_result;

