var AppCfg = require('AppConfig');

let com_card = cc.Class({
    extends: cc.Component,

    properties: {
        frame: cc.Sprite,
    },

    init(card){
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
    },

    getCard(){
        return this.card || -1;
    },

    change(card){
        this.init(card);
    },

    //针对自己手牌，特殊处理
    isTouchDown:function (event) {
        if(!this.node.active || !this._isTouch){
            return false;
        }
        var tmpRect = this.node.getBoundingBoxToWorld();
        if(tmpRect.contains(event.touch.getLocation())){
            return true;
        }
        return false;
    },

    setTouchAble(enable){
        this._isTouch = enable;
    },

});

module.exports = com_card;
