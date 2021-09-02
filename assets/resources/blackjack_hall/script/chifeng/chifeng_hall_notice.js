var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.RichText,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if(cc.game_pid == 10008){
            this.content.string = this.content.string.replace(/祥云赤峰麻将/g,"赤峰乌丹麻将");
        }else if(cc.game_pid == 10010){
            this.content.string = this.content.string.replace(/祥云赤峰麻将/g,"赤峰平庄麻将");
        }else if(cc.game_pid == 10003){
            this.content.string = this.content.string.replace(/祥云赤峰麻将/g,"团圆本地游戏").replace(/祥云棋牌/g,"本地游戏");
        }else if(cc.game_pid == 10004){
            this.content.string = this.content.string.replace(/祥云赤峰麻将/g,"享乐游戏").replace(/祥云棋牌/g,"享乐游戏");
        }else if(cc.game_pid == 10013){
            this.content.string = this.content.string.replace(/祥云赤峰麻将/g,"巷乐阿城麻将").replace(/祥云棋牌/g,"巷乐游戏");
        }
    },

    start () {

    },

    close: function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },
    // update (dt) {},
});
