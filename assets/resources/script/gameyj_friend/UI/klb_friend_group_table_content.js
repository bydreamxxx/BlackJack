let TABLE_TYPE = require('klb_friend_group_enum').TABLE_TYPE;
var hall_audio_mgr = require('hall_audio_mgr').Instance();
let prefab_config = require('klb_friend_group_prefab_cfg');
let GetGameRules = require('GetGameRules');

cc.Class({
    extends: cc.Component,

    properties: {
        threeItem:{
            default: null,
            type: cc.Prefab,
            tooltip: "三人桌"
        },
        fourItem:{
            default: null,
            type: cc.Prefab,
            tooltip: "四人桌"
        },
        shortItem:{
            default: null,
            type: cc.Prefab,
            tooltip: "短桌子"
        },
        longItem:{
            default: null,
            type: cc.Prefab,
            tooltip: "长桌子"
        },
        oneItem:{
            default: null,
            type: cc.Prefab,
            tooltip: "一张桌子"
        },
        leftArrow:{
            default: null,
            type: cc.Node,
            tooltip: "左箭头"
        },
        rightArrow:{
            default: null,
            type: cc.Node,
            tooltip: "右箭头"
        },
        content_node: cc.Node,
        scrollView: cc.ScrollView,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.updateTimer = 0;
        this.updateInterval = 0.2;
        this.lastContentPosX = 0;

        this.tableList = [];
        this.toggleList = [];

        this.leftArrow.active = false;
        this.rightArrow.active = true;
    },

    getPlayerCount(rule){
        switch(rule.gameInfo.gameType){
            case cc.dd.Define.GameType.CCMJ_FRIEND:
                return rule.rule.mjChangchunRule.usercountlimit;
            case cc.dd.Define.GameType.JLMJ_FRIEND:
                return rule.rule.mjJilinRule.usercountlimit;
            case cc.dd.Define.GameType.NAMJ_FRIEND:
                return rule.rule.mjNonganRule.usercountlimit;
            case cc.dd.Define.GameType.FXMJ_FRIEND:
                return rule.rule.mjFuxinRule.usercountlimit;
            case cc.dd.Define.GameType.SYMJ_FRIEND:
            case cc.dd.Define.GameType.SYMJ_FRIEND_2:
                return rule.rule.mjSongyuanRule.usercountlimit;
            case cc.dd.Define.GameType.XZMJ_FRIEND:
            case cc.dd.Define.GameType.XLMJ_FRIEND:
                return rule.rule.mjXuezhanRule.usercountlimit;
            case cc.dd.Define.GameType.SHMJ_FRIEND:
                return rule.rule.mjSuihuaRule.usercountlimit;
            case cc.dd.Define.GameType.JZMJ_FRIEND:
                return rule.rule.mjJinzhouRuleNew.usercountlimit;
            case cc.dd.Define.GameType.HSMJ_FRIEND:
                return rule.rule.mjHeishanRule.usercountlimit;
            case cc.dd.Define.GameType.TDHMJ_FRIEND:
                return rule.rule.mjNeimengguRule.usercountlimit;
            case cc.dd.Define.GameType.CFMJ_FRIEND:
                return rule.rule.mjChifengRule.usercountlimit;
            case cc.dd.Define.GameType.AHMJ_FRIEND:
                return rule.rule.mjAohanRule.usercountlimit;
            case cc.dd.Define.GameType.FZMJ_FRIEND:
                return rule.rule.mjFangzhengRule.usercountlimit;
            case cc.dd.Define.GameType.WDMJ_FRIEND:
                return rule.rule.mjWudanRule.usercountlimit;
            case cc.dd.Define.GameType.PZMJ_FRIEND:
                return rule.rule.mjPingzhuangRule.usercountlimit;
            case cc.dd.Define.GameType.BCMJ_FRIEND:
                return rule.rule.mjBaichengRule.usercountlimit;
            case cc.dd.Define.GameType.ACMJ_FRIEND:
                return rule.rule.mjAchengRule.usercountlimit;
            case cc.dd.Define.GameType.HLMJ_FRIEND:
                return rule.rule.mjHelongRule.usercountlimit;
        }
        return null;
    },

    /**
     * 初始化桌子列表
     */
    initTableList: function(data, roomInfo, tableType, isOpen){
        this.rule = roomInfo.rule;
        this.isOpen = isOpen;

        let _rule = null;
        for (var attr in roomInfo.rule.rule) {
            if (attr.endsWith('ule') || attr.endsWith('uleNew')) {
                _rule = roomInfo.rule.rule[attr];
                break;
            }
        }

        let playerCount = GetGameRules.getPlayerNum(_rule, roomInfo.rule.gameInfo.gameType);
        let itemPrefab = null;
        this.scrollView.enabled = true;

        if(tableType == TABLE_TYPE.BIG_FIVE || tableType == TABLE_TYPE.BIG_NINE || tableType == TABLE_TYPE.BIG_ELEVEN){
            if(playerCount <= 6){
                tableType = TABLE_TYPE.BIG_FIVE;
            }else if(playerCount <= 9){
                tableType = TABLE_TYPE.BIG_NINE;
            }else{
                tableType = TABLE_TYPE.BIG_ELEVEN;
            }
        }

        switch(tableType){
            case TABLE_TYPE.THREE:
                itemPrefab = this.threeItem;
                this.startX = 185;
                this.startY = 50;
                this.spaceX = 125;
                this.spaceY = 5;
                this.spawnCount = 10;//显示几个
                this.col = 2;//每列几个
                break;
            case TABLE_TYPE.FOUR:
                itemPrefab = this.fourItem;
                this.startX = 185;
                this.startY = 40;
                this.spaceX = 125;
                this.spaceY = 10;
                this.spawnCount = 10;//显示几个
                this.col = 2;//每列几个
                break;
            case TABLE_TYPE.BIG_FIVE:
                itemPrefab = this.shortItem;
                this.startX = 180;
                this.startY = 60;
                this.spaceX = 85;
                this.spaceY = 5;
                this.spawnCount = 8;//显示几个
                this.col = 2;//每列几个
                break;
            case TABLE_TYPE.BIG_NINE:
            case TABLE_TYPE.BIG_ELEVEN:
                itemPrefab = this.longItem;
                this.startX = 180;
                this.startY = 60;
                this.spaceX = 135;
                this.spaceY = 5;
                this.spawnCount = 8;//显示几个
                this.col = 2;//每列几个
                break;
            case TABLE_TYPE.ONE:
                itemPrefab = this.oneItem;
                this.startX = 640 - itemPrefab.data.width / 2;
                this.startY = 320 - itemPrefab.data.height / 2;
                this.spaceX = 0;
                this.spaceY = 0;
                this.spawnCount = 1;//显示几个
                this.col = 1;//每列几个
                this.scrollView.enabled = false;
                this.leftArrow.active = false;
                this.rightArrow.active = false;
                break;
        }

        this.lastContentPosX = 0;

        this.item_width = itemPrefab.data.width;
        let item_height = itemPrefab.data.height
        this.bufferZone = this.scrollView.node.width / 2 + this.item_width / 2 * 3

        this.tableList = data;
        this.toggleList = [];
        this.content_node.removeAllChildren();
        let height = this.content_node.height;
        let j = 0;
        let k = 0;

        let tableNum = this.tableList.length;
        if(tableNum > this.spawnCount){
            tableNum = this.spawnCount;
        }
        for (let i = 0; i < tableNum; i++) {
            j = Math.floor(i / this.col);
            k = i % this.col;
            var item = cc.instantiate(itemPrefab);
            item.getComponent('klb_friend_group_table').updateChairs(tableType, playerCount, roomInfo.id, this.onClickCheckToggleBtn.bind(this));
            item.getComponent('klb_friend_group_table').updateTableInfo(i, this.tableList[i], this.rule, this.isOpen);
            let chairs = item.getComponent('klb_friend_group_table').getHeads();
            item.index = i;
            this.content_node.addChild(item);

            let toggle = item.getComponent(cc.Toggle);
            toggle.idx = this.toggleList.length;
            this.toggleList.push({idx: -1, toggle: toggle});
            for(let j = 0; j < chairs.length; j++){
                let toggle = chairs[j];
                toggle.idx = this.toggleList.length;
                this.toggleList.push({idx: j, toggle: toggle});
            }

            item.y = height / 2 - this.startY - item_height / 2 - (this.spaceY + item_height) * k;
            item.x = this.startX + this.item_width / 2 + (this.item_width + this.spaceX) * j;
        }

        let count = Math.ceil(this.tableList.length / this.col)
        this.content_node.width = this.startX + this.item_width * count + this.spaceX * count;
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
        let isRight = this.scrollView.content.x > this.lastContentPosX;
        // 实际创建项占了多高（即它们的高度累加）
        let count = Math.ceil(items.length / this.col);
        let offset = this.item_width * count + this.spaceX * count;
        let newX = 0;

        // 遍历数组，更新item的位置和显示
        for (let i = 0; i < items.length; ++i) {
            let viewPos = this.getPositionInView(items[i]);
            if (isRight) {
                // 提前计算出该item的新的y坐标
                newX = items[i].x - offset;
                // 如果往下滚动时item已经超出缓冲矩形，且newY未超出content上边界，
                // 则更新item的坐标（即上移了一个offset的位置），同时更新item的显示内容
                if (viewPos.x > this.bufferZone && newX > 0) {
                    items[i].x = newX;
                    let itemId = items[i].index - items.length; // update item id
                    // this.updateItem(items[i], itemId);
                    items[i].getComponent('klb_friend_group_table').updateTableInfo(itemId, this.tableList[itemId], this.rule, this.isOpen);
                    items[i].index = itemId;
                }
            } else {
                // 提前计算出该item的新的y坐标
                newX = items[i].x + offset;
                // 如果往上滚动时item已经超出缓冲矩形，且newY未超出content下边界，
                // 则更新item的坐标（即下移了一个offset的位置），同时更新item的显示内容
                if (viewPos.x < -this.bufferZone && newX < this.content_node.width) {
                    items[i].x = newX;
                    // let item = items[i].getComponent('Item');
                    let itemId = items[i].index + items.length;
                    // this.updateItem(items[i], itemId);
                    items[i].getComponent('klb_friend_group_table').updateTableInfo(itemId, this.tableList[itemId], this.rule, this.isOpen);
                    items[i].index = itemId;
                }
            }
        }

        // 更新lastContentPosX和总项数显示
        this.lastContentPosX = this.scrollView.content.x;
    },

    scrollEvent: function(sender, event) {
        switch(event) {
            case 0:
                // cc.error("Scroll to Top");
                break;
            case 1:
                // cc.error("Scroll to Bottom");
                break;
            case 2:
                // cc.error("Scroll to Left");
                this.leftEnd = true;
                break;
            case 3:
                // cc.error("Scroll to Right");
                this.rightEnd = true;
                break;
            case 4:
                // cc.error("Scrolling");
                this.leftArrow.active = true;
                this.rightArrow.active = true;
                break;
            case 5:
                // cc.error("Bounce Top");
                break;
            case 6:
                // cc.error("Bounce bottom");
                break;
            case 7:
                // cc.error("Bounce left");
                this.leftEnd = true;
                break;
            case 8:
                // cc.error("Bounce right");
                this.rightEnd = true;
                break;
            case 9:
                // cc.error("Auto scroll ended");
                if(this.leftEnd){
                    this.leftArrow.active = false;
                }
                if(this.rightEnd){
                    this.rightArrow.active = false;
                }
                this.leftEnd = false;
                this.rightEnd = false;
                break;
        }
    },

    onClickLeft(){
        let percent = Math.floor(this.scrollView.getScrollOffset().x) / Math.floor(this.scrollView.getMaxScrollOffset().x);
        cc.log(percent);
        this.scrollView.scrollToPercentHorizontal(Math.abs(percent)-0.3, 0.2);
        percent = Math.floor(this.scrollView.getScrollOffset().x) / Math.floor(this.scrollView.getMaxScrollOffset().x);
        cc.log(percent);
    },

    onClickRight(){
        let percent = Math.floor(this.scrollView.getScrollOffset().x) / Math.floor(this.scrollView.getMaxScrollOffset().x);
        cc.log(percent);
        this.scrollView.scrollToPercentHorizontal(Math.abs(percent)+0.3, 0.2);
        percent = Math.floor(this.scrollView.getScrollOffset().x) / Math.floor(this.scrollView.getMaxScrollOffset().x);
        cc.log(percent);
    },

    updateTable(info){
        this.tableList[info.deskNum] = info.room;

        let items = this.content_node.children;
        for (let i = 0; i < items.length; ++i) {
            if(items[i].index == info.deskNum){
                items[i].getComponent('klb_friend_group_table').updateTableInfo(info.deskNum, this.tableList[info.deskNum], this.rule, this.isOpen);

                let ui = cc.dd.UIMgr.getUI(prefab_config.KLB_FG_TABLE_MANAGER)
                if(ui){
                    ui.getComponent('klb_friend_group_manageTable').updatePlayerList(info.deskNum, this.tableList[info.deskNum]);
                }
                break;
            }
        }
    },

    updateTablePlayer(deskNum, playerID){
        let table = this.tableList[deskNum];
        if(table){
            let member = table.membersList;
            for(let  i = 0; i < member.length; i++){
                if(member[i].userid == playerID){
                    member.splice(i, 1);
                    break;
                }
            }

            this.updateTable({deskNum : deskNum, room: table});
        }
    },

    onClickClearHead(){
        for(let j = 0; j < this.toggleList.length; j++){
            if(this.toggleList[j].toggle.isChecked){
                let name = this.toggleList[j].toggle.node.name;
                if(name == 'headNode'){
                    let table = this.toggleList[j].toggle.node.parent.parent;
                    let worldPos = this.toggleList[j].toggle.node.parent.convertToWorldSpaceAR(this.toggleList[j].toggle.node.position);
                    let viewPos = table.convertToNodeSpaceAR(worldPos);
                    let _movePos = table.getComponent('klb_friend_group_table').movePos;
                    let _target = table.getComponent('klb_friend_group_table').kickOutNodes[this.toggleList[j].idx];
                    this.headNodeUnChecked(_target, _movePos, viewPos);
                }else{
                    let table = this.toggleList[j].toggle.node;
                    let _target = table.getComponent('klb_friend_group_table').buttonNode;
                    this.tableUnChecked(_target);
                }
            }
            this.toggleList[j].toggle.isChecked = false;
        }
    },

    headNodeChecked(target, movePos, viewPos){
        target.active = true;
        target.stopAllActions();
        target.setPosition(viewPos);
        target.runAction(
            cc.sequence(
                cc.callFunc(()=>{
                    let buttons = target.getComponentsInChildren(cc.Button);
                    for(let i = 0; i < buttons.length; i++){
                        buttons.enabled = false;
                    }
                }),
                cc.moveTo(0.1, movePos).easing(cc.easeSineIn()),
                cc.callFunc(()=>{
                    let buttons = target.getComponentsInChildren(cc.Button);
                    for(let i = 0; i < buttons.length; i++){
                        buttons.enabled = true;
                    }
                }),
            ));
    },

    headNodeUnChecked(target, movePos, viewPos){
        target.active = true;
        target.stopAllActions();
        target.setPosition(movePos);
        target.runAction(
            cc.sequence(
                cc.callFunc(()=>{
                    let buttons = target.getComponentsInChildren(cc.Button);
                    for(let i = 0; i < buttons.length; i++){
                        buttons.enabled = false;
                    }
                }),
                cc.moveTo(0.1, viewPos).easing(cc.easeSineOut()),
                cc.callFunc(()=>{
                    target.active = false;
                }),
            ));
    },

    tableChecked(target){
        target.active = true;
        target.stopAllActions();
        target.scaleX = 0;
        target.runAction(cc.scaleTo(0.1, 1));
    },

    tableUnChecked(target){
        target.active = true;
        target.stopAllActions();
        target.scaleX = 1;
        target.runAction(
            cc.sequence(
                cc.callFunc(()=>{
                    let buttons = target.getComponentsInChildren(cc.Button);
                    for(let i = 0; i < buttons.length; i++){
                        buttons.enabled = false;
                    }
                }),
                cc.scaleTo(0.1, 0, 1),
                cc.callFunc(()=>{
                    target.active = false;
                })
            ));
    },

    onClickCheckToggleBtn(toggle, movePos, viewPos, target){
        hall_audio_mgr.com_btn_click();

        let name = toggle.node.name;

        if(name == 'headNode'){
            if(toggle.isChecked){
                this.headNodeChecked(target, movePos, viewPos);
            }else{
                this.headNodeUnChecked(target, movePos, viewPos);
            }
        }else{
            if(toggle.isChecked){
                this.tableChecked(target);
            }else{
                this.tableUnChecked(target);
            }
        }

        for(let j = 0; j < this.toggleList.length; j++){
            if(toggle.idx != this.toggleList[j].toggle.idx){
                if(this.toggleList[j].toggle.isChecked){
                    let name = this.toggleList[j].toggle.node.name;
                    if(name == 'headNode'){
                        let table = this.toggleList[j].toggle.node.parent.parent;
                        let worldPos = this.toggleList[j].toggle.node.parent.convertToWorldSpaceAR(this.toggleList[j].toggle.node.position);
                        let viewPos = table.convertToNodeSpaceAR(worldPos);
                        let _movePos = table.getComponent('klb_friend_group_table').movePos;
                        let _target = table.getComponent('klb_friend_group_table').kickOutNodes[this.toggleList[j].idx];
                        this.headNodeUnChecked(_target, _movePos, viewPos);
                    }else{
                        let table = this.toggleList[j].toggle.node;
                        let _target = table.getComponent('klb_friend_group_table').buttonNode;
                        this.tableUnChecked(_target);
                    }
                }
                this.toggleList[j].toggle.isChecked = false;
            }
        }
    },

    updateTableState(isOpen){
        this.isOpen = isOpen;

        let items = this.content_node.children;
        for (let i = 0; i < items.length; ++i) {
            items[i].getComponent('klb_friend_group_table').updateTableInfo(items[i].index, this.tableList[items[i].index], this.rule, this.isOpen);
        }
    }
});
