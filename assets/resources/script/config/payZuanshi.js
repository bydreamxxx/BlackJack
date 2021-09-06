var data_payZuanshi =
{
    items:
    [
      { key:600,rate:6 },
      { key:1200,rate:12 },
      { key:3000,rate:30 },
      { key:10000,rate:100 },
      { key:15000,rate:150 },
      { key:30000,rate:300 }
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

module.exports=data_payZuanshi;