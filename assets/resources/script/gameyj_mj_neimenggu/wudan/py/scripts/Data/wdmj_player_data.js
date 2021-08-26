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
     * 排序手牌
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

        var DeskData = require(mjComponentValue.deskData).DeskData;
        if(DeskData.Instance().unBaopai >= 0){
            if(this.hasMoPai()){//有摸牌
                var arr = this.shoupai.splice(0, this.shoupai.length-1);
                arr.sort(function (a, b) {
                    if(DeskData.Instance().isHunPai(a)){
                        return -1;
                    }else if(DeskData.Instance().isHunPai(b)) {
                        return 1;
                    }else{
                        var type_a = getType(a);
                        var type_b = getType(b);
                        if(type_a == type_b){
                            return a-b;
                        }else{
                            return type_b - type_a;
                        }
                    }
                });
                this.shoupai = arr.concat(this.shoupai);
            }else {
                this.shoupai.sort(function (a, b) {
                    if(DeskData.Instance().isHunPai(a)){
                        return -1;
                    }else if(DeskData.Instance().isHunPai(b)) {
                        return 1;
                    }else{
                        var type_a = getType(a);
                        var type_b = getType(b);
                        if(type_a == type_b){
                            return a-b;
                        }else{
                            return type_b - type_a;
                        }
                    }
                })
            }
        }else{
            if(this.hasMoPai()){//有摸牌
                var arr = this.shoupai.splice(0, this.shoupai.length-1);
                arr.sort(function (a, b) {
                    var type_a = getType(a);
                    var type_b = getType(b);
                    if(type_a == type_b){
                        return a-b;
                    }else{
                        return type_b - type_a;
                    }
                });
                this.shoupai = arr.concat(this.shoupai);
            }else {
                this.shoupai.sort(function (a, b) {
                    var type_a = getType(a);
                    var type_b = getType(b);
                    if(type_a == type_b){
                        return a-b;
                    }else{
                        return type_b - type_a;
                    }
                })
            }
        }
    },

    /**
     * 用户玩家 是否有操作选项
     */
    hasCaozuo: function () {
        cc.log('----判断关闭吃碰杠菜单开始---'+this.canchi+"  "+this.canpeng+"  "+this.cangang+"  "+this.canting+"  "+this.canhu+"  "+this.canbuhua);
        return this.canchi||this.canpeng||this.cangang||this.canting||this.canhu||this.canbuhua;
    },

    clearCtrlStatus(){
        this.canchi = false;
        this.canpeng = false;
        this.cangang = false;
        this.canbugang = false;
        this.canting = false;
        this.canhu = false;
        this.canbuhua = false;
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
        this.canbuhua = msg.canbuhua
        this.isGangTing = isGangTing || false;
        var caozuoDes = function (canchi, canpeng, cangang, canbugang, canting, canhu, canbuhua) {
            var des = "[";
            if(canchi)  { des+=" 吃 " };
            if(canpeng) { des+=" 碰 " };
            if(cangang) { des+=" 杠 " };
            if(canbugang) { des+=" 补杠 " };
            if(canting) { des+=" 听 " };
            if(canhu)   { des+=" 胡 " };
            if(canbuhua)   { des+=" 补花 " };
            des += "]";
            return des;
        };
        cc.log("【数据】" + "玩家:" + this.userId + " 座位号:" + this.idx + " 操作菜单:" + caozuoDes(this.canchi, this.canpeng, this.cangang, this.canbugang, this.canting, this.canhu, this.canbuhua));

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
            this.setBuHua(msg);
            this.setDapaiTing(msg);
        }
    },

    checkGang(){

    },

    setBuHua(msg){
        this.buhuaId = -1;

        if(!this.canbuhua || msg.userid != cc.dd.user.id){
            return;
        }

        for(let i = 0; i < this.shoupai.length; i++){
            if(this.shoupai[i] >= 136){
                this.buhuaId = this.shoupai[i];
                break;
            }
        }

        if(this.buhuaId >= 0){
            base_mj_player_data.PlayerED.notifyEvent(base_mj_player_data.PlayerEvent.SHOW_BU_HUA,[this, this.buhuaId]);
        }
    },

    showPaoFen:function(score){
        if(score != -3){
            this.paofen = score;
        }
        cc.log("【数据】发送摸牌通知");
        base_mj_player_data.PlayerED.notifyEvent(base_mj_player_data.PlayerEvent.PAOFEN,[this, score]);
    },

    initMJComponet(){
        return require("mjComponentValue").wdmj;
    }
});


module.exports = {
    PlayerEvent:base_mj_player_data.PlayerEvent,
    PlayerED:base_mj_player_data.PlayerED,
    PlayerData:cc_PlayerData,
    PlayerState:base_mj_player_data.PlayerState,
};