var welfareBagCfg = require('welfareBag');
const Hall = require('jlmj_halldata');
var TaskEvent = cc.Enum({
    TASK_CHANGE: 'task_change',      //任务改变
    TASK_FINISH: 'task_finish',      //任务完成
    TASK_TRIGGER: 'task_trigger',     //任务触发结果
    TASK_UPDATEUI: 'task_updateUI',    //任务更新界面
    //轮盘
    LOTTERY_ERROR: 'LOTTERY_ERROR',   //抽奖报错
    LOTTERY_RWARD: 'LOTTERY_RWARD',   //抽奖结果
    LOTTERY_UPDATE_HISTORY: 'LOTTERY_UPDATE_HISTORY',//抽奖记录
    LOTTERY_UPDATE_COUNT: 'LOTTERY_UPDATE_COUNT',//抽奖记录

    //vip
    VIP_GET_GIFT_INFO: "VIP_GET_GIFT_INFO",//是否购买过vip礼包
});
const data_reward = require('reward')
var TaskED = new cc.dd.EventDispatcher();
var LotteryError = cc.Enum({
    [-1]: "抽奖卡不足",
    [-2]: "元宝不足",
    [-3]: "话费不足",
    [-4]: "红包不足",
    [-5]: "加入背包失败",
    [-6]: "未到开放时间",
});

var s_task = null;
var Task = cc.Class({

    statics: {
        Instance: function () {
            if (s_task == null) {
                s_task = new Task();
            }
            return s_task;
        },

        Destroy: function () {
            if (s_task) {
                s_task = null;
            }
        },
    },

    ctor: function () {
        this.task_list = [];
        this.task_level = 1;
    },

    getTask: function (id) {
        var task = null;
        this.task_list.forEach(function (item) {
            if (item.taskId == id) {
                task = item;
            }
        });
        return task;
    },

    checkTaskCanAward: function(){
        for(var i = 0; i < this.task_list.length; i++){
            //var curCnt = this.task_list[i].progressList[0].curCnt;
            //var targetCnt = this.task_list[i].progressList[0].targetCnt;
            var data = welfareBagCfg.getItem(function(item){
                if(item.task_id == this.task_list[i].taskId)
                    return item;
            }.bind(this));
            if(( data && this.task_list[i].taskId == data.task_id ) && this.task_list[i].flag == 0 
                && (this.task_list[i].progressList[0].curCnt >= this.task_list[i].progressList[0].targetCnt))
                return true;
        }
        return false;
    },

    taskChange: function (id, progress_list) {
        var task = this.getTask(id);
        if (task == null) {
            task = {};
            task.taskId = id;
            task.flag = 0;
            task.progressList = progress_list;
            this.task_list.push(task);
        } else {
            task.progressList = progress_list;
        }
        TaskED.notifyEvent(TaskEvent.TASK_CHANGE, [task.taskId, task.progressList]);
    },

    taskFinish: function (id) {
        var task = this.getTask(id);
        if (task) {
            task.flag = 1;
            TaskED.notifyEvent(TaskEvent.TASK_FINISH, [task.taskId, task.flag]);
        }
    },

    //轮盘
    getLotteryReward: function (msg) {
        if (msg.retcode == 1) {
            this.m_lotteryCnt = msg.cnt;
            TaskED.notifyEvent(TaskEvent.LOTTERY_RWARD, [msg.id, msg.cnt, msg.mainType, msg.subType]);
        } else {
            cc.dd.PromptBoxUtil.show(LotteryError[msg.retcode]);
            TaskED.notifyEvent(TaskEvent.LOTTERY_ERROR, null);

            if(msg.retcode == -6){
                if(cc.game_pid == 10008){
                    cc._chifengLucky = false;
                    Hall.HallED.notifyEvent(Hall.HallEvent.CHIFENG_LUCKY);
                }
            }
        }

    },

    setLotteryHistory: function (msg) {
        this.m_lotteryHistory = msg.listList;
    },

    getLotteryHistoryByType: function (lottery_type) {
        var result = [];
        this.itemData = null;
        for (var i = 0; i < this.m_lotteryHistory.length; i++) {
            this.itemData = data_reward.getItem(function (element) {
                if (element.key == this.m_lotteryHistory[i].id)
                    return true;
                else
                    return false;
            }.bind(this));

            if (lottery_type == (this.itemData.type - 1)) {
                result.push(this.m_lotteryHistory[i]);
            }


        }

        return result;
    },

    updateLotteryHistory: function (msg) {
        this.m_lotteryHistory.push(msg.st);
        if (this.m_lotteryHistory.length > 5) {
            this.m_lotteryHistory.shift();
        }
        TaskED.notifyEvent(TaskEvent.LOTTERY_UPDATE_HISTORY, [msg.st.playerid]);

    },

    setLotteryTimes: function (msg) {
        this.m_lotteryCnt = msg.cnt
        TaskED.notifyEvent(TaskEvent.LOTTERY_UPDATE_COUNT, null);
    },

    setTaskLevel: function (level) {
        this.task_level = level;
        TaskED.notifyEvent(TaskEvent.TASK_TRIGGER, null);
    },
});

module.exports = {
    Task: Task,
    TaskED: TaskED,
    TaskEvent: TaskEvent,
};
