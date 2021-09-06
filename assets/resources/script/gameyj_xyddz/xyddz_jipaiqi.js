const C_Color = {
    Normal: cc.color(255, 255, 255),//普通
    Warn: cc.color(204, 82, 5),     //警告(炸弹)
}
cc.Class({
    extends: cc.Component,

    properties: {
        ani: cc.Animation,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    setData(counts) {
        if (counts[0] == 1)
            cc.find('bg/172_num', this.node).getComponent(cc.Label).string = '';
        else
            cc.find('bg/172_num', this.node).getComponent(cc.Label).string = '1';
        if (counts[17] == 1)
            cc.find('bg/171_num', this.node).getComponent(cc.Label).string = '';
        else
            cc.find('bg/171_num', this.node).getComponent(cc.Label).string = '1';
        for (var i = 3; i < 17; i++) {
            var node = cc.find('bg/' + i + '_num', this.node);
            if (node) {
                if (counts[i] == 4)
                    node.getComponent(cc.Label).string = '';
                else
                    node.getComponent(cc.Label).string = '' + (4 - counts[i]);
                node.color = counts[i] == 0 ? C_Color.Warn : C_Color.Normal;
            }
        }
    },

    JipaiqiIn() {
        this.ani.play('jipaiqi_in');
    },

    JipaiqiOut() {
        this.ani.play('jipaiqi_out');
    },
    // update (dt) {},
});
