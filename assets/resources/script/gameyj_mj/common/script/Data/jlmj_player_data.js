var dd = cc.dd;
var BaipaiType = require("jlmj_baipai_data").BaipaiType;
var BaipaiData = require("jlmj_baipai_data").BaipaiData;
var BAIPAI_TYPE = require("Define").ComposeCardType;
var JLGData = require("jlmj_baipai_data").JLGData;
var pai3d_value = require("jlmj_pai3d_value");
const paiType = require('jlmj_gang_pai_type').CardType;

var PlayerState = cc.Enum({
    DAPAI:      "jlmj_state_dapai",    //玩家打牌
    TINGPAI:    "jlmj_state_tingpai",  //玩家听牌
    HUPAI:      "jlmj_state_hupai",    //玩家胡牌
    SC_KAIPAI:     "scmj_state_kaipai",
    SC_HUPAI:     "scmj_state_hupai",
    PO_CHAN:    "mj_pochan",//玩家破产
});

/**
 * 事件类型
 */
var PlayerEvent = cc.Enum({
    UPDATE_OWNER: "UPDATE_OWNER", // 更新房主
    ENTER:                  'jlmj_player_enter',                        //玩家进入
    EXIT:                   'jlmj_player_exit',                         //玩家退出
    IS_ON_LINE:             'jlmj_user_isonline',                       //玩家离线
    IS_ON_TG:               'jlmj_user_tuoguan',                        //玩家托管
    MOPAI:                  'jlmj_player_mopai',                        //玩家摸牌
    DAPAI_CDING:            'jlmj_player_dapai_cding',                  //玩家打牌CD中
    CLEAR_DAPAI_CDING:      'jlmj_clear_player_dapai_cding',            //取消玩家打牌头像上的特效
    DAPAI:                  'jlmj_player_dapai',                        //玩家打牌
    CAOZUO:                 'jlmj_player_caozuo',                       //玩家操作
    BEICHI:                 'jlmj_player_beichi',                       //被吃
    CHI:                    'jlmj_player_chi',                          //吃
    BEIPENG:                'jlmj_player_beipeng',                      //被碰
    PENG:                   'jlmj_player_peng',                         //碰
    HU:                     'jlmj_player_hu',                           //胡
    BEIHU:                  'jlmj_player_beihu',                        //被胡
    BEIGANG:                'jlmj_player_beigang',                      //被杠
    DIANGANG:               'jlmj_player_diangang',                     //点杠
    BAGANG:                 'jlmj_player_bagang',                       //巴杠
    ANGANG:                 'jlmj_player_angang',                       //暗杠
     FGANG:                 'jlmj_player_sfgang',                       //风杠
    _19GANG1:               'jlmj_player_19gang1',                      //1杠
    _19GANG9:               'jlmj_player_19gang9',                      //9杠
    ZFBGANG:                'jlmj_player_zfbgang',                      //中发白杠
    BUGANG:                 'jlmj_player_bugang',                       //补杠
    GUO:                    'jlmj_player_guo',                          //过
    TING:                   'jlmj_player_ting',                         //听
    KAIPAI:                 'jlmj_player_kaipai',                       //开牌
    CLEAR:                  'jlmj_player_clear',                        //清理
    READY:                  'jlmj_player_read',                         //准备
    REMOVE_ROB_FAILED:      'jlmj_player_remove_rob_failed',            //恢复抢失败的牌
    UPDATE_BANKER:          'jlmj_player_update_isbanker',              //更新是否庄家
    DA_BAO:                 'jlmj_palyer_da_bao',                       //打宝
    SHOW_CLICK:             'jlmj_palyer_show_click0',                  //显示可操作的牌 杠牌 吃牌 以及听牌
    CLEA_SELECT_CARD:       'jlmj_palyer_quxiao_select',                //取消牌的选择
    SET_COIN:               'jlmj_player_setCoin',                      //设置金币
    TAKE_OVER_ZSQ:          'jlmj_player_zsq ',                         //断线重连恢复指示器
    AUTO_CHU_PAI:           'jlmj_auto_chu_pai',                        //自动出牌
    PLAY_MID2SHOU_PAI:      'jlmj_play_mid2shou_pai',                   //播放中间牌->打牌动作
    SHOW_DAPAI_TING:        'mj_player_dapai_ting',                     //提示打什么牌下一轮可听
    SHOW_GU_PAI:            'namj_player_gu_pai',                       //提示打什么牌并估牌
    GU:                     'mj_player_gu',                             //估
    BEIGU:                  'mj_player_beigu',                          //被估
    XIAOSA:                 'mj_player_xiaosa',                        //潇洒
    CHITING:                'mj_player_chiting',                         //吃听
    PENGTING:               'mj_player_pengting',                        //碰听
    GANGTING:               'mj_player_gangting',                        //杠听
    GENZHUANG:              'mj_player_genzhuang',                       //跟庄
    CHGANG:                'jlmj_player_chgang',                        //彩虹杠
    HUAN3ZHANG:            'scmj_player_huan3zhang',                     //换三张
    MOVE3ZHANG:             'scmj_player_move3zhang',                     //换三张出牌
    PLAYER_TIPS:             'scmj_player_tips',                         //换三张定缺刮风下雨状态提示
    DING_QUE:                'scmj_ding_que',                            //定缺指示
    CHANGE_COIN:             'scmj_change_coin',                          //更新金币、得分
    HUAZHU:                  'scmj_huazhu',                              //花猪
    WUJIAO:                  'scmj_wujiao',                              //无叫
    QUICKHUAN3ZHANG:         'scmj_quick_huan_3_zhang',                  //回放的时候换三张
    SHOW_LIANG_ZHANG_BAO:    'shmj_show_liang_zhang_bao',                //绥化麻将亮掌宝控制手牌点击
    LIANGZHANG:              'shmj_liang_zhang',                         //绥化麻将亮掌宝
    LIANGPAI:                'jzmj_liang_pai',                           //锦州麻将亮牌
    PAOFEN:                  'tdhmj_pao_fen',                            //巷乐推倒胡跑分
    CHANGE_PAI_UI:           'mj_change_pai_ui',                         //切换牌UI
    TUIDAO:                  'shmj_tuidao',                              //绥化麻将推倒
});

/**
 * 事件管理
 */
var PlayerED = new dd.EventDispatcher;

var JiaoPai = cc.Class({

    ctor: function (...params) {
        this.id = params[0];   //胡牌id
        this.fan = params[1]; //翻数
        this.cnt = params[2]; //剩余个数
    },

    toString: function () {
        return "{"+"胡牌:"+pai3d_value.desc[this.id]+" 翻数:"+this.fan+" 个数:"+this.cnt+"}\n";
    },

});

/**
 * 打出某张牌对应的胡牌信息
 * @type {Function}
 */
var JiaoInfo = cc.Class({

    ctor: function (...params) {
        this.out_id = params[0];   //出牌
        this.jiao_pai_list = params[1];     //叫牌列表
        this.angang = params[2]; //是否可以暗杠听
    },

    toString: function () {
        var desc = "";
        desc += "出牌:"+pai3d_value.desc[this.out_id]+"\n";
        desc += " 胡牌列表:\n";
        this.jiao_pai_list.forEach(function(jiaoPai,idx){
            desc += (idx+1)+":"+jiaoPai.toString();
        });
        return desc;
    },

});

var PlayerData = cc.Class({

    /**
     * 构造
     */
    ctor: function () {
        this.initBaseData();
        this.initGameData();
        this.viewIdx=0; //视角座位(对所有玩家本身而言，0永远是自己)
    },

    /**
     * 设置基础数据
     */
    initBaseData: function () {
        this.userId= 0; //用户id
        this.idx=0;  //座位号
        this.coin=0; //筹码数
        this.nickname=""; //昵称
        this.name="";   //昵称(和其他保持统一)
        this.sex=0; //性别
        this.headUrl = ""; //头像地址
        this.isOnLine=true;//玩家是否在线
        this.ip = "";// 玩家的ip地址
        this.isOwner = false;// 是否房主
        this.address = 0;// ip解析出来的地址
        this.location = null; //定位
        this.oldlocation = null;
    },

    /**
     * 初始化游戏数据
     */
    initGameData: function () {
        this.replaying = false;     //回放中
        this.hasGameData = false;   //是否有游戏数据

        this.bready= 0;  //是否准备
        this.isbanker = false;  //是否庄家
        this.shoupai = [];             //手牌
        this.chupai = [];              //出牌
        this.baipai_data_list = [];    //摆牌
        this.shoupaiCount= "";   //手牌数目
        this.modepai= 0; //摸得牌
        this.huTypeList= [];// 胡牌类型
        this.huCardId= null;// 胡的那张牌ID

        this.dapaiCD=0;  //打牌cd
        this.canchi=false;//能否吃
        this.canpeng=false;//能否碰
        this.cangang=false;//能否杠
        this.canbugang=false;//能否补杠
        this.canting=false;//能否听
        this.canhu=false;//能否胡
        this.isZiMo= null;// 是否自摸
        this.state = PlayerState.DAPAI;
        this.nHuPai = 0;// 是否已胡牌
        this.gameStatus = 0;// 玩家游戏状态
        this.agentMode = 0;// 托管状态
        this.isBaoTing = false;// 是否已报听
        this.isTempBaoTing = false;// 客户端处理听牌表现
        this.isTempBaoGu = false;
        this.isTempGang = false;// 客户端听牌 后的杠牌
        this.kaipai_an_gang_list = [];  //结算时,其他玩家暗杠列表

        this.chi_options = [];         //吃牌选项
        this.gang_options = [];        //杠牌选项
        this.jiaoInfo_list = [];        //叫牌列表
    },

    /**
     * 清理
     */
    clear: function () {
        this.initGameData();
        this.clearCtrlStatus();        //清理操作状态
        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 清理桌子");
        PlayerED.notifyEvent(PlayerEvent.CLEAR,[this]);
    },

    /**
     * 清理，但是不清理等待状态
     */
    clearPai(){
        this.replaying = false;     //回放中
        this.hasGameData = false;   //是否有游戏数据

        this.isbanker = false;  //是否庄家
        this.shoupai = [];             //手牌
        this.chupai = [];              //出牌
        this.baipai_data_list = [];    //摆牌
        this.shoupaiCount= "";   //手牌数目
        this.modepai= 0; //摸得牌
        this.huTypeList= [];// 胡牌类型
        this.huCardId= null;// 胡的那张牌ID

        this.dapaiCD=0;  //打牌cd
        this.canchi=false;//能否吃
        this.canpeng=false;//能否碰
        this.cangang=false;//能否杠
        this.canbugang=false;//能否补杠
        this.canting=false;//能否听
        this.canhu=false;//能否胡
        this.isZiMo= null;// 是否自摸
        this.state = PlayerState.DAPAI;
        this.nHuPai = 0;// 是否已胡牌
        this.gameStatus = 0;// 玩家游戏状态
        this.agentMode = 0;// 托管状态
        this.isBaoTing = false;// 是否已报听
        this.isTempBaoTing = false;// 客户端处理听牌表现
        this.isTempBaoGu = false;
        this.isTempGang = false;// 客户端听牌 后的杠牌
        this.kaipai_an_gang_list = [];  //结算时,其他玩家暗杠列表

        this.chi_options = [];         //吃牌选项
        this.gang_options = [];        //杠牌选项
        this.jiaoInfo_list = [];        //叫牌列表

        this.clearCtrlStatus();
        PlayerED.notifyEvent(PlayerEvent.CLEAR,[this]);
    },

    /**
     * 设置房间管理器玩家基础数据
     * @param role
     */
    setBaseData: function (role) {
        this.userId = role.userId;
        this.nickname = role.name;
        this.name = role.name;
        this.sex = role.sex;
        this.headUrl = cc.dd.Utils.getWX64Url(role.headUrl);
        this.openId = role.openId;
        this.bready = role.isReady ? 1 : 0;
        this.idx = role.seat;
        this.isOnLine = role.state == 1;
        this.coin = role.coin;
        this.location = role.latlngInfo;
        this.oldlocation = role.latlngInfo;
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
        // if(playerMsg.userid != cc.dd.user.id){
        //     for(var i=0; i<playerMsg.playercard.handcardcount; ++i){
        //         this.shoupai.push(0);
        //     }
        // }else {
        //     playerMsg.playercard.handcardList.forEach(function (card) {
        //         this.pushData(this.shoupai,card.id);
        //     }.bind(this));
        //     // this.paixu();
        //     if(playerMsg.playercard.mopai && playerMsg.playercard.mopai.id){
        //         this.pushData(this.shoupai,playerMsg.playercard.mopai.id);
        //     }
        // }

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

    //todo 暂时处理
    /**
     * 设置玩家牌数据
     * 朋友场 新一局
     * @param Msg
     */
    setCardList: function (Msg) {
        this.dapaiCD=0;  //打牌cd
        this.canchi=false;//能否吃
        this.canpeng=false;//能否碰
        this.cangang=false;//能否杠
        this.canbugang=false;//能否补杠
        this.canting=false;//能否听
        this.canhu=false;//能否胡
        this.isZiMo= null;// 是否自摸
        this.state = PlayerState.DAPAI;
        this.nHuPai = 0;// 是否已胡牌
        this.gameStatus = 0;// 玩家游戏状态
        this.agentMode = 0;// 托管状态
        this.isBaoTing = false;// 是否已报听
        this.isTempBaoTing = false;// 客户端处理听牌表现
        this.isTempBaoTing = false;
        this.isTempGang = false;// 客户端听牌 后的杠牌

        this.chupai = [];              //出牌
        Msg.outcardList.forEach(function (card) {
            this.chupai.push(card.id)
        }.bind(this));
        this.shoupai = [];             //手牌
        if(Msg.userid != cc.dd.user.id){
            for(var i=0; i<Msg.handcardcount; ++i){
                this.shoupai.push(0);
            }
        }else {
            Msg.handcardList.forEach(function (card) {
                this.pushData(this.shoupai,card.id);
            }.bind(this));
            // this.paixu();
            if(Msg.mopai && cc.dd._.isNumber(Msg.mopai.id)){
                this.pushData(this.shoupai,Msg.mopai.id);
            }
        }
        this.baipai_data_list = [];    //摆牌
        this.initBaiPaiData( Msg.composecardList );
        cc.log("座位号:",this.idx," 手牌数:",this.shoupai.length);
        this.kaipai_an_gang_list = [];
    },

    /**
     * 设置是否房主
     * @param isOwner bool 是否房主
     */
    setIsOwner: function( isOwner ) {
        this.isOwner = isOwner;
        PlayerED.notifyEvent( PlayerEvent.UPDATE_OWNER, [this] );
    },

    /**
     * 放入数据  保证列表的只有一个
     */
    pushData:function (arr, cardid) {
        if(arr && arr.indexOf(cardid)==-1){
            arr.push(cardid);
        }
    },

    /**
     * 设置庄家
     */
    setBank:function () {
        PlayerED.notifyEvent(PlayerEvent.UPDATE_BANKER,[this]);
    },


    getIsTing: function() {
        return this.isBaoTing
    },

    /**
     * 获取是否房主
     */
     getIsOwner: function() {
        return this.isOwner;
    },

    /**
     * 是否为用户玩家
     */
    isUserPlayer: function () {
      return this.userId == dd.user.id;
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




    getIsCCG: function( baipaiType ) {
        var arr = [ BAIPAI_TYPE.C_XI, BAIPAI_TYPE.C_FENG, BAIPAI_TYPE.C_JIU,BAIPAI_TYPE.C_YAO];
        if(arr.indexOf(baipaiType)!=-1){
            return true;
        }
        return false;
    },

    // 设置是否自摸
    // @param boolean bool 是否自摸
    setIsZiMo: function( bool ) {
        this.isZiMo = bool;
    },

    // 获取是否自摸
    // @return boolean 是否自摸
    getIsZiMo: function() {
        return this.isZiMo;
    },

    /**
     * 复制对象
     * 把 arr1拷贝入 inArr
     */
    copyObj:function (inArr, outArr) {
        if(!inArr || !outArr){
            return
        };
        inArr.splice(0);
        for(var i=0; i<outArr.length; ++i){
            inArr.push(outArr[i].id);
        }
        return inArr;
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
            if( baipai_data.type == 0 || baipai_data.type == 10) {
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

    transBaiPaiType: function( baipaiType ) {
        switch( baipaiType ) {
            case BAIPAI_TYPE.C_MINGGANG:
                return BaipaiType.DIANGANG;
            case BAIPAI_TYPE.C_ANGANG:
                return BaipaiType.ANGANG;
            case BAIPAI_TYPE.C_XI:
                return BaipaiType.ZFBG;
            case BAIPAI_TYPE.C_FENG:
                return BaipaiType._FG;
            case BAIPAI_TYPE.C_JIU:
                return BaipaiType._19G9;
            case BAIPAI_TYPE.C_YAO:
                return BaipaiType._19G1;
            case BAIPAI_TYPE.C_CHI:
                return BaipaiType.CHI;
            case BAIPAI_TYPE.C_PENG:
                return BaipaiType.PENG;
            case BAIPAI_TYPE.C_LZB:
                return BaipaiType.LZB;
            default:
                break;
        }
    },

    /**
     * 隐藏准备
     */
    hideRead: function() {
        PlayerED.notifyEvent(PlayerEvent.START,[this]);
    },

    /**
     * 设置金币
     */
    setCoin:function (coin) {
        this.coin = coin;
        PlayerED.notifyEvent(PlayerEvent.SET_COIN,[this]);
    },

    /**
     * 进入房间
     */
    enter: function(){
        PlayerED.notifyEvent(PlayerEvent.ENTER,[this]);
    },

    /**
     * 离开房间
     */
    exit: function(){
        PlayerED.notifyEvent(PlayerEvent.EXIT,[this]);
    },

    /**
     * 设置是否在线
     */
    setOnLine:function (isOn) {
        this.isOnLine = isOn;
        PlayerED.notifyEvent(PlayerEvent.IS_ON_LINE,[this, isOn]);
        if(isOn){
            cc.dd.PromptBoxUtil.show('\"'+this.nickname+'\"'+"回到游戏");
        }else{
            cc.dd.PromptBoxUtil.show('\"'+this.nickname+'\"'+"离开");
        }
    },

    setOnLineNoMsg:function (isOn) {
        this.isOnLine = isOn;
        PlayerED.notifyEvent(PlayerEvent.IS_ON_LINE,[this, isOn]);
    },


    /**
     * 请求准备
     */
    /*reqReady: function () {
        var msg = new cc.pb.jilinmajiang.p17_req_ready();
        cc.gateNet.Instance().sendMsg(cc.netCmd.jilinmajiang.cmd_p17_req_ready,msg,"p17_req_ready");
    },*/

    /**
     * 准备
     */
    setReady: function (bready) {
        this.bready = bready;
        PlayerED.notifyEvent(PlayerEvent.READY,[this]);
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

        var playerMgr = require('jlmj_player_mgr');
        if(!playerMgr.Instance().playing_shou2mid_ani || this.replaying){  //回放,直接摸牌
            this.mopaiAction();
        }
    },

    /**
     * 是否有摸牌
     */
    hasMoPai: function () {
        return this.shoupai.length % 3 == 2;
    },

    /**
     * 获取摸牌
     */
    getMoPai: function () {
        if(this.hasMoPai()){
            //摸牌在手牌最后一张
            return this.shoupai[this.shoupai.length-1];
        }else{
            return null;
        }
    },

    /**
     * 摸牌动作
     */
    mopaiAction: function () {
        cc.log("【数据】发送摸牌通知");
        PlayerED.notifyEvent(PlayerEvent.MOPAI,[this]);
    },


    /**
     * 移交指示器给玩家
     */
    takeOverZsq: function () {
        PlayerED.notifyEvent(PlayerEvent.TAKE_OVER_ZSQ,[this]);
    },

    /**
     * 玩家打牌cd中
     */
    dapaiCding: function (msg) {
        this.dapaiCD = msg.time;
        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 打牌cd:"+this.dapaiCD);
        PlayerED.notifyEvent(PlayerEvent.DAPAI_CDING,[this]);
    },
    /**
     * 取消打牌头像动画
     */
    cleardapaiCding: function () {
        PlayerED.notifyEvent(PlayerEvent.CLEAR_DAPAI_CDING,[this]);
    },

    /**
     * 打牌
     */
    dapai: function (id) {
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
        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 打牌:" + pai3d_value.desc[id]);

        PlayerED.notifyEvent(PlayerEvent.DAPAI,[this,chupai_idx_in_shoupai]);
    },

    /**
     * 被吃
     */
    beichi: function () {
        var beichi_id = this.chupai.pop();
        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 被吃:"+pai3d_value.desc[beichi_id]);
        PlayerED.notifyEvent(PlayerEvent.BEICHI,[this]);
    },

    /**
     * 吃
     */
    chi:function (chicardList) {
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

        PlayerED.notifyEvent(PlayerEvent.CHI,[this,baipai_data]);

    },

    /**
     * 听牌
     */
    ting: function () {
        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 听牌");
        this.isBaoTing = true;
        this.isTempBaoTing = false;
        this.isTempGang = false;
        this.state = PlayerState.TINGPAI;

        PlayerED.notifyEvent(PlayerEvent.TING,[this]);
    },

    /**
     * 被碰
     */
    beipeng: function () {
        var beipeng_id = this.chupai.pop();
        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 被碰:"+pai3d_value.desc[beipeng_id]);
        PlayerED.notifyEvent(PlayerEvent.BEIPENG,[this]);
    },

    /**
     * 被抢碰
     */
    beiQiangPeng: function() {
        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 被抢碰:");
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
        PlayerED.notifyEvent(PlayerEvent.PENG,[this,baipai_data]);

    },

    /**
     * 胡
     */
    hu: function(huCardId, huTypeList, isZiMo) {
        // if(huTypeList == null){
        //     cc.error("【数据】"+"胡牌类型为空");
        //     return;
        // }
        this.state = PlayerState.HUPAI;
        this.huCardId = huCardId;
        this.huTypeList = huTypeList;
        this.isZiMo = isZiMo;
        PlayerED.notifyEvent(PlayerEvent.HU,[this]);
    },

    /**
     * 被胡
     */
    beihu: function( hupaiId ) {
        var isChuPai = this.removeBeiHuId(hupaiId);

        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 点炮:"+pai3d_value.desc[hupaiId]);
        PlayerED.notifyEvent(PlayerEvent.BEIHU,[this, isChuPai]);
    },

    /** 删除被胡ID
     * @param id
     */
    removeBeiHuId: function( id ) {

        var flag = false;
        for( var i = 0; i < this.chupai.length; ++i ) {
            if( this.chupai[i] == id ) {
                this.chupai.splice( i, 1 );
                flag = true;
                break;
            }
        }

        if( !flag ) {
            var removeArrItemIndex = -1;
            for( var i = 0; i < this.baipai_data_list.length; ++i ) {
                    var removeBaiPaiType = this.baipai_data_list[i].removeCardIdById( id );
                    if( removeBaiPaiType == 2 ) {
                        removeArrItemIndex = i;
                    }
            }
            if( removeArrItemIndex >= 0 ) {
                this.baipai_data_list.splice( removeArrItemIndex, 1 );
            }
        }

        return flag;

    },

    /**
     * 被抢杠
     */
    beiQiangGang: function() {
        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 被抢杠:");
    },

    /**
     * 被杠
     */
    beigang: function () {
        var beigang_id = this.chupai.pop();
        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 被杠:"+pai3d_value.desc[beigang_id]);
        PlayerED.notifyEvent(PlayerEvent.BEIGANG,[this]);
    },

    /**
     * 杠
     */
    gang: function (msg) {
        switch (msg.gangtype) {
            case 1:
            case 8: //大蛋明杠
            case 10: //2饼明杠
            case 12: //8万明杠
            case 14://幺鸡明杠
            case 16://普通明杠 大杠
                this.diangang(msg.gangcardList, true);    //点杠
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
     * 增加手牌
     */
    addShouPai:function (arr) {
        for(var i in arr){
            if(this.userId == cc.dd.user.id || this.replaying){ //自己或回放 增加真正的手牌
                if(this.shoupai.indexOf(arr[i]) != -1 || !cc.dd._.isNumber(arr[i])){
                    continue;
                }
            }
            if (cc.dd._.isNumber(arr[i])) {
                this.shoupai.push(arr[i]);
            }
        }
        cc.log("座位号:",this.viewIdx," 手牌数:",this.shoupai.length);
    },

    /**
     * 删除手牌中的数据
     * @param arr 为自己方最准备的删手牌
     * @param count 为其他三方删除手牌
     */
    delShouPai:function (arr,count) {
        if(this.userId == cc.dd.user.id || this.replaying){ //自己或回放 删除真正的手牌
            for(var i in arr){
                dd._.pull(this.shoupai,arr[i]);
            }
            this.paixu();
        }else{
            this.shoupai.splice(0,count);
        }
        cc.log("座位号:",this.viewIdx," 手牌数:",this.shoupai.length);
    },
    /**
     * 删除指定id的牌
     */
    delCardToID:function (cardID) {
      for(var i in this.shoupai){
        if(this.shoupai[i] == cardID){
            this.shoupai.splice(i, 1);
            break;
        }
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
        this.baipai_data_list.push(baipai_data);
        this.resetBaiPaiIndex();
        PlayerED.notifyEvent(PlayerEvent.DIANGANG, [this, baipai_data, play_audio]);

    },

    /**
     * 巴杠
     */
    bagang: function (gangcardList, play_audio) {
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
        }.bind(this));
        //服务器默认 巴杠的牌放在最后一个 即:gangIds[3]
        var baipai_data = this.getPengData(BaipaiType.PENG, gangIds[0]);
        if(!baipai_data){
            cc.error("【数据】"+"玩家摆牌数据，没有该碰牌"+pai3d_value.descs(gangIds));
            return;
        }
        var ids = dd._.without(gangIds,baipai_data.cardIds[0],baipai_data.cardIds[1],baipai_data.cardIds[2]);
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
        this.resetBaiPaiIndex();
        PlayerED.notifyEvent(PlayerEvent.BAGANG, [this, baipai_data, play_audio]);
    },

    /**
     * 暗杠
     */
    angang: function (gangcardList, play_audio) {
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
                    cc.error("【数据】"+"暗杠牌列表项为空");
                }
            }.bind(this));

            if(gangIds.length != 4){
                cc.error("【数据】"+"暗牌数目 != 4");
                return;
            }
            if(shoupaiGangCount >= 4){
                cc.error("【数据】"+"暗杠手牌数目不对"+shoupaiGangCount);
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
        PlayerED.notifyEvent(PlayerEvent.ANGANG, [this, baipai_data, play_audio]);
    },


    /**
     * 风杠
     */
    fengGang:function (gangcardList, play_audio) {
        if(!gangcardList){
            cc.error("【数据】"+"风杠牌列表为空");
            return;
        }
        let shoupaiGangCount = 0;
        var idAndCnts = [];
        var cardList = [];
        gangcardList.forEach(function (card) {
            if(card){
                var idAndCnt = {};
                idAndCnt.id = card.id;
                idAndCnt.cnt = 1;
                idAndCnts.push(idAndCnt);
                cardList.push(card.id);
                if(this.getBaipaiDataByid(card.id)){
                    shoupaiGangCount++;
                }
            }else{
                cc.error("【数据】"+"风杠牌列表项为空");
            }
        }.bind(this));
        if(shoupaiGangCount >= idAndCnts.length){
            cc.error("【数据】"+"风杠手牌数目不对"+shoupaiGangCount);
            return;
        }
        this.delShouPai(cardList, idAndCnts.length);
        cc.log("【数据】"+"玩家:"+this.userId, '风杠列表',pai3d_value.descs(cardList));

        var baipai_data = new JLGData();
        baipai_data.type = BaipaiType._FG;
        baipai_data.down_pai_num = cardList.length;
        baipai_data.idAndCnts = idAndCnts;
        baipai_data.cardIds = cardList;
        baipai_data.sortArr();
        this.baipai_data_list.push(baipai_data);
        this.resetBaiPaiIndex();
        PlayerED.notifyEvent(PlayerEvent.FGANG, [this, baipai_data, play_audio]);
    },

    /**
     * 1杠
     */
    _19gang1: function (gangcardList, play_audio) {
        if(!gangcardList){
            cc.error("【数据】"+"19杠牌列表为空");
            return;
        }
        let shoupaiGangCount = 0;
        var idAndCnts = [];
        var cardList = [];
        gangcardList.forEach(function (card) {
            if(card){
                var idAndCnt = {};
                idAndCnt.id = card.id;
                idAndCnt.cnt = 1;
                idAndCnts.push(idAndCnt);
                cardList.push(card.id);
                if(this.getBaipaiDataByid(card.id)){
                    shoupaiGangCount++;
                }
            }else{
                cc.error("【数据】"+"19杠牌列表项为空");
            }
        }.bind(this));
        if(shoupaiGangCount >= 3){
            cc.error("【数据】"+"1杠手牌数目不对"+shoupaiGangCount);
            return;
        }
        this.delShouPai(cardList, 3);
        cc.log("【数据】"+"玩家:"+this.userId, '1杠列表',pai3d_value.descs(cardList));

        var baipai_data = new JLGData();
        baipai_data.type = BaipaiType._19G1;
        baipai_data.down_pai_num = 3;
        baipai_data.idAndCnts = idAndCnts;
        baipai_data.cardIds = cardList;
        baipai_data.sortArr();
        this.baipai_data_list.push(baipai_data);
        this.resetBaiPaiIndex();
        PlayerED.notifyEvent(PlayerEvent._19GANG1, [this, baipai_data, play_audio]);
    },


    /**
     * 9杠
     */
    _19gang9: function (gangcardList, play_audio) {
        if(!gangcardList){
            cc.error("【数据】"+"19杠牌列表为空");
            return;
        }
        let shoupaiGangCount = 0;
        var idAndCnts = [];
        var cardList = [];
        gangcardList.forEach(function (card) {
            if(card){
                var idAndCnt = {};
                idAndCnt.id = card.id;
                idAndCnt.cnt = 1;
                idAndCnts.push(idAndCnt);
                cardList.push(card.id);
                if(this.getBaipaiDataByid(card.id)){
                    shoupaiGangCount++;
                }
            }else{
                cc.error("【数据】"+"19杠牌列表项为空");
            }
        }.bind(this));
        if(shoupaiGangCount >= 3){
            cc.error("【数据】"+"9杠手牌数目不对"+shoupaiGangCount);
            return;
        }
        this.delShouPai(cardList, 3);
        cc.log("【数据】"+"玩家:"+this.userId, '9杠列表',pai3d_value.descs(cardList));

        var baipai_data = new JLGData();
        baipai_data.type = BaipaiType._19G9;
        baipai_data.down_pai_num = 3;
        baipai_data.idAndCnts = idAndCnts;
        baipai_data.cardIds = cardList;//保存所有的 牌的ID
        baipai_data.sortArr();
        this.baipai_data_list.push(baipai_data);
        this.resetBaiPaiIndex();
        PlayerED.notifyEvent(PlayerEvent._19GANG9, [this, baipai_data, play_audio]);
    },

    /**
     * 中发白杠
     */
    zfbgang: function (gangcardList, play_audio) {
        if(!gangcardList){
            cc.error("【数据】"+"中发白杠牌列表为空");
            return;
        }
        let shoupaiGangCount = 0;
        var idAndCnts = [];
        var cardList =[];
        gangcardList.forEach(function (card) {
            if(card){
                var idAndCnt = {};
                idAndCnt.id = card.id;
                idAndCnt.cnt = 1;
                idAndCnts.push(idAndCnt);
                cardList.push(card.id);
                if(this.getBaipaiDataByid(card.id)){
                    shoupaiGangCount++;
                }
            }else{
                cc.error("【数据】"+"中发白杠牌列表项为空");
            }
        }.bind(this));
        if(shoupaiGangCount >= 3){
            cc.error("【数据】"+"中发白杠手牌数目不对"+shoupaiGangCount);
            return;
        }
        this.delShouPai(cardList, 3);
        cc.log("【数据】"+"玩家:"+this.userId, '9杠列表',pai3d_value.descs(cardList));

        var baipai_data = new JLGData();
        baipai_data.type = BaipaiType.ZFBG;
        baipai_data.down_pai_num = 3;
        baipai_data.idAndCnts = idAndCnts;
        baipai_data.cardIds = cardList;
        baipai_data.sortArr();
        this.baipai_data_list.push(baipai_data);

        this.resetBaiPaiIndex();
        PlayerED.notifyEvent(PlayerEvent.ZFBGANG, [this, baipai_data, play_audio]);
    },

    /**
     * 转换杠牌数据 并且去重复
     * isquc 是否去重
     */
    convertData:function (arr, card, isquc) {
        for(var i=0; isquc && i<arr.length; ++i){
            if(Math.floor(arr[i].id/4) == Math.floor(card.id/4)){
                arr[i].cnt += 1;
                return ;
            }
        }
        var idAndCnt = {};
        idAndCnt.id = card.id;
        idAndCnt.cnt = 1;
        if(paiType.S1 == Math.floor(card.id/4)){
            arr.unshift(idAndCnt);
        }else{
            arr.push(idAndCnt);
        }

    },

    checkBugang:function (baiPaidata) {
        if(baiPaidata && baiPaidata.idAndCnts.length<3){
            //剪掉之前小鸡的个数
            var xiaoji = baiPaidata.findXJTwoCnt();
            xiaoji.cnt--;

            var idAndCnt = {};
            idAndCnt.id = baiPaidata.getXiaoJiId();
            idAndCnt.cnt = 1;
            baiPaidata.idAndCnts.push(idAndCnt);
            baiPaidata.sortArr();
        }
    },
    /**
     * 补杠
     * @param bugangcardsList
     */
    bugang:function (msg) {
        if(!msg.bugangcardsList){
            cc.error("【数据】"+"补杠牌列表为空");
            return;
        }
        let shoupaiGangCount = 0;
        var idAndCnts = [];//补杠需要的数据
        var cardIds = [];
        for(var i=0; msg.bugangcardsList && i<msg.bugangcardsList.length; ++i){
            this.convertData(idAndCnts, msg.bugangcardsList[i], true);
            if(msg.bugangcard.id != msg.bugangcardsList[i].id){//去掉补杠新补的牌 才能在摆拍中找到 之前的杠牌数据
                cardIds.push( msg.bugangcardsList[i].id);
            }
        }

        var ccg_data = this.getBaipaiDataByIds(cardIds);//获取数据
        if( !ccg_data ) {
            cc.error( "【补杠】没有找到手牌中被补杠的 杠数据" );
            return ;
        }
        if(this.getBaipaiDataByid(msg.bugangcard.id)){
            shoupaiGangCount++;
        }
        if(shoupaiGangCount >= 1){
            cc.error("【数据】"+"补杠手牌数目不对"+shoupaiGangCount);
            return;
        }
        this.delShouPai([msg.bugangcard.id], 1);
        ccg_data.idAndCnts = idAndCnts;
        cardIds.push(msg.bugangcard.id);
        ccg_data.cardIds = cardIds;

        //检测 小鸡 小鸡 加任意牌的补杠
        this.checkBugang(ccg_data);

        cc.log("【数据】"+"玩家:"+this.userId, '补杠列表',pai3d_value.descs(cardIds));
        ccg_data.down_pai_num =  ccg_data.getShowPaiList().length;

        var tmp_cardIds = [];
        var tmp_idAndCnts = [];
        for(var id = 0; id < ccg_data.cardIds.length; ++id){
            if(Math.floor(ccg_data.cardIds[id]/4)==paiType.S1){
                tmp_cardIds.push(ccg_data.cardIds[id]);
                ccg_data.cardIds.splice(id, 1);
                id--;
            }
        }
        for(var id = 0; id < ccg_data.idAndCnts.length; ++id){
            if(Math.floor(ccg_data.idAndCnts[id].id/4)==paiType.S1){
                tmp_idAndCnts.push(ccg_data.idAndCnts[id]);
                ccg_data.idAndCnts.splice(id, 1);
                id--;
            }
        }
        ccg_data.sortArr();
        ccg_data.cardIds = tmp_cardIds.concat(ccg_data.cardIds);
        ccg_data.idAndCnts = tmp_idAndCnts.concat(ccg_data.idAndCnts);

        ccg_data.sortArr();
        this.resetBaiPaiIndex();
        PlayerED.notifyEvent(PlayerEvent.BUGANG,[this,ccg_data,true,true,msg.bugangcard.id]);
    },

    /**
     * 打宝
     */
    dabao: function() {
        PlayerED.notifyEvent(PlayerEvent.DA_BAO,[this]);
    },

    /**
     * 获取能补杠的杠牌数据
     * @return {}
     */
    isHaveGangData:function (type) {
        for(var i=0; i<this.baipai_data_list.length; ++i){
            if(this.baipai_data_list[i].type == type){
                return true;
            }
        }

        return false;
    },
    /**
     * 查找有没有这个牌
     */
    ishavePai:function (id) {
        for(var i in this.shoupai){
            if(this.shoupai[i] == id){
                return true;
            }
        }
        return false;
    },

    /**
     * 获取碰牌数据中有没有对应类型的碰
     * @param dataType   数据类型
     * @param cardID   牌的类型
     */
    getPengData:function (dataType, cardID) {
        for(var i=0; i<this.baipai_data_list.length; ++i){
            var item = this.baipai_data_list[i];
            if(item.type == dataType && Math.floor(item.cardIds[0]/4) == Math.floor(cardID/4)){
                return item;
            }
        }
        return null;
    },
    /**
     * 获取摆牌数据
     * 传入集合返回 完全匹配的摆牌集合
     * @param ids
     * @returns {*}
     */
    getBaipaiDataByIds: function (ids) {
        for(var i in this.baipai_data_list){
            if(this.baipai_data_list[i].equal(ids)){
                return this.baipai_data_list[i];
            }
        }
        return null;
    },
    /**
       获取摆牌数据
     * 传入牌id 返回包含这个牌的 摆牌集合
     * @param ids
     * @returns {*}
     */
    getBaipaiDataByid: function (id) {
        for(var i in this.baipai_data_list){
            var cardIds = this.baipai_data_list[i].cardIds;
            //删除牌集合中这个牌
            for( var k = 0; k < cardIds.length; ++k ) {
                if( cardIds[k] == id ) {
                    //返回吉林麻将 牌
                    return this.baipai_data_list[i];
                }
            }
        }
        return null;
    },

    /**
     * 获取长春杠数据
     * @param idAndCnts
     */
    getJLGData: function (ccg_type) {
        var ccg_data;
        this.baipai_data_list.forEach(function(item){
            if(item.type == ccg_type){
                ccg_data = item;
            }
        });
        return ccg_data;
    },

    /**
     * 获取摆牌中能飞出去的小鸡个数
     */
    getXiaoJiCnt: function () {
        var sum_cnt = 0;
        for(var i in this.baipai_data_list){
            var baidata = this.baipai_data_list[i];
            if(baidata.isCCG() && baidata.ifXiaoJiFlyed()){
                sum_cnt += baidata.getXiaoJiCnt();
            }
        }
        return sum_cnt;
    },

    /**
     * 获取手牌长度
     */
    getShoupaiCount:function () {
      return this.shoupai.length;
    },
    /**
     * 开牌
     */
    kaipai: function(holdCardList, mopai, hupaiId, duibao) {
        this.state = PlayerState.HUPAI;
        this.shoupai = [];
        for(var i in holdCardList){
            this.pushData(this.shoupai, holdCardList[i].id);
        }
        this.paixu();
        if(mopai&&!duibao){ //对宝时不放摸牌
            this.pushData(this.shoupai, mopai.id);
        }
        if(!cc.dd._.isUndefined(hupaiId)){
            this.pushData(this.shoupai, hupaiId);
        }
        cc.log("【数据】" + "玩家:" + this.userId + " 座位号:" + this.idx + " 开牌" + holdCardList);
        PlayerED.notifyEvent(PlayerEvent.KAIPAI,[this]);
    },

    getBaiPaiNum: function () {
        var baipai_num = 0;
        if(this.baipai_data_list.length>0){
            var last_baipai = this.baipai_data_list[this.baipai_data_list.length-1];
            baipai_num = last_baipai.mj_index + last_baipai.down_pai_num;
        }
        return baipai_num;
    },

    /**
     * 重置摆牌下标
     */
    resetBaiPaiIndex: function() {
        var baipai_index = 0;
        var majiang_index = 0;
        this.baipai_data_list.forEach( function( v ) {
            v.index = baipai_index;
            v.mj_index = majiang_index;

            majiang_index += v.down_pai_num;
            baipai_index += 1;
        } );
    },
    /**
     * 减去摆牌集合内的一张牌
     * 当类型不足三个时要把小鸡拿下来 保证最少有有三个类型
     */
    delCardForBaipai:function (caradID, baipaiData) {
        for(var i in  baipaiData.idAndCnts){
            var paidata = baipaiData.idAndCnts[i];
            if(Math.floor(paidata.id/4) == Math.floor(caradID/4)){//找到相同类型的牌
                if(paidata.cnt>1){
                    --paidata.cnt;
                }else {//个数只有一个时则要删除这个牌型 并且要把小鸡换下
                    if(baipaiData.idAndCnts.length<4){//删除不够时则要小鸡补上
                        //剪掉之前小鸡的个数
                        var xiaoji = baipaiData.findXJTwoCnt();
                        xiaoji.cnt--;
                        paidata.id = baipaiData.getXiaoJiId();
                        baipaiData.sortArr();
                    }else {
                        baipaiData.idAndCnts.splice(i, 1);
                    }
                }
                break;
            }
        }
        baipaiData.down_pai_num =  baipaiData.idAndCnts.length;
    },

    /**
     * 通过牌集合 获取 摆牌类型 1-巴杠 2-补杠
     */
    getCardsType: function( baipai ) {
        if( baipai.idAndCnts ) {
            return 2
        } else {
            return 1;
        }
    },

    /**
     *  被抢后恢复摆牌数据
     */
    removeRobCard_new:function (cardId, robType) {

        var JLData = this.getBaipaiDataByid(cardId);
        if(!JLData){
            cc.error('[数据] 没有找到对应的杠牌集合');
            return;
        }

        var robType = this.getCardsType( JLData );

        dd._.pull( JLData.cardIds, cardId);//删除集合内的牌
        if( robType == 1 ) { //巴杠
            JLData.type = BaipaiType.PENG;
            //JLData.down_pai_num -= 1;
        }else if(robType==2){//补杠
            this.delCardForBaipai(cardId, JLData);
        }

        this.resetBaiPaiIndex();
        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 被抢",cardId);
        PlayerED.notifyEvent(PlayerEvent.REMOVE_ROB_FAILED,[this]);
    },

    clearHeadNearby: function() {
        this.isBaoTing = false;
    },

    play_mid2dapai_action: function (id) {
        PlayerED.notifyEvent(PlayerEvent.PLAY_MID2SHOU_PAI,[this,id]);
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
            var DeskData = require('jlmj_desk_data').DeskData;
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
     * 设置听
     * @param msg
     */
    setCanTing: function(msg) {
        if(!msg.canting || !msg.jiaoinfosList){
            return ;
        }
        this.jiaoInfo_list = [];
        msg.jiaoinfosList.forEach(function (jiaoInfo) {
            var out_id = jiaoInfo.outcard.id;
            var jiaoPai_list = [];
            jiaoInfo.paiinfosList.forEach(function (jiaoPai) {
                jiaoPai_list.push(new JiaoPai(jiaoPai.hucard.id,jiaoPai.fan,jiaoPai.count,jiaoPai.anganghu));
            });
            this.jiaoInfo_list.push(new JiaoInfo(out_id,jiaoPai_list,jiaoInfo.angang));
        },this);
        cc.log("【数据】"+"玩家:"+this.userId+" 座位号:"+this.idx+" 操作菜单:"+"听牌");
        // 菜单显示 延迟到摸牌后
        // PlayerED.notifyEvent(PlayerEvent.CAOZUO,[this]);
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
        return this.canchi||this.canpeng||this.cangang||this.canting||this.canhu|| this.cangu;
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


    changePaiUI:function () {
        PlayerED.notifyEvent(PlayerEvent.CHANGE_PAI_UI,[this]);
    }
});

module.exports = {
    PlayerEvent:PlayerEvent,
    PlayerED:PlayerED,
    PlayerData:PlayerData,
    PlayerState:PlayerState,
};