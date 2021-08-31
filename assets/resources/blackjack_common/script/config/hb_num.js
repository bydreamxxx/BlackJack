var data_hb_num =
{
    items:
    [
      { key:1001,num:7 },
      { key:1002,num:7 },
      { key:1003,num:7 },
      { key:1004,num:7 },
      { key:1005,num:7 },
      { key:3001,num:7 },
      { key:3002,num:7 },
      { key:3003,num:7 },
      { key:3004,num:7 },
      { key:3005,num:7 },
      { key:5001,num:6 },
      { key:5002,num:6 },
      { key:5003,num:6 },
      { key:5004,num:6 },
      { key:5005,num:6 },
      { key:10001,num:6 },
      { key:10002,num:6 },
      { key:10003,num:6 },
      { key:10004,num:6 },
      { key:10005,num:6 },
      { key:20001,num:3 },
      { key:20002,num:3 },
      { key:20003,num:4 },
      { key:20004,num:5 },
      { key:20005,num:6 },
      { key:80001,num:2 },
      { key:80002,num:2 },
      { key:80003,num:4 },
      { key:80004,num:4 },
      { key:80005,num:5 },
      { key:150001,num:1 },
      { key:150002,num:2 },
      { key:150003,num:3 },
      { key:150004,num:4 },
      { key:150005,num:5 },
      { key:300001,num:1 },
      { key:300002,num:3 },
      { key:300003,num:3 },
      { key:300004,num:4 },
      { key:300005,num:5 }
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

module.exports=data_hb_num;