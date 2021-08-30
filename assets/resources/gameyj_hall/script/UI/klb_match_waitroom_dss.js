const BSC_Data = require('bsc_data').BSC_Data;
const HallCommonData = require('hall_common_data').HallCommonData;
const Bsc_Event = require('bsc_data').BSC_Event;
const Bsc_ED = require('bsc_data').BSC_ED;
var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        headSp: cc.Sprite,//头像
        nameTTF: cc.Label,//名字
        score: cc.Label,//得分
        loseFont: cc.Font,
        winFont: cc.Font,

        waitNode: cc.Node,
        waitNum: cc.Label,

        rankNode: cc.Node,
        currentRank: cc.Node,
        totalRank: cc.Label,
        timeCount: cc.Label,

        title: sp.Skeleton,

        progress: cc.ProgressBar,

        time: 5,

        rankView: cc.ScrollView,
        jiaobiao: cc.Node,

        rewardPoolText: cc.Label,
        rewardNumText: cc.Label,

        backBtnNode: cc.Node,

        rebornCostItem: cc.Node,    //复活消耗item
        rebornCostLayout: cc.Node,  //消耗父节点
        rebornDjsText: cc.Label,    //倒计时

        itemAtlas: cc.SpriteAtlas,  //道具表图集
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.scaleX = cc.find('Canvas').width / this.node.width;
        this.node.scaleY = cc.find('Canvas').height / this.node.height;

        this.progress.progress = 0;
        this.startTime = false;
        this.startProgress = false;
        this._currentRank = 0;

        Bsc_ED.addObserver(this);
        this.refreshRewardPool();
        this.schedule(this.refreshRewardPool, 5);
    },

    onDestroy() {
        this.timeCount.unschedule(this.scheduleFunc);
        Bsc_ED.removeObserver(this);
    },


    onEventMessage(event, data) {
        switch (event) {
            case Bsc_Event.BSC_REWARD_POOL_UPDATE:
                this.updateRewardPool(data);
                break;
            case Bsc_Event.BSC_DINGSHI_DEAD_RET:
                this.showDeadRet(data);
                break;
            case Bsc_Event.BSC_DINGSHI_REBORN_RET:
                this.rebornRet(data);
                break;
            case Bsc_Event.BSC_DINGSHI_LUNKONG:
                this.showLunkong(true);
                break;
        }
    },

    //显示轮空
    showLunkong(bool) {
        cc.find('rank/wait/lunkong', this.node).active = bool;
    },

    //复活
    rebornRet(msg) {
        if (cc._matchRoomInfo && cc._matchRoomInfo.matchType == 2) {
            if (msg.matchId != cc._matchRoomInfo.matchId)
                return;
            switch (msg.retCode) {
                case 0://成功
                    this._rebornFlag = false;
                    this.rebornDjsText.string = '';
                    this.showTaotai(false);
                    break;
            }
        }
    },

    //刷新奖池请求
    refreshRewardPool() {
        if (cc._matchRoomInfo && cc._matchRoomInfo.matchType == 2) {
            var matchId = cc._matchRoomInfo.matchId;
            const req = new cc.pb.match.msg_get_match_reward_pool_req();
            req.setMatchId(matchId);
            cc.gateNet.Instance().sendMsg(cc.netCmd.match.cmd_msg_get_match_reward_pool_req, req,
                'msg_get_match_reward_pool_req', 'no');
        }
    },

    //发送复活请求
    sendRebornReq(event, custom) {
        hall_audio_mgr.com_btn_click();
        if (cc._matchRoomInfo && cc._matchRoomInfo.matchType == 2) {
            var matchId = cc._matchRoomInfo.matchId;
            const req = new cc.pb.match.msg_match_reborn_req();
            req.setMatchId(matchId);
            cc.gateNet.Instance().sendMsg(cc.netCmd.match.cmd_msg_match_reborn_req, req,
                'msg_match_reborn_req', 'no');
        }
    },

    //更新奖池数量
    updateRewardPool(msg) {
        if (cc._matchRoomInfo && cc._matchRoomInfo.matchType == 2) {
            if (msg.matchId != cc._matchRoomInfo.matchId)
                return;
            this.rewardNumText.string = msg.rewardRank.toString();
            if (msg.poolNum > 9999)
                this.rewardPoolText.string = Math.floor(msg.poolNum / 100) / 100 + '万';
            else
                this.rewardPoolText.string = '' + msg.poolNum;
        }
    },

    //预赛淘汰  显示复活
    showDeadRet(msg) {
        this.rebornCostLayout.removeAllChildren();
        this.showTaotai(true);
        var costList = msg.signFeeList;
        if (costList && costList.length) {
            for (var i = 0; i < costList.length; i++) {
                var item = cc.instantiate(this.rebornCostItem);
                cc.find('icon', item).getComponent(cc.Sprite).spriteFrame = this.itemAtlas.getSpriteFrame(costList[i].type.toString());
                cc.find('lbl', item).getComponent(cc.Label).string = costList[i].num.toString();
                this.rebornCostLayout.addChild(item);
                item.active = true;
            }
        }
        this._rebornTime = 5;
        this._rebornFlag = true;
        this.rebornDjsText.string = this._rebornTime + 's后自动退出比赛';
    },


    //显示淘汰
    showTaotai(flag) {
        if (flag) {
            cc.find('taotai', this.node).active = true;
            cc.find('rank', this.node).active = false;
            this.backBtnNode.active = true;
        }
        else {
            cc.find('taotai', this.node).active = false;
            cc.find('rank', this.node).active = true;
            this.backBtnNode.active = false;
        }
    },

    show(data) {
        this.showTaotai(false);
        cc.find('rank/progress/notice', this.node).active = false;
        this.target_roundNum = data.roundNum;
        this.target_roundType = data.roundType;

        if (this.target_roundType == 1) {
            this.current_rounNum = this.target_roundNum - 1;
            cc.find('rank/progress', this.node).active = true;
            cc.find('rank/wait', this.node).active = false;
        } else {
            this.current_rounNum = 4;
            cc.find('rank/progress', this.node).active = false;
            cc.find('rank/wait', this.node).active = true;
        }
        this.info = data;

        let score = data.curScore;

        if (score >= 0) {
            this.score.font = this.winFont;
            this.score.string = score;
        } else {
            this.score.font = this.loseFont;
            this.score.string = "/" + Math.abs(score);
        }
        let userInfo = HallCommonData.getInstance();
        this.nameTTF.string = (cc.dd.Utils.getRealLen(userInfo.nick) > 10 ? cc.dd.Utils.subChineseStr(userInfo.nick, 0, 10) : userInfo.nick);
        cc.dd.SysTools.loadWxheadH5(this.headSp, userInfo.headUrl);

        this.totalRank.string = data.leftPlayerNum;
        this.waitNum.string = data.leftDeskNum;

        if (this.rankView.content.childrenCount != data.leftPlayerNum) {
            this.rankView.content.removeAllChildren(true);

            for (let i = 0; i < data.leftPlayerNum; i++) {
                let item = cc.instantiate(this.currentRank);
                item.active = true;
                // item.name = (i+1);
                item.x = 0;
                this.rankView.content.addChild(item);
                item.getComponent(cc.Label).string = (i + 1).toString();
            }

            this.rankView.content.y = (data.leftPlayerNum - 1) * this.currentRank.height;
            this._currentRank = data.leftPlayerNum
        }

        if (this._currentRank != data.rank) {
            this._currentRank == data.rank;
            // this.rankView.scrollToPercentVertical((data.rank - 1)/data.leftPlayerNum, 0.5);
            this.rankView.content.stopAllActions();
            this.rankView.content.runAction(cc.moveTo(0.5, 0, (data.rank - 1) * this.currentRank.height));
        }

        if (!this.startTime) {
            this.title.node.active = false;

            switch (this.current_rounNum) {
                case 0:
                    this.progress.progress = 0;
                    this.jiaobiao.x = - this.progress.node.width / 2;
                    break;
                case 1:
                    this.progress.progress = 0.25;
                    this.jiaobiao.x = this.progress.node.width * 0.25 - this.progress.node.width / 2;
                    break;
                case 2:
                    this.progress.progress = 0.5;
                    this.jiaobiao.x = this.progress.node.width * 0.5 - this.progress.node.width / 2;
                    break;
                case 3:
                    this.progress.progress = 0.75;
                    this.jiaobiao.x = this.progress.node.width * 0.75 - this.progress.node.width / 2;
                    break;
                case 4:
                    this.progress.progress = 1;
                    this.jiaobiao.x = this.progress.node.width * 1 - this.progress.node.width / 2;
                    break;
            }

            this.jiaobiao.active = true;

            let func1 = () => {
                AudioManager.playSound("gameyj_hall/audios/pk_rank");
            }
            if (this.target_roundType == 1) {
                if (this.target_roundNum == 4) {
                    this.waitNode.active = true;
                    this.rankNode.active = false;
                }
                else {
                    this.waitNode.active = false;
                    this.rankNode.active = true;
                }
                if (!this.startTime) {
                    this.node.runAction(cc.sequence(
                        cc.callFunc(func1),
                        cc.delayTime(0.1),
                    ))

                    this.startTime = true;
                    if (true) {
                        this.jiaobiao.active = false;
                        switch (this.current_rounNum) {
                            case 0:
                                this.targetProgress = 0.25;
                                this.jiaobiao.x = this.progress.node.width * 0.25 - this.progress.node.width / 2;
                                break;
                            case 1:
                                this.targetProgress = 0.5;
                                this.jiaobiao.x = this.progress.node.width * 0.5 - this.progress.node.width / 2;
                                break;
                            case 2:
                                this.targetProgress = 0.75;
                                this.jiaobiao.x = this.progress.node.width * 0.75 - this.progress.node.width / 2;
                                break;
                            case 3:
                                this.targetProgress = 1;
                                this.jiaobiao.x = this.progress.node.width / 2;
                                break;
                            default:
                                this.targetProgress = 1;
                                this.jiaobiao.x = this.progress.node.width / 2;
                                break;
                        }
                        this.startProgress = true;
                    }
                }
            }
            else {
                if (data.leftDeskNum > 0) {
                    this.waitNode.active = true;
                    this.rankNode.active = false;
                } else {
                    this.waitNode.active = false;
                    this.rankNode.active = true;
                    // this.currentRank.string = data.rank;


                    let func2 = () => { };

                    this.title.clearTracks();
                    if (BSC_Data.Instance()._nextRoundNum != null && this.current_rounNum == 4) {
                        cc.find('rank/progress/notice', this.node).active = true;
                        cc.find('rank/progress/notice', this.node).getComponent(cc.Label).string = '预赛前' + BSC_Data.Instance()._nextRoundNum + '名晋级';
                        if (data.rank <= BSC_Data.Instance()._nextRoundNum) {
                            this.title.node.active = true;
                            this.title.setAnimation(0, 'gongxijinji', false);
                            this.title.setCompleteListener(() => {
                                this.title.setCompleteListener(null);
                                this.title.setAnimation(0, 'gongxijinjixunhuan', true);
                            })
                            func2 = () => {
                                AudioManager.playSound("gameyj_hall/audios/pk_win");
                            }
                        } else {
                            this.title.node.active = true;
                            this.title.setAnimation(0, 'shibai', false);
                            func2 = () => {
                                AudioManager.playSound("gameyj_hall/audios/pk_lose");
                            }
                        }
                    }
                    else {
                        this.title.node.active = false;
                    }

                    if (!this.startTime) {
                        this.node.runAction(cc.sequence(
                            cc.callFunc(func1),
                            cc.delayTime(0.1),
                            cc.callFunc(func2)
                        ))

                        this.startTime = true;
                        if (true) {
                            this.jiaobiao.active = false;
                            switch (this.current_rounNum) {
                                case 0:
                                    this.targetProgress = 0.25;
                                    this.jiaobiao.x = this.progress.node.width * 0.25 - this.progress.node.width / 2;
                                    break;
                                case 1:
                                    this.targetProgress = 0.5;
                                    this.jiaobiao.x = this.progress.node.width * 0.5 - this.progress.node.width / 2;
                                    break;
                                case 2:
                                    this.targetProgress = 0.75;
                                    this.jiaobiao.x = this.progress.node.width * 0.75 - this.progress.node.width / 2;
                                    break;
                                case 3:
                                    this.targetProgress = 1;
                                    this.jiaobiao.x = this.progress.node.width / 2;
                                    break;
                                default:
                                    this.targetProgress = 1;
                                    this.jiaobiao.x = this.progress.node.width / 2;
                                    break;
                            }
                            this.startProgress = true;
                        }
                    }
                }
            }
        }
    },

    scheduleFunc() {
        if (this.time < 0) {
            this.time = 0;
        }

        if (this.info.rank <= 4 && (this.current_rounNum == 3 || this.target_roundType == 4 || this.target_roundType == 5)) {
            this.timeCount.string = this.time + '秒后开始决赛';
        } else if (this.current_rounNum == 3) {
            this.timeCount.string = '';
        } else {
            this.timeCount.string = this.time + '秒后开始下一轮';
        }
        this.time--;
    },

    update(dt) {
        if (this.startProgress) {
            if (this.progress.progress < this.targetProgress) {
                this.progress.progress += dt * 0.3;
            } else {
                this.progress.progress = this.targetProgress;
                this.startProgress = false;
                this.jiaobiao.active = true;
            }
        }
        if (this._rebornFlag) {
            this._rebornTime -= dt;
            if (this._rebornTime <= -1) {
                this._rebornFlag = false;
                var Bsc = require('bsc_data');
                Bsc.BSC_Data.Instance().clearData();
                cc.dd.SceneManager.enterHall();
            }
            else {
                this.rebornDjsText.string = Math.ceil(this._rebornTime) + 's后自动退出比赛'
            }
        }
    },

    showTime(time) {
        if (this.info) {
            this.waitNode.active = false;
            this.rankNode.active = true;
            this.time = time;
            this.timeCount.unschedule(this.scheduleFunc);
            this.timeCount.schedule(this.scheduleFunc.bind(this), 1, this.time, 0)
        }
    },

    //返回
    backToHall: function (event, data) {
        hall_audio_mgr.com_btn_click();
        var Bsc = require('bsc_data');
        Bsc.BSC_Data.Instance().clearData();
        cc.dd.SceneManager.enterHall();
    },
});
