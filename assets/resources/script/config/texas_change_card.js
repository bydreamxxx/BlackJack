var data_texas_change_card =
{
    items:
    [
      { key:20201,cheat_bet_limit:10000,cheat_rate:20 },
      { key:20202,cheat_bet_limit:200000,cheat_rate:20 },
      { key:20203,cheat_bet_limit:400000,cheat_rate:20 },
      { key:20204,cheat_bet_limit:800000,cheat_rate:20 },
      { key:20205,cheat_bet_limit:2000000,cheat_rate:20 },
      { key:50201,cheat_bet_limit:10000,cheat_rate:20 }
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

module.exports=data_texas_change_card;