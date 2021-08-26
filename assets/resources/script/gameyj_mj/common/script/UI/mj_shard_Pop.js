var hall_audio_mgr = require('hall_audio_mgr').Instance();
var RoomMgr = require('jlmj_room_mgr').RoomMgr;

cc.Class({
    extends: cc.Component,

    properties: {
        renwuTTF: cc.Label,//分享送钻石
        gongzhonghao: cc.Node,//二维码
        daojishi: cc.Node,
        maskLabel: cc.Node,
        gongzhonghaoSpriteFrames:[cc.SpriteFrame],
        match: cc.Node,
        xiaociji: cc.Node,
        freecoin: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this.g_id = RoomMgr.Instance().gameId;

        if (0) {
            this.renwuTTF.active = false;
        } else {

        }
    },

    /**
     * 分享到好友  群
     */
    shardFriendCallBack: function () {
        //cc.dd.UIMgr.destroyUI(this.node);
        this.node.active = false;
        if(this.gongzhonghao && this.gongzhonghaoSpriteFrames.length > 0){
            if(cc._chifengGame){
                this.gongzhonghao.getComponent(cc.Sprite).spriteFrame = this.gongzhonghaoSpriteFrames[1];
            }else{
                this.gongzhonghao.getComponent(cc.Sprite).spriteFrame = this.gongzhonghaoSpriteFrames[0];
            }
        }
        setTimeout(function () {
            if (cc.sys.isNative) {
                if(this.gongzhonghao){
                    this.gongzhonghao.active = true;
                }
                if(this.daojishi){
                    this.daojishi.active = false;
                }
                if(this.maskLabel){
                    this.maskLabel.active = false;
                }
                if(this.xiaociji){
                    this.xiaociji.getComponent('klb_hall_xiaocijiBtn').setActive(false);
                }
                if(this.match){
                    this.match.active = false;
                }
                if(this.freecoin){
                    this.freecoin.active = false;
                }
                var canvasNode = cc.find('Canvas');
                cc.dd.native_wx.SendScreenShot(canvasNode);
                if(this.gongzhonghao){
                    this.gongzhonghao.active = false;
                }
                if(this.daojishi){
                    this.daojishi.active = true;
                }
                if(this.maskLabel){
                    this.maskLabel.active = true;
                }
                if(this.xiaociji){
                    this.xiaociji.getComponent('klb_hall_xiaocijiBtn').setActive(this.g_id == cc.dd.Define.GameType.CCMJ_GOLD);
                }
                if(this.match){
                    this.match.active = this.g_id == cc.dd.Define.GameType.CCMJ_GOLD;
                }
                if(this.freecoin){
                    this.freecoin.active = this.g_id == cc.dd.Define.GameType.CCMJ_GOLD;
                }
            }
        }.bind(this), 500);
    },
    /**
     * 分享到朋友圈
     */
    shardQuanCallBack: function () {
        //cc.dd.UIMgr.destroyUI(this.node);
        this.node.active = false;
        if(this.gongzhonghao && this.gongzhonghaoSpriteFrames.length > 0){
            if(cc._chifengGame){
                this.gongzhonghao.getComponent(cc.Sprite).spriteFrame = this.gongzhonghaoSpriteFrames[1];
            }else{
                this.gongzhonghao.getComponent(cc.Sprite).spriteFrame = this.gongzhonghaoSpriteFrames[0];
            }
        }
        setTimeout(function () {
            if (cc.sys.isNative) {
                if(this.gongzhonghao){
                    this.gongzhonghao.active = true;
                }
                if(this.daojishi){
                    this.daojishi.active = false;
                }
                if(this.maskLabel){
                    this.maskLabel.active = false;
                }
                if(this.xiaociji){
                    this.xiaociji.getComponent('klb_hall_xiaocijiBtn').setActive(false);
                }
                if(this.match){
                    this.match.active = false;
                }
                if(this.freecoin){
                    this.freecoin.active = false;
                }
                var canvasNode = cc.find('Canvas');
                cc.dd.native_wx.SendScreenShotTimeline(canvasNode);
                if(this.gongzhonghao){
                    this.gongzhonghao.active = false;
                }
                if(this.daojishi){
                    this.daojishi.active = true;
                }
                if(this.maskLabel){
                    this.maskLabel.active = true;
                }
                if(this.xiaociji){
                    this.xiaociji.getComponent('klb_hall_xiaocijiBtn').setActive(this.g_id == cc.dd.Define.GameType.CCMJ_GOLD);
                }
                if(this.match){
                    this.match.active = this.g_id == cc.dd.Define.GameType.CCMJ_GOLD;
                }
                if(this.freecoin){
                    this.freecoin.active = this.g_id == cc.dd.Define.GameType.CCMJ_GOLD;
                }
            }
        }.bind(this), 500);
    },
    /**
     * 关闭回调
     */
    closeCallBack: function () {
        hall_audio_mgr.com_btn_click();
        //cc.dd.UIMgr.destroyUI(this.node);
        this.node.active = false;
    },

    shareXianLiao(){
        //cc.dd.UIMgr.destroyUI(this.node);
        this.node.active = false;
        if(this.gongzhonghao && this.gongzhonghaoSpriteFrames.length > 0){
            if(cc._chifengGame){
                this.gongzhonghao.getComponent(cc.Sprite).spriteFrame = this.gongzhonghaoSpriteFrames[1];
            }else{
                this.gongzhonghao.getComponent(cc.Sprite).spriteFrame = this.gongzhonghaoSpriteFrames[0];
            }
        }
        setTimeout(function () {
            if (cc.sys.isNative) {
                if(this.gongzhonghao){
                    this.gongzhonghao.active = true;
                }
                if(this.daojishi){
                    this.daojishi.active = false;
                }
                if(this.maskLabel){
                    this.maskLabel.active = false;
                }
                if(this.xiaociji){
                    this.xiaociji.getComponent('klb_hall_xiaocijiBtn').setActive(false);
                }
                if(this.freecoin){
                    this.freecoin.active = false;
                }
                if(this.match){
                    this.match.active = false;
                }
                var canvasNode = cc.find('Canvas');
                cc.dd.native_wx.sendXlScreenShot(canvasNode);
                if(this.gongzhonghao){
                    this.gongzhonghao.active = false;
                }
                if(this.daojishi){
                    this.daojishi.active = true;
                }
                if(this.maskLabel){
                    this.maskLabel.active = true;
                }
                if(this.xiaociji){
                    this.xiaociji.getComponent('klb_hall_xiaocijiBtn').setActive(this.g_id == cc.dd.Define.GameType.CCMJ_GOLD);
                }
                if(this.match){
                    this.match.active = this.g_id == cc.dd.Define.GameType.CCMJ_GOLD;
                }
                if(this.freecoin){
                    this.freecoin.active = this.g_id == cc.dd.Define.GameType.CCMJ_GOLD;
                }
            }
        }.bind(this), 500);
    }
});
