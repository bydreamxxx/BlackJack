var data_sfz_base_pay =
{
    items:
    [
      { key:0,name:"水浒传",three_X:0,four_X:0,five_X:2000,all_X:5000,allMan:50,allDao:15 },
      { key:1,name:"忠义堂",three_X:50,four_X:200,five_X:1000,all_X:2500,allMan:0,allDao:0 },
      { key:2,name:"替天行道",three_X:20,four_X:80,five_X:400,all_X:1000,allMan:0,allDao:0 },
      { key:3,name:"宋江",three_X:15,four_X:40,five_X:200,all_X:500,allMan:0,allDao:0 },
      { key:4,name:"林冲",three_X:10,four_X:30,five_X:160,all_X:400,allMan:0,allDao:0 },
      { key:5,name:"鲁智深",three_X:7,four_X:20,five_X:100,all_X:250,allMan:0,allDao:0 },
      { key:6,name:"金刀",three_X:5,four_X:15,five_X:60,all_X:150,allMan:0,allDao:0 },
      { key:7,name:"银枪",three_X:3,four_X:10,five_X:40,all_X:100,allMan:0,allDao:0 },
      { key:8,name:"铁斧",three_X:2,four_X:5,five_X:20,all_X:50,allMan:0,allDao:0 }
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

module.exports=data_sfz_base_pay;