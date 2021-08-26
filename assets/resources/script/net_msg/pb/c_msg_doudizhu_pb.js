let ddz_desk_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.ownerId = this.ownerId;
        content.password = this.password;
        content.curCircle = this.curCircle;
        content.gameType = this.gameType;
        content.baseScore = this.baseScore;
        content.outScore = this.outScore;
        content.deskStatus = this.deskStatus;
        content.deskRule = this.deskRule;
        content.callScoreTimeout = this.callScoreTimeout;
        content.doubleTimeout = this.doubleTimeout;
        content.playTimeoutList = this.playTimeoutList;
        content.maxCircle = this.maxCircle;
        content.startTimestamp = this.startTimestamp;
        content.dissolveTimeout = this.dissolveTimeout;
        content.xyDeskRule = this.xyDeskRule;

        return content;
    },
    setOwnerId(ownerId){
        this.ownerId = ownerId;
    },
    setPassword(password){
        this.password = password;
    },
    setCurCircle(curCircle){
        this.curCircle = curCircle;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setBaseScore(baseScore){
        this.baseScore = baseScore;
    },
    setOutScore(outScore){
        this.outScore = outScore;
    },
    setDeskStatus(deskStatus){
        this.deskStatus = deskStatus;
    },
    setDeskRule(deskRule){
        this.deskRule = deskRule;
    },
    setCallScoreTimeout(callScoreTimeout){
        this.callScoreTimeout = callScoreTimeout;
    },
    setDoubleTimeout(doubleTimeout){
        this.doubleTimeout = doubleTimeout;
    },
    setPlayTimeoutList(playTimeoutList){
        this.playTimeoutList = playTimeoutList;
    },
    setMaxCircle(maxCircle){
        this.maxCircle = maxCircle;
    },
    setStartTimestamp(startTimestamp){
        this.startTimestamp = startTimestamp;
    },
    setDissolveTimeout(dissolveTimeout){
        this.dissolveTimeout = dissolveTimeout;
    },
    setXyDeskRule(xyDeskRule){
        this.xyDeskRule = xyDeskRule;
    },

});

module.exports.ddz_desk_info = ddz_desk_info;

let ddz_player_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.score = this.score;
        content.site = this.site;
        content.isDouble = this.isDouble;
        content.isAuto = this.isAuto;
        content.identify = this.identify;
        content.handPokerNum = this.handPokerNum;
        content.isChangePoker = this.isChangePoker;
        content.isPrepared = this.isPrepared;
        content.callScore = this.callScore;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setScore(score){
        this.score = score;
    },
    setSite(site){
        this.site = site;
    },
    setIsDouble(isDouble){
        this.isDouble = isDouble;
    },
    setIsAuto(isAuto){
        this.isAuto = isAuto;
    },
    setIdentify(identify){
        this.identify = identify;
    },
    setHandPokerNum(handPokerNum){
        this.handPokerNum = handPokerNum;
    },
    setIsChangePoker(isChangePoker){
        this.isChangePoker = isChangePoker;
    },
    setIsPrepared(isPrepared){
        this.isPrepared = isPrepared;
    },
    setCallScore(callScore){
        this.callScore = callScore;
    },

});

module.exports.ddz_player_info = ddz_player_info;

let ddz_room_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.deskInfo = this.deskInfo;
        content.playerInfoList = this.playerInfoList;
        content.curRound = this.curRound;

        return content;
    },
    setDeskInfo(deskInfo){
        this.deskInfo = deskInfo;
    },
    setPlayerInfoList(playerInfoList){
        this.playerInfoList = playerInfoList;
    },
    setCurRound(curRound){
        this.curRound = curRound;
    },

});

module.exports.ddz_room_info = ddz_room_info;

let ddz_reconnect_room_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.deskInfo = this.deskInfo;
        content.deskFan = this.deskFan;
        content.curPlayer = this.curPlayer;
        content.timeout = this.timeout;
        content.playerInfoList = this.playerInfoList;
        content.handPokersList = this.handPokersList;
        content.bottomPokersList = this.bottomPokersList;
        content.recentPlayList = this.recentPlayList;
        content.curCallScore = this.curCallScore;
        content.curZhaDanNum = this.curZhaDanNum;
        content.bottomPokersTimes = this.bottomPokersTimes;
        content.configRoomId = this.configRoomId;
        content.playedPokersList = this.playedPokersList;
        content.changePokerList = this.changePokerList;
        content.stackedList = this.stackedList;
        content.dissolveInfoList = this.dissolveInfoList;
        content.isWxShared = this.isWxShared;

        return content;
    },
    setDeskInfo(deskInfo){
        this.deskInfo = deskInfo;
    },
    setDeskFan(deskFan){
        this.deskFan = deskFan;
    },
    setCurPlayer(curPlayer){
        this.curPlayer = curPlayer;
    },
    setTimeout(timeout){
        this.timeout = timeout;
    },
    setPlayerInfoList(playerInfoList){
        this.playerInfoList = playerInfoList;
    },
    setHandPokersList(handPokersList){
        this.handPokersList = handPokersList;
    },
    setBottomPokersList(bottomPokersList){
        this.bottomPokersList = bottomPokersList;
    },
    setRecentPlayList(recentPlayList){
        this.recentPlayList = recentPlayList;
    },
    setCurCallScore(curCallScore){
        this.curCallScore = curCallScore;
    },
    setCurZhaDanNum(curZhaDanNum){
        this.curZhaDanNum = curZhaDanNum;
    },
    setBottomPokersTimes(bottomPokersTimes){
        this.bottomPokersTimes = bottomPokersTimes;
    },
    setConfigRoomId(configRoomId){
        this.configRoomId = configRoomId;
    },
    setPlayedPokersList(playedPokersList){
        this.playedPokersList = playedPokersList;
    },
    setChangePokerList(changePokerList){
        this.changePokerList = changePokerList;
    },
    setStackedList(stackedList){
        this.stackedList = stackedList;
    },
    setDissolveInfoList(dissolveInfoList){
        this.dissolveInfoList = dissolveInfoList;
    },
    setIsWxShared(isWxShared){
        this.isWxShared = isWxShared;
    },

});

module.exports.ddz_reconnect_room_info = ddz_reconnect_room_info;

let ddz_update_desk_status = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.deskStatus = this.deskStatus;
        content.curPlayer = this.curPlayer;

        return content;
    },
    setDeskStatus(deskStatus){
        this.deskStatus = deskStatus;
    },
    setCurPlayer(curPlayer){
        this.curPlayer = curPlayer;
    },

});

module.exports.ddz_update_desk_status = ddz_update_desk_status;

let ddz_update_base_score = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.baseScore = this.baseScore;
        content.outScore = this.outScore;

        return content;
    },
    setBaseScore(baseScore){
        this.baseScore = baseScore;
    },
    setOutScore(outScore){
        this.outScore = outScore;
    },

});

module.exports.ddz_update_base_score = ddz_update_base_score;

let ddz_stack_poker_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.stack = this.stack;

        return content;
    },
    setStack(stack){
        this.stack = stack;
    },

});

module.exports.ddz_stack_poker_req = ddz_stack_poker_req;

let ddz_stack_poker_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.stack = this.stack;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setStack(stack){
        this.stack = stack;
    },

});

module.exports.ddz_stack_poker_ack = ddz_stack_poker_ack;

let ddz_hand_poker_list = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.handPokersList = this.handPokersList;

        return content;
    },
    setHandPokersList(handPokersList){
        this.handPokersList = handPokersList;
    },

});

module.exports.ddz_hand_poker_list = ddz_hand_poker_list;

let ddz_change_poker_req = cc.Class({
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

module.exports.ddz_change_poker_req = ddz_change_poker_req;

let ddz_change_poker_ack = cc.Class({
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

module.exports.ddz_change_poker_ack = ddz_change_poker_ack;

let ddz_change_poker_result = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.isClockwise = this.isClockwise;
        content.pokersList = this.pokersList;

        return content;
    },
    setIsClockwise(isClockwise){
        this.isClockwise = isClockwise;
    },
    setPokersList(pokersList){
        this.pokersList = pokersList;
    },

});

module.exports.ddz_change_poker_result = ddz_change_poker_result;

let ddz_call_score_req = cc.Class({
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

module.exports.ddz_call_score_req = ddz_call_score_req;

let ddz_call_score_ack = cc.Class({
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

module.exports.ddz_call_score_ack = ddz_call_score_ack;

let ddz_call_score_result = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.bottomPokersList = this.bottomPokersList;
        content.landholderId = this.landholderId;
        content.bottomPokersTimes = this.bottomPokersTimes;

        return content;
    },
    setBottomPokersList(bottomPokersList){
        this.bottomPokersList = bottomPokersList;
    },
    setLandholderId(landholderId){
        this.landholderId = landholderId;
    },
    setBottomPokersTimes(bottomPokersTimes){
        this.bottomPokersTimes = bottomPokersTimes;
    },

});

module.exports.ddz_call_score_result = ddz_call_score_result;

let ddz_double_score_req = cc.Class({
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

module.exports.ddz_double_score_req = ddz_double_score_req;

let ddz_double_score_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.isDouble = this.isDouble;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setIsDouble(isDouble){
        this.isDouble = isDouble;
    },

});

module.exports.ddz_double_score_ack = ddz_double_score_ack;

let ddz_play_role_score_change_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.changeScore = this.changeScore;
        content.isDouble = this.isDouble;
        content.leftHandPokerList = this.leftHandPokerList;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setChangeScore(changeScore){
        this.changeScore = changeScore;
    },
    setIsDouble(isDouble){
        this.isDouble = isDouble;
    },
    setLeftHandPokerList(leftHandPokerList){
        this.leftHandPokerList = leftHandPokerList;
    },

});

module.exports.ddz_play_role_score_change_info = ddz_play_role_score_change_info;

let ddz_play_result = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.zhadanNum = this.zhadanNum;
        content.isGod = this.isGod;
        content.bottomPokersTimes = this.bottomPokersTimes;
        content.changeListList = this.changeListList;
        content.roundType = this.roundType;
        content.leftDeskNum = this.leftDeskNum;

        return content;
    },
    setZhadanNum(zhadanNum){
        this.zhadanNum = zhadanNum;
    },
    setIsGod(isGod){
        this.isGod = isGod;
    },
    setBottomPokersTimes(bottomPokersTimes){
        this.bottomPokersTimes = bottomPokersTimes;
    },
    setChangeListList(changeListList){
        this.changeListList = changeListList;
    },
    setRoundType(roundType){
        this.roundType = roundType;
    },
    setLeftDeskNum(leftDeskNum){
        this.leftDeskNum = leftDeskNum;
    },

});

module.exports.ddz_play_result = ddz_play_result;

let ddz_player_offline_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.isOffline = this.isOffline;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setIsOffline(isOffline){
        this.isOffline = isOffline;
    },

});

module.exports.ddz_player_offline_ack = ddz_player_offline_ack;

let ddz_player_auto_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.isAuto = this.isAuto;

        return content;
    },
    setIsAuto(isAuto){
        this.isAuto = isAuto;
    },

});

module.exports.ddz_player_auto_req = ddz_player_auto_req;

let ddz_player_auto_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.isAuto = this.isAuto;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setIsAuto(isAuto){
        this.isAuto = isAuto;
    },

});

module.exports.ddz_player_auto_ack = ddz_player_auto_ack;

let ddz_play_poker_req = cc.Class({
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

module.exports.ddz_play_poker_req = ddz_play_poker_req;

let ddz_play_poker_ack = cc.Class({
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

module.exports.ddz_play_poker_ack = ddz_play_poker_ack;

let ddz_reconnect_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.ddz_reconnect_req = ddz_reconnect_req;

let ddz_get_all_poker_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.ddz_get_all_poker_req = ddz_get_all_poker_req;

let ddz_role_poker_info = cc.Class({
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

module.exports.ddz_role_poker_info = ddz_role_poker_info;

let ddz_get_all_poker_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.rolePokerList = this.rolePokerList;

        return content;
    },
    setRolePokerList(rolePokerList){
        this.rolePokerList = rolePokerList;
    },

});

module.exports.ddz_get_all_poker_ack = ddz_get_all_poker_ack;

let ddz_record_user_change_poker = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.selectPokersList = this.selectPokersList;
        content.resultPokersList = this.resultPokersList;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setSelectPokersList(selectPokersList){
        this.selectPokersList = selectPokersList;
    },
    setResultPokersList(resultPokersList){
        this.resultPokersList = resultPokersList;
    },

});

module.exports.ddz_record_user_change_poker = ddz_record_user_change_poker;

let ddz_record_change_poker = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.isClockwise = this.isClockwise;
        content.changeInfoList = this.changeInfoList;

        return content;
    },
    setIsClockwise(isClockwise){
        this.isClockwise = isClockwise;
    },
    setChangeInfoList(changeInfoList){
        this.changeInfoList = changeInfoList;
    },

});

module.exports.ddz_record_change_poker = ddz_record_change_poker;

let ddz_friend_last_player_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.winTimes = this.winTimes;
        content.loseTimes = this.loseTimes;
        content.lastScore = this.lastScore;
        content.topScore = this.topScore;
        content.isCreator = this.isCreator;
        content.farmerTimes = this.farmerTimes;
        content.landholderTimes = this.landholderTimes;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setWinTimes(winTimes){
        this.winTimes = winTimes;
    },
    setLoseTimes(loseTimes){
        this.loseTimes = loseTimes;
    },
    setLastScore(lastScore){
        this.lastScore = lastScore;
    },
    setTopScore(topScore){
        this.topScore = topScore;
    },
    setIsCreator(isCreator){
        this.isCreator = isCreator;
    },
    setFarmerTimes(farmerTimes){
        this.farmerTimes = farmerTimes;
    },
    setLandholderTimes(landholderTimes){
        this.landholderTimes = landholderTimes;
    },

});

module.exports.ddz_friend_last_player_info = ddz_friend_last_player_info;

let ddz_friend_last_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.playerInfoList = this.playerInfoList;

        return content;
    },
    setPlayerInfoList(playerInfoList){
        this.playerInfoList = playerInfoList;
    },

});

module.exports.ddz_friend_last_info = ddz_friend_last_info;

let ddz_control_poker_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.controlLevel = this.controlLevel;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setControlLevel(controlLevel){
        this.controlLevel = controlLevel;
    },

});

module.exports.ddz_control_poker_info = ddz_control_poker_info;

let record_player_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.nickName = this.nickName;
        content.sex = this.sex;
        content.headUrl = this.headUrl;
        content.score = this.score;
        content.site = this.site;
        content.identify = this.identify;
        content.openId = this.openId;
        content.handPokerList = this.handPokerList;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setNickName(nickName){
        this.nickName = nickName;
    },
    setSex(sex){
        this.sex = sex;
    },
    setHeadUrl(headUrl){
        this.headUrl = headUrl;
    },
    setScore(score){
        this.score = score;
    },
    setSite(site){
        this.site = site;
    },
    setIdentify(identify){
        this.identify = identify;
    },
    setOpenId(openId){
        this.openId = openId;
    },
    setHandPokerList(handPokerList){
        this.handPokerList = handPokerList;
    },

});

module.exports.record_player_info = record_player_info;

let record_desk_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.ownerId = this.ownerId;
        content.password = this.password;
        content.curCircle = this.curCircle;
        content.gameType = this.gameType;
        content.baseScore = this.baseScore;
        content.deskStatus = this.deskStatus;
        content.deskRule = this.deskRule;
        content.maxCircle = this.maxCircle;
        content.startTimestamp = this.startTimestamp;

        return content;
    },
    setOwnerId(ownerId){
        this.ownerId = ownerId;
    },
    setPassword(password){
        this.password = password;
    },
    setCurCircle(curCircle){
        this.curCircle = curCircle;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setBaseScore(baseScore){
        this.baseScore = baseScore;
    },
    setDeskStatus(deskStatus){
        this.deskStatus = deskStatus;
    },
    setDeskRule(deskRule){
        this.deskRule = deskRule;
    },
    setMaxCircle(maxCircle){
        this.maxCircle = maxCircle;
    },
    setStartTimestamp(startTimestamp){
        this.startTimestamp = startTimestamp;
    },

});

module.exports.record_desk_info = record_desk_info;

let record_room_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.deskInfo = this.deskInfo;
        content.playerInfoList = this.playerInfoList;

        return content;
    },
    setDeskInfo(deskInfo){
        this.deskInfo = deskInfo;
    },
    setPlayerInfoList(playerInfoList){
        this.playerInfoList = playerInfoList;
    },

});

module.exports.record_room_info = record_room_info;

let ddz_play_poker_timeout = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.playUserId = this.playUserId;
        content.playTimeout = this.playTimeout;

        return content;
    },
    setPlayUserId(playUserId){
        this.playUserId = playUserId;
    },
    setPlayTimeout(playTimeout){
        this.playTimeout = playTimeout;
    },

});

module.exports.ddz_play_poker_timeout = ddz_play_poker_timeout;

