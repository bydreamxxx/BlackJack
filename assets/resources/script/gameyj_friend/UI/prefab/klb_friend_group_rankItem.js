cc.Class({
    extends: cc.Component,

    properties: {
        rankIcon:{
            default: null,
            type: cc.Sprite,
            tooltip: "排行图标"
        },
        rankLabel:{
            default: null,
            type: cc.Label,
            tooltip: "排行名次"
        },
        headSP:{
            default: null,
            type: require('klb_hall_Player_Head'),
            tooltip: "头像"
        },
        playerName:{
            default: null,
            type: cc.Label,
            tooltip: "名字"
        },
        info:{
            default: null,
            type: cc.Label,
            tooltip: "信息"
        },
        rankSpriteFrames:{
            default: [],
            type: cc.SpriteFrame,
            tooltip: "名次图集"
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    setData(info, rank) {
        if(rank > 2){
            this.rankIcon.node.active = false;
            this.rankLabel.node.active = true;
            this.rankLabel.string = (rank+1);
        }else{
            this.rankIcon.node.active = true;
            this.rankLabel.node.active = false;
            this.rankIcon.spriteFrame = this.rankSpriteFrames[rank];
        }

        this.playerName.string = cc.dd.Utils.subChineseStr(info.userName, 0 , 8);
        this.headSP.initHead(info.openId, info.headUrl);
        this.info.string = info.score+'局';
    },

    // update (dt) {},
});
