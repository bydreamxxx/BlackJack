var data_pool_state =
{
    items:
    [
      { key:50201,dark_rate:100,dark_aim:2000,switch_on_line1:100000,switch_on_line2:1000000,switch_on_line3:5000000,switch_off_line1:-100000,switch_off_line2:-1000000,switch_off_line3:-5000000 },
      { key:50202,dark_rate:200,dark_aim:5000,switch_on_line1:200000,switch_on_line2:2000000,switch_on_line3:10000000,switch_off_line1:-200000,switch_off_line2:-2000000,switch_off_line3:-10000000 },
      { key:50203,dark_rate:500,dark_aim:10000,switch_on_line1:500000,switch_on_line2:5000000,switch_on_line3:25000000,switch_off_line1:-500000,switch_off_line2:-5000000,switch_off_line3:-25000000 },
      { key:50204,dark_rate:1000,dark_aim:20000,switch_on_line1:1000000,switch_on_line2:10000000,switch_on_line3:50000000,switch_off_line1:-1000000,switch_off_line2:-10000000,switch_off_line3:-50000000 },
      { key:50205,dark_rate:2000,dark_aim:50000,switch_on_line1:2000000,switch_on_line2:20000000,switch_on_line3:100000000,switch_off_line1:-2000000,switch_off_line2:-20000000,switch_off_line3:-100000000 }
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

module.exports=data_pool_state;