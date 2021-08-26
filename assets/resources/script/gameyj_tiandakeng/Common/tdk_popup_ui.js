/**
 * Created by zhanghuaxiong on 2017/5/24.
 */

var dd = cc.dd;
var tdk = dd.tdk;
var Popup = {
    show : function (cb, isGrey) {
        var prefab = cc.resources.get(dd.tdk_resCfg.PREFAB.PRE_SHIELD, cc.Prefab);
        var shieldNode = cc.instantiate(prefab);
        shieldNode.parent = tdk.popupParent;
        var shield = shieldNode.getComponent('shield_ui');
        shield.setGrey(true);
        if(typeof cb == 'function'){
            cb(shield);
        }else{
            cc.warn('tdk_popup_ui::show:cb not function!');
        }
        if(typeof isGrey != 'undefined'){
            shield.setGrey(isGrey);
        }
    },
};

module.exports = Popup;