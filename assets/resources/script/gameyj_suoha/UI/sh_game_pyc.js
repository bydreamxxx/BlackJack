/**
 * Created by luke on 2019/1/10
 */
let hall_audio_mgr = require('hall_audio_mgr').Instance();
let AudioManager = require('AudioManager');
let jlmj_prefab = require('jlmj_prefab_cfg');
let sh_audio_cfg = require('sh_audio_cfg');
let RoomMgr = require('jlmj_room_mgr').RoomMgr;
let RoomED = require("jlmj_room_mgr").RoomED;
let RoomEvent = require("jlmj_room_mgr").RoomEvent;
let sh_Data = require('sh_data').sh_Data;
let SH_Event = require('sh_data').SH_Event;
let AppCfg = require('AppConfig');
let Platform = require('Platform');
var chipList = [1, 5, 10, 50, 100];
const maxScoreConvert = [0, 50, 100, 200, 300, 400, 500, 100000000];
const dissolveUI = 'gameyj_suoha/prefab/sh_dissolve';
const OP_TYPE = {
    discard: 0x0001,        //弃牌
    pass: 0x0002,           //过
    showhand: 0x0004,       //梭哈
    add: 0x0008,            //加注
    follow: 0x0010,         //跟注
    opencard: 0x0020,       //开牌
    GAME: 0xFFFF,           //游戏操作
    RESULT: 0x0000,         //结算操作
    EXCHANGE: 0xEEEE,       //换桌操作
};
cc.Class({
    extends: require('sh_game_jbc'),

    properties: {

    },

    onLoad() {
        sh_Data.Instance().isFriend = true;
        var Rule = RoomMgr.Instance()._Rule;
        if (Rule.maxScore == 7) {
            sh_Data.Instance().isFriendGold = true;
            sh_Data.Instance().m_nBaseScore = 100;
            chipList = [100, 1000, 10000, 100000, 10000000];
            cc.find('op/game/bar/touch', this.node).active = true;
        }
        else {
            chipList = [1, 5, 10, 50, 100];
            sh_Data.Instance().m_nBaseScore = 1;
        }
        this._super();
        this.btn_invite = cc.find('layout_ready_invite/btn_invite', this.node).getComponent(cc.Button);
        this.btn_friend_invite = cc.find('klb_friend_group_invite_btn', this.node);
        this.btn_jixu = cc.find('layout_ready_invite/btn_jixu', this.node).getComponent(cc.Button);
        this.btn_ready = cc.find('layout_ready_invite/btn_ready', this.node).getComponent(cc.Button);
        this.btn_start = cc.find('layout_ready_invite/btn_start', this.node).getComponent(cc.Button);
        this.room_num = cc.find('room_info/room/room_num', this.node).getComponent(cc.Label);
        this.cur_ju = cc.find('room_info/round/cur_round', this.node).getComponent(cc.Label);
        this.zong_ju = cc.find('room_info/round/room_num', this.node).getComponent(cc.Label);

        this.initRoomInfo();
        this.initInviteButton();
        this.schedule(this.sendLocationInfo, 30);//发送位置信息

        if (!RoomMgr.Instance().isClubRoom())
            this.btn_friend_invite.active = false;
    },

    //播放筹码动画
    playChips(view, add) {
        let chips = [];//筹码列表(贪心法)
        for (var i = chipList.length - 1; i > -1 && add > 0; i--) {
            if (add >= chipList[i]) {
                var num = Math.floor(add / chipList[i]);
                for (var j = 0; j < num; j++) {
                    chips.push(chipList[i]);
                }
                add -= num * chipList[i];
            }
        }
        for (var i = chips.length - 1; i > -1; i--) {
            this.singleBet(view, chips[i]);
        }
        if (chips.length > 0) {
            if (chips.length > 5)
                AudioManager.getInstance().playSound(sh_audio_cfg.Chip_HE, false);
            else
                AudioManager.getInstance().playSound(sh_audio_cfg.Chip, false);
        }
    },

    //补齐筹码
    resumeChips(add, isClear) {
        var betArea = cc.find('bet_area', this.node);
        if (isClear) {
            for (var i = betArea.children.length - 1; i > -1; i--) {
                this._chipPool.put(betArea.children[i]);
            }
        }
        let chips = [];//筹码列表(贪心法)
        for (var i = chipList.length - 1; i > -1 && add > 0; i--) {
            if (add >= chipList[i]) {
                var num = Math.floor(add / chipList[i]);
                for (var j = 0; j < num; j++) {
                    chips.push(chipList[i]);
                }
                add -= num * chipList[i];
            }
        }
        for (var i = 0; i < chips.length; i++) {
            const chipWidth = 34;
            var endpos = cc.v2(-betArea.width / 2 + chipWidth + Math.random() * (betArea.width - 2 * chipWidth), -betArea.height / 2 + chipWidth + Math.random() * (betArea.height - 2 * chipWidth));
            let node = this.getChipNode();
            node.tagname = chips[i];
            let sp = node.getComponent(cc.Sprite);
            sp.enabled = true;
            var idx = chipList.indexOf(chips[i]);
            if (idx != -1)
                sp.spriteFrame = this.chip_splist[idx];
            sp.getComponentInChildren(cc.Label).string = this.getChipStr(chips[i]);
            betArea.addChild(node);
            node.setPosition(endpos);
        }
    },

    //单个筹码飞出
    singleBet(view, value) {
        var idx = chipList.indexOf(value);
        if (idx != -1) {
            var betArea = cc.find('bet_area', this.node);
            var startpos = this.head_list[view].node.convertToWorldSpaceAR(cc.v2(0, 0)).sub(betArea.convertToWorldSpaceAR(cc.v2(0, 0)));
            const chipWidth = 34;
            var endpos = cc.v2(-betArea.width / 2 + chipWidth + Math.random() * (betArea.width - 2 * chipWidth), -betArea.height / 2 + chipWidth + Math.random() * (betArea.height - 2 * chipWidth));
            let node = this.getChipNode();
            node.tagname = value;
            let sp = node.getComponent(cc.Sprite);
            sp.enabled = false;
            sp.spriteFrame = this.chip_splist[idx];
            sp.getComponentInChildren(cc.Label).string = this.getChipStr(value);
            node.getComponent('sh_chip').fly(startpos, endpos, betArea);
        }
    },

    getChipStr(value) {
        if (value < 1000)
            return value.toString();
        else if (value < 10000)
            return value / 1000 + '千';
        else if (value < 1000000)
            return value / 10000 + '万';
        else if (value < 10000000)
            return value / 1000000 + '百万';
        else if (value < 100000000)
            return value / 10000000 + '千万';
        else
            return value / 100000000 + '亿';
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

    //弃牌
    onDiscard(data) {
        let userId = data.userId;
        cc.find('add', this.node).active = false;
        let view = sh_Data.Instance().getViewById(userId);
        if (view == 0) this.sh_op.hideOp();
        this.head_list[view].node.getComponentInChildren('sh_timer').setActive(false);
        for (var i = 0; i < 5; i++) {
            var node = cc.find('card/card' + i, this.head_list[view].node);
            node.getComponent('sh_card').updateMoveCard();
        }
        this.head_list[view].showDiscard(true);
        this.allStopSay();
        this.head_list[view].say('弃牌');
        if (sh_Data.Instance().getPlayerById(userId).sex == 1)
            AudioManager.getInstance().playSound(sh_audio_cfg.MAN.Discard, false);
        else
            AudioManager.getInstance().playSound(sh_audio_cfg.WOMAN.Discard, false);
        this.updateDeskScore();
    },

    /**
     * 初始化房间信息
     */
    initRoomInfo() {
        var Rule = RoomMgr.Instance()._Rule;
        this.room_num.string = RoomMgr.Instance().roomId.toString();
        this.zong_ju.string = '/' + Rule.circleNum.toString() + '局';
        var detailNode = cc.find('room_info/detail', this.node);
        cc.find('info/rule_2', this.node).getComponent(cc.Label).string = this.getRuleString();
        cc.find('room_num/lbl', detailNode).getComponent(cc.Label).string = RoomMgr.Instance().roomId.toString();
        cc.find('round_num/lbl', detailNode).getComponent(cc.Label).string = Rule.circleNum.toString();
        cc.find('renshu/lbl', detailNode).getComponent(cc.Label).string = Rule.playerNum + '人';
        cc.find('fengding/lbl', detailNode).getComponent(cc.Label).string = maxScoreConvert[Rule.maxScore].toString();
        cc.find('layout/chaoshi', detailNode).active = Rule.giveUp;
        cc.find('layout/liangdi', detailNode).active = Rule.showCard;
        cc.find('layout/voice', detailNode).active = Rule.limitTalk;
        cc.find('layout/gps', detailNode).active = Rule.gps;

        //玩法名称+人数+圈数+封顶+缺几人
        if (this.btn_friend_invite) {
            let rule = '港式五张' + ' ' + Rule.circleNum.toString() + '局';
            this.btn_friend_invite.getComponent('klb_friend_group_invite_btn').setInfo(RoomMgr.Instance().roomId, rule);
        }

        this.schedule(this.switchTimeRound, 10);
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

    /**
     * 邀请微信好友
     */
    onInvite(event, custom) {
        if (event.type != "touchend") {
            return;
        }
        hall_audio_mgr.com_btn_click();
        var title = "房间号:" + RoomMgr.Instance().roomId + '\n';
        var str = this.getRuleString();
        if (cc.sys.isNative) {
            // cc.dd.native_wx.SendAppContent(RoomMgr.Instance().roomId, '【港式五张】', title + str, Platform.GetAppUrl(AppCfg.GAME_PID, AppCfg.PID));
            let wanFa = [];
            var rules = RoomMgr.Instance()._Rule;
            wanFa.push(rules.playerNum + '人房');
            wanFa.push('共' + rules.circleNum + '局');
            wanFa.push(maxScoreConvert[rules.maxScore] + '封顶');

            if (rules.giveUp) {
                wanFa.push('超时弃牌');
            }
            if (rules.showCard) {
                wanFa.push('亮底牌');
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

            let playerList = sh_Data.Instance().playerList;
            let playerName = [];
            playerList.forEach(function (playerMsg) {
                if (playerMsg && playerMsg.userId) {
                    playerName.push(playerMsg.name);
                }
            }, this);

            let info = {
                gameid: RoomMgr.Instance().gameId,//游戏ID
                roomid: RoomMgr.Instance().roomId,//房间号
                title: "港式五张",//房间名称
                content: wanFa,//游戏规则数组
                usercount: rules.playerNum,//人数
                jushu: rules.circleNum,//局\圈数
                jushutitle: '局数',//局\圈标题，默认局数
                playername: playerName,//玩家姓名数组
                gamestate: '未开始',//游戏状态
            }
            if (custom == 'xianliao') {
                var login_module = require('LoginModule');
                var url = Platform.shareGameUrl + '?channel=' + (cc.dd.user.regChannel * 100 + login_module.Instance().loginType % 100);
                cc.dd.native_wx.sendXlLink('【港式五张】', title + str, url);
            }
            else
                cc.dd.native_wx.SendAppInvite(info, '【港式五张】', title + str, Platform.wxShareGameUrl[AppCfg.PID]);
        }
        cc.log("邀请好友：", str);
    },

    /**
     * 邀请好友按钮初始化
     */
    initInviteButton: function () {
        if (sh_Data.Instance().isGaming) {
            this.btn_invite.parent.node.active = false;
            this.btn_friend_invite.active = false;
            return;
        }
        var maxPlayerNum = RoomMgr.Instance()._Rule.playerNum;
        if (sh_Data.Instance().getIsRoomFull(maxPlayerNum)) {
            this.btn_invite.node.active = false;
            this.btn_friend_invite.active = this.btn_invite.node.active && RoomMgr.Instance().isClubRoom();
        }
        var isRoomer = RoomMgr.Instance().isRoomer(cc.dd.user.id);
        this.btn_start.node.active = isRoomer;
        this.btn_ready.node.active = !isRoomer;
        if (sh_Data.Instance().getPlayerById(cc.dd.user.id).bready)
            this.btn_ready.node.active = false;
    },

    getRuleString() {
        var str = '';
        var rules = RoomMgr.Instance()._Rule;
        str += rules.playerNum + '人房';
        str += '  共' + rules.circleNum + '局';
        str += '  ' + maxScoreConvert[rules.maxScore] + '封顶';

        if (rules.giveUp) {
            str += ' 超时弃牌';
        }
        if (rules.showCard) {
            str += ' 亮底牌';
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
     * 游戏开始
    */
    gameStart() {
        this.btn_invite.node.parent.active = false;
        this.btn_friend_invite.active = false;
        this.room_num.node.parent.active = false;
        let curRound = sh_Data.Instance().curRound || 0;
        this.cur_ju.string = curRound.toString();
    },

    /**
     * 继续
     */
    onNextGame(event, custom) {
        hall_audio_mgr.com_btn_click();
        const req = new cc.pb.room_mgr.room_prepare_req();
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_room_prepare_req, req,
            'room_prepare_req', 'no');
    },

    //亮牌
    onShowCard(msg) {
        var showCard = RoomMgr.Instance()._Rule.showCard;
        if (showCard) {
            for (var i = 0; i < 5; i++) {
                var player = sh_Data.Instance().getPlayerByViewIdx(i);
                if (player) {
                    var cardnode = cc.find('card', this.head_list[i].node);
                    for (var j = 0; j < player.cardsList.length; j++) {
                        this.setPokerBack(cardnode.children[j], player.cardsList[j]);
                    }
                    cc.find('discard', this.head_list[i].node).active = false;
                    if (player.cardsList.length == 5 && player.cardtype != 0)
                        if (i == this._winView) {
                            this.head_list[i].showCardType(this.type_splist[player.cardtype - 1]);
                            var winplayer = sh_Data.Instance().getPlayerByViewIdx(i);
                            if (winplayer.cardtype > 0 && winplayer.cardsList.length == 5) {//开了牌
                                cc.find('win/card_di', this.head_list[i].node).active = true;
                                cc.find('win/card_di', this.head_list[i].node).getComponent(sp.Skeleton).clearTracks();
                                cc.find('win/card_di', this.head_list[i].node).getComponent(sp.Skeleton).setAnimation(0, '5', true);
                            }
                        }
                        else
                            this.head_list[i].showCardType(this.type_splist_gray[player.cardtype - 1]);
                    else
                        this.head_list[i].showDipai();
                }
            }
        }
        else {
            for (var i = 0; i < 5; i++) {
                var player = sh_Data.Instance().getPlayerByViewIdx(i);
                if (player && !player.isDiscard) {
                    var cardnode = cc.find('card', this.head_list[i].node);
                    for (var j = 0; j < player.cardsList.length; j++) {
                        this.setPokerBack(cardnode.children[j], player.cardsList[j]);
                    }
                    if (i == this._winView) {
                        this.head_list[i].showCardType(this.type_splist[player.cardtype - 1]);
                        var winplayer = sh_Data.Instance().getPlayerByViewIdx(i);
                        if (winplayer.cardtype > 0 && winplayer.cardsList.length == 5) {//开了牌
                            cc.find('win/card_di', this.head_list[i].node).active = true;
                            cc.find('win/card_di', this.head_list[i].node).getComponent(sp.Skeleton).clearTracks();
                            cc.find('win/card_di', this.head_list[i].node).getComponent(sp.Skeleton).setAnimation(0, '5', true);
                        }
                    }
                    else
                        this.head_list[i].showCardType(this.type_splist_gray[player.cardtype - 1]);
                }
            }
        }
    },

    //战绩统计
    showResultTotal(msg) {
        this._totalResult = true;
        var generateTimeStr = function (date) {
            var pad2 = function (n) { return n < 10 ? '0' + n : n };
            return date.getFullYear().toString() + '-' + pad2(date.getMonth() + 1) + '-' + pad2(date.getDate()) + '  ' + pad2(date.getHours()) + ':' + pad2(date.getMinutes()) + ':' + pad2(date.getSeconds());
        };
        sh_Data.Instance().isEnd = true;
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
        var layout_node = cc.find('player_layout', zjNode);
        layout_node.removeAllChildren();
        var setData = function (data) {
            var view = sh_Data.Instance().getViewById(data.userId);
            if (view == 0) {
                var newNode = cc.find('userNode_self', zjNode);
            }
            else {
                var newNode = cc.find('userNode_other', zjNode);
            }
            var pNode = cc.instantiate(newNode);
            var player = sh_Data.Instance().getPlayerById(data.userId);
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
        if (sh_Data.Instance().isDissolved) {
            zjNode.active = true;
        }
        else {
            this.sh_op.hideOp();
            cc.find('zhanji_btn', this.node).active = true;
        }
    },

    /**
     * 战绩按钮点击
     */
    onZhanji(event, data) {
        hall_audio_mgr.com_btn_click();
        if (data == 'show') {
            cc.find('zhanjitongji', this.node).active = true;
        }
        else {
            cc.find('zhanjitongji', this.node).active = false;
            this.backToHall();
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
    },

    //退出
    onExit() {
        hall_audio_mgr.com_btn_click();
        var content = "";
        var callfunc = null;
        //已经结束
        if (sh_Data.Instance().isEnd == true) {
            this.backToHall();
            return;
        }
        // 已经开始
        if (sh_Data.Instance().isGaming == true) {
            content = cc.dd.Text.TEXT_LEAVE_ROOM_2;
            callfunc = this.dissolveEnsure.bind(this);
        }
        else {
            if (RoomMgr.Instance().isRoomer(cc.dd.user.id)) {
                content = cc.dd.Text.TEXT_LEAVE_ROOM_1;
                callfunc = this.sendLeaveRoom;
            } else {
                content = cc.dd.Text.TEXT_LEAVE_ROOM_3;
                callfunc = this.sendLeaveRoom;
            }
        }
        cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_TANCHUANG, function (ui) {
            ui.getComponent("jlmj_popup_view").show(content, callfunc, 1);
        }.bind(this));
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
        const req = new cc.pb.room_mgr.room_dissolve_agree_req();
        req.setIsAgree(isAgree);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_room_dissolve_agree_req, req,
            'room_dissolve_agree_req', 'no');
    },

    /**
     * 显示解散
     * @param {*} msg 
     */
    showDissolve(msg) {
        cc.dd.UIMgr.closeUI(jlmj_prefab.JLMJ_TANCHUANG);
        var UI = cc.dd.UIMgr.getUI(dissolveUI);
        if (UI) {
            UI.getComponent('sh_dissolve').setData(msg);
        }
        else {
            cc.dd.UIMgr.openUI(dissolveUI, function (ui) {
                var timeout = 30;
                var playerList = sh_Data.Instance().playerList;
                ui.getComponent('sh_dissolve').setStartData(timeout, playerList, msg);
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
                var playerList = sh_Data.Instance().playerList;
                for (var i = 0; i < msglist.length; i++) {
                    if (i == 0) {
                        ui.getComponent('sh_dissolve').setStartData(time, playerList, msglist[i]);
                    }
                    else {
                        ui.getComponent('sh_dissolve').setData(msglist[i]);
                    }
                }
            })
        }
        else {
            for (var i = 0; i < msglist.length; i++) {
                UI.getComponent('sh_dissolve').time = time;
                UI.getComponent('sh_dissolve').setData(msglist[i]);
            }
        }
    },

    /**
     * 解散结果
     * @param {*} msg 
     */
    showDissolveResult(msg) {
        var isDissolve = msg.isDissolve;
        sh_Data.Instance().isDissolved = isDissolve;
        if (isDissolve == true) {
            sh_Data.Instance().isEnd = true;
            cc.dd.PromptBoxUtil.show('房间解散成功!');
        }
        else {
            cc.dd.PromptBoxUtil.show('房间解散失败!');
        }
        cc.dd.UIMgr.destroyUI(dissolveUI);
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

    //显示准备
    showReadys(show) {
        show = !!show;
        for (var i = 0; i < this.head_list.length; i++) {
            this.head_list[i].ready.active = show;
        }
    },

    //事件处理
    onEventMessage(event, data) {
        this._super(event, data);
        switch (event) {
            case RoomEvent.on_room_ready:
                if (data[0].userId == cc.dd.user.id) {
                    this.btn_ready.node.active = false;
                }
                break;
            case SH_Event.PLAYER_JOIN:
            case SH_Event.PLAYER_EXIT:
                this.updateRoomPlayerNum();
                break;
            case SH_Event.DISSOLVE:
                this.showDissolve(data);
                break;
            case SH_Event.DISSOLVE_RESULT:
                this.showDissolveResult(data);
                break;
            case SH_Event.TOTAL_RESULT:
                this.showResultTotal(data);
                break;
            case SH_Event.FRIEND_READY:
                if (data == cc.dd.user.id)
                    this.sh_op.hideOp();
                break;
        }
    },

    //重连
    onReconnect(msg) {
        RoomED.notifyEvent(RoomEvent.on_room_game_start, []);
        this.resetGameUI();
        this._super(msg);
        this.gameStart();
        switch (sh_Data.Instance().roomStatus) {
            case 0:
            case 9:
                var playerList = sh_Data.Instance().playerList;
                for (var i = 0; i < playerList.length; i++) {
                    playerList[i].bready = playerList[i].state == 1;
                }
                RoomED.notifyEvent(RoomEvent.on_room_game_start, []);
                if (!sh_Data.Instance().getPlayerById(cc.dd.user.id).bready)
                    this.sh_op.showOp(OP_TYPE.RESULT);
                else
                    this.sh_op.hideOp();
                break;
        }
        var dissolve_data = msg.agreesList;
        if (dissolve_data && dissolve_data.length) {
            var distime = dissolve_data[0].time;
            this.showDissolveList(dissolve_data, distime);
        }
    },

    //更新玩家数量
    updateRoomPlayerNum() {
        if (!sh_Data.Instance().isGaming) {
            var maxPlayerNum = RoomMgr.Instance()._Rule.playerNum;
            if (sh_Data.Instance().getIsRoomFull(maxPlayerNum)) {
                this.btn_invite.node.active = false;
                this.btn_friend_invite.active = this.btn_invite.node.active && RoomMgr.Instance().isClubRoom();
            }
            else {
                this.btn_invite.node.active = true;
                this.btn_friend_invite.active = this.btn_invite.node.active && RoomMgr.Instance().isClubRoom();
            }
        }
    },

    //点击桌面bg
    onBgClick() {
        if (cc.find('room_info/detail', this.node).active == true) {
            cc.find('room_info/detail', this.node).active = false;
        }
    },

    playerLeave(data) {
        if (data.userId == cc.dd.user.id) {
            if (data.coinRetCode) {
                var str = '';
                switch (data.coinRetCode) {
                    case 1:
                        str = '您的金币小于此房间最低金币限制';
                        break;
                    case 2:
                        str = '您的金币超过房间最高携带金币';
                        break;
                    case 3:
                        str = '由于长时间未操作，您已离开游戏';
                        break;
                    case 4:
                        str = '当前禁止该游戏，请联系管理员';
                        break;
                }
                var func = function () {
                    this.backToHall();
                }.bind(this);
                cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_TANCHUANG, function (ui) {
                    ui.getComponent("jlmj_popup_view").show(str, func, 2);
                }.bind(this));
            }
            else {
                this.backToHall();
            }
        }
        else {
            if (data.userId == RoomMgr.Instance().roomerId) {
                cc.dd.DialogBoxUtil.show(0, "房主已解散房间,请重新加入房间", '确定', null, function () {
                    cc.dd.SceneManager.enterHall();
                }, function () {
                });
            }
        }
    },

    backToHall() {
        cc.dd.SceneManager.enterHall();
    }
});
