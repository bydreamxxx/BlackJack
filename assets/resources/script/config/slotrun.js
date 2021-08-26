var data_slotrun =
{
    items:
    [
      { key:1,startSpeed:2100,delayTime:0,lineLen:28,play_sub_type:101,col:1,gameid:0 },
      { key:2,startSpeed:2100,delayTime:0,lineLen:32,play_sub_type:101,col:2,gameid:0 },
      { key:3,startSpeed:2100,delayTime:0,lineLen:36,play_sub_type:101,col:3,gameid:0 },
      { key:4,startSpeed:2100,delayTime:0,lineLen:40,play_sub_type:101,col:4,gameid:0 },
      { key:5,startSpeed:2100,delayTime:0,lineLen:44,play_sub_type:101,col:5,gameid:0 },
      { key:6,startSpeed:100,delayTime:0,lineLen:20,play_sub_type:102,col:1,gameid:0 },
      { key:7,startSpeed:100,delayTime:0,lineLen:24,play_sub_type:102,col:2,gameid:0 },
      { key:8,startSpeed:100,delayTime:0,lineLen:28,play_sub_type:102,col:3,gameid:0 },
      { key:9,startSpeed:100,delayTime:0,lineLen:32,play_sub_type:102,col:4,gameid:0 },
      { key:10,startSpeed:100,delayTime:0,lineLen:36,play_sub_type:102,col:5,gameid:0 }
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

module.exports=data_slotrun;