var data_activity =
{
    items:
    [
      { key:4,sort:2,content:"红包天天领",isopen:"0",ui:"klb_hall_daily_active_HB" },
      { key:2,sort:4,content:"Sevenday",isopen:"0",ui:"klb_hall_daily_active_QD" },
      { key:3,sort:5,content:"实名认证",isopen:"0",ui:"klb_hall_daily_active_SM" },
      { key:1,sort:1,content:"房卡代理",isopen:"0",ui:"klb_hall_daily_active_FK" },
      { key:5,sort:6,content:"VIP特权",isopen:"0",ui:"klb_hall_daily_active_VIP" },
      { key:6,sort:7,content:"国庆活动",isopen:"0",ui:"klb_hall_daily_active_NDA" },
      { key:7,sort:0,content:"春节翻翻乐",isopen:"0",ui:"klb_hall_daily_active_CJ" },
      { key:8,sort:3,content:"分享有礼",isopen:"0",ui:"klb_hall_daily_active_FX" },
      { key:9,sort:-1,content:"捕鱼狂欢季",isopen:"0",ui:"klb_hall_daily_active_BYDR" }
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

module.exports=data_activity;