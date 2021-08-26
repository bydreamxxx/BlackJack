// create by wj 2019/09/10
var gFishMgr = require('FishDoyenManager').FishManager.Instance();
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onCollisionEnter:function(other,self){ 
        if (other.node.group != 'fish'){
            cc.log("碰撞不是fish");
            return ;
        }

        if(self.node.group != 'bullet'){
            cc.log("不是bullet碰撞");
            return;
        }

        var bulletId = self.node._tag;
        var fishId = other.node._tag;
        gFishMgr.onBulletHitFish(bulletId, fishId);
    },
});
