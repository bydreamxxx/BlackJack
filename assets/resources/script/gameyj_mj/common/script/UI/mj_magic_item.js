// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var jlmj_audio_path = require("jlmj_audio_path");
cc.Class({
    extends: cc.Component,

    properties: {
        play_alone: { type: cc.Boolean, default: false, tooltip: '分开播放' },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },

    start() {

    },

    play(aniList, endPos, id) {
        this.id = id;
        this.aniList = aniList;
        this.endPos = endPos;
        this.dragonBone = this.node.getComponent(dragonBones.ArmatureDisplay);
        if (!this.play_alone) {
            this.dragonBone.armature().animation.play(this.aniList[0], 1);
            this.dragonBone.addEventListener(dragonBones.EventObject.COMPLETE, this.playCompleted, this);
        }
        else {
            this.node.active = true;
            this.dragonBone.armature().animation.play(this.aniList[endPos], 1);
            if (endPos == 1) {
                AudioManager.playSound(jlmj_audio_path.xinbiaoqing_effect[this.id]);
            }
            this.dragonBone.addEventListener(dragonBones.EventObject.COMPLETE, this.playCompleted, this);
        }
    },

    playCompleted(event) {
        if (this.play_alone) {
            this.node.destroy();
        }
        else {
            if (event.detail.animationState.name === this.aniList[0]) {
                this.node.setPosition(this.endPos);
                this.dragonBone.armature().animation.play(this.aniList[1], 1);
                AudioManager.playSound(jlmj_audio_path.xinbiaoqing_effect[this.id]);
            }
            else if (event.detail.animationState.name === this.aniList[1]) {
                this.node.destroy();
            }
        }
    },

    // playCompleted() {
    //     this.dragonBone.removeEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.playCompleted, this);
    //     this.node.destroy();
    // },
    // update (dt) {},
});
