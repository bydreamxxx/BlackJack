var data_bj_pair =
{
    items:
    [
      { key:2,p2:4,p3:4,p4:4,p5:4,p6:4,p7:4,p8:2,p9:2,p10:2,p11:2 },
      { key:3,p2:4,p3:4,p4:4,p5:4,p6:4,p7:4,p8:2,p9:2,p10:2,p11:2 },
      { key:4,p2:2,p3:2,p4:2,p5:4,p6:4,p7:2,p8:2,p9:2,p10:2,p11:2 },
      { key:5,p2:3,p3:3,p4:3,p5:3,p6:3,p7:3,p8:3,p9:3,p10:2,p11:2 },
      { key:6,p2:4,p3:4,p4:4,p5:4,p6:4,p7:2,p8:2,p9:2,p10:2,p11:2 },
      { key:7,p2:4,p3:4,p4:4,p5:4,p6:4,p7:4,p8:2,p9:2,p10:2,p11:2 },
      { key:8,p2:4,p3:4,p4:4,p5:4,p6:4,p7:4,p8:4,p9:4,p10:4,p11:4 },
      { key:9,p2:4,p3:4,p4:4,p5:4,p6:4,p7:1,p8:4,p9:4,p10:1,p11:1 },
      { key:10,p2:1,p3:1,p4:1,p5:1,p6:1,p7:1,p8:1,p9:1,p10:1,p11:1 },
      { key:11,p2:4,p3:4,p4:4,p5:4,p6:4,p7:4,p8:4,p9:4,p10:4,p11:4 }
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

module.exports=data_bj_pair;