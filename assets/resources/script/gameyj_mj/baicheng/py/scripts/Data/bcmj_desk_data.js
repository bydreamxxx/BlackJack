var base_mj_desk_data = require("base_mj_desk_data");

var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var HuType = require('jlmj_define').HuType;
var pai3d_value = require("jlmj_pai3d_value");

var BCMJDeskData = cc.Class({
    extends: base_mj_desk_data.DeskData,

    properties: {

    },

    statics: {

        Instance: function () {
            if (!this.s_desk) {
                this.s_desk = new BCMJDeskData();
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
        this.liangPaiList = [];
    },

    clear: function () {
        this._super();
        this.is_genzhuang = false;
        this.liangPaiList = [];
    },

    setDeskRule: function (msg, gamestatus) {
        if (!msg)
            return;
        this._super(msg, gamestatus);

        let rule = msg.createcfg;
        if (!rule) {
            for (let k in msg.rule) {
                if (msg.rule[k]) {
                    rule = msg.rule[k];
                    break;
                }
            }
        }
        this.isXiaoJiFeiDan = rule.reservedList[2] === 'true';
    },

    /**
     * 是否还有剩余牌
     * @returns {boolean}
     */
    hasRemainPai: function () {
        return this.remainCards > this.require_playerMgr.Instance().playerList.length;
    },
    getMJRemainCard() {
        // 还剩几张麻将牌
        return 120;
    },

    isFriend: function () {
        var g_id = RoomMgr.Instance().gameId == cc.dd.Define.GameType.BCMJ_FRIEND;
        var c_name = cc.dd.SceneManager.getCurrScene().name == cc.dd.Define.GameId[cc.dd.Define.GameType.BCMJ_FRIEND];
        return g_id && c_name;
    },

    isReplay: function () {
        var g_id = RoomMgr.Instance().gameId == cc.dd.Define.GameType.BCMJ_FRIEND;
        var c_name = cc.dd.SceneManager.getCurrScene().name == 'bcmj_replay_game';
        return g_id && c_name;
    },

    isJBC: function () {
        var g_id = RoomMgr.Instance().gameId == cc.dd.Define.GameType.BCMJ_GOLD;
        var c_name = cc.dd.SceneManager.getCurrScene().name == cc.dd.Define.GameId[cc.dd.Define.GameType.BCMJ_GOLD];
        return g_id && c_name;
    },

    isMatch: function () {
        var g_id = RoomMgr.Instance().gameId == cc.dd.Define.GameType.BCMJ_MATCH;
        var c_name = cc.dd.SceneManager.getCurrScene().name == cc.dd.Define.GameId[cc.dd.Define.GameType.BCMJ_MATCH];
        return g_id && c_name;
    },

    isInMaJiang: function () {
        let scenename = cc.dd.SceneManager.getCurrScene().name;
        if (scenename == cc.dd.Define.GameId[cc.dd.Define.GameType.BCMJ_GOLD] || scenename == cc.dd.Define.GameId[cc.dd.Define.GameType.BCMJ_FRIEND] || scenename == 'bcmj_replay_game' || cc.dd.Define.GameId[cc.dd.Define.GameType.BCMJ_MATCH]) {
            return true
        } else {
            return false;
        }
    },

    getHuList() {
        var huInfoList = [];    //索引越大,优先级越大
        huInfoList.push({ type: HuType.PING_HU, ani: ['hu', 'huXS'], audio: 'dianpao_hu' });           //平胡
        huInfoList.push({ type: HuType.JIA_HU, ani: ['jiahu', 'jiahuXS'], audio: 'dianpao_hu' });         //夹胡
        huInfoList.push({ type: HuType.BIAN_HU, ani: ['bianhu', 'bianhuXS'], audio: 'dianpao_hu' });        //边胡
        huInfoList.push({ type: HuType.XIAO_SA, ani: ['hu', 'huXS'], audio: 'dianpao_hu' });        //鸡胡
        huInfoList.push({ type: HuType.JIA5_HU, ani: ['hu', 'huXS'], audio: 'dianpao_hu' });//夹五

        huInfoList.push({ type: HuType.QING_YI_SE, ani: ['qingyise'], audio: 'dianpao_hu' });     //清一色
        huInfoList.push({ type: HuType.PIAO_HU, ani: ['animation'], audio: 'dianpao_hu' });        //双飘
        huInfoList.push({ type: HuType.GANG_PAO_HU, ani: ['animation'], audio: 'dianpao_hu' });//鸡飘
        huInfoList.push({ type: HuType.DANDIAO_PIAOHU, ani: ['animation'], audio: 'dianpao_hu' });//单飘
        huInfoList.push({ type: HuType.QIANG_HU, ani: ['qiangganghu', 'qiangganghuXS'], audio: 'dianpao_hu' });//抢杠胡

        huInfoList.push({ type: HuType.ZI_MO, ani: ['zimo', 'zimoXS'], audio: 'zimo' });          //自摸
        huInfoList.push({ type: HuType.MO_BAO, ani: ['loubao'], audio: 'mobao' });         //摸宝
        huInfoList.push({ type: HuType.DUI_BAO, ani: ['duibao'], audio: 'duibao' });        //对宝
        huInfoList.push({ type: HuType.TIAN_HU, ani: ['tianhu'], audio: 'zimo' });        //天胡
        return huInfoList;
    },

    getZimoList() {
        var zimoHuList = [];
        zimoHuList.push({ type: HuType.ZI_MO, ani: ['zimo', 'zimoXS'], audio: 'zimo' });          //自摸
        zimoHuList.push({ type: HuType.QING_YI_SE, ani: ['qingyise'], audio: 'zimo' });     //清一色
        zimoHuList.push({ type: HuType.PIAO_HU, ani: ['animation'], audio: 'zimo' });        //双飘
        zimoHuList.push({ type: HuType.GANG_PAO_HU, ani: ['animation'], audio: 'zimo' });//鸡飘
        zimoHuList.push({ type: HuType.DANDIAO_PIAOHU, ani: ['animation'], audio: 'zimo' });//单飘
        zimoHuList.push({ type: HuType.TIAN_HU, ani: ['tianhu'], audio: 'zimo' });        //天胡
        return zimoHuList;
    },

    getHuAnimInfo: function (huType, isZimo) {
        switch (huType) {
            case HuType.PING_HU:
            case HuType.JIA_HU:
            case HuType.JIA5_HU:
            case HuType.BIAN_HU:
            case HuType.XIAO_SA:
                if (isZimo) {
                    return 'dgpt_ani';
                } else {
                    return 'cpgtgh_ani';
                }
            case HuType.ZI_MO:
                return 'dgpt_ani';
            case HuType.PIAO_HU:
            case HuType.GANG_PAO_HU:
            case HuType.DANDIAO_PIAOHU:
                return 'piaohu';
            case HuType.MO_BAO:
            case HuType.DUI_BAO:
            case HuType.TIAN_HU:
            case HuType.QING_YI_SE:
                return 'qys_ani';
            default:
                return null;
        }
    },

    isLiangPai: function (id) {
        let result = false;
        let pai = Math.floor(id / 4);
        if (this.liangPaiList.length > 0) {
            for (let i = 0; i < this.liangPaiList.length; i++) {
                let baopai = this.liangPaiList[i];
                if (baopai >= 0) {
                    let des = Math.floor(baopai / 4);
                    if (des === pai) {
                        result = true;
                        break;
                    }
                }
            }
        }
        return result;
    },

    /**
     * 设置宝牌
     * @param baoPaiValue 宝牌的值
     */
    setBaoPai: function (baoPaiValue) {
        this.unBaopai = baoPaiValue;
        cc.log("setBaoPai 宝牌值:", baoPaiValue);
        if (this.liangPaiList.indexOf(this.unBaopai) == -1) {
            this.liangPaiList.push(baoPaiValue);
        }
    },

    initMJComponet() {
        return require("mjComponentValue").bcmj;
    }
});

module.exports = {
    DeskEvent: base_mj_desk_data.DeskEvent,
    DeskED: base_mj_desk_data.DeskED,
    DeskData: BCMJDeskData,
};