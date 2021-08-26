cc.Class({
    extends: cc.Component,

    properties: {
        title_editbox: cc.EditBox,
        content_editbox: cc.EditBox,
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        if (cc._sendmail_cache) {
            this.title_editbox.string = cc._sendmail_cache.title;
            this.content_editbox.string = cc._sendmail_cache.content;
        }
    },

    onDestroy() {

    },

    onClose() {
        var self = this;
        if ((this.title_editbox.string && this.title_editbox.string != '') || (this.content_editbox.string && this.content_editbox.string != '')) {
            cc.dd.DialogBoxUtil.show(1, '您的邮件还没有发送，是否保存', '是', '否',
                function () {
                    cc._sendmail_cache = {
                        title: self.title_editbox.string,
                        content: self.content_editbox.string,
                    }
                    cc.dd.UIMgr.destroyUI(self.node);
                },
                function () {
                    cc._sendmail_cache = null;
                    cc.dd.UIMgr.destroyUI(self.node);
                }
            );
        }
        else
            cc.dd.UIMgr.destroyUI(this.node);
    },

    onSend(event, custom) {
        if (!this.title_editbox.string || this.title_editbox.string == '') {
            cc.dd.PromptBoxUtil.show('请填写标题');
        }
        else if (!this.content_editbox.string || this.content_editbox.string == '') {
            cc.dd.PromptBoxUtil.show('请填写内容');
        }
        else {
            var title = cc.dd.Utils.filter(this.title_editbox.string);
            title = this.filterEmoji(title);
            var content = cc.dd.Utils.filter(this.content_editbox.string);
            content = this.filterEmoji(content);
            const req = new cc.pb.hall.msg_item_use_broadcast_req;
            req.setItemDataId(1100);
            req.setTitle(title);
            req.setContent(content);
            cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_msg_item_use_broadcast_req, req,
                '发送协议 msg_item_use_broadcast_req', true);
        }
    },


    filterEmoji: function (str) {
        var ranges = [
            '\ud83c[\udf00-\udfff]',
            '\ud83d[\udc00-\ude4f]',
            '\ud83d[\ude80-\udeff]'
        ];
        var reg = new RegExp(ranges.join('|'), 'g');
        return str.replace(reg, '*');
    },
});
