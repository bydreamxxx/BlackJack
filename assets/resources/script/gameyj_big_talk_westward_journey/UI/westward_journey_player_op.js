// create by wj 2020/05/04
var game_Data = require('westward_journey_data_mannager').Westward_Journey_Data.Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        m_oStartPosX: 0,
        m_oStartPosY: 0,
        m_bAct: false,
        m_oChipNode: cc.Node,
    },

    onLoad() {
        this.m_oStartPosX = this.node.x;
        this.m_oStartPosY = this.node.y;

    },

    onDestroy: function () {
    },


    playPlayerBetAct: function (info) {
        var player = game_Data.findPlayerByUserId(info.userId);
        if (player) {
            var self = this;
            cc.log('rank=================' + (player.rank - 1));
            if (!this.m_bAct) {

                var act = null;
                if ((player.rank - 1) % 2 != 0) {
                    act = cc.sequence(cc.moveTo(0.1, cc.v2(self.m_oStartPosX - 20, self.m_oStartPosY)), cc.delayTime(0.08), cc.callFunc(function () {
                        self.m_oChipNode.getComponent('westward_journey_chip_manager').playerBetAct(player.rank, info.betId, info.bet, 0, true); //下注动画
                        self.node.getChildByName('coin').getComponent(cc.Label).string = self.convertChipNum(player.coin, 1); //更新玩家身上金币
                        self.node.runAction(cc.moveTo(0.1, cc.v2(self.m_oStartPosX, self.m_oStartPosY)));
                        self.m_bAct = false;
                    }));
                } else {
                    act = cc.sequence(cc.moveTo(0.1, cc.v2(self.m_oStartPosX + 20, self.m_oStartPosY)), cc.delayTime(0.08), cc.callFunc(function () {
                        self.m_oChipNode.getComponent('westward_journey_chip_manager').playerBetAct(player.rank, info.betId, info.bet, 0, true); //下注动画
                        self.node.getChildByName('coin').getComponent(cc.Label).string = self.convertChipNum(player.coin, 1); //更新玩家身上金币
                        self.node.runAction(cc.moveTo(0.1, cc.v2(self.m_oStartPosX, self.m_oStartPosY)));
                        self.m_bAct = false;
                    }));
                }

                this.node.runAction(act);
                this.m_bAct = true;
            } else {
                this.m_oChipNode.getComponent('westward_journey_chip_manager').playerBetAct(player.rank, info.betId, info.bet, 0, true); //下注动画
                this.node.getChildByName('coin').getComponent(cc.Label).string = this.convertChipNum(player.coin, 1); //更新玩家身上金币
                //this.node.runAction(cc.moveTo(0.1, cc.v2(this.m_oStartPosX, this.m_oStartPosY)));
            }
        }

    },

    //转换筹码字
    convertChipNum: function (num, type) {
        var str = num;
        if (num >= 10000 && num < 100000000) {
            str = (num / 10000).toFixed(type);
            var index = str.indexOf('.');
            if (index == 3)
                str = str.substr(0, 5) + '万';
            else
                str = str.substr(0, 4) + '万';
        } else if (num >= 100000000) {
            str = (num / 100000000).toFixed(type);
            var index = str.indexOf('.');
            if (index == 3)
                str = str.substr(0, 5) + '亿';
            else
                str = str.substr(0, 4) + '亿';
        }
        return str
    },
});
