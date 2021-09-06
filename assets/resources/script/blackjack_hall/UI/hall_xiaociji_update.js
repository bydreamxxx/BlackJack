

cc.Class({
    extends: require('com_game_update'),

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._super();
        this.progress_txt = this.node.getChildByName('progress').getComponent(cc.Label);
    },

    start () {

    },

    /**
     * 刷新UI
     */
    updateUI(active, progress){
        this.node.getChildByName('x-jaizai_bt02').active = active;
        this.node.getChildByName('x-jaizai_bt01').active = active;
        this.progress_txt.node.active = active;
        if(progress){
            this.progress_txt.string = parseInt(progress*100) + '%';;
        }
    },

    // update (dt) {},
});
