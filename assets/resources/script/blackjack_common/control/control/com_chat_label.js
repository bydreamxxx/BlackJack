var IndicatorPos = require('ConstantCfg').IndicatorPos;
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        /**
         * 文字背景框节点
         */
        textBgSp:cc.Sprite,
        /**
         * 文字节点
         */
        textLbl:cc.Label,
        /**
         * 箭头指示标节点
         */
        indicatorNode:cc.Node,
        /**
         * 文字距离文字框左边的距离
         */
        left:20,
        /**
         * 箭头指示标四个方向相对位置,一定按顺序设置（左下，左上，右上，右下）
         */
        indicatorPt_list:{
            default:[],
            type:cc.Vec2,
            tooltip:'将箭头指示标按照左下，左上，右上，右下的顺序设置位置',
        },
    },

    // use this for initialization
    onLoad: function () {

    },

    /**
     * 显示聊天文字框
     * @param text 聊天内容
     * @param pos 聊天文字框箭头指示标四大方位之一
     * @param anchor 文字锚点
     */
    show:function (text, pos, anchor) {
        this.textLbl.string = text;
        if(typeof anchor != 'undefined'){
            this.textLbl.node.setAnchorPoint(anchor);
            if(anchor.x == 1){
                this.textLbl.node.x = -10;
            }else if(anchor.x == 0){
                this.textLbl.node.x = 10;
            }
        }
        if(this.indicatorNode){
           this.setIndicatorPt(pos);
        }
        this.scheduleOnce(function (dt) {
            this.textBgSp.node.width = this.textLbl.node.width+this.left;
        });
    },

    /**
     * 获取指示标位置
     * @param pos  指示标四个方位之一
     */
    setIndicatorPt:function (pos) {
        var idx = 0;
        var flip = cc.v2(1,1);
        switch (pos){
            case IndicatorPos.LEFT_BOTTOM:
                idx = 0;
                flip = cc.v2(1,1);
                break;
            case IndicatorPos.LEFT_TOP:
                flip = cc.v2(1,-1);
                idx = 1;
                break;
            case IndicatorPos.RIGHT_TOP:
                flip = cc.v2(-1,-1);
                idx = 2;
                break;
            case IndicatorPos.RIGHT_BOTTOM:
                flip = cc.v2(-1,1);
                idx = 3;
                break;
            default:
                cc.error('com_chat_label::getIndicatorPt error!');
                return;
        }
        this.indicatorNode.setScale(flip);
        this.indicatorNode.setPosition(this.indicatorPt_list[idx]);
    },

    close:function () {
        this.node.removeFromParent();
        // this.node.destroy();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
