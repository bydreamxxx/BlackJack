var Define = require("Define");

const MAX_SCORE = 0x7FFFFFFF;
var club_Mgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();
var cost_room_cards_config = require('cost_room_cards');

/**
 * 选中 和 未选中 颜色定义
 * @type {{CHECK: cc.Color, UNCHECK: cc.Color}}
 */
var DefColor = {
    CHECK: cc.color(240, 93, 29),
    UNCHECK: cc.color(99, 65, 31),
    DISABLED: cc.color(153, 153, 153)
};

cc.Class({
    extends: cc.Component,

    properties: {
        p_zs: { default: [], type: cc.Toggle, tooltip: '张数', },
        p_js: { default: [], type: cc.Toggle, tooltip: '局数', },
        p_cp: { default: [], type: cc.Toggle, tooltip: '出牌', },
        p_cp2: { default: [], type: cc.Toggle, tooltip: '出牌', },
        p_wf: { default: [], type: cc.Toggle, tooltip: '玩法', },
        p_zn: { default: [], type: cc.Toggle, tooltip: '扎鸟', },
        p_fd: { default: [], type: cc.Toggle, tooltip: '封顶', },
        p_gz: { default: [], type: cc.Toggle, tooltip: '规则', },
        p_gn: { default: [], type: cc.Toggle, tooltip: '功能', },
        p_zh: { default: [], type: cc.Toggle, tooltip: '最后', },
        p_tg: { default: [], type: cc.Toggle, tooltip: '托管', },
        p_yy: { default: null, type: cc.Toggle, tooltip: '语音', },
        p_gps: { default: null, type: cc.Toggle, tooltip: 'GPS', },
        isClub: { default: false, tooltip: '亲友圈创建房间' },
        txt_jushu_list: [cc.Label],//局数
        text_fangka_list: [cc.Label],//房卡
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

        var group = null;

        switch (data) {
            case "zs1":
                this.m_objRuleIndex.zs = 15;
                group = this.p_zs;
                this.p_wf[4].uncheck();
                break;
            case "zs2":
                this.m_objRuleIndex.zs = 16;
                group = this.p_zs;
                break;
            case "js1":
                this.m_objRuleIndex.js = 8;
                group = this.p_js;
                break;
            case "js2":
                this.m_objRuleIndex.js = 10;
                group = this.p_js;
                break;
            case "js3":
                this.m_objRuleIndex.js = 20;
                group = this.p_js;
                break;
            case "cp1":
                this.m_objRuleIndex.cp[0] = target.isChecked;
                group = this.p_cp;
                break;
            case "cp2":
                this.m_objRuleIndex.cp[1] = target.isChecked;
                group = this.p_cp2;
                break;
            case "cp3":
                this.m_objRuleIndex.cp[1] = !target.isChecked;
                group = this.p_cp2;
                this.p_gz[1].check();
                break;
            case "fd1":
                this.m_objRuleIndex.fd = 1;
                group = this.p_fd;
                break;
            case "fd2":
                this.m_objRuleIndex.fd = 2;
                group = this.p_fd;
                break;
            case "fd3":
                this.m_objRuleIndex.fd = 3;
                group = this.p_fd;
                break;
            case "fd4":
                this.m_objRuleIndex.fd = 4;
                group = this.p_fd;
                break;
            case "zn1":
                this.m_objRuleIndex.zn = 1;
                group = this.p_zn;
                break;
            case "zn2":
                this.m_objRuleIndex.zn = 2;
                group = this.p_zn;
                break;
            case "zn3":
                this.m_objRuleIndex.zn = 3;
                group = this.p_zn;
                break;
            case "zn4":
                this.m_objRuleIndex.zn = 4;
                group = this.p_zn;
                break;
            case "wf1":
                this.m_objRuleIndex.wf[0] = target.isChecked;
                group = this.p_wf;
                break;
            case "wf2":
                this.m_objRuleIndex.wf[1] = target.isChecked;
                group = this.p_wf;
                break;
            case "wf3":
                this.m_objRuleIndex.wf[2] = target.isChecked;
                group = this.p_wf;
                break;
            case "wf4":
                this.m_objRuleIndex.wf[3] = target.isChecked;
                group = this.p_wf;
                break;
            case "wf5":
                this.m_objRuleIndex.wf[4] = target.isChecked;
                group = this.p_wf;
                if (target.isChecked)
                    this.p_zs[1].check();
                break;
            case "wf6":
                this.m_objRuleIndex.wf[5] = target.isChecked;
                group = this.p_wf;
                break;
            case "gz1":
                this.m_objRuleIndex.gz = true;
                group = this.p_gz;
                this.p_cp2[0].check();
                break;
            case "gz2":
                this.m_objRuleIndex.gz = false;
                group = this.p_gz;
                break;
            case "gn1":
                this.m_objRuleIndex.gn = true;
                group = this.p_gn;
                break;
            case "gn2":
                this.m_objRuleIndex.gn = false;
                group = this.p_gn;
                break;
            case "zh1":
                this.m_objRuleIndex.zh[0] = target.isChecked;
                group = this.p_zh;
                break;
            case "zh2":
                this.m_objRuleIndex.zh[1] = target.isChecked;
                group = this.p_zh;
                break;
            case "zh3":
                this.m_objRuleIndex.zh[2] = target.isChecked;
                group = this.p_zh;
                break;
            case "zh4":
                this.m_objRuleIndex.zh[3] = target.isChecked;
                group = this.p_zh;
                break;
            case "tg1":
                this.m_objRuleIndex.tg = 1;
                group = this.p_tg;
                break;
            case "tg2":
                this.m_objRuleIndex.tg = 2;
                group = this.p_tg;
                break;
            case "tg3":
                this.m_objRuleIndex.tg = 3;
                group = this.p_tg;
                break;
            case "tg4":
                this.m_objRuleIndex.tg = 4;
                group = this.p_tg;
                break;
            case "tg5":
                this.m_objRuleIndex.tg = 5;
                group = this.p_tg;
                break;
            case "yy":
                this.m_objRuleIndex.yy = target.isChecked;
                group = this.p_yy;
                break;
            case "gps":
                this.m_objRuleIndex.gps = target.isChecked;
                group = this.p_gps;
                break;
        }

        if (group === this.p_cp || group === this.p_wf || group === this.p_zh || group === this.p_gps || group === this.p_yy) {
            this.setToggleColor(target, target.isChecked ? DefColor.CHECK : DefColor.UNCHECK);
        }
        else {
            this.initToggleColor(group);
            this.setToggleColor(target, DefColor.CHECK);
        }

    },

    /**
     * 创建房间回调
     */
    onCreate: function (event, custom) {
        /************************游戏统计 start************************/
        cc.dd.Utils.sendClientAction(cc.dd.clientAction.DDZ_FRIEND, cc.dd.clientAction.T_HALL.CREATE_ROOM);
        /************************游戏统计   end************************/

        if (!cc.dd.Utils.isNull(this.m_objRuleIndex)) {
            if (custom == 'daikai')
                this.sendCreateRoom(this.m_objRuleIndex, true);
            else
                this.sendCreateRoom(this.m_objRuleIndex);
        }
    },

    /**
     * 发送 创建房间
     * @param data
     */
    sendCreateRoom: function (data, isProxy) {
        let pbData = this.getRules(data, isProxy);
        if (club_Mgr.getClubOpenCreateUITag()) {
            var req = new cc.pb.club.msg_club_create_baofang_req();
            req.setClubId(club_Mgr.getSelectClubId());
            req.setRule(pbData);

            cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_club_create_baofang_req, req, 'msg_club_create_baofang_req', true);
            cc.dd.UIMgr.destroyUI('gameyj_friend/prefab/klb_friend_group_createRoom');
        } else {
            if(!cc.dd.Utils.checkGPS(pbData)){
                cc.dd.DialogBoxUtil.show(0, "创建房间失败，无法获取定位信息", '确定', null, function () {
                }, null);
                return;
            }
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_create_game_req, pbData, 'msg_create_game_req', true);

        }
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


    /**
     * 设置牌数
     */
    setZS() {
        this.initToggleColor(this.p_zs);
        switch (this.m_objRuleIndex.zs) {
            case 15:
                this.setCheckedToggle(this.p_zs[0], true);
                break;
            case 16:
                this.setCheckedToggle(this.p_zs[1], true);
                break;
        }
    },

    /**
     * 设置局数
     */
    setJS: function () {
        this.initToggleColor(this.p_js);
        switch (this.m_objRuleIndex.js) {
            case 8:
                this.setCheckedToggle(this.p_js[0], true);
                break;
            case 10:
                this.setCheckedToggle(this.p_js[1], true);
                break;
            case 20:
                this.setCheckedToggle(this.p_js[2], true);
                break;
        }
    },

    /**
     * 设置出牌
     */
    setCP() {
        this.initToggleColor(this.p_cp);
        this.initToggleColor(this.p_cp2);
        if (this.m_objRuleIndex.cp[0]) {
            this.setCheckedToggle(this.p_cp[0], true);
        }
        if (this.m_objRuleIndex.cp[1]) {
            this.setCheckedToggle(this.p_cp2[0], true);
        }
        else {
            this.setCheckedToggle(this.p_cp2[1], true);
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
            case 4:
                this.setCheckedToggle(this.p_fd[3], true);
                break;
        }
    },

    /**
     * 设置玩法
     */
    setWF: function () {
        this.initToggleColor(this.p_wf);
        this.setCheckedToggle(this.p_wf[0], this.m_objRuleIndex.wf[0]);
        this.setCheckedToggle(this.p_wf[1], this.m_objRuleIndex.wf[1]);
        this.setCheckedToggle(this.p_wf[2], this.m_objRuleIndex.wf[2]);
        this.setCheckedToggle(this.p_wf[3], this.m_objRuleIndex.wf[3]);
        this.setCheckedToggle(this.p_wf[4], this.m_objRuleIndex.wf[4]);
        this.setCheckedToggle(this.p_wf[5], this.m_objRuleIndex.wf[5]);
    },

    /**
     * 设置扎鸟
     */
    setZN() {
        this.initToggleColor(this.p_zn);
        switch (this.m_objRuleIndex.zn) {
            case 1:
                this.setCheckedToggle(this.p_zn[0], true);
                break;
            case 2:
                this.setCheckedToggle(this.p_zn[1], true);
                break;
            case 3:
                this.setCheckedToggle(this.p_zn[2], true);
                break;
            case 4:
                this.setCheckedToggle(this.p_zn[3], true);
                break;
        }
    },

    //规则 先出黑桃3
    setGZ() {
        this.initToggleColor(this.p_gz);
        switch (this.m_objRuleIndex.gz) {
            case true:
                this.setCheckedToggle(this.p_gz[0], true);
                break;
            case false:
                this.setCheckedToggle(this.p_gz[1], true);
                break;
        }
    },

    //功能 剩余牌数显示
    setGN() {
        this.initToggleColor(this.p_gn);
        switch (this.m_objRuleIndex.gn) {
            case true:
                this.setCheckedToggle(this.p_gn[0], true);
                break;
            case false:
                this.setCheckedToggle(this.p_gn[1], true);
                break;
        }
    },

    //最后
    setZH() {
        this.initToggleColor(this.p_zh);
        this.setCheckedToggle(this.p_zh[0], this.m_objRuleIndex.zh[0]);
        this.setCheckedToggle(this.p_zh[1], this.m_objRuleIndex.zh[1]);
        this.setCheckedToggle(this.p_zh[2], this.m_objRuleIndex.zh[2]);
        this.setCheckedToggle(this.p_zh[3], this.m_objRuleIndex.zh[3]);
    },

    //托管
    setTG() {
        this.initToggleColor(this.p_tg);
        switch (this.m_objRuleIndex.tg) {
            case 1:
                this.setCheckedToggle(this.p_tg[0], true);
                break;
            case 2:
                this.setCheckedToggle(this.p_tg[1], true);
                break;
            case 3:
                this.setCheckedToggle(this.p_tg[2], true);
                break;
            case 4:
                this.setCheckedToggle(this.p_tg[3], true);
                break;
            case 5:
                this.setCheckedToggle(this.p_tg[4], true);
                break;
        }
    },

    /**
    * 设置语音
    */
    setYY: function () {
        if (this.p_yy) {
            this.initToggleColor(this.p_yy);
            this.setCheckedToggle(this.p_yy, this.m_objRuleIndex.yy);
        }
    },

    /**
     * 设置GPS
     */
    setGPS: function () {
        if (this.p_gps) {
            this.initToggleColor(this.p_gps);
            this.setCheckedToggle(this.p_gps, this.m_objRuleIndex.gps);
        }
    },

    /**
     * 设置俱乐部
     */
    setClub: function () {
        if (this.p_club) {
            this.initToggleColor(this.p_club);
            this.setCheckedToggle(this.p_club, club_Mgr.getClubOpenCreateUITag());
            if (club_Mgr.getClubOpenCreateUITag()) {
                if (cc.find('commonRule/proxy', this.node))
                    cc.find('commonRule/proxy', this.node).active = false;
            }
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
            //手牌张数
            zs: 16,
            // 局数
            js: 8,
            //出牌 必须管 黑桃3先出
            cp: [true, true],
            // 玩法
            wf: [true, true, true, false, false, false],
            //扎鸟
            zn: 1,
            // 封顶
            fd: 1,
            //规则 先出黑桃3
            gz: true,
            //功能 显示牌数量
            gn: true,
            //最后 少带出牌
            zh: [true, false, true, false],
            //托管
            tg: 1,
            // 语音
            yy: false,
            // GPS
            gps: false,
            //俱乐部限定
            club: false,
        };
    },

    /**
     * 初始化视图
     */
    initView: function () {
        this.setRoundCost();//默认3人
        this.setZS();
        this.setJS();
        this.setCP();
        this.setFD();
        this.setWF();
        this.setZN();
        this.setGZ();
        this.setGN();
        this.setZH();
        this.setTG();
        this.setYY();
        this.setGPS();
        this.setClub();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },


    getRules(data, isProxy) {
        data = (!cc.dd._.isNull(data) && !cc.dd._.isUndefined(data)) ? data : this.m_objRuleIndex;

        var pbData = new cc.pb.room_mgr.msg_create_game_req();
        var pbCommon = new cc.pb.room_mgr.common_game();
        var pbRule = new cc.pb.paodekuai.paodekuai_rule_info();
        var rule = new cc.pb.room_mgr.xl_game_rule();

        pbCommon.setGameType(29);
        if (isProxy) {
            pbCommon.setClubCreateType(2);
        }
        //如果是俱乐部创建房间
        if (club_Mgr.getClubOpenCreateUITag()) {
            pbCommon.setClubId(club_Mgr.getSelectClubId());
            pbCommon.setClubCreateType(club_Mgr.getClubCreateRoomType());

            //////////////////////////必须添加的部分//////////////////////////
            let commonBeishu = cc.find('gameScrollView/view/content/klb_friend_group_common_beishu', this.node);
            if (commonBeishu) {
                let beishu = commonBeishu.getComponent('klb_friend_group_common_beishu').getBeiShu();
                pbCommon.setMultiple(beishu);
            } else {
                pbCommon.setMultiple(1);
            }
            ///////////////////////////////////////////////////////////
        }
        pbRule.setHandPokerNum(data.zs);//张数
        pbRule.setCircleNum(data.js);//局数
        pbRule.setIsMustBeenPlay(data.cp[0]);//必出
        pbRule.setFirstPlayRole(data.cp[1] ? 1 : 2);//先出牌玩家
        pbRule.setIsBaoDi(data.wf[0]);//保底
        pbRule.setIsChaiBomb(!data.wf[1]);//拆炸弹
        pbRule.setIsFourTake2(data.wf[2]);//四带二
        pbRule.setIsFourTake3(data.wf[3]);//四带三
        pbRule.setIsBombOfAaa(data.wf[4]);//3A炸弹
        pbRule.setRoomRoleNum(data.wf[5] ? 2 : 3);//二人开局
        pbRule.setZhaNiao(data.zn);//扎鸟
        pbRule.setMaxTimes(data.fd);//封顶
        pbRule.setFirstPlaySpade3(data.gz ? 1 : 2);//先出牌规则
        pbRule.setIsShowLeftCardsNum(data.gn);//显示剩余牌数
        pbRule.setIsFplayThreeTake(data.zh[0]);//三张少带出完
        pbRule.setIsSplayThreeTake(data.zh[1]);//三张少带接完
        pbRule.setIsFplayThreeLineTake(data.zh[2]);//飞机少带出完
        pbRule.setIsSplayThreeLineTake(data.zh[3]);//飞机少带接完
        pbRule.setPlayTimeout(data.tg);//托管超时
        pbRule.setLimitTalk(!data.yy);//语音
        pbRule.setGps(data.gps);//GPS
        //pbData.setUsercountlimit(data.rs);
        pbData.setGameInfo(pbCommon);
        rule.setPaodekuaiRule(pbRule);
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

    setRoomRule(rule) {
        //////////////////////////必须添加的部分//////////////////////////
        let commonBeishu = cc.find('gameScrollView/view/content/klb_friend_group_common_beishu', this.node);
        if (commonBeishu) {
            commonBeishu.getComponent('klb_friend_group_common_beishu').setBeiShu(rule.gameInfo.multiple);;
        }

        let commonNode = cc.find('commonRule', this.node)
        if (commonNode) {
            commonNode.active = false;
        }

        let scrollView = cc.find('gameScrollView', this.node)
        if (scrollView) {
            scrollView.y = 0;
            scrollView.height = this.node.height - 20;
            scrollView.getComponent(cc.Sprite).enabled = false;
            let widgets = scrollView.getComponentsInChildren(cc.Widget);
            for (let i = 0; i < widgets.length; i++) {
                widgets[i].updateAlignment();
            }
            scrollView.getComponent(cc.ScrollView).content.y = 0;
        }
        ///////////////////////////////////////////////////////////

        let _rule = rule.rule.paodekuaiRule;

        this.m_objRuleIndex = {
            // 张数
            zs: _rule.handPokerNum,
            // 出牌
            cp: [_rule.isMustBeenPlay, _rule.firstPlayRole == 1 ? true : false],
            // 玩法
            wf: [_rule.isBaoDi, !_rule.isChaiBomb, _rule.isFourTake2, _rule.isFourTake3, _rule.isBombOfAaa, _rule.roomRoleNum == 2 ? true : false],
            // 局数
            js: _rule.circleNum,
            // 扎鸟
            zn: _rule.zhaNiao,
            // 封顶
            fd: _rule.maxTimes,
            // 先出规则
            gz: _rule.firstPlaySpade3 == 1 ? true : false,
            // 余牌
            gn: _rule.isShowLeftCardsNum,
            // 少带
            zh: [_rule.isFplayThreeTake, _rule.isSplayThreeTake, _rule.isFplayThreeLineTake, _rule.isSplayThreeLineTake],
            // 托管
            tg: _rule.playTimeout,
            // 语音
            yy: !_rule.limitTalk,
            // GPS
            gps: _rule.gps,
            //俱乐部限定
            club: true,
        };

        this.initView();

        //////////////////////////必须添加的部分//////////////////////////
        //所有按键不可点击，不置灰
        this.p_zs.forEach((toggle) => {
            toggle.interactable = false;
        });
        this.p_cp.forEach((toggle) => {
            toggle.interactable = false;
        });
        this.p_cp2.forEach((toggle) => {
            toggle.interactable = false;
        });
        this.p_js.forEach((toggle) => {
            toggle.interactable = false;
        });
        this.p_fd.forEach((toggle) => {
            toggle.interactable = false;
        })
        this.p_wf.forEach((toggle) => {
            toggle.interactable = false;
        })
        this.p_zn.forEach((toggle) => {
            toggle.interactable = false;
        });
        this.p_gz.forEach((toggle) => {
            toggle.interactable = false;
        });
        this.p_gn.forEach((toggle) => {
            toggle.interactable = false;
        });
        this.p_zh.forEach((toggle) => {
            toggle.interactable = false;
        });
        this.p_tg.forEach((toggle) => {
            toggle.interactable = false;
        });
        ///////////////////////////////////////////////////////////
    },

    setClubInfo() {
        let club = cc.find('commonRule/toggle_group_jiaruxianzhi', this.node)
        if (club) {
            club.active = false;
        }

        let yuyin = cc.find('commonRule/toggle_group_yuying', this.node)
        if (yuyin) {
            yuyin.y = 25;
        }

        let gps = cc.find('commonRule/toggle_group_gps', this.node)
        if (gps) {
            gps.y = 25;
        }
    },

    setRoundCost(player_num) {
        player_num = player_num || 3;
        var conf = cost_room_cards_config.getItemList(function (item) {
            return item.id == cc.dd.Define.GameType.PDK_FRIEND && item.player_num == player_num;
        });

        for (var i = 0; i < this.txt_jushu_list.length && i < conf.length; i++) {
            this.txt_jushu_list[i].string = conf[i].circle_num + '局';//QuanShuDesc[i];
            this.text_fangka_list[i].string = '(房卡x' + conf[i].cost + ')';//FangKaDesc[i];
        }
    },
});
