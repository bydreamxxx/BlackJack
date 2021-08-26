// create by wj 2018/2/1
var dd = cc.dd;
var tdk = dd.tdk;
var tdk_am = require("tdk_audio_manager").Instance();

var DeskData = require('tdk_coin_desk_data').TdkCDeskData;
var TdkCPlayerData = require('tdk_coin_player_data').TdkCPlayerMgrData;
var AudioManager = require('AudioManager');
var WxED = require("com_wx_data").WxED;
var WxEvent = require("com_wx_data").WxEvent;
var WxData = require("com_wx_data").WxData.Instance();

var ChatEd = require('jlmj_chat_data').ChatEd;
var ChatEvent = require('jlmj_chat_data').ChatEvent;
var GetQuickMsgCfgByID = require('jlmj_ChatCfg').GetQuickMsgCfgByID;

const RecordEd = require('AudioChat').RecordEd;
const RecordEvent = require('AudioChat').RecordEvent;
var PropAudioCfg = require('jlmj_ChatCfg').PropAudioCfg;
var QuickMusicPath = require('jlmj_ChatCfg').QuickMusicPath;
var magicIcons = ['hua', 'feiwen', 'jidan', 'zadan', 'fanqie', 'jiubei', 'ji'];
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var gameType = require('Define').GameType;
var tdkSeed = require('jlmj_net_msg_sender_tdk');
var chat_duanyu_item = require('chat_duanyu_item');

cc.Class({
    extends: cc.Component,

    properties: {
        //玩家基础信息
        seatId: cc.Integer,
        userId: null,
        headUrl: null,
        nick: null,
        bet: null,

        nickLabel: cc.Label,
        betLabel: cc.Label,
        http_url_img: cc.Sprite,

        duanyu_node: { default: null, type: cc.Node, tooltip: '短语节点', },  //短语节点
        duanyu_arrow: { default: null, type: cc.Node, tooltip: '短语箭头', },  //短语箭头
        duanyu_label: { default: null, type: cc.Label, tooltip: '短语文本', },  //短语文本
        last_duanyu_audio_id: -1,

        biaoqing: { default: null, type: cc.Animation, tooltip: '表情组件', }, //表情
        yuyin_laba: { default: null, type: require('jlmj_yuyin_laba'), tooltip: '语音组件', }, //语音

        magic_prop_layer: { default: null, type: cc.Node, tooltip: '魔法道具层', },  //魔法道具层
        magic_prop: { default: null, type: cc.Animation, tooltip: '魔法道具', },  //魔法道具

        tdkTimeNode: { default: null, type: cc.Node, tooltip: '倒计时', },
        tuoguanode: { default: null, type: cc.Node, tooltip: '托管', },
        pokerStartnode: { default: null, type: cc.Node, tooltip: '发牌点', },
        pokerNode: cc.Node,
        playerNode: cc.Node,
        readyNode: cc.Node,
        foldNode: cc.Node,
        chipInfoNode: cc.Node,
        pokerScoreNode: cc.Node,
        ChipPrefab: { default: null, type: cc.Prefab, tooltip: '筹码预设体', },
        PRE_COUNTDOWN_V2_Prefab: { default: null, type: cc.Prefab, tooltip: '倒计时条', },
        PRE_COUNTDOWN_Prefab: { default: null, type: cc.Prefab, tooltip: '倒计时条', },
        Ats_Chips: { default: null, type: cc.SpriteAtlas, tooltip: '筹码图集', },

        pokerNum_list: [], //纸牌点数数组

        chip_list: [], //游戏中玩家下注的筹码实列
        chipType_list: [], //筹码规格类型
        costChipData_list: [], //本轮需要消耗的筹码数据

        sexIdx: 0,
        costChip: 0,
        danChip: 0,

        /**
         * 是否可以有效点击头像
         */
        isVaildClickPlayer: true,

        /**
         * 是否为替代玩家
         */
        isReplacePlayer: false,
    },
    onLoad: function () {
        WxED.addObserver(this);
        ChatEd.addObserver(this);
        RecordEd.addObserver(this);

        this.magicIcons = [];
        this.magic_prop.node.active = false;
        this.duanyu_node.active = false;
        //this.duanyu_arrow.active = false;
        this.biaoqing.node.active = false;
        this.yuyin_laba.node.active = false;
        this.pokerNode.active = false;

        if (this.sex == 1) {
            this.sexIdx = 0;
        } else if (this.sex == 2) {
            this.sexIdx = 1;
        }
        this.initData();
        this.Pokertoun = cc.find('toun', this.node);
        if (this.Pokertoun) {
            this.Pokertoun.on(cc.Node.EventType.TOUCH_START, this.pokertouchStart.bind(this));
            this.Pokertoun.on(cc.Node.EventType.TOUCH_END, this.pokertouchEnd.bind(this));
            this.Pokertoun.on(cc.Node.EventType.TOUCH_CANCEL, this.pokertouchEnd.bind(this));
        }
        this.hiddenTimeNode();
        this.showTuoguan(false);
    },

    /**
     * 初始化界面
     */
    initHeadUI: function () {
        // if (this.headUrl) {
            cc.dd.SysTools.loadWxheadH5(this.http_url_img, this.headUrl);
        // }
        //头像框分数
        this.pokerScoreNode.active = false;
    },

    onDestroy: function () {
        WxED.removeObserver(this);
        ChatEd.removeObserver(this);
        RecordEd.removeObserver(this);
        DeskData.Destroy();
        TdkCPlayerData.Destroy();
    },

    refreshChip: function () {
        this.createChipPool();
        var dizhu = DeskData.Instance().dizhu ? DeskData.Instance().dizhu : 1;
        this.chipType_list.push(
            [
                { type: dizhu * 5, index: 4, color: cc.color(44, 1, 63) },
                { type: dizhu * 2, index: 3, color: cc.color(21, 81, 77) },
                { type: dizhu * 1, index: 2, color: cc.color(8, 65, 19) }
            ],
            [
                { type: dizhu * 5, index: 5, color: cc.color(58, 13, 80) },
                { type: dizhu * 2, index: 4, color: cc.color(44, 1, 63) },
                { type: dizhu * 1, index: 3, color: cc.color(21, 81, 77) }
            ],
            [
                { type: dizhu * 5, index: 6, color: cc.color(76, 70, 14) },
                { type: dizhu * 2, index: 5, color: cc.color(58, 13, 80) },
                { type: dizhu * 1, index: 4, color: cc.color(44, 1, 63) }
            ],
            [
                { type: dizhu * 5, index: 7, color: cc.color(158, 42, 41) },
                { type: dizhu * 2, index: 6, color: cc.color(76, 70, 14) },
                { type: dizhu * 1, index: 5, color: cc.color(58, 13, 80) }
            ],
        );
    },

    initData: function () {
        this.chipAreaName = 'Canvas/tdk_coin_room/chipArea';
        this.pokerStartNode = cc.find('Canvas/tdk_coin_room/pokerNode');

        //初始化玩家基础信息
        this.nickLabel.string = cc.dd.Utils.substr(this.nick, 0, 4);
        this.playerscore = this.bet;

        this.betLabel.string = this.CoinchangNumToCHN(this.playerscore);

        this.poker_list = new Array(6);
        var index = this.checkPokerMore() ? 2 : 1;
        var poker = cc.find(('Poker_' + index), this.pokerNode);
        //var poker = cc.find(('Poker_1'), this.pokerNode);
        this.startPosx = poker.x;
        this.selfPokerScale = 0.65; //自己手牌縮放系數
        this.otherPokerScale = 0.65; //其他玩家手牌縮放系數
        if (RoomMgr.Instance()._Rule && RoomMgr.Instance()._Rule.roleCount == 9) {
            this.selfPokerScale = 0.75;
            this.otherPokerScale = 0.75;
        }
        this.pokerWidth = 169;
        this.pokerHeight = 233;
        this.selfPokerSpaceX = 37.5;
        this.otherPokerSpaceX = 37.5;
        //遮罩层
        if (this.checkPokerMore()) {
            if (RoomMgr.Instance()._Rule && RoomMgr.Instance()._Rule.roleCount == 9) {
                var addWidth = this.getPokerSpaceX();
                this.foldNode.x = -190 + addWidth;
            }
            else {
                var addWidth = this.getPokerSpaceX();
                this.foldNode.x = -174 + addWidth;
            }
        }
    },

    //显示玩家准备状态
    setReadOkUI: function (state) {
        var deskstate = DeskData.Instance().getDeskState();
        cc.log('显示玩家准备状态-----:', state, '桌子状态：', deskstate);
        if (RoomMgr.Instance().gameId == gameType.TDK_COIN) {
            if (this.readyNode && deskstate != 2) {
                this.readyNode.active = state;
            }
        } else {
            if (this.readyNode) {
                this.readyNode.active = state;
            }
        }
    },

    //设置玩家是否弃牌
    setFold: function (state) {
        cc.log('玩家扣牌---', state);
        if (this.foldNode) {
            this.setFoldUI(state);
        }
    },
    //设置allin显示
    setAllIn: function (state) {
        var AllInNode = cc.find('AllIn', this.pokerNode);
        if (AllInNode) {
            AllInNode.active = state;
        }
    },

    showTishi: function (bl) {
        var bubble = cc.find('tishi', this.pokerNode);
        if (bubble)
            bubble.active = bl;
    },

    //头像上显示气泡
    doSpeak: function (str) {
        this.showTishi(true);
        var bubble = cc.find('tishi', this.pokerNode);
        var bubbleNode = bubble.getComponent(cc.Sprite);
        if (bubbleNode && str)
            bubbleNode.spriteFrame = str;
        var numNode = cc.find('tishi/num', this.pokerNode);
        numNode.active = false;
        if (RoomMgr.Instance()._Rule && RoomMgr.Instance()._Rule.genfu) {
            var player = TdkCPlayerData.Instance().getUserById(this.userId);
            if (player && player.GetfanTiNum() > 0) {
                numNode.active = true;
                numNode.getComponent(cc.Label).string = '/' + player.GetfanTiNum();
            }
        }
    },
    //设置玩家操作状态
    setPlayerStata: function (state) {
        if (state) {
            var prefab = this.PRE_COUNTDOWN_Prefab;

            if (this.seatId == 1) {
                prefab = this.PRE_COUNTDOWN_V2_Prefab;
            } else {
                prefab = this.PRE_COUNTDOWN_Prefab;
            }

            this.pb = cc.instantiate(prefab);
            if (this.pb)
                this.pb.parent = this.node;
        } else {
            if (this.pb) {
                this.pb.removeFromParent();
                this.pb.destroy();
            }
        }
    },

    //设置扣牌界面状态
    setFoldUI: function (state) {
        this.closeTime();
        //this.showScoreFlag(!state);
        var len = this.pokerNum_list.length - 1;
        var pokerlen = this.poker_list.length;
        for (var i = 0; i < pokerlen; ++i) {
            if (i > len) break;
            var poker = this.poker_list[i];
            if (!poker) return;
            var num = this.pokerNum_list[len - i];
            if (num > 0 && len - i > 1) {
                poker.setCFrame(num);
                poker.showFace();
            } else {
                poker.showMask(state);
            }
        }
        // if (this.userId == cc.dd.user.id) //不能可以点击暗牌
        //     TdkCPlayerData.Instance().setClickPoker(false);
        var cnt = this.pokerNum_list.length;
        var allPokerWidth = this.getPokerWidth(cnt);
        //扣牌遮罩
        this.foldNode.width = allPokerWidth - 2;
        this.foldNode.active = state;
    },

    /**
     * 显示分数差
     */
    showScore: function (score, offset) {
        var cnt = this.pokerNum_list.length;
        if (cnt == 0) return;
        this.pokerScoreNode.active = true;
        var scorelbl = cc.find('score', this.pokerScoreNode).getComponent(cc.Label);
        if (offset < 0) {
            //隐藏皇冠（最高分图腾)
            this.showCrown(false, offset);
        } else {
            //显示皇冠
            this.showCrown(true, 0);
        }
        scorelbl.string = score;
    },

    showScoreFlag: function (state) {
        if (this.pokerScoreNode) {
            this.pokerScoreNode.active = state;
        }
    },

    /**
     * 显示皇冠
     */
    showCrown: function (state, num) {
        var crownNode2 = cc.find('crown2', this.pokerScoreNode);
        if (crownNode2)
            crownNode2.active = state;
        var crownNode1 = cc.find('crown1', this.pokerScoreNode);
        if (crownNode1) {
            crownNode1.active = !state;
            cc.find('lbl', crownNode1).getComponent(cc.Label).string = Math.abs(num);
        }

    },

    /**
     * 显示赢
     */
    showWinState: function (state, num) {
        var winNode = cc.find('winNode', this.pokerNode);
        if (winNode) {
            winNode.active = state;
            var cpt = cc.find('fuhao/winnum', winNode).getComponent(cc.Label);
            //cpt.string = num;
            this.startRoll(cpt, num);
            if (state) {
                var ani = winNode.getComponent(cc.Animation);
                ani.play('App');
            }
        }
    },

    startRoll(cpt, num) {
        if (!cpt) return;
        if (!isNaN(num) && num != 0) {
            cpt.string = '0';
            this._rollScore = true;
            this._rollLbl = cpt;
            this._rollNum = Math.abs(num);
            this._rollTotalTime = 0.8;//滚动时间
            this._rollTime = 0;
        }
        else {
            cpt.string = '0';
        }
    },

    /**
     * 显示输
     */
    showFailState: function (state, num) {
        var failNode = cc.find('failNode', this.pokerNode);
        if (failNode) {
            cc.log('输');
            failNode.active = state;
            var cpt = cc.find('fuhao/failnum', failNode).getComponent(cc.Label);
            //cpt.string = num;
            this.startRoll(cpt, num);
        }
    },

    update(dt) {
        if (this._rollScore && this._rollLbl) {
            this._rollTime += dt;
            var ratio = this._rollTime / this._rollTotalTime;
            if (ratio > 1) ratio = 1;
            this._rollLbl.string = '' + Math.floor(this._rollNum * ratio);
            if (this._rollTime >= this._rollTotalTime) {
                this._rollScore = false;
            }
        }
    },

    /**
     * 小结算
     * @param result 分数
     * @param isWin 输赢
     * @param callFunc 回调函数
     */
    showResult: function (result, isWin, callFunc) {
        cc.log('小结算', isWin);
        this.closeTime();
        this.showTuoguan(false);
        if (isWin) {
            this.playerscore += result;
            this.betLabel.string = this.CoinchangNumToCHN(this.playerscore);
            this.showWinState(true, result);
        } else {
            this.showFailState(true, result);
        }
        this.showTishi(false);
        if (callFunc)
            callFunc();
    },
    /**
     * 根据座位判定玩家是否在右手边玩家
     */
    isRightAreaPlayer: function (seatId) {
        if (seatId == 2 || seatId == 3) {
            return true;
        }
        if (RoomMgr.Instance()._Rule && RoomMgr.Instance()._Rule.roleCount == 9) {
            if (seatId == 4 || seatId == 5) {
                return true;
            }
        }
        return false;
    },

    /**
     * 五张右边
     */
    checkPokerMore: function () {
        if (RoomMgr.Instance().gameId == gameType.TDK_FRIEND) {
            return this.isRightAreaPlayer(this.seatId);
        }
        return false;
    },

    /**
     * 六张右边
     */
    checkPokerMoreLiu: function () {
        if (RoomMgr.Instance().gameId == gameType.TDK_FRIEND_LIU) {
            return this.isRightAreaPlayer(this.seatId);
        }
        return false;
    },


    isJoinGame: function () {
        if (this.pokerNum_list.length != 0) {
            return true;
        }
        return false;
    },

    /**
     * 获取玩家位置
     */
    getPlayerPos: function () {
        var x = this.playerNode.parent.x;
        var y = this.playerNode.parent.y;
        return cc.v2(x, y);
    },

    clearResult: function () {
        var resultNode = cc.find('result', this.node);
        if (resultNode) {
            resultNode.active = false;
        }
    },

    clearPoker: function (bl) {
        cc.log('clearPoker：' + '清除手牌');
        TdkCPlayerData.Instance().setClickPoker(false);
        this.isPokerFace = false;
        this.foldNode.active = false; //扣牌遮罩
        this.closeTime();
        this.showScoreFlag(false);
        this.clearResult();
        //隐藏输赢分数
        this.showWinState(false, 0);
        this.showFailState(false, 0);
        this.setAllIn(false);
        this.showTishi();
        if (!bl) {
            this.chipInfoNode.active = false;
            this.readyNode.active = false;
        }
        var idx = this.checkPokerMore() ? 1 : 0;
        for (var index = 0; index < this.pokerNum_list.length; index++) {
            var poker = cc.find(('Poker_' + (index + 1 + idx)), this.pokerNode);
            if (!poker) continue;
            var cpt = poker.getComponent('tdk_poker_ui');
            if (!cpt) continue;
            cpt.reset();
            cpt.showBack(true);
            cpt.showMask(false);
            cpt.showBorrowTag(false);
            poker.active = false;
        }
        this.pokerNum_list.splice(0, this.pokerNum_list.length);
        this.pokerNum_list = [];
    },

    //获取手牌之间的间距
    getPokerSpaceX: function () {
        var spaceX = 1;
        if (cc.dd.user.id == this.userId) {
            spaceX *= this.selfPokerSpaceX;
        } else {
            spaceX *= this.otherPokerSpaceX;
        }
        return spaceX;
    },

    //获取当前所有手牌宽度
    getPokerWidth: function (cnt) {
        var scale = 1;
        if (cc.dd.user.id == this.userId) {
            scale *= this.selfPokerScale;
        } else {
            scale *= this.otherPokerScale;
        }
        var pw = this.pokerWidth * scale;
        var pokerSpaceX = this.getPokerSpaceX();
        var allPokerWidth = pw + (cnt - 1) * pokerSpaceX;
        return allPokerWidth;
    },

    //清除玩家
    clearPlayer: function () {
        this.node.active = false;
        this.clearChip();
    },

    /**
     * 判断是否可以点击手牌
     */
    checkPoker: function () {
        if (cc.dd.user.id == this.userId && this.pokerNum_list.length >= 3)
            TdkCPlayerData.Instance().setClickPoker(true);
    },

    //显示玩家Poker
    addPoker: function (num, isBorrow, isAct, doneFunc) {
        this.setReadOkUI(false);
        this.pokerNode.active = true;
        this.pokerNum_list.push(num);

        var index = this.pokerNum_list.length - 1;
        var idx = this.checkPokerMore() ? 1 : 0;
        //设置某张牌的数据
        var poker = cc.find(('Poker_' + (index + 1 + idx)), this.pokerNode);
        if (!poker) return;
        var cpt = poker.getComponent('tdk_poker_ui');
        cpt.reset();
        cpt.number = num;
        cpt.userId = this.userId;
        cpt.idx = index;
        this.poker_list[index] = cpt;
        cpt.hideBorrowTag();
        if (isBorrow) {
            cpt.showBorrowTag(true);
        }
        if (typeof isAct == 'undefined' || isAct) {
            //poker原始位置
            //poker.scale = 0.1;

            var scale = 1;
            if (cc.dd.user.id == this.userId) {
                scale = this.selfPokerScale;
            } else {
                scale = this.otherPokerScale;
            }

            var orginPos_x = poker.x;
            var orginPos_y = poker.y;

            //var pos_x = this.pokerStartNode.getPositionX();
            //var pos_y = this.pokerStartNode.getPositionY();

            //var pos = this.pokerNode.convertToNodeSpace(this.pokerStartNode.parent.convertToWorldSpace(cc.v2(pos_x, pos_y)));
            var pos = this.pokerStartnode.getPosition();
            //this.pokerNode.convertToNodeSpace(this.pokerStartNode.convertToWorldSpace(cc.v2(pos_x, pos_y)));
            //var pos = this.pokerNode.convertToNodeSpace(this.pokerStartNode.convertToWorldSpace(cc.v2(pos_x, pos_y)));
            //poker.setPosition(cc.v2(pos.x - poker.width / 2, pos.y - poker.height / 2));
            //poker.setPosition(cc.v2(pos.x, pos.y));
            if (this.isRightAreaPlayer(this.seatId)) {
                poker.setPosition(cc.v2(pos.x + poker.width, pos.y));
            } else {
                poker.setPosition(cc.v2(pos.x - (poker.width / 2 * 3), pos.y));
            }
            if (this.Pokertoun)
                this.Pokertoun.width = pos.x + this.pokerWidth * this.selfPokerScale;

            var moveTo = cc.moveTo(0.2, orginPos_x, orginPos_y);//.easing(cc.easeExponentialOut())
            var scaleTo = cc.scaleTo(0, scale);
            poker.active = true;
            if (this.pokerNum_list.length >= 3) {
                //cpt.hideBack();
                this.showPoker(index, isBorrow);
            }
            tdk_am.playEffect(dd.tdk_resCfg.AUDIO_COMMON.AUDIO_SENGCARD);
            var seq = cc.sequence(cc.spawn(moveTo, scaleTo),
                cc.delayTime(0.01), cc.callFunc(function () {
                    if (this.pokerNum_list.length == 3) {
                        this.showScoreFlag(true);
                    }

                    this.checkPoker();
                }.bind(this)));
            poker.runAction(seq);
            //tdk_am.playEffect(dd.tdk_resCfg.AUDIO_COMMON.AUDIO_CARD);
        } else {
            poker.active = true;
            this.showPoker(index, isBorrow);
            this.showScoreFlag(true);
        }

    },
    //显示扑克
    showPoker: function (index, isBorrow) {
        var cnt = this.pokerNum_list.length;
        var record = TdkCPlayerData.Instance().GetIsRecord();
        cc.log("显示扑克------", record);
        this.pokerNum_list.forEach(function (item, idx) {
            if (idx > 1 || record) {//显示其他玩家第二张之后的手牌
                if (this.poker_list[idx]) {
                    this.poker_list[idx].setCFrame(item);
                    this.poker_list[idx].showFace();
                }
            } else {//显示自己前两张手牌
                if (this.poker_list[idx])
                    this.poker_list[idx].showBack(true);
            }
        }.bind(this));
    },

    //展示显示背面的纸牌
    showBackPoker: function (list, isfold) {
        var cnt = this.checkPokerMore() ? 1 : 0;
        var len = 0;
        if (isfold)
            len = this.pokerNum_list.length - 2;
        list.forEach(function (item, idx) {
            var poker = cc.find(('Poker_' + (len + idx + 1 + cnt)), this.pokerNode);
            if (poker) {
                var cpt = poker.getComponent('tdk_poker_ui');
                cpt.setCFrame(item);
                cpt.showFace();
                cpt.showMask(false);
                if (isfold == null && idx < 2) {
                    cpt.showDipaiTag(true);
                }
            } else {
                cc.log('showBackPoker : ', idx)
            }

        }.bind(this));
    },

    pokertouchStart: function () {
        var player = TdkCPlayerData.Instance().getUserById(cc.dd.user.id);
        if (!TdkCPlayerData.Instance().IsClickPoker() || !player)
            return;
        cc.log('看牌中..........', this.sendKaipai, 'fold:', player.fold)
        this.showBackPoker(player.hidelist, player.fold);
        this.changePokerScore(true);
        if (!this.sendKaipai) {
            this.sendKaipai = true;
            if (player.fold)
                this.showKaiPai(player.userid);
            else
                tdkSeed.onTdkKanPaiReq();
        }

    },

    pokertouchEnd: function (event, data) {
        if (!TdkCPlayerData.Instance().IsClickPoker())
            return;
        var player = TdkCPlayerData.Instance().getUserById(cc.dd.user.id);
        if (player && player.fold) {
            var len = this.pokerNum_list.length;
            cc.log('牌的长度：', len)
            for (var index = len - 2; index < len; index++) {
                var poker = cc.find(('Poker_' + (index + 1)), this.pokerNode);
                var cpt = poker.getComponent('tdk_poker_ui');
                cpt.showMask(true);
            }
        } else {
            for (var index = 0; index < 2; index++) {
                var poker = cc.find(('Poker_' + (index + 1)), this.pokerNode);
                var cpt = poker.getComponent('tdk_poker_ui');
                cpt.showBack(true);
            }
        }
        this.changePokerScore(false);
    },

    changePokerScore: function (bl) {
        var player = TdkCPlayerData.Instance().getUserById(this.userId);
        if (player) {
            if (bl) {
                player.cacuTotallateScore();
                this.showScore(player.totalScore, player.offsetScore);
                //this.showCrown(false);
            } else {
                player.caculateScore();
                player.setScore();
            }
        }
    },
    /***********************************************筹码操作*******************************************/
    createChipPool: function () {
        this.chipPool = new cc.NodePool();
        var initCount = 100;
        for (var i = 0; i < initCount; i++) {
            var prefab = this.ChipPrefab;
            var chip = cc.instantiate(prefab);
            this.chipPool.put(chip);
        }
    },

    createChip: function () {
        var chip = null;
        if (this.chipPool.size() > 0) {
            chip = this.chipPool.get();
        } else {
            var prefab = this.ChipPrefab;
            chip = cc.instantiate(prefab);
        }
        return chip;
    },

    /**
     * 清理本轮下注
     */
    cleandanChip: function () {
        this.danChip = 0;
        var benlunlbl = cc.find('chipInfo/danlbl', this.node);
        if (benlunlbl)
            benlunlbl.getComponent(cc.Label).string = this.changeNumToCHN(this.danChip);
    },

    //更新下注金额
    freshCostChip: function () {
        this.chipInfoNode.active = true;
        var lblNode = cc.find('chipInfo/lbl', this.node);
        lblNode.getComponent(cc.Label).string = this.changeNumToCHN(this.costChip);
        var benlunlbl = cc.find('chipInfo/danlbl', this.node);
        if (benlunlbl)
            benlunlbl.getComponent(cc.Label).string = this.changeNumToCHN(this.danChip);
    },

    //计算本次下注筹码规格
    getChipType: function (num) {
        this.refreshChip();
        this.costChipData_list.splice(0, this.costChipData_list.length);
        this.costChipData_list = [];
        var tmp_num = num;
        cc.log('计算本次下次：', DeskData.Instance().roomNum);
        if (!DeskData.Instance().roomNum) return;
        for (var k = 0; k < this.chipType_list[DeskData.Instance().roomNum - 1].length; k++) {
            var spec = this.chipType_list[DeskData.Instance().roomNum - 1][k].type;
            var mul = Math.floor(tmp_num / spec);
            if (mul > 0) {
                this.costChipData_list.push({ type: spec, cnt: mul, index: this.chipType_list[DeskData.Instance().roomNum - 1][k].index, color: this.chipType_list[DeskData.Instance().roomNum - 1][k].color });
                tmp_num = tmp_num % spec;
                if (tmp_num == 0) {
                    break;
                }
            }
        }
    },

    clearChip: function () {
        cc.log('清除筹码');
        this.chip_list.forEach(function (item) {
            if (item) {
                item.removeFromParent();
                this.chipPool.put(item);
            }
        }.bind(this));
        this.chip_list.splice(0, this.chip_list.length);
    },
    /***********************************************筹码操作*******************************************/

    //下注动画
    doBet: function (num, isAct) {
        this.costChip += num;
        this.danChip += num;
        this.freshCostChip();
        this.getChipType(num);
        this.playerscore -= num;
        this.betLabel.string = this.CoinchangNumToCHN(this.playerscore);
        var totalChip = 0;
        var chipAltas = this.Ats_Chips;
        for (var n = 0; n < this.costChipData_list.length; n++) {
            var item = this.costChipData_list[n];
            for (var i = 0; i < item.cnt; i++) {
                totalChip++;
                var chipNode = this.createChip();
                if (!chipNode) continue;
                chipNode.scale = 1.2;
                chipNode.active = true;
                var chipNumNode = cc.find('num', chipNode);
                var numStr = this.deckchangeNumToCHN(item.type);
                var numcpt = chipNumNode.getComponent(cc.LabelOutline);
                numcpt.color = item.color;
                chipNumNode.getComponent(cc.Label).string = numStr;

                var rotation = Math.random() * 360;
                chipNumNode.setRotation(rotation);
                this.chip_list.push(chipNode);
                cc.log('玩家ID:', this.userId, '筹码数量：', this.chip_list.length);
                var sprite = chipAltas.getSpriteFrame('chip_btn_' + (item.index));
                var cpt = chipNode.getComponent(cc.Sprite);
                if (cpt)
                    cpt.spriteFrame = sprite;

                var chipAreaNode = cc.find(this.chipAreaName);
                chipNode.parent = chipAreaNode;
                var randx = Math.floor(10 - Math.random() * (20 + 1)) / 10 * Math.random();
                var randy = Math.floor(10 - Math.random() * (20 + 1)) / 10 * Math.random();
                var x = randx * chipAreaNode.width / 2;
                var y = randy * chipAreaNode.height / 2;

                if (typeof isAct == 'undefined') {
                    var startPt_x = this.node.x;
                    var startPt_y = this.node.y;
                    //var startPt = chipAreaNode.convertToNodeSpace(this.node.convertToWorldSpace(cc.v2(startPt_x, startPt_y)));
                    chipNode.setPosition(cc.v2(startPt_x, startPt_y));
                    var distance = Math.sqrt((x - startPt_x) * (x - startPt_x) + (y - startPt_y) * (y - startPt_y));
                    if (distance > 500)
                        var moveTo = cc.moveTo(0.12, cc.v2(x, y));
                    else
                        var moveTo = cc.moveTo(0.12 * distance / 500, cc.v2(x, y));
                    chipNode.runAction(cc.sequence(moveTo, cc.delayTime(0.2), cc.callFunc(function () {
                    })));

                    if (totalChip < 2) {
                        tdk_am.playEffect(dd.tdk_resCfg.AUDIO_COMMON.AUDIO_BET);
                    } else {
                        tdk_am.playEffect(dd.tdk_resCfg.AUDIO_COMMON.AUDIO_CHIPHE);
                    }
                } else {
                    chipNode.setPosition(cc.v2(x, y));
                }
            }
        }
    },
    //收筹码动画
    winnerGetCost: function (endPos, callFunc) {
        cc.log('筹码数量为 ：', this.chip_list.length);
        if (this.chip_list.length == 0 && callFunc) {
            callFunc();
        } else {
            this.chip_list.forEach(function (chipNode) {
                var moveTo = cc.moveTo(0.3, endPos);
                var scaleTo = cc.scaleTo(0.3, 0);
                var seq = cc.sequence(cc.spawn(moveTo, scaleTo), cc.delayTime(2), cc.callFunc(function () {
                    if (callFunc) {
                        chipNode.active = false;
                        callFunc();
                    }
                }.bind(this)));
                chipNode.runAction(seq);
            }.bind(this))
        }
    },

    //清除上局筹码信息
    clearChipInfo: function () {
        this.clearChip();
        this.costChip = 0;
        var lblNode = cc.find('chipInfo/lbl', this.node.parent);
        if (lblNode) {
            lblNode.getComponent(cc.Label).string = this.costChip;
        }
        this.cleandanChip();
    },

    /**
     * 筹码数字转换
     */
    deckchangeNumToCHN: function (num) {
        var str = '';
        if (num >= 10000) {
            str = (num / 10000) + '万';
        } else if (num >= 1000) {
            str = (num / 1000) + '千';
        } else if (num >= 100) {
            str = (num / 100) + '百';
        } else {
            str = num;
        }
        return str;
    },

    /**
     * 筹码数字转换
     */
    changeNumToCHN: function (num) {
        var str = '';
        if (num >= 10000) {
            str = (num / 10000).toFixed(1) + '万';
        } else if (num >= 1000) {
            str = (num / 1000) + '千';
        } else {
            str = num;
        }
        return str;
    },

    /**
     * 金币转换
     */
    CoinchangNumToCHN: function (num) {
        return cc.dd.Utils.getNumToWordTransform(num);
    },

    /**
    * 点击玩家
    */
    playerClick: function () {
        var bl = TdkCPlayerData.Instance().checkPlayerSurvival();
        if (!this.isVaildClickPlayer || !bl) {
            return;
        }

        var jlmj_prefab = require('jlmj_prefab_cfg');
        var playerInfo = TdkCPlayerData.Instance().GetPlayerConmmonData();
        var player = TdkCPlayerData.Instance().getCommonData(this.userId);
        if (!player || !playerInfo) return;

        cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_USERINFO, function (ui) {
            var user_info = ui.getComponent('user_info_view');
            user_info.setData(RoomMgr.Instance().gameId, RoomMgr.Instance().roomId, null, false, player);
            if (RoomMgr.Instance()._Rule.gps) {
                user_info.setGpsData(playerInfo);
            }
            user_info.show();
        }.bind(this));
    },

    /**
 * 播放短语
 * @param id
 */
    play_duanyu: function (id) {
        var cfg = chat_duanyu_item.getItem(function (item) {
            if (item.duanyu_id == id)
                return item;
        }.bind(this));
        if (cfg == null) {
            cc.error("无短语配置 id=" + id);
            return;
        }
        this.duanyu_node.active = true;
        // this.duanyu_arrow.active = true;
        this.duanyu_label.string = cfg.text;
        if (this.last_duanyu_audio_id != -1) {
            AudioManager.getInstance().stopSound(this.last_duanyu_audio_id);
        }
        var role = TdkCPlayerData.Instance().getCommonData(this.userId);
        if (!role) return;
        let audio = QuickMusicPath + (role.sex ? cfg.boy_audio : cfg.girl_audio);
        this.last_duanyu_audio_id = AudioManager.getInstance().playSound(audio);
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
        this.biaoqing.getComponent(cc.Animation).play("em" + (id - 1));
        this.scheduleOnce(function () {
            this.biaoqing.node.active = false;
        }.bind(this), 3);
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

    createMagicPropIcon: function (idx) {
        var atlas = cc.resources.get('gameyj_mj/jilin/py/atlas/jlmj_game_userInfo', cc.SpriteAtlas);
        var magicIcon = new cc.Node("magicIcon");
        var sprite = magicIcon.addComponent(cc.Sprite);
        sprite.spriteFrame = atlas.getSpriteFrame(magicIcons[idx]);
        magicIcon.parent = this.magic_prop_layer;
        return magicIcon;
    },

    /**
     * 播放魔法道具
     * @param idx
     * @param fromId
     * @param toId
     */
    playMagicProp: function (idx, fromId, toId) {
        let magic_prop = cc.find("Canvas/tdk_coin_room").getComponentInChildren("com_magic_prop");
        var sPos = this.getPlayerHeadPos(fromId);
        var endPos = this.getPlayerHeadPos(toId);
        if (sPos && endPos)
            magic_prop.playMagicPropAni(idx, sPos, endPos);

    },

    /**
     * 获取玩家head
     */
    getPlayerHeadPos: function (userID) {
        var cpt = cc.find('Canvas/tdk_coin_room').getComponent('tdk_coin_room_ui_new');
        if (cpt) {
            var player = cpt.findPlayer(userID);
            if (player) {
                var head = player.getComponent('tdk_coin_player_ui');
                if (head)
                    return head.node.convertToWorldSpace(cc.v2(head.node.width / 2, head.node.height / 2));
            } else {
                cc.error('找不到指定id的用户头像 id=', userID);
            }
        } else {
            cc.error('Canvas/tdk_coin_room 无挂tdk_coin_room_ui_new脚本');
            return null;
        }
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
        AudioManager.getInstance().playSound(PropAudioCfg[idx]);
    },

    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage: function (event, data) {
        switch (event) {
            case ChatEvent.CHAT:
                if (data.sendUserId == this.userId) {
                    if (data.msgtype == 1) {
                        this.play_duanyu(data.id);
                    } else if (data.msgtype == 2) {
                        this.play_biaoqing(data.id);
                    }
                } else if (data.toUserId == this.userId && data.msgtype == 3) {
                    this.playMagicProp(data.id, data.sendUserId, data.toUserId);
                }
                break;
            case RecordEvent.PLAY_RECORD:
                if (data.accid.toLowerCase() == (cc.dd.prefix + this.userId).toLowerCase()) {
                    this.play_yuyin(data.duration);
                } else {
                    cc.error("语音账号不匹配", 'accid=', data.accid.toLowerCase(), "user accid=", (cc.dd.prefix + this.userId).toLowerCase());
                }
                break;
            default:
                break;
        }
    },

    /**
     * 显示离线状态
     */
    showOffline: function (bl) {
        cc.find('weak', this.node).active = !bl;
        cc.find('offline', this.node).active = !bl;
    },

    /**
     * 语音
     */
    showYuying: function (bl) {
        this.yuyin_laba.node.active = bl;
        this.yuyin_laba.yuyin_size.node.active = false;
    },

    /**
     * 看牌
     */
    showKaiPai: function (id) {
        if (!this.pokerNum_list || this.pokerNum_list.length < 3)
            return;
        if (id == cc.dd.user.id) {
            this.unschedule(this.moveCDTimer);
            this.moveCD = 2;
            this.schedule(this.moveCDTimer, 1);
            return;
        }
        var index = this.checkPokerMore() ? 2 : 1;
        var poker = cc.find(('Poker_' + index), this.pokerNode);
        poker.getComponent(cc.Animation).play();
        cc.log('看牌动画')
    },

    moveCDTimer: function () {
        this.moveCD--;
        if (this.moveCD < 0) {
            this.moveCD = 0;
            this.unschedule(this.moveCDTimer);
            this.sendKaipai = false;
        }
    },

    /**
     * 本轮下注
     */
    setDanChip: function (chip) {
        this.danChip = chip;
        this.freshCostChip();
    },

    showTimeNode: function (time) {
        var rule = RoomMgr.Instance()._Rule;
        if (!rule) return;
        if (rule.tuoguanTime == 0) return;
        cc.log('showTimeNode:', RoomMgr.Instance().gameId);
        if (RoomMgr.Instance().gameId == gameType.TDK_COIN) return;
        this.hiddenTimeNode();
        this.tdkTimeNum = parseInt(time);
        this.aniamBl = true;
        this.unschedule(this.countdownTime);
        this.schedule(this.countdownTime, 1);
    },

    /**
     * 清除倒计时
     */
    closeTime: function () {
        this.unschedule(this.countdownTime);
        this.hiddenTimeNode();
    },

    countdownTime: function () {
        --this.tdkTimeNum;
        cc.log('倒计时中--：', this.tdkTimeNum);
        var aniamTime = this.tdkTimeNode.getComponent(cc.Animation);
        if (this.tdkTimeNum <= 15) {
            this.tdkTimeNode.active = true;
            var lbl = cc.find('lbl', this.tdkTimeNode).getComponent(cc.Label);
            if (lbl)
                lbl.string = this.tdkTimeNum;
            AudioManager.getInstance().playSound(dd.tdk_resCfg.AUDIO_COMMON.AUDIO_CLOCK, false);
        }

        if (this.tdkTimeNum == 10 && this.aniamBl) {
            this.aniamBl = false;
            if (aniamTime) {
                aniamTime.play('tdkTime');
                aniamTime.repeatCount = 5;
            }
        }

        if (this.tdkTimeNum <= 0) {
            cc.log('时间到零了')
            this.closeTime();
        }
    },

    /**
     * 隐藏倒计时
     */
    hiddenTimeNode: function () {
        if (this.tdkTimeNode)
            this.tdkTimeNode.active = false;
    },

    /**
     * 显示托管图标
     */
    showTuoguan: function (bl) {
        if (this.tuoguanode)
            this.tuoguanode.active = bl;
    },

});
