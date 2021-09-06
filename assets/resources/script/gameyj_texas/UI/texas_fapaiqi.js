/**
 * Created by luke on 2018/12/5
 */
let RoomED = require("jlmj_room_mgr").RoomED;
let RoomEvent = require("jlmj_room_mgr").RoomEvent;
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._curIdx = 1;
        RoomED.addObserver(this);
    },

    onDestroy() {
        RoomED.removeObserver(this);
    },

    //重置
    resetCards() {
        this._curIdx = 1;
        cc.find('cards', this.node).children.forEach(child => {
            child.active = false;
        });
    },

    //发牌
    getCard() {
        var node = cc.find('cards/1', this.node);
        var tpNode = cc.instantiate(node);
        tpNode.parent = node.parent;
        tpNode.position = node.position;
        return tpNode;
    },

    //恢复到移除num张牌的状态
    resumeCard(num) {
        this._curIdx = num + 1;
        // var cards = cc.find('cards', this.node).children;
        // for (var i = 0; i < cards.length; i++) {
        //     if (parseInt(cards[i].name) > num)
        //         cards[i].active = true;
        //     else
        //         cards[i].active = false;
        // }
    },

    //换牌背
    changePokerBack(sprite) {
        cc.find('cards', this.node).children.forEach(child => {
            child.getComponent(cc.Sprite).spriteFrame = sprite;
        });
    },

    onEventMessage(event, data) {
        switch (event) {
            case RoomEvent.update_poker_back:
                this.changePokerBack(data);
                break;
        }
    },
    // update (dt) {},
});
