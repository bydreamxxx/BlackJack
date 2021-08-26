let msg_register_server_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.linknum = this.linknum;
        content.token = this.token;
        content.type = this.type;
        content.port = this.port;
        content.ip = this.ip;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setLinknum(linknum){
        this.linknum = linknum;
    },
    setToken(token){
        this.token = token;
    },
    setType(type){
        this.type = type;
    },
    setPort(port){
        this.port = port;
    },
    setIp(ip){
        this.ip = ip;
    },

});

module.exports.msg_register_server_req = msg_register_server_req;

let msg_register_server_ack = cc.Class({
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

module.exports.msg_register_server_ack = msg_register_server_ack;

let msg_update_server_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.linknum = this.linknum;

        return content;
    },
    setLinknum(linknum){
        this.linknum = linknum;
    },

});

module.exports.msg_update_server_req = msg_update_server_req;

let nested_user_battle_result = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.name = this.name;
        content.score = this.score;
        content.openId = this.openId;
        content.headUrl = this.headUrl;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setName(name){
        this.name = name;
    },
    setScore(score){
        this.score = score;
    },
    setOpenId(openId){
        this.openId = openId;
    },
    setHeadUrl(headUrl){
        this.headUrl = headUrl;
    },

});

module.exports.nested_user_battle_result = nested_user_battle_result;

let msg_g2h_setUserGameStatus = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.roomType = this.roomType;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setRoomType(roomType){
        this.roomType = roomType;
    },

});

module.exports.msg_g2h_setUserGameStatus = msg_g2h_setUserGameStatus;

let msg_g2h_resetUserGameStatus = cc.Class({
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

module.exports.msg_g2h_resetUserGameStatus = msg_g2h_resetUserGameStatus;

let msg_h2g_syncUserToken = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameType = this.gameType;
        content.gameId = this.gameId;
        content.info = this.info;

        return content;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setGameId(gameId){
        this.gameId = gameId;
    },
    setInfo(info){
        this.info = info;
    },

});

module.exports.msg_h2g_syncUserToken = msg_h2g_syncUserToken;

let msg_g2h_handleUserItem = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.itemId = this.itemId;
        content.num = this.num;
        content.reasonId = this.reasonId;
        content.reason = this.reason;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setItemId(itemId){
        this.itemId = itemId;
    },
    setNum(num){
        this.num = num;
    },
    setReasonId(reasonId){
        this.reasonId = reasonId;
    },
    setReason(reason){
        this.reason = reason;
    },

});

module.exports.msg_g2h_handleUserItem = msg_g2h_handleUserItem;

let nested_user_battle_record = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.roundId = this.roundId;
        content.timestamp = this.timestamp;
        content.resultList = this.resultList;
        content.recordId = this.recordId;

        return content;
    },
    setRoundId(roundId){
        this.roundId = roundId;
    },
    setTimestamp(timestamp){
        this.timestamp = timestamp;
    },
    setResultList(resultList){
        this.resultList = resultList;
    },
    setRecordId(recordId){
        this.recordId = recordId;
    },

});

module.exports.nested_user_battle_record = nested_user_battle_record;

let msg_g2h_user_battle_history = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.historyId = this.historyId;
        content.gameId = this.gameId;
        content.roomId = this.roomId;
        content.timestamp = this.timestamp;
        content.resultList = this.resultList;
        content.detailList = this.detailList;
        content.clubId = this.clubId;
        content.boardscout = this.boardscout;
        content.costcardnum = this.costcardnum;

        return content;
    },
    setHistoryId(historyId){
        this.historyId = historyId;
    },
    setGameId(gameId){
        this.gameId = gameId;
    },
    setRoomId(roomId){
        this.roomId = roomId;
    },
    setTimestamp(timestamp){
        this.timestamp = timestamp;
    },
    setResultList(resultList){
        this.resultList = resultList;
    },
    setDetailList(detailList){
        this.detailList = detailList;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setBoardscout(boardscout){
        this.boardscout = boardscout;
    },
    setCostcardnum(costcardnum){
        this.costcardnum = costcardnum;
    },

});

module.exports.msg_g2h_user_battle_history = msg_g2h_user_battle_history;

let msg_kick_user = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.reason = this.reason;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setReason(reason){
        this.reason = reason;
    },

});

module.exports.msg_kick_user = msg_kick_user;

let msg_user_info = cc.Class({
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

module.exports.msg_user_info = msg_user_info;

let msg_test = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.reason = this.reason;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setReason(reason){
        this.reason = reason;
    },

});

module.exports.msg_test = msg_test;

