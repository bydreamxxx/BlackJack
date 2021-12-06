var data_texas_ai_1 =
{
    items:
    [
      { key:1,type:1,c_1:"3,3000;2,2000;1,1000;-3,3000;-2,2000;-1,1000;100,5000",c_2:"" },
      { key:2,type:2,c_1:"3,20;2,10;1,5;-3,20;-2,10;-1,5;100,20",c_2:"1,30;2,5;3,1;4,5;5,5" },
      { key:3,type:3,c_1:"1,4000,6000;2,3000,7000;3,1000,9000;4,0,10000,5,0,10000",c_2:"1,30,2000;2,30,1000;3,30,500;4,30,0,5,30,0" },
      { key:4,type:3,c_1:"0,2,1,2,1000;1,1,3,1,1000;1,1,1,1,1000,2,1,0,1,1000",c_2:"3,1,0,0,1000;2,2,1,0,1000;3,1,1,1,1000,2,3,0,1,1000" },
      { key:5,type:4,c_1:"1,10000;2,6000;3,5000;4,3000;5,2000;6,1000;7,500;8,500;9,500",c_2:"" },
      { key:6,type:5,c_1:"1,2,5;2,10,15;3,20,30;4,30,50;5,40,60;6,50,80;7,80,100;8,80,100;9,100,100",c_2:"" }
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

module.exports=data_texas_ai_1;