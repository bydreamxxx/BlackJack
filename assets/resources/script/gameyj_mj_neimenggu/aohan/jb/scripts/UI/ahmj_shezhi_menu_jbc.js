var ahmj_util = require("ahmj_util");
var ahmj_desk_data_jbc = require("ahmj_desk_data_jbc");

var DeskData = require("ahmj_desk_data").DeskData;
var DeskEvent = require("ahmj_desk_data").DeskEvent;
var DeskED = require("ahmj_desk_data").DeskED;

var mj_shezhi_menu = require("mj_shezhi_menu");

var jlmj_audio_mgr = require("nmmj_audio_mgr").Instance();
var jlmj_prefab = require('nmmj_prefab_cfg');
var playerMgr = require("ahmj_player_mgr");

var UIZorder = require("mj_ui_zorder");
cc.Class({
    extends: mj_shezhi_menu,

    properties: {

    },

    onSetting: function(event,custom) {
        jlmj_audio_mgr.com_btn_click();
        if(this.open_menu){
            var bg = cc.find("bg", this.node);
            bg.active = false;
            this.open_menu = false;
            this.touchNode.active = false;
        }else{
            var bg = cc.find("bg", this.node);
            bg.active = true;
            this.open_menu = true;

            var ani = this.node.getComponent(cc.Animation);
            ani.play('nmmj_shezhi_act');
            this.touchNode.active = true;
        }
        this.upDateUI();
    },

    upDateUI:function () {
        if(DeskData.Instance().isFriend()) { //朋友场
            //DeskData.Instance().isauto_pai = !DeskData.Instance().isauto_pai;
            // this.tuoguanBtn.interactable = false;
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
            ui.getComponent("jlmj_shezhi").initZhuobuMenu('ahmj_zhuobu_set_');
        });
        this.closeBtnCallBack();
    },

    /**
     * 托管
     */
    tuoguanBtnCallBack:function () {
        jlmj_audio_mgr.com_btn_click();
        if(!DeskData.Instance().isFriend() && ahmj_desk_data_jbc.getInstance().getIsStart()) {
            const req = new cc.pb.aohanmj.aohan_req_update_deposit();
            req.setIsdeposit(true);
            cc.gateNet.Instance().sendMsg(cc.netCmd.aohanmj.cmd_aohan_req_update_deposit,req,"p16_req_update_deposit", true);
            this.closeBtnCallBack();
        }
    },

    /**
     * 退出
     */
    exitBtnCallBack:function () {
        jlmj_audio_mgr.com_btn_click();
        if(DeskData.Instance().isMatch()){
            return;
        }
        var msg = {};
        msg.status = 6;
        DeskED.notifyEvent(DeskEvent.LEAVE_TIPS, msg);
        this.closeBtnCallBack();
    },

    onClickGPS() {
        jlmj_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(jlmj_prefab.NMMJ_GPS, (ui) => {
            ui.getComponent('jlmj_gps').setGpsData(playerMgr.Instance().playerList);
        });
        this.closeBtnCallBack();
    }
});
