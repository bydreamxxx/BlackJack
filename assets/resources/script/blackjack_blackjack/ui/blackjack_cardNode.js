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
        choose: cc.Node,

        cardPrefab: cc.Prefab,
    },

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

        if(isSelf){

        }

        this.cardList = [];

        if(this.isBanker){
            this.chipZone.active = false;
            this.chipLabel.node.parent.active = false;
            let point = 0;
            let Anum = 0;
            betInfo.forEach(card=>{
                let num = cc.dd.Utils.translate21(card);
                if(num != null){
                    point += num;
                    if(num == 11){
                        Anum++;
                    }
                }

                let node = cc.instantiate(this.cardPrefab);
                this.cardZone.addChild(node);
                node.getComponent("blackjack_card").init(card);

                this.cardList.push(node.getComponent("blackjack_card"));
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
        }else{
            this.betInfo = betInfo;
            this.index = betInfo.index;
            this.chipLabel.string = betInfo.value;

            let point = 0;
            let Anum = 0;

            betInfo.cardsList.forEach(card=>{
                let num = cc.dd.Utils.translate21(card);
                if(num != null){
                    point += num;
                    if(num == 11){
                        Anum++;
                    }
                }

                let node = cc.instantiate(this.cardPrefab);
                this.cardZone.addChild(node);
                node.getComponent("blackjack_card").init(card);

                this.cardList.push(node.getComponent("blackjack_card"));
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
        }


    },

    splitInfo(cardsList, isRight, isBanker, isSelf, index, bet){
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

        if(isSelf){

        }

        this.cardList = [];
        this.index = index;

        // this.betInfo = betInfo;
        this.chipLabel.string = bet;

        let point = 0;
        let Anum = 0;

        cardsList.forEach(card=>{
            let num = cc.dd.Utils.translate21(card);
            if(num != null){
                point += num;
                if(num == 11){
                    Anum++;
                }
            }

            let node = cc.instantiate(this.cardPrefab);
            this.cardZone.addChild(node);
            node.getComponent("blackjack_card").init(card);

            this.cardList.push(node.getComponent("blackjack_card"));
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
    },

    updateInfo(data){
        this.betInfo = data;
        this.index = data.index;

        this.chipLabel.string = data.value;

        this.updateCards(data.cardsList);
    },

    updateCards(cardsList){
        let point = 0;
        let Anum = 0;

        for(let i = 0; i < cardsList.length; i++){
            let card = cardsList[i];
            if(this.cardList[i]){
                if(this.cardList[i].getCard() != card){
                    this.cardList[i].change(card);
                }
            }else{
                let node = cc.instantiate(this.cardPrefab);
                this.cardZone.addChild(node);
                node.getComponent("blackjack_card").init(card);
                this.cardList.push(node.getComponent("blackjack_card"));
            }

            let num = cc.dd.Utils.translate21(card);
            if(num != null){
                point += num;
                if(num == 11){
                    Anum++;
                }
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
    },

    showChoose(){
        this.choose.active = true;
    },

    hideChoose(){
        this.choose.active = false;
    },
});
