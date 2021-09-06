cc.Class({
    extends: cc.Component,

    properties: {
        itemInfo: null,
        data: null,
    },

    // use this for initialization
    onLoad: function () {

    },

    initUI: function(itemInfo, data){
        this.itemInfo = itemInfo;
        this.data = data;
    },

    onExchange: function(event, data){
        if(this.data.count < 10){
            cc.dd.PromptBoxUtil.show('红包个数不足，无法进行兑换');
            return;
        }
        var msg = new cc.pb.hall.msg_use_bag_item_req();
        msg.setUseType(2);
        msg.setItemDataId(this.data.dataId);
        msg.setNum(1000);

        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_msg_use_bag_item_req,msg,"cmd_msg_use_bag_item_req", true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'msg_use_bag_item_req');
        this.close();
    },


    close: function(){
        cc.dd.UIMgr.destroyUI(this.node);
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
