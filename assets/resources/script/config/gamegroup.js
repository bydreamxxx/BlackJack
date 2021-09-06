var data_gamegroup =
{
    items:
    [
      { key:1,name:"捕鱼合集",gameid:"138;139" },
      { key:2,name:"麻将合集",gameid:"23;13;21;56;159;162;164;166;169;171;172;173;178;181;182;183" },
      { key:3,name:"小刺激",gameid:"101;103;102;104;105;106;143;107;201" },
      { key:4,name:"打地鼠",gameid:"110" }
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

module.exports=data_gamegroup;