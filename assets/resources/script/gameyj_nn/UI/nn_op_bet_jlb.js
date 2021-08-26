/**
 * Created by luke on 2018/12/21
 */
var nn_data = require('nn_data');
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
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
        var bet = RoomMgr.Instance()._Rule.maxBet
        var maxBet = nn_data.Instance().getMaxBetClub();
        cc.log('最大下注倍数: ' + maxBet);
        switch (bet) {
            case 3:
                this.btn_2.interactable = true;
                this.btn_3.interactable = (maxBet >= 2);
                this.btn_4.interactable = (maxBet >= 3);
                break;
            case 6:
                this.btn_1.interactable = true;
                this.btn_2.interactable = (maxBet >= 2);
                this.btn_3.interactable = (maxBet >= 4);
                this.btn_4.interactable = (maxBet >= 6);
                break;
            case 8:
                this.btn_1.interactable = true;
                this.btn_2.interactable = (maxBet >= 3);
                this.btn_3.interactable = (maxBet >= 5);
                this.btn_4.interactable = (maxBet >= 8);
                break;
            case 9:
                this.btn_1.interactable = true;
                this.btn_2.interactable = (maxBet >= 3);
                this.btn_3.interactable = (maxBet >= 6);
                this.btn_4.interactable = (maxBet >= 9);
                break;
        }

    },

    // update (dt) {},
});
