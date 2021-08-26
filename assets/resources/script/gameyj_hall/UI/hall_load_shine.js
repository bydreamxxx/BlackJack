// create by wj 2019/01/22

cc.Class({
    extends: cc.Component,

    properties: {
        shineParticle:cc.Node,
        m_oZoom: cc.Node,
    },

    onLoad: function () {
        this.createShine(true);
    },

    createShine: function(callBack){
        //随机生成星星类型
        var type = parseInt(Math.round(Math.random()))

        var randx = Math.floor(10 - Math.random() * (20 + 1)) / 10 * Math.random();
        var randy = Math.floor(10 - Math.random() * (20 + 1)) / 10 * Math.random();
        var x = randx * this.m_oZoom.width / 2;
        var y = randy * this.m_oZoom.height / 2;

        var shineNode = cc.instantiate(this.shineParticle);
        shineNode.active = true;
        shineNode.setPosition(cc.v2(x, y));
        shineNode.parent = this.m_oZoom;
        var skeletonAct = shineNode.getComponent(sp.Skeleton);
        var self = this;

        if(skeletonAct){
            //skeletonAct.clearTracks();
            skeletonAct.setAnimation(0, (type + 1), false);
            skeletonAct.setCompleteListener(function(){
                shineNode.removeFromParent(true);
                if(callBack){
                    var count = parseInt(Math.random()*3,10);
                    for(var i = 0; i <= count; i++){
                        if(i == count)
                            self.createShine(true);
                        else
                            self.createShine(false);
                    }
                }
            });
        }
    },

});
