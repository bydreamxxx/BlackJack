var data_bj_soft_point =
{
    items:
    [
      { key:2,p2:2,p3:2,p4:2,p5:3,p6:3,p7:2,p8:2,p9:2,p10:2,p1:2 },
      { key:3,p2:2,p3:2,p4:2,p5:3,p6:3,p7:2,p8:2,p9:2,p10:2,p1:2 },
      { key:4,p2:2,p3:2,p4:3,p5:3,p6:3,p7:2,p8:2,p9:2,p10:2,p1:2 },
      { key:5,p2:2,p3:2,p4:3,p5:3,p6:3,p7:2,p8:2,p9:2,p10:2,p1:2 },
      { key:6,p2:2,p3:3,p4:3,p5:3,p6:3,p7:2,p8:2,p9:2,p10:2,p1:2 },
      { key:7,p2:1,p3:5,p4:5,p5:5,p6:5,p7:1,p8:1,p9:2,p10:2,p1:2 },
      { key:8,p2:1,p3:1,p4:1,p5:1,p6:1,p7:1,p8:1,p9:1,p10:1,p1:1 },
      { key:9,p2:1,p3:1,p4:1,p5:1,p6:1,p7:1,p8:1,p9:1,p10:1,p1:1 }
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

module.exports=data_bj_soft_point;