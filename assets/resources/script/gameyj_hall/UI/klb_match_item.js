let states = ["等待中", "立即报名", "进行中", "已完成", "已作废", "延迟中", "中途加入", '已报名'];

cc.Class({
    extends: cc.Component,

    properties: {
        matchName: cc.Label,//标题
        roleCount: cc.Label,//人数
        isCheck: cc.Node,
        isFinished: cc.Node,
        hb_weixuanzhe_di: cc.Node,
        isFinishedSprite: cc.Sprite,//报名底
        finishedSpriteList: [cc.SpriteFrame],
        isFinishedLabel: cc.Label,//报名状态
        desc: cc.Label,//描述
        rewardLbl: cc.Label,//奖励描述
        enter: cc.Label,//开赛限制
        reward: cc.Sprite,
        timeDesc: cc.Label,//开赛时间

        bhongbaodi: cc.SpriteFrame,
        bsiphonex: cc.SpriteFrame,
        bsyuanbao: cc.SpriteFrame,
        bsjiangbei: cc.SpriteFrame,
    },

    setData(data, checkFunc, finishFunc, func) {
        this.matchName.string = data.name;
        this.roleCount.string = data.joinNum;
        if (data.matchClass == 3 || data.matchClass == 2) {
            this.isCheck.active = false;
            this.isFinished.active = true;
            if (data.matchState == 1 && data.isSign) {
                this.isFinishedLabel.string = states[7];
                this.isFinishedSprite.spriteFrame = this.finishedSpriteList[7];
            }
            else {
                this.isFinishedLabel.string = states[data.matchState];
                this.isFinishedSprite.spriteFrame = this.finishedSpriteList[data.matchState];
            }
        }
        else {
            this.isCheck.active = data.isSign;
        }
        this.desc.string = data.describe;

        // cc.find('desc', this.node).getComponent(cc.Label).string = '(' + data.openSignNum + '人开赛)';
        var icon = data.icon.replace('-', '');
        // var reward = cc.find('reward', this.node);
        this.reward.spriteFrame = this[icon];

        if (data.rewardListList && data.rewardListList[0] && data.rewardListList[0].rewardListList && data.rewardListList[0].rewardListList[0]) {
            if(icon == 'bhongbaodi'){
                if(data.rewardListList[0].rewardListList[0].num >= 100){
                    this.rewardLbl.string = parseInt(data.rewardListList[0].rewardListList[0].num / 100).toString().replace(/0/g, ':') + ';';
                }else{
                    this.rewardLbl.string = '';
                }
            }else{
                this.rewardLbl.string = data.rewardListList[0].rewardListList[0].num.toString().replace(/0/g, ':');
            }
        }else
            this.rewardLbl.string = '';

        if (data.signFee > 0) {
            this.enter.string = data.signFee.toString() + '金币入';
            this.enter.node.active = true;
        }

        if (data.subType == 1) {   //微信红包
            this.rewardLbl.node.active = true;
            this.timeDesc.string = data.opentime.replace(':00', '');
            //cc.find('reward/wx_name', this.node).active = true;
        } else if (data.subType == 2) { //实物
            this.rewardLbl.node.active = false;
            this.timeDesc.string = data.opentime.replace(':00', '') + '开赛';
            //cc.find('reward/wx_name', this.node).active = false;
        }
        else if (data.subType == 3) {
            this.rewardLbl.node.active = false;
            this.timeDesc.string = data.opentime.replace(':00', '') + '开赛';
        }

        this.isCheck.tagname = data.matchId;
        this.isCheck.gameType = data.gameType;
        this.isFinished.tagname = data.matchId;
        this.isFinished.gameType = data.gameType;
        this.hb_weixuanzhe_di.tagname = data;
        this.hb_weixuanzhe_di.gameType = data.gameType;

        this.isCheck.on('click', checkFunc);
        this.isFinished.on('click', finishFunc);
        this.hb_weixuanzhe_di.on('click', func);
    },

    updateCheck(active) {
        this.isCheck.active = active;
    },

    updateRoleCount(joinNum) {
        this.roleCount.string = joinNum;
    },

    updateFinishLabel(finish) {
        this.isFinishedLabel.getComponent(cc.Label).string = states[finish];
        this.isFinishedSprite.spriteFrame = this.finishedSpriteList[finish];
    }
});
