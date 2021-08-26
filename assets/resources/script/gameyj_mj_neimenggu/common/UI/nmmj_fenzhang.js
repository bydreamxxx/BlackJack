let jlmj_fenzhang = require("jlmj_fenzhang");

cc.Class({
    extends: jlmj_fenzhang,

    /**
     * 更新
     */
    playAni: function () {
        this.actNode.active = true;
        this._CardList = [];
        for(var i=0; i<this.cards.length; i++){
            this.cards[i].active = false;
        }
        this.node.getComponent(cc.Animation).play('nmmj_fenzhang');
    },
});

