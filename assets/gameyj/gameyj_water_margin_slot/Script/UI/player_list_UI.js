// create by wj 2018/7/26
var gSlotMgr = require('SlotManger').SlotManger.Instance();
const slot_audio = require('slotaudio');
var SlotCfg = require('SlotCfg');

cc.Class({
    extends: cc.Component,

    properties: {
        ContentNode:cc.Node, //列表
        spaceX:15,
        spaceY:18,
        pageNum : 10, //每一页的个数
        itemWidth:290,
        itemHeight:80,
        itemList: [],
        scrollView:cc.ScrollView,
    },

    onLoad: function(){
        this.start_y = this.ContentNode.y;
        this.move_y = this.ContentNode.y;
        this.start_indx = 1;
    },

    setPlayerList: function(){
        var list = gSlotMgr.getPlayerOnlineList();
        var itemNode = this.ContentNode.getChildByName('item');
        //this.ContentNode.removeAllChildren(true);

        for(var i = 0; i < gSlotMgr.getPlayerOnlineList().length; i ++){ //每次加载2页，20个
            var element = list[i];
            var newnode = cc.instantiate(itemNode);
            this.itemList.push(newnode);
            newnode.parent = this.ContentNode;
            newnode.active = true;
            newnode.getChildByName('name').getComponent(cc.Label).string = cc.dd.Utils.substr(element.playerName, 0, 6);
            cc.dd.Utils.seekNodeByName(newnode, "coin").getComponent(cc.Label).string = element.coin;
            var cpt = cc.dd.Utils.seekNodeByName(newnode, "headMask").getComponent('klb_hall_Player_Head');
            cpt.initHead( element.openId, element.headUrl, 'slot_all_win_history_head_init');

            var cnt = this.itemList.length;
            //界面排列
            var y = (Math.ceil(cnt / 2 ) - 0.5)*this.itemHeight + (Math.ceil(cnt / 2) -0.5)*this.spaceY;
            newnode.y = -y;
            var index = (cnt % 2);
            if(index == 0){index = 2;}
            var x = (index - 1.5) * this.itemWidth + (index - 1.5) * this.spaceX;
            newnode.x = x;

            this.ContentNode.height = (Math.ceil(cnt / 2)) *this.itemHeight+((Math.ceil(cnt / 2)) + 1)*this.spaceY;
        };

        this.scrollView.node.on('scroll-ended', this.onScrollEnded.bind(this), this);
    },

    //动态加载
    loadScrollRecode: function(){
            // if(this.scrollView._autoScrolling){
            //     this.scrollView.elastic = false;
            //     return;
            // }

            this.start_indx += 1;
            gSlotMgr.getAllWinOrOnlineList(1, this.start_indx);
            return;

        // if(this.start_indx > 0 && this.ContentNode.y <= this.start_y){
        //     if(this.scrollView._autoScrolling){
        //         this.scrollView.elastic = false;
        //         return;
        //     }

        //     var up_load = this.pageNum;
        //     this.start_indx -= up_load;

        //     if(this.start_indx < 0){
        //         up_load += this.start_indx;
        //         this.start_indx = 0;
        //     }
        //     this.setPlayerList(this.start_indx);
        //     this.ContentNode.y += up_load * this.itemHeight;
        //     return;
        // }
    },

    onScrollEnded: function(){
        if(gSlotMgr.getCanSendTag() == false)
            return;
        var isDwon = this.ContentNode.y > this.move_y;
        var cnt = this.itemList.length;
        var offset = (Math.ceil(cnt / 2)) *this.itemHeight+((Math.ceil(cnt / 2)) + 1)*this.spaceY - this.scrollView.node.getContentSize().width;

        if(isDwon){
            var moveOffsetY = this.ContentNode.y - this.start_y;
            if(moveOffsetY >= offset){
                this.move_y = this.ContentNode.y
                this.loadScrollRecode();
            }
        }
    },


    //播放相应音效
    playAudio: function(audioId){
        var data =  slot_audio.getItem(function(item){
                if(item.key == audioId)
                    return item;
            })
            var name = data.audio_name;
            return AudioManager.playSound(SlotCfg.AuditoPath + name);
        },

    close: function(event, date){
        this.playAudio(101100);
        cc.dd.UIMgr.destroyUI(this.node);
    }
});
