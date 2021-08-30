var hall_audio_mgr = require('hall_audio_mgr');
var data_welfareBag = require('welfareBag');
const HallCommonData = require('hall_common_data').HallCommonData;
var data_exp = require('playerExp');
var HallTask = require('hall_task').Task;
var TaskED = require('hall_task').TaskED;
var TaskEvent = require('hall_task').TaskEvent;

cc.Class({
    extends: cc.Component,

    properties: {
        cur_lv: cc.Label,
        next_lv: cc.Label,
        exp_progress: cc.ProgressBar,
        progressLabel: cc.Label,
        descLabel: cc.Label,
        vip_item_list: [require('klb_hall_vipItem')],
        welfare_item_list: [require('klb_hall_welfareItem')],
    },

    onLoad: function () {
        TaskED.addObserver(this);
        this.initUI();
    },

    onDestroy: function () {
        TaskED.removeObserver(this);
    },

    initUI: function () {
        this.onClickVipItem('', 0);
        this.updateUI();

    },
    updateUI: function () {
        this.cur_lv.string = HallCommonData.getInstance().level;
        var nextLevel = HallCommonData.getInstance().level + 1;
        var exp_item = data_exp.getItem(function (item) {
            return item.key == HallCommonData.getInstance().level;
        })
        var next_exp_item = data_exp.getItem(function (item) {
            return item.key == nextLevel;
        })
        if (next_exp_item) {
            this.next_lv.string = nextLevel;
            this.progressLabel.string = HallCommonData.getInstance().exp + '/' + exp_item.exp;
            this.exp_progress.progress = (HallCommonData.getInstance().exp / exp_item.exp);
        } else {
            this.next_lv.string = HallCommonData.getInstance().level;
            this.progressLabel.string = '等级MAX';
            this.exp_progress.progress = 1;
        }
        this.initWelfareList();
    },
    onClickClose: function () {
        hall_audio_mgr.Instance().com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    onClickVipItem: function (event, data) {
        hall_audio_mgr.Instance().com_btn_click();
        this.descLabel.string = '荣誉Lv.' + (parseInt(data) + 1) + '奖励';

        for (var i = 0; i < this.vip_item_list.length; ++i) {
            if (i == parseInt(data)) {
                this.vip_item_list[i].select(i);
                this.updateWelfareList(i + 1);
            } else {
                this.vip_item_list[i].unSelect(i);
            }
        }
    },

    onClickTips(event, data) {
        hall_audio_mgr.Instance().com_btn_click();
        var config = require('playerHonor');
        var cfg = config.getItem(function (item) { return item.key == 1; });
        if (cfg) {
            var title = cfg.title;
            var des = cfg.des;
            cc.dd.DialogBoxUtil.show(0, des, '确定', null, null, null, title);
        }
    },

    updateWelfareList: function (idx) {
        var welfareList = [];
        var welfareList = data_welfareBag.getItemList(function (item) {
            return item.level == idx;
        });

        for (var i = 0; i < this.welfare_item_list.length; ++i) {
            if (i < welfareList.length) {
                if (welfareList[i].task_id == 48) {
                    var taskInfo = HallTask.Instance().getTask(welfareList[i].task_id);
                    if (taskInfo) {
                        this.welfare_item_list[i].node.active = true;
                        this.welfare_item_list[i].setData(welfareList[i]);
                    } else {
                        this.welfare_item_list[i].node.active = false;
                    }
                } else {
                    this.welfare_item_list[i].node.active = true;
                    this.welfare_item_list[i].setData(welfareList[i]);
                }

            } else {
                this.welfare_item_list[i].node.active = false;
            }
        }
    },

    initWelfareList: function () {
        for (var i = 0; i < this.vip_item_list.length; ++i) {
            if (i == (HallTask.Instance().task_level - 1)) {
                this.descLabel.string = '荣誉Lv.' + (i + 1) + '奖励';
                this.vip_item_list[i].select(i);
                this.updateWelfareList(i + 1);
            } else {
                if (i < (HallTask.Instance().task_level - 1)) {
                    this.vip_item_list[i].node.active = false;
                }
                this.vip_item_list[i].unSelect(i);
            }
        }
    },

    /**
 * 事件处理
 * @param event
 * @param data
 */
    onEventMessage: function (event, data) {
        switch (event) {
            case TaskEvent.TASK_TRIGGER:
                this.updateUI();
                break;
            case TaskEvent.TASK_UPDATEUI:
                this.updateUI();
                break;
            // case TaskEvent.TASK_FINISH:
            //     this.updateUI();
            //     break;
            default:
                break;
        }
    }

});
