// create by wj 2019/04/16
const StartColor = cc.color(32, 255, 32);
const EndColor = cc.color(255, 32, 32);
const Width = 80;
const Height = 80;
const Theta = Math.atan(Width / Height);

cc.Class({
    extends: cc.Component,

    probar: null,
    count: 0,

    properties: {

        //timeOverCallback : null,
        //needHide: true,

        headQuanSpr: cc.Sprite, //绿色倒计时框
    },

    // use this for initialization
    onLoad: function () {
        var node = this.node;
        this.probar = node.getComponent(cc.ProgressBar);
    },

    // setNeedHide: function(need){
    //     this.needHide = need;
    // },

    /**
     * 播放倒计时
     * @param {Number} duration  总时间s
     * @param {Function} callback  回调
     * @param {Number} curtime   当前时间s(用于重连)
     */
    playTimer(duration, callback, curtime) {
        if (curtime > duration) {
            curtime = duration;
        }
        this.unscheduleAllCallbacks();
        var stepTime = 0.05;
        this.time = duration;
        this.remain = curtime == null ? duration : curtime;
        this.callback = callback;
        var ratio = this.remain / this.time;
        this.headQuanSpr.fillRange = ratio;
        //this.headQuanSpr.node.color = cc.color(cc.misc.lerp(EndColor.r, StartColor.r, ratio), cc.misc.lerp(EndColor.g, StartColor.g, ratio), cc.misc.lerp(EndColor.b, StartColor.b, ratio));
        this.schedule(function () {
            this.remain -= stepTime;
            if (this.remain <= 0) {
                this.unscheduleAllCallbacks();
                if (this.callback) {
                    this.callback();
                }
            }
            else {
                var ratio = this.remain / this.time;
                this.headQuanSpr.fillRange = ratio;
            }
        }, stepTime);
    },

    playTimerLoop(duration) {
        this.unscheduleAllCallbacks();
        var stepTime = 0.05;
        this.time = duration;
        this.remain = duration;
        var ratio = this.remain / this.time;
        this.headQuanSpr.fillRange = ratio;
        /// this.headQuanSpr.node.color = cc.color(cc.misc.lerp(EndColor.r, StartColor.r, ratio), cc.misc.lerp(EndColor.g, StartColor.g, ratio), cc.misc.lerp(EndColor.b, StartColor.b, ratio));
        this.schedule(function () {
            this.remain -= stepTime;
            if (this.remain < 0) {
                this.remain = this.time;
            }
            var ratio = this.remain / this.time;
            this.headQuanSpr.fillRange = ratio;
        }, stepTime);
    },

    //停止倒计时
    stopTimer: function () {
        this.unscheduleAllCallbacks();
    },

    //计算位置
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

    // update : function (dt) {
    //     var progress = this.probar.progress;
    //     if (progress > 0) {
    //         progress -= dt/10;
    //     }else {
    //         if(this.timeOverCallback){
    //             this.timeOverCallback();
    //         }
    //         if(this.needHide)
    //             this.node.active = false;
    //         else
    //             progress = 1;
    //     }

    //     this.probar.progress = progress;
    // },

    // addTimeOverListener : function (cb) {
    //     if (typeof cb == 'function'){
    //         this.timeOverCallback = cb;
    //     }else{
    //         cc.warn('progressBar::addTimeOverCallback: cb not Function!');
    //     }
    // },

});

