var pai3d_value = require("jlmj_pai3d_value");
cc.Class({
    extends: cc.Component,

    properties: {
        chi_3_optionp:cc.Node,
        zong_layout:cc.Layout,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad:function() {
        this.chiList = [];
    },

    setChiNode:function (chiList, callback) {
        var cur_id = 0;
        this.chiList = [];
        this._clickCallBack = callback;
        for(var idx in chiList){
            var chi_data = chiList[idx];
            if(chi_data){
                this.chiList[cur_id] = chi_data;
                var chi = cc.instantiate(this.chi_3_optionp);
                this._setOptionShow(chi, chi_data);
                this.zong_layout.node.addChild(chi);
                chi.idx = cur_id;
                chi.y = 0;
                cur_id++;
            }
        }
    },
    onClickOption: function (event,custom) {
        if( event.type != "touchend" ){
            return;
        }
        //根据点击的牌型获取牌数据
        var idx = event.target.idx;
        var chi_data = this.chiList[idx];
        chi_data.idx = idx;

        this._clickCallBack(chi_data);
        this.close();
    },
    /**
     * 设置吃的显示
     * @param  option 吃牌控件
     * @param  chiList  吃牌数据
     */
    _setOptionShow:function(option,chiList)
    {
        option.active = true;
        for(var i = 0; i < chiList.length; i++){
            var sprite = option.getChildByName('New Sprite_' + (i+1)).getChildByName('value_' + i);
            if(sprite){
                sprite.parent.active = true;
                this._setValues(sprite,chiList[i]);
            }
        }
    },
    /**
     * 设置麻将的显示
     * @param sprite    需要设置的精灵
     * @param value     麻将的值
     */
    _setValues:function(sprite,value){
        var res_pai = cc.find('Canvas/mj_res_pai');
        if(!res_pai){
            return;
        }

        this.atlas = res_pai.getComponent('mj_res_pai').majiangpai_new;
        var _spriteFrame= this.atlas.getSpriteFrame(pai3d_value.spriteFrame["_"+value]);
        sprite.getComponent(cc.Sprite).spriteFrame = _spriteFrame;
    },

    close:function () {
        this.chiList = [];
        this.zong_layout.node.removeAllChildren(true);
        cc.dd.UIMgr.closeUI(this.node);
    }
    //start () {},

    // update (dt) {},
});
