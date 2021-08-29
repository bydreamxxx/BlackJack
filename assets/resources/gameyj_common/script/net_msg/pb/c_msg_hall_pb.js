let neteasy_im_info_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.info = this.info;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setInfo(info){
        this.info = info;
    },

});

module.exports.neteasy_im_info_req = neteasy_im_info_req;

let neteasy_im_info_ack = cc.Class({
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

module.exports.neteasy_im_info_ack = neteasy_im_info_ack;

let broadcast = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.speed = this.speed;
        content.showtimes = this.showtimes;
        content.content = this.content;
        content.type = this.type;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setSpeed(speed){
        this.speed = speed;
    },
    setShowtimes(showtimes){
        this.showtimes = showtimes;
    },
    setContent(content){
        this.content = content;
    },
    setType(type){
        this.type = type;
    },

});

module.exports.broadcast = broadcast;

let get_battle_record_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.historyId = this.historyId;

        return content;
    },
    setHistoryId(historyId){
        this.historyId = historyId;
    },

});

module.exports.get_battle_record_req = get_battle_record_req;

let battle_record_detail = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.historyId = this.historyId;
        content.round = this.round;
        content.timestamp = this.timestamp;

        return content;
    },
    setHistoryId(historyId){
        this.historyId = historyId;
    },
    setRound(round){
        this.round = round;
    },
    setTimestamp(timestamp){
        this.timestamp = timestamp;
    },

});

module.exports.battle_record_detail = battle_record_detail;

let get_battle_record_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.detail = this.detail;

        return content;
    },
    setDetail(detail){
        this.detail = detail;
    },

});

module.exports.get_battle_record_ack = get_battle_record_ack;

let user_battle_result = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.name = this.name;
        content.score = this.score;
        content.openId = this.openId;
        content.headUrl = this.headUrl;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setName(name){
        this.name = name;
    },
    setScore(score){
        this.score = score;
    },
    setOpenId(openId){
        this.openId = openId;
    },
    setHeadUrl(headUrl){
        this.headUrl = headUrl;
    },

});

module.exports.user_battle_result = user_battle_result;

let get_battle_history_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameId = this.gameId;

        return content;
    },
    setGameId(gameId){
        this.gameId = gameId;
    },

});

module.exports.get_battle_history_req = get_battle_history_req;

let battle_history_detail = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.historyId = this.historyId;
        content.roomId = this.roomId;
        content.timestamp = this.timestamp;
        content.resultList = this.resultList;
        content.gameType = this.gameType;
        content.boardsCount = this.boardsCount;

        return content;
    },
    setHistoryId(historyId){
        this.historyId = historyId;
    },
    setRoomId(roomId){
        this.roomId = roomId;
    },
    setTimestamp(timestamp){
        this.timestamp = timestamp;
    },
    setResultList(resultList){
        this.resultList = resultList;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setBoardsCount(boardsCount){
        this.boardsCount = boardsCount;
    },

});

module.exports.battle_history_detail = battle_history_detail;

let get_battle_history_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.detailList = this.detailList;

        return content;
    },
    setDetailList(detailList){
        this.detailList = detailList;
    },

});

module.exports.get_battle_history_ack = get_battle_history_ack;

let get_draw_lottery_history_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.page = this.page;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setPage(page){
        this.page = page;
    },

});

module.exports.get_draw_lottery_history_req = get_draw_lottery_history_req;

let DrawLotteryRecord = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.name = this.name;
        content.drawid = this.drawid;
        content.timestamp = this.timestamp;
        content.args = this.args;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setName(name){
        this.name = name;
    },
    setDrawid(drawid){
        this.drawid = drawid;
    },
    setTimestamp(timestamp){
        this.timestamp = timestamp;
    },
    setArgs(args){
        this.args = args;
    },

});

module.exports.DrawLotteryRecord = DrawLotteryRecord;

let get_draw_lottery_history_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.historyList = this.historyList;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setHistoryList(historyList){
        this.historyList = historyList;
    },

});

module.exports.get_draw_lottery_history_ack = get_draw_lottery_history_ack;

let client_task_complete_req = cc.Class({
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

module.exports.client_task_complete_req = client_task_complete_req;

let client_task_complete_ack = cc.Class({
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

module.exports.client_task_complete_ack = client_task_complete_ack;

let update_task_process = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.taskid = this.taskid;
        content.curnum = this.curnum;
        content.drewtimes = this.drewtimes;
        content.status = this.status;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setTaskid(taskid){
        this.taskid = taskid;
    },
    setCurnum(curnum){
        this.curnum = curnum;
    },
    setDrewtimes(drewtimes){
        this.drewtimes = drewtimes;
    },
    setStatus(status){
        this.status = status;
    },

});

module.exports.update_task_process = update_task_process;

let get_user_adress_info_req = cc.Class({
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

module.exports.get_user_adress_info_req = get_user_adress_info_req;

let get_user_adress_info_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.receiverWx = this.receiverWx;
        content.receiverMobile = this.receiverMobile;
        content.receiverName = this.receiverName;
        content.receiverAdress = this.receiverAdress;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setReceiverWx(receiverWx){
        this.receiverWx = receiverWx;
    },
    setReceiverMobile(receiverMobile){
        this.receiverMobile = receiverMobile;
    },
    setReceiverName(receiverName){
        this.receiverName = receiverName;
    },
    setReceiverAdress(receiverAdress){
        this.receiverAdress = receiverAdress;
    },

});

module.exports.get_user_adress_info_ack = get_user_adress_info_ack;

let get_mobile_code_unbind_req = cc.Class({
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

module.exports.get_mobile_code_unbind_req = get_mobile_code_unbind_req;

let get_mobile_code_unbind_ack = cc.Class({
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

module.exports.get_mobile_code_unbind_ack = get_mobile_code_unbind_ack;

let unbind_mobile_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.code = this.code;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setCode(code){
        this.code = code;
    },

});

module.exports.unbind_mobile_req = unbind_mobile_req;

let unbind_mobile_ack = cc.Class({
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

module.exports.unbind_mobile_ack = unbind_mobile_ack;

let modify_user_base_info_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.nikename = this.nikename;
        content.sex = this.sex;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setNikename(nikename){
        this.nikename = nikename;
    },
    setSex(sex){
        this.sex = sex;
    },

});

module.exports.modify_user_base_info_req = modify_user_base_info_req;

let modify_user_base_info_ack = cc.Class({
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

module.exports.modify_user_base_info_ack = modify_user_base_info_ack;

let get_other_user_base_info_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.lookUserId = this.lookUserId;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setLookUserId(lookUserId){
        this.lookUserId = lookUserId;
    },

});

module.exports.get_other_user_base_info_req = get_other_user_base_info_req;

let get_other_user_base_info_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.nickname = this.nickname;
        content.headurl = this.headurl;
        content.sex = this.sex;
        content.city = this.city;
        content.coin = this.coin;
        content.roomcard = this.roomcard;
        content.score = this.score;

        return content;
    },
    setHeader(header){
        this.header = header;
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
    setCoin(coin){
        this.coin = coin;
    },
    setRoomcard(roomcard){
        this.roomcard = roomcard;
    },
    setScore(score){
        this.score = score;
    },

});

module.exports.get_other_user_base_info_ack = get_other_user_base_info_ack;

let get_play_game_server_info_by_roomnum_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.gameType = this.gameType;
        content.roomnum = this.roomnum;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setRoomnum(roomnum){
        this.roomnum = roomnum;
    },

});

module.exports.get_play_game_server_info_by_roomnum_req = get_play_game_server_info_by_roomnum_req;

let get_play_game_server_info_by_roomnum_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.ip = this.ip;
        content.port = this.port;
        content.token = this.token;
        content.gameType = this.gameType;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setIp(ip){
        this.ip = ip;
    },
    setPort(port){
        this.port = port;
    },
    setToken(token){
        this.token = token;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },

});

module.exports.get_play_game_server_info_by_roomnum_ack = get_play_game_server_info_by_roomnum_ack;

let get_play_game_server_info_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.gameType = this.gameType;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },

});

module.exports.get_play_game_server_info_req = get_play_game_server_info_req;

let get_play_game_server_info_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.ip = this.ip;
        content.port = this.port;
        content.token = this.token;
        content.gameType = this.gameType;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setIp(ip){
        this.ip = ip;
    },
    setPort(port){
        this.port = port;
    },
    setToken(token){
        this.token = token;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },

});

module.exports.get_play_game_server_info_ack = get_play_game_server_info_ack;

let get_reconn_game_server_info_req = cc.Class({
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

module.exports.get_reconn_game_server_info_req = get_reconn_game_server_info_req;

let get_reconn_game_server_info_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.gameId = this.gameId;
        content.roomType = this.roomType;
        content.ip = this.ip;
        content.port = this.port;
        content.token = this.token;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setGameId(gameId){
        this.gameId = gameId;
    },
    setRoomType(roomType){
        this.roomType = roomType;
    },
    setIp(ip){
        this.ip = ip;
    },
    setPort(port){
        this.port = port;
    },
    setToken(token){
        this.token = token;
    },

});

module.exports.get_reconn_game_server_info_ack = get_reconn_game_server_info_ack;

let get_mall_item_list_req = cc.Class({
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

module.exports.get_mall_item_list_req = get_mall_item_list_req;

let get_mall_item_list_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.itemListList = this.itemListList;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setItemListList(itemListList){
        this.itemListList = itemListList;
    },

});

module.exports.get_mall_item_list_ack = get_mall_item_list_ack;

let mall_item_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.goodsId = this.goodsId;
        content.name = this.name;
        content.priceType = this.priceType;
        content.price = this.price;
        content.goodsType = this.goodsType;
        content.amount = this.amount;
        content.discount = this.discount;
        content.image = this.image;

        return content;
    },
    setGoodsId(goodsId){
        this.goodsId = goodsId;
    },
    setName(name){
        this.name = name;
    },
    setPriceType(priceType){
        this.priceType = priceType;
    },
    setPrice(price){
        this.price = price;
    },
    setGoodsType(goodsType){
        this.goodsType = goodsType;
    },
    setAmount(amount){
        this.amount = amount;
    },
    setDiscount(discount){
        this.discount = discount;
    },
    setImage(image){
        this.image = image;
    },

});

module.exports.mall_item_info = mall_item_info;

let get_mobile_code_bind_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.type = this.type;
        content.mobile = this.mobile;

        return content;
    },
    setType(type){
        this.type = type;
    },
    setMobile(mobile){
        this.mobile = mobile;
    },

});

module.exports.get_mobile_code_bind_req = get_mobile_code_bind_req;

let get_mobile_code_bind_ack = cc.Class({
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

module.exports.get_mobile_code_bind_ack = get_mobile_code_bind_ack;

let bind_mobilephone_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.type = this.type;
        content.mobile = this.mobile;
        content.password = this.password;
        content.mobileCode = this.mobileCode;

        return content;
    },
    setType(type){
        this.type = type;
    },
    setMobile(mobile){
        this.mobile = mobile;
    },
    setPassword(password){
        this.password = password;
    },
    setMobileCode(mobileCode){
        this.mobileCode = mobileCode;
    },

});

module.exports.bind_mobilephone_req = bind_mobilephone_req;

let bind_mobilephone_ack = cc.Class({
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

module.exports.bind_mobilephone_ack = bind_mobilephone_ack;

let get_mobile_code_find_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.mobile = this.mobile;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setMobile(mobile){
        this.mobile = mobile;
    },

});

module.exports.get_mobile_code_find_req = get_mobile_code_find_req;

let get_mobile_code_find_ack = cc.Class({
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

module.exports.get_mobile_code_find_ack = get_mobile_code_find_ack;

let find_bag_password_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.mobile = this.mobile;
        content.password = this.password;
        content.mobileCode = this.mobileCode;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setMobile(mobile){
        this.mobile = mobile;
    },
    setPassword(password){
        this.password = password;
    },
    setMobileCode(mobileCode){
        this.mobileCode = mobileCode;
    },

});

module.exports.find_bag_password_req = find_bag_password_req;

let find_bag_password_ack = cc.Class({
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

module.exports.find_bag_password_ack = find_bag_password_ack;

let bind_idcard_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.name = this.name;
        content.id = this.id;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setName(name){
        this.name = name;
    },
    setId(id){
        this.id = id;
    },

});

module.exports.bind_idcard_req = bind_idcard_req;

let bind_idcard_ack = cc.Class({
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

module.exports.bind_idcard_ack = bind_idcard_ack;

let huo_jiang_list_req = cc.Class({
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

module.exports.huo_jiang_list_req = huo_jiang_list_req;

let huo_jiang_list_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.listList = this.listList;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setListList(listList){
        this.listList = listList;
    },

});

module.exports.huo_jiang_list_ack = huo_jiang_list_ack;

let huo_jiang_list = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.time = this.time;
        content.goodsName = this.goodsName;
        content.nums = this.nums;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setTime(time){
        this.time = time;
    },
    setGoodsName(goodsName){
        this.goodsName = goodsName;
    },
    setNums(nums){
        this.nums = nums;
    },

});

module.exports.huo_jiang_list = huo_jiang_list;

let shiwu_dui_huan_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.userId = this.userId;
        content.typeId = this.typeId;
        content.numbers = this.numbers;
        content.phone = this.phone;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setTypeId(typeId){
        this.typeId = typeId;
    },
    setNumbers(numbers){
        this.numbers = numbers;
    },
    setPhone(phone){
        this.phone = phone;
    },

});

module.exports.shiwu_dui_huan_req = shiwu_dui_huan_req;

let shiwu_dui_huan_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.ruserts = this.ruserts;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setRuserts(ruserts){
        this.ruserts = ruserts;
    },

});

module.exports.shiwu_dui_huan_ack = shiwu_dui_huan_ack;

let fudai_dui_huan_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.goodId = this.goodId;
        content.goodsId = this.goodsId;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setGoodId(goodId){
        this.goodId = goodId;
    },
    setGoodsId(goodsId){
        this.goodsId = goodsId;
    },

});

module.exports.fudai_dui_huan_req = fudai_dui_huan_req;

let fudai_dui_huan_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.rusert = this.rusert;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setRusert(rusert){
        this.rusert = rusert;
    },

});

module.exports.fudai_dui_huan_ack = fudai_dui_huan_ack;

let reality_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.goodsId = this.goodsId;
        content.userName = this.userName;
        content.call = this.call;
        content.wechat = this.wechat;
        content.address = this.address;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setGoodsId(goodsId){
        this.goodsId = goodsId;
    },
    setUserName(userName){
        this.userName = userName;
    },
    setCall(call){
        this.call = call;
    },
    setWechat(wechat){
        this.wechat = wechat;
    },
    setAddress(address){
        this.address = address;
    },

});

module.exports.reality_req = reality_req;

let reality_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.yesOrNo = this.yesOrNo;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setYesOrNo(yesOrNo){
        this.yesOrNo = yesOrNo;
    },

});

module.exports.reality_ack = reality_ack;

let hall_req_feed_back = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.userId = this.userId;
        content.msg = this.msg;
        content.tell = this.tell;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setMsg(msg){
        this.msg = msg;
    },
    setTell(tell){
        this.tell = tell;
    },

});

module.exports.hall_req_feed_back = hall_req_feed_back;

let hall_ack_feed_back = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.state = this.state;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setState(state){
        this.state = state;
    },

});

module.exports.hall_ack_feed_back = hall_ack_feed_back;

let hall_req_notice = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.userId = this.userId;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setUserId(userId){
        this.userId = userId;
    },

});

module.exports.hall_req_notice = hall_req_notice;

let hall_ack_notice = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.listList = this.listList;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setListList(listList){
        this.listList = listList;
    },

});

module.exports.hall_ack_notice = hall_ack_notice;

let hall_notice = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.title = this.title;
        content.content = this.content;
        content.time = this.time;
        content.publisher = this.publisher;

        return content;
    },
    setTitle(title){
        this.title = title;
    },
    setContent(content){
        this.content = content;
    },
    setTime(time){
        this.time = time;
    },
    setPublisher(publisher){
        this.publisher = publisher;
    },

});

module.exports.hall_notice = hall_notice;

let hall_item_event = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.type = this.type;
        content.reward = this.reward;
        content.richtextList = this.richtextList;
        content.title = this.title;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setType(type){
        this.type = type;
    },
    setReward(reward){
        this.reward = reward;
    },
    setRichtextList(richtextList){
        this.richtextList = richtextList;
    },
    setTitle(title){
        this.title = title;
    },

});

module.exports.hall_item_event = hall_item_event;

let hall_mail_unread_num = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.num = this.num;

        return content;
    },
    setNum(num){
        this.num = num;
    },

});

module.exports.hall_mail_unread_num = hall_mail_unread_num;

let hall_mail_list_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.hall_mail_list_req = hall_mail_list_req;

let hall_mail_list_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.mailListList = this.mailListList;

        return content;
    },
    setMailListList(mailListList){
        this.mailListList = mailListList;
    },

});

module.exports.hall_mail_list_ack = hall_mail_list_ack;

let hall_mail_item = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.mailId = this.mailId;
        content.mailType = this.mailType;
        content.hasReward = this.hasReward;
        content.senderName = this.senderName;
        content.title = this.title;
        content.isRead = this.isRead;
        content.expireTime = this.expireTime;
        content.sendTime = this.sendTime;

        return content;
    },
    setMailId(mailId){
        this.mailId = mailId;
    },
    setMailType(mailType){
        this.mailType = mailType;
    },
    setHasReward(hasReward){
        this.hasReward = hasReward;
    },
    setSenderName(senderName){
        this.senderName = senderName;
    },
    setTitle(title){
        this.title = title;
    },
    setIsRead(isRead){
        this.isRead = isRead;
    },
    setExpireTime(expireTime){
        this.expireTime = expireTime;
    },
    setSendTime(sendTime){
        this.sendTime = sendTime;
    },

});

module.exports.hall_mail_item = hall_mail_item;

let hall_read_mail_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.mailId = this.mailId;

        return content;
    },
    setMailId(mailId){
        this.mailId = mailId;
    },

});

module.exports.hall_read_mail_req = hall_read_mail_req;

let hall_read_mail_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.code = this.code;
        content.mailId = this.mailId;
        content.title = this.title;
        content.content = this.content;
        content.rewardList = this.rewardList;

        return content;
    },
    setCode(code){
        this.code = code;
    },
    setMailId(mailId){
        this.mailId = mailId;
    },
    setTitle(title){
        this.title = title;
    },
    setContent(content){
        this.content = content;
    },
    setRewardList(rewardList){
        this.rewardList = rewardList;
    },

});

module.exports.hall_read_mail_ack = hall_read_mail_ack;

let hall_draw_mail_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.mailId = this.mailId;

        return content;
    },
    setMailId(mailId){
        this.mailId = mailId;
    },

});

module.exports.hall_draw_mail_req = hall_draw_mail_req;

let hall_draw_mail_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.mailId = this.mailId;
        content.code = this.code;
        content.rewardList = this.rewardList;

        return content;
    },
    setMailId(mailId){
        this.mailId = mailId;
    },
    setCode(code){
        this.code = code;
    },
    setRewardList(rewardList){
        this.rewardList = rewardList;
    },

});

module.exports.hall_draw_mail_ack = hall_draw_mail_ack;

let hall_item_task = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.taskId = this.taskId;
        content.curNum = this.curNum;
        content.drewTimes = this.drewTimes;
        content.status = this.status;

        return content;
    },
    setTaskId(taskId){
        this.taskId = taskId;
    },
    setCurNum(curNum){
        this.curNum = curNum;
    },
    setDrewTimes(drewTimes){
        this.drewTimes = drewTimes;
    },
    setStatus(status){
        this.status = status;
    },

});

module.exports.hall_item_task = hall_item_task;

let hall_change_gateout = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.level = this.level;
        content.ip = this.ip;
        content.port = this.port;

        return content;
    },
    setLevel(level){
        this.level = level;
    },
    setIp(ip){
        this.ip = ip;
    },
    setPort(port){
        this.port = port;
    },

});

module.exports.hall_change_gateout = hall_change_gateout;

let hall_userData = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userid = this.userid;
        content.username = this.username;
        content.sex = this.sex;
        content.headurl = this.headurl;
        content.realname = this.realname;
        content.phonenumber = this.phonenumber;
        content.wxnumber = this.wxnumber;
        content.realaddress = this.realaddress;
        content.unionid = this.unionid;
        content.openid = this.openid;
        content.city = this.city;
        content.idcardnumber = this.idcardnumber;
        content.bagmutex = this.bagmutex;
        content.gameid = this.gameid;
        content.viplevel = this.viplevel;
        content.vipexp = this.vipexp;
        content.level = this.level;
        content.exp = this.exp;
        content.coin = this.coin;
        content.diamond = this.diamond;
        content.roomcard = this.roomcard;
        content.bouns = this.bouns;
        content.commonGold = this.commonGold;
        content.gold = this.gold;
        content.phoneValue = this.phoneValue;
        content.onlineTimeDay = this.onlineTimeDay;
        content.rechargeDay = this.rechargeDay;
        content.isGetMoney = this.isGetMoney;
        content.memoryCardInfoListList = this.memoryCardInfoListList;
        content.regChannel = this.regChannel;
        content.inviterId = this.inviterId;
        content.inviterName = this.inviterName;
        content.inviterHeadurl = this.inviterHeadurl;
        content.code = this.code;
        content.modifiedNameTimes = this.modifiedNameTimes;
        content.fishGiftNum = this.fishGiftNum;
        content.fishGiftBetNum = this.fishGiftBetNum;
        content.curUseFishGiftCnt = this.curUseFishGiftCnt;

        return content;
    },
    setUserid(userid){
        this.userid = userid;
    },
    setUsername(username){
        this.username = username;
    },
    setSex(sex){
        this.sex = sex;
    },
    setHeadurl(headurl){
        this.headurl = headurl;
    },
    setRealname(realname){
        this.realname = realname;
    },
    setPhonenumber(phonenumber){
        this.phonenumber = phonenumber;
    },
    setWxnumber(wxnumber){
        this.wxnumber = wxnumber;
    },
    setRealaddress(realaddress){
        this.realaddress = realaddress;
    },
    setUnionid(unionid){
        this.unionid = unionid;
    },
    setOpenid(openid){
        this.openid = openid;
    },
    setCity(city){
        this.city = city;
    },
    setIdcardnumber(idcardnumber){
        this.idcardnumber = idcardnumber;
    },
    setBagmutex(bagmutex){
        this.bagmutex = bagmutex;
    },
    setGameid(gameid){
        this.gameid = gameid;
    },
    setViplevel(viplevel){
        this.viplevel = viplevel;
    },
    setVipexp(vipexp){
        this.vipexp = vipexp;
    },
    setLevel(level){
        this.level = level;
    },
    setExp(exp){
        this.exp = exp;
    },
    setCoin(coin){
        this.coin = coin;
    },
    setDiamond(diamond){
        this.diamond = diamond;
    },
    setRoomcard(roomcard){
        this.roomcard = roomcard;
    },
    setBouns(bouns){
        this.bouns = bouns;
    },
    setCommonGold(commonGold){
        this.commonGold = commonGold;
    },
    setGold(gold){
        this.gold = gold;
    },
    setPhoneValue(phoneValue){
        this.phoneValue = phoneValue;
    },
    setOnlineTimeDay(onlineTimeDay){
        this.onlineTimeDay = onlineTimeDay;
    },
    setRechargeDay(rechargeDay){
        this.rechargeDay = rechargeDay;
    },
    setIsGetMoney(isGetMoney){
        this.isGetMoney = isGetMoney;
    },
    setMemoryCardInfoListList(memoryCardInfoListList){
        this.memoryCardInfoListList = memoryCardInfoListList;
    },
    setRegChannel(regChannel){
        this.regChannel = regChannel;
    },
    setInviterId(inviterId){
        this.inviterId = inviterId;
    },
    setInviterName(inviterName){
        this.inviterName = inviterName;
    },
    setInviterHeadurl(inviterHeadurl){
        this.inviterHeadurl = inviterHeadurl;
    },
    setCode(code){
        this.code = code;
    },
    setModifiedNameTimes(modifiedNameTimes){
        this.modifiedNameTimes = modifiedNameTimes;
    },
    setFishGiftNum(fishGiftNum){
        this.fishGiftNum = fishGiftNum;
    },
    setFishGiftBetNum(fishGiftBetNum){
        this.fishGiftBetNum = fishGiftBetNum;
    },
    setCurUseFishGiftCnt(curUseFishGiftCnt){
        this.curUseFishGiftCnt = curUseFishGiftCnt;
    },

});

module.exports.hall_userData = hall_userData;

let hall_rank_item = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.placing = this.placing;
        content.userid = this.userid;
        content.nickname = this.nickname;
        content.rankinfo = this.rankinfo;

        return content;
    },
    setPlacing(placing){
        this.placing = placing;
    },
    setUserid(userid){
        this.userid = userid;
    },
    setNickname(nickname){
        this.nickname = nickname;
    },
    setRankinfo(rankinfo){
        this.rankinfo = rankinfo;
    },

});

module.exports.hall_rank_item = hall_rank_item;

let CoinZone = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.payList = this.payList;

        return content;
    },
    setPayList(payList){
        this.payList = payList;
    },

});

module.exports.CoinZone = CoinZone;

let DiamondZone = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.payList = this.payList;

        return content;
    },
    setPayList(payList){
        this.payList = payList;
    },

});

module.exports.DiamondZone = DiamondZone;

let ExchangeZone = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.moneyList = this.moneyList;

        return content;
    },
    setMoneyList(moneyList){
        this.moneyList = moneyList;
    },

});

module.exports.ExchangeZone = ExchangeZone;

let BuyZone = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.payList = this.payList;

        return content;
    },
    setPayList(payList){
        this.payList = payList;
    },

});

module.exports.BuyZone = BuyZone;

let GoodsItem = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.money = this.money;
        content.img = this.img;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setMoney(money){
        this.money = money;
    },
    setImg(img){
        this.img = img;
    },

});

module.exports.GoodsItem = GoodsItem;

let hall_strongbox_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.boxcoin = this.boxcoin;
        content.usercoin = this.usercoin;

        return content;
    },
    setBoxcoin(boxcoin){
        this.boxcoin = boxcoin;
    },
    setUsercoin(usercoin){
        this.usercoin = usercoin;
    },

});

module.exports.hall_strongbox_info = hall_strongbox_info;

let hall_ack_strongbox_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.strongboxinfo = this.strongboxinfo;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setStrongboxinfo(strongboxinfo){
        this.strongboxinfo = strongboxinfo;
    },

});

module.exports.hall_ack_strongbox_info = hall_ack_strongbox_info;

let hall_req_strongbox_info = cc.Class({
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

module.exports.hall_req_strongbox_info = hall_req_strongbox_info;

let hall_req_coininbag = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.accesscoin = this.accesscoin;
        content.type = this.type;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setAccesscoin(accesscoin){
        this.accesscoin = accesscoin;
    },
    setType(type){
        this.type = type;
    },

});

module.exports.hall_req_coininbag = hall_req_coininbag;

let hall_ack_coininbag = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.strongboxinfo = this.strongboxinfo;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setStrongboxinfo(strongboxinfo){
        this.strongboxinfo = strongboxinfo;
    },

});

module.exports.hall_ack_coininbag = hall_ack_coininbag;

let hall_req_draw_lottery = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.drawType = this.drawType;
        content.num = this.num;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setDrawType(drawType){
        this.drawType = drawType;
    },
    setNum(num){
        this.num = num;
    },

});

module.exports.hall_req_draw_lottery = hall_req_draw_lottery;

let hall_ack_draw_lottery = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.lotteryidList = this.lotteryidList;
        content.redbagnumList = this.redbagnumList;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setLotteryidList(lotteryidList){
        this.lotteryidList = lotteryidList;
    },
    setRedbagnumList(redbagnumList){
        this.redbagnumList = redbagnumList;
    },

});

module.exports.hall_ack_draw_lottery = hall_ack_draw_lottery;

let hall_req_ds_lottery_info = cc.Class({
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

module.exports.hall_req_ds_lottery_info = hall_req_ds_lottery_info;

let hall_ack_ds_lottery_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.drawlotteryinfo = this.drawlotteryinfo;
        content.signlotteryinfo = this.signlotteryinfo;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setDrawlotteryinfo(drawlotteryinfo){
        this.drawlotteryinfo = drawlotteryinfo;
    },
    setSignlotteryinfo(signlotteryinfo){
        this.signlotteryinfo = signlotteryinfo;
    },

});

module.exports.hall_ack_ds_lottery_info = hall_ack_ds_lottery_info;

let hall_req_goods_list = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.goodsType = this.goodsType;
        content.channelid = this.channelid;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setGoodsType(goodsType){
        this.goodsType = goodsType;
    },
    setChannelid(channelid){
        this.channelid = channelid;
    },

});

module.exports.hall_req_goods_list = hall_req_goods_list;

let hall_ack_goods_list = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.goodsType = this.goodsType;
        content.itemsList = this.itemsList;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setGoodsType(goodsType){
        this.goodsType = goodsType;
    },
    setItemsList(itemsList){
        this.itemsList = itemsList;
    },

});

module.exports.hall_ack_goods_list = hall_ack_goods_list;

let hall_req_goods_buy = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.goodsId = this.goodsId;
        content.goodsNum = this.goodsNum;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setGoodsId(goodsId){
        this.goodsId = goodsId;
    },
    setGoodsNum(goodsNum){
        this.goodsNum = goodsNum;
    },

});

module.exports.hall_req_goods_buy = hall_req_goods_buy;

let hall_ack_goods_buy = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.header = this.header;
        content.goodsType = this.goodsType;
        content.amount = this.amount;

        return content;
    },
    setHeader(header){
        this.header = header;
    },
    setGoodsType(goodsType){
        this.goodsType = goodsType;
    },
    setAmount(amount){
        this.amount = amount;
    },

});

module.exports.hall_ack_goods_buy = hall_ack_goods_buy;

let hall_goods_item_msg = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.goodsId = this.goodsId;
        content.name = this.name;
        content.priceType = this.priceType;
        content.price = this.price;
        content.goodsType = this.goodsType;
        content.amount = this.amount;
        content.discount = this.discount;
        content.image = this.image;

        return content;
    },
    setGoodsId(goodsId){
        this.goodsId = goodsId;
    },
    setName(name){
        this.name = name;
    },
    setPriceType(priceType){
        this.priceType = priceType;
    },
    setPrice(price){
        this.price = price;
    },
    setGoodsType(goodsType){
        this.goodsType = goodsType;
    },
    setAmount(amount){
        this.amount = amount;
    },
    setDiscount(discount){
        this.discount = discount;
    },
    setImage(image){
        this.image = image;
    },

});

module.exports.hall_goods_item_msg = hall_goods_item_msg;

let hall_sign_lottery_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.issigntoday = this.issigntoday;
        content.totaldays = this.totaldays;
        content.continuousdays = this.continuousdays;
        content.signitemsList = this.signitemsList;

        return content;
    },
    setIssigntoday(issigntoday){
        this.issigntoday = issigntoday;
    },
    setTotaldays(totaldays){
        this.totaldays = totaldays;
    },
    setContinuousdays(continuousdays){
        this.continuousdays = continuousdays;
    },
    setSignitemsList(signitemsList){
        this.signitemsList = signitemsList;
    },

});

module.exports.hall_sign_lottery_info = hall_sign_lottery_info;

let hall_draw_lottery_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.isdrawtoday = this.isdrawtoday;
        content.dialitemsList = this.dialitemsList;

        return content;
    },
    setIsdrawtoday(isdrawtoday){
        this.isdrawtoday = isdrawtoday;
    },
    setDialitemsList(dialitemsList){
        this.dialitemsList = dialitemsList;
    },

});

module.exports.hall_draw_lottery_info = hall_draw_lottery_info;

let hall_lottery_item = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.num = this.num;
        content.type = this.type;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setNum(num){
        this.num = num;
    },
    setType(type){
        this.type = type;
    },

});

module.exports.hall_lottery_item = hall_lottery_item;

let hall_req_new_room_list = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.hallGameid = this.hallGameid;

        return content;
    },
    setHallGameid(hallGameid){
        this.hallGameid = hallGameid;
    },

});

module.exports.hall_req_new_room_list = hall_req_new_room_list;

let hall_ack_new_room_list = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.hallGameid = this.hallGameid;
        content.roomlistList = this.roomlistList;

        return content;
    },
    setHallGameid(hallGameid){
        this.hallGameid = hallGameid;
    },
    setRoomlistList(roomlistList){
        this.roomlistList = roomlistList;
    },

});

module.exports.hall_ack_new_room_list = hall_ack_new_room_list;

let hall_new_room_list = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.fangjianid = this.fangjianid;
        content.fangjianrenshu = this.fangjianrenshu;

        return content;
    },
    setFangjianid(fangjianid){
        this.fangjianid = fangjianid;
    },
    setFangjianrenshu(fangjianrenshu){
        this.fangjianrenshu = fangjianrenshu;
    },

});

module.exports.hall_new_room_list = hall_new_room_list;

let hall_req_task = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.hall_req_task = hall_req_task;

let hall_ack_task = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.tasklistList = this.tasklistList;

        return content;
    },
    setTasklistList(tasklistList){
        this.tasklistList = tasklistList;
    },

});

module.exports.hall_ack_task = hall_ack_task;

let hall_req_draw_task = cc.Class({
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

module.exports.hall_req_draw_task = hall_req_draw_task;

let hall_ack_draw_task = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.itemListList = this.itemListList;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setItemListList(itemListList){
        this.itemListList = itemListList;
    },

});

module.exports.hall_ack_draw_task = hall_ack_draw_task;

let hall_update_task = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.task = this.task;

        return content;
    },
    setTask(task){
        this.task = task;
    },

});

module.exports.hall_update_task = hall_update_task;

let config_mall_item = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.mallId = this.mallId;
        content.costItemId = this.costItemId;
        content.costItemNum = this.costItemNum;
        content.mallItemId = this.mallItemId;
        content.mallItemNum = this.mallItemNum;

        return content;
    },
    setMallId(mallId){
        this.mallId = mallId;
    },
    setCostItemId(costItemId){
        this.costItemId = costItemId;
    },
    setCostItemNum(costItemNum){
        this.costItemNum = costItemNum;
    },
    setMallItemId(mallItemId){
        this.mallItemId = mallItemId;
    },
    setMallItemNum(mallItemNum){
        this.mallItemNum = mallItemNum;
    },

});

module.exports.config_mall_item = config_mall_item;

let hall_req_config_mall = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.hall_req_config_mall = hall_req_config_mall;

let hall_ack_config_mall = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.itemListList = this.itemListList;

        return content;
    },
    setItemListList(itemListList){
        this.itemListList = itemListList;
    },

});

module.exports.hall_ack_config_mall = hall_ack_config_mall;

let config_notice_item = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.timestamp = this.timestamp;
        content.title = this.title;
        content.content = this.content;
        content.type = this.type;
        content.level = this.level;

        return content;
    },
    setTimestamp(timestamp){
        this.timestamp = timestamp;
    },
    setTitle(title){
        this.title = title;
    },
    setContent(content){
        this.content = content;
    },
    setType(type){
        this.type = type;
    },
    setLevel(level){
        this.level = level;
    },

});

module.exports.config_notice_item = config_notice_item;

let hall_req_config_notice = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.hall_req_config_notice = hall_req_config_notice;

let hall_ack_config_notice = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.noticeListList = this.noticeListList;

        return content;
    },
    setNoticeListList(noticeListList){
        this.noticeListList = noticeListList;
    },

});

module.exports.hall_ack_config_notice = hall_ack_config_notice;

let hall_req_config_gm = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.hall_req_config_gm = hall_req_config_gm;

let hall_ack_config_gm = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gmListList = this.gmListList;

        return content;
    },
    setGmListList(gmListList){
        this.gmListList = gmListList;
    },

});

module.exports.hall_ack_config_gm = hall_ack_config_gm;

let hall_req_config_broadcast = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.hall_req_config_broadcast = hall_req_config_broadcast;

let hall_ack_config_broadcast = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.contentList = this.contentList;

        return content;
    },
    setContentList(contentList){
        this.contentList = contentList;
    },

});

module.exports.hall_ack_config_broadcast = hall_ack_config_broadcast;

let hall_config_gm = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.title = this.title;
        content.content = this.content;

        return content;
    },
    setTitle(title){
        this.title = title;
    },
    setContent(content){
        this.content = content;
    },

});

module.exports.hall_config_gm = hall_config_gm;

let item_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.itemDataId = this.itemDataId;
        content.count = this.count;
        content.binded = this.binded;
        content.gridId = this.gridId;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setItemDataId(itemDataId){
        this.itemDataId = itemDataId;
    },
    setCount(count){
        this.count = count;
    },
    setBinded(binded){
        this.binded = binded;
    },
    setGridId(gridId){
        this.gridId = gridId;
    },

});

module.exports.item_info = item_info;

let msg_bag_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.bagNums = this.bagNums;
        content.itemsList = this.itemsList;

        return content;
    },
    setBagNums(bagNums){
        this.bagNums = bagNums;
    },
    setItemsList(itemsList){
        this.itemsList = itemsList;
    },

});

module.exports.msg_bag_info = msg_bag_info;

let msg_bag_delete_items = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gridIdsList = this.gridIdsList;

        return content;
    },
    setGridIdsList(gridIdsList){
        this.gridIdsList = gridIdsList;
    },

});

module.exports.msg_bag_delete_items = msg_bag_delete_items;

let msg_bag_add_items = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.itemsList = this.itemsList;

        return content;
    },
    setItemsList(itemsList){
        this.itemsList = itemsList;
    },

});

module.exports.msg_bag_add_items = msg_bag_add_items;

let update_item = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gridId = this.gridId;
        content.num = this.num;

        return content;
    },
    setGridId(gridId){
        this.gridId = gridId;
    },
    setNum(num){
        this.num = num;
    },

});

module.exports.update_item = update_item;

let msg_bag_update_items = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.itemsList = this.itemsList;

        return content;
    },
    setItemsList(itemsList){
        this.itemsList = itemsList;
    },

});

module.exports.msg_bag_update_items = msg_bag_update_items;

let reward_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.index = this.index;
        content.itemId = this.itemId;
        content.num = this.num;
        content.state = this.state;

        return content;
    },
    setIndex(index){
        this.index = index;
    },
    setItemId(itemId){
        this.itemId = itemId;
    },
    setNum(num){
        this.num = num;
    },
    setState(state){
        this.state = state;
    },

});

module.exports.reward_info = reward_info;

let get_msg_seven_day_reward_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.get_msg_seven_day_reward_req = get_msg_seven_day_reward_req;

let get_msg_seven_day_reward_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.rewardListList = this.rewardListList;
        content.isShare = this.isShare;

        return content;
    },
    setRewardListList(rewardListList){
        this.rewardListList = rewardListList;
    },
    setIsShare(isShare){
        this.isShare = isShare;
    },

});

module.exports.get_msg_seven_day_reward_ret = get_msg_seven_day_reward_ret;

let draw_seven_day_reward_req = cc.Class({
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

module.exports.draw_seven_day_reward_req = draw_seven_day_reward_req;

let draw_seven_day_reward_ret = cc.Class({
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

module.exports.draw_seven_day_reward_ret = draw_seven_day_reward_ret;

let draw_share_seven_day_reward_req = cc.Class({
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

module.exports.draw_share_seven_day_reward_req = draw_share_seven_day_reward_req;

let draw_share_seven_day_reward_ret = cc.Class({
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

module.exports.draw_share_seven_day_reward_ret = draw_share_seven_day_reward_ret;

let msg_player_property_update = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.type = this.type;
        content.value = this.value;

        return content;
    },
    setType(type){
        this.type = type;
    },
    setValue(value){
        this.value = value;
    },

});

module.exports.msg_player_property_update = msg_player_property_update;

let msg_use_bag_item_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.useType = this.useType;
        content.itemDataId = this.itemDataId;
        content.num = this.num;

        return content;
    },
    setUseType(useType){
        this.useType = useType;
    },
    setItemDataId(itemDataId){
        this.itemDataId = itemDataId;
    },
    setNum(num){
        this.num = num;
    },

});

module.exports.msg_use_bag_item_req = msg_use_bag_item_req;

let msg_use_bag_item_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.itemDataId = this.itemDataId;
        content.curNum = this.curNum;
        content.code = this.code;
        content.exchangeMoney = this.exchangeMoney;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setItemDataId(itemDataId){
        this.itemDataId = itemDataId;
    },
    setCurNum(curNum){
        this.curNum = curNum;
    },
    setCode(code){
        this.code = code;
    },
    setExchangeMoney(exchangeMoney){
        this.exchangeMoney = exchangeMoney;
    },

});

module.exports.msg_use_bag_item_ret = msg_use_bag_item_ret;

let msg_open_code_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.type = this.type;
        content.opType = this.opType;

        return content;
    },
    setType(type){
        this.type = type;
    },
    setOpType(opType){
        this.opType = opType;
    },

});

module.exports.msg_open_code_req = msg_open_code_req;

let code_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.code = this.code;
        content.value = this.value;
        content.time = this.time;

        return content;
    },
    setCode(code){
        this.code = code;
    },
    setValue(value){
        this.value = value;
    },
    setTime(time){
        this.time = time;
    },

});

module.exports.code_info = code_info;

let msg_open_code_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.codeList = this.codeList;
        content.type = this.type;
        content.opType = this.opType;

        return content;
    },
    setCodeList(codeList){
        this.codeList = codeList;
    },
    setType(type){
        this.type = type;
    },
    setOpType(opType){
        this.opType = opType;
    },

});

module.exports.msg_open_code_ret = msg_open_code_ret;

let msg_get_bouns_num_req = cc.Class({
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

module.exports.msg_get_bouns_num_req = msg_get_bouns_num_req;

let msg_get_bouns_num_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.num = this.num;
        content.opType = this.opType;

        return content;
    },
    setNum(num){
        this.num = num;
    },
    setOpType(opType){
        this.opType = opType;
    },

});

module.exports.msg_get_bouns_num_ret = msg_get_bouns_num_ret;

let msg_match_tips_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.matchName = this.matchName;

        return content;
    },
    setMatchName(matchName){
        this.matchName = matchName;
    },

});

module.exports.msg_match_tips_ack = msg_match_tips_ack;

let msg_excite_update = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.state = this.state;

        return content;
    },
    setState(state){
        this.state = state;
    },

});

module.exports.msg_excite_update = msg_excite_update;

let msg_user_invite_info_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_user_invite_info_req = msg_user_invite_info_req;

let msg_user_invite_info_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.allBounsNum = this.allBounsNum;
        content.allInviteNum = this.allInviteNum;
        content.finishInviteNum = this.finishInviteNum;
        content.userListList = this.userListList;
        content.allRebateNum = this.allRebateNum;

        return content;
    },
    setAllBounsNum(allBounsNum){
        this.allBounsNum = allBounsNum;
    },
    setAllInviteNum(allInviteNum){
        this.allInviteNum = allInviteNum;
    },
    setFinishInviteNum(finishInviteNum){
        this.finishInviteNum = finishInviteNum;
    },
    setUserListList(userListList){
        this.userListList = userListList;
    },
    setAllRebateNum(allRebateNum){
        this.allRebateNum = allRebateNum;
    },

});

module.exports.msg_user_invite_info_ack = msg_user_invite_info_ack;

let msg_add_user_invite_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userInfo = this.userInfo;

        return content;
    },
    setUserInfo(userInfo){
        this.userInfo = userInfo;
    },

});

module.exports.msg_add_user_invite_info = msg_add_user_invite_info;

let msg_finish_invite_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userInfo = this.userInfo;
        content.allBounsNum = this.allBounsNum;
        content.finishInviteNum = this.finishInviteNum;

        return content;
    },
    setUserInfo(userInfo){
        this.userInfo = userInfo;
    },
    setAllBounsNum(allBounsNum){
        this.allBounsNum = allBounsNum;
    },
    setFinishInviteNum(finishInviteNum){
        this.finishInviteNum = finishInviteNum;
    },

});

module.exports.msg_finish_invite_info = msg_finish_invite_info;

let invite_user_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.uid = this.uid;
        content.name = this.name;
        content.head = this.head;
        content.isFinish = this.isFinish;

        return content;
    },
    setUid(uid){
        this.uid = uid;
    },
    setName(name){
        this.name = name;
    },
    setHead(head){
        this.head = head;
    },
    setIsFinish(isFinish){
        this.isFinish = isFinish;
    },

});

module.exports.invite_user_info = invite_user_info;

let msg_get_user_invite_page_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.page = this.page;

        return content;
    },
    setPage(page){
        this.page = page;
    },

});

module.exports.msg_get_user_invite_page_req = msg_get_user_invite_page_req;

let msg_get_user_invite_page_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userListList = this.userListList;
        content.isLastPage = this.isLastPage;

        return content;
    },
    setUserListList(userListList){
        this.userListList = userListList;
    },
    setIsLastPage(isLastPage){
        this.isLastPage = isLastPage;
    },

});

module.exports.msg_get_user_invite_page_ret = msg_get_user_invite_page_ret;

let msg_invite_task_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.isOpen = this.isOpen;
        content.isInvitee = this.isInvitee;
        content.isFinishInviteTask = this.isFinishInviteTask;
        content.inviteActiveNum = this.inviteActiveNum;

        return content;
    },
    setIsOpen(isOpen){
        this.isOpen = isOpen;
    },
    setIsInvitee(isInvitee){
        this.isInvitee = isInvitee;
    },
    setIsFinishInviteTask(isFinishInviteTask){
        this.isFinishInviteTask = isFinishInviteTask;
    },
    setInviteActiveNum(inviteActiveNum){
        this.inviteActiveNum = inviteActiveNum;
    },

});

module.exports.msg_invite_task_info = msg_invite_task_info;

let msg_item_use_broadcast_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.itemDataId = this.itemDataId;
        content.title = this.title;
        content.content = this.content;

        return content;
    },
    setItemDataId(itemDataId){
        this.itemDataId = itemDataId;
    },
    setTitle(title){
        this.title = title;
    },
    setContent(content){
        this.content = content;
    },

});

module.exports.msg_item_use_broadcast_req = msg_item_use_broadcast_req;

let msg_item_use_broadcast_ret = cc.Class({
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

module.exports.msg_item_use_broadcast_ret = msg_item_use_broadcast_ret;

let hall_query_bind_req = cc.Class({
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

module.exports.hall_query_bind_req = hall_query_bind_req;

let hall_query_bind_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.playerid = this.playerid;
        content.name = this.name;
        content.headUrl = this.headUrl;
        content.retCode = this.retCode;

        return content;
    },
    setPlayerid(playerid){
        this.playerid = playerid;
    },
    setName(name){
        this.name = name;
    },
    setHeadUrl(headUrl){
        this.headUrl = headUrl;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },

});

module.exports.hall_query_bind_ret = hall_query_bind_ret;

let hall_bind_agent_req = cc.Class({
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

module.exports.hall_bind_agent_req = hall_bind_agent_req;

let hall_bind_agent_ret = cc.Class({
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

module.exports.hall_bind_agent_ret = hall_bind_agent_ret;

let msg_bind_account_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.type = this.type;
        content.mobile = this.mobile;
        content.password = this.password;
        content.mobileCode = this.mobileCode;

        return content;
    },
    setType(type){
        this.type = type;
    },
    setMobile(mobile){
        this.mobile = mobile;
    },
    setPassword(password){
        this.password = password;
    },
    setMobileCode(mobileCode){
        this.mobileCode = mobileCode;
    },

});

module.exports.msg_bind_account_req = msg_bind_account_req;

let msg_bind_account_ret = cc.Class({
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

module.exports.msg_bind_account_ret = msg_bind_account_ret;

let msg_modify_name_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.newName = this.newName;

        return content;
    },
    setNewName(newName){
        this.newName = newName;
    },

});

module.exports.msg_modify_name_req = msg_modify_name_req;

let msg_modify_name_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.newName = this.newName;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setNewName(newName){
        this.newName = newName;
    },

});

module.exports.msg_modify_name_ret = msg_modify_name_ret;

let msg_get_excite_game_record_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.index = this.index;
        content.gameType = this.gameType;

        return content;
    },
    setIndex(index){
        this.index = index;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },

});

module.exports.msg_get_excite_game_record_req = msg_get_excite_game_record_req;

let excite_value = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.value = this.value;
        content.value2 = this.value2;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setValue(value){
        this.value = value;
    },
    setValue2(value2){
        this.value2 = value2;
    },

});

module.exports.excite_value = excite_value;

let excite_game_record = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.issueNum = this.issueNum;
        content.rewardsList = this.rewardsList;
        content.betAreaList = this.betAreaList;
        content.rewardAreaList = this.rewardAreaList;
        content.bet = this.bet;
        content.win = this.win;

        return content;
    },
    setIssueNum(issueNum){
        this.issueNum = issueNum;
    },
    setRewardsList(rewardsList){
        this.rewardsList = rewardsList;
    },
    setBetAreaList(betAreaList){
        this.betAreaList = betAreaList;
    },
    setRewardAreaList(rewardAreaList){
        this.rewardAreaList = rewardAreaList;
    },
    setBet(bet){
        this.bet = bet;
    },
    setWin(win){
        this.win = win;
    },

});

module.exports.excite_game_record = excite_game_record;

let msg_get_excite_game_record_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.gameType = this.gameType;
        content.index = this.index;
        content.allNum = this.allNum;
        content.recordsList = this.recordsList;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setIndex(index){
        this.index = index;
    },
    setAllNum(allNum){
        this.allNum = allNum;
    },
    setRecordsList(recordsList){
        this.recordsList = recordsList;
    },

});

module.exports.msg_get_excite_game_record_ret = msg_get_excite_game_record_ret;

let msg_modify_head_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.newHead = this.newHead;

        return content;
    },
    setNewHead(newHead){
        this.newHead = newHead;
    },

});

module.exports.msg_modify_head_req = msg_modify_head_req;

let msg_modify_head_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.newHead = this.newHead;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setNewHead(newHead){
        this.newHead = newHead;
    },

});

module.exports.msg_modify_head_ret = msg_modify_head_ret;

let client_tree_info_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.client_tree_info_req = client_tree_info_req;

let client_tree_info_ack = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.treeId = this.treeId;
        content.coin = this.coin;
        content.time = this.time;

        return content;
    },
    setTreeId(treeId){
        this.treeId = treeId;
    },
    setCoin(coin){
        this.coin = coin;
    },
    setTime(time){
        this.time = time;
    },

});

module.exports.client_tree_info_ack = client_tree_info_ack;

let client_tree_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.treeId = this.treeId;

        return content;
    },
    setTreeId(treeId){
        this.treeId = treeId;
    },

});

module.exports.client_tree_req = client_tree_req;

let client_tree_ack = cc.Class({
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

module.exports.client_tree_ack = client_tree_ack;

let hall_fish_gift_notice = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.num = this.num;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setNum(num){
        this.num = num;
    },

});

module.exports.hall_fish_gift_notice = hall_fish_gift_notice;

let hall_req_fish_gift = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.roomid = this.roomid;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setRoomid(roomid){
        this.roomid = roomid;
    },

});

module.exports.hall_req_fish_gift = hall_req_fish_gift;

let hall_ack_fish_gift = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.id = this.id;
        content.num = this.num;
        content.giftNum = this.giftNum;
        content.count = this.count;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setId(id){
        this.id = id;
    },
    setNum(num){
        this.num = num;
    },
    setGiftNum(giftNum){
        this.giftNum = giftNum;
    },
    setCount(count){
        this.count = count;
    },

});

module.exports.hall_ack_fish_gift = hall_ack_fish_gift;

let hall_req_fish_gift_exchange = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.type = this.type;
        content.zfbAccount = this.zfbAccount;
        content.zfbUsername = this.zfbUsername;
        content.jdkAddr = this.jdkAddr;
        content.jdkPhone = this.jdkPhone;
        content.jdkUsername = this.jdkUsername;

        return content;
    },
    setId(id){
        this.id = id;
    },
    setType(type){
        this.type = type;
    },
    setZfbAccount(zfbAccount){
        this.zfbAccount = zfbAccount;
    },
    setZfbUsername(zfbUsername){
        this.zfbUsername = zfbUsername;
    },
    setJdkAddr(jdkAddr){
        this.jdkAddr = jdkAddr;
    },
    setJdkPhone(jdkPhone){
        this.jdkPhone = jdkPhone;
    },
    setJdkUsername(jdkUsername){
        this.jdkUsername = jdkUsername;
    },

});

module.exports.hall_req_fish_gift_exchange = hall_req_fish_gift_exchange;

let hall_ack_fish_gift_exchange = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.type = this.type;
        content.num = this.num;
        content.curUseCnt = this.curUseCnt;
        content.count = this.count;
        content.code = this.code;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setType(type){
        this.type = type;
    },
    setNum(num){
        this.num = num;
    },
    setCurUseCnt(curUseCnt){
        this.curUseCnt = curUseCnt;
    },
    setCount(count){
        this.count = count;
    },
    setCode(code){
        this.code = code;
    },

});

module.exports.hall_ack_fish_gift_exchange = hall_ack_fish_gift_exchange;

let log_gift_exchange = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.time = this.time;
        content.shopId = this.shopId;
        content.flag = this.flag;
        content.orderid = this.orderid;
        content.code = this.code;
        content.sendCode = this.sendCode;
        content.zfbAccount = this.zfbAccount;
        content.zfbUsername = this.zfbUsername;
        content.jdkAddr = this.jdkAddr;
        content.jdkPhone = this.jdkPhone;
        content.jdkUsername = this.jdkUsername;

        return content;
    },
    setTime(time){
        this.time = time;
    },
    setShopId(shopId){
        this.shopId = shopId;
    },
    setFlag(flag){
        this.flag = flag;
    },
    setOrderid(orderid){
        this.orderid = orderid;
    },
    setCode(code){
        this.code = code;
    },
    setSendCode(sendCode){
        this.sendCode = sendCode;
    },
    setZfbAccount(zfbAccount){
        this.zfbAccount = zfbAccount;
    },
    setZfbUsername(zfbUsername){
        this.zfbUsername = zfbUsername;
    },
    setJdkAddr(jdkAddr){
        this.jdkAddr = jdkAddr;
    },
    setJdkPhone(jdkPhone){
        this.jdkPhone = jdkPhone;
    },
    setJdkUsername(jdkUsername){
        this.jdkUsername = jdkUsername;
    },

});

module.exports.log_gift_exchange = log_gift_exchange;

let hall_req_log_gift_exchange = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.hall_req_log_gift_exchange = hall_req_log_gift_exchange;

let hall_ack_log_gift_exchange = cc.Class({
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

module.exports.hall_ack_log_gift_exchange = hall_ack_log_gift_exchange;

let activity_fish_gift = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.id = this.id;
        content.beginTime = this.beginTime;
        content.endTime = this.endTime;
        content.state = this.state;

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
    setState(state){
        this.state = state;
    },

});

module.exports.activity_fish_gift = activity_fish_gift;

let get_activity_fish_gift_notify = cc.Class({
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

module.exports.get_activity_fish_gift_notify = get_activity_fish_gift_notify;

let msg_activity_fish_gift_notify = cc.Class({
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

module.exports.msg_activity_fish_gift_notify = msg_activity_fish_gift_notify;

let msg_fish_wx = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.wx = this.wx;

        return content;
    },
    setWx(wx){
        this.wx = wx;
    },

});

module.exports.msg_fish_wx = msg_fish_wx;

