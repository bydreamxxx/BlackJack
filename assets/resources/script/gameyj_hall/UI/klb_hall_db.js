var hall_audio_mgr = require('hall_audio_mgr').Instance();
var hall_prefab = require('hall_prefab_cfg');
cc.Class({
    extends: cc.Component,

    properties: {
        // hallNode: cc.Node,
        // xinxiNode: cc.Node,
        // returnNode: cc.Node,
        bisaiBtn: { default: null, type: cc.Node, tooltip: "比赛按钮" },
        // jinbiBtn: { default: null, type: cc.Node, tooltip: "金币按钮" },
        jiaruBtn: { default: null, type: cc.Node, tooltip: "加入房间" },
        chuangjianBtn: { default: null, type: cc.Node, tooltip: "创建房间" },
        qinyouBtn: { default: null, type: cc.Node, tooltip: "亲友圈" },
        // hiddenList: { default: [], type: cc.Node, tooltip: "新大厅隐藏的节点" },
    },



    onLoad: function () {
        cc.dd.ButtonUtil.setButtonEvent(this.bisaiBtn, this.onClickBiSai.bind(this));
        // cc.dd.ButtonUtil.setButtonEvent(this.jinbiBtn, this.onClickJibi.bind(this));
        cc.dd.ButtonUtil.setButtonEvent(this.jiaruBtn, this.onClickJiaru.bind(this));
        cc.dd.ButtonUtil.setButtonEvent(this.chuangjianBtn, this.onCallCreate.bind(this));
        cc.dd.ButtonUtil.setButtonEvent(this.qinyouBtn, this.onClickQinyou.bind(this));
    },

    onCallCreate: function (event) {
        var hall = this.node.parent.getComponent('klb_hallScene');
        if (hall)
            hall.roomBtnCallBack(event, 'C_ROOM');
    },

    onClickJiaru: function (event) {
        var hall = this.node.parent.getComponent('klb_hallScene');
        if (hall)
            hall.roomBtnCallBack(event, 'J_ROOM');
    },

    onClickQinyou: function (event) {
        var hall = this.node.parent.getComponent('klb_hallScene');
        if (hall)
            hall.roomBtnCallBack(event, 'C_CLUB');
    },

    // onClickJibi: function () {
    //     hall_audio_mgr.com_btn_click();
    //     this.showNode(false);
    //     this.node.active = false;
    //     this.hallNode.active = true;
    //     this.xinxiNode.active = true;
    //     this.returnNode.active = true;
    //     cc.find('leftBack', this.hallNode).active = true;
    //     cc.find('game_group_layer', this.hallNode).active = true;
    // },

    onClickBiSai: function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(hall_prefab.KLB_Match, function (node) {
            node.getComponent('klb_hall_Match').sendGetMatch(1);
        }.bind(this));
        //this.onClickClose();  
    },



    // onClickClose: function () {
    //     hall_audio_mgr.Instance().com_btn_click();
    //     cc.dd.UIMgr.destroyUI(this.node);
    // },

    // showNode: function (bl) {
    //     cc._isNewHall = bl;
    //     if (this.hiddenList) {
    //         this.hiddenList.forEach(function (item) {
    //             if (item)
    //                 item.active = bl;
    //         }.bind(this));
    //     }
    // },
    //
    // close: function () {
    //     this.hallNode.active = false;
    //     cc.dd.UIMgr.destroyUI(this.node);
    // }
});
