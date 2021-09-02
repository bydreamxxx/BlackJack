var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        phoneEditbox: cc.EditBox,
        nameEditbox: cc.EditBox,
        addressEditbox: cc.EditBox,
    },

    show(info) {
        if (info.tel) {
            this.phoneEditbox.string = info.tel;
        }

        if (info.name) {
            this.nameEditbox.string = info.name;
        }

        if (info.address) {
            this.addressEditbox.string = info.address;
        }
    },

    onClickClose() {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    onClickSubmit() {
        if (this.phoneEditbox.string == '') {
            cc.dd.PromptBoxUtil.show('联系电话不能为空');
            return;
        } else if (this.phoneEditbox.string.length != 11) {
            cc.dd.PromptBoxUtil.show('请输入正确联系电话');
            return;
        }

        if (this.nameEditbox.string == '') {
            cc.dd.PromptBoxUtil.show('联系人不能为空');
            return;
        }

        if (this.addressEditbox.string == '') {
            cc.dd.PromptBoxUtil.show('地址不能为空');
            return;
        }

        var pbObj = new cc.pb.rank.modify_receiving_address_req();
        pbObj.setName(this.nameEditbox.string);
        pbObj.setTel(this.phoneEditbox.string);
        pbObj.setAddress(this.addressEditbox.string);
        cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_modify_receiving_address_req, pbObj, 'modify_receiving_address_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'modify_receiving_address_req');

        cc.dd.UIMgr.destroyUI(this.node);
    }
});