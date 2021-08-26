//create by wj 201/08/30
var HallCommonObj = require('hall_common_data');
var HallCommonEd = HallCommonObj.HallCommonEd;
var HallCommonEvent = HallCommonObj.HallCommonEvent;
const hall_prop_data = require('hall_prop_data').HallPropData.getInstance();
var hall_audio_mgr = require('hall_audio_mgr').Instance();
const msg_coin_pb = require('c_msg_baoxianxiang_coin_pb');
var coin_protoId = require('c_msg_baoxianxiang_coin_cmd');
if(!cc.gateNet)
    cc.gateNet = require('GateNet');
var hall_net = cc.gateNet;

cc.Class({
    extends: cc.Component,

    properties: {
        bankCount:{
            default: null,
            type: cc.Label,
        },

        getSlider: {
            default: null,
            type:  cc.Slider,
        },

        getProgress: {
            default: null,
            type: cc.ProgressBar,
        },

        getEditBox: {
            default: null,
            type: cc.EditBox,
        },
    },

    onLoad () {
        HallCommonEd.addObserver(this);
        this.bankCount.string = hall_prop_data.getBankCoin()

    },

    onDestroy:function () {
        HallCommonEd.removeObserver(this);
     },

         //slider滑动
    onSliderMove: function(event, data){
        var slider = this.getSlider;
        var progressBar = this.getProgress;
        var editBox = this.getEditBox;
        var maxNum = hall_prop_data.getBankCoin();
        var progress = slider.progress;
        var value = progress;
        if(maxNum != 0){
            var num = parseInt(value * maxNum);
            if(num > maxNum)
                num = maxNum;
            editBox.string = num;
            if(progress > 1.0)
                progress = 1.0;
        }else{
            editBox.string = 0;
        }

        slider.progress = progress;
        progressBar.progress = progress;
    },

    onEditBoxEnterBegin: function(event, data){
        var slider = null;
        var progressBar = null;
        var editBox = null;

        slider = this.getSlider;
        progressBar = this.getProgress;
        editBox = this.getEditBox;
        editBox.placeholder = "";
        editBox.string = "";
        slider.progress = 0;
        progressBar.progress = 0;

    },

        //editBox输入改变
    onGetEditBoxEnterChanged: function(event, data){
        var n = Number(event);
        if(isNaN(n)){
            cc.dd.PromptBoxUtil.show("请输入正确的数字");
            return
        }
        var maxNum = hall_prop_data.getBankCoin();
        var num = 0
        num = parseInt(event);
        if(event == "")
            num  = 0;
        if(num > maxNum)
            this.getEditBox.string = maxNum;
        else
            this.getEditBox.string = num;
        if(maxNum != 0){
            var progress = num / maxNum;
            if(progress > 1)
                progress = 1;
            this.getSlider.progress = progress;
            this.getProgress.progress = progress;
        }

    },


    //editbox输入结束
    onEditBoxEnterEnd: function(event, data){

        // var str = "存入金币不少于3w金币";
        var slider = null;
        var progressBar = null;
        var editBox = null;
        var maxNum = 0;

        slider = this.getSlider;
        progressBar = this.getProgress;
        editBox = this.getEditBox;
        editBox.placeholder = "请输入取出数量";
            // str = "取出金币不少于3w金币";
        var n = Number(editBox.string);
        if(isNaN(n)){
            cc.dd.PromptBoxUtil.show("请输入正确的数字");
            editBox.string = '';
            if(data == '1')
                editBox.placeholder = "请输入存入数量";
            else
                editBox.placeholder = "请输入取出数量";
            return
        }
        //var num = parseInt(editBox.string);
        // if(num < 30000){
        //     editBox.string = '0';
        //     cc.dd.PromptBoxUtil.show(str);
        //     slider.progress = 0;
        //     progressBar.progress = 0;
        // }
    },

    onClickBagPickOutBtn: function (event, custom) {
        if (event.type != "touchend") {
            return;
        }
        hall_audio_mgr.com_btn_click();
        // if(this.checkPassWord(this.bankMainPass))
        // {
        var sum = parseInt(this.getEditBox.string)
        if(this.getEditBox.string == "")
        {
            //cc.dd.PromptBoxUtil.show("取出金额至少"+30000);
            return;
        }

        this.getSlider.progress = 0;
        this.getProgress.progress = 0;
        this.getEditBox.string = 0;
        var req = new msg_coin_pb.msg_coin_bank_take_2s();
        req.setCoin(sum);
        hall_net.Instance().sendMsg(coin_protoId.cmd_msg_coin_bank_take_2s, req,
            '取钱', true);
        //}
        // AudioManager.playSound( AudioPath.Sound_ClickedButton );
    },

    onClose: function(){
        hall_audio_mgr.com_btn_click();
        // 返回大厅
        cc.dd.UIMgr.destroyUI(this.node);
        
    },


    onEventMessage:function (event,data) {
        switch (event){
            case HallCommonEvent.BANK_MAIN_UPDATE_COIN:
            case HallCommonEvent.HALL_UPDATE_ASSETS:
            this.bankCount.string = hall_prop_data.getBankCoin();
            break;
        }   
    },
});
