var FortuneHallManager = require('FortuneHallManager').Instance();
cc.Class({
    extends: cc.Component,

    properties: {
        handcard_node: cc.Node,
        win_gold: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.type_node = cc.find('type', this.node);
        //this.zupai_armature = cc.find('zupai', this.node).getComponent(dragonBones.ArmatureDisplay);
        this.qz_sp = cc.find('qiangzhuang', this.node).getComponent(cc.Sprite);
        this.bet_sp = cc.find('xiazhu', this.node).getComponent(cc.Sprite);
        this.banker_armature = cc.find('bank_ani', this.node.parent).getComponent(cc.Animation);
        this.banker_ani = cc.find('banker_ani2', this.node.parent).getComponent(cc.Animation);
        this.banker_sp = cc.find('banker', this.node.parent).getComponent(cc.Sprite);
        this.bankdi_sp = cc.find('bank_di', this.node.parent).getComponent(cc.Sprite);
    },

    /**
     * 抢庄返回
     * @param {Number} bet 
     * @param {cc.SpriteFrame} sprite
     */
    bankRet(bet, sprite, soundoff) {
        if (this.qz_sp) {
            this.qz_sp.spriteFrame = sprite;
        }
    },

    //抢庄成功
    bankComp(view) {
        this.banker_armature.node.active = true;
        this.bankdi_sp.node.active = true;
        this.banker_armature.play();
        this.banker_sp.node.active = true;
        this.banker_ani.node.active = true;
        this.banker_ani.getComponent(cc.Animation).play();
    },

    /**
     * 下注返回
     * @param {Number} bet 
     * @param {cc.SpriteFrame} sprite
     */
    betRet(bet, sprite, soundoff) {
        if (this.bet_sp) {
            this.bet_sp.spriteFrame = sprite;
        }
    },

    /**
     * 组牌完成返回
     * @param {Number} type 
     */
    groupRet(type) {
        //this.zupai_armature.playAnimation('yiwancheng', -1);
    },

    autoRet(isAuto) {
        var head_script = this.node.parent.getComponent('com_game_head');
        if(head_script.tuo_guan){
            head_script.tuo_guan.active = isAuto;
        }
    },

    /**
     * 设置头像
     * @param {String} headUrl 
     */
    initHead(headUrl) {
        // if (headUrl.indexOf('.jpg') != -1) {
        //     FortuneHallManager.getRobotIcon(headUrl, function (sprite) {
        //         this.head_sp.spriteFrame = sprite;
        //     }.bind(this));
        // }
        // else {
        //     if (headUrl && headUrl != '') {
        //         cc.dd.SysTools.loadWxheadH5(this.head_sp, headUrl);
        //     }
        // }
    },


    /**
     * 重置ui
     */
    resetUI() {
        this.win_gold.active = false;
        this.win_gold.opacity = 0;
        this.handcard_node && (this.handcard_node.active = false);
        this.type_node && (this.type_node.active = false);
        this.qz_sp && (this.qz_sp.spriteFrame = null);
        this.bet_sp && (this.bet_sp.spriteFrame = null);
        this.banker_armature && (this.banker_armature.node.active = false);
        this.banker_sp && (this.banker_sp.node.active = false);
        this.bankdi_sp && (this.bankdi_sp.node.active = false);
        //this.zupai_armature && (this.zupai_armature.node.active = false);
    },

    showOp() { },//显示操作按钮，子类重写

    /**
     * 显示界面
     * @param {Boolean} isshow 
     */
    showUI(isshow) {
        this.node.active = isshow;
        this.head_node.active = isshow;
    },

    // update (dt) {},
});
