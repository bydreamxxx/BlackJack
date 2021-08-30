const path_record_ani_ui = require('ConstantCfg').PrefabPath.RECORD;
const AudioChat = require('AudioChat').AudioChat;
const AppCfg = require('AppConfig');
const UIMgr = require('UIMgr');
var RoomMgr = require('jlmj_room_mgr').RoomMgr;

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        if(!AppCfg.OPEN_RECORD){
            return;
        }
        //gvoice 是否有效
        this.gvoice_valid = false;
        //录音时长 是否有效
        this.record_time_valid=false;
        //移动距离
        this.move_distance = cc.v2(0,0);
        //是否移动取消
        this.move_cancel=false;
        //录音UI
        this.record_ui=null;
        //录音时间到
        this.record_time_up = false;


        UIMgr.Instance().openUI(path_record_ani_ui,function (ui) {
            ui.active = false;
            ui.zIndex = 999;
            this.record_ui = ui.getComponent('CommonRecord');
        }.bind(this));

        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel, this);
    },

    touchStart:function (event) {
        cc.log('语音-touchStart');
        if (!cc.sys.isNative){
            return;
        }
        var limitTalk = RoomMgr.Instance()._Rule.limitTalk;
        if (limitTalk) {
            if (!this.wordsCD) {
                cc.dd.PromptBoxUtil.show('此房间不能语音');
                this.wordsCD = true;
                this.scheduleOnce(function () {
                    this.wordsCD = false;
                }.bind(this), 2);
            }
            return;
        }
        if(!this.record_ui){
            return;
        }
        this.gvoice_valid = cc.dd.native_gvoice.startRecord();
        if(!this.gvoice_valid){
            return;
        }

        // if(cc._chifengGame){
        //     if (AudioManager._getLocalMusicSwitch()) {
        //         AudioManager.pauseMusic();
        //     }
        // }
        AudioManager.startRecord();

        this.unscheduleAllCallbacks();
        this.record_ui.node.active = true;
        this.record_ui.startRecord();
        this.record_time_up = false;
        this.record_ui.record_timer_ani.node.active = true;
        this.record_ui.record_timer_ani.play();
        this.schedule(function (dt) {
            this.record_time_up = true;
            this.record_ui.record_timer_ani.node.active = false;
            this.record_ui.record_timer_ani.stop();
            this.record_ui.node.active = false;
            cc.dd.native_gvoice.stopRecord();
            this.unscheduleAllCallbacks();
            cc.dd.native_gvoice.upload();
        }, 15);
        this.record_time_valid = false;
        this.schedule(function (dt) {
            this.record_time_valid = true;
        }, 1);
        this.move_cancel = false;
        this.move_distance = cc.v2(0,0);
    },

    touchMove:function (event) {
        if (!cc.sys.isNative){
            return;
        }
        var limitTalk = RoomMgr.Instance()._Rule.limitTalk;
        if (limitTalk) {
            return;
        }
        if(!this.record_ui){
            return;
        }
        if(!this.gvoice_valid){
            return;
        }
        if(this.record_time_up){
            return;
        }

        var delta = event.touch.getDelta();
        this.move_distance.x += delta.x;
        this.move_distance.y += delta.y;
        let is_cancel_distance = this.move_distance.y > 70;
        if(!this.move_cancel && is_cancel_distance){
            this.move_cancel = true;
            this.record_ui.cancelRecord();
            cc.log("取消录音");
        }else if(this.move_cancel && !is_cancel_distance){
            this.move_cancel = false;
            this.record_ui.startRecord();
            cc.log("正常录音");
        }
    },

    touchEnd:function (event) {
        cc.log('语音-touchEnd');
        if (!cc.sys.isNative){
            return;
        }
        var limitTalk = RoomMgr.Instance()._Rule.limitTalk;
        if (limitTalk) {
            return;
        }
        if(!this.record_ui){
            return;
        }        
        if(!this.gvoice_valid){
            return;
        }
        if(this.record_time_up){
            return;
        }

        this.record_ui.record_timer_ani.stop();
        this.record_ui.record_timer_ani.node.active = false;
        if(!this.record_time_valid){
            cc.dd.native_gvoice.stopRecord();
            this.record_ui.stopRecord();
            this.schedule(function (dt) {
                this.record_ui.node.active = false;
            }, 1);
            return;
        }
        this.record_ui.node.active = false;
        cc.dd.native_gvoice.stopRecord();
        this.unscheduleAllCallbacks();

        // if(cc._chifengGame){
        //     if (AudioManager._getLocalMusicSwitch()) {
        //         AudioManager.resumeMusic();
        //     }
        // }
        AudioManager.completeRecord();

        if(this.move_cancel){
            return;
        }
        cc.dd.native_gvoice.upload();
    },

    touchCancel:function (event) {
        cc.log('语音-touchCancel');
        if (!cc.sys.isNative){
            return;
        }
        var limitTalk = RoomMgr.Instance()._Rule.limitTalk;
        if (limitTalk) {
            return;
        }
        
        if(!this.gvoice_valid){
            return;
        }
        if(this.record_time_up){
            return;
        }
        this.record_ui.record_timer_ani.stop();
        this.record_ui.record_timer_ani.node.active = false;
        if(!this.record_time_valid){
            cc.dd.native_gvoice.stopRecord();
            this.record_ui.stopRecord();
            this.schedule(function (dt) {
                this.record_ui.node.active = false;
            }, 1);
            return;
        }

        this.record_ui.node.active = false;
        cc.dd.native_gvoice.stopRecord();
        this.unscheduleAllCallbacks();

        // if(cc._chifengGame){
        //     if (AudioManager._getLocalMusicSwitch()) {
        //         AudioManager.resumeMusic();
        //     }
        // }
        AudioManager.cancelRecord();
    },

    onDestroy:function () {
        if(!AppCfg.OPEN_RECORD){
            return;
        }
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel, this);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
