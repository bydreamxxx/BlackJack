// create by wj 2019/08/16
var game_Data = require('horse_racing_Data').Horse_Racing_Data.Instance();
const gameAudioPath = require('horse_racing_Config').AuditoPath;

cc.Class({
    extends: cc.Component,

    properties: {
        m_tPlayerNode: { default: [], type: cc.Node, tooltip: '玩家节点' },
        dragonNode: cc.Node,
    },

    onLoad() { },

    setPlayerInfo: function () {
        var playerList = game_Data.getWinnerList();
        for (var i = 0; i < playerList.length; i++) {
            var player = playerList[i];
            var headNode = cc.dd.Utils.seekNodeByName(this.m_tPlayerNode[player.rank - 1], 'headNode');
            headNode.getComponent('klb_hall_Player_Head').initHead(player.openId, player.headUrl, 'fqzs_big_win_head_init');
            var InfoNode = cc.dd.Utils.seekNodeByName(this.m_tPlayerNode[player.rank - 1], 'numbg');
            InfoNode.getChildByName('name').getComponent(cc.Label).string = cc.dd.Utils.substr(player.name, 0, 5);
            InfoNode.getChildByName('coin').getComponent(cc.Label).string = player.coin;
        }
    },

    showBigWin: function () {
        this.node.active = true;
        var bone = this.dragonNode.getComponent(dragonBones.ArmatureDisplay)
        bone.playAnimation('Animation1', -1);
        //bone.addEventListener(dragonBones.EventObject.COMPLETE, this.animationEventHandler, this);


        var Anim = this.node.getComponent(cc.Animation)
        Anim.play();
        game_Data.clearGameData();

        setTimeout(function () {
            this.closeUI();
        }.bind(this), 5000);
    },


    closeUI: function () {
        AudioManager.stopMusic();
        if (AudioManager._getLocalMusicSwitch())
            this.m_nMusicId = AudioManager.playMusic(gameAudioPath + 'horse_background_01_v01');
    },
});
