
cc.Class({
    extends: cc.Component,

    properties: {
        game_icon_prefab: cc.Prefab,
        page_node: cc.Node,
        name_txt: cc.Label,

        closeWidget: cc.Widget
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // this.page_node = cc.find("klb_hall_GameListPage", this.node);
        // this.name_txt = cc.find("name", this.node).getComponent(cc.Label);
    },

    start() {

    },

    /**
     * 设置合集数据
     * @param data
     */
    setData(data) {
        this.data = data;
        this.updateUI();
    },

    /**
     * 设置合集源数据
     * @param origin_pos
     * @param origin_page
     */
    setOriginData(origin_pos, origin_page) {
        this.origin_pos = origin_pos;
        this.origin_page = origin_page;
    },

    /**
     * 刷新界面
     */
    updateUI() {
        let self = this;
        this.name_txt.string = this.data.name;
        this.page_node.removeAllChildren(true);
        // var num = this.data.game_list.length;
        // var row = Math.ceil(num / 5);
        // if (row < 3) {
        //     self.page_node.height = 408;
        // }
        // else {
        //     var layout = self.page_node.getComponent(cc.Layout);
        //     self.page_node.height = layout.paddingTop + layout.paddingBottom + (row - 1) * layout.spacingY + row * self.game_icon_prefab.data.height;
        // }
        this.data.game_list.forEach(function (game) {
            if(game.game_id != cc.dd.Define.GameType.HLMJ_GOLD && game.game_id != cc.dd.Define.GameType.ACMJ_GOLD) {
                let gameItemNode = cc.instantiate(self.game_icon_prefab);
                let gameItemUI = gameItemNode.getComponent("klb_hall_GameItemUI");
                gameItemUI.setData(game, null);
                self.page_node.addChild(gameItemUI.node);
            }
        });
    },

    /**
     * 合集点击回调
     */
    onClick() {
        let self = this;
        let action_scale = cc.scaleTo(0.1, 214/1008, 208/459);
        let action_move = cc.moveTo(0.1, this.origin_pos);
        let action = cc.spawn(action_scale, action_move);
        let end_func = function () {
            self.node.active = false;
            //
            // self.origin_page.children.forEach(function (child) {
            //     child.active = true;
            // });
        };
        let seq = cc.sequence(action, cc.callFunc(end_func));
        this.node.runAction(seq);

        cc.find('Canvas/gold/datingLayer/gameScrollView').active = true;
    },

    updateAlignment(){
        this.closeWidget.updateAlignment();
    }
});