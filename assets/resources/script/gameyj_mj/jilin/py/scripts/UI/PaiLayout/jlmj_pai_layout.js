cc.Class({
    extends: cc.Component,

    properties: {
        layout_down:    { default: null, type: require('jlmj_pai_layout_player'), tooltip: "麻将（下） 配置"},
        layout_right:   { default: null, type: require('jlmj_pai_layout_player'), tooltip: "麻将（右） 配置"},
        layout_up:      { default: null, type: require('jlmj_pai_layout_player'), tooltip: "麻将（上） 配置"},
        layout_left:    { default: null, type: require('jlmj_pai_layout_player'), tooltip: "麻将（左） 配置"},
    },

    // use this for initialization
    onLoad: function () {

    },

});


