// create by wj 2018/10/25
var playerMgr = require('dsz_player_mgr').DSZ_PlayerMgr.Instance();
var config_state = require('dsz_config').DSZ_UserState;
var AudioManager = require('AudioManager');
const Prefix = 'gameyj_dsz/common/audio/';

cc.Class({
    extends: cc.Component,

    properties: {
        dragonBonesNode: sp.Skeleton,
        m_tPlayerNode: { default: [], type: cc.Node },
        m_nCmpPlayerCount: 0,
        m_tOriginPos: [],
        m_tEndPos: [],
        m_oOwnPlayerNode: cc.Node,
        m_tPlayerPosNode: [],
    },


    onLoad: function () {
    },

    //播发比牌效果

    playerAllInAct: function (userId, isWin, ownPlayerNode, tPlayerNode, callBack) {
        this.callBack = callBack;
        this.m_tOriginPos.splice(0, this.m_tOriginPos.length);
        this.m_tEndPos.splice(0, this.m_tEndPos.length);
        this.m_tPlayerPosNode.splice(0, this.m_tPlayerPosNode.length);
        this.m_oOwnPlayerNode = ownPlayerNode;
        this.m_tPlayerPosNode = tPlayerNode;
        this.setPlayerInfo(userId, ownPlayerNode, tPlayerNode);
        //播发比牌前置动画
        this.dragonBonesNode.clearTracks();
        this.dragonBonesNode.setAnimation(0, 'VS', false);
        for (var i = 0; i < this.m_tOriginPos.length; i++) {
            // this.m_tPlayerNode[i].runAction(cc.moveTo(0.3, this.m_tOriginPos[i]));
            cc.tween(this.m_tPlayerNode[i])
                .to(0.3, { position: this.m_tOriginPos[i] })
                .start();
        }
        // this.node.runAction(cc.sequence(cc.delayTime(1.3), cc.callFunc(function () {
        //     this.playFailActive(userId, isWin, ownPlayerNode, tPlayerNode);
        // }.bind(this))));
        cc.tween(this.node)
            .delay(1.3)
            .call(function () {
                this.playFailActive(userId, isWin, ownPlayerNode, tPlayerNode);
            }.bind(this))
            .start();

        // var self = this;
        // this.dragonBonesNode.setCompleteListener(function () {
        //     cc.dd.UIMgr.destroyUI(self.node);
        // });
        // this.node.runAction(cc.sequence( cc.delayTime(0.3), cc.callFunc(function () {
        //     for(var i = 0; i <= self.m_nCmpPlayerCount; i++){
        //         self.m_tPlayerNode[i].active = true;
        //     }
        //     self.node.runAction(cc.sequence( cc.delayTime(1.0), cc.callFunc(function () {
        //         self.playFailActive(userId, isWin);
        //     })));
        // })));

        // this.setPlayerInfo(userId, ownPlayerNode, tPlayerNode);
    },

    //设置玩家数据
    setPlayerInfo: function (userId, ownPlayerNode, tPlayerNode) {
        var player = playerMgr.findPlayerByUserId(userId);
        if (player) {
            var commonData = player.getPlayerCommonInfo(); //获取通用数据

            var playerNode = this.m_tPlayerNode[0];
            playerNode.active = true;

            var originPos = playerNode.getPosition();
            this.m_tOriginPos.push(originPos);

            playerNode.setPosition(ownPlayerNode.getPosition());
            this.m_tEndPos.push(ownPlayerNode.getPosition());

            playerNode.getChildByName('coin').getComponent(cc.Label).string = ownPlayerNode.getChildByName('coin').getComponent(cc.Label).string; //朋友场玩家进入默认为0

            var headNode = cc.dd.Utils.seekNodeByName(playerNode, 'headSp'); //头像设置
            headNode.getComponent('klb_hall_Player_Head').initHead(commonData.openId, commonData.headUrl, 'dsz_head_init');
        }

        tPlayerNode.forEach(function (playerPosNode, index) {
            var gameData = playerPosNode.getComponent('dsz_player_ui').m_tPlayerData;
            var commonData = playerMgr.findPlayerByUserId(gameData.userId).getPlayerCommonInfo(); //获取通用数据
            var playerNode = this.m_tPlayerNode[index + 1];
            playerNode.active = true;

            var originPos = playerNode.getPosition();
            this.m_tOriginPos.push(originPos);

            playerNode.setPosition(playerPosNode.getPosition());
            this.m_tEndPos.push(playerPosNode.getPosition());

            playerNode.getChildByName('coin').getComponent(cc.Label).string = playerPosNode.getChildByName('coin').getComponent(cc.Label).string; //朋友场玩家进入默认为0

            var headNode = cc.dd.Utils.seekNodeByName(playerNode, 'headSp'); //头像设置
            headNode.getComponent('klb_hall_Player_Head').initHead(commonData.openId, commonData.headUrl, 'dsz_head_init');


        }.bind(this));

        // playerMgr.playerInfo.forEach(function(playerCmp, index) {
        //     if(playerCmp.userId != userId){
        //         var gameData = playerCmp.getPlayerGameInfo();

        //         if(gameData.userState != config_state.UserStateFold && gameData.userState != config_state.UserStateLost && gameData.userState != config_state.UserStateWait ){
        //             this.m_nCmpPlayerCount += 1;
        //             var commonData = playerCmp.getPlayerCommonInfo(); //获取通用数据

        //             var playerNode = this.m_tPlayerNode[index + 1];

        //             playerNode.getChildByName('coin').getComponent(cc.Label).string = playerCmp.getPlayerGameInfo().curScore; //朋友场玩家进入默认为0

        //             var headNode = cc.dd.Utils.seekNodeByName(playerNode, 'headSp'); //头像设置
        //             headNode.getComponent('klb_hall_Player_Head').initHead(commonData.openId, commonData.headUrl, 'dsz_head_init');
        //         }
        //     }

        // }.bind(this));

    },

    //输了的动画
    playFailActive: function (userId, isWin, ownPlayerNode, tPlayerNode) {
        AudioManager.getInstance().playSound(Prefix + 'comp_broken', false);
        if (!isWin) {
            var playerNode = this.m_tPlayerNode[0];
            this.loseNode = playerNode.getChildByName('loseTag');
            this.loseNode.active = true;
            this.loseNode.getComponent(cc.Animation).play();
            this.loseNode.getComponent(cc.Animation).on('finished', this.onClose, this);
        } else {
            for (var i = 1; i < this.m_tPlayerNode.length; i++) {
                var playerNode = this.m_tPlayerNode[i];
                var loseNode = playerNode.getChildByName('loseTag');
                loseNode.active = true;
                loseNode.getComponent(cc.Animation).play();

                if (i == this.m_tPlayerNode.length - 1) {
                    this.loseNode = loseNode;
                    this.loseNode.getComponent(cc.Animation).on('finished', this.onClose, this);
                }
            }
        }
    },


    onClose: function () {
        this.loseNode.active = false;
        this.loseNode.getComponent(cc.Animation).off('finished', this.onClose, this);
        this.node.getChildByName('root').active = false;

        var index = 0;
        for (var i = 0; i < this.m_tEndPos.length; i++) {
            // this.m_tPlayerNode[i].runAction(cc.sequence(cc.moveTo(0.3, this.m_tEndPos[i]), cc.callFunc(function () {
            //     this.m_tPlayerNode[index].getChildByName('loseTag').active = false;
            //     if (index == 0)
            //         this.m_oOwnPlayerNode.getChildByName('headbg').active = true;
            //     else
            //         this.m_tPlayerPosNode[index - 1].getChildByName('headbg').active = true;
            //     this.m_tPlayerNode[index].setPosition(this.m_tOriginPos[index]);
            //     this.m_tPlayerNode[index].active = false;
            //     if (index == this.m_tEndPos.length - 1) {
            //         this.node.getChildByName('root').active = true;
            //         this.node.active = false;
            //         if (this.callBack)
            //             this.callBack();
            //     }
            //     cc._pauseLMAni = false;
            //     cc.dd.UIMgr.destroyUI(this.node);
            //     index = index + 1;
            // }.bind(this))));

            cc.tween(this.m_tPlayerNode[i])
                .to(0.3, { position: this.m_tEndPos[i] })
                .call(function () {
                    this.m_tPlayerNode[index].getChildByName('loseTag').active = false;
                    if (index == 0)
                        this.m_oOwnPlayerNode.getChildByName('headbg').active = true;
                    else
                        this.m_tPlayerPosNode[index - 1].getChildByName('headbg').active = true;
                    this.m_tPlayerNode[index].setPosition(this.m_tOriginPos[index]);
                    this.m_tPlayerNode[index].active = false;
                    if (index == this.m_tEndPos.length - 1) {
                        this.node.getChildByName('root').active = true;
                        this.node.active = false;
                        if (this.callBack)
                            this.callBack();
                    }
                    cc._pauseLMAni = false;
                    cc.dd.UIMgr.destroyUI(this.node);
                    index = index + 1;
                }.bind(this))
                .start();
        }
    },
});
