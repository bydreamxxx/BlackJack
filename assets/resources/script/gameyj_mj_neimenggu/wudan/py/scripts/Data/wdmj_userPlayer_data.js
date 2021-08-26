var _playerData = require("wdmj_player_data");
let mjComponentValue = null;
var JiaoInfo = require('jlmj_jiaopai').JiaoInfo;
var JiaoPai = require('jlmj_jiaopai').JiaoPai;

var WDMJUserPlayerData = cc.Class({

    extends: _playerData.PlayerData,

    s_userPlayer: null,

    properties:{
        _isUserPlayer: {default:true, override:true},
    },

    statics: {

        Instance: function () {
            if(!this.s_userPlayer){
                this.s_userPlayer = new WDMJUserPlayerData();
            }
            return this.s_userPlayer;
        },

        Destroy: function () {
            if(this.s_userPlayer){
                this.s_userPlayer = null;
            }
        },
    },

    ctor(){
        mjComponentValue = this.initMJComponet();
    },

    setJiaoPaiMsg:function (jiaopai) {
        this.curjiaoPaiInfo_list = [];
        for(var i in jiaopai){
            var list = jiaopai[i].paiinfosList[0];
            if(jiaopai[i].anyjiao){
                var DeskData = require(mjComponentValue.deskData).DeskData;

                this.curjiaoPaiInfo_list.push({id:DeskData.Instance().getHunPaiID(), fan:-1,cnt:-1});
            }else{
                this.curjiaoPaiInfo_list.push({id:list.hucard.id, fan:list.fan,cnt:list.count});
            }
        }
    },

    setDapaiTing:function (msg) {
        if(!msg.jiaoinfosList.length){
            return;
        }
        this.jiaoInfo_list = [];
        var list = [];
        msg.jiaoinfosList.forEach(function (jiaoInfo) {
            var out_id = null;
            var jiaoPai_list = [];
            if(jiaoInfo.outcard){
                out_id = jiaoInfo.outcard.id;
                list.push(out_id);
            }
            jiaoInfo.paiinfosList.forEach(function (jiaoPai) {
                jiaoPai_list.push(new JiaoPai(jiaoPai.hucard.id,jiaoPai.fan,jiaoPai.count,jiaoPai.anganghu));
            });

            if(jiaoInfo.anyjiao){
                var DeskData = require(mjComponentValue.deskData).DeskData;
                jiaoPai_list.push(new JiaoPai(DeskData.Instance().getHunPaiID(), -1, -1, false));
            }

            this.jiaoInfo_list.push(new JiaoInfo(out_id,jiaoPai_list,jiaoInfo.angang));
        },this);

        if(!msg.canting && !msg.canhu){
            this.require_PlayerED.notifyEvent(this.require_PlayerEvent.SHOW_DAPAI_TING,[this, true, list, 4]);    //设置可点击的牌
        }

        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 打牌后可以听牌");
    },
});

module.exports = WDMJUserPlayerData;
