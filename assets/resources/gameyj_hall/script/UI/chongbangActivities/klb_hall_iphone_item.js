var hallData = require('hall_common_data').HallCommonData;

cc.Class({
    extends: cc.Component,

    properties: {
        rankTips: cc.Node,
        rankNum: cc.Label,
        playerName: cc.Label,
        score: cc.Label,
        headNode: cc.Node,
        headNodeSP: cc.Sprite,
    },

    initPlayerInfo(info) {
        this.headNodeSP.spriteFrame = null;
        this.headNode.getComponent('klb_hall_Player_Head').initHead(info.openId, info.headUrl);
        this.rankNum.string = info.rank;

        this.playerName.string = cc.dd.Utils.subChineseStr(info.name, 0, 14);
        this.score.string = cc.dd.Utils.getNumToWordTransform(info.score);
    },

    initSelfInfo(score, rank) {
        let userInfo = hallData.getInstance();
        this.headNode.getComponent('klb_hall_Player_Head').initHead(userInfo.openId, userInfo.headUrl);
        if (rank == -1 || rank > 100 || !cc.dd._.isNumber(rank)) {
            this.rankTips.active = true;
            this.rankNum.node.active = false;
        } else {
            this.rankTips.active = false;
            this.rankNum.node.active = true;
            this.rankNum.string = rank;
        }

        this.playerName.string = cc.dd.Utils.subChineseStr(userInfo.nick, 0, 14);
        this.score.string = cc.dd.Utils.getNumToWordTransform(cc.dd._.isNumber(score) ? score : 0);
    },

    init(){
        this.playerName.string = '';
        this.score.string = '';
    }
});
