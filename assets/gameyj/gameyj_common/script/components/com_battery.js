cc.Class({
    extends: cc.Component,
    properties: {
        backgroundSpriteFrame: {default: null, type: cc.SpriteFrame, tooltip: '背景图片'},
        barSpriteFrame: {default: null, type: cc.SpriteFrame, tooltip: '进度条图片'},
    },
    timerId: undefined,

    onLoad: function () {
        this._initBackgroundSprite();
        this._initBarSprite();
        if(cc.sys.isNative){
            this.progress = cc.dd.native_systool.getBatteryLevel();;
            this.schedule(function () {
                this.progress = cc.dd.native_systool.getBatteryLevel();
                this._updateBarStatus()
            }, 5.0);
        }else{
            this.progress = 1;
        }
        this._updateBarStatus();
    },

    _initBackgroundSprite: function () {
        let node = new cc.Node("backgroundSprite");
        let sprite = node.addComponent(cc.Sprite);
        sprite.spriteFrame = this.backgroundSpriteFrame;
        node.parent = this.node;
    },

    _initBarSprite: function () {
        let node = new cc.Node("barSprite");
        let sprite = node.addComponent(cc.Sprite);
        sprite.spriteFrame = this.barSpriteFrame;
        node.parent = this.node;
        node.x -= 2;
        this.barNode = node;
        this.totalLength = node.width;
    },
    _updateBarStatus: function () {
        if (this.barNode) {
            let entity = this.barNode;

            if (!entity) return;

            const entityAnchorPoint = entity.getAnchorPoint();
            const entitySize = entity.getContentSize();
            const entityPosition = entity.getPosition();

            const anchorPoint = cc.v2(0, 0.5);
            const progress = cc.misc.clamp01(this.progress);
            const actualLenth = this.totalLength * progress;
            const finalContentSize = cc.size(actualLenth, entitySize.height);
            const anchorOffsetX = anchorPoint.x - entityAnchorPoint.x;
            const anchorOffsetY = anchorPoint.y - entityAnchorPoint.y;
            const finalPosition = cc.v2(this.totalLength * anchorOffsetX, entitySize.height * anchorOffsetY);

            entity.setPosition(entityPosition.add(finalPosition));

            entity.setAnchorPoint(anchorPoint);
            entity.setContentSize(finalContentSize);
        }
    },

});