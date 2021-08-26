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
        anim: cc.Animation,
        bg1: cc.Node,
        bg2: cc.Node,
    },

    setEndCall(endFunc){
      this.endFunc = endFunc;
    },

    hide(){
        this.anim.setCurrentTime(0, 'drawlottery');
        this.anim.stop('drawlottery');
        this.bg1.active = false;
        this.bg2.active = false;
    },

    playBling(){
        this.anim.play('drawlottery2');
        this.anim.setCurrentTime(0, 'drawlottery2');

    },

    drawlotteryEndCall(){
        this.anim.play('drawlottery');
        this.anim.setCurrentTime(0, 'drawlottery');

        if(this.endFunc){
            this.endFunc();
        }
    }
});
