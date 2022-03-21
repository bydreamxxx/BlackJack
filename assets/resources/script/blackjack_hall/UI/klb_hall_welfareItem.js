const Hall = require('jlmj_halldata');
var hall_prefab = require('hall_prefab_cfg');
var HallTask = require('hall_task').Task;

const HallCommonData = require('hall_common_data').HallCommonData;

cc.Class({
    extends: cc.Component,

    properties: {
        icon: cc.Sprite,
        left_flag: cc.Sprite,
        title: cc.Label,
        finished: cc.Node,
        tips: cc.Node,
        lock: cc.Node,
        frameBg: cc.Sprite,
        atlas: cc.SpriteAtlas,
        shineNode: cc.Node,
    },

    setData: function (data) {
        this.data = data;
        this.title.string = data.title;
        // var atlas = cc.loader.getRes("blackjack_hall/atals/fudai",cc.SpriteAtlas);
        var icon_frames = ['', 'fd-meihdtb', 'd2', 'fd-hongbaotb', 'fd-qdtb', 'fd-fenxiangtb', 'fd-jiujitb', 'fd-xyzp', 'fd-tztb', 'fd-ydtb', 'fd-yuanbao', 'fd-shoujibdtb', 'fd-hbjuan', 'fd-yuekalibao'];
        if (data.icon_type > 0) {
            var spriteFrame = this.atlas.getSpriteFrame(icon_frames[data.icon_type]);
            this.icon.spriteFrame = spriteFrame;
            this.icon.node.width = spriteFrame.getRect().width;
            this.icon.node.height = spriteFrame.getRect().height;
        }
        var left_frames = ['', 'fd-mrbq', 'fd-tzybq', 'fd-ydaotb'];
        if (data.sub_type == 1) {
            this.left_flag.node.active = false;
            this.left_flag.spriteFrame = this.atlas.getSpriteFrame(left_frames[data.sub_type]);
            this.frameBg.spriteFrame = this.atlas.getSpriteFrame('fd-wpdk1');
            this.title.node.color = cc.color(16, 127, 213);
            // var cpt = this.title.node.getComponent(cc.LabelOutline)
            // cpt.color = cc.color(9,92,156);
        } else if (data.sub_type == 0) {
            this.left_flag.node.active = false;
            this.frameBg.spriteFrame = this.atlas.getSpriteFrame('fd-wpdk');
            this.title.node.color = cc.color(12, 112, 35);
            // var cpt = this.title.node.getComponent(cc.LabelOutline)
            // cpt.color = cc.color(15,114,38);
        } else if (data.sub_type == 3) {
            this.left_flag.node.active = false;
            this.frameBg.spriteFrame = this.atlas.getSpriteFrame('fd-wpdk2');
            this.title.node.color = cc.color(153, 59, 12);
        } else if (data.sub_type == 4) {
            this.left_flag.node.active = false;
            this.frameBg.spriteFrame = this.atlas.getSpriteFrame('fd-wpdk2');
            this.title.node.color = cc.color(153, 59, 12);
        }
        this.finished.active = false;
        this.tips.active = false;
        this.shineNode.active = false;

        //每日分享和每日抽奖是常闪
        if (data.type == 2 || data.type == 3) {
            this.shineNode.active = true;
            // var bone = this.shineNode.getComponent(dragonBones.ArmatureDisplay);
            // bone.playAnimation('FDK', -1);
            var bone = this.shineNode.getComponent(sp.Skeleton);
            bone.setAnimation(0, 'animation', true);
        }

        this.lock.active = data.level > HallTask.Instance().task_level; //临时
        if (data.level > HallTask.Instance().task_level) {
            this.finished.active = true;
            var spr = this.finished.getChildByName('finishSp');
            spr.active = false;
        } else {
            var taskInfo = HallTask.Instance().getTask(data.task_id)
            if (taskInfo) {
                //任务完成
                if ((taskInfo.progressList[0].curCnt >= taskInfo.progressList[0].targetCnt) && taskInfo.flag == 1) {
                    this.finished.active = true;
                    var spr = this.finished.getChildByName('finishSp');
                    spr.active = true;
                    // this.shineNode.stopAllActions();
                } else if ((taskInfo.progressList[0].curCnt >= taskInfo.progressList[0].targetCnt) && taskInfo.flag == 0) {
                    //任务完成未领取
                    this.tips.active = true;

                    this.shineNode.active = true;
                    // var bone = this.shineNode.getComponent(dragonBones.ArmatureDisplay);
                    // bone.playAnimation('FDK', -1);
                    var bone = this.shineNode.getComponent(sp.Skeleton);
                    bone.setAnimation(0, 'animation', true);
                }
            }
        }
    },

    onClick: function () {
        if (this.lock.active) {
            if (this.data.level > HallCommonData.getInstance().level) {
                cc.dd.PromptBoxUtil.show('Insufficient honor level, please try to upgrade!');
            } else {
                var level = this.data.level;
                var taskInfo = HallTask.Instance().getTask(level + 26);
                if (taskInfo == null) {
                    var str = 'The upper-level lucky bag still has level rewards that have not yet been claimed. After receiving it, a new lucky bag can be opened.';
                    cc.dd.DialogBoxUtil.show(1, str, "text33");
                    return;

                }
                if (taskInfo.flag == 0) {
                    var str = 'LV' + (level - 1) + '福袋还有等级奖励未领取，领取后可开启新的福袋';
                    cc.dd.DialogBoxUtil.show(1, str, "text33");
                } else {
                    var pbObj = new cc.pb.rank.msg_trigger_level_task_2s();
                    pbObj.setLevel(this.data.level);
                    cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_msg_trigger_level_task_2s, pbObj, 'msg_trigger_level_task_2s', true);
                    cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'msg_trigger_level_task_2s');
                }
            }
            return;
        }
        switch (this.data.type) {
            case 1:
                //首冲礼包
                cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_FIRST_BUY, function (ui) {
                    var cpt = ui.getComponent('klb_hall_first_buy');
                    // var seq = cc.sequence(cc.delayTime(0.2), cc.callFunc(function () {
                    //     cpt.initItemList();
                    // }));
                    // this.node.runAction(seq);
                    cc.tween(this.node)
                        .delay(0.2)
                        .call(function () {
                            cpt.initItemList();
                        })
                        .start();
                }.bind(this));
                break;
            case 2:
                //每日抽奖
                //cc.dd.PromptBoxUtil.show( '功能NOT YET OPEN!' );
                cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_DAILY_LOTTERY_CHOOSE);
                break;
            case 3:
                //每日分享
                cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_SHARE, function (ui) {
                    var share_ui = ui.getComponent('klb_hall_share');
                    if (share_ui != null) {
                        // var title = '【巷乐棋牌】';
                        // var content = '我又在【巷乐棋牌】中获得了2000金币,赶紧来巷乐和我一起玩游戏抢红包了!';
                        // share_ui.setShareData(title,content);
                        var pics = 'hongbaochaokuaisai1.jpg;hongbaochaokuaisai2.jpg;fenxiang01.jpg;fenxiang02.jpg;fenxiang03.jpg;fenxiang04.jpg;fenxiang05.jpg;fenxiang06.jpg';
                        var share_imgs = pics.split(';');
                        var idx = 0;
                        if (share_imgs.length > 1) {
                            idx = Math.floor(Math.random() * share_imgs.length);
                        }
                        share_ui.setShareImg(share_imgs[idx]);
                    }
                });
                // cc.dd.UIMgr.destroyUI(hall_prefab.KLB_HALL_WELFAREBAG);
                break;
            case 4:
                //每日签到
                cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_DAILY_ACTIVITY, function (node) {
                    node.getComponent('klb_hall_daily_activeUI').showUI(2);
                });
                // cc.dd.UIMgr.destroyUI(hall_prefab.KLB_HALL_WELFAREBAG);
                break;
            case 5:
                //救济
                cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_JIUJI);
                // cc.dd.UIMgr.destroyUI(hall_prefab.KLB_HALL_WELFAREBAG);
                break;
            case 6:
                //任务
                // cc.dd.PromptBoxUtil.show( '功能NOT YET OPEN!' );
                cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_TASK, function (ui) {
                    var task_ui = ui.getComponent('jlmj_hall_taskUI');
                    if (task_ui == null) {
                        cc.error('未挂jlmj_hall_taskUI组件');
                        return;
                    }
                    task_ui.setTaskId(this.data.task_id);
                }.bind(this));
                break;
            case 7://月卡礼包
                cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_YUE_KA);
                break;
            default:
                break;
        }
    },

});
