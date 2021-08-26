var dd = cc.dd;
const baseInfo = require('jlmj_desk_info');
var DeskEvent = require('jlmj_desk_data').DeskEvent;
var DeskED = require('jlmj_desk_data').DeskED;
var DeskData = require('jlmj_desk_data').DeskData;
var playerED = require("jlmj_player_data").PlayerED;
var PlayerEvent = require("jlmj_player_data").PlayerEvent;
var playerMgr = require('jlmj_player_mgr');
var PopupView = require( "jlmj_popup_view" );
var strCon = require('jlmj_strConfig');

const Bsc_ED = require('bsc_data').BSC_ED;
const Bsc_Event = require('bsc_data').BSC_Event;
const Bsc_data = require('bsc_data').BSC_Data;


cc.Class({
    extends: baseInfo,

    properties: {
        // ani_node: { default:null, type:cc.Node, tooltip: '动画节点', },
        // btn_invite: { default: null, type:cc.Button, tooltip: "邀请微信好友" },
        // btn_read: { default: null, type:cc.Button, tooltip: "游戏准备" },
        // dangqian_ju: { default:null, type:cc.Label, tooltip: '当前局数', },

    },

    // use this for initialization
    onLoad: function () {
       this._super();
       this.btn_invite.node.active = false;
       this.btn_read.node.active = false;
        Bsc_ED.addObserver(this);
    },
    onDestroy: function () {
        this._super();
        Bsc_ED.removeObserver(this);
    },
    start:function () {
        this._super();
        var t = Bsc_data.Instance().getBscStart();
        if(t){
            Bsc_data.Instance().setBscStart(t);
        }
        // var data ={ win: true,
        //     moneyType: 1002,
        //     moneyNum: 4,
        //     rank: 2,
        //     name: '游客101291',
        //     chaName: '比赛测试' };
        // this.endBisai(data);
    },

    /**
     * 菜单按钮回调  以前在sysfun里面   为了不多写一个文件  就先改到这里
     */
    menuBtnCallBack:function () {
        cc.dd.UIMgr.openUI('gameyj_mj/bsc/prefabs/bsc_right_pop_menu');

    },

    /**
     *  等待晋级
     */
    waiteNxet:function (data, isShow) {
        if(isShow && data /*&& data.desk>0 */&& !this._isOpenWaite){
            this._isOpenWaite = true;
            cc.resources.load('gameyj_mj/bsc/prefabs/bsc_waite_next_pop', function (err, prefab) {
                this._WaiteLayer = cc.instantiate(prefab);
                this._WaiteLayer.getComponent('bsc_waite_next_pop').setData(data, function () {
                    this._isOpenWaite = false;
                    this._WaiteLayer = null;
                }.bind(this));
                this._WaiteLayer.parent = this.node;
            }.bind(this));
        }else if(!isShow && this._WaiteLayer){
            this._WaiteLayer.getComponent('bsc_waite_next_pop').close();
        }

    },

    /**
     *比赛开始
     */
    startBisai:function (data) {
        cc.resources.load('gameyj_mj/bsc/prefabs/bsc_start_pop', function (err, prefab) {
            var startPop = cc.instantiate(prefab);
            startPop.getComponent('bsc_start_pop').setData(data.lun, data.ju);
            startPop.parent = this.node;
        }.bind(this));
    },

    /**
     * 比赛结算
     */
    endBisai:function (data) {
        cc.log('客户端主动断开网络');
        if(data.win){//胜利
            cc.resources.load('gameyj_mj/bsc/prefabs/bsc_jiesuan', function (err, prefab) {
                var jiesuan = cc.instantiate(prefab);
                jiesuan.getComponent('bsc_jiesuan').setData(data);
                jiesuan.parent = this.node;
            }.bind(this));
        }else {//失败
            cc.resources.load('gameyj_mj/bsc/prefabs/bsc_jiesuan_taotai', function (err, prefab) {
                var taotai = cc.instantiate(prefab);
                taotai.getComponent('bsc_jiesuan_taotai').setData(data);
                taotai.parent = this.node;
            }.bind(this));
        }

    },

    /**
     * 返回大厅 带回调
     */
    gobackHall:function (endCall) {
        cc.dd.SceneManager.replaceScene("jlmj_hall", [],[],function () {
            if(endCall){
                endCall();
            }
        });
    },

    /**
     * 结算
     * @param data
     */
    jiesuan: function (data) {
        if (DeskData.Instance().isFenZhang) {
            this.removeFenZhangAni();
        }

        if (this._jiesuan) {
            this._jiesuan.close();
            this._jiesuan = null;
        }

        cc.dd.UIMgr.openUI('gameyj_mj/bsc/prefabs/bsc_jiesuan_ui', function (ui) {
            var jlmj_jiesuan = ui.getComponent("bsc_jiesuan_ui");
            jlmj_jiesuan.showJianYiLayer(data[0], 5, function () {
                this._jiesuan = null;
            }.bind(this));
            jlmj_jiesuan.jiesuanBtnCallBack();
            this._jiesuan = jlmj_jiesuan;
        }.bind(this));
    },

    /**
     * 取消托管
     */
    cleanTuoGuanBtnCallBack:function () {
        const req = new cc.pb.jilinmajiang.p17_req_update_deposit();
        req.setIsdeposit(false);
        cc.gateNet.Instance().sendMsg(cc.netCmd.jilinmajiang.cmd_p17_req_update_deposit,req,"p17_req_update_deposit");
    },

    /**
     * 清理桌子
     */
    clearBscDesk:function () {
        DeskData.Instance().clear();
        playerMgr.Instance().clear();
        playerMgr.Instance().playerList.forEach(function (item, idx) {
            if(item){
                item.cleardapaiCding();
            }
        })
        DeskED.notifyEvent(DeskEvent.MO_PAI_INIT_REST,[-1]);
        if (this._jiesuan) {
            this._jiesuan.close();
            this._jiesuan = null;
        }
    },

    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage:function (event,data) {
        switch (event){
            case Bsc_Event.BSC_START:
                this.startBisai(data);
                break;
            case Bsc_Event.BSC_WAITE:
                this.waiteNxet(data, true);
                break;
            case Bsc_Event.BSC_END:
                this.endBisai(data);
                break;
            case Bsc_Event.BSC_GO_HALL://返回大厅
                this.gobackHall(data);
                break;
            case Bsc_Event.BSC_ENTER_SCENE://进入比赛场场景
                this.waiteNxet(null, false);
                break;
            case Bsc_Event.BSC_CLEAR_DESK:
                this.clearBscDesk();
                break;
            case DeskEvent.RECTCONNECT://重连成功
                this.clearBscDesk();
                DeskED.notifyEvent(DeskEvent.CANCEL_EMIT,[]);//取消已选的操作 如；杠 听
                this.waiteNxet(null, false);//关闭等待界面

                break;
            case DeskEvent.TUO_GUAN:
                 this.onShowTG(data);
                 break;
            case DeskEvent.UPDATE_CURR_ROUND:
                break;//不显示朋友桌的第几圈
            default:
                this._super(event,data);
        }
    },

});
