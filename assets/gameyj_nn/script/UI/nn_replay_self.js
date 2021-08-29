cc.Class({
    extends: cc.Component,

    properties: {
        nn_replay: require('nn_replay'),
        handcard_node: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    //暗扣翻牌前
    rotateAllCards() {
        var player = this.nn_replay.getSelf();
        var cards = player.handPoker;
        var type = player.cardtype;
        var sortedcards = this.nn_replay.getSortedCards(cards, type);
        if (sortedcards) {
            for (var i = 0; i < sortedcards.length; i++) {
                var node = this.handcard_node.children[i];
                var value = sortedcards[i];
                this.nn_replay.setPokerBack(node, value);
            }
        }
    },

    //翻一张 翻牌前
    rotateCardsStart() {
        var player = this.nn_replay.getSelf();
        var card = player.handPoker[4];
        var node = cc.find('fanpai_ani/poker_fan', this.handcard_node);
        this.nn_replay.setPokerBack(node, card);
    },

    //翻一张牌 完成
    rotateCards() {
        var player = this.nn_replay.getSelf();
        var cards = player.handPoker;
        var type = player.cardtype;
        var sortedcards = this.nn_replay.getSortedCards(cards, type);
        if (sortedcards) {
            for (var i = 0; i < sortedcards.length; i++) {
                var node = this.handcard_node.children[i];
                var value = sortedcards[i];
                this.nn_replay.setPoker(node, value);
            }
        }
    },
});
