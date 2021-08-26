/** 
 * Created by luke on 2018/12/10
*/
let com_game_head = require('com_game_head');
cc.Class({
    extends: com_game_head,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._cardnode = cc.find('card', this.node);
        this._super();
    },

    setAllBet(num) {
        cc.find('bet/num', this.node).getComponent(cc.Label).string = this.convertNumToStr(num);
    },

    convertNumToStr(num) {
        if (num < 10000) {
            return num.toString();
        }
        else if (num < 100000000) {
            return Math.round(num / 100) / 100 + '万';
        }
        else {
            return Math.round(num / 1000000) / 100 + '亿';
        }
    },

    //显示弃牌
    showDiscard(show) {
        if (show) {
            cc.dd.ShaderUtil.setGrayShader(this._cardnode);
            var startNode = cc.find('card0', this._cardnode);
            var endNode = null;
            for (var i = 0; i < this._cardnode.children.length; i++) {
                if (!this._cardnode.children[i].active)
                    break;
                this._cardnode.children[i].getChildByName('beimian').active = true;
                //暂时不盖上弃牌
                endNode = this._cardnode.children[i];
            }
            if (!endNode) {
                cc.error('手牌为空,无法显示弃牌');
                return;
            }
            var x0 = startNode.convertToWorldSpaceAR(cc.v2(0, 0)).x;
            var x1 = endNode.convertToWorldSpaceAR(cc.v2(0, 0)).x;
            var x = (x0 + x1) / 2;
            var xd = cc.find('discard', this.node).convertToWorldSpaceAR(cc.v2(0, 0)).x;
            cc.find('discard', this.node).x = cc.find('discard', this.node).x + (x - xd);
            cc.find('discard', this.node).active = true;
        }
        else {
            cc.find('discard', this.node).active = false;
            cc.dd.ShaderUtil.setNormalShader(this._cardnode);
        }
    },

    setCardSprite(sprite) {
        for (var i = 0; i < this._cardnode.children.length; i++) {
            this._cardnode.children[i].getChildByName('beimian').getComponent(cc.Sprite).spriteFrame = sprite;
        }
    },

    //显示牌和类型
    showCardType(sp) {
        for (var i = 0; i < this._cardnode.children.length; i++) {
            this._cardnode.children[i].getChildByName('beimian').active = false;
        }
        cc.find('type/type', this.node).getComponent(cc.Sprite).spriteFrame = sp;
        cc.find('type', this.node).active = true;
    },

    showDipai() {
        for (var i = 0; i < this._cardnode.children.length; i++) {
            this._cardnode.children[i].getChildByName('beimian').active = false;
        }
    },

    stopSay() {
        cc.find('say/lbl', this.node).getComponent(cc.Label).string = '';
        cc.find('say', this.node).active = false;
        this.node.getComponent(cc.Animation).stop();
    },

    //喊话
    say(str) {
        cc.find('say/lbl', this.node).getComponent(cc.Label).string = str;
        this.node.getComponent(cc.Animation).play('say');
    },

    resetUI() {
        this.showDiscard(false);
        this.node.getComponent(cc.Animation).stop();
        cc.find('say', this.node).active = false;
        this.node.getComponentInChildren('sh_timer').setActive(false);
        for (var i = 0; i < this._cardnode.children.length; i++) {
            this._cardnode.children[i].stopAllActions();
            this._cardnode.children[i].active = false;
            this._cardnode.children[i].getChildByName('beimian').active = true;
        }
        cc.find('win/card_di', this.node).getComponent(sp.Skeleton).clearTracks();
        cc.find('win/card_di', this.node).active = false;
        cc.find('win', this.node).active = false;
        cc.find('type', this.node).active = false;
        cc.find('score', this.node).active = false;
        cc.find('bet', this.node).active = false;
    },

    onDisable(){
        this.resetUI();
    },
    // update (dt) {},
});
