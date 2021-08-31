/** 
 *  Created by luke on 2018/12/21
*/
var nn_data = require('nn_data');
cc.Class({
    extends: cc.Component,

    properties: {
        btn_1: { type: cc.Button, default: null, tooltip: '1倍' },
        btn_2: { type: cc.Button, default: null, tooltip: '2倍' },
        btn_3: { type: cc.Button, default: null, tooltip: '3倍' },
        btn_4: { type: cc.Button, default: null, tooltip: '4倍' },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    onEnable() {
        var maxBank = nn_data.Instance().getMaxBankClub();
        cc.error('最大抢庄倍数: ' + maxBank);
        this.btn_1.interactable = (maxBank >= 1);
        this.btn_2.interactable = (maxBank >= 2);
        this.btn_3.interactable = (maxBank >= 3);
        this.btn_4.interactable = (maxBank >= 4);
    },

    // update (dt) {},
});
