var hall_audio_mgr = require('hall_audio_mgr').Instance();
var AudioManager = require('AudioManager');
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var Define = require('Define');
var hbslData = require('hbslData').HBSL_Data;
var jlmj_prefab = require('jlmj_prefab_cfg');
const soundpath = 'gameyj_hbsl/sound/qhb_bg';

cc.Class({
    extends: cc.Component,

    properties: {
        zhuobu: { default: [], type: cc.SpriteFrame, tooltip: '桌布列表' },
        coinNode: { type: cc.Node, default: null, tooltip: "金币场时间节点" },
        friendNode: { type: cc.Node, default: null, tooltip: "朋友场时间节点" },
    },

    onLoad: function () {
        this.initZhuoBu();
        this.initMusicAndSound();
        this.initUI();
    },

    initUI: function () {
        var bl = RoomMgr.Instance().gameId == Define.GameType.HBSL_JBL;
        this.coinNode.active = !bl;
        this.friendNode.active = bl;
        this.schedule(this.switchTimeRound, 10);

        if (RoomMgr.Instance().gameId == Define.GameType.HBSL_JBL) {
            var Rule = RoomMgr.Instance()._Rule;
            if (!Rule) return;
            var detialNode = cc.find('room_info/detail', this.node);
            cc.find('room_num/lbl', detialNode).getComponent(cc.Label).string = RoomMgr.Instance().roomId.toString();
            cc.find('round_num/lbl', detialNode).getComponent(cc.Label).string = Rule.roleCount.toString();
            cc.find('layout/zhuang', detialNode).getComponent(cc.Label).string = hbslData.Instance().getZhuangStr();
            cc.find('layout/leishu', detialNode).getComponent(cc.Label).string = hbslData.Instance().getMaiLeiStr();
            cc.find('layout/lei', detialNode).getComponent(cc.Label).string = hbslData.Instance().getBeiStr();
            cc.find('layout/model', detialNode).getComponent(cc.Label).string = hbslData.Instance().getModeStr();
            cc.find('layout/baoshu', detialNode).getComponent(cc.Label).string = '最大包数 ' + Rule.maxBaonum.toString();
            cc.find('layout/pgz', detialNode).active = !Rule.isJoin;

            //======
            var friend = cc.find('friendNode/prepare/GuZe', this.node);
            if (friend) {
                var str = Rule.zhuangType == 1 ? '轮' : '局';
                cc.find('JuShu', friend).getComponent(cc.Label).string = Rule.roleCount + str;
                cc.find('WanFa1', friend).getComponent(cc.Label).string = hbslData.Instance().getZhuangStr();
                cc.find('WanFa2', friend).getComponent(cc.Label).string = hbslData.Instance().getModeStr();
                cc.find('GuZe1', friend).getComponent(cc.Label).string = '最大包数 ' + Rule.maxBaonum;
                cc.find('GuZe2', friend).active = !Rule.isJoin;
                cc.find('FangJangHao/bg/haoshu', friend).getComponent(cc.Label).string = RoomMgr.Instance().roomId.toString();
            }
        }
    },

    //切换局数和时间显示
    switchTimeRound: function () {
        var timeNode = cc.find('room_info/time', this.node);
        var roundNode = cc.find('room_info/round', this.node);
        if (timeNode.active) {
            timeNode.active = false;
            roundNode.active = true;
        }
        else {
            timeNode.active = true;
            roundNode.active = false;
        }
    },

    onshowDetall: function () {

    },

    onDestroy: function () {
        hbslData.Destroy();
    },

    onClickClose: function () {
        cc.dd.UIMgr.destroyUI(this.node);
    },

    //关闭按钮
    onCloseClick: function (event, data) {
        hall_audio_mgr.com_btn_click();
        switch (data) {
            case 'setting':
                cc.find('setting', this.node).active = false;
                break;
            case 'userinfo':
                cc.find('user_info', this.node).active = false;
                break;

        }
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
            case 'setting'://设置
                hall_audio_mgr.com_btn_click();
                cc.find('setting', this.node).active = true;
                cc.find('menu', this.node).active = false;
                this.menu_show = false;
                cc.find('topNode/room_info/menu', this.node).getComponent(cc.Button).interactable = true;
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
                cc.find('topNode/room_info/menu', this.node).getComponent(cc.Button).interactable = true;

                if (RoomMgr.Instance().gameId == Define.GameType.HBSL_JBL) {
                    var content = "";
                    var callfunc = null;
                    //已经结束
                    if (hbslData.Instance().isEnd) {
                        this.backToHall();
                        return;
                    }
                    // 已经开始
                    var selfdata = hbslData.Instance().getSelfInfoData();
                    if (hbslData.Instance().IsStart && selfdata.ready) {
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
                } else {
                    this.leave_game_req();
                }
                break;

        }
    },

    /**
     * 解散房间二次确认
     */
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
    leave_game_req: function () {
        var msg = new cc.pb.room_mgr.msg_leave_game_req();
        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType(RoomMgr.Instance().gameId);
        gameInfoPB.setRoomId(RoomMgr.Instance().roomId);
        msg.setGameInfo(gameInfoPB);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);
    },

    //返回大厅
    backToHall: function (event, data) {
        hbslData.Destroy();
        cc.dd.SceneManager.enterHall();
    },
    //==================设置界面
    initZhuoBu() {
        var idx = 0;
        var json = cc.sys.localStorage.getItem('hbsl_zhuobu_' + cc.dd.user.id);
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
                cc.sys.localStorage.setItem('hbsl_zhuobu_' + cc.dd.user.id, this.zhuobu[0]._name);
            }
        }
        else {
            cc.find('bg', this.node).getComponent(cc.Sprite).spriteFrame = this.zhuobu[0];
            cc.sys.localStorage.setItem('hbsl_zhuobu_' + cc.dd.user.id, this.zhuobu[0]._name);
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
                cc.sys.localStorage.setItem('hbsl_zhuobu_' + cc.dd.user.id, this.zhuobu[this.idxZm]._name);
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
                cc.sys.localStorage.setItem('hbsl_zhuobu_' + cc.dd.user.id, this.zhuobu[this.idxZm]._name);
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
});
