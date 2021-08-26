var dd = cc.dd;
var data_zhajinhuaRoom = require('zhajinhuaRoom');
var game_room = require( "game_room" );
var HallPropData= require('hall_prop_data').HallPropData.getInstance();

const onePlayerOpTime = 10 //单个玩家操作时间

var ZjhManager = cc.Class({

    _instance: null,

    statics: {
        Instance: function () {
            if (!this._instance) {
                this._instance = new ZjhManager();
            }
            return this._instance;
        },

        Destroy: function () {
            if (this._instance) {
                this._instance = null;
            }
        },

    },
    properties: {
        m_nGameFlag: 0,
        m_ZJHState: -1,
    },


    initArgs:function(){
        cc.log("@@@@init zjh");
              //控制manger
        this.m_nGameFlag = 0;      //游戏控制
              
        //数据data
        this.m_nRoomType = 0;     //房间类型
        this.m_nGameState = 0;    //游戏状态
        this.m_nGameStartTime = 0;     //游戏某个状态的开始时间
        this.m_playerList = [];    //玩家列表
        this.m_nBankerSite = 0;     //庄家位置
        this.m_nOpSite = 0;     //操作玩家位置
        this.m_nGameRound = 0;     //游戏轮数
        this.m_nTatolclips = 0;     //桌面总筹码
        this.m_nMinclips = 0;     //房间当前底筹码
        // this.m_nRoomLowClip = 0;     //房间初始底注
        this.m_nAddBetList = [];    //加注倍数列表
        this.m_nMineSite = -1;    //自己的位置
        this.m_sitePlayList = [];    //每局玩的玩家位置列表
        this.m_leaveList = [];    //离开玩家列表
        this.m_giveupList = [];    //弃牌玩家列表

        this.m_tResultData = [];    //游戏结果
        this.m_tOpData = [];    //中途操作数据
        this.m_canlooksitelist = [];    //可以看牌位置
        this.m_compareAllList = [];    //孤注一掷玩家表

        this.m_nMaxPlayer = 5;
        this.m_nRoundMax = 0;

        this.m_nPlayerCount = 0;   //当前局玩的玩家数
        this.m_playGoldData = [];

        //音效数据
        this.m_AddBetPlayer = null;   //加注玩家
        this.m_bAdd = false;
    },

    ctor: function () {
        // this.ZJHED = new dd.EventDispatcher();
        // this.ZJHEvent = cc.Enum({
        //     ENTER_GAME: "ENTER_GAME",                       // 进入游戏


        // });

        this.SexManOrWuman = cc.Enum(
            {
                WUMAN: 0,
                MAN: 1,
            });


        this.ZJHSTATE = cc.Enum({
            ZJH_STATE_NONE: 0,   //初始状态
            ZJH_STATE_HALL: 1,   //切换到大厅
            ZJH_STATE_GAME: 2,   //切换到游戏中
        });

        this.GameFlag = cc.Enum(
            {
                playerquite: 1,      //玩家退出
                playerjoinGame: 2,      //刷新加入游戏玩家
                gamestate: 3,      //游戏状态改变
                playerEnterRoom: 4,      //玩家进入房间
                enterRoom: 5,      //自己刚进入房间
                playerReady: 6,      //玩家准备状态
                disCard: 7,      //发牌刷新
                lookCard: 8,      //看牌刷新
                betFresh: 9,      //跟注刷新
                payorgetGold: 10,     //更新充值或是领取奖励
                quiteGame: 11,     //自己请求退出房间
                nextOpSite: 12,     //下一个操作玩家
                giveupCard: 13,     //弃牌
                comparecard: 14,     //比较牌
                guzhuyizhi: 15,     //孤注一掷
                calcstate: 16,     //结算游戏
                collectcost: 17,     //铺底和扣除房费
                autoAddClip: 18,     //自动补充筹码
                playGold: 19,     //打赏
                selfAutoChips:20,    //自己补充筹码返回 
            });

        this.ZJHRoomState = cc.Enum(
            {
                wait: 0, //等待
                ready: 1, //准备
                opt: 2, //操作
                calc: 3, //结算

            });

        this.ZJHOptType = cc.Enum(
            {
                discard: 0, //弃牌
                lookcard: 1, //看牌
                dobet: 2, //下注
                comcard: 3, //比牌 (compare card)
                dobetall: 4, //孤注一掷(show hand)
            });

        this.ZJHCardType = cc.Enum(
            {
                high_car: 1,    //高牌 不符合下面任何一种牌型的牌型，由单牌且不连续不同花的组成
                one_pair: 2,    //对子 一对加上1张杂牌 
                straight: 3,    //顺子 三张牌连张，至少一张花色不同
                flush: 4,    //金花 三张牌花色相同，但是不成顺子 
                straight_flus: 5,     //顺金 由三张连张同花色的牌组成 　　
                Leopard: 6,     //豹子 由三张点数相同的牌组成 
            });

        this.PlayerStateType = cc.Enum(
            {
                notready: 0,   //0未准备 或 未参赛
                ready: 1,   //准备
                wait: 2,   //等待
                option: 3,   //操作
                discard: 4,   //弃牌
            });

        this.CardStateType = cc.Enum(
            {
                lock_card: 0,   //暗牌
                unlock_card: 1,   //明牌
                complose: 3,   //比牌输
                winguzhuwin: 4,   //孤注一掷胜利
            });

    },

    getMaxPlayer: function () {
        return this.m_nMaxPlayer
    },

    setRoomType: function (roomtype) {
        this.m_nRoomType = roomtype
    },

    getRoomType: function () {
        return this.m_nRoomType
    },

    getPlayType:function(){
        return 500 + this.m_nRoomType
    },

    quitGame: function () {
        // GameStateControl:SetGameState(GameStateControl.GameState.HOME)
        this.setZJHState(this.ZJHSTATE.ZJH_STATE_NONE);
        // if (this.getGameFlag(this.GameFlag.quiteGame) == false) {
        //     var texttips = ""
        //         var data =  game_room.getItem(function (element) {
        //             if(element.key == this.getPlayType())
        //                 return true;
        //             else
        //                 return false;
        //         }.bind(this));
        //        if(HallPropData.getCoin() <data.entermin ){
        //           texttips = false
        //        }else{
        //           texttips = "您因长时间未操作被踢出房间"
        //        }
        //        cc.dd.PromptBoxUtil.show(texttips);
        //     //    Win{wManager:GetWin{w(CHallWin{w):Enter21PointWin{w(GameStateControl.GameState.ZJH.gameID,texttips)
        // }
        
        this._instance = null
    },
    //////////////////////////////////////////////////////////////
    //////////-服务器下发协议处理部分////////////////////////////-
    //////////////////////////////////////////////////////////////
    roomInfo: function (msg) {
        this.m_nRoomType = msg.roomType
        this.m_nGameState = msg.roomState
        this.m_nGameStartTime = msg.stateBeginTime
        this.m_playerList = msg.playersList
        this.m_nBankerSite = msg.bankerSite
        this.m_nOpSite = msg.opSite
        this.m_nGameRound = msg.round
        this.m_nTatolclips = msg.tatolClips
        this.m_nMinclips = msg.minClips
        this.m_nTimer = msg.remainTime

        //
        if (this.m_nGameState <= this.ZJHRoomState.ready) {
            this.m_nMinclips = data_zhajinhuaRoom.items[this.m_nRoomType - 1].bet_min
        }
        // this.m_nRoomLowClip = data_zhajinhuaRoom.items[this.m_nRoomType - 1].bet_rate
        this.m_nAddBetList = data_zhajinhuaRoom.items[this.m_nRoomType - 1].jiazhu.split(";")
        this.m_nRoundMax = data_zhajinhuaRoom.items[this.m_nRoomType - 1].round_max
        //
        this.setUISiteSortList()
        this.getChipValue()
        //
        this.setGameFlag(this.GameFlag.enterRoom, true)
        if (this.m_nGameState > this.ZJHRoomState.ready) { 
            this.setPlayerSiteList()
            this.m_nOptimer = msg.remainTime
        }

        this.setZJHState(this.ZJHSTATE.ZJH_STATE_GAME);
        // this.ZJHED.notifyEvent(this.ZJHEvent.ENTER_GAME, null);
    },

    setZJHState: function (state) {
        if (this.m_ZJHState == state) {
            dd.NetWaitUtil.close();
            return;
        }
        this.m_ZJHState = state;
        switch (state) {
            case this.ZJHSTATE.ZJH_STATE_HALL:
                cc.dd.SceneManager.replaceScene("kuaileba_hall");
                break;
            case this.ZJHSTATE.ZJH_STATE_GAME:
                cc.dd.SceneManager.replaceScene("zjh_game");
                break;
            case this.ZJHSTATE.ZJH_STATE_NONE:
                cc.dd.SceneManager.replaceScene("kuaileba_hall");
                break;
        }

        setTimeout(function () {
            cc.dd.NetWaitUtil.close();
            cc.dd.NetWaitUtil.smooth_close();
        }.bind(this), 1000);
    },

    ////////////////////////////////////////////////////////////
    //相关函数
    //界面ui位置顺序
    setUISiteSortList: function () {
        if (this.m_playerList.length == 0) {
            return
        }
        this.m_uisiteSortList = []
        var minesite = this.getMineSite()
        if (minesite == null) {
            return
        }
        for (var k = minesite; k <= this.m_nMaxPlayer; k++) {
            // table.insert(this.m_uisiteSortList,k)
            this.m_uisiteSortList.push(k);
        }
        for (var k = 1; k <= minesite - 1; k++) {
            // table.insert(this.m_uisiteSortList,k)
            this.m_uisiteSortList.push(k);
        }
    },

    //0开始
    getUISiteSortList: function () {
        return this.m_uisiteSortList
    },

    isMinePlayer: function (player) {
        if (player.playerId == cc.dd.user.id) {
            return true
        }
        return false
    },

    getMineSite: function () {
        if (this.m_nMineSite != -1) { return this.m_nMineSite }
        for (var k = 0; k < this.m_playerList.length; k++) {
            var player = this.m_playerList[k];
            if (player.playerId == cc.dd.user.id) {
                this.m_nMineSite = player.site
                return this.m_nMineSite
            }
        }
        return null
    },

    getMineData: function () {
        for (var k = 0; k < this.m_playerList.length; k++) {
            var player = this.m_playerList[k];
            if (player.playerId == cc.dd.user.id) {
                return player
            }
        }
        return null
    },

    getPlayerBySite: function (site) {
        for (var k = 0; k < this.m_playerList.length; k++) {
            var player = this.m_playerList[k];
            if (player.site == site) {
                return player
            }
        }
        return null
    },

    getPlayerList: function () {
        return this.m_playerList
    },

    getGameState: function () {
        return this.m_nGameState
    },

    setGameState: function (state) {
        //.zjh need {
        if (state <= this.ZJHRoomState.ready && this.m_nGameState == this.ZJHRoomState.calc) {
            this.resetPlayerData()
            this.cleanResulteData()
            this.setRoomTotalClip(0)
            this.cleanCanSite()
            this.m_nGameRound = 0
            this.m_nOpSite = 0      //操作玩家位置
            //重新初始押注
            this.m_nMinclips = data_zhajinhuaRoom.items[this.m_nRoomType - 1].bet_min
        }
        this.m_nGameState = state
        // this.m_nGameStartTime = GameMgr.getServerTime() 
        this.setGameFlag(this.GameFlag.gamestate, true)
    },

    setAddBetPlayer: function (player, badd) {
        this.m_AddBetPlayer = player
        this.m_bAdd = badd
    },

    getAddBetPlayer: function () {
        return {addPlayer:this.m_AddBetPlayer, bAdd:this.m_bAdd}
    },

    getTotalClips: function () {
        return this.m_nTatolclips
    },

    getMinClip: function () {
        return this.m_nMinclips
    },

    // getRoomLowClip: function () {
    //     return this.m_nRoomLowClip
    // },

    getAddBetList: function () {
        return this.m_nAddBetList
    },

    getSingalMaxBet: function () {
        if (data_zhajinhuaRoom.items[this.m_nRoomType - 1] == null) {
            return 0
        }
        return data_zhajinhuaRoom.items[this.m_nRoomType - 1].bet_max
    },

    getRoomRoundMax: function () {
        return this.m_nRoundMax
    },

    getRoomRound: function () {
        return this.m_nGameRound
    },

    getStatebeginTime: function () {
        return this.m_nGameStartTime
    },

    getResultData: function () {
        return this.m_tResultData
    },

    getPlayerCount: function () {
        return this.m_nPlayerCount
    },

    getPlaySiteList: function () {
        return this.m_sitePlayList
    },

    getLeaveList: function () {
        return this.m_leaveList
    },

    getGiveupList: function () {
        return this.m_giveupList
    },

    getCompareList: function () {
        return this.m_compareAllList
    },

    getBankerSite: function () {
        return this.m_nBankerSite
    },

    getOptSite: function () {
        return this.m_nOpSite
    },

    getOpData: function () {
        return this.m_tOpData
    },

    cleanLeaveList: function () {
        this.m_leaveList = []
    },

    cleanGiveupList: function () {
        this.m_giveupList = []
    },

    getPlayGold: function () {
        return this.m_playGoldData
    },

    resetPlayerData: function () {
        for (var k = 0; k < this.m_playerList.length; k++) {
            this.m_playerList[k].cardsList = []
            this.m_playerList[k].cardState = this.CardStateType.lock_card
            if (this.m_playerList[k].playerState != this.PlayerStateType.ready) {
                this.m_playerList[k].playerState = this.PlayerStateType.notready
            }
            this.m_playerList[k].betClips = 0
            this.m_playerList[k].betCount = 0
        }
    },

    setGameFlag: function (idx, bvar) {
        this.m_nGameFlag = this.setB2dValue(this.m_nGameFlag, idx, bvar)
    },

    getGameFlag: function (typeflag) {
        return this.getB2bState(this.m_nGameFlag, typeflag)
    },

    // 设置位置
    setB2dValue: function (value, idx, boolvar) {
        if (boolvar == false) {
            var temp = ~(1 << idx);
            value = (value & temp);
        } else {
            var temp = (1 << idx)
            value = (value | temp)
        }
        return value
    },

    // 取出某一位的状态值
    getB2bState: function (value, idx) {
        var state = false
        var temp = (value >>> idx)
        temp = (temp & 1)
        if (temp == 1) {
            state = true
        }
        return state
    },


    sortDispanseCardSort: function () {
        if (this.m_sitePlayList.length == 0) { return }
        //    table.sort(this.m_sitePlayList)
        this.m_sitePlayList.sort();

        var tempsmall = []
        var tempmax = []
        for (var k = 0; k < this.m_sitePlayList.length; k++) {
            var site = this.m_sitePlayList[k];
            if (site < this.m_nBankerSite) {
                tempsmall.push(site);
            } else {
                tempmax.push(site);
            }
        }
        for (var k = 0; k < tempsmall.length; k++) {
            tempmax[tempmax.length] = tempsmall[k];
        }
        this.m_sitePlayList = tempmax
    },

    isPlay: function (st) {
        for (var k = 0; k < this.m_sitePlayList.length; k++) {
            var site = this.m_sitePlayList[k];
            if (site == st) {
                return true
            }
        }
        return false
    },

    isGiveUpOrNotReady: function () {
        var minedate = this.getMineData()
        if (minedate.playerState == this.PlayerStateType.notready || minedate.playerState == this.PlayerStateType.discard || minedate.playerState == this.PlayerStateType.ready) {
            // print("检测自己的按钮判断条件")
            return true
        }
        return false
    },


    getCurPlayerData: function () {
        var sitelist = [];
        for (var k = 0; k < this.m_sitePlayList.length; k++) {
            var site = this.m_sitePlayList[k];
            var player = this.getPlayerBySite(site)
            if (player && player.cardState != this.CardStateType.complose &&
                player.playerState != this.PlayerStateType.discard) {
                if (site == this.getMineSite()) {
                    //  table.insert(sitelist,1,site)
                    sitelist.unshift(site);
                } else {
                    //  table.insert(sitelist,site)
                    sitelist.push(site);
                }
            }
        }
        return sitelist
    },


    getChipValue: function () {
        this.m_chipShowData = data_zhajinhuaRoom.items[this.m_nRoomType - 1].showchips.split(":")
        this.m_chipValueData = data_zhajinhuaRoom.items[this.m_nRoomType - 1].chipvalue.split(":")
    },

    getChipsShowData: function (value, bdesk) {
        var reshowdata = []
        var calcdata = function (varnum) {
            for (var k = this.m_chipValueData.length - 1 ; k >= 0; k--) {
                var temp = parseInt(this.m_chipValueData[k])
                if (varnum == temp) {
                    reshowdata.push({ty : k + 1, str : this.m_chipShowData[k]});
                    //table.insert(reshowdata, {ty = k , str = this.m_chipShowData[k]})
                    return
                } else {
                    if (varnum > temp) {
                        varnum = varnum - temp
                        reshowdata.push({ty : k + 1, str : this.m_chipShowData[k]});
                        //table.insert(reshowdata, {ty = k , str = this.m_chipShowData[k]})
                        calcdata(varnum)
                        return
                    }
                }
            }
            if (bdesk == true) {
                var cnt = this.m_sitePlayList.length
                var showstr = ""
                for (var k = this.m_chipValueData.length- 1; k >= 0; k--) {
                    var temp = parseInt(this.m_chipValueData[k])
                    if (temp == data_zhajinhuaRoom.items[this.m_nRoomType - 1].bet_min) {
                        showstr = this.m_chipShowData[k]
                        break
                    }
                }
                for (var k = 0; k < cnt; k++) {
                    reshowdata.push({ty : k + 1, str : showstr});
                }
            }
        }.bind(this);
        calcdata(value)
        return reshowdata
    },


    //清理结果数据
    cleanResulteData: function () {
        this.m_tResultData = []
    },


    //增加某一玩家的筹码
    addPlayerClip: function (site, addclip) {
        var index = this.getIndexBySite(site)
        if (this.m_playerList[index]) {
            this.m_playerList[index].clips = this.m_playerList[index].clips + addclip
        }
    },


    //进入房间游戏中玩家列表
    setPlayerSiteList: function () {
        this.m_sitePlayList = []
        for (var k = 0; k < this.m_playerList.length; k++) {
            var player = this.m_playerList[k];
            if (player.playerState >= this.PlayerStateType.wait) {
                this.m_sitePlayList.push(player.site)
                // table.insert(this.m_sitePlayList, player.site)
            }
        }
    },

    //设置房间总押注
    setRoomTotalClip: function (clip) {
        this.m_nTatolclips = clip
    },

    //设置自己可以看的牌，玩家的site
    addCanLookSite: function (site) {
        this.m_canlooksitelist[site] = site
    },

    //自动比牌时，可看牌
    checkAutoCanLook: function () {
        //检测自己是否先输牌或弃牌或为参赛
        var minedata = this.getMineData()
        if (minedata.playerState == this.PlayerStateType.discard
            || minedata.playerState == this.PlayerStateType.notready
            || minedata.cardState == this.CardStateType.complose
        ) {
            return
        }
        for (var k = 0; k < this.m_sitePlayList.length; k++) {
            var site = this.m_sitePlayList[k];
            var player = this.getPlayerBySite(site)
            if (minedata.playerState == this.PlayerStateType.discard
                || minedata.cardState == this.CardStateType.complose
            ) {
                //不可看
            } else {
                this.addCanLookSite(site)
            }
        }
    },

    isCanLookCardSite: function (site) {
        if (this.m_canlooksitelist[site] || site == this.getMineSite()) {
            return true
        }
        return false
    },

    cleanCanSite: function () {
        this.m_canlooksitelist = []
    },

    //当前底注是否超过单注上限
    isCurBetOverMax: function () {
        if (this.m_nMinclips >= this.getSingalMaxBet()) {
            return true
        }
        return false
    },


    //获取当前孤注一掷玩家
    setCompareList: function () {
        this.m_compareAllList = []
        for (var k = 0; k < this.m_sitePlayList.length; k++) {
            var site = this.m_sitePlayList[k];
            var player = this.getPlayerBySite(site)
            if (player && player.cardState != this.CardStateType.complose && player.playerState != this.PlayerStateType.discard) {
                this.m_compareAllList.push(site);
                // table.insert(this.m_compareAllList,site)
            }
        }
    },

    //////////////////////////////////////////////////////////////
    //////////-逻辑部分//////////////////////////////////////////-
    //////////////////////////////////////////////////////////////

    //扣除桌费 铺底
    collectDeskCost: function () {
        var data = game_room.getItem(function (element) {
            if (element.key == this.getPlayType())
                return true;
            else
                return false;
        }.bind(this));

        for (var k = 0; k < this.m_sitePlayList.length; k++) {
            var site = this.m_sitePlayList[k];
            var index = this.getIndexBySite(site)
            if (this.m_playerList[index]) {
                this.m_playerList[index].clips = this.m_playerList[index].clips - data.tax - data.basescore
                this.m_nTatolclips = this.m_nTatolclips + data.basescore//this.m_nMinclips / 2
                this.m_playerList[index].betClips = data.basescore
            }
        }
    },

    getIndexBySite: function (site) {
        for (var k = 0; k < this.m_playerList.length; k++) {
            var player = this.m_playerList[k];
            if (player.site == site) {
                return k
            }
        }
        return -1
    },

    setPlayerReadyState: function (msg) {
        var index = this.getIndexBySite(msg.site)
        if (index == -1) { return }
        this.m_playerList[index].playerState = this.PlayerStateType.ready
        this.setGameFlag(this.GameFlag.playerReady, true)
    },

    playerEnterGame: function (player) {
        //    table.insert(this.m_playerList, player)
        this.m_playerList.push(player);
        this.setGameFlag(this.GameFlag.playerEnterRoom, true)
    },

    playerQuitRoom: function (site) {
        this.m_leaveList = this.m_leaveList || []
        //    table.insert(this.m_leaveList,site)
        //增加移除玩家列表
        for(var i=0;i<this.m_playerList.length;i++){
            if(this.m_playerList[i].site == site)
            {
                this.m_playerList.splice(i,1);
            }
        }

        this.m_leaveList.push(site);
        this.setGameFlag(this.GameFlag.playerquite, true)
    },

    dispenseCards: function (msg) {
        cc.log(msg, "发牌数据和庄家数据")
        this.m_nBankerSite = msg.bankerSite
        for (var k = 0; k < msg.sitesList.length; k++) {
            var site = msg.sitesList[k];
            for (var pid = 0; pid < this.m_playerList.length; pid++) {
                var player = this.m_playerList[pid];
                if (player.site == site) {
                    this.m_playerList[pid].playerState = this.PlayerStateType.wait
                }
            }
        }
        this.m_nPlayerCount = msg.sitesList.length
        this.m_sitePlayList = msg.sitesList
        this.sortDispanseCardSort()
        this.collectDeskCost()
        this.setGameFlag(this.GameFlag.collectcost, true)
        this.setGameFlag(this.GameFlag.disCard, true)
    },

    updateNextOpPlayer: function (msg) {
        var index = this.getIndexBySite(this.m_nOpSite)
        if (index != -1 && this.m_playerList[index].playerState == this.PlayerStateType.option) {
            this.m_playerList[index].playerState = this.PlayerStateType.wait
        }
        this.m_nOpSite = msg.site
        this.m_nGameRound = msg.round
        this.m_nOptimer = onePlayerOpTime
        cc.log(msg, "每个玩家操作开始时间")
        index = this.getIndexBySite(this.m_nOpSite)
        if (index != -1) {
            this.m_playerList[index].playerState = this.PlayerStateType.option
        }
        // this.m_nGameStartTime = GameMgr.getServerTime()    //每个玩家操作开始时间
        this.setGameFlag(this.GameFlag.nextOpSite, true)
    },

    updateOptionData: function (msg) {
        var index = this.getIndexBySite(msg.site)
        if (index == -1) { return }
        if (this.m_playerList[index] == null) { return }
        this.m_tOpData = msg
        if (msg.op == this.ZJHOptType.discard) {
            this.m_giveupList.push(msg.site)
            this.m_playerList[index].playerState = this.PlayerStateType.discard
            this.setGameFlag(this.GameFlag.giveupCard, true)
            if (this.m_playerList[index].sex == this.SexManOrWuman.WUMAN) {
                //gAudioManger:playAudio(13011+Math.random()*2)
            } else {
                //gAudioManger:playAudio(13021+Math.random()*2)
            }
        } else if (msg.op == this.ZJHOptType.lookcard) {
            this.m_playerList[index].cardsList = msg.cardsList
            this.m_playerList[index].cardState = this.CardStateType.unlock_card
            this.setGameFlag(this.GameFlag.lookCard, true)
            if (this.m_playerList[index].sex == this.SexManOrWuman.WUMAN) {
                //gAudioManger:playAudio(13033)
            } else {
                //gAudioManger:playAudio(13035)
            }
        } else if (msg.op == this.ZJHOptType.dobet) {
            this.m_playerList[index].betClips = this.m_playerList[index].betClips + msg.value
            this.m_playerList[index].clips = this.m_playerList[index].clips - msg.value
            this.setGameFlag(this.GameFlag.betFresh, true)
            this.m_playerList[index].betCount = this.m_playerList[index].betCount || 0
            if (this.m_nMinclips < msg.minClips) {
                this.setAddBetPlayer(this.m_playerList[index], true)
            } else {
                this.m_playerList[index].betCount = this.m_playerList[index].betCount + 1
                this.setAddBetPlayer(this.m_playerList[index], false)
            }
        } else if (msg.op == this.ZJHOptType.comcard) {
            this.m_playerList[index].betClips = this.m_playerList[index].betClips + (msg.costCoin || 0)
            this.m_playerList[index].clips = this.m_playerList[index].clips - (msg.costCoin || 0)
            var losesite = msg.site
            if (msg.site == msg.winSite) {
                losesite = msg.value
            }
            var loseindex = this.getIndexBySite(losesite)
            if (msg.cardsList.length != 0 && this.m_playerList[loseindex]) {
                this.m_playerList[loseindex].cardsList = msg.cardsList
            }
            if (this.m_playerList[loseindex]) {
                this.m_playerList[loseindex].cardState = this.CardStateType.complose
            }
            if (msg.site == this.getMineSite() || msg.value == this.getMineSite() || msg.winSite == this.getMineSite()) {
                if (msg.site == this.getMineSite()) { //自己是操作者
                    this.addCanLookSite(msg.value)
                } else if (msg.value == this.getMineSite()) {   //别人是操作者  
                    this.addCanLookSite(msg.site)
                }
            }
            this.setGameFlag(this.GameFlag.betFresh, true)
            this.setGameFlag(this.GameFlag.comparecard, true)
        } else if (msg.op == this.ZJHOptType.dobetall) {
            this.m_playerList[index].betClips = this.m_playerList[index].betClips + msg.costCoin
            this.m_playerList[index].clips = this.m_playerList[index].clips - msg.costCoin
            this.setCompareList()
            if (msg.value == 0) {  //失败
                this.m_playerList[index].cardState = this.CardStateType.complose
                this.m_playerList[index].cardsList = msg.cardsList
            } else {  //胜利
                this.m_playerList[index].cardState = this.CardStateType.winguzhuwin
            }
            if (msg.site == this.getMineSite()) {
                this.checkAutoCanLook()
            }
            this.setGameFlag(this.GameFlag.betFresh, true)
            this.setGameFlag(this.GameFlag.guzhuyizhi, true)
        }
        this.m_nTatolclips = msg.tatolClips
        this.m_nMinclips = msg.minClips
    },

    setResultData: function (msg) {
        this.m_tResultData = msg
        for (var k = 0; k < msg.resultsList.length; k++) {
            var tp = msg.resultsList[k];
            var index = this.getIndexBySite(tp.site)
            this.m_playerList[index].cardsList = tp.cardsList
            //this.m_playerList[index].clips = tp.newClips
        }
        if (msg.type == 1) {
            this.checkAutoCanLook()
        }
        this.setGameFlag(this.GameFlag.calcstate, true)
    },

    autoAddClips: function (msg) {
        //    cc.log(msg,"自动充钱")
        var index = this.getIndexBySite(msg.site)
        if (index == -1) { return }
        if (this.m_playerList[index] == null) { return }
        this.m_playerList[index].gold = msg.gold
        this.m_playerList[index].clips = msg.clips
        this.m_playerList[index].autoSetClips = msg.autoSetClips
        this.setGameFlag(this.GameFlag.autoAddClip, true)
    },


    setAutoAddClip: function (clip) {
        var index = this.getIndexBySite(this.getMineSite())
        if (this.m_playerList[index]) {
            this.m_playerList[index].autoSetClips = clip
        }
    },

    playgoldRecv: function (msg) {
        this.m_playGoldData = msg
        var index = this.getIndexBySite(msg.site)
        this.m_playerList[index].clips = msg.newClips
        cc.log(this.m_playGoldData, "打赏换回")
        this.setGameFlag(this.GameFlag.playGold, true)
    },


    isflush: function (valist) {
        if (valist[0].clr == valist[1].clr && valist[1].clr == valist[2].clr) {
            return true
        }
        return false
    },

    isLeopard: function (valist) {
        if (valist[0].value == valist[1].value && valist[1].value == valist[2].value) {
            return true
        }
        return false
    },

    isOnepair: function (valist) {
        if (valist[0].value == valist[1].value || valist[1].value == valist[2].value) {
            return true
        }
        return false
    },

    isStraight: function (valist) {
        if (((valist[0].value + valist[2].value) / 2 == valist[1].value && valist[2].value - valist[0].value == 2)
            || (valist[0].value == 1 && valist[2].value == 13 && valist[1].value == 12)) {
            return true
        }
        return false
    },
//public
    GetCardInfo: function(nCard){
    
        var aCardInfo = [];
        var value = this.GetCardValue(nCard)
        var color = this.GetCardColor(nCard)
        aCardInfo.value = value
        aCardInfo.color = color

        return  aCardInfo
    },
    //获取数值
    GetCardValue: function(nCard){
        var value = (nCard & 0x0F)
        return value
    },
    //获取花色
    GetCardColor: function(nCard){
        var color = (nCard & 0xF0)
        return color
    },
//public

    calcCardValue: function (cards) {
        if (cards == null || cards.length != 3) {
            return this.ZJHCardType.high_car
        }
        var valist = [];
        for (var k = 0; k < cards.length; k++) {
            var temp = cards[k];
            var carddata = this.GetCardInfo(temp)
            var cardVar = parseInt(carddata.value); //tonumber(string.format("%d", tostring(carddata.value)))
            var color = parseInt(carddata.color); //tonumber(string.format("%d", tostring(carddata.color)))
            valist[k] = {value : cardVar, clr : color};
        }

        //计算当前牌型
        var compCard = function (card1, card2) {
            if (card1.value < card2.value) {
                return -1;
            } else if (card1.value > card2.value) {
                return 1;
            } else {
                return 0;
            }
        }

        valist.sort(compCard) //升序
        if (this.isLeopard(valist)) {
            return this.ZJHCardType.Leopard
        }

        if (this.isOnepair(valist)) {
            return this.ZJHCardType.one_pair
        }

        if (this.isStraight(valist)) {
            if (this.isflush(valist)) {
                return this.ZJHCardType.straight_flus
            } else {
                return this.ZJHCardType.straight
            }
        }

        if (this.isflush(valist)) {
            return this.ZJHCardType.flush
        }

        return this.ZJHCardType.high_car
    },


    GetNodePos: function (node) {
        if(node == null) return node;

        var pos = node.getPosition()
        return cc.v2(pos.x, pos.y)
    },
    //将某一节点的坐标转换指定节点的坐标系中
    //param:
    //srcnode:需转节点
    //desnode:指定节点
    //return: 指定节点坐标系的一个point
    NodePointToDesNodePoint:function(srcnode, desnode){
        var point = cc.v2(0, 0)
        if(srcnode == null || desnode == null){
            return point
        } 
        point = this.GetNodePos(srcnode)  
        point = srcnode.parent.convertToWorldSpaceAR(point)
        point = desnode.convertToNodeSpaceAR(point)
        return point
    },

    updateAutoChip:function(){
        this.setGameFlag(this.GameFlag.selfAutoChips, true)
    },

});

module.exports = ZjhManager;