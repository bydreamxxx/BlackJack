// create by wj 2019/04/22
const Prefix = 'gameyj_new_dsz/common/audio/';
var AudioManager = require('AudioManager');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var deskData = require('new_dsz_desk').New_DSZ_Desk_Data.Instance();
var playerMgr = require('new_dsz_player_manager').New_DSZ_PlayerMgr.Instance();
var dsz_send_msg = require('dsz_send_msg');
var jlmj_prefab = require('jlmj_prefab_cfg');
var config_state = require('dsz_config').DSZ_UserState;
var login_module = require('LoginModule');

cc.Class({
    extends: cc.Component,

    properties: {
        m_oMusic_toggle: cc.Toggle,
        m_oSound_toggle: cc.Toggle,
        m_oQuitBtn: cc.Node,
        m_oChangeBtn: cc.Node,
    },

    onLoad() {
        var music = AudioManager.getInstance()._getLocalMusicSwitch();
        var sound = AudioManager.getInstance()._getLocalSoundSwitch();

        if (!music) {
            this.m_oMusic_toggle.isChecked = false;
            AudioManager.getInstance().offMusic();
        }
        else {
            this.m_oMusic_toggle.isChecked = true;
            //AudioManager.getInstance().onMusic(Prefix + 'yqp3_bgm');
        }

        if (!sound) {
            this.m_oSound_toggle.isChecked = false;
            AudioManager.getInstance().offSound();
        }
        else {
            this.m_oSound_toggle.isChecked = true;
            AudioManager.getInstance().onSound();

        }

        if (deskData.getGameId() != 136) {
            this.m_oChangeBtn.active = false;
            this.m_oQuitBtn.x = 0;
        } else {
            if (deskData.roundResult) {
                this.m_oChangeBtn.getComponent(cc.Button).interactable = false;
                this.m_oChangeBtn.getChildByName('desc_btn').getComponent(cc.Button).interactable = false;
            } else {
                var selfInfo = playerMgr.findPlayerByUserId(cc.dd.user.id);
                if (selfInfo) {
                    var gamedata = selfInfo.getPlayerGameInfo();
                    if (gamedata && (gamedata.userState == config_state.UserStateWait || gamedata.userState == config_state.UserStateFold || gamedata.userState == config_state.UserStateLost || gamedata.userState == 0)) {
                        this.m_oChangeBtn.getComponent(cc.Button).interactable = true;
                        this.m_oChangeBtn.getChildByName('desc_btn').getComponent(cc.Button).interactable = true;
                    } else {
                        this.m_oChangeBtn.getComponent(cc.Button).interactable = false;
                        this.m_oChangeBtn.getChildByName('desc_btn').getComponent(cc.Button).interactable = false;
                    }
                } else {
                    this.m_oChangeBtn.getComponent(cc.Button).interactable = false;
                    this.m_oChangeBtn.getChildByName('desc_btn').getComponent(cc.Button).interactable = false;

                }
            }

        }
    },

    //设置音乐音效
    onSetMusic: function (event, data) {
        //hall_audio_mgr.com_btn_click();
        switch (data) {
            case 'music':
                if (AudioManager.getInstance()._getLocalMusicSwitch()) {//on  需要关闭
                    this.m_oMusic_toggle.isChecked = false;
                    AudioManager.getInstance().offMusic();
                }
                else {
                    this.m_oMusic_toggle.isChecked = true;
                    AudioManager.getInstance().onMusic(Prefix + 'yqp3_bgm');
                }
                break;
            case 'sound':
                if (AudioManager.getInstance()._getLocalSoundSwitch()) {//on  需要关闭
                    this.m_oSound_toggle.isChecked = false;
                    AudioManager.getInstance().offSound();
                }
                else {
                    this.m_oSound_toggle.isChecked = true;
                    AudioManager.getInstance().onSound();
                }
                break;
            default:
                cc.error('setMusic failed. arg error');
                break;
        }
    },

    //返回大厅
    backToHall: function () {
        AudioManager.getInstance().stopMusic();
        cc.dd.SceneManager.enterHall();
    },

    //退出游戏
    onClickLeave: function (event, data) {
        if (deskData.checkGameIsFriendType()) {
            var content = "";
            var callfunc = null;
            //已经结束
            if (deskData.isEnd == true) {
                this.sendLeaveRoom();
                return;
            }
            // 已经开始
            if (deskData.isStart || deskData.getIsReconnectTag()) {
                var player = playerMgr.findPlayerByUserId(cc.dd.user.id)
                if (player) {
                    content = cc.dd.Text.TEXT_LEAVE_ROOM_2;
                    callfunc = this.reqSponsorDissolveRoom;
                } else {//旁观者离开
                    this.sendLeaveRoom();
                    this.onClose();
                    return;
                }
            }
            else {
                if (playerMgr.findPlayerByUserId(cc.dd.user.id) && playerMgr.findPlayerByUserId(cc.dd.user.id).isRoomer) {
                    content = cc.dd.Text.TEXT_LEAVE_ROOM_1;
                    callfunc = this.sendLeaveRoom;
                } else {
                    content = cc.dd.Text.TEXT_LEAVE_ROOM_3;
                    callfunc = this.sendLeaveRoom;
                }
            }
            this.popupOKcancel(content, callfunc);
            this.onClose();
        } else {
            var selfInfo = playerMgr.findPlayerByUserId(cc.dd.user.id);
            var gamedata = selfInfo.getPlayerGameInfo();
            if (gamedata && (gamedata.userState == config_state.UserStateWait || gamedata.userState != config_state.UserStateFold || gamedata.userState != config_state.UserStateLost || gamedata.userState == 0)) {
                this.sendLeaveRoom();
            } else if (!gamedata) {
                this.sendLeaveRoom();
            } else {
                cc.dd.UIMgr.openUI('gameyj_new_dsz/common/prefab/new_dsz_dialogBox', function (prefab) {
                    var cpt = prefab.getComponent('new_dsz_dialog_box');
                    if (cpt)
                        cpt.show(0, "正在游戏中，退出后系统自动操作，是否退出", '确定', '取消', this.sendLeaveRoom, null);
                }.bind(this));
            }
            this.onClose();
        }
    },

    popupOKcancel: function (text, callfunc) {
        cc.dd.UIMgr.openUI('gameyj_new_dsz/common/prefab/new_dsz_dialogBox', function (prefab) {
            var cpt = prefab.getComponent('new_dsz_dialog_box');
            if (cpt)
                cpt.show(0, text, '确定', '取消', callfunc, null);
        }.bind(this));
    },

    //发起解散
    reqSponsorDissolveRoom: function () {
        var msg = new cc.pb.room_mgr.room_dissolve_agree_req();
        msg.setIsAgree(true);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_room_dissolve_agree_req, msg, "room_dissolve_agree_req", true);
    },

    /**
     * 离开房间
     */
    sendLeaveRoom: function () {
        var msg = new cc.pb.room_mgr.msg_leave_game_req();
        var roomMgr = require('jlmj_room_mgr').RoomMgr.Instance();
        var gameType = roomMgr.gameId;
        var roomId = roomMgr.roomId;

        if (roomMgr.gameId != 136 && roomMgr.gameId != 37 && roomMgr.gameId != 36) {
            gameType = deskData.getGameId()
            roomId = deskData.getRoomId();
        }

        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType(gameType);
        gameInfoPB.setRoomId(roomId);
        msg.setGameInfo(gameInfoPB);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);
    },

    //换桌
    onClickChange: function (event, data) {
        hall_audio_mgr.com_btn_click();
        dsz_send_msg.sendReplaceDesktop(136, deskData.getCoinRoomId());
        this.m_oChangeBtn.getComponent(cc.Button).interactable = false;
        this.m_oChangeBtn.getChildByName('desc_btn').getComponent(cc.Button).interactable = false;
        this.cd_time = setTimeout(function () {
            this.m_oChangeBtn.getComponent(cc.Button).interactable = true;
            this.m_oChangeBtn.getChildByName('desc_btn').getComponent(cc.Button).interactable = true;
            clearTimeout(this.cd_time);
        }.bind(this), 2000);
        // this.onClose();
    },

    //关闭按钮
    onClose: function (event, data) {
        if (this.cd_time)
            clearTimeout(this.cd_time);
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    //恢复游戏数据
    onClickReconnect: function (event, data) {
        login_module.Instance().reconnectWG();
    },
});
