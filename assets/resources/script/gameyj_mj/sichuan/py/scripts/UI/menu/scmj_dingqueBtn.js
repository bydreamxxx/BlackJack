var jlmj_audio_mgr = require('jlmj_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,

    properties:{
        dingqueAni:[cc.Node],
    },

    onLoad () {
        this.node.active = false;
    },

    setActive(value, msg){
        this.node.active = value;

        for(let i = 0; i < this.dingqueAni.length; i++){
            this.dingqueAni[i].active = value && msg.type - 1 == i;
            this.dingqueAni[i].getComponent(sp.Skeleton).clearTracks();
            if(value && msg.type - 1 == i){
                this.dingqueAni[i].getComponent(sp.Skeleton).setAnimation(0, "animation", true);
            }
        }
    },

    onClickDingQue(event, type){
        jlmj_audio_mgr.com_btn_click();

        this.setActive(false);

        let msg = new cc.pb.xuezhanmj.xzmj_req_dingque();
        msg.setType(type);
        cc.gateNet.Instance().sendMsg(cc.netCmd.xuezhanmj.cmd_xzmj_req_dingque, msg, "xzmj_req_dingque", true);
    }
});
