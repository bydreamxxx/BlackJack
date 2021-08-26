let msg_xiyou_room_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.state = this.state;
        content.recordsList = this.recordsList;
        content.rank8List = this.rank8List;
        content.configId = this.configId;
        content.lastTime = this.lastTime;
        content.betList = this.betList;
        content.coin = this.coin;

        return content;
    },
    setState(state){
        this.state = state;
    },
    setRecordsList(recordsList){
        this.recordsList = recordsList;
    },
    setRank8List(rank8List){
        this.rank8List = rank8List;
    },
    setConfigId(configId){
        this.configId = configId;
    },
    setLastTime(lastTime){
        this.lastTime = lastTime;
    },
    setBetList(betList){
        this.betList = betList;
    },
    setCoin(coin){
        this.coin = coin;
    },

});

module.exports.msg_xiyou_room_info = msg_xiyou_room_info;

let xiyou_record = cc.Class({
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

module.exports.xiyou_record = xiyou_record;

let xiyou_user_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.rank = this.rank;
        content.userId = this.userId;
        content.name = this.name;
        content.headUrl = this.headUrl;
        content.openId = this.openId;
        content.coin = this.coin;
        content.win = this.win;
        content.betList = this.betList;

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
    setHeadUrl(headUrl){
        this.headUrl = headUrl;
    },
    setOpenId(openId){
        this.openId = openId;
    },
    setCoin(coin){
        this.coin = coin;
    },
    setWin(win){
        this.win = win;
    },
    setBetList(betList){
        this.betList = betList;
    },

});

module.exports.xiyou_user_info = xiyou_user_info;

let msg_xiyou_bet_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.betList = this.betList;

        return content;
    },
    setBetList(betList){
        this.betList = betList;
    },

});

module.exports.msg_xiyou_bet_req = msg_xiyou_bet_req;

let xiyou_bet_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.betId = this.betId;
        content.betSelf = this.betSelf;
        content.bet = this.bet;
        content.rate = this.rate;

        return content;
    },
    setBetId(betId){
        this.betId = betId;
    },
    setBetSelf(betSelf){
        this.betSelf = betSelf;
    },
    setBet(bet){
        this.bet = bet;
    },
    setRate(rate){
        this.rate = rate;
    },

});

module.exports.xiyou_bet_info = xiyou_bet_info;

let msg_xiyou_bet_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.userId = this.userId;
        content.betList = this.betList;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setBetList(betList){
        this.betList = betList;
    },

});

module.exports.msg_xiyou_bet_ret = msg_xiyou_bet_ret;

let msg_xiyou_bet_update = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.betList = this.betList;

        return content;
    },
    setBetList(betList){
        this.betList = betList;
    },

});

module.exports.msg_xiyou_bet_update = msg_xiyou_bet_update;

let msg_xiyou_state_update = cc.Class({
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

module.exports.msg_xiyou_state_update = msg_xiyou_state_update;

let msg_xiyou_result = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.type = this.type;
        content.indexsList = this.indexsList;
        content.betList = this.betList;
        content.jubaoCoin = this.jubaoCoin;
        content.rank8List = this.rank8List;
        content.rank5List = this.rank5List;
        content.winType = this.winType;
        content.win = this.win;
        content.coin = this.coin;

        return content;
    },
    setType(type){
        this.type = type;
    },
    setIndexsList(indexsList){
        this.indexsList = indexsList;
    },
    setBetList(betList){
        this.betList = betList;
    },
    setJubaoCoin(jubaoCoin){
        this.jubaoCoin = jubaoCoin;
    },
    setRank8List(rank8List){
        this.rank8List = rank8List;
    },
    setRank5List(rank5List){
        this.rank5List = rank5List;
    },
    setWinType(winType){
        this.winType = winType;
    },
    setWin(win){
        this.win = win;
    },
    setCoin(coin){
        this.coin = coin;
    },

});

module.exports.msg_xiyou_result = msg_xiyou_result;

let msg_xiyou_unbet_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_xiyou_unbet_req = msg_xiyou_unbet_req;

let msg_xiyou_unbet_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.coin = this.coin;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setCoin(coin){
        this.coin = coin;
    },

});

module.exports.msg_xiyou_unbet_ret = msg_xiyou_unbet_ret;

