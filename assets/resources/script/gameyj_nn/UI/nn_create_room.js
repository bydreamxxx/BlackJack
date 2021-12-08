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
        p_js: { default: [], type: cc.Toggle, tooltip: '局数', },
        p_fd: { default: [], type: cc.Toggle, tooltip: '封顶', },
        p_wf: { default: [], type: cc.Toggle, tooltip: '扣牌', },
        p_qz: { default: [], type: cc.Toggle, tooltip: '庄家', },
        p_yy: { default: null, type: cc.Toggle, tooltip: '语音', },
        p_gps: { default: null, type: cc.Toggle, tooltip: 'GPS', },
        p_club: { default: null, type: cc.Toggle, tooltip: '加入限定' },
        p_bank: { default: [], type: cc.Toggle, tooltip: '最大抢庄', },
        p_bet: { default: [], type: cc.Toggle, tooltip: '最大下注', },
        p_card: { default: [], type: cc.Toggle, tooltip: '最大下注', },
        p_tg: { default: [], type: cc.Toggle, tooltip: '托管', },
        p_bs: { default: [], type: cc.Toggle, tooltip: '倍数', },
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
                this.m_objRuleIndex.js = 15;
                group = this.p_js;
                break;
            case "js2":
                this.m_objRuleIndex.js = 20;
                group = this.p_js;
                break;
            case "js3":
                this.m_objRuleIndex.js = 30;
                group = this.p_js;
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
            case "wf1":
                this.m_objRuleIndex.wf = 1;
                group = this.p_wf;
                break;
            case "wf2":
                this.m_objRuleIndex.wf = 2;
                group = this.p_wf;
                break;
            case "qz1":
                this.m_objRuleIndex.qz = 1;
                group = this.p_qz;
                this.setInvalible(this.p_bank, true);
                this.setInvalible(this.p_bet, true);
                this.setInvalible(this.p_wf, true);
                break;
            case "qz2":
                this.m_objRuleIndex.qz = 2;
                group = this.p_qz;
                this.p_wf[1].check();
                this.m_objRuleIndex.wf = 2;
                this.setInvalible(this.p_bank, false);
                this.setInvalible(this.p_bet, false);
                this.setInvalible(this.p_wf, false);
                break;
            case "qz3":
                this.m_objRuleIndex.qz = 3;
                group = this.p_qz;
                this.setInvalible(this.p_bank, true);
                this.setInvalible(this.p_bet, true);
                this.setInvalible(this.p_wf, true);
                break;
            case "qz4":
                this.m_objRuleIndex.qz = 4;
                group = this.p_qz;
                this.setInvalible(this.p_bank, true);
                this.setInvalible(this.p_bet, true);
                this.setInvalible(this.p_wf, true);
                break;
            case "yy":
                this.m_objRuleIndex.yy = target.isChecked;
                group = this.p_yy;
                break;
            case "gps":
                this.m_objRuleIndex.gps = target.isChecked;
                group = this.p_gps;
                break;
            case "px1":
                this.m_objRuleIndex.card[0] = target.isChecked;
                group = this.p_card;
                break;
            case "px2":
                this.m_objRuleIndex.card[1] = target.isChecked;
                group = this.p_card;
                break;
            case "px3":
                this.m_objRuleIndex.card[2] = target.isChecked;
                group = this.p_card;
                break;
            case "px4":
                this.m_objRuleIndex.card[3] = target.isChecked;
                group = this.p_card;
                break;
            case "px5":
                this.m_objRuleIndex.card[4] = target.isChecked;
                group = this.p_card;
                break;
            case "px6":
                this.m_objRuleIndex.card[5] = target.isChecked;
                group = this.p_card;
                break;
            case "px7":
                this.m_objRuleIndex.card[6] = target.isChecked;
                group = this.p_card;
                break;
            case "px8":
                this.m_objRuleIndex.card[7] = target.isChecked;
                group = this.p_card;
                break;
            case "px9":
                this.m_objRuleIndex.card[8] = target.isChecked;
                group = this.p_card;
                break;
            case "renman":
                this.m_objRuleIndex.rm = target.isChecked;
                group = this.p_card;
                break;
            case "bs0":
                this.m_objRuleIndex.bs = 0;
                group = this.p_bs;
                break;
            case "bs1":
                this.m_objRuleIndex.bs = 1;
                group = this.p_bs;
                break;
            case "bank1":
                this.m_objRuleIndex.bank = 1;
                group = this.p_bank;
                break;
            case "bank2":
                this.m_objRuleIndex.bank = 2;
                group = this.p_bank;
                break;
            case "bank3":
                this.m_objRuleIndex.bank = 3;
                group = this.p_bank;
                break;
            case "bet1":
                this.m_objRuleIndex.bet = 3;
                group = this.p_bet;
                break;
            case "bet2":
                this.m_objRuleIndex.bet = 6;
                group = this.p_bet;
                break;
            case "bet3":
                this.m_objRuleIndex.bet = 9;
                group = this.p_bet;
                break;
            case "tg0":
                this.m_objRuleIndex.tg = 0;
                group = this.p_tg;
                break;
            case "tg1":
                this.m_objRuleIndex.tg = 15;
                group = this.p_tg;
                break;
            case "tg2":
                this.m_objRuleIndex.tg = 30;
                group = this.p_tg;
                break;
            case "tg3":
                this.m_objRuleIndex.tg = 60;
                group = this.p_tg;
                break;
            case "tg4":
                this.m_objRuleIndex.tg = 90;
                group = this.p_tg;
                break;
        }

        if (group === this.p_gps || group === this.p_yy || group == this.p_card) {
            this.setToggleColor(target, target.isChecked ? DefColor.CHECK : DefColor.UNCHECK);
        }
        else {
            this.initToggleColor(group);
            this.setToggleColor(target, DefColor.CHECK);
        }

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
    onCreate: function (event, custom) {
        /************************游戏统计 start************************/
        cc.dd.Utils.sendClientAction(cc.dd.clientAction.NN_FRIEND, cc.dd.clientAction.T_HALL.CREATE_ROOM);
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
            if (!cc.dd.Utils.checkGPS(pbData)) {
                cc.dd.DialogBoxUtil.show(0, "创建房间失败，无法获取定位信息", 'text33', null, function () {
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

    setMaxBank() {
        this.initToggleColor(this.p_bank);
        switch (this.m_objRuleIndex.bank) {
            case 1:
                this.setCheckedToggle(this.p_bank[0], true);
                break;
            case 2:
                this.setCheckedToggle(this.p_bank[1], true);
                break;
            case 3:
                this.setCheckedToggle(this.p_bank[2], true);
                break;
        }
    },

    setMaxBet() {
        this.initToggleColor(this.p_bet);
        switch (this.m_objRuleIndex.bet) {
            case 3:
                this.setCheckedToggle(this.p_bet[0], true);
                break;
            case 6:
                this.setCheckedToggle(this.p_bet[1], true);
                break;
            case 9:
                this.setCheckedToggle(this.p_bet[2], true);
                break;
        }
    },

    setTuoguan() {
        this.initToggleColor(this.p_tg);
        switch (this.m_objRuleIndex.tg) {
            case 0:
                this.setCheckedToggle(this.p_tg[0], true);
                break;
            case 15:
                this.setCheckedToggle(this.p_tg[1], true);
                break;
            case 30:
                this.setCheckedToggle(this.p_tg[2], true);
                break;
            case 60:
                this.setCheckedToggle(this.p_tg[3], true);
                break;
            case 90:
                this.setCheckedToggle(this.p_tg[4], true);
                break;
        }
    },

    setSpeCard() {
        this.initToggleColor(this.p_card);
        this.setCheckedToggle(this.p_card[0], this.m_objRuleIndex.card[0]);
        this.setCheckedToggle(this.p_card[1], this.m_objRuleIndex.card[1]);
        this.setCheckedToggle(this.p_card[2], this.m_objRuleIndex.card[2]);
        this.setCheckedToggle(this.p_card[3], this.m_objRuleIndex.card[3]);
        this.setCheckedToggle(this.p_card[4], this.m_objRuleIndex.card[4]);
        this.setCheckedToggle(this.p_card[5], this.m_objRuleIndex.card[5]);
        this.setCheckedToggle(this.p_card[6], this.m_objRuleIndex.card[6]);
        this.setCheckedToggle(this.p_card[7], this.m_objRuleIndex.card[7]);
        this.setCheckedToggle(this.p_card[8], this.m_objRuleIndex.card[8]);
        this.setCheckedToggle(this.p_card[9], this.m_objRuleIndex.rm);
    },

    /**
     * 设置局数
     */
    setJS: function () {
        this.initToggleColor(this.p_js);
        switch (this.m_objRuleIndex.js) {
            case 15:
                this.setCheckedToggle(this.p_js[0], true);
                break;
            case 20:
                this.setCheckedToggle(this.p_js[1], true);
                break;
            case 30:
                this.setCheckedToggle(this.p_js[2], true);
                break;
        }
    },

    setBS() {
        this.initToggleColor(this.p_bs);
        switch (this.m_objRuleIndex.bs) {
            case 0:
                this.setCheckedToggle(this.p_bs[0], true);
                break;
            case 1:
                this.setCheckedToggle(this.p_bs[1], true);
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
            case 3:
                this.setCheckedToggle(this.p_qz[2], true);
                break;
            case 4:
                this.setCheckedToggle(this.p_qz[3], true);
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
            js: 15,
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
            tg: 0,
            //
            bs: 0,
            //
            rm: false,
            //
            card: [false, false, false, false, false, false, false, false, false],
        };
    },

    /**
     * 初始化视图
     */
    initView: function () {
        this.setRoundCost(9);//默认5人
        this.setJS();
        this.setFD();
        this.setWF();
        this.setYY();
        this.setGPS();
        this.setClub();
        this.setMaxBank();
        this.setMaxBet();
        this.setTuoguan();
        this.setBS();
        this.setSpeCard();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    getRules(data, isProxy) {
        data = (!cc.dd._.isNull(data) && !cc.dd._.isUndefined(data)) ? data : this.m_objRuleIndex;
        var pbData = new cc.pb.room_mgr.msg_create_game_req();
        var pbCommon = new cc.pb.room_mgr.common_game();
        var pbRule = new cc.pb.room_mgr.ps_rule_info();
        var rule = new cc.pb.room_mgr.xl_game_rule();

        pbCommon.setGameType(50);
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
        //pbRule.setScoreType(data.fd);//封顶
        pbRule.setGameType(data.qz);//抢庄
        pbRule.setShowType(data.wf);//扣牌
        pbRule.setMaxGrub(data.bank);//最大抢庄
        pbRule.setMaxBet(data.bet);//最大下注
        pbRule.setTuoguan(data.tg);//托管
        pbRule.setRenman(data.rm);//人满
        pbRule.setBeishu(data.bs);//倍数
        pbRule.setCardTypeThree(data.card[0] ? 1 : 0);//三条
        pbRule.setCardTypeStraight(data.card[1] ? 1 : 0);//顺子
        pbRule.setCardTypeFlush(data.card[2] ? 1 : 0);//同花
        pbRule.setCardTypeFullHouse(data.card[3] ? 1 : 0);//葫芦
        pbRule.setCardTypeFive(data.card[4] ? 1 : 0);//五小牛
        pbRule.setCardTypeFlushStraight(data.card[5] ? 1 : 0);//同花顺
        pbRule.setCardTypeSihua(data.card[6] ? 1 : 0);//四花
        pbRule.setCardTypeWuhua(data.card[7] ? 1 : 0);//五花
        pbRule.setCardTypeZhadan(data.card[8] ? 1 : 0);//炸弹
        pbRule.setLimitWords(false);//禁言
        pbRule.setLimitTalk(!data.yy);//语音
        pbRule.setGps(data.gps);//GPS
        //pbData.setUsercountlimit(data.rs);
        pbData.setGameInfo(pbCommon);
        rule.setPsRule(pbRule);
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
        // let commonBeishu = cc.find('gameScrollView/view/content/klb_friend_group_common_beishu', this.node);
        // if (commonBeishu) {
        //     commonBeishu.getComponent('klb_friend_group_common_beishu').setBeiShu(rule.gameInfo.multiple);;
        // }

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

        let _rule = rule.rule.psRule;

        this.m_objRuleIndex = {
            // 局数
            js: _rule.circleNum,
            // 封顶
            fd: 1,
            // 玩法
            wf: _rule.showType,
            //抢庄
            qz: _rule.gameType,
            // 语音
            yy: !_rule.limitTalk,
            // GPS
            gps: _rule.gps,
            //俱乐部限定
            club: true,
            //
            bank: _rule.maxGrub,
            //
            bet: _rule.maxBet,
            //
            tg: _rule.tuoguan,
            //
            rm: _rule.renman,
            //
            bs: _rule.beishu,
            //
            card: [_rule.cardTypeThree == 1, _rule.cardTypeFlush == 1, _rule.cardTypeFlush == 1, _rule.cardTypeFullHouse == 1, _rule.cardTypeFive == 1, _rule.cardTypeFlushStraight == 1,_rule.cardTypeSihua == 1,_rule.cardTypeWuhua == 1,_rule.cardTypeZhadan == 1],
        };

        this.initView();

        //////////////////////////必须添加的部分//////////////////////////
        //所有按键不可点击，不置灰
        this.p_js.forEach((toggle) => {
            toggle.interactable = false;
        });
        this.p_fd.forEach((toggle) => {
            toggle.interactable = false;
        });
        this.p_wf.forEach((toggle) => {
            toggle.interactable = false;
        });
        this.p_qz.forEach((toggle) => {
            toggle.interactable = false;
        });
        this.p_card.forEach((toggle) => {
            toggle.interactable = false;
        });
        this.p_tg.forEach((toggle) => {
            toggle.interactable = false;
        });
        this.p_bet.forEach((toggle) => {
            toggle.interactable = false;
        });
        this.p_bank.forEach((toggle) => {
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
        player_num = player_num || 5;
        var conf = cost_room_cards_config.getItemList(function (item) {
            return item.id == cc.dd.Define.GameType.NN_FRIEND;
        });
        for (var i = 0; i < this.txt_jushu_list.length && i < conf.length; i++) {
            this.txt_jushu_list[i].string = conf[i].circle_num + '局';//QuanShuDesc[i];
            this.text_fangka_list[i].string = '(房卡x' + conf[i].cost + ')';//FangKaDesc[i];
        }
    },
});
