var data_horse_rank =
{
    items:
    [
      { key:1,horse_id:"1;2;3;4;5;6;7;8;9;10;61" },
      { key:2,horse_id:"11;12;13;14;15;16;17;18;19;20;62" },
      { key:3,horse_id:"21;22;23;24;25;26;27;28;29;30;63" },
      { key:4,horse_id:"31;32;33;34;35;36;37;38;39;40;64" },
      { key:5,horse_id:"41;42;43;44;45;46;47;48;49;50;65" },
      { key:6,horse_id:"51;52;53;54;55;56;57;58;59;60;66" }
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

module.exports=data_horse_rank;