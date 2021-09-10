var data_texas_type_ai =
{
    items:
    [
      { key:1,poker_rate:60,add_value:1,weaken_rate:0 },
      { key:2,poker_rate:80,add_value:5,weaken_rate:10 },
      { key:3,poker_rate:90,add_value:5,weaken_rate:20 },
      { key:4,poker_rate:100,add_value:5,weaken_rate:30 },
      { key:5,poker_rate:85,add_value:6,weaken_rate:30 },
      { key:6,poker_rate:90,add_value:6,weaken_rate:40 },
      { key:7,poker_rate:120,add_value:7,weaken_rate:40 },
      { key:8,poker_rate:120,add_value:8,weaken_rate:50 },
      { key:9,poker_rate:135,add_value:9,weaken_rate:50 },
      { key:10,poker_rate:135,add_value:10,weaken_rate:60 },
      { key:11,poker_rate:30,add_value:5,weaken_rate:0 },
      { key:12,poker_rate:80,add_value:10,weaken_rate:0 }
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

module.exports=data_texas_type_ai;