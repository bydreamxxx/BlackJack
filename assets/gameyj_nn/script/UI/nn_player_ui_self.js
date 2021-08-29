var nn_send_msg = require('douniu_send_msg');
var nn_data = require('nn_data');
var nn_mgr = require('nn_mgr');
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
const SELECT_HEIGHT = 35;
const OpType = {
    BANK: 0,        //抢庄
    BET: 1,         //下注
    GROUP: 2,       //组牌
}
cc.Class({
    extends: require('nn_player_ui'),

    properties: {
        op_list: [cc.Node],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.type_node = cc.find('type', this.node);
        //this.op_list = cc.find('op', this.node).children;
        this.qz_sp = cc.find('qiangzhuang', this.node).getComponent(cc.Sprite);
        this.bet_sp = cc.find('xiazhu', this.node).getComponent(cc.Sprite);
        this.banker_armature = cc.find('bank_ani', this.node.parent).getComponent(cc.Animation);
        this.banker_ani = cc.find('banker_ani2', this.node.parent).getComponent(cc.Animation);
        this.banker_sp = cc.find('banker', this.node.parent).getComponent(cc.Sprite);
        this.bankdi_sp = cc.find('bank_di', this.node.parent).getComponent(cc.Sprite);
    },

    // update (dt) {},

    /**
     * 抢庄返回
     * @param {Number} bet 
     * @param {cc.SpriteFrame} sprite 
     */
    bankRet(bet, sprite, soundoff) {
        if (!soundoff)
            this.showOp(3);
        this._super(bet, sprite, soundoff);
    },

    //抢庄成功
    bankComp(view) {
        this._super(view);
    },

    /**
     * 下注返回
     * @param {Number} bet 
     * @param {cc.SpriteFrame} sprite 
     */
    betRet(bet, sprite, soundoff) {
        this.showOp(-1);
        this._super(bet, sprite, soundoff);
    },

    //发牌动画完成
    dealCards() {
        var player = nn_data.Instance().getPlayerById(cc.dd.user.id);
        var cards = player.handCards;
        for (var i = 0; i < cards.length; i++) {
            var node = this.handcard_node.children[i];
            var value = cards[i];
            nn_mgr.Instance().setPoker(node, value);
        }
    },

    //获取提起牌列表
    getSelectedCards() {
        var cards = [];
        for (var i = 0; i < this.handcard_node.childrenCount; i++) {
            if (this.handcard_node.children[i].tagname[1] == true) {
                cards.push(this.handcard_node.children[i].tagname[0]);
            }
        }
        return cards;
    },

    /**
     * 组牌完成返回
     * @param {Number} type 
     */
    groupRet(type) {
        this.showOp(-1);
        var playTypeArmature = function (event) {
            event.target.off('finished', playTypeArmature, this);
            var armature = cc.find('type/niuzi_ske', this.node).getComponent(dragonBones.ArmatureDisplay);
            const ani_str = {
                0: 'wuniu', 1: 'niu1', 2: 'niu2', 3: 'niu3', 4: 'niu4', 5: 'niu5', 6: 'niu6', 7: 'niu7', 8: 'niu8', 9: 'niu9',
                10: 'niuniu', 21: 'zhadan', 22: 'sihuaniu', 23: 'wuhuaniu', 24: 'wuxiaoniu',
            }
            armature.node.parent.active = true;
            armature.playAnimation(ani_str[type], 1);
            cc.find('type/youniu_1', this.node).active = type > 0;
            cc.find('type/youniu_2', this.node).active = type > 0;
        }.bind(this);
        if (type > 0 && type < 11) {
            var player = nn_data.Instance().getPlayerById(cc.dd.user.id);
            var cards = player.handCards;
            var sortedcards = nn_data.Instance().sortCards(cards, player.orderCardsList);
            for (var i = 0; i < sortedcards.length; i++) {
                var node = this.handcard_node.children[i];
                var value = sortedcards[i];
                nn_mgr.Instance().setPoker(node, value);
            }
        }
        this.node.getComponent(cc.Animation).off('finished', playTypeArmature, this);
        this.node.getComponent(cc.Animation).on('finished', playTypeArmature, this);
        this.node.getComponent(cc.Animation).play('sendpoker_group');
    },

    autoRet(isAuto) {
        this._super(isAuto);
        var tuoguan = cc.find('Canvas/tuoguan');
        if (tuoguan) {
            tuoguan.active = isAuto;
        }
    },

    //抢庄
    onBank(event, data) {
        var bet = parseInt(data);
        nn_send_msg.banker(bet);
    },
    //下注
    onBet(event, data) {
        var bet = parseInt(data);
        var maxBet = RoomMgr.Instance()._Rule.maxBet;
        bet = maxBet / 3 * bet;
        nn_send_msg.bet(bet);
    },
    onGoldBet(event, data) {
        var bet = parseInt(data);
        nn_send_msg.bet(bet);
    },
    onJlbBet(event, data) {
        var bet = parseInt(data);
        var maxBet = RoomMgr.Instance()._Rule.maxBet;
        if (maxBet == 8) {
            let betList = [1, 3, 5, 8];
            nn_send_msg.bet(betList[bet]);
        }
        else {
            if (bet == 0)
                nn_send_msg.bet(1);
            else
                nn_send_msg.bet(maxBet / 3 * bet);
        }
    },
    //点击牌
    onCardClick(event, data) {
        if (nn_data.Instance().roomStatus == 3) {//操作状态
            var isSelect = !event.target.tagname[1];
            this.selectCard(event.target, isSelect);
        }
    },
    //无牛
    onWuniu(event, data) {
        var cards = nn_data.Instance().getPlayerById(cc.dd.user.id).handCards;
        var cardtype = nn_data.Instance().analysisCards(cards);
        if (cardtype == 0) {//无牛
            nn_send_msg.groupcard([]);
        }
        else if (cardtype > 0 && cardtype < 11) {
            var tips_cards = nn_data.Instance().getNiuCards(cards);
            this.updateSelectCards(tips_cards);
        }
    },
    //有牛
    onYouniu(event, data) {
        var cards = this.getSelectedCards();
        if (cards.length == 3 && nn_data.Instance().analysisNiu(cards)) {
            nn_send_msg.groupcard(cards);
        }
    },

    resetUI() {
        this._super();
        this.showOp(-1);
    },

    //暗扣翻牌前
    rotateAllCards() {
        var player = nn_data.Instance().getPlayerById(cc.dd.user.id);
        var cards = player.handCards;
        var type = player.cardtype;
        var sortedcards = nn_data.Instance().getSortedCards(cards, type);
        if (sortedcards) {
            for (var i = 0; i < sortedcards.length; i++) {
                var node = this.handcard_node.children[i];
                var value = sortedcards[i];
                nn_mgr.Instance().setPokerBack(node, value);
            }
        }
    },

    //翻一张 翻牌前
    rotateCardsStart() {
        var player = nn_data.Instance().getPlayerById(cc.dd.user.id);
        var card = player.handCards[4];
        var node = cc.find('fanpai_ani/poker_fan', this.handcard_node);
        nn_mgr.Instance().setPoker(node, card);
    },

    //翻一张牌 完成
    rotateCards() {
        var player = nn_data.Instance().getPlayerById(cc.dd.user.id);
        var cards = player.handCards;
        var type = player.cardtype;
        var sortedcards = nn_data.Instance().getSortedCards(cards, type);
        if (sortedcards) {
            for (var i = 0; i < sortedcards.length; i++) {
                var node = this.handcard_node.children[i];
                var value = sortedcards[i];
                nn_mgr.Instance().setPoker(node, value);
            }
        }
    },

    /**
     * 提起牌
     * @param {cc.Node} node 
     * @param {Boolean} isSelect 
     */
    selectCard(node, isSelect) {
        // node.stopAllActions();
        // var duration = 0.2;
        // var x = node.x;
        // var action = null;
        // if (isSelect) {
        //     action = cc.spawn(cc.callFunc(function () { if (node.tag && node.tag.length == 2) node.tag[1] = true; this.updateYouniuBtn(); }.bind(this)), cc.moveTo(duration, cc.v2(x, SELECT_HEIGHT)).easing(cc.easeCubicActionInOut()));
        // }
        // else {
        //     action = cc.spawn(cc.callFunc(function () { if (node.tag && node.tag.length == 2) node.tag[1] = false; this.updateYouniuBtn(); }.bind(this)), cc.moveTo(duration, cc.v2(x, 0)).easing(cc.easeCubicActionInOut()));
        // }
        // node.runAction(action);
    },

    /**
     * 显示操作面板
     * @param {Number} idx 
     */
    showOp(idx) {
        for (var i = 0; i < this.op_list.length; i++) {
            this.op_list[i].active = (idx == i);
        }
    },

    /**
     * 刷新提起的牌
     * @param {Array<Number>} cards 
     */
    updateSelectCards(cards) {
        for (var i = 0; i < this.handcard_node.childrenCount; i++) {
            if (cards.indexOf(this.handcard_node.children[i].tagname[0]) != -1) {
                this.selectCard(this.handcard_node.children[i], true);
            }
            else {
                this.selectCard(this.handcard_node.children[i], false);
            }
        }
    },

    //刷新有牛按钮显示
    updateYouniuBtn() {
        // var youniu_btn = cc.find('op/op_zp/you', this.node).getComponent(cc.Button);
        // var cards = this.getSelectedCards();
        // if (cards.length == 3 && nn_data.Instance().analysisNiu(cards)) {
        //     youniu_btn.interactable = true;
        // }
        // else {
        //     youniu_btn.interactable = false;
        // }
    },
});
