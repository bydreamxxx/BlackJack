const normal_color = cc.color(255, 255, 255);//cc.color(234, 227, 196);
const low_color = cc.color(245, 202, 0);
const warn_color = cc.color(196, 32, 32);
cc.Class({
    extends: cc.Component,
    properties: {
        time_lbl: { default: null, type: cc.Label, tooltip: '时间' },
        battery_prc: { default: null, type: cc.ProgressBar, tooltip: '电池' },
        percent_lbl: { default: null, type: cc.Label, tooltip: '百分比' },
    },

    onLoad: function () {
        this.originColor = this.battery_prc.node.color;
        if (cc.sys.isNative) {
            this.progress = cc.dd.native_systool.getBatteryLevel();
            this.schedule(function () {
                this.progress = cc.dd.native_systool.getBatteryLevel();
                this._updateStatus();
            }.bind(this), 5.0);
        } else {
            this.progress = 1;
            this.schedule(function () {
                this._updateStatus();
            }.bind(this), 5.0);
        }
        this._updateStatus();
    },

    _updateStatus: function () {
        var date = new Date();
        this.time_lbl.string = this.pad(date.getHours(), 2) + ':' + this.pad(date.getMinutes(), 2);
        var progress = cc.misc.clamp01(this.progress);
        if (progress > 0.4) {
            this.battery_prc.node.color = this.originColor;
        }
        else if (progress > 0.2) {
            this.battery_prc.node.color = low_color;
        }
        else {
            this.battery_prc.node.color = warn_color;
        }
        this.battery_prc.progress = progress;
        if (this.percent_lbl) {
            this.percent_lbl.string = Math.floor(progress * 100).toString() + '%';
        }
    },

    //补0
    pad: function (num, n) {
        var len = num.toString().length;
        while (len < n) {
            num = "0" + num;
            len++;
        }
        return num;
    },

});