var data_task =
{
    items:
    [
      { key:1,mainType:2,subType:13,prevId:0,level:0,awardExp:0,awardCoin:1000,awardTimes:1,awardItems:"1001,1000",selectItems:"",target:"",completeLevel:0,limit_time:"",trigger:"",title:"21点",desc:"完成3局21点",b_id:0,language_id:1 },
      { key:2,mainType:2,subType:13,prevId:0,level:0,awardExp:0,awardCoin:1000,awardTimes:1,awardItems:"1001,1000",selectItems:"",target:"",completeLevel:0,limit_time:"",trigger:"",title:"BLACKJACK",desc:"Complete 3 games of Blackjack",b_id:0,language_id:1 },
      { key:3,mainType:2,subType:13,prevId:0,level:0,awardExp:0,awardCoin:1000,awardTimes:1,awardItems:"1001,1000",selectItems:"",target:"",completeLevel:0,limit_time:"",trigger:"",title:"BLACKJACK",desc:"पूरा 3 'BLACKJACK'",b_id:0,language_id:1 }
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

module.exports=data_task;