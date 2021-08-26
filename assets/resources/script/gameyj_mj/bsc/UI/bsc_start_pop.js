cc.Class({
    extends: cc.Component,

    properties: {
        iconNode:cc.Node,//比赛开始
        LunShuTTF:cc.Label,//轮数
        JuShuTTF:cc.Label,//局数

        numNode:cc.Node,//局数轮数的父节点
    },

    // use this for initialization
    onLoad: function () {
        setTimeout(function () {
            this.node.removeFromParent();
            this.node.destroy();
        }.bind(this), 2000);
    },

    /**
     * 设置轮数
     */
    setData:function (lun, ju) {
        this.LunShuTTF.string = lun;
        this.JuShuTTF.string = ju;
        var isShowIcon = lun==1 && ju==1;
        this.iconNode.active = isShowIcon;//标题
        if(!isShowIcon){
            this.numNode.y = 0;
        }
    }
});
