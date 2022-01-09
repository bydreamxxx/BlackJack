// 转轮赛转轮

cc.Class({
    extends: cc.Component,

    properties: {
        numList: [require('klb_hall_drawlottery_runnumber')],
        numItem: cc.Node,
        numContext: cc.Node,
        bgNode: cc.Node,
        itemWidth: 30,
        spaceX: 5
    },

    // 设置转轮范围
    setRange(min, max) {
        this.min = min;
        this.max = max;
        let wheelCount = max.toString().length>4?max.toString().length:4
        this.setWheelCount(wheelCount)
    },
    // 设置转轮数量
    setWheelCount(num){
        // cc.dd.ResLoader.loadPrefab("gameyj_texas/prefab/texas_wheel_num", function (prefab) {
            
        // }.bind(this));
        this.numList = []
        this.bgNode.removeAllChildren()
        for (let i = 0; i < num; i++) {
            let item = cc.instantiate(this.numItem);
            item.active=true
            let num = item.getComponent('klb_hall_drawlottery_runnumber')
            this.numList.push(num);
            item.parent = this.bgNode;
            item.y = 0;
            let x = i * (this.itemWidth +  this.spaceX);
            item.x = x;
        }

        this.bgNode.width =(num+1)*(this.itemWidth +  this.spaceX)
    },
    //开始滚动数字
    onRunCode(code, callback) {
        this.node.active = true;
        this.luckyScore = code;
        this.endCallBack = callback;
        this.runEndNum = 0;
        // this.spine.setAnimation(0, 'a_2', false);
        for (let i = 0; i < this.numList.length; i++) {
            this.numList[i].setRunEndCall(this.checkRunEnd.bind(this));
            this.numList[i].startRun();
        };
        AudioManager.playSound('blackjack_hall/audios/drawlotteryrun', false);
        this.numList[this.numList.length - 1].setRunEndNum(this.luckyScore[this.luckyScore.length - 1]);
    },

    //单次滚动结束
    checkRunEnd() {
        this.runEndNum++;
        AudioManager.playSound('blackjack_hall/audios/drawlotteryend', false);
        if (this.runEndNum < this.numList.length) {
            this.numList[this.numList.length - this.runEndNum - 1].setRunEndNum(this.luckyScore[this.luckyScore.length - this.runEndNum - 1]);
        }
        if (this.runEndNum == this.numList.length) {
            if(this.runEndNum-1 >= this.luckyScore.length) {
                this.numList[this.numList.length - this.runEndNum].showEndSprite(true)
            }
            this.runEndNum = 0;
            this.endCallBack && this.endCallBack();
            var self = this;
            this.scheduleOnce(function () {
                self.node.active = false;
            }, 2);
        }
        if(this.runEndNum-1 >= this.luckyScore.length) {
            this.numList[this.numList.length - this.runEndNum].showEndSprite(true)
        }
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {},

    // update (dt) {},
});
