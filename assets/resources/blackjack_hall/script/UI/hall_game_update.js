

cc.Class({
    extends: require('com_game_update'),

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._super();
        this.progress_value = this.node.getChildByName('progress_value').getComponent(cc.Label);
        this.progress_bar = this.node.getChildByName('progressBar').getComponent(cc.ProgressBar);
        this.progress_value.string = '0%';
        this.progress_bar.progress = 0;

    },

    start() {

    },

    /**
     * 刷新UI
     */
    updateUI(active, progress) {
        if (!this.progress_value || !this.progress_bar)
            return;
        this.progress_value.node.active = active;
        this.progress_bar.node.active = active;
        if (progress) {
            this.progress_value.string = parseInt(progress * 100) + '%';
            this.progress_bar.progress = progress > 0.001 ? progress : 0.001;
        }
    },

    // update (dt) {},
});
