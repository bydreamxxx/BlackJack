// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        gou: [cc.Node],
        cha: [cc.Node]
    },

    editor:{
        menu:"Rummy/rummy_invalid_show"
    },

    show(hasFirst, hasSecond, isZero){
        this.gou[0].active = hasFirst;
        this.cha[0].active = !hasFirst;
        this.gou[1].active = hasSecond;
        this.cha[1].active = !hasSecond;
        this.gou[2].active = isZero;
        this.cha[2].active = !isZero;
    },
});
