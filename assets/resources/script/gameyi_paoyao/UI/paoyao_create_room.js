var club_Mgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();
var hall_audio_mgr = require('hall_audio_mgr').Instance();

/**
 * 选中 和 未选中 颜色定义
 * @type {{CHECK: cc.Color, UNCHECK: cc.Color}}
 */
let DefColor = {
    CHECK: cc.color(240, 93, 29),
    UNCHECK: cc.color(99, 65, 31),
    DISABLED: cc.color(153, 153, 153)
};

cc.Class({
    extends: cc.Component,

    properties: {
        p_rs: { default: [], type: cc.Toggle, tooltip: '人数', },
        p_qs: { default: [], type: cc.Toggle, tooltip: '圈数', },
        p_wf: { default: [], type: cc.Toggle, tooltip: '玩法', },
        p_gz: { default: [], type: cc.Toggle, tooltip: '规则', },
        p_gz2: { default: [], type: cc.Toggle, tooltip: '规则', },
        p_club: { default: null, type: cc.Toggle, tooltip: '仅限俱乐部玩家', },
        p_yy: { default: null, type: cc.Toggle, tooltip: '语音', },
        p_gps: { default: null, type: cc.Toggle, tooltip: 'GPS', },
        p_jiabei: { default: null, type: cc.Toggle, tooltip: '加倍', },
        isClub: { default: false, tooltip: '亲友圈创建房间' },
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
            case "rs1":
                this.m_objRuleIndex.rs = 2;
                group = this.p_rs;
                break;
            case "rs2":
                this.m_objRuleIndex.rs = 4;
                group = this.p_rs;
                break;
            case "qs1":
                this.m_objRuleIndex.qs = 4;
                group = this.p_qs;
                break;
            case "qs2":
                this.m_objRuleIndex.qs = 8;
                group = this.p_qs;
                break;
            case "qs3":
                this.m_objRuleIndex.qs = 16;
                group = this.p_qs;
                break;
            case "wf1":
                this.m_objRuleIndex.wf = true;
                group = this.p_wf;
                break;
            case "wf2":
                this.m_objRuleIndex.wf = false;
                group = this.p_wf;
                break;
            case "gz1":
                this.m_objRuleIndex.gz_dui = false;
                group = this.p_gz;
                break;
            case "gz2":
                this.m_objRuleIndex.gz_wu3 = false;
                this.p_gz2[1].isChecked = false;
                this.initToggleColor(this.p_gz2);
                group = this.p_gz2;
                break;
            case "gz3":
                this.m_objRuleIndex.gz_3 = false; //3小
                this.p_gz2[0].isChecked = false;
                this.initToggleColor(this.p_gz2);
                group = this.p_gz2;
                break;
            case "gz_jiabei":
                this.m_objRuleIndex.gz_jiabei = target.isChecked;
                group = this.jiabei;
                break;
            case "fzb1":
                this.m_objRuleIndex.gps = target.isChecked;
                group = this.p_gps;
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

        if (group === this.jiabei || group === this.p_gps || group === this.p_yy || group == this.p_card || group == this.p_gz || group == this.p_gz2) {
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
        cc.dd.Utils.sendClientAction(cc.dd.clientAction.PAOYAO_FRIEND, cc.dd.clientAction.T_HALL.CREATE_ROOM);
        /************************游戏统计   end************************/

        hall_audio_mgr.com_btn_click();
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
        if(club_Mgr.getClubOpenCreateUITag()){
            var req = new cc.pb.club.msg_club_create_baofang_req();
            req.setClubId(club_Mgr.getSelectClubId());
            req.setRule(pbData);

            cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_club_create_baofang_req, req, 'msg_club_create_baofang_req', true);
            cc.dd.UIMgr.destroyUI('gameyj_friend/prefab/klb_friend_group_createRoom');
        }else{
            if(!cc.dd.Utils.checkGPS(pbData)){
                cc.dd.DialogBoxUtil.show(0, "创建房间失败，无法获取定位信息", '确定', null, function () {
                }, null);
                return;
            }
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_create_game_req, pbData, 'msg_create_game_req', true);

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
     * 设置人数
     */
    setRS: function () {
        this.initToggleColor(this.p_rs);
        switch (this.m_objRuleIndex.rs) {
            case 2:
                this.setCheckedToggle(this.p_rs[0], true);
                break;
            case 4:
                this.setCheckedToggle(this.p_rs[1], true);
                break;
        }
    },

    /**
     * 设置圈数
     */
    setQS: function () {
        this.initToggleColor(this.p_qs);
        switch (this.m_objRuleIndex.qs) {
            case 4:
                this.setCheckedToggle(this.p_qs[0], true);
                break;
            case 8:
                this.setCheckedToggle(this.p_qs[1], true);
                break;
            case 16:
                this.setCheckedToggle(this.p_qs[2], true);
                break;
        }
    },

    /**
     * 设置玩法
     */
    setWF: function () {
        this.initToggleColor(this.p_wf);
        if (this.m_objRuleIndex.wf)
            this.setCheckedToggle(this.p_wf[0], true);
        else
            this.setCheckedToggle(this.p_wf[1], true);
    },

    /**
     * 设置规则
     */
    setGZ: function () {
        this.initToggleColor(this.p_gz);
        this.setCheckedToggle(this.p_gz[0], !this.m_objRuleIndex.gz_dui);
        this.setCheckedToggle(this.p_gz2[0], !this.m_objRuleIndex.gz_wu3);
        this.setCheckedToggle(this.p_gz2[1], !this.m_objRuleIndex.gz_3);
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
     * 设置加倍
     */
    setJiabei : function(){
        this.initToggleColor(this.p_jiabei);
        this.setCheckedToggle(this.p_jiabei, this.m_objRuleIndex.gz_jiabei); 
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
     * 设置toggle颜色
     * @param toggle
     * @param color
     */
    setToggleColor: function (toggle, color) {
        var explaini = toggle.node.getChildByName("text_explain");
        if (explaini) {
            explaini.color = color;
        }
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
            // 圈数
            qs: 4,
            // 玩法 明幺：true，暗幺 false 
            wf: true,
            // 转幺 true
            gz_dui: true,
            //true：3大，false：3小
            gz_3: true,
            //无3
            gz_wu3: true,
            //加倍
            gz_jiabei: false,
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
        this.setRS();
        this.setQS();
        this.setWF();
        this.setGZ();
        this.setYY();
        this.setGPS();
        this.setClub();
        this.setJiabei();
    },

    getRules(data, isProxy) {
        data = (!cc.dd._.isNull(data) && !cc.dd._.isUndefined(data)) ? data : this.m_objRuleIndex;

        var pbData = new cc.pb.room_mgr.msg_create_game_req();
        var pbCommon = new cc.pb.room_mgr.common_game();
        var pyRule = new cc.pb.room_mgr.py_rule_info();
        var rule = new cc.pb.room_mgr.xl_game_rule();

        pbCommon.setGameType(60);
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

        pyRule.setCircleNum(data.qs); //局数
        pyRule.setBaseScore(10); //底分
        pyRule.setIsMing(data.wf); //是否明幺
        pyRule.setIsDui(data.gz_dui); //是否转幺
        pyRule.setIsSan(data.gz_3); //3大3小
        pyRule.setHasSan(data.gz_wu3); //有3无3
        pyRule.setLimitClub(data.club); //是否俱乐部成员
        pyRule.setLimitWords(false); //禁言
        pyRule.setLimitTalk(!data.yy); //语音
        pyRule.setGps(data.gps);
        pyRule.setDouble(data.gz_jiabei); //是否加倍

        pbData.setGameInfo(pbCommon);
        rule.setPyRule(pyRule);
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
        return pbData
    },

    setRoomRule(rule) {
        //////////////////////////必须添加的部分//////////////////////////
        let commonBeishu = cc.find('gameScrollView/view/content/klb_friend_group_common_beishu', this.node);
        if (commonBeishu) {
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

        let _rule = rule.rule.pyRule;

        this.m_objRuleIndex = {
            // 人数
            rs: 4,
            // 圈数
            qs: _rule.circleNum,
            // 玩法 明幺：true，暗幺 false 
            wf: _rule.isMing,
            // 转幺 true
            gz_dui: _rule.isDui,
            //true：3大，false：3小
            gz_3: _rule.isSan,
            //无3
            gz_wu3: _rule.hasSan,
            //加倍
            gz_jiabei: _rule.double,
            //俱乐部限定
            club: true,
        };

        this.initView();

        this.p_rs.forEach((toggle)=>{
            toggle.interactable = false;
        });
        this.p_qs.forEach((toggle)=>{
            toggle.interactable = false;
        });
        this.p_wf.forEach((toggle)=>{
            toggle.interactable = false;
        });
        this.p_gz.forEach((toggle)=>{
            toggle.interactable = false;
        });
        this.p_gz2.forEach((toggle)=>{
            toggle.interactable = false;
        });
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
    }
});
