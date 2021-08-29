var data_qyq_hongbaoshuoming =
{
    items:
    [
      { key:1,title:"发红包介绍:",content:"1.将金币以红包的形式派发，本亲友圈所有玩家（自己可抢）均可以抢该红包；\n2.默认拼手气红包：设置总金额和个数后，每个玩家抢到红包的金额随机，每人一次机会，抢完为止；\n3.剩余未抢完红包金额将在24小时后返还。" },
      { key:2,title:"领红包介绍:",content:"1.在亲友圈大厅及房间中均可领取红包；\n2.领取的红包金额将即时存入当前余额。" }
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

module.exports=data_qyq_hongbaoshuoming;