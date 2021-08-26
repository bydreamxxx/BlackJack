let activity_collect_word = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.wordIndex = this.wordIndex;
        content.num = this.num;

        return content;
    },
    setWordIndex(wordIndex){
        this.wordIndex = wordIndex;
    },
    setNum(num){
        this.num = num;
    },

});

module.exports.activity_collect_word = activity_collect_word;

let activity_collect_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.activityWordsList = this.activityWordsList;
        content.row = this.row;
        content.col = this.col;
        content.collectedRewardList = this.collectedRewardList;
        content.leftCollectTimes = this.leftCollectTimes;
        content.canOpenBoxPosList = this.canOpenBoxPosList;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setActivityWordsList(activityWordsList){
        this.activityWordsList = activityWordsList;
    },
    setRow(row){
        this.row = row;
    },
    setCol(col){
        this.col = col;
    },
    setCollectedRewardList(collectedRewardList){
        this.collectedRewardList = collectedRewardList;
    },
    setLeftCollectTimes(leftCollectTimes){
        this.leftCollectTimes = leftCollectTimes;
    },
    setCanOpenBoxPosList(canOpenBoxPosList){
        this.canOpenBoxPosList = canOpenBoxPosList;
    },

});

module.exports.activity_collect_info = activity_collect_info;

let is_open_activity_collect = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.isOpen = this.isOpen;

        return content;
    },
    setIsOpen(isOpen){
        this.isOpen = isOpen;
    },

});

module.exports.is_open_activity_collect = is_open_activity_collect;

let get_activity_collect_list_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.get_activity_collect_list_req = get_activity_collect_list_req;

let get_activity_collect_list_ack = cc.Class({
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

module.exports.get_activity_collect_list_ack = get_activity_collect_list_ack;

let activity_collect_add_draw_times = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.times = this.times;

        return content;
    },
    setTimes(times){
        this.times = times;
    },

});

module.exports.activity_collect_add_draw_times = activity_collect_add_draw_times;

let activity_collect_draw_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.activityId = this.activityId;

        return content;
    },
    setActivityId(activityId){
        this.activityId = activityId;
    },

});

module.exports.activity_collect_draw_req = activity_collect_draw_req;

let activity_collect_draw_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.activityId = this.activityId;
        content.word = this.word;
        content.leftCollectTimes = this.leftCollectTimes;
        content.canOpenBoxPosListList = this.canOpenBoxPosListList;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setActivityId(activityId){
        this.activityId = activityId;
    },
    setWord(word){
        this.word = word;
    },
    setLeftCollectTimes(leftCollectTimes){
        this.leftCollectTimes = leftCollectTimes;
    },
    setCanOpenBoxPosListList(canOpenBoxPosListList){
        this.canOpenBoxPosListList = canOpenBoxPosListList;
    },

});

module.exports.activity_collect_draw_ack = activity_collect_draw_ack;

let activity_collect_open_box_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.activityId = this.activityId;
        content.pos = this.pos;

        return content;
    },
    setActivityId(activityId){
        this.activityId = activityId;
    },
    setPos(pos){
        this.pos = pos;
    },

});

module.exports.activity_collect_open_box_req = activity_collect_open_box_req;

let activity_collect_open_box_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.activityId = this.activityId;
        content.pos = this.pos;
        content.rewardList = this.rewardList;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setActivityId(activityId){
        this.activityId = activityId;
    },
    setPos(pos){
        this.pos = pos;
    },
    setRewardList(rewardList){
        this.rewardList = rewardList;
    },

});

module.exports.activity_collect_open_box_ack = activity_collect_open_box_ack;

