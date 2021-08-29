var data_qka_fish_master_robot =
{
    items:
    [
      { key:1,carry_gold:"0,5000",attack_time:"5,30",attack_interval_time:"1,3",prop_type:"12,1,1000,2,2000,3,100;13,1,1500,2,3000,3,500",sight:"1,5000;2;5000",bet_select:"10055,3000;10056,7000;10057,5000;10058,2000;10059,1000;10060,500;10061,100" },
      { key:2,carry_gold:"5001,50000",attack_time:"5,30",attack_interval_time:"1,2",prop_type:"12,1,2000,2,3000,3,500;13,1,2500,2,4000,3,1000",sight:"1,5000;2;5000",bet_select:"10055,2000;10056,6000;10057,8000;10058,3000;10059,1000;10060,500;10061,100" },
      { key:3,carry_gold:"50001,500000",attack_time:"7,35",attack_interval_time:"1,2",prop_type:"12,1,3000,2,4000,3,500;13,1,3500,2,4500,3,1500",sight:"1,5000;2;5000",bet_select:"10055,3000;10056,5000;10057,7000;10058,5000;10059,3000;10060,500;10061,100" },
      { key:4,carry_gold:"500001,2000000",attack_time:"10,40",attack_interval_time:"1,4",prop_type:"12,1,3000,2,4000,3,1000;13,1,3500,2,4500,3,2000",sight:"1,5000;2;5000",bet_select:"10055,1000;10056,1000;10057,5000;10058,5000;10059,7000;10060,4000;10061,1000" },
      { key:5,carry_gold:"2000001,5000000",attack_time:"10,45",attack_interval_time:"1,4",prop_type:"12,1,3000,2,4000,3,1000;13,1,3500,2,5500,3,2500",sight:"1,5000;2;5000",bet_select:"10055,100;10056,500;10057,2000;10058,5000;10059,5000;10060,7000;10061,5000" },
      { key:6,carry_gold:"5000001,10000000",attack_time:"10,50",attack_interval_time:"1,4",prop_type:"12,1,3000,2,4000,3,1000;13,1,3500,2,5500,3,2500",sight:"1,5000;2;5000",bet_select:"10055,100;10056,500;10057,3000;10058,3000;10059,4000;10060,6000;10061,7000" },
      { key:7,carry_gold:"10000001,-1",attack_time:"10,55",attack_interval_time:"1,4",prop_type:"12,1,3000,2,4000,3,1000;13,1,3500,2,5500,3,2500",sight:"1,5000;2;5000",bet_select:"10055,50;10056,100;10057,1000;10058,2000;10059,3000;10060,5000;10061,7000" }
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

module.exports=data_qka_fish_master_robot;