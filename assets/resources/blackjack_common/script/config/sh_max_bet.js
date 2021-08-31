var data_sh_max_bet =
{
    items:
    [
      { key:11,maxbet:"1,1000;2,2500;3,30000" },
      { key:12,maxbet:"1,10000;2,25000;3,300000" },
      { key:13,maxbet:"1,100000;2,250000;3,3000000" },
      { key:14,maxbet:"1,500000;2,1250000;3,15000000" },
      { key:21,maxbet:"1,10;2,25;3,50" },
      { key:22,maxbet:"1,10;2,25;3,100" },
      { key:23,maxbet:"1,10;2,25;3,200" },
      { key:24,maxbet:"1,10;2,25;3,300" },
      { key:25,maxbet:"1,10;2,25;3,400" },
      { key:26,maxbet:"1,10;2,25;3,500" },
      { key:27,maxbet:"1,1000;2,2500;3,100000000" },
      { key:100,maxbet:"1,100000;2,250000;3,3000000" }
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

module.exports=data_sh_max_bet;