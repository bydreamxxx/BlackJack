//created by wj 2017/12/11
const gang_Analysts = require('jlmj_pai_analysts');
const DeskData = require('namj_desk_data').DeskData;

var desk_cpgh_menu =cc.Class({
    extends: cc.Component,
    s_instance:null,
    statics: {

        Instance: function () {
            if (!this.s_instance) {
                this.s_instance = new desk_cpgh_menu();
            }
            return this.s_instance;
        },

        Destroy: function () {
            if (this.s_instance) {
                this.s_instance.close();
                this.s_instance = null;
            }
        },

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
            this.gangpai_ui = prefab;
            prefab.getComponent('jlmj_gang_pai_option')._openCombinationUi(groupList, clickCallBack)
        }.bind(this));
    },

    /**
     * 关闭组合界面
     */
    onCloseCombinationUi:function(){
        if(this.gangpai_ui)
        {
            this.gangpai_ui.getComponent('jlmj_gang_pai_option').onCancelGang();
            this.gangpai_ui = null;
        }
    },

    /**
     * 获取杠牌排列组合列表
     * @param cardList      需要进行排列组合的列表数据
     * @param groupList     排列组合后存放等列表
     */
    getAllCombinationList:function(cardList, groupList, isgangting){
        var havexiaoji = DeskData.Instance().isXiaoJiFeiDan;
        gang_Analysts.Instance().getAllGangGroup(cardList, groupList, false,isgangting);
    }
});

module.exports = desk_cpgh_menu;
