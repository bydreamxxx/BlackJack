var data_qka_fish_master_lucky =
{
    items:
    [
      { key:1,roomid:13901,lucky:9000,region:"270,270",weight:40000,is_open:0 },
      { key:2,roomid:13901,lucky:12000,region:"270,270",weight:10000,is_open:0 },
      { key:3,roomid:13902,lucky:9000,region:"270,270",weight:40000,is_open:0 },
      { key:4,roomid:13902,lucky:12000,region:"270,270",weight:10000,is_open:0 },
      { key:5,roomid:13903,lucky:9000,region:"270,270",weight:40000,is_open:0 },
      { key:6,roomid:13903,lucky:12000,region:"270,270",weight:10000,is_open:0 },
      { key:7,roomid:13904,lucky:9000,region:"270,270",weight:40000,is_open:0 },
      { key:8,roomid:13904,lucky:12000,region:"270,270",weight:10000,is_open:0 }
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

module.exports=data_qka_fish_master_lucky;