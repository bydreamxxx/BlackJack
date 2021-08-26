var PY_Data = require('paoyao_data').PaoYao_Data;
var py_send_msg = require('py_send_msg');
var PYEnum_Data = require("paoyao_type").EnumData.Instance();
var Define = require("Define");
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
const PY_ED = require('paoyao_data').PY_ED;
const PY_Event = require('paoyao_data').PY_Event;
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
        atlas_game: { type: cc.SpriteAtlas, default: null, tooltip: "游戏图集" },
        Players: { default: [], type: cc.Node, tooltip: '玩家分数' },
        ResultsBg: { default: null, type: cc.Sprite, tooltip: '结果背景图' },
        FenNode: { default: null, type: cc.Node, tooltip: '结果描述' },
        PrepareNode: { type: cc.Node, default: null, tooltip: '开始*2' },
        RatholingNode: { type: cc.Node, default: null, tooltip: '换桌' },
        xuearr: { type: cc.Node, default: [], tooltip: '雪' },
    },

    onLoad: function () {

    },

    onDestroy: function () {

    },

    /**
     * 结算信息
     * @param data 结算数据
     */
    /**
     * 输赢结果（results）: 0|1，输赢方式(Settlement): 1|2|3 ，加倍类型(Snow): 1|2|3，ScoreList:[score,uiseid]
     * 
     * 分数：score   玩家ID:uiseid
     */
    InitSettlement: function (data) {
        this.settlement.active = true;
        if (!data)
            return;

        var roomtype = RoomMgr.Instance().gameId;
        if (roomtype == Define.GameType.PAOYAO_FRIEND) {
            if (RoomMgr.Instance()._Rule.double)
                this.PrepareNode.active = true;
            else
                this.PrepareNode.active = false;
            this.RatholingNode.active = false;
        } else {
            this.PrepareNode.active = true;
            this.RatholingNode.active = true;
        }

        this.deployScore(data.resultList);
        var teamid = PY_Data.getInstance().GetPlayerTeamID();
        var results = data.winId == teamid ? true : false;
        var teamScore = PY_Data.getInstance().getTeamScoreByID(teamid);
        var isScore = teamScore >= 140 ? true : false;
        this.refershBg(results, data.winType, data.xueType, isScore);
        var roomtype = RoomMgr.Instance().gameId;
        if (roomtype == Define.GameType.PAOYAO_FRIEND) {
            var circleNum = RoomMgr.Instance()._Rule.circleNum;
            var num = PY_Data.getInstance().GetCurCircle();
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
            if (HallPropData.getInstance().getCoin() < PY_Data.getInstance().m_nUnderScore) {
                cc.dd.UIMgr.openUI(jlmj_prefab.JLMJ_XIAOQIAN, function (ui) {
                    var mj_huaqian = ui.getComponent("mj_huaqian");
                    mj_huaqian.setEntermin(PY_Data.getInstance().m_nUnderScore);
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
            var view = PY_Data.getInstance().idToView(itemdata.id);
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
        var bg = cc.find('bg', parent).getComponent(cc.Sprite).node;
        var winbg = cc.find('winbg', parent).getComponent(cc.Sprite).node;
        var scorebg = cc.find('score', parent).getComponent(cc.Sprite);
        var lbl = cc.find('lbl', parent).getComponent(cc.Label);
        var num = Math.abs(score);

        if (!bg || !scorebg || !lbl) return;

        bg.active = false;
        winbg.active = false;
        if (score > 0) {
            winbg.active = true;
            scorebg.spriteFrame = this.jahao;
            lbl.font = this.win_font;
            console.log('赢-------:' + score);
        } else {
            bg.active = true;
            scorebg.spriteFrame = this.jianhao;
            lbl.font = this.lose_font;
            console.log('输-------:' + score);
        }

        var roomtype = RoomMgr.Instance().gameId;
        if (roomtype == Define.GameType.PAOYAO_FRIEND) {
            var lblstr = (num * 0.1).toString();
            var newlblstr = lblstr.replace('.', '/');
            cc.log('结算 newlblstr:', newlblstr);
            lbl.string = newlblstr;
        } else {
            lbl.string = num;
        }
    },


    /**
     * 显示背景
     * @param results 输赢结果
     * @param settlement 输赢方式
     * @param snow 雪类型
     */
    refershBg: function (results, settlement, snow, isScore) {
        var bone = cc.find('detail/win', this.node).getComponent(dragonBones.ArmatureDisplay);
        var Lose = cc.find('detail/lose', this.node).getComponent(cc.Sprite);
        var lbl1 = cc.find('lbl1', this.FenNode).getComponent(cc.Label);
        var settlementstr = PYEnum_Data.GetSettlementEnumStr(settlement);
        var snowstr = PYEnum_Data.GetSnowEnumStr(snow);
        if (snow == 3)
            settlementstr = 200 + '分';
        else if(isScore)
            settlementstr = 140 + '分';
        bone.node.active = false;
        Lose.node.active = false;
        if (results) {
            //bone.node.active = true;
            //bone.node.enabled = false;
            //bone.playAnimation('NYL', 1);
            lbl1.string = '我方' + settlementstr + '获胜';
            lbl1.node.color = cc.color(240, 240, 90);
        } else {
            //Lose.node.active = true;
            lbl1.string = '对方' + settlementstr + '获胜';
            lbl1.node.color = cc.color(181, 208, 229);
        }
        //cc.find('lbl2', this.FenNode).getComponent(cc.Label).string = settlementstr;
        //cc.find('lbl4', this.FenNode).getComponent(cc.Label).string = snowstr

        if (this.xuearr) {
            for (var i = 0; i < this.xuearr.length; ++i) {
                var xue = this.xuearr[i];
                if (xue && i == snow - 1)
                    xue.active = true;
                else
                    xue.active = false;
            }
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
        cc.log('结算倒计时时间：', this.nextGameTime);
        if (this.nextGameTime < 0) {
            this.nextGameTime = 0;
            this.unschedule(this.timer);
            var roomtype = RoomMgr.Instance().gameId;
            console.log("timer :" + roomtype);
            if (roomtype != Define.GameType.PAOYAO_FRIEND)
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
            var gameType = PY_Data.getInstance().getGameId();
            var roomId = PY_Data.getInstance().getRoomId();
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
        var roomtype = RoomMgr.Instance().gameId;
        if (roomtype == Define.GameType.PAOYAO_FRIEND) {
            py_send_msg.sendRaady(false);
        } else {
            var pbData = new cc.pb.room_mgr.msg_prepare_game_req();
            var gameInfoPB = new cc.pb.room_mgr.common_game_header();
            gameInfoPB.setGameType(PY_Data.getInstance().getGameId());
            gameInfoPB.setRoomId(PY_Data.getInstance().getRoomId());
            pbData.setGameInfo(gameInfoPB);
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_prepare_game_req, pbData, "msg_prepare_game_req", true);
        }
    },

    /**
     * 加倍开始
     */
    onJiabeiEvent: function () {
        hall_audio_mgr.com_btn_click();
        this.unschedule(this.timer);
        this.settlement.active = false;
        var pbData = new cc.pb.room_mgr.msg_prepare_game_req();
        var gameInfoPB = new cc.pb.room_mgr.common_game_header();
        gameInfoPB.setGameType(PY_Data.getInstance().getGameId());
        gameInfoPB.setRoomId(PY_Data.getInstance().getRoomId());
        pbData.setGameInfo(gameInfoPB);
        pbData.setRate(1);
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_prepare_game_req, pbData, "msg_prepare_game_req", true);

    },


    /**
     * 换桌按钮点击事件
     */
    onExchangeDeskEvent: function (event, data) {
        hall_audio_mgr.com_btn_click();
        this.unschedule(this.timer);
        this.settlement.active = false;
        var pbData = new cc.pb.room_mgr.msg_change_room_req();
        pbData.setGameType(PY_Data.getInstance().getGameId());
        pbData.setRoomCoinId(PY_Data.getInstance().getRoomId());
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_change_room_req, pbData, 'msg_change_room_req', true);
    },

    /**
     * 准备按钮点击事件
     */
    onPrepareEvent: function (event, data) {
        hall_audio_mgr.com_btn_click();
        this.unschedule(this.timer);
        this.settlement.active = false;
        py_send_msg.sendRaady(true)
    },


    /**
     * 分享到朋友圈
     */
    PYQBtnCallBack: function () {
        hall_audio_mgr.com_btn_click();
        if (cc.sys.isNative) {
            var canvasNode = cc.find('Canvas');
            cc.find('gongzhonghao', this.node).active = true;
            cc.dd.native_wx.SendScreenShotTimeline(canvasNode);
            cc.find('gongzhonghao', this.node).active = false;
        }
    },
});