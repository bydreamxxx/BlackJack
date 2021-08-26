cc.Class({
    extends: cc.Component,

    probar : null,
    count : 0,

    properties: {
        timeOverCallback : null,
    },

    // use this for initialization
    onLoad: function () {
        var node = this.node;
        this.probar = node.getComponent(cc.ProgressBar);
    },
    
    update : function (dt) {
        var progress = this.probar.progress;
        if (progress > 0) {
            progress -= dt/20;
        }else {
            if(this.timeOverCallback){
                this.timeOverCallback();
            }
            progress = 1;
        }
        var barNode = cc.find('bar', this.node);
        this.probar.progress = progress;
    },

    addTimeOverListener : function (cb) {
        if (typeof cb == 'function'){
            this.timeOverCallback = cb;
        }else{
            cc.warn('progressBar::addTimeOverCallback: cb not Function!');
        }
    },
});
