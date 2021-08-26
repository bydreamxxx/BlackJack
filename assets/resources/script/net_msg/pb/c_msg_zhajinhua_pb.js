let msg_zhajinhua_match_2s = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.roomType = this.roomType;

        return content;
    },
    setRoomType(roomType){
        this.roomType = roomType;
    },

});

module.exports.msg_zhajinhua_match_2s = msg_zhajinhua_match_2s;

let msg_zhajinhua_match_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.roomType = this.roomType;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setRoomType(roomType){
        this.roomType = roomType;
    },

});

module.exports.msg_zhajinhua_match_2c = msg_zhajinhua_match_2c;

let msg_zhajinhua_quit_2s = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_zhajinhua_quit_2s = msg_zhajinhua_quit_2s;

let msg_zhajinhua_quit_2c = cc.Class({
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

module.exports.msg_zhajinhua_quit_2c = msg_zhajinhua_quit_2c;

let msg_zhajinhua_change_room_2s = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_zhajinhua_change_room_2s = msg_zhajinhua_change_room_2s;

let msg_zhajinhua_change_room_2c = cc.Class({
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

module.exports.msg_zhajinhua_change_room_2c = msg_zhajinhua_change_room_2c;

let nested_zhajinhua_player = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.site = this.site;
        content.playerId = this.playerId;
        content.playerName = this.playerName;
        content.sex = this.sex;
        content.gold = this.gold;
        content.clips = this.clips;
        content.betClips = this.betClips;
        content.cardState = this.cardState;
        content.cardsList = this.cardsList;
        content.playerState = this.playerState;
        content.autoSetClips = this.autoSetClips;
        content.openId = this.openId;
        content.headUrl = this.headUrl;
        content.isRobot = this.isRobot;

        return content;
    },
    setSite(site){
        this.site = site;
    },
    setPlayerId(playerId){
        this.playerId = playerId;
    },
    setPlayerName(playerName){
        this.playerName = playerName;
    },
    setSex(sex){
        this.sex = sex;
    },
    setGold(gold){
        this.gold = gold;
    },
    setClips(clips){
        this.clips = clips;
    },
    setBetClips(betClips){
        this.betClips = betClips;
    },
    setCardState(cardState){
        this.cardState = cardState;
    },
    setCardsList(cardsList){
        this.cardsList = cardsList;
    },
    setPlayerState(playerState){
        this.playerState = playerState;
    },
    setAutoSetClips(autoSetClips){
        this.autoSetClips = autoSetClips;
    },
    setOpenId(openId){
        this.openId = openId;
    },
    setHeadUrl(headUrl){
        this.headUrl = headUrl;
    },
    setIsRobot(isRobot){
        this.isRobot = isRobot;
    },

});

module.exports.nested_zhajinhua_player = nested_zhajinhua_player;

let msg_zhajinhua_room_info_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.roomType = this.roomType;
        content.roomState = this.roomState;
        content.stateBeginTime = this.stateBeginTime;
        content.playersList = this.playersList;
        content.bankerSite = this.bankerSite;
        content.opSite = this.opSite;
        content.round = this.round;
        content.tatolClips = this.tatolClips;
        content.minClips = this.minClips;
        content.remainTime = this.remainTime;

        return content;
    },
    setRoomType(roomType){
        this.roomType = roomType;
    },
    setRoomState(roomState){
        this.roomState = roomState;
    },
    setStateBeginTime(stateBeginTime){
        this.stateBeginTime = stateBeginTime;
    },
    setPlayersList(playersList){
        this.playersList = playersList;
    },
    setBankerSite(bankerSite){
        this.bankerSite = bankerSite;
    },
    setOpSite(opSite){
        this.opSite = opSite;
    },
    setRound(round){
        this.round = round;
    },
    setTatolClips(tatolClips){
        this.tatolClips = tatolClips;
    },
    setMinClips(minClips){
        this.minClips = minClips;
    },
    setRemainTime(remainTime){
        this.remainTime = remainTime;
    },

});

module.exports.msg_zhajinhua_room_info_2c = msg_zhajinhua_room_info_2c;

let msg_zhajinhua_player_enter_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.player = this.player;

        return content;
    },
    setPlayer(player){
        this.player = player;
    },

});

module.exports.msg_zhajinhua_player_enter_2c = msg_zhajinhua_player_enter_2c;

let msg_zhajinhua_player_quit_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.site = this.site;

        return content;
    },
    setSite(site){
        this.site = site;
    },

});

module.exports.msg_zhajinhua_player_quit_2c = msg_zhajinhua_player_quit_2c;

let msg_zhajinhua_state_change_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.roomState = this.roomState;

        return content;
    },
    setRoomState(roomState){
        this.roomState = roomState;
    },

});

module.exports.msg_zhajinhua_state_change_2c = msg_zhajinhua_state_change_2c;

let msg_zhajinhua_ready_2s = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_zhajinhua_ready_2s = msg_zhajinhua_ready_2s;

let msg_zhajinhua_ready_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.site = this.site;

        return content;
    },
    setSite(site){
        this.site = site;
    },

});

module.exports.msg_zhajinhua_ready_2c = msg_zhajinhua_ready_2c;

let msg_zhajinhua_join_game_sites_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.bankerSite = this.bankerSite;
        content.sitesList = this.sitesList;

        return content;
    },
    setBankerSite(bankerSite){
        this.bankerSite = bankerSite;
    },
    setSitesList(sitesList){
        this.sitesList = sitesList;
    },

});

module.exports.msg_zhajinhua_join_game_sites_2c = msg_zhajinhua_join_game_sites_2c;

let msg_zhajinhua_op_site_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.site = this.site;
        content.round = this.round;

        return content;
    },
    setSite(site){
        this.site = site;
    },
    setRound(round){
        this.round = round;
    },

});

module.exports.msg_zhajinhua_op_site_2c = msg_zhajinhua_op_site_2c;

let msg_zhajinhua_op_2s = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.op = this.op;
        content.value = this.value;

        return content;
    },
    setOp(op){
        this.op = op;
    },
    setValue(value){
        this.value = value;
    },

});

module.exports.msg_zhajinhua_op_2s = msg_zhajinhua_op_2s;

let msg_zhajinhua_op_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.site = this.site;
        content.op = this.op;
        content.value = this.value;
        content.costCoin = this.costCoin;
        content.cardsList = this.cardsList;
        content.winSite = this.winSite;
        content.tatolClips = this.tatolClips;
        content.minClips = this.minClips;

        return content;
    },
    setSite(site){
        this.site = site;
    },
    setOp(op){
        this.op = op;
    },
    setValue(value){
        this.value = value;
    },
    setCostCoin(costCoin){
        this.costCoin = costCoin;
    },
    setCardsList(cardsList){
        this.cardsList = cardsList;
    },
    setWinSite(winSite){
        this.winSite = winSite;
    },
    setTatolClips(tatolClips){
        this.tatolClips = tatolClips;
    },
    setMinClips(minClips){
        this.minClips = minClips;
    },

});

module.exports.msg_zhajinhua_op_2c = msg_zhajinhua_op_2c;

let nested_zhajinhua_back_clip = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.site = this.site;
        content.clips = this.clips;
        content.newClips = this.newClips;

        return content;
    },
    setSite(site){
        this.site = site;
    },
    setClips(clips){
        this.clips = clips;
    },
    setNewClips(newClips){
        this.newClips = newClips;
    },

});

module.exports.nested_zhajinhua_back_clip = nested_zhajinhua_back_clip;

let nested_zhajinhua_result = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.site = this.site;
        content.winClips = this.winClips;
        content.newClips = this.newClips;
        content.cardsList = this.cardsList;
        content.specialAward = this.specialAward;
        content.backClips = this.backClips;

        return content;
    },
    setSite(site){
        this.site = site;
    },
    setWinClips(winClips){
        this.winClips = winClips;
    },
    setNewClips(newClips){
        this.newClips = newClips;
    },
    setCardsList(cardsList){
        this.cardsList = cardsList;
    },
    setSpecialAward(specialAward){
        this.specialAward = specialAward;
    },
    setBackClips(backClips){
        this.backClips = backClips;
    },

});

module.exports.nested_zhajinhua_result = nested_zhajinhua_result;

let msg_zhajinhua_result_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.type = this.type;
        content.winSitesList = this.winSitesList;
        content.resultsList = this.resultsList;

        return content;
    },
    setType(type){
        this.type = type;
    },
    setWinSitesList(winSitesList){
        this.winSitesList = winSitesList;
    },
    setResultsList(resultsList){
        this.resultsList = resultsList;
    },

});

module.exports.msg_zhajinhua_result_2c = msg_zhajinhua_result_2c;

let msg_zhajinhua_set_anto_clips_2s = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.clips = this.clips;

        return content;
    },
    setClips(clips){
        this.clips = clips;
    },

});

module.exports.msg_zhajinhua_set_anto_clips_2s = msg_zhajinhua_set_anto_clips_2s;

let msg_zhajinhua_set_anto_clips_2c = cc.Class({
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

module.exports.msg_zhajinhua_set_anto_clips_2c = msg_zhajinhua_set_anto_clips_2c;

let msg_zhajinhua_clips_update_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.site = this.site;
        content.clips = this.clips;
        content.gold = this.gold;
        content.autoSetClips = this.autoSetClips;

        return content;
    },
    setSite(site){
        this.site = site;
    },
    setClips(clips){
        this.clips = clips;
    },
    setGold(gold){
        this.gold = gold;
    },
    setAutoSetClips(autoSetClips){
        this.autoSetClips = autoSetClips;
    },

});

module.exports.msg_zhajinhua_clips_update_2c = msg_zhajinhua_clips_update_2c;

let msg_zhajinhua_dashang_2s = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_zhajinhua_dashang_2s = msg_zhajinhua_dashang_2s;

let msg_zhajinhua_dashang_2c = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.site = this.site;
        content.newClips = this.newClips;

        return content;
    },
    setSite(site){
        this.site = site;
    },
    setNewClips(newClips){
        this.newClips = newClips;
    },

});

module.exports.msg_zhajinhua_dashang_2c = msg_zhajinhua_dashang_2c;

