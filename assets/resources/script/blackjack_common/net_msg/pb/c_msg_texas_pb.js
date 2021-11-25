let msg_texas_banker_notify = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.bankerId = this.bankerId;
        content.bigBlindId = this.bigBlindId;
        content.smallBlindId = this.smallBlindId;

        return content;
    },
    setBankerId(bankerId){
        this.bankerId = bankerId;
    },
    setBigBlindId(bigBlindId){
        this.bigBlindId = bigBlindId;
    },
    setSmallBlindId(smallBlindId){
        this.smallBlindId = smallBlindId;
    },

});

module.exports.msg_texas_banker_notify = msg_texas_banker_notify;

let msg_texas_player_poker_notify = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.cardsList = this.cardsList;
        content.winRate = this.winRate;

        return content;
    },
    setCardsList(cardsList){
        this.cardsList = cardsList;
    },
    setWinRate(winRate){
        this.winRate = winRate;
    },

});

module.exports.msg_texas_player_poker_notify = msg_texas_player_poker_notify;

let msg_texas_common_poker_notify = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.round = this.round;
        content.pokerList = this.pokerList;
        content.winRate = this.winRate;
        content.pokerType = this.pokerType;

        return content;
    },
    setRound(round){
        this.round = round;
    },
    setPokerList(pokerList){
        this.pokerList = pokerList;
    },
    setWinRate(winRate){
        this.winRate = winRate;
    },
    setPokerType(pokerType){
        this.pokerType = pokerType;
    },

});

module.exports.msg_texas_common_poker_notify = msg_texas_common_poker_notify;

let msg_texas_bet_notify = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.playerId = this.playerId;
        content.bet = this.bet;
        content.type = this.type;
        content.curGold = this.curGold;

        return content;
    },
    setPlayerId(playerId){
        this.playerId = playerId;
    },
    setBet(bet){
        this.bet = bet;
    },
    setType(type){
        this.type = type;
    },
    setCurGold(curGold){
        this.curGold = curGold;
    },

});

module.exports.msg_texas_bet_notify = msg_texas_bet_notify;

let msg_texas_operate_player_notify = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.playerId = this.playerId;

        return content;
    },
    setPlayerId(playerId){
        this.playerId = playerId;
    },

});

module.exports.msg_texas_operate_player_notify = msg_texas_operate_player_notify;

let msg_texas_bet_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.type = this.type;
        content.bet = this.bet;

        return content;
    },
    setType(type){
        this.type = type;
    },
    setBet(bet){
        this.bet = bet;
    },

});

module.exports.msg_texas_bet_req = msg_texas_bet_req;

let msg_texas_bet_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.result = this.result;
        content.curGold = this.curGold;

        return content;
    },
    setResult(result){
        this.result = result;
    },
    setCurGold(curGold){
        this.curGold = curGold;
    },

});

module.exports.msg_texas_bet_ret = msg_texas_bet_ret;

let msg_texas_auto_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.type = this.type;
        content.flag = this.flag;

        return content;
    },
    setType(type){
        this.type = type;
    },
    setFlag(flag){
        this.flag = flag;
    },

});

module.exports.msg_texas_auto_req = msg_texas_auto_req;

let msg_texas_auto_ret = cc.Class({
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

module.exports.msg_texas_auto_ret = msg_texas_auto_ret;

let nested_texas_user_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.playerId = this.playerId;
        content.seatId = this.seatId;
        content.name = this.name;
        content.openId = this.openId;
        content.headUrl = this.headUrl;
        content.coin = this.coin;
        content.state = this.state;
        content.curBet = this.curBet;
        content.turnBet = this.turnBet;
        content.totalBet = this.totalBet;
        content.cardsList = this.cardsList;
        content.autoType = this.autoType;
        content.autoFlag = this.autoFlag;
        content.joinGame = this.joinGame;
        content.winRate = this.winRate;

        return content;
    },
    setPlayerId(playerId){
        this.playerId = playerId;
    },
    setSeatId(seatId){
        this.seatId = seatId;
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
    setState(state){
        this.state = state;
    },
    setCurBet(curBet){
        this.curBet = curBet;
    },
    setTurnBet(turnBet){
        this.turnBet = turnBet;
    },
    setTotalBet(totalBet){
        this.totalBet = totalBet;
    },
    setCardsList(cardsList){
        this.cardsList = cardsList;
    },
    setAutoType(autoType){
        this.autoType = autoType;
    },
    setAutoFlag(autoFlag){
        this.autoFlag = autoFlag;
    },
    setJoinGame(joinGame){
        this.joinGame = joinGame;
    },
    setWinRate(winRate){
        this.winRate = winRate;
    },

});

module.exports.nested_texas_user_info = nested_texas_user_info;

let msg_texas_room = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.roomType = this.roomType;
        content.roomId = this.roomId;
        content.bankId = this.bankId;
        content.curOpPlayerId = this.curOpPlayerId;
        content.playersList = this.playersList;
        content.commonCardsList = this.commonCardsList;
        content.state = this.state;
        content.lastBet = this.lastBet;
        content.smallBlindId = this.smallBlindId;
        content.bigBlindId = this.bigBlindId;
        content.curOpPlayerTime = this.curOpPlayerTime;

        return content;
    },
    setRoomType(roomType){
        this.roomType = roomType;
    },
    setRoomId(roomId){
        this.roomId = roomId;
    },
    setBankId(bankId){
        this.bankId = bankId;
    },
    setCurOpPlayerId(curOpPlayerId){
        this.curOpPlayerId = curOpPlayerId;
    },
    setPlayersList(playersList){
        this.playersList = playersList;
    },
    setCommonCardsList(commonCardsList){
        this.commonCardsList = commonCardsList;
    },
    setState(state){
        this.state = state;
    },
    setLastBet(lastBet){
        this.lastBet = lastBet;
    },
    setSmallBlindId(smallBlindId){
        this.smallBlindId = smallBlindId;
    },
    setBigBlindId(bigBlindId){
        this.bigBlindId = bigBlindId;
    },
    setCurOpPlayerTime(curOpPlayerTime){
        this.curOpPlayerTime = curOpPlayerTime;
    },

});

module.exports.msg_texas_room = msg_texas_room;

let texas_table_result = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.playerId = this.playerId;
        content.win = this.win;
        content.bet = this.bet;
        content.pokerList = this.pokerList;
        content.type = this.type;
        content.realPokerList = this.realPokerList;

        return content;
    },
    setPlayerId(playerId){
        this.playerId = playerId;
    },
    setWin(win){
        this.win = win;
    },
    setBet(bet){
        this.bet = bet;
    },
    setPokerList(pokerList){
        this.pokerList = pokerList;
    },
    setType(type){
        this.type = type;
    },
    setRealPokerList(realPokerList){
        this.realPokerList = realPokerList;
    },

});

module.exports.texas_table_result = texas_table_result;

let msg_texas_results_notify = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.roomId = this.roomId;
        content.configId = this.configId;
        content.resultList = this.resultList;

        return content;
    },
    setRoomId(roomId){
        this.roomId = roomId;
    },
    setConfigId(configId){
        this.configId = configId;
    },
    setResultList(resultList){
        this.resultList = resultList;
    },

});

module.exports.msg_texas_results_notify = msg_texas_results_notify;

let msg_texas_room_state_notify = cc.Class({
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

module.exports.msg_texas_room_state_notify = msg_texas_room_state_notify;

let nested_texas_player_poker = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.playerid = this.playerid;
        content.cardsList = this.cardsList;

        return content;
    },
    setPlayerid(playerid){
        this.playerid = playerid;
    },
    setCardsList(cardsList){
        this.cardsList = cardsList;
    },

});

module.exports.nested_texas_player_poker = nested_texas_player_poker;

let msg_texas_other_player_poker_notify = cc.Class({
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

module.exports.msg_texas_other_player_poker_notify = msg_texas_other_player_poker_notify;

let msg_texas_sync_coin = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.playerid = this.playerid;
        content.coin = this.coin;

        return content;
    },
    setPlayerid(playerid){
        this.playerid = playerid;
    },
    setCoin(coin){
        this.coin = coin;
    },

});

module.exports.msg_texas_sync_coin = msg_texas_sync_coin;

let texas_player_win_rate = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.playerid = this.playerid;
        content.winRate = this.winRate;

        return content;
    },
    setPlayerid(playerid){
        this.playerid = playerid;
    },
    setWinRate(winRate){
        this.winRate = winRate;
    },

});

module.exports.texas_player_win_rate = texas_player_win_rate;

let msg_texas_test_win_rate = cc.Class({
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

module.exports.msg_texas_test_win_rate = msg_texas_test_win_rate;

let texas_sync_game_status = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.playerid = this.playerid;
        content.joinGame = this.joinGame;

        return content;
    },
    setPlayerid(playerid){
        this.playerid = playerid;
    },
    setJoinGame(joinGame){
        this.joinGame = joinGame;
    },

});

module.exports.texas_sync_game_status = texas_sync_game_status;

let msg_texas_sync_game_status = cc.Class({
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

module.exports.msg_texas_sync_game_status = msg_texas_sync_game_status;

let texas_player_poker_type = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.playerid = this.playerid;
        content.pokerType = this.pokerType;

        return content;
    },
    setPlayerid(playerid){
        this.playerid = playerid;
    },
    setPokerType(pokerType){
        this.pokerType = pokerType;
    },

});

module.exports.texas_player_poker_type = texas_player_poker_type;

let texas_player_list = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.playeridList = this.playeridList;

        return content;
    },
    setPlayeridList(playeridList){
        this.playeridList = playeridList;
    },

});

module.exports.texas_player_list = texas_player_list;

