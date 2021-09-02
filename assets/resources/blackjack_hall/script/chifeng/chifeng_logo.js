cc.Class({
    extends: cc.Component,

    properties: {
        gameLogo: cc.Sprite,
        gameLogo_kuaileba: cc.SpriteFrame,
        gameLogo_xiangle: cc.SpriteFrame,
    },

    onLoad() {
        if(cc.game_pid == 2){
            let name = cc.director.getScene().name
            if(name == cc.dd.Define.GameId[cc.dd.Define.GameType.CCMJ_GOLD] || name == cc.dd.Define.GameId[cc.dd.Define.GameType.CCMJ_FRIEND] || name == cc.dd.Define.GameId[cc.dd.Define.GameType.CCMJ_MATCH] || name == 'ccmj_replay_game'){
                this.setSpriteFrame(this.gameLogo, this.gameLogo_kuaileba);
                return;
            }
        }

        if(cc._isKuaiLeBaTianDaKeng){
            this.setSpriteFrame(this.gameLogo, this.gameLogo_kuaileba);
        }else{
            this.setSpriteFrame(this.gameLogo, this.gameLogo_xiangle);
        }
    },

    start() {

    },

    setSpriteFrame(sprite, spriteFrame){
        if(sprite){
            sprite.spriteFrame = spriteFrame;
        }
    },

    setNodeActive(node, active){
        if(node){
            node.active = active;
        }
    },
    // update (dt) {},
});
