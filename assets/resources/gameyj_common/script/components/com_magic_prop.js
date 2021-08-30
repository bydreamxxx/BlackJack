let jlmj_audio_path = require("jlmj_audio_path");

let magic_prop_ids = [1007, 1008, 1036, 1037, 1038, 1020, 1021, 1022, 1023, 1024, 1025, 1039, 1040, 1041, 1042, 1043];
let magic_ani_name = ["fanqie","feiwen","meigui","niesiji","zhadan","chuizi","hongbao","animation","shuipen","pisa","dankong","bianpao","chabei","jiezhi","zhaocaimao","zhuantou"];
let magic_off_pos = [cc.v2(0, 0), cc.v2(0, -30), cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 25), cc.v2(0, 0), cc.v2(0, -25),
cc.v2(0, 55), cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, -50), cc.v2(0, 0), cc.v2(0, -55), cc.v2(0, 0)];
let magic_ani_2_name = ["","","","","","",""];

cc.Class({
    extends: cc.Component,

    properties: {
        magic_icons:[cc.SpriteFrame],
        magic_db_nodes:[cc.Node],
    },

    onLoad () {

    },

    start () {

    },

    /**
     * 播放魔法道具动画
     * @param id
     * @param from_pos
     * @param to_pos
     */
    playMagicPropAni(id,from_pos,to_pos){
        switch (id){
            case 1025:
                this.playJQAni(from_pos,to_pos);
                break;
            default:
                this.playFlyAni(id,from_pos,to_pos);
                break;
        }
    },

    /**
     * 播放飞行动画
     * @param id
     * @param from_pos
     * @param to_pos
     */
    playFlyAni(id,from_pos,to_pos){
        let prop_idx = 0;
        magic_prop_ids.forEach(function (prop_id,idx) {
            if(prop_id == id){
                prop_idx = idx;
            }
        }.bind(this));

        let magicIcon = new cc.Node("magicIcon");
        let sprite = magicIcon.addComponent(cc.Sprite);
        sprite.spriteFrame = this.magic_icons[prop_idx];
        magicIcon.parent = this.node;
        magicIcon.position = from_pos;
        if(from_pos.x>to_pos.x){
            magicIcon.scaleX = -1;
        }

        let time = 0.001 * from_pos.sub(to_pos).mag();
        let moveTo = cc.moveTo(time, to_pos);
        let move_end_func = function () {
            magicIcon.active = false;
            magicIcon.destroy();
            let magic_db_node = cc.instantiate(this.magic_db_nodes[prop_idx]);
            magic_db_node.parent = this.node;
            magic_db_node.active = true;
            if(from_pos.x>to_pos.x && prop_idx == 0){
                magic_db_node.scaleX = -1;
                magic_db_node.position = to_pos.sub(magic_off_pos[prop_idx]);
            }else{
                magic_db_node.position = to_pos.add(magic_off_pos[prop_idx]);
            }

            //if(prop_idx == 7){
                let armatureDisplay = magic_db_node.getComponent(sp.Skeleton);
                armatureDisplay.setAnimation(0,magic_ani_name[prop_idx], false);
                AudioManager.playSound(jlmj_audio_path.xinbiaoqing_effect[prop_idx]);
                let db_end = function () {
                    armatureDisplay.clearTrack(0);
                    magic_db_node.active = false;
                    magic_db_node.removeFromParent(true);
                };
                armatureDisplay.setCompleteListener(db_end);
            /*}else{
                let armatureDisplay = magic_db_node.getComponent(dragonBones.ArmatureDisplay);
                armatureDisplay.playAnimation(magic_ani_name[prop_idx], 1);
                AudioManager.playSound(jlmj_audio_path.xinbiaoqing_effect[prop_idx]);
                let db_end = function () {
                    armatureDisplay.removeEventListener(dragonBones.EventObject.LOOP_COMPLETE, db_end, this);
                    magic_db_node.destroy();
                };
                armatureDisplay.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, db_end, this);
            }*/

        }.bind(this);
        magicIcon.runAction(cc.sequence(
            moveTo
            ,cc.callFunc(move_end_func)
        ));
    },

    /**
     * 播放手枪动画
     * @param from_pos
     * @param to_pos
     */
    playJQAni(from_pos,to_pos){
        let prop_idx = 10;
        let magic_db_node = cc.instantiate(this.magic_db_nodes[prop_idx]);
        magic_db_node.parent = this.node;
        magic_db_node.position = from_pos;
        magic_db_node.active = true;
        if(from_pos.x>to_pos.x){
            magic_db_node.scaleX = -1;
        }
        let armatureDisplay = magic_db_node.getComponent(sp.Skeleton);
        armatureDisplay.setAnimation(0,'qiang', false);
        AudioManager.playSound(jlmj_audio_path.xinbiaoqing_effect[prop_idx]);
        let db_end = function () {
            armatureDisplay.clearTrack(0);
            magic_db_node.active = false;
            magic_db_node.removeFromParent(true);
        };
        armatureDisplay.setCompleteListener(db_end);

        let magic_db_node1 = cc.instantiate(this.magic_db_nodes[prop_idx]);
        magic_db_node1.parent = this.node;
        magic_db_node1.position = to_pos;
        magic_db_node1.active = true;
        let armatureDisplay1 = magic_db_node1.getComponent(sp.Skeleton);
        armatureDisplay1.setAnimation(0,'dankong', false);
        let db_end_1 = function () {
            armatureDisplay1.clearTrack(0);
            magic_db_node1.active = false;
            magic_db_node1.removeFromParent(true);
        };
        armatureDisplay1.setCompleteListener(db_end_1);
    },
});
