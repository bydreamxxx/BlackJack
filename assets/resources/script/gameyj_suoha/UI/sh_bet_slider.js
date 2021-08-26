/**
 * Created by luke on 2018/12/5
 */
let hall_audio_mgr = require('hall_audio_mgr').Instance();
cc.Class({
    requireComponent: cc.Slider,

    extends: cc.Component,

    properties: {
        value_lbl: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },

    onDisable() {
        if (this.node.parent.getChildByName('input')) {
            this.node.parent.getChildByName('input').active = false;
        }
    },

    setData(cur, min, max, step, defalutPercent) {
        this._cur = cur;
        this._min = min;
        this._max = max;
        this._step = step || 100;
        this._value = min + defalutPercent * (max - min);
        this.getComponent(cc.Slider).progress = defalutPercent;
        this.getComponent(cc.ProgressBar).progress = defalutPercent;
        this.value_lbl.string = this.convertNumToStr(this._value);
    },

    convertNumToStr(num) {
        if (num < 10000) {
            return num.toString();
        }
        else if (num < 100000000) {
            return Math.round(num / 1000) / 10 + '万';
        }
        else {
            return Math.round(num / 10000000) / 10 + '亿';
        }
    },

    onSlider(event) {
        //this.getComponent(cc.ProgressBar).progress = event.progress;
        if (event.progress == 1) {
            this._value = this._max;
        }
        else {
            let add = (this._max - this._min) * event.progress;
            this._value = this._min + Math.floor(add / this._step) * this._step;
        }
        this.value_lbl.string = this.convertNumToStr(this._value);
    },

    onEnter() {
        hall_audio_mgr.com_btn_click();
        let value = this.getBetValue(this._value);
        let cur = this._cur || 0;
        let sender = require('net_sender_suoha');
        sender.Raise(value + cur);
    },

    getBetValue(num) {
        if (num > 99999999) {
            return Math.floor(num / 10000000) * 10000000;
        }
        else if (num > 9999) {
            return Math.floor(num / 1000) * 1000;
        }
        else {
            return num;
        }
    },

    onClose() {
        this.node.parent.active = false;
    },

    onTouchInput() {
        var input = cc.find('input', this.node.parent);
        input.getComponent(cc.EditBox).string = this._value.toString();
        input.active = true;
    },

    onTextChanged(text, _editbox) {
        // let value = parseInt(text);
        // if (value < this._min) {
        //     _editbox.string = this._min.toString();
        // }
        // else if (value > this._max) {
        //     _editbox.string = this._max.toString();
        // }
    },

    //最小距离100
    onTextDone(_editbox) {
        let value = parseInt(_editbox.string);
        if (value < this._min) {
            value = this._min;
        }
        else if (value > this._max) {
            value = this._max;
        }
        this._value = Math.floor(value / 100) * 100;
        this.value_lbl.string = this.convertNumToStr(this._value);
        let progress = (this._value - this._min) / (this._max - this._min);
        this.getComponent(cc.Slider).progress = progress;
        this.getComponent(cc.ProgressBar).progress = progress;
        _editbox.node.active = false;
    },

    update() {
        this.getComponent(cc.ProgressBar).progress = this.getComponent(cc.Slider).progress;
    },
});
