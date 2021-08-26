var data_mammon_limit =
{
    items:
    [
      { key:-3,normal_limit:720,free_limit:600,free_prewarn_limit:600,free_warn_limit:150,free_times:8,mini_rate:10000 },
      { key:-2,normal_limit:550,free_limit:600,free_prewarn_limit:600,free_warn_limit:150,free_times:8,mini_rate:10000 },
      { key:-1,normal_limit:400,free_limit:600,free_prewarn_limit:600,free_warn_limit:150,free_times:8,mini_rate:10000 },
      { key:1,normal_limit:288,free_limit:600,free_prewarn_limit:600,free_warn_limit:150,free_times:8,mini_rate:6000 },
      { key:2,normal_limit:220,free_limit:600,free_prewarn_limit:600,free_warn_limit:150,free_times:8,mini_rate:4000 },
      { key:3,normal_limit:180,free_limit:600,free_prewarn_limit:600,free_warn_limit:150,free_times:8,mini_rate:2000 }
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

module.exports=data_mammon_limit;