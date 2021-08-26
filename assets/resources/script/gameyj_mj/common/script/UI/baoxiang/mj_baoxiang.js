var Text = cc.dd.Text;
var task_cfg = require('task');
var RoomMgr = require('jlmj_room_mgr').RoomMgr;

const strTitle = [
    '铁宝箱',
    '铜宝箱',
    '银宝箱',
    '金宝箱',
];

cc.Class({
    extends: cc.Component,

    properties: {
        title_txt: cc.Label,
        task_layout: cc.Layout,
        task_baoxiang_node: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:
    //onLoad :function() {};
    setData: function (msg) {
        this.task_info = [
            Text.TEXT_BAOXIANG_3,
            Text.TEXT_BAOXIANG_4
        ];

        var gameId = RoomMgr.Instance().gameId;
        var roomId = RoomMgr.Instance().roomLv;

        var task_arr = task_cfg.getItemList(function (item) {
            return item.target.split(",")[0] == gameId && item.target.split(",")[1] == roomId;
        }.bind(this));

        if (!task_arr || !task_arr.length) {
            return;
        }

        this.title_txt.string = task_arr[0].title;

        var t_msg = [];
        task_arr.forEach(task => {
            var element = { flag: 0, taskData: task, taskId: task.key, progressList: [{ targetCnt: task.target.split(',')[2], curCnt: 0 }] };
            t_msg.push(element);
        });

        msg.forEach(element => {
            for (var i = 0; i < t_msg.length; i++) {
                if(element.taskId == t_msg[i].taskId){
                    t_msg[i].flag = element.flag;
                    t_msg[i].progressList = element.progressList;
                }
            }
        });

        this.task_layout.node.removeAllChildren(true);
        for (var i in t_msg) {
            var msg_data = t_msg[i];
            var list_data = msg_data.progressList[0];
            //var type = this.getBaoXiangType(msg_data.taskId);
            var index = strTitle.indexOf(msg_data.taskData.title);
            var type = index == -1 ? 0 : index;
            var info = this.task_info[msg_data.taskData.target.split(",")[4] - 1].format([list_data.targetCnt]);
            var data = {
                flag: msg_data.flag,
                taskId: msg_data.taskId,
                taskData: msg_data.taskData,
                type: type,
                targetCnt: list_data.targetCnt,
                curCnt: list_data.curCnt,
                taskInfo: info
            };
            this.setBaoxiangData(data, this.task_baoxiang_node);
        }
    },

    getBaoXiangType: function (taskId) {
        for (var i in this.task_id) {
            var task = this.task_id[i];
            if (task[0] == taskId || task[1] == taskId) {
                return task[2];
            }
        }
        return 0;
    },

    setBaoxiangData: function (data, baoxiang) {
        var baoxiang_node = cc.instantiate(baoxiang);
        baoxiang_node.active = true;
        baoxiang_node.getComponent('mj_baoxiang_node').setData(data);
        baoxiang_node.y = 0;
        this.task_layout.node.addChild(baoxiang_node);
    },

    close: function () {
        this.task_layout.node.removeAllChildren(true);
        cc.find('Canvas').getComponentInChildren('mj_baoxiang_btn').closeBaoXiang();
    },
    //start () {},

    // update (dt) {},
});
