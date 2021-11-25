let msg_rm_ready_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_rm_ready_req = msg_rm_ready_req;

let msg_rm_ready_ack = cc.Class({
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

module.exports.msg_rm_ready_ack = msg_rm_ready_ack;

let msg_rm_action_change = cc.Class({
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

module.exports.msg_rm_action_change = msg_rm_action_change;

let msg_rm_state_change_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.roomState = this.roomState;
        content.curRound = this.curRound;
        content.banker = this.banker;

        return content;
    },
    setRoomState(roomState){
        this.roomState = roomState;
    },
    setCurRound(curRound){
        this.curRound = curRound;
    },
    setBanker(banker){
        this.banker = banker;
    },

});

module.exports.msg_rm_state_change_2c = msg_rm_state_change_2c;

let msg_rm_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.bjState = this.bjState;
        content.lastTime = this.lastTime;
        content.roomConfigId = this.roomConfigId;
        content.turn = this.turn;
        content.turnLeftTime = this.turnLeftTime;
        content.banker = this.banker;
        content.xcard = this.xcard;
        content.giveUp = this.giveUp;
        content.diropCoin = this.diropCoin;
        content.selfState = this.selfState;

        return content;
    },
    setBjState(bjState){
        this.bjState = bjState;
    },
    setLastTime(lastTime){
        this.lastTime = lastTime;
    },
    setRoomConfigId(roomConfigId){
        this.roomConfigId = roomConfigId;
    },
    setTurn(turn){
        this.turn = turn;
    },
    setTurnLeftTime(turnLeftTime){
        this.turnLeftTime = turnLeftTime;
    },
    setBanker(banker){
        this.banker = banker;
    },
    setXcard(xcard){
        this.xcard = xcard;
    },
    setGiveUp(giveUp){
        this.giveUp = giveUp;
    },
    setDiropCoin(diropCoin){
        this.diropCoin = diropCoin;
    },
    setSelfState(selfState){
        this.selfState = selfState;
    },

});

module.exports.msg_rm_info = msg_rm_info;

let msg_rm_poker_req = cc.Class({
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

module.exports.msg_rm_poker_req = msg_rm_poker_req;

let msg_rm_poker_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.ret = this.ret;

        return content;
    },
    setRet(ret){
        this.ret = ret;
    },

});

module.exports.msg_rm_poker_ack = msg_rm_poker_ack;

let msg_rm_deal_poker = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.cardsList = this.cardsList;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setCardsList(cardsList){
        this.cardsList = cardsList;
    },

});

module.exports.msg_rm_deal_poker = msg_rm_deal_poker;

let msg_rm_deal_poker_broadcast = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.type = this.type;
        content.cardList = this.cardList;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setType(type){
        this.type = type;
    },
    setCardList(cardList){
        this.cardList = cardList;
    },

});

module.exports.msg_rm_deal_poker_broadcast = msg_rm_deal_poker_broadcast;

let msg_rm_give_up_poker_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.card = this.card;

        return content;
    },
    setCard(card){
        this.card = card;
    },

});

module.exports.msg_rm_give_up_poker_req = msg_rm_give_up_poker_req;

let msg_rm_give_up_poker_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.ret = this.ret;
        content.card = this.card;

        return content;
    },
    setRet(ret){
        this.ret = ret;
    },
    setCard(card){
        this.card = card;
    },

});

module.exports.msg_rm_give_up_poker_ack = msg_rm_give_up_poker_ack;

let msg_rm_give_up_poker_broadcast = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.card = this.card;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setCard(card){
        this.card = card;
    },

});

module.exports.msg_rm_give_up_poker_broadcast = msg_rm_give_up_poker_broadcast;

let msg_rm_syn_giveup_poker = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.giveupCard = this.giveupCard;
        content.xcard = this.xcard;

        return content;
    },
    setGiveupCard(giveupCard){
        this.giveupCard = giveupCard;
    },
    setXcard(xcard){
        this.xcard = xcard;
    },

});

module.exports.msg_rm_syn_giveup_poker = msg_rm_syn_giveup_poker;

let rm_group = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.cardsList = this.cardsList;

        return content;
    },
    setCardsList(cardsList){
        this.cardsList = cardsList;
    },

});

module.exports.rm_group = rm_group;

let msg_rm_show_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.card = this.card;
        content.groupsList = this.groupsList;

        return content;
    },
    setCard(card){
        this.card = card;
    },
    setGroupsList(groupsList){
        this.groupsList = groupsList;
    },

});

module.exports.msg_rm_show_req = msg_rm_show_req;

let msg_rm_show_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.ret = this.ret;
        content.uid = this.uid;

        return content;
    },
    setRet(ret){
        this.ret = ret;
    },
    setUid(uid){
        this.uid = uid;
    },

});

module.exports.msg_rm_show_ack = msg_rm_show_ack;

let msg_rm_commit_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.groupsList = this.groupsList;

        return content;
    },
    setGroupsList(groupsList){
        this.groupsList = groupsList;
    },

});

module.exports.msg_rm_commit_req = msg_rm_commit_req;

let msg_rm_commit_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.ret = this.ret;

        return content;
    },
    setRet(ret){
        this.ret = ret;
    },

});

module.exports.msg_rm_commit_ack = msg_rm_commit_ack;

let msg_rm_sort_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_rm_sort_req = msg_rm_sort_req;

let msg_rm_sort_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.ret = this.ret;
        content.groupsList = this.groupsList;

        return content;
    },
    setRet(ret){
        this.ret = ret;
    },
    setGroupsList(groupsList){
        this.groupsList = groupsList;
    },

});

module.exports.msg_rm_sort_ack = msg_rm_sort_ack;

let msg_rm_drop_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_rm_drop_req = msg_rm_drop_req;

let msg_rm_drop_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.ret = this.ret;

        return content;
    },
    setRet(ret){
        this.ret = ret;
    },

});

module.exports.msg_rm_drop_ack = msg_rm_drop_ack;

let rm_result_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.userName = this.userName;
        content.headUrl = this.headUrl;
        content.score = this.score;
        content.coin = this.coin;
        content.allCoin = this.allCoin;
        content.groupsList = this.groupsList;
        content.xcard = this.xcard;
        content.isdrop = this.isdrop;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setUserName(userName){
        this.userName = userName;
    },
    setHeadUrl(headUrl){
        this.headUrl = headUrl;
    },
    setScore(score){
        this.score = score;
    },
    setCoin(coin){
        this.coin = coin;
    },
    setAllCoin(allCoin){
        this.allCoin = allCoin;
    },
    setGroupsList(groupsList){
        this.groupsList = groupsList;
    },
    setXcard(xcard){
        this.xcard = xcard;
    },
    setIsdrop(isdrop){
        this.isdrop = isdrop;
    },

});

module.exports.rm_result_info = rm_result_info;

let msg_rm_result = cc.Class({
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

module.exports.msg_rm_result = msg_rm_result;

