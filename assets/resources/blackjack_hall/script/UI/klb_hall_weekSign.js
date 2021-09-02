var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        today:0,
        isget:false,
        goldParticleSystem: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
    },

    init: function (data) {
        this.goldParticleSystem.active = false;
        var self = this;
        if (data) {
            data.rewardListList.forEach(item => {
                
                var day_node = cc.find('actNode/sign/day' + item.index.toString(), this.node);
                var score = cc.find('score', day_node).getComponent(cc.Label);
                score.string = item.num.toString();
                if (item.state == 0) {//可领取
                    //var button = day_node.getComponent(cc.Button);
                    //button.interactable = true;
                    cc.find('title', day_node).color = cc.color(255, 225, 48);
                    var get = cc.find('get', day_node);
                    get.active = true;
                    self.today = item.index;
                    self.isget = false;
                }
                else if (item.state == 2) {//已领取
                    cc.find('done', day_node).active = true;
                    self.isget = true;
                }
            });
        }
    },

    //发送领取
    sign: function (event, data) {
        hall_audio_mgr.com_btn_click();
        var index = parseInt(data);
        if(index != this.today){
            cc.dd.PromptBoxUtil.show('条件不足,不可领取!');
            return;
        }else if(this.isget == true){
            cc.dd.PromptBoxUtil.show('今日已签到已领取,不可重复领取!');
            return;
        }
        var msg = new cc.pb.hall.draw_seven_day_reward_req();
        msg.setIndex(index);
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_draw_seven_day_reward_req, msg, "发送签到: index=" + data, true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'draw_seven_day_reward_req');
    },

    //领取成功
    done: function (index) {
        if(this.goldParticleSystem)
            this.goldParticleSystem.active = true;
        var day_node = cc.find('actNode/sign/day' + index.toString(), this.node);
        var button = day_node.getComponent(cc.Button);
        button.interactable = false;
        cc.find('title', day_node).color = cc.color(255, 255, 255);
        var get = cc.find('get', day_node);
        get.active = false;
        cc.find('done', day_node).active = true;
    },

    closeUI: function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },
});
