var data_qka_fish_master_robot_base =
{
    items:
    [
      { key:1,wait_time:"2,6",init_gold:"0,10000",init_item:"1,0,2,2000,2,0,2,4000",initial_bet:"10055,3000;10056,7000;10057,5000;10058,2000;10059,1000;10060,500;10061,100",robot_id:"1;2;3;4;5;6;7" },
      { key:2,wait_time:"2,6",init_gold:"10001,50000",init_item:"1,0,2,3000,2,0,3,4000",initial_bet:"10055,2000;10056,6000;10057,8000;10058,3000;10059,1000;10060,500;10061,100",robot_id:"1;2;3;4;5;6;7" },
      { key:3,wait_time:"2,6",init_gold:"50001,100000",init_item:"1,0,4,3000,2,0,4,4000",initial_bet:"10055,3000;10056,5000;10057,7000;10058,5000;10059,3000;10060,500;10061,100",robot_id:"1;2;3;4;5;6;7" },
      { key:4,wait_time:"2,6",init_gold:"100001,1000000",init_item:"1,1,5,4000,2,1,5,4000",initial_bet:"10055,1000;10056,1000;10057,5000;10058,5000;10059,7000;10060,4000;10061,1000",robot_id:"1;2;3;4;5;6;7" },
      { key:5,wait_time:"2,6",init_gold:"1000001,5000000",init_item:"1,2,6,4000,2,2,8,4000",initial_bet:"10055,100;10056,500;10057,2000;10058,5000;10059,5000;10060,7000;10061,5000",robot_id:"1;2;3;4;5;6;7" },
      { key:6,wait_time:"2,6",init_gold:"5000001,10000000",init_item:"1,3,8,4000,2,3,10,4000",initial_bet:"10055,100;10056,500;10057,3000;10058,3000;10059,4000;10060,6000;10061,7000",robot_id:"1;2;3;4;5;6;7" },
      { key:7,wait_time:"2,6",init_gold:"10000001,100000000",init_item:"1,4,10,4000,2,4,13,4000",initial_bet:"10055,50;10056,100;10057,1000;10058,2000;10059,3000;10060,5000;10061,7000",robot_id:"1;2;3;4;5;6;7" }
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

module.exports=data_qka_fish_master_robot_base;