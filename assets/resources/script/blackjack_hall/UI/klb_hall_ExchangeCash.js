var hall_audio_mgr = require('hall_audio_mgr').Instance();
const Hall = require('jlmj_halldata');
var hall_prefab = require('hall_prefab_cfg');

cc.Class({
    extends: cc.Component,

    properties: {
        RoleTxt: cc.Label,
        changeNum: 0,
        data: null,
        toggleNode: {default:[], type: cc.Node, tooltip:'选择框'},
        changeBtn: cc.Button,
        sendType: 1,
        desc: cc.RichText,
    },

    // use this for initialization
    onLoad: function () {
        Hall.HallED.addObserver(this);

        if(cc._isKuaiLeBaTianDaKeng){
            if(this.desc){
                this.desc.string = '<color=#574c46>兑换成功后，系统会生成</c><color=#cc0000>“红包兑换码”</c><color=#574c46>请复制该兑换码并粘贴</c><color=#cc0000>（快乐吧棋牌官方公众号）</c><color=#574c46>,即可领取</color>'
            }
        }
    },

    onDestroy:function () {
        Hall.HallED.removeObserver(this);
    },

    setData: function(data, num1, num2){
        if(num1 != 0){
            this.toggleNode[0].getChildByName('Background').getChildByName('desc').getComponent(cc.Label).string = num1 + '元';
            this.toggleNode[0].tagname = num1;
        }else
            this.toggleNode[0].active = false;

        if(num2 != 0){
            this.toggleNode[1].getChildByName('Background').getChildByName('desc').getComponent(cc.Label).string = num2 + '元';
            this.toggleNode[1].tagname = num2;
        }else
            this.toggleNode[1].active = false;
        this.changeNum = num1;
        if(data == null){
            this.changeBtn.interactable = false;
            return;
        }
        if((data.count / 100) < num1){
            this.changeBtn.interactable = false;
            return;
        }
        this.data = data;
    },

    setActiveData: function(data,num1, isActive){
        if(num1 != 0){
            this.toggleNode[0].getChildByName('Background').getChildByName('desc').getComponent(cc.Label).string = num1 + '元';
            this.toggleNode[0].tagname = num1;
        }else
            this.toggleNode[0].active = false;


        this.toggleNode[1].active = false;
        this.changeNum = num1;
        if(data == null){
            this.changeBtn.interactable = false;
            return;
        }
        if(!isActive){
            this.changeBtn.interactable = false;
            return;
        }
        this.data = data;
        this.sendType = 2;
    },

    setQuickData: function(data){
        var richText = cc.dd.Utils.seekNodeByName(this.node, "changeCount").getComponent(cc.RichText);
        richText.string = '<color=#cc0000>' + (data.count / 100) + '</c><color=#574c46>元</color>';
        this.changeNum = (data.count / 100);
        this.data = data;
        this.sendType = 3;
    },

    selectExchangeType: function(event,  data){
        hall_audio_mgr.com_btn_click();
        this.changeNum = event.node.tagname;
        // switch(event.target.tag){
        //     case 25:
        //         this.changeNum = 25;
        //         break;
        //     case '50':
        //         this.changeNum = 50;
        //         break;
        //     default:
        //         break;
        // }
    },

    onChange: function(event, data){
        hall_audio_mgr.com_btn_click();
        if(this.sendType == 1 || this.sendType == 3){
            var count = this.data.count / 100;
            if(count < this.changeNum)
            {   
                var str = '红包券不足' + this.changeNum +'元，请获取更多红包券';
                if(this.sendType == 3)
                    str = '红包不足,不能进行兑换'
                cc.dd.PromptBoxUtil.show(str);
                return;
            }  
            var msg = new cc.pb.hall.msg_use_bag_item_req();
            msg.setUseType(this.sendType);
            msg.setItemDataId(this.data.dataId);
            msg.setNum(this.changeNum * 100);
    
            cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_msg_use_bag_item_req,msg,"cmd_msg_use_bag_item_req", true);
            cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'msg_use_bag_item_req');

        }else if(this.sendType == 2){
            var pbObj = new cc.pb.rank.msg_trade_shop_exchange_req();
            pbObj.setId(this.data.id );
            pbObj.setName("");
            pbObj.setPhone("");
            pbObj.setAdd("");
            pbObj.setOpType(2);
            cc.gateNet.Instance().sendMsg(cc.netCmd.rank.cmd_msg_trade_shop_exchange_req, pbObj, 'msg_trade_shop_exchange_req', true);
            cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'msg_trade_shop_exchange_req');

        }
    },

    openCodeUI: function(msg){
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_EXCHANGE_CODE, function(prefab){
            var component = prefab.getComponent('klb_hall_ExchangeCode');
            component.setData(msg);
            this.close();
        }.bind(this));
    },

    onOpenHistoryUI: function(event, data){
        var msg = new cc.pb.hall.msg_open_code_req();
        msg.setType(2);
        msg.setOpType(this.sendType);
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_msg_open_code_req,msg,"msg_open_code_req", true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onOpenHistoryUI');
    },

    onOpenFollowUI: function(event, data){
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_EXCHANGE_Follow, function(prefab){
        });
    },

    onOpenCodeListUI: function(event, data){
        var msg = new cc.pb.hall.msg_open_code_req();
        msg.setType(1);
        msg.setOpType(this.sendType);
        cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_msg_open_code_req,msg,"msg_open_code_req", true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'onOpenHistoryUI');

    },

    openHistoryCodeUI: function(msg){
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_EXCHANGE_HISTORY, function(prefab){
            var component = prefab.getComponent('klb_hall_ExchangeHistory');
            component.setData(msg);
        }.bind(this));
    },

    openCodeListUI: function(msg){
        cc.dd.UIMgr.openUI(hall_prefab.KLB_HALL_EXCHANGE_CODELIST, function(prefab){
            var component = prefab.getComponent('klb_hall_ExchangeCodeList');
            component.setData(msg);
            this.close();
        }.bind(this));
    },

    saveCodeToPhoto: function(event, data){
        if (cc.sys.OS_ANDROID == cc.sys.os || cc.sys.OS_IOS == cc.sys.os) {
            cc.dd.SysTools.captureScreenToPhotoAlbum();
        }
        this.close();
    },

    setGetBounsRoleNum: function(msg){
        this.RoleTxt.string = msg.num;
    },

    close: function(){
        cc.dd.UIMgr.destroyUI(this.node);
    },

    onEventMessage:function (event,data) {
        switch (event){
            case Hall.HallEvent.Use_Item_Ret:
                this.openCodeUI(data);
                break;
            case Hall.HallEvent.Exchange_Code_History:
                this.openHistoryCodeUI(data);
                break;
            case Hall.HallEvent.Exchange_Code_List:
                this.openCodeListUI(data);
                break;
            case Hall.HallEvent.Get_Bouns_Num:
                this.setGetBounsRoleNum(data);
                break;
        }   
    },
});
