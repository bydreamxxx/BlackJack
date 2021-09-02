// create by wj 2018/04/12
const itemCfg = require('item');

cc.Class({
    extends: cc.Component,

    properties: {
        dragonBonesNode: cc.Node,
        Icon: cc.Sprite,
        countTxt: cc.Label,
        atals: cc.SpriteAtlas,
    },


    onLoad: function () {
        var bone = this.dragonBonesNode.getComponent(dragonBones.ArmatureDisplay);
        bone.addEventListener(dragonBones.EventObject.COMPLETE, function (event) {
            if (event.detail.animationState.name === "CC") {
                bone.armature().animation.play('XH', -1);
            }
        }, this);
        bone.playAnimation('CC', 1);
    },

    setData: function (itemId, count) {
        var item = itemCfg.getItem(function (data) {
            return data.key == parseInt(itemId);
        })
        if (item) {
            var sprite = this.atals.getSpriteFrame(itemId);
            this.Icon.node.width = sprite.getRect().width;
            this.Icon.node.height = sprite.getRect().height;
            this.Icon.spriteFrame = sprite;
        }
        if (item.key == 1004 || item.key == 1006 || item.key == 1099)
            count = (count / 100) + '元'
        else if (item.key == 1003)
            count = count + '张'
        else
            count = count + '个'
        this.countTxt.string = 'x' + count;
    },

    setAwradData: function (count) {
        this.countTxt.string = count;
    },

    close: function () {
        cc.dd.UIMgr.destroyUI(this.node);
    }
});
