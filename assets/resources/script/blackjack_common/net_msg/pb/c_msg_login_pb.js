let wx_login_by_code_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.code = this.code;
        content.channel = this.channel;
        content.ip = this.ip;

        return content;
    },
    setCode(code){
        this.code = code;
    },
    setChannel(channel){
        this.channel = channel;
    },
    setIp(ip){
        this.ip = ip;
    },

});

module.exports.wx_login_by_code_req = wx_login_by_code_req;

let login_by_refresh_token_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.refreshToken = this.refreshToken;
        content.channel = this.channel;
        content.ip = this.ip;

        return content;
    },
    setRefreshToken(refreshToken){
        this.refreshToken = refreshToken;
    },
    setChannel(channel){
        this.channel = channel;
    },
    setIp(ip){
        this.ip = ip;
    },

});

module.exports.login_by_refresh_token_req = login_by_refresh_token_req;

let googlePlay_login_by_code_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.code = this.code;
        content.channel = this.channel;
        content.ip = this.ip;

        return content;
    },
    setCode(code){
        this.code = code;
    },
    setChannel(channel){
        this.channel = channel;
    },
    setIp(ip){
        this.ip = ip;
    },

});

module.exports.googlePlay_login_by_code_req = googlePlay_login_by_code_req;

let common_login_ack = cc.Class({
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

module.exports.common_login_ack = common_login_ack;

let common_token_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.token = this.token;

        return content;
    },
    setToken(token){
        this.token = token;
    },

});

module.exports.common_token_ack = common_token_ack;

let common_refresh_notify = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.common_refresh_notify = common_refresh_notify;

let common_refresh_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.refresh = this.refresh;
        content.channel = this.channel;

        return content;
    },
    setRefresh(refresh){
        this.refresh = refresh;
    },
    setChannel(channel){
        this.channel = channel;
    },

});

module.exports.common_refresh_req = common_refresh_req;

let yj_login_by_token_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.token = this.token;
        content.channel = this.channel;
        content.ip = this.ip;
        content.version = this.version;

        return content;
    },
    setToken(token){
        this.token = token;
    },
    setChannel(channel){
        this.channel = channel;
    },
    setIp(ip){
        this.ip = ip;
    },
    setVersion(version){
        this.version = version;
    },

});

module.exports.yj_login_by_token_req = yj_login_by_token_req;

let wx_mini_program_login_by_code_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.code = this.code;
        content.channel = this.channel;
        content.ip = this.ip;
        content.nickname = this.nickname;
        content.headurl = this.headurl;
        content.sex = this.sex;
        content.city = this.city;

        return content;
    },
    setCode(code){
        this.code = code;
    },
    setChannel(channel){
        this.channel = channel;
    },
    setIp(ip){
        this.ip = ip;
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

});

module.exports.wx_mini_program_login_by_code_req = wx_mini_program_login_by_code_req;

let login_by_user_id_req = cc.Class({
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

module.exports.login_by_user_id_req = login_by_user_id_req;

let hw_login_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.playerid = this.playerid;
        content.playerlevel = this.playerlevel;
        content.ip = this.ip;
        content.playername = this.playername;
        content.playerhead = this.playerhead;
        content.timestamp = this.timestamp;
        content.chan = this.chan;
        content.playerssign = this.playerssign;

        return content;
    },
    setPlayerid(playerid){
        this.playerid = playerid;
    },
    setPlayerlevel(playerlevel){
        this.playerlevel = playerlevel;
    },
    setIp(ip){
        this.ip = ip;
    },
    setPlayername(playername){
        this.playername = playername;
    },
    setPlayerhead(playerhead){
        this.playerhead = playerhead;
    },
    setTimestamp(timestamp){
        this.timestamp = timestamp;
    },
    setChan(chan){
        this.chan = chan;
    },
    setPlayerssign(playerssign){
        this.playerssign = playerssign;
    },

});

module.exports.hw_login_req = hw_login_req;

let vivo_login_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.authtoken = this.authtoken;
        content.playername = this.playername;
        content.ip = this.ip;
        content.timestamp = this.timestamp;
        content.chan = this.chan;
        content.playerhead = this.playerhead;

        return content;
    },
    setAuthtoken(authtoken){
        this.authtoken = authtoken;
    },
    setPlayername(playername){
        this.playername = playername;
    },
    setIp(ip){
        this.ip = ip;
    },
    setTimestamp(timestamp){
        this.timestamp = timestamp;
    },
    setChan(chan){
        this.chan = chan;
    },
    setPlayerhead(playerhead){
        this.playerhead = playerhead;
    },

});

module.exports.vivo_login_req = vivo_login_req;

let oppo_login_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.token = this.token;
        content.ssoid = this.ssoid;
        content.ip = this.ip;
        content.timestamp = this.timestamp;
        content.chan = this.chan;

        return content;
    },
    setToken(token){
        this.token = token;
    },
    setSsoid(ssoid){
        this.ssoid = ssoid;
    },
    setIp(ip){
        this.ip = ip;
    },
    setTimestamp(timestamp){
        this.timestamp = timestamp;
    },
    setChan(chan){
        this.chan = chan;
    },

});

module.exports.oppo_login_req = oppo_login_req;

let mi_login_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.sessionId = this.sessionId;
        content.uid = this.uid;
        content.ip = this.ip;
        content.timestamp = this.timestamp;
        content.chan = this.chan;
        content.playername = this.playername;

        return content;
    },
    setSessionId(sessionId){
        this.sessionId = sessionId;
    },
    setUid(uid){
        this.uid = uid;
    },
    setIp(ip){
        this.ip = ip;
    },
    setTimestamp(timestamp){
        this.timestamp = timestamp;
    },
    setChan(chan){
        this.chan = chan;
    },
    setPlayername(playername){
        this.playername = playername;
    },

});

module.exports.mi_login_req = mi_login_req;

