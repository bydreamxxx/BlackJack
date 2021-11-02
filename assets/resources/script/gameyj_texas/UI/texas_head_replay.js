/** 
 * Created by luke on 2019/2/27
*/
const cardPositon = [[54.08, 95.04, 136, 176.96, 217.92], [-165.8, -135, -104.2, -73.4, -42.6], [-165.8, -135, -104.2, -73.4, -42.6], [84.5, 115.3, 146.1, 176.9, 207.7], [84.5, 115.3, 146.1, 176.9, 207.7]];
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._cardnode = cc.find('card', this.node);
        this._icon = cc.find('head/mask/icon', this.node).getComponent(cc.Sprite);
        this._gold = cc.find('head/gold', this.node).getComponent(cc.Label);
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
            for(var i =0; i <= 1; i++){
                var str = "card" + i
                var card =  cc.dd.Utils.seekNodeByName(this._cardnode, str)
                if(card){
                    var pic = cc.dd.Utils.seekNodeByName(card, "pic1").getComponent(cc.Sprite)
                    var gray = cc.Material.getBuiltinMaterial('2d-gray-sprite')
                    pic.setMaterial(0,gray)
                }
            }
            var startNode = cc.find('card0', this._cardnode);
            var endNode = null;
            for (var i = 0; i < this._cardnode.children.length; i++) {
                if (!this._cardnode.children[i].active)
                    break;
                //this._cardnode.children[i].getChildByName('beimian').active = true;
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
            for(var i =0; i <= 1; i++){
                var str = "card" + i
                var card =  cc.dd.Utils.seekNodeByName(this._cardnode, str)
                if(card){
                    var pic = cc.dd.Utils.seekNodeByName(card, "pic1").getComponent(cc.Sprite)
                    var gray = cc.Material.getBuiltinMaterial('2d-sprite')
                    pic.setMaterial(0,gray)
                }
            }

        }
    },

    //显示牌和类型
    showCardType(type, iswin) {
        var splist = cc.find('Canvas').getComponent('sh_replay').type_splist_gray;
        if (iswin)
            splist = cc.find('Canvas').getComponent('sh_replay').type_splist;
        cc.find('type/type', this.node).getComponent(cc.Sprite).spriteFrame = splist[type - 1];
        cc.find('type', this.node).active = true;
    },
    hideCardType() {
        cc.find('type/type', this.node).getComponent(cc.Sprite).spriteFrame = null;
        cc.find('type', this.node).active = false;
    },

    showDipai() {
        for (var i = 0; i < this._cardnode.children.length; i++) {
            this._cardnode.children[i].getChildByName('beimian').active = false;
        }
    },

    //喊话
    say(str) {
        cc.find('say/lbl', this.node).getComponent(cc.Label).string = str;
        this.node.getComponent(cc.Animation).play('say_replay');
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

    updatePlayerUI(view, data) {
        if (!this._cardnode) {
            this._cardnode = cc.find('card', this.node);
            this._icon = cc.find('head/mask/icon', this.node).getComponent(cc.Sprite);
            this._gold = cc.find('head/gold', this.node).getComponent(cc.Label);
        }
        var cardnode = this._cardnode;
        for (var j = 0; j < 5; j++) {
            cardnode.children[j].stopAllActions();
            if (j < data.handPoker.length) {
                this.setPokerBack(cardnode.children[j], data.handPoker[j]);
                if (view == 0) {
                    cardnode.children[j].scaleX = 0.64;
                    cardnode.children[j].scaleY = 0.64;
                }
                else {
                    cardnode.children[j].scaleX = 0.5;
                    cardnode.children[j].scaleY = 0.5;
                }
                cardnode.children[j].angle = 0;
                if (view == 1 || view == 2)
                    cardnode.children[j].setPosition(cardPositon[view][5 - data.handPoker.length + j], 0);
                else
                    cardnode.children[j].setPosition(cardPositon[view][j], 0);
                cardnode.children[j].active = true;
            }
            else {
                cardnode.children[j].active = false;
            }
        }
        if (data.isDiscard)//是否弃牌
            this.showDiscard(true);
        else {
            this.showDiscard(false);
            for (var j = 1; j < 5; j++) {
                if (j < data.handPoker.length) {
                    cc.find('beimian', cardnode.children[j]).active = false;
                }
            }
        }
        if (data.allBet > 0) {//总下注
            this.setAllBet(data.allBet);
            cc.find('bet', this.node).active = true;
        }
        else
            cc.find('bet', this.node).active = false;

        var score = cc.find('score', this.node);
        if (data.resultScore != null) {
            if (data.resultScore < 0) {
                cc.find('win', this.node).active = false;
                score.getComponent(cc.Label).font = cc.find('Canvas').getComponent('sh_replay').result_fonts[1];
            }
            else {
                score.getComponent(cc.Label).font = cc.find('Canvas').getComponent('sh_replay').result_fonts[0];
                cc.find('win', this.node).active = true;
                if (data.cardtype) {
                    cc.find('win/card_di', this.node).active = true;
                    cc.find('win/card_di', this.node).getComponent(sp.Skeleton).clearTracks();
                    cc.find('win/card_di', this.node).getComponent(sp.Skeleton).setAnimation(0, '5', true);
                }
                else {
                    cc.find('win/card_di', this.node).getComponent(sp.Skeleton).clearTracks();
                    cc.find('win/card_di', this.node).active = false;
                }
            }
            score.getComponent(cc.Label).string = ':' + Math.abs(data.resultScore);
            score.active = true;
            if (data.cardtype) {
                this.showCardType(data.cardtype, data.resultScore > 0);
            }
            else {
                this.hideCardType();
            }
        }
        else {
            score.active = false;
            cc.find('win', this.node).active = false;
            this.hideCardType();
        }
    },

    initPlayerUI(view, data) {
        this.updatePlayerUI(view, data);
        cc.dd.SysTools.loadWxheadH5(this._icon, data.headUrl);
        this.node.active = true;
    },


    //背面牌
    setPokerBack(node, cardValue) {
        cc.find('Canvas').getComponent('sh_replay').setPokerBack(node, cardValue);
    },
    // update (dt) {},
});
