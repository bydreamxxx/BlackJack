let msg_match_start = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.gameType = this.gameType;
        content.matchType = this.matchType;
        content.matchId = this.matchId;

        return content;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setMatchType(matchType){
        this.matchType = matchType;
    },
    setMatchId(matchId){
        this.matchId = matchId;
    },

});

module.exports.msg_match_start = msg_match_start;

let msg_match_round_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.roundType = this.roundType;
        content.curGame = this.curGame;
        content.gameNum = this.gameNum;
        content.lastScore = this.lastScore;
        content.nowScore = this.nowScore;
        content.upNum = this.upNum;
        content.roundNum = this.roundNum;
        content.outScore = this.outScore;

        return content;
    },
    setRoundType(roundType){
        this.roundType = roundType;
    },
    setCurGame(curGame){
        this.curGame = curGame;
    },
    setGameNum(gameNum){
        this.gameNum = gameNum;
    },
    setLastScore(lastScore){
        this.lastScore = lastScore;
    },
    setNowScore(nowScore){
        this.nowScore = nowScore;
    },
    setUpNum(upNum){
        this.upNum = upNum;
    },
    setRoundNum(roundNum){
        this.roundNum = roundNum;
    },
    setOutScore(outScore){
        this.outScore = outScore;
    },

});

module.exports.msg_match_round_info = msg_match_round_info;

let msg_match_rank_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.rank = this.rank;
        content.leftPlayerNum = this.leftPlayerNum;

        return content;
    },
    setRank(rank){
        this.rank = rank;
    },
    setLeftPlayerNum(leftPlayerNum){
        this.leftPlayerNum = leftPlayerNum;
    },

});

module.exports.msg_match_rank_info = msg_match_rank_info;

let msg_match_round_num_full = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_match_round_num_full = msg_match_round_num_full;

let msg_match_round_end_line_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_match_round_end_line_req = msg_match_round_end_line_req;

let msg_match_round_end_line_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.rank = this.rank;
        content.leftPlayerNum = this.leftPlayerNum;
        content.leftDeskNum = this.leftDeskNum;
        content.roundType = this.roundType;
        content.roundNum = this.roundNum;
        content.gameType = this.gameType;
        content.curScore = this.curScore;

        return content;
    },
    setRank(rank){
        this.rank = rank;
    },
    setLeftPlayerNum(leftPlayerNum){
        this.leftPlayerNum = leftPlayerNum;
    },
    setLeftDeskNum(leftDeskNum){
        this.leftDeskNum = leftDeskNum;
    },
    setRoundType(roundType){
        this.roundType = roundType;
    },
    setRoundNum(roundNum){
        this.roundNum = roundNum;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setCurScore(curScore){
        this.curScore = curScore;
    },

});

module.exports.msg_match_round_end_line_ret = msg_match_round_end_line_ret;

let msg_match_round_end_line = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.rank = this.rank;
        content.leftPlayerNum = this.leftPlayerNum;
        content.leftDeskNum = this.leftDeskNum;
        content.roundType = this.roundType;
        content.roundNum = this.roundNum;
        content.gameType = this.gameType;
        content.curScore = this.curScore;
        content.matchType = this.matchType;

        return content;
    },
    setRank(rank){
        this.rank = rank;
    },
    setLeftPlayerNum(leftPlayerNum){
        this.leftPlayerNum = leftPlayerNum;
    },
    setLeftDeskNum(leftDeskNum){
        this.leftDeskNum = leftDeskNum;
    },
    setRoundType(roundType){
        this.roundType = roundType;
    },
    setRoundNum(roundNum){
        this.roundNum = roundNum;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },
    setCurScore(curScore){
        this.curScore = curScore;
    },
    setMatchType(matchType){
        this.matchType = matchType;
    },

});

module.exports.msg_match_round_end_line = msg_match_round_end_line;

let msg_match_reward_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.rewardList = this.rewardList;
        content.text = this.text;

        return content;
    },
    setRewardList(rewardList){
        this.rewardList = rewardList;
    },
    setText(text){
        this.text = text;
    },

});

module.exports.msg_match_reward_info = msg_match_reward_info;

let msg_match_end = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.rank = this.rank;
        content.reward = this.reward;
        content.matchId = this.matchId;
        content.name = this.name;
        content.matchType = this.matchType;
        content.bounsNum = this.bounsNum;
        content.beatNum = this.beatNum;
        content.bounsAll = this.bounsAll;

        return content;
    },
    setRank(rank){
        this.rank = rank;
    },
    setReward(reward){
        this.reward = reward;
    },
    setMatchId(matchId){
        this.matchId = matchId;
    },
    setName(name){
        this.name = name;
    },
    setMatchType(matchType){
        this.matchType = matchType;
    },
    setBounsNum(bounsNum){
        this.bounsNum = bounsNum;
    },
    setBeatNum(beatNum){
        this.beatNum = beatNum;
    },
    setBounsAll(bounsAll){
        this.bounsAll = bounsAll;
    },

});

module.exports.msg_match_end = msg_match_end;

let match_wx_share_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.match_wx_share_req = match_wx_share_req;

let match_wx_share_ret = cc.Class({
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

module.exports.match_wx_share_ret = match_wx_share_ret;

let msg_room_update_score = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.curScore = this.curScore;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setCurScore(curScore){
        this.curScore = curScore;
    },

});

module.exports.msg_room_update_score = msg_room_update_score;

let msg_match_round_countdown = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.seconds = this.seconds;
        content.nextRoundNum = this.nextRoundNum;

        return content;
    },
    setSeconds(seconds){
        this.seconds = seconds;
    },
    setNextRoundNum(nextRoundNum){
        this.nextRoundNum = nextRoundNum;
    },

});

module.exports.msg_match_round_countdown = msg_match_round_countdown;

let msg_is_match_shared = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.isShare = this.isShare;

        return content;
    },
    setIsShare(isShare){
        this.isShare = isShare;
    },

});

module.exports.msg_is_match_shared = msg_is_match_shared;

let msg_h2g_room_update_score = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.roomId = this.roomId;
        content.userId = this.userId;
        content.addScore = this.addScore;
        content.reason = this.reason;

        return content;
    },
    setRoomId(roomId){
        this.roomId = roomId;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setAddScore(addScore){
        this.addScore = addScore;
    },
    setReason(reason){
        this.reason = reason;
    },

});

module.exports.msg_h2g_room_update_score = msg_h2g_room_update_score;

let msg_match_round_null = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_match_round_null = msg_match_round_null;

let msg_get_match_reward_pool_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.matchId = this.matchId;

        return content;
    },
    setMatchId(matchId){
        this.matchId = matchId;
    },

});

module.exports.msg_get_match_reward_pool_req = msg_get_match_reward_pool_req;

let msg_get_match_reward_pool_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.matchId = this.matchId;
        content.poolNum = this.poolNum;
        content.rewardRank = this.rewardRank;
        content.rewardList = this.rewardList;

        return content;
    },
    setMatchId(matchId){
        this.matchId = matchId;
    },
    setPoolNum(poolNum){
        this.poolNum = poolNum;
    },
    setRewardRank(rewardRank){
        this.rewardRank = rewardRank;
    },
    setRewardList(rewardList){
        this.rewardList = rewardList;
    },

});

module.exports.msg_get_match_reward_pool_ret = msg_get_match_reward_pool_ret;

let msg_match_dead_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.signFeeList = this.signFeeList;

        return content;
    },
    setSignFeeList(signFeeList){
        this.signFeeList = signFeeList;
    },

});

module.exports.msg_match_dead_ret = msg_match_dead_ret;

let msg_match_reborn_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.matchId = this.matchId;

        return content;
    },
    setMatchId(matchId){
        this.matchId = matchId;
    },

});

module.exports.msg_match_reborn_req = msg_match_reborn_req;

let msg_match_reborn_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.matchId = this.matchId;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setMatchId(matchId){
        this.matchId = matchId;
    },

});

module.exports.msg_match_reborn_ret = msg_match_reborn_ret;

let msg_match_join_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.matchId = this.matchId;

        return content;
    },
    setMatchId(matchId){
        this.matchId = matchId;
    },

});

module.exports.msg_match_join_req = msg_match_join_req;

let msg_match_join_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.matchId = this.matchId;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setMatchId(matchId){
        this.matchId = matchId;
    },

});

module.exports.msg_match_join_ret = msg_match_join_ret;

let msg_user_match_rank_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.rankId = this.rankId;
        content.matchName = this.matchName;
        content.userRank = this.userRank;
        content.startTime = this.startTime;
        content.reward = this.reward;

        return content;
    },
    setRankId(rankId){
        this.rankId = rankId;
    },
    setMatchName(matchName){
        this.matchName = matchName;
    },
    setUserRank(userRank){
        this.userRank = userRank;
    },
    setStartTime(startTime){
        this.startTime = startTime;
    },
    setReward(reward){
        this.reward = reward;
    },

});

module.exports.msg_user_match_rank_info = msg_user_match_rank_info;

let msg_get_match_rank_history_list_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_get_match_rank_history_list_req = msg_get_match_rank_history_list_req;

let msg_get_match_rank_history_list_ret = cc.Class({
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

module.exports.msg_get_match_rank_history_list_ret = msg_get_match_rank_history_list_ret;

let msg_get_match_rank_history_detail_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.rankId = this.rankId;

        return content;
    },
    setRankId(rankId){
        this.rankId = rankId;
    },

});

module.exports.msg_get_match_rank_history_detail_req = msg_get_match_rank_history_detail_req;

let msg_user_match_detail = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userName = this.userName;
        content.userHead = this.userHead;
        content.userRank = this.userRank;
        content.reward = this.reward;

        return content;
    },
    setUserName(userName){
        this.userName = userName;
    },
    setUserHead(userHead){
        this.userHead = userHead;
    },
    setUserRank(userRank){
        this.userRank = userRank;
    },
    setReward(reward){
        this.reward = reward;
    },

});

module.exports.msg_user_match_detail = msg_user_match_detail;

let msg_get_match_rank_history_detail_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.retCode = this.retCode;
        content.detailList = this.detailList;

        return content;
    },
    setRetCode(retCode){
        this.retCode = retCode;
    },
    setDetailList(detailList){
        this.detailList = detailList;
    },

});

module.exports.msg_get_match_rank_history_detail_ret = msg_get_match_rank_history_detail_ret;

let msg_match_win_result = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.userId = this.userId;
        content.winScore = this.winScore;

        return content;
    },
    setUserId(userId){
        this.userId = userId;
    },
    setWinScore(winScore){
        this.winScore = winScore;
    },

});

module.exports.msg_match_win_result = msg_match_win_result;

let msg_match_room_win_result = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.winResultList = this.winResultList;

        return content;
    },
    setWinResultList(winResultList){
        this.winResultList = winResultList;
    },

});

module.exports.msg_match_room_win_result = msg_match_room_win_result;

