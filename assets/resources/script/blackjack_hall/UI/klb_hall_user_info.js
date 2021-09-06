var login_module = require('LoginModule');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var hall_prefab = require('hall_prefab_cfg');
var HallPropData = require('hall_prop_data').HallPropData.getInstance();
const Hall = require('jlmj_halldata');
var hallData = require('hall_common_data').HallCommonData;
var TaskED = require('hall_task').TaskED;
var TaskEvent = require('hall_task').TaskEvent;
var HallVip = require('hall_vip').VipData.Instance();

cc.Class({
    extends: require('klb_hall_UserInfo'),

    properties: {
        sexNodeArr: { default: [], type: [cc.Node], override: true, visible: false },  //性别
        fangKaTTF2: { default: null, type: cc.Label, override: true, visible: false },   //房卡
        gold: { default: null, type: cc.Label, override: true, visible: false },         //新钻石
        phoneTTF: { default: null, type: cc.Label, override: true, visible: false },     //手机号
        IDCardTTF: { default: null, type: cc.Label, override: true, visible: false },    //身份证号
        isVipRoom: { default: false, override: true, visible: false },
        bankChargeFlag: { default: null, type: cc.Node, override: true, visible: false },
        bindIDCardBtn:  { default: null, type: cc.Button, override: true, visible: false },

        idItemPrefab: { default: null, type: cc.Prefab, override: true, visible: false },
        curPage: { default: 1, override: true, visible: false },//默认第二个标签

        bagFlag: { default: null, type: cc.Node, override: true, visible: false }, //背包红点更新
        welfareFlag: { default: null, type: cc.Node, override: true, visible: false },   //福袋红点

        desc: { default: null, type: cc.Label, override: true, visible: false },
        desc1: { default: null, type: cc.Label, override: true, visible: false },

        firstBuySprite: { default: null, type: cc.Sprite, override: true, visible: false },
        firstBuyAni: { default: null, type: sp.Skeleton, override: true, visible: false },
        firstBuy_SpriteFrame: { default: [], type: [cc.SpriteFrame], override: true, visible: false },
        fenxiangyouli: { default: null, type: cc.Node, override: true, visible: false },

        level: cc.Sprite,
        levelSP: [cc.SpriteFrame],
        exp: cc.Label,
        honorUINode: cc.Node, //荣誉值详细界面

        accountType: cc.Label,
        // changePasswordToggle: cc.Node,
        // bindPhoneToggle: cc.Node,
        // activeAccountToggle: cc.Node,
        bindPhoneButton: cc.Node,
        unBindPhoneButton: cc.Node,

        changeName: cc.Node,
        changeHead: cc.Button,
        changeHeadTips: cc.Node,

        vipLevel: cc.Sprite,
        vipLevelSP: [cc.SpriteFrame],

    },

    onLoad(){
        this._super();
        if(!cc._useCardUI && !cc._chifengGame){
            TaskED.addObserver(this);

            this.requestVIPInfo();
        }

        if(cc._applyForPayment){
            let serviceButton = cc.find('bg/contractBtn', this.node);
            if(serviceButton){
                serviceButton.active = false;
            }
        }
    },

    onDestroy(){
        this._super();
        if(!cc._useCardUI && !cc._chifengGame) {
            TaskED.removeObserver(this);
        }
    },

    setData: function (userInfo, useShortName) {
        this.useShortName = useShortName;
        this.isAccoutnReg = (userInfo.regChannel == cc.dd.jlmj_enum.Login_Type.ACCOUNT || userInfo.regChannel == cc.dd.jlmj_enum.Login_Type.WX) && !cc._chifengGame;

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
                    break;
                // case cc.dd.jlmj_enum.Login_Type.WXH5:
                //     break;
                case cc.dd.jlmj_enum.Login_Type.ACCOUNT:
                    this.accountType.string = "账号用户";
                    // this.changePasswordToggle.active = true;
                    break;
            }
        }

        this.changeName.active = this.isAccoutnReg;
        this.changeHead.interactable = this.isAccoutnReg;
        this.changeHeadTips.active = this.isAccoutnReg;

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

            this.male.interactable = this.isAccoutnReg;
            this.male.node.getComponent(cc.Button).interactable = this.isAccoutnReg;
            this.female.interactable = this.isAccoutnReg;
            this.female.node.getComponent(cc.Button).interactable = this.isAccoutnReg;
        }
        this.updateNick(userInfo.nick);
        if (this.ID_TTF) {
            this.ID_TTF.string = userInfo.userId || '0007';
        }
        if (this.fangKaTTF) {
            this.fangKaTTF.string = HallPropData.getRoomCard() || '0';
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

        if (this.bindPhoneButton && this.unBindPhoneButton) {
            this.bindPhoneButton.active = userInfo.telNum == "" && login_module.Instance().loginType == cc.dd.jlmj_enum.Login_Type.WX;
            this.unBindPhoneButton.active = userInfo.telNum != "" && login_module.Instance().loginType == cc.dd.jlmj_enum.Login_Type.WX;
        }


        if (this.vipLv != null) {
            this.vipLv.string = userInfo.vipLevel;

            if(userInfo.vipLevel == 0){
                this.vipLevel.node.active = false;
            }else{
                this.vipLevel.node.active = true;

                this.vipLevel.spriteFrame = this.vipLevelSP[Math.floor((userInfo.vipLevel - 1) / 5)];
            }
        }

        this.updateVip();

        if (this.level != null) {
            if(userInfo.level < 0){
                userInfo.level = 0;
            }else if(userInfo.level >= this.levelSP.length){
                userInfo.level = this.levelSP.length - 1;
            }
            this.level.spriteFrame = this.levelSP[userInfo.level];
        }

        if (this.exp != null) {
            // var exp_item = data_exp.getItem(function (item) {
            //     return item.key == userInfo.level;
            // })
            this.exp.string = userInfo.exp;//'(' + userInfo.exp + '/' + exp_item.exp + ')';
        }
    },

    onClickChangeHead() {
        hall_audio_mgr.com_btn_click();

        switch (login_module.Instance().loginType) {
            case cc.dd.jlmj_enum.Login_Type.WX:
                // cc.dd.PromptBoxUtil.show('微信用户不能修改头像');
                // break;
            // case cc.dd.jlmj_enum.Login_Type.WXH5:
            //     break;
            case cc.dd.jlmj_enum.Login_Type.GUEST:
            case cc.dd.jlmj_enum.Login_Type.ACCOUNT:
                cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_CHANGE_HEAD);
                break;
        }
    },

    onClickCertification() {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(hall_prefab.CERTIFICATION);
    },

    onClickXuanyao() {
        hall_audio_mgr.com_btn_click();
        let shareNode = cc.find('pageInfo/shareNode', this.node);
        if (shareNode) {
            this.changeName.active = false;
            this.changeHead.interactable = false;
            this.changeHeadTips.active = false;


            cc.WxShareType = 1;
            // let originX = this.node.x;
            // let originY = this.node.y;
            //
            // let canvas = cc.find('Canvas');
            //
            // this.node.x = -canvas.width / 2 + shareNode.width / 2;
            // this.node.y = -canvas.height / 2 + shareNode.height / 2 - 20;

            cc.dd.native_wx.SendCustomNodeShotToWechat(shareNode, 0xFFFF, () => {
                // this.node.x = originX;
                // this.node.y = originY;
                this.changeName.active = this.isAccoutnReg;
                this.changeHead.interactable = this.isAccoutnReg;
                this.changeHeadTips.active = this.isAccoutnReg;
            });
        }

    },

    /**
     * 手机绑定成功
     * @param data
     */
    bindTelNum: function (data) {
        this._super(data);
        if (this.bindPhoneButton && this.unBindPhoneButton) {
            this.bindPhoneButton.active = false && login_module.Instance().loginType == cc.dd.jlmj_enum.Login_Type.WX;
            this.unBindPhoneButton.active = true && login_module.Instance().loginType == cc.dd.jlmj_enum.Login_Type.WX;
        }
    },

    /**
     * 手机解绑成功
     * @param data
     */
    unbindTel: function (data) {
        this._super(data);
        if (this.bindPhoneButton && this.unBindPhoneButton) {
            this.bindPhoneButton.active = true && login_module.Instance().loginType == cc.dd.jlmj_enum.Login_Type.WX;
            this.unBindPhoneButton.active = false && login_module.Instance().loginType == cc.dd.jlmj_enum.Login_Type.WX;
        }
    },


    openBindPhoneUI: function (type) {
        /************************游戏统计 start************************/
        cc.dd.Utils.sendClientAction(cc.dd.clientAction.HALL, cc.dd.clientAction.T_HALL.BIND_PHONE);
        /************************游戏统计   end************************/
        // this.curPage = parseInt(type);
        // for (var i = 0; i < this.pageNodes.length; i++) {
        //     this.pageNodes[i].active = (i == this.curPage)
        // }
        // this.pageNodes[2].getComponent('klb_hall_BindPhone').selectBindPhoneToggle();
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(hall_prefab.BIND_PHONE);
    },


    onClickContract: function () {
        hall_audio_mgr.com_btn_click();
        // cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_KEFU, function (prefab) {
        //     prefab.getComponent('klbj_hall_KeFu').getKefuDetailInfo();
        // });
        let Platform = require('Platform');
        let AppCfg = require('AppConfig');
        cc.dd.native_systool.OpenUrl(Platform.kefuUrl[AppCfg.PID] + "?user_id=" + cc.dd.user.id);
    },

    //打开荣誉值详细信息界面
    onClickOpenHonorUI: function () {
        this.honorUINode.active = true;
        var cpt = this.honorUINode.getComponent('klb_hall_HonorUI');
        if (cpt)
            cpt.updateInfo();
    },

    //关闭荣誉值详细界面
    onClickCloseHonorUI: function () {
        this.honorUINode.active = false;
    },

    onClickChangeName: function () {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(hall_prefab.CHANGENAME);
    },

    onClickChangeSex: function (event, data) {
        hall_audio_mgr.com_btn_click();

        let sex = 1;
        if(data == 'FEMALE'){
            sex = 2;
        }
        var req = new cc.pb.hall.modify_user_base_info_req();
        req.setSex(sex);
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_modify_user_base_info_req,req,
            '发送协议[id: ${cc.netCmd.hall.cmd_msg_modify_user_base_info_req}],modify_user_base_info_req[修改性别]', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'changeSex');

        this.male.interactable = false;
        this.male.node.getComponent(cc.Button).interactable = false;
        this.female.interactable = false;
        this.female.node.getComponent(cc.Button).interactable = false;
    },

    vipBtnClick: function () {
        // /************************游戏统计 start************************/
        // cc.dd.Utils.sendClientAction(cc.dd.clientAction.HALL, cc.dd.clientAction.T_HALL.VIP);
        // /************************游戏统计   end************************/
        // hall_audio_mgr.com_btn_click();
        // cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_DAILY_ACTIVITY, function (prefab) {
        //     prefab.getComponent('klb_hall_daily_activeUI').showUI(1);
        // });
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_VIP_NEW, function (prefab) {
        });
    },

    updateSex(){
        if (hallData.getInstance().sex == 1) {
            this.male.isChecked = true;
            this.female.isChecked = false;
        } else {
            this.male.isChecked = false;
            this.female.isChecked = true;
        }
        this.male.interactable = this.isAccoutnReg;
        this.male.node.getComponent(cc.Button).interactable = this.isAccoutnReg;
        this.female.interactable = this.isAccoutnReg;
        this.female.node.getComponent(cc.Button).interactable = this.isAccoutnReg;
    },

    onEventMessage(event, data) {
        switch (event) {
            case Hall.HallEvent.GET_USERINFO:
                this.setData(hallData.getInstance(), this.useShortName);
                return;
            case TaskEvent.VIP_GET_GIFT_INFO:
                let flag = cc.find('pageInfo/shareNode/VIP/flag', this.node);
                if(flag){
                    flag.active = HallVip.hasRewardNotRecive()[1];
                }
                return;
        }

        this._super(event, data);
    },

    requestVIPInfo: function () {
        var msg = new cc.pb.rank.msg_vip_open();
        cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_msg_vip_open, msg, 'msg_vip_open', true);
    },
});
