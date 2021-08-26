var dd = cc.dd;
var pai3d_value = require('jlmj_pai3d_value');

/**
 * 事件类型
 */
var DeskEvent = cc.Enum({
    UPDATE_ROOM_NUM: "UPDATE_ROOM_NUM",    // 更新房号
    UPDATE_REMAIN_CARD: "UPDATE_REMAIN_CARD", // 更新剩余牌数量
    UPDATE_CURR_ROUND: "UPDATE_CURR_ROUND",  // 更新当前圈数
    UPDATE_TOTAL_ROUND: "UPDATE_TOTAL_ROUND", // 更新总共圈数
    UPDATE_PLAYER_NUM: "UPDATE_PLAYER_NUM",  // 更新玩家数量

    INIT: "jlmj_desk_init",              //桌子初始化
    OPEN_ZSQ: "jlmj_desk_open_zsq",          //打开麻将指示器
    CLOSE_ZSQ: "jlmj_desk_close_zsq",         //关闭麻将指示器
    OPEN_CHI: 'jlmj_desk_open_chi',          //展开吃选项
    OPEN_CHITING: 'jlmj_desk_open_chiting',   //展开吃听选项
    OPEN_GANG: 'jlmj_desk_open_gang',         //展开杠选项
    CLEAN_SHOW: 'jlmj_desk_clean_show',        //显示取消按钮
    OK_SHOW: 'jlmj_desk_ok_show',           //显示确认按钮
    SHOW_UP_LISTBTN: 'jlmj_desk_show_up_list',      //显示上一层按钮列表
    LEFT_PAI_NUM: 'jlmj_desk_left_pai_num',      //剩余牌数

    JIESUAN: 'jlmj_desk_jiesuan',           //结算
    ZONGJIESUAN: 'jlmj_desk_zongjiesuan',       //总结算
    CLEAR: 'jlmj_desk_clear',             //清理桌子
    START: 'jlmj_desk_start',             //开始
    CLOSE_MENU: 'jlmj_desk_close_menu',        //关闭操作菜单
    CANCEL_EMIT: 'jlmj_desk_cancel_emit',       //切换后台主动点击取消
    RECTCONNECT: 'jlmj_desk_restConnect',        //重连成功

    LEAVE_TIPS: 'jlmj_desk_leave_tips',             //离开房间提示
    SPONSOR_DISSOLVE_ROOM: 'jlmj_desk_sponsor_dissolve_room',  //发起解散房间
    RESPONSE_DISSOLVE_ROOM: 'jlmj_desk_response_dissolve_room', //响应解散房间
    DISSOLVE_ROOM: 'jlmj_desk_dissolve_room',          //直接离开房间
    EXIT_ROOM: 'jlmj_desk_exit_room',              //直接退出房间
    CREATE_ROOM: 'jlmj_create_room',            //创建房间
    JOIN_ROOM: 'jlmj_join_room',              //加入房间
    RECOVER: 'jlmj_recover',                //中途恢复
    RECOVER_DESK: 'jlmj_recover_desk',           //恢复桌子
    RECOVER_PLAYER: 'jlmj_recover_player',         //恢复玩家
    LOCK_SCENE: 'jlmj_lock_scene_touch',       // 锁住场景触摸
    UNLOCK_SCENE: 'jlmj_unlock_scene_touch',     // 解锁场景触摸
    SHOW_RESULT_VIEW: 'jlmj_show_result_view',      //显示结算视图
    FEN_ZHANG: 'jlmj_fen_zhang',              //荒庄前的分张
    MO_PAI_FEN_ZHANG: 'jlmj_mo_pai_fen_zhang',      //摸牌分张

    RECV_PAIQIANG: 'jlmj_desk_mopai_rest_init',  //断线重连时牌墙的重置
    MO_PAI_ACT: 'jlmj_desk_mopai_act',        //摸牌时牌墙上的动画事件
    MO_HUAN_BAO_PAI: 'jlmj_desk_mo_huan_bao',      //摸宝 或者是换宝
    NO_MARK_TIPS: 'jlmj_desk_no_mark_tips',     //没有分数的玩家点炮提示

    TIPS_POP: 'jlmj_desk_tips_pop',        //提示圈数  连庄
    DESK_FAPAI_ACT: 'jlmj_desk_faipai',           //一步一步发牌动画

    CHANGE_DESK_IMAGE: 'jlmj_change_desk_image',    //跟换桌布
    TUO_GUAN: 'jlmj_desk_tuo_guan',        //托管

    CLOSE_LEAVE_TIPS: "close_leave_tips", //关闭离开tips

    GAME_OPENING: "GAME_OPENING", //底分显示隐藏

    INIT_ZHINAN: "INIT_ZHINAN", // 初始化指南
    FAPAI: "jlmj_desk_fapai", // 发牌

    BIAOJI_BAOPAI: "jlmj_desk_biaoji_baopai", // 标记宝牌
    DA_BAO: 'jlmj_desk_da_bao',            //打宝
    CHANGE_BAO: 'jlmj_desk_change_bao',        //换宝
    UPDATE_BAO_PAI: "UPDATE_BAO_PAI",     // 更新宝牌值
    OPEN_BAO_PAI: "OPEN_BAO_PAI",       //打开宝牌
    HUANG_ZHUANG_ANI:"HUANG_ZHUANG_ANI", //荒庄动画

    JBC_READY:"jbc_ready",//金币场准备
    PY_READY:"py_ready",//朋友场准备
    CHANGE_ROOM:"change_room",//换桌

    SHOW_DA_PAI_PROMPT:"shwo_da_pai_prompt",//打牌提示
    TIMEUP:"mj_time_up",//时间警报
    STOP_TIMEUP:"mj_stop_time_up",//停止时间警报

    CHECK_HUAN_3_ZHANG:"mj_check_huan_3_zhang",//检查换3张条件
    SCJ_SHAIZI:"scmj_shaizi",//四川麻将骰子,
    STOP_SCJ_SHAIZI:"scmj_stop_shaizi",//停止四川麻将骰子

    CHANGE_2D:"mj_change_2d",//2d,2.5d切换
    DUIJU_START:"scmj_duiju_kaishi",//对局开始动画,
    HU:"scmj_hu",//川麻胡牌
    PO_CHAN:"scmj_po_chan",//川麻破产

    OPEN_BAO_OPTION:"shmj_open_bao_option",//绥化麻将亮掌宝选项

    SHOW_PAO_FEN:"tdhmj_show_pao_fen",//巷乐推倒胡跑分
});

/**
 * 事件管理
 */
var DeskED = new dd.EventDispatcher();

const GameState = {
    NoStart: 1,
    Start: 2,
}

var mjComponentValue = null;

var DeskData = cc.Class({

    s_desk: null,

    statics: {

        Instance: function () {
            if (!this.s_desk) {
                this.s_desk = new DeskData();
            }
            return this.s_desk;
        },

        Destroy: function () {
            if (this.s_desk) {
                this.s_desk.clear();
                this.s_desk = null;
            }
        },

    },

    /**
     * 构造
     */
    ctor: function () {
        mjComponentValue = this.initMJComponet();
        this.require_playerMgr = require(mjComponentValue.playerMgr);
        this.require_JieSanData = require(mjComponentValue.jieSanData).JieSanData.Instance();

        this.owner= 0; //房主
        this.userCountLimit= 0;  //玩家数量
        this.last_chupai_id= null;   //最后的出牌
        this.first_da_bao= true; //第一次打宝
        this.gameId= null;   //游戏ID
        this.createOrJoin= null; // 创建房间或加入房间 1创建 2加入
        this._TongjiData= null;  //战绩统计数据
        this.desk_dissolved= false;  //桌子是否解散

        this.isGameStart = false;
        // 1=正常连接（默认） 2=断线重连
        this.isReconnect = 0;
        // 房主ID
        this.owner = null;
        // 游戏所处状态:1.未开始 2.已开始
        this.gameStatus = GameState.NoStart;
        // 朋友桌: 当前第几局
        this.currPlayCount = 0;
        // 朋友桌: 总共几局
        this.totalPlayCount = 0;
        // 房间号
        this.roomNumber = '';
        // 还剩几张麻将牌
        this.remainCards = this.getMJRemainCard();
        //牌尾摸咯多少张牌  只在断线重连有用
        this.endEmpty = 0;
        // 庄家
        this.banker = 0;
        // 宝牌
        this.unBaopai = -2;

        this.isFenZhang = false;
        //暂时定在这
        this.isXiaoJiFeiDan = false;
        this.isUseYaoJiu = false;
        this._dissRoomData = [];

        // flag 是否结束比赛
        this.isGameEnd = false;

        //是否最后一局
        this.isDajiesuan = false;

        // 是否胡牌
        this.isHu = false;
        // 是否播放胡牌动画
        this.isPlayHuAni = false;
        // 结算数据
        this.jiesuanData = null;


        // 是否第一次摸牌 (用于牌墙|和牌发牌动画的赋值)
        this.m_bFirstMoPai = false;
        // 第一次overturn来了的数据
        this.m_objOverturnMsg = null;

        // 是否开局
        this.m_bIsStart = false;

        //打包中
        this.dabaoing = false;
    },

    /**
     * 清理桌子
     */
    clear: function () {
        // 1=正常连接（默认） 2=断线重连
        this.isReconnect = 0;

        // 房主ID 需要一直留着
        // this.owner = null;

        // 游戏所处状态:1.未开始 2.已开始
        this.gameStatus = GameState.NoStart;
        // // 朋友桌: 当前第几局   不能清理
        // this.currPlayCount = 0;
        // 朋友桌: 总共几局
        // this.totalPlayCount = 0;
        // 房间号
        // this.roomNumber = '';
        //牌尾摸咯多少张牌
        this.endEmpty = 0;
        // 庄家
        this.banker = 0;

        this.isFenZhang = false;

        this.last_chupai_id = null;
        this.setRemainCard(this.getMJRemainCard());
        this.setBaoPai(-2);
        this.first_da_bao = false;
        this._dissRoomData = [];
        this.sendCard = null;
        // this.isGameEnd = false;//游戏是否结束

        // 是否第一次摸牌 (用于牌墙|和牌发牌动画的赋值)
        this.m_bFirstMoPai = false;
        // 第一次overturn来了的数据
        this.m_objOverturnMsg = null;

        this.jiesuanData = null;
        this.isDajiesuan = false;
        this.isGameEnd = false;

        //打包中
        this.dabaoing = false;

        this.waitJiesuan = false;

        DeskED.notifyEvent(DeskEvent.CLEAR, [this]);
    },

    /*
     * 设置房主
     */
    setOwner: function (ownerId) {
        if (!ownerId)
            return;

        this.owner = ownerId;

        var player = this.require_playerMgr.Instance().getPlayer(this.owner);
        if (player)
            player.setIsOwner(true);
    },

    /*
     * 设置房号
     * @param roomNum 房号
     */
    setRoomNum: function (roomNum) {
        if (!roomNum)
            return;

        this.roomNumber = roomNum;
        DeskED.notifyEvent(DeskEvent.UPDATE_ROOM_NUM, []);
    },

    /*
     * 设置剩余牌数
     * @param cardNum 牌数量
     */
    setRemainCard: function (cardNum) {
        if (cc.dd._.isNull(cardNum))
            return;

        this.remainCards = cardNum;
        DeskED.notifyEvent(DeskEvent.UPDATE_REMAIN_CARD, []);
    },

    /**
     * 设置宝牌
     * @param baoPaiValue 宝牌的值
     */
    setBaoPai: function (baoPaiValue) {
        this.unBaopai = baoPaiValue;
        cc.log("setBaoPai 宝牌值:", baoPaiValue);
        // DeskED.notifyEvent(DeskEvent.UPDATE_BAO_PAI, []);
    },

    /**
     * 设置当前圈数
     * @param currValue 当前圈数
     */
    setCurrRound: function (currValue) {
        if (currValue && this.gameStatus != GameState.NoStart && !this.isJBC()) {
            this.currPlayCount = currValue;
            DeskED.notifyEvent(DeskEvent.UPDATE_CURR_ROUND, [currValue]);
        }
    },
    /**
     * 设置是否有连庄
     */
    setLianzhuang: function (userID) {
        if (userID > 0) {
            var player = this.require_playerMgr.Instance().getPlayer(userID);
            if (player) {
                var str = cc.dd.Text.TEXT_DESK_INFO_2.format([cc.dd.Utils.substr(player.nickname, 0, 5)]);
                DeskED.notifyEvent(DeskEvent.TIPS_POP, str);
            }
        }
    },
    /**
     * 设置总圈数
     */
    setTotalRound: function (totalValue) {
        if (!totalValue)
            return;

        this.totalPlayCount = totalValue;
        DeskED.notifyEvent(DeskEvent.UPDATE_TOTAL_ROUND, []);
    },



    /**
     * 设置是否开局
     * @param value
     */
    setIsStart: function( value ) {
        this.m_bIsStart = value;
    },

    /**
     * 获取是否开局
     * @returns {boolean|*}
     */
    getIsStart: function() {
        return this.m_bIsStart;
    },

    /**
     * 设置是否第一次摸牌
     * @param bool {boolean}
     */
    setFirstMoPai: function( bool ) {
        this.m_bFirstMoPai = bool;
    },

    /**
     * 获取是否第一次摸牌
     */
    getFirstMoPai: function() {
        return this.m_bFirstMoPai;
    },

    /**
     * 设置第一次overturn数据
     * @param msg
     */
    setFirstOverturn: function( msg ) {
        this.m_objOverturnMsg = msg;
    },

    /**
     * 获取第一次overturn数据
     */
    getFirstOverturn: function() {
        return this.m_objOverturnMsg;
    },

    /**
     * 设置房间规则
     */
    setDeskRule: function (msg, gamestatus) {
        if (!msg)
            return;

        let rule = msg.createcfg;
        if(!rule){
            for(let k in msg.rule){
                if(msg.rule[k]){
                    rule = msg.rule[k];
                    break;
                }
            }
        }

        this.beishu = rule.guangguotype;//逛锅-
        this.isDianPaoSanJia = rule.isdianpaosanjia; //是否点炮包三家
        this.isUseYaoJiu = rule.isuseyaojiu; // 是否有幺九蛋-
        this.isXiaoJiFeiDan = rule.isxiaojifeidan; // 是否小鸡飞蛋-
        this.isKuaiBao = rule.iskuaibao; // 是否快宝
        this.isKuaiGuo = rule.iskuaiguo; // 是否快锅
        this.isXiaoJiWanNeng = rule.isxiaojiwanneng; // 是否小鸡万能宝-
        this.isYaoJiuSanSe = rule.isyaojiusanse; // 是否幺九蛋顶三色-
        this.isUnCheat = rule.isuncheat;	//是否防作弊-gps
        this.payType = rule.paytype; //房费支付模式
        // this.setGameRule();

        this.userCountLimit = rule.usercountlimit;
        if (gamestatus) {
            // 游戏所处状态: 0.未开始 1.已开始
            this.gameStatus = gamestatus;
        }
        this.setTotalRound(rule.boardscout);//总圈数--

        this.setOwner(msg.owner); //房主
        this.setRoomNum(msg.passwrod);//房间号
        var currRound = msg.currcircle || 1;//当前圈数
        this.setCurrRound(currRound);

        this.setBaoPai(-2);
        this.isReconnect = 1;
        this.desk_dissolved = false;
        DeskED.notifyEvent(DeskEvent.INIT, [this]);
    },

    // 设置恢复数据
    // ==================
    // @param data [object] 网络层发来的数据
    setRecoverData: function (data) {
        if (!data) {
            return;
        }
        // param value 1=正常连接（默认） 2=断线重连
        this.isReconnect = 2;
        // 游戏所处状态: 1.未开始 2.已开始
        this.gameStatus = data.gamestatus;
        this.endEmpty = data.lastoutnum;
        // 还剩几张麻将牌
        this.setRemainCard(data.remaincards);
        // 庄家
        this.banker = data.banker;
        // 宝牌
        this.setBaoPai( data.unbaopai );
    },
    getBanker: function (userid) {
        return userid == this.banker;
    },
    /**
     * 开始游戏
     */
    startGame: function () {
        this.gameStatus = GameState.Start;
        DeskED.notifyEvent(DeskEvent.START, [this]);
    },

    /**
     * 打宝
     * @param msg
     */
    dabao: function (msg) {
        var userDaBao = dd.user.id == msg.userid;
        if (msg.card!=null) {
            this.setBaoPai(msg.card)
        }

        this.require_playerMgr.Instance().getPlayerList().forEach(function (player) {
            if(player){
                player.clearCtrlStatus();
            }
        });

        cc.log("【数据】" + "用户:" + msg.userid + " 打宝" + (this.unBaopai >= 0) ? pai3d_value.desc[this.unBaopai] : "");
        DeskED.notifyEvent(DeskEvent.DA_BAO, [this, userDaBao]);
        this.first_da_bao = false;
        this.dabaoing = true;
    },

    /**
     * 换宝
     * @param msg
     */
    changebao: function (msg) {
        if (msg.card) {
            this.setBaoPai(msg.card);
        }
        cc.log("【数据】" + " 换宝" + this.unBaopai ? pai3d_value.desc[this.unBaopai] : "");
        DeskED.notifyEvent(DeskEvent.CHANGE_BAO, [this,msg.num]);
        this.dabaoing = true;
    },

    /**
     * 结算
     * @param msg
     */
    jiesuan: function (msg) {
        cc.log('【数据】普通结算 开始',this.isPlayHuAni);
        if(msg){
            this.isDajiesuan = msg.isend;
            this.isGameEnd = msg.isend;
        }
        if( this.isPlayHuAni ) {
            if(!cc.dd._.isUndefined(msg) && !cc.dd._.isNull(msg)){
                this.jiesuanData = msg;
            }
            return ;
        }
        if( msg == null ) {
            msg = this.jiesuanData;
        }
        if( this.jiesuanData == null && msg == null ) {
            return;
        }

        if(this.jiesuanData){
            this.jiesuanMsg = this.jiesuanData;
        }

        //处理玩家分数
        var userInfo = msg.playercoininfoList;
        for (var i in userInfo) {
            this.require_playerMgr.Instance().setUserPlayerCoin(userInfo[i].userid, userInfo[i].nowscore);
        }
        DeskED.notifyEvent(DeskEvent.JIESUAN, [msg]);
        cc.log('【数据】普通结算 结算');
    },


    // 发起解散房间
    // --------------------------------
    // @param msg [object] 网络层发来的数据
    sponsorDissolveRoom: function (msg) {
        var text = "【数据】发起解散房间 ";
        if (!msg.sponsorid) {
            cc.error(text + "发起解散用户ID为null");
        } else if (!msg.useridList) {
            cc.error(text + "发起解散散用户ID为null");
        } else if (!msg.countdown) {
            cc.error(text + "倒计时为null");
        }
        this.require_JieSanData.setJieSanData(msg);
        DeskED.notifyEvent(DeskEvent.SPONSOR_DISSOLVE_ROOM, [msg]);
    },

    // 响应解散房间
    // --------------------------------
    // @param msg [object] 网络层发来的数据
    responseDissolveRoom: function (msg) {
        this.require_JieSanData.updateUserAgree(msg);
        DeskED.notifyEvent(DeskEvent.RESPONSE_DISSOLVE_ROOM, [msg]);
    },

    // 直接解散房间
    // --------------------------------
    // @param msg [object] 网络层发来的数据
    dissolveRoom: function (msg) {
        if (!msg.bankerid && msg.bankerid != 0) {
            cc.error("【数据】房主解散房间房主Id为null");
        }

        this.desk_dissolved = true;
        DeskED.notifyEvent(DeskEvent.DISSOLVE_ROOM, msg);
    },

    // 直接退出房间
    // --------------------------------
    // @param msg [object] 网络层发来的数据
    exitRoom: function (msg) {
        if (!msg.exitid) {
            cc.error("【数据】退出房间玩家exitid为null");
        }
        DeskED.notifyEvent(DeskEvent.EXIT_ROOM, msg);
    },

    //锁定场景触摸
    lockScene: function () {
        DeskED.notifyEvent(DeskEvent.LOCK_SCENE, []);
    },

    unlockScene: function () {
        DeskED.notifyEvent(DeskEvent.UNLOCK_SCENE, []);
    },

    setisFenzhangMopai: function () {
        if (this.isFenZhang) {
            cc.log('【数据】发送分张摸牌消息 ');
            DeskED.notifyEvent(DeskEvent.MO_PAI_FEN_ZHANG);
        }
    },
    fenzhang: function () {
        this.isFenZhang = true;
        cc.log('【数据】设置分张摸牌状态 ');
        DeskED.notifyEvent(DeskEvent.FEN_ZHANG, []);
        DeskED.notifyEvent(DeskEvent.SHOW_DA_PAI_PROMPT, [-2,false]);
    },

    /**
     * 显示结算视图
     */
    showResultView: function (data) {
        cc.log('【数据】战绩结算 ');
        this._TongjiData = data;
        var userInfo = data.resultuserinfoList;
        for (var i = 0; userInfo && i < userInfo.length; ++i) {
            var user = this.require_playerMgr.Instance().getPlayer(userInfo[i].userid)
            if (user) {
                userInfo[i].username = user.nickname;//找到名字
                userInfo[i].sex = user.sex;
                userInfo[i].viewIdx = user.idx;
                if (this.owner === user.userId) {
                    userInfo[i].owner = true;
                } else {
                    userInfo[i].owner = false;
                }
            }
        }
        //获得房间号
        data.roomNum = this.roomNumber;
        //解散时收到结算消息打开结算界面
        // if(this.require_JieSanData.isAllAgree()){
        //     DeskED.notifyEvent( DeskEvent.SHOW_RESULT_VIEW );
        // }
        if(!this.isReplay()){
            DeskED.notifyEvent( DeskEvent.SHOW_RESULT_VIEW );
        }
    },
    getTongjiData: function () {
        return this._TongjiData;
    },
    /**
     *  成功进入场景后 恢复场景
     */
    enterSceneRecoverDesk: function (endcall) {
        // 正常连接
        if (this.isReconnect == 2) {
            if (endcall) {
                endcall();
            }
            this.setCurrRound(this.currPlayCount);
            //需要断线重连时
            //初始化牌墙
            var user = this.require_playerMgr.Instance().getPlayer(this.banker);
            if (user) {
                user.setBank();
                DeskED.notifyEvent(DeskEvent.RECV_PAIQIANG, [user.viewIdx, this.remainCards, this.endEmpty]);
                DeskED.notifyEvent(DeskEvent.MO_HUAN_BAO_PAI, [this.unBaopai, null]);
            }
        }
    },

    closePopTips: function() {
        DeskED.notifyEvent(DeskEvent.CLOSE_LEAVE_TIPS);
    },


    getIs2D(){
        let use2D = cc.sys.localStorage.getItem(cc.dd.AppCfg.GAME_ID + '_' + cc.dd.user.id + '_use2D');
        if(!cc.dd.mj_current_2d){
            cc.dd.mj_current_2d = cc.dd._.isNull(use2D) ? 'false' : use2D;
        }

        if(cc.dd.mj_change_2d_next_time) {
            return cc.dd.mj_current_2d === 'true';
        }else{
            return use2D === 'true';
        }
    },

    get2DPai(){
        return null;
    },

    isHunPai(id){
      return false;
    },

    /**
     * 是否还有剩余牌
     * @returns {boolean}
     */
    hasRemainPai: function () {
        cc.log("-----------------------no implements base_mj_desk_data hasRemainPai-----------------------")
        return false;
    },
    /**
     * 设置默认麻将牌数
     */
    getMJRemainCard(){
        cc.log("-----------------------no implements base_mj_desk_data getMJRemainCard-----------------------")
        return 138
    },
    /**
     * 是好友房
     * @returns {boolean}
     */
    isFriend: function () {
        cc.log("-----------------------no implements base_mj_desk_data isFriend-----------------------")
        return false;
    },
    /**
     * 是回放
     * @returns {boolean}
     */
    isReplay: function () {
        cc.log("-----------------------no implements base_mj_desk_data isReplay-----------------------")
        return false;
    },
    /**
     * 是金币场
     * @returns {boolean}
     */
    isJBC: function () {
        cc.log("-----------------------no implements base_mj_desk_data isJBC-----------------------")
        return false;
    },
    /**
     * 是比赛场
     * @returns {boolean}
     */
    isMatch: function () {
        cc.log("-----------------------no implements base_mj_desk_data isMatch-----------------------")
        return false;
    },
    /**
     * 在麻将场景
     * @returns {boolean}
     */
    isInMaJiang: function () {
        cc.log("-----------------------no implements base_mj_desk_data isInMaJiang-----------------------")
        return false;
    },

    /**
     * 胡牌动画排序
     * @returns {Array}
     */
    getHuList(){
        cc.log("-----------------------no implements base_mj_desk_data getHuList-----------------------")
        return [];
    },

    /**
     * 自摸动画排序
     * @returns {Array}
     */
    getZimoList(){
        cc.log("-----------------------no implements base_mj_desk_data getZimoList-----------------------")
        return [];
    },

    getHuAnimInfo(huType, isZimo){
        cc.log("-----------------------no implements base_mj_desk_data getHuAnimInfo-----------------------")
        return null;
    },

    initMJComponet(){
        cc.log("-----------------------no implements base_mj_desk_data initMJComponet-----------------------")
        return require("mjComponentValue").base_mj;
    }
});

module.exports = {
    DeskEvent: DeskEvent,
    DeskED: DeskED,
    DeskData: DeskData,
};
