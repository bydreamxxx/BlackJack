var pai3d_left = cc.Class({

    s_pai3d_cfg: null,

    statics: {

        Instance: function () {
            if(!this.s_pai3d_cfg){
                this.s_pai3d_cfg = new pai3d_left();
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
            offsetX:0,
            offsetY:-20,
        };
        //摆牌间隔
        this.baipai_space = {
            x:0,
            y:-8,
        };
        //开牌
        this.kaipai = {
            offsetX:0,
            offsetY:-10,
        };
        var pai_cfg = require('nmmj_pai_cfg_left_2d_yellow');
        this.shoupai_zhanli_cfg = pai_cfg.shoupai_zhanli_cfg;
        this.shoupai_daopai_cfg = pai_cfg.shoupai_daopai_cfg;
        this.shoupai_kaipai_cfg = pai_cfg.shoupai_kaipai_cfg;
        this.dapai_cfg = pai_cfg.dapai_cfg;
        this.baipai_open_down_cfg = pai_cfg.baipai_open_down_cfg;
        this.baipai_open_up_cfg = pai_cfg.baipai_open_up_cfg;
        this.baipai_close_down_cfg = pai_cfg.baipai_close_down_cfg;
        this.baipai_close_up_cfg = pai_cfg.baipai_close_up_cfg;
        this.dapai_cfg_2 = pai_cfg.dapai_cfg_2;
        this.dapai_cfg_3 = pai_cfg.dapai_cfg_3;
        this.huapai_cfg = pai_cfg.huapai_cfg;

    },

});

module.exports = pai3d_left;