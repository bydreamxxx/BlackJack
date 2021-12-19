/**
 * Created by Mac_Li on 2017/9/4.
 */

const uiEvent = require('HallOnEvent');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var hall_prefab = require('hall_prefab_cfg');
var HallPropData = require('hall_prop_data').HallPropData.getInstance();
var FortuneHallManager = require('FortuneHallManager').Instance();
var klb_game_list_config = require('klb_gameList');
const Hall = require('jlmj_halldata');
//var jlmj_layer_zorder = require( "jlmj_layer_zorder" );

const HallCommonData = require('hall_common_data').HallCommonData;
const HallCommonEd = require('hall_common_data').HallCommonEd;
const HallCommonEvent = require('hall_common_data').HallCommonEvent;
var shopEd = require('hall_shop').shopED;
var shopEvent = require('hall_shop').shopEvent;
var data_vip = require('vip');
var data_exp = require('playerExp');
const data_shop = require('shop');
var AppConfig = require('AppConfig');
var login_module = require('LoginModule');
var game_channel_cfg = require('game_channel');
const HallSendMsgCenter = require('HallSendMsgCenter');

let userInfo = cc.Class({
    extends: uiEvent,

    properties: {
        nameTTF: cc.Label,       //名字
        ID_TTF: cc.Label,        //ID
        headSp: cc.Sprite,       //头像
        sexNodeArr: [cc.Node],   //性别
        fangKaTTF: cc.Label,     //房卡
        fangKaTTF2: cc.Label,    //房卡
        gold: cc.Label,          //新钻石
        zuanshiTTF: cc.Label,    //钻石(金币)
        phoneTTF: cc.Label,      //手机号
        IDCardTTF: cc.Label,     //身份证号
        bindIDCardBtn: cc.Button,
        isVipRoom: false,
        vipLv: cc.Label,
        vipExp: cc.Label,

        male: cc.Toggle,
        female: cc.Toggle,
        bankChargeFlag: cc.Node,

        // pageNodes: [cc.Node],   //标签页
        idItemPrefab: cc.Prefab,
        curPage: 1,//默认第二个标签

        curVipLevel: cc.Label, //vip等级

        bagFlag: cc.Node, //背包红点更新
        welfareFlag: cc.Node,   //福袋红点

        //titleTxt
        desc: cc.Label,
        desc1: cc.Label,

        firstBuySprite: cc.Sprite,
        firstBuyAni: sp.Skeleton,
        firstBuy_SpriteFrame: [cc.SpriteFrame],
        fenxiangyouli: cc.Node,

    },
    onLoad: function () {
        Hall.HallED.addObserver(this);
        HallCommonEd.addObserver(this);
        shopEd.addObserver(this);
        if (this.welfareFlag) {
            this.welfareFlag.active = !cc.dd._welfareFlag;
        }
        this.updateFxylBtn();
        this.checkLayoutActive();

        let freeCoin = cc.find('topNode/layout/share', this.node);
        if (freeCoin) {
            freeCoin.active = !cc._applyForPayment;
        }
        let activity = cc.find('downNode/layoutLeft/activityBtn', this.node);
        if (activity) {
            activity.active = !cc._applyForPayment;
        }
        let redBag = cc.find('downNode/layoutRight/qhbBtn', this.node);
        if (redBag) {
            redBag.active = !cc._applyForPayment;
        }


        let spreadActive = cc.find('topNode/layout/tuiguanghaoli', this.node);
        if (spreadActive && Hall.HallData.Instance().activitySpread) {
            spreadActive.active = Hall.HallData.Instance().activitySpread.state == 1
        }


    },

    onDestroy: function () {
        Hall.HallED.removeObserver(this);
        HallCommonEd.removeObserver(this);
        shopEd.removeObserver(this);
    },
    setData: function (userInfo, useShortName) {
        this.useShortName = useShortName;
        if (this.accountType) {
            // this.changePasswordToggle.active = false;
            // this.bindPhoneToggle.active = true;
            // this.activeAccountToggle.active = false;

            switch (login_module.Instance().loginType) {
                case cc.dd.jlmj_enum.Login_Type.GUEST:
                    this.accountType.string = "游客";
                    // this.bindPhoneToggle.active = false;
                    // this.activeAccountToggle.active = true;
                    break;
                case cc.dd.jlmj_enum.Login_Type.WX:
                    this.accountType.string = "微信用户";
                    let headNode = cc.find('pageInfo/shareNode/headnode', this.node);
                    if (headNode) {
                        let button = headNode.getComponent(cc.Button);
                        if (button) {
                            button.interactable = false;
                        }

                        let changetips = headNode.getChildByName('changeTips');
                        if (changetips) {
                            changetips.active = false;
                        }
                    }
                    break;
                // case cc.dd.jlmj_enum.Login_Type.WXH5:
                //     break;
                case cc.dd.jlmj_enum.Login_Type.ACCOUNT:
                    this.accountType.string = "账号用户";
                    // this.changePasswordToggle.active = true;
                    break;
            }
        }

        //刷新网络头像 或者 本地图片
        // if (userInfo && userInfo.openId) {
        this.initHead(this.headSp, userInfo.openId, userInfo.headUrl);
        // } else {//设置默认图片
        // var str = SDY.resPath.Texture_path+'common/hd_female.png';
        // if(userInfo.sex==1){//男人
        //     str = SDY.resPath.Texture_path+'common/hd_male.png';
        // }
        // var sp = new cc.SpriteFrame(cc.url.raw(str));
        // if (sp) {
        //     sp.width = 98;sp.height = 98;
        //     this.headImage.spriteFrame = sp;
        // }
        // }
        if (this.male != null && this.female != null) {
            if (userInfo.sex == 1) {
                this.male.isChecked = true;
                this.female.isChecked = false;
            } else {
                this.male.isChecked = false;
                this.female.isChecked = true;
            }
        }

        this.updateNick(userInfo.nick);

        if (this.ID_TTF) {
            this.ID_TTF.string = userInfo.userId || '0007';
        }
        if (this.fangKaTTF) {
            this.fangKaTTF.string = HallPropData.getRoomCard() || '0';
        }
        if (this.fangKaTTF2) {
            this.fangKaTTF2.string = HallPropData.getRoomCard() || '0';
        }
        if (this.zuanshiTTF) {

            //var coin = FortuneHallManager.userGold_coin;
            this.zuanshiTTF.string = this.changeNumToCHN(HallPropData.getCoin()) || '0';
            var icon = this.zuanshiTTF.node.parent.getChildByName('icon');
            if (icon) {
                let ani = icon.getComponent(cc.Animation);
                if (ani) {
                    ani.play();
                }
            }


        }
        if (this.gold && this.gold.node.activeInHierarchy) {
            // this.gold.string = 'X'+ HallPropData.getDiamond().toString() || '0';
            this.gold.string = this.changeNumToCHN(HallPropData.getCommonGold()) || '0';
            var icon = this.gold.node.parent.getChildByName('icon');
            if (icon) {
                let ani = icon.getComponent(cc.Animation);
                if (ani) {
                    ani.play();
                }
            }
        }

        if (this.phoneTTF) {
            if (userInfo.telNum != "") {
                //this.bindIDCardBtn.node.active = false
                this.phoneTTF.string = userInfo.telNum;
                // this.desc.string = '解绑手机';
                // this.desc1.string = '解绑手机';
            } else {
                //this.bindIDCardBtn.node.active = true
                this.phoneTTF.string = '--';
                // this.desc.string = '绑定手机';
                // this.desc1.string = '绑定手机';
            }
        }
        if (this.IDCardTTF) {
            if (userInfo.idNum != "") {
                //this.bindIDCardBtn.node.active = false
                this.IDCardTTF.string = userInfo.idNum;
            } else {
                //this.bindIDCardBtn.node.active = true
                this.IDCardTTF.string = '未认证';
            }
        }
        if (this.sexNodeArr && this.sexNodeArr.length > 0) {
            var sex = userInfo.sex || 1;//男
            this.sexNodeArr[sex - 1].active = true;
            this.sexNodeArr[1 - sex + 1].active = false;
        }

        if (this.vipLv != null) {
            this.vipLv.string = userInfo.vipLevel;
            if (!cc._useCardUI && !cc._chifengGame) {
                this.vipLv.node.parent.active = true;
                let icon = this.vipLv.node.parent.getChildByName('icon_vip');
                if (icon) {
                    if (userInfo.vipLevel >= 10) {
                        icon.active = true;
                    } else {
                        icon.active = false;
                    }
                }
            } else {
                this.vipLv.node.parent.active = false;
            }
        }




        this.updateVip();

        this.updateChargeFlag();
        this.updateFalg();
        this.updateFirstBuy();
    },

    updateChargeFlag: function () {
        // if (this.bankChargeFlag != null) {
        //     this.bankChargeFlag.active = (FortuneHallManager.m_chargeFlag_coin == 1);
        // }
    },

    /**
     * 设置头像
     */
    onSetHeadSp: function (openid) {
        // this.headSp.spriteFrame = sp;
        this._getWxHeadFrame(openid, this.headSp);
    },
    /**
     * 购买商品成功
     */
    onShopSuccess: function () {
        cc.dd.NetWaitUtil.close();
        cc.dd.PromptBoxUtil.show(cc.dd.Text.TEXT_SYSTEM_5);
    },
    /**
     * 设置金币 房卡
     */
    onSetMoneyAndCards: function (money, roomcards) {
        if (this.fangKaTTF)
            this.fangKaTTF.string = roomcards || 0;
        if (this.fangKaTTF2)
            this.fangKaTTF2.string = roomcards || 0;
        if (this.zuanshiTTF) {
            this.zuanshiTTF.string = this.changeNumToCHN(money) || '0';
        }

        if (this.gold) {
            // this.gold.string = 'X'+ HallPropData.getDiamond().toString() || '0';
            this.gold.string = this.changeNumToCHN(HallPropData.getCommonGold()) || '0';
        }
        this.updateFalg();
    },


    /**
     * 关闭按钮回调
     */
    closeBtnCallBack: function () {
        hall_audio_mgr.com_btn_click();
        this.closeView();
    },

    closeView: function () {
        cc.dd.UIMgr.destroyUI(this.node);
    },

    /**
     * 更新红点显示
     */
    updateFalg: function () {
        var isShow = HallPropData.getUpdateFlag();
        if (this.bagFlag)
            this.bagFlag.active = isShow;
    },

    // 打开商城（房卡）
    openShop: function (button, data) {
        cc.dd.PromptBoxUtil.show('NOT YET OPEN，敬请期待');
        return;
        // cc.dd.UIMgr.openUI(hall_prefab.JLMJ_SHOP_LAYER,function (ui) {
        //     var type = data || "FK";
        //     ui.getComponent('jlmj_shop_layer').gotoPage(type);
        //     ui.setLocalZOrder( jlmj_layer_zorder.ui+1 );
        // }.bind(this));
    },

    updateVip: function () {
        if (this.vipLv != null) {
            this.vipLv.string = HallCommonData.getInstance().vipLevel;
            if (!cc._useCardUI && !cc._chifengGame) {
                this.vipLv.node.parent.active = true;
                let icon = this.vipLv.node.parent.getChildByName('icon_vip');
                if (icon) {
                    if (HallCommonData.getInstance().vipLevel >= 10) {
                        icon.active = true;
                    } else {
                        icon.active = false;
                    }
                }
            } else {
                this.vipLv.node.parent.active = false;
            }
        }

        if (this.vipExp != null) {
            if (data_vip.items.length <= 0) {
                cc.error('vip表未配置!');
                return;
            }
            var max_vipLv = data_vip.items[data_vip.items.length - 1].key;
            var next_vipLv = Math.min(max_vipLv, HallCommonData.getInstance().vipLevel + 1);
            var vip_item = data_vip.getItem(function (item) {
                return item.key == next_vipLv;
            });
            this.vipExp.string = '(' + HallCommonData.getInstance().vipExp + '/' + vip_item.exp + ')';
        }

        if (this.curVipLevel != null)
            this.curVipLevel.string = HallCommonData.getInstance().vipLevel;
    },

    updatePlayer: function () {
        if (this.level != null) {
            if (HallCommonData.getInstance().level < 0) {
                HallCommonData.getInstance().level = 0;
            } else if (HallCommonData.getInstance().level >= this.levelSP.length) {
                HallCommonData.getInstance().level = this.levelSP.length - 1;
            }
            this.level.spriteFrame = this.levelSP[HallCommonData.getInstance().level];
        }
        if (this.exp != null) {
            this.exp.string = HallCommonData.getInstance().exp;
            this.exp.string = '0';  //临时
        }
    },

    clickMatch() {
        /************************游戏统计 start************************/
        cc.dd.Utils.sendClientAction(cc.dd.clientAction.HALL, cc.dd.clientAction.T_HALL.LUCKYMONEY);
        /************************游戏统计   end************************/
        hall_audio_mgr.com_btn_click();
        var UpdateMgr = require("updaterMgr").UpdateMgr.Instance();
        if (!UpdateMgr.isGameInstalled(31)) {
            cc.dd.DialogBoxUtil.show(0, "请先在大厅安装游戏:" + '斗地主', 'text33', null, function () {
            }, null);
            return;
        }
        cc.dd.quickMatchType = 'ddz_kuai_su_sai';
        cc.dd.UIMgr.openUI(hall_prefab.KLB_Match, function (node) {
            node.getComponent('klb_hall_Match').sendGetMatch(1);
        }.bind(this));
    },

    clickHuodongsai() {
        /************************游戏统计 start************************/
        cc.dd.Utils.sendClientAction(cc.dd.clientAction.HALL, cc.dd.clientAction.T_HALL.LUCKYMONEY);
        /************************游戏统计   end************************/
        hall_audio_mgr.com_btn_click();
        var UpdateMgr = require("updaterMgr").UpdateMgr.Instance();
        if (!UpdateMgr.isGameInstalled(31)) {
            cc.dd.DialogBoxUtil.show(0, "请先在大厅安装游戏:" + '斗地主', 'text33', null, function () {
            }, null);
            return;
        }
        cc.dd.quickMatchType = 'duo_bao_sai';
        cc.dd.UIMgr.openUI(hall_prefab.KLB_Match, function (node) {
            node.getComponent('klb_hall_Match').sendGetMatch(1);
        }.bind(this));
    },

    vipBtnClick: function () {
        /************************游戏统计 start************************/
        cc.dd.Utils.sendClientAction(cc.dd.clientAction.HALL, cc.dd.clientAction.T_HALL.VIP);
        /************************游戏统计   end************************/
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_DAILY_ACTIVITY, function (prefab) {
            prefab.getComponent('klb_hall_daily_activeUI').showUI(1);
        });
    },

    clickBag() {
        /************************游戏统计 start************************/
        cc.dd.Utils.sendClientAction(cc.dd.clientAction.HALL, cc.dd.clientAction.T_HALL.BAG);
        /************************游戏统计   end************************/
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_BAG, function (ui) {
            //ui.getComponent('klb_hall_BagUI').updateBagUI();
        }.bind(this));
    },

    clickLuckyBag() {
        if (this.welfareFlag) {
            cc.dd._welfareFlag = true;
            this.welfareFlag.active = false;
        }
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_WELFAREBAG);
    },

    /**
     * vip展示
     */
    clickVip: function () {
        /************************游戏统计 start************************/
        cc.dd.Utils.sendClientAction(cc.dd.clientAction.HALL, cc.dd.clientAction.T_HALL.ACTIVITY);
        /************************游戏统计   end************************/
        hall_audio_mgr.com_btn_click();
        // cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_DAILY_ACTIVITY, function (prefab) {
        //     prefab.getComponent('klb_hall_daily_activeUI').showUI(1);
        // });
        cc.dd.UIMgr.openUI(hall_prefab.BJ_HALL_VIP, function (prefab) {
            // prefab.getComponent('BlackJack_Hall_VIP').showUI(1);
        });
    },

    clickRank: function () {
        /************************游戏统计 start************************/
        cc.dd.Utils.sendClientAction(cc.dd.clientAction.HALL, cc.dd.clientAction.T_HALL.RANK);
        /************************游戏统计   end************************/
        hall_audio_mgr.com_btn_click();
        // switch (AppConfig.GAME_PID) {
        //     case 2:
        //     case 3:
        //     case 4:
        //     case 5:
        //         this.clickzhanji();
        //         break;
        //     case 10009:
        //     case 10004:
        //         cc.dd.PromptBoxUtil.show('NOT YET OPEN');
        //         break;
        //     default:
        //         cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_RANK, function (prefab) {
        //         }, true);
        //         break;
        // }
        cc.dd.PromptBoxUtil.show('NOT YET OPEN');
    },

    /**
     * 战绩
     */
    clickzhanji: function () {
        /************************游戏统计 start************************/
        cc.dd.Utils.sendClientAction(cc.dd.clientAction.HALL, cc.dd.clientAction.T_HALL.RECORD);
        /************************游戏统计   end************************/
        // cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_BATTLE_HISTORY, function (ui) {
        //     ui.getComponent('klb_hall_Battle_History').send(0);
        // });
        hall_audio_mgr.com_btn_click();
        HallSendMsgCenter.getInstance().sendBattleHistory(0);
    },

    clickFirstBuy() {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_FIRST_BUY, function (ui) {
            var cpt = ui.getComponent('klb_hall_first_buy');
            // var seq = cc.sequence(cc.delayTime(0.2), cc.callFunc(function () {
            //     cpt.initItemList();
            // }));
            // this.node.runAction(seq);
            cc.tween(this.node)
                .delay(0.2)
                .call(function () {
                    cpt.initItemList();
                })
                .start();
        }.bind(this));
    },

    clickMore: function () {
        // cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_MORE, function (ui) {
        //     var more_ui = ui.getComponent('klb_hall_More');
        //     if (more_ui != null) {
        //         more_ui.playOpenAni();
        //     }
        // }.bind(this));
        /************************游戏统计 start************************/
        cc.dd.Utils.sendClientAction(cc.dd.clientAction.HALL, cc.dd.clientAction.T_HALL.SETTING);
        /************************游戏统计   end************************/
        hall_audio_mgr.com_btn_click();
        if (cc._useChifengUI) {
            cc.dd.UIMgr.openUI(hall_prefab.CHIFENG_SETTING);
        } else {
            cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_SHEZHI);
        }
    },

    clickShop: function (event, data, type) {
        /************************游戏统计 start************************/
        cc.dd.Utils.sendClientAction(cc.dd.clientAction.HALL, cc.dd.clientAction.T_HALL.STORE);
        /************************游戏统计   end************************/
        // if (!cc._is_shop)
        //     return;

        if (cc._useChifengUI) {
            hall_audio_mgr.com_btn_click();
            cc.dd.UIMgr.openUI(hall_prefab.CHIFENG_SHOP);
        } else if (cc._useCardUI) {
            cc.dd.PromptBoxUtil.show('NOT YET OPEN');
        } else {
            // cc.dd.UIMgr.openUI(hall_prefab.KLB_SHOP_LAYER, function (ui) {
            //     type = type || 'ZS'; //默认打开房卡页面
            //     ui.getComponent('klb_hall_ShopLayer').gotoPage(type);
            //     // ui.setLocalZOrder(5000);
            // }.bind(this));

            cc.dd.UIMgr.openUI(hall_prefab.BJ_HALL_SHOP, function (ui) {
                type = type || 'JB'; //默认打开金币页面
                ui.getComponent('klb_hall_ShopLayer').gotoPage(type);
                // ui.setLocalZOrder(5000);
            }.bind(this));
            // cc.dd.UIMgr.openUI(hall_prefab.BJ_HALL_WHEELRACE_APPLY);
        }

    },

    chickShopDL() {

    },

    //玩家信息
    userBtnCallBack: function () {
        hall_audio_mgr.com_btn_click();
        // if (cc._useChifengUI || cc._useCardUI) {
        //     cc.dd.UIMgr.openUI(hall_prefab.CHIFENG_USERINFO);
        // } else {
        //     cc.dd.UIMgr.openUI(hall_prefab.BJ_HALL_USERINFO, function (ui) {
        //         ui.getComponent('klb_hall_user_info').setData(HallCommonData.getInstance());
        //     }.bind(this));
        // }
        cc.dd.UIMgr.openUI(hall_prefab.BJ_HALL_VIP, function (prefab) {
            // prefab.getComponent('BlackJack_Hall_VIP').showUI(1);
        }.bind(this));
    },

    clickWelfareBag: function () {
        //hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_WELFAREBAG);
    },


    switchPage: function (event, data) {
        // /************************游戏统计 start************************/
        // if (data == 0) {
        //     cc.dd.Utils.sendClientAction(cc.dd.clientAction.HALL, cc.dd.clientAction.T_HALL.REAL_NAME);
        // } else if (data == 2) {
        //     cc.dd.Utils.sendClientAction(cc.dd.clientAction.HALL, cc.dd.clientAction.T_HALL.BIND_PHONE);
        // }
        // /************************游戏统计   end************************/
        // if (this.curPage == parseInt(data)) return;
        //
        // hall_audio_mgr.com_btn_click();
        // this.curPage = parseInt(data);
        // for (var i = 0; i < this.pageNodes.length; i++) {
        //     this.pageNodes[i].active = (i == this.curPage)
        // }
        // if (this.curPage == 1)
        //     this.setData(HallCommonData.getInstance());


    },

    //显示日常活动
    onClickShowDailyActivities: function (event, data) {
        /************************游戏统计 start************************/
        cc.dd.Utils.sendClientAction(cc.dd.clientAction.HALL, cc.dd.clientAction.T_HALL.ACTIVITY);
        /************************游戏统计   end************************/
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_DAILY_ACTIVITY, function (prefab) {
            prefab.getComponent('klb_hall_daily_activeUI').showUI(1);
        });

    },

    /**
 * 筹码数字转换
 */
    changeNumToCHN: function (num) {
        var str = '';
        if(LanguageMgr.getKind() == "ZH"){
            if (num >= 100000000) {
                str = (num / 100000000.00).toFixed(1) + '亿';
            } else if (num >= 10000000) {
                str = (num / 10000000.00).toFixed(1) + '千万';
            } else if (num >= 100000) {
                str = (num / 10000.00).toFixed(1) + '万';
            } else {
                str = num;
            }
        }else if(LanguageMgr.getKind() == "TC"){
            if (num >= 100000000) {
                str = (num / 100000000.00).toFixed(1) + '億';
            } else if (num >= 10000000) {
                str = (num / 10000000.00).toFixed(1) + '千萬';
            } else if (num >= 100000) {
                str = (num / 10000.00).toFixed(1) + '萬';
            } else {
                str = num;
            }
        }else{
            if (num >= 1000000000) {
                str = (num / 1000000000.00).toFixed(1).toLocaleString('en-US') + 'B';
            } else if (num >= 10000000) {
                str = (num / 1000000.00).toFixed(1).toLocaleString('en-US') + 'M';
            } else if (num >= 10000) {
                str = (num / 1000.00).toFixed(1).toLocaleString('en-US') + 'K';
            } else {
                str = num.toLocaleString('en-US');
            }
        }

        return str;
    },

    /**
     * 打开小刺激UI
     */
    onClickXiaoCiJi: function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI("blackjack_hall/prefabs/hall_xiaociji");
    },

    /**
     * 打开赚红包UI
     */
    onClickZhuanHongBao: function () {
        hall_audio_mgr.com_btn_click();
        //cc.dd.UIMgr.openUI("blackjack_hall/prefabs/hall_zhuanhongbao");
        cc.dd.UIMgr.openUI("blackjack_hall/prefabs/klb_hall_fxyl");
    },

    /**
     * 打开绑定代理
     */
    onClickBindAggent: function () {
        hall_audio_mgr.com_btn_click();
        //cc.dd.UIMgr.openUI("blackjack_hall/prefabs/hall_zhuanhongbao");
        cc.dd.UIMgr.openUI("blackjack_hall/prefabs/klb_hall_bind_aggent");
    },
    onClickTask() {
        /************************游戏统计 start************************/
        cc.dd.Utils.sendClientAction(cc.dd.clientAction.HALL, cc.dd.clientAction.T_HALL.TASK);
        /************************游戏统计   end************************/
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI("blackjack_hall/prefabs/blackjack/hall/BlackJack_Hall_Task");
    },

    /**
     * 打开首充界面
     */
    onClickFirstBuy: function () {
        /************************游戏统计 start************************/
        cc.dd.Utils.sendClientAction(cc.dd.clientAction.HALL, cc.dd.clientAction.T_HALL.FIRSTPAY);
        /************************游戏统计   end************************/
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_FIRST_BUY, function (ui) {
            var cpt = ui.getComponent('klb_hall_first_buy');
            // var seq = cc.sequence(cc.delayTime(0.2), cc.callFunc(function () {
            //     cpt.initItemList();
            // }));
            // this.node.runAction(seq);
            cc.tween(this.node)
                .delay(0.2)
                .call(function () {
                    cpt.initItemList();
                })
                .start();
        }.bind(this));
    },


    onClickShare() {
        // /************************游戏统计 start************************/
        // cc.dd.Utils.sendClientAction(cc.dd.clientAction.HALL, cc.dd.clientAction.T_HALL.SHARE);
        // /************************游戏统计   end************************/
        // hall_audio_mgr.com_btn_click();
        // var cfg = klb_game_list_config.getItem(function (item) {
        //     return item.gameid == 32;
        // }.bind(this));
        // var share_imgs = cfg.share_img_name.split(';');
        // var idx = 0;
        // if (share_imgs.length > 1) {
        //     idx = Math.floor(Math.random() * share_imgs.length);
        // }
        // cc.dd.native_wx.ShareImageToTimeline('shareImages/' + share_imgs[idx]);

        hall_audio_mgr.com_btn_click();
        // cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_GET_COIN);
    },

    onClickFeedback() {
        /************************游戏统计 start************************/
        cc.dd.Utils.sendClientAction(cc.dd.clientAction.HALL, cc.dd.clientAction.T_HALL.FKYJ);
        /************************游戏统计   end************************/
        hall_audio_mgr.com_btn_click();
        // cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_RULE, function (ui) {
        //     //ui.getComponent('klb_hall_Rule').InitGameList();
        //     ui.getComponent('klb_hall_Rule').ruleNode.active = false;
        //     ui.getComponent('klb_hall_Rule').opnitionNode.active = true;
        //     cc.find('topBtn/toggle2', ui).getComponent(cc.Toggle).isChecked = true;
        //     cc.find('topBtn/toggle3', ui).getComponent(cc.Toggle).isChecked = false;
        // }.bind(this));
        cc.dd.UIMgr.openUI(hall_prefab.FEEDBACK);
    },

    onClickFangkadaili: function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI('blackjack_hall/prefabs/klb_hall_daily_active_FK');
    },

    /**
     * 打开国庆活动界面
     */
    onClickNationalDayActive: function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI('blackjack_hall/prefabs/klb_National_Day_Active/klb_National_Day_Active_MainUI');
    },

    onClickspreadActive: function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI('blackjack_hall/prefabs/daily_active/klb_hall_daily_active_TG');
    },

    onEventMessage(event, data) {
        this._super(event, data);
        switch (event) {
            case Hall.HallEvent.UPDATE_FXYL:
                this.updateFxylBtn();
                break;
            case Hall.HallEvent.GET_Battle_History_LIST:
                var hallHistory = cc.dd.UIMgr.getUI(hall_prefab.BJ_HALL_RECORD);
                if (!hallHistory) {
                    cc.dd.UIMgr.openUI(hall_prefab.BJ_HALL_RECORD, function (ui) {
                        ui.getComponent('BlackJack_Hall_Record').initItem(data);
                    }.bind(this));
                }
                break;
            case shopEvent.REFRESH_DATA:
                this.updateFirstBuy();
                break;
            case Hall.HallEvent.RANK_ACTIVITY_STATE:
                let rankActivity = cc.find('topNode/layout/chongbang', this.node)
                if (rankActivity) {
                    rankActivity.active = Hall.HallData.Instance().rankActiveOpen;
                    // if (!this.showchongbang && Hall.HallData.Instance().rankActiveOpen && cc.game_pid < 10000) {
                    //     this.showchongbang = true;
                    //     var pbObj = new cc.pb.rank.get_rank_activity_req();
                    //     cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_get_rank_activity_req, pbObj, 'get_rank_activity_req', true);
                    //     cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onClickChongBang');
                    // }
                }
                break;
            case Hall.HallEvent.DRAWLOTTERY_ACTIVITY_STATE:
                let drawlottery = cc.find('topNode/layout/drawlottery', this.node)
                if (drawlottery) {
                    drawlottery.active = Hall.HallData.Instance().drawlotteryActiveOpen && !cc._applyForPayment;
                    if (Hall.HallData.Instance().drawlotteryActiveOpen && !cc.dd._hadShowedDraelottery && !cc._applyForPayment) {
                        cc.dd._hadShowedDraelottery = true;
                        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_DRAW_LOTTERY);
                    }
                }
                break;
            case Hall.HallEvent.RANK_ACTIVITY_INFO:
                if (Hall.HallData.Instance().rankActiveOpen) {
                    let active = Hall.HallData.Instance().getRankActive();
                    if (active) {
                        // cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_CHONG_BANG, (ui) => {
                        //     ui.getComponent('klb_hall_chongbang').show(active);
                        // });
                        // cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_IPHONE, (ui) => {
                        //     ui.getComponent('klb_hall_iphone').show(active);
                        // });
                        // cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_WINTER_ACTIVY, (ui) => {
                        //     ui.getComponent('klb_hall_winter_activity').show(active);
                        // });
                        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_SPRING_FESTIVAL_ACTIVITY, (ui) => {
                            ui.getComponent('klb_hall_spring_festival_activity').show(active);
                        });
                    } else {
                        cc.dd.PromptBoxUtil.show('活动不存在');
                    }
                } else {
                    cc.dd.PromptBoxUtil.show('活动还未开启');
                }
                break;
            case Hall.HallEvent.DUIJIANG_ACTIVITY_INFO:
                let duijiang = cc.find('topNode/layout/duijiang', this.node)
                if (duijiang && data.listList.length) {
                    duijiang.active = true;
                    cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_DUIJIANG, function (prefab) {
                        var scp = prefab.getComponent('klb_hall_duijiang');
                        scp && scp.initData(data);
                    });
                }
                break;

            case Hall.HallEvent.SPREAD_ACTIVITY_OPEN:
                //显示推广得豪礼
                let spreadActive = cc.find('topNode/layout/tuiguanghaoli', this.node);
                if (spreadActive) {
                    spreadActive.active = Hall.HallData.Instance().activitySpread.state == 1
                    cc.dd.UIMgr.openUI('blackjack_hall/prefabs/daily_active/klb_hall_daily_active_TG');
                }
                break;
            // case Hall.HallEvent.DRAWLOTTERY_ACTIVITY_INFO:
            //     if (Hall.HallData.Instance().drawlotteryActiveOpen) {
            //         let active = Hall.HallData.Instance().getDrawLotterykActive();
            //         if (active) {
            //             if(!cc.dd.UIMgr.getUI(hall_prefab.KLB_HALL_DRAW_LOTTERY)){
            //                 cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_DRAW_LOTTERY, (ui) => {
            //                     ui.getComponent('klb_hall_drawlottery').updateUI();
            //                 });
            //             }
            //         } else {
            //             cc.dd.PromptBoxUtil.show('活动不存在');
            //         }
            //     } else {
            //         cc.dd.PromptBoxUtil.show('活动还未开启');
            //     }
            //     break;
        }
    },

    //刷新分享有礼按钮
    updateFxylBtn() {
        if (this.fenxiangyouli) {
            //TODO 记得根据需求修改
            if (cc.dd.user.regChannel >= 10000) {
                this.fenxiangyouli.active = (cc.dd.user.regChannel == cc.game_pid);
            } else {
                this.fenxiangyouli.active = cc._inviteTaskOpen;
            }
        }
    },

    updateFirstBuy() {
        return
        if (!cc._firstBuyId) {
            if (this.firstBuyAni) {
                this.firstBuyAni.clearTracks();
                this.firstBuyAni.node.parent.parent.active = false;
            }
            return;
        }
        var curShopData = data_shop.getItem(function (element) {
            return (element.key == cc._firstBuyId);
        }.bind(this))
        if (curShopData) {
            if (this.firstBuyAni)
                this.firstBuyAni.node.parent.parent.active = true;
            switch (curShopData.itemid) {
                case 10020:
                    if (this.firstBuySprite) {
                        this.firstBuySprite.spriteFrame = this.firstBuy_SpriteFrame[0];
                    }
                    if (this.firstBuyAni) {
                        this.firstBuyAni.setAnimation(0, "shouchong", true);
                    }
                    break;
                case 10021:
                    if (this.firstBuySprite) {
                        this.firstBuySprite.spriteFrame = this.firstBuy_SpriteFrame[1];
                    }
                    if (this.firstBuyAni) {
                        this.firstBuyAni.setAnimation(0, "jingxi", true);
                    }
                    break;
                case 10001:
                    if (this.firstBuySprite) {
                        this.firstBuySprite.spriteFrame = this.firstBuy_SpriteFrame[2];
                    }
                    if (this.firstBuyAni) {
                        this.firstBuyAni.setAnimation(0, "haohua", true);
                    }
                    break;
                default:
                    if (this.firstBuySprite) {
                        this.firstBuySprite.spriteFrame = this.firstBuy_SpriteFrame[0];
                    }
                    if (this.firstBuyAni) {
                        this.firstBuyAni.setAnimation(0, "shouchong", true);
                    }
                    break;
            }
        }
        else {
            if (this.firstBuySprite) {
                this.firstBuySprite.spriteFrame = this.firstBuy_SpriteFrame[0];
            }
            if (this.firstBuyAni) {
                this.firstBuyAni.setAnimation(0, "shouchong", true);
            }
        }
    },

    //判断是否是模块单包类型
    checkNewHall: function () {
        var channel_games = game_channel_cfg.getItem(function (item) {
            if (item.channel == AppConfig.GAME_PID)
                return true;
        })
        if (!channel_games) return 0;
        return channel_games.type;
    },

    onClickChongBang() {
        hall_audio_mgr.com_btn_click();
        this.showchongbang = true;
        var pbObj = new cc.pb.rank.get_rank_activity_req();
        cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_get_rank_activity_req, pbObj, 'get_rank_activity_req', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onClickChongBang');
    },

    onClickDrawLottery() {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_DRAW_LOTTERY);
    },

    onClickDuijiang() {
        hall_audio_mgr.com_btn_click();
        var pbObj = new cc.pb.slot.get_cash_activity_req();
        cc.gateNet.Instance().sendMsg(cc.netCmd.slot.cmd_get_cash_activity_req, pbObj, 'get_cash_activity_req', true);
    },

    checkLayoutActive() {
        if (cc._chifengGame) {
            let layout = cc.find("topNode/layout", this.node);
            if (layout) {
                let children = layout.getChildren();
                for (let i = 0; i < children.length; i++) {
                    let node = children[i];
                    node.active = node.name == 'shouchong';
                }
            }
        }

        if (this.checkNewHall() != 0) {
            let fkdl = cc.find("topNode/layout/fkdl", this.node);
            if (fkdl) {
                fkdl.active = false;
            }
        }

        let rankActivity = cc.find('topNode/layout/chongbang', this.node)
        if (rankActivity) {
            rankActivity.active = Hall.HallData.Instance().rankActiveOpen;
        }

        let drawlottery = cc.find('topNode/layout/drawlottery', this.node)
        if (drawlottery) {
            drawlottery.active = Hall.HallData.Instance().drawlotteryActiveOpen && !cc._applyForPayment;
        }

        let duijiang = cc.find('topNode/layout/duijiang', this.node)
        if (duijiang) {
            duijiang.active = Hall.HallData.Instance().duijiangActiveIsOpen;
        }

        if (cc.game_pid == 2) {
            let layout = cc.find("topNode/layout", this.node);
            if (layout) {
                layout.active = false;
            }
        }
    },

    updateNick: function (data) {
        if (this.nameTTF) {
            if (this.useShortName === true) {
                this.nameTTF.string = cc.dd.Utils.subChineseStr(data, 0, 10);
            } else {
                this.nameTTF.string = cc.dd.Utils.subChineseStr(data, 0, 14);
            }
        }
    },

    onClickCopyID() {
        cc.dd.native_systool.SetClipBoardContent(this.ID_TTF.string);
        cc.dd.PromptBoxUtil.show("复制ID成功");
    }
});
module.exports = userInfo;