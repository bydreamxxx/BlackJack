// create by wj 2019/04/11
var playerMgr = require('new_dsz_player_manager').New_DSZ_PlayerMgr.Instance();
var AudioManager = require('AudioManager');

cc.Class({
    extends: cc.Component,

    properties: {
        dragonBonesNode: {default:[], type: sp.Skeleton},
        m_tPlayerNode:{default:[], type: cc.Node},
    },

    onLoad () {},

    //播发比牌效果
    playerCompareAct: function(userId, cmpId, winnerId, callFunc){
        this.callBack = callFunc;
        this.node.active = true;
        var self = this;

        //播发比牌前置动画
        this.dragonBonesNode[0].node.active = true;
        this.dragonBonesNode[0].clearTracks();
        this.dragonBonesNode[0].setAnimation(0,'xia',false);
        this.dragonBonesNode[0].setCompleteListener(function(){
            self.onClose();
        });

        this.dragonBonesNode[1].node.active = true;
        this.dragonBonesNode[1].clearTracks();
        this.dragonBonesNode[1].setAnimation(0,'shang',false);


        this.node.runAction(cc.sequence( cc.delayTime(0.4), cc.callFunc(function () {
            if(userId == winnerId)
                self.setPlayerInfo(userId, cmpId);
            else
                self.setPlayerInfo(cmpId, userId);
        })));

    },

    //设置玩家数据
    setPlayerInfo: function(userId, cmpId){
        var player = playerMgr.findPlayerByUserId(userId);
        if(player){
            var commonData = player.getPlayerCommonInfo(); //获取通用数据
            
            var playerNode = this.m_tPlayerNode[0];


            playerNode.getChildByName('name').getComponent(cc.Label).string = cc.dd.Utils.substr( commonData.name, 0, 2 ); //玩家名字            
            var headNode = cc.dd.Utils.seekNodeByName(playerNode, 'headNode'); //头像设置
            headNode.getComponent('klb_hall_Player_Head').initHead(commonData.openId, commonData.headUrl, 'dsz_head_init');
            playerNode.active = true;
        }

        var playerCmp = playerMgr.findPlayerByUserId(cmpId);
        if(playerCmp){
            var commonData = playerCmp.getPlayerCommonInfo(); //获取通用数据
            
            var playerNode = this.m_tPlayerNode[1];
            playerNode.getChildByName('name').getComponent(cc.Label).string = cc.dd.Utils.substr( commonData.name, 0, 2 ); //玩家名字

            var headNode = cc.dd.Utils.seekNodeByName(playerNode, 'headNode'); //头像设置
            headNode.getComponent('klb_hall_Player_Head').initHead(commonData.openId, commonData.headUrl, 'dsz_head_init');
            playerNode.active = true;
        }
    },

    onClose: function(){
        if(this.callBack)
            this.callBack();
        cc._pauseLMAni = false;
        cc.dd.UIMgr.destroyUI(this.node);
    },
});
