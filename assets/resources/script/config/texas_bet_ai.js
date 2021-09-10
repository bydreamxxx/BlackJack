var data_texas_bet_ai =
{
    items:
    [
      { key:1,times:"1,10",rate:35 },
      { key:2,times:"10,50",rate:40 },
      { key:3,times:"50,100",rate:40 },
      { key:4,times:"100,-1",rate:70 }
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

module.exports=data_texas_bet_ai;