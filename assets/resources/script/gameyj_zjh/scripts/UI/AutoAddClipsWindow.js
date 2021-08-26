var gZJHMgr = require('ZjhManager').Instance();
var game_room = require("game_room");
var zjh_msg_send = require('jlmj_net_msg_sender_zjh');
var data_zhajinhuaRoom = require('zhajinhuaRoom');

var AutoAddClipsWindow = cc.Class({
    extends: cc.Component,
    properties: {
    },

ctor:function () {
   this.m_WindowName = AutoAddClipsWindow
   this.m_nAutoClip = 0
   this.m_nMinClip  = 0
   this.m_nMaxClip  = 0
},

onLoad:function(){
   this.m_oRoot = cc.find("root",this.node)

   this.m_oPlayergold = cc.find("bg/gold",this.node).getComponent(cc.Label)
   this.m_oAutoClip   = cc.find("bg/autogold",this.node).getComponent(cc.Label)
   this.m_oSlider     = cc.find("bg/Slider_1",this.node)
   this.m_oMinText    = cc.find("bg/mintext",this.node).getComponent(cc.Label)
   this.m_oMaxText    = cc.find("bg/maxtext",this.node).getComponent(cc.Label)
   this.m_oProgress = cc.find("bg/progress",this.node).getComponent(cc.ProgressBar)
   var tp = gZJHMgr.getRoomType()
   this.m_nMinClip = data_zhajinhuaRoom.items[tp - 1].clips_min
   this.m_nMaxClip = data_zhajinhuaRoom.items[tp - 1].clips_max

   this.m_oMinText.string = ("最小买入"+this.m_nMinClip)
   this.m_oMaxText.string = ("最大买入"+this.m_nMaxClip)

  //this.m_oSlider.addEventListener(handler(self,this.sliderChange))

   //self:updateslider()
},

onSure:function(){
    zjh_msg_send.requestAutoChips(this.m_nAutoClip);
},

onClose:function(){
    this.node.removeFromParent();
},


//  updateslider:function(){
//    if(this.m_oSlider){
//       var percent = Math.floor((this.m_nAutoClip-this.m_nMinClip)/(this.m_nMaxClip - this.m_nMinClip))* 100
//       this.m_oSlider.setPercent(percent)
//     }
//  },

sliderChange:function(sender,event){
    var percent = sender.progress
    this.m_oProgress.progress = percent
    var dis = this.m_nMaxClip - this.m_nMinClip
    this.m_nAutoClip = Math.floor(percent*dis) + this.m_nMinClip
    this.m_oAutoClip.string = (this.m_nAutoClip)
},

setPlayerData:function(player){
    if(player == null){ return }
    this.m_oPlayergold.string = (player.gold)
    this.m_oAutoClip.string = (player.autoSetClips)
    this.m_nAutoClip = player.autoSetClips
},

reseverCallfunc:function(){
    gZJHMgr.setAutoAddClip(this.m_nAutoClip)
    this.onClose();
}

}); 
