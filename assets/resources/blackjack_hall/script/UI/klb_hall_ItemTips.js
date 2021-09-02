var hall_prefab = require('hall_prefab_cfg');
const Hall = require('jlmj_halldata');
const HallCommonData = require('hall_common_data').HallCommonData.getInstance();

cc.Class({
    extends: cc.Component,

    properties: {
        nameTxt: cc.Label,
        itemIcon: cc.Sprite,
        itemCount: cc.Label,
        countDesc: cc.Label,
        desc1: cc.Label,
        desc2: cc.Label,
        itemInfo: null,
        data: null,
        button: { default: [], type: cc.Node, tooltip: "操作按钮" },
        timeSp: cc.Node,
        timeLable: cc.Label,
    },

    // use this for initialization
    onLoad: function () {
        Hall.HallED.addObserver(this);
    },

    onDestroy: function () {
        Hall.HallED.removeObserver(this);
    },

    initUI: function (itemInfo, data) {
        this.nameTxt.string = itemInfo.memo;
        var count = data.count;
        var str = '';
        if (itemInfo.key == 1004 || itemInfo.key == 1006 || itemInfo.key == 1099) {
            count = (count / 100).toFixed(1);
            str = '拥有                元';
        } else if (itemInfo.key == 1003) {
            str = '拥有                张';
        } else {
            str = '拥有                个';
        }
        this.itemCount.string = count;
        this.countDesc.string = str;
        this.desc1.string = itemInfo.text1;
        this.desc2.string = itemInfo.text2;

        if (data.leftTime != -1) {
            this.timeSp.active = true;
            var date = new Date();
            var leftTime = (data.leftTime - Math.floor(date.getTime() / 1000));
            var day = parseInt(parseInt(parseInt(leftTime / 60) / 60) / 24);
            var str = '';
            if (day > 0)
                str = day + '天';
            else {
                var second = parseInt(leftTime % 60);
                if (second > 0)
                    str = second + '秒';
                var min = parseInt(leftTime / 60);
                if (min < 60)
                    str = min + '分' + str;
                else {
                    var hour = parseInt(parseInt(parseInt(leftTime / 60) / 60));
                    min = parseInt(parseInt(parseInt(leftTime / 60) % 60));
                    str = hour + '小时' + min + '分' + str;
                }


            }
            this.timeLable.node.active = true;
            this.timeLable.string = '剩余时间:' + str;
        }

        cc.dd.ResLoader.loadAtlas("gameyj_hall/atals/itemIcon", function (atlas) {
            var sprite = atlas.getSpriteFrame(itemInfo.key);
            this.itemIcon.spriteFrame = sprite;
        }.bind(this));


        for (var i = 0; i < 3; i++) {
            this.button[i].active = false;
        }

        var button_tpye = itemInfo.button.split(';');
        if (button_tpye.length == 1) {
            this.button[0].active = true;
            this.setButtonInfo(this.button[0], button_tpye[0]);
        } else if (button_tpye.length == 2) {
            this.button[1].active = true;
            this.setButtonInfo(this.button[1], button_tpye[0]);
            this.button[2].active = true;
            this.setButtonInfo(this.button[2], button_tpye[1]);
        }

        this.itemInfo = itemInfo;
        this.data = data;

    },
    close: function () {
        cc.dd.UIMgr.destroyUI(this.node);
    },
    //设置按钮的响应消息
    setButtonInfo: function (node, type) {
        var callBack = null;
        // var labelCpt = cc.dd.Utils.seekNodeByName(this.node, 'New Label');
        var labelCpt = node.getChildByName('New Label').getComponent(cc.Label);
        switch (parseInt(type)) {
            case 1:
                callBack = this.onExchangeGoldInShop;
                labelCpt.string = '兑换';
                break;
            case 2:
                callBack = this.onLottery;
                labelCpt.string = '抽奖';
                break;
            case 3:
                callBack = this.onExchangePropInShop;
                labelCpt.string = '兑换房间卡';
                break;
            case 4:
                callBack = this.onExchangeBill;
                labelCpt.string = '兑换话费';
                break;
            case 5:
                callBack = this.onExchangeCash;
                labelCpt.string = '领取到微信';
                break;
            case 6:
                callBack = this.onExchangeGold;
                labelCpt.string = '兑换金币';
                break;
            case 7://活动兑换
                callBack = this.onActiveExchange;
                labelCpt.string = '参与活动';
                break;
            case 8:
                callBack = this.onExchangeQuickCash;
                labelCpt.string = '领取到微信';
                break;
            case 9:
                callBack = this.onSendMail;
                labelCpt.string = '发送邮件';
                break;
            case 10:
                callBack = this.onJdExchange;
                labelCpt.string = '兑换京东卡';
                break;
            default:
                node.active = false;
                break;
        }
        node.on(cc.Node.EventType.TOUCH_START, callBack, this);
    },
    //打开商城金币界面
    onExchangeGoldInShop: function () {
        this.close();
        if (!cc._is_shop)
            return;
        cc.dd.UIMgr.openUI(hall_prefab.KLB_SHOP_LAYER, function (ui) {
            var type = "ZS";
            ui.getComponent('klb_hall_ShopLayer').gotoPage(type);
        }.bind(this));
    },
    //打开抽奖界面
    onLottery: function () {
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_DAILY_LOTTERY_GOLD, function (node) {
            TaskED.notifyEvent(TaskEvent.LOTTERY_UPDATE_HISTORY, null);
        }.bind(this));
    },
    //兑换道具
    onExchangePropInShop: function () {
        this.close();
        if (!cc._is_shop)
            return;
        cc.dd.UIMgr.openUI(hall_prefab.KLB_SHOP_LAYER, function (ui) {
            var type = "FK";
            ui.getComponent('klb_hall_ShopLayer').gotoPage(type);
        }.bind(this));
    },
    //兑换话费
    onExchangeBill: function () {
        cc.dd.PromptBoxUtil.show('暂未开放，敬请期待');
    },

    onExchangeGold: function (event, data) {
        var count = this.data.count / 100;
        if (count < 10) {
            cc.dd.PromptBoxUtil.show('红包券不足10元，请获取更多红包券');
            return;
        }
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_EXCHANGE_GOLD, function (prefab) {
            var component = prefab.getComponent('klb_hall_ExchangeGold');
            component.initUI(this.itemInfo, this.data);
            this.close();
        }.bind(this));

        //this.close();
    },

    onExchangeCash: function (event, data) {
        cc.dd.PromptBoxUtil.show('兑换系统维护，暂时无法兑换');
        return;
        if (HallCommonData.idNum == '') {
            cc.dd.PromptBoxUtil.show('请先完善实名认证信息再进行兑换');
            return;

        }
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_EXCHANGE_CASH, function (prefab) {
            var component = prefab.getComponent('klb_hall_ExchangeCash');
            component.setData(this.data, 25, 50);

            var msg = new cc.pb.hall.msg_get_bouns_num_req();
            msg.setOpType(1);
            cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_msg_get_bouns_num_req, msg, "msg_get_bouns_num_req", true);
            cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onExchangeCash');

            this.close();
        }.bind(this));

        //this.close();
    },


    onJdExchange(){
        if (HallCommonData.idNum == '') {
            cc.dd.PromptBoxUtil.show('请先完善实名认证信息再进行兑换');
            return;
        }
        cc.dd.UIMgr.openUI(hall_prefab.KLB_SHOP_LAYER, function (ui) {
            ui.getComponent('klb_hall_ShopLayer').gotoPage('JD');
        });
    },

    //及时兑换
    onExchangeQuickCash: function (event, data) {
        cc.dd.PromptBoxUtil.show('兑换系统维护，暂时无法兑换');
        return;
        if (HallCommonData.idNum == '') {
            cc.dd.PromptBoxUtil.show('请先完善实名认证信息再进行兑换');
            return;

        }
        if (this.data.count / 100 > 9) {
            var msg = new cc.pb.hall.msg_use_bag_item_req();
            msg.setUseType(3);
            msg.setItemDataId(this.data.dataId);
            msg.setNum(this.data.count);

            cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_msg_use_bag_item_req, msg, "cmd_msg_use_bag_item_req", true);
            cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'msg_use_bag_item_req');

        } else {
            cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_EXCHANGE_QUICK_CASH, function (prefab) {
                var component = prefab.getComponent('klb_hall_ExchangeCash');
                component.setQuickData(this.data);

                var msg = new cc.pb.hall.msg_get_bouns_num_req();
                msg.setOpType(3);
                cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_msg_get_bouns_num_req, msg, "msg_get_bouns_num_req", true);
                cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onExchangeCash');
                this.close();
            }.bind(this));
        }
    },
    onSendMail(event, data) {
        this.close();
        cc.dd.UIMgr.openUI('gameyj_hall/prefabs/klb_hall_mail_send', function (UI) {

        }.bind(this));
    },

    onActiveExchange: function (event, data) {
        cc.dd.UIMgr.openUI("gameyj_hall/prefabs/klb_hall_Active", function (prefab) {

        });
    },

    openCodeUI: function (data) {
        cc.dd.DialogBoxUtil.show(1, '请联系客服获取兑换码\n微信:xianglekefu001', '复制', null, function () {
            if (cc.sys.OS_ANDROID == cc.sys.os || cc.sys.OS_IOS == cc.sys.os) {
                cc.dd.native_systool.SetClipBoardContent('xianglekefu001');
                cc.dd.PromptBoxUtil.show("复制成功");
            }
        }, null);
        this.close();
    },

    onEventMessage: function (event, data) {
        switch (event) {
            case Hall.HallEvent.Use_Item_Ret:
                this.openCodeUI(data);
                break;
        }
    },
});
