var data_pool_rand_score =
{
    items:
    [
      { key:1,pool_id:1,pool_state:3,rand_weight:"1,1;2,1;3,1" },
      { key:2,pool_id:1,pool_state:2,rand_weight:"1,1;2,1;3,1" },
      { key:3,pool_id:1,pool_state:1,rand_weight:"1,1;2,1;3,1" },
      { key:4,pool_id:1,pool_state:-1,rand_weight:"1,1;2,1;3,1" },
      { key:5,pool_id:1,pool_state:-2,rand_weight:"1,1;2,1;3,1" },
      { key:6,pool_id:1,pool_state:-3,rand_weight:"1,1;2,1;3,1" }
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

module.exports=data_pool_rand_score;