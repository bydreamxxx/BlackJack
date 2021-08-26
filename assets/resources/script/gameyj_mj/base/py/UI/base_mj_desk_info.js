var dd = cc.dd;
var Platform = require("Platform");
const AppCfg = require('AppConfig');
var SysED = require("com_sys_data").SysED;
var SysEvent = require("com_sys_data").SysEvent;
var RoomED = require("jlmj_room_mgr").RoomED;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;
const Hall = require('jlmj_halldata');
var HallCommonObj = require('hall_common_data');
var HallCommonEd = HallCommonObj.HallCommonEd;
var HallCommonEvent = HallCommonObj.HallCommonEvent;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var DingRobot = require('DingRobot');
var game_room = require("game_room");
var HallPropData = require('hall_prop_data').HallPropData.getInstance();
var UIZorder = require("mj_ui_zorder");

const BSC_Event = require('bsc_data').BSC_Event;
const BSC_ED = require('bsc_data').BSC_ED;
var hall_prefab = require('hall_prefab_cfg');
var com_replay_data = require('com_replay_data').REPLAY_DATA;

var Text = cc.dd.Text;
var PopupType = {
    OK_CANCEL: 1,
    OK: 2,
    CANCEL: 3,
};

const DESK_TYPE = {
    FRIEND: 0,
    JBC: 1,
    REPLAY: 2
}

//每个麻将都要改写这个
let mjComponentValue = null;
let mjConfigValue = null;

var baseDeskInfo = cc.Class({
    extends: cc.Component,

    properties: {
        zhuomianImg: [cc.SpriteFrame],//桌面背景
        spf_baopai_an: cc.SpriteFrame,
        spf_baopai_ming: cc.SpriteFrame,
        spf_baopai_an_2d: cc.SpriteFrame,
        spf_baopai_ming_2d: [cc.SpriteFrame],
        prefab_fenzhang: cc.Prefab,//分张预制体
        deskType: 0,//0朋友场，1金币场，2回放
    },

    ctor() {
        mjComponentValue = this.initMJComponet();
        mjConfigValue = this.initMJConfig();

        this.require_mj_util = require(mjComponentValue.mjUtil).Instance();
        this.require_UserPlayer = require(mjComponentValue.userData);
        this.require_deskJBCData = require(mjComponentValue.deskJBCData);

        let _deskData = require(mjComponentValue.deskData);
        this.require_DeskEvent = _deskData.DeskEvent;
        this.require_DeskED = _deskData.DeskED;
        this.require_DeskData = _deskData.DeskData;

        let _playerData = require(mjComponentValue.playerData);
        this.require_playerED = _playerData.PlayerED;
        this.require_PlayerEvent = _playerData.PlayerEvent;

        this.require_playerMgr = require(mjComponentValue.playerMgr);


        this.require_jlmj_prefab = require(mjConfigValue.prefabCfg);
        this.require_jlmj_audio_path = require(mjConfigValue.audioPath);
        this.require_jlmj_audio_mgr = require(mjConfigValue.audioMgr).Instance();
    },

    // use this for initialization
    onLoad: function () {
        cc.log("mj_desk_info onLoad");

        if (this.isDeskJBC()) {
            BSC_ED.addObserver(this);
        }
        HallCommonEd.addObserver(this);
        this.require_DeskED.addObserver(this);
        this.require_playerED.addObserver(this);
        SysED.addObserver(this);
        RoomED.addObserver(this);
        Hall.HallED.addObserver(this);

        this.initProperties();
        this.initDeskDataUI();
        this.initDeskData();
        this.initLocalData();
        this.initGuiZeInfo();

        if (!this.isDeskReplay()) {
            this.initReady();
            this.initZhiNan();

            //返回键
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        }


        if (cc.find('Marquee')) {
            this._Marquee = cc.find('Marquee');
            if (this._Marquee) {
                this._Marquee.getComponent('com_marquee').updatePosition();
            }
        }
    },

    initDeskUI() {
        this.layer_disabled = cc.find("Canvas/mj_lockScene_layer");

        this._deskNode = cc.find("Canvas/desk_node");
        this._playerDownUI = cc.find("Canvas/desk_node/jlmj_player_down_ui");
        this._playerRightUI = cc.find("Canvas/desk_node/jlmj_player_right_ui");
        this._playerUpUI = cc.find("Canvas/desk_node/jlmj_player_up_ui");
        this._playerLeftUI = cc.find("Canvas/desk_node/jlmj_player_left_ui");
        this._headRight = cc.find("Canvas/desk_node/mj_playerHead_right");
        this._headLeft = cc.find("Canvas/desk_node/mj_playerHead_left");
        this._headUp = cc.find("Canvas/desk_node/mj_playerHead_up");

        this._headDownButton = cc.find("Canvas/desk_node/down_head_button");
        this._headRightButton = cc.find("Canvas/desk_node/right_head_button");
        this._headUpButton = cc.find("Canvas/desk_node/up_head_button");
        this._headLeftButton = cc.find("Canvas/desk_node/left_head_button");

        this._kaiJuAni = cc.find("Canvas/kai_ju_ani");
        this._huangZhuangAni = cc.find("Canvas/huang_zhuang_ani");
        this._daHuanBao = cc.find("Canvas/desk_node/dahuanbao");
        this._zhiShiQi = cc.find("Canvas/desk_node/jlmj_zhishiqi");
        this._baoPai = cc.find("Canvas/desk_node/baopai");

        this._tingButton = cc.find("Canvas/desk_node/jlmj_player_down_ui/tingButton");

        this._messageBtn = cc.find("Canvas/toppanel/messageBtn");

        this.da_pai_prompt = cc.find("Canvas/desk_node/mj_dapai_prompt");
        if (this.da_pai_prompt) {
            this.da_pai_prompt_label = cc.find("Canvas/desk_node/mj_dapai_prompt/prompt_label").getComponent(cc.Label);
        }

        this.deskImage = cc.find("Canvas/zhuozi").getComponent(cc.Sprite);

        this._zhinan = cc.find("Canvas/desk_node/mj_zhinan");
        this._zhinan_2d = cc.find("Canvas/desk_node/mj_zhinan_2d");

        this._deskLeftinfo = cc.find("Canvas/toppanel/desk_leftinfo_fun");
        this._playerList = cc.find('Canvas/player_list');
        this._menu_list = cc.find("Canvas/game_menu_list");

        this._quanShu = cc.find("Canvas/toppanel/desk_leftinfo_fun/leftInfo/quanshu");
        this._zongJu = cc.find("Canvas/toppanel/desk_leftinfo_fun/leftInfo/quanshu/zong_ju");

        if (!this.isDeskJBC()) {
            this._gz = cc.find("Canvas/gzNode")

            this._btnReady = cc.find("Canvas/toppanel/btn_ready");
            this._btnInvite = cc.find("Canvas/toppanel/btn_invite");
            // this._btnInviteXL = cc.find("Canvas/toppanel/btn_inviteXL");
            this._roomNum = cc.find("Canvas/room_num");
            this._roomID = cc.find("Canvas/room_num/room_id");
            this._fgInviteBtn = cc.find("Canvas/toppanel/klb_friend_group_invite_btn");

            if (this.isDeskFriend()) {
                this._RecordButton = cc.find("Canvas/toppanel/RecordButton");
                this._lastJieSuanBtn = cc.find("Canvas/toppanel/last_jie_suan");
            }
        } else {
            this._layerBaseScore = cc.find("Canvas/layer_base_score");
            this._btnMatch = cc.find("Canvas/btn_match");
            this._animMatching = cc.find("Canvas/desk_node/anim_matching");
            this._layerTuoGuan = cc.find("Canvas/toppanel/layer_tuo_guan");
            this._baseScoreName = cc.find("Canvas/layer_base_score/name");
            this._baseScore = cc.find("Canvas/layer_base_score/base_score");
            this._baseScore2 = cc.find("Canvas/toppanel/desk_leftinfo_fun/leftInfo/base_score_bg/base_score_2");

            this._matchLayout = cc.find("Canvas/desk_node/matchLayout");
            if (this._matchLayout) {
                this.matchTitle = cc.find("Canvas/desk_node/matchLayout/title").getComponentInChildren(cc.Label);
                this.matchContent = cc.find("Canvas/desk_node/matchLayout/match").getComponentInChildren(cc.Label);
                this._rank = cc.find("Canvas/desk_node/matchLayout/rank");
                this.rank = this._rank.getComponentInChildren(cc.Label);
            }

            this._gWeiXin = cc.find("Canvas/toppanel/gweixin");
            this._bisaiAni = cc.find("Canvas/bisai_ani");

        }

        if (this._baoPai) {
            this.baopai = this._baoPai.getComponent(mjConfigValue.mjPai);
            this._baoPai.active = false;
        } else {
            this.baopai = null;
        }

        this.zhinan = null;

        this.use2D = this.get2D();
        if (this.use2D) {
            this.zhinan = this._zhinan_2d;

            if (this._baoPai) {
                this._baoPai.x = 117.4;
                this._baoPai.y = 29.5;
            }

            if (this._matchLayout) {
                this._matchLayout.skewX = 0;
                this._matchLayout.x = -124.3;
                this._matchLayout.y = 33;
            }
        } else {
            this.zhinan = this._zhinan;

            if (this._baoPai) {
                this._baoPai.x = 146;
                this._baoPai.y = 56;
            }

            if (this._matchLayout) {
                this._matchLayout.skewX = 8.2;
                this._matchLayout.x = -139.8;
                this._matchLayout.y = 51.9;
            }
        }
        this._zhinan.active = false;
        this._zhinan_2d.active = false;
    },

    setDefaultDeskUI() {
        this.setBtnActive(this.layer_disabled, false);
        this.setBtnActive(this._playerDownUI, !this.isDeskJBC());
        this.setBtnActive(this._playerRightUI, false);
        this.setBtnActive(this._playerLeftUI, false);
        this.setBtnActive(this._playerUpUI, false);
        this.setBtnActive(this._headRight, false);
        this.setBtnActive(this._headLeft, false);
        this.setBtnActive(this._headUp, false);
        this.setBtnActive(this._headDownButton, false);
        this.setBtnActive(this._headRightButton, false);
        this.setBtnActive(this._headLeftButton, false);
        this.setBtnActive(this._headUpButton, false);
        this.setBtnActive(this._kaiJuAni, false);
        this.setBtnActive(this._huangZhuangAni, false);
        this.setBtnActive(this._daHuanBao, false);
        this.setBtnActive(this._zhiShiQi, false);
        this.setBtnActive(this._gz, this.isDeskFriend());
        this.setBtnActive(this._btnReady, this.isDeskFriend());
        this.setBtnActive(this._btnInvite, this.isDeskFriend());
        // this.setBtnActive(this._btnInviteXL, this.isDeskFriend());
        this.setBtnActive(this._roomNum, this.isDeskFriend());
        this.setFriendGroupInvite(this.isDeskFriend());

        this.setBtnActive(this._layerBaseScore, this.isDeskJBC());
        this.setBtnActive(this._btnMatch, this.isDeskJBC());
        this.setBtnActive(this._animMatching, false);
        this.setBtnActive(this._layerTuoGuan, false);

        this.setBtnActive(this._matchLayout, this.require_DeskData.Instance().isMatch());
        this.setBtnActive(this._bisaiAni, false);
        this.setBtnActive(this._gWeiXin, this.require_DeskData.Instance().isMatch() && !this.weixinNotShow);

        this.setLastJieSuanActive();

        if (this._tingButton) {
            this._tingButton.zIndex = UIZorder.MJ_LAYER_UI;
            this._tingButton.active = false;
        }

        this.setBtnActive(this.zhinan, !this.isDeskFriend());
        this.setBtnActive(this.da_pai_prompt, false);
    },

    initDeskDataUI: function () {
        this.initDeskUI();
        this.setDefaultDeskUI();

        this.dapai_tip_type = -1;

        if (this.require_DeskData.Instance().isMatch()) {
            this.da_pai_prompt_label.string = '请等待其他玩家';
            this.da_pai_prompt.active = true;
        } else if (!this.isDeskJBC()) {
            DingRobot.set_ding_type(1);
            this.updatePlayerNum(this.require_playerMgr.Instance().getPlayerNum());

            //如果桌子已解散,提示玩家
            if (this.require_DeskData.Instance().desk_dissolved) {
                var content = cc.dd.Text.TEXT_DESK_INFO_5;
                this.popViewTips(content, this.gobackHall.bind(this), PopupType.OK);
            }

            if (this.require_DeskData.Instance().jiesuanMsg) {
                var msg = this.require_DeskData.Instance().jiesuanMsg;
                this.require_DeskData.Instance().jiesuanMsg = null;
                this.jiesuan([msg]);
            }

            if (this._messageBtn) {
                this._messageBtn.getComponent(cc.Button).interactable = true
            }

            this.updatePlayerInfo();
        }


    },

    initDeskData: function () {
        if (this.isDeskFriend()) {
            var currValue = this.require_DeskData.Instance().currPlayCount;
            var totalValue = RoomMgr.Instance()._Rule.boardscout;
            var roomNum = RoomMgr.Instance().roomId;
            //当前局数
            this._quanShu.getComponent(cc.Label).string = currValue;
            //总局数
            this._zongJu.getComponent(cc.Label).string = totalValue;
            //房号
            this._roomID.getComponent(cc.Label).string = roomNum;

        } else if (this.isDeskJBC()) {
            var deskDataJBC = this.require_deskJBCData.getInstance();

            if (deskDataJBC.getBaseScore() === 0) {
                this._layerBaseScore.active = false;
                this._btnMatch.active = false;
                return;
            }
            //显示房间信息
            //场次类型
            this._baseScoreName.getComponent(cc.Label).string = deskDataJBC.getTitle();
            //底分
            this._baseScore.getComponent(cc.Label).string = Text.TEXT_MJ_JBC_0 + deskDataJBC.getBaseScore();
            //右上角底分
            this._baseScore2.getComponent(cc.Label).string = deskDataJBC.getBaseScore();
        } else {
            var roomNum = RoomMgr.Instance().roomId;
            this._roomID.getComponent(cc.Label).string = roomNum;
            this.setBtnActive(this._roomNum, true);
            //当前局数
            this._quanShu.getComponent(cc.Label).string = com_replay_data.Instance().curRound;
            //总局数
            this._zongJu.getComponent(cc.Label).string = com_replay_data.Instance().totalRound;
        }

    },

    initLocalData: function () {
        AudioManager.playMusic(this.require_jlmj_audio_path.Music_Game);
        //AudioManager.onMusic( this.require_jlmj_audio_path.Music_Game );
        if (!AudioManager._getLocalMusicSwitch()) {
            AudioManager.stopMusic();
            AudioManager.offMusic();
        }

        if (this.use2D) {
            this.deskImage.spriteFrame = this.zhuomianImg[2];
            this.logo.node.scaleX = 0.8;
            this.logo.node.scaleY = 0.8;
            return;
        }

        this.logo.node.scaleX = 1;
        this.logo.node.scaleY = 1;

        var json = cc.sys.localStorage.getItem(mjComponentValue.mjZhuobu + cc.dd.user.id);
        if (json) {
            var sprite = null;
            this.zhuomianImg.forEach(function (element, index) {
                if (element._name == json) {
                    sprite = element;
                }
            });
            if (sprite) {
                this.deskImage.spriteFrame = sprite;
            }
            else {
                this.deskImage.spriteFrame = this.zhuomianImg[0];
                cc.sys.localStorage.setItem(mjComponentValue.mjZhuobu + cc.dd.user.id, this.zhuomianImg[0]._name);
            }
        }
        else {
            this.deskImage.spriteFrame = this.zhuomianImg[0];
            cc.sys.localStorage.setItem(mjComponentValue.mjZhuobu + cc.dd.user.id, this.zhuomianImg[0]._name);
        }
    },

    initGuiZeInfo: function () {
        if (this.isDeskFriend()) {
            if (this.require_DeskData.Instance().gameStatus == 2) {
                return;
            }
            this._RecordButton.active = RoomMgr.Instance()._Rule.isyuyin;
            var desk_leftinfo = this._deskLeftinfo.getComponent("mj_desk_leftinfo");
            var cur_rule = RoomMgr.Instance()._Rule;
            cur_rule.roomId = RoomMgr.Instance().roomId;

            this._gz.active = true;

            let [guize_arr, gz_arr] = this.getGameGuiZe();
            var func = cc.callFunc(() => {
                desk_leftinfo.qsNode.active = desk_leftinfo.qsNode.active == false;
                desk_leftinfo.dcNode.active = desk_leftinfo.qsNode.active == false;
            });
            desk_leftinfo.init(guize_arr, func, cur_rule);

            var mj_guize = this._gz.getComponent("mj_guize");
            mj_guize.addGuize(gz_arr, RoomMgr.Instance().isUseNeiMengMJConfig() ? false : RoomMgr.Instance()._Rule.gps);

            if (this._fgInviteBtn) {
                let wanFa = guize_arr.slice();
                let wanFaTitle = wanFa.shift();

                let playerList = this.require_playerMgr.Instance().getPlayerList();
                let playerName = [];
                playerList.forEach(function (playerMsg) {
                    if (playerMsg && playerMsg.userId) {
                        playerName.push(playerMsg.name);
                    }
                }, this);

                //玩法名称+人数+圈数+封顶+缺几人
                let rule = wanFaTitle + ' ' + wanFa.join(' ') + playerName.length + '/' + RoomMgr.Instance()._Rule.usercountlimit;

                this._fgInviteBtn.getComponent('klb_friend_group_invite_btn').setInfo(RoomMgr.Instance().roomId, rule)
            }
        } else if (this.isDeskJBC()) {
            var desk_leftinfo = this._deskLeftinfo.getComponent("mj_desk_leftinfo");
            var func = cc.callFunc(() => {
                if (this.require_DeskData.Instance().isMatch()) {
                    desk_leftinfo.qsNode.active = desk_leftinfo.qsNode.active == false;
                    desk_leftinfo.dcNode.active = desk_leftinfo.qsNode.active == false;
                } else {
                    desk_leftinfo.dfNode.active = desk_leftinfo.dfNode.active == false;
                    desk_leftinfo.dcNode.active = desk_leftinfo.dfNode.active == false;
                }
            });
            desk_leftinfo.init([], func);
        }
    },

    /**
     * 初始化准备按钮
     */
    initReady: function () {
        if (!this.require_DeskData.Instance().isGameStart) {
            var player1 = this.require_playerMgr.Instance().getPlayer(cc.dd.user.id);
            if (player1 != null) {
                if (player1.bready == 1) {
                    this.setRead(cc.dd.user.id);
                }
            }
        }
    },

    initZhiNan: function () {
        if (this.zhinan.active && this.require_DeskData.Instance().zhiNan_site != null) {
            var site = this.require_DeskData.Instance().zhiNan_site;
            if (this.require_playerMgr.Instance().playerList.length == 2) {
                site = site > 0 ? site + 1 : site;
            }
            this.zhinan.getComponent(mjComponentValue.zhinan).initsetZhiNan(site);
            this.require_DeskData.Instance().zhiNan_site = null;
        }
    },

    start: function () {
        if (this.isDeskFriend()) {
            this.require_DeskData.Instance().enterSceneRecoverDesk(this.sendReadyOK.bind(this));
        } else if (this.isDeskJBC()) {
            if (this.require_deskJBCData.getInstance().getIsReconnect()) {
                this.require_DeskData.Instance().enterSceneRecoverDesk(this.sendReadyOK.bind(this));
            }
        }
    },

    onDestroy: function () {
        //this.stopAni();
        HallCommonEd.removeObserver(this);
        this.require_DeskED.removeObserver(this);
        this.require_playerED.removeObserver(this);
        SysED.removeObserver(this);
        RoomED.removeObserver(this);
        Hall.HallED.removeObserver(this);

        if (this.isDeskJBC()) {
            BSC_ED.removeObserver(this);
        }

        if (this.endTime) {
            clearTimeout(this.endTime);
            this.endTime = null;
        }

        //清理数据
        this.require_DeskData.Destroy();
        this.require_playerMgr.Destroy();
        RoomMgr.Destroy();
        this.require_deskJBCData.getInstance().destroy();

        this.clearIntervalTimeout();
        this.unscheduleAllCallbacks();
        if (this._jiesuan) {
            this._jiesuan.close();
            this._jiesuan = null;
        }
        if (this._Marquee) {
            this._Marquee.getComponent('com_marquee').resetPosition();
        }
    },

    cleanJieSuan() {
        if (this.jiesuan_TimeID) {
            this.unschedule(this.jiesuan_TimeID);
        }
        if (this._jiesuan) {
            this._jiesuan.close();
            this._jiesuan = null;
        }
    },

    clearIntervalTimeout: function () {
        if (this.jiesuan_TimeID) {
            clearTimeout(this.jiesuan_TimeID);
            this.jiesuan_TimeID = null;
        }
        if (this.result_TimeID) {
            clearTimeout(this.result_TimeID);
            this.result_TimeID = null;
        }
        if (this.locakSceneTimeOut) {
            clearTimeout(this.locakSceneTimeOut);
            this.locakSceneTimeOut = null;
        }
    },

    change_room: function () {
        cc.dd.mj_game_start = true;

        var play_list = this._playerList.getComponent(mjComponentValue.playerList);
        if (play_list) {
            for (var i = 0; i < play_list.player_ui_arr.length; ++i) {
                var headinfo = play_list.player_ui_arr[i];
                if (headinfo && headinfo.head.player && headinfo.head.player.userId != cc.dd.user.id) {
                    headinfo.head.node.active = false;
                }
            }
        }

        var pbData = new cc.pb.room_mgr.msg_change_room_req();
        pbData.setGameType(RoomMgr.Instance().gameId);
        pbData.setRoomCoinId(RoomMgr.Instance().roomLv);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_change_room_req, pbData, 'msg_change_room_req', true);

    },

    /**
     * 换桌布
     */
    changeDeskImage: function (type) {
        cc.log('换桌布：', type);
        this.initLocalData();
    },

    // 直接退出房间
    // --------------------------------
    // @param msg [object] 数据层发来的数据
    exitRoom: function (msg) {
        this.closePopupView();
        this.closeResponseDissolveView();
        if (msg.exitid == dd.user.id) {
            this.gobackHall();
        } else {
            this.require_playerMgr.Instance().playerExit(msg.exitid);
        }
    },
    gobackHall: function () {
        this.require_mj_util.enterHall();
    },

    /**
     * 清理桌子
     */
    clear: function (data) {
        this.setBtnActive(this._matchLayout, false);
        this.setBtnActive(this._gWeiXin, false);
        this.setBtnActive(this.da_pai_prompt, false);
        this.setBtnActive(this._baoPai, false);

        this.clearHuAni();

        this.setTingPaiUIActive(false);
        this.closeResponseDissolveView();
        this.closePopupView();
        cc.dd.UIMgr.destroyUI(this.require_jlmj_prefab.JLMJ_JIAOPAI_INFO);
        this.require_DeskED.notifyEvent(this.require_DeskEvent.CLOSE_ZSQ, [this]);

        if (cc.dd.mj_change_2d_next_time) {
            cc.dd.mj_change_2d_next_time = false;
            this._change2D();
        }
    },

    closePopupView: function () {
        cc.dd.UIMgr.destroyUI(this.require_jlmj_prefab.JLMJ_TANCHUANG);
    },

    closeResponseDissolveView: function () {
        if (this.popupViewPrefab) {
            cc.dd.UIMgr.destroyUI(this.require_jlmj_prefab.JLMJ_JIESAN);
        }
    },

    /**
     * 恢复数据适用
     */
    recoverDesk: function () {
        if (!this.isDeskReplay()) {
            cc.log("mj 朋 友 recover_desk------ 接收1");
            cc.log("------恢复桌子------py");
            this.updateDesk();
            this.require_DeskData.Instance().enterSceneRecoverDesk(this.sendReadyOK.bind(this));
            if (this.fenzhang) {
                this.fenzhang.node.active = false;
            }
            var player = this.require_playerMgr.Instance().getPlayer(dd.user.id);
            if (this.require_DeskData.Instance().isGameStart) {
                this.setTingPaiUIActive(player.isBaoTing);
            } else if (this.require_DeskData.Instance().isFriend()) {
                this.initDeskData();
            }
        }

        if (this.isDeskJBC()) {
            cc.log("mj jbc desk on_room_enter--->" + (this.require_DeskData.Instance().isGameStart));

            let wait_node = cc.dd.UIMgr.getUI(hall_prefab.KLB_MATCH_WAITROOM);
            if (wait_node) {
                cc.dd.UIMgr.destroyUI(wait_node);
            }

            this.setBtnActive(this._layerBaseScore, !this.require_DeskData.Instance().isGameStart && !this.require_DeskData.Instance().isMatch());
            this.setBtnActive(this._btnMatch, !this.require_DeskData.Instance().isGameStart && !this.require_DeskData.Instance().isMatch());
            this.setBtnActive(this._deskLeftinfo, true);
            if (this._messageBtn) {
                this._messageBtn.getComponent(cc.Button).interactable = this.require_DeskData.Instance().isGameStart;
            }

            this.tuo_guan(!this.require_DeskData.Instance().isGameStart);
            this.require_DeskData.Instance().isGameStart ? this.stopMatchAnim() : null;
            this.initDeskData();

            this.setBtnActive(this._matchLayout, this.require_DeskData.Instance().isMatch());
            this.setBtnActive(this._gWeiXin, this.require_DeskData.Instance().isMatch() && !this.weixinNotShow);

            if (this.require_DeskData.Instance().isGameStart) {
                if (this._jiesuan) {
                    this._jiesuan.close();
                    this._jiesuan = null;
                }
                if (this.jiesuan_TimeID) {
                    this.unschedule(this.jiesuan_TimeID);
                }
            }
        }

    },

    /**
     * 隐藏 桌子上的准备 邀请
     */
    hideDeskReady: function () {
        cc.log("------隐藏按键------");
        if (this.isDeskFriend()) {
            this._gz.active = false;
            this.zhinan.active = true;
            this._roomNum.active = false;
            this._btnReady.active = false;
            this._btnInvite.active = false;
            // this._btnInviteXL.active = false;
            this.setFriendGroupInvite(false);
            this.initZhiNan();
        } else if (this.isDeskJBC()) {
            this.isLastJiesuan = null;

            cc.dd.UIMgr.destroyUI(hall_prefab.KLB_MATCH_WAITROOM);
            if (this._jiesuan) {
                this._jiesuan.close();
                this._jiesuan = null;
            }
            cc.gateNet.Instance().clearDispatchTimeout();
        }
    },

    /**
     * 更新桌子信息
     */
    updateDesk: function () {
        this.updateRemainCard();
        this.updateBaoPai();
        this.updatePlayerInfo();

        if (this.isDeskFriend()) {
            this.updateCurrRound();
            this.updateTotalRound();
            this.updateRoomNum();
            this.updateGameStatus();
        } else if (this.isDeskJBC()) {
            this.cleanTuoGuanBtnCallBack();
        }
    },

    /**
     * 更新游戏状态
     * @param status 1：未开始 2：已开始
     */
    updateGameStatus: function (status) {
        if (!this.require_DeskData.Instance().isGameStart) {
            return;
        }
        cc.log("-----更新游戏状态------");
        if (!status)
            status = this.require_DeskData.Instance().gameStatus;
        cc.log("-----游戏状态------>" + status);
        var player = this.require_playerMgr.Instance().getPlayer(dd.user.id);
        if (status == 1) {
            if (this.require_DeskData.Instance().isFriend()) {
                this._btnInvite.active = true;
                // this._btnInviteXL.active = true;
                this._btnReady.active = true;
                this.setFriendGroupInvite(true);
            }

            if (player.bready) {
                this.setRead(dd.user.id);
            }
            this.require_playerMgr.Instance().playerNumChanged();
        } else if (status == 2) {
            if (this.require_DeskData.Instance().isFriend()) {
                this._btnInvite.active = false;
                // this._btnInviteXL.active = false;
                this.setFriendGroupInvite(false);
                this._btnReady.active = false;
                this._gz.active = false;
                this._roomNum.active = false;
            }
            this.zhinan.active = true;
            this.initZhiNan();
            if (player.isBaoTing) {
                this.setTingPaiUIActive(true);
            }
        }
    },

    /**
     *  断线重连回来  需要发送加载完毕
     */
    sendReadyOK: function () {
        this.require_DeskData.Instance().lockScene();
        this.sendReloadOK();
        this.initGuiZeInfo();
    },

    onKeyDown: function (event) {
        if (event.keyCode == cc.KEY.back || event.keyCode == cc.KEY.escape) {
            var msg = {};
            msg.status = 0;
            if (!this.resultView) {
                this.require_DeskED.notifyEvent(this.require_DeskEvent.LEAVE_TIPS, msg);
            }
        }
    },

    /**
     * 结算
     * @param data
     */
    jiesuan: function (data) {

        cc.log("结算ui弹出");
        if (this.fenzhang) {
            this.fenzhang.node.active = false;
        }

        if (this._jiesuan) {
            this._jiesuan.close();
            this._jiesuan = null;
        }

        if (this.jiesuan_TimeID) {
            clearTimeout(this.jiesuan_TimeID);
        }
        this.da_pai_prompt.active = false;

        let waitTime = cc._needShowDrop && !this.require_DeskData.Instance().isMatch() ? 4000 : 0;

        this.lastJiesuan = data[0];

        cc.dd.mj_game_start = false;


        this.jiesuan_TimeID = setTimeout(() => {
            this.jiesuan_TimeID = null;

            cc.log("结算ui延时弹出----------》  " + data);
            if (!data || !data[0]) {
                this.require_DeskData.Instance().waitJiesuan = false;
                return;
            }

            if (this.require_DeskData.Instance().getIsStart() && data[1] !== true) {
                this.require_DeskData.Instance().waitJiesuan = false;
                return;
            }
            if (this.require_DeskData.Instance().isInMaJiang()) {
                cc.dd.UIMgr.openUI(this.require_jlmj_prefab.JLMJ_JIESUAN, (ui) => {
                    var jlmj_jiesuan = ui.getComponent("jlmj_jiesuan_ui");
                    jlmj_jiesuan.showJianYiLayer(data[0], 20, () => {
                        this._jiesuan = null;
                        this.require_DeskData.Instance().waitJiesuan = false;
                    }, data[1]);
                    // jlmj_jiesuan.jiesuanBtnCallBack();
                    this._jiesuan = jlmj_jiesuan;
                    this.playJieSuanAudio();
                    // var ani = this._jiesuan.node.getComponent(cc.Animation);
                    // if(data[0].huuserid){
                    //     ani.play('mj_jiesuan');
                    // }

                    cc.dd.UIMgr.destroyUI(this.require_jlmj_prefab.JLMJ_JIAOPAI_INFO);

                    if (this.require_DeskData.Instance().isJBC()) {
                        this._messageBtn.getComponent(cc.Button).interactable = false;
                        //判断是否破产停止倒计时
                        var roomId = RoomMgr.Instance().roomLv;
                        var gameId = RoomMgr.Instance().gameId;
                        var room_item = game_room.getItem(function (item) {
                            return item.gameid == gameId && item.roomid == roomId;
                        });

                        if (room_item && HallPropData.getCoin() < room_item.entermin) {
                            cc.dd.UIMgr.openUI(this.require_jlmj_prefab.JLMJ_XIAOQIAN, (ui) => {
                                var mj_huaqian = ui.getComponent("mj_huaqian");
                                mj_huaqian.setEntermin(room_item.entermin);
                                ui.zIndex = UIZorder.MJ_LAYER_TOP;
                                jlmj_jiesuan.stopTime();
                            });
                        }
                    } else if (this.require_DeskData.Instance().isFriend()) {
                        if (this.require_DeskData.Instance().isDajiesuan) {
                            this.result_TimeID = setTimeout(() => {
                                this.onShowResultView();
                            }, 2000);
                        }
                    }

                });
            }
        }, waitTime);
    },

    playJieSuanAudio() {
        AudioManager.playSound(this.require_jlmj_audio_path.JIESUAN);
    },

    /**
     * 发牌
     */
    fapai: function () {
        if (this.require_DeskData.Instance().isMatch()) {
            cc.dd.UIMgr.destroyUI(hall_prefab.KLB_MATCH_WAITROOM);
            this.da_pai_prompt.active = false;

            if (!cc.dd._.isNumber(this.matchRound)) {
                this.matchRound = 1;
            }

            if (this._bisaiAni) {
                this._bisaiAni.active = true;
                let spine = this._bisaiAni.getComponent(sp.Skeleton);
                spine.clearTracks();
                spine.setCompleteListener(() => {
                    this._bisaiAni.active = false;
                });

                switch (this.matchRound) {
                    case 1:
                        spine.setAnimation(0, 'diyi', false);
                        AudioManager.playSound("gameyj_hall/audios/pk_loading");
                        break;
                    case 2:
                        spine.setAnimation(0, 'dier', false);
                        break;
                    case 3:
                        spine.setAnimation(0, 'disan', false);
                        break;
                    case 0:
                        if (this.require_DeskData.Instance().currPlayCount == 1) {
                            spine.setAnimation(0, 'juesai', false);
                        } else {
                            this._bisaiAni.active = false;
                        }
                        break;
                }
            }
        } else {
            this.db_duiju = this._kaiJuAni.getComponent(dragonBones.ArmatureDisplay);
            this.db_duiju.node.active = true;
            this.db_duiju.playAnimation("DJKS", 1);
            this.db_duiju.removeEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.onPlayDuiJuAniEnd, this);
            this.db_duiju.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.onPlayDuiJuAniEnd, this);
        }

        let ani = this.use2D ? "jlmj_fapai_ani_2d" : "jlmj_fapai_ani";

        this._deskNode.getComponent(cc.Animation).play(ani);
        this._deskNode.getComponent(cc.Animation).setCurrentTime(0, ani);
    },

    /**
     * 播放分张特效
     */
    playerFenZhangAni: function () {
        if (!this.isDeskReplay()) {
            cc.log('【分张动画播放】 开始');
            this.require_DeskData.Instance().fenzhangCount = 0;
            if (!this.fenzhang) {
                this.fenzhang = cc.instantiate(this.prefab_fenzhang).getComponent('jlmj_fenzhang');
                this.fenzhang.initData(this.require_playerMgr.Instance().playerList);
                this.fenzhang.node.parent = this.node;
            }
            this.fenzhang.node.active = true;
            this.fenzhang.playAni();
            var player_down_ui = this._playerDownUI.getComponent(mjComponentValue.playerDownUI);
            player_down_ui.setFenPaiTouched(true);
        }
    },

    /**
     * 删除分张牌
     * @param index 下标
     */
    hideFenZhangCard: function () {
        if (!this.isDeskReplay()) {
            if (this.fenzhang) {
                this.fenzhang.getPai();
            }
        }
    },

    // 离开状态
    // --------------------------------
    // @param msg [object] 数据层发来的数据
    leave_tips: function (data) {
        var txt = "";
        var callfunc = null;

        if (this.require_DeskData.Instance().isFriend()) {//朋友场
            if (this.require_DeskData.Instance().isDajiesuan) {//已经结束大结算
                this.gobackHall();
            } else if (this.require_DeskData.Instance().isGameStart) {//已经开始游戏
                txt = Text.TEXT_LEAVE_ROOM_2;
                callfunc = this.py_dissolve_room_req;
            } else {//未开始游戏
                //判断房主和玩家提示不一样
                if (RoomMgr.Instance().isRoomer(cc.dd.user.id)) {
                    txt = Text.TEXT_LEAVE_ROOM_1 + "\n" + Text.TEXT_LEAVE_ROOM_5;
                } else {
                    txt = Text.TEXT_LEAVE_ROOM_3;
                }
                callfunc = this.py_leave_room_req;
            }
        } else if (this.require_DeskData.Instance().isJBC()) {//金币场
            if (data.status == 7) {
                this.jbc_matching_leave_room_req();
            } else if (this.require_deskJBCData.getInstance().getIsMatching() || this.require_DeskData.Instance().player_read_gamne) {//取消匹配状态
                txt = Text.TEXT_LEAVE_ROOM_3;
                callfunc = this.jbc_matching_leave_room_req;
            } else if (this.require_deskJBCData.getInstance().getIsStart()) {//游戏中退出游戏
                if (this._jiesuan) {//游戏中并结算中退出游戏
                    txt = Text.TEXT_LEAVE_ROOM_3;
                    callfunc = this.jbc_matching_leave_room_req;
                } else {//游戏中退出游戏
                    txt = cc.dd.Text.TEXT_LEAVE_ROOM_3 + "\n" + cc.dd.Text.TEXT_LEAVE_ROOM_6;
                    callfunc = this.jbc_gamestart_leave_room_req;
                }
            } else {
                this.gobackHall();
            }
        } else if (this.require_DeskData.Instance().isReplay()) {

        } else if (this.require_DeskData.Instance().isMatch()) {

        }
        if (callfunc != null) {
            this.popViewTips(txt, callfunc, PopupType.OK_CANCEL);
        }
    },

    //朋友场离开未开始
    py_leave_room_req: function () {
        cc.log("【UI】发送离开 朋友场离开未开始");
        var msg = new cc.pb.room_mgr.msg_leave_game_req();
        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType(RoomMgr.Instance().gameId);
        gameInfoPB.setRoomId(RoomMgr.Instance().roomId);
        msg.setGameInfo(gameInfoPB);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);
    },

    //金币场匹配中离开
    jbc_matching_leave_room_req: function () {
        cc.log("【UI】发送离开 金币场未开始离开");
        // 取消匹配状态
        var msg = new cc.pb.room_mgr.msg_leave_game_req();
        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType(RoomMgr.Instance().gameId);
        gameInfoPB.setRoomId(RoomMgr.Instance().roomLv);
        msg.setGameInfo(gameInfoPB);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);

        // this.require_mj_util.enterHall();
    },

    //金币场开始游戏中退出房间
    jbc_gamestart_leave_room_req: function () {
        cc.log('发送离开 3');
        var msg = new cc.pb.room_mgr.msg_leave_game_req();

        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType(RoomMgr.Instance().gameId);
        gameInfoPB.setRoomId(RoomMgr.Instance().roomLv);

        msg.setGameInfo(gameInfoPB);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);
        // this.require_mj_util.enterHall();
    },

    // 发起解散房间
    // --------------------------------
    // @param msg [object] 数据层发来的数据
    sponsorDissolveRoom: function (msg) {
        this.closePopupView();
        let jiesan_ui = cc.dd.UIMgr.getUI(this.require_jlmj_prefab.JLMJ_JIESAN);
        let mj_zhangji = cc.dd.UIMgr.getUI(this.require_jlmj_prefab.MJ_ZHANJITONGJI);
        if (!jiesan_ui && !mj_zhangji) {
            cc.dd.UIMgr.openUI(this.require_jlmj_prefab.JLMJ_JIESAN, function (ui) {
                ui.zIndex = UIZorder.MJ_LAYER_POPUP;
            });
        } else if (jiesan_ui && !jiesan_ui.active) {
            cc.dd.UIMgr.openUI(this.require_jlmj_prefab.JLMJ_JIESAN, function (ui) {
                ui.zIndex = UIZorder.MJ_LAYER_POPUP;
            });
        }
    },

    // 响应解散房间
    // --------------------------------
    // @param msg [object] 数据层发来的数据
    responseDissolveRoom: function (msg, isGoHall) {
        var jiesan_ui = cc.dd.UIMgr.getUI(this.require_jlmj_prefab.JLMJ_JIESAN);
        if (jiesan_ui) {
            jiesan_ui.getComponent("jlmj_sponsor_dissolve_view").updateAgreeUI();
        }
    },

    onPlayDuiJuAniEnd: function () {
        this._kaiJuAni.active = false;
    },

    /**
     * 打开宝牌
     */
    openBaoPai: function () {
        var baoPaiValue = this.require_DeskData.Instance().unBaopai;
        cc.log("宝牌值:", baoPaiValue);
        if (baoPaiValue >= 0 && this._baoPai) {
            this._baoPai.active = true;
            this.baopai.node.active = true;

            let use2D = this.require_DeskData.Instance().getIs2D();

            if (use2D) {
                let pa2d = this.require_DeskData.Instance().get2DPai();
                if (pa2d == 'blue') {
                    this.baopai.frame.spriteFrame = this.spf_baopai_ming_2d[1];
                } else if (pa2d == 'yellow') {
                    this.baopai.frame.spriteFrame = this.spf_baopai_ming_2d[2];
                } else {
                    this.baopai.frame.spriteFrame = this.spf_baopai_ming_2d[0];
                }
                this.baopai.value.node.skewX = 0;
                this.baopai.value.node.skewY = 0;
                this.baopai.value.node.x = 0;
                this.baopai.value.node.y = 10;
                this.baopai.value.node.anchorX = 0.5;
                this.baopai.value.node.anchorY = 0.5;
            } else {
                this.baopai.frame.spriteFrame = this.spf_baopai_ming;
                this.baopai.value.node.skewX = -3;
                this.baopai.value.node.skewY = 1;
                this.baopai.value.node.x = 4;
                this.baopai.value.node.y = 17;
                this.baopai.value.node.anchorX = 0.6;
                this.baopai.value.node.anchorY = 0.6;
            }

            // this.baopai.frame.spriteFrame = this.spf_baopai_ming;
            this.baopai.value.node.active = true;
            this.baopai.setValue(baoPaiValue);
        }
    },

    onPlayerHuangZhuangAniBegin: function () {
        this.da_pai_prompt.active = false;
        this.huangzhuang = this._huangZhuangAni.getComponent(sp.Skeleton);
        this.playSpine(this.huangzhuang, ['huangzhuang']);
    },

    onPlayerHuangZhuangAniEnd: function () {
        this._huangZhuangAni.active = false;
    },

    on_room_ready: function (msg) {
        if (msg.retCode !== 0) {
            var str = "";
            switch (msg.retCode) {
                case 1:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_8;
                    this.popupEnterHall(str, this.gobackHall.bind(this));
                    break;
                case 2:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_9;
                    this.popupEnterHall(str, this.gobackHall.bind(this));
                    break;
                case 3:
                    str = cc.dd.Text.TEXT_KLB_HALL_COMMON_11;
                    this.popupEnterHall(str, null);
                    break;
                case 4:
                    str = cc.dd.Text.TEXT_POPUP_20;
                    this.popupEnterHall(str, this.jbc_matching_leave_room_req);
                    break;
                case 5:
                    str = cc.dd.Text.TEXT_POPUP_16;
                    this.popupEnterHall(str, this.jbc_matching_leave_room_req);
                    break;
                default:
                    break;
            }
        } else {
            if (cc.dd.mj_game_start) {
                let playerList = this.require_playerMgr.Instance().playerList;
                playerList.forEach(function (playerMsg, idx) {
                    if (playerMsg && playerMsg.userid) {
                        var pd = this.require_playerMgr.Instance().getPlayer(playerMsg.userid);
                        pd.setReady(0);
                    }
                }, this);
            }
            // if(this.isDeskJBC()){
            //     this.require_playerMgr.Instance().clear();
            //     this.require_playerMgr.Instance().clearAlldapaiCding();
            //
            //     var player = this.require_playerMgr.Instance().getPlayer(msg.userId);
            //     if (player) {
            //         player.setReady(1);
            //     }
            //
            //     this.require_deskJBCData.getInstance().setIsMatching(true);
            // }
        }
    },

    on_room_leave: function (msg) {
        if (this.isDeskJBC() && (msg.userId == cc.dd.user.id || !cc.dd._.isNumber(msg.userId))) {
            this.gobackHall();
        }
    },

    on_room_replace: function (msg) {
        if (msg.retCode !== 0) {
            var str = "";
            switch (msg.retCode) {
                case 1:
                    str = cc.dd.Text.TEXT_POPUP_18;
                    this.popupEnterHall(str, this.jbc_matching_leave_room_req);
                    break;
                case 2:
                    str = cc.dd.Text.TEXT_POPUP_19;
                    this.popupEnterHall(str, this.jbc_matching_leave_room_req);
                    break;
                case 3:
                    str = cc.dd.Text.TEXT_POPUP_17;
                    this.popupEnterHall(str, null);
                    break;
                default:
                    break;
            }
        } else {
            var play_list = this._playerList.getComponent(mjComponentValue.playerList);
            if (play_list) {
                for (var i = 0; i < play_list.player_ui_arr.length; ++i) {
                    var headinfo = play_list.player_ui_arr[i];
                    if (headinfo && headinfo.head.player && headinfo.head.player.userId == cc.dd.user.id) {
                        headinfo.head.read.active = false;
                    }
                }
            }
            this.require_playerMgr.Instance().clear();
            this.playMatchAnim();
            this.require_deskJBCData.getInstance().setIsMatching(true);
            this.tuo_guan(false);

            this.setBtnActive(this._zhiShiQi, false);
        }
    },

    on_coin_room_enter: function () {
        cc.log("mj 播放防作弊");
        this.require_deskJBCData.getInstance().setIsMatching(true);
        if (this._btnMatch) {
            this._btnMatch.getComponent(cc.Button).interactable = true;
            this._btnMatch.active = false;
        }
        this.playMatchAnim();
        this.tuo_guan(false);
    },

    popupEnterHall: function (text, callfunc) {
        cc.dd.DialogBoxUtil.show(0, text, '确定', null, function () {
            if (callfunc) {
                callfunc();
            }
        }, function () { });
    },

    // 弹出离开房间确认框
    // --------------------------------
    // @param msg [object] 数据层发来的数据
    // @param callback [object] 确定后的回调函数
    // @param type [enum] 弹窗类型
    popViewTips: function (msg, callback, type) {
        cc.dd.UIMgr.openUI(this.require_jlmj_prefab.JLMJ_TANCHUANG, function (ui) {
            this.popupViewPrefab = ui;
            ui.zIndex = UIZorder.MJ_LAYER_POPUP;
            ui.getComponent("jlmj_popup_view").show(msg, callback, type, function () {
                this.popupViewPrefab = null;
            }.bind(this));
        }.bind(this));
    },

    py_ready: function () {
        cc.dd.mj_game_start = true;

        this.callNetReadFunc();
    },

    jbc_ready: function () {
        cc.dd.mj_game_start = true;

        var pbData = new cc.pb.room_mgr.msg_prepare_game_req();
        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType(RoomMgr.Instance().gameId);
        gameInfoPB.setRoomId(RoomMgr.Instance().roomLv);
        pbData.setGameInfo(gameInfoPB);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_prepare_game_req, pbData, "msg_prepare_game_req", true);

        var play_list = this._playerList.getComponent(mjComponentValue.playerList);
        if (play_list) {
            for (var i = 0; i < play_list.player_ui_arr.length; ++i) {
                var headinfo = play_list.player_ui_arr[i];
                if (headinfo && headinfo.head.player && headinfo.head.player.userId != cc.dd.user.id) {
                    headinfo.head.node.active = false;
                } else {
                    headinfo.head.read.active = true;
                }
            }
        }
    },

    setTingPaiUIActive: function (active) {
        if (this._tingButton) {
            this._tingButton.active = active;
        }
    },

    //玩家数据更细
    updatePlayerInfo: function () {
        let player_list = null;
        if (!this.isDeskJBC()) {
            if (!RoomMgr.Instance().player_mgr) {
                return;
            }
            player_list = RoomMgr.Instance().player_mgr.playerList;
        } else {
            player_list = this.require_playerMgr.Instance().playerList;
        }

        if (!cc.dd._.isArray(player_list)) {
            return;
        }

        for (var i in player_list) {
            if (!player_list[i]) {
                continue;
            }
            if (player_list[i].viewIdx == 0) {
                this._playerDownUI.active = true;
                this._headDownButton.active = !this.isDeskReplay();
            }
            if (player_list[i].viewIdx == 1) {
                this._playerRightUI.active = true;
                this._headRightButton.active = !this.isDeskReplay()
                this._headRight.active = true;
            }
            if (player_list[i].viewIdx == 2) {
                this._playerUpUI.active = true;
                this._headUpButton.active = !this.isDeskReplay();
                this._headUp.active = true;
            }
            if (player_list[i].viewIdx == 3) {
                this._playerLeftUI.active = true;
                this._headLeftButton.active = !this.isDeskReplay();
                this._headLeft.active = true;
            }
        }

        if (!this.isDeskReplay()) {
            this.zhinan.getComponent(mjComponentValue.zhinan).initDirection();
        }
        if (!this.isDeskJBC()) {
            var play_list = this._playerList.getComponent(mjComponentValue.playerList);
            if (this.isDeskReplay()) {
                play_list.playerUpdateUI();
            }
            play_list.refreshGPSWarn();
        }
    },

    /**
     * 玩家数量更新
     */
    updatePlayerNum: function (num) {
        if (this.isDeskFriend()) {
            //更新准备和邀请按钮
            if (num == RoomMgr.Instance()._Rule.usercountlimit) {
                if (this._btnInvite) {
                    this._btnInvite.active = false;
                }
                // if(this._btnInviteXL){
                //     this._btnInviteXL.active = false;
                // }
                this.setFriendGroupInvite(false);
                // if(this._btnReady && this._btnReady.active){
                //     this._btnReady.setPositionX(0);
                // }
            }
            else {
                if (this._btnInvite) {
                    this._btnInvite.active = true;
                }
                // if(this._btnInviteXL){
                //     this._btnInviteXL.active=true;
                // }
                this.setFriendGroupInvite(true);
                // if(this._btnReady && this._btnReady.active){
                //     this._btnReady.setPositionX(-196);
                // }
            }
        }
    },

    /**
     * 更新宝牌
     * @param baoPaiValue 宝牌的值 如果为null就去取数据层的数据
     * -2指没有宝牌-1宝牌盖着，其他为宝牌位置
     */
    updateBaoPai: function () {
        if (!this._baoPai) {
            return;
        }
        // if(this.require_DeskData.Instance().gameStatus != 2){
        if (this.require_UserPlayer.Instance().bready == 1) {  //只能用ready 现在没有游戏开始未开始字段
            cc.log('游戏未开始,宝牌隐藏');
            this._baoPai.active = false;
            this.baopai.node.active = false;
            return;
        }
        var baoPaiValue = this.require_DeskData.Instance().unBaopai;
        cc.log("更新宝牌UI,宝牌值=", baoPaiValue);
        //-2指没有宝牌-1宝牌盖着，其他为宝牌位置
        if (baoPaiValue == -2) {
            this._baoPai.active = false;
            this.baopai.node.active = false;
        } else if (baoPaiValue == -1) {
            this._baoPai.active = true;
            this.baopai = this._baoPai.getComponent(mjConfigValue.mjPai);
            this.baopai.node.active = true;

            let use2D = this.require_DeskData.Instance().getIs2D();

            if (use2D) {
                this.baopai.frame.spriteFrame = this.spf_baopai_an_2d;
            } else {
                this.baopai.frame.spriteFrame = this.spf_baopai_an;
            }

            // this.baopai.frame.spriteFrame = this.spf_baopai_an;
            this.baopai.value.node.active = false;
        } else {
            this._baoPai.active = true;
            this.baopai.node.active = true;

            let use2D = this.require_DeskData.Instance().getIs2D();

            if (use2D) {
                let pa2d = this.require_DeskData.Instance().get2DPai();
                if (pa2d == 'blue') {
                    this.baopai.frame.spriteFrame = this.spf_baopai_ming_2d[1];
                } else if (pa2d == 'yellow') {
                    this.baopai.frame.spriteFrame = this.spf_baopai_ming_2d[2];
                } else {
                    this.baopai.frame.spriteFrame = this.spf_baopai_ming_2d[0];
                }
                this.baopai.value.node.skewX = 0;
                this.baopai.value.node.skewY = 0;
                this.baopai.value.node.x = 0;
                this.baopai.value.node.y = 10;
                this.baopai.value.node.anchorX = 0.5;
                this.baopai.value.node.anchorY = 0.5;
            } else {
                this.baopai.frame.spriteFrame = this.spf_baopai_ming;
                this.baopai.value.node.skewX = -3;
                this.baopai.value.node.skewY = 1;
                this.baopai.value.node.x = 4;
                this.baopai.value.node.y = 17;
                this.baopai.value.node.anchorX = 0.6;
                this.baopai.value.node.anchorY = 0.6;
            }

            // this.baopai.frame.spriteFrame = this.spf_baopai_ming;
            this.baopai.value.node.active = true;
            this.baopai.setValue(baoPaiValue);
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
        }
    },

    /**
     * 更新房号
     * @param roomNum 房号 如果为null就去取数据层的数据
     */
    updateRoomNum: function (roomNum) {
        if (!roomNum) {
            roomNum = this.require_DeskData.Instance().roomNumber;
        }
        if (this._roomNum != null && this._roomID != null) {
            this._roomNum.active = true;
            this._roomID.getComponent(cc.Label).string = roomNum;
        }
    },

    updateRound: function (data) {
        this.updateCurrRound();
        this.currRoundTips(data);
    },

    /**
     * 更新当前圈数
     * @param currValue 当前圈数 如果为null就去取数据层的数据
     */
    updateCurrRound: function (currValue) {
        if (!this.isDeskReplay()) {
            if (!currValue) {
                currValue = this.require_DeskData.Instance().currPlayCount;
            }
            this._quanShu.getComponent(cc.Label).string = currValue;

            if (this.require_DeskData.Instance().isMatch() && this.require_DeskData.Instance().inJueSai) {
                let list = this.require_playerMgr.Instance().getPlayerList();
                let _list = [];
                for (let i = 0; i < list.length; i++) {
                    let player = list[i];
                    _list.push({ id: player.userId, coin: player.coin })
                }
                _list.sort((a, b) => {
                    if (a.coin <= b.coin) {
                        return 1;
                    } else {
                        return -1;
                    }
                })
                for (let i = 0; i < _list.length; i++) {
                    if (cc.dd.user.id == _list[i].id) {
                        this.rank.string = "第" + (i + 1) + "名"
                        break;
                    }
                }
                this.matchContent.string = this.require_DeskData.Instance().currPlayCount + "/" + this.totalNum + "局";
            }
        } else {
            this._quanShu.getComponent(cc.Label).string = com_replay_data.Instance().curRound;
        }
    },

    currRoundTips: function (data) {
        this.showTipsPop(this.getQuanJu(data[0]));
    },

    /**
     * 显示提示
     * @param event
     * @param data
     */
    showTipsPop: function (str) {
        if (!this.require_DeskData.Instance().isMatch()) {
            cc.dd.UIMgr.openUI(this.require_jlmj_prefab.JLMJ_TIPS_POP, function (ui) {
                ui.getComponent('jlmj_tips_pop').setText(str);
                ui.zIndex = UIZorder.MJ_LAYER_POPUP;
            }.bind(this));
        }
    },

    /**
     * 更新总圈数
     * @param totalValue 总圈数 如果为null就去取数据层的数据
     */
    updateTotalRound: function (totalValue) {
        if (!this.isDeskReplay()) {
            if (!totalValue) {
                totalValue = this.require_DeskData.Instance().totalPlayCount;
            }
            this._zongJu.getComponent(cc.Label).string = totalValue;
        } else {
            this._zongJu.getComponent(cc.Label).string = com_replay_data.Instance().totalRound;
        }
    },

    /**
     * 准备
     */
    onRead: function () {
        this.require_jlmj_audio_mgr.com_btn_click();

        cc.dd.mj_game_start = true;
        // 已经开始 区分发给房间管理器协议，还是游戏内的协议
        if (this.require_DeskData.Instance().isGameStart) {
            //var player = this.require_playerMgr.Instance().getPlayer(dd.user.id);
            //player.reqReady();
            this.callNetReadFunc();
        } else {

            var msg = new cc.pb.room_mgr.msg_prepare_game_req();
            var gameInfoPB = new cc.pb.room_mgr.common_game_header();
            gameInfoPB.setGameType(RoomMgr.Instance().gameId);
            gameInfoPB.setRoomId(RoomMgr.Instance().roomId);

            msg.setGameInfo(gameInfoPB);

            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_prepare_game_req, msg, "msg_prepare_game_req", true);

        }
    },

    /**
     * 开局
     */
    onMatch: function () {
        cc.dd.mj_game_start = true;
        if (this._btnMatch)
            this._btnMatch.getComponent(cc.Button).interactable = false;

        this.require_jlmj_audio_mgr.com_btn_click();
        var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
        msg.setGameType(RoomMgr.Instance().gameId);
        msg.setRoomId(RoomMgr.Instance().roomLv);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
    },

    /**
     * 邀请微信好友
     */
    onInvaite: function (event, custom) {
        if (event.type != "touchend") {
            return;
        }
        this.require_jlmj_audio_mgr.com_btn_click();

        let [gz_arr_box, , title, content, quanOrJu] = this.getGameGuiZe();
        if (cc.sys.isNative || cc.sys.platform == cc.sys.MOBILE_BROWSER) {
            // cc.dd.native_wx.SendAppContent(this.require_DeskData.Instance().roomNumber, title, content,  Platform.GetAppUrl(AppCfg.GAME_PID,AppCfg.PID));
            let wanFaTitle = gz_arr_box.shift();

            let playerList = this.require_playerMgr.Instance().getPlayerList();
            let playerName = [];
            playerList.forEach(function (playerMsg) {
                if (playerMsg && playerMsg.userId) {
                    playerName.push(playerMsg.name);
                }
            }, this);

            let info = {
                gameid: RoomMgr.Instance().gameId,//游戏ID
                roomid: RoomMgr.Instance().roomId,//房间号
                title: wanFaTitle,//房间名称
                content: gz_arr_box,//游戏规则数组
                usercount: RoomMgr.Instance()._Rule.usercountlimit,//人数
                jushu: RoomMgr.Instance()._Rule.boardscout,//局\圈数
                jushutitle: quanOrJu,//局\圈标题，默认局数
                playername: playerName,//玩家姓名数组
                gamestate: '未开始',//游戏状态
            }

            if (custom == 'XLNM') {
                cc.dd.native_wx.sendXlApp('', 'room_id=' + RoomMgr.Instance().roomId, title, content);
            } else if (custom == 'XL') {
                var login_module = require('LoginModule');
                var url = Platform.shareGameUrl + '?channel=' + (cc.dd.user.regChannel * 100 + login_module.Instance().loginType % 100);
                cc.dd.native_wx.sendXlLink(title, content, url);
            } else {
                cc.dd.native_wx.SendAppInvite(info, title, content, Platform.wxShareGameUrl[AppCfg.PID]);
            }
        }
        cc.log(title);
        cc.log(content);
    },

    onTingPaiTouch: function () {
        var jiaoInfo = this.require_UserPlayer.Instance().curJiaoPaiInfo();
        var ui_jiaoinfo = cc.dd.UIMgr.getUI(this.require_jlmj_prefab.JLMJ_JIAOPAI_INFO);
        if (this.mj_jiao_info && ui_jiaoinfo && ui_jiaoinfo.active) {
            this.mj_jiao_info.onClickClose();
            this.mj_jiao_info = null;
            return;
        }
        if (jiaoInfo != null) {
            cc.dd.UIMgr.openUI(this.require_jlmj_prefab.JLMJ_JIAOPAI_INFO, function (ui) {
                var play_list = this._playerList.getComponent(mjComponentValue.playerList);
                this.mj_jiao_info = ui.getComponent('mj_jiao_info');
                this.mj_jiao_info.init(play_list);
                this.mj_jiao_info.setJiaoPaiList(jiaoInfo);
                this.mj_jiao_info.showMask(true);
            }.bind(this));
        }
    },

    /**
     * 显示结算统计
     */
    onShowResultView: function () {
        if (!this.require_DeskData.Instance().isInMaJiang()) {
            return;
        }
        if (this._jiesuan) {
            this._jiesuan.node.active = false;
        }
        cc.dd.UIMgr.openUI(this.require_jlmj_prefab.MJ_ZHANJITONGJI, (ui) => {
            var fjinfo = this.getFJInfo();

            let [guize_arr] = this.getGameGuiZe();

            var gzinfo = Text.TEXT_PY_RULE_13 + guize_arr.filter(function (txt) { return txt != '' }).join(',');
            var playerList = this.require_playerMgr.Instance().playerList;
            var tongjiData = this.require_DeskData.Instance().getTongjiData();

            this.resultView = ui;
            ui.zIndex = UIZorder.MJ_LAYER_POPUP;
            var mj_zhanjitongji = ui.getComponent("mj_zhanjitongji");
            mj_zhanjitongji.init(fjinfo, gzinfo, playerList, tongjiData, () => {
                if (this.require_DeskData.Instance().isFriend()) {
                    this.require_mj_util.enterHall();
                }
            }, this.require_DeskData.Instance().isDajiesuan, () => {
                if (this._jiesuan) {
                    this._jiesuan.node.active = true;
                }
            });
        });
    },

    /**
     * 播放防作弊匹配动画
     */
    playMatchAnim: function () {
        this.setBtnActive(this._layerBaseScore, true);
        if (this._animMatching) {
            this._animMatching.active = true;
            this._animMatching.getComponent(dragonBones.ArmatureDisplay).playAnimation('FZZPPZ', -1);
        }
    },

    /**
     * 停止防作弊匹配动画
     */
    stopMatchAnim: function () {
        this.setBtnActive(this._layerBaseScore, false);
        this.setBtnActive(this._animMatching, false);
    },

    setRead: function (readyId) {
        cc.log("----准备按键隐藏----")
        var selfId = dd.user.id;
        this.require_DeskData.Instance().player_read_gamne = true;
        if (readyId === selfId && this._btnReady && this._btnInvite) {
            // this._btnInvite.setPositionX(0);
            this._btnReady.active = false;
        }
    },

    //更新金币
    hallUpdateCoin: function () {
        if (this.require_DeskData.Instance().isJBC()) {
            const hall_prop_data = require('hall_prop_data').HallPropData.getInstance();
            var coin = hall_prop_data.getCoin();
            var player = this.require_playerMgr.Instance().getPlayer(cc.dd.user.id);
            if (player) { player.setCoin(coin); }
        }
    },

    update_hall_data: function (msg) {
        if (this.isDeskReplay()) {
            if (cc.replay_looker_id) {
                cc.dd.user.id = cc.replay_looker_id;    //旁观者作为第一视角
            }
            cc.log('前后台切换,麻将回放场景中不返回大厅');
            return;
        }

        var jiesuan_ui = cc.dd.UIMgr.getUI(this.require_jlmj_prefab.JLMJ_JIESUAN);
        if (jiesuan_ui && jiesuan_ui.active) {
            cc.log("存在结算界面时,不返回大厅");
            return;
        }

        // cc.dd.DialogBoxUtil.show(0, "本局游戏未开始或已结束", '确定', null,
        //     function () {
        // 返回大厅
        this.require_playerMgr.Instance().clear();
        this.gobackHall();
        //     },
        //     function () {
        //     }
        // );
    },


    onEventMessage: function (event, data) {
        if (cc.replay_gamedata_scrolling) {
            return;
        }
        switch (event) {
            case this.require_DeskEvent.CHANGE_ROOM:
                this.change_room();
                break;
            case this.require_DeskEvent.CLEAR:
                this.clear(data);
                break;
            case this.require_DeskEvent.CHANGE_DESK_IMAGE:
                this.changeDeskImage(data);
                break;
            case this.require_DeskEvent.SPONSOR_DISSOLVE_ROOM:
                this.sponsorDissolveRoom(data[0]);
                break;
            case this.require_DeskEvent.RESPONSE_DISSOLVE_ROOM:
                this.responseDissolveRoom(data[0]);
                break;
            case this.require_DeskEvent.FAPAI:
                this.fapai();
                break;
            case this.require_DeskEvent.FEN_ZHANG:
                this.playerFenZhangAni();
                break;
            case this.require_DeskEvent.MO_PAI_FEN_ZHANG:
                this.hideFenZhangCard(data);
                break;
            case this.require_DeskEvent.EXIT_ROOM:
                this.exitRoom(data);
                break;
            case this.require_DeskEvent.HUANG_ZHUANG_ANI:
                this.onPlayerHuangZhuangAniBegin();
                break;
            case Hall.HallEvent.ACTIVE_PROPITEM_GET:
                cc.dd.UIMgr.openUI("gameyj_hall/prefabs/klb_hall_Active_Award", function (prefab) {
                    var component = prefab.getComponent('klb_hall_daily_lottery_get_award');
                    component.setAwradData(data.value);
                }.bind(this));
                break;
            case HallCommonEvent.HALL_NO_RECONNECT_GAME:
                this.update_hall_data(data[0]);
                break;
            case HallCommonEvent.HALL_UPDATE_ASSETS:
                this.hallUpdateCoin();
                break;
            case HallCommonEvent.LUCKY_STOP_TIMER:
                if (this._jiesuan) {
                    this._jiesuan.stopTime();
                }
                break;
            case HallCommonEvent.LUCKY_RESUME_TIMER:
                if (this._jiesuan) {
                    this._jiesuan.startTime(this._jiesuan._daojishiNum);
                }
                break;
            case this.require_DeskEvent.PY_READY:
                this.py_ready();
                break;
            case this.require_DeskEvent.JIESUAN:
                this.jiesuan(data);
                break;
            case this.require_DeskEvent.LEAVE_TIPS:  //解散提示
                this.leave_tips(data);
                break;
            case this.require_DeskEvent.OPEN_BAO_PAI:
                this.openBaoPai();
                break;
            case RoomEvent.on_room_enter:
                this.recoverDesk();
                break;
            case RoomEvent.on_room_ready:
                this.on_room_ready(data[0]);
                break;
            case RoomEvent.on_room_leave:
                this.on_room_leave(data[0]);
                break;
            case this.require_PlayerEvent.READY:
                this.setRead(data[0].userId);
                break;
            case this.require_DeskEvent.RECOVER_DESK:
                this.recoverDesk();
                break;
            case this.require_DeskEvent.START:
                this.hideDeskReady();
                break;
            case this.require_DeskEvent.SHOW_RESULT_VIEW:
                if (this.require_DeskData.Instance().isDajiesuan) {
                    if (data && data[0]) {
                        this.onShowResultView();
                    }
                } else {
                    this.onShowResultView();
                }
                break;
            case this.require_DeskEvent.UPDATE_PLAYER_NUM:
                this.updatePlayerNum(data);
                this.updatePlayerInfo();
                break;
            case this.require_DeskEvent.UPDATE_ROOM_NUM:
                this.updateRoomNum();
                break;
            case this.require_DeskEvent.UPDATE_BAO_PAI:
                this.updateBaoPai();
                break;
            case this.require_DeskEvent.UPDATE_REMAIN_CARD:
                this.updateRemainCard();
                break;
            case this.require_DeskEvent.UPDATE_CURR_ROUND:
                this.updateRound(data)
                break;
            case this.require_DeskEvent.UPDATE_TOTAL_ROUND:
                this.updateTotalRound();
                break;
            case this.require_DeskEvent.SHOW_DA_PAI_PROMPT://更新三色以及手把一提示
                this.on_show_da_pai_prompt(data);
                break;
            case this.require_DeskEvent.TIMEUP:
                if (!this._jiesuan) {
                    this.time_up_id = AudioManager.playSound(this.require_jlmj_audio_path.TIMEUP);
                }
                break;
            case this.require_DeskEvent.STOP_TIMEUP:
                if (this.time_up_id) {
                    AudioManager.stopSound(this.time_up_id);
                    this.time_up_id = null;
                }
                break;

            case SysEvent.PAUSE:
                cc.log("SysEvent.PAUSE " + RoomMgr.Instance().gameId + "麻将: 游戏切后台");
                // AudioManager.stopMusic();
                this.require_DeskED.notifyEvent(this.require_DeskEvent.CANCEL_EMIT, []);//取消已选的操作 如；杠 听
                this.onLockSceneTouch();
                break;
            case SysEvent.RESUME:
                cc.log("SysEvent.PAUSE " + RoomMgr.Instance().gameId + "麻将: 恢复游戏");
                // AudioManager.rePlayMusic();
                this.locakSceneTimeOut = setTimeout(() => {
                    this.onUnlockSceneTouch();
                    this.locakSceneTimeOut = null;
                }, 500);
                break;
            case this.require_DeskEvent.CHANGE_2D:
                this.change2D();
                break;
            case this.require_DeskEvent.HU:
                this.huAni(data[0]);
                break;
            ////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////
            case RoomEvent.on_room_replace:
                this.on_room_replace(data[0]);
                break;
            case RoomEvent.on_coin_room_enter:
                this.on_coin_room_enter();
                break;
            case this.require_DeskEvent.TUO_GUAN://朋友桌不显示托管
                this.tuo_guan(data);
                break;
            case this.require_DeskEvent.GAME_OPENING:
                this.game_opening(false);
                break;
            ////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////
            case this.require_DeskEvent.INIT:
                this.updateDesk();
                break;
            case this.require_DeskEvent.JBC_READY:
                this.jbc_ready();
                break;
            case this.require_DeskEvent.DISSOLVE_ROOM:
                if (RoomMgr.Instance().isJiLinMJ()) {
                    this.dissolveRoom(data);
                }
                break;
            case this.require_DeskEvent.LOCK_SCENE:
                this.onLockSceneTouch();
                break;
            case this.require_DeskEvent.UNLOCK_SCENE:
                this.onUnlockSceneTouch();
                if (this.locakSceneTimeOut) {
                    clearTimeout(this.locakSceneTimeOut);
                    this.locakSceneTimeOut = null;
                }
                break;
            case this.require_DeskEvent.NO_MARK_TIPS://没有分数点炮
                this.showNoMarkDianpao();
                break;
            case this.require_DeskEvent.TIPS_POP:
                this.showTipsPop(data);
                break;
            case this.require_DeskEvent.CLOSE_LEAVE_TIPS:
                this.closePopupView();
                break;
            case this.require_DeskEvent.RECTCONNECT:
                this.restConnect();
                this.require_DeskED.notifyEvent(this.require_DeskEvent.CANCEL_EMIT, []);//取消已选的操作 如；杠 听
                break;
            ////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////
            case BSC_Event.PLAY_ROUND:
                // if(!cc.dd.UIMgr.getUI(hall_prefab.KLB_MATCH_WAITROOM)){
                //     cc.dd.UIMgr.openUI(hall_prefab.KLB_MATCH_WAITROOM, function(ui){
                //     }.bind(this));
                // }
                this.updateMatch(data);
                break;
            case BSC_Event.RECONNECT_LINE:
                this.da_pai_prompt.active = false;
                this.matchRound = data.roundNum;
                // //当前局数
                this._quanShu.getComponent(cc.Label).string = '1';
                // //总局数
                this._zongJu.getComponent(cc.Label).string = '1';
                this.endLineInfo = data;
                if (!cc.dd.mj_game_start && this.require_DeskData.Instance().isMatch() && !this.require_DeskData.Instance().inJueSai) {
                    if (!this.require_DeskData.Instance().waitJiesuan) {
                        this.setBtnActive(this._matchLayout, false);
                        this.setBtnActive(this._gWeiXin, false);
                        this.setBtnActive(this._layerBaseScore, false);
                        this.setBtnActive(this._btnMatch, false);

                        let wait_node = cc.dd.UIMgr.getUI(hall_prefab.KLB_MATCH_WAITROOM);
                        if (!wait_node) {
                            cc.dd.UIMgr.openUI(hall_prefab.KLB_MATCH_WAITROOM, function (ui) {
                                ui.getComponent('klb_match_waitroom').show(data, this.lastJiesuan);
                            }.bind(this));
                        } else {
                            wait_node.getComponent('klb_match_waitroom').show(data, this.lastJiesuan);
                        }
                    }
                }
                break;
            case BSC_Event.SHOW_TIME:
                if (!this.require_DeskData.Instance().getIsStart() && this.require_DeskData.Instance().isMatch() && !this.require_DeskData.Instance().inJueSai) {
                    if (this._jiesuan && !this.isLastJiesuan) {
                        this._jiesuan.openMatchWithOutReq();
                        this._jiesuan = null;
                    }

                    this.setBtnActive(this._matchLayout, false);
                    this.setBtnActive(this._gWeiXin, false);
                    this.setBtnActive(this._layerBaseScore, false);
                    this.setBtnActive(this._btnMatch, false);

                    let wait_node = cc.dd.UIMgr.getUI(hall_prefab.KLB_MATCH_WAITROOM);
                    if (!wait_node) {
                        cc.dd.UIMgr.openUI(hall_prefab.KLB_MATCH_WAITROOM, function (ui) {
                            if (this.endLineInfo) {
                                ui.getComponent('klb_match_waitroom').show(this.endLineInfo, this.lastJiesuan);
                                this.endLineInfo = null;
                            }
                            ui.getComponent('klb_match_waitroom').showTime(data, this.lastJiesuan);
                        }.bind(this));
                    } else {
                        if (this.endLineInfo) {
                            wait_node.getComponent('klb_match_waitroom').show(this.endLineInfo, this.lastJiesuan);
                            this.endLineInfo = null;
                        }
                        wait_node.getComponent('klb_match_waitroom').showTime(data, this.lastJiesuan);
                    }
                }
                break;
            case BSC_Event.GAME_END:
                if (this.require_DeskData.Instance().isMatch()) {
                    let waittime = 0;
                    if (this.require_DeskData.Instance().waitJiesuan) {
                        waittime = 5000;
                    }
                    this.endTime = setTimeout(() => {
                        let end_node = cc.dd.UIMgr.getUI(hall_prefab.KLB_MATCH_END);
                        if (!end_node) {
                            cc.dd.UIMgr.openUI(hall_prefab.KLB_MATCH_END, function (ui) {
                                ui.getComponent('klb_match_end').show(data);
                            }.bind(this));
                        } else {
                            end_node.getComponent('klb_match_end').show(data);
                        }
                    }, waittime)
                }

                break;
            case BSC_Event.RANK_INFO:
                this.updateRank(data);
                break;
            case BSC_Event.SCORE_SHARE_RET:
                this.scoreShareRet();
                break;
            case BSC_Event.UPDATE_SCORE:
                this.scoreUpdate(data);
                break;
            case BSC_Event.IS_SHARED:
                this.weixinNotShow = data;
                this.setBtnActive(this._gWeiXin, this.require_DeskData.Instance().isMatch() && !data);
                break;
            default:
                break;
        }
    },

    change2D() {
        // if(cc.dd.mj_game_start){
        //     cc.dd.mj_change_2d_next_time = true;
        //     cc.dd.PromptBoxUtil.show('游戏已开始，将在下一局切换');
        //     return;
        // }

        this._change2D();
    },

    get2D() {
        return cc.sys.localStorage.getItem(cc.dd.AppCfg.GAME_ID + '_' + cc.dd.user.id + '_use2D') === 'true';
    },

    _change2D() {
        this.use2D = this.get2D();

        this.initLocalData();

        let zhinanIsActive = this.zhinan.active;

        if (this.use2D) {
            this.zhinan = this._zhinan_2d;
            this._zhinan.active = false;
            this._zhinan_2d.active = zhinanIsActive;

            if (this._baoPai) {
                this._baoPai.x = 117.4;
                this._baoPai.y = 29.5;
            }

            if (this._matchLayout) {
                this._matchLayout.skewX = 0;
                this._matchLayout.x = -124.3;
                this._matchLayout.y = 33;
            }
        } else {
            this.zhinan = this._zhinan;
            this._zhinan.active = zhinanIsActive;
            this._zhinan_2d.active = false;

            if (this._baoPai) {
                this._baoPai.x = 146;
                this._baoPai.y = 56;
            }

            if (this._matchLayout) {
                this._matchLayout.skewX = 8.2;
                this._matchLayout.x = -139.8;
                this._matchLayout.y = 51.9;
            }
        }
        this.updateBaoPai();

        // this.initZhiNan();
        //
        // if(!RoomMgr.Instance().player_mgr || !this.require_DeskData.Instance().isFriend()){
        // }else{
        //     this.zhinan.getComponent(mjComponentValue.zhiNanUI).initDirection();
        // }
        //
        // this._playerLeftUI.getComponent(mjComponentValue.playerLeftUI).resetConfig();
        // this._playerDownUI.getComponent(mjComponentValue.playerDownUI).resetConfig();
        // this._playerRightUI.getComponent(mjComponentValue.playerRightUI).resetConfig();
        // this._playerUpUI.getComponent(mjComponentValue.playerUpUI).resetConfig();

        var play_list = cc.find('Canvas/player_list').getComponent(mjComponentValue.playerList);
        play_list.changePaiUI();
        this.require_playerMgr.Instance().playerList.forEach(function (player, idx) {
            if (player) {
                player.changePaiUI();
            }
        })
    },

    huAni(data) {
        let delaytime = 2000;
        let huType = data;
        let huID = null;
        let func = () => {
            huID = null;
            if (huType.length > 0) {
                huID = this.getHuAni(huType.pop());
                if (!cc.dd._.isNull(huID)) {
                    this.playSpine(huID[0], huID[1], () => {
                        this.require_playerMgr.Instance().playing_special_hu -= delaytime;

                        if (this.require_playerMgr.Instance().playing_special_hu < 0) {
                            this.require_playerMgr.Instance().playing_special_hu = 0;
                        }
                        func();
                    })
                } else {
                    func();
                }
            } else {
                this.require_playerMgr.Instance().playing_special_hu = 0;
            }
        }

        func();
    },

    playSpine(spine, animList, func) {
        if (spine) {
            spine.node.active = true;
            for (let i = 0; i < animList.length - 1; i++) {
                spine.setMix(animList[i], animList[i + 1]);
            }
            let anim = animList.shift();
            spine.setAnimation(0, anim, false);
            spine.setCompleteListener(() => {
                if (animList.length > 0) {
                    anim = animList.shift();
                    spine.setAnimation(0, anim, false);
                } else {
                    spine.node.active = false;
                    if (func) {
                        func();
                    }
                }
            });
        } else if (func) {
            func();
        }

    },

    setFriendGroupInvite(visible) {
        if (this._fgInviteBtn) {
            if (visible) {
                this._fgInviteBtn.active = RoomMgr.Instance().isClubRoom();
            } else {
                this._fgInviteBtn.active = false;
            }
        }
    },

    setBtnActive(btnNode, active) {
        if (btnNode) {
            btnNode.active = active;
        }
    },

    isDeskFriend() {
        return this.deskType == DESK_TYPE.FRIEND;
    },

    isDeskJBC() {
        return this.deskType == DESK_TYPE.JBC;
    },

    isDeskReplay() {
        return this.deskType == DESK_TYPE.REPLAY;
    },
    ////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////
    game_opening: function () {
        if (!this.require_DeskData.Instance().inJueSai) {
            this.weixinNotShow = false;
        }

        this.require_deskJBCData.getInstance().setIsStart(true);
        this.require_deskJBCData.getInstance().setIsMatching(false);
        this.require_DeskData.Instance().player_read_gamne = false;

        this.setBtnActive(this._layerBaseScore, false);
        this.setBtnActive(this._matchLayout, this.require_DeskData.Instance().isMatch());
        this.setBtnActive(this._gWeiXin, this.require_DeskData.Instance().isMatch() && !this.weixinNotShow);
        if (this._messageBtn) {
            this._messageBtn.getComponent(cc.Button).interactable = true;
            this._messageBtn.active = true;
        }
        /*cc.find("Canvas/down_head_button").active = true;
        cc.find("Canvas/right_head_button").active = true;
        cc.find("Canvas/up_head_button").active = true;
        cc.find("Canvas/left_head_button").active = true;*/
        this.stopMatchAnim();
    },

    /**
     * 显示托管节点
     */
    tuo_guan: function (isShow) {
        if (isShow) {
            this._menu_list.getComponent(mjComponentValue.gameMenuList).closeMenuAndOptions();
            let player_down_ui = this._playerDownUI.getComponent(mjComponentValue.playerDownUI);
            player_down_ui.setShoupaiTouch(true);
            player_down_ui.setShoupaiTingbiaoji(false);
            player_down_ui.touchCardMode = 1;
            player_down_ui.closeJiaoInfo();
        }
        this.setBtnActive(this._layerTuoGuan, isShow);
    },

    /**
     * 重连成功 事件
     */
    restConnect: function () {
        if (this._jiesuan) {
            this._jiesuan.close();
            this._jiesuan = null;
        }
    },

    // 直接解散房间
    // --------------------------------
    // @param msg [object] 数据层发来的数据
    dissolveRoom: function (msg) {
        this.closePopupView();
        var data = this.require_DeskData.Instance().getTongjiData();
        if (!data) {//是否有大结算显示
            var content = "";
            if (msg.bankerid == 0) {
                this.gobackHall();
                return;
            }

            if (msg.bankerid != dd.user.id) {
                content = cc.dd.Text.TEXT_DESK_INFO_5;
                this.popViewTips(content, this.gobackHall.bind(this), PopupType.OK);
            } else {
                this.gobackHall();
            }
        }

    },

    onLockSceneTouch: function () {
        this.setBtnActive(this.layer_disabled, true);
    },

    onUnlockSceneTouch: function () {
        this.setBtnActive(this.layer_disabled, false);
    },
    ////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////
    //积分分享
    onScoreShare(event, data) {
        if (!this._jiesuan) {
            let Platform = require('Platform');
            let login_module = require('LoginModule');
            cc.dd.native_wx.SendAppContent('', '【巷乐游戏】长春麻将比赛场！抢红包！最高可领100元', '【巷乐游戏】快来玩，免费参赛，送红包！送金币！人人有份！速来>>>', Platform.shareGameUrl + '?channel=' + (cc.dd.user.regChannel * 100 + login_module.Instance().loginType % 100), 1);
        }
    },

    updateRank(data) {
        this.rank.string = "第" + data.rank + "名"
    },

    updateMatch(data) {
        switch (data.roundType) {
            case 1:
            case 2:
                this.matchTitle.string = "预赛"
                this.require_DeskData.Instance().inJueSai = false;
                break;
            case 3:
                this.matchTitle.string = "晋级赛"
                this.require_DeskData.Instance().inJueSai = false;
                break;
            case 4:
            case 5:
                this.matchTitle.string = "决赛"
                this.require_DeskData.Instance().inJueSai = true;
                break;

        }

        this.matchRound = data.roundNum;
        this.totalNum = data.gameNum;

        if (!this.require_DeskData.Instance().inJueSai) {
            this.require_DeskData.Instance().setCurrRound(data.curGame);
            if (data.roundNum == 0) {
                this.matchContent.string = this.require_DeskData.Instance().currPlayCount + "/4局";
            } else {
                this.matchContent.string = "第" + data.roundNum + "轮"
            }

            // //当前局数
            this._quanShu.getComponent(cc.Label).string = data.curGame;
            // //总局数
            this._zongJu.getComponent(cc.Label).string = data.gameNum;
        }
    },

    scoreShareRet: function () {
        this.weixinNotShow = true;
        this.setBtnActive(this._gWeiXin, false);
    },

    scoreUpdate(data) {
        var player = this.require_playerMgr.Instance().getPlayer(data[0]);
        if (player) {
            let view = player.viewIdx;
            var node = cc.find('Canvas/desk_node/update_score');
            node.getChildByName('score' + view).getChildByName('ani').getChildByName('lbl').getComponent(cc.Label).string = data[1].toString();
            node.getChildByName('score' + view).getChildByName('ani').getComponent(cc.Animation).play();
        }
    },

    initMJConfig() {
        return require('mjConfigValue').jlmj;
    },
    ////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////

    /**
     * 初始化properties
     */
    initProperties() {
        cc.log("-----------------------no implements base_mj_desk_info initProperties-----------------------")
    },

    /**
     * 清理胡牌动画
     */
    clearHuAni() {
        cc.log("-----------------------no implements base_mj_desk_info initProperties-----------------------")
    },

    /**
     * 获取规则说明
     * @returns {*[]}
     */
    getGameGuiZe() {
        cc.log("-----------------------no implements base_mj_desk_info getGameGuiZe-----------------------")
        //return guize_arr, gz_arr, title, content
        return [[], [], '', '']
    },

    /**
     * 发送准备消息
     */
    callNetReadFunc() {
        var msg = new cc.pb.mjcommon.mj_req_ready();
        cc.gateNet.Instance().sendMsg(cc.netCmd.mjcommon.cmd_mj_req_ready, msg, "mj_req_ready");
    },

    callNetRunScoreFunc(data) {
        let score = cc.dd._.isNumber(data) ? data : Number(data);
        var msg = new cc.pb.mjcommon.mj_req_paofen();
        msg.setScore(score);
        cc.gateNet.Instance().sendMsg(cc.netCmd.mjcommon.cmd_mj_req_paofen, msg, "mj_req_paofen", true);
    },

    getFJInfo() {
        cc.log("-----------------------no implements base_mj_desk_info getFJInfo-----------------------")
        return '';
    },

    /**
     * 取消托管
     */
    cleanTuoGuanBtnCallBack: function () {
        if (this.require_DeskData.Instance().isoffline) {
            const req = new cc.pb.mjcommon.mj_req_update_deposit();
            req.setIsdeposit(false);
            cc.gateNet.Instance().sendMsg(cc.netCmd.mjcommon.cmd_mj_req_update_deposit, req, "mj_req_update_deposit", true);
            cc.log('取消托管')
        }
    },

    /**
     * 发送重连消息
     */
    sendReloadOK() {
        var msg = new cc.pb.mjcommon.mj_req_reloading_ok();
        cc.gateNet.Instance().sendMsg(cc.netCmd.mjcommon.cmd_mj_req_reloading_ok, msg, "mj_req_reloading_ok");
    },

    onClickLastJieSuan() {
        this.require_jlmj_audio_mgr.com_btn_click();
        this.require_DeskED.notifyEvent(this.require_DeskEvent.JIESUAN, [this.lastJiesuan, true]);
    },

    setLastJieSuanActive() {
        this.setBtnActive(this._lastJieSuanBtn, this.lastJiesuan);
    },

    /**
     * 获取圈数或局数
     * @param data
     * @returns {string}
     */
    getQuanJu(data) {
        cc.log("-----------------------no implements base_mj_desk_info getQuanJu-----------------------")
        return '';
    },

    /**
     * 获取全屏胡牌动画名称
     * @param id
     * @returns {null}
     */
    getHuAni(id) {
        cc.log("-----------------------no implements base_mj_desk_info getHuAni-----------------------")
        return null;
    },

    /**
     * 系统提示
     * @param data
     */
    on_show_da_pai_prompt: function (data) {
        cc.log("-----------------------no implements base_mj_desk_info on_show_da_pai_prompt-----------------------")
    },

    //朋友场离开已开始
    py_dissolve_room_req: function () {
        cc.log("【UI】发送离开 朋友场离开已开始 发起解散房间请求");
        var msg = new cc.pb.mjcommon.mj_req_sponsor_dissolve_room();
        msg.setSponsorid(dd.user.id);
        cc.gateNet.Instance().sendMsg(cc.netCmd.mjcommon.cmd_mj_req_sponsor_dissolve_room, msg, "mj_req_sponsor_dissolve_room");

    },

    initMJComponet() {
        cc.log("-----------------------no implements base_mj_desk_info initMJComponet-----------------------")
        return require('mjComponentValue').base_mj;
    }
});
module.exports = baseDeskInfo;