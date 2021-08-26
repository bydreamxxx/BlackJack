//每个麻将都要改写这个
let mjComponentValue = null;
let mjConfigValue = null;

var WxED = require("com_wx_data").WxED;
var WxEvent = require("com_wx_data").WxEvent;
var ChatEd = require('jlmj_chat_data').ChatEd;
var ChatEvent = require('jlmj_chat_data').ChatEvent;
var chat_duanyu_item = require('chat_duanyu_item');
var AppCfg = require('AppConfig');
const RecordEd = require('AudioChat').RecordEd;
const RecordEvent = require('AudioChat').RecordEvent;
var QuickMusicPath = require('jlmj_ChatCfg').QuickMusicPath;
var magicIcons = ['hua', 'feiwen', 'jidan', 'zadan', 'fanqie', 'jiubei', 'ji'];
var PlayerBaseInfoMgr = require('hall_common_data').PlayerBaseInfoMgr.getInstance();

var PlayerHead = cc.Class({
    extends: cc.Component,

    properties: {
        tx_img: cc.SpriteFrame,
    },

    ctor: function () {
        mjComponentValue = this.initMJComponet();
        mjConfigValue = this.initMJConfig();

        let _deskData = require(mjComponentValue.deskData);
        this.require_DeskData = _deskData.DeskData;

        this.open_id = 0;
        this.player = null;
        this.curr_coin = 0;
    },

    onLoad: function () {
        //头像Node
        this.head_node = cc.find('head_node', this.node);
        //金币
        this.coin = cc.find('head_node/coin', this.node).getComponent(cc.Label);
        //准备
        this.read = cc.find('head_node/read', this.node);
        //头像
        this.head = cc.find('head_node/zn_txk', this.node).getComponent(cc.Sprite);
        //庄家
        this.banker = cc.find('head_node/banker', this.node);
        //听牌
        this.tingPai = cc.find('head_node/ting', this.node);
        //潇洒
        this.xiaosaPai = cc.find('head_node/xiaosa', this.node);
        //玩家离线时显示
        this.lixianNode = cc.find('head_node/lixian', this.node);
        //出牌动画
        this.chupai_ani = cc.find('head_node/daojishiAni', this.node);
        this.headAni = cc.find('head_node/daojishiAni/spriteAni', this.node);
        this.headQuanSpr = cc.find('head_node/daojishiAni/dz_lvquan', this.node).getComponent(cc.Sprite);
        //破产图标
        this.pochanNode = cc.find('head_node/mj_pochan', this.node).getComponent(cc.Animation);
        //短语节点
        this.duanyu_node = cc.find('chat_node/duanyu_node', this.node);
        //短语箭头
        this.duanyu_arrow = cc.find('chat_node/zn_yuyinqipao_01', this.node);
        //短语文本
        this.duanyu_label = cc.find('chat_node/duanyu_node/duanyu_label', this.node).getComponent(cc.Label);
        //语音组件
        this.yuyin_laba = cc.find('chat_node/jlmj_yuyin_laba', this.node).getComponent('jlmj_yuyin_laba');
        //表情组件
        this.biaoqing = cc.find('biaoqing_node/mj_xinbiaoqing', this.node).getComponent(cc.Animation);
        //魔法道具层
        this.magic_prop_layer = cc.find('biaoqing_node/magic_layer', this.node);
        //GPS警报
        this.gps_warn = cc.find('head_node/img_gps', this.node);

        this.last_duanyu_audio_id = -1;
        this.magicIcons = [];
        cc.find('head_node/weak', this.node).active = false;  //信号状态
        this.duanyu_node.active = false;
        this.duanyu_arrow.active = false;
        this.biaoqing.node.active = false;
        this.yuyin_laba.node.active = false;
        this.chupai_ani.active = false;
        WxED.addObserver(this);
        ChatEd.addObserver(this);
        RecordEd.addObserver(this);
        cc.dd.native_gvoice_ed.addObserver(this);
    },

    onDestroy: function () {
        WxED.removeObserver(this);
        ChatEd.removeObserver(this);
        RecordEd.removeObserver(this);
        cc.dd.native_gvoice_ed.removeObserver(this);
    },

    initUI: function (player) {
        this.player = player;
        this.head.node.active = true;
        cc.log('头像UI 初始化 视觉座位号:' + player.viewIdx);
        var coin = player.coin;
        this.coin.string = cc.dd.Utils.getNumToWordTransform(coin);
        this.curr_coin = player.coin;
        if (player.headUrl.indexOf('.jpg') != -1) {
            cc.log("加载机器人头像");
            let robotUrl = require('Platform').GetRobotUrl();
            cc.dd.SysTools.loadWxheadH5(this.head, robotUrl + player.headUrl);
        }
        else {
            cc.log("加载玩家头像");
            // if(player.headUrl){
            //     cc.log("玩家头像获取成功-->"+player.headUrl);
            cc.dd.SysTools.loadWxheadH5(this.head, player.headUrl, player.sex);
            // }else{
            //     cc.log("玩家头像获取失败-->"+player.headUrl);
            //     this.head.spriteFrame = this.tx_img;
            // }
        }


        this.lixianNode.active = !player.isOnLine;

        this.read.active = player.bready == 1;
        if (!cc.dd._.isUndefined(player.isbanker) && !player.bready) {
            this.banker.active = player.isbanker;
        }
        if (!cc.dd._.isUndefined(player.isBaoTing)) {
            this.tingPai.active = player.isBaoTing;
        }
        if (!cc.dd._.isUndefined(player.isXiaosa) && this.xiaosaPai) {
            this.xiaosaPai.active = player.isXiaosa;
        }
        if (player.isBaoTing && player.isXiaosa) {
            this.tingPai.active = false;
        }
        var playerInfo = PlayerBaseInfoMgr.findPlayerInfoById(player.userId);
        if (playerInfo && playerInfo.info && playerInfo.info.vipLevel > 0) {
            cc.find('head_node/vip_head', this.node).active = true;
            cc.find('head_node/vip_head/level', this.node).getComponent(cc.Label).string = playerInfo.info.vipLevel;
        }
    },

    /**
     * 设置金币
     */
    setCoin: function (coin) {
        if (AppCfg.IS_DEBUG) {
            this.coin.string = cc.dd.Utils.getNumToWordTransform(coin);
        } else {
            this.coin.string = cc.dd.Utils.getNumToWordTransform(coin);
        }
        this.curr_coin = coin;
    },

    showPochan: function () {
        if (this.curr_coin == 0 && !this.pochanNode.node.active) {
            this.pochanNode.node.active = true;
            this.pochanNode.play('mj_pochan');
            AudioManager.playSound("" + mjConfigValue.commonPath + "/audio/mj_effect/pochan");
        }
        if (this.curr_coin > 0 && this.pochanNode.node.active) {
            this.pochanNode.node.active = false;
        }
    },
    /**
     * 获取微信头像精灵帧
     */
    getWxHeadFrame: function (openID) {
        if (cc.sys.isNative) {
            var headFilePath = jsb.fileUtils.getWritablePath() + "head_" + openID;
            var texture = cc.textureCache.addImage(headFilePath);
            if (texture) {
                return new cc.SpriteFrame(texture);
            } else {
                cc.error("无微信头像文件,openid:" + this.open_id);
            }
        }
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
        switch (event) {
            case WxEvent.DOWNLOAD_HEAD:
                cc.log('玩家头像下载完毕openid=', data[0]);
                if (data && this.player && data[0] == this.open_id) {
                    this.setHeadSp(this.getWxHeadFrame(data[0]));
                }
                break;
            case ChatEvent.CHAT:
                if (!this.player) {
                    break;
                }
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
            case RecordEvent.PLAY_RECORD:
                if (!this.player) {
                    break;
                }
                if (data.accid.toLowerCase() == (cc.dd.prefix + this.player.userId).toLowerCase()) {
                    this.play_yuyin(data.duration);
                } else {
                    cc.log("语音账号不匹配", 'accid=', data.accid.toLowerCase(), "user accid=", (cc.dd.prefix + this.player.userId).toLowerCase());

                    //cc.error("语音账号不匹配",'accid=',data.accid.toLowerCase(),"user accid=",(cc.dd.prefix + this.player.userId).toLowerCase());
                }
                break;
            case cc.dd.native_gvoice_event.PLAY_GVOICE:
                cc.log('玩家chat====2  ', event);
                if (!this.player) {
                    break;
                }
                if (data[0] == this.player.userId) {
                    this.yuyin_laba.node.active = true;
                    this.yuyin_laba.yuyin_size.node.active = false;
                }
                break;
            case cc.dd.native_gvoice_event.STOP_GVOICE:
                cc.log('玩家chat====3  ', event);
                if (!this.player) {
                    break;
                }
                if (data[0] == this.player.userId) {
                    this.yuyin_laba.node.active = false;
                    this.yuyin_laba.yuyin_size.node.active = false;
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
        // var mj_xbq = cc.find('xinbiaoqing', this.node);
        // var xinbiaoqing = mj_xbq.getComponent('mj_xinbiaoqing');
        // var sPos = this.getPlayerHeadPos(fromId);
        // var ePos = this.getPlayerHeadPos(toId);
        // xinbiaoqing.playeXinBiaoQing(idx,this.magic_prop_layer,sPos,ePos);

        let heads = cc.find("Canvas").getComponentsInChildren(mjComponentValue.playerHead);
        let magic_prop = cc.find("Canvas").getComponentInChildren("com_magic_prop");
        let from_pos = cc.v2(0, 0);
        let to_pos = cc.v2(0, 0);
        heads.forEach(function (head) {
            if (head.player && head.player.userId == fromId) {
                from_pos = magic_prop.node.convertToNodeSpace(head.node.parent.convertToWorldSpace(head.head_node.position));
            }
            if (head.player && head.player.userId == toId) {
                to_pos = magic_prop.node.convertToNodeSpace(head.node.parent.convertToWorldSpace(head.head_node.position));
            }
        });
        magic_prop.playMagicPropAni(idx, from_pos, to_pos);
    },

    createMagicPropIcon: function (idx) {
        var res_pai = cc.find('Canvas/mj_res_pai');
        if (!res_pai) {
            return null;
        }

        var atlas = res_pai.getComponent('mj_res_pai').jlmj_game_userInfo;

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
        var play_list = cc.find('Canvas/player_list').getComponent(mjComponentValue.playerList);
        if (play_list) {
            var headinfo = play_list.getUserHeadNode(userID);
            if (headinfo) {
                return headinfo.head.node.getPosition();
            } else {
                cc.error('找不到指定id的用户头像 id=', userID);
            }
        } else {
            cc.error('Canvas/player_list不存在或无挂jlmj_player_list脚本');
            return null;
        }
    },

    /**
     * 设置头像
     */
    setHeadSp: function (sp) {
        if (sp) {
            sp.width = this.head.node.width;
            sp.height = this.head.node.height;
            this.head.spriteFrame = sp
        }
    },
    /**
     * 获取头像sp
     */
    getHeadSp: function () {
        if (this.head) {
            return this.head.spriteFrame;
        }
        return null;
    },
    /**
     * 设置离线
     */
    setLX: function (islx) {
        this.lixianNode.active = islx;
        if (!islx) {
            cc.find('head_node/weak', this.node).active = false;
        }
        if (cc.find('head_node/weak', this.node).active && this.lixianNode.active) {
            cc.find('head_node/weak', this.node).active = false;
        }
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
     * 设置听牌
     */
    setTing: function (isT) {
        this.tingPai.active = isT
    },
    /**
     * 设置潇洒听
     */
    setXiaoSa: function (isT) {
        if (this.xiaosaPai) {
            this.xiaosaPai.active = isT
        }
    },
    setPoChan: function (isshow) {
        if (this.notFriend()) {
            this.pochanNode.node.active = isshow;
        }
    },

    clear: function () {
        this.setZJ(false);
        this.setTing(false);
        this.setXiaoSa(false);
        this.setPoChan(false);
        if (this.notFriend()) {
            this.head.spriteFrame = this.tx_img;
        }
        cc.find('head_node/vip_head', this.node).active = false;
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
        if (this.last_duanyu_audio_id != -1) {
            AudioManager.stopSound(this.last_duanyu_audio_id);
        }
        let sex = this.player.sex;
        let audio = QuickMusicPath + (sex ? cfg.boy_audio : cfg.girl_audio);
        this.last_duanyu_audio_id = AudioManager.playSound(audio);
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
    play_chupai_ani: function (dapaiCD) {
        var maxCD = 30;
        if (!this.require_DeskData.Instance().isFriend()) {
            maxCD = 15;
        }
        this.chupai_ani.active = true;
        this.playTimer(maxCD, null, dapaiCD);
    },

    /**
     * 停止出牌动画
     */
    stop_chupai_ani: function () {
        this.chupai_ani.active = false;
    },

    /**
     * 播放倒计时
     * @param {Number} duration  总时间s
     * @param {Function} callback  回调
     * @param {Number} curtime   当前时间s(用于重连)
     */
    playTimer: function (duration, callback, curtime) {
        if (curtime > duration) {
            curtime = duration;
        }
        this.headQuanSpr.node.color = cc.color(0, 255, 0);
        var color_t = 255 / duration;
        this.unscheduleAllCallbacks();
        var stepTime = 0.05;
        this.time = duration;
        this.remain = curtime == null ? duration : curtime;
        this.callback = callback;
        var ratio = this.remain / this.time;
        this.headQuanSpr.fillRange = ratio;
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
                var pos = this.getPos(ratio);
                this.headAni.x = pos.x;
                this.headAni.y = pos.y;

                this.headQuanSpr.node.color = cc.color(255 - this.remain * color_t, this.remain * color_t, 0);
            }
        }.bind(this), stepTime);
    },

    //计算位置
    getPos: function (value) {
        const Width = this.getHeadWidth();
        const Height = this.getHeadHeight();
        const Theta = Math.atan(Width / Height);

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

    getHeadWidth() {
        return 37.4;
    },

    getHeadHeight() {
        return 47.2;
    },

    initMJConfig() {
        return require('mjConfigValue').jlmj;
    },

    notFriend() {
        cc.log("-----------------------no implements base_mj_playerHead notFriend-----------------------")
        return false;
    },

    initMJComponet() {
        cc.log("-----------------------no implements base_mj_playerHead initMJComponet-----------------------")
        return require('mjComponentValue').base_mj;
    }
});

module.exports = PlayerHead;
