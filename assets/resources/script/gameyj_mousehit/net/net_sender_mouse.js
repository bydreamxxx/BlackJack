module.exports = {
    /**
    * 锤子锤
    * @param {Number} hammerId 锤子Id
    * @param {Number}  holeId  洞的Id 
    */
    useHammerReq(hammerId, holeId) {
        const req = new cc.pb.mouse.msg_use_hammer_req();
        req.setHammerId(hammerId);
        req.setHoleId(holeId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.mouse.cmd_msg_use_hammer_req, req,
            'cmd_msg_use_hammer_req【锤子锤】', 'no');
    },
    //选择请求服务器时间
    choiceRedReq(index){
        const req = new cc.pb.mouse.msg_choose_redbag_req();
        req.setIndex(index); 
        cc.gateNet.Instance().sendMsg(cc.netCmd.mouse.cmd_msg_choose_redbag_req, req,
            'cmd_msg_choose_redbag_req【获取服务器时间】', 'no');
    },
    //记录
    mouseRecordReq(index){
        const req = new cc.pb.mouse.msg_mouse_record_req();
        req.setIndex(index);
        cc.gateNet.Instance().sendMsg(cc.netCmd.mouse.cmd_msg_mouse_record_req, req,
            'cmd_msg_mouse_record_req【记录】', 'no');
    },
    //任务
    taskReq(op,id){
        const req = new cc.pb.mouse.msg_mouse_task_req();
        req.setOp(op);
        req.setId(id);
        cc.gateNet.Instance().sendMsg(cc.netCmd.mouse.cmd_msg_mouse_task_req, req,
            'cmd_msg_mouse_task_req【任务】', 'no');
    },
    

}