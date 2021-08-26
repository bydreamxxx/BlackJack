const game_List = require('klb_gameList');
var hall_audio_mgr = require('hall_audio_mgr').Instance();
var prefab_config = require('klb_friend_group_prefab_cfg');

cc.Class({
    extends: cc.Component,

    properties:{
        content:{
            default: null,
            type: cc.Node,
            tooltip: '容器',
        },

        title:{
            default: null,
            type: cc.Label,
            tooltip: '标题',
        }
    },

    onLoad(){
      if(cc._useChifengUI){
          cc.find('actionnode/ruleButton', this.node).active = false;
      }
    },

    setRule(rule){
        let gametype = rule.gameInfo.gameType;

        if(gametype == cc.dd.Define.GameType.SYMJ_FRIEND){
            if(rule.rule.mjSongyuanRule.symjtype == 2){
                gametype = cc.dd.Define.GameType.SYMJ_FRIEND_2
            }
        }

        this.itemData = game_List.getItem(function (item) {
            return item.gameid == gametype;
        });

        this.title.string = this.itemData.name;

        let url = this.itemData.gameruleui;
        // url = url.replace("gameyj_hall/prefabs/create_room/", "gameyj_friend/prefab/create_room/");
        let prefabName = url.replace("gameyj_hall/prefabs/create_room/", "");

        this.content.removeAllChildren(true);
        cc.dd.UIMgr.openUI(url, function (node) {
            let gameNode = node.getComponent(prefabName);
            if(!gameNode){
                prefabName = this.getPrefabName(rule.gameInfo.gameType);
                if(prefabName){
                    gameNode = node.getComponent(prefabName);
                }
            }
            node.parent = this.content;
            node.y = -56;
            if(gameNode){
                gameNode.setRoomRule(rule)
            }
        }.bind(this));
    },

    getPrefabName(gameid){
        switch(gameid){
            case cc.dd.Define.GameType.NEW_DSZ_FRIEND:
                return 'gameyj_new_dsz_create_room';
            case cc.dd.Define.GameType.TDK_FRIEND:
            case cc.dd.Define.GameType.TDK_FRIEND_LIU:
                return 'tdk_rule_ui';
            case cc.dd.Define.GameType.HBSL_JBL:
            case cc.dd.Define.GameType.HBSL_GOLD:
                return 'hbls_create_room';
            case cc.dd.Define.GameType.XZMJ_FRIEND:
            case cc.dd.Define.GameType.XLMJ_FRIEND:
                return 'scmj_create_room';
            default:
                return null;
        }
    },

    onClickClose(){
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    onClickRule(){
        if(this.itemData){
            cc.dd.UIMgr.openUI(prefab_config.KLB_FG_RULE, function (ui) {
                if(this.itemData.gameid == cc.dd.Define.GameType.TDK_FRIEND_LIU){
                    var itemData = {
                        _game_id: cc.dd.Define.GameType.TDK_FRIEND_LIU,
                    }
                }else{
                    var itemData = {
                        _game_id: this.itemData.connect_f_id,
                    }
                }
                var cpt = ui.getComponent('klb_friend_group_rule');
                cpt.clickTagCallBack(itemData);

                this.onClickClose();
            }.bind(this));
        }

    },
});
