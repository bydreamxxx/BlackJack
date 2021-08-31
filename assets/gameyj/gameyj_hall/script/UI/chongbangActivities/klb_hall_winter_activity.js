var hall_audio_mgr = require('hall_audio_mgr').Instance();
const Hall = require('jlmj_halldata');
var hall_prefab = require('hall_prefab_cfg');

cc.Class({
    extends: require('klb_hall_iphone'),

    onClickRule(){
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_WINTER_ACTIVY_RULE);
    },

    onEventMessage(event, data) {
        switch (event) {
            case Hall.HallEvent.RANK_ACTIVITY_ADDRESS:
                cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_WINTER_ACTIVY_USERINFO, (ui) => {
                    ui.getComponent('klb_hall_iphone_userInfo').show(Hall.HallData.Instance().getRankAddress());
                });
                break;
        }
    },
});
