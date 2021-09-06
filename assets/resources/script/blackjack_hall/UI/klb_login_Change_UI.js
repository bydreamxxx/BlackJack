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
        banhaoInfo: cc.Node,
        kefuBtn: cc.Node,
        repairBtn: cc.Node,

        bg: cc.Sprite,
        bg_winter: cc.SpriteFrame,
        bg_spring: cc.SpriteFrame,

        bgAnima: cc.Node,
        wxBtnSprite: cc.Sprite,
        wxBtn_orange: cc.SpriteFrame,
        wxBtn_green: cc.SpriteFrame,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if(cc._themeStyle == 0){
            this.setNodeActive(this.bgAnima, true);
            this.setSpriteFrame(this.bg, this.bg_spring);

            this.setSpriteFrame(this.wxBtnSprite, this.wxBtn_green);
        }else{
            this.setNodeActive(this.bgAnima, false);
            this.setSpriteFrame(this.bg, this.bg_winter);
            this.setSpriteFrame(this.wxBtnSprite, this.wxBtn_orange);
        }

        if (cc._chifengGame || cc.game_pid == 10004) {
            this.setNodeActive(this.banhaoInfo, cc.game_pid == 10004);
            this.setNodeActive(this.kefuBtn, false);
            this.setNodeActive(this.repairBtn, false);
        }else{
            this.setNodeActive(this.banhaoInfo, true);
            this.setNodeActive(this.kefuBtn, cc.game_pid != 10003 && !cc._applyForPayment);
            this.setNodeActive(this.repairBtn, cc.game_pid != 10003 && !cc._applyForPayment);
        }
    },

    start () {

    },

    setSpriteFrame(sprite, spriteFrame){
        if(sprite){
            sprite.spriteFrame = spriteFrame;
        }
    },

    setNodeActive(node, active){
        if(node){
            node.active = active;
        }
    },
});
