var data_lucky_turntable =
{
    items:
    [
      { key:1,enter_min:1000,enter_max:20000,bets:"1;10;100;1000",max_bet:101,reward:"-3,0,9400,1,240,2,240,3,120;-2,0,9400,1,240,2,240,3,120;-1,0,9400,1,240,2,240,3,120;1,0,9400,1,240,2,240,3,120;2,0,9400,1,240,2,240,3,120;3,0,9400,1,240,2,240,3,120;",bet_time:30,open_time:"0,35;1,59;2,74;3,38",bets_all:"1;10;100;1000;10000;100000;1000000",control_bet_limit:"3000,100000,0" },
      { key:2,enter_min:20001,enter_max:2000000,bets:"10;100;1000;10000",max_bet:10000001,reward:"",bet_time:0,open_time:"",bets_all:"1;10;100;1000;10000;100000;1000000",control_bet_limit:"" },
      { key:3,enter_min:2000001,enter_max:10000000,bets:"100;1000;10000;100000",max_bet:10000001,reward:"",bet_time:0,open_time:"",bets_all:"1;10;100;1000;10000;100000;1000000",control_bet_limit:"" },
      { key:4,enter_min:10000001,enter_max:-1,bets:"1000;10000;100000;1000000",max_bet:10000001,reward:"",bet_time:0,open_time:"",bets_all:"1;10;100;1000;10000;100000;1000000",control_bet_limit:"" }
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

module.exports=data_lucky_turntable;