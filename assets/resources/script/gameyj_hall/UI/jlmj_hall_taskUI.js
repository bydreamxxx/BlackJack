var hall_audio_mgr = require('hall_audio_mgr');
var task_cfg = require('task');
var Task = require('hall_task').Task;
var TaskED = require('hall_task').TaskED;
var TaskEvent = require('hall_task').TaskEvent;

cc.Class({
    extends: cc.Component,

    properties: {
        condition_txt: cc.Label,
        progress_bar: cc.ProgressBar,
        progress_txt: cc.Label,
        state_txt: cc.Label,
        lingqu_btn: cc.Button,

        award_layout: cc.Layout,
        award_item_prefab: cc.Prefab,
        coin_icon: cc.SpriteFrame,
    },

    onLoad: function () {
        TaskED.addObserver(this);
    },

    onDestroy: function () {
        TaskED.removeObserver(this);
    },

    setTaskId: function (task_id) {
        this.task_id = task_id;
        this.task = Task.Instance().getTask(this.task_id);
        this.task_cfg = task_cfg.getItem(function (item) {
            return item.key == task_id;
        });
        this.updateTaskCfg();
        this.updateTaskProgress();
    },

    /**
     * 更新任务配置信息:奖励和任务描述
     */
    updateTaskCfg: function () {
        if(this.task_cfg == null){
            cc.error(cc.js.formatStr('任务未配置,任务id=%d',this.task_id));
            cc.dd.PromptBoxUtil.show(cc.js.formatStr('任务未配置,任务id=%d',this.task_id));
            return;
        }
        this.condition_txt.string = this.task_cfg.desc;
        this.award_layout.node.removeAllChildren(true);
        if(this.task_cfg.awardCoin > 0){
            var node = cc.instantiate(this.award_item_prefab);
            node.parent = this.award_layout.node;
            var task_award_ui = node.getComponent('jlmj_hall_taskItem');
            if(task_award_ui == null){
                cc.error('未挂jlmj_hall_taskItem组件');
                return;
            }
            task_award_ui.setIcon(this.coin_icon);
            task_award_ui.setCount(this.task_cfg.awardCoin);
        }
        if(this.task_cfg.awardItems.length != 0){
            var award_list = this.task_cfg.awardItems.split(';');
            for(var i=0; i<award_list.length; ++i){
                if(award_list[i].length == 0){
                    continue;
                }
                var award = award_list[i].split(',');
                if(award.length < 2){
                    continue;
                }
                var node = cc.instantiate(this.award_item_prefab);
                node.parent = this.award_layout.node;
                var task_award_ui = node.getComponent('jlmj_hall_taskItem');
                if(task_award_ui == null){
                    cc.error('未挂jlmj_hall_taskItem组件');
                    return;
                }
                task_award_ui.setData(award[0],award[1]);
            }
        }
    },

    /**
     * 更新进度和领取状态
     */
    updateTaskProgress: function () {
        if(this.task == null){
            cc.log(cc.js.formatStr('任务:%d 无进度数据, UI读取配置信息',this.task_id));
            this.lingqu_btn.interactable = true;
            this.state_txt.string = "继续努力";
            if(this.task_cfg == null){
                cc.error(cc.js.formatStr('任务未配置,任务id=%d',this.task_id));
                cc.dd.PromptBoxUtil.show(cc.js.formatStr('任务未配置,任务id=%d',this.task_id));
                return;
            }
            var cnt = this.task_cfg.target.split(',');
            if(cnt.length < 3){
                cc.error(cc.js.formatStr('任务目标次数配置错误,任务id=%d',this.task_id));
                cc.dd.PromptBoxUtil.show(cc.js.formatStr('任务目标次数配置错误,任务id=%d',this.task_id));
                return;
            }
            this.progress_bar.progress = 0;
            this.progress_txt.string = cc.js.formatStr("0/%d",Number(cnt[2]));
            if(this.task_cfg.subType == 8){//荣誉任务
                this.progress_txt.string = cc.js.formatStr("0/%d",Number(cnt[1]));
            }

        }else{
            var progress = this.task.progressList[0];   //取第一个进度
            if(progress.curCnt>=progress.targetCnt){
                if(this.task.flag == 0){
                    this.lingqu_btn.interactable = true;
                    this.state_txt.string = "领 取";
                }else{
                    this.lingqu_btn.interactable = false;
                    this.state_txt.string = "已完成";
                }
            }else{
                this.lingqu_btn.interactable = true;
                this.state_txt.string = "继续努力";
            }
            this.progress_bar.progress = progress.curCnt/progress.targetCnt;
            this.progress_txt.string = cc.js.formatStr('%d/%d',progress.curCnt,progress.targetCnt);
        }
    },

    onClickClose: function () {
        hall_audio_mgr.Instance().com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
        TaskED.notifyEvent(TaskEvent.TASK_UPDATEUI, null);
    },

    onClickLingQu: function () {
        hall_audio_mgr.Instance().com_btn_click();
        if(this.task == null){
            // cc.log(cc.js.formatStr('任务:%d 无进度数据',this.task_id));
            cc.dd.UIMgr.destroyUI(this.node);
            return;
        }
        var progress = this.task.progressList[0];   //取第一个进度
        if(progress.curCnt>=progress.targetCnt){
            if(this.task.flag == 0){
                var msg = new cc.pb.rank.msg_submit_task_2s();
                msg.setTaskId(this.task_id);
                cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_msg_submit_task_2s, msg, 'msg_submit_task_2s', true);
                cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'msg_submit_task_2s');
                //cc.dd.UIMgr.destroyUI(this.node);
            }else{
                cc.dd.UIMgr.destroyUI(this.node);
            }
        }else{
            cc.dd.UIMgr.destroyUI(this.node);
        }
    },

    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage:function (event,data) {
        if(data != null && data[0] && data[0] != this.task_id){
            return;
        }
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
