var data_qka_fish_master_vip =
{
    items:
    [
      { key:0,num:1 },
      { key:1,num:1 },
      { key:2,num:2 },
      { key:3,num:2 },
      { key:4,num:2 },
      { key:5,num:3 },
      { key:6,num:3 },
      { key:7,num:3 },
      { key:8,num:3 },
      { key:9,num:3 },
      { key:10,num:3 },
      { key:11,num:3 },
      { key:12,num:3 },
      { key:13,num:3 },
      { key:14,num:3 },
      { key:15,num:3 },
      { key:16,num:3 }
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

module.exports=data_qka_fish_master_vip;