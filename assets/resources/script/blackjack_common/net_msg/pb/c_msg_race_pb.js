let match_race_info = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.matchId = this.matchId;
        content.signFeeList = this.signFeeList;
        content.isSign = this.isSign;
        content.openSignNum = this.openSignNum;
        content.name = this.name;
        content.opentime = this.opentime;
        content.describe = this.describe;
        content.poolNum = this.poolNum;
        content.joinNum = this.joinNum;
        content.minCoinNum = this.minCoinNum;
        content.icon = this.icon;
        content.gameType = this.gameType;

        return content;
    },
    setMatchId(matchId){
        this.matchId = matchId;
    },
    setSignFeeList(signFeeList){
        this.signFeeList = signFeeList;
    },
    setIsSign(isSign){
        this.isSign = isSign;
    },
    setOpenSignNum(openSignNum){
        this.openSignNum = openSignNum;
    },
    setName(name){
        this.name = name;
    },
    setOpentime(opentime){
        this.opentime = opentime;
    },
    setDescribe(describe){
        this.describe = describe;
    },
    setPoolNum(poolNum){
        this.poolNum = poolNum;
    },
    setJoinNum(joinNum){
        this.joinNum = joinNum;
    },
    setMinCoinNum(minCoinNum){
        this.minCoinNum = minCoinNum;
    },
    setIcon(icon){
        this.icon = icon;
    },
    setGameType(gameType){
        this.gameType = gameType;
    },

});

module.exports.match_race_info = match_race_info;

let msg_match_race_list_req = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};

        return content;
    },

});

module.exports.msg_match_race_list_req = msg_match_race_list_req;

let msg_match_race_list_ret = cc.Class({
    ctor(){
    },
    getContent(){
        let content = {};
        content.rankListList = this.rankListList;
        content.rank = this.rank;
        content.raceListList = this.raceListList;

        return content;
    },
    setRankListList(rankListList){
        this.rankListList = rankListList;
    },
    setRank(rank){
        this.rank = rank;
    },
    setRaceListList(raceListList){
        this.raceListList = raceListList;
    },

});

module.exports.msg_match_race_list_ret = msg_match_race_list_ret;

