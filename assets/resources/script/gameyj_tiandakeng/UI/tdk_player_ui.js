var dd = cc.dd;
var tdk = dd.tdk;
var tdk_am = require("../Common/tdk_audio_manager").Instance();

var DeskData = require('tdk_desk_data').TdkDeskData;

var WxED = require("com_wx_data").WxED;
var WxEvent = require("com_wx_data").WxEvent;
var WxData = require("com_wx_data").WxData.Instance();

var gameData = require('tdk_game_data');
var HallPropData = require('hall_prop_data').HallPropData.getInstance();
var hallData = require('hall_common_data').HallCommonData;

var ChatEd = require('jlmj_chat_data').ChatEd;
var ChatEvent = require('jlmj_chat_data').ChatEvent;
var GetQuickMsgCfgByID = require('jlmj_ChatCfg').GetQuickMsgCfgByID;

const RecordEd = require('AudioChat').RecordEd;
const RecordEvent = require('AudioChat').RecordEvent;
var PropAudioCfg = require('jlmj_ChatCfg').PropAudioCfg;
var QuickMusicPath = require('jlmj_ChatCfg').QuickMusicPath;
var magicIcons = ['hua', 'feiwen', 'jidan', 'zadan', 'fanqie', 'jiubei', 'ji'];

var tdk_proId = tdk.base_pb.tdk_enum_protoId;


cc.Class({
    extends: cc.Component,

    properties: {
        duanyu_node: { default: null, type: cc.Node, tooltip: '短语节点', },  //短语节点
        duanyu_arrow: { default: null, type: cc.Node, tooltip: '短语箭头', },  //短语箭头
        duanyu_label: { default: null, type: cc.Label, tooltip: '短语文本', },  //短语文本
        last_duanyu_audio_id: -1,

        biaoqing: { default: null, type: cc.Animation, tooltip: '表情组件', }, //表情
        yuyin_laba: { default: null, type: require('jlmj_yuyin_laba'), tooltip: '语音组件', }, //语音

        magic_prop_layer: { default: null, type: cc.Node, tooltip: '魔法道具层', },  //魔法道具层
        magic_prop: { default: null, type: cc.Animation, tooltip: '魔法道具', },  //魔法道具

        seatId: cc.Integer,
        userId: null,
        nick: null,
        headUrl: '',
        sex: 0,
        city: '',
        openId: 0,
        bRoomOwner: false,
        playerInfo: null,
        pokerNum_list: [], //纸牌点数数组
        //发牌动画时间
        actTime: 1,
        costChip: 0,       //下注金额
        chipAtlas: cc.SpriteAtlas,
        chipPre: cc.Prefab,
        pokerPre: cc.Prefab,
        foldMask: null, //显示扣牌遮皂
        chip_list: [], //游戏中玩家下注的筹码实列
        chipType_list: [], //筹码规格类型
        costChipData_list: [], //本轮需要消耗的筹码数据
        pokerStarPt: cc.v2, //手牌发牌起点
        pokerEndPt_list: [cc.v2], //第一张手牌发牌的终点位置
        three_pokerEndPt_list: [cc.v2], //三人位置第一张手牌终点位置
        four_pokerEndPt_list: [cc.v2],  //四人位置第一张手牌终点位置
        five_pokerEndPt_list: [cc.v2],  //五人位置第一张手牌终点位置
        http_url_img: cc.Sprite,

        _totalScore: 0, //目前自己手中所有手牌分数
        _openScore: 0, //每个玩家明牌分数

        sexIdx: 0,
        chipAreaName: '',
        /**
         * 是否可以有效点击头像
         */
        isVaildClickPlayer: true,
    },

    // use this for initialization
    onLoad: function () {
        if (gameData.gameType == require('TDKConstantConf').GAME_TYPE.GT_FRIEND) {
            this.chipAreaName = 'Canvas/tdk_room/chipArea';
        } else if (gameData.gameType == require('TDKConstantConf').GAME_TYPE.GT_COIN) {
            this.chipAreaName = 'Canvas/tdk_coin_room/chipArea';
        }

        // dd.UserInfoUtil.addObserver(this);
        WxED.addObserver(this);
        cc.log('[ui]正在下载玩家：', this.userId,
            ', 昵称:', this.nick,
            ', openId:', this.openId,
            ', 头像：', this.headUrl, '的头像。。。');
        cc.dd.SysTools.loadWxheadH5(this.http_url_img, this.headUrl);
        this.initPokerEndPtList();
        cc.log('tdk_layer_ui::onLoad!');
        this.createChipPool();
        this.createPokerPool();
        this.initData();
        //var resultNode = cc.find('result', this.node.parent);
        //resultNode.setLocalZOrder(100);

        this.isPokerFace = false; //前两张手牌是否是正面

        this.magicIcons = [];
        var chatNode = this.node.parent.getChildByName('chatNode')
        this.magic_prop = chatNode.getChildByName('jlmj_magic_prop');
        this.magic_prop.active = false;
        this.duanyu_node = chatNode.getChildByName('duanyu_node');
        this.duanyu_node.active = false;
        this.duanyu_label = this.duanyu_node.getChildByName('duanyu_label');
        // this.duanyu_arrow.active = false;
        this.biaoqing = chatNode.getChildByName('jlmj_biaoqing');
        this.biaoqing.active = false;
        this.yuyin_laba = chatNode.getChildByName('jlmj_yuyin_laba');
        this.yuyin_laba.active = false;
        this.magic_prop_layer = cc.find('Canvas/tdk_room/magic_prop_layer');

        if (this.sex == 1) {
            this.sexIdx = 0;
        } else if (this.sex == 2) {
            this.sexIdx = 1;
        }
        ChatEd.addObserver(this);
        RecordEd.addObserver(this);
    },


    initPokerEndPtList: function () {
        var cnt = DeskData.Instance().playerCnt;
        if (3 == cnt) {
            this.pokerEndPt_list = this.three_pokerEndPt_list;
        } else if (4 == cnt) {
            this.pokerEndPt_list = this.four_pokerEndPt_list;
        } else if (5 == cnt) {
            this.pokerEndPt_list = this.five_pokerEndPt_list;
        }
    },

    initData: function () {
        cc.log('tdk_layer_ui::initData!');
        this.chipType_list.push(
            { type: DeskData.Instance().dizhu * 5, index: 7, color: cc.color(158, 42, 41) },
            { type: DeskData.Instance().dizhu * 2, index: 5, color: cc.color(58, 13, 80) },
            { type: DeskData.Instance().dizhu * 1, index: 2, color: cc.color(8, 65, 19) });
        this.poker_list = new Array(5);

        this.selfPokerScale = 0.51; //自己手牌縮放系數
        this.otherPokerScale = 0.43; //其他玩家手牌縮放系數
        this.pokerWidth = 169;
        this.pokerHeight = 233;
        this.pokerSpaceX = 80.5;
        this.slefPokerLeft = 280;
        this.pokerLeft = 5;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    createPokerPool: function () {
        this.pokerPool = new cc.NodePool();
        var initCount = 5;
        for (var i = 0; i < initCount; i++) {
            var prefab = cc.resources.get(dd.tdk_resCfg.PREFAB.PRE_POKER, cc.Prefab);
            var poker = cc.instantiate(prefab);
            this.pokerPool.put(poker);
        }
        cc.log('tdk_player_ui::craetePokerPool:pokerPool=', this.pokerPool);
    },

    createChipPool: function () {
        this.chipPool = new cc.NodePool();
        var initCount = 100;
        for (var i = 0; i < initCount; i++) {
            var prefab = cc.resources.get(dd.tdk_resCfg.PREFAB.PRE_CHIP, cc.Prefab);
            var chip = cc.instantiate(prefab);
            this.chipPool.put(chip);
        }
        cc.log('tdk_player_ui::createChipPool:chipPool=', this.chipPool);
    },

    createPoker: function () {
        var poker = null;
        if (this.pokerPool.size() > 0) {
            poker = this.pokerPool.get();
        } else {
            var prefab = cc.resources.get(dd.tdk_resCfg.PREFAB.PRE_POKER, cc.Prefab);
            poker = cc.instantiate(prefab);
        }
        return poker;
    },

    createChip: function () {
        var chip = null;
        if (this.chipPool.size() > 0) {
            chip = this.chipPool.get();
        } else {
            var prefab = cc.resources.get(dd.tdk_resCfg.PREFAB.PRE_CHIP, cc.Prefab);
            chip = cc.instantiate(prefab);
        }
        return chip;
    },

    showChipInfo: function () {
        var chipInfoNode = cc.find('chipInfo', this.node.parent);
        chipInfoNode.active = true;
    },

    //显示玩家准备状态
    setReadOkUI: function (state) {
        var tipNode = cc.find('tip', this.node.parent);
        if (tipNode) {
            tipNode.active = state;
        }
    },

    /**
     * 获取头像spriteFrame
     * @param list
     */
    getHeadSpf: function () {
        return this.http_url_img.spriteFrame;
    },

    //展示显示背面的纸牌
    showBackPoker: function (list) {
        this.isPokerFace = true;
        var cnt = list.length;
        var self = this;
        var isRight = this.isRightAreaPlayer(this.seatId);
        list.forEach(function (item, idx) {
            if (idx < 2) {
                if (isRight) {
                    var poker = self.poker_list[cnt - 1 - idx];
                    poker.setFrame(item);
                    poker.isFace = true;
                } else {
                    var poker = self.poker_list[idx];
                    poker.setFrame(item);
                    poker.isFace = true;
                }
            }
        });
        this.showScoreFlag(true);
    },

    /**
     * 是否是右边玩家
     */
    isRightAreaPlayer: function (seatId) {
        var cnt = DeskData.Instance().playerCnt;
        if (3 == cnt) {
            if (2 == seatId) {
                return true;
            } else {
                return false;
            }
        } else if (4 == cnt || 5 == cnt) {
            if (2 == seatId || 3 == seatId) {
                return true;
            } else {
                return false;
            }
        } else {
            cc.error('[data] tdk_player_ui|::isRightAreaPlayer:玩家数量错误！');
            return false;
        }
    },

    //设置扣牌界面状态
    setFoldUI: function (state) {
        this.showScoreFlag(!state);
        this.poker_list.forEach(function (item) {
            if (item) {
                item.showMask(state);
            }
        });
        //扣牌标签
        var fold = cc.find('fold', this.node);
        if (fold) {
            fold.active = state;
            this.showCrown(false);
        }

        //顯示扣牌文字
        var foldStr = cc.find('foldStr', this.node.parent);
        if (foldStr) {
            foldStr.active = state;

            if (state) {
                var allPokerWidth = this.getPokerWidth();
                var posx = this.pokerLeft + allPokerWidth;
                if (this.isRightAreaPlayer(this.seatId)) {
                    posx = -posx;
                }
                if (this.userId == cc.dd.user.id) {
                    posx = this.slefPokerLeft + allPokerWidth;
                }
                foldStr.x = posx;
            }
        }
    },

    showScoreFlag: function (state) {
        var flag = cc.find('pokerScore', this.node.parent);
        if (flag) {
            flag.active = state;
        }
    },

    showCrown: function (state, pos) {
        var crownNode = cc.find('pokerScore/crown', this.node.parent);
        if (crownNode) {
            crownNode.active = state;
        }
    },

    playerFirstPokerPt: function (pt) {
        var pokerNode = cc.find('Canvas/tdk_room/pokerNode');
        var wpt = pokerNode.convertToWorldSpace(cc.v2(0, 0));
        var npt = this.node.convertToNodeSpace(wpt);
        cc.log('tdk_player_ui::playerFirstPokerPt:pt=', pt, ',wpt=', wpt, ',npt=', npt);
        return npt;
    },

    showScore: function (score, offset) {
        // this._openScore = score;
        var pokerScoreNode = cc.find('pokerScore', this.node.parent);
        var scoreNode = cc.find('score', pokerScoreNode);
        scoreNode.active = true;
        var cpt = scoreNode.getComponent(cc.Label);
        var allPokerWidth = this.getPokerWidth();
        var posx = this.pokerLeft + allPokerWidth;
        if (this.isRightAreaPlayer(this.seatId)) {
            posx = -posx;
        }
        if (this.userId == cc.dd.user.id) {
            posx = this.slefPokerLeft + allPokerWidth;
        }
        if (this.isPokerFace) {
            score = this._totalScore;
        }

        cc.log('tdk_player_ui::showScore:posx=', posx, ',id=', this.userId, ',seatId=', this.seatId);
        pokerScoreNode.x = posx;
        if (offset < 0) {
            score = score + '(' + offset + ')';
            //隐藏皇冠（最高分图腾)
            this.showCrown(false);
        } else {
            //显示皇冠
            this.showCrown(true);
        }

        cpt.string = score;
    },

    showWinState: function (state) {
        var pokerNode = cc.find('Canvas/tdk_room/pokerNode');
        if (state) {
            var prefab = cc.resources.get(dd.tdk_resCfg.PREFAB.PRE_YING, cc.Prefab);
            var winNode = cc.instantiate(prefab);
            winNode.name = 'ying_' + this.seatId;
            winNode.parent = pokerNode;
            var allPokerWidth = this.getPokerWidth();
            var posx = this.pokerEndPt_list[this.seatId - 1].x - 247 + allPokerWidth / 2.0 - this.getPokerSpaceX();

            if (this.isRightAreaPlayer(this.seatId)) {
                posx = this.pokerEndPt_list[this.seatId - 1].x - 247 - allPokerWidth / 2.0 + this.getPokerSpaceX();
            }
            winNode.x = posx;
            winNode.y = this.pokerEndPt_list[this.seatId - 1].y - 295;
            winNode.setScaleX((allPokerWidth + 20) / 300);

            winNode.zIndex = 10;
        } else {
            var winNode = cc.find('ying_' + this.seatId, pokerNode);
            if (winNode) {
                winNode.removeFromParent();
            }
        }
        // var winNode = cc.find('ying', this.node.parent);
        // if(winNode){
        //     //winNode.active = state;
        //     //winNode.setLocalZOrder(0);

        //     var allPokerWidth = this.getPokerWidth();
        //     var posx = this.pokerEndPt_list[this.seatId - 1].x + allPokerWidth - this.pokerSpaceX - 247;
        //     var pokerNode = cc.find('Canvas/tdk_room/pokerNode');
        //     //var xx = pokerNode.convertToWorldSpace(posx)
        //     posx = this.node.parent.convertToNodeSpace(pokerNode.convertToWorldSpace(posx));
        //     winNode.active = state;
        //     winNode.setPositionX(posx);
        //     cc.log('wing posx' + posx);
        // }
    },

    showFailedState: function (state) {
        var pokerNode = cc.find('Canvas/tdk_room/pokerNode');
        if (state) {
            var prefab = cc.resources.get(dd.tdk_resCfg.PREFAB.PRE_YING, cc.Prefab);
            var winNode = cc.instantiate(prefab);
            winNode.name = 'ying_' + this.seatId;
            winNode.parent = pokerNode;
            var allPokerWidth = this.getPokerWidth();
            var rate = (allPokerWidth + 20) / 300;
            var posx = this.pokerEndPt_list[this.seatId - 1].x - 247 + allPokerWidth / 2.0 - this.getPokerSpaceX();

            if (this.isRightAreaPlayer(this.seatId)) {
                posx = this.pokerEndPt_list[this.seatId - 1].x - 247 - allPokerWidth / 2.0 + this.getPokerSpaceX();
            }
            winNode.x = posx;
            winNode.y = this.pokerEndPt_list[this.seatId - 1].y - 295;
            // if(this.seatId !== 1){
            winNode.setScaleX(rate);
            //}
            winNode.zIndex = 10;

            var winBg = cc.find('bg', winNode);
            var failBg = cc.find('failBg', winNode)
            //var cpt = winNode.getComponent(cc.Sprite);
            var foldStr = cc.find('foldStr', this.node.parent);
            if (foldStr) {
                foldStr.active = false;
            }

            winBg.active = false;
            failBg.active = true;
            //cpt.enabled = false; 

        } else {
            var winNode = cc.find('ying_' + this.seatId, pokerNode);
            if (winNode) {
                winNode.removeFromParent();
            }
        }
    },

    //获取手牌之间的间距
    getPokerSpaceX: function () {
        var scale = 1;
        if (gameData._selfId == this.userId) {
            scale *= this.selfPokerScale;
        } else {
            scale *= this.otherPokerScale;
        }
        var spaceX = this.pokerSpaceX * scale;
        return spaceX;
    },

    //获取当前所有手牌宽度
    getPokerWidth: function () {
        var cnt = this.pokerNum_list.length;
        var scale = 1;
        if (gameData._selfId == this.userId) {
            scale *= this.selfPokerScale;
        } else {
            scale *= this.otherPokerScale;
        }
        var pw = this.pokerWidth * scale;
        var pokerSpaceX = this.getPokerSpaceX();
        var allPokerWidth = pw + (cnt - 1) * pokerSpaceX;
        return allPokerWidth;
    },

    showResult: function (result, isWin, callBack) {
        cc.log('tdk_player_ui::showResult: line:142 result=', result);
        if (isWin) {
            this.showWinState(true);
        } else {
            this.showFailedState(true);
        }
        this.showScoreFlag(false);
        var pokerNode = cc.find('Canvas/tdk_room/pokerNode');
        var str = 'ying_' + this.seatId
        var resultNode = pokerNode.getChildByName(str).getChildByName('result');
        //cc.find('ying/result', pokerNode);
        resultNode.active = true;
        var cpt = resultNode.getComponent(cc.Label);
        var resultStr = result;
        if (result >= 0) {
            var font = cc.resources.get(dd.tdk_resCfg.FONT.FONT_WIN, cc.Font);
            cpt.font = font;
            resultStr = result;
        } else {
            var font = cc.resources.get(dd.tdk_resCfg.FONT.FONT_FAILED, cc.Font);
            cpt.font = font;
            resultStr = (-result);
        }
        cc.log('tdk_player_ui::showResult: line:498 result=', result);
        cpt.string = resultStr;

        //更新玩家总输赢
        var totalNode = cc.find('score', this.node);
        var totalCpt = totalNode.getComponent(cc.Label);
        var totalV = parseInt(totalCpt.string);
        cc.log('tdk_player_ui::showResult: line:175 totalV=', totalV, ',result=', result);
        totalV += result;
        if (totalV >= 0) {
            var font = cc.resources.get(dd.tdk_resCfg.FONT.FONT_TOTAL_WIN, cc.Font);
            totalCpt.font = font;
        } else {
            var font = cc.resources.get(dd.tdk_resCfg.FONT.FONT_TOTAL_FAILED, cc.Font);
            totalCpt.font = font;
        }
        cc.log('tdk_player_ui::showResult: line:177 totalV=', totalV, ',result=', result);
        totalCpt.string = totalV;

        //飘字特效
        var resultActNode = this.node.getChildByName('result');
        resultActNode.active = true;
        var actCpt = resultActNode.getComponent(cc.Label);
        actCpt.string = resultStr;
        if (result >= 0) {
            actCpt.string = '+' + resultStr;
            resultActNode.color = cc.color(230, 228, 83);
        } else {
            actCpt.string = '-' + resultStr;
            resultActNode.color = cc.color(150, 150, 136);
        }
        var moveTo = cc.moveTo(1, cc.v2(resultActNode.x, resultActNode.y + 80));
        var seq = cc.sequence(moveTo, cc.callFunc(function () {
            resultActNode.active = false;
            resultActNode.y = resultActNode.y - 50;
            if (callBack) {
                callBack();
            }
        }))
        resultActNode.runAction(seq);
    },

    showCostChip: function (num) {
        cc.log('[ui]tdk_player_ui::showCostChip:num=', num);
        this.doBet(num, true);
    },

    winnerGetCost: function (endPos, callFunc) {
        var self = this;
        self.chip_list.forEach(function (chipNode) {
            var chipAreaNode = cc.find(self.chipAreaName);
            var endPt = chipAreaNode.parent.convertToNodeSpace(self.node.parent.parent.convertToWorldSpace(endPos));
            var moveTo = cc.moveTo(0.7, endPt);
            var scaleTo = cc.scaleTo(0.7, 0);

            var seq = cc.sequence(cc.spawn(moveTo, scaleTo), cc.delayTime(2), cc.callFunc(function () {
                if (callFunc) {
                    chipNode.active = false;
                    callFunc();
                }
            }));
            // act_map.push({node:chipNode, act:moveTo});
            chipNode.runAction(seq);

        })
    },

    getHeadPos() {
        return this.http_url_img.node.getPosition();
    },

    showWinNum: function (num) {
        var totalNode = cc.find('score', this.node);
        var totalCpt = totalNode.getComponent(cc.Label);
        if (cc.dd._.isUndefined(num)) {
            num = 0;
        }
        if (num >= 0) {
            var font = cc.resources.get(dd.tdk_resCfg.FONT.FONT_TOTAL_WIN, cc.Font);
            totalCpt.font = font;
        } else {
            var font = cc.resources.get(dd.tdk_resCfg.FONT.FONT_TOTAL_FAILED, cc.Font);
            totalCpt.font = font;
        }
        totalCpt.string = num;
    },

    /**
     * 筹码数字转换
     */
    changeNumToCHN: function (num) {
        var str = '';
        if (num >= 100000) {
            str = (num / 10000).toFixed(2) + '万';
        } else {
            str = num;
        }
        return str;
    },

    showAllIn: function (state) {
        var allInNode = cc.find('allin', this.node.parent)
        if (allInNode) {
            allInNode.active = state;
        }
    },

    resetPokerScorePt: function (cnt) {
        var pokerScoreNode = cc.find('pokerScore', this.node.parent);
        var scale = 1;
        if (gameData._selfId == this.userId) {
            scale *= this.selfPokerScale;
        } else {
            scale *= this.otherPokerScale;
        }
        var allPokerWidth = this.getPokerWidth();
        var posx = this.pokerLeft + allPokerWidth;
        if (this.isRightAreaPlayer(this.seatId)) {
            posx = -posx;
        }
        if (this.userId == cc.dd.user.id) {
            posx = this.slefPokerLeft + allPokerWidth;
        }

        pokerScoreNode.x = posx;
    },

    //更新右半边区域玩家手牌位置
    freshRightHalfPlayerPokerPos: function (mtAct) {
        var cnt = this.pokerNum_list.length;
        if (cnt < 2) {
            return;
        }
        var pt = this.pokerEndPt_list[this.seatId - 1];
        for (var i = 0; i < cnt - 1; i++) {
            var item = this.poker_list[i];
            if (item) {
                // item.node.stopAction(mtAct);
                var posx = pt.x - (cnt - i - 1) * this.pokerSpaceX;
                item.node.setPosition(cc.v2(posx, pt.y));
            }
        }
    },

    //生成有效紙牌實例個數
    vaildPokerNum: function () {
        var cnt = 0;
        for (var i = 0; i < this.poker_list.length; i++) {
            if (this.poker_list[i]) {
                cnt++;
            }
        }
        return cnt;
    },

    setTotalScore: function (score) {
        this._totalScore = score;
    },

    setOpenScore: function (openScore) {
        this._openScore = openScore;
    },

    borrowPoker: function (data) {

    },

    //生成纸牌
    addPoker: function (num, isBorrow, isAct, doneFunc) {
        cc.log('[ui] tdk_player_ui::addPoker:userid:', this.userId, ',pokerid:', num, ',borrow:', isBorrow);

        // addPoker : function (num, isBorrow, isAct, addFunc, doneFunc) {
        // addPoker : function (num, isBorrow, isAct) {
        var self = this;
        this.pokerNum_list.push(num);

        var index = this.pokerNum_list.length - 1;
        var pokerNode = self.createPoker();
        pokerNode.scale = 0.1;
        var cpt = pokerNode.getComponent('tdk_poker_ui');
        cpt.number = num;
        cpt.userId = this.userId;
        cpt.idx = index;
        self.poker_list[index] = cpt;
        cpt.addPokerClickListener(this.pokerClick.bind(this));
        var pokerParent = cc.find('Canvas/tdk_room/pokerNode');
        pokerNode.parent = pokerParent;
        var scale = 1;
        if (gameData._selfId == self.userId) {
            scale = self.selfPokerScale;
        } else {
            scale = self.otherPokerScale;
        }
        // pokerNode.scale = scale;

        if (isBorrow) {
            cpt.showBorrowTag(true);
        }

        var posx = 0;
        var origin = self.pokerEndPt_list[self.seatId - 1];
        //origin.x = origin.x - 247;
        //origin.y = origin.y - 295;
        var zorder = 0;
        var pokerSpaceX = self.getPokerSpaceX();
        if (this.isRightAreaPlayer(this.seatId)) {
            posx = origin.x - index * pokerSpaceX - 247;
            zorder = -index;
        } else {
            posx = origin.x + index * pokerSpaceX - 247;
            zorder = index;
        }
        pokerNode.zIndex = zorder;
        if (typeof isAct == 'undefined' || isAct) {
            var startPt = self.pokerStarPt;
            //cc.log('tdk_player_ui::addPoker:endPt=',self.pokerEndPt_list[self.seatId-1],
            //              ',startPt:',startPt);
            //pokerNode.attr({x:startPt.x,y:startPt.y});
            pokerNode.setPosition(startPt);
            var moveTo = cc.moveTo(0.5, posx, origin.y - 295);
            var scaleTo = cc.scaleTo(0.5, scale);

            var seq = cc.sequence(cc.spawn(moveTo, scaleTo),
                cc.delayTime(0.2), cc.callFunc(function () {
                    if (self.pokerNum_list.length == 3) {
                        self.showScoreFlag(true);
                    }
                    self.showPoker(index, isBorrow);
                    // doneFunc();
                }));
            pokerNode.runAction(seq);
            tdk_am.playEffect(dd.tdk_resCfg.AUDIO_COMMON.AUDIO_CARD);
            cc.log('tdk_player_ui::addPoke1111r:scale=', scale, ',pos=', posx, ',', origin.y);
        } else {//断线重连，发牌不需要动画
            cc.log('tdk_player_ui::addPoker:scale=', scale, ',pos=', posx, ',', origin.y);
            pokerNode.scale = scale;
            pokerNode.x = posx;
            pokerNode.y = origin.y - 295;
            self.showPoker(index, isBorrow);
            self.showScoreFlag(true);
        }
    },

    showPoker: function (index, isBorrow) {
        var self = this;
        var cnt = this.pokerNum_list.length;
        this.pokerNum_list.forEach(function (item, idx) {
            if (idx > 1) {//显示其他玩家第二张之后的手牌
                if (self.isRightAreaPlayer(self.seatId)) {
                    var poker = self.poker_list[cnt - 1 - idx];
                    poker.setFrame(item);
                    poker.showFace();
                    if (isBorrow) {
                        poker.showBorrowTag(true);
                    }
                } else {
                    self.poker_list[idx].setFrame(item);
                    self.poker_list[idx].showFace();
                }
            } else {//显示自己前两张手牌
                if (self.userId == gameData._selfId) {
                    self.poker_list[idx].setFrame(item);

                    if (self.isRightAreaPlayer(self.seatId)) {
                        self.poker_list[idx].showBack(true);
                    } else {
                        self.poker_list[idx].showBack(false);
                    }
                } else {
                    if (self.isRightAreaPlayer(self.seatId)) {
                        self.poker_list[cnt - 1 - idx].showBack(true);
                    } else {
                        self.poker_list[idx].showBack(true);
                    }
                }
            }
        });
    },

    pokerClick: function () {
        cc.log('tdk_player_ui::pokerClick:isPokerFace=', this.isPokerFace);
        this.isPokerFace = !this.isPokerFace;
        this.poker_list.forEach(function (item, i) {
            if (i < 2) {
                item.flop();
            }
        });
        this.changePokerScore();
    },

    changePokerScore: function () {
        cc.log('tdk_player_ui::changePokerScore:isPokerFace=', this.isPokerFace);
        var scoreNode = cc.find('pokerScore/score', this.node.parent);
        var cpt = scoreNode.getComponent(cc.Label);
        var str = cpt.string + '';
        cc.log('tdk_player_ui::changePokerScore:str=', str);
        var value = 0;
        var end = '';
        var pos = str.indexOf('(');
        if (pos >= 0) {
            end = str.substr(pos);
        }
        if (this.isPokerFace) {
            value = this._totalScore;
        } else {
            value = this._openScore;
        }
        cc.log('tdk_player_ui::changePokerScore:pos=', pos, ',str=', str, ',value=', value, ',end=', end);
        cpt.string = value + end;
    },

    //test
    test_showallpoker: function (arr) {
        var self = this;
        arr.forEach(function (item) {
            self.addPoker(item, false);
        });
    },

    //头像上显示气泡
    doSpeak: function (str) {
        var bubble = cc.find('dialog', this.node.parent);
        var ani = bubble.getComponent(cc.Animation);
        ani.play();
        var lbl = cc.find('lbl', bubble);
        lbl.getComponent(cc.Label).string = str;
    },

    //更新下注金额
    freshCostChip: function () {
        var lblNode = cc.find('chipInfo/lbl', this.node.parent);
        lblNode.getComponent(cc.Label).string = this.costChip;
    },

    //下注
    doBet: function (num, isAct) {
        this.costChip += num;
        this.freshCostChip();

        this.getChipType(num);
        var self = this;
        var act_map = [];
        var totalChip = 0;
        var chipAltas = cc.resources.get(dd.tdk_resCfg.ATLASS.ATS_CHIPS, cc.SpriteAtlas);
        for (var n = 0; n < this.costChipData_list.length; n++) {
            var item = this.costChipData_list[n];
            for (var i = 0; i < item.cnt; i++) {
                totalChip++;
                var chipNode = self.createChip();
                chipNode.scale = 1.0;
                chipNode.active = true;
                var chipNumNode = cc.find('num', chipNode);
                var numStr = item.type;
                var numcpt = chipNumNode.getComponent(cc.LabelOutline);
                numcpt.color = item.color;
                chipNumNode.getComponent(cc.Label).string = numStr;
                var rotation = Math.random() * 360;
                chipNumNode.setRotation(rotation);
                self.chip_list.push(chipNode);
                var sprite = chipAltas.getSpriteFrame('chip_btn_' + (item.index));
                var cpt = chipNode.getComponent(cc.Sprite);
                cpt.spriteFrame = sprite;
                var chipAreaNode = cc.find(this.chipAreaName);
                chipNode.parent = chipAreaNode;
                var randx = Math.floor(10 - Math.random() * (20 + 1)) / 10 * Math.random();
                var randy = Math.floor(10 - Math.random() * (20 + 1)) / 10 * Math.random();
                var x = randx * chipAreaNode.width / 2;
                var y = randy * chipAreaNode.height / 2;
                if (typeof isAct == 'undefined') {
                    var startPt_x = this.http_url_img.node.x;
                    var startPt_y = this.http_url_img.node.y;
                    var startPt = chipAreaNode.convertToNodeSpace(self.node.convertToWorldSpace(cc.v2(startPt_x, startPt_x)));

                    chipNode.setPosition(cc.v2(startPt.x, startPt.y));

                    var moveTo = cc.moveTo(0.5, cc.v2(x, y));
                    // act_map.push({node:chipNode, act:moveTo});
                    chipNode.runAction(cc.sequence(moveTo, cc.delayTime(0.2), cc.callFunc(function () {
                    })));

                    if (totalChip < 2) {
                        tdk_am.playEffect(dd.tdk_resCfg.AUDIO_COMMON.AUDIO_BET);
                    } else {
                        tdk_am.playEffect(dd.tdk_resCfg.AUDIO_COMMON.AUDIO_CHIP_END);
                    }
                } else {
                    chipNode.setPosition(cc.v2(x, y));
                }
            }
        }
    },

    offLine: function (state) {
        var node = cc.find('off-line', this.node);
        node.active = state;
    },

    //计算本次下注筹码规格
    getChipType: function (num) {
        this.costChipData_list.splice(0, this.costChipData_list.length);
        this.costChipData_list = [];
        var tmp_num = num;
        for (var i = 0; i < this.chipType_list.length; i++) {
            var spec = this.chipType_list[i].type;
            var mul = Math.floor(tmp_num / spec);
            if (mul > 0) {
                this.costChipData_list.push({ type: spec, cnt: mul, index: this.chipType_list[i].index, color: this.chipType_list[i].color });
                tmp_num = tmp_num % spec;
                if (tmp_num == 0) {
                    break;
                }
            }
        }
    },

    //得到筹码的随机位置
    getChipRandomPoint: function () {
        var chipAreaNode = cc.find('Canvas/tdk_room/chipArea');
        var chipPt = chipAreaNode.convertToWorldSpace(cc.v2(0, 0));
        var randx = Math.random();
        var randy = Math.random();
        var x = chipPt.x + randx * chipAreaNode.width;
        var y = chipPt.y + randy * chipAreaNode.height;

        return cc.v2(x, y);
    },

    //清除上局筹码信息
    clearChipInfo: function () {
        this.clearChip();

        this.costChip = 0;
        var lblNode = cc.find('chipInfo/lbl', this.node.parent);
        if (lblNode) {
            lblNode.getComponent(cc.Label).string = this.costChip;
        }
    },

    //设置玩家操作状态
    setPlayerStata: function (state) {
        if (state) {
            var self = this;
            var prefab = cc.resources.get(dd.tdk_resCfg.PREFAB.PRE_COUNTDOWN, cc.Prefab);
            if (this.seatId == 1) {
                prefab = cc.resources.get(dd.tdk_resCfg.PREFAB.PRE_COUNTDOWN_V2, cc.Prefab);
            }
            this.pb = cc.instantiate(prefab);
            this.pb.parent = self.node;
        } else {
            if (this.pb) {
                this.pb.removeFromParent();
                this.pb.destroy();
            }
        }
    },

    /**
     * 获取玩家位置
     */
    getPlayerPos: function () {
        var x = this.node.parent.x;
        var y = this.node.parent.y;
        cc.log('[ui]玩家:', this.userId, '位置为:x=', x, ', y=', y);
        return cc.v2(x, y);
    },

    clearScore: function () {
        this.showScoreFlag(false);
    },

    clearResult: function () {
        var resultNode = cc.find('result', this.node.parent);
        if (resultNode) {
            resultNode.active = false;
        }
    },

    clearPoker: function () {
        this.isPokerFace = false;
        this.setFoldUI(false);
        this.clearScore();
        this.clearResult();
        this.showWinState(false);
        this.showFailedState(false);
        this.showAllIn(false);

        var self = this;
        this.poker_list.forEach(function (item) {
            if (item.node) {
                item.reset();
                item.node.removeFromParent();
                self.pokerPool.put(item.node);
                item = null;
            }
        });
        this.pokerNum_list.splice(0, this.pokerNum_list.length);
    },

    clearChip: function () {
        var self = this;
        this.chip_list.forEach(function (item) {
            if (item) {
                item.removeFromParent();
                self.chipPool.put(item);
            }
        });
        this.chip_list.splice(0, this.chip_list.length);
    },
    /**
     * 获取微信头像精灵帧
     */
    getWxHeadFrame: function () {
        var headFilePath = jsb.fileUtils.getWritablePath() + "head_" + this.openId;
        var texture = cc.textureCache.addImage(headFilePath);
        if (texture) {
            return new cc.SpriteFrame(texture);
        } else {
            cc.error("无微信头像文件,openid:" + this.openId);
        }
    },

    /**
     * 点击玩家
     */
    playerClick: function () {
        if (!this.isVaildClickPlayer) {
            return;
        }
        var spf = this.getHeadSpf();
        var userData = {
            headSpf: spf, //头像spriteFrame
            nick: this.nick, //昵称
            userId: this.userId, //id
            money: HallPropData.getDiamond().toString() || '0', //金币数量
            vip: hallData.getInstance().vipLevel,
            showwin: false,
        }

        cc.dd.UIMgr.openUI(dd.tdk_resCfg.PREFAB.PRE_USER_INFO, function (prefab) {
            var cpt = prefab.getComponent('tdk_user_info');
            cpt.show(userData);
        })
    },

    createMagicPropIcon: function (idx) {
        var atlas = cc.resources.get('gameyj_mj/jilin/py/atlas/jlmj_game_userInfo', cc.SpriteAtlas);
        var magicIcon = new cc.Node("magicIcon");
        var sprite = magicIcon.addComponent(cc.Sprite);
        sprite.spriteFrame = atlas.getSpriteFrame(magicIcons[idx]);
        this.magic_prop_layer.zIndex = 10;
        magicIcon.parent = this.magic_prop_layer;
        // this.magicIcons.push(magicIcon);
        return magicIcon;
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
        startPos = this.magic_prop_layer.parent.convertToNodeSpace(this.node.parent.parent.convertToWorldSpace(startPos));
        endPos = this.magic_prop_layer.parent.convertToNodeSpace(this.node.parent.parent.convertToWorldSpace(endPos));
        magicIcon.setPosition(startPos);
        var moveTo = cc.moveTo(1.0, endPos);
        magicIcon.runAction(cc.sequence(
            moveTo
            , cc.callFunc(function () {
                this.playPropEffect(idx, magicIcon);
            }.bind(this))
        ));
    },

    /**
     * 获取玩家head
     */
    getPlayerHeadPos: function (userID) {
        var cpt = cc.find('Canvas/tdk_room').getComponent('tdk_room_ui');
        if (cpt) {
            var player = cpt.findPlayer(userID);
            if (player) {
                return player.getPlayerPos();
            } else {
                cc.error('找不到指定id的用户头像 id=', userID);
            }
        } else {
            cc.error('Canvas/tdk_room 无挂tdk_room_ui脚本');
            return null;
        }
    },

    playPropEffect: function (idx, magicIcon) {
        //todo:后续加载对象池
        magicIcon.destroy();
        this.magic_prop.parent.zIndex = 10;
        var magic_prop_ani_node = cc.instantiate(this.magic_prop);
        var magic_prop_ani = magic_prop_ani_node.getComponent(cc.Animation);
        magic_prop_ani.node.active = true;
        magic_prop_ani.node.parent = this.node;
        magic_prop_ani.play('magic_prop_' + idx);
        magic_prop_ani.on('finished', function () {
            magic_prop_ani.node.destroy();
        });
        AudioManager.playSound(PropAudioCfg[idx]);
    },
    onEventMessage: function (event, data) {
        switch (event) {
            case WxEvent.DOWNLOAD_HEAD:
                if (this.openId == data[0]) {
                    cc.log('[ui]玩家：', this.userId,
                        ', 昵称:', this.nick,
                        ', openId:', this.openId,
                        ', 头像：', this.headUrl, '头像下载完毕');
                    this.http_url_img.spriteFrame = this.getWxHeadFrame();
                    this.http_url_img.node.width = 100;
                    this.http_url_img.node.height = 100;
                }
                break;
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
            // case dd.UserInfoUtil.propEvent.PROP_SHOW:
            //     this.propShow(data);
            //     break;
            // case dd.UserInfoUtil.propEvent.PROP_FORBID:
            //     this.propForbid(data);
            //     break;
            // case dd.UserInfoUtil.propEvent.PROP_RESUME:
            //     this.propResume(data);
            //     break;
            default:
                break;
        }
    },

    clearPool: function () {
        if (this.pokerPool && this.pokerPool.size() > 0) {
            for (var i = 0; i < this.pokerPool.size(); i++) {
                var node = this.pokerPool.get();
                node.destroy();
            }
        }
        if (this.chipPool && this.chipPool.size() > 0) {
            for (var i = 0; i < this.chipPool.size(); i++) {
                var node = this.chipPool.get();
                node.destroy();
            }
        }
    },


    clearPlayer: function () {
        this.setFoldUI(false);
        this.setReadOkUI(false);
        this.setPlayerStata(false);
        this.clearPool();
        this.node.removeFromParent();
        this.node.destroy();
    },

    onDestroy: function () {
        cc.log('tdk_layer_ui::onDestory!');
        this.pokerPool.clear();
        this.chipPool.clear();
        WxED.removeObserver(this);
        ChatEd.removeObserver(this);
        RecordEd.removeObserver(this);
        // dd.UserInfoUtil.removeObserver(this);
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
        this.duanyu_label.getComponent(cc.Label).string = cfg.text;
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
        this.biaoqing.active = true;
        this.biaoqing.parent.zIndex = 10;
        var cpt = this.biaoqing.getComponent(cc.Animation)
        cpt.play("emotion_" + id);
        setTimeout(function () {
            this.biaoqing.active = false;
        }.bind(this), 3 * 1000);
    },

    /**
     * 是否正在聊天
     */
    isChating: function () {
        return this.biaoqing.active || this.duanyu_node.active;
    },

    play_yuyin: function (duration) {
        this.yuyin_laba.active = true;
        this.yuyin_laba.setYuYinSize(duration);
        setTimeout(function () {
            this.yuyin_laba.active = false;
        }.bind(this), duration * 1000);
    },
});
