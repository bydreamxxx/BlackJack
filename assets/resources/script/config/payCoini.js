var data_payCoini =
{
    items:
    [
      { key:500,type:1,gold_num:50000,first_coin:50000,vip_exp:50,first_exp:50 },
      { key:1000,type:2,gold_num:100000,first_coin:100000,vip_exp:100,first_exp:100 },
      { key:3000,type:3,gold_num:300000,first_coin:300000,vip_exp:300,first_exp:300 },
      { key:5000,type:4,gold_num:500000,first_coin:500000,vip_exp:500,first_exp:500 },
      { key:10000,type:5,gold_num:1000000,first_coin:1000000,vip_exp:1000,first_exp:1000 },
      { key:20000,type:6,gold_num:2000000,first_coin:2000000,vip_exp:2000,first_exp:2000 },
      { key:50000,type:7,gold_num:5000000,first_coin:5000000,vip_exp:5000,first_exp:5000 },
      { key:100000,type:8,gold_num:10000000,first_coin:10000000,vip_exp:10000,first_exp:10000 }
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

module.exports=data_payCoini;