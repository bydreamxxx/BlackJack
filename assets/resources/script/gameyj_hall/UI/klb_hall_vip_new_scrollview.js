var hallData = require('hall_common_data').HallCommonData.getInstance();
var HallVip = require('hall_vip').VipData.Instance();
const data_item = require('item');
var TaskED = require('hall_task').TaskED;
var TaskEvent = require('hall_task').TaskEvent;

cc.Class({
    extends: cc.Component,

    properties: {
        prefabItem:{
            default: null,
            type: cc.Node,
            tooltip: "成员组件"
        },
        content_node: cc.Node,
        scrollView: cc.ScrollView,
    },

    onLoad(){
        this.updateTimer = 0;
        this.updateInterval = 0.2;
        this.lastContentPosX = 0;

        this.startX = 177.5;
        this.startY = 0;
        this.spaceX = 117;
        this.spaceY = 0;
        this.spawnCount = 6;//显示几个
        this.col = 1;//每列几个
        this.item_width = this.prefabItem.width;
        this.bufferZone = this.scrollView.node.width / 2 + this.item_width / 2 * 3
        this.vipItemList = [];

        TaskED.addObserver(this);
    },

    onDestroy: function () {
        TaskED.removeObserver(this);
    },

    updateUI(list, viplevel, atlasIcon){
        this.vipItemList = list;
        this.atlasIcon = atlasIcon;

        // this.content_node.removeAllChildren();
        let j = 0;
        let k = 0;

        let tableNum = this.vipItemList.length;
        if(tableNum > this.spawnCount){
            tableNum = this.spawnCount;
        }

        let count = Math.ceil(this.vipItemList.length / this.col)
        this.content_node.width = this.startX + this.item_width * count + this.spaceX * count;

        //滚动到下一级奖励
        let showIdx = -1;//领到哪一级了
        for(let i = 0; i < this.vipItemList.length; i++){
            if(viplevel == hallData.vipLevel && hallData.vipExp < parseInt(this.vipItemList[i][0])){
                showIdx = i;
                break;
            }
        }
        if(showIdx >= 4){
            let percent = (this.startX + this.item_width + (this.item_width + this.spaceX) *  Math.floor((showIdx-2) / this.col)) / this.scrollView.getMaxScrollOffset().x;
            if(showIdx > this.vipItemList.length - 3){
                percent = 1
            }
            this.scrollView.scrollToPercentHorizontal(percent);
        }

        //根据位置（起点、终点）调整初始化奖励的位置
        if(showIdx+tableNum >= this.vipItemList.length){
            showIdx -= tableNum;
        }else if(showIdx < 4){
            showIdx = 0;
        }else{
            showIdx -= 3;
        }

        //修正负数
        if(showIdx < 0){
            showIdx = 0;
        }

        for (let i = showIdx; i < tableNum+showIdx; i++) {
            j = Math.floor(i / this.col);
            k = i % this.col;
            var item = cc.instantiate(this.prefabItem);
            item.active = true;
            item.index = i;
            item.viplevel = viplevel;
            item.tagname = 'rewardItem';

            this.initItem(item, this.vipItemList[i]);

            this.content_node.addChild(item);

            item.y = 26.2;
            item.x = this.startX + this.item_width / 2 + (this.item_width + this.spaceX) * j;
        }


    },

    // // 返回item在ScrollView空间的坐标值
    getPositionInView: function (item) {
        let worldPos = item.parent.convertToWorldSpaceAR(item.position);
        let viewPos = this.scrollView.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    },

    // // 每帧调用一次。根据滚动位置动态更新item的坐标和显示(所以spawnCount可以比totalCount少很多)
    update: function(dt) {
        this.updateTimer += dt;
        if (this.updateTimer < this.updateInterval) {
            return; // we don't need to do the math every frame
        }
        this.updateTimer = 0;
        let items = this.content_node.children.filter((item)=>{
            return item.tagname == 'rewardItem';
        });
        // 如果当前content的y坐标小于上次记录值，则代表往下滚动，否则往上。
        let isRight = this.scrollView.content.x > this.lastContentPosX;
        // 实际创建项占了多高（即它们的高度累加）
        let count = Math.ceil(items.length / this.col);
        let offset = this.item_width * count + this.spaceX * count;
        let newX = 0;

        // 遍历数组，更新item的位置和显示
        for (let i = 0; i < items.length; ++i) {
            let viewPos = this.getPositionInView(items[i]);
            if (isRight) {
                // 提前计算出该item的新的y坐标
                newX = items[i].x - offset;
                // 如果往下滚动时item已经超出缓冲矩形，且newY未超出content上边界，
                // 则更新item的坐标（即上移了一个offset的位置），同时更新item的显示内容
                if (viewPos.x > this.bufferZone && newX > 9) {
                    items[i].x = newX;
                    let itemId = items[i].index - items.length; // update item id
                    // this.updateItem(items[i], itemId);
                    items[i].index = itemId;
                    this.initItem(items[i], this.vipItemList[itemId]);
                }
            } else {
                // 提前计算出该item的新的y坐标
                newX = items[i].x + offset;
                // 如果往上滚动时item已经超出缓冲矩形，且newY未超出content下边界，
                // 则更新item的坐标（即下移了一个offset的位置），同时更新item的显示内容
                if (viewPos.x < -this.bufferZone && newX < this.content_node.width) {
                    items[i].x = newX;
                    // let item = items[i].getComponent('Item');
                    let itemId = items[i].index + items.length;
                    // this.updateItem(items[i], itemId);
                    items[i].index = itemId;
                    this.initItem(items[i], this.vipItemList[itemId]);
                }
            }
        }

        // 更新lastContentPosX和总项数显示
        this.lastContentPosX = this.scrollView.content.x;
    },

    /**
     * 设置奖励物品
     * @param item
     * @param data
     */
    initItem(item, data){
        let needExp = item.getChildByName('needExp').getComponent(cc.Label);
        needExp.string = data[0];

        item.needExp = parseInt(data[0]);

        let reward = cc.find('jiangli_di/reward', item).getComponent(cc.Label);
        reward.string = cc.dd.Utils.getNumToWordTransform(parseInt(data[2]));

        let coin = data_item.getItem(function (itemdata) {
            return itemdata.key == parseInt(data[1]);
        });

        let icon = cc.find('jiangli_di/icon', item).getComponent(cc.Sprite);
        icon.spriteFrame = this.atlasIcon.getSpriteFrame(coin.icon.replace("d1", "d6"));

        let progress = item.getChildByName('slider03');
        if(hallData.vipLevel > item.viplevel){
            progress.active = true
        }else if(hallData.vipLevel < item.viplevel){
            progress.active = false;
        }else{
            progress.active = hallData.vipExp >= item.needExp;
        }

        let state = HallVip.getVIPReciveInfo(item.viplevel, item.index);
        this.updateItemState(item, state);
    },

    /**
     * 更新奖励物品状态
     * @param item
     * @param state
     */
    updateItemState(item, state){
        let canRecive = cc.find('jiangli_di/frame_selected', item);
        let hasRewarded = cc.find('jiangli_di/heidi', item);
        if(hallData.vipLevel > item.viplevel){
            canRecive.active = !state;
            item.canRecive = !state;
            hasRewarded.active = state;
        }else if(hallData.vipLevel < item.viplevel){
            canRecive.active = false;
            item.canRecive = false;

            hasRewarded.active = false;
        }else{
            canRecive.active = hallData.vipExp >= item.needExp && !state;
            item.canRecive = hallData.vipExp >= item.needExp && !state;
            hasRewarded.active = state;
        }
    },

    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage:function (event,data) {
        switch (event){
            case TaskEvent.VIP_GET_GIFT_INFO:
                let items = this.content_node.children.filter((item)=>{
                    return item.tagname == 'rewardItem';
                });
                for (let i = 0; i < items.length; ++i) {
                    let state = HallVip.getVIPReciveInfo(items[i].viplevel, items[i].index);
                    this.updateItemState(items[i], state);
                }
                break;
            default:
                break;
        }
    },
});
