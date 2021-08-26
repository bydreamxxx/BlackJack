// create by wj 2021/6/30
var Mouse_Hit_Event = cc.Enum({
    MOUSE_ROOM_INFO: "mouse_room_info", //初始化房间的信息
    MOUSE_SHOW: "mouse_show",//展示老鼠
    MOUSE_HIT_RESULT: "mouse_hit_result", //老鼠敲击的结果;
    MOUSE_REDGAG_RESULT: "mouse_redbag_result",//红包结果;
    MOUSE_RECORD: "mouse_record", //老鼠获奖记录
    MOUSE_TASK: "mouse_task",//
    MOUSE_POWER: "mouse_power",
    MOUSE_DIS:"mouse_dis", //老鼠消失
});
var Mouse_Hit_Ed = new cc.dd.EventDispatcher();

var Mouse_Hit_Data = cc.Class({
    s_mouse_hit_data: null,
    statics: {
        Instance: function () {
            if (!this.s_mouse_hit_data) {
                this.s_mouse_hit_data = new Mouse_Hit_Data();
            }
            return this.s_mouse_hit_data;
        },

        Destroy: function () {
            if (this.s_mouse_hit_data) {
                this.s_mouse_hit_data.clear();
                this.ss_mouse_hit_data = null;
            }
        },
    },

    ctor() {
        this.myPower = 0;
        this.myCoin = 0;
        this.myAnger = 0;
        this.timeDifference = 0;
        this.taskList = []; //任务列表
        this.useHammerId = 0;  
        this.getTaskId = 0;
        this.ordinaryHammerId = 0;
        this.AutoHammer = false;
        this.isCanHammer = true; //服务器消息返回回来才能继续锤
    },
    //属性
    properties: {


    },
    clear() {
        this.myPower = 0;
        this.myCoin = 0;
        this.myAnger = 0;
        this.timeDifference = 0;
        this.taskList = []; //任务列表
        this.useHammerId = 0;
        this.getTaskId = 0;
        this.ordinaryHammerId = 0;
        this.AutoHammer = false;
        this.isCanHammer = true;
    },

    /**
     * 玩家进入
     * @param {player_common_data} role_info 
     */
    playerEnter(role_info) {
    },

    /**
     * 玩家离开
     * @param {*} userId 
     */
    playerExit(userId) {
    },

    /**
     * 获取总玩家人数
     */
    getPlayerNum: function () {
    },

    getPlayer(id) {
    },

    updatePlayerNum() { },
    requesYuYinUserData() { },
    setReady(r) { },
    setOnLine(ol) { },
});

module.exports = {
    Mouse_Hit_Data: Mouse_Hit_Data,
    Mouse_Hit_Event: Mouse_Hit_Event,
    Mouse_Hit_Ed: Mouse_Hit_Ed,
}
