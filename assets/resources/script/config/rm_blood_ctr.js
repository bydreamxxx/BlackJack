var data_rm_blood_ctr =
{
    items:
    [
      { key:-1,p_sum:2,rate:1000 },
      { key:-2,p_sum:3,rate:2000 },
      { key:-3,p_sum:4,rate:3000 },
      { key:1,p_sum:2,rate:1000 },
      { key:2,p_sum:3,rate:2000 },
      { key:3,p_sum:4,rate:3000 },
      { key:-11,p_sum:3,rate:3000 },
      { key:-12,p_sum:3,rate:3000 },
      { key:-13,p_sum:3,rate:3000 },
      { key:11,p_sum:3,rate:3000 },
      { key:12,p_sum:3,rate:3000 },
      { key:13,p_sum:3,rate:3000 }
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

module.exports=data_rm_blood_ctr;