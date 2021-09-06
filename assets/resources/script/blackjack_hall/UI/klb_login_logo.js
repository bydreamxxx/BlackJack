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
        if (channel_games && channel_games.loginlogo != '') {
            if(cc._isKuaiLeBaTianDaKeng){
                if(cc._themeStyle == 0) {
                    this.setSpriteFrame(this.logo, this.logoAtlas.getSpriteFrame(channel_games.loginlogo+'_green'));
                }else{
                    this.setSpriteFrame(this.logo, this.logoAtlas.getSpriteFrame(channel_games.loginlogo+'_blue'));
                }
            }else{
                this.setSpriteFrame(this.logo, this.logoAtlas.getSpriteFrame(channel_games.loginlogo));
                if(cc.game_pid == 10004 && this.logo){
                    this.logo.node.scaleX = 1.5;
                    this.logo.node.scaleY = 1.5;
                }
            }
        }else{
            if(cc._themeStyle == 0) {
                this.setSpriteFrame(this.logo, this.logoAtlas.getSpriteFrame('dl_logo_green'));
            }else{
                this.setSpriteFrame(this.logo, this.logoAtlas.getSpriteFrame('dl-logo_blue'));
            }
        }

    },

    start () {

    },

    setSpriteFrame(sprite, spriteFrame){
        if(sprite){
            sprite.node.scaleX = 1;
            sprite.node.scaleY = 1;
            sprite.spriteFrame = spriteFrame;
        }
    },

    setNodeActive(node, active){
        if(node){
            node.active = active;
        }
    },
});
