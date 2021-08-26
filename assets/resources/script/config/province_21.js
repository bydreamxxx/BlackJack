var data_province_21 =
{
    items:
    [
      { key:1,province:"辽宁省",city:"阜新",area:"阜新市",mjgame:"159",pkgame:"",citycode:2109,hall_icon:"dt-changchun-logo",game_icon:"dd_logo3_icon" },
      { key:2,province:"辽宁省",city:"阜新",area:"海州区",mjgame:"159",pkgame:"",citycode:2109,hall_icon:"dt-changchun-logo",game_icon:"dd_logo3_icon" },
      { key:3,province:"辽宁省",city:"阜新",area:"新邱区",mjgame:"159",pkgame:"",citycode:2109,hall_icon:"dt-changchun-logo",game_icon:"dd_logo3_icon" },
      { key:4,province:"辽宁省",city:"阜新",area:"太平区",mjgame:"159",pkgame:"",citycode:2109,hall_icon:"dt-changchun-logo",game_icon:"dd_logo3_icon" },
      { key:5,province:"辽宁省",city:"阜新",area:"清河门区",mjgame:"159",pkgame:"",citycode:2109,hall_icon:"dt-changchun-logo",game_icon:"dd_logo3_icon" },
      { key:6,province:"辽宁省",city:"阜新",area:"细河区",mjgame:"159",pkgame:"",citycode:2109,hall_icon:"dt-changchun-logo",game_icon:"dd_logo3_icon" },
      { key:7,province:"辽宁省",city:"阜新",area:"蒙古族自治县",mjgame:"159",pkgame:"",citycode:2109,hall_icon:"dt-changchun-logo",game_icon:"dd_logo3_icon" },
      { key:8,province:"辽宁省",city:"锦州",area:"锦州市",mjgame:"171",pkgame:"",citycode:2107,hall_icon:"dt-changchun-logo",game_icon:"dd_logo3_icon" },
      { key:9,province:"辽宁省",city:"锦州",area:"黑山县",mjgame:"172",pkgame:"",citycode:2107,hall_icon:"dt-changchun-logo",game_icon:"dd_logo3_icon" },
      { key:10,province:"辽宁省",city:"锦州",area:"义县",mjgame:"171",pkgame:"",citycode:2107,hall_icon:"dt-changchun-logo",game_icon:"dd_logo3_icon" },
      { key:11,province:"辽宁省",city:"锦州",area:"凌海市",mjgame:"171",pkgame:"",citycode:2107,hall_icon:"dt-changchun-logo",game_icon:"dd_logo3_icon" },
      { key:12,province:"辽宁省",city:"锦州",area:"北镇市",mjgame:"171",pkgame:"",citycode:2107,hall_icon:"dt-changchun-logo",game_icon:"dd_logo3_icon" }
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

module.exports=data_province_21;