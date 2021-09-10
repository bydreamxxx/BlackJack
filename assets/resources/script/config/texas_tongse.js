var data_texas_tongse =
{
    items:
    [
      { key:2,ts_2:0,ts_3:2333,ts_4:2428,ts_5:2577,ts_6:2746,ts_7:2968,ts_8:3273,ts_9:3632,ts_10:4044,ts_11:4511,ts_12:5032,ts_13:5605,ts_14:6249 },
      { key:3,ts_2:0,ts_3:0,ts_4:2556,ts_5:2705,ts_6:2874,ts_7:3096,ts_8:3372,ts_9:3731,ts_10:4143,ts_11:4610,ts_12:5130,ts_13:5704,ts_14:6347 },
      { key:4,ts_2:0,ts_3:0,ts_4:0,ts_5:2832,ts_6:3001,ts_7:3223,ts_8:3499,ts_9:3829,ts_10:4241,ts_11:4708,ts_12:5229,ts_13:5802,ts_14:6446 },
      { key:5,ts_2:0,ts_3:0,ts_4:0,ts_5:0,ts_6:3126,ts_7:3349,ts_8:3624,ts_9:3955,ts_10:4340,ts_11:4807,ts_12:5327,ts_13:5901,ts_14:6544 },
      { key:6,ts_2:0,ts_3:0,ts_4:0,ts_5:0,ts_6:0,ts_7:3472,ts_8:3748,ts_9:4078,ts_10:4463,ts_11:4906,ts_12:5426,ts_13:6000,ts_14:6626 },
      { key:7,ts_2:0,ts_3:0,ts_4:0,ts_5:0,ts_6:0,ts_7:0,ts_8:3868,ts_9:4198,ts_10:4583,ts_11:5025,ts_12:5524,ts_13:6097,ts_14:6724 },
      { key:8,ts_2:0,ts_3:0,ts_4:0,ts_5:0,ts_6:0,ts_7:0,ts_8:0,ts_9:4314,ts_10:4699,ts_11:5142,ts_12:5640,ts_13:6195,ts_14:6821 },
      { key:9,ts_2:0,ts_3:0,ts_4:0,ts_5:0,ts_6:0,ts_7:0,ts_8:0,ts_9:0,ts_10:4813,ts_11:5255,ts_12:5753,ts_13:6308,ts_14:6918 },
      { key:10,ts_2:0,ts_3:0,ts_4:0,ts_5:0,ts_6:0,ts_7:0,ts_8:0,ts_9:0,ts_10:0,ts_11:5364,ts_12:5862,ts_13:6417,ts_14:7028 },
      { key:11,ts_2:0,ts_3:0,ts_4:0,ts_5:0,ts_6:0,ts_7:0,ts_8:0,ts_9:0,ts_10:0,ts_11:0,ts_12:5959,ts_13:6513,ts_14:7124 },
      { key:12,ts_2:0,ts_3:0,ts_4:0,ts_5:0,ts_6:0,ts_7:0,ts_8:0,ts_9:0,ts_10:0,ts_11:0,ts_12:0,ts_13:6610,ts_14:7220 },
      { key:13,ts_2:0,ts_3:0,ts_4:0,ts_5:0,ts_6:0,ts_7:0,ts_8:0,ts_9:0,ts_10:0,ts_11:0,ts_12:0,ts_13:0,ts_14:7317 },
      { key:14,ts_2:0,ts_3:0,ts_4:0,ts_5:0,ts_6:0,ts_7:0,ts_8:0,ts_9:0,ts_10:0,ts_11:0,ts_12:0,ts_13:0,ts_14:0 }
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

module.exports=data_texas_tongse;