var data_playerExp =
{
    items:
    [
      { key:0,exp:0,max_exp:7000000,trans_coe:0,b_id:0 },
      { key:1,exp:2000,max_exp:7000000,trans_coe:0,b_id:2 },
      { key:2,exp:8000,max_exp:7000000,trans_coe:0,b_id:2 },
      { key:3,exp:40000,max_exp:7000000,trans_coe:0,b_id:2 },
      { key:4,exp:150000,max_exp:7000000,trans_coe:0,b_id:2 },
      { key:5,exp:1900000,max_exp:7000000,trans_coe:0,b_id:2 },
      { key:6,exp:3800000,max_exp:7000000,trans_coe:0,b_id:2 },
      { key:7,exp:8600000,max_exp:7000000,trans_coe:0,b_id:2 },
      { key:8,exp:17200000,max_exp:7000000,trans_coe:0,b_id:2 },
      { key:9,exp:34400000,max_exp:7000000,trans_coe:0,b_id:2 },
      { key:10,exp:68800000,max_exp:7000000,trans_coe:0,b_id:2 }
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

module.exports=data_playerExp;