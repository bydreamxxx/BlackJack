var ccmj_util = require("namj_util");
var namj_desk_data_jbc = require("namj_desk_data_jbc");

var DeskData = require("namj_desk_data").DeskData;
var DeskEvent = require("namj_desk_data").DeskEvent;
var DeskED = require("namj_desk_data").DeskED;

var mj_shezhi_menu = require("mj_shezhi_menu");

var jlmj_audio_mgr = require("jlmj_audio_mgr").Instance();
var jlmj_prefab = require('jlmj_prefab_cfg');


var UIZorder = require("mj_ui_zorder");
cc.Class({
    extends: mj_shezhi_menu,

    properties: {

    },


    upDateUI:function () {
        if(DeskData.Instance().isFriend()) { //朋友场
            //DeskData.Instance().isauto_pai = !DeskData.Instance().isauto_pai;
            this.tuoguanBtn.interactable = false;
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
     *设置
     */
    shezhiBtnCallBack:function () {
        jlmj_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_SHEZHI,function (ui) {
            ui.zIndex = UIZorder.MJ_LAYER_POPUP;
            ui.getComponent("jlmj_shezhi").initZhuobuMenu('namj_zhuobu_set_');
        });
        this.closeBtnCallBack();
    },

    /**
     * 托管
     */
    tuoguanBtnCallBack:function () {
        jlmj_audio_mgr.com_btn_click();
        if(!DeskData.Instance().isFriend() && namj_desk_data_jbc.getInstance().getIsStart()) {
            const req = new cc.pb.nonganmajiang.na_req_update_deposit();
            req.setIsdeposit(true);
            cc.gateNet.Instance().sendMsg(cc.netCmd.nonganmajiang.cmd_na_req_update_deposit,req,"na_req_update_deposit", true);
            this.closeBtnCallBack();
        }
    },

    /**
     * 退出
     */
    exitBtnCallBack:function () {
        jlmj_audio_mgr.com_btn_click();
        var msg = {};
        msg.status = 6;
        DeskED.notifyEvent(DeskEvent.LEAVE_TIPS, msg);
        this.closeBtnCallBack();
    },
});
