var data_tradeShop =
{
    items:
    [
      { key:1001,icon:"sc-shouchon",cost_itemid:1005,cost_item_count:600,cost_discount:0,itemid:10000001,item_count:1,stock_count:100,type:1,dec:"大白菜1斤" },
      { key:1002,icon:"sc-yueka",cost_itemid:1005,cost_item_count:12800,cost_discount:2800,itemid:10000002,item_count:1,stock_count:100,type:1,dec:"大白菜2斤" },
      { key:1003,icon:"f1",cost_itemid:1005,cost_item_count:600,cost_discount:0,itemid:10000003,item_count:1,stock_count:100,type:1,dec:"大白菜3斤" },
      { key:1004,icon:"d1",cost_itemid:1005,cost_item_count:600,cost_discount:0,itemid:10000004,item_count:1,stock_count:100,type:1,dec:"大白菜4斤" },
      { key:1005,icon:"d2",cost_itemid:1005,cost_item_count:1200,cost_discount:0,itemid:10000005,item_count:1,stock_count:100,type:1,dec:"大白菜5斤" },
      { key:1006,icon:"d3",cost_itemid:1005,cost_item_count:3000,cost_discount:0,itemid:10000006,item_count:1,stock_count:100,type:1,dec:"大白菜6斤" },
      { key:1007,icon:"d4",cost_itemid:1005,cost_item_count:5000,cost_discount:0,itemid:10000007,item_count:1,stock_count:100,type:1,dec:"大白菜7斤" },
      { key:1008,icon:"d5",cost_itemid:1005,cost_item_count:9800,cost_discount:0,itemid:10000008,item_count:1,stock_count:100,type:1,dec:"大白菜8斤" },
      { key:1009,icon:"d5",cost_itemid:1005,cost_item_count:18800,cost_discount:0,itemid:10000009,item_count:1,stock_count:100,type:1,dec:"大白菜9斤" },
      { key:1010,icon:"d6",cost_itemid:1005,cost_item_count:44800,cost_discount:0,itemid:10000010,item_count:1,stock_count:100,type:1,dec:"大白菜10斤" },
      { key:1011,icon:"d2",cost_itemid:1005,cost_item_count:15,cost_discount:0,itemid:10000011,item_count:1,stock_count:100,type:2,dec:"大白菜11斤" },
      { key:1012,icon:"sc-daojubao",cost_itemid:1005,cost_item_count:200000,cost_discount:0,itemid:10000012,item_count:1,stock_count:100,type:2,dec:"大白菜12斤" },
      { key:1013,icon:"sc-daojubao",cost_itemid:1005,cost_item_count:200000,cost_discount:0,itemid:10000013,item_count:1,stock_count:100,type:2,dec:"大白菜13斤" },
      { key:1014,icon:"f1",cost_itemid:1005,cost_item_count:80000,cost_discount:0,itemid:10000014,item_count:1,stock_count:100,type:2,dec:"大白菜14斤" },
      { key:1015,icon:"sc-fanqie",cost_itemid:1005,cost_item_count:200000,cost_discount:0,itemid:10000015,item_count:1,stock_count:100,type:2,dec:"大白菜15斤" },
      { key:1016,icon:"sc-zuichun",cost_itemid:1005,cost_item_count:200000,cost_discount:0,itemid:10000016,item_count:1,stock_count:100,type:3,dec:"大白菜16斤" },
      { key:1017,icon:"sc-fafa",cost_itemid:1005,cost_item_count:200000,cost_discount:0,itemid:10000017,item_count:1,stock_count:100,type:3,dec:"大白菜17斤" },
      { key:1018,icon:"sc-jigege",cost_itemid:1005,cost_item_count:200000,cost_discount:0,itemid:10000018,item_count:1,stock_count:100,type:3,dec:"大白菜18斤" },
      { key:1019,icon:"sc-dan",cost_itemid:1005,cost_item_count:200000,cost_discount:0,itemid:10000019,item_count:1,stock_count:100,type:4,dec:"大白菜19斤" },
      { key:1020,icon:"sc-jiubei",cost_itemid:1005,cost_item_count:200000,cost_discount:0,itemid:10000020,item_count:1,stock_count:100,type:5,dec:"大白菜20斤" },
      { key:1021,icon:"sc-zadan",cost_itemid:1005,cost_item_count:100000,cost_discount:0,itemid:10000021,item_count:1,stock_count:100,type:5,dec:"大白菜21斤" }
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

module.exports=data_tradeShop;