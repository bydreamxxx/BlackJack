var dd = cc.dd;
const HallCommonEd = require('hall_common_data').HallCommonEd;
const HallCommonEvent = require('hall_common_data').HallCommonEvent;
const HallCommonData = require('hall_common_data').HallCommonData.getInstance();
const data_task = require('task')
const data_item = require('item')

var hall_audio_mgr = require('hall_audio_mgr').Instance();
var hall_prefab = require('hall_prefab_cfg');
cc.Class({
    extends: cc.Component,

    properties: {
        alreadyBindedNode:cc.Node, //已经绑定的界面

        notBindedNode:cc.Node,      //没绑定的界面

        awardPrefab: {
            default: null,
            type: cc.Prefab,
        },
        atlasIcon: {
            default: null,
            type: cc.SpriteAtlas,
        },

        /**
         * 手机号输入框
         */
        phoneEditBox:cc.EditBox,
        phoneEditBox2:cc.EditBox,
        /**
         * 验证码输入框
         */
        safeCodeEditBox:cc.EditBox,
        safeCodeEditBox2:cc.EditBox,

        //titleTxt
        desc: cc.Label,
        desc1: cc.Label,

        //倒计时lable
        bindTimeTxt: cc.Label,
        unbindTimeTxt: cc.Label,

        //获取验证码按钮
        opBtn: cc.Node,
        opBtn1:cc.Node,

        toggleNode:{default: [], type:cc.Toggle},

        oldBindedNode:cc.Node,
        newBindedNode:cc.Node,
        newPhoneEditBox:cc.EditBox,
        newPasswordEditBox:cc.EditBox,
        newSafeCodeEditBox:cc.EditBox,
        newBindTimeTxt: cc.Label,
        newOpBtn: cc.Node,

        m_awardContent: cc.Node,
    },

    start: function() {
    },

    // use this for initialization
    onLoad: function () {
        HallCommonEd.addObserver(this);

        this._useNewBind = cc.game_pid == 0 || cc.game_pid == 10012 || cc.game_pid == 10016;

        this.oldBindedNode.active = !this._useNewBind;
        this.newBindedNode.active = this._useNewBind;

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
        this.updateUI();
        this.timer = 0;
        this.timer1 = 0;
        this.totalTime = 0;
        this.totalTime1 = 0;
        this.updateTag = false;
        this.updateTag1 = false;
        this.timerNew = 0;
        this.totalTimeNew = 0;
        this.updateTagNew = false;
        this.codeType = 0;
    },

    onDestroy: function () {
        HallCommonEd.removeObserver(this);
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

        //获取解绑手机验证码倒计时
        if(this.updateTag1){
            if(this.totalTime1 >= 0){
                this.timer1 += dt;
                if(this.timer1 > 1){
                    this.totalTime1 -= 1;
                    this.unbindTimeTxt.string = this.totalTime1 + 's';
                    this.timer1 = 0;
                }

            }else{
                this.unbindTimeTxt.string = '获取验证码';
                this.opBtn1.getComponent(cc.Button).enabled = true;
                this.totalTime1 = 0;
                this.updateTag1 = false;
                this.timer1 = 0;
            }
        }

        //获取新绑定手机验证码倒计时
        if(this.updateTagNew){
            if(this.totalTimeNew >= 0){
                this.timerNew += dt;
                if(this.timerNew > 1){
                    this.totalTimeNew -= 1;
                    this.newBindTimeTxt.string = this.totalTimeNew + 's';
                    this.timerNew = 0;
                }

            }else{
                this.newBindTimeTxt.string = '获取验证码';
                this.newOpBtn.getComponent(cc.Button).enabled = true;
                this.totalTimeNew = 0;
                this.updateTagNew = false;
                this.timerNew = 0;
            }
        }
    },

    updateUI: function () {
        if(this._useNewBind){
            if(HallCommonData.telNum != ''){
                this.alreadyBindedNode.active = true;
                this.notBindedNode.active = false;
                this.phoneEditBox2.placeholder = HallCommonData.telNum;
                // this.desc.string = '解绑手机';
                // this.desc1.string = '解绑手机';
                // this.safeCode.string = HallCommonData.idNum;
            }else{
                this.alreadyBindedNode.active = false;
                this.notBindedNode.active = true;
                this.newPhoneEditBox.string = '';
                this.newPasswordEditBox.string = '';
                this.newSafeCodeEditBox.string = '';
                this.phoneEditBox2.string = '';
                this.safeCodeEditBox2.string = '';
                // this.desc.string = '绑定手机';
                // this.desc1.string = '绑定手机';
            }
        }else{
            if(HallCommonData.telNum != ''){
                this.alreadyBindedNode.active = true;
                this.notBindedNode.active = false;
                this.phoneEditBox2.placeholder = HallCommonData.telNum;
                // this.desc.string = '解绑手机';
                // this.desc1.string = '解绑手机';
                // this.safeCode.string = HallCommonData.idNum;
            }else{
                this.alreadyBindedNode.active = false;
                this.notBindedNode.active = true;
                this.phoneEditBox.string = '';
                this.safeCodeEditBox.string = '';
                this.phoneEditBox2.string = '';
                this.safeCodeEditBox2.string = '';
                // this.desc.string = '绑定手机';
                // this.desc1.string = '绑定手机';
            }
        }
    },


    /**
     * 绑定手机
     */
    bindBtnCallBack:function () {
        hall_audio_mgr.com_btn_click();

        if(this.phoneEditBox.string == ''){
            dd.DialogBoxUtil.show(0,cc.dd.Text.TEXT_POPUP_24, '确定');
            return;
        }

        var nameReg = /(^\d{11}$)|/;///(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/;//^[\u4E00-\u9FA5]{2,4}$/;
        if(!nameReg.test(this.phoneEditBox.string)){
            this.phoneEditBox.string = '';
            dd.DialogBoxUtil.show(0,cc.dd.Text.TEXT_POPUP_25, '确定');
            return;
        }

        if(this.safeCodeEditBox.string == ''){
            dd.DialogBoxUtil.show(0,cc.dd.Text.TEXT_POPUP_23, '确定');
            return;
        }
        var idReg = /(^\d{4}$)|/;;
        if(!idReg.test(this.safeCodeEditBox.string)){
            this.safeCodeEditBox.string = '';
            dd.DialogBoxUtil.show(0,cc.dd.Text.TEXT_POPUP_26, '确定');
            return;
        }

        cc.dd.NetWaitUtil.show('正在绑定手机');
        var req = new cc.pb.hall.bind_mobilephone_req();
        req.setType(1);
        req.setMobile(this.phoneEditBox.string);
        req.setMobileCode(this.safeCodeEditBox.string);
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_bind_mobilephone_req,req,
            '发送协议[id: ${cc.netCmd.hall.cmd_bind_mobilephone_req}],bind_mobilephone_req[手机绑定]', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'bindBtnCallBack');
        },

    /**
     * 绑定其他手机
     */
    bindAnotherCallBack:function () {
        hall_audio_mgr.com_btn_click();

        if(this.phoneEditBox2.string == ''){
            dd.DialogBoxUtil.show(0,cc.dd.Text.TEXT_POPUP_24, '确定');
            return;
        }

        var nameReg = /(^\d{11}$)|/;//^[\u4E00-\u9FA5]{2,4}$/;
        if(!nameReg.test(this.phoneEditBox2.string)){
            this.phoneEditBox2.string = '';
            dd.DialogBoxUtil.show(0,cc.dd.Text.TEXT_POPUP_25, '确定');
            return;
        }

        if(this.safeCodeEditBox2.string == ''){
            dd.DialogBoxUtil.show(0,cc.dd.Text.TEXT_POPUP_23, '确定');
            return;
        }
        var idReg = /(^\d{4}$)|/;;
        if(!idReg.test(this.safeCodeEditBox2.string)){
            this.safeCodeEditBox2.string = '';
            dd.DialogBoxUtil.show(0,cc.dd.Text.TEXT_POPUP_26, '确定');
            return;
        }

        cc.dd.NetWaitUtil.show('正在绑定手机');

        if(this._useNewBind){
            var req = new cc.pb.hall.msg_bind_account_req();
            req.setType(2);
            req.setMobile(this.phoneEditBox2.string);
            req.setMobileCode(this.safeCodeEditBox2.string);
            cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_msg_bind_account_req,req,
                '发送协议[id: ${cc.netCmd.hall.cmd_msg_bind_account_req}],msg_bind_account_req[手机解绑]', true);
        }else{
            var req = new cc.pb.hall.bind_mobilephone_req();
            req.setType(2);
            req.setMobile(this.phoneEditBox2.string);
            req.setMobileCode(this.safeCodeEditBox2.string);
            cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_bind_mobilephone_req,req,
                '发送协议[id: ${cc.netCmd.hall.cmd_bind_mobilephone_req}],bind_mobilephone_req[手机解绑]', true);
        }

        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'bindBtnCallBack');
        },

    //绑定手机获取验证码
    getPhoneCode: function(event, data){
        if(this.phoneEditBox.string == ''){
            dd.DialogBoxUtil.show(0,cc.dd.Text.TEXT_POPUP_24, '确定');
            return;
        }

        var nameReg = /(^\d{11}$)|/;//^[\u4E00-\u9FA5]{2,4}$/;
        if(!nameReg.test(this.phoneEditBox.string)){
            this.phoneEditBox.string = '';
            dd.DialogBoxUtil.show(0,cc.dd.Text.TEXT_POPUP_25, '确定');
            return;
        }
        this.codeType = 1;
        this.totalTime = 60;
        this.opBtn.getComponent(cc.Button).enabled = false;
        var req = new cc.pb.hall.get_mobile_code_bind_req();
        req.setType(1);
        req.setMobile(this.phoneEditBox.string);
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_get_mobile_code_bind_req,req,
            '发送协议[id: ${cc.netCmd.hall.cmd_get_mobile_code_bind_req}],get_mobile_code_bind_req[手机绑定]', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'getPhoneCode');

    },

    //解绑手机获取验证码
    getDeletePhoneCode: function(event, data){
        if(this.phoneEditBox2.string == ''){
            dd.DialogBoxUtil.show(0,cc.dd.Text.TEXT_POPUP_24, '确定');
            return;
        }

        var nameReg = /(^\d{11}$)|/;//^[\u4E00-\u9FA5]{2,4}$/;
        if(!nameReg.test(this.phoneEditBox2.string)){
            this.phoneEditBox2.string = '';
            dd.DialogBoxUtil.show(0,cc.dd.Text.TEXT_POPUP_25, '确定');
            return;
        }
        
        this.codeType = 2;
        this.totalTime1 = 60;

        this.opBtn1.getComponent(cc.Button).enabled = false;
        var req = new cc.pb.hall.get_mobile_code_bind_req();
        req.setType(2);
        req.setMobile(this.phoneEditBox2.string);
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_get_mobile_code_bind_req,req,
            '发送协议[id: ${cc.netCmd.hall.cmd_get_mobile_code_bind_req}],get_mobile_code_bind_req[手机解绑]', true);
    },

    getTaskDataByType:function(mainType,subType)
    {
        //从shop表读取type为1，等级为lvl的一行数据
        var curShopData = data_task.getItem(function (element) {
            return (element.mainType == mainType) && (element.subType == subType);
        }.bind(this))

        return curShopData;
    },

    /**
     * 关闭回调
     */
    closeBtnCallBack:function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    /**
     * 选中toggle
     */
    selectBindPhoneToggle: function(){
        // this.toggleNode[0].isChecked =  false;
        // this.toggleNode[1].isChecked =  false;
        // this.toggleNode[2].isChecked =  true;
    },

    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage: function (event, data) {
        switch (event) {
            case HallCommonEvent.TEL_BIND:
                var str = this._useNewBind ? this.newPhoneEditBox.string : this.phoneEditBox.string;
                var text = str.substring(0, 3) + '****' + str.substring(7);
                HallCommonData.telNum = text;
                this.updateUI();
                break;
            case HallCommonEvent.TEL_UNBIND:
                HallCommonData.telNum = '';
                this.updateUI();
            case HallCommonEvent.GET_CODE_SUCCESS:
                if(this._useNewBind){
                    if(this.codeType == 1)
                        this.updateTagNew = true;
                    else
                        this.updateTag1 = true;
                }else{
                    if(this.codeType == 1)
                        this.updateTag = true;
                    else
                        this.updateTag1 = true;
                }
                break;
            case HallCommonEvent.GET_CODE_Failed:
                if(this._useNewBind){
                    if(this.codeType == 1)
                        this.newOpBtn.getComponent(cc.Button).enabled = true;
                    else
                        this.opBtn1.getComponent(cc.Button).enabled = true;
                }else{
                    if(this.codeType == 1)
                        this.opBtn.getComponent(cc.Button).enabled = true;
                    else
                        this.opBtn1.getComponent(cc.Button).enabled = true;
                }
            default:
                break;
        }
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
    },


    /**
     * 绑定手机
     */
    bindBtnCallBackNew:function () {
        hall_audio_mgr.com_btn_click();

        if(this.newPhoneEditBox.string == ''){
            dd.DialogBoxUtil.show(0,cc.dd.Text.TEXT_POPUP_24, '确定');
            return;
        }

        var nameReg = /(^\d{11}$)|/;///(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/;//^[\u4E00-\u9FA5]{2,4}$/;
        if(!nameReg.test(this.newPhoneEditBox.string)){
            this.newPhoneEditBox.string = '';
            dd.DialogBoxUtil.show(0,cc.dd.Text.TEXT_POPUP_25, '确定');
            return;
        }

        if(this.newPasswordEditBox.string == ''){
            dd.DialogBoxUtil.show(0,cc.dd.Text.TEXT_POPUP_22, '确定');
            return;
        } else if (this.newPasswordEditBox.string.length < 6) {
            cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_28);
            return;
        } else if (!/(^[A-Za-z0-9]+$)/.test(this.newPasswordEditBox.string)) {
            cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_POPUP_29);
            return;
        }

        if(this.newSafeCodeEditBox.string == ''){
            dd.DialogBoxUtil.show(0,cc.dd.Text.TEXT_POPUP_23, '确定');
            return;
        }
        var idReg = /(^\d{4}$)|/;;
        if(!idReg.test(this.newSafeCodeEditBox.string)){
            this.newSafeCodeEditBox.string = '';
            dd.DialogBoxUtil.show(0,cc.dd.Text.TEXT_POPUP_26, '确定');
            return;
        }

        cc.dd.NetWaitUtil.show('正在绑定手机');
        var req = new cc.pb.hall.msg_bind_account_req();
        req.setType(1);
        req.setMobile(this.newPhoneEditBox.string);
        req.setMobileCode(this.newSafeCodeEditBox.string);
        req.setPassword(this.newPasswordEditBox.string)
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_msg_bind_account_req,req,
            '发送协议[id: ${cc.netCmd.hall.cmd_msg_bind_account_req}],msg_bind_account_req[手机绑定]', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'bindBtnCallBack');
    },

    //绑定手机获取验证码
    getPhoneCodeNew: function(event, data){
        if(this.newPhoneEditBox.string == ''){
            dd.DialogBoxUtil.show(0,cc.dd.Text.TEXT_POPUP_24, '确定');
            return;
        }

        var nameReg = /(^\d{11}$)|/;//^[\u4E00-\u9FA5]{2,4}$/;
        if(!nameReg.test(this.newPhoneEditBox.string)){
            this.newPhoneEditBox.string = '';
            dd.DialogBoxUtil.show(0,cc.dd.Text.TEXT_POPUP_25, '确定');
            return;
        }
        this.codeType = 1;
        this.totalTime = 60;
        this.opBtn.getComponent(cc.Button).enabled = false;
        var req = new cc.pb.hall.get_mobile_code_bind_req();
        req.setType(1);
        req.setMobile(this.newPhoneEditBox.string);
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_get_mobile_code_bind_req,req,
            '发送协议[id: ${cc.netCmd.hall.cmd_get_mobile_code_bind_req}],get_mobile_code_bind_req[手机绑定]', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'getPhoneCode');

    },
});
