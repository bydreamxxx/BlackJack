
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad (){
        cc.dd.SysTools.setLandscape();
        this.progress_bar = cc.find("Canvas/New ProgressBar").getComponent(cc.ProgressBar);
        this.progress_bar.progress = 0;
    },

    start () {
        this.speed = 0.6;
    },

    update(dt) {
        if(this.changeing){
            return;
        }
        if(this.progress_bar.progress <= cc.loading_progress_max){
            let cur_progress = this.progress_bar.progress + this.speed*dt;
            this.progress_bar.progress = Math.min(cc.loading_progress_max, cur_progress);
        }
        if(this.progress_bar.progress >= 1.0){
            if(cc.replace_scene_end_func){
                cc.replace_scene_end_func();
                this.changeing = true;
            }
        }
    },

});
