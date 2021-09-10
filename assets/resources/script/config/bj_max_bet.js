var data_bj_max_bet =
{
    items:
    [
      { key:101,maxbet:"1000;2000" },
      { key:102,maxbet:"1000;2000" },
      { key:103,maxbet:"1000;2000" },
      { key:104,maxbet:"1000;2000" },
      { key:201,maxbet:"1000;2000" },
      { key:202,maxbet:"1000;2000" },
      { key:203,maxbet:"1000;2000" },
      { key:204,maxbet:"1000;2000" }
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

module.exports=data_bj_max_bet;