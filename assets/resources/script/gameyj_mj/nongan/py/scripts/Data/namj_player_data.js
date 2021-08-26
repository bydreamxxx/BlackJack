var BaipaiType = require("jlmj_baipai_data").BaipaiType;
var BaipaiData = require("jlmj_baipai_data").BaipaiData;

var jlmj_player_data = require('jlmj_player_data');

var PlayerED = jlmj_player_data.PlayerED;
var PlayerEvent = jlmj_player_data.PlayerEvent;
var pai3d_value = require("jlmj_pai3d_value");
var PlayerState = jlmj_player_data.PlayerState;
var na_PlayerData = cc.Class({
    extends: jlmj_player_data.PlayerData,

    properties: {

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
        this.canting = msg.canting;
        this.isGangTing = isGangTing || false;
        this.cangu = msg.cangu;
        var caozuoDes = function (canchi,canpeng,cangang,canbugang,canting,canhu,cangu) {
            var des = "[";
            if(canchi)  { des+=" 吃 " };
            if(canpeng) { des+=" 碰 " };
            if(cangang) { des+=" 杠 " };
            if(canbugang) { des+=" 补杠 " };
            if(canting) { des+=" 听 " };
            if(canhu)   { des+=" 胡 " };
            if(cangu)   { des+=" 估 " };
            des += "]";
            return des;
        };
        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 操作菜单:"+caozuoDes(this.canchi,this.canpeng,this.cangang,this.canbugang,this.canting,this.canhu,this.cangu));

        this.setChiOptions(msg);
        this.setGangOptions(msg);
        this.setCanTing(msg);
        this.setCanGu(msg);

        //桌子上无牌时,只能杠3张牌,其他杠不能杠 (服务器未过滤,客户端此处过滤杠)
        if(this.cangang || this.canbugang){
            var DeskData = require('namj_desk_data').DeskData;
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
        if(this.isTempBaoGu){
            var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent('namj_player_down_ui');
            player_down_ui.setShoupaiTingbiaoji(false);
            this.isTempBaoGu = false;
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

        var playerMgr = require('namj_player_mgr');
        if(!playerMgr.Instance().playing_shou2mid_ani || this.replaying){  //回放,直接摸牌
            this.mopaiAction();
        }
    },

    /**
     * 设置估
     * @param msg
     */
    setCanGu: function(msg) {
        if(!msg.cangu){
            return ;
        }
        this.guInfo_list = {type:msg.actcard.type,val:msg.actcard.value,id:msg.actcard.id};
        this.jiaoInfo_list = [];
        msg.jiaoinfosList.forEach(function (jiaoInfo) {
            var out_id = jiaoInfo.outcard.id;
            var jiaoPai_list = [];
            jiaoInfo.paiinfosList.forEach(function (jiaoPai) {
                jiaoPai_list.push(new JiaoPai(jiaoPai.hucard.id,jiaoPai.fan,jiaoPai.count,jiaoPai.anganghu));
            });
            this.jiaoInfo_list.push(new JiaoInfo(out_id,jiaoPai_list,jiaoInfo.angang));
        },this);

        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 操作菜单:"+"估牌");
    },
    /**
     * 估
     */
    gu: function (msg) {
        if(!msg.gucardList){
            cc.error("【数据】"+"估牌列表为空");
            return;
        }

        ///
        var guIds = [];
        msg.gucardList.forEach(function (card) {
            if(card){
                guIds.push(card.id);
            }else{
                cc.error("【数据】"+"碰牌列表项为空");
            }
        });
        this.delShouPai(guIds,1);
        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 估牌:"+pai3d_value.descs(guIds));

        var baipai_data = new BaipaiData();
        baipai_data.index = this.baipai_data_list.length;
        var mj_index = 0;
        this.baipai_data_list.forEach(function(baipai){
            mj_index += baipai.down_pai_num;
        });
        baipai_data.mj_index = mj_index;
        baipai_data.type = BaipaiType.GU;
        baipai_data.down_pai_num = 1;
        baipai_data.cardIds = guIds;
        this.baipai_data_list.push(baipai_data);

        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 摆牌:");
        this.baipai_data_list.forEach(function(item){
            cc.log(item.toString());
        });

        this.resetBaiPaiIndex();
        //

        this.isBaoTing = true;
        this.isTempBaoGu = false;
        this.state = PlayerState.TINGPAI;
        var card = msg.gucardList[0];
        if(card && typeof(card.id) != "undefined" && card.id == -1){
            //断线重连时本 不应该摸牌
            return;
        }
        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 估后摸牌");
        PlayerED.notifyEvent(PlayerEvent.GU,[this]);
    },
    /**
     * 被估
     */
    beigu: function (msg, isplayer) {
        if(!msg.gucardList){
            cc.error("【数据】"+"估牌列表为空");
            return;
        }
        var guIds = [];
        msg.gucardList.forEach(function (card) {
            if(card){
                guIds.push(card.id);
            }else{
                cc.error("【数据】"+"碰牌列表项为空");
            }
        });

        var beipeng_id = this.chupai.pop();


        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 被估:"+pai3d_value.desc[beipeng_id]);
        PlayerED.notifyEvent(PlayerEvent.BEIGU,[this,guIds,isplayer]);
    },

    /**
     * 是否有摸牌
     */
    hasMoPai: function () {
        if(this.shoupai.length == 11) {
            if(this.baipai_data_list.length == 1 && this.baipai_data_list[0].cardIds.length == 2){
                return false;
            }else{
                return this.shoupai.length % 3 == 2;
            }
        }if(this.shoupai.length == 12) {
            if(this.baipai_data_list.length == 1 && this.baipai_data_list[0].cardIds.length == 2){
                return true;
            }else{
                return this.shoupai.length % 3 == 2;
            }
        }else{
            return this.shoupai.length % 3 == 2;
        }
    },
});


module.exports = {
    PlayerEvent:jlmj_player_data.PlayerEvent,
    PlayerED:jlmj_player_data.PlayerED,
    PlayerData:na_PlayerData,
    PlayerState:jlmj_player_data.PlayerState,
};