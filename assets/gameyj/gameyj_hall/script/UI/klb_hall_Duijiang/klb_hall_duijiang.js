//create by luke on 9/15/2020

const hall_audio_mgr = require('hall_audio_mgr').Instance();
const Hall = require('jlmj_halldata');
const hall_prefab = require('hall_prefab_cfg');
const HallCommonObj = require('hall_common_data');
const HallCommonEd = HallCommonObj.HallCommonEd;
const HallCommonEvent = HallCommonObj.HallCommonEvent;

const DAY_MILLISECONDS = 24 * 60 * 60 * 1000; //一天的毫秒数

cc.Class({
    extends: cc.Component,

    properties: {
        firstHand: cc.Node,         //引导动画
        ruleNode: cc.Node,          //规则节点
        rewardNode: cc.Node,        //榜单节点
        recordNode: cc.Node,        //记录节点
        remainSecLbl: cc.Label,     //倒计时

        codeAni: require('klb_hall_duijiang_code_ani'),
        resultAni: require('klb_hall_duijiang_result_ani'),
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var json = cc.sys.localStorage.getItem('duijiang_fist_click');
        if (json) {
            this.firstHand.active = false;
        }
        Hall.HallED.addObserver(this);
        HallCommonEd.addObserver(this);
        if (AudioManager.m_bMusicSwitch) {
            let path = 'gameyj_hall/audios/drawlottery_bg';
            AudioManager.stopMusic();
            cc.dd.ResLoader.loadAudio(path, (clip) => {
                this.m_musicId = cc.audioEngine.play(clip, true, AudioManager.m_nMusicVolume * 0.8);
            });
        }
    },
    onDestroy() {
        Hall.HallED.removeObserver(this);
        HallCommonEd.removeObserver(this);
        cc.audioEngine.stop(this.m_musicId);
        AudioManager.resumeBackGroundMusic();
    },

    //start() {},


    //事件处理
    onEventMessage(event, data) {
        switch (event) {
            case Hall.HallEvent.DUIJIANG_REWARD_HISTORY://榜单
                this.showReward(data);
                break;
            case Hall.HallEvent.RANK_ACTIVITY_ADDRESS://完善信息
                cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_CHONG_BANG_USERINFO, (ui) => {
                    ui.getComponent('klb_hall_chongbang_userInfo').show(Hall.HallData.Instance().getRankAddress());
                });
                break;
            case Hall.HallEvent.DUIJIANG_MY_HISTORY://我的中奖历史
                this.showRecord(data);
                break;
            case Hall.HallEvent.DUIJIANG_STATE://开奖状态改变
                this.changeStatus(data);
                break;
            case Hall.HallEvent.DUIJIANG_ACTIVITY_INFO://刷新信息
                this.initData(data);
                break;
            case Hall.HallEvent.DUIJIANG_GET_CODE://获取开奖码
                this.receivedCode(data);
                break;
            case Hall.HallEvent.DUIJIANG_OPEN_RESULT://开奖结果
                this.showResult(data);
                break;
            case HallCommonEvent.HALL_NO_RECONNECT_GAME://切后台重连
                var pbObj = new cc.pb.slot.get_cash_activity_req();
                cc.gateNet.Instance().sendMsg(cc.netCmd.slot.cmd_get_cash_activity_req, pbObj, 'get_cash_activity_req', true);
                break;
        }
    },

    //run per once frame
    update(dt) {
        if (this._data && !this._data.isOpenCash) {//开奖倒计时
            this._data.openCashTime -= dt;
            var time = Math.floor(this._data.openCashTime);
            if (time < 0) {
                time = 0;
                this.requestResult();   //开奖时间到  请求开奖结果
            }
            if (time != this._curTime) {
                this.modifyTime(time);
                this._curTime = time;
            }
        }
    },

    //轮询获取开奖结果
    requestResult() {
        const duration = 5;
        if (!this._request) {
            this._request = true;
            this.sendReqResult();
            this.schedule(this.sendReqResult, duration);//dur秒请求一次
        }
    },
    sendReqResult() {//发送请求开奖结果
        var pbObj = new cc.pb.slot.msg_cash_activity_open_result_req();
        cc.gateNet.Instance().sendMsg(cc.netCmd.slot.cmd_msg_cash_activity_open_result_req, pbObj, 'msg_cash_activity_open_result_req', true);
    },

    //显示开奖结果
    showResult(msg) {
        cc._show_cash_result = true;
        this.unschedule(this.sendReqResult);//取消轮询计时器
        cc.find('main/timer', this.node).active = false;//关闭倒计时
        this._data.isOpenCash = true;//修改开奖状态
        this.resultAni.onRunResult(msg, this._data.userCashCode);//开奖动画
    },

    //初始化数据 界面
    initData(msg) {
        this._data = msg.listList[0];//保存数据
        //显示活动时间
        var date_node = cc.find('main/date', this.node);
        date_node && (date_node.getComponent(cc.Label).string = '活动时间：' + this.formatDate(this._data.beginTime * 1000) + '—' + this.formatDate(this._data.endTime * 1000));
        //显示按钮状态
        var btn_lbl_node = cc.find('main/btn/lbl', this.node);
        if (btn_lbl_node) {
            var btn_lbl = btn_lbl_node.getComponent(cc.Label);
            if (this._data.isOpenCash) {
                this.firstHand.active = false;//已开奖，不展示引导动画
                if (this._data.userCashCode)
                    switch (this._data.userRewardLevel) {
                        case 0:
                            btn_lbl.string = '未中奖，再接再厉';
                            break;
                        case 1:
                            btn_lbl.string = '恭喜:一等奖';
                            break;
                        case 2:
                            btn_lbl.string = '恭喜:二等奖';
                            break;
                        case 3:
                            btn_lbl.string = '恭喜:三等奖';
                            break;
                    }
                else
                    btn_lbl.string = '已开奖，明日领取';
            }
            else {
                if (this._data.userCashCode) {
                    btn_lbl.string = '兑奖码:' + this._data.userCashCode;
                    this.firstHand.active = false;//已领码，不展示引导动画
                }
                else btn_lbl.string = '领取兑奖码';
            }
        }
        //显示奖项名额
        var first = cc.find('main/1st', this.node);
        first && (first.getComponent(cc.Label).string = this._data.rankNum1 + '名');
        var second = cc.find('main/2nd', this.node);
        second && (second.getComponent(cc.Label).string = this._data.rankNum2 + '名');
        var third = cc.find('main/3rd', this.node);
        third && (third.getComponent(cc.Label).string = this._data.rankNum3 + '名');
        //已开奖  关闭倒计时   显示今日中奖名单
        if (this._data.isOpenCash) {
            cc.find('main/timer', this.node).active = false;
            //主动弹出今日中奖名单
            if (!cc._show_cash_result && this._data.userCashCode) {
                cc._show_cash_result = true;
                var pbObj = new cc.pb.slot.msg_day_cash_activity_reward_history_req();
                cc.gateNet.Instance().sendMsg(cc.netCmd.slot.cmd_msg_day_cash_activity_reward_history_req, pbObj, 'msg_day_cash_activity_reward_history_req', true);
            }
        }
    },

    //显示榜单
    showReward(data) {
        this._rewardTime = data.timestamp;
        this._rewardHistory = data.listList;
        this._rewardTsList = data.tslistList;
        this._rewardTsList.sort((a, b) => a - b);
        if (this._rewardTsList.length == 0 || this._rewardTime > this._rewardTsList[this._rewardTsList.length - 1]) {
            this._rewardTsList.push(this._rewardTime);
        }
        this._rewardIndex = this._rewardTsList.indexOf(this._rewardTime);
        this.refreshReward();
    },

    //刷新当前日榜单
    refreshReward() {
        //显示x月x日
        var date = new Date(this._rewardTime * 1000);
        var month = cc.find('bg/month', this.rewardNode);
        month.getComponent(cc.Label).string = date.getMonth() + 1 + '';
        var day = cc.find('bg/day', this.rewardNode);
        day.getComponent(cc.Label).string = date.getDate() + '';
        //获取控件
        var leftBtn = cc.find('bg/pre', this.rewardNode);
        var rightBtn = cc.find('bg/next', this.rewardNode);
        var top1 = cc.find('first', this.rewardNode);
        var top2 = cc.find('second/view/content', this.rewardNode);
        var top3 = cc.find('third/view/content', this.rewardNode);
        //清理UI
        top2.removeAllChildren();
        top3.removeAllChildren();
        cc.find('bg', top1).active = false;
        cc.find('nick', top1).getComponent(cc.Label).string = '';
        cc.find('code', top1).getComponent(cc.Label).string = '';
        cc.find('head_mask/head', top1).getComponent(cc.Sprite).spriteFrame = null;
        //刷新UI
        var itemnode = cc.find('item', this.rewardNode);
        var secIndex = 0;
        var thirdIndex = 0;
        for (var i = 0; i < this._rewardHistory.length; i++) {
            var his = this._rewardHistory[i];
            switch (his.rewardLevel) {
                case 1:
                    cc.find('bg', top1).active = true;
                    var headsp = cc.find('head_mask/head', top1).getComponent(cc.Sprite);
                    cc.dd.SysTools.loadWxheadH5(headsp, his.head);
                    cc.find('nick', top1).getComponent(cc.Label).string = cc.dd.Utils.subChineseStr(his.userName, 0, 14);
                    cc.find('code', top1).getComponent(cc.Label).string = '兑奖码：' + his.rewardCode;
                    break;
                case 2:
                    var newitem = cc.instantiate(itemnode);
                    cc.find('no/lbl', newitem).getComponent(cc.Label).string = ++secIndex + '';
                    var headsp = cc.find('head_mask/head', newitem).getComponent(cc.Sprite);
                    cc.dd.SysTools.loadWxheadH5(headsp, his.head);
                    cc.find('nick', newitem).getComponent(cc.Label).string = cc.dd.Utils.subChineseStr(his.userName, 0, 14);
                    cc.find('code', newitem).getComponent(cc.Label).string = '兑奖码：' + his.rewardCode;
                    newitem.active = true;
                    top2.addChild(newitem);
                    break;
                case 3:
                    var newitem = cc.instantiate(itemnode);
                    cc.find('no/lbl', newitem).getComponent(cc.Label).string = ++thirdIndex + '';
                    var headsp = cc.find('head_mask/head', newitem).getComponent(cc.Sprite);
                    cc.dd.SysTools.loadWxheadH5(headsp, his.head);
                    cc.find('nick', newitem).getComponent(cc.Label).string = cc.dd.Utils.subChineseStr(his.userName, 0, 14);
                    cc.find('code', newitem).getComponent(cc.Label).string = '兑奖码：' + his.rewardCode;
                    newitem.active = true;
                    top3.addChild(newitem);
                    break;
            }
        }
        //显示前一日后一日
        leftBtn.active = this._rewardIndex > 0;
        rightBtn.active = this._rewardIndex < this._rewardTsList.length - 1;
        this.rewardNode.active = true;
    },

    //获取时间戳是从2020年开始的第几天
    getDaysSince2020(timestamp) {
        var date = new Date(timestamp);
        var flagDate = new Date('2020');//参考日期
        return Math.ceil((date - flagDate) / DAY_MILLISECONDS);
    },

    //显示我的记录
    showRecord(msg) {
        var content = cc.find('bg/scrollview/view/content', this.recordNode);
        var item = cc.find('bg/item', this.recordNode);
        content.removeAllChildren();
        for (var i = 0; i < msg.listList.length; i++) {
            //TODO:
            var newitem = cc.instantiate(item);
            cc.find('date', newitem).getComponent(cc.Label).string = this.formatDate(msg.listList[i].rewardTime * 1000);
            cc.find('code', newitem).getComponent(cc.Label).string = msg.listList[i].rewardCode;
            switch (msg.listList[i].rewardRank) {
                case 0:
                    cc.find('level', newitem).color = cc.color(126, 80, 17);
                    cc.find('level', newitem).getComponent(cc.Label).string = '未中奖';
                    break;
                case 1:
                    cc.find('level', newitem).color = cc.color(255, 0, 0);
                    cc.find('level', newitem).getComponent(cc.Label).string = '一等奖';
                    break;
                case 2:
                    cc.find('level', newitem).color = cc.color(255, 0, 0);
                    cc.find('level', newitem).getComponent(cc.Label).string = '二等奖';
                    break;
                case 3:
                    cc.find('level', newitem).color = cc.color(255, 0, 0);
                    cc.find('level', newitem).getComponent(cc.Label).string = '三等奖';
                    break;
            }
            newitem.active = true;
            content.addChild(newitem);
        }
        this.recordNode.active = true;
    },

    //状态改变
    changeStatus(msg) {
        var status = msg.state;
        switch (status) {
            case 1://开始
                var pbObj = new cc.pb.slot.get_cash_activity_req();
                cc.gateNet.Instance().sendMsg(cc.netCmd.slot.cmd_get_cash_activity_req, pbObj, 'get_cash_activity_req', true);
                break;
            case 2://结束
                this._data.isOpenCash = true;
                //TODO:
                break;
        }
    },

    //获取到抽奖码
    receivedCode(msg) {
        if (msg.retCode == 0) {
            this._data.userCashCode = msg.cashCode;
            var self = this;
            this.codeAni.onRunCode(this._data.userCashCode, function () {//领取兑奖码动画  以及完成回调
                var btn_lbl_node = cc.find('main/btn/lbl', self.node);
                if (btn_lbl_node) {
                    var btn_lbl = btn_lbl_node.getComponent(cc.Label);
                    btn_lbl.string = '兑奖码:' + self._data.userCashCode;
                }
            });
        }
        else {
            cc.dd.PromptBoxUtil.show('获取兑奖码失败');
        }
    },

    //更新倒计时
    modifyTime(time) {
        var hours = Math.floor(time / 3600);
        var mins = Math.floor(time % 3600 / 60);
        var seconds = Math.floor(time % 60);
        var time_str = (hours < 10 ? '0' + hours : hours) + ':' + (mins < 10 ? '0' + mins : mins) + ':' + (seconds < 10 ? '0' + seconds : seconds);
        this.remainSecLbl.string = time_str;
    },

    ////////////////////////////////////////////// 点击处理 //////////////////////////////////////////////
    //点击关闭
    onClickClose(event, custom) {
        hall_audio_mgr.com_btn_click();
        switch (custom) {
            case 'main':
                cc.dd.UIMgr.destroyUI(this.node);
                break;
            case 'rule':
                this.ruleNode.active = false;
                break;
            case 'reward':
                this.rewardNode.active = false;
                break;
            case 'record':
                this.recordNode.active = false;
                break;
        }
    },
    //打开规则界面
    onClickRule(event, custom) {
        hall_audio_mgr.com_btn_click();
        this.ruleNode.active = true;
    },
    //中奖榜单
    onClickReward(event, custom) {
        hall_audio_mgr.com_btn_click();
        var pbObj = new cc.pb.slot.msg_day_cash_activity_reward_history_req();
        cc.gateNet.Instance().sendMsg(cc.netCmd.slot.cmd_msg_day_cash_activity_reward_history_req, pbObj, 'msg_day_cash_activity_reward_history_req', true);
    },
    //点击前一天
    onClickYesterday(event, custom) {
        hall_audio_mgr.com_btn_click();
        var pbObj = new cc.pb.slot.msg_day_cash_activity_reward_history_req();
        pbObj.setTimestamp(this._rewardTsList[this._rewardIndex - 1]);
        cc.gateNet.Instance().sendMsg(cc.netCmd.slot.cmd_msg_day_cash_activity_reward_history_req, pbObj, 'msg_day_cash_activity_reward_history_req', true);
    },
    //点击后一天
    onClickTomorrow(event, custom) {
        hall_audio_mgr.com_btn_click();
        var pbObj = new cc.pb.slot.msg_day_cash_activity_reward_history_req();
        pbObj.setTimestamp(this._rewardTsList[this._rewardIndex + 1]);
        cc.gateNet.Instance().sendMsg(cc.netCmd.slot.cmd_msg_day_cash_activity_reward_history_req, pbObj, 'msg_day_cash_activity_reward_history_req', true);
    },
    //完善信息
    onClickAddress(event, custom) {
        hall_audio_mgr.com_btn_click();
        var pbObj = new cc.pb.rank.get_receiving_address_req();
        cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_get_receiving_address_req, pbObj, 'get_receiving_address_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'get_receiving_address_req');
        //this.addressNode.active = true;
    },

    //我的记录
    onClickRecord(event, custom) {
        hall_audio_mgr.com_btn_click();
        var pbObj = new cc.pb.slot.msg_user_cash_activity_reward_history_req();
        cc.gateNet.Instance().sendMsg(cc.netCmd.slot.cmd_msg_user_cash_activity_reward_history_req, pbObj, 'msg_user_cash_activity_reward_history_req', true);
    },
    //点击获取兑奖码
    onClickGetCode(event, custom) {
        cc.sys.localStorage.setItem('duijiang_fist_click', true);
        this.firstHand.active = false;
        if (!this._data.isOpenCash && !this._data.userCashCode) {
            hall_audio_mgr.com_btn_click();
            var pbObj = new cc.pb.slot.msg_get_user_activity_cash_code_req();
            cc.gateNet.Instance().sendMsg(cc.netCmd.slot.cmd_msg_get_user_activity_cash_code_req, pbObj, 'msg_get_user_activity_cash_code_req', true);
        }
    },
    /////////////////////////////////////////////////////////////////////////////////////////

    formatDate(ts) {
        var date = new Date(ts);
        return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
    },
});
