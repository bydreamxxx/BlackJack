var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var base_mj_desk_data = require("base_mj_desk_data");
var HuType = require('jlmj_define').HuType;

var PZMJDeskData = cc.Class({
    extends: base_mj_desk_data.DeskData,

    properties: {

    },

    statics: {

        Instance: function () {
            if (!this.s_desk) {
                this.s_desk = new PZMJDeskData();
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
        return this.remainCards > (16 + this.require_playerMgr.Instance().playerList.length);
    },

    /**
     * 设置默认麻将牌数
     */
    getMJRemainCard() {
        // 还剩几张麻将牌
        return 136;
    },

    isFriend: function () {
        var g_id = RoomMgr.Instance().gameId == cc.dd.Define.GameType.PZMJ_FRIEND;
        var c_name = cc.dd.SceneManager.getCurrScene().name == cc.dd.Define.GameId[cc.dd.Define.GameType.PZMJ_FRIEND];
        return g_id && c_name;
    },

    isReplay: function () {
        var g_id = RoomMgr.Instance().gameId == cc.dd.Define.GameType.PZMJ_FRIEND;
        var c_name = cc.dd.SceneManager.getCurrScene().name == 'pzmj_replay_game';
        return g_id && c_name;
    },

    isJBC: function () {
        var g_id = RoomMgr.Instance().gameId == cc.dd.Define.GameType.PZMJ_GOLD;
        var c_name = cc.dd.SceneManager.getCurrScene().name == cc.dd.Define.GameId[cc.dd.Define.GameType.PZMJ_GOLD];
        return g_id && c_name;
    },

    isMatch: function () {
        var g_id = RoomMgr.Instance().gameId == cc.dd.Define.GameType.PZMJ_MATCH;
        var c_name = cc.dd.SceneManager.getCurrScene().name == cc.dd.Define.GameId[cc.dd.Define.GameType.PZMJ_MATCH];
        return g_id && c_name;
    },

    isInMaJiang: function () {
        let scenename = cc.dd.SceneManager.getCurrScene().name;
        if (scenename == cc.dd.Define.GameId[cc.dd.Define.GameType.PZMJ_GOLD] || scenename == cc.dd.Define.GameId[cc.dd.Define.GameType.PZMJ_FRIEND] || scenename == 'pzmj_replay_game' || cc.dd.Define.GameId[cc.dd.Define.GameType.PZMJ_MATCH]) {
            return true
        } else {
            return false;
        }
    },

    getHuList() {
        var huInfoList = [];    //索引越大,优先级越大
        huInfoList.push({ type: HuType.PING_HU, audio: ['dianpao1', 'hu1', 'hu2', 'hu3'] });           //平胡
        huInfoList.push({ type: HuType.JIA_HU, audio: ['jiahu1', 'jiahu2'] });         //夹胡
        huInfoList.push({ type: HuType.BIAN_HU, audio: ['hu1', 'hu2', 'hu3'] });        //边胡
        huInfoList.push({ type: HuType.QING_YI_SE, audio: ['qingyise1', 'qingyise2'] });     //清一色
        huInfoList.push({ type: HuType.PIAO_HU, audio: 'piaohu' });        //飘胡
        huInfoList.push({ type: HuType.QI_DUI, audio: '7dui' });         //七对
        huInfoList.push({ type: HuType.HAO_QI, audio: 'hh7dui' });         //豪七
        huInfoList.push({ type: HuType.ZHIZUN_HAO_QI, audio: 'hh7dui' });         //至尊豪七
        huInfoList.push({ type: HuType.GANG_HUA_HU, audio: 'gangkai' });          //杠上花
        huInfoList.push({ type: HuType.GANG_PAO_HU, audio: ['hu1', 'hu2', 'hu3'] });          //杠上炮
        huInfoList.push({ type: HuType.ZI_MO, audio: ['zimo1', 'zimo2'] });          //自摸
        huInfoList.push({ type: HuType.HAIDI_LAO, audio: ['hu1', 'hu2', 'hu3'] });          //一条龙
        huInfoList.push({ type: HuType.HAIDI_PAO, audio: '13yao' });          //十三幺
        return huInfoList;
    },

    getZimoList() {
        var zimoHuList = [];
        zimoHuList.push({ type: HuType.ZI_MO, audio: ['zimo1', 'zimo2'] });          //自摸
        zimoHuList.push({ type: HuType.JIA_HU, audio: ['zimojia1', 'zimojia2', 'zimojia3', 'zimojia4'] });         //夹胡
        zimoHuList.push({ type: HuType.QING_YI_SE, audio: ['qingyise1', 'qingyise2'] });     //清一色
        zimoHuList.push({ type: HuType.PIAO_HU, audio: 'piaohu' });        //飘胡
        zimoHuList.push({ type: HuType.QI_DUI, audio: '7dui' });
        zimoHuList.push({ type: HuType.HAO_QI, audio: 'hh7dui' });         //豪七
        zimoHuList.push({ type: HuType.ZHIZUN_HAO_QI, audio: 'hh7dui' });         //至尊豪七
        zimoHuList.push({ type: HuType.HAIDI_LAO, audio: ['zimo1', 'zimo2'] });          //一条龙
        zimoHuList.push({ type: HuType.GANG_HUA_HU, audio: 'gangkai' });          //杠上花
        zimoHuList.push({ type: HuType.GANG_PAO_HU, audio: ['zimo1', 'zimo2'] });          //杠上炮
        zimoHuList.push({ type: HuType.HAIDI_PAO, audio: '13yao' });          //十三幺
        return zimoHuList;
    },

    getHuAnimInfo: function (type, isZimo) {
        switch (type) {
            case HuType.PING_HU:
            case HuType.JIA_HU:
            case HuType.BIAN_HU:
            case HuType.HAIDI_LAO:
            case HuType.ZI_MO:
            case HuType.QING_YI_SE:
                return 'hu_ani';
            case HuType.GANG_PAO_HU:
                return 'gangshangpao_ani';
            case HuType.GANG_HUA_HU:
                return 'gangshanghua_ani';
            case HuType.QI_DUI:
                return 'qidui_ani';
            case HuType.HAO_QI:
            case HuType.ZHIZUN_HAO_QI:
                return 'haoqidui_ani';
            case HuType.PIAO_HU:
                return 'piaohu_ani_2';
            case HuType.HAIDI_PAO:
                return 'shisanyao_ani';
            default:
                return null;
        }
    },

    getIs2D() {
        let use2D = cc.sys.localStorage.getItem(cc.dd.user.id + '_chifeng_use2D');

        if (!cc.dd._.isString(use2D) || use2D == '') {
            use2D = 'true';
            cc.sys.localStorage.setItem(cc.dd.user.id + '_chifeng_use2D', use2D);
        }

        if (!cc.dd.mj_current_2d) {
            cc.dd.mj_current_2d = cc.dd._.isNull(use2D) ? 'true' : use2D;
        }

        if (cc.dd.mj_change_2d_next_time) {
            return cc.dd.mj_current_2d === 'true';
        } else {
            return use2D === 'true';
        }
    },

    get2DPai() {
        let pai2D = cc.sys.localStorage.getItem(cc.dd.user.id + '_chifeng_pai2D');
        if (cc.dd._.isString(pai2D) && pai2D != '') {
            return pai2D;
        } else {
            return 'blue';
        }
    },
    // update (dt) {},

    initMJComponet() {
        return require("mjComponentValue").pzmj;
    }
});

module.exports = {
    DeskEvent: base_mj_desk_data.DeskEvent,
    DeskED: base_mj_desk_data.DeskED,
    DeskData: PZMJDeskData,
};