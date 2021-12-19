var dd = cc.dd;
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var hall_prefab = require('hall_prefab_cfg');
var HallCommonObj = require('hall_common_data');
var HallCommonEd = HallCommonObj.HallCommonEd;
var HallCommonEvent = HallCommonObj.HallCommonEvent;
var dingRobot = require('DingRobot');
const HallCommonData = HallCommonObj.HallCommonData;

const hall_prop_data = require('hall_prop_data').HallPropData.getInstance();
const itemConfig = require('item');
const LEAST_LIMIT = 10000;
var hall_net = cc.gateNet;
const msg_coin_pb = require('c_msg_baoxianxiang_coin_pb');
var fortune_hall_msg_send = require('fortune_hall_msg_send').Instance();
var coin_protoId = require('c_msg_baoxianxiang_coin_cmd');

let magic_prop_ids = [1007, 1008, 1036, 1037, 1038, 1020, 1021, 1022, 1023, 1024, 1025, 1039, 1040, 1041, 1042, 1043];

//var login_module = require('LoginModule');

cc.Class({
    extends: cc.Component,

    properties: {
        // bankMainMoney:{
        //     default:null,
        //     type:cc.EditBox,
        // },
        // bankMainPass:{
        //     default:null,
        //     type:cc.EditBox,
        // },
        cashCount:{
            default: null,
            type: cc.Label,
        },
        bankCount:{
            default: null,
            type: cc.Label,
        },
        scrollNode: {
            default: null,
            type : cc.Node,
        },
        contentNode: {
            default: null,
            type : cc.Node,
        },
        spaceY: 7,
        spaceX: 7,
        itemHeight: 148,

        itemCell : [],

        itemTipsNode:{
            default: null,
            type : cc.Node,
        },

        saveSlider: {
            default: null,
            type:  cc.Slider,
        },

        saveProgress: {
            default: null,
            type: cc.ProgressBar,
        },

        getSlider: {
            default: null,
            type:  cc.Slider,
        },

        getProgress: {
            default: null,
            type: cc.ProgressBar,
        },

        saveEditBox: {
            default: null,
            type: cc.EditBox,
        },

        getEditBox: {
            default: null,
            type: cc.EditBox,
        },

        saveButton:{
            default:null,
            type:cc.Button,
        },

        getButton:{
            default:null,
            type:cc.Button,
        },
    },

    // use this for initialization
    onLoad: function () {
       HallCommonEd.addObserver(this);
        this.initBagCell();
        this.initSlider();
        hall_prop_data.setUpdateFlag(false);
    },

    onDestroy:function () {
       HallCommonEd.removeObserver(this);
    },

    initBagCell: function(){
        this.itemCell = [];
        this.contentNode.removeAllChildren(true);
        let prefabPath = hall_prefab.KLB_BAG_CELL;
        cc.dd.ResLoader.loadPrefab(prefabPath, function (prefab) {

            var cellCount = 40;
            for(var i = 0; i < cellCount; i++){
                var cell = cc.instantiate(prefab);
                this.itemCell.push(cell);
                cell.parent = this.contentNode;

                var cnt = this.itemCell.length;
                var y = (Math.floor(i / 4 ) + 0.5)*this.itemHeight + (Math.floor(i / 4) + 0.5)*this.spaceY;
                cell.y = -y;

                var index = cnt % 4;
                if(index == 0) {index = 4};
                var x = (index - 0.5)  * this.itemHeight +  (index - 0.5) * this.spaceX;
                cell.x = x;
                //cell.parent.height = cnt*this.itemHeight+(cnt+1)*this.spaceY;
                //cell.getComponent('klb_hall_BagCell').init(i);
            }
            this.updateBagUI();
         }.bind(this));
    },

    /**
     * 根据物品id获取数据
     */
    getItemById: function(Id){
        for(var i = 0; i < itemConfig.items.length; i++){
            var item = itemConfig.items[i];
            if(item.key == Id){
                return item;
            }
        }
        return null;
    },

    updateBagUI: function(){
        this.clearBagUIInfo();
        var index = 0;
        for(var i = 0; i < hall_prop_data.propList.length; i++){
            var data = hall_prop_data.propList[i];
            if(cc.game_pid == 2){
                if(data.dataId == 1102){
                    var itemInfo = this.getItemById(data.dataId);
                    if(itemInfo && itemInfo.isshow != 0){
                        this.itemCell[index].getComponent('klb_hall_BagCell').init(itemInfo, data);
                        index++;
                    }
                }
            }else{
                if(data.dataId == 1004 || data.dataId == 1099 ){
                    continue;
                }
                //屏蔽魔法表情
                // if((data.dataId >= 1007 && data.dataId <= 1013 ) || (data.dataId >= 1020 && data.dataId <= 1030) || (data.dataId >= 1036 && data.dataId <= 1043)){
                //     continue
                // }

                if(cc._applyForPayment){
                    if(data.dataId == 1003 || (data.dataId >= 10055 && data.dataId <= 10063) || data.dataId == 1004 || data.dataId == 1099){
                        continue;
                    }
                }

                if(data.count > 0 || (data.count == 0 && (data.dataId == 1004 || data.dataId == 1099))){
                    var itemInfo = this.getItemById(data.dataId);
                    if(itemInfo && itemInfo.isshow != 0){
                        this.itemCell[index].getComponent('klb_hall_BagCell').init(itemInfo, data);
                        index++;
                    }
                }
            }
        }

        this.cashCount.string = this.changeNumToCHN(hall_prop_data.getCoin());
        this.bankCount.string = this.changeNumToCHN(hall_prop_data.getBankCoin());

    },

    clearBagUIInfo: function(){
        this.itemCell.forEach(function(cell){
            cell.getComponent('klb_hall_BagCell').clearInfo();
        });
    },
    
    onClose: function(){
        hall_audio_mgr.com_btn_click();
        // 返回大厅
        cc.dd.SceneManager.enterNewHall(this.node);
        cc.dd.UIMgr.destroyUI(this.node);
        
    },

    onClickKeFu: function(event,data){
        // login_module.Instance().reconnectWG();
        // return;
        hall_audio_mgr.com_btn_click();
        // cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_KEFU, function(prefab){
        //     prefab.getComponent('klbj_hall_KeFu').getKefuDetailInfo();
        // });        // this.onClose();
        let Platform = require('Platform');
        let AppCfg = require('AppConfig');
        cc.dd.native_systool.OpenUrl(Platform.kefuUrl[AppCfg.PID] + "?user_id=" + cc.dd.user.id);
    },

    initSlider: function(){
        var slider1 = null, slider2 = null;
        var progressBar1 = null, progressBar2 = null;
        var editBox1 = null, editBox2 = null;

        slider1 = this.saveSlider;
        progressBar1 = this.saveProgress;
        editBox1 = this.saveEditBox;
        slider1.progress = 0;
        progressBar1.progress = 0;
        editBox1.string = 0;

        slider2 = this.getSlider;
        progressBar2 = this.getProgress;
        editBox2 = this.getEditBox;
        slider2.progress = 0;
        progressBar2.progress = 0;
        editBox2.string = 0;
    },

    //slider滑动
    onSliderMove: function(event, data){
        var slider = null;
        var progressBar = null;
        var editBox = null;
        var maxNum = 0;
        if(data == '1'){
            slider = this.saveSlider;
            progressBar = this.saveProgress;
            editBox = this.saveEditBox;
            maxNum = hall_prop_data.getCoin()
        }else{
            slider = this.getSlider;
            progressBar = this.getProgress;
            editBox = this.getEditBox;
            maxNum = hall_prop_data.getBankCoin();
        }
        var progress = slider.progress;
        var value = progress;
        if(maxNum != 0){
            // var part = 0/maxNum;
            // if(part <= 1.0 ){
            //     if(value < part){
            //         value = part;
            //     }
            //     var cnt = Math.ceil(value/part);
                var num = parseInt(value * maxNum);
                if(num > maxNum)
                    num = maxNum;
                editBox.string = num;
                //progress = cnt*part;
                if(progress > 1.0)
                    progress = 1.0;
            // }else{
            //     editBox.string = 0;
            //}
        }else{
            editBox.string = 0;
        }

        slider.progress = progress;
        progressBar.progress = progress;
    },

    //editBox输入改变
    onSaveEditBoxEnterChanged: function(event, data){
        var n = Number(event);
        if(isNaN(n)){
            cc.dd.PromptBoxUtil.show("number error");
            return
        }
        var maxNum = hall_prop_data.getCoin();
        var num = 0
        num = parseInt(event);
        if(event == "")
            num  = 0;        var num = 0
            num = parseInt(event);
            if(event == "")
                num  = 0;
        if(num > maxNum)
            this.saveEditBox.string = maxNum;
        var progress = num / maxNum;
        if(progress > 1)
            progress = 1;
        this.saveSlider.progress = progress;
        this.saveProgress.progress = progress;
    },

    onEditBoxEnterBegin: function(event, data){
        var slider = null;
        var progressBar = null;
        var editBox = null;
        if(data == '1'){
            slider = this.saveSlider;
            progressBar = this.saveProgress;
            editBox = this.saveEditBox;
        }else{
            slider = this.getSlider;
            progressBar = this.getProgress;
            editBox = this.getEditBox;
        }
        editBox.placeholder = "";
        editBox.string = "";
        slider.progress = 0;
        progressBar.progress = 0;

    },

    //editBox输入改变
    onGetEditBoxEnterChanged: function(event, data){
        var n = Number(event);
        if(isNaN(n)){
            cc.dd.PromptBoxUtil.show("number error");
            return
        }
        var maxNum = hall_prop_data.getBankCoin();
        var num = 0
        num = parseInt(event);
        if(event == "")
            num  = 0;
        if(num > maxNum)
            this.getEditBox.string = maxNum;
        else
            this.getEditBox.string = num;
        if(maxNum != 0){
            var progress = num / maxNum;
            if(progress > 1)
                progress = 1;
            this.getSlider.progress = progress;
            this.getProgress.progress = progress;
        }

    },


    //editbox输入结束
    onEditBoxEnterEnd: function(event, data){

       // var str = "存入金币不少于3w金币";
        var slider = null;
        var progressBar = null;
        var editBox = null;
        var maxNum = 0;
        if(data == '1'){
            slider = this.saveSlider;
            progressBar = this.saveProgress;
            editBox = this.saveEditBox;
            editBox.placeholder = "Enter number";
        }else{
            slider = this.getSlider;
            progressBar = this.getProgress;
            editBox = this.getEditBox;
            editBox.placeholder = "Enter number";
           // str = "取出金币不少于3w金币";
        }
        var n = Number(editBox.string);
        if(isNaN(n)){
            cc.dd.PromptBoxUtil.show("Enter Right number");
            editBox.string = '';
            if(data == '1')
                editBox.placeholder = "Enter number";
            else
                editBox.placeholder = "Enter number";
            return
        }
        //var num = parseInt(editBox.string);
        // if(num < 30000){
        //     editBox.string = '0';
        //     cc.dd.PromptBoxUtil.show(str);
        //     slider.progress = 0;
        //     progressBar.progress = 0;
        // }
    },

    onClickBagSaveBtn: function (event, custom) {
        if (event.type != "touchend") {
            return;
        }
        hall_audio_mgr.com_btn_click();
        if(this.saveEditBox.string=="")
        {
            cc.dd.PromptBoxUtil.show("Enter number");
            return false;
        }

        var sum = parseInt(this.saveEditBox.string)

        fortune_hall_msg_send.requestBankSaveCoin(sum);
        this.saveSlider.progress = 0;
        this.saveProgress.progress = 0;
        this.saveEditBox.string = 0;
        // AudioManager.playSound( AudioPath.Sound_ClickedButton );
    },

    onClickBagPickOutBtn: function (event, custom) {
        if (event.type != "touchend") {
            return;
        }
        hall_audio_mgr.com_btn_click();
        // if(this.checkPassWord(this.bankMainPass))
        // {
        var sum = parseInt(this.getEditBox.string)
        if(this.getEditBox.string == "")
        {
            //cc.dd.PromptBoxUtil.show("取出金额至少"+30000);
            return;
        }

        this.getSlider.progress = 0;
        this.getProgress.progress = 0;
        this.getEditBox.string = 0;
        var req = new msg_coin_pb.msg_coin_bank_take_2s();
        req.setCoin(sum);
        hall_net.Instance().sendMsg(coin_protoId.cmd_msg_coin_bank_take_2s, req,
            'get', true);
       //}
        // AudioManager.playSound( AudioPath.Sound_ClickedButton );
    },

    /**
     * 筹码数字转换
     */
    changeNumToCHN: function (num) {
        var str = '';
        if (num >= 1000000000) {
            str = (num / 1000000000.00).toFixed(2) + 'billion';
        } else {
            str = num;
        }
        return str;
    },


    onEventMessage:function (event,data) {
        switch (event){
            case HallCommonEvent.UPDATA_PropData:
                this.updateBagUI();
                break;
            case HallCommonEvent.BANK_MAIN_UPDATE_COIN:
            case HallCommonEvent.HALL_UPDATE_ASSETS:
            this.cashCount.string = this.changeNumToCHN(hall_prop_data.getCoin());
            this.bankCount.string = this.changeNumToCHN(hall_prop_data.getBankCoin());
            break;
        }   
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
