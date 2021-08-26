var jlmj_Control_Combination_ui = require( "base_mj_Control_Combination_ui" );

var sh_ControlCombinationUi = cc.Class({
    extends: jlmj_Control_Combination_ui,

    s_instance:null,

    statics: {

        Instance: function () {
            if (!this.s_instance) {
                this.s_instance = new sh_ControlCombinationUi();
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

    /**
     * 获取杠牌排列组合列表
     * @param cardList      需要进行排列组合的列表数据
     * @param groupList     排列组合后存放等列表
     */
    getAllCombinationList:function(cardList, groupList, isgangting){
        var havexiaoji = this.require_DeskData.Instance().isXiaoJiFeiDan;
        this.require_analysts.Instance().getAllGangGroup(cardList, groupList, havexiaoji,false);
    },
    
    initMJComponet(){
        return require('mjComponentValue').bcmj;
    }
});

module.exports = sh_ControlCombinationUi;