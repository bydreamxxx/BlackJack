const RummyGroup = require("RummyGroup");
const RummyData = require("RummyData").RummyData.Instance();
const GAME_STATE = require("RummyData").GAME_STATE;
var hall_audio_mgr = require('hall_audio_mgr').Instance();
const RummyGameMgr = require("RummyGameMgr");
const RoomMgr = require('jlmj_room_mgr').RoomMgr;
var AppCfg = require('AppConfig');

const faPaiPos = [cc.v2(-528, 0), cc.v2(-440, 0), cc.v2(-352, 0), cc.v2(-264, 0), cc.v2(-176, 0), cc.v2(-88, 0), cc.v2(0, 0), cc.v2(88, 0), cc.v2(176, 0), cc.v2(264, 0), cc.v2(352, 0), cc.v2(440, 0), cc.v2(528, 0)];
cc.Class({
    extends: cc.Component,

    properties: {
        bottomNode: cc.Node,
        bottomColor: [cc.SpriteFrame],

        showButton: cc.Button,
        groupButton: cc.Button,
        discardButton: cc.Button,

        cardsNodeButton: cc.Node,
        discardNodeButton: cc.Node,

        cardsNodeLight: cc.Node,
        discardNodeLight: cc.Node,

        cardNode: cc.Node,
        showcardNode: cc.Node,
        discardNode: cc.Node,

        touchNode: cc.Node,
        mask: cc.Node,
        invalidShowNode: cc.Node,
        showNode: cc.Node,

        cardPrefab: cc.Prefab,

        point: cc.Label,

        testLabel: cc.Label,
    },

    editor:{
        menu:"Rummy/rummy_group_ui"
    },


    onLoad(){
        // if(!AppCfg.IS_DEBUG)
            this.testLabel.string = '';
        this.regTouchEvent();
        this.clear();
    },

    update(dt){
//         if(RoomMgr.Instance().player_mgr && AppCfg.IS_DEBUG){
//             let player = RoomMgr.Instance().player_mgr.getPlayerById(cc.dd.user.id);
//             if(player) {
//                 this.testLabel.string = `手牌数量：${player.handsList.length} 牌组数量:${[].concat(...player.pokersList).length} first ${this.first} second ${this.second} xcard ${RummyData.xcard}
// 手牌：${player.handsList.toString()}
// 牌组：`;
//                 for(let i = 0; i < player.pokersList.length; i++){
//                     this.testLabel.string += `[${player.pokersList[i].toString()}] `
//                 }
//
//                 this.testLabel.string += `
// `;
//                 for(let i = 0; i < this.groupList.length; i++){
//                     this.testLabel.string += `${this.groupList[i].data.toString()}
// `
//                 }
//
//                 if(this.yidong_pai){
//                     this.testLabel.string += `移动牌：${this.yidong_pai.getCard()}`
//                 }
//             }
//         }

    },

    clear(){
        this.mask.active = false;
        this.node.removeAllChildren();
        this.node.width = 0;
        this.groupList = [];
        this.touchList = [];
        this.first = -1;
        this.second = -1;

        this.cardsNodeButton.active = false;
        this.discardNodeButton.active = false;

        this.cardsNodeLight.active = false;
        this.discardNodeLight.active = false;

        this.point.string = '0';

        this.checkButton();
    },

    checkButton(){
        if(RoomMgr.Instance().player_mgr){
            let player = RoomMgr.Instance().player_mgr.getPlayerById(cc.dd.user.id);
            if(player) {
                this.groupButton.interactable = this.touchList.length > 1 && (RummyData.state === GAME_STATE.PLAYING || RummyData.state === GAME_STATE.GROUPING);
                this.discardButton.interactable = player.handsList.length === 14 && this.touchList.length === 1 && RummyData.turn === cc.dd.user.id && RummyData.state === GAME_STATE.PLAYING;
                this.showButton.interactable = player.handsList.length === 14 && this.touchList.length === 1 && RummyData.turn === cc.dd.user.id && RummyData.state === GAME_STATE.PLAYING;
            }else{
                this.groupButton.interactable = false;
                this.discardButton.interactable = false;
                this.showButton.interactable = false;
            }
        }else{
            this.groupButton.interactable = false;
            this.discardButton.interactable = false;
            this.showButton.interactable = false;
        }
    },

    checkCanMopai(active){
        this.cardsNodeButton.active = active;
        this.discardNodeButton.active = active;

        this.cardsNodeLight.active = active;
        this.discardNodeLight.active = active;
    },

    checkIsInShow(location){
        var tmpRect = this.showcardNode.getBoundingBoxToWorld();
        if(tmpRect.contains(location)){
            return true;
        }
        return false;
    },

    checkIsInDiscard(location){
        var tmpRect = this.discardNode.getBoundingBoxToWorld();
        if(tmpRect.contains(location)){
            return true;
        }
        return false;
    },

    getTouchPai: function (location, reverse) {
        for(let j = 0; j < this.groupList.length; j++){
            let group = this.groupList[j].view;
            if(reverse){
                for (let k = 0; k < group.childrenCount; k++) {
                    let card = group.children[k].getComponent("rummy_card");
                    if (card && card.isTouchDown(location)) {//通过有没有设置过pos去重
                        return card;
                    }
                }
            }else {
                for (let k = group.childrenCount - 1; k >= 0; k--) {
                    let card = group.children[k].getComponent("rummy_card");
                    if (card && card.isTouchDown(location)) {//通过有没有设置过pos去重
                        return card;
                    }
                }
            }
        }

        return null;
    },

    giveUpPoker(cardId){
        this.moveCardToNode(cardId, this.discardNode);
    },

    moveCardToNode(cardId, node){
        let findCard = null;
        for(let j = this.groupList.length - 1; j >= 0; j--){
            let group = this.groupList[j].view;
            for(let k = group.childrenCount - 1; k >= 0 ; k--){
                let card = group.children[k].getComponent("rummy_card");
                if(card && card.getCard() === cardId){
                    this.groupList[j].data.delCard(cardId);
                    findCard = group.children[k];
                    break;
                }
            }

            if(findCard){
                break;
            }
        }

        if(findCard){
            findCard.active = false;
            let playCard = cc.instantiate(this.cardPrefab);
            playCard.getComponent("rummy_card").init(cardId);
            node.addChild(playCard);

            let worldPos = findCard.parent.convertToWorldSpaceAR(findCard.position);
            let startPos = node.convertToNodeSpaceAR(worldPos);

            playCard.position = startPos;
            playCard.scaleX = 0.75;
            playCard.scaleY= 0.75;
            playCard.zIndex = 0;

            this.removeCardFromGroup(findCard);
            this.updateGroupBottomAll();

            this.updatePoint();

            cc.tween(playCard)
                .to(0.4 * RummyData.PLAY_SPEED, {position: cc.v2(0, 0), scale: 0.538}, { easing: 'expoOut'})
                .call(()=>{
                    this.resetSelected();
                })
                .start();
        }
    },

    moveTouchCardToNode(node, callback){
        if(this.touchList.length === 1) {
            let cardId = this.touchList[0].getCard();
            let groupId = -1;
            for (let j = 0; j < this.groupList.length; j++) {
                let group = this.groupList[j].view;
                if (group === this.touchList[0].node.parent) {
                    this.groupList[j].data.delCard(cardId);
                    groupId = j;
                    break;
                }
            }


            this.touchList[0].node.active = false;
            let playCard = cc.instantiate(this.cardPrefab);
            playCard.getComponent("rummy_card").init(cardId);
            node.addChild(playCard);

            let worldPos = this.touchList[0].node.parent.convertToWorldSpaceAR(this.touchList[0].node.position);
            let startPos = node.convertToNodeSpaceAR(worldPos);

            playCard.position = startPos;
            playCard.scaleX = 0.75;
            playCard.scaleY = 0.75;
            playCard.zIndex = 0;

            this.removeCardFromGroup(this.touchList[0].node);
            this.updateGroupBottomAll();
            this.updatePoint();

            cc.tween(playCard)
                .to(0.4 * RummyData.PLAY_SPEED, {position: cc.v2(0, 0), scale: 0.538}, {easing: 'expoOut'})
                .call(() => {
                    if (callback) {
                        callback(cardId, groupId);
                    }

                    this.resetSelected();
                })
                .start();
        }
    },

    moveYidongCardToNode(node, callback){
        let cardId = this.yidong_pai.getCard();
        let groupId = -1;

        for(let j = 0; j < this.groupList.length; j++){
            let group = this.groupList[j].view;
            if(this.pai_touched.node.parent === group){
                this.groupList[j].data.delCard(cardId);
                groupId = j;
                break;

            }
        }

        this.pai_touched.node.active = false;

        let worldPos = node.convertToWorldSpaceAR(cc.v2(0, 0));
        let endPos = this.node.convertToNodeSpaceAR(worldPos);

        this.removeCardFromGroup(this.pai_touched.node);
        this.updateGroupBottomAll();
        this.updatePoint();

        cc.tween(this.yidong_pai.node)
            .to(0.4 * RummyData.PLAY_SPEED, {position: endPos, scale: 0.717}, {easing: 'expoOut'})
            .call(() => {
                this.yidong_pai.node.destroy();
                this.yidong_pai = null;

                let playCard = cc.instantiate(this.cardPrefab);
                playCard.getComponent("rummy_card").init(cardId);
                node.addChild(playCard);
                playCard.scaleX = 0.538;
                playCard.scaleY= 0.538;

                if(callback){
                    callback(cardId, groupId);
                }
            })
            .start();
    },

    onClickCloseShow(event, data){
        hall_audio_mgr.com_btn_click();
        this.showNode.active = false;
        if(this.yidong_pai){
            this.yidong_pai.node.destroy();
            this.yidong_pai = null;
            this.pai_touched.node.active = true;
        }
        this.resetSelected();
    },

    onClickConfirm(event, data){
        hall_audio_mgr.com_btn_click();

        if(RummyData.state !== GAME_STATE.GROUPING){
            return;
        }

        let player = RoomMgr.Instance().player_mgr.getPlayerById(cc.dd.user.id);
        if(player) {
            var msg = new cc.pb.rummy.msg_rm_commit_req();
            let groupsList = []
            player.pokersList.forEach(group => {
                let groupmsg = new cc.pb.rummy.rm_group();
                groupmsg.setCardsList(group);
                groupsList.push(groupmsg);
            });
            msg.setGroupsList(groupsList);
            cc.gateNet.Instance().sendMsg(cc.netCmd.rummy.cmd_msg_rm_commit_req, msg, "msg_rm_commit_req", true);
            cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'msg_rm_commit_req');
        }
    },

    onClickGroup(event, data){
        hall_audio_mgr.com_btn_click();
        if(this.touchList.length > 1){
            let player = RoomMgr.Instance().player_mgr.getPlayerById(cc.dd.user.id);
            if(player){
                let list = []
                this.touchList.forEach(card=>{
                    let cardID = card.getCard();
                    list.push(cardID);

                    for(let j = this.groupList.length - 1; j >= 0; j--){
                        if(this.groupList[j].view === card.node.parent){
                            this.groupList[j].data.delCard(cardID);

                            let index = player.pokersList[j].indexOf(cardID);
                            if(index !== -1) {
                                player.pokersList[j].splice(index, 1);
                            }
                            break;
                        }
                    }

                    this.removeCardFromGroup(card.node);
                })

                player.pokersList.unshift(list);
                for(let i = player.pokersList.length - 1; i >= 0; i--){
                    let group = player.pokersList[i];
                    if(group.length === 0){
                        player.pokersList.splice(i, 1);
                    }
                }

                let node = new cc.Node(`RummyGroup_${this.groupList.length}`);
                node.height = 288;
                this.node.addChild(node);

                let group = new RummyGroup();
                group.init(list);

                if(!group.isNoCorrect() && !group.isNoGroup()){
                    if(AudioManager.getAudioID("blackjack_rummy/audio/rummyPositiveGroup") == -1) {
                        AudioManager.playSound("blackjack_rummy/audio/rummyPositiveGroup");
                    }
                }

                let groupInfo = {data: group, view: node, bottom:null};
                this.groupList.unshift(groupInfo);

                let showList = group.getShowList();
                for(let j = 0; j < showList.length; j++){
                    let card = cc.instantiate(this.cardPrefab);
                    card.getComponent("rummy_card").init(showList[j]);
                    node.addChild(card);
                }
                node.width = 208 * showList.length - 60 * (showList.length - 1);

                this.updateCardPos(node);

                let bottom = cc.instantiate(this.bottomNode);
                node.addChild(bottom);
                groupInfo.bottom = bottom;
                bottom.width = node.width;
                bottom.y = -109;
                bottom.x = 0;
                bottom.scale = 1;

                this.updateGroupBottomAll();

                this.node.width += node.width + 30;
                this.updateGroupPos();

                this.updateBaida();
                this.updatePoint();

                this.setPaiTouch(RummyData.state === GAME_STATE.PLAYING || RummyData.state === GAME_STATE.GROUPING);

                if(player.handsList.length === 13){
                    var msg = new cc.pb.rummy.msg_rm_group_req();
                    let groupsList = []
                    player.pokersList.forEach(group=>{
                        let groupmsg = new cc.pb.rummy.rm_group();
                        groupmsg.setCardsList(group);
                        groupsList.push(groupmsg);
                    });
                    msg.setGroupsList(groupsList);
                    cc.gateNet.Instance().sendMsg(cc.netCmd.rummy.cmd_msg_rm_group_req, msg, "msg_rm_group_req", true);
                    cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'msg_rm_group_req');
                }

                player.saveGroups();

                if(AudioManager.getAudioID("blackjack_rummy/audio/rummyGroup") == -1) {
                    AudioManager.playSound("blackjack_rummy/audio/rummyGroup");
                }
            }

            this.resetSelected();
        }
    },

    onClickDiscard(event, data){
        hall_audio_mgr.com_btn_click();

        if(RummyData.state !== GAME_STATE.PLAYING){
            return;
        }

        if(this.first !== -1 && this.second !== -1 && this.point.string === '0'){
            this.moveTouchCardToNode(this.showcardNode, (cardId, groupId)=>{
                let player = RoomMgr.Instance().player_mgr.getPlayerById(cc.dd.user.id);
                if(player){
                    let tempList = player.pokersList.concat();
                    if(tempList[groupId]){
                        let index = tempList[groupId].indexOf(cardId);
                        tempList[groupId].splice(index, 1);
                        if(tempList[groupId].length === 0){
                            tempList.splice(groupId, 1);
                        }
                    }else{
                        cc.error(`show groupId error ${groupId} ${cardId} ${player.pokersList.toString()}`);
                    }

                    var msg = new cc.pb.rummy.msg_rm_show_req();
                    msg.setCard(cardId);
                    let groupsList = []
                    tempList.forEach(group=>{
                        let groupmsg = new cc.pb.rummy.rm_group();
                        groupmsg.setCardsList(group);
                        groupsList.push(groupmsg);
                    });
                    msg.setGroupsList(groupsList);
                    msg.setGroupId(groupId);
                    cc.gateNet.Instance().sendMsg(cc.netCmd.rummy.cmd_msg_rm_show_req, msg, "msg_rm_show_req", true);
                    cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'msg_rm_show_req');
                }
            })
        }else{
            this.moveTouchCardToNode(this.discardNode, (cardId, groupId)=>{
                var msg = new cc.pb.rummy.msg_rm_give_up_poker_req();
                msg.setCard(cardId);
                msg.setGroupId(groupId);
                cc.gateNet.Instance().sendMsg(cc.netCmd.rummy.cmd_msg_rm_give_up_poker_req, msg, "msg_rm_give_up_poker_req", true);
                cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'msg_rm_give_up_poker_req');

                // let temp = this.giveUpCard;
                // cc.tween(this.node)
                //     .delay(0.01 * RummyData.PLAY_SPEED)
                //     .call(()=>{
                //         let handler = require("net_handler_rummy");
                //         handler.on_msg_rm_give_up_poker_ack({ ret: 0,
                //             card: temp});
                //     })
                //     .start()
            })
        }
    },

    onClickGetCard(event, data){
        // hall_audio_mgr.com_btn_click();

        if(RummyData.state !== GAME_STATE.PLAYING){
            return;
        }

        var msg = new cc.pb.rummy.msg_rm_poker_req();
        msg.setType(data);
        cc.gateNet.Instance().sendMsg(cc.netCmd.rummy.cmd_msg_rm_poker_req, msg, "msg_rm_poker_req", true);
        cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'msg_rm_poker_req');

        this.cardsNodeButton.active = false;
        this.discardNodeButton.active = false;
    },

    onClickShow(event, data){
        hall_audio_mgr.com_btn_click();

        if(RummyData.state !== GAME_STATE.PLAYING){
            return;
        }

        this.showNode.active = false;

        if(this.yidong_pai){
            this.moveYidongCardToNode(this.showcardNode, (cardId, groupId)=>{
                let player = RoomMgr.Instance().player_mgr.getPlayerById(cc.dd.user.id);
                if(player) {
                    var msg = new cc.pb.rummy.msg_rm_show_req();
                    msg.setCard(cardId);
                    let groupsList = []
                    player.pokersList.forEach(group => {
                        let groupmsg = new cc.pb.rummy.rm_group();
                        groupmsg.setCardsList(group);
                        groupsList.push(groupmsg);
                    });
                    msg.setGroupsList(groupsList);
                    msg.setGroupId(groupId);
                    cc.gateNet.Instance().sendMsg(cc.netCmd.rummy.cmd_msg_rm_show_req, msg, "msg_rm_show_req", true);
                    cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'msg_rm_show_req');
                }
                this.pai_touched = null;
                this.checkButton();
            })
        }else{
            this.moveTouchCardToNode(this.showcardNode, (cardId, groupId)=>{
                let player = RoomMgr.Instance().player_mgr.getPlayerById(cc.dd.user.id);
                if(player){
                    let tempList = player.pokersList.concat();
                    if(tempList[groupId]){
                        let index = tempList[groupId].indexOf(cardId);
                        tempList[groupId].splice(index, 1);
                        if(tempList[groupId].length === 0){
                            tempList.splice(groupId, 1);
                        }
                    }else{
                        cc.error(`show groupId error ${groupId} ${cardId} ${player.pokersList.toString()}`);
                    }

                    var msg = new cc.pb.rummy.msg_rm_show_req();
                    msg.setCard(cardId);
                    let groupsList = []
                    tempList.forEach(group=>{
                        let groupmsg = new cc.pb.rummy.rm_group();
                        groupmsg.setCardsList(group);
                        groupsList.push(groupmsg);
                    });
                    msg.setGroupsList(groupsList);
                    msg.setGroupId(groupId);
                    cc.gateNet.Instance().sendMsg(cc.netCmd.rummy.cmd_msg_rm_show_req, msg, "msg_rm_show_req", true);
                    cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'msg_rm_show_req');
                }


                // let temp = this.showCardID;
                // cc.tween(this.node)
                //     .delay(0.01 * RummyData.PLAY_SPEED)
                //     .call(()=>{
                //         let handler = require("net_handler_rummy");
                //         handler.on_msg_rm_show_ack({ ret: -1,
                //             userId: cc.dd.user.id,
                //             showCard: temp});
                //     })
                //     .start()
            })
        }
        this.resetSelected();
    },

    onClickShowShow(event, data){
        if(RummyData.state !== GAME_STATE.PLAYING){
            return;
        }

        // if(this.first !== -1 && this.second !== -1 && this.point.string === '0'){
        //     this.onClickShow();
        // }else{
            hall_audio_mgr.com_btn_click();
            this.showNode.active = true;
        // }

    },

    onClickCloseInvalidShow(event, data){
        hall_audio_mgr.com_btn_click();
        this.invalidShowNode.active = false;
    },

    removeCardFromGroup(delCard){
        let group = delCard.parent;
        delCard.removeFromParent();
        delCard.destroy();

        group.width -= 148;
        this.updateCardPos(group);

        this.node.width -= 148;

        if(group.childrenCount === 1){
            this.node.width -= 90;
            for(let j = this.groupList.length - 1; j >= 0; j--){
                if(this.groupList[j].view === group){
                    this.groupList.splice(j, 1);
                    break;
                }
            }
            group.destroy();
        }

        this.updateGroupPos();
    },

    regTouchEvent: function () {
        this.touchNode.on(cc.Node.EventType.TOUCH_START, this.touchStart.bind(this));
        this.touchNode.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove.bind(this));
        this.touchNode.on(cc.Node.EventType.TOUCH_END, this.touchEnd.bind(this));
        this.touchNode.on(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel.bind(this));
        this.touchNode._touchListener.setSwallowTouches(false);
    },

    /**
     * 恢复所有牌的初始化位置
     */
    resetSelected: function () {
        if(this.touchList && this.touchList.length > 0){
            if(AudioManager.getAudioID("blackjack_rummy/audio/rummyCardDeselect") == -1) {
                AudioManager.playSound("blackjack_rummy/audio/rummyCardDeselect");
            }
        }
        this.touchList = [];
        for(let j = 0; j < this.groupList.length; j++){
            let group = this.groupList[j].view;
            for(let k = 0; k < group.childrenCount; k++){
                let card = group.children[k].getComponent("rummy_card");
                if(card){//通过有没有设置过pos去重
                    card.selected = false;
                    card.tag = "";
                    group.children[k].y = 0;
                }
            }
        }

        this.checkButton();
    },

    setPaiTouch(enable){
        for(let j = 0; j < this.groupList.length; j++){
            let group = this.groupList[j].view;
            for(let k = 0; k < group.childrenCount; k++){
                let card = group.children[k].getComponent("rummy_card");
                if(card ){
                    card.setTouchAble(enable);
                }
            }
        }
    },

    showCard(cardId){
        this.moveCardToNode(cardId, this.showcardNode);
    },

    showFapai(groupList, handCardList){
        if(RummyData.lastState !== GAME_STATE.WAITING && RummyData.state === GAME_STATE.DEALING){
            this.clear();
            this.showFapaiDirect(groupList);

            let player = RoomMgr.Instance().player_mgr.getPlayerById(cc.dd.user.id);
            if(player){
                player.setPaiTouch(RummyData.state === GAME_STATE.PLAYING || RummyData.state === GAME_STATE.GROUPING)

                if(RummyData.turn === cc.dd.user.id){
                    player.checkCanMoPai();
                }
            }

            this.checkButton();
            RummyGameMgr.updateBaida();
            return;
        }

        this.showFapaiDirect(groupList, true);

        if(handCardList.length !== faPaiPos.length){
            cc.error(`手牌数量错误 ${handCardList}`);
            return;
        }
        this.setPaiTouch(false);

        this.isFaPai = true;

        this.groupList.forEach(group=>{
            group.view.active = false;
            group.bottom.active = false;
        });

        this.playList = [];

        let worldPos = this.cardNode.convertToWorldSpaceAR(cc.v2(0, 0));
        let startPos = this.node.convertToNodeSpaceAR(worldPos);

        for(let i = handCardList.length - 1; i >= 0; i--){
            for(let j = 0; j < this.groupList.length; j++){
                let group = this.groupList[j].view;
                let node = null;
                for(let k = 0; k < group.childrenCount; k++){
                    let card = group.children[k].getComponent("rummy_card");
                    if(card && card.getCard() === handCardList[i] && !card.targetPos){//通过有没有设置过pos去重
                        node = group.children[k];
                        card.setTargetPos(node.position);

                        let group_worldPos = this.node.convertToWorldSpaceAR(faPaiPos[i]);
                        let group_startPos = group.convertToNodeSpaceAR(group_worldPos);
                        node.position = group_startPos;


                        let playCard = cc.instantiate(this.cardPrefab);
                        playCard.getComponent("rummy_card").init(0);
                        this.node.addChild(playCard);
                        playCard.position = startPos;
                        playCard.scaleX = 0.717;
                        playCard.scaleY= 0.717;
                        playCard.getComponent("rummy_card").setTargetValue(handCardList[i]);
                        playCard.getComponent("rummy_card").setTargetPos(faPaiPos[i]);
                        playCard.zIndex = i;

                        this.playList.unshift(playCard);
                        break;
                    }
                }

                if(node !== null){
                    break;
                }
            }
        }

        let index = 0;

        let endFunc = ()=>{
            this.playList.forEach(node=>{
                node.destroy();
            })

            if(AudioManager.getAudioID("blackjack_rummy/audio/rummyGroup") == -1) {
                AudioManager.playSound("blackjack_rummy/audio/rummyGroup");
            }

            this.groupList.forEach(group=>{
                group.view.active = true;
                group.bottom.active = !group.data.isNoGroup();
                group.bottom.scaleY = 0;
                cc.tween(group.bottom)
                    .delay(0.4 * RummyData.PLAY_SPEED)
                    .to(0.3 * RummyData.PLAY_SPEED, {scaleY: 1}, { easing: 'quintOut'})
                    .start()

                for(let k = 0; k < group.view.childrenCount; k++){
                    let card = group.view.children[k].getComponent("rummy_card");
                    if(card){
                        let node = group.view.children[k];
                        cc.tween(node)
                            .to(0.4 * RummyData.PLAY_SPEED, {position: card.targetPos}, { easing: 'expoOut'})
                            .start();
                    }
                }
            });

            this.updatePoint();
            this.isFaPai = false;
        }

        if(AudioManager.getAudioID("blackjack_rummy/audio/rummyDeal") == -1) {
            AudioManager.playSound("blackjack_rummy/audio/rummyDeal");
        }

        this.scheduleOnce(()=>{
            if(AudioManager.getAudioID("blackjack_rummy/audio/rummyDealFlip") == -1) {
                AudioManager.playSound("blackjack_rummy/audio/rummyDealFlip");
            }
        }, 2.3 * RummyData.PLAY_SPEED)

        this.schedule(()=>{
            let node = this.playList[index];
            index++;

            if(index >= this.playList.length){
                cc.tween(node)
                    .delay(0.3 * RummyData.PLAY_SPEED)
                    .to(1 * RummyData.PLAY_SPEED, {position: node.getComponent("rummy_card").targetPos, scale: 1}, { easing: 'expoOut'})
                    .delay(1 * RummyData.PLAY_SPEED)
                    .to(0.25 * RummyData.PLAY_SPEED, {scaleX: 0}, { easing: 'sineOut'})
                    .call(()=> {
                        node.getComponent("rummy_card").init(node.getComponent("rummy_card").targetValue);
                    })
                    .to(0.25 * RummyData.PLAY_SPEED, {scaleX: 1}, { easing: 'sineIn'})
                    .delay(0.5 * RummyData.PLAY_SPEED)
                    .call(endFunc)
                    .start();
            }else{
                cc.tween(node)
                    .delay(0.3 * RummyData.PLAY_SPEED)
                    .to(1 * RummyData.PLAY_SPEED, {position: node.getComponent("rummy_card").targetPos, scale: 1}, { easing: 'expoOut'})
                    .delay(1 * RummyData.PLAY_SPEED)
                    .to(0.25 * RummyData.PLAY_SPEED, {scaleX: 0}, { easing: 'sineOut'})
                    .call(()=> {
                        node.getComponent("rummy_card").init(node.getComponent("rummy_card").targetValue);
                    })
                    .to(0.25 * RummyData.PLAY_SPEED, {scaleX: 1}, { easing: 'sineIn'})
                    .start();
            }
        }, 0.05 * RummyData.PLAY_SPEED, this.playList.length - 1);
    },

    showFapaiDirect(groupList, notShowPoint){
        this.groupList = [];
        let width = 0;

        this.first = -1;
        this.second = -1;

        for(let i = 0; i < groupList.length; i++){
            let node = new cc.Node(`RummyGroup_${i}`);
            node.height = 288;
            this.node.addChild(node);

            let cardList = groupList[i];
            let group = new RummyGroup();
            group.init(cardList);

            let groupInfo = {data: group, view: node, bottom:null};
            this.groupList.push(groupInfo);

            let showList = group.getShowList();
            for(let j = 0; j < showList.length; j++){
                let card = cc.instantiate(this.cardPrefab);
                card.getComponent("rummy_card").init(showList[j]);
                node.addChild(card);
            }
            node.width = 208 * showList.length - 60 * (showList.length - 1);

            this.updateCardPos(node);

            let bottom = cc.instantiate(this.bottomNode);
            node.addChild(bottom);
            groupInfo.bottom = bottom;
            bottom.width = node.width;
            bottom.y = -109;
            bottom.x = 0;
            bottom.scale = 1;

            // this.updateGroupBottom(groupInfo, i);

            width += node.width;
        }

        this.updateGroupBottomAll();

        this.node.width = width + 30 * (groupList.length - 1);
        this.updateGroupPos();

        if(!notShowPoint){
            this.updatePoint();
        }

        this.setPaiTouch(RummyData.state === GAME_STATE.PLAYING || RummyData.state === GAME_STATE.GROUPING);
    },

    showInvalidShow(){
        this.invalidShowNode.active = true;
        this.invalidShowNode.getComponent("rummy_invalid_show").show(this.first !== -1, this.second !== -1, this.point.string === '0');
    },

    showMoPai(cardId, type){
        let startNode = type === 0 ? this.cardNode : this.discardNode;
        let lastGroup = this.groupList[this.groupList.length - 1];
        let worldPos = startNode.convertToWorldSpaceAR(cc.v2(0, 0));
        let startPos = this.node.convertToNodeSpaceAR(worldPos);

        let card = cc.instantiate(this.cardPrefab);
        card.getComponent("rummy_card").init(cardId);
        card.active = false;

        let offset = 0;
        let node = null;

        let player = RoomMgr.Instance().player_mgr.getPlayerById(cc.dd.user.id);
        if(player){

            if(AudioManager.getAudioID("blackjack_rummy/audio/rummyPickDiscard") == -1) {
                AudioManager.playSound("blackjack_rummy/audio/rummyPickDiscard");
            }

            // if(lastGroup.data.isNoGroup() || lastGroup.data.isNoCorrect()){
            if(this.groupList.length >= 5){
                player.pokersList[player.pokersList.length - 1].push(cardId);
                lastGroup.data.addCard(cardId);

                // this.updateGroupBottom(lastGroup, this.groupList.length - 1);

                lastGroup.bottom.removeFromParent(false);
                node = lastGroup.view;
                node.addChild(card);
                node.width += 148;
                node.x += 74;
                node.addChild(lastGroup.bottom);

                this.updateCardPos(node);

                this.node.width += 148;

                offset = 74;
            }else{
                player.pokersList.push([cardId]);
                node = new cc.Node(`RummyGroup_${this.groupList.length}`);
                node.height = 288;
                this.node.addChild(node);

                let cardList = [cardId];
                let group = new RummyGroup();
                group.init(cardList);

                let groupInfo = {data: group, view: node, bottom:null};
                this.groupList.push(groupInfo);


                node.addChild(card);

                node.width = 208;
                node.x = this.node.width / 2 + 30 + 104;

                this.node.width += 238;

                let bottom = cc.instantiate(this.bottomNode);
                node.addChild(bottom);
                groupInfo.bottom = bottom;
                bottom.width = node.width;
                bottom.y = -109;
                bottom.x = 0;
                bottom.scale = 1;

                // this.updateGroupBottom(groupInfo, this.groupList.length - 1);

                offset = 119;
            }
        }

        node.x -= offset;
        worldPos = node.convertToWorldSpaceAR(card.position);
        let endPos = this.node.convertToNodeSpaceAR(worldPos);
        node.x += offset;

        let playCard = cc.instantiate(this.cardPrefab);
        this.node.addChild(playCard);
        playCard.position = startPos;
        playCard.scaleX = 0.717;
        playCard.scaleY= 0.717;
        playCard.zIndex = 0;


        let endCall = ()=>{
            card.active = true;
            playCard.destroy();
            card.getComponent("rummy_card").setTouchAble(true);

            this.updateGroupBottomAll();
            this.updatePoint();
            this.updateBaida();
        };

        if(type === 0){
            playCard.getComponent("rummy_card").init(0);

            cc.tween(playCard)
                .to(0.3 * RummyData.PLAY_SPEED, {scale: 1, position: endPos}, { easing: 'expoOut'})
                .to(0.3 * RummyData.PLAY_SPEED, {scaleX: 0}, { easing: 'sineOut'})
                .call(()=>{
                    playCard.getComponent("rummy_card").init(cardId);
                })
                .to(0.3 * RummyData.PLAY_SPEED, {scaleX: 1}, { easing: 'sineIn'})
                .call(endCall)
                .start()
        }else{
            playCard.getComponent("rummy_card").init(cardId);

            cc.tween(playCard)
                .to(0.3 * RummyData.PLAY_SPEED, {scale: 1, position: endPos}, { easing: 'expoOut'})
                .call(endCall)
                .start()
        }

        for(let j = 0; j < this.groupList.length; j++) {
            let group = this.groupList[j].view;
            cc.tween(group)
                .by(0.3 * RummyData.PLAY_SPEED, {x: -offset}, { easing: 'quartOut'})
                .start()
        }
    },


    touchStart: function (event) {
        if(this.isFaPai){
            return;
        }

        this.isCanMove = new Date().getTime();
        let pai_touched = this.getTouchPai(event.touch.getLocation());
        if(pai_touched){
            this.touch_pos = event.touch.getLocation();

            pai_touched.tag = "move";
            this.pai_touched = pai_touched;
        }
    },

    touchMove: function (event) {
        if(this.isFaPai){
            return;
        }

        if (this.pai_touched){
            if(new Date().getTime() - this.isCanMove > 50 || this.isCanMove == null) {
                this.isCanMove = null;

                if(this.yidong_pai){
                    this.yidong_pai.node.position = this.node.convertToNodeSpaceAR(event.touch.getLocation());
                }else if(cc.Vec2.distance(event.touch.getLocation(), this.touch_pos) >= 50){
                    let node = cc.instantiate(this.pai_touched.node);
                    this.yidong_pai = node.getComponent("rummy_card");
                    this.yidong_pai.init(this.pai_touched.getCard());
                    this.node.addChild(node);
                    let worldPos = this.pai_touched.node.parent.convertToWorldSpaceAR(this.pai_touched.node.position);
                    let startPos = this.node.convertToNodeSpaceAR(worldPos);
                    node.position = startPos;

                    this.yidong_pai.node.active = true;
                    this.pai_touched.node.active = false;
                }

                if(this.yidong_pai){
                    let pai_touched = this.getTouchPai(event.touch.getLocation(), event.touch.getLocationX() >= this.pai_touched.node.x);
                    if(pai_touched){
                        if(pai_touched.tag !== "move"){
                            if(AudioManager.getAudioID("blackjack_rummy/audio/rummyCardSlide") == -1) {
                                AudioManager.playSound("blackjack_rummy/audio/rummyCardSlide");
                            }

                            let player = RoomMgr.Instance().player_mgr.getPlayerById(cc.dd.user.id);
                            if(player){
                                let cardID1 = this.pai_touched.getCard();
                                let cardID2 = pai_touched.getCard();
                                let touch_group_index1 = -1;
                                let touch_card_index1 = this.pai_touched.node.getSiblingIndex();
                                let touch_group_index2 = -1;
                                let touch_card_index2 = pai_touched.node.getSiblingIndex();
                                for(let j = this.groupList.length - 1; j >= 0; j--){
                                    if(this.groupList[j].view === this.pai_touched.node.parent){
                                        touch_group_index1 = j;
                                    }

                                    if(this.groupList[j].view === pai_touched.node.parent){
                                        touch_group_index2 = j;
                                    }
                                }

                                this.groupList[touch_group_index1].data.delCard(cardID1);
                                this.groupList[touch_group_index2].data.addCard(cardID1);

                                this.pai_touched.node.removeFromParent(false);
                                this.groupList[touch_group_index1].view.width -= 148;
                                this.updateCardPos(this.groupList[touch_group_index1].view);

                                let parent = this.groupList[touch_group_index2].view;
                                parent.addChild(this.pai_touched.node);
                                this.pai_touched.node.setSiblingIndex(touch_card_index2);
                                this.groupList[touch_group_index2].bottom.setSiblingIndex(parent.childrenCount);

                                parent.width += 148;
                                this.updateCardPos(this.groupList[touch_group_index2].view);
                                this.updateGroupPos();


                                let index1 = player.pokersList[touch_group_index1].indexOf(cardID1);
                                if(index1 !== -1) {
                                    player.pokersList[touch_group_index1].splice(index1, 1);
                                }

                                if(event.touch.getLocationX() < this.pai_touched.node.x){
                                    //插到左边
                                    player.pokersList[touch_group_index2].splice(touch_card_index2-1, 0, cardID1);
                                }else {
                                    //插到右边
                                    player.pokersList[touch_group_index2].splice(touch_card_index2, 0, cardID1);
                                }

                                if(!this.groupList[touch_group_index2].data.isNoCorrect() && !this.groupList[touch_group_index2].data.isNoGroup()){
                                    if(AudioManager.getAudioID("blackjack_rummy/audio/rummyPositiveGroup") == -1) {
                                        AudioManager.playSound("blackjack_rummy/audio/rummyPositiveGroup");
                                    }
                                }

                                this.updateGroupBottomAll();
                            }
                        }
                    }
                }
            }
        }
    },

    touchEnd: function (event) {
        if(this.isFaPai){
            return;
        }
        
        if(!this.pai_touched){
            this.resetSelected();
            return;
        }

        this.pai_touched.tag = '';

        if(!this.yidong_pai){
            if(!this.pai_touched.selected){
                this.pai_touched.selected = true;
                this.pai_touched.node.y = 48;
                this.touchList.push(this.pai_touched);

                if(AudioManager.getAudioID("blackjack_rummy/audio/rummyCardSelect") == -1) {
                    AudioManager.playSound("blackjack_rummy/audio/rummyCardSelect");
                }
            }else{
                this.pai_touched.selected = false;
                this.pai_touched.node.y = 0;
                let index = this.touchList.indexOf(this.pai_touched);
                if(index !== -1){
                    this.touchList.splice(index, 1);
                }
                if(AudioManager.getAudioID("blackjack_rummy/audio/rummyCardDeselect") == -1) {
                    AudioManager.playSound("blackjack_rummy/audio/rummyCardDeselect");
                }
            }
        }else{
            let player = RoomMgr.Instance().player_mgr.getPlayerById(cc.dd.user.id);
            if(player) {
                if(this.checkIsInShow(event.touch.getLocation()) && player.handsList.length === 14 && RummyData.turn === cc.dd.user.id && RummyData.state === GAME_STATE.PLAYING){
                    this.showNode.active = true;
                    return;
                }else if(this.checkIsInDiscard(event.touch.getLocation()) && player.handsList.length === 14 && RummyData.turn === cc.dd.user.id && RummyData.state === GAME_STATE.PLAYING){
                    if(this.first !== -1 && this.second !== -1 && this.point.string === '0'){
                        this.moveYidongCardToNode(this.showcardNode, (cardId, groupId)=>{
                            var msg = new cc.pb.rummy.msg_rm_show_req();
                            msg.setCard(cardId);
                            let groupsList = []
                            player.pokersList.forEach(group=>{
                                let groupmsg = new cc.pb.rummy.rm_group();
                                groupmsg.setCardsList(group);
                                groupsList.push(groupmsg);
                            });
                            msg.setGroupsList(groupsList);
                            msg.setGroupId(groupId);
                            cc.gateNet.Instance().sendMsg(cc.netCmd.rummy.cmd_msg_rm_show_req, msg, "msg_rm_show_req", true);
                            cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'msg_rm_show_req');
                        })
                    }else{
                        this.moveYidongCardToNode(this.discardNode, (cardId, groupId)=>{
                            var msg = new cc.pb.rummy.msg_rm_give_up_poker_req();
                            msg.setCard(cardId);
                            msg.setGroupId(groupId);
                            cc.gateNet.Instance().sendMsg(cc.netCmd.rummy.cmd_msg_rm_give_up_poker_req, msg, "msg_rm_give_up_poker_req", true);
                            cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'msg_rm_give_up_poker_req');
                        })
                    }
                }else{
                    let pai_touched = this.getTouchPai(event.touch.getLocation());
                    if(pai_touched){
                        for(let j = this.groupList.length - 1; j >= 0; j--){
                            if(this.groupList[j].view.childrenCount === 1){
                                this.groupList[j].view.destroy();
                                this.groupList.splice(j, 1);
                                this.node.width -= 90;
                            }
                        }

                        for(let i = player.pokersList.length - 1; i >= 0; i--){
                            let group = player.pokersList[i];
                            if(group.length === 0){
                                player.pokersList.splice(i, 1);
                            }
                        }

                        this.updateGroupBottomAll();

                        for(let j = this.groupList.length - 1; j >= 0; j--){
                            this.updateCardPos(this.groupList[j].view);
                        }

                        this.updateGroupPos();
                        this.updateBaida();
                        this.updatePoint();

                        this.setPaiTouch(RummyData.state === GAME_STATE.PLAYING || RummyData.state === GAME_STATE.GROUPING);

                        if(player.handsList.length === 13){
                            var msg = new cc.pb.rummy.msg_rm_group_req();
                            let groupsList = []
                            player.pokersList.forEach(group=>{
                                let groupmsg = new cc.pb.rummy.rm_group();
                                groupmsg.setCardsList(group);
                                groupsList.push(groupmsg);
                            });
                            msg.setGroupsList(groupsList);
                            cc.gateNet.Instance().sendMsg(cc.netCmd.rummy.cmd_msg_rm_group_req, msg, "msg_rm_group_req", true);
                            cc.dd.NetWaitUtil.net_wait_start('网络状况不佳...', 'msg_rm_group_req');
                        }

                        player.saveGroups();
                    }
                    this.yidong_pai.node.destroy();
                    this.yidong_pai = null;
                    this.pai_touched.node.active = true;
                }
            }else{
                this.yidong_pai.node.destroy();
                this.yidong_pai = null;
                this.pai_touched.node.active = true;
            }
        }

        this.pai_touched = null;

        this.checkButton();
    },

    touchCancel: function (event) {
        this.resetSelected();

        if(this.yidong_pai){
            this.yidong_pai.node.destroy();
            this.yidong_pai = null;
        }
        if(this.pai_touched){
            this.pai_touched.tag = '';
            this.pai_touched.node.active = true;
        }
        this.pai_touched = null;
    },

    updateBaida(){
        for(let j = 0; j < this.groupList.length; j++){
            let group = this.groupList[j].view;
            for(let k = 0; k < group.childrenCount; k++){
                let card = group.children[k].getComponent("rummy_card");
                if(card){//通过有没有设置过pos去重
                    if(RummyData.isBaida(card.getCard())){
                        card.showMask();
                    }else{
                        card.hideMask();
                    }
                }
            }
        }
    },

    updateCardPos(group){
        let start = -group.width / 2;
        for(let j = 0; j < group.childrenCount; j++){
            let _card = group.children[j];
            if(_card.getComponent("rummy_card")){
                _card.x = start + _card.width / 2;
                start += (_card.width - 60);
            }else{
                _card.width = group.width;//这个是底
            }
        }
    },

    updateGroupPos(){
        let start = -this.node.width / 2;
        for(let i = 0; i < this.groupList.length; i++){
            this.groupList[i].view.x = start + this.groupList[i].view.width / 2;
            start += this.groupList[i].view.width + 30;
        }
    },

    updateGroupBottom(groupInfo, idx){
        let group = groupInfo.data;
        let bottom = groupInfo.bottom;

        bottom.width = groupInfo.view.width;
        bottom.active = !group.isNoGroup();
        let frame = bottom.getComponent(cc.Sprite);
        let label = bottom.getComponentInChildren(cc.Label);

        if(!group.isNoGroup() && !group.isNoCorrect()){

            if(group.isPure()) {
                frame.spriteFrame = this.bottomColor[0];
                if(this.first === -1 || this.first === idx){
                    label.string = '1st Life';
                    this.first = idx;
                }else if(this.second === -1 || this.second === idx){
                    label.string = '2nd Life';
                    this.second = idx;
                }else{
                    label.string = 'Pure';
                }
            }else if(group.isImPure()){
                if(this.first === -1){
                    frame.spriteFrame = this.bottomColor[1];
                    label.string = '1st Life Needed';
                }else if(this.second === -1 || this.second === idx){
                    frame.spriteFrame = this.bottomColor[0];
                    label.string = '2nd Life';
                    this.second = idx;
                }else{
                    frame.spriteFrame = this.bottomColor[0];
                    label.string = 'Impure';
                }
            }else{
                if(this.second === -1){
                    frame.spriteFrame = this.bottomColor[1];
                    label.string = '2nd Life Needed';
                }else{
                    frame.spriteFrame = this.bottomColor[0];
                    if(group.isStraight()){
                        label.string = 'Straight';
                    }else{
                        label.string = 'Set';
                    }
                }
            }
        }else{
            frame.spriteFrame = this.bottomColor[2];
            label.string = 'Not Correct';
        }

        return !group.isNoGroup() && !group.isNoCorrect();
    },

    updateGroupBottomAll(){
        if(this.first !== -1){
            if(!this.groupList[this.first] || !this.groupList[this.first].data.isPure()){
                this.first = -1;
            }
        }

        if(this.second !== -1){
            if(!this.groupList[this.second] || (!this.groupList[this.second].data.isImPure() && !this.groupList[this.second].data.isPure())){
                this.second = -1;
            }
        }

        for(let j = 0; j < this.groupList.length; j++){
            this.updateGroupBottom(this.groupList[j], j);
        }

        for(let j = 0; j < this.groupList.length; j++){
            this.updateGroupBottom(this.groupList[j], j);
        }
    },

    updatePoint(){
        let point = 0;
        this.groupList.forEach((info, index)=>{
            if(this.first === -1 && this.second === -1){
                point += info.data.getPoint();
            }else if(this.first !== -1 && this.second === -1){
                if(index != this.first){
                    point += info.data.getPoint();
                }
            }else{
                if(info.data.isNoGroup() || info.data.isNoCorrect()){
                    point += info.data.getPoint();
                }
            }

        })
        if(point >= 80){
            point = 80;
        }
        this.point.string = point.toString();
    },
});
