let ProtoHeader = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.version = this.version;
        content.userid = this.userid;
        content.code = this.code;
        content.error = this.error;

        return content;
    },
    setVersion(version){
        this.version = version;
    },
    setUserid(userid){
        this.userid = userid;
    },
    setCode(code){
        this.code = code;
    },
    setError(error){
        this.error = error;
    },

});

module.exports.ProtoHeader = ProtoHeader;

let ServerInfo = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.ip = this.ip;
        content.port = this.port;
        content.releasetag = this.releasetag;
        content.currversion = this.currversion;
        content.isupdate = this.isupdate;
        content.downloadurl = this.downloadurl;
        content.versioninfo = this.versioninfo;
        content.ismaintain = this.ismaintain;
        content.maintainmsg = this.maintainmsg;
        content.status = this.status;
        content.gameid = this.gameid;

        return content;
    },
    setIp(ip){
        this.ip = ip;
    },
    setPort(port){
        this.port = port;
    },
    setReleasetag(releasetag){
        this.releasetag = releasetag;
    },
    setCurrversion(currversion){
        this.currversion = currversion;
    },
    setIsupdate(isupdate){
        this.isupdate = isupdate;
    },
    setDownloadurl(downloadurl){
        this.downloadurl = downloadurl;
    },
    setVersioninfo(versioninfo){
        this.versioninfo = versioninfo;
    },
    setIsmaintain(ismaintain){
        this.ismaintain = ismaintain;
    },
    setMaintainmsg(maintainmsg){
        this.maintainmsg = maintainmsg;
    },
    setStatus(status){
        this.status = status;
    },
    setGameid(gameid){
        this.gameid = gameid;
    },

});

module.exports.ServerInfo = ServerInfo;

let NetIMInfo = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.nimid = this.nimid;
        content.nimtoken = this.nimtoken;

        return content;
    },
    setNimid(nimid){
        this.nimid = nimid;
    },
    setNimtoken(nimtoken){
        this.nimtoken = nimtoken;
    },

});

module.exports.NetIMInfo = NetIMInfo;

let QuickConn = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.channelid = this.channelid;
        content.gameid = this.gameid;
        content.currversion = this.currversion;
        content.languageid = this.languageid;
        content.userid = this.userid;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setChannelid(channelid){
        this.channelid = channelid;
    },
    setGameid(gameid){
        this.gameid = gameid;
    },
    setCurrversion(currversion){
        this.currversion = currversion;
    },
    setLanguageid(languageid){
        this.languageid = languageid;
    },
    setUserid(userid){
        this.userid = userid;
    },

});

module.exports.QuickConn = QuickConn;

let AckQuickConn = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.gameserverList = this.gameserverList;
        content.serverlistversion = this.serverlistversion;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setGameserverList(gameserverList){
        this.gameserverList = gameserverList;
    },
    setServerlistversion(serverlistversion){
        this.serverlistversion = serverlistversion;
    },

});

module.exports.AckQuickConn = AckQuickConn;

let WeixinInfo = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.openid = this.openid;
        content.nickname = this.nickname;
        content.headurl = this.headurl;
        content.sex = this.sex;
        content.city = this.city;
        content.unionid = this.unionid;

        return content;
    },
    setOpenid(openid){
        this.openid = openid;
    },
    setNickname(nickname){
        this.nickname = nickname;
    },
    setHeadurl(headurl){
        this.headurl = headurl;
    },
    setSex(sex){
        this.sex = sex;
    },
    setCity(city){
        this.city = city;
    },
    setUnionid(unionid){
        this.unionid = unionid;
    },

});

module.exports.WeixinInfo = WeixinInfo;

let common_req_reg = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.regtype = this.regtype;
        content.wxinfo = this.wxinfo;
        content.clientostype = this.clientostype;
        content.channelid = this.channelid;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setRegtype(regtype){
        this.regtype = regtype;
    },
    setWxinfo(wxinfo){
        this.wxinfo = wxinfo;
    },
    setClientostype(clientostype){
        this.clientostype = clientostype;
    },
    setChannelid(channelid){
        this.channelid = channelid;
    },

});

module.exports.common_req_reg = common_req_reg;

let common_ack_reg = cc.Class({
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

module.exports.common_ack_reg = common_ack_reg;

let cm_offline = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.cm_offline = cm_offline;

let cm_hearbeat = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.seqId = this.seqId;

        return content;
    },
    setSeqId(seqId){
        this.seqId = seqId;
    },

});

module.exports.cm_hearbeat = cm_hearbeat;

let common_req_message = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.msgtype = this.msgtype;
        content.id = this.id;
        content.msg = this.msg;
        content.userid = this.userid;
        content.deskid = this.deskid;
        content.touserid = this.touserid;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setMsgtype(msgtype){
        this.msgtype = msgtype;
    },
    setId(id){
        this.id = id;
    },
    setMsg(msg){
        this.msg = msg;
    },
    setUserid(userid){
        this.userid = userid;
    },
    setDeskid(deskid){
        this.deskid = deskid;
    },
    setTouserid(touserid){
        this.touserid = touserid;
    },

});

module.exports.common_req_message = common_req_message;

let common_bc = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.msgtype = this.msgtype;
        content.id = this.id;
        content.msg = this.msg;
        content.userid = this.userid;
        content.touserid = this.touserid;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setMsgtype(msgtype){
        this.msgtype = msgtype;
    },
    setId(id){
        this.id = id;
    },
    setMsg(msg){
        this.msg = msg;
    },
    setUserid(userid){
        this.userid = userid;
    },
    setTouserid(touserid){
        this.touserid = touserid;
    },

});

module.exports.common_bc = common_bc;

let ComUseItem = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.touserid = this.touserid;
        content.itemid = this.itemid;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setTouserid(touserid){
        this.touserid = touserid;
    },
    setItemid(itemid){
        this.itemid = itemid;
    },

});

module.exports.ComUseItem = ComUseItem;

let ComUseItemRsp = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.itemid = this.itemid;
        content.resultcode = this.resultcode;
        content.touserid = this.touserid;
        content.userid = this.userid;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setItemid(itemid){
        this.itemid = itemid;
    },
    setResultcode(resultcode){
        this.resultcode = resultcode;
    },
    setTouserid(touserid){
        this.touserid = touserid;
    },
    setUserid(userid){
        this.userid = userid;
    },

});

module.exports.ComUseItemRsp = ComUseItemRsp;

let net_down_reason = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.code = this.code;

        return content;
    },
    setCode(code){
        this.code = code;
    },

});

module.exports.net_down_reason = net_down_reason;

let msg_hearbeat_num = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.num = this.num;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setNum(num){
        this.num = num;
    },

});

module.exports.msg_hearbeat_num = msg_hearbeat_num;

let msg_switch_client = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_switch_client = msg_switch_client;

let msg_notify_client_log = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_notify_client_log = msg_notify_client_log;

