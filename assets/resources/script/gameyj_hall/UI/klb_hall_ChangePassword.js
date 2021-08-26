var hall_audio_mgr = require('hall_audio_mgr').Instance();
var LoginData = require('jlmj_login_data');
var Platform = require('Platform');
cc.Class({
    extends: cc.Component,

    properties: {
        old_password: cc.EditBox,
        new_password: cc.EditBox,
        confirm_password: cc.EditBox,
        code: cc.EditBox,
        //倒计时lable
        bindTimeTxt: cc.Label,
        //获取验证码按钮
        opBtn: cc.Node,
    },

    onLoad(){
        this.timer = 0;
        this.totalTime = 0;
        this.updateTag = false;

        this.firstAccount = LoginData.Instance().getLastAccountLoginInfo(true);
    },

    onClickChangePassword(){
        // if(this.old_password.string == ""){
        //     cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_22);
        // }else if(this.old_password.string.length < 6){
        //     cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_28);
        // }else if(!/(^[A-Za-z0-9]+$)/.test(this.old_password.string)) {
        //     cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_29);
        if(this.new_password.string == ""){
            cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_22);
        }else if(this.new_password.string.length < 6){
            cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_28);
        }else if(!/(^[A-Za-z0-9]+$)/.test(this.new_password.string)) {
            cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_29);
        }else if(this.confirm_password.string == ""){
            cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_22);
        }else if(this.confirm_password.string.length < 6){
            cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_28);
        }else if(!/(^[A-Za-z0-9]+$)/.test(this.confirm_password.string)) {
            cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_29);
        }else if(this.new_password.string != this.confirm_password.string){
            cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_31);
        }else if(this.new_password.string == this.firstAccount.password){
            cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_30);
        }else if(this.code.string == ""){
            cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_23);
        }else if(!/(^\d{4}$)|/.test(this.code.string) || this.code.string.length != 4){
            cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_26);
        // }else if(!this.codeRight){
        //     cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_26);
        }else{
            cc.dd.NetWaitUtil.show('修改密码中...');

            let url = Platform.accountUrl+"sdk/utils/setpassword?";

            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        var jsonData = JSON.parse(xhr.responseText);
                        if(jsonData.code == 0){
                            this.firstAccount.password = this.new_password.string;

                            LoginData.Instance().setAccountLogin(this.firstAccount.account, this.firstAccount.password, true);
                        }else{
                            cc.dd.PromptBoxUtil.show(jsonData.msg);
                        }
                        cc.log(jsonData.msg);
                    }
                    cc.dd.NetWaitUtil.close();
                    return;
                }

            }.bind(this);
            xhr.ontimeout = function () {
                cc.log('http timeout:setpassword');
                cc.dd.NetWaitUtil.close();
            }.bind(this);
            xhr.onerror = function () {
                cc.log('http error:setpassword');
                cc.dd.NetWaitUtil.close();
            }.bind(this);
            xhr.open("POST", url, true);
            xhr.send("username="+this.firstAccount.account+"&code="+this.code.string+"&newpassword="+this.new_password.string+"&confirm_password="+this.confirm_password.string);
        }
    },


    //获取验证码
    onClickAuthCode(){
        if (!cc.sys.isNative) {
            return;
        }
        hall_audio_mgr.com_btn_click();
        cc.dd.SysTools.keepNetOk(function () {
            cc.log('[密码修改] ', '获取验证码');

            let url = Platform.accountUrl+'sdk/utils/send?';
            let username = this.firstAccount.account;

            this.totalTime = 60;
            this.opBtn.getComponent(cc.Button).enabled = false;

            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        var jsonData = JSON.parse(xhr.responseText);
                        if(jsonData.code == 0){
                            this.updateTag = true;
                        }else{
                            cc.dd.PromptBoxUtil.show(jsonData.msg);
                            this.opBtn.getComponent(cc.Button).enabled = true;
                        }
                        cc.log(jsonData.msg);
                    }
                    return;
                }
            }.bind(this);
            xhr.ontimeout = function () {
                cc.log('http timeout:get authcode');
                this.opBtn.getComponent(cc.Button).enabled = true;
            }.bind(this);
            xhr.onerror = function () {
                cc.log('http error:get authcode');
                this.opBtn.getComponent(cc.Button).enabled = true;
            }.bind(this);
            xhr.open("POST", url, true);
            xhr.send("username="+username);

        }.bind(this));
    },

    //验证验证码
    editEnd(){
        // if (!cc.sys.isNative) {
        //     return;
        // }
        //
        // cc.dd.SysTools.keepNetOk(function () {
        //     if(this.code.string == ""){
        //         // cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_23);
        //     }else if(this.code.string == "") {
        //         // cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_24);
        //     }else if(!/(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/.test(this.code.string)) {
        //         // cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_25);
        //     }else if(!/(^\d{4}$)|/.test(this.code.string) || this.code.string.length != 4) {
        //         // cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_26);
        //     }else if(this.codeRight == true){
        //     }else {
        //         let url = Platform.accountUrl+'sdk/utils/verify?';
        //         let code = this.code.string;
        //
        //         var xhr = new XMLHttpRequest();
        //         xhr.onreadystatechange = function () {
        //             if (xhr.readyState == 4) {
        //                 if (xhr.status >= 200 && xhr.status < 300) {
        //                     var jsonData = JSON.parse(xhr.responseText);
        //                     if(jsonData.code == 0){
        //                         this.codeRight = true;
        //                     }else {
        //                         cc.dd.PromptBoxUtil.show(jsonData.msg);
        //                         this.codeRight = false;
        //                     }
        //                     cc.log(jsonData.msg)
        //                 }
        //                 return;
        //             }
        //         }.bind(this);
        //         xhr.ontimeout = function () {
        //             cc.log('http timeout:verify authcode');
        //             this.codeRight = false;
        //         }.bind(this);
        //         xhr.onerror = function () {
        //             cc.log('http error:verify authcode');
        //             this.codeRight = false;
        //         }.bind(this);
        //         xhr.open("POST", url, true);
        //         xhr.send("username="+username+"&code="+code);
        //     }
        // }.bind(this));
    },

    update: function(dt){
        //获取绑定手机验证码倒计时
        if(this.updateTag){
            if(this.totalTime >= 0){
                this.timer += dt;
                if(this.timer >= 1){
                    this.totalTime -= 1;
                    this.bindTimeTxt.string = this.totalTime + 's';
                    this.timer = 0;
                }
            }else{
                this.bindTimeTxt.string = '获取验证码';
                this.opBtn.getComponent(cc.Button).enabled = true;
                this.totalTime = 0;
                this.updateTag = false;
                this.timer = 0;
            }
        }
    },
});
