var hall_audio_mgr = require('hall_audio_mgr').Instance();
const BSC_Event = require('bsc_data').BSC_Event;
const BSC_ED = require('bsc_data').BSC_ED;
const BSC_Data = require('bsc_data').BSC_Data;
var RoomMgr = require("jlmj_room_mgr").RoomMgr;

cc.Class({
    extends: cc.Component,

    properties: {
        rank: cc.Label,
        item: cc.Node,
        layout: cc.Node,
        itemSprites: [cc.SpriteFrame],
        shareNode: cc.Node,
        nextTimeWin: cc.Node,
        buttonNode: cc.Node,

        gongzhonghao: cc.Sprite,
        gzhSpriteFrames: [cc.SpriteFrame],
        bg: cc.Sprite,
        bgSpriteFrames: [cc.SpriteFrame],
        title: cc.Sprite,
        titleSpriteFrames: [cc.SpriteFrame],

        shareButton: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        if (cc._chifengGame) {
            this.gongzhonghao.spriteFrame = this.gzhSpriteFrames[1];
            this.bg.spriteFrame = this.bgSpriteFrames[1];
        } else if (cc._isKuaiLeBaTianDaKeng) {
            this.gongzhonghao.spriteFrame = this.gzhSpriteFrames[2];
            this.bg.spriteFrame = this.bgSpriteFrames[2];
        } else if (cc.game_pid == 2) {
            this.gongzhonghao.spriteFrame = this.gzhSpriteFrames[3];
            this.bg.spriteFrame = this.bgSpriteFrames[2];
            this.shareButton.active = !cc._isHuaweiGame;
        } else {
            this.gongzhonghao.spriteFrame = this.gzhSpriteFrames[0];
            this.bg.spriteFrame = this.bgSpriteFrames[0];
        }

        switch (RoomMgr.Instance().gameId) {
            case cc.dd.Define.GameType.CCMJ_MATCH:
                if (cc.game_pid == 2) {
                    this.title.spriteFrame = this.titleSpriteFrames[3];
                } else {
                    this.title.spriteFrame = this.titleSpriteFrames[0];
                }
                break;
            case cc.dd.Define.GameType.WDMJ_MATCH:
                this.title.spriteFrame = this.titleSpriteFrames[1];
                break;
            case cc.dd.Define.GameType.AHMJ_MATCH:
                this.title.spriteFrame = this.titleSpriteFrames[2];
                break;
        }
    },

    start() {

    },

    show(data) {
        this.rank.string = data.rank;

        if (data.reward && cc.dd._.isArray(data.reward.rewardList) && data.reward.rewardList.length > 0) {
            let rewardList = data.reward.rewardList;
            if (rewardList.length == 1) {
                this.nextTimeWin.active = false;
                AudioManager.playSound("gameyj_hall/audios/pk_reward");

                let prize = cc.find('prize', this.item);
                if (prize) {
                    if (cc.game_pid == 10008) {
                        if (data.rank <= 4) {
                            prize.getComponent(cc.Sprite).spriteFrame = this.itemSprites[0];
                        } else {
                            prize.getComponent(cc.Sprite).spriteFrame = this.itemSprites[4];
                        }
                    } else if (cc.game_pid == 2) {
                        if (data.rank <= 4) {
                            prize.getComponent(cc.Sprite).spriteFrame = this.itemSprites[1];
                        } else if (data.rank <= 8) {
                            prize.getComponent(cc.Sprite).spriteFrame = this.itemSprites[2];
                        } else {
                            prize.getComponent(cc.Sprite).spriteFrame = this.itemSprites[3];
                        }
                    } else {
                        if (data.rank == 1) {
                            prize.getComponent(cc.Sprite).spriteFrame = this.itemSprites[0];
                        } else if (data.rank <= 4) {
                            prize.getComponent(cc.Sprite).spriteFrame = this.itemSprites[1];
                        } else if (data.rank <= 8) {
                            prize.getComponent(cc.Sprite).spriteFrame = this.itemSprites[2];
                        } else {
                            prize.getComponent(cc.Sprite).spriteFrame = this.itemSprites[3];
                        }
                    }
                }

                let config = require('item');
                let _config = config.getItem((item) => {
                    return item.key == rewardList[0].type;
                });
                if (_config) {
                    let name = cc.find('name', this.item);
                    if (name) {
                        if (rewardList[0].type == 1099 || rewardList[0].type == 1004) {
                            let info = (rewardList[0].num / 100) + '元' + _config.memo;
                            if (cc.game_pid == 10008) {
                                info = info.replace('券', '');
                            }
                            name.getComponent(cc.Label).string = info;
                        } else {
                            name.getComponent(cc.Label).string = rewardList[0].num + _config.memo;
                        }

                    }
                }
            }
        } else {
            this.item.active = false;
            this.nextTimeWin.active = true;
        }

        // if(this._waitAdminAnima){
        //     return;
        // }
        // this._waitAdminAnima = true;
        // this.node.stopAllActions();
        //
        // this.nodeScaleX = cc.find('Canvas').width/this.node.width
        // this.nodeScaleY = cc.find('Canvas').height/this.node.height
        // this.node.scaleX = 0;
        // this.node.scaleY = 0;
        //
        // this.node.active = true;
        //
        // this.node.runAction(cc.sequence(
        //     cc.scaleTo(0.2, this.nodeScaleX, this.nodeScaleY),
        //     cc.callFunc(()=>{
        //         this._waitAdminAnima = false;
        //     })
        // ));
    },

    exitGame() {
        switch (RoomMgr.Instance().gameId) {
            case cc.dd.Define.GameType.CCMJ_MATCH:
                let ccmj_util = require("ccmj_util");
                ccmj_util.clear();
                break;
            case cc.dd.Define.GameType.WDMJ_MATCH:
                let wdmj_util = require("wdmj_util").Instance();
                wdmj_util.clear();
                break;
            case cc.dd.Define.GameType.AHMJ_MATCH:
                let ahmj_util = require("ahmj_util");
                ahmj_util.clear();
                break;
        }
    },

    onClickBackLobby() {
        hall_audio_mgr.com_btn_click();
        BSC_Data.Instance().clearData();
        this.exitGame();
        cc.dd.SceneManager.enterHall();
    },

    onClickAgain() {
        hall_audio_mgr.com_btn_click();
        BSC_Data.Instance().clearData()
        if (RoomMgr.Instance().gameId == cc.dd.Define.GameType.CCMJ_MATCH) {
            cc.dd.quickMatchType = 'ccmj_kuai_su_sai';
        } else if (RoomMgr.Instance().gameId == cc.dd.Define.GameType.WDMJ_MATCH) {
            cc.dd.quickMatchType = 'wdmj_kuai_su_sai';
        } else if (RoomMgr.Instance().gameId == cc.dd.Define.GameType.AHMJ_MATCH) {
            cc.dd.quickMatchType = 'ahmj_kuai_su_sai';
        }
        this.exitGame();
        cc.dd.SceneManager.enterHallMatch();
    },

    onClickShare() {
        hall_audio_mgr.com_btn_click();
        this.shareNode.active = !this.shareNode.active;
    },

    /**
     * 分享
     */
    ShareBtnCallBack: function (event, data) {
        //去掉二维码
        if (cc.sys.isNative) {
            this.shareNode.active = false;
            this.buttonNode.active = false;

            let xiaociji = cc.find('buttonNode/klb_hall_xiaocijiBtn', this.node);
            if (xiaociji) {
                xiaociji.getComponent('klb_hall_xiaocijiBtn').setActive(false);
            }

            if (data == 'wechat') {
                cc.WxShareType = 1;
                cc.dd.native_wx.SendNodeShotToWechat(this.node);
            }
            else {
                cc.WxShareType = 2;
                cc.dd.native_wx.SendNodeShotToMoment(this.node);
            }
            this.buttonNode.active = true;
            if (xiaociji) {
                xiaociji.getComponent('klb_hall_xiaocijiBtn').setActive(true);
            }
        }
    },
});
