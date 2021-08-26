var base_mj_player_data = require('base_mj_player_data');
var pai3d_value = require("jlmj_pai3d_value");
var BaipaiType = require("jlmj_baipai_data").BaipaiType;
var BaipaiData = require("jlmj_baipai_data").BaipaiData;
var mjComponentValue = null;
const paiType = require('jlmj_gang_pai_type').CardType;
var BAIPAI_TYPE = require("Define").ComposeCardType;
var JLGData = require("jlmj_baipai_data").JLGData;
var JiaoInfo = require('jlmj_jiaopai').JiaoInfo;
var JiaoPai = require('jlmj_jiaopai').JiaoPai;

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
        this.isGangTing = isGangTing || false;

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
        // if(this._isUserPlayer) {
        //     this.setDapaiTing(msg);
        // }

        // 菜单显示 延迟到摸牌后
        // PlayerED.notifyEvent(PlayerEvent.CAOZUO,[this, isGangTing]);
    },

    /**
     * 设置听
     * @param msg
     */
    setCanTing: function(msg) {
        if(this._isUserPlayer){
            if(!msg.jiaoinfosList || msg.jiaoinfosList.length == 0){
                return ;
            }
            if(msg.canting){
                cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 操作菜单:"+"听牌");
            }
            this.curjiaoPaiInfo_list = null;
        }else{
            if(!msg.canting || !msg.jiaoinfosList){
                return ;
            }
            cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 操作菜单:"+"听牌");
        }

        this.jiaoInfo_list = [];
        msg.jiaoinfosList.forEach(function (jiaoInfo) {
            if(!jiaoInfo.outcard){
                jiaoInfo.outcard = {id: -1};
            }
            var out_id = jiaoInfo.outcard.id;
            var jiaoPai_list = [];
            jiaoInfo.paiinfosList.forEach(function (jiaoPai) {
                jiaoPai_list.push(new JiaoPai(jiaoPai.hucard.id,jiaoPai.fan,jiaoPai.count,jiaoPai.anganghu, false, false, jiaoPai.hutypesList));
            });
            // if(out_id == -1){
            //     this.jiaoInfo_list.push(new JiaoInfo(out_id,jiaoPai_list,jiaoInfo.angang));
            //     this.jiaoInfo_list.push(new JiaoInfo(out_id,jiaoPai_list,jiaoInfo.angang));
            //     this.jiaoInfo_list.push(new JiaoInfo(out_id,jiaoPai_list,jiaoInfo.angang));
            // }
            let _jiaoInfo = new JiaoInfo(out_id,jiaoPai_list,jiaoInfo.angang);
            _jiaoInfo.tingGangCardsList = jiaoInfo.tinggangcardsList;
            this.jiaoInfo_list.push(_jiaoInfo);
        },this);
        // 菜单显示 延迟到摸牌后
        // PlayerED.notifyEvent(PlayerEvent.CAOZUO,[this]);
    },

    /**
     * 设置是否能自动出牌   现在是服务器实现的
     */
    setAutoChuPai:function (msg) {
        // if(this.getIsTing() && this.hasMoPai()){
        //     if(!this.canhu && !this.cangang){
        //         this.require_PlayerED.notifyEvent(this.require_PlayerEvent.AUTO_CHU_PAI,[this, this.getMoPai()]);
        //     }
        // }
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
        this.require_PlayerED.notifyEvent(this.require_PlayerEvent.PENG,[this,baipai_data]);

    },

    /**
     * 杠
     */
    gang: function (msg, viewIdx) {
        if(msg.gangtype == 3){
            msg.gangtype = this.checkSpecialGang(msg.gangcardList, true);
        }

        switch (msg.gangtype) {
            case 1:
            case 8: //大蛋明杠
            case 10: //2饼明杠
            case 12: //8万明杠
            case 14://幺鸡明杠
            case 16://普通明杠 大杠
                this.diangang(msg.gangcardList, true, viewIdx);    //点杠
                return;
            case 20:
                this.bagang(msg.gangcardList, true, viewIdx);    //巴杠
                break;
        }

        this._super(msg, viewIdx);
    },

    /**
     * 点杠
     */
    diangang: function (gangcardList, play_audio, viewIdx) {
        if(!gangcardList){
            cc.error("【数据】"+"点杠牌列表为空");
            return;
        }
        let shoupaiGangCount = 0;
        var gangIds = [];
        gangcardList.forEach(function (card) {
            if(card){
                gangIds.push(card.id);
                if(this.getBaipaiDataByid(card.id)){
                    shoupaiGangCount++;
                }
            }else{
                cc.error("【数据】"+"点杠牌列表项为空");
            }
        }.bind(this));

        if(gangIds.length != 4){
            cc.error("【数据】"+"点杠牌数目 != 4");
            return;
        }

        if(shoupaiGangCount >= 3){
            cc.error("【数据】"+"点杠手牌数目不对"+shoupaiGangCount);
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
        this.require_PlayerED.notifyEvent(this.require_PlayerEvent.DIANGANG, [this, baipai_data, play_audio]);

    },

    /**
     * 巴杠
     */
    bagang: function (gangcardList, play_audio, viewIdx) {
        if(!gangcardList){
            cc.error("【数据】"+"巴杠牌列表为空");
            return;
        }

        var gangIds = [];
        gangcardList.forEach(function (card) {
            if(card){
                gangIds.push(card.id);
            }else{
                cc.error("【数据】"+"巴杠牌列表项为空");
            }
        });
        //服务器默认 巴杠的牌放在最后一个 即:gangIds[3]
        var baipai_data = this.getPengData(BaipaiType.PENG, gangIds[0]);
        if(!baipai_data){
            cc.error("【数据】"+"玩家摆牌数据，没有该碰牌"+pai3d_value.descs(gangIds));
            return;
        }
        var ids = cc.dd._.without(gangIds,baipai_data.cardIds[0],baipai_data.cardIds[1],baipai_data.cardIds[2]);
        if(ids.length != 1){
            cc.error("【数据】"+"玩家手牌摸牌中无巴杠牌");
            return;
        }
        var bagang_id = ids[0];
        let shoupaiGangCount = 0;
        if(this.getBaipaiDataByid(bagang_id)){
            shoupaiGangCount++;
        }
        if(shoupaiGangCount >= 1){
            cc.error("【数据】"+"巴杠手牌数目不对"+shoupaiGangCount);
            return;
        }
        this.delShouPai([bagang_id], 1);
        cc.log("【数据】"+"玩家:"+this.userId, '巴杠列表',pai3d_value.descs(gangIds));
        baipai_data.cardIds.push(bagang_id);
        baipai_data.down_pai_num = 3;
        baipai_data.type = BaipaiType.BAGANG;
        if(cc.dd._.isNumber(viewIdx)){
            baipai_data.viewIdx = viewIdx;
        }
        this.resetBaiPaiIndex();
        this.require_PlayerED.notifyEvent(this.require_PlayerEvent.BAGANG, [this, baipai_data, play_audio]);
    },

    /**
     * 旋风杠
     */
    fengGang:function (gangcardList, play_audio) {
        if(!gangcardList || gangcardList.length==0){
            var gangIds = [-1,-1,-1,-1]; //不知道的暗杠设为-1
            this.delShouPai(gangIds, 4);
        }else{
            let shoupaiGangCount = 0;
            var gangIds = [];
            gangcardList.forEach(function (card) {
                if(card){
                    gangIds.push(card.id);
                    if(this.getBaipaiDataByid(card.id)){
                        shoupaiGangCount++;
                    }
                }else{
                    cc.error("【数据】"+"旋风杠牌列表项为空");
                }
            }.bind(this));

            if(gangIds.length != 4){
                cc.error("【数据】"+"旋风杠数目 != 4");
                return;
            }
            if(shoupaiGangCount >= 4){
                cc.error("【数据】"+"旋风杠手牌数目不对"+shoupaiGangCount);
                return;
            }
            this.delShouPai(gangIds, 4);
            cc.log("【数据】"+"玩家:"+this.userId, '旋风杠列表',pai3d_value.descs(gangIds));
        }

        var baipai_data = new BaipaiData();
        baipai_data.type = BaipaiType._FG;
        baipai_data.down_pai_num = !gangcardList || gangcardList.length==0 ? 3 : 4;
        baipai_data.cardIds = gangIds;
        this.baipai_data_list.push(baipai_data);

        this.resetBaiPaiIndex();
        this.require_PlayerED.notifyEvent(this.require_PlayerEvent.FGANG, [this, baipai_data, play_audio]);
    },

    /**
     * 三剑客杠
     */
    zfbgang: function (gangcardList, play_audio) {
        if(!gangcardList || gangcardList.length==0){
            var gangIds = [-1,-1,-1,-1]; //不知道的暗杠设为-1
            this.delShouPai(gangIds, 4);
        }else{
            let shoupaiGangCount = 0;
            var gangIds = [];
            gangcardList.forEach(function (card) {
                if(card){
                    gangIds.push(card.id);
                    if(this.getBaipaiDataByid(card.id)){
                        shoupaiGangCount++;
                    }
                }else{
                    cc.error("【数据】"+"三剑客杠牌列表项为空");
                }
            }.bind(this));

            if(gangIds.length != 4){
                cc.error("【数据】"+"三剑客杠数目 != 4");
                return;
            }
            if(shoupaiGangCount >= 4){
                cc.error("【数据】"+"三剑客杠手牌数目不对"+shoupaiGangCount);
                return;
            }
            this.delShouPai(gangIds, 4);
            cc.log("【数据】"+"玩家:"+this.userId, '三剑客杠列表',pai3d_value.descs(gangIds));
        }

        var baipai_data = new BaipaiData();
        baipai_data.type = BaipaiType.ZFBG;
        baipai_data.down_pai_num = 3;
        baipai_data.cardIds = gangIds;
        this.baipai_data_list.push(baipai_data);

        this.resetBaiPaiIndex();
        this.require_PlayerED.notifyEvent(this.require_PlayerEvent.ZFBGANG, [this, baipai_data, play_audio]);
    },

    /**
     * 毛毛蛋杠
     */
    _19gang1: function (gangcardList, play_audio) {
        if(!gangcardList || gangcardList.length==0){
            var gangIds = [-1,-1,-1,-1]; //不知道的暗杠设为-1
            this.delShouPai(gangIds, 4);
        }else{
            let shoupaiGangCount = 0;
            var gangIds = [];
            gangcardList.forEach(function (card) {
                if(card){
                    gangIds.push(card.id);
                    if(this.getBaipaiDataByid(card.id)){
                        shoupaiGangCount++;
                    }
                }else{
                    cc.error("【数据】"+"毛毛蛋杠牌列表项为空");
                }
            }.bind(this));

            if(gangIds.length != 4){
                cc.error("【数据】"+"毛毛蛋杠数目 != 4");
                return;
            }
            if(shoupaiGangCount >= 4){
                cc.error("【数据】"+"毛毛蛋杠手牌数目不对"+shoupaiGangCount);
                return;
            }
            this.delShouPai(gangIds, 4);
            cc.log("【数据】"+"玩家:"+this.userId, '毛毛蛋杠列表',pai3d_value.descs(gangIds));
        }

        var baipai_data = new BaipaiData();
        baipai_data.type = BaipaiType._19G1;
        baipai_data.down_pai_num = 3;
        baipai_data.cardIds = gangIds;
        this.baipai_data_list.push(baipai_data);

        this.resetBaiPaiIndex();
        this.require_PlayerED.notifyEvent(this.require_PlayerEvent._19GANG1, [this, baipai_data, play_audio]);
    },

    /**
     * 转换杠牌数据 并且去重复
     * isquc 是否去重
     */
    convertData:function (arr, card, isquc) {
        var idAndCnt = {};
        idAndCnt.id = card.id;
        idAndCnt.cnt = 1;
        if(paiType.S1 == Math.floor(card.id/4)){
            arr.unshift(idAndCnt);
        }else{
            arr.push(idAndCnt);
        }
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
            var baipai_data = baipaiDataList[i];

            if(baipai_data.type == BAIPAI_TYPE.C_BUHUA){
                let list = [];

                baipai_data.cardsList.forEach((card)=>{
                    if(card){
                        list.push(card.id);
                    }
                })

                this.buhua_data = new BaipaiData();
                this.buhua_data.index = this.baipai_data_list.length;

                this.buhua_data.mj_index = 0;
                this.buhua_data.type = BaipaiType.BUHUA;
                this.buhua_data.cardIds = list;
                continue;
            }

            var baipai_object = null;
            if( baipai_data.type == 0 || baipai_data.type == 10) {
                continue;
            }

            if(baipai_data.type == BAIPAI_TYPE.C_ANGANG){
                baipai_data.type = this.checkSpecialGang(baipai_data.cardsList);
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

                let fenggang_an = baipai_data.type == BAIPAI_TYPE.C_FENG && (!baipai_data.cardsList || baipai_data.cardsList.length == 0);

                baipai_object.down_pai_num = baipai_data.type == BAIPAI_TYPE.C_YAO || baipai_data.type == BAIPAI_TYPE.C_XI || fenggang_an ? 3 : 4;//baipai_object.getShowPaiList().length;
            } else {
                baipai_object = new BaipaiData();
                baipai_object.down_pai_num = 3; //吃 碰 明杠 暗杠 下层牌数=3

                var playerMgr = require(mjComponentValue.playerMgr);
                var playerOut = playerMgr.Instance().getPlayer(baipai_data.useridout);
                if(playerOut){
                    baipai_object.viewIdx = playerOut.viewIdx;
                }
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
     * 打开暗杠
     */
    openAnGang: function (pailistList) {
        this.kaipai_an_gang_list = [];
        pailistList.forEach(function (item) {
            if(item&&item.cardinfo&&(item.cardinfo.type==4 || item.cardinfo.type==0)){ //暗杠牌
                if(item.cardinfo.cardindexList){
                    var value = item.cardinfo.cardindexList[0];

                    let paiType = Math.floor(value/4);
                    if(item.cardinfo.type==0 && (paiType == 30 || paiType == 31 || paiType == 32 || paiType == 33)){//旋风杠
                        this.kaipai_an_gang_list.push({value:item.cardinfo.cardindexList, show:true, isBaoPai:true});
                    }else if(item.cardinfo.type==4){
                        this.kaipai_an_gang_list.push({value:value, show:true, isBaoPai:false});
                    }
                }
            }
        }.bind(this));
        this.kaipai_an_gang_show_idx = 0;
    },

    /**
     * 排序手牌
     */
    paixu:function () {
        var getType = function (id) {
            if(id>=76&&id<=107){
                return 9;   //万
            }else if(id>=40&&id<=71){
                return 8;   //条
            }else if(id>=4&&id<=35){
                return 7;   //饼
            }else if(id>=120&&id<=135){
                return 6;   //东南西北
            }else if(id>=108&&id<=119){
                return 5;   //中发白
            }else if(id>=136&&id<=143){
                return 4;   //梅兰竹菊春夏秋冬
            }else if(id>=72&&id<=75){
                return 3;   //一万
            }else if(id>=36&&id<=39){
                return 2;   //一条
            }else if(id>=0&&id<=3){
                return 1;   //一饼
            }
        };

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
    },

    //暗杠转毛毛蛋杠、旋风杠、三剑客杠
    checkSpecialGang(list, isGang){
      if(!list || list.length == 0){
          return isGang ? 3 : BAIPAI_TYPE.C_ANGANG;
      }
      let paiType = {
          wan:0,
          tiao:0,
          tong:0,
          zhong:0,
          fa:0,
          bai:0,
          dong:0,
          nan:0,
          xi:0,
          bei:0
      }
      for(let i = 0; i < list.length; i++){
          switch(Math.floor(list[i].id/4)){
              case 0:
                  paiType.tong++;
                  break;
              case 9:
                  paiType.tiao++;
                  break;
              case 18:
                  paiType.wan++;
                  break;
              case 27:
                  paiType.zhong++;
                  break;
              case 28:
                  paiType.fa++;
                  break;
              case 29:
                  paiType.bai++;
                  break;
              case 30:
                  paiType.dong++;
                  break;
              case 31:
                  paiType.nan++;
                  break;
              case 32:
                  paiType.xi++;
                  break;
              case 33:
                  paiType.bei++;
                  break;
          }
      }

      if(paiType.wan == 2 || paiType.tiao == 2 || paiType.tong == 2){
          return isGang ? 9 : BAIPAI_TYPE.C_YAO;
      }else if(paiType.zhong == 2 || paiType.fa == 2 || paiType.bai == 2){
          return isGang ? 4 : BAIPAI_TYPE.C_XI;
      }else if(paiType.dong == 1 && paiType.nan == 1 && paiType.xi == 1 && paiType.bei == 1){
          return isGang ? 5 : BAIPAI_TYPE.C_FENG;
      }else{
          return isGang ? 3 : BAIPAI_TYPE.C_ANGANG;
      }
    },


    setTingTips(huTypes){
        this.require_PlayerED.notifyEvent(this.require_PlayerEvent.SHOW_TING_TIPS, [this, huTypes]);
    },

    setHuangZhuangTips(isHuangZhuang){
        this.require_PlayerED.notifyEvent(this.require_PlayerEvent.SHOW_HUANG_ZHUANG_TIPS, [this, isHuangZhuang]);
    },

    /**
     * 查找叫牌信息
     * @param out_id
     */
    getGangJiaoInfo: function (playCardId, tingType, gangList) {
        let result = this.getJiaoInfo(playCardId);
        if(result){
            return result;
        }else{
            result = null;

            this.jiaoInfo_list.forEach(function(jiaoInfo){
                if(jiaoInfo.tingGangCardsList.length > 0){
                    let count = 0;
                    for(let i = 0; i < jiaoInfo.tingGangCardsList.length; i++){
                        if(gangList.indexOf(jiaoInfo.tingGangCardsList[i].id) != -1){
                            count++;
                        }
                    }

                    if(count == gangList.length){
                        if(!result){
                            result = jiaoInfo
                        }else{
                            result.jiao_pai_list = result.jiao_pai_list.concat(jiaoInfo.jiao_pai_list);
                        }
                    }
                }

            },this);
            return result;
        }
    },

    setJiaoInfo: function (out_id, fan) {
        this.jiaoInfo_list.forEach(function(jiaoInfo){
            if(jiaoInfo.out_id == out_id){
                this.curjiaoPaiInfo_list = null;

                if(fan == -1){
                    this.curjiaoPaiInfo_list = jiaoInfo.jiao_pai_list;
                }else{
                    let temp = [];
                    for(let i = 0; i < jiaoInfo.jiao_pai_list.length; i++){
                        let jiaopaiinfo = jiaoInfo.jiao_pai_list[i];

                        let cnt = jiaopaiinfo.cnt >> 16;
                        if(cnt == fan){
                            temp.push(jiaoInfo.jiao_pai_list[i]);
                        }
                    }

                    this.curjiaoPaiInfo_list = temp;
                }
            }
        },this);
    },

    initMJComponet(){
        return require("mjComponentValue").hlmj;
    }
});


module.exports = {
    PlayerEvent:base_mj_player_data.PlayerEvent,
    PlayerED:base_mj_player_data.PlayerED,
    PlayerData:bc_PlayerData,
    PlayerState:base_mj_player_data.PlayerState,
};