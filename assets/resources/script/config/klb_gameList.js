var data_klb_gameList =
{
    items:
    [
      { key:1,gameid:202,name:"TexasHoldemTitle",gamenameicon:"dt-dezhou",gametitle:"title-dezhou",gameruleui:"",chongfu:0,isfriend:0,type:1,isopen:1,share_img_name:"share1.jpg;share2.jpg;share3.jpg;share4.jpg",connect_f_id:202,priority:4,isclick:1,ishot:0,isxiaociji:0,isdefault:1,icon_color:1,club_icon:"qh_dousanzhang_zi",game_table:2,game_spine:"",spine_offset:"",ty:"" },
      { key:2,gameid:203,name:"blackjackTitle",gamenameicon:"dt-ershiyi",gametitle:"title-ershiyi",gameruleui:"",chongfu:0,isfriend:0,type:1,isopen:1,share_img_name:"share1.jpg;share2.jpg;share3.jpg;share4.jpg",connect_f_id:203,priority:4,isclick:1,ishot:0,isxiaociji:0,isdefault:1,icon_color:1,club_icon:"qh_ershiyi_zi",game_table:2,game_spine:"",spine_offset:"",ty:"" },
      { key:3,gameid:185,name:"Rummy",gamenameicon:"dt-rummy",gametitle:"title-rummy",gameruleui:"",chongfu:0,isfriend:0,type:1,isopen:1,share_img_name:"share1.jpg;share2.jpg;share3.jpg;share4.jpg",connect_f_id:185,priority:4,isclick:1,ishot:0,isxiaociji:0,isdefault:1,icon_color:1,club_icon:"qh_rummy_zi",game_table:2,game_spine:"",spine_offset:"",ty:"" },
      { key:4,gameid:186,name:"teenpatti",gamenameicon:"dt-teenpatti",gametitle:"title-teenpatti",gameruleui:"",chongfu:0,isfriend:0,type:1,isopen:1,share_img_name:"share1.jpg;share2.jpg;share3.jpg;share4.jpg",connect_f_id:186,priority:4,isclick:1,ishot:0,isxiaociji:0,isdefault:1,icon_color:1,club_icon:"qh_teenpatti_zi",game_table:2,game_spine:"",spine_offset:"",ty:"" }
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

module.exports=data_klb_gameList;