/**
 * created by luke on Oct.12.2020
 */
var ddz_audio_cfg = require('ddz_audio_cfg');
var hall_prefab = require('hall_prefab_cfg');
const BSC_ED = require('bsc_data').BSC_ED;
const BSC_Event = require('bsc_data').BSC_Event;
let sh_Data = require('sh_data').sh_Data;
var AudioManager = require('AudioManager');

cc.Class({
    extends: require('sh_game_jbc'),

    properties: {
        game_start_splist: { type: cc.SpriteFrame, default: [], tooltip: '比赛开始阶段图' },
        item_atlas: { type: cc.SpriteAtlas, default: null, tooltip: '道具图集' },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._super();
        BSC_ED.addObserver(this);

        this.game_end_first_ani = cc.find('game_share/1st/GJ', this.node).getComponent(sp.Skeleton);
        this.game_end_first_ani.setCompleteListener((trackEntry, loopCount) => {
            let name = trackEntry.animation ? trackEntry.animation.name : '';
            if (name === 'CC') {
                self.game_end_first_ani.setAnimation(0, 'XH', true);
            }
        });
        this._isBscGaming = true;
    },

    onDestroy() {
        this._super();
        BSC_ED.removeObserver(this);
    },

    start() {
        this._super();
        sh_Data.Instance().m_nBaseScore = 10000;
    },

    //事件处理
    onEventMessage(event, data) {
        this._super(event, data);
        switch (event) {
            case BSC_Event.PLAY_ROUND:
                this.playRound(data);
                break;
            case BSC_Event.RANK_INFO:
                this.showRank(data);
                break;
            case BSC_Event.GAME_END:
                this.gameEndToShare(data);
                break;
            case BSC_Event.RECONNECT_LINE:
                this.waitLine(data);
                break;
            case BSC_Event.BSC_ROOM_WIN_RESULT:
                this.updateWinScore(data);
                break;
        }
    },

    /**
     * 开局动画
     */
    playRound: function (data) {
        var roundType = data.roundType;//类型  1.预赛  2.晋级赛  3、决赛  4、总决赛
        var curGame = data.curGame; //当前第几局
        var gameNum = data.gameNum; //该轮局数(预赛无)
        var upNum = data.upNum; //晋级人数(预赛无)
        var lastScore = data.lastScore; //上局积分
        var nowScore = data.nowScore;   //本局积分
        var losescore = data.outScore;
        if (curGame == 1) {
            var str_1 = {
                [1]: '打立出局',
                [3]: '您的晋级赛积分为{0}',
                [4]: '您的决赛积分为{0}',
                [5]: '您的总决赛积分为{0}',
            };
            var str_2 = {
                [1]: '积分低于{0}被淘汰',
                [3]: '{0}局PK，按积分排名，前{1}名晋级',
                [4]: '{0}局PK，按积分排名，前{1}名晋级',
                [5]: '{0}局PK，第一名胜出',
            };
            var startNode = cc.find('game_start', this.node);
            var label1 = cc.find('label_1', startNode).getComponent(cc.Label);
            var label2 = cc.find('label_2', startNode).getComponent(cc.Label);
            if (roundType == 1)
                cc.find('title_sp', startNode).getComponent(cc.Sprite).spriteFrame = this.game_start_splist[roundType - 1];
            else
                cc.find('title_sp', startNode).getComponent(cc.Sprite).spriteFrame = this.game_start_splist[roundType - 2];
            label1.string = str_1[roundType].format(nowScore);
            if (roundType == 1) {
                label2.string = str_2[roundType].format(losescore);
            }
            else {
                label2.string = str_2[roundType].format(gameNum, upNum);
            }
            startNode.getComponent(cc.Animation).play('game_start');
            for (var i = 0; i < 5; i++) {
                var bsc = this.head_list[i].node.getComponentInChildren('sh_bsc_score');
                if (bsc) {
                    bsc.setValue(0);
                }
            }
        }
        else {
            var str_1 = {
                [1]: '预赛第{0}局开始',
                [3]: '晋级赛第{0}局开始',
                [4]: '决赛第{0}局开始',
                [5]: '总决赛第{0}局开始',
            };
            var str_2 = {
                [1]: '淘汰分增长到{0}',
                [3]: '{0}局PK，按积分排名，前{1}名晋级',
                [4]: '{0}局PK，按积分排名，前{1}名晋级',
                [5]: '{0}局PK，第一名胜出',
            };
            var str_lbl2 = '';
            if (roundType == 1) {
                str_lbl2 = str_2[roundType].format(losescore);
            }
            else {
                str_lbl2 = str_2[roundType].format(gameNum, upNum);
            }
            this.showPopText(str_1[roundType].format(curGame), str_lbl2);
        }
        AudioManager.getInstance().playSound(ddz_audio_cfg.EFFECT.START, false);
        cc.find('wait_line', this.node).active = false;
        cc.find('round/num', this.node).getComponent(cc.Label).string = curGame + '/10';
    },

    /**
     * 显示飘字(第一行黄色 第二行白色 为空只显示一种颜色)
     */
    showPopText: function (str_yellow, str_white) {
        var popNode = cc.find('pop_text', this.node);
        var label1 = cc.find('label_1', popNode).getComponent(cc.Label);
        var label2 = cc.find('label_2', popNode).getComponent(cc.Label);
        if (str_yellow && str_yellow != '') {
            label1.node.active = true;
            label1.string = str_yellow;
        }
        else {
            label1.node.active = false;
        }
        if (str_white && str_white != '') {
            label2.node.active = true;
            label2.string = str_white;
        }
        else {
            label2.node.active = false;
        }
        popNode.getComponent(cc.Animation).play('pop_text');
    },

    //排名信息
    showRank: function (data) {
        var rank = data.rank;
        var left = data.leftPlayerNum;
        if (rank != null) {
            cc.find('rank', this.node).getComponent(cc.Label).string = rank.toString();
        }
        if (left != null) {
            cc.find('rank/left', this.node).getComponent(cc.Label).string = left.toString();
        }
    },

    //结束
    gameEndToShare: function (data) {
        var rank = data.rank;
        var rewardList = data.reward.rewardList;
        var text = data.reward.text;
        var matchName = data.name;
        var template = cc.find('game_share/reward/item', this.node);
        if (rewardList.length) {
            cc.find('game_share', this.node).active = true;
            cc.find('game_share/other/rank', this.node).getComponent(cc.Label).string = rank.toString();
            cc.find('game_share/title', this.node).getComponent(cc.Label).string = matchName;
            var hongbaoNum = 0;
            for (var i = 0; i < rewardList.length; i++) {
                if (rewardList[i].type == 1004 || rewardList[i].type == 1099) {
                    rewardList[i].num = rewardList[i].num / 100;
                    hongbaoNum += rewardList[i].num;
                }
                var newNode = cc.instantiate(template);
                cc.find('game_share/reward', this.node).addChild(newNode);
                newNode.getChildByName('icon').getComponent(cc.Sprite).spriteFrame = this.item_atlas.getSpriteFrame(rewardList[i].type.toString());
                if (rewardList[i].num >= 10000) {
                    newNode.getChildByName('num').getComponent(cc.Label).string = 'x' + Math.floor(rewardList[i].num / 100) / 100 + '万';
                }
                else {
                    newNode.getChildByName('num').getComponent(cc.Label).string = 'x' + rewardList[i].num.toString();
                }
                newNode.active = true;
            }
            if (text && text != '') {
                var newNode = cc.instantiate(template);
                cc.find('game_share/reward', this.node).addChild(newNode);
                newNode.getChildByName('icon').active = false;
                newNode.getChildByName('num').active = false;
                newNode.getChildByName('text').getComponent(cc.Label).string = text;
                newNode.getChildByName('text').active = true;
                newNode.getComponent(cc.Sprite).enabled = false;
                newNode.active = true;
            }
            cc.find('game_share', this.node).getComponent(cc.Animation).on('finished', function () {
                if (rank == 1) {
                    cc.find('game_share/1st', this.node).active = true;
                    this.game_end_first_ani.setAnimation(0, 'CC', false);
                    cc.find('game_share/1st/GJBZLZ', this.node).getComponent(cc.ParticleSystem).resetSystem();
                }
                else {
                    cc.find('game_share/other', this.node).active = true;
                }
            }.bind(this));
            cc.find('game_share', this.node).getComponent(cc.Animation).play('game_share');
        }
        else if (text && text != '') {
            var newNode = cc.instantiate(template);
            cc.find('game_share/reward', this.node).addChild(newNode);
            newNode.getChildByName('icon').active = false;
            newNode.getChildByName('num').active = false;
            newNode.getChildByName('text').getComponent(cc.Label).string = text;
            newNode.getChildByName('text').active = true;
            newNode.getComponent(cc.Sprite).enabled = false;
            newNode.active = true;
        }
        else {
            cc.find('wait_line', this.node).active = false;
            var str = '您获得第' + rank.toString() + '名，很遗憾被淘汰出局\n您可以继续报名参加新的比赛';
            cc.find('result_ani/taotai/lbl', this.node).getComponent(cc.Label).string = str;
            cc.find('rank', this.node).getComponent(cc.Label).string = rank.toString();
            cc.find('result_ani/taotai', this.node).active = true;
            cc.find('result_ani', this.node).active = true;
        }
    },

    //排队中
    waitLine: function (data) {
        this.showRank(data);
        var roundType = data.roundType;
        var leftDesk = data.leftDeskNum;
        var noticeStr = '';
        if (roundType == 0) {
            if (cc._matchRoomInfo && cc._matchRoomInfo.matchType == 2)
                noticeStr = '<color=#fff1ca><outline color=#8F3702 width=4>本局结束</c>';
            else
                noticeStr = '<color=#fff1ca><outline color=#8F3702 width=4>本局结束，系统正在为您配桌，请稍候...</c>';
        }
        else if (roundType == 1) {
            noticeStr = '出局人数已满，还有{0}桌正在游戏\n请等待结束后确定晋级名单'.format(leftDesk);
        }
        else {
            noticeStr = '<color=#fff1ca><outline color=#8F3702 width=4>您已完成本轮游戏，还有</c><color=#EBC14E><size=48><outline color=#8F3702 width=4><b>{0}</color></size></outline></b><color=#fff1ca><outline color=#8F3702 width=4><size=40>桌正在游戏\n请等待结束后确定晋级名单'.format(leftDesk);
        }

        cc.find('wait_line/lbl', this.node).getComponent(cc.RichText).string = noticeStr;
        cc.find('wait_line', this.node).active = true;
    },

    /**
     * 显示分享选项
     */
    showShareBtns: function (event, data) {
        var qipao = cc.find('game_share/fx_qipao', this.node);
        var btns = cc.find('game_share/com_share_btn', this.node);
        if (data == 'show') {
            qipao.active = false;
            btns.active = true;
        }
        else {
            btns.active = false;
        }
    },

    //TODO:
    backToAgain: function (event, data) {
        var Bsc = require('bsc_data');
        Bsc.BSC_Data.Instance().clearData();
        // cc.dd.quickMatchType = 'sh_gold_match';
        cc.dd.SceneManager.enterHallJBCMatch(cc.dd.Define.GameType.SH_GOLD);
    },

    //返回大厅
    backToHall: function (event, data) {
        var Bsc = require('bsc_data');
        Bsc.BSC_Data.Instance().clearData();
        cc.dd.SceneManager.enterHall();
    },

    /**
     * 分享
     */
    ShareBtnCallBack: function (event, data) {
        if (cc.sys.isNative) {
            if (data == 'wechat') {
                cc.WxShareType = 1;
                cc.dd.native_wx.SendScreenShot(this.node);
            }
            else if (data == 'xianliao') {
                cc.dd.native_wx.sendXlScreenShot(this.node);
            }
            else {
                cc.WxShareType = 2;
                cc.dd.native_wx.SendScreenShotTimeline(this.node);
            }
        }
    },

    updateChips() {
        var status = sh_Data.Instance().roomStatus;
        if (status == 5 || status == 6) {
            this.getComponentInChildren('sh_addbet').changeChipsValue([5, 10, 100]);
        }
        else if (status == 4) {
            this.getComponentInChildren('sh_addbet').changeChipsValue([1, 5, 10]);
        }
        else {
            this.getComponentInChildren('sh_addbet').changeChipsValue([1, 2, 5]);
        }
    },

    //更新输赢分数
    updateWinScore(msg) {
        var list = msg.winResultList;
        if (list && list.length) {
            for (var i = 0; i < list.length; i++) {
                var view = sh_Data.Instance().getViewById(list[i].userId);
                if (this.head_list[view]) {
                    var scp = this.head_list[view].node.getComponentInChildren('sh_bsc_score');
                    if (scp) {
                        scp.setValue(list[i].winScore);
                    }
                }
            }
        }

    },
    // update (dt) {},
});
