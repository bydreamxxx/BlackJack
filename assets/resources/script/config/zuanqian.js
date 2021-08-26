var data_zuanqian =
{
    items:
    [
      { key:1,wx_id:"XLdl001",pics:"zhuanqian1,zhuanqian2,zhuanqian3",content:"购买房卡请联系" },
      { key:2,wx_id:"XLbs7777",pics:"shenbanbisai",content:"申办比赛请添加微信" }
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

module.exports=data_zuanqian;