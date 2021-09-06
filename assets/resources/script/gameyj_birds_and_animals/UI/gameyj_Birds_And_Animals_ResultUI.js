// create by wj 2019/08/14
var game_Data = require('birds_and_animals_data').Birds_And_Animals_Data.Instance();
var config =  require('birds_and_animals_config').IconConfg;
const gameAudioPath = require('birds_and_animals_config').AuditoPath;
const fqzs_audio = require('fqzs_audio');

cc.Class({
    extends: cc.Component,

    properties: {
        m_oDragonNode: cc.Node,
        m_tResultNode: {default: [], type: cc.Node, tooltip: '结果节点'},
        m_oIconAtlas: cc.SpriteAtlas,
    },

    showResultUI: function(ntype){
        this.m_oDragonNode.active = false;
        for(var i = 0; i < 3; i++)
            this.m_tResultNode[i].active = false;

        switch(ntype){
            case 0:
                this.showSingleResult();
                break;
            case 1:
                this.showTwoResult();
                break;
            case 2:
                this.showThreeResult();
                break;
        }
    },
    setResultInfo: function(node, result){//设置结果显示
        var iconSp = node.getChildByName('iconSp').getComponent(cc.Sprite);
        var animalTagNode = node.getChildByName('animalTag');
        var birdTagNode = node.getChildByName('birdTag');
        var descTxt = node.getChildByName('desc').getComponent(cc.Label);

        var data = config.getItem(function(item){
            if(item.id == result.icon)
                return item;
        });

        if(data){
            iconSp.spriteFrame = this.m_oIconAtlas.getSpriteFrame(data.bigIcon); //设置图标
            animalTagNode.active = data.type == 1;
            birdTagNode.active = data.type == 2; //判定类型
            descTxt.string = data.name + ' X ' + data.pay;
        }
    },

    showSingleResult: function(){//显示单一结果
        var self = this;
        var resultList = game_Data.getResultList();
        this.setResultInfo(this.m_tResultNode[0], resultList[0]);
        this.m_tResultNode[0].active = true;
        this.m_oDragonNode.active = true;
        this.m_oDragonNode.getComponent(dragonBones.ArmatureDisplay).playAnimation('Animation2');
        this.m_tResultNode[0].runAction(cc.sequence(cc.fadeIn(1), cc.delayTime(2.0), cc.callFunc(function(){
            self.m_tResultNode[0].opacity = 0;
            self.closeUI();
        })));
    },

    showTwoResult: function(){//显示两个结果
        var self = this;
        var resultList = game_Data.getResultList();
        this.setResultInfo(this.m_tResultNode[1].getChildByName('node1'), resultList[0]);
        this.setResultInfo(this.m_tResultNode[1].getChildByName('node2'), resultList[1]);

        this.m_tResultNode[1].active = true;
        this.m_oDragonNode.active = true;
        this.m_oDragonNode.getComponent(dragonBones.ArmatureDisplay).playAnimation('Animation2');
        this.m_tResultNode[1].runAction(cc.sequence(cc.fadeIn(1), cc.delayTime(2.0), cc.callFunc(function(){
            self.m_tResultNode[0].opacity = 0;
            self.closeUI();
        })));
    },

    showThreeResult: function(){//显示三个结果
        var self = this;
        var resultList = game_Data.getResultList();
        this.setResultInfo(this.m_tResultNode[2].getChildByName('node1'), resultList[0]);
        this.setResultInfo(this.m_tResultNode[2].getChildByName('node2'), resultList[1]);
        this.setResultInfo(this.m_tResultNode[2].getChildByName('node3'), resultList[2]);

        this.m_tResultNode[2].active = true;
        this.m_oDragonNode.active = true;
        this.m_oDragonNode.getComponent(dragonBones.ArmatureDisplay).playAnimation('Animation2');
        this.m_tResultNode[2].runAction(cc.sequence(cc.fadeIn(1), cc.delayTime(2.0), cc.callFunc(function(){
            self.m_tResultNode[0].opacity = 0;
            self.closeUI();
        })));
    },

    closeUI: function(){
        this.node.active = false;
        var mainUI = cc.dd.SceneManager.getCurrScene().getChildByName('Canvas').getComponent('gameyj_Birds_And_Animals');
        if(mainUI)
            mainUI.caculateResult();
    },

    //播放相应音效
    playAudio: function(audioId, isloop){
        var data =  fqzs_audio.getItem(function(item){
            if(item.key == audioId)
                return item;
        })
        var name = data.audio_name;
        return AudioManager.playSound(gameAudioPath + name, isloop);
    },
});
