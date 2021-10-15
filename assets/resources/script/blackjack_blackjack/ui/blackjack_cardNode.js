// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const START_X = 104;
const OFFSET_X = -92;

cc.Class({
    extends: cc.Component,

    properties: {
        chipZone: cc.Node,
        cardZone: cc.Node,
        chipLabel: cc.Label,
        point: cc.Label,
        choose: cc.Node,

        cardPrefab: cc.Prefab,
    },

    createPai(list, show, isDouble){
        let point = 0;
        let Anum = 0;

        list.forEach(card=>{
            let num = cc.dd.Utils.translate21(card);
            if(num != null){
                point += num;
                if(num == 11){
                    Anum++;
                }
            }

            let node = cc.instantiate(this.cardPrefab);
            this.cardZone.addChild(node);

            if(this.isRight) {
                for(let i = 0; i < this.cardList.length; i++){
                    this.cardList[i].node.x = -START_X - (this.cardList.length - i) * (node.width + OFFSET_X);
                }
                node.x = -START_X;
            }else{
                node.x = START_X + this.cardList.length * (node.width + OFFSET_X);
            }

            node.getComponent("blackjack_card").init(card, show);

            this.cardList.push(node.getComponent("blackjack_card"));

            if(this.cardList.length == 3 && isDouble){
                node.rotation = 90;
            }
        });

        if(point > 21){
            let num = Math.ceil((point - 21)/10);
            if(num < Anum){
                point -= num * 10;
            }else{
                point -= Anum * 10;
            }
        }

        this.point.string = point.toString();
        let cardShowNum = 0;
        this.cardList.forEach(card=>{
            if(card.node.active){}
            cardShowNum++;
        })
        this.point.node.parent.active = point > 0 && cardShowNum >= 2;
    },

    /**
     * 初始化
     * @param betInfo
     * @param isRight
     * @param isBanker
     * @param isSelf
     * @param show
     */
    init(betInfo, isRight, isBanker, isSelf, show){
        this.isRight = isRight;
        this.isBanker = isBanker;
        this.isSelf = isSelf;

        if(this.isRight){
            this.cardZone.anchorX = 1;
            this.cardZone.x = 73.507;
        }else{
            this.cardZone.anchorX = 0;
            this.cardZone.x = -18.904;
        }

        this.cardList = [];

        if(this.isBanker){
            this.chipZone.active = false;
            this.chipLabel.node.parent.active = false;

            if(betInfo.hasOwnProperty("cardsList")){
                this.createPai(betInfo.cardsList, show);
            }else{
                this.createPai(betInfo, show);
            }
        }else{
            this.betInfo = betInfo;
            this.index = betInfo.index;
            this.chipLabel.string = (betInfo.value + betInfo.insure).toString();

            this.chipLabel.node.parent.active = (betInfo.value + betInfo.insure) > 0;

            this.createPai(betInfo.cardsList, show, betInfo.type == 1);
        }
    },

    // /**
    //  * 拆分
    //  * @param cardsList
    //  * @param isRight
    //  * @param isBanker
    //  * @param isSelf
    //  * @param index
    //  * @param bet
    //  */
    // splitInfo(cardsList, isRight, isBanker, isSelf, index, bet){
    //     this.isRight = isRight;
    //     this.isBanker = isBanker;
    //     this.isSelf = isSelf;
    //
    //     if(this.isRight){
    //         this.cardZone.anchorX = 1;
    //         this.cardZone.x = 73.507;
    //     }else{
    //         this.cardZone.anchorX = 0;
    //         this.cardZone.x = -18.904;
    //     }
    //
    //     if(isSelf){
    //
    //     }
    //
    //     this.cardList = [];
    //     this.index = index;
    //
    //     // this.betInfo = betInfo;
    //     this.chipLabel.string = bet;
    //     this.chipLabel.node.parent.active = !this.isBanker && bet > 0;
    //
    //     this.createPai(cardsList, true);
    // },

    /**
     * 更新信息
     * @param data
     */
    updateInfo(data){
        this.betInfo = data;
        this.index = data.index;

        this.chipLabel.string = (data.value + data.insure).toString();
        this.chipLabel.node.parent.active = !this.isBanker && (data.value + data.insure) > 0;

        this.updateCards(data.cardsList);
    },

    /**
     * 更新牌堆
     * @param cardsList
     * @param show
     */
    updateCards(cardsList, show, isDouble){
        let point = 0;
        let Anum = 0;

        for(let i = 0; i < cardsList.length; i++){
            let card = cardsList[i];
            if(this.cardList[i]){
                if(this.cardList[i].getCard() != card){
                    cc.tween(this.cardList[i].node)
                        .to(0.2, {scaleX: 0})
                        .call(()=>{
                            this.cardList[i].change(card);
                        })
                        .to(0.2, {scaleX: 1})
                        .call(()=>{
                            this.cardList[i].setShow();
                        })
                        .start();
                }
            }else{
                let node = cc.instantiate(this.cardPrefab);
                this.cardZone.addChild(node);

                if(this.isRight) {
                    for(let i = 0; i < this.cardList.length; i++){
                        this.cardList[i].node.x = -START_X - (this.cardList.length - i) * (node.width + OFFSET_X);
                    }
                    node.x = -START_X;
                }else{
                    node.x = START_X + this.cardList.length * (node.width + OFFSET_X);
                }
                if(this.cardList.length >= 2){
                    show = false;
                }
                node.getComponent("blackjack_card").init(card, show);

                this.cardList.push(node.getComponent("blackjack_card"));

                if(this.cardList.length == 3 && isDouble){
                    node.rotation = 90;
                }
            }

            let num = cc.dd.Utils.translate21(card);
            if(num != null){
                point += num;
                if(num == 11){
                    Anum++;
                }
            }
        }

        if(this.cardList.length > cardsList.length){
            for(let i = this.cardList.length - 1; i >= cardsList.length; i--){
                let node = this.cardList[i].node;
                node.removeFromParent();
                node.destroy();
                this.cardList.splice(i, 1);
            }
        }

        if(point > 21){
            let num = Math.ceil((point - 21)/10);
            if(num < Anum){
                point -= num * 10;
            }else{
                point -= Anum * 10;
            }
        }
        this.point.string = point.toString();
        let cardShowNum = 0;
        this.cardList.forEach(card=>{
            if(card.node.active){}
            cardShowNum++;
        })
        this.point.node.parent.active = point > 0 && cardShowNum >= 2;
    },

    showChoose(){
        this.choose.active = true;
    },

    hideChoose(){
        this.choose.active = false;
    },

    fapai(startNode, isSelf, isDouble){
        let card = null;
        let index = 0;
        for(let i = 0; i < this.cardList.length; i++){
            if(!this.cardList[i].isActive){
                card = this.cardList[i];
                card.isActive = true;
                index = i;
                break;
            }
        }

        if(card){
            let node = cc.instantiate(this.cardPrefab);
            this.cardZone.addChild(node);
            let worldPos = startNode.convertToWorldSpace(cc.v2(0, 0));
            let startPos = this.cardZone.convertToNodeSpace(worldPos);
            let endPos = card.node.position
            node.position = startPos;
            node.opacity = 0;
            node.getComponent("blackjack_card").init(0);

            let move = cc.tween()
                    .to(1, {opacity: 255, position: endPos});

            if(isDouble){
                move = cc.tween()
                    .to(1, {opacity: 255, position: endPos, rotation: 90});
            }

            let scale = cc.tween()
                .to(0.2, {scaleX: 0}, { easing: 'quartIn'})
                .call(()=>{
                    node.getComponent("blackjack_card").change(card.getCard());
                })
                .to(0.2, {scaleX: 1}, { easing: 'quartOut'});

            let end = cc.tween()
                .call(()=>{
                    card.setShow();
                    if(index === this.cardList.length - 1){
                        this.point.node.parent.active = true;
                        if(isSelf){
                            cc.gateNet.Instance().startDispatch();
                        }
                    }
                })
                .hide()
                .removeSelf();

            if(card.getCard() == node.getComponent("blackjack_card").getCard()){
                cc.tween(node)
                    .then(move)
                    .then(end)
                    .start();

            }else{
                cc.tween(node)
                    .then(move)
                    .then(scale)
                    .then(end)
                    .start();
            }
        }
    },
});
