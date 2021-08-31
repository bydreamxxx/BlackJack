var data_giftsBag =
{
    items:
    [
      { key:10001,items:"1001,60000;1031,1;1008,10;1020,10;1021,10;1022,10;1023,10;1024,10;1025,10",name:"豪华礼包" },
      { key:10002,items:"1001,180000;1007,25;1008,25;1020,25",name:"1级vip礼包" },
      { key:10003,items:"1001,480000;1022,25;1023,25;1024,25",name:"2级vip礼包" },
      { key:10004,items:"1001,600000;1021,25;1025,25;1007,25",name:"3级vip礼包" },
      { key:10005,items:"1001,1000000;1008,25;1020,25;1022,25",name:"4级vip礼包" },
      { key:10006,items:"1001,1200000;1023,50;1024,50;1021,50;1025,50;1007,50",name:"5级vip礼包" },
      { key:10007,items:"1001,1500000;1008,50;1020,50;1022,50;1023,50;1024,50",name:"6级vip礼包" },
      { key:10008,items:"1001,2000000;1021,50;1025,50;1007,50;1008,50;1020,50",name:"7级vip礼包" },
      { key:10009,items:"1001,2500000;1022,100;1023,100;1024,100;1021,100;1025,100",name:"8级vip礼包" },
      { key:10010,items:"1001,3000000;1007,100;1008,100;1020,100;1022,100;1023,100",name:"9级vip礼包" },
      { key:10011,items:"1001,4000000;1024,100;1021,100;1025,100;1007,100;1008,100",name:"10级vip礼包" },
      { key:10012,items:"1001,6000000;1020,200;1022,200;1023,200;1024,200;1021,200",name:"11级vip礼包" },
      { key:10013,items:"1001,8000000;1025,200;1007,200;1008,200;1020,200;1022,200",name:"12级vip礼包" },
      { key:10014,items:"1001,10000000;1023,200;1024,200;1021,200;1025,200;1007,200",name:"13级vip礼包" },
      { key:10015,items:"1001,15000000;1008,300;1020,300;1022,300;1023,300;1024,300",name:"14级vip礼包" },
      { key:10016,items:"1001,20000000;1021,300;1025,300;1007,300;1008,300;1020,300",name:"15级vip礼包" },
      { key:10017,items:"1001,20000;1007,5;1008,5;1021,5;1025,5",name:"贵族月卡" },
      { key:10018,items:"1007,5;1008,5;1020,5;1021,5;1022,5",name:"魔法道具A" },
      { key:10019,items:"1023,5;1024,5;1025,5;1021,5;1022,5",name:"魔法道具B" },
      { key:10020,items:"1001,10000;1034,1;1008,5;1020,5;1021,5;1022,5;1023,5;1024,5;1025,5",name:"首充礼包" },
      { key:10021,items:"1001,30000;1035,1;1008,7;1020,7;1021,7;1022,7;1023,7;1024,7;1025,7",name:"进阶礼包" }
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

module.exports=data_giftsBag;