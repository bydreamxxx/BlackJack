//create by wj 2018/12/05
var arrayCtrl = require('ArrayCtrl').ArrayCtrl;
var SlotCfg = require('SlotCfg');
var gSlotMgr = require('SlotManger').SlotManger.Instance();
var SlotType = require('SlotType').SlotType;
const data_slotcard = require('slotcard');
const slot_audio = require('slotaudio');
var hallData = require('hall_common_data').HallCommonData;
var HallCommonObj = require('hall_common_data');
var HallCommonEd = HallCommonObj.HallCommonEd;
var HallCommonEvent = HallCommonObj.HallCommonEvent;
const hall_prop_data = require('hall_prop_data').HallPropData;
var AudioManager = require('AudioManager').getInstance();
const Hall = require('jlmj_halldata');
const data_slotline = require('slotline');

cc.Class({
    extends: cc.Component,

    properties: {
        m_tRunTimer: [], //老虎机时间管理数组
        m_tLinePosContainter: [], //
        m_tWinLineContainer: [],//保存中奖后坐标点
        m_nIndex: 0, //赢线
        m_nTimerControl: 0, //长按时间控制
        //判定滚筒结束点
        m_tRunEndTag: [],
        m_tRunEndTimer: [],
        m_nRunEndTag: 0,

        //操作点击按钮
        m_oOpBtn: cc.Node,
        m_oYaAllBtn: cc.Button,
        m_oAddFenBtn: cc.Button,
        m_oSubFenBtn: cc.Button,

        atlas: cc.SpriteAtlas,
        runAtlas: cc.SpriteAtlas,
        btnAtlas: cc.SpriteAtlas,

        m_btnDownState: SlotType.DownBtnState.Down,
        m_tWinLines: [],
        m_tWildPosList: [],

        cardAnimaClips: { default: [], type: sp.SkeletonData, tooltip: '卡片特效' },
        m_tWildSkeletonNode: { default: [], type: cc.Node, tooltip: 'wild特效' },
        m_tNearRunNode: { default: [], type: cc.Node, tooltip: 'nearRun' },

        coverSpriteFram: cc.SpriteFrame,
        m_oRuleUI: cc.Node,
        //菜单列表
        m_oMenuListNode: cc.Node,

        m_bNeedStopRunAudio: false,
        m_nTimer: 0,
        m_nOrignVolume: 1.0,
        m_nOpTimes: 0,
        m_tShowIconPos: [],
        m_oTopLinePanel: cc.Node,
        m_oBottomLinePanel: cc.Node,
        m_tColorFrame: { default: [], type: cc.SpriteFrame, tooltip: '彩色线框' },
        m_tCoinSkeleton: { default: [], type: sp.Skeleton, },
        m_oCoinSplit: cc.Node,
        bgNode: cc.Node,
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
                    gSlotMgr.quitGame();
                }
            }
                break;
            default:
                break;
        }
    },

    onLoad: function () {
        this.scaleX = this.node.width / this.node.height;
        let windowSize = cc.winSize;//推荐  原因  短
        this.bgNode.scaleX = (windowSize.width / windowSize.height) / this.scaleX;

        Hall.HallED.notifyEvent(Hall.HallEvent.TurnOff_Marquee);

        HallCommonEd.addObserver(this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        //this.m_nOrignVolume = AudioManager._getLocalSoundVolume();

        //主体转轮
        var oRunContent = cc.dd.Utils.seekNodeByName(this.node, "Panel_RunContent");
        var tRunLines = new arrayCtrl();
        tRunLines.CreateArrayCtrl(-1, 1, oRunContent);
        tRunLines.resize(5);

        this.m_tRunLines = [];
        this.m_tRunContent = [];

        //老虎机背景
        for (var i = 0; i < 5; i++) {
            var runLine = tRunLines.at(i);
            this.m_tRunContent[i] = cc.dd.Utils.seekNodeByName(runLine, "Panel_Content");
            var arrRunLine = new arrayCtrl();
            arrRunLine.CreateArrayCtrl(1, -1, this.m_tRunContent[i]);
            this.m_tRunLines[i] = arrRunLine;
        }

        this.m_oYaFen = cc.dd.Utils.seekNodeByName(this.node, "stakeNum").getComponent(cc.Label);
        this.m_oYaFenTotal = cc.dd.Utils.seekNodeByName(this.node, "totalNum").getComponent(cc.Label);
        this.m_oYaFenGet = cc.dd.Utils.seekNodeByName(this.node, "winNum").getComponent(cc.Label);
        this.m_oUserGold = cc.dd.Utils.seekNodeByName(this.node, "coin").getComponent(cc.Label);

        this.m_oName = cc.dd.Utils.seekNodeByName(this.node, "name").getComponent(cc.Label);
        if (this.m_oName)
            this.m_oName.string = cc.dd.Utils.substr(hallData.getInstance().nick, 0, 6);
        var cpt = cc.dd.Utils.seekNodeByName(this.node, "headSp").getComponent('klb_hall_Player_Head');
        cpt.initHead(hallData.getInstance().openId, hallData.getInstance().headUrl, 'slot_head_init');

        this.m_oOpBtn.on(cc.Node.EventType.TOUCH_START, this.onClickStart, this);
        this.m_oOpBtn.on(cc.Node.EventType.TOUCH_END, this.onClickEnd, this);

        this.m_oFreeNode = cc.dd.Utils.seekNodeByName(this.node, 'freeTimes');
        this.m_oFreeNode.active = false;

        this.FillRunline();
        for (var x = 0; x < 5; x++) {
            for (var y = 0; y < 3; y++) {
                var cardNode = this.getStartCardNode(x, y);
                var cardId = gSlotMgr.getCard(x, y);
                var cardCfg = data_slotcard.items[cardId];

                const iconSp = cardNode.getComponent(cc.Sprite);
                iconSp.spriteFrame = this.atlas.getSpriteFrame(cardCfg.icon);

            }
        }
        this.UpdateYa();

        // if(gSlotMgr.getReconnect())
        //     //gSlotMgr.checkSmallGame();
        // else{
        if (!gSlotMgr.getReconnect()) {
            if (this.m_oUserGold)
                this.m_oUserGold.string = this.changeNumToCHN(gSlotMgr.getGold());
            this.m_nUserCurGold = gSlotMgr.getGold();
            this.playBackGround();
        }
    },

    onDestroy: function () {
        gSlotMgr.resetGameMusicAndAudio();
        Hall.HallED.notifyEvent(Hall.HallEvent.TurnOn_Marquee);

        cc.audioEngine.stop(this.m_nMusicId);
        AudioManager.stopMusic();
        HallCommonEd.removeObserver(this);
    },

    //播放背景音乐
    playBackGround: function () {
        if (this.m_nMusicId)
            cc.audioEngine.stop(this.m_nMusicId);
        AudioManager.stopMusic();
        if (AudioManager._getLocalMusicSwitch()) {
            if (gSlotMgr.getFreeTimes() <= 0 && !gSlotMgr.isEnterFree())
                this.m_nMusicId = AudioManager.playMusic(SlotCfg.AudioMammonPath + 'CSD_Bgm');
            else
                this.m_nMusicId = AudioManager.playMusic(SlotCfg.AudioMammonPath + 'CSD_Freegame_Bgm');
        }
    },

    //播放相应音效
    playAudio: function (audioId, isloop) {
        var data = slot_audio.getItem(function (item) {
            if (item.key == audioId)
                return item;
        })
        var name = data.audio_name;
        //AudioManager.setSoundVolume(0.4);
        return AudioManager.playSound(SlotCfg.AudioMammonPath + name, isloop);
    },

    //更新押注数据
    UpdateYa: function () {
        var bet = gSlotMgr.getLastDownInfo().lastLineBet;
        this.m_oYaFen.string = bet;
        this.m_oYaFenTotal.string = bet * 30;
    },

    //更新玩家身上金币
    updateGold: function () {
        var gold = gSlotMgr.getGold();
        this.m_oUserGold.string = this.changeNumToCHN(gold);
        this.m_nUserCurGold = gold;
    },

    //显示真是结果
    updateResult: function () {
        if (gSlotMgr.getResultFen() != 0) {
            this.m_tCoinSkeleton[1].node.active = true;
            this.m_tCoinSkeleton[1].clearTracks();
            this.m_tCoinSkeleton[1].setAnimation(0, 'hou', false);

            this.m_tCoinSkeleton[2].node.active = true;
            this.m_tCoinSkeleton[2].clearTracks();
            this.m_tCoinSkeleton[2].setAnimation(0, 'qian', false);

            this.m_oCoinSplit.active = true;
            this.m_oCoinSplit.getComponent(cc.ParticleSystem).resetSystem();
        }

        this.m_oYaFenGet.string = gSlotMgr.getResultFen();
    },

    //清空得分
    clearGetFen: function () {
        this.m_oYaFenGet.string = '0';
    },

    update: function (dt) {
        if (this.m_tRunTimer.length > 0) {
            for (var k = 0; k < this.m_tRunTimer.length; k++) {
                var v = this.m_tRunTimer[k];
                if (v) {
                    v.passTime = v.passTime + dt;
                    var runLine = this.m_tRunContent[k];
                    if (v.passTime > 0 && this.m_tRunEndTag[k] == false) {
                        var curPosY = -v.passTime * v.cfg.startSpeed + runLine.y;
                        if (curPosY <= v.endPosY + this.m_tRunLines[k].m_offset.y * 0.5) {
                            curPosY = v.endPosY + this.m_tRunLines[k].m_offset.y * 0.5;
                            runLine.y = curPosY - this.m_tRunLines[k].m_offset.y + 80;
                            this.m_tRunEndTag[k] = true;

                            // this.m_tRunTimer[k] = null;
                            // this.m_tRunEndTimer[k] = 0;
                            // this.m_tRunEndTag[k] = false;
                            // this.runNearLine(k);
                            // this.m_nRunEndTag += 1;

                            // var addLineList = gSlotMgr.getAddLineList();
                            // var self = this;
                            // addLineList.forEach(function(line){
                            //     if(line == k){
                            //         self.m_tNearRunNode[line - 3].active = false;
                            //     }

                            // })
                            // //声音播放，暂未处理if(gSlotMgr.)
                            // this.playAudio(1025023);
                        } else {
                            runLine.y = curPosY;

                            // var addLineList = gSlotMgr.getAddLineList();
                            // var self = this;
                            // addLineList.forEach(function(line){
                            //     if(line == k){
                            //         var arrRunLine = self.m_tRunLines[k];
                            //         var runPosY = -(arrRunLine.showCount() / 5 * 3) * arrRunLine.m_offset.y;
                            //         if(curPosY <= runPosY){
                            //             if(v.cfg.startSpeed <= 4)
                            //                 v.cfg.startSpeed = 4;
                            //             else
                            //                 v.cfg.startSpeed = v.cfg.startSpeed * 0.95;
                            //         }
                            //     }

                            // })
                        }
                    }
                }
            }

            for (var m = 0; m < this.m_tRunEndTag.length; m++) {
                var vardata = this.m_tRunEndTag[m];
                if (vardata) {
                    this.m_tRunEndTimer[m] = this.m_tRunEndTimer[m] + dt;
                    var curPosY = this.m_tRunContent[m].y;
                    if (this.m_tRunTimer[m] && curPosY >= this.m_tRunTimer[m].endPosY + this.m_tRunLines[m].m_offset.y * 0.5) {
                        //this.playAudio(101410);
                        this.m_tRunContent[m].y = this.m_tRunTimer[m].endPosY + this.m_tRunLines[m].m_offset.y * 0.5;
                        this.m_tRunTimer[m] = null;
                        this.m_tRunEndTimer[m] = 0;
                        this.m_tRunEndTag[m] = false;
                        this.runNearLine(m);
                        this.m_nRunEndTag += 1;

                        var addLineList = gSlotMgr.getAddLineList();
                        var self = this;
                        addLineList.forEach(function (line) {
                            if (line == m) {
                                self.m_tNearRunNode[line - 3].active = false;
                            }
                        });
                        this.m_nRunAudioId = this.playAudio(1025023);
                    } else {
                        this.m_tRunContent[m].y = curPosY + (30 * this.m_tRunEndTimer[m] - this.m_tRunEndTimer[m] * this.m_tRunTimer[m]);
                    }
                }

            }
        } else {
            if (this.m_bHoldClick) {
                this.m_nLongTime += dt;
                if (this.m_nLongTime > 1.2 && !gSlotMgr.isBetAuto()) {
                    gSlotMgr.setBetAuto(true);
                    this.startAuto();
                    this.m_bHoldClick = false;
                }
            }
        }
        if (this.m_nRunEndTag == 5) {
            this.m_nRunEndTag = 0;
            this.m_tRunTimer.splice(0, this.m_tRunTimer.length);
            this.onRunEnd();
            this.m_bNeedStopRunAudio = true;
        }
        if (this.m_bNeedStopRunAudio && gSlotMgr.isBetAuto() == false && gSlotMgr.isEnterFree() == false) {
            this.m_nTimer += dt;
            if (this.m_nTimer > 0.5) {
                this.m_nTimer = 0;
                this.m_nOpTimes += 1;
                this.opRunAudio();
            }
        }
    },

    opRunAudio: function () {
        if (this.m_bNeedStopRunAudio) {
            if (this.m_nOpTimes >= 6) {
                AudioManager.stopSound(this.m_nRunAudioId);
                this.m_bNeedStopRunAudio = false;
                this.m_nOpTimes = 0;
            }
        }
    },

    //清理所有图片节点的子节点
    clearAllUiNode: function () {
        for (var x = 0; x < 5; x++) {
            for (var y = 0; y < 3; y++) {
                var node = this.getCardNode(x, y);
                if (node) {
                    node.setScale(1.0);
                    node.stopAllActions(true);
                    node.removeAllChildren(true);
                    var spineNode = node.parent.getChildByName('spineNode');
                    if (spineNode)
                        spineNode.removeFromParent(true);
                    var lineNode = node.parent.getChildByName('lineFrame');
                    if (lineNode)
                        lineNode.removeFromParent(true);
                }
            }
        }

        this.m_tWildSkeletonNode.forEach(function (node) {
            node.active = false;
            node.getComponent(sp.Skeleton).clearTracks();
        });

        this.m_tNearRunNode.forEach(function (node) {
            node.active = false;
            node.getComponent(sp.Skeleton).clearTracks();
        });
    },

    //生成虚假显示图标
    FillVitrualNodeShow: function (cardNode, cardId) {
        var cardCfg = data_slotcard.items[cardId];
        var newNode = new cc.Node('virturalNode');
        const iconSp = newNode.addComponent(cc.Sprite);
        iconSp.spriteFrame = this.atlas.getSpriteFrame(cardCfg.licon);
        cardNode.addChild(newNode);
        newNode.setPosition(cc.v2(0, 0));
    },

    //生成老虎机数列
    FillRunline: function () {
        this.clearAllUiNode();
        var self = this;
        var tRunLinesData = gSlotMgr.getAllRunLine();
        for (var i = 0; i < 5; i++) {
            var arrRunLine = this.m_tRunLines[i];
            var oneLineData = tRunLinesData[i];
            arrRunLine.updateItemEx(oneLineData, function (card_id, uiNode, index, key) {
                var cardCfg = data_slotcard.items[card_id];

                if (index != 0 && index != 1 && index != 2 && index != oneLineData.length - 2 && index != oneLineData.length - 3 && index != oneLineData.length - 4) {
                    var str = 'z' + cardCfg.run_icon;
                    uiNode.getComponent(cc.Sprite).spriteFrame = self.runAtlas.getSpriteFrame(str); //模糊高速转动图片
                } else {
                    uiNode.getComponent(cc.Sprite).spriteFrame = self.atlas.getSpriteFrame(cardCfg.icon); //正常显示图片
                }

                var addLineList = gSlotMgr.getAddLineList();
                if (addLineList.length != 0) {//加速滚轴
                    for (var k = 0; k < addLineList.length; k++) {//获取加速的滚轴index
                        if (addLineList[k] == i) {//如果当前滚轴加速
                            var runCfg = gSlotMgr.getRunCfg(); //获取滚轴配置
                            if (index > runCfg[i].lineLen) {
                                if (index != oneLineData.length - 2 && index != oneLineData.length - 3 && index != oneLineData.length - 4) {
                                    uiNode.getComponent(cc.Sprite).spriteFrame = self.runAtlas.getSpriteFrame(cardCfg.run_icon); //模糊高速高亮转动图片
                                } else {
                                    self.FillVitrualNodeShow(uiNode, card_id)//高亮图片
                                }
                            }
                        }
                    }
                }
                uiNode.active = true;
            });
        }
    },

    //下注以后的预览
    UpdatePre: function () {
        this.FillRunline();
        this.StartRunEffect();
    },

    cloneDeep: function (obj) {
        var result = Array.isArray(obj) ? [] : {};
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === 'object') {
                    result[key] = this.cloneDeep(obj[key]);   //递归复制
                } else {
                    result[key] = obj[key];
                }
            }
        }
        return result;
    },

    //开始跑老虎机
    StartRunEffect: function () {
        // if(gSlotMgr.isEnterFree() == false && this.m_bNeedStopRunAudio == false){
        //     //AudioManager.setSoundVolume(this.m_nOrignVolume);
        //     this.m_nRunAudioId = this.playAudio(1025005, true);
        // }else if(gSlotMgr.isEnterFree() && this.m_bNeedStopRunAudio == false){
        //     //AudioManager.setSoundVolume(this.m_nOrignVolume);
        //     this.m_nRunAudioId = this.playAudio(1025006, true);
        // }
        var runCfg = gSlotMgr.getRunCfg()
        for (var i = 0; i < 5; i++) {
            var runLine = this.m_tRunContent[i];
            var arrRunLine = this.m_tRunLines[i];
            runLine.y = 156

            var runTimer = [];
            runTimer.cfg = this.cloneDeep(runCfg[i]);

            runTimer.endPosY = -(arrRunLine.showCount() - 5) * arrRunLine.m_offset.y
            runTimer.passTime = - runTimer.cfg.delayTime / 1000.0

            this.m_tRunTimer[i] = runTimer;
            this.m_tRunEndTag[i] = false;
            this.m_tRunEndTimer[i] = 0;
        }
        //this.setTopAction('lightAnim');
    },

    showStopBtn: function () {
        if (gSlotMgr && gSlotMgr.getGameState() == SlotType.GameState.Runing)
            this.setDownBtnState(SlotType.DownBtnState.Stop);
    },

    //跑nearline动画
    runNearLine: function (col) {
        var addLineList = gSlotMgr.getAddLineList();
        var self = this;
        addLineList.forEach(function (line) {
            if (col + 1 == line) {
                self.m_nRunAudioId = self.playAudio(1025032);
                self.m_tRunTimer[line].cfg.startSpeed = self.m_tRunTimer[line].cfg.startSpeed * 1.2;
                self.m_tNearRunNode[line - 3].active = true;
                const nearSkelton = self.m_tNearRunNode[line - 3].getComponent(sp.Skeleton);
                nearSkelton.clearTracks();
                nearSkelton.setAnimation(0, 'zhuan', true);
            }

        })
    },

    //渐隐高亮图片
    fadeOutLightNode: function () {

        this.m_tWildPosList.splice(0, this.m_tWildPosList.length);

        var addLineList = gSlotMgr.getAddLineList();
        if (addLineList.length != 0) {//有滚动加速图片
            var start = addLineList[0];
            var end = addLineList.length + addLineList[0];
            var countIndex = addLineList[0];
            if (addLineList.length > 1) {
                start = 3;
                end = addLineList.length + 3;
                countIndex = 3;
            }
            for (var x = start; x < end; x++) { //对加速状态的高亮图片处理
                for (var y = 0; y < 3; y++) {
                    var uiNode = this.getCardNode(x, y);
                    var virtrualNode = uiNode.getChildByName('virturalNode');
                    if (x == addLineList.length + countIndex - 1 && y == 2) {
                        var self = this;
                        virtrualNode.runAction(cc.sequence(cc.fadeOut(1.5), cc.callFunc(function () {
                            var winLines = gSlotMgr.getWinLines();
                            self.OnRunEndPlayEffect(winLines);
                        })));
                    } else
                        virtrualNode.runAction(cc.fadeOut(1.5));
                }

            }
        } else {//无加速情况
            var winLines = gSlotMgr.getWinLines();
            this.OnRunEndPlayEffect(winLines);
        }
        // for(var x = 0; x < 5; x++){
        //     for(var y = 0; y < 3; y++){
        //         var uiNode = this.getCardNode(x, y);
        //         var virtrualNode = uiNode.getChildByName('virturalNode');
        //         // var card = gSlotMgr.getCard(x, y);
        //         // if(card == gSlotMgr.getWildCard() && gSlotMgr.getWinLines().length > 0){
        //         //     this.m_tWildPosList.push(x);
        //         // }
        //         if(x == 4 && y == 2){
        //             var self = this;
        //             virtrualNode.runAction(cc.sequence(cc.fadeOut(1), cc.callFunc(function(){
        //                 var winLines = gSlotMgr.getWinLines();
        //                 self.OnRunEndPlayEffect(winLines);
        //             })));
        //         }else
        //             virtrualNode.runAction(cc.fadeOut(1));
        //     }
        // }
    },

    //播放wild动画
    playWildActive: function () {
        if (this.m_tWildPosList.length != 0) {
            var self = this;
            var _callback = false;
            this.m_nRunAudioId = this.playAudio(1025025, false);
            for (var i = 0; i < this.m_tWildPosList.length; i++) {
                this.m_tWildSkeletonNode[this.m_tWildPosList[i] - 1].active = true;
                const wildSkeleton = this.m_tWildSkeletonNode[this.m_tWildPosList[i] - 1].getComponent(sp.Skeleton);
                wildSkeleton.clearTracks();
                wildSkeleton.setAnimation(0, 'bianpaoCX', false);
                wildSkeleton.loop = false;
                wildSkeleton.setCompleteListener(function () {
                    wildSkeleton.setAnimation(0, 'bianpaoXH', true);
                    //wildSkeleton.setCompleteListener(null);
                    if (!_callback) {
                        _callback = true;
                        //if(gSlotMgr.getFreeTimes() == 0 && gSlotMgr.getSmallGameTimes() == 0)
                        //self.playAudio(1025026);
                        //self.OnEffectEnd(); 
                        self.OnLineEffectCallBack();
                    }
                })
            }
        } else {
            //if(gSlotMgr.getFreeTimes() == 0 && gSlotMgr.getSmallGameTimes() == 0)
            //this.playAudio(1025026);
            //this.OnEffectEnd(); 
            this.OnLineEffectCallBack();
        }
    },

    //滚轴转动结束
    onRunEnd: function () {
        //this.updateResult();
        var nLastGold = gSlotMgr.getLastGold();
        if (gSlotMgr.getGold() < nLastGold)
            this.updateGold();
        if ((this.m_btnDownState == SlotType.DownBtnState.Stop || this.m_btnDownState == SlotType.DownBtnState.Stoping || this.m_btnDownState == SlotType.DownBtnState.AutoDownStoping) &&
            gSlotMgr.isBetAuto() == false && gSlotMgr.getSmallGameTimes() == 0 && gSlotMgr.getFreeTimes() == 0) {
            if (gSlotMgr.getResultFen() == 0)
                this.setDownBtnState(SlotType.DownBtnState.Down);
            else
                this.setDownBtnState(SlotType.DownBtnState.Stoping);
        } else if (gSlotMgr.getSmallGameTimes() > 0 || gSlotMgr.getFreeTimes() > 0) {
            this.m_btnDownState = SlotType.DownBtnState.Stop;
            this.setDownBtnState(SlotType.DownBtnState.Stoping);
        }

        this.fadeOutLightNode();
    },

    //滚轴结束特效开始播放
    OnRunEndPlayEffect: function (winLines) {
        if (winLines.length > 0) {
            this.setSlotDarkOrLight(true);
            this.m_nIndex = 0;
            //this.playWinEffect();

            var self = this;
            this.m_tWinLines.splice(0, this.m_tWinLines.length);
            var compare = function (a, b) {
                if ((a.card == self.freeCard && b.card == self.bounsCard) || (a.card == self.bounsCard && b.card == self.freeCard))
                    return a.card < b.card
                else {
                    return a.line > b.line;

                    // if(a.card == b.card)
                    //     return a.line >= b.line;
                    // else
                    //     return a.card > b.card;
                }
            }
            winLines.sort(compare);
            this.m_tWinLines = winLines;
            this.m_tLinePosContainter.splice(0, this.m_tLinePosContainter.length);
            this.m_tShowIconPos.splice(0, this.m_tShowIconPos.length);
            this.m_tWinLineContainer.splice(0, this.m_tWinLineContainer.length);
            this.m_tWildPosList.splice(0, this.m_tWildPosList.length);


            //展示赢线
            for (var k = 0; k < winLines.length; k++) {
                var v = winLines[k];
                if (k == winLines.length - 1) {
                    this.ShowLineEffect(v.line, v.card, v.num, true);
                }
                else {
                    this.ShowLineEffect(v.line, v.card, v.num, false);
                }
            }

            // if(gSlotMgr.getResultFen() != 0){
            //     this.playPlayerGoldAdd(gSlotMgr.getResultFen());
            // }else{
            // var seq = cc.sequence(cc.delayTime(1), cc.callFunc(function(){
            //     self.OnEffectEnd();
            // }));
            // this.node.runAction(seq);

            // }
        } else {
            var self = this;
            var seq = cc.sequence(cc.delayTime(1), cc.callFunc(function () {
                self.OnEffectEnd();
            }))
            this.node.runAction(seq);
            if (gSlotMgr.isBetAuto() == false && gSlotMgr.getSmallGameTimes() == 0 && gSlotMgr.getFreeTimes() == 0)
                this.setDownBtnState(SlotType.DownBtnState.Down);
        }
    },
    //检查这一列是否被转换为wild
    checkChangeToWild: function (x) {
        var wildCard = gSlotMgr.getWildCard();
        for (var y = 0; y < 3; y++) {
            if (gSlotMgr.getCard(x, y) == wildCard)
                return true;
        }
        return false;
    },

    //赢线特效
    ShowLineEffect: function (lineNum, cardID, cardNum, bNeedCallBack) {
        if (gSlotMgr.getFreeTimes() > 0 || gSlotMgr.getSmallGameTimes() > 0) {
            this.setDownBtnState(SlotType.DownBtnState.Stoping);
        }

        var distinct = function (arr) {
            var obj = {};
            var result = [];
            for (var i = 0; i < arr.length; i++) {
                for (var j = 0; j < arr[i].length; j++) {
                    var index = arr[i][j].x * 10 + arr[i][j].y
                    if (!obj[index]) {
                        obj[index] = 1;
                        result.push(arr[i][j]);
                    }
                }
            }
            return result;
        }

        //this.m_isShowLine = true;
        var cardPosList = [];
        if (lineNum > 0) {
            this.m_oTopLinePanel.active = true;
            var lineStr = 'line' + lineNum;
            var lineNode = cc.dd.Utils.seekNodeByName(this.m_oTopLinePanel, lineStr);
            lineNode.active = true;

            this.m_tWinLineContainer.push(lineNum);

            var wildCard = gSlotMgr.getWildCard();
            for (var k = 0; k < gSlotMgr.getLineCfg(lineNum - 1).length; k++) {
                var v = gSlotMgr.getLineCfg(lineNum - 1)[k];
                var posCard = gSlotMgr.getCard(v.x, v.y);

                if (cardID == posCard) {
                    cardPosList[cardPosList.length] = v;
                } else if (wildCard == posCard || this.checkChangeToWild(v.x)) {
                    cardNum = cardNum - 1;
                    this.m_tWildPosList.push(v.x);
                }
                if (cardPosList.length == cardNum)
                    break;

            }

            this.m_tLinePosContainter.push(cardPosList);
            var self = this;
            if (bNeedCallBack) {
                self.m_tShowIconPos = distinct(self.m_tLinePosContainter);
                self.playLineShowAct();
                self.m_nRunAudioId = self.playAudio(1025029);
                self.m_tCoinSkeleton[0].node.active = true;
                self.m_tCoinSkeleton[0].clearTracks();
                self.m_tCoinSkeleton[0].setAnimation(0, 'beng', false);
                //self.playWildActive();
                //self.playCardEffect();
                self.result_id = setTimeout(function () {
                    clearTimeout(self.result_id);
                    self.updateResult();
                    self.updateGold();//更新当前金币

                }, 1000);
            }

        } else {//做散型的中奖
            for (var col = 0; col < SlotCfg.ColCount; col++) {
                for (var row = 0; row < SlotCfg.RowCount; row++) {
                    var posCard = gSlotMgr.getCard(col, row);
                    if (cardID == posCard)
                        cardPosList[cardPosList.length] = { x: col, y: row };
                }
            }
            this.m_tLinePosContainter.push(cardPosList);
            this.m_tShowIconPos = distinct(this.m_tLinePosContainter);
            if (bNeedCallBack) {
                this.OnLineEffectCallBack();
            }
        }
    },

    //创建彩色线框
    createCorlorWireFrame: function (uiNode, lineNum) {
        let node = new cc.Node('lineFrame');
        const spriteCpt = node.addComponent(cc.Sprite);
        var lineData = data_slotline.items[lineNum];
        spriteCpt.spriteFrame = this.m_tColorFrame[lineData.line_color - 1];
        node.width = 153;
        node.height = 153;
        uiNode.parent.addChild(node);
        node.setPosition(uiNode.getPosition());
    },

    //播放骨骼动画
    playCardWinRunEffect: function (cardID, uiNode, callBackFunc) {
        var cardCfg = data_slotcard.items[cardID];
        if (cardCfg.effect != -1) {///针对该部分做一个客户端动画配置表
            let node = new cc.Node('spineNode');
            const ske = node.addComponent(sp.Skeleton);
            ske.skeletonData = this.cardAnimaClips[cardCfg.effect];
            var skletonNameList = cardCfg.skeleton.split(';');
            if (skletonNameList.length == 1) {
                ske.clearTracks();
                ske.defaultAnimation = skletonNameList[0];
                ske.loop = false;
                ske.setAnimation(0, skletonNameList[0], false);
                if (callBackFunc) {
                    ske.setCompleteListener(function () {
                        callBackFunc()
                    });
                }
            } else {
                ske.clearTracks();
                ske.defaultAnimation = skletonNameList[0];
                ske.loop = false;
                ske.setAnimation(0, skletonNameList[0], false);
                ske.setCompleteListener(function () {
                    ske.setCompleteListener(function () {
                    });
                    ske.setAnimation(0, skletonNameList[1], false);
                    if (callBackFunc) {
                        ske.setCompleteListener(function () {
                            callBackFunc()
                        });
                    }

                });
            }
            uiNode.parent.addChild(node);
            uiNode.active = false;
            node.setPosition(uiNode.getPosition());
        } else {
            uiNode.removeAllChildren(true);
            var shineEffect = cc.sequence(cc.delayTime(2), cc.callFunc(function () {
                if (callBackFunc) {
                    callBackFunc()
                }
            }));
            uiNode.runAction(shineEffect);
        }
        if (callBackFunc) {
            var audioList = data_slotcard.items[cardID].audio_id.split(';');
            if (audioList) {
                this.m_nRunAudioId = this.playAudio(parseInt(audioList[0]), false);
            }
        }
    },

    //播放赢线显示动画
    playLineShowAct: function () {
        var self = this;
        this.m_oTopLinePanel.active = true;
        var anim = this.m_oTopLinePanel.getComponent(cc.Animation);
        anim.play();
        var lineCallBack = function () {
            if (!gSlotMgr.isBetAuto()) //自动转不做特效演示
                self.playWildActive();
            else if (gSlotMgr.isBetAuto() && (gSlotMgr.getSmallGameTimes() > 0 || gSlotMgr.getFreeTimes() > 0)) {
                self.playWildActive();
            }
            anim.off('finished', lineCallBack)
            self.m_oTopLinePanel.children.forEach(function (line) {
                line.active = false;
            })
            self.m_oTopLinePanel.active = false;
            if (gSlotMgr.getSmallGameTimes() <= 0 && gSlotMgr.getFreeTimes() <= 0)
                self.OnEffectEnd()
        }
        anim.on('finished', lineCallBack);
    },

    // //播放获奖特效
    // playCardEffect: function(){
    //     for(var k = 0; k < this.m_tShowIconPos.length; k++){
    //         //var cardPosList = this.m_tShowIconPos[k];
    //         //for(var index = 0; index < cardPosList.length; index++){
    //             var v = this.m_tShowIconPos[k];
    //             var uiNode = this.getCardNode(v.x, v.y);
    //             uiNode.removeAllChildren(true);
    //             var cardID = gSlotMgr.getCard(v.x, v.y);
    //             if(k == this.m_tShowIconPos.length-1){
    //                 var self = this;
    //                 var callBack = function(){
    //                     var seq = cc.sequence(cc.delayTime(1.0), cc.callFunc(function(){
    //                         self.OnEffectEnd(); 
    //                         self.OnLineEffectCallBack();
    //                     }))
    //                     self.node.runAction(seq);
    //                     // setTimeout(function()  {
    //                     // }, 1000);
    //                 }
    //                 this.playCardWinRunEffect(cardID, uiNode, callBack);
    //             }
    //             else
    //                 this.playCardWinRunEffect(cardID, uiNode, null);

    //         //}
    //     }
    // },

    //赢线特效结束后的回调
    OnLineEffectCallBack: function () {
        if (this.m_tLinePosContainter.length == 0)
            return;

        if (this.m_nIndex >= this.m_tLinePosContainter.length) {
            this.m_nIndex = 0;
        }

        //所有图片置灰
        this.setSlotDarkOrLight(true);


        //card特效
        var cardPosList = this.m_tLinePosContainter[this.m_nIndex];
        if (cardPosList.length != 0) {
            for (var k = 0; k < cardPosList.length; k++) {
                var v = cardPosList[k];
                var uiNode = this.getCardNode(v.x, v.y);
                var spineNode = uiNode.parent.getChildByName('spineNode');
                if (spineNode)
                    spineNode.removeFromParent(true);
                var cardID = gSlotMgr.getCard(v.x, v.y);
                if (k == cardPosList.length - 1) {
                    var self = this;
                    var callBack = function () {
                        if ((gSlotMgr.getSmallGameTimes() > 0) || (gSlotMgr.getFreeTimes() > 0))
                            self.OnEffectEnd();
                        else
                            self.OnLineEffectCallBack();
                    }
                    this.playCardWinRunEffect(cardID, uiNode, callBack);
                }
                else
                    this.playCardWinRunEffect(cardID, uiNode, null);
                if (this.m_tWinLineContainer.length != 0)
                    this.createCorlorWireFrame(uiNode, this.m_tWinLineContainer[this.m_nIndex]);
            }
        }

        this.m_nIndex += 1;
    },

    OnEffectEnd: function () {
        this.checkEnterBigWin();
    },


    //进入大赢家/超级大赢家
    checkEnterBigWin: function () {
        var winType = gSlotMgr.getBigWinType();
        if (winType == 1) {//大赢家
            cc.dd.UIMgr.openUI('gameyj_mammon_slot/Prefab/mammon_slot_big_win_ui', function (ui) {
                var cpt = ui.getComponent('mammon_slot_big_win');
                var bet = gSlotMgr.getLastDownInfo().lastLineBet * 30;

                cpt.setResultNum(gSlotMgr.getResultFen(), winType, bet);

            }.bind(this));
        } else if (winType == 2) {//超级大赢家
            cc.dd.UIMgr.openUI('gameyj_mammon_slot/Prefab/mammon_slot_mega_win_ui', function (ui) {
                var cpt = ui.getComponent('mammon_slot_big_win');
                var bet = gSlotMgr.getLastDownInfo().lastLineBet * 30;

                cpt.setResultNum(gSlotMgr.getResultFen(), winType, bet);
            }.bind(this));
        } else {
            this.quitBigWin();
        }
    },

    //退出大赢家/超级大赢家
    quitBigWin: function () {
        this.checkEnterSmallGame();
    },

    //进入小游戏
    checkEnterSmallGame: function () {
        if (gSlotMgr.getSmallGameTimes() > 0) {
            AudioManager.stopAllSound();
            this.stopLineEffect();
            this.showSmallGame();
            this.m_isEnterSmallGame = true;
            this.m_btnDownState = SlotType.DownBtnState.stop;
            this.setDownBtnState(SlotType.DownBtnState.Stoping);
        } else {
            this.quitSmallGame();
        }
    },

    //退出小游戏
    quitSmallGame: function () {
        this.resetEnterTinyGameTag();
        this.checkEnterFree();
    },

    //进入免费转
    checkEnterFree: function () {
        if (gSlotMgr.getFreeTimes() > 0) {
            AudioManager.stopAllSound();

            this.enterFreeTimes();
            if (!gSlotMgr.isEnterFree())
                this.playBackGround();
            gSlotMgr.setEnterFree(true);


        } else {
            if (gSlotMgr.isEnterFree()) {
                cc.dd.UIMgr.openUI("gameyj_mammon_slot/Prefab/mammon_slot_free_time_result_ui", function (prefab) {
                    var cpt = prefab.getComponent('mammon_slot_free_result_ui');
                    if (cpt)
                        cpt.showResult(gSlotMgr.getToltalFreeWin());
                    gSlotMgr.resetTotalFreeWin();
                }.bind(this));
                gSlotMgr.setEnterFree(false);
                this.playBackGround();
            } else {
                this.quitFreeTimes();
                gSlotMgr.setEnterFree(false);
                //this.playBackGround();
            }
        }
    },

    //退出免费转
    quitFreeTimes: function () {
        this.m_oFreeNode.active = false;
        this.checkEnterAutoBet(gSlotMgr.getSlotLastAuto());
    },

    //检查是否进入自动旋转
    checkEnterAutoBet: function (isEnter) {
        if (isEnter) {
            gSlotMgr.setBetAuto(true);
            this.startAuto();
        } else {
            if (this.m_btnDownState == SlotType.DownBtnState.AutoDownStoping)
                gSlotMgr.stopBetAuto();
            this.setDownBtnState(SlotType.DownBtnState.Down);
        }
    },


    //进入小游戏
    showSmallGame: function () {
        gSlotMgr.showSmallGame();
        var ui = cc.dd.UIMgr.getUI('gameyj_mammon_slot/Prefab/mammon_slot_tiny_game_ui');
        if (ui) {
        } else {
            if (this.m_nMusicId)
                cc.audioEngine.stop(this.m_nMusicId);
            cc.dd.UIMgr.openUI("gameyj_mammon_slot/Prefab/mammon_slot_tiny_game_ui", function (prefab) {
                AudioManager.stopMusic();
            }.bind(this));
        }

    },

    //进入免费转
    enterFreeTimes: function () {
        this.m_oFreeNode.active = true;
        this.clearAllUiNode();
        this.clearGetFen();
        gSlotMgr.setFreeTimesInEnterFree();
        this.updateFreeTimes();
        this.setDownBtnState(SlotType.DownBtnState.Downing);
        this.updateGold();//更新当前金币
        gSlotMgr.bet(0, 0);//下注
    },

    //更新免费转次数
    updateFreeTimes: function () {
        var freeTxt = this.m_oFreeNode.getChildByName('timesTxt').getComponent(cc.Label);
        freeTxt.string = gSlotMgr.getFreeTimes();
    },

    //重置小游戏标志
    resetEnterTinyGameTag: function () {
        this.m_isEnterSmallGame = false;
    },

    //整个老虎机置灰
    setSlotDarkOrLight: function (isDark) {
        for (var x = 0; x < 5; x++) {
            for (var y = 0; y < 3; y++) {
                var uiNode = this.getCardNode(x, y);
                if (uiNode) {
                    uiNode.active = true;
                    uiNode.removeAllChildren(true);
                    if (isDark) {
                        var spineNode = uiNode.parent.getChildByName('spineNode');
                        if (spineNode)
                            spineNode.removeFromParent(true);

                        var lineNode = uiNode.parent.getChildByName('lineFrame');
                        if (lineNode)
                            lineNode.removeFromParent(true);

                        var newNode = new cc.Node('darkNode');
                        var sp = newNode.addComponent(cc.Sprite);
                        sp.spriteFrame = this.coverSpriteFram;
                        sp.type = cc.Sprite.Type.SLICED;
                        sp.sizeMode = cc.Sprite.SizeMode.CUSTOM;
                        newNode.height = uiNode.height + 6;
                        newNode.width = uiNode.width;
                        uiNode.addChild(newNode);
                        newNode.setPosition(cc.v2(0, 0));
                    } else
                        uiNode.removeAllChildren(true);
                }

            }
        }
    },

    //获取老虎机上的数据节点
    getCardNode: function (x, y) {
        var arrRunLine = this.m_tRunLines[x];
        return arrRunLine.at(arrRunLine.showCount() - 4 + y);
    },

    //获取老虎机前3个数据节点
    getStartCardNode: function (x, y) {
        var arrRunLine = this.m_tRunLines[x];
        return arrRunLine.at(y);
    },

    stopLineEffect: function () {
        this.m_tLinePosContainter.splice(0, this.m_tLinePosContainter.length);
        this.m_tShowIconPos.splice(0, this.m_tShowIconPos.length);
    },

    //显示按钮特效
    showSpinBtnEffect: function (show) {
        this.m_oOpBtn.getChildByName('daizi').active = show;
        this.m_oOpBtn.getChildByName('caishenkaishiLZ').active = show;

    },

    setDownBtnState: function (state) {
        if (state == this.m_btnDownState)
            return;
        var stateSp = this.m_oOpBtn.getChildByName('desc_Sp').getComponent(cc.Sprite);
        var descSp = this.m_oOpBtn.getChildByName('di_Sp').getComponent(cc.Sprite);
        var descTxt = descSp.node.getChildByName('btnDesc').getComponent(cc.Label);
        if (state == SlotType.DownBtnState.Down) {//可下注状态
            stateSp.spriteFrame = this.btnAtlas.getSpriteFrame('start');
            descSp.spriteFrame = this.btnAtlas.getSpriteFrame('lightBg');
            descTxt.string = '长按进行自动旋转';
            descTxt.node.color = cc.color(243, 218, 88);
            this.showSpinBtnEffect(false);
        } else if (state == SlotType.DownBtnState.Downing) {//运转不可点击状态
            stateSp.spriteFrame = this.btnAtlas.getSpriteFrame('start_dark');
            descSp.spriteFrame = this.btnAtlas.getSpriteFrame('darkBg');
            descTxt.string = '长按进行自动旋转';
            descTxt.node.color = cc.color(182, 181, 175);
        } else if (state == SlotType.DownBtnState.Stop) {//可点击停止状态
            stateSp.spriteFrame = this.btnAtlas.getSpriteFrame('stop');
            descSp.spriteFrame = this.btnAtlas.getSpriteFrame('lightBg');
            descTxt.string = '单击快速停止滚动';
            descTxt.node.color = cc.color(243, 218, 88);
        } else if (state == SlotType.DownBtnState.Stoping) {//停止中
            stateSp.spriteFrame = this.btnAtlas.getSpriteFrame('stop_dark');
            descSp.spriteFrame = this.btnAtlas.getSpriteFrame('darkBg');
            descTxt.string = '单击快速停止滚动';
            descTxt.node.color = cc.color(182, 181, 175);
        } else if (state == SlotType.DownBtnState.AutoDown) {//自动旋转
            stateSp.spriteFrame = this.btnAtlas.getSpriteFrame('auto');
            descSp.spriteFrame = this.btnAtlas.getSpriteFrame('lightBg');
            descTxt.string = '单击停止自动旋转';
            this.showSpinBtnEffect(true);
            descTxt.node.color = cc.color(243, 218, 88);
        } else if (state == SlotType.DownBtnState.AutoDowning) {//自动旋转中
            stateSp.spriteFrame = this.btnAtlas.getSpriteFrame('auto');
            descSp.spriteFrame = this.btnAtlas.getSpriteFrame('lightBg');
            descTxt.string = '单击停止自动旋转';
            this.showSpinBtnEffect(true);
            descTxt.node.color = cc.color(243, 218, 88);
        } else if (state == SlotType.DownBtnState.AutoDownStoping) {//自动旋转
            stateSp.spriteFrame = this.btnAtlas.getSpriteFrame('stop_dark');
            descSp.spriteFrame = this.btnAtlas.getSpriteFrame('darkBg');
            descTxt.string = '单击停止自动旋转';
            descTxt.node.color = cc.color(182, 181, 175);
        }
        this.m_btnDownState = state;
    },

    //点击开始按钮
    onClickStart: function (event, data) {
        if (this.m_btnDownState == SlotType.DownBtnState.Stoping || this.m_btnDownState == SlotType.DownBtnState.AutoDownStoping || this.m_btnDownState == SlotType.DownBtnState.Downing)
            return;
        this.node.stopAllActions();
        AudioManager.stopAllSound();
        //AudioManager.setSoundVolume(this.m_nOrignVolume);
        this.m_nRunAudioId = this.playAudio(1025036, false);
        event.target.setScale(1.1);
        this.m_bHoldClick = true;
        this.m_nLongTime = 0;
        this.m_oMenuListNode.active = false;
        this.m_bNeedStopRunAudio = false;
    },

    //手指离开开始按钮
    onClickEnd: function (event, data) {
        this.m_bHoldClick = false;
        if (this.m_btnDownState == SlotType.DownBtnState.Stoping || this.m_btnDownState == SlotType.DownBtnState.AutoDownStoping || this.m_btnDownState == SlotType.DownBtnState.Downing)
            return;
        if (event != null)
            event.target.setScale(1.0);
        if (this.m_nLongTime >= 1.2) {//进入自动旋转
            //this.startAuto();
            this.m_nLongTime = 0;
            return;
        }
        this.m_nLongTime = 0;

        if (this.m_btnDownState == SlotType.DownBtnState.Down) {//按钮可点击开始
            if (gSlotMgr.getSmallGameTimes() > 0)//拥有小游戏
                return;
            this.m_tWinLineContainer.splice(0, this.m_tWinLineContainer.length);
            this.m_tLinePosContainter.splice(0, this.m_tLinePosContainter.length);
            this.m_tWildPosList.splice(0, this.m_tWildPosList.length);
            this.m_tShowIconPos.splice(0, this.m_tShowIconPos.length);
            this.clearGetFen();
            this.m_bNeedStopRunAudio = false;
            AudioManager.stopSound(this.m_nRunAudioId);
            this.clearAllUiNode();
            this.setSlotDarkOrLight(false);
            //this.stopLineEffect();

            if (hall_prop_data.getInstance().getCoin() < (gSlotMgr.getBetMin() * 30)) {
                this.setDownBtnState(SlotType.DownBtnState.Stoping);

                cc.dd.DialogBoxUtil.show(1, '您的金币不足，不能继续进行游戏', '退出', '取消', function () {
                    gSlotMgr.quitGame();
                }, null);
                return;
            }

            var yaFen = this.m_oYaFen.string;
            if (parseInt(yaFen) * 30 > hall_prop_data.getInstance().getCoin()) {
                cc.dd.PromptBoxUtil.show('金币不足，请重新押注');
                return;
            }

            gSlotMgr.bet(30, parseInt(yaFen));//下注
            this.updateGold();//更新当前金币
            this.setDownBtnState(SlotType.DownBtnState.Downing);//设置按钮为不可点击状态
            this.m_bCdBet = true;

            var self = this;
            var seq = cc.sequence(cc.delayTime(0.5), cc.callFunc(function () {
                self.showStopBtn();//显示停止按钮
            }))
            this.node.runAction(seq);
        } else if (this.m_btnDownState == SlotType.DownBtnState.Stop) {//点击停止按钮
            AudioManager.stopSound(this.m_nRunAudioId);
            this.setDownBtnState(SlotType.DownBtnState.Stoping); //按钮设置为停止不可点击

            for (var i = 0; i < 5; i++) {//快速停止
                var runLine = this.m_tRunContent[i];
                var arrRunLine = this.m_tRunLines[i];
                if (this.m_tRunTimer[i] != null) {
                    if (!gSlotMgr.checkAddLineList(i)) {
                        runLine.y = this.m_tRunTimer[i].endPosY + arrRunLine.m_offset.y * 0.5;
                        this.m_tRunTimer[i] = null;
                        this.m_tRunEndTimer[i] = 0;
                        this.m_tRunEndTag[i] = false;
                        this.m_nRunEndTag += 1;
                    } else {
                        this.runNearLine(i - 1);
                    }
                }
            }
        } else if (this.m_btnDownState == SlotType.DownBtnState.AutoDowning) {//停止自动转
            AudioManager.stopSound(this.m_nRunAudioId);
            this.setDownBtnState(SlotType.DownBtnState.AutoDownStoping);

            gSlotMgr.stopBetAuto();
            gSlotMgr.setSlotLastAuto();

            for (var i = 0; i < 5; i++) {
                var runLine = this.m_tRunContent[i];
                var arrRunLine = this.m_tRunLines[i];
                if (this.m_tRunTimer[i] != null) {
                    if (!gSlotMgr.checkAddLineList(i)) {
                        runLine.y = this.m_tRunTimer[i].endPosY + arrRunLine.m_offset.y * 0.5;
                        this.m_tRunTimer[i] = null;
                        this.m_tRunEndTimer[i] = 0;
                        this.m_tRunEndTag[i] = false;
                        this.m_nRunEndTag += 1;
                    } else {
                        this.runNearLine(i - 1);
                    }
                }
            }

            setTimeout(function () {
                if (this.m_btnDownState == SlotType.DownBtnState.AutoDownStoping)
                    this.setDownBtnState(SlotType.DownBtnState.Down);
            }.bind(this), 800);

        }

    },

    //开始自动转
    startAuto: function () {
        if (this.m_tRunTimer.length != 0)
            return;
        this.stopLineEffect();
        this.clearGetFen();
        if (hall_prop_data.getInstance().getCoin() < (gSlotMgr.getBetMin() * 30)) {
            this.setDownBtnState(SlotType.DownBtnState.Stoping);
            gSlotMgr.stopBetAuto();
            gSlotMgr.setSlotLastAuto();
            cc.dd.DialogBoxUtil.show(1, '您的金币不足，不能继续进行游戏', '退出', '取消', function () {
                gSlotMgr.quitGame();
            }, null);
            return;
        }

        var yaFen = this.m_oYaFen.string;
        if (parseInt(yaFen) * 30 > hall_prop_data.getInstance().getCoin()) {
            this.setDownBtnState(SlotType.DownBtnState.Down);
            gSlotMgr.stopBetAuto();
            gSlotMgr.setSlotLastAuto();
            cc.dd.PromptBoxUtil.show('金币不足，请重新押注');
            return;
        }

        this.setSlotDarkOrLight(false);
        //this.stopLineEffect();

        var self = this;
        var seq = cc.sequence(cc.delayTime(0.2), cc.callFunc(function () {
            gSlotMgr.betAuto(30, parseInt(yaFen));
            self.updateGold();
            self.setDownBtnState(SlotType.DownBtnState.AutoDowning);
        }))

        this.node.runAction(seq);

    },

    //增加押注
    OnYafenAdd: function (event, data) {
        this.m_nRunAudioId = this.playAudio(1025003, false);
        this.m_oMenuListNode.active = false;

        var lineBet = gSlotMgr.getLastDownInfo().lastLineBet;
        gSlotMgr.controlBetIndex(SlotType.SlotAddOrSubState.InAdd);
        lineBet = Math.min(gSlotMgr.getBetMax(), gSlotMgr.getBetNumByIndex());

        // this.stopLineEffect();
        gSlotMgr.setLastDownInfo(30, lineBet);
        this.UpdateYa();
    },

    //减少押注
    OnYafenSub: function (event, data) {
        this.m_nRunAudioId = this.playAudio(1025004, false);
        this.m_oMenuListNode.active = false;

        var lineBet = gSlotMgr.getLastDownInfo().lastLineBet;
        gSlotMgr.controlBetIndex(SlotType.SlotAddOrSubState.InSub);
        lineBet = Math.max(gSlotMgr.getBetMin(), gSlotMgr.getBetNumByIndex());
        gSlotMgr.setLastDownInfo(30, lineBet);
        this.UpdateYa();
    },

    //压最大值
    OnYaAllLine: function (event, data) {
        if (this.m_btnDownState == SlotType.DownBtnState.Stoping || this.m_btnDownState == SlotType.DownBtnState.AutoDownStoping || this.m_btnDownState == SlotType.DownBtnState.Downing)
            this.m_btnDownState = SlotType.DownBtnState.Stop
        this.m_nRunAudioId = this.playAudio(1025002, false);
        this.m_oMenuListNode.active = false;

        var lineBet = gSlotMgr.getBetMax();
        if (lineBet * 30 > gSlotMgr.getGold()) {
            lineBet = Math.floor(gSlotMgr.getGold() / 30);
            if (lineBet < gSlotMgr.getBetMin())
                lineBet = gSlotMgr.getBetMin();
            gSlotMgr.jugeBetIndex(lineBet);
            lineBet = gSlotMgr.getBetNumByIndex();
        }
        gSlotMgr.setLastDownInfo(30, lineBet);
        this.UpdateYa();
        gSlotMgr.InitBetIndex(lineBet);
        this.onClickEnd(null, null);
    },

    //点击菜单按钮
    onClickMenuBtn: function (event, data) {
        this.m_nRunAudioId = this.playAudio(1025002, false);
        this.m_oMenuListNode.active = !this.m_oMenuListNode.active;
    },

    //打开规则界面
    OnClickRule: function (event, data) {
        this.m_nRunAudioId = this.playAudio(1025002, false);
        cc.dd.UIMgr.openUI("gameyj_mammon_slot/Prefab/mammon_slot_rule_ui", function (node) {
            node.getComponent('mammon_slot_rule_ui').setIndicator();
        });
    },

    //退出按钮
    onClickQuitBtn: function (event, data) {
        this.m_nRunAudioId = this.playAudio(1025002, false);
        if (gSlotMgr.getFreeTimes() > 0) {
            cc.dd.PromptBoxUtil.show('免费旋转中不能退出游戏');
            return;
        }
        var str = '';
        if (gSlotMgr.getStartCoin() >= gSlotMgr.getGold()) {
            str = '您在本次游戏中没有盈利，是否现在就退出？';
        } else {
            str = '您在本次游戏中共盈利' + (gSlotMgr.getGold() - gSlotMgr.getStartCoin()) + '，是否现在就退出？'

        }
        cc.dd.DialogBoxUtil.show(1, str, '确定', '取消',
            function () {
                this.node.stopAllActions();
                cc.audioEngine.stop(this.m_nMusicId);
                AudioManager.stopMusic();
                gSlotMgr.quitGame();
            }.bind(this), null
        );

    },

    //点击设置按钮
    onClickSettingBtn: function (event, data) {
        this.m_nRunAudioId = this.playAudio(1025002, false);
        cc.dd.UIMgr.openUI("gameyj_mammon_slot/Prefab/mammon_slot_Setting", function (node) {
        });
    },

    setOrignSoundVolume: function () {
        //this.m_nOrignVolume = AudioManager._getLocalSoundVolume();
    },

    /**
     * 筹码数字转换
     */
    changeNumToCHN: function (num) {
        var str = '';
        if (num >= 100000000) {
            str = (num / 10000.00).toFixed(1) + '万';
        } else {
            str = num;
        }
        return str;
    },

    reconnectHall: function () {
        cc.dd.SceneManager.enterHall();
    },


    onEventMessage: function (event, data) {
        switch (event) {
            case HallCommonEvent.HALL_NO_RECONNECT_GAME:
                this.reconnectHall();
                break;
        }
    },

    sendGMToServer: function (event, data) {
        var editBox = cc.dd.Utils.seekNodeByName(this.node, 'gmEdit').getComponent(cc.EditBox);
        var list = editBox.string.split(',');
        var req = new cc.pb.slot.msg_slot_gm_2s();
        req.setIconsList(list);
        cc.gateNet.Instance().sendMsg(cc.netCmd.slot.cmd_msg_slot_gm_2s, req,
            '发送协议[cmd_msg_slot_gm_2s][财神小游戏重连]', true);
    }
});
