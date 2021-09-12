

cc.Class({
    extends: require('com_game_update'),

    properties: {
        gameItem: require('klb_hall_desk_game_item')
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._super();
        this.progress_value = this.node.getChildByName('progress_value').getComponent(cc.Label);
        this.progress_bar = this.node.getChildByName('progressBar').getComponent(cc.ProgressBar);
        this.progress_bg = this.node.getChildByName('updateBG');
        this.progress_bg.active = false;
        this.progress_bar.node.active = false;
        this.progress_value.string = '0%';
        this.progress_bar.progress = 100;

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
        this.progress_bg.active = active;
        if (progress) {
            this.progress_value.string = parseInt(progress * 100) + '%';

            let progress_bar_value = 1 - progress;
            this.progress_bar.progress = progress_bar_value > 0.001 ? progress_bar_value : 0.001;
        }

        if(this.gameItem){
            this.gameItem.setSpineAni(active);
        }
    },

    // update (dt) {},
});
