// create by wj 2019/03/28
var club_Mgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();
var new_dsz_send_msg = require('new_dsz_send_msg');
const cost_card = require('cost_room_cards');
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
        p_ls: { default: [], type: cc.Toggle, tooltip: '轮数', },
        p_gz: { default: [], type: cc.Toggle, tooltip: '规则', },
        p_sx: { default: [], type: cc.Toggle, tooltip: '上限', },
        p_yy: { default: null, type: cc.Toggle, tooltip: '语音', },
        p_gps: { default: null, type: cc.Toggle, tooltip: 'GPS', },
        p_club: { default: null, type: cc.Toggle, tooltip: '加入限定' },
        p_type: {default: [], type:cc.Toggle, tooltip: '模式'},
        p_xifen: {default: [], type:cc.Toggle, tooltip: '喜分'},
        p_xifenpoker: {default: [], type: cc.Toggle, tooltip: '喜分牌型'},
        p_xifenNum: {default: [], type: cc.Toggle, tooltip:'喜分得分'},
        p_time: {default: [], type: cc.Toggle, tooltip:'弃牌时间'},
        p_ztjr: { default: null, type: cc.Toggle, tooltip: '中途加入', },
        p_pg: { default: null, type: cc.Toggle, tooltip: '旁观', },
        isClub:{default: false, tooltip: '亲友圈创建房间'},
        p_bettype: {default: [], type: cc.Toggle, tooltip: '倍率',},
        p_watch: {default: [], type: cc.Toggle, tooltip: '看牌',},
    },


    onLoad () {
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
            this.m_objRuleIndex.rs = 6;
            this.updateCostCard(this.m_objRuleIndex.rs);
            group = this.p_rs;
            break;
        case "rs2":
            this.m_objRuleIndex.rs = 9;
            this.updateCostCard(this.m_objRuleIndex.rs);
            group = this.p_rs;
            break;
        case "ls1":
            this.m_objRuleIndex.ls = 10;
            group = this.p_ls;
            break;
        case "ls2":
            this.m_objRuleIndex.ls = 20;
            group = this.p_ls;
            break;
        case "ls3":
            this.m_objRuleIndex.ls = 30;
            group = this.p_ls;
            break;
        case "type1":
            this.m_objRuleIndex.type = 1;
            group = this.p_type;
            this.setPlayerCountShowByType(true);
            break;
        case "type2":
            this.m_objRuleIndex.type = target.isChecked ? 2 : 1;
            group = this.p_type;
            this.setPlayerCountShowByType(target.isChecked ? false : true);
            break
        case "xifen1":
            this.m_objRuleIndex.l_type = 1;
            group = this.p_xifen;
            this.clearXiFen(true);
            break;
        case "xifen2":
            this.m_objRuleIndex.l_type = 2;
            group = this.p_xifen;
            this.clearXiFen(true);
            break;
        case "xifen3":
            this.m_objRuleIndex.l_type = 3;
            group = this.p_xifen;
            this.clearXiFen(true);
            break;
        case "xifen4":
            this.m_objRuleIndex.l_type = 4;
            group = this.p_xifen;
            this.clearXiFen(false);
            break;
        case "pokertype1":
            this.checkRepeatData(this.m_objRuleIndex.l_poker, 1)
            group = this.p_xifenpoker;
            break;
        case "pokertype2":
            this.checkRepeatData(this.m_objRuleIndex.l_poker, 2)
            group = this.p_xifenpoker;
            break;
        case "xifenNum1":
            this.m_objRuleIndex.l_num = 1;
            group = this.p_xifenNum;
            break;
        case "xifenNum2":
            this.m_objRuleIndex.l_num = 2;
            group = this.p_xifenNum;
            break;
        case "xifenNum3":
            this.m_objRuleIndex.l_num = 3;
            group = this.p_xifenNum;
            break;
        case "time1":
            this.m_objRuleIndex.qp_time = 20;
            group = this.p_time;
            break;
        case "time2":
            this.m_objRuleIndex.qp_time = 30;
            group = this.p_time;
            break;
        case "time3":
            this.m_objRuleIndex.qp_time = 40;
            group = this.p_time;
            break;
        case "time4":
            this.m_objRuleIndex.qp_time = 0; 
            group = this.p_time;
            break;
        case "watch1":
            this.m_objRuleIndex.watch = 0;
            group = this.p_watch;
            break;
        case "watch2":
            this.m_objRuleIndex.watch = 1;
            group = this.p_watch;
            break;
        case "watch3":
            this.m_objRuleIndex.watch = 2;
            group = this.p_watch;
            break;
        case "watch4":
            this.m_objRuleIndex.watch = 3; 
            group = this.p_watch;
            break;
        case "gz1":
            this.checkRepeatData(this.m_objRuleIndex.wf, 1)
            group = this.p_gz;
            break;
        case "gz2":
            this.checkRepeatData(this.m_objRuleIndex.wf, 2)
            group = this.p_gz;
            break;
        case "gz3":
            this.checkRepeatData(this.m_objRuleIndex.wf, 3)
            group = this.p_gz;
            break;
        case "gz4":
            this.checkRepeatData(this.m_objRuleIndex.wf, 4)
            group = this.p_gz;
            break;
        case "gz5":
            this.checkRepeatData(this.m_objRuleIndex.wf, 5)
            group = this.p_gz;
            break;
        case "gz6":
            this.m_objRuleIndex.ztjr = target.isChecked;
            group = this.p_gz;
            break;
        case "gz7":
            this.m_objRuleIndex.pg = target.isChecked;
            group = this.p_gz;
        case "yy":
            this.m_objRuleIndex.yy = target.isChecked;
            group = this.p_yy;
            break;
        case "gps":
            this.m_objRuleIndex.gps = target.isChecked;
            group = this.p_gps;
            break;
        case "bettype1":
            this.m_objRuleIndex.bet = 1;
            group = this.p_bettype;
            break;
        case "bettype2":
            this.m_objRuleIndex.bet = 2;
            group = this.p_bettype;
            break;
        case "bettype3":
            this.m_objRuleIndex.bet = 3;
            group = this.p_bettype;
            break;
        }
        this.initToggleColor(group);
        this.setToggleColor(target, target.isChecked ? DefColor.CHECK : DefColor.UNCHECK);
    },

    checkRepeatData: function(arry, data){
        if(!this.needCheck || this.m_bInit)
            return;
        var check = false;
        for(var i = arry.length -1; i >= 0; i--){
            if(arry[i] == data){
                check = true;
                arry.splice(i, 1);
                break;
            }
        }
        if(!check)
            arry.push(data);
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
            rs: 9,
            // 轮数
            ls: 10,
            // 玩法
            wf: [5],
            //玩法模式
            type: 1,
            //喜分类型
            l_type: 4,
            //喜分牌型
            l_poker: [0],
            //喜分赔付
            l_num:0,
            //弃牌时间
            qp_time: 20,
            //看牌限制
            watch: 0,
            // 语音
            yy: false,
            // GPS
            gps: false,
            //俱乐部限定
            club: false,
            //中途加入
            ztjr: false,
            //旁观
            pg: false,
            //倍率
            bet: 1,
        };
        this.needCheck = true;
        this.m_bInit = true;
    },

    /**
     * 初始化视图
     */
    initView: function () {
        this.setJS();
        this.setRS();
        this.setLS();
        this.setType();
        this.clearXiFen(false);
        this.setFoldTime();
        this.setWF();
        this.setYY();
        this.setGPS();
        this.setZTJR();
        this.setPG();
        this.updateCostCard(this.m_objRuleIndex.rs);
        this.setBet();
        this.setWatch();
        this.setNeedCheck(true);
        this.m_bInit = false;
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
        if(node)
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
    setNeedCheck: function(isNeed){
        this.needCheck = isNeed;
    },

    /**
     * 设置人数
     */
    setRS: function () {
        // this.initToggleColor(this.p_rs);
         switch (this.m_objRuleIndex.rs) {
             case 6:
                 this.setCheckedToggle(this.p_rs[0], true);
                 break;
             case 9:
                 this.setCheckedToggle(this.p_rs[1], true);
                 break;
         }
     },

    /**
     * 更新局数消耗card具体数值
     */
    updateCostCard: function(roleNum){
        var list =cost_card.getItemList(function(item){
            if(item.id == 36)
                return item;
        })

        var data = [];
        for(var i = 0 ; i < list.length; i ++){
            var item = list[i];
            if(item.player_num == roleNum){
                data.push(item);
            }
        }
        for(var i = 0; i < this.p_js.length; i++){
            this.p_js[i].node.getChildByName('text_explain_count').getComponent(cc.Label).string = '(房卡X' + data[i].cost + ')';
        }
    },

    /**
     * 设置局数
     */
    setJS: function () {
        //this.initToggleColor(this.p_js);
        //this.updateCostCard(this.m_objRuleIndex.rs);
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
    setLS: function(){
        //this.initToggleColor(this.p_ls);
        switch (this.m_objRuleIndex.ls) {
            case 10:
                this.setCheckedToggle(this.p_ls[0], true);
                break;
            case 20:
                this.setCheckedToggle(this.p_ls[1], true);
                break;
            case 30:
                this.setCheckedToggle(this.p_ls[2], true);
                break;
        }
    },

    //设置模式
    setType: function(){
        this.setCheckedToggle(this.p_type[this.m_objRuleIndex.type -1], true);
    },

    /**
     * 大牌模式特殊处理人数
     */
    setPlayerCountShowByType: function(isShow){
        this.p_rs[1].node.active = isShow;
        this.m_objRuleIndex.rs = isShow == true ? 9: 6;
        this.setRS();
    },

    //设置喜分类型
    setXiFen: function(){
        this.setCheckedToggle(this.p_xifen[this.m_objRuleIndex.l_type - 1], true);
    },

    //设置喜分牌型
    setXiFenPoker: function(){
        for(var i = 0; i < this.m_objRuleIndex.l_poker.length; i++)
            this.setCheckedToggle(this.p_xifenpoker[i], true);
    },

    //设置喜分得分
    setXiFenNum: function(){
        if(this.m_objRuleIndex.l_num != 0)
            this.setCheckedToggle(this.p_xifenNum[this.m_objRuleIndex.l_num - 1], true);
    },
    //重置喜分
    clearXiFen: function(isEnableToggle){
        if(!this.needCheck)
            return;
        if(!isEnableToggle){
            for(var i = 0; i < this.p_xifenpoker.length; i++){
                this.setCheckedToggle(this.p_xifenpoker[i], false);
                this.p_xifenpoker[i].interactable = isEnableToggle;
            }
            for(var i = 0; i < this.p_xifenNum.length; i++){
                this.p_xifenNum[i].interactable = isEnableToggle;
                this.p_xifenNum[i].isChecked = false;
                this.p_xifenNum[i].enabled = false;
            }
            this.m_objRuleIndex.l_num = 0;
            this.m_objRuleIndex.l_poker.splice(0, this.m_objRuleIndex.l_poker.length);
            this.m_objRuleIndex.l_type = 4;
            this.setCheckedToggle(this.p_xifen[this.m_objRuleIndex.l_type - 1], true);
        }else{
            this.setCheckedToggle(this.p_xifenpoker[0], true);
            this.setCheckedToggle(this.p_xifenNum[0], true);
            for(var i = 1; i < this.p_xifenpoker.length; i++){
                this.p_xifenpoker[i].interactable = isEnableToggle;
            }
            for(var i = 0; i < this.p_xifenNum.length; i++){
                this.p_xifenNum[i].enabled = true;
                this.p_xifenNum[i].interactable = isEnableToggle;
            }
        }
    },
    //设置棋牌时间
    setFoldTime: function(){
        var index = 0;
        switch(this.m_objRuleIndex.qp_time){
            case 20:
                index = 0;
                break;
            case 30:
                index = 1;
                break;
            case 60:
                index = 2;
                break;
            case 0:
                index = 3;
                break;
        }
        this.setCheckedToggle(this.p_time[index], true);
    },

    clearWF: function(){
        for(var i = 0; i < this.p_gz.length; i++){
            this.setCheckedToggle(this.p_gz[i], false)
        }
    },

    //设置玩法
    setWF: function(){
        for(var i = 0; i < this.m_objRuleIndex.wf.length; i++){
            if(this.m_objRuleIndex.wf[i] < 6)
                this.setCheckedToggle(this.p_gz[this.m_objRuleIndex.wf[i] - 2], true);
            else
                this.setCheckedToggle(this.p_gz[4], club_Mgr.getClubOpenCreateUITag());
        }
    },

    /**
    * 设置语音
    */
   setYY: function () {
    //this.initToggleColor(this.p_yy);
        if(this.p_yy)
            this.setCheckedToggle(this.p_yy, this.m_objRuleIndex.yy);
    },

    /**
     * 设置GPS
     */
    setGPS: function () {
        //this.initToggleColor(this.p_gps);
        if(this.p_gps)
            this.setCheckedToggle(this.p_gps, this.m_objRuleIndex.gps);
    },

    /**
     * 设置中途加入
     */
    setZTJR: function(){
        this.setCheckedToggle(this.p_ztjr, this.m_objRuleIndex.ztjr);
    },

    /**
     * 设置旁观
     */
    setPG: function(){
        this.setCheckedToggle(this.p_pg, this.m_objRuleIndex.pg);
    },

    /**
     *  设置倍率
     */
    setBet: function(){
        var index = 0;
        switch(this.m_objRuleIndex.bet){
            case 1:
                index = 0;
                break;
            case 2:
                index = 1;
                break;
            case 3:
                index = 2;
                break;
        }
        this.setCheckedToggle(this.p_bettype[index], true);
    },

    /**
     * 设置看牌轮数
     */
    setWatch: function(){
        var index = this.m_objRuleIndex.watch;
        this.setCheckedToggle(this.p_watch[index], true);        
    },

    /**
     * 创建房间回调
     */
    onCreate: function (event, data) {
        /************************游戏统计 start************************/
        cc.dd.Utils.sendClientAction(cc.dd.clientAction.DSZ_FRIEND, cc.dd.clientAction.T_HALL.CREATE_ROOM);
        /************************游戏统计   end************************/

        if (!cc.dd.Utils.isNull(this.m_objRuleIndex)) {
            if(club_Mgr.getClubOpenCreateUITag()){
                let pbData = this.getRules(this.m_objRuleIndex, data == 'daikai');
                var req = new cc.pb.club.msg_club_create_baofang_req();
                req.setClubId(club_Mgr.getSelectClubId());
                req.setRule(pbData);

                cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_club_create_baofang_req, req, 'msg_club_create_baofang_req', true);
            cc.dd.UIMgr.destroyUI('gameyj_friend/prefab/klb_friend_group_createRoom');
            }else{
                if (data == 'daikai')
                    new_dsz_send_msg.sendCreateFRoom(this.m_objRuleIndex, true);
                else
                    new_dsz_send_msg.sendCreateFRoom(this.m_objRuleIndex);
            }

        }
    },
    setRoomRule(rule){
        //////////////////////////必须添加的部分//////////////////////////
        let commonBeishu = cc.find('gameScrollView/view/content/klb_friend_group_common_beishu', this.node);
        // if (commonBeishu) {
        //     commonBeishu.getComponent('klb_friend_group_common_beishu').setBeiShu(rule.gameInfo.multiple);;
        // }

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

        let _rule = rule.rule.yqPin3Rule;
        this.m_objRuleIndex = {
            // 局数
            js: _rule.boardsCout,
            // 人数
            rs: _rule.roleNum,
            // 轮数
            ls: _rule.circleNum,
            // 玩法
            wf: _rule.playRuleList,
            //玩法模式
            type: _rule.playMod,
            //喜分类型
            l_type: _rule.luckyType,
            //喜分牌型
            l_poker: _rule.luckyPokersList,
            //喜分赔付
            l_num:_rule.luckyPay,

            //俱乐部限定
            club: true,
            //中途加入
            ztjr: _rule.isMidwayAdd,
            //旁观
            pg: _rule.isViewer,

            //弃牌时间
            qp_time: _rule.opTime,
            bet: _rule.limitCmp,

            watch: _rule.limitWatch,
        };
        this.setNeedCheck(false);
        this.setJS();
        this.setRS();
        this.setLS();
        this.setType();
        this.setFoldTime();
        this.clearWF();
        this.setWF();
        this.setYY();
        this.setGPS();
        this.setZTJR();
        this.setPG();
        this.updateCostCard(this.m_objRuleIndex.rs);
        this.setBet();
        this.setXiFen();
        this.setXiFenNum();
        this.setXiFenPoker(false);
        this.setWatch();

        //////////////////////////必须添加的部分//////////////////////////
        //所有按键不可点击，不置灰
        this.p_rs.forEach((toggle)=>{
            toggle.interactable = false;
        });
        this.p_js.forEach((toggle)=>{
            toggle.interactable = false;
        })
        this.p_ls.forEach((toggle)=>{
            toggle.interactable = false;
        })
        this.p_gz.forEach((toggle)=>{
            toggle.interactable = false;
        });
        this.p_sx.forEach((toggle)=>{
            toggle.interactable = false;
        })

        this.p_type.forEach((toggle)=>{
            toggle.interactable = false;
        });
        this.p_xifen.forEach((toggle)=>{
            toggle.interactable = false;
        })
        this.p_xifenpoker.forEach((toggle)=>{
            toggle.interactable = false;
        })

        this.p_xifenNum.forEach((toggle)=>{
            toggle.interactable = false;
        });

        this.p_bettype.forEach((toggle)=>{
            toggle.interactable = false;
        })
        this.p_time.forEach((toggle)=>{
            toggle.interactable = false;
        })

        this.p_watch.forEach((toggle)=>{
            toggle.interactable = false;
        })

        this.p_ztjr.interactable = false;

        this.p_pg.interactable = false;
        ///////////////////////////////////////////////////////////
    },

    /**
     * 
     */
    getRules(data, isProxy) {
        data = (!cc.dd._.isNull(data) && !cc.dd._.isUndefined(data)) ? data : this.m_objRuleIndex;
        cc.dd.Utils.sendClientAction(cc.dd.clientAction.DSZ_FRIEND, cc.dd.clientAction.CREARTE);

        var pbData = new cc.pb.room_mgr.msg_create_game_req();
        var pbCommon = new cc.pb.room_mgr.common_game();
        var pbRule = new cc.pb.room_mgr.yq_pin3_rule_info();
        var rule = new cc.pb.room_mgr.xl_game_rule();

        pbCommon.setGameType(36);
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
        if (isProxy) {
            pbCommon.setClubCreateType(2);
        }
        pbRule.setRoleNum(data.rs);//人数
        pbRule.setBoardsCout(data.js);//局数
        pbRule.setCircleNum(data.ls);//轮数
        pbRule.setPlayMod(data.type); //模式
        pbRule.setPlayRuleList(data.wf); //玩法
        pbRule.setLimitTalk(!data.yy); //语音
        pbRule.setIsGps(data.gps);
        pbRule.setLuckyType(data.l_type); //喜分类型
        pbRule.setLuckyPay(data.l_num); //喜分分值
        pbRule.setLuckyPokersList(data.l_poker); //喜分牌型
        pbRule.setOpTime(data.qp_time); //弃牌时间
        pbRule.setIsMidwayAdd(data.ztjr); //中途加入
        pbRule.setIsViewer(data.pg); //旁观
        pbRule.setLimitCmp(this.m_objRuleIndex.bet); //倍率选择
        pbRule.setLimitWatch(data.watch); //闷牌轮数
        pbRule.setBaseScore(1);

        pbCommon.setClubId(club_Mgr.getSelectClubId());
        pbCommon.setClubCreateType(club_Mgr.getClubCreateRoomType());

        pbData.setGameInfo(pbCommon);
        rule.setYqPin3Rule(pbRule);
        pbData.setRule(rule);
        if(cc.sys.isNative){
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
            }else if(cc.sys.OS_IOS == cc.sys.os){
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
        var publicInfo = new cc.pb.room_mgr.xl_game_rule_public;
        publicInfo.setIsCanEnter(data.ztjr);
        publicInfo.setIsCanView(data.pg);
        pbData.setRulePublic(publicInfo);

        return pbData;
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
