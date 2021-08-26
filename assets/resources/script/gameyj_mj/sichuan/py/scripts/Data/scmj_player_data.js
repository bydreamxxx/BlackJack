var BaipaiType = require("jlmj_baipai_data").BaipaiType;
var BaipaiData = require("jlmj_baipai_data").BaipaiData;

var gang_pai_List = require('jlmj_gang_pai_type');

var jlmj_player_data = require('jlmj_player_data');

var PlayerED = jlmj_player_data.PlayerED;
var PlayerEvent = jlmj_player_data.PlayerEvent;
var pai3d_value = require("jlmj_pai3d_value");
var PlayerState = jlmj_player_data.PlayerState;

var RoomMgr = require('jlmj_room_mgr').RoomMgr;

// const DeskData = require('scmj_desk_data').DeskData;


var sc_PlayerData = cc.Class({
    extends: jlmj_player_data.PlayerData,

    properties: {

    },
    /**
     * 初始化游戏数据
     */
    initGameData: function () {
        this._super();
        this.isXiaosa = false;//潇洒
        this.huList = [];
        this.huorder = 0;
    },
    /**
     * 设置玩家游戏数据
     */
    setGameData: function (playerMsg) {
        this.isMoveHuanPai = false;

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
        this.dingQue = playerMsg.dingquetype;
        this.huList = playerMsg.playercard.hucardList || [];
        this.huorder = playerMsg.huorder;
        this.huTypeList = playerMsg.playercard.hucardtypeList.length > 0 ? playerMsg.playercard.hucardtypeList[playerMsg.playercard.hucardtypeList.length - 1].hucardtypeList : [];

        if(this.isBaoTing){
            this.state = PlayerState.TINGPAI;
        }else if(this.huList.length > 0){
            this.state = PlayerState.DAPAI;
            if(!RoomMgr.Instance()._Rule.isxueliu){
                this.state = PlayerState.SC_HUPAI;

                // if(this.huTypeList.indexOf(3) != -1){//排除自摸的牌
                //     playerMsg.playercard.handcardcount--;
                // }

            }else{
                this.state = PlayerState.TINGPAI;
                if(this.userId == cc.dd.user.id){
                    this.isBaoTing = true;
                }
            }
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

            this.dingQueList = [];
            for(let i = 0; i < this.shoupai.length; i++){
                if(this.getPaiType(this.shoupai[i]) == this.dingQue && this.dingQueList.indexOf(this.shoupai[i]) == -1){
                    this.dingQueList.push(this.shoupai[i]);
                }
            }
        }
    },

    initPai(playerMsg){
        this.baipai_data_list = [];    //摆牌

        this.initBaiPaiData( playerMsg.playercard.composecardList );
        cc.log("座位号:",this.idx," 手牌数:",this.shoupai.length," 定缺:",playerMsg.dingquetype);
        this.kaipai_an_gang_list = [];
    },

    /**
     * 玩家 设置 吃碰杠听胡
     * @param msg
     */
    setCpgth: function (msg, isGangTing) {
        this.canchi = false;
        this.canpeng = msg.canpeng;
        this.cangang = msg.cangang;
        this.canbugang = msg.canbugang;
        this.canhu = msg.canhu;
        this.canting = false;
        this.isGangTing = false;
        this.cangangmopai = msg.cangangmopai;
        this.canxiaosa = false;
        this.canchiting = false;
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
        // this.setCanChiTing(msg);
        // this.setCanPengTing(msg);
        // this.setCanGangTing(msg);


        //桌子上无牌时,只能杠3张牌,其他杠不能杠 (服务器未过滤,客户端此处过滤杠)
        if(this.cangang || this.canbugang){
            var DeskData = require('scmj_desk_data').DeskData;
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
            var player_down_ui = cc.find("Canvas/desk_node/jlmj_player_down_ui").getComponent('scmj_player_down_ui');
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

        var playerMgr = require('scmj_player_mgr');
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
                pengjiao_info.forEach(function (jiaoInfo) {
                    var out_id = jiaoInfo.outcard.id;
                    var jiaoPai_list = [];
                    jiaoInfo.paiinfosList.forEach(function (jiaoPai) {
                        jiaoPai_list.push(new JiaoPai(jiaoPai.hucard.id,jiaoPai.fan,jiaoPai.count,jiaoPai.anganghu));
                    });
                    this.jiaoInfo_list.push(new JiaoInfo(out_id,jiaoPai_list,jiaoInfo.angang));
                },this);
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

    ///////////////////////////////////////////////////////////////////////
    /////////////////////////////////新功能/////////////////////////////////
    ///////////////////////////////////////////////////////////////////////
    /**
     * 设置推荐换三张的牌
     * @param value
     */
    setDefaultHuan3Zhang(value){
        this.huan3Zhang_default_option = value;
    },
    /**
     * 设置玩家换三张的牌
     * @param value
     */
    setHuan3Zhang(value){
        this.huan3Zhang_option = value;
    },
    /**
     * 检查换三张条件
     * @returns {boolean}
     */
    checkHuan3Zhang(){
        let huanpaiConut = RoomMgr.Instance()._Rule.huan4zhang ? 4 : 3;

        if(this.huan3Zhang_option && cc.dd._.isArray(this.huan3Zhang_option) && this.huan3Zhang_option.length == huanpaiConut){
            let _result = true;
            let _type = this.huan3Zhang_option[0].type;
            this.huan3Zhang_option.forEach((pai)=>{
                if(pai.type != _type){
                    _result = false;
                }
            })
            return _result;
        }else{
            return false;
        }
    },
    /**
     * 获取牌型
     * @param id
     * @returns {number}
     */
    getPaiType(id){
        if(id <= 35){
            return 3;
        }else if(id <= 71){
            return 2;
        }else {
            return 1;
        }
    },
    /**
     * 响应换三张
     * @param choosePais
     * @param huanPais
     */
    huanPai(choosePais, huanPais){
        this.isMoveHuanPai = false;
        this.setTips(false);
        this.huan3Zhang_default_option = null;
        this.huan3Zhang_option = null;
        // for(let i = 0; i < choosePais.length && i < huanPais.length; i++){
        //     let idx = this.shoupai.indexOf(choosePais[i].id);
        //     if(!cc.dd._.isNull(this.shoupai[idx])){
        //         this.shoupai[idx] = huanPais[i].id;
        //     }
        // }
        for(let i = 0; i < huanPais.length; i++){
            this.shoupai.push(huanPais[i].id);
        }
        this.paixu();
        cc.log("【数据】" + "玩家:" + this.userId + " 座位号:" + this.idx + " 换牌后" + pai3d_value.descs(this.shoupai));
        PlayerED.notifyEvent(PlayerEvent.HUAN3ZHANG,[this, choosePais, huanPais]);
    },
    /**
     * 响应换三张出牌
     */
    moveHuanPai(choosepaisList){
        let huanpai = this.checkHuan3Zhang() ? this.huan3Zhang_option : this.huan3Zhang_default_option;
        let huanpaiConut = RoomMgr.Instance()._Rule.huan4zhang ? 4 : 3;

        if(cc.dd._.isArray(choosepaisList)){
            if(this.userId == cc.dd.user.id){

                let same = 0;

                if(cc.dd._.isArray(huanpai)){
                    for(let i = 0; i < choosepaisList.length; i++){
                        for(let j = 0; j < huanpai.length; j++){
                            if(choosepaisList[i].id == huanpai[j].id){
                                same++;
                                break;
                            }
                        }
                    }
                }

                if(same != huanpaiConut){
                    if(this.isMoveHuanPai != true){
                        huanpai = choosepaisList;
                    }else{
                        for(let i = 0; i < huanpai.length; i++){
                            if(this.shoupai.indexOf(huanpai[i].id) == -1){
                                this.shoupai.push(huanpai[i].id);
                            }
                        }

                        for(let i = 0; i < choosepaisList.length; i++){
                            let idx = this.shoupai.indexOf(choosepaisList[i].id)
                            if(idx != -1){
                                this.shoupai.splice(idx, 1);
                            }
                        }
                    }
                    this.huan3Zhang_option = choosepaisList;
                }
            }
        }
        if(this.isMoveHuanPai != true){
            this.isMoveHuanPai = true;

            if(this.userId == cc.dd.user.id){
                cc.log("【数据】" + "玩家:" + this.userId + " 换牌前手牌:" + pai3d_value.descs(this.shoupai));

                for(let i = 0; i < huanpai.length; i++){
                    cc.log("【数据】" + "玩家:" + this.userId + " 换牌id:" + huanpai[i].id);

                    let idx = this.shoupai.indexOf(huanpai[i].id)
                    if(idx != -1){
                        this.shoupai.splice(idx, 1);
                    }
                }
                cc.log("【数据】" + "玩家:" + this.userId + " 换牌手牌:" + pai3d_value.descs(this.shoupai));
            }else{
                this.shoupai.splice(0, huanpaiConut);
            }


            PlayerED.notifyEvent(PlayerEvent.MOVE3ZHANG, [this, huanpai]);
        }
    },
    /**
     * 回放的时候快速换三张
     * @param choosepaisList
     * @param huanpaisList
     */
    quickHuan3Zhang(choosepaisList, huanpaisList){
        for(let i = 0; i < choosepaisList.length; i++){
            let idx = this.shoupai.indexOf(choosepaisList[i].id)
            if(idx != -1){
                this.shoupai.splice(idx, 1);
            }
        }
        let temp = [];
        for(let i = 0; i < huanpaisList.length; i++){
            temp.push(huanpaisList[i].id);
        }
        this.addShouPai(temp);
        PlayerED.notifyEvent(PlayerEvent.QUICKHUAN3ZHANG, [this, choosepaisList, huanpaisList]);
    },
    /**
     * 设置定缺类型
     * @param type
     */
    setDingQue(type){
        this.isMoveHuanPai = false;
        this.dingQue = type;
        this.dingQueList = [];
        for(let i = 0; i < this.shoupai.length; i++){
            if(this.getPaiType(this.shoupai[i]) == this.dingQue && this.dingQueList.indexOf(this.shoupai[i]) == -1){
                this.dingQueList.push(this.shoupai[i]);
            }
        }
        this.setTips(false);
        PlayerED.notifyEvent(PlayerEvent.DING_QUE, [this, type]);
    },
    /**
     * 设置提示
     * @param value
     */
    setTips(value){
        cc.log("【数据】玩家:" + this.userId + " 座位号:" + this.idx + " 提示: "+value);
        PlayerED.notifyEvent(PlayerEvent.PLAYER_TIPS, [this, value]);
    },

    /**
     * 胡
     */
    hu: function(huCardId, huTypeList, isZiMo, huorder) {
        // if(huTypeList == null){
        //     cc.error("【数据】"+"胡牌类型为空");
        //     return;
        // }
        if(!RoomMgr.Instance()._Rule.isxueliu){
            this.state = PlayerState.SC_HUPAI;
        }else{
            this.state = PlayerState.TINGPAI;
            if(this.userId == cc.dd.user.id){
                this.isBaoTing = true;
            }
        }
        this.huCardId = huCardId;
        this.huTypeList = huTypeList;
        this.isZiMo = isZiMo;
        this.huorder = huorder;
        PlayerED.notifyEvent(PlayerEvent.HU,[this]);
    },

    /**
     * 更新金币
     * @param coin
     */
    changeCoin(coin){
        let oldCoin = this.coin;
        this.coin = oldCoin+coin;
        var DeskData = require('scmj_desk_data').DeskData;
        if(!DeskData.Instance().isFriend()){
            if(this.coin <= 0){
                coin = -oldCoin;
                this.coin = 0;
                this.state = PlayerState.PO_CHAN;
            }
        }

        PlayerED.notifyEvent(PlayerEvent.CHANGE_COIN,[this, coin]);
    },

    /**
     * 设置金币
     */
    setCoin:function (coin) {
        this.coin = coin;
        var DeskData = require('scmj_desk_data').DeskData;
        if(!DeskData.Instance().isFriend()){
            if(this.coin <= 0){
                this.state = PlayerState.PO_CHAN;
            }
        }
        PlayerED.notifyEvent(PlayerEvent.SET_COIN,[this]);
    },

    clear(){
        this.huList = [];
        this.dingQue = 0;
        this.dingQueList = [];
        this.isMoveHuanPai = false;
        this.setTips(false);
        this.huan3Zhang_default_option = null;
        this.huan3Zhang_option = null;
        this.huorder = 0;

        this._super();
    },

    clearPai(){
        this.huList = [];
        this.dingQue = 0;
        this.dingQueList = [];
        this.isMoveHuanPai = false;
        this.setTips(false);
        this.huan3Zhang_default_option = null;
        this.huan3Zhang_option = null;
        this.huorder = 0;

        this._super();
    },

    checkHuaZhu(huazhu){
        // let winIndex = huazhu.winuseridList.indexOf(this.userId);
        // let loseIndex = huazhu.huazhuuseridList.indexOf(this.userId);
        // if(winIndex == -1 && loseIndex == -1){
        //     cc.error("花猪数据有误 ",this.userId);
        //     return;
        // }
        //
        // let index = winIndex == -1 ? loseIndex : winIndex;
        // if(index >= huazhu.huazhufenList.length){
        //     cc.error("花猪分有误 ",this.userId);
        //     return;
        // }
        //
        // let coin = huazhu.huazhufenList[index];
        // if(winIndex == -1){
        //     coin = -coin;
        // }

        cc.log("【数据】花猪 ", this.userId, " 得分 ", huazhu.huazhufen);
        PlayerED.notifyEvent(PlayerEvent.HUAZHU,[this, huazhu.ishuazhu]);
        // setTimeout(()=>{
        //     let changeCoin = huazhu.huazhufen;
        //     this.changeCoin(changeCoin);
        // }, 1000);
    },

    checkJiao(jiaoList){
        // let isWin = false;
        // let jaofen = 0;
        //
        // for(let i = 0; i < jiaoList.length; i++){
        //     if(jiaoList[i].winuserid == this.userId){
        //         isWin = true;
        //
        //         for(let j = 0; j < jiaoList[i].chajiaofenList.length; j++){
        //             jaofen += jiaoList[i].chajiaofenList[j];
        //         }
        //     }else{
        //         let index = jiaoList[i].chajiaouseridList.indexOf(this.userId);
        //         if(index >= jiaoList[i].chajiaouseridList.length){
        //             cc.error("查叫分有误 ",this.userId);
        //             return;
        //         }
        //         jaofen += jiaoList[i].chajiaofenList[index];
        //     }
        // }
        //
        // if(!isWin){
        //     jaofen = -jaofen;
        // }

        cc.log("【数据】查叫 ", this.userId, " 得分 ", jiaoList.chajiaofen);
        PlayerED.notifyEvent(PlayerEvent.WUJIAO,[this, jiaoList.iswujiao]);
        // setTimeout(()=>{
        //     let changeCoin = jiaoList.chajiaofen;
        //     this.changeCoin(changeCoin);
        // }, 1000);
    },

    /**
     * 碰
     */
    peng: function (pengcardList, viewIdx) {
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
        baipai_data.viewIdx = viewIdx;
        this.baipai_data_list.push(baipai_data);

        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 摆牌:");
        this.baipai_data_list.forEach(function(item){
            cc.log(item.toString());
        });

        this.resetBaiPaiIndex();
        PlayerED.notifyEvent(PlayerEvent.PENG,[this,baipai_data]);

    },

    /**
     * 杠
     */
    gang: function (msg, play_audio, viewIdx) {
        switch (msg.gangtype) {
            case 1:
            case 8: //大蛋明杠
            case 10: //2饼明杠
            case 12: //8万明杠
            case 14://幺鸡明杠
            case 16://普通明杠 大杠
                this.diangang(msg.gangcardList, play_audio, viewIdx);    //点杠
                break;
            case 2:
                this.bagang(msg.gangcardList, true);    //巴杠
                break;
            case 3:
            case 7: //大蛋暗杠
            case 11://2饼暗杠
            case 13: //8万暗杠
            case 15: //幺鸡暗杠
            case 17://普通暗杠 大杠
                this.angang(msg.gangcardList, true);    //暗杠
                break;
            case 4:
                this.zfbgang(msg.gangcardList, true); // 喜杠
                break;
            case 5:
                this.fengGang(msg.gangcardList, true);
                break;
            case 6: //九杠
                this._19gang9(msg.gangcardList, true);
                break;
            case 9: //一杠
                this._19gang1(msg.gangcardList, true);
                break;
            default:

                break;
        }
    },

    /**
     * 点杠
     */
    diangang: function (gangcardList, play_audio, viewIdx) {
        if(!gangcardList){
            cc.error("【数据】"+"点杠牌列表为空");
            return;
        }

        var gangIds = [];
        gangcardList.forEach(function (card) {
            if(card){
                gangIds.push(card.id);
            }else{
                cc.error("【数据】"+"点杠牌列表项为空");
            }
        });

        if(gangIds.length != 4){
            cc.error("【数据】"+"点杠牌数目 != 4");
            return;
        }
        this.delShouPai(gangIds, 3);
        cc.log("【数据】"+"玩家:"+this.userId, '点杠列表',pai3d_value.descs(gangIds));
        var baipai_data = new BaipaiData();
        baipai_data.type = BaipaiType.DIANGANG;
        baipai_data.down_pai_num = 3;
        baipai_data.cardIds = gangIds;
        baipai_data.viewIdx = viewIdx;
        this.baipai_data_list.push(baipai_data);
        this.resetBaiPaiIndex();
        PlayerED.notifyEvent(PlayerEvent.DIANGANG, [this, baipai_data, play_audio]);

    },

    /**
     * 初始化摆牌数据
     */
    initBaiPaiData: function( baipaiDataList ) {
        if( !baipaiDataList ) {
            return;
        }
        this.baipai_data_list = [];

        var index = 0;
        var mj_index = 0;
        for( var i = 0; i < baipaiDataList.length; ++i ) {
            var baipai_object = null;
            var baipai_data = baipaiDataList[i];
            if( baipai_data.type == 0 ) {
                continue;
            }
            if( this.getIsCCG( baipai_data.type ) ) {
                baipai_object = new JLGData();
                var isqc = baipai_data.cardsList.length>3;
                for(var k=0; k<baipai_data.cardsList.length; ++k){
                    this.convertData(baipai_object.idAndCnts, baipai_data.cardsList[k], isqc);
                }
                if(baipai_object.idAndCnts.length<3)
                {
                    var idAndCnt = {};
                    idAndCnt.cnt = 1;
                    var xiaoji = baipai_object.findXJTwoCnt();
                    xiaoji.cnt--;
                    idAndCnt.id = xiaoji.id;
                    baipai_object.idAndCnts.push(idAndCnt);
                    baipai_object.sortArr();
                }
                baipai_object.down_pai_num = baipai_object.getShowPaiList().length;
            } else {
                baipai_object = new BaipaiData();
                baipai_object.down_pai_num = 3; //吃 碰 明杠 暗杠 下层牌数=3

                var playerMgr = require('scmj_player_mgr');
                var playerOut = playerMgr.Instance().getPlayer(baipai_data.useridout);
                let viewIdx = playerOut.viewIdx;
                baipai_object.viewIdx = viewIdx;
            }
            this.copyObj(baipai_object.cardIds, baipai_data.cardsList );
            baipai_object.index += index;
            baipai_object.mj_index += mj_index;
            baipai_object.type = this.transBaiPaiType( baipai_data.type );
            ++index;
            mj_index += baipai_object.down_pai_num;

            this.baipai_data_list.push( baipai_object );
        }
    },

    /**
     * 排序手牌
     */
    paixu:function () {
        var getType = function (id) {
            if(id>=72&&id<=107){
                return 3;   //万
            }else if(id>=36&&id<=71){
                return 2;   //条
            }else if(id>=0&&id<=35){
                return 1;   //饼
            }
        };

        let dingqueType = 4 - this.dingQue;

        if(this.hasMoPai()){//有摸牌
            var arr = this.shoupai.splice(0, this.shoupai.length-1);
            arr.sort(function (a, b) {
                var type_a = getType(a);
                var type_b = getType(b);
                if(type_a == dingqueType && type_b != dingqueType){
                    return 1;
                }else if(type_a != dingqueType && type_b == dingqueType ){
                    return -1;
                }else{
                    if(type_a == type_b){
                        return a-b;
                    }else{
                        return type_b - type_a;
                    }
                }
            }.bind(this));
            this.shoupai = arr.concat(this.shoupai);
        }else {
            this.shoupai.sort(function (a, b) {
                var type_a = getType(a);
                var type_b = getType(b);
                if(type_a == dingqueType && type_b != dingqueType){
                    return 1;
                }else if(type_a != dingqueType && type_b == dingqueType ){
                    return -1;
                }else{
                    if(type_a == type_b){
                        return a-b;
                    }else{
                        return type_b - type_a;
                    }
                }
            }.bind(this))
        }
    },
});


module.exports = {
    PlayerEvent:jlmj_player_data.PlayerEvent,
    PlayerED:jlmj_player_data.PlayerED,
    PlayerData:sc_PlayerData,
    PlayerState:jlmj_player_data.PlayerState,
};