// create by wj 2018/12/18
var slotSender = require('gameyj_slot_sender').SlotSender.getInstance();
const awardConfig = require('mammon_box');
var gSlotMgr = require('SlotManger').SlotManger.Instance();
var SlotCfg = require('SlotCfg');
const slot_audio = require('slotaudio');
var AudioManager = require('AudioManager').getInstance();

cc.Class({
    extends: cc.Component,

    properties: {
        m_oStartNode: cc.Node,
        m_oEndNode: cc.Node,
        m_tBoxList: { default: [], type: cc.Node, tooltip: '宝箱' },
        m_nMusicId: null,
        m_nSoundId: 0,
        m_oFlyStar: cc.Node,
        m_bPlayEnd: false,
        m_nTimer: 0,
        m_bPlayerOp: true,
        m_tOpenBoxList: [],
        m_bFirst: false,
    },


    onLoad: function () {
        this.m_nSoundId = this.playAudio(1025014);
        this.updateUIInfo();
        this.m_oStartNode.active = true; //显示开始界面
        var menNode = cc.dd.Utils.seekNodeByName(this.m_oStartNode, "men");//门关的骨骼动画
        var skeletonAct = menNode.getComponent(sp.Skeleton);
        if (skeletonAct) {
            var self = this;
            skeletonAct.clearTracks();
            skeletonAct.setAnimation(0, 'menguan', false);
            skeletonAct.setCompleteListener(function () {
                var beginNode = cc.dd.Utils.seekNodeByName(self.m_oStartNode, "begin");//显示进入入口到动画
                beginNode.active = true;
                var beginSkeleton = beginNode.getComponent(sp.Skeleton);
                beginSkeleton.clearTracks();
                beginSkeleton.setAnimation(0, 'zhaocaijinbao', false);

                setTimeout(function () {
                    var detailNode = cc.dd.Utils.seekNodeByName(self.m_oStartNode, "result");//现实描述
                    if (detailNode)
                        detailNode.active = true;

                    var timeTxt = cc.dd.Utils.seekNodeByName(self.m_oStartNode, "time");//现实描述
                    if (timeTxt) {
                        var totalTime = 15;
                        var showTime = function () {//倒计时显示
                            totalTime -= 1;
                            timeTxt.getComponent(cc.Label).string = totalTime + 's';
                            if (totalTime == 0) {
                                self.onClickEnterGame(null, null);
                                return;
                            }
                            self.showTime_id = setTimeout(showTime, 1000);

                        }
                        showTime();
                    }

                }, 1000);
            });
        }

    },
    checkBoxOpened: function (boxId) {
        for (var i = 0; i < this.m_tOpenBoxList.length; i++) {
            if (this.m_tOpenBoxList[i] == boxId) {
                boxId = parseInt(Math.random() * 12, 10);
                boxId = this.checkBoxOpened(boxId);
            }
        }
        return boxId;
    },

    update: function (dt) {
        if (!this.m_bPlayerOp) {
            this.m_nTimer += dt;
            var checkTime = 60;
            if (this.m_bFirst)
                checkTime = 5
            if (this.m_nTimer >= checkTime) {
                if (this.tinyGameManger.getLeftNum() > 0) {
                    var boxId = parseInt(Math.random() * 12, 10);
                    boxId = this.checkBoxOpened(boxId);
                    this.onClickOpenBox(null, boxId);
                    this.m_nTimer = 0;
                } else {
                    this.m_bPlayerOp = true;
                    this.m_nTimer = 0;
                }
            }
        } else
            this.m_nTimer = 0;
    },

    //更新界面细信息
    updateUIInfo: function () {
        this.tinyGameManger = gSlotMgr.getTinyGameData();
        var leftTimeTxt = cc.dd.Utils.seekNodeByName(this.node, 'left_time');
        var awarNumTxt = cc.dd.Utils.seekNodeByName(this.node, 'award_num');
        leftTimeTxt.getComponent(cc.Label).string = this.tinyGameManger.getLeftNum();
        awarNumTxt.getComponent(cc.Label).string = this.tinyGameManger.getRateNum();
        if (this.tinyGameManger.getLeftNum() == 0 && !this.m_bPlayEnd)
            this.showResutUi();
    },

    //更新打开的宝箱数据
    updateOpenBox: function (boxInfo) {
        var boxNode = this.m_tBoxList[boxInfo.seatId];//打开到宝箱节点
        this.m_tOpenBoxList.push(boxInfo.seatId);
        boxNode.getComponent(cc.Button).interactable = false;
        var boxSp = cc.dd.Utils.seekNodeByName(boxNode, 'baoxiangSp');
        boxSp.active = false;
        var boxActNode = cc.dd.Utils.seekNodeByName(boxNode, 'baoxiang');
        boxActNode.active = true;

        var boxId = boxInfo.seatId;
        var awarId = boxInfo.boxId;

        var dataInfo = awardConfig.getItem(function (item) {//获取配置表数据
            if (item.key == awarId)
                return item;
        });
        if (dataInfo) {
            if (dataInfo.type == 1) {//倍数
                this.playAudio(1025017);
                var node = cc.dd.Utils.seekNodeByName(boxNode, 'award');
                node.active = true;
                node.getComponent(cc.Label).string = dataInfo.num;
            }
            else if (dataInfo.type == 2) {//次数
                this.playAudio(1025020);
                var node = cc.dd.Utils.seekNodeByName(boxNode, 'newtimeNode');
                node.active = true;
                cc.dd.Utils.seekNodeByName(node, 'newtime').getComponent(cc.Label).string = dataInfo.num;

            } else if (dataInfo.type == 3) {//翻倍
                this.playAudio(1025017);
                var node = cc.dd.Utils.seekNodeByName(boxNode, 'doubleNode');
                node.active = true;
                cc.dd.Utils.seekNodeByName(node, 'doubletime').getComponent(cc.Label).string = dataInfo.num;
            }
        }

        var skeletonAct = cc.dd.Utils.seekNodeByName(boxNode, 'baoxiang').getComponent(sp.Skeleton);//闪光特效
        if (skeletonAct) {
            var type = '1XH';
            if (boxId >= 0 && boxId <= 3)
                type = '2XH';
            else if (boxId >= 8 && boxId <= 11)
                type = '3XH';
            skeletonAct.clearTracks();
            skeletonAct.setAnimation(0, type, true);
            skeletonAct.loop = true;
        }

    },

    //显示结算界面
    showResutUi: function () {
        this.m_bPlayEnd = true;
        this.playAudio(1025021);
        this.tinyGameManger = gSlotMgr.getTinyGameData();
        var self = this;
        this.m_oEndNode.active = true;
        var showNode = cc.dd.Utils.seekNodeByName(self.m_oEndNode, 'result');
        var winNumTxt = cc.dd.Utils.seekNodeByName(showNode, 'winNum');
        var winNumCaculate = cc.dd.Utils.seekNodeByName(showNode, 'winNumCaulate');
        winNumTxt.getComponent(cc.Label).string = self.tinyGameManger.getRateNum() * self.tinyGameManger.getBetNum();
        winNumCaculate.getComponent(cc.Label).string = self.tinyGameManger.getRateNum() + 'x' + self.tinyGameManger.getBetNum();
        gSlotMgr.setResultFenAndGameFen(self.tinyGameManger.getRateNum() * self.tinyGameManger.getBetNum());

        var skeletonAct = cc.dd.Utils.seekNodeByName(this.m_oEndNode, 'zuizhongdefen').getComponent(sp.Skeleton);//闪光特效
        if (skeletonAct) {
            skeletonAct.clearTracks();
            skeletonAct.setAnimation(0, 'zuizhongdefen', false);

            var seq = cc.sequence(cc.delayTime(0.5), cc.callFunc(function () {
                showNode.active = true;
                if (gSlotMgr.getSlotLastAuto()) {
                    setTimeout(function () {
                        self.onClickCloseTinyGame(null, null);
                    }, 5000);
                }
            }));
            this.m_oEndNode.runAction(seq);
            // skeletonAct.setCompleteListener(function(){

            // });
        }
    },

    //播放飞星动画
    playFlyStar: function (boxInfo) {
        var boxId = boxInfo.seatId
        var awarId = boxInfo.boxId;
        var boxNode = this.m_tBoxList[boxId];//打开到宝箱节点



        var dataInfo = awardConfig.getItem(function (item) {//获取配置表数据
            if (item.key == awarId)
                return item;
        });
        var endTxt = null;
        if (dataInfo) {
            if (dataInfo.type == 1 || dataInfo.type == 3) {//倍数
                endTxt = cc.dd.Utils.seekNodeByName(this.node, 'award_num');
            }
            else if (dataInfo.type == 2) {//次数
                endTxt = cc.dd.Utils.seekNodeByName(this.node, 'left_time');
            }

            var pointStart = boxNode.getPosition()
            this.m_oFlyStar.setPosition(pointStart);
            var pointEnd = endTxt.getPosition();
            this.m_oFlyStar.active = true;
            var self = this;
            this.m_oFlyStar.runAction(cc.sequence(cc.moveTo(0.8, pointEnd), cc.callFunc(function () {
                //self.m_oFlyStar.active = false;
                self.m_oFlyStar.setPosition(cc.v2(720, 0));
                self.m_oFlyStar.stopAllActions();
                self.updateUIInfo();
                self.m_bPlayerOp = false;
            })))
        }
    },

    onClickEnterGame: function (event, data) {//点击进入游戏
        AudioManager.stopSound(this.m_nSoundId);
        this.playAudio(1025015);

        if (this.showTime_id)
            clearTimeout(this.showTime_id);
        var beginNode = cc.dd.Utils.seekNodeByName(this.m_oStartNode, "begin");//显示进入入口到动画
        beginNode.active = false;
        var detailNode = cc.dd.Utils.seekNodeByName(this.m_oStartNode, "result");//现实描述
        if (detailNode)
            detailNode.active = false;
        var menNode = cc.dd.Utils.seekNodeByName(this.m_oStartNode, "men");//门关的骨骼动画
        var skeletonAct = menNode.getComponent(sp.Skeleton);
        if (skeletonAct) {
            if (AudioManager._getLocalMusicSwitch()) {
                this.m_nMusicId = SlotCfg.AudioMammonPath + 'CSD_Bonus_Bgm';
                AudioManager.playMusic(SlotCfg.AudioMammonPath + 'CSD_Bonus_Bgm');
            }

            var self = this;
            skeletonAct.clearTracks();
            skeletonAct.setAnimation(0, 'menkai', false);
            skeletonAct.setCompleteListener(function () {
                self.m_oStartNode.active = false;
                self.tinyGameManger.getOpenBoxInfo().forEach(function (boxInfo) {
                    self.updateOpenBox(boxInfo);
                });
                self.updateUIInfo();
                self.m_bPlayerOp = false;
                skeletonAct.setCompleteListener(null);
            });
        }
    },

    showOpenBoxAction: function (boxInfo) {//显示打开箱子的动画
        var leftTimeTxt = cc.dd.Utils.seekNodeByName(this.node, 'left_time');
        var cpt = leftTimeTxt.getComponent(cc.Label)
        cpt.string = parseInt(cpt.string) - 1;

        var self = this;
        var boxId = boxInfo.seatId;
        var boxNode = this.m_tBoxList[boxId];//打开到宝箱节点
        var boxSp = cc.dd.Utils.seekNodeByName(boxNode, 'baoxiangSp');
        boxSp.active = false;
        var boxActNode = cc.dd.Utils.seekNodeByName(boxNode, 'baoxiang');
        boxActNode.active = true;
        self.playAudio(1025031);
        var skeletonAct = boxActNode.getComponent(sp.Skeleton);
        if (skeletonAct) {
            var type = '1';
            if (boxId >= 0 && boxId <= 3)
                type = '2';
            else if (boxId >= 8 && boxId <= 11)
                type = '3';
            //skeletonAct.clearTracks();
            skeletonAct.setAnimation(0, type, false);
            skeletonAct.loop = false;
            boxNode.getComponent(cc.Button).interactable = false;

            var seq = cc.sequence(cc.delayTime(0.8), cc.callFunc(function () {
                self.updateOpenBox(boxInfo);
                self.playFlyStar(boxInfo);
            }));
            boxNode.runAction(seq);
        }

    },
    onClickOpenBox: function (event, data) {//点击打开宝箱
        var boxId = parseInt(data);
        slotSender.openBox(boxId);
        this.m_bPlayerOp = true;
        if (event == null)
            this.m_bFirst = true;
    },

    onClickCloseTinyGame: function (event, data) {//关闭游戏
        if (this.m_nMusicId)
            cc.audioEngine.stop(AudioManager.getAudioID(this.m_nMusicId));
        AudioManager.stopMusic();
        this.tinyGameManger = gSlotMgr.getTinyGameData();
        var slotMainUI = cc.dd.SceneManager.getCurrScene().getChildByName('Canvas').getComponent('mammon_slot_ui');
        if (slotMainUI) {
            slotMainUI.resetEnterTinyGameTag();
            slotMainUI.updateResult();
            slotMainUI.playBackGround();
            slotMainUI.quitSmallGame();
            this.tinyGameManger.resetAllData();
            gSlotMgr.setGold(gSlotMgr.getGold() + gSlotMgr.getResultFen());
        }
        cc.dd.UIMgr.destroyUI(this.node);
    },

    //播放相应音效
    playAudio: function (audioId) {
        var data = slot_audio.getItem(function (item) {
            if (item.key == audioId)
                return item;
        })
        var name = data.audio_name;
        return AudioManager.playSound(SlotCfg.AudioMammonPath + name);
    },
});
