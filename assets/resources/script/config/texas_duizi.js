var data_texas_duizi =
{
    items:
    [
      { key:2,rate:6631 },
      { key:3,rate:6876 },
      { key:4,rate:7122 },
      { key:5,rate:7367 },
      { key:6,rate:7610 },
      { key:7,rate:7853 },
      { key:8,rate:8097 },
      { key:9,rate:8340 },
      { key:10,rate:8583 },
      { key:11,rate:8823 },
      { key:12,rate:9064 },
      { key:13,rate:9305 },
      { key:14,rate:9548 }
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

module.exports=data_texas_duizi;