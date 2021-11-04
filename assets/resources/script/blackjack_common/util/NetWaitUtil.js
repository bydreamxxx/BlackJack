/**
 * Created by wang on 2017/7/13.
 */
/**
 * Created by wang on 2017/7/13.
 */

var dd = cc.dd;
var UIMgr = require("UIMgr").Instance();

var NetWaitUtil = cc.Class({

    _instance: null,

    properties: {
        /**
         * ui节点
         */
        _node: null,
        /**
         * ui是否关闭
         */
        isClose: true,
    },

    ctor: function () {
        this.prefabPath = 'blackjack_common/prefab/com_net_wait';
    },

    statics: {
        Instance: function () {
            if (!this._instance) {
                this._instance = new NetWaitUtil();
            }
            return this._instance;
        },

        Destroy: function () {
            if (this._instance) {
                if (this._node) {
                    cc.game.removePersistRootNode(this._node);
                    this._node.destroy();
                }
                this._instance = null;
            }
        },
    },

    /**
     * 获取视图节点
     */
    getNode: function () {
        if (!this._node) {
            var prefab = cc.resources.get(this.prefabPath, cc.Prefab);
            this._node = cc.instantiate(prefab);
            this._node.active = false;
            cc.game.addPersistRootNode(this._node);
        }
        var size = cc.winSize;
        this._node.x = size.width / 2;
        this._node.y = size.height / 2;
        return this._node;
    },

    /**
     * 显示菊花转
     * @param text
     */
    show: function (text, text1) {
        //网络等待时,直接返回
        UIMgr.openUI("blackjack_common/prefab/com_mask");
        this.smooth_close();
        var node = this.getNode();
        var cpt = node.getComponent('com_net_wait');
        if (typeof text == 'undefined') {
            text = 'Networkconnection';
            text1 = '……';
        }
        cpt.show(text, text1);
        // node.parent = cc.find('Canvas');
        node.active = true;
    },

    /**
     * 关闭菊花转
     */
    close: function () {
        UIMgr.closeUI("com_mask");
        var node = this.getNode();
        node.active = false;
    },

    /**
     * 流畅显示
     * 只用于加载资源,解决加载动画卡顿问题,该加载动画永远在程序最上层,其他情况不用该方法
     * @param text
     */
    smooth_show: function (text) {
        // UIMgr.openUI("blackjack_common/prefab/com_smooth_mask");
        // if(cc.sys.isNative){
        //     this.close();
        //     cc.dd.native_systool.StartLoadingAni(text);
        // }else{
        //     this.show(text);
        // }
        this.show(text);
    },

    smooth_close: function () {
        // UIMgr.closeUI("com_smooth_mask");
        // if(cc.sys.isNative){
        //     cc.dd.native_systool.StopLoadingAni();
        // }else{
        //     this.close();
        // }
        this.close();
    },

    smooth_tips: function (text) {
        if (cc.sys.isNative) {
            cc.dd.native_systool.SetLoadingAniTips(text);
        } else {
            this.show(text);
        }
    },

    /**
     * 网络等待开始, 两秒后未收到网络回复,则显示此等待UI
     * @param text  显示文本
     * @param tag   标签
     */
    net_wait_start: function (text, tag) {
        if (this.net_wait_id) {
            clearTimeout(this.net_wait_id);
            this.net_wait_id = null;
        }

        let text1 = "";
        if(text === "网络状况不佳..."){
            text = "Poornetwork";
            text1 = "..."
        }

        this.net_waiting = false;
        this.close();
        this.net_wait_tag = tag;
        this.net_wait_id = setTimeout(function () {
            this.show(text, text1);
            this.net_waiting = true;
        }.bind(this), 2000);
    },

    /**
     * 网络等待结束
     * @param tag   标签
     */
    net_wait_end: function (tag) {
        if (this.net_wait_tag != tag) {
            return;
        }
        if (this.net_wait_id) {
            clearTimeout(this.net_wait_id);
            this.net_wait_id = null;
        }
        this.net_waiting = false;
        this.close();
    },
});

module.exports = NetWaitUtil;