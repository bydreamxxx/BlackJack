const DeskData = require('jlmj_desk_data').DeskData;
var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        p_contentScrollView: { default: null, type: cc.ScrollView, tooltip: '规则内容滑动', },
        p_content: { default: null, type: cc.Label, tooltip: '规则内容', },
        p_title: { default: null, type: cc.Label, tooltip: '规则标题', },
        p_ruleSelcet: { default: [], type: cc.Button, tooltip: '规则选择', },
        p_rootNode: { default: null, type: cc.Node, tooltip: '根节点', },
    },

    /* 构造
    --------------------------------
    @function ctor
    @param data 数据结构为 { 规则1: "内容", 规则2: "内容" }
    --------------------------------
    */
    ctor: function( ...params ) {
        // 预制体实例化
        this.m_prefab = null;
        this.m_strData = [cc.dd.Text.Text_Rule_1, cc.dd.Text.Text_Rule_2, cc.dd.Text.Text_Rule_3, cc.dd.Text.Text_Rule_4];
    },

    // use this for initialization
    onLoad: function () {
    },
    start:function () {
        this.select( null, 0 );
    },
    // destroy
    onDestroy: function() {
        // 规则数据
        this.m_strData = null;
        // 预制体实例化
        this.m_prefab = null;
        // 当前选择按钮
        this.m_currSelectBtn = null;
    },


    /* 显示
    --------------------------------
    @function show
    @param data 数据 { rule: "", content: "" };
    --------------------------------
    */
    show: function( data ) {
        // 标题
        this.p_title.string = data.name;
        // 内容
        this.p_content.string = data.rule;

    },

    /* 隐藏
    --------------------------------
    @function hide
    --------------------------------
    */
    hide: function() {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.closeUI(this.node);
    },

    /* 选中规则
    --------------------------------
    @function select
    @param index number 按钮下标
    --------------------------------
    */
    select: function( data, index ) {
        if( index >= 0 ) {
            this.p_contentScrollView.scrollToTop();
            var content = this.m_strData[Number(index)];
            this.show( content );
        }
    },

});
