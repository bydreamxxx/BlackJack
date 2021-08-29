let p16_req_desk_rule = cc.Class({
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

module.exports.p16_req_desk_rule = p16_req_desk_rule;

let p16_game_ack_act_hu = cc.Class({
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

module.exports.p16_game_ack_act_hu = p16_game_ack_act_hu;

let p16_ack_send_current_result = cc.Class({
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

module.exports.p16_ack_send_current_result = p16_ack_send_current_result;

let p16_ack_game_opening = cc.Class({
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

module.exports.p16_ack_game_opening = p16_ack_game_opening;

let p16_ack_roomInit = cc.Class({
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

module.exports.p16_ack_roomInit = p16_ack_roomInit;

let desk_info_cc = cc.Class({
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

module.exports.desk_info_cc = desk_info_cc;

let p16_ack_createDesk = cc.Class({
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

module.exports.p16_ack_createDesk = p16_ack_createDesk;

let p16_req_enterDesk = cc.Class({
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

module.exports.p16_req_enterDesk = p16_req_enterDesk;

let p16_ack_enterDesk = cc.Class({
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

module.exports.p16_ack_enterDesk = p16_ack_enterDesk;

let p16_req_leave_status = cc.Class({
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

module.exports.p16_req_leave_status = p16_req_leave_status;

let p16_ack_leave_status = cc.Class({
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

module.exports.p16_ack_leave_status = p16_ack_leave_status;

let p16_req_sponsor_dissolve_room = cc.Class({
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

module.exports.p16_req_sponsor_dissolve_room = p16_req_sponsor_dissolve_room;

let p16_ack_sponsor_dissolve_room = cc.Class({
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

module.exports.p16_ack_sponsor_dissolve_room = p16_ack_sponsor_dissolve_room;

let p16_req_response_dissolve_room = cc.Class({
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

module.exports.p16_req_response_dissolve_room = p16_req_response_dissolve_room;

let p16_ack_response_dissolve_room = cc.Class({
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

module.exports.p16_ack_response_dissolve_room = p16_ack_response_dissolve_room;

let p16_req_dissolve_room = cc.Class({
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

module.exports.p16_req_dissolve_room = p16_req_dissolve_room;

let p16_ack_dissolve_room = cc.Class({
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

module.exports.p16_ack_dissolve_room = p16_ack_dissolve_room;

let p16_req_exit_room = cc.Class({
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

module.exports.p16_req_exit_room = p16_req_exit_room;

let p16_ack_exit_room = cc.Class({
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

module.exports.p16_ack_exit_room = p16_ack_exit_room;

let p16_ack_playerEnter = cc.Class({
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

module.exports.p16_ack_playerEnter = p16_ack_playerEnter;

let p16_req_ready = cc.Class({
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

module.exports.p16_req_ready = p16_req_ready;

let p16_ack_ready = cc.Class({
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

module.exports.p16_ack_ready = p16_ack_ready;

let p16_ack_opening = cc.Class({
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

module.exports.p16_ack_opening = p16_ack_opening;

let p16_bc_moPai = cc.Class({
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

module.exports.p16_bc_moPai = p16_bc_moPai;

let p16_ack_game_overturn = cc.Class({
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
        content.canliangxi = this.canliangxi;

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
    setCanliangxi(canliangxi){
        this.canliangxi = canliangxi;
    },

});

module.exports.p16_ack_game_overturn = p16_ack_game_overturn;

let p16_ack_game_deal_cards = cc.Class({
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

module.exports.p16_ack_game_deal_cards = p16_ack_game_deal_cards;

let p16_ack_game_send_out_card = cc.Class({
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

module.exports.p16_ack_game_send_out_card = p16_ack_game_send_out_card;

let p16_game_send_end_lottery = cc.Class({
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

module.exports.p16_game_send_end_lottery = p16_game_send_end_lottery;

let p16_req_game_send_out_card = cc.Class({
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

module.exports.p16_req_game_send_out_card = p16_req_game_send_out_card;

let p16_req_chi = cc.Class({
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

module.exports.p16_req_chi = p16_req_chi;

let p16_ack_chi = cc.Class({
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

module.exports.p16_ack_chi = p16_ack_chi;

let p16_req_game_act_peng = cc.Class({
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

module.exports.p16_req_game_act_peng = p16_req_game_act_peng;

let p16_ack_game_act_peng = cc.Class({
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

module.exports.p16_ack_game_act_peng = p16_ack_game_act_peng;

let p16_req_game_act_gang = cc.Class({
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

module.exports.p16_req_game_act_gang = p16_req_game_act_gang;

let p16_ack_game_act_gang = cc.Class({
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

module.exports.p16_ack_game_act_gang = p16_ack_game_act_gang;

let p16_req_game_act_bugang = cc.Class({
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

module.exports.p16_req_game_act_bugang = p16_req_game_act_bugang;

let p16_ack_game_act_bugang = cc.Class({
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

module.exports.p16_ack_game_act_bugang = p16_ack_game_act_bugang;

let p16_req_game_act_guo = cc.Class({
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

module.exports.p16_req_game_act_guo = p16_req_game_act_guo;

let p16_ack_game_act_guo = cc.Class({
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

module.exports.p16_ack_game_act_guo = p16_ack_game_act_guo;

let p16_req_game_act_hu = cc.Class({
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

module.exports.p16_req_game_act_hu = p16_req_game_act_hu;

let p16_req_game_ting = cc.Class({
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

module.exports.p16_req_game_ting = p16_req_game_ting;

let p16_ack_game_ting = cc.Class({
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

module.exports.p16_ack_game_ting = p16_ack_game_ting;

let p16_ack_game_dabao = cc.Class({
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

module.exports.p16_ack_game_dabao = p16_ack_game_dabao;

let p16_ack_game_changbao = cc.Class({
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

module.exports.p16_ack_game_changbao = p16_ack_game_changbao;

let p16_req_remain_majiang = cc.Class({
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

module.exports.p16_req_remain_majiang = p16_req_remain_majiang;

let p16_ack_remain_majiang = cc.Class({
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

module.exports.p16_ack_remain_majiang = p16_ack_remain_majiang;

let p16_req_change_majiang = cc.Class({
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

module.exports.p16_req_change_majiang = p16_req_change_majiang;

let p16_ack_change_majiang = cc.Class({
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

module.exports.p16_ack_change_majiang = p16_ack_change_majiang;

let p16_ask_show_tingpai_tips = cc.Class({
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

module.exports.p16_ask_show_tingpai_tips = p16_ask_show_tingpai_tips;

let p16_ack_rob_remove_card = cc.Class({
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

module.exports.p16_ack_rob_remove_card = p16_ack_rob_remove_card;

let p16_ack_update_user_status = cc.Class({
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

module.exports.p16_ack_update_user_status = p16_ack_update_user_status;

let p16_req_reconnect = cc.Class({
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

module.exports.p16_req_reconnect = p16_req_reconnect;

let p16_ack_reconnect = cc.Class({
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

module.exports.p16_ack_reconnect = p16_ack_reconnect;

let p16_ack_send_player_handinfo = cc.Class({
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

module.exports.p16_ack_send_player_handinfo = p16_ack_send_player_handinfo;

let p16_req_reloading_ok = cc.Class({
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

module.exports.p16_req_reloading_ok = p16_req_reloading_ok;

let p16_ack_reloading_ok = cc.Class({
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

module.exports.p16_ack_reloading_ok = p16_ack_reloading_ok;

let p16_ack_finally_result = cc.Class({
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

module.exports.p16_ack_finally_result = p16_ack_finally_result;

let p16_ack_fen_zhang = cc.Class({
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

module.exports.p16_ack_fen_zhang = p16_ack_fen_zhang;

let p16_ack_user_info = cc.Class({
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

module.exports.p16_ack_user_info = p16_ack_user_info;

let p16_req_tingpai_out_card = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.cardid = this.cardid;
        content.tingtype = this.tingtype;

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

});

module.exports.p16_req_tingpai_out_card = p16_req_tingpai_out_card;

let p16_game_ack_act_huangzhuangpais = cc.Class({
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

module.exports.p16_game_ack_act_huangzhuangpais = p16_game_ack_act_huangzhuangpais;

let p16_ack_operator = cc.Class({
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

module.exports.p16_ack_operator = p16_ack_operator;

let p16_ack_dont_win_zero = cc.Class({
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

module.exports.p16_ack_dont_win_zero = p16_ack_dont_win_zero;

let p16_req_enter_match = cc.Class({
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

module.exports.p16_req_enter_match = p16_req_enter_match;

let p16_ack_enter_match = cc.Class({
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

module.exports.p16_ack_enter_match = p16_ack_enter_match;

let p16_req_update_deposit = cc.Class({
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

module.exports.p16_req_update_deposit = p16_req_update_deposit;

let p16_ack_update_deposit = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.isdeposit = this.isdeposit;
        content.userid = this.userid;

        return content;
    },
    setIsdeposit(isdeposit){
        this.isdeposit = isdeposit;
    },
    setUserid(userid){
        this.userid = userid;
    },

});

module.exports.p16_ack_update_deposit = p16_ack_update_deposit;

let p16_ack_update_coin = cc.Class({
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

module.exports.p16_ack_update_coin = p16_ack_update_coin;

let p16_ack_bao = cc.Class({
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

module.exports.p16_ack_bao = p16_ack_bao;

let p16_req_alter_user_status = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.userstatus = this.userstatus;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setUserstatus(userstatus){
        this.userstatus = userstatus;
    },

});

module.exports.p16_req_alter_user_status = p16_req_alter_user_status;

let p16_req_user_ting_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.p16_req_user_ting_info = p16_req_user_ting_info;

let WinCoinInfo = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.nick = this.nick;
        content.gangfen = this.gangfen;
        content.hufen = this.hufen;
        content.total = this.total;
        content.isdianpao = this.isdianpao;
        content.nowscore = this.nowscore;
        content.userid = this.userid;

        return content;
    },
    setNick(nick){
        this.nick = nick;
    },
    setGangfen(gangfen){
        this.gangfen = gangfen;
    },
    setHufen(hufen){
        this.hufen = hufen;
    },
    setTotal(total){
        this.total = total;
    },
    setIsdianpao(isdianpao){
        this.isdianpao = isdianpao;
    },
    setNowscore(nowscore){
        this.nowscore = nowscore;
    },
    setUserid(userid){
        this.userid = userid;
    },

});

module.exports.WinCoinInfo = WinCoinInfo;

let ComposeCard_cc = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.value = this.value;
        content.type = this.type;
        content.cardsList = this.cardsList;

        return content;
    },
    setValue(value){
        this.value = value;
    },
    setType(type){
        this.type = type;
    },
    setCardsList(cardsList){
        this.cardsList = cardsList;
    },

});

module.exports.ComposeCard_cc = ComposeCard_cc;

let PlayerCard_cc = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.handcardList = this.handcardList;
        content.composecardList = this.composecardList;
        content.outcardList = this.outcardList;
        content.hucardList = this.hucardList;
        content.userid = this.userid;
        content.handcardcount = this.handcardcount;

        return content;
    },
    setHandcardList(handcardList){
        this.handcardList = handcardList;
    },
    setComposecardList(composecardList){
        this.composecardList = composecardList;
    },
    setOutcardList(outcardList){
        this.outcardList = outcardList;
    },
    setHucardList(hucardList){
        this.hucardList = hucardList;
    },
    setUserid(userid){
        this.userid = userid;
    },
    setHandcardcount(handcardcount){
        this.handcardcount = handcardcount;
    },

});

module.exports.PlayerCard_cc = PlayerCard_cc;

let FinallyTotal_cc = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userid = this.userid;
        content.totalscore = this.totalscore;
        content.wincount = this.wincount;

        return content;
    },
    setUserid(userid){
        this.userid = userid;
    },
    setTotalscore(totalscore){
        this.totalscore = totalscore;
    },
    setWincount(wincount){
        this.wincount = wincount;
    },

});

module.exports.FinallyTotal_cc = FinallyTotal_cc;

let DeskGameInfo_cc = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gamestatus = this.gamestatus;
        content.roomtypeinfo = this.roomtypeinfo;
        content.playernum = this.playernum;
        content.activeuserid = this.activeuserid;
        content.actiontime = this.actiontime;
        content.delaytime = this.delaytime;
        content.ninitactiontime = this.ninitactiontime;
        content.ninitdelaytime = this.ninitdelaytime;
        content.initroomcoin = this.initroomcoin;
        content.currplaycount = this.currplaycount;
        content.totalplaycount = this.totalplaycount;
        content.roomnumber = this.roomnumber;
        content.remaincards = this.remaincards;
        content.banker = this.banker;
        content.unbaopai = this.unbaopai;

        return content;
    },
    setGamestatus(gamestatus){
        this.gamestatus = gamestatus;
    },
    setRoomtypeinfo(roomtypeinfo){
        this.roomtypeinfo = roomtypeinfo;
    },
    setPlayernum(playernum){
        this.playernum = playernum;
    },
    setActiveuserid(activeuserid){
        this.activeuserid = activeuserid;
    },
    setActiontime(actiontime){
        this.actiontime = actiontime;
    },
    setDelaytime(delaytime){
        this.delaytime = delaytime;
    },
    setNinitactiontime(ninitactiontime){
        this.ninitactiontime = ninitactiontime;
    },
    setNinitdelaytime(ninitdelaytime){
        this.ninitdelaytime = ninitdelaytime;
    },
    setInitroomcoin(initroomcoin){
        this.initroomcoin = initroomcoin;
    },
    setCurrplaycount(currplaycount){
        this.currplaycount = currplaycount;
    },
    setTotalplaycount(totalplaycount){
        this.totalplaycount = totalplaycount;
    },
    setRoomnumber(roomnumber){
        this.roomnumber = roomnumber;
    },
    setRemaincards(remaincards){
        this.remaincards = remaincards;
    },
    setBanker(banker){
        this.banker = banker;
    },
    setUnbaopai(unbaopai){
        this.unbaopai = unbaopai;
    },

});

module.exports.DeskGameInfo_cc = DeskGameInfo_cc;

let PlayerInfo_cc = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.isbanker = this.isbanker;
        content.playercard = this.playercard;
        content.coin = this.coin;
        content.nickname = this.nickname;
        content.sex = this.sex;
        content.userid = this.userid;
        content.isowner = this.isowner;
        content.bready = this.bready;
        content.nhupai = this.nhupai;
        content.wxinfo = this.wxinfo;
        content.gamestatus = this.gamestatus;
        content.agentmode = this.agentmode;
        content.ip = this.ip;
        content.isbaoting = this.isbaoting;
        content.address = this.address;
        content.site = this.site;

        return content;
    },
    setIsbanker(isbanker){
        this.isbanker = isbanker;
    },
    setPlayercard(playercard){
        this.playercard = playercard;
    },
    setCoin(coin){
        this.coin = coin;
    },
    setNickname(nickname){
        this.nickname = nickname;
    },
    setSex(sex){
        this.sex = sex;
    },
    setUserid(userid){
        this.userid = userid;
    },
    setIsowner(isowner){
        this.isowner = isowner;
    },
    setBready(bready){
        this.bready = bready;
    },
    setNhupai(nhupai){
        this.nhupai = nhupai;
    },
    setWxinfo(wxinfo){
        this.wxinfo = wxinfo;
    },
    setGamestatus(gamestatus){
        this.gamestatus = gamestatus;
    },
    setAgentmode(agentmode){
        this.agentmode = agentmode;
    },
    setIp(ip){
        this.ip = ip;
    },
    setIsbaoting(isbaoting){
        this.isbaoting = isbaoting;
    },
    setAddress(address){
        this.address = address;
    },
    setSite(site){
        this.site = site;
    },

});

module.exports.PlayerInfo_cc = PlayerInfo_cc;

