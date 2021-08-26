var pai3d_value = require("jlmj_pai3d_value");
var mj_audio = require('mj_audio');

cc.Class({
    extends: cc.Component,

    properties: {
        paiList: [cc.Node],
    },

    onLoad() {
        this.canUpdate = false;
        this.update_time = 0;
        this.waitTime = 1;
    },

    show(data, tingList, _endCall) {
        this.canUpdate = false;

        var res_pai = cc.find('Canvas/mj_res_pai');
        if (!res_pai) {
            if (this._endCall) {
                this._endCall();
            }
            this.close();
            return;
        }
        var valueRes = res_pai.getComponent('mj_res_pai').majiangpai_new;

        this._endCall = _endCall;

        this.actionList = [];


        for (let i = 0; i < this.paiList.length; i++) {
            if (i >= data.length) {
                this.paiList[i].active = false;
            } else {
                this.paiList[i].active = true;
                let value = this.paiList[i].getChildByName('value');
                value.getComponent(cc.Sprite).spriteFrame = valueRes.getSpriteFrame(pai3d_value.spriteFrame["_" + data[i].id]);
                value.active = false;

                if (tingList.indexOf(data[i].id) != -1) {
                    this.paiList[i].mj_selected = true;
                }
                let node = this.paiList[i].getChildByName('mj_selected');
                node.active = false;

                this.actionList.push(this.paiList[i]);
            }
        }

        this.canUpdate = true;
    },

    update(dt) {
        if (this.canUpdate) {
            if (this.update_time < this.waitTime) {
                this.update_time += dt;
                return;
            }

            if (this.waitTime == 1) {
                this.waitTime = 0.5;
            }

            if (this.actionList.length <= 0) {
                if (this._endCall) {
                    this._endCall();
                }
                this.close();
            } else {
                let pai1 = this.actionList.shift();
                if (pai1) {
                    let anim = pai1.getComponent(cc.Animation);
                    anim.on('finished', () => {
                        if (pai1.mj_selected) {
                            let node = pai1.getChildByName('mj_selected');
                            node.active = true;
                        }
                    });
                    anim.play('mj_turn');
                }

                let pai2 = this.actionList.shift();
                if (pai2) {
                    let anim = pai2.getComponent(cc.Animation);
                    anim.on('finished', () => {
                        if (pai2.mj_selected) {
                            let node = pai2.getChildByName('mj_selected');
                            node.active = true;
                        }
                    });
                    anim.play('mj_turn');
                }
                this.update_time = 0;

                mj_audio.playAduio('draw');


                if (this.actionList.length <= 0) {
                    this.waitTime = 2;
                }
            }
        }
    },

    close: function () {
        this.canUpdate = false;
        this.node.removeFromParent();
        this.node.destroy();
    },
});
