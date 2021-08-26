cc.Class({
    extends: cc.Component,

    properties: {
        yuyin_size: { default:null, type:cc.Label, tooltip:"语音大小"},
    },

    // use this for initialization
    onLoad: function () {

    },

    setYuYinSize: function (size) {
      this.yuyin_size.string = size;
    },

});
