var data_fishroom =
{
    items:
    [
      { key:13801,enter_need_gold:200,bet_min:2,bet_max:20,room_change:2,scene_change:600,fish_create:"1;2;3;4;5;6;7;8;9;10;11;12;13;14;15;16;17;18;19;20;21;",fish_array:"1;2;3;4;5",play_sub_type:1,fish_cheat:"-3,-2400;-2,-1200;-1,-700;1,500;2,1000;3,2200",fish_table:20 },
      { key:13802,enter_need_gold:10000,bet_min:20,bet_max:200,room_change:20,scene_change:600,fish_create:"1;2;3;4;5;6;7;8;9;10;11;12;13;14;15;16;17;18;19;20;21;",fish_array:"1;2;3;4;5",play_sub_type:1,fish_cheat:"-3,-2400;-2,-1200;-1,-700;1,500;2,1000;3,2200",fish_table:20 },
      { key:13803,enter_need_gold:100000,bet_min:200,bet_max:2000,room_change:200,scene_change:600,fish_create:"1;2;3;4;5;6;7;8;9;10;11;12;13;14;15;16;17;18;19;20;21;",fish_array:"1;2;3;4;5",play_sub_type:1,fish_cheat:"-3,-2400;-2,-1200;-1,-700;1,500;2,1000;3,2200",fish_table:20 },
      { key:13804,enter_need_gold:1000000,bet_min:2000,bet_max:20000,room_change:2000,scene_change:600,fish_create:"1;2;3;4;5;6;7;8;9;10;11;12;13;14;15;16;17;18;19;20;21;",fish_array:"1;2;3;4;5",play_sub_type:1,fish_cheat:"-3,-2400;-2,-1200;-1,-700;1,500;2,1000;3,2200",fish_table:20 },
      { key:13805,enter_need_gold:10000000,bet_min:20000,bet_max:200000,room_change:20000,scene_change:600,fish_create:"1;2;3;4;5;6;7;8;9;10;11;12;13;14;15;16;17;18;19;20;21;",fish_array:"1;2;3;4;5",play_sub_type:1,fish_cheat:"-3,-2400;-2,-1200;-1,-700;1,500;2,1000;3,2200",fish_table:20 }
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

module.exports=data_fishroom;