let msg_rank_get_rank_list_2s = cc.Class({
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

module.exports.msg_rank_get_rank_list_2s = msg_rank_get_rank_list_2s;

let nested_rank_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.rank = this.rank;
        content.playerId = this.playerId;
        content.playerName = this.playerName;
        content.openid = this.openid;
        content.headurl = this.headurl;
        content.sex = this.sex;
        content.value = this.value;
        content.isRobot = this.isRobot;
        content.rewardId = this.rewardId;
        content.rewardNum = this.rewardNum;

        return content;
    },
    setRank(rank){
        this.rank = rank;
    },
    setPlayerId(playerId){
        this.playerId = playerId;
    },
    setPlayerName(playerName){
        this.playerName = playerName;
    },
    setOpenid(openid){
        this.openid = openid;
    },
    setHeadurl(headurl){
        this.headurl = headurl;
    },
    setSex(sex){
        this.sex = sex;
    },
    setValue(value){
        this.value = value;
    },
    setIsRobot(isRobot){
        this.isRobot = isRobot;
    },
    setRewardId(rewardId){
        this.rewardId = rewardId;
    },
    setRewardNum(rewardNum){
        this.rewardNum = rewardNum;
    },

});

module.exports.nested_rank_info = nested_rank_info;

let msg_rank_get_rank_list_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.type = this.type;
        content.ranksList = this.ranksList;
        content.myRank = this.myRank;

        return content;
    },
    setType(type){
        this.type = type;
    },
    setRanksList(ranksList){
        this.ranksList = ranksList;
    },
    setMyRank(myRank){
        this.myRank = myRank;
    },

});

module.exports.msg_rank_get_rank_list_2c = msg_rank_get_rank_list_2c;

let msg_share_friend_2s = cc.Class({
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

module.exports.msg_share_friend_2s = msg_share_friend_2s;

let msg_vip_open = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_vip_open = msg_vip_open;

let vip_open = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.vipLevel = this.vipLevel;
        content.vipDrawIndexListList = this.vipDrawIndexListList;

        return content;
    },
    setVipLevel(vipLevel){
        this.vipLevel = vipLevel;
    },
    setVipDrawIndexListList(vipDrawIndexListList){
        this.vipDrawIndexListList = vipDrawIndexListList;
    },

});

module.exports.vip_open = vip_open;

let msg_vip_open_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.drawListList = this.drawListList;

        return content;
    },
    setDrawListList(drawListList){
        this.drawListList = drawListList;
    },

});

module.exports.msg_vip_open_2c = msg_vip_open_2c;

let msg_vip_draw = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.level = this.level;
        content.index = this.index;

        return content;
    },
    setLevel(level){
        this.level = level;
    },
    setIndex(index){
        this.index = index;
    },

});

module.exports.msg_vip_draw = msg_vip_draw;

let msg_vip_draw_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.level = this.level;
        content.index = this.index;
        content.retCode = this.retCode;

        return content;
    },
    setLevel(level){
        this.level = level;
    },
    setIndex(index){
        this.index = index;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },

});

module.exports.msg_vip_draw_2c = msg_vip_draw_2c;

let msg_vip_draw_onekey = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_vip_draw_onekey = msg_vip_draw_onekey;

let msg_vip_draw_onekey_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.rewardListList = this.rewardListList;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setRewardListList(rewardListList){
        this.rewardListList = rewardListList;
    },

});

module.exports.msg_vip_draw_onekey_2c = msg_vip_draw_onekey_2c;

let msg_update_vip_level_2s = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.curExp = this.curExp;
        content.curLevel = this.curLevel;

        return content;
    },
    setCurExp(curExp){
        this.curExp = curExp;
    },
    setCurLevel(curLevel){
        this.curLevel = curLevel;
    },

});

module.exports.msg_update_vip_level_2s = msg_update_vip_level_2s;

let msg_update_player_level_2s = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.curExp = this.curExp;
        content.curLevel = this.curLevel;

        return content;
    },
    setCurExp(curExp){
        this.curExp = curExp;
    },
    setCurLevel(curLevel){
        this.curLevel = curLevel;
    },

});

module.exports.msg_update_player_level_2s = msg_update_player_level_2s;

let msg_relief_gift_2s = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_relief_gift_2s = msg_relief_gift_2s;

let msg_relief_gift_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retcode = this.retcode;

        return content;
    },
    setRetcode(retcode){
        this.retcode = retcode;
    },

});

module.exports.msg_relief_gift_2c = msg_relief_gift_2c;

let msg_remain_relief_gift_cnt_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.remainCnt = this.remainCnt;

        return content;
    },
    setRemainCnt(remainCnt){
        this.remainCnt = remainCnt;
    },

});

module.exports.msg_remain_relief_gift_cnt_2c = msg_remain_relief_gift_cnt_2c;

let nested_task_progress = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.targetCnt = this.targetCnt;
        content.curCnt = this.curCnt;

        return content;
    },
    setTargetCnt(targetCnt){
        this.targetCnt = targetCnt;
    },
    setCurCnt(curCnt){
        this.curCnt = curCnt;
    },

});

module.exports.nested_task_progress = nested_task_progress;

let nested_accept_task = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.taskId = this.taskId;
        content.flag = this.flag;
        content.progressList = this.progressList;
        content.expireTime = this.expireTime;

        return content;
    },
    setTaskId(taskId){
        this.taskId = taskId;
    },
    setFlag(flag){
        this.flag = flag;
    },
    setProgressList(progressList){
        this.progressList = progressList;
    },
    setExpireTime(expireTime){
        this.expireTime = expireTime;
    },

});

module.exports.nested_accept_task = nested_accept_task;

let msg_accept_task_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.taskList = this.taskList;
        content.taskLevel = this.taskLevel;

        return content;
    },
    setTaskList(taskList){
        this.taskList = taskList;
    },
    setTaskLevel(taskLevel){
        this.taskLevel = taskLevel;
    },

});

module.exports.msg_accept_task_2c = msg_accept_task_2c;

let msg_submit_task_2s = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.taskId = this.taskId;

        return content;
    },
    setTaskId(taskId){
        this.taskId = taskId;
    },

});

module.exports.msg_submit_task_2s = msg_submit_task_2s;

let msg_submit_task_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.taskId = this.taskId;
        content.retCode = this.retCode;

        return content;
    },
    setTaskId(taskId){
        this.taskId = taskId;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },

});

module.exports.msg_submit_task_2c = msg_submit_task_2c;

let msg_task_progress_change_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.taskId = this.taskId;
        content.progressList = this.progressList;
        content.expireTime = this.expireTime;

        return content;
    },
    setTaskId(taskId){
        this.taskId = taskId;
    },
    setProgressList(progressList){
        this.progressList = progressList;
    },
    setExpireTime(expireTime){
        this.expireTime = expireTime;
    },

});

module.exports.msg_task_progress_change_2c = msg_task_progress_change_2c;

let msg_trigger_level_task_2s = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.level = this.level;

        return content;
    },
    setLevel(level){
        this.level = level;
    },

});

module.exports.msg_trigger_level_task_2s = msg_trigger_level_task_2s;

let msg_trigger_level_task_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.level = this.level;
        content.taskList = this.taskList;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setLevel(level){
        this.level = level;
    },
    setTaskList(taskList){
        this.taskList = taskList;
    },

});

module.exports.msg_trigger_level_task_2c = msg_trigger_level_task_2c;

let msg_update_money_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.moneyType = this.moneyType;
        content.changeValue = this.changeValue;
        content.newValue = this.newValue;
        content.changeType = this.changeType;

        return content;
    },
    setMoneyType(moneyType){
        this.moneyType = moneyType;
    },
    setChangeValue(changeValue){
        this.changeValue = changeValue;
    },
    setNewValue(newValue){
        this.newValue = newValue;
    },
    setChangeType(changeType){
        this.changeType = changeType;
    },

});

module.exports.msg_update_money_2c = msg_update_money_2c;

let nested_item_base = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.itemid = this.itemid;
        content.itemDataId = this.itemDataId;
        content.cnt = this.cnt;
        content.validtime = this.validtime;

        return content;
    },
    setItemid(itemid){
        this.itemid = itemid;
    },
    setItemDataId(itemDataId){
        this.itemDataId = itemDataId;
    },
    setCnt(cnt){
        this.cnt = cnt;
    },
    setValidtime(validtime){
        this.validtime = validtime;
    },

});

module.exports.nested_item_base = nested_item_base;

let msg_add_new_item_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.item = this.item;

        return content;
    },
    setItem(item){
        this.item = item;
    },

});

module.exports.msg_add_new_item_2c = msg_add_new_item_2c;

let msg_update_item_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.itemid = this.itemid;
        content.cnt = this.cnt;
        content.expire = this.expire;

        return content;
    },
    setItemid(itemid){
        this.itemid = itemid;
    },
    setCnt(cnt){
        this.cnt = cnt;
    },
    setExpire(expire){
        this.expire = expire;
    },

});

module.exports.msg_update_item_2c = msg_update_item_2c;

let msg_online_item_list_2c = cc.Class({
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

module.exports.msg_online_item_list_2c = msg_online_item_list_2c;

let msg_luck_draw_2s = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.mainType = this.mainType;
        content.subType = this.subType;

        return content;
    },
    setMainType(mainType){
        this.mainType = mainType;
    },
    setSubType(subType){
        this.subType = subType;
    },

});

module.exports.msg_luck_draw_2s = msg_luck_draw_2s;

let msg_luck_draw_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.mainType = this.mainType;
        content.subType = this.subType;
        content.retcode = this.retcode;
        content.id = this.id;
        content.cnt = this.cnt;

        return content;
    },
    setMainType(mainType){
        this.mainType = mainType;
    },
    setSubType(subType){
        this.subType = subType;
    },
    setRetcode(retcode){
        this.retcode = retcode;
    },
    setId(id){
        this.id = id;
    },
    setCnt(cnt){
        this.cnt = cnt;
    },

});

module.exports.msg_luck_draw_2c = msg_luck_draw_2c;

let nested_luck_draw = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.playerid = this.playerid;
        content.playername = this.playername;
        content.time = this.time;
        content.id = this.id;
        content.openid = this.openid;
        content.headurl = this.headurl;

        return content;
    },
    setPlayerid(playerid){
        this.playerid = playerid;
    },
    setPlayername(playername){
        this.playername = playername;
    },
    setTime(time){
        this.time = time;
    },
    setId(id){
        this.id = id;
    },
    setOpenid(openid){
        this.openid = openid;
    },
    setHeadurl(headurl){
        this.headurl = headurl;
    },

});

module.exports.nested_luck_draw = nested_luck_draw;

let msg_online_luck_draw_2c = cc.Class({
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

module.exports.msg_online_luck_draw_2c = msg_online_luck_draw_2c;

let msg_online_luck_draw_cnt_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.cnt = this.cnt;

        return content;
    },
    setCnt(cnt){
        this.cnt = cnt;
    },

});

module.exports.msg_online_luck_draw_cnt_2c = msg_online_luck_draw_cnt_2c;

let msg_add_new_luck_draw_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.st = this.st;

        return content;
    },
    setSt(st){
        this.st = st;
    },

});

module.exports.msg_add_new_luck_draw_2c = msg_add_new_luck_draw_2c;

let config_shop_item = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.costItemid = this.costItemid;
        content.costItemCount = this.costItemCount;
        content.itemid = this.itemid;
        content.itemCount = this.itemCount;
        content.vipLevel = this.vipLevel;
        content.type = this.type;
        content.isGiftsbag = this.isGiftsbag;
        content.costDiscount = this.costDiscount;
        content.getDiscount = this.getDiscount;
        content.vipAdd = this.vipAdd;
        content.subType = this.subType;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setCostItemid(costItemid){
        this.costItemid = costItemid;
    },
    setCostItemCount(costItemCount){
        this.costItemCount = costItemCount;
    },
    setItemid(itemid){
        this.itemid = itemid;
    },
    setItemCount(itemCount){
        this.itemCount = itemCount;
    },
    setVipLevel(vipLevel){
        this.vipLevel = vipLevel;
    },
    setType(type){
        this.type = type;
    },
    setIsGiftsbag(isGiftsbag){
        this.isGiftsbag = isGiftsbag;
    },
    setCostDiscount(costDiscount){
        this.costDiscount = costDiscount;
    },
    setGetDiscount(getDiscount){
        this.getDiscount = getDiscount;
    },
    setVipAdd(vipAdd){
        this.vipAdd = vipAdd;
    },
    setSubType(subType){
        this.subType = subType;
    },

});

module.exports.config_shop_item = config_shop_item;

let config_shop_login_notify = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.shoplistList = this.shoplistList;
        content.activityShop = this.activityShop;

        return content;
    },
    setShoplistList(shoplistList){
        this.shoplistList = shoplistList;
    },
    setActivityShop(activityShop){
        this.activityShop = activityShop;
    },

});

module.exports.config_shop_login_notify = config_shop_login_notify;

let common_itemid_count = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.itemid = this.itemid;
        content.count = this.count;

        return content;
    },
    setItemid(itemid){
        this.itemid = itemid;
    },
    setCount(count){
        this.count = count;
    },

});

module.exports.common_itemid_count = common_itemid_count;

let config_giftsbag_item = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.itemsList = this.itemsList;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setItemsList(itemsList){
        this.itemsList = itemsList;
    },

});

module.exports.config_giftsbag_item = config_giftsbag_item;

let config_giftsbag_login_notify = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.giftsbaglistList = this.giftsbaglistList;

        return content;
    },
    setGiftsbaglistList(giftsbaglistList){
        this.giftsbaglistList = giftsbaglistList;
    },

});

module.exports.config_giftsbag_login_notify = config_giftsbag_login_notify;

let msg_shop_buy_req = cc.Class({
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

module.exports.msg_shop_buy_req = msg_shop_buy_req;

let msg_shop_buy_ask = cc.Class({
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

module.exports.msg_shop_buy_ask = msg_shop_buy_ask;

let msg_shop_goods_amount_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.itemid = this.itemid;
        content.itemcount = this.itemcount;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setItemid(itemid){
        this.itemid = itemid;
    },
    setItemcount(itemcount){
        this.itemcount = itemcount;
    },

});

module.exports.msg_shop_goods_amount_req = msg_shop_goods_amount_req;

let msg_shop_goods_amount_ask = cc.Class({
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

module.exports.msg_shop_goods_amount_ask = msg_shop_goods_amount_ask;

let config_trade_shop_item = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.costItemid = this.costItemid;
        content.costItemCount = this.costItemCount;
        content.costDiscount = this.costDiscount;
        content.itemid = this.itemid;
        content.itemCount = this.itemCount;
        content.stockCount = this.stockCount;
        content.type = this.type;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setCostItemid(costItemid){
        this.costItemid = costItemid;
    },
    setCostItemCount(costItemCount){
        this.costItemCount = costItemCount;
    },
    setCostDiscount(costDiscount){
        this.costDiscount = costDiscount;
    },
    setItemid(itemid){
        this.itemid = itemid;
    },
    setItemCount(itemCount){
        this.itemCount = itemCount;
    },
    setStockCount(stockCount){
        this.stockCount = stockCount;
    },
    setType(type){
        this.type = type;
    },

});

module.exports.config_trade_shop_item = config_trade_shop_item;

let msg_trade_shop_list_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_trade_shop_list_req = msg_trade_shop_list_req;

let msg_trade_shop_list_ask = cc.Class({
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

module.exports.msg_trade_shop_list_ask = msg_trade_shop_list_ask;

let msg_trade_shop_exchange_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.name = this.name;
        content.phone = this.phone;
        content.add = this.add;
        content.opType = this.opType;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setName(name){
        this.name = name;
    },
    setPhone(phone){
        this.phone = phone;
    },
    setAdd(add){
        this.add = add;
    },
    setOpType(opType){
        this.opType = opType;
    },

});

module.exports.msg_trade_shop_exchange_req = msg_trade_shop_exchange_req;

let msg_trade_shop_exchange_ask = cc.Class({
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

module.exports.msg_trade_shop_exchange_ask = msg_trade_shop_exchange_ask;

let shop_exchange_record_item = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.itemid = this.itemid;
        content.itemcount = this.itemcount;
        content.status = this.status;
        content.time = this.time;
        content.trackNum = this.trackNum;
        content.orderNum = this.orderNum;

        return content;
    },
    setItemid(itemid){
        this.itemid = itemid;
    },
    setItemcount(itemcount){
        this.itemcount = itemcount;
    },
    setStatus(status){
        this.status = status;
    },
    setTime(time){
        this.time = time;
    },
    setTrackNum(trackNum){
        this.trackNum = trackNum;
    },
    setOrderNum(orderNum){
        this.orderNum = orderNum;
    },

});

module.exports.shop_exchange_record_item = shop_exchange_record_item;

let msg_trade_shop_exchange_record_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.opType = this.opType;

        return content;
    },
    setOpType(opType){
        this.opType = opType;
    },

});

module.exports.msg_trade_shop_exchange_record_req = msg_trade_shop_exchange_record_req;

let msg_trade_shop_exchange_record_ask = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.listList = this.listList;
        content.opType = this.opType;

        return content;
    },
    setListList(listList){
        this.listList = listList;
    },
    setOpType(opType){
        this.opType = opType;
    },

});

module.exports.msg_trade_shop_exchange_record_ask = msg_trade_shop_exchange_record_ask;

let msg_activity_state = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.activityId = this.activityId;
        content.state = this.state;

        return content;
    },
    setActivityId(activityId){
        this.activityId = activityId;
    },
    setState(state){
        this.state = state;
    },

});

module.exports.msg_activity_state = msg_activity_state;

let activity_item = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.minRank = this.minRank;
        content.maxRank = this.maxRank;
        content.itemDataId = this.itemDataId;
        content.num = this.num;

        return content;
    },
    setMinRank(minRank){
        this.minRank = minRank;
    },
    setMaxRank(maxRank){
        this.maxRank = maxRank;
    },
    setItemDataId(itemDataId){
        this.itemDataId = itemDataId;
    },
    setNum(num){
        this.num = num;
    },

});

module.exports.activity_item = activity_item;

let activity_infos = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.activityId = this.activityId;
        content.state = this.state;
        content.rewardsInfoList = this.rewardsInfoList;

        return content;
    },
    setActivityId(activityId){
        this.activityId = activityId;
    },
    setState(state){
        this.state = state;
    },
    setRewardsInfoList(rewardsInfoList){
        this.rewardsInfoList = rewardsInfoList;
    },

});

module.exports.activity_infos = activity_infos;

let msg_activity_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.activityList = this.activityList;

        return content;
    },
    setActivityList(activityList){
        this.activityList = activityList;
    },

});

module.exports.msg_activity_info = msg_activity_info;

let msg_refresh_function = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.functionId = this.functionId;

        return content;
    },
    setFunctionId(functionId){
        this.functionId = functionId;
    },

});

module.exports.msg_refresh_function = msg_refresh_function;

let msg_activity_info_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_activity_info_req = msg_activity_info_req;

let happy_item = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.itemDataId = this.itemDataId;
        content.num = this.num;

        return content;
    },
    setItemDataId(itemDataId){
        this.itemDataId = itemDataId;
    },
    setNum(num){
        this.num = num;
    },

});

module.exports.happy_item = happy_item;

let happy_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.index = this.index;
        content.state = this.state;
        content.itemsList = this.itemsList;

        return content;
    },
    setIndex(index){
        this.index = index;
    },
    setState(state){
        this.state = state;
    },
    setItemsList(itemsList){
        this.itemsList = itemsList;
    },

});

module.exports.happy_info = happy_info;

let msg_seven_happy = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.beginTime = this.beginTime;
        content.endTime = this.endTime;
        content.happysList = this.happysList;
        content.isBind = this.isBind;

        return content;
    },
    setBeginTime(beginTime){
        this.beginTime = beginTime;
    },
    setEndTime(endTime){
        this.endTime = endTime;
    },
    setHappysList(happysList){
        this.happysList = happysList;
    },
    setIsBind(isBind){
        this.isBind = isBind;
    },

});

module.exports.msg_seven_happy = msg_seven_happy;

let msg_get_seven_happy_req = cc.Class({
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

module.exports.msg_get_seven_happy_req = msg_get_seven_happy_req;

let msg_get_seven_happy_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.index = this.index;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setIndex(index){
        this.index = index;
    },

});

module.exports.msg_get_seven_happy_ret = msg_get_seven_happy_ret;

let msg_share_friend_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },

});

module.exports.msg_share_friend_2c = msg_share_friend_2c;

let msg_update_memory_card_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameType = this.gameType;
        content.expireTime = this.expireTime;

        return content;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setExpireTime(expireTime){
        this.expireTime = expireTime;
    },

});

module.exports.msg_update_memory_card_info = msg_update_memory_card_info;

let msg_share_relief_gift_2s = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_share_relief_gift_2s = msg_share_relief_gift_2s;

let msg_share_relief_gift_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retcode = this.retcode;

        return content;
    },
    setRetcode(retcode){
        this.retcode = retcode;
    },

});

module.exports.msg_share_relief_gift_2c = msg_share_relief_gift_2c;

let msg_day_share_reward_2s = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clientChannel = this.clientChannel;

        return content;
    },
    setClientChannel(clientChannel){
        this.clientChannel = clientChannel;
    },

});

module.exports.msg_day_share_reward_2s = msg_day_share_reward_2s;

let msg_day_share_reward_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retcode = this.retcode;
        content.rewardList = this.rewardList;

        return content;
    },
    setRetcode(retcode){
        this.retcode = retcode;
    },
    setRewardList(rewardList){
        this.rewardList = rewardList;
    },

});

module.exports.msg_day_share_reward_2c = msg_day_share_reward_2c;

let get_rank_activity_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.get_rank_activity_req = get_rank_activity_req;

let rank_activity = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.beginTime = this.beginTime;
        content.endTime = this.endTime;
        content.title = this.title;
        content.content = this.content;
        content.rankDetail = this.rankDetail;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setBeginTime(beginTime){
        this.beginTime = beginTime;
    },
    setEndTime(endTime){
        this.endTime = endTime;
    },
    setTitle(title){
        this.title = title;
    },
    setContent(content){
        this.content = content;
    },
    setRankDetail(rankDetail){
        this.rankDetail = rankDetail;
    },

});

module.exports.rank_activity = rank_activity;

let get_rank_activity_ret = cc.Class({
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

module.exports.get_rank_activity_ret = get_rank_activity_ret;

let msg_rank_activity_state = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.activityId = this.activityId;
        content.state = this.state;

        return content;
    },
    setActivityId(activityId){
        this.activityId = activityId;
    },
    setState(state){
        this.state = state;
    },

});

module.exports.msg_rank_activity_state = msg_rank_activity_state;

let get_receiving_address_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.get_receiving_address_req = get_receiving_address_req;

let get_receiving_address_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.name = this.name;
        content.tel = this.tel;
        content.address = this.address;

        return content;
    },
    setName(name){
        this.name = name;
    },
    setTel(tel){
        this.tel = tel;
    },
    setAddress(address){
        this.address = address;
    },

});

module.exports.get_receiving_address_ret = get_receiving_address_ret;

let modify_receiving_address_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.name = this.name;
        content.tel = this.tel;
        content.address = this.address;

        return content;
    },
    setName(name){
        this.name = name;
    },
    setTel(tel){
        this.tel = tel;
    },
    setAddress(address){
        this.address = address;
    },

});

module.exports.modify_receiving_address_req = modify_receiving_address_req;

let modify_receiving_address_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },

});

module.exports.modify_receiving_address_ret = modify_receiving_address_ret;

let get_lucky_activity_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.get_lucky_activity_req = get_lucky_activity_req;

let lucky_activity = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.beginTime = this.beginTime;
        content.endTime = this.endTime;
        content.userScore = this.userScore;
        content.rankId = this.rankId;
        content.rewardPoolSize = this.rewardPoolSize;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setBeginTime(beginTime){
        this.beginTime = beginTime;
    },
    setEndTime(endTime){
        this.endTime = endTime;
    },
    setUserScore(userScore){
        this.userScore = userScore;
    },
    setRankId(rankId){
        this.rankId = rankId;
    },
    setRewardPoolSize(rewardPoolSize){
        this.rewardPoolSize = rewardPoolSize;
    },

});

module.exports.lucky_activity = lucky_activity;

let get_lucky_activity_ret = cc.Class({
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

module.exports.get_lucky_activity_ret = get_lucky_activity_ret;

let msg_lucky_activity_state = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.activityId = this.activityId;
        content.state = this.state;

        return content;
    },
    setActivityId(activityId){
        this.activityId = activityId;
    },
    setState(state){
        this.state = state;
    },

});

module.exports.msg_lucky_activity_state = msg_lucky_activity_state;

let msg_lucky_activity_draw_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_lucky_activity_draw_req = msg_lucky_activity_draw_req;

let msg_lucky_activity_draw_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.luckyScore = this.luckyScore;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setLuckyScore(luckyScore){
        this.luckyScore = luckyScore;
    },

});

module.exports.msg_lucky_activity_draw_ret = msg_lucky_activity_draw_ret;

let msg_lucky_activity_draw_history_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_lucky_activity_draw_history_req = msg_lucky_activity_draw_history_req;

let lucky_activity_draw_history = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.drawTime = this.drawTime;
        content.drawScore = this.drawScore;

        return content;
    },
    setDrawTime(drawTime){
        this.drawTime = drawTime;
    },
    setDrawScore(drawScore){
        this.drawScore = drawScore;
    },

});

module.exports.lucky_activity_draw_history = lucky_activity_draw_history;

let msg_lucky_activity_draw_history_ret = cc.Class({
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

module.exports.msg_lucky_activity_draw_history_ret = msg_lucky_activity_draw_history_ret;

let msg_vip_ext_open_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.curExp = this.curExp;
        content.drawNum = this.drawNum;

        return content;
    },
    setCurExp(curExp){
        this.curExp = curExp;
    },
    setDrawNum(drawNum){
        this.drawNum = drawNum;
    },

});

module.exports.msg_vip_ext_open_2c = msg_vip_ext_open_2c;

