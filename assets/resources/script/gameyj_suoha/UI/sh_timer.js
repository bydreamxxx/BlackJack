var AudioManager = require('AudioManager');
var ddz_audio_cfg = require('ddz_audio_cfg');
const Radius = 43.66;
const Width = 48.5;
const Height = 56.5;
const Theta = Math.atan(Width / Height);
const StartColor = cc.color(32, 255, 32);
const EndColor = cc.color(255, 32, 32);
cc.Class({
    extends: cc.Component,

    properties: {
        time_lbl: cc.Label,
        headQuanSpr: cc.Sprite,
        headAni: cc.Node,
    },

    // use this for initialization
    onLoad: function () {

    },

    onDestroy: function () {
        this.stopSound();
    },

    play: function (duration, callback, curtime) {
        if (curtime > duration) {
            curtime = duration;
        }
        this.unscheduleAllCallbacks();
        this.setActive(true);
        var stepTime = 0.05;
        this.time = duration;
        this.remain = curtime == null ? duration : curtime;
        this.callback = callback;
        this.time_lbl.string = this.remain > 9 ? this.remain.toString() : ('0' + this.remain.toString());
        var ratio = this.remain / this.time;
        this.headQuanSpr.fillRange = ratio;
        this.headQuanSpr.node.color = cc.color(cc.lerp(EndColor.r, StartColor.r, ratio), cc.lerp(EndColor.g, StartColor.g, ratio), cc.lerp(EndColor.b, StartColor.b, ratio));
        var p = this.getPos(ratio);
        this.headAni.x = p.x;
        this.headAni.y = p.y;
        this.headAni.getComponent(cc.Animation).play();
        this.headAni.parent.active = true;
        this.schedule(function () {
            this.remain -= stepTime;
            if (this.remain <= 0) {
                this.headAni.getComponent(cc.Animation).stop();
                this.headAni.parent.active = false;
                this.time_lbl.string = '00';
                this.unscheduleAllCallbacks();
                this.stopSound();
                if (this.callback) {
                    this.callback();
                }
            }
            else {
                if (Math.ceil(this.remain) <= 5) {
                    this.playSound();
                }
                else {
                    this.stopSound();
                }
                this.time_lbl.string = Math.ceil(this.remain) > 9 ? Math.ceil(this.remain).toString() : ('0' + Math.ceil(this.remain).toString());
                var ratio = this.remain / this.time;
                this.headQuanSpr.fillRange = ratio;
                this.headQuanSpr.node.color = cc.color(cc.lerp(EndColor.r, StartColor.r, ratio), cc.lerp(EndColor.g, StartColor.g, ratio), cc.lerp(EndColor.b, StartColor.b, ratio));
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
        var ani = this.node.getComponent(cc.Animation);
        if (active) {
            if (ani) {
                ani.play('timer_in');
            }
            this.node.active = true;
        }
        else {
            this.stopSound();
            this.headAni.getComponent(cc.Animation).stop();
            this.headAni.parent.active = false;
            if (this.node.active) {
                this.stop();
                if (ani) {
                    ani.stop();
                }
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
        return cc.v2(x, y);
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
