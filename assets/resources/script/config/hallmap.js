var data_hallmap =
{
    items:
    [
      { key:1,province_code:11,name:"北京",mj_game:"",pk_game:"",open:0 },
      { key:2,province_code:12,name:"天津",mj_game:"",pk_game:"",open:0 },
      { key:3,province_code:13,name:"河北",mj_game:"",pk_game:"",open:0 },
      { key:4,province_code:14,name:"山西",mj_game:"",pk_game:"",open:0 },
      { key:5,province_code:15,name:"内蒙",mj_game:"173",pk_game:"",open:1 },
      { key:6,province_code:21,name:"辽宁",mj_game:"159;13;23;56;162;169",pk_game:"",open:1 },
      { key:7,province_code:22,name:"吉林",mj_game:"13;23;56;159;162;169",pk_game:"",open:1 },
      { key:8,province_code:23,name:"黑龙江",mj_game:"13;23;56;159;162;169",pk_game:"",open:1 },
      { key:9,province_code:31,name:"上海",mj_game:"",pk_game:"",open:0 },
      { key:10,province_code:32,name:"江苏",mj_game:"",pk_game:"",open:0 },
      { key:11,province_code:33,name:"浙江",mj_game:"",pk_game:"",open:0 },
      { key:12,province_code:34,name:"安徽",mj_game:"",pk_game:"",open:0 },
      { key:13,province_code:35,name:"福建",mj_game:"",pk_game:"",open:0 },
      { key:14,province_code:36,name:"江西",mj_game:"",pk_game:"",open:0 },
      { key:15,province_code:37,name:"山东",mj_game:"",pk_game:"",open:0 },
      { key:16,province_code:41,name:"河南",mj_game:"",pk_game:"",open:0 },
      { key:17,province_code:42,name:"湖北",mj_game:"",pk_game:"",open:0 },
      { key:18,province_code:43,name:"湖南",mj_game:"",pk_game:"",open:0 },
      { key:19,province_code:44,name:"广东",mj_game:"",pk_game:"",open:0 },
      { key:20,province_code:45,name:"广西",mj_game:"",pk_game:"",open:0 },
      { key:21,province_code:46,name:"海南",mj_game:"",pk_game:"",open:0 },
      { key:22,province_code:50,name:"重庆",mj_game:"",pk_game:"",open:0 },
      { key:23,province_code:51,name:"四川",mj_game:"",pk_game:"",open:0 },
      { key:24,province_code:52,name:"贵州",mj_game:"",pk_game:"",open:0 },
      { key:25,province_code:53,name:"云南",mj_game:"",pk_game:"",open:0 },
      { key:26,province_code:54,name:"西藏",mj_game:"",pk_game:"",open:0 },
      { key:27,province_code:61,name:"陕西",mj_game:"",pk_game:"",open:0 },
      { key:28,province_code:62,name:"甘肃",mj_game:"",pk_game:"",open:0 },
      { key:29,province_code:63,name:"青海",mj_game:"",pk_game:"",open:0 },
      { key:30,province_code:64,name:"宁夏",mj_game:"",pk_game:"",open:0 },
      { key:31,province_code:65,name:"新疆",mj_game:"",pk_game:"",open:0 },
      { key:32,province_code:71,name:"台湾",mj_game:"",pk_game:"",open:0 },
      { key:33,province_code:81,name:"香港",mj_game:"",pk_game:"",open:0 },
      { key:34,province_code:82,name:"澳门",mj_game:"",pk_game:"",open:0 }
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

module.exports=data_hallmap;