var replay_ui = require('base_mj_replay_ui');
//每个麻将都要改写这个
let mjComponentValue = null;

cc.Class({
    extends: replay_ui,

    ctor() {
        mjComponentValue = this.initMJComponet();
    },

    initMJComponet(){
        return require('mjComponentValue').acmj;
    }
});