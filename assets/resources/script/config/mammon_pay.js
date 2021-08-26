var data_mammon_pay =
{
    items:
    [
      { key:9,name:"财神爷",three:0,four:0,five:0 },
      { key:10,name:"福",three:0,four:0,five:0 },
      { key:11,name:"鞭炮",three:0,four:0,five:0 },
      { key:12,name:"恭喜发财",three:50,four:200,five:1500 },
      { key:13,name:"大吉大利",three:30,four:100,five:700 },
      { key:14,name:"玉如意",three:20,four:80,five:500 },
      { key:15,name:"灯笼",three:15,four:60,five:300 },
      { key:16,name:"铜币",three:12,four:50,five:250 },
      { key:17,name:"A",three:10,four:40,five:200 },
      { key:18,name:"K",three:8,four:30,five:150 },
      { key:19,name:"Q",three:6,four:25,five:100 },
      { key:20,name:"J",three:5,four:20,five:70 },
      { key:21,name:"10",three:4,four:15,five:50 }
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

module.exports=data_mammon_pay;