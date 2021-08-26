var data_playerHonor =
{
    items:
    [
      { key:1,title:"荣誉等级",des:"1.在</c><color=#ff0000>金币场</color>完成对局，即可获得荣誉积分。\n2.每局房费的</c><color=#ff0000>1%</color>即为获得的荣誉积分点数。\n3.荣誉积分达到当前等级最大时自动晋级。\n4.荣誉等级不同，将获得不同的荣誉福利。" }
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

module.exports=data_playerHonor;