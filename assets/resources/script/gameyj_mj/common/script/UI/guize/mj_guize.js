cc.Class({
    extends: cc.Component,

    properties: {
        wflayout:[cc.Layout],//玩法Layout
        wfTxt:[cc.Node],//玩法模版字
        gps:cc.Node,//gps
    },


    // LIFE-CYCLE CALLBACKS:

    onLoad :function() {

    },
    addGuize:function (gz_arr, gps) {
        this.gps.active = gps;
        for(let id = 0; id < gz_arr.length; id++){
            var txt = gz_arr[id].str;
            var type = gz_arr[id].nodetype;
            if(txt.length){
                var txt_node = cc.instantiate(this.wfTxt[type]);
                var label_str = txt_node.getComponent(cc.Label);
                label_str.string = txt;
                txt_node.active = true;
                txt_node.y = 0;

                this.wflayout[type].node.active = true;
                this.wflayout[type].node.addChild(txt_node);
            }
        }
    },
});
