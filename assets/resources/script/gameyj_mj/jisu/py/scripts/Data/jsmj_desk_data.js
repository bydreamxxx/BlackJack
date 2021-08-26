var base_mj_desk_data = require("base_mj_desk_data");

var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var HuType = require('jlmj_define').HuType;
var pai3d_value = require("jlmj_pai3d_value");

var JSMJDeskData = cc.Class({
    extends: base_mj_desk_data.DeskData,

    properties: {

    },

    statics: {

        Instance: function () {
            if (!this.s_desk) {
                this.s_desk = new JSMJDeskData();
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
        return true;
    },
    getMJRemainCard() {
        // 还剩几张麻将牌
        return 48;
    },

    isFriend: function () {
        var g_id = RoomMgr.Instance().gameId == cc.dd.Define.GameType.JSMJ_FRIEND;
        var c_name = cc.dd.SceneManager.getCurrScene().name == cc.dd.Define.GameId[cc.dd.Define.GameType.JSMJ_FRIEND];
        return g_id && c_name;
    },

    isReplay: function () {
        var g_id = RoomMgr.Instance().gameId == cc.dd.Define.GameType.JSMJ_FRIEND;
        var c_name = cc.dd.SceneManager.getCurrScene().name == 'jsmj_replay_game';
        return g_id && c_name;
    },

    isJBC: function () {
        var g_id = RoomMgr.Instance().gameId == cc.dd.Define.GameType.JSMJ_GOLD;
        var c_name = cc.dd.SceneManager.getCurrScene().name == cc.dd.Define.GameId[cc.dd.Define.GameType.JSMJ_GOLD];
        return g_id && c_name;
    },

    isMatch: function () {
        var g_id = RoomMgr.Instance().gameId == cc.dd.Define.GameType.JSMJ_MATCH;
        var c_name = cc.dd.SceneManager.getCurrScene().name == cc.dd.Define.GameId[cc.dd.Define.GameType.JSMJ_MATCH];
        return g_id && c_name;
    },

    isInMaJiang: function () {
        let scenename = cc.dd.SceneManager.getCurrScene().name;
        if (scenename == cc.dd.Define.GameId[cc.dd.Define.GameType.JSMJ_GOLD] || scenename == cc.dd.Define.GameId[cc.dd.Define.GameType.JSMJ_FRIEND] || scenename == 'jsmj_replay_game' || cc.dd.Define.GameId[cc.dd.Define.GameType.JSMJ_MATCH]) {
            return true
        } else {
            return false;
        }
    },

    getHuList() {
        var huInfoList = [];    //索引越大,优先级越大
        huInfoList.push({ type: HuType.PING_HU, ani: ['hu', 'huXS'], audio: 'dianpao_hu' });           //平胡
        huInfoList.push({ type: HuType.PIAO_HU, ani: ['hu', 'huXS'], audio: 'dianpao_hu' });        //碰碰胡
        return huInfoList;
    },

    getZimoList() {
        var zimoHuList = [];
        zimoHuList.push({ type: HuType.ZI_MO, ani: ['zimo', 'zimoXS'], audio: 'zimo' });          //自摸
        zimoHuList.push({ type: HuType.PIAO_HU, ani: ['zimo', 'zimoXS'], audio: 'zimo' });        //碰碰胡
        return zimoHuList;
    },

    getHuAnimInfo: function (huType, isZimo) {
        switch (huType) {
            case HuType.PING_HU:
            case HuType.PIAO_HU:
                if (isZimo) {
                    return 'dgpt_ani';
                } else {
                    return 'cpgtgh_ani';
                }
            case HuType.ZI_MO:
                return 'dgpt_ani';
            default:
                return null;
        }
    },

    initMJComponet() {
        return require("mjComponentValue").jsmj;
    }
});

module.exports = {
    DeskEvent: base_mj_desk_data.DeskEvent,
    DeskED: base_mj_desk_data.DeskED,
    DeskData: JSMJDeskData,
};