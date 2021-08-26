var data_pin3_ai_time =
{
    items:
    [
      { key:1,watch:"1;2",cmp:"3;5",follow:"2;4",bet:"3;5",try_one:"4;7",fire:"4;7",giveup:"2;4" },
      { key:2,watch:"1;2",cmp:"2;4",follow:"1;2",bet:"2;4",try_one:"2;6",fire:"2;6",giveup:"1;2" },
      { key:3,watch:"1;2",cmp:"2;4",follow:"1;2",bet:"2;4",try_one:"2;6",fire:"2;6",giveup:"1;2" }
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

module.exports=data_pin3_ai_time;