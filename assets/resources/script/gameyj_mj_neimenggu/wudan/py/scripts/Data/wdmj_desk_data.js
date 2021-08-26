var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var base_mj_desk_data = require("base_mj_desk_data");
var HuType = require('jlmj_define').HuType;
var pai3d_value = require("jlmj_pai3d_value");

var WDMJDeskData = cc.Class({
    extends: base_mj_desk_data.DeskData,

    properties: {

    },

    statics: {

        Instance: function () {
            if (!this.s_desk) {
                this.s_desk = new WDMJDeskData();
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
     * 设置是否有连庄
     */
    setLianzhuang: function (userID) {
        if (userID > 0) {
            var player = this.require_playerMgr.Instance().getPlayer(userID);
            if (player) {
                var str = cc.dd.Text.TEXT_DESK_INFO_2.format([cc.dd.Utils.substr(player.nickname, 0, 5)]);
                base_mj_desk_data.DeskED.notifyEvent(base_mj_desk_data.DeskEvent.TIPS_POP, [str, player]);
            }
        }
    },

    isHunPai: function (id) {
        let des = pai3d_value.desc[id].split('[')[0];
        return des == this.hunPai;
    },

    /**
     * 设置宝牌
     * @param baoPaiValue 宝牌的值
     */
    setBaoPai: function (baoPaiValue) {
        this.unBaopai = baoPaiValue;
        if (this.unBaopai >= 0) {
            let des = pai3d_value.desc[this.unBaopai].split('[')[0];
            this.hunPai = this.getHunPaiStr(des[0]);
            if (des.length == 2) {
                this.hunPai += des[1];
            }
        }
        cc.log("亮牌值:", baoPaiValue, "混牌 ", this.hunPai);
        // DeskED.notifyEvent(DeskEvent.UPDATE_BAO_PAI, []);
    },

    getHunPaiID() {
        switch (this.hunPai) {
            case '东':
                return 120;
            case '南':
                return 124;
            case '西':
                return 128;
            case '北':
                return 132;
            case '中':
                return 108;
            case '发':
                return 112;
            case '白':
                return 116;
            case '一筒':
                return 0;
            case '二筒':
                return 4;
            case '三筒':
                return 8;
            case '四筒':
                return 12;
            case '五筒':
                return 16;
            case '六筒':
                return 20;
            case '七筒':
                return 24;
            case '八筒':
                return 28;
            case '九筒':
                return 32;
            case '一条':
                return 36;
            case '二条':
                return 40;
            case '三条':
                return 44;
            case '四条':
                return 48;
            case '五条':
                return 52;
            case '六条':
                return 56;
            case '七条':
                return 60;
            case '八条':
                return 64;
            case '九条':
                return 68;
            case '一万':
                return 72;
            case '二万':
                return 76;
            case '三万':
                return 80;
            case '四万':
                return 84;
            case '五万':
                return 88;
            case '六万':
                return 92;
            case '七万':
                return 96;
            case '八万':
                return 100;
            case '九万':
                return 104;
        }
    },

    getHunPaiStr(str) {
        switch (str) {
            case '一':
                return '二';
            case '二':
                return '三';
            case '三':
                return '四';
            case '四':
                return '五';
            case '五':
                return '六';
            case '六':
                return '七';
            case '七':
                return '八';
            case '八':
                return '九';
            case '九':
                return '一';
            case '东':
                return '南';
            case '南':
                return '西';
            case '西':
                return '北';
            case '北':
                return '中';
            case '中':
                return '发';
            case '发':
                return '白';
            case '白':
                return '东';
        }
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
        return 144;
    },

    isFriend: function () {
        var g_id = RoomMgr.Instance().gameId == cc.dd.Define.GameType.WDMJ_FRIEND;
        var c_name = cc.dd.SceneManager.getCurrScene().name == cc.dd.Define.GameId[cc.dd.Define.GameType.WDMJ_FRIEND];
        return g_id && c_name;
    },

    isReplay: function () {
        var g_id = RoomMgr.Instance().gameId == cc.dd.Define.GameType.WDMJ_FRIEND;
        var c_name = cc.dd.SceneManager.getCurrScene().name == 'wdmj_replay_game';
        return g_id && c_name;
    },

    isJBC: function () {
        var g_id = RoomMgr.Instance().gameId == cc.dd.Define.GameType.WDMJ_GOLD;
        var c_name = cc.dd.SceneManager.getCurrScene().name == cc.dd.Define.GameId[cc.dd.Define.GameType.WDMJ_GOLD];
        return g_id && c_name;
    },

    isMatch: function () {
        var g_id = RoomMgr.Instance().gameId == cc.dd.Define.GameType.WDMJ_MATCH;
        var c_name = cc.dd.SceneManager.getCurrScene().name == cc.dd.Define.GameId[cc.dd.Define.GameType.WDMJ_MATCH];
        return g_id && c_name;
    },

    isInMaJiang: function () {
        let scenename = cc.dd.SceneManager.getCurrScene().name;
        if (scenename == cc.dd.Define.GameId[cc.dd.Define.GameType.WDMJ_GOLD] || scenename == cc.dd.Define.GameId[cc.dd.Define.GameType.WDMJ_FRIEND] || scenename == 'wdmj_replay_game' || cc.dd.Define.GameId[cc.dd.Define.GameType.WDMJ_MATCH]) {
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
        huInfoList.push({ type: HuType.HUN_YI_SE, audio: ['dianpao1', 'hu1', 'hu2', 'hu3'] });           //混一色
        huInfoList.push({ type: HuType.QING_MO, audio: ['dianpao1', 'hu1', 'hu2', 'hu3'] });           //清摸
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
        zimoHuList.push({ type: HuType.HUN_YI_SE, audio: ['zimo1', 'zimo2'] });           //混一色
        zimoHuList.push({ type: HuType.QING_MO, audio: ['zimo1', 'zimo2'] });           //清摸
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
            case HuType.QING_MO:
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
            case HuType.QING_YI_SE:
                return 'piaohu_ani_2_qingyise';
            case HuType.HUN_YI_SE:
                return 'piaohu_ani_2_hunyise';
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
        return require("mjComponentValue").wdmj;
    }
});

module.exports = {
    DeskEvent: base_mj_desk_data.DeskEvent,
    DeskED: base_mj_desk_data.DeskED,
    DeskData: WDMJDeskData,
};