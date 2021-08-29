var hall_audio_mgr = require('hall_audio_mgr').Instance();
let MEMBER_STATUS = require('klb_friend_group_enum').MEMBER_STATUS;
var club_Mgr = require('klb_Club_ClubMgr').klbClubMgr.Instance();
const club_Ed = require('klb_Club_ClubMgr').klbClubEd;
const club_Event = require('klb_Club_ClubMgr').klbClubEvent;
let MEMBER = require('klb_friend_group_enum').MEMBER;

cc.Class({
    extends: cc.Component,

    properties: {
        prefabItem: {
            default: null,
            type: cc.Prefab,
            tooltip: "成员组件"
        },
        content_node: cc.Node,
        scrollView: cc.ScrollView,
    },

    onLoad() {
        this.startX = 0;
        this.startY = 10;
        this.spaceX = 0;
        this.spaceY = 5;
        this.updateTimer = 0;
        this.updateInterval = 0.2;
        this.lastContentPosY = 0;
        this.spawnCount = 9;//显示几个
        this.row = 1;//每行几个
        this.item_height = this.prefabItem.data.height;
        this.bufferZone = this.scrollView.node.height / 2 + this.item_height / 2 * 3;//边界线
        this.playerList = [];
        club_Ed.addObserver(this);
    },

    onDestroy: function () {
        club_Ed.removeObserver(this);
    },

    show() {
        if (this._waitAdminAnima) {
            return;
        }
        this._waitAdminAnima = true;
        this.node.stopAllActions();

        var size = cc.winSize;
        this.node.x = 358 * this.node.anchorX - size.width / 2 + 5;

        this.node.active = true;
        this.node.scaleX = 0;
        this.node.scaleY = 0;
        this.node.runAction(cc.sequence(
            cc.scaleTo(0.2, 1),
            cc.callFunc(() => {
                this._waitAdminAnima = false;
                this.initPlayerList(club_Mgr.getSelectClubId(), club_Mgr.getClubMembersList());
            })
        ));
    },

    initPlayerList(clubId, data) {
        this.clubId = clubId;

        data.sort((a, b) => {
            if (a.job == MEMBER.OWNER) {
                return -1;
            } else {
                if (a.job == MEMBER.NORMAL) {
                    if (b.job == MEMBER.NORMAL) {
                        if (a.isonline == b.isonline) {
                            if (this.status == MEMBER_STATUS.APPLY) {
                                return b.applyTime - a.applyTime;
                            } else {
                                return a.joinTime - b.joinTime;
                            }
                        } else {
                            if (a.isonline == 2) {
                                return 1;
                            } else {
                                return -1
                            }
                        }
                    } else {
                        return 1;
                    }
                } else {
                    if (b.job == MEMBER.OWNER) {
                        return 1;
                    } else if (b.job == MEMBER.NORMAL) {
                        return -1;
                    } else {
                        if (a.isonline == b.isonline) {
                            if (this.status == MEMBER_STATUS.APPLY) {
                                return b.applyTime - a.applyTime;
                            } else {
                                return a.joinTime - b.joinTime;
                            }
                        } else {
                            if (a.isonline == 2) {
                                return 1;
                            } else {
                                return -1
                            }
                        }
                    }
                }
            }
        })

        this.playerList = data;
        this.content_node.removeAllChildren();
        this.content_node.y = 0;
        let j = 0;
        let k = 0;

        let playerNum = this.playerList.length
        if (playerNum > this.spawnCount) {
            playerNum = this.spawnCount;
        }
        for (let i = 0; i < playerNum; i++) {
            j = Math.floor(i / this.row);
            k = i % this.row;
            var item = cc.instantiate(this.prefabItem);
            item.getComponent('klb_friend_group_memberListItem').initPlayerInfo(this.clubId, this.playerList[i], this.status);
            item.index = i;
            this.content_node.addChild(item);

            item.x = (-item.width - this.spaceX) * (Math.floor(this.row / 2) - k) - this.startX;
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
    update: function (dt) {
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
                    items[i].getComponent('klb_friend_group_memberListItem').initPlayerInfo(this.clubId, this.playerList[itemId], this.status);
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
                    items[i].getComponent('klb_friend_group_memberListItem').initPlayerInfo(this.clubId, this.playerList[itemId], this.status);
                    items[i].index = itemId;
                }
            }
        }

        // 更新lastContentPosY和总项数显示
        this.lastContentPosY = this.scrollView.content.y;
    },

    close() {
        if (this._waitAdminAnima) {
            return;
        }
        hall_audio_mgr.com_btn_click();

        this._waitAdminAnima = true;
        this.node.stopAllActions();

        this.node.scaleX = 1;
        this.node.scaleY = 1;
        this.node.runAction(cc.sequence(
            cc.scaleTo(0.2, 0),
            cc.callFunc(() => {
                this._waitAdminAnima = false;
                cc.dd.UIMgr.destroyUI(this.node);
            })
        ))
    },

    onEventMessage: function (event, data) {
        switch (event) {
            case club_Event.CLUB_REQ_APPLY_LIST: //请求申请列表返回
            case club_Event.CLUB_OP_APPLY_PLAYER: //操作玩家成功
            case club_Event.CLUB_MANAGER_OP:
                if (!this._waitAdminAnima) {
                    this.initPlayerList(club_Mgr.getSelectClubId(), club_Mgr.getClubMembersList());
                }
                break;
            case club_Event.CLUB_CHANGE_RIGHTS:
                if (data[2] == club_Mgr.getSelectClubId()) {
                    if (!this._waitAdminAnima) {
                        this.initPlayerList(club_Mgr.getSelectClubId(), club_Mgr.getClubMembersList());
                    }
                }
                break;
            default:
                break;
        }
    },
});
