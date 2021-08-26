var base_mj_player_data = require('base_mj_player_data');
var mjComponentValue = null;

var cc_PlayerData = cc.Class({
    extends: base_mj_player_data.PlayerData,

    ctor: function () {
        mjComponentValue = this.initMJComponet();
    },

    /**
     * 初始化游戏数据
     */
    initGameData: function () {
        this._super();
        this.paofen = null;
    },

    /**
     * 设置玩家游戏数据
     */
    setGameData: function (playerMsg) {
        this._super(playerMsg);
        this.paofen = playerMsg.paofen;
    },

    /**
     * 用户玩家 是否有操作选项
     */
    hasCaozuo: function () {
        cc.log('----判断关闭吃碰杠菜单开始---'+this.canchi+"  "+this.canpeng+"  "+this.cangang+"  "+this.canting+"  "+this.canhu);
        return this.canchi||this.canpeng||this.cangang||this.canting||this.canhu;
    },

    clearCtrlStatus(){
        this.canchi = false;
        this.canpeng = false;
        this.cangang = false;
        this.canbugang = false;
        this.canting = false;
        this.canhu = false;
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
        this.canting = false;
        this.isGangTing = isGangTing || false;
        var caozuoDes = function (canchi, canpeng, cangang, canbugang, canting, canhu) {
            var des = "[";
            if(canchi)  { des+=" 吃 " };
            if(canpeng) { des+=" 碰 " };
            if(cangang) { des+=" 杠 " };
            if(canbugang) { des+=" 补杠 " };
            if(canting) { des+=" 听 " };
            if(canhu)   { des+=" 胡 " };
            des += "]";
            return des;
        };
        cc.log("【数据】" + "玩家:" + this.userId + " 座位号:" + this.idx + " 操作菜单:" + caozuoDes(this.canchi, this.canpeng, this.cangang, this.canbugang, this.canting, this.canhu));

        if(this._isUserPlayer){
            this.cangangmopai = msg.cangangmopai;
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
        if(this._isUserPlayer) {
            this.setDapaiTing(msg);
        }
    },

    checkGang(){

    },

    showPaoFen:function(score){
        if(score != -3){
            this.paofen = score;
        }
        cc.log("【数据】发送摸牌通知");
        base_mj_player_data.PlayerED.notifyEvent(base_mj_player_data.PlayerEvent.PAOFEN,[this, score]);
    },

    initMJComponet(){
        return require("mjComponentValue").pzmj;
    }
});


module.exports = {
    PlayerEvent:base_mj_player_data.PlayerEvent,
    PlayerED:base_mj_player_data.PlayerED,
    PlayerData:cc_PlayerData,
    PlayerState:base_mj_player_data.PlayerState,
};