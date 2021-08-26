var hall_audio_mgr = require('hall_audio_mgr').Instance();
var game_channel_cfg = require('game_channel');

cc.Class({
    extends: cc.Component,

    properties: {
        kefu: cc.Label,
        phone: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // if(cc.game_pid == 10008) {
        //     this.kefu.string = "wdmj7777";
        //     this.phone.string = "15647606162";
        // }else if(cc.game_pid == 10010){
        //     this.kefu.string = "cfmj7777";
        //     this.phone.string = "17747080761";
        // }else if(cc.game_pid == 10003){
        //     this.kefu.node.parent.active = false;
        //     this.phone.string = "17043958881";
        // }else if(cc.game_pid == 10004){
        //     this.kefu.node.parent.active = false;
        //     this.phone.string = "soongyuan577";
        // }else if(cc.game_pid == 10013){
        //     this.kefu.node.parent.active = false;
        //     this.phone.string = "acmj06";
        // }else if(cc.game_pid == 10002){
        //     this.kefu.node.parent.active = false;
        //     this.phone.string = "13945698444";
        // }else{
        //     this.kefu.node.parent.active = false;
        //     this.phone.string = "cfmj7777";
        // }

        let channel_games = game_channel_cfg.getItem(function (item) {
            if (item.channel == cc.game_pid && cc._useChifengUI)
                return true;
        });

        if(channel_games && cc.dd._.isString(channel_games.kefu1) && channel_games.kefu1 != ""){
            if(cc.dd._.isString(channel_games.kefu1) && channel_games.kefu2 != ""){
                this.kefu.string = channel_games.kefu2;
            }else{
                this.kefu.node.parent.active = false;
            }

            this.phone.string = channel_games.kefu1
        }else{
            this.kefu.node.parent.active = false;
            this.phone.node.parent.active = false;
        }
    },

    start() {

    },

    closeBtn() {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },
});
