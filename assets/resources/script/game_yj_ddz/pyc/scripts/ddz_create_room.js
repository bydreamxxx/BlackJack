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
        p_rs: { default: [], type: cc.Toggle, tooltip: '人数', },
        p_js: { default: [], type: cc.Toggle, tooltip: '局数', },
        p_fd: { default: [], type: cc.Toggle, tooltip: '封顶', },
        p_wf: { default: [], type: cc.Toggle, tooltip: '玩法', },
        p_jb: { default: [], type: cc.Toggle, tooltip: '加倍', },
        p_yy: { default: null, type: cc.Toggle, tooltip: '语音', },
        p_gps: { default: null, type: cc.Toggle, tooltip: 'GPS', },
        p_club: { default: null, type: cc.Toggle, tooltip: '加入限定' },
        rule_rs: { default: [], type: cc.Node, tooltip: '规则界面--几人' },
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
            case "js1":
                this.m_objRuleIndex.js = 9;
                group = this.p_js;
                break;
            case "js2":
                this.m_objRuleIndex.js = 18;
                group = this.p_js;
                break;
            case "js3":
                this.m_objRuleIndex.js = 27;
                group = this.p_js;
                break;
            case "rs1":
                this.m_objRuleIndex.rs = 2;
                group = this.p_rs;
                this.switchRS(0);
                break;
            case "rs2":
                this.m_objRuleIndex.rs = 3;
                group = this.p_rs;
                this.switchRS(1);
                break;
            case "rs3":
                this.m_objRuleIndex.rs = 4;
                group = this.p_rs;
                this.switchRS(2);
                break;
            case "fd1":
                this.m_objRuleIndex.fd = 24;
                group = this.p_fd;
                break;
            case "fd2":
                this.m_objRuleIndex.fd = 48;
                group = this.p_fd;
                break;
            case "fd3":
                this.m_objRuleIndex.fd = 96;
                group = this.p_fd;
                break;
            case "fd4":
                this.m_objRuleIndex.fd = 192;
                group = this.p_fd;
                break;
            case "fd5":
                this.m_objRuleIndex.fd = MAX_SCORE;
                group = this.p_fd;
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
                this.m_objRuleIndex.wf[4] = target.isChecked;
                group = this.p_wf;
                break;
            case "wf5":
                this.m_objRuleIndex.wf[5] = target.isChecked;
                group = this.p_wf;
                break;
            case "wf6":
                this.m_objRuleIndex.wf[6] = target.isChecked;
                group = this.p_wf;
                break;
            case "wf7":
                this.m_objRuleIndex.wf[7] = target.isChecked;
                group = this.p_wf;
                break;
            case "wf8":
                this.m_objRuleIndex.wf[8] = target.isChecked;
                group = this.p_wf;
                break;
            case "jb1":
                this.m_objRuleIndex.wf[3] = 1;
                group = this.p_jb;
                break;
            case "jb2":
                this.m_objRuleIndex.wf[3] = 2;
                group = this.p_jb;
                break;
            case "jb3":
                this.m_objRuleIndex.wf[3] = 3;
                group = this.p_jb;
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

        if (group === this.p_wf || group === this.p_gps || group === this.p_yy) {
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
            if (this.m_objRuleIndex.rs != 3) {
                return;//todo:暂时跳过二、四人
            }
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
     * 设置局数
     */
    setJS: function () {
        this.initToggleColor(this.p_js);
        switch (this.m_objRuleIndex.js) {
            case 9:
                this.setCheckedToggle(this.p_js[0], true);
                break;
            case 18:
                this.setCheckedToggle(this.p_js[1], true);
                break;
            case 27:
                this.setCheckedToggle(this.p_js[2], true);
                break;
        }
    },

    /**
     * 设置人数
     */
    setRS: function () {
        this.initToggleColor(this.p_rs);
        switch (this.m_objRuleIndex.rs) {
            case 2:
                this.setCheckedToggle(this.p_rs[0], true);
                this.switchRS(0);
                break;
            case 3:
                this.setCheckedToggle(this.p_rs[1], true);
                this.switchRS(1);
                break;
            case 4:
                this.setCheckedToggle(this.p_rs[2], true);
                this.switchRS(2);
                break;
        }
    },
    switchRS: function (index) {
        for (var i = 0; i < this.p_rs.length; i++) {
            if (i == index) {
                this.rule_rs[i].active = true;
            }
            else {
                this.rule_rs[i].active = false;
            }
        }
    },

    /**
     * 设置封顶
     */
    setFD: function () {
        this.initToggleColor(this.p_fd);
        switch (this.m_objRuleIndex.fd) {
            case 24:
                this.setCheckedToggle(this.p_fd[0], true);
                break;
            case 48:
                this.setCheckedToggle(this.p_fd[1], true);
                break;
            case 96:
                this.setCheckedToggle(this.p_fd[2], true);
                break;
            case 192:
                this.setCheckedToggle(this.p_fd[3], true);
                break;
            case MAX_SCORE:
                this.setCheckedToggle(this.p_fd[4], true);
                break;

        }
    },

    /**
     * 设置玩法
     */
    setWF: function () {
        this.initToggleColor(this.p_wf);
        this.initToggleColor(this.p_jb);

        this.setCheckedToggle(this.p_wf[0], this.m_objRuleIndex.wf[0]);
        this.setCheckedToggle(this.p_wf[1], this.m_objRuleIndex.wf[1]);
        this.setCheckedToggle(this.p_wf[2], this.m_objRuleIndex.wf[2]);
        this.setCheckedToggle(this.p_wf[3], this.m_objRuleIndex.wf[4]);
        this.setCheckedToggle(this.p_wf[4], this.m_objRuleIndex.wf[5]);
        this.setCheckedToggle(this.p_wf[5], this.m_objRuleIndex.wf[6]);
        this.setCheckedToggle(this.p_wf[6], this.m_objRuleIndex.wf[7]);
        this.setCheckedToggle(this.p_wf[7], this.m_objRuleIndex.wf[8]);

        switch (this.m_objRuleIndex.wf[3]) {
            case 1:
                this.setCheckedToggle(this.p_jb[0], true);
                break;
            case 2:
                this.setCheckedToggle(this.p_jb[1], true);
                break;
            case 3:
                this.setCheckedToggle(this.p_jb[2], true);
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
            // 局数
            js: 9,
            // 人数
            rs: 3,
            // 封顶
            fd: 24,
            // 玩法
            wf: [false, false, false, 1, false, false, false, false, false],
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
        this.setJS();
        this.setRS();
        this.setFD();
        this.setWF();
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
        var pbRule = new cc.pb.room_mgr.ddz_rule_info();
        var rule = new cc.pb.room_mgr.xl_game_rule();

        pbCommon.setGameType(33);
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
        pbRule.setCircleNum(data.js);//局数
        pbRule.setMaxScore(data.fd);//封顶
        pbRule.setBeenCallScore(data.wf[0]);//双王四二必叫
        pbRule.setExchangePoker(data.wf[1]);//换三张
        pbRule.setCanDaiExtra2(!data.wf[2]);//四带二
        pbRule.setDoubleScore(data.wf[3]);// 1.自由加倍 2.农民优先 3.不加倍
        pbRule.setStackGenPoker(data.wf[4]);//分摞发牌
        pbRule.setLimitWords(data.wf[5]);//禁言
        pbRule.setCardHolder(data.wf[6]);//记牌器
        pbRule.setBottomPokerDouble(data.wf[7]);//底牌加倍
        pbRule.setIsJuetou(data.wf[8]);//撅头
        pbRule.setLimitTalk(!data.yy);//语音
        pbRule.setGps(data.gps);//GPS
        //pbData.setUsercountlimit(data.rs);
        pbData.setGameInfo(pbCommon);
        rule.setDdzRule(pbRule);
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

        let _rule = rule.rule.ddzRule;

        this.m_objRuleIndex = {
            // 局数
            js: _rule.circleNum,
            // 人数
            rs: 3,
            // 封顶
            fd: _rule.maxScore,
            // 玩法
            wf: [_rule.beenCallScore, _rule.exchangePoker, !_rule.canDaiExtra2, _rule.doubleScore, _rule.stackGenPoker, _rule.limitWords, _rule.cardHolder, _rule.bottomPokerDouble, _rule.isJuetou],
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
        this.p_rs.forEach((toggle) => {
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
        this.p_jb.forEach((toggle) => {
            toggle.interactable = false;
        })
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
            return item.id == cc.dd.Define.GameType.DDZ_FRIEND && item.player_num == player_num;
        });

        for (var i = 0; i < this.txt_jushu_list.length && i < conf.length; i++) {
            this.txt_jushu_list[i].string = conf[i].circle_num + '局';//QuanShuDesc[i];
            this.text_fangka_list[i].string = '(房卡x' + conf[i].cost + ')';//FangKaDesc[i];
        }
    },
});
