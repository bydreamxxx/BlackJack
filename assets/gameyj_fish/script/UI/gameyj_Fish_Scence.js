//create by wj 2019/09/18
const size = cc.winSize;
var gFishMgr = require('FishManager').FishManager.Instance();
const FishType = require('FishTypeCfg');
var playerManager = require('FishPlayerManager').CFishPlayerManager.Instance();
var playerEvent = require('FishPlayerManager').Fish_PlayerEvent;
var playerEd = require('FishPlayerManager').Fish_PlayerED;
var CFish = require('FishNode').CFish;
const data_fishtype = require('fishtype');

var HallCommonObj = require('hall_common_data');
var HallCommonEd = HallCommonObj.HallCommonEd;
var HallCommonEvent = HallCommonObj.HallCommonEvent;

var AppCfg = require('AppConfig');

var SysEvent = require("com_sys_data").SysEvent;
let SysED = require("com_sys_data").SysED;



var g_RotOffset = 0.05;
var g_RotRangeLen = Math.PI + g_RotOffset * 2 * Math.PI;
var g_paoTaiStartDir = [- Math.PI * g_RotOffset, Math.PI * (1 + g_RotOffset), Math.PI * (1 + g_RotOffset), - Math.PI * g_RotOffset];
var g_paoTaiRotOffset = [[1, - 0.5], [1, 0.5], [1, 0.5], [1, -0.5]]


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
        m_tPlayerInfo: [], //玩家节点
        m_autoBet: false, //自动发射子弹
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
        m_oCaoXiSkeleton: sp.SkeletonData,
        m_oCoinPanle: cc.Node,
        m_oFoldCoinImg: cc.SpriteFrame,
        m_oQuitPopNode: cc.Node,
        m_nNodeTag: 0,
        m_nFoldNodeIndexList: [],
        m_resFoldScroe: { default: [], type: cc.Prefab },
        m_tPaoTaiPos: [],
        m_oSpecialNode: cc.Node,
        m_bAmi: true,
    },

    /**
     * 返回按键
     * @param event
     */
    onKeyDown: function (event) {
        switch (event.keyCode) {
            case cc.KEY.back: {
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
        //cc.dd.UIMgr.openUI("gameyj_fish/prefabs/fish_loading_ui", function(prefab){});

        playerEd.addObserver(this);
        HallCommonEd.addObserver(this);
        SysED.addObserver(this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);

        gFishMgr.setMainUI(this.node.getComponent('gameyj_Fish_Scence')); //设置好管理器的主界面数据

        var Anim = cc.dd.Utils.seekNodeByName(this.node, 'aimBtn').getChildByName('mzAct');
        Anim.active = true;
        Anim.getComponent(cc.Animation).play();

        this.m_oFishPool.on(cc.Node.EventType.TOUCH_START, this.onClickFishPool, this); //开始点击
        this.m_oFishPool.on(cc.Node.EventType.TOUCH_MOVE, this.onClickFishPool, this); //移动
        this.m_oFishPool.on(cc.Node.EventType.TOUCH_END, this.onClickFishPool, this); //点击结束
        this.m_oFishPool.on(cc.Node.EventType.TOUCH_CANCEL, this.onClickFishPool, this); //点击取消

        for (var i = 0; i < 4; i++) {
            var playerNode = {};
            playerNode.root = cc.dd.Utils.seekNodeByName(this.node, "Panel_Player" + i); //玩家节点根节点
            playerNode.paoTaiCnt = cc.dd.Utils.seekNodeByName(playerNode.root, 'Panel_PaoTai'); //炮台
            playerNode.textBet = cc.dd.Utils.seekNodeByName(playerNode.root, 'betNum'); //下注倍率
            playerNode.textCoin = cc.dd.Utils.seekNodeByName(playerNode.root, 'coin'); //玩家身上金币 
            playerNode.textNick = cc.dd.Utils.seekNodeByName(playerNode.root, 'name'); //玩家名字
            playerNode.headIcon = cc.dd.Utils.seekNodeByName(playerNode.root, 'headNode'); //玩家头像
            playerNode.betJia = cc.dd.Utils.seekNodeByName(playerNode.root, 'by_btn_jia1');//增加倍率
            playerNode.betJian = cc.dd.Utils.seekNodeByName(playerNode.root, 'by_btn_jian1');//减小倍率
            playerNode.trackLock = cc.dd.Utils.seekNodeByName(playerNode.root, 'by_img_zzsd');//追踪标记
            playerNode.btnMz = cc.dd.Utils.seekNodeByName(playerNode.root, 'by_mz_bt'); //瞄准按钮(挂机)
            playerNode.wanTag = cc.dd.Utils.seekNodeByName(playerNode.root, 'by_zi01');//万数字标签
            playerNode.yiTag = cc.dd.Utils.seekNodeByName(playerNode.root, 'by_zi02');//亿数字标签
            playerNode.headClick = cc.dd.Utils.seekNodeByName(playerNode.root, 'headclick');//头像点击
            playerNode.playerInfo = cc.dd.Utils.seekNodeByName(playerNode.root, 'player_Info_node');
            playerNode.siteShine = cc.dd.Utils.seekNodeByName(playerNode.root, 'siteShine'); //炮台闪烁
            playerNode.energyLeftText = cc.dd.Utils.seekNodeByName(playerNode.root, 'timeText');//倒计时
            // var startPos = playerNode.paoTaiCnt.parent.convertToWorldSpaceAR(playerNode.paoTaiCnt.getPosition()); //获取相对世界坐标
            // gFishMgr.setBulletPos(i, this.m_oFishPool.convertToNodeSpaceAR(startPos), startPos); //设置炮台在鱼池内的坐标
            // this.m_tPaoTaiPos[i] = playerNode.paoTaiCnt.getPosition();

            playerNode.wanTag.active = false;
            playerNode.yiTag.active = false;
            playerNode.m_tCoinNodeInfo = [];

            playerNode.root.active = false;
            this.m_tPlayerInfo[i] = playerNode;
        }

        cc.director.getCollisionManager().enabled = true;
        //开启绘制区域
        cc.director.getCollisionManager().enabledDebugDraw = false;
        if (AudioManager._getLocalMusicSwitch())
            this.m_nMusicId = AudioManager.playMusic(FishType.fishAuidoPath + '7001');

        this.updateInit(); //游戏玩家初始化
    },

    onDestroy: function () {
        playerEd.removeObserver(this);
        HallCommonEd.removeObserver(this);
        SysED.removeObserver(this);

    },

    onEnter: function () {//游戏初始化
        for (var nSite = 1; nSite < 5; nSite++) {
            if (nSite == gFishMgr.getMysite()) {
                var playerNode = this.m_tPlayerInfo[nSite - 1];
                playerNode.betJia.parent.active = true; //加倍率
                playerNode.betJian.parent.active = true; //减倍率
                playerNode.btnMz.active = true; //挂机瞄准
                playerNode.siteShine.active = true;
                playerNode.siteShine.runAction(cc.repeat(cc.sequence(cc.fadeIn(0.6), cc.fadeOut(0.6)), 8));
            }

            ////////////锁定气泡///////////
            if (!gFishMgr.getIsInit()) {
                var playerNode = this.m_tPlayerInfo[nSite - 1];
                if (playerNode) {
                    var startPos = playerNode.paoTaiCnt.parent.convertToWorldSpaceAR(playerNode.paoTaiCnt.getPosition()); //获取相对世界坐标
                    var index = gFishMgr.toClientSite(nSite) - 1;
                    gFishMgr.setBulletPos(index, this.m_oFishPool.convertToNodeSpaceAR(startPos), startPos); //设置炮台在鱼池内的坐标
                    this.m_tPaoTaiPos[nSite - 1] = playerNode.paoTaiCnt.getPosition();

                    playerNode.trackQiPaoCnt = new cc.Node(); //气泡根节点
                    playerNode.trackQiPao = [];//气泡节点数组
                    for (var i = 0; i < FishType.qiPaoMax; i++) {
                        var qipaoNode = new cc.Node();
                        var qipaoSp = qipaoNode.addComponent(cc.Sprite);
                        if (nSite == gFishMgr.getMysite())
                            qipaoSp.spriteFrame = this.m_tQiPaoSprite[0]; //气泡资源设置
                        else
                            qipaoSp.spriteFrame = this.m_tQiPaoSprite[1];

                        qipaoNode.setPosition(cc.v2(FishType.qiPaoOffset + i * FishType.qiPaoDistance, 0)); //设置位置点
                        qipaoNode.setScale(FishType.qiPaoScale.min + i * (FishType.qiPaoScale.max - FishType.qiPaoScale.min) / FishType.qiPaoMax);//大小设置
                        playerNode.trackQiPaoCnt.addChild(qipaoNode);
                        playerNode.trackQiPao.push(qipaoNode);
                    }

                    //var startPos = playerNode.paoTaiCnt.parent.convertToWorldSpaceAR(playerNode.paoTaiCnt.getPosition()); //获取相对世界坐标
                    playerNode.trackQiPaoCnt.zIndex = FishType.ZorderInRoot.qiPao
                    playerNode.trackQiPaoCnt.setPosition(playerNode.paoTaiCnt.getPosition());//this.node.convertToNodeSpaceAR(startPos))
                    playerNode.trackQiPaoCnt.active = false;
                    playerNode.paoTaiCnt.parent.addChild(playerNode.trackQiPaoCnt);

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
                    this.updateOnePlayerBetTimes(player.userId, playerGameData.bet);
                    this.updateOnePlayerGold(nSite); //更新玩家金币
                }
            }

        }
        if (!gFishMgr.getIsInit())
            gFishMgr.setInit();
    },

    updateInit: function () {//初始化界面
        this.updatePlayerInfo(); //初始化玩家信息
    },

    updatePlayerInfo: function () {//初始化玩家信息
        for (var i = 1; i <= 4; i++)
            this.updateOnePlayerInfo(i);
    },

    updateOnePlayerInfo: function (nSite) {//根据玩家座位更新玩家信息
        var player = playerManager.findPlayerByUserPos(nSite); //获取玩家信息
        if (player) {
            var playerData = player.getPlayerCommonInfo(); //获取玩家通用数据
            if (playerData) {
                var playerNode = this.m_tPlayerInfo[nSite - 1]; //获取玩家座位节点
                if (playerNode) {
                    playerNode.root.active = true;
                    playerNode.textNick.getComponent(cc.Label).string = cc.dd.Utils.substr(playerData.name, 0, 6); //设置玩家名字
                    playerNode.headIcon.getComponent('klb_hall_Player_Head').initHead(playerData.openId, playerData.headUrl, 'fish_player_init'); //玩家头像
                    playerNode.textCoin.getComponent(cc.Label).string = this.convertChipNum(playerData.coin, 2);
                    playerNode.textBet.getComponent(cc.Label).string = 0; //设置炮弹倍率
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

    updateOnePlayerGold: function (nSite) {//更新金币显示
        var playerNode = this.m_tPlayerInfo[nSite - 1];
        if (playerNode == null)
            return;
        var player = playerManager.findPlayerByUserPos(nSite);
        if (player == null)
            return;

        var playerData = player.getPlayerGameInfo(); //获取游戏数据
        if (playerData) {
            playerNode.textCoin.getComponent(cc.Label).string = this.convertChipNum(playerData.coin, 2);
            playerNode.textCoin.parent.active = true;
            if (playerData.coin > 10000 && playerData.coin < 100000000) {
                playerNode.wanTag.active = true;
                playerNode.yiTag.active = false;
            } else if (playerData.coin >= 100000000) {
                playerNode.wanTag.active = false;
                playerNode.yiTag.active = true;
            } else {
                playerNode.wanTag.active = false;
                playerNode.yiTag.active = false;
            }

            if (nSite == gFishMgr.getMysite) {
                var roomCfg = gFishMgr.getRoomCfg();
                if (playerData.coin < playerData.bet && playerData.coin >= roomCfg.bet_min) {
                    for (var gold = playerData.bet; gold > roomCfg.bet_min; gold -= roomCfg.room_change) { //自动调节档位
                        if (gold > playerData.gold)
                            gFishMgr.setBetTimes(2); //发送加减档位协议
                    }

                }
            }

        }
    },

    setShake: function (shake) {//震屏幕
        this.m_nShake = Math.max(shake, this.m_nShake);
        this.m_fShakeTime = this.m_fShakeTime || 0;
    },

    showCaoXi: function () {//显示潮汐动画
        var tableLen = this.m_tBgSpriteList.length;
        var selIndex = this.m_nCurBgIndex + parseInt(Math.random() * (tableLen - 1), 10);
        if (selIndex == this.m_nCurBgIndex)
            selIndex += 1;
        selIndex = (selIndex) % tableLen;
        this.m_bgImgeSpriteFrame = this.m_tBgSpriteList[selIndex]; //新的背景图

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

        this.m_caoXiNode = new cc.Node;
        var ske = this.m_caoXiNode.addComponent(sp.Skeleton);
        ske.skeletonData = this.m_oCaoXiSkeleton;
        ske.clearTracks();
        ske.defaultSkin = 'default';
        ske.defaultAnimation = 'chao';
        ske.setAnimation(0, 'chao', false);
        this.m_oFishPoolBg.addChild(this.m_caoXiNode);
        this.m_caoXiNode.setPosition(cc.v2(640, 0));
        this.m_caoXiNode.zIndex = 200;
        this.m_caoXiNode.setOpacity(100);
        this.m_fRunCaoXi = FishType.caoXiActTime;


        AudioManager.stopMusic();
        this.playAudio(7017, false, 1);
    },

    onCaoXiEnd: function () {
        AudioManager.playMusic(FishType.fishAuidoPath + '7001');
    },

    ///////////////////////////////金币处理begin//////////////////////////////////////////////
    showGoldNum: function (fishPos, goldNum) {
        if (goldNum == 0)
            return;
        var goldTemp = cc.resources.get('gameyj_fish/prefabs/coinNumNode', cc.Prefab);
        var goldNode = cc.instantiate(goldTemp); //金币节点
        if (gFishMgr.m_bFilp)
            fishPos = fishPos.mul(-1)
        goldNode.setPosition(fishPos);
        goldNode.zIndex = 2;
        goldNode.setScale(1);
        goldNode.getComponent(cc.Label).string = goldNum;
        goldNode.runAction(cc.sequence(cc.scaleTo(0.1, 2), cc.scaleTo(0.1, 1)));
        goldNode.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(function () {
            goldNode.removeFromParent(true);
        })));
        this.m_oCoinPanle.addChild(goldNode);
    },

    showCoin: function (dataInfo) {//金币动画
        if (dataInfo == null)
            return;
        var player = playerManager.findPlayerByUserId(dataInfo.userId);
        if (!player)
            return;
        var playerComData = player.getPlayerCommonInfo();
        if (!playerComData)
            return;

        var playerNode = this.m_tPlayerInfo[playerComData.pos - 1];
        if (playerNode) {
            if (playerNode.m_tCoinNodeInfo.length == 0) {
                var self = this;
                playerNode.m_tCoinNodeInfo.push(dataInfo);//保存数据
                this.m_oCoinPanle.runAction(cc.sequence(cc.delayTime(FishType.dieActTime), cc.callFunc(function () {
                    self.popCoinNodeList(dataInfo.userId);
                }
                )));
            } else
                playerNode.m_tCoinNodeInfo.push(dataInfo);//保存数据
        }


        // ////////////暂时的金币更新///////////////
        //this.updateOnePlayerGold(playerComData.pos);
    },

    popCoinNodeList: function (userId) {//取出最先的一次保存的金币节点
        var player = playerManager.findPlayerByUserId(userId);
        if (player == null)
            return;
        var playerData = player.getPlayerCommonInfo();
        if (playerData == null)
            return;
        var playerNode = this.m_tPlayerInfo[playerData.pos - 1];
        if (playerNode.m_tCoinNodeInfo.length == 0)
            return;
        var coinNodeInfo = playerNode.m_tCoinNodeInfo.shift();
        var userId = coinNodeInfo.userId;
        var totalSrcCoinNum = coinNodeInfo.totalSrcCoinNum;
        var hitFishs = coinNodeInfo.hitFish;
        var totalGoldNum = coinNodeInfo.totalGoldNum;
        var bulletpos = coinNodeInfo.pos;

        var nSite = playerData.pos - 1; //玩家座位号

        var toPos = gFishMgr.getBulletPosInWorld(gFishMgr.toSeverSite(playerData.pos) - 1); //玩家座位位置点
        toPos = this.m_oCoinPanle.convertToNodeSpaceAR(toPos);
        var scaleCoinNum = Math.min(1, 100 / totalSrcCoinNum);
        var totalCoinNum = 0;
        for (var fish of hitFishs) {
            var coinNum = Math.max(1, Math.min(50, fish.fish_bet_times * scaleCoinNum));//创建金币量
            totalCoinNum += coinNum;
            if (fish.worldPos) {
                var sz = fish.size;
                var startPos = fish.worldPos; //初始点
                if (gFishMgr.m_bFilp)
                    startPos = fish.worldPos.mul(-1);
                var coinTemp = [];
                if (fish.fish_bet_times > 10)
                    coinTemp = cc.resources.get('gameyj_fish/prefabs/coinEffect10', cc.Prefab);
                else
                    coinTemp = cc.resources.get('gameyj_fish/prefabs/coinEffect1', cc.Prefab);
                for (var i = 0; i < coinNum; i++) {
                    var coinNode = cc.instantiate(coinTemp); //创建金币节点
                    coinNode.active = true;
                    coinNode.setRotation(parseInt(Math.random() * 4, 10) * 90);
                    var r = parseInt(Math.random() * sz, 10);
                    var angle = parseInt(Math.random() * 360) * Math.PI * 2 / 360;
                    var pos = cc.v2(Math.cos(angle), Math.sin(angle)).mul(r);
                    coinNode.setPosition(pos.add(startPos)); //设置位置
                    this.m_oCoinPanle.addChild(coinNode);
                    this.m_tCoinNode.push(coinNode);

                    coinNode.runAction(cc.sequence(cc.delayTime(FishType.coinStopActTime), cc.moveTo(FishType.coinMoveActTime, toPos), cc.callFunc(function () {
                        var node = this.m_tCoinNode[this.m_nIndex];
                        node.removeFromParent(true);
                        this.m_nIndex++;
                        if (this.m_tCoinNode.length == this.m_nIndex) {
                            this.m_nIndex = 0;
                            this.m_tCoinNode.splice(0, this.m_tCoinNode.length);
                        }
                    }.bind(this))))
                }
            }
        }
        if (totalSrcCoinNum >= 100)
            this.showBingo(userId, bulletpos, totalGoldNum);//显示bingo动画

        var self = this;
        this.m_oCoinPanle.runAction(cc.sequence(cc.delayTime(FishType.dieActTime), cc.callFunc(function () {
            var player = playerManager.findPlayerByUserId(coinNodeInfo.userId);
            if (!player) {
                self.popCoinNodeList(coinNodeInfo.userId);
                return;
            }
            var playerComData = player.getPlayerCommonInfo();
            if (playerComData)
                self.showFoldCoin(playerComData.pos, totalCoinNum, totalGoldNum);
            self.popCoinNodeList(player.userId);

        }
        )));
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

    showBingo: function (userId, bulletPos, goldNum) {//展示bingo
        var player = playerManager.findPlayerByUserId(userId);
        if (!player)
            return;
        var playerComData = player.getPlayerCommonInfo();
        if (!playerComData)
            return;
        var bingoEffect = cc.resources.get('gameyj_fish/prefabs/bingoEffect', cc.Prefab);
        if (bingoEffect) {
            var bingoNode = cc.instantiate(bingoEffect);
            var headNode = cc.dd.Utils.seekNodeByName(bingoNode, 'bingohead');
            if (headNode)
                headNode.getComponent('klb_hall_Player_Head').initHead(playerComData.openId, playerComData.headUrl, 'fish_bingo_player_init'); //玩家头像
            var num = cc.dd.Utils.seekNodeByName(bingoNode, 'bingoNum');
            if (num)
                num.getComponent(cc.Label).string = goldNum;
            var Anim = bingoNode.getComponent(cc.Animation)
            Anim.play();
            Anim.on('finished', function () {
                bingoNode.removeFromParent(true);
            })
            bingoNode.setPosition(bulletPos);
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

        var playerData = gFishMgr.getMyData(); //获取自己的游戏数据
        if (this.m_autoBet || (playerData && playerData.lockFishID > 0 || this.m_bClick)) {
            if (playerData.coin < playerData.bet) {//身上金币少于下注值
                if (playerData.foldCoinNum == 0 && gFishMgr.getMyBulletNums()) {
                    this.playAudio(7007, false, 1);
                    this.setLockFish(this.m_nSite, -1);
                    this.stopGuaJi();
                    cc.dd.PromptBoxUtil.show('金币不足');
                    this.showBag();
                }
            } else {

                this.m_nAutoBetTime += dt;
                var betSpace = FishType.autoBetSpaceTime;
                if (playerData.buff_end_time >= new Date().getTime())//能量弹
                    betSpace = betSpace / 2;
                if (this.m_nAutoBetTime >= betSpace) { //子弹发射间隔时间
                    gFishMgr.Bet(playerData.betDir, playerData.lockFishID); //创建子弹
                    this.m_nAutoBetTime = 0; //时间差
                    this.m_bClick = false;
                }
            }
        }

        ///////////////////////锁定鱼操作/////////////////////////
        for (var i = 0; i < 4; i++) {
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
                                var startPos = gFishMgr.getBulletPos(i);
                                var fishArPos = lockInfo.fishArPos;
                                if (gFishMgr.m_bFilp)
                                    fishArPos = fishArPos.mul(-1);
                                var offset = fishArPos.sub(startPos);//获取鱼与子弹初始点差值向量
                                var distance = Math.sqrt(offset.x * offset.x + offset.y * offset.y);//向量长度
                                var qiPao = playerNode.trackQiPao;
                                var qipaoLen = distance - FishType.qiPaoOffset;
                                var needCount = Math.max(1, Math.min(Math.floor(qipaoLen / FishType.qiPaoDistance))); //获取需要多少个气泡
                                needCount = Math.min(needCount, qiPao.length);
                                for (var j = 0; j < needCount; j++) {
                                    qiPao[j].active = true;
                                    var position = cc.v2(j / needCount * qipaoLen + FishType.qiPaoOffset, 0);
                                    qiPao[j].setPosition(position);
                                }
                                for (var m = needCount; m < qiPao.length; m++)
                                    qiPao[m].active = false;
                            } else {
                                gFishMgr.setLockFish(i + 1, - 1);
                                playerNode.trackLock.active = false;
                                if (playerNode.trackQiPaoCnt)
                                    playerNode.trackQiPaoCnt.active = false;
                            }
                        } else {
                            gFishMgr.setLockFish(i + 1, - 1);
                            playerNode.trackLock.active = false;
                            if (playerNode.trackQiPaoCnt)
                                playerNode.trackQiPaoCnt.active = false;
                        }
                    }
                    this.updateOnePlayerBetTimes(player.userId, playerData.bet);//更新下注倍率
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
                AudioManager.playMusic(FishType.fishAuidoPath + '7016');
            }

        }
    },

    getFishPoolNode: function () {
        return this.m_oFishPool;
    },

    setAutoBet: function (bAuto) {//自动发射子弹
        this.m_autoBet = bAuto;
    },


    getBulletDir: function (nSite, worldPos) {//获取指定玩家位置的子弹朝向
        var startPos = gFishMgr.getBulletPosInWorld(gFishMgr.toSeverSite(nSite + 1) - 1); //获取子弹生成的世界坐标
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
        this.paoTaiDir(nSite, bulletDir); //炮台弧度值
        return bulletDir;
    },

    paoTaiDir: function (nSite, dir) {//炮台弧度值
        var playerNode = this.m_tPlayerInfo[nSite];

        var offset = g_paoTaiRotOffset[nSite];
        var paoDir = offset[0] * dir + offset[1] * Math.PI;

        playerNode.trackQiPaoCnt.setRotation(RadianToAngleOfUI(dir)); //气泡点旋转度；
        playerNode.paoTaiCnt.setRotation(RadianToAngleOfUI(paoDir)); //设置旋转角度；
        playerNode.paoTaiCnt.active = true;
        // this.paoTaiMoveAct(nSite, dir);
    },


    paoTaiMoveAct: function (nSite, dir) {//炮台发炮动画

        var playerNode = this.m_tPlayerInfo[nSite];
        var orPos = this.m_tPaoTaiPos[nSite];

        var startSpeed = cc.v2(Math.cos(dir), Math.sin(dir));
        var playerNode = this.m_tPlayerInfo[nSite];
        var endPos = orPos.sub(startSpeed.mul(10));
        playerNode.paoTaiCnt.runAction(cc.sequence(cc.moveTo(0.02, endPos), cc.delayTime(0.02), cc.moveTo(0.02, orPos)));

        var player = playerManager.findPlayerByUserPos(nSite + 1);

        if (gFishMgr.isThreeBullet(player.userId)) {
            var fireNode = playerNode.paoTaiCnt.getChildByName('fire02');
            if (fireNode) {
                fireNode.active = true;
                fireNode.getComponent(cc.Animation).play();
            }
        } else {
            var fireNode = playerNode.paoTaiCnt.getChildByName('fire01');
            if (fireNode) {
                fireNode.active = true;
                fireNode.getComponent(cc.Animation).play();
            }
        }
    },


    setLockFish: function (nSite, dataCfg) {//显示鱼被锁定的动画
        var playerNode = this.m_tPlayerInfo[nSite - 1];
        if (playerNode) {
            playerNode.trackLock.removeAllChildren(true); //删除锁定图标的所有节点
            if (dataCfg) {
                var fishImg = CFish.createFishLockNode(dataCfg, 110);
                fishImg.center = cc.v2(0, 0);
                playerNode.trackLock.addChild(fishImg);

                playerNode.trackLock.active = (dataCfg != null ? true : false);
                playerNode.trackQiPaoCnt.active = (dataCfg != null ? true : false);
            }
        }
    },

    createFishNetEffect: function (bThree, pos) {//创建渔网
        var netNode = null;
        if (bThree) {
            netNode = cc.resources.get('gameyj_fish/prefabs/fish_net_2', cc.Prefab);
        } else {
            netNode = cc.resources.get('gameyj_fish/prefabs/fish_net_1', cc.Prefab);
        }
        var netNodeImage = cc.instantiate(netNode);
        var anim = netNodeImage.getChildByName('net').getComponent(cc.Animation);
        anim.on('finished', function () {
            netNodeImage.removeFromParent(true);
        });
        netNodeImage.setPosition(pos); //设置网点
        netNodeImage.parent = this.m_oFishPool;
        return netNodeImage;
    },

    updateOnePlayerBetTimes: function (userId, bet) {//更新炮倍率显示
        var paotTaiImage = null;
        var bEnergy = gFishMgr.isEnergyBullet(userId); //是否为能量弹
        if (gFishMgr.isThreeBullet(userId)) {//是否为三子弹
            if (bEnergy)//能量弹
                paotTaiImage = this.paoTaiAtals.getSpriteFrame('by_img_p3_1'); //三炮台
            else
                paotTaiImage = this.paoTaiAtals.getSpriteFrame('by_img_p3');
        } else {
            if (bEnergy)
                paotTaiImage = this.paoTaiAtals.getSpriteFrame('by_img_p2_1'); //双炮台
            else
                paotTaiImage = this.paoTaiAtals.getSpriteFrame('by_img_p2');
        }

        var player = playerManager.findPlayerByUserId(userId); //通用玩家
        if (player) {
            var playerComData = player.getPlayerCommonInfo(); //游戏通用资源
            if (playerComData) {
                var playerNode = this.m_tPlayerInfo[playerComData.pos - 1];
                if (playerNode) {
                    playerNode.textBet.getComponent(cc.Label).string = bet; //设置炮弹倍率
                    playerNode.textBet.parent.active = true;
                    var childPao = playerNode.paoTaiCnt.getChildByName('paotaiSp');
                    if (childPao)
                        childPao.getComponent(cc.Sprite).spriteFrame = paotTaiImage; //设置炮台图片
                    playerNode.paoTaiCnt.active = true;
                    var playerGameData = player.getPlayerGameInfo();
                    if (playerGameData) {
                        if (userId == cc.dd.user.id) {//玩家自身数据
                            if (bEnergy) {
                                playerNode.betJian.getComponent(cc.Button).interactable = false; //不可点击减号
                                playerNode.betJia.getComponent(cc.Button).interactable = false; //不可点击加号
                                var operateNode = cc.dd.Utils.seekNodeByName(playerNode.headIcon, 'operatepb');
                                operateNode.active = true;
                                operateNode.getComponent('new_dsz_progressBar').playTimer(20, function () {
                                    operateNode.active = false;
                                }, parseInt((playerGameData.buff_end_time - new Date().getTime()) / 1000));
                            } else {
                                playerNode.betJian.getComponent(cc.Button).interactable = true; //可点击减号
                                playerNode.betJia.getComponent(cc.Button).interactable = true; //可点击加号
                                if (bet <= gFishMgr.getRoomCfg().bet_min)
                                    playerNode.betJian.getComponent(cc.Button).interactable = false; //不可点击减号
                                else if (bet >= gFishMgr.getRoomCfg().bet_max)
                                    playerNode.betJia.getComponent(cc.Button).interactable = false; //不可点击加号
                                else if (playerGameData.coin >= gFishMgr.getRoomCfg().bet_min)
                                    playerNode.betJian.getComponent(cc.Button).interactable = true; //可点击减号
                                else if (playerGameData.coin >= gFishMgr.getRoomCfg().bet_max)
                                    playerNode.betJia.getComponent(cc.Button).interactable = true; //可点击加号
                            }
                        }
                    }
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
        if (nSite == gFishMgr.getMysite())//自己锁定
            nodeSp.spriteFrame = this.m_tLockSprite[0];
        else
            nodeSp.spriteFrame = this.m_tLockSprite[1];
        nodeSd.setPosition(cc.v2(0, 0));
        return nodeSd;
    },


    onClickFishPool: function (event, data) {//点击鱼池
        if (gFishMgr == null)
            return;
        var nSite = gFishMgr.getMysite() - 1; //数据保存位置以1开始
        if (cc.Node.EventType.TOUCH_START == event.type) {//刚刚点击接触
            var clickPos = event.touch.getStartLocation(); //触点落下位置

            var dir = this.paoTaiFaceTo(nSite, clickPos); //炮台朝向
            this.setAutoBet(true); //设置为自动发射子弹
            this.m_bClick = true;
            // var fish = gFishMgr.getHitFish(cc.v2(clickPos.x, clickPos.y)); //获取是否点击了鱼
            // if(fish)//锁定了鱼
            //     gFishMgr.setLockFish(nSite + 1, fish.m_fishID);
            // else
            if (gFishMgr.getMyData().lockFishID != -1)
                gFishMgr.setLockFish(nSite + 1, -1);//未锁定鱼

            gFishMgr.getMyData().betDir = dir; //我自己的炮台朝向
        } else if (cc.Node.EventType.TOUCH_MOVE == event.type) {//触摸点移动
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
        if (parseInt(data) == 1)
            this.playAudio(7037, false, 1);
        else
            this.playAudio(7038, false, 1);
        gFishMgr.setBetTimes(parseInt(data));
    },

    onClickMz: function (event, data) {//瞄准功能
        this.playAudio(7002, false, 1);
        if (this.m_bGuaji) {
            this.m_bGuaji = false;
            var Anim = event.target.getChildByName('mzAct');
            Anim.active = false;
            gFishMgr.setLockFish(gFishMgr.getMysite(), -1);
        } else {
            this.m_bGuaji = true;
            var Anim = event.target.getChildByName('mzAct');
            Anim.active = true;
            Anim.getComponent(cc.Animation).play();
        }
    },

    stopGuaJi: function () {
        this.m_bGuaji = false;

        var playerNode = this.m_tPlayerInfo[gFishMgr.getMysite() - 1];
        var Anim = playerNode.btnMz.getChildByName('mzAct');
        Anim.active = false;
        gFishMgr.setLockFish(gFishMgr.getMysite(), -1);
    },

    onClickMenueBtn: function (event, data) {//点击菜单按钮
        this.playAudio(7002, false, 1);
        var Anim = event.target.getComponent(cc.Animation);
        if (Anim) {
            Anim.play();
            setTimeout(function () {
                if (Anim._nameToState[Anim._defaultClip.name].wrapMode == cc.WrapMode.Reverse)
                    Anim._nameToState[Anim._defaultClip.name].wrapMode = cc.WrapMode.Normal;
                else if (Anim._nameToState[Anim._defaultClip.name].wrapMode == cc.WrapMode.Normal)
                    Anim._nameToState[Anim._defaultClip.name].wrapMode = cc.WrapMode.Reverse;
            }, 600);
        }
    },

    onClickSettingBtn: function (event, data) {//打开设置界面
        this.playAudio(7002, false, 1);
        cc.dd.UIMgr.openUI("gameyj_fish/prefabs/gameyj_fish_setting_ui", function (node) { });
    },

    onClickFishTypeBtn: function (event, data) {//打开鱼类型界面
        this.playAudio(7002, false, 1);
        var fishList = data_fishtype.getItemList(function (item) {
            if (item.fish_show_type == 1)
                return item;
        })
        if (fishList != null && fishList.length != 0) {
            cc.dd.UIMgr.openUI("gameyj_fish/prefabs/gameyj_fish_type_ui", function (prefab) {
                var cpt = prefab.getComponent('gameyj_Fish_Type');
                cpt.onLoadList(fishList);
            });
        }
    },

    onClickFishSpecialBtn: function (event, data) {//打开特殊玩法
        this.playAudio(7002, false, 1);
        this.m_oSpecialNode.active = true;
    },

    onCloseFishSpecial: function (event, data) {
        this.playAudio(7002, false, 1);
        this.m_oSpecialNode.active = false;
    },

    onClickQuitBtn: function (event, data) {//退出游戏
        this.playAudio(7002, false, 1);
        this.m_oQuitPopNode.active = true;
        var desc = cc.dd.Utils.seekNodeByName(this.m_oQuitPopNode, 'desc');
        if (desc) {
            var text = desc.getComponent(cc.Label);
            var player = playerManager.findPlayerByUserId(cc.dd.user.id);
            if (!player)
                gFishMgr.quitGame();
            else {
                var playerData = player.getPlayerGameInfo();
                if (!playerData)
                    gFishMgr.quitGame();
                if (playerData.coin - player.startCoin == 0)
                    text.string = '您在本次游戏中没有盈利，是否现在就退出？';
                else if (playerData.coin - player.startCoin > 0)
                    text.string = '您在本次游戏中共盈利' + (playerData.coin - player.startCoin) + '，是否现在就退出？';

            }
        }
    },

    onClickConfirmQuit: function (event, data) {//确定退出
        this.playAudio(7002, false, 1);
        gFishMgr.quitGame();
    },

    onClickCancle: function (event, data) {//取消
        this.playAudio(7002, false, 1);
        this.m_oQuitPopNode.active = false;
    },

    clickShowPlayer: function (event, data) { //显示玩家信息
        var nSite = event.target._tag

        var node = this.m_tPlayerInfo[nSite - 1]
        if (node) {
            var player = playerManager.findPlayerByUserPos(nSite);
            if (player) {
                var playerData = player.getPlayerCommonInfo();
                if (!playerData)
                    return
                node.playerInfo.getChildByName('name').getComponent(cc.Label).string = playerData.name;
                if (player.userId == cc.dd.user.id) {
                    node.playerInfo.getChildByName('id').getComponent(cc.Label).string = player.userId;
                } else {
                    node.playerInfo.getChildByName('id').getComponent(cc.Label).string = '';
                }
                cc.find('bg/dss_paihangbang_tk_di02', node.playerInfo).active = player.userId == cc.dd.user.id;
                node.playerInfo.active = true;
            }
        }
        cc.dd.Utils.seekNodeByName(this.node, 'clickHide').active = true;
    },

    clickHidePlayerInfo: function (event, data) { //关闭玩家信息
        for (var i = 0; i < 4; i++) {
            var node = this.m_tPlayerInfo[i].playerInfo;
            if (node) {
                node.active = false;
            }
        }
        cc.dd.Utils.seekNodeByName(this.node, 'clickHide').active = false;
    },

    showBag: function () {
        cc.dd.UIMgr.openUI('gameyj_fish/prefabs/fish_game_bag', function (ui) {
            ui.getComponent('com_game_bag');
        }.bind(this));
    },

    enterSelectDesk: function () {
        AudioManager.clearBackGroundMusicKey();

        cc.dd.SceneManager.replaceScene(AppCfg.HALL_NAME, null, null, function () {

            var gameId = cc.sys.localStorage.getItem('fishGameId');
            var roomId = cc.sys.localStorage.getItem('fishRoomId');

            let data = {
                roomid: roomId,
                gameid: gameId,
            }
            gFishMgr.setRoomItem(data);

            cc.dd.UIMgr.openUI("gameyj_fish/prefabs/gameyj_fish_desk_select", function (node) {
                let ui = node.getComponent("gameyj_Fish_Select_Desk");
                if (ui) {
                    ui.initDeskNodeList(parseInt(data.roomid), 1);

                    var msg = new cc.pb.game_rule.msg_get_room_desks_req();
                    var gameInfo = new cc.pb.room_mgr.common_game_header();
                    gameInfo.setGameType(138);
                    gameInfo.setRoomId(parseInt(data.roomid));
                    msg.setGameInfo(gameInfo);
                    msg.setIndex(1);
                    cc.gateNet.Instance().sendMsg(cc.netCmd.game_rule.cmd_msg_get_room_desks_req, msg,
                        '发送协议[cmd_msg_get_room_desks_req][拉取数据信息]', true);
                }
            });

        });
    },

    playerLeave: function (userId) {
        if (userId == cc.dd.user.id) {//自己离开
            gFishMgr.clearAllData();
            playerManager.clearAllData();
            this.enterSelectDesk();
        } else {
            var player = playerManager.findPlayerByUserId(userId);
            if (player) {
                var playerData = player.getPlayerCommonInfo();
                if (playerData) {
                    this.m_tPlayerInfo[playerData.pos - 1].root.active = false;
                    this.m_tPlayerInfo[playerData.pos - 1].trackLock.active = false;
                    this.m_tPlayerInfo[playerData.pos - 1].trackQiPaoCnt.removeFromParent(true);
                }
            }
            playerManager.deletePlayer(userId);
        }
    },
    /////////////////////////////////////////消息通讯///////////////////////////////////
    onEventMessage: function (event, data) {
        switch (event) {
            case playerEvent.Fish_PLAYER_ENTER:
                this.updateOnePlayerInfo(data);

                var player = playerManager.findPlayerByUserPos(data); //获取玩家信息
                if (player && player.userId == cc.dd.user.id) {
                    var playerComData = player.getPlayerCommonInfo();
                    if (playerComData && (playerComData.seat + 1 == 2 || playerComData.seat + 1 == 3))
                        this.m_oFishPoolBg.setRotation(180);
                }
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
            case SysEvent.PAUSE:
                this.stopGuaJi();
                cc.log('暂停 切后台停止挂机');
                break;
        }
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

    //播放相应音效
    playAudio: function (audioId, isloop, volume) {
        AudioManager.setSoundVolume(volume);
        return AudioManager.playSound(FishType.fishAuidoPath + audioId + '', isloop);
    },
});
