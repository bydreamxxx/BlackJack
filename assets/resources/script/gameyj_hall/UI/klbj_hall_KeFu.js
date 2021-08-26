const Hall = require('jlmj_halldata');
var hall_prefab = require('hall_prefab_cfg');
var dd = cc.dd;
var hall_audio_mgr = require('hall_audio_mgr').Instance();
let Platform = require('Platform');
var AppCfg = require('AppConfig');

let kefu = cc.Class({
    extends: cc.Component,

    properties: {
        scrollNode: cc.Node,    //总共场数的列表节点
        contentNode: cc.Node,
        spaceY: 30,
        itemHeight: 90,
        itemList: [],
    },

    // // use this for initialization
    // onLoad: function () {
    //     Hall.HallED.addObserver(this);
    // },
    //
    // onDestroy: function(){
    //     Hall.HallED.removeObserver(this);
    // },
    //
    // // getKefuData:function(){
    // //     this.getKefuDetailInfo();
    // // },
    /**
     * 获取客服联系方式
     */
    getKefuDetailInfo: function () {
        if (cc._isHuaweiGame && cc._lianyunID == 'vivo') {
            this._setKefuDetailInfo([{ title: '邮箱', content: 'kuaileba2020@126.com' }]);
        }
        else
            this._setKefuDetailInfo([{ title: '微信号', content: 'klbgame8888' }]);
        // // dd.NetWaitUtil.show('正在请求数据');
        //  /************************游戏统计 start************************/
        //  cc.dd.Utils.sendClientAction(cc.dd.clientAction.HALL, cc.dd.clientAction.T_HALL.CUSTOMER_SERVICE);
        //  /************************游戏统计   end************************/
        //  const req = new cc.pb.hall.hall_req_config_gm();
        //  cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_hall_req_config_gm,req,
        //      '发送协议[id: ${cc.netCmd.hall.cmd_hall_req_config_gm}],hall_req_config_gm[获取客服联系方式]',true);
        //  cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'getKefuDetailInfo');
    },

    /**
     * 设置客服信息显示
     */

    _setKefuDetailInfo: function (data) {
        for (let i = this.itemList.length - 1; i >= 0; i--) {
            this.itemList[i].removeFromParent();
            this.itemList[i].destroy();
        }
        this.contentNode.removeAllChildren(true);

        // if(cc.game_pid < 10000 || cc._isKuaiLeBaTianDaKeng){
        //     return;
        // }

        cc.dd.ResLoader.loadPrefab(hall_prefab.KLB_HALL_KEFU_ITEM, function (prefab) {
            //获取客服微信列表
            for (var i = 0; i < data.length; i++) {
                var dataInfo = data[i];

                if (dataInfo) {
                    var item = cc.instantiate(prefab);
                    this.itemList.push(item);
                    item.parent = this.contentNode;

                    // var cnt = this.itemList.length;
                    // var y = (cnt-0.5)*this.itemHeight + (cnt-1)*this.spaceY;
                    // item.y = -y;
                    // item.parent.height = cnt*this.itemHeight+(cnt+1)*this.spaceY;
                    item.getComponent('klb_hall_KeFuItem').init(dataInfo.title, dataInfo.content);
                }
            }
        }.bind(this));
    },

    /* *
     * 关闭回调
     */
    closeCallBack: function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    // /**
    //  * 事件处理
    //  * @param event
    //  * @param data
    //  */
    // onEventMessage: function (event, data) {
    //     dd.NetWaitUtil.close();
    //     switch (event) {
    //         case Hall.HallEvent.Get_GM_Config_Info: //获取客服联系信息
    //             this._setKefuDetailInfo(data.gmListList);
    //         default:
    //             break;
    //     }
    // },
    //
    // onClickConncatUs(){
    //     hall_audio_mgr.com_btn_click();
    //     cc.dd.native_systool.OpenUrl(Platform.kefuUrl[AppCfg.PID]+"?user_id="+cc.dd.user.id);
    // }
});
module.exports = kefu;
