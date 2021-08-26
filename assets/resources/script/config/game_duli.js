var data_game_duli =
{
    items:
    [
      { key:1,gameName:"快乐吧长春麻将",pID:2,gameid:13,loadScene_Bg:"gamedl_majiang/texture/BG.png",loadScene_Log:"",gamedl_login_BG:"",gamedl_login_log:"",gamedl_hall_jinbi:"",gamedl_hall_cf:"",gamedl_hall_jf:"",gamedl_hall_jl:"",gamedl_hall_gd:"" },
      { key:2,gameName:"快乐吧填大坑",pID:3,gameid:41,loadScene_Bg:"gamedl_majiang/texture/tdk/BGbg.png",loadScene_Log:"gamedl_majiang/texture/tdk/BGlogo.png",gamedl_login_BG:"gamedl_majiang/texture/tdk/BGbg.png",gamedl_login_log:"gamedl_majiang/texture/tdk/BGlogo.png",gamedl_hall_jinbi:"gamedl_majiang/texture/tdk/BGjb.png",gamedl_hall_cf:"gamedl_majiang/texture/tdk/BGcj.png",gamedl_hall_jf:"gamedl_majiang/texture/tdk/BGjr.png",gamedl_hall_jl:"gamedl_majiang/texture/tdk/BGjlb.png",gamedl_hall_gd:"gamedl_majiang/texture/tdk/BGgd.png" },
      { key:3,gameName:"巷乐斗地主",pID:4,gameid:32,loadScene_Bg:"gamedl_majiang/texture/tdk/BGbg.png",loadScene_Log:"gamedl_majiang/texture/tdk/xl-logo-ddzh.png",gamedl_login_BG:"gamedl_majiang/texture/tdk/BGbg.png",gamedl_login_log:"gamedl_majiang/texture/tdk/xl-logo-ddzh.png",gamedl_hall_jinbi:"gamedl_majiang/texture/tdk/BGjb.png",gamedl_hall_cf:"gamedl_majiang/texture/tdk/BGcj.png",gamedl_hall_jf:"gamedl_majiang/texture/tdk/BGjr.png",gamedl_hall_jl:"gamedl_majiang/texture/tdk/BGjlb.png",gamedl_hall_gd:"gamedl_majiang/texture/tdk/BGgd.png" }
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

module.exports=data_game_duli;