// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var RewardWndUtil = cc.Class({
    _instance: null,

    statics: {
        Instance: function () {
            if (!this._instance) {
                this._instance = new RewardWndUtil();
            }
            return this._instance;
        },

        Destroy: function () {
            if (this._instance) {
                if (this._instance._awardWnd) {
                    cc.dd.UIMgr.destroyUI(this._instance._awardWnd.node);
                }
                this._instance = null;
            }
        },
    },

    show(items, isShare) {
        let self = this;
        if (!this._awardWnd) {
            cc.dd.UIMgr.openUI('gameyj_common/prefab/com_award',(ui)=>{
                self._awardWnd = ui.getComponent('com_award');
                self._awardWnd.initItem(items, isShare);
            });
        }
        else
            this._awardWnd.initItem(items, isShare);
    },

    close() {
        if (this._awardWnd) {
            if (this._awardWnd.close())
                this._awardWnd = null;
        }
    },
});
module.exports = RewardWndUtil;
