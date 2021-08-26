let MEMBER = require('klb_friend_group_enum').MEMBER;

cc.Class({
    extends: cc.Component,

    properties: {
        headNode: cc.Node,
        playername: cc.Label,
        specialNode: cc.Node,
        specialSprite: [cc.SpriteFrame],

        headSprite: cc.Sprite,
        bgSprite: cc.Sprite,
        iconSprite: cc.Sprite,
        defaultHead: cc.SpriteFrame,
    },

    //初始化玩家数据信息
    initPlayerInfo: function(clubId, player, status){
        this.playerData = player;
        this.clubId = clubId;
        this.status = status;

        //名字
        this.playername.string = cc.dd.Utils.subChineseStr(player.name, 0 , 14);

        this.headNode.getComponent('klb_hall_Player_Head').initHead(player.openid, player.headurl);
        if(player.openid == '' || player.headurl == ''){
            this.headSprite.spriteFrame = this.defaultHead;
        }

        this.specialNode.active = player.job != MEMBER.NORMAL;

        if(player.job == MEMBER.OWNER){
            this.specialNode.getComponent(cc.Sprite).spriteFrame = this.specialSprite[0];//群主
        }else if(player.job == MEMBER.ADMIN){
            this.specialNode.getComponent(cc.Sprite).spriteFrame = this.specialSprite[1];//管理员
        }

        if(player.isonline == 2){
            this.headSprite._sgNode.setState(1);
            this.bgSprite._sgNode.setState(1);
            this.iconSprite._sgNode.setState(1);
            this.playername.node.color = cc.Color.GRAY;
        }else{
            this.headSprite._sgNode.setState(0);
            this.bgSprite._sgNode.setState(0);
            this.iconSprite._sgNode.setState(0);
            this.playername.node.color = new cc.Color(165, 79, 47);
        }
    },
});
