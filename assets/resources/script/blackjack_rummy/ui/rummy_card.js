// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: require("com_card"),

    properties: {
        mask: cc.Node,
        tag:'',
    },

    editor:{
        menu:"Rummy/rummy_card"
    },

    onLoad(){
        this.hideMask();
    },

    setTargetPos(pos){
        this.targetPos = pos;
    },

    setTargetValue(card){
        this.targetValue = card;
    },

    showMask(){
        this.mask.active = true;

    },

    hideMask(){
        this.mask.active = false;
    }

});
