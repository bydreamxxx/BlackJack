// create by wj 2018/05/10
const shopConfig = require('shop');
var shopEd = require('hall_shop').shopED;
var shopEvent = require('hall_shop').shopEvent;
var hall_shop = require('hall_shop').shopData.Instance();
var item_config = require('item');

cc.Class({
    extends: cc.Component,

    properties: {
        contentNode: cc.Node,
        recordPrefab: cc.Prefab,
    },

    onLoad: function () {
        shopEd.addObserver(this);
    },

    onDestroy: function () {
        shopEd.removeObserver(this);
    },

    initList: function (data) {
        this.contentNode.removeAllChildren(true);
        for (var i = 0; i < data.length; ++i) {
            var itemData = data[i];
            if (itemData) {
                var item = cc.instantiate(this.recordPrefab);
                item.parent = this.contentNode;

                var shopData = shopConfig.getItem(function (item) {
                    return item.key == itemData.itemid;
                })

                var serverData = null;
                if (shopData.type == 6)
                    serverData = hall_shop.getActiveItemDataById(itemData.itemid);
                else
                    serverData = hall_shop.getYuanBaoItemDataById(itemData.itemid);

                //时间
                cc.find('bg/day', item).getComponent(cc.Label).string = this.convertTimeDay(itemData.time);
                //具体时间
                cc.find('bg/time', item).getComponent(cc.Label).string = this.convertTimeDate(itemData.time);
                //订单
                cc.find('bg/ticketId', item).getComponent(cc.Label).string = itemData.orderNum;
                //名字
                cc.find('bg/name', item).getComponent(cc.Label).string = shopData.dec;
                //消耗
                if (shopData.type != 6) {
                    var costData = item_config.getItem(function (itemdata) {
                        return itemdata.key == serverData.costItemid;
                    });
                    var costName = costData ? costData.memo : '元宝';
                    cc.find('bg/cost', item).getComponent(cc.RichText).string = '<color=#574c46>（</c><color=#e28055>' + (serverData.costDiscount > 0 ? serverData.costDiscount : serverData.costItemCount) + costName + '</c><color=#574c46>）</color>';
                }
                else{
                    cc.find('bg/cost', item).getComponent(cc.RichText).string = '<color=#574c46>（</c><color=#e28055>' + (serverData.costDiscount > 0 ? serverData.costDiscount : serverData.costItemCount) + '玫瑰</c><color=#574c46>）</color>';
                }
                //状态
                var str = '';
                var color = null;
                switch (itemData.status) {
                    case 1:
                        str = '审核中';
                        color = cc.color(181, 175, 175);
                        break;
                    case 2:
                        str = '已完成';
                        color = cc.color(43, 159, 40);
                        break;
                    case 3:
                        str = '拒绝';
                        color = cc.color(204, 0, 0);
                        break;
                }
                var state = cc.find('bg/state', item);
                state.color = color;
                state.getComponent(cc.Label).string = str;
            }
        }

    },

    /**
 * 转换时间
 */
    convertTimeDay: function (t) {
        var date = new Date(t * 1000);
        var seperator1 = ".";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }

        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
        return currentdate;
    },

    /**
     * 转化时间小时分
     */
    convertTimeDate: function (t) {
        var date = new Date(t * 1000);
        var seperator2 = ":";
        var hours = date.getHours();
        var min = date.getMinutes();
        if (hours >= 0 && hours <= 9) {
            hours = "0" + hours;
        }
        if (min >= 0 && min <= 9) {
            min = "0" + min;
        }

        var currentdate = hours + seperator2 + min;
        return currentdate;
    },

    /**
 * 事件处理
 * @param event
 * @param data
 */
    onEventMessage: function (event, data) {
        switch (event) {
            case shopEvent.SHOP_EXCHANGE_RECORD:
                this.initList(data.listList);
                break;
            default:
                break;
        }
    },

    onClose() {
        this.node.active = false;
    },
});
