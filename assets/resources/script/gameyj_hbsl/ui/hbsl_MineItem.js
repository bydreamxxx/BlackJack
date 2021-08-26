const HBSL_ED = require('hbslData').HBSL_ED;
const HBSL_Event = require('hbslData').HBSL_Event;
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var Define = require('Define');
var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,
    properties: {
        id: { type: cc.Label, default: null, tooltip: "id" },
        headUrl: { type: cc.Sprite, default: null, tooltip: "头像" },
        nameNode: { type: cc.Label, default: null, tooltip: "名字" },
        coin: { type: cc.Label, default: null, tooltip: "金币" },
    },
    onLoad: function () {

    },

    onDestroy: function () {
        this.key = 0;
    },

    setMineItmeData: function (index, data) {
        if (!data) return;
        this.key = data.id;
        this.id.string = index;
        this.data = data;
        if (data.role.headUrl.indexOf('.jpg') != -1) {
            let robotUrl = require('Platform').GetRobotUrl();
            cc.dd.SysTools.loadWxheadH5(this.headUrl, data.role.headUrl);
        }
        else {
            //data.role.headUrl = 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIVzCqyENHrIf8wB3AiaXHAFsUOuLT4b1fJd9No6YGnwFQm5iccIxR8iaWicEU5POCjWYc25b8IicfzheQ/132';
            if (data.role.headUrl) {
                cc.dd.SysTools.loadWxheadH5(this.headUrl, data.role.headUrl);
            }
        }
        this.nameNode.string = cc.dd.Utils.substr(data.role.name, 0, 4);
        var lblstr = (data.money * 0.0001 * data.rate).toString();
        //var newlblstr = lblstr.replace('.', '/');
        this.coin.string = lblstr;
    },

    setWatchingData: function (index, data) {
        if (!data) return;
        this.id.string = index;
        if (data.headUrl.indexOf('.jpg') != -1) {
            let robotUrl = require('Platform').GetRobotUrl();
            cc.dd.SysTools.loadWxheadH5(this.headUrl, robotUrl + data.headUrl);
        }
        else {
            if (data.headUrl) {
                cc.dd.SysTools.loadWxheadH5(this.headUrl, data.headUrl);
            }
        }
        this.nameNode.string = cc.dd.Utils.substr(data.name, 0, 4);
        var lblstr = '';
        var coinnum = data.money * 0.0001;
        if(coinnum > 10000)
            lblstr = cc.dd.Utils.getNumToWordTransform(coinnum);
        else
            lblstr = coinnum.toFixed(2);
        //var lblstr = (data.money * 0.0001).toFixed(2);
        this.coin.string = lblstr;
    },

    /**
     * 点击面板
     */
    onClickItem: function () {
        if (!this.data) return;
        if (this.data.role.userid != cc.dd.user.id)
            return;
        hall_audio_mgr.com_btn_click();
        if (RoomMgr.Instance().gameId == Define.GameType.HBSL_GOLD) {
            HBSL_ED.notifyEvent(HBSL_Event.CLICK_ITME, this.key);
        }
    },

});