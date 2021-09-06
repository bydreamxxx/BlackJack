//create by luke on 9/17/2020

cc.Class({
    extends: cc.Component,

    properties: {
        spine: sp.Skeleton,//拉杆动画
        nums: [require('klb_hall_drawlottery_runnumber')],
        btnlbl: cc.Label,   //领取按钮 文字
        titleNode: cc.Node, //第几名界面
        slotNode: cc.Node,  //抽奖机界面 
        titleSp: cc.Sprite,//等待界面  sprite
        titlesplist: [cc.SpriteFrame], //1 2 3名等待界面  展示图片
        titleLblSp: cc.Sprite,     //第几名
        remainLbl: cc.Label,    //剩余几个名额
    },

    onLoad() {
        this.spine.setMix('a_2', 'a_1');
        //TODO:  spine动画
    },

    //开始滚动数字
    onRunResult(msg, mycode) {
        this.codes1st = msg.rankCodeList1List;
        this.codes2nd = msg.rankCodeList2List;
        this.codes3rd = msg.rankCodeList3List;
        this.mycode = mycode;//我的兑奖码
        this.mylevel = 0;//我的中奖级别
        if (this.mycode) {
            for (var i = 0; i < this.codes1st.length; i++) {
                if (this.codes1st[i] == this.mycode) {
                    this.mylevel = 1;//一等奖
                    break;
                }
            }
            if (!this.mylevel) {
                for (var i = 0; i < this.codes2nd.length; i++) {
                    if (this.codes2nd[i] == this.mycode) {
                        this.mylevel = 2;//二等奖
                        break;
                    }
                }
            }
            if (!this.mylevel) {
                for (var i = 0; i < this.codes3rd.length; i++) {
                    if (this.codes3rd[i] == this.mycode) {
                        this.mylevel = 3;//三等奖
                        break;
                    }
                }
            }
        }
        this.node.active = true;
        this.show3rd();
    },

    //显示一等奖
    show1st() {
        var self = this;
        if (this.codes1st.length) {
            this.titleSp.spriteFrame = this.titlesplist[0];//显示第一名
            this.titleNode.active = true;
            this.slotNode.active = false;
            this.titleLblSp.spriteFrame = this.titlesplist[0];
            this.scheduleOnce(function () {
                self.titleNode.active = false;
                self.slotNode.active = true;
                self.showCodeList(self.codes1st, self.endCall.bind(self));
            }, 2);
        }
        else {
            this.endCall();
        }
    },

    //显示二等奖
    show2nd() {
        var self = this;
        if (this.codes2nd.length) {
            this.titleSp.spriteFrame = this.titlesplist[1];//显示第二名
            this.titleNode.active = true;
            this.slotNode.active = false;
            this.titleLblSp.spriteFrame = this.titlesplist[1];
            this.scheduleOnce(function () {
                self.titleNode.active = false;
                self.slotNode.active = true;
                self.showCodeList(self.codes2nd, self.show1st.bind(self));
            }, 2);
        }
        else {
            this.show1st();
        }
    },

    //显示三等奖
    show3rd() {
        var self = this;
        if (this.codes3rd.length) {
            this.titleSp.spriteFrame = this.titlesplist[2];//显示第三名
            this.titleNode.active = true;
            this.slotNode.active = false;
            this.titleLblSp.spriteFrame = this.titlesplist[2];
            this.scheduleOnce(function () {
                self.titleNode.active = false;
                self.slotNode.active = true;
                self.showCodeList(self.codes3rd, self.show2nd.bind(self));
            }, 2);
        }
        else {
            this.show2nd();
        }
    },

    //显示一系列
    showCodeList(list, callback) {
        var self = this;
        this.newlist = [];
        list.forEach(element => {
            self.newlist.push(element);
        });
        this.showListCb = callback;
        this.runList();
    },
    runList() {
        this.remainLbl.string = '剩余' + this.newlist.length + '名';
        if (this.newlist.length == 0) {
            this.showListCb && this.showListCb();//继续开下一个等级 或结束开奖
            return;
        }
        var code = this.newlist.splice(0, 1)[0];
        this.onRunCode(code, this.runList.bind(this));
    },
    //开始滚动数字
    onRunCode(code, callback) {
        this.luckyScore = code;
        this.endCallBack = callback;
        this.runEndNum = 0;
        this.spine.setAnimation(0, 'a_2', false);//拉杆
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
        if (this.runEndNum == this.nums.length) {//单次开奖结束
            this.runEndNum = 0;
            this.remainLbl.string = '剩余' + this.newlist.length + '名';
            if (this.luckyScore == this.mycode) {
                switch (this.mylevel) {
                    case 1:
                        this.btnlbl.string = '恭喜:一等奖';
                        break;
                    case 2:
                        this.btnlbl.string = '恭喜:二等奖';
                        break;
                    case 3:
                        this.btnlbl.string = '恭喜:三等奖';
                        break;
                }
            }
            var self = this;
            this.scheduleOnce(function () {
                self.endCallBack && self.endCallBack();//继续下次开奖  this.runList.bind(this)
            }, 2);
        }
    },

    //点击关闭
    onClose() {
        if (this.mylevel == 0) {
            if (this.mycode)
                this.btnlbl.string = '未中奖，再接再厉';
            else
                this.btnlbl.string = '已开奖，明日领取';
        }
        else {
            switch (this.mylevel) {
                case 1:
                    this.btnlbl.string = '恭喜:一等奖';
                    break;
                case 2:
                    this.btnlbl.string = '恭喜:二等奖';
                    break;
                case 3:
                    this.btnlbl.string = '恭喜:三等奖';
                    break;
            }
        }
        this.node.active = false;
        var pbObj = new cc.pb.slot.msg_day_cash_activity_reward_history_req();
        cc.gateNet.Instance().sendMsg(cc.netCmd.slot.cmd_msg_day_cash_activity_reward_history_req, pbObj, 'msg_day_cash_activity_reward_history_req', true);
    },

    //所有奖开完
    endCall() {
        var self = this;
        if (this.mylevel == 0) {
            if (this.mycode)
                this.btnlbl.string = '未中奖，再接再厉';
            else
                this.btnlbl.string = '已开奖，明日领取';
        }
        this.scheduleOnce(function () {
            self.node.active = false;
            var pbObj = new cc.pb.slot.msg_day_cash_activity_reward_history_req();
            cc.gateNet.Instance().sendMsg(cc.netCmd.slot.cmd_msg_day_cash_activity_reward_history_req, pbObj, 'msg_day_cash_activity_reward_history_req', true);
        }, 2);
    },
});
