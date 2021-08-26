var data_dayShareReward =
{
    items:
    [
      { key:1,reward:"1001,188",weight:130 },
      { key:2,reward:"1001,288",weight:100 },
      { key:3,reward:"1001,388",weight:100 },
      { key:4,reward:"1001,588",weight:100 },
      { key:5,reward:"1001,888",weight:50 },
      { key:6,reward:"1001,1288",weight:10 },
      { key:7,reward:"1001,1888",weight:10 }
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

module.exports=data_dayShareReward;