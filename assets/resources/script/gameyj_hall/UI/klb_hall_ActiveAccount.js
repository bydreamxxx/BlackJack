const data_task = require('task')
const data_item = require('item')
var login_module = require('LoginModule');

cc.Class({
    extends: cc.Component,

    properties: {
        r_account: cc.EditBox,
        r_password: cc.EditBox,
        r_authcode: cc.EditBox,
        //倒计时lable
        bindTimeTxt: cc.Label,
        //获取验证码按钮
        opBtn: cc.Node,

        awardPrefab: {
            default: null,
            type: cc.Prefab,
        },
        atlasIcon: {
            default: null,
            type: cc.SpriteAtlas,
        },
    },

    onLoad(){
        this.timer = 0;
        this.totalTime = 0;
        this.updateTag = false;

        this.m_awardContent = cc.find("itemscroll/mask/content",this.node);
        //left
        var items = this.getTaskDataByType(1,10).awardItems.split(";");//curVipData.items.split(";");
        for(var i=0;i<items.length;i++)
        {
            var its = cc.instantiate(this.awardPrefab);
            var content = items[i].split(",");

            var icon = cc.find("icon",its).getComponent(cc.Sprite);
            var sum = cc.find("num",its).getComponent(cc.Label);

            var itemData = data_item.getItem(function (element) {
                if(element.key==parseInt(content[0]))
                    return true;
                else
                    return false;
            }.bind(this));

            icon.spriteFrame = this.atlasIcon.getSpriteFrame(content[0]);
            var count = cc.dd.Utils.getNumToWordTransform(content[1]);
            if(content[0] == 1004 || content[0] == 1006)
                sum.string = "X"+ count / 100 + '元';
            else
                sum.string = "X"+ count;
            this.m_awardContent.addChild(its);
        }
    },


    onClickRegist(){
        hall_audio_mgr.com_btn_click();
        cc.dd.SysTools.keepNetOk(function () {
            if(this.r_account.string == "") {
                cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_24);
            }else if(!/(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/.test(this.r_account.string)) {
                cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_25);
            }else if(this.r_password.string == ""){
                cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_22);
            }else if(this.r_password.string.length < 6){
                cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_28);
            }else if(!/(^[A-Za-z0-9]+$)/.test(this.r_password.string)){
                cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_29);
            }else if(this.r_authcode.string == ""){
                cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_23);
            }else if(!/(^\d{4}$)|/.test(this.r_authcode.string) || this.r_authcode.string.length != 4){
                cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_26);
            }else if(!this.codeRight){
                cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_26);
            }else {
                login_module.Instance().loginType = cc.dd.jlmj_enum.Login_Type.ACCOUNT;
                // login_module.Instance().registAccount(this.r_account.string, this.r_password.string);
                cc.log('[游戏激活] ', '账号注册');
            }
        }.bind(this));
    },

    //获取验证码
    onClickAuthCode(){
        if (!cc.sys.isNative) {
            return;
        }

        cc.dd.SysTools.keepNetOk(function () {
            cc.log('[游戏激活] ', '获取验证码');
            if(this.r_account.string == "") {
                cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_24);
            }else if(!/(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/.test(this.r_account.string)) {
                cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_25);
            }else {
                let url = Platform.accountUrl+'sdk/utils/send?';
                let username = this.r_account.string;

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
            }
        }.bind(this));
    },

    editEnd(){
        if (!cc.sys.isNative) {
            return;
        }

        cc.dd.SysTools.keepNetOk(function () {
            if(this.r_authcode.string == ""){
                // cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_23);
            }else if(this.r_account.string == "") {
                // cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_24);
            }else if(!/(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/.test(this.r_account.string)) {
                // cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_25);
            }else if(!/(^\d{4}$)|/.test(this.r_authcode.string) || this.r_authcode.string.length != 4) {
                // cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_26);
            }else if(this.codeRight == true){
            }else {
                let url = Platform.accountUrl+'sdk/utils/setpassword?';
                let username = this.r_account.string;
                let code = this.r_authcode.string;

                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            var jsonData = JSON.parse(xhr.responseText);
                            if(jsonData.code == 0){
                                this.codeRight = true;
                            }else {
                                cc.dd.PromptBoxUtil.show(jsonData.msg);
                                this.codeRight = false;
                            }
                            cc.log(jsonData.msg)
                        }
                        return;
                    }
                }.bind(this);
                xhr.ontimeout = function () {
                    cc.log('http timeout:verify authcode');
                    this.codeRight = false;
                }.bind(this);
                xhr.onerror = function () {
                    cc.log('http error:verify authcode');
                    this.codeRight = false;
                }.bind(this);
                xhr.open("POST", url, true);
                xhr.send("username="+username+"&code="+code);
            }
        }.bind(this));
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

    getTaskDataByType:function(mainType,subType)
    {
        //从shop表读取type为1，等级为lvl的一行数据
        var curShopData = data_task.getItem(function (element) {
            return (element.mainType == mainType) && (element.subType == subType);
        }.bind(this))

        return curShopData;
    },
});
