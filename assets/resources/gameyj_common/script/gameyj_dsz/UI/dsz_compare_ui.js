// create by wj 2018/10/25
var playerMgr = require('dsz_player_mgr').DSZ_PlayerMgr.Instance();
var AudioManager = require('AudioManager');
const Prefix = 'gameyj_dsz/common/audio/';

cc.Class({
    extends: cc.Component,

    properties: {
        dragonBonesNode: sp.Skeleton,
        m_tPlayerNode: { default: [], type: cc.Node },
        m_nOrigX_1: 0,
        m_nOrigY_1: 0,
        m_nOrigX_2: 0,
        m_nOrigY_2: 0,
    },


    onLoad: function () {
    },

    //播发比牌效果
    playerCompareAct: function (userId, cmpId, winnerId, playerNode1, playerNode2, callFunc) {
        this.callBack = callFunc;
        this.node.active = true;
        this.playerNode1 = playerNode1;
        this.playerNode2 = playerNode2;

        this.endPos1 = playerNode1.getPosition();
        this.endPos2 = playerNode2.getPosition();
        this.setPlayerInfo(userId, cmpId);
        //播发比牌前置动画
        this.dragonBonesNode.node.active = true;
        this.dragonBonesNode.clearTracks();
        this.dragonBonesNode.setAnimation(0, 'VS', false);
        var self = this;

        var moveto1 = cc.moveTo(0.3, cc.v2(this.m_nOrigX_1, this.m_nOrigY_1));
        var moveto2 = cc.moveTo(0.3, cc.v2(this.m_nOrigX_2, this.m_nOrigY_2));
        self.m_tPlayerNode[0].runAction(moveto1);
        self.m_tPlayerNode[1].runAction(moveto2);


        this.node.runAction(cc.sequence(cc.delayTime(0.3), cc.callFunc(function () {
            self.node.runAction(cc.sequence(cc.delayTime(1.0), cc.callFunc(function () {
                self.playFailActive(userId, cmpId, winnerId, playerNode1, playerNode2);
            })));
        })));

    },

    //设置玩家数据
    setPlayerInfo: function (userId, cmpId) {
        var player = playerMgr.findPlayerByUserId(userId);
        if (player) {
            var commonData = player.getPlayerCommonInfo(); //获取通用数据

            var playerNode = this.m_tPlayerNode[0];
            this.m_nOrigX_1 = playerNode.x;
            this.m_nOrigY_1 = playerNode.y;

            playerNode.setPosition(this.endPos1);

            // playerNode.getChildByName('name').getComponent(cc.Label).string = cc.dd.Utils.substr( commonData.name, 0, 6 ); //玩家名字
            playerNode.getChildByName('coin').getComponent(cc.Label).string = this.playerNode1.getChildByName('coin').getComponent(cc.Label).string; //朋友场玩家进入默认为0
            cc.log('=======' + player.getPlayerGameInfo().curScore);

            var headNode = cc.dd.Utils.seekNodeByName(playerNode, 'headSp'); //头像设置
            headNode.getComponent('klb_hall_Player_Head').initHead(commonData.openId, commonData.headUrl, 'dsz_head_init');
            playerNode.active = true;
        }

        var playerCmp = playerMgr.findPlayerByUserId(cmpId);
        if (playerCmp) {
            var commonData = playerCmp.getPlayerCommonInfo(); //获取通用数据

            var playerNode = this.m_tPlayerNode[1];
            this.m_nOrigX_2 = playerNode.x;
            this.m_nOrigY_2 = playerNode.y;
            playerNode.setPosition(this.endPos2);

            //playerNode.getChildByName('name').getComponent(cc.Label).string = cc.dd.Utils.substr( commonData.name, 0, 6 ); //玩家名字
            playerNode.getChildByName('coin').getComponent(cc.Label).string = this.playerNode2.getChildByName('coin').getComponent(cc.Label).string; //朋友场玩家进入默认为0
            cc.log('=======111' + player.getPlayerGameInfo().curScore);

            var headNode = cc.dd.Utils.seekNodeByName(playerNode, 'headSp'); //头像设置
            headNode.getComponent('klb_hall_Player_Head').initHead(commonData.openId, commonData.headUrl, 'dsz_head_init');
            playerNode.active = true;
        }
    },

    //输了的动画
    playFailActive: function (userId, cmpId, winnerId) {
        AudioManager.getInstance().playSound(Prefix + 'comp_broken', false);
        var playerNode = null;
        if (userId != winnerId) {
            playerNode = this.m_tPlayerNode[0];
        } else {
            playerNode = this.m_tPlayerNode[1];
        }
        this.loseNode = playerNode.getChildByName('loseTag');
        this.loseNode.active = true;
        this.loseNode.getComponent(cc.Animation).play();
        //this.loseNode.getComponent(cc.Animation).on('finished', this.onClose, this);

        var self = this;
        setTimeout(function () {
            self.onClose();
        }, 1800);
    },

    onClose: function () {
        this.loseNode.active = false;
        this.loseNode.getComponent(cc.Animation).off('finished', this.onClose, this);
        this.node.getChildByName('root').active = false;

        this.m_tPlayerNode[0].runAction(cc.moveTo(0.3, this.endPos1));
        this.m_tPlayerNode[1].runAction(cc.sequence(cc.moveTo(0.3, this.endPos2), cc.callFunc(function () {
            this.playerNode1.getChildByName('headbg').active = true;
            this.playerNode2.getChildByName('headbg').active = true;
            this.m_tPlayerNode[0].setPosition(cc.v2(this.m_nOrigX_1, this.m_nOrigY_1));
            this.m_tPlayerNode[1].setPosition(cc.v2(this.m_nOrigX_2, this.m_nOrigY_2));
            this.node.getChildByName('root').active = true;
            this.node.active = false;
            if (this.callBack)
                this.callBack();
            cc._pauseLMAni = false;
            cc.dd.UIMgr.destroyUI(this.node);
        }.bind(this))));
        //cc.dd.UIMgr.destroyUI(this.node);

    },
});
