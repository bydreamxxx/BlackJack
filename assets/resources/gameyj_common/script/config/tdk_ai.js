var data_tdk_ai =
{
    items:
    [
      { key:11,bet_rate:5000,ti_rate:2000,gen_rate:3000 },
      { key:12,bet_rate:3000,ti_rate:2000,gen_rate:2000 },
      { key:13,bet_rate:2000,ti_rate:1500,gen_rate:1500 },
      { key:14,bet_rate:1500,ti_rate:1000,gen_rate:1000 },
      { key:15,bet_rate:1000,ti_rate:500,gen_rate:500 },
      { key:21,bet_rate:4000,ti_rate:2500,gen_rate:2000 },
      { key:22,bet_rate:3000,ti_rate:1500,gen_rate:2000 },
      { key:23,bet_rate:2000,ti_rate:1000,gen_rate:1500 },
      { key:24,bet_rate:1000,ti_rate:500,gen_rate:1000 },
      { key:25,bet_rate:500,ti_rate:100,gen_rate:500 },
      { key:31,bet_rate:3000,ti_rate:1500,gen_rate:2000 },
      { key:32,bet_rate:2000,ti_rate:1000,gen_rate:2000 },
      { key:33,bet_rate:1000,ti_rate:500,gen_rate:1000 },
      { key:34,bet_rate:500,ti_rate:100,gen_rate:500 },
      { key:35,bet_rate:100,ti_rate:100,gen_rate:100 }
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

module.exports=data_tdk_ai;