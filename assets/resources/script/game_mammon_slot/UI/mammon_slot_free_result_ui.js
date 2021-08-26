//create by wj 2019/1/18
var SlotCfg = require('SlotCfg');
const slot_audio = require('slotaudio');
var gSlotMgr = require('SlotManger').SlotManger.Instance();

cc.Class({
    extends: cc.Component,

    properties: {

    },

    showResult: function(totalNum){
        this.playAudio(1025022, false)
        var self = this;
        var showNode = cc.dd.Utils.seekNodeByName(self.node, 'result');
        var winNumTxt = cc.dd.Utils.seekNodeByName(showNode, 'winNum');
        winNumTxt.getComponent(cc.Label).string = totalNum;

        var skeletonAct = cc.dd.Utils.seekNodeByName(this.node, 'zuizhongdefen').getComponent(sp.Skeleton);//闪光特效
        if(skeletonAct){
            skeletonAct.clearTracks();
            skeletonAct.setAnimation(0, 'zuizhongdefen', false);

            var seq = cc.sequence(cc.delayTime(0.5), cc.callFunc(function(){
                showNode.active = true;
                if(gSlotMgr.getSlotLastAuto()){
                    setTimeout(function(){
                        self.onClickClose(null, null); 
                    }, 5000);
                }
            }));
            this.node.runAction(seq);
        }
    },

    onClickClose: function(event, data){//关闭游戏
        var slotMainUI = cc.dd.SceneManager.getCurrScene().getChildByName('Canvas').getComponent('mammon_slot_ui');
        if(slotMainUI){
            slotMainUI.updateResult();
            slotMainUI.quitFreeTimes();
        }
        cc.dd.UIMgr.destroyUI(this.node);
    },

    //播放相应音效
    playAudio: function(audioId, isloop){
        var data =  slot_audio.getItem(function(item){
                if(item.key == audioId)
                    return item;
            })
            var name = data.audio_name;
            //AudioManager.setSoundVolume(0.4);
            return AudioManager.playSound(SlotCfg.AudioMammonPath + name, isloop);
        },
});
