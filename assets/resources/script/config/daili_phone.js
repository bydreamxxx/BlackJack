var data_daili_phone =
{
    items:
    [
      { key:0,phone:17052495555 },
      { key:10000,phone:18247989678 },
      { key:10001,phone:17041887777 },
      { key:10002,phone:13945698444 },
      { key:10003,phone:17043198881 },
      { key:10004,phone:13252511817 },
      { key:10005,phone:18641629860 },
      { key:10007,phone:15164302310 },
      { key:10009,phone:13796776766 },
      { key:10011,phone:15567949994 },
      { key:10014,phone:17107123219 }
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

module.exports=data_daili_phone;