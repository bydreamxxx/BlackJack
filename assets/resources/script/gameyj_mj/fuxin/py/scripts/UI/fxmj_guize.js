cc.Class({
    extends: cc.Component,

    properties: {
        layout_node:cc.Layout,
        txt_node:cc.Node
    },


    // LIFE-CYCLE CALLBACKS:

    onLoad :function() {

    },
    addGuize:function (gz_arr) {
        for(var id in gz_arr){
            var txt = gz_arr[id].str;
            if(txt.length){
                var txt_node = cc.instantiate(this.txt_node);
                var label_str = txt_node.getComponent(cc.Label);
                label_str.string = txt;
                txt_node.active = true;
                txt_node.y = 0;

                this.layout_node.node.addChild(txt_node);
            }
        }
    },
});
