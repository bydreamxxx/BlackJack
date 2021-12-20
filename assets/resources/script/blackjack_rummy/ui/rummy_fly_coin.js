// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties:{
        coin: cc.Label,
        animation: cc.Animation
    },

    editor:{
        menu:"Rummy/rummy_fly_coin"
    },

    play(coin, func, isWin){
        this.coin.string = coin;

        this.func = func;

        if(isWin){
            this.func();
        }else{
            this.animation.play();
            this.animation.setCurrentTime(0);
        }
    },

    onPlayFinished(){
        if(this.func){
            this.func();
        }
    },
});
