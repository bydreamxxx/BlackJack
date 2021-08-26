var audio = require('sdy_audio');
var PlayerEvent = require('sdy_player_mgr').PlayerEvent;
var PlayerED = require('sdy_player_mgr').PlayerED;
var PlayerMgr = require('sdy_player_mgr').PlayerMgr;
var RoomData = require('sdy_room_data').RoomData;

cc.Class({
    extends: cc.Component,

    properties: {
        txt_shenqing_name: cc.Label,
        btn_refuse: cc.Button,
        btn_confirm: cc.Button,
        select_item: cc.Node,
        layout_select: cc.Layout,
        txt_left_time: cc.Label,
    },

    onLoad: function () {
        this.updateUI();
        var offset_time = parseInt((new Date().getTime() - RoomData.Instance().jiesan_start_time)/1000);
        var left_time = RoomData.Instance().jiesan_left_time - offset_time;
        if(left_time){
            //todo 结算定时器
        }
        PlayerED.addObserver(this);
    },

    onDestroy: function () {
        PlayerED.removeObserver(this);
    },

    updateUI: function () {
        var state_desc_arr = ['等待选择','同意','拒绝'];
        PlayerMgr.Instance().playerList.forEach(function (player) {
            if(player){
                if(player.is_agree == 3){
                    this.txt_shenqing_name.string = player.name;
                }else{
                    var select_item_ui = cc.instantiate(this.select_item).getComponent('sdy_jiesan_select_item');
                    if(select_item_ui){
                        select_item_ui.node.parent = this.layout_select;
                        select_item_ui.setName(player.name);
                        select_item_ui.setState(state_desc_arr[player.is_agree]);
                    }
                }
                if(player.user_id == cc.dd.user.id){
                    if(player.is_agree == 0){
                        this.btn_confirm.node.acitve = true;
                        this.btn_refuse.node.acitve = true;
                    }else{
                        this.btn_confirm.node.acitve = false;
                        this.btn_refuse.node.acitve = false;
                    }
                }
            }
        }.bind(this));
    },

    // onClickClose: function () {
    //     audio.com_btn_click();
    //     cc.dd.UIMgr.destroyUI(this.node);
    // },

    onClickRefuse: function () {
        audio.com_btn_click();
        var msg = cc.pb.sdy.msg_sdy_vote_dissolve_req();
        msg.setAgree(false);
        cc.gateNet.Instance().sendMsg(cc.netCmd.sdy.cmd_msg_sdy_vote_dissolve_req,msg,'msg_sdy_vote_dissolve_req',true);
    },

    onClickConfirm: function () {
        audio.com_btn_click();
        var msg = cc.pb.sdy.msg_sdy_vote_dissolve_req();
        msg.setAgree(true);
        cc.gateNet.Instance().sendMsg(cc.netCmd.sdy.cmd_msg_sdy_vote_dissolve_req,msg,'msg_sdy_vote_dissolve_req',true);
    },
    
    onEventMessage: function (event,data) {
        switch (event){
            case PlayerEvent.SDY_PLAYER_EVENT_JIESAN:
                this.updateUI();
                break;
            default:
                break;
        }
    }

});
