var BaipaiType = require("jlmj_baipai_data").BaipaiType;
var BaipaiData = require("jlmj_baipai_data").BaipaiData;

var gang_pai_List = require('jlmj_gang_pai_type');

var jlmj_player_data = require('jlmj_player_data');

var PlayerED = jlmj_player_data.PlayerED;
var PlayerEvent = jlmj_player_data.PlayerEvent;
var pai3d_value = require("jlmj_pai3d_value");
var PlayerState = jlmj_player_data.PlayerState;

var JiaoInfo = require('jlmj_jiaopai').JiaoInfo;
var JiaoPai = require('jlmj_jiaopai').JiaoPai;

var fx_PlayerData = cc.Class({
    extends: jlmj_player_data.PlayerData,

    properties: {

    },
    /**
     * 初始化游戏数据
     */
    initGameData: function () {
        this._super();
        this.isXiaosa = false;//潇洒
    },
    /**
     * 设置玩家游戏数据
     */
    setGameData: function (playerMsg) {
        this.hasGameData = true;   //是否有游戏数据
        this.userId = playerMsg.userid;
        this.coin = playerMsg.coin;
        this.nickname = playerMsg.nickname;
        this.name = playerMsg.nickname;
        this.sex = playerMsg.sex;
        this.ip = playerMsg.ip;
        this.address = playerMsg.address;
        this.idx = playerMsg.site;
        this.headUrl = playerMsg.wxinfo.headurl;

        this.isbanker = playerMsg.isbanker;
        this.isOwner = playerMsg.isowner;
        this.bready = playerMsg.bready;
        this.nHuPai = playerMsg.nhupai;
        this.gameStatus = playerMsg.gamestatus;
        this.agentMode = playerMsg.agentmode;
        this.isBaoTing = playerMsg.isbaoting;
        this.isXiaosa = playerMsg.isxiaosa;
        if(this.isBaoTing){
            this.state = PlayerState.TINGPAI;
        }else{
            this.state = PlayerState.DAPAI;
        }

        this.chupai = [];              //出牌
        playerMsg.playercard.outcardList.forEach(function (card) {
            this.chupai.push(card.id)
        }.bind(this));
        this.shoupai = [];             //手牌

        //回放时,所有玩家的手牌都看得到
        if(playerMsg.playercard.handcardList.length == 0){
            for(var i=0; i<playerMsg.playercard.handcardcount; ++i){
                this.shoupai.push(0);
            }
        }else{
            playerMsg.playercard.handcardList.forEach(function (card) {
                this.pushData(this.shoupai,card.id);
            }.bind(this));
            // this.paixu();
            if(playerMsg.playercard.mopai && playerMsg.playercard.mopai.id >= 0){
                this.pushData(this.shoupai,playerMsg.playercard.mopai.id);
            }
        }
        this.baipai_data_list = [];    //摆牌

        this.initBaiPaiData( playerMsg.playercard.composecardList );
        cc.log("座位号:",this.idx," 手牌数:",this.shoupai.length);
        this.kaipai_an_gang_list = [];
    },
    /**
     * 玩家 设置 吃碰杠听胡
     * @param msg
     */
    setCpgth: function (msg, isGangTing) {
        this.canchi = !msg.chitingjiaoinfosList.length && msg.canchi?true:false;
        this.canpeng = msg.canpeng;
        this.cangang = msg.cangang;
        this.canbugang = msg.canbugang;
        this.canhu = msg.canhu;
        this.canting = msg.canting;
        this.isGangTing = isGangTing || false;
        this.cangangmopai = msg.cangangmopai;
        this.canxiaosa = msg.canxiaosa;
        this.canchiting = msg.chitingjiaoinfosList.length && msg.canchi?true:false;
        var caozuoDes = function (canchi,canpeng,cangang,canbugang,canting,canhu,cangu) {
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
        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 操作菜单:"+caozuoDes(this.canchi,this.canpeng,this.cangang,this.canbugang,this.canting,this.canhu,this.cangu));
        this.isTempXiaosa = false;
        this.isTempChiTing = false;
        this.isTempPengTing = false;
        this.isTempGangTing = false;
        this.setChiOptions(msg);
        this.setGangOptions(msg);
        this.setCanTing(msg);
        this.setCanChiTing(msg);
        this.setCanPengTing(msg);
        this.setCanGangTing(msg);


        //桌子上无牌时,只能杠3张牌,其他杠不能杠 (服务器未过滤,客户端此处过滤杠)
        if(this.cangang || this.canbugang){
            var DeskData = require('fxmj_desk_data').DeskData;
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
            var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent('fxmj_player_down_ui');
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

        var playerMgr = require('fxmj_player_mgr');
        if(!playerMgr.Instance().playing_shou2mid_ani || this.replaying){  //回放,直接摸牌
            this.mopaiAction();
        }
    },

    /**
     * 设置吃听
     * @param msg
     */
    setCanChiTing: function(msg) {
        if(!msg.canchiting || !msg.chiinfoList){
            return;
        }
        msg.chiinfoList.forEach(function(item,idx){
            if(item.chicardList){
                var chi_option = [];
                item.chicardList.forEach(function (item) {
                    chi_option.push(item.id);
                },this);
                this.chi_options.push(chi_option);
             }
        },this);

        if(msg.chitingjiaoinfosList){
            this.jiaoInfo_list = [];
            msg.jiaoinfosList.forEach(function (jiaoInfo) {
                var out_id = jiaoInfo.outcard.id;
                var jiaoPai_list = [];
                jiaoInfo.paiinfosList.forEach(function (jiaoPai) {
                    jiaoPai_list.push(new JiaoPai(jiaoPai.hucard.id,jiaoPai.fan,jiaoPai.count,jiaoPai.anganghu));
                });
                this.jiaoInfo_list.push(new JiaoInfo(out_id,jiaoPai_list,jiaoInfo.angang));
            },this);
        }

        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 操作菜单:"+"吃听牌");
    },

    /**
     * 设置碰听
     * @param msg
     */
    setCanPengTing: function(msg) {
        if(!msg.pengtingjiaoinfosList.length){
            return;
        }
        this.peng_pai = msg.actcard.id;

        if(msg.pengtingjiaoinfosList){
            this.jiaoInfo_list = [];
            for(let i = 0, len = msg.pengtingjiaoinfosList.length; i < len; ++i){
                let pengjiao_info = msg.pengtingjiaoinfosList[i].paiinfosList;
                var out_id = msg.pengtingjiaoinfosList[i].outcard.id;
                var jiaoPai_list = [];
                pengjiao_info.forEach(function (jiaoInfo) {
                    jiaoPai_list.push(new JiaoPai(jiaoInfo.hucard.id,jiaoInfo.fan,jiaoInfo.count,jiaoInfo.anganghu));
                },this);
                this.jiaoInfo_list.push(new JiaoInfo(out_id,jiaoPai_list,pengjiao_info.angang));
            }
        }

        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 操作菜单:"+"吃听牌");
    },
    setCanGangTing: function(msg) {

    },

    /**
     * 听牌
     */
    ting: function (isXS) {
        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 听牌");
        this.isBaoTing = true;
        this.isXiaosa = isXS;
        this.isTempBaoTing = false;
        this.isTempGang = false;
        this.isTempXiaosa = false;
        this.isTempChiTing = false;
        this.isTempPengTing = false;
        this.isTempGangTing = false;
        this.state = PlayerState.TINGPAI;

        PlayerED.notifyEvent(isXS?PlayerEvent.XIAOSA:PlayerEvent.TING,[this]);
    },

    /**
     * 暗杠
     */
    angang: function (gangcardList, play_audio) {
        if(!gangcardList || gangcardList.length==0){
            var gangIds = [-1,-1,-1,-1]; //不知道的暗杠设为-1
            this.delShouPai(gangIds, 4);
        }else{
            var gangIds = [];
            gangcardList.forEach(function (card) {
                if(card){
                    gangIds.push(card.id);
                }else{
                    cc.error("【数据】"+"暗杠牌列表项为空");
                }
            });

            if(gangIds.length != 4){
                cc.error("【数据】"+"暗牌数目 != 4");
                return;
            }
            this.delShouPai(gangIds, 4);
            cc.log("【数据】"+"玩家:"+this.userId, '暗杠列表',pai3d_value.descs(gangIds));
        }

        var baipai_data = new BaipaiData();
        baipai_data.type = BaipaiType.ANGANG;
        baipai_data.down_pai_num = 3;
        baipai_data.cardIds = gangIds;
        this.baipai_data_list.push(baipai_data);
        this.resetBaiPaiIndex();

        var cardType = gang_pai_List.getCardType(gangIds[0]);
        switch (cardType){
            case gang_pai_List.CardType.ZHONG://喜牌
            case gang_pai_List.CardType.FA:
            case gang_pai_List.CardType.BAI:
                PlayerED.notifyEvent(PlayerEvent.CHGANG, [this, baipai_data, play_audio]);
                break;
            default:
                PlayerED.notifyEvent(PlayerEvent.ANGANG, [this, baipai_data, play_audio]);
                break;
        }
    },

    gang: function (msg, play_audio) {
        switch (msg.gangtype) {
            case 1:
            case 8: //大蛋明杠
            case 10: //2饼明杠
            case 12: //8万明杠
            case 14://幺鸡明杠
            case 16://普通明杠 大杠
                this.diangang(msg.gangcardList, play_audio);    //点杠
                break;
            case 2:
                this.bagang(msg.gangcardList, play_audio);    //巴杠
                break;
            case 3:
            case 7: //大蛋暗杠
            case 11://2饼暗杠
            case 13: //8万暗杠
            case 15: //幺鸡暗杠
            case 17://普通暗杠 大杠
                this.angang(msg.gangcardList, play_audio);    //暗杠
                break;
            case 4:
                this.zfbgang(msg.gangcardList, play_audio); // 喜杠
                break;
            case 5:
                this.fengGang(msg.gangcardList, play_audio);
                break;
            case 6: //九杠
                this._19gang9(msg.gangcardList, play_audio);
                break;
            case 9: //一杠
                this._19gang1(msg.gangcardList, play_audio);
                break;
            default:

                break;
        }
    },

    /**
     * 吃听牌
     */
    chiTingPai:function (chicardList) {
        if(!chicardList){
            cc.error("【数据】"+"吃牌列表为空");
            return;
        }

        var chiIds = [];
        chicardList.forEach(function (card) {
            if(card){
                chiIds.push(card.id);
            }else{
                cc.error("【数据】"+"吃牌列表项为空");
            }
        });
        this.delShouPai(chiIds,2);
        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 吃牌:"+pai3d_value.descs(chiIds));

        var baipai_data = new BaipaiData();
        baipai_data.index = this.baipai_data_list.length;
        var mj_index = 0;
        this.baipai_data_list.forEach(function(baipai){
            mj_index += baipai.down_pai_num;
        });
        baipai_data.mj_index = mj_index;
        baipai_data.type = BaipaiType.CHI;
        baipai_data.down_pai_num = 3;
        baipai_data.cardIds = chiIds;
        this.baipai_data_list.push(baipai_data);

        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 摆牌:");
        this.baipai_data_list.forEach(function(item){
            cc.log(item.toString());
        });

        this.resetBaiPaiIndex();
    },
    chiting: function (isXS) {
        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 吃听牌");
        this.isBaoTing = true;
        this.isXiaosa = isXS;
        this.isTempBaoTing = false;
        this.isTempGang = false;
        this.isTempXiaosa = false;
        this.isTempChiTing = false;
        this.isTempPengTing = false;
        this.isTempGangTing = false;
        this.state = PlayerState.TINGPAI;

        PlayerED.notifyEvent(PlayerEvent.CHITING,[this,isXS]);
    },

    /**
     * 碰听牌
     */
    pengTingPai: function (pengcardList) {
        if(!pengcardList){
            cc.error("【数据】"+"碰牌列表为空");
            return;
        }

        var pengIds = [];
        pengcardList.forEach(function (card) {
            if(card){
                pengIds.push(card.id);
            }else{
                cc.error("【数据】"+"碰牌列表项为空");
            }
        });
        this.delShouPai(pengIds,2);
        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 碰牌:"+pai3d_value.descs(pengIds));

        var baipai_data = new BaipaiData();
        baipai_data.index = this.baipai_data_list.length;
        var mj_index = 0;
        this.baipai_data_list.forEach(function(baipai){
            mj_index += baipai.down_pai_num;
        });
        baipai_data.mj_index = mj_index;
        baipai_data.type = BaipaiType.PENG;
        baipai_data.down_pai_num = 3;
        baipai_data.cardIds = pengIds;
        this.baipai_data_list.push(baipai_data);

        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 摆牌:");
        this.baipai_data_list.forEach(function(item){
            cc.log(item.toString());
        });

        this.resetBaiPaiIndex();
        //PlayerED.notifyEvent(PlayerEvent.PENG,[this,baipai_data]);

    },
    pengting: function (isXS) {
        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 碰听牌");
        this.isBaoTing = true;
        this.isXiaosa = isXS;
        this.isTempBaoTing = false;
        this.isTempGang = false;
        this.isTempXiaosa = false;
        this.isTempChiTing = false;
        this.isTempPengTing = false;
        this.isTempGangTing = false;
        this.state = PlayerState.TINGPAI;

        PlayerED.notifyEvent(PlayerEvent.PENGTING,[this,isXS]);
    },

    /**
     * 杠听牌
     */
    gangting: function (isXS) {
        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 杠听牌");
        this.isBaoTing = true;
        this.isXiaosa = isXS;
        this.isTempBaoTing = false;
        this.isTempGang = false;
        this.isTempXiaosa = false;
        this.isTempChiTing = false;
        this.isTempPengTing = false;
        this.isTempGangTing = false;
        this.state = PlayerState.TINGPAI;

        PlayerED.notifyEvent(PlayerEvent.GANGTING,[this,isXS]);
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
    PlayerData:fx_PlayerData,
    PlayerState:jlmj_player_data.PlayerState,
};