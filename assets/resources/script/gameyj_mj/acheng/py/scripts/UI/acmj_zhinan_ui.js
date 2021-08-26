var mj_zhinan_ui = require('base_mj_zhinan_ui');

let mjzhinan = cc.Class({
    extends: mj_zhinan_ui,

    dabao: function () {
        // if(this.require_DeskData.Instance().isFriend()){
        //     var dianshu = 6;
        // }else{
        //     var dianshu = parseInt(1+cc.random0To1()*5);
        //     cc.log("打宝随机数:",dianshu);
        // }
        // this.cd.node.active = false;
        // this.db_shaizi.node.active = true;
        // this.db_dahuanbao.node.active = true;
        //
        // this.db_shaizi.playAnimation(dianshu, 1);
        // this.db_dahuanbao.playAnimation("DB",1);
        // mj_audio.playAduio("shaizi");
        //
        // this.db_shaizi.removeEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.onDaShaZiEnd, this);
        // this.db_shaizi.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.onDaShaZiEnd, this);
        this.onDaShaZiEnd();
    },

    huanbao: function (num) {
        // if(this.require_DeskData.Instance().isFriend()){
        //     var dianshu_list = [1,6,5,4,3,2];
        //     var idx = num%6;
        //     var dianshu = dianshu_list[idx];
        // }else{
        //     var dianshu = parseInt(1+cc.random0To1()*5);
        //     cc.log("打宝随机数:",dianshu);
        // }
        // this.cd.node.active = false;
        // this.db_shaizi.node.active = true;
        // this.db_dahuanbao.node.active = true;
        // this.db_shaizi.playAnimation(dianshu, 1);
        // this.db_dahuanbao.playAnimation("HB",1);
        // mj_audio.playAduio("shaizi");
        //
        // this.db_shaizi.removeEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.onDaShaZiEnd, this);
        // this.db_shaizi.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.onDaShaZiEnd, this);
        this.onDaShaZiEnd();
    },

    initMJComponet() {
        return require("mjComponentValue").acmj;
    }
});
module.exports = mjzhinan;