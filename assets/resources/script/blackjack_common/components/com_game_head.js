/**
 *  通用玩家游戏头像
 *  包含以下:
 *  昵称,头像,准备,离线,金币,VIP,网络信号,gps警报
 *  短语,表情,语音,魔法道具,头像点击事件
 */
const Width = 47;
const Height = 57;
const Theta = Math.atan(Width / Height);
const StartColor = cc.color(32, 255, 32);
const EndColor = cc.color(255, 32, 32);

let GetQuickMsgCfgByID = require('jlmj_ChatCfg').GetQuickMsgCfgByID;
let QuickMusicPath = require('jlmj_ChatCfg').QuickMusicPath;
let chat_duanyu_item = require('chat_duanyu_item');
let magicIcons = ['hua', 'feiwen', 'jidan', 'zadan', 'fanqie', 'jiubei', 'ji'];

let ChatEd = require('jlmj_chat_data').ChatEd;
let ChatEvent = require('jlmj_chat_data').ChatEvent;

const RecordEd = require('AudioChat').RecordEd;
const RecordEvent = require('AudioChat').RecordEvent;

let RoomED = require("jlmj_room_mgr").RoomED;
let RoomEvent = require("jlmj_room_mgr").RoomEvent;
let RoomMgr = require("jlmj_room_mgr").RoomMgr;

let hall_audio_mgr = require('hall_audio_mgr');
let hall_common_data = require('hall_common_data').HallCommonData;

let com_game_head = cc.Class({
    extends: cc.Component,

    properties: {
        view_idx: 0,    //视觉座位号
        nickname: { default: null, type: cc.Label, tooltip: '名字', },  //名字
        head: { default: null, type: cc.Sprite, tooltip: '头像', },  //头像
        ready: { default: null, type: cc.Node, tooltip: '准备', },  //准备
        offline: { default: null, type: cc.Node, tooltip: '离线', },  //离线
        coin: { default: null, type: cc.Label, tooltip: '金币', },  //金币
        vip_node: { default: null, type: cc.Node, tooltip: 'vip节点', },  //vip节点
        vip_lv: { default: null, type: cc.Label, tooltip: 'vip级别', },  //vip级别
        net_signal: { default: null, type: cc.Node, tooltip: '网络信号', },  //网络信号
        gps_warn: { default: null, type: cc.Node, tooltip: 'GPS警报', },  //GPS警报
        tuo_guan: { default: null, type: cc.Node, tooltip: '托管', },  //托管

        duanyu_node: { default: null, type: cc.Node, tooltip: '短语节点', },  //短语节点
        duanyu_arrow: { default: null, type: cc.Node, tooltip: '短语箭头', },  //短语箭头
        duanyu_label: { default: null, type: cc.Label, tooltip: '短语文本', },  //短语文本
        last_duanyu_audio_id: null,

        biaoqing: { default: null, type: cc.Animation, tooltip: '表情组件', }, //表情
        yuyin_laba: { default: null, type: require('jlmj_yuyin_laba'), tooltip: '语音组件', }, //语音

        headQuanSpr: cc.Sprite, //绿色倒计时框
        headAni: cc.Node,       //倒计时帧动画
    },

    onLoad: function () {
        this.magicIcons = [];
        this.updateUI();
        ChatEd.addObserver(this);
        // RecordEd.addObserver(this);
        RoomED.addObserver(this);
        cc.dd.native_gvoice_ed.addObserver(this);
    },

    onDestroy: function () {
        ChatEd.removeObserver(this);
        // RecordEd.removeObserver(this);
        RoomED.removeObserver(this);
        cc.dd.native_gvoice_ed.removeObserver(this);
    },

    /**
     * 刷新整个头像
     */
    updateUI: function () {
        if (!RoomMgr.Instance().player_mgr || !RoomMgr.Instance().player_mgr.getPlayerByViewIdx) {
            this.node.active = false;
            return;
        }
        this.player = RoomMgr.Instance().player_mgr.getPlayerByViewIdx(this.view_idx);
        if (!this.player) {
            this.node.active = false;
            return;
        }
        this.node.active = true;

        //昵称
        if (this.nickname) {
            this.nickname.string = cc.dd.Utils.substr(this.player.name, 0, 4);
        }

        //头像
        this.head.node.active = true;
        if (this.player.headUrl.indexOf('.jpg') != -1) {
            let robotUrl = require('Platform').GetRobotUrl();
            cc.dd.SysTools.loadWxheadH5(this.head, robotUrl + this.player.headUrl);
        }
        else {
            //cc.log("加载玩家头像");
            if (this.player.headUrl) {
                //cc.log("玩家头像获取成功-->" + this.player.headUrl);
                cc.dd.SysTools.loadWxheadH5(this.head, this.player.headUrl);
            } else {
                //cc.log("玩家头像获取失败-->" + this.player.headUrl);
                this.head.spriteFrame = this.tx_img;
            }
        }

        //准备
        if (RoomMgr.Instance().gameStart) {
            this.ready.active = false;
        } else {
            this.ready.active = !!this.player.bready;
        }

        //离线
        this.offline.active = !this.player.isOnLine;

        //托管
        if (this.tuo_guan)
            this.tuo_guan.active = this.player.isAuto ? this.player.isAuto : false;
        //金币
        let coin = this.player.score != null ? this.player.score : this.player.coin;
        this.coin.string = cc.dd.Utils.getNumToWordTransform(coin);

        //vip
        this.vip_node.active = this.player.vipLevel > 0;
        this.vip_lv.string = this.player.vipLevel;

        var now = new Date().getTime();
        if (this._gpsTime && (now - this._gpsTime) < 5000) {
            return;
        }
        //gps
        if (this.gps_warn && RoomMgr.Instance()._Rule && RoomMgr.Instance()._Rule.gps && RoomMgr.Instance().player_mgr.getPlayerList()) {
            this._gpsTime = now;
            if (!this.player.location) {
                this.gps_warn.active = false;
                return;
            }
            var playerList = RoomMgr.Instance().player_mgr.getPlayerList();
            for (var i = 0; i < playerList.length; i++) {
                if (!playerList[i] || playerList[i].userId == this.player.userId)
                    continue;
                var player2 = playerList[i];
                if (player2 && player2.location) {
                    if (this.getDistance(this.player.location, player2.location) < 100) {
                        this.gps_warn.active = true;
                        return;
                    }
                }
            }
            this.gps_warn.active = false;
        }
    },

    /**
     * 刷新GPS警告
     */
    refreshGPS() {
        var now = new Date().getTime();
        if (this._gpsTime && (now - this._gpsTime) < 5000) {
            return;
        }
        //gps
        if (this.gps_warn && RoomMgr.Instance()._Rule && RoomMgr.Instance()._Rule.gps && RoomMgr.Instance().player_mgr.getPlayerList()) {
            this._gpsTime = now;
            if (!this.player.location) {
                this.gps_warn.active = false;
                return;
            }
            var playerList = RoomMgr.Instance().player_mgr.getPlayerList();
            for (var i = 0; i < playerList.length; i++) {
                if (!playerList[i] || playerList[i].userId == this.player.userId)
                    continue;
                var player2 = playerList[i];
                if (player2 && player2.location) {
                    if (this.getDistance(this.player.location, player2.location) < 100) {
                        this.gps_warn.active = true;
                        return;
                    }
                }
            }
            this.gps_warn.active = false;
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
    /**
     * 播放魔法道具
     * @param idx
     * @param fromId
     * @param toId
     */
    playMagicProp: function (idx, fromId, toId) {
        let heads = cc.find("Canvas").getComponentsInChildren("com_game_head");
        let magic_prop = cc.find("Canvas").getComponentInChildren("com_magic_prop");
        let magic_pos = magic_prop.node.convertToWorldSpaceAR(cc.v2(0, 0));
        let from_pos = cc.v2(0, 0);
        let to_pos = cc.v2(0, 0);
        heads.forEach(function (head) {
            if (head.player && head.player.userId == fromId) {
                from_pos = head.node.convertToWorldSpaceAR(cc.v2(0, 0)).sub(magic_pos);
            }
            if (head.player && head.player.userId == toId) {
                to_pos = head.node.convertToWorldSpaceAR(cc.v2(0, 0)).sub(magic_pos);
            }
        });
        magic_prop.playMagicPropAni(idx, from_pos, to_pos);
    },

    /**
     * 播放短语
     * @param id
     */
    play_duanyu: function (id) {
        let cfg = chat_duanyu_item.getItem(function (itrem) {
            if (itrem.duanyu_id == id) {
                return itrem;
            }
        });

        if (cfg == null) {
            cc.error("无短语配置 id=" + id);
            return;
        }
        this.duanyu_node.active = true;
        this.duanyu_arrow.active = true;
        this.duanyu_label.string = cfg.text;
        if (this.last_duanyu_audio_id != null) {
            AudioManager.stopSound(AudioManager.getAudioID(this.last_duanyu_audio_id));
        }
        let sex = this.player.sex;
        let audio = QuickMusicPath + (sex == 1 ? cfg.boy_audio : cfg.girl_audio);
        this.last_duanyu_audio_id = audio;
        AudioManager.playSound(audio);
        setTimeout(function () {
            this.duanyu_node.active = false;
            this.duanyu_arrow.active = false;
        }.bind(this), cfg.duration * 1000);
    },

    /**
     * 播放表情
     * @param id
     */
    play_biaoqing: function (id) {
        this.biaoqing.node.active = true;
        this.biaoqing.play("em" + (id - 1));
        setTimeout(function () {
            this.biaoqing.node.active = false;
        }.bind(this), 3 * 1000);
    },

    /**
     * 是否正在聊天
     */
    isChating: function () {
        return this.biaoqing.node.active || this.duanyu_node.active;
    },

    /**
     * 播放语音
     * @param duration
     */
    play_yuyin: function (duration) {
        this.yuyin_laba.node.active = true;
        this.yuyin_laba.setYuYinSize(duration);
        setTimeout(function () {
            this.yuyin_laba.node.active = false;
        }.bind(this), duration * 1000);
    },

    /**
     * 头像点击回调
     */
    onClickHead: function () {
        if (!this.node.active) {
            return;
        }
        hall_audio_mgr.Instance().com_btn_click();

        this.player = RoomMgr.Instance().player_mgr.getPlayerByViewIdx(this.view_idx);
        if (!this.player) {
            this.node.active = false;
            return;
        }
        cc.dd.UIMgr.openUI("blackjack_common/prefab/user_info", function (node) {
            let ui = node.getComponent('user_info_view');
            ui.updateUI(this.player);
        }.bind(this));
    },

    /**
     * 播放倒计时
     * @param {Number} duration  总时间s
     * @param {Function} callback  回调
     * @param {Number} curtime   当前时间s(用于重连)
     */
    playTimer(duration, callback, curtime) {
        if (curtime > duration) {
            curtime = duration;
        }
        this.unscheduleAllCallbacks();
        var stepTime = 0.05;
        this.time = duration;
        this.remain = curtime == null ? duration : curtime;
        this.callback = callback;
        var ratio = this.remain / this.time;
        this.headQuanSpr.fillRange = ratio;
        this.headQuanSpr.node.color = cc.color(cc.misc.lerp(EndColor.r, StartColor.r, ratio), cc.misc.lerp(EndColor.g, StartColor.g, ratio), cc.misc.lerp(EndColor.b, StartColor.b, ratio));
        var p = this.getPos(ratio);
        this.headAni.x = p.x;
        this.headAni.y = p.y;
        this.headAni.getComponent(cc.Animation).play();
        this.headAni.parent.active = true;
        this.schedule(function () {
            this.remain -= stepTime;
            if (this.remain <= 0) {
                this.headAni.getComponent(cc.Animation).stop();
                this.headAni.parent.active = false;
                this.unscheduleAllCallbacks();
                if (this.callback) {
                    this.callback();
                }
            }
            else {
                var ratio = this.remain / this.time;
                this.headQuanSpr.fillRange = ratio;
                this.headQuanSpr.node.color = cc.color(cc.misc.lerp(EndColor.r, StartColor.r, ratio), cc.misc.lerp(EndColor.g, StartColor.g, ratio), cc.misc.lerp(EndColor.b, StartColor.b, ratio));
                var pos = this.getPos(ratio);
                this.headAni.x = pos.x;
                this.headAni.y = pos.y;
            }
        }, stepTime);
    },

    playTimerLoop(duration) {
        this.unscheduleAllCallbacks();
        var stepTime = 0.05;
        this.time = duration;
        this.remain = duration;
        //this.callback = callback;
        var ratio = this.remain / this.time;
        this.headQuanSpr.fillRange = ratio;
        this.headQuanSpr.node.color = cc.color(cc.misc.lerp(EndColor.r, StartColor.r, ratio), cc.misc.lerp(EndColor.g, StartColor.g, ratio), cc.misc.lerp(EndColor.b, StartColor.b, ratio));
        var p = this.getPos(ratio);
        this.headAni.x = p.x;
        this.headAni.y = p.y;
        this.headAni.getComponent(cc.Animation).play();
        this.headAni.parent.active = true;
        this.schedule(function () {
            this.remain -= stepTime;
            if (this.remain < 0) {
                this.remain = this.time;
            }
            var ratio = this.remain / this.time;
            this.headQuanSpr.fillRange = ratio;
            this.headQuanSpr.node.color = cc.color(cc.misc.lerp(EndColor.r, StartColor.r, ratio), cc.misc.lerp(EndColor.g, StartColor.g, ratio), cc.misc.lerp(EndColor.b, StartColor.b, ratio));
            var pos = this.getPos(ratio);
            this.headAni.x = pos.x;
            this.headAni.y = pos.y;
        }, stepTime);
    },

    //停止倒计时
    stopTimer: function () {
        this.unscheduleAllCallbacks();
        this.headAni.getComponent(cc.Animation).stop();
        this.headAni.parent.active = false;
    },

    //计算位置
    getPos(value) {
        value = value < 0 ? 0 : (value > 1 ? 1 : value);
        value = 1 - value;
        var ang = 2 * Math.PI * value;
        var x = NaN, y = NaN;
        if (ang < Theta || ang >= 2 * Math.PI - Theta) {
            y = Height;
        }
        else if (ang < Math.PI - Theta) {
            x = Width;
        }
        else if (ang < Math.PI + Theta) {
            y = -Height;
        }
        else if (ang < 2 * Math.PI - Theta) {
            x = -Width;
        }

        if (ang < Theta) {
            x = Height * Math.tan(ang);
        }
        else if (ang < Math.PI / 2) {
            y = Width * Math.tan(Math.PI / 2 - ang);
        }
        else if (ang < Math.PI - Theta) {
            y = -Width * Math.tan(ang - Math.PI / 2);
        }
        else if (ang < Math.PI) {
            x = Height * Math.tan(Math.PI - ang);
        }
        else if (ang < Math.PI + Theta) {
            x = -Height * Math.tan(ang - Math.PI);
        }
        else if (ang < Math.PI * 3 / 2) {
            y = -Width * Math.tan(Math.PI * 3 / 2 - ang);
        }
        else if (ang < Math.PI * 2 - Theta) {
            y = Width * Math.tan(ang - Math.PI * 3 / 2);
        }
        else {
            x = -Height * Math.tan(Math.PI * 2 - ang);
        }
        return cc.v2(x, y);
    },

    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage: function (event, data) {
        if (cc.replay_gamedata_scrolling) {
            return;
        }
        if (!RoomMgr.Instance().player_mgr || !RoomMgr.Instance().player_mgr.getPlayerByViewIdx) {
            this.node.active = false;
            return;
        }
        this.player = RoomMgr.Instance().player_mgr.getPlayerByViewIdx(this.view_idx);
        if (!this.player) {
            this.node.active = false;
            return;
        }
        switch (event) {
            //短语 表情
            case ChatEvent.CHAT:
                if (data.sendUserId == this.player.userId) {
                    if (data.msgtype == 1) {
                        this.play_duanyu(data.id);
                    } else if (data.msgtype == 2) {
                        this.play_biaoqing(data.id);
                    }
                } else if (data.toUserId == this.player.userId && data.msgtype == 3) {
                    this.playMagicProp(data.id, data.sendUserId, data.toUserId);
                }
                break;
            //语音
            // case RecordEvent.PLAY_RECORD:
            //     if (data.accid.toLowerCase() == (cc.dd.prefix + this.player.userId).toLowerCase()) {
            //         this.play_yuyin(data.duration);
            //     } else {
            //         cc.error("语音账号不匹配", 'accid=', data.accid.toLowerCase(), "user accid=", (cc.dd.prefix + this.player.userId).toLowerCase());
            //     }
            //     break;
            //GVoice 语音
            case cc.dd.native_gvoice_event.PLAY_GVOICE:
                if (!this.player) {
                    break;
                }
                if (data[0] == this.player.userId) {
                    this.yuyin_laba.node.active = true;
                    this.yuyin_laba.yuyin_size.node.active = false;
                }
                break;
            case cc.dd.native_gvoice_event.STOP_GVOICE:
                if (!this.player) {
                    break;
                }
                if (data[0] == this.player.userId) {
                    this.yuyin_laba.node.active = false;
                    this.yuyin_laba.yuyin_size.node.active = false;
                }
                break;
            //头像
            case RoomEvent.on_room_create:
            case RoomEvent.on_room_enter:
            case RoomEvent.on_room_join:
            case RoomEvent.on_room_leave:
            case RoomEvent.on_room_ready:
            case RoomEvent.on_room_replace:
            case RoomEvent.on_room_player_online:
            case RoomEvent.on_room_game_start:
                this.updateUI();
                break;
            case RoomEvent.update_player_location: {
                if (this.player && data[0] && this.player.userId == data[0].userId) {
                    this.player.ip = data[0].ip;
                    this.player.address = data[0].address;
                    this.player.location = data[0].latlngInfo;
                }
                this.refreshGPS();
                break;
            }

            case RoomEvent.player_signal_state:
                let msg = data[0];
                let userId = msg.userId;
                let isWeak = msg.isWeak;
                if (userId == this.player.userId) {
                    this.net_signal.active = isWeak;
                }
                if (msg.cnt == 4) {
                    this.offline.active = false;
                }
                break;
            default:
                break;
        }
    },
});

module.exports = com_game_head;
