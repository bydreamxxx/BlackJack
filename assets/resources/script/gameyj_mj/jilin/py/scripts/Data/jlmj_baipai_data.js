/**
 * Created by yons on 2017/6/2.
 */

var pai3d_value = require('jlmj_pai3d_value');
var PaiAnalysts = require('jlmj_pai_analysts').Instance();
const paiType = require('jlmj_gang_pai_type').CardType;

var BaipaiType = cc.Enum({
    CHI:        0,
    PENG:       1,
    DIANGANG:   2,  //点杠
    BAGANG:     3,  //巴杠
    ANGANG:     4,  //暗杠
    _FG:        5,  //风杠
    ZFBG:       7,  //中发白杠
    _19G1:      8,  //1杠
    _19G9:      9,  //9杠
    GU:         10,  //估
    LZB:        11, //亮掌宝
    BUHUA:      12, //补花
    BUHUA:      12, //补花
});

var baipai_type_desArr = [
    "吃",
    "碰",
    "点杠",
    "巴杠",
    "暗杠",
    "风杠",
    "",
    "中发白杠",
    "19杠",
    "估",
    "亮掌",
    "补花",
];

var BaipaiData = cc.Class({

    properties: {

        /**
         * 摆牌索引
         */
        _index: 0,
        index: { get: function() { return this._index; }, set: function(value) { this._index = value; }  },

        /**
         * 麻将索引
         */
        _mj_index: 0,
        mj_index: { get: function() { return this._mj_index; }, set: function(value) { this._mj_index = value; }  },

        /**
         * 类型
         */
        _type: 0,
        type: { get: function() { return this._type; }, set: function(value) { this._type = value; }  },

        /**
         * 下层麻将个数
         */
        _down_pai_num: 0,
        down_pai_num: { get: function() { return this._down_pai_num; }, set: function(value) { this._down_pai_num = value; }  },

        /**
         * 麻将ids
         */
        _cardIds: [],
        cardIds: {  get: function() { return this._cardIds; }, set: function(value) { this._cardIds = value; } },
    },

    ctor: function () {

    },

    isCCG: function () {
        return false;
    },

    /**
     * 删除牌id通过牌id
     * @param id
     */
    removeCardIdById: function( id ) {
        for( var i = 0; i < this.cardIds.length; ++i ) {
            if( this.cardIds[i] == id ) {
                this.cardIds.splice( i, 1 );
                this.down_pai_num -= 1;
                return this.type;
            }
        }
    },

    /**
     * 返回显示数据
     */
    getShowPaiList:function () {
        var idAndCnts = [];
        for(var i in this.cardIds){
            idAndCnts.push({id: this.cardIds[i], cnt: 1});
        }
        return idAndCnts;
    },
    toString: function () {
        var desc = "摆牌idx:"+this.index+" 麻将idx:"+this._mj_index+" 摆牌类型:"+baipai_type_desArr[this.type]+" 下麻将个数:"+this._down_pai_num+" 麻将:"+pai3d_value.descs(this.cardIds);
        return desc;
    },

    equal: function (ids) {
        // var equaled = true;
        // this.cardIds.forEach(function (id) {
        //     if(ids.indexOf(id) == -1){
        //         equaled = false;
        //     }
        // },this);
        // return equaled;


        if(this.cardIds.length!=ids.length){
            return false;
        }
        ids.sort(function (a,b) {
            return a-b;
        });
        this.cardIds.sort(function (a,b) {
            return a-b;
        });
        for(var i=0; i<ids.length; ++i){
            if(ids[i]!=this.cardIds[i]){
                return false;
            }
        }
        return true;
    },

    /**
     * 返回长度
     */
    getLength: function() {
        return this.cardIds.length;
    },

});

/**
 * 长春杠
 * @type {Function}
 */
var JLGData = cc.Class({

    extends: BaipaiData,

    properties: {

        /**
         * 麻将id和次数
         */
        _idAndCnts: [],
        idAndCnts: { get: function() { return this._idAndCnts; }, set: function(value) { this._idAndCnts = value; } },

    },

    ctor: function () {

    },

    /**
     * 删除牌id通过牌id
     * @param id
     */
    removeCardIdById: function( id ) {
        for( var i = 0; i < this.idAndCnts.length; ++i ) {
            if( this.idAndCnts[i].id == id ) {
                this.idAndCnts.splice( i, 1 );
                this.down_pai_num -= 1;
                return this.type;
            }
        }
    },

    isCCG: function () {
        return true;
    },


    /**
     * 获取任意一张小鸡的牌的唯一id
     */
    getXiaoJiId:function () {
        for(var i in this.cardIds){
            if(Math.floor(this.cardIds[i]/4)==paiType.S1){
                return this.cardIds[i];
            }
        }
        return -1;
    },

    /**
     * 获取小鸡的个数
     */
    getXiaoJiCnt: function () {
        for(var i in this.idAndCnts){
            if(Math.floor(this.idAndCnts[i].id/4)==paiType.S1){
               return this.idAndCnts[i].cnt;
            }
        }
    },

    /**
     * 小鸡能不能飞出去
     * @returns {boolean}
     */
    ifXiaoJiFlyed: function () {
        switch (this.type){
            case BaipaiType._19G1:
            case BaipaiType._19G9:
            case BaipaiType.ZFBG:
                return this.idAndCnts.length > 3;
            case BaipaiType._FG:
                return this.idAndCnts.length > 4;
            default:
                return false;
        }
    },

    /**
     * 获取能被显示出来的牌
     * 当小鸡飞出去后 只能显示非小鸡的其他牌
     */
    getShowPaiList:function () {
        //取消小鸡飞
        // if(this.ifXiaoJiFlyed()){
        //     var idAndCnts = [];
        //     this.idAndCnts.forEach(function (idAndCnt) {
        //         if(Math.floor(idAndCnt.id/4)!=paiType.S1){
        //             idAndCnts.push(idAndCnt);
        //         }
        //     });
        //     return idAndCnts;
        // }else {
        //     return this.idAndCnts;
        // }
        return this.idAndCnts;
    },
    /**
     * 排序显示数组
     * @return {string}
     */
    sortArr:function () {
        this.idAndCnts.sort(function (a,b) {
            return a.id-b.id;
        })
    },

    findType:function(cardId){
        for(var i in  this.idAndCnts){
            if(Math.floor(this.idAndCnts[i].id/4) == Math.floor(cardId/4)) {//找到小鸡类型
                return this.idAndCnts[i];
            }
        }
    },
    /**
     * 找到头上有两个以上的幺鸡
     * @return {string}
     */
    findXJTwoCnt:function () {
        for(var i in  this.idAndCnts){
            if(Math.floor(this.idAndCnts[i].id/4) == paiType.S1 && this.idAndCnts[i].cnt>1) {//找到小鸡类型
                return this.idAndCnts[i];
            }
        }
    },

    toString: function () {
        var ids = [];
        this.idAndCnts.forEach(function (idAndCnt) {
            ids.push(idAndCnt.id);
        });
        var desc = "摆牌idx:"+this.index+" 麻将idx:"+this._mj_index+" 摆牌类型:"+baipai_type_desArr[this.type]+" 下麻将个数:"+this._down_pai_num+" 麻将:"+pai3d_value.descs(ids);
        return desc;
    },

    /**
     * 返回长度
     */
    getLength: function() {
        return this.idAndCnts.length;
    },

});

module.exports = {
    BaipaiType:BaipaiType,
    BaipaiData:BaipaiData,
    JLGData:JLGData,
};


