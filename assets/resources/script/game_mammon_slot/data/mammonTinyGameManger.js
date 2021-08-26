// create by wj 2018/12/19
var gSlotMgr = require('SlotManger').SlotManger.Instance();

var mammonTinyGameManger =  cc.Class({

    mammonTinyGameManger: function(){
        this.m_nLeftNum = 0; //剩余次数
        this.m_nRewardNum = 0; //奖励值

        this.m_tOpenBoxList = []; //已经开启宝箱列表
    },

    //保存剩余次数
    setLeftNum: function(nLeftNum){
        this.m_nLeftNum = nLeftNum;
        gSlotMgr.setSmallGameTimes(nLeftNum);
    },
    //获取剩余次数
    getLeftNum: function(){
        return this.m_nLeftNum;
    },

    //设置奖励倍率
    setRateNum: function(nRateNum){
        this.m_nRewardNum = nRateNum;
    },

    //获取奖励倍率
    getRateNum: function(){
        return this.m_nRewardNum;
    },

    //保存开箱子数据
    setOpenBoxInfo: function(boxInfo){
        this.m_tOpenBoxList.push(boxInfo);
    },
    
    //获取打开箱子数据
    getOpenBoxInfo: function(){
        return this.m_tOpenBoxList;
    },

    //清除开箱子数据
    clearBoxList: function(){
        this.m_tOpenBoxList.splice(0, this.m_tOpenBoxList.length);
    },

    //设置押注数据
    setBetNum: function(num){
        this.m_nBetNum = num;
    },

    //获取押注
    getBetNum: function(){
        return this.m_nBetNum;
    },

    //保存奖励
    setRewardNum: function(nRewardNum){
        this.m_nRewardNum += nRewardNum;
    },

    //获取奖励
    getRewardNum: function(){
        return this.m_nRewardNum;
    },

    //重置奖励数据
    resetReardNum: function(){
        this.m_nRewardNum = 0;
    },

    resetAllData: function(){
        this.clearBoxList();
        this.resetReardNum();
    },


    /////////////////////////////////协议通讯///////////////////////////////////////////////
    on_msg_slot_mammon_open_box_2c: function(msg){//开启宝箱返回
        this.setLeftNum(msg.leftTimes);
        this.setRateNum(msg.totalRate);
        this.setOpenBoxInfo(msg.box);
        var ui = cc.dd.UIMgr.getUI('gameyj_mammon_slot/Prefab/mammon_slot_tiny_game_ui');
        if(ui){
            var cpt = ui.getComponent('mammon_slot_tiny_game');
            cpt.showOpenBoxAction(msg.box);
            //cpt.updateUIInfo();
        }

    },

    on_msg_slot_mammon_reconnet_2c: function(msg){//断线重连
        this.clearBoxList();
        this.setRateNum(msg.totalRate);
        this.m_tOpenBoxList = msg.openBoxsList;

        var ui = cc.dd.UIMgr.getUI('gameyj_mammon_slot/Prefab/mammon_slot_tiny_game_ui');
        if(ui){
            var cpt = ui.getComponent('mammon_slot_tiny_game');
            // this.m_tOpenBoxList.forEach(function(boxInfo) {
            //     cpt.updateOpenBox(boxInfo);
            // });
            cpt.updateUIInfo();
        }
    },
});

module.exports = {
    mammonTinyGameManger : mammonTinyGameManger
};
