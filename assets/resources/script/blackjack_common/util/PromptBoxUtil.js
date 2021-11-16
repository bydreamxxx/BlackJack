/**
 * Created by wang on 2017/7/13.
 */

var dd = cc.dd;

var PromptBoxUtil = cc.Class({

    _instance: null,

    properties: {
        /**
         * 提示框对象池
         */
        promptBoxPool: null,
    },

    ctor: function () {
        this.prefabPath = 'blackjack_common/prefab/com_prompt_box';
        this.popList = [];
    },

    statics: {
        Instance: function () {
            if (!this._instance) {
                this._instance = new PromptBoxUtil();
            }
            return this._instance;
        },

        Destroy: function () {
            if (this._instance) {
                this._instance = null;
            }
        },
    },

    /**
     * 创建对象池
     * @return {any|*}
     */
    createPromptBoxPool: function () {
        this.promptBoxPool = new cc.NodePool();
        var prefab = cc.resources.get(this.prefabPath, cc.Prefab);
        for (var i = 0; i < 5; i++) {
            var node = cc.instantiate(prefab);
            this.promptBoxPool.put(node);
            cc.game.addPersistRootNode(node);
            node.active = false;
            this.popHeight = cc.find('bg', node).height;
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
            var prefab = cc.resources.get(this.prefabPath, cc.Prefab);
            var node = cc.instantiate(prefab);
            this.promptBoxPool.put(node);
            cc.game.addPersistRootNode(node);
            node.active = false;
        }
        var node = this.promptBoxPool.get();
        return node;
    },

    /**
     * 显示视图
     * @param text
     * @param bgSpf
     * @param 最多几条消息同屏(默认5条)
     * @param 背景长度
     */
    show: function (text, bgSpf, len, bgwidth) {
        var num = len ? len : 5;
        if (this.popList.length >= num)
            return;
        var node = this.getNode();
        node.active = true;
        this.popList.push(node);
        var cpt = node.getComponent('com_prompt_box');
        cpt.addViewCloseListener(function () {
            this.removePopItem(node);
            // node.stopAllActions();
            this.promptBoxPool.put(node);
            cc.game.addPersistRootNode(node);
            node.active = false;
        }.bind(this));

        var tarPos = this.getTargetPos(this.popList.length - 1);
        cpt.show(text, bgSpf, tarPos, bgwidth);
        var size = cc.winSize;
        node.x = size.width / 2;
        node.y = Math.min(size.height / 2, tarPos.y);

        var n1 = cc.find('bg', node);
        var n2 = cc.find('lbl', n1);
        var language = n2.getComponent('LanguageLabel');
        language.setText(text);
        // node.parent = cc.find('Canvas');
    },

    removePopItem: function (node) {
        for (var i = 0; i < this.popList.length; i++) {
            if (this.popList[i] === node) {
                this.popList.splice(i, 1);
                break;
            }
        }
        this.popList.forEach(function (element, i) {
            element.getComponent('com_prompt_box').changeMove(this.getTargetPos(i));
        }.bind(this));
    },

    getTargetPos: function (index) {
        var topPos = cc.v2(0, 0);
        var size = cc.winSize;
        topPos.x = size.width / 2;
        topPos.y = size.height / 4 * 3;
        topPos.y -= index * this.popHeight;
        return topPos;
    },
});

module.exports = PromptBoxUtil;