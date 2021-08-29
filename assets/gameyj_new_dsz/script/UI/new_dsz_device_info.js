// create by wj 2019/05/16
const normal_color = cc.color(255, 255, 255);//cc.color(234, 227, 196);
const low_color = cc.color(245, 202, 0);
const warn_color = cc.color(196, 32, 32);

cc.Class({
    extends: cc.Component,

    properties: {
        time_lbl: { default: null, type: cc.Label, tooltip: '时间' },
        battery_prc: { default: [], type: cc.Node, tooltip: '电池' },
    },

    onLoad () {
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
        var progress = cc.clamp01(this.progress);
        var num = Math.ceil(progress / 0.2);
        for(var i = 0;i < 5; i++){
            this.battery_prc[i].active = i < num ? true: false;
            if (progress > 0.2 && progress <= 0.4) {
                this.battery_prc[i].color = low_color;
            }
            else if(progress <= 0.2){
                this.battery_prc[i].color = warn_color;
            }
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
