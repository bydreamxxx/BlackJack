var data_qA =
{
    items:
    [
      { key:1,text:"无法登录游戏",type:1 },
      { key:2,text:"忘记账号密码",type:1 },
      { key:3,text:"无法绑定手机",type:2 },
      { key:4,text:"游戏自动关闭",type:2 },
      { key:5,text:"如何充值金币",type:2 },
      { key:6,text:"充值没有到账",type:2 },
      { key:7,text:"赠送未收到金币",type:2 },
      { key:8,text:"忘记保险箱密码",type:2 },
      { key:9,text:"游戏卡死",type:2 },
      { key:10,text:"游戏自动退出",type:2 },
      { key:11,text:"获得的金币显示不正确",type:2 },
      { key:12,text:"其他",type:2 }
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

module.exports=data_qA;