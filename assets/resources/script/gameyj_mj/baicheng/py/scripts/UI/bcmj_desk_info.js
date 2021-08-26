var dd = cc.dd;

var RoomMgr = require("jlmj_room_mgr").RoomMgr;

var HuType = require('jlmj_define').HuType;
let base_mj_desk_info = require('base_mj_desk_info');

var Text = cc.dd.Text;

var baseDeskInfo = cc.Class({
    extends: base_mj_desk_info,

    initProperties: function() {
        cc.log("bcmj_desk_info onLoad");
        this.logo = cc.find("Canvas/desk_node/c-logo-baicheng").getComponent(cc.Sprite);

        // this.gghh_ani = cc.find("Canvas/desk_node/play_anis/gghh_m").getComponent(sp.Skeleton);
        // this.gkm_ani = cc.find("Canvas/desk_node/play_anis/gkm_m").getComponent(sp.Skeleton);
        // this.jingoushiba_ani = cc.find("Canvas/desk_node/play_anis/jingoushiba_m").getComponent(sp.Skeleton);
        // this.qd_ani = cc.find("Canvas/desk_node/play_anis/qd_m").getComponent(sp.Skeleton);

        // this.gghh_ani.node.active = false;
        // this.gkm_ani.node.active = false;
        // this.jingoushiba_ani.node.active = false;
        // this.qd_ani.node.active = false;
    },

    /**
     * 获取文字玩法
     */
    getGameGuiZe: function() {
        let cur_rule = RoomMgr.Instance()._Rule;

        let fengdingType = [cc.dd.Text.TEXT_PY_RULE_54, cc.dd.Text.TEXT_PY_RULE_39.format(128), cc.dd.Text.TEXT_PY_RULE_39.format(256)];

        let gz_arr_box = [];
        gz_arr_box.push(cc.dd.Text.TEXT_PY_RULE_155.format([cur_rule.usercountlimit]));
        gz_arr_box.push(fengdingType[cur_rule.fengding]);
        gz_arr_box.push(cur_rule.isjia5 ? Text.TEXT_PY_RULE_156 : '');
        gz_arr_box.push(cur_rule.isqingyise ? Text.TEXT_PY_RULE_29 : '');
        gz_arr_box.push(cur_rule.isjihujipiao ? Text.TEXT_PY_RULE_157 : '');
        gz_arr_box.push(cur_rule.iszangang ? Text.TEXT_PY_RULE_158 : '');
        gz_arr_box.push(cur_rule.isshoubayi ? Text.TEXT_PY_RULE_30 : '');
        gz_arr_box.push(cur_rule.isbeikaobei ? Text.TEXT_PY_RULE_159 : '');
        gz_arr_box.push(cur_rule.iszerenzhi ? Text.TEXT_PY_RULE_160 : '');
        gz_arr_box.push(cur_rule.isgangjiafan ? Text.TEXT_PY_RULE_79 : '');
        gz_arr_box.push(cur_rule.isxiaojifeidan ? Text.TEXT_PY_RULE_6 : '');


        let text = gz_arr_box.join(',');

        let gz_arr_info = [];
        let juquan_txt = cc.dd.Text.TEXT_PY_RULE_11;
        gz_arr_info.push({ str: Text.TEXT_PY_RULE_155.format([cur_rule.usercountlimit]), nodetype: 0 });
        gz_arr_info.push({ str: juquan_txt.format([cur_rule.boardscout]), nodetype: 0 });
        gz_arr_info.push({ str: fengdingType[cur_rule.fengding], nodetype: 1 });
        gz_arr_info.push({ str: cur_rule.isjia5 ? Text.TEXT_PY_RULE_156 : '', nodetype: 1 });
        gz_arr_info.push({ str: cur_rule.isqingyise ? Text.TEXT_PY_RULE_29 : '', nodetype: 1 });
        gz_arr_info.push({ str: cur_rule.isjihujipiao ? Text.TEXT_PY_RULE_157 : '', nodetype: 1 });
        gz_arr_info.push({ str: cur_rule.iszangang ? Text.TEXT_PY_RULE_158 : '', nodetype: 1 });
        gz_arr_info.push({ str: cur_rule.isshoubayi ? Text.TEXT_PY_RULE_30 : '', nodetype: 1 });
        gz_arr_info.push({ str: cur_rule.isbeikaobei ? Text.TEXT_PY_RULE_159 : '', nodetype: 1 });
        gz_arr_info.push({ str: cur_rule.iszerenzhi ? Text.TEXT_PY_RULE_160 : '', nodetype: 1 });
        gz_arr_info.push({ str: cur_rule.isgangjiafan ? Text.TEXT_PY_RULE_79 : '', nodetype: 1 });
        gz_arr_info.push({ str: cur_rule.isxiaojifeidan ? Text.TEXT_PY_RULE_6 : '', nodetype: 1 });

        let title = Text.TEXT_PY_RULE_155.format(this.require_playerMgr.Instance().playerList.length);
        title += " " + "房间号:" + (RoomMgr.Instance().roomId || 888888);
        let content = '共' + cur_rule.boardscout + '' + '圈';
        content += " " + text;

        return [gz_arr_box, gz_arr_info, title, content, '圈数'];
    },

    clearHuAni(){
        // this.gghh_ani.node.active = false;
        // this.gkm_ani.node.active = false;
        // this.jingoushiba_ani.node.active = false;
        // this.qd_ani.node.active = false;
    },


    getQuanJu(data){
        var text = cc.dd.Text.TEXT_DESK_INFO_1;
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
            var text_arr = [Text.TEXT_MJ_DESK_INFO_0,Text.TEXT_MJ_DESK_INFO_7];
            this.da_pai_prompt_label.string = text_arr [data[0]];
        }
    },

    getFJInfo(){
        var fj_arr = [];
        var juquan_txt = cc.dd.Text.TEXT_PY_RULE_11;
        fj_arr.push(Text.TEXT_PY_RULE_155.format([RoomMgr.Instance()._Rule.usercountlimit]));
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
            // case HuType.JIA5_HU:
            //     return [this.gkm_ani, ['guadafeng']];
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
            // case HuType.QI_DUI:
            //     return [this.qd_ani, ['qixiaodui']];
            default:
                return null;
        }
    },

    initMJComponet() {
        return require("mjComponentValue").bcmj;
    }
});
module.exports = baseDeskInfo;