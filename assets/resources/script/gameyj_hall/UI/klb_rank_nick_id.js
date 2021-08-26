const leftBorder = 12;//文字和背景左间距
const leftSpacing = 20;//距离头像间距

cc.Class({
    extends: cc.Component,

    properties: {
        nick_lbl: cc.Label,//昵称
        id_lbl: cc.Label,//id
        bg_node: cc.Node,
        line_node: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    setData(node, nick, id) {
        this.nick_lbl.string = nick;

        if(id == cc.dd.user.id){
            this.id_lbl.string = 'ID:' + id;
        }else{
            this.id_lbl.string = '';
        }
        this.line_node.active = id == cc.dd.user.id;

        var bg_node = this.bg_node;
        this.scheduleOnce(function () {
            var head_pos = node.convertToWorldSpaceAR(cc.v2(node.width / 2, 0));
            var self_pos = bg_node.convertToWorldSpaceAR(cc.v2(0, 0));
            bg_node.x = bg_node.x + leftSpacing - (self_pos.x - head_pos.x);
            bg_node.y = bg_node.y + head_pos.y - self_pos.y;
            bg_node.active = true;
        }, 0.1);
    },

    close() {
        cc.dd.UIMgr.destroyUI(this.node);
    },

    update(dt) {
        if (this.bg_node.width < Math.max(this.nick_lbl.node.width, this.id_lbl.node.width) + 2 * leftBorder) {
            var width = Math.max(this.nick_lbl.node.width, this.id_lbl.node.width) + 2 * leftBorder;
            this.bg_node.width = width;
            this.line_node.width = width;
        }
    },
});
