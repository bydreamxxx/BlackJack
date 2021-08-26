var base_mj_desk_data = require("base_mj_desk_data");

var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var HuType = require('jlmj_define').HuType;

var FZMJDeskData = cc.Class({
    extends: base_mj_desk_data.DeskData,

    properties: {

    },

    statics: {

        Instance: function () {
            if (!this.s_desk) {
                this.s_desk = new FZMJDeskData();
            }
            return this.s_desk;
        },

        Destroy: function () {
            if (this.s_desk) {
                this.s_desk.clear();
                this.s_desk = null;
            }
        },

    },

    clear: function () {
        this._super();
        this.is_genzhuang = false;
    },
    /**
     * 是否还有剩余牌
     * @returns {boolean}
     */
    hasRemainPai: function () {
        return this.remainCards > 9;
    },
    getMJRemainCard() {
        // 还剩几张麻将牌
        if (RoomMgr.Instance()._Rule) {
            return RoomMgr.Instance()._Rule.notong ? 76 : 112;
        } else {
            return 112;
        }
    },

    isFriend: function () {
        var g_id = RoomMgr.Instance().gameId == cc.dd.Define.GameType.FZMJ_FRIEND;
        var c_name = cc.dd.SceneManager.getCurrScene().name == cc.dd.Define.GameId[cc.dd.Define.GameType.FZMJ_FRIEND];
        return g_id && c_name;
    },

    isReplay: function () {
        var g_id = RoomMgr.Instance().gameId == cc.dd.Define.GameType.FZMJ_FRIEND;
        var c_name = cc.dd.SceneManager.getCurrScene().name == 'fzmj_replay_game';
        return g_id && c_name;
    },

    isJBC: function () {
        var g_id = RoomMgr.Instance().gameId == cc.dd.Define.GameType.FZMJ_GOLD;
        var c_name = cc.dd.SceneManager.getCurrScene().name == cc.dd.Define.GameId[cc.dd.Define.GameType.FZMJ_GOLD];
        return g_id && c_name;
    },

    isMatch: function () {
        var g_id = RoomMgr.Instance().gameId == cc.dd.Define.GameType.FZMJ_MATCH;
        var c_name = cc.dd.SceneManager.getCurrScene().name == cc.dd.Define.GameId[cc.dd.Define.GameType.FZMJ_MATCH];
        return g_id && c_name;
    },

    isInMaJiang: function () {
        let scenename = cc.dd.SceneManager.getCurrScene().name;
        if (scenename == cc.dd.Define.GameId[cc.dd.Define.GameType.FZMJ_GOLD] || scenename == cc.dd.Define.GameId[cc.dd.Define.GameType.FZMJ_FRIEND] || scenename == 'fzmj_replay_game' || cc.dd.Define.GameId[cc.dd.Define.GameType.FZMJ_MATCH]) {
            return true
        } else {
            return false;
        }
    },

    getHuList() {
        var huInfoList = [];    //索引越大,优先级越大
        huInfoList.push({ type: HuType.PING_HU, ani: ['hu', 'huXS'], audio: 'dianpao_hu' });           //平胡
        huInfoList.push({ type: HuType.ZHUANG_HU, ani: ['hu', 'huXS'], audio: 'dianpao_hu' });         //庄胡
        huInfoList.push({ type: HuType.JIA_HU, ani: ['jiahu', 'jiahuXS'], audio: 'jiahu' });         //夹胡
        huInfoList.push({ type: HuType.LI_HU, ani: ['hu', 'huXS'], audio: 'dianpao_hu' });          //门清
        huInfoList.push({ type: HuType.PIAO_HU, ani: ['duiduihu'], audio: 'dianpao_hu' });        //飘胡
        huInfoList.push({ type: HuType.JIA5_HU, ani: ['hu', 'huXS'], audio: 'guadafeng' });//刮大风
        huInfoList.push({ type: HuType.QI_DUI, ani: ['hu', 'huXS'], audio: 'dianpao_hu' });//七对
        huInfoList.push({ type: HuType.KANDUI_BAO, ani: ['hu', 'huXS'], audio: 'dianpao_hu' });//亮掌
        huInfoList.push({ type: HuType.ZI_MO, ani: ['zimo', 'zimoXS'], audio: 'zimo' });          //自摸
        huInfoList.push({ type: HuType.MO_BAO, ani: ['loubao'], audio: 'mobao' });        //摸宝
        huInfoList.push({ type: HuType.DUI_BAO, ani: ['shebao'], audio: 'duibao' });     //对宝
        huInfoList.push({ type: HuType.TIAN_HU, ani: ['tianhu'], audio: 'dianpao_hu' });        //天胡
        huInfoList.push({ type: HuType.JIANG_DUI, ani: ['tianhu'], audio: 'dianpao_hu' });        //天胡
        huInfoList.push({ type: HuType.XIAO_SA, ani: ['ditu'], audio: 'dianpao_hu' });        //地胡
        return huInfoList;
    },

    getZimoList() {
        var zimoHuList = [];
        zimoHuList.push({ type: HuType.ZI_MO, ani: ['zimo', 'zimoXS'], audio: 'zimo' });          //自摸
        zimoHuList.push({ type: HuType.PIAO_HU, ani: ['duiduihu'], audio: 'zimo' });        //飘胡
        zimoHuList.push({ type: HuType.JIA5_HU, ani: ['zimo', 'zimoXS'], audio: 'guadafeng' });//刮大风
        zimoHuList.push({ type: HuType.QI_DUI, ani: ['zimo', 'zimoXS'], audio: 'zimo' });//七对
        zimoHuList.push({ type: HuType.KANDUI_BAO, ani: ['zimo', 'zimoXS'], audio: 'zimo' });//亮掌
        zimoHuList.push({ type: HuType.MO_BAO, ani: ['loubao'], audio: 'zimo' });         //摸宝
        zimoHuList.push({ type: HuType.TIAN_HU, ani: ['tianhu'], audio: 'zimo' });     //天胡
        zimoHuList.push({ type: HuType.JIANG_DUI, ani: ['tianhu'], audio: 'zimo' });     //天胡
        zimoHuList.push({ type: HuType.XIAO_SA, ani: ['ditu'], audio: 'zimo' });        //地胡
        return zimoHuList;
    },

    getHuAnimInfo: function (huType, isZimo) {
        switch (huType) {
            case HuType.PING_HU:
            case HuType.ZHUANG_HU:
            case HuType.JIA_HU:
            case HuType.LI_HU:
            case HuType.JIA5_HU:
            case HuType.QI_DUI:
            case HuType.KANDUI_BAO:
                if (isZimo) {
                    return 'dgpt_ani';
                } else {
                    return 'cpgtgh_ani';
                }
            case HuType.ZI_MO:
                return 'dgpt_ani';
            case HuType.MO_BAO:
            case HuType.DUI_BAO:
            case HuType.TIAN_HU:
            case HuType.JIANG_DUI:
            case HuType.XIAO_SA:
            case HuType.PIAO_HU:
                return 'qys_ani';
            default:
                return null;
        }
    },

    initMJComponet() {
        return require("mjComponentValue").fzmj;
    }
});

module.exports = {
    DeskEvent: base_mj_desk_data.DeskEvent,
    DeskED: base_mj_desk_data.DeskED,
    DeskData: FZMJDeskData,
};