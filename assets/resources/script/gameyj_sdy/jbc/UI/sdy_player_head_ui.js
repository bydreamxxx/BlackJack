var WxED = require("com_wx_data").WxED;
var WxEvent = require("com_wx_data").WxEvent;
var WxData = require("com_wx_data").WxData.Instance();
var ChatEd = require('jlmj_chat_data').ChatEd;
var ChatEvent = require('jlmj_chat_data').ChatEvent;
var GetQuickMsgCfgByID = require('jlmj_ChatCfg').GetQuickMsgCfgByID;
var AppCfg = require('AppConfig');
const RecordEd = require('AudioChat').RecordEd;
const RecordEvent = require('AudioChat').RecordEvent;
var PropAudioCfg = require('jlmj_ChatCfg').PropAudioCfg;
var QuickMusicPath = require('jlmj_ChatCfg').QuickMusicPath;
var magicIcons = ['hua', 'feiwen', 'jidan', 'zadan', 'fanqie', 'jiubei', 'ji'];
var audio = require('sdy_audio');
var RoomData = require('sdy_room_data').RoomData;

var PlayerHead = cc.Class({
    extends: cc.Component,

    properties: {
        coin: { default: null, type: cc.Label, tooltip: '金币', },  //金币
        read: { default: null, type: cc.Node, tooltip: '准备', },  //准备
        head: { default: null, type: cc.Sprite, tooltip: '头像', },  //头像
        nickname: { default: null, type: cc.Label, tooltip: '名字', },  //名字
        banker: { default: null, type: cc.Node, tooltip: '庄家', },  //庄家
        lixianNode: cc.Node,//玩家离线时显示
        chupai_ani: { default: null, type: cc.Node, tooltip: '出牌动画' },

        duanyu_node: { default: null, type: cc.Node, tooltip: '短语节点', },  //短语节点
        duanyu_arrow: { default: null, type: cc.Node, tooltip: '短语箭头', },  //短语箭头
        duanyu_label: { default: null, type: cc.Label, tooltip: '短语文本', },  //短语文本
        last_duanyu_audio_id: -1,

        biaoqing: { default: null, type: cc.Animation, tooltip: '表情组件', }, //表情
        yuyin_laba: { default: null, type: require('jlmj_yuyin_laba'), tooltip: '语音组件', }, //语音

        magic_prop_layer: { default: null, type: cc.Node, tooltip: '魔法道具层', },  //魔法道具层
        magic_prop: { default: null, type: cc.Animation, tooltip: '魔法道具', },  //魔法道具

        timeout_ani: cc.ProgressBar,
    },

    ctor: function () {
        this.data = null;
    },

    onLoad: function () {
        this.magicIcons = [];
        this.magic_prop.node.active = false;
        this.duanyu_node.active = false;
        // this.duanyu_arrow.active = false;
        this.biaoqing.node.active = false;
        this.yuyin_laba.node.active = false;
        this.timeout_ani.node.active = false;
        this.lixianNode.active = false;
        this.read.active = false;
        WxED.addObserver(this);
        ChatEd.addObserver(this);
        RecordEd.addObserver(this);
    },

    onDestroy: function () {
        WxED.removeObserver(this);
        ChatEd.removeObserver(this);
        RecordEd.removeObserver(this);
    },

    setData: function (data) {
        if (data == null) {
            cc.log('无player数据,不显示头像相关ui');
            this.node.active = false;
            return;
        }
        this.node.active = true;

        if (AppCfg.IS_DEBUG) {
            this.coin.string = data.coin;
        } else {
            this.coin.string = data.coin;
        }

        if (this.nickname) {
            this.nickname.string = cc.dd.Utils.substr(data.name, 0, 5);
        }

        this.data = data;
        //设置头像sp
        var str = 'gameyj_mj_jilin/py/textures/zhuonei/hd_female.png';
        if (data.sex == 1) {//男人
            str = 'gameyj_mj_jilin/py/textures/zhuonei/hd_male.png';
        }
        if (data.head_url != null && data.head_url != "") {
            cc.dd.SysTools.loadWxheadH5(this.head, data.head_url);
        } else {
            this.head.spriteFrame = new cc.SpriteFrame(str);
        }

        this.banker.active = data.banker;

        if (RoomData.Instance().game_started) {
            this.setReady(false);
        } else {
            this.setReady(data.ready);
        }

    },

    /**
     * 设置金币
     */
    setCoin: function (coin) {
        this.data.coin = coin;
        if (AppCfg.IS_DEBUG) {
            this.coin.string = coin;
        } else {
            this.coin.string = coin;
        }
    },

    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage: function (event, data) {
        switch (event) {
            case ChatEvent.CHAT:
                if (data.sendUserId == this.data.user_id) {
                    if (data.msgtype == 1) {
                        this.play_duanyu(data.id);
                    } else if (data.msgtype == 2) {
                        this.play_biaoqing(data.id);
                    }
                } else if (data.toUserId == this.data.user_id && data.msgtype == 3) {
                    this.playMagicProp(data.id, data.sendUserId, data.toUserId);
                }
                break;
            case RecordEvent.PLAY_RECORD:
                if (data.accid.toLowerCase() == (cc.dd.prefix + this.data.user_id).toLowerCase()) {
                    this.play_yuyin(data.duration);
                } else {
                    cc.error("语音账号不匹配", 'accid=', data.accid.toLowerCase(), "user accid=", (cc.dd.prefix + this.data.user_id).toLowerCase());
                }
                break;
            default:
                break;
        }
    },

    /**
     * 播放魔法道具
     * @param idx
     * @param fromId
     * @param toId
     */
    playMagicProp: function (idx, fromId, toId) {
        var magicIcon = this.createMagicPropIcon(idx);
        var startPos = this.getPlayerHeadPos(fromId);
        var endPos = this.getPlayerHeadPos(toId);
        magicIcon.setPosition(startPos);
        var moveTo = cc.moveTo(1.0, endPos);
        magicIcon.runAction(cc.sequence(
            moveTo
            , cc.callFunc(function () {
                this.playPropEffect(idx, magicIcon);
            }.bind(this))
        ));
    },

    playPropEffect: function (idx, magicIcon) {
        //todo:后续加载对象池
        magicIcon.destroy();
        var magic_prop_ani_node = cc.instantiate(this.magic_prop.node);
        var magic_prop_ani = magic_prop_ani_node.getComponent(cc.Animation);
        magic_prop_ani.node.active = true;
        magic_prop_ani.node.parent = this.node;
        magic_prop_ani.play('magic_prop_' + idx);
        magic_prop_ani.on('finished', function () {
            magic_prop_ani.node.destroy();
        });
        AudioManager.playSound(PropAudioCfg[idx]);
    },

    createMagicPropIcon: function (idx) {
        var atlas = cc.resources.get('gameyj_mj_jilin/py/atlas/jlmj_game_userInfo', cc.SpriteAtlas);
        var magicIcon = new cc.Node("magicIcon");
        var sprite = magicIcon.addComponent(cc.Sprite);
        sprite.spriteFrame = atlas.getSpriteFrame(magicIcons[idx]);
        magicIcon.parent = this.magic_prop_layer;
        // this.magicIcons.push(magicIcon);
        return magicIcon;
    },

    /**
     * 获取玩家head
     */
    getPlayerHeadPos: function (userID) {
        var play_list = cc.find('Canvas/sdy_player_list').getComponent('sdy_player_list_ui');
        if (play_list) {
            var headinfo = play_list.getUserHeadNode(userID);
            if (headinfo) {
                return headinfo.head.node.getPosition();
            } else {
                cc.error('找不到指定id的用户头像 id=', userID);
            }
        } else {
            cc.error('Canvas/sdy_player_list 无挂sdy_player_list_ui脚本');
            return null;
        }
    },

    /**
     * 设置离线
     */
    setLX: function (islx) {
        this.lixianNode.active = islx;
    },

    /**
     * 设置准备
     */
    setReady: function (isready) {
        this.read.active = isready;
    },

    /**
     * 设置庄家
     */
    setZJ: function (iszj) {
        this.banker.active = iszj;
    },

    /**
     * 播放短语
     * @param id
     */
    play_duanyu: function (id) {
        var cfg = GetQuickMsgCfgByID(id);
        if (cfg == null) {
            cc.error("无短语配置 id=" + id);
            return;
        }
        this.duanyu_node.active = true;
        // this.duanyu_arrow.active = true;
        this.duanyu_label.string = cfg.text;
        if (this.last_duanyu_audio_id != -1) {
            AudioManager.stopSound(this.last_duanyu_audio_id);
        }
        this.last_duanyu_audio_id = AudioManager.playSound(QuickMusicPath + cfg.audio);
        setTimeout(function () {
            this.duanyu_node.active = false;
            // this.duanyu_arrow.active = false;
        }.bind(this), cfg.duration * 1000);
    },

    /**
     * 播放表情
     * @param id
     */
    play_biaoqing: function (id) {
        this.biaoqing.node.active = true;
        this.biaoqing.play("emotion_" + id);
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

    play_yuyin: function (duration) {
        this.yuyin_laba.node.active = true;
        this.yuyin_laba.setYuYinSize(duration);
        setTimeout(function () {
            this.yuyin_laba.node.active = false;
        }.bind(this), duration * 1000);
    },

    /**
     * 播放出牌动画
     */
    play_chupai_ani: function () {
        this.chupai_ani.active = true;
    },

    /**
     * 停止出牌动画
     */
    stop_chupai_ani: function () {
        this.chupai_ani.active = false;
    },

    /**
     * 做庄
     */
    becomeBanker: function () {
        this.banker.active = true;
    },

    onClickHead: function () {
        audio.com_btn_click();
        cc.dd.UIMgr.openUI('gameyj_sdy/jbc/prefab/sdy_user_info', function (node) {
            var sdy_user_info = node.getComponent('sdy_user_info_ui');
            if (sdy_user_info) {
                sdy_user_info.setData(this.data);
            }
        }.bind(this));
    },
});

module.exports = PlayerHead;
