// create by wj 2018/05/10
var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        nameEditBox: cc.EditBox, //名字输入框
        phoneEditBox: cc.EditBox, //电话输入框
        adressEditBox: cc.EditBox, //地址
    },

    onLoad () {

    },

    setDataId: function(id, type){
        this.dataId = id;
        this.type = type;
    },

    //兑换按钮响应
    exchangeCall: function(event, data){
        hall_audio_mgr.com_btn_click();
        if(this.nameEditBox.string == ''){
            cc.dd.PromptBoxUtil.show('请输入姓名');
            return;
        }

        if(this.phoneEditBox.string == ''){
            cc.dd.PromptBoxUtil.show("请输入手机号!");
            return;
        }

        var nameReg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;//^[\u4E00-\u9FA5]{2,4}$/;
        if(!nameReg.test(this.phoneEditBox.string)){
            this.phoneEditBox.string = '';
            cc.dd.PromptBoxUtil.show("请输入正确的手机号!");
            return;
        }

        if(this.adressEditBox.string == ''){
            cc.dd.PromptBoxUtil.show('请输入地址');
            return;
        }

        var pbObj = new cc.pb.rank.msg_trade_shop_exchange_req();
        pbObj.setId(this.dataId );
        pbObj.setName(this.nameEditBox.string);
        pbObj.setPhone(this.phoneEditBox.string);
        pbObj.setAdd(this.adressEditBox.string);
        pbObj.setOpType(this.type);
        cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_msg_trade_shop_exchange_req, pbObj, 'msg_trade_shop_exchange_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'msg_trade_shop_exchange_req');

        cc.dd.UIMgr.destroyUI(this.node);
    },

    close: function(){
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },
});
