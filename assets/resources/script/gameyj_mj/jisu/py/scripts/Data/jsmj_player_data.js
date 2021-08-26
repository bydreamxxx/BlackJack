var base_mj_player_data = require('base_mj_player_data');
var pai3d_value = require("jlmj_pai3d_value");
var BaipaiType = require("jlmj_baipai_data").BaipaiType;
var BaipaiData = require("jlmj_baipai_data").BaipaiData;
var mjComponentValue = null;

var bc_PlayerData = cc.Class({
    extends: base_mj_player_data.PlayerData,

    ctor: function () {
        mjComponentValue = this.initMJComponet();
    },

    /**
     * 用户玩家 是否有操作选项
     */
    hasCaozuo: function () {
        cc.log('----判断关闭吃碰杠菜单开始---'+this.canchi+"  "+this.canpeng+"  "+this.cangang+"  "+this.canting+"  "+this.canhu+"  "+this.canpengting+"  "+this.canchiting+" "+this.cangangting);
        return this.canchi||this.canpeng||this.cangang||this.canting||this.canhu||this.canpengting||this.canchiting||this.cangangting;
    },

    clearCtrlStatus(){
        this.canchi = false;
        this.canpeng = false;
        this.cangang = false;
        this.canbugang = false;
        this.canhu = false;
        this.canting = false;
        this.cangangmopai = false;
        this.canpengting = false;
        this.canchiting = false;
        this.cangangting = false;
    },

    /**
     * 玩家 设置 吃碰杠听胡
     * @param msg
     */
    setCtrlStatus: function (msg, isGangTing) {
        this.canchi = msg.canchi;
        this.canpeng = msg.canpeng;
        this.cangang = msg.cangang;
        this.canbugang = msg.canbugang;
        this.canhu = msg.canhu;
        this.canting = msg.canting;
        this.cangangmopai = msg.cangangmopai;
        this.canpengting = msg.canpengting;
        this.canchiting = msg.canchiting;
        this.cangangting = msg.cangangting;


        var caozuoDes = function (canchi,canpeng,cangang,canbugang,canting,canhu,canpengting,canchiting,cangangting) {
            var des = "[";
            if(canchi)  { des+=" 吃 " };
            if(canpeng) { des+=" 碰 " };
            if(cangang) { des+=" 杠 " };
            if(canbugang) { des+=" 补杠 " };
            if(canting) { des+=" 听 " };
            if(canhu)   { des+=" 胡 " };
            if(canpengting)   { des+=" 叉听 " };
            if(canchiting)   { des+=" 吃听 " };
            if(cangangting)   { des+=" 杠听 " };
            des += "]";
            return des;
        };
        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 操作菜单:"+caozuoDes(this.canchi,this.canpeng,this.cangang,this.canbugang,this.canting,this.canhu,this.canpengting,this.canchiting,this.cangangting));


        if(this._isUserPlayer){
            var DeskData = require(mjComponentValue.deskData).DeskData;
            if(msg.actcard){
                DeskData.Instance().last_chupai_id = msg.actcard.id;
            }
        }
    },

    setCPGTFunc(msg){
        this.setChiOptions(msg);
        this.setGangOptions(msg);
        this.setCanTing(msg);
        this.setCanChiTing(msg);
        this.setCanPengTing(msg);
        this.setCanGangTing(msg);
        // if(this._isUserPlayer) {
        //     this.setDapaiTing(msg);
        // }

        // 菜单显示 延迟到摸牌后
        // PlayerED.notifyEvent(PlayerEvent.CAOZUO,[this, isGangTing]);
    },


    /**
     * 是否有摸牌
     */
    hasMoPai: function () {
        return this.shoupai.length == 5;
    },

    initMJComponet(){
        return require("mjComponentValue").jsmj;
    }
});


module.exports = {
    PlayerEvent:base_mj_player_data.PlayerEvent,
    PlayerED:base_mj_player_data.PlayerED,
    PlayerData:bc_PlayerData,
    PlayerState:base_mj_player_data.PlayerState,
};