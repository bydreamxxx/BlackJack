cc.Class({
    extends: cc.Component,

    properties: {
        left: cc.Sprite,
        back: cc.Sprite,
        bg: cc.Sprite,
        bgAnima: cc.Node,

        userInfoBG: cc.Sprite,
        goldBG: cc.Sprite,
        bottomBG: cc.Sprite,

        leftSpriteFramse: [cc.SpriteFrame],
        backSpriteFrames: [cc.SpriteFrame],
        bgSpriteFrames: [cc.SpriteFrame],
        userInfoBGSpriteFrames: [cc.SpriteFrame],
        bottomBGSpriteFrames: [cc.SpriteFrame],
        goldBGSpriteFrames: [cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if(cc._themeStyle == 0){
            this.changeSprite(this.left, this.leftSpriteFramse[1]);
            this.changeSprite(this.back, this.backSpriteFrames[1]);
            this.changeSprite(this.bg, this.bgSpriteFrames[1]);
            this.changeSprite(this.userInfoBG, this.userInfoBGSpriteFrames[1]);
            this.changeSprite(this.bottomBG, this.bottomBGSpriteFrames[1]);
            this.changeSprite(this.goldBG, this.goldBGSpriteFrames[1]);
            this.changeActive(this.bgAnima, true);
        }else{
            this.changeSprite(this.left, this.leftSpriteFramse[0]);
            this.changeSprite(this.back, this.backSpriteFrames[0]);
            this.changeSprite(this.bg, this.bgSpriteFrames[0]);
            this.changeSprite(this.userInfoBG, this.userInfoBGSpriteFrames[0]);
            this.changeSprite(this.bottomBG, this.bottomBGSpriteFrames[0]);
            this.changeSprite(this.goldBG, this.goldBGSpriteFrames[0]);
            this.changeActive(this.bgAnima, false);
        }
    },

    changeSprite(sprite, spriteFrame){
        if(sprite){
            sprite.spriteFrame = spriteFrame;
        }
    },

    changeActive(node, active){
        if(node){
            node.active = active;
        }
    }
});
