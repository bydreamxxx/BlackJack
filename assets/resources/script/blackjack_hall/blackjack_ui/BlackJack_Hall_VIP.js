// VIP
var hallData = require('hall_common_data').HallCommonData.getInstance();
const data_vip = require('vip');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var HallVip = require('hall_vip').VipData.Instance();
// var TaskED = require('hall_task').TaskED;
// var TaskEvent = require('hall_task').TaskEvent;

cc.Class({
    extends: cc.Component,

    properties: {
        vipLevelLabel: cc.Label,
        expLabel: require('LanguageLabel'),
        vipItem: cc.Node,
        vipContent: cc.Node,
        vipItemWidth: 0
    },

    /**
     * 更新每个级别VIP奖励
     */
    loadVipList(){
        let vips = data_vip.getItemList((vip)=>{
            return vip.key > 0;
        });

        for(let i = 0; i < vips.length; i++){
            let item = cc.instantiate(this.vipItem);
            item.active = true;
            item.parent = this.vipContent;
            item.x = 0;
            let component = item.getComponent('BlackJack_Hall_VIP_Item')
            component.setData(vips[i])
        }
        this.vipContent.width = vips.length*this.vipItemWidth
    },

    updateVipInfo(data) {
        this.vipLevelLabel.string = 'VIP'+hallData.vipLevel
        this.expLabel.setText('expericncevalue','', '', cc.dd.Utils.getNumToWordTransform(hallData.vipExp))
    },

    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage:function (event,data) {
        switch (event){
            case TaskEvent.VIP_GET_GIFT_INFO:
                this.updateVipInfo()
                break;
            default:
                break;
        }
    },
    onClickClose: function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);

    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // TaskED.addObserver(this);
        this.loadVipList();
        this.updateVipInfo()
    },

    onDestroy: function () {
        // TaskED.removeObserver(this);
    },
    // update (dt) {},
});
