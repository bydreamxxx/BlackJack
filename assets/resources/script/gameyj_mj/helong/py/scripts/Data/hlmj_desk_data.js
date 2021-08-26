var base_mj_desk_data = require("base_mj_desk_data");

var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var HuType = require('jlmj_define').HuType;
var pai3d_value = require("jlmj_pai3d_value");
var BaipaiType = require("jlmj_baipai_data").BaipaiType;

var HLMJDeskData = cc.Class({
    extends: base_mj_desk_data.DeskData,

    properties: {

    },

    statics: {

        Instance: function () {
            if (!this.s_desk) {
                this.s_desk = new HLMJDeskData();
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

    ctor() {
        this.fenzhanglimit = this.userCountLimit == 4 ? 20 : 15;
    },

    clear() {
        this._super();
        this.fenzhanglimit = this.userCountLimit == 4 ? 20 : 15;
    },

    setRemainCard(cardNum) {
        this.fenzhanglimit = this.userCountLimit == 4 ? 20 : 15;

        let relChuPai = 0;
        this.require_playerMgr.Instance().getPlayerList().forEach((player) => {
            if (player) {
                for (let i = 0; i < player.baipai_data_list.length; i++) {
                    if (player.baipai_data_list[i].type == BaipaiType.DIANGANG || player.baipai_data_list[i].type == BaipaiType.ANGANG || player.baipai_data_list[i].type == BaipaiType.ZFBG || player.baipai_data_list[i].type == BaipaiType._FG || player.baipai_data_list[i].type == BaipaiType._19G1 || player.baipai_data_list[i].type == BaipaiType.BAGANG) {
                        relChuPai++;//杠牌是从14张分张牌堆里取出的，不算在内
                    }

                }
            }
        });
        this.fenzhanglimit -= relChuPai;
        if (this.fenzhanglimit > 14) {
            this.fenzhanglimit = 14;
        }
        let limit = this.userCountLimit;
        if (this.fenzhanglimit <= limit) {
            this.fenzhanglimit = limit;
        }
        this._super(cardNum);
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
        return 136;
    },

    isFriend: function () {
        var g_id = RoomMgr.Instance().gameId == cc.dd.Define.GameType.HLMJ_FRIEND;
        var c_name = cc.dd.SceneManager.getCurrScene().name == cc.dd.Define.GameId[cc.dd.Define.GameType.HLMJ_FRIEND];
        return g_id && c_name;
    },

    isReplay: function () {
        var g_id = RoomMgr.Instance().gameId == cc.dd.Define.GameType.HLMJ_FRIEND;
        var c_name = cc.dd.SceneManager.getCurrScene().name == 'hlmj_replay_game';
        return g_id && c_name;
    },

    isJBC: function () {
        var g_id = RoomMgr.Instance().gameId == cc.dd.Define.GameType.HLMJ_GOLD;
        var c_name = cc.dd.SceneManager.getCurrScene().name == cc.dd.Define.GameId[cc.dd.Define.GameType.HLMJ_GOLD];
        return g_id && c_name;
    },

    isMatch: function () {
        var g_id = RoomMgr.Instance().gameId == cc.dd.Define.GameType.HLMJ_MATCH;
        var c_name = cc.dd.SceneManager.getCurrScene().name == cc.dd.Define.GameId[cc.dd.Define.GameType.HLMJ_MATCH];
        return g_id && c_name;
    },

    isInMaJiang: function () {
        let scenename = cc.dd.SceneManager.getCurrScene().name;
        if (scenename == cc.dd.Define.GameId[cc.dd.Define.GameType.HLMJ_GOLD] || scenename == cc.dd.Define.GameId[cc.dd.Define.GameType.HLMJ_FRIEND] || scenename == 'hlmj_replay_game' || cc.dd.Define.GameId[cc.dd.Define.GameType.HLMJ_MATCH]) {
            return true
        } else {
            return false;
        }
    },

    getHuList() {
        var huInfoList = [];    //索引越大,优先级越大
        huInfoList.push({ type: HuType.PING_HU, ani: ['hu', 'huXS'], audio: 'dianpao_hu' });           //平胡
        huInfoList.push({ type: HuType.JIA_HU, ani: ['hu', 'huXS'], audio: 'dianpao_hu' });         //夹胡
        huInfoList.push({ type: HuType.BIAN_HU, ani: ['hu', 'huXS'], audio: 'dianpao_hu' });        //边胡

        huInfoList.push({ type: HuType.HUN_YI_SE, ani: ['hu', 'huXS'], audio: 'dianpao_hu' });     //混一色
        huInfoList.push({ type: HuType.QING_YI_SE, ani: ['qingyise'], audio: 'dianpao_hu' });     //清一色
        huInfoList.push({ type: HuType.PIAO_HU, ani: ['animation'], audio: 'dianpao_hu' });        //飘胡
        huInfoList.push({ type: HuType.QI_DUI, ani: ['hu', 'huXS'], audio: 'dianpao_hu' });         //七对
        huInfoList.push({ type: HuType.HAO_QI, ani: ['hu', 'huXS'], audio: 'dianpao_hu' });         //豪七

        huInfoList.push({ type: HuType.QIANG_HU, ani: ['qiangganghu', 'qiangganghuXS'], audio: 'dianpao_hu' });//抢杠胡
        huInfoList.push({ type: HuType.GANG_PAO_HU, ani: ['hu', 'huXS'], audio: 'dianpao_hu' });//杠上炮

        huInfoList.push({ type: HuType.ZI_MO, ani: ['zimo', 'zimoXS'], audio: 'zimo' });          //自摸
        huInfoList.push({ type: HuType.MO_BAO, ani: ['loubao'], audio: 'mobao' });         //摸宝
        huInfoList.push({ type: HuType.DUI_BAO, ani: ['duibao'], audio: 'duibao' });        //对宝
        return huInfoList;
    },

    getZimoList() {
        var zimoHuList = [];
        zimoHuList.push({ type: HuType.ZI_MO, ani: ['zimo', 'zimoXS'], audio: 'zimo' });          //自摸
        zimoHuList.push({ type: HuType.HUN_YI_SE, ani: ['zimo', 'zimoXS'], audio: 'zimo' });     //混一色
        zimoHuList.push({ type: HuType.QING_YI_SE, ani: ['qingyise'], audio: 'zimo' });     //清一色
        zimoHuList.push({ type: HuType.PIAO_HU, ani: ['animation'], audio: 'zimo' });        //飘胡
        zimoHuList.push({ type: HuType.QI_DUI, ani: ['zimo', 'zimoXS'], audio: 'zimo' });         //七对
        zimoHuList.push({ type: HuType.HAO_QI, ani: ['zimo', 'zimoXS'], audio: 'zimo' });         //豪七
        zimoHuList.push({ type: HuType.GANG_HUA_HU, ani: ['zimo', 'zimoXS'], audio: 'zimo' });         //杠上花
        zimoHuList.push({ type: HuType.HAIDI_LAO, ani: ['zimo', 'zimoXS'], audio: 'zimo' });         //海底捞

        return zimoHuList;
    },

    getHuAnimInfo: function (huType, isZimo) {
        switch (huType) {
            case HuType.PING_HU:
            case HuType.JIA_HU:
            case HuType.BIAN_HU:
            case HuType.HUN_YI_SE:
            case HuType.QI_DUI:
            case HuType.HAO_QI:
            case HuType.GANG_PAO_HU:
                if (isZimo) {
                    return 'dgpt_ani';
                } else {
                    return 'cpgtgh_ani';
                }
            case HuType.ZI_MO:
            case HuType.HUN_YI_SE:
            case HuType.QI_DUI:
            case HuType.HAO_QI:
            case HuType.GANG_HUA_HU:
            case HuType.HAIDI_LAO:
                return 'dgpt_ani';
            case HuType.MO_BAO:
            case HuType.DUI_BAO:
            case HuType.QING_YI_SE:
                return 'qys_ani';
            case HuType.PIAO_HU:
                return 'piaohu_ani';
            default:
                return null;
        }
    },

    initMJComponet() {
        return require("mjComponentValue").hlmj;
    }
});

module.exports = {
    DeskEvent: base_mj_desk_data.DeskEvent,
    DeskED: base_mj_desk_data.DeskED,
    DeskData: HLMJDeskData,
};