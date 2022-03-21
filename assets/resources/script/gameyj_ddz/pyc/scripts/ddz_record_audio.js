const path_record_ani_ui = require('ConstantCfg').PrefabPath.RECORD;
const AudioChat = require('AudioChat').AudioChat;
const AppCfg = require('AppConfig');
const UIMgr = require('UIMgr');
var RoomMgr = require('jlmj_room_mgr').RoomMgr;
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...

        _cpt: null,
        _bValidRecord: false,
        _bMove: false,
        _recording: false,   //正在录音
    },

    // use this for initialization
    onLoad: function () {
        if (!AppCfg.OPEN_RECORD) {
            return;
        }

        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel, this);
    },

    touchStart: function (event) {
        cc.log('语音-touchStart');
        var limitTalk = RoomMgr.Instance()._Rule.limitTalk;
        if (limitTalk) {
            if (!this.wordsCD) {
                cc.dd.PromptBoxUtil.show('No voice in this room');
                this.wordsCD = true;
                this.scheduleOnce(function () {
                    this.wordsCD = false;
                }.bind(this), 2);
            }
            return;
        }
        this._bValidRecord = false;
        this._bMove = false;
        this._recording = true;
        UIMgr.Instance().openUI(path_record_ani_ui, function (ui) {
            this._cpt = ui.getComponent('CommonRecord');
            if (this._recording) {
                this._cpt.startRecord();
            } else {
                UIMgr.Instance().closeUI(ui);
            }
        }.bind(this));
        this.scheduleOnce(function (dt) {
            this._bValidRecord = true;
        }, 1);

        AudioChat.startRecord();
    },

    touchMove: function (event) {
        cc.log('语音-touchMove');
        var limitTalk = RoomMgr.Instance()._Rule.limitTalk;
        if (limitTalk) {
            return;
        }
        var delta = event.touch.getDelta();
        if (!this._bMove && (Math.abs(delta.x) > 10 || Math.abs(delta.y) > 10)) {
            if (this._cpt != null) {
                this._cpt.cancelRecord();
            }
            this._bMove = true;

            AudioChat.cancelRecord();
            this._recording = false;
        }
    },

    touchEnd: function (event) {
        cc.log('语音-touchEnd');
        var limitTalk = RoomMgr.Instance()._Rule.limitTalk;
        if (limitTalk) {
            return;
        }
        this._recording = false;
        if (!this._bValidRecord) {
            if (this._cpt != null) {
                this._cpt.stopRecord();
            }
            this._recordEnd();

            AudioChat.cancelRecord();
        } else {
            UIMgr.Instance().closeUI(path_record_ani_ui);

            AudioChat.completeRecord();
        }
    },

    touchCancel: function (event) {
        cc.log('语音-touchCancel');
        var limitTalk = RoomMgr.Instance()._Rule.limitTalk;
        if (limitTalk) {
            return;
        }
        this._recording = false;
        UIMgr.Instance().closeUI(path_record_ani_ui);

        if (this._bMove)
            return;
        AudioChat.cancelRecord();
    },

    _recordEnd: function () {
        this.scheduleOnce(function (dt) {
            UIMgr.Instance().closeUI(path_record_ani_ui);
        }, 1);
    },

    onDestroy: function () {
        if (!AppCfg.OPEN_RECORD) {
            return;
        }
        this._recording = false;
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel, this);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
