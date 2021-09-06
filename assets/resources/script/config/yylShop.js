var data_yylShop =
{
    items:
    [
      { key:0,gold:10,rmb:"10" },
      { key:1,gold:50,rmb:"50" },
      { key:2,gold:100,rmb:"100" },
      { key:3,gold:500,rmb:"500" },
      { key:4,gold:1000,rmb:"1000" },
      { key:5,gold:2000,rmb:"2000" },
      { key:6,gold:3000,rmb:"3000" }
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

module.exports=data_yylShop;