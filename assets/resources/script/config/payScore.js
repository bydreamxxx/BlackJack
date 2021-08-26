var data_payScore =
{
    items:
    [
      { key:1000,rate:10 },
      { key:5000,rate:50 },
      { key:10000,rate:100 },
      { key:50000,rate:500 },
      { key:100000,rate:1000 },
      { key:200000,rate:2000 },
      { key:300000,rate:3000 }
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

module.exports=data_payScore;