var jlmj_audio_mgr = require("jlmj_audio_mgr").Instance();
var jlmj_prefab = require('jlmj_prefab_cfg');
var UIZorder = require("mj_ui_zorder");

const AppCfg = cc.dd.AppCfg;
var Platform = require('Platform');
var _storagePath = null;

cc.Class({
    extends: cc.Component,

    properties: {
        touchNode:cc.Node,

        tuoguanBtn:cc.Button,//托管

        jiesanTTF:cc.Label,//解散文字节点
        tuichuTTF:cc.Label,//退出文字节点
    },

    // use this for initialization
    onLoad: function () {
        this.open_menu = false;
        this.touchNode.active = false;
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
            ani.play('mj_shezhi_act');
            this.touchNode.active = true;
        }
        this.upDateUI();
    },
    upDateUI:function () {

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
        jlmj_audio_mgr.com_btn_click();
        cc.dd.SceneManager.enterHall();
        this.closeBtnCallBack();
    },
    /**
     * 托管
     */
    tuoguanBtnCallBack:function () {
        jlmj_audio_mgr.com_btn_click();
        const req = new cc.pb.jilinmajiang.p17_req_update_deposit();
        req.setIsdeposit(true);
        cc.gateNet.Instance().sendMsg(cc.netCmd.jilinmajiang.cmd_p17_req_update_deposit,req,"p17_req_update_deposit", true);
        this.closeBtnCallBack();
    },
    /**
     *设置
     */
    shezhiBtnCallBack:function () {
        jlmj_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_SHEZHI,function (ui) {
            ui.zIndex = UIZorder.MJ_LAYER_POPUP;
        });
        this.closeBtnCallBack();
    },

    // update (dt) {},

    onClickFix(){
        jlmj_audio_mgr.com_btn_click();
        cc.log("修复麻将"+cc.dd.AppCfg.GAME_ID);

        cc.dd.DialogBoxUtil.show(0, '确定要修复当前游戏牌局？', '确定', '取消', ()=>{
            if (cc.sys.OS_ANDROID == cc.sys.os) {
                cc.log(cc.dd.user.id+"重连麻将日志"+cc.dd.AppCfg.GAME_ID);

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
        }, ()=> {
            cc.log("取消麻将"+cc.dd.AppCfg.GAME_ID);

            let forbidButton = this.getComponentInChildren("forbid_double_click");
            if(forbidButton){
                forbidButton.cleanCD();
            }
        });
    },

    JBCCheck(){
        return false;
    }
});
