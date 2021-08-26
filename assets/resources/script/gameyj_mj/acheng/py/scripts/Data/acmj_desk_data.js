var base_mj_desk_data = require("base_mj_desk_data");

var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var HuType = require('jlmj_define').HuType;
var pai3d_value = require("jlmj_pai3d_value");

var ACMJDeskData = cc.Class({
    extends: base_mj_desk_data.DeskData,

    properties: {

    },

    statics: {

        Instance: function () {
            if (!this.s_desk) {
                this.s_desk = new ACMJDeskData();
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

    /**
     * 是否还有剩余牌
     * @returns {boolean}
     */
    hasRemainPai: function () {
        return this.remainCards > this.require_playerMgr.Instance().playerList.length + 9;
    },
    getMJRemainCard() {
        // 还剩几张麻将牌
        return 112;
    },

    isFriend: function () {
        var g_id = RoomMgr.Instance().gameId == cc.dd.Define.GameType.ACMJ_FRIEND;
        var c_name = cc.dd.SceneManager.getCurrScene().name == cc.dd.Define.GameId[cc.dd.Define.GameType.ACMJ_FRIEND];
        return g_id && c_name;
    },

    isReplay: function () {
        var g_id = RoomMgr.Instance().gameId == cc.dd.Define.GameType.ACMJ_FRIEND;
        var c_name = cc.dd.SceneManager.getCurrScene().name == 'acmj_replay_game';
        return g_id && c_name;
    },

    isJBC: function () {
        var g_id = RoomMgr.Instance().gameId == cc.dd.Define.GameType.ACMJ_GOLD;
        var c_name = cc.dd.SceneManager.getCurrScene().name == cc.dd.Define.GameId[cc.dd.Define.GameType.ACMJ_GOLD];
        return g_id && c_name;
    },

    isMatch: function () {
        var g_id = RoomMgr.Instance().gameId == cc.dd.Define.GameType.ACMJ_MATCH;
        var c_name = cc.dd.SceneManager.getCurrScene().name == cc.dd.Define.GameId[cc.dd.Define.GameType.ACMJ_MATCH];
        return g_id && c_name;
    },

    isInMaJiang: function () {
        let scenename = cc.dd.SceneManager.getCurrScene().name;
        if (scenename == cc.dd.Define.GameId[cc.dd.Define.GameType.ACMJ_GOLD] || scenename == cc.dd.Define.GameId[cc.dd.Define.GameType.ACMJ_FRIEND] || scenename == 'acmj_replay_game' || cc.dd.Define.GameId[cc.dd.Define.GameType.ACMJ_MATCH]) {
            return true
        } else {
            return false;
        }
    },

    getHuList() {
        var huInfoList = [];    //索引越大,优先级越大
        huInfoList.push({ type: HuType.ZHONG_ZHANG, ani: ['hu', 'huXS'], audio: 'dianpao_hu' });           //三砍
        huInfoList.push({ type: HuType.PING_HU, ani: ['hu', 'huXS'], audio: 'dianpao_hu' });           //平胡
        huInfoList.push({ type: HuType.JIA_HU, ani: ['jiahu', 'jiahuXS'], audio: 'dianpao_hu' });         //夹胡
        huInfoList.push({ type: HuType.BIAN_HU, ani: ['bianhu', 'bianhuXS'], audio: 'dianpao_hu' });        //边胡
        huInfoList.push({ type: HuType.XIAO_SA, ani: ['hu', 'huXS'], audio: 'dianpao_hu' });        //鸡胡
        huInfoList.push({ type: HuType.JIA5_HU, ani: ['hu', 'huXS'], audio: 'dianpao_hu' });//刮大风

        huInfoList.push({ type: HuType.QING_YI_SE, ani: ['qingyise'], audio: 'dianpao_hu' });     //清一色
        huInfoList.push({ type: HuType.QIANG_HU, ani: ['qiangganghu', 'qiangganghuXS'], audio: 'dianpao_hu' });//抢杠胡

        huInfoList.push({ type: HuType.ZI_MO, ani: ['zimo', 'zimoXS'], audio: 'zimo' });          //自摸
        huInfoList.push({ type: HuType.MO_BAO, ani: ['loubao'], audio: 'mobao' });         //摸宝
        huInfoList.push({ type: HuType.DUI_BAO, ani: ['duibao'], audio: 'duibao' });        //对宝
        return huInfoList;
    },

    getZimoList() {
        var zimoHuList = [];
        zimoHuList.push({ type: HuType.ZHONG_ZHANG, ani: ['zimo', 'zimoXS'], audio: 'zimo' });          //三砍
        zimoHuList.push({ type: HuType.ZI_MO, ani: ['zimo', 'zimoXS'], audio: 'zimo' });          //自摸
        zimoHuList.push({ type: HuType.JIA5_HU, ani: ['zimo', 'zimoXS'], audio: 'guadafeng' });//刮大风
        zimoHuList.push({ type: HuType.JIANG_DUI, ani: ['hu', 'huXS'], audio: 'dianpao_hu' });//红中满天飞
        zimoHuList.push({ type: HuType.QING_YI_SE, ani: ['qingyise'], audio: 'zimo' });     //清一色
        zimoHuList.push({ type: HuType.TIAN_HU, ani: ['tianhu'], audio: 'zimo' });        //天胡
        zimoHuList.push({ type: HuType.DANDIAO_PIAOHU, ani: ['zimo', 'zimoXS'], audio: 'zimo' });//开牌炸
        return zimoHuList;
    },

    getHuAnimInfo: function (huType, isZimo) {
        switch (huType) {
            case HuType.PING_HU:
            case HuType.ZHONG_ZHANG:
            case HuType.JIA_HU:
            case HuType.JIA5_HU:
            case HuType.BIAN_HU:
            case HuType.XIAO_SA:
            case HuType.JIANG_DUI:
            case HuType.DANDIAO_PIAOHU:
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
            case HuType.QING_YI_SE:
                return 'qys_ani';
            default:
                return null;
        }
    },

    initMJComponet() {
        return require("mjComponentValue").acmj;
    }
});

module.exports = {
    DeskEvent: base_mj_desk_data.DeskEvent,
    DeskED: base_mj_desk_data.DeskED,
    DeskData: ACMJDeskData,
};