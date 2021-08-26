

var jlmj_audio_path = require("jlmj_audio_path");
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        biaoqingicon: [cc.SpriteFrame]
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        this.biaoqingItme = [1020, 1007, 1008, 1021, 1022, 1023, 1024, 1025];
        this.biaoqingAniArr = [['CZ1', 'CZ2'], ['FQ1', 'FQ2'], ['ZC1', 'ZC2'], ['HB1', 'HB2'], ['PQ1', 'PQ2'], ['SP1', 'SP2'], ['PS1', 'PS2'], ['JQ1', 'JQ2', true]];
    },

    //start () {},
    playeXinBiaoQing: function (idx, parent, startPos, endPos) {
        var id = this.getItemId(idx);
        var magic_prop_ani_node = cc.find('biaoqing_ani_' + id, this.node);
        var ani_node_0 = this.getNewAni(magic_prop_ani_node, startPos, parent);

        var length = Math.sqrt((endPos.x - startPos.x)*(endPos.x - startPos.x) + (endPos.y - startPos.y)*(endPos.y - startPos.y));
        var turn = length > 100 && startPos.x > endPos.x;

        ani_node_0.setScale( turn ? -1 : 1, 1);

        if (this.biaoqingAniArr[id][2]) {
            var ani_node_1 = this.getNewAni(magic_prop_ani_node, endPos, parent);
            ani_node_1.active = false;
            ani_node_0.magic_prop.play_alone = true;
            ani_node_1.magic_prop.play_alone = true;
            ani_node_0.magic_prop.play(this.biaoqingAniArr[id], 0);
            ani_node_1.magic_prop.play(this.biaoqingAniArr[id], 1, id);
        } else {
            ani_node_0.magic_prop.play(this.biaoqingAniArr[id], endPos, id);
        }
    },
    getNewAni: function (ani_node, pos, parent) {
        var new_ani_node = cc.instantiate(ani_node);
        new_ani_node.active = true;
        new_ani_node.parent = parent;
        new_ani_node.setPosition(pos);
        new_ani_node.magic_prop = new_ani_node.getComponent('mj_magic_item');
        return new_ani_node;
    },

    // playeANI0: function playeANI0(event, data) {
    //     this.endANI0();
    //     this.stage1();
    // },
    // endANI0: function endANI0(event) {
    //     this.ani_node_0.active = false;
    //     this.ani_node_0.parent = null;
    //     this.ani_node_0.magic_prop.removeEventListener(dragonBones.EventObject.LOOP_COMPLETE, null, this);
    // },
    // endANI1: function endANI1() {
    //     this.ani_node_1.active = false;
    //     this.ani_node_1.parent = null;
    //     this.ani_node_1.magic_prop.removeEventListener(dragonBones.EventObject.LOOP_COMPLETE, null, this);
    // },
    // stage1: function stage1() {
    //     this.ani_node_1.active = true;
    //     this.ani_node_1.magic_prop.playAnimation(this.biaoqingAniArr[this.id][1], 1);
    //     this.ani_node_1.magic_prop.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.endANI1.bind(this), this);
    //     AudioManager.playSound(jlmj_audio_path.xinbiaoqing_effect[this.id]);
    // },

    /*playeXinBiaoQing:function (idx,parent,startPos,endPos) {
        var magicIcon = new cc.Node("magicIcon");
        var sprite = magicIcon.addComponent(cc.Sprite);
        sprite.spriteFrame =  this.biaoqingicon[this.getItemId(idx)];
        magicIcon.parent = parent;
         magicIcon.setPosition(startPos);
        var time = 1.0;
        var length = Math.sqrt((endPos.x - startPos.x)*(endPos.x - startPos.x) + (endPos.y - startPos.y)*(endPos.y - startPos.y));
        time = (length*1.0 / 1800) > 0.4?(length*1.0 / 1800):0.4;
        var moveTo = cc.moveTo(time, endPos);
        magicIcon.runAction(cc.sequence(
            moveTo,
            cc.callFunc(function () {
                this.playPropEffect(idx,magicIcon);
            }.bind(this))
        ));
    },
     playPropEffect: function (idx,magicIcon) {
        //todo:后续加载对象池
        var id = this.getItemId(idx);
        magicIcon.destroy();
        var magic_prop_ani_node = cc.find('biaoqing_ani_'+id,this.node);
        var magic_prop_ani = magic_prop_ani_node.getComponent(dragonBones.ArmatureDisplay);
        magic_prop_ani.node.active = true;
        magic_prop_ani.playAnimation(this.biaoqingAniArr[id],1);
        this.huangzhuang.removeEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.onPlayerHuangZhuangAniEnd, this);
        this.huangzhuang.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.onPlayerHuangZhuangAniEnd, this);
        AudioManager.playSound(jlmj_audio_path.xinbiaoqing_effect[id]);
    },*/

    getItemId: function (idx) {
        for (var i in this.biaoqingItme) {
            if (this.biaoqingItme[i] == idx) {
                return i;
            }
        }
        return 0;
    }

    // update (dt) {},
});