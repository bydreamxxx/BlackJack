let qka_fish_master_user_info = cc.Class({
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
        content.betDataid = this.betDataid;
        content.buffId = this.buffId;
        content.buffTime = this.buffTime;
        content.bulletId = this.bulletId;
        content.effectType = this.effectType;
        content.effectRemainTime = this.effectRemainTime;
        content.fishGiftLevel = this.fishGiftLevel;

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
    setBetDataid(betDataid){
        this.betDataid = betDataid;
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
    setEffectType(effectType){
        this.effectType = effectType;
    },
    setEffectRemainTime(effectRemainTime){
        this.effectRemainTime = effectRemainTime;
    },
    setFishGiftLevel(fishGiftLevel){
        this.fishGiftLevel = fishGiftLevel;
    },

});

module.exports.qka_fish_master_user_info = qka_fish_master_user_info;

let msg_qka_fish_master_room_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.usersList = this.usersList;
        content.commonFishListList = this.commonFishListList;
        content.arrayFishListList = this.arrayFishListList;
        content.roomType = this.roomType;

        return content;
    },
    setUsersList(usersList){
        this.usersList = usersList;
    },
    setCommonFishListList(commonFishListList){
        this.commonFishListList = commonFishListList;
    },
    setArrayFishListList(arrayFishListList){
        this.arrayFishListList = arrayFishListList;
    },
    setRoomType(roomType){
        this.roomType = roomType;
    },

});

module.exports.msg_qka_fish_master_room_info = msg_qka_fish_master_room_info;

let msg_qka_fish_master_set_bet_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.betDataid = this.betDataid;

        return content;
    },
    setBetDataid(betDataid){
        this.betDataid = betDataid;
    },

});

module.exports.msg_qka_fish_master_set_bet_req = msg_qka_fish_master_set_bet_req;

let msg_qka_fish_master_set_bet_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.userId = this.userId;
        content.betDataid = this.betDataid;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setBetDataid(betDataid){
        this.betDataid = betDataid;
    },

});

module.exports.msg_qka_fish_master_set_bet_ret = msg_qka_fish_master_set_bet_ret;

let msg_qka_fish_master_bet_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.bulletId = this.bulletId;
        content.dir = this.dir;
        content.type = this.type;
        content.isSubBullet = this.isSubBullet;

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
    setIsSubBullet(isSubBullet){
        this.isSubBullet = isSubBullet;
    },

});

module.exports.msg_qka_fish_master_bet_req = msg_qka_fish_master_bet_req;

let msg_qka_fish_master_bet_ret = cc.Class({
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
        content.isSubBullet = this.isSubBullet;

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
    setIsSubBullet(isSubBullet){
        this.isSubBullet = isSubBullet;
    },

});

module.exports.msg_qka_fish_master_bet_ret = msg_qka_fish_master_bet_ret;

let qka_fish_master_hit_req_info = cc.Class({
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

module.exports.qka_fish_master_hit_req_info = qka_fish_master_hit_req_info;

let msg_qka_fish_master_hit_req = cc.Class({
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

module.exports.msg_qka_fish_master_hit_req = msg_qka_fish_master_hit_req;

let qka_fish_master_hit_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.fishId = this.fishId;
        content.hit = this.hit;
        content.win = this.win;
        content.betTimes = this.betTimes;
        content.fishTimes = this.fishTimes;
        content.buffId = this.buffId;
        content.pos = this.pos;
        content.itemDataId = this.itemDataId;

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
    setBetTimes(betTimes){
        this.betTimes = betTimes;
    },
    setFishTimes(fishTimes){
        this.fishTimes = fishTimes;
    },
    setBuffId(buffId){
        this.buffId = buffId;
    },
    setPos(pos){
        this.pos = pos;
    },
    setItemDataId(itemDataId){
        this.itemDataId = itemDataId;
    },

});

module.exports.qka_fish_master_hit_info = qka_fish_master_hit_info;

let msg_qka_fish_master_hit_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.bulletId = this.bulletId;
        content.buffId = this.buffId;
        content.coin = this.coin;
        content.buffEndTime = this.buffEndTime;
        content.fishsList = this.fishsList;

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
    setCoin(coin){
        this.coin = coin;
    },
    setBuffEndTime(buffEndTime){
        this.buffEndTime = buffEndTime;
    },
    setFishsList(fishsList){
        this.fishsList = fishsList;
    },

});

module.exports.msg_qka_fish_master_hit_ret = msg_qka_fish_master_hit_ret;

let msg_qka_fish_master_appear = cc.Class({
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

module.exports.msg_qka_fish_master_appear = msg_qka_fish_master_appear;

let msg_qka_fish_master_clean = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_qka_fish_master_clean = msg_qka_fish_master_clean;

let msg_qka_fish_master_array = cc.Class({
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

module.exports.msg_qka_fish_master_array = msg_qka_fish_master_array;

let msg_qka_fish_master_coin_return = cc.Class({
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

module.exports.msg_qka_fish_master_coin_return = msg_qka_fish_master_coin_return;

let msg_qka_fish_master_room_quit_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_qka_fish_master_room_quit_req = msg_qka_fish_master_room_quit_req;

let msg_qka_fish_use_item_req = cc.Class({
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

module.exports.msg_qka_fish_use_item_req = msg_qka_fish_use_item_req;

let msg_qka_fish_use_item_ret = cc.Class({
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

module.exports.msg_qka_fish_use_item_ret = msg_qka_fish_use_item_ret;

let msg_qka_fish_effect = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.remainTime = this.remainTime;
        content.type = this.type;

        return content;
    },
    setRemainTime(remainTime){
        this.remainTime = remainTime;
    },
    setType(type){
        this.type = type;
    },

});

module.exports.msg_qka_fish_effect = msg_qka_fish_effect;

let msg_qka_buy_item_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.itemDataId = this.itemDataId;

        return content;
    },
    setItemDataId(itemDataId){
        this.itemDataId = itemDataId;
    },

});

module.exports.msg_qka_buy_item_req = msg_qka_buy_item_req;

let msg_qka_buy_item_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.itemDataId = this.itemDataId;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setItemDataId(itemDataId){
        this.itemDataId = itemDataId;
    },

});

module.exports.msg_qka_buy_item_ret = msg_qka_buy_item_ret;

let msg_qka_sync_coin = cc.Class({
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

module.exports.msg_qka_sync_coin = msg_qka_sync_coin;

let msg_qka_fish_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.fishid = this.fishid;
        content.dValue = this.dValue;

        return content;
    },
    setFishid(fishid){
        this.fishid = fishid;
    },
    setDValue(dValue){
        this.dValue = dValue;
    },

});

module.exports.msg_qka_fish_info = msg_qka_fish_info;

