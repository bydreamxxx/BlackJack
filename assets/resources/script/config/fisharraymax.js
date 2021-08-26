var data_fisharraymax =
{
    items:
    [
      { key:1,name:"一箭穿心",fish_sequence:"1,4;2,4;3,5;4,5;5,6;6,6;7,4;",time_min:30,time_max:52 },
      { key:2,name:"散射圆",fish_sequence:"101,4;102,8;103,12;104,16;105,20;106,24;107,28;108,32;109,36;110,40;111,44;112,48;113,52;114,56;115,60;",time_min:60,time_max:70 },
      { key:3,name:"圆环套圆环",fish_sequence:"72,4;73,9;77,4;78,9;79,14;75,14;76,14;",time_min:30,time_max:52 },
      { key:4,name:"大环套小环",fish_sequence:"80,4;81,5;82,6;83,4;84,5;85,6;86,4;87,4;",time_min:30,time_max:57 },
      { key:5,name:"长方椭圆",fish_sequence:"88,4;89,6;90,5;91,5;92,5;93,5;94,5;95,5;96,5;97,5;98,5;99,5;100,5;",time_min:30,time_max:47 },
      { key:101,name:"鱼王1",fish_sequence:"116,0;127,3;138,6;",time_min:5,time_max:30 },
      { key:102,name:"鱼王2",fish_sequence:"117,0;128,3;139,6;",time_min:5,time_max:30 },
      { key:103,name:"鱼王3",fish_sequence:"118,0;129,3;140,6;",time_min:5,time_max:30 },
      { key:104,name:"鱼王4",fish_sequence:"119,0;130,3;141,6;",time_min:5,time_max:30 },
      { key:105,name:"鱼王5",fish_sequence:"120,0;131,3;142,6;",time_min:5,time_max:30 },
      { key:106,name:"鱼王6",fish_sequence:"121,0;132,3;143,6;",time_min:5,time_max:30 },
      { key:107,name:"鱼王7",fish_sequence:"122,0;133,3;144,6;",time_min:5,time_max:30 },
      { key:108,name:"鱼王8",fish_sequence:"123,0;134,3;145,6;",time_min:5,time_max:30 },
      { key:109,name:"鱼王9",fish_sequence:"124,0;135,3;146,6;",time_min:5,time_max:30 },
      { key:110,name:"鱼王11",fish_sequence:"125,0;136,3;147,6;",time_min:5,time_max:30 },
      { key:111,name:"鱼王12",fish_sequence:"126,0;137,3;148,6;",time_min:5,time_max:30 }
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

module.exports=data_fisharraymax;