// create by wj 2019/10/12
var CFish = require('FishNode').CFish;
const FishType = require('FishTypeCfg');

cc.Class({
    extends: cc.Component,

    properties: {
        itemWith: 197,
        itemHeight: 150,
        off_With: 30,
        off_Height: 30,
        m_ItemNode: cc.Node,
        m_Content: cc.Node,
    },

    onLoadList: function (list) {
        for (var i = 0; i < list.length; i++) {
            var fish = list[i];
            if (fish) {
                var fishNode = cc.instantiate(this.m_ItemNode);
                fishNode.parent = this.m_Content;
                fishNode.active = true;

                var betTxt = fishNode.getChildByName('bet').getComponent(cc.Label);
                betTxt.string = fish.fish_show;

                var showFish = CFish.createFishTypeNode(fish, 110);//创建鱼
                showFish.center = cc.v2(0, 0);
                //showFish.setRotation(180);
                var fishAnchor = fishNode.getChildByName('fishAnchor'); //鱼位置点
                if (fishAnchor)
                    fishAnchor.addChild(showFish);

                var cnt = i + 1;
                var y = (Math.floor(i / 5) + 0.5) * this.itemHeight + (Math.floor(i / 5) + 0.5) * this.off_Height;
                fishNode.y = -y;

                var index = cnt % 5;
                if (index == 0) { index = 5 };
                var x = (index - 0.5) * this.itemWith + (index - 0.5) * this.off_With;
                fishNode.x = x;

                this.m_Content.height = (cnt / 5 + 1) * this.itemHeight + (cnt / 5 + 1) * this.off_Height;
            }
        }
    },
    onClose: function () {
        AudioManager.playSound(FishType.fishAuidoPath + '7002', false);
        cc.dd.UIMgr.destroyUI(this.node);
    }
});
