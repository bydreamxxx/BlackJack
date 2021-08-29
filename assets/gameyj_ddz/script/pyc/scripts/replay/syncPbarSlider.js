cc.Class({
    extends: cc.Component,

    properties: {
        slider: cc.Slider,
        pbar: cc.ProgressBar,
    },

    sync() {
        this.pbar.progress = this.slider.progress;
    },
});
