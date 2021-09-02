let msg_create_club_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.type = this.type;
        content.clubName = this.clubName;

        return content;
    },
    setType(type){
        this.type = type;
    },
    setClubName(clubName){
        this.clubName = clubName;
    },

});

module.exports.msg_create_club_req = msg_create_club_req;

let msg_create_club_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.club = this.club;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setClub(club){
        this.club = club;
    },

});

module.exports.msg_create_club_ret = msg_create_club_ret;

let msg_dissolve_club_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubId = this.clubId;

        return content;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },

});

module.exports.msg_dissolve_club_req = msg_dissolve_club_req;

let msg_dissolve_club_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.clubId = this.clubId;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },

});

module.exports.msg_dissolve_club_ret = msg_dissolve_club_ret;

let msg_leave_club_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubid = this.clubid;

        return content;
    },
    setClubid(clubid){
        this.clubid = clubid;
    },

});

module.exports.msg_leave_club_req = msg_leave_club_req;

let msg_leave_club_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.leaveUserId = this.leaveUserId;
        content.clubId = this.clubId;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setLeaveUserId(leaveUserId){
        this.leaveUserId = leaveUserId;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },

});

module.exports.msg_leave_club_ret = msg_leave_club_ret;

let msg_kick_club_role_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubId = this.clubId;
        content.kickUserId = this.kickUserId;

        return content;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setKickUserId(kickUserId){
        this.kickUserId = kickUserId;
    },

});

module.exports.msg_kick_club_role_req = msg_kick_club_role_req;

let msg_kick_club_role_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.clubId = this.clubId;
        content.kickUserId = this.kickUserId;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setKickUserId(kickUserId){
        this.kickUserId = kickUserId;
    },

});

module.exports.msg_kick_club_role_ret = msg_kick_club_role_ret;

let msg_get_all_club_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_get_all_club_req = msg_get_all_club_req;

let club_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubid = this.clubid;
        content.clubname = this.clubname;
        content.maxnum = this.maxnum;
        content.curnum = this.curnum;
        content.owneruserid = this.owneruserid;
        content.ownername = this.ownername;
        content.headurl = this.headurl;
        content.openid = this.openid;
        content.isjoin = this.isjoin;
        content.cards = this.cards;
        content.gameRightsList = this.gameRightsList;
        content.clubScore = this.clubScore;
        content.userScore = this.userScore;
        content.type = this.type;
        content.deskWaitSum = this.deskWaitSum;
        content.deskWorkSum = this.deskWorkSum;
        content.state = this.state;
        content.battleType = this.battleType;

        return content;
    },
    setClubid(clubid){
        this.clubid = clubid;
    },
    setClubname(clubname){
        this.clubname = clubname;
    },
    setMaxnum(maxnum){
        this.maxnum = maxnum;
    },
    setCurnum(curnum){
        this.curnum = curnum;
    },
    setOwneruserid(owneruserid){
        this.owneruserid = owneruserid;
    },
    setOwnername(ownername){
        this.ownername = ownername;
    },
    setHeadurl(headurl){
        this.headurl = headurl;
    },
    setOpenid(openid){
        this.openid = openid;
    },
    setIsjoin(isjoin){
        this.isjoin = isjoin;
    },
    setCards(cards){
        this.cards = cards;
    },
    setGameRightsList(gameRightsList){
        this.gameRightsList = gameRightsList;
    },
    setClubScore(clubScore){
        this.clubScore = clubScore;
    },
    setUserScore(userScore){
        this.userScore = userScore;
    },
    setType(type){
        this.type = type;
    },
    setDeskWaitSum(deskWaitSum){
        this.deskWaitSum = deskWaitSum;
    },
    setDeskWorkSum(deskWorkSum){
        this.deskWorkSum = deskWorkSum;
    },
    setState(state){
        this.state = state;
    },
    setBattleType(battleType){
        this.battleType = battleType;
    },

});

module.exports.club_info = club_info;

let msg_get_all_club_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.clubsList = this.clubsList;
        content.roomsList = this.roomsList;
        content.clubId = this.clubId;
        content.applyListList = this.applyListList;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setClubsList(clubsList){
        this.clubsList = clubsList;
    },
    setRoomsList(roomsList){
        this.roomsList = roomsList;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setApplyListList(applyListList){
        this.applyListList = applyListList;
    },

});

module.exports.msg_get_all_club_ret = msg_get_all_club_ret;

let msg_open_club_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubid = this.clubid;

        return content;
    },
    setClubid(clubid){
        this.clubid = clubid;
    },

});

module.exports.msg_open_club_req = msg_open_club_req;

let club_member = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userid = this.userid;
        content.name = this.name;
        content.isonline = this.isonline;
        content.job = this.job;
        content.headurl = this.headurl;
        content.openid = this.openid;
        content.gameRightsList = this.gameRightsList;
        content.joinTime = this.joinTime;
        content.state = this.state;
        content.score = this.score;
        content.site = this.site;

        return content;
    },
    setUserid(userid){
        this.userid = userid;
    },
    setName(name){
        this.name = name;
    },
    setIsonline(isonline){
        this.isonline = isonline;
    },
    setJob(job){
        this.job = job;
    },
    setHeadurl(headurl){
        this.headurl = headurl;
    },
    setOpenid(openid){
        this.openid = openid;
    },
    setGameRightsList(gameRightsList){
        this.gameRightsList = gameRightsList;
    },
    setJoinTime(joinTime){
        this.joinTime = joinTime;
    },
    setState(state){
        this.state = state;
    },
    setScore(score){
        this.score = score;
    },
    setSite(site){
        this.site = site;
    },

});

module.exports.club_member = club_member;

let club_room = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameType = this.gameType;
        content.roomId = this.roomId;
        content.juNum = this.juNum;
        content.curJuNum = this.curJuNum;
        content.createTime = this.createTime;
        content.curUserNum = this.curUserNum;
        content.maxUserNum = this.maxUserNum;
        content.createUserId = this.createUserId;
        content.membersList = this.membersList;
        content.state = this.state;
        content.desknum = this.desknum;

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
    setCurUserNum(curUserNum){
        this.curUserNum = curUserNum;
    },
    setMaxUserNum(maxUserNum){
        this.maxUserNum = maxUserNum;
    },
    setCreateUserId(createUserId){
        this.createUserId = createUserId;
    },
    setMembersList(membersList){
        this.membersList = membersList;
    },
    setState(state){
        this.state = state;
    },
    setDesknum(desknum){
        this.desknum = desknum;
    },

});

module.exports.club_room = club_room;

let msg_open_club_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.clubInfo = this.clubInfo;
        content.roomsList = this.roomsList;
        content.rebBagSum = this.rebBagSum;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setClubInfo(clubInfo){
        this.clubInfo = clubInfo;
    },
    setRoomsList(roomsList){
        this.roomsList = roomsList;
    },
    setRebBagSum(rebBagSum){
        this.rebBagSum = rebBagSum;
    },

});

module.exports.msg_open_club_ret = msg_open_club_ret;

let msg_club_manger_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubId = this.clubId;

        return content;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },

});

module.exports.msg_club_manger_req = msg_club_manger_req;

let msg_club_manger_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubId = this.clubId;
        content.ownerId = this.ownerId;
        content.managersList = this.managersList;
        content.onlineSum = this.onlineSum;
        content.allSum = this.allSum;

        return content;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setOwnerId(ownerId){
        this.ownerId = ownerId;
    },
    setManagersList(managersList){
        this.managersList = managersList;
    },
    setOnlineSum(onlineSum){
        this.onlineSum = onlineSum;
    },
    setAllSum(allSum){
        this.allSum = allSum;
    },

});

module.exports.msg_club_manger_ack = msg_club_manger_ack;

let msg_club_chatReq = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubId = this.clubId;
        content.talkId = this.talkId;
        content.chat = this.chat;

        return content;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setTalkId(talkId){
        this.talkId = talkId;
    },
    setChat(chat){
        this.chat = chat;
    },

});

module.exports.msg_club_chatReq = msg_club_chatReq;

let msg_club_chatRet = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.clubid = this.clubid;
        content.chat = this.chat;
        content.sendId = this.sendId;
        content.sendName = this.sendName;
        content.sendJob = this.sendJob;
        content.time = this.time;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setClubid(clubid){
        this.clubid = clubid;
    },
    setChat(chat){
        this.chat = chat;
    },
    setSendId(sendId){
        this.sendId = sendId;
    },
    setSendName(sendName){
        this.sendName = sendName;
    },
    setSendJob(sendJob){
        this.sendJob = sendJob;
    },
    setTime(time){
        this.time = time;
    },

});

module.exports.msg_club_chatRet = msg_club_chatRet;

let msg_club_chat_desk_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.roomId = this.roomId;
        content.chat = this.chat;

        return content;
    },
    setRoomId(roomId){
        this.roomId = roomId;
    },
    setChat(chat){
        this.chat = chat;
    },

});

module.exports.msg_club_chat_desk_req = msg_club_chat_desk_req;

let msg_club_chat_desk_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubId = this.clubId;
        content.roomId = this.roomId;
        content.chat = this.chat;
        content.time = this.time;

        return content;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setRoomId(roomId){
        this.roomId = roomId;
    },
    setChat(chat){
        this.chat = chat;
    },
    setTime(time){
        this.time = time;
    },

});

module.exports.msg_club_chat_desk_ack = msg_club_chat_desk_ack;

let msg_club_chat_player_sum_change_cast = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubId = this.clubId;
        content.onlineSum = this.onlineSum;
        content.allSum = this.allSum;

        return content;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setOnlineSum(onlineSum){
        this.onlineSum = onlineSum;
    },
    setAllSum(allSum){
        this.allSum = allSum;
    },

});

module.exports.msg_club_chat_player_sum_change_cast = msg_club_chat_player_sum_change_cast;

let msg_club_chat_all_player_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubId = this.clubId;

        return content;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },

});

module.exports.msg_club_chat_all_player_req = msg_club_chat_all_player_req;

let club_chat_player = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.name = this.name;
        content.state = this.state;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setName(name){
        this.name = name;
    },
    setState(state){
        this.state = state;
    },

});

module.exports.club_chat_player = club_chat_player;

let msg_club_chat_all_player_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.result = this.result;
        content.clubId = this.clubId;
        content.allPage = this.allPage;
        content.page = this.page;
        content.playersList = this.playersList;

        return content;
    },
    setResult(result){
        this.result = result;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setAllPage(allPage){
        this.allPage = allPage;
    },
    setPage(page){
        this.page = page;
    },
    setPlayersList(playersList){
        this.playersList = playersList;
    },

});

module.exports.msg_club_chat_all_player_ack = msg_club_chat_all_player_ack;

let msg_club_chat_stop_talk_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubId = this.clubId;
        content.type = this.type;
        content.playerId = this.playerId;
        content.state = this.state;

        return content;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setType(type){
        this.type = type;
    },
    setPlayerId(playerId){
        this.playerId = playerId;
    },
    setState(state){
        this.state = state;
    },

});

module.exports.msg_club_chat_stop_talk_req = msg_club_chat_stop_talk_req;

let msg_club_chat_stop_talk_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.result = this.result;
        content.playerId = this.playerId;
        content.state = this.state;

        return content;
    },
    setResult(result){
        this.result = result;
    },
    setPlayerId(playerId){
        this.playerId = playerId;
    },
    setState(state){
        this.state = state;
    },

});

module.exports.msg_club_chat_stop_talk_ack = msg_club_chat_stop_talk_ack;

let msg_cur_club = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubId = this.clubId;
        content.state = this.state;

        return content;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setState(state){
        this.state = state;
    },

});

module.exports.msg_cur_club = msg_cur_club;

let msg_club_share_red_bag_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubId = this.clubId;
        content.type = this.type;
        content.coins = this.coins;
        content.sum = this.sum;
        content.msg = this.msg;

        return content;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setType(type){
        this.type = type;
    },
    setCoins(coins){
        this.coins = coins;
    },
    setSum(sum){
        this.sum = sum;
    },
    setMsg(msg){
        this.msg = msg;
    },

});

module.exports.msg_club_share_red_bag_req = msg_club_share_red_bag_req;

let msg_club_share_red_bag_ack = cc.Class({
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

module.exports.msg_club_share_red_bag_ack = msg_club_share_red_bag_ack;

let rob_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.name = this.name;
        content.sum = this.sum;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setName(name){
        this.name = name;
    },
    setSum(sum){
        this.sum = sum;
    },

});

module.exports.rob_info = rob_info;

let red_bag_base_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.ownerName = this.ownerName;
        content.openId = this.openId;
        content.headUrl = this.headUrl;
        content.msg = this.msg;
        content.leftSum = this.leftSum;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setOwnerName(ownerName){
        this.ownerName = ownerName;
    },
    setOpenId(openId){
        this.openId = openId;
    },
    setHeadUrl(headUrl){
        this.headUrl = headUrl;
    },
    setMsg(msg){
        this.msg = msg;
    },
    setLeftSum(leftSum){
        this.leftSum = leftSum;
    },

});

module.exports.red_bag_base_info = red_bag_base_info;

let red_bag_cast = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.info = this.info;

        return content;
    },
    setInfo(info){
        this.info = info;
    },

});

module.exports.red_bag_cast = red_bag_cast;

let msg_club_red_bag_list_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubId = this.clubId;
        content.page = this.page;

        return content;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setPage(page){
        this.page = page;
    },

});

module.exports.msg_club_red_bag_list_req = msg_club_red_bag_list_req;

let msg_club_red_bag_list_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.result = this.result;
        content.page = this.page;
        content.allPage = this.allPage;
        content.bagsList = this.bagsList;

        return content;
    },
    setResult(result){
        this.result = result;
    },
    setPage(page){
        this.page = page;
    },
    setAllPage(allPage){
        this.allPage = allPage;
    },
    setBagsList(bagsList){
        this.bagsList = bagsList;
    },

});

module.exports.msg_club_red_bag_list_ack = msg_club_red_bag_list_ack;

let msg_red_bag_detail_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubId = this.clubId;
        content.id = this.id;

        return content;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setId(id){
        this.id = id;
    },

});

module.exports.msg_red_bag_detail_req = msg_red_bag_detail_req;

let msg_red_bag_detail_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.result = this.result;
        content.id = this.id;
        content.ownerId = this.ownerId;
        content.ownerName = this.ownerName;
        content.openId = this.openId;
        content.headUrl = this.headUrl;
        content.allCoin = this.allCoin;
        content.allSum = this.allSum;
        content.leftSum = this.leftSum;
        content.robsList = this.robsList;
        content.type = this.type;

        return content;
    },
    setResult(result){
        this.result = result;
    },
    setId(id){
        this.id = id;
    },
    setOwnerId(ownerId){
        this.ownerId = ownerId;
    },
    setOwnerName(ownerName){
        this.ownerName = ownerName;
    },
    setOpenId(openId){
        this.openId = openId;
    },
    setHeadUrl(headUrl){
        this.headUrl = headUrl;
    },
    setAllCoin(allCoin){
        this.allCoin = allCoin;
    },
    setAllSum(allSum){
        this.allSum = allSum;
    },
    setLeftSum(leftSum){
        this.leftSum = leftSum;
    },
    setRobsList(robsList){
        this.robsList = robsList;
    },
    setType(type){
        this.type = type;
    },

});

module.exports.msg_red_bag_detail_ack = msg_red_bag_detail_ack;

let msg_rob_bag_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubId = this.clubId;
        content.id = this.id;

        return content;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setId(id){
        this.id = id;
    },

});

module.exports.msg_rob_bag_req = msg_rob_bag_req;

let msg_rob_bag_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.result = this.result;
        content.id = this.id;
        content.sum = this.sum;
        content.leftSum = this.leftSum;
        content.type = this.type;

        return content;
    },
    setResult(result){
        this.result = result;
    },
    setId(id){
        this.id = id;
    },
    setSum(sum){
        this.sum = sum;
    },
    setLeftSum(leftSum){
        this.leftSum = leftSum;
    },
    setType(type){
        this.type = type;
    },

});

module.exports.msg_rob_bag_ack = msg_rob_bag_ack;

let msg_join_club_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubid = this.clubid;

        return content;
    },
    setClubid(clubid){
        this.clubid = clubid;
    },

});

module.exports.msg_join_club_req = msg_join_club_req;

let msg_join_club_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.clubid = this.clubid;
        content.clubname = this.clubname;
        content.type = this.type;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setClubid(clubid){
        this.clubid = clubid;
    },
    setClubname(clubname){
        this.clubname = clubname;
    },
    setType(type){
        this.type = type;
    },

});

module.exports.msg_join_club_ret = msg_join_club_ret;

let msg_apply_club_op_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.opType = this.opType;
        content.clubId = this.clubId;
        content.opUserid = this.opUserid;

        return content;
    },
    setOpType(opType){
        this.opType = opType;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setOpUserid(opUserid){
        this.opUserid = opUserid;
    },

});

module.exports.msg_apply_club_op_req = msg_apply_club_op_req;

let apply_member = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.name = this.name;
        content.url = this.url;
        content.openid = this.openid;
        content.applyTime = this.applyTime;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setName(name){
        this.name = name;
    },
    setUrl(url){
        this.url = url;
    },
    setOpenid(openid){
        this.openid = openid;
    },
    setApplyTime(applyTime){
        this.applyTime = applyTime;
    },

});

module.exports.apply_member = apply_member;

let msg_apply_club_op_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.opType = this.opType;
        content.retCode = this.retCode;
        content.clubId = this.clubId;
        content.opUserid = this.opUserid;
        content.applyListList = this.applyListList;

        return content;
    },
    setOpType(opType){
        this.opType = opType;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setOpUserid(opUserid){
        this.opUserid = opUserid;
    },
    setApplyListList(applyListList){
        this.applyListList = applyListList;
    },

});

module.exports.msg_apply_club_op_ret = msg_apply_club_op_ret;

let msg_open_club_manage_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubId = this.clubId;

        return content;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },

});

module.exports.msg_open_club_manage_req = msg_open_club_manage_req;

let msg_open_club_manage_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.page = this.page;
        content.allPage = this.allPage;
        content.membersList = this.membersList;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setPage(page){
        this.page = page;
    },
    setAllPage(allPage){
        this.allPage = allPage;
    },
    setMembersList(membersList){
        this.membersList = membersList;
    },

});

module.exports.msg_open_club_manage_ret = msg_open_club_manage_ret;

let msg_club_manage_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubId = this.clubId;
        content.gameRightsList = this.gameRightsList;
        content.setUserId = this.setUserId;

        return content;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setGameRightsList(gameRightsList){
        this.gameRightsList = gameRightsList;
    },
    setSetUserId(setUserId){
        this.setUserId = setUserId;
    },

});

module.exports.msg_club_manage_req = msg_club_manage_req;

let msg_club_manage_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.userId = this.userId;
        content.gameRightsList = this.gameRightsList;
        content.clubId = this.clubId;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setGameRightsList(gameRightsList){
        this.gameRightsList = gameRightsList;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },

});

module.exports.msg_club_manage_ret = msg_club_manage_ret;

let msg_club_change_name_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubId = this.clubId;
        content.name = this.name;

        return content;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setName(name){
        this.name = name;
    },

});

module.exports.msg_club_change_name_req = msg_club_change_name_req;

let msg_club_change_name_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.clubId = this.clubId;
        content.name = this.name;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setName(name){
        this.name = name;
    },

});

module.exports.msg_club_change_name_ret = msg_club_change_name_ret;

let msg_club_refresh_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubId = this.clubId;
        content.baofang = this.baofang;

        return content;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setBaofang(baofang){
        this.baofang = baofang;
    },

});

module.exports.msg_club_refresh_req = msg_club_refresh_req;

let msg_club_refresh_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.clubId = this.clubId;
        content.baofang = this.baofang;
        content.deskWaitSum = this.deskWaitSum;
        content.deskWorkSum = this.deskWorkSum;
        content.roomsList = this.roomsList;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setBaofang(baofang){
        this.baofang = baofang;
    },
    setDeskWaitSum(deskWaitSum){
        this.deskWaitSum = deskWaitSum;
    },
    setDeskWorkSum(deskWorkSum){
        this.deskWorkSum = deskWorkSum;
    },
    setRoomsList(roomsList){
        this.roomsList = roomsList;
    },

});

module.exports.msg_club_refresh_ret = msg_club_refresh_ret;

let msg_club_store_cards_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.cards = this.cards;
        content.clubId = this.clubId;

        return content;
    },
    setCards(cards){
        this.cards = cards;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },

});

module.exports.msg_club_store_cards_req = msg_club_store_cards_req;

let msg_club_store_cards_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.cards = this.cards;
        content.clubId = this.clubId;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setCards(cards){
        this.cards = cards;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },

});

module.exports.msg_club_store_cards_ret = msg_club_store_cards_ret;

let msg_club_dissolve_room_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubId = this.clubId;
        content.roomId = this.roomId;
        content.gameType = this.gameType;
        content.wanfanum = this.wanfanum;
        content.desknum = this.desknum;

        return content;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setRoomId(roomId){
        this.roomId = roomId;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setWanfanum(wanfanum){
        this.wanfanum = wanfanum;
    },
    setDesknum(desknum){
        this.desknum = desknum;
    },

});

module.exports.msg_club_dissolve_room_req = msg_club_dissolve_room_req;

let msg_club_dissolve_room_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.clubId = this.clubId;
        content.roomId = this.roomId;
        content.wanfanum = this.wanfanum;
        content.desknum = this.desknum;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setRoomId(roomId){
        this.roomId = roomId;
    },
    setWanfanum(wanfanum){
        this.wanfanum = wanfanum;
    },
    setDesknum(desknum){
        this.desknum = desknum;
    },

});

module.exports.msg_club_dissolve_room_ret = msg_club_dissolve_room_ret;

let msg_club_room_kickout_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubId = this.clubId;
        content.wanfanum = this.wanfanum;
        content.deskId = this.deskId;
        content.roomId = this.roomId;
        content.kickUserId = this.kickUserId;
        content.gameType = this.gameType;

        return content;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setWanfanum(wanfanum){
        this.wanfanum = wanfanum;
    },
    setDeskId(deskId){
        this.deskId = deskId;
    },
    setRoomId(roomId){
        this.roomId = roomId;
    },
    setKickUserId(kickUserId){
        this.kickUserId = kickUserId;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },

});

module.exports.msg_club_room_kickout_req = msg_club_room_kickout_req;

let msg_club_room_kickout_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.clubId = this.clubId;
        content.wanfanum = this.wanfanum;
        content.deskId = this.deskId;
        content.roomId = this.roomId;
        content.kickUserId = this.kickUserId;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setWanfanum(wanfanum){
        this.wanfanum = wanfanum;
    },
    setDeskId(deskId){
        this.deskId = deskId;
    },
    setRoomId(roomId){
        this.roomId = roomId;
    },
    setKickUserId(kickUserId){
        this.kickUserId = kickUserId;
    },

});

module.exports.msg_club_room_kickout_ret = msg_club_room_kickout_ret;

let msg_club_room_update = cc.Class({
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

module.exports.msg_club_room_update = msg_club_room_update;

let msg_club_battle_history_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubid = this.clubid;
        content.whichday = this.whichday;

        return content;
    },
    setClubid(clubid){
        this.clubid = clubid;
    },
    setWhichday(whichday){
        this.whichday = whichday;
    },

});

module.exports.msg_club_battle_history_req = msg_club_battle_history_req;

let club_battle_history_detail = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.historyId = this.historyId;
        content.roomId = this.roomId;
        content.timestamp = this.timestamp;
        content.costroomcard = this.costroomcard;
        content.boardscount = this.boardscount;
        content.resultList = this.resultList;
        content.createUserId = this.createUserId;
        content.gameType = this.gameType;
        content.roomType = this.roomType;
        content.dissolveRoleId = this.dissolveRoleId;

        return content;
    },
    setHistoryId(historyId){
        this.historyId = historyId;
    },
    setRoomId(roomId){
        this.roomId = roomId;
    },
    setTimestamp(timestamp){
        this.timestamp = timestamp;
    },
    setCostroomcard(costroomcard){
        this.costroomcard = costroomcard;
    },
    setBoardscount(boardscount){
        this.boardscount = boardscount;
    },
    setResultList(resultList){
        this.resultList = resultList;
    },
    setCreateUserId(createUserId){
        this.createUserId = createUserId;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setRoomType(roomType){
        this.roomType = roomType;
    },
    setDissolveRoleId(dissolveRoleId){
        this.dissolveRoleId = dissolveRoleId;
    },

});

module.exports.club_battle_history_detail = club_battle_history_detail;

let msg_club_battle_history_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubid = this.clubid;
        content.whichday = this.whichday;
        content.detailList = this.detailList;
        content.selfRoom = this.selfRoom;
        content.selfRoomCards = this.selfRoomCards;
        content.matchRoom = this.matchRoom;
        content.matchRoomCards = this.matchRoomCards;

        return content;
    },
    setClubid(clubid){
        this.clubid = clubid;
    },
    setWhichday(whichday){
        this.whichday = whichday;
    },
    setDetailList(detailList){
        this.detailList = detailList;
    },
    setSelfRoom(selfRoom){
        this.selfRoom = selfRoom;
    },
    setSelfRoomCards(selfRoomCards){
        this.selfRoomCards = selfRoomCards;
    },
    setMatchRoom(matchRoom){
        this.matchRoom = matchRoom;
    },
    setMatchRoomCards(matchRoomCards){
        this.matchRoomCards = matchRoomCards;
    },

});

module.exports.msg_club_battle_history_ack = msg_club_battle_history_ack;

let msg_invited_task_reward = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.itemId = this.itemId;
        content.itemNum = this.itemNum;

        return content;
    },
    setItemId(itemId){
        this.itemId = itemId;
    },
    setItemNum(itemNum){
        this.itemNum = itemNum;
    },

});

module.exports.msg_invited_task_reward = msg_invited_task_reward;

let msg_club_change_score_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubId = this.clubId;
        content.userId = this.userId;
        content.score = this.score;

        return content;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setScore(score){
        this.score = score;
    },

});

module.exports.msg_club_change_score_req = msg_club_change_score_req;

let msg_club_change_score_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.clubId = this.clubId;
        content.clubScore = this.clubScore;
        content.userId = this.userId;
        content.userScore = this.userScore;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setClubScore(clubScore){
        this.clubScore = clubScore;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setUserScore(userScore){
        this.userScore = userScore;
    },

});

module.exports.msg_club_change_score_ret = msg_club_change_score_ret;

let msg_clue_update_score = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubId = this.clubId;
        content.userId = this.userId;
        content.userScore = this.userScore;

        return content;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setUserScore(userScore){
        this.userScore = userScore;
    },

});

module.exports.msg_clue_update_score = msg_clue_update_score;

let msg_club_create_baofang_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubId = this.clubId;
        content.rule = this.rule;

        return content;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setRule(rule){
        this.rule = rule;
    },

});

module.exports.msg_club_create_baofang_req = msg_club_create_baofang_req;

let msg_club_create_baofang_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.result = this.result;
        content.wanfanum = this.wanfanum;

        return content;
    },
    setResult(result){
        this.result = result;
    },
    setWanfanum(wanfanum){
        this.wanfanum = wanfanum;
    },

});

module.exports.msg_club_create_baofang_ack = msg_club_create_baofang_ack;

let msg_club_del_baofang_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubId = this.clubId;
        content.wanfanum = this.wanfanum;

        return content;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setWanfanum(wanfanum){
        this.wanfanum = wanfanum;
    },

});

module.exports.msg_club_del_baofang_req = msg_club_del_baofang_req;

let msg_club_del_baofang_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.result = this.result;
        content.clubId = this.clubId;
        content.wanfanum = this.wanfanum;

        return content;
    },
    setResult(result){
        this.result = result;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setWanfanum(wanfanum){
        this.wanfanum = wanfanum;
    },

});

module.exports.msg_club_del_baofang_ack = msg_club_del_baofang_ack;

let msg_club_baofang_list_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubId = this.clubId;

        return content;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },

});

module.exports.msg_club_baofang_list_req = msg_club_baofang_list_req;

let msg_club_baofang_list_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.result = this.result;
        content.wanfanumList = this.wanfanumList;
        content.ruleList = this.ruleList;
        content.baofangNameList = this.baofangNameList;

        return content;
    },
    setResult(result){
        this.result = result;
    },
    setWanfanumList(wanfanumList){
        this.wanfanumList = wanfanumList;
    },
    setRuleList(ruleList){
        this.ruleList = ruleList;
    },
    setBaofangNameList(baofangNameList){
        this.baofangNameList = baofangNameList;
    },

});

module.exports.msg_club_baofang_list_ack = msg_club_baofang_list_ack;

let msg_club_baofang_detail_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubId = this.clubId;
        content.wanfanum = this.wanfanum;

        return content;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setWanfanum(wanfanum){
        this.wanfanum = wanfanum;
    },

});

module.exports.msg_club_baofang_detail_req = msg_club_baofang_detail_req;

let msg_club_baofang_detail_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.result = this.result;
        content.wanfanum = this.wanfanum;
        content.deskWaitSum = this.deskWaitSum;
        content.deskWorkSum = this.deskWorkSum;
        content.roomsList = this.roomsList;

        return content;
    },
    setResult(result){
        this.result = result;
    },
    setWanfanum(wanfanum){
        this.wanfanum = wanfanum;
    },
    setDeskWaitSum(deskWaitSum){
        this.deskWaitSum = deskWaitSum;
    },
    setDeskWorkSum(deskWorkSum){
        this.deskWorkSum = deskWorkSum;
    },
    setRoomsList(roomsList){
        this.roomsList = roomsList;
    },

});

module.exports.msg_club_baofang_detail_ack = msg_club_baofang_detail_ack;

let msg_club_baofang_site = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubId = this.clubId;
        content.roomId = this.roomId;

        return content;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setRoomId(roomId){
        this.roomId = roomId;
    },

});

module.exports.msg_club_baofang_site = msg_club_baofang_site;

let msg_club_baofang_site_cast = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubId = this.clubId;
        content.wanfanum = this.wanfanum;
        content.deskNum = this.deskNum;
        content.room = this.room;
        content.deskWaitSum = this.deskWaitSum;
        content.deskWorkSum = this.deskWorkSum;

        return content;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setWanfanum(wanfanum){
        this.wanfanum = wanfanum;
    },
    setDeskNum(deskNum){
        this.deskNum = deskNum;
    },
    setRoom(room){
        this.room = room;
    },
    setDeskWaitSum(deskWaitSum){
        this.deskWaitSum = deskWaitSum;
    },
    setDeskWorkSum(deskWorkSum){
        this.deskWorkSum = deskWorkSum;
    },

});

module.exports.msg_club_baofang_site_cast = msg_club_baofang_site_cast;

let msg_club_change_notice_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubId = this.clubId;
        content.notice = this.notice;

        return content;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setNotice(notice){
        this.notice = notice;
    },

});

module.exports.msg_club_change_notice_req = msg_club_change_notice_req;

let msg_club_change_notice_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.result = this.result;
        content.clubId = this.clubId;
        content.notice = this.notice;

        return content;
    },
    setResult(result){
        this.result = result;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setNotice(notice){
        this.notice = notice;
    },

});

module.exports.msg_club_change_notice_ack = msg_club_change_notice_ack;

let msg_club_notice_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubId = this.clubId;

        return content;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },

});

module.exports.msg_club_notice_req = msg_club_notice_req;

let msg_club_notice_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.result = this.result;
        content.clubId = this.clubId;
        content.notice = this.notice;

        return content;
    },
    setResult(result){
        this.result = result;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setNotice(notice){
        this.notice = notice;
    },

});

module.exports.msg_club_notice_ack = msg_club_notice_ack;

let msg_club_rank_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubId = this.clubId;
        content.type = this.type;
        content.gameType = this.gameType;

        return content;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setType(type){
        this.type = type;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },

});

module.exports.msg_club_rank_req = msg_club_rank_req;

let club_rank_node = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.userName = this.userName;
        content.headUrl = this.headUrl;
        content.openId = this.openId;
        content.score = this.score;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setUserName(userName){
        this.userName = userName;
    },
    setHeadUrl(headUrl){
        this.headUrl = headUrl;
    },
    setOpenId(openId){
        this.openId = openId;
    },
    setScore(score){
        this.score = score;
    },

});

module.exports.club_rank_node = club_rank_node;

let msg_club_rank_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.result = this.result;
        content.type = this.type;
        content.gameType = this.gameType;
        content.rankType = this.rankType;
        content.rankList = this.rankList;

        return content;
    },
    setResult(result){
        this.result = result;
    },
    setType(type){
        this.type = type;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setRankType(rankType){
        this.rankType = rankType;
    },
    setRankList(rankList){
        this.rankList = rankList;
    },

});

module.exports.msg_club_rank_ack = msg_club_rank_ack;

let msg_club_invite_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubId = this.clubId;
        content.userId = this.userId;

        return content;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setUserId(userId){
        this.userId = userId;
    },

});

module.exports.msg_club_invite_req = msg_club_invite_req;

let msg_club_invite_ack = cc.Class({
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

module.exports.msg_club_invite_ack = msg_club_invite_ack;

let msg_club_invite = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubId = this.clubId;
        content.clubName = this.clubName;
        content.whoReq = this.whoReq;
        content.userName = this.userName;

        return content;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setClubName(clubName){
        this.clubName = clubName;
    },
    setWhoReq(whoReq){
        this.whoReq = whoReq;
    },
    setUserName(userName){
        this.userName = userName;
    },

});

module.exports.msg_club_invite = msg_club_invite;

let msg_friend_create_battle_history_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_friend_create_battle_history_req = msg_friend_create_battle_history_req;

let friend_create_battle_history_detail = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.historyId = this.historyId;
        content.roomId = this.roomId;
        content.timestamp = this.timestamp;
        content.costroomcard = this.costroomcard;
        content.boardscount = this.boardscount;
        content.resultList = this.resultList;
        content.isRoomOpen = this.isRoomOpen;
        content.gameType = this.gameType;
        content.dissolveRoleId = this.dissolveRoleId;

        return content;
    },
    setHistoryId(historyId){
        this.historyId = historyId;
    },
    setRoomId(roomId){
        this.roomId = roomId;
    },
    setTimestamp(timestamp){
        this.timestamp = timestamp;
    },
    setCostroomcard(costroomcard){
        this.costroomcard = costroomcard;
    },
    setBoardscount(boardscount){
        this.boardscount = boardscount;
    },
    setResultList(resultList){
        this.resultList = resultList;
    },
    setIsRoomOpen(isRoomOpen){
        this.isRoomOpen = isRoomOpen;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setDissolveRoleId(dissolveRoleId){
        this.dissolveRoleId = dissolveRoleId;
    },

});

module.exports.friend_create_battle_history_detail = friend_create_battle_history_detail;

let msg_friend_create_battle_history_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.detailList = this.detailList;

        return content;
    },
    setDetailList(detailList){
        this.detailList = detailList;
    },

});

module.exports.msg_friend_create_battle_history_ret = msg_friend_create_battle_history_ret;

let msg_friend_create_dissolve_room_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.roomId = this.roomId;
        content.gameType = this.gameType;

        return content;
    },
    setRoomId(roomId){
        this.roomId = roomId;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },

});

module.exports.msg_friend_create_dissolve_room_req = msg_friend_create_dissolve_room_req;

let msg_friend_create_dissolve_room_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.roomId = this.roomId;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setRoomId(roomId){
        this.roomId = roomId;
    },

});

module.exports.msg_friend_create_dissolve_room_ret = msg_friend_create_dissolve_room_ret;

let msg_club_open_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubId = this.clubId;

        return content;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },

});

module.exports.msg_club_open_req = msg_club_open_req;

let msg_club_open_ack = cc.Class({
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

module.exports.msg_club_open_ack = msg_club_open_ack;

let msg_club_close_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubId = this.clubId;

        return content;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },

});

module.exports.msg_club_close_req = msg_club_close_req;

let msg_club_close_ack = cc.Class({
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

module.exports.msg_club_close_ack = msg_club_close_ack;

let msg_club_state_cast = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubId = this.clubId;
        content.state = this.state;

        return content;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setState(state){
        this.state = state;
    },

});

module.exports.msg_club_state_cast = msg_club_state_cast;

let msg_get_battle_history_detail_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.historyId = this.historyId;

        return content;
    },
    setHistoryId(historyId){
        this.historyId = historyId;
    },

});

module.exports.msg_get_battle_history_detail_req = msg_get_battle_history_detail_req;

let msg_battle_history_detail_user = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.userName = this.userName;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setUserName(userName){
        this.userName = userName;
    },

});

module.exports.msg_battle_history_detail_user = msg_battle_history_detail_user;

let msg_battle_history_detail_score = cc.Class({
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

module.exports.msg_battle_history_detail_score = msg_battle_history_detail_score;

let msg_battle_history_detail = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.round = this.round;
        content.timestamp = this.timestamp;
        content.scoresList = this.scoresList;

        return content;
    },
    setRound(round){
        this.round = round;
    },
    setTimestamp(timestamp){
        this.timestamp = timestamp;
    },
    setScoresList(scoresList){
        this.scoresList = scoresList;
    },

});

module.exports.msg_battle_history_detail = msg_battle_history_detail;

let msg_get_battle_history_detail_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.historyId = this.historyId;
        content.gameType = this.gameType;
        content.detailsList = this.detailsList;
        content.usersList = this.usersList;

        return content;
    },
    setHistoryId(historyId){
        this.historyId = historyId;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setDetailsList(detailsList){
        this.detailsList = detailsList;
    },
    setUsersList(usersList){
        this.usersList = usersList;
    },

});

module.exports.msg_get_battle_history_detail_ret = msg_get_battle_history_detail_ret;

let msg_club_personal_battle_record_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubid = this.clubid;
        content.date = this.date;

        return content;
    },
    setClubid(clubid){
        this.clubid = clubid;
    },
    setDate(date){
        this.date = date;
    },

});

module.exports.msg_club_personal_battle_record_req = msg_club_personal_battle_record_req;

let club_personal_battle_record = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.userName = this.userName;
        content.openId = this.openId;
        content.headUrl = this.headUrl;
        content.dayScore = this.dayScore;
        content.dayRoomNum = this.dayRoomNum;
        content.dayBigWinnerNum = this.dayBigWinnerNum;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setUserName(userName){
        this.userName = userName;
    },
    setOpenId(openId){
        this.openId = openId;
    },
    setHeadUrl(headUrl){
        this.headUrl = headUrl;
    },
    setDayScore(dayScore){
        this.dayScore = dayScore;
    },
    setDayRoomNum(dayRoomNum){
        this.dayRoomNum = dayRoomNum;
    },
    setDayBigWinnerNum(dayBigWinnerNum){
        this.dayBigWinnerNum = dayBigWinnerNum;
    },

});

module.exports.club_personal_battle_record = club_personal_battle_record;

let msg_club_personal_battle_record_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.date = this.date;
        content.joinNum = this.joinNum;
        content.costCardNum = this.costCardNum;
        content.roundNum = this.roundNum;
        content.bigWinnerNum = this.bigWinnerNum;
        content.detailList = this.detailList;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setDate(date){
        this.date = date;
    },
    setJoinNum(joinNum){
        this.joinNum = joinNum;
    },
    setCostCardNum(costCardNum){
        this.costCardNum = costCardNum;
    },
    setRoundNum(roundNum){
        this.roundNum = roundNum;
    },
    setBigWinnerNum(bigWinnerNum){
        this.bigWinnerNum = bigWinnerNum;
    },
    setDetailList(detailList){
        this.detailList = detailList;
    },

});

module.exports.msg_club_personal_battle_record_ret = msg_club_personal_battle_record_ret;

let msg_club_change_baofang_name_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubId = this.clubId;
        content.wanfanum = this.wanfanum;
        content.name = this.name;

        return content;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setWanfanum(wanfanum){
        this.wanfanum = wanfanum;
    },
    setName(name){
        this.name = name;
    },

});

module.exports.msg_club_change_baofang_name_req = msg_club_change_baofang_name_req;

let msg_club_change_baofang_name_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.result = this.result;
        content.clubId = this.clubId;
        content.wanfanum = this.wanfanum;
        content.name = this.name;

        return content;
    },
    setResult(result){
        this.result = result;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setWanfanum(wanfanum){
        this.wanfanum = wanfanum;
    },
    setName(name){
        this.name = name;
    },

});

module.exports.msg_club_change_baofang_name_ack = msg_club_change_baofang_name_ack;

let msg_club_change_battle_history_type_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clubId = this.clubId;
        content.type = this.type;

        return content;
    },
    setClubId(clubId){
        this.clubId = clubId;
    },
    setType(type){
        this.type = type;
    },

});

module.exports.msg_club_change_battle_history_type_req = msg_club_change_battle_history_type_req;

let msg_club_change_battle_history_type_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.type = this.type;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setType(type){
        this.type = type;
    },

});

module.exports.msg_club_change_battle_history_type_ret = msg_club_change_battle_history_type_ret;

