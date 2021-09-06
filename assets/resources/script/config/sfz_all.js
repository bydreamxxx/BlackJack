var data_sfz_all =
{
    items:
    [
      { key:0,name:"水浒传",rate:750,weight:0,bid:101 },
      { key:1,name:"忠义堂",rate:750,weight:0,bid:101 },
      { key:2,name:"替天行道",rate:750,weight:0,bid:101 },
      { key:3,name:"宋江",rate:750,weight:0,bid:101 },
      { key:4,name:"林冲",rate:750,weight:0,bid:101 },
      { key:5,name:"鲁智深",rate:750,weight:0,bid:101 },
      { key:6,name:"金刀",rate:750,weight:50,bid:101 },
      { key:7,name:"银枪",rate:750,weight:250,bid:101 },
      { key:8,name:"铁斧",rate:750,weight:850,bid:101 },
      { key:9,name:"人物",rate:750,weight:850,bid:101 },
      { key:10,name:"武器",rate:750,weight:8000,bid:101 }
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

module.exports=data_sfz_all;