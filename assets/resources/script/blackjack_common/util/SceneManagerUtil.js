var dd = cc.dd;
var _ = require('lodash');
var Define = require("Define");
var AppCfg = require('AppConfig');
var hall_prefab = require('hall_prefab_cfg');
let scene_dir_cfg = require('scene_dir_cfg');
var loading_cfg = require('loading_cfg');
var auto_win = require('AppConfig').AUTO_WIN;
var game_channel_cfg = require('game_channel');
var com_replay_data = require('com_replay_data').REPLAY_DATA;

var SceneManagerUtil = cc.Class({
    _instance: null,

    statics: {
        Instance: function () {
            if (!this._instance) {
                this._instance = new SceneManagerUtil();
            }
            return this._instance;
        },

        Destroy: function () {
            if (this._instance) {
                this._instance = null;
            }
        },
    },

    ctor: function () {
        this.gc_id = null;
    },

    /**
     * 获取当前场景
     * @returns {*}
     */
    getCurrScene: function () {
        return cc.director.getScene();
    },

    //日志打印 比赛场莫名拉回大厅bug
    stack(sceneName) {
        var e = new Error();
        var lines = e.stack.split("\n");
        lines.shift();
        var str = '加载场景:' + sceneName + ' \n';
        lines.forEach(item => {
            str += item;
            str += '\n';
        });
        cc.log(str);
    },

    replaceScene: function (sceneName, resList, audioList, endcall, resLoadSuccess) {
        this.stack(sceneName);
        if (!cc.director.getScene() || !cc.director.getScene().name) {
            return;
        }
        if (cc.director.getScene().name == sceneName) {
            cc.log("正在", sceneName, "场景中", "无需切换");
            return;
        }

        let no_loading = [
            "kuaileba_hall",
            "jlmj_login",
            "jlmj_loginLoad",
            "chifeng_hall"
        ];
        if (scene_dir_cfg[sceneName] == "gameyj_mj") {
            cc.loading_type = 1;
        } else {
            cc.loading_type = 2;
        }
        let klb_loading = [
            "gamedl_hall",
            "gamedl_login",
            // "club_new",
            "klb_friend_group_scene",
        ];
        let chifeng_loading = [
            "kuaileba_hall",
            "jlmj_login",
            "jlmj_loginLoad",
            "chifeng_hall",
            "klb_friend_group_scene",
        ];
        // switch (AppCfg.GAME_PID) {
        //     case 2: //快乐吧长春麻将
        //     case 3: //快乐吧农安麻将
        //     case 4: //快乐吧填大坑
        //     case 5: //快乐吧牛牛
        //         if (klb_loading.indexOf(sceneName) != -1) {
        //             this.replaceSceneWithoutLoading(sceneName, resList, audioList, endcall, resLoadSuccess);
        //         } else {
        //             this.replaceSceneWithLoading(sceneName, resList, audioList, endcall, resLoadSuccess);
        //         }
        //         break;
        //     case 10006://赤峰单包
        //         if (chifeng_loading.indexOf(sceneName) != -1) {
        //             this.replaceSceneWithoutLoading(sceneName, resList, audioList, endcall, resLoadSuccess);
        //         } else {
        //             this.replaceSceneWithLoading(sceneName, resList, audioList, endcall, resLoadSuccess);
        //         }
        //         break;
        //     default:
        //         if (no_loading.indexOf(sceneName) != -1) {
        //             this.replaceSceneWithoutLoading(sceneName, resList, audioList, endcall, resLoadSuccess);
        //         } else {
        //             this.replaceSceneWithLoading(sceneName, resList, audioList, endcall, resLoadSuccess);
        //         }
        //         break;
        // }
        this.replaceSceneWithoutLoading(sceneName, resList, audioList, endcall, resLoadSuccess);
    },

    /**
     * 切换场景
     * @param sceneName  场景名称
     * @param resList  新场景需要加载的资源列表
     * @param audioList 新场景需要加载的音效，音乐列表
     * @param endcall  切换场景完成是成回调
     * @param resLoadSuccess  资源加载完成回调函数
     */
    replaceSceneWithoutLoading: function (sceneName, resList, audioList, endcall, resLoadSuccess) {
        if (!cc.director.getScene() || !cc.director.getScene().name) {
            return;
        }
        if (cc.director.getScene().name == sceneName) {
            cc.log("正在", sceneName, "场景中", "无需切换");
            return;
        }

        let bundleName = cc.dd.Define.GetBundleNameByScene[sceneName];

        let scene = cc.director.getScene();
        var Canvas = cc.find("Canvas", scene);
        //this.autoAdjustWin(Canvas);
        //Canvas.width = 1024;
        //Canvas.height = 768;
        scene.autoReleaseAssets = true;
        var pre_scene_dir = scene_dir_cfg[cc.director.getScene().name];
        var load_scene_dir = scene_dir_cfg[sceneName];
        if (cc.sys.isMobile && cc.sys.isNative) {
            // cc.Texture2D.setDefaultAlphaPixelFormat(0);
            // if(sceneName == "gameyj_water_margin_slot"){
            //     cc.Texture2D.setDefaultAlphaPixelFormat(cc.Texture2D.PixelFormat.RGBA4444);
            // }else{
            //     cc.Texture2D.setDefaultAlphaPixelFormat(0);
            // }
        }
        //切换场景时,暂停网络消息分发
        cc.gateNet.Instance().pauseDispatch();
        AudioManager.clearBackGroundMusicKey();
        var self = this;
        this.replaceName = sceneName;
        dd.NetWaitUtil.smooth_show("REPLACING SCENE");
        cc.dd.ResLoader.preloadAudioList(audioList, function () {
            cc.dd.ResLoader.loadSceneStaticResList(resList, null, function () {
                if (!_.isNull(resLoadSuccess) && !_.isUndefined(resLoadSuccess) && typeof resLoadSuccess == 'function') {
                    resLoadSuccess();
                }
                cc.dd.TimeTake.start("加载场景:" + sceneName);
                this.loadScene(sceneName, bundleName, () => { },  ()=> {
                    this.loadingSceneName = null;

                    //切换场景完成,启动网络消息分发
                    cc.gateNet.Instance().startDispatch();
                    cc.dd.TimeTake.end("加载场景:" + sceneName);
                    clearTimeout(self.gc_id);
                    if (cc.sys.isMobile && cc.sys.isNative) {
                        // if (pre_scene_dir != load_scene_dir) {
                        //     cc.loader.releaseResDir(pre_scene_dir);
                        //     cc.log("释放资源:" + pre_scene_dir);
                        // }
                        // cc.log("执行GC");
                        // cc.sys.garbageCollect();
                    }
                    cc.dd.DialogBoxUtil.refresh();
                    dd.NetWaitUtil.smooth_close();
                    if (!_.isNull(endcall) && !_.isUndefined(endcall) && typeof endcall == 'function') {
                        endcall();
                    }
                    com_replay_data.Instance().loadHistoryCache();
                    if (!_.isNull(self.endcallEx) && !_.isUndefined(self.endcallEx) && typeof self.endcallEx == 'function') {
                        self.endcallEx();
                        self.endcallEx = null;
                    }
                    self.replaceName = null;
                });
            }.bind(this));
        }.bind(this));
    },

    /**
     * 切换场景
     * @param sceneName  场景名称
     * @param resList  新场景需要加载的资源列表
     * @param audioList 新场景需要加载的音效，音乐列表
     * @param endcall  切换场景完成是成回调
     * @param resLoadSuccess  资源加载完成回调函数
     */
    replaceSceneWithLoading: function (sceneName, resList, audioList, endcall, resLoadSuccess) {
        if (!cc.director.getScene() || !cc.director.getScene().name) {
            return;
        }
        if (cc.director.getScene().name == sceneName) {
            cc.log("正在", sceneName, "场景中", "无需切换");
            return;
        }

        let bundleName = cc.dd.Define.GetBundleNameByScene[sceneName];

        let scene = cc.director.getScene();
        scene.autoReleaseAssets = true;
        //var Canvas = cc.find("Canvas", scene);
        //this.autoAdjustWin(Canvas);
        //Canvas.width = 1024;
        //Canvas.height = 768;
        var pre_scene_dir = scene_dir_cfg[cc.director.getScene().name];
        var load_scene_dir = scene_dir_cfg[sceneName];
        if (cc.sys.isMobile && cc.sys.isNative) {
            // if (sceneName == "gameyj_water_margin_slot") {
            //     cc.Texture2D.setDefaultAlphaPixelFormat(cc.Texture2D.PixelFormat.RGBA4444);
            // } else {
            //     cc.Texture2D.setDefaultAlphaPixelFormat(0);
            // }
        }
        //切换场景时,暂停网络消息分发
        cc.gateNet.Instance().pauseDispatch();
        AudioManager.clearBackGroundMusicKey();
        var self = this;
        this.replaceName = sceneName;
        // dd.NetWaitUtil.smooth_show("REPLACING SCENE");
        cc.loading_progress_max = 0.8;
        var data = loading_cfg.getItem(function (item) {
            var list = item.key.split(';');
            for (var i = 0; i < list.length; i++) {
                if (list[i] == sceneName)
                    return item;
            }
        });
        var loading_scene = 'loading';
        if (data != null)
            loading_scene = data.scenename;

        let loadbundleName = cc.dd.Define.GetBundleNameByScene[loading_scene];

        this.loadScene(loading_scene, loadbundleName, () => { }, function () {
            this.loadingSceneName = null;

            if (cc.sys.isMobile) {
                // if (pre_scene_dir != load_scene_dir && cc.sys.isNative) {
                //     cc.loader.releaseResDir(pre_scene_dir);
                //     cc.log("释放资源:" + pre_scene_dir);
                // }
                // cc.log("执行GC");
                // cc.sys.garbageCollect();
            }
            setTimeout(function () {
                cc.dd.ResLoader.preloadAudioList(audioList, function () {
                    cc.dd.ResLoader.loadSceneStaticResList(resList, null, function () {
                        if (!_.isNull(resLoadSuccess) && !_.isUndefined(resLoadSuccess) && typeof resLoadSuccess == 'function') {
                            resLoadSuccess();
                        }
                        cc.dd.TimeTake.start("加载场景:" + sceneName);
                        cc.replace_scene_end_func = function () {
                            this.loadScene(sceneName, bundleName, () => { }, function () {
                                //切换场景完成,启动网络消息分发
                                cc.gateNet.Instance().startDispatch();
                                cc.dd.TimeTake.end("加载场景:" + sceneName);
                                clearTimeout(self.gc_id);
                                if (cc.sys.isMobile && cc.sys.isNative) {
                                    // if (pre_scene_dir != load_scene_dir) {
                                    //     cc.loader.releaseResDir(pre_scene_dir);
                                    //     cc.log("释放资源:" + pre_scene_dir);
                                    // }
                                    // cc.log("执行GC");
                                    // cc.sys.garbageCollect();
                                }
                                cc.dd.DialogBoxUtil.refresh();
                                // dd.NetWaitUtil.smooth_close();
                                if (!_.isNull(endcall) && !_.isUndefined(endcall) && typeof endcall == 'function') {
                                    endcall();
                                }
                                if (!_.isNull(self.endcallEx) && !_.isUndefined(self.endcallEx) && typeof self.endcallEx == 'function') {
                                    self.endcallEx();
                                    self.endcallEx = null;
                                }
                            }.bind(this));
                        }.bind(this);
                        cc.director.preloadScene(sceneName, function () {
                            cc.loading_progress_max = 1;
                        });
                    }.bind(this));
                }.bind(this));
            }.bind(this), 0.1);
        }.bind(this));
    },

    /**
     * 避免GC闪退
     * @param sceneName
     * @param resList
     * @param audioList
     * @param endcall
     * @param resLoadSuccess
     *
     *
     */
    // loadScene: function (sceneName, resList, audioList, endcall, resLoadSuccess) {
    //     var self = this;
    //     dd.NetWaitUtil.smooth_show("REPLACING SCENE");
    //     cc.dd.ResLoader.preloadAudioList(audioList, function () {
    //         cc.dd.ResLoader.loadSceneStaticResList(resList, null, function () {
    //             if (!_.isNull(resLoadSuccess) && !_.isUndefined(resLoadSuccess) && typeof resLoadSuccess == 'function') {
    //                 resLoadSuccess();
    //             }
    //             cc.dd.TimeTake.start("加载场景:" + sceneName);
    //             cc.director.loadScene(sceneName, function () {
    //                 cc.dd.TimeTake.end("加载场景:" + sceneName);
    //                 clearTimeout(self.gc_id);
    //                 // cc.log('不执行GC');
    //                 // cc.sys.garbageCollect();
    //                 cc.dd.DialogBoxUtil.refresh();
    //                 dd.NetWaitUtil.smooth_close();
    //                 if (!_.isNull(endcall) && !_.isUndefined(endcall) && typeof endcall == 'function') {
    //                     endcall();
    //                 }
    //             });
    //         }.bind(this));
    //     }.bind(this));
    // },


    /**
     * 进入游戏
     * @param gameId
     * @param preResList 预加载资源列表
     * @param endCall 游戏场景加载完毕后的回调
     * @returns {boolean}
     */
    enterGame: function (gameId, endCall, preResList) {
        var sceneName = Define.GameId[gameId];
        if (cc.director.getScene().name == sceneName) {
            cc.log('当前正在场景 ' + sceneName + ' 无需切换场景');
            return false;
        }
        if (preResList == null)
            preResList = [];

        cc.dd.SceneManager.replaceScene(sceneName, preResList, null, function () {
            if (endCall != null) {
                endCall();
            }
            /*var scene = cc.director.getScene();
            var sc_ca = cc.find("Canvas", scene);
            this.autoAdjustWin(sc_ca);*/
            //Canvas.width = 1024;
            //Canvas.height = 768;
            cc.dd.NetWaitUtil.close();
        }.bind(this), function () { });
        return true;
    },
    /**
     * 加载进入游戏
     * @param gameId
     */
    enterGameWithLoading: function (gameId) {
        var sceneName = Define.GameId[gameId];
        if (cc.director.getScene().name == sceneName) {
            cc.log('当前正在场景 ' + sceneName + ' 无需切换场景');
            return;
        }

        if (!cc.director.getScene() || !cc.director.getScene().name) {
            return;
        }

        let scene = cc.director.getScene();
        scene.autoReleaseAssets = true;

        var pre_scene_dir = scene_dir_cfg[cc.director.getScene().name];
        var load_scene_dir = scene_dir_cfg[sceneName];

        cc.gateNet.Instance().pauseDispatch();
        AudioManager.clearBackGroundMusicKey();

        var data = loading_cfg.getItem(function (item) {
            var list = item.key.split(';');
            for (var i = 0; i < list.length; i++) {
                if (list[i] == sceneName)
                    return item;
            }
        });

        var loading_scene = 'loading';
        if (data != null)
            loading_scene = data.scenename;
        let loadBundleName = cc.dd.Define.GetBundleNameByScene[loading_scene];
        this.loadScene(loading_scene, loadBundleName, () => { }, function () {
            this.loadingSceneName = null;

            if (cc.sys.isMobile) {
                // if (pre_scene_dir != load_scene_dir) {
                //     cc.loader.releaseResDir(pre_scene_dir);
                //     cc.log("释放资源:" + pre_scene_dir);
                // }
                // cc.log("执行GC");
                // cc.sys.garbageCollect();
            }
        });
    },

    /**
     * 进入大厅
     */
    enterHall: function (resList, audioList, endCall) {
        //AudioManager.stopMusic();
        AudioManager.clearBackGroundMusicKey();
        //AudioManager.offMusic();


        if (cc.director.getScene().name !== AppCfg.HALL_NAME && cc.director.getScene().name !== 'klb_friend_group_scene') {
            let RoomMgr = require('jlmj_room_mgr').RoomMgr;
            if (RoomMgr.Instance().isClubRoom() || (cc.dd._.isNumber(cc.back_to_club) && cc.back_to_club > 0)) {
                let clubID = 0;
                if (RoomMgr.Instance().isClubRoom()) {
                    clubID = RoomMgr.Instance().clubId;
                    let msg = new cc.pb.club.msg_cur_club();
                    msg.setClubId(clubID);
                    msg.setState(4)
                    cc.gateNet.Instance().sendMsg(cc.netCmd.club.cmd_msg_cur_club, msg, 'msg_cur_club', true);
                } else {
                    clubID = cc.back_to_club;
                }

                cc.back_to_club = null;
                RoomMgr.Instance().clearClubId();

                cc.dd.SceneManager.replaceScene('klb_friend_group_scene', null, null, () => {
                    cc.find('Canvas').getComponent('klb_friend_group_scene').enterClub(clubID);
                });
                return;
            }
        }
        // if(cc.game_pid == 10006){
        //     if(cc.director.getScene().name !== 'klb_friend_group_scene' && cc.dd.AppCfg.GAME_ID != cc.dd.Define.GameType.CFMJ_FRIEND && cc.dd.AppCfg.GAME_ID != cc.dd.Define.GameType.AHMJ_FRIEND && cc.dd.AppCfg.GAME_ID != cc.dd.Define.GameType.DDZ_XYPYC){
        //         cc.dd.SceneManager.endcallEx = ()=>{
        //             let scene = cc.director.getScene().getChildByName('Canvas').getComponent('klb_hallScene');
        //             if(scene){
        //                 scene.goToGold();
        //             }
        //         }
        //     }
        // }

        let isCard = cc.director.getScene().name === 'klb_friend_group_scene';

        let klb_game_list_config = require('klb_gameList');
        let gameItem = klb_game_list_config.getItem(function (item) {
            if (item.gameid == cc.dd.AppCfg.GAME_ID)
                return item
        })

        if (gameItem || isCard) {
            isCard = isCard || gameItem.isfriend;

            cc.dd.SceneManager.endcallEx = () => {
                let scene = cc.director.getScene().getChildByName('Canvas').getComponent('klb_hallScene');
                if (scene) {
                    scene.showHall(isCard);
                }
            }
        }

        cc.dd.SceneManager.replaceScene(AppCfg.HALL_NAME, resList, audioList, endCall);
    },

    enterNewHall: function (node) {
        if (!node) return;
        //判断是否是模块单包类型
        var channel_games = game_channel_cfg.getItem(function (item) {
            if (item.channel == AppCfg.GAME_PID)
                return true;
        })
        if (channel_games && channel_games.type == 2) {
            var hall = node.parent.getComponent('klb_hallScene');
            if (hall)
                hall.onClickHall();
        }
    },

    enterLoginScene() {
        cc.dd.SceneManager.replaceScene(AppCfg.LOGIN_SCENE_NAME);
    },


    enterHallMatch: function () {
        //AudioManager.stopMusic();
        if (cc.director.getScene().name === AppCfg.HALL_NAME) {
            cc.dd.UIMgr.openUI(hall_prefab.KLB_Match, function (node) {
                node.getComponent('klb_hall_Match').sendGetMatch(1);
            });
        }
        else {
            cc.dd.SceneManager.replaceScene(AppCfg.HALL_NAME, null, null, function () {
                cc.dd.UIMgr.openUI(hall_prefab.KLB_Match, function (node) {
                    node.getComponent('klb_hall_Match').sendGetMatch(1);
                });
            });
        }
    },

    enterHallJBCMatch(gameId) {
        cc.dd._chooseSeatId = null;
        cc.dd._chooseGameId = null;
        cc.dd._chooseMatchId = gameId;
        if (cc.director.getScene().name === AppCfg.HALL_NAME) {
            var protoNewRoomList = new cc.pb.hall.hall_req_new_room_list();
            protoNewRoomList.setHallGameid(gameId);
            cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_hall_req_new_room_list, protoNewRoomList,
                '发送协议[id: ${cmd_hall_req_new_room_list}],cmd_hall_req_new_room_list,[房间列表]', true);
        }
        else {
            this.enterRoomList(gameId);
            // cc.dd.SceneManager.replaceScene(AppCfg.HALL_NAME, null, null, function () {
            //     var bscdata = require('bsc_data').BSC_Data;
            //     var list = bscdata.Instance().getActListBytype(1);
            //     if (list && list.infoList && list.infoList.length) {
            //         for (var i = 0; i < list.infoList.length; i++) {
            //             if (list.infoList[i].gameType == gameId) {
            //                 cc.dd.UIMgr.openUI('blackjack_hall/prefabs/klb_hall_match_detail', function (ui) {
            //                     ui.getComponent('klb_match_detail').showDetail(list.infoList[i]);
            //                 });
            //                 return;
            //             }
            //         }
            //     }
            // });
        }
    },

    enterHallMatchDDZ: function () {
        //AudioManager.stopMusic();
        if (cc.director.getScene().name === AppCfg.HALL_NAME) {
            cc.dd.UIMgr.openUI(hall_prefab.KLB_Match, function (node) {
                cc.dd.quickMatchType = 'ddz_kuai_su_sai_again';
                node.getComponent('klb_hall_Match').sendGetMatch(1);
            });
        }
        else {
            cc.dd.SceneManager.replaceScene(AppCfg.HALL_NAME, [{ path: hall_prefab.KLB_Match, type: cc.Prefab }], null, function () {
                cc.dd.UIMgr.openUI(hall_prefab.KLB_Match, function (node) {
                    cc.dd.quickMatchType = 'ddz_kuai_su_sai_again';
                    //node.getComponent('klb_hall_Match').sendGetMatch(1);
                });
            });
        }
    },

    //进入大厅充值
    enterHallRecharge: function () {
        //AudioManager.stopMusic();
        AudioManager.clearBackGroundMusicKey();

        cc.dd.SceneManager.replaceScene(AppCfg.HALL_NAME, null, null, function () {
            if (!cc._is_shop)
                return;
            cc.dd.UIMgr.openUI(hall_prefab.KLB_SHOP_LAYER, function (ui) {
                ui.getComponent('klb_hall_ShopLayer').gotoPage('zs');
                //ui.zIndex = 5000;
            });
        });
    },

    //进入道具兑换
    erterHallChange: function () {
        AudioManager.clearBackGroundMusicKey();

        cc.dd.SceneManager.replaceScene(AppCfg.HALL_NAME, null, null, function () {
            if (!cc._is_shop)
                return;
            cc.dd.UIMgr.openUI(hall_prefab.KLB_SHOP_LAYER, function (ui) {
                ui.getComponent('klb_hall_ShopLayer').gotoPage('FK');
                //ui.zIndex = 5000;
            });
        });
    },

    /**
     * 进入房间列表
     */
    enterRoomList: function (gameId) {
        //AudioManager.stopMusic();
        cc.dd.SceneManager.replaceScene(AppCfg.HALL_NAME, null, null, function () {
            var protoNewRoomList = new cc.pb.hall.hall_req_new_room_list();
            protoNewRoomList.setHallGameid(gameId);
            cc.gateNet.Instance().sendMsg(cc.netCmd.hall.cmd_hall_req_new_room_list, protoNewRoomList,
                '发送协议[id: ${cmd_hall_req_new_room_list}],cmd_hall_req_new_room_list,[房间列表]', true);
        });

        dd.NetWaitUtil.show('正在请求数据');
    },

    /**
     * 进入领取福利 吃低保
     */
    enterHallWelfare: function () {
        //AudioManager.stopMusic();
        cc.dd.SceneManager.replaceScene(AppCfg.HALL_NAME);
        // todo 打开福利 界面

    },


    /**
     * 进入俱乐部
     */
    enterClub: function () {
        AudioManager.clearBackGroundMusicKey();
        // cc.dd.SceneManager.replaceScene('club_new');
        cc.dd.SceneManager.replaceScene('klb_friend_group_scene');
    },

    isGameSceneExit: function (gameid) {
        var sceneName = Define.GameId[gameid];
        if (cc.director.getScene().name == sceneName) {
            return true;
        } else {
            return false;
        }
    },

    autoAdjustWin: function (node) {
        var size = cc.view.getFrameSize();
        var screen_aspect = size.width / size.height;
        var design_aspect = node.width / node.height;
        if (screen_aspect > design_aspect) {
            node.width *= screen_aspect / design_aspect;
        } else if (screen_aspect < design_aspect) {
            node.height *= design_aspect / screen_aspect;
        }
    },

    loadScene(sceneName, bundleName, onBeforeLoadScene, onLaunched) {
        if(this.loadingSceneName == sceneName){
            cc.log(`正在加载重复场景 ${sceneName}`);
            return;
        }
        this.loadingSceneName = sceneName
        let bundle = cc.assetManager.getBundle(bundleName);
        if (bundle) {
            bundle.loadScene(sceneName, function (err, scene) {
                cc.director.runScene(scene, onBeforeLoadScene, onLaunched);
            });
        } else {
            cc.assetManager.loadBundle(bundleName, (err, bundle) => {
                if (err) {
                    cc.error(`load bundle ${bundleName} error ${err.message}`)
                    return;
                }
                bundle.loadScene(sceneName, function (err, scene) {
                    cc.director.runScene(scene, onBeforeLoadScene, onLaunched);
                });
            })
        }
    }
});

module.exports = SceneManagerUtil;