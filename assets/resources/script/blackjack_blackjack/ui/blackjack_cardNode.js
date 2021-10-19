const BlackJackData = require("BlackJackData").BlackJackData.Instance();

const START_X = 104;
const OFFSET_X = -92;

const POS = [cc.v2(-37, -30), cc.v2(-65, -45), cc.v2(-65,-13), cc.v2(-80, 56), cc.v2(-117,56)];

cc.Class({
    extends: cc.Component,

    properties: {
        chipZone: cc.Node,
        cardZone: cc.Node,
        chipLabel: cc.Label,
        point: cc.Label,
        choose: cc.Node,

        cardPrefab: cc.Prefab,
        chipPrefab: cc.Prefab,
    },

    editor:{
        menu:"BlackJack/blackjack_cardNode"
    },

    createPai(list, isWaitforFapai, isDouble){
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

            node.getComponent("blackjack_card").init(card, isWaitforFapai);

            this.cardList.push(node.getComponent("blackjack_card"));

            if(this.cardList.length == 3 && isDouble){
                node.rotation = 90;
                node.y = 42;
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

        if(!isWaitforFapai){
            this.point.string = point.toString();
        }else{
            this.waitFaPaiPoint = point;
        }
        let cardShowNum = 0;
        this.cardList.forEach(card=>{
            if(card.node.active){}
            cardShowNum++;
        })
        this.point.node.parent.active = point > 0 && cardShowNum >= 2;
    },

    createChip(num, isWaitForAnima, type){
        if(!this.isBanker){
            let green = BlackJackData.minBet;
            let red = Math.floor((BlackJackData.maxBet - BlackJackData.minBet) * 0.3) + BlackJackData.minBet;
            let blue = Math.floor((BlackJackData.maxBet - BlackJackData.minBet) * 0.7) + BlackJackData.minBet;

            let blueCount = Math.floor(num / blue);
            let redCount = Math.floor((num - blueCount * blue) / red);
            let greenCount = Math.floor((num - blueCount * blue - redCount * red) / green);

            let createChip = ()=>{
                let node = cc.instantiate(this.chipPrefab);
                this.chipZone.addChild(node);

                if(type == 1){
                    //result
                    node.scaleX = 0.3;
                    node.scaleY = 0.3;
                    node.x = POS[3].x;
                    node.y = POS[3].y + 1.2 * this.resultList.length;
                    this.resultList.push(node.getComponent("blackjack_chip"));
                }else if(type == 2){
                    //double
                    node.scaleX = 0.3;
                    node.scaleY = 0.3;
                    node.x = POS[1].x;
                    node.y = POS[1].y + 1.2 * this.doubleList.length;
                    this.doubleList.push(node.getComponent("blackjack_chip"));
                }else if(type == 3){
                    //insure
                    node.scaleX = 0.3;
                    node.scaleY = 0.3;
                    node.x = POS[2].x;
                    node.y = POS[2].y + 1.2 * this.insureList.length;
                    this.insureList.push(node.getComponent("blackjack_chip"));
                }else {
                    node.scaleX = 0.5;
                    node.scaleY = 0.5;
                    node.y = 2 * this.chipList.length;
                    this.chipList.push(node.getComponent("blackjack_chip"));
                }
            }

            for(let i = 0; i < greenCount; i++){
                createChip();
            }
            for(let i = 0; i < redCount; i++){
                createChip();
            }
            for(let i = 0; i < blueCount; i++){
                createChip();
            }
        }
    },

    /**
     * 初始化
     * @param betInfo
     * @param isRight
     * @param isBanker
     * @param isSelf
     */
    init(betInfo, isRight, isBanker, isSelf){
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
        this.chipList = [];
        this.doubleList = [];
        this.insureList = [];
        this.resultList = [];

        if(this.isBanker){
            this.chipZone.active = false;
            this.chipLabel.node.parent.active = false;

            this.createPai(betInfo.cardsList, false);
        }else{
            this.betInfo = betInfo;
            this.index = betInfo.index;
            this.chipLabel.string = (betInfo.value + betInfo.insure).toString();

            this.chipLabel.node.parent.active = (betInfo.value + betInfo.insure) > 0;

            this.createChip(betInfo.value + betInfo.insure, false, betInfo.type);
            this.createPai(betInfo.cardsList, false, betInfo.type == 1);
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

        this.createChip(data.value + data.insure, !this.isBanker, data.type);
        this.updateCards(data.cardsList, false, data.type == 1);
    },

    /**
     * 更新牌堆
     * @param cardsList
     * @param isWaitforFapai
     */
    updateCards(cardsList, isWaitforFapai, isDouble){
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
                    isWaitforFapai = true;
                }
                node.getComponent("blackjack_card").init(card, isWaitforFapai);

                this.cardList.push(node.getComponent("blackjack_card"));

                if(this.cardList.length == 3 && isDouble){
                    node.rotation = 90;
                    node.y = 42;
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
        if(!isWaitforFapai){
            this.point.string = point.toString();
        }else{
            this.waitFaPaiPoint = point;
        }
        let cardShowNum = 0;
        this.cardList.forEach(card=>{
            if(card.node.active){
                cardShowNum++;
            }
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
                    .to(1, {opacity: 255, position: { value: endPos, easing: 'quintOut' }});

            if(isDouble){
                move = cc.tween()
                    .to(1, {opacity: 255, position: { value: endPos, easing: 'quintOut' }, rotation: 90});
            }

            let scale = cc.tween()
                .to(0.2, {scaleX: 0}, { easing: 'quintIn'})
                .call(()=>{
                    node.getComponent("blackjack_card").change(card.getCard());
                })
                .to(0.2, {scaleX: 1}, { easing: 'quintOut'});

            let end = cc.tween()
                .call(()=>{
                    card.setShow();
                    if(index === this.cardList.length - 1){
                        this.point.string = this.waitFaPaiPoint.toString();
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

    /**
     * 移到筹码区
     */
    changeChipPos(){

    },
});
