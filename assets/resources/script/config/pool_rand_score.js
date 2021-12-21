var data_pool_rand_score =
{
    items:
    [
      { key:1,pool_id:1,pool_state:3,rand_weight:"2000,1500;3000,8000;20000,350;50000,150" },
      { key:2,pool_id:1,pool_state:2,rand_weight:"2000,1000;3000,8500;20000,350;50000,150" },
      { key:3,pool_id:1,pool_state:1,rand_weight:"2000,500;3000,9000;20000,350;50000,150" },
      { key:4,pool_id:1,pool_state:-1,rand_weight:"3000,8000;20000,1500;50000,350;100000,150" },
      { key:5,pool_id:1,pool_state:-2,rand_weight:"3000,8500;20000,1000;50000,350;100000,150" },
      { key:6,pool_id:1,pool_state:-3,rand_weight:"3000,9000;20000,500;50000,250;100000,150" },
      { key:7,pool_id:2,pool_state:3,rand_weight:"4000,1500;6000,8000;40000,350;100000,150" },
      { key:8,pool_id:2,pool_state:2,rand_weight:"4000,1000;6000,8500;40000,350;100000,150" },
      { key:9,pool_id:2,pool_state:1,rand_weight:"4000,500;6000,9000;40000,350;100000,150" },
      { key:10,pool_id:2,pool_state:-1,rand_weight:"6000,8000;40000,1500;100000,350;200000,150" },
      { key:11,pool_id:2,pool_state:-2,rand_weight:"6000,8500;40000,1000;100000,350;200000,150" },
      { key:12,pool_id:2,pool_state:-3,rand_weight:"6000,9000;40000,500;100000,250;200000,150" },
      { key:13,pool_id:3,pool_state:3,rand_weight:"10000,1500;15000,8000;100000,350;250000,150" },
      { key:14,pool_id:3,pool_state:2,rand_weight:"10000,1000;15000,8500;100000,350;250000,150" },
      { key:15,pool_id:3,pool_state:1,rand_weight:"10000,500;15000,9000;100000,350;250000,150" },
      { key:16,pool_id:3,pool_state:-1,rand_weight:"15000,8000;100000,1500;250000,350;500000,150" },
      { key:17,pool_id:3,pool_state:-2,rand_weight:"15000,8500;100000,1000;250000,350;500000,150" },
      { key:18,pool_id:3,pool_state:-3,rand_weight:"15000,9000;100000,500;250000,250;500000,150" },
      { key:19,pool_id:4,pool_state:3,rand_weight:"20000,1500;30000,8000;200000,350;500000,150" },
      { key:20,pool_id:4,pool_state:2,rand_weight:"20000,1000;30000,8500;200000,350;500000,150" },
      { key:21,pool_id:4,pool_state:1,rand_weight:"20000,500;30000,9000;200000,350;500000,150" },
      { key:22,pool_id:4,pool_state:-1,rand_weight:"30000,8000;200000,1500;500000,350;1000000,150" },
      { key:23,pool_id:4,pool_state:-2,rand_weight:"30000,8500;200000,1000;500000,350;1000000,150" },
      { key:24,pool_id:4,pool_state:-3,rand_weight:"30000,9000;200000,500;500000,250;1000000,150" },
      { key:25,pool_id:5,pool_state:3,rand_weight:"40000,1500;60000,8000;400000,350;1000000,150" },
      { key:26,pool_id:5,pool_state:2,rand_weight:"40000,1000;60000,8500;400000,350;1000000,150" },
      { key:27,pool_id:5,pool_state:1,rand_weight:"40000,500;60000,9000;400000,350;1000000,150" },
      { key:28,pool_id:5,pool_state:-1,rand_weight:"60000,8000;400000,1500;1000000,350;2000000,150" },
      { key:29,pool_id:5,pool_state:-2,rand_weight:"60000,8500;400000,1000;1000000,350;2000000,150" },
      { key:30,pool_id:5,pool_state:-3,rand_weight:"60000,9000;400000,500;1000000,250;2000000,150" }
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