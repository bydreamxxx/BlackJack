// create by wj 2019/04/17
var new_dsz_send_msg = require('teenpatti_send_msg');
var config = require('yq_pin3');
var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        p_rs: { default: [], type: cc.Toggle, tooltip: '人数', },
        p_ls: { default: [], type: cc.Toggle, tooltip: '轮数', },
        p_gz: { default: [], type: cc.Toggle, tooltip: '规则', },
        p_Stranger: { default: null, type: cc.Toggle, tooltip: '陌生人加入' },
        p_type: {default: [], type:cc.Toggle, tooltip: '模式'},

        m_oSlider: {
            default: null,
            type:  cc.Slider,
        },

        m_oProgress: {
            default: null,
            type: cc.ProgressBar,
        },

        m_oBaseTxt: cc.Label,
        m_olimitEnterTxt: cc.Label,
        m_olimitLeaveTxt: cc.Label,
        m_nIndex: 0,
        m_tConfigData: [],
    },


    onLoad () {
        this.initData();
        this.initView();
    },

    /**
     * 选择规则
     */
    onSelectRule: function (target, data) {
        hall_audio_mgr.com_btn_click();
        var group = null;
        switch (data) {
            case "rs1":
                this.m_objRuleIndex.rs = 6;
                group = this.p_rs;
                break;
            case "rs2":
                this.m_objRuleIndex.rs = 9;
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
                this.m_objRuleIndex.type = 2;
                group = this.p_type;
                this.setPlayerCountShowByType(false);
                break
            case "watch4":
                this.m_objRuleIndex.watch = this.m_objRuleIndex.watch == 3 ? 0 : 3;
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
            case "stranger":
                    this.m_objRuleIndex.stranger = target.isChecked;
                    group = this.p_Stranger;
                    break;
            // case "watch3":
            //     this.m_objRuleIndex.watch = 2;
            //     break;
        }
        this.initToggleColor(group);
    },

    checkRepeatData: function(arry, data){
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
            // 人数
            rs: 6,
            // 轮数
            ls: 30,
            // 玩法
            wf: [],
            //玩法模式
            type: 1,
            //俱乐部限定
            stranger: true,
            //底注
            baseScore: 0,
            //入场费
            limitEnter: 0,
            //离场非
            limitLeave: 0,
            //看牌限制
            watch: 0,
        };

    },

    /**
     * 初始化视图
     */
    initView: function () {
        this.setRS();
        this.setType();
        this.setWF();
        this.setStranger();
        this.setBaseData();
       // this.setWatch();
    },


    /**
     * 设置看牌轮数
     */
    setWatch: function(){
        var index = this.m_objRuleIndex.watch;
        this.setCheckedToggle(this.p_watch[index], true);        
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

                }
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
                toggle.check();
            } else {
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
             case 6:
                 this.setCheckedToggle(this.p_rs[0], true);
                 break;
             case 9:
                 this.setCheckedToggle(this.p_rs[1], true);
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

    //设置玩法
    setWF: function(){
        for(var i = 0; i < this.m_objRuleIndex.wf.length; i++){
            if(this.m_objRuleIndex.wf[i] < 5)
                this.setCheckedToggle(this.p_gz[this.m_objRuleIndex.wf[i] - 1], true);
        }
    },

    /**
    * 陌生人加入
    */
   setStranger: function () {
        this.setCheckedToggle(this.p_Stranger, this.m_objRuleIndex.stranger);
    },

    /**
     * 大牌模式特殊处理人数
     */
    setPlayerCountShowByType: function(isShow){
        this.p_rs[1].node.active = isShow;
        this.m_objRuleIndex.rs = isShow == true ? this.m_objRuleIndex.rs: 6;
        this.setRS();
    },

    setInfo: function(){
        this.m_oBaseTxt.string = this.m_tConfigData[this.m_nIndex].key;
        this.m_olimitEnterTxt.string = this.convertChipNum(this.m_tConfigData[this.m_nIndex].add_limit);
        this.m_olimitLeaveTxt.string = this.convertChipNum(this.m_tConfigData[this.m_nIndex].leave_limit);
        this.m_objRuleIndex.baseScore = this.m_tConfigData[this.m_nIndex].key;
        this.m_objRuleIndex.limitEnter = this.m_tConfigData[this.m_nIndex].add_limit;
        this.m_objRuleIndex.limitLeave = this.m_tConfigData[this.m_nIndex].leave_limit;
    },

    /**
     * 初始化配置表初始数据
     */
    setBaseData: function(){
        var self = this;
        config.getItem(function(data) {
            if(data.gameid == 37)
                self.m_tConfigData.push(data);
        });
        this.m_nIndex = 0;
        this.setInfo();
        this.setSlider();
    },

    /**
     * 点击增加按钮
     */
    onClickAdd: function(event, data){
        hall_audio_mgr.com_btn_click();
        this.m_nIndex += 1;
        if(this.m_nIndex >= this.m_tConfigData.length - 1)
            this.m_nIndex = this.m_tConfigData.length - 1;
        this.setInfo();
        this.setSlider();
        this.m_oProgress.node.getChildByName('bar').active = true;
    },

    /**
     * 点击减少按钮
     */
    onClickSub: function(event, data){
        hall_audio_mgr.com_btn_click();
        this.m_nIndex -= 1;
        if(this.m_nIndex <= 0)
            this.m_nIndex = 0;
        this.setInfo();
        this.setSlider();
        this.m_oProgress.node.getChildByName('bar').active = true;
    },

    /**
     * 滑动slider调节数值
     */
    onSliderMove: function(event, data){
        var maxNum = this.m_tConfigData.length;
        var progress = this.m_oSlider.progress;
        var value = progress;

        var num = parseInt(value * maxNum);
        if(num > maxNum)
            num = maxNum;
        if(progress > 1.0)
            progress = 1.0
        this.m_oSlider.progress = progress;
        this.m_oProgress.progress = progress;
        this.m_nIndex = num;
        this.setInfo();
        this.m_oProgress.node.getChildByName('bar').active = true;
    },

    /**
     * 设置滑动条位置
     */
    setSlider: function(){
        var progress = this.m_nIndex / (this.m_tConfigData.length - 1);
        this.m_oSlider.progress = progress;
        this.m_oProgress.progress = progress;
        if(progress >= 0 && progress < 0.125)
            this.m_oProgress.node.getChildByName('bar').active = false;
    },

    /**
     * 创建房间回调
     */
    onCreate: function () {
        hall_audio_mgr.com_btn_click();
        /************************游戏统计 start************************/
        cc.dd.Utils.sendClientAction(cc.dd.clientAction.DSZ_FRIEND, cc.dd.clientAction.T_HALL.CREATE_ROOM);
        /************************游戏统计   end************************/

        if (!cc.dd.Utils.isNull(this.m_objRuleIndex)) {
            new_dsz_send_msg.sendCreateCoinRoom(this.m_objRuleIndex);
        }
    },

    onClickRule: function(event, data){
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI('gameyj_new_dsz/common/prefab/new_dsz_rule_ui', function (prefab) {
        });
    },

    /**
     * 关闭界面
     */
    onClose: function(){
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    //转换筹码字
    convertChipNum: function(num){
        var str = num;
        if(num >= 10000 && num < 100000000){
            str = (num / 10000).toFixed(0) + '万';
        }else if(num >= 100000000)
            str = Math.ceil(num / 100000000).toFixed(0) + '亿';
        return str 
    },
});
