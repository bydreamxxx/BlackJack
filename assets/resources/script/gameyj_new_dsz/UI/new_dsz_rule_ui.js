// create by wj 2018.05.05
var rule_config = require('klb_rule');
cc.Class({
    extends: cc.Component,

    properties: {
        m_oLable: cc.Label,
    },
    onLoad () {
        // var ruleData = rule_config.getItem(function(item){
        //     if(item.gameid == 136)
        //         return item;
        // });

        // this.m_oLable.string = ruleData.playlaws;
        // this.m_oLable.node.parent.height = this.m_oLable.node.getContentSize().height+36;
    },

    onClose: function(event, data){
        cc.dd.UIMgr.destroyUI(this.node);
    }

});
