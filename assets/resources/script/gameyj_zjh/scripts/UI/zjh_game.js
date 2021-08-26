var FOLLOW_TAG_T = cc.Enum(
    {
        ADD_FOLLOW: 1,
        ALONG_FOLLOW: 2,
    });

var PROGRESS_ID1 = 5151
var PROGRESS_ID2 = 5152

var CHIP_RANG_RX = 100
var CHIP_RANG_RY = 70

var OPACITY_DIS = 100
var HEAD_SCALE = 1.1
const onePlayerOpTime = 10 //单个玩家操作时间

const REMOTE_PATH = 'http://47.92.48.105:8888/robot_icon/';
const zjhAudioDir = 'gameyj_zjh/audios/';

var CompareFrame = cc.Enum(
    {
        CompareFrame1: "zjh_ziti1",
        CompareFrame2: "zjh_guzhuyizx",
    });
var readyTime = 10  //准备时间
var IS_TEST = true;
var LEAVE_TAG = 10

var var_ORDER = cc.Enum(
    {
        Clip_order: 100,
        Card_order: 101,
        Cardty_order: 102,
        LookCard_order: 103,
        RoomBet_order: 104,
        AddBet_order: 105,
        Compare_order: 106,
    });

var CardTypeSpr = cc.Enum(
    {
        [1]: "zjh_paixing_sanpai",
        [2]: "zjh_paixing_duizi",
        [3]: "zjh_paixing_shunzi",
        [4]: "zjh_paixing_jinhua",
        [5]: "zjh_paixing_tonghuashun",
        [6]: "zjh_paixing_baozi",
    });

var dd = cc.dd;
var data_zhajinhuaRoom = require('zhajinhuaRoom');
var gZJHMgr = require('ZjhManager').Instance();
// var ZJHED = gZJHMgr.ZJHED;
// var ZJHEvent = gZJHMgr.ZJHEvent;
var zjh_msg_send = require('jlmj_net_msg_sender_zjh');
var CZhaJinHuaCard = require("ZhaJinHuaCard");
var CChipNode = require("ChipNode");
var AudioManager = require('AudioManager').getInstance();
var game_room = require("game_room");
//var AudioPath = require("ccmj_audio_path");
var HallCommonObj = require('hall_common_data');
var HallCommonEd = HallCommonObj.HallCommonEd;
var HallCommonEvent = HallCommonObj.HallCommonEvent;

var zjh_game = cc.Class({
    extends: cc.Component,
    properties: {
        //info 
        emptySeat: {
            default: null,
            type: cc.SpriteFrame,
        },

        hasPlayerSeat: {
            default: null,
            type: cc.SpriteFrame,
        },

        playerPrefab: {
            default: null,
            type: cc.Prefab,
        },

        otherPlayerPrefab: {
            default: null,
            type: cc.Prefab,
        },

        progressBar: {
            default: null,
            type: cc.Prefab,
        },

        headNode: {
            default: null,
            type: cc.Prefab,
        },

        autoChipSettingPrefab: {
            default: null,
            type: cc.Prefab,
        },

        // chipNode: {
        //     default: null,
        //     type: cc.Prefab,
        // },
        cardNode: {
            default: null,
            type: cc.Prefab,
        },

        tipsWin: {
            default: null,
            type: cc.Prefab,
        },

        maskSprite: {
            default: null,
            type: cc.SpriteFrame,
        },

        ///
        atlasZJH: {
            default: null,
            type: cc.SpriteAtlas,
        },

    },
    resetRound: function () {
        for (var site = 1; site < this.m_oPlayerSiteList.length; site++) {
            var sitePanel = this.m_oPlayerSiteList[site]
            var watchIcon = cc.find("Image_watchState", sitePanel)
            var robIcon = cc.find("rob_img", sitePanel)
            var readyIcon = cc.find("nn_img_zbz_" + site, this.m_oPanelMid)
            var coin_text = cc.find("coin_text", sitePanel)
            var loseimg = cc.find("loseimg", sitePanel)

            watchIcon.active = false;
            robIcon.active = false;
            readyIcon.active = false;
            loseimg.active = false;
            coin_text.getComponent(cc.Label).string = " ";

            if (this.m_playcardtype[site])
                this.m_playcardtype[site].active = false;
            if (this.m_playerbetnode[site])
                this.m_playerbetnode[site].active = false;
        }
    },

    onLoad: function () {

        this.m_oPlayerSiteList = []
        this.m_oPlayerReady = []
        this.m_cardPosNode = [] //位置数组
        this.m_cardNode = [] //位置节点
        this.m_playerCardNode = []
        this.m_playerbetnode = []
        this.m_playcardtype = []
        HallCommonEd.addObserver(this);
        this.m_oRoot = cc.find("root", this.node)
        this.m_oPanelUp = cc.find("Panel_up", this.m_oRoot)
        this.m_oPanelMid = cc.find("panel_mid", this.m_oRoot)
        //对应数据的玩家UI列表
        this.m_oPlayerSiteList = []
        this.m_nLastOp = 0          //上一个操作位置
        this.m_allChip = []
        this.m_CompareNode = []
        //操作按钮
        // var menu = cc.find(this.m_oPanelUp,"swtichbtn")
        // this.m_oMenuDirImg = cc.find(menu,"switch_icon")
        // menu.addTouchEventListener(handler(self,this.menuCallBack))

        // //商店按钮
        // var shopbtn = cc.find(this.m_oPanelUp,"shopbtn")
        // shopbtn.addTouchEventListener(handler(self,this.shopCallBack))

        // //帮助按钮
        // var help = cc.find(this.m_oPanelUp,"helpbtn")
        // help.addTouchEventListener(handler(self,this.helpCallBack))

        // //打赏动画
        // var rewardBtn = cc.find(this.m_oPanelMid,"reward_btn")
        // rewardBtn.addTouchEventListener(handler(self,this.rewardCallBack))

        // //设置自动筹码
        // var autoadd = cc.find(this.m_oPanelUp,"addClip")
        // autoadd.addTouchEventListener(handler(self,this.autoAddClipCallBack))

        //开始按钮
        this.m_oStartPanel = cc.find("start_btn_panel", this.m_oPanelMid)
        this.m_oStartBtn = cc.find("start_btn", this.m_oStartPanel)
        // this.m_oStartBtn.addTouchEventListener(handler(self,this.touchStartBtn))
        this.m_oStartPanel.active = false
        var deskcost = cc.find("cast_task_tips", this.m_oStartPanel)
        var data = game_room.getItem(function (element) {
            if (element.key == gZJHMgr.getPlayType())
                return true;
            else
                return false;
        }.bind(this));
        deskcost.getComponent(cc.Label).string = "本房间每局游戏消耗" + data.tax + "金币桌费";

        //弃牌 比牌 加注 跟注 跟到底
        this.m_oGiveUpCardBtn = cc.find("PlayerOperation/Button_giveUp", this.m_oPanelMid)
        this.m_oCompCardBtn = cc.find("PlayerOperation/Button_compare", this.m_oPanelMid)
        this.m_oSpriteGuzhu = cc.find("zjh_ziti3", this.m_oCompCardBtn)
        this.m_oAddChipBtn = cc.find("PlayerOperation/Button_addBet", this.m_oPanelMid)
        this.m_oFollowBtn = cc.find("PlayerOperation/Button_follow", this.m_oPanelMid)
        this.m_oCheckFollow = cc.find("checkbox", this.m_oFollowBtn)
        //this.m_oFollowText = cc.find("zjh_ziti4", this.m_oFollowBtn)//cc.find("Text_follow", this.m_oFollowBtn)
        this.menuLayer = cc.find("menuLayer", this.m_oPanelUp)
        this.rulePage = cc.find("menuLayer/rulePage", this.m_oPanelUp)

        // this.m_oGiveUpCardBtn.addTouchEventListener(handler(self,this.giveupCallBack))
        // this.m_oCompCardBtn.addTouchEventListener(handler(self,this.compareCallBack))
        // this.m_oAddChipBtn.addTouchEventListener(handler(self,this.addChipCallBack))
        // this.m_oFollowBtn.addTouchEventListener(handler(self,this.followCallBack))

        //美女荷馆
        // var girlImg = cc.find("Image_2", this.m_oPanelMid)
        // var girlPos = gZJHMgr.GetNodePos(girlImg)
        // this._armatureDisplay = createDragonBonesAnim("effect_mutil/ZhaJinHua/game_dealer_ani_4/game_dealer_ani_4.json", "effect_mutil/ZhaJinHua/game_dealer_ani_4/texture.json", "texture")
        // this._armatureDisplay.setScale(1.5)
        // this._armatureDisplay.setPosition(cc.v2(girlPos.x, girlPos.y - 148))
        // this._armatureDisplay.getAnimation().play()
        // this.m_oPanelMid.addChild(this._armatureDisplay, 0)
        // girlImg.removeFromParent()

        this.m_oMaskBg = cc.find("maskbg", this.m_oPanelMid)
        // this.m_oMaskBg.setLocalZOrder(var_ORDER.AddBet_order)
        //牌的初始结束位置
        this.m_oSendPosImg = cc.find("Image_fapaiqi", this.m_oPanelMid)//(this.m_oPanelMid,"Image_fapaiqi")
        this.m_oEndPosImg = cc.find("Image_fapaiqi_0", this.m_oPanelMid)//(this.m_oPanelMid,"Image_fapaiqi_0")

        //比牌层级节点
        this.m_oComPanel = cc.find("compare_panel", this.m_oPanelMid)//(this.m_oPanelMid,"compare_panel")
        this.m_oComPanel.active = false;
        this.m_oComPanel.zIndex = var_ORDER.Compare_order

        //准备倒计时
        this.m_oReadyTime = cc.find("startTimer", this.m_oPanelMid)//cc.find(this.m_oPanelMid,"startTimer")
        this.m_oReadyTime.active = false;

        //房间押注
        this.m_oRoomBet = cc.find("room_bet_bg/roombet", this.m_oPanelMid)//cc.find(this.m_oPanelMid,"roombet")
        var room_textPanel = cc.find("room_info/Panel_text_tips", this.m_oPanelUp)//cc.find(this.m_oPanelMid,"Panel_text_tips")
        room_textPanel.zIndex = var_ORDER.RoomBet_order
        this.m_oSigalBetMax = cc.find("AtlasLabel_1", room_textPanel)//cc.find(this.m_oPanelMid,"AtlasLabel_1")
        this.m_oMinBet = cc.find("AtlasLabel_1_0", room_textPanel)//cc.find(this.m_oPanelMid,"AtlasLabel_1_0")
        this.m_oRoundTimes = cc.find("AtlasLabel_1_1", room_textPanel)//cc.find(this.m_oPanelMid,"AtlasLabel_1_1")
        //
        this.m_oPlayerBetOperation = cc.find("PlayerOperation_0", this.m_oPanelMid)//cc.find(this.m_oPanelMid,"PlayerOperation_0")
        this.m_oPlayerBetOperation.active = false;

        //
        this.m_oLookCardBtn = cc.find("lookcard_btn", this.m_oPanelMid)//cc.find(this.m_oPanelMid,"lookcard_btn")
        // this.m_oLookCardBtn.addTouchEventListener(handler(self,this.lookcardCallBack))
        this.m_oLookCardBtn.active = false;
        this.m_oLookCardBtn.zIndex = var_ORDER.LookCard_order

        for (var playerSite = 1; playerSite <= gZJHMgr.getMaxPlayer(); playerSite++) {

            var sitePanel = cc.find("player_site_" + playerSite, this.m_oPanelMid)//cc.find(this.m_oPanelMid,"player_site_"+playerSite)
            this.m_oPlayerSiteList[playerSite] = sitePanel
            var cardposnode = cc.find("player_card_" + playerSite, this.m_oPanelMid)
            this.m_cardPosNode[playerSite] = gZJHMgr.GetNodePos(cardposnode)
            this.m_cardNode[playerSite] = cardposnode
            //cardposnode.removeFromParent()
            var coin_icon = cc.find("coin_icon_" + playerSite, this.m_oPanelMid)//cc.find(this.m_oPanelMid,"coin_icon_"+playerSite)
            this.m_playerbetnode[playerSite] = coin_icon
            var card_type = cc.find("card_type_spr_" + playerSite, this.m_oPanelMid)//cc.find(this.m_oPanelMid,"card_type_spr_"+playerSite)
            card_type.zIndex = var_ORDER.Cardty_order
            this.m_playcardtype[playerSite] = card_type
        }
        //初始化 对应数据的玩家UI列表
        this.HidenullSitePlayerInfo()
        this.setUISiteTag()
        this.showPlayer()
        this.setOpbtnState()
        this.createPlayersCardNode()
        this.readRandChipNode()


        // ZJHED.addObserver(this);
        dd.NetWaitUtil.close();

        AudioManager.playMusic(zjhAudioDir + "13001");
    },

    HidenullSitePlayerInfo: function () {
        for (var site = 1; site < this.m_oPlayerSiteList.length; site++) {

            var sitePanel = this.m_oPlayerSiteList[site]
            var watchIcon = cc.find("Image_watchState", sitePanel)
            var robIcon = cc.find("rob_img", sitePanel)
            var readyIcon = cc.find("nn_img_zbz_" + site, this.m_oPanelMid)
            var coin_text = cc.find("coin_text", sitePanel)
            var loseimg = cc.find("loseimg", sitePanel)
            // var spr2 = new cc.Spritethis.playerPrefab.data.getComponent(cc.Sprite).spriteFrame
            var progress2 = cc.instantiate(this.progressBar);
            // progress2.barSprite = spr2;
            progress2.tagname = (PROGRESS_ID2)
            progress2.active = false;
            // progress2.mode = 2
            // progress2.setMidpoint(cc.v2(0.5, 0.5))
            // progress2: setBarChangeRate(cc.v2(0, 1))
            progress2.setOpacity(0)
            sitePanel.addChild(progress2)
            // var spr1 = new cc.Sprite(Language_UI_Src.zjh_progrees1)
            var progress1 = cc.instantiate(this.progressBar);//new cc.ProgressBar(spr1)
            progress1.tagname = (PROGRESS_ID1)
            progress1.active = false;
            // progress1: setType(cc.PROGRESS_TIMER_TYPE_RADIAL)
            // progress1: setMidpoint(cc.v2(0.5, 0.5))
            // progress1: setBarChangeRate(cc.v2(0, 1))
            sitePanel.addChild(progress1)
            // var effectprogress = cc.CSLoaderNode("effect/0508/jiazai.csb")
            // if (effectprogress) {

            //     //    var progressaction = cc.CSLoaderTimeline("effect/0508/jiazai.csb")
            //     effectprogress.runAction(progressaction)
            //     effectprogress.node.tag = (1313)
            //     progressaction: gotoFrameAndPlay(0, true)
            //     progress1.addChild(effectprogress)
            // }
            this.m_oPlayerReady[site] = readyIcon
            watchIcon.active = false;
            robIcon.active = false;
            readyIcon.active = false;
            loseimg.active = false;
            coin_text.getComponent(cc.Label).string = " ";
            //
            this.m_playerbetnode[site].active = false;
            this.m_playcardtype[site].active = false;
        }
    },

    setPlayerSiteOpacity(opacity, index) {
        if (this.m_oPlayerSiteList[index]) {

            this.m_oPlayerSiteList[index].setOpacity(opacity)
        }
    },

    //获取随机节点
    readRandChipNode: function () {
        this.m_oRandChipNode = []
        this.nodechip = cc.find("Node_" + 4, this.m_oPanelMid)
        this.m_oRandChipNode[0] = this.nodechip
    },

    //获取一个随机节点
    getRandChipNode: function () {
        var pos = gZJHMgr.GetNodePos(this.m_oRandChipNode[0])
        return pos
    },

    hideAllReady: function () {
        for (var k = 1; k <= 5; k++) {
            this.m_oPlayerReady[k].active = false;
        }
    },

    //房间总押注 单注上限 
    updateRoomBet: function () {
        this.m_oRoomBet.getComponent(cc.Label).string = gZJHMgr.getTotalClips();
        this.m_oRoundTimes.getComponent(cc.Label).string = gZJHMgr.getRoomRound() + "/" + gZJHMgr.getRoomRoundMax();
        this.m_oSigalBetMax.getComponent(cc.Label).string = gZJHMgr.getSingalMaxBet();
        this.m_oMinBet.getComponent(cc.Label).string = gZJHMgr.getMinClip();
        //s
    },

    //每个玩家的筹码变化
    updatePlayerClips: function () {
        for (var k = 0; k < gZJHMgr.getPlaySiteList().length; k++) {
            var site = gZJHMgr.getPlaySiteList()[k];
            var index = this.getIndexByTag(site)
            if (index != 0 && this.m_oPlayerSiteList[index]) {

                var player = gZJHMgr.getPlayerBySite(site)
                if (player) {

                    var betclips = cc.find("bet_text", this.m_playerbetnode[index])
                    var coin_text = cc.find("coin_text", this.m_oPlayerSiteList[index])
                    betclips.getComponent(cc.Label).string = player.betClips;
                    coin_text.getComponent(cc.Label).string = player.clips;
                    this.m_playerbetnode[index].active = (true)
                }
            }
        }
    },

    //每一局更新玩家显示状态
    updatePlayerShowState: function () {
        for (var k = 1; k <= 5; k++) {

            var panelsite = this.m_oPlayerSiteList[k]
            var player = gZJHMgr.getPlayerBySite(panelsite.getTag())
            var index = this.getIndexByTag(panelsite.getTag())
            if (index != 0) {
                var Image_watchState = cc.find("Image_watchState", panelsite)
                cc.find("iamge_bg", panelsite).getComponent(cc.Sprite).spriteFrame = this.otherPlayerPrefab.data.getComponent(cc.Sprite).spriteFrame; // this.otherPlayerPrefab.data.getComponent(cc.Sprite).spriteFrame;
                var robIcon = cc.find("rob_img", panelsite)
                var coin_text = cc.find("coin_text", panelsite)
                if (player) {

                    coin_text.getComponent(cc.Label).string = player.clips;
                } else {

                    coin_text.getComponent(cc.Label).string = " ";
                }
                this.m_playerbetnode[index].active = false;
                this.m_playcardtype[index].active = false;
                robIcon.active = false;
                Image_watchState.active = false;
                this.setPlayerSiteOpacity(255, index)
            }
        }
    },

    //是否超过单注上限
    isSigalMax: function (gold, block) {
        if (block) {
            if (gold * 2 > parseInt(gZJHMgr.getSingalMaxBet()))
                return true
            else
                return false
        } else {
            if (gold > parseInt(gZJHMgr.getSingalMaxBet()))
                return true
        }
        return false
    },

    //初始加注按钮值
    setAddBetPanel: function () {
        if (this.m_oPlayerBetOperation == null)
            return
        var betrate = gZJHMgr.getAddBetList()
        this.m_oPlayerBetOperation.zIndex = var_ORDER.AddBet_order
        var mineData = gZJHMgr.getMineData()
        for (var k = 1; k <= 3; k++) {
            var betbtn = cc.find("Button_" + k, this.m_oPlayerBetOperation)
            var num = cc.find("num", betbtn)
            var betRate = cc.find("betRate", betbtn)
            var goldnum = gZJHMgr.getMinClip()
            var block = false
            betRate.getComponent(cc.Label).string = betrate[k - 1] + "倍";
            if (mineData.cardState == gZJHMgr.CardStateType.lock_card) {

                goldnum = goldnum / 2 * betrate[k - 1]
                block = true
            } else {

                goldnum = goldnum * betrate[k - 1]
            }
            num.getComponent(cc.Label).string = goldnum.toString();
            betbtn.tagname = (goldnum)
            // betbtn.addTouchEventListener(handler(self, this.addBetCallBack))
            if (goldnum > mineData.clips || this.isSigalMax(goldnum, block)) {

                //SetGrayState(betbtn, true)
                betbtn.getComponent(cc.Button).interactable = false;
            } else {

                //SetGrayState(betbtn, false)
                betbtn.getComponent(cc.Button).interactable = (true)
            }
        }
    },

    //创建炸金花牌节点
    createPlayersCardNode: function () {
        for (var k = 1; k < this.m_oPlayerSiteList.length; k++) {
            var sitepanel = this.m_oPlayerSiteList[k];
            if (sitepanel) {
                var cardpanel = new CZhaJinHuaCard();//cc.instantiate(this.cardNode)
                cardpanel.initRes(this.atlasZJH, this.cardNode)
                //cardpanel.setPosition(this.m_cardPosNode[k])
                this.m_cardNode[k].addChild(cardpanel, var_ORDER.Card_order)

                if (k != 1) {

                    cardpanel.setScale(0.7)
                } else {

                    cardpanel.setScale(1.1)
                    cardpanel.setIsMine(true)
                }


                cardpanel.setSendPos(this.m_oPanelMid.convertToWorldSpaceAR(gZJHMgr.GetNodePos(this.m_oSendPosImg)))
                cardpanel.setEndPos(this.m_oPanelMid.convertToWorldSpaceAR(gZJHMgr.GetNodePos(this.m_oEndPosImg)))
                this.m_playerCardNode[k] = cardpanel

            }
        }
    },

    OnExit: function () {
        CBaseWindow.OnExit(self)
    },

    setUISiteTag: function () {
        var uisitesortlist = gZJHMgr.getUISiteSortList()
        for (var k = 0; k < uisitesortlist.length; k++) {
            var tag = uisitesortlist[k];
            this.m_oPlayerSiteList[k + 1].tagname = (tag)
            this.m_oPlayerReady[k + 1].tagname = (tag)
        }
    },


    //刷新座位节点
    freshSitePanel: function () {
        for (var k = 1; k <= 5; k++) {

            var tag = this.m_oPlayerSiteList[k].getTag()
            var player = gZJHMgr.getPlayerBySite(tag)
            var iamge_bg = cc.find("iamge_bg", this.m_oPlayerSiteList[k])
            var loseimg = cc.find("loseimg", this.m_oPlayerSiteList[k])
            if (player) {

                //检测当前游戏状态
                if (gZJHMgr.getGameState() <= gZJHMgr.ZJHRoomState.ready) {

                    if (iamge_bg) {

                        iamge_bg.getComponent(cc.Sprite).spriteFrame = this.otherPlayerPrefab.data.getComponent(cc.Sprite).spriteFrame;
                    }
                    if (loseimg) {

                        loseimg.active = false;
                    }
                    this.setPlayerSiteOpacity(255, k)
                } else {

                    if (player.playerState == gZJHMgr.PlayerStateType.discard ||
                        player.playerState <= gZJHMgr.PlayerStateType.ready
                        || player.cardState == gZJHMgr.CardStateType.complose
                    ) {

                        // if (iamge_bg) {

                        //     iamge_bg.getComponent(cc.Sprite).spriteFrame = this.otherPlayerPrefab.data.getComponent(cc.Sprite).spriteFrame;
                        // }
                        //放到比牌动画完再设置opacity
                        this.setPlayerSiteOpacity(OPACITY_DIS, k)
                    } else {

                        // if (iamge_bg) {

                        //     iamge_bg.getComponent(cc.Sprite).spriteFrame = this.playerPrefab.data.getComponent(cc.Sprite).spriteFrame; //this.playerPrefab.data.getComponent(cc.Sprite).spriteFrame
                        // }
                        this.setPlayerSiteOpacity(255, k)
                    }
                }
            } else {

                if (iamge_bg) {

                    iamge_bg.getComponent(cc.Sprite).spriteFrame = this.otherPlayerPrefab.data.getComponent(cc.Sprite).spriteFrame;
                }
                this.setPlayerSiteOpacity(OPACITY_DIS, k)
            }
        }
    },

    showPlayer: function () {
        var lst = gZJHMgr.getPlayerList();
        for (var k = 0; k < lst.length; k++) {
            var player = lst[k];
            var playersite = null
            playersite = this.getSiteByTag(player.site)
            var index = this.getIndexByTag(player.site)
            if (playersite != null) {

                playersite.tagname = (player.site)
                var name = playersite.getChildByName("name")
                var posnode = playersite.getChildByName("head_bg")
                var gold = playersite.getChildByName("coin_text")
                var Image_watchState = cc.find("Image_watchState", playersite)
                var head = posnode.getChildByTag(1221)
                if (head == null) {
                    //player.sex
                    head = cc.instantiate(this.headNode)
                    var icon = cc.find("iconBg/icon", head).getComponent(cc.Sprite)
                    if (player.headUrl != "") {
                        this.setPlayerHead(icon, player.headUrl, !player.isRobot);
                    }
                    head.setScale(HEAD_SCALE)
                    head.parent = (posnode)
                    head.tagname = (1221)
                }
                // head.setData(player.head_info)
                name.getComponent(cc.Label).string = player.playerName;
                gold.getComponent(cc.Label).string = player.clips;
                playersite.getComponent(cc.Button).interactable = (true)
                // playersite.addTouchEventListener(function (sender, event) {
                //     if (event == ccui.TouchEventType.ended) {

                //         head.SetPlayerId(player.playerId)
                //         head.HeadBtnEvent(sender, event)
                //     }
                // })

                //
                if (gZJHMgr.getGameState() == gZJHMgr.ZJHRoomState.ready) {

                    if (player.playerState == gZJHMgr.PlayerStateType.ready) {

                        if (index != 0 && this.m_oPlayerReady[index]) {

                            this.m_oPlayerReady[index].active = (true)
                        }
                    } else {

                        if (player.site == gZJHMgr.getMineSite()) {

                            this.m_oStartPanel.active = false;
                        }
                    }
                } else if (gZJHMgr.getGameState() > gZJHMgr.ZJHRoomState.ready && player.playerState == gZJHMgr.PlayerStateType.ready) {

                    Image_watchState.active = (true)
                    this.m_oLookCardBtn.active = false;
                }

                cc.log("炸金花初始化玩家位置 位置 111111111111111111111 = " + player.site)
            } else {

                cc.log("炸金花初始化玩家位置 错误 = " + player.site)
            }
        }
    },

    playerEnter: function () {
        var lst = gZJHMgr.getPlayerList()
        for (var k = 0; k < lst.length; k++) {
            var player = lst[k];
            var index = this.getIndexByTag(player.site, true)

            if (index != 0 && this.m_oPlayerSiteList[index]) {

                var head = this.m_oPlayerSiteList[index].getChildByName("head_bg").getChildByTag(1221)
                if (head == null) {

                    var playersite = this.m_oPlayerSiteList[index]
                    if (playersite != null) {

                        playersite.tagname = (player.site)
                        playersite.isLeave = false;
                        var name = playersite.getChildByName("name")
                        var posnode = playersite.getChildByName("head_bg")
                        var gold = playersite.getChildByName("coin_text")
                        var Image_watchState = cc.find("Image_watchState", playersite)
                        var head = posnode.getChildByTag(1221)
                        if (head == null) {

                            // head = new CHeadIconNode(player.sex)
                            head = cc.instantiate(this.headNode)
                            var icon = cc.find("iconBg/icon", head).getComponent(cc.Sprite)
                            if (player.headUrl != "") {
                                this.setPlayerHead(icon, player.headUrl, !player.isRobot);
                            }
                            head.setScale(HEAD_SCALE)
                            head.parent = (posnode)
                            head.tagname = (1221)
                        }
                        // head.setData(player.head_info)
                        name.getComponent(cc.Label).string = player.playerName;
                        gold.getComponent(cc.Label).string = player.clips;
                        //
                        if (gZJHMgr.getGameState() == gZJHMgr.ZJHRoomState.ready) {

                            if (player.playerState == gZJHMgr.PlayerStateType.ready) {

                                if (index != 0 && this.m_oPlayerReady[index]) {

                                    this.m_oPlayerReady[index].active = (true)
                                }
                            } else {

                                if (player.site == gZJHMgr.getMineSite()) {

                                    this.m_oStartPanel.active = false;
                                }
                            }
                        } else if (gZJHMgr.getGameState() > gZJHMgr.ZJHRoomState.ready && player.playerState == gZJHMgr.PlayerStateType.ready) {

                            Image_watchState.active = (true)
                        }
                        //
                        playersite.getComponent(cc.Button).interactable = (true)
                        // playersite.addTouchEventListener(function (sender, event) {
                        //     if (event == ccui.TouchEventType.ended) {

                        //         head.SetPlayerId(player.playerId)
                        //         head.HeadBtnEvent(sender, event)
                        //     }
                        // })
                    }
                }
            }
        }
    },

    playerLeave: function () {
        for (var k = 0; k < gZJHMgr.getLeaveList().length; k++) {
            var site = gZJHMgr.getLeaveList()[k];
            var playersite = this.getSiteByTag(site)
            var index = this.getIndexByTag(site)
            if (playersite) {

                var name = playersite.getChildByName("name")
                var posnode = playersite.getChildByName("head_bg")
                var gold = playersite.getChildByName("coin_text")
                var watchIcon = playersite.getChildByName("Image_watchState")
                var banker = playersite.getChildByName("rob_img")


                var head = posnode.getChildByTag(1221)
                if (head) {
                    head.removeFromParent(true)
                    head.destroy();
                }
                name.getComponent(cc.Label).string = "";
                gold.getComponent(cc.Label).string = "";
                watchIcon.active = false;
                banker.active = false;

                var index = this.getIndexByTag(site)
                this.m_oPlayerReady[index].active = false;
                //bug：此位置离开过后，新玩家进来不显示
                //playersite.tag = LEAVE_TAG;

                playersite.isLeave = true
                playersite.getComponent(cc.Button).interactable = false;
                cc.find("iamge_bg", playersite).getComponent(cc.Sprite).spriteFrame = this.otherPlayerPrefab.data.getComponent(cc.Sprite).spriteFrame;

                //
                this.m_playerbetnode[index].active = false;
                this.m_playcardtype[index].active = false;
            }
        }
        gZJHMgr.cleanLeaveList()
    },


    boundaryTexCoord: function (index, _reverseDirection) {
        var kProgressTextureCoords = 0x4b
        if (index < 4) {
            if (_reverseDirection) {
                return cc.v2(bit._and((bit.rshift(kProgressTextureCoords, (7 - (bit.lshift(index, 1))))), 1), bit._and((bit.rshift(kProgressTextureCoords, (7 - (bit.lshift(index, 1) + 1)))), 1));
            } else {

                return cc.v2(bit._and((bit.rshift(kProgressTextureCoords, (bit.lshift(index, 1) + 1))), 1), bit._and((bit.rshift(kProgressTextureCoords, bit.lshift(index, 1))), 1));
            }
        }
        return cc.v2(0, 0)
    },

    vertexFromAlphaPoint: function (alpha, progress) {
        var ret = cc.v2(0, 0);
        var _sprite = progress.getSprite()
        if (!_sprite) {
            return ret
        }
        var rect = _sprite.getTextureRect()
        var min = cc.v2(0, 0)
        var max = cc.v2(rect.width, rect.height)
        ret.x = min.x * (1 - alpha.x) + max.x * alpha.x
        ret.y = min.y * (1 - alpha.y) + max.y * alpha.y
        var dir = 0 // 0右 90下 180左 270上
        alpha.x = parseFloat("{0}".format(alpha.x))
        alpha.y = parseFloat("{0}".format(alpha.y))
        if (alpha.x < 1 && alpha.y == 1) {
            dir = 0
        } else if (alpha.x == 1 && alpha.y < 1) {
            dir = 90
        } else if (alpha.x < 1 && 0 == alpha.y) {
            dir = 180
        } else if (alpha.x == 0 && alpha.y < 1) {
            dir = 270
        }

        return ret, dir
    },

    calcProgressPoint: function (progress) {
        var _percentage = progress.getPercentage()
        var alpha = _percentage / 100
        var M_PI = 3.141593
        var _midpoint = progress.getMidpoint()
        var _reverseDirection = progress.isReverseDirection()
        var angle = 2 * M_PI * ((_reverseDirection == true) && alpha || 1 - alpha)

        var topMid = cc.v2(_midpoint.x, 1)
        var percentagePt = cc.pRotateByAngle(topMid, _midpoint, angle)

        var hit = cc.v2(0, 0)

        if (alpha == 0) {
            hit = topMid
        } else if (alpha == 1) {

            hit = topMid
        } else {
            var min_t = 230
            for (var i = 0; i <= 4; i++) {

                var pIndex = (i + (4 - 1)) % 4
                var edgePtA = boundaryTexCoord(i % 4, _reverseDirection)
                var edgePtB = boundaryTexCoord(pIndex, _reverseDirection)

                if (i == 0) {

                    edgePtB = edgePtA.lerp(edgePtB, 1 - _midpoint.x)
                } else if (i == 4) {

                    edgePtA = edgePtA.lerp(edgePtB, 1 - _midpoint.x)
                }
                var s = 0
                var t = 0
                var bret = false
                bret, s, t = cc.pIsLineIntersect(edgePtA, edgePtB, _midpoint, percentagePt, s, t)
                if (bret) {
                    if ((i == 0 || i == 4) && not(0 <= s && s <= 1)) {
                        //continue
                        //cc.log("continue ******************** t == "+t)
                    } else if (t >= 0) {
                        if (t < min_t) {
                            min_t = t
                        }
                    }
                }
            }
            var psub = percentagePt.sub(_midpoint)
            psub = psub.mul(min_t)
            hit = _midpoint.add(psub)
        }
        return vertexFromAlphaPoint(hit, progress)
    },

    showOpTimerEffect: function (bstop) {
        var index = this.getIndexByTag(this.m_nLastOp)
        var progress = null
        var progress2 = null
        if (index != 0 && this.m_oPlayerSiteList[index]) {

            progress = this.m_oPlayerSiteList[index].getChildByTag(PROGRESS_ID1)
            progress2 = this.m_oPlayerSiteList[index].getChildByTag(PROGRESS_ID2)
            // var sprite = progress.getSprite()
            // sprite: setTexture(Language_UI_Src.zjh_progrees1)
            // var sprite2 = progress2.getSprite()
            // sprite2: setTexturethis.playerPrefab.data.getComponent(cc.Sprite).spriteFrame
            // progress: unscheduleUpdate()
            progress.active = false;
            progress2.active = false;
            var headnode = this.m_oPlayerSiteList[index].getChildByName("head_bg").getChildByTag(1221)
            if (headnode) {

                headnode.setRotation(0)
                headnode.stopAllActions()
            }
        }
        if (bstop == true) {
            cc.log("操作倒计时结束111 ")
            return
        }
        var curopsite = gZJHMgr.getOptSite()
        if (curopsite == this.m_nLastOp) {
            cc.log("操作倒计时结束222")
            return
        }
        index = this.getIndexByTag(curopsite)
        if (index != 0 && this.m_oPlayerSiteList[index]) {

            progress = this.m_oPlayerSiteList[index].getChildByTag(PROGRESS_ID1)
            progress2 = this.m_oPlayerSiteList[index].getChildByTag(PROGRESS_ID2)
            // progress: unscheduleUpdate()
            progress.active = (true)
            progress2.active = (true)
            // progress: setPercentage(0)
            var baction = false
            var bchang = false

            clearInterval(this.m_nSchedTimerID);
            this.m_nSchedTimerID = setInterval(function () {
                var precet = gZJHMgr.m_nOptimer / onePlayerOpTime * 100
                gZJHMgr.m_nOptimer = gZJHMgr.m_nOptimer - 0.01;
                // if (precet < 50) {
                //     progress.setOpacity(255 - 255 * (precet / 50))
                //     progress2.setOpacity(255 * (precet / 50))
                // } else {

                if (bchang == false) {

                    bchang = true
                    // var sprite = progress.getSprite()
                    // sprite: setTexture(Language_UI_Src.zjh_progrees3)
                    progress.getComponent(cc.Sprite).spriteFrame = this.atlasZJH.getSpriteFrame("zjh_daojishi");
                }
                var op2 = (255 - 255 * (precet - 40) / 40)
                op2 = op2 > 0 ? op2 : 0;
                var op = 255 * (precet - 50) / 50
                op = op > 0 ? op : 0;
                progress2.setOpacity(op2)
                progress.setOpacity(op)
                // }
                progress2.getComponent(cc.ProgressBar).progress = (precet / 100)
                progress.getComponent(cc.ProgressBar).progress = (precet / 100)

                //动画
                if (precet > 85 && baction == false) {

                    //gAudioManger:playAudio(13024)
                    AudioManager.playSound(zjhAudioDir + "13024");
                    var headnode = this.m_oPlayerSiteList[index].getChildByName("head_bg").getChildByTag(1221)
                    if (headnode) {
                        headnode.runAction(cc.repeatForever(cc.sequence(cc.rotateTo(0.15, 2), cc.rotateTo(0.15, -2))))
                    }
                    baction = true
                }
                var effect = progress.getChildByTag(1313)
                if (effect) {

                    var pos, dir = this.calcProgressPoint(progress)
                    effect.setPosition(pos)
                    effect.setRotation(dir)
                }

                if (gZJHMgr.m_nOptimer <= 0) {
                    clearInterval(this.m_nSchedTimerID);
                    progress.active = false;
                    //progress2.active = false;
                }


            }.bind(this), 10);

            // progress: scheduleUpdateWithPriorityLua(function (fd) {
            //     var precet = (gZJHMgr.getStatebeginTime()) / onePlayerOpTime * 100
            //     if (precet < 50) {

            //         progress.setOpacity(255 - 255 * (precet / 50))
            //         progress2.setOpacity(255 * (precet / 50))
            //     } else {

            //         if (bchang == false) {

            //             bchang = true
            //             var sprite = progress.getSprite()
            //             sprite: setTexture(Language_UI_Src.zjh_progrees3)
            //         }

            //         progress2.setOpacity(255 - 255 * (precet - 50) / 50)
            //         progress.setOpacity(255 * (precet - 50) / 50)
            //     }
            //     progress2: setPercentage(precet)
            //     progress: setPercentage(precet)

            //     //动画
            //     if (precet > 85 && baction == false) {

            //         //gAudioManger:playAudio(13024)
            //         var headnode = this.m_oPlayerSiteList[index].getChildByTag(1221)
            //         if (headnode) {

            //             headnode.runAction(cc.repeatForever(cc.sequence(cc.rotateTo(0.15, 2), cc.rotateTo(0.15, -2))))
            //         }
            //         baction = true
            //     }
            //     var effect = progress.getChildByTag(1313)
            //     if (effect) {

            //         var pos, dir = this.calcProgressPoint(progress)
            //         effect.setPosition(pos)
            //         effect: setRotation(dir)
            //     }
            //     if (precet <= 0) {

            //         progress: unscheduleUpdate()
            //         progress.active = false;
            //     }
            // }
            //     , 0)
        }
        var player = gZJHMgr.getPlayerBySite(curopsite) || []
        if (player.playerName == null) {
            player.playerName = "****"
        }
        cc.log("操作 curopsite = " + curopsite + " this.m_nLastOp = " + this.m_nLastOp + "playername = " + player.playerName)
        this.m_nLastOp = curopsite
    },

    //离开是10
    getSiteByTag: function (tag) {
        for (var k = 1; k < this.m_oPlayerSiteList.length; k++) {
            var sitepanel = this.m_oPlayerSiteList[k];
            if (sitepanel.getTag() == tag) {
                return sitepanel
            }
        }
        return null
    },

    //离开的tag是10
    //增加是否离开判断
    getIndexByTag: function (tag, onlyTag) {
        for (var k = 1; k < this.m_oPlayerSiteList.length; k++) {
            var sitepanel = this.m_oPlayerSiteList[k];

            if (sitepanel.getTag() == tag) {
                if (onlyTag) {
                    return k;
                } else {
                    if (sitepanel.isLeave)
                        return 0;
                    else
                        return k;
                }
            }
        }
        return 0
    },

    showPlayerWatchState: function () {
        for (var k = 1; k < this.m_oPlayerSiteList.length; k++) {
            var sitepanel = this.m_oPlayerSiteList[k];
            if (sitepanel) {

                var site = sitepanel.getTag()
                var player = gZJHMgr.getPlayerBySite(site)
                var Image_watchState = cc.find("Image_watchState", sitepanel)
                Image_watchState.active = false;
                if (gZJHMgr.getGameState() > gZJHMgr.ZJHRoomState.ready) {

                    if (player && player.playerState == gZJHMgr.PlayerStateType.ready) {

                        Image_watchState.active = (true)
                    }

                    // if (player && player.cardState == gZJHMgr.CardStateType.complose) {

                    //     sitepanel.getChildByName("loseimg").active = (true)
                    // }
                }
            }
        }
    },

    //79797A  F7C25B
    setButtonTextColor: function (node, bgray) {
        if (node == null) { return }
        if (bgray) {

            node.color = cc.color(0x79, 0x79, 0x7A)

            // node.getTitleRenderer().enableOutline(cc.color(0x79, 0x79, 0x7A, 255), 1)
        } else {

            node.color = cc.color(0xF7, 0xC2, 0x5B)
            // node.getTitleRenderer().enableOutline(cc.color(0x6f, 0x3b, 0x08, 255), 2)
        }
    },

    setFollowTextColor: function (bgray) {
        if (bgray) {

            this.m_oCheckFollow.getChildByName("Text_9").color = cc.color(0x79, 0x79, 0x7A)
            this.m_oFollowText.color = cc.color(0x79, 0x79, 0x7A)
            // this.m_oFollowText.enableOutline(cc.color(0x79, 0x79, 0x7A), 1)
            // this.m_oCheckFollow.getChildByName("Text_9").enableOutline(cc.color(0x79, 0x79, 0x7A), 1)
        } else {

            this.m_oCheckFollow.getChildByName("Text_9").color = cc.color(0xF7, 0xC2, 0x5B)
            this.m_oFollowText.color = cc.color(0xF7, 0xC2, 0x5B)
            // this.m_oFollowText.enableOutline(cc.color(0x6f, 0x3b, 0x08), 2)
            // this.m_oCheckFollow.getChildByName("Text_9").enableOutline(cc.color(0x6f, 0x3b, 0x08), 2)
        }
    },

    setOpbtnState: function () {
        if (gZJHMgr.getGameState() == gZJHMgr.ZJHRoomState.opt && gZJHMgr.isGiveUpOrNotReady() == false) {

            this.m_oGiveUpCardBtn.getComponent(cc.Button).interactable = (true)
            //SetGrayState(this.m_oGiveUpCardBtn, false)
            // this.setButtonTextColor(this.m_oGiveUpCardBtn, false)
            this.m_oFollowBtn.getComponent(cc.Button).interactable = (true)
            //SetGrayState(this.m_oFollowBtn, false)
            // this.setFollowTextColor(false);
            this.m_oCompCardBtn.getComponent(cc.Button).interactable = false;
            //SetGrayState(this.m_oCompCardBtn, true)
            //this.setButtonTextColor(this.m_oCompCardBtn, true)
            if (gZJHMgr.getOptSite() != gZJHMgr.getMineSite()) {

                this.m_oAddChipBtn.getComponent(cc.Button).interactable = false;
                //SetGrayState(this.m_oAddChipBtn, true)
                //this.setButtonTextColor(this.m_oAddChipBtn, true)
                this.m_oFollowBtn.tagname = (FOLLOW_TAG_T.ALONG_FOLLOW)
                this.m_oCheckFollow.active = (true)
                //this.m_oFollowText.active = false;
                this.m_oFollowBtn.getComponent(cc.Button).normalSprite = this.atlasZJH.getSpriteFrame("zjh_anniu2")
            } else if (gZJHMgr.getOptSite() == gZJHMgr.getMineSite()) {

                var minedata = gZJHMgr.getMineData()
                if (gZJHMgr.getRoomRound() > 2) {

                    this.m_oCompCardBtn.getComponent(cc.Button).interactable = (true)
                    //SetGrayState(this.m_oCompCardBtn, false)
                    //this.setButtonTextColor(this.m_oCompCardBtn, false)
                    //this.m_oCompCardBtn.getComponentInChildren(cc.Sprite).spriteFrame = this.atlasZJH.getSpriteFrame(CompareFrame.CompareFrame1)
                    this.m_oSpriteGuzhu.active = false;
                    this.m_oCompCardBtn.getComponent(cc.Button).normalSprite = this.atlasZJH.getSpriteFrame("zjh_ann4")
                    //this.m_oSpriteGuzhu.getComponent(cc.Sprite).spriteFrame = this.atlasZJH.getSpriteFrame(CompareFrame.CompareFrame1)
                }
                //
                var btouch = true
                var bgray = false
                if (minedata.cardState == gZJHMgr.CardStateType.lock_card) {

                    if (minedata.clips <= gZJHMgr.getMinClip() / 2) {

                        btouch = false
                        bgray = true
                    }
                } else if (minedata.cardState == gZJHMgr.CardStateType.unlock_card) {

                    if (minedata.clips <= gZJHMgr.getMinClip()) {

                        btouch = false
                        bgray = true
                    }
                }


                this.m_oAddChipBtn.getComponent(cc.Button).interactable = (btouch)
                //SetGrayState(this.m_oAddChipBtn, bgray)
                //this.setButtonTextColor(this.m_oAddChipBtn, bgray)
                if (gZJHMgr.isCurBetOverMax()) {

                    this.m_oAddChipBtn.getComponent(cc.Button).interactable = false;
                    //SetGrayState(this.m_oAddChipBtn, true)
                    //this.setButtonTextColor(this.m_oAddChipBtn, true)
                }
                if (this.m_oCheckFollow.getComponent(cc.Toggle).isChecked) {

                    this.m_oCheckFollow.active = (true)
                    //this.m_oFollowText.active = false;
                    this.m_oFollowBtn.getComponent(cc.Button).normalSprite = this.atlasZJH.getSpriteFrame("zjh_anniu2")
                    this.m_oFollowBtn.tagname = (FOLLOW_TAG_T.ALONG_FOLLOW)
                } else {

                    this.m_oCheckFollow.active = false;
                    //this.m_oFollowText.active = (true)
                    this.m_oFollowBtn.getComponent(cc.Button).normalSprite = this.atlasZJH.getSpriteFrame("zjh_ann6")
                    this.m_oFollowBtn.tagname = (FOLLOW_TAG_T.ADD_FOLLOW)
                }
                //

                if (minedata.cardState == gZJHMgr.CardStateType.lock_card) {

                    if (minedata.clips < gZJHMgr.getMinClip() / 2) {

                        btouch = false
                        bgray = true
                    }
                } else if (minedata.cardState == gZJHMgr.CardStateType.unlock_card) {

                    if (minedata.clips < gZJHMgr.getMinClip()) {

                        btouch = false
                        bgray = true
                    }
                }

                if (btouch == false && gZJHMgr.getRoomRound() > 2) {
                    // this.m_oCompCardBtn.getComponentInChildren(cc.Label).string = CompareText.CompareText_2
                    this.m_oSpriteGuzhu.active = true;
                    this.m_oCompCardBtn.getComponent(cc.Button).normalSprite = this.atlasZJH.getSpriteFrame("zjh_anniu2")
                    this.m_oSpriteGuzhu.getComponent(cc.Sprite).spriteFrame = this.atlasZJH.getSpriteFrame(CompareFrame.CompareFrame2)
                }
                this.m_oFollowBtn.getComponent(cc.Button).interactable = (btouch)
                //SetGrayState(this.m_oFollowBtn, bgray)
                // this.setFollowTextColor(bgray)
            }
        } else {

            this.m_oGiveUpCardBtn.getComponent(cc.Button).interactable = false;
            //SetGrayState(this.m_oGiveUpCardBtn, true)
            // this.setButtonTextColor(this.m_oGiveUpCardBtn, true)
            this.m_oFollowBtn.getComponent(cc.Button).interactable = false;
            //SetGrayState(this.m_oFollowBtn, true)
            // this.setFollowTextColor(true)

            //
            this.m_oCompCardBtn.getComponent(cc.Button).interactable = false;
            //SetGrayState(this.m_oCompCardBtn, true)
            //this.setButtonTextColor(this.m_oCompCardBtn, true)
            this.m_oAddChipBtn.getComponent(cc.Button).interactable = false;
            //SetGrayState(this.m_oAddChipBtn, true)
            //this.setButtonTextColor(this.m_oAddChipBtn, true)
            this.m_oFollowBtn.tagname = (FOLLOW_TAG_T.ADD_FOLLOW)
            this.m_oCheckFollow.active = false;
            // this.m_oFollowText.active = (true)
            this.m_oFollowBtn.getComponent(cc.Button).normalSprite = this.atlasZJH.getSpriteFrame("zjh_ann6")
            this.m_oCheckFollow.setSelected = false;
            // this.m_oCompCardBtn.getComponentInChildren(cc.Label).string = CompareText.CompareText_1
            this.m_oSpriteGuzhu.active = false;
            this.m_oCompCardBtn.getComponent(cc.Button).normalSprite = this.atlasZJH.getSpriteFrame("zjh_ann4")
            this.m_oSpriteGuzhu.getComponent(cc.Sprite).spriteFrame = this.atlasZJH.getSpriteFrame(CompareFrame.CompareFrame1)

        }
    },

    showLookCardBtn: function () {
        if (gZJHMgr.getGameState() == gZJHMgr.ZJHRoomState.opt) {

            var minedata = gZJHMgr.getMineData()
            if (minedata.cardState == gZJHMgr.CardStateType.lock_card
                && minedata.playerState > gZJHMgr.PlayerStateType.ready
                && minedata.playerState != gZJHMgr.PlayerStateType.discard) {

                var index = this.getIndexByTag(minedata.site)

                if (this.m_playerCardNode[index] && this.m_playerCardNode[index].getCardCount() == 3) {

                    this.timeoutId = setTimeout(function () {
                        this.m_oLookCardBtn.active = true
                    }.bind(this), 500);
                }
                return
            }
        }
        this.m_oLookCardBtn.active = false;
    },


    //创建进入时，桌面金币
    createDeskClips: function () {
        var total = gZJHMgr.getTotalClips()
        var chipdata = gZJHMgr.getChipsShowData(total, true)
        for (var k = 0; k < chipdata.length; k++) {
            var vardata = chipdata[k];
            var cp = new CChipNode()
            var chipnode = cp.createZJH(vardata.ty, vardata.str, this.atlasZJH)
            var center = this.getRandChipNode()
            var endpos = cc.v2(center.x + Math.pow(-1, Math.floor(Math.random() * CHIP_RANG_RX)) * Math.random() * CHIP_RANG_RX,
                center.y + Math.pow(-1, Math.floor(Math.random() * CHIP_RANG_RY)) * Math.random() * CHIP_RANG_RY)
            chipnode.setPosition(endpos)
            this.m_oPanelMid.addChild(chipnode, var_ORDER.Clip_order)
            this.m_allChip = this.m_allChip || []
            this.m_allChip.push(chipnode)
        }
    },


    //恢复玩家的牌
    recoverPlayerCard: function () {
        var ls = gZJHMgr.getPlaySiteList()
        for (var k = 0; k < ls.length; k++) {
            var site = ls[k];
            var player = gZJHMgr.getPlayerBySite(site)
            var index = this.getIndexByTag(site)
            if (player && index != 0 && this.m_playerCardNode[index]) {
                this.m_playerCardNode[index].showEnterRoom(player)
            }
        }
    },
    // /**
    //  * 事件处理
    //  * 
    //  */

    onEventMessage: function (event, data) {
        switch (event) {
            case HallCommonEvent.HALL_NO_RECONNECT_GAME:
                this.reconnectHall();
                break;

        }
    },

    //重连时游戏已结束
    reconnectHall: function () {
        gZJHMgr.quitGame();
    },

    /**
     * 析构
    * 
     */
    onDestroy: function () {
        AudioManager.stopMusic();
        HallCommonEd.removeObserver(this);
        clearInterval(this.m_nSchedTimerID);
        // ZJHED.removeObserver(this);
        clearTimeout(this.timeoutId);
    },



    //////////////////////////-
    //状态处理，分发
    //////////////////////////-
    update: function (dt) {
        //
        // if (this._armatureDisplay.getAnimation().isPlaying() == false) {
        //     this._armatureDisplay.getAnimation().reset()
        //     this._armatureDisplay.getAnimation().play()
        // }

        //
        this.updateRoomBet()

        //
        this.startTimer(dt)
        //

        //
        this.showLookCardBtn()
        //

        //
        this.freshSitePanel()
        //

        if (gZJHMgr.getGameFlag(gZJHMgr.GameFlag.enterRoom) == true) {

            gZJHMgr.setGameFlag(gZJHMgr.GameFlag.enterRoom, false)
            this.enterRoom()
        }

        //状态改变
        if (gZJHMgr.getGameFlag(gZJHMgr.GameFlag.gamestate) == true) {

            gZJHMgr.setGameFlag(gZJHMgr.GameFlag.gamestate, false)
            this.changGameState()
        }

        //
        if (gZJHMgr.getGameFlag(gZJHMgr.GameFlag.playerReady) == true) {

            gZJHMgr.setGameFlag(gZJHMgr.GameFlag.playerReady, false)
            this.playerReady()
        }

        //
        if (gZJHMgr.getGameFlag(gZJHMgr.GameFlag.playerEnterRoom) == true) {

            gZJHMgr.setGameFlag(gZJHMgr.GameFlag.playerEnterRoom, false)
            this.playerEnter()
        }

        //
        if (gZJHMgr.getGameFlag(gZJHMgr.GameFlag.disCard) == true) {

            gZJHMgr.setGameFlag(gZJHMgr.GameFlag.disCard, false)
            this.showBanker(true)
            this.dispenseCard()
        }

        //
        if (gZJHMgr.getGameFlag(gZJHMgr.GameFlag.nextOpSite) == true) {

            gZJHMgr.setGameFlag(gZJHMgr.GameFlag.nextOpSite, false)
            this.playerOption()
            // cc.log("切换状态时间   " + ConvertSecondToTime(GameMgr.getServerTime()))
        }

        //
        if (gZJHMgr.getGameFlag(gZJHMgr.GameFlag.playerquite) == true) {

            gZJHMgr.setGameFlag(gZJHMgr.GameFlag.playerquite, false)
            this.playerLeave()
        }

        //
        if (gZJHMgr.getGameFlag(gZJHMgr.GameFlag.lookCard) == true) {

            gZJHMgr.setGameFlag(gZJHMgr.GameFlag.lookCard, false)
            this.lookCard()
        }

        //
        if (gZJHMgr.getGameFlag(gZJHMgr.GameFlag.giveupCard) == true) {

            gZJHMgr.setGameFlag(gZJHMgr.GameFlag.giveupCard, false)
            this.playerGiveupCard()
        }
        //
        if (gZJHMgr.getGameFlag(gZJHMgr.GameFlag.collectcost) == true) {

            gZJHMgr.setGameFlag(gZJHMgr.GameFlag.collectcost, false)
            this.collectDeskCost()
        }

        //
        if (gZJHMgr.getGameFlag(gZJHMgr.GameFlag.betFresh) == true) {

            gZJHMgr.setGameFlag(gZJHMgr.GameFlag.betFresh, false)
            this.betFresh()
        }

        //
        if (gZJHMgr.getGameFlag(gZJHMgr.GameFlag.comparecard) == true) {

            gZJHMgr.setGameFlag(gZJHMgr.GameFlag.comparecard, false)
            //结束当前操作玩家特效
            this.showOpTimerEffect(true)
            this.compareStartEffect()
            this.setOpbtnState()
        }

        //
        if (gZJHMgr.getGameFlag(gZJHMgr.GameFlag.guzhuyizhi) == true) {

            gZJHMgr.setGameFlag(gZJHMgr.GameFlag.guzhuyizhi, false)
            //结束当前操作玩家特效
            this.showOpTimerEffect(true)
            this.compareAllEffect()
            this.setOpbtnState()
        }

        //
        if (gZJHMgr.getGameFlag(gZJHMgr.GameFlag.calcstate) == true) {

            gZJHMgr.setGameFlag(gZJHMgr.GameFlag.calcstate, false)
            //结束当前操作玩家特效
            this.showOpTimerEffect(true)
            this.timeoutId = setTimeout(function () {
                this.endcurRound()
            }.bind(this), 1000)

        }

        //
        if (gZJHMgr.getGameFlag(gZJHMgr.GameFlag.autoAddClip) == true) {

            gZJHMgr.setGameFlag(gZJHMgr.GameFlag.autoAddClip, false)
            this.resetPlayerClip()
        }
        if (gZJHMgr.getGameFlag(gZJHMgr.GameFlag.selfAutoChips) == true) {
            gZJHMgr.setGameFlag(gZJHMgr.GameFlag.selfAutoChips, false)
            this.onServerAutoChipsResponse()
        }


        //
        if (gZJHMgr.getGameFlag(gZJHMgr.GameFlag.playGold) == true) {

            gZJHMgr.setGameFlag(gZJHMgr.GameFlag.playGold, false)
            this.rewardPlayerAction()
        }
    },
    //////////////////-
    //状态逻辑
    //////////////////-
    enterRoom: function () {
        //清除ui，断线重连也走这个函数
        this.cleanAllShow(true);
        this.resetRound();

        if (gZJHMgr.getGameState() > gZJHMgr.ZJHRoomState.ready) {

            cc.log("中途进入游戏房间")
            this.showPlayerWatchState()
            this.createDeskClips()
            this.recoverPlayerCard()
            //恢复某一玩家的操作状态
            this.playerOption()
            this.updatePlayerClips()
            this.showBanker(true)
        } else {
            //不做处理
        }
    },

    cleanAllShow: function (isEnterGame) {
        for (var k = 0; k < this.m_playerCardNode.length; k++) {
            var cardpanel = this.m_playerCardNode[k];
            if (cardpanel) {
                if (isEnterGame) {
                    cardpanel.resetdata()
                } else {
                    cardpanel.removeCards()
                }

            }
        }
        //gAudioManger:playAudio(13028)
        if (isEnterGame) {

        }
        else {
            AudioManager.playSound(zjhAudioDir + "13028");
        }

        for (var k = 0; k < this.m_allChip.length; k++) {
            var chip = this.m_allChip[k];
            if (chip) {
                chip.stopAllActions()
                chip.removeFromParent()
                this.m_allChip[k] = null
            }
        }
        this.showOpTimerEffect(true)
        this.m_nLastOp = 0          //清上一局操作位置
        this.m_oPlayerBetOperation.active = false;
    },
    onServerAutoChipsResponse: function () {
        if (this.settingWindow) {
            var script = this.settingWindow.getComponent("AutoAddClipsWindow");
            script.reseverCallfunc()
        }
    },
    //刷新玩家金币
    resetPlayerClip: function () {
        for (var k = 0; k < gZJHMgr.getPlayerList().length; k++) {
            var player = gZJHMgr.getPlayerList()[k];
            if (player) {

                var index = this.getIndexByTag(player.site)
                if (this.m_oPlayerSiteList[index]) {

                    var coin_text = cc.find("coin_text", this.m_oPlayerSiteList[index])
                    coin_text.getComponent(cc.Label).string = player.clips;
                }
            }
        }
    },

    changGameState: function () {
        if (gZJHMgr.getGameState() <= gZJHMgr.ZJHRoomState.ready) {

            this.cleanAllShow()
            this.updatePlayerShowState()
            this.showBanker(false);
            this.m_oCheckFollow.setSelected = false;
        } else if (gZJHMgr.getGameState() == gZJHMgr.ZJHRoomState.opt) {

            this.hideAllReady()
        } else if (gZJHMgr.getGameState() == gZJHMgr.ZJHRoomState.calc) {

            this.setOpbtnState()
        }
    },

    startTimer: function (dt) {
        if (gZJHMgr.getGameState() == gZJHMgr.ZJHRoomState.ready) {
            var time = Math.floor(gZJHMgr.m_nTimer)// - ( gZJHMgr.getStatebeginTime()))
            time = Math.max(time, 0)
            this.m_oReadyTime.active = (true)
            this.m_oReadyTime.getComponent(cc.Label).string = "发牌倒计时  {0}".format(time);
            if (gZJHMgr.getMineData().playerState < gZJHMgr.PlayerStateType.ready) {

                this.m_oStartPanel.active = (true)
            }
            gZJHMgr.m_nTimer = gZJHMgr.m_nTimer - dt
        } else {

            this.m_oReadyTime.active = false;
            this.m_oStartPanel.active = false;
        }
    },

    playerReady: function () {
        for (var k = 0; k < gZJHMgr.getPlayerList().length; k++) {
            var player = gZJHMgr.getPlayerList()[k];

            if (player.playerState == gZJHMgr.PlayerStateType.ready) {

                var index = this.getIndexByTag(player.site)
                if (index != 0 && this.m_oPlayerReady[index]) {

                    this.m_oPlayerReady[index].active = (true)
                    if (player.playerId == cc.dd.user.id) {

                        this.m_oStartPanel.active = false;
                    }
                }
            }
        }
    },

    showBanker: function (bshow) {
        //dump(gZJHMgr.getBankerSite(), "显示庄家")
        for (var k = 1; k <= 5; k++) {

            var banker = cc.find("rob_img", this.m_oPlayerSiteList[index])
            if (banker) {

                banker.active = false;
            }
        }

        if (bshow == false) { return }

        var index = this.getIndexByTag(gZJHMgr.getBankerSite())
        if (index == 0) { return }
        if (this.m_oPlayerSiteList[index]) {

            var banker = cc.find("rob_img", this.m_oPlayerSiteList[index])
            banker.active = (true)
        }
    },

    callFuncDisCard: function (time, sender) {
        cc.log("!!!!callFuncDisCard:", time);
        this.timeoutId = setTimeout(function () {
            sender.dispanseCard()
        }.bind(this), time)
    },
    dispenseCard: function () {
        //dump(gZJHMgr.getPlaySiteList(), "开始发牌")
        var lst = gZJHMgr.getPlaySiteList();
        for (var k = 0; k < lst.length; k++) {
            var site = lst[k];
            var index = this.getIndexByTag(site)
            if (index != 0 && this.m_playerCardNode[index]) {

                this.callFuncDisCard(k * 125, this.m_playerCardNode[index]);

            } else {

                cc.log("发牌错误位置   " + index + "  site  == " + site)
            }
        }
    },


    playerOption: function () {
        cc.log("当前操作位置 ===  " + gZJHMgr.getOptSite())
        if (gZJHMgr.getOptSite() != gZJHMgr.getMineSite()) {

            this.m_oPlayerBetOperation.active = false;
        } else {

            if (this.m_oCheckFollow.getComponent(cc.Toggle).isChecked) {

                var value = 0
                if (gZJHMgr.getMineData().cardState == gZJHMgr.CardStateType.lock_card) {

                    value = gZJHMgr.getMinClip() / 2
                } else {

                    value = gZJHMgr.getMinClip()
                }
                this.timeoutId = setTimeout(function () {
                    zjh_msg_send.requestOp2s(2, value);
                }.bind(this), 1000);

            }
            //gAudioManger:playAudio(13025)
            AudioManager.playSound(zjhAudioDir + "13025");
        }
        this.showOpTimerEffect()
        this.setOpbtnState()
    },

    lookCard: function () {
        var lst = gZJHMgr.getPlaySiteList()
        for (var k = 0; k < lst.length; k++) {
            var site = lst[k];
            var player = gZJHMgr.getPlayerBySite(site)
            if (player) {

                if (player.cardState == gZJHMgr.CardStateType.unlock_card) {

                    var index = this.getIndexByTag(site)
                    if (index != 0 && this.m_playerCardNode[index]) {

                        this.m_playerCardNode[index].lookCard(player)
                        if (site == gZJHMgr.getMineSite()) {

                            var cardtype = gZJHMgr.calcCardValue(player.cardsList)
                            this.m_playcardtype[index].getComponent(cc.Sprite).spriteFrame = this.atlasZJH.getSpriteFrame(CardTypeSpr[cardtype])//.setTexture(CardTypeSpr[cardtype])
                            this.m_playcardtype[index].active = (true)
                        }
                    }
                }
            }
        }
    },

    playerGiveupCard: function () {
        for (var k = 0; k < gZJHMgr.getPlaySiteList().length; k++) {
            var site = gZJHMgr.getPlaySiteList()[k];
            var player = gZJHMgr.getPlayerBySite(site)
            var index = this.getIndexByTag(site)
            if (player && player.playerState == gZJHMgr.PlayerStateType.discard && this.m_playerCardNode[index]) {

                this.m_playerCardNode[index].giveupCard(player)
                //cc.find("iamge_bg", this.m_oPlayerSiteList[index]).getComponent(cc.Sprite).spriteFrame = this.otherPlayerPrefab.data.getComponent(cc.Sprite).spriteFrame;
                if (site == gZJHMgr.getMineSite()) {

                    this.setOpbtnState()
                    var index = this.getIndexByTag(site)

                    this.m_playerCardNode[index].lookCard(gZJHMgr.getMineData())
                    this.m_oLookCardBtn.active = false;

                    cc.log("自己弃牌。。。。。。")
                }
            }
        }
    },

    //结束表现
    freshOnePlayerClip: function (site) {
        var player = gZJHMgr.getPlayerBySite(site)
        var index = this.getIndexByTag(site)
        if (player && this.m_oPlayerSiteList[index]) {

            var coin_text = cc.find("coin_text", this.m_oPlayerSiteList[index])
            coin_text.getComponent(cc.Label).string = player.clips;
        }
    },

    showRewardClip: function (site, clip) {
        var player = gZJHMgr.getPlayerBySite(site)
        var index = this.getIndexByTag(site)
        if (player && this.m_oPlayerSiteList[index]) {

            this.m_playerCardNode[index].active = false;
            this.m_playcardtype[index].active = false;
            var gongxieffect = null
            var gongxifunc = cc.callFunc(function () {
                //gongxieffect = createEffect("effect_mutil/ZhaJinHua/1201/zjh_gongxihuode.csb", false)
                // gongxieffect.setPosition(gZJHMgr.GetNodePos(gongxieffect))
                // this.m_oPanelMid.addChild(gongxieffect)
            }.bind(this));

            //
            var gongxiremove = cc.callFunc(function () {
                // gongxieffect.removeFromParent()
            }.bind(this));

            var goldeffect = cc.callFunc(function () {
                var chipdata = gZJHMgr.getChipsShowData(clip)
                for (var k = 0; k < chipdata.length; k++) {
                    var vardata = chipdata[k];
                    var cp = new CChipNode();
                    var chipnode = cp.createZJH(vardata.ty, vardata.str, this.atlasZJH)
                    chipnode.setPosition(gZJHMgr.GetNodePos(this.m_oPanelMid))
                    this.m_oPanelMid.addChild(chipnode, var_ORDER.Clip_order)
                    chipnode.moveRemove(gZJHMgr.GetNodePos(this.m_oPlayerSiteList[index]))
                }
                gZJHMgr.addPlayerClip(site, clip)
            }.bind(this))

            var cardsnode = new CZhaJinHuaCard();//cc.instantiate(this.cardNode);//
            cardsnode.initRes(this.atlasZJH, this.cardNode)
            if (IS_TEST) {
                cardsnode.createRewardCard([2, 18, 34], this.atlasZJH, this.cardNode)
            } else {
                cardsnode.createRewardCard(player.cardsList, this.atlasZJH, this.cardNode)
            }

            //cardsnode.setPosition(gZJHMgr.GetNodePos(this.m_playerCardNode[index]))
            this.m_cardNode[index].addChild(cardsnode)
            cardsnode.zIndex = var_ORDER.Card_order

            var resetfunc = cc.callFunc(function () {
                cardsnode.removeFromParent()
                this.m_playerCardNode[index].active = (true)
                this.m_playcardtype[index].active = (true)
            }.bind(this))

            var move = cc.moveTo(0.2, gZJHMgr.GetNodePos(this.m_oComPanel))
            var backmove = cc.moveTo(0.2, gZJHMgr.GetNodePos(this.m_playerCardNode[index]))
            var delay = cc.delayTime(1.67)
            var seq = cc.sequence(move, gongxifunc, delay, gongxiremove, cc.spawn(goldeffect, backmove), resetfunc)
            cardsnode.runAction(seq)
        }
    },

    showWinGold: function () {
        var resultdata = gZJHMgr.getResultData()
        var delay = 2
        var cnt = 0
        for (var i = 0; i < resultdata.winSitesList.length; i++) {
            var site = resultdata.winSitesList[i];
            for (var k = 0; k < resultdata.resultsList.length; k++) {
                var sitedate = resultdata.resultsList[k];
                if (sitedate.site == site) {

                    var index = this.getIndexByTag(site)
                    var sitepanel = this.m_oPlayerSiteList[index]
                    if (sitepanel) {

                        var winclip = sitedate.winClips - sitedate.specialAward
                        var text = cc.instantiate(this.tipsWin);
                        // text.color = cc.color(0xFF,0xF6,0x92,0xFF))
                        text.getComponent(cc.Label).string = ("+" + winclip);
                        text.setPosition(cc.v2(0, 0))//gZJHMgr.GetNodePos(this.m_oPlayerSiteList[index]))
                        this.m_oPlayerSiteList[index].addChild(text)
                        text.runAction(cc.sequence(cc.moveBy(0.5, cc.v2(0, 20)), cc.delayTime(1), cc.spawn(cc.moveBy(0.5, cc.v2(0, 20)), cc.FadeOut(0.2)), cc.callFunc(function () {
                            text.removeFromParent()
                        }.bind(this)
                        ), cc.delayTime(cnt * delay), cc.callFunc(function () {
                            if (sitedate.specialAward != 0) {
                                //特殊奖励
                                this.showRewardClip(site, sitedate.specialAward)
                                //gAudioManger:playAudio(13040)
                                AudioManager.playSound(zjhAudioDir + "13040");
                            }
                        }.bind(this)
                        )))
                        gZJHMgr.addPlayerClip(site, winclip)
                        this.freshOnePlayerClip(site)
                    }
                }
            }
        }
    },
    splitTableCount: function (tcnt, splitcnt) {
        var avercnt = Math.ceil(tcnt / splitcnt)
        var ret = []
        var addedcnt = 0
        for (var k = 1; k <= splitcnt; k++) {
            if (splitcnt == k) {
                ret.push(tcnt - addedcnt);
            } else {
                ret.push(avercnt);
                addedcnt = avercnt + addedcnt
            }
        }
        return ret
    },

    endcurRound: function () {
        //dump(gZJHMgr.getResultData(), "显示炸金花结果")
        this.m_oPlayerBetOperation.active = false;
        var resultdata = gZJHMgr.getResultData()
        //gAudioManger:playAudio(13039)
        AudioManager.playSound(zjhAudioDir + "13039");
        if (resultdata.length == 0) {
            cc.log("结算数据空！");
            return;
        }

        if (resultdata.type == 0) {
            //普通结算
            var index = this.getIndexByTag(resultdata.winSitesList[0])
            if (index != 0 && this.m_oPlayerSiteList[index]) {

                var pos = gZJHMgr.GetNodePos(this.m_oPlayerSiteList[index])
                for (var k = 0; k < this.m_allChip.length; k++) {
                    var chip = this.m_allChip[k];
                    if (chip) {
                        chip.moveGatherRemove(this.getRandChipNode(), pos)
                    }
                    this.m_allChip[k] = null
                }
                this.m_allChip = []
            }
        } else {

            var chipcnt = this.m_allChip.length
            var cnt = resultdata.winSitesList.length
            var idx = 1
            var splittab = this.splitTableCount(chipcnt, cnt)
            for (var k = 0; k < resultdata.winSitesList.length; k++) {
                var site = resultdata.winSitesList[k];
                var index = this.getIndexByTag(site)
                if (index != 0 && this.m_oPlayerSiteList[index]) {

                    var pos = gZJHMgr.GetNodePos(this.m_oPlayerSiteList[index])
                    var idx = 0//1
                    if (k != 0 && splittab[k] != null) {

                        idx = splittab[k] //+ 1
                    }
                    for (var i = idx; i < splittab[k]; i++) {

                        if (this.m_allChip[i]) {

                            this.m_allChip[i].moveGatherRemove(this.getRandChipNode(), pos)
                            this.m_allChip[i] = null
                        }
                    }
                }
            }
            this.m_allChip = []
        }

        for (var k = 0; k < resultdata.resultsList.length; k++) {
            var presult = resultdata.resultsList[k];
            if (presult.cardsList.length != 0) {

                var index = this.getIndexByTag(presult.site)
                if (index != 0 && this.m_playerCardNode[index]) {


                    var player = gZJHMgr.getPlayerBySite(presult.site)
                    this.m_playerCardNode[index].lookCard(player)
                    var bshowcard = gZJHMgr.isCanLookCardSite(player.site)
                    if (player.cardsList.length == 3 && bshowcard) {

                        var cardtype = gZJHMgr.calcCardValue(player.cardsList)
                        this.m_playcardtype[index].getComponent(cc.Sprite).spriteFrame = this.atlasZJH.getSpriteFrame(CardTypeSpr[cardtype])//setTexture(CardTypeSpr[cardtype])
                        this.m_playcardtype[index].active = (true)
                    }
                }
            }
        }

        this.m_oPanelMid.stopAllActions()
        this.m_oPanelMid.runAction(cc.sequence(cc.delayTime(0.3), cc.callFunc(function () {
            this.showWinGold()
            gZJHMgr.setRoomTotalClip(0)
        }.bind(this)
        )))

        gZJHMgr.m_nTimer = readyTime;
    },

    //表现效果
    selectCompPlayer: function (bselect) {
        cc.log("显示比牌效果")
        if (this.m_clippingnode != null) {

            this.m_clippingnode.active = bselect
            this.m_otouchbg.active = false;
            for (var k = 1; k <= 5; k++) {

                this.m_oStencilchilds[k].active = false;
                this.m_oPlayerSiteList[k].stopAllActions()
                this.m_oTouchSelect[k].active = false;
            }
        }
        if (bselect == false) {
            this.m_oMaskBg.active = false;
            return
        }
        var sitelist = gZJHMgr.getCurPlayerData()
        if (sitelist.length == 2) {//table.num

            this.compPlayer(sitelist[1])//2
            return
        }
        this.m_oMaskBg.active = true;
        if (this.m_clippingnode == null) {

            this.m_oStencil = new cc.Node()
            this.m_oStencilchilds = []
            this.m_oTouchSelect = []
            for (var k = 1; k <= 5; k++) {

                var stencil = new cc.Node();
                var sprite = stencil.addComponent(cc.Sprite);
                sprite.spriteFrame = this.otherPlayerPrefab.data.getComponent(cc.Sprite).spriteFrame;
                this.m_oStencilchilds[k] = stencil
                var pos = this.m_oPanelMid.convertToWorldSpaceAR(gZJHMgr.GetNodePos(this.m_oPlayerSiteList[k]))
                pos = this.m_oRoot.convertToNodeSpaceAR(pos)
                stencil.setPosition(pos)
                stencil.active = false;
                var touchselect = new cc.Node();//ccui.Layout()
                touchselect.setContentSize(stencil.getContentSize())
                touchselect.setAnchorPoint(cc.v2(0.5, 0.5))
                touchselect.setPosition(pos)
                var btn = touchselect.addComponent(cc.Button)
                touchselect.active = false;
                this.m_oTouchSelect[k] = touchselect
                touchselect.on("click", this.selectPlayerFunc, this)
                // touchselect.addTouchEventListener(handler(self, this.selectPlayerFunc))
                this.m_oStencil.addChild(stencil)
                this.m_oRoot.addChild(touchselect, 101)
            }
            if (this.m_otouchbg == null) {

                this.m_otouchbg = new cc.Node();//ccui.Layout()
                this.m_otouchbg.setContentSize(cc.size(1536, 1152))
                this.m_otouchbg.setAnchorPoint(cc.v2(0.5, 0.5))
                this.m_otouchbg.setPosition(cc.v2(0.5, 0.5))
                var btn = this.m_otouchbg.addComponent(cc.Button)
                this.m_otouchbg.on("click", function (sender, event) {
                    this.selectCompPlayer(false);
                }.bind(this), this)
                // this.m_otouchbg.addTouchEventListener(function (sender, event) {
                //     if (event == ccui.TouchEventType.ended) {

                //         this.selectCompPlayer(false);
                //     }
                // }
                // )
                this.m_otouchbg.active = false;
                this.m_oRoot.addChild(this.m_otouchbg, 50)
            }

            this.m_clippingnode = new cc.Node();//cc.ClippingNode(this.m_oStencil)
            var msk = this.m_clippingnode.addComponent(cc.Mask);
            this.m_clippingnode.setContentSize(cc.size(1536, 1152))
            this.m_oRoot.addChild(this.m_clippingnode, 10)
            var layerbg = new cc.Node();//(cc.color(0, 0, 0, 160))
            var spt = layerbg.addComponent(cc.Sprite);
            // spt.spriteFrame = this.maskSprite
            // spt.sizeMode = cc.Sprite.SizeMode.CUSTOM;
            layerbg.setContentSize(cc.size(1536, 1152))
            this.m_clippingnode.addChild(layerbg)
            msk.inverted = true;
            msk.alphaThreshold = 0;
        }
        for (var k = 0; k < gZJHMgr.getPlaySiteList().length; k++) {
            var site = gZJHMgr.getPlaySiteList()[k];
            var player = gZJHMgr.getPlayerBySite(site)
            if (player && player.cardState != gZJHMgr.CardStateType.complose &&
                player.playerState != gZJHMgr.PlayerStateType.discard) {

                var index = this.getIndexByTag(site)
                if (index != 0) {

                    this.m_otouchbg.active = (true)
                    this.m_oStencilchilds[index].active = (true)
                    this.m_oTouchSelect[index].tagname = (site)
                    this.m_oTouchSelect[index].active = (true)
                    var repeatFunc = cc.repeatForever(cc.sequence(cc.scaleTo(0.2, 0.98), cc.scaleTo(0.2, 1)))
                    this.m_oPlayerSiteList[index].runAction(repeatFunc)
                } else {

                    cc.log("site is error  = " + site)
                    return this.selectCompPlayer(false);
                }
            }
        }
    },

    createChip: function (index, value) {
        var chipdata = gZJHMgr.getChipsShowData(value)
        if (chipdata.length > 1) {

            //gAudioManger:playAudio(13026)
            AudioManager.playSound(zjhAudioDir + "13026");
        } else {

            //gAudioManger:playAudio(13027)
            AudioManager.playSound(zjhAudioDir + "13027");
        }
        for (var k = 0; k < chipdata.length; k++) {
            var vardata = chipdata[k];
            var cp = new CChipNode();
            var chipnode = cp.createZJH(vardata.ty, vardata.str, this.atlasZJH)
            chipnode.setPosition(gZJHMgr.GetNodePos(this.m_oPlayerSiteList[index]))
            var center = this.getRandChipNode()
            var rax1 = Math.pow(-1, Math.floor(Math.random() * CHIP_RANG_RX))
            var rax2 = Math.random() * CHIP_RANG_RX
            var endpos = cc.v2(center.x + rax1 * rax2,
                center.y + Math.pow(-1, Math.floor(Math.random() * CHIP_RANG_RY)) * Math.random() * CHIP_RANG_RY)
            chipnode.move(endpos, false)
            this.nodechip.addChild(chipnode, var_ORDER.Clip_order)
            this.m_allChip = this.m_allChip || []
            this.m_allChip.push(chipnode);
        }
    },

    //铺底和扣除房费
    collectDeskCost: function () {
        for (var k = 0; k < gZJHMgr.getPlaySiteList().length; k++) {
            var site = gZJHMgr.getPlaySiteList()[k];
            var index = this.getIndexByTag(site)
            if (index != 0 && this.m_oPlayerSiteList[index]) {

                var player = gZJHMgr.getPlayerBySite(site)
                var coin_text = cc.find("coin_text", this.m_oPlayerSiteList[index])
                coin_text.getComponent(cc.Label).string = player.clips;
                var betclips = cc.find("bet_text", this.m_playerbetnode[index])
                betclips.getComponent(cc.Label).string = player.betClips;
                this.m_playerbetnode[index].active = (true)

                this.createChip(index, player.betClips);//gZJHMgr.getMinClip())
            }
        }
    },

    betFresh: function () {
        var betdata = gZJHMgr.getOpData()
        var index = this.getIndexByTag(betdata.site)
        var result = gZJHMgr.getAddBetPlayer()
        var addplayer = result.addPlayer
        var badd = result.bAdd
        if (addplayer != null) {
            if (badd == true) {
                if (addplayer.sex == gZJHMgr.SexManOrWuman.MAN) {
                    //gAudioManger:playAudio(13015)
                    AudioManager.playSound(zjhAudioDir + "13015");
                } else {
                    //gAudioManger:playAudio(13005)
                    AudioManager.playSound(zjhAudioDir + "13005");
                }
            } else {
                var audio = addplayer.betCount > 3 && 3 || addplayer.betCount
                var idx = 0;
                if (addplayer.sex == gZJHMgr.SexManOrWuman.MAN) {
                    //gAudioManger:playAudio(13018+audio)
                    idx = 13018 + audio
                    AudioManager.playSound(zjhAudioDir + idx + "");
                } else {
                    //gAudioManger:playAudio(13008+audio)
                    idx = 13008 + audio
                    AudioManager.playSound(zjhAudioDir + idx + "");
                }
            }
        }
        if (index != 0 && this.m_oPlayerSiteList[index]) {

            this.createChip(index, betdata.value)
        }
        this.updatePlayerClips()
    },

    cleanCompareNode: function () {
        for (var k = 0; k < this.m_CompareNode.length; k++) {
            var node = this.m_CompareNode[k];
            if (node) {

                node.removeFromParent()
            }
        }
        this.m_CompareNode = []
    },

    setPlayerHead: function (sprite, url, isWx) {
        if (isWx) {
            var tinyUrl = url.substring(0, url.lastIndexOf('/') + 1) + "64";
            cc.dd.SysTools.loadWxheadH5(sprite, tinyUrl);
        } else {
            cc.dd.SysTools.loadWxheadH5(sprite, REMOTE_PATH + url);
        }

    },


    createPlayerhead: function (playersite, player) {

        var posnode = playersite.getChildByName("head_bg")
        posnode.removeChildByTag(1221)
        // var head = new CHeadIconNode(player.sex)
        var head = cc.instantiate(this.headNode)
        var icon = cc.find("iconBg/icon", head).getComponent(cc.Sprite)
        if (player.headUrl != "") {
            var testWXHead = "http://thirdwx.qlogo.cn/mmopen/vi_32/xhvXzvvaAfj6ZI3tSdKdQ7mujLGSoQdicyzZxmF8ibcNxqHfZlQjvHhfhJ7Wy9PYugtG87O6F5icCqHI5vDRdibAwA/132"
            this.setPlayerHead(icon, player.headUrl, !player.isRobot);
        }
        head.setScale(HEAD_SCALE)
        head.parent = (posnode)
        head.tagname = (1221)
        // head.setData(player.head_info)
    },

    //和某一玩家比牌效果
    compareStartEffect: function () {
        this.cleanCompareNode()
        var comparedata = gZJHMgr.getOpData()
        var site1 = comparedata.site
        var site2 = comparedata.value
        var index1 = this.getIndexByTag(site1)
        var index2 = this.getIndexByTag(site2)

        var player1 = gZJHMgr.getPlayerBySite(site1)
        var player2 = gZJHMgr.getPlayerBySite(site2)
        var idx = 0
        if (player1.sex == gZJHMgr.SexManOrWuman.WUMAN) {

            //gAudioManger:playAudio(13006+Math.random(1,2))

            idx = 13006 + Math.floor(Math.random() * 2) + 1;
            AudioManager.playSound(zjhAudioDir + idx + "");
        } else {
            idx = 13016 + Math.floor(Math.random() * 2) + 1;
            //gAudioManger:playAudio(13016+Math.random(1,2))
            AudioManager.playSound(zjhAudioDir + idx + "");
        }
        if (index1 == 0 || index2 == 0 ||
            this.m_oPlayerSiteList[index1] == null ||
            this.m_oPlayerSiteList[index2] == null
        ) {

            return
        }

        var p1_site = cc.instantiate(this.m_oPlayerSiteList[index1]);
        var p2_site = cc.instantiate(this.m_oPlayerSiteList[index2]);//.clone());
        this.m_oComPanel.active = (true)
        this.m_oPlayerSiteList[index1].active = false;
        this.m_oPlayerSiteList[index2].active = false;
        this.m_oComPanel.addChild(p1_site)
        this.m_oComPanel.addChild(p2_site)
        this.m_CompareNode.push(p1_site)
        this.m_CompareNode.push(p2_site)
        p1_site.setOpacity(255)
        p2_site.setOpacity(255)
        this.createPlayerhead(p1_site, player1)
        this.createPlayerhead(p2_site, player2)

        //
        var p1_pos = gZJHMgr.NodePointToDesNodePoint(this.m_oPlayerSiteList[index1], this.m_oComPanel)
        var p2_pos = gZJHMgr.NodePointToDesNodePoint(this.m_oPlayerSiteList[index2], this.m_oComPanel)
        //
        var pos1 = gZJHMgr.GetNodePos(cc.find("node_start_com_left", this.m_oComPanel))
        var pos2 = gZJHMgr.GetNodePos(cc.find("node_start_com_right", this.m_oComPanel))
        p1_site.setPosition(p1_pos)
        p2_site.setPosition(p2_pos)

        var showpkeffct = cc.callFunc(function () {
            var nodeE = cc.find("compareEffect", this.m_oComPanel)
            var effect = nodeE.getComponent(cc.Animation);//createEffect("effect_mutil/ZhaJinHua/1201/ZhaJinHua_PK.csb", false)
            nodeE.setOpacity(255);
            nodeE.setPosition(cc.v2(0, 0))
            effect.play("zjh_compareEffect");
            // effect.setCurrentTime(0,"zjh_compareEffect");
            // this.m_oComPanel.addChild(effect)
            // this.m_CompareNode.push( effect)
            //gAudioManger:playAudio(13029)
            AudioManager.playSound(zjhAudioDir + "13029");
        }.bind(this)
        )

        var showpkeffctNew = cc.callFunc(function () {
            var effect = this.m_oComPanel.getComponent(cc.Animation);
            // effect.setOpacity(255);
            effect.play("zjh_PK");
            AudioManager.playSound(zjhAudioDir + "13029");
        }.bind(this)
        )

        var showloseeffct = cc.callFunc(function () {
            //var effect = createEffect("effect_mutil/ZhaJinHua/1201/ZhaJinHK_daoguang.csd.csb", false)
            var nodeE = cc.find("compareEffect", this.m_oComPanel)
            nodeE.zIndex = 100;
            var effect = nodeE.getComponent(cc.Animation);//createEffect("effect_mutil/ZhaJinHua/1201/ZhaJinHua_PK.csb", false)
            effect.play("zjh_light");
            AudioManager.playSound(zjhAudioDir + "13030");
            if (comparedata.site == comparedata.winSite) {
                //操作者获胜
                nodeE.setPosition(pos2)
                p2_site.setOpacity(OPACITY_DIS)
            } else {
                //被操作者获胜
                nodeE.setPosition(pos1)
                p1_site.setOpacity(OPACITY_DIS)
            }
            // this.m_oComPanel.addChild(effect)
            // this.m_CompareNode.push( effect)
        }.bind(this)
        )
        var showend = cc.callFunc(function () {
            p1_site.runAction(cc.sequence(cc.moveTo(0.2, p1_pos), cc.callFunc(function () {
                this.m_oComPanel.active = false;
                this.m_oPlayerSiteList[index1].active = (true)
                this.m_oPlayerSiteList[index2].active = (true)

                if (comparedata.site == comparedata.winSite) {
                    //操作者获胜

                    this.m_playerCardNode[index2].lookCard(player2)
                    // this.m_oPlayerSiteList[index2].getChildByName("loseimg").active = (true)
                } else {
                    //被操作者获胜

                    this.m_playerCardNode[index1].lookCard(player1)
                    // this.m_oPlayerSiteList[index1].getChildByName("loseimg").active = (true)
                }
            }.bind(this))))
            p2_site.runAction(cc.moveTo(0.2, p2_pos))
        }.bind(this)
        )

        var delay1 = cc.delayTime(0.9)
        var delay2 = cc.delayTime(1.8)

        var req = cc.sequence(cc.moveTo(0.3, pos1), /*showpkeffct,*/showpkeffctNew, delay1, showloseeffct, delay2, showend)
        // p1_site.stopAllActions();
        // p2_site.stopAllActions();
        p1_site.runAction(req)
        p2_site.runAction(cc.moveTo(0.3, pos2))
    },

    //孤注一掷效果
    createCompareNode: function () {
        this.cleanCompareNode()
        var comparelist = []
        var hidelist = []
        var desposition = []
        var comparedata = gZJHMgr.getOpData()

        //
        var pos1 = gZJHMgr.GetNodePos(cc.find("node_start_com_left", this.m_oComPanel))
        var pos2 = gZJHMgr.GetNodePos(cc.find("node_start_com_right", this.m_oComPanel))

        //
        var showpkeffct = cc.callFunc(function () {
            //var effect = createEffect("effect_mutil/ZhaJinHua/1201/ZhaJinHua_PK.csb", false)
            var nodeE = cc.find("compareEffect", this.m_oComPanel)
            nodeE.zIndex = 100;
            var effect = nodeE.getComponent(cc.Animation);//createEffect("effect_mutil/ZhaJinHua/1201/ZhaJinHua_PK.csb", false)
            nodeE.setOpacity(255);
            nodeE.setPosition(cc.v2(0, 0))
            effect.play("zjh_compareEffect");
        }.bind(this)
        )

        var showpkeffctNew = cc.callFunc(function () {
            var effect = this.m_oComPanel.getComponent(cc.Animation);
            // effect.setOpacity(255);
            effect.play("zjh_PK");
            AudioManager.playSound(zjhAudioDir + "13029");
        }.bind(this)
        )

        var showloseeffct = cc.callFunc(function () {
            if (comparedata.value == 0) {
                var nodeE = cc.find("compareEffect", this.m_oComPanel)
                nodeE.zIndex = 100;
                //var effect = createEffect("effect_mutil/ZhaJinHua/1201/ZhaJinHK_daoguang.csd.csb", false)
                var effect = nodeE.getComponent(cc.Animation);
                effect.play("zjh_light");
                nodeE.setPosition(pos1)
                AudioManager.playSound(zjhAudioDir + "13030");
                // this.m_oComPanel.addChild(effect)
                // this.m_CompareNode.push( effect)
            } else {

                for (var k = 0; k < comparelist.length; k++) {
                    var psite = comparelist[k];
                    if (psite) {
                        var nodeE = cc.find("compareEffect", this.m_oComPanel)
                        nodeE.zIndex = 100;
                        var effect = nodeE.getComponent(cc.Animation);
                        effect.playAdditive("zjh_light");
                        // var effect = createEffect("effect_mutil/ZhaJinHua/1201/ZhaJinHK_daoguang.csd.csb", false)
                        nodeE.setPosition(gZJHMgr.GetNodePos(psite))
                        psite.setOpacity(OPACITY_DIS)
                        // this.m_oComPanel.addChild(effect)
                        // this.m_CompareNode.push( effect)
                    }
                }
            }
        }.bind(this)
        )

        var delay1 = cc.delayTime(0.9)
        var delay2 = cc.delayTime(0.8)

        var showend = cc.callFunc(function () {
            for (var k = 0; k < comparelist.length; k++) {
                var panel = comparelist[k];
                if (k == 1) {

                    panel.runAction(cc.sequence(cc.moveTo(0.2, desposition[k]), cc.callFunc(function () {
                        this.m_oComPanel.active = false;
                        for (var k = 0; k < hidelist.length; k++) {
                            var node = hidelist[k];
                            node.active = (true)
                        }
                        if (comparedata.value == 0) {
                            //操作者失败
                            var player = gZJHMgr.getPlayerBySite(comparedata.site)
                            var index = this.getIndexByTag(comparedata.site)
                            if (this.m_playerCardNode[index]) {

                                this.m_playerCardNode[index].lookCard(player)
                                // this.m_oPlayerSiteList[index].getChildByName("loseimg").active = (true)
                            }
                        }
                    }.bind(this)
                    )))
                } else {

                    panel.runAction(cc.moveTo(0.2, desposition[k]))
                }
            }

        }.bind(this)
        )

        this.m_oComPanel.active = (true)
        for (var k = 0; k < gZJHMgr.getCompareList().length; k++) {
            var site = gZJHMgr.getCompareList()[k];
            var player = gZJHMgr.getPlayerBySite(site)
            var index = this.getIndexByTag(site)
            if (player && this.m_oPlayerSiteList[index]) {

                var playercomsite = cc.instantiate(this.m_oPlayerSiteList[index])
                this.createPlayerhead(playercomsite, player)
                this.m_oComPanel.addChild(playercomsite)
                var pos = gZJHMgr.NodePointToDesNodePoint(playercomsite, this.m_oComPanel)
                playercomsite.setPosition(pos)
                playercomsite.setOpacity(255)
                this.m_oPlayerSiteList[index].active = false;
                if (site == comparedata.site) {

                    comparelist.unshift(playercomsite)
                    desposition.unshift(pos)
                } else {

                    comparelist.push(playercomsite)
                    desposition.push(pos)
                }
                hidelist.push(this.m_oPlayerSiteList[index])
                this.m_CompareNode.push(playercomsite)
            }
        }

        //
        var req = null
        var dislen = 165
        // if (comparedata.value == 0) {

        req = cc.sequence(cc.moveTo(0.3, pos1), /*showpkeffct,*/showpkeffctNew, delay1, showloseeffct, delay2, showend)
        // } else {

        //     req = cc.sequence(cc.moveTo(0.3, pos1), /*showpkeffct,*/showpkeffctNew, delay1, showend)
        // }
        //dump(comparelist, "游戏比较对象")
        for (var k = 0; k < comparelist.length; k++) {
            var panel = comparelist[k];
            if (k == 0) {
                panel.runAction(req)
            } else {

                panel.runAction(cc.moveTo(0.3, cc.v2(pos2.x + dislen * (k - 1), pos2.y)))
            }
        }
    },

    compareAllEffect: function () {
        var comparedata = gZJHMgr.getOpData()
        var player = gZJHMgr.getPlayerBySite(comparedata.site)
        if (player.sex == gZJHMgr.SexManOrWuman.WUMAN) {
            AudioManager.playSound(zjhAudioDir + "13006");
            //gAudioManger:playAudio(13006)
        } else {
            AudioManager.playSound(zjhAudioDir + "13016");
            //gAudioManger:playAudio(13016)
        }
        if (comparedata.op == gZJHMgr.ZJHOptType.dobetall) {

            var effectNode = cc.find("effectNode", this.m_oPanelMid)
            effectNode.active = true;
            var showeffect1 = cc.callFunc(function () {

                var effect = effectNode.getComponent(cc.Animation);
                effectNode.zIndex = var_ORDER.Clip_order
                effect.play("zjh_guzhuyizhi");

                // effect_guzhu = createEffect("effect_mutil/ZhaJinHua/1201/ZhaJinHua_guzhuyizhi.csb", false)
                // effect_guzhu.setPosition(gZJHMgr.GetNodePos(effect_guzhu))
                // this.m_oPanelMid.addChild(effect_guzhu, var_ORDER.Clip_order)
            }.bind(this)
            )
            var removeeffect1 = cc.callFunc(function () {
                // effect_guzhu.removeFromParent()
                effectNode.active = false;
            }.bind(this)
            )

            //
            var delay1 = cc.delayTime(1.5)
            var createcomparenode = cc.callFunc(
                function () {
                    this.createCompareNode()
                }.bind(this)
            )

            //
            this.m_oPanelMid.stopAllActions()
            this.m_oPanelMid.runAction(cc.sequence(showeffect1, delay1, removeeffect1, createcomparenode))
        }
    },

    rewardPlayerAction: function () {
        var playgolddata = gZJHMgr.getPlayGold()
        if (playgolddata == null || playgolddata.site == null) {

            //dump(playgolddata, "错误位置")
            return
        }
        var index = this.getIndexByTag(playgolddata.site)
        if (index == 0) {
            cc.log("错误位置****&&&& site" + playgolddata.site)
            return
        }
        var gold = data_zhajinhuaRoom.items[gZJHMgr.getRoomType() - 1].tip
        var chipdata = gZJHMgr.getChipsShowData(gold)

        for (var k = 0; k < chipdata.length; k++) {
            var vardata = chipdata[k];
            var chipnode = CChipNodeZJH(vardata.ty, vardata.str)
            chipnode.setPosition(gZJHMgr.GetNodePos(this.m_oPlayerSiteList[index]))
            this.m_oPanelMid.addChild(chipnode, var_ORDER.Clip_order)
            chipnode.moveRemove(gZJHMgr.GetNodePos(this._armatureDisplay))
        }
        //gAudioManger:playAudio(13014)
        AudioManager.playSound(zjhAudioDir + "13014");
        this.updatePlayerClips()
    },

    //////////////////
    //按钮回调
    //////////////////
    // menuCallBack: function (sender, event) {
    //     this.m_oMenuDirImg.setFlippedY(true)
    //     var windowback = function () {
    //         this.m_oMenuDirImg.setFlippedY = false;
    //     }
    //     // var window = WindowManagerWindow(CZhaJinHuaMenuLayer, WindowManager.WindowLevel.MIDDLE, true)
    //     // window.registercallFunc(windowback)
    // },


    helpCallBack: function (sender, event) {
        //AudioManager.playSound(AudioPath.Sound_ClickedButton);
    },

    // rewardCallBack: function (sender, event) {
    //         //gAudioManger:playAudio(1003)
    //         // this._armatureDisplay.getAnimation().play("kiss", 1)
    //         var msg_zhajinhua_dashang_2s = []
    //         SendNetMsg(protoCmd.CMD_msg_zhajinhua_dashang_2s, msg_zhajinhua_dashang_2s)
    // },

    autoAddClipCallBack: function () {
        //AudioManager.playSound(AudioPath.Sound_ClickedButton);
        //gAudioManger:playAudio(1003)
        // var window = WindowManagerWindow(AutoAddClipsLayer, WindowManager.WindowLevel.MIDDLE_TOP, true, true)
        // if (window) {

        //     window: setPlayerData(gZJHMgr.getMineData())
        // }

        this.settingWindow = cc.instantiate(this.autoChipSettingPrefab);
        this.m_oPanelUp.addChild(this.settingWindow);
        var script = this.settingWindow.getComponent("AutoAddClipsWindow");
        script.setPlayerData(gZJHMgr.getMineData())
    },

    addBetCallBack: function (sender, event) {
        //gAudioManger:playAudio(1003)
        //AudioManager.playSound(AudioPath.Sound_ClickedButton);
        var tag = sender.target.getTag()
        zjh_msg_send.requestOp2s(2, tag);
        this.m_oPlayerBetOperation.active = false;

    },

    touchStartBtn: function (sender, event) {
        //AudioManager.playSound(AudioPath.Sound_ClickedButton);
        //gAudioManger:playAudio(1003)
        cc.log("发送准备消息")
        zjh_msg_send.requestReady();
    },


    giveupCallBack: function (sender, event) {
        //AudioManager.playSound(AudioPath.Sound_ClickedButton);
        //gAudioManger:playAudio(1003)
        zjh_msg_send.requestOp2s(0, 0);
        cc.log("发送弃牌消息")
    },

    compareCallBack: function (sender, event) {
        //gAudioManger:playAudio(1003)
        //AudioManager.playSound(AudioPath.Sound_ClickedButton);
        var tag = sender.target.getTag()
        var op = 0
        var minedata = gZJHMgr.getMineData()
        if (minedata.cardState == gZJHMgr.CardStateType.lock_card) {

            if (gZJHMgr.getMineData().clips < gZJHMgr.getMinClip() / 2) {

                op = 4  //4孤注一掷
            } else {

                op = null
            }
        } else {

            if (gZJHMgr.getMineData().clips < gZJHMgr.getMinClip()) {

                op = 4  //4孤注一掷
            } else {

                op = null
            }
        }
        if (op != null) {

            //dump(msg_zhajinhua_op_2s, "孤注一掷")
            //SendNetMsg(protoCmd.CMD_msg_zhajinhua_op_2s, msg_zhajinhua_op_2s)
            zjh_msg_send.requestOp2s(op, 0);
        } else {

            this.selectCompPlayer(true)
        }
    },

    addChipCallBack: function (sender, event) {
        //gAudioManger:playAudio(1003)
        //AudioManager.playSound(AudioPath.Sound_ClickedButton);
        var tag = sender.target.getTag()
        this.m_oPlayerBetOperation.active = (!this.m_oPlayerBetOperation.active)
        this.setAddBetPanel()
    },

    followCallBack: function (sender, event) {
        //gAudioManger:playAudio(1003)
        //AudioManager.playSound(AudioPath.Sound_ClickedButton);
        var tag = sender.target.getTag()
        if (tag == FOLLOW_TAG_T.ALONG_FOLLOW) {
            var isckd = this.m_oCheckFollow.getComponent(cc.Toggle).isChecked;
            this.m_oCheckFollow.getComponent(cc.Toggle).isChecked = (!isckd)
        } else {

            var value = 0
            var minedata = gZJHMgr.getMineData()
            if (minedata.cardState == gZJHMgr.CardStateType.lock_card) {

                value = gZJHMgr.getMinClip() / 2
            } else {

                value = gZJHMgr.getMinClip()
            }
            zjh_msg_send.requestOp2s(2, value);
            //dump(msg_zhajinhua_op_2s, "发送跟注消息")
        }
    },

    lookcardCallBack: function (sender, event) {
        //gAudioManger:playAudio(1003)
        //AudioManager.playSound(AudioPath.Sound_ClickedButton);
        var op = gZJHMgr.ZJHOptType.lookcard
        zjh_msg_send.requestOp2s(op, 0);
        this.m_oLookCardBtn.active = false;
        cc.log("发送看牌消息")
    },

    selectPlayerFunc: function (event) {
        //gAudioManger:playAudio(1003)
        //AudioManager.playSound(AudioPath.Sound_ClickedButton);
        var site = event.detail.node.getTag()
        this.selectCompPlayer(false);
        zjh_msg_send.requestOp2s(3, site);
        //dump(msg_zhajinhua_op_2s, "选中比牌玩家")
    },

    compPlayer: function (site) {
        this.selectCompPlayer(false);
        zjh_msg_send.requestOp2s(3, site);
        //dump(msg_zhajinhua_op_2s, "选中比牌玩家")
    },

    /**
     * 返回大厅
     * 
     */
    gobackHall: function () {
        zjh_msg_send.requestQuitGame();
        //cc.dd.SceneManager.replaceScene("yyl_hall");
        //AudioManager.playSound(AudioPath.Sound_ClickedButton);
        this.menuLayer.active = false
    },
    /**
     * 游戏菜单
     * 
     */
    onGameMenu: function () {
        //jlmj_audio_mgr.com_btn_click();
        if (this.rulePage.active) {
            this.rulePage.active = !this.rulePage.active;
        } else {
            this.menuLayer.active = !this.menuLayer.active;
        }

        // if (this.menuLayer.active) {
        //     this.menuAni.play("menuAni");
        // }
        //AudioManager.playSound(AudioPath.Sound_ClickedButton);
    },

    onRuleCallBack: function () {
        this.rulePage.active = !this.rulePage.active;
        //AudioManager.playSound(AudioPath.Sound_ClickedButton);
    },


    ///for test func

    testCommpare: function () {
        //this.selectCompPlayer(true);
        // this.m_oComPanel.active = (true)
        // var nodeE = cc.find("compareEffect", this.m_oComPanel);
        // var effect = nodeE.getComponent(cc.Animation);//createEffect("effect_mutil/ZhaJinHua/1201/ZhaJinHua_PK.csb", false)
        // nodeE.setOpacity(255);
        // effect.play("zjh_compareEffect");

        // setTimeout(function() {
        //     effect.play("zjh_light");
        // }.bind(this), 1000);

        this.showRewardClip(2, 1000)

    },
});