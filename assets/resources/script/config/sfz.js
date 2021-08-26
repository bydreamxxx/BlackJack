var data_sfz =
{
    items:
    [
      { key:1,mini_times:5,mini_extra_rate:2500,win_rate:"1,15;2,15;3,14;4,13;5,12;6,12",odds:590,add_rate:0,multi_rate:"1,100,0;101,200,0;201,300,10;301,500,15;501,1000,20;1001,2500,25;2501,5000,40;5001,-1,50" },
      { key:2,mini_times:5,mini_extra_rate:2500,win_rate:"1,15;2,15;3,14;4,13;5,12;6,12",odds:590,add_rate:0,multi_rate:"1,100,0;101,200,0;201,300,10;301,500,15;501,1000,20;1001,2500,25;2501,5000,40;5001,-1,50" },
      { key:3,mini_times:5,mini_extra_rate:2500,win_rate:"1,15;2,15;3,14;4,13;5,12;6,12",odds:590,add_rate:0,multi_rate:"1,100,0;101,200,0;201,300,10;301,500,15;501,1000,20;1001,2500,25;2501,5000,40;5001,-1,50" },
      { key:4,mini_times:5,mini_extra_rate:2500,win_rate:"1,15;2,15;3,14;4,13;5,12;6,12",odds:590,add_rate:0,multi_rate:"1,100,0;101,200,0;201,300,10;301,500,15;501,1000,20;1001,2500,25;2501,5000,40;5001,-1,50" },
      { key:5,mini_times:5,mini_extra_rate:2500,win_rate:"1,15;2,15;3,14;4,13;5,12;6,12",odds:590,add_rate:0,multi_rate:"1,100,0;101,200,0;201,300,10;301,500,15;501,1000,20;1001,2500,25;2501,5000,40;5001,-1,50" },
      { key:6,mini_times:5,mini_extra_rate:2500,win_rate:"1,15;2,15;3,14;4,13;5,12;6,12",odds:590,add_rate:0,multi_rate:"1,100,0;101,200,0;201,300,10;301,500,15;501,1000,20;1001,2500,25;2501,5000,40;5001,-1,50" },
      { key:7,mini_times:5,mini_extra_rate:2500,win_rate:"1,45;2,45;3,42;4,40;5,40;6,35",odds:198,add_rate:0,multi_rate:"1,100,0;101,200,0;201,300,10;301,500,15;501,1000,20;1001,2500,25;2501,5000,40;5001,-1,50" },
      { key:8,mini_times:5,mini_extra_rate:2500,win_rate:"1,45;2,45;3,42;4,40;5,40;6,35",odds:198,add_rate:0,multi_rate:"1,100,0;101,200,0;201,300,10;301,500,15;501,1000,20;1001,2500,25;2501,5000,40;5001,-1,50" },
      { key:9,mini_times:5,mini_extra_rate:2500,win_rate:"1,45;2,45;3,42;4,40;5,40;6,35",odds:198,add_rate:0,multi_rate:"1,100,0;101,200,0;201,300,10;301,500,15;501,1000,20;1001,2500,25;2501,5000,40;5001,-1,50" },
      { key:10,mini_times:5,mini_extra_rate:2500,win_rate:"1,45;2,45;3,42;4,40;5,40;6,35",odds:198,add_rate:0,multi_rate:"1,100,0;101,200,0;201,300,10;301,500,15;501,1000,20;1001,2500,25;2501,5000,40;5001,-1,50" }
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

module.exports=data_sfz;