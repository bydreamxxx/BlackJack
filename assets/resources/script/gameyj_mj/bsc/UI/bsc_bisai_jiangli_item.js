cc.Class({
    extends: cc.Component,

    properties: {
        mingciTTF:cc.Label,//名次的数字
        mingChiList:[cc.Node],
        infoTTF:cc.Label,
    },

    // use this for initialization
    onLoad: function () {

    },

    /**
     *
     */
    setData:function (data) {
        if(data.num>=0){
            if(data.num>=3){
                this.mingChiList[3].active = true;
                this.mingciTTF.node.active = true;
                this.mingciTTF.string = data.num+1;
            }else {
                this.mingChiList[data.num].active = true;
            }
        }
        if(data.info){
            this.infoTTF.string = data.info;
        }

    },
});
