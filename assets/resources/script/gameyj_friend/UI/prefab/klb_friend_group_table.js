var hall_audio_mgr = require('hall_audio_mgr').Instance();
const club_sender = require('jlmj_net_msg_sender_club');
var clubMgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();
let prefab_config = require('klb_friend_group_prefab_cfg');


// const chairsPosition = {
//     2:[cc.v2(-208,125), cc.v2(-172.6,17.7), cc.v2(0,-27.7), cc.v2(172.6,17.7), cc.v2(208,125)],//五人
//     3:[cc.v2(-209.7,125), cc.v2(-196.1,42.2), cc.v2(-104.2,-12.6), cc.v2(0,-25.9), cc.v2(104.2,-12.6), cc.v2(196.1,42.2), cc.v2(209,125), cc.v2(102.2,125), cc.v2(-102.2,125)],//九人
//     4:[cc.v2(-208,125), cc.v2(-194.3,41.3), cc.v2(-100.9,-12.8), cc.v2(0,-26.2), cc.v2(100.9,-12.8), cc.v2(194.3,41.3), cc.v2(208,125), cc.v2(128.3,125), cc.v2(48.3,125), cc.v2(-48.3,125), cc.v2(-128.3,125)]//十一人
// }

let TABLE_TYPE = require('klb_friend_group_enum').TABLE_TYPE;
let MEMBER = require('klb_friend_group_enum').MEMBER;

cc.Class({
    extends: cc.Component,

    properties: {
        chairs: {
            default: [],
            type: [cc.Node],
            tooltip: '椅子',
        },

        kickOutNodes: {
            default: [],
            type: [cc.Node],
            tooltip: '踢人',
        },

        tableId: {
            default: null,
            type: cc.Label,
            tooltip: '桌号',
        },

        gameCount: {
            default: null,
            type: cc.Label,
            tooltip: '局数',
        },

        buttonNode: {
            default: null,
            type: cc.Node,
            tooltip: '管理按钮',
        },

        movePos: cc.v2(0, 0),
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // if(cc.dd.user.clubJob == MEMBER.NORMAL){
        this.node.getComponent(cc.Button).enabled = true;
        this.node.getComponent(cc.Toggle).enabled = false;

        for (let i = 0; i < this.chairs.length; i++) {
            let node = cc.find('headNode', this.chairs[i]);
            node.getComponent(cc.Toggle).enabled = false;
        }
        // }else{
        //     this.node.getComponent(cc.Button).enabled = false;
        //     this.node.getComponent(cc.Toggle).enabled = true;
        //
        //     for(let i = 0; i < this.chairs.length; i++){
        //         let node = cc.find('headNode', this.chairs[i]);
        //         node.getComponent(cc.Toggle).enabled = true;
        //     }
        // }
    },

    start() {

    },

    updateChairs(tableType, playerCount, wanfa, toggleCallBtn) {
        this._toggleCallBtn = toggleCallBtn
        this.tableType = tableType;
        this.wanfa = wanfa;
        let posision = null;
        switch (tableType) {
            case TABLE_TYPE.THREE:
                for (let i = 0; i < this.chairs.length; i++) {
                    this.chairs[i].active = i < 3;
                }
                break;
            case TABLE_TYPE.FOUR:
                if (playerCount == 2) {
                    this.showChairs = 2;
                    this.chairs[0].active = true;
                    this.chairs[1].active = false;
                    this.chairs[2].active = true;
                    this.chairs[3].active = false;
                } else if (playerCount == 3) {
                    this.showChairs = 3;
                    this.chairs[0].active = true;
                    this.chairs[1].active = true;
                    this.chairs[2].active = true;
                    this.chairs[3].active = false;
                } else {
                    this.showChairs = 4;
                    for (let i = 0; i < this.chairs.length; i++) {
                        this.chairs[i].active = i < 4;
                    }
                }
                break;
            case TABLE_TYPE.BIG_FIVE:
                if (playerCount == 2) {
                    this.showChairs = 2;
                    this.chairs[0].active = true;
                    this.chairs[1].active = false;
                    this.chairs[2].active = false;
                    this.chairs[3].active = true;
                    this.chairs[4].active = false;
                    this.chairs[5].active = false;
                } else if (playerCount == 4) {
                    this.showChairs = 4;
                    this.chairs[0].active = false;
                    this.chairs[1].active = true;
                    this.chairs[2].active = true;
                    this.chairs[3].active = false;
                    this.chairs[4].active = true;
                    this.chairs[5].active = true;
                } else if (playerCount == 5) {
                    this.showChairs = 5;
                    this.chairs[0].active = true;
                    this.chairs[1].active = true;
                    this.chairs[2].active = true;
                    this.chairs[3].active = false;
                    this.chairs[4].active = true;
                    this.chairs[5].active = true;
                } else {
                    this.showChairs = 6;
                    this.chairs[0].active = true;
                    this.chairs[1].active = true;
                    this.chairs[2].active = true;
                    this.chairs[3].active = true;
                    this.chairs[4].active = true;
                    this.chairs[5].active = true;
                }
                break;
            case TABLE_TYPE.BIG_NINE:
                // posision = chairsPosition[tableType];
                // for(let i = 0; i < this.chairs.length; i++){
                //     if(i < 9){
                //         this.chairs[i].active = true;
                //         this.chairs[i].position = posision[i];
                //     }else{
                //         this.chairs[i].active = false;
                //     }
                // }
                for (let i = 0; i < this.chairs.length; i++) {
                    this.chairs[i].active = i != 0 && i != 10;
                }
                break;
            case TABLE_TYPE.BIG_ELEVEN:
                // posision = chairsPosition[tableType];
                // for(let i = 0; i < this.chairs.length; i++){
                //     if(i < 11){
                //         this.chairs[i].active = true;
                //         // this.chairs[i].position = posision[i];
                //     }else{
                //         this.chairs[i].active = false;
                //     }
                // }
                for (let i = 0; i < this.chairs.length; i++) {
                    this.chairs[i].active = true;
                }
                break;
        }

        for (let i = 0; i < this.chairs.length; i++) {
            cc.find('headNode', this.chairs[i]).active = false;
        }
    },

    updateTableInfo(idx, tableInfo, rule, isOpen) {
        this.idx = idx;
        this.tableId.string = idx + 1;
        this.tableInfo = tableInfo;
        this.rule = rule;
        this.isOpen = isOpen;

        for (let i = 0; i < this.chairs.length; i++) {
            let node = cc.find('headNode', this.chairs[i]);
            node.active = false;
            node.getComponent('klb_friend_group_player').setData(null);
            node.getComponent(cc.Toggle).isChecked = false;
        }

        for (let i = 0; i < this.kickOutNodes.length; i++) {
            this.kickOutNodes[i].active = false;
        }

        if (cc.dd._.isUndefined(tableInfo) || cc.dd._.isNull(tableInfo)) {
            this.gameCount.string = '';

            this.node.active = this.isOpen;
        } else {
            this.node.active = this.isOpen || tableInfo.membersList.length > 0;

            if (tableInfo.membersList.length > 0) {
                this.gameCount.string = tableInfo.state == 0 ? '未开始' : '已开始';//tableInfo.curJuNum + '/' + tableInfo.juNum

                if (this.tableType == TABLE_TYPE.ONE) {
                    this.gameCount.string += ('\n' + tableInfo.curUserNum + '人游戏中');
                }

            } else {
                this.gameCount.string = '';
            }

            let showChairHead = (node, member) => {
                node.active = true;
                node.getComponent('klb_hall_Player_Head').initHead(member.openid, member.headurl);
                node.getComponent('klb_friend_group_player').setData(member, this.wanfa, this.idx, this.tableInfo.roomId, this.tableInfo.gameType);
            }

            switch (this.tableType) {
                case TABLE_TYPE.FOUR:
                    for (let i = 0; i < tableInfo.membersList.length; i++) {
                        if (this.showChairs == 2 && tableInfo.membersList[i].site == 1) {
                            let node = cc.find('headNode', this.chairs[2])
                            showChairHead(node, tableInfo.membersList[i]);
                        } else {
                            let chair = cc.find('headNode', this.chairs[tableInfo.membersList[i].site]);
                            if (chair) {
                                showChairHead(chair, tableInfo.membersList[i]);
                            }
                        }
                    }
                    break;
                case TABLE_TYPE.BIG_FIVE:
                    if (this.showChairs == 2) {
                        for (let i = 0; i < tableInfo.membersList.length; i++) {
                            if (tableInfo.membersList[i].site == 1) {
                                let node = cc.find('headNode', this.chairs[3])
                                showChairHead(node, tableInfo.membersList[i]);
                            } else {
                                let chair = cc.find('headNode', this.chairs[tableInfo.membersList[i].site]);
                                if (chair) {
                                    showChairHead(chair, tableInfo.membersList[i]);
                                }
                            }
                        }
                    } else if (this.showChairs == 4) {
                        for (let i = 0; i < tableInfo.membersList.length; i++) {
                            if (tableInfo.membersList[i].site < 2) {
                                let node = cc.find('headNode', this.chairs[tableInfo.membersList[i].site + 1])
                                showChairHead(node, tableInfo.membersList[i]);
                            } else {
                                let chair = cc.find('headNode', this.chairs[tableInfo.membersList[i].site + 2]);
                                if (chair) {
                                    showChairHead(chair, tableInfo.membersList[i]);
                                }
                            }
                        }
                    } else if (this.showChairs == 5) {
                        for (let i = 0; i < tableInfo.membersList.length; i++) {
                            if (tableInfo.membersList[i].site >= 3) {
                                let node = cc.find('headNode', this.chairs[tableInfo.membersList[i].site + 1])
                                showChairHead(node, tableInfo.membersList[i]);
                            } else {
                                let chair = cc.find('headNode', this.chairs[tableInfo.membersList[i].site]);
                                if (chair) {
                                    showChairHead(chair, tableInfo.membersList[i]);
                                }
                            }
                        }
                    } else if (this.showChairs == 6) {
                        for (let i = 0; i < tableInfo.membersList.length; i++) {
                            let chair = cc.find('headNode', this.chairs[tableInfo.membersList[i].site]);
                            if (chair) {
                                showChairHead(chair, tableInfo.membersList[i]);
                            }
                        }
                    }
                    break;
                case TABLE_TYPE.BIG_NINE:
                    for (let i = 0; i < tableInfo.membersList.length; i++) {
                        let chair = cc.find('headNode', this.chairs[tableInfo.membersList[i].site + 1]);
                        if (chair) {
                            showChairHead(chair, tableInfo.membersList[i]);
                        }
                    }
                    break;
                default:
                    for (let i = 0; i < tableInfo.membersList.length; i++) {
                        let chair = cc.find('headNode', this.chairs[tableInfo.membersList[i].site]);
                        if (chair) {
                            showChairHead(chair, tableInfo.membersList[i]);
                        }
                    }
                    break;
            }

            // for(let i = 0; i < this.chairs.length; i++){
            //     if(i < tableInfo.membersList.length){
            //         if(this.tableType == TABLE_TYPE.FOUR){
            //             if(this.showChairs == 2){
            //                 if(i == 0){
            //                     cc.find('headNode', this.chairs[0]).active = true;
            //                     cc.find('headNode', this.chairs[0]).getComponent('klb_hall_Player_Head').initHead(tableInfo.membersList[i].openid, tableInfo.membersList[i].headurl);
            //                 }else{
            //                     cc.find('headNode', this.chairs[2]).active = true;
            //                     cc.find('headNode', this.chairs[2]).getComponent('klb_hall_Player_Head').initHead(tableInfo.membersList[i].openid, tableInfo.membersList[i].headurl);
            //                 }
            //             }else{
            //                 cc.find('headNode', this.chairs[i]).active = true;
            //                 cc.find('headNode', this.chairs[i]).getComponent('klb_hall_Player_Head').initHead(tableInfo.membersList[i].openid, tableInfo.membersList[i].headurl);
            //             }
            //         }else{
            //             cc.find('headNode', this.chairs[i]).active = true;
            //             cc.find('headNode', this.chairs[i]).getComponent('klb_hall_Player_Head').initHead(tableInfo.membersList[i].openid, tableInfo.membersList[i].headurl);
            //         }
            //     }else{
            //         if(this.tableType == TABLE_TYPE.FOUR && this.showChairs == 2 && i == 2){
            //
            //         }else{
            //             cc.find('headNode', this.chairs[i]).active = false;
            //         }
            //     }
            // }
        }
        this.buttonNode.active = false;
        this.node.getComponent(cc.Toggle).isChecked = false;
    },

    // update (dt) {},
    onClickButton() {
        hall_audio_mgr.com_btn_click();
        // let memberInfo = clubMgr.getClubMember(cc.dd.user.id);
        // if(memberInfo){
        if (cc.dd.user.clubJob == MEMBER.NORMAL || !this.tableInfo) {
            if (this.touch) {
                return;
            }
            this.touch = true;
            this.touchTime = setTimeout(() => {
                this.touch = false;
                clearTimeout(this.touchTime);
                this.touchTime = null;
            }, 1000);
            club_sender.sitDown(clubMgr.getSelectClubId(), this.wanfa, this.idx, this.tableInfo);
        } else {
            // this.buttonNode.active = !this.buttonNode.active;

            if (!cc.dd.UIMgr.getUI(prefab_config.KLB_FG_TABLE_MANAGER)) {
                cc.dd.UIMgr.openUI(prefab_config.KLB_FG_TABLE_MANAGER, function (ui) {
                    ui.getComponent('klb_friend_group_manageTable').initPlayerList(clubMgr.getSelectClubId(), this.wanfa, this.idx, this.tableInfo, this.rule);
                }.bind(this));
            }
        }
        // }else{
        //     cc.dd.PromptBoxUtil.show('不是该俱乐部成员');
        // }
    },

    onClickSitDown() {
        hall_audio_mgr.com_btn_click();
        if (this.touchsit) {
            return;
        }

        this.touchsit = true;
        this.touchsitTime = setTimeout(() => {
            this.touchsit = false;
            clearTimeout(this.touchsitTime);
            this.touchsitTime = null;
        }, 1000);
        club_sender.sitDown(clubMgr.getSelectClubId(), this.wanfa, this.idx, this.tableInfo);
    },

    onClickDissolve() {
        hall_audio_mgr.com_btn_click();
        if (this.tableInfo) {
            if (!cc.dd.UIMgr.getUI(prefab_config.KLB_FG_NOTICE)) {
                cc.dd.UIMgr.openUI(prefab_config.KLB_FG_NOTICE, function (ui) {
                    ui.getComponent('klb_friend_group_notice').show('确定要解散该桌子吗?', () => {
                        club_sender.dissolveDesk(clubMgr.getSelectClubId(), this.tableInfo.roomId, this.tableInfo.gameType, this.wanfa, this.idx);
                    });
                }.bind(this));
            }
        }
    },

    onDestroy() {
        if (this.touchTime) {
            clearTimeout(this.touchTime);
            this.touchTime = null;
        }
        if (this.touchsitTime) {
            clearTimeout(this.touchsitTime);
            this.touchsitTime = null;
        }
    },

    getHeads() {
        let list = [];
        for (let i = 0; i < this.chairs.length; i++) {
            let node = cc.find('headNode', this.chairs[i]);
            if (node) {
                list.push(node.getComponent(cc.Toggle));
            }
        }
        return list;
    },

    onClickToggle(toggle, data) {
        if (this._toggleCallBtn) {
            let target = null;
            if (cc.dd._.isString(data)) {
                target = this.kickOutNodes[parseInt(data)];
            } else {
                target = this.buttonNode;
            }

            let worldPos = toggle.node.parent.convertToWorldSpaceAR(toggle.node.position);
            let viewPos = this.node.convertToNodeSpaceAR(worldPos);
            this._toggleCallBtn(toggle, this.movePos, viewPos, target)
        }
    },
});
