var data_sfz_xml_times =
{
    items:
    [
      { key:1,chance:0 },
      { key:2,chance:0 },
      { key:3,chance:4000 },
      { key:4,chance:6000 },
      { key:5,chance:8000 },
      { key:6,chance:10000 }
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

module.exports=data_sfz_xml_times;