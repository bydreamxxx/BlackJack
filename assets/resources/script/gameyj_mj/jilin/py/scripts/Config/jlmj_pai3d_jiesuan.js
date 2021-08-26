var pai3d_base = require('jlmj_pai3d_base_cfg');

var pai3d_jiesuan = cc.Class({

    extends: pai3d_base,

    s_pai3d_cfg: null,

    statics: {

        Instance: function () {
            if(!this.s_pai3d_cfg){
                this.s_pai3d_cfg = new pai3d_jiesuan();
            }
            return this.s_pai3d_cfg;
        },

        Destroy: function () {
            if(this.s_pai3d_cfg){
                this.s_pai3d_cfg = null;
            }
        },

    },

    ctor: function () {
        //摸牌
        this.mopai = {
            offsetX:15,
            offsetY:0,
        };
        //摆牌间隔
        this.baipai_space = {
            x:-10,
            y:0,
        };
    },

    /**
     * 加载所有布局
     */
    load_layout_cfg: function (pai_layout) {
        this.load_shoupai_zhanli_layout(pai_layout.shoupai_zhanli);
        this.load_shoupai_daopai_layout(pai_layout.shoupai_daopai);
        this.load_shoupai_kaipai_layout(pai_layout.shoupai_kaipai);
        this.load_dapai_layout(pai_layout.dapai);
        this.load_baipai_open_down_layout(pai_layout.baipai_open_down);
        this.load_baipai_open_up_layout(pai_layout.baipai_open_up);
        this.load_baipai_close_down_layout(pai_layout.baipai_close_down);
        this.load_baipai_close_up_layout(pai_layout.baipai_close_up);

        cc.log("结算布局配置");
        cc.log(this);
    },

    /**
     * 加载 手牌-站立 布局
     */
    load_shoupai_zhanli_layout: function (shoupai_zhanli) {
        var zOrderArr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
        this.load_shoupai_zhanli_cfg(shoupai_zhanli,zOrderArr);
    },

    /**
     * 加载 摆牌-打开-下 布局
     */
    load_baipai_open_down_layout: function (baipai_open_down) {
        var zOrderArr = [8,9,10,11,12,13,14,15,7,6,5,4,3,2,1];
        this.load_baipai_open_down_cfg(baipai_open_down,zOrderArr);
    },

    /**
     * 加载 摆牌-打开-上 布局
     */
    load_baipai_open_up_layout: function (baipai_open_up) {
        var zOrderArr = [8,9,10,11,12,13,14,15,7,6,5,4,3,2,1];
        this.load_baipai_open_up_cfg(baipai_open_up,zOrderArr);
    },

    //
    load_shoupai_daopai_layout: function (shoupai_daopai) {},
    load_shoupai_kaipai_layout: function (shoupai_kaipai) {},
    load_dapai_layout: function (shoupai_dapai) {},
    load_baipai_close_down_layout: function (baipai_close_down) {},
    load_baipai_close_up_layout: function (baipai_close_up) {},

});

module.exports = pai3d_jiesuan;