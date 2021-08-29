let msg_mouse_room_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.power = this.power;
        content.anger = this.anger;
        content.coin = this.coin;
        content.mouseList = this.mouseList;
        content.time = this.time;

        return content;
    },
    setPower(power){
        this.power = power;
    },
    setAnger(anger){
        this.anger = anger;
    },
    setCoin(coin){
        this.coin = coin;
    },
    setMouseList(mouseList){
        this.mouseList = mouseList;
    },
    setTime(time){
        this.time = time;
    },

});

module.exports.msg_mouse_room_info = msg_mouse_room_info;

let mouse_hole_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.holeId = this.holeId;
        content.mouseId = this.mouseId;
        content.mouseTime = this.mouseTime;

        return content;
    },
    setHoleId(holeId){
        this.holeId = holeId;
    },
    setMouseId(mouseId){
        this.mouseId = mouseId;
    },
    setMouseTime(mouseTime){
        this.mouseTime = mouseTime;
    },

});

module.exports.mouse_hole_info = mouse_hole_info;

let msg_mouse_show = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.mouseList = this.mouseList;

        return content;
    },
    setMouseList(mouseList){
        this.mouseList = mouseList;
    },

});

module.exports.msg_mouse_show = msg_mouse_show;

let msg_use_hammer_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.hammerId = this.hammerId;
        content.holeId = this.holeId;

        return content;
    },
    setHammerId(hammerId){
        this.hammerId = hammerId;
    },
    setHoleId(holeId){
        this.holeId = holeId;
    },

});

module.exports.msg_use_hammer_req = msg_use_hammer_req;

let mouse_hammer = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.mouseId = this.mouseId;
        content.holeId = this.holeId;
        content.isHit = this.isHit;
        content.coin = this.coin;
        content.times = this.times;
        content.oddsList = this.oddsList;
        content.pokersList = this.pokersList;

        return content;
    },
    setMouseId(mouseId){
        this.mouseId = mouseId;
    },
    setHoleId(holeId){
        this.holeId = holeId;
    },
    setIsHit(isHit){
        this.isHit = isHit;
    },
    setCoin(coin){
        this.coin = coin;
    },
    setTimes(times){
        this.times = times;
    },
    setOddsList(oddsList){
        this.oddsList = oddsList;
    },
    setPokersList(pokersList){
        this.pokersList = pokersList;
    },

});

module.exports.mouse_hammer = mouse_hammer;

let msg_use_hammer_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.power = this.power;
        content.coin = this.coin;
        content.anger = this.anger;
        content.drum = this.drum;
        content.holeId = this.holeId;
        content.resultList = this.resultList;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setPower(power){
        this.power = power;
    },
    setCoin(coin){
        this.coin = coin;
    },
    setAnger(anger){
        this.anger = anger;
    },
    setDrum(drum){
        this.drum = drum;
    },
    setHoleId(holeId){
        this.holeId = holeId;
    },
    setResultList(resultList){
        this.resultList = resultList;
    },

});

module.exports.msg_use_hammer_ret = msg_use_hammer_ret;

let msg_choose_redbag_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.index = this.index;

        return content;
    },
    setIndex(index){
        this.index = index;
    },

});

module.exports.msg_choose_redbag_req = msg_choose_redbag_req;

let msg_choose_redbag_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.odds = this.odds;
        content.coin = this.coin;
        content.time = this.time;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setOdds(odds){
        this.odds = odds;
    },
    setCoin(coin){
        this.coin = coin;
    },
    setTime(time){
        this.time = time;
    },

});

module.exports.msg_choose_redbag_ret = msg_choose_redbag_ret;

let msg_mouse_record_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.index = this.index;

        return content;
    },
    setIndex(index){
        this.index = index;
    },

});

module.exports.msg_mouse_record_req = msg_mouse_record_req;

let mouse_record = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.coin = this.coin;
        content.time = this.time;

        return content;
    },
    setCoin(coin){
        this.coin = coin;
    },
    setTime(time){
        this.time = time;
    },

});

module.exports.mouse_record = mouse_record;

let msg_mouse_record_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.index = this.index;
        content.reList = this.reList;

        return content;
    },
    setIndex(index){
        this.index = index;
    },
    setReList(reList){
        this.reList = reList;
    },

});

module.exports.msg_mouse_record_ret = msg_mouse_record_ret;

let msg_mouse_task_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.op = this.op;
        content.id = this.id;

        return content;
    },
    setOp(op){
        this.op = op;
    },
    setId(id){
        this.id = id;
    },

});

module.exports.msg_mouse_task_req = msg_mouse_task_req;

let mouse_task = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.num = this.num;
        content.state = this.state;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setNum(num){
        this.num = num;
    },
    setState(state){
        this.state = state;
    },

});

module.exports.mouse_task = mouse_task;

let msg_mouse_task_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.op = this.op;
        content.taskList = this.taskList;
        content.coin = this.coin;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setOp(op){
        this.op = op;
    },
    setTaskList(taskList){
        this.taskList = taskList;
    },
    setCoin(coin){
        this.coin = coin;
    },

});

module.exports.msg_mouse_task_ret = msg_mouse_task_ret;

let msg_mouse_power = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.power = this.power;

        return content;
    },
    setPower(power){
        this.power = power;
    },

});

module.exports.msg_mouse_power = msg_mouse_power;

