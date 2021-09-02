let club_room_rule = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
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
        content.paytype = this.paytype;
        content.iskuaiguo = this.iskuaiguo;

        return content;
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
    setPaytype(paytype){
        this.paytype = paytype;
    },
    setIskuaiguo(iskuaiguo){
        this.iskuaiguo = iskuaiguo;
    },

});

module.exports.club_room_rule = club_room_rule;

let h2g_create_club_desk_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.clubId = this.clubId;
        content.clubRoomId = this.clubRoomId;
        content.roomRule = this.roomRule;
        content.ownerId = this.ownerId;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setClubRoomId(clubRoomId){
        this.clubRoomId = clubRoomId;
    },
    setRoomRule(roomRule){
        this.roomRule = roomRule;
    },
    setOwnerId(ownerId){
        this.ownerId = ownerId;
    },

});

module.exports.h2g_create_club_desk_req = h2g_create_club_desk_req;

let g2h_create_club_desk_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.clubId = this.clubId;
        content.clubRoomId = this.clubRoomId;
        content.roomnum = this.roomnum;
        content.ownerId = this.ownerId;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setClubRoomId(clubRoomId){
        this.clubRoomId = clubRoomId;
    },
    setRoomnum(roomnum){
        this.roomnum = roomnum;
    },
    setOwnerId(ownerId){
        this.ownerId = ownerId;
    },

});

module.exports.g2h_create_club_desk_ack = g2h_create_club_desk_ack;

let g2h_sync_room_member_num = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubId = this.clubId;
        content.roomnum = this.roomnum;
        content.num = this.num;

        return content;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setRoomnum(roomnum){
        this.roomnum = roomnum;
    },
    setNum(num){
        this.num = num;
    },

});

module.exports.g2h_sync_room_member_num = g2h_sync_room_member_num;

let g2h_sync_room_state = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubId = this.clubId;
        content.roomnum = this.roomnum;
        content.roomState = this.roomState;

        return content;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setRoomnum(roomnum){
        this.roomnum = roomnum;
    },
    setRoomState(roomState){
        this.roomState = roomState;
    },

});

module.exports.g2h_sync_room_state = g2h_sync_room_state;

let sync_room_role_score_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.roleId = this.roleId;
        content.score = this.score;

        return content;
    },
    setRoleId(roleId){
        this.roleId = roleId;
    },
    setScore(score){
        this.score = score;
    },

});

module.exports.sync_room_role_score_info = sync_room_role_score_info;

let g2h_sync_room_score = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameType = this.gameType;
        content.roomId = this.roomId;
        content.round = this.round;
        content.scoresList = this.scoresList;

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
    setScoresList(scoresList){
        this.scoresList = scoresList;
    },

});

module.exports.g2h_sync_room_score = g2h_sync_room_score;

