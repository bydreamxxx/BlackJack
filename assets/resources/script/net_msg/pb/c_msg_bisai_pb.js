let msg_challenge_round = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.lun = this.lun;
        content.ju = this.ju;

        return content;
    },
    setLun(lun){
        this.lun = lun;
    },
    setJu(ju){
        this.ju = ju;
    },

});

module.exports.msg_challenge_round = msg_challenge_round;

let msg_challenge_wait = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.desk = this.desk;

        return content;
    },
    setDesk(desk){
        this.desk = desk;
    },

});

module.exports.msg_challenge_wait = msg_challenge_wait;

let msg_challenge_result = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.win = this.win;
        content.moneyType = this.moneyType;
        content.moneyNum = this.moneyNum;
        content.rank = this.rank;

        return content;
    },
    setWin(win){
        this.win = win;
    },
    setMoneyType(moneyType){
        this.moneyType = moneyType;
    },
    setMoneyNum(moneyNum){
        this.moneyNum = moneyNum;
    },
    setRank(rank){
        this.rank = rank;
    },

});

module.exports.msg_challenge_result = msg_challenge_result;

let match_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.pointInit = this.pointInit;
        content.pointPlayer = this.pointPlayer;
        content.matchName = this.matchName;

        return content;
    },
    setPointInit(pointInit){
        this.pointInit = pointInit;
    },
    setPointPlayer(pointPlayer){
        this.pointPlayer = pointPlayer;
    },
    setMatchName(matchName){
        this.matchName = matchName;
    },

});

module.exports.match_info = match_info;

let match_round_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.type = this.type;
        content.outPoint = this.outPoint;
        content.juNum = this.juNum;
        content.upNum = this.upNum;
        content.reset = this.reset;

        return content;
    },
    setType(type){
        this.type = type;
    },
    setOutPoint(outPoint){
        this.outPoint = outPoint;
    },
    setJuNum(juNum){
        this.juNum = juNum;
    },
    setUpNum(upNum){
        this.upNum = upNum;
    },
    setReset(reset){
        this.reset = reset;
    },

});

module.exports.match_round_info = match_round_info;

let match_reward_item = cc.Class({
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

module.exports.match_reward_item = match_reward_item;

let match_reward_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.rankFrom = this.rankFrom;
        content.rankTo = this.rankTo;
        content.rewardListList = this.rewardListList;
        content.text = this.text;

        return content;
    },
    setRankFrom(rankFrom){
        this.rankFrom = rankFrom;
    },
    setRankTo(rankTo){
        this.rankTo = rankTo;
    },
    setRewardListList(rewardListList){
        this.rewardListList = rewardListList;
    },
    setText(text){
        this.text = text;
    },

});

module.exports.match_reward_info = match_reward_info;

let game_user_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userid = this.userid;
        content.name = this.name;
        content.headurl = this.headurl;
        content.sex = this.sex;
        content.type = this.type;
        content.hallId = this.hallId;
        content.token = this.token;
        content.openid = this.openid;
        content.level = this.level;
        content.exp = this.exp;
        content.vipLevel = this.vipLevel;

        return content;
    },
    setUserid(userid){
        this.userid = userid;
    },
    setName(name){
        this.name = name;
    },
    setHeadurl(headurl){
        this.headurl = headurl;
    },
    setSex(sex){
        this.sex = sex;
    },
    setType(type){
        this.type = type;
    },
    setHallId(hallId){
        this.hallId = hallId;
    },
    setToken(token){
        this.token = token;
    },
    setOpenid(openid){
        this.openid = openid;
    },
    setLevel(level){
        this.level = level;
    },
    setExp(exp){
        this.exp = exp;
    },
    setVipLevel(vipLevel){
        this.vipLevel = vipLevel;
    },

});

module.exports.game_user_info = game_user_info;

let msg_h2g_challenge_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.match = this.match;
        content.roundListList = this.roundListList;
        content.rewardListList = this.rewardListList;
        content.signUserListList = this.signUserListList;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setMatch(match){
        this.match = match;
    },
    setRoundListList(roundListList){
        this.roundListList = roundListList;
    },
    setRewardListList(rewardListList){
        this.rewardListList = rewardListList;
    },
    setSignUserListList(signUserListList){
        this.signUserListList = signUserListList;
    },

});

module.exports.msg_h2g_challenge_info = msg_h2g_challenge_info;

let hall_match_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.matchId = this.matchId;
        content.signFeeList = this.signFeeList;
        content.isSign = this.isSign;
        content.openSignNum = this.openSignNum;
        content.name = this.name;
        content.opentime = this.opentime;
        content.describe = this.describe;
        content.freeSignTimes = this.freeSignTimes;
        content.rewardListList = this.rewardListList;
        content.joinNum = this.joinNum;
        content.minCoinNum = this.minCoinNum;
        content.matchClass = this.matchClass;
        content.icon = this.icon;
        content.subType = this.subType;
        content.openseconds = this.openseconds;
        content.usedFreeSignTimes = this.usedFreeSignTimes;
        content.matchState = this.matchState;
        content.gameType = this.gameType;
        content.deadsigntime = this.deadsigntime;
        content.curRound = this.curRound;
        content.joinFeeList = this.joinFeeList;

        return content;
    },
    setMatchId(matchId){
        this.matchId = matchId;
    },
    setSignFeeList(signFeeList){
        this.signFeeList = signFeeList;
    },
    setIsSign(isSign){
        this.isSign = isSign;
    },
    setOpenSignNum(openSignNum){
        this.openSignNum = openSignNum;
    },
    setName(name){
        this.name = name;
    },
    setOpentime(opentime){
        this.opentime = opentime;
    },
    setDescribe(describe){
        this.describe = describe;
    },
    setFreeSignTimes(freeSignTimes){
        this.freeSignTimes = freeSignTimes;
    },
    setRewardListList(rewardListList){
        this.rewardListList = rewardListList;
    },
    setJoinNum(joinNum){
        this.joinNum = joinNum;
    },
    setMinCoinNum(minCoinNum){
        this.minCoinNum = minCoinNum;
    },
    setMatchClass(matchClass){
        this.matchClass = matchClass;
    },
    setIcon(icon){
        this.icon = icon;
    },
    setSubType(subType){
        this.subType = subType;
    },
    setOpenseconds(openseconds){
        this.openseconds = openseconds;
    },
    setUsedFreeSignTimes(usedFreeSignTimes){
        this.usedFreeSignTimes = usedFreeSignTimes;
    },
    setMatchState(matchState){
        this.matchState = matchState;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setDeadsigntime(deadsigntime){
        this.deadsigntime = deadsigntime;
    },
    setCurRound(curRound){
        this.curRound = curRound;
    },
    setJoinFeeList(joinFeeList){
        this.joinFeeList = joinFeeList;
    },

});

module.exports.hall_match_info = hall_match_info;

let msg_match_list_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.matchType = this.matchType;

        return content;
    },
    setMatchType(matchType){
        this.matchType = matchType;
    },

});

module.exports.msg_match_list_req = msg_match_list_req;

let msg_match_list_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.matchType = this.matchType;
        content.matchListList = this.matchListList;

        return content;
    },
    setMatchType(matchType){
        this.matchType = matchType;
    },
    setMatchListList(matchListList){
        this.matchListList = matchListList;
    },

});

module.exports.msg_match_list_ack = msg_match_list_ack;

let msg_update_match_free_times = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.matchId = this.matchId;
        content.usedFreeSignTimes = this.usedFreeSignTimes;

        return content;
    },
    setMatchId(matchId){
        this.matchId = matchId;
    },
    setUsedFreeSignTimes(usedFreeSignTimes){
        this.usedFreeSignTimes = usedFreeSignTimes;
    },

});

module.exports.msg_update_match_free_times = msg_update_match_free_times;

let msg_match_sign_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.matchId = this.matchId;
        content.matchPasswd = this.matchPasswd;

        return content;
    },
    setMatchId(matchId){
        this.matchId = matchId;
    },
    setMatchPasswd(matchPasswd){
        this.matchPasswd = matchPasswd;
    },

});

module.exports.msg_match_sign_req = msg_match_sign_req;

let msg_match_sign_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.matchType = this.matchType;
        content.matchId = this.matchId;
        content.header = this.header;

        return content;
    },
    setMatchType(matchType){
        this.matchType = matchType;
    },
    setMatchId(matchId){
        this.matchId = matchId;
    },
    setHeader(header){
        this.header = header;
    },

});

module.exports.msg_match_sign_ack = msg_match_sign_ack;

let msg_match_unsign_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.matchId = this.matchId;

        return content;
    },
    setMatchId(matchId){
        this.matchId = matchId;
    },

});

module.exports.msg_match_unsign_req = msg_match_unsign_req;

let msg_match_unsign_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.matchType = this.matchType;
        content.matchId = this.matchId;
        content.header = this.header;

        return content;
    },
    setMatchType(matchType){
        this.matchType = matchType;
    },
    setMatchId(matchId){
        this.matchId = matchId;
    },
    setHeader(header){
        this.header = header;
    },

});

module.exports.msg_match_unsign_ack = msg_match_unsign_ack;

let msg_update_match_num = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.matchType = this.matchType;
        content.matchId = this.matchId;
        content.num = this.num;
        content.joinNum = this.joinNum;

        return content;
    },
    setMatchType(matchType){
        this.matchType = matchType;
    },
    setMatchId(matchId){
        this.matchId = matchId;
    },
    setNum(num){
        this.num = num;
    },
    setJoinNum(joinNum){
        this.joinNum = joinNum;
    },

});

module.exports.msg_update_match_num = msg_update_match_num;

let msg_match_beginning = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.ip = this.ip;
        content.port = this.port;
        content.token = this.token;
        content.gameType = this.gameType;

        return content;
    },
    setIp(ip){
        this.ip = ip;
    },
    setPort(port){
        this.port = port;
    },
    setToken(token){
        this.token = token;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },

});

module.exports.msg_match_beginning = msg_match_beginning;

let msg_get_match_signed_num_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.matchId = this.matchId;

        return content;
    },
    setMatchId(matchId){
        this.matchId = matchId;
    },

});

module.exports.msg_get_match_signed_num_req = msg_get_match_signed_num_req;

let msg_get_match_signed_num_ack = cc.Class({
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

module.exports.msg_get_match_signed_num_ack = msg_get_match_signed_num_ack;

let challenge_user_result = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userid = this.userid;
        content.rank = this.rank;

        return content;
    },
    setUserid(userid){
        this.userid = userid;
    },
    setRank(rank){
        this.rank = rank;
    },

});

module.exports.challenge_user_result = challenge_user_result;

let msg_g2h_challenge_result_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.resultList = this.resultList;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setResultList(resultList){
        this.resultList = resultList;
    },

});

module.exports.msg_g2h_challenge_result_info = msg_g2h_challenge_result_info;

let msg_update_match_state = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.matchId = this.matchId;
        content.matchState = this.matchState;

        return content;
    },
    setMatchId(matchId){
        this.matchId = matchId;
    },
    setMatchState(matchState){
        this.matchState = matchState;
    },

});

module.exports.msg_update_match_state = msg_update_match_state;

let msg_coin_room_drop_reward = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.itemListList = this.itemListList;

        return content;
    },
    setItemListList(itemListList){
        this.itemListList = itemListList;
    },

});

module.exports.msg_coin_room_drop_reward = msg_coin_room_drop_reward;

let msg_match_info_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.matchId = this.matchId;

        return content;
    },
    setMatchId(matchId){
        this.matchId = matchId;
    },

});

module.exports.msg_match_info_req = msg_match_info_req;

let msg_match_info_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.matchInfo = this.matchInfo;

        return content;
    },
    setMatchInfo(matchInfo){
        this.matchInfo = matchInfo;
    },

});

module.exports.msg_match_info_ret = msg_match_info_ret;

