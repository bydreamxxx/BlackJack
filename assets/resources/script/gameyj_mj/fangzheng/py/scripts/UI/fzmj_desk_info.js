var dd = cc.dd;

var RoomMgr = require("jlmj_room_mgr").RoomMgr;

var HuType = require('jlmj_define').HuType;
let base_mj_desk_info = require('base_mj_desk_info');

var Text = cc.dd.Text;

var baseDeskInfo = cc.Class({
    extends: base_mj_desk_info,

    initProperties: function() {
        cc.log("fzmj_desk_info onLoad");
        this.logo = cc.find("Canvas/desk_node/c-logo-fangzheng").getComponent(cc.Sprite);

        // this.gghh_ani = cc.find("Canvas/desk_node/play_anis/gghh_m").getComponent(sp.Skeleton);
        this.gkm_ani = cc.find("Canvas/desk_node/play_anis/gkm_m").getComponent(sp.Skeleton);
        // this.jingoushiba_ani = cc.find("Canvas/desk_node/play_anis/jingoushiba_m").getComponent(sp.Skeleton);
        this.qd_ani = cc.find("Canvas/desk_node/play_anis/qd_m").getComponent(sp.Skeleton);

        // this.gghh_ani.node.active = false;
        this.gkm_ani.node.active = false;
        // this.jingoushiba_ani.node.active = false;
        this.qd_ani.node.active = false;
    },

    /**
     * 获取文字玩法
     */
    getGameGuiZe: function() {
        let cur_rule = RoomMgr.Instance()._Rule;

        let gz_arr_box = [];
        gz_arr_box.push(cc.dd.Text.TEXT_PY_RULE_136.format([cur_rule.usercountlimit]));
        gz_arr_box.push(cur_rule.fengdingtype == 0 ? Text.TEXT_PY_RULE_54 : Text.TEXT_PY_RULE_55.format([cur_rule.fengdingtype+2]));
        gz_arr_box.push(cur_rule.isnormalxi ? Text.TEXT_PY_RULE_132 : Text.TEXT_PY_RULE_133);

        gz_arr_box.push(cur_rule.ismultliangxi ? Text.TEXT_PY_RULE_128 : '');
        gz_arr_box.push(cur_rule.isheipao3jia ? Text.TEXT_PY_RULE_129 : '');
        gz_arr_box.push(cur_rule.issdxtianhu ? Text.TEXT_PY_RULE_130 : '');
        gz_arr_box.push(cur_rule.isliangzhang ? Text.TEXT_PY_RULE_137 : '');
        gz_arr_box.push(cur_rule.notong ? Text.TEXT_PY_RULE_131 : '');
        gz_arr_box.push(cur_rule.isliangxikaimen ? Text.TEXT_PY_RULE_140 : '');


        let text = gz_arr_box.join(',');

        let gz_arr_info = [];
        let juquan_txt = Text.TEXT_PY_RULE_10;
        gz_arr_info.push({ str: Text.TEXT_PY_RULE_136.format([cur_rule.usercountlimit]), nodetype: 0 });
        gz_arr_info.push({ str: juquan_txt.format([cur_rule.boardscout]), nodetype: 0 });

        gz_arr_info.push({ str: cur_rule.fengdingtype == 0 ? Text.TEXT_PY_RULE_54 : Text.TEXT_PY_RULE_55.format([cur_rule.fengdingtype+2]), nodetype: 1 });
        gz_arr_info.push({ str: cur_rule.isnormalxi ? Text.TEXT_PY_RULE_132 : Text.TEXT_PY_RULE_133, nodetype: 1 });

        gz_arr_info.push({ str: cur_rule.ismultliangxi ? Text.TEXT_PY_RULE_128 : '', nodetype: 1 });
        gz_arr_info.push({ str: cur_rule.isheipao3jia ? Text.TEXT_PY_RULE_129 : '', nodetype: 1 });
        gz_arr_info.push({ str: cur_rule.issdxtianhu ? Text.TEXT_PY_RULE_130 : '', nodetype: 1 });
        gz_arr_info.push({ str: cur_rule.isliangzhang ? Text.TEXT_PY_RULE_137 : '', nodetype: 1 });
        gz_arr_info.push({ str: cur_rule.notong ? Text.TEXT_PY_RULE_131 : '', nodetype: 1 });
        gz_arr_info.push({ str: cur_rule.isliangxikaimen ? Text.TEXT_PY_RULE_140 : '', nodetype: 1 });

        let title = Text.TEXT_PY_RULE_136.format(this.require_playerMgr.Instance().playerList.length);
        title += " " + "房间号:" + (RoomMgr.Instance().roomId || 888888);
        let content = '共' + cur_rule.boardscout + '' + '局';
        content += " " + text;

        return [gz_arr_box, gz_arr_info, title, content, '局数'];
    },

    clearHuAni(){
        // this.gghh_ani.node.active = false;
        this.gkm_ani.node.active = false;
        // this.jingoushiba_ani.node.active = false;
        this.qd_ani.node.active = false;
    },

    /**
     *  断线重连回来  需要发送加载完毕
     */
    sendReloadOK: function () {
        var msg = new cc.pb.fangzhengmj.fangzheng_req_reloading_ok();
        cc.gateNet.Instance().sendMsg(cc.netCmd.fangzhengmj.cmd_fangzheng_req_reloading_ok,msg,"fangzheng_req_reloading_ok");
    },

    //朋友场离开已开始
    py_dissolve_room_req:function() {
        cc.log("【UI】发送离开 朋友场离开已开始 发起解散房间请求");
        var msg = new cc.pb.fangzhengmj.fangzheng_req_sponsor_dissolve_room();
        msg.setSponsorid(dd.user.id);
        cc.gateNet.Instance().sendMsg(cc.netCmd.fangzhengmj.cmd_fangzheng_req_sponsor_dissolve_room,msg,"fangzheng_req_sponsor_dissolve_room");
    },

    callNetReadFunc:function () {
        var msg = new cc.pb.fangzhengmj.fangzheng_req_ready();
        cc.gateNet.Instance().sendMsg(cc.netCmd.fangzhengmj.cmd_fangzheng_req_ready,msg,"fangzheng_req_ready");
    },

    /**
     * 取消托管
     */
    cleanTuoGuanBtnCallBack:function () {
        if(this.require_DeskData.Instance().isoffline) {
            const req = new cc.pb.fangzhengmj.fangzheng_req_update_deposit();
            req.setIsdeposit(false);
            cc.gateNet.Instance().sendMsg(cc.netCmd.fangzhengmj.cmd_fangzheng_req_update_deposit, req, "fangzheng_req_update_deposit", true);
        }
    },

    getQuanJu(data){
        var text = cc.dd.Text.TEXT_DESK_INFO_7;
        var str = text.format([data]);
        return str;
    },

    on_show_da_pai_prompt:function (data) {
        if(data[1] != null && this.da_pai_prompt){
            if(data[0] == -1 && this.dapai_tip_type == 0 && data[1] == false){
                return;
            }
            if(data[0] == -2 && this.dapai_tip_type == 1 && data[1] == false){
                return;
            }
            this.dapai_tip_type = data[0];
            this.da_pai_prompt.active = data[1];
            var text_arr = [Text.TEXT_MJ_DESK_INFO_0,Text.TEXT_MJ_DESK_INFO_10];
            this.da_pai_prompt_label.string = text_arr [data[0]];
        }
    },
    /**
     * 准备
     */
    callNetReadFunc: function () {
        var msg = new cc.pb.fangzhengmj.fangzheng_req_ready();
        cc.gateNet.Instance().sendMsg(cc.netCmd.fangzhengmj.cmd_fangzheng_req_ready,msg,"fangzheng_req_ready");
    },

    getFJInfo(){
        var fj_arr = [];
        var juquan_txt = Text.TEXT_PY_RULE_10;
        fj_arr.push(Text.TEXT_PY_RULE_136.format([RoomMgr.Instance()._Rule.usercountlimit]));
        fj_arr.push(Text.TEXT_PY_RULE_12+RoomMgr.Instance().roomId);
        fj_arr.push(juquan_txt.format([RoomMgr.Instance()._Rule.boardscout]));

        return fj_arr.join(' ');
    },

    getHuAni(id){
        switch(id){
            // case HuType.GANG_HUA_HU:
            //     return [this.gghh_ani, ['gangshanghua']];
            // case HuType.GANG_PAO_HU:
            //     return [this.gghh_ani, ['gangshangpao']];
            // case HuType.HAIDI_LAO:
            //     return [this.gghh_ani, ['haidilao']];
            // case HuType.HAIDI_PAO:
            //     return [this.gghh_ani, ['haidipao']];
            // case -1:
            //     return [this.gghh_ani, ['yipaoshuangxiang']];
            // case -2:
            //     return [this.gghh_ani, ['yipaosanxiang']];
            case HuType.JIA5_HU:
                return [this.gkm_ani, ['guadafeng']];
            // case HuType.DANDIAO_PIAOHU:
            //     return [this.gkm_ani, ['kaipaizha']];
            // case HuType.DANDIAO_PIAOHU:
            //     return [this.jingoushiba_ani, ['jingoudiao']];
            // case HuType.HAO_QI:
            //     return [this.qd_ani, ['haoqidui']];
            // case HuType.HAO_QI:
            //     return [this.qd_ani, ['longqidui']];
            // case HuType.QI_DUI:
            //     return [this.qd_ani, ['qidui']];
            // case -3:
            //     return [this.qd_ani, ['qinglongqidui']];
            // case -4:
            //     return [this.qd_ani, ['qinqidui']];
            case HuType.QI_DUI:
                return [this.qd_ani, ['qixiaodui']];
            default:
                return null;
        }
    },

    initMJComponet() {
        return require("mjComponentValue").fzmj;
    }
});
module.exports = baseDeskInfo;