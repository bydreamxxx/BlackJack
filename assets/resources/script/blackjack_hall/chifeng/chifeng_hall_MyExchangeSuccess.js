var hall_audio_mgr = require('hall_audio_mgr').Instance();
var hall_prefab = require('hall_prefab_cfg');
var game_channel_cfg = require('game_channel');
var AppConfig = require('AppConfig');

cc.Class({
    extends: cc.Component,

    properties: {
        code: cc.Label,
        gongzhonghao: cc.Label,
        gongzhonghaoSp: cc.Sprite,
        gzhSpriteFrames: [cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var channel_games = game_channel_cfg.getItem(function (item) {
            if (item.channel == cc.game_pid)
                return true;
        })
        if(channel_games){
            this.gongzhonghao.string = channel_games.gzh;
        }
        if(cc.game_pid == 2){
            this.gongzhonghao.string = '快乐吧棋牌';
            this.gongzhonghaoSp.spriteFrame = this.gzhSpriteFrames[1];
        }else{
            this.gongzhonghaoSp.spriteFrame = this.gzhSpriteFrames[0];
        }
    },

    start () {

    },

    setCode(code){
        this.code.string = code;
    },

    onClickClose(){
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
        cc.dd.UIMgr.openUI(hall_prefab.CHIFENG_MY_EXCHANGE);
    },

    onClickCopyCode(){
        hall_audio_mgr.com_btn_click();
        if (cc.sys.OS_ANDROID == cc.sys.os || cc.sys.OS_IOS == cc.sys.os) {
            cc.dd.native_systool.SetClipBoardContent(this.code.string);
            cc.dd.PromptBoxUtil.show("Copy successfully");
        }
    },

    onClickCopyWeiXin(){
        hall_audio_mgr.com_btn_click();
        if (cc.sys.OS_ANDROID == cc.sys.os || cc.sys.OS_IOS == cc.sys.os) {
            cc.dd.native_systool.SetClipBoardContent(this.gongzhonghao.string);
            cc.dd.PromptBoxUtil.show("Copy successfully");
        }
    },
});
