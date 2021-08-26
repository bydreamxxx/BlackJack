/**
 * 选中 和 未选中 颜色定义
 * @type {{CHECK: cc.Color, UNCHECK: cc.Color}}
 */
var club_Mgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();
var cost_room_cards_config = require('cost_room_cards');
let Define = require('Define');

let DefColor = {
    CHECK: cc.color(240, 93, 29),
    UNCHECK: cc.color(99, 65, 31),
    DISABLED: cc.color(153, 153, 153)
};

// const QuanShuDesc = [
//     "2圈",
//     "4圈",
//     "8圈"
// ];
//
// const JuShuDesc = [
//     "12局",
//     "24局",
//     "48局"
// ];
//
// const FangKaDesc = [
//     "(房卡X4)",
//     "(房卡X8)",
//     "(房卡X16)",
// ];
cc.Class({
    extends: cc.Component,

    properties: {
        p_rs: { default: [], type: cc.Toggle, tooltip: '人数', },
        p_yp: { default: [], type: cc.Toggle, tooltip: '用牌', },
        p_qs: { default: [], type: cc.Toggle, tooltip: '圈数', },
        txt_jushu_list: [cc.Label],
        text_fangka_list: [cc.Label],
        text_yongpai_list: [cc.Label],
        p_df: { default: [], type: cc.Toggle, tooltip: '底分', },
        p_fd: { default: [], type: cc.Toggle, tooltip: '封顶', },
        p_zm: { default: [], type: cc.Toggle, tooltip: '自摸', },
        p_xy: { default: [], type: cc.Toggle, tooltip: '下雨', },
        p_dg: { default: [], type: cc.Toggle, tooltip: '点杠', },
        p_wf: { default: [], type: cc.Toggle, tooltip: '玩法', },
        p_fzb: { default: null, type: cc.Toggle, tooltip: '防作弊', },
        p_club: { default: null, type: cc.Toggle, tooltip: '加入限定' },
        p_yy: { default: null, type: cc.Toggle, tooltip: '语音' },
        xueliuchenghe: { default: false, tooltip: '血流成河模式' },
        isClub:{default: false, tooltip: '亲友圈创建房间'},
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
        if (this.touchTimeId) {
            clearTimeout(this.touchTimeId);
            this.touchTimeId = null;
        }
    },

    /**
     * 选择规则
     */
    onSelectRule: function (target, data) {

        var group = null;

        switch (data) {
            case "rs1":
                this.m_objRuleIndex.rs = 4;
                group = this.p_rs;

                var conf = cost_room_cards_config.getItemList(function (item) {
                    return item.id == cc.dd.Define.GameType.XZMJ_FRIEND && item.player_num == 4;
                }.bind(this));

                for (var i = 0; i < this.txt_jushu_list.length && i < conf.length; i++) {
                    this.txt_jushu_list[i].string = conf[i].circle_num + '局';//QuanShuDesc[i];
                    this.text_fangka_list[i].string = '(房卡X' + conf[i].cost + ')';//FangKaDesc[i];
                }

                if(this.p_wf.length > 7){
                    this.setCheckedToggle(this.p_wf[7], false);
                    this.setEnableToggle(this.p_wf[7], false);
                }

                if(this.p_yp.length > 0) {
                    this.setEnableToggle(this.p_yp[0], false);
                    this.setEnableToggle(this.p_yp[1], false);
                }
                break;
            case "rs2":
                this.m_objRuleIndex.rs = 3;
                group = this.p_rs;

                var conf = cost_room_cards_config.getItemList(function (item) {
                    return item.id == cc.dd.Define.GameType.XZMJ_FRIEND && item.player_num == 3;
                }.bind(this));

                for (var i = 0; i < this.txt_jushu_list.length && i < conf.length; i++) {
                    this.txt_jushu_list[i].string = conf[i].circle_num + '局';//QuanShuDesc[i];
                    this.text_fangka_list[i].string = '(房卡X' + conf[i].cost + ')';//FangKaDesc[i];
                }

                if(this.p_wf.length > 7) {
                    this.setEnableToggle(this.p_wf[7], true);
                }

                if(this.p_yp.length > 0) {
                    this.text_yongpai_list[0].string = "三人三房";
                    this.text_yongpai_list[1].string = "三人两房";
                    this.setEnableToggle(this.p_yp[0], true);
                    this.setEnableToggle(this.p_yp[1], true);
                }
                break;
            case "rs3":
                this.m_objRuleIndex.rs = 2;
                group = this.p_rs;

                var conf = cost_room_cards_config.getItemList(function (item) {
                    return item.id == cc.dd.Define.GameType.XZMJ_FRIEND && item.player_num == 2;
                }.bind(this));

                for (var i = 0; i < this.txt_jushu_list.length && i < conf.length; i++) {
                    this.txt_jushu_list[i].string = conf[i].circle_num + '局';//QuanShuDesc[i];
                    this.text_fangka_list[i].string = '(房卡X' + conf[i].cost + ')';//FangKaDesc[i];
                }

                if(this.p_wf.length > 7) {
                    this.setEnableToggle(this.p_wf[7], true);
                }

                if(this.p_yp.length > 0){
                    this.text_yongpai_list[0].string = "二人三房";
                    this.text_yongpai_list[1].string = "二人两房";
                    this.setEnableToggle(this.p_yp[0], true);
                    this.setEnableToggle(this.p_yp[1], true);
                }

                break;
            case "yp1":
                this.m_objRuleIndex.yp = 0;
                group = this.p_yp;
                break
            case "yp2":
                this.m_objRuleIndex.yp = 1;
                group = this.p_yp;
                break
            case "qs1":
                this.m_objRuleIndex.qs = 0;
                group = this.p_qs;
                break;
            case "qs2":
                this.m_objRuleIndex.qs = 1;
                group = this.p_qs;
                break;
            case "qs3":
                this.m_objRuleIndex.qs = 2;
                group = this.p_qs;
                break;
            case "df1":
                this.m_objRuleIndex.df = 0;
                group = this.p_df;
                break;
            case "df2":
                this.m_objRuleIndex.df = 1;
                group = this.p_df;
                break;
            case "df3":
                this.m_objRuleIndex.df = 2;
                group = this.p_df;
                break;
            case "df4":
                this.m_objRuleIndex.df = 3;
                group = this.p_df;
                break;
            case "fd1":
                this.m_objRuleIndex.fd = 0;
                group = this.p_fd;
                break;
            case "fd2":
                this.m_objRuleIndex.fd = 1;
                group = this.p_fd;
                break;
            case "fd3":
                this.m_objRuleIndex.fd = 2;
                group = this.p_fd;
                break;
            case "fd4":
                this.m_objRuleIndex.fd = 3;
                group = this.p_fd;
                break;
            case "wf1":
                this.m_objRuleIndex.zm = 0;
                group = this.p_zm;
                break;
            case "wf2":
                this.m_objRuleIndex.zm = 1;
                group = this.p_zm;
                break;
            case "wf3":
                this.m_objRuleIndex.xy = 0;
                group = this.p_xy;
                break;
            case "wf4":
                this.m_objRuleIndex.xy = 1;
                group = this.p_xy;
                break;
            case "wf13":
                this.m_objRuleIndex.dg = 0;
                group = this.p_dg;
                break;
            case "wf14":
                this.m_objRuleIndex.dg = 1;
                group = this.p_dg;
                break;
            case "wf5"://换三张
                this.m_objRuleIndex.wf[0] = target.isChecked;
                group = this.p_wf;
                if(!this.xueliuchenghe){
                    if(target.isChecked){
                        this.setCheckedToggle(this.p_wf[10], !target.isChecked);
                    }
                }
                break;
            case "wf6"://呼叫转移
                this.m_objRuleIndex.wf[1] = target.isChecked;
                group = this.p_wf;
                if(!this.xueliuchenghe) {
                    if(!target.isChecked){
                        this.setCheckedToggle(this.p_wf[11], false);
                    }
                    this.setEnableToggle(this.p_wf[11], target.isChecked);
                }
                break;
            case "wf7"://金钩钓
                this.m_objRuleIndex.wf[2] = target.isChecked;
                group = this.p_wf;
                break;
            case "wf8"://海底捞
                this.m_objRuleIndex.wf[3] = target.isChecked;
                group = this.p_wf;
                break;
            case "wf9"://海底炮
                this.m_objRuleIndex.wf[4] = target.isChecked;
                group = this.p_wf;
                break;
            case "wf10"://天地胡
                this.m_objRuleIndex.wf[5] = target.isChecked;
                group = this.p_wf;
                break;
            case "wf11"://门清中张
                this.m_objRuleIndex.wf[6] = target.isChecked;
                group = this.p_wf;
                break;
            case "wf12"://两番起胡
                this.m_objRuleIndex.wf[7] = target.isChecked;
                group = this.p_wf;
                break;
            case "wf15"://夹心五
                this.m_objRuleIndex.wf[8] = target.isChecked;
                group = this.p_wf;
                break;
            case "wf16"://一条龙
                this.m_objRuleIndex.wf[9] = target.isChecked;
                group = this.p_wf;
                break;
            case "wf17"://换四张
                this.m_objRuleIndex.wf[10] = target.isChecked;
                group = this.p_wf;
                if(!this.xueliuchenghe) {
                    if(target.isChecked){
                        this.setCheckedToggle(this.p_wf[0], !target.isChecked);
                    }
                }
                break;
            case "wf18"://呼叫转移转根
                this.m_objRuleIndex.wf[11] = target.isChecked;
                group = this.p_wf;
                break;
            case "wf19"://对对胡3番
                this.m_objRuleIndex.wf[12] = target.isChecked;
                group = this.p_wf;
                break;
            case "fzb1":
                this.m_objRuleIndex.fzb = target.isChecked;
                group = this.p_fzb;
                break;
            case "yy":
                this.m_objRuleIndex.yy = target.isChecked;
                group = this.p_yy;
                break;
            case "club":
                this.m_objRuleIndex.club = target.isChecked;
                group = this.p_club;
                break;
        }

        if (group === this.p_wf || group === this.p_fzb) {
            this.setToggleColor(target, target.isChecked ? DefColor.CHECK : DefColor.UNCHECK);
        } else {
            this.initToggleColor(group);
            this.setToggleColor(target, DefColor.CHECK);
        }
    },

    /**
     * 创建房间回调
     */
    onCreate: function (event, custom) {
        /************************游戏统计 start************************/
        // cc.dd.Utils.sendClientAction(this.xueliuchenghe ? cc.dd.clientAction.XLMJ_FRIEND : cc.dd.clientAction.XZMJ_FRIEND, cc.dd.clientAction.T_HALL.CREATE_ROOM);
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
        if (this._touchCreate) {
            return
        }
        this._touchCreate = true;

        this.touchTimeId = setTimeout(() => {
            this._touchCreate = false;
        }, 1000);

        let gameReq = this.getRules(data, isProxy);

        cc.sys.localStorage.setItem(cc.dd.user.id + '_'+this.getGame()+'_create', JSON.stringify(data));

        if(club_Mgr.getClubOpenCreateUITag()){
            var req = new cc.pb.club.msg_club_create_baofang_req();
            req.setClubId(club_Mgr.getSelectClubId());
            req.setRule(gameReq);

            cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_club_create_baofang_req, req, 'msg_club_create_baofang_req', true);
            cc.dd.UIMgr.destroyUI('gameyj_friend/prefab/klb_friend_group_createRoom');
        }else{
            if(!cc.dd.Utils.checkGPS(gameReq)){
                cc.dd.DialogBoxUtil.show(0, "创建房间失败，无法获取定位信息", '确定', null, function () {
                }, null);
                return;
            }
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_create_game_req, gameReq, 'msg_create_game_req', true);
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
                toggle.check();
            } else {
                toggle.uncheck();
            }
        }
        if (checked) {
            this.setToggleColor(toggle, DefColor.CHECK);
        } else {
            this.setToggleColor(toggle, DefColor.UNCHECK);
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
     * 设置人数
     */
    setRS: function () {
        this.initToggleColor(this.p_rs);
        switch (this.m_objRuleIndex.rs) {
            case 4:
                this.setCheckedToggle(this.p_rs[0], true);
                break;
            case 3:
                this.setCheckedToggle(this.p_rs[1], true);
                break;
            case 2:
                this.setCheckedToggle(this.p_rs[2], true);
                break;
        }
    },

    /**
     * 设置用牌
     */
    setYP: function () {
        this.initToggleColor(this.p_yp);
        switch (this.m_objRuleIndex.yp) {
            case 0:
                this.setCheckedToggle(this.p_yp[0], true);
                break;
            case 1:
                this.setCheckedToggle(this.p_yp[1], true);
                break;
        }

        this.setEnableToggle(this.p_yp[0], this.m_objRuleIndex.rs != 4);
        this.setEnableToggle(this.p_yp[1], this.m_objRuleIndex.rs != 4);

        if(this.m_objRuleIndex.rs != 2){
            this.text_yongpai_list[0].string = "三人三房";
            this.text_yongpai_list[1].string = "三人两房";
        }else{
            this.text_yongpai_list[0].string = "二人三房";
            this.text_yongpai_list[1].string = "二人两房";
        }
    },

    /**
     * 设置圈数
     */
    setQS: function () {
        this.initToggleColor(this.p_qs);
        switch (this.m_objRuleIndex.qs) {
            case 2:
                this.setCheckedToggle(this.p_qs[0], true);
                break;
            case 4:
                this.setCheckedToggle(this.p_qs[1], true);
                break;
            case 8:
                this.setCheckedToggle(this.p_qs[2], true);
                break;
        }
    },

    /**
     * 设置积分类型
     */
    setDF: function () {
        this.initToggleColor(this.p_df);
        switch (this.m_objRuleIndex.df) {
            case 0:
                this.setCheckedToggle(this.p_df[0], true);
                break;
            case 1:
                this.setCheckedToggle(this.p_df[1], true);
                break;
            case 2:
                this.setCheckedToggle(this.p_df[2], true);
                break;
            case 3:
                this.setCheckedToggle(this.p_df[3], true);
                break;
        }
    },

    /**
     * 设置封顶
     */
    setFD: function () {
        this.initToggleColor(this.p_fd);
        switch (this.m_objRuleIndex.fd) {
            case 0:
                this.setCheckedToggle(this.p_fd[0], true);
                break;
            case 1:
                this.setCheckedToggle(this.p_fd[1], true);
                break;
            case 2:
                this.setCheckedToggle(this.p_fd[2], true);
                break;
            case 3:
                this.setCheckedToggle(this.p_fd[3], true);
                break;
        }
    },

    /**
     * 设置自摸
     */
    setZM: function () {
        this.initToggleColor(this.p_zm);
        switch (this.m_objRuleIndex.zm) {
            case 0:
                this.setCheckedToggle(this.p_zm[0], true);
                break;
            case 1:
                this.setCheckedToggle(this.p_zm[1], true);
                break;
        }
    },

    /**
     * 设置下雨
     */
    setXY: function () {
        this.initToggleColor(this.p_xy);
        switch (this.m_objRuleIndex.xy) {
            case 0:
                this.setCheckedToggle(this.p_xy[0], true);
                break;
            case 1:
                this.setCheckedToggle(this.p_xy[1], true);
                break;
        }
    },


    /**
     * 设置点杠
     */
    setDG: function () {
        this.initToggleColor(this.p_dg);
        switch (this.m_objRuleIndex.dg) {
            case 0:
                this.setCheckedToggle(this.p_dg[0], true);
                break;
            case 1:
                this.setCheckedToggle(this.p_dg[1], true);
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
        this.setCheckedToggle(this.p_wf[6], this.m_objRuleIndex.wf[6]);

        if(!this.xueliuchenghe){
            this.setCheckedToggle(this.p_wf[7], this.m_objRuleIndex.wf[7]);
            this.setCheckedToggle(this.p_wf[8], this.m_objRuleIndex.wf[8]);
            this.setCheckedToggle(this.p_wf[9], this.m_objRuleIndex.wf[9]);
            this.setCheckedToggle(this.p_wf[10], this.m_objRuleIndex.wf[10]);
            this.setCheckedToggle(this.p_wf[11], this.m_objRuleIndex.wf[11]);
            this.setCheckedToggle(this.p_wf[12], this.m_objRuleIndex.wf[12]);

            // this.setEnableToggle(this.p_wf[0], !this.m_objRuleIndex.wf[10]);
            // this.setEnableToggle(this.p_wf[10], !this.m_objRuleIndex.wf[0]);
            this.setEnableToggle(this.p_wf[7], this.m_objRuleIndex.rs != 4);
            this.setEnableToggle(this.p_wf[11], this.m_objRuleIndex.wf[1]);
        }
    },

    /**
     * 设置防作弊
     */
    setFZB: function () {
        if(this.p_fzb){
            this.initToggleColor(this.p_fzb);
            this.setCheckedToggle(this.p_fzb, this.m_objRuleIndex.fzb);
        }
    },

    /**
     * 设置俱乐部
     */
    setClub: function () {
        if(this.p_club){
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
            // 人数
            rs: 4,
            // 用牌
            yp: 0,
            // 圈数
            qs: 2,
            //底分
            df: 0,
            //封顶
            fd: 1,
            //自摸
            zm: 0,
            //下雨
            xy: 0,
            //点杠
            dg: 0,
            // 玩法
            wf: [true, true, true, true, true, true, false, false, false, false, false, false, false],
            // 防作弊
            fzb: true,
            //俱乐部限定
            club: false,
            //语音
            yy: false,
        };

        let result = cc.sys.localStorage.getItem(cc.dd.user.id + '_'+this.getGame()+'_create');
        if(cc.dd._.isString(result) && result != ""){
            let data = JSON.parse(result);
            if(data){
                this.m_objRuleIndex = data;
                if(this.m_objRuleIndex.qs == 0){
                    this.m_objRuleIndex.qs = 2;
                }else if( this.m_objRuleIndex.qs == 1){
                    this.m_objRuleIndex.qs = 4;
                }else if( this.m_objRuleIndex.qs == 2){
                    this.m_objRuleIndex.qs = 8;
                }else{
                    this.m_objRuleIndex.qs = 10;
                }
            }
        }
    },

    /**
     * 初始化视图
     */
    initView: function () {
        var conf = cost_room_cards_config.getItemList(function (item) {
            if (this.xueliuchenghe) {
                return item.id == Define.GameType.XLMJ_FRIEND && item.player_num == 4;
            } else {
                return item.id == Define.GameType.XZMJ_FRIEND && item.player_num == 4;

            }
        }.bind(this));

        for (var i = 0; i < this.txt_jushu_list.length && i < conf.length; i++) {
            this.txt_jushu_list[i].string = conf[i].circle_num + '局';
            this.text_fangka_list[i].string = '(房卡X' + conf[i].cost + ')';
        }
        this.setRS();
        if(!this.xueliuchenghe){
            this.setYP();
        }
        this.setQS();
        this.setDF();
        this.setFD();
        this.setZM();
        this.setXY();
        if(!this.xueliuchenghe){
            this.setDG();
        }
        this.setWF();
        this.setFZB();
        this.setClub();

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    getRules(data, isProxy){
        data = (!cc.dd._.isNull(data) && !cc.dd._.isUndefined(data)) ? data : this.m_objRuleIndex;

        var qsOrJs = 0;

        let type = this.xueliuchenghe ? cc.dd.Define.GameType.XLMJ_FRIEND : cc.dd.Define.GameType.XZMJ_FRIEND;
        var conf = cost_room_cards_config.getItemList(function (item) {
            return item.id == type && item.player_num == 4;
        }.bind(this));

        qsOrJs = conf[this.m_objRuleIndex.qs].circle_num
        var df = [1, 2, 5, 10];
        var fd = [3, 4, 5, 0];
        var xy = [true, false];
        var yp = ['true', 'false'];
        var dg = ['true', 'false'];


        var gameReq = new cc.pb.room_mgr.msg_create_game_req();
        var pbData = new cc.pb.room_mgr.xzmj_req_createdesk();
        var commonGame = new cc.pb.room_mgr.common_game();
        var rule = new cc.pb.room_mgr.xl_game_rule();


        pbData.setUsercountlimit(data.rs);
        pbData.setBoardscout(qsOrJs);
        pbData.setDifen(df[data.df]);
        pbData.setFengding(fd[data.fd]);
        pbData.setZimotype(data.zm);
        pbData.setIsshishiyu(xy[data.xy]);

        pbData.setIshuan3zhang(data.wf[0]);
        pbData.setIshujiaozhuanyi(data.wf[1]);
        pbData.setIsjingoudiao(data.wf[2]);
        pbData.setIshaidilao(data.wf[3]);
        pbData.setIshaidipao(data.wf[4]);
        pbData.setIstiandihu(data.wf[5]);
        pbData.setIsmenqingzz(data.wf[6]);
        if(!this.xueliuchenghe){
            pbData.setIs2fanqibu(data.wf[7]);
            pbData.setReservedList([yp[data.yp], dg[data.dg], String(data.wf[11]), String(data.wf[12]), String(data.wf[10]), String(data.wf[8]), String(data.wf[9])]);//[true三房false两房, true点杠花自摸false点杠花点炮, 呼叫转移转根, 对对胡三番, 换四张, 夹心五, 一条龙]
        }

        pbData.setIsxueliu(this.xueliuchenghe);

        pbData.setPaytype(1);//房费默认房主
        pbData.setIsuncheat(false);

        pbData.setGps(data.fzb);
        pbData.setIsyuyin(data.yy);

        commonGame.setGameType(this.xueliuchenghe ? Define.GameType.XLMJ_FRIEND : Define.GameType.XZMJ_FRIEND);
        if (isProxy) {
            commonGame.setClubCreateType(2);
        }
        //如果是俱乐部创建房间
        if (club_Mgr.getClubOpenCreateUITag()) {
            commonGame.setClubId(club_Mgr.getSelectClubId());
            commonGame.setClubCreateType(club_Mgr.getClubCreateRoomType());

            //////////////////////////必须添加的部分//////////////////////////
            let commonBeishu = cc.find('gameScrollView/view/content/klb_friend_group_common_beishu', this.node);
            if(commonBeishu){
                let beishu = commonBeishu.getComponent('klb_friend_group_common_beishu').getBeiShu();
                commonGame.setMultiple(beishu);
            }else{
                commonGame.setMultiple(1);
            }
            ///////////////////////////////////////////////////////////
        }
        gameReq.setGameInfo(commonGame);
        rule.setMjXuezhanRule(pbData);
        gameReq.setRule(rule);

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
                    gameReq.setLatlngInfo(loc);
                }
            } else if (cc.sys.OS_IOS == cc.sys.os) {
                var loc = new cc.pb.room_mgr.latlng();
                var Latitude = jsb.reflection.callStaticMethod('SystemTool', 'getLatitude');
                var Longitude = jsb.reflection.callStaticMethod('SystemTool', 'getLongitude');
                loc.setLatitude(Latitude);
                loc.setLongitude(Longitude);
                cc.log("详细地址：经度 " + Longitude);
                cc.log("详细地址：纬度 " + Latitude);
                if (parseInt(Latitude) != 0 || parseInt(Longitude) != 0) {
                    gameReq.setLatlngInfo(loc);
                }
            }
        }

        return gameReq;
    },

    setRoomRule(rule){
        //////////////////////////必须添加的部分//////////////////////////
        let commonBeishu = cc.find('gameScrollView/view/content/klb_friend_group_common_beishu', this.node);
        if(commonBeishu){
            commonBeishu.getComponent('klb_friend_group_common_beishu').setBeiShu(rule.gameInfo.multiple);;
        }

        let commonNode = cc.find('commonRule', this.node)
        if(commonNode){
            commonNode.active = false;
        }

        let scrollView = cc.find('gameScrollView', this.node)
        if(scrollView){
            scrollView.y = 0;
            scrollView.height = this.node.height - 20;
            scrollView.getComponent(cc.Sprite).enabled = false;
            let widgets = scrollView.getComponentsInChildren(cc.Widget);
            for(let i = 0; i < widgets.length; i++){
                widgets[i].updateAlignment();
            }
            scrollView.getComponent(cc.ScrollView).content.y = 0;
        }
        ///////////////////////////////////////////////////////////

        let _rule = rule.rule.mjXuezhanRule;
        _rule.issanfang = _rule.reservedList[0] === 'true';
        _rule.isdiangangzimo = _rule.reservedList[1] === 'true';
        _rule.hujiaozhuanyizhuangen = _rule.reservedList[2] === 'true';
        _rule.duiduihu3fan = _rule.reservedList[3] === 'true';
        _rule.huan4zhang = _rule.reservedList[4] === 'true';
        _rule.jiaxinwu = _rule.reservedList[5] === 'true';
        _rule.yitiaolong = _rule.reservedList[6] === 'true';


        let qsOrJs = 0;
        let type = this.xueliuchenghe ? cc.dd.Define.GameType.XLMJ_FRIEND : cc.dd.Define.GameType.XZMJ_FRIEND;
        var conf = cost_room_cards_config.getItemList(function (item) {
            return item.id == type && item.player_num == 4;
        }.bind(this));

        for (var i = 0; i < this.txt_jushu_list.length && i < conf.length; i++) {
            if(conf[i].circle_num == _rule.boardscout){
                if(i == 0){
                    qsOrJs = 2;
                }else if( i == 1){
                    qsOrJs = 4;
                }else{
                    qsOrJs = 8;
                }
                break;
            }
        }

        let df = 0;
        switch(_rule.difen){
            case 1:
                df = 0;
                break;
            case 2:
                df = 1;
                break;
            case 5:
                df = 2;
            case 10:
                df = 3;
                break;
        }

        let fd = 0;
        switch(_rule.fengding){
            case 3:
                fd = 0;
                break;
            case 4:
                fd = 1;
                break;
            case 5:
                fd = 2;
            case 0:
                fd = 3;
                break;
        }

        let xy = _rule.isshishiyu ? 0 : 1;
        let yp = _rule.issanfang ? 0 : 1;
        let gd = _rule.isdiangangzimo ? 0 : 1;

        this.m_objRuleIndex = {
            rs: _rule.usercountlimit,
            yp: yp,
            // 圈数
            qs: qsOrJs,
            //底分
            df: df,
            //封顶
            fd: fd,
            //自摸
            zm: _rule.zimotype,
            //下雨
            xy: xy,
            gd: gd,
            // 玩法
            wf: [_rule.ishuan3zhang, _rule.ishujiaozhuanyi, _rule.isjingoudiao, _rule.ishaidilao, _rule.ishaidipao, _rule.istiandihu, _rule.ismenqingzz, _rule.is2fanqibu, _rule.jiaxinwu, _rule.yitiaolong, _rule.huan4zhang, _rule.hujiaozhuanyizhuangen, _rule.duiduihu3fan],
            // 防作弊
            fzb: _rule.gps,
            //俱乐部限定
            club: _rule.gps,
        };

        this.initView();

        //////////////////////////必须添加的部分//////////////////////////
        this.p_rs.forEach((toggle)=>{
            toggle.interactable = false;
        })
        this.p_qs.forEach((toggle)=>{
            toggle.interactable = false;
        })
        this.p_df.forEach((toggle)=>{
            toggle.interactable = false;
        })
        this.p_fd.forEach((toggle)=>{
            toggle.interactable = false;
        })
        this.p_zm.forEach((toggle)=>{
            toggle.interactable = false;
        })
        this.p_xy.forEach((toggle)=>{
            toggle.interactable = false;
        })
        this.p_wf.forEach((toggle)=>{
            toggle.interactable = false;
        })
        ///////////////////////////////////////////////////////////
    },

    setClubInfo(){
        let club = cc.find('commonRule/toggle_group_jiaruxianzhi', this.node)
        if(club){
            club.active = false;
        }

        let yuyin = cc.find('commonRule/toggle_group_yuying', this.node)
        if(yuyin){
            yuyin.y = 25;
        }

        let gps = cc.find('commonRule/toggle_group_gps', this.node)
        if(gps){
            gps.y = 25;
        }
    },

    getGame(){
        if(this.xueliuchenghe){
            return 'xlch';
        }else{
            return 'xzmj';
        }
    }
});
