var data_sfz_base =
{
    items:
    [
      { key:1,name:"CHI_3",icon_weight:"0,912;1,522;2,784;3,837;4,1150;5,1203;6,1464;7,1569;8,1559",limit:55,blood_state:3 },
      { key:2,name:"CHI_2",icon_weight:"0,1043;1,421;2,579;3,790;4,1053;5,1159;6,1422;7,1580;8,1953",limit:55,blood_state:2 },
      { key:3,name:"CHI_1",icon_weight:"0,981;1,450;2,751;3,801;4,1102;5,1152;6,1402;7,1503;8,1858",limit:80,blood_state:1 },
      { key:4,name:"TU_1",icon_weight:"0,870;1,455;2,760;3,810;4,1115;5,1166;6,1419;7,1521;8,1884",limit:400,blood_state:-1 },
      { key:5,name:"TU_2",icon_weight:"0,925;1,452;2,755;3,805;4,1108;5,1159;6,1410;7,1512;8,1874",limit:400,blood_state:-2 },
      { key:6,name:"TU_3",icon_weight:"0,981;1,450;2,751;3,801;4,1102;5,1152;6,1402;7,1503;8,1858",limit:450,blood_state:-3 }
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

module.exports=data_sfz_base;