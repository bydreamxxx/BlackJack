var data_gameGuide =
{
    items:
    [
      { key:1,gameid:105,gameName:"西游记",isopen:1,image:"xiyouji" },
      { key:2,gameid:104,gameName:"飞禽走兽",isopen:1,image:"feiqinzoushou" },
      { key:3,gameid:103,gameName:"单挑",isopen:1,image:"dantiao" },
      { key:4,gameid:143,gameName:"红包扫雷",isopen:0,image:"hongbaosaolei" },
      { key:5,gameid:109,gameName:"疯狂拼十",isopen:1,image:"fengkuangpinshi" },
      { key:6,gameid:102,gameName:"财神到",isopen:0,image:"caishendao" }
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

module.exports=data_gameGuide;