const Hall = require('jlmj_halldata');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
const itemCfg = require("item");
cc.Class({
    extends: require("klb_hall_daily_sign"),

    init: function (data) {
        //this.goldParticleSystem.active = false;
        var self = this;
        if (data) {
            data.rewardListList.forEach(item => {

                var day_node = cc.find('bg/day' + item.index.toString(), this.node);
                var score = cc.find('count', day_node).getComponent(cc.Label);
                score.string = "";
                let hasMagic = false;
                for(let i = 0; i < item.itemListList.length; i++){
                    let _item = item.itemListList[i];
                    let config = itemCfg.getItem((a)=>{
                        if (a.key == _item.itemId)
                            return a;
                    })
                    if(config){
                        if(config.type === 7){//魔法道具
                            hasMagic = true;
                        }else{
                            score.string += _item.num.toString()+config.memo;
                            if(i < item.itemListList.length - 1){
                                score.string += "+";
                            }
                        }
                    }
                }
                if(hasMagic){
                    score.string += "魔法道具包"
                }
                // score.string = item.num.toString();
                if (item.state == 0) {//可领取
                    var get = cc.find('dangtiandiban', day_node);
                    get.active = true;
                    self.today = item.index;

                    var clickEventHandler = new cc.Component.EventHandler();
                    clickEventHandler.target = this.node; //这个 node 节点是你的事件处理代码组件所属的节点
                    clickEventHandler.component = "gamedl_daily_sign";//这个是代码文件名
                    clickEventHandler.handler = "sign";
                    clickEventHandler.customEventData = "";

                    let button = day_node.getComponent(cc.Button);
                    button.clickEvents.push(clickEventHandler);
                }else if (item.state == 2) {//已领取
                    cc.find('yilingqu', day_node).active = true;
                }
            });
        }
    },

    //发送领取
    sign: function (event, data) {
        hall_audio_mgr.com_btn_click();
        var index = this.today;
        if(this.isget == true){
            cc.dd.PromptBoxUtil.show('今日已签到已领取,不可重复领取!');
            return;
        }

        var msg = new cc.pb.hall.draw_seven_day_reward_req();
        msg.setIndex(index);
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_draw_seven_day_reward_req, msg, "发送签到: index=" + index, true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'draw_seven_day_reward_req');
    },

    //领取成功
    done: function (index) {
        this.isget = true;
        var day_node = cc.find('bg/day' + index.toString(), this.node);


        cc.find('dangtiandiban', day_node).active = false;
        cc.find('yilingqu', day_node).active = true;
        let button = day_node.getComponent(cc.Button);
        button.clickEvents = [];

        Hall.HallData.Instance().isSigned = true;
    },
});
