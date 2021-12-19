var data_player_task =
{
    items:
    [
      { key:1,title:"shareTitle",desc:"shareTask",finish_type:1,trigger_num:1,reward_times:1,reward_item:"1001,500",active_num:-1,transition:"gameyj_hall/prefabs/klb_hall_share" },
      { key:2,title:"blackjackTitle",desc:"blackjackTask",finish_type:2,trigger_num:3,reward_times:1,reward_item:"1001,5000",active_num:-1,transition:"" },
      { key:3,title:"TexasHoldemTitle",desc:"TexasHoldemTask",finish_type:2,trigger_num:3,reward_times:1,reward_item:"1001,5000",active_num:-1,transition:"" },
      { key:4,title:"TeenpattiTitle",desc:"TeenpattiTask",finish_type:2,trigger_num:3,reward_times:1,reward_item:"1001,5000",active_num:-1,transition:"" },
      { key:5,title:"RummyTitle",desc:"RummyTask",finish_type:2,trigger_num:3,reward_times:1,reward_item:"1001,5000",active_num:-1,transition:"" }
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

module.exports=data_player_task;