var data_playerDeco =
{
    items:
    [
      { key:1,resType:1,icon:"img_tx_wu.png",pos:3,posAngle:0 },
      { key:2,resType:2,icon:"effect/0511/toushi_huangguan.csb",pos:2,posAngle:0 },
      { key:3,resType:2,icon:"effect/0511/toushi_huangguan.csb",pos:2,posAngle:0 },
      { key:4,resType:2,icon:"effect/0511/toushi_shaizi.csb",pos:3,posAngle:45 },
      { key:5,resType:2,icon:"effect/0511/toushi_laohuji.csb",pos:2,posAngle:0 },
      { key:6,resType:2,icon:"effect/0511/toushi_zhaocaimao.csb",pos:2,posAngle:0 },
      { key:7,resType:2,icon:"effect_mutil/Common/0511/toushi_aixin.csb",pos:3,posAngle:0 },
      { key:8,resType:2,icon:"effect_mutil/Common/0511/toushi_hudie.csb",pos:3,posAngle:0 },
      { key:9,resType:2,icon:"effect_mutil/Common/0511/toushi_puke.csb",pos:3,posAngle:0 },
      { key:10,resType:2,icon:"effect_mutil/Common/0511/toushi_yu.csb",pos:1,posAngle:0 }
    ],

    /**
     * 查找第一个符合filter的item
     * @param filter
     * @returns {*}
     */
    getItem: function(filter){
        var result = null;
        for(var i=0; i<this.items.length; ++i){
            if(filter(this.items[i])){
                result = this.items[i];
                return result;
            }
        }
        return result;
    },

    /**
     * 查找第一个符合filter的list
     * @param filter
     * @returns {*}
     */
    getItemList: function(filter){
        var list = [];
        this.items.forEach(function (item) {
            if(filter(item)){
                list.push(item);
            }
        });
        return list;
    },
};

module.exports=data_playerDeco;