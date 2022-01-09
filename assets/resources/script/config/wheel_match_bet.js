var data_wheel_match_bet =
{
    items:
    [
      { key:50201,drop:2,bet:"100;100;100;200;200;200;500;500;500;1000;1000;1000;2000;2000;2000;4000;4000;4000;8000;10000" },
      { key:50202,drop:2,bet:"100;100;100;200;200;200;500;500;500;1000;1000;1000;2000;2000;2000;4000;4000;4000;8000;10000" },
      { key:50203,drop:2,bet:"100;100;100;200;200;200;500;500;500;1000;1000;1000;2000;2000;2000;4000;4000;4000;8000;10000" }
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

module.exports=data_wheel_match_bet;