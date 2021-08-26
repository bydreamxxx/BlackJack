var hall_audio_mgr = require('hall_audio_mgr').Instance();
var PY_Data = require("paoyao_data").PaoYao_Data;
var AudioManager = require('AudioManager');
var chat_game_cfg = require('chat_game_cfg');
var py_config = require('py_config');
var ChatEd = require('jlmj_chat_data').ChatEd;
var ChatEvent = require('jlmj_chat_data').ChatEvent;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var jlmj_prefab = require('jlmj_prefab_cfg');
var py_send_msg = require('py_send_msg');
var Define = require('Define');
const soundpath = 'gameyi_paoyao/common/sound/Music_Game';


cc.Class({
    extends: cc.Component,

    properties: {
        zhuobu: { default: [], type: cc.SpriteFrame, tooltip: '桌布列表' },
        chatItems: [cc.Node],
        haohuaArr: { default: [], type: cc.Node, tooltip: '喊话遮罩' },
    },

    onLoad: function () {
        this.init();
        this.initZhuoBu();
        this.initMusicAndSound();
        this.initChat();
    },

    init: function () {
        //底分
        var score_str = '底分: ' + PY_Data.getInstance().GetScore();
        cc.find('room_info/base_score', this.node).getComponent(cc.Label).string = score_str;
        //玩家信息
        cc.find('user_info', this.node).active = false;
        this.initBtns(false);
    },

    initBtns: function (bl) {
        //聊天
        cc.find('btns/chat', this.node).active = bl;
        //语音
        cc.find('btns/chat', this.node).active = bl;
        //记牌器
        cc.find('btns/jipaiqi', this.node).active = false;
    },

    onDestroy: function () {
        PY_Data.getInstance().Destroy();
    },

    /**
     * 聊天界面初始化
     */
    initChat: function () {
        cc.find('chat/panel/tabel_group/hanhua/checkmark', this.node).active = true;
        this.chatList = new Array();
        var chatnode = cc.find('chat/panel', this.node);
        if (chatnode) {
            this.chatList['hanhua'] = chatnode.getChildByName('hanhua_list');
            this.chatList['duanyu'] = chatnode.getChildByName('duanyu_list');
            this.chatList['biaoqing'] = chatnode.getChildByName('biaoqing_grid');
        }
        this.selectedChatBotton('hanhua');

        this.initDuanYu();
    },

    /**
     * 选中聊天按钮—更新面板状态
     */
    selectedChatBotton: function (name) {
        if (!this.chatItems || !this.chatList)
            return;

        var itmelength = this.chatItems.length;
        for (var i = 0; i < itmelength; ++i) {
            var item = this.chatItems[i];
            if (!item)
                continue;
            if (item.name == name) {
                item.getChildByName('checkmark').active = true;
            } else {
                item.getChildByName('checkmark').active = false;
            }
        }

        for (var key in this.chatList) {
            if (key == name)
                this.chatList[key].active = true;
            else
                this.chatList[key].active = false;
        }
    },

    initDuanYu: function () {
        var duanyu_list = chat_game_cfg.getItem(function (itrem) {
            if (itrem.game_id == 10) {
                return itrem;
            }
        });
        if (duanyu_list == null)
            return;

        var cfg = null;
        if (cc.dd.user.sex == 1) {
            cfg = py_config.Man;
        }
        else {
            cfg = py_config.Woman;
        }

        var parent = cc.find("chat/panel/duanyu_list/view/content", this.node);
        this.duan_yu_item = cc.find("chat/panel/duan_yu_item", this.node);
        for (var i = 0, len = cfg.length; i < len; ++i) {
            var item = cc.instantiate(this.duan_yu_item);
            item.active = true;
            item.tagname = i;
            item.x = 0;
            var itmelabel = item.getChildByName('label').getComponent(cc.Label);
            itmelabel.string = cfg[i];
            item.on('click', this.onQuickChatClick, this);
            parent.addChild(item);

        }
    },

    onClickClose: function () {
        cc.dd.UIMgr.destroyUI(this.node);
    },

    //btns点击
    onButtonClick: function (event, data) {
        switch (data) {
            case 'menu'://菜单
                hall_audio_mgr.com_btn_click();
                if (!this.menu_show) {
                    cc.find('menu/toun', this.node).active = true;
                    cc.find('menu', this.node).active = true;
                    event.target.getComponent(cc.Button).interactable = false;
                    var ani = cc.find('menu', this.node).getComponent(cc.Animation);
                    if (ani._nameToState[ani._defaultClip.name]) {
                        ani._nameToState[ani._defaultClip.name].wrapMode = cc.WrapMode.Normal;
                    }
                    cc.find('menu', this.node).getComponent(cc.Animation).on('finished', function () { event.target.getComponent(cc.Button).interactable = true; });
                    cc.find('menu', this.node).getComponent(cc.Animation).play();
                    this.menu_show = true;
                }
                else {
                    cc.find('menu/toun', this.node).active = false;
                    event.target.getComponent(cc.Button).interactable = false;
                    var ani = cc.find('menu', this.node).getComponent(cc.Animation);
                    ani._nameToState[ani._defaultClip.name].wrapMode = cc.WrapMode.Reverse;
                    cc.find('menu', this.node).getComponent(cc.Animation).on('finished', function () { event.target.getComponent(cc.Button).interactable = true; });
                    cc.find('menu', this.node).getComponent(cc.Animation).play();
                    this.menu_show = null;
                }
                break;
            case 'tuoguan'://托管
                hall_audio_mgr.com_btn_click();
                cc.find('menu', this.node).active = false;
                this.menu_show = false;
                cc.find('btns/menu', this.node).getComponent(cc.Button).interactable = true;
                var roomtype = RoomMgr.Instance().gameId;
                if (roomtype == Define.GameType.PAOYAO_FRIEND) {
                    return;
                }
                py_send_msg.sendTuoguan(true);
                break;
            case 'setting'://设置
                hall_audio_mgr.com_btn_click();
                cc.find('setting', this.node).active = true;
                cc.find('menu', this.node).active = false;
                this.menu_show = false;
                cc.find('btns/menu', this.node).getComponent(cc.Button).interactable = true;
                break;
            case 'chat'://聊天
                hall_audio_mgr.com_btn_click();
                cc.find('chat', this.node).getComponent(cc.Animation).play('paoyao_chat_in');
                break;
            case 'jipaiqi': //记分器
                hall_audio_mgr.com_btn_click();
                this.switchJipaiqi(event, data);
                break;
            case 'vip'://vip介绍
                hall_audio_mgr.com_btn_click();
                cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_VIP);
                break;
            case 'rule'://规则
                hall_audio_mgr.com_btn_click();
                if (cc.find('room_info/detail', this.node).active == true) {
                    cc.find('room_info/detail', this.node).active = false;
                }
                else {
                    cc.find('room_info/detail', this.node).active = true;
                }
                break;
            case 'rank'://退出
                hall_audio_mgr.com_btn_click();
                cc.find('menu', this.node).active = false;
                this.menu_show = false;
                cc.find('btns/menu', this.node).getComponent(cc.Button).interactable = true;
                if (PY_Data.getInstance().getIsStart()) {
                    cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_TANCHUANG, function (ui) {
                        ui.getComponent("jlmj_popup_view").show('正在游戏中，退出后系统自动出牌，是否退出?', this.leave_game_req, 1);
                    }.bind(this));
                } else if (PY_Data.getInstance().getIsMatching()) {
                    // 取消匹配状态
                    this.leave_game_req();
                } else if (PY_Data.getInstance().isSettlement) {
                    this.leave_game_req();
                } else
                    this.backToHall();
                break;
            case 'exit'://解散
                hall_audio_mgr.com_btn_click();
                cc.find('menu', this.node).active = false;
                this.menu_show = false;
                cc.find('btns/menu', this.node).getComponent(cc.Button).interactable = true;
                var content = "";
                var callfunc = null;
                //已经结束
                if (PY_Data.getInstance().isEnd) {
                    this.backToHall();
                    return;
                }
                // 已经开始
                if (PY_Data.getInstance().getIsStart()) {
                    content = cc.dd.Text.TEXT_LEAVE_ROOM_2;
                    callfunc = this.reqSponsorDissolveRoom;
                }
                else {
                    if (RoomMgr.Instance().isRoomer(cc.dd.user.id)) {
                        content = cc.dd.Text.TEXT_LEAVE_ROOM_1;
                        callfunc = this.leave_game_req;
                    } else {
                        content = cc.dd.Text.TEXT_LEAVE_ROOM_3;
                        callfunc = this.leave_game_req;
                    }
                }
                this.popupOKcancel(content, callfunc);

                break;
        }
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
    leave_game_req: function () {
        var msg = new cc.pb.room_mgr.msg_leave_game_req();
        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType(RoomMgr.Instance().gameId);
        gameInfoPB.setRoomId(RoomMgr.Instance().roomId);
        msg.setGameInfo(gameInfoPB);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);
    },

    /**
     * 解散房间二次确认
     */
    popupOKcancel: function (text, callfunc) {
        cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_TANCHUANG, function (ui) {
            ui.getComponent("jlmj_popup_view").show(text, callfunc, 1);
        }.bind(this));
    },

    //关闭按钮
    onCloseClick: function (event, data) {
        hall_audio_mgr.com_btn_click();
        switch (data) {
            case 'setting':
                cc.find('setting', this.node).active = false;
                break;
            case 'chat':
                cc.find('chat', this.node).getComponent(cc.Animation).play('paoyao_chat_out');
                break;
            case 'userinfo':
                cc.find('user_info', this.node).active = false;
                break;

        }
    },

    //返回大厅
    backToHall: function (event, data) {
        PY_Data.getInstance().Destroy();
        cc.dd.SceneManager.enterHall();
    },

    //显示关闭记牌器
    switchJipaiqi(event, data) {
        var node = event.target.getChildByName('bg');
        if (node.active == true) {
            node.active = false;
        }
        else {
            node.active = true;
        }
    },

    //==================设置界面
    initZhuoBu() {
        var idx = 0;
        var json = cc.sys.localStorage.getItem('paoyao_zhuobu_' + cc.dd.user.id);
        if (json) {
            var sprite = null;
            this.zhuobu.forEach(function (element, index) {
                if (element._name == json) {
                    sprite = element;
                    idx = index;
                }
            });
            if (sprite) {
                cc.find('bg', this.node).getComponent(cc.Sprite).spriteFrame = sprite;
            }
            else {
                cc.find('bg', this.node).getComponent(cc.Sprite).spriteFrame = this.zhuobu[0];
                cc.sys.localStorage.setItem('paoyao_zhuobu_' + cc.dd.user.id, this.zhuobu[0]._name);
            }
        }
        else {
            cc.find('bg', this.node).getComponent(cc.Sprite).spriteFrame = this.zhuobu[0];
            cc.sys.localStorage.setItem('paoyao_zhuobu_' + cc.dd.user.id, this.zhuobu[0]._name);
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
                var move = cc.moveTo(1, cc.v2(-(++this.idxZm) * (this.zmSpacingX + this.zmWidth)));
                cc.sys.localStorage.setItem('paoyao_zhuobu_' + cc.dd.user.id, this.zhuobu[this.idxZm]._name);
                cc.find('bg', this.node).getComponent(cc.Sprite).spriteFrame = this.zhuobu[this.idxZm];
                var func = function () {
                    this.toggleZm.children[this.idxZm].getChildByName('lv').active = false;
                    this.toggleZm.children[this.idxZm + 1].getChildByName('lv').active = true;
                    this.changingZhuobu = false;
                    this.freshNextPreBtn();
                }.bind(this);
                this.contentZm.runAction(cc.sequence(move.easing(cc.easeQuinticActionOut()), cc.callFunc(func)));
            }
        }
    },

    preZhuobu() {
        if (!this.changingZhuobu) {
            if (this.zhuobu[this.idxZm - 1]) {
                this.nextBgBtn.interactable = false;
                this.preBgBtn.interactable = false;
                this.changingZhuobu = true;
                var move = cc.moveTo(1, cc.v2(-(--this.idxZm) * (this.zmSpacingX + this.zmWidth)));
                cc.sys.localStorage.setItem('paoyao_zhuobu_' + cc.dd.user.id, this.zhuobu[this.idxZm]._name);
                cc.find('bg', this.node).getComponent(cc.Sprite).spriteFrame = this.zhuobu[this.idxZm];
                var func = function () {
                    this.toggleZm.children[this.idxZm + 2].getChildByName('lv').active = false;
                    this.toggleZm.children[this.idxZm + 1].getChildByName('lv').active = true;
                    this.changingZhuobu = false;
                    this.freshNextPreBtn();
                }.bind(this);
                this.contentZm.runAction(cc.sequence(move.easing(cc.easeQuinticActionOut()), cc.callFunc(func)));
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
            AudioManager.getInstance().onMusic(soundpath);
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
                {
                    if (AudioManager.getInstance()._getLocalMusicSwitch()) {//on  需要关闭
                        if (!this.switch_music) {
                            cc.find('label_kai', event.target).active = false;
                            var move = cc.moveTo(duration, cc.v2(-50, 0));
                            var spFunc = cc.callFunc(function () {
                                cc.find('tao/y', event.target).active = false;
                                cc.find('tao/b', event.target).active = true;
                                cc.find('label_guan', event.target).active = true;
                                AudioManager.getInstance().offMusic();
                            }.bind(this));
                            var action = cc.sequence(move, spFunc);
                            var width = cc.find('mask', event.target).width;
                            var time = duration;
                            this.switch_music = true;
                            event.target.getComponent(cc.Button).schedule(function () {
                                time -= step;
                                if (time < 0)
                                    time = 0;
                                cc.find('mask', event.target).width = width * time / duration;
                                if (time == 0) {
                                    event.target.getComponent(cc.Button).unscheduleAllCallbacks();
                                    this.switch_music = false;
                                }
                            }.bind(this), step);
                            cc.find('tao', event.target).runAction(action);
                        }
                    }
                    else {
                        if (!this.switch_music) {
                            cc.find('label_guan', event.target).active = false;
                            var move = cc.moveTo(duration, cc.v2(46.6, 0));
                            var spFunc = cc.callFunc(function () {
                                cc.find('tao/y', event.target).active = true;
                                cc.find('tao/b', event.target).active = false;
                                cc.find('label_kai', event.target).active = true;
                                AudioManager.getInstance().onMusic(soundpath);
                            }.bind(this));
                            var action = cc.sequence(move, spFunc);
                            var width = 138;
                            var time = duration;
                            this.switch_music = true;
                            event.target.getComponent(cc.Button).schedule(function () {
                                time -= step;
                                if (time < 0)
                                    time = 0;
                                cc.find('mask', event.target).width = width * (1 - time / duration);
                                if (time == 0) {
                                    event.target.getComponent(cc.Button).unscheduleAllCallbacks();
                                    this.switch_music = false;
                                }
                            }.bind(this), step);
                            cc.find('tao', event.target).runAction(action);
                        }
                    }
                    break;
                }
            case 'sound':
                if (AudioManager.getInstance()._getLocalSoundSwitch()) {//on  需要关闭
                    if (!this.switch_sound) {
                        cc.find('label_kai', event.target).active = false;
                        var move = cc.moveTo(duration, cc.v2(-50, 0));
                        var spFunc = cc.callFunc(function () {
                            cc.find('tao/y', event.target).active = false;
                            cc.find('tao/b', event.target).active = true;
                            cc.find('label_guan', event.target).active = true;
                            AudioManager.getInstance().offSound();
                        }.bind(this));
                        var action = cc.sequence(move, spFunc);
                        var width = cc.find('mask', event.target).width;
                        var time = duration;
                        this.switch_sound = true;
                        event.target.getComponent(cc.Button).schedule(function () {
                            time -= step;
                            if (time < 0)
                                time = 0;
                            cc.find('mask', event.target).width = width * time / duration;
                            if (time == 0) {
                                event.target.getComponent(cc.Button).unscheduleAllCallbacks();
                                this.switch_sound = false;
                            }
                        }.bind(this), step);
                        cc.find('tao', event.target).runAction(action);
                    }
                }
                else {
                    if (!this.switch_sound) {
                        cc.find('label_guan', event.target).active = false;
                        var move = cc.moveTo(duration, cc.v2(43, 0));
                        var spFunc = cc.callFunc(function () {
                            cc.find('tao/y', event.target).active = true;
                            cc.find('tao/b', event.target).active = false;
                            cc.find('label_kai', event.target).active = true;
                            AudioManager.getInstance().onSound();
                        }.bind(this));
                        var action = cc.sequence(move, spFunc);
                        var width = 138;
                        var time = duration;
                        this.switch_sound = true;
                        event.target.getComponent(cc.Button).schedule(function () {
                            time -= step;
                            if (time < 0)
                                time = 0;
                            cc.find('mask', event.target).width = width * (1 - time / duration);
                            if (time == 0) {
                                event.target.getComponent(cc.Button).unscheduleAllCallbacks();
                                this.switch_sound = false;
                            }
                        }.bind(this), step);
                        cc.find('tao', event.target).runAction(action);
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

    /**
     * 喊话界面-按钮事件
     */
    onChatButtonEvent: function (event, data) {
        hall_audio_mgr.com_btn_click();
        this.selectedChatBotton(data);
    },

    /**
     * 喊话内容点击事件
     */
    onHanHuaEvnet: function (event, data) {
        var id = parseInt(data);
        cc.log("喊话内容点击事件---: ", id);
        if (id > 0) {
            this.showHaoHua(true);
            this.checkSendChatCD();
            py_send_msg.sendChat(id);
        }
    },

    /**
     * 底板喊话点击事件
     */
    onFloorHanHuaEvnet: function (event, data) {
        var id = parseInt(data);
        cc.log("喊话内容点击事件---: ", id);
        if (id > 0 && !this.chatCD) {
            this.showHaoHua(true);
            this.checkSendChatCD(true);
            py_send_msg.sendChat(id);
        }
    },
    /**
     * 表情点击事件
     */
    onBiaoQingEvent: function (event, data) {
        var id = parseInt(data);
        cc.log("表情点击事件---: ", id);
        if (id > 0) {
            this.checkSendChatCD();
            this.sendChatMsg(2, id);
        }
    },

    //快捷文字
    onQuickChatClick: function (event) {
        this.checkSendChatCD();
        var id = parseInt(event.target.tagname);
        this.sendChatMsg(1, id + 1);
    },

    /**
     * 请求聊天协议
     * @param type 聊天类型
     * @param id 聊天内容id
     */
    sendChatMsg: function (type, id) {
        var gameType = RoomMgr.Instance().gameId;
        var roomId = RoomMgr.Instance().roomId;
        var pbObj = new cc.pb.room_mgr.msg_chat_message_req();
        var chatInfo = new cc.pb.room_mgr.chat_info();
        var gameInfo = new cc.pb.room_mgr.common_game_header();
        gameInfo.setGameType(gameType);
        gameInfo.setRoomId(roomId);
        chatInfo.setGameInfo(gameInfo);
        chatInfo.setMsgType(type);
        chatInfo.setId(id);
        pbObj.setChatInfo(chatInfo);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_chat_message_req, pbObj, 'cmd_msg_chat_message_req', true);

        //玩家自己的做成单机,避免聊天按钮开关bug
        var chat_msg = {};
        chat_msg.msgtype = type;
        chat_msg.id = id;
        chat_msg.sendUserId = cc.dd.user.id;
        ChatEd.notifyEvent(ChatEvent.CHAT, chat_msg);
    },

    /**
     * 检查聊天CD
     * @param bl 是否不播动画
     */
    checkSendChatCD: function (bl) {
        if (!this.chatCD) {
            if (!bl)
                cc.find('chat', this.node).getComponent(cc.Animation).play('paoyao_chat_out');
            this.chatButton = cc.find('btns/chat', this.node).getComponent(cc.Button);
            this.chatCD = true;
            this.scheduleOnce(function (chat) {
                this.chatCD = false;
                this.chatButton.Enable = true;
                this.chatButton.interactable = true;
                this.showHaoHua(false);
            }.bind(this), 2);
            this.chatButton.interactable = false;
            this.chatButton.Enable = false;
            hall_audio_mgr.com_btn_click();
        } else {
            cc.dd.PromptBoxUtil.show('信息发送过于频繁...');
        }
    },


    /**
     * 喊话遮罩
     */
    showHaoHua: function (bl) {
        if (!this.haohuaArr) return;
        this.haohuaArr.forEach(function (item) {
            item.active = bl;
        }.bind(this));
    },

});
