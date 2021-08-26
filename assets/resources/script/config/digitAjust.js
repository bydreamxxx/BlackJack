var data_digitAjust =
{
    items:
    [
      { key:"test",value:123 },
      { key:"tinygame_start_speed",value:4 },
      { key:"tinygame_run_speed",value:1 },
      { key:"tinygame_total_time",value:4 },
      { key:"tinygame_sub_speed",value:3 },
      { key:"tinygame_end_speed",value:4 }
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

module.exports=data_digitAjust;