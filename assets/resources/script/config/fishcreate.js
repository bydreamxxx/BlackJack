var data_fishcreate =
{
    items:
    [
      { key:1,fish_id:"1,3000;2,2500;3,2500;4,2000;",type:1,fish_form:2,num_min:1,num_max:6,delay:2,interval:5,paths:"101,2500;102,2500;103,2500;104,2500;" },
      { key:2,fish_id:"1,3000;2,2500;3,2500;4,2000;",type:1,fish_form:1,num_min:1,num_max:6,delay:2,interval:12,paths:"105,2500;106,2500;107,2500;108,2500;" },
      { key:3,fish_id:"1,3000;2,2500;3,2500;4,2000;",type:1,fish_form:2,num_min:1,num_max:6,delay:2,interval:10,paths:"113,2500;114,2500;115,2500;116,2500;" },
      { key:4,fish_id:"1,3000;2,2500;3,2500;4,2000;",type:1,fish_form:1,num_min:1,num_max:6,delay:2,interval:6,paths:"109,2500;110,2500;111,2500;112,2500;" },
      { key:5,fish_id:"5,1500;6,1500;7,1500;8,1500;9,1500;10,1500;",type:2,fish_form:1,num_min:1,num_max:3,delay:2,interval:7,paths:"201,2500;202,2500;203,2500;204,2500;" },
      { key:6,fish_id:"5,1500;6,1500;7,1500;8,1500;9,1500;10,1500;",type:2,fish_form:1,num_min:1,num_max:3,delay:2,interval:16,paths:"205,2500;206,2500;207,2500;208,2500;" },
      { key:7,fish_id:"11,1500;12,1500;13,1500;14,1500;15,1500;16,1500;",type:2,fish_form:1,num_min:1,num_max:3,delay:2,interval:9,paths:"213,2500;214,2500;215,2500;216,2500;" },
      { key:8,fish_id:"11,1500;12,1500;13,1500;14,1500;15,1500;16,1500;",type:2,fish_form:1,num_min:1,num_max:3,delay:2,interval:10,paths:"209,2500;210,2500;211,2500;212,2500;" },
      { key:9,fish_id:"17,3000;18,3000;19,3000;",type:3,fish_form:1,num_min:1,num_max:2,delay:2,interval:11,paths:"301,2500;302,2500;303,2500;304,2500;" },
      { key:10,fish_id:"17,3000;18,3000;19,3000;",type:3,fish_form:1,num_min:1,num_max:2,delay:2,interval:22,paths:"305,2500;306,2500;307,2500;308,2500;" },
      { key:11,fish_id:"20,3000;21,3000;22,3000;",type:3,fish_form:1,num_min:1,num_max:2,delay:3,interval:40,paths:"313,2500;314,2500;315,2500;316,2500;" },
      { key:12,fish_id:"20,3000;21,3000;22,3000;",type:3,fish_form:1,num_min:1,num_max:2,delay:3,interval:60,paths:"309,2500;310,2500;311,2500;312,2500;" },
      { key:13,fish_id:"23,3000;24,3000;25,3000",type:5,fish_form:1,num_min:1,num_max:1,delay:70,interval:70,paths:"501,1250;502,1250;503,1250;504,1250;513,1250;514,1250;515,1250;516,1250;" },
      { key:14,fish_id:"23,3000;24,3000;25,3000",type:5,fish_form:1,num_min:1,num_max:1,delay:120,interval:130,paths:"505,1250;506,1250;507,1250;508,1250;509,1250;510,1250;511,1250;512,1250;" },
      { key:15,fish_id:"26,5000;27,5000;",type:5,fish_form:1,num_min:1,num_max:1,delay:80,interval:80,paths:"501,625;502,625;503,625;504,625;505,625;506,625;507,625;508,625;509,625;510,625;511,625;512,625;513,625;514,625;515,625;516,625;" },
      { key:16,fish_id:"29,10000;",type:4,fish_form:1,num_min:1,num_max:1,delay:30,interval:40,paths:"401,2500;402,2500;403,2500;404,2500;" },
      { key:17,fish_id:"30,10000;",type:4,fish_form:1,num_min:1,num_max:1,delay:54,interval:77,paths:"413,2500;414,2500;415,2500;416,2500;" },
      { key:18,fish_id:"32,5000;31,5000;",type:4,fish_form:1,num_min:1,num_max:1,delay:180,interval:180,paths:"409,2500;410,2500;411,2500;412,2500;" },
      { key:19,fish_id:"28,1000;38,1000;39,1000;40,1000;41,1000;42,1000;43,1000;44,1000;",type:4,fish_form:1,num_min:1,num_max:1,delay:32,interval:54,paths:"401,625;402,625;403,625;404,625;405,625;406,625;407,625;408,625;409,625;410,625;411,625;412,625;413,625;414,625;415,625;416,625;" },
      { key:20,fish_id:"68,5000;69,5000;",type:4,fish_form:1,num_min:1,num_max:1,delay:10,interval:40,paths:"601,1000;602,1000;603,1000;604,1000;605,1000;606,1000;607,1000;608,1000;" },
      { key:21,fish_id:"70,1000;71,1000;72,1000;73,1000;74,1000;75,1000;76,1000;77,1000;78,1000;79,1000;80,1000;",type:4,fish_form:1,num_min:1,num_max:1,delay:12,interval:45,paths:"101,500;102,500;103,500;104,500;105,500;106,500;107,500;108,500;113,500;114,500;115,500;116,500;109,500;110,500;111,500;112,500;" }
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

module.exports=data_fishcreate;