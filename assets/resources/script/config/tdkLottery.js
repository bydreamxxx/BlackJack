var data_tdkLottery =
{
    items:
    [
      { key:4101,buy:"200,0",reward:"90,1;100,2;110,3",reward_min_num:90,init_lottery:1000000 },
      { key:4102,buy:"200,0",reward:"90,1;100,2;110,3",reward_min_num:90,init_lottery:1000000 },
      { key:4103,buy:"200,0",reward:"90,1;100,2;110,3",reward_min_num:90,init_lottery:1000000 },
      { key:4104,buy:"200,0",reward:"90,1;100,2;110,3",reward_min_num:90,init_lottery:1000000 }
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

module.exports=data_tdkLottery;