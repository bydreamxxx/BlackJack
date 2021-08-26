var jlmj_prefab = require('jlmj_prefab_cfg');
var UIZorder = require("mj_ui_zorder");
var RoomMgr = require("jlmj_room_mgr").RoomMgr;

cc.Class({
    extends: cc.Component,

    properties: {
        dfNode:cc.Node,//底分节点
        dcNode:cc.Node,//电池节点
        qsNode:cc.Node,//圈数节点
    },

    onSwitchingDFDC: function( event, custom ) {
        if(RoomMgr.Instance().gameId == cc.dd.Define.GameType.CCMJ_MATCH || RoomMgr.Instance().gameId == cc.dd.Define.GameType.WDMJ_MATCH || RoomMgr.Instance().gameId == cc.dd.Define.GameType.AHMJ_MATCH){
            this.qsNode.active = this.qsNode.active == false;
            this.dcNode.active = this.qsNode.active == false;
        }else{
            this.dfNode.active = this.dfNode.active == false;
            this.dcNode.active = this.dfNode.active == false;
        }
    },
    onSwitchingQSDC: function( event, custom ) {

        this.qsNode.active = this.qsNode.active == false;
        this.dcNode.active = this.qsNode.active == false;
        cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_GZ_BOX,function (ui) {
            ui.zIndex = UIZorder.MJ_GUIZEBOX_UI;
            var guize = ui.getComponent("mj_guize_box");
            guize.addGuize(this.rule, this.guize);
        }.bind(this));
    },


    // use this for initialization
    init: function (guize, func, rule) {
        if(RoomMgr.Instance().gameId == cc.dd.Define.GameType.CCMJ_MATCH || RoomMgr.Instance().gameId == cc.dd.Define.GameType.WDMJ_MATCH || RoomMgr.Instance().gameId == cc.dd.Define.GameType.AHMJ_MATCH){
            this.dfNode.active = false;
            this.qsNode.active = true;
        }

        var seq = cc.sequence(cc.delayTime(3), func);
        this.node.stopAllActions();
        this.node.runAction(cc.repeatForever(seq));
        this.rule = rule;
        this.guize = guize;

        var sys_time = cc.find("leftInfo/dianchi/sys_time", this.node);
        this.schedule(function () {
            sys_time.getComponent(cc.Label).string = this.getSysTime();
        }.bind(this), 0.5);
    },

    getSysTime: function () {
        var date = new Date();
        var seperator2 = ":";
        var min = date.getMinutes();
        min = min >= 10 ? min : '0' + min;
        var hour = date.getHours();
        hour = hour >= 10 ? hour : '0' + hour;
        return hour + seperator2 + min;
    },

    // update (dt) {},
});
