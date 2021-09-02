//create by wj 2018/05/28
const HallCommonData = require('hall_common_data').HallCommonData.getInstance();
var Hall = require('jlmj_halldata');
const itemconfig = require('item');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var hall_prefab = require('hall_prefab_cfg');

cc.Class({
    extends: cc.Component,

    properties: {
        awardNode: { default: [], type: cc.Node, tooltip: "奖励父节点" },
        bindButton: cc.Button,
        activeTime: cc.Label,
        atlas: cc.SpriteAtlas,
        selectDayData: null,
        index: 0,
        rewardShowing: false,
    },

    onLoad: function () {
        Hall.HallED.addObserver(this);
        //检查是否绑定手机
        if (HallCommonData.telNum != '')
            this.bindButton.interactable = false;
        else
            this.bindButton.interactable = true;
        this.initUI();
    },

    onDestroy: function () {
        Hall.HallED.removeObserver(this);
    },

    /**
     * 初始化界面信息
     */
    initUI: function () {
        const sevenDayData = Hall.HallData.Instance().getSevenDayActivityData();
        if (sevenDayData == null)
            return;
        //活动时间
        this.activeTime.string = this.convertTimeDay(sevenDayData.beginTime) + '-' + this.convertTimeDay(sevenDayData.endTime);
        //活动奖励
        for (var i = 0; i < sevenDayData.happysList.length; i++) {
            var data = sevenDayData.happysList[i];
            var node = this.awardNode[data.index - 1];
            //设置奖励icon
            for (var k = 0; k < data.itemsList.length; k++) {
                var itemData = data.itemsList[k];
                var itemNode = node.getChildByName('item' + (k + 1));
                if (itemNode) {
                    cc.find('icon', itemNode).getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame(itemData.itemDataId);
                    var item = itemconfig.getItem(function (tabledata) {
                        if (tabledata.key == itemData.itemDataId)
                            return tabledata;
                    });
                    if (item) {
                        if (itemData.itemDataId == 1004 || itemData.itemDataId == 1006)
                            cc.find('count', itemNode).getComponent(cc.Label).string = item.memo + '*' + (itemData.num / 100);
                        else
                            cc.find('count', itemNode).getComponent(cc.Label).string = item.memo + '*' + itemData.num;

                    }
                    if (data.state == 2)
                        cc.find('awadTag', itemNode).active = true;
                }
            }
            cc.find('getBtn', node).active = false;
            cc.find('awardBtn', node).active = false;
            cc.find('waitBtn', node).active = false;
            //已领取
            if (data.state == 2) {
                cc.find('getBtn', node).active = true;
            } else if (data.state == 1) {//可领取
                cc.find('awardBtn', node).active = true;
            } else if (data.state = 3) {//待领取
                cc.find('waitBtn', node).active = true;
            }
        }
    },

    /**
     * 领取按钮
     */
    onClickGetAward: function (event, data) {
        hall_audio_mgr.com_btn_click();
        if (HallCommonData.telNum == '') {
            var self = this;
            cc.dd.DialogBoxUtil.show(0, '绑定手机后，领取七天乐奖励', '前往绑定', '取消', function () {
                self.onClickOpenBindUI(null, null);
            }, null);
            return
        }

        if (parseInt(data) == 0) {
            cc.dd.PromptBoxUtil.show('还未到领取时间，不可领取该奖励');
            return;
        }
        var msg = new cc.pb.rank.msg_get_seven_happy_req();
        msg.setIndex(parseInt(data));
        cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_msg_get_seven_happy_req, msg, 'msg_get_seven_happy_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onClickGetAward');
    },
    //绑定手机
    onClickOpenBindUI: function (event, data) {
        hall_audio_mgr.com_btn_click();
        // cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_USERINFO, function (ui) {
        //     ui.getComponent('klb_hall_UserInfo').openBindPhoneUI(2);
        //     cc.dd.UIMgr.destroyUI(this.node);
        // }.bind(this));
        cc.dd.UIMgr.openUI(hall_prefab.BIND_PHONE);
        cc.dd.UIMgr.destroyUI(this.node);
    },

    //设置奖励领取数据
    propItem: function (index) {
        this.selectDayData = Hall.HallData.Instance().getDataByDay(index);
        if (this.selectDayData) {
            this.index = 0;
        }
    },

    //显示领取奖励的界面
    showAward: function (data) {
        this.rewardShowing = true;
        this.scheduleOnce(function () {
            cc.dd.UIMgr.openUI("blackjack_hall/prefabs/klb_hall_daily_lottery_get_award", function (prefab) {
                var cp = prefab.getComponent('klb_hall_daily_lottery_get_award');
                cp.setData(data.itemDataId, data.num);
                this.rewardShowing = false;
            }.bind(this));
        }.bind(this), 0.5);
    },

    update: function (dt) {
        if (!this.rewardShowing && this.selectDayData && this.index < this.selectDayData.itemsList.length &&
            !cc.dd.UIMgr.getUI('blackjack_hall/prefabs/klb_hall_daily_lottery_get_award')) {
            var data = this.selectDayData.itemsList[this.index];
            this.index++;
            this.showAward(data);
            if (this.index == this.selectDayData.itemsList.length)
                this.selectDayData = null;
        }
    },

    //关闭
    close: function (event, data) {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    onEventMessage: function (event, data) {
        switch (event) {
            case Hall.HallEvent.ACTIVE_SEVEN_DAY_AWARD:
                this.initUI();
                this.propItem(data.index);
                break;
            default:
                break;
        }
    },


    /**
     * 转换时间
     */
    convertTimeDay: function (t) {
        var date = new Date(t * 1000);
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }

        var currentdate = date.getFullYear() + '年' + month + '月' + strDate + '日';
        return currentdate;
    },
});
