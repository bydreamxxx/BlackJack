var hall_audio_mgr = require('hall_audio_mgr').Instance();
var club_Mgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();


cc.Class({
    extends: cc.Component,

    properties: {
        prefabItem:{
            default: null,
            type: cc.Prefab,
            tooltip: "成员组件"
        },
        content_node: cc.Node,
        scrollView: cc.ScrollView,

        headNode: cc.Node,
        playername: cc.Label,
        coin: cc.Label,
        last: cc.Label,

        icon: cc.Sprite,
        goldSprite: cc.SpriteFrame,
        redSprite: cc.SpriteFrame,
    },

    onLoad(){
        this.autoScaleWin();
        this.startX = 0;
        this.startY = 0;
        this.spaceX = 0;
        this.spaceY = 0;
        this.updateTimer = 0;
        this.updateInterval = 0.2;
        this.lastContentPosY = 0;
        this.spawnCount = 11;//显示几个
        this.row = 1;//每行几个
        this.item_height = this.prefabItem.data.height;
        this.bufferZone = this.scrollView.node.height / 2 + this.item_height / 2 * 3;//边界线
        this.playerList = [];
    },

    autoScaleWin:function () {
        var canvas_node = cc.find("Canvas");
        this.c_scale = canvas_node.height/this.node.height;
        this.node.scaleX = this.c_scale;
        this.node.scaleY = this.c_scale;

    },

    show(data) {
        if (this._waitAdminAnima) {
            return;
        }
        this._waitAdminAnima = true;
        this.node.stopAllActions();
        this.info = data;

        this.icon.spriteFrame = data.type == 1 ? this.goldSprite : this.redSprite;

        this.playername.string = cc.dd.Utils.subChineseStr(data.ownerName, 0 , 24);
        this.headNode.getComponent('klb_hall_Player_Head').initHead(data.openId, data.headUrl);
        this.last.string = "剩余："+data.leftSum+'/'+data.allSum+'个';
        this.coin.string = data.type == 1 ? data.allCoin : parseFloat(data.allCoin / 100).toFixed(2);

        this.node.active = true;
        this.node.scaleX = 0;
        this.node.scaleY = 0;
        this.node.runAction(cc.sequence(
            cc.scaleTo(0.2,  this.c_scale),
            cc.callFunc(() => {
                this._waitAdminAnima = false;
                this.initPlayerList(data.robsList);
            })
        ));
    },

    initPlayerList(data){
        this.playerList = data;
        this.content_node.removeAllChildren();
        this.content_node.y = 0;
        let j = 0;
        let k = 0;

        for(let i = 0; i < this.playerList.length; i++){
            this.playerList[i].idx = i;
        }

        if(cc.dd._.isArray(this.playerList) && this.playerList.length == this.info.allSum){
            this.playerList.sort((a, b)=>{
                return a.sum - b.sum;
            })
            this.playerList[0].isMin = this.playerList.length > 1;
            this.playerList[this.playerList.length - 1].isMax = this.playerList.length > 1;

            this.playerList.sort((a, b)=>{
                return a.idx - b.idx;
            })
        }

        let playerNum = this.playerList.length
        if(playerNum > this.spawnCount){
            playerNum = this.spawnCount;
        }
        for (let i = 0; i < playerNum; i++) {
            j = Math.floor(i / this.row);
            k = i % this.row;
            var item = cc.instantiate(this.prefabItem);
            item.getComponent('klb_friend_group_redbagDetailItem').initPlayerInfo(this.playerList[i], i, this.info.type == 1);
            item.index = i;
            this.content_node.addChild(item);

            item.x = (-item.width - this.spaceX) * (Math.floor(this.row / 2) - k)-this.startX;
            item.y = -this.startY - this.item_height / 2 - (this.item_height + this.spaceY) * j;
        }

        let count = Math.ceil(this.playerList.length / this.row)
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
                    items[i].getComponent('klb_friend_group_redbagDetailItem').initPlayerInfo(this.playerList[itemId], itemId, this.info.type == 1);
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
                    items[i].getComponent('klb_friend_group_redbagDetailItem').initPlayerInfo(this.playerList[itemId], itemId, this.info.type == 1);
                    items[i].index = itemId;
                }
            }
        }

        // 更新lastContentPosY和总项数显示
        this.lastContentPosY = this.scrollView.content.y;
    },

    close(){
        if(this._waitAdminAnima){
            return;
        }
        hall_audio_mgr.com_btn_click();

        this._waitAdminAnima = true;
        this.node.stopAllActions();

        this.node.scaleX =  this.c_scale;
        this.node.scaleY =  this.c_scale;
        this.node.runAction(cc.sequence(
            cc.scaleTo(0.2, 0),
            cc.callFunc(()=>{
                this._waitAdminAnima = false;
                cc.dd.UIMgr.destroyUI(this.node);
            })
        ))
    },
});
