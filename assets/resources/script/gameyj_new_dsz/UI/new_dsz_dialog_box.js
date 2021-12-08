// create by wj 2019/05/06
var NetWaitUtil = require('NetWaitUtil');
var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        inited: false,
        content_text: cc.RichText,
        ok_text: cc.Label,
        cancel_text: cc.Label,
        ok_btn: cc.Node,
        cancel_btn: cc.Node,

        ok_func: null,
        cancel_func: null,
    },

    onLoad() {
    },

    /**
 * 设置对话框类型
 * @param type
 */
    setDialogType: function (type) {
        this.inited = true;
    },

    /**
     * 获取对话框节点
     */
    resetDialogBox: function () {

    },

    /**
 * 显示对话框
 * @param priority  消息优先级，大于等于0
 * @param contentStr  对话框内容
 * @param okStr  确定按钮文字
 * @param cancelStr  取消按钮文字
 * @param okHandler  确定按钮回调
 * @param cancelHandler  取消按钮回调
 */
    show: function (priority, contentStr, okStr, cancelStr, okHandler, cancelHandler) {
        if (!this.inited) {
            this.setDialogType(0);
        }

        //弹对话框时,必须关掉菊花
        NetWaitUtil.Instance().smooth_close();
        NetWaitUtil.Instance().close();

        this.content_text.string = contentStr;
        this.ok_text.string = this._isValidStr(okStr) ? okStr : 'text33';
        this.ok_func = okHandler;
        this.cancel_func = cancelHandler;
        this.node.active = true;
        if (this.node.tagname == 'close' || this.node.tagname == 'destroy') {
            if (this.node.getChildByName('actNode')) {
                this.node.getChildByName('actNode').stopAllActions();
            }
            this.node.tagname = null;
        }
        var actNode = this.node.getChildByName('actNode');
        if (actNode) {
            actNode.setScale(0.0);
            var scale = cc.scaleTo(0.15, 1.0);
            var seq = cc.sequence(cc.delayTime(0.15), scale);
            actNode.runAction(seq);
        }

        if (this._isValidStr(cancelStr)) {
            this.cancel_btn.active = true;
            this.cancel_text.string = cancelStr;
            this.ok_btn.x = 155.1;
        } else {
            this.cancel_btn.active = false;
            this.ok_btn.x = 0;
        }

        var size = cc.winSize;
        this.node.x = size.width / 2;
        this.node.y = size.height / 2;
    },

    _isValidStr: function (str) {
        if (typeof str == 'undefined' || !str || str == '') {
            return false;
        }
        return true;
    },

    _isValidFunc: function (cb) {
        if (typeof cb == 'undefined' || !cb) {
            return false;
        } else if (typeof cb != 'function') {
            cc.error('对话框按钮回调函数不是function类型!');
        } else {
            return true;
        }
    },

    clickOk: function () {
        hall_audio_mgr.com_btn_click();
        this.close();
        if (this.ok_func) {
            this.ok_func();
        }
    },

    clickCancel: function () {
        hall_audio_mgr.com_btn_click();
        this.close();
        if (this.cancel_func) {
            this.cancel_func();
        }
    },

    close: function () {
        cc.dd.UIMgr.destroyUI(this.node);
    },
});
