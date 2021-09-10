var data_horse =
{
    items:
    [
      { key:1,enter_min:1000,enter_max:10000,bets:"2;10;20;100",max_bet:101,cheat:"-3,3000;-2,2000;-1,800;1,500;2,2000;3,3000",bet_time:25,open_time:44,control_bet_limit:"3000,100000,0",max_win:"200000000,200000000" },
      { key:2,enter_min:10001,enter_max:100000,bets:"100;500;1000;5000",max_bet:10000001,cheat:"",bet_time:0,open_time:0,control_bet_limit:"",max_win:"" },
      { key:3,enter_min:100001,enter_max:1000000,bets:"1000;5000;10000;50000",max_bet:10000001,cheat:"",bet_time:0,open_time:0,control_bet_limit:"",max_win:"" },
      { key:4,enter_min:1000001,enter_max:10000000,bets:"2000;10000;20000;100000",max_bet:10000001,cheat:"",bet_time:0,open_time:0,control_bet_limit:"",max_win:"" },
      { key:5,enter_min:10000001,enter_max:-1,bets:"20000;100000;200000;1000000",max_bet:10000001,cheat:"",bet_time:0,open_time:0,control_bet_limit:"",max_win:"" }
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

module.exports=data_horse;