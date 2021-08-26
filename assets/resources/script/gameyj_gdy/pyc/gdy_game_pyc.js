
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var gdyData = require('gdy_game_data').GDY_Data;
var gdyED = require('gdy_game_data').GDY_ED;
var GDY_Event = require('gdy_game_data').GDY_Event;
var jlmj_prefab = require('jlmj_prefab_cfg');
const dissolveUI = 'gameyj_ddz/pyc/prefabs/ddz_dissolve';
var HallCommonObj = require('hall_common_data');
var HallCommonEd = HallCommonObj.HallCommonEd;
var HallCommonEvent = HallCommonObj.HallCommonEvent;
var Define = require('Define');
var RoomED = require("jlmj_room_mgr").RoomED;
var RoomEvent = require("jlmj_room_mgr").RoomEvent;
var gdyutil = require('gdy_util');
var gdySound = require('gdySound');
var AudioManager = require('AudioManager');
const manPrefix = 'gameyj_ddz/common/audio/man/';
const womanPrefix = 'gameyj_ddz/common/audio/woman/';

cc.Class({
    extends: cc.Component,
    properties: {
        paiAtlas: { type: cc.SpriteAtlas, default: null, tooltip: "牌图集" },
        dark_node: { type: cc.Node, default: null, tooltip: "桌面剩余牌的父节点" },
        darkPoker: { type: cc.Prefab, default: null, tooltip: '桌面剩余牌的预制' },
        cardsNode: { type: cc.Node, default: null, tooltip: "牌组" },
        beiNode: { type: cc.Label, default: null, tooltip: "倍数" },
    },
    onLoad: function () {
        this.initObserverED();
        this.initInfo();
        this.initBtns(false);
        this.schedule(this.sendLocationInfo, 30);//发送位置信息
    },

    onDestroy: function () {
        gdyED.removeObserver(this);
        HallCommonEd.removeObserver(this);
        RoomED.removeObserver(this);
    },

    initInfo: function () {
        this.infoDesk();
        this.initPlayer();
    },

    initBtns: function (bl) {
        //聊天
        cc.find('btns/chat', this.node).active = bl;
        //记牌器
        //cc.find('btns/jipaiqi', this.node).active = bl;
    },

    /**
    * 注册事件
    */
    initObserverED: function () {
        gdyED.addObserver(this);
        HallCommonEd.addObserver(this);
        RoomED.addObserver(this);
    },

    /**
     * 初始化玩家信息
     */
    initPlayer: function () {
        var playerlist = gdyData.Instance().getPlayerList();
        if (!playerlist) return;
        for (var i = 0; i < playerlist.length; ++i) {
            var player = playerlist[i];
            if (player)
                this.updatePlayer(player);
        }
    },

    /**
     * 初始化UI脚本
     */
    initUiScript: function () {
        this._uiComponents = [];
        this._uiComponents.push(this.node.getComponentInChildren('gdy_pyc_down'));
        this._uiComponents.push(this.node.getComponentInChildren('gdy_pyc_right'));
        var roleCount = gdyData.Instance().getPlayerNum();
        var up = this.node.getComponentInChildren('gdy_pyc_up');
        var left = this.node.getComponentInChildren('gdy_pyc_left');
        if (roleCount == 4) {
            this.cardNodePos();
            up.Head().view_idx = 2;
            left.Head().view_idx = 3;
            this._uiComponents.push(up);
        } else {
            up.Head().view_idx = 3;
            left.Head().view_idx = 2;
        }
        this._uiComponents.push(left);
    },

    /**
     * 四人牌桌发牌点的位置
     */
    cardNodePos: function () {
        if (this.cardsNode)
            this.cardsNode.y = 100;
    },

    /**
     * 刷新所有玩家头像信息
     */
    refreshHead: function () {
        RoomMgr.Instance().gameStart = true;
        var playerList = gdyData.Instance().getPlayerList();
        for (var i = 0; i < playerList.length; ++i) {
            var view = this.idToView(playerList[i].userId);
            var player = this._uiComponents[view];
            if (player)
                player.Head().updateUI();
        }
    },

    /**
     * 显示局数
     */
    showCurrentn: function () {
        var descNode = cc.find('ruleNode/rule_bg/descNode', this.node);
        cc.find('roundcount', descNode).getComponent(cc.Label).string = gdyData.Instance().GetCurrentnNum() + '/' + gdyData.Instance().GetBureauNum();
    },

    /**
     * 显示房间号
     */
    showRoomID: function () {
        var roomNode = cc.find('prepare/FangJangHao/bg/haoshu', this.node);
        if (roomNode)
            roomNode.getComponent(cc.Label).string = RoomMgr.Instance().roomId;
        var rule = RoomMgr.Instance()._Rule;
        if (!rule) return;
        var str = gdyData.Instance().getGuzeInfo();
        var guzeNode = cc.find('prepare/GuZe', this.node);
        if (guzeNode) {
            cc.find('RenShu', guzeNode).getComponent(cc.Label).string = '干瞪眼-' + rule.roleCount + '人';
            cc.find('JuShu', guzeNode).getComponent(cc.Label).string = '共' + rule.circleNum + '局';
            cc.find('WanFa1', guzeNode).getComponent(cc.Label).string = str;
        }

    },

    /**
     * 游戏开始前清理桌子
     */
    cleanDesk: function () {
        cc.find('prepare', this.node).active = false;
    },

    /**
     * 显示邀请和准备按钮
     */
    showBtn: function (player) {
        var isfull = gdyData.Instance().isFullSeat();
        var wuxinBtn = cc.find('prepare/Botton/weixin', this.node);
        var startBt = cc.find('prepare/Botton/start', this.node);
        if (!isfull) {
            wuxinBtn.active = true;
        } else {
            wuxinBtn.active = false;
        }
        if (player && player.userId == cc.dd.user.id)
            startBt.active = !player.bready;
    },

    /**
     * 显示桌面剩余牌数量
     */
    showPokerNum: function () {
        var pokerNum = gdyData.Instance().GetCardNum();
        this.setPokerNum(pokerNum);
    },

    /**
     * 设置桌面牌的数量
     */
    setPokerNum: function (num) {
        cc.find('cardsNode', this.node).active = true;
        var cardNode = cc.find('cardsNode/lbl', this.node);
        if (cardNode) {
            cardNode.getComponent(cc.Label).string = num;
            cardNode.y = num * 1.67;
        }
    },

    /**
     * 获取玩家
     * @param id 玩家uiseID
     */
    idToView: function (id) {
        return gdyData.Instance().idToView(id);
    },

    /**
     * 回调事件
     */
    onEventMessage: function (event, data) {
        switch (event) {
            case GDY_Event.PLAYER_ENTER: //玩家进入
            case GDY_Event.PLAYER_EXIT: //玩家退出
            case GDY_Event.PLAYER_READY: //玩家准备
            case GDY_Event.PLAYER_ISONLINE: //玩家离线状态
            case GDY_Event.TUOGUAN: //托管
                this.updatePlayer(data);
                break;
            case RoomEvent.on_coin_room_enter: //开始(金币场)
                this.initPlayer();
                break;
            case GDY_Event.PLAYER_DISSOLUTION:// 自己离开房间
                this.backToHall();
                break;
            case GDY_Event.RECONNECT: //重连
                this.reconnect(data);
                break;
            case GDY_Event.DISSOLVE: //解散申请
                this.onDissolve(data, 30);
                break;
            case GDY_Event.DISSOLVE_RESULT: //解散结果
                this.dissolveResult(data);
                break;
            case HallCommonEvent.HALL_NO_RECONNECT_GAME: //断线恢复后当局已结算
                this.reconnectHall();
                break;
            case GDY_Event.DESK_INIT: //桌子初始化
                this.createDarkPoker(data);
                break;
            case GDY_Event.CHANGE_RATE: //刷新倍数
                this.showBeiShu(data)
                break;
            case GDY_Event.HAND_POKER: //开始发牌
                this.handPoker(data);
                break;
            case GDY_Event.CHANGE_GUAN: //玩家被关状态改变
                this.changeGuan(data);
                break;
            case GDY_Event.ACT_ACK: //操作返回
                this.outPoker(data);
                break;
            case GDY_Event.RESULT_RET: //小结算
                this.showSettlement(data);
                break;
            case GDY_Event.TOTAL_RESULT: //大结算
                this.showResult(data);
                break;
        }
    },

    /**
     * 刷新倍数
     */
    showBeiShu: function (num) {
        if (this.beiNode)
            this.beiNode.string = 'x' + num;
    },

    /**
     * 大结算
     */
    showResult: function (data) {
        gdyData.Instance().isEnd = true;
        gdyData.Instance().IsStart = false;
        gdyData.Instance().lastCards = [];
        gdyData.Instance().lastPlayer = null;

        this.ResultData = data;
        var circleNum = gdyData.Instance().GetBureauNum();
        var roomtype = RoomMgr.Instance().gameId;
        var num = gdyData.Instance().GetCurrentnNum() - 1;
        cc.log('num :', num + 'circleNum', circleNum);
        if (num < circleNum && roomtype == Define.GameType.GDY_FRIEND) {
            this.showResultEvent();
        }
    },

    /**
     * 显示战绩界面
     */
    showResultEvent: function () {
        if (!this.ResultData) return;
        if (!this.result)
            this.result = this.node.getComponentInChildren('gdy_result');
        this.result.initResultInfo(this.ResultData);
        this.ResultData = null;
    },

    /**
     * 显示小结算
     */
    showSettlement: function (data) {
        if (!data) return;
        RoomMgr.Instance().gameStart = false;
        var roomtype = RoomMgr.Instance().gameId;
        if (roomtype == Define.GameType.GDY_GOLD) {
            gdyData.Instance().isSettlement = true;
            gdyData.Instance().IsStart = false;
        }

        //被关动画
        for (var i = 0; i < data.resultList.length; ++i) {
            var role = data.resultList[i];
            if (!role) continue;
            var player = gdyData.Instance().getPlayer(role.id);
            var view = this.idToView(role.id);
            if (player && player.guan) {
                this._uiComponents[view].playQuanGuan();
            }
        }

        //明牌
        data.pokerList.forEach(function (role) {
            var view = this.idToView(role.id);
            if (view > 0)
                this._uiComponents[view].showOutCard(role.pokerList, role.pokerList, -1, true);
        }.bind(this));

        if (!this.settlement)
            this.settlement = this.node.getComponentInChildren('gdy_Settlement');
        this.settlement.InitSettlement(data);
    },

    /**
     * 操作返回
     */
    outPoker: function (data) {
        var curViewid = this.idToView(data.opId);
        var nextviewid = this.idToView(data.nextId);
        cc.log('出牌的消息ID:' + data.opId + ' viewid:' + curViewid);
        cc.log('下家出牌的ID:' + data.nextId + 'viewid:' + nextviewid)
        var pokers = gdyutil.sortOutCards(data.pokerList);
        cc.log("出牌的消息集合: ", pokers);
        this.outCardSound(data.opId, pokers);
        if (pokers.length > 0) {
            gdyData.Instance().lastCards = pokers;
            gdyData.Instance().lastPlayer = curViewid;
        }
        var changepokers = gdyutil.sortOutCards(data.changePokerList);
        var index = this.getChangPokerIndex(pokers, changepokers);
        this._uiComponents[curViewid].showOutCard(pokers, changepokers, index);
        var playTime = data.nextTime;
        cc.log("打牌间隔时间：", playTime);
        this._uiComponents[nextviewid].showPlaying(playTime);
    },

    /**
     * 获取癞子牌下标
     * @param pokerList 原始牌
     * @param changePokerList 变化后的牌
     */
    getChangPokerIndex: function (pokerList, changePokerList) {
        var index = -1;
        if (!pokerList || !changePokerList)
            return index;
        for (var i = 0; i < changePokerList.length; ++i) {
            if (pokerList.indexOf(changePokerList[i]) == -1) {
                index = i;
            }
        }
        if (index == -1) {
            for (var j = changePokerList.length - 1; j > 0; --j) {
                if (changePokerList[j] == changePokerList[j - 1])
                    index = j;
            }
        }
        cc.log('癞子牌下标：', index);
        return index;
    },

    /**
     * 玩家被关状态改变
     */
    changeGuan: function (data) {
        var player = gdyData.Instance().getPlayer(data.id);
        if (player) {
            player.guan = false; //改变玩家被关的状态
            var view = this.idToView(data.id);
            this._uiComponents[view].playSuo();
        }
    },

    /**
     *开始发牌
     */
    handPoker: function (data) {
        //刷新玩家头像
        this.refreshHead();
        if (!data) return;
        cc.log('发牌开始玩家ID:', data.nextId);
        var view = this.idToView(data.nextId);
        this.sendView = view;
        var roleCount = gdyData.Instance().getPlayerNum();
        var num = gdyData.Instance().GetCardNum();
        var irst = (roleCount == 3 && num >= 38) || (roleCount == 4 && num >= 33)
        if (irst) {//首次发牌
            var playerlist = gdyData.Instance().getPlayerList();
            for (var i = 0; i < playerlist.length; ++i) {
                var viewid = this.idToView(playerlist[i].userId);
                if (viewid >= 0)
                    this._uiComponents[viewid].initPokerNum(5);
            }
            this._uiComponents[0].sendPokerFirst(data.listList);
            this.sendPokerAnimation(1, view, data.time);
        } else
            this.sendPokerAnimation(data.cardNum, view, data.time); //发牌动画

    },

    /**
     * 发牌动画逻辑
     */
    sendPokerAnimation: function (num, view, time) {
        var countPoker = num;
        var viewindex = view;
        countPoker--;
        this.reduceDeskCard();
        cc.log("发牌座位ID: ", viewindex);
        this._uiComponents[viewindex].sendPoker();

        if (countPoker <= 0) {
            this._uiComponents[this.sendView].showPlaying(time);
            return;
        }

        var playerNum = gdyData.Instance().getPlayerNum() - 1;
        if (playerNum == viewindex)
            viewindex = 0;
        else
            viewindex++;
        var seq = cc.sequence(cc.delayTime(0.2), cc.callFunc(function () {
            this.sendPokerAnimation(countPoker, viewindex, time);
        }.bind(this)));
        this.node.runAction(seq);
    },

    /**
     * 桌子初始化
     */
    createDarkPoker: function (data) {
        var pokerNum = gdyData.Instance().GetCardNum();
        if (pokerNum <= 0) return;
        var pokerList = pokerNum > 39 ? 39 : pokerNum;
        this.dark_node.removeAllChildren(true);
        for (var i = 0; i < pokerList; ++i) {
            var item = cc.instantiate(this.darkPoker);
            item.active = true;
            this.dark_node.addChild(item);
        }
        this.setPokerNum(pokerList);
        this.initBtns(true);
        //清理桌子信息
        this.cleanDesk();
        gdyData.Instance().IsStart = true;
        this.initPlayer();
        //重连
        this.reconnect(data);
    },

    /**
     * 减少桌面的牌
     */
    reduceDeskCard: function () {
        if (!this.dark_node) return;
        var index = this.dark_node.childrenCount - 1;
        var node = this.dark_node.children[index];
        if (node) {
            node.removeFromParent();
            node.destroy();
        }
        var num = cc.find('cardsNode/lbl', this.node).getComponent(cc.Label).string;
        this.setPokerNum(parseInt(num) - 1);
    },

    /**
    * 刷新桌面牌的数量
    */
    refreshDeskCard: function () {
        var num = 0;// gdyData.Instance().GetCardNum();
        if (!this.dark_node || num <= 0) return;
        for (var i = this.dark_node.childrenCount - 1; i >= num; i--) {
            var node = this.dark_node.children[i];
            if (node) {
                node.removeFromParent();
                node.destroy();
            }
        }
        cc.find('cardsNode/lbl', this.node).active = false;
    },

    /**
     * 刷新玩家信息
     */
    updatePlayer: function (player) {
        if (!player) return;
        if (!this._uiComponents)
            this.initUiScript();
        if (player.userId == cc.dd.user.id) {
            this.refreshDeskCard();
            var playerlist = gdyData.Instance().getPlayerList();
            if (!playerlist) return;
            playerlist.forEach(function (role) {
                var view = this.idToView(role.userId);
                if (view != null) {
                    this._uiComponents[view].Head().updateUI();
                    this._uiComponents[view].initUI();
                }
            }.bind(this))
        } else {
            var view = this.idToView(player.userId);
            cc.log("刷新玩家 ID:", player.userId + ' view :', view);
            if (player.userId && view != null) {
                this._uiComponents[view].Head().updateUI();
                this._uiComponents[view].initUI();
            }
        }

        var bl = gdyData.Instance().GetCurrentnNum() > 1 ? true : false;
        if (player.userId == cc.dd.user.id && bl) {
            this.cleanDesk();
        }
        this.showCurrentn(); //刷新局数
        this.showBtn(player);
    },

    /**
     * 重连
     */
    reconnect: function (data) {
        if (!data) return;
        //解散申请中
        this.reconnectDissolve(data.dissolveTimeout, data.dissolveInfoList);
        //玩家信息
        data.roleListList.forEach(function (player) {
            var viewid = this.idToView(player.id);
            if (viewid == 0)
                this._uiComponents[viewid].sendPokerFirst(player.pokerList); //自己手牌
            var index = this.getChangPokerIndex(player.outPokerList, player.changePokerList);
            //玩家出牌
            if (player.changePokerList[0] == 0)
                player.changePokerList = player.outPokerList;
            this._uiComponents[viewid].showOutCard(player.outPokerList, player.changePokerList, index);
            this._uiComponents[viewid].initPokerNum(player.pokerNum);//手牌数量
            this._uiComponents[viewid].showZhuang(player.zhuang);//是否庄家
            if (!player.guan)
                this._uiComponents[viewid].playSuo(); //是否被关

            //获桌面上最大出的牌
            if (gdyutil.compareCards(gdyData.Instance().lastCards, player.outPokerList)) {
                var poker = player.outPokerList[0] == 0 ? [] : player.outPokerList;
                gdyData.Instance().lastCards = poker;
                gdyData.Instance().lastPlayer = viewid;
            }
        }.bind(this));

        //倒计时
        var view = this.idToView(data.opId);
        if (data.opId != 0 && view >= 0)
            this._uiComponents[view].showPlaying(data.nextTime > 0 ? data.nextTime : 20);

    },

    //重连时游戏已结束
    reconnectHall: function () {
        this.backToHall();
    },

    /**
     * 断线重连--解散申请
     * @param tiem 倒计时
     * @param dissolveInfolist 玩家解散数据数组
     */
    reconnectDissolve: function (tiem, dissolveInfolist) {
        if (dissolveInfolist.length == 0) {
            return;
        }
        for (var i = 0; i < dissolveInfolist.length; ++i) {
            this.onDissolve(dissolveInfolist[i], tiem);
        }
    },

    /**
     * 解散房间申请
     */
    onDissolve(msg, time) {
        this.closePopupView();
        var UI = cc.dd.UIMgr.getUI(dissolveUI);
        if (UI) {
            UI.getComponent('ddz_dissolve').setData(msg);
        }
        else {
            cc.dd.UIMgr.openUI(dissolveUI, function (ui) {
                var timeout = time ? time : 30;
                var playerList = gdyData.Instance().getPlayerList();
                ui.getComponent('ddz_dissolve').setStartData(timeout, playerList, msg);
            });
        }
    },

    /**
     * 解散返回
     */
    dissolveResult(msg) {
        var isDissolve = msg.isDissolve;
        gdyData.Instance().isDissolved = isDissolve;
        if (isDissolve == true) {
            cc.dd.PromptBoxUtil.show('房间解散成功!');
        }
        else {
            cc.dd.PromptBoxUtil.show('房间解散失败!');
        }
        cc.dd.UIMgr.destroyUI(dissolveUI);

    },

    closePopupView: function () {
        cc.dd.UIMgr.closeUI(jlmj_prefab.JLMJ_TANCHUANG);
    },

    /**
     * 点击桌子事件
     */
    onClickBg: function () {
        cc.find('ruleNode/room_info', this.node).active = true;
        cc.find('ruleNode/rule_bg', this.node).active = false;
        this._uiComponents[0].clearAllSelectCards();
    },

    //返回大厅
    backToHall: function (event, data) {
        gdyData.Destroy();
        cc.dd.SceneManager.enterHall();
    },

    //设置牌值
    setPoker: function (prefab, cardValue) {
        prefab.getChildByName('lord').active = false;
        var value = Math.floor(cardValue / 10);
        var flower = cardValue % 10;
        var hua_xiao = prefab.getChildByName('hua_xiao');
        var hua_da = prefab.getChildByName('hua_da');
        var num = prefab.getChildByName('num');
        if (value == 17)
            value = 3;
        switch (value) {
            case 0:
                prefab.getChildByName('beimian').active = true;
                break;
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
            case 14:
            case 16:
            case 11:
            case 12:
            case 13:
                prefab.getChildByName('beimian').active = false;
                if (flower % 2 == 0) {
                    num.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_r' + value.toString());
                }
                else {
                    num.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_b' + value.toString());
                }
                hua_da.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('hs_' + flower.toString());
                hua_xiao.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('hs_' + flower.toString());
                hua_xiao.active = true;
                break;
            case 18:
                prefab.getChildByName('beimian').active = false;
                hua_xiao.active = false;
                if (cardValue == 180) {
                    num.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_b' + 17);
                    hua_da.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_jokerxiao');
                } else if (cardValue == 181) {
                    num.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_r' + 17);
                    hua_da.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_jokerda');
                }
                break;
        }
    },

    /**
     *  初始化桌子信息 
     */
    infoDesk: function () {
        if (RoomMgr.Instance().gameId == Define.GameType.GDY_FRIEND) {
            var descNode = cc.find('ruleNode/rule_bg/descNode', this.node);
            cc.find('baseScore', descNode).getComponent(cc.Label).string = gdyData.Instance().getScore();
            cc.find('roomId', descNode).getComponent(cc.Label).string = RoomMgr.Instance().roomId;
            var wanfan = cc.find('type', descNode).getComponent(cc.Label);
            wanfan.string = gdyData.Instance().getPlayerNum() + '人,' + gdyData.Instance().getGuzeBei();
            var layoutNode = cc.find('layout', descNode);
            var rule = RoomMgr.Instance()._Rule;
            if (!rule) return;
            cc.find('ruanzha', layoutNode).active = rule.ruanSan;
            cc.find('quanguan', layoutNode).active = rule.quanguan;
            cc.find('bicai', layoutNode).active = rule.biCard;
            cc.find('zhabei', layoutNode).active = rule.bombDouble;
            cc.find('wangzha', layoutNode).active = rule.wangDouble;
            cc.find('voice', layoutNode).active = rule.limitTalk;
            cc.find('gps', layoutNode).active = rule.gps;
            this.showCurrentn();
            this.showRoomID();
        }
        this.showBeiShu(0);
    },

    /**
     * 播放音效
     * @param sex 性别
     * @param type 出牌类型
     * @param index 牌值
     */
    firstplaySound: function (sex, type, index) {
        var path = null;
        var cfglist = gdySound.getItemList(function (itrem) {
            if (itrem.type == type) {
                return itrem;
            }
        });

        var str = '';
        for (var i = 0; i < cfglist.length; ++i) {
            if (cfglist[i].value == index) {
                str = cfglist[i].soundName;
            }
        }

        if (sex == 1) {
            path = manPrefix + str;
        } else if (sex == 0) {
            path = womanPrefix + str;
        }
        console.log('播放音效----paht : ' + path);
        AudioManager.getInstance().playSound(path, false);
    },

    /**
     * 播放音效
     * @param sex 性别
     * @param type 出牌类型
     */
    playSound: function (sex, type) {
        var path = null;
        var cfg = gdySound.getItem(function (itrem) {
            if (itrem.type == type) {
                return itrem;
            }
        });
        var str = cfg.soundName;
        if (sex == 0) {
            path = manPrefix + str;
        } else if (sex == 1) {
            path = womanPrefix + str;
        }

        console.log("出牌类型音效：" + path);
        AudioManager.getInstance().playSound(path, false);
    },

    /**
     * 出牌音效
     * @param id 玩家ID
     * @param pokers 出牌集合
     */
    outCardSound: function (id, pokers) {
        var sex = gdyData.Instance().getPlayer(id).sex;
        if (pokers.length > 0) {
            if (gdyData.Instance().lastPlayer == this.idToView(id) || !gdyData.Instance().lastCards || gdyData.Instance().lastCards.length == 0) {
                var analysis = gdyutil.analysisCards(pokers);
                switch (analysis.type) {
                    case 1://单牌
                    case 2://对子
                        this.firstplaySound(sex, analysis.type, analysis.index);
                        break;
                    case 3://单顺
                    case 4://对顺
                    case 5://炸弹
                        this.playSound(sex, analysis.type, 0);
                        break;
                }
            }
            else {
                var analysis = gdyutil.analysisCards(pokers);
                var lastanalysis = gdyutil.analysisCards(gdyData.Instance().lastCards);
                var typeSame = analysis.type == lastanalysis.type;
                switch (analysis.type) {
                    case 1://单牌
                    case 2://对子
                        this.firstplaySound(sex, analysis.type, analysis.index);
                        break;
                    case 3://单顺
                    case 4://对顺
                        this.playSound(sex, analysis.type, 0);
                        break;
                    case 5://炸弹
                        this.playSound(sex, analysis.type, 0);
                        break;
                }
            }
        }
        else {
            var num = parseInt((Math.random() * 4)) + 8;
            cc.log("不要类型：", num);
            this.playSound(sex, num);
        }
    },

    //更新经纬度
    sendLocationInfo() {
        var roomtype = RoomMgr.Instance().gameId;
        if (roomtype != Define.GameType.GDY_GOLD) return;
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
                cc.log("详细地址：位置 " + adress);
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
                cc.log("详细地址：位置 " + adress);
                if (parseInt(latitude) != 0 || parseInt(longitude) != 0) {
                    pbData.setLatlngInfo(loc);
                }
                pbData.setAddress(adress);
            }
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_player_location_req, pbData, 'msg_player_location_req', true);
        }
    },

});


