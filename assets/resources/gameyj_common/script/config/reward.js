var data_reward =
{
    items:
    [
      { key:101,reward:"1003,1",probability:2000,type:1,desc:"0",b_id:0 },
      { key:102,reward:"1004,30",probability:1500,type:1,desc:"0",b_id:0 },
      { key:103,reward:"1004,20",probability:2000,type:1,desc:"0",b_id:0 },
      { key:104,reward:"1003,1",probability:1500,type:1,desc:"0",b_id:0 },
      { key:105,reward:"1004,100",probability:100,type:1,desc:"0",b_id:0 },
      { key:106,reward:"1003,1",probability:500,type:1,desc:"0",b_id:0 },
      { key:107,reward:"1004,80",probability:300,type:1,desc:"0",b_id:0 },
      { key:108,reward:"1003,1",probability:2000,type:1,desc:"0",b_id:0 },
      { key:109,reward:"1004,200",probability:100,type:1,desc:"0",b_id:0 },
      { key:201,reward:"1001,50000",probability:200,type:2,desc:"3.0%",b_id:4 },
      { key:202,reward:"1006,300",probability:100,type:2,desc:"2.0%",b_id:5 },
      { key:203,reward:"1001,20000",probability:400,type:2,desc:"4.0%",b_id:6 },
      { key:204,reward:"1005,128",probability:150,type:2,desc:"3.0%",b_id:7 },
      { key:205,reward:"1001,2000",probability:4750,type:2,desc:"40.0%",b_id:0 },
      { key:206,reward:"1004,300",probability:100,type:2,desc:"2.0%",b_id:8 },
      { key:207,reward:"1005,66",probability:500,type:2,desc:"5.0%",b_id:0 },
      { key:208,reward:"1001,5000",probability:3800,type:2,desc:"40.0%",b_id:0 },
      { key:209,reward:"1005,3000",probability:0,type:2,desc:"1.0%",b_id:9 }
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

module.exports=data_reward;