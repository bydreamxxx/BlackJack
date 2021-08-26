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
         * 文字离背景框左边的距离
         */
        left:20,
        /**
         * 指示标位置,分别为左下，左上，右上，右下
         */
        indicatorPt_list:[],
        /**
         * 指示标节点
         */
        indicatorNode:cc.Node,
        /**
         * 文字
         */
        textLbl:cc.Label,
    },

    // use this for initialization
    onLoad: function () {

    },

    close:function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
