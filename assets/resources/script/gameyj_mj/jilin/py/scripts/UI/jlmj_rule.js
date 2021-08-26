const DeskData = require('jlmj_desk_data').DeskData;
const strconfig = require('jlmj_strConfig');
var jlmj_audio_mgr = require('jlmj_audio_mgr').Instance();

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
    ctor: function (...params ) {
        // 预制体实例化
        this.m_prefab = null;
        this.m_strData = [cc.dd.Text.Text_Rule_2, cc.dd.Text.Text_Rule_3, cc.dd.Text.Text_Rule_4];
    },

    // use this for initialization
    onLoad: function () {
        // dd.ResLoader.loadPrefab( prefab, function( p ) {
        //     this.m_prefab = cc.instantiate( p );
        // }.bind( this ) );

        // this.m_rootNode = this.m_prefab.getChildByName( "Node_Root" );
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
        // var rootNode = this.m_prefab.getChildByName( "Node_Root" );

        // // 规则滑动
        // var ruleScrollView = rootNode.getChildByName( "Sprite_Background" ).getChildByName( "ScrollView_RuleList" );
        // // 规则滑动内 选中节点
        // var selectedNode = ruleScrollView.getChildByName( "Button_Selected" );
        // // 规则滑动内 未选中节点
        // var unSelectedNode = ruleScrollView.getChildByName( "Button_UnSelected" );
        // // 内容滑动
        // var contentScrollView = rootNode.getChildByName( "Sprite_Background" ).getChildByName( "ScrollView_Content" );
        // // 规则标题
        // var ruleTitle = rootNode.getChildByName( "Sprite_Background" ).getChildByName( "Label_Title" );

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
        jlmj_audio_mgr.com_btn_click();
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
            if( index == 0 ) {
                var content = this.getRoomRuleData();
            }else {
                var content = this.m_strData[Number(index)-1];
            }
            this.show( content );
        }
    },
    
    getRoomRuleData: function() {
        var data = {
            name:"房间规则",
            rule:''
        };

        var text = strconfig.roomRule.name[0];
        var fangfei = strconfig.roomRule.fangfei[DeskData.Instance().payType-1];
        text += fangfei;
        text += strconfig.roomRule.name[1];
        var guodi = strconfig.roomRule.guodi[DeskData.Instance().beishu];
        text += guodi;
        // text += DeskData.Instance().isKuaiGuo?' 快锅':'';
        text += strconfig.roomRule.name[2];
        var wanfa = DeskData.Instance().isDianPaoSanJia?strconfig.roomRule.wanfa[0]:'';
        wanfa += DeskData.Instance().isUseYaoJiu?strconfig.roomRule.wanfa[1]:'';
        wanfa += DeskData.Instance().isXiaoJiFeiDan?strconfig.roomRule.wanfa[2]:'';
        // wanfa += DeskData.Instance().isKuaiBao?strconfig.roomRule.wanfa[3]:'';
        wanfa += DeskData.Instance().isXiaoJiWanNeng?strconfig.roomRule.wanfa[4]:'';
        wanfa += DeskData.Instance().isYaoJiuSanSe?strconfig.roomRule.wanfa[5]:'';
        text += wanfa;
        data.rule = text;
        return data;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
