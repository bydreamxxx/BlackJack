var data_pin3 =
{
    items:
    [
      { key:1,mingzhu:"1,2;2,4;3,8;4,16;5,20",anzhu:"1,1;2,2;3,4;4,8;5,10",limit_give_up:0,limit_cmp:0,limit_fire:0,limit_circle:0,limit_score:0,limit_watch:0,limit_try:0,coin_type:"1,1;2,2;3,5;4,10;5,20" },
      { key:2,mingzhu:"1,2;2,5;3,10;4,20;5,40",anzhu:"1,1;2,2;3,5;4,10;5,20",limit_give_up:0,limit_cmp:0,limit_fire:0,limit_circle:0,limit_score:0,limit_watch:0,limit_try:0,coin_type:"1,1;2,5;3,10;4,20;5,50" },
      { key:13501,mingzhu:"1,200;2,400;3,800;4,1600;5,2000",anzhu:"1,100;2,200;3,400;4,800;5,1000",limit_give_up:1,limit_cmp:3,limit_fire:4,limit_circle:10,limit_score:200000,limit_watch:2,limit_try:1,coin_type:"1,100;2,200;3,500;4,1000;5,2000" },
      { key:13502,mingzhu:"1,2000;2,4000;3,8000;4,16000;5,20000",anzhu:"1,1000;2,2000;3,4000;4,8000;5,10000",limit_give_up:1,limit_cmp:3,limit_fire:4,limit_circle:20,limit_score:3000000,limit_watch:2,limit_try:1,coin_type:"1,1000;2,2000;3,5000;4,10000;5,20000" },
      { key:13503,mingzhu:"1,10000;2,20000;3,40000;4,80000;5,100000",anzhu:"1,5000;2,10000;3,20000;4,40000;5,50000",limit_give_up:1,limit_cmp:3,limit_fire:4,limit_circle:20,limit_score:15000000,limit_watch:2,limit_try:1,coin_type:"1,5000;2,10000;3,20000;4,50000;5,100000" },
      { key:13504,mingzhu:"1,20000;2,40000;3,80000;4,160000;5,200000",anzhu:"1,10000;2,20000;3,40000;4,80000;5,100000",limit_give_up:1,limit_cmp:3,limit_fire:4,limit_circle:30,limit_score:40000000,limit_watch:2,limit_try:1,coin_type:"1,10000;2,20000;3,50000;4,100000;5,200000" }
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

module.exports=data_pin3;