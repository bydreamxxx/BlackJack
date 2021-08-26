//created by luke on 10/16/2020
const targetYPos = [96, 48, 0, -48, -96];//y坐标
cc.Class({
    extends: cc.Component,

    properties: {
        itemPrefab: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.itemList = [];
        this.delayList = [];
    },

    start() {

    },

    showEmoji(name, emojiId) {
        if (this.itemList.length >= targetYPos.length) {
            this.delayList.push({ name: name, emojiId: emojiId });
        }
        else {
            var tarY = targetYPos[this.itemList.length];
            var newNode = this.getNode();
            this.node.addChild(newNode);
            var scp = newNode.getComponent('sh_chat_item');
            scp.node.y = targetYPos[targetYPos.length - 1] - this.itemPrefab.data.height;
            scp.show(name, emojiId, tarY, this);
            this.itemList.forEach(item => {
                item.reduceTotalTime();
            });
            this.itemList.push(scp);
        }
    },

    removeItem: function (sh_chat_item) {
        for (var i = 0; i < this.itemList.length; i++) {
            if (this.itemList[i] === sh_chat_item) {
                this.itemList.splice(i, 1);
                break;
            }
        }
        this.promptBoxPool.put(sh_chat_item.node);
        sh_chat_item.node.active = false;
        //sh_chat_item.node.destroy();

        this.itemList.forEach(function (element, i) {
            element.changeMove(targetYPos[i]);
        });
        if (this.delayList.length > 0) {
            var msg = this.delayList.shift();
            this.showEmoji(msg.name, msg.emojiId);
        }
    },

    /**
     * 创建对象池
     * @return {any|*}
     */
    createPromptBoxPool: function () {
        this.promptBoxPool = new cc.NodePool();
        var prefab = this.itemPrefab;
        for (var i = 0; i < 5; i++) {
            var node = cc.instantiate(prefab);
            this.promptBoxPool.put(node);
            node.active = false;
        }
    },

    /**
     * 获取视图节点
     * @return {any}
     */
    getNode: function () {
        if (!this.promptBoxPool) {
            this.createPromptBoxPool();
        }
        if (this.promptBoxPool.size() == 0) {
            var prefab = this.itemPrefab;
            var item = cc.instantiate(prefab);
            this.promptBoxPool.put(item);
            item.active = false;
        }
        var node = this.promptBoxPool.get();
        return node;
        // var prefab = this.itemPrefab;
        // var item = cc.instantiate(prefab);
        // return item;
    },
    // update (dt) {},
});
