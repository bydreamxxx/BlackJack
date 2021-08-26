let xy_ddz_rule_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.circleNum = this.circleNum;
        content.maxTimes = this.maxTimes;
        content.beenCallScore = this.beenCallScore;
        content.limitWords = this.limitWords;
        content.cardHolder = this.cardHolder;
        content.limitTalk = this.limitTalk;
        content.gps = this.gps;

        return content;
    },
    setCircleNum(circleNum){
        this.circleNum = circleNum;
    },
    setMaxTimes(maxTimes){
        this.maxTimes = maxTimes;
    },
    setBeenCallScore(beenCallScore){
        this.beenCallScore = beenCallScore;
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

});

module.exports.xy_ddz_rule_info = xy_ddz_rule_info;

let msg_get_room_desks_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameInfo = this.gameInfo;
        content.index = this.index;

        return content;
    },
    setGameInfo(gameInfo){
        this.gameInfo = gameInfo;
    },
    setIndex(index){
        this.index = index;
    },

});

module.exports.msg_get_room_desks_req = msg_get_room_desks_req;

let common_desk = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.roomId = this.roomId;
        content.rolesList = this.rolesList;
        content.argsList = this.argsList;

        return content;
    },
    setRoomId(roomId){
        this.roomId = roomId;
    },
    setRolesList(rolesList){
        this.rolesList = rolesList;
    },
    setArgsList(argsList){
        this.argsList = argsList;
    },

});

module.exports.common_desk = common_desk;

let msg_get_room_desks_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.gameInfo = this.gameInfo;
        content.desksList = this.desksList;
        content.index = this.index;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setGameInfo(gameInfo){
        this.gameInfo = gameInfo;
    },
    setDesksList(desksList){
        this.desksList = desksList;
    },
    setIndex(index){
        this.index = index;
    },

});

module.exports.msg_get_room_desks_ret = msg_get_room_desks_ret;

let msg_room_desk_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameInfo = this.gameInfo;
        content.opType = this.opType;
        content.desk = this.desk;

        return content;
    },
    setGameInfo(gameInfo){
        this.gameInfo = gameInfo;
    },
    setOpType(opType){
        this.opType = opType;
    },
    setDesk(desk){
        this.desk = desk;
    },

});

module.exports.msg_room_desk_info = msg_room_desk_info;

let msg_leave_room_desks_req = cc.Class({
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

module.exports.msg_leave_room_desks_req = msg_leave_room_desks_req;

let msg_card_charge_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.cardNum = this.cardNum;

        return content;
    },
    setCardNum(cardNum){
        this.cardNum = cardNum;
    },

});

module.exports.msg_card_charge_req = msg_card_charge_req;

let msg_card_charge_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.rewardList = this.rewardList;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setRewardList(rewardList){
        this.rewardList = rewardList;
    },

});

module.exports.msg_card_charge_ret = msg_card_charge_ret;

