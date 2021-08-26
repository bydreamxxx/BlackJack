var data_caishendaoAct =
{
    items:
    [
      { key:1,pointMin:0,pointMax:-1,poolType:1,rewardMin:100000,rewardMax:199999,weight:300 },
      { key:2,pointMin:0,pointMax:-1,poolType:1,rewardMin:200000,rewardMax:299999,weight:500 },
      { key:3,pointMin:0,pointMax:-1,poolType:1,rewardMin:300000,rewardMax:399999,weight:600 },
      { key:4,pointMin:0,pointMax:-1,poolType:1,rewardMin:400000,rewardMax:499999,weight:1000 },
      { key:5,pointMin:0,pointMax:-1,poolType:1,rewardMin:500000,rewardMax:666665,weight:6550 },
      { key:6,pointMin:0,pointMax:-1,poolType:1,rewardMin:666666,rewardMax:666666,weight:900 },
      { key:7,pointMin:0,pointMax:-1,poolType:1,rewardMin:666667,rewardMax:888887,weight:50 },
      { key:8,pointMin:0,pointMax:-1,poolType:1,rewardMin:888888,rewardMax:888888,weight:50 },
      { key:9,pointMin:0,pointMax:-1,poolType:1,rewardMin:888889,rewardMax:999999,weight:50 },
      { key:10,pointMin:10000000,pointMax:49999999,poolType:2,rewardMin:1000000,rewardMax:2999999,weight:6790 },
      { key:11,pointMin:10000000,pointMax:49999999,poolType:2,rewardMin:3000000,rewardMax:3999999,weight:1100 },
      { key:12,pointMin:10000000,pointMax:49999999,poolType:2,rewardMin:4000000,rewardMax:4999999,weight:500 },
      { key:13,pointMin:10000000,pointMax:49999999,poolType:2,rewardMin:5000000,rewardMax:6666665,weight:500 },
      { key:14,pointMin:10000000,pointMax:49999999,poolType:2,rewardMin:6666666,rewardMax:6666666,weight:500 },
      { key:15,pointMin:10000000,pointMax:49999999,poolType:2,rewardMin:6666667,rewardMax:7999999,weight:500 },
      { key:16,pointMin:10000000,pointMax:49999999,poolType:2,rewardMin:8000000,rewardMax:8888887,weight:50 },
      { key:17,pointMin:10000000,pointMax:49999999,poolType:2,rewardMin:8888888,rewardMax:8888888,weight:50 },
      { key:18,pointMin:10000000,pointMax:49999999,poolType:2,rewardMin:8888889,rewardMax:9999999,weight:10 },
      { key:19,pointMin:50000000,pointMax:99999999,poolType:2,rewardMin:1000000,rewardMax:2999999,weight:8360 },
      { key:20,pointMin:50000000,pointMax:99999999,poolType:2,rewardMin:3000000,rewardMax:3999999,weight:1100 },
      { key:21,pointMin:50000000,pointMax:99999999,poolType:2,rewardMin:4000000,rewardMax:4999999,weight:100 },
      { key:22,pointMin:50000000,pointMax:99999999,poolType:2,rewardMin:5000000,rewardMax:6666665,weight:100 },
      { key:23,pointMin:50000000,pointMax:99999999,poolType:2,rewardMin:6666666,rewardMax:6666666,weight:100 },
      { key:24,pointMin:50000000,pointMax:99999999,poolType:2,rewardMin:6666667,rewardMax:7999999,weight:100 },
      { key:25,pointMin:50000000,pointMax:99999999,poolType:2,rewardMin:8000000,rewardMax:8888887,weight:50 },
      { key:26,pointMin:50000000,pointMax:99999999,poolType:2,rewardMin:8888888,rewardMax:8888888,weight:50 },
      { key:27,pointMin:50000000,pointMax:99999999,poolType:2,rewardMin:8888889,rewardMax:9999999,weight:10 },
      { key:28,pointMin:50000000,pointMax:99999999,poolType:2,rewardMin:10000000,rewardMax:19999999,weight:10 },
      { key:29,pointMin:50000000,pointMax:99999999,poolType:2,rewardMin:20000000,rewardMax:29999999,weight:10 },
      { key:30,pointMin:50000000,pointMax:99999999,poolType:2,rewardMin:30000000,rewardMax:39999999,weight:10 },
      { key:31,pointMin:100000000,pointMax:-1,poolType:2,rewardMin:1000000,rewardMax:2999999,weight:8360 },
      { key:32,pointMin:100000000,pointMax:-1,poolType:2,rewardMin:3000000,rewardMax:3999999,weight:1100 },
      { key:33,pointMin:100000000,pointMax:-1,poolType:2,rewardMin:4000000,rewardMax:4999999,weight:100 },
      { key:34,pointMin:100000000,pointMax:-1,poolType:2,rewardMin:5000000,rewardMax:5999999,weight:100 },
      { key:35,pointMin:100000000,pointMax:-1,poolType:2,rewardMin:6666666,rewardMax:6666666,weight:100 },
      { key:36,pointMin:100000000,pointMax:-1,poolType:2,rewardMin:8888888,rewardMax:8888888,weight:100 },
      { key:37,pointMin:100000000,pointMax:-1,poolType:2,rewardMin:10000000,rewardMax:19999999,weight:50 },
      { key:38,pointMin:100000000,pointMax:-1,poolType:2,rewardMin:20000000,rewardMax:29999999,weight:50 },
      { key:39,pointMin:100000000,pointMax:-1,poolType:2,rewardMin:30000000,rewardMax:39999999,weight:10 },
      { key:40,pointMin:100000000,pointMax:-1,poolType:2,rewardMin:40000000,rewardMax:49999999,weight:10 },
      { key:41,pointMin:100000000,pointMax:-1,poolType:6,rewardMin:66666666,rewardMax:66666666,weight:10 },
      { key:42,pointMin:100000000,pointMax:-1,poolType:6,rewardMin:88888888,rewardMax:88888888,weight:10 }
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

module.exports=data_caishendaoAct;