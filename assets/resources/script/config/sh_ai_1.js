var data_sh_ai_1 =
{
    items:
    [
      { key:1,sort2:"1,40;2,20;3,0;4,0;5,0",sort3:"1,10;2,10;3,0;4,0;5,0",sort4:"1,10;2,0;3,0;4,-10;5,-10",sort5:"1,10;2,10;3,0;4,-10;5,-10" },
      { key:2,sort2:"1,30;2,-10;3,0;4,0;5,0",sort3:"1,10;2,0;3,-10;4,0;5,0",sort4:"1,10;2,0;3,-50;4,-60;5,0",sort5:"1,20;2,10;3,-50;4,-60;5,-70" },
      { key:3,sort2:"1,30;2,-10;3,0;4,0;5,0",sort3:"1,20;2,0;3,-20;4,0;5,0",sort4:"1,20;2,0;3,-50;4,-60;5,0",sort5:"1,20;2,0;3,-50;4,-60;5,-70" },
      { key:4,sort2:"1,30;2,-20;3,0;4,0;5,0",sort3:"1,35;2,-30;3,-60;4,0;5,0",sort4:"1,35;2,-40;3,-50;4,-60;5,0",sort5:"1,35;2,-40;3,-50;4,-60;5,-70" }
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

module.exports=data_sh_ai_1;