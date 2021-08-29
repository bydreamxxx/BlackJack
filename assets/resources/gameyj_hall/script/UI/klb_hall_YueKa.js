//create by wj 2018/03/16
const task_data = require('task');
var hall_audio_mgr = require('hall_audio_mgr');
var Task = require('hall_task').Task;
var TaskED = require('hall_task').TaskED;
var TaskEvent = require('hall_task').TaskEvent;

cc.Class({
    extends: cc.Component,

    properties: {
        itemPrefab: {
            default: [],
            type: cc.Node,
        },


        atlasIcon: {
            default: null,
            type: cc.SpriteAtlas,
        },

        state_txt: cc.Label,
        lingqu_btn: cc.Button,
        time_text: cc.Label,
        shineNode: cc.Node,
    },


    onDestroy: function () {
        TaskED.removeObserver(this);
    },
    
    onLoad () {
        TaskED.addObserver(this);

        var task_cfg = task_data.getItem(function (taskData) {
            return taskData.key == 48;
        });
        if(task_cfg){
            var award_list = task_cfg.awardItems.split(';');
            for(var i=0; i<award_list.length; ++i){
                if(award_list[i].length == 0){
                    continue;
                }
                var award = award_list[i].split(',');
                if(award.length < 2){
                    continue;
                }
                if(i < this.itemPrefab.length){
                    this.itemPrefab[i].active = true;
                    var icon = this.itemPrefab[i].getChildByName('icon').getComponent(cc.Sprite);
                    var num = this.itemPrefab[i].getChildByName('num').getComponent(cc.Label);

                    var spriteFrame = this.atlasIcon.getSpriteFrame(award[0]);
                    icon.spriteFrame = spriteFrame;
                    num.string = 'x' + award[1];
                }
            }
            this.time_text.node.active = false;
            var task_data_server = Task.Instance().getTask(48);
            if(task_data_server){
                if(task_data_server.flag == 0){
                    this.lingqu_btn.interactable = true;
                    this.state_txt.string = "领取礼包";
                    this.shineNode.active =  true;
                    var seq = cc.sequence(cc.fadeIn(0.8), cc.fadeOut(0.8));
                    this.shineNode.runAction(cc.repeatForever(seq));
                }else{
                    this.lingqu_btn.interactable = false;
                    this.state_txt.string = "已领取";
                    this.shineNode.active =  false;
                }
                //倒计时描述
                var date = new Date(task_data_server.expireTime * 1000 );
                var y = date.getFullYear();
                var m = (date.getMonth() + 1 < 10) ? '0' + (date.getMonth() + 1) : date.getMonth()+1;
                var d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
                var h  = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
                var min = date.getMinutes() < 10 ? '0' +  date.getMinutes() : date.getMinutes();
                var sec =  date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
                var string = '已购买,截止日期:' + y + '-' + m + '-' + d + ' ' + h + ':' + m + ':' + sec;
                this.time_text.string = string;
                this.time_text.node.active = true;

            }
        };
    },

    onClickGetAward: function(){
        var task_data_server = Task.Instance().getTask(48);
        if(task_data_server == null){
            cc.dd.PromptBoxUtil.show('您未购买月卡，不能领取福利');
            return;
        }
        hall_audio_mgr.Instance().com_btn_click();
        var pbObj = new cc.pb.rank.msg_submit_task_2s();
        pbObj.setTaskId(48);
        cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_msg_submit_task_2s, pbObj, 'msg_submit_task_2s', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'msg_submit_task_2s');
    },

    updateTaskProgress: function(){
        this.lingqu_btn.interactable = false;
        this.state_txt.string = "已领取";
        this.shineNode.active =  false;
    },

    close: function(){
        hall_audio_mgr.Instance().com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
        TaskED.notifyEvent(TaskEvent.TASK_UPDATEUI, null);
    },

    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage:function (event,data) {
        switch (event){
            case TaskEvent.TASK_CHANGE:
                this.updateTaskProgress();
                break;
            case TaskEvent.TASK_FINISH:
                this.updateTaskProgress();
                break;
            default:
                break;
        }
    }
});
