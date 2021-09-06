var data_br_this_bar_base =
{
    items:
    [
      { key:201,max_banker_num:10,req_banker_min_gold:10000000,continue_banker:6,min_bet_gold:100,robot_bet_max_pre:80,robot_bet_min_pre:50,site_count:8,can_site_min_gold:100000,revenue_pre:2,lottery_gold_pre:10,banker_lottery_rate:50,banker_lottery_count:10,player_lottery_rate:50,player_lottery_count:30,player_lottery_cond:10000 }
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

module.exports=data_br_this_bar_base;