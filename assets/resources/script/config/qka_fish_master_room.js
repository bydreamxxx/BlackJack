var data_qka_fish_master_room =
{
    items:
    [
      { key:13901,enter_need_gold:0,bet_min:10,bet_max:150,room_change:1,scene_change:420,fish_create:"1;2;3;4;5;6;7;8;9;10;11;12;30;31;32;33;34;35;50;51;80",fish_array:"1;2;3;4;5;6;7;8;9;10;11;12;13;18;50;51;52;53;54;55;56;57;58;59;60;61;62;67;",play_sub_type:1,fish_table:20,max_robot:3,robot_max_win_scale:"1,3",robot_max_time:"5,60",robot_base:"1,5000;2,7000;3,4000;4,1000;5,500;6,100;7,100" },
      { key:13902,enter_need_gold:10000,bet_min:100,bet_max:1500,room_change:10,scene_change:420,fish_create:"1;2;3;4;5;6;7;8;9;10;11;12;30;31;32;33;34;35;50;51;81",fish_array:"1;2;3;4;5;6;7;8;9;10;11;12;13;18;19;50;51;52;53;54;55;56;57;58;59;60;61;62;67;68;",play_sub_type:1,fish_table:20,max_robot:3,robot_max_win_scale:"1,3",robot_max_time:"5,60",robot_base:"1,0;2,3000;3,6000;4,3000;5,1000;6,500;7,100" },
      { key:13903,enter_need_gold:100000,bet_min:1000,bet_max:15000,room_change:100,scene_change:420,fish_create:"1;2;3;4;5;6;7;8;9;10;11;12;30;31;32;33;34;35;36;52;53;82",fish_array:"1;2;3;4;5;6;7;8;9;10;11;12;13;14;15;16;17;19;20;50;51;52;53;54;55;56;57;58;59;60;61;62;63;64;65;66;68;69;",play_sub_type:1,fish_table:20,max_robot:2,robot_max_win_scale:"1,3",robot_max_time:"5,60",robot_base:"1,0;2,0;3,0;4,7000;5,2000;6,500;7,100" },
      { key:13904,enter_need_gold:1000000,bet_min:10000,bet_max:150000,room_change:1000,scene_change:420,fish_create:"1;2;3;4;5;6;7;8;9;10;11;12;30;31;32;33;34;35;36;52;53;83",fish_array:"1;2;3;4;5;6;7;8;9;10;11;12;13;14;15;16;17;20;21;50;51;52;53;54;55;56;57;58;59;60;61;62;63;64;65;66;69;70;",play_sub_type:1,fish_table:20,max_robot:2,robot_max_win_scale:"1,3",robot_max_time:"5,60",robot_base:"1,0;2,0;3,0;4,0;5,8000;6,1000;7,100" }
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

module.exports=data_qka_fish_master_room;