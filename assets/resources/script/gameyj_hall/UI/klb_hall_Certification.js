var dd = cc.dd;
const HallCommonEd = require('hall_common_data').HallCommonEd;
const HallCommonEvent = require('hall_common_data').HallCommonEvent;
const HallCommonData = require('hall_common_data').HallCommonData.getInstance();
const data_task = require('task')
const data_item = require('item')
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var hall_prefab = require('hall_prefab_cfg');


cc.Class({
    extends: cc.Component,

    properties: {
        yiShimingNode: cc.Node, //已经实名的界面

        weiShimingNode: cc.Node,//没认证的界面

        nameTTF: cc.Label,       //名字
        shenfenTTF: cc.Label,    //身份证

        /**
         * 姓名输入框
         */
        nameEb: cc.EditBox,
        /**
         * 身份证输入框
         */
        idEb: cc.EditBox,

        idCardTTF: cc.Label,

        descTitle: cc.Label,

        awardPrefab: {
            default: null,
            type: cc.Prefab,
        },
        atlasIcon: {
            default: null,
            type: cc.SpriteAtlas,
        },

        m_awardContent: cc.Node,
        leftNode: cc.Node,
        rightNode: cc.Node,
        contractBtn: cc.Node,
    },

    start: function () {
        this.initView();
    },

    // use this for initialization
    onLoad: function () {
        HallCommonEd.addObserver(this);

        this.leftNode.active = !cc._isBaiDuPingTaiGame;
        if(this.contractBtn){
            this.contractBtn.active = !cc._isBaiDuPingTaiGame;
        }

        this.updateUI();

        //left
        let config = this.getTaskDataByType(1, 11);
        this.descTitle.string = config.title;
        var items = config.awardItems.split(";");//curVipData.items.split(";");

        for (var i = 0; i < items.length; i++) {
            var its = cc.instantiate(this.awardPrefab);
            var content = items[i].split(",");

            var icon = cc.find("icon", its).getComponent(cc.Sprite);
            var sum = cc.find("num", its).getComponent(cc.Label);

            var itemData = data_item.getItem(function (element) {
                if (element.key == parseInt(content[0]))
                    return true;
                else
                    return false;
            }.bind(this));

            icon.spriteFrame = this.atlasIcon.getSpriteFrame(content[0]);
            sum.string = "X" + cc.dd.Utils.getNumToWordTransform(content[1]);
            this.m_awardContent.addChild(its);
        }
        this.items = items;
    },

    getTaskDataByType: function (mainType, subType) {
        //从shop表读取type为1，等级为lvl的一行数据
        var curShopData = data_task.getItem(function (element) {
            return (element.mainType == mainType) && (element.subType == subType);
        }.bind(this))

        return curShopData;
    },
    onDestroy: function () {
        HallCommonEd.removeObserver(this);
    },

    updateUI: function () {
        if (HallCommonData.idNum != '') {
            this.yiShimingNode.active = true;
            this.weiShimingNode.active = false;
            this.nameTTF.string = HallCommonData.name;
            this.shenfenTTF.string = HallCommonData.idNum;
            // this.idCardTTF.string = HallCommonData.idNum;

            if(this._okFunc){
                this._okFunc();
                cc.dd.UIMgr.destroyUI(this.node);
            }
        } else {
            this.yiShimingNode.active = false;
            this.weiShimingNode.active = true;
            this.nameEb.string = '';
            this.idEb.string = '';
        }
    },

    /**
     * 初始化视图
     */
    initView: function () {
        var rootNode = cc.find("Canvas/jlmj_hall_shiming");

        // // 姓名
        // var name = cc.find( "weishiming/name/str", rootNode );
        // cc.dd.Utils.setString( cc.dd.Text.TEXT_SHI_MING_1, name );

        // // 身份证
        // var shenfen = cc.find( "weishiming/shenfen/str", rootNode );
        // cc.dd.Utils.setString( cc.dd.Text.TEXT_SHI_MING_2 , shenfen );
    },

    /**
     * 确认实名回调
     */
    shimingBtnCallBack: function () {
        hall_audio_mgr.com_btn_click();

        if (this.nameEb.string == '') {
            dd.DialogBoxUtil.show(0, cc.dd.Text.TEXT_POPUP_8, '确定');
            return;
        }
        var nameWithoutDot = this.nameEb.string.replace(/\u00b7/g, '');
        var nameReg = /^[\u4E00-\u9FA5]{2,15}$/;
        if (!nameReg.test(nameWithoutDot)) {
            this.nameEb.string = '';
            dd.DialogBoxUtil.show(0, cc.dd.Text.TEXT_POPUP_9, '确定');
            return;
        }

        if (this.idEb.string == '') {
            dd.DialogBoxUtil.show(0, cc.dd.Text.TEXT_POPUP_10, '确定');
            return;
        }
        var idReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (!idReg.test(this.idEb.string)) {
            this.idEb.string = '';
            dd.DialogBoxUtil.show(0, cc.dd.Text.TEXT_POPUP_11, '确定');
            return;
        }

        cc.dd.NetWaitUtil.show('正在实名认证');
        var req = new cc.pb.hall.bind_idcard_req();

        req.setName(this.nameEb.string);
        req.setId(this.idEb.string);
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_bind_idcard_req, req,
            '发送协议[id: ${cc.netCmd.hall.cmd_bind_idcard_req}],bind_idcard_req[实名认证]', true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'shimingBtnCallBack');
    },

    /**
     * 关闭回调
     */
    closeBtnCallBack: function () {
        hall_audio_mgr.com_btn_click();
        if(this._cancelFunc){
            this._cancelFunc()
        }
        cc.dd.UIMgr.destroyUI(this.node);
    },

    /**
     * 事件处理
     * @param event
     * @param data
     */
    onEventMessage: function (event, data) {
        switch (event) {
            case HallCommonEvent.REAL_NAME_AUTHEN:
                HallCommonData.name = this.filterNameString(this.nameEb.string);
                HallCommonData.idNum = this.filterIDString(this.idEb.string);
                this.updateUI();
                this.real_name_authen = true;
                break;
            default:
                break;
        }
    },

    filterIDString(ID) {
        var str = '';
        str += ID.substring(0, 6);
        for (var i = 0; i < ID.length - 10; i++) {
            str += '*';
        }
        str += ID.substr(ID.length - 4);
        return str;
    },

    filterNameString(name) {
        var str = '';
        str += name.substring(0, 1);
        for (var i = 0; i < name.length - 1; i++) {
            str += '*';
        }
        return str;
    },

    showReward(data) {
        this.rewardShowing = true;
        this.scheduleOnce(function () {
            cc.dd.UIMgr.openUI("gameyj_hall/prefabs/klb_hall_daily_lottery_get_award", function (prefab) {
                var cp = prefab.getComponent('klb_hall_daily_lottery_get_award');
                cp.setData(data.itemDataId, data.cnt);
                this.rewardShowing = false;
            }.bind(this));
        }.bind(this), 0.5);
    },

    update(dt) {
        if (this.real_name_authen && this.items.length && !this.rewardShowing && !cc.dd.UIMgr.getUI('gameyj_hall/prefabs/klb_hall_daily_lottery_get_award')) {
            var data = this.items.shift();
            var content = data.split(",");
            var rewardData = { itemDataId: parseInt(content[0]), cnt: parseInt(content[1]) };
            this.showReward(rewardData);
        }
    },

    onClickKefu: function (event, data) {
        hall_audio_mgr.com_btn_click();
        if(cc._chifengGame){
            cc.dd.UIMgr.openUI(hall_prefab.CHIFENG_KEFU);
        }else {
            // cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_KEFU, function (prefab) {
            //     prefab.getComponent('klbj_hall_KeFu').getKefuDetailInfo();
            // });
            let Platform = require('Platform');
            let AppCfg = require('AppConfig');
            cc.dd.native_systool.OpenUrl(Platform.kefuUrl[AppCfg.PID] + "?user_id=" + cc.dd.user.id);
        }
    },

    setBindFunc(okFunc, cancelFunc){
        this._okFunc = okFunc;
        this._cancelFunc = cancelFunc;
    }
});
