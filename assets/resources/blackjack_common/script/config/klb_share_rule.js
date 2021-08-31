var data_klb_share_rule =
{
    items:
    [
      { key:1,equipment:"ios",share_frequency:"0,1",share_time:"0,2",probability:8000,switch:0 },
      { key:2,equipment:"ios",share_frequency:"0,1",share_time:"2,-1",probability:8000,switch:0 },
      { key:3,equipment:"ios",share_frequency:"1,-1",share_time:"0,2",probability:10000,switch:0 },
      { key:4,equipment:"ios",share_frequency:"1,-1",share_time:"2,-1",probability:10000,switch:0 },
      { key:5,equipment:"Android",share_frequency:"0,1",share_time:"0,-1",probability:8000,switch:0 },
      { key:6,equipment:"Android",share_frequency:"1,-1",share_time:"0,-1",probability:10000,switch:0 }
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

module.exports=data_klb_share_rule;