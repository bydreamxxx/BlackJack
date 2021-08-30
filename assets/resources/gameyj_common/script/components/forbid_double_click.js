//created by luke on 2019/6/13
/**
 * 避免cc.Button重复点击 导致发送多次消息
 */
const MAX_REPEAT = 2;  //单位时间内点击达到n+1次 提示
cc.Class({

    extends: cc.Component,

    properties: {
        time: { default: 0.5, tooltip: '两次点击间隔时间' },
    },

    // LIFE-CYCLE CALLBACKS:
    start() {
        var button = this.node.getComponent(cc.Button);
        if (!button)
            return;
        this._button = button;
        this._clickEvents = button.clickEvents;
        this.node.on('click', this.onClick, this);

        this.tempTime = 0;
        this.clickTime = null;
        this.lastTime = 0;
        this.repeatCount = 0;
    },

    //点击之后 按钮进入cd状态
    onClick() {
        var self = this;

        if (!this._cd) {
            this.lastTime = this.time;
            this.clickTime = new Date().getTime();
            this._cd = true;
            this.tempTime = 0;
            this._button.clickEvents = [];
            this.repeatCount = 0;
        } else {

            if (!cc.dd._.isNull(this.clickTime)) {
                let tempTime = new Date().getTime() - this.clickTime;
                this.lastTime = Math.ceil((this.time * 1000 - tempTime) / 1000);

                if (this.lastTime <= 0) {
                    this.lastTime = 0;
                }
            }

            this.repeatCount++;
            if (this.repeatCount >= MAX_REPEAT)
                cc.dd.PromptBoxUtil.show("点击过于频繁，请等待" + Math.ceil(this.lastTime) + "秒钟后重试");

            if (this.lastTime <= 0) {
                this.cleanCD();
            }
        }
    },

    cleanCD() {
        this._cd = false;
        this._button.clickEvents = this._clickEvents;
        this.clickTime = null;
        this.lastTime = this.time;
        this.repeatCount = 0;
    },

    onDisable() {
        if (this._cd) {
            this.cleanCD();
        }
    },

    onEnable() {
        if (this._cd) {
            this.cleanCD();
        }
    },

    update(dt) {
        if (this._cd) {
            if (this.lastTime > 0) {
                if (this.tempTime >= 1) {
                    this.tempTime = 0;

                    if (!cc.dd._.isNull(this.clickTime)) {
                        let tempTime = new Date().getTime() - this.clickTime;
                        this.lastTime = Math.ceil((this.time * 1000 - tempTime) / 1000);

                        if (this.lastTime <= 0) {
                            this.cleanCD();
                        }
                    } else {
                        this.cleanCD();
                    }
                } else {
                    this.tempTime += dt;
                }
            } else {
                this.cleanCD();
            }
        }
    }
});
