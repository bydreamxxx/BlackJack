// create by wj
var gSlotMgr = require('SlotManger').SlotManger.Instance();
const slot_audio = require('slotaudio');
var SlotCfg = require('SlotCfg');

cc.Class({
    extends: cc.Component,

    properties: {
        ContentNode:cc.Node, //列表
        spaceX:15,
        spaceY:5,
        pageNum : 10, //每一页的个数
        itemWidth:290,
        itemHeight:85,
        itemList: [],
        scrollView:cc.ScrollView,
    },

    onLoad: function(){
        this.start_y = this.ContentNode.y;
        this.move_y = this.ContentNode.y;
        this.start_indx = 1;
    },
    
    setHistory: function(){
        var list = gSlotMgr.getAllWinHistory();
        if(this.ContentNode){
            var itemNode = this.ContentNode.getChildByName('item');


            for(var i = 0; i < list.length; i ++){ //每次加载2页，20个
                var element = list[i];
                var newnode = cc.instantiate(itemNode);
                this.itemList.push(newnode);

                newnode.getChildByName('name').getComponent(cc.Label).string = cc.dd.Utils.substr(element.playerName, 0, 6);
                newnode.getChildByName('bet').getComponent(cc.Label).string = element.bet;
                newnode.getChildByName('coin').getComponent(cc.Label).string = element.coin;
                newnode.getChildByName('allwin').getComponent(cc.Label).string = element.allName;
                newnode.getChildByName('time').getComponent(cc.Label).string = this.convertTimeDay(element.time);

                var cpt = cc.dd.Utils.seekNodeByName(newnode, "headMask").getComponent('klb_hall_Player_Head');
                cpt.initHead( element.openId, element.headUrl, 'slot_all_win_history_head_init');
                newnode.active = true;
                this.ContentNode.addChild(newnode);

                var cnt = this.itemList.length;
                //界面排列
                var y = (cnt-0.5)*this.itemHeight + (cnt-1)*this.spaceY;
                newnode.y = -y; 
                this.ContentNode.height = cnt*this.itemHeight+(cnt+1)*this.spaceY;       
            }

            this.scrollView.node.on('scroll-ended', this.onScrollEnded.bind(this), this);
        }
    },


        //动态加载
    loadScrollRecode: function(){
        this.start_indx += 1;
        gSlotMgr.getAllWinOrOnlineList(2, this.start_indx);
        return;
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
                this.move_y = this.ContentNode.y;
                this.loadScrollRecode();
            }
        }        
    },
    /**
     * 转换时间
     */
    convertTimeDay:function (t) {
        var date = new Date(t*1000);
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }

        var currentdate = month + '月' + strDate + '日';
        return currentdate;
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
