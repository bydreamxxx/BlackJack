//created by luke on 2019/3/28
const gamelistcfg = require('klb_gameList');
const Define = require("Define");
var Platform = require("Platform");
const AppCfg = require('AppConfig');
var Text = cc.dd.Text;
let GetGameRules = require('GetGameRules');

cc.Class({
    extends: cc.Component,

    properties: {
        titel_lbl: cc.Label,
        game_lbl: cc.Label,
        rule_lbl: cc.Label,
    },

    onLoad: function () {

    },

    //初始化数据信息
    setData(msg) {
        this._roomid = msg.gameInfo.roomId;
        this._gameid = msg.gameInfo.gameType;
        this._gameName = '';
        this.titel_lbl.string = '房间号:' + msg.gameInfo.roomId;
        var cfg = gamelistcfg.getItem(function (item) {
            return item.gameid == msg.gameInfo.gameType;
        }.bind(this));
        if (cfg) {
            this.game_lbl.string = cfg.name;
            this._gameName = cfg.name;
        }
        else
            this.game_lbl.string = '';
        for (var attr in msg.rule) {
            if (attr.endsWith('ule') || attr.endsWith('uleNew')) {
                this._rule = msg.rule[attr];
                break;
            }
        }

        this._ruleStr = GetGameRules.getRuleStr(msg.gameInfo.gameType, this._rule);
        this.rule_lbl.string = cc.dd.Utils.subChineseStr(this._ruleStr.join(' '), 0, 110);
    },

    //分享房间号到微信好友
    shareRoomToFriend(event, custom) {
        // cc.dd.native_wx.SendAppContent(this._gameName + " 房间号:" + (this._roomid || 888888), this._ruleStr.join(' '), Platform.GetAppUrl(AppCfg.GAME_PID, AppCfg.PID));

        let wanFa = this._ruleStr.slice();
        let wanFaTitle = this._gameName;

        var title = wanFaTitle + " 房间号:" + (this._roomid || 888888);

        let jushu = GetGameRules.getJuShu(this._rule, this._gameid);

        let info = {
            gameid: this._gameid,//游戏ID
            roomid: this._roomid,//房间号
            title: wanFaTitle,//房间名称
            content: wanFa,//游戏规则数组
            usercount: GetGameRules.getPlayerNum(this._rule, this._gameid),//人数
            jushu: jushu[0],//局\圈数
            jushutitle: jushu[1],//局\圈标题，默认局数
            playername: [],//玩家姓名数组
            gamestate: '未开始',//游戏状态
        }
        if (custom == 'xianliao')
            cc.dd.native_wx.sendXlApp('', 'room_id=' + this._roomid, title, this._ruleStr.join(' '));
        else
            cc.dd.native_wx.SendAppInvite(info, title, this._ruleStr.join(' '), Platform.wxShareGameUrl[AppCfg.PID]);
    },



    //关闭
    close(event, custom) {
        cc.dd.UIMgr.destroyUI(this.node);
    },
});
