var data_ddz_friend_stack_bomb_num =
{
    items:
    [
      { key:1,bomb_num:1,weight:6000 },
      { key:2,bomb_num:2,weight:2000 },
      { key:3,bomb_num:3,weight:1500 },
      { key:4,bomb_num:4,weight:1000 },
      { key:5,bomb_num:5,weight:500 },
      { key:6,bomb_num:6,weight:400 },
      { key:7,bomb_num:7,weight:100 }
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

module.exports=data_ddz_friend_stack_bomb_num;