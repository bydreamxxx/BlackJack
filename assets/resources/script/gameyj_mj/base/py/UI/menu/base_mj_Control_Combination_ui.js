//created by wj 2017/12/11
//每个麻将都要改写这个
let mjComponentValue = null;
var s_instance = null;

var ControlCombinationUi =cc.Class({
    extends: cc.Component,

    statics: {

        Instance: function () {
            if (!s_instance) {
                s_instance = new ControlCombinationUi();
            }
            return s_instance;
        },

        Destroy: function () {
            if (s_instance) {
                s_instance.close();
                s_instance = null;
            }
        },

    },

    ctor(){
        mjComponentValue = this.initMJComponet();
        this.require_analysts = require(mjComponentValue.paiAnalysts);
        this.require_DeskData = require(mjComponentValue.deskData).DeskData;
    },

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    /**
     * 打开组合界面
     * @param groupList      麻将列表
     * @param clickCallBack  选择消息响应
     */
    onOpenCombinationUi:function(groupList, clickCallBack){
        cc.dd.UIMgr.openUI('gameyj_mj/common/prefabs/jlmj_gang_pai_option', function(prefab){
            this.combiantionUi = prefab;
            prefab.getComponent('jlmj_gang_pai_option')._openCombinationUi(groupList, clickCallBack)
        }.bind(this));
    },

    /**
     * 关闭组合界面
     */
    onCloseCombinationUi:function(){
        if(this.combiantionUi)
        {
            this.combiantionUi.getComponent('jlmj_gang_pai_option').onCancelGang();
            this.combiantionUi = null;
        }
    },

    /**
     * 获取杠牌排列组合列表
     * @param cardList      需要进行排列组合的列表数据
     * @param groupList     排列组合后存放等列表
     */
    getAllCombinationList:function(cardList, groupList, isgangting){
        var havexiaoji = this.require_DeskData.Instance().isXiaoJiFeiDan;
        this.require_analysts.Instance().getAllGangGroup(cardList, groupList, havexiaoji,isgangting);
    },

    initMJComponet(){
        cc.log("-----------------------no implements base_mj_Control_Combination_ui initMJComponet-----------------------")
        return require('mjComponentValue').base_mj;
    }
});

module.exports = ControlCombinationUi;
