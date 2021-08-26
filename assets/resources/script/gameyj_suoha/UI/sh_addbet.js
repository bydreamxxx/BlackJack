//create by luke on 8/10/2020
let hall_audio_mgr = require('hall_audio_mgr').Instance();
cc.Class({
    extends: cc.Component,

    properties: {
        chips: [cc.Node],
        total_lbl: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this._value = 0;
        if (!this._list) {
            this._list = [1, 2, 5];
        }
        this.updateVal();
        if (!this._basescore)
            this._basescore = 1;
        this.chips[0].getComponentInChildren(cc.Label).string = this.genChipStr(this._list[0] * this._basescore);
        this.chips[1].getComponentInChildren(cc.Label).string = this.genChipStr(this._list[1] * this._basescore);
        this.chips[2].getComponentInChildren(cc.Label).string = this.genChipStr(this._list[2] * this._basescore);
    },

    setData(cur, max, basescore) {
        this._cur = cur;
        this._max = max;
        this._basescore = basescore;
    },

    changeChipsValue(list) {
        this._list = list;
        this.chips[0].getComponentInChildren(cc.Label).string = this.genChipStr(this._list[0] * this._basescore);
        this.chips[1].getComponentInChildren(cc.Label).string = this.genChipStr(this._list[1] * this._basescore);
        this.chips[2].getComponentInChildren(cc.Label).string = this.genChipStr(this._list[2] * this._basescore);
    },

    onChipClick(event, custom) {
        hall_audio_mgr.com_btn_click();
        switch (custom) {
            case '1':
                this.accumulateChips(this._list[0] * this._basescore);
                break;
            case '2':
                this.accumulateChips(this._list[1] * this._basescore);
                break;
            case '3':
                this.accumulateChips(this._list[2] * this._basescore);
                break;
            case '4':
                this.accumulateChips(this._max);
                break;
        }
    },

    accumulateChips(num) {
        var all = this._value + num;
        all > this._max && (all = this._max);
        this._value = all;
        this.updateVal();
    },

    onAddClick(event, custom) {
        let value = this._value;
        if (value == 0) return;
        hall_audio_mgr.com_btn_click();
        let cur = this._cur || 0;
        let sender = require('net_sender_suoha');
        sender.Raise(value + cur);
    },

    onClearClick(event, custom) {
        hall_audio_mgr.com_btn_click();
        this._value = 0;
        this.updateVal();
    },

    onCancelClick(event, custom) {
        hall_audio_mgr.com_btn_click();
        this.node.parent.getChildByName('game').active = true;
        this.node.active = false;
    },

    updateVal() {
        this.total_lbl.string = '' + this._value;
    },

    onDisable() {
        this._value = 0;
        this.updateVal();
    },

    genChipStr(num) {
        if (num > 9999)
            return '' + Math.floor(num / 100) / 100 + '万';
        else if (num > 999)
            return '' + Math.floor(num / 100) / 10 + '千';
        else
            return '' + num;
    }
    // update (dt) {},
});
