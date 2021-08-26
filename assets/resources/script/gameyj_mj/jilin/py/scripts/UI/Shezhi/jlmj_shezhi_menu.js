var jlmj_audio_mgr = require('jlmj_audio_mgr').Instance();
var jlmj_prefab = require('jlmj_prefab_cfg');
var DeskData = require('jlmj_desk_data').DeskData;
var DeskEvent = require('jlmj_desk_data').DeskEvent;
var DeskED = require('jlmj_desk_data').DeskED;
var RoomMgr = require( "jlmj_room_mgr" ).RoomMgr;
var jlmj_desk_jbc_data = require( "jlmj_desk_jbc_data" );
var jlmj_util = require('jlmj_util');
var UIZorder = require("mj_ui_zorder");

cc.Class({
    extends: cc.Component,

    properties: {
        touchNode:cc.Node,

        btn_guize:cc.Sprite,
        sp_guize:cc.Sprite,

        tuoguanBtn:cc.Button,//托管

        jiesanTTF:cc.Label,//解散文字节点
        tuichuTTF:cc.Label,//退出文字节点

        //规则图片资源
        spf_btn_guize:cc.SpriteFrame,
        spf_guize:cc.SpriteFrame,
        //托管图片资源
        spf_btn_tuoguan:cc.SpriteFrame,
        spf_tuoguan:cc.SpriteFrame,
    },

    // use this for initialization
    onLoad: function () {
        this.node.on(cc.Node.EventType.TOUCH_START,this.touchStart.bind(this));
        this.shezhi_menu = require('jlmj_shezhi_menu');
    },

    onSetting: function(event,custom) {
        jlmj_audio_mgr.com_btn_click();
        this.shezhi_menu.node.active = !this.shezhi_menu.node.active;
        var ani = this.shezhi_menu.node.getComponent(cc.Animation);
        ani.play('mj_shezhi_act');
        this.shezhi_menu.updateUI();
    },

    updateUI:function () {
        if(DeskData.Instance().isFriend()) { //朋友场
            this.tuoguanBtn.interactable = false;
            //DeskData.Instance().isauto_pai = !DeskData.Instance().isauto_pai;
            if(DeskData.Instance().isGameStart){
                this.jiesanTTF.node.active = true;
                this.tuichuTTF.node.active = false;
            }else{
                this.jiesanTTF.node.active = false;
                this.tuichuTTF.node.active = true;
            }
            if(DeskData.Instance().isDajiesuan){
                this.jiesanTTF.node.active = false;
                this.tuichuTTF.node.active = true;
            }
        }
    },

    /**
     * 触摸
     */
    touchStart:function (event) {
        if(!this.node.active){
            return false;
        }
        if (!this.touchNode.getBoundingBoxToWorld().contains(event.touch.getLocation())) {
            this.closeBtnCallBack();
        }
    },

    /**
     * 关闭
     */
    closeBtnCallBack:function () {
        cc.dd.UIMgr.closeUI(this.node);
    },
    /**
     * 退出
     */
    exitBtnCallBack:function () {
        // jlmj_audio_mgr.com_btn_click();
        // var msg = {};
        // msg.status = 0;
        // if(DeskData.Instance().isFriend()){ //朋友场
        //     // 已经开始
        //     if(DeskData.Instance().isDajiesuan){
        //         jlmj_util.enterHall();
        //     }else if(DeskData.Instance().isGameStart ) {
        //         msg.status = 3;
        //         DeskED.notifyEvent(DeskEvent.LEAVE_TIPS, msg);
        //     }else if(RoomMgr.Instance().isRoomer( cc.dd.user.id ) ) {
        //         msg.status = 1;
        //         DeskED.notifyEvent(DeskEvent.LEAVE_TIPS, msg);
        //     }else {
        //         msg.status = 2;
        //         DeskED.notifyEvent(DeskEvent.LEAVE_TIPS, msg);
        //     }
        // }else{  //金币场
        //     if( jlmj_desk_jbc_data.getInstance().getIsMatching() ) {
        //         //// 取消匹配状态
        //         msg.status = 5;
        //         DeskED.notifyEvent(DeskEvent.LEAVE_TIPS, msg);
        //     } else if( jlmj_desk_jbc_data.getInstance().getIsStart()) {
        //         msg.status = cc.find('Canvas/desk_info').getComponent('jlmj_desk_info')._jiesuan?6:4;
        //         DeskED.notifyEvent(DeskEvent.LEAVE_TIPS, msg);
        //     } else {
        //         jlmj_util.enterHall();
        //     }
        // }
        // this.closeBtnCallBack();
        jlmj_audio_mgr.com_btn_click();
        if(DeskData.Instance().isMatch()){
            return;
        }
        var msg = {};
        msg.status = 6;
        DeskED.notifyEvent(DeskEvent.LEAVE_TIPS, msg);
        this.closeBtnCallBack();
    },
    /**
     * 规则
     */
    guizeBtnCallBack:function () {
        jlmj_audio_mgr.com_btn_click();
        if(!DeskData.Instance().isFriend() && jlmj_desk_jbc_data.getInstance().getIsStart()) {
            const req = new cc.pb.jilinmajiang.p17_req_update_deposit();
            req.setIsdeposit(true);
            cc.gateNet.Instance().sendMsg(cc.netCmd.jilinmajiang.cmd_p17_req_update_deposit,req,"p17_req_update_deposit", true);
            this.closeBtnCallBack();
        }
    },
    /**
     *设置
     */
    shezhiBtnCallBack:function () {
        jlmj_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_SHEZHI,function (ui) {
            ui.zIndex = UIZorder.MJ_LAYER_POPUP;
            ui.getComponent("jlmj_shezhi").initZhuobuMenu('jlmj_zhuobu_set_');
        });
        this.closeBtnCallBack();
    },

});
