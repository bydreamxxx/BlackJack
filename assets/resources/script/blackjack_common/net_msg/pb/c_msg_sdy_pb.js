let sdy_user_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.name = this.name;
        content.headUrl = this.headUrl;
        content.openId = this.openId;
        content.sex = this.sex;
        content.coin = this.coin;
        content.seat = this.seat;
        content.callScore = this.callScore;
        content.banker = this.banker;
        content.pokersNum = this.pokersNum;
        content.pokersList = this.pokersList;
        content.curSendPoker = this.curSendPoker;
        content.isAuto = this.isAuto;
        content.isRobot = this.isRobot;
        content.isContinue = this.isContinue;
        content.isAgree = this.isAgree;
        content.state = this.state;
        content.winTimes = this.winTimes;
        content.totalTimes = this.totalTimes;

        return content;
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
    setSex(sex){
        this.sex = sex;
    },
    setCoin(coin){
        this.coin = coin;
    },
    setSeat(seat){
        this.seat = seat;
    },
    setCallScore(callScore){
        this.callScore = callScore;
    },
    setBanker(banker){
        this.banker = banker;
    },
    setPokersNum(pokersNum){
        this.pokersNum = pokersNum;
    },
    setPokersList(pokersList){
        this.pokersList = pokersList;
    },
    setCurSendPoker(curSendPoker){
        this.curSendPoker = curSendPoker;
    },
    setIsAuto(isAuto){
        this.isAuto = isAuto;
    },
    setIsRobot(isRobot){
        this.isRobot = isRobot;
    },
    setIsContinue(isContinue){
        this.isContinue = isContinue;
    },
    setIsAgree(isAgree){
        this.isAgree = isAgree;
    },
    setState(state){
        this.state = state;
    },
    setWinTimes(winTimes){
        this.winTimes = winTimes;
    },
    setTotalTimes(totalTimes){
        this.totalTimes = totalTimes;
    },

});

module.exports.sdy_user_info = sdy_user_info;

let sdy_room_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameType = this.gameType;
        content.ownerId = this.ownerId;
        content.roomId = this.roomId;
        content.roomConfigId = this.roomConfigId;
        content.maxNum = this.maxNum;
        content.curCircle = this.curCircle;
        content.maxCircle = this.maxCircle;
        content.state = this.state;
        content.curOp = this.curOp;
        content.callScoreTimeout = this.callScoreTimeout;
        content.colorTimeout = this.colorTimeout;
        content.baseTimeout = this.baseTimeout;
        content.timeout = this.timeout;
        content.circleColor = this.circleColor;
        content.circleUserId = this.circleUserId;
        content.voteTimeout = this.voteTimeout;

        return content;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setOwnerId(ownerId){
        this.ownerId = ownerId;
    },
    setRoomId(roomId){
        this.roomId = roomId;
    },
    setRoomConfigId(roomConfigId){
        this.roomConfigId = roomConfigId;
    },
    setMaxNum(maxNum){
        this.maxNum = maxNum;
    },
    setCurCircle(curCircle){
        this.curCircle = curCircle;
    },
    setMaxCircle(maxCircle){
        this.maxCircle = maxCircle;
    },
    setState(state){
        this.state = state;
    },
    setCurOp(curOp){
        this.curOp = curOp;
    },
    setCallScoreTimeout(callScoreTimeout){
        this.callScoreTimeout = callScoreTimeout;
    },
    setColorTimeout(colorTimeout){
        this.colorTimeout = colorTimeout;
    },
    setBaseTimeout(baseTimeout){
        this.baseTimeout = baseTimeout;
    },
    setTimeout(timeout){
        this.timeout = timeout;
    },
    setCircleColor(circleColor){
        this.circleColor = circleColor;
    },
    setCircleUserId(circleUserId){
        this.circleUserId = circleUserId;
    },
    setVoteTimeout(voteTimeout){
        this.voteTimeout = voteTimeout;
    },

});

module.exports.sdy_room_info = sdy_room_info;

let sdy_op_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.opType = this.opType;
        content.timeout = this.timeout;
        content.scoreListList = this.scoreListList;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setOpType(opType){
        this.opType = opType;
    },
    setTimeout(timeout){
        this.timeout = timeout;
    },
    setScoreListList(scoreListList){
        this.scoreListList = scoreListList;
    },

});

module.exports.sdy_op_info = sdy_op_info;

let sdy_base_pokers_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.callScore = this.callScore;
        content.keyPoker = this.keyPoker;
        content.pokersList = this.pokersList;
        content.scorePokersList = this.scorePokersList;
        content.type = this.type;

        return content;
    },
    setCallScore(callScore){
        this.callScore = callScore;
    },
    setKeyPoker(keyPoker){
        this.keyPoker = keyPoker;
    },
    setPokersList(pokersList){
        this.pokersList = pokersList;
    },
    setScorePokersList(scorePokersList){
        this.scorePokersList = scorePokersList;
    },
    setType(type){
        this.type = type;
    },

});

module.exports.sdy_base_pokers_info = sdy_base_pokers_info;

let msg_sdy_room_init = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.type = this.type;
        content.roomInfo = this.roomInfo;
        content.userInfoList = this.userInfoList;
        content.basePokersInfo = this.basePokersInfo;

        return content;
    },
    setType(type){
        this.type = type;
    },
    setRoomInfo(roomInfo){
        this.roomInfo = roomInfo;
    },
    setUserInfoList(userInfoList){
        this.userInfoList = userInfoList;
    },
    setBasePokersInfo(basePokersInfo){
        this.basePokersInfo = basePokersInfo;
    },

});

module.exports.msg_sdy_room_init = msg_sdy_room_init;

let msg_sdy_call_score_req = cc.Class({
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

module.exports.msg_sdy_call_score_req = msg_sdy_call_score_req;

let msg_sdy_call_score_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.userId = this.userId;
        content.score = this.score;
        content.state = this.state;
        content.nextUserId = this.nextUserId;
        content.scoreListList = this.scoreListList;
        content.callScoreTimeout = this.callScoreTimeout;
        content.bankerId = this.bankerId;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setScore(score){
        this.score = score;
    },
    setState(state){
        this.state = state;
    },
    setNextUserId(nextUserId){
        this.nextUserId = nextUserId;
    },
    setScoreListList(scoreListList){
        this.scoreListList = scoreListList;
    },
    setCallScoreTimeout(callScoreTimeout){
        this.callScoreTimeout = callScoreTimeout;
    },
    setBankerId(bankerId){
        this.bankerId = bankerId;
    },

});

module.exports.msg_sdy_call_score_ret = msg_sdy_call_score_ret;

let msg_sdy_deal_bottom = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.pokersList = this.pokersList;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setPokersList(pokersList){
        this.pokersList = pokersList;
    },

});

module.exports.msg_sdy_deal_bottom = msg_sdy_deal_bottom;

let msg_sdy_deal = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.pokersList = this.pokersList;
        content.callScoreUserId = this.callScoreUserId;
        content.scoreListList = this.scoreListList;
        content.curCircle = this.curCircle;

        return content;
    },
    setPokersList(pokersList){
        this.pokersList = pokersList;
    },
    setCallScoreUserId(callScoreUserId){
        this.callScoreUserId = callScoreUserId;
    },
    setScoreListList(scoreListList){
        this.scoreListList = scoreListList;
    },
    setCurCircle(curCircle){
        this.curCircle = curCircle;
    },

});

module.exports.msg_sdy_deal = msg_sdy_deal;

let msg_sdy_choice_color_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.color = this.color;

        return content;
    },
    setColor(color){
        this.color = color;
    },

});

module.exports.msg_sdy_choice_color_req = msg_sdy_choice_color_req;

let msg_sdy_choice_color_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.color = this.color;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setColor(color){
        this.color = color;
    },

});

module.exports.msg_sdy_choice_color_ret = msg_sdy_choice_color_ret;

let msg_sdy_kou_pokers_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.pokersList = this.pokersList;

        return content;
    },
    setPokersList(pokersList){
        this.pokersList = pokersList;
    },

});

module.exports.msg_sdy_kou_pokers_req = msg_sdy_kou_pokers_req;

let msg_sdy_kou_pokers_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.userId = this.userId;
        content.pokersList = this.pokersList;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setPokersList(pokersList){
        this.pokersList = pokersList;
    },

});

module.exports.msg_sdy_kou_pokers_ret = msg_sdy_kou_pokers_ret;

let msg_sdy_user_poker_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.poker = this.poker;

        return content;
    },
    setPoker(poker){
        this.poker = poker;
    },

});

module.exports.msg_sdy_user_poker_req = msg_sdy_user_poker_req;

let msg_sdy_user_poker_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.userId = this.userId;
        content.poker = this.poker;
        content.nextUserId = this.nextUserId;
        content.color = this.color;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setPoker(poker){
        this.poker = poker;
    },
    setNextUserId(nextUserId){
        this.nextUserId = nextUserId;
    },
    setColor(color){
        this.color = color;
    },

});

module.exports.msg_sdy_user_poker_ret = msg_sdy_user_poker_ret;

let msg_sdy_score_pokers = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.type = this.type;
        content.pokersList = this.pokersList;

        return content;
    },
    setType(type){
        this.type = type;
    },
    setPokersList(pokersList){
        this.pokersList = pokersList;
    },

});

module.exports.msg_sdy_score_pokers = msg_sdy_score_pokers;

let msg_sdy_auto_req = cc.Class({
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

module.exports.msg_sdy_auto_req = msg_sdy_auto_req;

let msg_sdy_auto_ret = cc.Class({
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

module.exports.msg_sdy_auto_ret = msg_sdy_auto_ret;

let sdy_result_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.score = this.score;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setScore(score){
        this.score = score;
    },

});

module.exports.sdy_result_info = sdy_result_info;

let sdy_win_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.type = this.type;
        content.value = this.value;

        return content;
    },
    setType(type){
        this.type = type;
    },
    setValue(value){
        this.value = value;
    },

});

module.exports.sdy_win_info = sdy_win_info;

let msg_sdy_result = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.winType = this.winType;
        content.winInfoList = this.winInfoList;
        content.resultInfoList = this.resultInfoList;

        return content;
    },
    setWinType(winType){
        this.winType = winType;
    },
    setWinInfoList(winInfoList){
        this.winInfoList = winInfoList;
    },
    setResultInfoList(resultInfoList){
        this.resultInfoList = resultInfoList;
    },

});

module.exports.msg_sdy_result = msg_sdy_result;

let msg_sdy_continue_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_sdy_continue_req = msg_sdy_continue_req;

let msg_sdy_continue_ret = cc.Class({
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

module.exports.msg_sdy_continue_ret = msg_sdy_continue_ret;

let msg_sdy_dissolve_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_sdy_dissolve_req = msg_sdy_dissolve_req;

let msg_sdy_dissolve_ret = cc.Class({
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

module.exports.msg_sdy_dissolve_ret = msg_sdy_dissolve_ret;

let msg_sdy_vote_dissolve_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.agree = this.agree;

        return content;
    },
    setAgree(agree){
        this.agree = agree;
    },

});

module.exports.msg_sdy_vote_dissolve_req = msg_sdy_vote_dissolve_req;

let msg_sdy_vote_dissolve_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.agree = this.agree;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setAgree(agree){
        this.agree = agree;
    },

});

module.exports.msg_sdy_vote_dissolve_ret = msg_sdy_vote_dissolve_ret;

let sdy_friend_result_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.zhuangChengPai = this.zhuangChengPai;
        content.zhuangGuangPai = this.zhuangGuangPai;
        content.beiPoPai = this.beiPoPai;
        content.beiShangChe = this.beiShangChe;
        content.score = this.score;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setZhuangChengPai(zhuangChengPai){
        this.zhuangChengPai = zhuangChengPai;
    },
    setZhuangGuangPai(zhuangGuangPai){
        this.zhuangGuangPai = zhuangGuangPai;
    },
    setBeiPoPai(beiPoPai){
        this.beiPoPai = beiPoPai;
    },
    setBeiShangChe(beiShangChe){
        this.beiShangChe = beiShangChe;
    },
    setScore(score){
        this.score = score;
    },

});

module.exports.sdy_friend_result_info = sdy_friend_result_info;

let msg_sdy_friend_result = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.friendResultList = this.friendResultList;
        content.time = this.time;

        return content;
    },
    setFriendResultList(friendResultList){
        this.friendResultList = friendResultList;
    },
    setTime(time){
        this.time = time;
    },

});

module.exports.msg_sdy_friend_result = msg_sdy_friend_result;

