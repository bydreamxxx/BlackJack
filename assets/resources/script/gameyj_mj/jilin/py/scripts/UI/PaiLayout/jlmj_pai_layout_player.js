cc.Class({
    extends: cc.Component,

    properties: {
        shoupai_zhanli:     { default: [], type: [require('jlmj_pai')], tooltip: '手牌-站立'},
        shoupai_daopai:     { default: [], type: [require('jlmj_pai')], tooltip: '手牌-倒牌'},
        shoupai_kaipai:     { default: [], type: [require('jlmj_pai')], tooltip: '手牌-开牌'},
        dapai:              { default: [], type: [require('jlmj_pai')], tooltip: '打牌'},
        baipai_open_down:   { default: [], type: [require('jlmj_pai')], tooltip: '摆牌-打开-下'},
        baipai_open_up:     { default: [], type: [require('jlmj_pai')], tooltip: '摆牌-打开-上'},
        baipai_close_down:  { default: [], type: [require('jlmj_pai')], tooltip: '摆牌-关闭-下'},
        baipai_close_up:    { default: [], type: [require('jlmj_pai')], tooltip: '摆牌-关闭-上'},
    },

    // use this for initialization
    onLoad: function () {

    },
});

