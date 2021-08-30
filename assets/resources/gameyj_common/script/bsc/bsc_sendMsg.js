/**
 * Created by Mac_Li on 2017/10/25.
 */
const Bsc = require('bsc_data');

const sendMsg = {
    /**
     * 获取活动列表 根据类型
     */
    getActByType: function (type) {
        var s = Bsc.BSC_Data.Instance();
        var actdata = Bsc.BSC_Data.Instance().getActListBytype(type);

        if (actdata) {
            Bsc.BSC_ED.notifyEvent(Bsc.BSC_Event.BSC_FLUSH_INFO, [actdata]);
        } else {
            // cc.dd.NetWaitUtil.show('正在获取比赛场..');
            const req = new cc.pb.bisai.msg_match_list_req();
            req.setMatchType(type);
            cc.gateNet.Instance().sendMsg(cc.netCmd.bisai.cmd_msg_match_list_req, req,
                'cmd_msg_match_list_req', 'no');
        }
    },

    /**
     * 报名
     */
    baoming: function (id, password) {
        // cc.dd.NetWaitUtil.show('正在报名比赛');
        const req = new cc.pb.bisai.msg_match_sign_req();
        req.setMatchId(id);
        if (password) {
            req.setMatchPasswd(password);
        }
        cc.gateNet.Instance().sendMsg(cc.netCmd.bisai.cmd_msg_match_sign_req, req,
            'cmd_msg_match_sign_req', 'no');
    },
    /**
     * 中途加入
     */
    zhongtujiaru: function (id) {
        // cc.dd.NetWaitUtil.show('正在报名比赛');
        const req = new cc.pb.match.msg_match_join_req();
        req.setMatchId(id);
        cc.gateNet.Instance().sendMsg(cc.netCmd.match.cmd_msg_match_join_req, req,
            'cmd_msg_match_join_req', 'no');
    },
    /**
     * 退赛
     */
    tuiSai: function (id) {
        // cc.dd.NetWaitUtil.show('正在退出比赛报名');
        const req = new cc.pb.bisai.msg_match_unsign_req();
        req.setMatchId(id);
        cc.gateNet.Instance().sendMsg(cc.netCmd.bisai.cmd_msg_match_unsign_req, req,
            'cmd_msg_match_unsign_req', 'no');
    },

    /**
     * 获取报名人数
     */
    getBaomingNum: function (id) {
        if (cc.gateNet.Instance().isConnected()) {
            const req = new cc.pb.bisai.msg_get_match_signed_num_req();
            req.setMatchId(id);
            cc.gateNet.Instance().sendMsg(cc.netCmd.bisai.cmd_msg_get_match_signed_num_req, req,
                'cmd_msg_get_match_signed_num_req', 'no');
        }

    },

    /**
     * 请求进入比赛场场景
     */
    enterBisaiScene: function () {
        const req = new cc.pb.jilinmajiang.p17_req_enter_match();
        req.setUserid(cc.dd.user.id);
        cc.gateNet.Instance().sendMsg(cc.netCmd.jilinmajiang.cmd_p17_req_enter_match, req, "p17_req_enter_match");
    },

    /**
     * 获取比赛场战绩
     */
    getBscZhanji: function () {
        cc.dd.NetWaitUtil.show('获取比赛场战绩..');
        const req = new cc.pb.bisai.msg_get_match_history_req();
        cc.gateNet.Instance().sendMsg(cc.netCmd.bisai.cmd_msg_get_match_history_req, req,
            'cmd_msg_get_match_history_req', 'no');
    },

};

module.exports = sendMsg;