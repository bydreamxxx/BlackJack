var hall_audio_mgr = require('hall_audio_mgr');
var hall_prefab = require('hall_prefab_cfg');
const Hall = require('jlmj_halldata');
var hallData = require('hall_common_data').HallCommonData;
var AppConfig = require('AppConfig');
var game_duli = require('game_duli');
var klb_game_list_config = require('klb_gameList');
var HallCommonObj = require('hall_common_data');
var HallCommonData = HallCommonObj.HallCommonData;

let getCoin = cc.Class({
    extends: cc.Component,

    properties: {
        itemRecived: [cc.Node],
    },

    onLoad() {
        for (let i = 0; i < this.itemRecived.length; i++) {
            this.checkActive(i, this.itemRecived[i]);
        }
    },

    checkActive(idx, node) {
        switch (idx) {
            case 0:
                //签到
                node.active = Hall.HallData.Instance().isSigned;
                node.parent.active = Hall.HallData.Instance().sign_data;
                break;
            case 1:
                break;
            case 2:
                //实名认证
                node.active = !hallData.getInstance().idNum == '';
                break;
            case 3:
                //绑定邮箱
                node.active = !hallData.getInstance().telNum == '';
                break;
            case 4:
                //救济金
                // node.active = hallData.getInstance().jiuji_cnt == 0;
                break;
            case 5:
                //任务
                // let have = true;
                // for (var i = 0; i < cc._taskDataList.length; i++) {
                //     if (cc._taskDataList[i].status != 3) {
                //         have = false;
                //         break;
                //     }
                // }
                // node.active = have;
                break;
            case 6:
                break;
        }
    },

    start() {
    },

    close() {
        hall_audio_mgr.Instance().com_btn_click();
        if (cc.director.getScene().name === AppConfig.HALL_NAME) {
            cc.dd.UIMgr.destroyUI(this.node);
        }
    },

    onClickClose: function () {
        hall_audio_mgr.Instance().com_btn_click();
        if (cc.director.getScene().name !== AppConfig.HALL_NAME) {
            var jiesuan = null, jiesuanNode = null;
            switch (HallCommonData.getInstance().gameId) {
                case cc.dd.Define.GameType.CCMJ_GOLD:
                    jiesuanNode = cc.find('Canvas/desk_info');
                    if (jiesuanNode != null) {
                        jiesuan = jiesuanNode.getComponent('ccmj_desk_info_jbc')._jiesuan
                    }
                    break;
                case cc.dd.Define.GameType.DDZ_GOLD:
                    jiesuanNode = cc.find('Canvas/root/result_ani');
                    if (jiesuanNode != null) {
                        jiesuan = jiesuanNode.getComponent('ddz_jiesuan_jbc');
                    }
                    break;
            }
            if (jiesuan != null) {
                jiesuan.startTime();
            }
        }

        cc.dd.UIMgr.destroyUI(this.node);
    },

    onClickSign: function () {
        cc.dd.UIMgr.openUI('blackjack_hall/prefabs/daily_active/klb_hall_daily_active_QD', function (prefab) {
            prefab.getComponent('klb_hall_daily_sign').showClsoeBtn(true);
        });

        this.close();
    },

    onClickShare: function () {

        if (cc.sys.isBrowser) {
            cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_SHARE_H5, function (ui) {

            }.bind(this));
        } else {
            cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_SHARE, function (ui) {
                var share_ui = ui.getComponent('klb_hall_share');
                if (share_ui != null) {
                    let shareItem = cc.dd.Utils.getRandomShare();
                    if (!cc.dd._.isNull(shareItem)) {
                        var title = shareItem.title;
                        var content = shareItem.content;
                        share_ui.setShareData(title, content);
                        share_ui.setFirstShare();
                    }

                }
            }.bind(this));
        }

        this.close();

    },

    onClickRealName: function () {
        // cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_USERINFO, function (ui) {
        //     ui.getComponent('klb_hall_UserInfo').setData(hallData.getInstance());
        //     cc.find('topBtn/toggle1', ui).getComponent(cc.Toggle).isChecked = true;
        //     cc.find('topBtn/toggle2', ui).getComponent(cc.Toggle).isChecked = false;
        //     cc.find('topBtn/toggle3', ui).getComponent(cc.Toggle).isChecked = false;
        //     ui.getComponent('klb_hall_UserInfo').switchPage(null, 0);
        // });
        cc.dd.UIMgr.openUI(hall_prefab.CERTIFICATION);
        this.close();
    },

    onClickBindPhone: function () {
        // cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_USERINFO, function (ui) {
        //     ui.getComponent('klb_hall_UserInfo').openBindPhoneUI(2);
        // });
        cc.dd.UIMgr.openUI(hall_prefab.BIND_PHONE);
        this.close();
    },

    onClickCoin: function () {
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_JIUJI, function (ui) {
            var jiuji = ui.getComponent('klb_hall_jiuji');
            if (jiuji != null) {
                jiuji.update_buy_list(2000);
            }
        }.bind(this));
        this.close();
    },

    onClickTask: function () {
        /************************游戏统计 start************************/
        cc.dd.Utils.sendClientAction(cc.dd.clientAction.HALL, cc.dd.clientAction.T_HALL.TASK);
        /************************游戏统计   end************************/
        if (cc.director.getScene().name === AppConfig.HALL_NAME) {
            cc.dd.UIMgr.openUI("blackjack_hall/prefabs/klb_hall_tasknew");
        } else {
            cc.dd.SceneManager.endcallEx = () => {
                cc.dd.UIMgr.openUI("blackjack_hall/prefabs/klb_hall_tasknew");
            }

            switch (HallCommonData.getInstance().gameId) {
                case cc.dd.Define.GameType.CCMJ_GOLD:
                    let DeskEvent = require('jlmj_desk_data').DeskEvent;
                    let DeskED = require('jlmj_desk_data').DeskED;
                    let msg = {};
                    msg.status = 7;
                    DeskED.notifyEvent(DeskEvent.LEAVE_TIPS, msg);
                    break;
                case cc.dd.Define.GameType.DDZ_GOLD:
                    let DDZ_Data = require('ddz_data').DDZ_Data;

                    let sendLeaveRoom = () => {
                        var msg = new cc.pb.room_mgr.msg_leave_game_req();
                        var gameType = DDZ_Data.Instance().getGameId();
                        var roomId = DDZ_Data.Instance().getRoomId();
                        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
                        gameInfoPB.setGameType(gameType);
                        gameInfoPB.setRoomId(roomId);
                        msg.setGameInfo(gameInfoPB);
                        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);
                    }

                    if (DDZ_Data.Instance().getIsMatching()) {
                        // 取消匹配状态
                        sendLeaveRoom();
                    } else {
                        if (DDZ_Data.Instance().getIsStart()) {
                            sendLeaveRoom();
                        } else {
                            DDZ_Data.Destroy();
                            cc.dd.SceneManager.enterHall();
                        }
                    }
                    break;
            }
        }
        this.close();
    },

    onClickMatch: function () {
        /************************游戏统计 start************************/
        cc.dd.Utils.sendClientAction(cc.dd.clientAction.HALL, cc.dd.clientAction.T_HALL.LUCKYMONEY);
        /************************游戏统计   end************************/
        if (cc.director.getScene().name === AppConfig.HALL_NAME) {
            cc.dd.UIMgr.openUI(hall_prefab.KLB_Match, function (node) {
                node.getComponent('klb_hall_Match').sendGetMatch(1);
            }.bind(this));
        } else {
            switch (HallCommonData.getInstance().gameId) {
                case cc.dd.Define.GameType.CCMJ_GOLD:
                    let DeskEvent = require('jlmj_desk_data').DeskEvent;
                    let DeskED = require('jlmj_desk_data').DeskED;
                    let msg = {};
                    msg.status = 9;
                    DeskED.notifyEvent(DeskEvent.LEAVE_TIPS, msg);
                    break;
                case cc.dd.Define.GameType.DDZ_GOLD:
                    let DDZ_Data = require('ddz_data').DDZ_Data;

                    cc.ddz_go_to_match = true;

                    let sendLeaveRoom = () => {
                        var msg = new cc.pb.room_mgr.msg_leave_game_req();
                        var gameType = DDZ_Data.Instance().getGameId();
                        var roomId = DDZ_Data.Instance().getRoomId();
                        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
                        gameInfoPB.setGameType(gameType);
                        gameInfoPB.setRoomId(roomId);
                        msg.setGameInfo(gameInfoPB);
                        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);
                    }

                    if (DDZ_Data.Instance().getIsMatching()) {
                        // 取消匹配状态
                        sendLeaveRoom();
                    } else {
                        if (DDZ_Data.Instance().getIsStart()) {
                            sendLeaveRoom();
                        } else {
                            DDZ_Data.Destroy();
                            cc.dd.SceneManager.enterHallMatch();
                        }
                    }
                    break;
            }
        }

        this.close();
    },

    /**
     * 关注有礼点击事件
     */
    onClikcFocus: function () {
        cc.dd.PromptBoxUtil.show('活动暂未开放');
        // cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_GUANZHU, function (ui) {
        // }.bind(this));
        // this.close();
    },
});
module.exports = getCoin;
