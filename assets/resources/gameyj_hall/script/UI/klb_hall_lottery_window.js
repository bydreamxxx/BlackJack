var hall_audio_mgr = require('hall_audio_mgr');
var Platform = require("Platform");
const AppCfg = require('AppConfig');
var hall_prefab = require('hall_prefab_cfg');
const data_reward = require('reward')
const data_item = require('item')

var Task = require('hall_task').Task;
var TaskED = require('hall_task').TaskED;
var TaskEvent = require('hall_task').TaskEvent;
const hall_prop_data = require('hall_prop_data').HallPropData.getInstance();

var Lottery_Type = cc.Enum(
    {
        Card: 0,//奖券抽奖
        Gold: 1,//道具抽奖
    });

cc.Class({
    extends: cc.Component,

    properties: {
        lottery_type: 0,
        sub_type: 0,
        atlasItem: {
            default: null,
            type: cc.SpriteAtlas,
        },
        isOver: false,
    },

    update: function (dt) {
        if (this.aniPlaying) {
            var rotateArror = this.m_arrow_new.rotation % 360;
            this.m_tail.rotation = 40 * Math.floor((rotateArror + 20) / 40);
        }
    },

    onLoad: function () {
        TaskED.addObserver(this);
        this.m_subType = 0;

        this.m_flashLight = cc.find("panelRotation/flash", this.node);
        this.m_tail = cc.find("panelRotation/rewardList/tail", this.node);
        this.m_arrow = cc.find("panelRotation/arrow", this.node);
        this.m_arrow_new = cc.find("panelRotation/arrow_new", this.node);
        this.m_tips = cc.find("tips", this.node).getComponent(cc.RichText);
        this.m_arrowAnimation = this.m_arrow.getComponent(cc.Animation)
        this.m_tailAnimation = this.m_tail.getComponent(cc.Animation)
        this.m_arrowAnimation.on('finished', this.onAnimationFinished, this);
        this.m_glListView = cc.find("detailScroll", this.node).getComponent("com_glistView");
        this.rewardData = data_reward.getItemList(function (element) {
            if (element.type - 1 == this.lottery_type)
                return true;
            else
                return false;
        }.bind(this))

        if (this.lottery_type == Lottery_Type.Card) {
            this.cardSum = cc.find("bar2/sum", this.node).getComponent(cc.Label);
        } else {
            this.goldSum = cc.find("bar2/gold", this.node).getComponent(cc.Label);
            this.phoneSum = cc.find("bar2/phone", this.node).getComponent(cc.Label);
            this.feeSum = cc.find("bar2/fee", this.node).getComponent(cc.Label);
            this.m_toggle = [];

            for (var i = 0; i < 3; i++) {
                this.m_toggle[i] = cc.find("bottomGroup/toggle" + (i + 1), this.node);
                this.m_toggle[i].tagname = i;
                this.m_toggle[i].on('toggle', this.setCurSubType, this);
            }
        }



        this.resetState();

        this.m_rewardList = [];
        this.m_rewardSumList = [];
        for (var i = 0; i < 9; i++) {
            this.m_rewardList[i] = cc.find("panelRotation/rewardList/item" + i, this.node).getComponent(cc.Sprite);
            this.m_rewardSumList[i] = cc.find("num", this.m_rewardList[i].node).getComponent(cc.Label);
            var data = this.rewardData[i]
            var strs = data.reward.split(",");
            var sum = strs[1];
            if (parseInt(strs[0]) == 1004 || parseInt(strs[0]) == 1006) {
                sum = parseInt(strs[1]) / 100 + "元"
            }
            var itemData = data_item.getItem(function (element) {
                if (element.key == parseInt(strs[0]))
                    return true;
                else
                    return false;
            }.bind(this));
            this.m_rewardList[i].spriteFrame = this.atlasItem.getSpriteFrame(strs[0]);
            this.m_rewardSumList[i].string = "X" + sum;

            var count_num = strs[1];
            if (parseInt(strs[0]) == 1004 || parseInt(strs[0]) == 1006) {
                count_num = parseInt(strs[1]) / 100 + "元"
            }
            var name = itemData.memo + ' x' + count_num;
            var gailv = data.desc;
            cc.find("gailv_detail/scroll/view/content/item" + i + '/item', this.node).getComponent(cc.Label).string = name;
            cc.find("gailv_detail/scroll/view/content/item" + i + '/gailv', this.node).getComponent(cc.Label).string = gailv;
        }
        this.setCount();
        this.updateItem();
    },

    start() {
        this.updateRewardHistory();
    },

    updateItem: function () {
        if (this.lottery_type == Lottery_Type.Card) {
            var feeData = hall_prop_data.getItemInfoByDataId(1014);
            if (feeData) this.cardSum.string = "x" + feeData.count
        } else {
            //gold
            var goldData = hall_prop_data.getItemInfoByDataId(1005);
            var phoneData = hall_prop_data.getItemInfoByDataId(1006);
            var feeData = hall_prop_data.getItemInfoByDataId(1004);
            if (goldData) this.goldSum.string = "x" + goldData.count
            if (phoneData) this.phoneSum.string = "x" + phoneData.count / 100 + "元"
            if (feeData) this.feeSum.string = "x" + feeData.count / 100 + "元"
        }
    },

    setCurSubType: function (event) {
        var toggle = event.detail;
        this.m_subType = parseInt(toggle.node.tagname);
    },

    resetState: function () {
        this.m_tail.active = false;
        this.m_flashLight.active = false;
        //this.m_arrow.rotation = 0;
    },

    onDestroy: function () {
        TaskED.removeObserver(this);
        clearTimeout(this.m_timeOutId);
        clearTimeout(this.m_buttonTimeOutId);

        this.lottery_type = 0;
        this.m_arrowAnimation.off('finished', this.onAnimationFinished, this);
    },

    onClickClose: function () {
        hall_audio_mgr.Instance().com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    test: function () {
        this.m_resultIndex = Math.floor(Math.random() * 9)
    },

    onAnimationFinished: function () {
        cc.log("anifinished");
        // this.test();
        // this.m_arrow.rotation = 0;
        cc.log("this.m_resultIndex", this.m_resultIndex);
        var rotate = cc.rotateBy(1, 360 + this.m_resultIndex * 40);
        var delay = cc.delayTime(0.5)
        var callFunc = cc.callFunc(function (sender) {
            this.m_tail.active = false;
            this.m_flashLight.rotation = this.m_resultIndex * 40
            this.m_flashLight.active = true;
            this.m_flashLight.getComponent(cc.Animation).play();
            this.m_arrow.getComponent(cc.Button).interactable = true;
            clearTimeout(this.m_buttonTimeOutId);
            if (this.isOver) {
                cc.dd.UIMgr.openUI("gameyj_hall/prefabs/klb_hall_daily_lottery_get_award", function (prefab) {
                    var cp = prefab.getComponent('klb_hall_daily_lottery_get_award');
                    var arwad = this.rewardData[this.m_resultIndex].reward;
                    var list = arwad.split(',');
                    cp.setData(list[0], list[1]);
                }.bind(this))
                this.updateRewardHistory();
            }

        }.bind(this))

        var seq = cc.sequence(rotate.easing(cc.easeSineOut(1)), callFunc)
        this.m_arrow_new.runAction(seq);
        this.m_tail.runAction(cc.rotateBy(1, 360 + this.m_resultIndex * 40).easing(cc.easeSineOut(1)));
    },

    onClickStart: function () {
        this.resetState();
        var msg = new cc.pb.rank.msg_luck_draw_2s();
        msg.setMainType(this.lottery_type + 1);
        msg.setSubType(this.m_subType + 1);
        cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_msg_luck_draw_2s, msg, 'msg_luck_draw_2s', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onClickStart');

        this.m_arrow.getComponent(cc.Button).interactable = false;
        this.m_buttonTimeOutId = setTimeout(function () {
            this.m_arrow.getComponent(cc.Button).interactable = true;
        }.bind(this), 7000);
    },

    getIndexByID: function (configID) {
        for (var i = 0; i < 9; i++) {
            if (this.rewardData[i].key == configID)
                return i
        }

        return -1;
    },

    setRewardResult: function (configID, mainType, subType) {
        if (this.lottery_type == mainType - 1) {
            if (mainType - 1 == Lottery_Type.Card) {
                var num = parseInt(this.cardSum.string.substr(1));
                this.cardSum.string = "x" + (num - 1);
            }
            else {
                if (subType == 1) {//88元宝
                    var num = parseInt(this.goldSum.string.substr(1));
                    this.goldSum.string = "x" + (num - 88);
                }
                else if (subType == 2) {//1元话费
                    var num = Math.round(parseFloat(this.phoneSum.string.substr(1)) * 100);
                    this.phoneSum.string = "x" + (num - 100) / 100 + '元';
                }
                else {//一元红包
                    var num = Math.round(parseFloat(this.feeSum.string.substr(1)) * 100);
                    this.feeSum.string = "x" + (num - 100) / 100 + '元';
                }
            }
        }
        this.m_resultIndex = this.getIndexByID(configID);
        // this.m_arrowAnimation.play();
        // this.m_tailAnimation.play();
        AudioManager.playSound("gameyj_hall/audios/lottery");
        this.aniPlaying = true;
        var angel = this.m_arrow_new.rotation % 360;
        var rotate = cc.rotateBy(6, 360 * 8 + this.m_resultIndex * 40 - angel);
        var callFunc = cc.callFunc(function (sender) {
            this.aniPlaying = false;
            this.m_tail.active = false;
            this.m_flashLight.rotation = this.m_resultIndex * 40
            this.m_flashLight.active = true;
            this.m_flashLight.getComponent(cc.Animation).play();
            this.m_arrow.getComponent(cc.Button).interactable = true;
            clearTimeout(this.m_buttonTimeOutId);
            if (this.isOver) {
                cc.dd.UIMgr.openUI("gameyj_hall/prefabs/klb_hall_daily_lottery_get_award", function (prefab) {
                    var cp = prefab.getComponent('klb_hall_daily_lottery_get_award');
                    var arwad = this.rewardData[this.m_resultIndex].reward;
                    var list = arwad.split(',');
                    cp.setData(list[0], list[1]);
                }.bind(this))
                this.updateRewardHistory();
            }
            this.updateItem();
        }.bind(this))
        var seq = cc.sequence(rotate.easing(cc.easeQuinticActionOut()), callFunc)
        this.m_arrow_new.runAction(seq);
        //this.m_tail.runAction(cc.rotateBy(4, 3600 + this.m_resultIndex * 40).easing(cc.easeCubicActionInOut()));

        this.m_timeOutId = setTimeout(function () {
            this.m_tail.active = true;
        }.bind(this), 1);
    },

    setCount: function () {
        this.m_tips.string = "<color=#ffffff>每</c><color=#B45E00>100</c><color=#ffffff>次必中</color><color=#B45E00>3000</c><color=#ffffff>元宝，已累计</color><color=#B45E00>" + Task.Instance().m_lotteryCnt + "</c><color=#ffffff>次</c>";
    },


    updateRewardHistory: function () {
        var data = Task.Instance().getLotteryHistoryByType(this.lottery_type);
        if (data.length <= 0) return;

        this.m_glListView.setDataProvider(data, 0, function (itemNode, index) {
            if (index < 0 || index >= data.length)
                return;

            var name = cc.find("name", itemNode).getComponent(cc.Label);
            var id = cc.find("id", itemNode).getComponent(cc.Label);
            var time = cc.find("time", itemNode).getComponent(cc.Label);
            var rewardName = cc.find("textsmall", itemNode).getComponent(cc.Label);
            var head = cc.find("headNode/headSp", itemNode).getComponent(cc.Sprite);

            var idx = data.length - index - 1;
            var newDate = new Date();

            name.string = cc.dd.Utils.substr(data[idx].playername, 0, 7);
            id.string = "ID:" + data[idx].playerid
            newDate.setTime(data[idx].time * 1000);
            time.string = newDate.format('yy-MM-dd\nhh:mm');

            var rewardData = data_reward.getItem(function (element) {
                if (element.key == data[idx].id)
                    return true;
                else
                    return false;
            }.bind(this));
            var strs = rewardData.reward.split(",");
            var itemData = data_item.getItem(function (element) {
                if (element.key == parseInt(strs[0]))
                    return true;
                else
                    return false;
            }.bind(this));

            var sum = strs[1];
            if (parseInt(strs[0]) == 1004 || parseInt(strs[0]) == 1006) {
                sum = parseInt(strs[1]) / 100 + "元"
            }
            rewardName.string = itemData.memo + "X" + sum
            if (data[idx].headurl != "") {
                var tinyUrl = data[idx].headurl.substring(0, data[idx].headurl.lastIndexOf('/') + 1) + "64";
                cc.dd.SysTools.loadWxheadH5(head, tinyUrl);
            }

        }.bind(this));
        this.isOver = false;
    },

    showDetail(event, data) {
        cc.find('gailv_detail', this.node).active = true;
    },

    closeDetail(event, data) {
        cc.find('gailv_detail', this.node).active = false;
    },

    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage: function (event, data) {
        switch (event) {
            case TaskEvent.LOTTERY_RWARD:
                this.setRewardResult(data[0], data[2], data[3]);
                this.setCount();
                //this.updateItem();  改到动画结束之后刷新
                break;
            case TaskEvent.LOTTERY_UPDATE_HISTORY:
                if (!data) {
                    this.isOver = true;
                }
                else if (data && data[0]) {
                    if (data[0] == cc.dd.user.id) {
                        this.isOver = true;
                    }
                    else {
                        this.scheduleOnce(this.updateRewardHistory.bind(this), 6);
                    }
                }
                break;
            case TaskEvent.LOTTERY_UPDATE_COUNT:
                this.setCount();
                break;
            case TaskEvent.LOTTERY_ERROR:
                clearTimeout(this.m_buttonTimeOutId);
                this.m_arrow.getComponent(cc.Button).interactable = true;
                break;
            default:
                break;
        }
    },

});
