
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        if(!cc.sys.isMobile){
            return;
        }
        // var sprite = this.node.getComponent(cc.Sprite);
        // if(sprite){
        //     sprite.enabled = false;
        // }
        // if (cc.director.setClearColor) {
        //     cc.director.setClearColor( cc.Color.WHITE );
        // }
        // var g = this.node.addComponent(cc.Graphics);
        // g.lineWidth = 2;
        // g.strokeColor = cc.hexToColor('#e8e3df');
        // g.moveTo(0,0);
        // g.lineTo(this.node.width,0);
        // g.stroke();
    },

    onDisable: function () {
        if(!cc.sys.isMobile){
            return;
        }
        if (cc.director.setClearColor) {
            cc.director.setClearColor( cc.Color.BLACK );
        }
    },

});
