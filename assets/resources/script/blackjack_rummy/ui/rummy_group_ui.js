const RummyGroup = require("RummyGroup");
const faPaiPos = [];
cc.Class({
    extends: cc.Component,

    properties: {
        bottomNode: cc.Node,
        bottomColor: [cc.SpriteFrame],
    },

    editor:{
        menu:"Rummy/rummy_group_ui"
    },

    clear(){
        this.node.removeAllChildren();
        this.node.width = 0;
    },

    showFapai(groupList, cardPrefab, startNode, handCardList){
        this.showFapaiDirect(groupList, cardPrefab);

        if(handCardList.length !== faPaiPos.length){
            cc.error(`手牌数量错误 ${handCardList}`);
            return;
        }

        this.groupList.forEach(group=>{
            group.view.active = false;
            group.bottom.active = false;
        });

        this.playList = [];

        let worldPos = startNode.convertToWorldSpace(cc.v2(0, 0));
        let startPos = this.node.convertToNodeSpace(worldPos);

        for(let i = handCardList.length - 1; i >= 0; i--){
            for(let j = 0; j < this.groupList.length; j++){
                let group = this.groupList[j].view;
                let node = null;
                for(let k = 0; k < group.childrenCount; k++){
                    let card = group.children[k].getComponent("blackjack_card");
                    if(card && card.getCard() === handCardList[i]){
                        node = group.children[k];
                        card.setTargetPos(node.position);

                        let group_worldPos = this.node.convertToWorldSpace(faPaiPos[i]);
                        let group_startPos = group.convertToNodeSpace(group_worldPos);
                        node.position = group_startPos;


                        let playCard = cc.instantiate(cardPrefab);
                        playCard.getComponent("blackjack_card").init(0);
                        this.node.addChild(playCard);
                        playCard.position = startPos;
                        playCard.scaleX = 0.717;
                        playCard.scaleY= 0.717;
                        playCard.getComponent("blackjack_card").setTargetValue(handCardList[i]);
                        playCard.getComponent("blackjack_card").setTargetPos(faPaiPos[i]);

                        this.playList.unshift(playCard);
                        break;
                    }
                }

                if(node !== null){
                    break;
                }
            }
        }

        let index = 0;

        let endFunc = ()=>{
            this.playList.forEach(node=>{
                node.destroy();
            })

            this.groupList.forEach(group=>{
                group.view.active = true;
                for(let k = 0; k < group.view.childrenCount; k++){
                    let card = group.view.children[k].getComponent("blackjack_card");
                    if(card){
                        let node = group.view.children[k];
                        cc.tween(node)
                            .to(0.5, {position: card.targetPos}, { easing: 'expoOut'})
                            .call(()=>{
                                group.bottom.active = !group.data.isNoGroup();
                            })
                            .start();
                    }
                }
            });
        }

        this.schedule(()=>{
            let node = this.playList[index];
            index++;

            if(index >= this.playList.length){
                cc.tween(node)
                    .to(0.5, {position: node.getComponent("blackjack_card").targetPos, scale: 1}, { easing: 'expoOut'})
                    .delay(0.5)
                    .to(0.2, {scale: 1.1}, { easing: 'quintIn'})
                    .to(0.25, {scaleX: 0})
                    .call(()=> {
                        node.getComponent("blackjack_card").init(node.getComponent("blackjack_card").targetValue);
                    })
                    .to(0.25, {scaleX: 1.1})
                    .to(0.2, {scale: 1}, { easing: 'quintOut'})
                    .delay(0.5)
                    .call(endFunc)
                    .start();
            }else{
                cc.tween(node)
                    .to(0.5, {position: node.getComponent("blackjack_card").targetPos, scale: 1}, { easing: 'expoOut'})
                    .delay(0.5)
                    .to(0.2, {scale: 1.1}, { easing: 'quintIn'})
                    .to(0.25, {scaleX: 0})
                    .call(()=> {
                        node.getComponent("blackjack_card").init(node.getComponent("blackjack_card").targetValue);
                    })
                    .to(0.25, {scaleX: 1.1})
                    .to(0.2, {scale: 1}, { easing: 'quintOut'})
                    .start();
            }


        }, 0.5, this.playList.length - 1);
    },

    showFapaiDirect(groupList, cardPrefab){
        this.groupList = [];
        let width = 0;

        let first = -1;
        let second = -1;

        for(let i = 0; i < groupList.length; i++){
            let node = new cc.Node(`RummyGroup_${i}`);
            node.height = 288;
            this.node.addChild(node);

            let cardList = groupList[i];
            let group = new RummyGroup();
            group.init(cardList);

            let groupInfo = {data: group, view: node, bottom:null};
            this.groupList.push(groupInfo);

            let showList = group.getShowList();
            let isOdd = showList.length % 2 === 1;
            let middle = isOdd ? Math.floor(showList.length / 2) : showList.length / 2;
            for(let j = 0; j < showList.length; j++){
                let card = cc.instantiate(cardPrefab);
                card.getComponent("blackjack_card").init(showList[j]);
                node.addChild(card);
                if(isOdd){
                    card.x = (card.width - 60) * (i - middle);
                }else{
                    card.x = (card.width - 60) * (i - middle + 0.5);
                }
            }
            node.width = 208 * showList.length - 60 * (showList.length - 1);

            let bottom = cc.instantiate(this.bottomNode);
            node.addChild(bottom);
            groupInfo.bottom = bottom;
            bottom.width = node.width;
            bottom.y = -109;
            bottom.x = 0;
            bottom.scale = 1;
            bottom.active = !group.isNoGroup();
            let frame = bottom.getComponent(cc.Sprite);
            let label = bottom.getComponentInChildren(cc.Label);

            if(!group.isNoGroup() && !group.isNoCorrect()){
                if(first === -1){
                    first = i;
                    if(group.isPure()){
                        frame.spriteFrame = this.bottomColor[0];
                        label.string = '1st Life';
                    }else{
                        frame.spriteFrame = this.bottomColor[1];
                        label.string = '1st Life Needed';
                    }
                }else if(second === -1){
                    second = i;
                    if(group.isImPure()){
                        frame.spriteFrame = this.bottomColor[0];
                        label.string = '2nd Life';
                    }else{
                        frame.spriteFrame = this.bottomColor[1];
                        label.string = '2nd Life Needed';
                    }
                }else{
                    frame.spriteFrame = this.bottomColor[0];

                    if(group.isPure()) {
                        label.string = 'Pure';
                    }else if(group.isImPure()){
                        label.string = 'Impure';
                    }else if(group.isStraight()){
                        label.string = 'Straight';
                    }else{
                        label.string = 'Set';
                    }
                }
            }else{
                frame.spriteFrame = this.bottomColor[2];
                label.string = 'Not Correct';
            }

            width += node.width;
        }

        this.node.width = width - 30 * (groupList.length - 1);
        for(let i = 0; i < this.groupList.length; i++){
            this.groupList[i].view.x = -this.node.width / 2 + this.groupList[i].view.width / 2 + (this.groupList[i].view.width + 30) * i;
        }
    }
});
