const BSC_Data = require('bsc_data').BSC_Data;
const HallCommonData = require('hall_common_data').HallCommonData;
var playerMgr = require('ccmj_player_mgr');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var DeskEvent = require('jlmj_desk_data').DeskEvent;
var DeskED = require('jlmj_desk_data').DeskED;
var hall_prefab = require('hall_prefab_cfg');

const TITLE_STATE = {
    WIN: 0,
    LOSE: 1,
    WAIT: 2
}

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

        lastJiesuanButton: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.scaleX = cc.find('Canvas').width / this.node.width;
        this.node.scaleY = cc.find('Canvas').height / this.node.height;

        this.progress.progress = 0;
        this.startTime = false;
        this.startProgress = false;
        this._currentRank = 0;

        this.titleState = TITLE_STATE.WAIT;
    },

    onDestroy() {
        this.timeCount.unschedule(this.scheduleFunc);
    },

    show(data, lastJiesuan) {
        if (data.gameType == cc.dd.Define.GameType.CCMJ_MATCH || data.gameType == cc.dd.Define.GameType.AHMJ_MATCH) {
            DeskEvent = require('jlmj_desk_data').DeskEvent;
            DeskED = require('jlmj_desk_data').DeskED;
        } else if (data.gameType == cc.dd.Define.GameType.WDMJ_MATCH) {
            DeskEvent = require('base_mj_desk_data').DeskEvent;
            DeskED = require('base_mj_desk_data').DeskED;
        }
        this.lastJiesuan = lastJiesuan;
        this.lastJiesuanButton.active = lastJiesuan;

        let canvas_node = cc.find('Canvas');
        this.nodeScaleX = 1
        this.nodeScaleY = 1

        if (canvas_node.width / canvas_node.height <= 4 / 3) {
            this.nodeScaleX = 1
            this.nodeScaleY = 1
        } else {
            this.nodeScaleX = canvas_node.width / this.node.width
            this.nodeScaleY = canvas_node.height / this.node.height
        }

        this.node.scaleX = this.nodeScaleX;
        this.node.scaleY = this.nodeScaleY;

        this.target_roundNum = data.roundNum;
        this.target_roundType = data.roundType;

        if (this.target_roundNum != 0) {
            this.current_rounNum = this.target_roundNum - 1;
        } else {
            this.current_rounNum = 3;
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
        this.nameTTF.string = cc.dd.Utils.subChineseStr(userInfo.nick, 0, 10);
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
            this._currentRank = data.rank;
            // this.rankView.scrollToPercentVertical((data.rank - 1)/data.leftPlayerNum, 0.5);
            this.rankView.content.stopAllActions();
            this.rankView.content.runAction(cc.moveTo(0.5, 0, (data.rank - 1) * this.currentRank.height));
        }

        if (!this.startTime) {
            this.title.node.active = false;

            switch (this.current_rounNum) {
                case 1:
                    this.progress.progress = 0;
                    this.jiaobiao.x = -this.progress.node.width / 2;
                    break;
                case 2:
                    this.progress.progress = 0.353;
                    this.jiaobiao.x = this.progress.node.width * 0.353 - this.progress.node.width / 2;
                    break;
                case 3:
                    this.progress.progress = 0.675;
                    this.jiaobiao.x = this.progress.node.width * 0.675 - this.progress.node.width / 2;
                    break;
                case 0:
                    this.progress.progress = 1;
                    this.jiaobiao.x = this.progress.node.width / 2;
                    break;
            }

            this.jiaobiao.active = true;

            if (data.leftDeskNum > 0) {
                this.waitNode.active = true;
                this.rankNode.active = false;
            } else {
                this.waitNode.active = false;
                this.rankNode.active = true;
                // this.currentRank.string = data.rank;

                let func1 = () => {
                    AudioManager.playSound("gameyj_hall/audios/pk_rank");
                }
                let func2 = () => { };

                this.title.clearTracks();
                if ((this.current_rounNum == 3 || this.target_roundType == 4 || this.target_roundType == 5) && data.rank <= 4) {
                    this.titleState = TITLE_STATE.WIN;
                    this.title.node.active = true;
                    this.title.setAnimation(0, 'gongxijinji', false);
                    this.title.setCompleteListener(() => {
                        this.title.setCompleteListener(null);
                        this.title.setAnimation(0, 'gongxijinjixunhuan', true);
                    })
                    func2 = () => {
                        AudioManager.playSound("gameyj_hall/audios/pk_win");
                    }
                } else if (this.current_rounNum == 3) {
                    this.titleState = TITLE_STATE.LOSE;
                    this.title.node.active = true;
                    this.title.setAnimation(0, 'shibai', false);
                    func2 = () => {
                        AudioManager.playSound("gameyj_hall/audios/pk_lose");
                    }
                } else {
                    this.titleState = TITLE_STATE.WAIT;
                    this.title.node.active = false;
                }

                if (!this.startTime) {
                    this.node.runAction(cc.sequence(
                        cc.callFunc(func1),
                        cc.delayTime(0.1),
                        cc.callFunc(func2)
                    ))

                    this.startTime = true;
                    if (this.current_rounNum != 3 || data.rank <= 4) {
                        this.jiaobiao.active = false;
                        switch (this.target_roundNum) {
                            case 2:
                                this.targetProgress = 0.353;
                                this.jiaobiao.x = this.progress.node.width * 0.353 - this.progress.node.width / 2;
                                break;
                            case 3:
                                this.targetProgress = 0.675;
                                this.jiaobiao.x = this.progress.node.width * 0.675 - this.progress.node.width / 2;
                                break;
                            case 0:
                                this.targetProgress = 1;
                                this.jiaobiao.x = this.progress.node.width / 2;
                                break;
                        }
                        this.startProgress = true;
                    }
                }
            }
        } else {
            //防止已经播放标题动画后名次变动导致显示不符合名次
            if (((this.current_rounNum == 3 || this.target_roundType == 4 || this.target_roundType == 5) && data.rank <= 4) && this.titleState != TITLE_STATE.WIN) {
                this.titleState = TITLE_STATE.WIN;
                this.title.node.active = true;
                this.title.clearTracks();
                this.title.setAnimation(0, 'gongxijinji', false);
                this.title.setCompleteListener(() => {
                    this.title.setCompleteListener(null);
                    this.title.setAnimation(0, 'gongxijinjixunhuan', true);
                })
            } else if (this.current_rounNum == 3 && data.rank > 4 && this.titleState != TITLE_STATE.LOSE) {
                this.titleState = TITLE_STATE.LOSE;
                this.title.node.active = true;
                this.title.clearTracks();
                this.title.setAnimation(0, 'shibai', false);
            } else if (this.current_rounNum < 3 && this.titleState != TITLE_STATE.WAIT) {
                this.titleState = TITLE_STATE.WAIT;
                this.title.node.active = false;
                this.title.clearTracks();
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

    onClickLastJieSuan() {
        hall_audio_mgr.com_btn_click();
        DeskED.notifyEvent(DeskEvent.JIESUAN, [this.lastJiesuan, true]);
    }
});
