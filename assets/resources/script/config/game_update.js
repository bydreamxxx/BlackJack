var data_game_update =
{
    items:
    [
      { key:1,type:1,game_id:-1,name:"pkg",desc:0 },
      { key:2,type:2,game_id:-2,name:"pkgandroid",desc:0 },
      { key:3,type:3,game_id:-3,name:"main",desc:0 },
      { key:4,type:4,game_id:-4,name:"internal",desc:0 },
      { key:5,type:5,game_id:-5,name:"resources",desc:0 },
      { key:6,type:6,game_id:202,name:"gameyj_texas",desc:0 },
      { key:7,type:7,game_id:203,name:"blackjack_blackjack",desc:21 }
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