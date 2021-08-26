var chat_duanyu_item = require('chat_duanyu_item');
var py_chat_item = require('pychat');
var Define = require("Define");
var RoomMgr = require('jlmj_room_mgr').RoomMgr;

var PY_Data = require("paoyao_data").PaoYao_Data;
var AudioManager = require('AudioManager');
var py_config = require('py_config');
var pychat = require('pychat');
const manPrefix = 'gameyi_paoyao/common/sound/man/';
const womanPrefix = 'gameyi_paoyao/common/sound/woman/';

cc.Class({
    extends: cc.Component,
    properties: {
        headnode: { default: null, type: cc.Node, default: null, tooltip: "head节点" },
        headsp: { default: null, type: cc.Sprite, default: null, tooltip: "头像" },
        goldlbl: { default: null, type: cc.Label, default: null, tooltip: "金币" },
        emoji: { default: null, type: cc.Animation, tooltip: '表情组件', },
        yuyin_laba: { default: null, type: require('jlmj_yuyin_laba'), tooltip: '语音组件', },
        tuoguanNode: { default: null, type: cc.Node, default: null, tooltip: "系统托管中" },
        tuoguan: { default: null, type: cc.Node, default: null, tooltip: "头像托管图标" },
        yao_node: { type: cc.Node, default: null, tooltip: "幺牌父节点" },
        paiPre_A: { type: cc.Prefab, default: null, tooltip: "A幺牌预制" },
        paiPre_4: { type: cc.Prefab, default: null, tooltip: "4幺牌预制" },
        Double_Shun: { default: null, type: dragonBones.ArmatureDisplay, tooltip: '双顺' },
        Single_Shun: { default: null, type: dragonBones.ArmatureDisplay, tooltip: '单顺' },
        DaFried: { default: null, type: dragonBones.ArmatureDisplay, tooltip: '大爆炸' },
        ZhongFried: { default: null, type: dragonBones.ArmatureDisplay, tooltip: '中爆炸' },
        XiaoFried: { default: null, type: dragonBones.ArmatureDisplay, tooltip: '小爆炸' },
    },

    onLoad: function () {
        this.init();
    },

    init: function () {
        //短语节点
        this.duanyu_node = cc.find('chat', this.node);
        this.last_duanyu_audio_id = -1;
        this.player = null;
    },

    /**
     * 销毁
     */
    onDestroy: function () {

    },

    /**
     * 初始化玩家信息
     * @param player 玩家信息
     * @param isTurnYao 转幺
     */
    initPlayerInfo: function (player, isTurnYao) {
        cc.log('玩家进入房间')
        this.player = player;
        var roomtype = RoomMgr.Instance().gameId;
        var num = 0;
        if (roomtype == Define.GameType.PAOYAO_FRIEND) {
            num = player.score;
        } else {
            num = player.coin;
        }
        this.coin = num;
        var numstr = this.CoinchangNumToCHN(this.coin);
        this.goldlbl.string = numstr;
        this.initHead(player.openId, player.headUrl);
        if (!isTurnYao) {
            this.showUI(true);
            this.Ready(player.ready);
        }
    },

    /**
     * 绑定头像
     * openId 玩家openId
     * 头像路径
     */
    initHead: function (openId, headUrl) {
        this.openId = openId;
        // if (headUrl && headUrl != '') {
        cc.dd.SysTools.loadWxheadH5(this.headsp, headUrl);
        // }
    },
    /**
     * 显示player 节点
     * @param bool 是否显示头像
     */
    showUI: function (bool) {
        if (bool) {
            this.node.active = true;
            this.headnode.getComponent(cc.Animation).play();
        }
        else {
            this.node.active = false;
        }
    },

    /**
     * 准备
     */
    Ready: function (bl) {
        cc.find('ready', this.node).active = bl;
    },

    /**
     * 积分
     */
    Score: function (score) {
        var roomtype = RoomMgr.Instance().gameId;
        if (roomtype == Define.GameType.PAOYAO_FRIEND)
            score *= 0.1;
        var numstr = this.CoinchangNumToCHN(score);
        this.coin = score;
        this.goldlbl.string = numstr;
    },

    /**
     * 更新积分
     */
    refreshScore: function (score) {
        var roomtype = RoomMgr.Instance().gameId;
        if (roomtype == Define.GameType.PAOYAO_FRIEND)
            score *= 0.1;
        var num = parseFloat(this.coin);
        var numstr = this.CoinchangNumToCHN(num + score);
        this.goldlbl.string = numstr;
    },

    /**
     * 离线
     */
    ShowOffline: function (bl) {
        cc.find('offline', this.node).active = bl;
        cc.find('weak', this.node).active = bl;
    },

    /**
     * 红桃六
     */
    ShowRedLiu: function (bl) {
        var redliu = cc.find('card_liu', this.node);
        if (redliu)
            redliu.active = bl;
    },

    /**
     * GPS
     */
    ShowGps: function (bl) {
        var gspNode = cc.find('gps_bj', this.node);
        if (gspNode)
            gspNode.active = bl;
    },

    /**
     * 加倍
     */
    JiaBei: function (bl) {
        var jiabei = cc.find('jiabei', this.node);
        if (jiabei)
            jiabei.active = bl;
    },

    /**
     * 剩余牌的数量
     */
    RefreshRemain: function (num) {
        cc.find('remain', this.node).active = num > 0;
        cc.find('remain/lbl', this.node).getComponent(cc.Label).string = num;
    },

    /**
     * 语音
     */
    showYuYing: function (bl) {
        this.yuyin_laba.node.active = bl;
        this.yuyin_laba.yuyin_size.node.active = false;
    },

    /**
     * 出完牌的顺序
     */
    outCardIndex: function (index) {
        if (index > 0)
            cc.find('op', this.node).active = false;
        cc.find('tou', this.node).active = index == 1;
        cc.find('er', this.node).active = index == 2;
    },

    /**
     * 明幺或暗幺
     */
    showYaoNode: function (bl) {
        cc.find('yaopai', this.node).active = bl;
    },

    /**
     * 显示幺牌
     */
    showYaoCard: function (card_a, card_4) {
        for (var i = this.yao_node.childrenCount - 1; i > -1; i--) {
            var node = this.yao_node.children[i];
            if (node)
                node.destroy();
        }

        if (card_a <= 0 || card_4 <= 0)
            return;

        for (var i = 0; i < card_a; ++i) { //A
            var card = cc.instantiate(this.paiPre_A);
            this.yao_node.addChild(card);
        }
        for (var i = 0; i < card_4; ++i) { //4
            var card = cc.instantiate(this.paiPre_4);
            this.yao_node.addChild(card);
        }
    },

    /**
     * 托管
     */
    showTuoGuan: function (bl) {
        cc.find('tuoguan', this.node).active = bl;
        if (this.tuoguanNode)
            this.tuoguanNode.active = bl;
    },

    /**
     * 显示玩家信息
     */
    showUserInfo: function (event, data) {
        var jlmj_prefab = require('jlmj_prefab_cfg');
        var view = parseInt(data);
        var playerInfo = PY_Data.getInstance().getPlayerByViewID(view);
        cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_USERINFO, function (ui) {
            var user_info = ui.getComponent('user_info_view');
            user_info.setData(RoomMgr.Instance().gameId, RoomMgr.Instance().roomId, null, false, playerInfo);
            if (RoomMgr.Instance()._Rule.gps) {
                user_info.setGpsData(PY_Data.getInstance().playerInfo);
            }
            user_info.show();
        }.bind(this));
    },

    /**
     * 单顺
     * @param parent 父节点
     */
    showSingleSE: function (parent) {
        if (!this.Single_Shun || !parent)
            return;

        var playFinish = function (event) {
            if (event.detail.animationState.name === "danshun") {
                this.Single_Shun.node.active = false;
            }
            this.Single_Shun.removeEventListener(dragonBones.EventObject.COMPLETE, playFinish, this);
        }.bind(this);
        this.Single_Shun.addEventListener(dragonBones.EventObject.COMPLETE, playFinish, this);

        this.Single_Shun.node.active = true;
        this.Single_Shun.node.x = parent.x
        this.Single_Shun.node.y = parent.y;
        var boom = this.Single_Shun.getComponent(dragonBones.ArmatureDisplay);
        boom.playAnimation('danshun', 1);
    },

    /**
     * 双顺
     */
    showDoubleSE: function (parent) {
        if (!this.Double_Shun || !parent)
            return;

        var playFinish = function (event) {
            if (event.detail.animationState.name === "TTS") {
                this.Double_Shun.node.active = false;
            }
            this.Double_Shun.removeEventListener(dragonBones.EventObject.COMPLETE, playFinish, this);
        }.bind(this);
        this.Double_Shun.addEventListener(dragonBones.EventObject.COMPLETE, playFinish, this);

        this.Double_Shun.node.active = true;
        this.Double_Shun.node.x = parent.x
        this.Double_Shun.node.y = parent.y;
        var boom = this.Double_Shun.getComponent(dragonBones.ArmatureDisplay);
        boom.playAnimation('TTS', 1);
        var doubleFinish = function () {
            this.Double_Shun.node.active = false;
        }.bind(this);
        this.scheduleOnce(doubleFinish, 1);
    },

    /**
     * 中小炸弹
     * @param type （1：小类型炸弹；2：中类型炸弹）
     */
    showSmallBomb: function (parent, type) {
        if (!this.XiaoFried || !parent)
            return;
        this.XiaoFried.node.active = true;
        this.XiaoFried.node.x = parent.x
        this.XiaoFried.node.y = parent.y;
        var boom = this.XiaoFried.getComponent(dragonBones.ArmatureDisplay);
        if (type == 1)
            boom.playAnimation('xiao', 1);
        else if (type == 2)
            boom.playAnimation('zhong', 1);
    },

    /**
     * 中炸弹
     */
    showMediumBomb: function () {
        if (!this.ZhongFried) return;
        this.ZhongFried.node.active = true;
        var boom = this.ZhongFried.getComponent(dragonBones.ArmatureDisplay);
        boom.enabled = true;
        boom.playAnimation('zhongda', 1);
        this.playFinish(this.ZhongFried);
    },

    /**
     * 大炸弹
     */
    showBigBomb: function (str) {
        if (!this.DaFried) return;
        this.DaFried.node.active = true;
        var root = cc.find('Canvas/root');
        root.getComponent(cc.Animation).play('rocket_camera_' + str);
        var boom = this.DaFried.getComponent(dragonBones.ArmatureDisplay);
        boom.enabled = true;
        boom.playAnimation('dabaozha', 1);
        var callback = function () {
            this.playFinish(this.DaFried);
        }.bind(this);
        this.scheduleOnce(callback, 0.5);
    },

    /**
     * 地面碎裂动画
     */
    playFinish: function (bone) {
        if (!bone) return;
        var finish = function () {
            cc.find('dilie_zhu', bone.node.parent).getComponent(cc.Animation).off('finished', finish, bone);
            bone.enabled = false;
        }
        cc.find('dilie_zhu', bone.node.parent).getComponent(cc.Animation).on('finished', finish, bone);
        cc.find('dilie_zhu', bone.node.parent).getComponent(cc.Animation).play();
    },

    /**
     * 金币转换
     */
    CoinchangNumToCHN: function (num) {
        return cc.dd.Utils.getNumToWordTransform(num);
    },

    /**
     * 聊天，表情,魔法表情
     */
    showChat: function (data) {
        if (data.msgtype == 1) {
            this.play_duanyu(data.id, data.sendUserId);
        } else if (data.msgtype == 2) {
            this.play_biaoqing(data.id);
        } else if (data.msgtype == 3) {
            this.playMagicProp(data.id, data.sendUserId, data.toUserId);
        } else if (data.msgtype == 4)
            this.play_Haohua(data.msgId, data.id);
        return;

    },

    /**
     * 喊话
     */
    play_Haohua: function (id, userid) {
        let cfg = py_chat_item.getItem(function (itrem) {
            if (itrem.key == id) {
                return itrem;
            }
        });

        if (cfg == null) {
            cc.error("无喊话配置 id=" + id);
            return;
        }

        var sex = PY_Data.getInstance().getPlayer(userid).sex;
        var str = pychat.getItem(function (filter) {
            if (filter.key == id)
                return filter.soundName;
        });
        var path = null;
        if (sex == 1) {
            path = manPrefix + str;
        }
        else {
            path = womanPrefix + str;
        }
        AudioManager.getInstance().playSound(path, false);


        var lbl = this.duanyu_node.getChildByName('lbl');
        lbl.color = cc.color(195, 37, 0);
        lbl.getComponent(cc.Label).string = cfg.msg;
        this.duanyu_node.active = true;
        this.duanyu_node.getComponent(cc.Animation).play();
        if (this.last_duanyu_audio_id != -1) {
            AudioManager.stopSound(this.last_duanyu_audio_id);
        }
    },


    /**
     * 播放短语
     * @param id
     */
    play_duanyu: function (id, userid) {
        var cfg = null;
        if (cc.dd.user.sex == 1) {
            cfg = py_config.Man;
        }
        else {
            cfg = py_config.Woman;
        }

        var sex = PY_Data.getInstance().getPlayer(userid).sex;
        var str = py_config.CHAT[id - 1];
        var path = null;
        if (sex == 1) {
            path = manPrefix + str;
        }
        else {
            path = womanPrefix + str;
        }
        AudioManager.getInstance().playSound(path, false);

        var lbl = this.duanyu_node.getChildByName('lbl');
        lbl.color = cc.color(0, 0, 0);
        lbl.getComponent(cc.Label).string = cfg[id - 1];
        this.duanyu_node.active = true;
        this.duanyu_node.getComponent(cc.Animation).play();
        if (this.last_duanyu_audio_id != -1) {
            AudioManager.stopSound(this.last_duanyu_audio_id);
        }
    },

    /**
     * 播放表情
     */
    play_biaoqing: function (id) {
        this.emoji.node.active = true;
        this.emoji.getComponent(cc.Animation).play("em" + (id - 1));
        this.scheduleOnce(function () {
            this.emoji.node.active = false;
        }.bind(this), 3);
    },

    //播放魔法道具
    playMagicProp: function (idx, fromId, toId) {
        let heads = cc.find("Canvas").getComponentsInChildren("paoyao_headComon");
        let magic_prop = cc.find("Canvas").getComponentInChildren("com_magic_prop");
        let sPos = this.getPlayerHeadPos(fromId);
        let ePos = this.getPlayerHeadPos(toId);
        magic_prop.playMagicPropAni(idx, sPos, ePos);
    },

    getPlayerHeadPos: function (id) {
        var view = PY_Data.getInstance().idToView(id);
        var head = this.getHeadByView(view);
        var pos = head.convertToWorldSpace(cc.v2(head.width / 2, head.height / 2));
        return pos;
    },

    getHeadByView: function (view) {
        var node = null;
        let heads = cc.find("Canvas").getComponentsInChildren("paoyao_headComon");
        switch (view) {
            case 0:
                node = cc.find('head_down/mask', this.node.parent);
                break;
            case 1:
                node = cc.find('head_right', this.node.parent);
                break;
            case 2:
                node = cc.find('head_up', this.node.parent);
                break;
            case 3:
                node = cc.find('head_left', this.node.parent);
                break;
        }
        return node;
    },

    /**
     * 语音聊天
     */
    play_yuyin: function (duration) {
        this.yuyin_laba.node.active = true;
        this.yuyin_laba.setYuYinSize(duration);
        setTimeout(function () {
            this.yuyin_laba.node.active = false;
        }.bind(this), duration * 1000);
    },
});