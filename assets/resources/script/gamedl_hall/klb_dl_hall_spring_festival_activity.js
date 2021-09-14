var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,

    setCloseFunc(func){
        this.closeFunc = func;
    },

    onClickClose() {
        hall_audio_mgr.com_btn_click();
        if(this.closeFunc){
            this.closeFunc();
        }
        cc.dd.UIMgr.destroyUI(this.node);
    },

    onClickActivity(){
        hall_audio_mgr.com_btn_click();
        var msg = new cc.pb.rank.msg_day_share_reward_2s();
        if(cc._isHuaweiGame){
            if(cc._lianyunID == 'oppo'){
                msg.setClientChannel(cc.dd.jlmj_enum.Login_Type.OPPO);
            }else if(cc._lianyunID == 'vivo'){
                msg.setClientChannel(cc.dd.jlmj_enum.Login_Type.VIVO);
            }else if(cc._lianyunID == 'xiaomi'){
                msg.setClientChannel(cc.dd.jlmj_enum.Login_Type.XIAOMI);
            }else{
                msg.setClientChannel(cc.dd.jlmj_enum.Login_Type.HUAWEI);
            }
        }else{
            msg.setClientChannel(cc.dd.jlmj_enum.Login_Type.WX);
        }
        cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_msg_day_share_reward_2s, msg, "msg_day_share_reward_2s", true);
        cc.dd.UIMgr.destroyUI(this.node);
    }
});
