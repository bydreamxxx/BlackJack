var hall_audio_mgr = require('hall_audio_mgr').Instance();
var hall_prefab = require('hall_prefab_cfg');
const hall_prop_data = require('hall_prop_data').HallPropData.getInstance();
const Hall = require('jlmj_halldata');
var game_channel_cfg = require('game_channel');
var AppConfig = require('AppConfig');

cc.Class({
    extends: cc.Component,

    properties: {
        count: cc.Label,
        gongzonghao: cc.Label,
        recive: cc.Label,

        wx1: cc.Label,
        wx2: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // use this for initialization
    onLoad: function () {
        var channel_games = game_channel_cfg.getItem(function (item) {
            if (item.channel == AppConfig.GAME_PID)
                return true;
        })
        if(channel_games){
            this.gongzonghao.string = '“'+channel_games.gzh+'”';
        }
        if(cc.game_pid == 2){
            this.gongzonghao.string = '“快乐吧棋牌”';
        }
        if(cc.game_pid == 10008){
            this.wx1.string = "wdmj777";
            this.wx2.string = "15647606162";
        }
        Hall.HallED.addObserver(this);
    },

    onDestroy:function () {
        Hall.HallED.removeObserver(this);
    },

    start(){
      let data = hall_prop_data.getItemInfoByDataId(1004);
      if(data){
          let num = data.count / 100;
          if(num >= 99999.9){
              num = 99999.9
          }
          this.count.string = num.toFixed(1)+'元';
      }else{
          this.count.string = '0.0元';
      }
    },

    onClickExChange(){
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
        cc.dd.UIMgr.openUI(hall_prefab.CHIFENG_MY_EXCHANGE_CASH);
    },

    onClickHistory(){
        hall_audio_mgr.com_btn_click();

        var msg = new cc.pb.hall.msg_open_code_req();
        msg.setType(1);
        msg.setOpType(1);
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_msg_open_code_req,msg,"msg_open_code_req", true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onOpenHistoryUI');
    },

    onClickClose(){
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    onEventMessage:function (event,data) {
        switch (event) {
            case Hall.HallEvent.Exchange_Code_List:
                cc.dd.UIMgr.destroyUI(this.node);
                cc.dd.UIMgr.openUI(hall_prefab.CHIFENG_MY_EXCHANGE_HISTORY, (ui)=>{
                    ui.getComponent('chifeng_hall_MyExchangeHistory').initHistoryList(data.codeList);
                });
                break;
        }
    },

    onClickCopyWeiXin1(){
        hall_audio_mgr.com_btn_click();
        if (cc.sys.OS_ANDROID == cc.sys.os || cc.sys.OS_IOS == cc.sys.os) {
            cc.dd.native_systool.SetClipBoardContent(this.wx1.string);
            cc.dd.PromptBoxUtil.show("复制成功");
        }
    },

    onClickCopyWeiXin2(){
        hall_audio_mgr.com_btn_click();
        if (cc.sys.OS_ANDROID == cc.sys.os || cc.sys.OS_IOS == cc.sys.os) {
            cc.dd.native_systool.SetClipBoardContent(this.wx2.string);
            cc.dd.PromptBoxUtil.show("复制成功");
        }
    },
});
