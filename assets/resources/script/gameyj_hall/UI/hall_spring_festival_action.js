//create by wj 2019/01/18
const Hall = require('jlmj_halldata');

cc.Class({
    extends: cc.Component,

    properties: {
        m_oZoom: cc.Node,
        m_oFireworksNode: cc.Prefab,
        m_nFireworksCount: 3,
        m_nScaleMin: 5,
        m_tActiveSprite: {default: [], type: cc.SpriteFrame, tooltip:'烟花上升图片'},
        m_oSpringWordNode: cc.Node,
    },

    onLoad:function () {
        if (!Hall.HallData.Instance().checkActivityIsOpen())
            return;
        this.showSpringWord();
        this.showFireworks();
    },

    ctor: function(){
        this.m_tSpringWord=[
            'hongzi',
            'lvzi',
            'zizi'
        ];

        this.m_tFireworks=[
            'hongdandu',
            'lvdandu',
            'zidandu',
        ];
    },

    showSpringWord: function(){
        if(this.m_oSpringWordNode){
            this.m_oSpringWordNode.active = true;
            var wordSkelton = this.m_oSpringWordNode.getComponent(sp.Skeleton);
            if(wordSkelton){
                var self = this;
                //随机生成颜色
                var color = parseInt(Math.random()*3,10);
                wordSkelton.clearTracks();
                wordSkelton.setAnimation(0, self.m_tSpringWord[color], false);
                wordSkelton.setCompleteListener(function(){
                    self.m_oSpringWordNode.active = false;
                    setTimeout(function(){
                        self.showSpringWord();
                    }, 800);
                });
            }
        }
    },

    showFireworks: function(){
        var fireworksNode = cc.instantiate(this.m_oFireworksNode);
        if(fireworksNode){
            fireworksNode.active = true;
            //随机生成大小
            var scale = parseInt(Math.random()*(10-this.m_nScaleMin+1) + this.m_nScaleMin,10) / 10;
            fireworksNode.scale = scale;
            //随机生成颜色
            var color = parseInt(Math.random()*3,10);
            //生成烟花
            var fireworks = cc.dd.Utils.seekNodeByName(fireworksNode, 'yanhua');
            var skeletonAct = fireworks.getComponent(sp.Skeleton);

            //生成烟花长条颜色
            var upSprite = cc.dd.Utils.seekNodeByName(fireworksNode, 'hongsheng');
            if(upSprite){
                upSprite.getComponent(cc.Sprite).spriteFrame = this.m_tActiveSprite[color];
            }

            //生成烟花爆炸位置
            var randx = Math.floor(10 - Math.random() * (20 + 1)) / 10 * Math.random();
            var randy = Math.floor(10 - Math.random() * (20 + 1)) / 10 * Math.random();
            var x = randx * this.m_oZoom.width / 2;
            var y = randy * this.m_oZoom.height / 2;
            
            fireworksNode.setPosition(cc.v2(x, -214));
            fireworksNode.parent = this.m_oZoom;
            var self = this;
            var seq = cc.sequence(cc.moveTo(0.5, cc.v2(x, y)), cc.callFunc(function () {
                upSprite.active = false;
                fireworks.active = true;
                if(skeletonAct){
                    skeletonAct.clearTracks();
                    skeletonAct.setAnimation(0, self.m_tFireworks[color], false);
                    skeletonAct.setCompleteListener(function(){
                        fireworksNode.removeFromParent(true);
                    });
                }
            }));
            fireworksNode.runAction(seq);
            setTimeout(function(){
                self.showFireworks();
            }, 800);
        }
    },
});
