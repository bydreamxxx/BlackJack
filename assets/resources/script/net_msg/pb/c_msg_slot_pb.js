let msg_slot_enter_2s = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameType = this.gameType;
        content.roomType = this.roomType;

        return content;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setRoomType(roomType){
        this.roomType = roomType;
    },

});

module.exports.msg_slot_enter_2s = msg_slot_enter_2s;

let msg_slot_enter_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.gameType = this.gameType;
        content.roomType = this.roomType;
        content.roleNum = this.roleNum;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setRoomType(roomType){
        this.roomType = roomType;
    },
    setRoleNum(roleNum){
        this.roleNum = roleNum;
    },

});

module.exports.msg_slot_enter_2c = msg_slot_enter_2c;

let msg_slot_bet_2s = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.lineNum = this.lineNum;
        content.lineBet = this.lineBet;

        return content;
    },
    setLineNum(lineNum){
        this.lineNum = lineNum;
    },
    setLineBet(lineBet){
        this.lineBet = lineBet;
    },

});

module.exports.msg_slot_bet_2s = msg_slot_bet_2s;

let nested_slot_win_line = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.line = this.line;
        content.card = this.card;
        content.num = this.num;

        return content;
    },
    setLine(line){
        this.line = line;
    },
    setCard(card){
        this.card = card;
    },
    setNum(num){
        this.num = num;
    },

});

module.exports.nested_slot_win_line = nested_slot_win_line;

let nested_slot_card = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.x = this.x;
        content.y = this.y;
        content.cardId = this.cardId;

        return content;
    },
    setX(x){
        this.x = x;
    },
    setY(y){
        this.y = y;
    },
    setCardId(cardId){
        this.cardId = cardId;
    },

});

module.exports.nested_slot_card = nested_slot_card;

let nested_slot_func = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.funcType = this.funcType;
        content.funcCnt = this.funcCnt;
        content.line = this.line;
        content.bet = this.bet;
        content.siteId = this.siteId;
        content.middCardsList = this.middCardsList;
        content.odds = this.odds;
        content.winMoney = this.winMoney;
        content.newMoney = this.newMoney;
        content.miniWinMoney = this.miniWinMoney;

        return content;
    },
    setFuncType(funcType){
        this.funcType = funcType;
    },
    setFuncCnt(funcCnt){
        this.funcCnt = funcCnt;
    },
    setLine(line){
        this.line = line;
    },
    setBet(bet){
        this.bet = bet;
    },
    setSiteId(siteId){
        this.siteId = siteId;
    },
    setMiddCardsList(middCardsList){
        this.middCardsList = middCardsList;
    },
    setOdds(odds){
        this.odds = odds;
    },
    setWinMoney(winMoney){
        this.winMoney = winMoney;
    },
    setNewMoney(newMoney){
        this.newMoney = newMoney;
    },
    setMiniWinMoney(miniWinMoney){
        this.miniWinMoney = miniWinMoney;
    },

});

module.exports.nested_slot_func = nested_slot_func;

let nested_slot_result = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.cardsList = this.cardsList;
        content.winLinesList = this.winLinesList;
        content.funcsList = this.funcsList;
        content.newMoney = this.newMoney;
        content.winMoney = this.winMoney;
        content.bigWin = this.bigWin;

        return content;
    },
    setCardsList(cardsList){
        this.cardsList = cardsList;
    },
    setWinLinesList(winLinesList){
        this.winLinesList = winLinesList;
    },
    setFuncsList(funcsList){
        this.funcsList = funcsList;
    },
    setNewMoney(newMoney){
        this.newMoney = newMoney;
    },
    setWinMoney(winMoney){
        this.winMoney = winMoney;
    },
    setBigWin(bigWin){
        this.bigWin = bigWin;
    },

});

module.exports.nested_slot_result = nested_slot_result;

let msg_slot_bet_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.result = this.result;
        content.type = this.type;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setResult(result){
        this.result = result;
    },
    setType(type){
        this.type = type;
    },

});

module.exports.msg_slot_bet_2c = msg_slot_bet_2c;

let msg_slot_mini_game_2s = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_slot_mini_game_2s = msg_slot_mini_game_2s;

let msg_slot_mini_game_2c = cc.Class({
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

module.exports.msg_slot_mini_game_2c = msg_slot_mini_game_2c;

let msg_slot_get_2s = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_slot_get_2s = msg_slot_get_2s;

let msg_slot_get_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.newMoney = this.newMoney;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setNewMoney(newMoney){
        this.newMoney = newMoney;
    },

});

module.exports.msg_slot_get_2c = msg_slot_get_2c;

let msg_slot_compare_2s = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.choice = this.choice;

        return content;
    },
    setChoice(choice){
        this.choice = choice;
    },

});

module.exports.msg_slot_compare_2s = msg_slot_compare_2s;

let msg_slot_compare_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.pointsList = this.pointsList;
        content.newMoney = this.newMoney;
        content.winMoney = this.winMoney;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setPointsList(pointsList){
        this.pointsList = pointsList;
    },
    setNewMoney(newMoney){
        this.newMoney = newMoney;
    },
    setWinMoney(winMoney){
        this.winMoney = winMoney;
    },

});

module.exports.msg_slot_compare_2c = msg_slot_compare_2c;

let msg_slot_reconnect = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameType = this.gameType;
        content.roomType = this.roomType;

        return content;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setRoomType(roomType){
        this.roomType = roomType;
    },

});

module.exports.msg_slot_reconnect = msg_slot_reconnect;

let msg_slot_reconnect_2s = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_slot_reconnect_2s = msg_slot_reconnect_2s;

let msg_slot_reconnect_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.funcList = this.funcList;

        return content;
    },
    setFuncList(funcList){
        this.funcList = funcList;
    },

});

module.exports.msg_slot_reconnect_2c = msg_slot_reconnect_2c;

let msg_slot_quit_2s = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameType = this.gameType;
        content.roomType = this.roomType;

        return content;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setRoomType(roomType){
        this.roomType = roomType;
    },

});

module.exports.msg_slot_quit_2s = msg_slot_quit_2s;

let msg_slot_quit_2c = cc.Class({
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

module.exports.msg_slot_quit_2c = msg_slot_quit_2c;

let msg_slot_choice_comapre_2s = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.choice = this.choice;

        return content;
    },
    setChoice(choice){
        this.choice = choice;
    },

});

module.exports.msg_slot_choice_comapre_2s = msg_slot_choice_comapre_2s;

let msg_slot_choice_comapre_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.choice = this.choice;
        content.newMoney = this.newMoney;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setChoice(choice){
        this.choice = choice;
    },
    setNewMoney(newMoney){
        this.newMoney = newMoney;
    },

});

module.exports.msg_slot_choice_comapre_2c = msg_slot_choice_comapre_2c;

let msg_slot_op_2s = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameType = this.gameType;
        content.opType = this.opType;
        content.roomType = this.roomType;
        content.index = this.index;

        return content;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setOpType(opType){
        this.opType = opType;
    },
    setRoomType(roomType){
        this.roomType = roomType;
    },
    setIndex(index){
        this.index = index;
    },

});

module.exports.msg_slot_op_2s = msg_slot_op_2s;

let slot_role = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.playerId = this.playerId;
        content.playerName = this.playerName;
        content.openId = this.openId;
        content.headUrl = this.headUrl;
        content.coin = this.coin;
        content.bet = this.bet;
        content.time = this.time;
        content.allName = this.allName;

        return content;
    },
    setPlayerId(playerId){
        this.playerId = playerId;
    },
    setPlayerName(playerName){
        this.playerName = playerName;
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
    setBet(bet){
        this.bet = bet;
    },
    setTime(time){
        this.time = time;
    },
    setAllName(allName){
        this.allName = allName;
    },

});

module.exports.slot_role = slot_role;

let msg_slot_op_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameType = this.gameType;
        content.opType = this.opType;
        content.infosList = this.infosList;
        content.roleNum = this.roleNum;
        content.index = this.index;

        return content;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setOpType(opType){
        this.opType = opType;
    },
    setInfosList(infosList){
        this.infosList = infosList;
    },
    setRoleNum(roleNum){
        this.roleNum = roleNum;
    },
    setIndex(index){
        this.index = index;
    },

});

module.exports.msg_slot_op_2c = msg_slot_op_2c;

let msg_slot_update = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameType = this.gameType;
        content.roomType = this.roomType;
        content.roleNum = this.roleNum;

        return content;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setRoomType(roomType){
        this.roomType = roomType;
    },
    setRoleNum(roleNum){
        this.roleNum = roleNum;
    },

});

module.exports.msg_slot_update = msg_slot_update;

let mammon_box_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.seatId = this.seatId;
        content.boxId = this.boxId;

        return content;
    },
    setSeatId(seatId){
        this.seatId = seatId;
    },
    setBoxId(boxId){
        this.boxId = boxId;
    },

});

module.exports.mammon_box_info = mammon_box_info;

let msg_slot_mammon_open_box_2s = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.seatId = this.seatId;

        return content;
    },
    setSeatId(seatId){
        this.seatId = seatId;
    },

});

module.exports.msg_slot_mammon_open_box_2s = msg_slot_mammon_open_box_2s;

let msg_slot_mammon_open_box_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.box = this.box;
        content.leftTimes = this.leftTimes;
        content.totalRate = this.totalRate;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setBox(box){
        this.box = box;
    },
    setLeftTimes(leftTimes){
        this.leftTimes = leftTimes;
    },
    setTotalRate(totalRate){
        this.totalRate = totalRate;
    },

});

module.exports.msg_slot_mammon_open_box_2c = msg_slot_mammon_open_box_2c;

let msg_slot_mammon_reconnet_2s = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_slot_mammon_reconnet_2s = msg_slot_mammon_reconnet_2s;

let msg_slot_mammon_reconnet_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.openBoxsList = this.openBoxsList;
        content.totalRate = this.totalRate;

        return content;
    },
    setOpenBoxsList(openBoxsList){
        this.openBoxsList = openBoxsList;
    },
    setTotalRate(totalRate){
        this.totalRate = totalRate;
    },

});

module.exports.msg_slot_mammon_reconnet_2c = msg_slot_mammon_reconnet_2c;

let msg_slot_gm_2s = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.iconsList = this.iconsList;

        return content;
    },
    setIconsList(iconsList){
        this.iconsList = iconsList;
    },

});

module.exports.msg_slot_gm_2s = msg_slot_gm_2s;

let get_cash_activity_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.get_cash_activity_req = get_cash_activity_req;

let cash_activity = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.beginTime = this.beginTime;
        content.endTime = this.endTime;
        content.openCashTime = this.openCashTime;
        content.userCashCode = this.userCashCode;
        content.isOpenCash = this.isOpenCash;
        content.userRewardLevel = this.userRewardLevel;
        content.rankNum1 = this.rankNum1;
        content.rankNum2 = this.rankNum2;
        content.rankNum3 = this.rankNum3;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setBeginTime(beginTime){
        this.beginTime = beginTime;
    },
    setEndTime(endTime){
        this.endTime = endTime;
    },
    setOpenCashTime(openCashTime){
        this.openCashTime = openCashTime;
    },
    setUserCashCode(userCashCode){
        this.userCashCode = userCashCode;
    },
    setIsOpenCash(isOpenCash){
        this.isOpenCash = isOpenCash;
    },
    setUserRewardLevel(userRewardLevel){
        this.userRewardLevel = userRewardLevel;
    },
    setRankNum1(rankNum1){
        this.rankNum1 = rankNum1;
    },
    setRankNum2(rankNum2){
        this.rankNum2 = rankNum2;
    },
    setRankNum3(rankNum3){
        this.rankNum3 = rankNum3;
    },

});

module.exports.cash_activity = cash_activity;

let get_cash_activity_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.listList = this.listList;

        return content;
    },
    setListList(listList){
        this.listList = listList;
    },

});

module.exports.get_cash_activity_ret = get_cash_activity_ret;

let msg_cash_activity_state = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.activityId = this.activityId;
        content.state = this.state;

        return content;
    },
    setActivityId(activityId){
        this.activityId = activityId;
    },
    setState(state){
        this.state = state;
    },

});

module.exports.msg_cash_activity_state = msg_cash_activity_state;

let msg_get_user_activity_cash_code_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_get_user_activity_cash_code_req = msg_get_user_activity_cash_code_req;

let msg_get_user_activity_cash_code_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.cashCode = this.cashCode;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setCashCode(cashCode){
        this.cashCode = cashCode;
    },

});

module.exports.msg_get_user_activity_cash_code_ret = msg_get_user_activity_cash_code_ret;

let msg_user_cash_activity_reward_history_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.activityId = this.activityId;

        return content;
    },
    setActivityId(activityId){
        this.activityId = activityId;
    },

});

module.exports.msg_user_cash_activity_reward_history_req = msg_user_cash_activity_reward_history_req;

let cash_activity_reward_history = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.rewardTime = this.rewardTime;
        content.rewardCode = this.rewardCode;
        content.rewardRank = this.rewardRank;

        return content;
    },
    setRewardTime(rewardTime){
        this.rewardTime = rewardTime;
    },
    setRewardCode(rewardCode){
        this.rewardCode = rewardCode;
    },
    setRewardRank(rewardRank){
        this.rewardRank = rewardRank;
    },

});

module.exports.cash_activity_reward_history = cash_activity_reward_history;

let msg_cash_activity_reward_history_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.listList = this.listList;

        return content;
    },
    setListList(listList){
        this.listList = listList;
    },

});

module.exports.msg_cash_activity_reward_history_ret = msg_cash_activity_reward_history_ret;

let msg_day_cash_activity_reward_history_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.timestamp = this.timestamp;

        return content;
    },
    setTimestamp(timestamp){
        this.timestamp = timestamp;
    },

});

module.exports.msg_day_cash_activity_reward_history_req = msg_day_cash_activity_reward_history_req;

let day_cash_activity_reward_history = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.userName = this.userName;
        content.head = this.head;
        content.rewardTime = this.rewardTime;
        content.rewardCode = this.rewardCode;
        content.rewardLevel = this.rewardLevel;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setUserName(userName){
        this.userName = userName;
    },
    setHead(head){
        this.head = head;
    },
    setRewardTime(rewardTime){
        this.rewardTime = rewardTime;
    },
    setRewardCode(rewardCode){
        this.rewardCode = rewardCode;
    },
    setRewardLevel(rewardLevel){
        this.rewardLevel = rewardLevel;
    },

});

module.exports.day_cash_activity_reward_history = day_cash_activity_reward_history;

let msg_day_cash_activity_reward_history_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.timestamp = this.timestamp;
        content.listList = this.listList;
        content.tslistList = this.tslistList;

        return content;
    },
    setTimestamp(timestamp){
        this.timestamp = timestamp;
    },
    setListList(listList){
        this.listList = listList;
    },
    setTslistList(tslistList){
        this.tslistList = tslistList;
    },

});

module.exports.msg_day_cash_activity_reward_history_ret = msg_day_cash_activity_reward_history_ret;

let msg_cash_activity_open_tips = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.tipTime = this.tipTime;

        return content;
    },
    setTipTime(tipTime){
        this.tipTime = tipTime;
    },

});

module.exports.msg_cash_activity_open_tips = msg_cash_activity_open_tips;

let msg_cash_activity_open_result_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_cash_activity_open_result_req = msg_cash_activity_open_result_req;

let msg_cash_activity_open_result_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.rankCodeList1List = this.rankCodeList1List;
        content.rankCodeList2List = this.rankCodeList2List;
        content.rankCodeList3List = this.rankCodeList3List;

        return content;
    },
    setRankCodeList1List(rankCodeList1List){
        this.rankCodeList1List = rankCodeList1List;
    },
    setRankCodeList2List(rankCodeList2List){
        this.rankCodeList2List = rankCodeList2List;
    },
    setRankCodeList3List(rankCodeList3List){
        this.rankCodeList3List = rankCodeList3List;
    },

});

module.exports.msg_cash_activity_open_result_ret = msg_cash_activity_open_result_ret;

let activity_spread_user_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.type = this.type;
        content.count = this.count;

        return content;
    },
    setType(type){
        this.type = type;
    },
    setCount(count){
        this.count = count;
    },

});

module.exports.activity_spread_user_info = activity_spread_user_info;

let activity_spread = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.beginTime = this.beginTime;
        content.endTime = this.endTime;
        content.state = this.state;
        content.userInfoList = this.userInfoList;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setBeginTime(beginTime){
        this.beginTime = beginTime;
    },
    setEndTime(endTime){
        this.endTime = endTime;
    },
    setState(state){
        this.state = state;
    },
    setUserInfoList(userInfoList){
        this.userInfoList = userInfoList;
    },

});

module.exports.activity_spread = activity_spread;

let get_activity_spread_notify = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.listList = this.listList;

        return content;
    },
    setListList(listList){
        this.listList = listList;
    },

});

module.exports.get_activity_spread_notify = get_activity_spread_notify;

let msg_activity_spread_notify = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.activityId = this.activityId;
        content.state = this.state;

        return content;
    },
    setActivityId(activityId){
        this.activityId = activityId;
    },
    setState(state){
        this.state = state;
    },

});

module.exports.msg_activity_spread_notify = msg_activity_spread_notify;

let msg_activity_spread_swap_req = cc.Class({
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

module.exports.msg_activity_spread_swap_req = msg_activity_spread_swap_req;

let msg_activity_spread_swap_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gold = this.gold;
        content.state = this.state;
        content.type = this.type;

        return content;
    },
    setGold(gold){
        this.gold = gold;
    },
    setState(state){
        this.state = state;
    },
    setType(type){
        this.type = type;
    },

});

module.exports.msg_activity_spread_swap_ret = msg_activity_spread_swap_ret;

let msg_activity_spread_award_notify = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.type = this.type;
        content.count = this.count;

        return content;
    },
    setType(type){
        this.type = type;
    },
    setCount(count){
        this.count = count;
    },

});

module.exports.msg_activity_spread_award_notify = msg_activity_spread_award_notify;

