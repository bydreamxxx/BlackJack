
module.exports = {

    /**
     * 抢红包
     */
    SendrobHB: function () {
        const req = new cc.pb.hb.msg_hb_get_req();
        cc.gateNet.Instance().sendMsg(cc.netCmd.hb.cmd_msg_hb_get_req, req,
            'msg_hb_get_req', 'no');
    },

    /**
     * 拉取埋雷信息
     */

    sendMineInfo : function(){
        const req = new cc.pb.hb.msg_hb_list_req();
        cc.gateNet.Instance().sendMsg(cc.netCmd.hb.cmd_msg_hb_list_req, req,
            'msg_hb_list_req', 'no');
    },

    /**
     * 申请埋雷
     * @param money 基础金额
     * @param rate 倍数
     * @param num 埋雷黑号数
     */
    sendMine : function(money,rate,num){
        const req = new cc.pb.hb.msg_hb_set_req();
        req.setMoney(money);
        req.setRate(rate);
        req.setNum(num);
        cc.gateNet.Instance().sendMsg(cc.netCmd.hb.cmd_msg_hb_set_req, req,
            'msg_hb_set_req', 'no');
    },

    /**
     * 准备 
     */
    sendEnter : function(){
        const req = new cc.pb.hb.msg_hb_enter_req();
        cc.gateNet.Instance().sendMsg(cc.netCmd.hb.cmd_msg_hb_enter_req, req,
            'msg_hb_enter_req', 'no');
    },

    /**
     * 取消埋雷
     */
    sendquxiao : function(id){
        const req = new cc.pb.hb.msg_hb_cancel_req();
        req.setId(id);
        cc.gateNet.Instance().sendMsg(cc.netCmd.hb.cmd_msg_hb_cancel_req, req,
            'msg_hb_cancel_req', 'no');
    },
};