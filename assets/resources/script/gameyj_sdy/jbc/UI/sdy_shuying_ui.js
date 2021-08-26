cc.Class({
    extends: cc.Component,

    properties: {
        sp_shu: cc.Sprite,
        sp_ying: cc.Sprite,
        txt_shu: cc.Label,
        txt_ying: cc.Label,
    },

    onLoad: function () {

    },

    setNum: function (num) {
        if(num<0){
            this.sp_ying.node.active = false;
            this.txt_ying.node.active = false;
            this.sp_shu.node.active = true;
            this.txt_shu.node.active = true;

            if(num<=-10000*10000){
                num = (num/10000*10000).toFixed(2) + '亿';
            }else if(num<-10000){
                num = (num/10000).toFixed(2) + '万';
            }
            this.txt_shu.string = num;
        }else{
            this.sp_ying.node.active = true;
            this.txt_ying.node.active = true;
            this.sp_shu.node.active = false;
            this.txt_shu.node.active = false;

            if(num>=10000*10000){
                num = (num/10000*10000).toFixed(2) + '亿';
            }else if(num > 10000){
                num = (num/10000).toFixed(2) + '万';
            }
            this.txt_ying.string = '+'+num;
        }
    },

});
