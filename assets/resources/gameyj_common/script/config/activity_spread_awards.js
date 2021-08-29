var data_activity_spread_awards =
{
    items:
    [
      { key:1,gold:1000 },
      { key:2,gold:5000 },
      { key:3,gold:9000 },
      { key:4,gold:100000 },
      { key:5,gold:150000 },
      { key:6,gold:350000 },
      { key:7,gold:435000 },
      { key:8,gold:850000 },
      { key:9,gold:1300000 },
      { key:10,gold:1800000 },
      { key:11,gold:14000000 },
      { key:12,gold:16000000 },
      { key:13,gold:18000000 },
      { key:14,gold:24000000 },
      { key:15,gold:48000000 },
      { key:16,gold:120000000 }
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

module.exports=data_activity_spread_awards;