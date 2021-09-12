// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        chipZone: cc.Node,
        cardZone: cc.Node,
        chipLabel: cc.Label,
        point: cc.Label,

        isRight:false,
        isBanker: false,

        cardPrefab: cc.Prefab,
    },

    init(betInfo){
        this.cardList = [];

        this.betInfo = betInfo;
        this.chipLabel.string = betInfo.value;
        let point = 0;
        betInfo.cardsList.forEach(card=>{
            let num = cc.dd.Utils.translate21(card);
            if(num != null){
                point += num;
            }

            let node = cc.instantiate(this.cardPrefab);
            this.cardZone.addChild(node);
            node.getComponent("blackjack_card").init(card);

            this.cardList.push(node);
        });
        this.point.string = point.toString();
    }
});
