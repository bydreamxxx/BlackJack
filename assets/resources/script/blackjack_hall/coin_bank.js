var dd = cc.dd;
var FortuneHallManager = require('FortuneHallManager').Instance();
var fortune_hall_msg_send = require('fortune_hall_msg_send').Instance();
var user = require("com_user_data");
var AudioPath = require("jlmj_audio_path");
var hall_audio_mgr = require('hall_audio_mgr').Instance();
const HallCommonData = require('hall_common_data').HallCommonData;
const msg_coin_pb = require('c_msg_baoxianxiang_coin_pb');
var hall_net = cc.gateNet;//require("hall_net");
var coin_protoId = require('c_msg_baoxianxiang_coin_cmd');

var LEAST_LIMIT = 30000;

var coin_bank = cc.Class({
    extends: cc.Component,
    properties: {
        //初始密码
        initBankWindow: {
            default: null,
            type: cc.Node,
        },

        initPass1: {
            default: null,
            type: cc.EditBox,
        },
        initPass2: {
            default: null,
            type: cc.EditBox,
        },
        //银行主界面
        bankMainWindow: {
            default: null,
            type: cc.Node,
        },
        bankMainMoney: {
            default: null,
            type: cc.EditBox,
        },
        bankMainPass: {
            default: null,
            type: cc.EditBox,
        },
        //赠送
        bankSendWindow: {
            default: null,
            type: cc.Node,
        },
        bankSendID: {
            default: null,
            type: cc.EditBox,
        },
        bankSendPassword: {
            default: null,
            type: cc.EditBox,
        },
        bankSendMoney: {
            default: null,
            type: cc.EditBox,
        },

        //修改密码
        bankChangePasWindow: {
            default: null,
            type: cc.Node,
        },
        bankChangePasOld: {
            default: null,
            type: cc.EditBox,
        },
        bankChangePasNew: {
            default: null,
            type: cc.EditBox,
        },
        bankChangePasNew2: {
            default: null,
            type: cc.EditBox,
        },
        //操作记录
        bankOperateWindow: {
            default: null,
            type: cc.Node,
        },

        needShow : true,
    },
    onLoad: function () {
        
    },
    onDestroy: function () {
        
    },

    onEventMessage: function (event, data) {
        switch (event) {
           
        }
    },
    resetInputField: function (event, custon) {
        if (this.bankSendPassword)
            this.bankSendPassword.string = "";
        if (this.bankSendID)
            this.bankSendID.string = "";
        if (this.bankSendMoney)
            this.bankSendMoney.string = "";

        if (this.initPass1)
            this.initPass1.string = "";
        if (this.initPass2)
            this.initPass2.string = "";

        if (this.bankMainMoney)
            this.bankMainMoney.string = "";
        if (this.bankMainPass)
            this.bankMainPass.string = "";

        if (this.bankChangePasOld)
            this.bankChangePasOld.string = "";
        if (this.bankChangePasNew)
            this.bankChangePasNew.string = "";
        if (this.bankChangePasNew2)
            this.bankChangePasNew2.string = "";
    },


    onClickInitPassWord: function (event, custom) {
    },

    onCloseInitWindow: function (event, custom) {
        this.initBankWindow.removeFromParent();
        hall_audio_mgr.com_btn_click();
    },

    //bank main
    onCloseBankMainWindow: function (event, custom) {
        this.bankMainWindow.removeFromParent();
        hall_audio_mgr.com_btn_click();
    },


    onCloseBankSendWindow: function (event, custom) {
        this.bankSendWindow.removeFromParent();
        hall_audio_mgr.com_btn_click();
    },


    onCloseChangePassWindow: function (event, custom) {
        
    },

    onCloseRecordWindow: function (event, custom) {
        this.bankOperateWindow.removeFromParent();
        hall_audio_mgr.com_btn_click();
    },

    onClickBankSaveBtn: function (event, custom) {
        if (event.type != "touchend") {
            return;
        }
        hall_audio_mgr.com_btn_click();
        if(this.bankMainMoney.string=="")
        {
            cc.dd.PromptBoxUtil.show("请输入存入金额");
            return false;
        }

        var sum = parseInt(this.bankMainMoney.string)
        if(sum<LEAST_LIMIT)
        {
            cc.dd.PromptBoxUtil.show("存入金额至少"+LEAST_LIMIT);
            return;
        }

        fortune_hall_msg_send.requestBankSaveCoin(sum);
    },



    onClickBankPickOutBtn: function (event, custom) {
        if (event.type != "touchend") {
            return;
        }
        hall_audio_mgr.com_btn_click();
        // if(this.checkPassWord(this.bankMainPass))
        // {
        var sum = parseInt(this.bankMainMoney.string)
        if(this.bankMainMoney.string == "" || sum<LEAST_LIMIT)
        {
            cc.dd.PromptBoxUtil.show("取出金额至少"+LEAST_LIMIT);
            return;
        }
        fortune_hall_msg_send.requestBankPickOutCoin(sum, this.bankMainPass.string);
       //}
        // AudioManager.playSound( AudioPath.Sound_ClickedButton );
    },


    openBankWindow: function (event, data, initOk) {
        
    },

    openSendWindow: function (event, custom) {
        
    },
    openChangePasWindow: function (event, custom) {
        
    },
    openBankRecord: function (event, custom) {
       
    },

    onClickSendBtn: function (event, custom) {
        
    },

    onClickChangPassBtn: function (event, custom) {
        
    },


    checkPassWord:function(node1,node2){
        
    },
    testCapture:function()
    {
        var canvasNode = cc.find('Canvas');
        var fileName = "screen_capture.png";
        cc.dd.SysTools.captureScreen(fileName,canvasNode,function()
        {
            if (cc.sys.OS_ANDROID == cc.sys.os) {
                jsb.reflection.callStaticMethod('game/WxTool', 'SaveFileToPhoto', '(Ljava/lang/String;)V', jsb.fileUtils.getWritablePath()+fileName);
            }else if(cc.sys.OS_IOS == cc.sys.os){
                jsb.reflection.callStaticMethod('WxTool', 'SendScreenShot');
            }
        });

    }
});
module.exports = coin_bank;
