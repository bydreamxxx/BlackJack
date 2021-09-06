let TdkCDeskUserData = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userid = this.userid;
        content.score = this.score;
        content.already = this.already;
        content.fold = this.fold;
        content.pos = this.pos;
        content.bet = this.bet;
        content.winnum = this.winnum;
        content.totalnum = this.totalnum;
        content.pokerlistList = this.pokerlistList;
        content.hidelistList = this.hidelistList;
        content.borrow = this.borrow;
        content.allin = this.allin;
        content.join = this.join;
        content.isAuto = this.isAuto;
        content.roundBet = this.roundBet;
        content.opType = this.opType;
        content.fantiTimes = this.fantiTimes;

        return content;
    },
    setUserid(userid){
        this.userid = userid;
    },
    setScore(score){
        this.score = score;
    },
    setAlready(already){
        this.already = already;
    },
    setFold(fold){
        this.fold = fold;
    },
    setPos(pos){
        this.pos = pos;
    },
    setBet(bet){
        this.bet = bet;
    },
    setWinnum(winnum){
        this.winnum = winnum;
    },
    setTotalnum(totalnum){
        this.totalnum = totalnum;
    },
    setPokerlistList(pokerlistList){
        this.pokerlistList = pokerlistList;
    },
    setHidelistList(hidelistList){
        this.hidelistList = hidelistList;
    },
    setBorrow(borrow){
        this.borrow = borrow;
    },
    setAllin(allin){
        this.allin = allin;
    },
    setJoin(join){
        this.join = join;
    },
    setIsAuto(isAuto){
        this.isAuto = isAuto;
    },
    setRoundBet(roundBet){
        this.roundBet = roundBet;
    },
    setOpType(opType){
        this.opType = opType;
    },
    setFantiTimes(fantiTimes){
        this.fantiTimes = fantiTimes;
    },

});

module.exports.TdkCDeskUserData = TdkCDeskUserData;

let TdkJoinPlayingDeskRsp = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.islanguo = this.islanguo;
        content.deskstatus = this.deskstatus;
        content.actuserid = this.actuserid;
        content.time = this.time;
        content.userdataList = this.userdataList;
        content.roomtype = this.roomtype;
        content.betlistList = this.betlistList;
        content.roomState = this.roomState;
        content.rule = this.rule;
        content.isReconnect = this.isReconnect;
        content.curCircle = this.curCircle;
        content.dissolveTimeout = this.dissolveTimeout;
        content.dissolveInfoList = this.dissolveInfoList;
        content.roomnum = this.roomnum;
        content.configRoomId = this.configRoomId;
        content.xifen = this.xifen;
        content.lanNum = this.lanNum;
        content.maxBet = this.maxBet;

        return content;
    },
    setIslanguo(islanguo){
        this.islanguo = islanguo;
    },
    setDeskstatus(deskstatus){
        this.deskstatus = deskstatus;
    },
    setActuserid(actuserid){
        this.actuserid = actuserid;
    },
    setTime(time){
        this.time = time;
    },
    setUserdataList(userdataList){
        this.userdataList = userdataList;
    },
    setRoomtype(roomtype){
        this.roomtype = roomtype;
    },
    setBetlistList(betlistList){
        this.betlistList = betlistList;
    },
    setRoomState(roomState){
        this.roomState = roomState;
    },
    setRule(rule){
        this.rule = rule;
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
    setRoomnum(roomnum){
        this.roomnum = roomnum;
    },
    setConfigRoomId(configRoomId){
        this.configRoomId = configRoomId;
    },
    setXifen(xifen){
        this.xifen = xifen;
    },
    setLanNum(lanNum){
        this.lanNum = lanNum;
    },
    setMaxBet(maxBet){
        this.maxBet = maxBet;
    },

});

module.exports.TdkJoinPlayingDeskRsp = TdkJoinPlayingDeskRsp;

let TdkTuoGuan = cc.Class({
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

module.exports.TdkTuoGuan = TdkTuoGuan;

let TdkTuoGuanRsp = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.type = this.type;
        content.userId = this.userId;

        return content;
    },
    setType(type){
        this.type = type;
    },
    setUserId(userId){
        this.userId = userId;
    },

});

module.exports.TdkTuoGuanRsp = TdkTuoGuanRsp;

let TdkCBet = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.type = this.type;
        content.num = this.num;

        return content;
    },
    setType(type){
        this.type = type;
    },
    setNum(num){
        this.num = num;
    },

});

module.exports.TdkCBet = TdkCBet;

let TdkCBetRsp = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.type = this.type;
        content.num = this.num;
        content.userid = this.userid;
        content.nextuserid = this.nextuserid;
        content.deskstatus = this.deskstatus;
        content.time = this.time;
        content.fantiTimes = this.fantiTimes;

        return content;
    },
    setType(type){
        this.type = type;
    },
    setNum(num){
        this.num = num;
    },
    setUserid(userid){
        this.userid = userid;
    },
    setNextuserid(nextuserid){
        this.nextuserid = nextuserid;
    },
    setDeskstatus(deskstatus){
        this.deskstatus = deskstatus;
    },
    setTime(time){
        this.time = time;
    },
    setFantiTimes(fantiTimes){
        this.fantiTimes = fantiTimes;
    },

});

module.exports.TdkCBetRsp = TdkCBetRsp;

let TdkCPoker = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userid = this.userid;
        content.pokerid = this.pokerid;
        content.borrow = this.borrow;

        return content;
    },
    setUserid(userid){
        this.userid = userid;
    },
    setPokerid(pokerid){
        this.pokerid = pokerid;
    },
    setBorrow(borrow){
        this.borrow = borrow;
    },

});

module.exports.TdkCPoker = TdkCPoker;

let TdkCHidePoker = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userid = this.userid;
        content.pokeridList = this.pokeridList;

        return content;
    },
    setUserid(userid){
        this.userid = userid;
    },
    setPokeridList(pokeridList){
        this.pokeridList = pokeridList;
    },

});

module.exports.TdkCHidePoker = TdkCHidePoker;

let TdkCSendPoker = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.pokerlistList = this.pokerlistList;
        content.selflistList = this.selflistList;
        content.deskstatus = this.deskstatus;
        content.nextuserid = this.nextuserid;
        content.time = this.time;
        content.roomnum = this.roomnum;
        content.startid = this.startid;
        content.isFirst = this.isFirst;

        return content;
    },
    setPokerlistList(pokerlistList){
        this.pokerlistList = pokerlistList;
    },
    setSelflistList(selflistList){
        this.selflistList = selflistList;
    },
    setDeskstatus(deskstatus){
        this.deskstatus = deskstatus;
    },
    setNextuserid(nextuserid){
        this.nextuserid = nextuserid;
    },
    setTime(time){
        this.time = time;
    },
    setRoomnum(roomnum){
        this.roomnum = roomnum;
    },
    setStartid(startid){
        this.startid = startid;
    },
    setIsFirst(isFirst){
        this.isFirst = isFirst;
    },

});

module.exports.TdkCSendPoker = TdkCSendPoker;

let TdkCOpenPoker = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.pokerList = this.pokerList;

        return content;
    },
    setPokerList(pokerList){
        this.pokerList = pokerList;
    },

});

module.exports.TdkCOpenPoker = TdkCOpenPoker;

let TdkCDeskState = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.ready = this.ready;

        return content;
    },
    setReady(ready){
        this.ready = ready;
    },

});

module.exports.TdkCDeskState = TdkCDeskState;

let TdkCRoundEnd = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userid = this.userid;
        content.languo = this.languo;
        content.time = this.time;
        content.xifen = this.xifen;
        content.lanNum = this.lanNum;

        return content;
    },
    setUserid(userid){
        this.userid = userid;
    },
    setLanguo(languo){
        this.languo = languo;
    },
    setTime(time){
        this.time = time;
    },
    setXifen(xifen){
        this.xifen = xifen;
    },
    setLanNum(lanNum){
        this.lanNum = lanNum;
    },

});

module.exports.TdkCRoundEnd = TdkCRoundEnd;

let TdkPlayerFinalResult = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.score = this.score;
        content.winTimes = this.winTimes;
        content.loseTimes = this.loseTimes;
        content.xifengNum = this.xifengNum;

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
    setXifengNum(xifengNum){
        this.xifengNum = xifengNum;
    },

});

module.exports.TdkPlayerFinalResult = TdkPlayerFinalResult;

let TdkFinalResult = cc.Class({
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

module.exports.TdkFinalResult = TdkFinalResult;

let TdkKanPaiReq = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.TdkKanPaiReq = TdkKanPaiReq;

let TdkKanPaiRsp = cc.Class({
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

module.exports.TdkKanPaiRsp = TdkKanPaiRsp;

let TdkWaitNotify = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.TdkWaitNotify = TdkWaitNotify;

