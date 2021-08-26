// create by wj 2020/06/16
var game_Data = require('lucky_turntable_data').Lucky_Turntable_Data.Instance();
const gameAudioPath = require('lucky_turntable_config').AuditoPath;
const audioConfig = require('lucky_turntable_audio');

cc.Class({
    extends: cc.Component,

    properties: {
        m_oDoubleLayerNode: cc.Node,
        m_oShuangXiangPaoNode: cc.Node,
        m_oSanXiangPaoNode: cc.Node,

        m_oDoubleSkeleton: sp.Skeleton,
        m_oShuangXiangPaoSkeleton: sp.Skeleton,
        m_oSanXiangPaoSkeleton: sp.Skeleton,

        m_oMaskNode:cc.Node,

        m_oWinSkeleton: sp.Skeleton,
        m_oLoseSkeleton: sp.Skeleton,
    },
    onLoad () {
        this.m_oMaskNode.runAction(cc.fadeTo(0.3, 110));
    },
    
    playActType: function(type){//动画界面播放类型
        switch(type){
            case 1: //双响
                this.m_oShuangXiangPaoNode.active = true;
                this.playShuangXiangAct();
                break;
            case 2://三响
                this.m_oSanXiangPaoNode.active = true;
                this.playSanXiangAct();
                break;
            case 3://翻倍
                this.m_oDoubleLayerNode.active = true;
                this.playeDounleAct();
                break;
        }
    },

    playShuangXiangAct: function(){//播放双响炮动画
        var self = this;
        this.m_oShuangXiangPaoSkeleton.setAnimation(0, 'shuangxiangpaochuxian', false);
        this.m_oShuangXiangPaoSkeleton.setCompleteListener(function(){
            self.m_oShuangXiangPaoSkeleton.setAnimation(0, 'shuangxiangpao',false);
            self.m_oShuangXiangPaoSkeleton.setCompleteListener(function(){
                self.closeUI();
            })
        });
    },

    playSanXiangAct: function(){//播放双响炮动画
        var self = this;
        this.m_oSanXiangPaoSkeleton.setAnimation(0, 'sanxiangpaochuxian', false);
        this.m_oSanXiangPaoSkeleton.setCompleteListener(function(){
            self.m_oSanXiangPaoSkeleton.setAnimation(0, 'sanxiangpao',false);
            self.m_oSanXiangPaoSkeleton.setCompleteListener(function(){
                self.closeUI();
            })
        });
    },

    playeDounleAct: function(){//播放双响炮动画
        var self = this;
        this.m_oDoubleSkeleton.setAnimation(0, 'lefantianchuxian', false);
        this.m_oDoubleSkeleton.setCompleteListener(function(){
            self.m_oDoubleSkeleton.setAnimation(0, 'lefantian',false);
            self.m_oDoubleSkeleton.setCompleteListener(function(){
                self.closeUI();
            })
        });
    },

    closeUI: function(){
        var self = this;
        this.m_oMaskNode.runAction(cc.sequence(cc.fadeOut(0.3), cc.callFunc(function(){
            cc.dd.UIMgr.destroyUI(self.node);
            var Canvas = cc.director.getScene().getChildByName('Canvas')
            Canvas.getChildByName('root').getComponent('gameyj_lucky_turntable_mainUI').rotateResult();
        })))
    },

    playOwnWinAct: function(){
        var winNum = game_Data.getWinCoin(); //获取个人盈利结果
        if(winNum > 0){
            this.m_oWinSkeleton.node.active = true;
            this.m_oWinSkeleton.node.getChildByName('winNum').getComponent(cc.Label).string = (':' + winNum);
            this.m_oWinSkeleton.setAnimation(0, 'cheng', false);
            this.playAudio(10006, false);
            this.m_oWinSkeleton.setCompleteListener(function(){
                this.closeOwnWin();
            }.bind(this));
    
        }else if(winNum < 0 ){
            this.m_oLoseSkeleton.node.active = true;
            this.m_oLoseSkeleton.node.getChildByName('winNum').getComponent(cc.Label).string = (':' + winNum);
            this.m_oLoseSkeleton.setAnimation(0, 'lan', false);
            this.m_oLoseSkeleton.setCompleteListener(function(){
                this.closeOwnWin();
            }.bind(this));
        }
    },

    closeOwnWin: function(){
        var self = this;
        this.m_oMaskNode.runAction(cc.sequence(cc.fadeOut(0.3), cc.callFunc(function(){
            cc.dd.UIMgr.destroyUI(self.node);
            var Canvas = cc.director.getScene().getChildByName('Canvas')
            Canvas.getChildByName('root').getComponent('gameyj_lucky_turntable_mainUI').showRotationLayer();
        })))
    },

    //播放相应音效
    playAudio: function(audioId, isloop){
        var data =  audioConfig.getItem(function(item){
            if(item.key == audioId)
                return item;
        })
        var name = data.audio_name;
        return AudioManager.playSound(gameAudioPath + name, isloop);
    },
});
