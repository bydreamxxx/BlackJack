/**
 * Created by shen on 2017/8/19.
 * 道具配置表
 */

var HallPropCfg = [
    {id:1001, count:0, detail:'金币'},
    {id:1002, count:0, detail:'钻石'},
    {id:1003, count:0, detail:'房卡'},
    {id:1004, count:0, detail:'红包'},
];
var getNameById=function (id) {
    for(var i in HallPropCfg){
        if(HallPropCfg[i].id == id){
            return HallPropCfg[i].detail;
        }
    }
    return '';
};

module.exports = {
    HallPropCfg:HallPropCfg,
    getNameById:getNameById,
};