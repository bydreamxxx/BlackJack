var hall_audio_mgr = require('hall_audio_mgr');
var Platform = require( "Platform" );
const AppCfg = require('AppConfig');
var hall_prefab = require('hall_prefab_cfg');
var TaskED = require('hall_task').TaskED;
var TaskEvent = require('hall_task').TaskEvent;

var Lottery_Type = cc.Enum(
    {
        Card: 0,
        Gold: 1,
    });

cc.Class({
    extends: cc.Component,

    properties: {
        lottery_type: 0,

    },

    onLoad: function () {
    },

    onDestroy: function () {
        this.lottery_type = 0;
    },

    onClickClose: function () {
        hall_audio_mgr.Instance().com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },


    onChooseType: function (type,data) {
        hall_audio_mgr.Instance().com_btn_click();
        this.lottery_type = parseInt(data);
        cc.dd.UIMgr.destroyUI(this.node);
        if(this.lottery_type == Lottery_Type.Card){
            cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_DAILY_LOTTERY_TICKET, function (node) {
                TaskED.notifyEvent(TaskEvent.LOTTERY_UPDATE_HISTORY, null);
            }.bind(this));
        }else if(this.lottery_type == Lottery_Type.Gold){
            cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_DAILY_LOTTERY_GOLD, function (node) {
                TaskED.notifyEvent(TaskEvent.LOTTERY_UPDATE_HISTORY, null);
            }.bind(this));
        }
    },

    /**
     * 事件处理
     * @param event
     * @param data
     */
    // onEventMessage:function (event,data) {
    //     switch (event){
    //         case WxEvent.SHARE:
    //             if(this.lottery_type != 0){
    //                 var msg = new cc.pb.rank.msg_share_friend_2s();
    //                 msg.setType(this.lottery_type);
    //                 cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_msg_share_friend_2s, msg, 'msg_share_friend_2s', true);
    //             }
    //             break;
    //         default:
    //             break;
    //     }
    // }
});
