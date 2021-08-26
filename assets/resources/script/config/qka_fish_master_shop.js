var data_qka_fish_master_shop =
{
    items:
    [
      { key:1,icon:"bydr-icon3",cost:1000,itemid:1001,item_count:120000,vip_level:-1,count_1:-1,count_2:-1,type:1,dec:"12万金币" },
      { key:2,icon:"bydr-icon3",cost:5400,itemid:1001,item_count:600000,vip_level:-1,count_1:-1,count_2:-1,type:1,dec:"60万金币" },
      { key:3,icon:"bydr-icon3",cost:13500,itemid:1001,item_count:1500000,vip_level:-1,count_1:-1,count_2:-1,type:1,dec:"150万金币" },
      { key:4,icon:"bydr-icon3",cost:200,itemid:1004,item_count:200,vip_level:-1,count_1:-1,count_2:1,type:2,dec:"红包2元" },
      { key:5,icon:"bydr-icon3",cost:1000,itemid:1004,item_count:1000,vip_level:1,count_1:-1,count_2:1,type:2,dec:"红包10元" },
      { key:6,icon:"bydr-icon3",cost:2000,itemid:1004,item_count:2000,vip_level:2,count_1:-1,count_2:1,type:2,dec:"红包20元" },
      { key:7,icon:"bydr-icon3",cost:5000,itemid:1004,item_count:5000,vip_level:3,count_1:-1,count_2:1,type:2,dec:"红包50元" },
      { key:8,icon:"bydr-icon3",cost:10000,itemid:1004,item_count:10000,vip_level:4,count_1:-1,count_2:1,type:2,dec:"红包100元" },
      { key:9,icon:"bydr-icon3",cost:50000,itemid:1004,item_count:50000,vip_level:5,count_1:-1,count_2:1,type:2,dec:"红包500元" },
      { key:10,icon:"bydr-icon3",cost:10000,itemid:10022,item_count:1,vip_level:4,count_1:-1,count_2:1,type:3,dec:"京东卡100" }
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

module.exports=data_qka_fish_master_shop;