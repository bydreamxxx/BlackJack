let paodekuai_rule_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.handPokerNum = this.handPokerNum;
        content.circleNum = this.circleNum;
        content.isMustBeenPlay = this.isMustBeenPlay;
        content.firstPlayRole = this.firstPlayRole;
        content.isBaoDi = this.isBaoDi;
        content.isChaiBomb = this.isChaiBomb;
        content.isFourTake2 = this.isFourTake2;
        content.isFourTake3 = this.isFourTake3;
        content.isBombOfAaa = this.isBombOfAaa;
        content.roomRoleNum = this.roomRoleNum;
        content.zhaNiao = this.zhaNiao;
        content.maxTimes = this.maxTimes;
        content.firstPlaySpade3 = this.firstPlaySpade3;
        content.isShowLeftCardsNum = this.isShowLeftCardsNum;
        content.isFplayThreeTake = this.isFplayThreeTake;
        content.isSplayThreeTake = this.isSplayThreeTake;
        content.isFplayThreeLineTake = this.isFplayThreeLineTake;
        content.isSplayThreeLineTake = this.isSplayThreeLineTake;
        content.playTimeout = this.playTimeout;
        content.cardHolder = this.cardHolder;
        content.limitTalk = this.limitTalk;
        content.gps = this.gps;

        return content;
    },
    setHandPokerNum(handPokerNum){
        this.handPokerNum = handPokerNum;
    },
    setCircleNum(circleNum){
        this.circleNum = circleNum;
    },
    setIsMustBeenPlay(isMustBeenPlay){
        this.isMustBeenPlay = isMustBeenPlay;
    },
    setFirstPlayRole(firstPlayRole){
        this.firstPlayRole = firstPlayRole;
    },
    setIsBaoDi(isBaoDi){
        this.isBaoDi = isBaoDi;
    },
    setIsChaiBomb(isChaiBomb){
        this.isChaiBomb = isChaiBomb;
    },
    setIsFourTake2(isFourTake2){
        this.isFourTake2 = isFourTake2;
    },
    setIsFourTake3(isFourTake3){
        this.isFourTake3 = isFourTake3;
    },
    setIsBombOfAaa(isBombOfAaa){
        this.isBombOfAaa = isBombOfAaa;
    },
    setRoomRoleNum(roomRoleNum){
        this.roomRoleNum = roomRoleNum;
    },
    setZhaNiao(zhaNiao){
        this.zhaNiao = zhaNiao;
    },
    setMaxTimes(maxTimes){
        this.maxTimes = maxTimes;
    },
    setFirstPlaySpade3(firstPlaySpade3){
        this.firstPlaySpade3 = firstPlaySpade3;
    },
    setIsShowLeftCardsNum(isShowLeftCardsNum){
        this.isShowLeftCardsNum = isShowLeftCardsNum;
    },
    setIsFplayThreeTake(isFplayThreeTake){
        this.isFplayThreeTake = isFplayThreeTake;
    },
    setIsSplayThreeTake(isSplayThreeTake){
        this.isSplayThreeTake = isSplayThreeTake;
    },
    setIsFplayThreeLineTake(isFplayThreeLineTake){
        this.isFplayThreeLineTake = isFplayThreeLineTake;
    },
    setIsSplayThreeLineTake(isSplayThreeLineTake){
        this.isSplayThreeLineTake = isSplayThreeLineTake;
    },
    setPlayTimeout(playTimeout){
        this.playTimeout = playTimeout;
    },
    setCardHolder(cardHolder){
        this.cardHolder = cardHolder;
    },
    setLimitTalk(limitTalk){
        this.limitTalk = limitTalk;
    },
    setGps(gps){
        this.gps = gps;
    },

});

module.exports.paodekuai_rule_info = paodekuai_rule_info;

let pdk_desk_info = cc.Class({
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
        content.maxCircle = this.maxCircle;
        content.startTimestamp = this.startTimestamp;
        content.dissolveTimeout = this.dissolveTimeout;

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
    setMaxCircle(maxCircle){
        this.maxCircle = maxCircle;
    },
    setStartTimestamp(startTimestamp){
        this.startTimestamp = startTimestamp;
    },
    setDissolveTimeout(dissolveTimeout){
        this.dissolveTimeout = dissolveTimeout;
    },

});

module.exports.pdk_desk_info = pdk_desk_info;

let pdk_player_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.score = this.score;
        content.site = this.site;
        content.isAuto = this.isAuto;
        content.handPokerNum = this.handPokerNum;
        content.isPrepared = this.isPrepared;

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
    setIsAuto(isAuto){
        this.isAuto = isAuto;
    },
    setHandPokerNum(handPokerNum){
        this.handPokerNum = handPokerNum;
    },
    setIsPrepared(isPrepared){
        this.isPrepared = isPrepared;
    },

});

module.exports.pdk_player_info = pdk_player_info;

let pdk_room_info = cc.Class({
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

module.exports.pdk_room_info = pdk_room_info;

let pdk_reconnect_room_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.deskInfo = this.deskInfo;
        content.curPlayer = this.curPlayer;
        content.timeout = this.timeout;
        content.playerInfoList = this.playerInfoList;
        content.handPokersList = this.handPokersList;
        content.recentPlayList = this.recentPlayList;
        content.curZhaDanNum = this.curZhaDanNum;
        content.configRoomId = this.configRoomId;
        content.playedPokersList = this.playedPokersList;
        content.dissolveInfoList = this.dissolveInfoList;
        content.isWxShared = this.isWxShared;
        content.zhuangUid = this.zhuangUid;

        return content;
    },
    setDeskInfo(deskInfo){
        this.deskInfo = deskInfo;
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
    setRecentPlayList(recentPlayList){
        this.recentPlayList = recentPlayList;
    },
    setCurZhaDanNum(curZhaDanNum){
        this.curZhaDanNum = curZhaDanNum;
    },
    setConfigRoomId(configRoomId){
        this.configRoomId = configRoomId;
    },
    setPlayedPokersList(playedPokersList){
        this.playedPokersList = playedPokersList;
    },
    setDissolveInfoList(dissolveInfoList){
        this.dissolveInfoList = dissolveInfoList;
    },
    setIsWxShared(isWxShared){
        this.isWxShared = isWxShared;
    },
    setZhuangUid(zhuangUid){
        this.zhuangUid = zhuangUid;
    },

});

module.exports.pdk_reconnect_room_info = pdk_reconnect_room_info;

let pdk_update_desk_status = cc.Class({
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

module.exports.pdk_update_desk_status = pdk_update_desk_status;

let pdk_hand_poker_list = cc.Class({
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

module.exports.pdk_hand_poker_list = pdk_hand_poker_list;

let pdk_play_role_score_change_detail = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.reason = this.reason;
        content.score = this.score;

        return content;
    },
    setReason(reason){
        this.reason = reason;
    },
    setScore(score){
        this.score = score;
    },

});

module.exports.pdk_play_role_score_change_detail = pdk_play_role_score_change_detail;

let pdk_play_role_score_change_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.changeScore = this.changeScore;
        content.leftHandPokerList = this.leftHandPokerList;
        content.detailList = this.detailList;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setChangeScore(changeScore){
        this.changeScore = changeScore;
    },
    setLeftHandPokerList(leftHandPokerList){
        this.leftHandPokerList = leftHandPokerList;
    },
    setDetailList(detailList){
        this.detailList = detailList;
    },

});

module.exports.pdk_play_role_score_change_info = pdk_play_role_score_change_info;

let pdk_play_result = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.isGod = this.isGod;
        content.changeListList = this.changeListList;

        return content;
    },
    setIsGod(isGod){
        this.isGod = isGod;
    },
    setChangeListList(changeListList){
        this.changeListList = changeListList;
    },

});

module.exports.pdk_play_result = pdk_play_result;

let pdk_player_offline_ack = cc.Class({
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

module.exports.pdk_player_offline_ack = pdk_player_offline_ack;

let pdk_player_auto_req = cc.Class({
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

module.exports.pdk_player_auto_req = pdk_player_auto_req;

let pdk_player_auto_ack = cc.Class({
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

module.exports.pdk_player_auto_ack = pdk_player_auto_ack;

let pdk_play_poker_req = cc.Class({
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

module.exports.pdk_play_poker_req = pdk_play_poker_req;

let pdk_play_poker_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.isSucess = this.isSucess;
        content.userId = this.userId;
        content.pokersList = this.pokersList;

        return content;
    },
    setIsSucess(isSucess){
        this.isSucess = isSucess;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setPokersList(pokersList){
        this.pokersList = pokersList;
    },

});

module.exports.pdk_play_poker_ack = pdk_play_poker_ack;

let pdk_reconnect_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.pdk_reconnect_req = pdk_reconnect_req;

let pdk_last_player_info = cc.Class({
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
        content.birdScore = this.birdScore;
        content.baodiTimes = this.baodiTimes;
        content.bombTimes = this.bombTimes;

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
    setBirdScore(birdScore){
        this.birdScore = birdScore;
    },
    setBaodiTimes(baodiTimes){
        this.baodiTimes = baodiTimes;
    },
    setBombTimes(bombTimes){
        this.bombTimes = bombTimes;
    },

});

module.exports.pdk_last_player_info = pdk_last_player_info;

let pdk_last_info = cc.Class({
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

module.exports.pdk_last_info = pdk_last_info;

