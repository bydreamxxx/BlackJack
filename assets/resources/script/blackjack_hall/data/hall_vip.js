

var hallData = require('hall_common_data').HallCommonData.getInstance();
var TaskED = require('hall_task').TaskED;

const data_vip = require('vip');

var TaskEvent = require('hall_task').TaskEvent;
var s_task = null;
var VipData = cc.Class({

    statics: {
        Instance: function () {
            if (s_task == null) {
                s_task = new VipData();
            }
            return s_task;
        },

        Destroy: function () {
            if (s_task) {
                s_task = null;
            }
        },
    },

    ctor: function () {
        // this.task_list = [];
        this.maxExp = 0;
        this.maxDrawNum = 0;

        this.vipdata = data_vip.getItemList(function (element) {
            return element.key > 0;
        }.bind(this))

        this.maxLevel = this.vipdata[this.vipdata.length - 1].key;
    },

    /////////////////
    updateUserVipData:function(msg)
    {
        hallData.vipLevel = msg.curLevel
        hallData.vipExp = msg.curExp
        
    },
    //每一位代表每一个vip是否购买过
    onGetVipGiftInfo:function(msg)
    {
        // this.m_buyList = msg.buyList
        this.m_buyList = [];
        for(let i = 0; i < msg.drawListList.length; i++){
            let info = msg.drawListList[i]
            this.m_buyList[info.vipLevel] = info.vipDrawIndexListList;
        }
        TaskED.notifyEvent(TaskEvent.VIP_GET_GIFT_INFO, null);
    },
    //购买了哪一个
    updateVipGiftInfo:function(msg)
    {

        // this.m_buyList = (this.m_buyList|(1<<(msg.level - 1)))

        // if(hallData.vipLevel == this.maxLevel && msg.level == hallData.vipLevel) {
            this.maxDrawNum--;
            if(this.maxDrawNum < 0){
                this.maxDrawNum = 0;
            }

            cc.dd.RewardWndUtil.show([{ id: 1001, num: 19000000 }]);
        // }else{
        //     if (!this.m_buyList[msg.level]) {
        //         this.m_buyList[msg.level] = [];
        //     }
        //     this.m_buyList[msg.level].push(msg.index);
        //
        //     let vip = data_vip.getItem(function (element) {
        //         return element.key == msg.level+1;
        //     }.bind(this))
        //     if(vip){
        //         let items = vip.items.split(';');
        //         if(items[msg.index]){
        //             let reward = items[msg.index].split(',');
        //             cc.dd.RewardWndUtil.show([{ id: parseInt(reward[1]), num: parseInt(reward[2]) }]);
        //         }
        //     }
        // }
        var msg = new cc.pb.rank.msg_vip_open();
        cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_msg_vip_open, msg, 'msg_vip_open', true);
        // TaskED.notifyEvent(TaskEvent.VIP_GET_GIFT_INFO, null);
    },

    /**
     * 更新所有可领取的奖励为已领取
     */
    updateVipGiftAll(){
        this.m_buyList = [];

        for(let i = 0; i < this.vipdata.length; i++){
            let vip = this.vipdata[i];

            this.m_buyList[vip.key-1] = [];

            let items = vip.items.split(';');
            for(let j = 0; j < items.length; j++){
                if(hallData.vipLevel < vip.key - 1){
                    this.m_buyList[vip.key-1].push(j);
                }else if(hallData.vipLevel == vip.key - 1){
                    let exp = parseInt(items[j].split(',')[0]);
                    if(hallData.vipExp > exp){
                        this.m_buyList[vip.key-1].push(j);
                    }
                }else if(hallData.vipLevel == this.maxLevel){//满级
                    this.m_buyList[vip.key-1].push(j);
                }
            }
        }



        if(hallData.vipLevel == this.maxLevel){
            this.maxDrawNum = 0;
        }
        TaskED.notifyEvent(TaskEvent.VIP_GET_GIFT_INFO, null);
    },

    /**
     * 遗留接口
     * @param lvl
     * @returns {number}
     */
    isBuyVipGift:function(lvl)
    {
        return (this.m_buyList&(1<<(lvl - 1)) == 1)
    },

    /**
     * 返回该奖励是否已领取
     * @param vip
     * @param level
     * @returns {boolean}
     */
    getVIPReciveInfo(vip, level){
        if(this.m_buyList[vip]){
            return this.m_buyList[vip].indexOf(level) != -1;
        }else{
            return false;
        }
    },

    /**
     * 返回没有奖励的最大VIP等级以及有没有奖励没有领取
     * @returns {*[]}
     */
    hasRewardNotRecive(){
        let noresultVip = 0;

        // for(let i = 0; i < this.vipdata.length; i++){
        //     let vip = this.vipdata[i];
        //     if(vip.key-1 > hallData.vipLevel){
        //         break;
        //     }
        //
        //     if(vip.items == "" || vip.items == "0"){
        //         noresultVip = vip.key-1;
        //         continue;
        //     }
        //
        //     let items = vip.items.split(';');
        //     for(let j = 0; j < items.length; j++){
        //         if(this.m_buyList[vip.key-1]){
        //             if(vip.key-1 < hallData.vipLevel && vip.key-1 > noresultVip){
        //                 if(this.m_buyList[vip.key-1].indexOf(j) == -1){
        //                     return [noresultVip, true];
        //                 }
        //             }else if(vip.key-1 == hallData.vipLevel){
        //                 let exp = parseInt(items[j].split(',')[0]);
        //                 if(hallData.vipExp >= exp){
        //                     if(this.m_buyList[vip.key-1].indexOf(j) == -1){
        //                         return [noresultVip, true];
        //                     }
        //                 }else{
        //                     break;
        //                 }
        //             }else{
        //                 break;
        //             }
        //         }else{
        //             if(vip.key-1 < hallData.vipLevel){
        //                 return [noresultVip, true];
        //             }else if(vip.key-1 == hallData.vipLevel){
        //                 let exp = parseInt(items[j].split(',')[0]);
        //                 if(hallData.vipExp >= exp){
        //                     return [noresultVip, true];
        //                 }else{
        //                     break;
        //                 }
        //             }
        //         }
        //     }
        // }

        return [noresultVip, this.hasLastRewardNotRecive()];
    },

    updateMaxVipGiftInfo(msg){
        this.maxExp = msg.curExp;
        this.maxDrawNum = msg.drawNum;
        TaskED.notifyEvent(TaskEvent.VIP_GET_GIFT_INFO, null);
    },

    hasLastRewardNotRecive(){
        return this.maxDrawNum > 0;//hallData.vipLevel == this.maxLevel && this.maxDrawNum > 0;
    }
});

module.exports = {
    VipData:VipData,
    // TaskED:TaskED,
    // TaskEvent:TaskEvent,
};
