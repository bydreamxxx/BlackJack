var data_pin3_cheat =
{
    items:
    [
      { key:-3,player:"1,2450;2,2300;3,1850;4,1700;5,1700",robot:"1,1700;2,1700;3,1850;4,2300;5,2450" },
      { key:-2,player:"1,2250;2,2250;3,2000;4,1750;5,1750",robot:"1,1750;2,1750;3,2000;4,2250;5,2250" },
      { key:-1,player:"1,2100;2,2250;3,1900;4,1875;5,1875",robot:"1,1875;2,1875;3,1900;4,2250;5,2100" },
      { key:0,player:"1,2000;2,2000;3,2000;4,2000;5,2000",robot:"1,2000;2,2000;3,2000;4,2000;5,2000" },
      { key:1,player:"1,1875;2,1875;3,1900;4,2250;5,2100",robot:"1,2100;2,2250;3,1900;4,1875;5,1875" },
      { key:2,player:"1,1750;2,1750;3,2000;4,2250;5,2250",robot:"1,2250;2,2250;3,2000;4,1750;5,1750" },
      { key:3,player:"1,1700;2,1700;3,1850;4,2300;5,2450",robot:"1,2450;2,2300;3,1850;4,1700;5,1700" }
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

module.exports=data_pin3_cheat;