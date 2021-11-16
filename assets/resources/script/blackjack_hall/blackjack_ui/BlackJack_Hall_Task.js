let hall_audio_mgr = require('hall_audio_mgr').Instance();
const item_cfg = require('item');
const com_glistView = require('com_glistView');
const player_task = require('player_task');
const Hall = require('jlmj_halldata');
const HallCommonObj = require('hall_common_data');
var hall_prefab = require('hall_prefab_cfg');
var AppConfig = require('AppConfig');
var game_duli = require('game_duli');
const HallCommonEd = HallCommonObj.HallCommonEd;
const HallCommonEvent = HallCommonObj.HallCommonEvent;
let HallPropData = require('hall_prop_data').HallPropData.getInstance();

cc.Class({
    extends: cc.Component,

    properties: {
        glistView: com_glistView,       //列表
    },

    onLoad () {
        Hall.HallED.addObserver(this);
        HallCommonEd.addObserver(this);
        var pObj = new cc.pb.hall.hall_req_task();
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_hall_req_task, pObj,
            '发送协议[id: ${cmd_hall_req_task}],cmd_hall_req_task', true);
        cc.dd.NetWaitUtil.net_wait_end('网络状况不佳...', 'hall_task');
    },

    onDestroy: function () {
        Hall.HallED.removeObserver(this);
        HallCommonEd.removeObserver(this);
    },

    initData(msg) {
        let normalTask = [];
        msg.tasklistList.forEach(task => {
            var taskitem = player_task.getItem((item) => { return item.key == task.taskId; });
            if (taskitem) {
                var taskdata = {
                    taskId: task.taskId,
                    status: task.status,
                    curNum: task.curNum,
                    drewTimes: task.drewTimes,
                    title: taskitem.title,
                    desc: taskitem.desc,
                    reward_item: taskitem.reward_item,
                    active_num: taskitem.active_num,
                    trigger_num: taskitem.trigger_num,
                };
//                if (taskitem.active_num == -1) {
//                    //activeTask.push(taskdata);
//                }
//                else {
                    if(cc._applyForPayment && (taskitem.key == 6 || taskitem.key == 7 || taskitem.key == 4)){
                    }else{
                        normalTask.push(taskdata);
                    }
//                }
            }
        });
        normalTask.sort((a, b) => {
            if (a.status == 3) {
                if (b.status != 3)
                    return 1;
                else
                    return a.taskId - b.taskId;
            }
            else if (a.status == 2) {
                if (b.status != 2)
                    return -1;
                else
                    return a.taskId - b.taskId;
            }
            else {
                if (b.status == 1)
                    return a.taskId - b.taskId;
                else if (b.status == 2)
                    return 1;
                else if (b.status == 3)
                    return -1;
            }
        });

        this.glistView.setDataProvider(normalTask, 0, function (itemNode, index) {
            if (index < 0 || index >= normalTask.length)
                return;
            var element = normalTask[index];
            itemNode.tag = element.taskId;
            itemNode.getChildByName('title').active = false;
            itemNode.getChildByName('desc').getComponent("LanguageLabel").setText(element.title);
            itemNode.getChildByName('gold').getComponent(cc.Label).string = element.reward_item.split(',')[1];
            //itemNode.getChildByName('active').getComponent(cc.Label).string = 'X' + element.active_num;
            itemNode.getChildByName('jindu').getComponent(cc.Label).string = element.curNum + '/' + element.trigger_num;
            itemNode.getChildByName('ing').active = element.status == 1;
            itemNode.getChildByName('award').active = element.status == 2;
            itemNode.getChildByName('finish').active = element.status == 3;
        }.bind(this));
        this.normalTask = normalTask;
    },

    updateData(msg) {
        for (var i = 0; i < this.normalTask.length; i++) {
            if (this.normalTask[i].taskId == msg.task.taskId) {
                this.normalTask[i].status = msg.task.status;
                this.normalTask[i].curNum = msg.task.curNum;
                this.normalTask[i].drewTimes = msg.task.drewTimes;
                this.updateNormal();
            }
        }
    },

    updateNormal() {
        this.normalTask.sort((a, b) => {
            if (a.status == 3) {
                if (b.status != 3)
                    return 1;
                else
                    return a.taskId - b.taskId;
            }
            else if (a.status == 2) {
                if (b.status != 2)
                    return -1;
                else
                    return a.taskId - b.taskId;
            }
            else {
                if (b.status == 1)
                    return a.taskId - b.taskId;
                else if (b.status == 2)
                    return 1;
                else if (b.status == 3)
                    return -1;
            }
        });
        let normalTask = this.normalTask;
        this.glistView.setDataProvider(normalTask, 0, function (itemNode, index) {
            if (index < 0 || index >= normalTask.length)
                return;
            var element = normalTask[index];
            itemNode.tag = element.taskId;
            //itemNode.getChildByName('title').getComponent(cc.Label).string = element.title;
            itemNode.getChildByName('desc').getComponent("LanguageLabel").setText(element.title);
            itemNode.getChildByName('gold').getComponent(cc.Label).string = element.reward_item.split(',')[1];
            //itemNode.getChildByName('active').getComponent(cc.Label).string = 'X' + element.active_num;
            itemNode.getChildByName('jindu').getComponent(cc.Label).string = '进度' + element.curNum + '/' + element.trigger_num;
            itemNode.getChildByName('ing').active = element.status == 1;
            itemNode.getChildByName('award').active = element.status == 2;
            itemNode.getChildByName('finish').active = element.status == 3;
        }.bind(this));
    },

    onClickFinish(event, custom) {
        var taskId = event.target.parent.tag;
        var pObj = new cc.pb.hall.hall_req_draw_task();
        pObj.setTaskId(taskId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_hall_req_draw_task, pObj,
            '发送协议[id: ${hall_req_draw_task}],hall_req_draw_task', true);
    },

    closeBtn() {
        hall_audio_mgr.com_btn_click();
        cc.dd.SceneManager.enterNewHall(this.node);
        cc.dd.UIMgr.destroyUI(this.node);
    },

    onEventMessage(event, data) {
        switch (event) {
            case Hall.HallEvent.TASK_INFO:
                this.initData(data);
                break;
            case Hall.HallEvent.TASK_UPDATE:
                this.updateData(data);
                break;
            default:
                break;
        }
    },
});
