// create by wj 2018/05/04

var CommonNodeUtil = cc.Class({
    _instance: null,
    ctor: function () {
        this.inited = false;
    },

    statics: {
        Instance: function () {
            if (!this._instance) {
                this._instance = new CommonNodeUtil();
            }
            return this._instance;
        },

        Destroy: function () {
            if (this._instance) {
                if (this._instance.commNode) {
                    this._instance.commNode.node.active = false;
                    cc.game.removePersistRootNode(this._instance.commNode.node);
                }
                this._instance = null;
            }
        },
    },
    /**
     * 设置通用长存节点
     */
    setCommonNode: function (componentName) {
        this.prefabPath = 'blackjack_common/prefab/commonNode';
        this.resetCommonNode(componentName);
        this.inited = true;
    },

    /**
     * 操作挂取的脚本
     */
    resetCommonNode: function (componentName) {
        if (this.commNode) {
            this.commNode.node.active = false;
            cc.game.removePersistRootNode(this.commNode.node);
        }
        var prefab = cc.resources.get(this.prefabPath, cc.Prefab);
        var node = cc.instantiate(prefab);
        this.commNode = node.getComponent(componentName);
        if (!this.commNode) {
            cc.log(this.prefabPath, ' 未挂脚本 ' + componentName);
            return;
        }
        cc.game.addPersistRootNode(this.commNode.node);
    },

    /**
     * 通用全局节点计时操作
     */
    opTimerControl: function (componentName, timelimit, totalTimer) {
        if (!this.inited) {
            this.setCommonNode(componentName);
            this.commNode.initTimerParem(timelimit, totalTimer)
        }
    },
});

module.exports = CommonNodeUtil;
