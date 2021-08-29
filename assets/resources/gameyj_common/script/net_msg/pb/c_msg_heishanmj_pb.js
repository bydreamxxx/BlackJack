let heishan_desk_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.owner = this.owner;
        content.passwrod = this.passwrod;
        content.currcircle = this.currcircle;
        content.desktype = this.desktype;
        content.configid = this.configid;
        content.createcfg = this.createcfg;

        return content;
    },
    setOwner(owner){
        this.owner = owner;
    },
    setPasswrod(passwrod){
        this.passwrod = passwrod;
    },
    setCurrcircle(currcircle){
        this.currcircle = currcircle;
    },
    setDesktype(desktype){
        this.desktype = desktype;
    },
    setConfigid(configid){
        this.configid = configid;
    },
    setCreatecfg(createcfg){
        this.createcfg = createcfg;
    },

});

module.exports.heishan_desk_info = heishan_desk_info;

let heishan_req_desk_rule = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.roomtype = this.roomtype;
        content.password = this.password;
        content.roomlevel = this.roomlevel;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setRoomtype(roomtype){
        this.roomtype = roomtype;
    },
    setPassword(password){
        this.password = password;
    },
    setRoomlevel(roomlevel){
        this.roomlevel = roomlevel;
    },

});

module.exports.heishan_req_desk_rule = heishan_req_desk_rule;

let heishan_game_ack_act_hu = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.hutypeList = this.hutypeList;
        content.holdcardinfoList = this.holdcardinfoList;
        content.hucardid = this.hucardid;
        content.huplayerid = this.huplayerid;
        content.dianpaoplayerid = this.dianpaoplayerid;
        content.isrob = this.isrob;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setHutypeList(hutypeList){
        this.hutypeList = hutypeList;
    },
    setHoldcardinfoList(holdcardinfoList){
        this.holdcardinfoList = holdcardinfoList;
    },
    setHucardid(hucardid){
        this.hucardid = hucardid;
    },
    setHuplayerid(huplayerid){
        this.huplayerid = huplayerid;
    },
    setDianpaoplayerid(dianpaoplayerid){
        this.dianpaoplayerid = dianpaoplayerid;
    },
    setIsrob(isrob){
        this.isrob = isrob;
    },

});

module.exports.heishan_game_ack_act_hu = heishan_game_ack_act_hu;

let heishan_ack_send_current_result = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.hutypeList = this.hutypeList;
        content.playercoininfoList = this.playercoininfoList;
        content.baopaiList = this.baopaiList;
        content.huuserid = this.huuserid;
        content.isend = this.isend;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setHutypeList(hutypeList){
        this.hutypeList = hutypeList;
    },
    setPlayercoininfoList(playercoininfoList){
        this.playercoininfoList = playercoininfoList;
    },
    setBaopaiList(baopaiList){
        this.baopaiList = baopaiList;
    },
    setHuuserid(huuserid){
        this.huuserid = huuserid;
    },
    setIsend(isend){
        this.isend = isend;
    },

});

module.exports.heishan_ack_send_current_result = heishan_ack_send_current_result;

let heishan_ack_game_opening = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.currplaycount = this.currplaycount;
        content.bankerid = this.bankerid;
        content.oldbankerid = this.oldbankerid;
        content.usercoinbeansList = this.usercoinbeansList;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setCurrplaycount(currplaycount){
        this.currplaycount = currplaycount;
    },
    setBankerid(bankerid){
        this.bankerid = bankerid;
    },
    setOldbankerid(oldbankerid){
        this.oldbankerid = oldbankerid;
    },
    setUsercoinbeansList(usercoinbeansList){
        this.usercoinbeansList = usercoinbeansList;
    },

});

module.exports.heishan_ack_game_opening = heishan_ack_game_opening;

let heishan_ack_roomInit = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.deskinfo = this.deskinfo;
        content.playersList = this.playersList;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setDeskinfo(deskinfo){
        this.deskinfo = deskinfo;
    },
    setPlayersList(playersList){
        this.playersList = playersList;
    },

});

module.exports.heishan_ack_roomInit = heishan_ack_roomInit;

let heishan_ack_createDesk = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;

        return content;
    },
    setHeader(header){
        this.header = header;
    },

});

module.exports.heishan_ack_createDesk = heishan_ack_createDesk;

let heishan_req_enterDesk = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.roomtype = this.roomtype;
        content.password = this.password;
        content.roomlevel = this.roomlevel;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setRoomtype(roomtype){
        this.roomtype = roomtype;
    },
    setPassword(password){
        this.password = password;
    },
    setRoomlevel(roomlevel){
        this.roomlevel = roomlevel;
    },

});

module.exports.heishan_req_enterDesk = heishan_req_enterDesk;

let heishan_ack_enterDesk = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;

        return content;
    },
    setHeader(header){
        this.header = header;
    },

});

module.exports.heishan_ack_enterDesk = heishan_ack_enterDesk;

let heishan_req_leave_status = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.userid = this.userid;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setUserid(userid){
        this.userid = userid;
    },

});

module.exports.heishan_req_leave_status = heishan_req_leave_status;

let heishan_ack_leave_status = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.status = this.status;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setStatus(status){
        this.status = status;
    },

});

module.exports.heishan_ack_leave_status = heishan_ack_leave_status;

let heishan_req_sponsor_dissolve_room = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.sponsorid = this.sponsorid;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setSponsorid(sponsorid){
        this.sponsorid = sponsorid;
    },

});

module.exports.heishan_req_sponsor_dissolve_room = heishan_req_sponsor_dissolve_room;

let heishan_ack_sponsor_dissolve_room = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.sponsorid = this.sponsorid;
        content.useridList = this.useridList;
        content.countdown = this.countdown;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setSponsorid(sponsorid){
        this.sponsorid = sponsorid;
    },
    setUseridList(useridList){
        this.useridList = useridList;
    },
    setCountdown(countdown){
        this.countdown = countdown;
    },

});

module.exports.heishan_ack_sponsor_dissolve_room = heishan_ack_sponsor_dissolve_room;

let heishan_req_response_dissolve_room = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.responseid = this.responseid;
        content.isagree = this.isagree;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setResponseid(responseid){
        this.responseid = responseid;
    },
    setIsagree(isagree){
        this.isagree = isagree;
    },

});

module.exports.heishan_req_response_dissolve_room = heishan_req_response_dissolve_room;

let heishan_ack_response_dissolve_room = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.responseid = this.responseid;
        content.isagree = this.isagree;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setResponseid(responseid){
        this.responseid = responseid;
    },
    setIsagree(isagree){
        this.isagree = isagree;
    },

});

module.exports.heishan_ack_response_dissolve_room = heishan_ack_response_dissolve_room;

let heishan_req_dissolve_room = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.bankerid = this.bankerid;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setBankerid(bankerid){
        this.bankerid = bankerid;
    },

});

module.exports.heishan_req_dissolve_room = heishan_req_dissolve_room;

let heishan_ack_dissolve_room = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.bankerid = this.bankerid;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setBankerid(bankerid){
        this.bankerid = bankerid;
    },

});

module.exports.heishan_ack_dissolve_room = heishan_ack_dissolve_room;

let heishan_req_exit_room = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.exitid = this.exitid;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setExitid(exitid){
        this.exitid = exitid;
    },

});

module.exports.heishan_req_exit_room = heishan_req_exit_room;

let heishan_ack_exit_room = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.exitid = this.exitid;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setExitid(exitid){
        this.exitid = exitid;
    },

});

module.exports.heishan_ack_exit_room = heishan_ack_exit_room;

let heishan_ack_playerEnter = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.player = this.player;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setPlayer(player){
        this.player = player;
    },

});

module.exports.heishan_ack_playerEnter = heishan_ack_playerEnter;

let heishan_req_ready = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;

        return content;
    },
    setHeader(header){
        this.header = header;
    },

});

module.exports.heishan_req_ready = heishan_req_ready;

let heishan_ack_ready = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;

        return content;
    },
    setHeader(header){
        this.header = header;
    },

});

module.exports.heishan_ack_ready = heishan_ack_ready;

let heishan_ack_opening = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;

        return content;
    },
    setHeader(header){
        this.header = header;
    },

});

module.exports.heishan_ack_opening = heishan_ack_opening;

let heishan_bc_moPai = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.acttype = this.acttype;
        content.actuser = this.actuser;
        content.pai = this.pai;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setActtype(acttype){
        this.acttype = acttype;
    },
    setActuser(actuser){
        this.actuser = actuser;
    },
    setPai(pai){
        this.pai = pai;
    },

});

module.exports.heishan_bc_moPai = heishan_bc_moPai;

let heishan_ack_game_overturn = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.userid = this.userid;
        content.nextuserid = this.nextuserid;
        content.acttype = this.acttype;
        content.time = this.time;
        content.paicount = this.paicount;
        content.canpeng = this.canpeng;
        content.cangang = this.cangang;
        content.canbugang = this.canbugang;
        content.canhu = this.canhu;
        content.canchi = this.canchi;
        content.canting = this.canting;
        content.actcard = this.actcard;
        content.jiaoinfosList = this.jiaoinfosList;
        content.gangcards = this.gangcards;
        content.bugangcards = this.bugangcards;
        content.chiinfoList = this.chiinfoList;
        content.handleruserid = this.handleruserid;
        content.cannothutipsList = this.cannothutipsList;
        content.cangangmopai = this.cangangmopai;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setUserid(userid){
        this.userid = userid;
    },
    setNextuserid(nextuserid){
        this.nextuserid = nextuserid;
    },
    setActtype(acttype){
        this.acttype = acttype;
    },
    setTime(time){
        this.time = time;
    },
    setPaicount(paicount){
        this.paicount = paicount;
    },
    setCanpeng(canpeng){
        this.canpeng = canpeng;
    },
    setCangang(cangang){
        this.cangang = cangang;
    },
    setCanbugang(canbugang){
        this.canbugang = canbugang;
    },
    setCanhu(canhu){
        this.canhu = canhu;
    },
    setCanchi(canchi){
        this.canchi = canchi;
    },
    setCanting(canting){
        this.canting = canting;
    },
    setActcard(actcard){
        this.actcard = actcard;
    },
    setJiaoinfosList(jiaoinfosList){
        this.jiaoinfosList = jiaoinfosList;
    },
    setGangcards(gangcards){
        this.gangcards = gangcards;
    },
    setBugangcards(bugangcards){
        this.bugangcards = bugangcards;
    },
    setChiinfoList(chiinfoList){
        this.chiinfoList = chiinfoList;
    },
    setHandleruserid(handleruserid){
        this.handleruserid = handleruserid;
    },
    setCannothutipsList(cannothutipsList){
        this.cannothutipsList = cannothutipsList;
    },
    setCangangmopai(cangangmopai){
        this.cangangmopai = cangangmopai;
    },

});

module.exports.heishan_ack_game_overturn = heishan_ack_game_overturn;

let heishan_ack_game_deal_cards = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.playercardList = this.playercardList;
        content.dealeruserid = this.dealeruserid;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setPlayercardList(playercardList){
        this.playercardList = playercardList;
    },
    setDealeruserid(dealeruserid){
        this.dealeruserid = dealeruserid;
    },

});

module.exports.heishan_ack_game_deal_cards = heishan_ack_game_deal_cards;

let heishan_ack_game_send_out_card = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.result = this.result;
        content.userid = this.userid;
        content.card = this.card;
        content.isauto = this.isauto;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setResult(result){
        this.result = result;
    },
    setUserid(userid){
        this.userid = userid;
    },
    setCard(card){
        this.card = card;
    },
    setIsauto(isauto){
        this.isauto = isauto;
    },

});

module.exports.heishan_ack_game_send_out_card = heishan_ack_game_send_out_card;

let heishan_game_send_end_lottery = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.coininfoList = this.coininfoList;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setCoininfoList(coininfoList){
        this.coininfoList = coininfoList;
    },

});

module.exports.heishan_game_send_end_lottery = heishan_game_send_end_lottery;

let heishan_req_game_send_out_card = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.cardid = this.cardid;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setCardid(cardid){
        this.cardid = cardid;
    },

});

module.exports.heishan_req_game_send_out_card = heishan_req_game_send_out_card;

let heishan_req_chi = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.userid = this.userid;
        content.chicard = this.chicard;
        content.choosecardsList = this.choosecardsList;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setUserid(userid){
        this.userid = userid;
    },
    setChicard(chicard){
        this.chicard = chicard;
    },
    setChoosecardsList(choosecardsList){
        this.choosecardsList = choosecardsList;
    },

});

module.exports.heishan_req_chi = heishan_req_chi;

let heishan_ack_chi = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.chicardList = this.chicardList;
        content.useridout = this.useridout;
        content.useridin = this.useridin;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setChicardList(chicardList){
        this.chicardList = chicardList;
    },
    setUseridout(useridout){
        this.useridout = useridout;
    },
    setUseridin(useridin){
        this.useridin = useridin;
    },

});

module.exports.heishan_ack_chi = heishan_ack_chi;

let heishan_req_game_act_peng = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.userid = this.userid;
        content.pengcard = this.pengcard;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setUserid(userid){
        this.userid = userid;
    },
    setPengcard(pengcard){
        this.pengcard = pengcard;
    },

});

module.exports.heishan_req_game_act_peng = heishan_req_game_act_peng;

let heishan_ack_game_act_peng = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.pengcardList = this.pengcardList;
        content.useridout = this.useridout;
        content.useridin = this.useridin;
        content.isrob = this.isrob;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setPengcardList(pengcardList){
        this.pengcardList = pengcardList;
    },
    setUseridout(useridout){
        this.useridout = useridout;
    },
    setUseridin(useridin){
        this.useridin = useridin;
    },
    setIsrob(isrob){
        this.isrob = isrob;
    },

});

module.exports.heishan_ack_game_act_peng = heishan_ack_game_act_peng;

let heishan_req_game_act_gang = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.userid = this.userid;
        content.isnewdealstyle = this.isnewdealstyle;
        content.gangcard = this.gangcard;
        content.choosecardsList = this.choosecardsList;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setUserid(userid){
        this.userid = userid;
    },
    setIsnewdealstyle(isnewdealstyle){
        this.isnewdealstyle = isnewdealstyle;
    },
    setGangcard(gangcard){
        this.gangcard = gangcard;
    },
    setChoosecardsList(choosecardsList){
        this.choosecardsList = choosecardsList;
    },

});

module.exports.heishan_req_game_act_gang = heishan_req_game_act_gang;

let heishan_ack_game_act_gang = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.gangtype = this.gangtype;
        content.useridout = this.useridout;
        content.useridin = this.useridin;
        content.gangcardList = this.gangcardList;
        content.usercoinbeansList = this.usercoinbeansList;
        content.isrob = this.isrob;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setGangtype(gangtype){
        this.gangtype = gangtype;
    },
    setUseridout(useridout){
        this.useridout = useridout;
    },
    setUseridin(useridin){
        this.useridin = useridin;
    },
    setGangcardList(gangcardList){
        this.gangcardList = gangcardList;
    },
    setUsercoinbeansList(usercoinbeansList){
        this.usercoinbeansList = usercoinbeansList;
    },
    setIsrob(isrob){
        this.isrob = isrob;
    },

});

module.exports.heishan_ack_game_act_gang = heishan_ack_game_act_gang;

let heishan_req_game_act_bugang = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.userid = this.userid;
        content.bugangcard = this.bugangcard;
        content.choosecardsList = this.choosecardsList;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setUserid(userid){
        this.userid = userid;
    },
    setBugangcard(bugangcard){
        this.bugangcard = bugangcard;
    },
    setChoosecardsList(choosecardsList){
        this.choosecardsList = choosecardsList;
    },

});

module.exports.heishan_req_game_act_bugang = heishan_req_game_act_bugang;

let heishan_ack_game_act_bugang = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.userid = this.userid;
        content.bugangcard = this.bugangcard;
        content.bugangcardsList = this.bugangcardsList;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setUserid(userid){
        this.userid = userid;
    },
    setBugangcard(bugangcard){
        this.bugangcard = bugangcard;
    },
    setBugangcardsList(bugangcardsList){
        this.bugangcardsList = bugangcardsList;
    },

});

module.exports.heishan_ack_game_act_bugang = heishan_ack_game_act_bugang;

let heishan_req_game_act_guo = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.userid = this.userid;
        content.guotype = this.guotype;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setUserid(userid){
        this.userid = userid;
    },
    setGuotype(guotype){
        this.guotype = guotype;
    },

});

module.exports.heishan_req_game_act_guo = heishan_req_game_act_guo;

let heishan_ack_game_act_guo = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.userid = this.userid;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setUserid(userid){
        this.userid = userid;
    },

});

module.exports.heishan_ack_game_act_guo = heishan_ack_game_act_guo;

let heishan_req_game_act_hu = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.userid = this.userid;
        content.hutype = this.hutype;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setUserid(userid){
        this.userid = userid;
    },
    setHutype(hutype){
        this.hutype = hutype;
    },

});

module.exports.heishan_req_game_act_hu = heishan_req_game_act_hu;

let heishan_req_game_ting = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.userid = this.userid;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setUserid(userid){
        this.userid = userid;
    },

});

module.exports.heishan_req_game_ting = heishan_req_game_ting;

let heishan_ack_game_ting = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.userid = this.userid;
        content.ddsjcardsList = this.ddsjcardsList;
        content.lzbcardsList = this.lzbcardsList;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setUserid(userid){
        this.userid = userid;
    },
    setDdsjcardsList(ddsjcardsList){
        this.ddsjcardsList = ddsjcardsList;
    },
    setLzbcardsList(lzbcardsList){
        this.lzbcardsList = lzbcardsList;
    },

});

module.exports.heishan_ack_game_ting = heishan_ack_game_ting;

let heishan_ack_game_dabao = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.userid = this.userid;
        content.card = this.card;
        content.baopaiindex = this.baopaiindex;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setUserid(userid){
        this.userid = userid;
    },
    setCard(card){
        this.card = card;
    },
    setBaopaiindex(baopaiindex){
        this.baopaiindex = baopaiindex;
    },

});

module.exports.heishan_ack_game_dabao = heishan_ack_game_dabao;

let heishan_ack_game_changbao = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.userid = this.userid;
        content.card = this.card;
        content.newbaopaiindex = this.newbaopaiindex;
        content.num = this.num;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setUserid(userid){
        this.userid = userid;
    },
    setCard(card){
        this.card = card;
    },
    setNewbaopaiindex(newbaopaiindex){
        this.newbaopaiindex = newbaopaiindex;
    },
    setNum(num){
        this.num = num;
    },

});

module.exports.heishan_ack_game_changbao = heishan_ack_game_changbao;

let heishan_req_remain_majiang = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.userid = this.userid;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setUserid(userid){
        this.userid = userid;
    },

});

module.exports.heishan_req_remain_majiang = heishan_req_remain_majiang;

let heishan_ack_remain_majiang = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.cardsList = this.cardsList;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setCardsList(cardsList){
        this.cardsList = cardsList;
    },

});

module.exports.heishan_ack_remain_majiang = heishan_ack_remain_majiang;

let heishan_req_change_majiang = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.userid = this.userid;
        content.handpais = this.handpais;
        content.choosepais = this.choosepais;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setUserid(userid){
        this.userid = userid;
    },
    setHandpais(handpais){
        this.handpais = handpais;
    },
    setChoosepais(choosepais){
        this.choosepais = choosepais;
    },

});

module.exports.heishan_req_change_majiang = heishan_req_change_majiang;

let heishan_ack_change_majiang = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.handpais = this.handpais;
        content.choosepais = this.choosepais;
        content.shoupaiList = this.shoupaiList;
        content.mopai = this.mopai;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setHandpais(handpais){
        this.handpais = handpais;
    },
    setChoosepais(choosepais){
        this.choosepais = choosepais;
    },
    setShoupaiList(shoupaiList){
        this.shoupaiList = shoupaiList;
    },
    setMopai(mopai){
        this.mopai = mopai;
    },

});

module.exports.heishan_ack_change_majiang = heishan_ack_change_majiang;

let heishan_ask_show_tingpai_tips = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.isshowtingpaitips = this.isshowtingpaitips;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setIsshowtingpaitips(isshowtingpaitips){
        this.isshowtingpaitips = isshowtingpaitips;
    },

});

module.exports.heishan_ask_show_tingpai_tips = heishan_ask_show_tingpai_tips;

let heishan_ack_rob_remove_card = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.userid = this.userid;
        content.cardid = this.cardid;
        content.robtype = this.robtype;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setUserid(userid){
        this.userid = userid;
    },
    setCardid(cardid){
        this.cardid = cardid;
    },
    setRobtype(robtype){
        this.robtype = robtype;
    },

});

module.exports.heishan_ack_rob_remove_card = heishan_ack_rob_remove_card;

let heishan_ack_update_user_status = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.userid = this.userid;
        content.status = this.status;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setUserid(userid){
        this.userid = userid;
    },
    setStatus(status){
        this.status = status;
    },

});

module.exports.heishan_ack_update_user_status = heishan_ack_update_user_status;

let heishan_req_reconnect = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;

        return content;
    },
    setHeader(header){
        this.header = header;
    },

});

module.exports.heishan_req_reconnect = heishan_req_reconnect;

let heishan_ack_reconnect = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.playerinfoList = this.playerinfoList;
        content.deskgameinfo = this.deskgameinfo;
        content.deskrules = this.deskrules;
        content.senderuserid = this.senderuserid;
        content.isreconnect = this.isreconnect;
        content.jiaoinfosList = this.jiaoinfosList;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setPlayerinfoList(playerinfoList){
        this.playerinfoList = playerinfoList;
    },
    setDeskgameinfo(deskgameinfo){
        this.deskgameinfo = deskgameinfo;
    },
    setDeskrules(deskrules){
        this.deskrules = deskrules;
    },
    setSenderuserid(senderuserid){
        this.senderuserid = senderuserid;
    },
    setIsreconnect(isreconnect){
        this.isreconnect = isreconnect;
    },
    setJiaoinfosList(jiaoinfosList){
        this.jiaoinfosList = jiaoinfosList;
    },

});

module.exports.heishan_ack_reconnect = heishan_ack_reconnect;

let heishan_ack_send_player_handinfo = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.shoupaiList = this.shoupaiList;
        content.mopai = this.mopai;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setShoupaiList(shoupaiList){
        this.shoupaiList = shoupaiList;
    },
    setMopai(mopai){
        this.mopai = mopai;
    },

});

module.exports.heishan_ack_send_player_handinfo = heishan_ack_send_player_handinfo;

let heishan_req_reloading_ok = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;

        return content;
    },
    setHeader(header){
        this.header = header;
    },

});

module.exports.heishan_req_reloading_ok = heishan_req_reloading_ok;

let heishan_ack_reloading_ok = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;

        return content;
    },
    setHeader(header){
        this.header = header;
    },

});

module.exports.heishan_ack_reloading_ok = heishan_ack_reloading_ok;

let heishan_ack_finally_result = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.allgamenumber = this.allgamenumber;
        content.resultuserinfoList = this.resultuserinfoList;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setAllgamenumber(allgamenumber){
        this.allgamenumber = allgamenumber;
    },
    setResultuserinfoList(resultuserinfoList){
        this.resultuserinfoList = resultuserinfoList;
    },

});

module.exports.heishan_ack_finally_result = heishan_ack_finally_result;

let heishan_ack_fen_zhang = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;

        return content;
    },
    setHeader(header){
        this.header = header;
    },

});

module.exports.heishan_ack_fen_zhang = heishan_ack_fen_zhang;

let heishan_ack_user_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.userid = this.userid;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setUserid(userid){
        this.userid = userid;
    },

});

module.exports.heishan_ack_user_info = heishan_ack_user_info;

let heishan_req_tingpai_out_card = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.cardid = this.cardid;
        content.tingtype = this.tingtype;
        content.ddsjcardid = this.ddsjcardid;
        content.lzbcardid = this.lzbcardid;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setCardid(cardid){
        this.cardid = cardid;
    },
    setTingtype(tingtype){
        this.tingtype = tingtype;
    },
    setDdsjcardid(ddsjcardid){
        this.ddsjcardid = ddsjcardid;
    },
    setLzbcardid(lzbcardid){
        this.lzbcardid = lzbcardid;
    },

});

module.exports.heishan_req_tingpai_out_card = heishan_req_tingpai_out_card;

let heishan_game_ack_act_huangzhuangpais = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.holdcardinfoList = this.holdcardinfoList;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setHoldcardinfoList(holdcardinfoList){
        this.holdcardinfoList = holdcardinfoList;
    },

});

module.exports.heishan_game_ack_act_huangzhuangpais = heishan_game_ack_act_huangzhuangpais;

let heishan_ack_operator = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.actcursorid = this.actcursorid;
        content.lastactoutid = this.lastactoutid;
        content.remainingtime = this.remainingtime;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setActcursorid(actcursorid){
        this.actcursorid = actcursorid;
    },
    setLastactoutid(lastactoutid){
        this.lastactoutid = lastactoutid;
    },
    setRemainingtime(remainingtime){
        this.remainingtime = remainingtime;
    },

});

module.exports.heishan_ack_operator = heishan_ack_operator;

let heishan_ack_dont_win_zero = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.outcarduser = this.outcarduser;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setOutcarduser(outcarduser){
        this.outcarduser = outcarduser;
    },

});

module.exports.heishan_ack_dont_win_zero = heishan_ack_dont_win_zero;

let heishan_req_enter_match = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userid = this.userid;

        return content;
    },
    setUserid(userid){
        this.userid = userid;
    },

});

module.exports.heishan_req_enter_match = heishan_req_enter_match;

let heishan_ack_enter_match = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userid = this.userid;
        content.ret = this.ret;

        return content;
    },
    setUserid(userid){
        this.userid = userid;
    },
    setRet(ret){
        this.ret = ret;
    },

});

module.exports.heishan_ack_enter_match = heishan_ack_enter_match;

let heishan_req_update_deposit = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.isdeposit = this.isdeposit;

        return content;
    },
    setIsdeposit(isdeposit){
        this.isdeposit = isdeposit;
    },

});

module.exports.heishan_req_update_deposit = heishan_req_update_deposit;

let heishan_ack_update_deposit = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.isdeposit = this.isdeposit;

        return content;
    },
    setIsdeposit(isdeposit){
        this.isdeposit = isdeposit;
    },

});

module.exports.heishan_ack_update_deposit = heishan_ack_update_deposit;

let heishan_ack_update_coin = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userid = this.userid;
        content.coin = this.coin;

        return content;
    },
    setUserid(userid){
        this.userid = userid;
    },
    setCoin(coin){
        this.coin = coin;
    },

});

module.exports.heishan_ack_update_coin = heishan_ack_update_coin;

let heishan_ack_bao = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.card = this.card;

        return content;
    },
    setCard(card){
        this.card = card;
    },

});

module.exports.heishan_ack_bao = heishan_ack_bao;

