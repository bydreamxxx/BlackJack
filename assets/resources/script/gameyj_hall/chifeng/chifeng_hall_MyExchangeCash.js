var hall_audio_mgr = require('hall_audio_mgr').Instance();
var hall_prefab = require('hall_prefab_cfg');
const hall_prop_data = require('hall_prop_data').HallPropData.getInstance();
const Hall = require('jlmj_halldata');

cc.Class({
    extends: cc.Component,

    properties: {
        log: cc.Node,
        defaultToggle: cc.Toggle,

        toggles: [cc.Toggle],
        toggleNums: [cc.Label],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.log.active = false;

        if(cc.game_pid == 2){
            this.toggleNums[0].string = '1元';
            this.toggleNums[1].string = '5元';
            this.toggleNums[2].string = '10元';

            this.toggles[0].checkEvents[0].customEventData = '1';
            this.toggles[1].checkEvents[0].customEventData = '5';
            this.toggles[2].checkEvents[0].customEventData = '10';
        }

        this.defaultToggle.check();

        Hall.HallED.addObserver(this);
    },

    onDestroy:function () {
        Hall.HallED.removeObserver(this);
    },

    onClickToggle(event, data){
        this.num = parseInt(data);
    },

    onClickExchange(){
        hall_audio_mgr.com_btn_click();

        if(cc.game_pid == 2){
            if(this.num != 1 && this.num != 5 && this.num != 10){
                cc.dd.PromptBoxUtil.show('兑换金额有误!请重新选择');
                return;
            }
        }else{
            if(this.num != 25 && this.num != 50 && this.num != 100){
                cc.dd.PromptBoxUtil.show('兑换金额有误!请重新选择');
                return;
            }
        }


        let data = hall_prop_data.getItemInfoByDataId(1004);
        if(data){
            var count = data.count / 100;
            if(count < this.num)
            {
                this.log.active = true;
                return;
            }
            var msg = new cc.pb.hall.msg_use_bag_item_req();
            msg.setUseType(1);
            msg.setItemDataId(data.dataId);
            msg.setNum(this.num * 100);

            cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_msg_use_bag_item_req,msg,"cmd_msg_use_bag_item_req", true);
            cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'msg_use_bag_item_req');
        }else{
            this.log.active = true;
        }
    },

    onClickClose(){
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
        cc.dd.UIMgr.openUI(hall_prefab.CHIFENG_MY_EXCHANGE);
    },

    onEventMessage:function (event,data) {
        switch (event) {
            case Hall.HallEvent.Use_Item_Ret:
                cc.dd.UIMgr.destroyUI(this.node);
                cc.dd.UIMgr.openUI(hall_prefab.CHIFENG_MY_EXCHANGE_SUCCESS, (ui)=>{
                    ui.getComponent('chifeng_hall_MyExchangeSuccess').setCode(data.code);
                });
                break;
        }
    }
});
