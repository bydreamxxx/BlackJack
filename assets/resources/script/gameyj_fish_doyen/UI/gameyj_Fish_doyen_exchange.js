
var fishSender = require('gameyj_fish_doyen_sender');
var gFishMgr = require('FishDoyenManager').FishManager.Instance();
cc.Class({
   extends: cc.Component,

   properties: {
      enterGame: cc.Node,
      quitGame: cc.Node,
   },

   onLoad() {

   },

   showEnterGame: function (leftGold) {
      this.enterGame.active = true;
      this.quitGame.active = false;
      var left = cc.find('left/txt', this.enterGame).getComponent(cc.Label);
      left.string = "" + leftGold;
      var right = cc.find('right/txt', this.enterGame).getComponent(cc.Label);
      right.string = "" + leftGold * gFishMgr.getRoomRate();
   },
   sendQuitGame: function () {
      fishSender.quitGame();
   },
   showQuitGame: function (leftGold) {
      this.enterGame.active = false;
      this.quitGame.active = true;
      var left = cc.find('left/txt', this.quitGame).getComponent(cc.Label);
      left.string = "" + leftGold;
      var right = cc.find('right/txt', this.quitGame).getComponent(cc.Label);
      right.string = "" + parseInt(leftGold / gFishMgr.getRoomRate());
   },

   close: function (event, data) {
      // AudioManager.playSound(FishType.fishAuidoPath +  '7002', false);
      cc.dd.UIMgr.destroyUI(this.node);

   },


});
