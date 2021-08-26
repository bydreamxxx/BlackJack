var data_sh_ai_2 =
{
    items:
    [
      { key:1,sort2:"1,10,10;2,15,15;3,1,275;4,1,275" },
      { key:2,sort2:"1,10,10;2,15,15;3,1,175;4,1,175" },
      { key:3,sort2:"1,1,7;2,1,10;3,1,35;4,1,40" },
      { key:4,sort2:"1,1,5;2,1,7;3,1,25;4,1,35" }
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

module.exports=data_sh_ai_2;