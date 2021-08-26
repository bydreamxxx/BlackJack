
var club_Mgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();
var hall_audio_mgr = require('hall_audio_mgr').Instance();


const DefColor = {
    //CHECK: cc.color(132, 68, 10),
    CHECK: cc.color(0x2b, 0x9f, 0x28),
    UNCHECK: cc.color(0x57, 0x4c, 0x46),
    DISABLED: cc.color(153, 153, 153)
};
cc.Class({
    extends: cc.Component,

    properties: {
        p_club: { default: null, type: cc.Toggle, tooltip: '加入限定' },
    },

    /**
     * 显示视图 时 回调
     */
    onEnable: function () {

    },

    /**
     * 添加视图 时 回调
     */
    onLoad: function () {
        this.initData();
        this.setClub();
    },

    /**
     * 销毁视图 时 回调
     */
    onDestroy: function () {

    },

    /**
     * 创建房间回调
     */
    onCreate: function (event, custom) {
        hall_audio_mgr.com_btn_click();
        if (custom == 'daikai')
            this.sendCreateRoom(true);
        else
            this.sendCreateRoom();
    },

    /**
     * 发送 创建房间
     * @param data
     */
    sendCreateRoom: function (isProxy) {
        var pbData = new cc.pb.room_mgr.msg_create_game_req();
        var pbCommon = new cc.pb.room_mgr.common_game();
        var gdyRule = new cc.pb.room_mgr.gdy_rule_info();
        var rule = new cc.pb.room_mgr.xl_game_rule();
        pbCommon.setGameType(42);
        if (isProxy) {
            pbCommon.setClubCreateType(2);
        }
        //如果是俱乐部创建房间
        if (club_Mgr.getClubOpenCreateUITag()) {
            pbCommon.setClubId(club_Mgr.getSelectClubId());
            pbCommon.setClubCreateType(club_Mgr.getClubCreateRoomType());
        }

        gdyRule.setCircleNum(this.quanshu); //圈数
        gdyRule.setRoleCount(this.renshu); //人数
        gdyRule.setMaxScore(this.fengding); //封顶
        gdyRule.setRuanSan(this.sanruan); //软三
        gdyRule.setBiCard(this.bicard); //必出牌
        gdyRule.setQuanguan(this.quangua); //全关
        gdyRule.setWangDouble(this.guze4);
        gdyRule.setBombDouble(this.guze5);
        gdyRule.setLimitClub(this.club); //是否俱乐部成员
        gdyRule.setLimitWords(false); //禁言
        gdyRule.setLimitTalk(this.yy); //语音
        gdyRule.setGps(this.gps);


        pbData.setGameInfo(pbCommon);
        rule.setGdyRule(gdyRule);
        pbData.setRule(rule);
        if (cc.sys.isNative) {
            if (cc.sys.OS_ANDROID == cc.sys.os) {
                var loc = new cc.pb.room_mgr.latlng();
                var latitude = jsb.reflection.callStaticMethod("game/SystemTool", "getLatitude", "()F");
                var longitude = jsb.reflection.callStaticMethod("game/SystemTool", "getLongitude", "()F");
                loc.setLatitude(latitude);
                loc.setLongitude(longitude);
                cc.log("详细地址：经度 " + longitude);
                cc.log("详细地址：纬度 " + latitude);
                if (parseInt(latitude) != 0 || parseInt(longitude) != 0) {
                    pbData.setLatlngInfo(loc);
                }
            } else if (cc.sys.OS_IOS == cc.sys.os) {
                var loc = new cc.pb.room_mgr.latlng();
                var Latitude = jsb.reflection.callStaticMethod('SystemTool', 'getLatitude');
                var Longitude = jsb.reflection.callStaticMethod('SystemTool', 'getLongitude');
                loc.setLatitude(Latitude);
                loc.setLongitude(Longitude);
                cc.log("详细地址：经度 " + Longitude);
                cc.log("详细地址：纬度 " + Latitude);
                if (parseInt(latitude) != 0 || parseInt(longitude) != 0) {
                    pbData.setLatlngInfo(loc);
                }
            }
        }
        cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_create_game_req, pbData, 'msg_create_game_req', true);
    },


    /**
     * 初始化数据
     */
    initData: function () {
        // 人数
        this.renshu = 3;
        // 圈数
        this.quanshu = 8;
        // 封顶
        this.fengding = 0;
        //三软炸
        this.sanruan = false;
        this.bicard = false;
        this.quangua = true;
        this.guze4 = false;
        this.guze5 = false;
        // 语音
        this.yy = false;
        // GPS
        this.gps = false;
        //俱乐部限定
        this.club = false;
    },



    /**
     * 圈数事件
     */
    onclickQS: function (event, data) {
        var num = parseInt(data);
        if (num > 0) {
            this.quanshu = num;
        }
    },

    /**
     * 人数事件
     */
    onclickRs: function (event, data) {
        var num = parseInt(data);
        if (num > 0) {
            this.renshu = num;
        }
    },

    /**
     * 封顶
     */
    onclickFD: function (event, data) {
        var num = parseInt(data);
        if (num > 0) {
            this.fengding = num;
        }
    },

    /**
     * 规则
     */
    onclickGZ: function (target, data) {
        switch (data) {
            case '1': {
                this.guze5 = false;
                cc.find('layout_rule/toggle_group_guize1/toggle6', this.node).active = target.isChecked; //软炸
                cc.find('layout_rule/toggle_group_guize1/toggle5', this.node).active = !target.isChecked;
                this.sanruan = target.isChecked;
                break;
            }
            case '2':
                this.bicard = target.isChecked;
                break;
            case '3':
                this.quangua = target.isChecked;
                break;
            case '4':
                this.guze4 = target.isChecked;
                break;
            case '5':
                this.guze5 = target.isChecked;
                break;
            case '6':
                this.guze5 = target.isChecked;
                break;
            case 'yy':
                this.yy = target.isChecked;
                break;
            case 'gps':
                this.gps = target.isChecked;
                break;
        }
    },

    /**
    * 设置俱乐部
    */
    setClub: function () {
        this.initToggleColor(this.p_club);
        this.setCheckedToggle(this.p_club, club_Mgr.getClubOpenCreateUITag());
        if (club_Mgr.getClubOpenCreateUITag()) {
            if (cc.find('commonRule/proxy', this.node))
                cc.find('commonRule/proxy', this.node).active = false;
        }
    },

    /**
     * 初始化toggle文字颜色
     * @param target {array | toggle}
     */
    initToggleColor: function (target) {
        if (typeof (target) == "object") {
            if (target instanceof Array) {
                for (var i = 0; i < target.length; ++i) {
                    var toggle = target[i];
                    if (this.isEnableToggle(toggle)) {
                        this.setToggleColor(toggle, DefColor.UNCHECK);
                    }
                }
            } else {
                this.setToggleColor(target, DefColor.UNCHECK);
            }
        }
    },

    /**
     * toggle是否激活
     * @param toggle
     */
    isEnableToggle: function (toggle) {
        return toggle.interactable;
    },

    /**
     * 设置toggle颜色
     * @param toggle
     * @param color
     */
    setToggleColor: function (toggle, color) {
        toggle.node.getChildByName("text_explain").color = color;
        var node = toggle.node.getChildByName('text_explain_count');
        if (node)
            node.color = color;
    },

    /**
     * 设置toggle选中状态
     * @param toggle
     * @param checked
     */
    setCheckedToggle: function (toggle, checked) {
        if (this.isCheckedToggle(toggle) !== checked) {
            if (checked) {
                this.setToggleColor(toggle, DefColor.CHECK);
                toggle.check();
            } else {
                this.setToggleColor(toggle, DefColor.UNCHECK);
                toggle.uncheck();
            }
        }
    },

    
    /**
     * toggle是否选中
     * @param toggle
     */
    isCheckedToggle: function (toggle) {
        return toggle.isChecked;
    },
});
