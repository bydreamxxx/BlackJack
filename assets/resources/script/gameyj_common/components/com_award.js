let klb_game_list_config = require('klb_gameList');
let hall_audio_mgr = require('hall_audio_mgr');
let Platform = require("Platform");
let AppCfg = require('AppConfig');
let AudioManager = require('AudioManager');
const gold_sound = 'gameyj_common/audio/gold';
var login_module = require('LoginModule');
var hall_prefab = require('hall_prefab_cfg');

cc.Class({
    extends: cc.Component,

    properties: {
        layout_node: cc.Node,
        item_templete: cc.Node,
        again_node: cc.Node,
        item_atlas: cc.SpriteAtlas,
        spine_ani: sp.Skeleton,
        lizi1: cc.ParticleSystem,
        lizi2: cc.ParticleSystem,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let self = this;
        this.node.zIndex = 10000;
        this.spine_ani.setCompleteListener((trackEntry, loopCount) => {
            let name = trackEntry.animation ? trackEntry.animation.name : '';
            if (name == 'dangejiangliCX') {
                self.spine_ani.setAnimation(0, 'dangejiangliXH', true);
                AudioManager.getInstance().playSound(gold_sound, false);
                self.layout_node.runAction(cc.fadeIn(0.5));
                self.lizi1.resetSystem();
                self.lizi2.resetSystem();
            }
            else if (name == 'duogejiangliCX') {
                self.spine_ani.setAnimation(0, 'duogejiangliXH', true);
                AudioManager.getInstance().playSound(gold_sound, false);
                self.layout_node.runAction(cc.fadeIn(0.5));
            }
        });
    },

    //start() {},

    // update (dt) {},

    initItem(list, isShare) {
        this.again_node.active = !!isShare;
        this.layout_node.removeAllChildren();
        this.layout_node.opacity = 0;
        let self = this;
        list.forEach(element => {
            var item = cc.instantiate(self.item_templete);
            cc.find('icon', item).getComponent(cc.Sprite).spriteFrame = self.item_atlas.getSpriteFrame(element.id.toString());
            if (element.id == 1004 || element.id == 1099) {
                element.num /= 100;
            }
            cc.find('num', item).getComponent(cc.Label).string = 'x' + element.num;
            item.active = true;
            self.layout_node.addChild(item);
        });
        this.spine_ani.node.active = true;
        if (list.length > 1) {
            this.spine_ani.setAnimation(0, 'duogejiangliCX', false);
        }
        else {
            this.spine_ani.setAnimation(0, 'dangejiangliCX', false);
        }
    },

    onClose() {
        cc.shareFromJiuji = false;
        cc.dd.RewardWndUtil.close();
    },

    close() {
        if (this.layout_node.opacity != 255)
            return;
        cc.dd.UIMgr.destroyUI(this.node);
        return true;
    },

    onAgain() {
        let shareType = cc.shareFromJiuji === true ? 6 : 5;
        cc.shareFromJiuji = false;

        this.onClose();
        hall_audio_mgr.Instance().com_btn_click();
        // var cfg = klb_game_list_config.getItem(function (item) {
        //     return item.gameid == 32;
        // }.bind(this));
        // if (cfg == null) {
        //     cc.error("klb_gamelist表未配置该游戏");
        //     return;
        // }
        // else if (cfg.share_img_name == "") {
        //     var title = '【巷乐-' + this.game_name + '】';
        //     var content = '绿色安全无外挂,约局打牌不等待!地道的游戏玩法,心动的你还不来吗?';
        //     cc.dd.native_wx.ShareLinkTimeline(Platform.GetAppUrl(AppCfg.GAME_PID, AppCfg.PID), title, content, shareType);
        // } else {
        //     var share_imgs = cfg.share_img_name.split(';');
        //     var idx = 0;
        //     if (share_imgs.length > 1) {
        //         idx = Math.floor(Math.random() * share_imgs.length);
        //     }
        //     cc.dd.native_wx.ShareImageToTimeline('gameyj_hall/textures/shareImages/' + share_imgs[idx], shareType);
        // }
        let shareItem = cc.dd.Utils.getRandomShare();
        if (!cc.dd._.isNull(shareItem)) {
            //cc.dd.native_wx.SendAppContent('', shareItem.title, shareItem.content, Platform.shareGameUrl + '?channel=' + (cc.dd.user.regChannel * 100 + login_module.Instance().loginType % 100));
            var url = Platform.shareGameUrl + '?channel=' + (cc.dd.user.regChannel * 100 + login_module.Instance().loginType % 100);
            cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_SHARE, function (ui) {
                var share_ui = ui.getComponent('klb_hall_share');
                if (share_ui != null) {
                    share_ui.setWechatAndXianliaoShare({ title: shareItem.title, content: shareItem.content, url: url });
                }
            }.bind(this));
        }
    },
});
