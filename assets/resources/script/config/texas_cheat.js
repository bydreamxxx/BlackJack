var data_texas_cheat =
{
    items:
    [
      { key:1,roomid:20201,cheat_bet_limit:10000,cheat_rate:0 },
      { key:2,roomid:20201,cheat_bet_limit:10000,cheat_rate:0 },
      { key:3,roomid:20201,cheat_bet_limit:10000,cheat_rate:0 },
      { key:4,roomid:20201,cheat_bet_limit:10000,cheat_rate:0 },
      { key:5,roomid:20202,cheat_bet_limit:200000,cheat_rate:10 },
      { key:6,roomid:20202,cheat_bet_limit:200000,cheat_rate:10 },
      { key:7,roomid:20202,cheat_bet_limit:200000,cheat_rate:10 },
      { key:8,roomid:20202,cheat_bet_limit:200000,cheat_rate:10 },
      { key:9,roomid:20203,cheat_bet_limit:400000,cheat_rate:15 },
      { key:10,roomid:20203,cheat_bet_limit:400000,cheat_rate:15 },
      { key:11,roomid:20203,cheat_bet_limit:400000,cheat_rate:15 },
      { key:12,roomid:20203,cheat_bet_limit:400000,cheat_rate:15 },
      { key:13,roomid:20204,cheat_bet_limit:800000,cheat_rate:20 },
      { key:14,roomid:20204,cheat_bet_limit:800000,cheat_rate:20 },
      { key:15,roomid:20204,cheat_bet_limit:800000,cheat_rate:20 },
      { key:16,roomid:20204,cheat_bet_limit:800000,cheat_rate:20 },
      { key:17,roomid:20205,cheat_bet_limit:2000000,cheat_rate:25 },
      { key:18,roomid:20205,cheat_bet_limit:2000000,cheat_rate:25 },
      { key:19,roomid:20205,cheat_bet_limit:2000000,cheat_rate:25 },
      { key:20,roomid:20205,cheat_bet_limit:2000000,cheat_rate:25 }
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

module.exports=data_texas_cheat;