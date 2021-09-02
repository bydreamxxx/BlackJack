//create by luke on 9/17/2020

cc.Class({
    extends: cc.Component,

    properties: {
        spine: sp.Skeleton,//拉杆动画
        nums: [require('klb_hall_drawlottery_runnumber')],
    },

    onLoad() {
        //TODO:  spine动画
        this.spine.setMix('a_2', 'a_1');
    },

    //开始滚动数字
    onRunCode(code, callback) {
        this.node.active = true;
        this.luckyScore = code;
        this.endCallBack = callback;
        this.runEndNum = 0;
        this.spine.setAnimation(0, 'a_2', false);
        for (let i = 0; i < this.nums.length; i++) {
            this.nums[i].setRunEndCall(this.checkRunEnd.bind(this));
            this.nums[i].startRun();
        };
        AudioManager.playSound('blackjack_hall/audios/drawlotteryrun', false);
        this.nums[this.nums.length - 1].setRunEndNum(this.luckyScore[this.luckyScore.length - 1]);
    },

    //单次滚动结束
    checkRunEnd() {
        this.runEndNum++;
        AudioManager.playSound('blackjack_hall/audios/drawlotteryend', false);
        if (this.runEndNum < this.nums.length) {
            this.nums[this.nums.length - this.runEndNum - 1].setRunEndNum(this.luckyScore[this.luckyScore.length - this.runEndNum - 1]);
        }
        if (this.runEndNum == this.nums.length) {
            this.runEndNum = 0;
            this.endCallBack && this.endCallBack();
            var self = this;
            this.scheduleOnce(function () {
                self.node.active = false;
            }, 2);
        }
    },
});
