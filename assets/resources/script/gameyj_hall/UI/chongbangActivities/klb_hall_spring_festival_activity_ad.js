var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,

    show(endcall){
        this.endcall = endcall;
    },

    onClickClose() {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    onClickActivity(){
        hall_audio_mgr.com_btn_click();
        var pbObj = new cc.pb.rank.get_rank_activity_req();
        cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_get_rank_activity_req, pbObj, 'get_rank_activity_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onClickChongBang');
        cc.dd.UIMgr.destroyUI(this.node);
    }
});
