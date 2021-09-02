let hb_role = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.money = this.money;
        content.head = this.head;
        content.name = this.name;
        content.openMoney = this.openMoney;
        content.result = this.result;
        content.state = this.state;
        content.ready = this.ready;
        content.maiTimes = this.maiTimes;
        content.zhongTimes = this.zhongTimes;
        content.getTimes = this.getTimes;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setMoney(money){
        this.money = money;
    },
    setHead(head){
        this.head = head;
    },
    setName(name){
        this.name = name;
    },
    setOpenMoney(openMoney){
        this.openMoney = openMoney;
    },
    setResult(result){
        this.result = result;
    },
    setState(state){
        this.state = state;
    },
    setReady(ready){
        this.ready = ready;
    },
    setMaiTimes(maiTimes){
        this.maiTimes = maiTimes;
    },
    setZhongTimes(zhongTimes){
        this.zhongTimes = zhongTimes;
    },
    setGetTimes(getTimes){
        this.getTimes = getTimes;
    },

});

module.exports.hb_role = hb_role;

let mai_role = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.role = this.role;
        content.money = this.money;
        content.num = this.num;
        content.rate = this.rate;
        content.id = this.id;

        return content;
    },
    setRole(role){
        this.role = role;
    },
    setMoney(money){
        this.money = money;
    },
    setNum(num){
        this.num = num;
    },
    setRate(rate){
        this.rate = rate;
    },
    setId(id){
        this.id = id;
    },

});

module.exports.mai_role = mai_role;

let hb_open = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.money = this.money;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setMoney(money){
        this.money = money;
    },

});

module.exports.hb_open = hb_open;

let hb_desk = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.nextTime = this.nextTime;
        content.zhuang = this.zhuang;
        content.playersList = this.playersList;
        content.self = this.self;
        content.rule = this.rule;
        content.round = this.round;
        content.dissolveTimeout = this.dissolveTimeout;
        content.dissolveInfoList = this.dissolveInfoList;
        content.state = this.state;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setNextTime(nextTime){
        this.nextTime = nextTime;
    },
    setZhuang(zhuang){
        this.zhuang = zhuang;
    },
    setPlayersList(playersList){
        this.playersList = playersList;
    },
    setSelf(self){
        this.self = self;
    },
    setRule(rule){
        this.rule = rule;
    },
    setRound(round){
        this.round = round;
    },
    setDissolveTimeout(dissolveTimeout){
        this.dissolveTimeout = dissolveTimeout;
    },
    setDissolveInfoList(dissolveInfoList){
        this.dissolveInfoList = dissolveInfoList;
    },
    setState(state){
        this.state = state;
    },

});

module.exports.hb_desk = hb_desk;

let msg_hb_get_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_hb_get_req = msg_hb_get_req;

let msg_hb_get_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.code = this.code;
        content.money = this.money;

        return content;
    },
    setCode(code){
        this.code = code;
    },
    setMoney(money){
        this.money = money;
    },

});

module.exports.msg_hb_get_ack = msg_hb_get_ack;

let msg_hb_list_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_hb_list_req = msg_hb_list_req;

let msg_hb_list_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.playersList = this.playersList;

        return content;
    },
    setPlayersList(playersList){
        this.playersList = playersList;
    },

});

module.exports.msg_hb_list_ack = msg_hb_list_ack;

let msg_hb_set_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.money = this.money;
        content.rate = this.rate;
        content.num = this.num;

        return content;
    },
    setMoney(money){
        this.money = money;
    },
    setRate(rate){
        this.rate = rate;
    },
    setNum(num){
        this.num = num;
    },

});

module.exports.msg_hb_set_req = msg_hb_set_req;

let msg_hb_set_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.code = this.code;
        content.money = this.money;

        return content;
    },
    setCode(code){
        this.code = code;
    },
    setMoney(money){
        this.money = money;
    },

});

module.exports.msg_hb_set_ack = msg_hb_set_ack;

let msg_hb_get_notify = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.role = this.role;

        return content;
    },
    setRole(role){
        this.role = role;
    },

});

module.exports.msg_hb_get_notify = msg_hb_get_notify;

let msg_hb_open_notify = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.playersList = this.playersList;
        content.zhaung = this.zhaung;

        return content;
    },
    setPlayersList(playersList){
        this.playersList = playersList;
    },
    setZhaung(zhaung){
        this.zhaung = zhaung;
    },

});

module.exports.msg_hb_open_notify = msg_hb_open_notify;

let HbPlayerFinalResult = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.score = this.score;
        content.maiTimes = this.maiTimes;
        content.getTimes = this.getTimes;
        content.zhongTimes = this.zhongTimes;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setScore(score){
        this.score = score;
    },
    setMaiTimes(maiTimes){
        this.maiTimes = maiTimes;
    },
    setGetTimes(getTimes){
        this.getTimes = getTimes;
    },
    setZhongTimes(zhongTimes){
        this.zhongTimes = zhongTimes;
    },

});

module.exports.HbPlayerFinalResult = HbPlayerFinalResult;

let HbFinalResult = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.listList = this.listList;

        return content;
    },
    setListList(listList){
        this.listList = listList;
    },

});

module.exports.HbFinalResult = HbFinalResult;

let msg_hb_enter_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_hb_enter_req = msg_hb_enter_req;

let msg_hb_enter_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;

        return content;
    },
    setId(id){
        this.id = id;
    },

});

module.exports.msg_hb_enter_ack = msg_hb_enter_ack;

let msg_hb_cancel_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;

        return content;
    },
    setId(id){
        this.id = id;
    },

});

module.exports.msg_hb_cancel_req = msg_hb_cancel_req;

let msg_hb_cancel_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.code = this.code;
        content.id = this.id;

        return content;
    },
    setCode(code){
        this.code = code;
    },
    setId(id){
        this.id = id;
    },

});

module.exports.msg_hb_cancel_ack = msg_hb_cancel_ack;

