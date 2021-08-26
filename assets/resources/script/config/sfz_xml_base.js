var data_sfz_xml_base =
{
    items:
    [
      { key:-1,name:"EXIT",weight:0,odds:0,position:"0;6;12;18" },
      { key:8,name:"铁斧",weight:3500,odds:2,position:"4;10;15;21" },
      { key:7,name:"银枪",weight:4250,odds:5,position:"2;9;20" },
      { key:6,name:"金刀",weight:4450,odds:10,position:"5;14;22" },
      { key:5,name:"鲁智深",weight:4500,odds:20,position:"1;8;16" },
      { key:4,name:"林冲",weight:4500,odds:50,position:"13;19" },
      { key:3,name:"宋江",weight:4500,odds:70,position:"7;17" },
      { key:2,name:"替天行道",weight:4500,odds:100,position:"11;23" },
      { key:1,name:"忠义堂",weight:4500,odds:200,position:"3" }
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

module.exports=data_sfz_xml_base;