let scene = cc.Class({
    extends: require('base_mj_scene'),

    initMJComponet() {
        return require("mjComponentValue").bcmj;
    }

});
module.exports = scene;
