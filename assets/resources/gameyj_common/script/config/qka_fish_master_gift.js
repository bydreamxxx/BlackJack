var data_qka_fish_master_gift =
{
    items:
    [
      { key:1,roomid:13901,level:1,bet:50000,need_bet:50000,gift:"2,75;5,15;10,10",desc:"普通礼包,可抽取2 5 10个礼券" },
      { key:2,roomid:13901,level:2,bet:200000,need_bet:200000,gift:"15,30;20,40;30,30",desc:"高级礼包,可抽取15 20 30个礼券" },
      { key:3,roomid:13901,level:3,bet:2000000,need_bet:2000000,gift:"75,30;100,50;150,20",desc:"至尊礼包,可抽取75 100 150个礼券" },
      { key:4,roomid:13902,level:1,bet:2000000,need_bet:2000000,gift:"50,25;100,50;150,25",desc:"普通礼包,可抽取50 100 150个礼券" },
      { key:5,roomid:13902,level:2,bet:6000000,need_bet:6000000,gift:"200,25;300,45;450,30",desc:"高级礼包,可抽取200 300 450个礼券" },
      { key:6,roomid:13902,level:3,bet:20000000,need_bet:20000000,gift:"500,20;1000,60;1500,20",desc:"至尊礼包,可抽取500 1000 1500个礼券" },
      { key:7,roomid:13903,level:1,bet:3000000,need_bet:3000000,gift:"50,25;100,50;150,25",desc:"普通礼包,可抽取50 100 150个礼券" },
      { key:8,roomid:13903,level:2,bet:9000000,need_bet:9000000,gift:"200,25;300,45;450,30",desc:"高级礼包,可抽取200 300 450个礼券" },
      { key:9,roomid:13903,level:3,bet:20000000,need_bet:20000000,gift:"500,20;1000,60;1500,20",desc:"至尊礼包,可抽取500 1000 1500个礼券" },
      { key:10,roomid:13904,level:1,bet:3000000,need_bet:3000000,gift:"50,25;100,50;150,25",desc:"普通礼包,可抽取50 100 150个礼券" },
      { key:11,roomid:13904,level:2,bet:9000000,need_bet:9000000,gift:"200,25;300,45;450,30",desc:"高级礼包,可抽取200 300 450个礼券" },
      { key:12,roomid:13904,level:3,bet:20000000,need_bet:20000000,gift:"500,20;1000,60;1500,20",desc:"至尊礼包,可抽取500 1000 1500个礼券" }
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

module.exports=data_qka_fish_master_gift;