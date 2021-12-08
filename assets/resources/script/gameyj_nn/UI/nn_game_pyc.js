var nn_mgr = require('nn_mgr');
var nn_data = require('nn_data');
var nn_send_msg = require('douniu_send_msg');
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var AudioManager = require('AudioManager');
var nn_audio_cfg = require('nn_audio_cfg');
var jlmj_ChatCfg = require('jlmj_ChatCfg');
var jlmj_prefab = require('jlmj_prefab_cfg');
var RoomED = require("jlmj_room_mgr").RoomED;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;
var ChatEd = require('jlmj_chat_data').ChatEd;
var ChatEvent = require('jlmj_chat_data').ChatEvent;
var HallCommonObj = require('hall_common_data');
var HallCommonEd = HallCommonObj.HallCommonEd;
var HallCommonEvent = HallCommonObj.HallCommonEvent;
var Platform = require('Platform');
var AppCfg = require('AppConfig');

const dissolveUI = 'gameyj_nn/prefab/nn_dissolve';
const scoreTypeStr = ['', '2000', '3000', '不限'];

const Remain_Timer = {
    Ready: 10,          //准备
    Bank: 5,           //抢庄
    Bet: 6,             //加倍
    Group: 9,          //组牌
    Result: 8,          //结算
    Dissolve: 30,       //解散
};
cc.Class({
    extends: cc.Component,

    properties: {
        playerUI: { type: require('nn_player_ui'), default: [], tooltip: '玩家ui' },
        bankSpList: { type: cc.SpriteFrame, default: [], tooltip: '抢庄图集' },
        betSpList: { type: cc.SpriteFrame, default: [], tooltip: '加倍图集' },
        typeSpList: { type: cc.SpriteFrame, default: [], tooltip: '牌型图集' },
        zhuobu_splist: { type: cc.SpriteFrame, default: [], tooltip: '桌布列表' },
        pokerAtlas: { type: cc.SpriteAtlas, default: null, tooltip: '牌图集' },
        timer_node: { type: cc.Node, default: null, tooltip: '倒计时节点' },
        win_font: { type: cc.Font, default: null, tooltip: '胜利字体' },
        lose_font: { type: cc.Font, default: null, tooltip: '失败字体' },
        chat_item: { type: cc.Prefab, default: null, tooltip: '聊天' },
        coin_prefab: { type: cc.Prefab, default: null, tooltip: '金币预制' },
        music_Node: { default: null, type: cc.Node, tooltip: '音乐' },
        sound_Node: { default: null, type: cc.Node, tooltip: '音效' },
        music_Slider: { default: null, type: cc.Slider, tooltip: '音乐滑动条' },
        sound_Slider: { default: null, type: cc.Slider, tooltip: '音效滑动条' },
    },

    // LIFE-CYCLE CALLBACKS:

    setClubAudioCfg() {
        nn_audio_cfg = require('nn_audio_cfg_jlb');
    },

    onLoad() {
        this.btn_invite = cc.find('layout_ready_invite/btn_invite', this.node).getComponent(cc.Button);
        this.btn_friend_invite = cc.find('klb_friend_group_invite_btn', this.node);
        this.btn_jixu = cc.find('layout_ready_invite/btn_jixu', this.node).getComponent(cc.Button);
        this.btn_menu = cc.find('btns/menu', this.node).getComponent(cc.Button);
        this.btn_ready = cc.find('layout_ready_invite/btn_ready', this.node).getComponent(cc.Button);
        this.btn_start = cc.find('layout_ready_invite/btn_start', this.node).getComponent(cc.Button);
        this.room_num = cc.find('room_info/room/room_num', this.node).getComponent(cc.Label);
        this.cur_ju = cc.find('room_info/round/cur_round', this.node).getComponent(cc.Label);
        this.zong_ju = cc.find('room_info/round/room_num', this.node).getComponent(cc.Label);
        this.node_guize = cc.find('guize', this.node);
        this.node_menu = cc.find('menu', this.node);
        this.node_setting = cc.find('setting', this.node);

        this.initMusicAndSound();
        this.initReadyInviteBtn();
        this.initRoomInfo();
        this.initZhuoBu();

        if (!RoomMgr.Instance().isClubRoom())
            this.btn_friend_invite.active = false;
        this.schedule(this.sendLocationInfo, 30);//发送位置信息

        RoomED.addObserver(this);
        HallCommonEd.addObserver(this);
    },

    start() {
        nn_mgr.Instance().setGameUI(this);
        this.initMaxBet();
    },

    onDestroy() {
        cc._pauseLMAni = false;
        nn_mgr.Instance().setGameUI(null);
        RoomED.removeObserver(this);
        HallCommonEd.removeObserver(this);
        nn_data.Destroy();
        RoomMgr.Instance().clear();
        AudioManager.getInstance().stopMusic();
        AudioManager.getInstance().stopAllLoopSound();
        if (this.coinPool) {
            this.coinPool.clear();
        }
    },

    update(dt) {
        // if (this._time) {
        //     this._time -= dt;
        //     if (this._time < 0) {
        //         this._time = 0;
        //     }
        //     this.timer_node.getChildByName('lbl').getComponent(cc.Label).string = parseInt(this._time).toString();
        // }
        if (this.scanPokerWait) {
            if (!this.sendPokering) {
                this.scanPoker(this.scanPokerMsg);
                this.scanPokerWait = false;
                this.scanPokerMsg = null;
            }
        }
    },

    //更新经纬度
    sendLocationInfo() {
        var pbData = new cc.pb.room_mgr.msg_player_location_req();
        if (cc.sys.isNative) {
            if (cc.sys.OS_ANDROID == cc.sys.os) {
                var loc = new cc.pb.room_mgr.latlng();
                var latitude = jsb.reflection.callStaticMethod("game/SystemTool", "getLatitude", "()F");
                var longitude = jsb.reflection.callStaticMethod("game/SystemTool", "getLongitude", "()F");
                var adress;
                if (typeof (latitude) != 'undefined' && typeof (longitude) != 'undefined')
                    adress = jsb.reflection.callStaticMethod('game/SystemTool', "getAdress", "()Ljava/lang/String;");
                loc.setLatitude(latitude);
                loc.setLongitude(longitude);
                cc.log("详细地址：经度 " + longitude);
                cc.log("详细地址：纬度 " + latitude);
                if (parseInt(latitude) != 0 || parseInt(longitude) != 0) {
                    pbData.setLatlngInfo(loc);
                }
                pbData.setAddress(adress);
            } else if (cc.sys.OS_IOS == cc.sys.os) {
                var loc = new cc.pb.room_mgr.latlng();
                var Latitude = jsb.reflection.callStaticMethod('SystemTool', 'getLatitude');
                var Longitude = jsb.reflection.callStaticMethod('SystemTool', 'getLongitude');
                var adress = jsb.reflection.callStaticMethod('SystemTool', "getAdress");
                loc.setLatitude(Latitude);
                loc.setLongitude(Longitude);
                cc.log("详细地址：经度 " + Longitude);
                cc.log("详细地址：纬度 " + Latitude);
                if (parseInt(latitude) != 0 || parseInt(longitude) != 0) {
                    pbData.setLatlngInfo(loc);
                }
                pbData.setAddress(adress);
            }
        }
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_player_location_req, pbData, 'msg_player_location_req', true);
    },

    //返回大厅
    backToHall(event, data) {
        cc.dd.SceneManager.enterHall();
    },

    //抢庄完成
    bankComp(bankerId) {
        var view = this.getView(bankerId);
        // var banklist = nn_data.Instance().getRandomBankList();
        // if (banklist.length > 1) {
        //     this._randomBanking = true;
        //     var showSeq = [];
        //     var lastIdx = -1;
        //     const totalTime = banklist.length * 0.5;//随机庄动画总时长
        //     const maxNum = 3 * banklist.length + Math.floor(Math.random() * 3);// 次数
        //     while (showSeq.length < maxNum) {
        //         var idx = Math.floor(Math.random() * banklist.length);
        //         if (idx == lastIdx)
        //             continue;
        //         lastIdx = idx;
        //         showSeq.push(banklist[idx]);
        //     };
        //     var func = function (target, custom) {
        //         var userId = custom[0];
        //         var active = custom[1];
        //         var view = this.getView(userId);
        //         cc.find('dss_tx_02', this.playerUI[view].node.parent).active = active;
        //         AudioManager.getInstance().playSound(nn_audio_cfg.COMMON.RANDOM_BANKER, false);
        //     }
        //     if (banklist[lastIdx] != bankerId) {
        //         showSeq.push(bankerId);
        //     }
        //     var duration = totalTime / showSeq.length;
        //     var seqList = [];
        //     for (var i = 0; i < showSeq.length; i++) {
        //         var show = cc.callFunc(func, this, [showSeq[i], true]);
        //         var delay = cc.delayTime(duration);
        //         var hide = cc.callFunc(func, this, [showSeq[i], false]);
        //         if (i == showSeq.length - 1)
        //             seqList.push(show);
        //         else
        //             seqList.push(show, delay, hide);
        //     }
        //     var finish = function () {
        //         this._randomBanking = false;
        //         this.clearBankUI();
        //         this.playerUI[view].bankComp();
        //         AudioManager.getInstance().playSound(nn_audio_cfg.COMMON.BANKER, false);
        //         if (!nn_data.Instance().getPlayerById(cc.dd.user.id).isBanker)
        //             this.playerUI[0].showOp(1);
        //     }
        //     seqList.push(cc.callFunc(finish, this, null));
        //     seqList.push(cc.delayTime(1), cc.callFunc(func, this, [showSeq[showSeq.length - 1], false]))
        //     this.node.runAction(cc.sequence(seqList));
        // }
        // else {
        var playerList = nn_data.Instance().getPlayerList();
        playerList.forEach(player => {
            if (player)
                player.isWinner = false;
        });
        this.clearBankUI();
        this.playerUI[0].showOp(-1);
        this.playerUI[view].bankComp(view);
        AudioManager.getInstance().playSound(nn_audio_cfg.COMMON.BANKER, false);
        //}
    },

    //清除抢庄
    clearBankUI() {
        this.playerUI.forEach((scp, idx) => {
            scp.node.parent.getChildByName('winner').active = false;
            var player = nn_data.Instance().getPlayerByViewIdx(idx);
            if (player && !player.isBanker) {
                scp.bankRet(null, null, true);
            }
        });
    },

    //清除加倍
    clearBetUI() {
        this.playerUI.forEach(scp => {
            //scp.betRet(null, null);
        });
    },

    //清除倒计时
    clearTimer() {
        this._time = 0;
        this.timer_node.getComponent(cc.Sprite).unscheduleAllCallbacks();
        this.timer_node.active = false;
        if (this._timerSound) {
            AudioManager.getInstance().stopSound(AudioManager.getInstance().getAudioID(this._timerSound));
            this._timerSound = null;
        }
    },

    /**
     * 确定解散
     */
    dissolveEnsure() {
        this.dissolveReq(true);
    },

    dissolveCancel() {
        this.dissolveReq(false);
    },

    /**
     * 是否同意
     * @param {Boolean} isAgree 
     */
    dissolveReq(isAgree) {
        nn_send_msg.dissolve(isAgree);
    },

    /** 
     * 游戏开始
    */
    gameStart() {
        this.btn_invite.node.parent.active = false;
        this.btn_friend_invite.active = false;
        this.room_num.node.parent.active = false;
    },

    /**
     * 获取抢庄图片
     * @param {Number} bet 
     */
    getBankSpriteFrame(bet) {
        const indexlist = [0, 1, 2, 3, 4];
        var idx = indexlist.indexOf(bet);
        if (idx == -1) {
            return null;
        }
        return this.bankSpList[idx];
    },

    /**
     * 获取倍率图片
     * @param {Number} bet 
     */
    getBetSpriteFrame(bet) {
        const indexlist = [1, 2, 3, 4, 5, 6, 9, 8];
        var idx = indexlist.indexOf(bet);
        if (idx == -1) {
            return null;
        }
        return this.betSpList[idx];
    },

    getCoin() {
        if (!this.coinPool) {
            this.coinPool = new cc.NodePool();
        }
        var node = this.coinPool.get();
        if (!node) {
            node = cc.instantiate(this.coin_prefab);
            node.name = 'coin_' + (this._coincount ? ++this._coincount : (this._coincount = 1));
        }
        cc.find('coin_node', this.node).addChild(node);
        return node;
    },

    /**
     * 规则字符串
     */
    getRuleString() {
        var str = '';
        var rules = RoomMgr.Instance()._Rule;
        str += '共' + rules.circleNum + '局';
        //str += '  初始分:' + (scoreTypeStr[rules.scoreType]);
        if (rules.gameType == 1) {
            str += '  抢庄';
        }
        else if (rules.gameType == 2) {
            str += '  通比';
        }
        else if (rules.gameType == 3) {
            str += '  房主庄';
        }
        else if (rules.gameType == 4) {
            str += '  牛牛庄';
        }
        // else {
        //     str += '  霸王庄';
        // }
        if (rules.showType == 1) {
            str += '  扣一张';
        }
        else {
            str += '  全扣';
        }
        if (rules.cardTypeThree == 1) {
            str += ' 三条';
        }
        if (rules.cardTypeStraight == 1) {
            str += ' 顺子';
        }
        if (rules.cardTypeFlush == 1) {
            str += ' 同花';
        }
        if (rules.cardTypeFullHouse == 1) {
            str += ' 葫芦';
        }
        if (rules.cardTypeFive == 1) {
            str += ' 五小牛';
        }
        if (rules.cardTypeFlushStraight == 1) {
            str += ' 同花顺';
        }
        if (rules.limitWords == true) {
            str += '  禁言';
        }
        if (rules.limitTalk == true) {
            str += '  禁止语音';
        }
        if (rules.gps == true) {
            str += '  GPS测距';
        }
        return str;
    },

    /**
     * 获取视觉座位号
     * @param {Number} userId 
     */
    getView(userId) {
        return nn_data.Instance().getViewById(userId);
    },

    //初始化抢庄加倍按钮
    initMaxBet() {
        var maxBank = RoomMgr.Instance()._Rule.maxGrub;
        var maxBet = RoomMgr.Instance()._Rule.maxBet;
        var opbank = this.playerUI[0].op_list[0].getChildByName('btns');
        for (var i = 0; i < opbank.children.length; i++) {
            opbank.children[i].active = (i <= maxBank);
        }
        //TODO：换加倍按钮图片
        var opbet = this.playerUI[0].op_list[1];
        for (var i = 0; i < 3; i++) {
            opbet.children[i].getChildByName('font').getComponent(cc.Label).string = maxBet / 3 * (i + 1) + ' 倍';
        }
    },

    //初始化音乐音效设置
    initMusicAndSound() {
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
            AudioManager.getInstance().onMusic(nn_audio_cfg.GAME_MUSIC);
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
        this.music_Slider.progress = m_volume;
        this.sound_Slider.progress = s_volume;
        this.music_Slider.node.getComponentInChildren(cc.ProgressBar).progress = m_volume;
        this.sound_Slider.node.getComponentInChildren(cc.ProgressBar).progress = s_volume;
        var fangyan_node = cc.find('setting/bg/content/fangyan', this.node);
        cc.dd.ShaderUtil.setGrayShader(fangyan_node);
    },

    /**
     * 初始化邀请准备
     */
    initReadyInviteBtn() {
        var isRoomer = RoomMgr.Instance().isRoomer(cc.dd.user.id);
        this.btn_start.node.active = isRoomer;
        this.btn_ready.node.active = !isRoomer;
        this.updateRoomPlayerNum();
    },

    /**
     * 初始化房间信息
     */
    initRoomInfo() {
        var Rule = RoomMgr.Instance()._Rule;
        this.room_num.string = RoomMgr.Instance().roomId.toString();
        this.zong_ju.string = '/' + Rule.circleNum.toString() + '局';
        var detialNode = cc.find('room_info/detail', this.node);
        cc.find('room_num/lbl', detialNode).getComponent(cc.Label).string = RoomMgr.Instance().roomId.toString();
        cc.find('round_num/lbl', detialNode).getComponent(cc.Label).string = Rule.circleNum.toString();
        cc.find('chushifen/lbl', detialNode).getComponent(cc.Label).string = scoreTypeStr[Rule.scoreType];
        if (Rule.gameType == 1)
            cc.find('bank/lbl', detialNode).getComponent(cc.Label).string = '抢庄';
        else if (Rule.gameType == 2)
            cc.find('bank/lbl', detialNode).getComponent(cc.Label).string = '通比';
        else if (Rule.gameType == 3)
            cc.find('bank/lbl', detialNode).getComponent(cc.Label).string = '房主庄';
        else if (Rule.gameType == 4)
            cc.find('bank/lbl', detialNode).getComponent(cc.Label).string = '牛牛庄';
        cc.find('koupai/lbl', detialNode).getComponent(cc.Label).string = Rule.showType == 1 ? '扣一张' : '全扣';
        cc.find('beishu/lbl', detialNode).getComponent(cc.Label).string = Rule.beishu == 0 ? '牛牛x3牛九x2牛八x2' : '牛牛x4牛九x3牛八牛七x2';
        if (Rule.tuoguan == 0)
            cc.find('tuoguan/lbl', detialNode).getComponent(cc.Label).string = '无托管';
        else
            cc.find('tuoguan/lbl', detialNode).getComponent(cc.Label).string = Rule.tuoguan + '秒';
        cc.find('layout/renman', detialNode).active = Rule.renman;
        cc.find('layout/santiao', detialNode).active = Rule.cardTypeThree == 1;
        cc.find('layout/shunzi', detialNode).active = Rule.cardTypeStraight == 1;
        cc.find('layout/tonghua', detialNode).active = Rule.cardTypeFlush == 1;
        cc.find('layout/hulu', detialNode).active = Rule.cardTypeFullHouse == 1;
        cc.find('layout/wuxiaoniu', detialNode).active = Rule.cardTypeFive == 1;
        cc.find('layout/tonghuashun', detialNode).active = Rule.cardTypeFlushStraight == 1;
        cc.find('layout/sihuaniu', detialNode).active = Rule.cardTypeSihua == 1;
        cc.find('layout/wuhuaniu', detialNode).active = Rule.cardTypeWuhua == 1;
        cc.find('layout/zhadanniu', detialNode).active = Rule.cardTypeZhadan == 1;
        cc.find('layout/voice', detialNode).active = Rule.limitTalk;
        cc.find('layout/gps', detialNode).active = Rule.gps;

        //玩法名称+人数+圈数+封顶+缺几人
        if (this.btn_friend_invite) {
            let rule = '逗双十' + ' ' + Rule.circleNum.toString() + '局';
            this.btn_friend_invite.getComponent('klb_friend_group_invite_btn').setInfo(RoomMgr.Instance().roomId, rule);
        }
        this.schedule(this.switchTimeRound, 10);
    },

    /**
     * 初始化桌布
     */
    initZhuoBu() {
        var idx = 0;
        var json = cc.sys.localStorage.getItem('nn_zhuobu_' + cc.dd.user.id);
        if (json) {
            var sprite = null;
            this.zhuobu_splist.forEach(function (element, index) {
                if (element._name == json) {
                    sprite = element;
                    idx = index;
                }
            });
            if (sprite) {
                cc.find('bg', this.node).getComponent(cc.Sprite).spriteFrame = sprite;
            }
            else {
                cc.find('bg', this.node).getComponent(cc.Sprite).spriteFrame = this.zhuobu_splist[0];
                cc.sys.localStorage.setItem('nn_zhuobu_' + cc.dd.user.id, this.zhuobu_splist[0]._name);
            }
        }
        else {
            cc.find('bg', this.node).getComponent(cc.Sprite).spriteFrame = this.zhuobu_splist[0];
            cc.sys.localStorage.setItem('nn_zhuobu_' + cc.dd.user.id, this.zhuobu_splist[0]._name);
        }
        var bg_item = cc.find('setting/bg/content/zhuomian/view/content/bg', this.node);
        var tog_item = cc.find('setting/bg/content/zhuomian/toggles/tog', this.node);
        this.zhuobu_splist.forEach(element => {
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
        this.nextBgBtn.interactable = this.idxZm < (this.zhuobu_splist.length - 1);
        this.preBgBtn.interactable = this.idxZm > 0;
    },
    onZhuobuSwitch(event, custom) {
        switch (custom) {
            case 'next':
                if (!this.changingZhuobu) {
                    if (this.zhuobu_splist[this.idxZm + 1]) {
                        this.nextBgBtn.interactable = false;
                        this.preBgBtn.interactable = false;
                        this.changingZhuobu = true;
                        var move = cc.moveTo(1, cc.v2(-(++this.idxZm) * (this.zmSpacingX + this.zmWidth)));
                        cc.sys.localStorage.setItem('nn_zhuobu_' + cc.dd.user.id, this.zhuobu_splist[this.idxZm]._name);
                        cc.find('bg', this.node).getComponent(cc.Sprite).spriteFrame = this.zhuobu_splist[this.idxZm];
                        var func = function () {
                            this.toggleZm.children[this.idxZm].getChildByName('lv').active = false;
                            this.toggleZm.children[this.idxZm + 1].getChildByName('lv').active = true;
                            this.changingZhuobu = false;
                            this.freshNextPreBtn();
                        }.bind(this);
                        this.contentZm.runAction(cc.sequence(move.easing(cc.easeQuinticActionOut()), cc.callFunc(func)));
                    }
                }
                break;
            case 'pre':
                if (!this.changingZhuobu) {
                    if (this.zhuobu_splist[this.idxZm - 1]) {
                        this.nextBgBtn.interactable = false;
                        this.preBgBtn.interactable = false;
                        this.changingZhuobu = true;
                        var move = cc.moveTo(1, cc.v2(-(--this.idxZm) * (this.zmSpacingX + this.zmWidth)));
                        cc.sys.localStorage.setItem('nn_zhuobu_' + cc.dd.user.id, this.zhuobu_splist[this.idxZm]._name);
                        cc.find('bg', this.node).getComponent(cc.Sprite).spriteFrame = this.zhuobu_splist[this.idxZm];
                        var func = function () {
                            this.toggleZm.children[this.idxZm + 2].getChildByName('lv').active = false;
                            this.toggleZm.children[this.idxZm + 1].getChildByName('lv').active = true;
                            this.changingZhuobu = false;
                            this.freshNextPreBtn();
                        }.bind(this);
                        this.contentZm.runAction(cc.sequence(move.easing(cc.easeQuinticActionOut()), cc.callFunc(func)));
                    }
                }
                break;
        }

    },

    //取消托管
    clickCancelAuto() {
        nn_send_msg.tuoguan(false);
    },

    /** 
     * 离开房间
    */
    leaveReq() {
        nn_send_msg.leave(RoomMgr.Instance().gameId, RoomMgr.Instance().roomId);
    },

    //点击背景
    onBgClick() {
        if (this.menu_show) {
            this.btn_menu.interactable = false;
            var ani = cc.find('menu', this.node).getComponent(cc.Animation);
            ani._nameToState[ani._defaultClip.name].wrapMode = cc.WrapMode.Reverse;
            cc.find('menu', this.node).getComponent(cc.Animation).off('finished', null);
            cc.find('menu', this.node).getComponent(cc.Animation).on('finished', function () { cc.find('btns/menu', this.node).getComponent(cc.Button).interactable = true; }.bind(this), this);
            cc.find('menu', this.node).getComponent(cc.Animation).play();
            this.menu_show = null;
        }
        if (cc.find('room_info/detail', this.node) && cc.find('room_info/detail', this.node).active == true) {
            cc.find('room_info/detail', this.node).active = false;
        }
    },

    /**
     * 聊天按钮 
     */
    onChatClick(event, custom) {
        if (RoomMgr.Instance()._Rule)
            var limitWords = RoomMgr.Instance()._Rule.limitWords;
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
            }
        }
    },

    //聊天切换
    onChatToggle(event, custom) {
        if (custom == 'text') {
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

    //关闭聊天
    onCloseChat(event, custom) {
        if (!this.chatAni) {
            cc.find('chat', this.node).getComponent(cc.Animation).play('chat_out');
        }
    },

    //表情点击
    onEmojiClick(event, custom) {
        if (!this.emojiCD) {
            hall_audio_mgr.com_btn_click();
            this.emojiCD = true;
            setTimeout(function () {
                this.emojiCD = false;
            }.bind(this), 3 * 1000);
            if (!this.chatAni) {
                cc.find('chat', this.node).getComponent(cc.Animation).play('chat_out');
            }
            var gameType = RoomMgr.Instance().gameId;
            var roomId = RoomMgr.Instance().roomId;
            var id = parseInt(custom);

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

    /**
     * 事件处理
     * @param {*} event 
     * @param {*} data 
     */
    onEventMessage(event, data) {
        switch (event) {
            case RoomEvent.on_room_leave:
                this.playerLeave(data[0]);
                break;
            case HallCommonEvent.HALL_NO_RECONNECT_GAME:
                var result_node = cc.find('Canvas/result');
                var end_node = cc.find('Canvas/zhanjitongji');
                if (result_node.active == true && result_node.getChildByName('taotai').active == true) {
                    return;
                }
                if (end_node.active == true) {
                    return;
                }
                this.backToHall();
                break;
            default:
                break;
        }
    },

    /**
     * 点击退出
     */
    onExit(event, custom) {
        hall_audio_mgr.com_btn_click();
        this.node_menu.active = false;
        this.menu_show = false;
        this.btn_menu.interactable = true;
        var content = "";
        var callfunc = null;
        //已经结束
        if (nn_data.Instance().isEnd == true) {
            this.backToHall();
            return;
        }
        // 已经开始
        if (nn_data.Instance().isStart == true) {
            content = cc.dd.Text.TEXT_LEAVE_ROOM_2;
            callfunc = this.dissolveEnsure.bind(this);
        }
        else {
            if (RoomMgr.Instance().isRoomer(cc.dd.user.id)) {
                content = cc.dd.Text.TEXT_LEAVE_ROOM_1;
                callfunc = this.leaveReq;
            } else {
                content = cc.dd.Text.TEXT_LEAVE_ROOM_3;
                callfunc = this.leaveReq;
            }
        }
        this.popupOKcancel(content, callfunc);
    },

    /**
     * 显示规则
     */
    onGuize(event, custom) {
        hall_audio_mgr.com_btn_click();
        if (custom == 'close') {
            this.node_guize.active = false;
        }
        else {
            this.menu_show = false;
            this.node_menu.active = false;
            this.btn_menu.interactable = true;
            this.node_guize.active = true;
        }
    },

    /**
     * 邀请微信好友
     */
    onInvaite(event, custom) {
        if (event.type != "touchend") {
            return;
        }
        hall_audio_mgr.com_btn_click();
        var num = 0;
        var playerList = nn_data.Instance().getPlayerList();
        for (var i = 0; i < playerList.length; i++) {
            if (playerList[i] == null || playerList[i].userId == null) {
                num++;
            }
        }
        var title = "房间号:" + RoomMgr.Instance().roomId + '\n';
        var str = this.getRuleString();
        if (cc.sys.isNative) {
            // cc.dd.native_wx.SendAppContent(RoomMgr.Instance().roomId, '【逗双十】', title + str, Platform.GetAppUrl(AppCfg.GAME_PID, AppCfg.PID));
            let wanFa = [];
            var rules = RoomMgr.Instance()._Rule;
            wanFa.push('共' + rules.circleNum + '局');
            //wanFa.push('初始分:' + (scoreTypeStr[rules.scoreType]));
            if (rules.gameType == 1) {
                wanFa.push('抢庄');
            }
            else if (rules.gameType == 2) {
                wanFa.push('通比');
            }
            // else {
            //     wanFa.push('霸王庄';
            // }
            if (rules.showType == 1) {
                wanFa.push('扣一张');
            }
            else {
                wanFa.push('全扣');
            }
            if (rules.cardTypeThree == 1) {
                wanFa.push('三条');
            }
            if (rules.cardTypeStraight == 1) {
                wanFa.push('顺子');
            }
            if (rules.cardTypeFlush == 1) {
                wanFa.push('同花');
            }
            if (rules.cardTypeFullHouse == 1) {
                wanFa.push('葫芦');
            }
            if (rules.cardTypeFive == 1) {
                wanFa.push('五小牛');
            }
            if (rules.cardTypeFlushStraight == 1) {
                wanFa.push('同花顺');
            }
            if (rules.limitWords == true) {
                wanFa.push('禁言');
            }
            if (rules.limitTalk == true) {
                wanFa.push('禁止语音');
            }
            if (rules.gps == true) {
                wanFa.push('GPS测距');
            }

            let _playerList = nn_data.Instance().getPlayerList();
            let playerName = [];
            _playerList.forEach(function (playerMsg) {
                if (playerMsg && playerMsg.userId) {
                    playerName.push(playerMsg.name);
                }
            }, this);

            let info = {
                gameid: RoomMgr.Instance().gameId,//游戏ID
                roomid: RoomMgr.Instance().roomId,//房间号
                title: "逗双十",//房间名称
                content: wanFa,//游戏规则数组
                usercount: nn_data.Instance().getPlayerList().length,//人数
                jushu: rules.circleNum,//局\圈数
                jushutitle: '局数',//局\圈标题，默认局数
                playername: playerName,//玩家姓名数组
                gamestate: '未开始',//游戏状态
            }
            if (custom == 'xianliao') {
                var login_module = require('LoginModule');
                var url = Platform.shareGameUrl + '?channel=' + (cc.dd.user.regChannel * 100 + login_module.Instance().loginType % 100);
                cc.dd.native_wx.sendXlLink('【逗双十】', title + str, url);
            }
            else
                cc.dd.native_wx.SendAppInvite(info, '【逗双十】', title + str, Platform.wxShareGameUrl[AppCfg.PID]);
        }
        cc.log("邀请好友：", str);
    },

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
     * 继续
     */
    onNextGame(event, custom) {
        nn_send_msg.ready();
    },

    //快捷文字
    onQuickChatClick(event) {
        if (!this.chatCD) {
            this.chatCD = true;
            this.scheduleOnce(function () {
                this.chatCD = false;
            }.bind(this), 2);
            hall_audio_mgr.com_btn_click();
            if (!this.chatAni) {
                cc.find('chat', this.node).getComponent(cc.Animation).play('chat_out');
            }

            var gameType = RoomMgr.Instance().gameId;
            var roomId = RoomMgr.Instance().roomId;

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

    /**
     * 准备点击
     */
    onReady(event, data) {
        hall_audio_mgr.com_btn_click();
        var msg = new cc.pb.room_mgr.msg_prepare_game_req();
        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType(RoomMgr.Instance().gameId);
        gameInfoPB.setRoomId(RoomMgr.Instance().roomId);
        msg.setGameInfo(gameInfoPB);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_prepare_game_req, msg, "msg_prepare_game_req", true);
        // else {
        //     nn_send_msg.startgame();
        // }
    },

    /**
     * 房间详情
     */
    onRoomInfo(event, data) {
        if (cc.find('room_info/detail', this.node).active == true) {
            cc.find('room_info/detail', this.node).active = false;
        }
        else {
            cc.find('room_info/detail', this.node).active = true;
        }
    },

    /**
     * 设置音乐音效
     */
    onSetMusic: function (event, custom) {
        var duration = 0.3;
        var step = 0.05;
        switch (custom) {
            case 'music':
                var music_Node = this.music_Node;
                if (AudioManager.getInstance()._getLocalMusicSwitch()) {//on  需要关闭
                    if (!this.switch_music) {
                        cc.find('label_kai', music_Node).active = false;
                        var move = cc.moveTo(duration, cc.v2(-50, 0));
                        var spFunc = cc.callFunc(function () {
                            cc.find('tao/y', music_Node).active = false;
                            cc.find('tao/b', music_Node).active = true;
                            cc.find('label_guan', music_Node).active = true;
                            AudioManager.getInstance().offMusic();
                        }.bind(this));
                        var action = cc.sequence(move, spFunc);
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
                        cc.find('tao', music_Node).runAction(action);
                    }
                }
                else {
                    if (!this.switch_music) {
                        cc.find('label_guan', music_Node).active = false;
                        var move = cc.moveTo(duration, cc.v2(46.6, 0));
                        var spFunc = cc.callFunc(function () {
                            cc.find('tao/y', music_Node).active = true;
                            cc.find('tao/b', music_Node).active = false;
                            cc.find('label_kai', music_Node).active = true;
                            AudioManager.getInstance().onMusic(nn_audio_cfg.GAME_MUSIC);
                        }.bind(this));
                        var action = cc.sequence(move, spFunc);
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
                        cc.find('tao', music_Node).runAction(action);
                    }
                }
                break;
            case 'sound':
                var sound_Node = this.sound_Node;
                if (AudioManager.getInstance()._getLocalSoundSwitch()) {//on  需要关闭
                    if (!this.switch_sound) {
                        cc.find('label_kai', sound_Node).active = false;
                        var move = cc.moveTo(duration, cc.v2(-50, 0));
                        var spFunc = cc.callFunc(function () {
                            cc.find('tao/y', sound_Node).active = false;
                            cc.find('tao/b', sound_Node).active = true;
                            cc.find('label_guan', sound_Node).active = true;
                            AudioManager.getInstance().offSound();
                        }.bind(this));
                        var action = cc.sequence(move, spFunc);
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
                        cc.find('tao', sound_Node).runAction(action);
                    }
                }
                else {
                    if (!this.switch_sound) {
                        cc.find('label_guan', sound_Node).active = false;
                        var move = cc.moveTo(duration, cc.v2(43, 0));
                        var spFunc = cc.callFunc(function () {
                            cc.find('tao/y', sound_Node).active = true;
                            cc.find('tao/b', sound_Node).active = false;
                            cc.find('label_kai', sound_Node).active = true;
                            AudioManager.getInstance().onSound();
                        }.bind(this));
                        var action = cc.sequence(move, spFunc);
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
                        cc.find('tao', sound_Node).runAction(action);
                    }
                }
                break;
            case 'mute':
                if (this.mute) {//静音开启  需关闭
                    AudioManager.getInstance().setSoundVolume(this.sound_Slider.progress);
                    AudioManager.getInstance().setMusicVolume(this.music_Slider.progress);
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

    sliderMusic(event, custom) {
        if (custom == '1') {//音乐
            this.music_Slider.node.getComponentInChildren(cc.ProgressBar).progress = event.progress;
            if (!this.mute)
                AudioManager.getInstance().setMusicVolume(event.progress);
        }
        else {
            this.sound_Slider.node.getComponentInChildren(cc.ProgressBar).progress = event.progress;
            if (!this.mute)
                AudioManager.getInstance().setSoundVolume(event.progress);
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
     * 分享战绩点击
     */
    onShareZhanji(event, data) {
        hall_audio_mgr.com_btn_click();
        if (cc.sys.isNative) {
            var canvasNode = cc.find('Canvas');
            cc.find('zhanjitongji/gongzhonghao', this.node).active = true;
            if (data == 'wechat') {
                cc.dd.native_wx.SendScreenShot(canvasNode, 2);
            }
            else if (data == 'xianliao') {
                cc.dd.native_wx.sendXlScreenShot(canvasNode);
            }
            else {
                cc.dd.native_wx.SendScreenShotTimeline(canvasNode, 2);
            }
            cc.find('zhanjitongji/gongzhonghao', this.node).active = false;
        }
    },

    /**
     * 战绩按钮点击
     */
    onZhanji(event, data) {
        if (data == 'show') {
            cc.find('zhanjitongji', this.node).active = true;
        }
        else {
            cc.find('zhanjitongji', this.node).active = false;
            this.backToHall();
        }
    },

    /**
     * 玩家退出
     * @param {*} data 
     */
    playerLeave(data) {
        if (data.userId == cc.dd.user.id) {
            nn_data.Destroy();
            this.backToHall();
        }
        else {
            if (data.userId == RoomMgr.Instance().roomerId) {
                cc.dd.DialogBoxUtil.show(0, "房主已解散房间,请重新加入房间", 'text33', null, function () {
                    cc.dd.SceneManager.enterHall();
                }, function () {
                });
            }
        }
    },

    popupEnterHall(text, callfunc) {
        cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_TANCHUANG, function (ui) {
            ui.getComponent("jlmj_popup_view").show(text, callfunc, 2);
        }.bind(this));
    },

    /**
     * 提示框
     */
    popupOKcancel(text, callfunc) {
        cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_TANCHUANG, function (ui) {
            ui.getComponent("jlmj_popup_view").show(text, callfunc, 1);
        }.bind(this));
    },


    resetResult() {
        if (this._result_state) {
            switch (this._result_state) {
                case 'start_bipai'://开始比牌
                    cc.find('zi', this.node).getComponent(cc.Animation).off('finished', null);
                    cc.find('zi', this.node).getComponent(cc.Animation).stop();
                    cc.find('zi/start_bipai', this.node).active = false;
                    break;
                case 'fanpai_ani':
                    cc.find('zi/start_bipai', this.node).active = false;
                    for (var i = 0; i < this.playerUI.length; i++) {
                        this.playerUI[i].node.getComponent(cc.Animation).off('finished', null);
                        this.playerUI[i].node.getComponent(cc.Animation).setCurrentTime(0);
                        this.playerUI[i].node.getComponent(cc.Animation).stop();
                    }
                    break;
                case 'play_zi_ani':
                    cc.find('zi/lose', this.node).getComponent(cc.Animation).off('finished', null);
                    cc.find('zi/lose', this.node).getComponent(cc.Animation).stop();
                    cc.find('zi/lose', this.node).active = false;
                    cc.find('zi/win', this.node).getComponent(cc.Animation).off('finished', null);
                    cc.find('zi/win', this.node).getComponent(cc.Animation).stop();
                    cc.find('zi/win', this.node).active = false;
                    break;
                case 'show_coin_fly':
                    var coins = this.node.getComponentsInChildren('nn_coin');
                    coins.forEach(e => {
                        if (e.callback) {
                            e.callback = null;
                        }
                    })
                    break;
                case 'play_2nd_ani':
                    cc.find('head_node', this.node).getComponent(cc.Animation).off('finished', null);
                    cc.find('head_node', this.node).getComponent(cc.Animation).stop();
                    cc.find('next', lose_node.parent).active = false;
                    break;
            }
        }
    },

    /** 
     * 重连游戏
    */
    reconnectGame() {
        var self = this;
        this.resetResult();
        this.resetGameUI();
        this.initAutobetButton();
        if (cc.find('room_info/room', this.node)) {
            cc.find('room_info/room', this.node).active = false;
        }
        var playerList = nn_data.Instance().getPlayerList();
        playerList.forEach(player => {
            player.isWinner = false;
            var view = self.getView(player.userId);
            self.playerUI[view].autoRet(player.isAuto == true);
        });
        this.playerUI.forEach((scp, idx) => {
            scp.node.parent.getChildByName('winner').active = false;
        });
        nn_data.Instance().isStart = true;
        this.cur_ju.string = nn_data.Instance().curRound.toString();
        var roomStatus = nn_data.Instance().roomStatus;
        var leftTime = nn_data.Instance().leftTime;
        var playerList = nn_data.Instance().getPlayerList();
        var self_player = nn_data.Instance().getPlayerById(cc.dd.user.id);
        if (self_player.isWatch) {
            cc.find('zi/watch', this.node).active = true;
        }
        else {
            if (cc.find('zi/watch', this.node)) {
                cc.find('zi/watch', this.node).active = false;
            }
        }
        this.refreshDengIcon();
        if (roomStatus != 0) {
            playerList.forEach(player => {
                if (player && player.handCards && !player.isWatch) {
                    var view = self.getView(player.userId);
                    for (var i = 0; i < player.handCards.length; i++) {
                        self.setPoker(self.playerUI[view].handcard_node.children[i], player.handCards[i]);
                        if (self.playerUI[view].handcard_node.children[i].tagname.length) {
                            self.playerUI[view].handcard_node.children[i].tagname[0] = player.handCards[i];
                        }
                        else {
                            self.playerUI[view].handcard_node.children[i].tagname = [player.handCards[i], false];
                        }
                    }
                    self.playerUI[view].handcard_node.active = true;
                    if (player.isBanker) {
                        self.playerUI[view].bankdi_sp.node.active = true;
                        self.playerUI[view].banker_sp.node.active = true;
                    }
                }
            });
        }
        var resetPokerPositon = function () {
            playerList.forEach(player => {
                if (player && player.handCards) {
                    var view = self.getView(player.userId);
                    if (view == 0) {
                        var pos1 = [-228, -114, 0, 114, 228];
                        for (var i = 0; i < player.handCards.length; i++) {
                            self.playerUI[view].handcard_node.children[i].x = pos1[i];
                            self.playerUI[view].handcard_node.children[i].y = 0;
                            self.playerUI[view].handcard_node.children[i].scaleX = 0.64;
                            self.playerUI[view].handcard_node.children[i].scaleY = 0.64;
                        }

                    }
                    else {
                        var pos2 = [-64, -32, 0, 32, 64];
                        for (var i = 0; i < player.handCards.length; i++) {
                            self.playerUI[view].handcard_node.children[i].x = pos2[i];
                            self.playerUI[view].handcard_node.children[i].y = 0;
                        }
                    }
                }
            });
        };
        switch (roomStatus) {
            case 4://结算
            case 0://准备状态
                this._endReconnect = true;
                this.scanPokerWait = false;
                for (var i = 0; i < this.playerUI.length; i++) {
                    this.playerUI[i].node.getComponent(cc.Animation).stop();
                    this.playerUI[i].node.getComponent(cc.Animation).off('finished', null);
                    if (this.playerUI[i].type_node)
                        this.playerUI[i].type_node.active = false;
                }
                cc.find('zi/start_bipai', this.node).active = false;
                this.btn_start.node.active = false;
                this.btn_invite.node.active = false;
                this.btn_friend_invite.active = this.btn_invite.node.active && RoomMgr.Instance().isClubRoom();
                this.btn_ready.node.active = false;
                this.btn_jixu.node.active = false;
                this.btn_ready.node.parent.active = true;
                playerList.forEach(player => {
                    if (player) {
                        player.bready = (player.state == 1);
                    }
                });
                if (!self_player.bready)
                    this.btn_jixu.node.active = true;
                RoomED.notifyEvent(RoomEvent.on_room_game_start, []);
                break;
            case 1://抢庄
                resetPokerPositon();
                nn_data.Instance().isGaming = true;
                this.gameStart();
                if (!self_player.isWatch)
                    this.setTimer(leftTime);
                playerList.forEach(player => {
                    if (player && player.betOne > -1) {
                        var view = self.getView(player.userId);
                        var sprite = self.getBankSpriteFrame(player.betOne);
                        self.playerUI[view].bankRet(player.betOne, sprite, true);
                    }
                });
                if (!(self_player.betOne > -1)) {
                    if (!self_player.isWatch)
                        this.playerUI[0].showOp(0);
                }
                else {
                    if (!self_player.isWatch)
                        this.playerUI[0].showOp(3);
                }
                break;
            case 2://下注
                resetPokerPositon();
                nn_data.Instance().isGaming = true;
                this.gameStart();
                if (!self_player.isWatch)
                    this.setTimer(leftTime);
                playerList.forEach(player => {
                    if (player && player.betOne > -1 && player.isBanker) {
                        var view = self.getView(player.userId);
                        var sprite = self.getBankSpriteFrame(player.betOne);
                        self.playerUI[view].bankRet(player.betOne, sprite, true);
                    }
                    if (player && player.betTwo > -1) {
                        var view = self.getView(player.userId);
                        var sprite = self.getBetSpriteFrame(player.betTwo);
                        self.playerUI[view].betRet(player.betTwo, sprite, true);
                    }
                });
                if (!(self_player.betTwo > -1) && !self_player.isBanker) {
                    if (!self_player.isWatch)
                        this.playerUI[0].showOp(1);
                }
                else if (self_player.isBanker) {
                    if (!self_player.isWatch)
                        this.playerUI[0].showOp(2);
                }
                break;
            case 3://组牌
                resetPokerPositon();
                nn_data.Instance().isGaming = true;
                this.gameStart();
                // if (!self_player.isWatch)
                //     this.setTimer(leftTime);
                // playerList.forEach(player => {
                //     if (player) {
                //         if (player && player.betOne > -1 && player.isBanker) {
                //             var view = self.getView(player.userId);
                //             var sprite = self.getBankSpriteFrame(player.betOne);
                //             self.playerUI[view].bankRet(player.betOne, sprite, true);
                //         }
                //         if (player && player.betTwo > -1) {
                //             var view = self.getView(player.userId);
                //             var sprite = self.getBetSpriteFrame(player.betTwo);
                //             self.playerUI[view].betRet(player.betTwo, sprite, true);
                //         }
                //         if (player.userId == cc.dd.user.id) {
                //             if (player.isOpt) {
                //                 self.playerUI[0].groupRet(player.cardType);
                //             }
                //             else {
                //                 if (!self_player.isWatch)
                //                     self.playerUI[0].showOp(2);
                //             }
                //         }
                //         else {
                //             var view = self.getView(player.userId);
                //             self.playerUI[view].zupai_armature.node.active = true;
                //             if (player.isOpt) {
                //                 self.playerUI[view].groupRet(player.cardType);
                //             }
                //             else {
                //                 self.playerUI[view].zupai_armature.playAnimation('zupaizhong', -1);
                //             }
                //         }
                //     }
                // });
                break;
            // case 4://结算
            //     nn_data.Instance().isGaming = true;
            //     this.gameStart();
            //     break;
            case 10://
                nn_data.Instance().isGaming = true;
                this.gameStart();
                break;
        }
        var dissolve_data = nn_data.Instance().agreesList;
        if (dissolve_data && dissolve_data.length) {
            var distime = dissolve_data[0].time;
            this.showDissolveList(dissolve_data, distime);
        }
    },

    refreshDengIcon() {
        if (cc.find('deng', this.playerUI[0].node.parent)) {
            var playerList = nn_data.Instance().getPlayerList();
            for (var i = 0; i < this.playerUI.length; i++) {
                var player = nn_data.Instance().getPlayerByViewIdx(i);
                if (player && player.isWatch) {
                    cc.find('deng', this.playerUI[i].node.parent).active = true;
                }
                else {
                    cc.find('deng', this.playerUI[i].node.parent).active = false;
                }
            }
        }
    },

    /**
     * 重置UI  下一局开始
     */
    resetGameUI() {
        this.timer_node.active = false;
        this.btn_jixu.node.active = false;
        cc.find('result', this.node).active = false;
        for (var i = 0; i < this.playerUI.length; i++) {
            this.playerUI[i].resetUI();
        }
    },

    /**
     * 开牌
     */
    scanPoker(msg) {
        cc._pauseLMAni = true;
        if (this.sendPokering) {
            this.scanPokerWait = true;
            this.scanPokerMsg = msg;
            return;
        }
        var comp = function (a, b) {
            var viewB = this.getView(b.userId);
            if (viewB == 0) return true;
            return false;
        }.bind(this);
        msg.sort(comp);
        //msg.sort(function (a, b) { return this.getView(a.userId) > this.getView(b.userId) }.bind(this));
        // this.playerUI.forEach(scp => {
        //     scp.zupai_armature && (scp.zupai_armature.node.active = false);
        // });
        var playFinished = function (event) {
            //event.target.off(dragonBones.EventObject.COMPLETE, null);
            event && event.target.off('finished', playFinished, this);
            var data = msg.shift();
            if (data) {
                playAni(data);
            }
            else {
                cc.find('zi/start_bipai', this.node).active = false;
                this.showResult();
                cc._pauseLMAni = false;
            }
        };
        var playAni = function (data) {
            this._result_state = 'fanpai_ani';
            var userId = data.userId;
            var cardsList = data.cardsList;
            var type = data.type;
            var orderCardsList = data.orderCardsList;
            var view = this.getView(userId);
            if (view == 0) {
                cc.find('type', this.playerUI[view].type_node).getComponent(cc.Sprite).spriteFrame = this.typeSpList[type];
                this.playerUI[view].node.getComponent(cc.Animation).on('finished', playFinished, this);
                var kou5 = RoomMgr.Instance()._Rule ? RoomMgr.Instance()._Rule.showType : 1;
                if (kou5 != 2) {
                    this.scheduleOnce(function () { nn_mgr.Instance().playSound(nn_data.Instance().getPlayerById(userId).sex, 1, type); }, 1.25);
                    this.playerUI[view].node.getComponent(cc.Animation).play('fanpai');
                    cc.log('自己翻牌 play fanpai');
                }
                else {
                    this.scheduleOnce(function () { nn_mgr.Instance().playSound(nn_data.Instance().getPlayerById(userId).sex, 1, type); }, 1);
                    this.playerUI[view].node.getComponent(cc.Animation).play('fanpai5');
                    cc.log('play fanpai5');
                }
            }
            else {
                var sortedcards = nn_data.Instance().getSortedCards(cardsList, type);
                if (view != null && view > -1 && view < 9) {
                    for (var i = 0; i < sortedcards.length; i++) {
                        this.setPokerBack(this.playerUI[view].handcard_node.children[i], sortedcards[i]);
                    }
                    cc.find('type', this.playerUI[view].type_node).getComponent(cc.Sprite).spriteFrame = this.typeSpList[type];
                    this.playerUI[view].node.getComponent(cc.Animation).on('finished', playFinished, this);
                    this.playerUI[view].node.getComponent(cc.Animation).play('showcard_other');
                    cc.log('其他人开牌view:' + view, ',userId:' + userId);
                    nn_mgr.Instance().playSound(nn_data.Instance().getPlayerById(userId).sex, 1, type);
                }
                else {
                    var newfunc = playFinished.bind(this);
                    newfunc();
                }
            }
        }.bind(this);
        var isWatch = nn_data.Instance().getPlayerById(cc.dd.user.id).isWatch;
        if (isWatch) {
            playFinished();
        }
        else {
            cc.find('zi', this.node).getComponent(cc.Animation).off('finished', null);
            cc.find('zi', this.node).getComponent(cc.Animation).on('finished', playFinished, this);
            cc.find('zi/start_bipai', this.node).scaleX = 0;
            cc.find('zi/start_bipai', this.node).scaleY = 0;
            if (!this._endReconnect)
                cc.find('zi/start_bipai', this.node).active = true;
            cc.find('zi', this.node).getComponent(cc.Animation).play('start_bipai');
            cc.log('开始比牌...');
            this._result_state = 'start_bipai';
        }
        AudioManager.getInstance().playSound(nn_audio_cfg.COMMON.OpenCard, false);
    },

    /**
     * 发牌
     */
    sendPoker(msg) {
        for (var i = 0; i < this.playerUI.length; i++) {
            this.playerUI[i].win_gold.active = false;
            this.playerUI[i].win_gold.opacity = 0;
        }
        this._endReconnect = false;
        var self = this;
        if (RoomMgr.Instance()._Rule && RoomMgr.Instance()._Rule.gameType == 2) {
            var playerList = nn_data.Instance().getPlayerList();
            playerList.forEach(player => {
                if (player)
                    player.isWinner = false;
            });
            this.playerUI.forEach((scp, idx) => {
                scp.node.parent.getChildByName('winner').active = false;
            });
        }
        cc.find('zi/watch', this.node) && (cc.find('zi/watch', this.node).active = false);
        this.refreshDengIcon();
        var comp = function (a, b) {
            var viewA = this.getView(a.userId);
            var viewB = this.getView(b.userId);
            if (viewA == 0) return false;
            if (viewB == 0) return true;
            return viewB - viewA;
        }.bind(this);
        msg.sort(comp);
        var curRound = nn_data.Instance().curRound;
        this.cur_ju.string = curRound.toString();
        var playFinished = function (event) {
            event.target.off('finished', playFinished);
            var data = msg.shift();
            if (data) {
                playAni(data);
            }
            else {
                self.sendPokering = false;
            }
        };
        var playDBFinished = function () {
            cc.find('zi/start', this.node).getComponent(cc.Animation).off('finished', playDBFinished, this);
            //cc.find('zi/start', this.node).active = false;
            var data = msg.shift();
            if (data) {
                playAni(data);
            }
            else {
                self.sendPokering = false;
            }
        };
        var playAni = function (data) {
            var userId = data.userId;
            var cardsList = data.cardsList;
            var view = this.getView(userId);
            for (var i = 0; i < cardsList.length; i++) {
                this.setPoker(this.playerUI[view].handcard_node.children[i], cardsList[i]);
            }
            this.playerUI[view].node.getComponent(cc.Animation).on('finished', playFinished);
            var ani_name = this.playerUI[view].node.getComponent(cc.Animation).getClips().find(e => { return e.name.indexOf('sendpoker') != -1; }).name;
            this.playerUI[view].node.getComponent(cc.Animation).play(ani_name);
        }.bind(this);
        cc.find('zi/start', this.node).active = true;
        cc.find('zi/start', this.node).getComponent(cc.Animation).on('finished', playDBFinished, this);
        cc.find('zi/start', this.node).getComponent(cc.Animation).play();
        this.sendPokering = true;
        AudioManager.getInstance().playSound(nn_audio_cfg.COMMON.START_GAME, false);
    },

    /**
     * 第二次发牌（翻牌）
     */
    send2ndPoker(msg) {
        // this.clearBetUI();
        // msg.forEach(data => {
        //     var userId = data.userId;
        //     var cardsList = data.cardsList;
        //     var view = this.getView(userId);
        //     if (view == 0) {
        //         // for (var i = 0; i < cardsList.length; i++) {
        //         //     this.setPokerBack(this.playerUI[view].handcard_node.children[i], cardsList[i]);
        //         //     this.playerUI[view].handcard_node.children[i].tag = [cardsList[i], null];
        //         //     if (cc.find('beimian', this.playerUI[view].handcard_node.children[i]).active == true) {
        //         //         this.playerUI[view].handcard_node.children[i].getComponent(cc.Animation).play('rotate_poker');
        //         //     } 
        //         // }
        //         var kou5 = RoomMgr.Instance()._Rule ? RoomMgr.Instance()._Rule.showType : 1;
        //         if (kou5 != 2)
        //             this.playerUI[view].node.getComponent(cc.Animation).play('fanpai');
        //         else
        //             this.playerUI[view].node.getComponent(cc.Animation).play('fanpai5');
        //     }

        // });
    },

    /**
     * 设置单张牌
     * @param {cc.Node} node 
     * @param {Number} value 
     */
    setPoker(node, value) {
        nn_mgr.Instance().setPoker(node, value, this.pokerAtlas);
    },
    //设置背面
    setPokerBack(node, value) {
        nn_mgr.Instance().setPokerBack(node, value, this.pokerAtlas);
    },

    /**
     * 设置准备
     */
    setReady: function (readyId) {
        var selfId = cc.dd.user.id;
        if (readyId === selfId) {
            this.btn_ready.node.active = false;
            this.btn_start.node.active = false;
        }
    },


    /**
     * 倒计时
     * @param {Number} time 
     */
    setTimer(time) {
        time = time > 0 ? time : 0;
        this.timer_node.getComponent(cc.Sprite).unscheduleAllCallbacks()
        this._time = time;
        this.timer_node.getChildByName('lbl').getComponent(cc.Label).string = parseInt(time).toString();
        this.timer_node.active = true;
        this.timer_node.getComponent(cc.Sprite).schedule(function () {
            this._time -= 1;
            if (RoomMgr.Instance()._Rule && RoomMgr.Instance()._Rule.tuoguan != 0 && this._time <= 5 && !this._timerSound) {
                this._timerSound = nn_audio_cfg.COMMON.TIMER;
                AudioManager.getInstance().playSound(nn_audio_cfg.COMMON.TIMER, true);
            }
            if (this._time <= 0) {
                this._time = 0;
                this.timer_node.getComponent(cc.Sprite).unscheduleAllCallbacks()
            }
            // else {
            //     if (this._time == 1) {
            //         AudioManager.getInstance().playSound(nn_audio_cfg.COMMON.TIMER_1, false);
            //     }
            //     else if (this._time > 1 && this._time < 4) {
            //         AudioManager.getInstance().playSound(nn_audio_cfg.COMMON.TIMER, false);
            //     }
            // }
            this.timer_node.getChildByName('lbl').getComponent(cc.Label).string = this._time.toString();
        }.bind(this), 1);
    },

    /**
     * 显示解散
     * @param {*} msg 
     */
    showDissolve(msg) {
        cc.dd.UIMgr.closeUI(jlmj_prefab.JLMJ_TANCHUANG);
        var UI = cc.dd.UIMgr.getUI(dissolveUI);
        if (UI) {
            UI.getComponent('nn_dissolve').setData(msg);
        }
        else {
            cc.dd.UIMgr.openUI(dissolveUI, function (ui) {
                var timeout = Remain_Timer.Dissolve;
                var playerList = nn_data.Instance().getPlayerList();
                ui.getComponent('nn_dissolve').setStartData(timeout, playerList, msg);
            });
        }
    },

    /**
     * 解散列表（重连）
     * @param {*} msglist 
     * @param {*} time 
     */
    showDissolveList(msglist, time) {
        var UI = cc.dd.UIMgr.getUI(dissolveUI);
        if (!UI) {
            cc.dd.UIMgr.openUI(dissolveUI, function (ui) {
                var playerList = nn_data.Instance().getPlayerList();
                for (var i = 0; i < msglist.length; i++) {
                    if (i == 0) {
                        ui.getComponent('nn_dissolve').setStartData(time, playerList, msglist[i]);
                    }
                    else {
                        ui.getComponent('nn_dissolve').setData(msglist[i]);
                    }
                }
            })
        }
        else {
            for (var i = 0; i < msglist.length; i++) {
                UI.getComponent('nn_dissolve').setData(msglist[i]);
            }
        }
    },

    /**
     * 解散结果
     * @param {*} msg 
     */
    showDissolveResult(msg) {
        var isDissolve = msg.isDissolve;
        nn_data.Instance().isDissolved = isDissolve;
        if (isDissolve == true) {
            cc.dd.PromptBoxUtil.show('房间解散成功!');
        }
        else {
            cc.dd.PromptBoxUtil.show('房间解散失败!');
        }
        cc.dd.UIMgr.destroyUI(dissolveUI);
    },


    /**
     * 单局结算
     */
    showResult() {
        var self = this;
        var list = nn_data.Instance().resultsList;
        // var score_node = cc.find('result/score', this.node);
        // score_node.active = false;
        // score_node.children.forEach(element => {
        //     element.getChildByName('lbl').getComponent(cc.Label).string = '';
        //     element.getChildByName('lose_di').active = false;
        //     element.getChildByName('win_di').active = false;
        // });
        this.playerUI.forEach(ui => {
            ui.win_gold.getChildByName('lbl').getComponent(cc.Label).string = '';
            ui.win_gold.getChildByName('lose_di').active = false;
            ui.win_gold.getChildByName('win_di').active = false;
        });
        var self_wingold = 0;
        var bankerWin = [];
        var bankerLost = [];
        var bankerView = -1;
        var isWatch = nn_data.Instance().getPlayerById(cc.dd.user.id).isWatch;
        for (var i = 0; i < list.length; i++) {
            if (list[i].userId == cc.dd.user.id) {
                self_wingold = list[i].winGold;
            }
            var view = this.getView(list[i].userId);
            if (list[i].winGold < 0) {
                this.playerUI[list[i].view].win_gold.getChildByName('lose_di').active = true;
                this.playerUI[list[i].view].win_gold.getChildByName('win_di').active = false;
                this.playerUI[list[i].view].win_gold.getChildByName('lbl').getComponent(cc.Label).font = this.lose_font;
                this.playerUI[list[i].view].win_gold.getChildByName('lbl').getComponent(cc.Label).string = ':' + Math.abs(list[i].winGold);
            }
            else {
                this.playerUI[list[i].view].win_gold.getChildByName('lose_di').active = false;
                this.playerUI[list[i].view].win_gold.getChildByName('win_di').active = true;
                this.playerUI[list[i].view].win_gold.getChildByName('lbl').getComponent(cc.Label).font = this.win_font;
                this.playerUI[list[i].view].win_gold.getChildByName('lbl').getComponent(cc.Label).string = ':' + Math.abs(list[i].winGold);
            }
            if (RoomMgr.Instance()._Rule && RoomMgr.Instance()._Rule.gameType == 2) {
                if (list[i].winGold > 0) {
                    bankerView = view;
                }
                else {
                    bankerWin.push(view);
                }
            }
            else {
                var isBanker = nn_data.Instance().getPlayerById(list[i].userId).isBanker;
                if (!isBanker) {
                    if (list[i].winGold > 0) {
                        bankerLost.push(view);
                    }
                    else {
                        bankerWin.push(view);
                    }
                }
                else {
                    bankerView = view;
                }
                nn_data.Instance().getPlayerById(list[i].userId).isBanker = false;
            }
        }
        var result_node = cc.find('result', this.node);
        var win_node = cc.find('result/win', this.node);
        var lose_node = cc.find('result/lose', this.node);
        var next_node = cc.find('result/next', this.node);
        win_node.active = false;
        lose_node.active = false;
        next_node.active = false;
        result_node.active = true;
        var showCoinFly = function (list1, list2) {
            self._result_state = 'show_coin_fly';
            const totalTime = 1;
            const flyTime = 0.5;
            const coinCount = 20;
            const posOffset = 5;
            const timeOffset = 0.04;
            if (list1.length && list2.length) {
                for (var i = 0; i < list1.length; i++) {
                    var sv = list1[i][0];
                    var tv = list1[i][1];
                    var posStart = self.playerUI[sv].node.parent.position;
                    var posTo = self.playerUI[tv].node.parent.position;
                    for (var j = 0; j < coinCount; j++) {
                        var offsetT = Math.random() * timeOffset * 2 - timeOffset;
                        var offsetP = cc.v2(Math.random() * posOffset * 2 - posOffset, Math.random() * posOffset * 2 - posOffset);
                        var node = self.getCoin();
                        node.position = posStart;
                        var delay = (totalTime - flyTime) / coinCount * j + offsetT;
                        node.getComponent('nn_coin').setAction(delay, posTo.add(offsetP), flyTime, self.coinPool, null);
                    }
                    AudioManager.getInstance().playSound(nn_audio_cfg.COMMON.GoldFly, false);
                }
                for (var i = 0; i < list2.length; i++) {
                    var sv = list2[i][0];
                    var tv = list2[i][1];
                    var posStart = self.playerUI[sv].node.parent.position;
                    var posTo = self.playerUI[tv].node.parent.position;
                    for (var j = 0; j < coinCount; j++) {
                        var offsetT = Math.random() * timeOffset * 2 - timeOffset;
                        var offsetP = cc.v2(Math.random() * posOffset * 2 - posOffset, Math.random() * posOffset * 2 - posOffset);
                        var node = self.getCoin();
                        node.position = posStart;
                        var delay = totalTime + 0.1 + (totalTime - flyTime) / coinCount * j + offsetT;
                        var cb = null;
                        if (i == list2.length - 1 && j == coinCount - 1)
                            cb = play2ndAni;
                        node.getComponent('nn_coin').setAction(delay, posTo.add(offsetP), flyTime, self.coinPool, cb);
                    }
                    AudioManager.getInstance().playSound(nn_audio_cfg.COMMON.GoldFly, false);
                }
            }
            else if (list1.length) {
                for (var i = 0; i < list1.length; i++) {
                    var sv = list1[i][0];
                    var tv = list1[i][1];
                    var posStart = self.playerUI[sv].node.parent.position;
                    var posTo = self.playerUI[tv].node.parent.position;
                    for (var j = 0; j < coinCount; j++) {
                        var offsetT = Math.random() * timeOffset * 2 - timeOffset;
                        var offsetP = cc.v2(Math.random() * posOffset * 2 - posOffset, Math.random() * posOffset * 2 - posOffset);
                        var node = self.getCoin();
                        node.position = posStart;
                        var delay = (totalTime - flyTime) / coinCount * j + offsetT;
                        var cb = null;
                        if (i == list1.length - 1 && j == coinCount - 1)
                            cb = play2ndAni;
                        node.getComponent('nn_coin').setAction(delay, posTo.add(offsetP), flyTime, self.coinPool, cb);
                    }
                    AudioManager.getInstance().playSound(nn_audio_cfg.COMMON.GoldFly, false);
                }
            }
            else if (list2.length) {
                for (var i = 0; i < list2.length; i++) {
                    var sv = list2[i][0];
                    var tv = list2[i][1];
                    var posStart = self.playerUI[sv].node.parent.position;
                    var posTo = self.playerUI[tv].node.parent.position;
                    for (var j = 0; j < coinCount; j++) {
                        var offsetT = Math.random() * timeOffset * 2 - timeOffset;
                        var offsetP = cc.v2(Math.random() * posOffset * 2 - posOffset, Math.random() * posOffset * 2 - posOffset);
                        var node = self.getCoin();
                        node.position = posStart;
                        var delay = (totalTime - flyTime) / coinCount * j + offsetT;
                        var cb = null;
                        if (i == list2.length - 1 && j == coinCount - 1)
                            cb = play2ndAni;
                        node.getComponent('nn_coin').setAction(delay, posTo.add(offsetP), flyTime, self.coinPool, cb);
                    }
                    AudioManager.getInstance().playSound(nn_audio_cfg.COMMON.GoldFly, false);
                }
            }
            else {
                play2ndAni();
            }
        };
        var playFinished = function () {
            // result_node.getComponent(cc.Animation).off('finished', null);
            // next_node.active = true;

            // result_node.getComponent('nn_jiesuan_jbc').time.string = '15';
            // if (HallPropData.getInstance().getCoin() < nn_data.Instance().m_nUnderScore) {
            //     result_node.getComponent('nn_jiesuan_jbc').stopTime();
            //     cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_XIAOQIAN, function (ui) {
            //         var mj_huaqian = ui.getComponent("mj_huaqian");
            //         mj_huaqian.setEntermin(nn_data.Instance().m_nUnderScore);
            //     });
            // }
            // else {
            //     result_node.getComponent('nn_jiesuan_jbc').startTime();
            // }
        };
        var playCoinFly = function (event) {
            // cc.find('zi/win', result_node.parent).getComponent(cc.Animation).off('finished', playCoinFly);
            // //cc.find('zi/ani', result_node.parent).active = false;
            // cc.find('zi/lose', result_node.parent).getComponent(cc.Animation).off('finished', playCoinFly);
            // //cc.find('zi/ani2', result_node.parent).active = false;
            // if (bankerWin.length > 0) {
            //     for (var i = 0; i < bankerWin.length; i++) {
            //         cc.find('coin_fly/coin_fly_' + bankerWin[i] + '_' + bankerView, result_node.parent).getComponent(cc.Animation).off('finished');
            //         if (i == bankerWin.length - 1) {
            //             cc.find('coin_fly/coin_fly_' + bankerWin[i] + '_' + bankerView, result_node.parent).getComponent(cc.Animation).on('finished', play2ndCoinFly);
            //         }
            //         cc.find('coin_fly/coin_fly_' + bankerWin[i] + '_' + bankerView, result_node.parent).getComponent(cc.Animation).play();
            //         AudioManager.getInstance().playSound(nn_audio_cfg.COMMON.GoldFly, false);
            //     }
            // }
            // else {
            //     play2ndCoinFly();
            // }
            if (event) {
                event.target.off('finished', playCoinFly);
            }
            var list1 = [], list2 = [];
            for (var i = 0; i < bankerWin.length; i++) {
                var list = [bankerWin[i], bankerView];
                list1.push(list);
            }
            for (var i = 0; i < bankerLost.length; i++) {
                var list = [bankerView, bankerLost[i]];
                list2.push(list);
            }
            showCoinFly(list1, list2);
        };
        var play2ndCoinFly = function (event) {
            // if (event) {
            //     event.target.off('finished', null);
            // }
            // if (bankerLost.length > 0) {
            //     for (var i = 0; i < bankerLost.length; i++) {
            //         cc.find('coin_fly/coin_fly_' + bankerView + '_' + bankerLost[i], result_node.parent).getComponent(cc.Animation).off('finished');
            //         if (i == bankerLost.length - 1) {
            //             cc.find('coin_fly/coin_fly_' + bankerView + '_' + bankerLost[i], result_node.parent).getComponent(cc.Animation).on('finished', play2ndAni);
            //         }
            //         cc.find('coin_fly/coin_fly_' + bankerView + '_' + bankerLost[i], result_node.parent).getComponent(cc.Animation).play();
            //         AudioManager.getInstance().playSound(nn_audio_cfg.COMMON.GoldFly, false);
            //     }
            // }
            // else {
            //     play2ndAni();
            // }
        };
        var play2ndAni = function (event) {
            self._result_state = 'play_2nd_ani';
            if (event) {
                event.target.off('finished', null);
            }
            // result_node.getComponent(cc.Animation).off('finished', null);
            // result_node.getComponent(cc.Animation).on('finished', playFinished);
            RoomED.notifyEvent(RoomEvent.on_room_game_start, []);//刷新金币显示
            //result_node.getComponent(cc.Animation).play('result');
            for (var i = 0; i < list.length; i++) {
                if (nn_data.Instance().getPlayerById(list[i].userId).isWinner) {
                    var view = self.getView(list[i].userId);
                    cc.find('head_node/head_' + view, self.node).getChildByName('winner').active = true;
                    break;
                }
            }
            result_node.parent.getChildByName('head_node').getComponent(cc.Animation).on('finished', (event) => {
                event.target.off('finished', null);
                self._result_state = null;
            });
            result_node.parent.getChildByName('head_node').getComponent(cc.Animation).play('result');
            cc.find('next', lose_node.parent).active = true;
            // if (nn_data.Instance().curRound < RoomMgr.Instance()._Rule.circleNum) {
            //     cc.find('next', lose_node.parent).active = true;
            // }
            // else {
            //     cc.find('next', lose_node.parent).active = false;
            // }
        };
        if (self_wingold < 0) {//输
            if (bankerView == 0) {
                if (bankerLost.length > 1 && bankerWin.length == 0) {
                    AudioManager.getInstance().playSound(nn_audio_cfg.COMMON.AllLose, false);
                }
                else {
                    AudioManager.getInstance().playSound(nn_audio_cfg.COMMON.LOSE, false);
                }
            }
            else {
                AudioManager.getInstance().playSound(nn_audio_cfg.COMMON.LOSE, false);
            }
            cc.find('zi/lose', this.node).active = true;
            cc.find('zi/lose', this.node).getComponent(cc.Animation).off('finished', playCoinFly);
            cc.find('zi/lose', this.node).getComponent(cc.Animation).on('finished', playCoinFly);
            cc.find('zi/lose', this.node).getComponent(cc.Animation).play();
            self._result_state = 'play_zi_ani';
        }
        else {//赢
            if (bankerView == 0) {
                if (bankerLost.length == 0 && bankerWin.length > 1) {
                    AudioManager.getInstance().playSound(nn_audio_cfg.COMMON.AllWin, false);
                }
                else {
                    AudioManager.getInstance().playSound(nn_audio_cfg.COMMON.WIN, false);
                }
            }
            else {
                AudioManager.getInstance().playSound(nn_audio_cfg.COMMON.WIN, false);
            }
            cc.find('zi/win', this.node).active = true;
            cc.find('zi/win', this.node).getComponent(cc.Animation).off('finished', playCoinFly);
            cc.find('zi/win', this.node).getComponent(cc.Animation).on('finished', playCoinFly);
            cc.find('zi/win', this.node).getComponent(cc.Animation).play();
            self._result_state = 'play_zi_ani';
        }
    },

    /**
     * 战绩统计
     * @param {*} msg 
     */
    showResultTotal(msg) {
        var generateTimeStr = function (date) {
            var pad2 = function (n) { return n < 10 ? '0' + n : n };
            return date.getFullYear().toString() + '-' + pad2(date.getMonth() + 1) + '-' + pad2(date.getDate()) + '  ' + pad2(date.getHours()) + ':' + pad2(date.getMinutes()) + ':' + pad2(date.getSeconds());
        };
        nn_data.Instance().isEnd = true;
        var zjNode = cc.find('zhanjitongji', this.node);
        if (RoomMgr.Instance().isClubRoom()) {
            if (cc.find('multiple', zjNode)) {
                cc.find('multiple', zjNode).active = false;
                // cc.find('multiple', zjNode).getComponentInChildren(cc.Label).string = RoomMgr.Instance().multiple + '倍场';
            }
        }
        else {
            if (cc.find('multiple', zjNode))
                cc.find('multiple', zjNode).active = false;
        }
        var playoutNode = cc.find('player_layout', zjNode);
        var player_self = cc.find('userNode_self', zjNode);
        var player_other = cc.find('userNode_other', zjNode);
        var roomId = msg.roomNumber;
        var totalRound = msg.gameTimes;
        var strTime = generateTimeStr(new Date(msg.startTime * 1000));
        var strRule = '规则:' + this.getRuleString();
        cc.find('time/room_number', zjNode).getComponent(cc.Label).string = roomId.toString();
        cc.find('time/total_round', zjNode).getComponent(cc.Label).string = '共' + totalRound.toString() + '局';
        cc.find('time/time_lbl', zjNode).getComponent(cc.Label).string = strTime;
        cc.find('rule', zjNode).getComponent(cc.Label).string = strRule;
        var playList = msg.resultsList;
        var bigWinScore = 0;
        var selfIdx = -1;
        for (var i = 0; i < playList.length; i++) {
            if (playList[i].winGold > bigWinScore) {
                bigWinScore = playList[i].winGold;
            }
            if (playList[i].userId == cc.dd.user.id) {
                selfIdx = i;
            }
        }
        var layout_node = cc.find('scroll/view/player_layout', zjNode);
        layout_node.removeAllChildren();
        var setData = function (data) {
            var view = this.getView(data.userId);
            if (view == 0) {
                var newNode = cc.find('userNode_self', zjNode);
            }
            else {
                var newNode = cc.find('userNode_other', zjNode);
            }
            var pNode = cc.instantiate(newNode);
            var player = nn_data.Instance().getPlayerById(data.userId);
            var nick = cc.dd.Utils.substr(player.name, 0, 4);
            var headUrl = player.headUrl;
            var headsp = cc.find('headNode/head', pNode).getComponent(cc.Sprite);
            var score = data.winGold;
            // if (headUrl.indexOf('.jpg') != -1) {
            //     FortuneHallManager.getRobotIcon(headUrl, function (sprite) {
            //         headsp.spriteFrame = sprite;
            //     }.bind(this));
            // }
            // else {
            if (headUrl && headUrl != '') {
                cc.dd.SysTools.loadWxheadH5(headsp, headUrl);
            }
            //}
            cc.find('layout/userName', pNode).getComponent(cc.Label).string = nick;
            cc.find('layout/fangzhu', pNode).active = RoomMgr.Instance().isRoomer(data.userId);
            cc.find('ID', pNode).getComponent(cc.Label).string = data.userId.toString();
            data.winTimes = data.winTimes ? data.winTimes : 0;
            data.lostTimes = data.lostTimes ? data.lostTimes : 0;
            cc.find('winNum', pNode).getComponent(cc.Label).string = data.winTimes.toString();
            cc.find('loseNum', pNode).getComponent(cc.Label).string = data.lostTimes.toString();
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
        if (nn_data.Instance().isDissolved) {
            zjNode.active = true;
        }
        else {
            cc.find('result/taotai', this.node).active = true;
            cc.find('result/next', this.node).opacity = 0;
        }
        this.playerUI[0].autoRet(false);
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

    //更新玩家数量
    updateRoomPlayerNum() {
        if (!nn_data.Instance().isStart) {
            if (nn_data.Instance().getIsRoomFull()) {
                this.btn_invite.node.active = false;
                this.btn_friend_invite.active = this.btn_invite.node.active && RoomMgr.Instance().isClubRoom();
            }
            else {
                this.btn_invite.node.active = true;
                this.btn_friend_invite.active = this.btn_invite.node.active && RoomMgr.Instance().isClubRoom();
            }
        }
    },

    /**
     * 游戏状态改变
     * @param {Number} status 
     */
    updateStatus(status) {
        cc.log('房间状态改变:' + status);
        switch (status) {
            case 0://准备
                for (var i = 0; i < this.playerUI.length; i++) {
                    this.playerUI[i].win_gold.active = false;
                    this.playerUI[i].win_gold.opacity = 0;
                }
                break;
            case 1://抢庄
                for (var i = 0; i < this.playerUI.length; i++) {
                    this.playerUI[i].win_gold.active = false;
                    this.playerUI[i].win_gold.opacity = 0;
                }
                if (!nn_data.Instance().getPlayerById(cc.dd.user.id).isWatch) {
                    var timer = Remain_Timer.Bank;
                    if (RoomMgr.Instance()._Rule && RoomMgr.Instance()._Rule.tuoguan)
                        timer = RoomMgr.Instance()._Rule.tuoguan;
                    this.setTimer(timer);
                    this.playerUI[0].showOp(0);
                }
                break;
            case 2://加倍
                for (var i = 0; i < this.playerUI.length; i++) {
                    this.playerUI[i].win_gold.active = false;
                    this.playerUI[i].win_gold.opacity = 0;
                }
                if (!nn_data.Instance().getPlayerById(cc.dd.user.id).isWatch) {
                    var timer = Remain_Timer.Bet;
                    if (RoomMgr.Instance()._Rule && RoomMgr.Instance()._Rule.tuoguan)
                        timer = RoomMgr.Instance()._Rule.tuoguan;
                    this.setTimer(timer);
                    if (!nn_data.Instance().getPlayerById(cc.dd.user.id).isBanker)
                        this.playerUI[0].showOp(1);
                    else {
                        this.playerUI[0].showOp(2);
                    }
                }
                break;
            case 3://组牌
                // this.setTimer(Remain_Timer.Group);
                // this.playerUI[0].showOp(2);
                // this.playerUI[0].updateYouniuBtn();
                // for (var i = 1; i < this.playerUI.length; i++) {
                //     if (this.playerUI[i].zupai_armature) {
                //         this.playerUI[i].zupai_armature.node.active = true;
                //         this.playerUI[i].zupai_armature.playAnimation('zupaizhong', -1);
                //     }
                // }
                break;
        }
    },

    showAutoBet(event, custom) {
        var detail = cc.find('autobet/detail', this.node);
        var autoBet = nn_data.Instance().autoBet;
        var autoBank = nn_data.Instance().autoBank;
        switch (autoBank) {
            case 0://取消
                cc.find('bg/content/bank/no', detail).getComponent(cc.Toggle).isChecked = false;
                cc.find('bg/content/bank/yes', detail).getComponent(cc.Toggle).isChecked = false;
                break;
            case 1:
                cc.find('bg/content/bank/no', detail).getComponent(cc.Toggle).isChecked = true;
                cc.find('bg/content/bank/yes', detail).getComponent(cc.Toggle).isChecked = false;
                break;
            case 2:
                cc.find('bg/content/bank/no', detail).getComponent(cc.Toggle).isChecked = false;
                cc.find('bg/content/bank/yes', detail).getComponent(cc.Toggle).isChecked = true;
                break;
        }
        switch (autoBet) {
            case 0://取消
                cc.find('bg/content/bet/no', detail).getComponent(cc.Toggle).isChecked = false;
                cc.find('bg/content/bet/yes', detail).getComponent(cc.Toggle).isChecked = false;
                break;
            case 1:
                cc.find('bg/content/bet/no', detail).getComponent(cc.Toggle).isChecked = true;
                cc.find('bg/content/bet/yes', detail).getComponent(cc.Toggle).isChecked = false;
                break;
            case 2:
                cc.find('bg/content/bet/no', detail).getComponent(cc.Toggle).isChecked = false;
                cc.find('bg/content/bet/yes', detail).getComponent(cc.Toggle).isChecked = true;
                break;
        }
        cc.find('autobet/detail', this.node).active = true;
    },

    closeAutoBet(event, custom) {
        cc.find('autobet/detail', this.node).active = false;
    },

    autobetOK(event, custom) {
        var autoBet = 0;
        var autoBank = 0;
        var detail = cc.find('autobet/detail', this.node);
        if (cc.find('bg/content/bank/no', detail).getComponent(cc.Toggle).isChecked) {
            autoBank = 1;
        }
        else if (cc.find('bg/content/bank/yes', detail).getComponent(cc.Toggle).isChecked) {
            autoBank = 2;
        }
        if (cc.find('bg/content/bet/no', detail).getComponent(cc.Toggle).isChecked) {
            autoBet = 1;
        }
        else if (cc.find('bg/content/bet/yes', detail).getComponent(cc.Toggle).isChecked) {
            autoBet = 2;
        }
        nn_send_msg.autobet(autoBank, autoBet);
        this.closeAutoBet();
    },

    autobetReset(event, custom) {
        var detail = cc.find('autobet/detail', this.node);
        cc.find('bg/content/bank/no', detail).getComponent(cc.Toggle).isChecked = false;
        cc.find('bg/content/bank/yes', detail).getComponent(cc.Toggle).isChecked = false;
        cc.find('bg/content/bet/no', detail).getComponent(cc.Toggle).isChecked = false;
        cc.find('bg/content/bet/yes', detail).getComponent(cc.Toggle).isChecked = false;
        nn_send_msg.autobet(0, 0);
        this.closeAutoBet();
    },

    initAutobetButton() {
        var autoBet = nn_data.Instance().autoBet;
        var autoBank = nn_data.Instance().autoBank;
        if (autoBet == 0 && autoBank == 0) {
            cc.find('autobet/btn_ok', this.node).active = true;
            cc.find('autobet/btn_ing', this.node).active = false;
        }
        else {
            cc.find('autobet/btn_ok', this.node).active = false;
            cc.find('autobet/btn_ing', this.node).active = true;
        }
    },

    autobetToggle(target, custom) {
        var detail = cc.find('autobet/detail', this.node);
        var bankno = cc.find('bg/content/bank/no', detail).getComponent(cc.Toggle);
        var bankyes = cc.find('bg/content/bank/yes', detail).getComponent(cc.Toggle);
        var betno = cc.find('bg/content/bet/no', detail).getComponent(cc.Toggle);
        var betyes = cc.find('bg/content/bet/yes', detail).getComponent(cc.Toggle);
        if (target.isChecked) {
            switch (custom) {
                case 'bankno':
                case 'bankyes':
                    if (!betno.isChecked && !betyes.isChecked)
                        betno.isChecked = true;
                    break;
                case 'betno':
                case 'betyes':
                    if (!bankno.isChecked && !bankyes.isChecked)
                        bankno.isChecked = true;
                    break;
            }
        }
        else {
            switch (custom) {
                case 'bankno':
                case 'bankyes':
                    betno.isChecked = false;
                    betyes.isChecked = false;
                    break;
                case 'betno':
                case 'betyes':
                    bankno.isChecked = false;
                    bankyes.isChecked = false;
                    break;
            }
        }
    },

    playerAuto(msg) {
        var userId = msg.userId;
        var isAuto = msg.isAuto;
        var view = this.getView(userId);
        this.playerUI[view].autoRet(isAuto);
    },
});
