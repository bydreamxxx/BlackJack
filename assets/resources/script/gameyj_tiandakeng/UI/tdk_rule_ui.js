var club_Mgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
var cost_room_cards_config = require('cost_room_cards');
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
        gameid: cc.Integer,
        closeCallback: null,
        daiwangtoggle: { default: null, type: cc.Toggle, tooltip: '带王' },
        wzptoggle: { default: null, type: cc.Toggle, tooltip: '王中炮' },
        xiaowangtoggle: { default: null, type: cc.Toggle, tooltip: '四小王' },
        hxtoggle: { default: null, type: cc.Toggle, tooltip: '回旋踢', },
        mojatoggle: { default: null, type: cc.Toggle, tooltip: '末脚跟服' },
        apaotoggle: { default: null, type: cc.Toggle, tooltip: '抓A必炮' },
        languotoggle: { default: null, type: cc.Toggle, tooltip: '烂锅翻倍' },
        liangditoggle: { default: null, type: cc.Toggle, tooltip: '亮底' },
        p_club: { default: null, type: cc.Toggle, tooltip: '加入限定' },
        p_limitWords: { default: null, type: cc.Toggle, tooltip: '禁言' },
        p_yuying: { default: null, type: cc.Toggle, tooltip: '语音' },
        p_gps: { default: null, type: cc.Toggle, tooltip: 'gps' },
        mojiaofanbeitoggle: { default: null, type: cc.Toggle, tooltip: '末脚翻倍' },
        qsanduitoggle: { default: null, type: cc.Toggle, tooltip: '亲三对' },
        lianxiantoggle: { default: null, type: cc.Toggle, tooltip: '连线' },
        autoStarttoggle: { default: null, type: cc.Toggle, tooltip: '自动开局' },
        busuoqiangtoggle: { default: null, type: cc.Toggle, tooltip: '不缩枪' },
        shunzitoggle: { default: null, type: cc.Toggle, tooltip: '顺子' },
        jushuArr: { default: [], type: cc.Toggle, tooltip: '局数', },
        wanfaArr: { default: [], type: cc.Toggle, tooltip: '玩法', },
        xifenArr: { default: [], type: cc.Toggle, tooltip: '喜分', },
        fengdingArr: { default: [], type: cc.Toggle, tooltip: '封顶', },
        tuoguanArr: { default: [], type: cc.Toggle, tooltip: '托管' },
        gongzhangArr: { default: [], type: cc.Toggle, tooltip: '公张随点/随豹' },
        tiArr: { default: [], type: cc.Toggle, tooltip: '把踢末踢' },
        isClub: { default: false, tooltip: '亲友圈创建房间' },
        zhogntutoggle: { default: null, type: cc.Toggle, tooltip: '中途加入' },
        pangguantoggle: { default: null, type: cc.Toggle, tooltip: '旁观' },
        txt_jushu_list: [cc.Label],//局数
        text_fangka_list: [cc.Label],//房卡
    },



    setRoundCost() {
        var conf = cost_room_cards_config.getItemList(function (item) {
            return item.id == this.gameid;
        }.bind(this));

        for (var i = 0; i < this.txt_jushu_list.length && i < conf.length; i++) {
            this.txt_jushu_list[i].string = conf[i].circle_num + '局';//QuanShuDesc[i];
            this.text_fangka_list[i].string = '(房卡x' + conf[i].cost + ')';//FangKaDesc[i];
        }
    },

    // use this for initialization
    onLoad: function () {
        //this.haveLabel.string = '(已有:' + HallPropData.getRoomCard() + ')';
        this.initData();
        if (this.gameid == 44) {
            this.gongzhang = false;
            this.playerCnt = 5;
            this.mofb = true;
        }

        this.setClub();
        this.setRoundCost();
    },

    initData: function () {
        this.gameCnt = 15;
        this.playerCnt = 1;
        this.daiwang = false;
        this.wangzhongpao = false;
        this.zhaA = false;
        this.gongzhang = true;
        this.languo = false;
        this.mojiao = false;
        this.liangdi = false;
        this.bati = true;
        this.sixiaowang = false;
        this.fengding = 5;
        this.tuoguan = 0;
        this.yy = false;
        this.gps = false;
        this.fzb = false;
        this.xifeng = 0;
        this.can_enter = false;
        this.can_view = false;
        this.huixuan = false;
        this.mofb = false;
        this.qsd = false;
        this.lianxian = false;
        this.busuoqiang = false;
        this.autoStart = false;
        this.shunzi = false;
    },

    initUI: function (rule) {
        cc.log('玩法显示---------');

        var rule = rule ? rule : RoomMgr.Instance()._Rule;
        if (!rule) return;
        switch (rule.roundCount) {
            case 15:
                this.jushuArr[0].check();
                break;
            case 30:
                this.jushuArr[1].check();
                break;
            case 60:
                this.jushuArr[2].check();
                break;
        }
        var indextype = rule.playType == 5 ? 0 : rule.playType - 1;
        this.wanfaArr[indextype].check();
        var xinfenIndex = 0;
        switch (rule.xifengNum) {
            case 0:
                xinfenIndex = 0;
                break;
            case 1:
                xinfenIndex = 1;
                break;
            case 2:
                xinfenIndex = 2;
                break;
            case 5:
                xinfenIndex = 3;
                break;
        }
        this.xifenArr[xinfenIndex].check(); //喜分
        var index = rule.maxScore / 5 - 1;
        this.fengdingArr[index].check();  // 封顶

        switch (rule.tuoguanTime) {
            case 0:
                this.tuoguanArr[0].check();
                break;
            case 30:
                this.tuoguanArr[1].check();
                break;
            case 90:
                this.tuoguanArr[2].check();
                break;
            case 160:
                this.tuoguanArr[3].check();
                break;
        }
        if (rule.hasJoker) //有王
            this.daiwangtoggle.check();
        if (rule.jokerPao) //王中跑
            this.wzptoggle.check();
        if (rule.aPao) //抓A必炮
            this.apaotoggle.check();
        if (rule.lanDouble) //烂锅翻倍
            this.languotoggle.check();
        if (rule.genfu) //末脚跟服
            this.mojatoggle.check();
        if (rule.isOpen) //亮底
            this.liangditoggle.check();
        var gongindex = rule.shareType ? 0 : 1; //公张随豹/随点
        this.gongzhangArr[gongindex].check();
        var tiindex = rule.bati ? 0 : 1; //把踢 末踢
        this.tiArr[tiindex].check();
        if (rule.limitClub) //限定俱乐部
            this.p_club.check();
        if (rule.limitWords && this.p_limitWords) //禁言
            this.p_limitWords.check();
        if (!rule.limitTalk) //语音
            this.p_yuying.check();
        if (rule.gps) // gps测距
            this.p_gps.check();
        if (rule.sixiaowang) //四小王
            this.xiaowangtoggle.check();
        if (rule.huixuanti) { //回旋踢
            this.hxtoggle.check();
            this.tiArr.forEach(function (toggle) {
                toggle.isChecked = false;
            }.bind(this))
        }

        if (rule.motifanbei && this.mojiaofanbeitoggle)
            this.mojiaofanbeitoggle.check();
        if (rule.qinsandui && this.qsanduitoggle)
            this.qsanduitoggle.check();
        if (rule.lianxian && this.lianxiantoggle)
            this.lianxiantoggle.check();
        if (rule.autoStart && this.autoStarttoggle)
            this.autoStarttoggle.check();
        if (rule.shunzi && this.shunzitoggle)
            this.shunzitoggle.check();
        if (rule.busuoqiang && this.busuoqiangtoggle)
            this.busuoqiangtoggle.check();
        if (this.zhogntutoggle)
            this.zhogntutoggle.node.active = false; //中途加入
        if (this.pangguantoggle)
            this.pangguantoggle.node.active = false; //旁观加入
    },


    onClick: function (target, data) {
        switch (data) {
            case '1':
                this.daiwang = target.isChecked;
                if (target.isChecked && this.xiaowangtoggle) {
                    this.xiaowangtoggle.isChecked = false;
                    this.sixiaowang = false;
                }
                if (target.isChecked == true && this.wanfaArr[5]) {
                    if (this.wanfaArr[5].isChecked == true) {
                        this.wanfaArr[0].check();
                    }
                }
                break;
            case '2':
                this.wangzhongpao = target.isChecked;
                if (this.daiwangtoggle && target.isChecked == true) {
                    if (this.wanfaArr[5] && this.wanfaArr[5].isChecked == true) {

                    }
                    else {
                        this.daiwangtoggle.isChecked = true;
                        this.daiwang = target.isChecked;
                    }
                    this.xiaowangtoggle.isChecked = false;
                    this.sixiaowang = false;
                }
                break;
            case '3':
                this.zhaA = target.isChecked;
                break;
            case '4':
                this.gongzhang = true;
                break;
            case '5':
                this.gongzhang = false;
                break;
            case '6':
                this.languo = target.isChecked;
                break;
            case '7':
                this.mojiao = target.isChecked;
                if (this.hxtoggle) {
                    this.hxtoggle.isChecked = false;
                    this.huixuan = false;
                }
                break;
            case '8':
                this.liangdi = target.isChecked;
                break;
            case '9':
                this.bati = true;
                break;
            case '10':
                this.bati = false;
                break;
            case '11':
                this.sixiaowang = target.isChecked;
                if (target.isChecked && this.wzptoggle) {
                    this.wzptoggle.isChecked = false;
                    this.wangzhongpao = false;
                }
                if (target.isChecked && this.daiwangtoggle) {
                    this.daiwangtoggle.isChecked = false;
                    this.daiwang = false;
                }
                if (target.isChecked == true && this.wanfaArr[5]) {
                    if (this.wanfaArr[5].isChecked == true) {
                        this.wanfaArr[0].check();
                    }
                }
                break;
            case '12':
                this.fengding = 5;
                break;
            case '13':
                this.fengding = 10;
                break;
            case '14':
                this.huixuan = target.isChecked;
                if (this.mojatoggle) {
                    this.mojatoggle.isChecked = false;
                    this.mojiao = false;
                }
                break;
            case '15': //末脚翻倍
                this.mofb = target.isChecked;
                break;
            case '16': //亲三对
                this.qsd = target.isChecked;
                break;
            case '17': //连线
                this.lianxian = target.isChecked;
                break;
            case '18':
                this.busuoqiang = target.isChecked;
                break;
            case '19':
                this.autoStart = target.isChecked;
                break;
            case '20':
                this.shunzi = target.isChecked;
                break;
            case "yy":
                this.yy = target.isChecked;
                break;
            case "gps":
                this.gps = target.isChecked;
                break;
            case "fzb":
                this.fzb = target.isChecked;
                break;
            case "enter":
                this.can_enter = target.isChecked;
                break;
            case "view":
                this.can_view = target.isChecked;
                break;
        }
    },

    ontuoguan: function (event, data) {
        var num = parseInt(data);
        this.tuoguan = num;
    },


    createRoomBtnClick: function (event, custom) {
        /************************游戏统计 start************************/
        cc.dd.Utils.sendClientAction(cc.dd.clientAction.TDK_FRIEND, cc.dd.clientAction.T_HALL.CREATE_ROOM);
        /************************游戏统计   end************************/


        let pbData = this.getRules(custom);
        if (club_Mgr.getClubOpenCreateUITag()) {
            var req = new cc.pb.club.msg_club_create_baofang_req();
            req.setClubId(club_Mgr.getSelectClubId());
            req.setRule(pbData);

            cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_club_create_baofang_req, req, 'msg_club_create_baofang_req', true);
            cc.dd.UIMgr.destroyUI('gameyj_friend/prefab/klb_friend_group_createRoom');
        } else {
            if (!cc.dd.Utils.checkGPS(pbData)) {
                cc.dd.DialogBoxUtil.show(0, "创建房间失败，无法获取定位信息", '确定', null, function () {
                }, null);
                return;
            }
            cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_create_game_req, pbData, 'msg_create_game_req', true);

        }
    },

    exitBtnClick: function () {
        if (this.closeCallback) {
            this.closeCallback();
        }
        this.close();
    },

    onclickXifeng: function (event, data) {
        var num = parseInt(data);
        this.xifeng = num;
    },

    gameCountToggleClick: function (event, data) {
        cc.log('tdk_rule_ui::gameCountToggleClick:data=', data);
        this.gameCnt = data;
    },

    timeCountToggleClick: function (event, data) {
        cc.log('tdk_rule_ui::timeCountToggleClick:data=', data);
        this.time = data.toString();
    },

    playerCountToggleClick: function (event, data) {
        cc.log('tdk_rule_ui::playerCountToggleClick:data=', data);
        this.playerCnt = data;
        if (data == '6') {
            this.xiaowangtoggle.uncheck();
            this.daiwangtoggle.uncheck();
        }
        else {
            if (this.wangzhongpao) {
                this.daiwangtoggle.isChecked = true;
                this.daiwang = true;
            }
        }
    },

    allinCountToggleClick: function (event, data) {
        cc.log('tdk_rule_ui::allinCountToggleClick:data=', data);
        this.allin = data.toString();
    },

    addCloseListener: function (cb) {
        if (typeof cb == 'function') {
            this.closeCallback = cb;
        } else {
            cc.warn('tdk_rule_ui::addCloseListener:cb not function!');
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

    close: function () {
        this.node.removeFromParent();
        this.node.destroy();
    },

    getRules(custom) {
        var pbData = new cc.pb.room_mgr.msg_create_game_req();
        var pbCommon = new cc.pb.room_mgr.common_game();
        var tdkRule = new cc.pb.room_mgr.tdk_rule_info();
        var rule = new cc.pb.room_mgr.xl_game_rule();
        var extInfo = new cc.pb.room_mgr.xl_game_rule_public();

        //pbCommon.setGameType(40);
        pbCommon.setGameType(this.gameid);
        if (custom == 'daikai') {
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

        extInfo.setIsCanEnter(this.can_enter);
        extInfo.setIsCanView(this.can_view);
        pbData.setRulePublic(extInfo);

        tdkRule.setRoundCount(parseInt(this.gameCnt));
        //tdkRule.setRoleCount(2);
        var playtype = parseInt(this.playerCnt);
        tdkRule.setRoleCount(playtype == 6 ? 9 : (playtype == 3 ? 4 : 5));
        tdkRule.setPlayType(playtype);
        tdkRule.setHasJoker(this.daiwang);
        tdkRule.setJokerPao(this.wangzhongpao);
        tdkRule.setAPao(this.zhaA);
        tdkRule.setLanDouble(this.languo);
        tdkRule.setGenfu(this.mojiao);
        tdkRule.setIsOpen(this.liangdi);
        tdkRule.setShareType(this.gongzhang)
        tdkRule.setBati(this.bati);
        tdkRule.setBaseScore(1);
        tdkRule.setAllinScore(0);
        tdkRule.setXifengNum(this.xifeng);
        tdkRule.setLimitClub(this.fzb); //是否俱乐部成员
        tdkRule.setLimitWords(false); //禁言
        tdkRule.setLimitTalk(!this.yy); //语音
        tdkRule.setGps(this.gps);
        tdkRule.setMaxScore(this.fengding);
        tdkRule.setSixiaowang(this.sixiaowang);
        tdkRule.setTuoguanTime(this.tuoguan);
        tdkRule.setHuixuanti(this.huixuan);
        tdkRule.setMotifanbei(this.mofb);
        tdkRule.setQinsandui(this.qsd);
        tdkRule.setLianxian(this.lianxian);
        tdkRule.setAutoStart(this.autoStart);
        tdkRule.setBusuoqiang(this.busuoqiang);
        tdkRule.setShunzi(this.shunzi);
        pbData.setGameInfo(pbCommon);
        rule.setTdkRule(tdkRule);
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

        let _rule = rule.rule.tdkRule;
        this.initUI(_rule)

        let toggles = this.node.getComponentsInChildren(cc.Toggle);
        toggles.forEach((toggle) => {
            toggle.interactable = false;
        })
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
    }
});
