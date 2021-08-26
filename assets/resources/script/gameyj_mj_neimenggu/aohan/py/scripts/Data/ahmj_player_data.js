var jlmj_player_data = require('jlmj_player_data');
var pai3d_value = require("jlmj_pai3d_value");
var PlayerEvent = jlmj_player_data.PlayerEvent;
var PlayerED = jlmj_player_data.PlayerED;
var RoomMgr = require("jlmj_room_mgr").RoomMgr;

var cc_PlayerData = cc.Class({
    extends: jlmj_player_data.PlayerData,

    properties: {

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
     * 打牌
     */
    dapai: function (id, isQuick) {
        if(this.chupai.indexOf(id) != -1){
            return;
        }
        var chupai_idx_in_shoupai = 0;
        if(this.replaying){ //回放时确定准确出牌位置
            this.shoupai.forEach(function (shoupai_id,idx) {
                if(shoupai_id == id){
                    chupai_idx_in_shoupai = idx;
                }
            });
        }else{
            chupai_idx_in_shoupai = this.shoupai.length-1;
        }
        cc.log('data-出牌索引',chupai_idx_in_shoupai);
        this.chupai.push(id);
        this.delShouPai([id],1);
        this.isQuick = isQuick;
        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 打牌:" + pai3d_value.desc[id]+" 快出牌:"+isQuick);

        PlayerED.notifyEvent(PlayerEvent.DAPAI,[this,chupai_idx_in_shoupai]);
    },

    /**
     * 被杠
     */
    beigang: function () {
        var beigang_id = this.chupai.pop();
        for(let i = this.chupai.length -1; i >= 0; i--){
            if(this.chupai[i] === beigang_id){
                this.chupai.splice(i, 1);
            }
        }
        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 被杠:"+pai3d_value.desc[beigang_id]);
        PlayerED.notifyEvent(PlayerEvent.BEIGANG,[this, beigang_id]);
    },

    /**
     * 被吃
     */
    beichi: function () {
        var beichi_id = this.chupai.pop();
        for(let i = this.chupai.length -1; i >= 0; i--){
            if(this.chupai[i] === beichi_id){
                this.chupai.splice(i, 1);
            }
        }
        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 被吃:"+pai3d_value.desc[beichi_id]);
        PlayerED.notifyEvent(PlayerEvent.BEICHI,[this]);
    },

    /**
     * 被碰
     */
    beipeng: function () {
        var beipeng_id = this.chupai.pop();
        for(let i = this.chupai.length -1; i >= 0; i--){
            if(this.chupai[i] === beipeng_id){
                this.chupai.splice(i, 1);
            }
        }
        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 被碰:"+pai3d_value.desc[beipeng_id]);
        PlayerED.notifyEvent(PlayerEvent.BEIPENG,[this]);
    },

    /**
     * 玩家 设置 吃碰杠听胡
     * @param msg
     */
    setCpgth: function (msg, isGangTing) {
        this.canchi = msg.canchi;
        this.canpeng = msg.canpeng;
        this.cangang = msg.cangang;
        this.canbugang = msg.canbugang;
        this.canhu = msg.canhu;
        this.canting = false;
        this.isGangTing = isGangTing || false;
        var caozuoDes = function (canchi,canpeng,cangang,canbugang,canting,canhu) {
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
        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 操作菜单:"+caozuoDes(this.canchi,this.canpeng,this.cangang,this.canbugang,this.canting,this.canhu));

        this.setChiOptions(msg);
        this.setGangOptions(msg);
        this.setCanTing(msg);

        //桌子上无牌时,只能杠3张牌,其他杠不能杠 (服务器未过滤,客户端此处过滤杠)
        if(this.cangang || this.canbugang){
            var DeskData = require('ahmj_desk_data').DeskData;
            if(!DeskData.Instance().hasRemainPai()){
                var gangOption = this.gang_options;

                if( gangOption.cardList.length == 1 ) {
                    this.cangang = false;
                    this.canbugang = false;
                    cc.log('无三个的杠,杠过滤');
                } else if( gangOption.cardList.length > 1 ) {
                    var gangOptionList = [];
                    var havexiaoji = DeskData.Instance().isXiaoJiFeiDan;
                    const gang_Analysts = require('jlmj_pai_analysts');
                    gang_Analysts.Instance().getAllGangGroup(gangOption.cardList, gangOptionList, havexiaoji,isGangTing);

                    cc.log('杠牌选项');
                    cc.log(gangOptionList);
                    var has_three_gang = false; //是否有3个的杠
                    for(var i=0; i<gangOptionList.length; ++i){
                        for(var j=0; j<gangOptionList[i].length; ++j){
                            if(gangOptionList[i][j].length == 3){
                                has_three_gang = true;
                                break;
                            }
                        }
                    }
                    if(!has_three_gang){
                        this.cangang = false;
                        this.canbugang = false;
                        cc.log('无三个的杠,杠过滤');
                    }else{
                        cc.log('有三个的杠,杠不过滤');
                    }
                }
            }
        }

        // 菜单显示 延迟到摸牌后
        // PlayerED.notifyEvent(PlayerEvent.CAOZUO,[this, isGangTing]);
    },

    /**
     * 摸牌
     */
    mopai: function (msg) {
        var card = msg.actcard;
        if(card && typeof(card.id) != "undefined" && card.id == -1){
            //断线重连时本 不应该摸牌
            return;
        }
        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 摸牌");
        if(this.replaying){
            this.addShouPai([card.id]);
        }else{
            this.addShouPai([0]);
        }

        var playerMgr = require('ahmj_player_mgr');
        if(!playerMgr.Instance().playing_shou2mid_ani || this.replaying){  //回放,直接摸牌
            this.mopaiAction();
        }
    },
    /**
     * 打开暗杠
     */
    openAnGang: function (pailistList) {
        this.kaipai_an_gang_list = [];
        pailistList.forEach(function (item) {
            if(item&&item.cardinfo&&item.cardinfo.type==4){ //暗杠牌
                if(item.cardinfo.cardindexList){
                    var value = item.cardinfo.cardindexList[0];
                    this.kaipai_an_gang_list.push({value:value,show:true});
                }
            }
        }.bind(this));
        this.kaipai_an_gang_show_idx = 0;
    },

    showPaoFen:function(score){
        if(score != -3){
            this.paofen = score;
        }
        cc.log("【数据】发送摸牌通知");
        jlmj_player_data.PlayerED.notifyEvent(jlmj_player_data.PlayerEvent.PAOFEN,[this, score]);
    },

    guo: function () {
        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 过");
        PlayerED.notifyEvent(PlayerEvent.GUO,[this]);
    },
});


module.exports = {
    PlayerEvent:jlmj_player_data.PlayerEvent,
    PlayerED:jlmj_player_data.PlayerED,
    PlayerData:cc_PlayerData,
    PlayerState:jlmj_player_data.PlayerState,
};