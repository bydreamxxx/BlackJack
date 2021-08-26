// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        zn_atlas:[cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad:function () {
        this.zhinan_atlas = [];
        for(let i = 0, len = this.zn_atlas.length; i < len; ++i){
            var sp = this.zn_atlas[i];
            this.zhinan_atlas[sp.name] = sp;
        }
    },

    getFrame:function () {
        return this.zhinan_atlas;
    }
});
