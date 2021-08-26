var pai3d_value = require("jlmj_pai3d_value");
var PlayerEvent = require("cfmj_player_data").PlayerEvent;
var PlayerED = require("cfmj_player_data").PlayerED;
var PlayerData = require("cfmj_player_data").PlayerData;
var PlayerState = require("cfmj_player_data").PlayerState;

var JiaoInfo = require('jlmj_jiaopai').JiaoInfo;
var JiaoPai = require('jlmj_jiaopai').JiaoPai;

var CFMJUserPlayerData = cc.Class({

    extends: PlayerData,

    s_userPlayer: null,
    statics: {

        Instance: function () {
            if(!this.s_userPlayer){
                this.s_userPlayer = new CFMJUserPlayerData();
            }
            return this.s_userPlayer;
        },

        Destroy: function () {
            if(this.s_userPlayer){
                this.s_userPlayer = null;
            }
        },
    },

    /**
     * 构造
     */
    ctor: function () {
        this.curjiaoPaiInfo_list = null;  //当前选择的叫牌信息
        this.modepai = null;
    },

    /**
     * 摸牌
     */
    mopai: function (msg) {
        var card = msg.actcard;
        if(!card || typeof(card.id) == "undefined" || JSON.stringify(card) == "{}"){
            cc.error("【数据】"+"用户玩家 摸的牌为空");
            return;
        }
        this.addShouPai([card.id]);
        this.modepai = card.id;
        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 摸牌:"+pai3d_value.desc[this.modepai]);

        var playerMgr = require('cfmj_player_mgr');
        if(!playerMgr.Instance().playing_shou2mid_ani || this.replaying){  //回放,直接摸牌
            this.mopaiAction();
        }

        /*var DeskData = require('cfmj_desk_data').DeskData;
        if(DeskData.Instance().isauto_pai)
           PlayerED.notifyEvent(PlayerEvent.AUTO_CHU_PAI,[this, this.modepai]);*/
    },

    /**
     * 打牌
     */
    dapai: function (id, isQuick) {
        if(this.chupai.indexOf(id) != -1){
            return;
        }
        var chupai_idx_in_shoupai = 0;
        this.shoupai.forEach(function (shoupai_id,idx) {
            if(shoupai_id == id){
                chupai_idx_in_shoupai = idx;
            }
        });
        this.modepai = null;
        this.delShouPai([id],1);
        this.paixu();
        this.chupai.push(id);
        this.isQuick = isQuick;
        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 打牌:" + pai3d_value.desc[id]+" 快出牌:"+isQuick);
        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 手牌:" + pai3d_value.descs(this.shoupai));
        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 手牌索引:" + chupai_idx_in_shoupai);
        PlayerED.notifyEvent(PlayerEvent.DAPAI,[this,chupai_idx_in_shoupai]);
    },

    /**
     * 用户玩家 设置 吃碰杠听胡
     * @param msg
     */
    setCpgth: function (msg, isGangTing) {
        this.canchi = msg.canchi;
        this.canpeng = msg.canpeng;
        this.canbugang = msg.canbugang;
        this.canhu = msg.canhu;
        this.canting = false;
        this.isGangTing = isGangTing || false;
        this.cangangmopai = msg.cangangmopai;
        this.cangang = msg.cangang;
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
        this.setDapaiTing(msg);
        var DeskData = require('cfmj_desk_data').DeskData;
        if(msg.actcard){
            DeskData.Instance().last_chupai_id = msg.actcard.id;
        }
        // //桌子上无牌时,只能杠3张牌,其他杠不能杠 (服务器未过滤,客户端此处过滤杠)
        // if(this.cangang || this.canbugang){
        //     if(!DeskData.Instance().hasRemainPai()){
        //         var gangOption = this.gang_options;
        //
        //         if( gangOption.cardList.length == 1 ) {
        //             this.cangang = false;
        //             this.canbugang = false;
        //             cc.log('无三个的杠,杠过滤');
        //         } else if( gangOption.cardList.length > 1 ) {
        //             var gangOptionList = [];
        //             var havexiaoji = DeskData.Instance().isXiaoJiFeiDan;
        //             const gang_Analysts = require('cfmj_pai_analysts');
        //             gang_Analysts.Instance().getAllGangGroup(gangOption.cardList, gangOptionList, havexiaoji, isGangTing);
        //
        //             cc.log('杠牌选项');
        //             cc.log(gangOptionList);
        //             var has_three_gang = false; //是否有3个的杠
        //             for(var i=0; i<gangOptionList.length; ++i){
        //                 for(var j=0; j<gangOptionList[i].length; ++j){
        //                     if(gangOptionList[i][j].length == 3){
        //                         has_three_gang = true;
        //                         break;
        //                     }
        //                 }
        //             }
        //             if(!has_three_gang){
        //                 this.cangang = false;
        //                 this.canbugang = false;
        //                 cc.log('无三个的杠,杠过滤');
        //             }else{
        //                 cc.log('有三个的杠,杠不过滤');
        //             }
        //         }
        //     }
        // }
    },

    /**
     * 设置是否能自动出牌   现在是服务器实现的
     */
    setAutoChuPai:function (msg) {
        if(this.getIsTing() && this.hasMoPai()){
            if(!this.canhu && !this.cangang){
                PlayerED.notifyEvent(PlayerEvent.AUTO_CHU_PAI,[this, this.getMoPai()]);
            }
        }
    },
    /**
     * 设置听
     * @param msg
     */
    setCanTing: function(msg) {
        if(!msg.canting){
            return ;
        }
        this.jiaoInfo_list = [];
        msg.jiaoinfosList.forEach(function (jiaoInfo) {
            var out_id = null;//jiaoInfo.setCpgth.id;
            var jiaoPai_list = [];
            jiaoInfo.paiinfosList.forEach(function (jiaoPai) {
                jiaoPai_list.push(new JiaoPai(jiaoPai.hucard.id,jiaoPai.fan,jiaoPai.count,jiaoPai.anganghu, false, false, jiaoPai.hutypesList));
            });
            this.jiaoInfo_list.push(new JiaoInfo(out_id,jiaoPai_list,jiaoInfo.angang));
        },this);
        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 操作菜单:"+"听牌");
    },

    setDapaiTing:function (msg) {
        if(!msg.jiaoinfosList.length){
            return;
        }
        this.jiaoInfo_list = [];
        var list = [];
        msg.jiaoinfosList.forEach(function (jiaoInfo) {
            var out_id = null;
            var jiaoPai_list = [];
            if(jiaoInfo.outcard){
                out_id = jiaoInfo.outcard.id;
                list.push(out_id);
            }
            jiaoInfo.paiinfosList.forEach(function (jiaoPai) {
                jiaoPai_list.push(new JiaoPai(jiaoPai.hucard.id,jiaoPai.fan,jiaoPai.count,jiaoPai.anganghu, false, false, jiaoPai.hutypesList));
            });
            this.jiaoInfo_list.push(new JiaoInfo(out_id,jiaoPai_list,jiaoInfo.angang));
        },this);

        if(!msg.canting && !msg.canhu){
            PlayerED.notifyEvent(PlayerEvent.SHOW_DAPAI_TING,[this, true, list, 4]);    //设置可点击的牌
        }

        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 打牌后可以听牌");
    },

    /**
     * 用户玩家 设置 吃牌选项
     */
    setChiOptions: function(msg){
        this.chi_options = [];
        if(!msg.canchi || !msg.chiinfoList){
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

        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 吃牌选项:"+pai3d_value.descs(this.chi_options.data));
    },

    /**
     * 用户玩家 设置 杠牌选项
     */
    setGangOptions: function(msg){
        this.gang_options = {};
        if(!msg.cangang || !msg.gangcards || !msg.gangcards.gangcardList){
            return;
        }
        this.gang_options.isnewdealstyle = msg.gangcards.isnewdealstyle || false;
        this.gang_options.cardList = [];
        if(!this.gang_options.isnewdealstyle){//当是点杠时才有这个中心牌
            this.gang_options.centerId =  msg.gangcards.centercard.id;
        }
        msg.gangcards.gangcardList.forEach(function(item,idx){
            this.gang_options.cardList.push(item.id);//可杠 或是可选的杠牌的集合
        },this);
        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 杠牌选项"+":"+pai3d_value.descs(this.gang_options.cardList));
    },


    /**
     * 用户玩家 是否有操作选项
     */
    hasCaozuo: function () {
        cc.log('----判断关闭吃碰杠菜单开始---'+this.canchi+"  "+this.canpeng+"  "+this.cangang+"  "+this.canting+"  "+this.canhu);
        return this.canchi||this.canpeng||this.cangang||this.canting||this.canhu;
    },

    /**
     * 查找叫牌信息
     * @param out_id
     */
    getJiaoInfo: function (out_id) {
        var jiaoInfo_result = null;
        this.jiaoInfo_list.forEach(function(jiaoInfo){
            if(jiaoInfo.out_id == out_id){
                jiaoInfo_result = jiaoInfo;
            }
        },this);
        if(jiaoInfo_result) {
            return jiaoInfo_result;
        }else{
            return null;
        }
    },
    setJiaoInfo: function (out_id) {
        this.jiaoInfo_list.forEach(function(jiaoInfo){
            if(jiaoInfo.out_id == out_id){
                this.curjiaoPaiInfo_list = null;
                this.curjiaoPaiInfo_list = jiaoInfo.jiao_pai_list;
            }
        },this);
    },
    getTingGangJiaoInfo: function (out_id) {
        var jiaoInfo_result = null;
        this.jiaoInfo_list.forEach(function(jiaoInfo){
            if(jiaoInfo.out_id == out_id && jiaoInfo.angang){
                jiaoInfo_result = [];
                for(var i in jiaoInfo.jiao_pai_list)
                {
                    if(jiaoInfo.jiao_pai_list[i].angang){
                        jiaoInfo_result.push(jiaoInfo.jiao_pai_list[i]);
                    }
                }
            }
        },this);
        if(jiaoInfo_result) {
            this.curjiaoPaiInfo_list = null;
            this.curjiaoPaiInfo_list = jiaoInfo_result;
            return jiaoInfo_result;
        }else{
            this.curjiaoPaiInfo_list = null;
            return null;
        }
    },
    setJiaoPaiMsg:function (jiaopai) {
        this.curjiaoPaiInfo_list = [];
        for(var i in jiaopai){
            var list = jiaopai[i].paiinfosList[0];
            this.curjiaoPaiInfo_list.push({id:list.hucard.id, fan:list.fan,cnt:list.count});
        }
    },
    clearJiaoPaiMsg:function () {
        this.jiaoInfo_list = [];
    },
    curJiaoPaiInfo:function () {
        return this.curjiaoPaiInfo_list;
    },
    /**
     * 清理操作状态
     */
    clearCtrlStatus: function() {
        this.canchi = false;
        this.canpeng = false;
        this.cangang = false;
        this.canbugang = false;
        this.canting = false;
        this.canhu = false;
    },

    /**
     * 清理
     */
    clear: function () {
        this._super();
        // this.waitDapai = [];
        this.mid2dapai_playing = false;

        this.shoupai = [];             //手牌
        this.chupai = [];              //出牌
        this.baipai_data_list = [];    //摆牌
        this.xiList = {};              //喜牌

        this.state = PlayerState.DAPAI;

        this.modepai = null;

        this.clearCtrlStatus();        //清理操作状态

        PlayerED.notifyEvent(PlayerEvent.CLEAR,[this]);

        this.curjiaoPaiInfo_list = null;
    },

    /**
     * 清理，但是不清理等待状态
     */
    clearPai: function () {
        this._super();
        // this.waitDapai = [];
        this.mid2dapai_playing = false;

        this.shoupai = [];             //手牌
        this.chupai = [];              //出牌
        this.baipai_data_list = [];    //摆牌
        this.xiList = {};              //喜牌

        this.state = PlayerState.DAPAI;

        this.modepai = null;

        this.clearCtrlStatus();        //清理操作状态

        PlayerED.notifyEvent(PlayerEvent.CLEAR,[this]);

        this.curjiaoPaiInfo_list = null;
    },

    /**
     * 对比手牌
     * shoupai 玩家当前的手牌
     * mopai 如果摸牌,则玩家当前摸的牌
     */
    diffHoldCard: function( data ) {
        var serverShouPai = [];
        for(var v in data.shoupaiList){
            if (data.shoupaiList.hasOwnProperty(v)) { //filter,只输出man的私有属性
                serverShouPai.push( data.shoupaiList[v] );
            };
        }
        if( data.mopai ) {
            serverShouPai.push( data.mopai );
        }
        var clientShouPai =  this.shoupai.slice(0);
        var showServerShouPai = [];
        serverShouPai.forEach(function(item){
            showServerShouPai.push( item.id );
        });
        showServerShouPai.sort( function(a,b) {
            return a-b;
        } )
        clientShouPai.sort( function( a, b ) {
            return a-b;
        } )
        cc.log( "服务器手牌：" + pai3d_value.descs(showServerShouPai) );
        cc.log( "客户端手牌：" + pai3d_value.descs(clientShouPai) );

        if( serverShouPai.length != clientShouPai.length ) {
            cc.log( "服务器的牌 和 本地手牌 长度不同" );
            return ;
        }
        for( var i = 0; i < serverShouPai.length; ++i ) {
            var flag = false;
            for( var j = 0; j < clientShouPai.length; ++j ) {
                var sShouPai = serverShouPai[i].id;
                var cShouPai = clientShouPai[j];
                if( sShouPai == cShouPai ) {
                    flag = true;
                    break;
                }
            }
            if( !flag ) {
                return;
            }
        }
    },
});

module.exports = CFMJUserPlayerData;
