
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad: function () {

    },

    //播放炸弹特效
    playBombAnimation: function (str) {
        this.node.getComponent(cc.Animation).play('bomb_camera_' + str);
        var bone = cc.find('bomb_ani/ddz_zhadan_ske_' + str, this.node).getComponent(dragonBones.ArmatureDisplay);
        bone.enabled = true;
        var playFinish = function () {
            bone.removeEventListener(dragonBones.EventObject.COMPLETE, playFinish, this);
            bone.playAnimation('zha', 1);
            var finish = function () {
                cc.find('dilie_' + str, bone.node.parent).getComponent(cc.Animation).off('finished', finish, bone);
                bone.enabled = false;
            }
            cc.find('dilie_' + str, bone.node.parent).getComponent(cc.Animation).on('finished', finish, bone);
            cc.find('dilie_' + str, bone.node.parent).getComponent(cc.Animation).play();
        }.bind(this);
        bone.playAnimation('lujing' + str, 1);
        bone.addEventListener(dragonBones.EventObject.COMPLETE, playFinish, this);
    },

    //播放火箭特效
    playRocketAnimation: function (str) {
        this.node.getComponent(cc.Animation).play('rocket_camera_' + str);
        var bone = cc.find('rocket_ani/huojian01_ske', this.node).getComponent(dragonBones.ArmatureDisplay);
        bone.enabled = true;
        var playFinish = function () {
            //bone.removeEventListener(dragonBones.EventObject.COMPLETE, playFinish, this);
            bone.playAnimation('huojianzha', 1);
            bone.scheduleOnce(function () {
                cc.find('dilie', bone.node.parent).getComponent(cc.Animation).play();
                bone.enabled = false;
            }.bind(this), 1);
        }.bind(this);
        bone.playAnimation('huojianfei' + str, 1);
        this.scheduleOnce(playFinish, 0.5);
        //bone.addEventListener(dragonBones.EventObject.COMPLETE, playFinish, this);
    },

    playAni: function (event, data) {
        this.playRocketAnimation(data);
    },

    playBomb: function (event, data) {
        this.playBombAnimation(data);
    },
});
