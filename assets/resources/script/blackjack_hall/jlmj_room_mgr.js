/**
 * Created by yons on 2017/5/25.
 */

var dd = cc.dd;
var ED = require("EventDispatcher");
var Define = require("Define");
/**
 * 事件类型
 */
var RoomEvent = cc.Enum({
    room_create_room: 'room_create_room',           //创建房间
    room_enter_room: 'room_enter_room',           //进入房间
    room_player_enter: 'room_player_enter',           //玩家进入
    room_player_exit: 'room_player_exit',           //玩家退出
    room_player_ready: 'room_player_ready',           //玩家准备
    room_player_online: 'room_player_online',           //玩家在线离线
    room_recover: 'room_recover',           //房间恢复


    on_room_create: "on_room_create", //创建房间成功
    on_room_enter: "on_room_enter", //进入房间
    on_room_join: "on_room_join", //加入房间成功
    on_room_leave: "on_room_leave", //离开房间成功
    on_player_stand: "on_player_stand",//玩家站起
    on_room_leave_plan: 'on_room_leave_plan',//下局离开(部分金币场)
    on_room_ready: "on_room_ready", //准备房间成功
    on_room_player_online: "on_room_player_online", // 玩家在线离线
    on_room_replace: "on_room_replace", //换桌成功
    on_room_game_start: "on_room_game_start", //房间游戏开始

    player_signal_state: 'player_signal_state',  //玩家信号状态
    update_player_location: 'update_player_location',//玩家位置更新

    on_coin_room_enter: "on_coin_room_enter", // 金币场进入房间成功

    update_poker_back: 'update_poker_back',      //更新牌背面

    on_choose_seat: 'on_choose_seat', //选择座位

    check_is_in_game: 'check_is_in_game', //对还在游戏房间里面的进行处理

    room_create_by_self: 'room_create_by_self', //自建房列表发送

    daikai_list_ret: 'daikai_room_list', //代开列表
});

/**
 * 事件管理
 */
var RoomED = new ED;

var RoomMgr = cc.Class({

    s_roomMgr: null,

    statics: {

        Instance: function () {
            if (!this.s_roomMgr) {
                this.s_roomMgr = new RoomMgr();
            }
            return this.s_roomMgr;
        },

        Destroy: function () {
            if (this.s_roomMgr) {
                this.s_roomMgr.clear();
                this.s_roomMgr = null;
            }
        },

    },

    ctor: function () {
        /**
         * 朋友场:1 金币场:2 比赛场:3
         * @type {number}
         */
        this.roomType = 1;
        //游戏是否已经开始
        this.gameStart = false;

        /**
         * 根据cc.dd.CheckGames里的方法自动生成自己的方法
         */
        for (let k in cc.dd.CheckGames) {
            if (cc.dd.CheckGames.hasOwnProperty(k)) {
                this[k] = () => {
                    return cc.dd.CheckGames[k](this.gameId);
                }
            }
        }
    },


    /**
     * 清理房间管理器
     * 退出子游戏时,需要调用此接口
     */
    clear: function () {
        /**
         * 朋友场:1 金币场:2 比赛场:3
         * @type {number}
         */
        this.roomType = 1;
        //游戏是否已经开始
        this.gameStart = false;
        //置空玩家管理器
        this.player_mgr = null;
    },

    clearClubId() {
        this.clubId = 0;
    },

    setGameRuleByType: function (msg) {
        switch (this.gameId) {
            case Define.GameType.JLMJ_FRIEND:
                this._Rule = msg.rule.mjJilinRule;
                if (!this._Rule.reservedList || this._Rule.reservedList.length == 0) {
                    switch (this._Rule.guangguotype) {
                        case 0:
                            this._Rule.fengding = 16;
                            break;
                        case 1:
                        case 3:
                            this._Rule.fengding = 32;
                            break;
                        case 2:
                        case 4:
                            this._Rule.fengding = 64;
                            break;
                    }
                } else {
                    this._Rule.fengding = parseInt(this._Rule.reservedList[0]);
                }
                break;
            case Define.GameType.TDK_FRIEND:
            case Define.GameType.TDK_FRIEND_LIU:
                this._Rule = msg.rule.tdkRule;
                break;
            case Define.GameType.CCMJ_FRIEND:
                this._Rule = msg.rule.mjChangchunRule;
                this._Rule.ismingdanzhanli = this._Rule.reservedList[0] === 'true';
                this._Rule.islixiantuoguan = this._Rule.reservedList[1] === 'true' ? '45' : this._Rule.reservedList[1];
                break;
            case Define.GameType.SDY_FRIEND:
                this._Rule = msg.rule.sdyRule;
                break;
            case Define.GameType.DDZ_FRIEND:
                this._Rule = msg.rule.ddzRule;
                break;
            case Define.GameType.NN_FRIEND:
                this._Rule = msg.rule.psRule;
                break;
            case Define.GameType.NN_JLB:
                this._Rule = msg.rule.jlbPsRule;
                break;
            case Define.GameType.NAMJ_FRIEND:
                this._Rule = msg.rule.mjNonganRule;
                break;
            case Define.GameType.PAOYAO_FRIEND:
                this._Rule = msg.rule.pyRule;
                break;
            case Define.GameType.GDY_FRIEND:
                this._Rule = msg.rule.gdyRule;
                break;
            case Define.GameType.FXMJ_FRIEND:
                this._Rule = msg.rule.mjFuxinRule;
                break;
            case Define.GameType.DSZ_FRIEND:
                this._Rule = msg.rule.pin3Rule
                break;
            case Define.GameType.SYMJ_FRIEND:
                this._Rule = msg.rule.mjSongyuanRule;
                break;
            case Define.GameType.JZMJ_FRIEND:
                this._Rule = msg.rule.mjJinzhouRuleNew;
                break;
            case Define.GameType.HSMJ_FRIEND:
                this._Rule = msg.rule.mjHeishanRule;
                break;
            case Define.GameType.SH_FRIEND:
                this._Rule = msg.rule.suohaRule;
                break;
            case Define.GameType.XZMJ_FRIEND:
            case Define.GameType.XLMJ_FRIEND:
                this._Rule = msg.rule.mjXuezhanRule;
                this._Rule.issanfang = this._Rule.reservedList[0] === 'true';
                this._Rule.isdiangangzimo = this._Rule.reservedList[1] === 'true';
                this._Rule.hujiaozhuanyizhuangen = this._Rule.reservedList[2] === 'true';
                this._Rule.duiduihu3fan = this._Rule.reservedList[3] === 'true';
                this._Rule.huan4zhang = this._Rule.reservedList[4] === 'true';
                this._Rule.jiaxinwu = this._Rule.reservedList[5] === 'true';
                this._Rule.yitiaolong = this._Rule.reservedList[6] === 'true';
                break;
            case Define.GameType.SHMJ_FRIEND:
                this._Rule = msg.rule.mjSuihuaRule;
                this._Rule.isqingyise = this._Rule.reservedList[0] === 'true';
                this._Rule.ishaoqi = this._Rule.reservedList[1] === 'true';
                this._Rule.isqiduifeng = this._Rule.reservedList[2] === 'true';
                this._Rule.meting = this._Rule.reservedList[3] === 'true';
                break;
            case Define.GameType.TDHMJ_FRIEND:
                this._Rule = msg.rule.mjNeimengguRule;
                break;
            case Define.GameType.CFMJ_FRIEND:
                this._Rule = msg.rule.mjChifengRule;
                break;
            case Define.GameType.AHMJ_FRIEND:
                this._Rule = msg.rule.mjAohanRule;
                break;
            case Define.GameType.FZMJ_FRIEND:
                this._Rule = msg.rule.mjFangzhengRule;
                this._Rule.isnormalxi = this._Rule.reservedList[0] === 'true';
                this._Rule.notong = this._Rule.reservedList[1] === 'true';
                this._Rule.isliangxikaimen = this._Rule.reservedList[2] === 'true';
                break;
            case Define.GameType.WDMJ_FRIEND:
                this._Rule = msg.rule.mjWudanRule;
                break;
            case Define.GameType.PZMJ_FRIEND:
                this._Rule = msg.rule.mjPingzhuangRule;
                break;
            case Define.GameType.BCMJ_FRIEND:
                this._Rule = msg.rule.mjBaichengRule;
                this._Rule.iszangang = this._Rule.reservedList[0] === 'true';
                this._Rule.isgangjiafan = this._Rule.reservedList[1] === 'true';
                this._Rule.isxiaojifeidan = this._Rule.reservedList[2] === 'true';
                let fengding = parseInt(this._Rule.reservedList[3]);
                this._Rule.fengding = cc.dd._.isNumber(fengding) && !isNaN(fengding) ? fengding : 1;
                break;
            case Define.GameType.ACMJ_FRIEND:
                this._Rule = msg.rule.mjAchengRule;
                this._Rule.ishongzhongmaitianfei = this._Rule.reservedList[0] === 'true';
                this._Rule.isguadafeng = this._Rule.reservedList[1] === 'true';
                this._Rule.isduibao = this._Rule.reservedList[2] === 'true';
                this._Rule.iskaipaizha = this._Rule.reservedList[3] === 'true';
                break;
            case Define.GameType.HLMJ_FRIEND:
                this._Rule = msg.rule.mjHelongRule;
                break;
            case Define.GameType.HBSL_JBL:
                this._Rule = msg.rule.hbRule;
                break;
            case Define.GameType.NEW_DSZ_FRIEND:
            case Define.GameType.NEW_DSZ_GOLD_CREATE:
                this._Rule = msg.rule.yqPin3Rule;
                break;
            case Define.GameType.DDZ_XYPYC:
                this._Rule = msg.rule.xyDdzRule;
                break;
            case Define.GameType.PDK_FRIEND:
                this._Rule = msg.rule.paodekuaiRule;
            default:
                break;
        }
    },

    setPlayerMgr: function (msg) {
        switch (this.gameId) {
            case Define.GameType.JLMJ_FRIEND:
            case Define.GameType.JLMJ_GOLD:
                break;
            case Define.GameType.TDK_FRIEND:
            case Define.GameType.TDK_COIN:
            case Define.GameType.TDK_FRIEND_LIU:
                break;
            case Define.GameType.CCMJ_FRIEND:
            case Define.GameType.CCMJ_GOLD:
            case Define.GameType.CCMJ_MATCH:
                break;
            case Define.GameType.SDY_FRIEND:
                break;
            case Define.GameType.DDZ_FRIEND:
            case Define.GameType.DDZ_MATCH:
            case Define.GameType.DDZ_GOLD:
            case Define.GameType.DDZ_XYPYC:
                this.player_mgr = require('ddz_data').DDZ_Data.Instance();
                break;
            case Define.GameType.PDK_FRIEND:
                this.player_mgr = require('pdk_data').PDK_Data.Instance();
                break;
            case Define.GameType.PAOYAO_GOLD:
            case Define.GameType.PAOYAO_FRIEND:
                break;
            case Define.GameType.GDY_GOLD:
            case Define.GameType.GDY_FRIEND:
                break;
            case Define.GameType.NN_FRIEND:
            case Define.GameType.NN_GOLD:
            case Define.GameType.NN_JLB:
                this.player_mgr = require('nn_data').Instance();
                break;
            case Define.GameType.BRNN_GOLD:
            case Define.GameType.BRNN_JLB:
                this.player_mgr = require('brnn_data').brnn_Data.Instance();
                break;
            case Define.GameType.EBG_GOLD:
                break;
            case Define.GameType.NAMJ_FRIEND:
            case Define.GameType.NAMJ_GOLD:
                break;
            case Define.GameType.FXMJ_FRIEND:
            case Define.GameType.FXMJ_GOLD:
                break;
            case Define.GameType.DSZ_FRIEND:
            case Define.GameType.DSZ_GOLD:
                this.player_mgr = require('dsz_player_mgr').DSZ_PlayerMgr.Instance();
                break;
            case Define.GameType.SYMJ_FRIEND:
            case Define.GameType.SYMJ_GOLD:
                break;
            case Define.GameType.JZMJ_FRIEND:
            case Define.GameType.JZMJ_GOLD:
                break;
            case Define.GameType.HSMJ_FRIEND:
            case Define.GameType.HSMJ_GOLD:
                break;
            case Define.GameType.SH_FRIEND:
            case Define.GameType.SH_GOLD:
            case Define.GameType.SH_MATCH:
                break;
            case Define.GameType.XZMJ_FRIEND:
            case Define.GameType.XLMJ_FRIEND:
            case Define.GameType.XZMJ_GOLD:
            case Define.GameType.XLMJ_GOLD:
                break;
            case Define.GameType.SHMJ_FRIEND:
            case Define.GameType.SHMJ_GOLD:
                break;
            case Define.GameType.TDHMJ_FRIEND:
            case Define.GameType.TDHMJ_GOLD:
                break;
            case Define.GameType.CFMJ_FRIEND:
            case Define.GameType.CFMJ_GOLD:
                break;
            case Define.GameType.AHMJ_FRIEND:
            case Define.GameType.AHMJ_GOLD:
                break;
            case Define.GameType.FZMJ_FRIEND:
            case Define.GameType.FZMJ_GOLD:
                break;
            case Define.GameType.WDMJ_FRIEND:
            case Define.GameType.WDMJ_GOLD:
            case Define.GameType.WDMJ_MATCH:
                break;
            case Define.GameType.PZMJ_FRIEND:
            case Define.GameType.PZMJ_GOLD:
                break;
            case Define.GameType.BCMJ_FRIEND:
            case Define.GameType.BCMJ_GOLD:
                break;
            case Define.GameType.ACMJ_FRIEND:
            case Define.GameType.ACMJ_GOLD:
                break;
            case Define.GameType.HLMJ_FRIEND:
            case Define.GameType.HLMJ_GOLD:
                break;
            case Define.GameType.JSMJ_GOLD:
                break;
            case Define.GameType.HBSL_GOLD:
            case Define.GameType.HBSL_JBL:
                break;
            case Define.GameType.DT_GOLD:
                this.player_mgr = require('pk_data_mgr').PK_Data_Mgr.Instance();
                break;
            case Define.GameType.BIRDS_AND_ANIMALS:
                this.player_mgr = require('birds_and_animals_data').Birds_And_Animals_Data.Instance();
                break;
            case Define.GameType.NEW_DSZ_FRIEND:
            case Define.GameType.NEW_DSZ_GOLD_CREATE:
            case Define.GameType.NEW_DSZ_GOLD:
                this.player_mgr = require('new_dsz_player_manager').New_DSZ_PlayerMgr.Instance();
                break;
            case Define.GameType.LKFISH_GOLD:
            case Define.GameType.LKFISH_GOLD_CREATE:
                this.player_mgr = require('FishPlayerManager').CFishPlayerManager.Instance();
                break;
            case Define.GameType.DOYENFISH_GOLD:
            case Define.GameType.DOYENFISH_GOLD_CREATE:
                this.player_mgr = require('FishDoyenPlayerManager').CFishPlayerManager.Instance();
                break;
            case Define.GameType.WESTWARD_GOLd:
                this.player_mgr = require('westward_journey_data_mannager').Westward_Journey_Data.Instance();
                break;
            case Define.GameType.LUCKY_TURNTABLE:
                this.player_mgr = require('lucky_turntable_data').Lucky_Turntable_Data.Instance();
                break;
            case Define.GameType.HJSM:
                this.player_mgr = require('horse_racing_Data').Horse_Racing_Data.Instance();
                break;
            case Define.GameType.TEXAS:
                this.player_mgr = require('texas_data').texas_Data.Instance();
                break;
            case Define.GameType.MOUSE:
                break;
            case Define.GameType.BLACKJACK_GOLD:
            case Define.GameType.BLACKJACK_FRIEND:
                this.player_mgr = require('BlackJackData').BlackJackData.Instance();
                break;
            case Define.GameType.RUMMY:
                this.player_mgr = require('RummyRoomMgr');
                break;
            default:
                break;
        }
    },

    /**
     * 设置游戏通用信息
     * @param gameId    游戏id
     * @param roomId    房间id
     * @param roomerId  房主id
     * @param clubId    俱乐部id
     * @param roomType  房间类型
     */
    setGameCommonInfo: function (gameId, roomId, roomerId, clubId, roomType, multiple, deskId) {
        if (gameId) {
            this.gameId = gameId;
            cc.dd.AppCfg.GAME_ID = gameId;
        }
        if (roomId) {
            this.roomId = roomId;
        }
        if (roomerId != null) {
            this.roomerId = roomerId;
        }
        if (clubId != null) {
            this.clubId = clubId;
        }
        if (roomType) {
            this.roomType = roomType;
        }
        if (multiple != null) {
            this.multiple = multiple;
        } else {
            this.multiple = cc.dd._.isNumber(this.multiple) ? this.multiple : 1;
        }
        if (deskId != null) {
            this.deskId = deskId;
        }
    },

    setDaiKai(daiKai) {
        this.daiKai = daiKai == 2;
    },

    isDaiKai() {
        return this.daiKai;
    },

    /**
     * 是否是房主
     * @param user_id
     * @returns {boolean}
     */
    isRoomer: function (user_id) {
        // if (this.isClubRoom()) {
        //     return user_id == this.clubId;
        // } else {
        return user_id == this.roomerId;
        //}
        //return false;
    },


    getInitCoin: function (role_info) {
        var coin = role_info.coin;
        switch (this.gameId) {
            case Define.GameType.JLMJ_FRIEND:
                coin = this.getCoinByGuangGuo(this._Rule.guangguotype);
                break;
        }
        return coin;
    },

    /**
     * 获取 金币 通过 逛锅
     * @param gg
     */
    getCoinByGuangGuo: function (gd) {
        var coin = 0;
        switch (gd) {
            case Define.GuangGuoType.GD_50:
                coin = 50;
                break;
            case Define.GuangGuoType.GD_100:
                coin = 100;
                break;
            case Define.GuangGuoType.GD_200:
                coin = 200;
                break;
            case Define.GuangGuoType.GD_0_32:
            case Define.GuangGuoType.GD_0_64:
                coin = 0;
                break;
        }
        return coin;
    },

    /**
     * 是否是俱乐部房间
     * @returns {boolean}
     */
    isClubRoom: function () {
        if (cc.dd._.isUndefined(this.clubId) || cc.dd._.isNull(this.clubId) || this.clubId == 0) {
            return false;
        } else {
            return true;
        }
    },

    /**
     * 设置朋友场游戏网络处理回调对象
     * @param game_id
     */
    setPYGameNetHandler: function (game_id) {
        switch (game_id) {
            case Define.GameType.CCMJ_FRIEND:
                break;
            case Define.GameType.CCMJ_MATCH:
            case Define.GameType.CCMJ_GOLD:
                break;
            case Define.GameType.JLMJ_FRIEND:
                break;
            case Define.GameType.JLMJ_MATCH:
            case Define.GameType.JLMJ_GOLD:
                break;
            case Define.GameType.NAMJ_FRIEND:
                break;
            case Define.GameType.NAMJ_MATCH:
            case Define.GameType.NAMJ_GOLD:
                break;
            case Define.GameType.FXMJ_FRIEND:
                break;
            case Define.GameType.FXMJ_MATCH:
            case Define.GameType.FXMJ_GOLD:
                break;
            case Define.GameType.TDK_FRIEND:
            case Define.GameType.TDK_COIN:
            case Define.GameType.TDK_FRIEND_LIU:
                break;
            case Define.GameType.SYMJ_FRIEND:
                break;
            case Define.GameType.SYMJ_MATCH:
            case Define.GameType.SYMJ_GOLD:
                break;
            case Define.GameType.JZMJ_FRIEND:
                break;
            case Define.GameType.JZMJ_MATCH:
            case Define.GameType.JZMJ_GOLD:
                break;
            case Define.GameType.HSMJ_FRIEND:
                break;
            case Define.GameType.HSMJ_MATCH:
            case Define.GameType.HSMJ_GOLD:
                break;
            case Define.GameType.XZMJ_FRIEND:
            case Define.GameType.XLMJ_FRIEND:
                break;
            case Define.GameType.XZMJ_MATCH:
            case Define.GameType.XZMJ_GOLD:
            case Define.GameType.XLMJ_MATCH:
            case Define.GameType.XLMJ_GOLD:
                break;
            case Define.GameType.SHMJ_FRIEND:
                break;
            case Define.GameType.SHMJ_MATCH:
            case Define.GameType.SHMJ_GOLD:
                break;
            case Define.GameType.TDHMJ_FRIEND:
                break;
            case Define.GameType.TDHMJ_MATCH:
            case Define.GameType.TDHMJ_GOLD:
                break;
            case Define.GameType.CFMJ_FRIEND:
                break;
            case Define.GameType.CFMJ_MATCH:
            case Define.GameType.CFMJ_GOLD:
                break;
            case Define.GameType.AHMJ_FRIEND:
                break;
            case Define.GameType.AHMJ_MATCH:
            case Define.GameType.AHMJ_GOLD:
                break;
            case Define.GameType.FZMJ_FRIEND:
            case Define.GameType.FZMJ_MATCH:
            case Define.GameType.FZMJ_GOLD:
                break;
            case Define.GameType.WDMJ_FRIEND:
            case Define.GameType.WDMJ_MATCH:
            case Define.GameType.WDMJ_GOLD:
                break;
            case Define.GameType.PZMJ_FRIEND:
            case Define.GameType.PZMJ_GOLD:
            case Define.GameType.PZMJ_MATCH:
                break;
            case Define.GameType.BCMJ_FRIEND:
            case Define.GameType.BCMJ_GOLD:
            case Define.GameType.BCMJ_MATCH:
                break;
            case Define.GameType.ACMJ_FRIEND:
            case Define.GameType.ACMJ_GOLD:
            case Define.GameType.ACMJ_MATCH:
                break;
            case Define.GameType.HLMJ_FRIEND:
            case Define.GameType.HLMJ_GOLD:
            case Define.GameType.HLMJ_MATCH:
                break;
            case Define.GameType.JSMJ_GOLD:
                break;
            case Define.GameType.HBSL_GOLD:
            case Define.GameType.HBSL_JBL:
                break;
            default:
                break;
        }
    },

    /**
     * 设置朋友场游戏网络处理回调对象
     * @param game_id
     */
    setReplayGameNetHandler: function (game_id) {
        switch (game_id) {
            case Define.GameType.CCMJ_FRIEND:
                break;
            case Define.GameType.JLMJ_FRIEND:
                break;
            case Define.GameType.NAMJ_FRIEND:
                break;
            case Define.GameType.FXMJ_FRIEND:
                break;
            case Define.GameType.SYMJ_FRIEND:
                break;
            case Define.GameType.JZMJ_FRIEND:
                break;
            case Define.GameType.HSMJ_FRIEND:
                break;
            case Define.GameType.TDK_FRIEND:
            case Define.GameType.TDK_FRIEND_LIU:
                break;
            case Define.GameType.XZMJ_FRIEND:
            case Define.GameType.XLMJ_FRIEND:
                break;
            case Define.GameType.SHMJ_FRIEND:
                break;;
            case Define.GameType.TDHMJ_FRIEND:
                break;
            case Define.GameType.CFMJ_FRIEND:
                break;
            case Define.GameType.AHMJ_FRIEND:
                break;
            case Define.GameType.FZMJ_FRIEND:
                break;
            case Define.GameType.WDMJ_FRIEND:
                break;
            case Define.GameType.PZMJ_FRIEND:
                break;
            case Define.GameType.BCMJ_FRIEND:
                break;
            case Define.GameType.ACMJ_FRIEND:
                break;
            case Define.GameType.HLMJ_FRIEND:
                break;
            case Define.GameType.HBSL_JBL:
                break;
            default:
                break;
        }
    },

    /**
     * 设置旁观者游戏
     */
    setOnlookersGame: function (gameId, roomId) {
        switch (gameId) {
            case Define.GameType.HBSL_JBL:
                var smsg = new cc.pb.room_mgr.msg_view_friend_game_req();
                smsg.setGameType(gameId);
                smsg.setRoomId(roomId);
                cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_view_friend_game_req, smsg, "msg_view_friend_game_req", true);
                break;
            case Define.GameType.CCMJ_GOLD:
            case Define.GameType.CCMJ_FRIEND:
            case Define.GameType.JLMJ_GOLD:
            case Define.GameType.JLMJ_FRIEND:
            case Define.GameType.NAMJ_GOLD:
            case Define.GameType.NAMJ_FRIEND:
            case Define.GameType.FXMJ_GOLD:
            case Define.GameType.FXMJ_FRIEND:
            case Define.GameType.SYMJ_GOLD:
            case Define.GameType.SYMJ_FRIEND:
            case Define.GameType.JZMJ_FRIEND:
            case Define.GameType.HSMJ_FRIEND:
            case Define.GameType.XZMJ_GOLD:
            case Define.GameType.XZMJ_FRIEND:
            case Define.GameType.XLMJ_GOLD:
            case Define.GameType.XLMJ_FRIEND:
            case Define.GameType.SHMJ_GOLD:
            case Define.GameType.SHMJ_FRIEND:
            case Define.GameType.TDHMJ_GOLD:
            case Define.GameType.TDHMJ_FRIEND:
            case Define.GameType.CFMJ_GOLD:
            case Define.GameType.CFMJ_FRIEND:
            case Define.GameType.AHMJ_GOLD:
            case Define.GameType.AHMJ_FRIEND:
            case Define.GameType.FZMJ_GOLD:
            case Define.GameType.FZMJ_FRIEND:
            case Define.GameType.WDMJ_GOLD:
            case Define.GameType.WDMJ_FRIEND:
            case Define.GameType.PZMJ_GOLD:
            case Define.GameType.PZMJ_FRIEND:
            case Define.GameType.BCMJ_GOLD:
            case Define.GameType.BCMJ_FRIEND:
            case Define.GameType.ACMJ_GOLD:
            case Define.GameType.ACMJ_FRIEND:
            case Define.GameType.HLMJ_GOLD:
            case Define.GameType.HLMJ_FRIEND:
            case Define.GameType.JSMJ_GOLD:
                cc.dd.DialogBoxUtil.show(0, cc.dd.Text.TEXT_KLB_HALL_COMMON_15, 'text33');
                break;
            default:
                cc.dd.DialogBoxUtil.show(0, cc.dd.Text.TEXT_KLB_HALL_COMMON_15, 'text33');
                break;
        }
    },
});

module.exports = {
    RoomMgr: RoomMgr,
    RoomEvent: RoomEvent,
    RoomED: RoomED,
};
