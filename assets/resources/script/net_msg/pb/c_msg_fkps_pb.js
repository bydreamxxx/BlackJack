let fkps_battle = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.isokList = this.isokList;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setIsokList(isokList){
        this.isokList = isokList;
    },

});

module.exports.fkps_battle = fkps_battle;

let fkps_pokers = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.isWinBanker = this.isWinBanker;
        content.pokerType = this.pokerType;
        content.pokersList = this.pokersList;
        content.kingsList = this.kingsList;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setIsWinBanker(isWinBanker){
        this.isWinBanker = isWinBanker;
    },
    setPokerType(pokerType){
        this.pokerType = pokerType;
    },
    setPokersList(pokersList){
        this.pokersList = pokersList;
    },
    setKingsList(kingsList){
        this.kingsList = kingsList;
    },

});

module.exports.fkps_pokers = fkps_pokers;

let fkps_beted = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.sum = this.sum;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setSum(sum){
        this.sum = sum;
    },

});

module.exports.fkps_beted = fkps_beted;

let msg_fkps_resume_state_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.roomState = this.roomState;
        content.leftTime = this.leftTime;
        content.reqBankerSum = this.reqBankerSum;
        content.bankerTimes = this.bankerTimes;
        content.isJoin = this.isJoin;
        content.betedList = this.betedList;
        content.myBetedList = this.myBetedList;
        content.pokersList = this.pokersList;
        content.battleInfoList = this.battleInfoList;
        content.bankersList = this.bankersList;

        return content;
    },
    setRoomState(roomState){
        this.roomState = roomState;
    },
    setLeftTime(leftTime){
        this.leftTime = leftTime;
    },
    setReqBankerSum(reqBankerSum){
        this.reqBankerSum = reqBankerSum;
    },
    setBankerTimes(bankerTimes){
        this.bankerTimes = bankerTimes;
    },
    setIsJoin(isJoin){
        this.isJoin = isJoin;
    },
    setBetedList(betedList){
        this.betedList = betedList;
    },
    setMyBetedList(myBetedList){
        this.myBetedList = myBetedList;
    },
    setPokersList(pokersList){
        this.pokersList = pokersList;
    },
    setBattleInfoList(battleInfoList){
        this.battleInfoList = battleInfoList;
    },
    setBankersList(bankersList){
        this.bankersList = bankersList;
    },

});

module.exports.msg_fkps_resume_state_2c = msg_fkps_resume_state_2c;

let msg_fkps_state_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.roomState = this.roomState;

        return content;
    },
    setRoomState(roomState){
        this.roomState = roomState;
    },

});

module.exports.msg_fkps_state_2c = msg_fkps_state_2c;

let fkps_bet_2s = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.bet = this.bet;
        content.betId = this.betId;

        return content;
    },
    setBet(bet){
        this.bet = bet;
    },
    setBetId(betId){
        this.betId = betId;
    },

});

module.exports.fkps_bet_2s = fkps_bet_2s;

let fkps_bet_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.result = this.result;
        content.betId = this.betId;
        content.betAdd = this.betAdd;
        content.beted = this.beted;

        return content;
    },
    setResult(result){
        this.result = result;
    },
    setBetId(betId){
        this.betId = betId;
    },
    setBetAdd(betAdd){
        this.betAdd = betAdd;
    },
    setBeted(beted){
        this.beted = beted;
    },

});

module.exports.fkps_bet_2c = fkps_bet_2c;

let fkps_bet_broadcast = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.betId = this.betId;
        content.betAdd = this.betAdd;
        content.beted = this.beted;

        return content;
    },
    setBetId(betId){
        this.betId = betId;
    },
    setBetAdd(betAdd){
        this.betAdd = betAdd;
    },
    setBeted(beted){
        this.beted = beted;
    },

});

module.exports.fkps_bet_broadcast = fkps_bet_broadcast;

let fkps_req_banker_2s = cc.Class({
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

module.exports.fkps_req_banker_2s = fkps_req_banker_2s;

let fkps_req_banker_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.result = this.result;
        content.type = this.type;
        content.num = this.num;

        return content;
    },
    setResult(result){
        this.result = result;
    },
    setType(type){
        this.type = type;
    },
    setNum(num){
        this.num = num;
    },

});

module.exports.fkps_req_banker_2c = fkps_req_banker_2c;

let fkps_req_banker_sum_broadcast = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.sum = this.sum;

        return content;
    },
    setSum(sum){
        this.sum = sum;
    },

});

module.exports.fkps_req_banker_sum_broadcast = fkps_req_banker_sum_broadcast;

let fkps_req_banker_num_broadcast = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.num = this.num;

        return content;
    },
    setNum(num){
        this.num = num;
    },

});

module.exports.fkps_req_banker_num_broadcast = fkps_req_banker_num_broadcast;

let fkps_banker_add_2c = cc.Class({
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

module.exports.fkps_banker_add_2c = fkps_banker_add_2c;

let fkps_banker_del_2c = cc.Class({
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

module.exports.fkps_banker_del_2c = fkps_banker_del_2c;

let fkps_banker_lists = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.idList = this.idList;

        return content;
    },
    setIdList(idList){
        this.idList = idList;
    },

});

module.exports.fkps_banker_lists = fkps_banker_lists;

let fkps_winer = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.sum = this.sum;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setSum(sum){
        this.sum = sum;
    },

});

module.exports.fkps_winer = fkps_winer;

let fkps_battle_lists = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.infoList = this.infoList;

        return content;
    },
    setInfoList(infoList){
        this.infoList = infoList;
    },

});

module.exports.fkps_battle_lists = fkps_battle_lists;

let fkps_result = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.sum = this.sum;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setSum(sum){
        this.sum = sum;
    },

});

module.exports.fkps_result = fkps_result;

let fkps_results_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.meList = this.meList;
        content.winersList = this.winersList;
        content.pokersList = this.pokersList;

        return content;
    },
    setMeList(meList){
        this.meList = meList;
    },
    setWinersList(winersList){
        this.winersList = winersList;
    },
    setPokersList(pokersList){
        this.pokersList = pokersList;
    },

});

module.exports.fkps_results_2c = fkps_results_2c;

