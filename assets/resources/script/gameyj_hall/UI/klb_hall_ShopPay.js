var hall_audio_mgr = require('hall_audio_mgr').Instance();
var PayDef = require( "PayDef" );
const weburl = "http://47.92.129.247:3808/quickpay/h5param?";
var Platform = require( "Platform" );
const AppCfg = require('AppConfig');
var item_config = require('item');
var shop_cofig = require('shop');


cc.Class({
    extends: cc.Component,

    properties: {
        iconSp:cc.Sprite,
        nameTxt:cc.Label,
        priceTxt:cc.Label,
        _data:null,

        atlasFudai: {
            default: null,
            type: cc.SpriteAtlas,
        },
    },

    // use this for initialization
    onLoad: function () {
        this.node.zIndex = 5001;
    },

    initUI: function(data, isVipGift){
        this._data = data;
        this.isVipGift = isVipGift;

        var item = shop_cofig.getItem(function(itemdata){
            return itemdata.key == data.id;
        });
        
        var changeData = item_config.getItem(function(itemdata){
            return itemdata.key == data.itemid;
        });
        if(changeData){
            cc.dd.ResLoader.loadAtlas("gameyj_hall/atals/shangcheng",function(atlas){
                var sprite = atlas.getSpriteFrame(item.icon);
                if(changeData.key == 10001){
                    const atlas_1 = cc.dd.ResLoader.loadAtlas("gameyj_hall/atals/fudai",function(atlas_1){
                        sprite = atlas_1.getSpriteFrame('fd-meihdtb');
                    });
                }
                this.iconSp.node.width = sprite.getRect().width;
                this.iconSp.node.height = sprite.getRect().height;
                this.iconSp.spriteFrame = sprite;
                if(item.key == 2001)
                    this.iconSp.node.setScale(0.35);
                else
                    this.iconSp.node.setScale(0.7);
            }.bind(this));


            var num = data.costDiscount > 0 ? data.costDiscount : data.costItemCount;
            this._data.price = num / 100;
            this._data.key = data.id;
            this.priceTxt.string = num / 100+"元";
            // var item = shop_cofig.getItem(function(itemInfo){
            //     return itemInfo.key == data.id;
            // });
            this.nameTxt.string =item.dec;
        }

        // this.iconSp.spriteFrame = atlas.getSpriteFrame(data.icon);

        // this.nameTxt.string = data.name;
        // this.priceTxt.string = '¥'+data.price;
    },

    //根据本地配置表初始化
    initUIVIPGift: function(data,isVipGift){
        this._data = data;
        this.isVipGift = isVipGift;
        if(data){
            this.iconSp.spriteFrame = this.atlasFudai.getSpriteFrame("fd-yuekalibao");;
            var num = data.cost_discount > 0 ? data.cost_discount : data.cost_item_count;
            this.priceTxt.string = num / 100 + "元";
            this.nameTxt.string = data.dec;
        }

    },

    clickPayType: function(event, data){
        hall_audio_mgr.com_btn_click();
        cc.dd.PromptBoxUtil.show('暂未开放，敬请期待');
        return;
        switch (data){
            case 'zfb'://支付宝
                cc.log("支付宝支付")
                this.payType = 22;
                this.payWeChatH5();
                break;
            case 'wx'://微信
                cc.log("微信支付")
                this.payType = 30;
                this.payWeChatH5();
                break;
            case 'other'://其他
                cc.log("其他支付")
                cc.dd.PromptBoxUtil.show('暂未开放，敬请期待');
                break;
            default:
                break;
       };
    },

    close: function(){
        hall_audio_mgr.com_btn_click();

        cc.dd.UIMgr.destroyUI(this.node);
    },

    //////////////////////////////////////汇付宝分割线//////////////////

    /**
     * 微信购买
     */
    payWeChatH5: function() {
        var url = Platform.PaySDKOrder[AppCfg.PID];//PayDef.URL.PAY_WX_H5_WEB;
        
        var pay_type = this.payType;
        var pay_amt = parseFloat(this._data.price).toFixed(2);//this.currItemInfo.cost.toFixed( 2 ).toString();
        var return_url = PayDef.URL.PAY_WX_H5_RETURN_URL;//"http://gamejl.yuejiegame.com:4027/heepay/return";
        var user_ip = "192.168.2.144";

        url = url + "?&pay_type=" + pay_type + "&pay_amt=" + pay_amt + "&return_url=" +
            return_url + "&user_ip=" + user_ip.replace( /\./g, "_" );

        cc.dd.PayWeChatH5.http( url, "", this.onPayWeChatH5.bind( this ) );
    },

    /**
     * 微信购买回调 类型H5
     * 2:yyl
     * 1:大厅
     */
    onPayWeChatH5: function( jsonData ) {
        cc.log("jsonData:"+jsonData)
        cc.log("jsonData.code:"+jsonData.code)
        if( jsonData.code == 1 ) {
            // if( cc.sys.isNative ) {
                //this.webview.node.active = true
                var timTemp = ""
                if(jsonData.time_stamp !=0)
                {
                    timTemp = "&timestamp="+jsonData.time_stamp;
                }
                var is_phone = 1;
                var is_frame = 0;
                var pay_type = this.payType;
                var agent_id = "2109600"; // todo 需要申请下来后再填写使用
                var pay_amt = parseFloat(this._data.price).toFixed(2);//this.currItemInfo.cost.toFixed( 2 ).toString();
                var return_url = PayDef.URL.PAY_WX_H5_RETURN_URL;//"http://gamejl.yuejiegame.com:4027/heepay/return"; // todo url后续需要更新
                var user_ip = "192_168_2_144"; // todo 获取ip地址
                var goods_name = this.isVipGift?"VIP%C0%F1%B0%FC":(this._data.count+"%BD%F0%B6%B9");
                var goods_num = 1;
                var remark =  this.isVipGift?("1_"+cc.dd.user.id+"_"+this._data.key):("1_"+cc.dd.user.id)// +"_2001";
                var goods_note = "";
                var meta_option = {"s":"WAP","n":"悦界互娱官网","id":"http://www.yuejiegame.com/"};
                var jsonstr = JSON.stringify(meta_option)
                //cc.log("jsonstr:"+jsonstr);
                var base64dstr = cc.dd.SysTools.encode64(jsonstr);
                //cc.log("base64dstr:"+base64dstr);
                var encodeuri = encodeURIComponent(base64dstr);
                //cc.log("encodeuri:"+encodeuri);
                //cc.dd.PayWeChatH5.jumpToPay
                var url = PayDef.URL.PAY_WX_H5_ESCROW;
                var args = "?version=" + jsonData.version 
                + "&is_phone=" + is_phone 
                + "&is_frame=" + is_frame 
                + "&pay_type=" + pay_type 
                + "&agent_id=" + agent_id 
                + "&agent_bill_id=" + jsonData.cporder_id 
                + "&pay_amt=" + pay_amt 
                + "&notify_url=" + jsonData.notify_url 
                + "&return_url=" + return_url 
                + "&user_ip=" + user_ip 
                + "&agent_bill_time=" + jsonData.time_string 
                + "&goods_name=" + goods_name 
                + "&goods_num=" + goods_num 
                + "&remark=" + remark 
                + "&goods_note=" + goods_note
                + "&meta_option=" + encodeuri 
                + timTemp
                + "&sign=" +jsonData.sign;
                //this.webview.node.active = true
                //cc.log("url:"+url);

                url = url + args;
                if(cc.sys.isNative){
                    cc.dd.native_systool.OpenUrl(url);
                }else{
                    
                    window.location.href = PayDef.URL.PAY_WX_H5_MIDDLE_URL + args;
                }
                //this.visitURL( url );
                // cc.dd.PayWeChatH5.jumpToPay(jsonData.version, is_phone, is_frame, pay_type, agent_id, jsonData.cporder_id,
                //     pay_amt, jsonData.notify_url, return_url, user_ip, jsonData.time_string, goods_name, goods_num, remark,
                //     goods_note, encodeuri, jsonData.time_stamp, jsonData.sign);
            // } else {
            //     cc.dd.PromptBoxUtil.show( cc.dd.Text.TEXT_SYSTEM_10 );
            // }
        } else {
            cc.dd.PromptBoxUtil.show( jsonData.msg );
        }
    },

    ToGB2312: function (str) {
        return unescape(str.replace(/\\u/gi, '%u'));
    },
});
