cc.Class({
    extends: cc.Component,

    properties: {
        ttfNode: cc.Label,
        clodeBtn:cc.Button,
        uploadBtn:cc.Button,
    },

    // use this for initialization
    onLoad: function () {
        this.xhr = null;
        this.ot  = null;//
        this.oloaded=null;
        //开始上传

    },

    closeBtnCallBack:function () {
        this.node.removeFromParent();
        this.node.destroy();
    },
    testFun:function (code) {
        cc.log('回调----'+code);
        // if(code){
            this.clodeBtn.active = true;
        // }

    },

    startupLoadBtnCall:function () {
        cc.log('开始0------');
        cc.dd.YjLog.logConfig('/mnt/sdcard/mylog/', 1, 3);
        cc.dd.YjLog.logToFile(1,'三打一','哈哈哈哈哈哈哈哈哈哈哈哈哈哈--------------------');
        cc.dd.YjLog.logToFile(1,'三打一','哈哈哈哈哈哈哈哈哈哈哈哈哈哈--------------------');
        cc.dd.YjLog.flushLog();

        cc.log('开始shangc-----');
        cc.dd.YjLog.uploadlog('/mnt/sdcard/mylog/', '55510', '60.205.221.45', this.testFun.bind(this));
    }

});
