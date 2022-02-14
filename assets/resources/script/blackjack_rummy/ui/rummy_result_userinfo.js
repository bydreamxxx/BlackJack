// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        headSp: cc.Node,
        nameLabel: cc.Label,
        point: cc.Label,
        score: cc.Label,
        state: cc.Label,
        content: cc.Node,
        winBG: cc.Node,
        card: cc.Prefab
    },

    editor:{
        menu:"Rummy/rummy_result_userinfo"
    },

    clear(){
        this.headSp.getComponent('klb_hall_Player_Head').headSp.spriteFrame = null;
        this.nameLabel.string = '';
        this.point.string = '';
        this.score.string = '';
        this.state.string = '';
        this.content.removeAllChildren();
        this.winBG.active = false;

        this.node.active = false;
    },

    setData(info){
        this.headSp.getComponent('klb_hall_Player_Head').initHead('', info.headUrl);
        this.nameLabel.string = cc.dd.Utils.substr(info.userName, 0, 8);
        this.point.string = Math.abs(info.score);
        this.score.string = cc.dd.Utils.getNumToWordTransform(info.coin);
        if(info.coin > 0){
            this.state.node.color = cc.Color.YELLOW;
            this.state.string = "WINNER";
            this.winBG.active = true;
        }else{
            this.state.node.color = new cc.Color(151, 130, 150);
            this.state.string = "LOST";
            this.winBG.active = false;
        }

        info.groupsList.forEach(group=>{
            let node = new cc.Node(`RummyGroup_${i}`);
            node.height = 288;
            this.content.addChild(node);
            let layout = node.addComponent(cc.Layout);
            layout.type = cc.Layout.Type.HORIZONTAL
            layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
            layout.spacingX = -145;

            group.cardsList.forEach(cardID=>{
                let card = cc.instantiate(this.card);
                node.addChild(card);
                card.getComponent("rummy_card").init(cardID);
            })

            layout.updateLayout();
        })

        this.node.active = true;
    }
});
