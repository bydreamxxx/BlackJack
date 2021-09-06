// create by wj 2018/10/16
var deskData = require('dsz_desk_data').DSZ_Desk_Data.Instance();
var playerMgr = require('dsz_player_mgr').DSZ_PlayerMgr.Instance();
var playerEd = require('dsz_player_mgr').DSZ_PlayerED;
var playerEvent = require('dsz_player_mgr').DSZ_PlayerEvent;
var deskEd = require('dsz_desk_data').DSZ_Desk_Ed;
var deskEvent = require('dsz_desk_data').DSZ_Desk_Event;
var config_state = require('dsz_config').DSZ_UserState;
var dsz_chat_cfg = require('dsz_config').DSZ_Chat_Config;
var config = require('dsz_config');

var hall_audio_mgr = require('hall_audio_mgr').Instance();
var jlmj_prefab = require('jlmj_prefab_cfg');
var AudioManager = require('AudioManager');
var ChatEd = require('jlmj_chat_data').ChatEd;
var ChatEvent = require('jlmj_chat_data').ChatEvent;
const Prefix = 'gameyj_dsz/common/audio/';

var HallCommonObj = require('hall_common_data');
var HallCommonEd = HallCommonObj.HallCommonEd;
var HallCommonEvent = HallCommonObj.HallCommonEvent;

var RoomED = require("jlmj_room_mgr").RoomED;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;

var AppCfg = require('AppConfig');
var Platform = require('Platform');

const RecordEd = require('AudioChat').RecordEd;
const RecordEvent = require('AudioChat').RecordEvent;
var DingRobot = require('DingRobot');


cc.Class({
    extends: cc.Component,

    properties: {
        m_tPlayerList: [],
        m_tChipStartNode: [],
        m_nIndex: 0,
        m_bContinue: false,
        dissolveUI: cc.Prefab,
        zhuobu: { default: [], type: cc.SpriteFrame, tooltip: '桌布列表' },
        music_Node: { default: null, type: cc.Node, tooltip: '音乐' },
        sound_Node: { default: null, type: cc.Node, tooltip: '音效' },
        m_bIsCompare: false,
        compareUINode: cc.Node,
        chat_item: cc.Prefab,
        m_oAllCompareNode: cc.Node,
        allCompare: false,
        m_bPlayAct: false,
        m_bRuleshow: false,
        m_oRuleNode: cc.Node,
        m_bClearChip: false,
        m_bCanTotalResult: true,
        m_bInitChip: false,
        m_oNormalDeskNode: { default: null, type: cc.Node, tooltip: '多人场' },
        m_oFiveDeskNode: { default: null, type: cc.Node, tooltip: '五人场' },
    },

    onLoad: function () {
        DingRobot.set_ding_type(4);
        playerEd.addObserver(this);
        deskEd.addObserver(this);
        ChatEd.addObserver(this);
        HallCommonEd.addObserver(this);
        RoomED.addObserver(this);
        RecordEd.addObserver(this);
        deskData.init();
        this.m_nBaskChip = 0;
        //总筹码
        this.m_oTotalChipsTxt = cc.dd.Utils.seekNodeByName(this.node, "total_chips").getComponent(cc.Label);
        //底注
        // this.m_oBaseChipTxt = cc.dd.Utils.seekNodeByName(this.node, "min_chip").getComponent(cc.Label);
        //轮数
        this.m_oDescTxt = cc.dd.Utils.seekNodeByName(this.node, "desk_Desc").getComponent(cc.Label);
        //房间好
        this.m_oRoomBg = cc.dd.Utils.seekNodeByName(this.node, "roombg");
        //玩家列表/筹码起始点
        var j = 0;
        var playercount = deskData.getPlayerCount();
        if (playercount == 5) {
            this.m_oNormalDeskNode.active = false;
            this.m_oFiveDeskNode.active = true;

            for (var i = 0; i < 5; i++) {
                this.m_tPlayerList[i] = cc.dd.Utils.seekNodeByName(this.node, "player5_" + i);
                this.m_tPlayerList[i].active = false;
                var touchButton = cc.dd.Utils.seekNodeByName(this.m_tPlayerList[i], "touchBtn");
                if (touchButton)
                    touchButton.getComponent(cc.Button).clickEvents[0].customEventData = i;

                this.m_tChipStartNode[i] = cc.dd.Utils.seekNodeByName(this.node, "chipNode" + i);
            }
        } else {
            this.m_oNormalDeskNode.active = true;
            this.m_oFiveDeskNode.active = false;
            for (var i = 0; i < 9; i++) {
                if (playercount == 7 && (i != 4 && i != 5)) {
                    this.m_tPlayerList[j] = cc.dd.Utils.seekNodeByName(this.node, "player_" + i);
                    this.m_tPlayerList[j].active = false;
                    var touchButton = cc.dd.Utils.seekNodeByName(this.m_tPlayerList[j], "touchBtn");
                    if (touchButton)
                        touchButton.getComponent(cc.Button).clickEvents[0].customEventData = j;
                    j++;
                } else if (playercount == 9) {
                    this.m_tPlayerList[i] = cc.dd.Utils.seekNodeByName(this.node, "player_" + i);
                    this.m_tPlayerList[i].active = false;
                }

                this.m_tChipStartNode[i] = cc.dd.Utils.seekNodeByName(this.node, "chipNode" + i);
            }
        }

        //筹码区域
        this.m_oChipAreaNode = cc.dd.Utils.seekNodeByName(this.node, 'chipArea');
        //按钮区域
        this.m_oMenuNode = cc.dd.Utils.seekNodeByName(this.node, 'btnPanle');

        var oInviteBtn = cc.dd.Utils.seekNodeByName(this.node, "inviteBtn");
        this.m_nInviteBtnOriPosX = oInviteBtn.x;
        var oStartBtn = cc.dd.Utils.seekNodeByName(this.node, "readyBtn");
        this.m_nStartBtnOrigPosX = oStartBtn.x;

        this.node_guize = cc.find('guize', this.node);
        this.node_menu = cc.find('menu', this.node);
        this.node_setting = cc.find('setting', this.node);
        this.btn_menu = cc.find('btns/menu', this.node).getComponent(cc.Button);

        cc.find('chat', this.node).getComponent(cc.Animation).on('play', function () { this.chatAni = true; }.bind(this), this);
        cc.find('chat', this.node).getComponent(cc.Animation).on('finished', function () { this.chatAni = false; }.bind(this), this);

        this.updateDeskData();
        this.initChat();
        this.initZhuoBu();
        this.initMusicAndSound();
        this.initPlayer();
        //AudioManager.getInstance().playMusic(Prefix + 'zjh_gamebg');
    },

    onDestroy: function () {
        playerEd.removeObserver(this);
        deskEd.removeObserver(this);
        ChatEd.removeObserver(this);
        HallCommonEd.removeObserver(this);
        RoomED.removeObserver(this);
        RecordEd.removeObserver(this);
    },

    //桌子数据更新
    updateDeskData: function () {
        //总筹码
        this.m_oTotalChipsTxt.string = deskData.getCurBet();
        //底注
        var configData = deskData.getConfigData();
        if (configData) {
            var list = configData.anzhu.split(';');
            var base = list[0].split(',');
            this.m_nBaskChip = parseInt(base[1]);
            //轮数
            this.m_oDescTxt.string = '底注:' + base[1] + '  轮数:' + deskData.getCurCircle() + '/' + deskData.getTotalCircleCount();
        }
        this.m_oRoomBg.active = true;
        this.m_oRoomBg.getChildByName('room_id').getComponent(cc.Label).string = deskData.getRoomId();
    },
    //初始化聊天
    initChat: function () {
        var cfg = null;
        var parent = cc.find('chat/panel/text/view/content', this.node);
        parent.removeAllChildren(true);
        if (cc.dd.user.sex == 1) {
            cfg = dsz_chat_cfg.Man;
        }
        else {
            cfg = dsz_chat_cfg.Woman;
        }
        for (var i = 0; i < cfg.length; i++) {
            var node = cc.instantiate(this.chat_item);
            node.tagname = i;
            node.getComponentInChildren(cc.Label).string = cfg[i];
            node.on('click', this.onQuickChatClick, this);
            parent.addChild(node);
        }
    },

    initZhuoBu() {
        var idx = 0;
        var json = cc.sys.localStorage.getItem('dsz_zhuobu_' + cc.dd.user.id);
        if (json) {
            var sprite = null;
            this.zhuobu.forEach(function (element, index) {
                if (element._name == json) {
                    sprite = element;
                    idx = index;
                }
            });
            if (sprite) {
                cc.find('root/desk_bg', this.node).getComponent(cc.Sprite).spriteFrame = sprite;
            }
            else {
                cc.find('root/desk_bg', this.node).getComponent(cc.Sprite).spriteFrame = this.zhuobu[0];
                cc.sys.localStorage.setItem('dsz_zhuobu_' + cc.dd.user.id, this.zhuobu[0]._name);
            }
        }
        else {
            cc.find('root/desk_bg', this.node).getComponent(cc.Sprite).spriteFrame = this.zhuobu[0];
            cc.sys.localStorage.setItem('dsz_zhuobu_' + cc.dd.user.id, this.zhuobu[0]._name);
        }
        var bg_item = cc.find('setting/bg/content/zhuomian/view/content/bg', this.node);
        var tog_item = cc.find('setting/bg/content/zhuomian/toggles/tog', this.node);
        this.zhuobu.forEach(element => {
            var bg = cc.instantiate(bg_item);
            bg.getComponent(cc.Sprite).spriteFrame = element;
            bg.active = true;
            bg_item.parent.addChild(bg);
            var tog = cc.instantiate(tog_item);
            tog.active = true;
            tog_item.parent.addChild(tog);
        });
        this.nextBgBtn = cc.find('setting/bg/content/next_BG', this.node).getComponent(cc.Button);
        this.preBgBtn = cc.find('setting/bg/content/pre_BG', this.node).getComponent(cc.Button);
        this.idxZm = idx;
        this.contentZm = bg_item.parent;
        this.toggleZm = tog_item.parent;
        this.toggleZm.children[idx + 1].getChildByName('lv').active = true;
        this.zmWidth = bg_item.width;
        this.zmSpacingX = this.contentZm.getComponent(cc.Layout).spacingX;
        this.contentZm.x = - idx * (this.zmSpacingX + this.zmWidth);
        this.freshNextPreBtn();
    },
    freshNextPreBtn() {
        this.nextBgBtn.interactable = this.idxZm < (this.zhuobu.length - 1);
        this.preBgBtn.interactable = this.idxZm > 0;
    },
    nextZhuobu() {
        if (!this.changingZhuobu) {
            if (this.zhuobu[this.idxZm + 1]) {
                this.nextBgBtn.interactable = false;
                this.preBgBtn.interactable = false;
                this.changingZhuobu = true;
                // var move = cc.moveTo(1, cc.v2(-(++this.idxZm) * (this.zmSpacingX + this.zmWidth)));
                cc.sys.localStorage.setItem('dsz_zhuobu_' + cc.dd.user.id, this.zhuobu[this.idxZm]._name);
                cc.find('root/desk_bg', this.node).getComponent(cc.Sprite).spriteFrame = this.zhuobu[this.idxZm];
                var func = function () {
                    this.toggleZm.children[this.idxZm].getChildByName('lv').active = false;
                    this.toggleZm.children[this.idxZm + 1].getChildByName('lv').active = true;
                    this.changingZhuobu = false;
                    this.freshNextPreBtn();
                }.bind(this);
                // this.contentZm.runAction(cc.sequence(move.easing(cc.easeQuinticActionOut()), cc.callFunc(func)));
                cc.tween(this.contentZm)
                    .to(1, { position: { value: cc.v2(-(++this.idxZm) * (this.zmSpacingX + this.zmWidth)), easing: "quintOut" } })
                    .call(func)
                    .start();
            }
        }
    },
    preZhuobu() {
        if (!this.changingZhuobu) {
            if (this.zhuobu[this.idxZm - 1]) {
                this.nextBgBtn.interactable = false;
                this.preBgBtn.interactable = false;
                this.changingZhuobu = true;
                // var move = cc.moveTo(1, cc.v2(-(--this.idxZm) * (this.zmSpacingX + this.zmWidth)));
                cc.sys.localStorage.setItem('dsz_zhuobu_' + cc.dd.user.id, this.zhuobu[this.idxZm]._name);
                cc.find('root/desk_bg', this.node).getComponent(cc.Sprite).spriteFrame = this.zhuobu[this.idxZm];
                var func = function () {
                    this.toggleZm.children[this.idxZm + 2].getChildByName('lv').active = false;
                    this.toggleZm.children[this.idxZm + 1].getChildByName('lv').active = true;
                    this.changingZhuobu = false;
                    this.freshNextPreBtn();
                }.bind(this);
                // this.contentZm.runAction(cc.sequence(move.easing(cc.easeQuinticActionOut()), cc.callFunc(func)));
                cc.tween(this.contentZm)
                    .to(1, { position: { value: cc.v2(-(--this.idxZm) * (this.zmSpacingX + this.zmWidth)), easing: "quintOut" } })
                    .call(func)
                    .start();
            }
        }
    },

    //初始化音乐音效设置
    initMusicAndSound: function () {
        var music = AudioManager.getInstance()._getLocalMusicSwitch();
        var sound = AudioManager.getInstance()._getLocalSoundSwitch();
        var s_volume = AudioManager.getInstance()._getLocalSoundVolume();
        var m_volume = AudioManager.getInstance()._getLocalMusicVolume();
        if (!music) {
            cc.find('setting/bg/content/music/mask', this.node).width = 0;
            cc.find('setting/bg/content/music/tao', this.node).x = -50;
            cc.find('setting/bg/content/music/tao/b', this.node).active = true;
            cc.find('setting/bg/content/music/tao/y', this.node).active = false;
            cc.find('setting/bg/content/music/label_kai', this.node).active = false;
            cc.find('setting/bg/content/music/label_guan', this.node).active = true;
        }
        else {
            AudioManager.getInstance().onMusic(Prefix + 'zjh_gamebg');
        }
        if (!sound) {
            cc.find('setting/bg/content/sound/mask', this.node).width = 0;
            cc.find('setting/bg/content/sound/tao', this.node).x = -50;
            cc.find('setting/bg/content/sound/tao/b', this.node).active = true;
            cc.find('setting/bg/content/sound/tao/y', this.node).active = false;
            cc.find('setting/bg/content/sound/label_kai', this.node).active = false;
            cc.find('setting/bg/content/sound/label_guan', this.node).active = true;
        }
        if (s_volume == 0 && m_volume == 0) {//静音
            cc.find('setting/bg/content/mute', this.node).getComponent(cc.Toggle).isChecked = true;
            this.mute = true;
        }
        else {
            cc.find('setting/bg/content/mute', this.node).getComponent(cc.Toggle).isChecked = false;
            this.mute = false;
        }
        var fangyan_node = cc.find('setting/bg/content/fangyan', this.node);
        cc.dd.ShaderUtil.setGrayShader(fangyan_node);
    },

    //设置音乐音效
    onSetMusic: function (event, data) {
        var duration = 0.3;
        var step = 0.05;
        switch (data) {
            case 'music':
                var music_Node = this.music_Node;
                if (AudioManager.getInstance()._getLocalMusicSwitch()) {//on  需要关闭
                    if (!this.switch_music) {
                        cc.find('label_kai', music_Node).active = false;
                        // var move = cc.moveTo(duration, cc.v2(-50, 0));
                        // var spFunc = cc.callFunc(function () {
                        //     cc.find('tao/y', music_Node).active = false;
                        //     cc.find('tao/b', music_Node).active = true;
                        //     cc.find('label_guan', music_Node).active = true;
                        //     AudioManager.getInstance().offMusic();
                        // }.bind(this));
                        // var action = cc.sequence(move, spFunc);
                        var width = cc.find('mask', music_Node).width;
                        var time = duration;
                        this.switch_music = true;
                        music_Node.getComponent(cc.Button).schedule(function () {
                            time -= step;
                            if (time < 0)
                                time = 0;
                            cc.find('mask', music_Node).width = width * time / duration;
                            if (time == 0) {
                                music_Node.getComponent(cc.Button).unscheduleAllCallbacks();
                                this.switch_music = false;
                            }
                        }.bind(this), step);
                        // cc.find('tao', music_Node).runAction(action);
                        cc.tween(cc.find('tao', music_Node))
                            .to(duration, { position: cc.v2(-50, 0) })
                            .call(function () {
                                cc.find('tao/y', music_Node).active = false;
                                cc.find('tao/b', music_Node).active = true;
                                cc.find('label_guan', music_Node).active = true;
                                AudioManager.getInstance().offMusic();
                            }.bind(this))
                            .start();
                    }
                }
                else {
                    if (!this.switch_music) {
                        cc.find('label_guan', music_Node).active = false;
                        // var move = cc.moveTo(duration, cc.v2(46.6, 0));
                        // var spFunc = cc.callFunc(function () {
                        //     cc.find('tao/y', music_Node).active = true;
                        //     cc.find('tao/b', music_Node).active = false;
                        //     cc.find('label_kai', music_Node).active = true;
                        //     AudioManager.getInstance().onMusic(Prefix + 'zjh_gamebg');
                        // }.bind(this));
                        // var action = cc.sequence(move, spFunc);
                        var width = 138;
                        var time1 = duration;
                        this.switch_music = true;
                        music_Node.getComponent(cc.Button).schedule(function () {
                            time1 -= step;
                            if (time1 < 0)
                                time1 = 0;
                            cc.find('mask', music_Node).width = width * (1 - time1 / duration);
                            if (time1 == 0) {
                                music_Node.getComponent(cc.Button).unscheduleAllCallbacks();
                                this.switch_music = false;
                            }
                        }.bind(this), step);
                        // cc.find('tao', music_Node).runAction(action);
                        cc.tween(cc.find('tao', music_Node))
                            .to(duration, { position: cc.v2(46.6, 0) })
                            .call(function () {
                                cc.find('tao/y', music_Node).active = true;
                                cc.find('tao/b', music_Node).active = false;
                                cc.find('label_kai', music_Node).active = true;
                                AudioManager.getInstance().onRawMusic(this.music_clip);
                            }.bind(this))
                            .start();
                    }
                }
                break;
            case 'sound':
                var sound_Node = this.sound_Node;
                if (AudioManager.getInstance()._getLocalSoundSwitch()) {//on  需要关闭
                    if (!this.switch_sound) {
                        cc.find('label_kai', sound_Node).active = false;
                        // var move = cc.moveTo(duration, cc.v2(-50, 0));
                        // var spFunc = cc.callFunc(function () {
                        //     cc.find('tao/y', sound_Node).active = false;
                        //     cc.find('tao/b', sound_Node).active = true;
                        //     cc.find('label_guan', sound_Node).active = true;
                        //     AudioManager.getInstance().offSound();
                        // }.bind(this));
                        // var action = cc.sequence(move, spFunc);
                        var width = cc.find('mask', sound_Node).width;
                        var time2 = duration;
                        this.switch_sound = true;
                        sound_Node.getComponent(cc.Button).schedule(function () {
                            time2 -= step;
                            if (time2 < 0)
                                time2 = 0;
                            cc.find('mask', sound_Node).width = width * time2 / duration;
                            if (time2 == 0) {
                                sound_Node.getComponent(cc.Button).unscheduleAllCallbacks();
                                this.switch_sound = false;
                            }
                        }.bind(this), step);
                        // cc.find('tao', sound_Node).runAction(action);
                        cc.tween(cc.find('tao', sound_Node))
                            .to(duration, { position: cc.v2(-50, 0) })
                            .call(function () {
                                cc.find('tao/y', sound_Node).active = false;
                                cc.find('tao/b', sound_Node).active = true;
                                cc.find('label_guan', sound_Node).active = true;
                                AudioManager.getInstance().offSound();
                            }.bind(this))
                            .start();
                    }
                }
                else {
                    if (!this.switch_sound) {
                        cc.find('label_guan', sound_Node).active = false;
                        // var move = cc.moveTo(duration, cc.v2(43, 0));
                        // var spFunc = cc.callFunc(function () {
                        //     cc.find('tao/y', sound_Node).active = true;
                        //     cc.find('tao/b', sound_Node).active = false;
                        //     cc.find('label_kai', sound_Node).active = true;
                        //     AudioManager.getInstance().onSound();
                        // }.bind(this));
                        // var action = cc.sequence(move, spFunc);
                        var width = 138;
                        var time3 = duration;
                        this.switch_sound = true;
                        sound_Node.getComponent(cc.Button).schedule(function () {
                            time3 -= step;
                            if (time3 < 0)
                                time3 = 0;
                            cc.find('mask', sound_Node).width = width * (1 - time3 / duration);
                            if (time3 == 0) {
                                sound_Node.getComponent(cc.Button).unscheduleAllCallbacks();
                                this.switch_sound = false;
                            }
                        }.bind(this), step);
                        // cc.find('tao', sound_Node).runAction(action);
                        cc.tween(cc.find('tao', sound_Node))
                            .to(duration, { position: cc.v2(43, 0) })
                            .call(function () {
                                cc.find('tao/y', sound_Node).active = true;
                                cc.find('tao/b', sound_Node).active = false;
                                cc.find('label_kai', sound_Node).active = true;
                                AudioManager.getInstance().onSound();
                            }.bind(this))
                            .start();
                    }
                }
                break;
            case 'mute':
                if (this.mute) {//静音开启  需关闭
                    AudioManager.getInstance().setSoundVolume(1);
                    AudioManager.getInstance().setMusicVolume(1);
                    this.mute = false;
                }
                else {
                    AudioManager.getInstance().setSoundVolume(0);
                    AudioManager.getInstance().setMusicVolume(0);
                    this.mute = true;
                }
                break;
            case 'fangyan':
                break;
            default:
                cc.error('setMusic failed. arg error');
                break;
        }
    },



    //初始玩家数据
    initPlayer: function () {
        var self = this;
        playerMgr.playerInfo.forEach(function (player) {
            if (player)
                self.playerEnter(player.userId);
        });
        this.refreshGPSWarn();
    },
    /////////////////////////////////////////////////////////玩家操作begin//////////////////////////////////////////

    //准备/开始游戏
    onClickReady: function (event, data) {
        hall_audio_mgr.com_btn_click();

        var pbData = new cc.pb.room_mgr.msg_prepare_game_req();
        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType(35);
        gameInfoPB.setRoomId(deskData.getRoomId());
        pbData.setGameInfo(gameInfoPB);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_prepare_game_req, pbData, "msg_prepare_game_req", true);
    },


    //再次准备/开始游戏
    onClickReReady: function (event, data) {
        hall_audio_mgr.com_btn_click();

        const req = new cc.pb.room_mgr.room_prepare_req();
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_room_prepare_req, req,
            'room_prepare_req', true);
    },

    getRuleString: function () {
        var roomMgr = require('jlmj_room_mgr').RoomMgr.Instance();

        var ruleType = roomMgr._Rule.playRule;
        var str = '底注:' + this.m_nBaskChip;
        str += '\n共:' + deskData.getTotalRoundCount() + '局\n';
        if (ruleType == 1) {
            str += '规则:1/2,2/4,4/8,8/16,10/20   \n';
            str += '第' + roomMgr._Rule.limitWatch + '轮可以看牌    \n';
            str = str + '第' + roomMgr._Rule.limitCmp + '轮可以比牌   \n';
        } else {
            str += '规则：1/2,2/5,5/10,10/20,20/40    ';
            str += '达到' + roomMgr._Rule.limitWatch + '分可以看牌    \n';
            str = str + '达到' + roomMgr._Rule.limitCmp + '分可以比牌    \n';
        }

        if (deskData.getWatchAll())
            str = str + '亮底牌    \n';

        if (deskData.getIsGiveUp())
            str = str + '到时弃牌    \n';
        return str;
    },

    //邀请玩家
    onClickInvite: function (event, data) {
        if (event.type != "touchend") {
            return;
        }
        var roomMgr = require('jlmj_room_mgr').RoomMgr.Instance();

        var num = deskData.getPlayerCount() - playerMgr.getRealPlayerCount();

        hall_audio_mgr.com_btn_click();
        var title = "房间号:" + deskData.getRoomId() + '\n';
        var str = this.getRuleString();
        if (cc.sys.isNative) {
            // cc.dd.native_wx.SendAppContent(roomMgr.roomId, "【" + deskData.getPlayerCount() + "人逗三张】" + '  差' + num + '人', title + str, Platform.GetAppUrl(AppCfg.GAME_PID, AppCfg.PID));
            let wanFa = [];

            var ruleType = roomMgr._Rule.playRule;
            wanFa.push('底注:' + this.m_nBaskChip);
            wanFa.push('共:' + deskData.getTotalRoundCount() + '局');
            if (ruleType == 1) {
                wanFa.push('规则:1/2,2/4,4/8,8/16,10/20');
                wanFa.push('第' + roomMgr._Rule.limitWatch + '轮可以看牌');
                wanFa.push('第' + roomMgr._Rule.limitCmp + '轮可以比牌');
            } else {
                wanFa.push('规则：1/2,2/5,5/10,10/20,20/40');
                wanFa.push('达到' + roomMgr._Rule.limitWatch + '分可以看牌');
                wanFa.push('达到' + roomMgr._Rule.limitCmp + '分可以比牌');
            }

            if (deskData.getWatchAll())
                wanFa.push('亮底牌');

            if (deskData.getIsGiveUp())
                wanFa.push('到时弃牌');

            let playerList = playerMgr.playerInfo;
            let playerName = [];
            playerList.forEach(function (playerMsg) {
                if (playerMsg && playerMsg.userId) {
                    playerName.push(playerMsg.playerCommonInfo.name);
                }
            }, this);

            let info = {
                gameid: roomMgr.gameId,//游戏ID
                roomid: roomMgr.roomId,//房间号
                title: deskData.getPlayerCount() + "人逗三张",//房间名称
                content: wanFa,//游戏规则数组
                usercount: deskData.getPlayerCount(),//人数
                jushu: deskData.getTotalRoundCount(),//局\圈数
                jushutitle: '局数',//局\圈标题，默认局数
                playername: playerName,//玩家姓名数组
                gamestate: '未开始',//游戏状态
            }
            cc.dd.native_wx.SendAppInvite(info, "【" + deskData.getPlayerCount() + "人逗三张】" + '  差' + num + '人', title + str, Platform.wxShareGameUrl[AppCfg.PID]);
        }
    },

    //玩家进入/断线重连均使用这个
    playerEnter: function (userId) {
        this.m_bClearChip = false;
        var player = playerMgr.findPlayerByUserId(userId);
        if (player) {
            deskData.isEnd = false;
            var commonData = player.getPlayerCommonInfo(); //获取通用数据
            var pos = commonData.pos; //玩家座位；
            var playerNode = this.m_tPlayerList[pos];

            // playerNode.getChildByName('name').getComponent(cc.Label).string = cc.dd.Utils.substr( commonData.name, 8, 4 ); //玩家名字
            playerNode.getChildByName('coin').getComponent(cc.Label).string = 0; //朋友场玩家进入默认为0
            if (commonData.state == 2)
                cc.dd.Utils.seekNodeByName(playerNode, "offline").active = true;

            var headNode = cc.dd.Utils.seekNodeByName(playerNode, 'headSp'); //头像设置
            headNode.getComponent('klb_hall_Player_Head').initHead(commonData.openId, commonData.headUrl, 'dsz_head_init');
            headNode.getChildByName('head').active = true;
            playerNode.active = true;
            if (commonData.isReady)
                playerNode.getChildByName('readyTag').active = true;

            var oInviteBtn = cc.dd.Utils.seekNodeByName(this.node, "inviteBtn");
            var oStartBtn = cc.dd.Utils.seekNodeByName(this.node, "readyBtn");
            if (userId == cc.dd.user.id) { //当前设置自己的数据
                if (player.isRoomer) {//玩家是房主
                    var canOpen = playerMgr.checkPlayerAllReady();
                    if (canOpen && playerMgr.getRealPlayerCount() > 1)
                        oStartBtn.getComponent(cc.Button).interactable = true;
                    else
                        oStartBtn.getComponent(cc.Button).interactable = false;
                    oInviteBtn.active = true;
                    oStartBtn.active = true;
                } else {//玩家不是房主
                    if (commonData.isReady) {
                        oStartBtn.active = false;
                        oInviteBtn.setPosition(cc.v2(0, oInviteBtn.y));
                        oInviteBtn.active = true;
                    } else {
                        oInviteBtn.active = true;
                        oStartBtn.active = true;
                    }

                }

            }

            if (playerMgr.getRealPlayerCount() == deskData.getPlayerCount()) {
                oInviteBtn.active = false;
                oStartBtn.setPosition(cc.v2(0, oStartBtn.y));
            }
            this.refreshGPSWarn();
        }
    },

    //玩家准备
    playerReady_Rsp: function (userId) {
        if (!this.m_bContinue) {
            var oInviteBtn = cc.dd.Utils.seekNodeByName(this.node, "inviteBtn");
            var oStartBtn = cc.dd.Utils.seekNodeByName(this.node, "readyBtn");
            if (userId == cc.dd.user.id) {//玩家自己点击准备
                oStartBtn.active = false;
                oInviteBtn.setPosition(cc.v2(0, oInviteBtn.y));

                var playerNode = this.m_tPlayerList[0];
                playerNode.getChildByName('readyTag').active = true;

            } else {//其他玩家准备
                var player = playerMgr.findPlayerByUserId(userId);
                if (player) {
                    var commonData = player.getPlayerCommonInfo(); //获取通用数据
                    var pos = commonData.pos; //玩家座位；

                    var playerNode = this.m_tPlayerList[pos];
                    playerNode.getChildByName('readyTag').active = true;
                }
            }
        } else {
            var oStartBtn = cc.dd.Utils.seekNodeByName(this.node, "reReadyBtn");
            if (userId == cc.dd.user.id) {//玩家自己点击准备
                oStartBtn.active = false;
                var playerNode = this.m_tPlayerList[0];
                playerNode.getChildByName('readyTag').active = true;
            } else {
                var player = playerMgr.findPlayerByUserId(userId);
                var commonData = player.getPlayerCommonInfo(); //获取通用数据
                var pos = commonData.pos; //玩家座位；

                var playerNode = this.m_tPlayerList[pos];
                playerNode.getChildByName('readyTag').active = true;
            }
        }
    },

    //所有玩家准备完成  仅针对于房主本人操作
    playerAllReady_Rsp: function () {
        if (!this.m_bContinue) {
            var oStartBtn = cc.dd.Utils.seekNodeByName(this.node, "readyBtn");
            oStartBtn.getComponent(cc.Button).interactable = true;
        } else {
            var oStartBtn = cc.dd.Utils.seekNodeByName(this.node, "reReadyBtn");
            oStartBtn.getComponent(cc.Button).interactable = true;
        }
    },

    //跟注/加注操作
    playerAddChip_Rsp: function (userId, playAudio) {
        var player = playerMgr.findPlayerByUserId(userId);
        if (player) {
            var player_game_data = player.getPlayerGameInfo();
            if (player_game_data) {
                if (playAudio)
                    this.synOtherPlayerOperate(userId, player_game_data.userState);
                AudioManager.getInstance().playSound(Prefix + 'pt_chouma', false);
                this.freshPlayerCostChipInfo(player, player_game_data.lastBet, true);
                this.freshDeskTotalChip(parseInt(player_game_data.lastBet));
            }
            this.showCurOperateBtns();
        }
    },

    //玩家弃牌
    playerFold_Rsp: function (userId) {
        var player = playerMgr.findPlayerByUserId(userId);
        if (player) {
            this.synOtherPlayerOperate(userId, config_state.UserStateFold);
            var player_common_data = player.getPlayerCommonInfo();
            if (player_common_data) {
                this.m_tPlayerList[player_common_data.pos].getComponent('dsz_player_ui').fold(); //玩家弃牌
            }
            player.updatePlayerPokerState(3);
        }
        this.showCurOperateBtns();
    },

    //玩家看牌
    playerWatch_Rsp: function (userId) {
        var player = playerMgr.findPlayerByUserId(userId);
        if (player) {
            this.synOtherPlayerOperate(userId, config_state.UserStateWacth);
            var player_common_data = player.getPlayerCommonInfo();
            if (player_common_data) {
                if (userId == cc.dd.user.id) {
                    this.m_tPlayerList[player_common_data.pos].getComponent('dsz_player_ui').watch(); //玩家看牌
                    if (deskData.getCurOpUser() == cc.dd.user.id)
                        this.m_oMenuNode.getComponent('dsz_game_menu').analysisPycPlayerOpBtn();//更新按钮显示
                } else
                    this.m_tPlayerList[player_common_data.pos].getComponent('dsz_player_ui').setPlayerPokerState(2); //玩家已经看牌
            }
            this.showCurOperateBtns();
        }
    },

    //是否剩余两个玩家，进行默认的选中
    ckeckDefalutSelect: function () {
        var playercount = playerMgr.getRealPlayerCount(); //桌子上的玩家数量
        var leftPlayer = null;
        playerMgr.playerInfo.forEach(function (player) {
            if (player) {
                var player_game_data = player.getPlayerGameInfo();
                if (player_game_data.userState == config_state.UserStateFold || player_game_data.userState == config_state.UserStateLost)
                    playercount = playercount - 1;
                else {
                    if (player.userId != cc.dd.user.id)
                        leftPlayer = player;
                }
            }
        });
        if (playercount == 2) {
            this.m_bIsCompare = true;
            var player_common_data = leftPlayer.getPlayerCommonInfo();
            this.m_tPlayerList[player_common_data.pos].getComponent('dsz_player_ui').sendComp(null, null); //发送比牌消息
            return true;
        } else
            return false;
    },
    //玩家比牌下注
    playerCmp_Rsp: function () {
        if (this.ckeckDefalutSelect())
            return;
        this.m_bIsSelectCmp = true;
        playerMgr.playerInfo.forEach(function (player) {
            if (player && player.userId != cc.dd.user.id) {
                var player_common_data = player.getPlayerCommonInfo();
                var player_game_data = player.getPlayerGameInfo();
                if (player_common_data && (player_game_data.userState != config_state.UserStateFold && player_game_data.userState != config_state.UserStateLost)) {
                    this.m_tPlayerList[player_common_data.pos].getComponent('dsz_player_ui').canSelectCmp(true); //玩家设置为可被选中
                }
            }
        }.bind(this))
    },

    //玩家比牌结果
    playerCmpResult_Rsp: function (userId, cmpUserId, WinnerId) {
        cc._pauseLMAni = true;
        this.m_bIsCompare = true;
        this.playerAddChip_Rsp(userId, false);//比牌需要下注
        this.synOtherPlayerOperate(userId, config_state.UserStateCmp);
        var playerNode1 = null;
        var playerNode2 = null;
        playerMgr.playerInfo.forEach(function (player) {
            if (player) {
                var player_common_data = player.getPlayerCommonInfo();
                if (player_common_data) {
                    this.m_tPlayerList[player_common_data.pos].getComponent('dsz_player_ui').canSelectCmp(false); //玩家设置为不可被选中
                    if (userId == player.userId)
                        playerNode1 = this.m_tPlayerList[player_common_data.pos];
                    else if (cmpUserId == player.userId)
                        playerNode2 = this.m_tPlayerList[player_common_data.pos];
                }
            }
        }.bind(this))

        var self = this;
        var callBack = function () {
            playerMgr.playerInfo.forEach(function (player) {
                if (player) {
                    var player_common_data = player.getPlayerCommonInfo();
                    if (player_common_data) {
                        if ((userId == player.userId && userId != WinnerId) || (cmpUserId == player.userId && cmpUserId != WinnerId))
                            self.m_tPlayerList[player_common_data.pos].getComponent('dsz_player_ui').setPlayerPokerState(3); //玩家比牌输
                    }
                }
            });
        }

        playerNode1.getChildByName('headbg').active = false;
        playerNode2.getChildByName('headbg').active = false;

        cc.dd.UIMgr.openUI('gameyj_dsz/common/prefab/dsz_compare', function (ui) {
            var cpt = ui.getComponent('dsz_compare_ui');
            cpt.playerCompareAct(userId, cmpUserId, WinnerId, playerNode1, playerNode2, callBack);
            this.m_bIsCompare = true;

        }.bind(this));
    },

    //取消比牌选择
    cancelCmpSelect: function () {
        if (this.m_bIsSelectCmp) {
            playerMgr.playerInfo.forEach(function (player) {
                if (player) {
                    var player_common_data = player.getPlayerCommonInfo();
                    if (player_common_data) {
                        this.m_tPlayerList[player_common_data.pos].getComponent('dsz_player_ui').canSelectCmp(false); //玩家设置为不可被选中
                    }
                }
            }.bind(this))
            this.m_bIsSelectCmp = false;
        }
    },

    //单局结算
    roundResut_Rsp: function (data) {
        this.m_bCanTotalResult = false;
        this.m_oMenuNode.getComponent('dsz_game_menu').hideAllBtn();
        this.m_oMenuNode.active = false;
        if (deskData.getCurCircle() >= deskData.getTotalCircleCount() || deskData.getCurBet() >= deskData.getTotalScroLimit() && !this.allCompare) {
            this.allCompare = true;
        }
        var self = this;
        if (this.m_bIsCompare) {

            self.roundResut_id = setTimeout(function () {
                self.roundResut_Rsp(data);
            }, 3000);
            this.m_bIsCompare = false;
        } else if (this.allCompare && !this.m_bPlayAct) {
            cc._pauseLMAni = true;
            this.m_bPlayAct = true;
            this.m_oAllCompareNode.active = true;
            var allCompareAnim = this.m_oAllCompareNode.getChildByName('quanchangbipai');
            allCompareAnim.getComponent(sp.Skeleton).clearTracks();
            allCompareAnim.getComponent(sp.Skeleton).setAnimation(0, 'quanchangbipai', false);
            allCompareAnim.getComponent(sp.Skeleton).loop = false;
            allCompareAnim.getComponent(sp.Skeleton).setCompleteListener(function () {
                this.m_oAllCompareNode.active = false;
                cc._pauseLMAni = false;
            }.bind(this));

            self.roundResut_id = setTimeout(function () {
                self.roundResut_Rsp(data);
            }, 2500);
            this.m_bIsCompare = false;
        } else {
            if (self.roundResut_id) {
                clearTimeout(self.roundResut_id);
                self.roundResut_id = 0;
            }
            this.m_oAllCompareNode.active = false;
            this.m_oMenuNode.getComponent('dsz_game_menu').hideAllBtn();

            data.forEach(function (info) {
                var player = playerMgr.findPlayerByUserId(info.userId);
                if (player) {
                    if (player.userId == cc.dd.user.id) {
                        if (info.isWin)
                            AudioManager.getInstance().playSound(Prefix + 'finalWin', false);
                    }
                    var player_common_data = player.getPlayerCommonInfo();
                    this.m_tPlayerList[player_common_data.pos].getComponent('dsz_player_ui').setResult(info.score); //设置单人的结算
                    //if(deskData.getWatchAll())
                    this.m_tPlayerList[player_common_data.pos].getComponent('dsz_player_ui').showPokerFace(); //开牌
                    if (info.isWin) {
                        this.m_oChipAreaNode.getComponent('dsz_chip_ui').result(player_common_data.pos); //收筹码的动画
                        player.getPlayerGameInfo().curScore += info.score;
                        this.m_tPlayerList[player_common_data.pos].getComponent('dsz_player_ui').freshPlayerChip();//刷新玩家身上筹码值
                    }

                }
            }.bind(this));

            self.roundResutCall_id = setTimeout(function () {
                self.resetDeskData();
                clearTimeout(self.roundResutCall_id);
                self.m_bCanTotalResult = true;
                self.roundResutCall_id = 0
            }, 2000);
            this.m_bPlayAct = false;
            this.allCompare = false;
        }
    },

    /**
     * 战绩统计
     * @param {*} msg 
     */
    showResultTotal_Rsp(msg) {
        var self = this;
        if (!self.m_bCanTotalResult) {
            // this.node.runAction(cc.sequence(cc.delayTime(2.5), cc.callFunc(function () {
            //     self.showResultTotal_Rsp(msg);
            // })));
            cc.tween(this.node)
                .delay(2.5)
                .call(function () {
                    self.showResultTotal_Rsp(msg);
                })
                .start();
            return;
        }
        deskData.isEnd = true;
        deskData.isStart = false;
        var generateTimeStr = function (date) {
            var pad2 = function (n) { return n < 10 ? '0' + n : n };
            return date.getFullYear().toString() + '-' + pad2(date.getMonth() + 1) + '-' + pad2(date.getDate()) + '  ' + pad2(date.getHours()) + ':' + pad2(date.getMinutes()) + ':' + pad2(date.getSeconds());
        };

        var zjNode = cc.find('zhanjitongji', this.node);
        zjNode.active = true;

        var roomId = deskData.getRoomId();
        var totalRound = deskData.getTotalRoundCount();
        var strTime = generateTimeStr(new Date(msg.time * 1000));
        cc.find('time/room_number', zjNode).getComponent(cc.Label).string = roomId.toString();
        cc.find('time/total_round', zjNode).getComponent(cc.Label).string = '共' + totalRound.toString() + '局';
        cc.find('time/time_lbl', zjNode).getComponent(cc.Label).string = strTime;

        var playList = msg.scoreResultList;
        var bigWinScore = 0;
        var selfIdx = -1;
        for (var i = 0; i < playList.length; i++) {
            if (playList[i].isWin) {
                bigWinScore = playList[i].score;
            }
            if (playList[i].userId == cc.dd.user.id) {
                selfIdx = i;
            }
        }
        var layout_node = cc.dd.Utils.seekNodeByName(zjNode, 'player_layout');
        layout_node.removeAllChildren();
        var setData = function (data) {
            if (data.userId == cc.dd.user.id) {
                var newNode = cc.find('userNode_self', zjNode);
            }
            else {
                var newNode = cc.find('userNode_other', zjNode);
            }
            var pNode = cc.instantiate(newNode);
            var player = playerMgr.findPlayerByUserId(data.userId).getPlayerCommonInfo();
            var nick = cc.dd.Utils.substr(player.name, 0, 4);
            var headUrl = player.headUrl;
            var headsp = cc.find('headNode/head', pNode).getComponent(cc.Sprite);
            var score = data.score;
            if (headUrl && headUrl != '') {
                cc.dd.SysTools.loadWxheadH5(headsp, headUrl);
            }
            cc.find('layout/userName', pNode).getComponent(cc.Label).string = nick;
            cc.find('layout/fangzhu', pNode).active = player.isRoomer;
            cc.find('ID', pNode).getComponent(cc.Label).string = data.userId.toString();

            if (score > -1) {
                cc.find('mark', pNode).color = cc.color(192, 0, 0);
                cc.find('mark', pNode).getComponent(cc.Label).string = '+' + score.toString();
            }
            else {
                cc.find('mark', pNode).color = cc.color(0, 192, 0);
                cc.find('mark', pNode).getComponent(cc.Label).string = score.toString();
            }
            if (bigWinScore > 0 && score == bigWinScore) {
                cc.find('dayingjia', pNode).active = true;
            }
            pNode.active = true;
            layout_node.addChild(pNode);
        }.bind(this);
        setData(playList[selfIdx]);
        for (var i = 0; i < playList.length; i++) {
            if (i != selfIdx) {
                setData(playList[i]);
            }
        }
    },

    //玩家离开操作
    playerLeave_Rsp: function (data) {
        if (data.userId == cc.dd.user.id) {
            this.clear();
            this.backToHall();
        } else {
            var player = playerMgr.findPlayerByUserId(data.userId)
            if (player.isRoomer) {//房主解散房间
                this.clear();
                cc.dd.DialogBoxUtil.show(0, "房主已解散房间,请重新加入房间", '确定', null, function () {
                    cc.dd.SceneManager.enterHall();
                }, function () {
                });
            } else {//玩家离开房间
                this.m_tPlayerList[data.pos].active = false;
                this.m_tPlayerList[data.pos].getComponent('dsz_player_ui').clearUI();
                if (!deskData.isStart) {
                    var oInviteBtn = cc.dd.Utils.seekNodeByName(this.node, "inviteBtn");
                    var oStartBtn = cc.dd.Utils.seekNodeByName(this.node, "readyBtn");;

                    // if(playerMgr.getRealPlayerCount() != deskData.getPlayerCount()){
                    oInviteBtn.active = true;
                    oInviteBtn.setPosition(cc.v2(this.m_nInviteBtnOriPosX, oInviteBtn.y));
                    oStartBtn.setPosition(cc.v2(this.m_nStartBtnOrigPosX, oStartBtn.y));
                    //}
                }
            }
        }
    },

    //玩家在线状态
    playerOnline: function (data) {
        var player = playerMgr.findPlayerByUserId(data[0].userId);
        var common_player_data = player.getPlayerCommonInfo();
        this.m_tPlayerList[common_player_data.pos].getComponent('dsz_player_ui').showOffline(!data[1]);
    },

    /////////////////////////////////////////////////////////玩家操作end//////////////////////////////////////////

    /////////////////////////////////////////////////////////桌子/玩家数据更新begin////////////////////////////////
    //实例化玩家数据
    initPlayerGameData: function (userId) {
        if (!this.m_bInitChip) {
            this.m_oChipAreaNode.getComponent('dsz_chip_ui').initChip();
            this.updateDeskData();
        }
        this.m_bInitChip = true;

        deskData.isStart = true;
        //清理桌面的显示
        var inviteBtn = cc.dd.Utils.seekNodeByName(this.node, "inviteBtn");
        inviteBtn.active = false;
        inviteBtn.setPosition(cc.v2(this.m_nInviteBtnOriPosX, inviteBtn.y));
        var startBtn = cc.dd.Utils.seekNodeByName(this.node, "readyBtn");
        startBtn.setPosition(cc.v2(this.m_nInviteBtnOriPosX, inviteBtn.y));
        startBtn.active = false;
        this.m_oRoomBg.active = false;

        var player = playerMgr.findPlayerByUserId(userId);
        if (player) {
            var player_game_data = player.getPlayerGameInfo();
            var player_common_data = player.getPlayerCommonInfo();
            this.m_tPlayerList[player_common_data.pos].getChildByName('readyTag').active = false;

            if (!deskData.getIsReconnectTag()) {//如果不是断线重连
                var cpt = this.m_tPlayerList[player_common_data.pos].getComponent('dsz_player_ui')
                cpt.setPlayerData(player_game_data);//玩家游戏数据
                //cpt.showWatchPokerDesc();
                this.freshPlayerCostChipInfo(player, this.m_nBaskChip, true); //默认玩家下注
                this.m_oTotalChipsTxt.string = deskData.getCurBet(); //显示当前桌子总压注
            } else {
                if (!this.m_bClearChip) {
                    this.m_oChipAreaNode.getComponent('dsz_chip_ui').clear(); //下注筹码动画
                    this.m_bClearChip = true;
                }
                if (deskData.checkDissolve())
                    this.showDissolveList(deskData.getDissolveList(), deskData.getDissolveTime());

                this.m_bContinue = true;
                if (player_game_data.userState == config_state.UserStateUnPrepare) {//玩家未准备
                    if (userId == cc.dd.user.id) {
                        var oStartBtn = cc.dd.Utils.seekNodeByName(this.node, "reReadyBtn");;
                        if (player.isRoomer) {//玩家是房主
                            oStartBtn.getComponent(cc.Button).interactable = false;
                            oStartBtn.active = true;
                        } else {//玩家不是房主
                            oStartBtn.active = true;
                        }
                    }
                } else {
                    if (deskData.getCurDeskState() != 1) {//游戏已经开始
                        var cpt = this.m_tPlayerList[player_common_data.pos].getComponent('dsz_player_ui');
                        cpt.initData(player_game_data);//玩家游戏数据
                        cpt.showPoker();
                        this.freshPlayerCostChipInfo(player, player_game_data.betScore, false); //玩家下注数据
                        if (player.userId == cc.dd.user.id)
                            this.showCurOperateBtns();
                        this.m_oTotalChipsTxt.string = deskData.getCurBet(); //显示当前桌子总压注
                    }
                    //if(player_game_data.userState == config_state.UserStateNormal ){//游戏中

                    //}    
                }
            }



            // if(player_game_data){
            //     var cpt = this.m_tPlayerList[player_common_data.pos].getComponent('dsz_player_ui');
            //     if(player_game_data.userState != config_state.UserStateUnPrepare){
            //         cpt.initData(player_game_data);//玩家游戏数据
            //         cpt.showPoker();
            //         this.freshPlayerCostChipInfo(player, player_game_data.betScore, false); //玩家下注数据
            //         if(player.userId == cc.dd.user.id)
            //             this.showCurOperateBtns();
            //     }else{
            //         if(player_common_data){
            //             if(player_game_data.userState == config_state.UserStateUnPrepare){
            //                 if(userId == cc.dd.user.id){
            //                     var oStartBtn = cc.dd.Utils.seekNodeByName(this.node, "reReadyBtn");;
            //                     if(player.isRoomer){//玩家是房主
            //                         oStartBtn.getComponent(cc.Button).interactable = false;
            //                         oStartBtn.active = true;
            //                     }else{//玩家不是房主
            //                         oStartBtn.active = true;
            //                     }
            //                 }
            //             }else{
            //                 var cpt = this.m_tPlayerList[player_common_data.pos].getComponent('dsz_player_ui')
            //                 cpt.setPlayerData(player_game_data);//玩家游戏数据

            //                 this.freshPlayerCostChipInfo(player, this.m_nBaskChip, true); //默认玩家下注
            //                 this.m_oTotalChipsTxt.string = deskData.getCurBet(); //显示当前桌子总压注

            //             }
            //         }
            //     }
            // }
        }

    },

    //更新玩家下注数据/玩家身上筹码
    freshPlayerCostChipInfo: function (player, bet, isAct) {
        var pos = player.getPlayerCommonInfo().pos; //获取位置点
        this.m_oChipAreaNode.getComponent('dsz_chip_ui').bet(pos, bet, isAct); //下注筹码动画
        this.m_tPlayerList[pos].getComponent('dsz_player_ui').freshPlayerChip();//玩家更新筹码数据/玩家身上筹码
    },

    //更新桌子总的下注
    freshDeskTotalChip: function (bet) {
        var roomMgr = require('jlmj_room_mgr').RoomMgr.Instance();

        deskData.updateCurBet(bet); //更新当前桌子总压注
        this.m_oTotalChipsTxt.string = deskData.getCurBet(); //显示当前桌子总压注
        if (deskData.getCurBet() > roomMgr._Rule.limitWatch) {
            var player = playerMgr.findPlayerByUserId(cc.dd.user.id)
            if (player) {
                var player_common_data = player.getPlayerCommonInfo();
                if (player_common_data) {
                    this.m_tPlayerList[player_common_data.pos].getComponent('dsz_player_ui').showWatchPokerDesc(); //刷新看牌描述
                }
            }
        }


    },

    /////////////////////////////////////////////////////////桌子/玩家数据更新end////////////////////////////////

    //发牌动画
    sendPoker: function () {
        var playercount = deskData.getPlayerCount();
        this.m_nIndex += 1;
        if (this.m_nIndex > playercount) {
            this.m_nIndex = 0;
            this.showCurOperateBtns();
            this.m_bClearChip = false;
            return;
        }
        var pos = playerMgr.getBankerClientPos();

        //执行发牌
        var clientPos = (pos + this.m_nIndex) % playercount;
        var player = playerMgr.findPlayerByUserPos(clientPos);
        if (player) {
            this.m_tPlayerList[clientPos].getChildByName('readyTag').active = false;
            var cpt = this.m_tPlayerList[clientPos].getComponent('dsz_player_ui');
            if (cpt) {
                cpt.sendPoker();
                AudioManager.getInstance().playSound(Prefix + 'fapai', false);
            }
            var self = this;
            self.sendPoker_id = setTimeout(function () {
                self.sendPoker();
            }, 800);
        } else {
            this.sendPoker();
        }

    },

    //显示当前按钮
    showCurOperateBtns: function () {
        this.cancelCmpSelect();
        this.changeActivePlayer(deskData.getLastOpUser(), deskData.getCurOpUser()); //更换操作玩家
        this.m_oMenuNode.active = true;
        var self = this;

        if (cc.dd.user.id == deskData.getCurOpUser()) {//下一个操作玩家是自己
            this.m_oMenuNode.getComponent('dsz_game_menu').analysisPycPlayerOpBtn();
        } else {
            var ownData = playerMgr.findPlayerByUserId(cc.dd.user.id).getPlayerGameInfo();
            if (ownData.userState != config_state.UserStateFold && ownData.userState != config_state.UserStateLost) {
                this.m_oMenuNode.getComponent('dsz_game_menu').showAutoOpBtn();
            }
            else
                this.m_oMenuNode.getComponent('dsz_game_menu').hideAllBtn();
        }
    },

    //更换下一个操作玩家
    changeActivePlayer: function (userid, nextuserid) {
        this.activePlayer(userid, false);
        this.activePlayer(nextuserid, true);
    },

    //玩家操作倒计时
    activePlayer: function (userid, state) {
        var player = playerMgr.findPlayerByUserId(userid);
        if (player) {
            var player_common_data = player.getPlayerCommonInfo();
            if (player_common_data) {
                this.m_tPlayerList[player_common_data.pos].getComponent('dsz_player_ui').setPlayerState(state, false); //玩家操作状态
            }
        }
    },

    //更新桌子轮数
    updateDeskCircle: function (isUpdate) {
        //this.m_oCircleTxt.string = deskData.getCurCircle() + '/' + deskData.getTotalCircleCount();
        //轮数
        this.m_oDescTxt.string = '底注:' + this.m_nBaskChip + '  轮数:' + deskData.getCurCircle() + '/' + deskData.getTotalCircleCount();
        var player = playerMgr.findPlayerByUserId(cc.dd.user.id);
        if (player) {
            var player_common_data = player.getPlayerCommonInfo();
            if (player_common_data) {
                this.m_tPlayerList[player_common_data.pos].getComponent('dsz_player_ui').showWatchPokerDesc(); //刷新看牌描述
            }
            if (isUpdate)
                this.showCurOperateBtns();
        }
    },

    //重置桌面的数据
    resetDeskData: function () {
        deskData.resetDeskData();
        playerMgr.resetAllPlayerData();

        this.updateDeskData();
        //重置桌面显示
        playerMgr.playerInfo.forEach(function (player) {
            if (player) {
                var player_common_data = player.getPlayerCommonInfo();
                if (player_common_data) {
                    this.m_bContinue = true;
                    this.m_tPlayerList[player_common_data.pos].getComponent('dsz_player_ui').resetPlayerUI(); //重置界面
                    if (player.userId == cc.dd.user.id) {
                        var oStartBtn = cc.dd.Utils.seekNodeByName(this.node, "reReadyBtn");;
                        if (player.isRoomer) {//玩家是房主
                            oStartBtn.getComponent(cc.Button).interactable = false;
                            oStartBtn.active = true;
                        } else {//玩家不是房主
                            oStartBtn.active = true;
                        }
                    }
                }
            }
        }.bind(this));
        this.m_oMenuNode.getComponent('dsz_game_menu').resetAuto();
    },

    clear: function () {
        this.m_tPlayerList.forEach(function (ui) {
            ui.active = false;
        })
        //重置桌面显示
        playerMgr.playerInfo.forEach(function (player) {
            if (player) {
                var player_common_data = player.getPlayerCommonInfo();
                if (player_common_data) {
                    this.m_tPlayerList[player_common_data.pos].getComponent('dsz_player_ui').clearUI(); //重置界面
                }
            }
        }.bind(this));
        this.m_bClearChip = false;
        this.m_tPlayerList[0].getChildByName('readyTag').active = false;
        //deskData.resetDeskData();
        playerMgr.resetAllPlayerData();
        deskData.clear();
        require('dsz_desk_data').DSZ_Desk_Data.Destroy();
        this.m_oChipAreaNode.getComponent('dsz_chip_ui').clear();
    },

    /**
     * 分享战绩点击
     */
    onShareZhanji(event, data) {
        hall_audio_mgr.com_btn_click();
        if (cc.sys.isNative) {
            var canvasNode = cc.find('Canvas');
            if (data == 'wechat') {
                cc.dd.native_wx.SendScreenShot(canvasNode, 2);
            }
            else {
                cc.dd.native_wx.SendScreenShotTimeline(canvasNode, 2);
            }
        }
    },

    /**
     * 战绩按钮点击
     */
    onZhanji(event, data) {
        hall_audio_mgr.com_btn_click();
        cc.find('zhanjitongji', this.node).active = false;
        this.clear();
        this.backToHall();
    },

    //返回大厅
    backToHall(event, data) {
        //cc.audioEngine.stop(this.m_nMusicId);
        AudioManager.getInstance().stopMusic();
        cc.dd.SceneManager.enterHall();
    },

    // /**
    //  * 邀请微信好友
    //  */
    // onInvaite(event, custom) {
    //     if (event.type != "touchend") {
    //         return;
    //     }
    //     hall_audio_mgr.com_btn_click();
    //     var num = deskData.getPlayerCount();

    //     var title = "房间号:" + deskData.getRoomId() + '\n';
    //     var str = this.getRuleString();
    //     if (cc.sys.isNative) {
    //         cc.dd.native_wx.SendAppContent(deskData.getRoomId(), '【逗双十】', title + str, Platform.GetAppUrl(AppCfg.GAME_PID, AppCfg.PID));
    //     }
    //     cc.log("邀请好友：", str);
    // },

    /**
     * 点击菜单
     */
    onMenu(event, custom) {
        hall_audio_mgr.com_btn_click();
        if (!this.menu_show) {
            cc.find('menu', this.node).active = true;
            event.target.getComponent(cc.Button).interactable = false;
            var ani = cc.find('menu', this.node).getComponent(cc.Animation);
            if (ani._nameToState[ani._defaultClip.name]) {
                ani._nameToState[ani._defaultClip.name].wrapMode = cc.WrapMode.Normal;
            }
            cc.find('menu', this.node).getComponent(cc.Animation).off('finished', null);
            cc.find('menu', this.node).getComponent(cc.Animation).on('finished', function () { event.target.getComponent(cc.Button).interactable = true; });
            cc.find('menu', this.node).getComponent(cc.Animation).play();
            this.menu_show = true;
        }
        else {
            event.target.getComponent(cc.Button).interactable = false;
            var ani = cc.find('menu', this.node).getComponent(cc.Animation);
            ani._nameToState[ani._defaultClip.name].wrapMode = cc.WrapMode.Reverse;
            cc.find('menu', this.node).getComponent(cc.Animation).off('finished', null);
            cc.find('menu', this.node).getComponent(cc.Animation).on('finished', function () { event.target.getComponent(cc.Button).interactable = true; });
            cc.find('menu', this.node).getComponent(cc.Animation).play();
            this.menu_show = null;
        }
    },

    /**
     * 显示设置
     */
    onSetting(event, custom) {
        hall_audio_mgr.com_btn_click();
        if (custom == 'close') {
            this.node_setting.active = false;
        }
        else {
            this.menu_show = false;
            this.node_setting.active = true;
            this.node_menu.active = false;
            this.btn_menu.interactable = true;
        }
    },


    /**
     *  退出按钮
     */
    onQuit: function (event, data) {
        hall_audio_mgr.com_btn_click();
        cc.find('menu', this.node).active = false;
        this.menu_show = false;
        cc.find('btns/menu', this.node).getComponent(cc.Button).interactable = true;
        var content = "";
        var callfunc = null;
        //已经结束
        if (deskData.isEnd == true) {
            this.backToHall();
            return;
        }
        // 已经开始
        if (deskData.isStart) {
            content = cc.dd.Text.TEXT_LEAVE_ROOM_2;
            callfunc = this.reqSponsorDissolveRoom;
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
    },

    popupOKcancel: function (text, callfunc) {
        cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_TANCHUANG, function (ui) {
            ui.getComponent("jlmj_popup_view").show(text, callfunc, 1);
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
        var gameType = 35;
        var roomId = deskData.getRoomId();
        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType(gameType);
        gameInfoPB.setRoomId(roomId);
        msg.setGameInfo(gameInfoPB);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);
    },

    /**
     * 聊天按钮 
     */
    onChatClick(event, custom) {
        var roomMgr = require('jlmj_room_mgr').RoomMgr.Instance();

        if (roomMgr._Rule)
            var limitWords = roomMgr._Rule.limitWords;
        if (limitWords) {
            if (!this.wordsCD) {
                hall_audio_mgr.com_btn_click();
                cc.dd.PromptBoxUtil.show('此房间不能发言');
                this.wordsCD = true;
                this.scheduleOnce(function () {
                    this.wordsCD = false;
                }.bind(this), 2);
            }
        }
        else {
            hall_audio_mgr.com_btn_click();
            if (!this.chatAni) {
                cc.find('chat', this.node).getComponent(cc.Animation).play('chat_in');
                this.m_bShowChat = true;
            }
        }
    },


    /**
     * 显示解散
     * @param {*} msg 
     */
    showDissolve(data) {
        cc.dd.UIMgr.closeUI(jlmj_prefab.JLMJ_TANCHUANG);
        var UI = cc.dd.UIMgr.getUI('gameyj_dsz/common/prefab/dsz_dissolve');
        if (UI) {
            UI.getComponent('dsz_dissolve').setData(data);
        }
        else {
            cc.dd.UIMgr.openUI('gameyj_dsz/common/prefab/dsz_dissolve', function (ui) {
                var timeout = 30;
                var playerList = playerMgr.playerInfo;
                ui.getComponent('dsz_dissolve').setStartData(timeout, playerList, data);
            });
        }
    },

    /**
     * 解散列表（重连）
     * @param {*} msglist 
     * @param {*} time 
     */
    showDissolveList(msglist, time) {
        var UI = cc.dd.UIMgr.getUI('gameyj_dsz/common/prefab/dsz_dissolve');
        if (!UI) {
            cc.dd.UIMgr.openUI('gameyj_dsz/common/prefab/dsz_dissolve', function (ui) {
                var playerList = playerMgr.playerInfo;
                for (var i = 0; i < msglist.length; i++) {
                    if (i == 0) {
                        ui.getComponent('dsz_dissolve').setStartData(time, playerList, msglist[i]);
                    }
                    else {
                        ui.getComponent('dsz_dissolve').setData(msglist[i]);
                    }
                }
            })
        }
        else {
            for (var i = 0; i < msglist.length; i++) {
                UI.getComponent('dsz_dissolve').setData(msglist[i]);
            }
        }
    },

    /**
     * 解散结果
     * @param {*} msg 
     */
    showDissolveResult(msg) {
        var isDissolve = msg.isDissolve;
        //nn_data.Instance().isDissolved = isDissolve;
        if (isDissolve == true) {
            cc.dd.PromptBoxUtil.show('房间解散成功!');
        }
        else {
            cc.dd.PromptBoxUtil.show('房间解散失败!');
        }
        cc.dd.UIMgr.destroyUI('gameyj_dsz/common/prefab/dsz_dissolve');
    },


    //关闭按钮
    onCloseClick: function (event, data) {
        switch (data) {
            case 'setting':
                cc.find('setting', this.node).active = false;
                break;
            case 'chat':
                if (!this.chatAni) {
                    cc.find('chat', this.node).getComponent(cc.Animation).play('chat_out');
                    this.m_bShowChat = false;
                }
                break;
            case 'userinfo':
                cc.find('user_info', this.node).active = false;
                break;
        }
    },

    //快捷聊天
    onChatToggle: function (event, data) {
        if (data == 'text') {
            cc.find('chat/panel/text', this.node).getComponent(cc.ScrollView).scrollToTop(0);
            cc.find('chat/panel/text', this.node).active = true;
            cc.find('chat/panel/emoji', this.node).active = false;
        }
        else {
            cc.find('chat/panel/emoji', this.node).getComponent(cc.ScrollView).scrollToTop(0);
            cc.find('chat/panel/text', this.node).active = false;
            cc.find('chat/panel/emoji', this.node).active = true;
        }
    },

    //点击背景
    onBgClick: function () {
        if (this.menu_show) {
            cc.find('btns/menu', this.node).getComponent(cc.Button).interactable = false;
            var ani = cc.find('menu', this.node).getComponent(cc.Animation);
            ani._nameToState[ani._defaultClip.name].wrapMode = cc.WrapMode.Reverse;
            cc.find('menu', this.node).getComponent(cc.Animation).on('finished', function () { cc.find('btns/menu', this.node).getComponent(cc.Button).interactable = true; }.bind(this), this);
            cc.find('menu', this.node).getComponent(cc.Animation).play();
            this.menu_show = null;
        }
        if (this.m_bRuleshow) {
            this.m_oRuleNode.getChildByName('rule_bg').active = false;
            cc.dd.Utils.seekNodeByName(this.m_oRuleNode, 'touchBg').active = true;
            this.m_bRuleshow = false;
        }
        if (this.m_bShowChat) {
            cc.find('chat', this.node).getComponent(cc.Animation).play('chat_out');
            this.m_bShowChat = false;
        }
        // if (cc.find('player_down/beilv/detail', this.node).active == true) {`
        //     cc.find('player_down/beilv/detail', this.node).active = false;
        // }
    },

    //////////////////////////////////////////////////////////////////语音处理begin////////////////////////////////////////

    getSpeakVoice: function (userid, key) {
        var player = playerMgr.findPlayerByUserId(userid);
        if (player) {
            var player_common_data = player.getPlayerCommonInfo();
            var sex = player_common_data.sex != 1 ? 0 : 1;
            var voiceArr = config.DSZ_Audio[sex][key];
            var cnt = voiceArr.length;
            var random = Math.random();
            var num = Math.floor(random * 10);
            var remainder = num % cnt;
            return voiceArr[remainder];
        };
    },

    //同步其他客户端玩家操作
    synOtherPlayerOperate: function (userid, state) {
        cc.log('synOtherPlayerOperate');
        var text = '';
        var path = '';
        switch (state) {
            case config_state.UserStateFollow:
                text = config.speakText.GZ;
                path = this.getSpeakVoice(userid, 'AUDIO_CALL');
                break;
            case config_state.UserStateAdd:
                text = config.speakText.JZ;
                path = this.getSpeakVoice(userid, 'AUDIO_ADD');
                break;
            case config_state.UserStateFire:
                text = config.speakText.HP;
                path = this.getSpeakVoice(userid, 'AUDIO_FIRE');
                break;
            case config_state.UserStateTry:
                text = config.speakText.GZYZ;
                path = this.getSpeakVoice(userid, 'AUDIO_ALLIN');
                break;
            case config_state.UserStateCmp:
                text = config.speakText.BP;
                path = this.getSpeakVoice(userid, 'AUDIO_CMP');
                break;
            case config_state.UserStateFold:
                text = config.speakText.QP;
                path = this.getSpeakVoice(userid, 'AUDIO_FOLD');
                break;
            case config_state.UserStateWacth:
                text = config.speakText.KP;
                path = this.getSpeakVoice(userid, 'AUDIO_WATCH');
                break;
            default:
                cc.error('dsz_coin_room_ui::synOtherPlayerOperate:为何没有上一个玩家状态！');
                return;
        }
        AudioManager.getInstance().playSound(Prefix + path + '', false);
        //tdk_am.playEffect(path);
        this.activePlayerSpeak(userid, text, state);
    },

    activePlayerSpeak: function (userid, text, state) {
        var player = playerMgr.findPlayerByUserId(userid);
        if (player) {
            var commonData = player.getPlayerCommonInfo();
            this.m_tPlayerList[commonData.pos].getComponent('dsz_player_ui').doSpeak(text, state);
        }
    },

    //设置规则
    setRuleInfo: function () {
        var roomMgr = require('jlmj_room_mgr').RoomMgr.Instance();

        var baseScore = cc.dd.Utils.seekNodeByName(this.m_oRuleNode, 'baseScore').getComponent(cc.Label);
        var roomId = cc.dd.Utils.seekNodeByName(this.m_oRuleNode, 'roomId').getComponent(cc.Label);
        var roundcount = cc.dd.Utils.seekNodeByName(this.m_oRuleNode, 'roundcount').getComponent(cc.Label);
        var max = cc.dd.Utils.seekNodeByName(this.m_oRuleNode, 'max').getComponent(cc.Label);
        var type = cc.dd.Utils.seekNodeByName(this.m_oRuleNode, 'type').getComponent(cc.Label);
        var rule = cc.dd.Utils.seekNodeByName(this.m_oRuleNode, 'rule').getComponent(cc.Label);

        baseScore.string = this.m_nBaskChip;
        roomId.string = deskData.getRoomId();
        roundcount.string = deskData.getCurRound() + '/' + deskData.getTotalRoundCount();
        max.string = deskData.getTotalScroLimit();
        var ruleType = roomMgr._Rule.limitRule;
        var str = '';
        if (roomMgr._Rule.playRule == 1) {
            type.string = '1/2,2/4,4/8,8/16,10/20';
        } else {
            type.string = '1/2,2/5,5/10,10/20,20/40';
        }
        if (ruleType == 1) {
            str = '第' + roomMgr._Rule.limitWatch + '轮可以看牌 \n';
            str = str + '第' + roomMgr._Rule.limitCmp + '轮可以比牌 \n';
        } else {
            str = '达到' + roomMgr._Rule.limitWatch + '分可以看牌 \n';
            str = str + '达到' + roomMgr._Rule.limitCmp + '分可以比牌 \n';
        }

        if (deskData.getWatchAll())
            str = str + '亮底牌 \n';

        if (deskData.getIsGiveUp())
            str = str + '到时弃牌 \n';
        rule.string = str;
    },

    //展示规则
    onClickRule: function (event, data) {
        if (this.m_bRuleshow) {
            this.m_oRuleNode.getChildByName('rule_bg').active = false;
            cc.dd.Utils.seekNodeByName(this.m_oRuleNode, 'touchBg').active = true;
            this.m_bRuleshow = false;
        } else {
            this.setRuleInfo();
            this.m_bRuleshow = true;
            this.m_oRuleNode.getChildByName('rule_bg').active = true;
            cc.dd.Utils.seekNodeByName(this.m_oRuleNode, 'touchBg').active = false;
        }
    },
    //////////////////////////////////////////////////////////////////语音处理end////////////////////////////////////////

    ///////////////////////////////////////////语音/表情处理//////////////////////////////////
    //显示玩家信息
    showUserInfo: function (event, data) {
        var jlmj_prefab = require('jlmj_prefab_cfg');

        var playerInfo = playerMgr.findPlayerByUserPos(parseInt(data));
        if (!playerInfo)
            return;
        cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_USERINFO, function (ui) {
            var user_info = ui.getComponent('user_info_view');
            var playerData = playerInfo.getPlayerCommonInfo();
            user_info.setData(35, deskData.getRoomId(), null, false, playerData);
            user_info.show();
        }.bind(this));
    },
    //快捷文字
    onQuickChatClick: function (event) {
        if (!this.chatCD) {
            this.chatCD = true;
            this.scheduleOnce(function () {
                this.chatCD = false;
            }.bind(this), 2);
            hall_audio_mgr.com_btn_click();
            if (!this.chatAni) {
                cc.find('chat', this.node).getComponent(cc.Animation).play('chat_out');
                this.m_bShowChat = false;
            }

            var gameType = 35;
            var roomId = deskData.getRoomId();

            var id = parseInt(event.target.tagname);
            var pbObj = new cc.pb.room_mgr.msg_chat_message_req();
            var chatInfo = new cc.pb.room_mgr.chat_info();
            var gameInfo = new cc.pb.room_mgr.common_game_header();
            gameInfo.setGameType(gameType);
            gameInfo.setRoomId(roomId);
            chatInfo.setGameInfo(gameInfo);
            chatInfo.setMsgType(1);
            chatInfo.setId(id);
            pbObj.setChatInfo(chatInfo);
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_chat_message_req, pbObj, 'cmd_msg_chat_message_req', true);

            //玩家自己的做成单机,避免聊天按钮开关bug
            var chat_msg = {};
            chat_msg.msgtype = 1;
            chat_msg.id = id;
            chat_msg.sendUserId = cc.dd.user.id;
            ChatEd.notifyEvent(ChatEvent.CHAT, chat_msg);
        }
        else {
            cc.dd.PromptBoxUtil.show('信息发送过于频繁...');
        }
    },

    //表情点击
    onEmojiClick: function (event, data) {
        if (!this.emojiCD) {
            hall_audio_mgr.com_btn_click();
            this.emojiCD = true;
            setTimeout(function () {
                this.emojiCD = false;
            }.bind(this), 3 * 1000);
            if (!this.chatAni) {
                cc.find('chat', this.node).getComponent(cc.Animation).play('chat_out');
                this.m_bShowChat = false;
            }
            var gameType = 35;
            var roomId = deskData.getRoomId();
            var id = parseInt(data);

            var pbObj = new cc.pb.room_mgr.msg_chat_message_req();
            var chatInfo = new cc.pb.room_mgr.chat_info();
            var gameInfo = new cc.pb.room_mgr.common_game_header();
            gameInfo.setGameType(gameType);
            gameInfo.setRoomId(roomId);
            chatInfo.setGameInfo(gameInfo);
            chatInfo.setMsgType(2);
            chatInfo.setId(id);
            pbObj.setChatInfo(chatInfo);
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_chat_message_req, pbObj, 'cmd_msg_chat_message_req', true);

            //玩家自己的做成单机,避免聊天按钮开关bug
            var chat_msg = {};
            chat_msg.msgtype = 2;
            chat_msg.id = id;
            chat_msg.sendUserId = cc.dd.user.id;
            ChatEd.notifyEvent(ChatEvent.CHAT, chat_msg);
        }
    },

    onChat: function (data) {
        if (data.msgtype == 1) {//短语
            var player = playerMgr.findPlayerByUserId(data.sendUserId);
            if (player) {
                var player_common_data = player.getPlayerCommonInfo();
                var sex = player_common_data.sex;
                //this.playSound(sex, soundType.CHAT, data.id);
                var cfg = config.DSZ_Audio;

                var path = Prefix + cfg[sex]['CHAT'][data.id] + '';
                AudioManager.getInstance().playSound(path, false);
                var cfg1 = null;
                if (sex == 1) {
                    cfg1 = dsz_chat_cfg.Man;
                }
                else {
                    cfg1 = dsz_chat_cfg.Woman;
                }
                var str = cfg1[data.id];
                this.m_tPlayerList[player_common_data.pos].getComponent('dsz_player_ui').showChat(str);
            }
            // var view = this.idToView(data.sendUserId);
            // var sex = this.getPlayerById(data.sendUserId).sex;
            // this.playSound(sex, soundType.CHAT, data.id);
            // var cfg = null;
            // if (sex == 1) {
            //     cfg = ddz_chat_cfg.Man;
            // }
            // else {
            //     cfg = ddz_chat_cfg.Woman;
            // }
            // var str = cfg[data.id];
            // this._uiComponents[view].showChat(str);
        }
        else if (data.msgtype == 2) {//表情
            var player = playerMgr.findPlayerByUserId(data.sendUserId);
            if (player) {
                var player_common_data = player.getPlayerCommonInfo();
                this.m_tPlayerList[player_common_data.pos].getComponent('dsz_player_ui').showEmoji(data.id);
            }
            // var view = this.idToView(data.sendUserId);
            // this._uiComponents[view].showEmoji(data.id);
        }
        else if (data.msgtype == 3) {//魔法表情
            this.playMagicProp(data.id, data.sendUserId, data.toUserId);
        }
    },

    //播放魔法表
    playMagicProp: function (id, send, to) {
        var sPos = this.getPlayerHeadPos(send);
        var ePos = this.getPlayerHeadPos(to);

        let magic_prop = cc.find("Canvas").getComponentInChildren("com_magic_prop");
        magic_prop.playMagicPropAni(id, sPos, ePos);
    },

    getPlayerHeadPos: function (id) {
        var player = playerMgr.findPlayerByUserId(id);
        if (player) {
            var pos = player.getPlayerCommonInfo().pos;
            var head = cc.dd.Utils.seekNodeByName(this.m_tPlayerList[pos], 'head');
            var postion = head.convertToWorldSpace(cc.v2(head.width / 2, head.height / 2));
            return postion;
        }
        // var view = this.idToView(id);
        // var head = this.getHeadByView(view);
        // var pos = head.convertToWorldSpace(cc.v2(head.width / 2, head.height / 2));
        // return pos;
    },

    on_player_location_change: function (msg) {
        var userId = msg.userId;
        var latlngInfo = msg.latlngInfo;
        var player = playerMgr.findPlayerByUserId(userId).getPlayerCommonInfo();
        if (player) {
            player.location = latlngInfo;
        }
        this.refreshGPSWarn();
        var UI = cc.dd.UIMgr.getUI(jlmj_prefab.JLMJ_USERINFO);
        if (UI) {
            playList = [];
            var playerInfo = playerMgr.playerInfo;
            for (var i = 0; i < playerInfo.length; i++) {
                var common_player_data = playerInfo[i].getPlayerCommonInfo();
                playerlist.push(common_player_data);
            }
            UI.getComponent('user_info_view').setGpsData(playerlist);
        }
    },

    refreshGPSWarn: function () {
        var roomMgr = require('jlmj_room_mgr').RoomMgr.Instance();

        if (roomMgr._Rule.isGps) {
            var gpsList = [];
            var playerInfo = playerMgr.playerInfo;
            for (var i = 0; i < playerInfo.length; i++) {
                if (playerInfo[i]) {
                    var common_player_data = playerInfo[i].getPlayerCommonInfo();
                    cc.dd.Utils.seekNodeByName(this.m_tPlayerList[common_player_data.pos], 'gps_bj').active = false;
                    if (playerInfo[i] && common_player_data.location) {
                        gpsList.push({ userId: playerInfo[i].userId, location: common_player_data.location });
                    }
                }
            }
            for (var i = 0; i < gpsList.length - 1; i++) {
                for (var j = i; j < gpsList.length - 1; j++) {
                    if (this.getDistance(gpsList[i].location, gpsList[j + 1].location) < 100) {
                        var common_player_data = playerMgr.findPlayerByUserId(gpsList[j].userId).getPlayerCommonInfo();
                        cc.dd.Utils.seekNodeByName(this.m_tPlayerList[common_player_data.pos], 'gps_bj').active = true;

                        var common_player_data_next = playerMgr.findPlayerByUserId(gpsList[j + 1].userId).getPlayerCommonInfo();
                        cc.dd.Utils.seekNodeByName(this.m_tPlayerList[common_player_data_next.pos], 'gps_bj').active = true;
                        // cc.find('gps_bj', this._uiComponents[this.idToView(gpsList[j].userId)].headnode).active = true;
                        // cc.find('gps_bj', this._uiComponents[this.idToView(gpsList[j + 1].userId)].headnode).active = true;
                    }
                }
            }
        }
    },
    getDistance(locA, locB) {
        if (!cc.sys.isNative) {
            return 0xFFFF;
        }
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            var distance = jsb.reflection.callStaticMethod("game/SystemTool", "getDistanceBetwwen", "(FFFF)F", locA.latitude, locB.latitude, locA.longitude, locB.longitude);
            cc.log('gps距离:++++++' + distance);
            return distance;
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            var distance = jsb.reflection.callStaticMethod('SystemTool', 'getDistance:endLatitude:startLongitude:endLongitude:', locA.latitude, locB.latitude, locA.longitude, locB.longitude);
            cc.log('gps距离:++++++' + distance);
            return distance;
        }
    },

    /////////////////////////////////////////消息通讯///////////////////////////////////
    onEventMessage: function (event, data) {
        switch (event) {
            case playerEvent.DSZ_PLAYER_ENTER: //玩家进入
                this.playerEnter(data);
                break;
            case playerEvent.DSZ_PLAYER_READY: //玩家准备
                this.playerReady_Rsp(data);
                var own = playerMgr.findPlayerByUserId(cc.dd.user.id);
                if (own && own.isRoomer) {
                    var canOpen = playerMgr.checkPlayerAllReady();
                    if (canOpen)
                        this.playerAllReady_Rsp();
                }
                break;
            case playerEvent.DSZ_PLAYER_INIT_DATA: //玩家数据实例化
                this.initPlayerGameData(data);
                break;
            case playerEvent.DSZ_PLAYER_WATCH_POKER: //玩家看牌
                this.playerWatch_Rsp(data);
                break;
            case playerEvent.DSZ_PLYER_EXIT: //玩家离开
                this.playerLeave_Rsp(data);
                break;
            case playerEvent.PLAYER_ISONLINE: //玩家在线状态
                this.playerOnline(data);
                break;
            case deskEvent.DSZ_DEDSK_SEND_POKER: //发牌
                this.updateDeskCircle(false);
                this.sendPoker();
                break;
            case deskEvent.DSZ_DEDSK_CALL: //跟注
                this.playerAddChip_Rsp(data, true);
                break;
            case deskEvent.DSZ_DEDSK_UPDATE_CIRCLE: //更新轮数
                this.updateDeskCircle(true);
                break;
            case deskEvent.DSZ_DEDSK_COMPARE: //比牌
                this.playerCmp_Rsp();
                break;
            case deskEvent.DSZ_DEDSK_COMPARE_RESULT: //比牌结果
                this.playerCmpResult_Rsp(data.userId, data.cmpId, data.winner);
                break;
            case deskEvent.DSZ_DEDSK_FOLD: //弃牌
                this.playerFold_Rsp(data);
                break;
            case deskEvent.DSZ_DEDSK_SHOW_ROUND_RESULE: //单局结算
                this.roundResut_Rsp(data);
                break;
            case deskEvent.DSZ_DEDSK_SHOW_RESULE: //总结算
                this.showResultTotal_Rsp(data);
                break;
            case deskEvent.DSZ_DEDSK_DISSOVlE: //解散消息
                this.showDissolve(data);
                break;
            case deskEvent.DSZ_DEDSK_DISSOVLE_RESULT: //解散结果
                this.showDissolveResult(data);
                break;
            case deskEvent.CHECK_PLAYER_ALL_READY:
                var canOpen = playerMgr.checkPlayerAllGameReady();
                if (canOpen)
                    this.playerAllReady_Rsp();
                break;
            case deskEvent.DSZ_DEDSK_ERROR:
                this.m_oMenuNode.getComponent('dsz_game_menu').showAutoOpBtn();
                break;
            case ChatEvent.CHAT:
                this.onChat(data);
                break;
            case HallCommonEvent.HALL_NO_RECONNECT_GAME:
                this.sendLeaveRoom();
                break;
            case RoomEvent.on_room_enter:
                if (!deskData.isStart) {
                    var own = playerMgr.findPlayerByUserId(cc.dd.user.id);
                    if (own && own.isRoomer) {
                        var canOpen = playerMgr.checkPlayerAllReady();
                        if (canOpen)
                            this.playerAllReady_Rsp();
                    }
                }
                break;
            case RoomEvent.update_player_location:
                this.on_player_location_change(data[0]);
                break;

            case RecordEvent.PLAY_RECORD:
                for (var i = 0; i < playerMgr.playerInfo.length; i++) {
                    if (playerMgr.playerInfo[i] && playerMgr.playerInfo[i].userId) {
                        if (data.accid.toLowerCase() == (cc.dd.prefix + playerMgr.playerInfo[i].userId).toLowerCase()) {
                            playerMgr.playerInfo[i].getComponent('dsz_player_ui').play_yuyin(data.duration);
                        }
                    }
                }
                // for (var i = 0; i < DDZ_Data.Instance().playerInfo.length; i++) {
                //     if (DDZ_Data.Instance().playerInfo[i] && DDZ_Data.Instance().playerInfo[i].userId) {
                //         if (data.accid.toLowerCase() == (cc.dd.prefix + DDZ_Data.Instance().playerInfo[i].userId).toLowerCase()) {
                //             this._uiComponents[this.idToView(DDZ_Data.Instance().playerInfo[i].userId)].play_yuyin(data.duration);
                //         }
                //     }
                // }
                break;
            //GVoice 语音
            case cc.dd.native_gvoice_event.PLAY_GVOICE:
                var player = playerMgr.findPlayerByUserId(data[0]);
                if (player) {
                    player.getComponent('dsz_player_ui').showYuYing(true);
                }
                // for (var i = 0; i < DDZ_Data.Instance().playerInfo.length; i++) {
                //     if (DDZ_Data.Instance().playerInfo[i] && DDZ_Data.Instance().playerInfo[i].userId) {
                //         if (data[0] == DDZ_Data.Instance().playerInfo[i].userId) {
                //             let head = this._uiComponents[this.idToView(DDZ_Data.Instance().playerInfo[i].userId)];
                //             head.yuyin_laba.node.active = true;
                //             head.yuyin_laba.yuyin_size.node.active = false;
                //         }
                //     }
                // }
                break;
            case cc.dd.native_gvoice_event.STOP_GVOICE:
                var player = playerMgr.findPlayerByUserId(data[0]);
                if (player) {
                    player.getComponent('dsz_player_ui').showYuYing(false);
                }
                // for (var i = 0; i < DDZ_Data.Instance().playerInfo.length; i++) {
                //     if (DDZ_Data.Instance().playerInfo[i] && DDZ_Data.Instance().playerInfo[i].userId) {
                //         if (data[0] == DDZ_Data.Instance().playerInfo[i].userId) {
                //             let head = this._uiComponents[this.idToView(DDZ_Data.Instance().playerInfo[i].userId)];
                //             head.yuyin_laba.node.active = false;
                //             head.yuyin_laba.yuyin_size.node.active = false;
                //         }
                //     }
                // }
                break;
        }
    },
});
