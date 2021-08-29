var data_player_task =
{
    items:
    [
      { key:1,title:"完成1次游戏分享",desc:"",finish_type:1,trigger_num:1,reward_times:1,reward_item:"1001,500",active_num:20,transition:"gameyj_hall/prefabs/klb_hall_share" },
      { key:2,title:"在斗地主-金币场进行5次对局",desc:"",finish_type:2,trigger_num:5,reward_times:1,reward_item:"1001,200",active_num:15,transition:"type:32" },
      { key:3,title:"在（任意玩法）麻将-金币场进行5次对局",desc:"",finish_type:2,trigger_num:5,reward_times:1,reward_item:"1001,200",active_num:15,transition:"majiangheji" },
      { key:4,title:"参加3次比赛场",desc:"",finish_type:2,trigger_num:3,reward_times:1,reward_item:"1001,500",active_num:20,transition:"gameyj_hall/prefabs/klb_hall_Match" },
      { key:5,title:"完成1次充值",desc:"",finish_type:2,trigger_num:1,reward_times:1,reward_item:"1001,5000",active_num:50,transition:"gameyj_hall/prefabs/klb_hall_Shop" },
      { key:6,title:"完成1次红包兑换",desc:"",finish_type:2,trigger_num:1,reward_times:1,reward_item:"1001,1000",active_num:20,transition:"gameyj_hall/prefabs/klb_hall_Bag" },
      { key:7,title:"完成1次（任意玩法）约局",desc:"",finish_type:2,trigger_num:1,reward_times:1,reward_item:"1001,500",active_num:20,transition:"C_ROOM" },
      { key:8,title:"活跃值20",desc:"活跃值达到20可领取宝箱哦",finish_type:2,trigger_num:20,reward_times:1,reward_item:"1001,100",active_num:-1,transition:"" },
      { key:9,title:"活跃值40",desc:"活跃值达到40可领取宝箱哦",finish_type:2,trigger_num:40,reward_times:1,reward_item:"1001,200",active_num:-1,transition:"" },
      { key:11,title:"活跃值60",desc:"活跃值达到60可领取宝箱哦",finish_type:2,trigger_num:60,reward_times:1,reward_item:"1001,300",active_num:-1,transition:"" },
      { key:12,title:"活跃值80",desc:"活跃值达到80可领取宝箱哦",finish_type:2,trigger_num:80,reward_times:1,reward_item:"1001,500",active_num:-1,transition:"" },
      { key:13,title:"活跃值100",desc:"活跃值达到100可领取宝箱哦",finish_type:2,trigger_num:100,reward_times:1,reward_item:"1001,1000",active_num:-1,transition:"" }
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

module.exports=data_player_task;