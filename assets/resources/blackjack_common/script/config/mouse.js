var data_mouse =
{
    items:
    [
      { key:1,max_power:5000,max_anger:1000,recover:"10,5",hammer:"1,100,0,0;2,200,0,0;3,500,0,5;4,1000,1,10;5,2000,2,20;6,3000,3,30;7,5000,5,50;8,0,0,-1000",ex_reward:"5000,6000;10000,2000;20000,1000",init:"1001,1600;1002,1600;1003,1600;1004,1600;2001,800;3001,800;4001,800;5001,400;6001,400;7001,400",drum_rate:400,rank_reward:"1,1,10000;2,2,8000;3,3,5000;4,10,3000;11,50,1000" }
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

module.exports=data_mouse;