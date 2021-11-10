var data_game_update =
{
    items:
    [
      { key:1,type:1,game_id:-1,name:"pkg",desc:0 },
      { key:2,type:2,game_id:-2,name:"pkgandroid",desc:0 },
      { key:3,type:3,game_id:-3,name:"main",desc:0 },
        { key:70,type:3,game_id:-4,name:"internal",desc:0 },
        { key:71,type:3,game_id:-5,name:"resources",desc:0 },
      { key:4,type:4,game_id:101,name:"shangliangshan",desc:0 },
      { key:5,type:5,game_id:50,name:"pinshuangshi",desc:0 },
      { key:6,type:5,game_id:51,name:"pinshuangshi",desc:0 },
      { key:7,type:6,game_id:40,name:"tiandakeng",desc:0 },
      { key:8,type:6,game_id:41,name:"tiandakeng",desc:0 },
      { key:9,type:7,game_id:26,name:"shandayi",desc:0 },
      { key:10,type:7,game_id:25,name:"shandayi",desc:0 },
      { key:11,type:8,game_id:36,name:"dousanzhang",desc:0 },
      { key:12,type:8,game_id:136,name:"dousanzhang",desc:0 },
      { key:13,type:9,game_id:60,name:"paoyao",desc:0 },
      { key:14,type:9,game_id:61,name:"paoyao",desc:0 },
      { key:15,type:10,game_id:109,name:"fengkuangpinshi",desc:0 },
      { key:16,type:11,game_id:63,name:"suoha",desc:0 },
      { key:17,type:11,game_id:163,name:"suoha",desc:0 },
      { key:18,type:12,game_id:43,name:"hbsl",desc:0 },
      { key:19,type:12,game_id:143,name:"hbsl",desc:0 },
      { key:20,type:13,game_id:103,name:"dantiao",desc:0 },
      { key:21,type:14,game_id:102,name:"caishendao",desc:0 },
      { key:22,type:15,game_id:31,name:"doudizhu",desc:0 },
      { key:23,type:15,game_id:32,name:"doudizhu",desc:0 },
      { key:24,type:15,game_id:33,name:"doudizhu",desc:0 },
      { key:25,type:16,game_id:20,name:"majiang",desc:0 },
      { key:26,type:16,game_id:23,name:"majiang",desc:0 },
      { key:27,type:16,game_id:10,name:"majiang",desc:0 },
      { key:28,type:16,game_id:13,name:"majiang",desc:0 },
      { key:29,type:16,game_id:54,name:"majiang",desc:0 },
      { key:30,type:16,game_id:56,name:"majiang",desc:0 },
      { key:31,type:16,game_id:59,name:"majiang",desc:0 },
      { key:32,type:16,game_id:159,name:"majiang",desc:0 },
      { key:33,type:16,game_id:62,name:"majiang",desc:0 },
      { key:34,type:16,game_id:162,name:"majiang",desc:0 },
      { key:35,type:16,game_id:262,name:"majiang",desc:0 },
      { key:36,type:16,game_id:64,name:"majiang",desc:0 },
      { key:37,type:16,game_id:164,name:"majiang",desc:0 },
      { key:38,type:16,game_id:66,name:"majiang",desc:0 },
      { key:39,type:16,game_id:166,name:"majiang",desc:0 },
      { key:40,type:16,game_id:69,name:"majiang",desc:0 },
      { key:41,type:16,game_id:169,name:"majiang",desc:0 },
      { key:42,type:16,game_id:71,name:"majiang",desc:0 },
      { key:43,type:16,game_id:171,name:"majiang",desc:0 },
      { key:44,type:6,game_id:44,name:"tiandakeng",desc:0 },
      { key:45,type:16,game_id:72,name:"majiang",desc:0 },
      { key:46,type:16,game_id:172,name:"majiang",desc:0 },
      { key:47,type:16,game_id:510,name:"majiang",desc:0 },
      { key:48,type:17,game_id:104,name:"feiqinzoushou",desc:0 },
      { key:49,type:16,game_id:73,name:"majiang",desc:0 },
      { key:50,type:16,game_id:173,name:"majiang",desc:0 },
      { key:51,type:16,game_id:78,name:"majiang",desc:0 },
      { key:52,type:16,game_id:178,name:"majiang",desc:0 },
      { key:53,type:18,game_id:138,name:"fish",desc:0 },
      { key:54,type:16,game_id:81,name:"majiang",desc:0 },
      { key:55,type:16,game_id:181,name:"majiang",desc:0 },
      { key:56,type:19,game_id:129,name:"paodekuai",desc:0 },
      { key:57,type:19,game_id:29,name:"paodekuai",desc:0 },
      { key:58,type:20,game_id:105,name:"xiyou",desc:0 },
      { key:59,type:16,game_id:182,name:"majiang",desc:0 },
      { key:60,type:16,game_id:82,name:"majiang",desc:0 },
      { key:61,type:16,game_id:183,name:"majiang",desc:0 },
      { key:62,type:16,game_id:83,name:"majiang",desc:0 },
      { key:63,type:21,game_id:139,name:"qkafish",desc:0 },
      { key:64,type:22,game_id:106,name:"luckyturn",desc:0 },
      { key:65,type:16,game_id:184,name:"majiang",desc:0 },
      { key:66,type:23,game_id:107,name:"horseracing",desc:0 },
        { key:67,type:24,game_id:201,name:"erbagang",desc:0 },
        { key:68,type:25,game_id:203,name:"blackjack",desc:0 },
        { key:69,type:26,game_id:202,name:"texas",desc:0 }
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

module.exports=data_game_update;