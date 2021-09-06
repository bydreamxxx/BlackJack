//create by wj 2019/09/18
const size = cc.winSize;
var gFishMgr = require('FishDoyenManager').FishManager.Instance();
const FishType = require('DoyenFishType');
var playerManager = require('FishDoyenPlayerManager').CFishPlayerManager.Instance();
var playerEvent = require('FishDoyenPlayerManager').Fish_PlayerEvent;
var playerEd = require('FishDoyenPlayerManager').Fish_PlayerED;
var CFish = require('FishNode').CFish;
const data_fishtype = require('qka_fish_master_type');
const itemcfg = require('item');
const shaderUtils = require('shaderUtils');
var audioCfg = require('qka_fish_master_audio')
let ChatEvent = require('jlmj_chat_data').ChatEvent;
let ChatEd = require('jlmj_chat_data').ChatEd;
var chatCfg = require('qka_fish_master_chat')
var HallCommonObj = require('hall_common_data');
var HallCommonEd = HallCommonObj.HallCommonEd;
var HallCommonEvent = HallCommonObj.HallCommonEvent;
const HallCommonData = require('hall_common_data').HallCommonData;
const master_gift = require('qka_fish_master_gift')
const doyen_sender = require('gameyj_fish_doyen_sender')
const Hall = require('jlmj_halldata');
var RoomMgr = require('jlmj_room_mgr').RoomMgr;

var AppCfg = require('AppConfig');
var hall_prefab = require('hall_prefab_cfg');
var PLAYER_COUNT = 6
let SysED = require("com_sys_data").SysED;
let SysEvent = require("com_sys_data").SysEvent;
// var ICE_CD_TIME = 8

var g_RotOffset = 0.05;
var g_RotRangeLen = Math.PI + g_RotOffset * 2 * Math.PI;
var g_paoTaiStartDir = [
    - Math.PI * g_RotOffset,
    Math.PI * (1 + g_RotOffset),
    Math.PI * (1 + g_RotOffset),
    Math.PI * (1 + g_RotOffset),
    - Math.PI * g_RotOffset,
    - Math.PI * g_RotOffset
];
var g_paoTaiRotOffset = [
    [1, - 0.5],
    [1, 0.5],
    [1, 0.5],
    [1, 0.5],
    [1, -0.5],
    [1, -0.5]];
const defaultBetDir = [
    Math.PI / 2,
    -Math.PI / 2,
    -Math.PI / 2,
    -Math.PI / 2,
    Math.PI / 2,
    Math.PI / 2];


function pToAngleSelf(offSet) {
    return Math.atan2(offSet.y, offSet.x);
}

function RadianToFormat(radian, startRadian) {
    radian = (radian - startRadian) % (2 * Math.PI)
    if (radian < 0)
        radian = radian + 2 * Math.PI
    return startRadian + radian
}

function RadianToAngleOfUI(radian) {//弧度值转换为角度
    return 360 - radian / Math.PI * 180;
}

cc.Class({
    extends: cc.Component,

    properties: {
        m_oFishPoolBg: cc.Node, //鱼池背景图
        m_oFishPool: cc.Node, //鱼池节点
        m_oTouchNode: cc.Node,
        m_tPlayerInfo: [], //玩家节点
        m_autoBet: false, //自动发射子弹
        m_clickAutoBet: false,
        m_bClick: false, //是否点击鱼池
        m_nAutoBetTime: 0, //自动子弹时间控制
        paoTaiAtals: cc.SpriteAtlas,
        m_tLockSprite: { default: [], type: cc.SpriteFrame }, //锁定图标
        m_tQiPaoSprite: { default: [], type: cc.SpriteFrame }, //气泡资源
        m_nShake: 0,
        m_tCoinNode: [], //保存金币节点
        // m_tCoinNodeInfo: [], //保存数据信息
        m_nIndex: 0,
        m_bGuaji: false,
        m_nCurBgIndex: 0, //当前背景图索引
        m_tBgSpriteList: { default: [], type: cc.SpriteFrame }, //背景图
        // m_oCaoXiSkeleton: sp.SkeletonData,
        m_oCoinPanle: cc.Node,
        m_oFoldCoinImg: cc.SpriteFrame,
        m_oQuitPopNode: cc.Node,
        m_nNodeTag: 0,
        m_nFoldNodeIndexList: [],
        m_resFoldScroe: { default: [], type: cc.Prefab },
        m_tPaoTaiPos: [],
        m_oSpecialNode: cc.Node,
        m_bAmi: true,


        m_lockIconNode: cc.Node,
        m_iceIconNode: cc.Node,
        m_iceEffectNode: cc.Node,
        m_yucaoTipNode: cc.Node,
        chat_item: cc.Node,
        m_hallItemAtlas: cc.SpriteAtlas,
        m_autoBetToggle: cc.Toggle,
        progressBarView: { default: null, type: cc.ProgressBar, tooltip: "开炮数量" },
        nextLevelProgress: { default: null, type: cc.ProgressBar, tooltip: "下一级礼包" },
        m_btnSprite: { default: [], type: cc.SpriteFrame, tooltip: "抽奖按钮图片" },
    },

    /**
     * 返回按键
     * @param event
     */
    onKeyDown: function (event) {
        switch (event.keyCode) {
            case cc.macro.KEY.back: {
                if (!this.__showbox) {
                    this.__showbox = true;
                    cc.dd.NetWaitUtil.close();
                    gFishMgr.quitGame();
                }
            }
                break;
            default:
                break;
        }
    },


    onLoad: function () {
        //cc.dd.UIMgr.openUI("gameyj_fish_doyen/prefabs/fish_loading_ui", function(prefab){});
        ChatEd.addObserver(this);
        playerEd.addObserver(this);
        Hall.HallED.addObserver(this);
        HallCommonEd.addObserver(this);
        SysED.addObserver(this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);

        //加载完再初始化数据
        gFishMgr.init();

        gFishMgr.setMainUI(this.node.getComponent('gameyj_fish_doyen_scene')); //设置好管理器的主界面数据

        // var Anim = cc.dd.Utils.seekNodeByName(this.node, 'aimBtn').getChildByName('mzAct');
        // Anim.active = true;
        // Anim.getComponent(cc.Animation).play();

        this.updateTools();

        this.m_oFishPool.on(cc.Node.EventType.TOUCH_START, this.onClickFishPool, this); //开始点击
        this.m_oFishPool.on(cc.Node.EventType.TOUCH_MOVE, this.onClickFishPool, this); //移动
        this.m_oFishPool.on(cc.Node.EventType.TOUCH_END, this.onClickFishPool, this); //点击结束
        this.m_oFishPool.on(cc.Node.EventType.TOUCH_CANCEL, this.onClickFishPool, this); //点击取消

        for (var i = 0; i < PLAYER_COUNT; i++) {
            var playerNode = {};
            playerNode.root = cc.dd.Utils.seekNodeByName(this.node, "Panel_Player" + i); //玩家节点根节点
            playerNode.waitTexture = cc.dd.Utils.seekNodeByName(this.node, "waitTexture" + i);//等待加入
            playerNode.paoTaiCnt = cc.dd.Utils.seekNodeByName(playerNode.root, 'Panel_PaoTai'); //炮台
            playerNode.paoTaiDi = cc.dd.Utils.seekNodeByName(playerNode.root, 'by_paotai_di'); //炮台底盘
            playerNode.textBet = cc.dd.Utils.seekNodeByName(playerNode.root, 'betNum'); //下注倍率
            playerNode.textCoin = cc.dd.Utils.seekNodeByName(playerNode.root, 'coin'); //玩家身上金币 
            playerNode.textNick = cc.dd.Utils.seekNodeByName(playerNode.root, 'name'); //玩家名字
            playerNode.headIcon = cc.dd.Utils.seekNodeByName(playerNode.root, 'headNode'); //玩家头像
            playerNode.betJia = cc.dd.Utils.seekNodeByName(playerNode.root, 'by_btn_jia1');//增加倍率
            playerNode.betJian = cc.dd.Utils.seekNodeByName(playerNode.root, 'by_btn_jian1');//减小倍率
            // playerNode.trackLock = cc.dd.Utils.seekNodeByName(playerNode.root, 'by_img_zzsd');//追踪标记
            // playerNode.btnMz = cc.dd.Utils.seekNodeByName(playerNode.root, 'by_mz_bt'); //瞄准按钮(挂机)
            playerNode.wanTag = cc.dd.Utils.seekNodeByName(playerNode.root, 'by_zi01');//万数字标签
            playerNode.yiTag = cc.dd.Utils.seekNodeByName(playerNode.root, 'by_zi02');//亿数字标签
            playerNode.headClick = cc.dd.Utils.seekNodeByName(playerNode.root, 'headclick');//头像点击
            playerNode.playerInfo = cc.dd.Utils.seekNodeByName(playerNode.root, 'player_Info_node');
            playerNode.siteShine = cc.dd.Utils.seekNodeByName(playerNode.root, 'siteShine'); //炮台闪烁
            playerNode.energyLeftText = cc.dd.Utils.seekNodeByName(playerNode.root, 'timeText');//倒计时
            playerNode.chatBubble = cc.dd.Utils.seekNodeByName(playerNode.root, 'by_chat_bubble');//chat

            // var startPos = playerNode.paoTaiCnt.parent.convertToWorldSpaceAR(playerNode.paoTaiCnt.getPosition()); //获取相对世界坐标
            // gFishMgr.setBulletPos(i, this.m_oFishPool.convertToNodeSpaceAR(startPos), startPos); //设置炮台在鱼池内的坐标
            // this.m_tPaoTaiPos[i] = playerNode.paoTaiCnt.getPosition();

            playerNode.wanTag.active = false;
            playerNode.yiTag.active = false;
            playerNode.m_tCoinNodeInfo = [];

            playerNode.root.active = false;
            this.m_tPlayerInfo[i] = playerNode;
        }

        this.Prog = this.progressBarView.getComponent(cc.ProgressBar);//下注总额
        this.nextProg = this.nextLevelProgress.getComponent(cc.ProgressBar);//下注总额

        this.disableBtn = cc.find('bydr-hd-di/bydr-hd-di2/bydr-bt-clq', this.node)
        this.disableBtnAuto = cc.find('bydr-hd-di/bydr-hd-di2/bydr_zdz_txk_epp', this.node)
        this.disableBtnAnim = cc.find('bydr-hd-di/bydr-hd-di2/xl_bydr_clj', this.node)

        cc.director.getCollisionManager().enabled = false;
        //开启绘制区域
        cc.director.getCollisionManager().enabledDebugDraw = false;
        this.playBGMusic();
        this.initChat();
        // this.initGift();
        this.activitySwitch();
        this.autuAcquisition();
        this.updateInit(); //游戏玩家初始化

        cc.gateNet.Instance().startDispatch();
    },

    onClickChat: function () {
        this.chat_item.parent.parent.active = !this.chat_item.parent.parent.active;
    },
    closeChat: function () {
        this.chat_item.parent.parent.active = false;
    },
    //顶部礼包档次
    initGift() {
        let CommonData = HallCommonData.getInstance()
        if (CommonData.fishActivityState != 1) return
        let RoomType = gFishMgr.getRoomType()
        let datalist = master_gift.getItemList(function (item) {
            return item.roomid == RoomType;
        });
        // let isMax = gFishMgr.fishGiftLevel != mdatalist[datalist.length - 1].key
        // let fishGiftLevel = master_gift.getItem(function (item) {
        //     if (item.roomid == RoomType) {
        //         return item.level == (gFishMgr.fishGiftLevel != 3 ? gFishMgr.fishGiftLevel + 1 : gFishMgr.fishGiftLevel);
        //     }
        // });
        let fishGiftLevel = null
        let GiftLevel = CommonData.fishGiftLevel != 3 ? CommonData.fishGiftLevel + 1 : CommonData.fishGiftLevel
        for (let i = 0; i < datalist.length; i++) {
            let item = datalist[i]
            if (item.level == GiftLevel) {
                fishGiftLevel = item
                break
            }
        }
        if (gFishMgr.getAuto() != 0) {
            this.disableBtnAuto.active = true
            this.disableBtn.active = false
            this.disableBtnAnim.active = false
        } else {
            if (CommonData.fishGiftLevel == 0) {
                this.disableBtn.active = true
                this.disableBtnAnim.active = false
            } else {
                this.disableBtn.active = false
                this.disableBtnAnim.active = true
            }
            this.disableBtnAuto.active = false
        }
        for (let i = 0; i < datalist.length; i++) {
            let giftlist = datalist[i].gift.split(';')
            let ele = giftlist[giftlist.length - 1]
            let maxNum = ele.substring(0, ele.lastIndexOf(','))
            cc.find('bydr-hd-di/bydr-hd-di2/bydr-icon' + i, this.node).getComponent(cc.Toggle).isChecked = CommonData.fishGiftLevel >= master_gift.items[i].key;
            cc.find('bydr-hd-di/bydr-hd-di2/bydr-icon' + i + '/Background/num', this.node).getComponent(cc.Label).string = maxNum
            cc.find('bydr-hd-di/bydr-hd-di2/bydr-icon' + i + '/checkmark/num', this.node).getComponent(cc.Label).string = maxNum
        }
        let progress = 0;
        switch (fishGiftLevel.level) {
            case 1:
                progress = CommonData.fishGiftBetNum / fishGiftLevel.bet * 0.1
                break
            case 2:
                progress = (CommonData.fishGiftBetNum / fishGiftLevel.bet * 0.25) < 0.1 ? 0.1 : CommonData.fishGiftBetNum / fishGiftLevel.bet * 0.25
                break
            case 3:
                progress = (CommonData.fishGiftBetNum / fishGiftLevel.bet) < 0.25 ? 0.25 : CommonData.fishGiftBetNum / fishGiftLevel.bet
                break
        }
        // this.Prog.progress = CommonData.fishGiftBetNum / master_gift.items[master_gift.items.length - 1].bet
        this.Prog.progress = progress
        let levelName = fishGiftLevel.desc.split(',')
        let sub = (fishGiftLevel.need_bet - CommonData.fishGiftBetNum) > 0 ? fishGiftLevel.need_bet - CommonData.fishGiftBetNum : 0
        cc.find('bydr-hd-di/bydr-hd-di2/label', this.node).getComponent(cc.Label).string = `当前还需 ${sub} 发可开${levelName[0]}`
        if (CommonData.fishGiftLevel != 3) {
            this.nextProg.progress = CommonData.fishGiftBetNum / fishGiftLevel.need_bet
        } else {
            cc.find('bydr-hd-di/bydr-hd-di2/label', this.node).getComponent(cc.Label).string = '累计炮弹已达最大值,请抽取红包'
            this.nextProg.progress = 1
        }
        cc.find('menuLeft/bydr-quan-di/num', this.node).getComponent(cc.Label).string = CommonData.fishGiftNum

    },
    //自动领取礼券
    autuAcquisition(data) {
        let CommonData = HallCommonData.getInstance()
        if (CommonData.fishActivityState != 1) return
        let isAuto = gFishMgr.getAuto()
        if (isAuto == 0) return
        let RoomType = gFishMgr.getRoomType()
        let fishGift = master_gift.getItem(function (item) {
            if (item.roomid == RoomType && item.level == isAuto)
                return item
        });
        if (CommonData.fishGiftBetNum >= fishGift.bet) {
            doyen_sender.fishGift({ id: isAuto, roomid: RoomType })
        }
    },
    //兑换动画
    showGiftAnima(data) {
        let isAuto = gFishMgr.getAuto()
        if (isAuto == 0) {
            cc.dd.UIMgr.openUI("gameyj_fish_doyen/prefabs/xl_bydr_hddh", function (node) {
                var scp = node.getComponent('gameyj_Fish_doyen_animation')
                scp.init(data)
            });
        } else {
            cc.find('bydr-hd-di/xl_bydr_zdjs/num', this.node).getComponent(cc.Label).string = data.count
            let skeNode = cc.find('bydr-hd-di/xl_bydr_zdjs', this.node)
            skeNode.active = true
            var ske = skeNode.getComponent(sp.Skeleton);
            ske.clearTracks()
            ske.setCompleteListener((trackEntry) => {
                skeNode.active = false
            });
            ske.setAnimation(0, 'animation', false)
        }

    },
    activitySwitch(data) {
        let CommonData = HallCommonData.getInstance()
        if (CommonData.fishActivityState != 1) {
            cc.find('menuLeft/bydr-quan-di', this.node).active = false
            cc.find('bydr-hd-di', this.node).active = false
            // cc.find('waitTexture2', this.node).active = true
            // cc.find('Panel_Player2', this.node).active = true
            // cc.find('waitTexture5', this.node).active = true
            // cc.find('Panel_Player5', this.node).active = true
        } else {
            cc.find('menuLeft/bydr-quan-di', this.node).active = true
            cc.find('bydr-hd-di', this.node).active = true
        }

        cc.find('waitTexture2', this.node).active = false
        cc.find('Panel_Player2', this.node).active = false
        cc.find('waitTexture5', this.node).active = false
        cc.find('Panel_Player5', this.node).active = false

    },
    //初始化聊天
    initChat: function () {
        var cfg = chatCfg.getItemList(function (item) {//获取配置表数据
            return true;
        });;
        var content = cc.find('view/content', this.chat_item.parent);
        content.removeAllChildren(true);

        for (var i = 0; i < cfg.length; i++) {
            var node = cc.instantiate(this.chat_item);
            node.active = true;
            node.tagname = i + 1;
            node.getComponentInChildren(cc.Label).string = cfg[i].text;
            node.on('click', this.onQuickChatClick, this);
            content.addChild(node);
        }
    },


    //快捷文字
    onQuickChatClick: function (event) {
        if (!this.chatCD) {
            this.chatCD = true;
            this.scheduleOnce(function () {
                this.chatCD = false;
            }.bind(this), 2);
            this.playAudio(6, false, 1);
            // hall_audio_mgr.com_btn_click();
            // if (!this.chatAni) {
            //     cc.find('chat', this.node).getComponent(cc.Animation).play('chat_out');
            // }

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
            this.closeChat();
        }
        else {
            cc.dd.PromptBoxUtil.show('信息发送过于频繁...');
        }
    },

    updateTools: function (data) {
        var lockn = cc.find('numbg/txt', this.m_lockIconNode).getComponent(cc.Label);
        lockn.string = "" + gFishMgr.getTools(2);//.m_toolLockNum;

        lockn = cc.find('numbg/txt', this.m_iceIconNode).getComponent(cc.Label);
        lockn.string = "" + gFishMgr.getTools(1);//.m_toolIceNum

        gFishMgr.initMyGuns(data);
    },

    onDestroy: function () {
        playerEd.removeObserver(this);
        HallCommonEd.removeObserver(this);
        ChatEd.removeObserver(this);
        SysED.removeObserver(this);
        Hall.HallED.removeObserver(this);
    },

    onEnter: function () {//游戏初始化
        for (var nSite = 1; nSite < 7; nSite++) {
            if (nSite == gFishMgr.getMysite()) {

                var playerNode = this.m_tPlayerInfo[nSite - 1];
                playerNode.betJia.parent.active = true; //加倍率
                playerNode.betJian.parent.active = true; //减倍率
                // playerNode.btnMz.active = true; //挂机瞄准
                playerNode.siteShine.active = true;
                playerNode.paoTaiCnt.setRotation(defaultBetDir[nSite - 1]);
                playerNode.siteShine.runAction(cc.repeat(cc.sequence(cc.fadeIn(0.6), cc.fadeOut(0.6)), 8));

                var player = playerManager.findPlayerByUserPos(nSite);
                if (player) {
                    var playerData = player.getPlayerGameInfo(); //获取游戏数据
                    if (!gFishMgr.m_bIsShowExchange) {
                        this.showExchenge(parseInt(playerData.coin / 10));
                        gFishMgr.m_bIsShowExchange = true
                    }

                    if (gFishMgr.m_bFilp) {
                        this.m_oFishPool.setRotation(180);
                    }
                }

            }

            ////////////锁定气泡///////////
            if (!gFishMgr.getIsInit()) {
                var playerNode = this.m_tPlayerInfo[nSite - 1];
                if (playerNode) {
                    var startPos = playerNode.paoTaiCnt.parent.convertToWorldSpaceAR(playerNode.paoTaiCnt.getPosition()); //获取相对世界坐标
                    var index = gFishMgr.toClientSite(nSite) - 1;
                    gFishMgr.setBulletPos(nSite - 1, this.m_oFishPoolBg.convertToNodeSpaceAR(startPos), startPos); //设置炮台在鱼池内的坐标
                    this.m_tPaoTaiPos[nSite - 1] = playerNode.paoTaiCnt.getPosition();

                    // playerNode.trackQiPaoCnt = new cc.Node(); //气泡根节点
                    // playerNode.trackQiPao = [];//气泡节点数组
                    // for (var i = 0; i < FishType.qiPaoMax; i++) {
                    //     var qipaoNode = new cc.Node();
                    //     var qipaoSp = qipaoNode.addComponent(cc.Sprite);
                    //     if (nSite == gFishMgr.getMysite())
                    //         qipaoSp.spriteFrame = this.m_tQiPaoSprite[0]; //气泡资源设置
                    //     else
                    //         qipaoSp.spriteFrame = this.m_tQiPaoSprite[1];

                    //     qipaoNode.setPosition(cc.v2(FishType.qiPaoOffset + i * FishType.qiPaoDistance, 0)); //设置位置点
                    //     qipaoNode.setScale(FishType.qiPaoScale.min + i * (FishType.qiPaoScale.max - FishType.qiPaoScale.min) / FishType.qiPaoMax);//大小设置
                    //     playerNode.trackQiPaoCnt.addChild(qipaoNode);
                    //     playerNode.trackQiPao.push(qipaoNode);
                    // }

                    //var startPos = playerNode.paoTaiCnt.parent.convertToWorldSpaceAR(playerNode.paoTaiCnt.getPosition()); //获取相对世界坐标
                    // playerNode.trackQiPaoCnt.setLocalZOrder(FishType.ZorderInRoot.qiPao)
                    // playerNode.trackQiPaoCnt.setPosition(playerNode.paoTaiCnt.getPosition());//this.node.convertToNodeSpaceAR(startPos))
                    // playerNode.trackQiPaoCnt.active = false;
                    // playerNode.paoTaiCnt.parent.addChild(playerNode.trackQiPaoCnt);

                    playerNode.foldCoinList = [];
                    playerNode.foldCoinNode = new cc.Node;
                    playerNode.paoTaiCnt.parent.addChild(playerNode.foldCoinNode);

                    playerNode.headClick._tag = nSite;
                }
            }

            ///////////////玩家倍率显示/////////////////
            var player = playerManager.findPlayerByUserPos(nSite);
            if (player) {
                var playerGameData = player.getPlayerGameInfo(); //获取游戏数据
                if (playerGameData) {
                    if (nSite == gFishMgr.getMysite()) {
                        gFishMgr.m_currentGunId = playerGameData.betDataid;
                    }
                    this.updateOnePlayerBetTimes(player.userId, playerGameData.betDataid);
                    this.updateOnePlayerGold(nSite); //更新玩家金币
                }
            }

        }
        if (!gFishMgr.getIsInit())
            gFishMgr.setInit();

        if (this.m_clickAutoBet) {
            // this.onClickAutoBet();
            this.m_autoBetToggle.check();
            this.m_autoBetToggle.isChecked = false;
        } else {
            this.setAutoBet();
        }


    },

    showExchenge: function (gold, isquit) {
        cc.dd.UIMgr.openUI("gameyj_fish_doyen/prefabs/gameyj_fish_doyen_exchange_ui", function (node) {
            var scp = node.getComponent('gameyj_Fish_doyen_exchange')
            if (isquit) {
                scp.showQuitGame(gold)
            } else {
                scp.showEnterGame(gold)
            }

        });
    },

    updateInit: function () {//初始化界面
        this.updatePlayerInfo(); //初始化玩家信息
    },

    updatePlayerInfo: function () {//初始化玩家信息
        for (var i = 1; i <= PLAYER_COUNT; i++)
            this.updateOnePlayerInfo(i);
    },

    updateOnePlayerInfo: function (nSite) {//根据玩家座位更新玩家信息
        var player = playerManager.findPlayerByUserPos(nSite); //获取玩家信息
        if (player) {
            var playerData = player.getPlayerCommonInfo(); //获取玩家通用数据
            if (playerData) {
                cc.log(playerData);
                cc.log("###now set player seat:" + playerData.seat + '====> to pos:' + playerData.pos);
                var playerNode = this.m_tPlayerInfo[nSite - 1]; //获取玩家座位节点
                if (playerNode) {
                    playerNode.root.active = true;
                    playerNode.waitTexture.active = false;
                    playerNode.headIcon.active = true;
                    playerNode.textNick.getComponent(cc.Label).string = cc.dd.Utils.substr(playerData.name, 0, 6); //设置玩家名字
                    playerNode.headIcon.getComponent('klb_hall_Player_Head').initHead(playerData.openId, playerData.headUrl, 'fish_player_init'); //玩家头像

                    // var pData = player.getPlayerGameInfo();
                    playerNode.textCoin.getComponent(cc.Label).string = playerData.coin * gFishMgr.getRoomRate();//this.convertChipNum(playerData.coin, 2);
                    // playerNode.textBet.getComponent(cc.Label).string = 0; //设置炮弹倍率

                    if (playerData.betDataid) {
                        var itemCfg = itemcfg.getItem(function (element) {
                            if (element.key == playerData.betDataid)
                                return true;
                        }.bind(this));

                        var paotTaiImage = this.paoTaiAtals.getSpriteFrame(itemCfg.icon);
                        var childPao = playerNode.paoTaiCnt.getChildByName('paotaiSp');
                        if (childPao)
                            childPao.getComponent(cc.Sprite).spriteFrame = paotTaiImage;

                    }

                    this.updateOnePlayerGold(nSite); //更新玩家金币
                }
            }
        }
    },

    updateOnePlayerBet: function (nSite, nGold, bulletDir) {//更新炮台下注情况
        var playerNode = this.m_tPlayerInfo[nSite - 1];
        if (playerNode) {
            this.updateOnePlayerGold(nSite);
            if (nSite != gFishMgr.getMysite()) {
                this.paoTaiDir(nSite - 1, bulletDir);
            }
        }
    },

    //商城购买
    updatePlayerGold: function (msg) {
        var player = playerManager.findPlayerByUserId(msg.userId);
        if (player == null)
            return;
        var playerData = player.getPlayerGameInfo()
        if (playerData == null)
            return;
        playerData.coin = msg.coin * gFishMgr.getRoomRate();
        var cdata = player.getPlayerCommonInfo()
        if (cdata == null)
            return;
        this.updateOnePlayerGold(cdata.pos)
    },



    updateOnePlayerGold: function (nSite) {//更新金币显示
        var playerNode = this.m_tPlayerInfo[nSite - 1];
        if (playerNode == null)
            return;
        var player = playerManager.findPlayerByUserPos(nSite);
        if (player == null)
            return;

        var playerData = player.getPlayerGameInfo(); //获取游戏数据
        if (playerData) {
            playerNode.textCoin.getComponent(cc.Label).string = playerData.coin;//this.convertChipNum(playerData.coin, 2);
            playerNode.textCoin.parent.active = true;
            // if(playerData.coin > 10000 && playerData.coin < 100000000){
            //     playerNode.wanTag.active = true;
            //     playerNode.yiTag.active = false;
            // }else if(playerData.coin >= 100000000){
            //     playerNode.wanTag.active = false;
            //     playerNode.yiTag.active = true;
            // }else{
            //     playerNode.wanTag.active = false;
            //     playerNode.yiTag.active = false;
            // }

            // if(nSite == gFishMgr.getMysite){
            //     var roomCfg = gFishMgr.getRoomCfg();
            //     if(playerData.coin < playerData.bet && playerData.coin >= roomCfg.bet_min){
            //         for(var gold = playerData.bet; gold > roomCfg.bet_min; gold -= roomCfg.room_change){ //自动调节档位
            //             if(gold > playerData.gold)
            //                 gFishMgr.setBetTimes(2); //发送加减档位协议
            //         }

            //     }
            // }

        }
    },

    setShake: function (shake) {//震屏幕
        this.m_nShake = Math.max(shake, this.m_nShake);
        this.m_fShakeTime = this.m_fShakeTime || 0;
    },


    showCaoXiTip: function () {
        this.m_yucaoTipNode.active = true;
        var ani = this.m_yucaoTipNode.getComponent(cc.Animation);
        ani.play('yucao', 0);

    },



    showCaoXi: function () {//显示潮汐动画
        this.showCaoXiTip();

        var tableLen = this.m_tBgSpriteList.length;
        var selIndex = this.m_nCurBgIndex + Math.floor(Math.random() * tableLen);
        if (selIndex == this.m_nCurBgIndex)
            selIndex += 1;
        selIndex = (selIndex) % tableLen;
        this.m_bgImgeSpriteFrame = this.m_tBgSpriteList[selIndex]; //新的背景图
        this.m_nCurBgIndex = selIndex

        this.m_panleCaoXi = new cc.Node;//创建节点
        this.m_panleCaoXi.width = 0;
        this.m_panleCaoXi.height = 720;
        this.m_panleCaoXi.anchorX = 1;
        this.m_panleCaoXi.anchorY = 0.5;
        this.m_panleCaoXi.setPosition(cc.v2(640, 0)); //设置位置

        var mask = this.m_panleCaoXi.addComponent(cc.Mask);
        mask.type = cc.Mask.Type.RECT;

        var cpt = this.m_panleCaoXi.addComponent(cc.Widget);
        cpt.isAlignTop = true;
        cpt.isAlignBottom = true;
        cpt.isAlignLeft = true;
        cpt.isAlignRight = true;
        // cpt.isAlignOnce = true;


        var oChild = new cc.Node;
        oChild.width = 1280;
        oChild.height = 720;
        oChild.anchorX = 1;
        oChild.anchorY = 0.5;
        oChild.setPosition(cc.v2(0, 0));

        var cpt1 = oChild.addComponent(cc.Widget);
        cpt1.isAlignTop = true;
        cpt1.isAlignBottom = true;
        cpt1.isAlignLeft = true;
        cpt1.isAlignRight = true;
        //cpt1.isAlignOnce = true;


        var oSprite = oChild.addComponent(cc.Sprite);
        oSprite.spriteFrame = this.m_bgImgeSpriteFrame; //设置新背景
        this.m_panleCaoXi.addChild(oChild);
        this.m_panleCaoXi.zIndex = -1;
        this.m_oFishPoolBg.addChild(this.m_panleCaoXi);

        // this.m_caoXiNode = new cc.Node;
        // var ske = this.m_caoXiNode.addComponent(sp.Skeleton);
        var wave = cc.resources.get('gameyj_fish_doyen/prefabs/fish_wave', cc.Prefab);
        this.m_caoXiNode = cc.instantiate(wave)
        // ske.skeletonData = this.m_oCaoXiSkeleton;
        // ske.clearTracks();
        // ske.defaultSkin = 'default';
        // ske.defaultAnimation = 'chao';
        // ske.setAnimation(0, 'chao', false);
        this.m_oFishPoolBg.addChild(this.m_caoXiNode);
        this.m_caoXiNode.setPosition(cc.v2(this.m_oFishPoolBg.width / 2, 0));
        this.m_caoXiNode.zIndex = 200;
        // this.m_caoXiNode.setOpacity(100);
        this.m_fRunCaoXi = FishType.caoXiActTime;


        AudioManager.stopMusic();
        this.playAudio(5, false, 1);
    },

    onCaoXiEnd: function () {
        this.playBGMusic();
    },

    ///////////////////////////////金币处理begin//////////////////////////////////////////////
    showGoldNum: function (fishPos, goldNum, userId) {
        if (goldNum == 0)
            return;
        var goldTemp = cc.resources.get('gameyj_fish_doyen/prefabs/coinNumNode' + (userId == cc.dd.user.id ? 1 : 0), cc.Prefab);
        var goldNode = cc.instantiate(goldTemp); //金币节点
        if (gFishMgr.m_bFilp)
            fishPos = fishPos.mul(-1)
        goldNode.setPosition(fishPos);
        goldNode.zIndex = 2;
        goldNode.setScale(1);
        goldNode.getComponent(cc.Label).string = goldNum;
        var delayTime = 1.7
        if (goldNum.indexOf(";") != -1)
            goldNode.runAction(cc.sequence(cc.scaleTo(0.1, 2), cc.scaleTo(0.1, 1), cc.moveBy(1.5, cc.v2(0, 150))));
        else {
            goldNode.runAction(cc.moveBy(1.5, cc.v2(0, 150)));
            delayTime = 1.5
        }

        goldNode.runAction(cc.sequence(cc.delayTime(delayTime), cc.callFunc(function () {
            goldNode.removeFromParent(true);
        })));
        this.m_oCoinPanle.addChild(goldNode);
    },

    showCoin: function (dataInfo) {//金币动画
        if (dataInfo == null)
            return;
        var player = playerManager.findPlayerByUserId(dataInfo.userId);
        var playerComData = null;
        var pos = -1;
        if (!player) {
            cc.log('玩家不存在，在原位置显示showCoin');
            // return;
        } else {
            playerComData = player.getPlayerCommonInfo();
        }
        if (!playerComData) {
            // return;

            pos = playerManager.findPosByUserId(dataInfo.userId) - 1;
            cc.log('玩家数据不存在，在原位置显示showCoin,座位为:' + pos);
        } else {
            pos = playerComData.pos - 1
        }


        var playerNode = this.m_tPlayerInfo[pos];
        if (playerNode) {
            if (playerNode.m_tCoinNodeInfo.length == 0) {
                // var self = this;
                playerNode.m_tCoinNodeInfo.push(dataInfo);//保存数据
                // this.m_oCoinPanle.runAction(cc.sequence(cc.delayTime(FishType.dieActTime), cc.callFunc(function(){
                this.popCoinNodeList(dataInfo.userId);
                //     }
                // )));
            } else
                playerNode.m_tCoinNodeInfo.push(dataInfo);//保存数据
        }


        // ////////////暂时的金币更新///////////////
        //this.updateOnePlayerGold(playerComData.pos);
    },

    popCoinNodeList: function (userId) {//取出最先的一次保存的金币节点
        var player = playerManager.findPlayerByUserId(userId);
        var playerData = null;
        var pos = -1;
        if (player == null) {
            cc.log('玩家不存在，在原位置显示popCoinNodeList');
            // return;
        } else {
            playerData = player.getPlayerCommonInfo();
        }

        if (playerData == null) {
            pos = playerManager.findPosByUserId(userId) - 1;
            cc.log('玩家数据不存在，在原位置显示popCoinNodeList,pos:' + pos);
            // return;
        } else {
            pos = playerData.pos - 1
        }

        var playerNode = this.m_tPlayerInfo[pos];
        if (playerNode.m_tCoinNodeInfo.length == 0)
            return;
        var coinNodeInfo = playerNode.m_tCoinNodeInfo.shift();
        var userId = coinNodeInfo.userId;
        // var totalSrcCoinNum = coinNodeInfo.totalSrcCoinNum;
        var hitFishs = coinNodeInfo.hitFish;
        // var totalGoldNum = coinNodeInfo.totalGoldNum;
        var bulletpos = coinNodeInfo.pos;

        // var nSite = playerData.pos - 1; //玩家座位号

        var toPos = gFishMgr.getBulletPosInWorld(pos);//gFishMgr.toSeverSite(playerData.pos) - 1); //玩家座位位置点
        toPos = this.m_oCoinPanle.convertToNodeSpaceAR(toPos);
        // var scaleCoinNum = Math.min(1, 100 / totalSrcCoinNum);
        var totalCoinNum = 0;
        for (var fish of hitFishs) {

            var fishCfg = data_fishtype.getItem(function (item) { //获取配置表数据
                if (item.key == fish.dataID) {
                    return item;
                }
            });
            if (fishCfg.coin_num <= 0 && (fish.dropItem == null))
                continue;

            var coinNum = Math.max(0, Math.min(40, fishCfg.coin_num));//fish.fish_bet_times * scaleCoinNum));//创建金币量
            totalCoinNum += coinNum;
            if (fish.worldPos) {
                var sz = fish.size;
                var startPos = fish.worldPos; //初始点
                if (gFishMgr.m_bFilp)
                    startPos = fish.worldPos.mul(-1);
                var coinTemp = [];
                if (player.userId == cc.dd.user.id)
                    coinTemp = cc.resources.get('gameyj_fish_doyen/prefabs/coinEffectMine', cc.Prefab);
                else
                    coinTemp = cc.resources.get('gameyj_fish_doyen/prefabs/coinEffectother', cc.Prefab);

                cc.log("coinNum:", coinNum)

                var row = Math.ceil(coinNum / FishType.coinMaxCol);
                var totalCol = FishType.coinMaxCol
                // if (row > 3) {
                //     row = Math.ceil(coinNum / FishType.coinMaxCol2);
                //     totalCol = FishType.coinMaxCol2
                // }
                var curSum = 0;
                var restNum = coinNum % totalCol
                var restStart = Math.floor((totalCol - restNum) / 2)
                for (var i = 0; i < totalCol; i++) {
                    for (var col = 0; col < row; col++) {
                        if (curSum >= coinNum)
                            break;
                        if (col * totalCol + i + 1 > coinNum)
                            continue;


                        curSum++;
                        var coinNode = cc.instantiate(coinTemp); //创建金币节点
                        coinNode.active = true;

                        var coin = cc.find('coin', coinNode);
                        // var row=Math.ceil(i/4);
                        // row = row==0?1:row;
                        // var line=Math.ceil(i%4);
                        var startX = startPos.x

                        startX += (col % 2) * coin.width
                        if (col % 2 > 0) {
                            startX = (col == (row - 1) ? (startPos.x + restStart * coin.width) : startX)
                        }

                        var coinPos = cc.v2(startX + (i * coin.width), startPos.y - col * coin.height)
                        coinNode.setPosition(coinPos);
                        this.m_oCoinPanle.addChild(coinNode);
                        // this.m_tCoinNode.push(coinNode);

                        coinNode.runAction(cc.sequence(
                            cc.jumpBy(0.4, cc.v2(0, 0), 100, 1),
                            cc.delayTime(i * 0.05),
                            cc.bezierTo(FishType.coinMoveActTime, [coinPos, coinPos.add(cc.v2(-20, -100)), toPos]),
                            cc.callFunc(this.removeNodeFromParent, coinNode)
                        ));

                    }
                }

                if (fish.dropItem) {
                    var itemImg = new cc.Node;
                    var img = itemImg.addComponent(cc.Sprite);
                    img.spriteFrame = this.m_hallItemAtlas.getSpriteFrame(fish.dropItem);

                    itemImg.setPosition(startPos);
                    this.m_oCoinPanle.addChild(itemImg);
                    // this.m_tCoinNode.push(itemImg);


                    itemImg.runAction(cc.sequence(
                        cc.jumpBy(0.2, cc.v2(0, 0), 60, 1),
                        cc.delayTime(FishType.coinMaxCol * 0.05),
                        cc.bezierTo(FishType.coinMoveActTime, [startPos, startPos.add(cc.v2(-20, 100)), toPos]),
                        cc.callFunc(this.removeNodeFromParent, coinNode)))
                }

            }
            if (fishCfg.fish_shake > 0)
                this.showBingo(userId, bulletpos, fishCfg);//显示bingo动画
        }
        // if(totalSrcCoinNum >= 100)
        //     this.showBingo(userId, bulletpos, totalGoldNum);//显示bingo动画

        var self = this;
        this.m_oCoinPanle.runAction(cc.sequence(cc.delayTime(FishType.dieActTime), cc.callFunc(function () {
            var player = playerManager.findPlayerByUserId(coinNodeInfo.userId);
            if (!player) {
                self.popCoinNodeList(coinNodeInfo.userId);
                return;
            }
            // var playerComData = player.getPlayerCommonInfo();
            // if(playerComData)
            //     self.showFoldCoin(playerComData.pos,  totalCoinNum, totalGoldNum);
            self.popCoinNodeList(player.userId);

        }
        )));
    },


    removeNodeFromParent: function (node) {
        node.removeFromParent(true);
    },

    showFoldCoin: function (nSite, totalCoinNum, goldNum) {//堆叠金币
        if (gFishMgr == null)
            return;
        var player = playerManager.findPlayerByUserPos(nSite);
        if (player == null)
            return;
        var playerData = player.getPlayerGameInfo();
        if (playerData == null)
            return;
        var playerNode = this.m_tPlayerInfo[nSite - 1]; //玩家座位
        var cfgPos = FishType.foldStartPos[nSite - 1]; //初始座位点
        this.updateOnePlayerGold(nSite); //更新玩家金币
        var curIndex = playerNode.foldCoinList.length;
        for (var k = 0; k < playerNode.foldCoinList.length; k++) {//重置数据
            if (k < curIndex - 3) {
                var v = playerNode.foldCoinList[k];
                if (v != null) {
                    v.removeFromParent(true);
                    playerNode.foldCoinList[k] = null;
                }

            }
        }

        var coinFoldNode = new cc.Node;
        totalCoinNum = Math.min(totalCoinNum, 50);
        var spaceTime = FishType.coinFoldSpaceTime;
        var childNode = [];
        var index = 0;
        for (var i = 0; i < totalCoinNum; i++) {//设置金币累积
            var coinFoldImg = new cc.Node;
            var img = coinFoldImg.addComponent(cc.Sprite);
            img.spriteFrame = this.m_oFoldCoinImg;
            coinFoldImg.y = (i - 0.5) * cfgPos[2];
            coinFoldImg.setOpacity(0);
            coinFoldImg.runAction(cc.sequence(cc.delayTime((i - 1) * spaceTime), cc.callFunc(function () {
                var coinFoldImg = childNode[index];
                coinFoldImg.setOpacity(255);
                coinFoldImg.removeAllChildren();
                index++;
            })))
            coinFoldNode.addChild(coinFoldImg);
            childNode.push(coinFoldImg);
        }
        var offsetX = cfgPos[1] * curIndex;
        coinFoldNode.setPosition(cfgPos[0].add(cc.v2(-offsetX, 0)));
        var opac = 255;
        var fadeInAct = cc.sequence(cc.delayTime(1 / 30), cc.callFunc(function () {
            coinFoldNode.setOpacity(opac);
            opac = opac - 255 / 30;
        }));
        var endAct = cc.callFunc(function () {
            coinFoldNode.active = false;
        })

        var posNum = cc.v2(0, (totalCoinNum) * cfgPos[2]);
        var foldNumNode = null;
        if (curIndex % 2 == 0)
            foldNumNode = cc.instantiate(this.m_resFoldScroe[0]);
        else
            foldNumNode = cc.instantiate(this.m_resFoldScroe[1]);
        var text = foldNumNode.getChildByName('num').getComponent(cc.Label);
        text.string = this.convertChipNum(goldNum, 1);
        if (goldNum >= 10000)
            foldNumNode.getChildByName('wan').active = true;
        else if (goldNum >= 1000000)
            foldNumNode.getChildByName('yi').active = true;
        foldNumNode.setPosition(posNum);
        foldNumNode.active = false;
        coinFoldNode.addChild(foldNumNode);

        // foldNumNode.runAction(cc.sequence(cc.delayTime(totalCoinNum * spaceTime), cc.callFunc(function(){
        //     foldNumNode.active = true;
        // })));

        coinFoldNode.runAction(cc.sequence(cc.delayTime(totalCoinNum * spaceTime), cc.callFunc(function () {
            foldNumNode.active = true;
        }), cc.delayTime(FishType.coinFoldStopTime), cc.repeat(fadeInAct, 30), endAct));
        playerNode.foldCoinNode.x = offsetX;
        playerNode.foldCoinNode.addChild(coinFoldNode);
        playerNode.foldCoinList.push(coinFoldNode);
    },


    showBingo: function (userId, bulletPos, fishCfg) {//展示bingo
        var player = playerManager.findPlayerByUserId(userId);
        var playerComData = null;
        if (!player) {
            cc.log('玩家数据不存在，在原位置显示showBingo');
            // return;
        } else {
            playerComData = player.getPlayerCommonInfo();
        }

        if (!playerComData) {
            pos = playerManager.findPosByUserId(dataInfo.userId) - 1;
            cc.log('玩家数据不存在，在原位置显示popCoinNodeList,pos:' + pos);
            // return;
        } else {
            pos = playerComData.pos - 1;
        }
        var bingoEffect = cc.resources.get('gameyj_fish_doyen/prefabs/bingoEffect', cc.Prefab);
        var atlas = cc.resources.get('gameyj_fish_doyen/atlas/p_buyu_classic_ui', cc.SpriteAtlas);
        if (bingoEffect) {
            var bingoNode = cc.instantiate(bingoEffect);
            bingoNode.scale = 0.9
            var head = cc.dd.Utils.seekNodeByName(bingoNode, 'headSp').getComponent(cc.Sprite);
            var spName = (fishCfg.key - 12)
            if (spName > 1) {
                spName = (spName == 2 ? 3 : 2)
            }

            head.spriteFrame = atlas.getSpriteFrame('bydr_game_img_boss_' + spName);

            var num = cc.dd.Utils.seekNodeByName(bingoNode, 'bingoNum');
            if (num)
                num.getComponent(cc.Label).string = fishCfg.fish_mtp_power * gFishMgr.getRoomRate();
            var Anim = bingoNode.getComponent(cc.Animation)
            Anim.play();

            bingoNode.runAction(cc.sequence(cc.delayTime(5), cc.callFunc(function () {
                bingoNode.removeFromParent(true);
            })));
            var playerNode = this.m_tPlayerInfo[pos];
            var chatBg = cc.find('text', playerNode.chatBubble);
            var offBg = chatBg.getPosition();
            if (pos >= 3 && pos <= 5) {
                offBg.y -= 50;
            } else {
                offBg.y += 50;
            }
            var bgPos = playerNode.chatBubble.convertToWorldSpaceAR(offBg);
            bingoNode.setPosition(this.m_oFishPool.convertToNodeSpaceAR(bgPos));


            if (gFishMgr.m_bFilp)
                bingoNode.setRotation(180);
            this.m_oFishPool.addChild(bingoNode);
        }
    },
    ///////////////////////////////金币处理end//////////////////////////////////////////////


    update: function (dt) {
        if (gFishMgr == null)
            return;
        gFishMgr.update(dt); //管理器更新

        if (this.m_fShakeTime != null) {//震屏显示
            this.m_fShakeTime += dt;
            this.m_nShake = this.m_nShake * Math.pow(0.5, dt / FishType.shakeReduce);
            var curVal = this.m_fShakeTime * Math.PI * 2 * FishType.shakeRate;
            var posY = Math.sin(curVal) * this.m_nShake;
            var posX = Math.cos(curVal) * this.m_nShake;
            if (this.m_nShake < 1) {
                this.m_fShakeTime = null;
            }
            this.m_oFishPoolBg.setPosition(cc.v2(posX, posY));
        }

        if (this.lockCDTime != null && this.lockCDTime > 0) {
            this.lockCDTime -= dt;
            var cd = cc.find("cd", this.m_lockIconNode)
            var txt = cc.find("cd/txt", this.m_lockIconNode).getComponent(cc.Label)
            var ProgressBar = cd.getComponent(cc.ProgressBar)
            txt.string = Math.floor(this.lockCDTime);
            ProgressBar.progress = this.lockCDTime / FishType.lockCDTime;
        } else {
            var cd = cc.find("cd", this.m_lockIconNode)
            cd.active = false;
            this.m_bGuaji = false;
            var playerData = gFishMgr.getMyData(); //获取自己的游戏数据
            if (playerData && playerData.lockFishID > 0) {
                this.stopGuaJi();
            }
        }

        if (this.iceCDTime != null && this.iceCDTime > 0) {
            this.iceCDTime -= dt;
            var cd = cc.find("cd", this.m_iceIconNode)
            if (cd.active) {
                var txt = cc.find("cd/txt", this.m_iceIconNode).getComponent(cc.Label)
                var ProgressBar = cd.getComponent(cc.ProgressBar)
                txt.string = Math.floor(this.iceCDTime >= 0 ? this.iceCDTime : 0);
                ProgressBar.progress = this.iceCDTime / FishType.ICE_CD_TIME;
            }

        } else {

            if (gFishMgr.m_bIceEffect) {
                gFishMgr.m_bIceEffect = false;
                this.m_iceEffectNode.active = false;
                var cd = cc.find("cd", this.m_iceIconNode)
                cd.active = false;
                shaderUtils.clearShader(this.m_oFishPoolBg.getComponent(cc.Sprite));
            }

            // 

        }

        var playerData = gFishMgr.getMyData(); //获取自己的游戏数据
        if ((playerData && this.m_autoBet) || (playerData && playerData.lockFishID > 0 || this.m_bClick)) {
            if (playerData.coin < gFishMgr.getPlayerBet()) {//身上金币少于下注值
                if (playerData.foldCoinNum == 0 && gFishMgr.getMyBulletNums() == 0) {
                    this.playAudio(6, false, 1);
                    this.setLockFish(this.m_nSite, -1);
                    this.stopGuaJi();
                    cc.dd.PromptBoxUtil.show('金币不足', null, 1);
                    this.showChargeGold();
                    this.m_bClick = false;
                    // this.showBag();
                }
            } else {

                this.m_nAutoBetTime += dt;
                var betSpace = FishType.autoBetSpaceTime[gFishMgr.m_currentGunId - 10055];
                // if (playerData.buff_end_time >= new Date().getTime())//能量弹
                //     betSpace = betSpace / 2;
                betSpace = Math.max(betSpace, 0.22);
                if (this.m_nAutoBetTime >= betSpace) { //子弹发射间隔时间
                    gFishMgr.Bet(playerData.betDir, playerData.lockFishID); //创建子弹
                    this.m_nAutoBetTime = 0; //时间差
                    this.m_bClick = false;
                }
            }
        }

        ///////////////////////锁定鱼操作/////////////////////////
        for (var i = 0; i < PLAYER_COUNT; i++) {
            var player = playerManager.findPlayerByUserPos(i + 1);
            if (player) {//如果有玩家数据
                var playerComData = player.getPlayerCommonInfo();
                var playerData = player.getPlayerGameInfo();
                if (playerData && playerComData) {
                    var playerNode = this.m_tPlayerInfo[i];
                    if (playerData.lockFishID) {//有锁定的鱼
                        var lockInfo = gFishMgr.getFishToLock(playerData.lockFishID);
                        if (lockInfo) {
                            var lockFish = lockInfo.fish;
                            var fishPos = lockInfo.fishPos;
                            if (lockFish) {
                                var dir = this.paoTaiFaceTo(i, fishPos);//设置炮台位置
                                playerData.betDir = dir; //设置玩家炮台朝向
                                // var startPos = gFishMgr.getBulletPos(i);
                                // var fishArPos = lockInfo.fishArPos;
                                // if (gFishMgr.m_bFilp)
                                //     fishArPos = cc.pMult(fishArPos, -1);
                                // var offset = cc.pSub(fishArPos, startPos);//获取鱼与子弹初始点差值向量
                                // var distance = Math.sqrt(offset.x * offset.x + offset.y * offset.y);//向量长度
                                // var qiPao = playerNode.trackQiPao;
                                // var qipaoLen = distance - FishType.qiPaoOffset;
                                // var needCount = Math.max(1, Math.min(Math.floor(qipaoLen / FishType.qiPaoDistance))); //获取需要多少个气泡
                                // needCount = Math.min(needCount, qiPao.length);
                                // for (var j = 0; j < needCount; j++) {
                                //     qiPao[j].active = true;
                                //     var position = cc.v2(j / needCount * qipaoLen + FishType.qiPaoOffset, 0);
                                //     qiPao[j].setPosition(position);
                                // }
                                // for (var m = needCount; m < qiPao.length; m++)
                                //     qiPao[m].active = false;
                            } else {
                                gFishMgr.setLockFish(i + 1, - 1);
                                // playerNode.trackLock.active = false;
                                if (playerNode.trackQiPaoCnt)
                                    playerNode.trackQiPaoCnt.active = false;
                            }
                        } else {
                            gFishMgr.setLockFish(i + 1, - 1);
                            // playerNode.trackLock.active = false;
                            if (playerNode.trackQiPaoCnt)
                                playerNode.trackQiPaoCnt.active = false;
                        }
                    }
                    this.updateOnePlayerBetTimes(player.userId, playerData.betDataid);//更新下注倍率
                }
            }
        }
        if (this.m_bGuaji) {//自动瞄准
            var playerData = gFishMgr.getMyData()//获取自己的游戏数据
            if (playerData && playerData.lockFishID <= 0) {
                var lockFishId = gFishMgr.getAutoLockFish(); //获取自动锁定的鱼id
                if (lockFishId > 0) {
                    gFishMgr.setLockFish(gFishMgr.getMysite(), lockFishId);
                }
            }
        }

        if (this.m_fRunCaoXi != null) {
            if (this.m_fRunCaoXi > 0) {
                this.m_fRunCaoXi -= dt;//倒计时
                var cntSize = this.m_panleCaoXi.getContentSize();
                cntSize.width = (1 - this.m_fRunCaoXi / FishType.caoXiActTime) * 1280;
                if (cntSize.width >= 1280)
                    cntSize.width = 1280;
                this.m_panleCaoXi.width = cntSize.width; //设置大小
                this.m_caoXiNode.setPosition(cc.v2(-cntSize.width + 640, 0));
            } else {
                this.m_fRunCaoXi = null;
                this.m_panleCaoXi.removeFromParent(true);
                this.m_caoXiNode.removeFromParent(true);
                this.m_oFishPoolBg.getComponent(cc.Sprite).spriteFrame = this.m_bgImgeSpriteFrame;
                this.playBGMusic();
            }

        }
    },

    showChargeGold: function (gameId, callFunc) {

        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_JIUJI, function (ui) {
            var jiuji = ui.getComponent('klb_hall_jiuji');
            if (jiuji != null) {
                jiuji.update_buy_list(Math.max(6, gFishMgr.m_tGameRoomCfg.entermin));
            }
        }.bind(this));
        if (this.m_clickAutoBet) {
            // this.onClickAutoBet();
            this.m_autoBetToggle.check();
            this.m_autoBetToggle.isChecked = false;
        } else {
            this.setAutoBet();
        }
        // this.m_bGuaji =false;
    },

    getFishPoolNode: function () {
        return this.m_oFishPool;
    },

    setAutoBet: function (bAuto) {//自动发射子弹
        this.m_autoBet = this.m_clickAutoBet ? this.m_clickAutoBet : bAuto;
    },

    onClickAutoBet: function () {
        this.m_clickAutoBet = !this.m_clickAutoBet;
        this.setAutoBet();
    },


    getBulletDir: function (nSite, worldPos, isServer) {//获取指定玩家位置的子弹朝向
        var startPos = gFishMgr.getBulletPosInWorld(nSite);//gFishMgr.toSeverSite(nSite+1) - 1);//isServer?(gFishMgr.toSeverSite(nSite+1) - 1):nSite); //获取子弹生成的世界坐标
        var offset = worldPos.sub(startPos);
        var dir = pToAngleSelf(offset); //方向弧度
        var startDir = g_paoTaiStartDir[nSite];

        dir = RadianToFormat(dir, startDir + g_RotRangeLen / 2 - Math.PI);

        if (dir < startDir)
            dir = startDir;
        else if (dir > startDir + g_RotRangeLen)
            dir = startDir + g_RotRangeLen;
        return dir;
    },

    paoTaiFaceTo: function (nSite, clickPos) {//炮台朝向
        var bulletDir = this.getBulletDir(nSite, clickPos); //获取子弹弧度值
        // cc.log("bulletDir:",bulletDir);
        this.paoTaiDir(nSite, bulletDir); //炮台弧度值
        return bulletDir;
    },

    paoTaiDir: function (nSite, dir) {//炮台弧度值
        var playerNode = this.m_tPlayerInfo[nSite];

        var offset = g_paoTaiRotOffset[nSite];
        var paoDir = offset[0] * dir + offset[1] * Math.PI;

        // playerNode.trackQiPaoCnt.setRotation(RadianToAngleOfUI(dir)); //气泡点旋转度；
        playerNode.paoTaiCnt.setRotation(RadianToAngleOfUI(paoDir)); //设置旋转角度；
        playerNode.paoTaiCnt.active = true;
        playerNode.paoTaiDi.active = true;
        // this.paoTaiMoveAct(nSite, dir);
    },


    paoTaiMoveAct: function (nSite, dir) {//炮台发炮动画

        var playerNode = this.m_tPlayerInfo[nSite];
        var orPos = this.m_tPaoTaiPos[nSite];

        var startSpeed = cc.v2(Math.cos(dir), Math.sin(dir));
        var playerNode = this.m_tPlayerInfo[nSite];
        var endPos = orPos.sub(startSpeed.mul(15));
        playerNode.paoTaiCnt.runAction(cc.sequence(cc.moveTo(0.1, endPos), cc.delayTime(0.02), cc.moveTo(0.1, orPos)));

        var player = playerManager.findPlayerByUserPos(nSite + 1);

        // if(gFishMgr.isThreeBullet(player.userId)){
        //     var fireNode = playerNode.paoTaiCnt.getChildByName('fire02');
        //     if(fireNode){
        //         fireNode.active = true;
        //         fireNode.getComponent(cc.Animation).play();
        //     }
        // }else{
        var fireNode = playerNode.paoTaiCnt.getChildByName('fire01');
        if (fireNode) {
            fireNode.active = true;
            fireNode.getComponent(cc.Animation).play();
        }
        // }
    },


    setLockFish: function (nSite, dataCfg) {//显示鱼被锁定的动画
        // var playerNode = this.m_tPlayerInfo[nSite - 1]; 
        // if(playerNode){
        //     playerNode.trackLock.removeAllChildren(true); //删除锁定图标的所有节点
        //     if(dataCfg){
        //         var fishImg = CFish.createFishLockNode(dataCfg, 110);
        //         fishImg.center = cc.v2(0,0);
        //         playerNode.trackLock.addChild(fishImg);

        //         playerNode.trackLock.active = (dataCfg != null ? true : false);
        //         playerNode.trackQiPaoCnt.active = (dataCfg != null ? true : false);
        //     }
        // }
    },

    createFishNetEffect: function (pos, gunid) {//创建渔网
        var netNode = null;
        // if(bThree){
        //     netNode = cc.loader.getRes('gameyj_fish_doyen/prefabs/fish_net_2', cc.Prefab);
        // }else{
        //     netNode = cc.loader.getRes('gameyj_fish_doyen/prefabs/fish_net_1', cc.Prefab);
        // }
        netNode = cc.resources.get('gameyj_fish_doyen/prefabs/fish_net', cc.Prefab);
        var netNodeImage = cc.instantiate(netNode);
        var anim = netNodeImage.getChildByName('net').getComponent(cc.Animation);
        var aniNets = anim.getClips();
        if (gunid <= 10057 || gunid == null) {
            anim.play(aniNets[0].name, 0);
        } else {
            anim.play(aniNets[gunid - 10057].name, 0);
        }

        anim.on('finished', function () {
            netNodeImage.removeFromParent(true);
        });
        netNodeImage.setPosition(pos); //设置网点
        netNodeImage.parent = this.m_oFishPoolBg;
        return netNodeImage;
    },

    updateOnePlayerBetTimes: function (userId, betDataid) {//更新炮倍率显示

        var player = playerManager.findPlayerByUserId(userId); //通用玩家
        if (player) {
            var playerComData = player.getPlayerCommonInfo(); //游戏通用资源
            if (playerComData) {
                var playerNode = this.m_tPlayerInfo[playerComData.pos - 1];
                if (playerNode) {
                    // playerNode.textBet.getComponent(cc.Label).string = bet; //设置炮弹倍率
                    // playerNode.textBet.parent.active = true;
                    var childPao = playerNode.paoTaiCnt.getChildByName('paotaiSp');
                    if (childPao) {
                        var itemCfg = itemcfg.getItem(function (element) {
                            if (element.key == betDataid)
                                return true;
                        }.bind(this));
                        var paotTaiImage = this.paoTaiAtals.getSpriteFrame(itemCfg.icon);;
                        childPao.getComponent(cc.Sprite).spriteFrame = paotTaiImage; //设置炮台图片
                    }
                    playerNode.paoTaiCnt.active = true;
                    playerNode.paoTaiDi.active = true;
                    // var playerGameData = player.getPlayerGameInfo();
                    // if(playerGameData){

                    // }
                }
            }
        }
    },

    updatePlayerEnergyTime: function (nSite, time) {//更新玩家能量弹倒计时
        var playerNode = this.m_tPlayerInfo[nSite - 1];
        // if(playerNode){
        //     if(time >= 0){
        //         playerNode.energyLeftText.active = true;
        //         playerNode.energyLeftText.getComponent(cc.Label).string = time;
        //     }else
        //         playerNode.energyLeftText.active = false;
        // }
    },

    createSd: function (nSite) {//创建锁定鱼都标记
        var nodeSd = new cc.Node(); //创建一个节点
        var nodeSp = nodeSd.addComponent(cc.Sprite); //绑定一个精灵组件;
        if (nSite == gFishMgr.getMysite()) {//自己锁定
            nodeSp.spriteFrame = this.m_tLockSprite[0];
            var animation = nodeSd.addComponent(cc.Animation);
            var clip = cc.resources.get('gameyj_fish_doyen/animation/lock', cc.AnimationClip);
            animation.addClip(clip);
            animation.play('lock');
        } else {
            return null;//别人锁定不需要显示
            // nodeSp.spriteFrame = this.m_tLockSprite[1];
        }

        nodeSd.setPosition(cc.v2(0, 0));
        return nodeSd;
    },


    onClickFishPool: function (event, data) {//点击鱼池
        // cc.log("$$touch pool type:",event.type);
        if (gFishMgr == null)
            return;
        var nSite = gFishMgr.getMysite() - 1; //数据保存位置以1开始
        if (cc.Node.EventType.TOUCH_START == event.type) {//刚刚点击接触
            if (this.chat_item.parent.parent.active) {
                this.closeChat()
                return;
            }

            if (this.m_bMenuOpen) {
                this.onClickMenueBtn();
                return;
            }

            var playerData = gFishMgr.getMyData(); //获取自己的游戏数据
            if (playerData.coin < gFishMgr.getPlayerBet()) {//身上金币少于下注值
                this.playAudio(6, false, 1);
                this.setLockFish(this.m_nSite, -1);
                this.stopGuaJi();
                cc.dd.PromptBoxUtil.show('金币不足');
                this.showChargeGold();
            }
            var playerNode = this.m_tPlayerInfo[gFishMgr.getMysite() - 1];
            if (playerNode.siteShine.active) {
                playerNode.siteShine.active = false;
            }



            var clickPos = event.touch.getStartLocation(); //触点落下位置
            var dir = this.paoTaiFaceTo(nSite, clickPos); //炮台朝向
            cc.log("dir:", dir);
            this.setAutoBet(true); //设置为自动发射子弹
            this.m_bClick = true;
            // var fish = gFishMgr.getHitFish(cc.v2(clickPos.x, clickPos.y)); //获取是否点击了鱼
            // if(fish)//锁定了鱼
            //     gFishMgr.setLockFish(nSite + 1, fish.m_fishID);
            // else
            if (gFishMgr.getMyData().lockFishID != -1)
                return;//gFishMgr.setLockFish(nSite + 1, -1);//未锁定鱼

            gFishMgr.getMyData().betDir = dir; //我自己的炮台朝向
        } else if (cc.Node.EventType.TOUCH_MOVE == event.type) {//触摸点移动
            if (gFishMgr.getMyData().lockFishID != -1)
                return;
            gFishMgr.getMyData().betDir = this.paoTaiFaceTo(nSite, event.touch.getLocation());//计算新的自己的炮台朝向
        } else if (cc.Node.EventType.TOUCH_END == event.type) {//点击结束
            this.setAutoBet(false);//结束自动发射子弹
        } else if (cc.Node.EventType.TOUCH_CANCEL == event.type) {//取消点击
            this.setAutoBet(false);//结束自动发射子弹
        }
    },

    onClickChoseAim: function (event, data) {
        if (this.m_bAmi) {
            var Anim = event.target.getChildByName('mzAct');
            Anim.active = false;
        } else {
            var Anim = event.target.getChildByName('mzAct');
            Anim.active = true;
            Anim.getComponent(cc.Animation).play();
        }
        this.m_bAmi = !this.m_bAmi;
        gFishMgr.setAimTag(this.m_bAmi);
    },

    onClickAddOrSubBtn: function (event, data) {//点击加减档位按钮
        this.playAudio(7, false, 1);
        gFishMgr.setBetTimes(parseInt(data));
    },

    onClickMz: function (event, data) {//瞄准功能
        if (this.lockCDTime > 0)
            return;
        if (gFishMgr.getTools(2) < 1) {
            this.onClickShop(0.9);
            return;
        }
        gFishMgr.requestUseItem(2);
    },

    startMz: function () {
        this.playAudio(14, false, 1);
        // if(this.m_bGuaji){
        //     this.m_bGuaji = false;
        //     var Anim = event.target.getChildByName('mzAct');
        //     Anim.active = false;
        //     gFishMgr.setLockFish(gFishMgr.getMysite(), -1);
        // }else


        this.m_bGuaji = true;
        // var Anim = event.target.getChildByName('mzAct');
        // Anim.active = true;
        var cd = cc.find("cd", this.m_lockIconNode)
        var txt = cc.find("cd/txt", this.m_lockIconNode).getComponent(cc.Label)
        var ProgressBar = cd.getComponent(cc.ProgressBar)
        cd.active = true;
        txt.string = '' + FishType.lockCDTime;
        ProgressBar.progress = 1;
        this.lockCDTime = FishType.lockCDTime;
        this.playAudio(14);

    },

    onClickIce: function (event, data) {//瞄准功能
        if (this.iceCDTime > 0)
            return;
        if (gFishMgr.getTools(1) < 1) {
            this.onClickShop(0.4);
            return;
        }
        gFishMgr.requestUseItem(1);
    },

    startEffect: function (type, isOther) {
        if (type == 1) {
            this.startIce(isOther);
        } else {
            this.startMz();
        }
    },
    startIce: function (isOther, remainTime) {
        this.m_iceEffectNode.active = true;
        var ani = this.m_iceEffectNode.getComponent(cc.Animation);
        ani.play('ice', 0);

        if (isOther) {
            this.iceCDTime = remainTime || FishType.ICE_CD_TIME;
        } else {
            var cd = cc.find("cd", this.m_iceIconNode)
            var txt = cc.find("cd/txt", this.m_iceIconNode).getComponent(cc.Label)
            var ProgressBar = cd.getComponent(cc.ProgressBar)
            cd.active = true;
            txt.string = FishType.ICE_CD_TIME;
            ProgressBar.progress = 1;
            this.iceCDTime = FishType.ICE_CD_TIME;
        }


        gFishMgr.m_bIceEffect = true;

        this.playAudio(13);
        this.m_iceEffectNode.setOpacity(79)
        // this.m_iceEffectNode.runAction(cc.sequence(cc.delayTime(0.3), cc.callFunc(function(){
        shaderUtils.setShader(this.m_oFishPoolBg.getComponent(cc.Sprite), 'light');
        // }.bind(this))));

    },

    stopGuaJi: function () {
        this.m_bGuaji = false;

        // var playerNode = this.m_tPlayerInfo[gFishMgr.getMysite() - 1];
        // var Anim = playerNode.btnMz.getChildByName('mzAct');
        // Anim.active = false;
        gFishMgr.setLockFish(gFishMgr.getMysite(), -1);
    },

    onClickMenueBtn: function (event, data) {//点击菜单按钮
        this.playAudio(6, false, 1);
        if (this.m_menuAnim == null) {
            this.m_menuAnim = event.target.parent.getComponent(cc.Animation);
        }
        var aniState = this.m_menuAnim.getAnimationState('menu');
        if (aniState.isPlaying) return;
        if (this.m_menuAnim) {
            this.m_menuAnim.play();
            this.m_menuAnim.on('finished', this.menuFinished, this);
        }
    },

    menuFinished: function () {
        var aniState = this.m_menuAnim.getAnimationState('menu');
        this.m_menuAnim.off('finished', this.menuFinished, this);
        if (aniState.wrapMode == cc.WrapMode.Normal) {
            aniState.wrapMode = cc.WrapMode.Reverse;
        } else {
            aniState.wrapMode = cc.WrapMode.Normal;
        }
        this.m_bMenuOpen = !this.m_bMenuOpen
    },

    onClickSettingBtn: function (event, data) {//打开设置界面
        this.playAudio(40, false, 1);
        cc.dd.UIMgr.openUI("gameyj_fish_doyen/prefabs/gameyj_fish_doyen_setting_ui", function (node) { });
    },

    onClickFishTypeBtn: function (event, data) {//打开鱼类型界面
        this.playAudio(40, false, 1);
        cc.dd.UIMgr.openUI("gameyj_fish_doyen/prefabs/gameyj_fish_doyen_type_ui", function (prefab) {

        });

    },

    // onClickFishSpecialBtn: function(event, data){//打开特殊玩法
    //     this.playAudio(7002, false, 1);
    //     this.m_oSpecialNode.active = true;
    // },

    // onCloseFishSpecial: function(event, data){
    //     this.playAudio(7002, false, 1);
    //     this.m_oSpecialNode.active = false;
    // },

    onClickQuitBtn: function (event, data) {//退出游戏
        this.playAudio(40, false, 1);
        var player = playerManager.findPlayerByUserId(cc.dd.user.id);
        if (!player)
            gFishMgr.quitGame();

        var playerData = player.getPlayerGameInfo(); //获取游戏数据

        this.showExchenge(playerData ? playerData.coin : 0, true);

        // this.m_oQuitPopNode.active = true;
        // var desc = cc.dd.Utils.seekNodeByName(this.m_oQuitPopNode, 'desc');
        // if(desc){
        //     var text = desc.getComponent(cc.Label);
        //     var player = playerManager.findPlayerByUserId(cc.dd.user.id);
        //     if(!player)
        //         gFishMgr.quitGame();
        //     else{
        //         var playerData = player.getPlayerGameInfo();
        //         if(!playerData)
        //             gFishMgr.quitGame();
        //         if(playerData.coin - player.startCoin == 0)
        //             text.string = '您在本次游戏中没有盈利，是否现在就退出？';
        //         else if(playerData.coin - player.startCoin > 0)
        //             text.string = '您在本次游戏中共盈利' + (playerData.coin - player.startCoin * gFishMgr.FISH_GOLD_RATE) + '，是否现在就退出？';

        //     }
        // }
    },

    onClickConfirmQuit: function (event, data) {//确定退出
        this.playAudio(6, false, 1);
        gFishMgr.quitGame();
    },

    onClickCancle: function (event, data) {//取消
        this.playAudio(6, false, 1);
        this.m_oQuitPopNode.active = false;
    },

    clickShowPlayer: function (event, data) { //显示玩家信息
        var nSite = event.target._tag
        var player = playerManager.findPlayerByUserPos(nSite);
        if (!player) {
            return;
        }

        var playerData = player.getPlayerGameInfo();

        cc.dd.UIMgr.openUI("gameyj_fish_doyen/prefabs/user_info_fish_doyen", function (node) {
            let ui = node.getComponent('user_info_view');
            ui.updateUI(playerData);
        }.bind(this));
        // var node = this.m_tPlayerInfo[nSite - 1]
        // if(node){
        //     var player = playerManager.findPlayerByUserPos(nSite);
        //     if(player){
        //         var playerData = player.getPlayerCommonInfo();
        //         if(!playerData)
        //             return
        //         node.playerInfo.getChildByName('name').getComponent(cc.Label).string = playerData.name;
        //         node.playerInfo.getChildByName('id').getComponent(cc.Label).string = player.userId;
        //         node.playerInfo.active = true;
        //     }
        // }
        // cc.dd.Utils.seekNodeByName(this.node, 'clickHide').active = true;
    },

    clickHidePlayerInfo: function (event, data) { //关闭玩家信息
        for (var i = 0; i < PLAYER_COUNT; i++) {
            var node = this.m_tPlayerInfo[i].playerInfo;
            if (node) {
                node.active = false;
            }
        }
        cc.dd.Utils.seekNodeByName(this.node, 'clickHide').active = false;
    },

    showBag: function () {
        cc.dd.UIMgr.openUI('gameyj_fish_doyen/prefabs/fish_game_bag', function (ui) {
            ui.getComponent('com_game_bag');
        }.bind(this));
    },

    onClickShop: function (per) {
        cc.dd.UIMgr.openUI('gameyj_fish_doyen/prefabs/fish_doyen_shop_ui', function (ui) {
            if (per) {
                var scr = ui.getComponent('gameyj_Fish_doyen_shop')
                scr.scrollTo(per);
            }
        }.bind(this));
    },

    onClickGift: function (per, data) {
        cc.dd.UIMgr.openUI('gameyj_fish_doyen/prefabs/fish_doyen_gift_bag', function (ui) {
            if (per) {
                let node = cc.find(data, ui)
                var scr = ui.getComponent('gameyj_Fish_doyen_gift')
                scr.showView(node);
            }
        }.bind(this));

        var ui = cc.dd.UIMgr.getUI("gameyj_fish_doyen/prefabs/xl_bydr_hddh");
        if (ui) {
            let cpt = ui.getComponent("gameyj_Fish_doyen_animation");
            if (cpt) {
                cpt.close();
            }
        }

    },
    enterSelectRoom: function () {

        AudioManager.clearBackGroundMusicKey();

        cc.dd.SceneManager.replaceScene(AppCfg.HALL_NAME, null, null, function () {

            var gameId = cc.sys.localStorage.getItem('fishGameId');
            // var roomId = cc.sys.localStorage.getItem('fishRoomId');

            // let data = {
            //     roomid : roomId,
            //     gameid: gameId,
            // }
            // gFishMgr.setRoomItem(data);
            cc.dd.UIMgr.openUI('gameyj_fish_doyen/prefabs/fish_doyen_hall_room', function (prefab) {

            });
            cc.dd.NetWaitUtil.show('正在请求数据');
            var protoNewRoomList = new cc.pb.hall.hall_req_new_room_list();
            protoNewRoomList.setHallGameid(gameId);
            cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_hall_req_new_room_list, protoNewRoomList,
                '发送协议[id: ${cmd_hall_req_new_room_list}],cmd_hall_req_new_room_list,[房间列表]', true);

        });


    },

    clearAllPlayer: function () {
        var players = playerManager.getAllPlayer();
        if (players == null)
            return;

        for (var i = 0; i < 6; i++) {

            this.m_tPlayerInfo[i].root.active = false;
            this.m_tPlayerInfo[i].waitTexture.active = true;
            if (this.m_tPlayerInfo[i].trackQiPaoCnt)
                this.m_tPlayerInfo[i].trackQiPaoCnt.removeFromParent(true);
        }
    },

    playerLeave: function (userId) {
        if (userId == cc.dd.user.id) {//自己离开
            this.enterSelectRoom();
            gFishMgr.clearAllData();
            playerManager.clearAllData();

        } else {
            var player = playerManager.findPlayerByUserId(userId);
            if (player) {
                var playerData = player.getPlayerCommonInfo();
                if (playerData) {
                    this.m_tPlayerInfo[playerData.pos - 1].root.active = false;
                    this.m_tPlayerInfo[playerData.pos - 1].waitTexture.active = true;
                    // this.m_tPlayerInfo[playerData.pos - 1].trackLock.active = false;
                    if (this.m_tPlayerInfo[playerData.pos - 1].trackQiPaoCnt)
                        this.m_tPlayerInfo[playerData.pos - 1].trackQiPaoCnt.removeFromParent(true);
                }
            }
            playerManager.deletePlayer(userId);
        }
    },
    /////////////////////////////////////////消息通讯///////////////////////////////////
    onEventMessage: function (event, data) {
        switch (event) {
            case playerEvent.FISH_I_AM_COMING:
                if (gFishMgr.getIsInit())//是切后台前台的断线重连
                {
                    gFishMgr.reconnectClear();
                }
                break;
            case playerEvent.Fish_PLAYER_ENTER:
                this.updateOnePlayerInfo(data);

                // var player = playerManager.findPlayerByUserPos(data); //获取玩家信息
                // if(player && player.userId == cc.dd.user.id){
                //     var playerComData = player.getPlayerCommonInfo();
                //     // if(playerComData && (playerComData.seat + 1 == 2 || playerComData.seat + 1 == 3))
                //     //     this.m_oFishPoolBg.setRotation(180);
                // }
                break;
            case playerEvent.Fish_PLAYER_EXIT:
                this.playerLeave(data);
                break;
            case playerEvent.FISH_PLAYER_COIN_CHANGE:
                this.updateOnePlayerGold(data);
                break;
            case HallCommonEvent.HALL_NO_RECONNECT_GAME:
                this.playerLeave(cc.dd.user.id);
                break;

            case HallCommonEvent.UPDATA_PropData:
                this.updateTools(data);
                break;
            case ChatEvent.CHAT:
                if (data.msgtype == 1)
                    this.showChatBubble(data)
                else if (data.msgtype == 3) {
                    this.playMagicProp(data.id, data.sendUserId, data.toUserId);
                }
                break;
            case SysEvent.PAUSE:
                if (this.m_clickAutoBet) {
                    this.m_autoBetToggle.check();
                    this.m_autoBetToggle.isChecked = false;
                } else {
                    this.setAutoBet();
                }
                break;
            case SysEvent.RESUME:
                if (this.m_clickAutoBet) {
                    this.m_autoBetToggle.check();
                    this.m_autoBetToggle.isChecked = false;
                } else {
                    this.setAutoBet();
                    cc.log();
                }
                break;
            case Hall.HallEvent.FISH_GIFT:
                this.initGift();
                break;
            case Hall.HallEvent.AUTO_GIFT:
                this.autuAcquisition(data);
                break;
            case Hall.HallEvent.SHOW_GIFT_ANIM:
                this.showGiftAnima(data);
                break;
            case Hall.HallEvent.FISH_ACTIVITY:
                this.activitySwitch(data);
                break;
            // case RoomEvent.on_room_enter:
            //     this.on_room_enter();
            //     break;
        }
    },

    /**
     * 播放魔法道具
     * @param idx
     * @param fromId
     * @param toId
     */
    playMagicProp: function (idx, fromId, toId) {
        let magic_prop = cc.find("Canvas").getComponentInChildren("com_magic_prop");
        let magic_pos = magic_prop.node.convertToWorldSpaceAR(cc.v2(0, 0));
        let from_pos = cc.v2(0, 0);
        let to_pos = cc.v2(0, 0);

        var player = playerManager.findPlayerByUserId(fromId);
        if (player == null)
            return;
        var playerData = player.getPlayerCommonInfo();
        if (playerData == null)
            return;
        var playerNode = this.m_tPlayerInfo[playerData.pos - 1]; //获取玩家座位节点
        if (playerNode == null)
            return;
        from_pos = playerNode.headIcon.convertToWorldSpaceAR(cc.v2(0, 0)).sub(magic_pos);

        player = playerManager.findPlayerByUserId(toId);
        if (player == null)
            return;
        playerData = player.getPlayerCommonInfo();
        if (playerData == null)
            return;
        playerNode = this.m_tPlayerInfo[playerData.pos - 1]; //获取玩家座位节点
        if (playerNode == null)
            return;

        to_pos = playerNode.headIcon.convertToWorldSpaceAR(cc.v2(0, 0)).sub(magic_pos);


        magic_prop.playMagicPropAni(idx, from_pos, to_pos);
    },

    showChatBubble: function (data) {
        var player = playerManager.findPlayerByUserId(data.sendUserId);
        if (player == null)
            return;
        var playerData = player.getPlayerCommonInfo();
        if (playerData == null)
            return;
        var playerNode = this.m_tPlayerInfo[playerData.pos - 1];
        var chtItem = chatCfg.getItem(function (element) {
            if (element.key == data.id)
                return true;
        }.bind(this));

        if (chtItem) {
            playerNode.chatBubble.active = true;
            cc.find('text', playerNode.chatBubble).getComponent(cc.Label).string = chtItem.text;
        }
        playerNode.chatBubble.runAction(cc.sequence(cc.delayTime(3), cc.callFunc(function () {
            playerNode.chatBubble.active = false;
        })));
    },

    //转换筹码字
    convertChipNum: function (num, type) {
        var str = num;
        if (num >= 10000 && num < 100000000) {
            str = (num / 10000).toFixed(type);
            var index = str.indexOf('.');
            if (index == 3)
                str = str.substr(0, 5);
            else
                str = str.substr(0, 4);
        } else if (num >= 100000000) {
            str = (num / 100000000).toFixed(type);
            var index = str.indexOf('.');
            if (index == 3)
                str = str.substr(0, 5);
            else
                str = str.substr(0, 4);
        }
        str = str.toString()
        str = str.replace('.', ':');
        return str
    },


    getFormatNumber: function (number, vPos) {
        var str = ""
        if (vPos == 3)
            str = str + (Math.round(number * 1000) / 1000);
        else if (vPos == 4)
            str = str + (Math.round(number * 10000) / 10000);
        else
            str = str + (Math.round(number * 100) / 100);

        //cc.log("str:",str);
        return str
    },

    //播放相应音效
    playAudio: function (audioId, isloop, volume) {
        AudioManager.setSoundVolume(volume ? volume : 1);
        var itemCfg = audioCfg.getItem(function (element) {
            if (element.key == audioId)
                return true;
        }.bind(this));
        return AudioManager.playSound(FishType.fishAuidoPath + itemCfg.audio_name + '', isloop);
    },

    playBGMusic: function () {
        var bgidx = this.m_nCurBgIndex + 1
        var itemCfg = audioCfg.getItem(function (element) {
            if (element.key == bgidx)
                return true;
        }.bind(this));

        if (AudioManager._getLocalMusicSwitch())
            AudioManager.playMusic(FishType.fishAuidoPath + itemCfg.audio_name + '');

    }
});
