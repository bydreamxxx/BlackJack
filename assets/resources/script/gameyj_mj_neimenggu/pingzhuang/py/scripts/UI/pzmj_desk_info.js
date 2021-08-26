var dd = cc.dd;

var mj_audio = require('nmmj_audio');

var RoomMgr = require("jlmj_room_mgr").RoomMgr;

var Text = cc.dd.Text;
var com_replay_data = require('com_replay_data').REPLAY_DATA;

let base_mj_desk_info = require('base_mj_desk_info');
let mjComponentValue = null;


var baseDeskInfo = cc.Class({
    extends: base_mj_desk_info,

    properties: {
        readySpriteFrame: cc.SpriteFrame,
        beginSpriteFrame: cc.SpriteFrame,
    },

    ctor() {
        mjComponentValue = this.initMJComponet();
        let local_result = cc.sys.localStorage.getItem(cc.dd.user.id + '_chifeng_use2D');
        if (cc.dd._.isNull(local_result)) {
            cc.sys.localStorage.setItem(cc.dd.user.id + '_chifeng_use2D', 'true');
        }
    },

    initProperties: function () {
        this.logo = cc.find("Canvas/desk_node/c-logo-pingzhuang").getComponent(cc.Sprite);
        this.run_score = cc.find("Canvas/pzmj_run_score");
        this.run_score.active = false;
        this.run_scoreTips = cc.find("Canvas/desk_node/run_score_prompt");
        this.run_scoreTipsLabel = cc.find("Canvas/desk_node/run_score_prompt/prompt_label").getComponent(cc.Label);
        this.run_scoreTips.active = false;
        this.gameready = cc.find("Canvas/desk_node/beforeGame");
        this.gameready.active = this.isDeskFriend();
    },

    initDeskUI: function () {
        this._super();

        if (!this.isDeskJBC()) {
            this._gz = cc.find("Canvas/toppanel/gzNode")
            this._btnDissolve = cc.find("Canvas/toppanel/btn_dissolve");
            this._roomNum = cc.find("Canvas/toppanel/gzNode/shuNode/room_num");
            this._roomID = cc.find("Canvas/toppanel/gzNode/shuNode/room_num/room_id");
        }
    },

    setDefaultDeskUI() {
        this._super();

        // this.setBtnActive(this._btnInviteXL, this.isDeskFriend());
        this.setBtnActive(this._btnDissolve, this.isDeskFriend && !RoomMgr.Instance().isClubRoom() && RoomMgr.Instance().isRoomer(cc.dd.user.id) && !RoomMgr.Instance().isDaiKai());
        this.setBtnActive(this._roomNum, this.isDeskFriend());

        if (this.isDeskFriend()) {
            if (RoomMgr.Instance().isRoomer(cc.dd.user.id)) {
                let allReady = 0;
                let playerList = this.require_playerMgr.Instance().getPlayerList();
                playerList.forEach((player) => {
                    if (player && player.bready) {
                        allReady++;
                    }
                })
                if (allReady == RoomMgr.Instance()._Rule.usercountlimit - 1) {
                    this._btnReady.getComponent(cc.Button).interactable = true;
                } else {
                    this._btnReady.getComponent(cc.Button).interactable = false;
                }

                this._btnReady.getComponent(cc.Sprite).spriteFrame = this.beginSpriteFrame;
            } else {
                this._btnReady.getComponent(cc.Sprite).spriteFrame = this.readySpriteFrame;
            }
        }
    },

    initDeskData() {
        this._super();
        if (this.isDeskReplay()) {
            this._zongJu.getComponent(cc.Label).string = com_replay_data.Instance().totalRound;
            this._quanShu.getComponent(cc.Label).string = com_replay_data.Instance().curRound;
        }
    },

    initGuiZeInfo() {
        this._super();
        if (this.isDeskReplay()) {
            this._gz.active = true;
            var mj_guize = this._gz.getComponent("mj_guize");

            let [_, guize_arr] = this.getGameGuiZe();
            mj_guize.addGuize(guize_arr, false);
        }
    },

    updateTotalRound: function (totalValue) {
        this._super(totalValue);
        if (this.isDeskReplay()) {
            this._zongJu.getComponent(cc.Label).string = com_replay_data.Instance().totalRound;
        }
    },

    updateCurrRound: function (currValue) {
        this._super(currValue);
        if (this.isDeskReplay()) {
            this._quanShu.getComponent(cc.Label).string = com_replay_data.Instance().curRound;
        }
    },

    /**
     * 获取文字玩法
     */
    getGameGuiZe: function () {
        let cur_rule = RoomMgr.Instance()._Rule;
        let gz_arr_box = [];
        gz_arr_box.push(cc.dd.Text.TEXT_PY_RULE_153.format([RoomMgr.Instance()._Rule.usercountlimit]));
        RoomMgr.Instance()._Rule.is37jia ? gz_arr_box.push(Text.TEXT_PY_RULE_121) : null;
        gz_arr_box.push(RoomMgr.Instance()._Rule.paofen > 0 ? Text.TEXT_PY_RULE_124.format(RoomMgr.Instance()._Rule.paofen) : (RoomMgr.Instance()._Rule.paofen == -1 ? Text.TEXT_PY_RULE_122 : Text.TEXT_PY_RULE_123));

        let text = gz_arr_box.join(',');

        let gz_arr_info = [];
        let juquan_txt = RoomMgr.Instance()._Rule.mode == 0 ? Text.TEXT_PY_RULE_11 : Text.TEXT_PY_RULE_10;

        gz_arr_info.push({ str: Text.TEXT_PY_RULE_153.format([RoomMgr.Instance()._Rule.usercountlimit]), nodetype: 0 });
        gz_arr_info.push({ str: juquan_txt.format([RoomMgr.Instance()._Rule.boardscout]), nodetype: 0 });
        gz_arr_info.push({ str: RoomMgr.Instance()._Rule.is37jia ? Text.TEXT_PY_RULE_121 : '', nodetype: 1 });
        gz_arr_info.push({ str: RoomMgr.Instance()._Rule.paofen > 0 ? Text.TEXT_PY_RULE_124.format(RoomMgr.Instance()._Rule.paofen) : (RoomMgr.Instance()._Rule.paofen == -1 ? Text.TEXT_PY_RULE_122 : Text.TEXT_PY_RULE_123), nodetype: 1 });

        let title = cc.dd.Text.TEXT_PY_RULE_154.format(this.require_playerMgr.Instance().playerList.length);
        title += " " + "房间号:" + (RoomMgr.Instance().roomId || 888888);
        let content = '共' + cur_rule.boardscout + '' + (cur_rule.mode == 0 ? '圈' : '局');
        content += " " + text.replace("麻将", "");

        return [gz_arr_box, gz_arr_info, title, content, cur_rule.mode == 0 ? '圈数' : '局数'];
    },

    /**
     * 恢复数据适用
     */
    recoverDesk: function () {
        this._super();
        if (this.run_scoreTips.active || this.run_score.active) {
            this._deskNode.getComponent(mjComponentValue.scene).jlmjPlayerDownSortShouPai();
        }
        this.run_scoreTips.active = false;
        this.run_score.active = false;
    },
    /**
     * 隐藏 桌子上的准备 邀请
     */
    hideDeskReady: function () {
        this._super();
        if (this.require_DeskData.Instance().isFriend()) {
            this._btnDissolve.active = false;
            // this._btnInviteXL.active = false;
            this._gz.active = true;
            this._roomNum.active = true;
        }
    },


    /**
     * 更新游戏状态
     * @param status 1：未开始 2：已开始
     */
    updateGameStatus: function (status) {
        this._super(status);

        if (!this.isDeskJBC()) {
            this._gz.active = true;
            this._roomNum.active = true;
        }

        if (!this.require_DeskData.Instance().isGameStart) {
            return;
        }

        if (!status)
            status = this.require_DeskData.Instance().gameStatus;
        if (status == 1) {
            if (this.require_DeskData.Instance().isFriend()) {
                this.gameready.active = true;
                // this._btnInviteXL.active = true;
                this._btnDissolve.active = !RoomMgr.Instance().isClubRoom() && RoomMgr.Instance().isRoomer(cc.dd.user.id) && !RoomMgr.Instance().isDaiKai();

                if (RoomMgr.Instance().isRoomer(cc.dd.user.id)) {
                    let allReady = 0;
                    let playerList = this.require_playerMgr.Instance().getPlayerList();
                    playerList.forEach((player) => {
                        if (player && player.bready) {
                            allReady++;
                        }
                    })
                    if (allReady == RoomMgr.Instance()._Rule.usercountlimit - 1) {
                        this._btnReady.getComponent(cc.Button).interactable = true;
                    } else {
                        this._btnReady.getComponent(cc.Button).interactable = false;
                    }

                    this._btnReady.getComponent(cc.Sprite).spriteFrame = this.beginSpriteFrame;
                } else {
                    this._btnReady.getComponent(cc.Sprite).spriteFrame = this.readySpriteFrame;
                }
            }
        } else if (status == 2) {
            if (this.require_DeskData.Instance().isFriend()) {
                let allReady = 0;
                let playerList = this.require_playerMgr.Instance().getPlayerList();
                playerList.forEach((player) => {
                    if (player && player.bready) {
                        allReady++;
                    }
                })
                this.gameready.active = allReady != 0;
                // this._btnInviteXL.active = false;
                this._btnDissolve.active = false;

            }
        }
    },


    playJieSuanAudio() {

    },

    /**
     * 发牌
     */
    fapai: function () {
        this.gameready.active = false;
        this.run_scoreTips.active = false;
        this.run_score.active = false;

        this._deskNode.getComponent(mjComponentValue.scene).jlmjPlayerDownSortShouPai();

        this.db_duiju = this._kaiJuAni.getComponent(dragonBones.ArmatureDisplay);
        this.db_duiju.node.active = true;
        this.db_duiju.playAnimation("DJKS", 1);
        this.db_duiju.removeEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.onPlayDuiJuAniEnd, this);
        this.db_duiju.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.onPlayDuiJuAniEnd, this);
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
                    this.popupEnterHall(str, this.gobackHall.bind(this));
                    break;
                case 5:
                    str = cc.dd.Text.TEXT_POPUP_16;
                    this.popupEnterHall(str, this.gobackHall.bind(this));
                    break;
                default:
                    break;
            }
        } else {


            if (this.isDeskJBC()) {
                if (msg.userId == cc.dd.user.id) {
                    this.require_playerMgr.Instance().clear();
                    this.require_playerMgr.Instance().clearAlldapaiCding();

                    var player = this.require_playerMgr.Instance().getPlayer(msg.userId);
                    if (player) {
                        player.setReady(1);
                    }

                    this.require_deskJBCData.getInstance().setIsMatching(true);
                }
            } else if (this.isDeskFriend()) {
                if (RoomMgr.Instance().isRoomer(cc.dd.user.id) && this.require_playerMgr.Instance().getPlayerNum() == RoomMgr.Instance()._Rule.usercountlimit) {
                    let allReady = 0;
                    let playerList = this.require_playerMgr.Instance().getPlayerList();
                    playerList.forEach((player) => {
                        if (player && player.bready) {
                            allReady++;
                        }
                    })
                    if (allReady == RoomMgr.Instance()._Rule.usercountlimit - 1) {
                        this._btnReady.getComponent(cc.Button).interactable = true;
                    }
                }
            }
        }
    },

    callNetReadFunc: function () {
        this._super();

        this.gameready.active = this.isDeskFriend();
    },


    /**
     * 玩家数量更新
     */
    updatePlayerNum: function (num) {
        this._super(num);
        //更新准备和邀请按钮
        if (this.isDeskFriend()) {
            if (num == RoomMgr.Instance()._Rule.usercountlimit) {
                // this._btnInviteXL.active = false;

                if (RoomMgr.Instance().isRoomer(cc.dd.user.id)) {
                    let allReady = 0;
                    let playerList = this.require_playerMgr.Instance().getPlayerList();
                    playerList.forEach((player) => {
                        if (player && player.bready) {
                            allReady++;
                        }
                    })
                    if (allReady == RoomMgr.Instance()._Rule.usercountlimit - 1) {
                        this._btnReady.getComponent(cc.Button).interactable = true;
                    }
                    this._btnReady.getComponent(cc.Sprite).spriteFrame = this.beginSpriteFrame;
                } else {
                    this._btnReady.getComponent(cc.Sprite).spriteFrame = this.readySpriteFrame;
                }

            } else {
                // this._btnInviteXL.active = true;
                this._btnReady.x = 0;


                if (RoomMgr.Instance().isRoomer(cc.dd.user.id)) {
                    this._btnReady.getComponent(cc.Button).interactable = false;
                }
            }

            var gps = cc.dd.UIMgr.getUI(this.require_jlmj_prefab.NMMJ_GPS);
            if (gps) {
                gps.getComponent('jlmj_gps').setGpsData(this.require_playerMgr.Instance().playerList);
            }
        }
    },

    getQuanJu: function (data) {
        var text = RoomMgr.Instance()._Rule.mode != 0 ? cc.dd.Text.TEXT_DESK_INFO_7 : cc.dd.Text.TEXT_DESK_INFO_1;
        var str = text.format([data]);
        return str;
    },

    on_show_da_pai_prompt: function (data) {
        if (data[1] != null && this.da_pai_prompt) {
            if (data[0] == -1 && this.dapai_tip_type == 0 && data[1] == false) {
                return;
            }
            if (data[0] == -2 && this.dapai_tip_type == 1 && data[1] == false) {
                return;
            }
            this.dapai_tip_type = data[0];
            this.da_pai_prompt.active = data[1];
            var text_arr = [Text.TEXT_MJ_DESK_INFO_0, Text.TEXT_MJ_DESK_INFO_11];
            this.da_pai_prompt_label.string = text_arr[data[0]];
        }
    },


    getFJInfo() {
        var fj_arr = [];
        var juquan_txt = RoomMgr.Instance()._Rule.mode == 0 ? Text.TEXT_PY_RULE_11 : Text.TEXT_PY_RULE_10;

        // fj_arr.push(Text.TEXT_PY_RULE_153.format([RoomMgr.Instance()._Rule.usercountlimit]));
        fj_arr.push(Text.TEXT_PY_RULE_12 + RoomMgr.Instance().roomId);
        fj_arr.push(juquan_txt.format([RoomMgr.Instance()._Rule.boardscout]));

        return fj_arr.join(' ');
    },

    setRead: function (readyId) {
        cc.log("----准备按键隐藏----")
        var selfId = dd.user.id;
        this.require_DeskData.Instance().player_read_gamne = true;
        if (readyId === selfId && this._btnReady && this._btnInvite) {
            this._btnReady.active = false;
        }
    },

    /**
     * 显示战绩统计
     */
    onShowResultView: function () {
        if (this._jiesuan) {
            this._jiesuan.node.active = false;
        }
        this._super();
    },

    onEventMessage: function (event, data) {
        if (cc.replay_gamedata_scrolling) {
            return;
        }
        switch (event) {
            case this.require_DeskEvent.SHOW_PAO_FEN://跑分
                data = Number(data);
                this.gameready.active = this.isDeskFriend();
                this.run_score.active = data < 0;
                this.run_scoreTips.active = data >= 0;
                this.setRunScoreTips(data);
                var play_list = cc.find('Canvas/player_list').getComponent(mjComponentValue.playerList);
                play_list.player_ui_arr.forEach((player) => {
                    player.hidewShouPai();
                })
                break;
            case this.require_DeskEvent.TIPS_POP:
                let str = null;
                if (cc.dd._.isArray(data)) {
                    str = data[0];
                    if (data[1]) {//连庄
                        let _audio = ['zuozhuang1', 'zuozhuang1'];
                        let index = cc.dd.Utils.random(0, _audio.length - 1);
                        mj_audio.playAudioBySex(_audio[index], data[1].sex);
                    }
                } else {
                    str = data;
                }
                this.showTipsPop(str);
                return;
            default:
                break;
        }
        this._super(event, data);

    },

    get2D() {
        return cc.sys.localStorage.getItem(cc.dd.user.id + '_chifeng_use2D') === 'true';
    },

    onClickRunScore(event, data) {
        this.require_jlmj_audio_mgr.com_btn_click();

        this.run_score.active = false;
        this.run_scoreTips.active = true;
        this.setRunScoreTips(data);
        this.callNetRunScoreFunc(data);
    },

    setRunScoreTips(data) {
        let text = "你已选择："
        switch (Number(data)) {
            case 2:
                text += '2分';
                break;
            case 3:
                text += '3分';
                break;
            case 4:
                text += '4分';
                break;
            case 5:
                text += '5分';
                break;
            case 0:
                text += '过';
                break;
            default:
                text += '2分';
                break;
        }
        this.run_scoreTipsLabel.string = text;
    },

    onClickDissovle() {
        this.require_jlmj_audio_mgr.com_btn_click();
        this.leave_tips();
    },

    initMJConfig() {
        return require('mjConfigValue').nmmj;
    },

    initMJComponet() {
        return require("mjComponentValue").pzmj;
    }
});
module.exports = baseDeskInfo;