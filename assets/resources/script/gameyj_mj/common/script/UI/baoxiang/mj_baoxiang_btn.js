var jlmj_prefab = require('jlmj_prefab_cfg');
var HallTask = require('hall_task').Task;
var task_cfg = require('task');
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var TaskED = require('hall_task').TaskED;
var TaskEvent = require('hall_task').TaskEvent;

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start:function() {
        TaskED.addObserver(this);
        this.updateTaskBaoxiang();
    },

    onDestroy:function(){
        TaskED.removeObserver(this);
    },

    onEventMessage: function (event, data) {
        switch (event) {
            case TaskEvent.TASK_FINISH:
                this.updateTaskBaoxiang(data[0], data[1]);
                break;
            case TaskEvent.TASK_CHANGE:
                this.updateTaskBaoxiang(data[0], data[1]);
                break;
        }
    },

    //宝箱
    onBaoXiang: function () {
        cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_BAO_XIANG, function (ui) {
            this.baoxiang_ui = ui;
            var msg = [];
            var list = HallTask.Instance().task_list;
            var show_ani = [];

            var gameId = RoomMgr.Instance().gameId;
            var roomId = RoomMgr.Instance().roomLv;

            this.task_arr = task_cfg.getItemList(function (item) {
                return item.target.split(",")[0] == gameId && item.target.split(",")[1] == roomId;
            }.bind(this));

            for (var i in list) {
                var data = list[i];
                for (var idx in this.task_arr) {
                    var task_data = this.task_arr[idx];
                    if (task_data.key == data.taskId) {
                        var task = data.progressList[0];
                        msg.push({ taskId: data.taskId, progressList: data.progressList });
                        cc.log("任务" + task_data.key + "进度:" + task.curCnt + "/" + task.targetCnt);
                        show_ani.push(task.curCnt >= task.targetCnt);
                    }
                }
            }
            for (var i in show_ani) {
                var guanghuan = this.node.getChildByName('guanghuan');
                if (show_ani[i]) {
                    guanghuan.active = true;
                    var gh_ani = guanghuan.getComponent(cc.Animation);
                    gh_ani.play('mj_baoxiang_btn');
                    break;
                } else {
                    guanghuan.active = false;
                }
            }

            this.mj_baoxiang = ui.getComponent("mj_baoxiang");
            this.mj_baoxiang.setData(msg);
        }.bind(this));
    },
    updateTaskBaoxiang: function (taskId, data) {
        var msg = [];
        var list = HallTask.Instance().task_list;
        var show_ani = [];

        var gameId = RoomMgr.Instance().gameId;
        var roomId = RoomMgr.Instance().roomLv;

        var guanghuan = this.node.getChildByName('guanghuan');
        if(!guanghuan){
            return;
        }

        this.task_arr = task_cfg.getItemList(function (item) {
            return item.target.split(",")[0] == gameId && item.target.split(",")[1] == roomId;
        }.bind(this));

        for (var i in list) {
            var data = list[i];
            for (var idx in this.task_arr) {
                var task_data = this.task_arr[idx];
                if (task_data.key == data.taskId) {
                    var task = data.progressList[0];
                    msg.push({ taskId: data.taskId, progressList: data.progressList });
                    cc.log("任务" + task_data.key + "进度:" + task.curCnt + "/" + task.targetCnt);
                    show_ani.push(task.curCnt >= task.targetCnt);
                }
            }
        }
        for (var i in show_ani) {
            if (show_ani[i]) {
                guanghuan.active = true;
                var gh_ani = guanghuan.getComponent(cc.Animation);
                gh_ani.play('mj_baoxiang_btn');
                break;
            } else {
                guanghuan.active = false;
            }
        }
    },
    closeBaoXiang: function () {
        cc.dd.UIMgr.destroyUI(jlmj_prefab.JLMJ_BAO_XIANG);
        this.mj_baoxiang = null;
    },

    // update (dt) {},
});
