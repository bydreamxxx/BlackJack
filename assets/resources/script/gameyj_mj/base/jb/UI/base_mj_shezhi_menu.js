var UIZorder = require("mj_ui_zorder");
let mjComponentValue = null;
let mjConfigValue = null;

const AppCfg = cc.dd.AppCfg;
var Platform = require('Platform');
var _storagePath = null;

let mj_shezhi = cc.Class({
    extends: cc.Component,

    properties: {
        touchNode:cc.Node,

        tuoguanBtn:cc.Button,//托管

        jiesanTTF:cc.Label,//解散文字节点
        tuichuTTF:cc.Label,//退出文字节点

        exitBtn: cc.Node,
    },

    ctor(){
        mjComponentValue = this.initMJComponet();
        mjConfigValue = this.initMJConfig();
        let _deskData = require(mjComponentValue.deskData);
        this.require_DeskData = _deskData.DeskData;
        this.require_DeskEvent = _deskData.DeskEvent;
        this.require_DeskED = _deskData.DeskED;
        this.require_deskJBCData = require(mjComponentValue.deskJBCData);
        this.require_playerMgr = require(mjComponentValue.playerMgr);


        this.require_jlmj_audio_mgr = require(mjConfigValue.audioMgr).Instance();
        this.require_jlmj_prefab = require(mjConfigValue.prefabCfg);
    },

    // use this for initialization
    onLoad: function () {
        this.open_menu = false;
        this.touchNode.active = false;
    },

    onSetting: function(event,custom) {
        this.require_jlmj_audio_mgr.com_btn_click();
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
            ani.play(mjConfigValue.shezhiAct);
            this.touchNode.active = true;
        }
        this.upDateUI();
    },
    upDateUI:function () {
        this.exitBtn.active = !this.require_DeskData.Instance().isMatch();

        if(this.require_DeskData.Instance().isFriend()) { //朋友场
            //this.require_DeskData.Instance().isauto_pai = !this.require_DeskData.Instance().isauto_pai;
            this.tuoguanBtn.interactable = false;
            if(this.require_DeskData.Instance().isGameStart){
                this.jiesanTTF.node.active = true;
                this.tuichuTTF.node.active = false;
            }else{
                this.jiesanTTF.node.active = false;
                this.tuichuTTF.node.active = true;
            }
            if(this.require_DeskData.Instance().isDajiesuan){
                this.jiesanTTF.node.active = false;
                this.tuichuTTF.node.active = true;
            }
        }
    },
    /**
     * 关闭
     */
    closeBtnCallBack:function () {
        if(!this.open_menu){
            return false;
        }
        var bg = cc.find("bg", this.node);
        bg.active = false;
        this.open_menu = false;
        this.touchNode.active = false;
    },

    /**
     * 退出
     */
    exitBtnCallBack:function () {
        this.require_jlmj_audio_mgr.com_btn_click();
        if(this.require_DeskData.Instance().isMatch()){
            return;
        }
        var msg = {};
        msg.status = 6;
        this.require_DeskED.notifyEvent(this.require_DeskEvent.LEAVE_TIPS, msg);
        this.closeBtnCallBack();
    },
    /**
     * 托管
     */
    tuoguanBtnCallBack:function () {
        this.require_jlmj_audio_mgr.com_btn_click();
        if(!this.require_DeskData.Instance().isFriend() && this.require_deskJBCData.getInstance().getIsStart()) {
            this.tuoguanFunc();
            this.closeBtnCallBack();
        }
    },
    /**
     *设置
     */
    shezhiBtnCallBack:function () {
        this.require_jlmj_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(this.require_jlmj_prefab.JLMJ_SHEZHI,function (ui) {
            ui.zIndex = UIZorder.MJ_LAYER_POPUP;
            ui.getComponent("jlmj_shezhi").initZhuobuMenu(mjComponentValue.mjZhuobu);
        });
        this.closeBtnCallBack();
    },

    onClickFix(){
        this.require_jlmj_audio_mgr.com_btn_click();
        cc.log("修复麻将"+cc.dd.AppCfg.GAME_ID);

        cc.dd.DialogBoxUtil.show(0, '确定要修复当前游戏牌局？', '确定', '取消', ()=>{
            if (cc.sys.OS_ANDROID == cc.sys.os) {
                if (!_storagePath)
                    _storagePath = jsb.reflection.callStaticMethod("game/SystemTool", "getInnerSDCardPath", "()Ljava/lang/String;");
                var filePath = _storagePath + "/xlqp_log.txt";
                if (jsb.fileUtils.isFileExist(filePath)) {
                    cc.dd.SysTools.uploadLog(jsb.fileUtils.getDataFromFile(filePath), Platform.uploadLogUrl[AppCfg.PID]);
                }
            }

            if(!cc.dd.mj_game_start || this.JBCCheck()){
                return;
            }
            cc.log("开始重连麻将"+cc.dd.AppCfg.GAME_ID);
            var login_module = require('LoginModule');
            login_module.Instance().reconnectWG();
            this.closeBtnCallBack();
        }, function() { });
    },

    JBCCheck(){
        if(!this.require_DeskData.Instance().isFriend()){
            return !this.require_deskJBCData.getInstance().getIsStart();
        }else{
            return false;
        }
    },

    initMJConfig(){
        return require('mjConfigValue').jlmj;
    },

    tuoguanFunc(){
        const req = new cc.pb.mjcommon.mj_req_update_deposit();
        req.setIsdeposit(true);
        cc.gateNet.Instance().sendMsg(cc.netCmd.mjcommon.cmd_mj_req_update_deposit,req,"mj_req_update_deposit", true);
    },

    initMJComponet(){
        cc.log("-----------------------no implements base_mj_shezhi_menu initMJComponet-----------------------")
        return require('mjComponentValue').base_mj;
    }
});

module.exports = mj_shezhi;
