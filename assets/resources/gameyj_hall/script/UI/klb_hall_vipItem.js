cc.Class({
    extends: cc.Component,

    properties: {
        select_node: cc.Node,
        unselect_node: cc.Node,
        select_vip_lv: cc.Label,
        unselect_vip_lv: cc.Label,
        jiantou: cc.Node,
    },

    unSelect: function (idx) {
        this.select_node.active = false;
        this.unselect_node.active = true;
        this.jiantou.active = false;
    },

    select: function (idx) {
        this.select_node.active = true;
        this.unselect_node.active = false;
        this.jiantou.active = true;
    },

});
