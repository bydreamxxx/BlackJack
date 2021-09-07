var DESIGN_RATIO_PORT = { width: 720.0, height: 1558.0 };
var DESIGN_RATIO_LAND = { width: 1558.0, height: 720.0 };

cc.Class({
    extends: cc.Component,
    properties: {
        
    },

    // use this for initialization
    onLoad: function () {
        var design_ratio = { width: DESIGN_RATIO_LAND.width, height: DESIGN_RATIO_LAND.height };
        var screen_ratio = cc.view.getFrameSize();
        var screen_aspect = screen_ratio.width / screen_ratio.height;
        var design_aspect = design_ratio.width / design_ratio.height;
        if (screen_aspect > design_aspect) {
            var widget = this.node.getComponent(cc.Widget)
            if(widget)
            {
                widget.left = 0 ;
                widget.right = 0;
                
                widget.isAlignLeft = true;
                widget.isAlignRight = true;
                widget.updateAlignment();
            }
            
        } else if (screen_aspect < design_aspect) {
            // this.node.getComponent(cc.Widget).enabled = false;
        }


        ///高度适配
        var screen_aspect =  screen_ratio.height/screen_ratio.width ;
        var design_aspect = design_ratio.height/design_ratio.width;
        if (screen_aspect > design_aspect) {
            var widget = this.node.getComponent(cc.Widget)
            if(widget)
            {
                widget.top = 0 ;
                widget.bottom = 0;
                
                widget.isAlignTop = true;
                widget.isAlignBottom = true;
                widget.updateAlignment();
            }
            
        } else if (screen_aspect < design_aspect) {
            // this.node.getComponent(cc.Widget).enabled = false;
        }
    },


});
