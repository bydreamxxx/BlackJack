//create by wj 2018/10/12
var club_Mgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();
var dsz_send_msg = require('dsz_send_msg');

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

const cost_card = [
    { id: 5, count: [1, 2, 3] },
    { id: 7, count: [1, 2, 4] },
    { id: 9, count: [2, 3, 4] },
];



cc.Class({
    extends: cc.Component,

    properties: {
        p_rs: { default: [], type: cc.Toggle, tooltip: '人数', },
        p_js: { default: [], type: cc.Toggle, tooltip: '局数', },
        p_ls: { default: [], type: cc.Toggle, tooltip: '轮数', },
        p_wf: { default: [], type: cc.Toggle, tooltip: '玩法', },
        p_gz: { default: [], type: cc.Toggle, tooltip: '规则', },
        p_sx: { default: [], type: cc.Toggle, tooltip: '上限', },
        p_qp: { default: null, type: cc.Toggle, tooltip: '超时弃牌', },
        p_dp: { default: null, type: cc.Toggle, tooltip: '亮底牌', },
        p_yy: { default: null, type: cc.Toggle, tooltip: '语音', },
        p_gps: { default: null, type: cc.Toggle, tooltip: 'GPS', },
        p_club: { default: null, type: cc.Toggle, tooltip: '加入限定' },
        gz_Node: { default: [], type: cc.Node, tooltip: '规则分页' },
        m_tSlider: { default: [], type: cc.Slider, tooltiP: '滑动条' },
        m_tProgress: { default: [], type: cc.ProgressBar, tooltiP: '进度条' },
        m_tEditBox: { default: [], type: cc.Label, tooltiP: '编辑器' },
        m_nLookCurNum: 0.1,
        m_nCmpCurNum: 0.1
    },


    onLoad: function () {
        this.initData();
        this.initView();
    },

    /**
     * 选择规则
     */
    onSelectRule: function (target, data) {

        var group = null;

        switch (data) {
            case "js1":
                this.m_objRuleIndex.js = 10;
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
            case "rs1":
                this.m_objRuleIndex.rs = 5;
                this.updateCostCard(this.m_objRuleIndex.rs);
                group = this.p_rs;
                // this.switchRS(0);
                break;
            case "rs2":
                this.m_objRuleIndex.rs = 7;
                this.updateCostCard(this.m_objRuleIndex.rs);
                group = this.p_rs;
                // this.switchRS(1);
                break;
            case "rs3":
                this.m_objRuleIndex.rs = 9;
                this.updateCostCard(this.m_objRuleIndex.rs);
                group = this.p_rs;
                // this.switchRS(2);
                break;
            case "ls1":
                this.m_objRuleIndex.ls = 5;
                group = this.p_ls;
                break;
            case "ls2":
                this.m_objRuleIndex.ls = 10;
                group = this.p_ls;
                break;
            case "ls3":
                this.m_objRuleIndex.ls = 20;
                group = this.p_ls;
                break;
            case "wf1":
                this.m_objRuleIndex.wf = 1;
                group = this.p_wf;
                break;
            case "wf2":
                this.m_objRuleIndex.wf = 2;
                group = this.p_wf;
                break;
            case "gz1":
                this.m_objRuleIndex.gz = 1;
                this.showGzUI(this.m_objRuleIndex.gz);
                group = this.p_gz;
                break;
            case "gz2":
                this.m_objRuleIndex.gz = 2;
                this.showGzUI(this.m_objRuleIndex.gz);
                group = this.p_gz;
                break;
            case "sx1":
                this.m_objRuleIndex.sx = 200;
                group = this.p_sx;
                this.showGzUI();
                break;
            case "sx2":
                this.m_objRuleIndex.sx = 500;
                group = this.p_sx;
                this.showGzUI();
                break;
            case "sx3":
                this.m_objRuleIndex.sx = 1000;
                group = this.p_sx;
                this.showGzUI();
                break;
            case "qp":
                this.m_objRuleIndex.qp = target.isChecked;
                group = this.p_qp;
                break;
            case "dp":
                this.m_objRuleIndex.dp = target.isChecked;
                group = this.p_dp;
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
        this.initToggleColor(group);
        this.setToggleColor(target, target.isChecked ? DefColor.CHECK : DefColor.UNCHECK);
    },

    /**
     * 初始化数据
     */
    initData: function () {
        // 规则数据
        this.m_objRuleIndex = {
            // 局数
            js: 10,
            // 人数
            rs: 5,
            // 轮数
            ls: 5,
            // 玩法
            wf: 1,
            //规则
            gz: 1,
            //看牌限制
            watch: 1,
            //比牌限制
            cmp: 1,
            //上限
            sx: 500,
            //超时弃牌
            qp: false,
            //亮底牌
            dp: false,
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
        this.setJS();
        this.setRS();
        this.setLS();
        this.setWF();
        this.setGZ();
        this.setSX();
        this.setQP();
        this.setDP();
        this.setYY();
        this.setGPS();
        this.setClub();
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
     * 设置toggle选中状态
     * @param toggle
     * @param checked
     */
    setCheckedToggle: function (toggle, checked) {
        if (this.isCheckedToggle(toggle) != checked) {
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
     * toggle是否激活
     * @param toggle
     */
    isEnableToggle: function (toggle) {
        return toggle.interactable;
    },

    /**
     * 设置人数
     */
    setRS: function () {
        // this.initToggleColor(this.p_rs);
        switch (this.m_objRuleIndex.rs) {
            case 5:
                this.setCheckedToggle(this.p_rs[0], true);
                break;
            case 7:
                this.setCheckedToggle(this.p_rs[1], true);
                break;
            case 9:
                this.setCheckedToggle(this.p_rs[2], true);
                break;
        }
    },

    /**
     * 更新局数消耗card具体数值
     */
    updateCostCard: function (roleNum) {
        var data = null;
        for (var i = 0; i < cost_card.length; i++) {
            var item = cost_card[i];
            if (item.id == roleNum) {
                data = item;
                break;
            }
        }
        for (var i = 0; i < this.p_js.length; i++) {
            this.p_js[i].node.getChildByName('text_explain_count').getComponent(cc.Label).string = '(房卡X' + data.count[i] + ')';
        }
    },
    /**
     * 设置局数
     */
    setJS: function () {
        //this.initToggleColor(this.p_js);
        this.updateCostCard(this.m_objRuleIndex.rs);
        switch (this.m_objRuleIndex.js) {
            case 10:
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

    //设置轮数
    setLS: function () {
        //this.initToggleColor(this.p_ls);
        switch (this.m_objRuleIndex.ls) {
            case 5:
                this.setCheckedToggle(this.p_ls[0], true);
                break;
            case 10:
                this.setCheckedToggle(this.p_ls[1], true);
                break;
            case 20:
                this.setCheckedToggle(this.p_ls[2], true);
                break;
        }
    },

    //设置玩法
    setWF: function () {
        //this.initToggleColor(this.p_wf);
        switch (this.m_objRuleIndex.wf) {
            case 1:
                this.setCheckedToggle(this.p_wf[0], true);
                break;
            case 2:
                this.setCheckedToggle(this.p_wf[1], true);
                break;
        }
    },

    /**
     * 显示规则分页
     */
    showGzUI: function () {
        for (var i = 0; i < 2; i++)
            this.gz_Node[i].active = false;
        this.gz_Node[this.m_objRuleIndex.gz - 1].active = true;

        var progress = 0.1
        if (this.m_objRuleIndex.gz == 2) {
            progress = 0.05;
            var maxNum = this.m_objRuleIndex.sx / 50;
            var num = Math.ceil(progress * maxNum);
            if (num > maxNum)
                num = maxNum;


            this.m_tEditBox[2].string = '最低' + num * 50 + '分可以看牌';
            this.m_tEditBox[3].string = '最低' + num * 50 + '分可以比牌';
            this.m_objRuleIndex.watch = 50;
            this.m_objRuleIndex.cmp = 50;
        } else {
            var maxNum = this.m_objRuleIndex.ls;
            var num = Math.ceil(progress * maxNum);
            if (num > maxNum)
                num = maxNum;

            this.m_tEditBox[0].string = '第' + num + '轮可以看牌';
            this.m_tEditBox[1].string = '第' + num + '轮可以比牌';
            this.m_objRuleIndex.watch = 1;
            this.m_objRuleIndex.cmp = 1;
        }
        for (var k = 0; k < 4; k++) {
            this.m_tProgress[k].progress = progress;
            this.m_tSlider[k].progress = progress;
        }
        this.m_nLookCurNum = progress;
        this.m_nCmpCurNum = progress;
    },

    //设置规则
    setGZ: function () {
        //this.initToggleColor(this.p_gz);
        this.showGzUI(this.m_objRuleIndex.gz)
        switch (this.m_objRuleIndex.gz) {
            case 1:
                this.setCheckedToggle(this.p_gz[0], true);
                break;
            case 2:
                this.setCheckedToggle(this.p_gz[1], true);
                break;
        }
    },

    //设置上限
    setSX: function () {
        //this.initToggleColor(this.p_sx);
        switch (this.m_objRuleIndex.sx) {
            case 200:
                this.setCheckedToggle(this.p_sx[0], true);
                break;
            case 500:
                this.setCheckedToggle(this.p_sx[1], true);
                break;
            case 1000:
                this.setCheckedToggle(this.p_sx[2], true);
                break;
        }
    },

    //设置超时弃牌
    setQP: function () {
        //this.initToggleColor(this.p_qp);
        this.setCheckedToggle(this.p_qp, this.m_objRuleIndex.qp);
    },

    //设置亮底牌
    setDP: function () {
        // this.initToggleColor(this.p_dp);
        this.setCheckedToggle(this.p_dp, this.m_objRuleIndex.dp);
    },


    /**
    * 设置语音
    */
    setYY: function () {
        //this.initToggleColor(this.p_yy);
        this.setCheckedToggle(this.p_yy, this.m_objRuleIndex.yy);
    },

    /**
     * 设置GPS
     */
    setGPS: function () {
        //this.initToggleColor(this.p_gps);
        this.setCheckedToggle(this.p_gps, this.m_objRuleIndex.gps);
    },

    /**
     * 设置俱乐部
     */
    setClub: function () {
        //this.initToggleColor(this.p_club);
        this.setCheckedToggle(this.p_club, club_Mgr.getClubOpenCreateUITag());
        if (club_Mgr.getClubOpenCreateUITag()) {
            if (cc.find('commonRule/proxy', this.node))
                cc.find('commonRule/proxy', this.node).active = false;
        }
    },

    /**
     * 创建房间回调
     */
    onCreate: function (event, custom) {
        /************************游戏统计 start************************/
        cc.dd.Utils.sendClientAction(cc.dd.clientAction.DSZ_FRIEND, cc.dd.clientAction.T_HALL.CREATE_ROOM);
        /************************游戏统计   end************************/

        if (!cc.dd.Utils.isNull(this.m_objRuleIndex)) {
            if (custom == 'daikai')
                dsz_send_msg.sendCreateRoom(this.m_objRuleIndex, true);
            else
                dsz_send_msg.sendCreateRoom(this.m_objRuleIndex);
        }
    },

    //slider滑动
    onSliderMove: function (event, data) {
        var maxNum = 0;

        var slider = this.m_tSlider[parseInt(data)];
        var progressBar = this.m_tProgress[parseInt(data)];
        var editBox = this.m_tEditBox[parseInt(data)];

        if (data == '1' || data == '0') {
            maxNum = this.m_objRuleIndex.ls;
        } else {
            maxNum = this.m_objRuleIndex.sx / 50;
        }
        var progress = slider.progress;
        if (progress == 0) {
            if (data == '0' || data == '1')
                progress = 0.1;
            else
                progress = 0.05;
        }
        var value = progress;

        if (maxNum != 0) {
            var num = Math.ceil(value * maxNum);
            if (num > maxNum)
                num = maxNum;
            if (progress > 1.0)
                progress = 1.0;

        }
        switch (data) {
            case '0':
                editBox.string = '第' + num + '轮可以看牌';
                this.m_nLookCurNum = progress;
                this.m_objRuleIndex.watch = num;
                break;
            case '1':
                editBox.string = '第' + num + '轮可以比牌';
                this.m_nCmpCurNum = progress;
                this.m_objRuleIndex.cmp = num;
                break;
            case '2':
                editBox.string = '最低' + num * 50 + '分可以看牌';
                this.m_nLookCurNum = progress;
                this.m_objRuleIndex.watch = num * 50;
                break;
            case '3':
                editBox.string = '最低' + num * 50 + '分可以比牌';
                this.m_nCmpCurNum = progress;
                this.m_objRuleIndex.cmp = num * 50;
                break;
        }
        slider.progress = progress;
        progressBar.progress = progress;
    },

    //点击增加按钮
    onClickAddBtn: function (event, data) {
        var slider = this.m_tSlider[parseInt(data)];
        var progressBar = this.m_tProgress[parseInt(data)];
        var editBox = this.m_tEditBox[parseInt(data)];

        var maxNum = 0;
        var num = 0;
        if (data == '1' || data == '0') {
            maxNum = this.m_objRuleIndex.ls;
            if (data == '0')
                num = Math.ceil(this.m_nLookCurNum * maxNum);
            else
                num = Math.ceil(this.m_nCmpCurNum * maxNum);
            if (num + 1 > maxNum)
                return;
        } else {
            maxNum = this.m_objRuleIndex.sx / 50;
            if (data == '2')
                num = Math.ceil(this.m_nLookCurNum * maxNum);
            else
                num = Math.ceil(this.m_nCmpCurNum * maxNum);
            if (num + 1 > maxNum)
                return
        }
        num = num + 1;

        if (num > maxNum)
            num = maxNum;
        var progress = num / maxNum;
        if (progress > 1)
            progress = 1;
        slider.progress = progress;
        progressBar.progress = progress;
        switch (data) {
            case '0':
                editBox.string = '第' + num + '轮可以看牌';
                this.m_nLookCurNum = progress;
                this.m_objRuleIndex.watch = num;
                break;
            case '1':
                editBox.string = '第' + num + '轮可以比牌';
                this.m_nCmpCurNum = progress;
                this.m_objRuleIndex.cmp = num;
                break;
            case '2':
                editBox.string = '最低' + num * 50 + '分可以看牌';
                this.m_nLookCurNum = progress;
                this.m_objRuleIndex.watch = num * 50;
                break;
            case '3':
                editBox.string = '最低' + num * 50 + '分可以比牌';
                this.m_nCmpCurNum = progress;
                this.m_objRuleIndex.cmp = num * 50;
                break;
        }

    },

    //减少增加按钮
    onClickReduceBtn: function (event, data) {
        var slider = this.m_tSlider[parseInt(data)];
        var progressBar = this.m_tProgress[parseInt(data)];
        var editBox = this.m_tEditBox[parseInt(data)];

        var maxNum = 0;
        var num = 0;
        if (data == '1' || data == '0') {
            maxNum = this.m_objRuleIndex.ls;
            if (data == '0')
                num = Math.ceil(this.m_nLookCurNum * maxNum);
            else
                num = Math.ceil(this.m_nCmpCurNum * maxNum);
            if (num - 1 <= 0)
                return;
        } else {
            maxNum = this.m_objRuleIndex.sx / 50;
            if (data == '2')
                num = Math.ceil(this.m_nLookCurNum * maxNum);
            else
                num = Math.ceil(this.m_nCmpCurNum * maxNum);
            if (num - 1 <= 0)
                return
        }

        num = num - 1;

        var progress = num / maxNum;
        if (progress > 1)
            progress = 1;
        else if (progress == 0) {
            progress = 0.1;
            if (data == '2' || data == '3')
                progress = 0.05;
        }
        slider.progress = progress;
        progressBar.progress = progress;
        switch (data) {
            case '0':
                editBox.string = '第' + num + '轮可以看牌';
                this.m_nLookCurNum = progress;
                this.m_objRuleIndex.watch = num;
                break;
            case '1':
                editBox.string = '第' + num + '轮可以比牌';
                this.m_nCmpCurNum = progress;
                this.m_objRuleIndex.cmp = num;
                break;
            case '2':
                editBox.string = '最低' + num * 50 + '分可以看牌';
                this.m_nLookCurNum = progress;
                this.m_objRuleIndex.watch = num * 50;
                break;
            case '3':
                editBox.string = '最低' + num * 50 + '分可以比牌';
                this.m_nCmpCurNum = progress;
                this.m_objRuleIndex.cmp = num * 50;
                break;
        }
    },


});
