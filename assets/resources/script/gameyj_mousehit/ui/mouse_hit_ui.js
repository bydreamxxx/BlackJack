//create by wj 2021/7/4
var hallData = require('hall_common_data').HallCommonData;
const mouse_hit_Data = require('mouse_hit_Data').Mouse_Hit_Data;
const mouse_hit_Ed = require('mouse_hit_Data').Mouse_Hit_Ed;
const mouse_hit_Event = require('mouse_hit_Data').Mouse_Hit_Event;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
let RoomED = require("jlmj_room_mgr").RoomED;
let RoomEvent = require("jlmj_room_mgr").RoomEvent;
const audioConfig = require('mouse_audio_cfg');
let jlmj_prefab = require('jlmj_prefab_cfg');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
const Hall = require('jlmj_halldata');
var SysEvent = require("com_sys_data").SysEvent;
let SysED = require("com_sys_data").SysED;
let HallCommonObj = require('hall_common_data');
let HallCommonEd = HallCommonObj.HallCommonEd;
let HallCommonEvent = HallCommonObj.HallCommonEvent;
let mouse_send_msg = require('net_sender_mouse');
var rank_info = require('rank_info');
const mouseInformation = require('mouse');
let mouseTaskConfig = require("mouse_task");
// const hammergoldList = []; //锤子对应金额,建议配表hammergoldList = [100, 200, 300, 500, 1000, 2000, 5000];
//老鼠id 0-4, 普通老鼠 5南瓜老鼠, 6 财神, 7 翻牌, 8大老鼠,9 巨大老鼠, 10 宝藏
cc.Class({
    extends: cc.Component,

    properties: {
        hammer: {
            default: null,
            type: cc.Prefab,
        },
        selecthammer: {
            default: [],
            type: cc.SpriteFrame,
            tooltip: '锤子的图片',
        },
        mouseSkeleton: {
            default: [],
            type: sp.Skeleton,
            tooltip: "老鼠的骨骼动画"
        },
        autoSpSkeNode: {
            default: null,
            type: sp.Skeleton,
            tooltip: "自动锤骨骼动画"
        },
        mouseDbNodes: {
            default: [],
            type: cc.Node,
            tooltip: "老鼠的骨骼动画节点",
        },
        effectDbNodes: {
            default: [],
            type: cc.Node,
            tooltip: "敲击的效果"
        },
        mouseNodes: {
            default: [],
            type: cc.Node,
            tooltip: "老鼠节点",
        },
        mouseBg: {
            default: [],
            type: cc.SpriteFrame,
            tooltip: "游戏的大背景",
        },
        maskShip0: {
            default: [],
            type: cc.SpriteFrame,
            tooltip: "老鼠洞遮罩0",
        },
        maskShip1: {
            default: [],
            type: cc.SpriteFrame,
            tooltip: "老鼠洞遮罩1",
        },
        maskShip2: {
            default: [],
            type: cc.SpriteFrame,
            tooltip: "老鼠洞遮罩2",
        },
        maskShip3: {
            default: [],
            type: cc.SpriteFrame,
            tooltip: "老鼠洞遮罩3",
        },
        mouseReward: {
            default: [],
            type: cc.Node,
            tooltip: '老鼠获奖动画'
        },
        Lightning: {
            default: [],
            type: cc.Node,
            tooltip: "闪电效果"
        },
        noticeStr: {
            default: null,
            type: cc.RichText,
            tooltip: "播报类容"
        },
        mouseAtlas: {
            default: null,
            type: cc.SpriteAtlas,
            tooltip: "牌的图集"
        },
        taskWordsDes: {
            default: [],
            type: cc.SpriteFrame,
            tooltip: "任务完成的提示",
        },
        mousePokerType: {
            default: [],
            type: cc.SpriteFrame,
            tooltip: "牌的倍数",
        },
        samllMiddleReward: {
            default: null,
            type: cc.Prefab,
            tooltip: "小奖中奖",
        },
        treasureReward: {
            default: null,
            type: cc.Prefab,
            tooltip: "宝藏鼠奖"
        },
        bigMouseSp: {
            default: [],
            type: cc.SpriteFrame,
            tooltip: "奖的提示图片",
        }
        // mouseButton: {
        //     default: [],
        //     type: cc.Button,
        //     tooltip: "老鼠点击按钮"
        // }

    },

    onLoad() {
        cc.dd.SysTools.setLandscape();
        // cc.director.setDisplayStats(true);
        // cc.game.setFrameRate(60);
        mouse_hit_Ed.addObserver(this);
        RoomED.addObserver(this);
        Hall.HallED.addObserver(this);
        HallCommonEd.addObserver(this);
        SysED.addObserver(this);
        this.HammerIndex = 0; // 锤子索引
        this.BgIndex = 0;
        ////////场景里的节点//////
        this.menuNode = cc.find("menu", this.node);
        this.btnMore = cc.find('moreBtn/btn_more', this.node);
        this.guiZeNode = cc.find("guize", this.node);
        this.mousNode = cc.find('nodeMouse', this.node);
        this.rewardRecord = cc.find('rewardRecord', this.node);
        this.leftBtn = cc.find("leftBtn", this.node);
        this.autoToggleNode = cc.find('autHammer/automaToggle', this.node);
        this.mouseHitNode = cc.find('nodeMouse/MaskNode0/mouse', this.node);
        this.hammerSp = cc.find('selectHammer/nomalHammer/hammerSp', this.node);
        this.mouseCollider = cc.find('nodeMouse/MaskNode0/mouse1', this.node);
        this.quickHammerNode = cc.find("quickHanmmer", this.node);
        this.quickHammerContent = cc.find('quickHanmmer/bg/hammerToggleContainer', this.node);
        this.taskNode = cc.find("taskNode", this.node); //任务
        this.allCollect = cc.find("bg/panels/panel1/allCollect", this.taskNode); // 一键领取的按钮
        this.testNode = cc.find("MaskNode1/mouse/spskeNode/mouseSke0", this.mousNode);
        this.bigRewardNode = cc.find("nodeMouse/bigRewardNode", this.node);  //大奖节点
        this.angerRewardNode = cc.find("nodeMouse/angerRewardNode", this.node); //雷神之锤的大奖
        this.myUserIfo = cc.find("mine", this.node);
        this.angerNode = cc.find("mine/angerNode", this.node); //怒气节点
        this.powerNode = cc.find("mine/strengNode", this.node); // 体力节点
        this.coinNode = cc.find("mine/goldNode/goldtotal", this.node); //金币节点
        this.myName = cc.dd.Utils.seekNodeByName(this.node, "nickName").getComponent(cc.Label); //设置名字
        this.ordinaryHammer = cc.find("selectHammer/nomalHammer", this.node); //正常的锤子
        this.thorhHammer = cc.find("selectHammer/thorhHammer", this.node);   //雷神之锤
        this.thorhClickNode = cc.find("thorhClickNode", this.node);    //雷神锤点击节点
        this.mouseEmpty1 = cc.find("nodeMouse/mouseempty1", this.node); // 空锤子显示节点 
        this.mouseEmpty2 = cc.find("nodeMouse/mouseempty2", this.node);
        this.mouseEmpty3 = cc.find("nodeMouse/mouseempty3", this.node);
        this.mouseEmpty4 = cc.find("nodeMouse/mouseempty4", this.node);
        this.noticeMesge = cc.find("noticeMessage/bg", this.node);
        this.myUserIfo.zIndex = 200;
        this.taskNode.zIndex = 201;
        this.guiZeNode.zIndex = 203;
        this.noticeMesge.active = false;
        this.mouseEmpty = [this.mouseEmpty1, this.mouseEmpty2, this.mouseEmpty3, this.mouseEmpty4];
        this.totalAnger = 1000;
        this.angervalue = 0;
        this.ship = [
            this.maskShip0,
            this.maskShip1,
            this.maskShip2,
            this.maskShip3
        ];
        this.mouseInitNode = {
            [1001]: this.mouseDbNodes[0],
            [1002]: this.mouseDbNodes[1],
            [1003]: this.mouseDbNodes[2],
            [1004]: this.mouseDbNodes[3],
            [1005]: this.mouseDbNodes[4],
            [2001]: this.mouseDbNodes[5],
            [3001]: this.mouseDbNodes[6],
            [4001]: this.mouseDbNodes[7],
            [5001]: this.mouseDbNodes[8],
            [6001]: this.mouseDbNodes[9],
            [7001]: this.mouseDbNodes[10],
        };
        this.pokerTypelist = {
            [5]: this.mousePokerType[0],
            [10]: this.mousePokerType[1],
            [20]: this.mousePokerType[2],
            [30]: this.mousePokerType[3],
            [50]: this.mousePokerType[4],
            [100]: this.mousePokerType[5]
        };
        //读取配置获得配置的hammer信息
        this.hammergoldList = [];
        this.mouseInfo = mouseInformation.items[0];
        this.maxPower = this.mouseInfo.max_power;
        this.maxAnger = this.mouseInfo.max_anger;
        this.hammerInformation = this.mouseInfo.hammer.split(';');
        for (let j = 0; j < this.hammerInformation.length; j++) {
            let itemInfo = this.hammerInformation[j].split(',');
            let obj = { id: '', gold: '', power: '', anger: '' };
            obj.id = itemInfo[0];
            obj.gold = itemInfo[1];
            obj.power = itemInfo[2];
            obj.anger = itemInfo[3];
            this.hammergoldList.push(obj);
        }
        this.autoHammerList = [];
        this.autoHammerCd = 0;
        this.initGameUI();
        this.initEventListener();
        this.initMusicAndSound();
        this.schedule(this.doChangeBg, 60);
        this.mouseNodes.forEach(item => {
            let node = cc.find('mask/mouse/spskeNode', item);
            node.removeAllChildren()
        })
    },
    start() {
        mouse_send_msg.choiceRedReq(1);
    },

    onDestroy: function () {
        mouse_hit_Ed.removeObserver(this);
        RoomED.removeObserver(this);
        Hall.HallED.removeObserver(this);
        HallCommonEd.removeObserver(this);
        SysED.removeObserver(this);
        mouse_hit_Data.Destroy();
        AudioManager.stopMusic();
        AudioManager.stopAllLoopSound();
        this.unschedule(this.doChangeBg);
    },
    initMusicAndSound() {
        var music = AudioManager._getLocalMusicSwitch();
        if (music) {
            AudioManager.playMusic(audioConfig.GAME_MUSIC);
        }
    },
    doChangeBg() {
        this.BgIndex = this.BgIndex ? 0 : 1;
        cc.find("big_bg", this.node).getComponent(cc.Sprite).spriteFrame = this.mouseBg[this.BgIndex];
        for (let i = 0; i < 4; i++) {
            cc.find(`mask_ship${i}`, this.mousNode).getComponent(cc.Sprite).spriteFrame = this.ship[i][this.BgIndex]
        }

    },
    ////////////////////////////监听桌面的锤子///////////////////////////////////////////
    //桌面播放一个假的锤子动画
    initEventListener() {
        // this.mouseEmpty.forEach((item) => {
        //     item.on(cc.Node.EventType.MOUSE_DOWN, (event) => {
        //         this.onBeCreateHammerEvent(event.getLocation(), item);
        //     }, this);
        //     item.on(cc.Node.EventType.TOUCH_START, (event) => {
        //         this.onBeCreateHammerEvent(event.getLocation(), item);
        //     }, this);
        // })
        this.thorhClickNode.on(cc.Node.EventType.MOUSE_DOWN, (event) => {
            this.onClickThorhEvent(event.getLocation());
        }, this);
        this.thorhClickNode.on(cc.Node.EventType.TOUCH_START, (event) => {
            this.onClickThorhEvent(event.getLocation());
        }, this);
    },

    onBeCreateHammerEvent(position, listenerNode) {
        if (!cc.isValid(this.hammerNode)) {
            this.hammerNode = cc.instantiate(this.hammer);
            this.node.addChild(this.hammerNode);
        }
        this.hammerNode.active = true;
        this.hammerNode.position = listenerNode.parent.convertToNodeSpaceAR(position);
        let mouseSp = this.hammerNode.getComponent(sp.Skeleton);
        if (this.HammerIndex == 0) {
            this.hammerNode.setScale(2.5, 2.5)
        } else {
            this.hammerNode.setScale(2, 2)
        }
        mouseSp.setSkin(`hammer_${this.HammerIndex + 1}`);
        mouseSp.clearTracks();
        mouseSp.setAnimation(0, "animation", false);
        mouseSp.setCompleteListener(() => {
            this.hammerNode.active = false;
        })
    },
    onClickThorhEvent(position) {
        if (!cc.isValid(this.hammerNode)) {
            this.hammerNode = cc.instantiate(this.hammer);
            this.node.addChild(this.hammerNode);
        }
        this.hammerNode.active = true;
        this.hammerNode.position = this.thorhClickNode.parent.convertToNodeSpaceAR(position);
        let mouseSp = this.hammerNode.getComponent(sp.Skeleton);
        if (this.HammerIndex == 0) {
            this.hammerNode.setScale(2.5, 2.5)
        } else {
            this.hammerNode.setScale(2, 2)
        }
        if (mouse_hit_Data.Instance().myAnger == this.maxAnger) {
            mouseSp.setSkin(`hammer_99`);
            mouse_hit_Data.Instance().useHammerId = "8";
            if (!mouse_hit_Data.Instance().isCanHammer) return;
            mouse_send_msg.useHammerReq("8", 1);
            mouse_hit_Data.Instance().isCanHammer = false;
        } else {
            mouseSp.setSkin(`hammer_${this.HammerIndex + 1}`);
        }
        mouseSp.clearTracks();
        mouseSp.setAnimation(0, "animation", false);
        mouseSp.setCompleteListener(() => {
            this.hammerNode.active = false;
        })
    },
    //设置自动锤
    setAutoHammer(event, data) {
        mouse_hit_Data.Instance().AutoHammer = event.isChecked;
        if (event.isChecked) {
            this.autoSpSkeNode.clearTracks();
            this.autoSpSkeNode.setAnimation(0, 'pause', true);
        } else {
            this.autoSpSkeNode.clearTracks();
            this.autoSpSkeNode.setAnimation(0, 'start', false);
            this.autoHammerList = [];
            this.autoHammerCd = 0;
        }

    },
    //大奖动画播放
    playBigReward(data) {
        let rewardSpine = cc.find('bigWin/spineNode', this.bigRewardNode).getComponent(sp.Skeleton);
        let goldText = cc.find('bigWin/goldP/gold', this.bigRewardNode);
        let goldAni = goldText.getComponent(cc.Animation);
        this.bigRewardNode.active = true;
        rewardSpine.setAnimation(0, "animation", false);
        AudioManager.playSound(audioConfig.GAME_AWARD, false);
        goldText.getComponent(cc.Label).string = data.coin;
        goldText.active = true;
        goldAni.play("goldAni");
        rewardSpine.setCompleteListener(() => {
            this.bigRewardNode.active = false;
            goldText.getComponent(cc.Label).string = '';
            goldText.active = false;
            this.updateGold();
        })
    },
    //怒气值满了奖励
    playAngerReward(data) {
        let rewardSpine = cc.find('bigWin/spineNode', this.angerRewardNode).getComponent(sp.Skeleton);
        let goldText = cc.find('bigWin/gold', this.angerRewardNode);
        let goldAni = goldText.getComponent(cc.Animation);
        this.angerRewardNode.active = true;
        rewardSpine.setAnimation(0, "animation", false);
        AudioManager.playSound(audioConfig.GAME_AWARD, false);
        goldText.getComponent(cc.Label).string = `/${data}`;
        goldText.active = true;
        goldAni.play("goldAni");
        rewardSpine.setCompleteListener(() => {
            this.updateGold();
            this.angerRewardNode.active = false;
            goldText.active = false;
            this.angervalue = 0;
            this.ordinaryHammer.active = true;
            this.thorhHammer.active = false;
        })
    },
    //增加怒气
    addAngerValue(value) {
        // let totalAnger = 1000;
        if (this.angervalue >= this.totalAnger) {
            this.ordinaryHammer.active = false;
            this.thorhHammer.active = true;
        }
        let progress = (value / this.totalAnger).toFixed(1);
        let angerProgress = cc.find("angerProgressBar", this.angerNode).getComponent(cc.ProgressBar);
        angerProgress.progress = progress;
        // toFixed
    },
    // 设置牌
    setPokerBack(node, cardValue) {
        let paiAtlas = this.mouseAtlas;
        var value = cardValue % 100;
        var flower = Math.floor(cardValue / 100); // 1 2 3 4  方 梅 红 黑
        var hua_xiao = cc.find("pokerNode/huaXiao", node);
        var num = cc.find("pokerNode/huanum", node);
        switch (value) {
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
            case 12:
            case 13:
            case 14:
                if (flower % 2 == 0) {
                    num.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('ddz_b' + value.toString());
                }
                else {
                    num.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('ddz_r' + value.toString());
                }
                hua_xiao.getComponent(cc.Sprite).spriteFrame = paiAtlas.getSpriteFrame('hs_' + flower.toString());
                break;
        }

    },
    //设置任务
    setTaskData(data) {
        var panel = cc.find('bg/panels/panel1', this.taskNode);
        var cpt = cc.find('list', panel).getComponent('com_glistView');
        cpt.setDataProvider(data, 0, (itemNode, index) => {
            if (index < 0 || index >= data.length)
                return;
            var element = data[index];
            itemNode.tag = element.id;
            let taskCofi = mouseTaskConfig.getItem(function (item) {
                return item.key == element.id
            });
            let totalConfigNum = taskCofi.num;
            itemNode.getChildByName("doc Label").getComponent(cc.Label).string = `【疯狂打地鼠】中任意使用${totalConfigNum}次锤子`;
            itemNode.getChildByName("goldLabel").getComponent(cc.Label).string = `金币x${taskCofi.reward}`;
            itemNode.getChildByName("pro").getComponent(cc.Label).string = element.num;
            itemNode.getChildByName("prototal").getComponent(cc.Label).string = `/${totalConfigNum}`;
            let Progress = itemNode.getChildByName("fiishProgressBar").getComponent(cc.ProgressBar);
            Progress.progress = (element.num / totalConfigNum).toFixed(1)
            let finishBtn = itemNode.getChildByName("finish");
            cc.find("finish/desSprite", itemNode).getComponent(cc.Sprite).spriteFrame = this.taskWordsDes[element.state];
            if (element.state == 0 || element.state == 2) {
                finishBtn.getComponent(cc.Button).interactable = false;
                cc.dd.ShaderUtil.setGrayShader(finishBtn);
            } else {
                finishBtn.getComponent(cc.Button).interactable = true;
                cc.dd.ShaderUtil.setNormalShader(finishBtn);
            }
        });
        let noDrawList = data.find(item => item.state == 1);
        if (noDrawList) {
            this.allCollect.getComponent(cc.Button).interactable = true;
            cc.dd.ShaderUtil.setNormalShader(this.allCollect);
        } else {
            this.allCollect.getComponent(cc.Button).interactable = false;
            cc.dd.ShaderUtil.setGrayShader(this.allCollect);
        }
    },
    // 任务完成领取
    onClickFinish(event, data) {
        var taskId = event.target.parent.tag;
        mouse_hit_Data.Instance().getTaskId = taskId;
        mouse_send_msg.taskReq(null, taskId);
    },
    /** 获取把 node1移动到 node2位置后的坐标 */
    convertNodeSpaceAR(node1, node2) {
        return node1.parent.convertToNodeSpaceAR(node2.parent.convertToWorldSpaceAR(node2.position))
    },


    /////////////////////////////////////////消息通讯///////////////////////////////////
    onEventMessage: function (event, data) {
        switch (event) {
            case mouse_hit_Event.MOUSE_ROOM_INFO: //初始化游戏
                // this.schedule(this.mouseDisappear, 0.4); //老鼠消失定时器
                this.mouseShow(data);
                this.updateGold();
                this.updateMyInfo();
                break;
            case mouse_hit_Event.MOUSE_SHOW:      //老鼠显示
                this.mouseShow(data);
                break;
            case mouse_hit_Event.MOUSE_HIT_RESULT: //敲击的结果 
                if (data.drum) {
                    // this.scheduleOnce(() => {
                    this.setLightningShock(data)
                    // }, 0.5)
                }
                if (parseInt(data.useHammerId) == 8 && mouse_hit_Data.Instance().myAnger == 0) {
                    this.playAngerReward(data.rewardCoin);
                }
                this.showResult(data);
                this.updateGold();
                this.updateMyInfo();
                break;
            case mouse_hit_Event.MOUSE_REDGAG_RESULT://红包结果
                this.choiceRedBagResult(data);
                break;
            case mouse_hit_Event.MOUSE_DIS:   //老鼠消失
                let mouseDisNode = this.mouseNodes[data.holeId - 1];
                mouseDisNode.getComponent("mouse_hit_item").disaAppearMouseAni();
                break;
            case mouse_hit_Event.MOUSE_RECORD: //记录
                this.setRecordData(data);
                break;
            case mouse_hit_Event.MOUSE_TASK: //任务 
                this.setTaskData(data);
                this.updateGold();
                break;
            case mouse_hit_Event.MOUSE_POWER: //体力
                this.updateMyInfo();
                break;
            case Hall.HallEvent.Rank_Info_Game: //游戏排行榜
                var prefabPath = 'gameyj_mousehit/prefab/activeNode_rank';
                var UI = cc.dd.UIMgr.getUI(prefabPath);
                if (UI) {
                    UI.getComponent('mouse_rank').setData(data);
                }
                else {
                    cc.dd.UIMgr.openUI(prefabPath, function (ui) {
                        if (ui)
                            ui.getComponent('mouse_rank').setData(data);
                    }.bind(this))
                }

                break;
            //通用消息的处理
            case RoomEvent.on_room_leave:
                this.playerLeave(data[0]);
                break;
            case HallCommonEvent.HALL_NO_RECONNECT_GAME:
                mouse_hit_Data.Instance().clear();
                cc.dd.SceneManager.enterHall();
                break;
        }
    },
    //初始化游戏界面
    initGameUI() {
        cc.find("angerTotal", this.angerNode).getComponent(cc.Label).string = `/${this.maxAnger}`;
        cc.find("strengTotal", this.powerNode).getComponent(cc.Label).string = `/${this.maxPower}`;
        if (this.myName) {
            this.myName.string = cc.dd.Utils.substr(hallData.getInstance().nick, 0, 5);
            var cpt = cc.dd.Utils.seekNodeByName(this.node, "headNode").getComponent('klb_hall_Player_Head'); //设置头像
            cpt.initHead(hallData.getInstance().openId, hallData.getInstance().headUrl, 'mouse_hit_head_init');
        };
        for (let i = 0; i < this.quickHammerContent.children.length; i++) {
            let hammerGold = cc.find("mousehammer/numLabel", this.quickHammerContent.children[i]).getComponent(cc.Label);
            hammerGold.string = this.hammergoldList[i].gold;
        }
    },
    //展示老鼠
    mouseShow(data) {
        let mouseList = data;
        var stepTime = 0.1;
        var delayTime = 0;
        for (let i = 0; i < mouseList.length; i++) {
            let itemData = mouseList[i];
            let itemNode = this.mouseNodes[itemData.holeId - 1];
            var cpt = itemNode.getComponent("mouse_hit_item");
            if (i > 0) {
                delayTime += stepTime;
            }
            cpt.setData(itemData, delayTime);
        }

    },
    //老鼠消失并清除
    mouseMoveAniPlay(dataNode) {
        var mouserAnswerAni = dataNode.getComponent(cc.Animation);
        var mouseIsExist = cc.find("spskeNode", dataNode);
        // if (mouseIsExist.children) {
        mouserAnswerAni.off('finished', null);
        mouserAnswerAni.on("finished", () => {
            mouseIsExist.destroyAllChildren();
        }, this);
        mouserAnswerAni.play("mousemoveback");
        // }

    },
    //更新自己的信息
    updateMyInfo() {
        let myAnger = mouse_hit_Data.Instance().myAnger;
        let myPower = mouse_hit_Data.Instance().myPower;
        if (myAnger >= this.maxAnger) {
            this.ordinaryHammer.active = false;
            this.thorhHammer.active = true;
        } else {
            this.ordinaryHammer.active = true;
            this.thorhHammer.active = false;
        }
        let AngerValue = (myAnger / this.maxAnger).toFixed(3);
        let PowerValue = (myPower / this.maxPower).toFixed(3);
        let angerProgress = cc.find("angerProgressBar", this.angerNode).getComponent(cc.ProgressBar);
        let powerProgress = cc.find("strengProgressBar", this.powerNode).getComponent(cc.ProgressBar);
        cc.find("angerLabel", this.angerNode).getComponent(cc.Label).string = myAnger;
        cc.find("strengLabel", this.powerNode).getComponent(cc.Label).string = myPower;
        angerProgress.progress = AngerValue;
        powerProgress.progress = PowerValue;
    },
    //更新金币
    updateGold() {
        this.coinNode.getComponent(cc.Label).string = mouse_hit_Data.Instance().myCoin;
    },
    //显示结果动画
    showResult(msg) {
        let data = msg.resultList;
        let isDrum = msg.drum;
        if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                let itemData = data[i];
                let HitMouse = this.mouseNodes[itemData.holeId - 1];
                var cpt = HitMouse.getComponent("mouse_hit_item");
                if (cpt) {
                    cpt.showMouseResult(itemData, isDrum);
                }
            }
        }
    },
    coinFly(node, data) {
        var coinNode = cc.find('nodeMouse/baozhangReward', this.node);
        var coinNum = cc.find("baozhangshuGold/goldLabel", coinNode).getComponent(cc.Label);
        var baoZhangSpNode = cc.find("baozhangshuGold/baozhangSp", coinNode);
        var baoZhangAni = coinNode.getComponent(cc.Animation);
        var coinNodeAni = cc.find("baozhangshuGold", coinNode).getComponent(sp.Skeleton);
        var moveToPos = this.convertNodeSpaceAR(node, coinNode);
        var scaleTo = cc.scaleTo(0.5, 0.2, 0.2)
        var moveTo = cc.moveTo(0.5, moveToPos);
        var count = 0;
        var totalGold = 0;
        var callBack = () => {
            if (count == data.oddsList.length) {
                this.unschedule(callBack);
                cc.find("gold", baoZhangSpNode).getComponent(cc.Label).string = `:${data.coin}`;
                baoZhangSpNode.active = true;
                baoZhangAni.off('finished', null);
                baoZhangAni.on("finished", () => {
                    coinNode.active = false;
                    coinNum.string = "";
                    baoZhangSpNode.active = false;
                }, this);
                baoZhangAni.play("baozhangReward");
            } else {
                let hammerFrom = this.hammergoldList.find((item, ind) => ind == this.HammerIndex);
                let configGold = hammerFrom.gold;
                totalGold += configGold * data.oddsList[count];
                coinNum.string = `:${totalGold}`;
                coinNodeAni.clearTracks();
                coinNodeAni.setAnimation(0, "animation_01", false);
                AudioManager.playSound(audioConfig.GAME_COIN, false);
                count++;
            }

        };
        var action = cc.sequence(cc.delayTime(0), cc.spawn(moveTo, scaleTo), cc.callFunc(() => {
            node.active = false;
            coinNode.active = true;
            coinNodeAni.setAnimation(0, "animation", true);
            count = 0;
            totalGold = 0;
            // this.unschedule(callBack);
            this.schedule(callBack, 1);
        }));
        node.runAction(action)
    },
    //获奖一般奖项金币动画
    mouseGetReward(data) {
        let rewardMouse = this.mouseReward[data.holeId - 1];
        rewardMouse.destroyAllChildren();
        if (data.mouseId == 7001) {//宝藏鼠
            let treasureNodeAni = cc.instantiate(this.treasureReward);
            treasureNodeAni.parent = rewardMouse;
            let baoZhangCoin = cc.find("treasureAni", treasureNodeAni);
            let baoZhangAni = baoZhangCoin.getComponent(sp.Skeleton);
            rewardMouse.active = true;
            baoZhangCoin.active = true;
            baoZhangAni.clearTracks();
            baoZhangAni.setAnimation(0, "animation", false);
            AudioManager.playSound(audioConfig.GAME_AWARD, false);
            baoZhangAni.setCompleteListener(() => {
                this.coinFly(baoZhangCoin, data);
            })
        } else {
            if (data.oddsList[0] <= 50) {
                let coinBlast = cc.instantiate(this.samllMiddleReward);
                coinBlast.parent = rewardMouse;
                let rewardAni = cc.find("ani", coinBlast).getComponent(sp.Skeleton);
                let coinDes = cc.find("gold", coinBlast);
                let mouseSp = cc.find("pictureDes", coinBlast);
                let coinBlastAni = coinBlast.getComponent(cc.Animation);
                let coinAni = coinDes.getComponent(cc.Animation);
                coinDes.getComponent(cc.Label).string = data.coin;
                rewardMouse.active = true;
                rewardAni.node.active = true;
                // coinDes.active = true;
                rewardAni.clearTracks();
                if (data.oddsList[0] >= 10) {
                    rewardAni.setAnimation(0, "animation_01", false);
                } else {
                    rewardAni.setAnimation(0, "animation", false);
                }
                coinDes.active = true;
                coinAni.play("goldAni");
                AudioManager.playSound(audioConfig.GAME_AWARD, false);
                if (data.mouseId == 5001 || data.mouseId == 6001) {
                    let desIndex = data.mouseId == 5001 ? 0 : 1;
                    mouseSp.getComponent(cc.Sprite).spriteFrame = this.bigMouseSp[desIndex];
                    mouseSp.active = true;
                    coinBlastAni.play("coinBlastMove");
                }
                rewardAni.setCompleteListener(() => {
                    rewardMouse.active = false;
                    rewardMouse.removeAllChildren();
                })
            } else {
                this.playBigReward(data);
            }

        }

    },

    //闪电电击
    setLightningShock(data) {
        let lightNode = this.Lightning[data.holeId - 1];
        let result = data.resultList;
        let lightSpot = cc.find("flash", lightNode).getComponent(sp.Skeleton);
        lightSpot.node.active = true;
        lightSpot.clearTracks();
        lightSpot.setAnimation(0, "animation", false);
        let SpotEnd = () => {
            for (let i = 0; i < result.length; i++) {
                let index = result[i].holeId;
                if (index == data.holeId) {
                    continue;
                }
                let lightningSpine = cc.find(`light_${index}`, lightNode).getComponent(sp.Skeleton);
                if (lightningSpine) {
                    lightningSpine.node.active = true;
                    lightningSpine.clearTracks();
                    lightningSpine.setAnimation(0, "animation", false);
                    // AudioManager.playSound(audioConfig.GAME_LIGHT, false);
                }

            }
        };
        SpotEnd()
    },
    ///////////////////////////////////处理消息事件的函数/////////////////////////////////////////////////
    playerLeave(data) {
        if (data.userId == cc.dd.user.id) {
            if (data.coinRetCode) {
                var str = '';
                switch (data.coinRetCode) {
                    case 1:
                        str = '持有金币低于房间限制，即将被移出房间';
                        break;
                    case 2:
                        str = '您的金币超过房间最高携带金币';
                        break;
                    case 3:
                        str = '您长时间未操作，系统暂时将您移除房间';
                        break;
                    case 4:
                        str = '服务器已关闭，请稍后重试';
                        break;
                }
                var func = function () {
                    mouse_hit_Data.Instance().clear();
                    cc.dd.SceneManager.enterHall();
                }.bind(this);
                cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_TANCHUANG, function (ui) {
                    ui.getComponent("jlmj_popup_view").show(str, func, 2);
                }.bind(this));
            }
            else {
                mouse_hit_Data.Instance().clear();
                cc.dd.SceneManager.enterHall();
            }
        }
    },
    ///////////////////////////////////////主界面点击事件////////////////////////////////////////////////
    //点击更多的菜单
    onClickMore(event, custom) {
        hall_audio_mgr.com_btn_click();
        switch (custom) {
            case "more":
                this.menuNode.active = !this.menuNode.active;
                break;
            case "setting":
                cc.dd.UIMgr.openUI('gameyj_mousehit/prefab/mouse_hit_setting', function (ui) {
                    ui.setLocalZOrder(3000);
                }.bind(this));

                this.menuNode.active = false;
                break;
            case "rule":
                this.guiZeNode.active = !this.guiZeNode.active;
                this.menuNode.active = false;
                break;
            case "quit":
                this.menuNode.active = false;
                this.sendLeaveRoom();
                break;
        }
    },
    //点击游戏记录
    onClickRecord(event, data) {
        if (data == "open") {
            mouse_send_msg.mouseRecordReq(1);
            this.rewardRecord.active = true;
            this.leftBtn.active = false;
            this.schedule(this.reqRecord, 10)
        } else {
            this.rewardRecord.active = false;
            this.leftBtn.active = true;
            this.unschedule(this.reqRecord);
        }
    },
    reqRecord() {
        mouse_send_msg.mouseRecordReq(1);
    },
    //设置游戏记录数据
    setRecordData(data) {
        var panel = cc.find('rewardRecord/panels/panel1', this.node);
        var cpt = cc.find('list', panel).getComponent('com_glistView');
        cpt.setDataProvider(data.reList, 0, (itemNode, index) => {
            if (index < 0 || index >= data.reList.length)
                return;
            var element = data.reList[index];
            var date = new Date(element.time).format("HH:mm:ss");
            itemNode.getChildByName("timelabel").getComponent(cc.Label).string = date;
            itemNode.getChildByName("desLabel").getComponent(cc.RichText).string = `你获得了<color=#ffff00>${this.changeNumToCHN(element.coin)}</c>金币`;
        })
    },
    /**
  * 筹码数字转换
  */
    changeNumToCHN: function (num) {
        var str = '';
        if (num >= 100000000) {
            str = (num / 100000000.00).toFixed(1) + '亿';
        } else if (num >= 10000000) {
            str = (num / 10000000.00).toFixed(1) + '千万';
        } else if (num >= 100000) {
            str = (num / 10000.00).toFixed(1) + '万';
        } else {
            str = num;
        }
        return str;
    },
    //关闭按钮
    onClickBgMask(event, data) {
        switch (data) {
            case "closeQuick":
                this.quickHammerNode.active = false;
                break;
        }
    },
    //离开房间发送消息
    sendLeaveRoom() {
        var msg = new cc.pb.room_mgr.msg_leave_game_req();
        var gameType = RoomMgr.Instance().gameId;
        var roomId = RoomMgr.Instance().roomId;
        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType(gameType);
        gameInfoPB.setRoomId(roomId);
        msg.setGameInfo(gameInfoPB);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);
    },
    //打开快选
    onClickQuick() {
        this.quickHammerNode.active = true;
    },
    //选择锤子加减
    onClickChiceHammer(event, data) {
        hall_audio_mgr.com_btn_click();
        if (mouse_hit_Data.Instance().myAnger >= this.maxAnger) {
            cc.dd.PromptBoxUtil.show('请先使用雷神之锤再切换!');
            return;
        }
        if (data == "right") {
            this.HammerIndex++;
            this.HammerIndex = this.HammerIndex > 6 ? 0 : this.HammerIndex
        } else {
            this.HammerIndex--;
            this.HammerIndex = this.HammerIndex < 0 ? 6 : this.HammerIndex
        }
        mouse_hit_Data.Instance().ordinaryHammerId = this.HammerIndex;
        this.hammerSp.getComponent(cc.Sprite).spriteFrame = this.selecthammer[this.HammerIndex];
        let hammerInfo = this.hammergoldList.find((item, index) => this.HammerIndex == index);
        cc.find("selectHammer/nomalHammer/gold", this.node).getComponent(cc.Label).string = hammerInfo.gold;
        this.quickHammerContent.children[this.HammerIndex].getComponent(cc.Toggle).check();
    },
    //快捷选锤子
    onClickQuickHammer(event, custom) {
        hall_audio_mgr.com_btn_click();
        if (mouse_hit_Data.Instance().myAnger >= this.maxAnger) {
            cc.dd.PromptBoxUtil.show('请先使用雷神之锤再切换!');
            return;
        }
        var idx = parseInt(custom);
        this.HammerIndex = idx;
        mouse_hit_Data.Instance().ordinaryHammerId = idx;
        this.hammerSp.getComponent(cc.Sprite).spriteFrame = this.selecthammer[this.HammerIndex];
        let hammerInfo = this.hammergoldList.find((item, index) => this.HammerIndex == index);
        cc.find("selectHammer/nomalHammer/gold", this.node).getComponent(cc.Label).string = hammerInfo.gold;
    },
    //点击任务
    onClickTask(event, custom) {
        hall_audio_mgr.com_btn_click();
        if (custom == 'close') {
            this.taskNode.active = false;
        } else {
            mouse_send_msg.taskReq(1, null)
            this.taskNode.active = true;
        }
    },
    //显示排行榜
    showActiveGameRank() {
        hall_audio_mgr.com_btn_click();
        var gameId = 110;
        var prefabPath = 'gameyj_mousehit/prefab/activeNode_rank';
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
    //一键领取奖励
    teskAllCollect() {
        hall_audio_mgr.com_btn_click();
        let list = mouse_hit_Data.Instance().taskList.filter((item) =>
            item.state == 1
        );
        for (var i = 0; i < list.length; i++) {
            mouse_hit_Data.Instance().getTaskId = list[i].id;
            mouse_send_msg.taskReq(null, list[i].id);
            cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'msg_mouse_task');
        }
    },
    //展示播报信息
    showNotice() {
        this.playBackTimes = 1;
        this.playSpeed = 5;
        this.noticeStr.string = "恭喜玩家<color=#43ff3e>废话贩卖枧</c>在<color=#cb6921>一天二笔青年欢乐多多,有事无事喜欢搞事</c>";
        var parentNode = this.noticeStr.node.parent;
        this.AnimStart = parentNode.width / 2;
        this.noticeStr.node.x = this.AnimStart;
        this.AnimEnd = this.AnimStart - this.noticeStr.node.width - parentNode.width;
        this.noticeMesge.active = true;
    },
    update: function (dt) {
        if (mouse_hit_Data.Instance().AutoHammer) {
            if (this.autoHammerCd <= 0 && this.autoHammerList.length) {
                let autoItem = this.autoHammerList[0];
                let mouseItem = this.mouseNodes[autoItem.holeId - 1];
                var mouseItemJs = mouseItem.getComponent("mouse_hit_item");
                var isButn = mouseItemJs.mouseBtn.interactable;
                if (isButn && mouse_hit_Data.Instance().isCanHammer) {
                    mouseItemJs.onClickMouse(null, autoItem.holeId);
                    this.autoHammerCd = autoItem.mouseId == 2001 ? 0.7 : 0.5;
                }
                this.autoHammerList.splice(0, 1);
            } else {
                this.autoHammerCd -= dt;
            }
        }
    },
    lateUpdate: function (dt) {
        if (this.noticeMesge.active) {
            if (this.playBackTimes > 0) {
                if (this.noticeStr.node.x > this.AnimEnd) {
                    this.noticeStr.node.x -= this.playSpeed;
                } else {
                    this.noticeStr.node.x = this.AnimEnd;
                    this.playBackTimes--;
                    this.noticeMesge.active = false
                }

            }
        } else {
            // this.showNotice()
        }
    }

});
