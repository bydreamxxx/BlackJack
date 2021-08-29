let xzmj_desk_info = cc.Class({
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

module.exports.xzmj_desk_info = xzmj_desk_info;

let xzmj_req_desk_rule = cc.Class({
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

module.exports.xzmj_req_desk_rule = xzmj_req_desk_rule;

let xzmj_game_ack_act_hu = cc.Class({
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
        content.huorder = this.huorder;

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
    setHuorder(huorder){
        this.huorder = huorder;
    },

});

module.exports.xzmj_game_ack_act_hu = xzmj_game_ack_act_hu;

let xzmj_ack_send_current_result = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.playercoininfoList = this.playercoininfoList;
        content.isend = this.isend;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setPlayercoininfoList(playercoininfoList){
        this.playercoininfoList = playercoininfoList;
    },
    setIsend(isend){
        this.isend = isend;
    },

});

module.exports.xzmj_ack_send_current_result = xzmj_ack_send_current_result;

let xzmj_ack_game_opening = cc.Class({
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

module.exports.xzmj_ack_game_opening = xzmj_ack_game_opening;

let xzmj_ack_roomInit = cc.Class({
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

module.exports.xzmj_ack_roomInit = xzmj_ack_roomInit;

let xzmj_ack_enterDesk = cc.Class({
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

module.exports.xzmj_ack_enterDesk = xzmj_ack_enterDesk;

let xzmj_req_leave_status = cc.Class({
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

module.exports.xzmj_req_leave_status = xzmj_req_leave_status;

let xzmj_ack_leave_status = cc.Class({
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

module.exports.xzmj_ack_leave_status = xzmj_ack_leave_status;

let xzmj_req_sponsor_dissolve_room = cc.Class({
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

module.exports.xzmj_req_sponsor_dissolve_room = xzmj_req_sponsor_dissolve_room;

let xzmj_ack_sponsor_dissolve_room = cc.Class({
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

module.exports.xzmj_ack_sponsor_dissolve_room = xzmj_ack_sponsor_dissolve_room;

let xzmj_req_response_dissolve_room = cc.Class({
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

module.exports.xzmj_req_response_dissolve_room = xzmj_req_response_dissolve_room;

let xzmj_ack_response_dissolve_room = cc.Class({
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

module.exports.xzmj_ack_response_dissolve_room = xzmj_ack_response_dissolve_room;

let xzmj_req_dissolve_room = cc.Class({
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

module.exports.xzmj_req_dissolve_room = xzmj_req_dissolve_room;

let xzmj_ack_dissolve_room = cc.Class({
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

module.exports.xzmj_ack_dissolve_room = xzmj_ack_dissolve_room;

let xzmj_req_exit_room = cc.Class({
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

module.exports.xzmj_req_exit_room = xzmj_req_exit_room;

let xzmj_ack_exit_room = cc.Class({
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

module.exports.xzmj_ack_exit_room = xzmj_ack_exit_room;

let xzmj_ack_playerEnter = cc.Class({
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

module.exports.xzmj_ack_playerEnter = xzmj_ack_playerEnter;

let xzmj_req_ready = cc.Class({
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

module.exports.xzmj_req_ready = xzmj_req_ready;

let xzmj_ack_ready = cc.Class({
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

module.exports.xzmj_ack_ready = xzmj_ack_ready;

let xzmj_ack_opening = cc.Class({
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

module.exports.xzmj_ack_opening = xzmj_ack_opening;

let xzmj_bc_moPai = cc.Class({
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

module.exports.xzmj_bc_moPai = xzmj_bc_moPai;

let xzmj_ack_game_overturn = cc.Class({
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
        content.canting = this.canting;
        content.actcard = this.actcard;
        content.jiaoinfosList = this.jiaoinfosList;
        content.gangcards = this.gangcards;
        content.bugangcards = this.bugangcards;
        content.handleruserid = this.handleruserid;
        content.cannottingtipsList = this.cannottingtipsList;
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
    setHandleruserid(handleruserid){
        this.handleruserid = handleruserid;
    },
    setCannottingtipsList(cannottingtipsList){
        this.cannottingtipsList = cannottingtipsList;
    },
    setCangangmopai(cangangmopai){
        this.cangangmopai = cangangmopai;
    },

});

module.exports.xzmj_ack_game_overturn = xzmj_ack_game_overturn;

let xzmj_ack_game_deal_cards = cc.Class({
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

module.exports.xzmj_ack_game_deal_cards = xzmj_ack_game_deal_cards;

let xzmj_ack_game_send_out_card = cc.Class({
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

module.exports.xzmj_ack_game_send_out_card = xzmj_ack_game_send_out_card;

let xzmj_game_send_end_lottery = cc.Class({
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

module.exports.xzmj_game_send_end_lottery = xzmj_game_send_end_lottery;

let xzmj_req_game_send_out_card = cc.Class({
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

module.exports.xzmj_req_game_send_out_card = xzmj_req_game_send_out_card;

let xzmj_req_game_act_peng = cc.Class({
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

module.exports.xzmj_req_game_act_peng = xzmj_req_game_act_peng;

let xzmj_ack_game_act_peng = cc.Class({
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

module.exports.xzmj_ack_game_act_peng = xzmj_ack_game_act_peng;

let xzmj_req_game_act_gang = cc.Class({
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

module.exports.xzmj_req_game_act_gang = xzmj_req_game_act_gang;

let xzmj_ack_game_act_gang = cc.Class({
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

module.exports.xzmj_ack_game_act_gang = xzmj_ack_game_act_gang;

let xzmj_req_game_act_bugang = cc.Class({
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

module.exports.xzmj_req_game_act_bugang = xzmj_req_game_act_bugang;

let xzmj_ack_game_act_bugang = cc.Class({
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

module.exports.xzmj_ack_game_act_bugang = xzmj_ack_game_act_bugang;

let xzmj_req_game_act_guo = cc.Class({
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

module.exports.xzmj_req_game_act_guo = xzmj_req_game_act_guo;

let xzmj_ack_game_act_guo = cc.Class({
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

module.exports.xzmj_ack_game_act_guo = xzmj_ack_game_act_guo;

let xzmj_req_game_act_hu = cc.Class({
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

module.exports.xzmj_req_game_act_hu = xzmj_req_game_act_hu;

let xzmj_req_remain_majiang = cc.Class({
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

module.exports.xzmj_req_remain_majiang = xzmj_req_remain_majiang;

let xzmj_ack_remain_majiang = cc.Class({
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

module.exports.xzmj_ack_remain_majiang = xzmj_ack_remain_majiang;

let xzmj_req_change_majiang = cc.Class({
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

module.exports.xzmj_req_change_majiang = xzmj_req_change_majiang;

let xzmj_ack_change_majiang = cc.Class({
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

module.exports.xzmj_ack_change_majiang = xzmj_ack_change_majiang;

let xzmj_ack_rob_remove_card = cc.Class({
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

module.exports.xzmj_ack_rob_remove_card = xzmj_ack_rob_remove_card;

let xzmj_ack_update_user_status = cc.Class({
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

module.exports.xzmj_ack_update_user_status = xzmj_ack_update_user_status;

let xzmj_req_reconnect = cc.Class({
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

module.exports.xzmj_req_reconnect = xzmj_req_reconnect;

let xzmj_ack_reconnect = cc.Class({
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

module.exports.xzmj_ack_reconnect = xzmj_ack_reconnect;

let xzmj_ack_send_player_handinfo = cc.Class({
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

module.exports.xzmj_ack_send_player_handinfo = xzmj_ack_send_player_handinfo;

let xzmj_req_reloading_ok = cc.Class({
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

module.exports.xzmj_req_reloading_ok = xzmj_req_reloading_ok;

let xzmj_ack_reloading_ok = cc.Class({
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

module.exports.xzmj_ack_reloading_ok = xzmj_ack_reloading_ok;

let xzmj_ack_finally_result = cc.Class({
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

module.exports.xzmj_ack_finally_result = xzmj_ack_finally_result;

let xzmj_ack_fen_zhang = cc.Class({
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

module.exports.xzmj_ack_fen_zhang = xzmj_ack_fen_zhang;

let xzmj_ack_user_info = cc.Class({
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

module.exports.xzmj_ack_user_info = xzmj_ack_user_info;

let xzmj_game_ack_act_huangzhuangpais = cc.Class({
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

module.exports.xzmj_game_ack_act_huangzhuangpais = xzmj_game_ack_act_huangzhuangpais;

let xzmj_ack_operator = cc.Class({
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

module.exports.xzmj_ack_operator = xzmj_ack_operator;

let xzmj_ack_dont_win_zero = cc.Class({
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

module.exports.xzmj_ack_dont_win_zero = xzmj_ack_dont_win_zero;

let xzmj_req_enter_match = cc.Class({
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

module.exports.xzmj_req_enter_match = xzmj_req_enter_match;

let xzmj_ack_enter_match = cc.Class({
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

module.exports.xzmj_ack_enter_match = xzmj_ack_enter_match;

let xzmj_req_update_deposit = cc.Class({
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

module.exports.xzmj_req_update_deposit = xzmj_req_update_deposit;

let xzmj_ack_update_deposit = cc.Class({
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

module.exports.xzmj_ack_update_deposit = xzmj_ack_update_deposit;

let xzmj_ack_update_coin = cc.Class({
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

module.exports.xzmj_ack_update_coin = xzmj_ack_update_coin;

let xzmj_ack_shaizi = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.pointList = this.pointList;

        return content;
    },
    setPointList(pointList){
        this.pointList = pointList;
    },

});

module.exports.xzmj_ack_shaizi = xzmj_ack_shaizi;

let xzmj_req_huan3zhang = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.choosecardsList = this.choosecardsList;

        return content;
    },
    setChoosecardsList(choosecardsList){
        this.choosecardsList = choosecardsList;
    },

});

module.exports.xzmj_req_huan3zhang = xzmj_req_huan3zhang;

let xzmj_ack_huan3zhang = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.playerinfoList = this.playerinfoList;

        return content;
    },
    setPlayerinfoList(playerinfoList){
        this.playerinfoList = playerinfoList;
    },

});

module.exports.xzmj_ack_huan3zhang = xzmj_ack_huan3zhang;

let xzmj_req_dingque = cc.Class({
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

module.exports.xzmj_req_dingque = xzmj_req_dingque;

let xzmj_ack_dingque = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.useridList = this.useridList;
        content.typeList = this.typeList;

        return content;
    },
    setUseridList(useridList){
        this.useridList = useridList;
    },
    setTypeList(typeList){
        this.typeList = typeList;
    },

});

module.exports.xzmj_ack_dingque = xzmj_ack_dingque;

let xzmj_ack_huan3zhang_tips = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.paitipsList = this.paitipsList;

        return content;
    },
    setPaitipsList(paitipsList){
        this.paitipsList = paitipsList;
    },

});

module.exports.xzmj_ack_huan3zhang_tips = xzmj_ack_huan3zhang_tips;

let xzmj_ack_dingque_tips = cc.Class({
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

module.exports.xzmj_ack_dingque_tips = xzmj_ack_dingque_tips;

let xzmj_update_palyer_coin = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.useridList = this.useridList;
        content.coinList = this.coinList;

        return content;
    },
    setUseridList(useridList){
        this.useridList = useridList;
    },
    setCoinList(coinList){
        this.coinList = coinList;
    },

});

module.exports.xzmj_update_palyer_coin = xzmj_update_palyer_coin;

let xzmj_gang_data = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userid = this.userid;
        content.fan = this.fan;
        content.gangfen = this.gangfen;
        content.realgangfen = this.realgangfen;

        return content;
    },
    setUserid(userid){
        this.userid = userid;
    },
    setFan(fan){
        this.fan = fan;
    },
    setGangfen(gangfen){
        this.gangfen = gangfen;
    },
    setRealgangfen(realgangfen){
        this.realgangfen = realgangfen;
    },

});

module.exports.xzmj_gang_data = xzmj_gang_data;

let xzmj_one_gang_data = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gangtype = this.gangtype;
        content.loserdataList = this.loserdataList;
        content.winnerdata = this.winnerdata;
        content.isgangzhuanyi = this.isgangzhuanyi;
        content.winuserid = this.winuserid;
        content.gangindex = this.gangindex;

        return content;
    },
    setGangtype(gangtype){
        this.gangtype = gangtype;
    },
    setLoserdataList(loserdataList){
        this.loserdataList = loserdataList;
    },
    setWinnerdata(winnerdata){
        this.winnerdata = winnerdata;
    },
    setIsgangzhuanyi(isgangzhuanyi){
        this.isgangzhuanyi = isgangzhuanyi;
    },
    setWinuserid(winuserid){
        this.winuserid = winuserid;
    },
    setGangindex(gangindex){
        this.gangindex = gangindex;
    },

});

module.exports.xzmj_one_gang_data = xzmj_one_gang_data;

let xzmj_one_hu_data = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.huuserid = this.huuserid;
        content.loseuseridList = this.loseuseridList;
        content.hutypeList = this.hutypeList;
        content.fan = this.fan;
        content.hufen = this.hufen;
        content.realhufen = this.realhufen;
        content.gounums = this.gounums;
        content.paiindex = this.paiindex;
        content.huindex = this.huindex;

        return content;
    },
    setHuuserid(huuserid){
        this.huuserid = huuserid;
    },
    setLoseuseridList(loseuseridList){
        this.loseuseridList = loseuseridList;
    },
    setHutypeList(hutypeList){
        this.hutypeList = hutypeList;
    },
    setFan(fan){
        this.fan = fan;
    },
    setHufen(hufen){
        this.hufen = hufen;
    },
    setRealhufen(realhufen){
        this.realhufen = realhufen;
    },
    setGounums(gounums){
        this.gounums = gounums;
    },
    setPaiindex(paiindex){
        this.paiindex = paiindex;
    },
    setHuindex(huindex){
        this.huindex = huindex;
    },

});

module.exports.xzmj_one_hu_data = xzmj_one_hu_data;

let xzmj_PlayerCoinInfo = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userid = this.userid;
        content.nick = this.nick;
        content.hufen = this.hufen;
        content.score = this.score;
        content.sumscore = this.sumscore;
        content.pailistList = this.pailistList;
        content.ganginfoList = this.ganginfoList;
        content.huinfoList = this.huinfoList;
        content.huazhuinfo = this.huazhuinfo;
        content.chajiaoinfoList = this.chajiaoinfoList;
        content.isyoujiao = this.isyoujiao;

        return content;
    },
    setUserid(userid){
        this.userid = userid;
    },
    setNick(nick){
        this.nick = nick;
    },
    setHufen(hufen){
        this.hufen = hufen;
    },
    setScore(score){
        this.score = score;
    },
    setSumscore(sumscore){
        this.sumscore = sumscore;
    },
    setPailistList(pailistList){
        this.pailistList = pailistList;
    },
    setGanginfoList(ganginfoList){
        this.ganginfoList = ganginfoList;
    },
    setHuinfoList(huinfoList){
        this.huinfoList = huinfoList;
    },
    setHuazhuinfo(huazhuinfo){
        this.huazhuinfo = huazhuinfo;
    },
    setChajiaoinfoList(chajiaoinfoList){
        this.chajiaoinfoList = chajiaoinfoList;
    },
    setIsyoujiao(isyoujiao){
        this.isyoujiao = isyoujiao;
    },

});

module.exports.xzmj_PlayerCoinInfo = xzmj_PlayerCoinInfo;

let xzmj_ack_player_huan3zhang = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.useridList = this.useridList;

        return content;
    },
    setUseridList(useridList){
        this.useridList = useridList;
    },

});

module.exports.xzmj_ack_player_huan3zhang = xzmj_ack_player_huan3zhang;

let xzmj_ack_player_dingque = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.useridList = this.useridList;

        return content;
    },
    setUseridList(useridList){
        this.useridList = useridList;
    },

});

module.exports.xzmj_ack_player_dingque = xzmj_ack_player_dingque;

let xzmj_huazhu_data = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.winuserid = this.winuserid;
        content.huazhuuseridList = this.huazhuuseridList;
        content.huazhufenList = this.huazhufenList;

        return content;
    },
    setWinuserid(winuserid){
        this.winuserid = winuserid;
    },
    setHuazhuuseridList(huazhuuseridList){
        this.huazhuuseridList = huazhuuseridList;
    },
    setHuazhufenList(huazhufenList){
        this.huazhufenList = huazhufenList;
    },

});

module.exports.xzmj_huazhu_data = xzmj_huazhu_data;

let xzmj_one_chajiao_data = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.winuserid = this.winuserid;
        content.chajiaouseridList = this.chajiaouseridList;
        content.chajiaofenList = this.chajiaofenList;

        return content;
    },
    setWinuserid(winuserid){
        this.winuserid = winuserid;
    },
    setChajiaouseridList(chajiaouseridList){
        this.chajiaouseridList = chajiaouseridList;
    },
    setChajiaofenList(chajiaofenList){
        this.chajiaofenList = chajiaofenList;
    },

});

module.exports.xzmj_one_chajiao_data = xzmj_one_chajiao_data;

let xzmj_huan3zhang_player_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userid = this.userid;
        content.choosepaisList = this.choosepaisList;
        content.huanpaisList = this.huanpaisList;

        return content;
    },
    setUserid(userid){
        this.userid = userid;
    },
    setChoosepaisList(choosepaisList){
        this.choosepaisList = choosepaisList;
    },
    setHuanpaisList(huanpaisList){
        this.huanpaisList = huanpaisList;
    },

});

module.exports.xzmj_huan3zhang_player_info = xzmj_huan3zhang_player_info;

