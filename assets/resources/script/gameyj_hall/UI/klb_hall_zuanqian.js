// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var zq_cfg = require('zuanqian');
var hall_audio_mgr = require('hall_audio_mgr').Instance();

const texturePath = 'gameyj_hall/textures/zuanqian/';
const scrollTime = 2;
const defaultInterval = 5;
cc.Class({
    extends: cc.Component,

    properties: {
        wx_lbl: { type: cc.Label, default: null, tooltip: '微信号' },
        content_lbl: { type: cc.Label, default: null, tooltip: '内容' },
        layout: { type: cc.Layout, default: null, tooltip: '图片容器' },
        pic_pre: { type: cc.Node, default: null, tooltip: '图片节点' },
        radio_layout: { type: cc.Layout, default: null, tooltip: '圆点容器' },
        radio_pre: { type: cc.Node, default: null, tooltip: '圆点节点' },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        // this._curIdx = 0;
        // this._totalIdx = 0;
        // var zq = zq_cfg.items[0];
        // this.wx_lbl.string = zq.wx_id;
        // this.content_lbl.string = zq.content;
        // var pics = zq.pics.split(',');
        // this.layout.node.removeAllChildren();
        // this.loadPics(pics);
    },

    setData(type) {
        this._curIdx = 0;
        this._totalIdx = 0;
        // var province = parseInt(cc.sys.localStorage.getItem('provinceid'));
        // var zq = zq_cfg.getItem(function (item) {
        //     return province == item.province;
        // });
        var zq = zq_cfg.items[type];
        this.wx_lbl.string = zq.wx_id;
        this.content_lbl.string = zq.content;
        var pics = zq.pics.split(',');
        this.layout.node.removeAllChildren();
        this._showRadio = (pics.length > 1);
        this.loadPics(pics);
    },

    loadPics(list) {
        if (list.length > 0) {
            cc.resources.load(texturePath + list.shift(), cc.SpriteFrame, function (err, sprite) {
                if (!err) {
                    var pic = cc.instantiate(this.pic_pre);
                    pic.getComponent(cc.Sprite).spriteFrame = sprite;
                    pic.active = true;
                    this.layout.node.addChild(pic);
                    if (this._showRadio) {
                        var radio = cc.instantiate(this.radio_pre);
                        radio.getComponent(cc.Mask).enabled = !(this._totalIdx == 0);
                        var btn = cc.find('btn', radio);
                        btn.on('click', this.radioClick, this);
                        btn.tagname = this._totalIdx;
                        radio.active = true;
                        this.radio_layout.node.addChild(radio);
                    }
                    this._totalIdx++;
                }
                this.loadPics(list);
            }.bind(this));
        }
        else {
            this.scheduleOnce(this.moveToNext, defaultInterval);
        }
    },

    radioClick(event) {
        if (!this.scrolling) {
            this.unschedule(this.moveToNext);
            var idx = event.target.tagname;
            this.scrollTo(idx);
        }
    },

    scrollTo(idx) {
        if (!this.scrolling) {
            this.scrolling = true;
            var tar_x = -(this.pic_pre.width + this.layout.spacingX) * idx;
            var move = cc.moveTo(scrollTime, cc.v2(tar_x, 0));
            var call_radio = cc.callFunc(this.selectRadio, this, idx);
            var spawn = cc.spawn(move.easing(cc.easeQuinticActionOut()), call_radio);
            var call = cc.callFunc(this.scrollEnd, this, idx);
            var act = cc.sequence(spawn, call);
            this.layout.node.runAction(act);
        }
    },

    selectRadio(target, idx) {
        for (var i = 0; i < this.radio_layout.node.childrenCount; i++) {
            this.radio_layout.node.children[i].getComponent(cc.Mask).enabled = !(idx == i);
        }
    },

    scrollEnd(target, idx) {
        this.scrolling = false;
        this._curIdx = idx;
        this.scheduleOnce(this.moveToNext, defaultInterval);
    },

    moveToNext() {
        var nextIdx = this._curIdx + 1;
        nextIdx = nextIdx > this._totalIdx - 1 ? 0 : nextIdx;
        this.scrollTo(nextIdx);
    },

    update(dt) {

    },

    //复制到剪切板
    copyWxStr() {
        if (cc.sys.OS_ANDROID == cc.sys.os || cc.sys.OS_IOS == cc.sys.os) {
            cc.dd.native_systool.SetClipBoardContent(this.wx_lbl.string);
            cc.dd.PromptBoxUtil.show("复制成功");
        }
    },

    onClose(event, data) {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },
});
