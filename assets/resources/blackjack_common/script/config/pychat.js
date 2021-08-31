var data_pychat =
{
    items:
    [
      { key:1,msg:"要啥?",soundName:"" },
      { key:2,msg:"单",soundName:"" },
      { key:3,msg:"双",soundName:"" },
      { key:4,msg:"龙",soundName:"" },
      { key:5,msg:"幺",soundName:"" },
      { key:6,msg:"我来!",soundName:"" },
      { key:7,msg:"合理不?",soundName:"" },
      { key:8,msg:"不合理",soundName:"" },
      { key:9,msg:"加分!",soundName:"" },
      { key:10,msg:"放放放",soundName:"" },
      { key:11,msg:"管不上",soundName:"" },
      { key:12,msg:"打打打",soundName:"" },
      { key:13,msg:"我沉了",soundName:"" },
      { key:14,msg:"你先走",soundName:"" },
      { key:15,msg:"我跑了",soundName:"" }
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

module.exports=data_pychat;