/**
 * Created by yons on 2017/6/11.
 */

var BaiPaiUI = cc.Class({

    statics: {
        create: function (index,type) {
            var baipai_ui = new BaiPaiUI();
            baipai_ui.index = index;
            baipai_ui.type = type;
            return baipai_ui;
        },
    },

    properties: {

        /**
         * 摆牌索引
         */
        _index: 0,
        index: { get: function() { return this._index; }, set: function(value) { this._index = value; }  },

        /**
         * 类型
         */
        _type: 0,
        type: { get: function() { return this._type; }, set: function(value) { this._type = value; }  },

    },

    ctor: function () {
      this.pais = [];
    },

    getPai: function (id) {
        var pai = null;
        this.pais.forEach(function(jlmj_pai){
            if(jlmj_pai.cardId == id){
                pai = jlmj_pai;
            }
        });
        return pai;
    },

    /**
     * 获取摆牌中同类型的牌 
     */
    getPaitype:function (cardID) {
        var arr=[];
        this.pais.forEach(function(jlmj_pai){
            if(Math.floor(jlmj_pai.cardId/4) ==  Math.floor(cardID/4)){
                arr.push(jlmj_pai)
            }
        });
        return arr;
    },
    /**
     * 重置牌的ui
     */
    resetPaiUi: function(baipai_data,pai_creator) {
        this.index = baipai_data.index;
        this.type = baipai_data.type;
        var baipai_length = 0;
        if(baipai_data.isCCG()){
            baipai_length = baipai_data.idAndCnts.length;
            //移除小鸡飞
            // if( baipai_data.ifXiaoJiFlyed() ){
            //     baipai_length -= 1;
            // }

            if( baipai_length <= 2 ) {
                baipai_length = 3;
            }
        }else{
            baipai_length = baipai_data.cardIds.length;
        }
        var isPush = this.pais.length<baipai_length;
        var count = Math.abs(this.pais.length-baipai_length);
        for(var i=0; i<count; i++) {
            if(isPush){
                this.pais.push(pai_creator());
            } else{
                var pai = this.pais.pop();
                pai.node.destroy();
            }
        }
    },

    /**
     * 清理
     */
    clear: function () {
        this.pais.forEach(function (pai) {
            pai.node.destroy();
        });
        this.pais = [];
    },

});

module.exports = BaiPaiUI;