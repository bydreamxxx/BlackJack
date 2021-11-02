
var aniName = require('ConstantCfg').AnimationName;

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        duration: {
            default: 1,
            type: cc.Float,
            tooltip: '提示框显示的持续时间'
        },
        uptime: 1,
        /**
         * 提示框关闭事件
         */
        closeViewCallback: null,
    },

    // use this for initialization
    onLoad: function () {
        // this.duration = 1;
        this._baseBgFrame = cc.find('bg', this.node).getComponent(cc.Sprite).spriteFrame;
        this._baseBgWidth = cc.find('bg', this.node).width;
    },

    show: function (text, bgFrame, tarPos, bgWidth) {
        var bgNode = cc.find('bg', this.node);
        if (arguments[1]) {
            bgNode.getComponent(cc.Sprite).spriteFrame = bgFrame;
        }

        var lblNodt = cc.find('lbl', bgNode);
        var lblCpt = lblNodt.getComponent(require("LanguageLabel"));
        lblCpt.setText(text);
        if (bgWidth)
            bgNode.width = bgWidth;

        var ani = this.node.getComponent(cc.Animation);
        ani.play(aniName.PROMPT_BOX_START);

        if (tarPos) {
            this.target_pos = tarPos;
            this.curTime = 0;
            this.isMove = true;
        }
    },

    changeMove: function (pos) {
        var quickTime = 0.1;
        if (!this.isMove) {
            // this.node.runAction(cc.moveTo(quickTime, pos));
            cc.tween(this.node)
                .to(quickTime, { position: pos})
                .start();
        }
        else {
            this.target_pos = pos;
        }
    },

    actInFinished: function () {
        this.scheduleOnce(function (dt) {
            var ani = this.node.getComponent(cc.Animation);
            ani.play(aniName.PROMPT_BOX_END);
        }, this.duration);
    },

    actOutFinished: function () {
        this.close();
    },

    close: function () {
        this.curTime = null;
        cc.find('bg', this.node).getComponent(cc.Sprite).spriteFrame = this._baseBgFrame;
        cc.find('bg', this.node).width = this._baseBgWidth;
        if (this.viewCloseCallback) {
            this.viewCloseCallback();
        }
        // this.node.removeFromParent();
    },

    addViewCloseListener: function (cb) {
        this.viewCloseCallback = cb;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (this.curTime != null) {
            if (this.curTime >= this.uptime) {
                this.isMove = false;
            }
            else {
                this.node.x += (this.target_pos.x - this.node.x) * (dt / (this.uptime - this.curTime));
                this.node.y += (this.target_pos.y - this.node.y) * (dt / (this.uptime - this.curTime));
            }
            this.curTime += dt;
        }
    },
});
