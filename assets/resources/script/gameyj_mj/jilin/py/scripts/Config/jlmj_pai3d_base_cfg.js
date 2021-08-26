var dd = cc.dd;

var pai3d_base = cc.Class({

    properties: {

    },

    ctor: function () {
        this.shoupai_zhanli_cfg = {};
        this.shoupai_daopai_cfg = {};
        this.shoupai_kaipai_cfg = {};
        this.dapai_cfg = {};
        this.baipai_open_down_cfg = {};
        this.baipai_open_up_cfg = {};
        this.baipai_close_down_cfg = {};
        this.baipai_close_up_cfg = {};
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

        cc.log(this);
    },

    //加载接口,由子类实现
    load_shoupai_zhanli_layout: function (shoupai_zhanli) {},
    load_shoupai_daopai_layout: function (shoupai_daopai) {},
    load_shoupai_kaipai_layout: function (shoupai_kaipai) {},
    load_dapai_layout: function (shoupai_dapai) {},
    load_baipai_open_down_layout: function (baipai_open_down) {},
    load_baipai_open_up_layout: function (baipai_open_up) {},
    load_baipai_close_down_layout: function (baipai_close_down) {},
    load_baipai_close_up_layout: function (baipai_close_up) {},

    /**
     * 加载 手牌-站立 布局
     */
    load_shoupai_zhanli_cfg: function (shoupai_zhanli,zOrderArr) {
        if(shoupai_zhanli.length != 14 && shoupai_zhanli.length != 15 ){
            cc.error("手牌-站立 数目配置错误");
            return;
        }
        shoupai_zhanli.forEach(function (jlmj_pai,idx) {
            if(!jlmj_pai){
                cc.error("手牌-站立 配置错误，idx="+idx);
                return;
            }
            this.shoupai_zhanli_cfg['frame_'+idx] = this.load_frame_cfg(jlmj_pai,zOrderArr[idx]);
            this.shoupai_zhanli_cfg['value_'+idx] = this.load_value_cfg(jlmj_pai);
        },this);
    },

    /**
     * 加载 手牌-倒牌 布局
     */
    load_shoupai_daopai_cfg: function (shoupai_daopai,zOrderArr) {
        if(shoupai_daopai.length != 14){
            cc.error("手牌-倒牌 数目配置错误");
            return;
        }
        shoupai_daopai.forEach(function (jlmj_pai,idx) {
            if(!jlmj_pai){
                cc.error("手牌-倒牌 配置错误，idx="+idx);
                return;
            }
            this.shoupai_daopai_cfg['frame_'+idx] = this.load_frame_cfg(jlmj_pai,zOrderArr[idx]);
        },this);
    },

    /**
     * 加载 手牌-开牌 布局
     */
    load_shoupai_kaipai_cfg: function (shoupai_kaipai,zOrderArr) {
        if(shoupai_kaipai.length != 14){
            cc.error("手牌-开牌 数目配置错误");
            return;
        }
        shoupai_kaipai.forEach(function (jlmj_pai,idx) {
            if(!jlmj_pai){
                cc.error("手牌-开牌 配置错误，idx="+idx);
                return;
            }
            this.shoupai_kaipai_cfg['frame_'+idx] = this.load_frame_cfg(jlmj_pai,zOrderArr[idx]);
            this.shoupai_kaipai_cfg['value_'+idx] = this.load_value_cfg(jlmj_pai);
        },this);
    },

    /**
     * 加载 打牌 布局
     */
    load_dapai_cfg: function (shoupai_dapai,zOrderArr) {
        if(shoupai_dapai.length != 24){
            cc.error("打牌 数目配置错误");
            return;
        }
        shoupai_dapai.forEach(function (jlmj_pai,idx) {
            if(!jlmj_pai){
                cc.error("打牌 配置错误，idx="+idx);
                return;
            }
            this.dapai_cfg['frame_'+idx] = this.load_frame_cfg(jlmj_pai,zOrderArr[idx]);
            this.dapai_cfg['value_'+idx] = this.load_value_cfg(jlmj_pai);
        },this);
    },

    /**
     * 加载 摆牌-打开-下 布局
     */
    load_baipai_open_down_cfg: function (baipai_open_down,zOrderArr) {
        if(baipai_open_down.length != 14 && baipai_open_down.length != 15){
            cc.error("摆牌-打开-下 数目配置错误");
            return;
        }
        baipai_open_down.forEach(function (jlmj_pai,idx) {
            if(!jlmj_pai){
                cc.error("摆牌-打开-下 配置错误，idx="+idx);
                return;
            }
            this.baipai_open_down_cfg['frame_'+idx] = this.load_frame_cfg(jlmj_pai,zOrderArr[idx]);
            this.baipai_open_down_cfg['value_'+idx] = this.load_value_cfg(jlmj_pai);
        },this);
    },

    /**
     * 加载 摆牌-打开-上 布局
     */
    load_baipai_open_up_cfg: function (baipai_open_up,zOrderArr) {
        if(baipai_open_up.length != 14 && baipai_open_up.length != 15){
            cc.error("摆牌-打开-上 数目配置错误");
            return;
        }
        baipai_open_up.forEach(function (jlmj_pai,idx) {
            if(!jlmj_pai){
                cc.error("摆牌-打开-上 配置错误，idx="+idx);
                return;
            }
            this.baipai_open_up_cfg['frame_'+idx] = this.load_frame_cfg(jlmj_pai,zOrderArr[idx]);
            this.baipai_open_up_cfg['value_'+idx] = this.load_value_cfg(jlmj_pai);
        },this);
    },

    /**
     * 加载 摆牌-关闭-下 布局
     */
    load_baipai_close_down_cfg: function (baipai_close_down,zOrderArr) {
        if(baipai_close_down.length != 14){
            cc.error("摆牌-关闭-下 数目配置错误");
            return;
        }
        baipai_close_down.forEach(function (jlmj_pai,idx) {
            if(!jlmj_pai){
                cc.error("摆牌-关闭-下 配置错误，idx="+idx);
                return;
            }
            this.baipai_close_down_cfg['frame_'+idx] = this.load_frame_cfg(jlmj_pai,zOrderArr[idx]);
        },this);
    },

    /**
     * 加载 摆牌-关闭-上 布局
     */
    load_baipai_close_up_cfg: function (baipai_close_up,zOrderArr) {
        if(baipai_close_up.length != 14){
            cc.error("摆牌-关闭-上 数目配置错误");
            return;
        }
        baipai_close_up.forEach(function (jlmj_pai,idx) {
            if(!jlmj_pai){
                cc.error("摆牌-关闭-上 配置错误，idx="+idx);
                return;
            }
            this.baipai_close_up_cfg['frame_'+idx] = this.load_frame_cfg(jlmj_pai,zOrderArr[idx]);
        },this);
    },

    /**
     * 加载麻将底框配置
     */
    load_frame_cfg: function (jlmj_pai, zOrder) {
        var frame_cfg = {};
        frame_cfg.spriteFrame = jlmj_pai.frame.spriteFrame._name;
        frame_cfg.x = jlmj_pai.node.x;
        frame_cfg.y = jlmj_pai.node.y;
        frame_cfg.scaleX = jlmj_pai.node.scaleX;
        frame_cfg.scaleY = jlmj_pai.node.scaleY;
        frame_cfg.skewX = jlmj_pai.node.skewX;
        frame_cfg.skewY = jlmj_pai.node.skewY;
        frame_cfg.zOrder = zOrder;
        return frame_cfg;
    },

    /**
     * 加载麻将值配置
     */
    load_value_cfg: function (jlmj_pai) {
        var value_cfg = {};
        value_cfg.x = jlmj_pai.value.node.x;
        value_cfg.y = jlmj_pai.value.node.y;
        value_cfg.scaleX = jlmj_pai.value.node.scaleX;
        value_cfg.scaleY = jlmj_pai.value.node.scaleY;
        value_cfg.skewX = jlmj_pai.value.node.skewX;
        value_cfg.skewY = jlmj_pai.value.node.skewY;
        value_cfg.rotation = jlmj_pai.value.node.rotation;
        return value_cfg;
    },

});

module.exports = pai3d_base;
