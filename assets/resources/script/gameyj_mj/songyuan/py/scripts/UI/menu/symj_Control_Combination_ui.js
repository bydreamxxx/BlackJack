var DeskData = require('symj_desk_data').DeskData;

var gang_Analysts = require('symj_pai_analysts');

var jlmj_Control_Combination_ui = require( "jlmj_Control_Combination_ui" );

var sy_ControlCombinationUi = cc.Class({
    extends: jlmj_Control_Combination_ui,

    s_instance:null,

    statics: {

        Instance: function () {
            if (!this.s_instance) {
                this.s_instance = new sy_ControlCombinationUi();
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
        var havexiaoji = DeskData.Instance().isXiaoJiFeiDan;
        gang_Analysts.Instance().getAllGangGroup(cardList, groupList, havexiaoji,isgangting);
    }
});

module.exports = sy_ControlCombinationUi;