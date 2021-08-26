// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        pageView: cc.PageView,              //pageview控件
        bgSprite: cc.SpriteFrame,           //背景图片
        selectSprite: cc.SpriteFrame,       //选中图片
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.pageView.node.on('page-turning', this.turnPage, this);
    },

    onDestroy() {
        this.pageView.node.off('page-turning', this.turnPage, this);
    },

    turnPage(event) {
        this.showIdx(event.detail.getCurrentPageIndex());
    },

    updatePageNum() {
        this.node.removeAllChildren();
        var pageNum = this.pageView.getPages().length;
        if (pageNum > 1) {
            this.node.active = true;
            for (var i = 0; i < pageNum; i++) {
                var node = new cc.Node('idx_' + i);
                var sp = node.addComponent(cc.Sprite);
                sp.spriteFrame = this.bgSprite;
                node.parent = this.node;
                var selectnode = new cc.Node('select');
                var sp2 = selectnode.addComponent(cc.Sprite);
                sp2.spriteFrame = this.selectSprite;
                selectnode.parent = node;
                selectnode.setPosition(0, 0);
                selectnode.active = false;
            }
            this.showIdx(0);
        }
        else {
            this.node.active = false;
        }
    },

    showIdx(idx) {
        this.node.children.forEach(node => {
            node.getChildByName('select').active = (node.name == ('idx_' + idx));
        });
    },
    // update (dt) {},
});
