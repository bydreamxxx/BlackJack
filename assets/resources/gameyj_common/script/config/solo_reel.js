var data_solo_reel =
{
    items:
    [
      { key:1,rate:500,weight:"1,300;2,1601;3,1601;4,1601;5,1601;6,1205;7,315;8,410;9,410;10,382;11,382;12,60;13,130",d_weight:"1,2466;2,2466;3,2324;4,2324;5,420" }
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

module.exports=data_solo_reel;