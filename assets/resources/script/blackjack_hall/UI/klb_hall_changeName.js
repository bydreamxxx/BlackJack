var hall_audio_mgr = require('hall_audio_mgr').Instance();
const hall_prop_data = require('hall_prop_data').HallPropData.getInstance();
var hallData = require('hall_common_data').HallCommonData;

cc.Class({
    extends: cc.Component,

    properties: {
        nameEditBox: cc.EditBox,
        tips: cc.Label,
        changeCard: cc.Label,
        freeNode: cc.Node,
        cardNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.tips.string = '';
        let changeCardInfo = hall_prop_data.getItemInfoByDataId(1102);
        this.changeCard.string = changeCardInfo ? changeCardInfo.count : 0;
        this.freeNode.active = false;//hallData.getInstance().changeNameCount == 0;
        this.cardNode.active = true;//hallData.getInstance().changeNameCount != 0;
    },

    start () {

    },

    onDidReturn(){
        if(this.nameEditBox.string == ''){
            this.tips.string = '昵称不能为空';
        } else if (!/(^[A-Za-z0-9\u4e00-\u9fa5]+$)/.test(this.nameEditBox.string)) {
            this.tips.string = '昵称格式有误请重新输入';
        }else{
            this.tips.string = '';
        }
    },

    onClickButton(){
        if(this.nameEditBox.string == ''){
            cc.dd.DialogBoxUtil.show(0,'昵称不能为空', '确定');
            return;
        } else if (!/(^[A-Za-z0-9\u4e00-\u9fa5]+$)/.test(this.nameEditBox.string)) {
            cc.dd.DialogBoxUtil.show(0,'昵称格式有误请重新输入', '确定');
            return;
        }else{
            this.tips.string = '';
        }

        var req = new cc.pb.hall.msg_modify_name_req();
        req.setNewName(this.nameEditBox.string)
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_msg_modify_name_req,req,
            '发送协议[id: ${cc.netCmd.hall.cmd_msg_modify_name_req}],msg_modify_name_req[修改昵称]', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'changeName');

        cc.dd.UIMgr.destroyUI(this.node);
    },

    /**
     * 关闭回调
     */
    closeBtnCallBack:function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },
});
