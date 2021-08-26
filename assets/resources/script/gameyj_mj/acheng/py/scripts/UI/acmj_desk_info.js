var dd = cc.dd;

var RoomMgr = require("jlmj_room_mgr").RoomMgr;

var HuType = require('jlmj_define').HuType;
let base_mj_desk_info = require('base_mj_desk_info');

var Text = cc.dd.Text;

var baseDeskInfo = cc.Class({
    extends: base_mj_desk_info,

    initProperties: function() {
        cc.log("acmj_desk_info onLoad");
        this.logo = cc.find("Canvas/desk_node/c-logo-acheng").getComponent(cc.Sprite);

        // this.gghh_ani = cc.find("Canvas/desk_node/play_anis/gghh_m").getComponent(sp.Skeleton);
        this.gkm_ani = cc.find("Canvas/desk_node/play_anis/gkm_m").getComponent(sp.Skeleton);
        // this.jingoushiba_ani = cc.find("Canvas/desk_node/play_anis/jingoushiba_m").getComponent(sp.Skeleton);
        // this.qd_ani = cc.find("Canvas/desk_node/play_anis/qd_m").getComponent(sp.Skeleton);

        // this.gghh_ani.node.active = false;
        this.gkm_ani.node.active = false;
        // this.jingoushiba_ani.node.active = false;
        // this.qd_ani.node.active = false;
    },

    /**
     * 获取文字玩法
     */
    getGameGuiZe: function() {
        let cur_rule = RoomMgr.Instance()._Rule;

        let gz_arr_box = [];
        gz_arr_box.push(cc.dd.Text.TEXT_PY_RULE_164.format([cur_rule.usercountlimit]));
        gz_arr_box.push(cur_rule.ishongzhongmaitianfei ? Text.TEXT_PY_RULE_76 : '');
        gz_arr_box.push(cur_rule.isguadafeng ? Text.TEXT_PY_RULE_81 : '');
        gz_arr_box.push(cur_rule.isduibao ? Text.TEXT_PY_RULE_165 : '');
        gz_arr_box.push(cur_rule.iskaipaizha ? Text.TEXT_PY_RULE_78 : '');


        let text = gz_arr_box.join(',');

        let gz_arr_info = [];
        let juquan_txt = RoomMgr.Instance()._Rule.usercountlimit==2 ? cc.dd.Text.TEXT_PY_RULE_10 : cc.dd.Text.TEXT_PY_RULE_11;
        gz_arr_info.push({ str: Text.TEXT_PY_RULE_164.format([cur_rule.usercountlimit]), nodetype: 0 });
        gz_arr_info.push({ str: juquan_txt.format([cur_rule.boardscout]), nodetype: 0 });
        gz_arr_info.push({ str: cur_rule.ishongzhongmaitianfei ? Text.TEXT_PY_RULE_76 : '', nodetype: 1 });
        gz_arr_info.push({ str: cur_rule.isguadafeng ? Text.TEXT_PY_RULE_81 : '', nodetype: 1 });
        gz_arr_info.push({ str: cur_rule.isduibao ? Text.TEXT_PY_RULE_165 : '', nodetype: 1 });
        gz_arr_info.push({ str: cur_rule.iskaipaizha ? Text.TEXT_PY_RULE_78 : '', nodetype: 1 });

        let title = Text.TEXT_PY_RULE_164.format(this.require_playerMgr.Instance().playerList.length);
        title += " " + "房间号:" + (RoomMgr.Instance().roomId || 888888);
        let content = '共' + cur_rule.boardscout + '' + (RoomMgr.Instance()._Rule.usercountlimit == 2 ? '局' : '圈');
        content += " " + text;

        return [gz_arr_box, gz_arr_info, title, content, RoomMgr.Instance()._Rule.usercountlimit==2 ? '局数' : '圈数'];
    },

    clearHuAni(){
        // this.gghh_ani.node.active = false;
        this.gkm_ani.node.active = false;
        // this.jingoushiba_ani.node.active = false;
        // this.qd_ani.node.active = false;
    },


    getQuanJu(data){
        var text = RoomMgr.Instance()._Rule.usercountlimit == 2 ? cc.dd.Text.TEXT_DESK_INFO_7 : cc.dd.Text.TEXT_DESK_INFO_1;
        var str = text.format([data]);
        return str;
    },

    on_show_da_pai_prompt:function (data) {
        // if(data[1] != null && this.da_pai_prompt){
        //     if(data[0] == -1 && this.dapai_tip_type == 0 && data[1] == false){
        //         return;
        //     }
        //     if(data[0] == -2 && this.dapai_tip_type == 1 && data[1] == false){
        //         return;
        //     }
        //     this.dapai_tip_type = data[0];
        //     this.da_pai_prompt.active = data[1];
        //     var text_arr = [Text.TEXT_MJ_DESK_INFO_0,Text.TEXT_MJ_DESK_INFO_7];
        //     this.da_pai_prompt_label.string = text_arr [data[0]];
        // }
    },

    getFJInfo(){
        var fj_arr = [];
        var juquan_txt = RoomMgr.Instance()._Rule.usercountlimit==2 ? cc.dd.Text.TEXT_PY_RULE_10 : cc.dd.Text.TEXT_PY_RULE_11;
        fj_arr.push(Text.TEXT_PY_RULE_164.format([RoomMgr.Instance()._Rule.usercountlimit]));
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
            case HuType.DANDIAO_PIAOHU:
                return [this.gkm_ani, ['kaipaizha']];
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
            // case HuType.QI_DUI:
            //     return [this.qd_ani, ['qixiaodui']];
            default:
                return null;
        }
    },

    initMJComponet() {
        return require("mjComponentValue").acmj;
    }
});
module.exports = baseDeskInfo;