var data_texas_point_ai =
{
    items:
    [
      { key:2,point_rate:60,rate_2:0,rate_3:-10,rate_4:-25,rate_5:-30,rate_6:-35,rate_7:-40,rate_8:-45,rate_9:-50 },
      { key:3,point_rate:60,rate_2:0,rate_3:-10,rate_4:-25,rate_5:-30,rate_6:-35,rate_7:-40,rate_8:-45,rate_9:-50 },
      { key:4,point_rate:60,rate_2:0,rate_3:-10,rate_4:-25,rate_5:-30,rate_6:-35,rate_7:-40,rate_8:-45,rate_9:-50 },
      { key:5,point_rate:60,rate_2:0,rate_3:-10,rate_4:-25,rate_5:-30,rate_6:-35,rate_7:-40,rate_8:-45,rate_9:-50 },
      { key:6,point_rate:60,rate_2:0,rate_3:-10,rate_4:-25,rate_5:-30,rate_6:-35,rate_7:-40,rate_8:-45,rate_9:-50 },
      { key:7,point_rate:60,rate_2:0,rate_3:-10,rate_4:-25,rate_5:-30,rate_6:-35,rate_7:-40,rate_8:-45,rate_9:-50 },
      { key:8,point_rate:60,rate_2:0,rate_3:-10,rate_4:-25,rate_5:-30,rate_6:-35,rate_7:-40,rate_8:-45,rate_9:-50 },
      { key:9,point_rate:60,rate_2:0,rate_3:-10,rate_4:-25,rate_5:-30,rate_6:-35,rate_7:-40,rate_8:-45,rate_9:-50 },
      { key:10,point_rate:60,rate_2:0,rate_3:-10,rate_4:-25,rate_5:-30,rate_6:-35,rate_7:-40,rate_8:-45,rate_9:-50 },
      { key:11,point_rate:60,rate_2:0,rate_3:-10,rate_4:-25,rate_5:-30,rate_6:-35,rate_7:-40,rate_8:-45,rate_9:-50 },
      { key:12,point_rate:50,rate_2:0,rate_3:-10,rate_4:-25,rate_5:-30,rate_6:-35,rate_7:-40,rate_8:-45,rate_9:-50 },
      { key:13,point_rate:40,rate_2:0,rate_3:-10,rate_4:-25,rate_5:-30,rate_6:-35,rate_7:-40,rate_8:-45,rate_9:-50 },
      { key:14,point_rate:30,rate_2:0,rate_3:-10,rate_4:-25,rate_5:-30,rate_6:-35,rate_7:-40,rate_8:-45,rate_9:-50 }
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

module.exports=data_texas_point_ai;