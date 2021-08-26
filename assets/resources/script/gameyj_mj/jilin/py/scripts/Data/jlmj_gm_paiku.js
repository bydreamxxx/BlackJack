/**
 * Created by yons on 2017/6/12.
 */

var dd = cc.dd;

var pai3d_value = require('jlmj_pai3d_value');
/**
 * 事件类型
 */
var GmPaiKuEvent = cc.Enum({
    INIT:            "jlmj_paiku_init",              //牌库init
    CHANGE:          "jlmj_paiku_change",            //换牌
    GM_HUANPAI:      "jlmj_paiku_gm_huanpai",        //gm换牌
});

/**
 * 事件管理
 */
var GmPaiKuED = new dd.EventDispatcher();

var GmPaiKu = cc.Class({

    s_gm_paiku: null,

    statics: {

        Instance: function () {
            if (!this.s_gm_paiku) {
                this.s_gm_paiku = new GmPaiKu();
            }
            return this.s_gm_paiku;
        },

        Destroy: function () {
            if (this.s_gm_paiku) {
                this.s_gm_paiku = null;
            }
        },

    },

    ctor: function () {
        this.paiku = [];
        this.shoupai = [];
        this.hasmodepai = false;
    },


    getUserPlayer:function () {
        var RoomMgr = require('jlmj_room_mgr').RoomMgr;
        var g_id = RoomMgr.Instance().gameId;
        switch (g_id) {
            case cc.dd.Define.GameType.CCMJ_MATCH:
            case cc.dd.Define.GameType.CCMJ_GOLD:
            case cc.dd.Define.GameType.CCMJ_CLUB:
            case cc.dd.Define.GameType.CCMJ_FRIEND:
                return require("ccmj_userPlayer_data").Instance();
            case cc.dd.Define.GameType.JLMJ_CLUB:
            case cc.dd.Define.GameType.JLMJ_FRIEND:
            case cc.dd.Define.GameType.JLMJ_GOLD:
            case cc.dd.Define.GameType.JLMJ_MATCH:
                return require("jlmj_userPlayer_data").Instance();
            case cc.dd.Define.GameType.NAMJ_FRIEND:
            case cc.dd.Define.GameType.NAMJ_GOLD:
            case cc.dd.Define.GameType.NAMJ_MATCH:
                return require("namj_userPlayer_data").Instance();
            case cc.dd.Define.GameType.FXMJ_FRIEND:
            case cc.dd.Define.GameType.FXMJ_GOLD:
            case cc.dd.Define.GameType.FXMJ_MATCH:
                return require("fxmj_userPlayer_data").Instance();
            case cc.dd.Define.GameType.SYMJ_FRIEND:
            case cc.dd.Define.GameType.SYMJ_GOLD:
            case cc.dd.Define.GameType.SYMJ_FRIEND_2:
            case cc.dd.Define.GameType.SYMJ_MATCH:
                return require("symj_userPlayer_data").Instance();
            case cc.dd.Define.GameType.XZMJ_FRIEND:
            case cc.dd.Define.GameType.XZMJ_GOLD:
            case cc.dd.Define.GameType.XZMJ_MATCH:
            case cc.dd.Define.GameType.XLMJ_FRIEND:
            case cc.dd.Define.GameType.XLMJ_GOLD:
            case cc.dd.Define.GameType.XLMJ_MATCH:
                return require("scmj_userPlayer_data").Instance();
            case cc.dd.Define.GameType.SHMJ_FRIEND:
            case cc.dd.Define.GameType.SHMJ_GOLD:
            case cc.dd.Define.GameType.SHMJ_MATCH:
                return require("shmj_userPlayer_data").Instance();
            case cc.dd.Define.GameType.JZMJ_FRIEND:
            case cc.dd.Define.GameType.JZMJ_GOLD:
            case cc.dd.Define.GameType.JZMJ_MATCH:
                return require("jzmj_userPlayer_data").Instance();
            case cc.dd.Define.GameType.HSMJ_FRIEND:
            case cc.dd.Define.GameType.HSMJ_GOLD:
            case cc.dd.Define.GameType.HSMJ_MATCH:
                return require("hsmj_userPlayer_data").Instance();
            case cc.dd.Define.GameType.TDHMJ_FRIEND:
            case cc.dd.Define.GameType.TDHMJ_GOLD:
            case cc.dd.Define.GameType.TDHMJ_MATCH:
                return require("tdhmj_userPlayer_data").Instance();
            case cc.dd.Define.GameType.CFMJ_FRIEND:
            case cc.dd.Define.GameType.CFMJ_GOLD:
            case cc.dd.Define.GameType.CFMJ_MATCH:
                return require("cfmj_userPlayer_data").Instance();
            case cc.dd.Define.GameType.AHMJ_FRIEND:
            case cc.dd.Define.GameType.AHMJ_GOLD:
            case cc.dd.Define.GameType.AHMJ_MATCH:
                return require("ahmj_userPlayer_data").Instance();
            case cc.dd.Define.GameType.FZMJ_FRIEND:
            case cc.dd.Define.GameType.FZMJ_GOLD:
            case cc.dd.Define.GameType.FZMJ_MATCH:
                return require("fzmj_userPlayer_data").Instance();
            case cc.dd.Define.GameType.WDMJ_FRIEND:
            case cc.dd.Define.GameType.WDMJ_GOLD:
            case cc.dd.Define.GameType.WDMJ_MATCH:
                return require("wdmj_userPlayer_data").Instance();
            case cc.dd.Define.GameType.PZMJ_FRIEND:
            case cc.dd.Define.GameType.PZMJ_GOLD:
            case cc.dd.Define.GameType.PZMJ_MATCH:
                return require("pzmj_userPlayer_data").Instance();
            case cc.dd.Define.GameType.BCMJ_FRIEND:
            case cc.dd.Define.GameType.BCMJ_GOLD:
            case cc.dd.Define.GameType.BCMJ_MATCH:
                return require("bcmj_userPlayer_data").Instance();
            case cc.dd.Define.GameType.ACMJ_FRIEND:
            case cc.dd.Define.GameType.ACMJ_GOLD:
            case cc.dd.Define.GameType.ACMJ_MATCH:
                return require("acmj_userPlayer_data").Instance();
            case cc.dd.Define.GameType.HLMJ_FRIEND:
            case cc.dd.Define.GameType.HLMJ_GOLD:
            case cc.dd.Define.GameType.HLMJ_MATCH:
                return require("hlmj_userPlayer_data").Instance();
            case cc.dd.Define.GameType.JSMJ_GOLD:
                return require("jsmj_userPlayer_data").Instance();
            default:
                break;
        }
    },

    /**
     * 设置牌库
     * @param msg
     */
    setPaiKu: function (cardsList) {
        this.cloneUserPlayerShoupai();

        this.paiku = [];
        cardsList.forEach(function (card) {
            this.paiku.push(card.id);
        },this);

        this.paiku.sort(function(a,b){
            return a-b;
        });

        cc.log("【数据】"+"剩余牌库:"+pai3d_value.descs(this.paiku));
        GmPaiKuED.notifyEvent(GmPaiKuEvent.INIT,[this]);
    },

    cloneUserPlayerShoupai: function () {
        this.shoupai = [];
        var pd = this.getUserPlayer();
        pd.shoupai.forEach(function(id){
            this.shoupai.push(id);
        },this);

        cc.log("【数据】"+"克隆手牌1:"+pai3d_value.descs(this.shoupai));
        this.paixu();
        // if(UserPlayer.modepai){
        //     this.shoupai.push(UserPlayer.modepai);
        //     this.hasmodepai = true;
        // }else{
        //     this.hasmodepai = false;
        // }
        cc.log("【数据】"+"克隆手牌2:"+pai3d_value.descs(this.shoupai));
    },

    updateUserPlayerShoupai: function () {
        // if(this.hasmodepai){
        //     var modepai = this.shoupai.pop();
        //     UserPlayer.modepai = modepai;
        // }
        var pd = this.getUserPlayer();
        pd.shoupai = this.shoupai;
        pd.paixu();
        cc.log("【数据】"+"更新手牌:"+pai3d_value.descs(pd.shoupai));
        GmPaiKuED.notifyEvent(GmPaiKuEvent.GM_HUANPAI,[pd]);
    },

    checkShouPaiError: function(netShouPai, netMoPai, localShouPai) {
        if( netMoPai ) {
            netShouPai.push( netMoPai );
        }

        var arrNetShouPai = [];
        for(var v in netShouPai){
            if (netShouPai.hasOwnProperty(v)) { //filter,只输出man的私有属性
                arrNetShouPai.push( netShouPai[v].id );
            };
        }
        cc.log( "服务器手牌：" + pai3d_value.descs(arrNetShouPai) );
        cc.log( "客户端手牌：" + pai3d_value.descs(localShouPai) );

        if( netShouPai.length != localShouPai.length ) {
            // dd.DialogBoxUtil.show( 999, "服务器的牌 和 本地手牌 长度不同", null, null, null, null, null);
            // cc.error( "服务器的牌 和 本地手牌 长度不同" );
            return ;
        }

        for( var i = 0; i < netShouPai.length; ++i ){
            var netItemShouPai = netShouPai[i];
            var flag = false;
            for( var j = 0; j < localShouPai.length; ++j ) {
                if( netItemShouPai.id == localShouPai[j] ) {
                    flag = true;
                    break;
                }
            }
            if( !flag ) {
                // dd.DialogBoxUtil.show( 999, "没有找到id = " + netItemShouPai.id + " 的服务器数据", null, null, null, null, null);
                cc.error( "没有找到id = " + netItemShouPai.id + " 的服务器数据" );
                return ;
            }
        }


    },
    
    changePai: function (msg) {
        if(!msg.handpais||!msg.choosepais||!msg.shoupaiList){
            cc.error("换牌数据出错");
            return;
        }
        var paiku_idx = this.paiku.indexOf(msg.handpais.id);
        var shoupai_idx = this.shoupai.indexOf(msg.choosepais.id);
        if(paiku_idx==-1||shoupai_idx==-1){
            cc.error("牌库和手牌中无这牌"+" 牌库:"+pai3d_value.desc[msg.handpais.id]+" 手牌:"+pai3d_value.desc[msg.choosepais.id]);
            return;
        }
        this.paiku[paiku_idx] = msg.choosepais.id;
        this.shoupai[shoupai_idx] = msg.handpais.id;
        cc.log("【数据】"+"手牌:"+pai3d_value.desc[msg.handpais.id]+" 牌库:"+pai3d_value.desc[msg.choosepais.id]+"已换");


        this.paiku.sort(function(a,b){
            return a-b;
        });
        this.paixu();
        
        this.checkShouPaiError(msg.shoupaiList, msg.mopai, this.shoupai);

        GmPaiKuED.notifyEvent(GmPaiKuEvent.CHANGE,[this,paiku_idx,shoupai_idx]);
    },

    /**
     * 排序牌
     */
    paixu:function () {
        var getType = function (id) {
            if(id>=72&&id<=107){
                return 6;   //万
            }else if(id>=36&&id<=71){
                return 5;   //条
            }else if(id>=0&&id<=35){
                return 4;   //饼
            }else if(id>=120&&id<=135){
                return 3;   //东南西北
            }else if(id>=108&&id<=119){
                return 2;   //中发白
            }else if(id>=136&&id<=143){
                return 1;   //梅兰竹菊春夏秋冬
            }
        };
        this.shoupai.sort(function (a, b) {
            var type_a = getType(a);
            var type_b = getType(b);
            if(type_a == type_b){
                return a-b;
            }else{
                return type_b - type_a;
            }
        });


    },
});

module.exports = {
    GmPaiKuEvent:GmPaiKuEvent,
    GmPaiKuED:GmPaiKuED,
    GmPaiKu:GmPaiKu,
};