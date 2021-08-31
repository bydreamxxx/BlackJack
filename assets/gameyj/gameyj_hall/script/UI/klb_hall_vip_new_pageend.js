var hallData = require('hall_common_data').HallCommonData.getInstance();
var HallVip = require('hall_vip').VipData.Instance();
const data_item = require('item');
var TaskED = require('hall_task').TaskED;
var TaskEvent = require('hall_task').TaskEvent;

cc.Class({
    extends: cc.Component,

    properties: {
        progress: cc.ProgressBar,
        rewardItem: cc.Node,
        leftNum: cc.Label,
    },

    onLoad(){
        TaskED.addObserver(this);
    },

    onDestroy: function () {
        TaskED.removeObserver(this);
    },

    updateUI(itemData, atlasIcon, level){
        this.vipItemList = itemData;
        this.atlasIcon = atlasIcon;

        this.progress.progress = HallVip.maxExp / parseInt(itemData[0]);

        let leftNum = HallVip.maxDrawNum;
        this.leftNum.string = leftNum.toString();
        this.leftNum.node.active = HallVip.hasLastRewardNotRecive();

        this.initItem(this.rewardItem, this.vipItemList, level);
    },


    /**
     * 设置奖励物品
     * @param item
     * @param data
     */
    initItem(item, data, level){
        let needExp = item.getChildByName('needExp').getComponent(cc.Label);
        needExp.string = `${HallVip.maxExp}/${data[0]}`;

        item.needExp = parseInt(data[0]);
        item.index = 0;
        item.viplevel = level;

        let reward = cc.find('jiangli_di/reward', item).getComponent(cc.Label);
        reward.string = cc.dd.Utils.getNumToWordTransform(parseInt(data[2]));

        let coin = data_item.getItem(function (itemdata) {
            return itemdata.key == parseInt(data[1]);
        });

        let icon = cc.find('jiangli_di/icon', item).getComponent(cc.Sprite);
        icon.spriteFrame = this.atlasIcon.getSpriteFrame(coin.icon.replace("d1", "d6"));

        this.updateItemState(item,  HallVip.hasLastRewardNotRecive());
    },

    /**
     * 更新奖励物品状态
     * @param item
     * @param state
     */
    updateItemState(item, state){
        let canRecive = cc.find('jiangli_di/frame_selected', item);
        canRecive.active = state;
        item.canRecive = state;
    },

    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage:function (event,data) {
        switch (event){
            case TaskEvent.VIP_GET_GIFT_INFO:
                let leftNum = HallVip.maxDrawNum;
                this.leftNum.string = leftNum.toString();
                this.leftNum.node.active = HallVip.hasLastRewardNotRecive();
                this.progress.progress = HallVip.maxExp / parseInt(this.vipItemList[0]);
                let needExp = this.rewardItem.getChildByName('needExp').getComponent(cc.Label);
                needExp.string = `${HallVip.maxExp}/${this.vipItemList[0]}`;
                this.updateItemState(this.rewardItem,  HallVip.hasLastRewardNotRecive());
                break;
            default:
                break;
        }
    },
});
