var jlmj_player_data = require('jlmj_player_data');
var PlayerEvent = jlmj_player_data.PlayerEvent;
var PlayerED = jlmj_player_data.PlayerED;
var BaipaiType = require("jlmj_baipai_data").BaipaiType;
var BaipaiData = require("jlmj_baipai_data").BaipaiData;
var pai3d_value = require("jlmj_pai3d_value");

var cc_PlayerData = cc.Class({
    extends: jlmj_player_data.PlayerData,

    properties: {

    },

    /**
     * 玩家 设置 吃碰杠听胡
     * @param msg
     */
    setCpgth: function (msg, isGangTing) {
        var DeskData = require("jzmj_desk_data").DeskData;

        if(msg.canpeng && msg.actcard && DeskData.Instance().isLiangPai(msg.actcard.id)){
            msg.canpeng = false;
            msg.cangang = true;
        }

        msg.canting = false;
        this.canchi = msg.canchi;
        this.canpeng = msg.canpeng;
        this.cangang = msg.cangang;
        this.canbugang = msg.canbugang;
        this.canhu = msg.canhu;
        this.canting = msg.canting;
        this.isGangTing = isGangTing || false;
        this.isMustHu = msg.ismusthu;
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
            var DeskData = require('jzmj_desk_data').DeskData;
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

        var playerMgr = require('jzmj_player_mgr');
        if(!playerMgr.Instance().playing_shou2mid_ani || this.replaying){  //回放,直接摸牌
            this.mopaiAction();
        }
    },
    /**
     * 打开暗杠
     */
    openAnGang: function (pailistList) {
        var DeskData = require("jzmj_desk_data").DeskData;

        this.kaipai_an_gang_list = [];
        pailistList.forEach(function (item) {
            if(item&&item.cardinfo){
                if(item.cardinfo.type==4){
                    if(item.cardinfo.cardindexList){
                        var value = item.cardinfo.cardindexList[0];
                        this.kaipai_an_gang_list.push({value:value, show:true, isBaoPai:item.cardinfo.cardindexList.length == 3});
                    }
                }else if(item.cardinfo.type==0){
                    if(item.cardinfo.cardindexList){
                        if(DeskData.Instance().isLiangPai(item.cardinfo.cardindexList[0])){
                            var value = item.cardinfo.cardindexList[0];
                            this.kaipai_an_gang_list.push({value:value, show:true, isBaoPai:true});
                        }
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
            if(id>=72&&id<=107){
                return 5;   //万
            }else if(id>=36&&id<=71){
                return 4;   //条
            }else if(id>=0&&id<=35){
                return 3;   //饼
            }else if(id>=120&&id<=135){
                return 2;   //东南西北
            }else if(id>=108&&id<=119){
                return 1;   //中发白
            }
        };

        var DeskData = require("jzmj_desk_data").DeskData;
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
     * 碰
     */
    peng: function (pengcardList) {
        if(!pengcardList){
            cc.error("【数据】"+"碰牌列表为空");
            return;
        }

        var pengIds = [];

        let isLiangPaiPeng = false;
        var DeskData = require("jzmj_desk_data").DeskData;
        pengcardList.forEach(function (card) {
            if(card){
                pengIds.push(card.id);
                if(DeskData.Instance().isLiangPai(card.id)){
                    isLiangPaiPeng = true;
                }
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

        if(isLiangPaiPeng){
            PlayerED.notifyEvent(PlayerEvent.LIANGPAI,[this,baipai_data]);
        }else{
            PlayerED.notifyEvent(PlayerEvent.PENG,[this,baipai_data]);
        }

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

            this.delShouPai(gangIds, gangIds.length);
            cc.log("【数据】"+"玩家:"+this.userId, '暗杠列表',pai3d_value.descs(gangIds));
        }

        var baipai_data = new BaipaiData();
        baipai_data.type = BaipaiType.ANGANG;
        baipai_data.down_pai_num = 3;
        baipai_data.cardIds = gangIds;
        this.baipai_data_list.push(baipai_data);

        this.resetBaiPaiIndex();
        PlayerED.notifyEvent(PlayerEvent.ANGANG, [this, baipai_data, play_audio]);
    },

    /**
     * 杠
     */
    gang: function (msg) {
        switch (msg.gangtype){
            case 19:
                this.angang_baopai(msg.gangcardList, true);    //宝牌暗杠
                return;
        }
        this._super(msg);
    },

    /**
     * 宝牌暗杠，只有三张牌
     * @param gangcardList
     * @param play_audio
     */
    angang_baopai: function (gangcardList, play_audio) {
        if(!gangcardList || gangcardList.length==0){
            var gangIds = [-1,-1,-1]; //不知道的暗杠设为-1
            this.delShouPai(gangIds, 3);
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
                    cc.error("【数据】"+"宝牌暗杠牌列表项为空");
                }
            }.bind(this));

            if(gangIds.length != 3){
                cc.error("【数据】"+"宝牌暗杠牌数目 != 3");
                return;
            }
            if(shoupaiGangCount >= 3){
                cc.error("【数据】"+"宝牌暗杠手牌数目不对"+shoupaiGangCount);
                return;
            }
            this.delShouPai(gangIds, 3);
            cc.log("【数据】"+"玩家:"+this.userId, '暗杠列表',pai3d_value.descs(gangIds));
        }

        var baipai_data = new BaipaiData();
        baipai_data.type = BaipaiType.ANGANG;
        baipai_data.down_pai_num = 3;
        baipai_data.cardIds = gangIds;
        this.baipai_data_list.push(baipai_data);

        this.resetBaiPaiIndex();
        PlayerED.notifyEvent(PlayerEvent.ANGANG, [this, baipai_data, play_audio]);
    },
});


module.exports = {
    PlayerEvent:jlmj_player_data.PlayerEvent,
    PlayerED:jlmj_player_data.PlayerED,
    PlayerData:cc_PlayerData,
    PlayerState:jlmj_player_data.PlayerState,
};