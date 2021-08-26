var dd = cc.dd;

var RoomMgr = require("jlmj_room_mgr").RoomMgr;

var HuType = require('jlmj_define').HuType;
let base_mj_desk_info = require('base_mj_desk_info');
var UIZorder = require("mj_ui_zorder");

var Text = cc.dd.Text;

//每个麻将都要改写这个
let mjComponentValue = null;

var baseDeskInfo = cc.Class({
    extends: base_mj_desk_info,

    ctor: function () {
        mjComponentValue = this.initMJComponet();
    },

    initProperties: function() {
        cc.log("hlmj_desk_info onLoad");
        this.logo = cc.find("Canvas/desk_node/c-logo-helong").getComponent(cc.Sprite);

        this.gghh_ani = cc.find("Canvas/desk_node/play_anis/gghh_m").getComponent(sp.Skeleton);
        // this.gkm_ani = cc.find("Canvas/desk_node/play_anis/gkm_m").getComponent(sp.Skeleton);
        // this.jingoushiba_ani = cc.find("Canvas/desk_node/play_anis/jingoushiba_m").getComponent(sp.Skeleton);
        this.qd_ani = cc.find("Canvas/desk_node/play_anis/qd_m").getComponent(sp.Skeleton);

        this.gghh_ani.node.active = false;
        // this.gkm_ani.node.active = false;
        // this.jingoushiba_ani.node.active = false;
        this.qd_ani.node.active = false;
    },

    /**
     * 获取文字玩法
     */
    getGameGuiZe: function() {
        let cur_rule = RoomMgr.Instance()._Rule;

        let gz_arr_box = [];
        gz_arr_box.push(cc.dd.Text.TEXT_PY_RULE_166.format([cur_rule.usercountlimit]));
        // gz_arr_box.push(cur_rule.feigangafterting ? Text.TEXT_PY_RULE_167 : '');
        gz_arr_box.push(cur_rule.yipaoduoxiang ? Text.TEXT_PY_RULE_116 : '');
        // gz_arr_box.push(cur_rule.pihu ? Text.TEXT_PY_RULE_168 : '');
        gz_arr_box.push(cur_rule.haidilao ? Text.TEXT_PY_RULE_64 : '');


        let text = gz_arr_box.join(',');

        let gz_arr_info = [];
        let juquan_txt = cc.dd.Text.TEXT_PY_RULE_10;
        gz_arr_info.push({ str: Text.TEXT_PY_RULE_166.format([cur_rule.usercountlimit]), nodetype: 0 });
        gz_arr_info.push({ str: juquan_txt.format([cur_rule.boardscout]), nodetype: 0 });
        // gz_arr_info.push({ str: cur_rule.feigangafterting ? Text.TEXT_PY_RULE_167 : '', nodetype: 1 });
        gz_arr_info.push({ str: cur_rule.yipaoduoxiang ? Text.TEXT_PY_RULE_116 : '', nodetype: 1 });
        // gz_arr_info.push({ str: cur_rule.pihu ? Text.TEXT_PY_RULE_168 : '', nodetype: 1 });
        gz_arr_info.push({ str: cur_rule.haidilao ? Text.TEXT_PY_RULE_64 : '', nodetype: 1 });

        let title = Text.TEXT_PY_RULE_166.format(this.require_playerMgr.Instance().playerList.length);
        title += " " + "房间号:" + (RoomMgr.Instance().roomId || 888888);
        let content = '共' + cur_rule.boardscout + '局';
        content += " " + text;

        return [gz_arr_box, gz_arr_info, title, content, '局数'];
    },

    clearHuAni(){
        this.gghh_ani.node.active = false;
        // this.gkm_ani.node.active = false;
        // this.jingoushiba_ani.node.active = false;
        this.qd_ani.node.active = false;
    },


    getQuanJu(data){
        var text = cc.dd.Text.TEXT_DESK_INFO_7;
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
        var juquan_txt = cc.dd.Text.TEXT_PY_RULE_10;
        fj_arr.push(Text.TEXT_PY_RULE_166.format([RoomMgr.Instance()._Rule.usercountlimit]));
        fj_arr.push(Text.TEXT_PY_RULE_12+RoomMgr.Instance().roomId);
        fj_arr.push(juquan_txt.format([RoomMgr.Instance()._Rule.boardscout]));

        return fj_arr.join(' ');
    },

    getHuAni(id){
        switch(id){
            case HuType.GANG_HUA_HU:
                return [this.gghh_ani, ['gangshanghua']];
            case HuType.GANG_PAO_HU:
                return [this.gghh_ani, ['gangshangpao']];
            case HuType.HAIDI_LAO:
                return [this.gghh_ani, ['haidilao']];
            // case HuType.HAIDI_PAO:
            //     return [this.gghh_ani, ['haidipao']];
            case -1:
                return [this.gghh_ani, ['yipaoshuangxiang']];
            case -2:
                return [this.gghh_ani, ['yipaosanxiang']];
            // case HuType.JIA5_HU:
            //     return [this.gkm_ani, ['guadafeng']];
            // case HuType.DANDIAO_PIAOHU:
            //     return [this.gkm_ani, ['kaipaizha']];
            // case HuType.DANDIAO_PIAOHU:
            //     return [this.jingoushiba_ani, ['jingoudiao']];
            case HuType.HAO_QI:
                return [this.qd_ani, ['haoqidui']];
            // case HuType.HAO_QI:
            //     return [this.qd_ani, ['longqidui']];
            // case HuType.QI_DUI:
            //     return [this.qd_ani, ['qidui']];
            case -3:
                return [this.qd_ani, ['qinglongqidui']];
            case -4:
                return [this.qd_ani, ['qinqidui']];
            case HuType.QI_DUI:
                return [this.qd_ani, ['qixiaodui']];
            default:
                return null;
        }
    },

    /**
     * 更新剩余牌数
     * @param cardNum 牌数量 如果为null就去取数据层的数据
     */
    updateRemainCard: function (cardNum) {
        if (!cardNum) {
            cardNum = this.require_DeskData.Instance().remainCards;
        }
        if (this.require_DeskData.Instance().isGameStart || this.isDeskReplay()) {
            cc.find("Canvas/toppanel/desk_leftinfo_fun/leftInfo/pai_num").getComponent(cc.Label).string = cardNum;

            if(!this.isDeskReplay()){
                cardNum = parseInt(cardNum);

                let limitcardNum = RoomMgr.Instance()._Rule.usercountlimit == 3 ? 9 : 5;

                let realCardNum = cardNum - this.require_DeskData.Instance().fenzhanglimit;
                if(realCardNum <= limitcardNum && realCardNum >= 0) {
                    cc.error("剩余" + realCardNum + "张牌开始分张");
                }
                if(realCardNum <= limitcardNum && realCardNum > 0){
                    cc.dd.UIMgr.openUI(this.require_jlmj_prefab.JLMJ_TIPS_POP, function (ui) {
                        ui.getComponent('jlmj_tips_pop').setText("剩余"+realCardNum+"张牌开始分张", true);
                        ui.zIndex = UIZorder.MJ_LAYER_POPUP;
                    }.bind(this));
                }
            }
        }
    },

    reconnectFenZhang(fenzhang){
        if(fenzhang > 0 && (!this.fenzhang || !this.fenzhang.node.active) && !this._jiesuan && !this.jiesuan_TimeID){
            this.require_DeskData.Instance().isFenZhang = true;
            this.require_DeskData.Instance().fenzhangCount = 0;
            if(!this.fenzhang){
                this.fenzhang = cc.instantiate(this.prefab_fenzhang).getComponent('jlmj_fenzhang');
                let anim = this.fenzhang.node.getComponent(cc.Animation);
                anim.stop();
                anim.playOnLoad = false;
                anim.defaultClip = null;
                this.fenzhang.initData(this.require_playerMgr.Instance().playerList);
                this.fenzhang.node.parent = this.node;
            }
            this.fenzhang.node.active = true;
            this.fenzhang.actEncd();

            var player_down_ui = this._playerDownUI.getComponent(mjComponentValue.playerDownUI);
            player_down_ui.setFenPaiTouched(true);

            for(let i = 0; i < fenzhang; i++){
                this.require_DeskData.Instance().setisFenzhangMopai();
            }
        }
    },

    initMJComponet() {
        return require("mjComponentValue").hlmj;
    }
});
module.exports = baseDeskInfo;