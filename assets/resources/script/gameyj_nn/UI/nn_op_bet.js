var nn_data = require('nn_data');
cc.Class({
    extends: cc.Component,

    properties: {
        btn_1: { type: cc.Button, default: null, tooltip: '1倍' },
        btn_2: { type: cc.Button, default: null, tooltip: '2倍' },
        btn_3: { type: cc.Button, default: null, tooltip: '3倍' },
        btn_4: { type: cc.Button, default: null, tooltip: '4倍' },
        btn_5: { type: cc.Button, default: null, tooltip: '5倍' },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    onEnable() {
        var maxBet = nn_data.Instance().getMaxBet();
        cc.log('最大下注倍数: ' + maxBet);
        this.btn_1.interactable = (maxBet >= 1);
        this.btn_2.interactable = (maxBet >= 2);
        this.btn_3.interactable = (maxBet >= 3);
        this.btn_4.interactable = (maxBet >= 4);
        this.btn_5.interactable = (maxBet >= 5);
    },

    // update (dt) {},
});
