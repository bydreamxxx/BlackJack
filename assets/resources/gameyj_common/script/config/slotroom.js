var data_slotroom =
{
    items:
    [
      { key:10101,play_sub_type:101,room_id:1,enter_need_gold:50000,bet_min:10,bet_max:50,bet_order:"10;20;30;40;50",line:9,line_order:"1;2;3;4;5;6;7;8;9",line_comb_num:1,line_comb_order:"9",name:"上梁山-普通场",bet_name:"10～50",normal_limit:100,bibei_limit:2000,robot_win:10000,normal_bid:"90,102",min_bid:"5,103" },
      { key:10102,play_sub_type:101,room_id:2,enter_need_gold:200000,bet_min:100,bet_max:500,bet_order:"100;200;300;400;500",line:9,line_order:"1;2;3;4;5;6;7;8;9",line_comb_num:1,line_comb_order:"9",name:"上梁山-精英场",bet_name:"100～500",normal_limit:100,bibei_limit:20000,robot_win:10000,normal_bid:"90,102",min_bid:"5,103" },
      { key:10103,play_sub_type:101,room_id:3,enter_need_gold:1500000,bet_min:1000,bet_max:5000,bet_order:"1000;2000;3000;4000;5000",line:9,line_order:"1;2;3;4;5;6;7;8;9",line_comb_num:1,line_comb_order:"9",name:"上梁山-土豪场",bet_name:"1000～5000",normal_limit:100,bibei_limit:200000,robot_win:10000,normal_bid:"90,102",min_bid:"5,103" },
      { key:10104,play_sub_type:101,room_id:4,enter_need_gold:5000000,bet_min:5000,bet_max:25000,bet_order:"5000;10000;15000;20000;25000",line:9,line_order:"1;2;3;4;5;6;7;8;9",line_comb_num:1,line_comb_order:"9",name:"上梁山-至尊场",bet_name:"5000～25000",normal_limit:100,bibei_limit:1000000,robot_win:10000,normal_bid:"90,102",min_bid:"5,103" },
      { key:10201,play_sub_type:102,room_id:1,enter_need_gold:50000,bet_min:1,bet_max:100,bet_order:"1;5;10;15;20;50;100",line:30,line_order:"1;3;2;5;4;8;9;228;25;103;150;206;47;215;38;135;118;227;26;168;85;106;147;186;67;72;181;177;76;194",line_comb_num:1,line_comb_order:"30",name:"财神到-普通场",bet_name:"1～100",normal_limit:0,bibei_limit:0,robot_win:0,normal_bid:"",min_bid:"" },
      { key:10202,play_sub_type:102,room_id:2,enter_need_gold:200000,bet_min:10,bet_max:1000,bet_order:"10;50;100;150;200;500;1000",line:30,line_order:"1;3;2;5;4;8;9;228;25;103;150;206;47;215;38;135;118;227;26;168;85;106;147;186;67;72;181;177;76;194",line_comb_num:1,line_comb_order:"30",name:"财神到-精英场",bet_name:"10～1000",normal_limit:0,bibei_limit:0,robot_win:0,normal_bid:"",min_bid:"" },
      { key:10203,play_sub_type:102,room_id:3,enter_need_gold:1500000,bet_min:100,bet_max:10000,bet_order:"100;500;1000;1500;2000;5000;10000",line:30,line_order:"1;3;2;5;4;8;9;228;25;103;150;206;47;215;38;135;118;227;26;168;85;106;147;186;67;72;181;177;76;194",line_comb_num:1,line_comb_order:"30",name:"财神到-土豪场",bet_name:"100～10000",normal_limit:0,bibei_limit:0,robot_win:0,normal_bid:"",min_bid:"" },
      { key:10204,play_sub_type:102,room_id:4,enter_need_gold:5000000,bet_min:1000,bet_max:100000,bet_order:"1000;5000;10000;15000;20000;50000;100000",line:30,line_order:"1;3;2;5;4;8;9;228;25;103;150;206;47;215;38;135;118;227;26;168;85;106;147;186;67;72;181;177;76;194",line_comb_num:1,line_comb_order:"30",name:"财神到-至尊场",bet_name:"1000～100000",normal_limit:0,bibei_limit:0,robot_win:0,normal_bid:"",min_bid:"" }
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

module.exports=data_slotroom;