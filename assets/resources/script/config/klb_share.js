var data_klb_share =
{
    items:
    [
      { key:1,title:"【巷乐游戏】斗地主！抢红包！最高可领100元",content:"【巷乐游戏】快来玩，免费参赛，送红包！送金币！人人有份！速来>>>" },
      { key:2,title:"【巷乐游戏】送金币，送房卡，亲友约局必备，还能赢红包！",content:"领红包：【斗地主专享】亲测！10元红包已到手！巷乐斗地主红包赛，一把一提，快来！！！" },
      { key:3,title:"【巷乐棋牌】东北特色棋牌经典玩法，还有红包送不停！",content:"【巷乐棋牌】10元红包，斗地主红包赛，即时兑换，大家快来！" },
      { key:4,title:"【巷乐棋牌】东北最好玩的麻将和扑克都在这里！",content:"赢红包:巷乐邀你一起斗地主，免费赢红包，给足你的零花钱！" }
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

module.exports=data_klb_share;