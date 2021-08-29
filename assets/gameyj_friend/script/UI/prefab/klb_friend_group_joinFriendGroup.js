// create by wj 2018/04/24
const club_sender = require('jlmj_net_msg_sender_club');
const club_Ed =  require('klb_Club_ClubMgr').klbClubEd;
const club_Event = require('klb_Club_ClubMgr').klbClubEvent;
var clubMgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();
var hall_audio_mgr = require('hall_audio_mgr').Instance();
let prefab_config = require('klb_friend_group_prefab_cfg');

cc.Class({
    extends: cc.Component,

    properties: {
        numLabel:[cc.Label],
        labelColor:[cc.Color],
        WX: cc.Label,
    },

    onLoad: function() {
        this.roomNum = [];
        this.numInit = ['请','输','入','I','D','号'];
        club_Ed.addObserver(this);

        if(cc.game_pid == 10006){
            this.WX.string = 'cfmj9999';
        }else if(cc.game_pid == 10008) {
            this.WX.string = 'wdmj7777';
        }else if(cc.game_pid == 10010){
            this.WX.string = 'cfmj7777';
        }else if(cc.game_pid == 10003){
            this.WX.string = '17043958881';
        }else if(cc.game_pid == 10004){
            this.WX.string = 'xlyxzd';
        }else{
            this.WX.string = 'XLdl001';
        }
    },

    onDestroy:function () {
        club_Ed.removeObserver(this);
    },

    // isEnabled: function(enable){
    //     this.createbtn.getComponent(cc.Button).enabled = enable;
    //     this.createbtn.getComponent(cc.Button).interactable = enable;
    // },

    //点击数字按钮
    onClickNumBtn: function(event, data){
        hall_audio_mgr.com_btn_click();

        if (this.roomNum.length < 6) {
            this.roomNum.push(data);
            this.setNnum(this.roomNum);
        }

        if(this.roomNum.length == 6){
            club_sender.joinClubReq(parseInt(this.roomNum.join('')));
            return;
        }
    },

    //点击加入按钮
    onClickJoinBtn: function(event, data){
        hall_audio_mgr.com_btn_click();
        var reg = /^[0-9]+.?[0-9]*$/;
        if(reg.test(this.roomNumLabel.string))
            club_sender.joinClubReq(parseInt(this.roomNumLabel.string));
        else
            cc.dd.PromptBoxUtil.show('俱乐部ID为6位数字，请输入正确的俱乐部ID');
    },

    //点击创建
    onClickCreateBtn: function(event, data){
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
        cc.dd.UIMgr.openUI(prefab_config.KLB_FG_CREATE_GROUP,function (ui) {});
    },

    onClickCopy(){
        hall_audio_mgr.com_btn_click();
        if (cc.sys.OS_ANDROID == cc.sys.os || cc.sys.OS_IOS == cc.sys.os) {
            cc.dd.native_systool.SetClipBoardContent(this.WX.string);
            cc.dd.PromptBoxUtil.show("复制成功");
        }
    },

    setNnum: function (arr) {
        arr = arr || [];

        for(let i = 0; i < this.numLabel.length; i++){
            if(arr.length > 0){
                this.numLabel[i].node.color = this.labelColor[1];
            }else{
                this.numLabel[i].node.color = this.labelColor[0];
            }
            if(i < arr.length){
                this.numLabel[i].string = arr[i];
            }else{
                this.numLabel[i].string = arr.length > 0 ? '' : this.numInit[i];
            }
        }
    },

    /**
     * 清除
     */
    onReset: function () {
        hall_audio_mgr.com_btn_click();
        this.roomNum.splice(0);
        this.setNnum(this.roomNum);
    },
    /**
     * 删除
     */
    onDel: function () {
        hall_audio_mgr.com_btn_click();
        this.roomNum.pop();
        this.setNnum(this.roomNum);

    },

    /**
     * 关闭界面
     */
    onclose: function(){
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    onEventMessage: function (event,data) {
        switch (event){
            case club_Event.FRIEND_APPLY_SUCCESS:
                cc.dd.UIMgr.destroyUI(this.node);
                break;
            default:
                break;
        }
    },

});
