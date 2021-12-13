const RummyGroup = require("RummyGroup");

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

    showFapai(groupList, cardPrefab, startNode){
        this.showFapaiDirect(groupList, cardPrefab);
        // this.groupList.forEach(group=>{
        //     group.view.active = false;
        // })

        let worldPos = startNode.convertToWorldSpace(cc.v2(0, 0));
        let startPos = this.node.convertToNodeSpace(worldPos);
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

            let groupInfo = {data: group, view: node};
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
            bottom.width = node.width;
            bottom.y = -109;
            bottom.x = 0;
            bottom.scale = 1;
            bottom.active = !groupInfo.isNoGroup();
            let frame = bottom.getComponent(cc.Sprite);
            let label = bottom.getComponentInChildren(cc.Label);

            if(!groupInfo.isNoGroup() && !groupInfo.isNoCorrect()){
                if(first === -1){
                    first = i;
                    if(groupInfo.isPure()){
                        frame.spriteFrame = this.bottomColor[0];
                        label.string = '1st Life';
                    }else{
                        frame.spriteFrame = this.bottomColor[1];
                        label.string = '1st Life Needed';
                    }
                }else if(second === -1){
                    second = i;
                    if(groupInfo.isImPure()){
                        frame.spriteFrame = this.bottomColor[0];
                        label.string = '2nd Life';
                    }else{
                        frame.spriteFrame = this.bottomColor[1];
                        label.string = '2nd Life Needed';
                    }
                }else{
                    frame.spriteFrame = this.bottomColor[0];

                    if(groupInfo.isPure()) {
                        label.string = 'Pure';
                    }else if(groupInfo.isImPure()){
                        label.string = 'Impure';
                    }else if(groupInfo.isStraight()){
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
