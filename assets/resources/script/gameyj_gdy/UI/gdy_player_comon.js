cc.Class({
    extends: cc.Component,

    properties: {
        Double_Shun: { default: null, type: dragonBones.ArmatureDisplay, tooltip: '双顺' },
        Single_Shun: { default: null, type: dragonBones.ArmatureDisplay, tooltip: '单顺' },
        DaFried: { default: null, type: dragonBones.ArmatureDisplay, tooltip: '大爆炸' },
        ZhongFried: { default: null, type: dragonBones.ArmatureDisplay, tooltip: '中爆炸' },
        XiaoFried: { default: null, type: dragonBones.ArmatureDisplay, tooltip: '小爆炸' },
    },

    onLoad: function () {

    },

    onDestroy: function () {
    },

    /**
     * 单顺
     * @param parent 父节点
     */
    showSingleSE: function (parent) {
        if (!this.Single_Shun || !parent)
            return;

        var playFinish = function (event) {
            if (event.detail.animationState.name === "danshun") {
                this.Single_Shun.node.active = false;
            }
            this.Single_Shun.removeEventListener(dragonBones.EventObject.COMPLETE, playFinish, this);
        }.bind(this);
        this.Single_Shun.addEventListener(dragonBones.EventObject.COMPLETE, playFinish, this);

        this.Single_Shun.node.active = true;
        this.Single_Shun.node.x = parent.x
        this.Single_Shun.node.y = parent.y;
        var boom = this.Single_Shun.getComponent(dragonBones.ArmatureDisplay);
        boom.playAnimation('danshun', 1);
    },

    /**
     * 双顺
     */
    showDoubleSE: function (parent) {
        if (!this.Double_Shun || !parent)
            return;

        var playFinish = function (event) {
            if (event.detail.animationState.name === "TTS") {
                this.Double_Shun.node.active = false;
            }
            this.Double_Shun.removeEventListener(dragonBones.EventObject.COMPLETE, playFinish, this);
        }.bind(this);
        this.Double_Shun.addEventListener(dragonBones.EventObject.COMPLETE, playFinish, this);

        this.Double_Shun.node.active = true;
        this.Double_Shun.node.x = parent.x
        this.Double_Shun.node.y = parent.y;
        var boom = this.Double_Shun.getComponent(dragonBones.ArmatureDisplay);
        boom.playAnimation('TTS', 1);
        var doubleFinish = function () {
            this.Double_Shun.node.active = false;
        }.bind(this);
        this.scheduleOnce(doubleFinish, 1);
    },

    /**
     * 中小炸弹
     * @param type （1：小类型炸弹；2：中类型炸弹）
     */
    showSmallBomb: function (parent, type) {
        if (!this.XiaoFried || !parent)
            return;
        this.XiaoFried.node.active = true;
        this.XiaoFried.node.x = parent.x
        this.XiaoFried.node.y = parent.y;
        var boom = this.XiaoFried.getComponent(dragonBones.ArmatureDisplay);
        if (type == 1)
            boom.playAnimation('xiao', 1);
        else if (type == 2)
            boom.playAnimation('zhong', 1);
    },

    /**
     * 中炸弹
     */
    showMediumBomb: function () {
        if (!this.ZhongFried) return;
        this.ZhongFried.node.active = true;
        var boom = this.ZhongFried.getComponent(dragonBones.ArmatureDisplay);
        boom.enabled = true;
        boom.playAnimation('zhongda', 1);
        this.playFinish(this.ZhongFried);
    },

    /**
     * 大炸弹
     */
    showBigBomb: function (str) {
        if (!this.DaFried) return;
        this.DaFried.node.active = true;
        var root = cc.find('Canvas/root');
        root.getComponent(cc.Animation).play('rocket_camera_' + str);
        var boom = this.DaFried.getComponent(dragonBones.ArmatureDisplay);
        boom.enabled = true;
        boom.playAnimation('dabaozha', 1);
        var callback = function () {
            this.playFinish(this.DaFried);
        }.bind(this);
        this.scheduleOnce(callback, 0.5);
    },

    /**
     * 地面碎裂动画
     */
    playFinish: function (bone) {
        if (!bone) return;
        var finish = function () {
            cc.find('dilie_zhu', bone.node.parent).getComponent(cc.Animation).off('finished', finish, bone);
            bone.enabled = false;
        }
        cc.find('dilie_zhu', bone.node.parent).getComponent(cc.Animation).on('finished', finish, bone);
        cc.find('dilie_zhu', bone.node.parent).getComponent(cc.Animation).play();
    },

});