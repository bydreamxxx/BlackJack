var data_loading_cfg =
{
    items:
    [
      { key:"water_margin_slot",scenename:"slot_loading" },
      { key:"mammon_slot_Scene",scenename:"mammon_slot_loading" },
      { key:"birds_and_animals_scene",scenename:"birds_and_animals_loading" },
      { key:"fish_scene",scenename:"fish_loading_scene" },
      { key:"fish_doyen_scene",scenename:"fish_doyen_loading_scene" }
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

module.exports=data_loading_cfg;