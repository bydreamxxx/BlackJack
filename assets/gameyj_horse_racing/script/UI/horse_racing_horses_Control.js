//create by wj 2020/12/29
const gameType = require('horse_racing_Config').HorseRacingGameConfig;
var gameData = require('horse_racing_Data').Horse_Racing_Data.Instance();
const gameAudioPath = require('horse_racing_Config').AuditoPath;
const audioConfig = require('horse_audio');
var hallData = require('hall_common_data').HallCommonData;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
const childNameList = ['start_shadow', 'start_1_1', 'horse1', 'start_1_2', 'horse2', 'start_1_3', 'horse3', 'start_1_4', 'horse4', 'start_3_1', 'start_3_2', 'horse5', 'start_2', 'horse6', 'start_1_1_1', 'start_top', 'out_2', 'flash'];

cc.Class({
    extends: cc.Component,

    properties: {
        m_tHorsesNodeList: { default: [], type: cc.Node, tooltip: '马匹' },
        m_tHorseCptList: { default: [], type: cc.Component, tooltip: '马匹的脚本组件' },
        m_tHorseMoveCptList: { default: [], type: cc.Component, tooltip: '马匹的脚本组件' },
        m_fTimer: 0,
        m_tLTotalTimer: [],
        m_tTTotalTimer: [],
        m_tRTotalTimer: [],
        m_bPlayAct: false,
        m_nCountdownTime: 10,
        m_oFunctionUI: cc.Node,
        m_oMoveNode: cc.Node,

        m_bPlayStart: false,
        m_nAduioControlTime: 0,
        m_bplayBeginAudio: false,
        m_bplayLeftAudio: false,
        m_bplayTurnAudio: false,
        m_bPlayResultAudio: false,

        m_tShuNodeList: { default: [], type: cc.Node, tooltip: '马叔解说动画' },
        m_nLastShuIndex: 0,

        m_tResultNode: { default: [], type: cc.Node, tooltip: '结果显示节点' },
        m_oFontAtals: cc.SpriteAtlas,
        m_oWinNode: cc.Node,
        m_oFailNode: cc.Node,
        m_oBigWinNode: cc.Node,

        m_tHorseBetNodeList: { default: [], type: cc.Node, tooltip: '自己下注数据' },
        m_oCountDownTxt: cc.Animation,
        m_oShadowNode: cc.Node,

        resultNode: cc.Node,
        mapNode1: cc.Node,
        mapNode2: cc.Node,
        shuNode: cc.Node,
        flashNode: cc.Node,
    },

    onLoad() {
        this.m_oRoundTxt = cc.dd.Utils.seekNodeByName(this.node, 'roundTxt').getComponent(cc.Label); //场次描述
        this.m_oRoundTxt.string = '第' + gameData.getRoundId() + '场'; //场次描述

        this.m_oUserGold = cc.dd.Utils.seekNodeByName(this.node, "goldTxt").getComponent(cc.Label); //玩家金币
        this.m_oUserGold.string = this.convertChipNum(gameData.getCoin(), 1);

        this.m_oName = cc.dd.Utils.seekNodeByName(this.node, "nameTxt").getComponent(cc.Label); //设置名字
        if (this.m_oName)
            this.m_oName.string = cc.dd.Utils.substr(hallData.getInstance().nick, 0, 7);
        var cpt = cc.dd.Utils.seekNodeByName(this.node, "playerHead").getComponent('klb_hall_Player_Head'); //设置头像
        cpt.initHead(hallData.getInstance().openId, hallData.getInstance().headUrl, 'horse_race_head_init');

        var count = 0;
        for (var i = 0; i < 6; i++) {//初始化马匹下注信息
            for (var j = i + 1; j < 7; j++) {
                if (count == 0) {
                    this.m_tHorseBetNodeList[count] = cc.dd.Utils.seekNodeByName(this.node, 'ownBetInfoNode');
                } else {
                    let node = cc.dd.Utils.seekNodeByName(this.node, 'ownBetInfoNode');
                    let ownNode = cc.instantiate(node);
                    this.m_tHorseBetNodeList[count] = ownNode;
                    node.parent.addChild(ownNode);
                }
                this.m_tHorseBetNodeList[count].tag = i * 10 + j
                if (this.m_tHorseBetNodeList[count])
                    this.m_tHorseBetNodeList[count].active = false;
                count++;
            }
        }

        // this._changeZorder = false;
        this._adjustRightRun = false;
        this._rightHorseList = [];

        this.m_tHorsesStartPosList = [{ x: 785, y: 103 }, { x: 805, y: 79 }, { x: 825, y: 45 }, { x: 845, y: 5 }, { x: 865, y: -45 }, { x: 885, y: -85 }];
        this.m_tHorsesWaitStartPosList = [{ x: 315, y: 103 }, { x: 335, y: 79 }, { x: 355, y: 45 }, { x: 375, y: 5 }, { x: 395, y: -45 }, { x: 415, y: -85 }];

        let node = cc.find('mainNode/startNode', this.node);
        for (let i = 0; i < node.children.length; i++) {
            let tag = childNameList.indexOf(node.children[i].name);
            node.children[i].setLocalZOrder(tag);
            node.children[i].tag = tag;
        }

        let maps = ['1_1', '1_2', '2_1', '2_2', '3_1', '3_2', '4_1', '4_2', '5_1', '5_2', '6_1', '6_2', '7_1', '8_1', '9_1']
        this.loadHorse(1, node);
        this.loadMaps(maps);
        this.loadShu(0);

        this.countDownState = 0;
    },

    loadHorse(horse, parent) {
        if (horse <= 6) {
            cc.dd.ResLoader.loadGameStaticRes(`gameyj_horse_racing/prefabs/horse${horse}`, cc.Prefab, function (prefab) {
                if (!cc.isValid(this.node)) {
                    return;
                }
                let node = cc.instantiate(prefab);
                parent.addChild(node);
                this.m_tHorsesNodeList.push(node);
                this.m_tHorseCptList.push(node.getComponent('horse_racing_horse_Animation')); //保存帧动画
                this.m_tHorseMoveCptList.push(node.getComponent('horse_racing_horse_Move')); //保存运动动画
                node.setPosition(this.m_tHorsesStartPosList[horse - 1]);
                let tag = childNameList.indexOf(node.name);
                node.tag = tag;
                node.setLocalZOrder(tag);
                this.loadHorse(horse + 1, parent);
            }.bind(this));
        }
    },

    loadMaps(maps) {
        if (maps.length > 0) {
            let map = maps.shift();
            cc.dd.ResLoader.loadGameStaticRes(`gameyj_horse_racing/prefabs/MapNode${map}`, cc.Prefab, function (prefab) {
                if (!cc.isValid(this.node)) {
                    return;
                }
                let node = cc.instantiate(prefab);
                if (map[2] == '2') {
                    this.mapNode2.addChild(node);
                } else {
                    this.mapNode1.addChild(node);
                }
                this.loadMaps(maps);
            }.bind(this));
        }
    },

    loadShu(shu) {
        if (shu <= 8) {
            cc.dd.ResLoader.loadGameStaticRes(`gameyj_horse_racing/prefabs/Shu_a0${shu}`, cc.Prefab, function (prefab) {
                if (!cc.isValid(this.node)) {
                    return;
                }
                let node = cc.instantiate(prefab);
                this.shuNode.addChild(node);
                this.m_tShuNodeList.push(node);
                if (shu == 0) {
                    this.m_tShuNodeList[this.m_nLastShuIndex].active = true;
                    // var shuAnim = this.m_tShuNodeList[0].getComponent(cc.Animation);
                    // shuAnim.play('shu_a00_Standby');
                }
                this.loadShu(shu + 1);
            }.bind(this));
        }
    },

    // resetUI(){
    //     if(this._isOnLoadCalled){
    //         this.m_oRoundTxt.string = '第' + gameData.getRoundId() + '场'; //场次描述
    //         this.m_oUserGold.string =  this.convertChipNum(gameData.getCoin(), 1);
    //
    //         for(var i = 0; i < 21; i++){//初始化马匹下注信息
    //             this.m_tHorseBetNodeList[i].active = false;
    //         }
    //
    //         this.m_oFunctionUI.active = false;
    //
    //         this.m_oMoveNode.setPosition(cc.v2(0,0));
    //
    //         for(var i = 0; i < 6; i++){
    //             if(this.m_tHorsesNodeList[i]){
    //                 this.m_tHorseCptList[i].resetHorse();
    //                 this.m_tHorseCptList[i].setCurrentAtls(gameType.RunState.Begin);
    //
    //                 this.m_tHorseMoveCptList[i].resetHorse();
    //                 this.m_tHorseMoveCptList[i].setRunState(gameType.RunState.Begin);
    //                 this.m_tHorseMoveCptList[i]._changeZorder = false;
    //                 this.m_tHorsesNodeList[i].setPosition(this.m_tHorsesStartPosList[i]);
    //                 this.m_tHorseMoveCptList[i].node.setLocalZOrder(this.m_tHorseMoveCptList[i].node.tag);
    //             }
    //         }
    //         if(this.m_oPlayCountdownTimeAudio){
    //             clearTimeout(this.m_oPlayCountdownTimeAudio);
    //             this.m_oPlayCountdownTimeAudio = null;
    //         }
    //         if(this.showResultTimeout){
    //             clearTimeout(this.showResultTimeout);
    //             this.showResultTimeout = null;
    //         }
    //         if(this.replayTimeout){
    //             clearTimeout(this.replayTimeout);
    //             this.replayTimeout = null;
    //         }
    //         if(this.showOwnResultTimeout){
    //             clearTimeout(this.showOwnResultTimeout);
    //             this.showOwnResultTimeout = null;
    //         }
    //         if(this.bigWinTimeout){
    //             clearTimeout(this.bigWinTimeout);
    //             this.bigWinTimeout = null;
    //         }
    //
    //         this.m_tResultNode = [];
    //         this.m_oWinNode = null;
    //         this.m_oFailNode = null;
    //         this.m_oBigWinNode = null;
    //         this.resultNode = null;
    //         cc.dd.UIMgr.destroyUI('gameyj_horse_racing/prefabs/ResultNode');
    //
    //         this.m_bPlayStart = false;
    //         this.m_fTimer = 0;
    //
    //         this.m_nAduioControlTime = 0;
    //         this.m_bplayBeginAudio = false;
    //         this.m_bplayLeftAudio = false;
    //         this.m_bplayTurnAudio = false;
    //         this.m_bPlayResultAudio = false;
    //         this.isPlayingCamera = false;
    //         this.m_bPlayRightAudio1 = false;
    //         this.m_bPlayRightAudio2 = false;
    //
    //         this._adjustRightRun = false;
    //         this._rightHorseList = [];
    //         this.countDownState = 0;
    //     }
    // },

    onDisable() {
        if (this.m_oPlayCountdownTimeAudio) {
            clearTimeout(this.m_oPlayCountdownTimeAudio);
            this.m_oPlayCountdownTimeAudio = null;
        }
        if (this.showResultTimeout) {
            clearTimeout(this.showResultTimeout);
            this.showResultTimeout = null;
        }
        if (this.replayTimeout) {
            clearTimeout(this.replayTimeout);
            this.replayTimeout = null;
        }
        if (this.showOwnResultTimeout) {
            clearTimeout(this.showOwnResultTimeout);
            this.showOwnResultTimeout = null;
        }
        if (this.bigWinTimeout) {
            clearTimeout(this.bigWinTimeout);
            this.bigWinTimeout = null;
        }
        cc.dd.UIMgr.destroyUI('gameyj_horse_racing/prefabs/ResultNode');
    },

    update(dt) {
        if (this.m_bPlayStart) {
            this.m_fTimer += dt;

            if (this.m_fTimer >= 5 && this.countDownState == 0) {
                let id = AudioManager.playMusicNotControlledBySwitch(gameAudioPath + 'horse_background_03_v01', false);
                cc.audioEngine.setFinishCallback(id, () => {
                    AudioManager.playMusicNotControlledBySwitch(gameAudioPath + 'horse_background_04_v02', false);
                })
                this.countDownState = 1;
            } else if (this.m_fTimer >= 6 && this.countDownState == 1) {
                this.playAudio(12, false); //每秒倒计时
                // this.m_oCountDownTxt.spriteFrame = this.m_oFontAtals.getSpriteFrame('a' + this.m_nCountdownTime);
                this.m_oCountDownTxt.setCurrentTime(0, 'sm_kcdjs_go');
                this.m_oCountDownTxt.play('sm_kcdjs_go');
                this.m_oCountDownTxt.node.active = true;
                this.countDownState = 2;
            } else if (this.m_fTimer >= 7 && this.countDownState == 2) {
                this.playAudio(12, false); //每秒倒计时
                this.countDownState = 3;
            } else if (this.m_fTimer >= 8 && this.countDownState == 3) {
                this.playAudio(12, false); //每秒倒计时
                this.countDownState = 4;
            } else if (this.m_fTimer >= 9 && this.countDownState == 4) {
                this.playAudio(13, false); //吹哨声音
                this.countDownState = 5;
            } else if (this.m_fTimer >= 10 && this.countDownState == 5) {
                this.m_oCountDownTxt.setCurrentTime(0, 'sm_kcdjs_go');
                this.m_oCountDownTxt.stop('sm_kcdjs_go');
                this.m_oCountDownTxt.node.active = false;
                this.countDownState = 6;
            }

            if (this.m_fTimer >= 9 && gameData.getRunState() == gameType.RunState.Wait) {
                for (var i = 0; i < 6; i++) {
                    this.m_tHorseCptList[i].setSample(30);
                    this.m_tHorseCptList[i].setCurrentAtls(gameType.RunState.LeftRun);

                    var rank = gameData.getRunRankListByIndex(1, i + 1);//左跑道顺序获取;
                    var rank1 = gameData.getRunRankListByIndex(2, i + 1);//弯道道顺序获取;
                    var rank2 = gameData.getRunRankListByIndex(3, i + 1); //右跑道顺序获取
                    this.m_tHorseCptList[i].setTrunSpeed(this.m_tTTotalTimer[5 - rank1]);
                    this.m_tHorseMoveCptList[i].setRank(rank + 1);
                    this.m_tHorseMoveCptList[i].setRunInfo(this.m_tLTotalTimer[rank], this.m_tRTotalTimer[rank2]);
                    this.m_tHorseMoveCptList[i].setRunState(gameType.RunState.LeftRun);
                }
                gameData.setRunState(gameType.RunState.LeftRun);
            } else {
                this.setCameraPosition();
            }
            if (gameData.getRunState() == gameType.RunState.LeftRun) { //开始进度
                if (!this.m_bplayBeginAudio) {
                    this.playBeginAudio();
                    this.m_bplayBeginAudio = true;
                } else {
                    if (!this.m_bplayLeftAudio)
                        this.m_nAduioControlTime += dt;
                }

                if (this.m_nAduioControlTime >= 4 && !this.m_bplayLeftAudio) { //播放左道进度
                    this.playLeftAudio();
                    this.m_bplayLeftAudio = true;
                    this.m_nAduioControlTime = 0;
                }
            } else if (gameData.getRunState() == gameType.RunState.TurnRun) {//弯道进度
                this.m_nAduioControlTime += dt;
                if (this.m_nAduioControlTime >= 0 && !this.m_bplayTurnAudio) {
                    this.changeHorseSpeed();
                    this.playTurnAudio();
                    this.m_bplayTurnAudio = true;
                    this.m_nAduioControlTime = 0;
                }
            } else if (gameData.getRunState() == gameType.RunState.RightRun) {//右跑道
                if (!this.m_bPlayRightAudio1 && this.m_nAduioControlTime > 6) {
                    this.playRightAudio1();
                    this.m_bPlayRightAudio1 = true;
                } else {
                    if (!this.m_bPlayRightAudio2)
                        this.m_nAduioControlTime += dt;
                }
                if (this.m_nAduioControlTime >= 9 && !this.m_bPlayRightAudio2 && this.m_bPlayRightAudio1) {
                    this.m_bPlayRightAudio2 = true;
                    this.playRightAudio2();
                    this.m_nAduioControlTime = 0;
                    this.adjustFirstAndSecondHorse();
                }

                //根据马匹运动情况更新到达终点的时间
                if (!this._adjustRightRun) {
                    this.m_tHorseMoveCptList.forEach((horse) => {
                        if (horse.node.x >= -6839 && this._rightHorseList.indexOf(horse.m_nHorseId) == -1) {//进入朝右跑阶段的马
                            this._rightHorseList.push(horse.m_nHorseId);
                        }
                    })

                    if (this._rightHorseList.length == 6) {//所有马都进入朝右跑阶段
                        this._adjustRightRun = true;
                        let timeList = [];
                        this.m_tHorseMoveCptList.forEach((horse) => {
                            let v = horse.m_rSpeed;
                            let a = horse.m_fRAcceleration;
                            let s = Math.sqrt(Math.pow((4000 - horse.node.getPositionX()), 2));
                            let t = (Math.sqrt(Math.pow(v, 2) + 2 * a * s) - v) / a;//根据当前速度、加速度、距离得到每匹马到终点所需的时间
                            timeList.push(t);
                        })

                        timeList.sort((a, b) => {
                            if (a < b) {
                                return -1;
                            }
                            if (a > b) {
                                return 1;
                            }
                            return 0;
                        })


                        let horseList = gameData.getFirstHorse();
                        let temptime = this.m_tHorseMoveCptList[horseList[0] - 1].m_fRunTimer;
                        if ((timeList[0] + temptime) != gameData.runRightTime) {
                            timeList.forEach((time) => {
                                time += (gameData.runRightTime - temptime);
                            })
                        }

                        this.m_tHorseMoveCptList.forEach((horse) => {
                            horse.adjustRightRunTime(timeList[horse.m_nRank - 1]);//重新分配时间，更新速度与加速度
                        })
                    }
                }
            }
        }
    },

    playerNumUpdate: function () {//更新玩家人数
        var node1 = cc.dd.Utils.seekNodeByName(this.node, 'role_num')
        node1.getComponent(cc.Label).string = gameData.getPlayerNum();
    },

    //更新金币显示
    updateGold: function () {
        // this.m_oUserGold.string =  this.convertChipNum(gameData.getCoin(), 1);

        let selfBet = 0;

        let betArea = gameData.getBetAreaList();
        betArea.forEach(function (data) {
            selfBet += data.sfBet;
        });

        this.m_oUserGold.string = this.convertChipNum(gameData.getCoin() - (gameData.getWin() + selfBet), 1);
    },

    //更新场次信息：
    updateRound: function () {
        this.m_oRoundTxt.string = '第' + gameData.getRoundId() + '场'; //场次描述
    },

    updateOwnBetInfo: function () {
        var betList = gameData.getBetAreaList();
        betList.forEach(function (info) {
            if (info.sfBet != 0) {
                var infoNode = this.findBetInfoNode(info.id);
                if (infoNode) {
                    infoNode.active = true;
                    infoNode.getChildByName('goldDesc').getComponent(cc.Label).string = info.sfBet;

                    var str = info.id > 10 ? (Math.floor(info.id / 10) + '/' + info.id % 10) : info.id;
                    infoNode.getChildByName('idDesc').getComponent(cc.Label).string = str + '号';
                }
            }
        }.bind(this));
    },

    findBetInfoNode: function (id) {//查找马匹下注节点
        var betNode = null;
        for (var i = 0; i < this.m_tHorseBetNodeList.length; i++) {
            var node = this.m_tHorseBetNodeList[i];
            if (node.tag == id) {
                betNode = node;
                return betNode;
            }
        }
        return betNode;
    },

    playRunAct: function () {
        this.m_oMoveNode.setPosition(cc.v2(0, 0));
        this.updateRound();
        this.updateGold();
        this.playerNumUpdate();
        this.updateOwnBetInfo();
        this.playAudio(18, false);

        for (var i = 0; i < 6; i++) {
            if (this.m_tHorsesNodeList[i]) {
                var sample = parseInt(Math.random() * (3 - 2 + 1) + 2, 10) * 10;
                this.m_tHorseCptList[i].setSample(sample);
                this.m_tHorseCptList[i].playLoop();

                this.m_tHorsesNodeList[i].setPosition(this.m_tHorsesStartPosList[i]);
                var timer = Math.random() * (3 - 1 + 1) + 1;
                var moveToAct = cc.moveTo(timer, cc.v2(this.m_tHorsesWaitStartPosList[i].x, this.m_tHorsesWaitStartPosList[i].y));
                this.m_tHorseMoveCptList[i].playAct(moveToAct);
            }
        }
        gameData.setRunState(gameType.RunState.Wait);
        this.m_bPlayStart = true;
        this.createRandomTime();

        // var countdowTime = ()=>{
        //     this.m_nCountdownTime -= 1;
        //     if(this.m_nCountdownTime == 4){
        //         let id = AudioManager.playMusicNotControlledBySwitch(gameAudioPath + 'horse_background_03_v01', false);
        //         cc.audioEngine.setFinishCallback(id, ()=>{
        //             AudioManager.playMusicNotControlledBySwitch(gameAudioPath + 'horse_background_04_v02', false);
        //         })
        //     }else if(this.m_nCountdownTime <= 3 && this.m_nCountdownTime > 0){
        //         this.playAudio(12, false); //每秒倒计时
        //         // this.m_oCountDownTxt.spriteFrame = this.m_oFontAtals.getSpriteFrame('a' + this.m_nCountdownTime);
        //         if(this.m_nCountdownTime == 3){
        //             this.m_oCountDownTxt.setCurrentTime(0, 'sm_kcdjs_go');
        //             this.m_oCountDownTxt.play('sm_kcdjs_go');
        //             this.m_oCountDownTxt.node.active = true;
        //         }
        //     }
        //     if(this.m_nCountdownTime == 0){
        //         // this.m_oCountDownTxt.spriteFrame = this.m_oFontAtals.getSpriteFrame('img_go');
        //         this.playAudio(13, false); //吹哨声音
        //     }
        //     if(this.m_nCountdownTime == -1){
        //         this.m_oCountDownTxt.setCurrentTime(0, 'sm_kcdjs_go');
        //         this.m_oCountDownTxt.stop('sm_kcdjs_go');
        //         this.m_oCountDownTxt.node.active = false;
        //         clearTimeout(this.m_oPlayCountdownTimeAudio);
        //         this.m_nCountdownTime = 10;
        //         return;
        //     }
        //
        //     this.m_oPlayCountdownTimeAudio = setTimeout(countdowTime, 1000);
        // }
        // countdowTime();
    },

    insert_sort: function (arryNum) {//排序6个时间
        for (var i = 1; i < 6; i++) {
            var temp = arryNum[i];
            var j = i;
            while (j > 0 && arryNum[j - 1] > temp) {
                arryNum[j] = arryNum[j - 1];
                j--
            }
            arryNum[j] = temp;
        }
    },

    createRandomTime: function () { //生成6个时间控制
        this.m_tLTotalTimer[0] = gameData.runLeftTime;
        this.m_tRTotalTimer[0] = gameData.runRightTime;
        this.m_tTTotalTimer[0] = 1;

        for (var i = 1; i < 6; i++) { //生成左道跑马时间
            var totalTime = Math.random() + gameData.runLeftTime;
            this.m_tLTotalTimer[i] = totalTime;
        }
        this.insert_sort(this.m_tLTotalTimer);

        for (var i = 1; i < 6; i++) { //生成转弯跑马时间
            var totalTime = parseInt(Math.random() * (2 - 1 + 1) + 1, 10) / 10;
            this.m_tTTotalTimer[i] = 1 - totalTime;
        }
        this.insert_sort(this.m_tTTotalTimer);

        for (var i = 1; i < 6; i++) { //生成右跑道跑马时间
            var totalTime = Math.random() + gameData.runRightTime;
            this.m_tRTotalTimer[i] = totalTime;
        }
        this.insert_sort(this.m_tRTotalTimer);
    },

    changeHorseSpeed: function () {
        this.m_tLSpeedList = []
        for (var i = 0; i < 6; i++) {
            var speed = this.m_tHorseMoveCptList[i].getNowLSpeed();
            this.m_tLSpeedList.push(speed);
            // this.m_tHorsesNodeList[i].setLocalZOrder(6 - this.m_tHorseMoveCptList[i].m_nHorseId + 1)
        }
        this.insert_sort(this.m_tLSpeedList);

        for (var i = 0; i < 6; i++) {
            var rank = gameData.getRunRankListByIndex(3, i + 1);//弯道道顺序获取;
            this.m_tHorseMoveCptList[i].setNowLSpeed(this.m_tLSpeedList[rank]);
        }
    },

    setCameraPosition: function () {//设置视觉点位置
        if (gameData.getRunState() == gameType.RunState.LeftRun) { //左跑道位置
            var maxPostionX = this.m_tHorsesNodeList[0].getPositionX();
            for (var i = 1; i < 6; i++) {
                if (this.m_tHorsesNodeList[i].getPositionX() < maxPostionX)
                    maxPostionX = this.m_tHorsesNodeList[i].getPositionX();
            }
            if (-maxPostionX > 0)
                this.m_oMoveNode.setPositionX(-maxPostionX);
        } else if (gameData.getRunState() == gameType.RunState.TurnRun) {
            if (this.isPlayingCamera) {
                return;
            }
            this.isPlayingCamera = true;
            let anim = this.m_oMoveNode.getComponent(cc.Animation);
            anim.play('camera');
            // var minPositionY = this.m_tHorsesNodeList[0].getPositionY();
            // var maxPostionX = this.m_tHorsesNodeList[0].getPositionX();
            //
            // for(var i = 1; i < 6; i++){
            //     if(this.m_tHorsesNodeList[i].getPositionY() < minPositionY)
            //     {
            //         minPositionY = this.m_tHorsesNodeList[i].getPositionY();
            //         maxPostionX = this.m_tHorsesNodeList[i].getPositionX();
            //     }
            //
            // }
            // if(minPositionY <= -90){
            //     if(this.m_oMoveNode.getPositionY() < 400){
            //         this.m_oMoveNode.setPositionY(this.m_oMoveNode.getPositionY()+4);
            //     }else{
            //         this.m_oMoveNode.setPositionY(400);
            //     }
            // }
            //
            // // if(minPositionY <= -300 && !this._changeZorder){
            // //     this._changeZorder = true;
            // //     for(var i = 0; i < 6; i++){
            // //         this.m_tHorsesNodeList[i].setLocalZOrder(6 - this.m_tHorseMoveCptList[i].m_nHorseId + 1)
            // //     }
            // // }
            //
            // if(minPositionY <= -300){//有马匹转弯过半
            //     for(var i = 1; i < 6; i++){
            //         //找出在下半区域的且位于最右的马
            //         if(this.m_tHorsesNodeList[i].getPositionX() > maxPostionX && this.m_tHorsesNodeList[i].getPositionY() <= -300)
            //             maxPostionX = this.m_tHorsesNodeList[i].getPositionX();
            //     }
            //     maxPostionX = (-maxPostionX > 7400 ? 7400 : -maxPostionX);
            //
            //     if(this.m_oMoveNode.getPositionX() > maxPostionX){
            //         this.m_oMoveNode.setPositionX(maxPostionX);
            //     }
            // }else{//没有马匹转弯过半，镜头持续向左
            //     for(var i = 1; i < 6; i++){
            //         if(this.m_tHorsesNodeList[i].getPositionX() < maxPostionX)
            //             maxPostionX = this.m_tHorsesNodeList[i].getPositionX();
            //     }
            //     maxPostionX = (-maxPostionX > 7400 ? 7400 : -maxPostionX);
            //     this.m_oMoveNode.setPositionX(maxPostionX);
            // }

        } else if (gameData.getRunState() == gameType.RunState.RightRun) {
            this.m_bPlayAct = false;
            var maxPostionX = this.m_tHorsesNodeList[0].getPositionX();
            for (var i = 1; i < 6; i++) {
                if (this.m_tHorsesNodeList[i].getPositionX() > maxPostionX)
                    maxPostionX = this.m_tHorsesNodeList[i].getPositionX();
            }
            maxPostionX = -maxPostionX < -4000 ? -4000 : -maxPostionX;
            this.m_oMoveNode.setPositionX(maxPostionX);
            if (maxPostionX == -4000 && !this.m_bPlayResultAudio) {
                this.playResultAduio();
                this.m_bPlayResultAudio = true;

                this.playAudio(10, false);
                this.flashNode.active = true;
                this.flashNode.runAction(cc.sequence(
                    cc.show(),
                    cc.delayTime(0.1),
                    cc.fadeOut(0.1)
                ));
            }
        }
    },

    playShuAnim: function (index, clipName, playTime) {
        playTime = playTime / 1000;

        let animation = this.m_tShuNodeList[this.m_nLastShuIndex].getComponent(cc.Animation);
        if (animation.currentClip) {
            let state = animation.getAnimationState(animation.currentClip._name);
            state.speed = 1;
            state.repeatCount = 1;
        }
        animation.stop();
        this.m_tShuNodeList[this.m_nLastShuIndex].active = false;

        this.m_tShuNodeList[index].active = true;
        var shuAnim = this.m_tShuNodeList[index].getComponent(cc.Animation);
        shuAnim.on('finished', this.changeAnim, this);
        let state;
        if (clipName != null) {
            state = shuAnim.play(clipName);
        } else {
            state = shuAnim.play();
        }
        if (playTime / state.duration >= 2) {
            state.speed = 1;
            state.repeatCount = Math.floor(playTime / state.duration);
        } else {
            state.speed = state.duration / playTime;
            state.repeatCount = 1;
        }
        this.m_nLastShuIndex = index;
    },

    changeAnim: function () {
        var Anim = this.m_tShuNodeList[this.m_nLastShuIndex].getComponent(cc.Animation);
        let state = Anim.getAnimationState(Anim.currentClip._name);
        state.speed = 1;
        state.repeatCount = 1;
        Anim.off('finished', this.changeAnim, this);
        Anim.stop();
        this.m_tShuNodeList[this.m_nLastShuIndex].active = false;

        this.m_tShuNodeList[0].active = true;
        var shuAnim = this.m_tShuNodeList[0].getComponent(cc.Animation);
        state = shuAnim.play('shu_a00_Standby');
        state.speed = 1;
        state.repeatCount = Infinity;
        this.m_nLastShuIndex = 0;
    },

    //播放马匹起步音效
    playBeginAudio: function () {
        var maxHorseId = 0;
        for (var i = 1; i < 6; i++) {
            if (this.m_tHorseMoveCptList[i].getNowLSpeed() > this.m_tHorseMoveCptList[maxHorseId].getNowLSpeed())
                maxHorseId = i;
        }
        let [_, time] = this.playAudio(maxHorseId + 38, false);
        var nextAudio = parseInt(Math.random() * (48 - 45 + 1) + 45, 10);
        setTimeout(function () {
            this.playAudio(nextAudio, false);
        }.bind(this), time);

        var index = parseInt(Math.random() * (3 - 1 + 1) + 1, 10);
        let shuTime = time + this.getPlayAudioTime(nextAudio);
        this.playShuAnim(index, null, shuTime);
    },

    //播发马左跑道音效
    playLeftAudio: function () {
        var nextAudio = parseInt(Math.random() * (50 - 49 + 1) + 49, 10);
        let [_, time] = this.playAudio(nextAudio, false);
        //if(nextAudio == 49){
        var maxRateId = gameData.getMaxRateHorseId();
        setTimeout(function () {
            this.playAudio(maxRateId + 37, false);
        }.bind(this), time);
        // }else{
        //     var maxBetId = gameData.getMaxBetHorseId();
        //     setTimeout(function(){
        //         this.playAudio(maxBetId + 37, false);
        //     }.bind(this), 1600);
        // }
        let shuTime = time + this.getPlayAudioTime(maxRateId + 37);
        this.playShuAnim(0, 'shu_a00_speap', shuTime);
    },

    //播放马转弯跑道音效
    playTurnAudio: function () {
        var nextAudio = parseInt(Math.random() * (55 - 52 + 1) + 52, 10);

        let _, time, shuTime;

        if (nextAudio == 52) {//目前领先
            [_, time] = this.playAudio(nextAudio, false);
            var maxPosYId = 0;
            for (var i = 1; i < 6; i++) {
                maxPosYId = this.m_tHorsesNodeList[i].getPositionY() < this.m_tHorsesNodeList[maxPosYId].getPositionY() ? i : maxPosYId;
            }
            setTimeout(function () {
                this.playAudio(maxPosYId + 38, false);
            }.bind(this), time);
            shuTime = time + this.getPlayAudioTime(maxPosYId + 38);
        } else if (nextAudio == 53 || nextAudio == 54) {//暂时领先
            var maxPosYId = 0;
            for (var i = 1; i < 6; i++) {
                maxPosYId = this.m_tHorsesNodeList[i].getPositionY() < this.m_tHorsesNodeList[maxPosYId].getPositionY() ? i : maxPosYId;
            }
            [_, time] = this.playAudio(maxPosYId + 38, false);
            setTimeout(function () {
                this.playAudio(nextAudio, false);
            }.bind(this), time);
            shuTime = time + this.getPlayAudioTime(nextAudio);
        } else if (nextAudio == 55) { //紧追其后
            var minPosYId = 0;
            for (var i = 1; i < 6; i++) {
                minPosYId = this.m_tHorsesNodeList[i].getPositionY() < this.m_tHorsesNodeList[minPosYId].getPositionY() ? minPosYId : i;
            }
            [_, time] = this.playAudio(minPosYId + 38, false);
            setTimeout(function () {
                this.playAudio(nextAudio, false);
            }.bind(this), time);
            shuTime = time + this.getPlayAudioTime(nextAudio);
        }

        var index = parseInt(Math.random() * (4 - 3 + 1) + 3, 10);
        this.playShuAnim(index, null, shuTime);
    },

    //播放右道音效1
    playRightAudio1: function () {
        var nextAudio = parseInt(Math.random() * (59 - 56 + 1) + 56, 10);
        let [_, time] = this.playAudio(nextAudio, false);

        this.playShuAnim(0, 'shu_a00_speap', time);
    },

    //播放右道音效2
    playRightAudio2: function () {
        var minPosYId = 0;
        for (var i = 1; i < 6; i++) {
            minPosYId = this.m_tHorsesNodeList[i].getPositionX() > this.m_tHorsesNodeList[minPosYId].getPositionX() ? i : minPosYId;
        }
        let [_, time] = this.playAudio(minPosYId + 38, false);

        var nextAudio = parseInt(Math.random() * (63 - 61 + 1) + 61, 10);
        setTimeout(function () {
            this.playAudio(nextAudio, false);
        }.bind(this), time);

        var index = parseInt(Math.random() * (5 - 3 + 1) + 3, 10);
        let shuTime = time + this.getPlayAudioTime(nextAudio);
        this.playShuAnim(index, null, shuTime);
    },

    //校正马的排行
    adjustFirstAndSecondHorse: function () {
        // var firstId = 0;
        // var secondId = 1;
        // for(var i = 1; i< 6; i++){
        //     firstId = this.m_tHorsesNodeList[i].getPositionX() > this.m_tHorsesNodeList[firstId].getPositionX() ? i : firstId;
        // }
        //
        // for(var i = 0; i < 6; i++){
        //     if(i != firstId)
        //         secondId = this.m_tHorsesNodeList[i].getPositionX() > this.m_tHorsesNodeList[secondId].getPositionX() ? i : secondId;
        // }
        //
        // var horseList = gameData.getFirstHorse();
        // var check = false;
        // for(var j = 0; j < horseList.length; j++){
        //     if(firstId == horseList[i] - 1)
        //         check = true;
        // }
        //
        // if(!check){
        //     this.m_tHorseMoveCptList[firstId].adjustRightRunSpeed();
        // }
    },

    playResultAduio: function () {//播放结束音效
        var horseFirstList = gameData.getFirstHorse();
        let time = 0;
        for (let i = 0; i < horseFirstList.length; i++) {
            let horseAudio = horseFirstList[i] + 37;
            let data = audioConfig.getItem(function (item) {
                if (item.key == horseAudio)
                    return item;
            })

            setTimeout(() => {
                this.playAudio(horseAudio, false);
            }, time)
            time += data.time;
        }

        let nextAudio = parseInt(Math.random() * (68 - 64 + 1) + 64, 10);
        this.showResultTimeout = setTimeout(function () {
            cc.log(`horse show Result`);

            // var result = gameData.getResultList();
            // if(result.length != 1)
            //     this.m_tResultNode[0].setPositionX(-174);
            // for(var i = 0;i < result.length; i++){
            //     var first = Math.floor(result[i] / 10);
            //     var second = result[i] % 10;
            //     this.m_tResultNode[i].active = true;
            //     this.m_tResultNode[i].getChildByName('fisrstSp').getComponent(cc.Sprite).spriteFrame = this.m_oFontAtals.getSpriteFrame('a' + first);
            //     this.m_tResultNode[i].getChildByName('secondSp').getComponent(cc.Sprite).spriteFrame = this.m_oFontAtals.getSpriteFrame('a' + second);
            // }
            //
            this.playAudio(nextAudio, false);
            // setTimeout(()=>{
            //     this.playAudio(parseInt(Math.random() * (16 - 15 + 1) + 15, 10), false);
            //     this.playShuAnim(1, null);

            this.showResult();
            // }, time)

        }.bind(this), time);

        let shuTime = time + this.getPlayAudioTime(nextAudio);

        if (gameData.getWin() >= 0) {
            this.playShuAnim(6, null, shuTime);

        } else {
            var index = parseInt(Math.random() * (8 - 7 + 1) + 7, 10);
            this.playShuAnim(index, null, shuTime);

        }
    },

    //显示结果
    showResult: function () {
        this.m_bPlayStart = false;
        this.m_fTimer = 0;
        this.m_nTimeCd = 3;

        this.m_nAduioControlTime = 0;
        this.m_bplayBeginAudio = false;
        this.m_bplayLeftAudio = false;
        this.m_bplayTurnAudio = false;
        this.m_bPlayResultAudio = false;
        this.isPlayingCamera = false;
        this.m_bPlayRightAudio1 = false;
        this.m_bPlayRightAudio2 = false;

        // this._changeZorder = false;
        this._adjustRightRun = false;
        this._rightHorseList = [];

        // this.playAudio(16, false);
        this.replayTimeout = setTimeout(function () {
            cc.log(`horse show Own Result`);

            // this.m_tResultNode[0].setPositionX(0);
            // for(var i = 0; i < 3; i++){
            //     this.m_tResultNode[i].active = false;
            // }

            if (this.horseInfo) {
                for (let i = 0; i < 6; i++) {
                    this.m_tHorseCptList[i].stopAnim();
                }

                let firstInfo = this.horseInfo[1];
                this.playAudio(10, false);
                for (let i = 0; i < firstInfo.length; i++) {
                    this.m_tHorseMoveCptList[firstInfo[i].id - 1].setHorseState(firstInfo[i]);
                }

                var horseFirstList = gameData.getFirstHorse();
                let time = 0;
                for (let i = 0; i < horseFirstList.length; i++) {
                    let horseAudio = horseFirstList[i] + 37;
                    let data = audioConfig.getItem(function (item) {
                        if (item.key == horseAudio)
                            return item;
                    })

                    // setTimeout(()=>{
                    //     this.playAudio(horseAudio, false);
                    // }, time)
                    time += data.time;
                }

                setTimeout(() => {
                    let secondInfo = this.horseInfo[2];
                    if (secondInfo) {
                        this.playAudio(10, false);
                        for (let i = 0; i < secondInfo.length; i++) {
                            this.m_tHorseMoveCptList[secondInfo[i].id - 1].setHorseState(secondInfo[i]);
                        }
                        // let horseSecond = gameData.getSecondHorse();
                        // if(horseSecond){
                        //     var horseAudio2 = horseSecond + 37;
                        //     this.playAudio(horseAudio2, false);
                        // }
                    }

                }, 1000)

                this.showOwnResultTimeout = setTimeout(() => {
                    this.showOwnResult();
                }, 2000);
            } else {
                this.showOwnResult();
            }
        }.bind(this), 2000);
    },

    //显示个人结算结果
    showOwnResult: function () {
        cc.dd.UIMgr.openUI('gameyj_horse_racing/prefabs/ResultNode', function (ui) {
            if (!this.node.isValid) {
                return;
            }

            this.m_tResultNode = [];
            for (let i = 0; i < 3; i++) {
                this.m_tResultNode.push(cc.find(`resultNode/resultNode${i}`, ui));
            }
            this.m_oWinNode = cc.find(`resultNode/jsmb_sf_bj/winNode`, ui);
            this.m_oFailNode = cc.find(`resultNode/jsmb_sf_bj/loseNode`, ui);
            this.m_oBigWinNode = cc.find(`BigWinNode`, ui);

            var result = gameData.getResultList();
            for (var i = 0; i < result.length; i++) {
                var first = Math.floor(result[i] / 10);
                var second = result[i] % 10;
                this.m_tResultNode[i].active = true;


                cc.find(`mc_gj/fisrstSp`, this.m_tResultNode[i]).getComponent(cc.Sprite).spriteFrame = this.m_oFontAtals.getSpriteFrame('a' + first);
                cc.find(`mc_jj/secondSp`, this.m_tResultNode[i]).getComponent(cc.Sprite).spriteFrame = this.m_oFontAtals.getSpriteFrame('a' + second);
            }

            var win = gameData.getWin();
            if (win >= 0) {
                if (gameData.checkCanClear()) {
                    this.m_oWinNode.active = true;
                    this.m_oWinNode.getChildByName('resultNumwin').getComponent(cc.Label).string = ':' + win;
                }
            } else {
                this.m_oFailNode.active = true;
                this.m_oFailNode.getChildByName('resultNumlose').getComponent(cc.Label).string = ':' + win;
            }
            this.m_oUserGold.string = this.convertChipNum(gameData.getCoin(), 1);

            this.resultNode = cc.find('resultNode', ui).getComponent(cc.Animation);
            if (result.length != 1) {
                this.resultNode.setCurrentTime(0, 'sm_mcjs_3');
                this.resultNode.play('sm_mcjs_3');
            } else {
                this.resultNode.setCurrentTime(0, 'sm_mcjs');
                this.resultNode.play('sm_mcjs');
            }

            this.m_oBigWinNode.getComponent('horse_racing_Big_Win').setPlayerInfo();
        }.bind(this));

        this.bigWinTimeout = setTimeout(() => {
            cc.log(`horse show big win`);

            if (this.resultNode) {
                this.resultNode.setCurrentTime(0);
                this.resultNode.stop();
            }

            this.m_oBigWinNode.getComponent('horse_racing_Big_Win').showBigWin();
            for (var i = 0; i < 6; i++) {
                // this.m_tHorseCptList[i].setCurrentAtls(gameType.RunState.Begin);
                this.m_tHorseCptList[i].stopAnim();
                // this.m_tHorseCptList[i].resetHorse();
                this.m_tHorseMoveCptList[i].setRunState(gameType.RunState.Begin);
                this.m_tHorseMoveCptList[i].resetHorse();
            }

            for (var i = 0; i < 21; i++) {//初始化马匹下注信息
                this.m_tHorseBetNodeList[i].active = false;
            }
        }, 3100);
    },

    getPlayAudioTime(audioId) {
        var data = audioConfig.getItem(function (item) {
            if (item.key == audioId)
                return item;
        })
        return data.time;
    },

    //播放相应音效
    playAudio: function (audioId, isloop) {
        var data = audioConfig.getItem(function (item) {
            if (item.key == audioId)
                return item;
        })
        var name = data.audio_name;
        return [AudioManager.playSound(gameAudioPath + name, isloop), data.time];
    },

    //转换筹码字
    convertChipNum: function (num, type) {
        var str = num;
        if (num >= 10000 && num < 100000000) {
            str = (num / 10000).toFixed(type);
            var index = str.indexOf('.');
            if (index == 3)
                str = str.substr(0, 5) + '万';
            else
                str = str.substr(0, 4) + '万';
        } else if (num >= 100000000) {
            str = (num / 100000000).toFixed(type);
            var index = str.indexOf('.');
            if (index == 3)
                str = str.substr(0, 5) + '亿';
            else
                str = str.substr(0, 4) + '亿';
        }
        return str
    },

    onClickFunBtn: function (event, data) {//点击按钮功能响应
        // this.playAudio(10002, false);

        switch (data) {
            case 'FUNCTION':
                this.m_oFunctionUI.active = !this.m_oFunctionUI.active;
                break;
            case 'RULE':
                this.m_oFunctionUI.active = false;
                cc.dd.UIMgr.openUI('gameyj_horse_racing/prefabs/horse_racing_Rule_UI', function (ui) {
                    ui.setLocalZOrder(3000);
                }.bind(this));
                break;
            case 'SETTING':
                this.m_oFunctionUI.active = false;
                cc.dd.UIMgr.openUI('gameyj_horse_racing/prefabs/horse_racing_Setting_UI', function (ui) {
                    ui.setLocalZOrder(3000);
                }.bind(this));
                break;
            case 'QUIT':
                this.m_oFunctionUI.active = false;
                this.onClickQuit();
                break;
            case 'RECORD':
                this.m_oFunctionUI.active = false;
                this.onClickRecord();
                break;
        }
    },

    onClickRecord: function () {//发送游戏记录请求
        this.m_nRecordSendIndex = 1;

        var msg = new cc.pb.hall.msg_get_excite_game_record_req;
        msg.setIndex(this.m_nRecordSendIndex);
        msg.setGameType(107);
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_msg_get_excite_game_record_req, msg, "msg_get_excite_game_record_req", true);
    },

    onClickQuit: function () {
        var str = '';
        if (gameData.getStartCoin() >= gameData.getCoin()) {
            str = '您在本次游戏中没有盈利，是否现在就退出？';
        } else {
            str = '您在本次游戏中共盈利' + (gameData.getCoin() - gameData.getStartCoin()) + '，是否现在就退出？'

        }
        cc.dd.DialogBoxUtil.show(1, str, '确定', '取消',
            function () {
                AudioManager.stopMusic();

                var msg = new cc.pb.room_mgr.msg_leave_game_req();

                var gameType = 107;
                var roomId = RoomMgr.Instance().roomId;
                var gameInfoPB = new cc.pb.room_mgr.common_game_header();
                gameInfoPB.setGameType(gameType);
                gameInfoPB.setRoomId(roomId);

                msg.setGameInfo(gameInfoPB);

                cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);
            }.bind(this), null
        );
    },

    getHorseInfo(rank) {
        if (!this.horseInfo) {
            this.horseInfo = [];
        }

        this.horseInfo[rank] = [];
        for (let i = 0; i < this.m_tHorseMoveCptList.length; i++) {
            this.horseInfo[rank].push(this.m_tHorseMoveCptList[i].getHorseState());
        }
        this.horseInfo[rank].sort((a, b) => {
            if (a.id < b.id) {
                return -1;
            }
            if (a.id > b.id) {
                return 1;
            }
            return 0;
        })
    },

    setTurnCamera(x) {
        let anim = this.m_oMoveNode.getComponent(cc.Animation);
        anim.defaultClip.curveData.props.position[0].value[0] = -x;
    }
});
