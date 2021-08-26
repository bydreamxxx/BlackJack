var data_fenxiangyouli =
{
    items:
    [
      { key:1,channel:0,title:"分享好礼：",content:"A.发出邀请：通过微信发出邀请链接，受邀玩家下载游戏，即可形成绑定关系；\nB.完成任务：受邀玩家的游戏活跃值到达<color=#D30005>100</c>时，即完成任务，邀请人<color=#D30005>10元</c>即时红包、受邀人<color=#D30005>5元</c>即时红包；\nC.额外奖励：受邀玩家，在游戏中完成充值，邀请玩家可获得<color=#D30005>10%</c>金币奖励",index:1 },
      { key:2,channel:10000,title:"充值返利：",content:"邀请的好友在游戏中成功充值后，充值者获得金币的<color=#D30005>10%</c>以返利的形式奖励给您。",index:1 },
      { key:3,channel:10000,title:"游戏返利：",content:"根据邀请好友在游戏中积累的活跃度，每日奖励您一定比例金币。",index:2 },
      { key:4,channel:10001,title:"充值返利：",content:"邀请的好友在游戏中成功充值后，充值者获得金币的<color=#D30005>10%</c>以返利的形式奖励给您。",index:1 },
      { key:5,channel:10001,title:"游戏返利：",content:"根据邀请好友在游戏中积累的活跃度，每日奖励您一定比例金币。",index:2 },
      { key:6,channel:10002,title:"充值返利：",content:"邀请的好友在游戏中成功充值后，充值者获得金币的<color=#D30005>10%</c>以返利的形式奖励给您。",index:1 },
      { key:7,channel:10002,title:"游戏返利：",content:"根据邀请好友在游戏中积累的活跃度，每日奖励您一定比例金币。",index:2 },
      { key:8,channel:10003,title:"充值返利：",content:"邀请的好友在游戏中成功充值后，充值者获得金币的<color=#D30005>10%</c>以返利的形式奖励给您。",index:1 },
      { key:9,channel:10003,title:"游戏奖励：",content:"根据邀请好友在游戏中积累的活跃度，每日奖励您一定比例金币。",index:2 },
      { key:10,channel:10004,title:"充值奖励：",content:"邀请的好友在游戏中成功充值后，充值者获得金币的<color=#D30005>10%</c>以返利的形式奖励给您。",index:1 },
      { key:11,channel:10004,title:"游戏奖励：",content:"根据邀请好友在游戏中积累的活跃度，每日奖励您一定比例金币。",index:2 },
      { key:12,channel:10005,title:"充值奖励：",content:"邀请的好友在游戏中成功充值后，充值者获得金币的<color=#D30005>10%</c>以返利的形式奖励给您。",index:1 },
      { key:13,channel:10005,title:"游戏奖励：",content:"根据邀请好友在游戏中积累的活跃度，每日奖励您一定比例金币。",index:2 }
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

module.exports=data_fenxiangyouli;