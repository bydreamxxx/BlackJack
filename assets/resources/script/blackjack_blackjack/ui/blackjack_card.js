var AppCfg = require('AppConfig');

cc.Class({
    extends: cc.Component,

    properties: {
        frame: cc.Sprite,
        isActive: true,
    },

    editor:{
        menu:"BlackJack/blackjack_card"
    },

    init(card, isWaitforFapai){
        this.card = card;
       // let bundle = cc.assetManager.getBundle("blackjack_blackjack");
       // if(bundle){
       //      let atlas = bundle.get("atlas/cards", cc.SpriteAtlas);
        let atlas = cc.resources.get("blackjack_common/atlas/cards", cc.SpriteAtlas);
           if(atlas){
               this.frame.spriteFrame = atlas.getSpriteFrame(card);
           }
       // }
       if(AppCfg.IS_DEBUG)
       cc.find("Label", this.node).getComponent(cc.Label).string = card;

       if(!cc.dd._.isUndefined(isWaitforFapai)){
           if(!isWaitforFapai){
               this.setShow();
           }else{
               this.setHide();
           }
       }
    },

    getCard(){
        return this.card || -1;
    },

    change(card){
        this.init(card);
    },

    setHide(){
        this.node.active = false;
        this.isActive = false;
    },

    setShow(){
        this.node.active = true;
        this.isActive = true;
    },

    savePos(){
        this.position = this.node.position;
    },

    getSavePos(){
       if(!this.position){
           this.savePos();
       }
       return this.position;
    },

    setTargetPos(pos){
        this.targetPos = pos;
    },

    setTargetValue(card){
        this.targetValue = card;
    }
});
