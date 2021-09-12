// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        frame: cc.Sprite,
    },

    init(card){
       let bundle = cc.assetManager.getBundle("blackjack_blackjack");
       if(bundle){
           let atlas = bundle.get("atlas/cards", cc.SpriteAtlas);
           if(atlas){
               this.frame.spriteFrame = atlas.getSpriteFrame(card);
           }
       }
    }
});
