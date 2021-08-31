var game_channel_cfg = require('game_channel');


cc.Class({
    extends: cc.Component,

    properties: {
        logo: cc.Sprite,
        logoAtlas: cc.SpriteAtlas
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var channel_games = game_channel_cfg.getItem(function (item) {
            if (item.channel == cc.game_pid)
                return true;
        });
        if (channel_games && channel_games.halllogo != '') {
            this.setSpriteFrame(this.logo, this.logoAtlas.getSpriteFrame(channel_games.halllogo));
        }else{
            this.setSpriteFrame(this.logo, this.logoAtlas.getSpriteFrame('logo-dt-xlyx'));
        }
    },

    start () {

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
});
