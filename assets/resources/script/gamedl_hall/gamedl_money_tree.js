const Hall = require('jlmj_halldata');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var SysED = require("com_sys_data").SysED;
var SysEvent = require("com_sys_data").SysEvent;

cc.Class({
    extends: cc.Component,

    properties: {
        spine: sp.Skeleton,
        showParticle: cc.Node,
        clickParticle: cc.Node,

        label: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Hall.HallED.addObserver(this);
        SysED.addObserver(this);

        var req = new cc.pb.hall.client_tree_info_req();
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_client_tree_info_req, req,
            '发送协议client_tree_info_req', true);

        this.treeTime = 0;
        this.label.string = '';
        this.schedule(this.updateTime.bind(this), 1);

        this.node.active = false;
    },

    onDestroy(){
        Hall.HallED.removeObserver(this);
        SysED.removeObserver(this);
        this.unschedule(this.updateTime);
    },

    onClick(){
        hall_audio_mgr.com_btn_click();
        if(this.label.string.length != 0){
            cc.dd.PromptBoxUtil.show('摇钱树冷却中，请一会再来喔');
            return;
        }

        var req = new cc.pb.hall.client_tree_req();
        req.setTreeId(this.treeID);
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_client_tree_req, req,
            '发送协议[id: ${cc.netCmd.hall.cmd_client_tree_req}],client_tree_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'get_money_tree');
    },

    setNormal(){
        this.spine.setAnimation(0, 'xh', true);
        this.spine.setCompleteListener(null);

        this.showParticle.active = true;
        this.clickParticle.active = false;
    },

    onEventMessage(event, data) {
        switch (event) {
            case Hall.HallEvent.MONEY_TREE:
                this.treeID = data.treeId;
                this.treeTime = data.time;
                this.treeCoin = data.coin;
                if(this.treeID > 0){
                    this.node.active = true;
                    this.setNormal();
                }else{
                    this.node.active = false;
                }
                break;
            case Hall.HallEvent.GET_MONEY_TREE:
                if(data.retCode > 0){
                    this.spine.setAnimation(0, 'dj', true);
                    this.spine.setCompleteListener(()=>{
                        this.setNormal();

                        var req = new cc.pb.hall.client_tree_info_req();
                        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_client_tree_info_req, req,
                            '发送协议client_tree_info_req', true);

                        cc.dd.RewardWndUtil.show([{ id: 1001, num: data.retCode }], false);
                    });

                    this.showParticle.active = false;
                    this.clickParticle.active = true;
                    this.clickParticle.getComponent(cc.ParticleSystem).resetSystem();
                }else{
                    cc.dd.PromptBoxUtil.show('摇钱树冷却中，请一会再来喔');
                }
                break;
            case SysEvent.RESUME:
                var req = new cc.pb.hall.client_tree_info_req();
                cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_client_tree_info_req, req,
                    '发送协议client_tree_info_req', true);
                break;
        }
    },

    updateTime(){
        let sysTime = new Date().getTime() / 1000;
        let time = this.treeTime - sysTime;
        if(time <= 0){
            this.label.string = '';
        }else{
            let hours = Math.floor(time / 3600);
            let mins = Math.floor(time % 3600 / 60);
            let seconds = Math.floor(time % 60);

            let time_str = (mins < 10 ? '0' + mins : mins) + ':' + (seconds < 10 ? '0' + seconds : seconds);
            if(hours > 0){
                time_str = (hours < 10 ? '0' + hours : hours) + ':' + time_str;
            }
            this.label.string = time_str;
        }
    }
});
