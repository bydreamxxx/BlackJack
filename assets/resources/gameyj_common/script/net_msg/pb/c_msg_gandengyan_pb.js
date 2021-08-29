let gdy_role = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.score = this.score;
        content.pokerList = this.pokerList;
        content.isAuto = this.isAuto;
        content.isOnline = this.isOnline;
        content.pokerNum = this.pokerNum;
        content.ready = this.ready;
        content.outPokerList = this.outPokerList;
        content.changePokerList = this.changePokerList;
        content.zhuang = this.zhuang;
        content.guan = this.guan;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setScore(score){
        this.score = score;
    },
    setPokerList(pokerList){
        this.pokerList = pokerList;
    },
    setIsAuto(isAuto){
        this.isAuto = isAuto;
    },
    setIsOnline(isOnline){
        this.isOnline = isOnline;
    },
    setPokerNum(pokerNum){
        this.pokerNum = pokerNum;
    },
    setReady(ready){
        this.ready = ready;
    },
    setOutPokerList(outPokerList){
        this.outPokerList = outPokerList;
    },
    setChangePokerList(changePokerList){
        this.changePokerList = changePokerList;
    },
    setZhuang(zhuang){
        this.zhuang = zhuang;
    },
    setGuan(guan){
        this.guan = guan;
    },

});

module.exports.gdy_role = gdy_role;

let gdy_desk = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.nextTime = this.nextTime;
        content.rule = this.rule;
        content.rate = this.rate;
        content.gameType = this.gameType;
        content.roleListList = this.roleListList;
        content.opId = this.opId;
        content.lastCardNum = this.lastCardNum;
        content.isReconnect = this.isReconnect;
        content.curCircle = this.curCircle;
        content.dissolveTimeout = this.dissolveTimeout;
        content.dissolveInfoList = this.dissolveInfoList;
        content.configRoomId = this.configRoomId;
        content.state = this.state;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setNextTime(nextTime){
        this.nextTime = nextTime;
    },
    setRule(rule){
        this.rule = rule;
    },
    setRate(rate){
        this.rate = rate;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setRoleListList(roleListList){
        this.roleListList = roleListList;
    },
    setOpId(opId){
        this.opId = opId;
    },
    setLastCardNum(lastCardNum){
        this.lastCardNum = lastCardNum;
    },
    setIsReconnect(isReconnect){
        this.isReconnect = isReconnect;
    },
    setCurCircle(curCircle){
        this.curCircle = curCircle;
    },
    setDissolveTimeout(dissolveTimeout){
        this.dissolveTimeout = dissolveTimeout;
    },
    setDissolveInfoList(dissolveInfoList){
        this.dissolveInfoList = dissolveInfoList;
    },
    setConfigRoomId(configRoomId){
        this.configRoomId = configRoomId;
    },
    setState(state){
        this.state = state;
    },

});

module.exports.gdy_desk = gdy_desk;

let gdy_player_poker = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.pokerList = this.pokerList;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setPokerList(pokerList){
        this.pokerList = pokerList;
    },

});

module.exports.gdy_player_poker = gdy_player_poker;

let msg_gdy_send_poker = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.listList = this.listList;
        content.nextId = this.nextId;
        content.time = this.time;
        content.cardNum = this.cardNum;

        return content;
    },
    setListList(listList){
        this.listList = listList;
    },
    setNextId(nextId){
        this.nextId = nextId;
    },
    setTime(time){
        this.time = time;
    },
    setCardNum(cardNum){
        this.cardNum = cardNum;
    },

});

module.exports.msg_gdy_send_poker = msg_gdy_send_poker;

let msg_gdy_guan_change = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;

        return content;
    },
    setId(id){
        this.id = id;
    },

});

module.exports.msg_gdy_guan_change = msg_gdy_guan_change;

let msg_gdy_act_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.type = this.type;
        content.pokerList = this.pokerList;
        content.changePokerList = this.changePokerList;

        return content;
    },
    setType(type){
        this.type = type;
    },
    setPokerList(pokerList){
        this.pokerList = pokerList;
    },
    setChangePokerList(changePokerList){
        this.changePokerList = changePokerList;
    },

});

module.exports.msg_gdy_act_req = msg_gdy_act_req;

let msg_gdy_act_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.type = this.type;
        content.pokerList = this.pokerList;
        content.nextId = this.nextId;
        content.nextTime = this.nextTime;
        content.opId = this.opId;
        content.changePokerList = this.changePokerList;

        return content;
    },
    setType(type){
        this.type = type;
    },
    setPokerList(pokerList){
        this.pokerList = pokerList;
    },
    setNextId(nextId){
        this.nextId = nextId;
    },
    setNextTime(nextTime){
        this.nextTime = nextTime;
    },
    setOpId(opId){
        this.opId = opId;
    },
    setChangePokerList(changePokerList){
        this.changePokerList = changePokerList;
    },

});

module.exports.msg_gdy_act_ack = msg_gdy_act_ack;

let gdy_player_result = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.score = this.score;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setScore(score){
        this.score = score;
    },

});

module.exports.gdy_player_result = gdy_player_result;

let msg_gdy_result = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.resultList = this.resultList;
        content.pokerList = this.pokerList;

        return content;
    },
    setResultList(resultList){
        this.resultList = resultList;
    },
    setPokerList(pokerList){
        this.pokerList = pokerList;
    },

});

module.exports.msg_gdy_result = msg_gdy_result;

let gdy_player_final_result = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.score = this.score;
        content.winTimes = this.winTimes;
        content.guanTimes = this.guanTimes;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setScore(score){
        this.score = score;
    },
    setWinTimes(winTimes){
        this.winTimes = winTimes;
    },
    setGuanTimes(guanTimes){
        this.guanTimes = guanTimes;
    },

});

module.exports.gdy_player_final_result = gdy_player_final_result;

let msg_gdy_final_result = cc.Class({
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

module.exports.msg_gdy_final_result = msg_gdy_final_result;

let msg_gdy_tuoguan_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.isTuoguan = this.isTuoguan;

        return content;
    },
    setIsTuoguan(isTuoguan){
        this.isTuoguan = isTuoguan;
    },

});

module.exports.msg_gdy_tuoguan_req = msg_gdy_tuoguan_req;

let msg_gdy_tuoguan_change = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.isTuoguan = this.isTuoguan;
        content.id = this.id;

        return content;
    },
    setIsTuoguan(isTuoguan){
        this.isTuoguan = isTuoguan;
    },
    setId(id){
        this.id = id;
    },

});

module.exports.msg_gdy_tuoguan_change = msg_gdy_tuoguan_change;

let msg_gdy_rate_notify = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.rate = this.rate;

        return content;
    },
    setRate(rate){
        this.rate = rate;
    },

});

module.exports.msg_gdy_rate_notify = msg_gdy_rate_notify;

