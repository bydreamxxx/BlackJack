let py_team = cc.Class({
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

module.exports.py_team = py_team;

let py_role = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.score = this.score;
        content.teamId = this.teamId;
        content.pokerList = this.pokerList;
        content.aNum = this.aNum;
        content.yNum = this.yNum;
        content.outIndex = this.outIndex;
        content.isAuto = this.isAuto;
        content.isOnline = this.isOnline;
        content.pokerNum = this.pokerNum;
        content.totalScore = this.totalScore;
        content.ready = this.ready;
        content.double = this.double;
        content.xue = this.xue;
        content.yao = this.yao;
        content.outPokerList = this.outPokerList;
        content.liuNum = this.liuNum;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setScore(score){
        this.score = score;
    },
    setTeamId(teamId){
        this.teamId = teamId;
    },
    setPokerList(pokerList){
        this.pokerList = pokerList;
    },
    setANum(aNum){
        this.aNum = aNum;
    },
    setYNum(yNum){
        this.yNum = yNum;
    },
    setOutIndex(outIndex){
        this.outIndex = outIndex;
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
    setTotalScore(totalScore){
        this.totalScore = totalScore;
    },
    setReady(ready){
        this.ready = ready;
    },
    setDouble(double){
        this.double = double;
    },
    setXue(xue){
        this.xue = xue;
    },
    setYao(yao){
        this.yao = yao;
    },
    setOutPokerList(outPokerList){
        this.outPokerList = outPokerList;
    },
    setLiuNum(liuNum){
        this.liuNum = liuNum;
    },

});

module.exports.py_role = py_role;

let py_card_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.card5 = this.card5;
        content.card10 = this.card10;
        content.cardk = this.cardk;

        return content;
    },
    setCard5(card5){
        this.card5 = card5;
    },
    setCard10(card10){
        this.card10 = card10;
    },
    setCardk(cardk){
        this.cardk = cardk;
    },

});

module.exports.py_card_info = py_card_info;

let py_desk = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.state = this.state;
        content.nextTime = this.nextTime;
        content.rule = this.rule;
        content.score = this.score;
        content.teamList = this.teamList;
        content.gameType = this.gameType;
        content.roleListList = this.roleListList;
        content.opId = this.opId;
        content.isReconnect = this.isReconnect;
        content.tmpWin = this.tmpWin;
        content.cardInfo = this.cardInfo;
        content.curCircle = this.curCircle;
        content.dissolveTimeout = this.dissolveTimeout;
        content.dissolveInfoList = this.dissolveInfoList;
        content.configRoomId = this.configRoomId;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setState(state){
        this.state = state;
    },
    setNextTime(nextTime){
        this.nextTime = nextTime;
    },
    setRule(rule){
        this.rule = rule;
    },
    setScore(score){
        this.score = score;
    },
    setTeamList(teamList){
        this.teamList = teamList;
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
    setIsReconnect(isReconnect){
        this.isReconnect = isReconnect;
    },
    setTmpWin(tmpWin){
        this.tmpWin = tmpWin;
    },
    setCardInfo(cardInfo){
        this.cardInfo = cardInfo;
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

});

module.exports.py_desk = py_desk;

let py_player_poker = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.pokerList = this.pokerList;
        content.teamId = this.teamId;
        content.liuNum = this.liuNum;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setPokerList(pokerList){
        this.pokerList = pokerList;
    },
    setTeamId(teamId){
        this.teamId = teamId;
    },
    setLiuNum(liuNum){
        this.liuNum = liuNum;
    },

});

module.exports.py_player_poker = py_player_poker;

let msg_paoyao_send_poker = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.listList = this.listList;
        content.state = this.state;
        content.nextId = this.nextId;
        content.time = this.time;
        content.changeListList = this.changeListList;
        content.teamList = this.teamList;

        return content;
    },
    setListList(listList){
        this.listList = listList;
    },
    setState(state){
        this.state = state;
    },
    setNextId(nextId){
        this.nextId = nextId;
    },
    setTime(time){
        this.time = time;
    },
    setChangeListList(changeListList){
        this.changeListList = changeListList;
    },
    setTeamList(teamList){
        this.teamList = teamList;
    },

});

module.exports.msg_paoyao_send_poker = msg_paoyao_send_poker;

let msg_paoyao_ready_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.isDouble = this.isDouble;

        return content;
    },
    setIsDouble(isDouble){
        this.isDouble = isDouble;
    },

});

module.exports.msg_paoyao_ready_req = msg_paoyao_ready_req;

let msg_paoyao_ready_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.isDouble = this.isDouble;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setIsDouble(isDouble){
        this.isDouble = isDouble;
    },

});

module.exports.msg_paoyao_ready_ack = msg_paoyao_ready_ack;

let msg_paoyao_yao_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.aNum = this.aNum;
        content.yNum = this.yNum;

        return content;
    },
    setANum(aNum){
        this.aNum = aNum;
    },
    setYNum(yNum){
        this.yNum = yNum;
    },

});

module.exports.msg_paoyao_yao_req = msg_paoyao_yao_req;

let msg_paoyao_yao_ack = cc.Class({
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

module.exports.msg_paoyao_yao_ack = msg_paoyao_yao_ack;

let paoyao_player_yao = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.aNum = this.aNum;
        content.yNum = this.yNum;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setANum(aNum){
        this.aNum = aNum;
    },
    setYNum(yNum){
        this.yNum = yNum;
    },

});

module.exports.paoyao_player_yao = paoyao_player_yao;

let msg_paoyao_yao_notify = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.listList = this.listList;
        content.nextId = this.nextId;
        content.nextTime = this.nextTime;

        return content;
    },
    setListList(listList){
        this.listList = listList;
    },
    setNextId(nextId){
        this.nextId = nextId;
    },
    setNextTime(nextTime){
        this.nextTime = nextTime;
    },

});

module.exports.msg_paoyao_yao_notify = msg_paoyao_yao_notify;

let msg_paoyao_yao_change = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.yao = this.yao;

        return content;
    },
    setYao(yao){
        this.yao = yao;
    },

});

module.exports.msg_paoyao_yao_change = msg_paoyao_yao_change;

let msg_paoyao_act_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.type = this.type;
        content.pokerList = this.pokerList;

        return content;
    },
    setType(type){
        this.type = type;
    },
    setPokerList(pokerList){
        this.pokerList = pokerList;
    },

});

module.exports.msg_paoyao_act_req = msg_paoyao_act_req;

let msg_paoyao_act_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.type = this.type;
        content.pokerList = this.pokerList;
        content.nextId = this.nextId;
        content.nextTime = this.nextTime;
        content.opId = this.opId;

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

});

module.exports.msg_paoyao_act_ack = msg_paoyao_act_ack;

let msg_paoyao_xue_notify = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.teamId = this.teamId;

        return content;
    },
    setTeamId(teamId){
        this.teamId = teamId;
    },

});

module.exports.msg_paoyao_xue_notify = msg_paoyao_xue_notify;

let msg_paoyao_xue_req = cc.Class({
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

module.exports.msg_paoyao_xue_req = msg_paoyao_xue_req;

let msg_paoyao_xue_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.type = this.type;
        content.id = this.id;

        return content;
    },
    setType(type){
        this.type = type;
    },
    setId(id){
        this.id = id;
    },

});

module.exports.msg_paoyao_xue_ack = msg_paoyao_xue_ack;

let msg_state_change = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.state = this.state;
        content.nextId = this.nextId;
        content.nextTime = this.nextTime;

        return content;
    },
    setState(state){
        this.state = state;
    },
    setNextId(nextId){
        this.nextId = nextId;
    },
    setNextTime(nextTime){
        this.nextTime = nextTime;
    },

});

module.exports.msg_state_change = msg_state_change;

let msg_paoyao_score_change = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.teamId = this.teamId;
        content.score = this.score;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setTeamId(teamId){
        this.teamId = teamId;
    },
    setScore(score){
        this.score = score;
    },

});

module.exports.msg_paoyao_score_change = msg_paoyao_score_change;

let msg_paoyao_dscore_change = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.score = this.score;

        return content;
    },
    setScore(score){
        this.score = score;
    },

});

module.exports.msg_paoyao_dscore_change = msg_paoyao_dscore_change;

let msg_paoyao_result = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.winId = this.winId;
        content.winType = this.winType;
        content.xueType = this.xueType;
        content.resultList = this.resultList;
        content.pokerList = this.pokerList;

        return content;
    },
    setWinId(winId){
        this.winId = winId;
    },
    setWinType(winType){
        this.winType = winType;
    },
    setXueType(xueType){
        this.xueType = xueType;
    },
    setResultList(resultList){
        this.resultList = resultList;
    },
    setPokerList(pokerList){
        this.pokerList = pokerList;
    },

});

module.exports.msg_paoyao_result = msg_paoyao_result;

let py_player_result = cc.Class({
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

module.exports.py_player_result = py_player_result;

let py_player_final_result = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.score = this.score;
        content.winTimes = this.winTimes;
        content.loseTimes = this.loseTimes;
        content.bigXue = this.bigXue;
        content.smallXue = this.smallXue;

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
    setLoseTimes(loseTimes){
        this.loseTimes = loseTimes;
    },
    setBigXue(bigXue){
        this.bigXue = bigXue;
    },
    setSmallXue(smallXue){
        this.smallXue = smallXue;
    },

});

module.exports.py_player_final_result = py_player_final_result;

let msg_paoyao_final_result = cc.Class({
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

module.exports.msg_paoyao_final_result = msg_paoyao_final_result;

let msg_paoyao_other_poker = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.list = this.list;
        content.id = this.id;

        return content;
    },
    setList(list){
        this.list = list;
    },
    setId(id){
        this.id = id;
    },

});

module.exports.msg_paoyao_other_poker = msg_paoyao_other_poker;

let msg_paoyao_tuoguan_req = cc.Class({
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

module.exports.msg_paoyao_tuoguan_req = msg_paoyao_tuoguan_req;

let msg_paoyao_tuoguan_change = cc.Class({
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

module.exports.msg_paoyao_tuoguan_change = msg_paoyao_tuoguan_change;

let msg_paoyao_chat_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.msg = this.msg;

        return content;
    },
    setMsg(msg){
        this.msg = msg;
    },

});

module.exports.msg_paoyao_chat_req = msg_paoyao_chat_req;

let msg_paoyao_chat_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.msg = this.msg;
        content.id = this.id;

        return content;
    },
    setMsg(msg){
        this.msg = msg;
    },
    setId(id){
        this.id = id;
    },

});

module.exports.msg_paoyao_chat_ack = msg_paoyao_chat_ack;

