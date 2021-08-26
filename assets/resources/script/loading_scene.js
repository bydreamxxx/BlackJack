
cc.Class({
    extends: cc.Component,

    properties: {
        start_node: cc.Node,
        end_node: cc.Node,
    },

    onLoad() {
        cc.dd.SysTools.setLandscape();
        this.progress_bar = cc.find("Canvas/New ProgressBar").getComponent(cc.ProgressBar);
        this.progress_bar.progress = 0;
        this.loading_ani = cc.find("Canvas/loading_ani").getComponent(cc.Animation);
        if (cc.loading_type == 1) {
            this.loading_ani.play("mj");
        } else {
            this.loading_ani.play("pk");
        }
    },

    start() {
        this.speed = 0.6;
    },

    update(dt) {
        if (this.changeing) {
            return;
        }
        if (this.progress_bar.progress <= cc.loading_progress_max) {
            let cur_progress = this.progress_bar.progress + this.speed * dt;
            this.progress_bar.progress = Math.min(cc.loading_progress_max, cur_progress);
            this.loading_ani.node.x = cc.lerp(this.start_node.x, this.end_node.x, Math.min(cc.loading_progress_max, cur_progress));
        }
        if (this.progress_bar.progress >= 1.0) {
            if (cc.replace_scene_end_func) {
                cc.replace_scene_end_func();
                this.changeing = true;
            }
        }
    },

});
