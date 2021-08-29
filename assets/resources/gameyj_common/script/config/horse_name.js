var data_horse_name =
{
    items:
    [
      { key:1,name:"澳斯卡" },
      { key:2,name:"霸胜" },
      { key:3,name:"百步穿云" },
      { key:4,name:"必得胜" },
      { key:5,name:"冰糖葫芦" },
      { key:6,name:"财宝家驹" },
      { key:7,name:"彩福" },
      { key:8,name:"赤兔宝驹" },
      { key:9,name:"赤兔宝马" },
      { key:10,name:"传奇" },
      { key:11,name:"翠龙" },
      { key:12,name:"大美人" },
      { key:13,name:"大运起" },
      { key:14,name:"帝胜之星" },
      { key:15,name:"帝腾之星" },
      { key:16,name:"发盈喜" },
      { key:17,name:"放马过来" },
      { key:18,name:"飞飞觉醒" },
      { key:19,name:"非常坚" },
      { key:20,name:"海龙" },
      { key:21,name:"好吉利" },
      { key:22,name:"黑马王子" },
      { key:23,name:"红旗福星" },
      { key:24,name:"红星" },
      { key:25,name:"火箭驹" },
      { key:26,name:"火麒麟" },
      { key:27,name:"吉利马王" },
      { key:28,name:"佳胜驹" },
      { key:29,name:"金刚" },
      { key:30,name:"金龙神驹" },
      { key:31,name:"金如意" },
      { key:32,name:"蓝天堡马" },
      { key:33,name:"龙城猛将" },
      { key:34,name:"龙之星" },
      { key:35,name:"马上发财" },
      { key:36,name:"美丽宝贝" },
      { key:37,name:"美丽传承" },
      { key:38,name:"魅力宝贝" },
      { key:39,name:"魅力之子" },
      { key:40,name:"千金一诺" },
      { key:41,name:"深爱" },
      { key:42,name:"神马飞扬" },
      { key:43,name:"神舟小子" },
      { key:44,name:"胜得威" },
      { key:45,name:"胜利仔" },
      { key:46,name:"天下为攻" },
      { key:47,name:"添好运" },
      { key:48,name:"万马飞腾" },
      { key:49,name:"威威欢星" },
      { key:50,name:"西方快车" },
      { key:51,name:"小巨人" },
      { key:52,name:"小鸟翱翔" },
      { key:53,name:"笑傲非凡" },
      { key:54,name:"幸运" },
      { key:55,name:"幸运形容" },
      { key:56,name:"幸运兴隆" },
      { key:57,name:"一定赚" },
      { key:58,name:"一哥" },
      { key:59,name:"银亮福将" },
      { key:60,name:"银亮福星" },
      { key:61,name:"永冠王" },
      { key:62,name:"勇福星" },
      { key:63,name:"勇冠王" },
      { key:64,name:"至尊威龙" },
      { key:65,name:"中华盛世" },
      { key:66,name:"中华之光" }
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

module.exports=data_horse_name;