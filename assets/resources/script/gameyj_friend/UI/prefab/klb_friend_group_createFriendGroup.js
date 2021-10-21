// create by wj 2018/04/24
const club_sender = require('jlmj_net_msg_sender_club');
var HallPropData = require('hall_prop_data').HallPropData.getInstance();
var clubMgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();
var hall_prefab = require('hall_prefab_cfg');
const club_Ed = require('klb_Club_ClubMgr').klbClubEd;
const club_Event = require('klb_Club_ClubMgr').klbClubEvent;
var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        nameEditBox: cc.EditBox,
        descTxt: cc.RichText,
    },

    onLoad: function () {
        this.descTxt.string = '<color=#6D5E4A>背包房卡:</c>' + '<color=#cc0000>' + (HallPropData.getRoomCard() || 0) + '</c><color=#6D5E4A>张</c>';
        this._createTYPE = 0;
        let num = '100';
        if(cc._useChifengUI){
            num = '0';
        }
        cc.find('bg/mainNode/desc', this.node).getComponent(cc.Label).string = '创建亲友圈需要满足背包房卡>'+num+'张房卡';
        cc.find('bg/mainNode/tiyan', this.node).getComponent(cc.Toggle).interactable = !cc._useChifengUI;
    },

    onDestroy: function () {
    },

    //输入结束
    enterNameEnd: function (event, data) {
        var str = this.nameEditBox.string;
        //做字符检测
        var len = 0;
        for (var i = 0; i < str.length; i++) {
            var c = str.charCodeAt(i);
            if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f))
                len += 1;
            else
                len += 2;
        }
        if (len > 16) {
            cc.dd.PromptBoxUtil.show('亲友圈名字不能超过8个中文字符');
            this.nameEditBox.string = '';
        }
    },


    //打开商城
    onClickShop: function (event, data) {
        if(cc._useChifengUI){
            cc.dd.UIMgr.openUI(hall_prefab.CHIFENG_SHOP);
        }else if(cc._useCardUI){
            cc.dd.PromptBoxUtil.show('NOT YET OPEN');
        }else{
            cc.dd.UIMgr.openUI(hall_prefab.KLB_SHOP_LAYER, function (ui) {
                ui.getComponent('klb_hall_ShopLayer').gotoPage('FK');
                // ui.setLocalZOrder(5000);
            }.bind(this));
        }
    },

    //创建俱乐部
    onCreateClub: function (event, data) {
        club_sender.createClubReq(this.nameEditBox.string, this._createTYPE);
        // this.close();
    },

    //关闭按钮
    close: function () {
        hall_audio_mgr.com_btn_click();
        club_Ed.notifyEvent(club_Event.CLUB_CLOSE_CREATE_UI);
        cc.dd.UIMgr.destroyUI(this.node);
    },

    onToggleType(event, custom) {
        switch (custom) {
            case '0':
                this._createTYPE = 0;
                let num = '100';
                if(cc._useChifengUI){
                    num = '0';
                }
                cc.find('bg/mainNode/desc', this.node).getComponent(cc.Label).string = '创建亲友圈需要满足背包房卡>'+num+'张房卡';
                break;
            case '1':
                this._createTYPE = 1;
                cc.find('bg/mainNode/desc', this.node).getComponent(cc.Label).string = '无需房卡门槛，仅能创建一个体验亲友圈';
                break;
        }
    },
});
