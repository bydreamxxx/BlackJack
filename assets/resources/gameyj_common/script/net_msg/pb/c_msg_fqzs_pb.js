let msg_fqzs_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.fqzsState = this.fqzsState;
        content.lastTime = this.lastTime;
        content.betAreaList = this.betAreaList;
        content.wayBillList = this.wayBillList;
        content.rank8List = this.rank8List;
        content.curCoin = this.curCoin;
        content.roomConfigId = this.roomConfigId;

        return content;
    },
    setFqzsState(fqzsState){
        this.fqzsState = fqzsState;
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
    setRank8List(rank8List){
        this.rank8List = rank8List;
    },
    setCurCoin(curCoin){
        this.curCoin = curCoin;
    },
    setRoomConfigId(roomConfigId){
        this.roomConfigId = roomConfigId;
    },

});

module.exports.msg_fqzs_info = msg_fqzs_info;

let fqzs_bet_info = cc.Class({
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

module.exports.fqzs_bet_info = fqzs_bet_info;

let fqzs_record_info = cc.Class({
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

module.exports.fqzs_record_info = fqzs_record_info;

let fqzs_user_info = cc.Class({
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

module.exports.fqzs_user_info = fqzs_user_info;

let msg_fqzs_bet_req = cc.Class({
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

module.exports.msg_fqzs_bet_req = msg_fqzs_bet_req;

let msg_fqzs_bet_ret = cc.Class({
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

module.exports.msg_fqzs_bet_ret = msg_fqzs_bet_ret;

let msg_fqzs_bet_area_update = cc.Class({
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

module.exports.msg_fqzs_bet_area_update = msg_fqzs_bet_area_update;

let msg_fqzs_state_update = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.state = this.state;
        content.lastTime = this.lastTime;
        content.rank8List = this.rank8List;

        return content;
    },
    setState(state){
        this.state = state;
    },
    setLastTime(lastTime){
        this.lastTime = lastTime;
    },
    setRank8List(rank8List){
        this.rank8List = rank8List;
    },

});

module.exports.msg_fqzs_state_update = msg_fqzs_state_update;

let fqzs_result_info = cc.Class({
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

module.exports.fqzs_result_info = fqzs_result_info;

let msg_fqzs_result = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.type = this.type;
        content.resultList = this.resultList;
        content.areaList = this.areaList;
        content.rank5List = this.rank5List;
        content.rank8List = this.rank8List;
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
    setRank8List(rank8List){
        this.rank8List = rank8List;
    },
    setWin(win){
        this.win = win;
    },
    setCoin(coin){
        this.coin = coin;
    },

});

module.exports.msg_fqzs_result = msg_fqzs_result;

