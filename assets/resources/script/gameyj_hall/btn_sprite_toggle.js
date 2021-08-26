var sprite=cc.Class({
    name:sprite,
    properties:{
        target:cc.Sprite,           
        normalSprite:cc.SpriteFrame,
        pressedSprite:cc.SpriteFrame,
    },
});
var font=cc.Class({
    name:font,
    properties:{
        target:cc.Label,
        normalFont:cc.Font,
        pressedFont:cc.Font,
    },
});
cc.Class({
    extends: cc.Component,

    properties: {
        sprites:[sprite],
        fonts:[font],    
    },

    onLoad: function () {
        this.node.on(cc.Node.EventType.TOUCH_START,this.onClickDown,this);
        this.node.on(cc.Node.EventType.TOUCH_END,this.onClickUp,this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL,this.onClickUp,this);
    },

    onDestroy: function(){
        this.node.off(cc.Node.EventType.TOUCH_START,this.onClickDown,this);
        this.node.off(cc.Node.EventType.TOUCH_END,this.onClickUp,this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL,this.onClickUp,this);
    },

    onClickDown:function(event){
        this.sprites.forEach(function(sprite) {
            sprite.target.spriteFrame=sprite.pressedSprite;
        }, this);
        this.fonts.forEach(function(font){
            var spacingX=font.target.spacingX;
            font.target.font=font.pressedFont;
            font.target.spacingX=spacingX;
        },this);
    },
    
    onClickUp: function(){
        this.sprites.forEach(function(sprite) {
            sprite.target.spriteFrame=sprite.normalSprite;
        }, this);
        this.fonts.forEach(function(font){
            var spacingX=font.target.spacingX;
            font.target.font=font.normalFont;
            font.target.spacingX=spacingX;
        },this);
    },
});
