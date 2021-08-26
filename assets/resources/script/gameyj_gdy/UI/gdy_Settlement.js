var gdyData = require('gdy_game_data').GDY_Data;
var gdy_send_msg = require('gdy_send_msg');
var Define = require("Define");
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var jlmj_prefab = require('jlmj_prefab_cfg');
var HallPropData = require('hall_prop_data').HallPropData;


cc.Class({
    extends: cc.Component,
    properties: {
        settlement: { type: cc.Node, default: null, tooltip: '结算节点' },
        win_font: { type: cc.Font, default: null, tooltip: '胜利字' },
        lose_font: { type: cc.Font, default: null, tooltip: '失败字' },
        jahao: { type: cc.SpriteFrame, default: null, tooltip: "加号" },
        jianhao: { type: cc.SpriteFrame, default: null, tooltip: "减号" },
        Players: { default: [], type: cc.Node, tooltip: '玩家分数' },
        ResultsBg: { default: null, type: cc.Sprite, tooltip: '结果背景图' },
        RatholingNode: { type: cc.Node, default: null, tooltip: '换桌' },
    },

    onLoad: function () {

    },

    onDestroy: function () {

    },

    /**
     * 结算信息
     * @param data 结算数据
     */
    InitSettlement: function (data) {
        this.settlement.active = true;
        if (!data)
            return;

        var roomtype = RoomMgr.Instance().gameId;
        if (roomtype == Define.GameType.GDY_FRIEND) {
            this.RatholingNode.active = false;
        }

        this.deployScore(data.resultList);
        var roomtype = RoomMgr.Instance().gameId;
        if (roomtype == Define.GameType.GDY_FRIEND) {
            var circleNum = RoomMgr.Instance()._Rule.circleNum;
            var num = gdyData.Instance().GetCurrentnNum();
            if (circleNum == num) {
                cc.find('btns', this.node).active = false;
                cc.find('taotai', this.node).active = true;
                return;
            }
        }

        cc.find('btns', this.node).active = true;
        cc.find('taotai', this.node).active = false;
        this.countdown();

        this.scheduleOnce(function () {
            if (HallPropData.getInstance().getCoin() < gdyData.Instance().m_nUnderScore) {
                cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_XIAOQIAN, function (ui) {
                    var mj_huaqian = ui.getComponent("mj_huaqian");
                    mj_huaqian.setEntermin(gdyData.Instance().m_nUnderScore);
                });
            }
        }, 3);
    },

    /**
     * 部署玩家分数信息
     * @param scoreList 玩家分数集合
     */
    deployScore: function (scoreList) {
        for (var i = 0; i < scoreList.length; ++i) {
            var itemdata = scoreList[i];
            if (!itemdata)
                continue;
            var view = gdyData.Instance().idToView(itemdata.id);
            var roleNum = gdyData.Instance().getPlayerNum();
            if (roleNum == 3 && view == 2) {
                view = 3;
            }
            var item = this.Players[view];
            if (item) {
                this.deployScoreItem(item, itemdata.score)
            }
        }
    },

    /**
     * 部署分数item数据
     * @param parent 分数父节点
     * @param score 玩家得分数据
     */
    deployScoreItem: function (parent, score) {
        parent.active = true;
        var scorebg = cc.find('score', parent).getComponent(cc.Sprite);
        var lbl = cc.find('lbl', parent).getComponent(cc.Label);
        var num = Math.abs(score);
        if (!scorebg || !lbl) return;

        if (score > 0) {
            scorebg.spriteFrame = this.jahao;
            lbl.font = this.win_font;
            console.log('赢-------:' + score);
            this.refershBg(true);
        } else {
            scorebg.spriteFrame = this.jianhao;
            lbl.font = this.lose_font;
            console.log('输-------:' + score);
            this.refershBg(false);
        }
        lbl.string = num;
    },


    /**
     * 显示背景
     * @param results 输赢结果
     */
    refershBg: function (results) {
        var bone = cc.find('detail/win', this.node).getComponent(dragonBones.ArmatureDisplay);
        var Lose = cc.find('detail/lose', this.node).getComponent(cc.Sprite);
        bone.node.active = false;
        Lose.node.active = false;
        if (results) {
            bone.node.active = true;
            bone.node.enabled = false;
            bone.playAnimation('NYL', 1);
        } else {
            Lose.node.active = true;
        }
    },

    /**
     * 倒计时
     */
    countdown: function () {
        this.nextGameTime = 15;
        this.schedule(this.timer, 1);
    },

    timer: function () {
        this.nextGameTime--;
        if (this.nextGameTime < 0) {
            this.nextGameTime = 0;
            this.unschedule(this.timer);
            var roomtype = RoomMgr.Instance().gameId;
            console.log("timer :" + roomtype);
            if (roomtype == Define.GameType.GDY_GOLD)
                this.sendLeaveRoom();
        }
        cc.find('btns/paoyao_djs/time_red', this.node).getComponent(cc.Label).string = this.nextGameTime.toString();
    },

    /**
    * 离开房间
    */
    sendLeaveRoom: function () {
        if (this.node.active) {
            this.unschedule(this.timer);
            var msg = new cc.pb.room_mgr.msg_leave_game_req();
            var gameType = RoomMgr.Instance().gameId;
            var roomId = gdyData.Instance().GetRoomid();
            var gameInfoPB = new cc.pb.room_mgr.common_game_header();
            gameInfoPB.setGameType(gameType);
            gameInfoPB.setRoomId(roomId);
            msg.setGameInfo(gameInfoPB);
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_leave_game_req, msg, "msg_leave_game_req", true);
        }
    },

    /**
     * 继续按钮点击事件
     */
    onContinueEvent: function (event, data) {
        hall_audio_mgr.com_btn_click();
        this.unschedule(this.timer);
        this.settlement.active = false;
        const req = new cc.pb.room_mgr.room_prepare_req();
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_room_prepare_req, req,
            'room_prepare_req', 'no');
    },

    /**
     * 换桌按钮点击事件
     */
    onExchangeDeskEvent: function (event, data) {
        hall_audio_mgr.com_btn_click();
        this.unschedule(this.timer);
        this.settlement.active = false;
        var pbData = new cc.pb.room_mgr.msg_change_room_req();
        pbData.setGameType(RoomMgr.Instance().gameId);
        pbData.setRoomCoinId(gdyData.Instance().GetRoomid());
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_change_room_req, pbData, 'msg_change_room_req', true);
    },

});