var data_fqzs_bet =
{
    items:
    [
      { key:1,name:"金鲨",type:0,pay:100,type_pay:0,weight:731,cheat_weight:"-3,3000,0;-2,2000,0;-1,800,0;1,500,0;2,2000,0;3,3000,0",index:"5;19",area:3 },
      { key:2,name:"银鲨",type:0,pay:24,type_pay:0,weight:6824,cheat_weight:"",index:"12;26",area:3 },
      { key:3,name:"熊猫",type:9,pay:8,type_pay:2,weight:36556,cheat_weight:"",index:"13;14;15",area:11 },
      { key:4,name:"猴子",type:9,pay:8,type_pay:2,weight:36556,cheat_weight:"",index:"9;10;11",area:5 },
      { key:5,name:"兔子",type:9,pay:6,type_pay:2,weight:48741,cheat_weight:"",index:"6;7;8",area:4 },
      { key:6,name:"狮子",type:9,pay:12,type_pay:2,weight:24370,cheat_weight:"",index:"16;17;18",area:10 },
      { key:7,name:"孔雀",type:8,pay:8,type_pay:2,weight:36556,cheat_weight:"",index:"23;24;25",area:6 },
      { key:8,name:"鸽子",type:8,pay:8,type_pay:2,weight:36556,cheat_weight:"",index:"27;28;1",area:1 },
      { key:9,name:"燕子",type:8,pay:6,type_pay:2,weight:48741,cheat_weight:"",index:"2;3;4",area:2 },
      { key:10,name:"老鹰",type:8,pay:12,type_pay:2,weight:24370,cheat_weight:"",index:"20;21;22",area:7 },
      { key:301,name:"金鲨",type:0,pay:100,type_pay:0,weight:0,cheat_weight:"",index:"5;19",area:3 },
      { key:302,name:"银鲨",type:0,pay:24,type_pay:0,weight:0,cheat_weight:"",index:"12;26",area:3 },
      { key:303,name:"熊猫",type:9,pay:8,type_pay:2,weight:3000,cheat_weight:"",index:"13;14;15",area:11 },
      { key:304,name:"猴子",type:9,pay:8,type_pay:2,weight:3000,cheat_weight:"",index:"9;10;11",area:5 },
      { key:305,name:"兔子",type:9,pay:6,type_pay:2,weight:4000,cheat_weight:"",index:"6;7;8",area:4 },
      { key:306,name:"狮子",type:9,pay:12,type_pay:2,weight:2000,cheat_weight:"",index:"16;17;18",area:10 },
      { key:307,name:"孔雀",type:8,pay:8,type_pay:2,weight:3000,cheat_weight:"",index:"23;24;25",area:6 },
      { key:308,name:"鸽子",type:8,pay:8,type_pay:2,weight:3000,cheat_weight:"",index:"27;28;1",area:1 },
      { key:309,name:"燕子",type:8,pay:6,type_pay:2,weight:4000,cheat_weight:"",index:"2;3;4",area:2 },
      { key:310,name:"老鹰",type:8,pay:12,type_pay:2,weight:2000,cheat_weight:"",index:"20;21;22",area:7 }
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

module.exports=data_fqzs_bet;