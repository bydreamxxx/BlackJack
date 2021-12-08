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
        goldLbl: cc.Label,              //金币
        activeBar: cc.ProgressBar,      //活跃值进度条
        activeLbl: cc.Label,            //活跃值
        glistView: com_glistView,       //列表
        fuliBtn: cc.Node,             //福利按钮
    },

    // LIFE-CYCLE CALLBACKS:
    // start() {},
    // update (dt) {},
    onLoad() {
        if (this.fuliBtn)
            this.fuliBtn.active = !cc._inviteTaskFinish && cc._inviteTaskRole && cc._inviteTaskOpen;
        cc.find('tips', this.node).on(cc.Node.EventType.TOUCH_START, this.touchTips.bind(this));
        Hall.HallED.addObserver(this);
        HallCommonEd.addObserver(this);
        this.updateGold();
        var pObj = new cc.pb.hall.hall_req_task();
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_hall_req_task, pObj,
            '发送协议[id: ${cmd_hall_req_task}],cmd_hall_req_task', true);
        cc.dd.NetWaitUtil.net_wait_end('网络状况不佳...', 'hall_task');
    },

    onDestroy: function () {
        Hall.HallED.removeObserver(this);
        HallCommonEd.removeObserver(this);
    },

    touchTips() {
        cc.log('touch tips');
        cc.find('tips', this.node).active = false;
    },

    touchTest(event) {
        cc.log(event.touch._point);
    },

    initData(msg) {
        let normalTask = [];
        let activeTask = [];
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
                if (taskitem.active_num == -1) {
                    activeTask.push(taskdata);
                }
                else {
                    if(cc._applyForPayment && (taskitem.key == 6 || taskitem.key == 7 || taskitem.key == 4)){
                    }else{
                        normalTask.push(taskdata);
                    }
                }
            }
        });
        activeTask.sort((a, b) => { return a.trigger_num - b.trigger_num; });
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
        this.num = activeTask[0].curNum;
        this.activeLbl.string = activeTask[0].curNum.toString();
        this.activeBar.progress = activeTask[0].curNum > 100 ? 1 : activeTask[0].curNum / 100;
        for (var i = 0; i < 5; i++) {
            cc.find('active_daily/gift' + (i + 1) + '/node', this.node).getComponent(cc.Button).interactable = (activeTask[i].status != 3);
            cc.find('active_daily/gift' + (i + 1) + '/node/finished', this.node).active = (activeTask[i].status == 3);
            cc.find('active_daily/gift' + (i + 1) + '/node/award', this.node).active = (activeTask[i].status == 2);
            if (activeTask[i].status == 2) {
                cc.find('active_daily/gift' + (i + 1) + '/node', this.node).getComponent(cc.Animation).play('gift_tiaodong');
            }
            else {
                cc.find('active_daily/gift' + (i + 1) + '/node', this.node).getComponent(cc.Animation).stop();
                cc.find('active_daily/gift' + (i + 1) + '/node', this.node).setPosition(0, 0);
                cc.find('active_daily/gift' + (i + 1) + '/node', this.node).rotation = 0;
            }
        }
        this.glistView.setDataProvider(normalTask, 0, function (itemNode, index) {
            if (index < 0 || index >= normalTask.length)
                return;
            var element = normalTask[index];
            itemNode.tag = element.taskId;
            itemNode.getChildByName('title').getComponent(cc.Label).string = element.title;
            itemNode.getChildByName('desc').getComponent(cc.Label).string = element.desc;
            itemNode.getChildByName('gold').getComponent(cc.Label).string = 'X' + element.reward_item.split(',')[1];
            itemNode.getChildByName('active').getComponent(cc.Label).string = 'X' + element.active_num;
            itemNode.getChildByName('jindu').getComponent(cc.Label).string = '进度' + element.curNum + '/' + element.trigger_num;
            itemNode.getChildByName('ing').active = element.status == 1;
            itemNode.getChildByName('award').active = element.status == 2;
            itemNode.getChildByName('finish').active = element.status == 3;
        }.bind(this));
        this.activeTask = activeTask;
        this.normalTask = normalTask;
    },

    updateData(msg) {
        for (var i = 0; i < this.activeTask.length; i++) {
            if (this.activeTask[i].taskId == msg.task.taskId) {
                this.activeTask[i].status = msg.task.status;
                this.activeTask[i].curNum = msg.task.curNum;
                this.activeTask[i].drewTimes = msg.task.drewTimes;
                this.num = msg.task.curNum
                this.activeLbl.string = msg.task.curNum.toString();
                this.activeBar.progress = msg.task.curNum > 100 ? 1 : msg.task.curNum / 100;
                this.updateActive();
            }
        }
        for (var i = 0; i < this.normalTask.length; i++) {
            if (this.normalTask[i].taskId == msg.task.taskId) {
                this.normalTask[i].status = msg.task.status;
                this.normalTask[i].curNum = msg.task.curNum;
                this.normalTask[i].drewTimes = msg.task.drewTimes;
                this.updateNormal();
            }
        }
        var bl = !cc._inviteTaskFinish && cc._inviteTaskRole && cc._inviteTaskOpen;
        if (this.num >= cc._inviteTaskActiveNum && bl) {
            this.onClickFuli();
        }
    },

    updateGold() {
        this.goldLbl.string = this.changeNumToCHN(HallPropData.getCoin()) || '0';
    },

    changeNumToCHN(num) {
        var str = '';
        if (num >= 100000000) {
            str = (num / 100000000.00).toFixed(1) + '亿';
        } else if (num >= 10000000) {
            str = (num / 10000000.00).toFixed(1) + '千万';
        } else if (num >= 100000) {
            str = (num / 10000.00).toFixed(1) + '万';
        } else {
            str = num;
        }
        return str;
    },

    updateActive() {
        for (var i = 0; i < 5; i++) {
            cc.find('active_daily/gift' + (i + 1) + '/node', this.node).getComponent(cc.Button).interactable = (this.activeTask[i].status != 3);
            cc.find('active_daily/gift' + (i + 1) + '/node/finished', this.node).active = (this.activeTask[i].status == 3);
            cc.find('active_daily/gift' + (i + 1) + '/node/award', this.node).active = (this.activeTask[i].status == 2);
            if (this.activeTask[i].status == 2) {
                cc.find('active_daily/gift' + (i + 1) + '/node', this.node).getComponent(cc.Animation).play('gift_tiaodong');
            }
            else {
                cc.find('active_daily/gift' + (i + 1) + '/node', this.node).getComponent(cc.Animation).stop();
                cc.find('active_daily/gift' + (i + 1) + '/node', this.node).setPosition(0, 0);
                cc.find('active_daily/gift' + (i + 1) + '/node', this.node).rotation = 0;
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
            itemNode.getChildByName('title').getComponent(cc.Label).string = element.title;
            itemNode.getChildByName('desc').getComponent(cc.Label).string = element.desc;
            itemNode.getChildByName('gold').getComponent(cc.Label).string = 'X' + element.reward_item.split(',')[1];
            itemNode.getChildByName('active').getComponent(cc.Label).string = 'X' + element.active_num;
            itemNode.getChildByName('jindu').getComponent(cc.Label).string = '进度' + element.curNum + '/' + element.trigger_num;
            itemNode.getChildByName('ing').active = element.status == 1;
            itemNode.getChildByName('award').active = element.status == 2;
            itemNode.getChildByName('finish').active = element.status == 3;
        }.bind(this));
    },

    onClickGift(event, custom) {
        if (event.target.tag == 'cooldown') {
            return;
        }
        event.target.tag = 'cooldown';
        this.scheduleOnce(function () { event.target.tag = null }, 0.5);
        var active_num = parseInt(custom);
        this.activeTask.forEach(task => {
            if (task.trigger_num == active_num) {
                if (task.status == 2) {
                    var pObj = new cc.pb.hall.hall_req_draw_task();
                    pObj.setTaskId(task.taskId);
                    cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_hall_req_draw_task, pObj,
                        '发送协议[id: ${hall_req_draw_task}],hall_req_draw_task', true);
                }
                else {
                    let str = '<color=#ffffff>日活跃度达到</c><color=#ffff00>' + task.trigger_num + '</c><color=#ffffff>点可领取，打开后可获得</c>';
                    let items = task.reward_item.split(';');
                    let firstAdd = true;
                    items.forEach(element => {
                        var data = element.split(',');
                        var item = item_cfg.getItem((x) => { return x.key == parseInt(data[0]) });
                        if (item) {
                            if (item.key == 1004 || item.key == 1099)
                                data[1] = parseInt(data[1]) / 100 + '元';
                            if (firstAdd) {
                                str += '<color=#ffffff>' + item.memo + '</c><color=#ffff00>' + data[1] + '</c>';
                                firstAdd = false;
                            }
                            else {
                                str += '<color=#ffffff>、' + item.memo + '</c><color=#ffff00>' + data[1] + '</c>';
                                firstAdd = false;
                            }
                        }
                    })
                    cc.find('tips/bg/text', this.node).getComponent(cc.RichText).string = str;
                    let bgNode = cc.find('tips/bg', this.node);
                    let targetLeftTopPosition = event.target.convertToWorldSpace(cc.v2(0, event.target.height));
                    let curRightTopPos = bgNode.convertToWorldSpace(cc.v2(bgNode.width, bgNode.height));
                    cc.log(targetLeftTopPosition);
                    cc.log(curRightTopPos);
                    bgNode.x = bgNode.x + (targetLeftTopPosition.x - curRightTopPos.x);
                    bgNode.y = bgNode.y + (targetLeftTopPosition.y - curRightTopPos.y);
                    cc.find('tips', this.node).active = true;
                }
            }
        })
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
            case HallCommonEvent.HALL_UPDATE_ASSETS:
                this.updateGold();
                break;
            default:
                break;
        }
    },

    /**
     * 进行中按钮事件
     */
    onEventJinxinzhong: function (event, data) {
        switch (AppConfig.GAME_PID) {
            case 2: //快乐吧麻将
            case 3: //快乐吧农安麻将
            case 4:  //快乐吧填大坑
            case 5:  //快乐吧牛牛
                return;
        }
        var taskId = event.target.parent.tag;
        var taskitem = player_task.getItem((item) => { return item.key == taskId; });
        if (!taskitem) return;
        var path = taskitem.transition;
        if (path.indexOf("type:") != -1) { //跳转金币场
            var start = path.indexOf(":");
            var gametype = parseInt(path.substr(start + 1, path.length));
            var UpdateMgr = require("updaterMgr").UpdateMgr.Instance();
            if (!UpdateMgr.isGameInstalled(gametype)) {
                let game_list = require("klb_gameList");
                let game_cfg = game_list.getItem(function (cfg) {
                    return cfg.gameid == gametype;
                });
                if (game_cfg) {
                    cc.dd.DialogBoxUtil.show(0, "请先在大厅安装游戏:" + game_cfg.name, 'text33', null, function () {
                        cc.dd.SceneManager.enterHall();
                    }, null);
                    return;
                }
            }

            var protoNewRoomList = new cc.pb.hall.hall_req_new_room_list();
            protoNewRoomList.setHallGameid(gametype);
            cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_hall_req_new_room_list, protoNewRoomList,
                '发送协议[id: ${cmd_hall_req_new_room_list}],cmd_hall_req_new_room_list,[房间列表]', true);
            cc.dd.NetWaitUtil.show('正在请求数据');

        } else if (path == 'majiangheji') { //麻将合集
            var hall = this.getHall();
            if (hall) {
                var heji = hall.getComponentInChildren('game_group_closed');
                if (heji.data.name == '麻将合集') {
                    if(cc._isNewHall === true){
                        var newhall= cc.find('Canvas').getComponentInChildren('klb_hall_db');
                        if(newhall){
                            newhall.onClickJibi();
                        }
                    }
                    heji.onClick();
                }
            }
        } else if (path == 'C_ROOM') { //约局
            var hall = this.getHall();
            if (hall)
                hall.roomBtnCallBack(event, 'C_ROOM');
        } else {
            switch (path) {
                case hall_prefab.KLB_HALL_SHARE:
                    cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_SHARE, function (ui) {
                        var share_ui = ui.getComponent('klb_hall_share');
                        if (share_ui != null) {
                            let shareItem = cc.dd.Utils.getRandomShare();
                            if (!cc.dd._.isNull(shareItem)) {
                                var title = shareItem.title;
                                var content = shareItem.content;
                                share_ui.setShareData(title, content);
                                share_ui.setFirstShare();
                            }

                        }
                    }.bind(this));
                    break;
                case hall_prefab.KLB_Match:
                    cc.dd.UIMgr.openUI(hall_prefab.KLB_Match, function (node) {
                        node.getComponent('klb_hall_Match').sendGetMatch(1);
                    }.bind(this));
                    break;
                case hall_prefab.KLB_SHOP_LAYER:
                    cc.dd.UIMgr.openUI(hall_prefab.KLB_SHOP_LAYER, function (ui) {
                        ui.getComponent('klb_hall_ShopLayer').gotoPage('FK');
                    }.bind(this));
                    break;
                case hall_prefab.KLB_HALL_BAG:
                    cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_BAG, function (ui) {
                        //ui.getComponent('klb_hall_BagUI').updateBagUI();
                    }.bind(this));
                    break;
            }
        }
        this.node.removeFromParent();
        this.node.destroy();
    },

    getHall: function () {
        var hallRoom = cc.dd.UIMgr.getUI(hall_prefab.KLB_HALL_ROOM);
        if (hallRoom) {
            hallRoom.removeFromParent();
            var room = hallRoom.getComponent('klb_hall_Room');
            if (room)
                room.onDestroy();
            //hallRoom.onDestroy();
            if(!cc._useChifengUI || cc.game_pid == 10006){
                cc.director.getScene().getChildByName('Canvas').getComponent('klb_hallScene').updateActiveTip();
            }
        }
        for (var i = 0; i < this.node.parent.parent.children.length; ++i) {
            var itme = this.node.parent.parent.children[i];
            if (itme) {
                var hall = itme.getComponent(AppConfig.HALL_NAME);
                if (hall)
                    return hall;
            }
        }
    },

    /**
     * 福利按钮点击事件
     */
    onClickFuli: function () {
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_ZHUSHU, function (ui) {
            ui.getComponent('klb_hall_ShareUI').setData(this.num);
        }.bind(this));
    },

    /**
     * 隐藏福利按钮
     */
    hideFuliBtn: function (bl) {
        if (this.fuliBtn)
            this.fuliBtn.active = bl;
    },
});
