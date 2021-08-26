let hall_audio_mgr = require('hall_audio_mgr').Instance();
let twoeight_Data = require('twoeight_data').twoeight_Data.Instance();
let twoeight_send_msg = require('net_sender_twoeight');
let RoomMgr = require('jlmj_room_mgr').RoomMgr;
var ChatEd = require('jlmj_chat_data').ChatEd;
var ChatEvent = require('jlmj_chat_data').ChatEvent;
let tw_audio_cfg = require('tw_audio_cfg');
let AudioManager = require('AudioManager');
let TE_Event = require('twoeight_data').TE_Event;
var rank_info = require('rank_info');
let TE_ED = require('twoeight_data').TE_ED;
let RoomED = require("jlmj_room_mgr").RoomED;
let game_room = require("game_room");
let jlmj_prefab = require('jlmj_prefab_cfg');
let RoomEvent = require("jlmj_room_mgr").RoomEvent;
let twoeight_chip = require('twoeight_chip');
let hall_prop_data = require('hall_prop_data').HallPropData;
let HallCommonObj = require('hall_common_data');
let HallCommonData = HallCommonObj.HallCommonData.getInstance();

// const { fail } = require('assert');
let HallCommonEd = HallCommonObj.HallCommonEd;
let HallCommonEvent = HallCommonObj.HallCommonEvent;
let SysED = require("com_sys_data").SysED;
let SysEvent = require("com_sys_data").SysEvent;
var rule_config = require('klb_rule');

const chipList = [[100, 200, 500, 1000, 2000], [10000, 20000, 50000, 100000, 500000], [1000000, 5000000, 10000000]];


let gameConfig = require("br_this_bar_base");
var CfgItem = gameConfig.getItem(function (item) {
    return item.key === 201;
});


const INIT_CHIPNUM = 1000;
const INIT_BANKERCOIN = CfgItem.req_banker_min_gold;
cc.Class({
    extends: cc.Component,
    properties: {
        titleSprite: { default: [], type: cc.SpriteFrame, tooltip: "庄闲列表标题" },
        chipPoolNode: { default: null, type: cc.Node, tooltip: "桌上筹码" },
        resultfonts: { default: [], type: cc.Font, tooltip: "上座玩家输赢字体" },
        resultPic: { default: [], type: cc.SpriteFrame, tooltip: "上座玩家输赢背景" },
        cardPrefab: { default: null, type: cc.Prefab, tooltip: "麻将牌" },

        roomStateSprite: { default: [], type: cc.SpriteFrame, tooltip: "房间状态" },
        selectChips: { default: [], type: cc.SpriteFrame, tooltip: "高亮筹码" },
        chipPrefab: { default: null, type: cc.Prefab, tooltip: "筹码" },
        pokerAtlas: { default: null, type: cc.SpriteAtlas, tooltip: "麻将牌图集" },
        splist_zhanji: { default: [], type: cc.SpriteFrame, tooltip: "牌型输赢图标" },
        splist_chip: { default: [], type: cc.SpriteFrame, tooltip: "金币筹码" },
        card_type: { default: [], type: cc.SpriteFrame, tooltip: "牌型(豹子、天杠)" },
        splist_reqbank: { default: [], type: cc.SpriteFrame, tooltip: "上下庄按钮图标" },
        splist_btn: { default: [], type: cc.SpriteFrame, tooltip: "我要上庄图片图标" },
        splist_shengfu: { default: [], type: cc.SpriteFrame, tooltip: "玩家输赢文字" },
        fontlist_win_lose: { default: [], type: cc.Font, tooltip: "玩家输赢文字" },
        // prizePoolSprite: { default: [], type: cc.SpriteFrame, tooltip: "奖池标题" },
        banker_gold_pool: { default: null, type: cc.Label, tooltip: "庄家奖池" },
        player_gold_pool: { default: null, type: cc.Label, tooltip: "闲家奖池" },
        // progressBarView: { default: null, type: cc.ProgressBar, tooltip: "下注总额" },
        bankerCoin: { default: INIT_BANKERCOIN, type: cc.Integer, tooltip: "上庄金币数量" },
        bankerItem: { default: null, type: cc.Prefab, tooltip: "申请上庄列表 Item" },
        progressCoin: { default: null, type: cc.ProgressBar, tooltip: "上庄额度进度条" },
        coin_Slider: { default: null, type: cc.Slider, tooltip: '上庄额度滑动条' },
        coin_Number: { default: null, type: cc.Label, tooltip: '上庄携带金币' },
        prizeItem: { default: null, type: cc.Prefab, tooltip: "奖池玩家列表" },
        touziSprite: { default: [], type: cc.SpriteFrame, tooltip: "骰子图片" },
        mj_backItem: { default: null, type: cc.Prefab, tooltip: "剩余麻将" },
        prizePoolUnit: { default: [], type: cc.SpriteFrame, tooltip: "奖池单位" },
        music_Slider: { default: null, type: cc.Slider, tooltip: '音乐滑动条' },
        sound_Slider: { default: null, type: cc.Slider, tooltip: '音效滑动条' },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.dd.SysTools.setLandscape();
        RoomMgr.Instance().player_mgr = twoeight_Data;

        //************************ 筹码对象池 ****************************/
        this._chipPool = new cc.NodePool('chipPool');
        for (var i = 0; i < INIT_CHIPNUM; i++) {
            var node = cc.instantiate(this.chipPrefab);
            this._chipPool.put(node);
        }

        cc.find("bankerView/bg/btns/coin", this.node).getComponent(cc.Label).string = INIT_BANKERCOIN;
        cc.find("bankerView/bg/btns/coin1", this.node).getComponent(cc.Label).string = INIT_BANKERCOIN;

        this.music_Node = cc.find('setting/bg/content/music', this.node);
        this.sound_Node = cc.find('setting/bg/content/sound', this.node);
        this.betArea = [];
        this.betArea[1] = cc.find('main/fknn_tdxh_di01/bet_area', this.node);
        this.betArea[2] = cc.find('main/fknn_tdxh_di02/bet_area', this.node);
        this.betArea[3] = cc.find('main/fknn_tdxh_di03/bet_area', this.node);
        this.node_setting = cc.find('setting', this.node);
        this.node_menu = cc.find('menu', this.node);
        this.btn_menu = cc.find('bottom/right_btns/more', this.node);
        this.msgToggle = cc.find("emoticon/bg/btnGroup/toggle3", this.node)
        this.node_guize = cc.find('guize', this.node);
        this.bankerHeads = [];
        for (var i = 1; i < 11; i++) {
            this.bankerHeads.push(cc.find('top/banker_list/head_' + i + '/head_mask/head', this.node));
        }
        this.tableHeads = [];
        for (var i = 1; i < 9; i++) {
            // cc.find('desktop/head_' + i + '/player', this.node)
            this.tableHeads.push(cc.find('desktop/head_' + i + '/player', this.node));
        }

        this.quota = cc.find('bank_card/quota', this.node);//可下注总额
        this.throwPos = cc.find('bottom/right_btns/people', this.node);
        this.selfHead = cc.find('bottom/mine/head_bg/head_mask/head', this.node);
        this.bankerPos = cc.find('top/txkuang_00', this.node);
        // this.Prog = this.progressBarView.getComponent(cc.ProgressBar);//下注总额
        this.ProgCoin = this.progressCoin.getComponent(cc.ProgressBar);//上庄额度
        this.bankerBtn = cc.find('bankerView/bg/btns/NewButton', this.node);//我要上庄按钮
        this.prizePoolTitle = cc.find('28gang_caijin/28_caijin_txt', this.node);//奖池标题
        this.prizePoolTotal = cc.find('28gang_caijin/num', this.node).getComponent(cc.Label);//奖池总额度
        this.ani_touzi = cc.find('ani_touzi', this.node);//骰子动画节点
        // this.music_butn = cc.find('menu/bg/music', this.node).getComponent(cc.Toggle)
        this.music_bt = cc.find("menu/bg/NewMusic", this.node).getComponent(cc.Button)
        this.time_lbl = cc.find('top/time', this.node).getComponent(cc.Label);
        this.updateTime();
        this.schedule(function () {
            this.updateTime();
        }.bind(this), 5.0);

        // this.betChipArea = [[], [], []];


        //倒计时播放发牌
        this.timeOut = []
        this.timerlist = []


        //麻将发牌顺序
        this.pokerNodes = [];
        this.pokerNodes[0] = cc.find('main/fknn_tdxh_di03/mahjongs', this.node);
        this.pokerNodes[1] = cc.find('bank_card/mahjongs', this.node);
        this.pokerNodes[2] = cc.find('main/fknn_tdxh_di01/mahjongs', this.node);
        this.pokerNodes[3] = cc.find('main/fknn_tdxh_di02/mahjongs', this.node);
        this.effectNode = [true, true, true]

        this.OpenCardList = [];
        this.OpenCardList[0] = cc.find('bank_card/mahjongs', this.node);
        this.OpenCardList[1] = cc.find('main/fknn_tdxh_di01/mahjongs', this.node);
        this.OpenCardList[2] = cc.find('main/fknn_tdxh_di02/mahjongs', this.node);
        this.OpenCardList[3] = cc.find('main/fknn_tdxh_di03/mahjongs', this.node);

        this._chipGroup = 0;
        this._chipIdx = 1;
        TE_ED.addObserver(this);
        RoomED.addObserver(this);
        SysED.addObserver(this);
        ChatEd.addObserver(this);
        HallCommonEd.addObserver(this);
        this.initMusicAndSound();
    },

    onDestroy() {
        this.node.stopAllActions();
        TE_ED.removeObserver(this);
        RoomED.removeObserver(this);
        SysED.removeObserver(this);
        ChatEd.removeObserver(this);
        HallCommonEd.removeObserver(this);
        AudioManager.getInstance().stopMusic();
        AudioManager.getInstance().stopAllLoopSound();
    },
    /**
     * 事件处理
     * @param {*} event 
     * @param {*} data 
     */
    onEventMessage(event, data) {
        switch (event) {
            case TE_Event.PLAYER_JOIN://玩家进入
                this.playerEnter(data);
                break;
            case TE_Event.PLAYER_EXIT:
                this.playerExit();
                break;
            case TE_Event.ROOM_STATE://游戏状态改变
                if (data == 0) {
                    if ((twoeight_Data.curRound + 1) > 6) {
                        twoeight_Data.curRound = 1
                    } else {
                        ++twoeight_Data.curRound
                    }
                }
                this.updateState(data);
                break;
            case TE_Event.BET://玩家下注
            case TE_Event.BET_OTHER:
                this.playerBet(data);
                break;
            case TE_Event.BANKER_RET://上庄返回
                this.bankRet(data);
                break;
            case TE_Event.UPDATE_REQ_BANKER:
                this.updateReqBankNum();
                break;
            case TE_Event.RESULT://结算
                this.showTurnPoker(data);
                break;
            case TE_Event.RECONNECT://重连
                this.reconnectGame();
                break;
            case TE_Event.RANK_LIST://排行榜
                this.showRanklist(data);
                break;
            case ChatEvent.CHAT:
                this.onChat(data);
                break;
            case RoomEvent.on_room_leave://玩家离开
                this.playerLeave(data[0]);
                break;
            case TE_Event.UPDATE_GOLD://更新金币
                this.hallUpdateCoin(data);
                break;
            case TE_Event.UPDATE_BANKER_LISET://庄家列表
                if (!twoeight_Data.getPlayerById(cc.dd.user.id).isBanker && twoeight_Data.myBankerRank > 0) {
                    cc.dd.PromptBoxUtil.show('您已经下庄');
                    twoeight_Data.myBankerRank = -1;
                }
                this.updateBankerList();
                break;
            case TE_Event.UPDATE_SITE://桌面玩家信息
                this.updateDesktoplist();
                break;
            // case TE_Event.SET_WINSTREAK://连胜标签
            //     this.updateWinStreak(data);
            //     break;
            case TE_Event.UPDATE_BATTLE://历史战绩
                this.updateBattleHistory();
                break;
            case TE_Event.CHIPS_ANIM://座位上玩家投注
                this.sitePlayerBet(data);
                break;
            case TE_Event.SITE_PLAYER://座位上玩家赢钱
                this.sitePlayerWin(data);
                break;
            case HallCommonEvent.HALL_NO_RECONNECT_GAME:
                twoeight_Data.clear();
                cc.dd.SceneManager.enterHall();
                break;
            case SysEvent.PAUSE:
                this._syspausetime = new Date().getTime();
                cc.log('暂停 剩余倒计时:' + this._remainBet);
                break;
            case SysEvent.RESUME:
                if (this._syspausetime != null) {
                    let durtime = (new Date().getTime() - this._syspausetime) / 1000;
                    if (durtime < 10) {
                        if (this._remainBet) {
                            this._remainBet -= durtime;
                            cc.log('恢复 耗时' + durtime + ' 剩余倒计时:' + this._remainBet);
                        }
                    }
                }
                break;
        }
    },
    //重连游戏
    reconnectGame() {
        let configId = twoeight_Data.configId || 20101;
        var ccmjJbcCfgItem = game_room.getItem(function (item) {
            return item.key === configId;
        });
        twoeight_Data.setData(ccmjJbcCfgItem);
        let roomStatus = twoeight_Data.roomStatus;
        this.clearAllTimeOut();
        this.updateSelfInfo();
        this.updateBankerList();
        this.updateDesktoplist();
        this.updateBattleHistory();
        this.updateJackpot();
        cc.find('anim', this.node).children.forEach(element => {
            element.active = false;
        });
        switch (roomStatus) {
            case 0://等待
                this.updateState(roomStatus);
                break;
            case 1://下注
                this.quota.opacity = 255;
                this.resetUI();
                let leftTime = twoeight_Data.leftTime + twoeight_Data.timestamp;
                let date = parseInt(new Date().getTime() / 1000) + HallCommonData.serverTimestamp
                let countDown = leftTime - date;
                if (countDown < 0) {
                    countDown = 0;
                }
                let bank_card = cc.find('bank_card', this.node);
                bank_card.active = true;
                for (var i = 1; i < 4; i++) {
                    var betall = twoeight_Data.posBetTotal[i];
                    if (betall > 0) {
                        this.playerBet({ betId: i, betAdd: betall });
                    }
                }
                this.setTimerBet(countDown - 1);
                if (twoeight_Data.isJoin == 0) {
                    cc.find('anim/wait_end', this.node).active = true;
                    cc.find('bank_card/room_state', this.node).active = false;
                }
                break;
            case 2://结算
            case 3:
                var animState = this.ani_touzi.getComponent(cc.Animation).getAnimationState('ani_touzi');
                if (animState) {
                    animState.on('stop', (event) => {
                        this.ani_touzi.opacity = 0
                    }, this);
                }
                this._forbidenResult = true;
                this.resetUI();
                // this.updateBattleHistory();
                cc.find('anim/wait_end', this.node).active = true;
                cc.find('bank_card/room_state', this.node).active = false;
                break;
        }
    },
    //清除定时翻盘
    clearAllTimeOut() {
        for (let i = 0; i < this.timeOut.length; i++) {
            clearTimeout(this.timeOut[i]);
        }
        for (let j = 0; j < this.timerlist.length; j++) {
            clearTimeout(this.timerlist[j]);
        }
    },
    //更新奖池
    updateJackpot() {
        this.banker_gold_pool.string = twoeight_Data.bankerJackpot;
        this.player_gold_pool.string = twoeight_Data.playerJackpot;
    },
    //设置上座玩家信息
    updateDesktoplist() {
        let sitelist = twoeight_Data.sitelist;
        for (var j = 0; j < sitelist.length; j++) {
            let { userId, siteId } = sitelist[j];
            let i = siteId - 1
            let header_node = cc.find('head_bg/head_mask/head', this.tableHeads[i]);
            if (!userId) {
                this.tableHeads[i].getChildByName('ani_touxiang').active = false;
                header_node.getComponent(cc.Sprite).spriteFrame = null;
                header_node.tagname = -1;
                this.tableHeads[i].active = false;
                this.tableHeads[i].getChildByName('tag').active = false;
                this.tableHeads[i].parent.getChildByName('seat').active = true;
            } else if (header_node.tagname != userId) {
                let player = twoeight_Data.getPlayerById(userId);
                if (player) {
                    header_node.tagname = userId;
                    header_node.getComponent(cc.Sprite).spriteFrame = null;
                    this.tableHeads[i].getChildByName('ani_touxiang').active = (userId == cc.dd.user.id);
                    cc.dd.SysTools.loadWxheadH5(header_node.getComponent(cc.Sprite), player.headUrl);
                    this.tableHeads[i].getChildByName('tag').active = false;
                    this.tableHeads[i].active = true;
                    cc.find('name_bg/name', this.tableHeads[i]).getComponent(cc.Label).string = cc.dd.Utils.substr(player.name, 0, 4);
                    this.tableHeads[i].parent.getChildByName('seat').active = false;
                    let textBg = cc.find('numdi_honr', this.tableHeads[siteId - 1])
                    textBg.getComponent(cc.Sprite).spriteFrame = null
                    cc.find('winGold', textBg).getComponent(cc.Label).string = ""
                }

            }
            header_node.off('click');
            header_node.on('click', this.onClickHead, this);
        }
    },
    // 连胜标签
    updateWinStreak() {

        // //重置连胜标签
        // for (let i = 0; i < 7; i++) {
        //     cc.find('tag', this.tableHeads[i]).active = false;
        // }
        let sitelist = twoeight_Data.sitelist;
        let winStreaklist = twoeight_Data.winStreaklist;
        for (let i = 0; i < sitelist.length; i++) {
            let { userId, siteId } = sitelist[i];
            let tagNode = cc.find('tag', this.tableHeads[siteId - 1]);
            tagNode.active = false;
            for (let j = 0; j < winStreaklist.length; j++) {
                let id = winStreaklist[j].userId;
                if (id == userId && winStreaklist[j].count > 1) {
                    tagNode.active = true;
                    let text = tagNode.getChildByName("text").getComponent(cc.Label);
                    switch (winStreaklist[j].count) {
                        case 2:
                            text.string = '二连胜';
                            break
                        case 3:
                            text.string = '三连胜';
                            break
                        case 4:
                            text.string = '四连胜';
                            break
                        case 5:
                            text.string = '五连胜';
                            break
                        case 6:
                            text.string = '六连胜';
                            break
                        case 7:
                            text.string = '七连胜';
                            break
                        case 8:
                            text.string = '八连胜';
                            break
                        case 9:
                            text.string = '九连胜';
                            break
                        default:
                            text.string = '十连胜';
                            break
                    }
                    break;
                }
            }
        }
    },
    //筹码飞动画
    chipsFly() {
        let flyTime = 1;
        let waitTime = 0.1;
        let winbankerlist = twoeight_Data.getIsWinBankerList();
        let bwinlist = [];
        let bloselist = [];
        winbankerlist.forEach(element => {
            if (element.isWinBanker == 2) {
                bloselist.push(element.id);
            }
            else {
                bwinlist.push(element.id);
            }
        });
        let totalChipNum = 0;
        for (var i = 0; i < 3; i++) {
            totalChipNum += twoeight_Data.betChipArea[i].length;
        }
        let curChipNum = 0;
        if (bwinlist.length > 0 && bloselist.length > 0) {
            for (var i = 0; i < bwinlist.length; i++) {
                var id = bwinlist[i];
                for (var j = 0; j < twoeight_Data.betChipArea[id - 1].length; j++) {
                    let betArea = twoeight_Data.betChipArea[id - 1][j]
                    var endpos = this.bankerPos.convertToWorldSpaceAR(cc.v2(0, 0)).sub(this.chipPoolNode.convertToWorldSpaceAR(cc.v2(0, 0)));
                    if (++curChipNum == totalChipNum) {
                        betArea.getComponent(twoeight_chip).fly2Remove(0, flyTime, endpos, this._chipPool, this.showResult.bind(this));
                        AudioManager.getInstance().playSound(tw_audio_cfg.COMMON.shouchouma, false);
                    }
                    else {
                        betArea.getComponent(twoeight_chip).fly2Remove(0, flyTime, endpos, this._chipPool, null);
                    }
                }
            }
            for (var i = 0; i < bloselist.length; i++) {
                var id = bloselist[i];
                for (var j = 0; j < twoeight_Data.betChipArea[id - 1].length; j++) {
                    let betArea = twoeight_Data.betChipArea[id - 1][j]
                    var endpos = this.throwPos.convertToWorldSpaceAR(cc.v2(0, 0)).sub(this.chipPoolNode.convertToWorldSpaceAR(cc.v2(0, 0)));
                    if (++curChipNum == totalChipNum) {
                        betArea.getComponent(twoeight_chip).fly2Remove(flyTime + waitTime, flyTime, endpos, this._chipPool, this.showResult.bind(this));
                    }
                    else {
                        betArea.getComponent(twoeight_chip).fly2Remove(flyTime + waitTime, flyTime, endpos, this._chipPool, null);
                    }
                }
            }
            setTimeout(() => {
                AudioManager.getInstance().playSound(tw_audio_cfg.COMMON.shouchouma, false);
            }, 1100)
        }
        else if (bwinlist.length > 0) {
            for (var i = 0; i < bwinlist.length; i++) {
                var id = bwinlist[i];
                for (var j = 0; j < twoeight_Data.betChipArea[id - 1].length; j++) {
                    let betArea = twoeight_Data.betChipArea[id - 1][j]
                    var endpos = this.bankerPos.convertToWorldSpaceAR(cc.v2(0, 0)).sub(this.chipPoolNode.convertToWorldSpaceAR(cc.v2(0, 0)));
                    if (++curChipNum == totalChipNum) {
                        betArea.getComponent(twoeight_chip).fly2Remove(flyTime + waitTime, flyTime, endpos, this._chipPool, this.showResult.bind(this));
                        setTimeout(() => {
                            AudioManager.getInstance().playSound(tw_audio_cfg.COMMON.shouchouma, false);
                        }, 1100)
                    }
                    else {
                        betArea.getComponent(twoeight_chip).fly2Remove(flyTime + waitTime, flyTime, endpos, this._chipPool, null);
                    }
                }
            }
        }
        else if (bloselist.length > 0) {
            for (var i = 0; i < bloselist.length; i++) {
                var id = bloselist[i];
                for (var j = 0; j < twoeight_Data.betChipArea[id - 1].length; j++) {
                    let betArea = twoeight_Data.betChipArea[id - 1][j]
                    var endpos = this.throwPos.convertToWorldSpaceAR(cc.v2(0, 0)).sub(this.chipPoolNode.convertToWorldSpaceAR(cc.v2(0, 0)));
                    if (++curChipNum == totalChipNum) {
                        betArea.getComponent(twoeight_chip).fly2Remove(flyTime + waitTime, flyTime, endpos, this._chipPool, this.showResult.bind(this));
                        setTimeout(() => {
                            AudioManager.getInstance().playSound(tw_audio_cfg.COMMON.shouchouma, false);
                        }, 1100)
                    }
                    else {
                        betArea.getComponent(twoeight_chip).fly2Remove(flyTime + waitTime, flyTime, endpos, this._chipPool, null);
                    }
                }
            }
        }
        if (totalChipNum == 0) {
            this.showResult()
        }
    },
    /**
    * 开牌
    * @param {*} msg 
    */
    showTurnPoker(msg) {
        if (this._forbidenResult) {
            return;
        }
        // this.betArea.forEach(item => item.opacity = 0);
        this.chipPoolNode.opacity = 0;
        this.quota.opacity = 0;
        this.bigwinlist = msg.winList;
        let pokersList = msg.pokersList;
        let getBeilv = function (type) {
            if (type == 0) {
                return 1;
            }
            else if (type < 10) {
                return type;
            }
            else {
                return 10;
            }
        };
        let setCardType = (node, type) => {
            if (type == 10) {
                cc.find('type', node).active = false;
                cc.find('msz', node).getComponent(cc.Sprite).spriteFrame = this.card_type[0]
                cc.find('msz', node).active = true;
            } else if (type == 11) {
                cc.find('type', node).active = false;
                cc.find('msz', node).getComponent(cc.Sprite).spriteFrame = this.card_type[1]
                cc.find('msz', node).active = true;
            } else {
                cc.find('type', node).getComponent(cc.Label).string = type + ":";
                cc.find('type', node).active = true;
                cc.find('msz', node).active = false;
            }
        }
        pokersList.forEach(data => {
            if (data.id < 4) {
                let banker_poker_node = cc.instantiate(this.cardPrefab)
                var banker_poker_type = cc.find('ribbon', banker_poker_node);
                for (var i = 0; i < data.pokersList.length; i++) {
                    this.setPokerBack(banker_poker_node.children[i], data.pokersList[i], i);


                }
                setCardType(banker_poker_type, data.pokerType);
                let parent = this.OpenCardList[data.id]
                banker_poker_node.parent = parent
            }
        });
        var touzi1 = msg.diceList[0];
        var touzi2 = msg.diceList[1];

        cc.find('touzi_1_node/touzi_1', this.ani_touzi).getComponent(cc.Sprite).spriteFrame = this.touziSprite[touzi1 - 1];
        cc.find('touzi_2_node/touzi_2', this.ani_touzi).getComponent(cc.Sprite).spriteFrame = this.touziSprite[touzi2 - 1];
        this.ani_touzi.opacity = 255;
        this.ani_touzi.getComponent(cc.Animation).off('finished', null);
        this.ani_touzi.getComponent(cc.Animation).on('finished', () => {
            var startPos = (touzi1 + touzi2) % 4;
            let newArr = [...this.pokerNodes.slice(startPos, this.pokerNodes.length), ...this.pokerNodes.slice(0, startPos)];




            let pokerAnimaPlay = (j) => {
                for (let i = 0; i < this.OpenCardList.length; i++) {
                    let item = cc.find('mj_xl', this.OpenCardList[i])
                    if (item) {
                        let itemAnim = item.getComponent(cc.Animation)
                        itemAnim.off("finished")
                        itemAnim.on("finished", () => {
                            let poker = twoeight_Data.getPokersById(i);
                            if (poker) {
                                AudioManager.getInstance().playSound(tw_audio_cfg.PAIXING[poker.type], false);
                                if (i == 0) {
                                    if (poker.type == 11) {
                                        let isBanker = twoeight_Data.getPlayer(cc.dd.user.id).isBanker
                                        if (isBanker) {
                                            let mj_ligh = cc.find('top/banker_gold_pool/numkuang-di/28gang_mj_light', this.node);
                                            mj_ligh.active = true;
                                        }
                                    }
                                } else {
                                    if (poker.type == 11 && twoeight_Data.posBetMe[j] > 10000) {
                                        let mj_ligh = cc.find('top/player_gold_pool/numkuang-di/28gang_mj_light', this.node);
                                        mj_ligh.active = true;
                                    }
                                }
                                if (i == this.OpenCardList.length - 1) {
                                    setTimeout(() => {
                                        // this.betArea.forEach(item => item.opacity = 255)
                                        this.chipPoolNode.opacity = 255
                                        this.showSitePlayerWin();
                                    }, 1000)
                                }
                            }

                        }, this)
                        this.timerlist[i] = setTimeout(() => {
                            itemAnim.play()
                        }, i * 2000)
                    } else {
                        this.updateState(3)
                        for (let k = 0; k < this.timeOut.length; k++) {
                            clearTimeout(this.timeOut[k]);
                        }
                        break
                    }

                }
            }

            let animState = cc.find('anim/wait_end', this.node).active
            for (let j = 0; j < newArr.length; j++) {
                if (animState) break;
                this.timeOut[j] = setTimeout(() => {
                    if (animState) return;
                    let backItem = cc.instantiate(this.mj_backItem)
                    let idx = twoeight_Data.curRound
                    let itemNode = cc.find('bank_card/surplus/item' + idx, this.node)
                    let mj_back = cc.find('mj_back' + (j + 1), itemNode);
                    let parent = cc.find('main', this.node);
                    backItem.parent = parent
                    this.moveN1toN2(backItem, mj_back);
                    var moveTopos = this.convertNodeSpaceAR(backItem, newArr[j]);
                    let action = cc.spawn(cc.moveTo(0.5, moveTopos).easing(cc.easeExponentialOut()), cc.scaleTo(0.5, 1, 1).easing(cc.easeExponentialOut()));
                    mj_back.active = false;
                    AudioManager.getInstance().playSound(tw_audio_cfg.COMMON.SendCard, false);
                    let animState = cc.find('anim/wait_end', this.node).active
                    if (!animState) {
                        backItem.runAction(
                            cc.sequence(action, cc.callFunc(() => {
                                newArr[j].active = true;
                                backItem.removeFromParent(true);
                                if (j == newArr.length - 1) {
                                    pokerAnimaPlay(j)
                                }
                            })
                            ))
                    }
                }, j * 250)
            }
        }, this);

        this.ani_touzi.getComponent(cc.Animation).play('ani_touzi');
        AudioManager.getInstance().playSound(tw_audio_cfg.COMMON.touzi, false);

    },
    /** 把 node1移动到 node2的位置 */
    moveN1toN2(node1, node2) {
        node1.position = node1.parent.convertToNodeSpaceAR(node2.parent.convertToWorldSpaceAR(node2.position))
    },
    /** 获取把 node1移动到 node2位置后的坐标 */
    convertNodeSpaceAR(node1, node2) {
        return node1.parent.convertToNodeSpaceAR(node2.parent.convertToWorldSpaceAR(node2.position))
    },
    /**
     * 游戏状态更新
     * @param {*} roomState 
     */
    updateState(roomState) {
        cc.find('anim', this.node).children.forEach(element => {
            element.active = false;
        });
        if (roomState != 1) {
            cc.find('bank_card/timer', this.node).active = false;
            this.unschedule(this.setTimerBetSchedule);
        }
        switch (roomState) {
            case 0:     //等待
                this._forbidenResult = false;
                twoeight_Data.historyBet = twoeight_Data.posBetMe;
                twoeight_Data.resetData();
                this.resetUI();
                this.updateSelfInfo();
                this.updateBankerList();
                this.updateJackpot();
                cc.find('top/bank_btn', this.node).getComponent(cc.Button).interactable = true;
                cc.find('bank_card/room_state', this.node).active = false;
                cc.find('anim/wait_end', this.node).active = true;
                break;
            case 1:     //下注
                this._forbidenResult = false;
                this.setTimerBet(14);
                cc.find('bank_card/room_state', this.node).getComponent(cc.Sprite).spriteFrame = this.roomStateSprite[0]
                cc.find('bank_card/room_state', this.node).active = true;
                this.quota.opacity = 255;
                break;
            case 2:     //结算
                cc.find('bank_card/room_state', this.node).getComponent(cc.Sprite).spriteFrame = this.roomStateSprite[1]
                cc.find('bank_card/room_state', this.node).active = true;
                break;
            case 3:     //等待
                cc.find('anim/wait_end', this.node).active = true;
                cc.find('bank_card/room_state', this.node).active = false;
                break;
        }
    },
    //更新顶部庄列表
    updateBankerList() {
        var bankerlist = twoeight_Data.bankerList;
        bankerlist.sort((a, b) => a.gold - b.gold);
        for (var i = 0; i < this.bankerHeads.length; i++) {
            if (!bankerlist[i]) {
                this.bankerHeads[i].getComponent(cc.Sprite).spriteFrame = null;
                this.bankerHeads[i].tagname = -1;
                this.bankerHeads[i].parent.parent.active = false
            }
            else if (this.bankerHeads[i].tagname != bankerlist[i].userId) {
                let player = twoeight_Data.getPlayerById(bankerlist[i].userId)
                if (player) {
                    this.bankerHeads[i].tagname = bankerlist[i].userId;
                    this.bankerHeads[i].getComponent(cc.Sprite).spriteFrame = null;
                    cc.dd.SysTools.loadWxheadH5(this.bankerHeads[i].getComponent(cc.Sprite), player.headUrl);
                    this.bankerHeads[i].parent.parent.active = true
                }
            }
        }

        let maxbet = bankerlist.length == 0 ? INIT_BANKERCOIN : INIT_BANKERCOIN * bankerlist.length
        cc.find('max_bet', this.quota).getComponent(cc.Label).string = parseInt(maxbet / 100) * 100;
        var xianlist = twoeight_Data.getBankerList(false);
        cc.find('bottom/right_btns/people/num', this.node).getComponent(cc.Label).string = xianlist.length.toString();
        this.updateReqBankNum();
    },
    //玩家下注
    playerBet(msg) {
        let result = msg.result;
        var bet_pos = msg.betId;
        var add = msg.betAdd;

        if (result != null) {//自己
            let mycoin = twoeight_Data.getPlayerById(cc.dd.user.id).coin;
            let mytbet = twoeight_Data.getMyBetTotal();
            this.initChipList(msg.gold, mytbet);
            if (result == 0) {

                var sp = this.getChipSprite(add, true);
                if (sp) {
                    this.singleBet(bet_pos, sp, false, true);
                }
                else {
                    let values = [];//下注值列表，去重加排序
                    for (var i = 0; i < chipList.length; i++) {
                        for (var j = 0; j < chipList[i].length; j++) {
                            if (values.indexOf(chipList[i][j]) == -1) {
                                values.push(chipList[i][j]);
                            }
                        }
                    }
                    values.sort((a, b) => { return a - b; });
                    let chips = [];//筹码列表(贪心法)
                    for (var i = values.length - 1; i > -1 && add > 0; i--) {
                        if (add >= values[i]) {
                            var num = Math.floor(add / values[i]);
                            for (var j = 0; j < num; j++) {
                                chips.push(values[i]);
                            }
                            add -= num * values[i];
                        }
                    }
                    while (chips.length) {
                        var random_idx = Math.floor(Math.random() * chips.length);
                        var chip = chips.splice(random_idx, 1);
                        var sp = this.getChipSprite(chip[0], false);
                        this.singleBet(bet_pos, sp, false, true);
                    }
                }
                if (msg.betAdd >= chipList[2][0]) {
                    AudioManager.getInstance().playSound(tw_audio_cfg.COMMON.BETGold, false);
                } else {
                    AudioManager.getInstance().playSound(tw_audio_cfg.COMMON.BETChip, false);
                }
                //玩家下注显示粒子动画
                let bool = this.effectNode[bet_pos - 1]
                let betCoin = twoeight_Data.posBetMe[bet_pos]
                if (betCoin >= 10000 && bool) {
                    this.effectNode[bet_pos - 1] = false
                    let effectChildren = this.betArea[bet_pos].parent.getChildByName("ani_28gang_tz").getComponent(cc.Animation)
                    effectChildren.play()
                    let chipsAnim = cc.find('top/player_gold_pool/numkuang-di/tz_glow', this.node);
                    chipsAnim.active = true;
                }

                let chip_blue = twoeight_Data.posBetMe.some(item => item >= 10000)
                if (chip_blue) {
                    let chips = cc.find('top/player_gold_pool/numkuang-di/chip_blue', this.node)
                    cc.dd.ShaderUtil.setNormalShader(chips);
                }
                twoeight_Data.getPlayerById(cc.dd.user.id).coin = msg.gold;
                cc.find('bottom/mine/gold_bg/gold', this.node).getComponent(cc.Label).string = cc.dd.Utils.getNumToWordTransform(msg.gold);
            }
            else if (result == -1) {
                cc.dd.PromptBoxUtil.show('押注已达上限');
            }
            else if (result == -2) {
                cc.dd.PromptBoxUtil.show('下注时间已过');
            }
            else if (result == -3) {
                cc.dd.PromptBoxUtil.show('金币不足');
            }
        }
        else {//其他人
            if (add == 0)
                return;
            let values = [];//下注值列表，去重加排序
            for (var i = 0; i < chipList.length; i++) {
                for (var j = 0; j < chipList[i].length; j++) {
                    if (values.indexOf(chipList[i][j]) == -1) {
                        values.push(chipList[i][j]);
                    }
                }
            }
            values.sort((a, b) => { return a - b; });
            let chips = [];//筹码列表(贪心法)
            for (var i = values.length - 1; i > -1 && add > 0; i--) {
                if (add >= values[i]) {
                    var num = Math.floor(add / values[i]);
                    for (var j = 0; j < num; j++) {
                        chips.push(values[i]);
                    }
                    add -= num * values[i];
                }
            }
            while (chips.length) {
                var random_idx = Math.floor(Math.random() * chips.length);
                var chip = chips.splice(random_idx, 1);
                var sp = this.getChipSprite(chip[0], false);
                this.singleBet(bet_pos, sp, true, false);
            }
            if (msg.betAdd >= chipList[2][0]) {
                AudioManager.getInstance().playSound(tw_audio_cfg.COMMON.BETGold, false);
            } else {
                AudioManager.getInstance().playSound(tw_audio_cfg.COMMON.BETChip, false);
            }
        }
        this.updateBetScore(bet_pos);
    },
    //座位上玩家投注
    sitePlayerBet(data) {
        let { gold, siteId, seatId } = data;
        let values = [];//下注值列表，去重加排序
        for (var i = 0; i < chipList.length; i++) {
            for (var j = 0; j < chipList[i].length; j++) {
                if (values.indexOf(chipList[i][j]) == -1) {
                    values.push(chipList[i][j]);
                }
            }
        }
        values.sort((a, b) => { return a - b; });
        let chips = [];//筹码列表(贪心法)
        for (var i = values.length - 1; i > -1 && gold > 0; i--) {
            if (gold >= values[i]) {
                var num = Math.floor(gold / values[i]);
                for (var j = 0; j < num; j++) {
                    chips.push(values[i]);
                }
                gold -= num * values[i];

            }
        }
        while (chips.length) {
            var random_idx = Math.floor(Math.random() * chips.length);
            var chip = chips.splice(random_idx, 1);
            var sprite = this.getChipSprite(chip[0], false);
            var betArea = this.betArea[seatId];
            var startpos = this.tableHeads[siteId - 1].convertToWorldSpaceAR(cc.v2(0, 0)).sub(this.chipPoolNode.convertToWorldSpaceAR(cc.v2(0, 0)));
            const chipWidth = 34;
            var betpos = cc.v2(-betArea.width / 2 + chipWidth + Math.random() * (betArea.width - 2 * chipWidth), -betArea.height / 2 + chipWidth + Math.random() * (betArea.height - 2 * chipWidth));
            var betAreaPos = betArea.convertToWorldSpaceAR(cc.v2(betpos))
            let endpos = this.chipPoolNode.convertToNodeSpaceAR(betAreaPos)
            let node = this.getChipNode();
            let sp = node.getComponent(cc.Sprite);
            sp.enabled = false;
            sp.spriteFrame = sprite;
            twoeight_Data.betChipArea[seatId - 1].push(node)
            node.getComponent(twoeight_chip).fly(startpos, endpos, this.chipPoolNode, 0);
        }
        if (data.gold >= chipList[2][0]) {
            AudioManager.getInstance().playSound(tw_audio_cfg.COMMON.BETGold, false);
        } else {
            AudioManager.getInstance().playSound(tw_audio_cfg.COMMON.BETChip, false);
        }
    },
    //座位上玩家赢钱
    sitePlayerWin(data) {
        let { siteId, gold } = data
        if (gold != 0) {
            let index = gold > 0 ? 0 : 1;
            let textBg = cc.find('numdi_honr', this.tableHeads[siteId - 1])
            textBg.getComponent(cc.Sprite).spriteFrame = this.resultPic[index]
            cc.find('winGold', textBg).getComponent(cc.Label).string = ":" + gold
            cc.find('winGold', textBg).getComponent(cc.Label).font = this.resultfonts[index]
        }
    },
    //更新下注分数
    updateBetScore(pos) {
        let bet_info = twoeight_Data.getBetScore(pos);
        let bet_me = bet_info.me;           //自己下注
        let bet_total = bet_info.total;     //区域总注
        let bet_all = bet_info.all;         //总下注
        if (bet_me) {
            cc.find('my_bet', this.betArea[pos].parent).getComponent(cc.Label).string = bet_me;
        }
        else {
            cc.find('my_bet', this.betArea[pos].parent).getComponent(cc.Label).string = "";
        }
        if (bet_total) {
            cc.find('total_bet/num', this.betArea[pos].parent).getComponent(cc.Label).string = bet_total;
        }
        else {
            cc.find('total_bet/num', this.betArea[pos].parent).getComponent(cc.Label).string = "";
        }
        //投注总额进度条
        var bankerlist = twoeight_Data.bankerList;
        bankerlist.sort((a, b) => a.gold - b.gold);

        let maxbet = bankerlist.length == 0 ? INIT_BANKERCOIN - bet_all : INIT_BANKERCOIN * bankerlist.length - bet_all
        cc.find('max_bet', this.quota).getComponent(cc.Label).string = parseInt(maxbet / 100) * 100
        // this.Prog.progress = bankerlist.length == 0 ? bet_all / INIT_BANKERCOIN : bet_all / (bankerlist[0].gold * bankerlist.length)
    },

    //更新战绩
    updateBattleHistory() {
        let battle_info = twoeight_Data.getBattleList();
        let setBattleItem = (list, id) => {
            let result_node = cc.find('result_node/' + id, this.node);
            list.forEach((ele, idx) => {
                let node = cc.find('item' + (idx + 1) + '/pic', result_node);
                node.getComponent(cc.Sprite).spriteFrame = this.splist_zhanji[ele];
                node.active = true;
            })
        }
        if (battle_info[0].listList.length) {
            if (battle_info[0].listList.length < 6) {
                battle_info.forEach(item => {
                    setBattleItem(item.listList, item.id)
                })
            } else {
                battle_info.forEach(item => {
                    // 获取后六个值
                    let battle = item.listList.slice(-6)
                    setBattleItem(battle, item.id)
                })
            }
        }
    },
    //单个筹码飞出
    singleBet(pos, sprite, delay, self) {
        var betArea = this.betArea[pos];
        let start = self ? this.selfHead : this.throwPos
        var startpos = start.convertToWorldSpaceAR(cc.v2(0, 0)).sub(this.chipPoolNode.convertToWorldSpaceAR(cc.v2(0, 0)));
        const chipWidth = 34;
        var betpos = cc.v2(-betArea.width / 2 + chipWidth + Math.random() * (betArea.width - 2 * chipWidth), -betArea.height / 2 + chipWidth + Math.random() * (betArea.height - 2 * chipWidth));
        var betAreaPos = betArea.convertToWorldSpaceAR(cc.v2(betpos))
        let endpos = this.chipPoolNode.convertToNodeSpaceAR(betAreaPos)
        let time = 0;
        if (delay) {
            time = 0.5 * Math.random();
        }
        let node = this.getChipNode();
        let sp = node.getComponent(cc.Sprite);
        sp.enabled = false;
        sp.spriteFrame = sprite;
        twoeight_Data.betChipArea[pos - 1].push(node)
        node.getComponent(twoeight_chip).fly(startpos, endpos, this.chipPoolNode, time);
    },
    /**
     * 获取筹码sprite
     * @param {Number} betnum 
     * @param {Boolean} isSelf 
     */
    getChipSprite(betnum, isSelf) {
        if (isSelf) {
            let size = chipList[this._chipGroup].length
            for (var i = 0; i < size; i++) {
                if (chipList[this._chipGroup][i] == betnum) {
                    var chips = this._chipGroup == 2 ? 10 + i : (this._chipGroup * 5 + i)
                    return this.splist_chip[chips];
                }
            }
        }
        else {
            let pair_list = [];
            for (var i = 0; i < chipList.length; i++) {
                for (var j = 0; j < chipList[i].length; j++) {
                    if (chipList[i][j] == betnum) {
                        let chipsIndex = i == 2 ? 10 + j : (i * 5 + j)
                        pair_list.push(chipsIndex);
                    }
                }
            }
            if (pair_list.length > 0) {
                let pair = pair_list[Math.floor(Math.random() * pair_list.length)];
                return this.splist_chip[pair];
            }
        }
        return null;
    },
    /**
     * 点击下注
     * @param {*} event 
     * @param {*} custom 
     */
    onClickBet(event, custom) {
        if (this._chipIdx == -1)
            return;
        if (twoeight_Data.roomStatus != 1)
            return;
        if (twoeight_Data.getPlayerById(cc.dd.user.id).isBanker) {
            cc.dd.PromptBoxUtil.show('庄家不能下注!');
            return;
        }
        var pos = parseInt(custom);
        var num = chipList[this._chipGroup][this._chipIdx - 1];
        if (twoeight_Data.getPlayerById(cc.dd.user.id).coin < 100 || num > twoeight_Data.getPlayerById(cc.dd.user.id).coin) {
            cc.dd.PromptBoxUtil.show('金币不足!');
            return;
        }
        if (!num) {
            cc.dd.PromptBoxUtil.show('操作失败!');
        }
        twoeight_send_msg.bet(pos, num);
    },
    //续投
    onClickHistoryBet() {
        if (twoeight_Data.roomStatus != 1)
            return;
        if (twoeight_Data.getPlayerById(cc.dd.user.id).isBanker) {
            cc.dd.PromptBoxUtil.show('庄家不能下注!');
            return;
        }
        let coin = twoeight_Data.getPlayerById(cc.dd.user.id).coin
        for (i = 1; i < 4; i++) {
            let betGold = twoeight_Data.historyBet[i];
            if (betGold > 0 && coin > betGold) {
                twoeight_send_msg.bet(i, betGold);
            }
        }
    },
    /**
       * 点击上座
       * @param {*} event 
       * @param {*} custom 
       */
    onClickSite(event, custom) {
        let player = twoeight_Data.getPlayerById(cc.dd.user.id);
        if (player.coin < 100000) {
            cc.dd.PromptBoxUtil.show('金币不足!');
            return;
        }
        if (player.isBanker) {
            cc.dd.PromptBoxUtil.show('庄家不能上座!');
            return;
        }
        let onDesktop = twoeight_Data.sitelist.find(item => item.userId == cc.dd.user.id);
        if (onDesktop == undefined) {
            let idx = parseInt(custom);
            twoeight_send_msg.deskSite(idx);
        } else {
            cc.dd.PromptBoxUtil.show('您已上座!');
        }
    },
    /**
     * 点击筹码
     * @param {*} event 
     * @param {*} custom 
     */
    onClickChip(event, custom) {
        hall_audio_mgr.com_btn_click();
        var idx = parseInt(custom);
        if (idx && this._chipIdx != idx) {
            if (this._chipGroup < 2) {
                if (this._chipIdx != -1)
                    cc.find('bottom/chips/chip_' + this._chipIdx + '/chip_ani', this.node).active = false;
                this._chipIdx = idx;
                cc.find('bottom/chips/chip_' + this._chipIdx + '/chip_ani', this.node).active = true;
            } else {
                this._chipIdx = idx;
            }

        }
    },
    //下注倒计时
    setTimerBet(time) {
        if (time > 0) {
            this._remainBet = time;
            cc.find('bank_card/timer/num', this.node).getComponent(cc.Label).string = Math.ceil(this._remainBet).toString();
            cc.find('bank_card/timer', this.node).active = true;
            this.schedule(this.setTimerBetSchedule, 1);
        }
        else {
            cc.find('bank_card/timer', this.node).active = false;
            this.unschedule(this.setTimerBetSchedule);
        }
    },
    //倒计时
    setTimerBetSchedule() {
        if (this._remainBet && this._remainBet > 0) {
            cc.find('bank_card/timer/num', this.node).getComponent(cc.Label).string = Math.ceil(this._remainBet).toString();
            if (this._remainBet < 6) {
                AudioManager.getInstance().playSound(tw_audio_cfg.COMMON.START_BET, false);
            }
            this._remainBet -= 1;
        }
        else {
            cc.find('bank_card/timer', this.node).active = false;
            AudioManager.getInstance().playSound(tw_audio_cfg.COMMON.END_BET, false);
            this.unschedule(this.setTimerBetSchedule);
        }
    },
    //背面牌
    setPokerBack(node, cardValue, idx) {
        let paiAtlas = this.pokerAtlas;
        var value = Math.floor(cardValue / 10);
        var num = cc.find('Node_hs', node);
        switch (value) {
            case 0:
                break;
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
                num.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('z_' + value.toString() + '_bin_zsp');
                break;
            case 10:
                num.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('z_baiban');
                break;
            case 11:
                num.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('z_zhong_zsp');
                break;
            case 12:
                num.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('z_fa_zsp');
                break;
        }
    },
    //初始化筹码列表
    initChipList(coin, bet) {
        if (coin <= 100001) {
            this._chipGroup = 0;
        } else if (coin <= 5000001) {
            this._chipGroup = 1;
        }
        else {
            this._chipGroup = 2;
        }
        if (this._chipGroup < 2) {
            //更换筹码
            for (var o = 0; o < 5; o++) {
                let spriteIndex = this._chipGroup * 5 + o
                cc.find('bottom/chips/chip_' + (o + 1), this.node).getComponent(cc.Sprite).spriteFrame = this.selectChips[spriteIndex];
            }
            var change_ani = true;
            for (var l = 0; l < 5; l++) {
                let toggle = cc.find('bottom/chips/chip_' + (l + 1) + '/chip_ani', this.node).active
                if (toggle && coin >= chipList[this._chipGroup][l]) {
                    this._chipIdx = l + 1;
                    change_ani = false;
                    break;
                }
            }

            for (var u = 4; u > -1; u--) {
                let disableNode = cc.find('bottom/chips/chip_' + (u + 1), this.node)
                let chip_ani = cc.find('bottom/chips/chip_' + (u + 1) + '/chip_ani', this.node)

                if (coin < chipList[this._chipGroup][u]) {
                    if (chip_ani.active) {
                        change_ani = true;
                        chip_ani.active = false
                        this._chipIdx = - 1;
                    }
                    disableNode.getComponent(cc.Button).interactable = false;
                    cc.dd.ShaderUtil.setGrayShader(disableNode);
                }
                else {
                    if (change_ani) {
                        chip_ani.active = true;
                        change_ani = false;
                        this._chipIdx = u + 1;
                    }
                    disableNode.getComponent(cc.Button).interactable = true;
                    cc.dd.ShaderUtil.setNormalShader(disableNode);
                }
            }
            cc.find('bottom/chips', this.node).active = true;
            cc.find('bottom/goldBrick', this.node).active = false;
        } else {
            var isChecked = true;
            for (var l = 0; l < 3; l++) {
                let toggle = cc.find('bottom/goldBrick/chip_' + (l + 1), this.node).getComponent(cc.Toggle)
                if (toggle.isChecked) {
                    this._chipIdx = l + 1;
                    isChecked = false;
                    break;
                }
            }
            for (var u = 2; u > -1; u--) {
                let disableNode = cc.find('bottom/goldBrick/chip_' + (u + 1), this.node)
                if (coin < chipList[this._chipGroup][u]) {
                    disableNode.getComponent(cc.Button).interactable = false;
                    cc.dd.ShaderUtil.setGrayShader(disableNode);
                    if (disableNode.getComponent(cc.Toggle).isChecked) {
                        isChecked = true;
                        this._chipIdx = - 1;
                    }
                }
                else {
                    if (isChecked) {
                        isChecked = false;
                        disableNode.getComponent(cc.Toggle).check()
                        this._chipIdx = u + 1;
                    }
                    disableNode.getComponent(cc.Button).interactable = true;
                    cc.dd.ShaderUtil.setNormalShader(disableNode);
                }
            }
            cc.find('bottom/chips', this.node).active = false;
            cc.find('bottom/goldBrick', this.node).active = true;
        }
    },
    //更新金币
    hallUpdateCoin(data) {
        var coin = data.gold;
        let player = twoeight_Data.getPlayerById(cc.dd.user.id);
        if (player) {
            player.coin = coin;
        }
        let _chipGroup = 0;
        if (coin <= 100001) {
            _chipGroup = 0;
        } else if (coin <= 5000001) {
            _chipGroup = 1;
        }
        else {
            _chipGroup = 2;
        }
        if (_chipGroup != this._chipGroup) {
            this._chipGroup = _chipGroup;
            if (this._chipGroup < 2) {
                //更换筹码
                for (var o = 0; o < 5; o++) {
                    let spriteIndex = this._chipGroup * 5 + o
                    cc.find('bottom/chips/chip_' + (o + 1), this.node).getComponent(cc.Sprite).spriteFrame = this.selectChips[spriteIndex];
                    cc.find('bottom/chips/chip_' + (o + 1) + '/chip_ani', this.node).active = false;
                }
                cc.find('bottom/chips/chip_1/chip_ani', this.node).active = true;
                this._chipIdx = 1;
                for (var u = 4; u > -1; u--) {
                    let disableNode = cc.find('bottom/chips/chip_' + (u + 1), this.node)
                    if (coin < chipList[this._chipGroup][u]) {
                        disableNode.getComponent(cc.Button).interactable = false;
                        cc.dd.ShaderUtil.setGrayShader(disableNode);
                    }
                    else {
                        disableNode.getComponent(cc.Button).interactable = true;
                        cc.dd.ShaderUtil.setNormalShader(disableNode);
                    }
                }
                cc.find('bottom/chips', this.node).active = true;
                cc.find('bottom/goldBrick', this.node).active = false;
            } else {
                cc.find('bottom/goldBrick/chip_1', this.node).getComponent(cc.Toggle).check()
                for (var u = 2; u > -1; u--) {
                    let disableNode = cc.find('bottom/goldBrick/chip_' + (u + 1), this.node)
                    if (coin < chipList[this._chipGroup][u]) {
                        disableNode.getComponent(cc.Button).interactable = false;
                        cc.dd.ShaderUtil.setGrayShader(disableNode);
                    }
                    else {
                        disableNode.getComponent(cc.Button).interactable = true;
                        cc.dd.ShaderUtil.setNormalShader(disableNode);
                    }
                }
                cc.find('bottom/chips', this.node).active = false;
                cc.find('bottom/goldBrick', this.node).active = true;
            }

        }


        // this.initChipList(coin);
        cc.find('bottom/mine/gold_bg/gold', this.node).getComponent(cc.Label).string = cc.dd.Utils.getNumToWordTransform(coin);
    },
    //更新自己头像信息
    updateSelfInfo() {
        cc.find('bottom/mine/head_bg/head_mask/head', this.node).tagname = cc.dd.user.id;
        let player = twoeight_Data.getPlayerById(cc.dd.user.id);
        if (!player) {
            cc.error('找不到自己的玩家信息');
            return;
        }
        let name = player.name;
        let coin = player.coin;
        let headUrl = player.headUrl;
        cc.find('bottom/mine/name', this.node).getComponent(cc.Label).string = cc.dd.Utils.substr(name, 0, 7);
        cc.find('bottom/mine/gold_bg/gold', this.node).getComponent(cc.Label).string = cc.dd.Utils.getNumToWordTransform(coin);
        cc.dd.SysTools.loadWxheadH5(cc.find('bottom/mine/head_bg/head_mask/head', this.node).getComponent(cc.Sprite), headUrl);
        let mybet = twoeight_Data.getMyBetTotal();
        this.initChipList(coin, mybet);

    },
    //更新上庄人数
    updateReqBankNum() {
        let player = twoeight_Data.getPlayerById(cc.dd.user.id);
        if (!player) {
            cc.error('找不到自己的玩家信息');
            return;
        }
        let icon_28tong = cc.find('top/banker_gold_pool/numkuang-di/icon_28tong', this.node);
        if (player.isBanker) {
            cc.dd.ShaderUtil.setNormalShader(icon_28tong);
            cc.find('top/bank_btn', this.node).getComponent(cc.Sprite).spriteFrame = this.splist_reqbank[1];
        }
        else {
            cc.dd.ShaderUtil.setGrayShader(icon_28tong);
            cc.find('top/bank_btn', this.node).getComponent(cc.Sprite).spriteFrame = this.splist_reqbank[0];
        }
    },
    //座上玩家赢
    showSitePlayerWin() {
        let mylist = twoeight_Data.resultMineList;
        let player = twoeight_Data.getPlayer(cc.dd.user.id)

        let bwinlist = twoeight_Data.sitePlayerWin;

        let siteWinAnim = (add, nodePos, betIdx) => {
            let values = [];//下注值列表，去重加排序
            for (var i = 0; i < chipList.length; i++) {
                for (var j = 0; j < chipList[i].length; j++) {
                    if (values.indexOf(chipList[i][j]) == -1) {
                        values.push(chipList[i][j]);
                    }
                }
            }
            values.sort((a, b) => { return a - b; });
            let chips = [];//筹码列表(贪心法)
            for (var i = values.length - 1; i > -1 && add > 0; i--) {
                if (add >= values[i]) {
                    var num = Math.floor(add / values[i]);
                    for (var j = 0; j < num; j++) {
                        chips.push(values[i]);
                    }
                    add -= num * values[i];
                }
            }
            while (chips.length) {
                var random_idx = Math.floor(Math.random() * chips.length);
                var chip = chips.splice(random_idx, 1);
                var sprite = this.getChipSprite(chip[0], false);
                var betArea = this.betArea[betIdx];
                const chipWidth = 34;
                var randomPos = cc.v2(-betArea.width / 2 + chipWidth + Math.random() * (betArea.width - 2 * chipWidth), -betArea.height / 2 + chipWidth + Math.random() * (betArea.height - 2 * chipWidth));
                var betAreaPos = betArea.convertToWorldSpaceAR(randomPos)
                var startpos = this.chipPoolNode.convertToNodeSpaceAR(betAreaPos)
                var endpos = nodePos.convertToWorldSpaceAR(cc.v2(0, 0)).sub(this.chipPoolNode.convertToWorldSpaceAR(cc.v2(0, 0)));
                let time = 0;
                let node = this.getChipNode();
                let sp = node.getComponent(cc.Sprite);
                sp.enabled = false;
                sp.spriteFrame = sprite;
                node.getComponent(twoeight_chip).fly(startpos, endpos, this.chipPoolNode, time, true);
            }
        }


        if (bwinlist.length > 0) {
            for (var i = 0; i < bwinlist.length; i++) {
                var site = bwinlist[i];
                let resultList = site.resultList
                if (site.gold > 0) {
                    for (let o = 0; o < resultList.length; o++) {
                        let betArea = resultList[o]
                        let header_node = cc.find('head_bg/head_mask/head', this.tableHeads[site.siteId - 1]);
                        if (betArea.sum > 0 && header_node.tagname == site.userId) {
                            siteWinAnim(betArea.sum, this.tableHeads[site.siteId - 1], betArea.id)
                        }
                    }
                }
                if (i == bwinlist.length - 1) {
                    this.scheduleOnce(() => {
                        cc.find('desktop', this.node).getComponent(cc.Animation).off('finished', null);
                        cc.find('desktop', this.node).getComponent(cc.Animation).on('finished', this.chipsFly, this);
                        cc.find('desktop', this.node).getComponent(cc.Animation).play();
                    }, 0.5)
                }
            }

            if (player && !player.isBanker) {
                let myHead = cc.find("bottom/mine", this.node)
                for (let o = 0; o < mylist.length; o++) {
                    let betArea = mylist[o]
                    if (betArea.sum > 0) {
                        this.chipsFlyMy(betArea.sum, myHead, betArea.id)
                    }
                }
            }

        } else {
            if (player && !player.isBanker) {
                let myHead = cc.find("bottom/mine", this.node)
                for (let o = 0; o < mylist.length; o++) {
                    let betArea = mylist[o]
                    if (betArea.sum > 0) {
                        this.chipsFlyMy(betArea.sum, myHead, betArea.id)
                    }
                }
            }
            this.chipsFly()
        }

    },
    //自己
    chipsFlyMy(add, nodePos, betIdx) {
        let values = [];//下注值列表，去重加排序
        for (var i = 0; i < chipList.length; i++) {
            for (var j = 0; j < chipList[i].length; j++) {
                if (values.indexOf(chipList[i][j]) == -1) {
                    values.push(chipList[i][j]);
                }
            }
        }
        values.sort((a, b) => { return a - b; });
        let chips = [];//筹码列表(贪心法)
        for (var i = values.length - 1; i > -1 && add > 0; i--) {
            if (add >= values[i]) {
                var num = Math.floor(add / values[i]);
                for (var j = 0; j < num; j++) {
                    chips.push(values[i]);
                }
                add -= num * values[i];
            }
        }
        while (chips.length) {
            var random_idx = Math.floor(Math.random() * chips.length);
            var chip = chips.splice(random_idx, 1);
            var sprite = this.getChipSprite(chip[0], false);
            var betArea = this.betArea[betIdx];
            const chipWidth = 34;
            var betAreaPos = cc.v2(-betArea.width / 2 + chipWidth + Math.random() * (betArea.width - 2 * chipWidth), -betArea.height / 2 + chipWidth + Math.random() * (betArea.height - 2 * chipWidth));
            var startpos = betArea.convertToWorldSpaceAR(cc.v2(betAreaPos)).sub(nodePos.convertToWorldSpaceAR(cc.v2(0, 0)));
            var endpos = cc.find('head_bg', nodePos).getPosition();
            let time = 0;
            let node = this.getChipNode();
            let sp = node.getComponent(cc.Sprite);
            sp.enabled = false;
            sp.spriteFrame = sprite;
            node.getComponent(twoeight_chip).fly(startpos, endpos, nodePos, time, true);
        }
        AudioManager.getInstance().playSound(tw_audio_cfg.COMMON.playerWin, false);
    },


    //结算
    showResult() {
        if (twoeight_Data._winBankerTimes == 3 && this.bankerPos) {//通杀
            this.bankerPos.getChildByName('ani_zhuang_win').getComponent(cc.Animation).play();
        }

        var myBet = 0
        for (var i = 1; i < 4; i++) {
            myBet += twoeight_Data.posBetMe[i];
        }
        let isBanker = twoeight_Data.getPlayerById(cc.dd.user.id).isBanker;

        if (myBet > 0 || isBanker) {

            let mylist = twoeight_Data.resultMineList;
            let countlost = () => {
                let lost = 0;
                mylist.forEach(element => {
                    lost += element.sum;
                });
                return lost;
            }

            let myWin = twoeight_Data.meWin > 0 ? twoeight_Data.meWin : countlost();
            let player = twoeight_Data.getPlayerById(cc.dd.user.id)
            let iswin = myWin < 0 ? 1 : 0;
            cc.find('anim/result', this.node).children.forEach(element => {
                element.active = false;
            });
            cc.find('anim/result/win', this.node).getComponent(cc.Sprite).spriteFrame = this.splist_shengfu[iswin];
            if (myWin < 0) {
                AudioManager.getInstance().playSound(tw_audio_cfg.COMMON.AllLose, false);
            }
            else {
                AudioManager.getInstance().playSound(tw_audio_cfg.COMMON.AllWin, false);
            }

            cc.find('anim/result/total', this.node).getComponent(cc.Label).string = this.toThousands(Math.abs(myWin).toString(), ":");
            cc.find('anim/result/total', this.node).getComponent(cc.Label).font = this.fontlist_win_lose[iswin];
            cc.find('bottom/mine/gold_bg/gold', this.node).getComponent(cc.Label).string = cc.dd.Utils.getNumToWordTransform(twoeight_Data.meWin + player.coin);

            cc.find('anim/result', this.node).active = true;
            cc.find('anim/result', this.node).getComponent(cc.Animation).on('finished', () => {
                if (twoeight_Data.lotteryGold > 0) {
                    cc.dd.PromptBoxUtil.show('恭喜获得彩金 ' + this.toThousands(twoeight_Data.lotteryGold));
                }
                cc.find('anim/result', this.node).active = false;
                cc.find('anim/result', this.node).getComponent(cc.Animation).off('finished', null);
            }, this);
            cc.find('anim/result', this.node).getComponent(cc.Animation).play('result');
            twoeight_Data.getPlayerById(cc.dd.user.id).coin = twoeight_Data.meWin + player.coin
        }
        twoeight_Data.bigwinnerlist = this.bigwinlist;
        this.updateWinStreak();
        this.updateJackpot();
    },
    getChipNode() {
        let node = this._chipPool.get();
        if (!node) {
            node = cc.instantiate(this.chipPrefab);
        }
        return node;
    },
    //奖池规则
    showPrizeRule(event) {
        hall_audio_mgr.com_btn_click();
        cc.find('prizeRule', this.node).active = true;
        cc.find('28gang_caijin', this.node).active = false;

    },

    /**
    * 玩家离开
    */
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
                    twoeight_Data.clear();
                    cc.dd.SceneManager.enterHall();
                }.bind(this);
                cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_TANCHUANG, function (ui) {
                    ui.getComponent("jlmj_popup_view").show(str, func, 2);
                }.bind(this));
            }
            else {
                twoeight_Data.clear();
                cc.dd.SceneManager.enterHall();
            }
        }
    },
    //重置UI
    resetUI() {
        let bank_card = cc.find('bank_card', this.node);
        let mahjongs = cc.find('mahjongs', bank_card)
        mahjongs.removeAllChildren()
        cc.find('timer', bank_card).active = false;
        mahjongs.active = false;
        // this.Prog.progress = 0;
        for (var i = 1; i < 4; i++) {
            var pokers = cc.find('mahjongs', this.betArea[i].parent);
            pokers.removeAllChildren();
            this.betArea[i].parent.getChildByName('my_bet').getComponent(cc.Label).string = '';
            cc.find('total_bet/num', this.betArea[i].parent).getComponent(cc.Label).string = ''
            pokers.active = false;
            this.betArea[i].removeAllChildren();
        }
        let surplus = twoeight_Data.curRound;
        let mj_back = cc.find('surplus', bank_card).children
        for (let idx = 0; idx < mj_back.length; idx++) {
            if (idx > (mj_back.length - surplus)) {
                mj_back[idx].active = false
            } else {
                mj_back[idx].active = true
                mj_back[idx].children.forEach(item => item.active = true)
            }
        }
        this.effectNode[0] = true;
        this.effectNode[1] = true;
        this.effectNode[2] = true;

        let chips = cc.find('top/player_gold_pool/numkuang-di/chip_blue', this.node)
        cc.dd.ShaderUtil.setGrayShader(chips);
        let chipsAnim = cc.find('top/player_gold_pool/numkuang-di/tz_glow', this.node)
        chipsAnim.active = false;

        let icon_28tong = cc.find('top/player_gold_pool/numkuang-di/icon_28tong', this.node);
        cc.dd.ShaderUtil.setGrayShader(icon_28tong);
        let mj_ligh = cc.find('top/player_gold_pool/numkuang-di/28gang_mj_light', this.node);
        mj_ligh.active = false;
        let bankermj_ligh = cc.find('top/banker_gold_pool/numkuang-di/28gang_mj_light', this.node);
        bankermj_ligh.active = false;
        this.tableHeads.forEach(item => {
            cc.find('numdi_honr', item).getComponent(cc.Sprite).spriteFrame = ""
            cc.find('numdi_honr', item).active = false
            cc.find('numdi_honr/winGold', item).getComponent(cc.Label).string = ""
        })
        this.chipPoolNode.removeAllChildren();
        this.chipPoolNode.opacity = 255

    },
    //显示申请上庄列表
    showBankerView() {
        let isBanker = twoeight_Data.getPlayerById(cc.dd.user.id).isBanker;
        if (isBanker) {
            twoeight_send_msg.bankReq(2, 0);
            return;
        }
        let reqBankerlist = twoeight_Data.reqBankerlist;
        cc.find('bankerView/bg/scroll/view/content', this.node).removeAllChildren();
        if (reqBankerlist.length) {
            for (let i = 0; i < reqBankerlist.length; i++) {
                let item = reqBankerlist[i]
                let player = twoeight_Data.getPlayer(item.userId);
                if (player) {
                    let row = cc.instantiate(this.bankerItem)
                    row.getChildByName('serial').getComponent(cc.Label).string = i + 1;
                    cc.find('coin/num', row).getComponent(cc.Label).string = item.gold;
                    let head = cc.find('user/head', row).getComponent(cc.Sprite);
                    cc.dd.SysTools.loadWxheadH5(head, player.headUrl);
                    cc.find('user/head', row).tagname = item.userId;
                    cc.find('user/head', row).off('click');
                    cc.find('user/head', row).on('click', this.onClickHead, this);
                    cc.find('user/name', row).getComponent(cc.Label).string = player.name;
                    cc.find('bankerView/bg/scroll/view/content', this.node).addChild(row);
                }
            }

        }
        this.coin_Slider.progress = 1
        this.ProgCoin.progress = 1;
        this.bankerCoin = twoeight_Data.getPlayer(cc.dd.user.id).coin;
        this.coin_Number.getComponent(cc.Label).string = this.bankerCoin
        let isPlayer = twoeight_Data.getBanker(cc.dd.user.id);
        if (!isBanker && !isPlayer) {
            this.bankerBtn.getComponent(cc.Sprite).spriteFrame = this.splist_btn[0];
        } else {
            this.bankerBtn.getComponent(cc.Sprite).spriteFrame = this.splist_btn[1];
        }
        cc.find('bankerView', this.node).active = true;

    },
    //最大最小上庄
    onClickCoinBtns(event, custom) {
        switch (custom) {
            case "min":
                this.bankerCoin = INIT_BANKERCOIN;
                this.coin_Slider.progress = 0;
                this.ProgCoin.progress = 0;
                break;
            case "max":
                this.bankerCoin = twoeight_Data.getPlayer(cc.dd.user.id).coin;
                this.coin_Slider.progress = 1
                this.ProgCoin.progress = 1;
                break;
        }
        this.coin_Number.getComponent(cc.Label).string = this.bankerCoin;
    },
    //申请上庄金币滑块
    bankerCoinSlider() {
        var maxNum = 0;
        let progress = this.coin_Slider.progress
        this.ProgCoin.progress = progress
        maxNum = twoeight_Data.getPlayer(cc.dd.user.id).coin
        if (maxNum != 0) {
            var num = parseInt(progress * maxNum);
            if (num > maxNum)
                num = maxNum;
            this.bankerCoin = num >= INIT_BANKERCOIN ? num : INIT_BANKERCOIN;
            if (progress > 1.0)
                progress = 1.0;
        } else {
            this.bankerCoin = INIT_BANKERCOIN
        }
        this.coin_Number.getComponent(cc.Label).string = this.bankerCoin;


    },
    //申请上庄
    onClickBank(event, custom) {
        let user = twoeight_Data.getPlayerById(cc.dd.user.id);
        if (user.coin < INIT_BANKERCOIN) {
            cc.dd.PromptBoxUtil.show('金币不足，无法上庄！');
            return
        }
        if (!this._bankCD) {
            this._bankCD = true;
            this.scheduleOnce(function () {
                this._bankCD = false;
            }.bind(this), 1);
            let isPlayer = twoeight_Data.getBanker(cc.dd.user.id);
            if (!user.isBanker && !isPlayer) {
                twoeight_send_msg.bankReq(1, this.bankerCoin);
            }
            else {
                twoeight_send_msg.bankReq(2, 0);
            }
        }
    },
    //上庄返回
    bankRet(msg) {
        if (msg.type == 1) {
            switch (msg.result) {
                case 0://成功
                    cc.dd.PromptBoxUtil.show('申请上庄成功');
                    break;
                case -1:
                    cc.dd.PromptBoxUtil.show('金币不足，无法上庄！');
                    break;
                case -2:
                    cc.dd.PromptBoxUtil.show('庄家人数已满');
                    break;
            }
        }
        else if (msg.type == 2) {
            cc.find('top/bank_btn', this.node).getComponent(cc.Button).interactable = false;
            this.updateReqBankNum();
        }
        cc.find('bankerView', this.node).active = false;
    },
    /**
       * 显示规则
       */
    onGuize(event, custom) {
        if (!this.ruleInfo) {
            this.ruleInfo = rule_config.getItem((data) => {
                return data.gameid == twoeight_Data.getGameId();
            });
            cc.find('guize/bg/ScrollView/view/content/RichText', this.node).getComponent(cc.RichText).string = this.ruleInfo.playlaws
        }

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
         * 退出按钮
         */
    onExit(event, custom) {
        hall_audio_mgr.com_btn_click();
        this.node_menu.active = false;
        this.menu_show = false;
        this.btn_menu.interactable = true;
        let player = twoeight_Data.getPlayerById(cc.dd.user.id)
        // if (twoeight_Data.getMyBetTotal() > 0) {
            // cc.dd.DialogBoxUtil.show(0, '退出失败！游戏正在进行中', '确定', '', null, null, '系统提示');
            // cc.dd.DialogBoxUtil.show(0, '强退将暂时扣除' + twoeight_Data.getMyBetTotal() + '金币，用于本局结算，结算后自动返还剩余金币，是否退出？', '是', '否', this.sendLeaveRoom, null, '退出游戏');
        // }
        // else if (player && player.isBanker) {
            // cc.dd.DialogBoxUtil.show(0, '退出失败！游戏正在进行中', '确定', '', null, null, '系统提示');
            // var bankerlist = twoeight_Data.bankerList;
            // bankerlist.sort((a, b) => a.gold - b.gold);
            // cc.dd.DialogBoxUtil.show(0, '强退将暂时扣除' + bankerlist[0].gold + '金币，用于本局结算，结算后自动返还剩余金币，是否退出？', '是', '否', this.sendLeaveRoom, null, '退出游戏');
        // }
        // else {
            this.sendLeaveRoom();
        // }
    },
    //取钱
    clickShop(event, data) {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI('gameyj_ebg/prefab/ebg_game_bag', function (ui) {

        }.bind(this));
    },
    /**
     * 点击菜单
     */
    onMenu(event, custom) {
        hall_audio_mgr.com_btn_click();
        if (!this.menu_show) {
            cc.find('menu', this.node).active = true;
            this.menu_show = true;
            cc.find('menu/click', this.node).active = true;
        }
        else {
            this.menu_show = null;
            cc.find('menu', this.node).active = false;
            cc.find('menu/click', this.node).active = false;
        }
    },
    //点击背景
    onBgClick() {
        if (this.menu_show) {
            cc.find('menu/click', this.node).active = false;
            cc.find('menu', this.node).active = false;
            this.menu_show = null;
        }
    },
    /**
     * 显示设置
     */
    onSetting(event, custom) {
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
    //离开房间
    sendLeaveRoom() {
        var msg = new cc.pb.room_mgr.msg_leave_game_req();
        var gameType = twoeight_Data.getGameId();
        var roomId = twoeight_Data.getRoomId();
        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType(gameType);
        gameInfoPB.setRoomId(roomId);
        msg.setGameInfo(gameInfoPB);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);
    },
    /**
     * 玩家进入
     * @param {*} player 
     */
    playerEnter(player) {
        cc.find('bottom/right_btns/people/num', this.node).getComponent(cc.Label).string = twoeight_Data.getBankerNum(false).toString();
        if (player && player.userId == cc.dd.user.id) {
            this.updateSelfInfo();
        }
    },

    playerExit() {
        cc.find('bottom/right_btns/people/num', this.node).getComponent(cc.Label).string = twoeight_Data.getBankerNum(false).toString();
        this.updateBankerList();
    },
    /**
    * 点击头像
    * @param {*} event 
    */
    onClickHead(event) {
        let player = twoeight_Data.getPlayerById(event.target.tagname);
        if (player < 1) {
            return;
        }
        hall_audio_mgr.com_btn_click();
        RoomMgr.Instance().roomType = 2;
        cc.dd.UIMgr.openUI("gameyj_common/prefab/user_info", function (node) {
            let ui = node.getComponent('user_info_view');
            let siteId = null;
            for (let i = 0; i < twoeight_Data.sitelist.length; i++) {
                let item = twoeight_Data.sitelist[i]
                if (item.userId == player.userId) {
                    siteId = item.siteId
                    break
                }
            }
            ui.updateUIWithMagic(player, (player.isBanker == true || siteId != null) && player.userId != cc.dd.user.id);
            ui.showKickBtns(siteId != null && player.userId != cc.dd.user.id);
            ui.onClickKick = () => {
                this.onClickSite('', siteId)
                ui.onClickClose()
            }
        }.bind(this));
    },
    /**
    * 显示玩家列表
    * @param {Array<>} list 
    * @param {Number} type 
    */
    showPlayerList(event, custom) {
        let list = [];
        let type = 0;
        if (custom === '1') {
            type = 1;
            list = twoeight_Data.getBankerList(true);
            list.sort((a, b) => { if (b.userId == cc.dd.user.id) return true; return false; });
        }
        else {
            list = twoeight_Data.getBankerList(false);
            list.sort((a, b) => { if (b.userId == cc.dd.user.id) return true; return false; });
        }
        cc.find('player_list', this.node).active = true;
        let self = this;
        cc.find('player_list/bg/title_bg/title', this.node).getComponent(cc.Sprite).spriteFrame = this.titleSprite[type];
        let plist = [];
        for (var i = 0; i < Math.ceil(list.length / 2); i++) {
            if (list[2 * i + 1])
                plist.push([list[2 * i], list[2 * i + 1]]);
            else
                plist.push([list[2 * i]]);
        }
        let scp = cc.find('player_list/bg/scroll', this.node).getComponent('com_glistView');
        scp.setDataProvider(plist, 0, function (itemNode, index) {
            if (index < 0 || index >= plist.length)
                return;
            var data = plist[index];
            var p1_data = data[0];
            var p2_data = data[1];
            var p1_node = itemNode.getChildByName('1p');
            var p2_node = itemNode.getChildByName('2p');
            var p1_head = p1_node.getChildByName('head').getComponent(cc.Sprite);
            p1_head.spriteFrame = null;
            cc.dd.SysTools.loadWxheadH5(p1_head, p1_data.headUrl);
            p1_head.node.tagname = p1_data.userId;
            p1_head.node.off('click');
            p1_head.node.on('click', self.onClickHead, self);
            p1_node.getChildByName('name').getComponent(cc.Label).string = cc.dd.Utils.substr(p1_data.name, 0, 4);
            p1_node.getChildByName('coin').getComponent(cc.Label).string = p1_data.coin.toString();
            if (p2_data) {
                var p2_head = p2_node.getChildByName('head').getComponent(cc.Sprite);
                p2_head.spriteFrame = null;
                cc.dd.SysTools.loadWxheadH5(p2_head, p2_data.headUrl);
                p2_head.node.tagname = p2_data.userId;
                p2_head.node.off('click');
                p2_head.node.on('click', self.onClickHead, self);
                p2_node.getChildByName('name').getComponent(cc.Label).string = cc.dd.Utils.substr(p2_data.name, 0, 4);
                p2_node.getChildByName('coin').getComponent(cc.Label).string = p2_data.coin.toString();
                p2_node.active = true;
            }
            else {
                p2_node.active = false;
            }
        });
    },
    //排行榜请求
    getRanklist(event, custom) {
        twoeight_send_msg.rank(custom);
    },
    onClickRank() {
        hall_audio_mgr.com_btn_click();
        var gameId = 201;
        var prefabPath = 'gameyj_ebg/prefab/com_game_rank';
        var UI = cc.dd.UIMgr.getUI(prefabPath);
        if (!UI) {
            var rankId = rank_info.getItem(function (item) {
                return item.game_type == gameId && item.refresh_type == 1;
            }).key;
            const req = new cc.pb.room_mgr.msg_rank_req();
            req.setRankId(rankId);
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_rank_req, req,
                'msg_rank_req', 'no');
        }
    },
    //排行榜 (输赢排行榜、奖池排行榜)
    showRanklist(data) {
        let ranklist = data.rankList;
        let type = data.type;
        if (type == 1) {
            cc.find('rank/bg/scroll/view/content', this.node).removeAllChildren();
            let myRank = 0;
            if (ranklist.length) {
                ranklist.forEach((item, index) => {
                    if (item.id === cc.dd.user.id) {
                        myRank = index + 1
                    }
                    let row = cc.instantiate(this.rankItem)

                    if (index < 3) {
                        row.getChildByName('bd-icon1').getComponent(cc.Sprite).spriteFrame = this.championSprite[index];
                        row.getChildByName('bd-icon1').active = true;
                        row.getChildByName('NO').active = false;

                    } else {
                        row.getChildByName('NO').getComponent(cc.Label).string = index + 1;
                    }
                    cc.find('coin/num', row).getComponent(cc.Label).string = "$ " + cc.dd.Utils.getNumToWordTransform(item.gold);
                    let head = cc.find('head', row).getComponent(cc.Sprite);
                    cc.dd.SysTools.loadWxheadH5(head, item.head);
                    cc.find('name', row).getComponent(cc.Label).string = cc.dd.Utils.substr(item.name, 0, 5);
                    cc.find('rank/bg/scroll/view/content', this.node).addChild(row);
                })
            }
            if (myRank > 0) {
                cc.find("rank/bg/myRanking/rankNo", this.node).getComponent(cc.Label).string = myRank;
            }
            cc.find('rank/bg/scroll', this.node).getComponent(cc.ScrollView).scrollToTop();
            cc.find("rank", this.node).active = true;
        } else {



            //格式化时间
            let Untimestamp = (time, format = "MM-dd-yy") => {
                if (!time) {
                    return '-'
                }
                let d = new Date(time * 1000)
                let date = {
                    "M+": d.getMonth() + 1,
                    "d+": d.getDate(),
                    "h+": d.getHours()
                }
                if (/(y+)/i.test(format)) {
                    format = format.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length))
                }
                for (let k in date) {
                    if (new RegExp("(" + k + ")").test(format)) {
                        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ?
                            date[k] :
                            ("00" + date[k]).substr(("" + date[k]).length))
                    }
                }
                return format
            }

            let winHistoryNode = cc.find('28gang_caijin', this.node)
            cc.find('scroll/view/content', winHistoryNode).removeAllChildren();
            cc.find('thead/total', winHistoryNode).getComponent(cc.Label).string = "$ " + cc.dd.Utils.getNumToWordTransform(data.sum);
            cc.find('thead/time', winHistoryNode).getComponent(cc.Label).string = Untimestamp(data.time);


            // this.prizePoolTitle.spriteFrame = this.prizePoolSprite[type - 2]
            let poolGold = type == 2 ? cc.dd.Utils.getNumToWordTransform(twoeight_Data.bankerJackpot) : cc.dd.Utils.getNumToWordTransform(twoeight_Data.playerJackpot)

            let unitNode = cc.find('28gang_caijin/num/zi_num_yi', this.node)
            if (poolGold.indexOf(".") > -1) {
                poolGold = poolGold.replace(".", ':');
            }
            if (poolGold.indexOf("万") > -1) {
                this.prizePoolTotal.string = poolGold.replace("万", '');
                unitNode.getComponent(cc.Sprite).spriteFrame = this.prizePoolUnit[0];
                unitNode.active = true
            } else if (poolGold.indexOf("亿") > -1) {
                this.prizePoolTotal.string = poolGold.replace("亿", '');
                unitNode.getComponent(cc.Sprite).spriteFrame = this.prizePoolUnit[1];
                unitNode.active = true
            } else {
                this.prizePoolTotal.string = poolGold;
                unitNode.active = false
            }


            // this.prizePoolTotal.string = type == 2 ? cc.dd.Utils.getNumToWordTransform(twoeight_Data.bankerJackpot) : cc.dd.Utils.getNumToWordTransform(twoeight_Data.playerJackpot)
            for (let i = 0; i < ranklist.length; i++) {
                let item = ranklist[i]
                let row = cc.instantiate(this.prizeItem)
                cc.find('rank/num', row).getComponent(cc.Label).string = i + 1;
                let head = cc.find('head', row).getComponent(cc.Sprite);
                cc.dd.SysTools.loadWxheadH5(head, item.head);
                cc.find('name', row).getComponent(cc.Label).string = cc.dd.Utils.substr(item.name, 0, 7);
                cc.find('gold', row).getComponent(cc.Label).string = "$ " + this.toThousands(item.gold);
                cc.find('scroll/view/content', winHistoryNode).addChild(row);
            }
            cc.find('scroll', winHistoryNode).getComponent(cc.ScrollView).scrollToTop();


            cc.find("28gang_caijin", this.node).active = true;

            let skeletonAnimation = this.prizePoolTitle.getComponent(sp.Skeleton);
            if (type == 2) {
                skeletonAnimation.setAnimation(0, '28g_zjcj', true);
            } else {
                skeletonAnimation.setAnimation(0, '28g_xjcj', true);
            }
        }

    },
    //数字千分位格式化
    toThousands(num, Symbol = ',') {
        var num = (num || 0).toString(), re = /\d{3}$/, result = '';
        while (re.test(num)) {
            result = RegExp.lastMatch + result;
            if (num !== RegExp.lastMatch) {
                result = Symbol + result;
                num = RegExp.leftContext;
            }
            else {
                num = '';
                break;
            }
        }
        if (num) {
            result = num + result;
        }
        return result;
    },
    //聊天表情符号
    showEmoticon() {
        cc.find("emoticon", this.node).active = true;
    },
    /**
      * 点击关闭
      * @param {*} event 
      * @param {*} custom 
      */
    onClickClose(event, custom) {
        hall_audio_mgr.com_btn_click();
        switch (custom) {
            case 'pList':
                // cc.find('player_list/bg/btnGroup/toggle1', this.node).getComponent(cc.Toggle).isChecked = true;
                cc.find('player_list', this.node).active = false;
                // this.playerView = null;
                break;
            case 'trend':
                cc.find('trendChart', this.node).active = false;
                break;
            case 'banker':
                cc.find('bankerView', this.node).active = false;
                break;
            case 'rank':
                cc.find('rank', this.node).active = false;
                break
            case 'emjoy':
                cc.find('emoticon', this.node).active = false;
                break
            case 'prizepool':
                cc.find('28gang_caijin', this.node).active = false;
                break
            case 'prizeRule':
                cc.find('prizeRule', this.node).active = false;
                break;
        }
    },
    //聊天消息
    onChat(data) {
        if (data.msgtype == 3) {//魔法表情
            this.playMagicProp(data.id, data.sendUserId, data.toUserId);
        } else {
            // let isChecked = this.msgToggle.getComponent(cc.Toggle).isChecked
            // if (isChecked) {
            //     let name = twoeight_Data.getPlayer(data.sendUserId).name
            //     if (data.msgtype == 1) {
            //         let message = cc.instantiate(this.messagePrefab)
            //         message.parent = this.node
            //         let text = chat_duanyu_item.items.find(item => item.duanyu_id == data.id)
            //         message.getComponent('BulletScreen').spawnBullets(name, text.text);
            //     } else {
            //         let emoji = cc.instantiate(this.emojiItem)
            //         emoji.parent = this.node
            //         emoji.getComponent('BulletScreen').spawnEmoji(name, data.id);
            //     }
            // }
        }
    },
    //播放魔法表
    playMagicProp(id, send, to) {
        let sPos = null;
        let bankerSend = twoeight_Data.getPlayer(send).isBanker
        let sitelist = twoeight_Data.sitelist;

        let isSite = sitelist.some(item => item.userId == send)
        if (bankerSend) {
            for (var i = 0; i < this.bankerHeads.length; i++) {
                if (this.bankerHeads[i].tagname == send) {
                    sPos = this.bankerHeads[i].convertToWorldSpaceAR(cc.v2(0, 0));
                    break;
                }
            }

        } else if (isSite) {
            for (var i = 0; i < this.tableHeads.length; i++) {
                let headTag = cc.find('head_bg/head_mask/head', this.tableHeads[i])
                if (headTag.tagname == send) {
                    sPos = headTag.convertToWorldSpaceAR(cc.v2(0, 0));
                    break;
                }
            }
        } else {
            sPos = this.throwPos.convertToWorldSpaceAR(cc.v2(0, 0));
        }




        let ePos = null;
        let isBanker = twoeight_Data.getPlayer(to).isBanker
        if (isBanker) {
            for (var i = 0; i < this.bankerHeads.length; i++) {
                if (this.bankerHeads[i].tagname == to) {
                    ePos = this.bankerHeads[i].convertToWorldSpaceAR(cc.v2(0, 0));
                    break;
                }
            }
        } else {
            for (var i = 0; i < this.tableHeads.length; i++) {
                let headTag = cc.find('head_bg/head_mask/head', this.tableHeads[i])
                if (headTag.tagname == to) {
                    ePos = headTag.convertToWorldSpaceAR(cc.v2(0, 0));
                    break;
                }
            }
        }
        if (!ePos)
            return;
        if (id == 1020) {
            // ePos.y -= 50;       //锤子动画位置向下偏移
        }
        let magic_prop = cc.find("Canvas").getComponentInChildren("com_magic_prop");
        let magic_pos = magic_prop.node.convertToWorldSpaceAR(cc.v2(0, 0));
        magic_prop.playMagicPropAni(id, sPos.sub(magic_pos), ePos.sub(magic_pos));
    },

    intervalTimeCallBack(interval) {
        this.interval = interval;
    },
    //更新时间
    updateTime() {
        let pad = function (num, n) {
            var len = num.toString().length;
            while (len < n) {
                num = "0" + num;
                len++;
            }
            return num;
        };
        let date = new Date();
        this.time_lbl.string = pad(date.getHours(), 2) + ':' + pad(date.getMinutes(), 2);
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
                            AudioManager.getInstance().onMusic(tw_audio_cfg.GAME_MUSIC);
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
            AudioManager.getInstance().onMusic(tw_audio_cfg.GAME_MUSIC);
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

});
