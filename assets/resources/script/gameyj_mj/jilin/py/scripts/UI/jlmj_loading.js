var dd = cc.dd;

var pai3d_down_cfg = require("jlmj_pai3d_down").Instance();
var pai3d_left_cfg = require("jlmj_pai3d_left").Instance();
var pai3d_right_cfg = require("jlmj_pai3d_right").Instance();
var pai3d_up_cfg = require("jlmj_pai3d_up").Instance();

var pai3d_jiesuan_cfg = require("jlmj_pai3d_jiesuan" ).Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        progress_label: { default: null, type: cc.Label, tooltip: '进度值' },
        progress_bar: { default: null, type: cc.ProgressBar, tooltip: '进度条' },
    },

    ctor: function () {
      this.loadingCfg = [false,false];
    },

    isLoadingCfgEnd: function () {
        var res = true;
        this.loadingCfg.forEach(function (item) {
            res = res && item;
        });
        return res;
    },

    // use this for initialization
    onLoad: function () {
        // Start: 如果是 native 且竖屏，切换屏幕角度
        if( cc.sys.isNative ) {
            cc.dd.SysTools.setLandscape();
        }

        dd.ResLoader.loadPrefab("gameyj_mj/jilin/py/prefabs/jlmj_pai_layout",function (prefab) {
            var layout_node = cc.instantiate(prefab);
            var pai_layout = layout_node.getComponent("jlmj_pai_layout");
            if(!pai_layout){
                cc.error("预制jlmj_pai_layout未挂在jlmj_pai_layout组件");
            }
            if(!(pai_layout.layout_down&&pai_layout.layout_left&&pai_layout.layout_right&&pai_layout.layout_up)){
                cc.error("预制jlmj_pai_layout未挂在jlmj_pai_layout_player组件");
            }
            pai3d_down_cfg.load_layout_cfg(pai_layout.layout_down);
            pai3d_left_cfg.load_layout_cfg(pai_layout.layout_left);
            pai3d_right_cfg.load_layout_cfg(pai_layout.layout_right);
            pai3d_up_cfg.load_layout_cfg(pai_layout.layout_up);

            //加载完配置，销毁配置节点
            layout_node.destroy();

            this.loadingCfg[0] = true;
            if(this.isLoadingCfgEnd()){
                //加载资源
                this.loadRes();
            }

        }.bind(this));

        dd.ResLoader.loadPrefab("gameyj_mj/jilin/py/prefabs/jlmj_pai_jie_suan_layout",function (prefab) {
            var layout_node = cc.instantiate(prefab);
            var jlmj_pai_layout_player = layout_node.getComponent("jlmj_pai_layout_player");

            pai3d_jiesuan_cfg.load_layout_cfg(jlmj_pai_layout_player);

            //加载完配置，销毁配置节点
            layout_node.destroy();
            this.loadingCfg[1] = true;
            if(this.isLoadingCfgEnd()){
                //加载资源
                this.loadRes();
            }
        }.bind(this));

    },

    loadRes: function () {
        var loadCellList = [];
        loadCellList.push(new dd.ResLoadCell("gameyj_mj/common/atlas/majiangpai",cc.SpriteAtlas));
        loadCellList.push(new dd.ResLoadCell("gameyj_mj/common/atlas/majiangpai_2d",cc.SpriteAtlas));
        loadCellList.push(new dd.ResLoadCell("gameyj_mj/common/prefabs/jlmj_pai",cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_mj/common/prefabs/jlmj_user_shoupai",cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_mj/common/prefabs/jlmj_ccgpai_down",cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_mj/common/prefabs/jlmj_ccgpai_right",cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_mj/common/prefabs/jlmj_ccgpai_up",cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_mj/common/prefabs/jlmj_ccgpai_left",cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_mj/jilin/py/prefabs/jlmj_game_menu",cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_mj/common/prefabs/jlmj_3pai_option",cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_mj/jilin/py/prefabs/jlmj_4pai_option",cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_mj/common/prefabs/mj_jiaoInfo_ui",cc.Prefab));
        loadCellList.push(new dd.ResLoadCell("gameyj_mj/common/prefabs/mj_jiaopai_ui",cc.Prefab));
        // loadCellList.push(new dd.ResLoadCell("gameyj_mj/jilin/py/atlas/zhuonei",cc.SpriteAtlas));
        loadCellList.push(new dd.ResLoadCell('gameyj_hall/atals/setting',cc.SpriteAtlas));
        dd.ResLoader.loadSceneStaticResList(loadCellList,this.onProgress.bind(this),this.onCompleted.bind(this));
    },

    /**
     * 进度回调
     */
    onProgress: function (progress) {
        this.progress_label.string = parseInt(progress*100)+"%";
        this.progress_bar.progress = progress;
    },

    /**
     * 加载结束回调
     */
    onCompleted: function(){
    },

});
