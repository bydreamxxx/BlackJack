var data_tdk_score1 =
{
    items:
    [
      { key:0,diff1:20,diff2:100,max:670 },
      { key:5,diff1:40,diff2:180,max:670 },
      { key:10,diff1:40,diff2:180,max:830 },
      { key:15,diff1:60,diff2:320,max:830 },
      { key:20,diff1:60,diff2:320,max:830 },
      { key:25,diff1:80,diff2:390,max:980 },
      { key:30,diff1:110,diff2:390,max:980 },
      { key:35,diff1:110,diff2:390,max:980 },
      { key:40,diff1:140,diff2:480,max:10000 },
      { key:45,diff1:140,diff2:480,max:10000 },
      { key:50,diff1:160,diff2:480,max:10000 },
      { key:55,diff1:180,diff2:550,max:10000 },
      { key:60,diff1:180,diff2:2000,max:10000 },
      { key:65,diff1:220,diff2:2000,max:10000 },
      { key:70,diff1:220,diff2:2000,max:10000 },
      { key:75,diff1:260,diff2:2000,max:10000 },
      { key:80,diff1:260,diff2:2000,max:10000 },
      { key:85,diff1:320,diff2:2000,max:10000 },
      { key:90,diff1:320,diff2:2000,max:10000 },
      { key:95,diff1:320,diff2:2000,max:10000 },
      { key:100,diff1:460,diff2:2000,max:10000 },
      { key:105,diff1:460,diff2:2000,max:10000 },
      { key:110,diff1:460,diff2:2000,max:10000 },
      { key:115,diff1:460,diff2:2000,max:10000 },
      { key:120,diff1:460,diff2:2000,max:10000 },
      { key:125,diff1:520,diff2:2000,max:10000 },
      { key:130,diff1:520,diff2:2000,max:10000 },
      { key:135,diff1:520,diff2:2000,max:10000 },
      { key:140,diff1:520,diff2:2000,max:10000 },
      { key:145,diff1:600,diff2:2000,max:10000 },
      { key:150,diff1:600,diff2:2000,max:10000 },
      { key:155,diff1:600,diff2:2000,max:10000 },
      { key:160,diff1:600,diff2:2000,max:10000 },
      { key:165,diff1:800,diff2:2000,max:10000 },
      { key:170,diff1:800,diff2:2000,max:10000 },
      { key:175,diff1:800,diff2:2000,max:10000 },
      { key:180,diff1:1000,diff2:2000,max:10000 },
      { key:185,diff1:1000,diff2:2000,max:10000 },
      { key:190,diff1:1000,diff2:2000,max:10000 },
      { key:195,diff1:1000,diff2:2000,max:10000 },
      { key:200,diff1:1000,diff2:2000,max:10000 }
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

module.exports=data_tdk_score1;