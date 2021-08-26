let msg_turn_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.turnState = this.turnState;
        content.lastTime = this.lastTime;
        content.betAreaList = this.betAreaList;
        content.wayBillList = this.wayBillList;
        content.curCoin = this.curCoin;
        content.roomConfigId = this.roomConfigId;
        content.gameNum = this.gameNum;
        content.rank5List = this.rank5List;

        return content;
    },
    setTurnState(turnState){
        this.turnState = turnState;
    },
    setLastTime(lastTime){
        this.lastTime = lastTime;
    },
    setBetAreaList(betAreaList){
        this.betAreaList = betAreaList;
    },
    setWayBillList(wayBillList){
        this.wayBillList = wayBillList;
    },
    setCurCoin(curCoin){
        this.curCoin = curCoin;
    },
    setRoomConfigId(roomConfigId){
        this.roomConfigId = roomConfigId;
    },
    setGameNum(gameNum){
        this.gameNum = gameNum;
    },
    setRank5List(rank5List){
        this.rank5List = rank5List;
    },

});

module.exports.msg_turn_info = msg_turn_info;

let turn_bet_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.value = this.value;
        content.selfValue = this.selfValue;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setValue(value){
        this.value = value;
    },
    setSelfValue(selfValue){
        this.selfValue = selfValue;
    },

});

module.exports.turn_bet_info = turn_bet_info;

let turn_record_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.type = this.type;
        content.iconsList = this.iconsList;

        return content;
    },
    setType(type){
        this.type = type;
    },
    setIconsList(iconsList){
        this.iconsList = iconsList;
    },

});

module.exports.turn_record_info = turn_record_info;

let turn_user_info = cc.Class({
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
        content.win = this.win;
        content.rank8WinList = this.rank8WinList;

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
    setWin(win){
        this.win = win;
    },
    setRank8WinList(rank8WinList){
        this.rank8WinList = rank8WinList;
    },

});

module.exports.turn_user_info = turn_user_info;

let msg_turn_bet_req = cc.Class({
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

module.exports.msg_turn_bet_req = msg_turn_bet_req;

let msg_turn_bet_ret = cc.Class({
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

module.exports.msg_turn_bet_ret = msg_turn_bet_ret;

let msg_turn_bet_area_update = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.betAreaList = this.betAreaList;

        return content;
    },
    setBetAreaList(betAreaList){
        this.betAreaList = betAreaList;
    },

});

module.exports.msg_turn_bet_area_update = msg_turn_bet_area_update;

let msg_turn_state_update = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.state = this.state;
        content.lastTime = this.lastTime;

        return content;
    },
    setState(state){
        this.state = state;
    },
    setLastTime(lastTime){
        this.lastTime = lastTime;
    },

});

module.exports.msg_turn_state_update = msg_turn_state_update;

let turn_result_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.index = this.index;
        content.icon = this.icon;

        return content;
    },
    setIndex(index){
        this.index = index;
    },
    setIcon(icon){
        this.icon = icon;
    },

});

module.exports.turn_result_info = turn_result_info;

let msg_turn_result = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.type = this.type;
        content.resultList = this.resultList;
        content.areaList = this.areaList;
        content.rank5List = this.rank5List;
        content.win = this.win;
        content.coin = this.coin;

        return content;
    },
    setType(type){
        this.type = type;
    },
    setResultList(resultList){
        this.resultList = resultList;
    },
    setAreaList(areaList){
        this.areaList = areaList;
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

module.exports.msg_turn_result = msg_turn_result;

let msg_turn_self_record_req = cc.Class({
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

module.exports.msg_turn_self_record_req = msg_turn_self_record_req;

let msg_turn_self_record = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.phase = this.phase;
        content.resultList = this.resultList;
        content.areaList = this.areaList;
        content.betList = this.betList;
        content.type = this.type;
        content.win = this.win;

        return content;
    },
    setPhase(phase){
        this.phase = phase;
    },
    setResultList(resultList){
        this.resultList = resultList;
    },
    setAreaList(areaList){
        this.areaList = areaList;
    },
    setBetList(betList){
        this.betList = betList;
    },
    setType(type){
        this.type = type;
    },
    setWin(win){
        this.win = win;
    },

});

module.exports.msg_turn_self_record = msg_turn_self_record;

let msg_turn_self_record_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.recordsList = this.recordsList;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setRecordsList(recordsList){
        this.recordsList = recordsList;
    },

});

module.exports.msg_turn_self_record_ack = msg_turn_self_record_ack;

