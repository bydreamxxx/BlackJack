

const Width = 62;
const Height = 88;
const Theta = Math.atan(Width / Height);

const TOTAL_TIME=12;
//系统的暂停和恢复
let SysED = require("com_sys_data").SysED;
let SysEvent = require("com_sys_data").SysEvent;

cc.Class({
    extends: cc.Component,

    properties: {
        // time_lbl: cc.Label,
        headQuanSpr: cc.Sprite,
        // headQuanLightSpr: cc.Sprite,
        headAni: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        SysED.addObserver(this);
    },

    onDestroy: function () {
        SysED.removeObserver(this);
        this.stopSound();
    },

    
    //事件处理
    onEventMessage(event, data) {
        switch (event) {
            case SysEvent.PAUSE:
                this._syspausetime = new Date().getTime();
                cc.log('暂停 剩余倒计时:' + this.remain);
                break;
            case SysEvent.RESUME:
                if (this._syspausetime != null) {
                    let durtime = (new Date().getTime() - this._syspausetime) / 1000;
                    if (durtime < 10) {
                        if (this.remain) {
                            this.remain -= durtime;
                            cc.log('恢复 耗时' + durtime + ' 剩余倒计时:' + this.remain);
                        }
                    }
                }
                break;
        }
    },

    play: function (duration, callback, curtime) {
        if (curtime > duration) {
            curtime = duration;
        }
        this.unscheduleAllCallbacks();
        this.setActive(true);
        var stepTime = 0.05;
        // this.time = duration;
        this.remain = curtime == null ? duration : curtime;
        var ratio = this.remain / TOTAL_TIME;
        var pro=this.headQuanSpr.node.getComponent(cc.ProgressBar);
        // var pro2=this.headQuanLightSpr.node.getComponent(cc.ProgressBar);
        pro.progress=ratio;
        // pro2.progress=ratio;//1-ratio;
        this.callback = callback;

        var p = this.getPos(ratio);
        this.headAni.x = p.x;
        this.headAni.y = p.y;
        this.headAni.getComponent(cc.Animation).play();
        this.headAni.active = true;

        this.schedule(function () {
            this.remain -= stepTime;
            if (this.remain <= 0) {
                this.headAni.getComponent(cc.Animation).stop();
                this.headAni.active = false;
                this.unscheduleAllCallbacks();
                this.stopSound();
                if (this.callback) {
                    this.callback();
                }
                this.setActive(false);
            }
            else {
                if (Math.ceil(this.remain) <= 5) {
                    this.playSound();
                }
                else {
                    this.stopSound();
                }
                var ratio = this.remain / TOTAL_TIME;
                var pro=this.headQuanSpr.node.getComponent(cc.ProgressBar);
                // var pro2=this.headQuanLightSpr.node.getComponent(cc.ProgressBar);
                pro.progress=ratio;//1-ratio;
                // pro2.progress=ratio;
                var pos = this.getPos(ratio);
                this.headAni.x = pos.x;
                this.headAni.y = pos.y;
            }
        }, stepTime);
    },

    stop: function () {
        this.unscheduleAllCallbacks();
        this.stopSound();
    },

    setActive: function (active) {
        if (active) {

            this.node.active = true;
        }
        else {
            this.stopSound();
            this.headAni.getComponent(cc.Animation).stop();
            this.headAni.active = false;
            if (this.node.active) {
                this.stop();
                this.node.active = false;
            }
        }
    },

    playSound: function () {
        // if (this.headQuanSpr.node.parent.parent.name == 'head_down') {
        //     if (!this.soundId) {
        //         this.soundId = AudioManager.getInstance().playSound(ddz_audio_cfg.EFFECT.TIMER, true);
        //     }
        // }
    },
    stopSound: function () {
        // if (this.headQuanSpr.node == null)
        //     return;
        // if (this.headQuanSpr.node.parent.parent.name == 'head_down') {
        //     if (this.soundId) {
        //         AudioManager.getInstance().stopSound(this.soundId);
        //         this.soundId = null;
        //     }
        // }
    },
    getPos(value) {
        value = value < 0 ? 0 : (value > 1 ? 1 : value);
        value = 1 - value;
        var ang = 2 * Math.PI * value;
        var x = NaN, y = NaN;
        if (ang < Theta || ang >= 2 * Math.PI - Theta) {
            y = Height;
        }
        else if (ang < Math.PI - Theta) {
            x = Width;
        }
        else if (ang < Math.PI + Theta) {
            y = -Height;
        }
        else if (ang < 2 * Math.PI - Theta) {
            x = -Width;
        }

        if (ang < Theta) {
            x = Height * Math.tan(ang);
        }
        else if (ang < Math.PI / 2) {
            y = Width * Math.tan(Math.PI / 2 - ang);
        }
        else if (ang < Math.PI - Theta) {
            y = -Width * Math.tan(ang - Math.PI / 2);
        }
        else if (ang < Math.PI) {
            x = Height * Math.tan(Math.PI - ang);
        }
        else if (ang < Math.PI + Theta) {
            x = -Height * Math.tan(ang - Math.PI);
        }
        else if (ang < Math.PI * 3 / 2) {
            y = -Width * Math.tan(Math.PI * 3 / 2 - ang);
        }
        else if (ang < Math.PI * 2 - Theta) {
            y = Width * Math.tan(ang - Math.PI * 3 / 2);
        }
        else {
            x = -Height * Math.tan(Math.PI * 2 - ang);
        }
        return cc.p(x, y);
    },

});
