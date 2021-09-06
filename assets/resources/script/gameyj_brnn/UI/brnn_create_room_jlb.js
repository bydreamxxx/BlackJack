/** 
* Created by luke on 2018/12/20
*/
var Define = require("Define");

const MAX_SCORE = 0x7FFFFFFF;
var club_Mgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();

/**
 * 选中 和 未选中 颜色定义
 * @type {{CHECK: cc.Color, UNCHECK: cc.Color}}
 */
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
        this.initView();
    },

    /**
     * 销毁视图 时 回调
     */
    onDestroy: function () {

    },

    /**
     * 选择规则
     */
    onSelectRule: function (target, data) {

    },

    setInvalible(group, invalible) {
        var self = this;
        group.forEach(toggle => {
            toggle.interactable = invalible;
            if (invalible) {
                if (toggle.isChecked) {
                    self.setToggleColor(toggle, DefColor.CHECK);
                }
                else {
                    self.setToggleColor(toggle, DefColor.UNCHECK);
                }
            }
            else {
                self.setToggleColor(toggle, DefColor.DISABLED);
            }
        });
    },

    /**
     * 创建房间回调
     */
    onCreate: function () {
        /************************游戏统计 start************************/
        cc.dd.Utils.sendClientAction(cc.dd.clientAction.BRNN_JLB, cc.dd.clientAction.T_HALL.CREATE_ROOM);
        /************************游戏统计   end************************/
        if (!cc.dd.Utils.isNull(this.m_objRuleIndex)) {
            this.sendCreateRoom(this.m_objRuleIndex);
        }
    },

    /**
     * 发送 创建房间
     * @param data
     */
    sendCreateRoom: function (data) {
        let pbData = this.getRules(data);
        var req = new cc.pb.club.msg_club_create_baofang_req();
        req.setClubId(club_Mgr.getSelectClubId());
        req.setRule(pbData);

        cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_club_create_baofang_req, req, 'msg_club_create_baofang_req', true);
        cc.dd.UIMgr.destroyUI('gameyj_friend/prefab/klb_friend_group_createRoom');
    },


    getRules(data) {
        data = (!cc.dd._.isNull(data) && !cc.dd._.isUndefined(data)) ? data : this.m_objRuleIndex;

        var pbData = new cc.pb.room_mgr.msg_create_game_req();
        var pbCommon = new cc.pb.room_mgr.common_game();
        var rule = new cc.pb.room_mgr.xl_game_rule();

        pbCommon.setGameType(108);
        //如果是俱乐部创建房间
        if (club_Mgr.getClubOpenCreateUITag()) {
            pbCommon.setClubId(club_Mgr.getSelectClubId());
            pbCommon.setClubCreateType(club_Mgr.getClubCreateRoomType());

            //////////////////////////必须添加的部分//////////////////////////
            let commonBeishu = cc.find('gameScrollView/view/content/klb_friend_group_common_beishu', this.node);
            if(commonBeishu){
                let beishu = commonBeishu.getComponent('klb_friend_group_common_beishu').getBeiShu();
                pbCommon.setMultiple(beishu);
            }else{
                pbCommon.setMultiple(1);
            }
            ///////////////////////////////////////////////////////////
        }
        pbData.setGameInfo(pbCommon);
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

        return pbData;
    },

    /**
     * 设置toggle激活状态
     * @param toggle
     * @param enable
     */
    setEnableToggle: function (toggle, enable) {
        // 按钮颜色
        if (this.isEnableToggle(toggle) !== enable) {
            toggle.interactable = enable;
            toggle.enableAutoGrayEffect = !toggle.enableAutoGrayEffect;
        }

        // 文字颜色
        var color = null;
        if (enable) {
            if (this.isCheckedToggle(toggle)) {
                color = DefColor.CHECK;
            } else {
                color = DefColor.UNCHECK;
            }
        } else {
            color = DefColor.DISABLED;
        }
        this.setToggleColor(toggle, color);
    },

    /**
     * toggle是否激活
     * @param toggle
     */
    isEnableToggle: function (toggle) {
        return toggle.interactable;
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


    setSpeCard() {
        this.initToggleColor(this.p_card);
        this.setCheckedToggle(this.p_card[0], this.m_objRuleIndex.card[0]);
        this.setCheckedToggle(this.p_card[1], this.m_objRuleIndex.card[1]);
        this.setCheckedToggle(this.p_card[2], this.m_objRuleIndex.card[2]);
        this.setCheckedToggle(this.p_card[3], this.m_objRuleIndex.card[3]);
        this.setCheckedToggle(this.p_card[4], this.m_objRuleIndex.card[4]);
        this.setCheckedToggle(this.p_card[5], this.m_objRuleIndex.card[5]);
    },

    /**
     * 设置底注
     */
    setJS: function () {
        this.initToggleColor(this.p_js);
        switch (this.m_objRuleIndex.js) {
            case 1:
                this.setCheckedToggle(this.p_js[0], true);
                break;
            case 2:
                this.setCheckedToggle(this.p_js[1], true);
                break;
            case 3:
                this.setCheckedToggle(this.p_js[2], true);
                break;
            case 4:
                this.setCheckedToggle(this.p_js[3], true);
                break;
        }
    },

    /**
     * 设置封顶
     */
    setFD: function () {
        this.initToggleColor(this.p_fd);
        switch (this.m_objRuleIndex.fd) {
            case 1:
                this.setCheckedToggle(this.p_fd[0], true);
                break;
            case 2:
                this.setCheckedToggle(this.p_fd[1], true);
                break;
            case 3:
                this.setCheckedToggle(this.p_fd[2], true);
                break;

        }
    },

    /**
     * 设置玩法
     */
    setWF: function () {
        this.initToggleColor(this.p_wf);
        this.initToggleColor(this.p_qz);

        switch (this.m_objRuleIndex.wf) {
            case 1:
                this.setCheckedToggle(this.p_wf[0], true);
                break;
            case 2:
                this.setCheckedToggle(this.p_wf[1], true);
                break;
        }
        switch (this.m_objRuleIndex.qz) {
            case 1:
                this.setCheckedToggle(this.p_qz[0], true);
                break;
            case 2:
                this.setCheckedToggle(this.p_qz[1], true);
                break;
        }
    },

    /**
    * 设置语音
    */
    setYY: function () {
        this.initToggleColor(this.p_yy);
        this.setCheckedToggle(this.p_yy, this.m_objRuleIndex.yy);
    },

    /**
     * 设置GPS
     */
    setGPS: function () {
        this.initToggleColor(this.p_gps);
        this.setCheckedToggle(this.p_gps, this.m_objRuleIndex.gps);
    },

    /**
     * 设置俱乐部
     */
    setClub: function () {
        this.initToggleColor(this.p_club);
        this.setCheckedToggle(this.p_club, club_Mgr.getClubOpenCreateUITag());
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
     * 初始化数据
     */
    initData: function () {
        // 规则数据
        this.m_objRuleIndex = {
            // 底注
            js: 1,
            // 封顶
            fd: 1,
            // 玩法
            wf: 1,
            //抢庄
            qz: 1,
            // 语音
            yy: false,
            // GPS
            gps: false,
            //俱乐部限定
            club: false,
            //
            bank: 1,
            //
            bet: 3,
            //
            card: [false, false, false, false, false, false],
        };
    },

    /**
     * 初始化视图
     */
    initView: function () {
        // this.setJS();
        // //this.setFD();
        // this.setWF();
        // this.setYY();
        // this.setGPS();
        this.setClub();
        // this.setSpeCard();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    setClubInfo() {
        let club = cc.find('layout_rule/toggle_group_jiaruxianzhi', this.node)
        if (club) {
            club.active = false;
        }
    },
});
