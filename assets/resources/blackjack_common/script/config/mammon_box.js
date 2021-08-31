var data_mammon_box =
{
    items:
    [
      { key:1,type:1,num:1,weight:5000 },
      { key:2,type:1,num:2,weight:5000 },
      { key:3,type:1,num:3,weight:5000 },
      { key:4,type:1,num:5,weight:4000 },
      { key:5,type:1,num:8,weight:2000 },
      { key:6,type:2,num:1,weight:2000 },
      { key:7,type:2,num:2,weight:500 },
      { key:8,type:2,num:3,weight:50 },
      { key:9,type:3,num:2,weight:500 },
      { key:10,type:3,num:3,weight:50 }
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

module.exports=data_mammon_box;