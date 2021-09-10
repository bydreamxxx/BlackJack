var data_pyOutSound =
{
    items:
    [
      { key:1,type:1,value:3,soundName:"S_3.mp3" },
      { key:2,type:1,value:4,soundName:"S_4.mp3" },
      { key:3,type:1,value:5,soundName:"S_5.mp3" },
      { key:4,type:1,value:6,soundName:"S_6.mp3" },
      { key:5,type:1,value:7,soundName:"S_7.mp3" },
      { key:6,type:1,value:8,soundName:"S_8.mp3" },
      { key:7,type:1,value:9,soundName:"S_9.mp3" },
      { key:8,type:1,value:10,soundName:"S_10.mp3" },
      { key:9,type:1,value:11,soundName:"S_11.mp3" },
      { key:10,type:1,value:12,soundName:"S_12.mp3" },
      { key:11,type:1,value:13,soundName:"S_13.mp3" },
      { key:12,type:1,value:14,soundName:"S_1.mp3" },
      { key:13,type:1,value:16,soundName:"S_2.mp3" },
      { key:14,type:1,value:17,soundName:"S_3.mp3" },
      { key:15,type:1,value:18,soundName:"S_14.mp3" },
      { key:16,type:1,value:19,soundName:"S_15.mp3" },
      { key:17,type:2,value:3,soundName:"D_3.mp3" },
      { key:18,type:2,value:4,soundName:"D_4.mp3" },
      { key:19,type:2,value:5,soundName:"D_5.mp3" },
      { key:20,type:2,value:6,soundName:"D_6.mp3" },
      { key:21,type:2,value:7,soundName:"D_7.mp3" },
      { key:22,type:2,value:8,soundName:"D_8.mp3" },
      { key:23,type:2,value:9,soundName:"D_9.mp3" },
      { key:24,type:2,value:10,soundName:"D_10.mp3" },
      { key:25,type:2,value:11,soundName:"D_11.mp3" },
      { key:26,type:2,value:12,soundName:"D_12.mp3" },
      { key:27,type:2,value:13,soundName:"D_13.mp3" },
      { key:28,type:2,value:14,soundName:"D_1.mp3" },
      { key:29,type:2,value:16,soundName:"D_2.mp3" },
      { key:30,type:2,value:17,soundName:"D_3.mp3" },
      { key:33,type:3,value:0,soundName:"SL.mp3" },
      { key:34,type:4,value:0,soundName:"SL.mp3" },
      { key:35,type:5,value:0,soundName:"bomb-0.mp3" },
      { key:36,type:6,value:0,soundName:"bomb-0.mp3" },
      { key:37,type:7,value:0,soundName:"bomb-1.mp3" },
      { key:38,type:8,value:0,soundName:"bomb-1.mp3" },
      { key:39,type:9,value:0,soundName:"bomb-2.mp3" },
      { key:40,type:10,value:0,soundName:"bomb-2.mp3" },
      { key:41,type:11,value:0,soundName:"bomb-0.mp3" },
      { key:42,type:12,value:0,soundName:"bomb-1.mp3" },
      { key:43,type:13,value:0,soundName:"bomb-1.mp3" },
      { key:44,type:14,value:0,soundName:"bomb-2.mp3" },
      { key:45,type:15,value:0,soundName:"bomb-0.mp3" },
      { key:46,type:16,value:0,soundName:"bomb-1.mp3" },
      { key:47,type:17,value:0,soundName:"bomb-2.mp3" },
      { key:48,type:18,value:0,soundName:"KILL1.mp3" },
      { key:49,type:19,value:0,soundName:"KILL2.mp3" },
      { key:50,type:20,value:0,soundName:"chuan.mp3" },
      { key:51,type:21,value:0,soundName:"PASS_guo.mp3" },
      { key:52,type:22,value:0,soundName:"PASS_guo.mp3" }
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

module.exports=data_pyOutSound;