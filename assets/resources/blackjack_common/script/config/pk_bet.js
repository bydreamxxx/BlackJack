var data_pk_bet =
{
    items:
    [
      { key:1,bets:"5;10;15;20",max_bet:101,enter:"1,20000",control_bet_limit:"3000,100000,0" },
      { key:2,bets:"100;500;1000;2000",max_bet:10000001,enter:"20001,200000",control_bet_limit:"" },
      { key:3,bets:"1000;5000;10000;20000",max_bet:10000001,enter:"200001,800000",control_bet_limit:"" },
      { key:4,bets:"10000;20000;50000;100000",max_bet:10000001,enter:"800001,20000000",control_bet_limit:"" },
      { key:5,bets:"100000;200000;500000;1000000",max_bet:10000001,enter:"20000001,-1",control_bet_limit:"" }
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

module.exports=data_pk_bet;