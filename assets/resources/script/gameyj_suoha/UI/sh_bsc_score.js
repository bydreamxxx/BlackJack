/**
 * created by luke on 8/24/2020
 */
cc.Class({
    extends: cc.Component,

    properties: {
        lbl: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this._val = 0;
        this.lbl.string = '0';
        this.lbl.node.color = cc.color(36, 192, 36);
    },

    setValue(num) {
        this._rollScore = false;
        this._val = num;
        this.displayScore(num);
    },

    setChange(num) {
        this.startRoll(num + this._val);
    },

    //开始滚动
    startRoll(num) {
        if (!isNaN(num)) {
            this._rollScore = true;
            this._startNum = this._val;
            this._rollNum = num;
            this._val = num;
            this._rollTotalTime = 0.8;//滚动时间
            this._rollTime = 0;
        }
        else {
            this._rollScore = false;
            this.lbl.string = '0';
        }
    },


    //数字滚动
    update(dt) {
        if (this._rollScore) {
            this._rollTime += dt;
            var ratio = this._rollTime / this._rollTotalTime;
            var num = Math.floor(this._startNum + (this._rollNum - this._startNum) * ratio);
            if (this._rollNum - this._startNum > 0 && num > this._rollNum || this._rollNum - this._startNum < 0 && num < this._rollNum) num = this._rollNum;
            this.displayScore(num)
            if (this._rollTime >= this._rollTotalTime) {
                this._rollScore = false;
            }
        }
    },

    //显示
    displayScore(num) {
        var color = num < 0 ? cc.color(192, 36, 36) : cc.color(36, 192, 36);
        var abs = Math.abs(num);
        var str = num < 0 ? '-' : '';
        if (abs > 99999999) {
            str += Math.floor(abs / 1000000) / 100 + '亿';
        }
        else if (abs > 9999) {
            str += Math.floor(abs / 10000) + '万';
        }
        else {
            str += abs;
        }
        this.lbl.node.color = color;
        this.lbl.string = str;
    },
});
