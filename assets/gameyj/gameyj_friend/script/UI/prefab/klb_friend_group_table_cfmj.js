let TABLE_TYPE = require('klb_friend_group_enum').TABLE_TYPE;
let GetGameRules = require('GetGameRules');

cc.Class({
    extends: require('klb_friend_group_table'),

    properties: {
        roomID:{
            default: null,
            type: cc.Label,
            tooltip: '房间号',
        },

        shaizi:{
            default: null,
            type: cc.Node,
            tooltip: '房间号',
        },

        info:cc.Node,

        juIcon: {
            default: null,
            type: cc.Sprite,
            tooltip: '局数圈数',
        },

        juSpriteFrames: {
            default: [],
            type: cc.SpriteFrame,
            tooltip: '局数圈数图集',
        },
    },

    updateTableInfo(idx, tableInfo, rule, isOpen){
        this.idx = idx;
        this.tableId.string = idx+1;
        this.tableInfo = tableInfo;
        this.rule = rule;
        this.isOpen = isOpen;

        for(let i = 0; i < this.chairs.length; i++){
            let node = cc.find('headNode', this.chairs[i]);
            node.active = false;
            node.getComponent('klb_friend_group_player').setData(null);
            node.getComponent(cc.Toggle).isChecked = false;
            let name = cc.find('name', this.chairs[i]);
            name.getComponent(cc.Label).string = '';

            let player = cc.find('player', this.chairs[i]);
            player.active = false;
        }

        for(let i = 0; i < this.kickOutNodes.length; i++){
            this.kickOutNodes[i].active = false;
        }

        if(cc.dd._.isUndefined(tableInfo) || cc.dd._.isNull(tableInfo)){
            this.gameCount.string = '';
            this.roomID.string = '';
            this.shaizi.active = false;
            this.info.active = false;

            this.node.active = this.isOpen;
        }else{
            this.roomID.string = tableInfo.roomId;
            this.shaizi.active = tableInfo.state != 0
            this.info.active = true;

            this.node.active = this.isOpen || tableInfo.membersList.length > 0;

            if(tableInfo.membersList.length > 0){
                this.gameCount.string = tableInfo.curJuNum + ':' + tableInfo.juNum;
                let _rule = null;
                for (var attr in this.rule.rule) {
                    if (attr.endsWith('ule') || attr.endsWith('uleNew')) {
                        _rule = this.rule.rule[attr];
                        break;
                    }
                }

                if(_rule){
                    let jushu = GetGameRules.getJuShu(_rule, this.tableInfo.gameType);

                    if(jushu[1] == '圈数'){
                        this.juIcon.spriteFrame = this.juSpriteFrames[1];
                    }else{
                        this.juIcon.spriteFrame = this.juSpriteFrames[0];
                    }
                }
            }else{
                this.gameCount.string = '';
            }

            for(let i = 0; i < tableInfo.membersList.length; i++){
                if(this.tableType == TABLE_TYPE.FOUR && this.showChairs == 2 && tableInfo.membersList[i].site == 1){
                    let node = cc.find('headNode', this.chairs[2])
                    node.active = true;
                    node.getComponent('klb_hall_Player_Head').initHead(tableInfo.membersList[i].openid, tableInfo.membersList[i].headurl);
                    node.getComponent('klb_friend_group_player').setData(tableInfo.membersList[i], this.wanfa, this.idx, this.tableInfo.roomId, this.tableInfo.gameType);
                    let name = cc.find('name', this.chairs[2]);
                    name.getComponent(cc.Label).string = cc.dd.Utils.subChineseStr(tableInfo.membersList[i].name, 0 , 8);

                    let player = cc.find('player', this.chairs[2]);
                    player.active = true;
                }else{
                    let chair = cc.find('headNode', this.chairs[tableInfo.membersList[i].site]);
                    if(chair){
                        chair.active = true;
                        chair.getComponent('klb_hall_Player_Head').initHead(tableInfo.membersList[i].openid, tableInfo.membersList[i].headurl);
                        chair.getComponent('klb_friend_group_player').setData(tableInfo.membersList[i], this.wanfa, this.idx, this.tableInfo.roomId, this.tableInfo.gameType);
                        let name = cc.find('name', this.chairs[tableInfo.membersList[i].site]);
                        name.getComponent(cc.Label).string = cc.dd.Utils.subChineseStr(tableInfo.membersList[i].name, 0 , 8);

                        let player = cc.find('player', this.chairs[tableInfo.membersList[i].site]);
                        player.active = true;
                    }
                }
            }
        }
        this.buttonNode.active = false;
        this.node.getComponent(cc.Toggle).isChecked = false;
    },
});
