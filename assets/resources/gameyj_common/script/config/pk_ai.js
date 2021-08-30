var data_pk_ai =
{
    items:
    [
      { key:1,add_time:"0,3",color_add:"1,100,500;101,500,1500;501,1000,2000;1001,5000,3800;5001,10000,1700;10001,50000,500",king_add:"1,4,500;5,20,1500;21,40,2000;41,200,3800;201,400,1700;401,2000,500",robot_add_num:"5,5",robot_add:"1,100,5,300;101,500,10,1500;501,2000,100,3000;2001,5000,100,3750;5001,8000,100,2250;8001,10000,10000,750;10001,15000,1000,150;15001,20000,1000,75",robot_add_more:"1,800,1500;2,500,1000;3,300,600;4,100,200;5,50,100",blood_add:"-1,100000,100000,100000,100000,58000,1000;-2,100000,100000,100000,100000,58000,2000;-3,100000,100000,100000,100000,58000,3000;1,100000,100000,100000,100000,58000,1000;2,100000,100000,100000,100000,58000,2000;3,100000,100000,100000,100000,58000,3000",kaipai:"0,1,0;1,2,3000;2,3,5000;3,4,8000;4,-1,10000" },
      { key:2,add_time:"4,6",color_add:"1,10000,500;10001,100000,1500;100001,500000,2000;500001,1000000,3800;1000001,2000000,1700;2000001,5000000,500",king_add:"1,400,500;401,4000,1500;4001,20000,2000;20001,40000,3800;40001,60000,1700;60001,100000,500",robot_add_num:"",robot_add:"",robot_add_more:"",blood_add:"",kaipai:"" },
      { key:3,add_time:"7,9",color_add:"1,10000,400;10001,100000,1000;100001,500000,1500;500001,1000000,4000;1000001,2000000,2500;2000001,5000000,600",king_add:"1,400,400;401,4000,1000;4001,20000,1500;20001,40000,4000;40001,60000,2500;60001,100000,600",robot_add_num:"",robot_add:"",robot_add_more:"",blood_add:"",kaipai:"" },
      { key:4,add_time:"10,12",color_add:"1,10000,0;10001,100000,500;100001,500000,1500;500001,1000000,3500;1000001,2000000,3000;2000001,5000000,1500",king_add:"1,400,0;401,4000,500;4001,20000,1500;20001,40000,3500;40001,60000,3000;60001,100000,1500",robot_add_num:"",robot_add:"",robot_add_more:"",blood_add:"",kaipai:"" },
      { key:5,add_time:"13,15",color_add:"1,10000,400;10001,100000,1000;100001,500000,1500;500001,1000000,4000;1000001,2000000,2500;2000001,5000000,600",king_add:"1,400,400;401,4000,1000;4001,20000,1500;20001,40000,4000;40001,60000,2500;60001,100000,600",robot_add_num:"",robot_add:"",robot_add_more:"",blood_add:"",kaipai:"" },
      { key:6,add_time:"15,18",color_add:"1,10,6500;11,50,1000;51,100,1000;101,500,500;501,1000,500;1001,5000,500",king_add:"0,1,6500;2,5,1000;6,10,1000;11,20,500;21,50,500;51,100,500",robot_add_num:"",robot_add:"",robot_add_more:"",blood_add:"",kaipai:"" }
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

module.exports=data_pk_ai;