var hall_audio_mgr = require('hall_audio_mgr').Instance();
const HallCommonData = require('hall_common_data').HallCommonData;
var hall_prefab = require('hall_prefab_cfg');

cc.Class({
    extends: cc.Component,

    properties: {
        opnitionContent: cc.EditBox,
        phoneEdit: cc.EditBox,
    },

    onLoad(){
        if(cc._applyForPayment){
            let serviceButton = cc.find('actNode/bg/serviceButton', this.node);
            if(serviceButton){
                serviceButton.active = false;
            }
        }
    },

    onClickPhoto: function (event, data) {
        cc.dd.PromptBoxUtil.show('暂未开放，敬请期待');
    },

    onClickSubmit: function (event, data) {
        //cc.dd.PromptBoxUtil.show('暂未开放，敬请期待');
        if (this.opnitionContent.string.length < 8) {
            cc.dd.PromptBoxUtil.show('建议最少输入8个字符');
            return;
        }
        if (this.opnitionContent.string.length > 200) {
            cc.dd.PromptBoxUtil.show('建议最多输入200个字符');
            return;
        }

        if (this.phoneEdit.string == '') {
            cc.dd.PromptBoxUtil.show("请输入手机号!");
            return;
        }

        var nameReg = /(^1[3|4|5|7|8|9]\d{9}$)|(^09\d{8}$)/;
        if (!nameReg.test(this.phoneEdit.string)) {
            this.phoneEdit.string = '';
            cc.dd.PromptBoxUtil.show("请输入正确的手机号!");
            return;
        }

        let time = Date.parse(new Date());

        let sign = cc.dd.user.id+'&'+HallCommonData.getInstance().nick+'&'+this.opnitionContent.string+'&'+''+'&'+this.phoneEdit.string+'&'+time+'&77f616f6ef7950387bb828e30aff700a0016a391';

        let md5 = require('md5').MD5;

        let pid = require('AppConfig').PID;
        let url ='';
        if (pid == 3)
            url = 'http://tg.yuejiegame.net/api/viewback?userid=' + cc.dd.user.id + '&nickname=' + HallCommonData.getInstance().nick + '&content=' + this.opnitionContent.string + '&url=' + "" + '&phone=' + this.phoneEdit.string + '&timestr=' + time + '&token='+md5(sign);
        else
            url = 'http://share.yuejiegame.com/api/viewback?userid=' + cc.dd.user.id + '&nickname=' + HallCommonData.getInstance().nick + '&content=' + this.opnitionContent.string + '&url=' + "" + '&phone=' + this.phoneEdit.string + '&timestr=' + time + '&token='+md5(sign);

        url = encodeURI(url);
        var self = this;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            cc.log('yijianfankui ' + pid + ' ' + xhr.readyState + ' ' +xhr.responseText);
            if (xhr.readyState == 1)
                cc.dd.PromptBoxUtil.show("提交建议成功!");
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    var jsonData = JSON.parse(xhr.responseText);
                    if(jsonData.code == 1){
                        self.opnitionContent.string = '';
                        self.opnitionContent.placeholder = '您的建议是我们向上的阶梯，请在这里输入您的建议';
                        self.phoneEdit.string = ''
                    }
                }
                return;
            }

        };
        xhr.open("GET", url, true);
        xhr.send();

    },

    onClickKefu: function (event, data) {
        hall_audio_mgr.com_btn_click();
        if(cc._chifengGame){
            cc.dd.UIMgr.openUI(hall_prefab.CHIFENG_KEFU);
        }else {
            // cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_KEFU, function (prefab) {
            //     prefab.getComponent('klbj_hall_KeFu').getKefuDetailInfo();
            // });
            let Platform = require('Platform');
            let AppCfg = require('AppConfig');
            cc.dd.native_systool.OpenUrl(Platform.kefuUrl[AppCfg.PID] + "?user_id=" + cc.dd.user.id);
        }
        cc.dd.UIMgr.destroyUI(this.node);
    },

    close: function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.SceneManager.enterNewHall(this.node);
        cc.dd.UIMgr.destroyUI(this.node);
    },
});
