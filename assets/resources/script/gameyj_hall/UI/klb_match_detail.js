var hall_audio_mgr = require('hall_audio_mgr').Instance();
var itemCfg = require('item');
const Bsc_Event = require('bsc_data').BSC_Event;
const Bsc_ED = require('bsc_data').BSC_ED;
var rule_config = require('klb_rule');
const Bsc_sendMsg = require('bsc_sendMsg');
const Bsc = require('bsc_data');

cc.Class({
    extends: cc.Component,

    properties: {
        reward_item: cc.Prefab,
        sign_sp: cc.SpriteFrame,
        unsign_sp: cc.SpriteFrame,
        end_sp: cc.SpriteFrame,
        itemAtlas: cc.SpriteAtlas,
        btn_sp: cc.Sprite,

        timeLbl: cc.Label,//开赛时间
        matchName: cc.Label,//比赛名称
        freeLbl: cc.Label,//免费报名次数
        minFree: cc.Label,
        feeLbl: cc.RichText,//报名条件
        free: cc.Node,//免费报名
        signBtn: cc.Node,//按钮
        need: cc.Node,//还需多少人参加
        daojishi: cc.Node,//倒计时Node
        haveLbl: cc.Label,//有多少人报名
        signBtnLbl: cc.Sprite,//按钮文字
        needLbl: cc.Label,//还需多少人参加
        total: cc.Label,//总共多少人
        rewardNode: cc.Node,//奖励节点

        daojishiLbl: cc.Label,//倒计时时间
        daojishiNeed: cc.Label,//倒计时描述

        yaoqing: cc.Node,//微信分享

        btnList: [cc.SpriteFrame]
    },

    onLoad() {
        Bsc_ED.addObserver(this);
    },

    onDestroy: function () {
        Bsc_ED.removeObserver(this);
    },

    showDetail(data) {
        this.signBtn.getComponent(cc.Button).interactable = true;
        cc.find('bg/dingshisai/cost', this.node).active = false;
        //----------------分享按钮------------------
        if (data.matchClass == 3) {
            this.yaoqing.active = true;
            //     cc.find('bg/sign_btn', this.node).x = 212;
            //     cc.find('bg/sign_btn', this.node).width = 240;
        }
        else {
            this.yaoqing.active = false;
            //     cc.find('bg/sign_btn', this.node).x = 270.6;
            //     cc.find('bg/sign_btn', this.node).width = 326;
        }
        //----------------分享按钮end------------------
        this.timeLbl.string = data.opentime.replace(':00', '');
        this.matchName.string = data.name;
        if (data.freeSignTimes > 0) {
            this.freeLbl.string = data.freeSignTimes.toString();
            this.free.active = true;
            //cc.find('bg/min/free', this.node).getComponent(cc.Label).string = '（前' + data.freeSignTimes.toString() + '次无限制）';
        }
        else {
            this.free.active = false;
            this.minFree.string = '';
        }
        this.feeLbl.string = '';
        if (data.freeSignTimes - data.usedFreeSignTimes > 0)
            this.feeLbl.string = '<color=#815A2E>免费(剩余</c><color=#CB633E>' + (data.freeSignTimes - data.usedFreeSignTimes) + '</c><color = #815A2E>次)</color>';
        else if (data.signFeeList.length > 0) {
            for (var idx = 0; idx < data.signFeeList.length; idx++) {
                var dataFee = data.signFeeList[idx];
                if (dataFee) {
                    var iteminfo = itemCfg.getItem(function (item) {
                        return item.key == dataFee.type;
                    });
                    if (iteminfo) {
                        // if(cc.dd._.isString(iteminfo.icon) && iteminfo.icon.length > 0){
                        //     this.feeLbl.string += '<img src=\'' + iteminfo.key + '\' /><color=#CB633E> '+ dataFee.num + '</color>';
                        // }else{
                        this.feeLbl.string += '<color=#815A2E>' + iteminfo.memo + 'x</c><color=#CB633E>' + dataFee.num + '</color>';
                        // }
                    }
                }
            }
        }
        else {
            this.feeLbl.string = '<color=#815A2E>免费</c>';
        }

        //cc.find('bg/min/lbl', this.node).getComponent(cc.Label).string = data.minCoinNum.toString() + '豆';
        this.signBtn.tag = { isSign: data.isSign, matchId: data.matchId, openSignNum: data.openSignNum, matchClass: data.matchClass, matchState: data.matchState };
        this.signBtn.gameType = data.gameType;

        this.need.active = (data.matchClass == 1);
        this.daojishi.active = (data.matchClass == 2 || data.matchClass == 3);

        if (data.matchClass == 2 || data.matchClass == 3) {
            this.openseconds = data.openseconds;
            this.openStartTime = data.openStartTime;
            this.openType = data.matchClass;
            this.matchId = data.matchId;
            this.matchState = data.matchState;
            this.refreshRemainTime();
            this.schedule(this.refreshRemainTime, 10);
        }
        if (data.matchClass == 3) {
            this.haveLbl.string = data.joinNum.toString();
            if (data.matchState == 3) {
                this.signBtnLbl.spriteFrame = this.btnList[4];//已结束
                this.btn_sp.spriteFrame = this.end_sp;
                this.signBtn.getComponent(cc.Button).interactable = false;
            }
            else {
                if (data.isSign) {
                    this.signBtnLbl.spriteFrame = this.btnList[1];//'我要退赛';
                    this.btn_sp.spriteFrame = this.unsign_sp;
                }
                else {
                    this.signBtnLbl.spriteFrame = this.btnList[0];//'立即参赛';
                    this.btn_sp.spriteFrame = this.sign_sp;
                }
            }
        }
        else {
            var node = this.node.getChildByName('bg');
            if (data.matchClass == 2) {
                this.refreshRewardPool(this.matchId);
                this.unschedule(this.refreshMatchInfo);
                this.refreshMatchInfo();
                this.schedule(this.refreshMatchInfo, 5);
                if (data.isSign) {
                    this.signBtnLbl.spriteFrame = this.btnList[1];//'我要退赛';
                    this.btn_sp.spriteFrame = this.unsign_sp;
                    //Bsc_sendMsg.getBaomingNum(data.matchId);
                }
                else {
                    if (data.matchState == 3 || data.matchState == 4) {
                        this.signBtnLbl.spriteFrame = this.btnList[4];//已结束
                        this.btn_sp.spriteFrame = this.end_sp;
                        this.signBtn.getComponent(cc.Button).interactable = false;
                    }
                    else if (data.matchState == 2) {
                        this.signBtnLbl.spriteFrame = this.btnList[3];//进行中
                        this.btn_sp.spriteFrame = this.end_sp;
                        this.signBtn.getComponent(cc.Button).interactable = false;
                    }
                    else if (data.matchState == 6) {//中途加入
                        this.signBtnLbl.spriteFrame = this.btnList[2];
                        this.btn_sp.spriteFrame = this.sign_sp;
                        cc.find('dingshisai/cost/round', node).getComponent(cc.Label).string = '预赛第' + data.curRound + '轮';
                        if (data.joinFeeList[0]) {
                            if (data.signFeeList[0])
                                cc.find('dingshisai/cost/pay', node).getComponent(cc.Label).string = '+' + (data.joinFeeList[0].num - data.signFeeList[0].num);
                            else
                                cc.find('dingshisai/cost/pay', node).getComponent(cc.Label).string = '+' + data.joinFeeList[0].num;
                        }

                        cc.find('dingshisai/cost', node).active = true;
                    }
                    else {
                        this.signBtnLbl.spriteFrame = this.btnList[0];//'立即参赛';
                        this.btn_sp.spriteFrame = this.sign_sp;
                    }
                }
            }
            else {
                if (data.isSign) {
                    this.signBtnLbl.spriteFrame = this.btnList[1];//'我要退赛';
                    this.btn_sp.spriteFrame = this.unsign_sp;
                    //Bsc_sendMsg.getBaomingNum(data.matchId);
                }
                else {
                    this.signBtnLbl.spriteFrame = this.btnList[0];//'立即参赛';
                    this.btn_sp.spriteFrame = this.sign_sp;
                    this.haveLbl.string = '-';
                    // cc.find('bg/have/lbl', this.node).color = cc.color(0, 126, 26);
                    this.needLbl.string = '-';
                    // cc.find('bg/need/lbl', this.node).color = cc.color(0, 126, 26);
                }
            }
        }
        this.total.string = data.joinNum.toString();
        this.rewardNode.removeAllChildren(true);
        // cc.find('bg/reward_node_2', this.node).removeAllChildren(true);

        let rewardInfo = [];
        for (let i = 0; i < data.rewardListList.length; i++) {
            let result = data.rewardListList[i].rankTo - data.rewardListList[i].rankFrom + 1;
            for (let j = 0; j < result; j++) {
                rewardInfo.push(data.rewardListList[i]);
            }
        }
        //奖励列表
        for (var j = 0; j < rewardInfo.length; j++) {
            var node = cc.instantiate(this.reward_item);
            // if (rewardInfo[j].rankFrom == rewardInfo[j].rankTo) {
            cc.find('rank_lbl', node).getComponent(cc.Label).string = '第' + (j + 1) + '名:';
            // }
            // else {
            //     cc.find('rank_lbl', node).getComponent(cc.Label).string = rewardInfo[j].rankFrom.toString() + '-' + rewardInfo[j].rankTo.toString() + '名:';
            // }
            if (rewardInfo[j].rewardListList.length == 0) {
                cc.find('reward/icon', node).active = false;
                if (rewardInfo[j].text && rewardInfo[j].text != '') {
                    let info = rewardInfo[j].text;
                    if (cc.game_pid == 10008) {
                        info = info.replace('券', '');
                    }
                    cc.find('reward/num', node).getComponent(cc.Label).string = info;
                }
            }
            for (var k = 0; k < rewardInfo[j].rewardListList.length; k++) {
                var curReward = rewardInfo[j].rewardListList[k];
                if (k == 0) {
                    if (curReward.type == 1001) {
                        cc.find('reward/icon', node).getComponent(cc.Sprite).spriteFrame = this.itemAtlas.getSpriteFrame('1001');
                        cc.find('reward/icon', node).active = true;
                        cc.find('reward/num', node).getComponent(cc.Label).string = curReward.num.toString();
                    }
                    else if (curReward.type == 1004 || curReward.type == 1099) {
                        var item = itemCfg.getItem(function (dat) {
                            return (dat.key == curReward.type)
                        })
                        cc.find('reward/icon', node).active = false;

                        let info = item.memo;
                        if (cc.game_pid == 10008) {
                            info = info.replace('券', '')
                        }

                        cc.find('reward/num', node).getComponent(cc.Label).string = info + 'x' + (Math.floor(curReward.num * 10) / 1000).toString() + '元';
                    } else if (curReward.type == 1005) {
                        cc.find('reward/icon', node).getComponent(cc.Sprite).spriteFrame = this.itemAtlas.getSpriteFrame('1005');
                        cc.find('reward/icon', node).active = true;
                        if (curReward.num > 9999) {
                            cc.find('reward/num', node).getComponent(cc.Label).string = parseInt(curReward.num / 10000) + '万';
                        }
                        else {
                            cc.find('reward/num', node).getComponent(cc.Label).string = curReward.num.toString();
                        }
                    }
                    else {
                        if (curReward.type == 0) {//rewardInfo[j].text && rewardInfo[j].text != ''
                            cc.find('reward/icon', node).active = false;
                        }
                        else {
                            cc.find('reward/icon', node).getComponent(cc.Sprite).spriteFrame = this.itemAtlas.getSpriteFrame(curReward.type.toString());
                            cc.find('reward/icon', node).active = true;
                            cc.find('reward/num', node).getComponent(cc.Label).string = 'x' + curReward.num.toString();
                        }
                    }
                }
                else {
                    var item = itemCfg.getItem(function (dat) {
                        return (dat.key == curReward.type)
                    })
                    let info = item.memo;
                    if (cc.game_pid == 10008) {
                        info = info.replace('券', '')
                    }
                    cc.find('reward/num', node).getComponent(cc.Label).string += ' + ' + item.memo + 'x' + curReward.num;
                }
                if (k == rewardInfo[j].rewardListList.length - 1) {
                    if (rewardInfo[j].text && rewardInfo[j].text != '') {
                        cc.find('reward/num', node).getComponent(cc.Label).string += " + " + rewardInfo[j].text;
                    }
                }
            }
            // if (j < 3) {
            this.rewardNode.addChild(node);
            // }
            // else {
            //     cc.find('bg/reward_node_2', this.node).addChild(node);
            // }
        }
        var node = this.node.getChildByName('bg');
        if (data.matchClass == 2) {//定时赛
            cc.find('have', node).active = false;
            this.daojishi.active = false;
            cc.find('total', node).active = false;
            cc.find('total1', node).active = false;
            cc.find('total2', node).active = false;

            cc.find('dingshisai/have/lbl', node).getComponent(cc.Label).string = data.joinNum.toString();
            cc.find('dingshisai', node).active = true;
        }
        else {
            cc.find('have', node).active = true;
            this.daojishi.active = (data.matchClass != 1);
            cc.find('total', node).active = true;
            cc.find('total1', node).active = true;
            cc.find('total2', node).active = true;
            cc.find('dingshisai', node).active = false;
        }
    },

    closeDetail: function () {
        hall_audio_mgr.com_btn_click();
        this.unschedule(this.refreshRemainTime);
        this.unschedule(this.refreshMatchInfo);
        this.node.active = false;
    },

    //刷新奖池
    refreshRewardPool(matchId) {
        const req = new cc.pb.match.msg_get_match_reward_pool_req();
        req.setMatchId(matchId);
        cc.gateNet.Instance().sendMsg(cc.netCmd.match.cmd_msg_get_match_reward_pool_req, req,
            'msg_get_match_reward_pool_req', 'no');
    },
    //刷新定时赛数据
    refreshMatchInfo() {
        if (this.matchId) {
            this.refreshRewardPool(this.matchId);
            const req = new cc.pb.bisai.msg_match_info_req();
            req.setMatchId(this.matchId);
            cc.gateNet.Instance().sendMsg(cc.netCmd.bisai.cmd_msg_match_info_req, req,
                'msg_match_info_req', 'no');
        }
    },

    refreshRemainTime() {
        var curTime = new Date().getTime();
        var leftSeconds = this.openseconds - parseInt((curTime - this.openStartTime) / 1000);
        var Min = Math.ceil(leftSeconds / 60);
        if (this.openType == 2) {
            if (leftSeconds <= 0) {
                if (this.matchState == 4)
                    this.daojishiLbl.string = '已作废';
                else
                    this.daojishiLbl.string = '已开赛';
                this.daojishiNeed.string = '';
                this.unschedule(this.refreshRemainTime);
            } else {
                var hours = parseInt(Min / 60);
                var minutes = parseInt(Min % 60);
                this.daojishiLbl.string = hours + '小时' + minutes + '分钟';
                this.daojishiNeed.string = '距离开赛还有';
            }
        }
        else if (this.openType == 3) {
            if (leftSeconds <= -60 * 10) {
                if (this.matchState == 4)
                    this.daojishiLbl.string = '已作废';
                else
                    this.daojishiLbl.string = '已开赛';
                this.daojishiNeed.string = '';
                this.unschedule(this.refreshRemainTime);
            }
            else if (leftSeconds <= 0) {
                var m_item = this.getDataByMatchId(this.matchId);
                if (m_item && m_item.matchState == 5) {
                    var minutes = Math.ceil((60 * 10 + leftSeconds) / 60);
                    this.Lbl.string = minutes + '分钟';
                    this.daojishiNeed.string = '延迟开赛还有';
                }
                else {
                    if (this.matchState == 4)
                        this.daojishiLbl.string = '已作废';
                    else
                        this.daojishiLbl.string = '已开赛';
                    this.daojishiNeed.string = '';
                }
            } else {
                var hours = parseInt(Min / 60);
                var minutes = parseInt(Min % 60);
                this.daojishiLbl.string = hours + '小时' + minutes + '分钟';
                this.daojishiNeed.getComponent(cc.Label).string = '距离开赛还有';
            }
        }
    },

    //刷新比赛场信息
    updateInfo(data) {
        if (data.matchId != this.signBtn.tag.matchId)
            return;
        cc.find('bg/dingshisai/cost', this.node).active = false;
        this.signBtn.getComponent(cc.Button).interactable = true;
        this.total.string = data.joinNum.toString();
        var node = this.node.getChildByName('bg');
        if (data.matchClass == 2) {
            if (data.isSign) {
                this.signBtnLbl.spriteFrame = this.btnList[1];//'我要退赛';
                this.btn_sp.spriteFrame = this.unsign_sp;
            }
            else {
                if (data.matchState == 3 || data.matchState == 4) {
                    this.signBtnLbl.spriteFrame = this.btnList[4];//已结束
                    this.btn_sp.spriteFrame = this.end_sp;
                    this.signBtn.getComponent(cc.Button).interactable = false;
                }
                else if (data.matchState == 2) {
                    this.signBtnLbl.spriteFrame = this.btnList[3];//进行中
                    this.btn_sp.spriteFrame = this.end_sp;
                    this.signBtn.getComponent(cc.Button).interactable = false;
                }
                else if (data.matchState == 6) {//中途加入
                    this.signBtnLbl.spriteFrame = this.btnList[2];
                    this.btn_sp.spriteFrame = this.sign_sp;
                    cc.find('dingshisai/cost/round', node).getComponent(cc.Label).string = '预赛第' + data.curRound + '轮';
                    if (data.joinFeeList[0]) {
                        if (data.signFeeList[0])
                            cc.find('dingshisai/cost/pay', node).getComponent(cc.Label).string = '+' + (data.joinFeeList[0].num - data.signFeeList[0].num);
                        else
                            cc.find('dingshisai/cost/pay', node).getComponent(cc.Label).string = '+' + data.joinFeeList[0].num;
                    }
                    cc.find('dingshisai/cost', node).active = true;
                }
                else {
                    this.signBtnLbl.spriteFrame = this.btnList[0];//'立即参赛';
                    this.btn_sp.spriteFrame = this.sign_sp;
                }
            }
        }
        else {
            if (data.isSign) {
                this.signBtnLbl.spriteFrame = this.btnList[1];//'我要退赛';
                this.btn_sp.spriteFrame = this.unsign_sp;
                //Bsc_sendMsg.getBaomingNum(data.matchId);
            }
            else {
                this.signBtnLbl.spriteFrame = this.btnList[0];//'立即参赛';
                this.btn_sp.spriteFrame = this.sign_sp;
                this.haveLbl.string = '-';
                // cc.find('bg/have/lbl', this.node).color = cc.color(0, 126, 26);
                this.needLbl.string = '-';
                // cc.find('bg/need/lbl', this.node).color = cc.color(0, 126, 26);
            }
        }
        if (data.matchClass == 2) {//定时赛
            cc.find('have', node).active = false;
            this.daojishi.active = false;
            cc.find('total', node).active = false;
            cc.find('total1', node).active = false;
            cc.find('total2', node).active = false;

            cc.find('dingshisai/have/lbl', node).getComponent(cc.Label).string = data.joinNum.toString();
            cc.find('dingshisai', node).active = true;
        }
        else {
            cc.find('have', node).active = true;
            this.daojishi.active = (data.matchClass != 1);
            cc.find('total', node).active = true;
            cc.find('total1', node).active = true;
            cc.find('total2', node).active = true;
            cc.find('dingshisai', node).active = false;
        }
    },

    //更新奖池数量
    updateRewardPool(msg) {
        if (msg.matchId != this.signBtn.tag.matchId)
            return;
        cc.find('bg/dingshisai/jiangchi/num', this.node).getComponent(cc.Label).string = msg.poolNum.toString();
        cc.find('bg/dingshisai/jiangchi/num/num', this.node).getComponent(cc.Label).string = msg.poolNum.toString();

        this.rewardNode.removeAllChildren(true);
        let rewardInfo = [];
        for (let i = 0; i < msg.rewardList.length; i++) {
            let result = msg.rewardList[i].rankTo - msg.rewardList[i].rankFrom + 1;
            for (let j = 0; j < result; j++) {
                rewardInfo.push(msg.rewardList[i]);
            }
        }
        //奖励列表
        for (var j = 0; j < rewardInfo.length; j++) {
            var node = cc.instantiate(this.reward_item);
            // if (rewardInfo[j].rankFrom == rewardInfo[j].rankTo) {
            cc.find('rank_lbl', node).getComponent(cc.Label).string = '第' + (j + 1) + '名:';
            // }
            // else {
            //     cc.find('rank_lbl', node).getComponent(cc.Label).string = rewardInfo[j].rankFrom.toString() + '-' + rewardInfo[j].rankTo.toString() + '名:';
            // }
            if (rewardInfo[j].rewardListList.length == 0) {
                cc.find('reward/icon', node).active = false;
                if (rewardInfo[j].text && rewardInfo[j].text != '') {
                    let info = rewardInfo[j].text;
                    if (cc.game_pid == 10008) {
                        info = info.replace('券', '');
                    }
                    cc.find('reward/num', node).getComponent(cc.Label).string = info;
                }
            }
            for (var k = 0; k < rewardInfo[j].rewardListList.length; k++) {
                var curReward = rewardInfo[j].rewardListList[k];
                if (k == 0) {
                    if (curReward.type == 1001) {
                        cc.find('reward/icon', node).getComponent(cc.Sprite).spriteFrame = this.itemAtlas.getSpriteFrame('1001');
                        cc.find('reward/icon', node).active = true;
                        cc.find('reward/num', node).getComponent(cc.Label).string = curReward.num.toString();
                    }
                    else if (curReward.type == 1004 || curReward.type == 1099) {
                        var item = itemCfg.getItem(function (dat) {
                            return (dat.key == curReward.type)
                        })
                        cc.find('reward/icon', node).active = false;
                        let info = item.memo;
                        if (cc.game_pid == 10008) {
                            info = info.replace('券', '')
                        }
                        cc.find('reward/num', node).getComponent(cc.Label).string = item.memo + 'x' + (Math.floor(curReward.num * 10) / 1000).toString() + '元';
                    } else if (curReward.type == 1005) {
                        cc.find('reward/icon', node).getComponent(cc.Sprite).spriteFrame = this.itemAtlas.getSpriteFrame('1005');
                        cc.find('reward/icon', node).active = true;
                        if (curReward.num > 9999) {
                            cc.find('reward/num', node).getComponent(cc.Label).string = parseInt(curReward.num / 10000) + '万';
                        }
                        else {
                            cc.find('reward/num', node).getComponent(cc.Label).string = curReward.num.toString();
                        }
                    }
                    else {
                        if (curReward.type == 0) {//rewardInfo[j].text && rewardInfo[j].text != ''
                            cc.find('reward/icon', node).active = false;
                        }
                        else {
                            cc.find('reward/icon', node).getComponent(cc.Sprite).spriteFrame = this.itemAtlas.getSpriteFrame(curReward.type.toString());
                            cc.find('reward/icon', node).active = true;
                            cc.find('reward/num', node).getComponent(cc.Label).string = 'x' + curReward.num.toString();
                        }
                    }
                }
                else {
                    var item = itemCfg.getItem(function (dat) {
                        return (dat.key == curReward.type)
                    })
                    let info = item.memo;
                    if (cc.game_pid == 10008) {
                        info = info.replace('券', '')
                    }
                    cc.find('reward/num', node).getComponent(cc.Label).string += ' + ' + item.memo + 'x' + curReward.num;
                }
                if (k == rewardInfo[j].rewardListList.length - 1) {
                    if (rewardInfo[j].text && rewardInfo[j].text != '') {
                        cc.find('reward/num', node).getComponent(cc.Label).string += " + " + rewardInfo[j].text;
                    }
                }
            }
            this.rewardNode.addChild(node);
        }
    },

    //打开规则界面
    openRule(event, custom) {
        hall_audio_mgr.com_btn_click();
        var gameType = this.signBtn.gameType;
        if (gameType) {
            var ruleInfo = rule_config.getItem(function (data) {
                return data.gameid == gameType;
            });
            if (ruleInfo) {
                cc.find('rule/scrollview/view/text', this.node).getComponent(cc.Label).string = ruleInfo.playlaws;
                cc.find('rule', this.node).active = true;
            }
        }
    },
    closeRule(event, custom) {
        hall_audio_mgr.com_btn_click();
        cc.find('rule', this.node).active = false;
    },

    //打开战绩
    sendHistory(event, custom) {
        hall_audio_mgr.com_btn_click();
        const req = new cc.pb.match.msg_get_match_rank_history_list_req();
        cc.gateNet.Instance().sendMsg(cc.netCmd.match.cmd_msg_get_match_rank_history_list_req, req,
            'msg_get_match_rank_history_list_req', 'no');
    },
    openHistory(msg) {
        var list = msg.listList;
        var content_node = cc.find('history/scrollview/view/content', this.node);
        var item_node = cc.find('history/item', this.node);
        content_node.removeAllChildren();
        if (list && list.length) {
            for (var i = 0; i < list.length; i++) {
                var item = cc.instantiate(item_node);
                cc.find('layout/rank', item).getComponent(cc.Label).string = list[i].userRank.toString();
                var date = new Date(list[i].startTime * 1000);
                cc.find('date', item).getComponent(cc.Label).string = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
                cc.find('view', item).tag = { rankId: list[i].rankId };
                var reward = '';
                if (list[i].reward.rewardList.length == 0) {
                    if (list[i].reward.text && list[i].reward.text != '') {
                        reward = list[i].reward.text;
                    }
                }
                for (var j = 0; j < list[i].reward.rewardList.length; j++) {
                    var curReward = list[i].reward.rewardList[j];
                    var it = itemCfg.getItem(function (dat) {
                        return (dat.key == curReward.type)
                    });
                    var str = it.memo + 'x';
                    if (curReward.type == 1004 || curReward.type == 1099) {
                        str += (Math.floor(curReward.num * 10) / 1000).toString() + '元';
                    } else {
                        if (curReward.num > 9999) {
                            str += parseInt(curReward.num / 10000) + '万';
                        }
                        else {
                            str += curReward.num.toString();
                        }
                    }
                    if (j > 0) {
                        str = '+' + str;
                    }
                    reward += str;
                    if (j == list[i].reward.rewardList.length - 1) {
                        if (list[i].reward.text && list[i].reward.text != '') {
                            reward += " + " + list[i].reward.text;
                        }
                    }
                }
                cc.find('reward', item).getComponent(cc.Label).string = reward;
                content_node.addChild(item);
                item.active = true;
            }
        }
        cc.find('history', this.node).active = true;
    },
    closeHistory(event, custom) {
        hall_audio_mgr.com_btn_click();
        cc.find('history', this.node).active = false;
    },
    sendHistoryDetail(event, custom) {
        var rankId = event.target.tag.rankId;
        if (rankId) {
            hall_audio_mgr.com_btn_click();
            const req = new cc.pb.match.msg_get_match_rank_history_detail_req();
            req.setRankId(rankId);
            cc.gateNet.Instance().sendMsg(cc.netCmd.match.cmd_msg_get_match_rank_history_detail_req, req,
                'msg_get_match_rank_history_detail_req', 'no');
        }
    },
    openHistoryDetail(msg) {
        var list = msg.detailList;
        var content_node = cc.find('history/detail/scrollview/view/content', this.node);
        var item_node = cc.find('history/detail/item', this.node);
        content_node.removeAllChildren();
        if (list && list.length) {
            for (var i = 0; i < list.length; i++) {
                var item = cc.instantiate(item_node);
                cc.find('layout/rank', item).getComponent(cc.Label).string = list[i].userRank.toString();
                cc.find('player', item).getComponent(cc.Label).string = cc.dd.Utils.substr(list[i].userName, 0, 6);
                var reward = '';
                if (list[i].reward.rewardList.length == 0) {
                    if (list[i].reward.text && list[i].reward.text != '') {
                        reward = list[i].reward.text;
                    }
                }
                for (var j = 0; j < list[i].reward.rewardList.length; j++) {
                    var curReward = list[i].reward.rewardList[j];
                    var it = itemCfg.getItem(function (dat) {
                        return (dat.key == curReward.type)
                    });
                    var str = it.memo + 'x';
                    if (curReward.type == 1004 || curReward.type == 1099) {
                        str += (Math.floor(curReward.num * 10) / 1000).toString() + '元';
                    } else {
                        if (curReward.num > 9999) {
                            str += parseInt(curReward.num / 10000) + '万';
                        }
                        else {
                            str += curReward.num.toString();
                        }
                    }
                    if (j > 0) {
                        str = '+' + str;
                    }
                    reward += str;
                    if (j == list[i].reward.rewardList.length - 1) {
                        if (list[i].reward.text && list[i].reward.text != '') {
                            reward += " + " + list[i].reward.text;
                        }
                    }
                }
                cc.find('reward', item).getComponent(cc.Label).string = reward;
                content_node.addChild(item);
                item.active = true;
            }
        }
        cc.find('history/detail', this.node).active = true;
    },
    closeHistoryDetail(event, custom) {
        hall_audio_mgr.com_btn_click();
        cc.find('history/detail', this.node).active = false;
    },

    onSign(event, custom) {
        hall_audio_mgr.com_btn_click();
        if (event.target.tag.matchClass == 3) {//密码赛
            if (event.target.tag.isSign) {
                Bsc_sendMsg.tuiSai(event.target.tag.matchId);
            } else {
                this.pwdMatchId = event.target.tag.matchId;
                this.passwordNode.active = true;
            }
        } else {
            if (event.target.tag.isSign) {
                var obj = Bsc.BSC_Data.Instance().getActListBytype(1);
                if (obj) {
                    var data = obj.infoList;
                    if (data && data.length) {
                        var matchdata = data.find(function (x) { return x.matchId == event.target.tag.matchId });
                        if (matchdata) {
                            if (matchdata.num >= matchdata.openSignNum)
                                return;
                        }
                    }
                }
                Bsc_sendMsg.tuiSai(event.target.tag.matchId);
            } else {
                if (event.target.tag.matchClass == 2 && event.target.tag.matchState == 6)
                    Bsc_sendMsg.zhongtujiaru(event.target.tag.matchId);
                else
                    Bsc_sendMsg.baoming(event.target.tag.matchId);
            }
        }
    },

    onClose(event, custom) {
        this.node.destroy();
    },

    onEventMessage: function (event, data) {
        switch (event) {
            case Bsc_Event.BSC_BAO_MING:
                if (data == this.signBtn.tag.matchId) {
                    this.signBtn.tag.isSign = true;
                    this.signBtnLbl.spriteFrame = this.btnList[1];//'我要退赛';
                    this.btn_sp.spriteFrame = this.unsign_sp;
                    //Bsc_sendMsg.getBaomingNum(data);
                }
                break;
            case Bsc_Event.BSC_TUI_SAI:
                //cc.dd.PromptBoxUtil.show('取消报名成功!');
                if (data == this.signBtn.tag.matchId) {
                    this.signBtn.tag.isSign = false;
                    this.signBtnLbl.spriteFrame = this.btnList[0];//'立即参赛';
                    this.btn_sp.spriteFrame = this.sign_sp;
                    this.haveLbl.string = '-';
                    // cc.find('bg/have/lbl', this.node).color = cc.color(0, 126, 26);
                    this.needLbl.string = '-';
                    // cc.find('bg/need/lbl', this.node).color = cc.color(0, 126, 26);
                }
                break
            case Bsc_Event.BSC_CHANG_NUM:
                this.haveLbl.string = data.toString();
                // cc.find('bg/have/lbl', this.node).color = cc.color(204, 0, 0);
                this.needLbl.string = (this.signBtn.tag.openSignNum - data).toString();
                // cc.find('bg/need/lbl', this.node).color = cc.color(0, 126, 26);
                break;
            case Bsc_Event.BSC_UPDATE_NUM:
                if (cc.find('bg/sign_btn', this.node).tag.matchId == data.matchId) {
                    this.haveLbl.string = data.num.toString();
                    // cc.find('bg/have/lbl', this.node).color = cc.color(204, 0, 0);
                    // cc.find('bg/need/lbl', this.node).color = cc.color(0, 126, 26);
                    this.needLbl.string = (this.signBtn.tag.openSignNum - data.num).toString();
                    cc.find('bg/dingshisai/have/lbl', this.node).getComponent(cc.Label).string = data.joinNum.toString();
                    this.total.string = data.joinNum.toString();
                }
                break;
            case Bsc_Event.BSC_UPDATE_DETAIL:
                this.updateInfo(data.matchInfo);
                break;
            case Bsc_Event.BSC_REWARD_POOL_UPDATE:
                this.updateRewardPool(data);
                break;
            case Bsc_Event.BSC_DINGSHI_HISTORY:
                this.openHistory(data);
                break;
            case Bsc_Event.BSC_DINGSHI_HISTORY_DETAIL:
                this.openHistoryDetail(data);
                break;
        }
    }
});
