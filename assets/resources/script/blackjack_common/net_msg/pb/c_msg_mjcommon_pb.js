let EndLotteryInfo = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userid = this.userid;
        content.nickname = this.nickname;
        content.bigwin = this.bigwin;
        content.isowner = this.isowner;
        content.wincoin = this.wincoin;
        content.counthu = this.counthu;
        content.countzimo = this.countzimo;
        content.countdianpao = this.countdianpao;
        content.countangang = this.countangang;
        content.countminggang = this.countminggang;
        content.countdiangang = this.countdiangang;
        content.countchajiao = this.countchajiao;
        content.bestgunner = this.bestgunner;

        return content;
    },
    setUserid(userid){
        this.userid = userid;
    },
    setNickname(nickname){
        this.nickname = nickname;
    },
    setBigwin(bigwin){
        this.bigwin = bigwin;
    },
    setIsowner(isowner){
        this.isowner = isowner;
    },
    setWincoin(wincoin){
        this.wincoin = wincoin;
    },
    setCounthu(counthu){
        this.counthu = counthu;
    },
    setCountzimo(countzimo){
        this.countzimo = countzimo;
    },
    setCountdianpao(countdianpao){
        this.countdianpao = countdianpao;
    },
    setCountangang(countangang){
        this.countangang = countangang;
    },
    setCountminggang(countminggang){
        this.countminggang = countminggang;
    },
    setCountdiangang(countdiangang){
        this.countdiangang = countdiangang;
    },
    setCountchajiao(countchajiao){
        this.countchajiao = countchajiao;
    },
    setBestgunner(bestgunner){
        this.bestgunner = bestgunner;
    },

});

module.exports.EndLotteryInfo = EndLotteryInfo;

let PlayerCard = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.handcardList = this.handcardList;
        content.composecardList = this.composecardList;
        content.outcardList = this.outcardList;
        content.hucardList = this.hucardList;
        content.mopai = this.mopai;
        content.userid = this.userid;
        content.handcardcount = this.handcardcount;
        content.hucardtypeList = this.hucardtypeList;

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
    setMopai(mopai){
        this.mopai = mopai;
    },
    setUserid(userid){
        this.userid = userid;
    },
    setHandcardcount(handcardcount){
        this.handcardcount = handcardcount;
    },
    setHucardtypeList(hucardtypeList){
        this.hucardtypeList = hucardtypeList;
    },

});

module.exports.PlayerCard = PlayerCard;

let HoldCardInfo = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userid = this.userid;
        content.mopai = this.mopai;
        content.holdcardList = this.holdcardList;

        return content;
    },
    setUserid(userid){
        this.userid = userid;
    },
    setMopai(mopai){
        this.mopai = mopai;
    },
    setHoldcardList(holdcardList){
        this.holdcardList = holdcardList;
    },

});

module.exports.HoldCardInfo = HoldCardInfo;

let ChiOverTurn = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.chicardList = this.chicardList;

        return content;
    },
    setChicardList(chicardList){
        this.chicardList = chicardList;
    },

});

module.exports.ChiOverTurn = ChiOverTurn;

let PlayerCoinInfo = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userid = this.userid;
        content.nick = this.nick;
        content.gangfen = this.gangfen;
        content.hufen = this.hufen;
        content.total = this.total;
        content.nowscore = this.nowscore;
        content.isdianpao = this.isdianpao;
        content.isting = this.isting;
        content.xiaojicount = this.xiaojicount;
        content.pailistList = this.pailistList;
        content.baolistseeList = this.baolistseeList;
        content.baolistList = this.baolistList;
        content.zhafen = this.zhafen;
        content.genzysfen = this.genzysfen;
        content.isxiaosa = this.isxiaosa;
        content.yupaifen = this.yupaifen;
        content.xuehunfen = this.xuehunfen;
        content.paofen = this.paofen;

        return content;
    },
    setUserid(userid){
        this.userid = userid;
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
    setNowscore(nowscore){
        this.nowscore = nowscore;
    },
    setIsdianpao(isdianpao){
        this.isdianpao = isdianpao;
    },
    setIsting(isting){
        this.isting = isting;
    },
    setXiaojicount(xiaojicount){
        this.xiaojicount = xiaojicount;
    },
    setPailistList(pailistList){
        this.pailistList = pailistList;
    },
    setBaolistseeList(baolistseeList){
        this.baolistseeList = baolistseeList;
    },
    setBaolistList(baolistList){
        this.baolistList = baolistList;
    },
    setZhafen(zhafen){
        this.zhafen = zhafen;
    },
    setGenzysfen(genzysfen){
        this.genzysfen = genzysfen;
    },
    setIsxiaosa(isxiaosa){
        this.isxiaosa = isxiaosa;
    },
    setYupaifen(yupaifen){
        this.yupaifen = yupaifen;
    },
    setXuehunfen(xuehunfen){
        this.xuehunfen = xuehunfen;
    },
    setPaofen(paofen){
        this.paofen = paofen;
    },

});

module.exports.PlayerCoinInfo = PlayerCoinInfo;

let user_coin_bean = cc.Class({
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

module.exports.user_coin_bean = user_coin_bean;

let BuCardInfo = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.type = this.type;
        content.value = this.value;
        content.id = this.id;
        content.cnt = this.cnt;

        return content;
    },
    setType(type){
        this.type = type;
    },
    setValue(value){
        this.value = value;
    },
    setId(id){
        this.id = id;
    },
    setCnt(cnt){
        this.cnt = cnt;
    },

});

module.exports.BuCardInfo = BuCardInfo;

let ComposeCard = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.value = this.value;
        content.type = this.type;
        content.cardsList = this.cardsList;
        content.useridout = this.useridout;

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
    setUseridout(useridout){
        this.useridout = useridout;
    },

});

module.exports.ComposeCard = ComposeCard;

let mj_hupai_type = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.hucardtypeList = this.hucardtypeList;

        return content;
    },
    setHucardtypeList(hucardtypeList){
        this.hucardtypeList = hucardtypeList;
    },

});

module.exports.mj_hupai_type = mj_hupai_type;

let DeskGameInfo = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gamestatus = this.gamestatus;
        content.playernum = this.playernum;
        content.remaincards = this.remaincards;
        content.banker = this.banker;
        content.unbaopai = this.unbaopai;
        content.lastoutnum = this.lastoutnum;

        return content;
    },
    setGamestatus(gamestatus){
        this.gamestatus = gamestatus;
    },
    setPlayernum(playernum){
        this.playernum = playernum;
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
    setLastoutnum(lastoutnum){
        this.lastoutnum = lastoutnum;
    },

});

module.exports.DeskGameInfo = DeskGameInfo;

let PlayerInfo = cc.Class({
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
        content.isxiaosa = this.isxiaosa;
        content.dingquetype = this.dingquetype;
        content.huorder = this.huorder;
        content.paofen = this.paofen;
        content.hutypeList = this.hutypeList;

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
    setIsxiaosa(isxiaosa){
        this.isxiaosa = isxiaosa;
    },
    setDingquetype(dingquetype){
        this.dingquetype = dingquetype;
    },
    setHuorder(huorder){
        this.huorder = huorder;
    },
    setPaofen(paofen){
        this.paofen = paofen;
    },
    setHutypeList(hutypeList){
        this.hutypeList = hutypeList;
    },

});

module.exports.PlayerInfo = PlayerInfo;

let FinallyTotal = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userid = this.userid;
        content.totalscore = this.totalscore;
        content.wincount = this.wincount;
        content.mobaocount = this.mobaocount;
        content.dianpaocount = this.dianpaocount;
        content.lianzhuangcount = this.lianzhuangcount;

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
    setMobaocount(mobaocount){
        this.mobaocount = mobaocount;
    },
    setDianpaocount(dianpaocount){
        this.dianpaocount = dianpaocount;
    },
    setLianzhuangcount(lianzhuangcount){
        this.lianzhuangcount = lianzhuangcount;
    },

});

module.exports.FinallyTotal = FinallyTotal;

let JiaoInfo = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.outcard = this.outcard;
        content.paiinfosList = this.paiinfosList;
        content.angang = this.angang;
        content.chitingindex = this.chitingindex;
        content.anyjiao = this.anyjiao;
        content.tinggangcardsList = this.tinggangcardsList;

        return content;
    },
    setOutcard(outcard){
        this.outcard = outcard;
    },
    setPaiinfosList(paiinfosList){
        this.paiinfosList = paiinfosList;
    },
    setAngang(angang){
        this.angang = angang;
    },
    setChitingindex(chitingindex){
        this.chitingindex = chitingindex;
    },
    setAnyjiao(anyjiao){
        this.anyjiao = anyjiao;
    },
    setTinggangcardsList(tinggangcardsList){
        this.tinggangcardsList = tinggangcardsList;
    },

});

module.exports.JiaoInfo = JiaoInfo;

let JiaoPaiInfo = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.hucard = this.hucard;
        content.fan = this.fan;
        content.count = this.count;
        content.anganghu = this.anganghu;
        content.iscanddsj = this.iscanddsj;
        content.ismustddsj = this.ismustddsj;
        content.hutypesList = this.hutypesList;

        return content;
    },
    setHucard(hucard){
        this.hucard = hucard;
    },
    setFan(fan){
        this.fan = fan;
    },
    setCount(count){
        this.count = count;
    },
    setAnganghu(anganghu){
        this.anganghu = anganghu;
    },
    setIscanddsj(iscanddsj){
        this.iscanddsj = iscanddsj;
    },
    setIsmustddsj(ismustddsj){
        this.ismustddsj = ismustddsj;
    },
    setHutypesList(hutypesList){
        this.hutypesList = hutypesList;
    },

});

module.exports.JiaoPaiInfo = JiaoPaiInfo;

let GangOverTurn = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.centercard = this.centercard;
        content.isnewdealstyle = this.isnewdealstyle;
        content.gangcardList = this.gangcardList;

        return content;
    },
    setCentercard(centercard){
        this.centercard = centercard;
    },
    setIsnewdealstyle(isnewdealstyle){
        this.isnewdealstyle = isnewdealstyle;
    },
    setGangcardList(gangcardList){
        this.gangcardList = gangcardList;
    },

});

module.exports.GangOverTurn = GangOverTurn;

let BuGangOverTurn = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.centercard = this.centercard;
        content.bugangcardList = this.bugangcardList;

        return content;
    },
    setCentercard(centercard){
        this.centercard = centercard;
    },
    setBugangcardList(bugangcardList){
        this.bugangcardList = bugangcardList;
    },

});

module.exports.BuGangOverTurn = BuGangOverTurn;

let CtrlCard = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.cardtype = this.cardtype;
        content.cardinfo = this.cardinfo;

        return content;
    },
    setCardtype(cardtype){
        this.cardtype = cardtype;
    },
    setCardinfo(cardinfo){
        this.cardinfo = cardinfo;
    },

});

module.exports.CtrlCard = CtrlCard;

let CardArr = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.type = this.type;
        content.cardindexList = this.cardindexList;

        return content;
    },
    setType(type){
        this.type = type;
    },
    setCardindexList(cardindexList){
        this.cardindexList = cardindexList;
    },

});

module.exports.CardArr = CardArr;

let CardInfo = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.type = this.type;
        content.value = this.value;
        content.id = this.id;

        return content;
    },
    setType(type){
        this.type = type;
    },
    setValue(value){
        this.value = value;
    },
    setId(id){
        this.id = id;
    },

});

module.exports.CardInfo = CardInfo;

let mj_desk_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.owner = this.owner;
        content.passwrod = this.passwrod;
        content.currcircle = this.currcircle;
        content.desktype = this.desktype;
        content.configid = this.configid;
        content.rule = this.rule;

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
    setRule(rule){
        this.rule = rule;
    },

});

module.exports.mj_desk_info = mj_desk_info;

let mj_game_ack_act_hu = cc.Class({
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

module.exports.mj_game_ack_act_hu = mj_game_ack_act_hu;

let mj_ack_send_current_result = cc.Class({
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

module.exports.mj_ack_send_current_result = mj_ack_send_current_result;

let mj_ack_game_opening = cc.Class({
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

module.exports.mj_ack_game_opening = mj_ack_game_opening;

let mj_ack_roomInit = cc.Class({
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

module.exports.mj_ack_roomInit = mj_ack_roomInit;

let mj_ack_createDesk = cc.Class({
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

module.exports.mj_ack_createDesk = mj_ack_createDesk;

let mj_req_enterDesk = cc.Class({
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

module.exports.mj_req_enterDesk = mj_req_enterDesk;

let mj_ack_enterDesk = cc.Class({
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

module.exports.mj_ack_enterDesk = mj_ack_enterDesk;

let mj_req_leave_status = cc.Class({
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

module.exports.mj_req_leave_status = mj_req_leave_status;

let mj_ack_leave_status = cc.Class({
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

module.exports.mj_ack_leave_status = mj_ack_leave_status;

let mj_req_sponsor_dissolve_room = cc.Class({
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

module.exports.mj_req_sponsor_dissolve_room = mj_req_sponsor_dissolve_room;

let mj_ack_sponsor_dissolve_room = cc.Class({
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

module.exports.mj_ack_sponsor_dissolve_room = mj_ack_sponsor_dissolve_room;

let mj_req_response_dissolve_room = cc.Class({
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

module.exports.mj_req_response_dissolve_room = mj_req_response_dissolve_room;

let mj_ack_response_dissolve_room = cc.Class({
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

module.exports.mj_ack_response_dissolve_room = mj_ack_response_dissolve_room;

let mj_req_dissolve_room = cc.Class({
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

module.exports.mj_req_dissolve_room = mj_req_dissolve_room;

let mj_ack_dissolve_room = cc.Class({
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

module.exports.mj_ack_dissolve_room = mj_ack_dissolve_room;

let mj_req_exit_room = cc.Class({
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

module.exports.mj_req_exit_room = mj_req_exit_room;

let mj_ack_exit_room = cc.Class({
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

module.exports.mj_ack_exit_room = mj_ack_exit_room;

let mj_ack_playerEnter = cc.Class({
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

module.exports.mj_ack_playerEnter = mj_ack_playerEnter;

let mj_req_ready = cc.Class({
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

module.exports.mj_req_ready = mj_req_ready;

let mj_ack_ready = cc.Class({
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

module.exports.mj_ack_ready = mj_ack_ready;

let mj_ack_opening = cc.Class({
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

module.exports.mj_ack_opening = mj_ack_opening;

let mj_bc_moPai = cc.Class({
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

module.exports.mj_bc_moPai = mj_bc_moPai;

let mj_ack_game_overturn = cc.Class({
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
        content.canbuhua = this.canbuhua;
        content.ismusthu = this.ismusthu;
        content.canchiting = this.canchiting;
        content.canpengting = this.canpengting;
        content.cangangting = this.cangangting;
        content.cangu = this.cangu;
        content.canliangxi = this.canliangxi;
        content.canliangzhang = this.canliangzhang;
        content.actcard = this.actcard;
        content.jiaoinfosList = this.jiaoinfosList;
        content.gangcards = this.gangcards;
        content.bugangcards = this.bugangcards;
        content.chiinfoList = this.chiinfoList;
        content.handleruserid = this.handleruserid;
        content.cannothutipsList = this.cannothutipsList;
        content.cangangmopai = this.cangangmopai;
        content.chitingjiaoinfosList = this.chitingjiaoinfosList;
        content.gangtingjiaoinfosList = this.gangtingjiaoinfosList;
        content.pengtingjiaoinfosList = this.pengtingjiaoinfosList;
        content.liangzhangcardsList = this.liangzhangcardsList;

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
    setCanbuhua(canbuhua){
        this.canbuhua = canbuhua;
    },
    setIsmusthu(ismusthu){
        this.ismusthu = ismusthu;
    },
    setCanchiting(canchiting){
        this.canchiting = canchiting;
    },
    setCanpengting(canpengting){
        this.canpengting = canpengting;
    },
    setCangangting(cangangting){
        this.cangangting = cangangting;
    },
    setCangu(cangu){
        this.cangu = cangu;
    },
    setCanliangxi(canliangxi){
        this.canliangxi = canliangxi;
    },
    setCanliangzhang(canliangzhang){
        this.canliangzhang = canliangzhang;
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
    setChitingjiaoinfosList(chitingjiaoinfosList){
        this.chitingjiaoinfosList = chitingjiaoinfosList;
    },
    setGangtingjiaoinfosList(gangtingjiaoinfosList){
        this.gangtingjiaoinfosList = gangtingjiaoinfosList;
    },
    setPengtingjiaoinfosList(pengtingjiaoinfosList){
        this.pengtingjiaoinfosList = pengtingjiaoinfosList;
    },
    setLiangzhangcardsList(liangzhangcardsList){
        this.liangzhangcardsList = liangzhangcardsList;
    },

});

module.exports.mj_ack_game_overturn = mj_ack_game_overturn;

let mj_ack_game_deal_cards = cc.Class({
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

module.exports.mj_ack_game_deal_cards = mj_ack_game_deal_cards;

let mj_ack_game_send_out_card = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.result = this.result;
        content.userid = this.userid;
        content.card = this.card;
        content.isauto = this.isauto;
        content.othertipsList = this.othertipsList;

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
    setOthertipsList(othertipsList){
        this.othertipsList = othertipsList;
    },

});

module.exports.mj_ack_game_send_out_card = mj_ack_game_send_out_card;

let mj_game_send_end_lottery = cc.Class({
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

module.exports.mj_game_send_end_lottery = mj_game_send_end_lottery;

let mj_req_game_send_out_card = cc.Class({
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

module.exports.mj_req_game_send_out_card = mj_req_game_send_out_card;

let mj_req_chi = cc.Class({
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

module.exports.mj_req_chi = mj_req_chi;

let mj_ack_chi = cc.Class({
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

module.exports.mj_ack_chi = mj_ack_chi;

let mj_req_game_act_peng = cc.Class({
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

module.exports.mj_req_game_act_peng = mj_req_game_act_peng;

let mj_ack_game_act_peng = cc.Class({
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

module.exports.mj_ack_game_act_peng = mj_ack_game_act_peng;

let mj_req_game_act_gang = cc.Class({
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

module.exports.mj_req_game_act_gang = mj_req_game_act_gang;

let mj_ack_game_act_gang = cc.Class({
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
        content.othertipsList = this.othertipsList;

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
    setOthertipsList(othertipsList){
        this.othertipsList = othertipsList;
    },

});

module.exports.mj_ack_game_act_gang = mj_ack_game_act_gang;

let mj_req_game_act_bugang = cc.Class({
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

module.exports.mj_req_game_act_bugang = mj_req_game_act_bugang;

let mj_ack_game_act_bugang = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.userid = this.userid;
        content.bugangcard = this.bugangcard;
        content.bugangcardsList = this.bugangcardsList;
        content.othertipsList = this.othertipsList;

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
    setOthertipsList(othertipsList){
        this.othertipsList = othertipsList;
    },

});

module.exports.mj_ack_game_act_bugang = mj_ack_game_act_bugang;

let mj_req_game_act_guo = cc.Class({
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

module.exports.mj_req_game_act_guo = mj_req_game_act_guo;

let mj_ack_game_act_guo = cc.Class({
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

module.exports.mj_ack_game_act_guo = mj_ack_game_act_guo;

let mj_req_game_act_hu = cc.Class({
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

module.exports.mj_req_game_act_hu = mj_req_game_act_hu;

let mj_req_game_ting = cc.Class({
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

module.exports.mj_req_game_ting = mj_req_game_ting;

let mj_ack_game_ting = cc.Class({
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

module.exports.mj_ack_game_ting = mj_ack_game_ting;

let mj_ack_game_dabao = cc.Class({
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

module.exports.mj_ack_game_dabao = mj_ack_game_dabao;

let mj_ack_game_changbao = cc.Class({
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

module.exports.mj_ack_game_changbao = mj_ack_game_changbao;

let mj_req_remain_majiang = cc.Class({
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

module.exports.mj_req_remain_majiang = mj_req_remain_majiang;

let mj_ack_remain_majiang = cc.Class({
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

module.exports.mj_ack_remain_majiang = mj_ack_remain_majiang;

let mj_req_change_majiang = cc.Class({
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

module.exports.mj_req_change_majiang = mj_req_change_majiang;

let mj_ack_change_majiang = cc.Class({
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

module.exports.mj_ack_change_majiang = mj_ack_change_majiang;

let mj_ask_show_tingpai_tips = cc.Class({
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

module.exports.mj_ask_show_tingpai_tips = mj_ask_show_tingpai_tips;

let mj_ack_rob_remove_card = cc.Class({
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

module.exports.mj_ack_rob_remove_card = mj_ack_rob_remove_card;

let mj_ack_update_user_status = cc.Class({
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

module.exports.mj_ack_update_user_status = mj_ack_update_user_status;

let mj_req_reconnect = cc.Class({
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

module.exports.mj_req_reconnect = mj_req_reconnect;

let mj_ack_reconnect = cc.Class({
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

module.exports.mj_ack_reconnect = mj_ack_reconnect;

let mj_ack_send_player_handinfo = cc.Class({
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

module.exports.mj_ack_send_player_handinfo = mj_ack_send_player_handinfo;

let mj_req_reloading_ok = cc.Class({
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

module.exports.mj_req_reloading_ok = mj_req_reloading_ok;

let mj_ack_reloading_ok = cc.Class({
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

module.exports.mj_ack_reloading_ok = mj_ack_reloading_ok;

let mj_ack_finally_result = cc.Class({
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

module.exports.mj_ack_finally_result = mj_ack_finally_result;

let mj_ack_fen_zhang = cc.Class({
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

module.exports.mj_ack_fen_zhang = mj_ack_fen_zhang;

let mj_ack_user_info = cc.Class({
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

module.exports.mj_ack_user_info = mj_ack_user_info;

let mj_req_tingpai_out_card = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.cardid = this.cardid;
        content.tingtype = this.tingtype;
        content.ddsjcardid = this.ddsjcardid;
        content.lzbcardid = this.lzbcardid;
        content.tinggangpaiidsList = this.tinggangpaiidsList;

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
    setTinggangpaiidsList(tinggangpaiidsList){
        this.tinggangpaiidsList = tinggangpaiidsList;
    },

});

module.exports.mj_req_tingpai_out_card = mj_req_tingpai_out_card;

let mj_game_ack_act_huangzhuangpais = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.holdcardinfoList = this.holdcardinfoList;
        content.isshangjuhuangzhuang = this.isshangjuhuangzhuang;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setHoldcardinfoList(holdcardinfoList){
        this.holdcardinfoList = holdcardinfoList;
    },
    setIsshangjuhuangzhuang(isshangjuhuangzhuang){
        this.isshangjuhuangzhuang = isshangjuhuangzhuang;
    },

});

module.exports.mj_game_ack_act_huangzhuangpais = mj_game_ack_act_huangzhuangpais;

let mj_ack_operator = cc.Class({
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

module.exports.mj_ack_operator = mj_ack_operator;

let mj_ack_dont_win_zero = cc.Class({
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

module.exports.mj_ack_dont_win_zero = mj_ack_dont_win_zero;

let mj_req_enter_match = cc.Class({
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

module.exports.mj_req_enter_match = mj_req_enter_match;

let mj_ack_enter_match = cc.Class({
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

module.exports.mj_ack_enter_match = mj_ack_enter_match;

let mj_req_update_deposit = cc.Class({
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

module.exports.mj_req_update_deposit = mj_req_update_deposit;

let mj_ack_update_deposit = cc.Class({
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

module.exports.mj_ack_update_deposit = mj_ack_update_deposit;

let mj_ack_update_coin = cc.Class({
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

module.exports.mj_ack_update_coin = mj_ack_update_coin;

let mj_ack_bao = cc.Class({
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

module.exports.mj_ack_bao = mj_ack_bao;

let mj_req_paofen = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.score = this.score;

        return content;
    },
    setScore(score){
        this.score = score;
    },

});

module.exports.mj_req_paofen = mj_req_paofen;

let mj_ack_paofen = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userid = this.userid;
        content.score = this.score;

        return content;
    },
    setUserid(userid){
        this.userid = userid;
    },
    setScore(score){
        this.score = score;
    },

});

module.exports.mj_ack_paofen = mj_ack_paofen;

let mj_one_hu_data = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.huuserid = this.huuserid;
        content.loseuseridList = this.loseuseridList;
        content.hutypeList = this.hutypeList;
        content.fan = this.fan;
        content.hufen = this.hufen;
        content.paiindex = this.paiindex;
        content.paofen = this.paofen;

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
    setPaiindex(paiindex){
        this.paiindex = paiindex;
    },
    setPaofen(paofen){
        this.paofen = paofen;
    },

});

module.exports.mj_one_hu_data = mj_one_hu_data;

let mj_PlayerCoinInfo = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userid = this.userid;
        content.nick = this.nick;
        content.gangfen = this.gangfen;
        content.hufen = this.hufen;
        content.total = this.total;
        content.nowscore = this.nowscore;
        content.isdianpao = this.isdianpao;
        content.pailistList = this.pailistList;
        content.baolistseeList = this.baolistseeList;
        content.baolistList = this.baolistList;
        content.paofen = this.paofen;

        return content;
    },
    setUserid(userid){
        this.userid = userid;
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
    setNowscore(nowscore){
        this.nowscore = nowscore;
    },
    setIsdianpao(isdianpao){
        this.isdianpao = isdianpao;
    },
    setPailistList(pailistList){
        this.pailistList = pailistList;
    },
    setBaolistseeList(baolistseeList){
        this.baolistseeList = baolistseeList;
    },
    setBaolistList(baolistList){
        this.baolistList = baolistList;
    },
    setPaofen(paofen){
        this.paofen = paofen;
    },

});

module.exports.mj_PlayerCoinInfo = mj_PlayerCoinInfo;

let mj_OthersOperateTips = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userid = this.userid;
        content.canchi = this.canchi;
        content.canpeng = this.canpeng;
        content.cangang = this.cangang;
        content.canhu = this.canhu;

        return content;
    },
    setUserid(userid){
        this.userid = userid;
    },
    setCanchi(canchi){
        this.canchi = canchi;
    },
    setCanpeng(canpeng){
        this.canpeng = canpeng;
    },
    setCangang(cangang){
        this.cangang = cangang;
    },
    setCanhu(canhu){
        this.canhu = canhu;
    },

});

module.exports.mj_OthersOperateTips = mj_OthersOperateTips;

let mj_req_buhua = cc.Class({
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

module.exports.mj_req_buhua = mj_req_buhua;

let mj_ack_buhua = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userid = this.userid;
        content.card = this.card;

        return content;
    },
    setUserid(userid){
        this.userid = userid;
    },
    setCard(card){
        this.card = card;
    },

});

module.exports.mj_ack_buhua = mj_ack_buhua;

let mj_req_chiting = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.chicard = this.chicard;
        content.choosecardsList = this.choosecardsList;
        content.outcard = this.outcard;
        content.tingtype = this.tingtype;
        content.ddsjcardid = this.ddsjcardid;
        content.lzbcardid = this.lzbcardid;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setChicard(chicard){
        this.chicard = chicard;
    },
    setChoosecardsList(choosecardsList){
        this.choosecardsList = choosecardsList;
    },
    setOutcard(outcard){
        this.outcard = outcard;
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

module.exports.mj_req_chiting = mj_req_chiting;

let mj_ack_chiting = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.chicardList = this.chicardList;
        content.useridout = this.useridout;
        content.useridin = this.useridin;
        content.ddsjcardsList = this.ddsjcardsList;
        content.lzbcardsList = this.lzbcardsList;

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
    setDdsjcardsList(ddsjcardsList){
        this.ddsjcardsList = ddsjcardsList;
    },
    setLzbcardsList(lzbcardsList){
        this.lzbcardsList = lzbcardsList;
    },

});

module.exports.mj_ack_chiting = mj_ack_chiting;

let mj_chiting_jiaoInfos = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.jiaoinfosList = this.jiaoinfosList;

        return content;
    },
    setJiaoinfosList(jiaoinfosList){
        this.jiaoinfosList = jiaoinfosList;
    },

});

module.exports.mj_chiting_jiaoInfos = mj_chiting_jiaoInfos;

let mj_req_pengting = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.outcard = this.outcard;
        content.tingtype = this.tingtype;
        content.ddsjcardid = this.ddsjcardid;
        content.lzbcardid = this.lzbcardid;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setOutcard(outcard){
        this.outcard = outcard;
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

module.exports.mj_req_pengting = mj_req_pengting;

let mj_ack_pengting = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.pengcardList = this.pengcardList;
        content.useridout = this.useridout;
        content.useridin = this.useridin;
        content.isrob = this.isrob;
        content.ddsjcardsList = this.ddsjcardsList;
        content.lzbcardsList = this.lzbcardsList;

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
    setDdsjcardsList(ddsjcardsList){
        this.ddsjcardsList = ddsjcardsList;
    },
    setLzbcardsList(lzbcardsList){
        this.lzbcardsList = lzbcardsList;
    },

});

module.exports.mj_ack_pengting = mj_ack_pengting;

let mj_req_gangting = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.choosecardsList = this.choosecardsList;
        content.tingtype = this.tingtype;
        content.ddsjcardid = this.ddsjcardid;
        content.lzbcardid = this.lzbcardid;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setChoosecardsList(choosecardsList){
        this.choosecardsList = choosecardsList;
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

module.exports.mj_req_gangting = mj_req_gangting;

let mj_ack_gangting = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.useridout = this.useridout;
        content.useridin = this.useridin;
        content.gangcardList = this.gangcardList;
        content.usercoinbeansList = this.usercoinbeansList;
        content.isrob = this.isrob;
        content.ddsjcardsList = this.ddsjcardsList;
        content.lzbcardsList = this.lzbcardsList;

        return content;
    },
    setHeader(header){
        this.header = header;
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
    setDdsjcardsList(ddsjcardsList){
        this.ddsjcardsList = ddsjcardsList;
    },
    setLzbcardsList(lzbcardsList){
        this.lzbcardsList = lzbcardsList;
    },

});

module.exports.mj_ack_gangting = mj_ack_gangting;

