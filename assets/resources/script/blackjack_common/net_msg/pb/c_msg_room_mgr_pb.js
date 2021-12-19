let common_game = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameType = this.gameType;
        content.roomId = this.roomId;
        content.userId = this.userId;
        content.clubId = this.clubId;
        content.clubWanfa = this.clubWanfa;
        content.clubWanfaDesk = this.clubWanfaDesk;
        content.recordId = this.recordId;
        content.clubCreateType = this.clubCreateType;
        content.bloodLevel = this.bloodLevel;
        content.bloodRate = this.bloodRate;
        content.firstBankerId = this.firstBankerId;
        content.lastWinnerId = this.lastWinnerId;
        content.multiple = this.multiple;

        return content;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setRoomId(roomId){
        this.roomId = roomId;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setClubWanfa(clubWanfa){
        this.clubWanfa = clubWanfa;
    },
    setClubWanfaDesk(clubWanfaDesk){
        this.clubWanfaDesk = clubWanfaDesk;
    },
    setRecordId(recordId){
        this.recordId = recordId;
    },
    setClubCreateType(clubCreateType){
        this.clubCreateType = clubCreateType;
    },
    setBloodLevel(bloodLevel){
        this.bloodLevel = bloodLevel;
    },
    setBloodRate(bloodRate){
        this.bloodRate = bloodRate;
    },
    setFirstBankerId(firstBankerId){
        this.firstBankerId = firstBankerId;
    },
    setLastWinnerId(lastWinnerId){
        this.lastWinnerId = lastWinnerId;
    },
    setMultiple(multiple){
        this.multiple = multiple;
    },

});

module.exports.common_game = common_game;

let common_game_header = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameType = this.gameType;
        content.roomId = this.roomId;

        return content;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setRoomId(roomId){
        this.roomId = roomId;
    },

});

module.exports.common_game_header = common_game_header;

let common_role = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.name = this.name;
        content.sex = this.sex;
        content.headUrl = this.headUrl;
        content.openId = this.openId;
        content.isReady = this.isReady;
        content.seat = this.seat;
        content.state = this.state;
        content.coin = this.coin;
        content.robot = this.robot;
        content.aiLevel = this.aiLevel;
        content.winTimes = this.winTimes;
        content.totalTimes = this.totalTimes;
        content.level = this.level;
        content.exp = this.exp;
        content.vipLevel = this.vipLevel;
        content.lucky = this.lucky;
        content.latlngInfo = this.latlngInfo;
        content.isSwitch = this.isSwitch;
        content.netState = this.netState;
        content.cheatRate = this.cheatRate;
        content.cheatScore = this.cheatScore;
        content.cheatState = this.cheatState;
        content.score = this.score;
        content.robotLevel = this.robotLevel;
        content.ip = this.ip;
        content.address = this.address;
        content.rate = this.rate;
        content.itemNum = this.itemNum;
        content.autoFlag = this.autoFlag;
        content.fishBetId = this.fishBetId;
        content.loginIntervalTime = this.loginIntervalTime;
        content.lookPlayer = this.lookPlayer;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setName(name){
        this.name = name;
    },
    setSex(sex){
        this.sex = sex;
    },
    setHeadUrl(headUrl){
        this.headUrl = headUrl;
    },
    setOpenId(openId){
        this.openId = openId;
    },
    setIsReady(isReady){
        this.isReady = isReady;
    },
    setSeat(seat){
        this.seat = seat;
    },
    setState(state){
        this.state = state;
    },
    setCoin(coin){
        this.coin = coin;
    },
    setRobot(robot){
        this.robot = robot;
    },
    setAiLevel(aiLevel){
        this.aiLevel = aiLevel;
    },
    setWinTimes(winTimes){
        this.winTimes = winTimes;
    },
    setTotalTimes(totalTimes){
        this.totalTimes = totalTimes;
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
    setLucky(lucky){
        this.lucky = lucky;
    },
    setLatlngInfo(latlngInfo){
        this.latlngInfo = latlngInfo;
    },
    setIsSwitch(isSwitch){
        this.isSwitch = isSwitch;
    },
    setNetState(netState){
        this.netState = netState;
    },
    setCheatRate(cheatRate){
        this.cheatRate = cheatRate;
    },
    setCheatScore(cheatScore){
        this.cheatScore = cheatScore;
    },
    setCheatState(cheatState){
        this.cheatState = cheatState;
    },
    setScore(score){
        this.score = score;
    },
    setRobotLevel(robotLevel){
        this.robotLevel = robotLevel;
    },
    setIp(ip){
        this.ip = ip;
    },
    setAddress(address){
        this.address = address;
    },
    setRate(rate){
        this.rate = rate;
    },
    setItemNum(itemNum){
        this.itemNum = itemNum;
    },
    setAutoFlag(autoFlag){
        this.autoFlag = autoFlag;
    },
    setFishBetId(fishBetId){
        this.fishBetId = fishBetId;
    },
    setLoginIntervalTime(loginIntervalTime){
        this.loginIntervalTime = loginIntervalTime;
    },
    setLookPlayer(lookPlayer){
        this.lookPlayer = lookPlayer;
    },

});

module.exports.common_role = common_role;

let msg_create_game_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.gameInfo = this.gameInfo;
        content.roleInfo = this.roleInfo;
        content.rule = this.rule;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setGameInfo(gameInfo){
        this.gameInfo = gameInfo;
    },
    setRoleInfo(roleInfo){
        this.roleInfo = roleInfo;
    },
    setRule(rule){
        this.rule = rule;
    },

});

module.exports.msg_create_game_ret = msg_create_game_ret;

let msg_enter_game_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameInfo = this.gameInfo;
        content.latlngInfo = this.latlngInfo;
        content.seat = this.seat;

        return content;
    },
    setGameInfo(gameInfo){
        this.gameInfo = gameInfo;
    },
    setLatlngInfo(latlngInfo){
        this.latlngInfo = latlngInfo;
    },
    setSeat(seat){
        this.seat = seat;
    },

});

module.exports.msg_enter_game_req = msg_enter_game_req;

let msg_enter_game_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.gameInfo = this.gameInfo;
        content.selfInfo = this.selfInfo;
        content.otherInfosList = this.otherInfosList;
        content.rule = this.rule;
        content.idReconnect = this.idReconnect;
        content.isGetOthers = this.isGetOthers;
        content.othersNum = this.othersNum;
        content.rulePublic = this.rulePublic;
        content.deskId = this.deskId;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setGameInfo(gameInfo){
        this.gameInfo = gameInfo;
    },
    setSelfInfo(selfInfo){
        this.selfInfo = selfInfo;
    },
    setOtherInfosList(otherInfosList){
        this.otherInfosList = otherInfosList;
    },
    setRule(rule){
        this.rule = rule;
    },
    setIdReconnect(idReconnect){
        this.idReconnect = idReconnect;
    },
    setIsGetOthers(isGetOthers){
        this.isGetOthers = isGetOthers;
    },
    setOthersNum(othersNum){
        this.othersNum = othersNum;
    },
    setRulePublic(rulePublic){
        this.rulePublic = rulePublic;
    },
    setDeskId(deskId){
        this.deskId = deskId;
    },

});

module.exports.msg_enter_game_ret = msg_enter_game_ret;

let msg_enter_game_other = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameInfo = this.gameInfo;
        content.roleInfo = this.roleInfo;

        return content;
    },
    setGameInfo(gameInfo){
        this.gameInfo = gameInfo;
    },
    setRoleInfo(roleInfo){
        this.roleInfo = roleInfo;
    },

});

module.exports.msg_enter_game_other = msg_enter_game_other;

let msg_leave_game_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameInfo = this.gameInfo;

        return content;
    },
    setGameInfo(gameInfo){
        this.gameInfo = gameInfo;
    },

});

module.exports.msg_leave_game_req = msg_leave_game_req;

let msg_leave_game_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.gameInfo = this.gameInfo;
        content.userId = this.userId;
        content.coinRetCode = this.coinRetCode;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setGameInfo(gameInfo){
        this.gameInfo = gameInfo;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setCoinRetCode(coinRetCode){
        this.coinRetCode = coinRetCode;
    },

});

module.exports.msg_leave_game_ret = msg_leave_game_ret;

let msg_stand_game_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameInfo = this.gameInfo;

        return content;
    },
    setGameInfo(gameInfo){
        this.gameInfo = gameInfo;
    },

});

module.exports.msg_stand_game_req = msg_stand_game_req;

let msg_stand_game_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.gameInfo = this.gameInfo;
        content.userId = this.userId;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setGameInfo(gameInfo){
        this.gameInfo = gameInfo;
    },
    setUserId(userId){
        this.userId = userId;
    },

});

module.exports.msg_stand_game_ret = msg_stand_game_ret;

let msg_prepare_game_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameInfo = this.gameInfo;
        content.rate = this.rate;

        return content;
    },
    setGameInfo(gameInfo){
        this.gameInfo = gameInfo;
    },
    setRate(rate){
        this.rate = rate;
    },

});

module.exports.msg_prepare_game_req = msg_prepare_game_req;

let msg_prepare_game_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.gameInfo = this.gameInfo;
        content.userId = this.userId;
        content.rate = this.rate;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setGameInfo(gameInfo){
        this.gameInfo = gameInfo;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setRate(rate){
        this.rate = rate;
    },

});

module.exports.msg_prepare_game_ret = msg_prepare_game_ret;

let msg_g2h_create_room_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameType = this.gameType;
        content.roomId = this.roomId;

        return content;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setRoomId(roomId){
        this.roomId = roomId;
    },

});

module.exports.msg_g2h_create_room_ack = msg_g2h_create_room_ack;

let msg_g2h_update_room_state = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameType = this.gameType;
        content.roomId = this.roomId;
        content.state = this.state;
        content.resultsList = this.resultsList;
        content.detailsList = this.detailsList;
        content.circleNum = this.circleNum;
        content.endState = this.endState;
        content.dissolveRoleId = this.dissolveRoleId;

        return content;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setRoomId(roomId){
        this.roomId = roomId;
    },
    setState(state){
        this.state = state;
    },
    setResultsList(resultsList){
        this.resultsList = resultsList;
    },
    setDetailsList(detailsList){
        this.detailsList = detailsList;
    },
    setCircleNum(circleNum){
        this.circleNum = circleNum;
    },
    setEndState(endState){
        this.endState = endState;
    },
    setDissolveRoleId(dissolveRoleId){
        this.dissolveRoleId = dissolveRoleId;
    },

});

module.exports.msg_g2h_update_room_state = msg_g2h_update_room_state;

let chat_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameInfo = this.gameInfo;
        content.msgType = this.msgType;
        content.id = this.id;
        content.msg = this.msg;
        content.toUserId = this.toUserId;

        return content;
    },
    setGameInfo(gameInfo){
        this.gameInfo = gameInfo;
    },
    setMsgType(msgType){
        this.msgType = msgType;
    },
    setId(id){
        this.id = id;
    },
    setMsg(msg){
        this.msg = msg;
    },
    setToUserId(toUserId){
        this.toUserId = toUserId;
    },

});

module.exports.chat_info = chat_info;

let msg_chat_message_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.chatInfo = this.chatInfo;

        return content;
    },
    setChatInfo(chatInfo){
        this.chatInfo = chatInfo;
    },

});

module.exports.msg_chat_message_req = msg_chat_message_req;

let msg_chat_message_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.chatInfo = this.chatInfo;
        content.sendUserId = this.sendUserId;

        return content;
    },
    setChatInfo(chatInfo){
        this.chatInfo = chatInfo;
    },
    setSendUserId(sendUserId){
        this.sendUserId = sendUserId;
    },

});

module.exports.msg_chat_message_ret = msg_chat_message_ret;

let msg_game_rule_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.roomId = this.roomId;

        return content;
    },
    setRoomId(roomId){
        this.roomId = roomId;
    },

});

module.exports.msg_game_rule_req = msg_game_rule_req;

let msg_h2g_create_game = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.rolesList = this.rolesList;
        content.gameInfo = this.gameInfo;
        content.coinInfo = this.coinInfo;
        content.rule = this.rule;

        return content;
    },
    setRolesList(rolesList){
        this.rolesList = rolesList;
    },
    setGameInfo(gameInfo){
        this.gameInfo = gameInfo;
    },
    setCoinInfo(coinInfo){
        this.coinInfo = coinInfo;
    },
    setRule(rule){
        this.rule = rule;
    },

});

module.exports.msg_h2g_create_game = msg_h2g_create_game;

let msg_update_room_role_state = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameInfo = this.gameInfo;
        content.userId = this.userId;
        content.state = this.state;

        return content;
    },
    setGameInfo(gameInfo){
        this.gameInfo = gameInfo;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setState(state){
        this.state = state;
    },

});

module.exports.msg_update_room_role_state = msg_update_room_role_state;

let msg_g2h_create_match_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameType = this.gameType;
        content.matchId = this.matchId;

        return content;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setMatchId(matchId){
        this.matchId = matchId;
    },

});

module.exports.msg_g2h_create_match_ack = msg_g2h_create_match_ack;

let common_coin = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.baseScore = this.baseScore;
        content.aiLevel = this.aiLevel;
        content.configId = this.configId;
        content.tax = this.tax;

        return content;
    },
    setBaseScore(baseScore){
        this.baseScore = baseScore;
    },
    setAiLevel(aiLevel){
        this.aiLevel = aiLevel;
    },
    setConfigId(configId){
        this.configId = configId;
    },
    setTax(tax){
        this.tax = tax;
    },

});

module.exports.common_coin = common_coin;

let msg_change_room_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameType = this.gameType;
        content.roomCoinId = this.roomCoinId;
        content.ip = this.ip;

        return content;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setRoomCoinId(roomCoinId){
        this.roomCoinId = roomCoinId;
    },
    setIp(ip){
        this.ip = ip;
    },

});

module.exports.msg_change_room_req = msg_change_room_req;

let msg_enter_coin_game_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.rate = this.rate;
        content.arg = this.arg;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setRate(rate){
        this.rate = rate;
    },
    setArg(arg){
        this.arg = arg;
    },

});

module.exports.msg_enter_coin_game_ret = msg_enter_coin_game_ret;

let coin_result = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.coin = this.coin;
        content.isHangup = this.isHangup;
        content.identify = this.identify;
        content.gameUserState = this.gameUserState;
        content.gamePokerNum = this.gamePokerNum;
        content.betCoin = this.betCoin;
        content.reductionId = this.reductionId;
        content.rewardType = this.rewardType;
        content.bouns = this.bouns;
        content.itemListList = this.itemListList;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setCoin(coin){
        this.coin = coin;
    },
    setIsHangup(isHangup){
        this.isHangup = isHangup;
    },
    setIdentify(identify){
        this.identify = identify;
    },
    setGameUserState(gameUserState){
        this.gameUserState = gameUserState;
    },
    setGamePokerNum(gamePokerNum){
        this.gamePokerNum = gamePokerNum;
    },
    setBetCoin(betCoin){
        this.betCoin = betCoin;
    },
    setReductionId(reductionId){
        this.reductionId = reductionId;
    },
    setRewardType(rewardType){
        this.rewardType = rewardType;
    },
    setBouns(bouns){
        this.bouns = bouns;
    },
    setItemListList(itemListList){
        this.itemListList = itemListList;
    },

});

module.exports.coin_result = coin_result;

let msg_g2h_coin_result = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameInfo = this.gameInfo;
        content.resultInfoList = this.resultInfoList;

        return content;
    },
    setGameInfo(gameInfo){
        this.gameInfo = gameInfo;
    },
    setResultInfoList(resultInfoList){
        this.resultInfoList = resultInfoList;
    },

});

module.exports.msg_g2h_coin_result = msg_g2h_coin_result;

let tdk_rule_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.roundCount = this.roundCount;
        content.roleCount = this.roleCount;
        content.playType = this.playType;
        content.hasJoker = this.hasJoker;
        content.jokerPao = this.jokerPao;
        content.aPao = this.aPao;
        content.lanDouble = this.lanDouble;
        content.genfu = this.genfu;
        content.isOpen = this.isOpen;
        content.shareType = this.shareType;
        content.bati = this.bati;
        content.baseScore = this.baseScore;
        content.allinScore = this.allinScore;
        content.limitClub = this.limitClub;
        content.limitWords = this.limitWords;
        content.limitTalk = this.limitTalk;
        content.gps = this.gps;
        content.xifengNum = this.xifengNum;
        content.maxScore = this.maxScore;
        content.sixiaowang = this.sixiaowang;
        content.tuoguanTime = this.tuoguanTime;
        content.huixuanti = this.huixuanti;
        content.motifanbei = this.motifanbei;
        content.qinsandui = this.qinsandui;
        content.lianxian = this.lianxian;
        content.busuoqiang = this.busuoqiang;
        content.autoStart = this.autoStart;
        content.shunzi = this.shunzi;

        return content;
    },
    setRoundCount(roundCount){
        this.roundCount = roundCount;
    },
    setRoleCount(roleCount){
        this.roleCount = roleCount;
    },
    setPlayType(playType){
        this.playType = playType;
    },
    setHasJoker(hasJoker){
        this.hasJoker = hasJoker;
    },
    setJokerPao(jokerPao){
        this.jokerPao = jokerPao;
    },
    setAPao(aPao){
        this.aPao = aPao;
    },
    setLanDouble(lanDouble){
        this.lanDouble = lanDouble;
    },
    setGenfu(genfu){
        this.genfu = genfu;
    },
    setIsOpen(isOpen){
        this.isOpen = isOpen;
    },
    setShareType(shareType){
        this.shareType = shareType;
    },
    setBati(bati){
        this.bati = bati;
    },
    setBaseScore(baseScore){
        this.baseScore = baseScore;
    },
    setAllinScore(allinScore){
        this.allinScore = allinScore;
    },
    setLimitClub(limitClub){
        this.limitClub = limitClub;
    },
    setLimitWords(limitWords){
        this.limitWords = limitWords;
    },
    setLimitTalk(limitTalk){
        this.limitTalk = limitTalk;
    },
    setGps(gps){
        this.gps = gps;
    },
    setXifengNum(xifengNum){
        this.xifengNum = xifengNum;
    },
    setMaxScore(maxScore){
        this.maxScore = maxScore;
    },
    setSixiaowang(sixiaowang){
        this.sixiaowang = sixiaowang;
    },
    setTuoguanTime(tuoguanTime){
        this.tuoguanTime = tuoguanTime;
    },
    setHuixuanti(huixuanti){
        this.huixuanti = huixuanti;
    },
    setMotifanbei(motifanbei){
        this.motifanbei = motifanbei;
    },
    setQinsandui(qinsandui){
        this.qinsandui = qinsandui;
    },
    setLianxian(lianxian){
        this.lianxian = lianxian;
    },
    setBusuoqiang(busuoqiang){
        this.busuoqiang = busuoqiang;
    },
    setAutoStart(autoStart){
        this.autoStart = autoStart;
    },
    setShunzi(shunzi){
        this.shunzi = shunzi;
    },

});

module.exports.tdk_rule_info = tdk_rule_info;

let msg_change_room_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },

});

module.exports.msg_change_room_ret = msg_change_room_ret;

let msg_h2g_update_coin = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.coin = this.coin;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setCoin(coin){
        this.coin = coin;
    },

});

module.exports.msg_h2g_update_coin = msg_h2g_update_coin;

let p16_req_createdesk = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.boardscout = this.boardscout;
        content.isdianpaosanjia = this.isdianpaosanjia;
        content.isxiaojifeidan = this.isxiaojifeidan;
        content.isyaojiusanse = this.isyaojiusanse;
        content.usercountlimit = this.usercountlimit;
        content.isuncheat = this.isuncheat;
        content.paytype = this.paytype;
        content.issifenggang = this.issifenggang;
        content.pqsanse = this.pqsanse;
        content.isxiadanzhanli = this.isxiadanzhanli;
        content.istongbaofanfan = this.istongbaofanfan;
        content.isquemen = this.isquemen;
        content.gps = this.gps;
        content.isyuyin = this.isyuyin;
        content.isbujiabuhu = this.isbujiabuhu;
        content.ishaoqifanbei = this.ishaoqifanbei;
        content.reservedList = this.reservedList;

        return content;
    },
    setBoardscout(boardscout){
        this.boardscout = boardscout;
    },
    setIsdianpaosanjia(isdianpaosanjia){
        this.isdianpaosanjia = isdianpaosanjia;
    },
    setIsxiaojifeidan(isxiaojifeidan){
        this.isxiaojifeidan = isxiaojifeidan;
    },
    setIsyaojiusanse(isyaojiusanse){
        this.isyaojiusanse = isyaojiusanse;
    },
    setUsercountlimit(usercountlimit){
        this.usercountlimit = usercountlimit;
    },
    setIsuncheat(isuncheat){
        this.isuncheat = isuncheat;
    },
    setPaytype(paytype){
        this.paytype = paytype;
    },
    setIssifenggang(issifenggang){
        this.issifenggang = issifenggang;
    },
    setPqsanse(pqsanse){
        this.pqsanse = pqsanse;
    },
    setIsxiadanzhanli(isxiadanzhanli){
        this.isxiadanzhanli = isxiadanzhanli;
    },
    setIstongbaofanfan(istongbaofanfan){
        this.istongbaofanfan = istongbaofanfan;
    },
    setIsquemen(isquemen){
        this.isquemen = isquemen;
    },
    setGps(gps){
        this.gps = gps;
    },
    setIsyuyin(isyuyin){
        this.isyuyin = isyuyin;
    },
    setIsbujiabuhu(isbujiabuhu){
        this.isbujiabuhu = isbujiabuhu;
    },
    setIshaoqifanbei(ishaoqifanbei){
        this.ishaoqifanbei = ishaoqifanbei;
    },
    setReservedList(reservedList){
        this.reservedList = reservedList;
    },

});

module.exports.p16_req_createdesk = p16_req_createdesk;

let p16_ack_desk_rule = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.boardscout = this.boardscout;
        content.guangguotype = this.guangguotype;
        content.isdianpaosanjia = this.isdianpaosanjia;
        content.isuseyaojiu = this.isuseyaojiu;
        content.isxiaojifeidan = this.isxiaojifeidan;
        content.iskuaibao = this.iskuaibao;
        content.isxiaojiwanneng = this.isxiaojiwanneng;
        content.isyaojiusanse = this.isyaojiusanse;
        content.usercountlimit = this.usercountlimit;
        content.isuncheat = this.isuncheat;
        content.ownernickname = this.ownernickname;
        content.paytype = this.paytype;
        content.iskuaiguo = this.iskuaiguo;
        content.roomId = this.roomId;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setBoardscout(boardscout){
        this.boardscout = boardscout;
    },
    setGuangguotype(guangguotype){
        this.guangguotype = guangguotype;
    },
    setIsdianpaosanjia(isdianpaosanjia){
        this.isdianpaosanjia = isdianpaosanjia;
    },
    setIsuseyaojiu(isuseyaojiu){
        this.isuseyaojiu = isuseyaojiu;
    },
    setIsxiaojifeidan(isxiaojifeidan){
        this.isxiaojifeidan = isxiaojifeidan;
    },
    setIskuaibao(iskuaibao){
        this.iskuaibao = iskuaibao;
    },
    setIsxiaojiwanneng(isxiaojiwanneng){
        this.isxiaojiwanneng = isxiaojiwanneng;
    },
    setIsyaojiusanse(isyaojiusanse){
        this.isyaojiusanse = isyaojiusanse;
    },
    setUsercountlimit(usercountlimit){
        this.usercountlimit = usercountlimit;
    },
    setIsuncheat(isuncheat){
        this.isuncheat = isuncheat;
    },
    setOwnernickname(ownernickname){
        this.ownernickname = ownernickname;
    },
    setPaytype(paytype){
        this.paytype = paytype;
    },
    setIskuaiguo(iskuaiguo){
        this.iskuaiguo = iskuaiguo;
    },
    setRoomId(roomId){
        this.roomId = roomId;
    },

});

module.exports.p16_ack_desk_rule = p16_ack_desk_rule;

let msg_enter_coin_game_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameType = this.gameType;
        content.roomId = this.roomId;
        content.ip = this.ip;
        content.rate = this.rate;
        content.seat = this.seat;
        content.deskId = this.deskId;
        content.lookPlayer = this.lookPlayer;

        return content;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setRoomId(roomId){
        this.roomId = roomId;
    },
    setIp(ip){
        this.ip = ip;
    },
    setRate(rate){
        this.rate = rate;
    },
    setSeat(seat){
        this.seat = seat;
    },
    setDeskId(deskId){
        this.deskId = deskId;
    },
    setLookPlayer(lookPlayer){
        this.lookPlayer = lookPlayer;
    },

});

module.exports.msg_enter_coin_game_req = msg_enter_coin_game_req;

let xl_game_rule = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.sdyRule = this.sdyRule;
        content.ddzRule = this.ddzRule;
        content.psRule = this.psRule;
        content.tdkRule = this.tdkRule;
        content.pyRule = this.pyRule;
        content.pin3Rule = this.pin3Rule;
        content.suohaRule = this.suohaRule;
        content.jlbPsRule = this.jlbPsRule;
        content.gdyRule = this.gdyRule;
        content.hbRule = this.hbRule;
        content.yqPin3Rule = this.yqPin3Rule;
        content.xyDdzRule = this.xyDdzRule;
        content.paodekuaiRule = this.paodekuaiRule;
        content.teenpattiRule = this.teenpattiRule;

        return content;
    },
    setSdyRule(sdyRule){
        this.sdyRule = sdyRule;
    },
    setDdzRule(ddzRule){
        this.ddzRule = ddzRule;
    },
    setPsRule(psRule){
        this.psRule = psRule;
    },
    setTdkRule(tdkRule){
        this.tdkRule = tdkRule;
    },
    setPyRule(pyRule){
        this.pyRule = pyRule;
    },
    setPin3Rule(pin3Rule){
        this.pin3Rule = pin3Rule;
    },
    setSuohaRule(suohaRule){
        this.suohaRule = suohaRule;
    },
    setJlbPsRule(jlbPsRule){
        this.jlbPsRule = jlbPsRule;
    },
    setGdyRule(gdyRule){
        this.gdyRule = gdyRule;
    },
    setHbRule(hbRule){
        this.hbRule = hbRule;
    },
    setYqPin3Rule(yqPin3Rule){
        this.yqPin3Rule = yqPin3Rule;
    },
    setXyDdzRule(xyDdzRule){
        this.xyDdzRule = xyDdzRule;
    },
    setPaodekuaiRule(paodekuaiRule){
        this.paodekuaiRule = paodekuaiRule;
    },
    setTeenpattiRule(teenpattiRule){
        this.teenpattiRule = teenpattiRule;
    },

});

module.exports.xl_game_rule = xl_game_rule;

let sdy_rule_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.circleNum = this.circleNum;
        content.zhu2 = this.zhu2;
        content.lianKouDaiPo = this.lianKouDaiPo;
        content.biDiao = this.biDiao;
        content.wangKou = this.wangKou;

        return content;
    },
    setCircleNum(circleNum){
        this.circleNum = circleNum;
    },
    setZhu2(zhu2){
        this.zhu2 = zhu2;
    },
    setLianKouDaiPo(lianKouDaiPo){
        this.lianKouDaiPo = lianKouDaiPo;
    },
    setBiDiao(biDiao){
        this.biDiao = biDiao;
    },
    setWangKou(wangKou){
        this.wangKou = wangKou;
    },

});

module.exports.sdy_rule_info = sdy_rule_info;

let ddz_rule_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.circleNum = this.circleNum;
        content.maxScore = this.maxScore;
        content.beenCallScore = this.beenCallScore;
        content.exchangePoker = this.exchangePoker;
        content.canDaiExtra2 = this.canDaiExtra2;
        content.doubleScore = this.doubleScore;
        content.stackGenPoker = this.stackGenPoker;
        content.limitWords = this.limitWords;
        content.cardHolder = this.cardHolder;
        content.limitTalk = this.limitTalk;
        content.gps = this.gps;
        content.bottomPokerDouble = this.bottomPokerDouble;
        content.isJuetou = this.isJuetou;

        return content;
    },
    setCircleNum(circleNum){
        this.circleNum = circleNum;
    },
    setMaxScore(maxScore){
        this.maxScore = maxScore;
    },
    setBeenCallScore(beenCallScore){
        this.beenCallScore = beenCallScore;
    },
    setExchangePoker(exchangePoker){
        this.exchangePoker = exchangePoker;
    },
    setCanDaiExtra2(canDaiExtra2){
        this.canDaiExtra2 = canDaiExtra2;
    },
    setDoubleScore(doubleScore){
        this.doubleScore = doubleScore;
    },
    setStackGenPoker(stackGenPoker){
        this.stackGenPoker = stackGenPoker;
    },
    setLimitWords(limitWords){
        this.limitWords = limitWords;
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
    setBottomPokerDouble(bottomPokerDouble){
        this.bottomPokerDouble = bottomPokerDouble;
    },
    setIsJuetou(isJuetou){
        this.isJuetou = isJuetou;
    },

});

module.exports.ddz_rule_info = ddz_rule_info;

let ps_rule_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.circleNum = this.circleNum;
        content.maxScore = this.maxScore;
        content.scoreType = this.scoreType;
        content.gameType = this.gameType;
        content.showType = this.showType;
        content.maxGrub = this.maxGrub;
        content.maxBet = this.maxBet;
        content.cardTypeThree = this.cardTypeThree;
        content.cardTypeStraight = this.cardTypeStraight;
        content.cardTypeFlush = this.cardTypeFlush;
        content.cardTypeFullHouse = this.cardTypeFullHouse;
        content.cardTypeFive = this.cardTypeFive;
        content.cardTypeFlushStraight = this.cardTypeFlushStraight;
        content.cardTypeSihua = this.cardTypeSihua;
        content.cardTypeWuhua = this.cardTypeWuhua;
        content.cardTypeZhadan = this.cardTypeZhadan;
        content.limitClub = this.limitClub;
        content.limitWords = this.limitWords;
        content.limitTalk = this.limitTalk;
        content.gps = this.gps;
        content.renman = this.renman;
        content.tuoguan = this.tuoguan;
        content.beishu = this.beishu;

        return content;
    },
    setCircleNum(circleNum){
        this.circleNum = circleNum;
    },
    setMaxScore(maxScore){
        this.maxScore = maxScore;
    },
    setScoreType(scoreType){
        this.scoreType = scoreType;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setShowType(showType){
        this.showType = showType;
    },
    setMaxGrub(maxGrub){
        this.maxGrub = maxGrub;
    },
    setMaxBet(maxBet){
        this.maxBet = maxBet;
    },
    setCardTypeThree(cardTypeThree){
        this.cardTypeThree = cardTypeThree;
    },
    setCardTypeStraight(cardTypeStraight){
        this.cardTypeStraight = cardTypeStraight;
    },
    setCardTypeFlush(cardTypeFlush){
        this.cardTypeFlush = cardTypeFlush;
    },
    setCardTypeFullHouse(cardTypeFullHouse){
        this.cardTypeFullHouse = cardTypeFullHouse;
    },
    setCardTypeFive(cardTypeFive){
        this.cardTypeFive = cardTypeFive;
    },
    setCardTypeFlushStraight(cardTypeFlushStraight){
        this.cardTypeFlushStraight = cardTypeFlushStraight;
    },
    setCardTypeSihua(cardTypeSihua){
        this.cardTypeSihua = cardTypeSihua;
    },
    setCardTypeWuhua(cardTypeWuhua){
        this.cardTypeWuhua = cardTypeWuhua;
    },
    setCardTypeZhadan(cardTypeZhadan){
        this.cardTypeZhadan = cardTypeZhadan;
    },
    setLimitClub(limitClub){
        this.limitClub = limitClub;
    },
    setLimitWords(limitWords){
        this.limitWords = limitWords;
    },
    setLimitTalk(limitTalk){
        this.limitTalk = limitTalk;
    },
    setGps(gps){
        this.gps = gps;
    },
    setRenman(renman){
        this.renman = renman;
    },
    setTuoguan(tuoguan){
        this.tuoguan = tuoguan;
    },
    setBeishu(beishu){
        this.beishu = beishu;
    },

});

module.exports.ps_rule_info = ps_rule_info;

let py_rule_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.circleNum = this.circleNum;
        content.baseScore = this.baseScore;
        content.isMing = this.isMing;
        content.isDui = this.isDui;
        content.isSan = this.isSan;
        content.hasSan = this.hasSan;
        content.limitClub = this.limitClub;
        content.limitWords = this.limitWords;
        content.limitTalk = this.limitTalk;
        content.gps = this.gps;
        content.double = this.double;

        return content;
    },
    setCircleNum(circleNum){
        this.circleNum = circleNum;
    },
    setBaseScore(baseScore){
        this.baseScore = baseScore;
    },
    setIsMing(isMing){
        this.isMing = isMing;
    },
    setIsDui(isDui){
        this.isDui = isDui;
    },
    setIsSan(isSan){
        this.isSan = isSan;
    },
    setHasSan(hasSan){
        this.hasSan = hasSan;
    },
    setLimitClub(limitClub){
        this.limitClub = limitClub;
    },
    setLimitWords(limitWords){
        this.limitWords = limitWords;
    },
    setLimitTalk(limitTalk){
        this.limitTalk = limitTalk;
    },
    setGps(gps){
        this.gps = gps;
    },
    setDouble(double){
        this.double = double;
    },

});

module.exports.py_rule_info = py_rule_info;

let na_req_createdesk = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.boardscout = this.boardscout;
        content.usercountlimit = this.usercountlimit;
        content.isuncheat = this.isuncheat;
        content.isqiduidaigu = this.isqiduidaigu;
        content.istongbaofanfan = this.istongbaofanfan;
        content.ispiaohudandiaofanfan = this.ispiaohudandiaofanfan;
        content.isqiduiyaojiu = this.isqiduiyaojiu;
        content.isdianpaosanjia = this.isdianpaosanjia;
        content.gps = this.gps;
        content.isyuyin = this.isyuyin;
        content.isuseyaojiu = this.isuseyaojiu;
        content.ismenqingfanbei = this.ismenqingfanbei;
        content.reservedList = this.reservedList;

        return content;
    },
    setBoardscout(boardscout){
        this.boardscout = boardscout;
    },
    setUsercountlimit(usercountlimit){
        this.usercountlimit = usercountlimit;
    },
    setIsuncheat(isuncheat){
        this.isuncheat = isuncheat;
    },
    setIsqiduidaigu(isqiduidaigu){
        this.isqiduidaigu = isqiduidaigu;
    },
    setIstongbaofanfan(istongbaofanfan){
        this.istongbaofanfan = istongbaofanfan;
    },
    setIspiaohudandiaofanfan(ispiaohudandiaofanfan){
        this.ispiaohudandiaofanfan = ispiaohudandiaofanfan;
    },
    setIsqiduiyaojiu(isqiduiyaojiu){
        this.isqiduiyaojiu = isqiduiyaojiu;
    },
    setIsdianpaosanjia(isdianpaosanjia){
        this.isdianpaosanjia = isdianpaosanjia;
    },
    setGps(gps){
        this.gps = gps;
    },
    setIsyuyin(isyuyin){
        this.isyuyin = isyuyin;
    },
    setIsuseyaojiu(isuseyaojiu){
        this.isuseyaojiu = isuseyaojiu;
    },
    setIsmenqingfanbei(ismenqingfanbei){
        this.ismenqingfanbei = ismenqingfanbei;
    },
    setReservedList(reservedList){
        this.reservedList = reservedList;
    },

});

module.exports.na_req_createdesk = na_req_createdesk;

let na_ack_desk_rule = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.boardscout = this.boardscout;
        content.isdianpaosanjia = this.isdianpaosanjia;
        content.isyaojiusanse = this.isyaojiusanse;
        content.pqsanse = this.pqsanse;
        content.istongbaofanfan = this.istongbaofanfan;
        content.usercountlimit = this.usercountlimit;
        content.isuncheat = this.isuncheat;
        content.ownernickname = this.ownernickname;
        content.paytype = this.paytype;
        content.roomId = this.roomId;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setBoardscout(boardscout){
        this.boardscout = boardscout;
    },
    setIsdianpaosanjia(isdianpaosanjia){
        this.isdianpaosanjia = isdianpaosanjia;
    },
    setIsyaojiusanse(isyaojiusanse){
        this.isyaojiusanse = isyaojiusanse;
    },
    setPqsanse(pqsanse){
        this.pqsanse = pqsanse;
    },
    setIstongbaofanfan(istongbaofanfan){
        this.istongbaofanfan = istongbaofanfan;
    },
    setUsercountlimit(usercountlimit){
        this.usercountlimit = usercountlimit;
    },
    setIsuncheat(isuncheat){
        this.isuncheat = isuncheat;
    },
    setOwnernickname(ownernickname){
        this.ownernickname = ownernickname;
    },
    setPaytype(paytype){
        this.paytype = paytype;
    },
    setRoomId(roomId){
        this.roomId = roomId;
    },

});

module.exports.na_ack_desk_rule = na_ack_desk_rule;

let room_result_detail = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.roundId = this.roundId;
        content.time = this.time;
        content.resultsList = this.resultsList;
        content.recordId = this.recordId;

        return content;
    },
    setRoundId(roundId){
        this.roundId = roundId;
    },
    setTime(time){
        this.time = time;
    },
    setResultsList(resultsList){
        this.resultsList = resultsList;
    },
    setRecordId(recordId){
        this.recordId = recordId;
    },

});

module.exports.room_result_detail = room_result_detail;

let msg_room_user_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameInfo = this.gameInfo;
        content.roleInfosList = this.roleInfosList;

        return content;
    },
    setGameInfo(gameInfo){
        this.gameInfo = gameInfo;
    },
    setRoleInfosList(roleInfosList){
        this.roleInfosList = roleInfosList;
    },

});

module.exports.msg_room_user_info = msg_room_user_info;

let msg_room_user_coin_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.roleCoinsList = this.roleCoinsList;

        return content;
    },
    setRoleCoinsList(roleCoinsList){
        this.roleCoinsList = roleCoinsList;
    },

});

module.exports.msg_room_user_coin_info = msg_room_user_coin_info;

let common_role_coin = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.coin = this.coin;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setCoin(coin){
        this.coin = coin;
    },

});

module.exports.common_role_coin = common_role_coin;

let msg_create_game_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameInfo = this.gameInfo;
        content.rule = this.rule;
        content.latlngInfo = this.latlngInfo;
        content.rulePublic = this.rulePublic;

        return content;
    },
    setGameInfo(gameInfo){
        this.gameInfo = gameInfo;
    },
    setRule(rule){
        this.rule = rule;
    },
    setLatlngInfo(latlngInfo){
        this.latlngInfo = latlngInfo;
    },
    setRulePublic(rulePublic){
        this.rulePublic = rulePublic;
    },

});

module.exports.msg_create_game_req = msg_create_game_req;

let latlng = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.latitude = this.latitude;
        content.longitude = this.longitude;

        return content;
    },
    setLatitude(latitude){
        this.latitude = latitude;
    },
    setLongitude(longitude){
        this.longitude = longitude;
    },

});

module.exports.latlng = latlng;

let msg_player_location_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.latlngInfo = this.latlngInfo;
        content.address = this.address;
        content.ip = this.ip;

        return content;
    },
    setLatlngInfo(latlngInfo){
        this.latlngInfo = latlngInfo;
    },
    setAddress(address){
        this.address = address;
    },
    setIp(ip){
        this.ip = ip;
    },

});

module.exports.msg_player_location_req = msg_player_location_req;

let msg_player_location_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.latlngInfo = this.latlngInfo;
        content.address = this.address;
        content.ip = this.ip;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setLatlngInfo(latlngInfo){
        this.latlngInfo = latlngInfo;
    },
    setAddress(address){
        this.address = address;
    },
    setIp(ip){
        this.ip = ip;
    },

});

module.exports.msg_player_location_ack = msg_player_location_ack;

let msg_room_coin_update = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameType = this.gameType;
        content.roomId = this.roomId;
        content.userId = this.userId;
        content.coin = this.coin;

        return content;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setRoomId(roomId){
        this.roomId = roomId;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setCoin(coin){
        this.coin = coin;
    },

});

module.exports.msg_room_coin_update = msg_room_coin_update;

let msg_room_reconnect_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_room_reconnect_req = msg_room_reconnect_req;

let room_dissolve_agree_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.isAgree = this.isAgree;

        return content;
    },
    setIsAgree(isAgree){
        this.isAgree = isAgree;
    },

});

module.exports.room_dissolve_agree_req = room_dissolve_agree_req;

let room_dissolve_agree_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameType = this.gameType;
        content.userId = this.userId;
        content.isAgree = this.isAgree;

        return content;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setIsAgree(isAgree){
        this.isAgree = isAgree;
    },

});

module.exports.room_dissolve_agree_ack = room_dissolve_agree_ack;

let room_dissolve_agree_result = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameType = this.gameType;
        content.isDissolve = this.isDissolve;

        return content;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setIsDissolve(isDissolve){
        this.isDissolve = isDissolve;
    },

});

module.exports.room_dissolve_agree_result = room_dissolve_agree_result;

let room_prepare_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.room_prepare_req = room_prepare_req;

let room_prepare_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameType = this.gameType;
        content.userId = this.userId;

        return content;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setUserId(userId){
        this.userId = userId;
    },

});

module.exports.room_prepare_ack = room_prepare_ack;

let msg_plan_leave_game_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameInfo = this.gameInfo;

        return content;
    },
    setGameInfo(gameInfo){
        this.gameInfo = gameInfo;
    },

});

module.exports.msg_plan_leave_game_req = msg_plan_leave_game_req;

let msg_plan_leave_game_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.gameInfo = this.gameInfo;
        content.userId = this.userId;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setGameInfo(gameInfo){
        this.gameInfo = gameInfo;
    },
    setUserId(userId){
        this.userId = userId;
    },

});

module.exports.msg_plan_leave_game_ret = msg_plan_leave_game_ret;

let msg_rank_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.rankId = this.rankId;

        return content;
    },
    setRankId(rankId){
        this.rankId = rankId;
    },

});

module.exports.msg_rank_req = msg_rank_req;

let role_rank_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.rank = this.rank;
        content.userId = this.userId;
        content.name = this.name;
        content.headUrl = this.headUrl;
        content.score = this.score;
        content.timestamp = this.timestamp;

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
    setScore(score){
        this.score = score;
    },
    setTimestamp(timestamp){
        this.timestamp = timestamp;
    },

});

module.exports.role_rank_info = role_rank_info;

let history_rank_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.champinUserId = this.champinUserId;
        content.championName = this.championName;
        content.championHead = this.championHead;
        content.championScore = this.championScore;
        content.curRank = this.curRank;
        content.curScore = this.curScore;
        content.historyRank = this.historyRank;

        return content;
    },
    setChampinUserId(champinUserId){
        this.champinUserId = champinUserId;
    },
    setChampionName(championName){
        this.championName = championName;
    },
    setChampionHead(championHead){
        this.championHead = championHead;
    },
    setChampionScore(championScore){
        this.championScore = championScore;
    },
    setCurRank(curRank){
        this.curRank = curRank;
    },
    setCurScore(curScore){
        this.curScore = curScore;
    },
    setHistoryRank(historyRank){
        this.historyRank = historyRank;
    },

});

module.exports.history_rank_info = history_rank_info;

let msg_rank_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.rankId = this.rankId;
        content.rankListList = this.rankListList;
        content.historyInfo = this.historyInfo;

        return content;
    },
    setRankId(rankId){
        this.rankId = rankId;
    },
    setRankListList(rankListList){
        this.rankListList = rankListList;
    },
    setHistoryInfo(historyInfo){
        this.historyInfo = historyInfo;
    },

});

module.exports.msg_rank_ret = msg_rank_ret;

let msg_room_pre_enter_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.roomId = this.roomId;

        return content;
    },
    setRoomId(roomId){
        this.roomId = roomId;
    },

});

module.exports.msg_room_pre_enter_req = msg_room_pre_enter_req;

let msg_room_pre_enter_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameType = this.gameType;
        content.roomId = this.roomId;
        content.isCanSelectSeat = this.isCanSelectSeat;
        content.roleListList = this.roleListList;

        return content;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setRoomId(roomId){
        this.roomId = roomId;
    },
    setIsCanSelectSeat(isCanSelectSeat){
        this.isCanSelectSeat = isCanSelectSeat;
    },
    setRoleListList(roleListList){
        this.roleListList = roleListList;
    },

});

module.exports.msg_room_pre_enter_ret = msg_room_pre_enter_ret;

let pin3_rule_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.roleNum = this.roleNum;
        content.boardsCout = this.boardsCout;
        content.circleNum = this.circleNum;
        content.playRule = this.playRule;
        content.limitRule = this.limitRule;
        content.limitWatch = this.limitWatch;
        content.limitCmp = this.limitCmp;
        content.limitScore = this.limitScore;
        content.limitTalk = this.limitTalk;
        content.isGps = this.isGps;
        content.isGiveup = this.isGiveup;
        content.isWatchall = this.isWatchall;

        return content;
    },
    setRoleNum(roleNum){
        this.roleNum = roleNum;
    },
    setBoardsCout(boardsCout){
        this.boardsCout = boardsCout;
    },
    setCircleNum(circleNum){
        this.circleNum = circleNum;
    },
    setPlayRule(playRule){
        this.playRule = playRule;
    },
    setLimitRule(limitRule){
        this.limitRule = limitRule;
    },
    setLimitWatch(limitWatch){
        this.limitWatch = limitWatch;
    },
    setLimitCmp(limitCmp){
        this.limitCmp = limitCmp;
    },
    setLimitScore(limitScore){
        this.limitScore = limitScore;
    },
    setLimitTalk(limitTalk){
        this.limitTalk = limitTalk;
    },
    setIsGps(isGps){
        this.isGps = isGps;
    },
    setIsGiveup(isGiveup){
        this.isGiveup = isGiveup;
    },
    setIsWatchall(isWatchall){
        this.isWatchall = isWatchall;
    },

});

module.exports.pin3_rule_info = pin3_rule_info;

let msg_room_change_seat_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gametype = this.gametype;
        content.roomid = this.roomid;
        content.seat = this.seat;

        return content;
    },
    setGametype(gametype){
        this.gametype = gametype;
    },
    setRoomid(roomid){
        this.roomid = roomid;
    },
    setSeat(seat){
        this.seat = seat;
    },

});

module.exports.msg_room_change_seat_req = msg_room_change_seat_req;

let msg_room_change_seat_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.gametype = this.gametype;
        content.roomid = this.roomid;
        content.userId = this.userId;
        content.seat = this.seat;
        content.otherId = this.otherId;
        content.otherSeat = this.otherSeat;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setGametype(gametype){
        this.gametype = gametype;
    },
    setRoomid(roomid){
        this.roomid = roomid;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setSeat(seat){
        this.seat = seat;
    },
    setOtherId(otherId){
        this.otherId = otherId;
    },
    setOtherSeat(otherSeat){
        this.otherSeat = otherSeat;
    },

});

module.exports.msg_room_change_seat_ret = msg_room_change_seat_ret;

let suoha_rule_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.circleNum = this.circleNum;
        content.maxScore = this.maxScore;
        content.scoreType = this.scoreType;
        content.gameType = this.gameType;
        content.playerNum = this.playerNum;
        content.showCard = this.showCard;
        content.giveUp = this.giveUp;
        content.limitClub = this.limitClub;
        content.limitWords = this.limitWords;
        content.limitTalk = this.limitTalk;
        content.gps = this.gps;

        return content;
    },
    setCircleNum(circleNum){
        this.circleNum = circleNum;
    },
    setMaxScore(maxScore){
        this.maxScore = maxScore;
    },
    setScoreType(scoreType){
        this.scoreType = scoreType;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setPlayerNum(playerNum){
        this.playerNum = playerNum;
    },
    setShowCard(showCard){
        this.showCard = showCard;
    },
    setGiveUp(giveUp){
        this.giveUp = giveUp;
    },
    setLimitClub(limitClub){
        this.limitClub = limitClub;
    },
    setLimitWords(limitWords){
        this.limitWords = limitWords;
    },
    setLimitTalk(limitTalk){
        this.limitTalk = limitTalk;
    },
    setGps(gps){
        this.gps = gps;
    },

});

module.exports.suoha_rule_info = suoha_rule_info;

let seat_role = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.name = this.name;
        content.sex = this.sex;
        content.headUrl = this.headUrl;
        content.openId = this.openId;
        content.isReady = this.isReady;
        content.seat = this.seat;
        content.state = this.state;
        content.coin = this.coin;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setName(name){
        this.name = name;
    },
    setSex(sex){
        this.sex = sex;
    },
    setHeadUrl(headUrl){
        this.headUrl = headUrl;
    },
    setOpenId(openId){
        this.openId = openId;
    },
    setIsReady(isReady){
        this.isReady = isReady;
    },
    setSeat(seat){
        this.seat = seat;
    },
    setState(state){
        this.state = state;
    },
    setCoin(coin){
        this.coin = coin;
    },

});

module.exports.seat_role = seat_role;

let jlb_ps_rule_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.circleNum = this.circleNum;
        content.maxScore = this.maxScore;
        content.scoreType = this.scoreType;
        content.gameType = this.gameType;
        content.showType = this.showType;
        content.maxGrub = this.maxGrub;
        content.maxBet = this.maxBet;
        content.baseScore = this.baseScore;
        content.cardTypeThree = this.cardTypeThree;
        content.cardTypeStraight = this.cardTypeStraight;
        content.cardTypeFlush = this.cardTypeFlush;
        content.cardTypeFullHouse = this.cardTypeFullHouse;
        content.cardTypeFive = this.cardTypeFive;
        content.cardTypeFlushStraight = this.cardTypeFlushStraight;
        content.limitClub = this.limitClub;
        content.limitWords = this.limitWords;
        content.limitTalk = this.limitTalk;
        content.gps = this.gps;

        return content;
    },
    setCircleNum(circleNum){
        this.circleNum = circleNum;
    },
    setMaxScore(maxScore){
        this.maxScore = maxScore;
    },
    setScoreType(scoreType){
        this.scoreType = scoreType;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setShowType(showType){
        this.showType = showType;
    },
    setMaxGrub(maxGrub){
        this.maxGrub = maxGrub;
    },
    setMaxBet(maxBet){
        this.maxBet = maxBet;
    },
    setBaseScore(baseScore){
        this.baseScore = baseScore;
    },
    setCardTypeThree(cardTypeThree){
        this.cardTypeThree = cardTypeThree;
    },
    setCardTypeStraight(cardTypeStraight){
        this.cardTypeStraight = cardTypeStraight;
    },
    setCardTypeFlush(cardTypeFlush){
        this.cardTypeFlush = cardTypeFlush;
    },
    setCardTypeFullHouse(cardTypeFullHouse){
        this.cardTypeFullHouse = cardTypeFullHouse;
    },
    setCardTypeFive(cardTypeFive){
        this.cardTypeFive = cardTypeFive;
    },
    setCardTypeFlushStraight(cardTypeFlushStraight){
        this.cardTypeFlushStraight = cardTypeFlushStraight;
    },
    setLimitClub(limitClub){
        this.limitClub = limitClub;
    },
    setLimitWords(limitWords){
        this.limitWords = limitWords;
    },
    setLimitTalk(limitTalk){
        this.limitTalk = limitTalk;
    },
    setGps(gps){
        this.gps = gps;
    },

});

module.exports.jlb_ps_rule_info = jlb_ps_rule_info;

let msg_g2h_immediately_update_room_state = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameType = this.gameType;
        content.roomId = this.roomId;
        content.state = this.state;
        content.resultsList = this.resultsList;
        content.detailsList = this.detailsList;
        content.circleNum = this.circleNum;
        content.endState = this.endState;

        return content;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setRoomId(roomId){
        this.roomId = roomId;
    },
    setState(state){
        this.state = state;
    },
    setResultsList(resultsList){
        this.resultsList = resultsList;
    },
    setDetailsList(detailsList){
        this.detailsList = detailsList;
    },
    setCircleNum(circleNum){
        this.circleNum = circleNum;
    },
    setEndState(endState){
        this.endState = endState;
    },

});

module.exports.msg_g2h_immediately_update_room_state = msg_g2h_immediately_update_room_state;

let gdy_rule_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.circleNum = this.circleNum;
        content.roleCount = this.roleCount;
        content.maxScore = this.maxScore;
        content.ruanSan = this.ruanSan;
        content.biCard = this.biCard;
        content.quanguan = this.quanguan;
        content.wangDouble = this.wangDouble;
        content.bombDouble = this.bombDouble;
        content.limitClub = this.limitClub;
        content.limitWords = this.limitWords;
        content.limitTalk = this.limitTalk;
        content.gps = this.gps;

        return content;
    },
    setCircleNum(circleNum){
        this.circleNum = circleNum;
    },
    setRoleCount(roleCount){
        this.roleCount = roleCount;
    },
    setMaxScore(maxScore){
        this.maxScore = maxScore;
    },
    setRuanSan(ruanSan){
        this.ruanSan = ruanSan;
    },
    setBiCard(biCard){
        this.biCard = biCard;
    },
    setQuanguan(quanguan){
        this.quanguan = quanguan;
    },
    setWangDouble(wangDouble){
        this.wangDouble = wangDouble;
    },
    setBombDouble(bombDouble){
        this.bombDouble = bombDouble;
    },
    setLimitClub(limitClub){
        this.limitClub = limitClub;
    },
    setLimitWords(limitWords){
        this.limitWords = limitWords;
    },
    setLimitTalk(limitTalk){
        this.limitTalk = limitTalk;
    },
    setGps(gps){
        this.gps = gps;
    },

});

module.exports.gdy_rule_info = gdy_rule_info;

let hb_rule_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.zhuangType = this.zhuangType;
        content.mailei = this.mailei;
        content.maxRate = this.maxRate;
        content.roleCount = this.roleCount;
        content.model = this.model;
        content.isJoin = this.isJoin;
        content.maxBaonum = this.maxBaonum;
        content.limitClub = this.limitClub;
        content.limitWords = this.limitWords;
        content.limitTalk = this.limitTalk;
        content.gps = this.gps;

        return content;
    },
    setZhuangType(zhuangType){
        this.zhuangType = zhuangType;
    },
    setMailei(mailei){
        this.mailei = mailei;
    },
    setMaxRate(maxRate){
        this.maxRate = maxRate;
    },
    setRoleCount(roleCount){
        this.roleCount = roleCount;
    },
    setModel(model){
        this.model = model;
    },
    setIsJoin(isJoin){
        this.isJoin = isJoin;
    },
    setMaxBaonum(maxBaonum){
        this.maxBaonum = maxBaonum;
    },
    setLimitClub(limitClub){
        this.limitClub = limitClub;
    },
    setLimitWords(limitWords){
        this.limitWords = limitWords;
    },
    setLimitTalk(limitTalk){
        this.limitTalk = limitTalk;
    },
    setGps(gps){
        this.gps = gps;
    },

});

module.exports.hb_rule_info = hb_rule_info;

let msg_view_friend_game_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameType = this.gameType;
        content.roomId = this.roomId;

        return content;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setRoomId(roomId){
        this.roomId = roomId;
    },

});

module.exports.msg_view_friend_game_req = msg_view_friend_game_req;

let msg_view_friend_game_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.gameInfo = this.gameInfo;
        content.selfInfo = this.selfInfo;
        content.otherInfosList = this.otherInfosList;
        content.rule = this.rule;
        content.idReconnect = this.idReconnect;
        content.rulePublic = this.rulePublic;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setGameInfo(gameInfo){
        this.gameInfo = gameInfo;
    },
    setSelfInfo(selfInfo){
        this.selfInfo = selfInfo;
    },
    setOtherInfosList(otherInfosList){
        this.otherInfosList = otherInfosList;
    },
    setRule(rule){
        this.rule = rule;
    },
    setIdReconnect(idReconnect){
        this.idReconnect = idReconnect;
    },
    setRulePublic(rulePublic){
        this.rulePublic = rulePublic;
    },

});

module.exports.msg_view_friend_game_ret = msg_view_friend_game_ret;

let msg_view_friend_game_other = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameInfo = this.gameInfo;
        content.roleInfo = this.roleInfo;

        return content;
    },
    setGameInfo(gameInfo){
        this.gameInfo = gameInfo;
    },
    setRoleInfo(roleInfo){
        this.roleInfo = roleInfo;
    },

});

module.exports.msg_view_friend_game_other = msg_view_friend_game_other;

let yq_pin3_rule_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.roleNum = this.roleNum;
        content.boardsCout = this.boardsCout;
        content.circleNum = this.circleNum;
        content.playMod = this.playMod;
        content.playRuleList = this.playRuleList;
        content.baseScore = this.baseScore;
        content.limitEnter = this.limitEnter;
        content.limitLeave = this.limitLeave;
        content.limitTalk = this.limitTalk;
        content.isGps = this.isGps;
        content.isAdd = this.isAdd;
        content.limitCmp = this.limitCmp;
        content.luckyType = this.luckyType;
        content.luckyPay = this.luckyPay;
        content.luckyPokersList = this.luckyPokersList;
        content.opTime = this.opTime;
        content.isMidwayAdd = this.isMidwayAdd;
        content.isViewer = this.isViewer;
        content.limitWatch = this.limitWatch;

        return content;
    },
    setRoleNum(roleNum){
        this.roleNum = roleNum;
    },
    setBoardsCout(boardsCout){
        this.boardsCout = boardsCout;
    },
    setCircleNum(circleNum){
        this.circleNum = circleNum;
    },
    setPlayMod(playMod){
        this.playMod = playMod;
    },
    setPlayRuleList(playRuleList){
        this.playRuleList = playRuleList;
    },
    setBaseScore(baseScore){
        this.baseScore = baseScore;
    },
    setLimitEnter(limitEnter){
        this.limitEnter = limitEnter;
    },
    setLimitLeave(limitLeave){
        this.limitLeave = limitLeave;
    },
    setLimitTalk(limitTalk){
        this.limitTalk = limitTalk;
    },
    setIsGps(isGps){
        this.isGps = isGps;
    },
    setIsAdd(isAdd){
        this.isAdd = isAdd;
    },
    setLimitCmp(limitCmp){
        this.limitCmp = limitCmp;
    },
    setLuckyType(luckyType){
        this.luckyType = luckyType;
    },
    setLuckyPay(luckyPay){
        this.luckyPay = luckyPay;
    },
    setLuckyPokersList(luckyPokersList){
        this.luckyPokersList = luckyPokersList;
    },
    setOpTime(opTime){
        this.opTime = opTime;
    },
    setIsMidwayAdd(isMidwayAdd){
        this.isMidwayAdd = isMidwayAdd;
    },
    setIsViewer(isViewer){
        this.isViewer = isViewer;
    },
    setLimitWatch(limitWatch){
        this.limitWatch = limitWatch;
    },

});

module.exports.yq_pin3_rule_info = yq_pin3_rule_info;

let teenpatti_rule_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.roleNum = this.roleNum;
        content.boardsCout = this.boardsCout;
        content.circleNum = this.circleNum;
        content.playMod = this.playMod;
        content.playRuleList = this.playRuleList;
        content.baseScore = this.baseScore;
        content.limitEnter = this.limitEnter;
        content.limitLeave = this.limitLeave;
        content.limitTalk = this.limitTalk;
        content.isGps = this.isGps;
        content.isAdd = this.isAdd;
        content.limitCmp = this.limitCmp;
        content.luckyType = this.luckyType;
        content.luckyPay = this.luckyPay;
        content.luckyPokersList = this.luckyPokersList;
        content.opTime = this.opTime;
        content.isMidwayAdd = this.isMidwayAdd;
        content.isViewer = this.isViewer;
        content.limitWatch = this.limitWatch;
        content.limitMaxChaal = this.limitMaxChaal;
        content.limitPot = this.limitPot;

        return content;
    },
    setRoleNum(roleNum){
        this.roleNum = roleNum;
    },
    setBoardsCout(boardsCout){
        this.boardsCout = boardsCout;
    },
    setCircleNum(circleNum){
        this.circleNum = circleNum;
    },
    setPlayMod(playMod){
        this.playMod = playMod;
    },
    setPlayRuleList(playRuleList){
        this.playRuleList = playRuleList;
    },
    setBaseScore(baseScore){
        this.baseScore = baseScore;
    },
    setLimitEnter(limitEnter){
        this.limitEnter = limitEnter;
    },
    setLimitLeave(limitLeave){
        this.limitLeave = limitLeave;
    },
    setLimitTalk(limitTalk){
        this.limitTalk = limitTalk;
    },
    setIsGps(isGps){
        this.isGps = isGps;
    },
    setIsAdd(isAdd){
        this.isAdd = isAdd;
    },
    setLimitCmp(limitCmp){
        this.limitCmp = limitCmp;
    },
    setLuckyType(luckyType){
        this.luckyType = luckyType;
    },
    setLuckyPay(luckyPay){
        this.luckyPay = luckyPay;
    },
    setLuckyPokersList(luckyPokersList){
        this.luckyPokersList = luckyPokersList;
    },
    setOpTime(opTime){
        this.opTime = opTime;
    },
    setIsMidwayAdd(isMidwayAdd){
        this.isMidwayAdd = isMidwayAdd;
    },
    setIsViewer(isViewer){
        this.isViewer = isViewer;
    },
    setLimitWatch(limitWatch){
        this.limitWatch = limitWatch;
    },
    setLimitMaxChaal(limitMaxChaal){
        this.limitMaxChaal = limitMaxChaal;
    },
    setLimitPot(limitPot){
        this.limitPot = limitPot;
    },

});

module.exports.teenpatti_rule_info = teenpatti_rule_info;

let msg_get_room_user_info_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameType = this.gameType;
        content.roomId = this.roomId;

        return content;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setRoomId(roomId){
        this.roomId = roomId;
    },

});

module.exports.msg_get_room_user_info_req = msg_get_room_user_info_req;

let msg_get_room_user_info_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameType = this.gameType;
        content.roomId = this.roomId;
        content.userInfosList = this.userInfosList;

        return content;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setRoomId(roomId){
        this.roomId = roomId;
    },
    setUserInfosList(userInfosList){
        this.userInfosList = userInfosList;
    },

});

module.exports.msg_get_room_user_info_ret = msg_get_room_user_info_ret;

let room_user_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.name = this.name;
        content.sex = this.sex;
        content.headUrl = this.headUrl;
        content.coin = this.coin;
        content.winTimes = this.winTimes;
        content.totalTimes = this.totalTimes;
        content.level = this.level;
        content.exp = this.exp;
        content.vipLevel = this.vipLevel;
        content.score = this.score;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setName(name){
        this.name = name;
    },
    setSex(sex){
        this.sex = sex;
    },
    setHeadUrl(headUrl){
        this.headUrl = headUrl;
    },
    setCoin(coin){
        this.coin = coin;
    },
    setWinTimes(winTimes){
        this.winTimes = winTimes;
    },
    setTotalTimes(totalTimes){
        this.totalTimes = totalTimes;
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
    setScore(score){
        this.score = score;
    },

});

module.exports.room_user_info = room_user_info;

let msg_get_room_self_build_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameType = this.gameType;
        content.index = this.index;

        return content;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setIndex(index){
        this.index = index;
    },

});

module.exports.msg_get_room_self_build_req = msg_get_room_self_build_req;

let room_self_build_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.roomId = this.roomId;
        content.gameType = this.gameType;
        content.rule = this.rule;
        content.roleNum = this.roleNum;

        return content;
    },
    setRoomId(roomId){
        this.roomId = roomId;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setRule(rule){
        this.rule = rule;
    },
    setRoleNum(roleNum){
        this.roleNum = roleNum;
    },

});

module.exports.room_self_build_info = room_self_build_info;

let msg_get_room_self_build_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.index = this.index;
        content.roomListList = this.roomListList;

        return content;
    },
    setIndex(index){
        this.index = index;
    },
    setRoomListList(roomListList){
        this.roomListList = roomListList;
    },

});

module.exports.msg_get_room_self_build_ret = msg_get_room_self_build_ret;

let msg_check_room_info_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameInfo = this.gameInfo;

        return content;
    },
    setGameInfo(gameInfo){
        this.gameInfo = gameInfo;
    },

});

module.exports.msg_check_room_info_req = msg_check_room_info_req;

let msg_check_room_info_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameInfo = this.gameInfo;
        content.isCanEnter = this.isCanEnter;
        content.isCanView = this.isCanView;
        content.isShowPanel = this.isShowPanel;
        content.isRoomStarted = this.isRoomStarted;
        content.rule = this.rule;

        return content;
    },
    setGameInfo(gameInfo){
        this.gameInfo = gameInfo;
    },
    setIsCanEnter(isCanEnter){
        this.isCanEnter = isCanEnter;
    },
    setIsCanView(isCanView){
        this.isCanView = isCanView;
    },
    setIsShowPanel(isShowPanel){
        this.isShowPanel = isShowPanel;
    },
    setIsRoomStarted(isRoomStarted){
        this.isRoomStarted = isRoomStarted;
    },
    setRule(rule){
        this.rule = rule;
    },

});

module.exports.msg_check_room_info_ret = msg_check_room_info_ret;

let xl_game_rule_public = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.isCanEnter = this.isCanEnter;
        content.isCanView = this.isCanView;

        return content;
    },
    setIsCanEnter(isCanEnter){
        this.isCanEnter = isCanEnter;
    },
    setIsCanView(isCanView){
        this.isCanView = isCanView;
    },

});

module.exports.xl_game_rule_public = xl_game_rule_public;

let msg_friend_create_room_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_friend_create_room_req = msg_friend_create_room_req;

let friend_room = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameType = this.gameType;
        content.roomId = this.roomId;
        content.juNum = this.juNum;
        content.curJuNum = this.curJuNum;
        content.createTime = this.createTime;
        content.maxUserNum = this.maxUserNum;
        content.membersList = this.membersList;
        content.state = this.state;
        content.curScoresList = this.curScoresList;

        return content;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setRoomId(roomId){
        this.roomId = roomId;
    },
    setJuNum(juNum){
        this.juNum = juNum;
    },
    setCurJuNum(curJuNum){
        this.curJuNum = curJuNum;
    },
    setCreateTime(createTime){
        this.createTime = createTime;
    },
    setMaxUserNum(maxUserNum){
        this.maxUserNum = maxUserNum;
    },
    setMembersList(membersList){
        this.membersList = membersList;
    },
    setState(state){
        this.state = state;
    },
    setCurScoresList(curScoresList){
        this.curScoresList = curScoresList;
    },

});

module.exports.friend_room = friend_room;

let msg_friend_create_room_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.roomListList = this.roomListList;

        return content;
    },
    setRoomListList(roomListList){
        this.roomListList = roomListList;
    },

});

module.exports.msg_friend_create_room_ret = msg_friend_create_room_ret;

let coin_result_item = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.itemDataId = this.itemDataId;
        content.cnt = this.cnt;

        return content;
    },
    setItemDataId(itemDataId){
        this.itemDataId = itemDataId;
    },
    setCnt(cnt){
        this.cnt = cnt;
    },

});

module.exports.coin_result_item = coin_result_item;

let g2h_sync_room_round = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameType = this.gameType;
        content.roomId = this.roomId;
        content.round = this.round;

        return content;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setRoomId(roomId){
        this.roomId = roomId;
    },
    setRound(round){
        this.round = round;
    },

});

module.exports.g2h_sync_room_round = g2h_sync_room_round;

let jisu_req_createdesk = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.boardscout = this.boardscout;
        content.usercountlimit = this.usercountlimit;
        content.isuncheat = this.isuncheat;
        content.paytype = this.paytype;
        content.gps = this.gps;
        content.isyuyin = this.isyuyin;
        content.mode = this.mode;
        content.haidilao = this.haidilao;
        content.reservedList = this.reservedList;

        return content;
    },
    setBoardscout(boardscout){
        this.boardscout = boardscout;
    },
    setUsercountlimit(usercountlimit){
        this.usercountlimit = usercountlimit;
    },
    setIsuncheat(isuncheat){
        this.isuncheat = isuncheat;
    },
    setPaytype(paytype){
        this.paytype = paytype;
    },
    setGps(gps){
        this.gps = gps;
    },
    setIsyuyin(isyuyin){
        this.isyuyin = isyuyin;
    },
    setMode(mode){
        this.mode = mode;
    },
    setHaidilao(haidilao){
        this.haidilao = haidilao;
    },
    setReservedList(reservedList){
        this.reservedList = reservedList;
    },

});

module.exports.jisu_req_createdesk = jisu_req_createdesk;

