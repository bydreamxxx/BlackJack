var gFishMgr = require('FishManager').FishManager.Instance();

var dd = cc.dd;
cc.Class({
    extends: cc.Component,

    properties: {
        progress_bar: cc.ProgressBar,
        m_bProgress: false,
        start_node: cc.Node,
        end_node: cc.Node,
        loading_anim: cc.Node,
    },

    onLoad() {
        cc.dd.SysTools.setLandscape();
        this.progress_bar.progress = 0;
        this.m_bProgress = true;

        // var loadResEnd = function () {
        //     var data = gFishMgr.getRoomItem();
        //     var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
        //     msg.setGameType(data.gameid);
        //     msg.setRoomId(data.roomid);
        //     cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
        // }

        const loadCellList = [];
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish1", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish2", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish2_d", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish3", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish3_d", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish4", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish4_d", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish5", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish6", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish6_d", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish7", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish7_d", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish8", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish8_d", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish9", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish9_d", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish10", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish10_d", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish11", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish12", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish13", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish14", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish14_d", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish15", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish16", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish16_d", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish17", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish17_d", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish18", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish18_d", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish19", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish19_d", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish20", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish21", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish21_d", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish22", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish22_d", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish23", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish23_d", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish24", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish24_d", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish25", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish25_d", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish26", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish26_d", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish27", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish27_d", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish30", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish30_d", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish31", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish32", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish32_d", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/yupan01", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/yupan02", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/yupan03", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/yupan06", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/yupan07", cc.Prefab));

        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish_net_2", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/fish_net_1", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/lightning", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/coinNumNode", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/coinEffect1", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/coinEffect10", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/buyu_buff_bigBoom", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/buyu_buff_smog", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/buyu_fish_dead_glow", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish/prefabs/bingoEffect", cc.Prefab));
        cc.dd.ResLoader.loadGameStaticResList(loadCellList, this.onProgress.bind(this), null);
    },

    start() {
        this.speed = 0.2;
    },

    update(dt) {
        if (!this.m_bProgress)
            return;
        if (this.progress_bar.progress <= 1.0) {
            let cur_progress = this.progress_bar.progress + this.speed * dt;
            this.progress_bar.progress = Math.min(1.0, cur_progress);
            this.loading_anim.x = cc.misc.lerp(this.start_node.x, this.end_node.x, Math.min(1.0, cur_progress));

        }
        if (this.progress_bar.progress >= 1.0) {
            this.m_bProgress = false;
            cc.dd.TimeTake.start("加载场景:fish_scene");
            cc.director.loadScene('fish_scene', function () {
                //切换场景完成,启动网络消息分发
                cc.gateNet.Instance().startDispatch();
                cc.dd.TimeTake.end("加载场景:fish_scene");
                if (cc.sys.isMobile) {
                    cc.log("执行GC");
                    cc.sys.garbageCollect();
                }
                cc.dd.DialogBoxUtil.refresh();
            })
        }
    },

    onProgress: function (value) {
        if (value >= 1.0) {
            this.m_bProgress = true;
        }
    },

});
