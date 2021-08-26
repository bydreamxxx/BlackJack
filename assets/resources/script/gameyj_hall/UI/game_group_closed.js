
cc.Class({
    extends: cc.Component,

    properties: {
        // game_icon_prefab: cc.Prefab,
        // page_node : cc.Node,
        // name_txt : cc.Label,
        // majiangFrame: cc.SpriteFrame,
        // xiaocijiFrame: cc.SpriteFrame,

        spine: sp.Skeleton,
        majiang: sp.SkeletonData,
        xiaociji: sp.SkeletonData,
        buyu: sp.SkeletonData,
        dadisu: sp.SkeletonData,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // this.page_node = cc.find("klb_hall_GameListPage", this.node);
        // this.name_txt = cc.find("name", this.node).getComponent(cc.Label);
        // if(this.name_txt){
        //     let outLine = this.name_txt.node.getComponent(cc.LabelOutline);
        //     if(outLine){
        //         if(cc._themeStyle == 0){
        //             outLine.color = new cc.Color(15, 70, 35, 255);
        //         }else{
        //             outLine.color = new cc.Color(29, 63, 93, 255);
        //         }
        //     }
        // }
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
     * 刷新界面
     */
    updateUI() {
        if (this.data.name === "麻将合集") {
            // this.page_node.getComponent(cc.Sprite).spriteFrame = this.majiangFrame;
            this.spine.skeletonData = this.majiang;
            this.spine.node.x = 0;
            this.spine.node.y = -10;
        } else if (this.data.name === "小刺激") {
            // this.page_node.removeAllChildren(true);
            // let self = this;
            // this.data.game_list.forEach(function (game) {
            //     let gameItemNode = cc.instantiate(self.game_icon_prefab);
            //     let gameItemUI = gameItemNode.getComponent("klb_hall_GameItemUI");
            //     gameItemUI.setData(game, null);
            //     gameItemUI.node.setScale(0.25);
            //     gameItemUI.node.width = gameItemUI.node.height = 32;
            //     self.page_node.addChild(gameItemUI.node);
            // });
            // //第十个不显示
            // if(self.page_node.children.length >= 10){
            //     self.page_node.children[9].active = false;
            // }
            // //游戏item点击交互关闭
            // self.page_node.getComponentsInChildren(cc.Toggle).forEach(function (toggle) {
            //     toggle.interactable = false;
            // });
            // //名字不显示
            // self.page_node.children.forEach(function (child) {
            //     cc.find("game_name",child).active = false;
            // });
            this.spine.skeletonData = this.xiaociji;
            this.spine.node.x = 0;
            this.spine.node.y = -5.3;
        } else if (this.data.name === "捕鱼合集") {
            this.spine.skeletonData = this.buyu;
            this.spine.node.x = 0;
            this.spine.node.y = -2;
        } else if (this.data.name === "打地鼠") {
            this.spine.skeletonData = this.dadisu;
            this.spine.node.x = 1;
            this.spine.node.y = -90;
            this.spine.node.setScale(1.8, 1.8)
        }
        // this.name_txt.string = this.data.name;
        let animation = Object.keys(this.spine.skeletonData.skeletonJson.animations)[0];

        this.spine.setAnimation(0, animation, true);
    },

    /**
     * 合集点击回调
     */
    onClick() {
        let game_group_opened = cc.find("Canvas").getComponentInChildren('game_group_opened');
        game_group_opened.node.active = true;
        game_group_opened.setData(this.data);
        game_group_opened.node.setScale(214 / 1008, 208 / 459);

        let parentPos1 = this.node.parent.convertToWorldSpaceAR(this.node.position);
        let parentPos2 = game_group_opened.node.parent.convertToNodeSpaceAR(parentPos1);

        game_group_opened.setOriginData(parentPos2, this.node.parent);
        game_group_opened.node.position = parentPos2;

        let action_scale = cc.scaleTo(0.1, 1.0, 1.0);
        let action_move = cc.moveTo(0.1, cc.v2(0, -9));
        let action = cc.spawn(action_scale, action_move);
        game_group_opened.node.runAction(cc.sequence(action,
            cc.callFunc(() => {
                game_group_opened.updateAlignment();
            })));

        cc.find('Canvas/gold/datingLayer/gameScrollView').active = false;

        // this.node.parent.children.forEach(function (child) {
        //     child.active = false;
        // });
    }
});


