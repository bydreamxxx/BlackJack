var data_xiyou =
{
    items:
    [
      { key:1,enter_min:1000,enter_max:10000,bets:"2;10;20;100",max_bet:101,reward:"-3,0,9698,1,121,2,121,3,30,4,30;-2,0,9698,1,121,2,121,3,30,4,30;-1,0,9698,1,121,2,121,3,30,4,30;1,0,9698,1,121,2,121,3,30,4,30;2,0,9698,1,121,2,121,3,30,4,30;3,0,9698,1,121,2,121,3,30,4,30",cheat:"-3,3000;-2,2000;-1,800;1,500;2,2000;3,3000",bet_time:20,open_time:"0,21;1,33;2,45;3,55;4,20",bets_all:"2;10;20;100;500;1000;2000;5000;10000;20000;50000;100000;200000;1000000",control_bet_limit:"3000,100000,0",jackpoint_con:"10,10000,100000000",jack_pay:"24,10000" },
      { key:2,enter_min:10001,enter_max:100000,bets:"100;500;1000;5000",max_bet:10000001,reward:"",cheat:"",bet_time:0,open_time:"",bets_all:"2;10;20;100;500;1000;2000;5000;10000;20000;50000;100000;200000;1000000",control_bet_limit:"",jackpoint_con:"",jack_pay:"" },
      { key:3,enter_min:100001,enter_max:1000000,bets:"1000;5000;10000;50000",max_bet:10000001,reward:"",cheat:"",bet_time:0,open_time:"",bets_all:"2;10;20;100;500;1000;2000;5000;10000;20000;50000;100000;200000;1000000",control_bet_limit:"",jackpoint_con:"",jack_pay:"" },
      { key:4,enter_min:1000001,enter_max:10000000,bets:"2000;10000;20000;100000",max_bet:10000001,reward:"",cheat:"",bet_time:0,open_time:"",bets_all:"2;10;20;100;500;1000;2000;5000;10000;20000;50000;100000;200000;1000000",control_bet_limit:"",jackpoint_con:"",jack_pay:"" },
      { key:5,enter_min:10000001,enter_max:-1,bets:"20000;100000;200000;1000000",max_bet:10000001,reward:"",cheat:"",bet_time:0,open_time:"",bets_all:"2;10;20;100;500;1000;2000;5000;10000;20000;50000;100000;200000;1000000",control_bet_limit:"",jackpoint_con:"",jack_pay:"" }
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

module.exports=data_xiyou;