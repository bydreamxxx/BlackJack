var data_bj_blood_ctr =
{
    items:
    [
      { key:-1,b_first_point:"5,16,2",b_hit:1,c_first_point:"17,21,2",c_hit:1,rate:1000 },
      { key:-2,b_first_point:"5,16,2",b_hit:1,c_first_point:"17,21,2",c_hit:1,rate:2000 },
      { key:-3,b_first_point:"5,16,3",b_hit:1,c_first_point:"17,21,3",c_hit:1,rate:3000 },
      { key:1,b_first_point:"17,21,2",b_hit:1,c_first_point:"5,16,2",c_hit:1,rate:1000 },
      { key:2,b_first_point:"17,21,2",b_hit:1,c_first_point:"5,16,2",c_hit:1,rate:2000 },
      { key:3,b_first_point:"17,21,3",b_hit:1,c_first_point:"5,16,3",c_hit:1,rate:3000 },
      { key:-11,b_first_point:"5,16,2",b_hit:1,c_first_point:"17,21,2",c_hit:1,rate:1000 },
      { key:-12,b_first_point:"5,16,2",b_hit:1,c_first_point:"17,21,2",c_hit:1,rate:2000 },
      { key:-13,b_first_point:"5,16,3",b_hit:1,c_first_point:"17,21,3",c_hit:1,rate:3000 },
      { key:11,b_first_point:"17,21,2",b_hit:1,c_first_point:"5,16,2",c_hit:1,rate:1000 },
      { key:12,b_first_point:"17,21,2",b_hit:1,c_first_point:"5,16,2",c_hit:1,rate:2000 },
      { key:13,b_first_point:"17,21,3",b_hit:1,c_first_point:"5,16,3",c_hit:1,rate:3000 }
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

module.exports=data_bj_blood_ctr;