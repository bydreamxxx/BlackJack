var data_qka_fish_master_audio =
{
    items:
    [
      { key:1,desc:"圆柱形场景背景音乐",audio_name:"bydr_bgm1",audio_probability:"10000" },
      { key:2,desc:"珊瑚鱼骨场景背景音乐",audio_name:"bydr_bgm2",audio_probability:"10000" },
      { key:3,desc:"珊瑚废船场景背景音乐",audio_name:"bydr_bgm3",audio_probability:"10000" },
      { key:4,desc:"第4张背景图背景音乐",audio_name:"bydr_bgm4",audio_probability:"10000" },
      { key:5,desc:"进入鱼潮动画音效",audio_name:"wave_enter",audio_probability:"10000" },
      { key:6,desc:"点击音效",audio_name:"gun_nobullet",audio_probability:"10000" },
      { key:7,desc:"炮台变换",audio_name:"gun_switch",audio_probability:"10000" },
      { key:8,desc:"1-5倍炮开炮",audio_name:"gun_1",audio_probability:"10000" },
      { key:9,desc:"6倍炮开炮",audio_name:"gun_40",audio_probability:"10000" },
      { key:10,desc:"8倍炮开炮",audio_name:"gun_100",audio_probability:"10000" },
      { key:11,desc:"10倍炮开炮",audio_name:"gun_70",audio_probability:"10000" },
      { key:12,desc:"15倍炮开炮",audio_name:"gun_500",audio_probability:"10000" },
      { key:13,desc:"冰冻弹使用音效",audio_name:"skill_ice",audio_probability:"10000" },
      { key:14,desc:"瞄准镜使用音效",audio_name:"skill_lock",audio_probability:"10000" },
      { key:15,desc:"打开商店音效",audio_name:"shop_open",audio_probability:"10000" },
      { key:16,desc:"购买道具成功",audio_name:"buy_success",audio_probability:"10000" },
      { key:17,desc:"打开鱼种介绍和音乐音效设置面板音效",audio_name:"button_click",audio_probability:"10000" },
      { key:18,desc:"1000倍鲨鱼死亡音效",audio_name:"fish_dabaisha",audio_probability:"10000" },
      { key:19,desc:"5000倍潜水艇死亡音效",audio_name:"oldfish_qianshuiting",audio_probability:"10000" },
      { key:20,desc:"1万倍美人鱼死亡音效",audio_name:"oldfish_meirenyu",audio_probability:"10000" },
      { key:21,desc:"小绿鱼受击音效",audio_name:"fish_duoliyu",audio_probability:"3000" },
      { key:22,desc:"草莓鱼受击音效",audio_name:"fish_fenhetun",audio_probability:"3000" },
      { key:23,desc:"水母受击音效",audio_name:"fish_huaqunyu",audio_probability:"3000" },
      { key:24,desc:"火箭鱼受击音效",audio_name:"fish_jianyu",audio_probability:"3000" },
      { key:25,desc:"小丑鱼受击音效",audio_name:"fish_jinchan",audio_probability:"3000" },
      { key:26,desc:"章鱼受击音效",audio_name:"fish_zhangyu",audio_probability:"3000" },
      { key:27,desc:"泳圈鱼受击音效",audio_name:"oldfish_yongquan",audio_probability:"3000" },
      { key:28,desc:"虎斑鱼受击音效",audio_name:"fish_dianman",audio_probability:"3000" },
      { key:29,desc:"河豚鱼受击音效",audio_name:"fish_jinsha",audio_probability:"3000" },
      { key:30,desc:"魔鬼鱼受击音效",audio_name:"fish_laowugui",audio_probability:"3000" },
      { key:31,desc:"冰冻鱼受击音效",audio_name:"fish_maliyu",audio_probability:"3000" },
      { key:32,desc:"虎鲸受击音效",audio_name:"oldfish_hujing",audio_probability:"3000" },
      { key:33,desc:"红包鱼死亡音效",audio_name:"fish_redbag",audio_probability:"10000" },
      { key:34,desc:"小绿鱼死亡音效",audio_name:"fish_shiziyu",audio_probability:"5000" },
      { key:35,desc:"草莓鱼死亡音效",audio_name:"fish_xiaochouyu",audio_probability:"5000" },
      { key:36,desc:"魔鬼鱼死亡音效",audio_name:"oldfish_moguiyu",audio_probability:"5000" },
      { key:37,desc:"100倍以上鱼爆炸音效",audio_name:"effect_boom",audio_probability:"10000" },
      { key:38,desc:"1000倍以下鱼金币获得",audio_name:"coin_fly",audio_probability:"10000" },
      { key:39,desc:"1000倍及以上鱼金币获得",audio_name:"boss_boom",audio_probability:"10000" },
      { key:40,desc:"打开窗口",audio_name:"windows_open",audio_probability:"5000" }
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

module.exports=data_qka_fish_master_audio;