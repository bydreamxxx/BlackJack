cc.Class({
    extends: cc.Component,

    properties: {
        playername: cc.Label,
        special: cc.Sprite,
        specialSprite: [cc.SpriteFrame],

        bgNode: cc.Node,
        coin: cc.Label,
    },

    //初始化玩家数据信息
    initPlayerInfo: function(player, idx, isGold){
        this.playerData = player;

        //名字
        this.playername.string = (player.name.length > 6 ? cc.dd.Utils.substr(player.name, 0 , 6) : player.name) + ':';
        this.bgNode.active = idx % 2;
        if(player.isMin || player.isMax){
            this.special.node.active = true;
            if(player.isMin){
                this.special.spriteFrame = this.specialSprite[0];
            }else{
                this.special.spriteFrame = this.specialSprite[1];
            }
        }else{
            this.special.node.active = false;
        }
        this.coin.string = isGold ? player.sum : parseFloat(player.sum / 100).toFixed(2);
    },
});
