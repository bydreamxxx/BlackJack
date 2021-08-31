var data_qka_fish_master_chat =
{
    items:
    [
      { key:1,text:"悠着点，留点鱼儿给我打吧！" },
      { key:2,text:"很抱歉，这条大鱼是我的啦~" },
      { key:3,text:"糟糕，这一炮没打好！" },
      { key:4,text:"真不好意思，又中大奖了！" },
      { key:5,text:"哎哟喂，一夜回到解放前~" },
      { key:6,text:"有没有搞错~什么情况？" },
      { key:7,text:"鲨鱼鲨鱼哪里跑！" }
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

module.exports=data_qka_fish_master_chat;