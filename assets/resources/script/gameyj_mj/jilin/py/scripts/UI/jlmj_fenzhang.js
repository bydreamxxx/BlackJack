let jlmj_fenzhang = cc.Class({
    extends: cc.Component,

    properties: {
        cards:[cc.Node],//牌
        actNode:cc.Node,
    },

    // use this for initialization
    onLoad: function () {

    },
    initData:function (playerList) {
        this.playerList = playerList;
    },
    /**
     * 获取一张分张的牌
     */
    getPai:function () {
        var card = this._CardList.shift();
        if(card){
            card.active = false;
            if(this._CardList.length<=0){
                setTimeout(function () {
                    this.node.active = false;
                }.bind(this), 300);
            }
        }
    },

    /**
     * 动画
     */
    actEncd:function () {
        this.actNode.active = false;
        this._CardList = [];
        for(var i=0; i<this.cards.length; i++){
            if(this.playerList && i<this.playerList.length){
                this.cards[i].active = true;
                this._CardList.push(this.cards[i]);
            }else{
                this.cards[i].active = false;
            }
        }
    },

    /**
     * 更新
     */
    playAni: function () {
        this.actNode.active = true;
        this._CardList = [];
        for(var i=0; i<this.cards.length; i++){
            this.cards[i].active = false;
        }
        this.node.getComponent(cc.Animation).play('jlmj_fenzhang');
    },
});

module.exports = jlmj_fenzhang;
