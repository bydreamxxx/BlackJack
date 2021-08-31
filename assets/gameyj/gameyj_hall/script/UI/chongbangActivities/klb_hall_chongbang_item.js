var hallData = require('hall_common_data').HallCommonData;

cc.Class({
    extends: cc.Component,

    properties: {
        rankIcon: cc.Sprite,
        rankNum: cc.Label,
        playerName: cc.Label,
        score: cc.Label,
        headNode: cc.Node,
        headNodeSP: cc.Sprite,

        rankSpriteFrames: [cc.SpriteFrame],
    },

    initPlayerInfo(info) {
        this.headNodeSP.spriteFrame = null;
        this.headNode.getComponent('klb_hall_Player_Head').initHead(info.openId, info.headUrl);
        if (info.rank > 3) {
            this.rankIcon.node.active = false;
            this.rankNum.node.active = true;
            this.rankNum.string = info.rank;
        } else {
            this.rankIcon.node.active = true;
            this.rankNum.node.active = false;
            this.rankIcon.spriteFrame = this.rankSpriteFrames[info.rank - 1];
        }

        this.playerName.string = cc.dd.Utils.subChineseStr(info.name, 0, 14);
        this.score.string = cc.dd.Utils.getNumToWordTransform(info.score);
    },

    initSelfInfo(score, rank) {
        let userInfo = hallData.getInstance();
        this.headNode.getComponent('klb_hall_Player_Head').initHead(userInfo.openId, userInfo.headUrl);
        if (rank > 3) {
            this.rankIcon.node.active = false;
            this.rankNum.node.active = true;
            this.rankNum.string = rank;
        } else if (rank == -1 || rank > 50 || !cc.dd._.isNumber(rank)) {
            this.rankIcon.node.active = false;
            this.rankNum.node.active = true;
            this.rankNum.string = '未上榜';
        } else {
            this.rankIcon.node.active = true;
            this.rankNum.node.active = false;
            this.rankIcon.spriteFrame = this.rankSpriteFrames[rank - 1];
        }

        this.playerName.string = cc.dd.Utils.subChineseStr(userInfo.nick, 0, 14);
        this.score.string = cc.dd.Utils.getNumToWordTransform(cc.dd._.isNumber(score) ? score : 0);
    },
});