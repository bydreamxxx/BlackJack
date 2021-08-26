var dd = cc.dd;
var pai3d_value = require("jlmj_pai3d_value");



var jlmj_Pai = cc.Class({
    extends: cc.Component,

    statics: {

        /**
         * 构造工厂
         * @returns {Component|*|cc.Component}
         */
        create: function () {
            var res_pai = cc.find('Canvas/mj_res_pai');
            if(!res_pai){
                return null;
            }

            var pai = res_pai.getComponent('mj_res_pai').jlmj_pai;
            var pai_node = cc.instantiate(pai);
            var jlmj_pai = pai_node.getComponent("jlmj_pai");
            if(!jlmj_pai){
                cc.error("麻将牌没有jlmj_pai组件");
            }
            return jlmj_pai;
        },

    },

    properties: {
        frame: { default:null, type:cc.Sprite, tooltip: '麻将框', },
        value: { default:null, type:cc.Sprite, tooltip: '麻将值', },
        ani: { default:null, type:cc.Animation, tooltip: '动画组件'},

        /**
         * id
         */
        _cardId: 0,
        cardId:{
            get: function () {
                return this._cardId;
            },
            set: function (value) {
                this._cardId = value;
            }
        },
        //标记牌的
        mask: { default: null, type: cc.Node, tooltip: "遮罩", },

        atlas: cc.SpriteAtlas,
        atlas_2d:cc.SpriteAtlas,

        tingPaiBiaoji:cc.Node,//听牌标记
        liangzhangbao:cc.Node,//亮掌宝
        hunpai:cc.Node,//混牌
        tuidao:cc.Node,//推倒
    },

    ctor: function () {
        this.cfgArrObj = null;
        this._isTouch = true;
        //保存牌的配置文件对象
        this._pai3dCfg = null;
    },

    setFrameCfg: function (cfg) {
        let use2D = cc.sys.localStorage.getItem(cc.dd.AppCfg.GAME_ID + '_' + cc.dd.user.id + '_use2D');
        if(!cc.dd.mj_current_2d){
            cc.dd.mj_current_2d = cc.dd._.isNull(use2D) ? 'false' : use2D;
        }

        if(cc.dd.mj_change_2d_next_time){
            this.frame.spriteFrame = cc.dd.mj_current_2d === 'true' ? this.atlas_2d.getSpriteFrame(cfg.spriteFrame) : this.atlas.getSpriteFrame(cfg.spriteFrame);
        }else{
            this.frame.spriteFrame = use2D === 'true' ? this.atlas_2d.getSpriteFrame(cfg.spriteFrame) : this.atlas.getSpriteFrame(cfg.spriteFrame);
        }

        this.frame.node.x = cfg.x;
        this.frame.node.y = cfg.y;
        this.frame.node.scaleX = cfg.scaleX;
        this.frame.node.scaleY = cfg.scaleY;
        this.frame.node.skewX = cfg.skewX;
        this.frame.node.skewY = cfg.skewY;
        this.frame.node.rotation = cfg.rotation || 0;
        this.frame.node.zIndex = cfg.zOrder;
        this.frame.node.width = cfg.sizeW;
        this.frame.node.height = cfg.sizeH;
        this.frameCfg = cfg;

    },

    setValueCfg: function (cfg) {
        this.value.node.x = cfg.x;
        this.value.node.y = cfg.y;
        this.value.node.width = cfg.sizeW;
        this.value.node.height = cfg.sizeH;
        this.value.node.scaleX = cfg.scaleX;
        this.value.node.scaleY = cfg.scaleY;
        this.value.node.skewX = cfg.skewX;
        this.value.node.skewY = cfg.skewY;
        this.value.node.rotation = cfg.rotation || 0;
        this.valueCfg = cfg;
    },

    setLiangZhangCfg(cfg){
        if(this.liangzhangbao){
            this.liangzhangbao.x = cfg.x;
            this.liangzhangbao.y = cfg.y;
            this.liangzhangbao.width = cfg.sizeW;
            this.liangzhangbao.height = cfg.sizeH;
            this.liangzhangbao.scaleX = cfg.scaleX;
            this.liangzhangbao.scaleY = cfg.scaleY;
            this.liangzhangbao.skewX = cfg.skewX;
            this.liangzhangbao.skewY = cfg.skewY;
            this.liangzhangbao.rotation = cfg.rotation || 0;
        }
    },

    setHunPaiCfg(cfg){
        if(this.hunpai){
            this.hunpai.x = cfg.x;
            this.hunpai.y = cfg.y;
            this.hunpai.width = cfg.sizeW;
            this.hunpai.height = cfg.sizeH;
            this.hunpai.scaleX = cfg.scaleX;
            this.hunpai.scaleY = cfg.scaleY;
            this.hunpai.skewX = cfg.skewX;
            this.hunpai.skewY = cfg.skewY;
            this.hunpai.rotation = cfg.rotation || 0;
        }
    },

    setTuidaoCfg(cfg){
        if(this.tuidao){
            this.tuidao.x = cfg.x;
            this.tuidao.y = cfg.y;
            this.tuidao.width = cfg.sizeW;
            this.tuidao.height = cfg.sizeH;
            this.tuidao.scaleX = cfg.scaleX;
            this.tuidao.scaleY = cfg.scaleY;
            this.tuidao.skewX = cfg.skewX;
            this.tuidao.skewY = cfg.skewY;
            this.tuidao.rotation = cfg.rotation || 0;
        }
    },

    /**
     * 设置牌的值
     * @param value
     */
    setValue: function (value) {
        this.value.spriteFrame = this.atlas.getSpriteFrame(pai3d_value.spriteFrame["_"+value]);
        if(this.valueCfg){
            this.value.node.width = this.valueCfg.sizeW;
            this.value.node.height = this.valueCfg.sizeH;
        }
        //测试用的
        if(cc.dd.AppCfg.IS_DEBUG  && value>=0){
            if(!this._testIDTTF){
                var idNode = new cc.Node("ID");
                idNode.y = -20;
                this._testIDTTF = idNode.addComponent(cc.Label);
                var outline = idNode.addComponent(cc.LabelOutline);
                outline.color =  cc.Color.WHITE;
                outline.width = 2;
                this._testIDTTF.fontSize = 45;
                idNode.color = cc.Color.BLACK;
                idNode.parent = this.value.node;
            }
            this._testIDTTF.string = value;
        }

        this.cardId = value;
    },

    setCnt: function (cnt) {

    },

    zhanli: function (fCfg) {
        if(fCfg){
            this.value.node.active = false;
            this.setFrameCfg(fCfg);
        }
    },


    daopai: function (fCfg, cfgArrObj) {
        if(fCfg && cfgArrObj){
            this.cfgArrObj = cfgArrObj;
            this.value.node.active = false;
            this.setFrameCfg(fCfg);
        }
    },


    kaipai: function (fCfg,vCfg,cfgArrObj,lCfg,hCfg,tCfg) {
        if(fCfg && vCfg && cfgArrObj){
            this.cfgArrObj = cfgArrObj;
            this.value.node.active = true;
            if(this.mask){
                this.mask.active = false;
            }
            this.setFrameCfg(fCfg);
            this.setValueCfg(vCfg);
            if(lCfg){
                this.setLiangZhangCfg(lCfg);
            }
            if(hCfg){
                this.setHunPaiCfg(hCfg);
            }
            if(tCfg){
                this.setTuidaoCfg(tCfg);
            }
        }
    },

    buhua(fCfg,vCfg, cfgArrObj){
        if(fCfg && vCfg && cfgArrObj) {
            this.cfgArrObj = cfgArrObj;
            this.setFrameCfg(fCfg);
            this.setValueCfg(vCfg);
        }
    },

    clone: function (jlmj_pai) {
        if(!jlmj_pai){
            return;
        }

        this.cardId = jlmj_pai.cardId;

        this.frame.spriteFrame = jlmj_pai.frame.spriteFrame;
        this.frame.node.x = jlmj_pai.frame.node.x;
        this.frame.node.y = jlmj_pai.frame.node.y;
        this.frame.node.scaleX = jlmj_pai.frame.node.scaleX;
        this.frame.node.scaleY = jlmj_pai.frame.node.scaleY;
        this.frame.node.skewX = jlmj_pai.frame.node.skewX;
        this.frame.node.skewY = jlmj_pai.frame.node.skewY;
        this.frame.node.rotation = jlmj_pai.frame.node.rotation || 0;
        this.frame.node.zOrder = jlmj_pai.frame.node.zOrder;
        this.frame.node.width = jlmj_pai.frame.node.width;
        this.frame.node.height = jlmj_pai.frame.node.height;

        this.value.spriteFrame = jlmj_pai.value.spriteFrame;
        this.value.node.x = jlmj_pai.value.node.x;
        this.value.node.y = jlmj_pai.value.node.y;
        this.value.node.scaleX = jlmj_pai.value.node.scaleX;
        this.value.node.scaleY = jlmj_pai.value.node.scaleY;
        this.value.node.skewX = jlmj_pai.value.node.skewX;
        this.value.node.skewY = jlmj_pai.value.node.skewY;
        this.value.node.rotation = jlmj_pai.value.node.rotation || 0;
        this.value.node.width = jlmj_pai.value.node.width;
        this.value.node.height = jlmj_pai.value.node.height;

    },

    setTouchAble: function(enable){
        if(this.isHunPai){
            enable = false;
        }
        this._isTouch = enable;
        this.mask.active = !enable;
        this.mask.getComponent(cc.Sprite).spriteFrame =  this.frame.spriteFrame;
        this.mask.width = this.frame.node.width;
        this.mask.height = this.frame.node.height;
        this.mask.color = cc.color('#000000');
    },

    setTingPai:function (enable) {
        this.tingPaiBiaoji.active = enable;
    },

    setBaoPaiBiaoji: function (biaoji) {
        this.mask.active = biaoji;
        if(biaoji){
            this.mask.getComponent(cc.Sprite).spriteFrame =  this.frame.spriteFrame;
            this.mask.width = this.frame.node.width;
            this.mask.height = this.frame.node.height;
            this.mask.color = cc.color('#C7B42D');
        }
    },

    setSelectedBiaoji: function (biaoji) {
        this.mask.active = biaoji;
        if(biaoji){
            this.mask.getComponent(cc.Sprite).spriteFrame =  this.frame.spriteFrame;
            this.mask.width = this.frame.node.width;
            this.mask.height = this.frame.node.height;
            this.mask.color = cc.color('#000000');
        }
    },

    /**
     * 设置是否触摸
     * @param bool
     */
    setTouch: function( bool ) {
        if(this.isHunPai){
            bool = false;
        }
        this._isTouch = bool;
    },

    isTouch:function (event) {
        if(!this.node.active || !this._isTouch){
            return false;
        }
        if (this.node.getBoundingBoxToWorld().contains(event.touch.getLocation())) {
            return true;
        }
        return false;
    },

    //针对自己手牌，特殊处理
    isTouchDown:function (event) {
        if(!this.node.active || !this._isTouch){
            return false;
        }
        var tmpRect = this.node.getBoundingBoxToWorld();
        tmpRect.height += 40;
        tmpRect.y -= 40;
        if (tmpRect.contains(event.touch.getLocation())) {
            return true;
        }
        return false;
    },

    showLZB(){
        if(this.liangzhangbao){
            this.liangzhangbao.active = true;
        }
    },

    setHunPai(hunPai, needChangeTouchable){
        this.isHunPai = hunPai;
        if(this.hunpai){
            this.hunpai.active = hunPai;
            if(needChangeTouchable){
                this.setTouchAble(true);
            }
        }
    },

    setTuidao(tuidao){
        if(this.tuidao){
            this.tuidao.active = tuidao;
        }
    }
});

module.exports = jlmj_Pai;
