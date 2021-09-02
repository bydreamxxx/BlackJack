var ResLoader = require("ResLoader").ResLoader;
const TAG_NONE = 0;
const TAG_CLOSE = 1;
const TAG_DESTROY = 2;

var UIMgr = cc.Class({

    statics: {
        s_uimgr: null,

        Instance: function () {
            if (!this.s_uimgr) {
                this.s_uimgr = new UIMgr();
            }
            return this.s_uimgr;
        },

        Destroy: function () {
            if (this.s_uimgr) {
                this.s_uimgr = null;
            }
        },
    },

    ctor: function () {

    },

    /**
     * 打开UI
     * @param prefabPath
     * @param onOpen
     * @returns {*}
     */
    openUI: function (path, onOpen) {
        var name = this.path2name(path);
        var ui = this.getUI(name);
        if (ui) {
            cc.log("打开UI:" + name);
            if (ui.tagname == TAG_CLOSE || ui.tagname == TAG_DESTROY) {
                // if (ui.getChildByName('actNode')) {
                //     ui.getChildByName('actNode').stopAllActions();
                // }
                ui.tagname = TAG_NONE;
            }
            ui.active = true;
            if (!cc.dd._.isUndefined(onOpen)) {
                onOpen(ui);
            }
            this.showActS2B(ui);
            return ui;
        } else {
            let prefab = null;
            if (path.search("blackjack_common") == -1 && path.search("gameyj_hall") == -1 && path.search("gameyj_loading") == -1) {
                let str = path.split("/");
                let bundle = cc.assetManager.getBundle(str);
                if (bundle) {
                    prefab = bundle.get(path, cc.Prefab);
                }
            } else {
                prefab = cc.resources.get(path, cc.Prefab);
            }

            if (prefab) {
                ui = cc.instantiate(prefab);
                var canvas = cc.find('Canvas');
                if (canvas == null) {
                    return null;
                }
                ui.parent = canvas;
                //缩放
                cc.dd.SysTools.resizeByScreenSize(ui, true);
                ui.name = name;
                cc.log("打开UI:" + name);
                if (!cc.dd._.isUndefined(onOpen)) {
                    onOpen(ui);
                }
                this.showActS2B(ui);
                return ui;
            } else {
                ResLoader.loadPrefab(path, function (prefab) {
                    cc.log("加载UI:" + name);
                    var ui = this.getUI(name);
                    if (cc.dd._.isNull(ui) || cc.dd._.isUndefined(ui)) {
                        ui = cc.instantiate(prefab);
                        var canvas = cc.find('Canvas');
                        if (canvas == null) {
                            return null;
                        }
                        ui.parent = canvas;
                        //缩放
                        cc.dd.SysTools.resizeByScreenSize(ui, true);
                        ui.name = name;
                        cc.log("打开UI:" + name);
                    }
                    if (!cc.dd._.isUndefined(onOpen)) {
                        onOpen(ui);
                    }
                    this.showActS2B(ui);
                }.bind(this));
                return null;
            }
        }
    },


    /**
     * 关闭UI
     * @param prefabNameOrNode
     */
    closeUI: function (prefabNameOrNode) {
        if (typeof (prefabNameOrNode) == 'string') {
            var name = this.path2name(prefabNameOrNode);
            var ui = this.getUI(name);
            if (ui) {
                ui.tagname = TAG_CLOSE;
                cc.log("关闭UI:" + name);
                var func = function () {
                    ui.tagname = TAG_NONE;
                    ui.active = false;
                }
                this.showActB2S(ui, func);
            }
        } else {
            if (prefabNameOrNode instanceof cc.Node) {
                cc.log("关闭UI:" + prefabNameOrNode.name);
                prefabNameOrNode.tagname = TAG_CLOSE;
                var func = function () {
                    prefabNameOrNode.tagname = TAG_NONE;
                    prefabNameOrNode.active = false;
                }
                this.showActB2S(prefabNameOrNode, func);
            }
        }
    },

    /**
     * 销毁UI
     * @param prefabNameOrNode
     */
    destroyUI: function (prefabNameOrNode) {
        if (typeof (prefabNameOrNode) == 'string') {
            var name = this.path2name(prefabNameOrNode);
            var ui = this.getUI(name);
            if (ui) {
                ui.tagname = TAG_DESTROY;
                cc.log("销毁UI:" + name);
                var func = function () {
                    ui.tagname = TAG_NONE;
                    // if(ui._prefab&&ui._prefab.asset){
                    //     var deps = cc.loader.getDependsRecursively(ui._prefab.asset);
                    // }
                    ui.destroy();
                    // if(deps){
                    //     cc.loader.release(deps);
                    //     cc.sys.garbageCollect();
                    // }
                }
                this.showActB2S(ui, func);
            }
        } else {
            if (prefabNameOrNode instanceof cc.Node) {
                cc.log("销毁UI:" + prefabNameOrNode.name);
                prefabNameOrNode.tagname = TAG_DESTROY;
                var func = function () {
                    prefabNameOrNode.tagname = TAG_NONE;
                    // if(prefabNameOrNode._prefab&&prefabNameOrNode._prefab.asset){
                    //     var deps = cc.loader.getDependsRecursively(prefabNameOrNode._prefab.asset);
                    // }
                    prefabNameOrNode.destroy();
                    // if(deps){
                    //     cc.loader.release(deps);
                    //     cc.sys.garbageCollect();
                    // }
                }
                this.showActB2S(prefabNameOrNode, func);
            }
        }
    },

    /**
     * 获取UI
     * @param prefabName
     * prefab_name:必须唯一,父节点为Canvas
     */
    getUI: function (path) {
        var canvas = cc.find('Canvas');
        if (canvas == null) {
            return null;
        }
        var name = this.path2name(path);
        return canvas.getChildByName(name);
    },

    /**
     * 更新UI
     * @param path  节点路径
     * @param cpt_name  组件名称
     * @param func  函数名称
     * @param args  函数参数【数组】
     */
    updateUI: function (path, cpt_name, func, args) {
        var node = cc.find(path);
        if (node == null) {
            cc.warn("updateUI 不存在节点 ", path);
            return;
        }
        var cpt = node.getComponent(cpt_name);
        if (cpt == null) {
            cc.warn("updateUI 不存在组件 ", cpt_name);
            return;
        }
        func.apply(cpt, args);
        // func = func.bind(cpt);
        // func(...args);
    },

    /**
     * path 转 name
     * @param path
     * @returns {*}
     */
    path2name: function (path) {
        var idx = path.lastIndexOf("/");
        if (idx != -1) {
            path = path.substring(idx + 1);
        }
        return path;
    },

    /**
     * 从小变大特效
     */
    showActS2B: function (ui) {
        // if (ui) {
        //     var actNode = ui.getChildByName('actNode');
        //     if (actNode) {
        //         actNode.setScale(0.5);
        //         var scale = cc.scaleTo(0.15, 1.0);
        //         var seq = cc.sequence(cc.delayTime(0.05), scale);
        //         actNode.runAction(seq);
        //     }
        // }
    },

    /**
     * 从大变小
     */
    showActB2S: function (node, callFunc) {
        if (callFunc)
            callFunc();
    },
});

module.exports = UIMgr;
