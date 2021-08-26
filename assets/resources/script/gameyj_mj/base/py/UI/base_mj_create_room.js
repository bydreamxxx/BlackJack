/**
 * 选中 和 未选中 颜色定义
 * @type {{CHECK: cc.Color, UNCHECK: cc.Color}}
 */
var club_Mgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();
var cost_room_cards_config = require('cost_room_cards');
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
let createRoom = cc.Class({
    extends: cc.Component,

    properties: {
        p_fzb: { default: null, type: cc.Toggle, tooltip: '防作弊', },
        p_club: { default: null, type: cc.Toggle, tooltip: '加入限定' },
        p_yy: { default: null, type: cc.Toggle, tooltip: '语音' },
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
        this.initDefColor();
        this.initData();
        this.loadSaveData();
        this.initView();
        if(this.p_club) {
            this.p_club.interactable = false;//club_Mgr.getClubOpenCreateUITag();
        }
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

        var group = this.getGroup(target, data);

        if (group === this.p_wf || group === this.p_fzb) {
            this.setToggleColor(target, target.isChecked ? this.DefColor.CHECK : this.DefColor.UNCHECK);
        } else {
            this.initToggleColor(group);
            this.setToggleColor(target, this.DefColor.CHECK);
        }
    },

    /**
     * 创建房间回调
     */
    onCreate: function (event, custom) {
        /************************游戏统计 start************************/
        // cc.dd.Utils.sendClientAction(cc.dd.clientAction.JLMJ_FRIEND, cc.dd.clientAction.T_HALL.CREATE_ROOM);
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
                color = this.DefColor.CHECK;
            } else {
                color = this.DefColor.UNCHECK;
            }
        } else {
            color = this.DefColor.DISABLED;
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
            this.setToggleColor(toggle, this.DefColor.CHECK);
        } else {
            this.setToggleColor(toggle, this.DefColor.UNCHECK);
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
                        this.setToggleColor(toggle, this.DefColor.UNCHECK);
                    }
                }
            } else {
                this.setToggleColor(target, this.DefColor.UNCHECK);
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
     * 初始化视图
     */
    initView: function () {
        this.setCustomView();
        this.setFZB();
        this.setClub();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    getRules(data, isProxy){
        data = (!cc.dd._.isNull(data) && !cc.dd._.isUndefined(data)) ? data : this.m_objRuleIndex;

        let gameType = this.getGameType();

        var qsOrJs = 0;

        var conf = cost_room_cards_config.getItemList(function (item) {
            return item.id == gameType && item.player_num == data.rs;
        }.bind(this));

        qsOrJs = conf[this.m_objRuleIndex.qs].circle_num

        var gameReq = new cc.pb.room_mgr.msg_create_game_req();
        var commonGame = new cc.pb.room_mgr.common_game();

        commonGame.setGameType(gameType);
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
        let rule = this.getXLGameRule(data, qsOrJs);
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

        this.setXLGameRule(rule);
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

    initDefColor: function(){
        this.DefColor = {
            CHECK: cc.color(240, 93, 29),
            UNCHECK: cc.color(99, 65, 31),
            DISABLED: cc.color(153, 153, 153)
        };
    },

    loadSaveData: function(){
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
     * 初始化数据
     */
    initData: function () {
        cc.log("-----------------------no implements initData-----------------------")
    },
    /**
     * 设置个性化规则
     */
    setCustomView(){
        cc.log("-----------------------no implements setCustomView-----------------------")
    },
    /**
     * 获取gameType
     * @returns {null}
     */
    getGameType(){
        cc.log("-----------------------no implements getGameType-----------------------")
        return null;
    },
    /**
     * 设置toggle点击事件
     * @param data
     * @returns {null}
     */
    getGroup(target, data){
        cc.log("-----------------------no implements getGroup-----------------------")
        return null;
    },
    /**
     * 获得创建房间规则
     * @param data
     * @param qsOrJs
     * @returns {null}
     */
    getXLGameRule(data, qsOrJs){
        cc.log("-----------------------no implements getXLGameRule-----------------------")
        return null
    },
    /**
     * 根据规则初始化界面
     * @param rule
     */
    setXLGameRule(rule){
        cc.log("-----------------------no implements setXLGameRule-----------------------")
    },

    getGame(){
        cc.log("-----------------------no implements getGame-----------------------")
    }
});

module.exports = createRoom;
