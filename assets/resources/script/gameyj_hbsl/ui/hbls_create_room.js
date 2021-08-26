
var club_Mgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();
var hall_audio_mgr = require('hall_audio_mgr').Instance();


let DefColor = {
    CHECK: cc.color(240, 93, 29),
    UNCHECK: cc.color(99, 65, 31),
    DISABLED: cc.color(153, 153, 153)
};
cc.Class({
    extends: cc.Component,

    properties: {
        p_club: { default: null, type: cc.Toggle, tooltip: '加入限定' },
        m_tSlider: { default: null, type: cc.Slider, tooltiP: '滑动条' },
        m_tProgress: { default: null, type: cc.ProgressBar, tooltiP: '进度条' },
        m_tEditBox: { default: null, type: cc.Label, tooltiP: '编辑器' },
        p_lun: { default: null, type: cc.Node, tooltip: '轮' },
        p_jun: { default: null, type: cc.Node, tooltip: '局' },
        isClub: { default: false, tooltip: '亲友圈创建房间' },
        zhuang_arr: { default: [], type: cc.Toggle, tooltip: '庄类型', },
        lie_arr: { default: [], type: cc.Toggle, tooltip: '最低埋雷', },
        jushu_arr: { default: [], type: cc.Toggle, tooltip: '局数', },
        lun_arr: { default: [], type: cc.Toggle, tooltip: '轮数', },
        moshi_arr: { default: [], type: cc.Toggle, tooltip: '模式', },
        zhogntutoggle: { default: null, type: cc.Toggle, tooltip: '中途加入' },
        pangguantoggle: { default: null, type: cc.Toggle, tooltip: '旁观' },
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

    initUI: function (rule) {
        if (!rule) return;
        this.zhuang_arr[rule.zhuangType - 1].check();
        var lieindex = parseInt(rule.mailei / 100000);
        this.lie_arr[lieindex - 1].check();

        if (rule.zhuangType == 1) {
            var lunindex = rule.roleCount - 2;
            this.lun_arr[lunindex].check();
        } else {
            var juindex = parseInt(rule.roleCount / 10) - 2;
            this.jushu_arr[juindex].check();
        }
        var moindex = rule.model ? 1 : 0;
        this.moshi_arr[moindex].check();
        if (this.zhogntutoggle)
            this.zhogntutoggle.node.active = false; //中途加入
        if (this.pangguantoggle)
            this.pangguantoggle.node.active = false; //旁观加入

        var slider = this.m_tSlider;
        var progressBar = this.m_tProgress;
        var editBox = this.m_tEditBox;
        var progress = rule.maxBaonum;
        if (progress <= 2)
            progress = 2;
        slider.progress = progress * 0.1;
        progressBar.progress = progress * 0.1;
        editBox.string = progress + '个';
        this.maxBaonum = progress;
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

    getRules(isProxy) {
        var pbData = new cc.pb.room_mgr.msg_create_game_req();
        var pbCommon = new cc.pb.room_mgr.common_game();
        var hbRule = new cc.pb.room_mgr.hb_rule_info();
        var rule = new cc.pb.room_mgr.xl_game_rule();
        var extInfo = new cc.pb.room_mgr.xl_game_rule_public();

        pbCommon.setGameType(43);
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

        extInfo.setIsCanEnter(this.is_join);
        extInfo.setIsCanView(this.can_enter);
        pbData.setRulePublic(extInfo);

        hbRule.setZhuangType(this.zhuangtype); //庄
        hbRule.setMailei(this.maileiNum * 10000); //最低埋雷
        hbRule.setMaxRate(this.maxrate); //最大倍数
        hbRule.setRoleCount(this.roleCount); //多少局
        hbRule.setModel(this.model); //模式
        hbRule.setIsJoin(this.is_join); //是否允许中途加入
        hbRule.setMaxBaonum(this.maxBaonum); //最大包数
        hbRule.setLimitClub(this.club); //是否俱乐部成员
        hbRule.setLimitWords(false); //禁言
        hbRule.setLimitTalk(this.yy); //语音
        hbRule.setGps(this.gps);


        pbData.setGameInfo(pbCommon);
        rule.setHbRule(hbRule);
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

        let _rule = rule.rule.hbRule;
        this.initUI(_rule);
        let toggles = this.node.getComponentsInChildren(cc.Toggle);
        toggles.forEach((toggle) => {
            toggle.interactable = false;
        })

        let buttons = this.node.getComponentsInChildren(cc.Button);
        buttons.forEach((button) => {
            button.interactable = false;
        })
        this.m_tSlider.enabled = false;
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

    /**
     * 发送 创建房间
     * @param data
     */
    sendCreateRoom: function (isProxy) {
        let pbData = this.getRules(isProxy);
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
     * 初始化数据
     */
    initData: function () {
        // 庄类型
        this.zhuangtype = 4;
        // 最低埋雷
        this.maileiNum = 10;
        // 最大倍数
        this.maxrate = 2;
        //多少局
        this.roleCount = 20;
        //模式
        this.model = false; //选抢
        //中途是否允许加入
        this.is_join = true;
        //观战
        this.can_enter = false;
        //最大包数
        this.maxBaonum = 10;
        // 语音
        this.yy = false;
        // GPS
        this.gps = false;
        //俱乐部限定
        this.club = false;
    },

    onClickZhuan: function (event, data) {
        var num = parseInt(data);
        this.zhuangtype = num;
        this.p_lun.active = num == 1;
        this.p_jun.active = num != 1;
        if (num == 1)
            this.roleCount = 2;
        else
            this.roleCount = 20;
    },

    onClickMailei: function (event, data) {
        var num = parseInt(data);
        this.maileiNum = num;
    },

    onClickRate: function (event, data) {
        var num = parseInt(data);
        this.maxrate = num;
    },

    onClickCount: function (event, data) {
        var num = parseInt(data);
        this.roleCount = num;
    },

    onClickModel: function (target, data) {
        switch (data) {
            case '1':
                this.model = false;
                break;
            case '2':
                this.model = true;
                break;
            case '3':
                this.is_join = !target.isChecked;
                break;
            case 'view':
                this.can_enter = target.isChecked;
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


    //slider滑动
    onSliderMove: function (event, data) {
        var slider = this.m_tSlider;
        var progressBar = this.m_tProgress;
        var editBox = this.m_tEditBox;
        var progress = Math.ceil(slider.progress * 10);
        if (progress <= 2)
            progress = 2;
        slider.progress = progress * 0.1;
        progressBar.progress = progress * 0.1;
        editBox.string = progress + '个';
        this.maxBaonum = progress;
    },

    //点击增加按钮
    onClickAddBtn: function (event, data) {
        var slider = this.m_tSlider;
        var progressBar = this.m_tProgress;
        var editBox = this.m_tEditBox;
        //editBox.string =  num + '个';
        if (slider.progress >= 1)
            return;
        var progress = Math.ceil(slider.progress * 10 + 1);
        if (progress >= 10)
            progress = 10;
        slider.progress = progress * 0.1;
        progressBar.progress = progress * 0.1;
        editBox.string = progress + '个';
        this.maxBaonum = progress;
    },

    //减少增加按钮
    onClickReduceBtn: function (event, data) {
        var slider = this.m_tSlider;
        var progressBar = this.m_tProgress;
        var editBox = this.m_tEditBox;
        if (slider.progress <= 0.2)
            return;
        var progress = Math.floor(slider.progress * 10 - 1);
        if (progress <= 2)
            progress = 2;
        slider.progress = progress * 0.1;
        progressBar.progress = progress * 0.1;
        editBox.string = progress + '个';
        this.maxBaonum = progress;
    },
});
