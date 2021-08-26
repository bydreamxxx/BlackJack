var gameData = require('mouse_hit_Data').Mouse_Hit_Data.Instance();
var mouse_hit_Ed = require('mouse_hit_Data').Mouse_Hit_Ed;
var mouse_hit_Event = require('mouse_hit_Data').Mouse_Hit_Event;
let mouse_send_msg = require('net_sender_mouse');
let TaskConfig = require("mouse_task");
var result = {
    [0]: '成功',
    [1]: '没有此玩家',
    [2]: '没有此锤子',
    [3]: '体力或者怒气不够',
    [4]: '参数错误',
    [5]: '没有此地鼠',
};
var hanlder = {
    //使用锤子后的返回
    on_msg_use_hammer_ret(msg) {
        gameData.isCanHammer = true;
        let retCode = msg.retCode;
        if (retCode == 0) {
            gameData.myPower = msg.power;
            gameData.myAnger = msg.anger;
            msg.rewardCoin = msg.coin - gameData.myCoin;
            gameData.myCoin = msg.coin;
            msg.useHammerId = gameData.useHammerId;
            mouse_hit_Ed.notifyEvent(mouse_hit_Event.MOUSE_HIT_RESULT, msg)
        } else if (retCode == 5) {
            mouse_hit_Ed.notifyEvent(mouse_hit_Event.MOUSE_DIS, msg);
        }
        else {
            cc.dd.PromptBoxUtil.show(result[retCode])
        }
    },
    //红包结果 取消不要, 改为获取服务器时间
    on_msg_choose_redbag_ret(msg) {
        if (msg.retCode == 0) {
            cc.log("服务器时间>>>>>>>", new Date(msg.time).format(" hh:mm:ss"));
         gameData.timeDifference = msg.time - new Date().getTime(); //时间误差
        }
    },
    //记录结果
    on_msg_mouse_record_ret(msg) {
        mouse_hit_Ed.notifyEvent(mouse_hit_Event.MOUSE_RECORD, msg)
    },
    //任务
    on_msg_mouse_task_ret(msg) {
        cc.dd.NetWaitUtil.net_wait_end('msg_mouse_task');
        if (msg.retCode == 0) {
            if (!msg.op) {
                gameData.myCoin = msg.coin;
                mouse_send_msg.taskReq(1, null);
                let taskId = gameData.getTaskId;
                let taskCon = TaskConfig.getItem(function (item) {
                    return item.key == taskId
                });
                let list = [];
                let obj = {};
                obj.id = 1001;
                obj.num = taskCon.reward;
                list.push(obj);
                cc.dd.RewardWndUtil.show(list, false);
            } else {
                gameData.taskList = msg.taskList;
                mouse_hit_Ed.notifyEvent(mouse_hit_Event.MOUSE_TASK, msg.taskList);
            }
        }
    },
    on_msg_mouse_show(msg) {
        let mouseList = msg.mouseList;
        mouseList.sort((a, b) => { return a.mouseTime - b.mouseTime });
        mouseList.forEach((item) => {
            cc.log("holdId", item.holeId,"生成老鼠消失时间>>>>>>>", new Date(item.mouseTime).format(" hh:mm:ss"));
            item.mouseTime -= 400;
            cc.log("holdId", item.holeId, "生成老鼠消失时间减去400ms时间>>>>>>>", new Date(item.mouseTime).format(" hh:mm:ss"));
        })
        mouse_hit_Ed.notifyEvent(mouse_hit_Event.MOUSE_SHOW, mouseList);
    },
    on_msg_mouse_power(msg) {
        gameData.myPower = msg.power;
        mouse_hit_Ed.notifyEvent(mouse_hit_Event.MOUSE_POWER);
    },
    //进入房间老鼠信息
    on_msg_mouse_room_info(msg) {
        gameData.myPower = msg.power;
        gameData.myAnger = msg.anger;
        gameData.myCoin = msg.coin;
        let mouseList = msg.mouseList;
        mouseList.sort((a, b) => { return a.mouseTime - b.mouseTime });
        mouseList.forEach((item) => {
            cc.log("holdId", item.holeId, "生成老鼠消失时间>>>>>>>", new Date(item.mouseTime).format(" hh:mm:ss"));
            item.mouseTime -= 400;
            cc.log("holdId", item.holeId, "生成老鼠消失时间减去400ms时间>>>>>>>", new Date(item.mouseTime).format(" hh:mm:ss"));
        })
        mouse_hit_Ed.notifyEvent(mouse_hit_Event.MOUSE_ROOM_INFO, mouseList);

    },
    on_mouse_hole_info(msg) {

    }

    //
};
module.exports = hanlder;
