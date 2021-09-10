var data_texas_yise =
{
    items:
    [
      { key:2,ys_2:0,ys_3:2252,ys_4:2349,ys_5:2498,ys_6:2669,ys_7:2893,ys_8:3201,ys_9:3563,ys_10:3979,ys_11:4451,ys_12:4976,ys_13:5555,ys_14:6205 },
      { key:3,ys_2:0,ys_3:0,ys_4:2477,ys_5:2628,ys_6:2798,ys_7:3022,ys_8:3300,ys_9:3662,ys_10:4078,ys_11:4550,ys_12:5075,ys_13:5655,ys_14:6304 },
      { key:4,ys_2:0,ys_3:0,ys_4:0,ys_5:2755,ys_6:2926,ys_7:3150,ys_8:3428,ys_9:3762,ys_10:4177,ys_11:4649,ys_12:5175,ys_13:5754,ys_14:6404 },
      { key:5,ys_2:0,ys_3:0,ys_4:0,ys_5:0,ys_6:3052,ys_7:3277,ys_8:3555,ys_9:3888,ys_10:4277,ys_11:4748,ys_12:5274,ys_13:5853,ys_14:6503 },
      { key:6,ys_2:0,ys_3:0,ys_4:0,ys_5:0,ys_6:0,ys_7:3401,ys_8:3680,ys_9:4013,ys_10:4401,ys_11:4848,ys_12:5374,ys_13:5953,ys_14:6585 },
      { key:7,ys_2:0,ys_3:0,ys_4:0,ys_5:0,ys_6:0,ys_7:0,ys_8:3800,ys_9:4133,ys_10:4522,ys_11:4969,ys_12:5472,ys_13:6051,ys_14:6683 },
      { key:8,ys_2:0,ys_3:0,ys_4:0,ys_5:0,ys_6:0,ys_7:0,ys_8:0,ys_9:4251,ys_10:4639,ys_11:5086,ys_12:5589,ys_13:6149,ys_14:6781 },
      { key:9,ys_2:0,ys_3:0,ys_4:0,ys_5:0,ys_6:0,ys_7:0,ys_8:0,ys_9:0,ys_10:4753,ys_11:5200,ys_12:5703,ys_13:6263,ys_14:6879 },
      { key:10,ys_2:0,ys_3:0,ys_4:0,ys_5:0,ys_6:0,ys_7:0,ys_8:0,ys_9:0,ys_10:0,ys_11:5310,ys_12:5813,ys_13:6373,ys_14:6989 },
      { key:11,ys_2:0,ys_3:0,ys_4:0,ys_5:0,ys_6:0,ys_7:0,ys_8:0,ys_9:0,ys_10:0,ys_11:0,ys_12:5910,ys_13:6470,ys_14:7086 },
      { key:12,ys_2:0,ys_3:0,ys_4:0,ys_5:0,ys_6:0,ys_7:0,ys_8:0,ys_9:0,ys_10:0,ys_11:0,ys_12:0,ys_13:6567,ys_14:7183 },
      { key:13,ys_2:0,ys_3:0,ys_4:0,ys_5:0,ys_6:0,ys_7:0,ys_8:0,ys_9:0,ys_10:0,ys_11:0,ys_12:0,ys_13:0,ys_14:7281 },
      { key:14,ys_2:0,ys_3:0,ys_4:0,ys_5:0,ys_6:0,ys_7:0,ys_8:0,ys_9:0,ys_10:0,ys_11:0,ys_12:0,ys_13:0,ys_14:0 }
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

module.exports=data_texas_yise;