const Bsc_Event = require('bsc_data').BSC_Event;
const Bsc_ED = require('bsc_data').BSC_ED;
let hall_audio_mgr = require('hall_audio_mgr').Instance();
let AudioManager = require('AudioManager');
const gold_sound = 'gameyj_common/audio/money';
const money_sound = 'gameyj_common/audio/money';
cc.Class({
    extends: cc.Component,

    properties: {
        bagNode: cc.Node,
        moveNode: cc.Node,
        hbPic: cc.Node,
        hbSpine: sp.Skeleton,
        moneyNode: cc.Node,
        goldNode: cc.Node,
        luckyBtn: cc.Node,
        starLZ: cc.ParticleSystem,
        bagLZ: cc.ParticleSystem,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        if (cc._appstore_check || cc._androidstore_check || cc._applyForPayment) {
            this.node.active = false;
            return;
        }
        cc._needShowDrop = false;
        Bsc_ED.addObserver(this);
        let self = this;
        this.hbSpine.setStartListener((trackEntry, loopCount) => {
            let name = trackEntry.animation ? trackEntry.animation.name : '';
            if (name == 'xunhuan') {
                self.hbPic.active = true;
                self.openFinished = true;
                self._maskclick = false;
                AudioManager.getInstance().playSound(this.sound_path, false);
            }
        });
        this.hbSpine.setCompleteListener((trackEntry, loopCount) => {
            let name = trackEntry.animation ? trackEntry.animation.name : '';
            if (name == 'chuxian') {
                self.hbSpine.setAnimation(0, 'xunhuan', true);
            }
            else {
                if (loopCount == 1) {
                    self.scheduleOnce(() => {
                        if (!self._maskclick) {
                            self.openFinished = false;
                            self.moveToIcon();
                        }
                    }, 1);
                }
            }
        });
    },

    onDestroy() {
        cc._needShowDrop = false;
        Bsc_ED.removeObserver(this);
    },

    // testHongbao() {
    //     let id = [1004, 1001][Math.floor(Math.random() * 2)];
    //     let cnt = Math.floor(Math.random() * 10000);
    //     let msg = { itemListList: [{ itemDataId: id, num: cnt }] };
    //     this.initData(msg);
    // },


    initData(msg) {
        let itemlist = msg.itemListList;
        if (itemlist.length == 0) {
            return;
        }
        this.openFinished = false;
        this.moveNode.setPosition(0, 0);
        this.moveNode.setScale(1, 1);
        this.hbPic.active = false;
        this.hbSpine.node.active = false;
        this.moneyNode.active = false;
        this.goldNode.active = false;
        if (itemlist[0].itemDataId == 1004 || itemlist[0].itemDataId == 1099) {
            this.aniName = 'hongbaoquan';
            cc.find('label/cnt', this.moneyNode).getComponent(cc.Label).string = (itemlist[0].num / 100).toString().replace('.', '/');
            this.moneyNode.active = true;
            this.sound_path = money_sound;
        }
        else if (itemlist[0].itemDataId == 1001) {
            this.aniName = 'jinbi';
            cc.find('cnt', this.goldNode).getComponent(cc.Label).string = 'x' + itemlist[0].num;
            this.goldNode.active = true;
            this.sound_path = gold_sound;
        }
        this.bagNode.opacity = 255;
        this.bagNode.active = true;
        this.starLZ.resetSystem();
        this.bagLZ.resetSystem();
        this._close = false;
        this.hbSpine.node.active = true;
        this.hbSpine.setAnimation(0, 'chuxian', false);
        //this.scheduleOnce(this.autoClose, 2);//2秒不点击自动打开
        // this.scheduleOnce(function () {
        //     this.hbSpine.node.active = true;
        //     this.hbSpine.setAnimation(0, 'chuxian', false);
        // }.bind(this), this.bagLZ.duration);

    },

    autoClose() {
        if (!this._close) {
            this.hbSpine.node.active = true;
            this.hbSpine.clearTrack(0);
            this.hbSpine.setAnimation(0, this.aniName, false);
        }
    },

    clickOpen(event) {
        // hall_audio_mgr.com_btn_click();
        // this._close = true;
        // this.hbSpine.node.active = true;
        // this.hbSpine.clearTrack(0);
        // this.hbSpine.setAnimation(0, this.aniName, false);
    },

    clickMask() {
        if (!this.openFinished)
            return;
        this._maskclick = true;
        this.openFinished = false;
        let self = this;
        // if (this.aniName == 'maomiwujiang')
        //     this.bagNode.runAction(cc.sequence(cc.fadeOut(0.5), cc.callFunc(() => { self.hbSpine.clearTrack(0); self.bagNode.active = false })));
        // else
        //     this.moveToIcon();
        this.moveToIcon();
    },

    moveToIcon() {
        cc._needShowDrop = false;
        const time = 1;
        let self = this;
        // let move = cc.moveTo(time, this.luckyBtn.position).easing(cc.easeExponentialOut());
        // let scale = cc.scaleTo(time, 0, 0);
        // let call = cc.callFunc(() => { self.hbSpine.clearTrack(0); self.bagNode.active = false; });
        // let spawn = cc.spawn(move, scale);
        // let action = cc.sequence(spawn, call);
        // this.moveNode.runAction(action);
        cc.tween(this.moveNode)
            .to(time, { position: { value: this.luckyBtn.position, easing: 'expoInOut' }, scale: 0})
            .call(() => { self.hbSpine.clearTrack(0); self.bagNode.active = false; })
            .start();
    },

    // update (dt) {},
    onEventMessage: function (event, data) {
        switch (event) {
            case Bsc_Event.Drop_Reward:
                cc._needShowDrop = true;
                if (!cc._pauseLMAni)
                    this.initData(data);
                else
                    this._pauseData = data;
                break;
        }
    },

    update(dt) {
        if (this._pauseData && !cc._pauseLMAni) {
            this.initData(this._pauseData);
            this._pauseData = null;
        }
    },
});
