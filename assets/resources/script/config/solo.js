var data_solo =
{
    items:
    [
      { key:1,odds:380,weight:10000 },
      { key:2,odds:380,weight:10000 },
      { key:3,odds:400,weight:9500 },
      { key:4,odds:400,weight:9500 },
      { key:5,odds:2000,weight:1900 }
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

module.exports=data_solo;