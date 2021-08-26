var AppConfig = require('AppConfig');
var game_duli = require('game_duli');
var HallGameCfg = require("klb_hall_GameList").HallGameList.Instance();
const game_List = require('klb_gameList');
const Define = require("Define");
var club_Mgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        prefabItem:{
            default: null,
            type: cc.Node,
            tooltip: "成员组件"
        },
        content_node: cc.Node,
        scrollView: cc.ScrollView,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.startX = 0;
        this.startY = 0;
        this.spaceX = 0;
        this.spaceY = 13;
        this.updateTimer = 0;
        this.updateInterval = 0.2;
        this.lastContentPosY = 0;
        this.spawnCount = 8;//显示几个
        this.row = 1;//每行几个
        this.item_height = this.prefabItem.height;
        this.bufferZone = this.scrollView.node.height / 2 + this.item_height / 2 * 3;//边界线
        this.gameList = [];

        let _gameList = [];

        let clubInfo = club_Mgr.getClubInfoByClubId(club_Mgr.getSelectClubId());
        if(!cc._useChifengUI && clubInfo){
            for(let i = 0; i < clubInfo.roomInfo.length; i++){
                let gameInfo = clubInfo.roomInfo[i].rule.gameInfo;

                let gametype = gameInfo.gameType;

                if(gametype == cc.dd.Define.GameType.SYMJ_FRIEND){
                    if(clubInfo.roomInfo[i].rule.rule.mjSongyuanRule.symjtype == 2){
                        gametype = cc.dd.Define.GameType.SYMJ_FRIEND_2
                    }
                }
                _gameList.push(gametype);
            }
        }else{
            switch (AppConfig.GAME_PID) {
                case 2: //快乐吧麻将
                case 3: //快乐吧农安麻将
                case 4:  //快乐吧填大坑
                case 5:  //快乐吧牛牛
                    var cofnig = game_duli.getItem(function (cfg) {
                        if (cfg.pID == AppConfig.GAME_PID)
                            return cfg;
                    }.bind(this));
                    if (!cofnig) return;
                    _gameList.push({gameType:cofnig.gameid, gameName:item.gameName});
                    break;
                default:
                    if(cc.dd._.isUndefined(HallGameCfg.getGameList())){
                        HallGameCfg.InitHallGameList();
                    }
                    var dataList = HallGameCfg.getGameList();
                    dataList.forEach(function (item) {
                        if (item._game_id != "") {
                            if(cc._chifengGame && item._type != "majiang"){

                            }else{
                                if (item.game_list) {
                                    for (var i = 0; i < item.game_list.length; ++i) {
                                        var listitem = item.game_list[i];
                                        _gameList.push(listitem._game_id);
                                    }
                                } else if (item.chongfu && item.chongfu > 0) {
                                    _gameList.push(item._game_id);
                                    _gameList.push(item.chongfu);
                                } else {
                                    _gameList.push(item._game_id);
                                }
                            }
                        }
                    }.bind(this));
            }
            this.sortGameList(_gameList);
        }

        for (var i = 0; i < _gameList.length; ++i) {
            var gameData = game_List.getItem((item)=> {
                return item.gameid == parseInt(_gameList[i]);
            })
            if (gameData) {
                var itemData = game_List.getItem(function (item) {
                    return item.gameid == gameData.connect_f_id;
                });
                if (!itemData) {
                    itemData = game_List.getItem(function (item) {
                        if (gameData.chongfu != 0) {
                            return item.gameid == gameData.gameid;
                        }
                    });
                }
                var callback = function () {
                    if (itemData && itemData.isopen != 0) {
                        itemData.idxnum = i + 1;
                        if (itemData && itemData.isfriend != 0 && itemData.gameid != 0) {
                            this.gameList.push({gameType: itemData.gameid, gameName: itemData.name});
                        }
                        if (itemData.chongfu != 0) {
                            var dataInfo = game_List.getItem(function (item) {
                                return item.gameid == itemData.chongfu;
                            });
                            this.gameList.push({gameType: dataInfo.gameid, gameName: dataInfo.name});
                        }
                    }
                }.bind(this);

                //正常创建
                callback();
                //方正填大坑
                if (gameData.gameid == Define.GameType.TDK_COIN){
                    itemData = game_List.getItem(function (item) {
                        return item.gameid == Define.GameType.TDK_FRIEND_LIU;
                    });
                    callback();
                }
            }
        }

        this.setData();
    },

    sortGameList: function (arr) {
        var i = arr.length;
        while (i > 0) {
            for (var j = 0; j < i - 1; j++) {
                var gameData_j = game_List.getItem(function (item) {
                    return item.gameid == parseInt(arr[j]);
                });
                if (gameData_j) {
                    gameData_j = game_List.getItem(function (item) {
                        return item.gameid == gameData_j.connect_f_id;
                    })
                }

                var gameData_jj = game_List.getItem(function (item) {
                    return item.gameid == parseInt(arr[j + 1]);
                })
                if (gameData_jj) {
                    gameData_jj = game_List.getItem(function (item) {
                        return item.gameid == gameData_jj.connect_f_id;
                    })
                }
                if (gameData_j && gameData_jj) {
                    if (gameData_j.priority < gameData_jj.priority) {
                        var temp = arr[j + 1];
                        arr[j + 1] = arr[j];
                        arr[j] = temp;
                    }

                }
            }
            i--;
        }
    },

    setData () {
        this.scrollView.stopAutoScroll();

        this.content_node.removeAllChildren();
        this.content_node.y = 0;
        let j = 0;
        let k = 0;

        let playerNum = this.gameList.length
        if(playerNum > this.spawnCount){
            playerNum = this.spawnCount;
        }
        for (let i = 0; i < playerNum; i++) {
            j = Math.floor(i / this.row);
            k = i % this.row;
            var item = cc.instantiate(this.prefabItem);
            item.tagname = this.gameList[i];
            item.getComponentInChildren(cc.Label).string = this.gameList[i].gameName;
            item.active =true;
            item.index = i;
            this.content_node.addChild(item);

            item.x = (-item.width - this.spaceX) * (Math.floor(this.row / 2) - k)-this.startX;
            item.y = -this.startY - this.item_height / 2 - (this.item_height + this.spaceY) * j;
        }

        let count = Math.ceil(this.gameList.length / this.row)
        this.content_node.height = this.startY + this.item_height * count + this.spaceY * count;
    },

    // // 返回item在ScrollView空间的坐标值
    getPositionInView: function (item) {
        let worldPos = item.parent.convertToWorldSpaceAR(item.position);
        let viewPos = this.scrollView.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    },

    // // 每帧调用一次。根据滚动位置动态更新item的坐标和显示(所以spawnCount可以比totalCount少很多)
    update: function(dt) {
        this.updateTimer += dt;
        if (this.updateTimer < this.updateInterval) {
            return; // we don't need to do the math every frame
        }
        this.updateTimer = 0;
        let items = this.content_node.children;
        // 如果当前content的y坐标小于上次记录值，则代表往下滚动，否则往上。
        let isDown = this.scrollView.content.y < this.lastContentPosY;
        // 实际创建项占了多高（即它们的高度累加）
        let count = Math.ceil(items.length / this.row);
        let offset = this.item_height * count + this.spaceY * count;
        let newY = 0;

        // 遍历数组，更新item的位置和显示
        for (let i = 0; i < items.length; ++i) {
            let viewPos = this.getPositionInView(items[i]);
            if (isDown) {
                // 提前计算出该item的新的y坐标
                newY = items[i].y + offset;
                // 如果往下滚动时item已经超出缓冲矩形，且newY未超出content上边界，
                // 则更新item的坐标（即上移了一个offset的位置），同时更新item的显示内容
                if (viewPos.y < -this.bufferZone && newY < 0) {
                    items[i].y = newY;
                    let itemId = items[i].index - items.length; // update item id
                    // this.updateItem(items[i], itemId);
                    items[i].tagname = this.gameList[itemId];
                    items[i].getComponentInChildren(cc.Label).string = this.gameList[itemId].gameName;
                    items[i].index = itemId;
                }
            } else {
                // 提前计算出该item的新的y坐标
                newY = items[i].y - offset;
                // 如果往上滚动时item已经超出缓冲矩形，且newY未超出content下边界，
                // 则更新item的坐标（即下移了一个offset的位置），同时更新item的显示内容
                if (viewPos.y > this.bufferZone && newY > -this.content_node.height) {
                    items[i].y = newY;
                    // let item = items[i].getComponent('Item');
                    let itemId = items[i].index + items.length;
                    // this.updateItem(items[i], itemId);
                    items[i].tagname = this.gameList[itemId];
                    items[i].getComponentInChildren(cc.Label).string = this.gameList[itemId].gameName;
                    items[i].index = itemId;
                }
            }
        }

        // 更新lastContentPosY和总项数显示
        this.lastContentPosY = this.scrollView.content.y;
    },

    getFirstInfo(){
        return this.gameList[0];
    }
});
