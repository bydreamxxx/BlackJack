var data_teenPatti_cheat =
{
    items:
    [
      { key:-3,player:"1,2042;2,1917;3,1665;4,1542;5,1417;6,1417",robot:"1,1417;2,1417;3,1542;4,1665;5,1917;6,2042" },
      { key:-2,player:"1,1875;2,1875;3,1667;4,1667;5,1458;6,1458",robot:"1,1458;2,1458;3,1667;4,1667;5,1875;6,1875" },
      { key:-1,player:"1,1750;2,1875;3,1666;4,1583;5,1563;6,1563",robot:"1,1563;2,1563;3,1583;4,1666;5,1875;6,1750" },
      { key:0,player:"1,1667;2,1667;3,1665;4,1667;5,1667;6,1667",robot:"1,1667;2,1667;3,1667;4,1665;5,1667;6,1667" },
      { key:1,player:"1,1563;2,1563;3,1666;4,1583;5,1875;6,1750",robot:"1,1750;2,1875;3,1583;4,1666;5,1563;6,1563" },
      { key:2,player:"1,1458;2,1458;3,1667;4,1667;5,1875;6,1875",robot:"1,1875;2,1875;3,1667;4,1667;5,1458;6,1458" },
      { key:3,player:"1,200;2,3500;3,3000;4,941;5,1145;6,1214",robot:"1,6667;2,167;3,167;4,1091;5,954;6,954" }
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

module.exports=data_teenPatti_cheat;