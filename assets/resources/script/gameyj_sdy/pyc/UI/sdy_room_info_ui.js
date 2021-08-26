var RoomMgr = require('jlmj_room_mgr').RoomMgr;

cc.Class({
    extends: cc.Component,

    properties: {
        txt_room_num: cc.Label,
        txt_room_wanfa: cc.Label,
    },

    onLoad: function () {
        this.initUI();
    },

    initUI: function () {
        this.txt_room_num.string = RoomMgr.Instance().game_info.roomId;

        var wanfa = "";
        if(RoomMgr.Instance()._Rule.zhu2){
            wanfa += "有主2 ";
        }
        if(RoomMgr.Instance()._Rule.wangKou){
            wanfa += "王扣x3 ";
        }
        if(RoomMgr.Instance()._Rule.biDiao){
            wanfa += "比吊 ";
        }
        if(RoomMgr.Instance()._Rule.lianKouDaiPo){
            wanfa += "连扣带破 ";
        }
        this.txt_room_wanfa.string = wanfa;
    },

});
