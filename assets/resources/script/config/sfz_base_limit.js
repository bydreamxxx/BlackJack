var data_sfz_base_limit =
{
    items:
    [
      { key:0,min:0,max:0,limit:6500 },
      { key:1,min:1,max:9,limit:6500 },
      { key:2,min:10,max:21,limit:2500 },
      { key:3,min:22,max:40,limit:2500 },
      { key:4,min:41,max:60,limit:2500 },
      { key:5,min:61,max:100,limit:3000 },
      { key:6,min:101,max:300,limit:4000 },
      { key:7,min:301,max:500,limit:2000 },
      { key:8,min:501,max:900,limit:5000 },
      { key:9,min:901,max:5000,limit:10000 }
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

module.exports=data_sfz_base_limit;