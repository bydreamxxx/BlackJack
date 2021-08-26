
// create by wj 2019/03/11
const pk_audio = require('pk_audio');
const PK_Config = require('pk_Config');

cc.Class({
    extends: cc.Component,

    properties: {
        m_oBackNode: cc.Node, //背面节点
        m_oFaceNode: cc.Node, //正面节点
        m_nOffsetY: 0, //节点间初始Y轴位移差距，可修改
        m_nTaltolHight: 0, //y轴长度(引擎可修改)
        m_nHight: 0, //翻牌位移
        m_nOriginY: 0, //初始y坐标
        m_bPlayBottom: false,
        m_ntime: 0,

        m_oLeftBackNode: cc.Node, //背面节点
        m_oLeftFaceNode: cc.Node, //正面节点
        m_nRotate: 0,
        m_bplayLeftBottom: false,
        m_nOrigiHeight: 30,
        m_nLeftOriginY: 0,

        m_nWidth: 0,
        m_nTaltolWidth: 0,
        m_nOriginX: 0,

        m_oCallBack: null,
        pokerId: 0,
    },

    //默认显示
    defaultShow: function(index){
        if(index == 0){
            this.m_oBackNode.height = 0;
            this.m_oFaceNode.height = this.m_nTaltolHight;    
            this.m_oFaceNode.y = this.m_nOriginY;
        }else if(index == 1){
            this.m_oLeftBackNode.height = 0;
            this.m_oLeftFaceNode.height = this.m_nTaltolHight;   
            this.m_oLeftFaceNode.rotation = 0;
            this.m_oLeftFaceNode.y = this.m_nOriginY;
            this.m_oLeftFaceNode.x = 0;

        }else if(index == 2){
            this.m_bPlayRight = false;
            this.m_oFaceNode.x = this.m_nTaltolWidth / 2;
            this.m_oFaceNode.width = this.m_nTaltolWidth;
            this.m_oBackNode.active = false;
        }
        this.enableOpen(false);
    },

    //开牌动画
    openAction: function(index, callback, pokerId){
        if(index == 0)
            this.playBottomAction();
        else if(index == 1){
            this.m_nRotate = parseInt(Math.random() * (15 - 1) * 1, 10);
            this.playLeftBottomAction();
        }
        else if(index == 2)
            this.playRightAction();
        this.m_oCallBack = callback;
        this.m_nPokerId = pokerId;
    },

    enableOpen: function(enable){
        this.node.getChildByName('openBtn').interactable = enable;
    },

    //从底部向上翻
    playBottomAction: function(){
        this.m_bPlayBottom = true;
       // if(this.m_nHight <= this.m_nTaltolHight / 2){//如果翻牌位移小于总位移一半
            this.m_oBackNode.height = this.m_nTaltolHight - this.m_nHight;
            this.m_oFaceNode.height = this.m_nHight;
            var posY = ( this.m_nHight - this.m_nOffsetY) * 2 - this.m_nTaltolHight;
        this.m_oFaceNode.y = posY;
        // }else{//如果翻转牌位移大于总位移一半
            if(this.m_nHight >= this.m_nTaltolHight / 3 * 2){//翻牌位移大于总位移
                this.m_oBackNode.height = 0;
                this.m_oFaceNode.height = this.m_nTaltolHight;    
            this.m_oFaceNode.y = this.m_nOriginY;
                this.m_bPlayBottom = false;
                this.m_nHight = 0;
                if(this.m_oCallBack){
                    this.m_oCallBack();
                    this.playCardAudio();
                }
            }//else{
        //         this.m_oBackNode.height = this.m_nTaltolHight - this.m_nHight;
        //         this.m_oFaceNode.height = this.m_nHight;
        //         var posY = this.m_nTaltolHight - 2 * this.m_nHight + 2 * this.m_nOffsetY;
        //         this.m_oFaceNode.setPositionY(posY);
        //     }
        // }
    },

    //从左下翻牌
    playLeftBottomAction: function(){
        this.m_bplayLeftBottom = true;

        this.m_oLeftBackNode.height = this.m_nTaltolHight - this.m_nOrigiHeight;
        this.m_oLeftFaceNode.height = this.m_nOrigiHeight;
        this.m_oLeftFaceNode.rotation = this.m_nRotate;
        // this.m_oLeftPokerNode.rotation = this.m_nRotate;
       // cc.log('offset=========' +)
        var posY = this.m_nLeftOriginY + ((this.m_nOrigiHeight * Math.sin((90 - this.m_nRotate) * Math.PI / 180)) / 2  + this.m_nOrigiHeight);
        this.m_oLeftFaceNode.y = posY;
        this.m_oLeftFaceNode.x = Math.cos((90 - this.m_nRotate) * Math.PI / 180) * this.m_nOrigiHeight / 2;

        if(this.m_nOrigiHeight >= this.m_nTaltolHight / 3 * 2){//翻牌位移大于总位移
            this.m_oLeftBackNode.height = 0;
            this.m_oLeftFaceNode.height = this.m_nTaltolHight;   
            this.m_oLeftFaceNode.rotation = 0;
            this.m_oLeftFaceNode.y = this.m_nOriginY;
            this.m_oLeftFaceNode.x = 0;
            this.m_bplayLeftBottom = false;
            this.m_nOrigiHeight = 0;
            this.m_nRotate = 0;
            if(this.m_oCallBack){
                this.m_oCallBack();
                this.playCardAudio();
            }
        }
    },

    //从右边开牌
    playRightAction: function(){
        this.m_bPlayRight = true;
        this.m_oBackNode.width = this.m_nTaltolWidth - this.m_nWidth;
        this.m_oFaceNode.width = this.m_nWidth;
        var posX = this.m_nOriginX + this.m_nWidth * (3/2);
        this.m_oFaceNode.x = posX;

        if(this.m_nWidth >= this.m_nTaltolWidth / 3 * 2){
            this.m_nWidth = 0;
            this.m_bPlayRight = false;
            this.m_oFaceNode.x = 158;
            this.m_oFaceNode.width = this.m_nTaltolWidth;
            this.m_oBackNode.active = false;
            if(this.m_oCallBack){
                this.m_oCallBack();
                this.playCardAudio();
            }
        }

    },

    playCardAudio: function(){
        var audio = 0;
        var index = parseInt(this.m_nPokerId / 100);
        if(index == 1)
            audio = 1026007
        else if(index == 2)
            audio = 1026008
        else if(index == 3)
            audio = 1026011
        else if(index == 4)
            audio = 1026006
        else if(index == 5){
            var flower = parseInt(this.m_nPokerId % 100);
            if(flower == 1)
                audio = 1026004
            else
                audio = 1026017

        }
        this.playAudio(audio, false);

    },

    update: function(dt){ 
        if(this.m_bPlayBottom){
            this.m_ntime += dt;
            if(this.m_ntime > 0.3){
                this.m_nHight = this.m_nHight + 6;
                this.playBottomAction();
            }
        }else if(this.m_bplayLeftBottom){
            this.m_ntime += dt;
            if(this.m_ntime > 0.3){
                this.m_nOrigiHeight = this.m_nOrigiHeight + 6;
                this.playLeftBottomAction();
            }
        }else if(this.m_bPlayRight){
            this.m_ntime += dt;
            if(this.m_ntime > 0.3){
                this.m_nWidth = this.m_nWidth + 6;
                this.playRightAction();
            }
        }
    },

    reset: function(index){
        if(index == 0){
            this.m_oBackNode.active = true;
            this.m_oBackNode.height = this.m_nTaltolHight;
            this.m_oFaceNode.height = 0;
            this.m_oFaceNode.y = this.m_nOriginY;
        }else if(index == 1){
            this.m_oBackNode.active = true;
            this.m_oBackNode.height = this.m_nTaltolHight;
            this.m_oFaceNode.height = 0;
            this.m_oFaceNode.y = this.m_nLeftOriginY;
            this.m_oFaceNode.x = 0;
        }else if(index == 2){
            this.m_oBackNode.width = this.m_nTaltolWidth;
            this.m_oBackNode.active = true;
            this.m_oFaceNode.width = 0;
            this.m_oFaceNode.x = this.m_nOriginX;
        }
    },

    //播放相应音效
    playAudio: function(audioId, isloop){
        var data =  pk_audio.getItem(function(item){
            if(item.key == audioId)
                return item;
        })
        var name = data.audio_name;
        return AudioManager.playSound(PK_Config.AuditoPath + name, isloop);
    },
});
