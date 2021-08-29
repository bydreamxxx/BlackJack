var data_zhajinhuaRoom =
{
    items:
    [
      { key:1,bet_min:50,bet_max:400,play_sub_type:1,round_max:15,clips_min:1000,clips_max:25000,jiazhu:"2;4;8;",tip:5,showchips:"5:10:20:50:100:200",chipvalue:"5:10:20:50:100:200" },
      { key:2,bet_min:500,bet_max:4000,play_sub_type:1,round_max:15,clips_min:10000,clips_max:250000,jiazhu:"2;4;8;",tip:50,showchips:"50:100:200:500:1000:2000",chipvalue:"50:100:200:500:1000:2000" },
      { key:3,bet_min:5000,bet_max:40000,play_sub_type:1,round_max:15,clips_min:100000,clips_max:2500000,jiazhu:"2;4;8;",tip:500,showchips:"500:1000:2000:5000:1万:2万",chipvalue:"500:1000:2000:5000:10000:20000" },
      { key:4,bet_min:50000,bet_max:400000,play_sub_type:1,round_max:15,clips_min:1000000,clips_max:25000000,jiazhu:"2;4;8;",tip:5000,showchips:"5000:1万:2万:5万:10万:20万",chipvalue:"5000:10000:20000:50000:100000:200000" }
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

module.exports=data_zhajinhuaRoom;