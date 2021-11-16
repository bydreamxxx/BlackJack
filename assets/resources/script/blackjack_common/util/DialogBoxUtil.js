/**
 * Created by wang on 2017/7/14.
 */
/**
 * Created by wang on 2017/7/13.
 */

var NetWaitUtil = require('NetWaitUtil');

var DialogBoxUtil = cc.Class({

    _instance: null,

    ctor: function () {
        this.inited = false;
    },

    statics: {
        Instance: function () {
            if (!this._instance) {
                this._instance = new DialogBoxUtil();
            }
            return this._instance;
        },

        Destroy: function () {
            if (this._instance) {
                if (this._instance.dialogBox) {
                    this._instance.dialogBox.node.active = false;
                    cc.game.removePersistRootNode(this._instance.dialogBox.node);
                }
                this._instance = null;
            }
        },
    },

    /**
     * 设置对话框类型
     * @param type
     */
    setDialogType: function (type) {
        switch (type) {
            case 0:
                this.prefabPath = 'blackjack_common/prefab/DialogBox';
                this.prefabScript = 'com_dialog_box';
                break;
            case 1:
                this.prefabPath = 'blackjack_common/prefab/DialogBox_withFix';
                this.prefabScript = 'com_dialog_box_withfix';
                break;
            case 2:
                this.prefabPath = 'blackjack_common/prefab/chifeng_dialog';
                this.prefabScript = 'com_dialog_box';
                break;
            case 3:
                this.prefabPath = 'blackjack_common/prefab/chifeng_join_dialog';
                this.prefabScript = 'chifeng_join_dialog';
                break;
            default:
                this.prefabPath = 'blackjack_common/prefab/DialogBox';
                this.prefabScript = 'com_dialog_box';
                break;
        }
        this.resetDialogBox();
        this.inited = true;
    },

    /**
     * 获取对话框节点
     */
    resetDialogBox: function () {
        if (this.dialogBox) {
            this.dialogBox.node.active = false;
            cc.game.removePersistRootNode(this.dialogBox.node);
            cc.dd.UIMgr.destroyUI(this.dialogBox.node);
        }
        var prefab = cc.resources.get(this.prefabPath, cc.Prefab);
        var node = cc.instantiate(prefab);
        this.dialogBox = node.getComponent(this.prefabScript);
        if (!this.dialogBox) {
            cc.log(this.prefabPath, ' 未挂脚本 ' + this.prefabScript);
            return;
        }
        cc.game.addPersistRootNode(this.dialogBox.node);
    },

    setBgCancel() {
        this.dialogBox.setMaskClick();
    },

    disableButton(type) {//置灰按钮 0取消按钮 1确定按钮
        this.dialogBox.setButtonInteractable(type);
    },

    /**
     * 显示带修复按钮的对话框
     * @param priority
     * @param contentStr
     * @param okStr
     * @param cancelStr
     * @param okHandler
     * @param cancelHandler
     * @param titleStr
     */
    showFixDialog(priority, contentStr, okStr, cancelStr, okHandler, cancelHandler, titleStr) {
        cc.error(`showFixDialog`);
        if (cc._useChifengUI)
            this.setDialogType(2);
        else
            this.setDialogType(1);
        this.show(priority, contentStr, okStr, cancelStr, okHandler, cancelHandler, titleStr);
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
    show: function (priority, contentStr, okStr, cancelStr, okHandler, cancelHandler, titleStr, addStr) {
        cc.error(`show`);

        this.waitCB = null;
        if (!this.inited) {
            if (cc._useChifengUI)
                this.setDialogType(2);
            else
                this.setDialogType(0);
        }

        //弹对话框时,必须关掉菊花
        NetWaitUtil.Instance().smooth_close();
        NetWaitUtil.Instance().close();

        this.dialogBox.resetUI();
        if(addStr){
            this.dialogBox.content_text.setText(contentStr,"","",addStr);
        }else{
            this.dialogBox.content_text.setText(contentStr);
        }
        var str = titleStr || 'reminder'
        this.dialogBox.title_text.setText(str);
        this.dialogBox.ok_text.setText(this._isValidStr(okStr) ? okStr : 'OK');
        this.dialogBox.ok_func = okHandler;
        this.dialogBox.cancel_func = cancelHandler;
        this.dialogBox.node.active = true;
        if (this.dialogBox.node.tagname == 'close' || this.dialogBox.node.tagname == 'destroy') {
            if (this.dialogBox.node.getChildByName('actNode')) {
                // this.dialogBox.node.getChildByName('actNode').stopAllActions();
                if (this.actNodeTween) {
                    this.actNodeTween.stop();
                }
            }
            this.dialogBox.node.tagname = null;
        }
        var actNode = this.dialogBox.node.getChildByName('actNode');
        if (actNode) {
            actNode.setScale(0.0);
            // var scale = cc.scaleTo(0.15, 1.0);
            // var seq = cc.sequence(cc.delayTime(0.15), scale);
            // actNode.runAction(seq);
            this.actNodeTween = cc.tween(actNode)
                .delay(0.15)
                .to(0.15, { scale: 1.0 })
                .start();
        }

        if (this._isValidStr(cancelStr)) {
            this.dialogBox.cancel_btn.active = true;
            this.dialogBox.cancel_text.setText(cancelStr);
            this.dialogBox.ok_btn.x = 155.1;
        } else {
            this.dialogBox.cancel_btn.active = false;
            this.dialogBox.ok_btn.x = 0;
        }

        var size = cc.winSize;
        this.dialogBox.node.x = size.width / 2;
        this.dialogBox.node.y = size.height / 2;
    },

    setWaitGameEnd(callback) {
        this.dialogBox.isWaitGameEnd = true;
        this.dialogBox.waitCB = callback;
    },

    waitGameEndFinished() {
        if (this.dialogBox && this.dialogBox.isWaitGameEnd) {
            this.dialogBox.waitCB();
            this.dialogBox.close();
            cc._wait_end_quickenter = true;
            setTimeout(function () {
                cc._wait_end_quickenter = false;
            }, 20 * 1000);
        }
    },

    /**
     * 显示中途加入、旁观对话框
     * @param priority  消息优先级，大于等于0
     * @param contentStr  对话框内容
     * @param okStr  确定按钮文字
     * @param cancelStr  取消按钮文字
     * @param okHandler  确定按钮回调
     * @param cancelHandler  取消按钮回调
     */
    showJoinDialog: function (priority, contentStr, okStr, cancelStr, okHandler, cancelHandler, titleStr) {
        if (cc._useChifengUI) {
            this.setDialogType(3);
            this.show(priority, contentStr, okStr, cancelStr, okHandler, cancelHandler, titleStr);
            this.inited = false;
        } else {
            this.show(priority, contentStr, okStr, cancelStr, okHandler, cancelHandler, titleStr);
        }
    },

    /**
     * 隐藏对话框
     */
    hide: function () {
        cc.log('dialog hide');
        if (this.dialogBox) {
            this.dialogBox.node.active = false;
            this.setDialogType(0);
        }
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

    /**
     * 刷新一哈
     */
    refresh: function () {
        if (this.dialogBox) {
            var size = cc.winSize;
            this.dialogBox.node.x = size.width / 2;
            this.dialogBox.node.y = size.height / 2;
        }
    },

    /**
     * 清空对话框
     */
    clear: function () {
        this.setDialogType(0);
    },

    setOkFunc(okHandler) {
        if (this.dialogBox) {
            this.dialogBox.ok_func = okHandler;
        }
    }

});

module.exports = DialogBoxUtil;