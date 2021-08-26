var RoomMgr = require( "jlmj_room_mgr" ).RoomMgr;

cc.Class({
    extends: cc.Component,

    properties: {
        shunode:cc.Layout,//玩法Layout
        wfTxt:cc.Node,//玩法模版字0
        jsTip:cc.Node,
        qsTip:cc.Node,
        jushu:cc.Label,
        fanghao:cc.Label,
    },


    // LIFE-CYCLE CALLBACKS:

    onLoad :function() {

    },
    addGuize:function(rule, txt_arr)
    {
        this.fanghao.string = rule.roomId;
        this.jushu.string = rule.boardscout;
        if(RoomMgr.Instance().isUseNeiMengMJConfig()){
            if(RoomMgr.Instance()._Rule.mode == 0){
                this.jsTip.active = false;
                this.qsTip.active = true;
            }else{
                this.jsTip.active = true;
                this.qsTip.active = false;
            }
        }else if(RoomMgr.Instance().isSuiHuaMJ() || RoomMgr.Instance().isJinZhouMJ() || RoomMgr.Instance().isHeiShanMJ() || RoomMgr.Instance().isTuiDaoHuMJ()) {
            this.jsTip.active = rule.usercountlimit != 4;
            this.qsTip.active = rule.usercountlimit == 4;
        }else if(RoomMgr.Instance().isXueLiuMJ() || RoomMgr.Instance().isXueZhanMJ() || RoomMgr.Instance().isFangZhengMJ() || RoomMgr.Instance().isHeLongMJ()) {
            this.jsTip.active = true;
            this.qsTip.active = false;
        }else if(RoomMgr.Instance().isBaiChengMJ()){
            this.jsTip.active = false;
            this.qsTip.active = true;
        }else{
            this.jsTip.active = rule.usercountlimit == 2;
            this.qsTip.active = rule.usercountlimit != 2;
        }

        for(var id in txt_arr){
            var txt = txt_arr[id];
            if(txt.length){
                var txt_node = cc.instantiate(this.wfTxt);
                txt_node.getComponent(cc.Label).string = txt;
                txt_node.active = true;
                txt_node.y = 0;

                this.shunode.node.addChild(txt_node);
            }
        }
    },

    close:function () {
        cc.dd.UIMgr.destroyUI(this.node);
    },
    // update (dt) {},
});
