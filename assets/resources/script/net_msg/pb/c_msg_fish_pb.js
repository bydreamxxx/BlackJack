let fish_user_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.seatId = this.seatId;
        content.name = this.name;
        content.openId = this.openId;
        content.headUrl = this.headUrl;
        content.coin = this.coin;
        content.bet = this.bet;
        content.buffId = this.buffId;
        content.buffTime = this.buffTime;
        content.bulletId = this.bulletId;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setSeatId(seatId){
        this.seatId = seatId;
    },
    setName(name){
        this.name = name;
    },
    setOpenId(openId){
        this.openId = openId;
    },
    setHeadUrl(headUrl){
        this.headUrl = headUrl;
    },
    setCoin(coin){
        this.coin = coin;
    },
    setBet(bet){
        this.bet = bet;
    },
    setBuffId(buffId){
        this.buffId = buffId;
    },
    setBuffTime(buffTime){
        this.buffTime = buffTime;
    },
    setBulletId(bulletId){
        this.bulletId = bulletId;
    },

});

module.exports.fish_user_info = fish_user_info;

let msg_fish_room_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.usersList = this.usersList;

        return content;
    },
    setUsersList(usersList){
        this.usersList = usersList;
    },

});

module.exports.msg_fish_room_info = msg_fish_room_info;

let msg_fish_set_bet_req = cc.Class({
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

module.exports.msg_fish_set_bet_req = msg_fish_set_bet_req;

let msg_fish_set_bet_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.userId = this.userId;
        content.bet = this.bet;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setBet(bet){
        this.bet = bet;
    },

});

module.exports.msg_fish_set_bet_ret = msg_fish_set_bet_ret;

let msg_fish_bet_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.bulletId = this.bulletId;
        content.dir = this.dir;
        content.type = this.type;

        return content;
    },
    setBulletId(bulletId){
        this.bulletId = bulletId;
    },
    setDir(dir){
        this.dir = dir;
    },
    setType(type){
        this.type = type;
    },

});

module.exports.msg_fish_bet_req = msg_fish_bet_req;

let msg_fish_bet_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.userId = this.userId;
        content.bulletId = this.bulletId;
        content.dir = this.dir;
        content.type = this.type;
        content.coin = this.coin;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setBulletId(bulletId){
        this.bulletId = bulletId;
    },
    setDir(dir){
        this.dir = dir;
    },
    setType(type){
        this.type = type;
    },
    setCoin(coin){
        this.coin = coin;
    },

});

module.exports.msg_fish_bet_ret = msg_fish_bet_ret;

let fish_hit_req_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.fishId = this.fishId;
        content.pos = this.pos;
        content.relationList = this.relationList;

        return content;
    },
    setFishId(fishId){
        this.fishId = fishId;
    },
    setPos(pos){
        this.pos = pos;
    },
    setRelationList(relationList){
        this.relationList = relationList;
    },

});

module.exports.fish_hit_req_info = fish_hit_req_info;

let msg_fish_hit_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.bulletId = this.bulletId;
        content.buffId = this.buffId;
        content.fishsList = this.fishsList;
        content.userId = this.userId;

        return content;
    },
    setBulletId(bulletId){
        this.bulletId = bulletId;
    },
    setBuffId(buffId){
        this.buffId = buffId;
    },
    setFishsList(fishsList){
        this.fishsList = fishsList;
    },
    setUserId(userId){
        this.userId = userId;
    },

});

module.exports.msg_fish_hit_req = msg_fish_hit_req;

let fish_hit_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.fishId = this.fishId;
        content.hit = this.hit;
        content.win = this.win;
        content.bet = this.bet;
        content.buffId = this.buffId;
        content.pos = this.pos;

        return content;
    },
    setFishId(fishId){
        this.fishId = fishId;
    },
    setHit(hit){
        this.hit = hit;
    },
    setWin(win){
        this.win = win;
    },
    setBet(bet){
        this.bet = bet;
    },
    setBuffId(buffId){
        this.buffId = buffId;
    },
    setPos(pos){
        this.pos = pos;
    },

});

module.exports.fish_hit_info = fish_hit_info;

let msg_fish_hit_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.bulletId = this.bulletId;
        content.buffId = this.buffId;
        content.fishsList = this.fishsList;
        content.buffEndTime = this.buffEndTime;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setBulletId(bulletId){
        this.bulletId = bulletId;
    },
    setBuffId(buffId){
        this.buffId = buffId;
    },
    setFishsList(fishsList){
        this.fishsList = fishsList;
    },
    setBuffEndTime(buffEndTime){
        this.buffEndTime = buffEndTime;
    },

});

module.exports.msg_fish_hit_ret = msg_fish_hit_ret;

let msg_fish_appear = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.pathId = this.pathId;
        content.fishDataId = this.fishDataId;
        content.form = this.form;
        content.fishIdsList = this.fishIdsList;

        return content;
    },
    setPathId(pathId){
        this.pathId = pathId;
    },
    setFishDataId(fishDataId){
        this.fishDataId = fishDataId;
    },
    setForm(form){
        this.form = form;
    },
    setFishIdsList(fishIdsList){
        this.fishIdsList = fishIdsList;
    },

});

module.exports.msg_fish_appear = msg_fish_appear;

let msg_fish_clean = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_fish_clean = msg_fish_clean;

let msg_fish_array = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.fishIdsList = this.fishIdsList;
        content.pos = this.pos;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setFishIdsList(fishIdsList){
        this.fishIdsList = fishIdsList;
    },
    setPos(pos){
        this.pos = pos;
    },

});

module.exports.msg_fish_array = msg_fish_array;

let msg_fish_coin_return = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.coin = this.coin;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setCoin(coin){
        this.coin = coin;
    },

});

module.exports.msg_fish_coin_return = msg_fish_coin_return;

let msg_fish_room_quit_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_fish_room_quit_req = msg_fish_room_quit_req;

