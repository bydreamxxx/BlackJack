// create by wj 2020/06/13
var game_Data = require('lucky_turntable_data').Lucky_Turntable_Data.Instance();
cc.Class({
    extends: cc.Component,

    properties: {
        m_oCoinNode: cc.Node,
        m_oEndNode: cc.Node,
        m_nTotalCount: 0,
        m_nBetId: 0,
        m_tCoinNodeContainor:[],
        m_oChipAtlas: cc.SpriteAtlas, //筹码资源

        m_oWinCoinNode: cc.Node,
        m_oStartNode: cc.Node,
        m_oWinEndNode: cc.Node,
        m_tWinCoinNodeContainor:[],
        m_oWinTotalCount: 2,
    },

    onLoad () {
        this.m_oEndNode = this.node.getChildByName('chipsicon');
    },

    playCoinFly: function(id, num){
        this.createChipPool();
        this.m_nBetId = id;
        this.m_nTotalCount = num;
        this.coinFlyAction(num);
    },

    //创建筹码池
    createChipPool: function() {
        this.coinPool = new cc.NodePool();
        var initCount = 10;
        for (var i = 0; i < initCount; i++) {
            var chip = cc.instantiate(this.m_oCoinNode);
            this.coinPool.put(chip);
        }
    },

    //创建筹码
    createChip: function () {
        var coin = null;
        if (this.coinPool.size() > 0) {
            coin = this.coinPool.get();
        } else {
            coin = cc.instantiate(this.m_oCoinNode);
        }
        return coin;
    },

    //显示金币飞的动画
    coinFlyAction: function(num){
        if(num <= 0)
            return;
        var node = this.m_oEndNode;
        var worldPos = node.parent.convertToWorldSpaceAR(node.getPosition());
        var endPos = node.parent.parent.convertToNodeSpaceAR(worldPos);
        var coinNode = this.createChip();
        coinNode.active = true;
        coinNode.parent = node.parent.parent;
        this.m_tCoinNodeContainor.push(coinNode);
        var moveTo = cc.moveTo(0.5, cc.v2(endPos.x, endPos.y));
        var self = this;
        coinNode.runAction(cc.sequence(moveTo, cc.delayTime(0.3), cc.callFunc(function(){
            var node = self.m_tCoinNodeContainor.shift();
            node.removeFromParent();
            node.active = false;
        })));
        var timer = parseInt(Math.random() * (5- 3 + 1) + 3, 10) * 100;
        setTimeout(function()  {
            this.m_nTotalCount = this.m_nTotalCount - 1;
            if(this.m_nTotalCount > 0)
                this.coinFlyAction(this.m_nTotalCount);
        }.bind(this), timer);

    },

    updateBetAreaTxtNum: function(id){//更新下注区域筹码值显示
        var betData = game_Data.getBetAreaInfoById(id);
        if(betData){                
            var betNumNode = this.node.getChildByName('betNum');
            if(betNumNode){
                if(betData.value == 0){
                    betNumNode.active = false;
                    return;
                }
                betNumNode.active = true;
                betNumNode.getComponent(cc.Label).string = this.convertChipNum(betData.value,1);
                var width = betNumNode.getContentSize().width;

                var chipIcon = this.node.getChildByName('chipsicon');
                if(chipIcon){
                    chipIcon.x = (betNumNode.x - width - chipIcon.width / 2);
                    chipIcon.active = true;
                    var iconStr = 'chips0';
                    if(betData.value <= 100000)
                        iconStr = 'chips0';
                    else if(betData.value > 100000 && betData.value <= 1000000)
                        iconStr = 'chips1';
                    else if(betData.value >= 1000000 && betData.value < 10000000)
                        iconStr = 'chips3'
                    else if(betData.value >= 10000000)
                        iconStr = 'chips2'
                    chipIcon.getComponent(cc.Sprite).spriteFrame = this.m_oChipAtlas.getSpriteFrame(iconStr);
                }
            }
        }
    },

    clearUI: function(){
        var chipIcon = this.node.getChildByName('chipsicon');
        chipIcon.active = false;

        var betNumNode = this.node.getChildByName('betNum');
        betNumNode.active = false;
    },


    playWinCoinFly: function(){
        this.createWinChipPool();
        this.coinWinFlyAction();
    },

    //创建筹码池
    createWinChipPool: function() {
        this.coinWinPool = new cc.NodePool();
        var initCount = 10;
        for (var i = 0; i < initCount; i++) {
            var chip = cc.instantiate(this.m_oWinCoinNode);
            this.coinWinPool.put(chip);
        }
    },

    //创建筹码
    createWinChip: function () {
        var coin = null;
        if (this.coinWinPool.size() > 0) {
            coin = this.coinWinPool.get();
        } else {
            coin = cc.instantiate(this.m_oWinCoinNode);
        }
        return coin;
    },

    //显示金币飞的动画
    coinWinFlyAction: function(){
        var node = this.m_oStartNode;
        var worldPos = node.parent.convertToWorldSpaceAR(node.getPosition());
        var start = node.parent.parent.convertToNodeSpaceAR(worldPos);
        var coinNode = this.createWinChip();
        coinNode.active = true;
        coinNode.parent = this.m_oWinCoinNode.parent;
        this.m_tWinCoinNodeContainor.push(coinNode);
        coinNode.setPosition(start);

        var endPos = this.m_oWinEndNode.getPosition();
        var moveTo = cc.moveTo(0.5, cc.v2(endPos.x, endPos.y));
        var self = this;

        coinNode.getComponent(cc.Animation).play();
        coinNode.runAction(cc.sequence(moveTo, cc.delayTime(0.1), cc.callFunc(function(){
            var node = self.m_tWinCoinNodeContainor.shift();
            node.removeFromParent();
            node.active = false;
            self.coinWinPool.put(node);
        })));
        this.m_oWinTotalCount -= 1;
        if(this.m_oWinTotalCount > 0){
            setTimeout(function()  {
                this.coinWinFlyAction();
            }.bind(this), 300);
        }else{
            this.m_oWinTotalCount = 2;
        }
    },

    convertChipNum: function(num, type){
        var str = num;
        if(num >= 1000 && num < 10000){
                str = (num / 1000).toFixed(type);
                var endStr = '千';
                str += endStr;
        }else if(num >= 10000 && num < 100000000){
            str = (num / 10000).toFixed(type);
            var index = str.indexOf('.');
            if(index == 3)
                str = str.substr(0,5);
            else
                str = str.substr(0,4);
            var endStr =  '万';
            str += endStr;

        }else if(num >= 100000000){
            str = (num / 100000000).toFixed(type);
            var index = str.indexOf('.');
            if(index == 3)
                str = str.substr(0,5);
            else
                str = str.substr(0,4);
            var endStr =  '亿';
            str += endStr;
        }
        return str 
    },
});
