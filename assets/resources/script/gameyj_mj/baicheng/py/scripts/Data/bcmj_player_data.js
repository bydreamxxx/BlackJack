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
        cc.log('----判断关闭吃碰杠菜单开始---'+this.canchi+"  "+this.canpeng+"  "+this.cangang+"  "+this.canting+"  "+this.canhu);
        return this.canchi||this.canpeng||this.cangang||this.canting||this.canhu;
    },

    clearCtrlStatus(){
        this.canchi = false;
        this.canpeng = false;
        this.cangang = false;
        this.canbugang = false;
        this.canhu = false;
        this.canting = false;
        this.cangangmopai = false;
        this.isLiangPaiPeng = false;
        this.canzfb = false;
    },

    /**
     * 玩家 设置 吃碰杠听胡
     * @param msg
     */
    setCtrlStatus: function (msg, isGangTing) {
        var DeskData = require("bcmj_desk_data").DeskData;

        if(msg.canpeng && msg.actcard && DeskData.Instance().isLiangPai(msg.actcard.id)){
            msg.canpeng = false;
            msg.cangang = true;
            this.isLiangPaiPeng = true;
        }else{
            this.isLiangPaiPeng = false;
        }

        this.canchi = msg.canchi;
        this.canpeng = msg.canpeng;
        this.cangang = msg.cangang;
        this.canbugang = msg.canbugang;
        this.canhu = msg.canhu;
        this.canting = false;
        this.cangangmopai = msg.cangangmopai;
        this.canzfb = msg.canliangxi || false;


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
        if(this._isUserPlayer) {
            this.setDapaiTing(msg);
        }

        // 菜单显示 延迟到摸牌后
        // PlayerED.notifyEvent(PlayerEvent.CAOZUO,[this, isGangTing]);
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
     * 点杠
     */
    diangang: function (gangcardList, play_audio) {
        if(!gangcardList){
            cc.error("【数据】"+"点杠牌列表为空");
            return;
        }
        var DeskData = require("bcmj_desk_data").DeskData;
        let isLiangPaiPeng = false;
        let shoupaiGangCount = 0;
        var gangIds = [];
        gangcardList.forEach(function (card) {
            if(card){
                gangIds.push(card.id);
                if(this.getBaipaiDataByid(card.id)){
                    shoupaiGangCount++;
                }
                if(DeskData.Instance().isLiangPai(card.id)){
                    isLiangPaiPeng = true;
                }
            }else{
                cc.error("【数据】"+"点杠牌列表项为空");
            }
        }.bind(this));

        let checkDiangang = 4, checkShoupaiGang = 3, deleteShoupai = 3;

        if(isLiangPaiPeng){
            checkDiangang = 3;
            checkShoupaiGang = 2;
            deleteShoupai = 2;
        }

        if(gangIds.length != checkDiangang){
            cc.error("【数据】"+"点杠牌数目 != 4");
            return;
        }

        if(shoupaiGangCount >= checkShoupaiGang){
            cc.error("【数据】"+"点杠手牌数目不对"+shoupaiGangCount);
            return;
        }

        this.delShouPai(gangIds, deleteShoupai);
        cc.log("【数据】"+"玩家:"+this.userId, '点杠列表',pai3d_value.descs(gangIds));
        var baipai_data = new BaipaiData();
        baipai_data.type = BaipaiType.DIANGANG;
        baipai_data.down_pai_num = 3;
        baipai_data.cardIds = gangIds;
        this.baipai_data_list.push(baipai_data);
        this.resetBaiPaiIndex();
        this.require_PlayerED.notifyEvent(this.require_PlayerEvent.DIANGANG, [this, baipai_data, play_audio]);

    },

    /**
     * 打开暗杠
     */
    openAnGang: function (pailistList) {
        var DeskData = require("bcmj_desk_data").DeskData;

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

    initMJComponet(){
        return require("mjComponentValue").bcmj;
    }
});


module.exports = {
    PlayerEvent:base_mj_player_data.PlayerEvent,
    PlayerED:base_mj_player_data.PlayerED,
    PlayerData:bc_PlayerData,
    PlayerState:base_mj_player_data.PlayerState,
};