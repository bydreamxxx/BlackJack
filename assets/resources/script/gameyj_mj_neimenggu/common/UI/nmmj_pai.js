var pai3d_value = require("jlmj_pai3d_value");


var nmmj_Pai = cc.Class({
    extends: require('jlmj_pai'),

    properties: {
        atlasValue: cc.SpriteAtlas,
        atlasValue_2d_blue: cc.SpriteAtlas,
        atlasValue_2d_green: cc.SpriteAtlas,
        atlasValue_2d_yellow: cc.SpriteAtlas,
        atlas_2d_blue:cc.SpriteAtlas,
        atlas_2d_green:cc.SpriteAtlas,
        atlas_2d_yellow:cc.SpriteAtlas,
        atlas_2d:{default:null, type:cc.SpriteAtlas, override:true, visible:false},
    },

    setFrameCfg: function (cfg) {
        let use2D = cc.sys.localStorage.getItem(cc.dd.user.id + '_chifeng_use2D');
        if(!cc.dd.mj_current_2d){
            cc.dd.mj_current_2d = cc.dd._.isNull(use2D) ? 'false' : use2D;
        }

        // if(cc.dd.mj_change_2d_next_time){
        //     this.frame.spriteFrame = cc.dd.mj_current_2d === 'true' ? this.atlas_2d_blue.getSpriteFrame(cfg.spriteFrame) : this.atlas.getSpriteFrame(cfg.spriteFrame);
        // }else{
        //     this.frame.spriteFrame = use2D === 'true' ? this.atlas_2d_blue.getSpriteFrame(cfg.spriteFrame) : this.atlas.getSpriteFrame(cfg.spriteFrame);
        // }

        if(use2D == 'true'){
            let pai2D = cc.sys.localStorage.getItem(cc.dd.user.id + '_chifeng_pai2D');
            if(pai2D == 'green') {
                this.frame.spriteFrame = this.atlas_2d_green.getSpriteFrame(cfg.spriteFrame);
            }else if(pai2D == 'yellow'){
                this.frame.spriteFrame = this.atlas_2d_yellow.getSpriteFrame(cfg.spriteFrame);
            }else{
                this.frame.spriteFrame = this.atlas_2d_blue.getSpriteFrame(cfg.spriteFrame);
            }
        }else{
            this.frame.spriteFrame = this.atlas.getSpriteFrame(cfg.spriteFrame);
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

        this._isKaipai = false;

    },

    /**
     * 设置牌的值
     * @param value
     */
    setValue: function (value) {
        let use2D = cc.sys.localStorage.getItem(cc.dd.user.id + '_chifeng_use2D');
        if(use2D == 'true'){
            let pai2D = cc.sys.localStorage.getItem(cc.dd.user.id + '_chifeng_pai2D');
            if(pai2D == 'green') {
                this.value.spriteFrame = this.atlasValue_2d_green.getSpriteFrame(pai3d_value.spriteFrame["_"+value]);
            }else if(pai2D == 'yellow'){
                this.value.spriteFrame = this.atlasValue_2d_yellow.getSpriteFrame(pai3d_value.spriteFrame["_"+value]);
            }else{
                this.value.spriteFrame = this.atlasValue_2d_blue.getSpriteFrame(pai3d_value.spriteFrame["_" + value]);
            }
        }else{
            this.value.spriteFrame = this.atlasValue.getSpriteFrame(pai3d_value.spriteFrame["_"+value]);
        }
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
                idNode.scaleX = this.value.node.scaleX;
                idNode.scaleY = this.value.node.scaleY;
            }
            this._testIDTTF.string = value;
        }

        this.cardId = value;
    },
});

module.exports = nmmj_Pai;