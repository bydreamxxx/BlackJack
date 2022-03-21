var login_module = require('LoginModule');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var hall_prefab = require('hall_prefab_cfg');
var HallPropData = require('hall_prop_data').HallPropData.getInstance();
const Hall = require('jlmj_halldata');
var hallData = require('hall_common_data').HallCommonData;
var TaskED = require('hall_task').TaskED;
var TaskEvent = require('hall_task').TaskEvent;
var HallVip = require('hall_vip').VipData.Instance();
let HallCommonEvent = require('hall_common_data').HallCommonEvent;
let game_type = require('game_type');

cc.Class({
    extends: require('klb_hall_UserInfo'),

    properties: {
        fangKaTTF2: { default: null, type: cc.Label, override: true, visible: false },   //房卡
        gold: { default: null, type: cc.Label, override: true, visible: false },         //新钻石
        phoneTTF: { default: null, type: cc.Label, override: true, visible: false },     //手机号
        IDCardTTF: { default: null, type: cc.Label, override: true, visible: false },    //身份证号

        honorUINode: cc.Node, //荣誉值详细界面

        accountType: cc.Label,
        bindPhoneButton: cc.Node,
        unBindPhoneButton: cc.Node,

        changeName: cc.Node,
        changeHead: cc.Button,
        changeHeadTips: cc.Node,

        vipLevel: cc.Sprite,
        vipLevelSP: [cc.SpriteFrame],
        
        vipLevelLabel: cc.Label,
        gameNumLabel: cc.Label,
        bigWinLabel: cc.Label,
        joinTimeLabel: cc.Label,
        addRessLabel: require('LanguageLabel'),

        signaLabel: cc.Label,

        trophyItem: cc.Node,
        trophyListContent: cc.Node,
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
        this.reuqestUserInfo()

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
        if (this.changeName){
            this.changeName.active = this.isAccoutnReg;
            this.changeHead.interactable = this.isAccoutnReg;
            this.changeHeadTips.active = this.isAccoutnReg;
        }

        //刷新网络头像 或者 本地图片
        this.initHead(this.headSp, userInfo.openId, userInfo.headUrl);

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
    },

    setUserData(data) {
        this.vipLevelLabel.string = hallData.getInstance().vipLevel
        this.bigWinLabel.string = cc.dd.Utils.getNumToWordTransform(data.luckiestWins)
        this.joinTimeLabel.string = cc.dd.Utils.timestampToTime(data.firstPlayTime, 'YYYY/mm/dd')
        this.addRessLabel.setText(data.city)
        let gameNums = 0
        for(let i=0; i<data.gamesList.length; i++) {
            gameNums += data.gamesList[i].playedTimes
        }
        this.gameNumLabel.string = cc.dd.Utils.getNumToWordTransform(gameNums)

        this.signaLabel.string = data.mood ? data.mood : ''

        this.loadTrophy(data.champsList)
    },
    //  加载奖杯 
    loadTrophy(champsList) {
        this.trophyListContent.removeAllChildren()
        for(let i=0; i<champsList.length; i++){
            let item = champsList[i]
            let node = cc.instantiate(this.trophyItem);
            node.active =  true
            node.parent = this.trophyListContent
            let gameCfg = game_type.getItem((_item) => {
                return _item.key === item.gameType;
            })
            if(gameCfg){
                cc.find('name', node).getComponent('LanguageLabel').setText(gameCfg.name)
            }
            // cc.find('icon', node).getComponent(cc.Sprite)
            cc.find('count', node).getComponent(cc.Label).string = `X${item.times}`
        }
    },

    reuqestUserInfo() {
        var msg = new cc.pb.friend.msg_friend_detail_info_req();
        msg.friendId = cc.dd.user.id
        cc.gateNet.Instance().sendMsg(cc.netCmd.friend.cmd_msg_friend_detail_info_req, msg, "msg_friend_detail_info_req", true);
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

    // 修改个性签名
    onClickChangeSign: function() {
        cc.dd.DialogInputUtil.show('changemoodtitle', 'changemoodinput', 'OK', (mood)=>{
            var msg = new cc.pb.friend.msg_friend_modify_mood_req();
            msg.mood = mood
            cc.gateNet.Instance().sendMsg(cc.netCmd.friend.cmd_msg_friend_modify_mood_req, msg, "msg_friend_modify_mood_req", true);
        })
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
        cc.dd.UIMgr.openUI(hall_prefab.BJ_HALL_VIP, function (prefab) {
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
            case HallCommonEvent.HALL_UPDATE_USERDATA:
                this.setUserData(hallData.getInstance().userData)
                return
        }

        this._super(event, data);
    },

    requestVIPInfo: function () {
        var msg = new cc.pb.rank.msg_vip_open();
        cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_msg_vip_open, msg, 'msg_vip_open', true);
    },

    onClickUploadLog() {
        hall_audio_mgr.com_btn_click();
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            cc.log(cc.dd.user.id + "设置里上传日志");

            if (!_storagePath)
                // _storagePath = jsb.fileUtils.getWritablePath()+"log";
                _storagePath = jsb.reflection.callStaticMethod("game/SystemTool", "getInnerSDCardPath", "()Ljava/lang/String;");
            var filePath = _storagePath + "/anglegame_log.txt";
            if (jsb.fileUtils.isFileExist(filePath)) {
                cc.dd.SysTools.uploadLog(jsb.fileUtils.getDataFromFile(filePath), Platform.uploadLogUrl[AppCfg.PID]);
            }
        }
    },
});
