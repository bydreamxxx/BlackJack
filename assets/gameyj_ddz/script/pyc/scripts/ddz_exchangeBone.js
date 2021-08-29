cc.Class({
    extends: cc.Component,

    properties: {
        shunshizhen_bones: { type: dragonBones.ArmatureDisplay, default: [] },
        nishizhen_bones: { type: dragonBones.ArmatureDisplay, default: [] },
        paiAtlas: { type: cc.SpriteAtlas, default: null },
    },


    playAni(data) {
        if (data == 'ssz') {
            for (var i = 0; i < this.shunshizhen_bones.length; i++) {
                this.shunshizhen_bones[i].playAnimation('HP', 1);
            }
        }
        else {
            for (var i = 0; i < this.nishizhen_bones.length; i++) {
                this.nishizhen_bones[i].playAnimation('HP', 1);
            }
        }
    },

    setData(cards) {
        this.cardlist = cards;
    },

    showPoker(name) {
        if (this.cardlist && this.cardlist.length) {
            var parent = cc.find('card/' + name, this.node);
            for (var i = 0; i < parent.childrenCount; i++) {
                this.setPoker(parent.children[i], this.cardlist[i]);
            }
        }
    },

    setPoker(prefab, cardValue) {
        var value = Math.floor(cardValue / 10);
        var flower = cardValue % 10;
        var hua_xiao = prefab.getChildByName('hua_xiao');
        var hua_da = prefab.getChildByName('hua_da');
        var num = prefab.getChildByName('num');
        switch (value) {
            case 0:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
            case 14:
            case 16:
            case 11:
            case 12:
            case 13:
                if (flower % 2 == 0) {
                    num.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_r' + value.toString());
                }
                else {
                    num.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_b' + value.toString());
                }
                hua_da.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('hs_' + flower.toString());
                hua_xiao.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('hs_' + flower.toString());
                hua_xiao.active = true;
                break;
            case 17:
                if (flower % 2 == 0) {
                    num.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_r' + value.toString());
                    hua_da.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_jokerda');
                }
                else {
                    num.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_b' + value.toString());
                    hua_da.getComponent(cc.Sprite).spriteFrame = this.paiAtlas.getSpriteFrame('pkp_jokerxiao');
                }
                hua_xiao.active = false;
                break;
        }
    },
});
