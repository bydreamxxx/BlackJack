
var dd = cc.dd;
cc.Class({
    extends: cc.Component,

    properties: {
        progress_bar: cc.ProgressBar,
        m_bProgress: false,
        start_node: cc.Node,
        end_node: cc.Node,
        loading_anim: cc.Node,
        fishAtlas: cc.SpriteAtlas,
        fishSp: cc.Sprite,
    },

    onLoad() {
        cc.dd.SysTools.setLandscape();
        this.progress_bar.progress = 0;
        this.m_bProgress = true;
        var randomFish = Math.ceil(Math.random() * 15)
        this.fishSp.spriteFrame = this.fishAtlas.getSpriteFrame('bydr_tj_f' + randomFish)
        // var loadResEnd = function () {
        //     var data = gFishMgr.getRoomItem();
        //     var msg = new cc.pb.room_mgr.msg_enter_coin_game_req();
        //     msg.setGameType(data.gameid);
        //     msg.setRoomId(data.roomid);
        //     cc.gateNet.Instance().sendMsg(cc.netCmd.room_mgr.cmd_msg_enter_coin_game_req, msg, "msg_enter_coin_game_req", true);
        // }

        const loadCellList = [];
        loadCellList.push(new dd.ResLoadCell("gameyj_fish_doyen/prefabs/fish1", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish_doyen/prefabs/fish2", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish_doyen/prefabs/fish3", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish_doyen/prefabs/fish4", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish_doyen/prefabs/fish5", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish_doyen/prefabs/fish6", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish_doyen/prefabs/fish7", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish_doyen/prefabs/fish8", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish_doyen/prefabs/fish9", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish_doyen/prefabs/fish10", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish_doyen/prefabs/fish11", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish_doyen/prefabs/fish12", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish_doyen/prefabs/fish13", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish_doyen/prefabs/fish14", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish_doyen/prefabs/fish15", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish_doyen/prefabs/fish16", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish_doyen/prefabs/fish17", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish_doyen/prefabs/fish18", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish_doyen/prefabs/fish19", cc.Prefab));

        loadCellList.push(new dd.ResLoadCell("gameyj_fish_doyen/prefabs/fish_net", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish_doyen/prefabs/coinNumNode0", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish_doyen/prefabs/coinNumNode1", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish_doyen/prefabs/coinEffectMine", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish_doyen/prefabs/coinEffectother", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish_doyen/prefabs/buyu_buff_bigBoom", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish_doyen/prefabs/buyu_fish_dead_glow", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish_doyen/prefabs/bingoEffect", cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish_doyen/prefabs/fish_wave", cc.Prefab));


        loadCellList.push(new dd.ResLoadCell("gameyj_fish_doyen/animation/lock", cc.AnimationClip));
        loadCellList.push(new dd.ResLoadCell("gameyj_fish_doyen/atlas/p_buyu_classic_ui", cc.SpriteAtlas));
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
            cc.dd.TimeTake.start("加载场景:fish_doyen_scene");
            cc.director.loadScene('fish_doyen_scene', function () {
                //切换场景完成,启动网络消息分发

                cc.dd.TimeTake.end("加载场景:fish_doyen_scene");
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
