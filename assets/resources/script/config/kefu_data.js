var data_kefu_data =
{
    items:
    [
      { key:1,title:"游戏微信客服",content:"XLdl001" },
      { key:2,title:"游戏微信客服",content:"XLcs002" },
      { key:3,title:"游戏微信客服",content:"XLcs003" },
      { key:4,title:"吉林麻将房卡",content:"XLJL001" },
      { key:5,title:"吉林麻将房卡",content:"XLJL002" }
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

module.exports=data_kefu_data;