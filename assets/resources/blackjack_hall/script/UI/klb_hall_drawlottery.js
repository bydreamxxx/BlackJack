var hall_audio_mgr = require('hall_audio_mgr').Instance();
var hall_prefab = require('hall_prefab_cfg');
const Hall = require('jlmj_halldata');
const hall_prop_data = require('hall_prop_data').HallPropData;

cc.Class({
    extends: cc.Component,

    properties: {
        score: cc.Label,
        gold: cc.Label,
        submitButton: cc.Button,
        spine: sp.Skeleton,

        nums: [require('klb_hall_drawlottery_runnumber')],
        paomadeng: require('klb_hall_drawlottery_anim'),
        bigwin: require('klb_hall_drawlottery_bigwin'),


    },

    onLoad() {
        Hall.HallED.addObserver(this);

        if (AudioManager.m_bMusicSwitch) {
            let path = 'blackjack_hall/audios/drawlottery_bg';
            AudioManager.stopMusic();
            cc.dd.ResLoader.loadAudio(path, (clip) => {
                this.m_musicId = cc.audioEngine.play(clip, true, AudioManager.m_nMusicVolume * 0.8);
            });
        }


        this.spine.setMix('a_2', 'a_1');
        this.spine.setCompleteListener(() => {
            // this.submitButton.interactable = true;
        });

        this.waitUpdate = 10;

        this.runEndNum = 0;
        for (let i = 0; i < this.nums.length; i++) {
            this.nums[i].setRunEndCall(this.checkRunEnd.bind(this));
        };

        this.paomadeng.setEndCall(() => {
            this.submitButton.interactable = true;
        })

        this.bigwin.init();
    },

    onDestroy: function () {
        Hall.HallED.removeObserver(this);
        cc.dd._drawlottery_update_coin = null;
    },

    onClickClose() {
        hall_audio_mgr.com_btn_click();

        if (cc.dd._drawlottery_update_coin) {
            cc.dd._drawlottery_update_coin.changeType = 0;
            hall_prop_data.getInstance().updateAssets(cc.dd._drawlottery_update_coin);
            cc.dd._drawlottery_update_coin = null;
        }

        cc.audioEngine.stop(this.m_musicId);

        AudioManager.resumeBackGroundMusic();

        cc.dd.UIMgr.destroyUI(this.node);
    },

    onClickRule() {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_DRAW_LOTTERY_RULE, (ui) => {
            ui.getComponent('klb_hall_drawlottery_rule').show(new Date(this.info.beginTime * 1000), new Date(this.info.endTime * 1000));
        });
    },

    onClickRank() {
        hall_audio_mgr.com_btn_click();
        const req = new cc.pb.room_mgr.msg_rank_req();
        req.setRankId(this.info.rankId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_rank_req, req,
            'msg_rank_req', 'no');
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'sendRank2S');
    },

    onClickRecord() {
        hall_audio_mgr.com_btn_click();
        const req = new cc.pb.rank.msg_lucky_activity_draw_history_req();
        cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_msg_lucky_activity_draw_history_req, req,
            'msg_lucky_activity_draw_history_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onClickRecord');

    },

    onClickSubmit() {
        hall_audio_mgr.com_btn_click();

        if (this.info.userScore < 1000000) {
            cc.dd.PromptBoxUtil.show('积分不足100万');
            return;
        }

        this.submitButton.interactable = false;
        this.spine.setAnimation(0, 'a_2', false);

        for (let i = 0; i < this.nums.length; i++) {
            this.nums[i].startRun();
        }

        this.paomadeng.hide();
        AudioManager.playSound('blackjack_hall/audios/drawlotteryrun', false);

        const req = new cc.pb.rank.msg_lucky_activity_draw_req();
        cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_msg_lucky_activity_draw_req, req,
            'msg_lucky_activity_draw_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onClickSubmit');
    },

    updateUI() {
        this.info = Hall.HallData.Instance().getDrawLotterykActive();
        this.score.string = this.info.userScore;
        this.gold.string = this.info.rewardPoolSize;
    },

    onEventMessage(event, data) {
        switch (event) {
            case Hall.HallEvent.DRAWLOTTERY_ACTIVITY_INFO:
                this.waitUpdate = 0;
                this.updateUI();
                break;
            case Hall.HallEvent.Rank_Info:
                cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_DRAW_LOTTERY_RANK, (ui) => {
                    ui.getComponent('klb_hall_drawlottery_rank').show(data);
                });
                break;
            case Hall.HallEvent.DRAWLOTTERY_ACTIVITY_RECORD:
                cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_DRAW_LOTTERY_RECORD, (ui) => {
                    ui.getComponent('klb_hall_drawlottery_record').show(data);
                });
                break;
            case Hall.HallEvent.DRAWLOTTERY_ACTIVITY_SUBMIT:
                if (this.waitScore) {//如果消耗积分后没有从服务器刷新自己积分，则手动减少
                    this.score.string = this.info.userScore - 1000000;
                    this.waitScore = false;
                }
                this.luckyScore = data.luckyScore.toString();

                this.nums[this.nums.length - 1].setRunEndNum(this.luckyScore[this.luckyScore.length - 1]);
                break;
        }
    },

    update(dt) {
        this.waitUpdate += dt;
        if (this.waitUpdate >= 10) {
            this.waitUpdate = 0;
            var pbObj = new cc.pb.rank.get_lucky_activity_req();
            cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_get_lucky_activity_req, pbObj, 'get_lucky_activity_req', true);
        }
    },

    checkRunEnd() {
        this.runEndNum++;
        AudioManager.playSound('blackjack_hall/audios/drawlotteryend', false);

        if (this.runEndNum < this.nums.length) {
            this.nums[this.nums.length - this.runEndNum - 1].setRunEndNum(this.luckyScore[this.luckyScore.length - this.runEndNum - 1]);
        }
        if (this.runEndNum == this.nums.length) {
            this.runEndNum = 0;

            this.paomadeng.playBling();

            if (cc.dd._drawlottery_update_coin) {
                cc.dd._drawlottery_update_coin.changeType = 0;
                hall_prop_data.getInstance().updateAssets(cc.dd._drawlottery_update_coin);
                cc.dd._drawlottery_update_coin = null;
            }

            if (this.luckyScore >= 10000000) {
                this.bigwin.show(this.luckyScore, () => {
                    cc.dd.RewardWndUtil.show([{ id: 1001, num: this.luckyScore }], false);
                })
            } else {
                cc.dd.RewardWndUtil.show([{ id: 1001, num: this.luckyScore }], false);
            }
        }
    },
});
